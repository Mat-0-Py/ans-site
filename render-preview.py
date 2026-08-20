#!/usr/bin/env python3
"""Disposable preview renderer for the Ans website.

GitHub Pages (Jekyll) is the real build; this exists only so the owner can
open the site from disk without installing Jekyll. It renders the small
Liquid surface the layout actually uses and rewrites absolute paths to
relative ones so file:// works. Output: Website/_preview/ (never synced).
"""
import html, json, pathlib, re, shutil, sys
try:
    import markdown
except ModuleNotFoundError:
    markdown = None

SITE = pathlib.Path(sys.argv[1])
HTML_ONLY = "--html-only" in sys.argv[2:]
OUT = SITE / "_preview"
SITE_TITLE = "Ans"
SITE_DESC = ("A proper scientific calculator for iPhone, iPad and Mac. £4.99 once, "
             "with no subscriptions, ads, accounts or tracking.")
SITE_URL = "https://anscalc.com"

LAYOUT = (SITE / "_layouts" / "default.html").read_text()

# Site-level switches read straight from _config.yml, so the preview cannot
# drift from what GitHub Pages will build.
CONFIG = (SITE / "_config.yml").read_text()


def check_front_matter(path, front):
    """Reject front matter that Jekyll's YAML parser would reject.

    This renderer reads front matter with a regex, which is more forgiving
    than real YAML — and on 18 August 2026 that difference put a broken page
    on the live site. `description: A worked example: 20 m/s …` has an
    unquoted `: ` inside a scalar, which is a YAML error; Jekyll abandoned the
    front matter, treated the file as a *static* file and served it with no
    layout, no stylesheet and no <head> at all. The preview had shown it
    perfectly. A preview that is more permissive than the build is worse than
    no preview, so the permissiveness stops here.
    """
    for line in front.splitlines():
        m = re.match(r"^([A-Za-z_][\w-]*):\s+(.*)$", line)
        if not m:
            continue
        key, value = m.groups()
        if value and value[0] not in "\"'[{|>" and ": " in value:
            sys.exit(
                f"{path}: front matter would fail Jekyll's YAML parser.\n"
                f"  {key}: {value}\n"
                f"  An unquoted value cannot contain \": \" — wrap it in quotes."
            )


def config_value(key, default=""):
    m = re.search(rf"^{key}:\s*(.*)$", CONFIG, re.M)
    if not m:
        return default
    value = m.group(1).strip().strip('"').strip("'")
    if value in ("true", "false"):
        return value == "true"
    return value


SITE_VARS = {
    "appstore_url": config_value("appstore_url"),
    "appstore_id": config_value("appstore_id"),
    "mac_available": config_value("mac_available", False),
}

SITE_IF = re.compile(
    r"{%\s*if\s+site\.(?P<var>\w+)\s*%}(?P<then>.*?)"
    r"(?:{%\s*else\s*%}(?P<otherwise>.*?))?{%\s*endif\s*%}",
    re.S,
)


def resolve_site_liquid(text):
    """Only the flat `{% if site.X %}…{% else %}…{% endif %}` form the pages
    actually use. Nesting is deliberately unsupported — if a page ever needs
    it, install Jekyll rather than growing this."""
    def choose(m):
        return m.group("then") if SITE_VARS.get(m.group("var")) else (m.group("otherwise") or "")
    text = SITE_IF.sub(choose, text)
    for name, value in SITE_VARS.items():
        text = text.replace("{{ site.%s }}" % name, str(value) if value else "")
    return text

PAGES = [
    # (source, output path, page.url)
    ("index.html", "index.html", "/"),
    # Added 16 August 2026. The graph page was written on 3 August and this
    # list was not updated with it, so the one page nobody could check by
    # opening the live site was also the one page the preview would not
    # render. It carries `sitemap: false` in its front matter until launch;
    # this preview's sitemap is disposable, so that is not a conflict.
    ("calculator/index.html", "calculator/index.html", "/calculator/"),
    ("graph/index.html", "graph/index.html", "/graph/"),
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
    ("convert/index.html", "convert/index.html", "/convert/"),
    ("privacy.md", "privacy.html", "/privacy"),
    ("support.md", "support.html", "/support"),
    ("releases.md", "releases.html", "/releases"),
]

# Converter pages are registry/generated catalogue entries. Discovering them
# here keeps the local preview in lockstep as the catalogue grows.
for convert_source in sorted((SITE / "convert").glob("*/index.html")):
    relative = convert_source.relative_to(SITE).as_posix()
    route = "/" + convert_source.parent.relative_to(SITE).as_posix() + "/"
    PAGES.append((relative, relative, route))

# Worked examples, discovered for the same reason: the section grows one page
# at a time, and a hand-maintained list is how the graph page came to be the
# only page the preview would not render.
if (SITE / "examples" / "index.html").exists():
    PAGES.append(("examples/index.html", "examples/index.html", "/examples/"))
for example_source in sorted((SITE / "examples").glob("*/index.html")):
    relative = example_source.relative_to(SITE).as_posix()
    route = "/" + example_source.parent.relative_to(SITE).as_posix() + "/"
    PAGES.append((relative, relative, route))

if HTML_ONLY:
    PAGES = [page for page in PAGES if not page[0].endswith(".md")]
elif markdown is None:
    sys.exit("Python Markdown is required for prose pages; pass --html-only to render the tools without it.")


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
        if url == "/favicon.ico":
            return f'{attr}="{rel}favicon.ico"'
        for k, v in mapping.items():
            if url == k or url.startswith(k + "#"):
                return f'{attr}="{v}{url[len(k):]}"'
        if url == "/" or url.startswith("/#"):
            return f'{attr}="{rel}index.html{url[1:]}"'
        return m.group(0)
    return re.sub(r'\b(href|src)="(/[^"]*)"', fix, doc)


for src, dest, url in PAGES:
    raw = (SITE / src).read_text()
    if raw.startswith("---"):
        check_front_matter(src, raw.split("---", 2)[1])
    fm, body = front_matter(raw)
    if src.endswith(".md"):
        content = markdown.markdown(body, extensions=["tables"])
    else:
        content = body
    title = fm.get("title", "")
    desc = fm.get("description", SITE_DESC)
    body_class = fm.get("body_class", "prose-page")
    og_image = fm.get("og_image", "/assets/images/social-card.png")
    og_image_alt = fm.get(
        "og_image_alt", "Ans — a scientific calculator for iPhone, iPad and Mac.")

    doc = LAYOUT

    # Smart App Banner: the production layout intentionally limits this to
    # product, worked-example and science pages. Resolve that page-aware
    # Liquid here so the disposable preview exercises the same scope.
    smart_banner_pattern = re.compile(
        r"    {% comment %}\n"
        r"      Safari's native, dismissible Smart App Banner\..*?"
        r"    {% endcomment %}\n"
        r"    {% if page\.url == '/' or page\.body_class contains 'calculator-page' or page\.body_class contains 'graph-page' or page\.body_class contains 'examples-page' or page\.body_class contains 'science-page' %}\n"
        r"(    <meta name=\"apple-itunes-app\" content=\"app-id={{ site\.appstore_id }}\">)\n"
        r"    {% endif %}\n",
        re.S)
    smart_banner_match = smart_banner_pattern.search(doc)
    if not smart_banner_match:
        sys.exit("Smart App Banner template missing from layout")
    show_smart_banner = (
        url == "/"
        or "calculator-page" in body_class
        or "graph-page" in body_class
        or "examples-page" in body_class
        or "science-page" in body_class
    )
    replacement = smart_banner_match.group(1) + "\n" if show_smart_banner else ""
    doc = smart_banner_pattern.sub(replacement, doc)

    # Breadcrumbs: the layout now serves both catalogue families through a
    # {% assign %}, so the preview resolves the family here and renders the
    # same JSON-LD the real build would.
    breadcrumb_pattern = re.compile(
        r"    {% comment %}.*?{% endcomment %}\n"
        r"    {% if page\.body_class contains 'science-page' %}.*?{% endif %}\n"
        r"    {% if crumb_name %}\n"
        r"(    <script type=\"application/ld\+json\" data-schema=\"family-breadcrumbs\">.*?</script>)\n"
        r"    {% endif %}\n",
        re.S)
    breadcrumb_match = breadcrumb_pattern.search(doc)
    if not breadcrumb_match:
        sys.exit("Family breadcrumb template missing from layout")
    if "science-page" in body_class:
        crumb_name, crumb_url = "Science", "/science/"
    elif "convert-page" in body_class:
        crumb_name, crumb_url = "Convert", "/convert/"
    elif "examples-page" in body_class:
        crumb_name, crumb_url = "Examples", "/examples/"
    else:
        crumb_name = crumb_url = None
    if crumb_name:
        breadcrumb = breadcrumb_match.group(1)
        third_item_pattern = re.compile(
            r"\n        {% unless page\.url == crumb_url %}(.*?)"
            r"\n        {% endunless %}",
            re.S)
        if url == crumb_url:
            breadcrumb = third_item_pattern.sub("", breadcrumb)
        else:
            breadcrumb = third_item_pattern.sub(lambda match: match.group(1), breadcrumb)
        breadcrumb = (breadcrumb
                      .replace("{{ crumb_name }}", crumb_name)
                      .replace("{{ site.url }}{{ crumb_url }}", SITE_URL + crumb_url))
        doc = breadcrumb_pattern.sub(breadcrumb + "\n", doc)
    else:
        doc = breadcrumb_pattern.sub("", doc)

    doc = doc.replace(
        "{% if page.title %}{{ page.title }}{% else %}Ans — Scientific Calculator{% endif %}",
        title or "Ans — Scientific Calculator")
    doc = doc.replace("{{ page.description | default: site.description | escape }}",
                      html.escape(desc, quote=True))
    doc = doc.replace("{{ page.title | default: site.title | escape }}",
                      html.escape(title or SITE_TITLE, quote=True))
    # Matches the layout: a breadcrumb carries the page name, not the whole
    # SERP title, so everything from the first em dash is dropped.
    doc = doc.replace("{{ page.title | split: ' — ' | first | jsonify }}",
                      json.dumps((title or SITE_TITLE).split(" — ")[0],
                                 ensure_ascii=False))
    doc = doc.replace("{{ site.url }}{{ page.url | replace: 'index.html', '' }}",
                      SITE_URL + url)
    doc = doc.replace("{{ site.url }}", SITE_URL)
    doc = doc.replace(
        "{{ page.og_image | default: '/assets/images/social-card.png' }}",
        og_image)
    doc = doc.replace(
        "{{ page.og_image_alt | default: 'Ans — a scientific calculator for iPhone, iPad and Mac.' | escape }}",
        html.escape(og_image_alt, quote=True))
    doc = doc.replace("{{ page.body_class | default: 'prose-page' }}", body_class)

    # Nav conditionals (must match _layouts/default.html exactly).
    doc = doc.replace("{% if page.body_class contains 'calculator-page' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if "calculator-page" in body_class else "")
    doc = doc.replace("{% if page.url == '/' %} aria-current=\"page\"{% endif %}",
                      ' aria-current="page"' if url == "/" else "")
    doc = doc.replace("{% if page.url == '/stopwatch/' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if url == "/stopwatch/" else "")
    doc = doc.replace("{% if page.url == '/clock/' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if url == "/clock/" else "")
    doc = doc.replace("{% if page.body_class contains 'graph-page' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if "graph-page" in body_class else "")
    doc = doc.replace("{% if page.body_class contains 'science-page' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if "science-page" in body_class else "")
    doc = doc.replace("{% if page.body_class contains 'convert-page' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if "convert-page" in body_class else "")
    doc = doc.replace("{% if page.body_class contains 'examples-page' %} class=\"is-active\" aria-current=\"page\"{% endif %}",
                      ' class="is-active" aria-current="page"' if "examples-page" in body_class else "")

    doc = doc.replace("{{ content }}", content)

    doc = resolve_site_liquid(doc)

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
shutil.copy(SITE / "favicon.ico", OUT / "favicon.ico")
shutil.copy(SITE / "robots.txt", OUT / "robots.txt")   # clock sync target
shutil.copy(SITE / "llms.txt", OUT / "llms.txt")
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
