#!/usr/bin/env bash

MAIN_CMD="npx -y start-server-and-test"
BASE_URL="http://localhost:3000/api/books"
RUN_CMD="bash ./scripts/bench/run.sh"
TEST_RESULT=1
COMPARE_RESULT=1

function run_test {
    if [ -z $1 ]; then
        echo please provide start argument
        exit 1
    fi

    if [ -z $2 ]; then
        echo please provide report name
        exit 1
    fi

    local CMD="$MAIN_CMD \"yarn start $1\" $BASE_URL \"$RUN_CMD $2\""
    
    $CMD
    
    TEST_RESULT=$?
}

function run_compare {
    if [ -z $1 ]; then
        echo please provide report to compare
        exit 1
    fi

    local CMD="python3 ./locust/process_reports.py $1"
    
    $CMD
    
    COMPARE_RESULT=$?
}

if [ "$1" == "compare" ]; then
    run_compare $2
    exit $COMPARE_RESULT
elif [ "$1" == "test" ]; then
    run_test $2 $3
    exit $TEST_RESULT
else
    echo "please provide either test or compare"
    exit 1
fi
