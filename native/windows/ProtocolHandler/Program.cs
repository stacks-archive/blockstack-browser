using System;
using System.IO;
using System.IO.Pipes;
using System.Text;
using System.Windows.Forms;

namespace ProtocolHandler
{
    public class Program
    {
        static String BLOCKSTACK_PROTOCOL_PART = "blockstack:";
        const string BLOCKSTACK_PROTOCOL_HANDLER_PIPE = "BLOCKSTACK_PROTOCOL_HANDLER_PIPE";

        static void Main(String[] args)
        {
            if (args.Length < 1 || args[0].Length < BLOCKSTACK_PROTOCOL_PART.Length)
                return;

            try
            {
                using (var pipeClient = new NamedPipeClientStream(".", BLOCKSTACK_PROTOCOL_HANDLER_PIPE, PipeDirection.Out))
                {
                    // Connect to the main Blockstack process.
                    pipeClient.Connect(1500);
                    using (var sr = new StreamWriter(pipeClient, Encoding.UTF8))
                    {
                        sr.Write(args[0]);
                    }
                }
            }
            catch
            {
                // TODO: This used to launch the system web browser to http://localhost:8888 
                //       which would simply fail to load if the Blockstack app was not running.
                //       Now that we can detect when its not running, should be start the process
                //       for the user?
                MessageBox.Show("Blockstack does not appear to be running.");
                throw;
            }

        }

    }
}
