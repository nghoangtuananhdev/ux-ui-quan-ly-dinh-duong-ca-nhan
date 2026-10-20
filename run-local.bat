@echo off
chcp 65001 >nul
title NutriDaily - Khoi dong ung dung

echo ========================================================
echo   NutriDaily - He thong Prototype tuong tac
echo   Dang khoi dong server va mo trinh duyet...
echo ========================================================
echo.

cd /d "%~dp0"

:: Bo sung cac duong dan Node.js pho bien vao PATH neu thieu
set "PATH=%LOCALAPPDATA%\Programs\node;C:\Program Files\nodejs;%APPDATA%\npm;%PATH%"

:: Kiem tra Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] May tinh chua co Node.js hoac chua duoc them vao PATH.
    echo Vui long cai dat tai: https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Kiem tra thu vien, neu chua co thi cai dat
if exist "node_modules\.bin\vite.cmd" goto READY_TO_RUN

echo [THONG BAO] Dang cai dat thu vien lan dau, vui long cho...
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
    call pnpm install
) else (
    call npm install
)

if %errorlevel% neq 0 (
    echo.
    echo [LOI] Cai dat thu vien that bai!
    pause
    exit /b 1
)

:READY_TO_RUN
echo [OK] He thong da san sang.
echo [OK] Dang mo trinh duyet tai: http://localhost:8443
echo.
echo ========================================================
echo   SERVER DANG CHAY - KHONG TAT CUA SO NAY KHI DANG DUNG
echo   De dung server: Nhan to hop phim Ctrl + C
echo ========================================================
echo.

:: Tu dong kich hoat trinh duyet mac dinh mo giao dien
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:8443'"

:: Chay Vite dev server kem co --open
if exist "node_modules\.bin\vite.cmd" (
    call "node_modules\.bin\vite.cmd" --host 0.0.0.0 --port 8443 --open
) else (
    call npm run dev -- --open
)

echo.
echo [THONG BAO] Server da dung.
pause
