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
expect <<'EXP'
set timeout 900
spawn tcb deploy --env-id gogba-license-d6gl8myhy2ea32f64
expect {
    -re {Overwrite and update.*}  { send "y\r"; exp_continue }
    -re {Deployment path.*}       { send "\r";  exp_continue }
    eof
}
catch wait result
exit [lindex $result 3]
EXP
