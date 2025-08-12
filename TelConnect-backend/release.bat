@echo off
setlocal enabledelayedexpansion

REM Function to run a command and check its success
call :run_step "git checkout main" || goto :fail
call :run_step "git pull origin main" || goto :fail
call :run_step "git merge dev" || goto :fail
call :run_step "git push origin main" || goto :fail
call :run_step "git tag v3.0.0" || goto :fail
call :run_step "git push origin v3.0.0" || goto :fail
call :run_step "git checkout dev" || goto :fail

echo  All steps completed successfully!
goto :eof

:run_step
echo Running: %~1
%~1
if errorlevel 1 (
    echo  Step failed: %~1
    exit /b 1
) else (
    echo  Step succeeded: %~1
)
goto :eof

:fail
echo  Script terminated.
exit /b 1
