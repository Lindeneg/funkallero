#!/usr/bin/env bash

failure=0

function generate {
    npx -y prisma@4.16.2 generate
}

function build {
    result="yarn build:all"
    
    $result
    
    failure=$?
}

build

if [ "$failure" -ne 0 ]; then
    generate
    
    build
    
    exit $failure
fi

exit 0
