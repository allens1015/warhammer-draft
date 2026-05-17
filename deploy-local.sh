#!/bin/bash
set -e

DRUPAL_ASSETS=~/GitHub/rpgbookshelf/web/modules/custom/rpgbookshelf_tools/tools/warhammer-draft/assets

VITE_BASE_URL=/modules/custom/rpgbookshelf_tools/tools/warhammer-draft/ npm run build

cp -r dist/assets/. "$DRUPAL_ASSETS/"

echo "Deployed to $DRUPAL_ASSETS"