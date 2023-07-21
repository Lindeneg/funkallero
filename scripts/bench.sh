#!/usr/bin/env bash

LATEST="./locust/report/latest.json"

CMD="python3 -m locust --headless --json -f ./locust/main.py --users 20 --spawn-rate 5 --run-time 1m --stop-timeout 10s -H http://localhost:3000/api"

$CMD > $LATEST

CODE=$?

if [ $CODE -eq 0 ]; then
    python3 ./locust/report/process_reports.py
else
    exit $CODE
fi
