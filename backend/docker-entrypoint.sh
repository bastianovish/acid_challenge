#!/bin/sh
set -e
unset BUNDLE_PATH
unset BUNDLE_BIN

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

#rake db:create
#rake db:migrate

exec bundle exec "$@"
