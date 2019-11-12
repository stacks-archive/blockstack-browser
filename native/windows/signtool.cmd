@if not defined _echo echo off
setlocal enabledelayedexpansion

REM Finds and invokes signtool.exe with the arguments passed to this script.

set signtool_search="%ProgramFiles(x86)%\Windows Kits\10\bin\10*\x86\signtool.exe"

for /f "usebackq delims=" %%i in (`powershell -command "& { @((Resolve-Path -Path \"%signtool_search%\").Path)[0] }"`) do (
  echo Using signtool: %%i
  set signtool_path=%%i
  goto found_signtool
)
echo signtool.exe not found
exit /b 2

:found_signtool
"%signtool_path%" %*
exit /b !errorlevel!
