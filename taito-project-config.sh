#!/bin/bash
# shellcheck disable=SC2034

##########################################################################
# Project specific settings
##########################################################################

# Environments: In the correct order (e.g. dev test stag canary prod)
taito_environments="${template_default_environments:?}"

# Basic auth: Uncomment the line below to disable basic auth from ALL
# environments. Use taito-env-prod-config.sh to disable basic auth from prod
# environment only.
# taito_basic_auth_enabled=false

# Service account: Uncomment the line below to always create GCP service account
# gcp_service_account_enabled=true

# ------ Stack ------

# Stack
taito_targets=" admin client graphql database function kafka redis server storage worker www zookeeper "
taito_storages="$taito_random_name-$taito_env"
taito_networks="default"

# Stack target types ('container' by default)
taito_target_type_database=database
taito_target_type_function=function

# Stack uptime monitoring
taito_uptime_targets=" admin client graphql server www "
taito_uptime_paths=" /admin/uptimez /uptimez /graphql/uptimez /api/uptimez /docs/uptimez "
taito_uptime_timeouts=" 5s 5s 5s 5s 5s "

# ------ Links ------
# Add custom links here. You can regenerate README.md links with
# 'taito project docs'.

link_urls="
  * client[:ENV]=$taito_app_url Application GUI (:ENV)
  * admin[:ENV]=$taito_app_url/admin/ Admin GUI (:ENV)
  * server[:ENV]=$taito_app_url/api/uptimez Server API (:ENV)
  * apidocs[:ENV]=$taito_app_url/api/docs API Docs (:ENV)
  * www[:ENV]=$taito_app_url/docs Generated documentation (:ENV)
  * graphql[:ENV]=$taito_app_url/graphql/uptimez GraphQL API (:ENV)
  * git=https://$taito_vc_repository_url Git repository
"
# Example links:
# * styleguide=https://styleguide UI/UX style guide and designs
# * wireframes=https://wireframes UI/UX wireframes
# * feedback=https://feedback User feedback
# * performance=https://performance Performance metrics

# ------ Secrets ------
# Configuration instructions:
# https://taitounited.github.io/taito-cli/tutorial/06-env-variables-and-secrets/

taito_remote_secrets="
  $taito_project-$taito_env-basic-auth.auth:htpasswd-plain
  $taito_project-$taito_env-scheduler.secret:random
"
taito_secrets="
  $db_database_app_secret:random
  $taito_project-$taito_env-storage-gateway.secret:random
  $taito_project-$taito_env-example.secret:manual
"

# Define database mgr password for automatic CI/CD deployments
if [[ $ci_exec_deploy == "true" ]]; then
  taito_remote_secrets="
    $taito_remote_secrets
    $db_database_mgr_secret/devops:random
  "
fi