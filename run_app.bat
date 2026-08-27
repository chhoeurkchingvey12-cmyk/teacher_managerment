@echo off
chcp 65001 > nul
title វិទ្យាល័យសម្ដេចឪ - Local Server
echo =====================================================================
echo    កំពុងដំណើរការ Server សម្រាប់ប្រព័ន្ធគ្រប់គ្រងវិទ្យាល័យសម្ដេចឪ...
echo =====================================================================
echo.
echo កំពុងបើកដំណើរការ Server តាមរយៈ PowerShell (មិនចាំបាច់មាន Python ឡើយ)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
