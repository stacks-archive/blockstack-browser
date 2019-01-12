@if not defined _echo echo off

REM Finds and invokes msbuild.exe with the arguments passed to this script.
REM Requires Visual Studio 2017 to be installed.
REM See https://github.com/Microsoft/vswhere for details.

set msbuild_dir="MSBuild\15.0\Bin\MSBuild.exe"
set vswhere="%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"

if not exist %vswhere% (
  echo "vswhere.exe not found. Is Visual Studio 2017 installed?"
  exit /b 2
)

for /f "usebackq delims=" %%i in (`%vswhere% -latest -property installationPath`) do (
  if exist "%%i\%msbuild_dir%" (
    "%%i\%msbuild_dir%" %*
    exit /b
  ) else if not exist "%%i\%msbuild_dir%" (
    echo "MSBuild.exe not found"
    exit /b 2
  )
)