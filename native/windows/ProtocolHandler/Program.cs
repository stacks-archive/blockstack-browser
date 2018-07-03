using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace ProtocolHandler
{
    public class Program
    {
        static String BLOCKSTACK_PROTOCOL_PART = "blockstack:";
        static void Main(String[] args)
        {
            if (args.Length < 1 || args[0].Length < BLOCKSTACK_PROTOCOL_PART.Length)
                return;
            String authPart = args[0].Substring(BLOCKSTACK_PROTOCOL_PART.Length);
            String urlOpen = "http://localhost:8888/auth?authRequest=" + authPart;
            Process.Start(urlOpen);
        }
    }
}
