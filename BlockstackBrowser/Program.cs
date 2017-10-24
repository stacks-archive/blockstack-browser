using System;
using System.Windows.Forms;
using System.Diagnostics;

namespace BlockstackBrowser
{
    public class Program:Form
    {

        NotifyIcon myIcon;
        System.ComponentModel.Container container;
        ContextMenu contextMenu;
        Process browserProxy, corsProxy;

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Program());
        }

        public Program()
        {
            container = new System.ComponentModel.Container();

            myIcon = new NotifyIcon(container);
            myIcon.Visible = true;
            myIcon.Icon = new System.Drawing.Icon("blockstack.ico");

            myIcon.BalloonTipText = "Blockstack Browser";
            myIcon.Text = "Blockstack Browser";

            contextMenu = new ContextMenu();

            MenuItem exitItem = new MenuItem();
            exitItem.Index = 0;
            exitItem.Text = "E&xit";
            exitItem.Click += new System.EventHandler(this.exitRequest);
            MenuItem homeItem = new MenuItem();

            contextMenu.MenuItems.AddRange(
                new MenuItem[] { exitItem, homeItem });
            myIcon.ContextMenu = contextMenu;

            RunBlockstackBrowser();
            RunCORSProxy();
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
            startInfo.FileName = "node.exe";
            startInfo.Arguments = command;
            process.StartInfo = startInfo;
            process.Start();
            return process;
        }

        private void RunBlockstackBrowser()
        {
            String blockstackCommand = "blockstackProxy.js 8888 browser-build";
            this.browserProxy = ShellOut(blockstackCommand);
        }

        private void RunCORSProxy()
        {
            String proxyCommand = "corsproxy-https\\node_modules\\corsproxy-https\\bin\\corsproxy";
            this.corsProxy = ShellOut(proxyCommand);
        }
    }
}
