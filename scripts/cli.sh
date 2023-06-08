#!/usr/bin/env bash

source ./scripts/scope.sh

main "${@:2}"

result="$LERNA_SCOPE_RESULT yarn run $1"

$result

CODE=$?

exit $CODE
