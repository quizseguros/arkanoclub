@echo off
chcp 65001 >nul
title Arkano Club - Gerar site real (arkanoclub.com)
color 0E
cd /d "%~dp0"

echo.
echo  ================================================
echo    ARKANO CLUB - Gerar arquivos do site real
echo    (arkanoclub.com, hospedagem Hostinger)
echo  ================================================
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Node.js nao encontrado neste computador.
    echo  Baixe e instale em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo  Primeira vez por aqui. Instalando o site...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  [ERRO] Falha ao instalar dependencias.
        pause
        exit /b 1
    )
)

echo  Gerando os arquivos... isso leva cerca de um minuto.
echo.

set EXPORT_ESTATICO=1
call npm run build
if errorlevel 1 (
    echo.
    echo  [ERRO] A geracao falhou. Nada foi alterado na hospedagem.
    echo.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo   Pronto! Os arquivos estao na pasta "out".
echo.
echo   Agora e so subir o CONTEUDO da pasta "out"
echo   pro Gerenciador de Arquivos da Hostinger,
echo   dentro de public_html (substituindo o que
echo   estiver la).
echo  ================================================
echo.

start "" "%~dp0out"
pause
