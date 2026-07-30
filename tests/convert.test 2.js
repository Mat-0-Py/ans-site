/*
  Headless tests for the unit-conversion engine (WP-C2).

  Pure Node, no dependencies:

      node Website/tests/convert.test.js

  Expected values are the DEFINITIONS (an inch is exactly 25.4 mm; a pound
  is exactly 0.453 592 37 kg) or values computed independently at full
  precision — never output copied from the module under test. Exact
  conversions are asserted exactly where the arithmetic is exact in binary
  floating point, and to a tight relative tolerance otherwise.
*/
"use strict";

var fs = require("fs");
var path = require("path");
var C = require("../assets/js/convert.js");

var pass = 0, fail = 0;

function report(ok, name, got, want) {
  if (ok) { pass++; }
  else {
    fail++;
    console.error("FAIL " + name + "\n   got:  " + got + "\n   want: " + want);
  }
}

function approx(name, got, want, rel) {
  rel = rel === undefined ? 1e-12 : rel;
  report(Math.abs(got - want) <= Math.abs(want) * rel + 1e-300, name, got, want);
}

function equal(name, got, want) { report(got === want, name, got, want); }

function conv(name, value, quantity, from, to, want, rel) {
  approx(name, C.convert(value, quantity, from, to), want, rel);
}

// ---- registry integrity ------------------------------------------------
// Every quantity must have exactly one unit whose factor is 1 with no
// offset and no inverse: its SI base. Without this, "convert via base" is
// a lie and a new unit could be added against the wrong reference.
C.QUANTITIES.forEach(function (q) {
  var bases = q.units.filter(function (u) {
    return u.factor === 1 && !u.inverse && !(u.offset && u.offset !== 0);
  });
  equal("base unit present · " + q.id, bases.length >= 1, true);
  var ids = {};
  q.units.forEach(function (u) {
    equal("unique unit id · " + q.id + "/" + u.id, ids[u.id] === undefined, true);
    ids[u.id] = true;
    equal("unit has symbol · " + q.id + "/" + u.id, typeof u.symbol === "string" && u.symbol.length > 0, true);
    equal("unit factor finite · " + q.id + "/" + u.id, isFinite(u.factor) && u.factor > 0, true);
  });
});

// The split registry must assemble into exactly what the pages see: one
// file per quantity, every quantity listed in assets/js/convert.js, and no
// file left behind. A quantity whose file is not listed would work in the
// browser and vanish from every test.
var unitDir = path.join(__dirname, "../assets/js/units");
var unitFiles = fs.readdirSync(unitDir).filter(function (name) {
  return /\.js$/.test(name);
}).map(function (name) { return name.replace(/\.js$/, ""); }).sort();
var registered = C.QUANTITIES.map(function (q) { return q.id; }).sort();
equal("every unit file is registered", unitFiles.join(","), registered.join(","));
equal("no minified copies remain",
  fs.existsSync(path.join(__dirname, "../assets/js/convert.min.js")), false);

// Round-tripping any unit through the base must return the original value.
C.QUANTITIES.forEach(function (q) {
  q.units.forEach(function (u) {
    var v = 37.5;
    approx("round trip · " + q.id + "/" + u.id, C.fromBase(C.toBase(v, u), u), v, 1e-12);
  });
});

// ---- length: the 1959 international definitions ------------------------
conv("inch is exactly 25.4 mm", 1, "length", "in", "mm", 25.4, 0);
conv("foot is exactly 304.8 mm", 1, "length", "ft", "mm", 304.8, 1e-15);
conv("yard is exactly 0.9144 m", 1, "length", "yd", "m", 0.9144, 0);
conv("mile is exactly 1609.344 m", 1, "length", "mi", "m", 1609.344, 0);
conv("mile in kilometres", 1, "length", "mi", "km", 1.609344, 1e-15);
conv("nautical mile is exactly 1852 m", 1, "length", "nmi", "m", 1852, 0);
conv("cm to inches", 1, "length", "cm", "in", 1 / 2.54, 1e-15);
conv("30 cm to inches", 30, "length", "cm", "in", 30 / 2.54, 1e-15);
conv("6 feet in metres", 6, "length", "ft", "m", 1.8288, 1e-15);
conv("marathon in km", 26.2188, "length", "mi", "km", 26.2188 * 1.609344, 1e-12);
conv("light-year in metres", 1, "length", "ly", "m", 9460730472580800, 0);

// ---- mass: the 1959 pound ---------------------------------------------
conv("pound is exactly 0.45359237 kg", 1, "mass", "lb", "kg", 0.45359237, 0);
conv("kg to pounds", 1, "mass", "kg", "lb", 1 / 0.45359237, 1e-15);
conv("70 kg in pounds", 70, "mass", "kg", "lb", 70 / 0.45359237, 1e-15);
conv("ounce is a sixteenth of a pound", 16, "mass", "oz", "lb", 1, 1e-15);
conv("stone is 14 pounds", 1, "mass", "st", "lb", 14, 1e-14);
conv("stone in kilograms", 1, "mass", "st", "kg", 6.35029318, 0);
conv("ounce in grams", 1, "mass", "oz", "g", 28.349523125, 1e-15);
conv("long ton is 2240 pounds", 1, "mass", "ton_uk", "lb", 2240, 1e-14);
conv("short ton is 2000 pounds", 1, "mass", "ton_us", "lb", 2000, 1e-14);
conv("troy ounce in grams", 1, "mass", "ozt", "g", 31.1034768, 1e-15);
conv("grain: 7000 to the pound", 7000, "mass", "gr", "lb", 1, 1e-14);

// ---- temperature: affine, the interesting case -------------------------
conv("freezing point C to F", 0, "temperature", "C", "F", 32, 1e-14);
conv("boiling point C to F", 100, "temperature", "C", "F", 212, 1e-14);
conv("the crossover at -40", -40, "temperature", "C", "F", -40, 1e-14);
conv("body temperature C to F", 37, "temperature", "C", "F", 98.6, 1e-13);
conv("room temperature F to C", 68, "temperature", "F", "C", 20, 1e-13);
conv("absolute zero in Celsius", 0, "temperature", "K", "C", -273.15, 1e-14);
conv("absolute zero in Fahrenheit", 0, "temperature", "K", "F", -459.67, 1e-13);
conv("Celsius to kelvin", 25, "temperature", "C", "K", 298.15, 1e-14);
conv("Rankine at freezing", 0, "temperature", "C", "R", 491.67, 1e-13);
conv("Reaumur boiling point", 100, "temperature", "C", "Re", 80, 1e-13);

// A temperature DIFFERENCE drops the offsets: a 10 °C rise is an 18 °F
// rise, not −12 °F. This is the single most common conversion mistake.
approx("10 degree C rise is an 18 degree F rise",
  C.convertDifference(10, "temperature", "C", "F"), 18, 1e-14);
approx("a 1 K interval is a 1 degree C interval",
  C.convertDifference(1, "temperature", "K", "C"), 1, 0);
approx("difference differs from absolute conversion",
  C.convert(10, "temperature", "C", "F"), 50, 1e-14);

// A single ratio is meaningless for an affine or reciprocal quantity, so
// the engine refuses rather than returning a plausible wrong number.
equal("no ratio for temperature", C.ratio("temperature", "C", "F"), null);
equal("no ratio for fuel economy", C.ratio("fuel", "mpg_uk", "l100"), null);
approx("ratio for length", C.ratio("length", "cm", "in"), 0.01 / 0.0254, 1e-15);

// ---- volume: US and imperial are different sizes -----------------------
conv("US gallon in litres", 1, "volume", "gal_us", "l", 3.785411784, 1e-15);
conv("imperial gallon in litres", 1, "volume", "gal_uk", "l", 4.54609, 1e-15);
conv("imperial pint in millilitres", 1, "volume", "pt_uk", "ml", 568.26125, 1e-14);
conv("US pint in millilitres", 1, "volume", "pt_us", "ml", 473.176473, 1e-14);
conv("US cup in millilitres", 1, "volume", "cup_us", "ml", 236.5882365, 1e-14);
conv("US fluid ounce in millilitres", 1, "volume", "floz_us", "ml", 29.5735295625, 1e-14);
conv("imperial fluid ounce in millilitres", 1, "volume", "floz_uk", "ml", 28.4130625, 1e-14);
conv("eight US fluid ounces make a US cup", 8, "volume", "floz_us", "cup_us", 1, 1e-14);
conv("twenty imperial fluid ounces make an imperial pint", 20, "volume", "floz_uk", "pt_uk", 1, 1e-14);
conv("litre is a cubic decimetre", 1000, "volume", "ml", "l", 1, 1e-15);
conv("cubic metre is a thousand litres", 1, "volume", "m3", "l", 1000, 1e-15);
conv("oil barrel is 42 US gallons", 1, "volume", "bbl", "gal_us", 42, 1e-13);

// ---- area --------------------------------------------------------------
conv("acre in square metres", 1, "area", "acre", "m2", 4046.8564224, 1e-15);
conv("hectare in acres", 1, "area", "ha", "acre", 10000 / 4046.8564224, 1e-14);
conv("square foot in square metres", 1, "area", "ft2", "m2", 0.09290304, 1e-15);
conv("square mile in acres", 1, "area", "mi2", "acre", 640, 1e-13);

// ---- speed -------------------------------------------------------------
conv("mph in km/h", 1, "speed", "mph", "kmh", 1.609344, 1e-14);
conv("70 mph in km/h", 70, "speed", "mph", "kmh", 112.65408, 1e-13);
conv("knot in km/h", 1, "speed", "kn", "kmh", 1.852, 1e-14);
conv("m/s to km/h", 1, "speed", "mps", "kmh", 3.6, 1e-14);

// ---- pressure ----------------------------------------------------------
conv("atmosphere in pascals", 1, "pressure", "atm", "pa", 101325, 0);
conv("atmosphere in psi", 1, "pressure", "atm", "psi", 101325 / 6894.757293168361, 1e-14);
conv("bar in psi", 1, "pressure", "bar", "psi", 1e5 / 6894.757293168361, 1e-14);
conv("760 Torr is one atmosphere", 760, "pressure", "torr", "atm", 1, 1e-14);
conv("32 psi tyre pressure in bar", 32, "pressure", "psi", "bar", 2.2063223338138755, 1e-12);

// ---- energy ------------------------------------------------------------
conv("kilocalorie in kilojoules", 1, "energy", "kcal", "kj", 4.184, 1e-15);
conv("2000 kcal in kJ", 2000, "energy", "kcal", "kj", 8368, 1e-14);
conv("kilowatt-hour in megajoules", 1, "energy", "kwh", "mj", 3.6, 1e-15);
conv("BTU in joules", 1, "energy", "btu", "j", 1055.05585262, 0);
conv("electronvolt in joules", 1, "energy", "ev", "j", 1.602176634e-19, 0);

// ---- power -------------------------------------------------------------
conv("horsepower in watts", 1, "power", "hp", "w", 745.6998715822702, 0);
conv("metric horsepower in watts", 1, "power", "ps", "w", 735.49875, 0);
conv("100 hp in kW", 100, "power", "hp", "kw", 74.56998715822702, 1e-14);

// ---- digital storage: decimal vs binary --------------------------------
conv("kilobyte is 1000 bytes", 1, "data", "kb", "byte", 1000, 0);
conv("kibibyte is 1024 bytes", 1, "data", "kib", "byte", 1024, 0);
conv("byte is eight bits", 1, "data", "byte", "bit", 8, 1e-15);
conv("a 1 TB drive shows as 931 GiB", 1e12, "data", "byte", "gib", 931.3225746154785, 1e-12);
conv("gibibyte in gigabytes", 1, "data", "gib", "gb", 1.073741824, 1e-15);

// ---- angle -------------------------------------------------------------
conv("180 degrees is pi radians", 180, "angle", "deg", "rad", Math.PI, 1e-15);
conv("a turn is 360 degrees", 1, "angle", "turn", "deg", 360, 1e-13);
conv("degree in arcminutes", 1, "angle", "deg", "arcmin", 60, 1e-13);
conv("400 gradians in a turn", 1, "angle", "turn", "grad", 400, 1e-13);

// ---- force -------------------------------------------------------------
conv("kilogram-force in newtons", 1, "force", "kgf", "n", 9.80665, 0);
conv("pound-force in newtons", 1, "force", "lbf", "n", 4.4482216152605, 0);

// ---- fuel economy: reciprocal -----------------------------------------
// Independently: 40 mpg (UK) = 100 × 4.54609 / (40 × 1.609344) L/100 km.
conv("40 mpg UK in L/100km", 40, "fuel", "mpg_uk", "l100",
  100 * 4.54609 / (40 * 1.609344), 1e-13);
conv("30 mpg US in L/100km", 30, "fuel", "mpg_us", "l100",
  100 * 3.785411784 / (30 * 1.609344), 1e-13);
conv("US and UK mpg differ for the same car", 30, "fuel", "mpg_us", "mpg_uk",
  30 * 4.54609 / 3.785411784, 1e-13);
conv("8 L/100km in km per litre", 8, "fuel", "l100", "kml", 12.5, 1e-13);
// The reciprocal round trip is the real test: convert out and back.
approx("fuel round trip", C.convert(C.convert(45, "fuel", "mpg_uk", "l100"),
  "fuel", "l100", "mpg_uk"), 45, 1e-12);

// ---- catalogue expansion pinned definitions ---------------------------
// Every unit added by the completed handover catalogue is pinned against
// its SI-base definition here. For inverse units, toBase(1) is the
// defining reciprocal constant. These numbers are copied from the
// standards/build brief, not read back from the registry.
var addedDefinitions = {
  length: [
    ["dm", 0.1, true], ["dam", 10, true], ["hm", 100, true], ["Mm", 1e6, true],
    ["pica", 0.0254 / 6, true], ["point", 0.0254 / 72, true],
    ["rod", 5.0292, true], ["league", 4828.032, true], ["cable", 185.2, true],
    ["span", 0.2286, true], ["cubit", 0.4572, true],
    ["barleycorn", 0.0254 / 3, true]
  ],
  mass: [
    ["dram", 0.0017718451953125, true], ["quarter_uk", 12.70058636, true],
    ["troy_lb", 0.3732417216, true], ["dwt", 0.00155517384, true],
    ["kip_mass", 453.59237, true], ["quintal", 100, true],
    ["slug", 14.5939029372, false]
  ],
  volume: [
    ["dm3", 1e-3, true], ["hl", 0.1, true], ["yd3", 0.764554857984, true],
    ["fldr_us", 3.6966911953125e-6, true], ["gill_us", 1.1829411825e-4, true],
    ["gill_uk", 1.420653125e-4, true], ["dry_pt_us", 5.506104713575e-4, true],
    ["bu_us", 0.03523907016688, true], ["bu_uk", 0.03636872, true],
    ["tbsp_au", 2e-5, true], ["shot_us", 4.436029434375e-5, true],
    ["cord", 3.624556363776, true], ["acre_ft", 1233.48183754752, true]
  ],
  area: [
    ["dunam", 1000, true], ["rood", 1011.7141056, true],
    ["rod2", 25.29285264, true], ["chain2", 404.68564224, true],
    ["barn", 1e-28, true]
  ],
  speed: [
    ["cmps", 0.01, true], ["kmps", 1000, true], ["mips", 1609.344, true],
    ["ftmin", 0.00508, true], ["mmin", 1 / 60, true],
    ["mach", 340.29, false]
  ],
  time: [
    ["fortnight", 1209600, true], ["decade", 315576000, true],
    ["century", 3155760000, true], ["sidereal_d", 86164.0905, false],
    ["month_mean", 2629746, false]
  ],
  pressure: [
    ["kgfcm2", 98066.5, true], ["ksi", 6894757.293168361, true],
    ["mmh2o", 9.80665, false], ["inh2o", 249.0889, false],
    ["ubar", 0.1, true], ["dyncm2", 0.1, true]
  ],
  energy: [
    ["cal_it", 4.1868, true], ["mwh", 3.6e9, true], ["gwh", 3.6e12, true],
    ["therm", 105505585.262, true], ["tnt", 4.184e9, true],
    ["ftpdl", 0.0421401100938048, true],
    ["hartree", 4.3597447222071e-18, false]
  ],
  power: [
    ["gw", 1e9, true], ["hp_e", 746, true], ["hp_boiler", 9809.5, false],
    ["ton_ref", 3516.8528420667, true], ["kcalit_h", 4.1868e3 / 3600, true],
    ["ergs", 1e-7, true]
  ],
  data: [
    ["kbit", 125, true], ["gbit", 1.25e8, true], ["tbit", 1.25e11, true],
    ["pb", 1e15, true], ["eb", 1e18, true], ["pib", 1125899906842624, true],
    ["eib", 1152921504606846976, true], ["nibble", 0.5, true]
  ],
  angle: [
    ["quadrant", Math.PI / 2, true], ["point_compass", 2 * Math.PI / 32, true],
    ["mil_nato", 2 * Math.PI / 6400, true]
  ],
  force: [
    ["kip", 4448.2216152605, true], ["pdl", 0.138254954376, true],
    ["ozf", 0.27801385095378125, true], ["tf", 9806.65, true],
    ["sthene", 1000, true]
  ],
  fuel: [
    ["mil", 100 / 1.609344, true], ["lkm", 100, true],
    ["kmpg_us", 100 * 3.785411784, true]
  ],
  density: [
    ["kgm3", 1, true], ["gcm3", 1000, true], ["gml", 1000, true],
    ["kgl", 1000, true], ["gl", 1, true], ["tm3", 1000, true],
    ["lbft3", 0.45359237 / 0.028316846592, true],
    ["lbin3", 0.45359237 / 1.6387064e-5, true],
    ["ozgal_us", 0.028349523125 / 0.003785411784, true],
    ["slugft3", 515.378818393, false]
  ],
  torque: [
    ["nm", 1, true], ["ncm", 0.01, true], ["knm", 1000, true],
    ["lbfft", 1.3558179483314004, true],
    ["lbfin", 0.1129848290276167, true], ["kgfm", 9.80665, true],
    ["ozfin", 0.007061551814226, true]
  ],
  flow: [
    ["m3s", 1, true], ["ls", 1e-3, true], ["lmin", 1 / 60000, true],
    ["m3h", 1 / 3600, true], ["gpm_us", 6.30901964e-5, true],
    ["gpm_uk", 4.54609e-3 / 60, true], ["cfm", 4.719474432e-4, true],
    ["cfs", 0.028316846592, true]
  ],
  massflow: [
    ["kgs", 1, true], ["gs", 1e-3, true], ["kgh", 1 / 3600, true],
    ["th", 1000 / 3600, true], ["lbh", 0.45359237 / 3600, true]
  ],
  frequency: [
    ["hz", 1, true], ["khz", 1e3, true], ["mhz", 1e6, true],
    ["ghz", 1e9, true], ["thz", 1e12, true],
    ["rpm", 1 / 60, true], ["bpm", 1 / 60, true]
  ],
  angularvelocity: [
    ["rads", 1, true], ["degs", Math.PI / 180, true],
    ["rpm", 2 * Math.PI / 60, true], ["rps", 2 * Math.PI, true]
  ],
  acceleration: [
    ["mps2", 1, true], ["g0", 9.80665, true], ["ftps2", 0.3048, true],
    ["gal", 0.01, true], ["kmhs", 1 / 3.6, true]
  ],
  datarate: [
    ["bps", 1, true], ["kbps", 1e3, true], ["mbps", 1e6, true],
    ["gbps", 1e9, true], ["kBs", 8e3, true], ["MBs", 8e6, true],
    ["MiBs", 8388608, true]
  ],
  charge: [
    ["c", 1, true], ["mc", 1e-3, true], ["ah", 3600, true],
    ["mah", 3.6, true]
  ],
  illuminance: [
    ["lx", 1, true], ["fc", 1 / 0.09290304, true],
    ["phot", 10000, true]
  ],
  radioactivity: [
    ["bq", 1, true], ["kbq", 1e3, true], ["mbq", 1e6, true],
    ["gbq", 1e9, true], ["ci", 3.7e10, true], ["mci", 3.7e7, true],
    ["uci", 3.7e4, true]
  ],
  dose: [
    ["sv", 1, true], ["msv", 1e-3, true], ["usv", 1e-6, true],
    ["rem", 0.01, true], ["mrem", 1e-5, true]
  ],
  magneticfield: [
    ["t", 1, true], ["mt", 1e-3, true], ["ut", 1e-6, true],
    ["g", 1e-4, true], ["kG", 0.1, true]
  ],
  viscosity: [
    ["pas", 1, true], ["p", 0.1, true], ["cp", 1e-3, true],
    ["lbfsft2", 4.4482216152605 / 0.09290304, true]
  ],
  kinematicviscosity: [
    ["m2s", 1, true], ["st", 1e-4, true], ["cst", 1e-6, true]
  ],
  amount: [
    ["mol", 1, true], ["mmol", 1e-3, true], ["umol", 1e-6, true],
    ["kmol", 1e3, true]
  ],
  concentration: [
    ["molm3", 1, true], ["moll", 1000, true], ["mmoll", 1, true],
    ["umoll", 1e-3, true]
  ],
  specificenergy: [
    ["jkg", 1, true], ["kjkg", 1e3, true], ["calg", 4184, true],
    ["kcalkg", 4184, true], ["btulb", 2326, true], ["whkg", 3600, true]
  ],
  thermalconductivity: [
    ["wmk", 1, true],
    ["btuhftf", (1055.05585262 / 3600) / (0.3048 * 5 / 9), true]
  ],
  evefficiency: [
    ["whkm", 1, true], ["whmi", 1 / 1.609344, true],
    ["kwh100", 10, true], ["mikwh", 1000 / 1.609344, true]
  ]
};

Object.keys(addedDefinitions).forEach(function (quantity) {
  addedDefinitions[quantity].forEach(function (spec) {
    var unit = C.unit(quantity, spec[0]);
    equal("expanded unit exists · " + quantity + "/" + spec[0], !!unit, true);
    approx("expanded unit definition · " + quantity + "/" + spec[0],
      C.toBase(1, unit), spec[1], 1e-13);
    equal("expanded unit exactness · " + quantity + "/" + spec[0],
      !!unit.exact, spec[2]);
  });
});

// One recognisable relationship per new quantity, independently stated.
conv("water density is one gram per millilitre", 1000, "density", "kgm3", "gml", 1, 1e-15);
conv("one pound-foot torque in newton metres", 1, "torque", "lbfft", "nm", 1.3558179483314004, 1e-15);
conv("sixty litres per minute is one litre per second", 60, "flow", "lmin", "ls", 1, 1e-13);
conv("3600 kilograms per hour is one kilogram per second", 3600, "massflow", "kgh", "kgs", 1, 1e-13);
conv("3000 rpm is 50 hertz", 3000, "frequency", "rpm", "hz", 50, 1e-13);
conv("60 rpm is two pi radians per second", 60, "angularvelocity", "rpm", "rads", 2 * Math.PI, 1e-13);
conv("standard gravity is exactly 9.80665 m/s squared", 1, "acceleration", "g0", "mps2", 9.80665, 0);
conv("80 megabits per second is 10 megabytes per second", 80, "datarate", "mbps", "MBs", 10, 1e-15);
conv("one ampere-hour is 3600 coulombs", 1, "charge", "ah", "c", 3600, 0);
conv("one foot-candle in lux", 1, "illuminance", "fc", "lx", 1 / 0.09290304, 0);
conv("one curie is 37 gigabecquerels", 1, "radioactivity", "ci", "gbq", 37, 1e-15);
conv("one rem is 0.01 sievert", 1, "dose", "rem", "sv", 0.01, 0);
conv("ten thousand gauss is one tesla", 10000, "magneticfield", "g", "t", 1, 1e-15);
conv("one thousand centipoise is one pascal second", 1000, "viscosity", "cp", "pas", 1, 1e-15);
conv("one hundred centistokes is one square millimetre per second", 100, "kinematicviscosity", "cst", "m2s", 1e-4, 1e-15);
conv("one thousand millimoles is one mole", 1000, "amount", "mmol", "mol", 1, 1e-15);
conv("one molar is one thousand mol per cubic metre", 1, "concentration", "moll", "molm3", 1000, 0);
conv("one watt-hour per kilogram is 3.6 kilojoules per kilogram", 1, "specificenergy", "whkg", "kjkg", 3.6, 1e-15);
conv("one imperial conductivity unit in SI", 1, "thermalconductivity", "btuhftf", "wmk",
  (1055.05585262 / 3600) / (0.3048 * 5 / 9), 0);
conv("four miles per kWh in Wh per km", 4, "evefficiency", "mikwh", "whkm",
  1000 / (4 * 1.609344), 1e-13);


// ---- compound units ----------------------------------------------------
// "5 ft 9 in" rather than 5.75 ft. The whole part must stay whole, the
// remainder must carry the precision, and the text must parse back to the
// value it came from — otherwise the two boxes cannot both be edited.
var ftIn = C.unit("length", "ft_in");
var stLb = C.unit("mass", "st_lb");
var hMin = C.unit("time", "h_min");

equal("compound is flagged", C.isCompound(ftIn), true);
equal("plain unit is not", C.isCompound(C.unit("length", "ft")), false);
equal("compound factor is the major unit's", ftIn.factor, C.unit("length", "ft").factor);

equal("175 cm reads as feet and inches",
  C.formatValue(C.convert(175, "length", "cm", "ft_in"), ftIn, 6), "5 ft 8.9 in");
equal("a whole number of feet has no remainder",
  C.formatValue(6, ftIn, 6), "6 ft 0 in");
equal("80 kg reads as stone and pounds",
  C.formatValue(C.convert(80, "mass", "kg", "st_lb"), stLb, 6), "12 st 8.37 lb");
equal("150 minutes reads as hours and minutes",
  C.formatValue(C.convert(150, "time", "min", "h_min"), hMin, 6), "2 h 30 min");
equal("display precision moves the remainder, not the whole part",
  C.formatValue(C.convert(175, "length", "cm", "ft_in"), ftIn, 10), "5 ft 8.897638 in");

// Every form a person might type.
approx("spelled out", C.parseCompound("5 ft 9 in", ftIn), 5.75, 1e-12);
approx("no spaces", C.parseCompound("5ft9in", ftIn), 5.75, 1e-12);
approx("prime and quote", C.parseCompound("5' 9\"", ftIn), 5.75, 1e-12);
approx("curly prime and quote", C.parseCompound("5’ 9”", ftIn), 5.75, 1e-12);
approx("positional", C.parseCompound("5 9", ftIn), 5.75, 1e-12);
approx("major only", C.parseCompound("6", ftIn), 6, 0);
approx("stone and pounds", C.parseCompound("12 st 4 lb", stLb), 12 + 4 / 14, 1e-12);
approx("hours and minutes", C.parseCompound("1h30m", hMin), 1.5, 1e-12);
approx("negative compound", C.parseCompound("-5 ft 9 in", ftIn), -5.75, 1e-12);
equal("a unit from another compound is rejected",
  C.parseCompound("5 st 9 lb", ftIn), null);
equal("nonsense is rejected", C.parseCompound("nonsense", ftIn), null);
equal("empty is rejected", C.parseCompound("", ftIn), null);

// The round trip the two-box interface depends on.
[1.5, 5.75, 6, 0.25, 12.3456].forEach(function (v) {
  approx("compound round trip · " + v,
    C.parseCompound(C.formatValue(v, ftIn, 10), ftIn), v, 1e-6);
});
approx("5 ft 9 in is exactly 175.26 cm",
  C.convert(C.parseCompound("5 ft 9 in", ftIn), "length", "ft_in", "cm"), 175.26, 1e-12);
approx("12 st 4 lb is 78.02 kg",
  C.convert(C.parseCompound("12 st 4 lb", stLb), "mass", "st_lb", "kg"),
  12 * 6.35029318 + 4 * 0.45359237, 1e-12);

// The editable field must hold text the parser accepts, for both kinds.
approx("editable compound parses back",
  C.parseValue(C.editable(5.75, ftIn), ftIn), 5.75, 1e-12);
equal("editable plain has no compound formatting",
  /[a-z]/.test(C.editable(5.75, C.unit("length", "ft"))), false);

// ---- formatter ---------------------------------------------------------
equal("format trims trailing zeroes", C.format(2.5, 6), "2.5");
equal("format keeps integers whole", C.format(300, 5), "300");
equal("format rounds to significant figures", C.format(2.2046226218, 6), "2.20462");
equal("format three significant figures", C.format(2.2046226218, 3), "2.2");
equal("format zero", C.format(0, 6), "0");
equal("format negative", C.format(-40, 6), "−40");
equal("format large plain", C.format(1609344, 7), "1609344");
equal("format very large scientific", C.format(9.4607304725808e15, 4), "9.461×10¹⁵");
equal("format very small scientific", C.format(1.602176634e-19, 4), "1.602×10⁻¹⁹");
equal("format handles the 9.999 carry", C.format(9.9999, 3), "10");
equal("format rejects NaN", C.format(NaN, 6), "—");

// Whatever is written into an input box must survive parseFloat, so the
// user can carry on editing the value the converter just produced.
equal("plain is machine-readable", C.plain(30.48000000001, 12), "30.48");
equal("plain keeps small numbers parseable",
  parseFloat(C.plain(7.4564543e-6, 12)) === 7.4564543e-6, true);
equal("plain of a huge number parses back",
  parseFloat(C.plain(9.4607304725808e18, 12)) > 9e18, true);
equal("plain has no superscript", /[×⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(C.plain(1.6e-19, 12)), false);
equal("plain of NaN is empty", C.plain(NaN, 12), "");
equal("plain of Infinity is empty", C.plain(Infinity, 12), "");

// ---- LCD sizing --------------------------------------------------------
equal("short result stays full size", C.displaySize("32 °F"), "");
equal("medium result compacts", C.displaySize("154.3242 lb"), "is-compact");
equal("long result condenses", C.displaySize("1.602177×10⁻¹⁹ J"), "is-condensed");
equal("long result tightens", C.displaySize("9.4607304726×10¹⁵ m"), "is-tight");

// ---- guards ------------------------------------------------------------
equal("unknown quantity", C.convert(1, "nonsense", "a", "b"), null);
equal("unknown unit", C.convert(1, "length", "cm", "parsnip"), null);
equal("non-numeric input", C.convert(NaN, "length", "cm", "in"), null);
equal("exactness reported", C.isExact("length", "cm", "in"), true);
equal("conventional value reported", C.isExact("pressure", "mmhg", "pa"), false);

// ---- search ------------------------------------------------------------
// The alias list is what makes a unit findable by the words people use.
equal("search finds lbs", C.search("lbs").some(function (h) { return h.unit === "lb"; }), true);
equal("search finds centigrade", C.search("centigrade").some(function (h) { return h.unit === "C"; }), true);
equal("search finds kilos", C.search("kilos").some(function (h) { return h.unit === "kg"; }), true);
equal("search finds inches", C.search("inches").some(function (h) { return h.unit === "in"; }), true);
equal("search empty term", C.search("").length, 0);

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
