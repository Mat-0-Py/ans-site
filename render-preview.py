#!/usr/bin/env python3
"""Disposable preview renderer for the Ans website.

GitHub Pages (Jekyll) is the real build; this exists only so the owner can
open the site from disk without installing Jekyll. It renders the small
Liquid surface the layout actually uses and rewrites absolute paths to
relative ones so file:// works. Output: Website/_preview/ (never synced).
"""
import html, pathlib, re, shutil, sys
import markdown

SITE = pathlib.Path(sys.argv[1])
OUT = SITE / "_preview"
SITE_TITLE = "Ans"
SITE_DESC = ("A proper scientific calculator for iPhone and iPad. £4.99 once, "
             "with no subscriptions, ads, accounts or tracking.")
SITE_URL = "https://anscalc.com"

LAYOUT = (SITE / "_layouts" / "default.html").read_text()

PAGES = [
    # (source, output path, page.url)
    ("index.html", "index.html", "/"),
    ("stopwatch/index.html", "stopwatch/index.html", "/stopwatch/"),
    ("clock/index.html", "clock/index.html", "/clock/"),
    ("science/index.html", "science/index.html", "/science/"),
    ("science/gaussian-beam-waist/index.html",
     "science/gaussian-beam-waist/index.html", "/science/gaussian-beam-waist/"),
    ("science/newtons-second-law/index.html",
     "science/newtons-second-law/index.html", "/science/newtons-second-law/"),
    ("science/ohms-law/index.html",
     "science/ohms-law/index.html", "/science/ohms-law/"),
    ("science/wave-speed/index.html",
     "science/wave-speed/index.html", "/science/wave-speed/"),
    ("science/suvat-calculator/index.html",
     "science/suvat-calculator/index.html", "/science/suvat-calculator/"),
    ("science/energy-work-power/index.html",
     "science/energy-work-power/index.html", "/science/energy-work-power/"),
    ("science/momentum-impulse/index.html",
     "science/momentum-impulse/index.html", "/science/momentum-impulse/"),
    ("science/series-parallel-resistance/index.html",
     "science/series-parallel-resistance/index.html", "/science/series-parallel-resistance/"),
    ("science/projectile-motion/index.html",
     "science/projectile-motion/index.html", "/science/projectile-motion/"),
    ("science/trigonometry-calculator/index.html",
     "science/trigonometry-calculator/index.html", "/science/trigonometry-calculator/"),
    ("science/density-mass-volume/index.html",
     "science/density-mass-volume/index.html", "/science/density-mass-volume/"),
    ("science/pressure/index.html",
     "science/pressure/index.html", "/science/pressure/"),
    ("science/specific-heat/index.html",
     "science/specific-heat/index.html", "/science/specific-heat/"),
    ("science/hookes-law/index.html",
     "science/hookes-law/index.html", "/science/hookes-law/"),
    ("science/moments/index.html",
     "science/moments/index.html", "/science/moments/"),
    ("science/rayleigh-range/index.html",
     "science/rayleigh-range/index.html", "/science/rayleigh-range/"),
    ("science/gaussian-beam-divergence/index.html",
     "science/gaussian-beam-divergence/index.html", "/science/gaussian-beam-divergence/"),
    ("science/beam-quality-m-squared/index.html",
     "science/beam-quality-m-squared/index.html", "/science/beam-quality-m-squared/"),
    ("science/thin-lens-imaging/index.html",
     "science/thin-lens-imaging/index.html", "/science/thin-lens-imaging/"),
    ("science/diffraction-limited-spot/index.html",
     "science/diffraction-limited-spot/index.html", "/science/diffraction-limited-spot/"),
    ("science/snells-law-critical-angle/index.html",
     "science/snells-law-critical-angle/index.html", "/science/snells-law-critical-angle/"),
    ("science/transformer-ratios/index.html",
     "science/transformer-ratios/index.html", "/science/transformer-ratios/"),
    ("science/photon-energy/index.html",
     "science/photon-energy/index.html", "/science/photon-energy/"),
    ("science/half-life/index.html",
     "science/half-life/index.html", "/science/half-life/"),
    ("science/capacitor-energy/index.html",
     "science/capacitor-energy/index.html", "/science/capacitor-energy/"),
    ("science/de-broglie/index.html",
     "science/de-broglie/index.html", "/science/de-broglie/"),
    ("science/doppler/index.html",
     "science/doppler/index.html", "/science/doppler/"),
    ("science/escape-velocity/index.html",
     "science/escape-velocity/index.html", "/science/escape-velocity/"),
    ("science/ideal-gas/index.html",
     "science/ideal-gas/index.html", "/science/ideal-gas/"),
    ("science/moles-calculator/index.html",
     "science/moles-calculator/index.html", "/science/moles-calculator/"),
    ("science/binary-hex-converter/index.html",
     "science/binary-hex-converter/index.html", "/science/binary-hex-converter/"),
    ("science/numerical-aperture/index.html",
     "science/numerical-aperture/index.html", "/science/numerical-aperture/"),
    ("science/double-slit/index.html",
     "science/double-slit/index.html", "/science/double-slit/"),
    ("science/braggs-law/index.html",
     "science/braggs-law/index.html", "/science/braggs-law/"),
    ("science/gaussian-spot-size/index.html",
     "science/gaussian-spot-size/index.html", "/science/gaussian-spot-size/"),
    ("science/lensmakers-equation/index.html",
     "science/lensmakers-equation/index.html", "/science/lensmakers-equation/"),
    ("privacy.md", "privacy.html", "/privacy"),
    ("support.md", "support.html", "/support"),
    ("releases.md", "releases.html", "/releases"),
]


def front_matter(text):
    m = re.match(r"\A---\n(.*?)\n---\n", text, re.S)
    fm, body = {}, text
    if m:
        body = text[m.end():]
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip()
    return fm, body


def relativise(doc, depth, current_url):
    rel = "../" * depth
    mapping = {url: rel + dest for _, dest, url in PAGES}
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if url.startswith("/assets/"):
            return f'{attr}="{rel}{url[1:]}"'
        for k, v in mapping.items():
            if url == k or url.startswith(k + "#"):
                return f'{attr}="{v}{url[len(k):]}"'
        if url == "/" or url.startswith("/#"):
            return f'{attr}="{rel}index.html{url[1:]}"'
        return m.group(0)
    return re.sub(r'\b(href|src)="(/[^"]*)"', fix, doc)


for src, dest, url in PAGES:
    fm, body = front_matter((SITE / src).read_text())
    if src.endswith(".md"):
        content = markdown.markdown(body, extensions=["tables"])
    else:
        content = body
    title = fm.get("title", "")
    desc = fm.get("description", SITE_DESC)
    body_class = fm.get("body_class", "prose-page")

    doc = LAYOUT
    doc = doc.replace(
        "{% if page.title %}{{ page.title }}{% else %}Ans — Scientific Calculator{% endif %}",
        title or "Ans — Scientific Calculator")
    doc = doc.replace("{{ page.description | default: site.description | escape }}",
                      html.escape(desc, quote=True))
    doc = doc.replace("{{ page.title | default: site.title | escape }}",
                      html.escape(title or SITE_TITLE, quote=True))
    doc = doc.replace("{{ site.url }}{{ page.url | replace: 'index.html', '' }}",
                      SITE_URL + url)
    doc = doc.replace("{{ site.url }}", SITE_URL)
    doc = doc.replace("{{ page.body_class | default: 'prose-page' }}", body_class)

    # Nav conditionals (must match _layouts/default.html exactly).
    doc = doc.replace("{% unless page.body_class contains 'tool-page' %} class=\"is-active\"{% endunless %}",
                      "" if "tool-page" in body_class else ' class="is-active"')
    doc = doc.replace("{% if page.url == '/' %} aria-current=\"page\"{% endif %}",
                      ' aria-current="page"' if url == "/" else "")
    doc = doc.replace("{% if page.url == '/stopwatch/' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if url == "/stopwatch/" else "")
    doc = doc.replace("{% if page.url == '/clock/' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if url == "/clock/" else "")
    doc = doc.replace("{% if page.body_class contains 'science-page' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if "science-page" in body_class else "")

    doc = doc.replace("{{ content }}", content)

    leftover = re.findall(r"({%.*?%}|{{.*?}})", doc)
    if leftover:
        sys.exit(f"Unrendered Liquid in {src}: {leftover[:5]}")

    depth = dest.count("/")
    doc = relativise(doc, depth, url)

    out = OUT / dest
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc)
    print(f"rendered {dest} ({len(doc)} bytes)")

shutil.copytree(SITE / "assets", OUT / "assets", dirs_exist_ok=True)
shutil.copy(SITE / "robots.txt", OUT / "robots.txt")   # clock sync target
(OUT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    ''.join(f'  <url><loc>{SITE_URL}{url}</loc></url>\n' for _, _, url in PAGES) +
    '</urlset>\n')
(OUT / "README.txt").write_text(
    "Disposable preview render — open index.html or stopwatch/index.html in a\n"
    "browser. Not the real build (GitHub Pages/Jekyll is). Never sync this\n"
    "folder to the site repo; regenerate at will, delete at will.\n")
print("assets copied; preview at", OUT)
