#!/bin/bash
# Deploy the site to CloudBase.
#
# Why this exists: `tcb deploy` asks two questions — whether to overwrite the
# existing app, and which path to deploy to — and the second one matters. Its
# default, /gogba-doc, is the app that gogba.xyz actually serves; answering
# anything else publishes to a path nobody reads. A stray `app` service was
# created that way once and sat there serving a stale copy for days.
#
# `tcb hosting deploy` is the wrong command here despite sounding right: it
# uploads files with no build and no version history, ignores app.ignore in
# cloudbaserc.json, and walks .git looking for write permission it does not
# need. Use this script.

set -e

cd "$(dirname "${BASH_SOURCE[0]}")/.."

./scripts/check.sh

# The prompts are answered by expect rather than a pipe: tcb reads them from
# the terminal, so piped input is simply discarded and the deploy stalls.
command -v expect >/dev/null || {
    echo "✗ expect not installed: brew install expect"
    exit 1
}

# The environment is pinned: run from elsewhere, or with several environments
# on the account, tcb stops to ask which one and the deploy hangs unanswered.
#
# Each prompt is awaited in sequence rather than in one exp_continue loop. That
# loop re-matched the overwrite question against output still in the buffer and
# sent a second "y", which landed in the path field as "yy" and was rejected.
expect <<'EXP'
set timeout 900
spawn tcb deploy --env-id gogba-license-d6gl8myhy2ea32f64

# Only when the app already exists; a first deploy goes straight to the path.
expect {
    -re {Overwrite and update[^\r\n]*} { send "y\r" }
    -re {Deployment path[^\r\n]*}      { send "\r"; set answered 1 }
    timeout { puts stderr "\n^ timed out waiting for the first prompt"; exit 1 }
}

if {![info exists answered]} {
    expect {
        -re {Deployment path[^\r\n]*} { send "\r" }
        timeout { puts stderr "\n^ timed out waiting for the path prompt"; exit 1 }
    }
}

# The build runs server-side and its log streams until the process ends.
expect eof
catch wait result
exit [lindex $result 3]
EXP
