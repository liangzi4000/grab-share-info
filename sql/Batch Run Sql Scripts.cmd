@ECHO OFF
for /f "usebackq delims=" %%i in (`dir *.sql /s /b`) do (
rem  echo %%i.csv
  SQLCMD -S "." -d Playground -i "%%i" -o "%%i.rpt"
  Echo Completed Script: %%i
)
pause