@echo off
chcp 65001 >nul
title Arkano Club - Site (previa local)
color 0A
cd /d "%~dp0"

echo.
echo  ================================================
echo    ARKANO CLUB - Site (previa local)
echo  ================================================
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Node.js nao encontrado neste computador.
    echo.
    echo  Baixe e instale em: https://nodejs.org
    echo  Depois execute este arquivo novamente.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo  Primeira vez por aqui. Instalando o site...
    echo  Isso pode levar alguns minutos, so acontece uma vez.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  [ERRO] Falha ao instalar dependencias.
        pause
        exit /b 1
    )
)

echo  Iniciando o site...
start /min "" cmd /c "npm run dev"

echo  Aguardando o servidor ficar pronto...
:WAITLOOP
timeout /t 2 /nobreak >nul
powershell -Command "try { (New-Object Net.WebClient).DownloadString('http://localhost:3000') | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 goto WAITLOOP

echo  Pronto! Abrindo o site...
echo.

where chrome >nul 2>&1
if not errorlevel 1 (
    start chrome --app=http://localhost:3000 --window-size=1440,900
    goto END
)

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000 --window-size=1440,900
    goto END
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000 --window-size=1440,900
    goto END
)

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3000 --window-size=1440,900
    goto END
)

start http://localhost:3000

:END
echo  ================================================
echo   Site rodando! Essa e a previa local (mudancas
echo   ainda nao publicadas). Pode fechar esta janela
echo   preta a qualquer momento - o site continua aberto.
echo  ================================================
echo.
pause
