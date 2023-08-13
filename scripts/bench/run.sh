#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo "please supply a report name"
    exit 1
fi

REPORT_FILE="./locust/report/$1.json"

echo saving report to $REPORT_FILE

CMD="python3 -m locust --logfile=./locust/logs/locustfile.log --headless --json -f ./locust/locustfile.py --users 100 --spawn-rate 5 --run-time 1m --stop-timeout 10s -H http://localhost:3000/api"

$CMD > $REPORT_FILE

CODE=$?

exit $CODE
