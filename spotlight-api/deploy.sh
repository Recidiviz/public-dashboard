#!/usr/bin/env bash
# Deploys the Spotlight API to App Engine, then deletes old versions that get no
# traffic, keeping the newest VERSIONS_TO_KEEP of them for rollback.
#
# Usage: ./deploy.sh <staging|production> <gcp_project_id>
#
# Reads gae-<env>.yaml from this directory (copy it from gae.yaml.example).
#
# gcloud's --stop-previous-version does not stop versions that use automatic
# scaling, so an old version with min_instances keeps an idle instance running
# until it is deleted.
set -euo pipefail

VERSIONS_TO_KEEP=2

if [[ $# -ne 2 || ! "$1" =~ ^(staging|production)$ ]]; then
  echo "Usage: $0 <staging|production> <gcp_project_id>" >&2
  exit 1
fi

ENV="$1"
PROJECT="$2"
cd "$(dirname "$0")"
CONFIG="gae-${ENV}.yaml"

if [[ ! -f "$CONFIG" ]]; then
  echo "Error: $CONFIG not found. Copy gae.yaml.example and fill it in." >&2
  exit 1
fi

# App Engine uses the "default" service when the yaml names none.
SERVICE="$(sed -n 's/^service:[[:space:]]*\([^[:space:]#]*\).*/\1/p' "$CONFIG")"
SERVICE="${SERVICE:-default}"

if ! grep -q '^[[:space:]]*max_instances:' "$CONFIG"; then
  echo "Warning: $CONFIG has no automatic_scaling.max_instances, so scaling is" >&2
  echo "uncapped and Vanta's App Engine autoscaling test will fail." >&2
fi

echo "Deploying $SERVICE to $PROJECT from $CONFIG..."
gcloud app deploy "$CONFIG" --project="$PROJECT" --quiet

echo "Looking for old $SERVICE versions with no traffic..."
# A read loop rather than mapfile, which macOS's bash 3.2 lacks.
OLD_VERSIONS=()
while IFS= read -r version; do
  [[ -n "$version" ]] && OLD_VERSIONS+=("$version")
done < <(
  gcloud app versions list \
    --project="$PROJECT" \
    --service="$SERVICE" \
    --filter="traffic_split=0" \
    --sort-by="~version.createTime" \
    --format="value(version.id)" |
    tail -n "+$((VERSIONS_TO_KEEP + 1))"
)

if [[ ${#OLD_VERSIONS[@]} -eq 0 ]]; then
  echo "No old versions to delete."
  exit 0
fi

echo "Deleting ${#OLD_VERSIONS[@]} old version(s): ${OLD_VERSIONS[*]}"
# The new version is already live, so a failed cleanup only warns.
if ! gcloud app versions delete "${OLD_VERSIONS[@]}" \
  --project="$PROJECT" --service="$SERVICE" --quiet; then
  echo "Warning: could not delete old versions; delete them in the console." >&2
fi
