using System;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Globalization;
using System.Threading;
using System.IO.Pipes;
using System.Text;

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
        static string BLOCKSTACK_PROTOCOL_PART = "blockstack:";

        bool isDebugModeEnabled = false;

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Program());
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
            myIcon.Icon = new System.Drawing.Icon("Resources\\blockstack.ico");

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
                debugItem.Text = (isDebugModeEnabled ? "Disable" : "Enable") + " Debug Mode";
                debugItem.Visible = isCtrlClicked;
            };

            contextMenu.MenuItems.AddRange(
                new MenuItem[] { homeItem, exitItem, debugItem });
            myIcon.ContextMenu = contextMenu;

            //deleteAndUnpackFiles();
            
            RunBlockstackBrowser();
            RunCORSProxy();
            StartProtocolHandlerListenerThread();
            this.homeOpen(null, null);
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
            }).Start();
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
                    ProcessProtocolUriReceived(clientData);
                    
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

        void ProcessProtocolUriReceived(string data)
        {
            string authPart = data.Substring(BLOCKSTACK_PROTOCOL_PART.Length);
            string port = GetPortalPort();
            string urlOpen = $"http://localhost:{port}/auth?authRequest=" + authPart;
            Process.Start(urlOpen);
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
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            startInfo.FileName = "Resources\\node.exe";
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
