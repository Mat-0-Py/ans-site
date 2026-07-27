/*
  Generate the Ans Convert catalogue from the shared unit registry.

  Pair tables are delegated to convert-table.js, so every crawlable table
  uses the same conversion path as the live instrument. The prose around
  each table is assembled from pair metadata plus the quantity/unit
  definitions in convert.js; no page owns a conversion factor.

      node Website/tools/generate-convert-pages.js

  The three hand-written pilot pages are intentionally retained:
  length, kg-to-lbs and celsius-to-fahrenheit.
*/
"use strict";

var fs = require("fs");
var path = require("path");
var child = require("child_process");
var C = require("../assets/js/convert.js");
var COPY = require("./convert-copy.js");

var ROOT = path.resolve(__dirname, "..");
var CONVERT_ROOT = path.join(ROOT, "convert");

var quantityPages = [
  ["length", "length", "cm", "in", 30],
  ["mass", "mass", "kg", "lb", 1],
  ["temperature", "temperature", "C", "F", 20],
  ["volume", "volume", "ml", "floz_us", 250],
  ["speed", "speed", "mph", "kmh", 60],
  ["area", "area", "ft2", "m2", 100],
  ["pressure", "pressure", "psi", "bar", 32],
  ["energy", "energy", "kcal", "kj", 500],
  ["power", "power", "hp", "kw", 100],
  ["data", "data", "mb", "gb", 1000],
  ["time", "time", "min", "h", 60],
  ["angle", "angle", "deg", "rad", 180],
  ["force", "force", "lbf", "n", 100],
  ["fuel-economy", "fuel", "mpg_uk", "l100", 40],
  ["density", "density", "kgm3", "gcm3", 1000],
  ["torque", "torque", "lbfft", "nm", 100],
  ["flow", "flow", "lmin", "gpm_uk", 100],
  ["mass-flow", "massflow", "kgh", "lbh", 100],
  ["frequency", "frequency", "hz", "rpm", 50],
  ["angular-velocity", "angularvelocity", "rpm", "rads", 1000],
  ["acceleration", "acceleration", "g0", "mps2", 1],
  ["data-rate", "datarate", "mbps", "MBs", 100],
  ["charge", "charge", "mah", "c", 1000],
  ["illuminance", "illuminance", "fc", "lx", 10],
  ["radioactivity", "radioactivity", "ci", "bq", 1],
  ["dose", "dose", "msv", "rem", 1],
  ["magnetic-field", "magneticfield", "g", "t", 10000],
  ["viscosity", "viscosity", "cp", "pas", 1000],
  ["kinematic-viscosity", "kinematicviscosity", "cst", "m2s", 100],
  ["amount-of-substance", "amount", "mmol", "mol", 1000],
  ["concentration", "concentration", "moll", "mmoll", 1],
  ["specific-energy", "specificenergy", "whkg", "kjkg", 100],
  ["thermal-conductivity", "thermalconductivity", "btuhftf", "wmk", 1],
  ["ev-efficiency", "evefficiency", "whmi", "whkm", 250]
].map(function (x) {
  return { slug: x[0], quantity: x[1], from: x[2], to: x[3], value: x[4] };
});

var pairPages = [
  // Length
  ["cm-to-inches", "length", "cm", "in", "Centimetres to inches", 30],
  ["inches-to-cm", "length", "in", "cm", "Inches to centimetres", 12],
  ["mm-to-inches", "length", "mm", "in", "Millimetres to inches", 25],
  ["inches-to-mm", "length", "in", "mm", "Inches to millimetres", 6],
  ["feet-to-metres", "length", "ft", "m", "Feet to metres", 6],
  ["metres-to-feet", "length", "m", "ft", "Metres to feet", 100],
  ["feet-to-cm", "length", "ft", "cm", "Feet to centimetres", 6],
  ["cm-to-feet", "length", "cm", "ft", "Centimetres to feet", 175],
  ["km-to-miles", "length", "km", "mi", "Kilometres to miles", 100],
  ["miles-to-km", "length", "mi", "km", "Miles to kilometres", 26.2188],
  ["yards-to-metres", "length", "yd", "m", "Yards to metres", 100],
  ["metres-to-yards", "length", "m", "yd", "Metres to yards", 100],
  ["nautical-miles-to-km", "length", "nmi", "km", "Nautical miles to kilometres", 100],
  ["mm-to-cm", "length", "mm", "cm", "Millimetres to centimetres", 25],
  ["m-to-cm", "length", "m", "cm", "Metres to centimetres", 2],
  ["km-to-m", "length", "km", "m", "Kilometres to metres", 5],
  ["inches-to-feet", "length", "in", "ft", "Inches to feet", 72],
  ["feet-to-inches", "length", "ft", "in", "Feet to inches", 6],
  ["cm-to-feet-and-inches", "length", "cm", "ft_in", "Centimetres to feet and inches", 175],
  ["feet-and-inches-to-cm", "length", "ft_in", "cm", "Feet and inches to centimetres", 5.75],
  // Mass
  ["lbs-to-kg", "mass", "lb", "kg", "Pounds to kilograms", 150],
  ["kg-to-stone", "mass", "kg", "st", "Kilograms to stone", 70],
  ["stone-to-kg", "mass", "st", "kg", "Stone to kilograms", 12],
  ["stone-to-pounds", "mass", "st", "lb", "Stone to pounds", 12],
  ["grams-to-ounces", "mass", "g", "oz", "Grams to ounces", 500],
  ["ounces-to-grams", "mass", "oz", "g", "Ounces to grams", 8],
  ["grams-to-pounds", "mass", "g", "lb", "Grams to pounds", 1000],
  ["pounds-to-grams", "mass", "lb", "g", "Pounds to grams", 5],
  ["tons-to-kg", "mass", "ton_us", "kg", "Short tons to kilograms", 5],
  ["kg-to-tons", "mass", "kg", "ton_us", "Kilograms to short tons", 5000],
  ["troy-ounces-to-grams", "mass", "ozt", "g", "Troy ounces to grams", 1],
  ["kg-to-g", "mass", "kg", "g", "Kilograms to grams", 2],
  ["g-to-kg", "mass", "g", "kg", "Grams to kilograms", 500],
  ["kg-to-stone-and-pounds", "mass", "kg", "st_lb", "Kilograms to stone and pounds", 80],
  ["stone-and-pounds-to-kg", "mass", "st_lb", "kg", "Stone and pounds to kilograms", 12.2857142857],
  ["kg-to-pounds-and-ounces", "mass", "kg", "lb_oz", "Kilograms to pounds and ounces", 3.5],
  ["pounds-and-ounces-to-kg", "mass", "lb_oz", "kg", "Pounds and ounces to kilograms", 7.71617917647],
  // Temperature
  ["fahrenheit-to-celsius", "temperature", "F", "C", "Fahrenheit to Celsius"],
  ["celsius-to-kelvin", "temperature", "C", "K", "Celsius to kelvin"],
  ["kelvin-to-celsius", "temperature", "K", "C", "Kelvin to Celsius"],
  ["fahrenheit-to-kelvin", "temperature", "F", "K", "Fahrenheit to kelvin"],
  // Volume
  ["ml-to-oz", "volume", "ml", "floz_us", "Millilitres to US fluid ounces", 500],
  ["oz-to-ml", "volume", "floz_us", "ml", "US fluid ounces to millilitres", 12],
  ["litres-to-gallons", "volume", "l", "gal_uk", "Litres to imperial gallons", 50],
  ["gallons-to-litres", "volume", "gal_uk", "l", "Imperial gallons to litres", 10],
  ["cups-to-ml", "volume", "cup_us", "ml", "US cups to millilitres", 1],
  ["ml-to-cups", "volume", "ml", "cup_us", "Millilitres to US cups", 250],
  ["tablespoons-to-ml", "volume", "tbsp_m", "ml", "Metric tablespoons to millilitres", 2],
  ["teaspoons-to-ml", "volume", "tsp_m", "ml", "Metric teaspoons to millilitres", 1],
  ["litres-to-pints", "volume", "l", "pt_uk", "Litres to imperial pints", 2],
  ["pints-to-litres", "volume", "pt_uk", "l", "Imperial pints to litres", 4],
  ["quarts-to-litres", "volume", "qt_us", "l", "US liquid quarts to litres", 2],
  ["cubic-feet-to-cubic-metres", "volume", "ft3", "m3", "Cubic feet to cubic metres", 100],
  ["cubic-metres-to-litres", "volume", "m3", "l", "Cubic metres to litres", 5],
  ["ml-to-litres", "volume", "ml", "l", "Millilitres to litres", 500],
  ["litres-to-ml", "volume", "l", "ml", "Litres to millilitres", 2],
  // Area
  ["square-feet-to-square-metres", "area", "ft2", "m2", "Square feet to square metres", 1000],
  ["square-metres-to-square-feet", "area", "m2", "ft2", "Square metres to square feet", 100],
  ["acres-to-hectares", "area", "acre", "ha", "Acres to hectares", 5],
  ["hectares-to-acres", "area", "ha", "acre", "Hectares to acres", 5],
  ["acres-to-square-feet", "area", "acre", "ft2", "Acres to square feet", 1],
  // Speed
  ["mph-to-kmh", "speed", "mph", "kmh", "Miles per hour to kilometres per hour", 70],
  ["kmh-to-mph", "speed", "kmh", "mph", "Kilometres per hour to miles per hour", 100],
  ["knots-to-mph", "speed", "kn", "mph", "Knots to miles per hour", 20],
  ["knots-to-kmh", "speed", "kn", "kmh", "Knots to kilometres per hour", 20],
  ["mps-to-mph", "speed", "mps", "mph", "Metres per second to miles per hour", 10],
  ["mps-to-kmh", "speed", "mps", "kmh", "Metres per second to kilometres per hour", 10],
  // Pressure
  ["psi-to-bar", "pressure", "psi", "bar", "PSI to bar", 32],
  ["bar-to-psi", "pressure", "bar", "psi", "Bar to PSI", 2.2],
  ["kpa-to-psi", "pressure", "kpa", "psi", "Kilopascals to PSI", 220],
  ["psi-to-kpa", "pressure", "psi", "kpa", "PSI to kilopascals", 32],
  ["bar-to-kpa", "pressure", "bar", "kpa", "Bar to kilopascals", 2],
  ["atm-to-psi", "pressure", "atm", "psi", "Atmospheres to PSI", 1],
  // Energy
  ["calories-to-kj", "energy", "kcal", "kj", "Food calories to kilojoules", 2000],
  ["kj-to-calories", "energy", "kj", "kcal", "Kilojoules to food calories", 8368],
  ["joules-to-calories", "energy", "j", "cal", "Joules to thermochemical calories", 1000],
  ["kwh-to-mj", "energy", "kwh", "mj", "Kilowatt-hours to megajoules", 100],
  ["btu-to-kwh", "energy", "btu", "kwh", "BTU to kilowatt-hours", 12000],
  // Power
  ["hp-to-kw", "power", "hp", "kw", "Mechanical horsepower to kilowatts", 150],
  ["kw-to-hp", "power", "kw", "hp", "Kilowatts to mechanical horsepower", 100],
  ["ps-to-hp", "power", "ps", "hp", "Metric horsepower to mechanical horsepower", 150],
  ["watts-to-btu", "power", "w", "btuh", "Watts to BTU per hour", 3500],
  // Data and data rate
  ["mb-to-gb", "data", "mb", "gb", "Megabytes to gigabytes", 500],
  ["gb-to-tb", "data", "gb", "tb", "Gigabytes to terabytes", 500],
  ["gb-to-mb", "data", "gb", "mb", "Gigabytes to megabytes", 8],
  ["bytes-to-bits", "data", "byte", "bit", "Bytes to bits", 1000],
  ["gb-to-gib", "data", "gb", "gib", "Gigabytes to gibibytes", 1000],
  ["mbps-to-mbs", "datarate", "mbps", "MBs", "Megabits per second to megabytes per second", 100],
  // Angle
  ["degrees-to-radians", "angle", "deg", "rad", "Degrees to radians", 90],
  ["radians-to-degrees", "angle", "rad", "deg", "Radians to degrees", 1],
  // Time
  ["minutes-to-hours", "time", "min", "h", "Minutes to hours", 90],
  ["hours-to-days", "time", "h", "d", "Hours to days", 36],
  ["days-to-years", "time", "d", "yr", "Days to Julian years", 365],
  ["seconds-to-minutes", "time", "s", "min", "Seconds to minutes", 300],
  ["hours-to-minutes", "time", "h", "min", "Hours to minutes", 2],
  ["minutes-to-seconds", "time", "min", "s", "Minutes to seconds", 5],
  ["minutes-to-hours-and-minutes", "time", "min", "h_min", "Minutes to hours and minutes", 150],
  ["seconds-to-minutes-and-seconds", "time", "s", "min_s", "Seconds to minutes and seconds", 150],
  // Fuel economy
  ["mpg-to-l100km", "fuel", "mpg_uk", "l100", "UK MPG to litres per 100 kilometres", 45],
  ["l100km-to-mpg", "fuel", "l100", "mpg_uk", "Litres per 100 kilometres to UK MPG", 6],
  ["mpg-us-to-mpg-uk", "fuel", "mpg_us", "mpg_uk", "US MPG to UK MPG", 30]
].map(function (x) {
  return { slug: x[0], quantity: x[1], from: x[2], to: x[3], phrase: x[4], sample: x[5] };
});

// Hand-written pages the generator leaves alone. They exist because the
// template genuinely does not fit: the pilots set the tone for everything
// else, and the oven chart is a lookup table rather than a conversion.
// Listed here so the hub, the route count and the tests all agree on them.
var handWritten = [
  { slug: "length", quantity: "length", card: null },              // the quantity page itself
  { slug: "kg-to-lbs", quantity: "mass", label: "Kg to lbs",
    blurb: "The exact international pound definition, in both directions." },
  { slug: "celsius-to-fahrenheit", quantity: "temperature", label: "Celsius to Fahrenheit",
    blurb: "The affine scale and shift, with temperature intervals distinguished." },
  { slug: "oven-temperatures", quantity: "temperature", label: "Oven temperatures",
    blurb: "Gas mark, conventional and fan settings — a chart, because gas marks are not a unit.",
    customTable: true }
];

var quantitySlug = {};
quantityPages.forEach(function (p) { quantitySlug[p.quantity] = p.slug; });
var allPageSlugs = {};
quantityPages.forEach(function (p) { allPageSlugs[p.slug] = true; });
pairPages.forEach(function (p) { allPageSlugs[p.slug] = true; });

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sentence(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function tableFor(quantity, from, to, slug) {
  var args = [path.join(__dirname, "convert-table.js"), quantity, from, to];
  var values = COPY.TABLE_VALUES[slug];
  if (values) { args.push("--values=" + values.join(",")); }
  var q = C.quantity(quantity);
  args.push("--caption=" + sentence(plural(C.unit(quantity, from))) + " to " +
    plural(C.unit(quantity, to)));
  var output = child.execFileSync(process.execPath, args, { encoding: "utf8" });
  return output.split("\n\n// relationship:")[0].trim();
}

function exactText(q, from, to) {
  return C.isExact(q.id, from.id, to.id)
    ? "This conversion is exact by definition."
    : "One of these units is a conventional or measured value, so the conversion is not exact however many digits are shown.";
}

// The relationship as a sentence, for prose. The MathML version below is
// the same fact set in proper notation.
// A value worth showing on a compound page: a person's height, a person's
// weight, an hour and a half — not 1 cm.
function compoundSample(q, from) {
  var samples = { length: 175, mass: 80, time: 150 };
  var base = samples[q.id];
  if (base === undefined) { return 1; }
  var reference = { length: "cm", mass: "kg", time: "min" }[q.id];
  return C.convert(base, q.id, reference, from.id);
}

function relationship(q, from, to, sf) {
  // "1 cm = 0.0328084 ft + in" is meaningless: a compound is two units at
  // once, so the honest one-liner is a worked example.
  if (C.isCompound(to) || C.isCompound(from)) {
    var sample = C.isCompound(from) ? 1 : compoundSample(q, from);
    return esc(C.formatValue(sample, from, 6) + (C.isCompound(from) ? "" : " " + from.symbol) +
      " = " + C.formatValue(C.convert(sample, q.id, from.id, to.id), to, 6) +
      (C.isCompound(to) ? "" : " " + to.symbol));
  }
  if (q.affine) {
    var zero = C.convert(0, q.id, from.id, to.id);
    var scale = C.convert(1, q.id, from.id, to.id) - zero;
    return esc(to.symbol + " = " + from.symbol + " × " + C.format(scale, sf) +
      (zero < 0 ? " − " : " + ") + C.format(Math.abs(zero), sf));
  }
  if (from.inverse !== to.inverse) {
    return esc(from.symbol + " × " + to.symbol + " = " +
      C.format(C.convert(1, q.id, from.id, to.id), sf));
  }
  return esc("1 " + from.symbol + " = " +
    C.format(C.convert(1, q.id, from.id, to.id), sf) + " " + to.symbol);
}

// ---- proper notation --------------------------------------------------
// Real MathML, the way the science pages do it: numbers in <mn>, operators
// in <mo>, unit names in <mtext>, division as a stacked <mfrac>. Never one
// <mtext> sentence pretending to be an equation.

function mn(x) { return "<mn>" + esc(x) + "</mn>"; }
function mo(x) { return "<mo>" + esc(x) + "</mo>"; }
// A unit symbol is upright text, never an italic <mi> identifier — "L/100 km"
// set in maths italic reads as five multiplied variables.
function sym(x) { return "<mtext>" + esc(x) + "</mtext>"; }
function unitText(s) { return "<mtext>&#xA0;" + esc(s) + "</mtext>"; }
function mfrac(a, b) { return "<mfrac>" + a + b + "</mfrac>"; }
function paren(inner) {
  return "<mrow><mo>(</mo>" + inner + "<mo>)</mo></mrow>";
}
function mathBlock(inner) {
  return '    <math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow>' +
    inner + "</mrow></math>";
}

function isWhole(x) { return Math.abs(x - Math.round(x)) < 1e-9; }

// A tidy fraction for the well-known temperature scale factors, a decimal
// otherwise.
function scaleMarkup(scale) {
  if (Math.abs(scale - 5 / 9) < 1e-12) { return mfrac(mn(5), mn(9)); }
  if (Math.abs(scale - 9 / 5) < 1e-12) { return mfrac(mn(9), mn(5)); }
  return mn(C.format(scale, 10));
}

function affineMath(q, from, to) {
  var zero = C.convert(0, q.id, from.id, to.id);
  var scale = C.convert(1, q.id, from.id, to.id) - zero;
  var inner = sym(from.symbol);
  // to = scale × from + zero, or the factored to = scale × (from − a) form
  // when that is the one with the round number in it — which is how
  // everybody actually writes °F to °C.
  if (!isWhole(zero) && isWhole(zero / scale)) {
    var a = zero / scale;
    inner = paren(sym(from.symbol) + mo(a < 0 ? "−" : "+") + mn(C.format(Math.abs(a), 10)));
    return sym(to.symbol) + mo("=") + scaleMarkup(scale) + mo("×") + inner;
  }
  var out = sym(to.symbol) + mo("=") + sym(from.symbol);
  if (Math.abs(scale - 1) > 1e-12) { out += mo("×") + scaleMarkup(scale); }
  if (Math.abs(zero) > 1e-12) {
    out += mo(zero < 0 ? "−" : "+") + mn(C.format(Math.abs(zero), 10));
  }
  return out;
}

function linearMath(q, from, to) {
  return mn(1) + unitText(from.symbol) + mo("=") +
    mn(C.format(C.convert(1, q.id, from.id, to.id), 10)) + unitText(to.symbol);
}

function reciprocalMath(q, from, to) {
  var k = C.format(C.convert(1, q.id, from.id, to.id), 10);
  return sym(to.symbol) + mo("=") + mfrac(mn(k), sym(from.symbol));
}

// A compound's own definition — how many of the minor unit make one major —
// is the thing worth setting in notation.
function compoundMath(q, u, other) {
  var major = q.byId[u.compound[0]], minor = q.byId[u.compound[1]];
  return mn(1) + unitText(major.symbol) + mo("=") +
    mn(C.format(major.factor / minor.factor, 10)) + unitText(minor.symbol);
}

function pairMath(q, from, to) {
  if (C.isCompound(to)) { return compoundMath(q, to, from); }
  if (C.isCompound(from)) { return linearMath(q, q.byId[from.compound[0]], to); }
  if (q.affine) { return affineMath(q, from, to); }
  if (from.inverse !== to.inverse) { return reciprocalMath(q, from, to); }
  return linearMath(q, from, to);
}

function formulaBlock(q, from, to, quantityPage) {
  var rows = [mathBlock(pairMath(q, from, to)), mathBlock(pairMath(q, to, from))];
  var legend;
  if (C.isCompound(from) || C.isCompound(to)) {
    var compound = C.isCompound(from) ? from : to;
    var other = C.isCompound(from) ? to : from;
    var major = q.byId[compound.compound[0]], minor = q.byId[compound.compound[1]];
    rows = [mathBlock(compoundMath(q, compound, other)),
      mathBlock(linearMath(q, major, other.id === major.id ? minor : other))];
    return [
      '  <div class="formula" aria-label="' + esc(q.name) + ' conversion formula">',
      rows.join("\n"),
      "  </div>",
      '  <ul class="formula-legend"><li>The whole ' + esc(plural(major)) +
        " are kept whole and only the remainder becomes " + esc(plural(minor)) +
        ", which is why the answer reads the way people say it.</li></ul>"
    ].join("\n");
  }
  if (quantityPage) {
    legend = "Every unit in the menus is defined against " + esc(baseUnitOf(q).symbol) +
      ", so any pairing converts by the same single route.";
  } else if (q.affine) {
    legend = "Both scales are fixed against the kelvin, so the conversion is a stretch and a shift, applied in that order.";
  } else if (from.inverse !== to.inverse) {
    legend = esc(from.symbol) + " and " + esc(to.symbol) +
      " are reciprocals of one another: as one rises the other falls.";
  } else {
    legend = "Conversion goes through " + esc(baseUnitOf(q).symbol) +
      " in both directions, so neither figure is rounded on the way.";
  }
  return [
    '  <div class="formula" aria-label="' + esc(q.name) + ' conversion formula">',
    rows.join("\n"),
    "  </div>",
    '  <ul class="formula-legend"><li>' + legend + "</li></ul>"
  ].join("\n");
}

// ---- definitions ------------------------------------------------------
// A real fact about the unit, from tools/convert-copy.js. Never a
// restatement of the number already on the page, and never "the kilogram
// is 1 kg".

function unitDefinition(unit, q) {
  var note = COPY.UNIT_NOTES[q.id + "." + unit.id];
  if (note) { return note; }
  if (unit.factor === 1 && !unit.inverse && !unit.offset) {
    return "The " + singular(unit) + " (" + unit.symbol + ") is the unit " +
      "every other " + q.name.toLowerCase() + " unit on this page is defined against.";
  }
  return "The " + unit.name.toLowerCase() + " (" + unit.symbol + ") is " +
    C.format(unit.factor, 10) + " " + q.base + "." +
    (unit.exact ? " That is a definition, not a rounded measurement." :
      " That value is conventional rather than definitional.");
}


// ---- "Common questions this answers" ----------------------------------
// Real query forms with real answers, not a list of multiples. This is the
// paragraph search engines quote, so every number in it is computed, and
// every phrasing is one a person would actually type.

// The plural of a unit's name, and the name of a quantity's base unit.
// "how many kilogram in a stone" is the kind of sentence that tells a
// reader the page was assembled rather than written.
// House style for a page title is title case, as on the science pages.
// Small words stay lowercase unless they open the title.
// Google shows roughly 60 characters of a title and 155 of a description
// before truncating with an ellipsis — which would eat the "— Ans" the
// whole brand line depends on. Shed the least useful segment rather than
// let the tail be cut off.
function fitTitle(phrase, fromSymbol, toSymbol) {
  var full = phrase + " Converter — " + fromSymbol + " to " + toSymbol + " — Ans";
  if (full.length <= 60) { return full; }
  var short = phrase + " Converter — Ans";
  if (short.length <= 60) { return short; }
  return fromSymbol + " to " + toSymbol + " Converter — Ans";
}

// Drop a phrase into the middle of a sentence without inventing a capital
// letter — but leave an acronym alone ("UK MPG", "PSI", "EV").
function midSentence(phrase) {
  var first = String(phrase).split(" ")[0];
  if (first === first.toUpperCase() && first.length > 1) { return phrase; }
  return phrase.charAt(0).toLowerCase() + phrase.slice(1);
}

var SMALL_WORDS = { to: 1, in: 1, per: 1, of: 1, and: 1, the: 1, a: 1, an: 1, or: 1 };

function titleCase(phrase) {
  return String(phrase).split(" ").map(function (word, index) {
    var bare = word.toLowerCase();
    if (index > 0 && SMALL_WORDS[bare]) { return bare; }
    if (word === word.toUpperCase() && word.length > 1) { return word; }  // UK, MPG, PSI, BTU
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function plural(unit) {
  var name = COPY.PLURALS[unit.name];
  if (name) { return name; }
  var lower = unit.name.toLowerCase();
  if (/(s|x|ch|sh)$/.test(lower)) { return lower + "es"; }
  return lower + "s";
}

function singular(unit) {
  return unit.name.toLowerCase();
}

function article(word) {
  // Sound, not spelling: "an hour", "a unit".
  if (/^(hour|honest|heir)/.test(word)) { return "an "; }
  return /^[aeiou]/.test(word) ? "an " : "a ";
}

function baseUnitOf(q) {
  return q.units.filter(function (u) {
    return u.factor === 1 && !u.inverse && !u.offset;
  })[0];
}

function baseName(q) {
  var base = baseUnitOf(q);
  return base ? singular(base) : q.base;
}

function questionLine(q, from, to, sample) {
  var one = C.format(C.convert(1, q.id, from.id, to.id), 6);
  var back = C.format(C.convert(1, q.id, to.id, from.id), 6);
  var atSample = C.format(C.convert(sample, q.id, from.id, to.id), 6);
  var parts = [];
  if (C.isCompound(to) || C.isCompound(from)) {
    // The page's own sample, so the worked question matches the value the
    // page opens on and the first row of its table. Falling back to a
    // per-quantity default asked what 176 lb was, on a page about babies.
    var shown = sample !== undefined ? sample : compoundSample(q, from);
    var answer = C.convert(shown, q.id, from.id, to.id);
    parts.push("what " + C.formatValue(shown, from, 6) +
      (C.isCompound(from) ? "" : " " + from.symbol) + " is in " + plural(to) +
      " (" + C.formatValue(answer, to, 6) + (C.isCompound(to) ? "" : " " + to.symbol) + ")");
    var major = q.byId[(C.isCompound(to) ? to : from).compound[0]];
    var minor = q.byId[(C.isCompound(to) ? to : from).compound[1]];
    parts.push("how many " + plural(minor) + " make " + article(singular(major)) +
      singular(major) + " (" + C.format(major.factor / minor.factor, 6) + ")");
    // The prime-and-quote shorthand is a feet-and-inches habit; offering it
    // for stone or minutes would be inventing a notation.
    var typed = "\"5 " + major.symbol + " 9 " + minor.symbol + "\"" +
      (major.id === "ft" ? ", \"5' 9\"\"" : "") + " or just \"5 9\"";
    parts.push("and how to type it — " + typed + " are all accepted");
  } else if (q.affine) {
    // "how many X in a Y" is meaningless for a scale with an offset.
    parts.push("what " + C.format(sample, 6) + " " + from.symbol + " is in " +
      plural(to) + " (" + atSample + " " + to.symbol + ")");
    parts.push("what 0 " + from.symbol + " is (" +
      C.format(C.convert(0, q.id, from.id, to.id), 6) + " " + to.symbol + ")");
    parts.push("and why a rise of 10 " + from.symbol + " is a rise of " +
      C.format(C.convertDifference(10, q.id, from.id, to.id), 6) + " " + to.symbol +
      ", not " + C.format(C.convert(10, q.id, from.id, to.id), 6));
  } else if (from.inverse !== to.inverse) {
    // Reciprocal: "how many" would invite exactly the wrong mental model.
    parts.push("what " + C.format(sample, 6) + " " + from.symbol + " is in " +
      plural(to) + " (" + atSample + " " + to.symbol + ")");
    parts.push("what halving it does (" +
      C.format(C.convert(sample / 2, q.id, from.id, to.id), 6) + " " + to.symbol +
      ", not half of " + atSample + ")");
    parts.push("and which way round the units run — a higher " + from.symbol +
      " always means a lower " + to.symbol);
  } else {
    parts.push("how many " + plural(to) + " in " + article(singular(from)) +
      singular(from) + " (" + one + ")");
    parts.push("how many " + plural(from) + " in " + article(singular(to)) +
      singular(to) + " (" + back + ")");
    parts.push("and what " + C.format(sample, 6) + " " + from.symbol + " is in " +
      plural(to) + " (" + atSample + " " + to.symbol + ")");
  }
  return "Common questions this answers: " + parts.join(", ") + ".";
}

function scienceLink(qid) {
  var links = {
    data: ["/science/binary-hex-converter/", "Binary and hexadecimal converter"],
    datarate: ["/science/binary-hex-converter/", "Binary and hexadecimal converter"],
    pressure: ["/science/pressure/", "Pressure calculator"],
    density: ["/science/density-mass-volume/", "Density, mass and volume calculator"],
    amount: ["/science/moles-calculator/", "Moles calculator"]
  };
  return links[qid] || null;
}

function commonInstrument(q, from, to, value) {
  return [
    '  <div class="phys-fields">',
    '    <div class="phys-field"><label for="in-from">From</label><span class="phys-control"><input id="in-from" inputmode="' +
      (C.isCompound(from) ? "text" : "decimal") +
      '" autocomplete="off" value="' + esc(C.formatValue(value, from, 6)) +
      '"><select id="u-from" aria-label="Convert from unit"></select></span></div>',
    '    <div class="convert-swap-row"><button type="button" class="convert-swap" id="convert-swap" aria-label="Swap the two units">⇄ Swap</button></div>',
    '    <div class="phys-field"><label for="in-to">To</label><span class="phys-control"><input id="in-to" inputmode="decimal" autocomplete="off"><select id="u-to" aria-label="Convert to unit"></select></span></div>',
    "  </div>",
    "",
    '  <div class="tool-lcd" aria-live="polite">',
    '    <div class="tool-lcd-indicators"><span class="is-active" id="lcd-label">' + esc(from.symbol) + " → " + esc(to.symbol) + '</span><span id="lcd-note">' + (C.isExact(q.id, from.id, to.id) ? "Exact definition" : "Conventional value") + "</span></div>",
    '    <div class="tool-lcd-main" id="lcd-main">—</div>',
    '    <div class="tool-lcd-sub" id="lcd-sub"></div>',
    "  </div>",
    "",
    '  <div class="phys-aux">',
    '    <label for="u-sf">Display precision</label>',
    '    <span class="phys-control"><select id="u-sf" aria-label="Display precision"><option value="3">3 s.f.</option><option value="4">4 s.f.</option><option value="5">5 s.f.</option><option value="6" selected>6 s.f.</option><option value="7">7 s.f.</option><option value="8">8 s.f.</option><option value="9">9 s.f.</option><option value="10">10 s.f.</option></select></span>',
    "  </div>"
  ].join("\n");
}

// A page loads the engine, the one quantity it needs, and the wiring —
// never the whole registry. This is what keeps a converter page at about
// half the weight budget, and why there is no minified copy to keep in
// step any more.
function scripts(quantityId) {
  return '<script src="/assets/js/convert-core.js"></script>' +
    '<script src="/assets/js/units/' + quantityId + '.js"></script>' +
    '<script src="/assets/js/converter.js"></script>';
}

// The one paragraph every page needs to make the same point. Said the same
// way on 118 pages it was the largest block of duplicate text on the site,
// so it is phrased for the kind of quantity the page converts.
function precisionParagraph(q) {
  var tail = " The editable box always holds a plain number at full working " +
    "precision, so you can carry on from either side.";
  if (q.affine) {
    return "Display precision limits significant figures rather than decimal " +
      "places, so a reading near zero keeps its detail instead of collapsing to " +
      "one digit. Rounding is applied to the large display only, never to the " +
      "arithmetic behind it." + tail;
  }
  if (q.reciprocal) {
    return "Display precision limits significant figures rather than decimal " +
      "places, which matters here because a reciprocal magnifies rounding: a " +
      "figure trimmed at one end of the scale moves further at the other. Only " +
      "the display is rounded." + tail;
  }
  if (q.units.some(function (u) { return u.factor >= 1e9 || u.factor <= 1e-9; })) {
    return "Display precision limits significant figures rather than decimal " +
      "places, because one fixed number of decimals is useless across a range " +
      "this wide. Very large and very small results switch to scientific " +
      "notation with a proper superscript exponent." + tail;
  }
  return "Display precision sets a maximum number of significant figures and " +
    "trims trailing zeroes, so it changes what you see and never what was " +
    "calculated." + tail;
}

function ownership() {
  return [
    '  <ul class="tool-ownership" aria-label="Promise"><li><strong>Free</strong></li><li>No ads</li><li>No tracking</li><li>No account</li><li>Works offline once loaded</li></ul>',
    '  <div class="tool-crosslink"><a class="tool-crosslink-icon" href="/" aria-label="Ans scientific calculator"><img src="/assets/images/apple-touch-icon.png" alt="" width="64" height="64"></a><p>From the maker of <a href="/">Ans — a scientific calculator you can own</a>. Same idea: a proper instrument, nothing in the way.</p></div>'
  ].join("\n");
}

function jsonLd(name, slug, description) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: name,
    url: "https://anscalc.com/convert/" + slug + "/",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    description: description,
    publisher: { "@type": "Organization", name: "Ans", url: "https://anscalc.com" }
  }).replace(/</g, "\\u003c");
}

function frontMatter(title, description, slug) {
  return [
    "---",
    "layout: default",
    "title: " + title,
    "description: " + description,
    "body_class: tool-page convert-page",
    "permalink: /convert/" + slug + "/",
    "og_image: /assets/images/convert-social-card.png",
    "og_image_alt: Ans Convert — free unit converters with exact definitions and named unit systems.",
    "---"
  ].join("\n");
}

function relatedLinks(qid, currentSlug) {
  var candidates = [];
  var qSlug = quantitySlug[qid];
  if (qSlug && qSlug !== currentSlug) {
    candidates.push([qSlug, C.quantity(qid).name + " converter"]);
  }
  pairPages.filter(function (p) {
    return p.quantity === qid && p.slug !== currentSlug;
  }).slice(0, 4).forEach(function (p) {
    candidates.push([p.slug, p.phrase]);
  });
  var sci = scienceLink(qid);
  var lines = ['  <ul class="convert-pairs" aria-label="Related converters">'];
  candidates.slice(0, 5).forEach(function (x) {
    lines.push('    <li><a href="/convert/' + x[0] + '/">' + esc(x[1]) + "</a></li>");
  });
  if (sci) {
    lines.push('    <li><a href="' + sci[0] + '">' + esc(sci[1]) + "</a></li>");
  }
  lines.push('    <li><a href="/convert/">All converters</a></li>');
  lines.push("  </ul>");
  return lines.join("\n");
}

function pairRelatedLinks(page) {
  var qSlug = quantitySlug[page.quantity];
  var reverse = pairPages.find(function (p) {
    return p.quantity === page.quantity && p.from === page.to && p.to === page.from;
  });
  // Prefer siblings that share a unit with this page — those are the ones a
  // reader moves on to. Taking the first three in list order linked
  // mm-to-inches to whatever happened to sit next to it in the source array.
  var candidates = pairPages.filter(function (p) {
    return p.quantity === page.quantity && p.slug !== page.slug &&
      (!reverse || p.slug !== reverse.slug);
  });
  function shared(p) {
    return (p.from === page.from ? 2 : 0) + (p.to === page.to ? 2 : 0) +
      (p.from === page.to ? 1 : 0) + (p.to === page.from ? 1 : 0);
  }
  var adjacent = candidates.slice().sort(function (a, b) {
    return shared(b) - shared(a);
  }).slice(0, 3);
  var links = [[qSlug, C.quantity(page.quantity).name + " converter"]];
  if (reverse) { links.push([reverse.slug, reverse.phrase]); }
  adjacent.forEach(function (p) { links.push([p.slug, p.phrase]); });
  var sci = scienceLink(page.quantity);
  var lines = ['  <ul class="convert-pairs" aria-label="Related converters">'];
  links.slice(0, 5).forEach(function (x) {
    lines.push('    <li><a href="/convert/' + x[0] + '/">' + esc(x[1]) + "</a></li>");
  });
  if (sci) { lines.push('    <li><a href="' + sci[0] + '">' + esc(sci[1]) + "</a></li>"); }
  lines.push('    <li><a href="/convert/">All converters</a></li>');
  lines.push("  </ul>");
  return lines.join("\n");
}

// The quantity page adds a bullet only when it has compound units, so the
// line list carries a null that must not reach the file.
function compact(lines) {
  return lines.filter(function (line) { return line !== null; });
}

function writePage(slug, html) {
  var dir = path.join(CONVERT_ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html + "\n");
}

function quantityPage(page) {
  if (page.slug === "length") { return; } // retain the hand-written pilot
  var q = C.quantity(page.quantity);
  var from = C.unit(q.id, page.from), to = C.unit(q.id, page.to);
  var title = fitTitle(titleCase(q.name), from.symbol, to.symbol);
  var description = "Free " + q.name.toLowerCase() + " converter. Convert " +
    from.symbol + " to " + to.symbol + " and " + (q.units.length - 2) +
    " other units, each one defined. No ads or tracking.";
  var hook = COPY.QUANTITY_HOOKS[q.id];
  if (!hook) {
    throw new Error("No QUANTITY_HOOKS entry for '" + q.id + "'. A quantity page " +
      "without its own opening sentence is a template fill — write one in " +
      "tools/convert-copy.js before generating.");
  }
  var note = q.note || ("Every unit here is defined against the " + q.base + ".");
  var exactCount = q.units.filter(function (u) { return u.exact; }).length;
  // Compound units are the least discoverable thing in the menus, and for
  // length, mass and time they are a large part of why people arrive. A
  // quantity page that has them says so rather than hiding them in a list.
  var compounds = q.units.filter(function (u) { return C.isCompound(u); });
  var compoundNote = null;
  if (compounds.length) {
    var first = compounds[0];
    compoundNote = "The menus include " +
      compounds.map(function (u) { return u.symbol; }).join(" and ") +
      ", which keep the whole " + plural(q.byId[first.compound[0]]) +
      " whole and put the remainder in " + plural(q.byId[first.compound[1]]) +
      " — so a value reads " +
      C.formatValue(compoundSample(q, first), first, 6) + " rather than a decimal.";
  }
  var lines = [
    frontMatter(title, description, page.slug),
    "",
    '<div class="tool-shell">',
    '  <div class="tool-head">',
    '    <p class="eyebrow">Unit converter</p>',
    "    <h1>" + esc(q.name) + ".</h1>",
    "    <p>Convert " + esc(from.symbol) + " to " + esc(to.symbol) + ", or pick any of the " +
      q.units.length + " units in the menus. Type in either box and the other follows. " +
      esc(hook) + "</p>",
    "  </div>",
    '  <script type="application/ld+json">' + jsonLd(titleCase(q.name) + " Converter", page.slug, description) + "</script>",
    "",
    commonInstrument(q, from, to, page.value),
    "",
    tableFor(q.id, from.id, to.id, page.slug),
    "",
    formulaBlock(q, from, to, true),
    "",
    '  <section class="assumptions" aria-label="Definitions">',
    "    <h2>Definitions</h2>",
    "    <ul>",
    "      <li>" + esc(unitDefinition(from, q)) + "</li>",
    "      <li>" + esc(unitDefinition(to, q)) + "</li>",
    "      <li>" + esc(note) + "</li>",
    compoundNote ? "      <li>" + esc(compoundNote) + "</li>" : null,
    "      <li>" + (exactCount === q.units.length
      ? "Every unit in the menus is exact by definition, so the only rounding on this page is the one you choose for the display."
      : exactCount + " of the " + q.units.length +
        " units are exact by definition; the rest are conventional or measured values. The display says which kind you are looking at.") + "</li>",
    "    </ul>",
    "  </section>",
    "",
    '  <section class="tool-notes" aria-label="How it works">',
    "    <h2>How it works</h2>",
    "    <p>Every value is converted into " + esc(plural(baseUnitOf(q))) +
      " and then back out into the unit you asked for. One route covers every pairing in the menus, so an unusual combination is no less accurate than a common one, and adding a unit affects only that unit.</p>",
    "    <p>Both boxes are live. Whichever one you last typed in is the source, changing either menu recalculates straight away, and Swap exchanges the units and the values so the number you are reading stays where you are looking.</p>",
    "    <p>" + esc(precisionParagraph(q)) + "</p>",
    "    <p>" + esc(questionLine(q, from, to, page.value)) + "</p>",
    "  </section>",
    "",
    relatedLinks(q.id, page.slug),
    "",
    ownership(),
    "</div>",
    scripts(q.id),
    '<script>AnsConverter({ quantity: "' + q.id + '", from: "' + from.id +
      '", to: "' + to.id + '" });</script>'
  ];
  writePage(page.slug, compact(lines).join("\n"));
}

function pairPage(page) {
  if (page.slug === "kg-to-lbs" || page.slug === "celsius-to-fahrenheit") { return; }
  var q = C.quantity(page.quantity);
  var from = C.unit(q.id, page.from), to = C.unit(q.id, page.to);
  var sample = page.sample !== undefined ? page.sample
    : (q.affine ? 20 : (q.reciprocal ? 40 : 10));
  // A converter should land on a value worth reading. "1" is right for a
  // plain pair — 1 kg = 2.2 lb says the whole thing — but a compound page
  // opening on 1 cm shows "0 ft 0.39 in", which teaches nothing.
  var initial = (C.isCompound(from) || C.isCompound(to)) ? sample
    : (q.affine ? 20 : (q.reciprocal ? 40 : 1));
  var hook = COPY.PAIR_HOOKS[page.slug];
  if (!hook) {
    throw new Error("No PAIR_HOOKS entry for '" + page.slug + "'. If there is " +
      "nothing specific and true to say about this pair, do not build the page — " +
      "put the units in the quantity page's menus instead.");
  }
  var title = fitTitle(titleCase(page.phrase), from.symbol, to.symbol);
  var description = "Free " + from.symbol + " to " + to.symbol + " converter. Convert " +
    midSentence(page.phrase) + " and back, with each unit defined and a conversion table. No tracking.";
  var lines = [
    frontMatter(title, description, page.slug),
    "",
    '<div class="tool-shell">',
    '  <div class="tool-head">',
    '    <p class="eyebrow">Unit converter</p>',
    "    <h1>" + esc(page.phrase) + ".</h1>",
    "    <p>Convert " + esc(from.symbol) + " to " + esc(to.symbol) + " and " +
      esc(to.symbol) + " to " + esc(from.symbol) + ". Type in either box and the other follows. " +
      esc(hook) + "</p>",
    "  </div>",
    '  <script type="application/ld+json">' + jsonLd(titleCase(page.phrase) + " Converter", page.slug, description) + "</script>",
    "",
    commonInstrument(q, from, to, initial),
    "",
    tableFor(q.id, from.id, to.id, page.slug),
    "",
    formulaBlock(q, from, to, false),
    "",
    '  <section class="assumptions" aria-label="Definitions">',
    "    <h2>Definitions</h2>",
    "    <ul>",
    "      <li>" + esc(unitDefinition(from, q)) + "</li>",
    "      <li>" + esc(unitDefinition(to, q)) + "</li>",
    "      <li>" + esc(exactText(q, from, to)) + " " +
      esc(relationship(q, from, to, 10).replace(/&amp;/g, "&")) + ".</li>",
    "      <li>" + esc(q.note || (q.name + " is converted through " + baseUnitOf(q).symbol + ".")) + "</li>",
    "    </ul>",
    "  </section>",
    "",
    '  <section class="tool-notes" aria-label="How it works">',
    "    <h2>How it works</h2>",
    "    <p>" + (q.affine
      ? "The two scales differ in step size and in where they start counting, so the conversion applies a scale and a shift — and the order matters. Reversing it means undoing the shift first, then the scale."
      : q.reciprocal && from.inverse !== to.inverse
        ? "These two units run in opposite directions, so this is a division rather than a multiplication. Doubling one does not double the other; it halves it."
        : "One direction multiplies and the other divides by the same number, so nothing is lost by going back and forth.") + "</p>",
    "    <p>The value passes through " + esc(baseUnitOf(q).symbol) + ", the unit every other " + esc(q.name.toLowerCase()) + " unit on the site is defined against, rather than a number written into this page on its own. That is why the figure here, the figure in the table above and the general " +
      esc(q.name.toLowerCase()) + " converter always agree.</p>",
    "    <p>" + esc(precisionParagraph(q)) + "</p>",
    "    <p>" + esc(questionLine(q, from, to, sample)) + "</p>",
    "  </section>",
    "",
    pairRelatedLinks(page),
    "",
    ownership(),
    "</div>",
    scripts(q.id),
    '<script>AnsConverter({ quantity: "' + q.id + '", from: "' + from.id +
      '", to: "' + to.id + '" });</script>'
  ];
  writePage(page.slug, lines.join("\n"));
}

function hub() {
  var groups = [
    ["everyday", "Everyday", ["length", "mass", "temperature", "volume", "area", "speed", "time", "fuel"]],
    ["engineering", "Engineering", ["pressure", "energy", "power", "force", "torque", "flow", "massflow", "acceleration", "frequency", "angularvelocity"]],
    ["digital", "Digital & electrical", ["data", "datarate", "charge"]],
    ["science", "Science & materials", ["angle", "density", "illuminance", "radioactivity", "dose", "magneticfield", "viscosity", "kinematicviscosity", "amount", "concentration", "specificenergy", "thermalconductivity", "evefficiency"]]
  ];
  var pageCount = quantityPages.length + pairPages.length +
    handWritten.filter(function (h) { return h.label; }).length;
  var lines = [
    "---",
    "layout: default",
    "title: Free Unit Converters — Metric, Imperial and US Units — Ans",
    "description: Free unit converters with exact definitions. Convert metric, imperial, US customary and scientific units, with a conversion table on every page.",
    "body_class: tool-page convert-page convert-hub-page",
    "permalink: /convert/",
    "og_image: /assets/images/convert-social-card.png",
    "og_image_alt: Ans Convert — free unit converters with exact definitions and named unit systems.",
    "---",
    '<div class="convert-hub">',
    '  <section class="convert-hub-hero" aria-labelledby="convert-title">',
    '    <div><p class="eyebrow">Unit converters</p><h1 id="convert-title">Exact conversions, with the definition in view.</h1><p>Metric, imperial, US customary and scientific units, converted through one stated base unit. Every page says whether its values are exact definitions or conventions.</p></div>',
    '    <div class="convert-hub-lcd" aria-label="Converter catalogue summary"><span>Ans Convert</span><strong>' + pageCount + '</strong><small>free converters</small></div>',
    "  </section>",
    '  <nav class="convert-jump" aria-label="Converter groups">' +
      groups.map(function (g) { return '<a href="#' + g[0] + '">' + esc(g[1]) + "</a>"; }).join("") + "</nav>"
  ];
  groups.forEach(function (g) {
    lines.push('  <section class="convert-category" id="' + g[0] + '" aria-labelledby="' + g[0] + '-title">');
    lines.push('    <div class="convert-category-head"><div><p class="eyebrow">Converter catalogue</p><h2 id="' + g[0] + '-title">' + esc(g[1]) + '</h2></div><p>Choose a general converter or jump straight to a common conversion pair.</p></div>');
    lines.push('    <div class="convert-grid">');
    g[2].forEach(function (qid) {
      var qp = quantityPages.find(function (p) { return p.quantity === qid; });
      var q = C.quantity(qid);
      var qFrom = C.unit(qid, qp.from), qTo = C.unit(qid, qp.to);
      lines.push('      <a class="convert-card" href="/convert/' + qp.slug + '/"><span>' + esc(q.name) + '</span><strong>' + esc(q.name) + ' converter</strong><small>' + q.units.length + ' units, from ' + esc(qFrom.name.toLowerCase()) + ' to ' + esc(qTo.name.toLowerCase()) + '.</small></a>');
      pairPages.filter(function (p) { return p.quantity === qid; }).forEach(function (p) {
        var pf = C.unit(qid, p.from), pt = C.unit(qid, p.to);
        lines.push('      <a class="convert-card" href="/convert/' + p.slug + '/"><span>' + esc(pf.symbol) + ' → ' + esc(pt.symbol) + '</span><strong>' + esc(p.phrase) + '</strong><small>' + relationship(q, pf, pt, 6) + '.</small></a>');
      });
      handWritten.filter(function (h) {
        return h.quantity === qid && h.label;
      }).forEach(function (h) {
        lines.push('      <a class="convert-card" href="/convert/' + h.slug + '/"><span>' +
          esc(q.name) + '</span><strong>' + esc(h.label) + '</strong><small>' +
          esc(h.blurb) + "</small></a>");
      });
    });
    lines.push("    </div>");
    lines.push("  </section>");
  });
  lines.push('  <section class="convert-honesty" aria-labelledby="honesty-title"><p class="eyebrow">Same name, different unit</p><h2 id="honesty-title">A pint is not a pint.</h2><p>US and imperial volumes are named separately; decimal and binary data prefixes stay distinct; force is not mass; energy is not torque; and reciprocal economy units are never treated as ordinary multipliers.</p></section>');
  lines.push(ownership());
  lines.push("</div>");
  lines.push('<script type="application/ld+json">' + JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ans Unit Converters",
    url: "https://anscalc.com/convert/",
    description: "Free unit converters with exact definitions, named systems and static conversion tables.",
    isPartOf: { "@type": "WebSite", name: "Ans", url: "https://anscalc.com/" }
  }) + "</script>");
  fs.writeFileSync(path.join(CONVERT_ROOT, "index.html"), lines.join("\n") + "\n");
}

function updateLlms() {
  var target = path.join(ROOT, "llms.txt");
  var marker = "# Unit converters (generated catalogue)";
  var existing = fs.readFileSync(target, "utf8");
  var markerAt = existing.indexOf(marker);
  if (markerAt >= 0) { existing = existing.slice(0, markerAt).trimEnd(); }
  var files = [path.join(CONVERT_ROOT, "index.html")].concat(
    fs.readdirSync(CONVERT_ROOT).filter(function (name) {
      return fs.existsSync(path.join(CONVERT_ROOT, name, "index.html"));
    }).sort().map(function (name) { return path.join(CONVERT_ROOT, name, "index.html"); })
  );
  var lines = [
    marker,
    "Unit converter promise: Free. No ads. No tracking. No account. Every page names its unit system and states whether its values are exact definitions."
  ];
  files.forEach(function (file) {
    var html = fs.readFileSync(file, "utf8");
    var permalink = /^permalink:\s*(\S+)\s*$/m.exec(html);
    var description = /^description:\s*(.+)\s*$/m.exec(html);
    if (permalink && description) {
      lines.push("https://anscalc.com" + permalink[1] + " — " + description[1]);
    }
  });
  fs.writeFileSync(target, existing + "\n\n" + lines.join("\n") + "\n");
}

// Exported so the page tests can rebuild a table exactly the way a page
// was built — value ladder, caption and all — instead of keeping a second
// copy of those rules that could quietly disagree.
module.exports = { tableFor: tableFor, pairPages: pairPages,
  quantityPages: quantityPages, handWritten: handWritten };

if (require.main === module) {
  quantityPages.forEach(quantityPage);
  pairPages.forEach(pairPage);
  hub();
  updateLlms();

  console.log("Generated " + (quantityPages.length - 1) + " quantity pages and " +
    pairPages.length + " pair pages; retained 3 hand-written pilots.");
}
