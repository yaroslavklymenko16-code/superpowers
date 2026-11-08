"""Bundles Creator Quest into one self-contained HTML file and packages the download.

Run (after build/vault.py):  python3 build/build_app.py
Out:
  app/preview.html                       page fragment used for the Claude artifact preview
  dist/Creator-Mode/Creator Quest.html   the kid app (open in any browser)
  dist/Creator-Mode/Creator Vault/       Roblox model packs + how-to
  dist/Creator-Mode/Rescue Scripts/      tested mission scripts
  dist/Creator-Quest.zip                  what you upload to your store
"""
import glob, json, os, shutil, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(ROOT, *p)

def read(p):
    with open(p, encoding="utf-8") as fh:
        return fh.read()

def js_json(obj):
    return json.dumps(obj, separators=(",", ":")).replace("</", "<\\/")

rescue = {os.path.splitext(os.path.basename(p))[0]: read(p) for p in sorted(glob.glob(J("missions", "*.luau")))}
catalog = json.loads(read(J("build", "vault_catalog.json")))

page = read(J("app", "template.html"))
page = page.replace("/*INJECT:viewer*/", read(J("app", "viewer.js")))
page = page.replace("/*INJECT:missions*/", read(J("app", "missions.js")))
page = page.replace("/*INJECT:quests*/", read(J("app", "quests.js")))
page = page.replace("/*INJECT:figures*/", read(J("app", "figures.js")))
page = page.replace("/*INJECT:app*/", read(J("app", "app.js")))
page = page.replace("/*INJECT:data*/", "window.RESCUE=" + js_json(rescue) + ";window.VAULT=" + js_json(catalog) + ";")
assert "/*INJECT" not in page

with open(J("app", "preview.html"), "w", encoding="utf-8") as fh:
    fh.write(page)

full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}</style>\n'
        '</head>\n<body>\n' + page + '\n</body>\n</html>\n')

dist = J("dist", "Creator-Quest")
shutil.rmtree(J("dist"), ignore_errors=True)
os.makedirs(os.path.join(dist, "Creator Vault"))
os.makedirs(os.path.join(dist, "Rescue Scripts"))
with open(os.path.join(dist, "Creator Quest.html"), "w", encoding="utf-8") as fh:
    fh.write(full)
for p in glob.glob(J("vault", "*.rbxmx")):
    shutil.copy(p, os.path.join(dist, "Creator Vault"))
shutil.copy(J("vault", "README.txt"), os.path.join(dist, "Creator Vault", "README.txt"))
for name, src in rescue.items():
    with open(os.path.join(dist, "Rescue Scripts", name + ".lua"), "w", encoding="utf-8") as fh:
        fh.write(src)
for extra in ("START HERE.txt", "Parent Guide.pdf"):
    if os.path.exists(J("build", extra)):
        shutil.copy(J("build", extra), os.path.join(dist, extra))

zpath = J("dist", "Creator-Quest.zip")
with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
    for folder, _, files in os.walk(dist):
        for f in files:
            full_path = os.path.join(folder, f)
            z.write(full_path, os.path.relpath(full_path, J("dist")))
print("app:", len(full) // 1024, "KB  zip:", os.path.getsize(zpath) // 1024, "KB")
for folder, _, files in os.walk(dist):
    for f in sorted(files):
        print("  ", os.path.relpath(os.path.join(folder, f), J("dist")))
