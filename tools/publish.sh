#!/usr/bin/env sh

# Based off scripts from platform/platform
# Ideally this functionality will be available in the kube-deploy image

# User specified as parameter or assume project name
CHART=${1:-$CI_PROJECT_NAME}
if [ -z "$CHART" ]; then
  echo "Couldn't find chart to publish"
  exit 1
fi

VERSION=`cat build.version`
if [ -z "$VERSION" ]; then
  echo "Missing 'build.version' file"
  exit 1
fi

echo "Setting chart $CHART to version $VERSION"
cd charts || exit $?
find . -name 'Chart.yaml' | xargs sed -i -e "s/version: .*/version: $VERSION/g" || exit $?
find . -name 'values.yaml' | xargs sed -i -e "s/imageTag: .*/imageTag: $VERSION/g" || exit $?

echo 'Removing existing chart builds'
rm *.tgz
echo

/kube/helmPush $CHART || exit $?
