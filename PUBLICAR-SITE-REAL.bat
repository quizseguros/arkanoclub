@echo off
chcp 65001 >nul
title Arkano Club - Publicar no arkanoclub.com
color 0E
cd /d "%~dp0"

echo.
echo  ================================================
echo    ARKANO CLUB - Publicar no site real
echo    (arkanoclub.com, hospedagem Hostinger)
echo  ================================================
echo.

if not exist ".env.ftp" (
    echo  [ERRO] Falta o arquivo .env.ftp com o acesso FTP da Hostinger.
    echo  Veja as instrucoes no topo de scripts\publicar-hostinger.mjs
    echo.
    pause
    exit /b 1
)

echo  Gerando os arquivos... isso leva cerca de um minuto.
set EXPORT_ESTATICO=1
call npm run build
if errorlevel 1 (
    echo.
    echo  [ERRO] A geracao falhou. Nada foi enviado.
    pause
    exit /b 1
)

echo.
echo  Enviando pro arkanoclub.com...
node scripts\publicar-hostinger.mjs
if errorlevel 1 (
    echo.
    echo  [ERRO] O envio falhou. Rode de novo: ele continua de onde parou.
    pause
    exit /b 1
)

echo.
echo  Pronto! O arkanoclub.com ja esta atualizado.
pause
