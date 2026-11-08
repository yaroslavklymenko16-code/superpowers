#!/usr/bin/env bash
# Rebuilds Creator Quest and deploys it to https://creator-quest.pages.dev
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 build/build_app.py > /dev/null
mkdir -p deploy/site
python3 - <<'PY'
s = open('dist/Creator-Quest/Creator Quest.html', encoding='utf-8').read()
s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex, nofollow">', 1)
open('deploy/site/index.html', 'w', encoding='utf-8').write(s)
open('deploy/site/robots.txt', 'w').write("User-agent: *\nDisallow: /\n")
open('deploy/site/_headers', 'w').write("/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n")
PY
npx --yes wrangler@3 pages deploy deploy/site --project-name creator-quest --branch main --commit-dirty=true
