using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace BlockstackBrowser
{

    /*
     * For more information on the parent process detection going on here, see:
     * https://stackoverflow.com/a/16756808/794962
     * https://stackoverflow.com/a/48319879/794962
     * 
     */

    static class ParentProcess
    {

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern IntPtr OpenProcess(int access, bool inherit, int processId);

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern IntPtr CloseHandle(IntPtr handle);

        public static string GetParentProcessFile()
        {
            var currentProcess = Process.GetCurrentProcess();
            var parentProcID = ParentProcessId((uint)currentProcess.Id);
            var parentProcFileName = GetProcessName(parentProcID);
            return parentProcFileName;
        }

        static string GetProcessName(int processID)
        {
            const int PROCESS_QUERY_INFORMATION = 0x0400;
            var procHandle = OpenProcess(PROCESS_QUERY_INFORMATION, false, processID);
            if (procHandle == IntPtr.Zero)
            {
                throw new Win32Exception();
            }
            try
            {
                return QueryFullProcessImageName(procHandle);
            }
            finally
            {
                CloseHandle(procHandle);
            }
        }


        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool QueryFullProcessImageName([In] IntPtr hProcess, [In] uint dwFlags, [Out] StringBuilder lpExeName, [In, Out] ref uint lpdwSize);

        static string QueryFullProcessImageName(IntPtr processHandle)
        {
            const int buffer = 1024;
            var fileNameBuilder = new StringBuilder(buffer);
            uint bufferLength = (uint)fileNameBuilder.Capacity + 1;
            var success = QueryFullProcessImageName(processHandle, 0, fileNameBuilder, ref bufferLength);
            if (!success)
            {
                throw new Win32Exception();
            }
            return fileNameBuilder.ToString();
        }

        public static int ParentProcessId(uint id)
        {
            const int ERROR_NO_MORE_FILES = 0x12;
            const uint SNAPSHOT_FLAG_PROCESS = 0x00000002;
            PROCESSENTRY32 pe32 = new PROCESSENTRY32();
            pe32.dwSize = (uint)Marshal.SizeOf<PROCESSENTRY32>();
            var hSnapshot = CreateToolhelp32Snapshot(SNAPSHOT_FLAG_PROCESS, id);
            if (hSnapshot == new IntPtr(-1))
            {
                throw new Win32Exception();
            }
            try
            {
                if (!Process32First(hSnapshot, ref pe32))
                {
                    int errno = Marshal.GetLastWin32Error();
                    if (errno == ERROR_NO_MORE_FILES)
                        return -1;
                    throw new Win32Exception(errno);
                }
                do
                {
                    if (pe32.th32ProcessID == id)
                    {
                        return (int)pe32.th32ParentProcessID;
                    }
                } while (Process32Next(hSnapshot, ref pe32));
            }
            finally
            {
                CloseHandle(hSnapshot);
            }
            return -1;
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr CreateToolhelp32Snapshot(uint flags, uint id);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool Process32First(IntPtr hSnapshot, ref PROCESSENTRY32 lppe);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool Process32Next(IntPtr hSnapshot, ref PROCESSENTRY32 lppe);

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESSENTRY32
        {
            public uint dwSize;
            public uint cntUsage;
            public uint th32ProcessID;
            public IntPtr th32DefaultHeapID;
            public uint th32ModuleID;
            public uint cntThreads;
            public uint th32ParentProcessID;
            public int pcPriClassBase;
            public uint dwFlags;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 260)]
            public string szExeFile;
        };


        /*
         *  The technique below is more straightforward but uses undocumented Windows APIs
         *  with warnings about the specific field it uses.
         *  See: https://docs.microsoft.com/en-us/windows/desktop/api/winternl/nf-winternl-ntqueryinformationprocess
         *   > NtQueryInformationProcess may be altered or unavailable in future versions of Windows. 
         *   > Applications should use the alternate functions listed in this topic.
         *   
         *   The field that contains the parent ID is officially documented as `Reserved3`
         */

        /*
        
        public static string GetParentProcessFile()
        {
            var currentProcess = Process.GetCurrentProcess();
            var parentProcID = ProcessInformation.Query(currentProcess.Handle).InheritedFromUniqueProcessId.ToInt32();
            var parentProcFileName = GetProcessName(parentProcID);
            return parentProcFileName;
        }
        

        [StructLayout(LayoutKind.Sequential)]
        struct ProcessInformation
        {
            internal IntPtr Reserved1;
            internal IntPtr PebBaseAddress;
            internal IntPtr Reserved2_0;
            internal IntPtr Reserved2_1;
            internal IntPtr UniqueProcessId;
            internal IntPtr InheritedFromUniqueProcessId;

            [DllImport("ntdll.dll")]
            private static extern int NtQueryInformationProcess(IntPtr processHandle, int processInformationClass, ref ProcessInformation processInformation, int processInformationLength, out int returnLength);

            public static ProcessInformation Query(IntPtr processHandle)
            {
                ProcessInformation procInfo = new ProcessInformation();
                int status = NtQueryInformationProcess(processHandle, 0, ref procInfo, Marshal.SizeOf(procInfo), out int returnLength);
                if (status != 0)
                    throw new Win32Exception(status);
                return procInfo;
            }
        }
        */
    }
}
