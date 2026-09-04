@echo off
title CareFlow AI Hospital Platform - Windows Desktop Launcher
color 0A
cls

echo ================================================================
echo           CareFlow AI - Windows 11 Desktop Edition
echo ================================================================
echo.
echo [1/2] Detecting Windows Browser Engine (Edge / Chrome)...

set TARGET_URL=http://localhost:5173/careflow-windows.html
set FALLBACK_FILE=%~dp0careflow-windows.html

REM Check if Microsoft Edge is available
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    echo [2/2] Launching with Microsoft Edge App Mode...
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%" --window-size=1280,850
    goto DONE
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    echo [2/2] Launching with Microsoft Edge App Mode...
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%" --window-size=1280,850
    goto DONE
)

REM Check if Google Chrome is available
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    echo [2/2] Launching with Google Chrome App Mode...
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%" --window-size=1280,850
    goto DONE
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    echo [2/2] Launching with Google Chrome App Mode...
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%" --window-size=1280,850
    goto DONE
)

REM Fallback default browser
echo [2/2] Opening default browser...
start "" "%FALLBACK_FILE%"

:DONE
echo.
echo CareFlow AI Desktop window launched successfully!
echo Press any key to exit this console.
pause >nul
