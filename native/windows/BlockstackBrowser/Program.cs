using System;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;

namespace BlockstackBrowser
{
    public class Program:Form
    {

        NotifyIcon myIcon;
        System.ComponentModel.Container container;
        ContextMenu contextMenu;
        Process browserProxy, corsProxy;

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

            contextMenu.MenuItems.AddRange(
                new MenuItem[] { homeItem, exitItem });
            myIcon.ContextMenu = contextMenu;

            //deleteAndUnpackFiles();

            RunBlockstackBrowser();
            RunCORSProxy();
            this.homeOpen(null, null);
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
            Process.Start("http://localhost:8888/");
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
            String blockstackCommand = "Resources\\blockstackProxy.js 8888 Resources\\build";
            this.browserProxy = ShellOut(blockstackCommand);
        }

        private void RunCORSProxy()
        {
            String proxyCommand = "Resources\\cors-proxy\\corsproxy.js 0 0 0.0.0.0";
            this.corsProxy = ShellOut(proxyCommand);
        }
    }
}
