"""Builds the sales page with screenshots embedded, as an artifact fragment and a standalone file.

Run:  python3 build/build_site.py  (screenshots live in build/img/)
"""
import base64, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(ROOT, *p)

def data_uri(name):
    with open(J("build", "img", name), "rb") as fh:
        return "data:image/jpeg;base64," + base64.b64encode(fh.read()).decode()

page = open(J("site", "template.html"), encoding="utf-8").read()
for key, name in {"IMG_MAP": "shot-map.jpg", "IMG_BUG": "shot-bug.jpg", "IMG_VAULT": "shot-vault.jpg", "IMG_STRIP": "strip.jpg"}.items():
    page = page.replace("{{" + key + "}}", data_uri(name))
assert "{{" not in page

open(J("site", "index.html"), "w", encoding="utf-8").write(page)
open(J("site", "creator-mode-site.html"), "w", encoding="utf-8").write(
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<style>body{margin:0}[hidden]{display:none!important}</style>\n</head>\n<body>\n' + page + '\n</body>\n</html>\n')
print("site:", os.path.getsize(J("site", "index.html")) // 1024, "KB")
