#!/bin/sh

# You can execute CLI commands manually with
# `taito exec:server:ENV ./execute COMMAND [ARGS]` or you can schedule
# execution with cronjobs (see `scripts/helm/examples.yaml` for examples).

if [ -f ./src/commands.js ]; then
  # Production
  node ./src/commands.js ${@}
else
  # Development
  npx ts-node -T ./src/commands.ts ${@}
fi
