#!/bin/bash -e

: "${template_project_path:?}"

echo
./scripts/taito-template/init.sh

# Copy files from template to project
yes | cp CONFIGURATION.md "${template_project_path}"
yes | cp DEVELOPMENT.md "${template_project_path}"
yes | cp cloudbuild.yaml "${template_project_path}"

mkdir -p "${template_project_path}/scripts/helm"
yes | cp -r "scripts/helm/requirements.yaml" \
  "${template_project_path}/scripts/helm/requirements.yaml" 2> /dev/null

echo
echo
echo "--- Manual steps ---"
echo
echo "Do the following:"
echo "- Remove extra images from the beginning of the cloudbuild.yaml file"
echo "- Recommended: Upgrade source image(s) in all Dockerfiles (FROM ...)."
echo "  Note that there might be multiple FROM clauses in the same file."
echo "- Recommended: Upgrade all libraries"
echo
echo "If something stops working, try the following:"
echo "- Run 'taito --upgrade' to upgrade your taito-cli"
echo "- Compare scripts/helm*.yaml with the template"
echo "- Compare taito-config.sh with the template"
echo "- Compare package.json with the template"
echo
