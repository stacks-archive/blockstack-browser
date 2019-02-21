using System;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Globalization;
using System.Threading;
using System.IO.Pipes;
using System.Text;
using System.Reflection;

namespace BlockstackBrowser
{


    public class Program : Form
    {

        NotifyIcon myIcon;
        System.ComponentModel.Container container;
        ContextMenu contextMenu;
        Process browserProxy, corsProxy;

        const int productionModePortalPort = 8888;
        const int developmentModePortalPort = 3000;
        const string BLOCKSTACK_PROTOCOL_HANDLER_PIPE = "BLOCKSTACK_PROTOCOL_HANDLER_PIPE";
        const string BLOCKSTACK_PROTOCOL_PART = "blockstack:";
        const string BLOCKSTACK_APP_INSTANCE_MUTEX = "blockstackAppInstance";
        const string PIPE_INTENT_PROTOCOL = "protocol";
        const string PIPE_INTENT_OPEN = "open";

        bool isDebugModeEnabled = false;

        static Mutex appMutex;
        static bool appMutexHasHandle = false;

        [STAThread]
        static void Main()
        {
            SetupAppMutex();
            if (!appMutexHasHandle)
            {
                HandleSecondaryAppInstance();
                return;
            }

            AppDomain.CurrentDomain.ProcessExit += HandleProcessExit;
            Application.ApplicationExit += HandleProcessExit;

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            try
            {
                Application.Run(new Program());
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error running program " + ex);
                throw;
            }
        }

        // Setup a system-wide mutex so a single main app instance can be tracked. 
        static void SetupAppMutex()
        {
            appMutex = new Mutex(false, BLOCKSTACK_APP_INSTANCE_MUTEX, out bool createdNew);
            try
            {
                appMutexHasHandle = appMutex.WaitOne(0, false);
            }
            catch (AbandonedMutexException)
            {
                // If the previous app instance was force terminated and the mutex was abandoned then 
                // this instance will have aquired it.
                appMutexHasHandle = true;
            }
        }

        // Pipe app open intent-data to the main app. 
        static void HandleSecondaryAppInstance()
        {
            // Check if app was opened by the system to handle our custom protocol URI.
            if (GetProtocolUriProcessArg(out string protocolUri))
            {
                // Send the main app instance the protocol URI data
                try
                {
                    SendMessageToMainAppInstance(string.Join("|", PIPE_INTENT_PROTOCOL, GetParentProcessFilePath(), protocolUri));
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Failed to send custom protocol URI to main app instance. " + ex);
                    throw;
                }
            }
            else
            {
                // App was not opened for protocol handling, so the user just launched the app manually,
                // for example from the start menu, so notify the existing app instance the open-intent. 
                try
                {
                    SendMessageToMainAppInstance(PIPE_INTENT_OPEN);
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Failed to communicate to main app instance. " + ex);
                    throw;
                }
            }
        }

        private static void HandleProcessExit(object sender, EventArgs e)
        {
            if (appMutexHasHandle)
            {
                appMutex.ReleaseMutex();
                appMutex.Dispose();
                appMutexHasHandle = false;
            }
        }

        static string GetParentProcessFilePath()
        {
            try
            {
                return ParentProcess.GetParentProcessFile();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("Error getting parent process: " + ex);
                return string.Empty;
            }
        }

        static bool GetProtocolUriProcessArg(out string protocolUri)
        {
            var args = Environment.GetCommandLineArgs();
            if (args.Length > 1 && args[1].StartsWith(BLOCKSTACK_PROTOCOL_PART, StringComparison.InvariantCultureIgnoreCase))
            {
                protocolUri = args[1];
                return true;
            }
            protocolUri = null;
            return false;
        }

        static void SendMessageToMainAppInstance(string message)
        {
            using (var pipeClient = new NamedPipeClientStream(".", BLOCKSTACK_PROTOCOL_HANDLER_PIPE, PipeDirection.Out))
            {
                // Connect to the main Blockstack process.
                pipeClient.Connect(1500);
                using (var sr = new StreamWriter(pipeClient, Encoding.UTF8))
                {
                    sr.Write(message);
                }
            }
        }

        static void deleteAndUnpackFiles()
        {
            if (!Directory.Exists("Resources\\browser-build"))
                ZipFile.ExtractToDirectory("Resources\\browser-build.zip", "Resources");
            if (!Directory.Exists("Resources\\corsproxy-https"))
                ZipFile.ExtractToDirectory("Resources\\corsproxy-https.zip", "Resources");
        }

        public Program()
        {
            container = new System.ComponentModel.Container();

            myIcon = new NotifyIcon(container);
            myIcon.Visible = true;
            myIcon.Icon = Properties.Resources.blockstack;

            myIcon.BalloonTipText = "Blockstack Browser";
            myIcon.Text = "Blockstack Browser";

            contextMenu = new ContextMenu();

            MenuItem exitItem = new MenuItem();
            exitItem.Index = 1;
            exitItem.Text = "E&xit";
            exitItem.Click += new System.EventHandler(this.exitRequest);
            MenuItem homeItem = new MenuItem();
            homeItem.Index = 0;
            homeItem.Text = "H&ome";
            homeItem.Click += new System.EventHandler(this.homeOpen);
            MenuItem debugItem = new MenuItem();
            debugItem.Index = 2;
            debugItem.Visible = false;
            debugItem.Click += (s, e) => isDebugModeEnabled = !isDebugModeEnabled;

            contextMenu.Popup += (s, e) =>
            {
                bool isCtrlClicked = (ModifierKeys & Keys.Control) == Keys.Control;
                debugItem.Text = (isDebugModeEnabled ? "Disable" : "Enable") + " Development Mode";
                debugItem.Visible = isCtrlClicked;
            };

            contextMenu.MenuItems.AddRange(
                new MenuItem[] { homeItem, exitItem, debugItem });
            myIcon.ContextMenu = contextMenu;

            //deleteAndUnpackFiles();
            
            RunBlockstackBrowser();
            RunCORSProxy();
            StartProtocolHandlerListenerThread();
          
            if (GetProtocolUriProcessArg(out string protocolUri))
            {
                ProcessProtocolUriReceived(GetParentProcessFilePath(), protocolUri);
            }
            else
            {
                homeOpen(null, null);
            }
        }

        void StartProtocolHandlerListenerThread()
        {
            new Thread(() =>
            {
                while (true)
                {
                    try
                    {
                        StartProtocolHandlerPipeServer();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("ERROR: {0}", ex.Message);
                        // Wait 500ms then restart the pipe server.
                        Thread.Sleep(500);
                    }
                }
            }){ IsBackground = true }.Start();
        }

        void StartProtocolHandlerPipeServer()
        {
            using (var pipeServer = new NamedPipeServerStream(BLOCKSTACK_PROTOCOL_HANDLER_PIPE, PipeDirection.In, 1))
            {
                Console.WriteLine("NamedPipeServerStream object created.");

                while (true)
                {
                    // Wait for a ProtocolHandler process instance to connect.
                    Console.Write("Waiting for client connection...");
                    pipeServer.WaitForConnection();

                    Console.WriteLine("Client connected.");

                    // Read data from ProtocolHandler process.
                    var sw = new StreamReader(pipeServer, Encoding.UTF8);
                    var clientData = sw.ReadToEnd();
                    if (clientData == PIPE_INTENT_OPEN)
                    {
                        homeOpen(null, null);
                    }
                    else if (clientData.StartsWith(PIPE_INTENT_PROTOCOL, StringComparison.Ordinal))
                    {
                        var msgParts = clientData.Split(new[] { '|' }, 3);
                        ProcessProtocolUriReceived(msgParts[1], msgParts[2]);
                    }
                    else
                    {
                        // UI must be dispatched to main thread..
                        Invoke(new Action(() =>
                        {
                            MessageBox.Show("Unexpected data from another Blockstack app instance: " + clientData);
                        }));
                    }
                    
                    pipeServer.Disconnect();
                }
            }
        }
    
        string GetPortalPort()
        {
            if (isDebugModeEnabled)
            {
                return developmentModePortalPort.ToString(CultureInfo.InvariantCulture);
            }
            else
            {
                return productionModePortalPort.ToString(CultureInfo.InvariantCulture);
            }
        }

        void ProcessProtocolUriReceived(string parentProcessFilePath, string data)
        {
            string authPart = data.Substring(BLOCKSTACK_PROTOCOL_PART.Length);
            string port = GetPortalPort();
            string urlOpen = $"http://localhost:{port}/auth?authRequest=" + authPart;

            if (string.IsNullOrEmpty(parentProcessFilePath) || Path.GetFileName(parentProcessFilePath) == "explorer.exe")
            {
                Process.Start(urlOpen);
            }
            else
            {
                try
                {
                    var proc = Process.Start(parentProcessFilePath, urlOpen);
                    new Thread(() =>
                    {
                        using (proc)
                        {
                            proc.WaitForExit(1000);
                            if (proc.HasExited && proc.ExitCode < 0)
                            {
                                Console.Error.WriteLine($"Bad exit code {proc.ExitCode} from {parentProcessFilePath}");
                                Process.Start(urlOpen);
                            }
                        }
                    }).Start();
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"Error starting process {parentProcessFilePath}: {ex}");
                    Process.Start(urlOpen);
                }
            }
        }

        protected override void SetVisibleCore(bool value)
        {
            value = false;
            if (!this.IsHandleCreated)
                CreateHandle();
            
            base.SetVisibleCore(value);
        }

        private void exitRequest(object Sender, EventArgs e)
        {
            this.Close();
        }

        private void homeOpen(object Sender, EventArgs e)
        {
            string port = GetPortalPort();
            Process.Start($"http://localhost:{port}/");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (this.container != null)
                    this.container.Dispose();
                if (this.corsProxy != null && !this.corsProxy.HasExited)
                    this.corsProxy.Kill();
                if (this.browserProxy != null && !this.browserProxy.HasExited)
                    this.browserProxy.Kill();

            }
            base.Dispose(disposing);
        }

        static Process ShellOut(String command)
        {
            Process process = new Process();
            ProcessStartInfo startInfo = new ProcessStartInfo();
            string appDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            startInfo.WorkingDirectory = appDir;
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            startInfo.FileName = appDir + "\\Resources\\node.exe";
            startInfo.Arguments = command;
            process.StartInfo = startInfo;
            process.Start();

            ChildProcessTracker.AddProcess(process);

            return process;
        }

        private void RunBlockstackBrowser()
        {
            String blockstackCommand = "Resources\\blockstackProxy.js 8888";
            this.browserProxy = ShellOut(blockstackCommand);
        }

        private void RunCORSProxy()
        {
            String proxyCommand = "Resources\\cors-proxy\\corsproxy.js 0 0 localhost";
            this.corsProxy = ShellOut(proxyCommand);
        }
    }
}
