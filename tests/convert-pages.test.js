/*
  Structural release audit for every generated converter route.
  No DOM or third-party packages are required.
*/
"use strict";

var fs = require("fs");
var path = require("path");
var child = require("child_process");
var C = require("../assets/js/convert.js");
var GENERATOR = require("../tools/generate-convert-pages.js");

var ROOT = path.resolve(__dirname, "..");
var CONVERT = path.join(ROOT, "convert");
var pass = 0, fail = 0;

function check(ok, name, detail) {
  if (ok) { pass++; }
  else {
    fail++;
    console.error("FAIL " + name + (detail ? "\n   " + detail : ""));
  }
}

function capture(html, pattern) {
  var match = pattern.exec(html);
  return match ? match[1] : null;
}

var dirs = fs.readdirSync(CONVERT).filter(function (name) {
  return fs.existsSync(path.join(CONVERT, name, "index.html"));
}).sort();

// The catalogue is whatever the generator declares, plus the three
// hand-written pilots it deliberately leaves alone.
var expectedRoutes = GENERATOR.pairPages.length + GENERATOR.quantityPages.length +
  GENERATOR.handWritten.filter(function (h) { return h.label; }).length;
check(dirs.length === expectedRoutes, "complete route count",
  "got " + dirs.length + ", want " + expectedRoutes);

var hub = fs.readFileSync(path.join(CONVERT, "index.html"), "utf8");
var cssBytes = fs.statSync(path.join(ROOT, "assets", "css", "style.css")).size;
var coreBytes = fs.statSync(path.join(ROOT, "assets", "js", "convert-core.js")).size;
var wiringBytes = fs.statSync(path.join(ROOT, "assets", "js", "converter.js")).size;
function unitBytes(quantityId) {
  return fs.statSync(path.join(ROOT, "assets", "js", "units", quantityId + ".js")).size;
}
// Quantity slugs come from the generator rather than a second hand-kept
// copy: a quantity with no page entry then fails the check below instead of
// silently matching a stale map.
var quantityRoutes = {};
GENERATOR.quantityPages.forEach(function (p) { quantityRoutes[p.quantity] = p.slug; });

var permalinks = {};

dirs.forEach(function (slug) {
  var file = path.join(CONVERT, slug, "index.html");
  var html = fs.readFileSync(file, "utf8");
  var permalink = capture(html, /^permalink:\s*(\S+)\s*$/m);
  var config = /AnsConverter\(\{\s*quantity:\s*"([^"]+)",\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)"/.exec(html);
  var jsonText = capture(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  check(permalink === "/convert/" + slug + "/", slug + " permalink", String(permalink));
  check(!permalinks[permalink], slug + " permalink unique", permalink);
  permalinks[permalink] = true;
  check(!!config, slug + " has converter config");
  check(!!jsonText, slug + " has JSON-LD");
  if (jsonText) {
    try {
      var json = JSON.parse(jsonText);
      check(json.url === "https://anscalc.com" + permalink, slug + " JSON-LD URL");
      check(json.isAccessibleForFree === true, slug + " JSON-LD free flag");
    } catch (error) {
      check(false, slug + " JSON-LD parses", error.message);
    }
  }

  if (config) {
    var q = C.quantity(config[1]);
    check(!!q, slug + " quantity exists", config[1]);
    check(!!C.unit(config[1], config[2]), slug + " source unit exists", config[2]);
    check(!!C.unit(config[1], config[3]), slug + " destination unit exists", config[3]);
  }

  check(/id="u-from"[^>]*><\/select>/.test(html), slug + " source menu is registry-built");
  check(/id="u-to"[^>]*><\/select>/.test(html), slug + " destination menu is registry-built");
  check((html.match(/<section class="assumptions"/g) || []).length === 1,
    slug + " has one Definitions block");
  var definitions = capture(html, /<section class="assumptions"[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
  check((definitions && (definitions.match(/<li>/g) || []).length >= 4),
    slug + " has at least four specific definitions");
  var notes = capture(html, /<section class="tool-notes"[\s\S]*?<h2>How it works<\/h2>([\s\S]*?)<\/section>/);
  check((notes && (notes.match(/<p>/g) || []).length >= 4),
    slug + " has four How it works paragraphs");
  check(/Common questions this answers:/.test(html), slug + " has common-question copy");
  check(/<table class="convert-table">/.test(html), slug + " has a static table");
  // A page must load the engine, its own quantity and nothing else: loading
  // the Node aggregate would quietly put all 34 quantities back on the wire.
  check(/assets\/js\/convert-core\.js/.test(html) &&
    html.indexOf('/assets/js/units/' + config[1] + '.js') >= 0 &&
    /assets\/js\/converter\.js/.test(html) &&
    !/assets\/js\/convert\.js/.test(html),
    slug + " loads the engine and only its own quantity");
  check(!/<script[^>]+src=["']https?:\/\//.test(html), slug + " has no external scripts");
  // Only the one quantity a page loads counts against its budget.
  var weight = cssBytes + coreBytes + wiringBytes + unitBytes(config[1]) +
    Buffer.byteLength(html);
  check(weight <= 100 * 1024, slug + " stays within 100 KiB raw page budget",
    String(weight) + " bytes");
  // The hub carries one card per quantity, so a pair page is reached through
  // its quantity page. Every page must still be one click from something
  // crawlable — an orphan would be reachable only from the sitemap.
  var quantityPage = config && quantityRoutes[config[1]];
  var quantityHtml = quantityPage
    ? fs.readFileSync(path.join(CONVERT, quantityPage, "index.html"), "utf8") : "";
  check(hub.indexOf('href="/convert/' + slug + '/"') >= 0 ||
    quantityHtml.indexOf('href="/convert/' + slug + '/"') >= 0,
    slug + " is linked from the hub or its quantity page");

  // Generated copy must read as English written for a visitor, not as a
  // description of how the site is built. These are the words that gave
  // the first pass away: a reader does not know what a "registry" is, and
  // "the kilogram is 1 kg" is not a definition of anything.
  var prose = capture(html, /<div class="tool-shell">([\s\S]*)<\/div>/) || html;
  ["registry", "menu unit", "base-unit", "executable", "pair factor", "config"]
    .forEach(function (word) {
      check(prose.toLowerCase().indexOf(word) < 0,
        slug + " avoids internal vocabulary (" + word + ")");
    });
  check(!/is 1 [A-Za-zµ°²³/·]+\. That/.test(prose),
    slug + " has no circular unit definition");
});

// Every converter-to-converter link must resolve to a real directory.
[path.join(CONVERT, "index.html")].concat(dirs.map(function (slug) {
  return path.join(CONVERT, slug, "index.html");
})).forEach(function (file) {
  var html = fs.readFileSync(file, "utf8");
  var match, linkPattern = /href="(\/convert\/(?:[^"#?]+\/)?)"/g;
  while ((match = linkPattern.exec(html))) {
    var route = match[1].replace(/^\/convert\/?/, "").replace(/\/$/, "");
    var target = route ? path.join(CONVERT, route, "index.html") : path.join(CONVERT, "index.html");
    check(fs.existsSync(target), path.relative(ROOT, file) + " link resolves", match[1]);
  }
});

C.QUANTITIES.forEach(function (q) {
  var slug = quantityRoutes[q.id];
  check(!!slug && fs.existsSync(path.join(CONVERT, slug, "index.html")),
    "quantity page exists · " + q.id);
});

// Every table on the site — hand-written pilots included — must byte-match
// what the generator produces today. This is what makes "no hand-typed
// table numbers" an enforced rule rather than an intention.
var customTables = {};
GENERATOR.handWritten.forEach(function (h) {
  if (h.customTable) { customTables[h.slug] = true; }
});

dirs.forEach(function (slug) {
  // A page whose table is a lookup chart rather than a conversion ladder is
  // declared as such in the generator; everything else must byte-match.
  if (customTables[slug]) { return; }
  var html = fs.readFileSync(path.join(CONVERT, slug, "index.html"), "utf8");
  var config = /AnsConverter\(\{\s*quantity:\s*"([^"]+)",\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)"/.exec(html);
  var actual = capture(html, /(<div class="convert-table-wrap">[\s\S]*?<\/div>)/);
  if (!config || !actual) { return; }
  // Rebuild it through the page generator itself, so the per-pair value
  // ladder and the caption are part of what is being checked.
  var generated = GENERATOR.tableFor(config[1], config[2], config[3], slug);
  function normaliseTable(value) {
    return value.trim().replace(/>\s+</g, "><");
  }
  check(normaliseTable(actual) === normaliseTable(generated),
    slug + " table matches generator");
});


// ---- the copy file --------------------------------------------------------
// A typo'd key in tools/convert-copy.js used to fail silently: the page fell
// back to generic wording and nothing complained. Every key must name
// something real, and every page-facing unit must have a written note.
var COPY = require("../tools/convert-copy.js");
var slugs = {};
GENERATOR.pairPages.forEach(function (p) { slugs[p.slug] = "pair"; });
GENERATOR.quantityPages.forEach(function (p) { slugs[p.slug] = "quantity"; });

Object.keys(COPY.PAIR_HOOKS).forEach(function (slug) {
  check(slugs[slug] === "pair", "PAIR_HOOKS key names a pair page · " + slug);
});
Object.keys(COPY.TABLE_VALUES).forEach(function (slug) {
  check(!!slugs[slug], "TABLE_VALUES key names a page · " + slug);
  check(Array.isArray(COPY.TABLE_VALUES[slug]) && COPY.TABLE_VALUES[slug].length > 0 &&
    COPY.TABLE_VALUES[slug].every(function (v) { return typeof v === "number" && isFinite(v); }),
    "TABLE_VALUES ladder is a list of finite numbers · " + slug);
});
Object.keys(COPY.QUANTITY_HOOKS).forEach(function (id) {
  check(!!C.quantity(id), "QUANTITY_HOOKS key names a quantity · " + id);
});
Object.keys(COPY.UNIT_NOTES).forEach(function (key) {
  var parts = key.split(".");
  check(!!C.unit(parts[0], parts[1]), "UNIT_NOTES key names a unit · " + key);
});
var unitNames = {};
C.QUANTITIES.forEach(function (q) {
  q.units.forEach(function (u) { unitNames[u.name] = true; });
});
Object.keys(COPY.PLURALS).forEach(function (name) {
  check(!!unitNames[name], "PLURALS key names a unit · " + name);
});

// Every quantity needs its opening sentence, and every unit a page defaults
// to needs a written fact — the generator throws without them, but a failing
// test says which one and why.
C.QUANTITIES.forEach(function (q) {
  check(!!COPY.QUANTITY_HOOKS[q.id], "quantity has an opening sentence · " + q.id);
});
GENERATOR.pairPages.forEach(function (p) {
  check(!!COPY.PAIR_HOOKS[p.slug], "pair page has an opening sentence · " + p.slug);
});
GENERATOR.pairPages.concat(GENERATOR.quantityPages).forEach(function (p) {
  [p.from, p.to].forEach(function (u) {
    check(!!COPY.UNIT_NOTES[p.quantity + "." + u],
      "page-facing unit has a written note · " + p.quantity + "." + u);
  });
});

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
