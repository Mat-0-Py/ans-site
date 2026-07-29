/*
  convert-table.js — generate the static conversion table for a converter
  page (Website-Private-Docs/CONVERT-DESIGN.md).

  The table on a converter page is plain HTML, not generated in the
  browser: it is the crawlable, JavaScript-off part of the page and the
  bit a search engine can quote. That makes it the one place where a
  number could be typed wrong, so it is never typed — it is generated
  from the same registry the live converter uses.

      node Website/tools/convert-table.js mass kg lb
      node Website/tools/convert-table.js temperature C F --values=-40,0,10,20,37,100
      node Website/tools/convert-table.js length cm in --sf=6

  Paste the printed block into the page. Re-run it if the registry
  changes. Excluded from the built site via _config.yml.
*/
"use strict";

var C = require("../assets/js/convert.js");

var args = process.argv.slice(2);
var flags = {};
var positional = args.filter(function (a) {
  var m = /^--([a-z]+)=(.*)$/.exec(a);
  if (m) { flags[m[1]] = m[2]; return false; }
  return true;
});

var quantityId = positional[0], fromId = positional[1], toId = positional[2];
var q = C.quantity(quantityId);
var from = C.unit(quantityId, fromId), to = C.unit(quantityId, toId);

if (!q || !from || !to) {
  console.error("usage: node Website/tools/convert-table.js <quantity> <from> <to> [--values=1,2,5] [--sf=6] [--caption=…]");
  console.error("");
  console.error("quantities: " + C.QUANTITIES.map(function (x) { return x.id; }).join(", "));
  if (q) { console.error("units in " + q.id + ": " + q.units.map(function (u) { return u.id; }).join(", ")); }
  process.exit(1);
}

// The default ladder. Round numbers people actually search for, plus the
// small end so the table is useful for the everyday case.
var DEFAULT_VALUES = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 75, 100, 250, 500, 1000];
var TEMPERATURE_VALUES = [-40, -20, -10, 0, 5, 10, 15, 20, 25, 30, 37, 40, 50, 75, 100];

var values = flags.values
  ? flags.values.split(",").map(Number)
  : (q.affine ? TEMPERATURE_VALUES : DEFAULT_VALUES);
var sf = parseInt(flags.sf, 10) || 6;

function escape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

var lines = [];
lines.push('<div class="convert-table-wrap">');
lines.push('  <table class="convert-table">');
var caption = flags.caption || (from.name + " to " + to.name);
lines.push('    <caption>' + escape(caption) +
  ' — common values, to ' + sf + ' significant figures.</caption>');
lines.push('    <thead><tr><th scope="col">' + escape(from.symbol) + '</th><th scope="col">' +
  escape(to.symbol) + '</th></tr></thead>');
lines.push('    <tbody>');

function cell(value, u, sig) {
  // Compound units carry their own symbols inside the formatted text.
  return C.isCompound(u) ? escape(C.formatValue(value, u, sig))
    : escape(C.format(value, sig)) + " " + escape(u.symbol);
}

values.forEach(function (v) {
  var out = C.convert(v, q.id, from.id, to.id);
  lines.push('      <tr><td>' + cell(v, from, 10) + '</td><td>' +
    cell(out, to, sf) + '</td></tr>');
});

lines.push('    </tbody>');
lines.push('  </table>');
lines.push('</div>');

console.log(lines.join("\n"));

// The one-line relationship the page's intro and meta description quote.
console.log("");
if (q.affine) {
  console.log("// relationship: see the formula block (affine — scale and shift)");
} else if (q.reciprocal) {
  console.log("// relationship: reciprocal — " + from.symbol + " × " + to.symbol +
    " is not constant; see the formula block");
} else {
  console.log("// relationship: 1 " + from.symbol + " = " +
    C.format(C.ratio(q.id, from.id, to.id), 10) + " " + to.symbol +
    "  ·  1 " + to.symbol + " = " + C.format(C.ratio(q.id, to.id, from.id), 10) + " " + from.symbol);
}
console.log("// exact definition: " + (C.isExact(q.id, from.id, to.id) ? "yes" : "no — conventional value"));
