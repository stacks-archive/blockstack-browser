@if not defined _echo echo off

REM Finds and invokes msbuild.exe with the arguments passed to this script.
REM Requires Visual Studio to be installed.
REM See https://github.com/Microsoft/vswhere for details.

set vswhere="%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"

if not exist %vswhere% (
  echo "vswhere.exe not found. Is Visual Studio 2017/2019 installed?"
  exit /b 2
)

for /f "usebackq delims=" %%F in (`%vswhere% -latest -property installationPath`) do (
  set install_path=%%F
)
echo Using VS installation: %install_path%

for /f "usebackq delims=" %%F in (`dir "%install_path%\*MSBuild.exe" /s /b`) do (
  set msbuild_path=%%F
  goto found_msbuild
)
echo MSBuild.exe not found
exit /b 2

:found_msbuild
echo using msbuild: %msbuild_path%
"%msbuild_path%" %*
exit /b !errorlevel!
