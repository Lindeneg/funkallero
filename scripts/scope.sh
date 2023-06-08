#!/usr/bin/env bash

LERNA_SCOPE=""

PREFIX="@lindeneg/funkallero"

LERNA_SCOPE_RESULT=""

function build_scopes () {
    local SCOPES=()
    for arg in "$@"
    do
        if [[ "$arg" != "funkallero" ]]
        then
            SCOPES+=( "$PREFIX-$arg" )
        else
            SCOPES+=( "$PREFIX" )
        fi
    done
    local SCOPES_STR="${SCOPES[*]}"
    LERNA_SCOPE="{$(echo $SCOPES_STR} | sed 's/\s/,/g')"
}

function build_scope () {
    local S="$PREFIX$1"
    LERNA_SCOPE=$S
}

function main () {
    if [[ $# -eq 0 ]]
    then
        PREFIX="@lindeneg/"
        build_scope "*"
    elif [[ $# -eq 1 ]]
    then
        if [[ "$1" != "funkallero" ]]
        then
            build_scope "-$1"
        else
            build_scope ""
        fi
    else
        build_scopes $@
    fi
    
    LERNA_SCOPE_RESULT="yarn lerna exec --scope '$LERNA_SCOPE'"
}
