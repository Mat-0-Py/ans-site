/*
  Headless maths tests for the physics calculators (WP-P2).

  Known input/output pairs and edge cases, in the style of the stopwatch/
  clock suites. Pure Node, no dependencies:

      node Website/tests/physics.test.js

  Expected physics values were computed independently (Python, full
  precision) and are pinned here; the module must reproduce them within a
  tight relative tolerance. Formatter cases pin the display strings.
*/
"use strict";

var P = require("../assets/js/physics.js");
var G = P.gaussianBeam;

var pass = 0, fail = 0;

function approx(name, got, want, rel) {
  rel = rel || 1e-9;
  var ok = want === Infinity
    ? got === Infinity
    : Math.abs(got - want) <= Math.abs(want) * rel + 1e-300;
  report(ok, name, got, want);
}

function equal(name, got, want) {
  report(got === want, name, got, want);
}

function report(ok, name, got, want) {
  if (ok) { pass++; }
  else {
    fail++;
    console.error("FAIL " + name + "\n   got:  " + got + "\n   want: " + want);
  }
}

// ---- Gaussian beam: pinned reference values ---------------------------
// Case A — HeNe: λ = 632.8 nm, w₀ = 1 mm
var lamA = 632.8e-9, w0A = 1e-3;
approx("A zR", G.rayleighRange(w0A, lamA), 4.964590160540128);
approx("A theta", G.divergence(w0A, lamA), 0.00020142649597710272);
// at z = zR the radius is exactly w₀√2 and R = 2 zR
approx("A w(zR)=w0*sqrt2", G.beamRadius(w0A, lamA, G.rayleighRange(w0A, lamA)),
  w0A * Math.SQRT2);
approx("A R(zR)=2zR", G.radiusOfCurvature(w0A, lamA, G.rayleighRange(w0A, lamA)),
  2 * G.rayleighRange(w0A, lamA));

// Case B — Nd:YAG: λ = 1064 nm, w₀ = 0.5 mm, z = 100 mm
var lamB = 1064e-9, w0B = 0.5e-3, zB = 100e-3;
approx("B zR", G.rayleighRange(w0B, lamB), 0.7381561686066243);
approx("B w(z)", G.beamRadius(w0B, lamB, zB), 0.0005045673515683216);
approx("B R(z)", G.radiusOfCurvature(w0B, lamB, zB), 5.5487452925201115);
approx("B theta", G.divergence(w0B, lamB), 0.0006773634377991066);

// Case C — focused green: λ = 532 nm, w₀ = 50 µm, z = 10 mm
var lamC = 532e-9, w0C = 50e-6, zC = 10e-3;
approx("C zR", G.rayleighRange(w0C, lamC), 0.014763123372132484);
approx("C w(z)", G.beamRadius(w0C, lamC, zC), 6.03908359535415e-05);
approx("C R(z)", G.radiusOfCurvature(w0C, lamC, zC), 0.031794981170080436);

// Case D — edge: at the waist (z = 0) radius is w₀ and wavefront is flat
approx("D w(0)=w0", G.beamRadius(w0A, lamA, 0), w0A);
equal("D R(0)=Infinity", G.radiusOfCurvature(w0A, lamA, 0), Infinity);

var rayleighMetrics = G.rayleighMetrics(0.5e-3, 1064e-9);
approx("rayleigh metrics range", rayleighMetrics.rayleighRange, 0.7381561686066243);
approx("rayleigh metrics confocal parameter", rayleighMetrics.confocalParameter, 1.4763123372132487);
var divergenceMetrics = G.divergenceMetrics(1e-3, 632.8e-9, 1);
approx("divergence metrics ideal half angle", divergenceMetrics.halfAngle, 0.00020142649597710272);
approx("divergence metrics ideal full angle", divergenceMetrics.fullAngle, 0.00040285299195420544);
approx("divergence metrics M2 scaling", G.divergenceMetrics(1e-3, 632.8e-9, 1.5).halfAngle,
  0.0003021397439656541);
var quality = G.beamQuality(1e-3, 632.8e-9, 0.0003021397439656541);
approx("beam quality M2", quality.M2, 1.5);
approx("beam quality ideal divergence", quality.idealHalfAngle, 0.00020142649597710272);
var qualityIdeal = G.beamQuality(0.5e-3, 1064e-9, 0.0006773634377991066);
approx("beam quality ideal case", qualityIdeal.M2, 1);

// symmetry: negative z gives the same radius and |R|
approx("sym w(-z)=w(z)", G.beamRadius(w0B, lamB, -zB), G.beamRadius(w0B, lamB, zB));

// ---- units ------------------------------------------------------------
approx("toSI mm", P.toSI(2, P.UNITS.length.mm), 0.002);
approx("fromSI mm", P.fromSI(0.002, P.UNITS.length.mm), 2);
approx("round-trip nm", P.fromSI(P.toSI(632.8, P.UNITS.length.nm), P.UNITS.length.nm), 632.8);
approx("mrad", P.fromSI(0.00020142649597710272, P.UNITS.angle.mrad), 0.20142649597710272);

// ---- formatter --------------------------------------------------------
equal("fmt 0", P.format(0), "0");
equal("fmt zR", P.format(4.964590160540128), "4.965");
equal("fmt theta->mrad", P.format(0.20142649597710272), "0.2014");
equal("fmt small sci", P.format(0.00020142649597710272), "2.014×10⁻⁴");
equal("fmt B w in m sci", P.format(0.0005045673515683216), "5.046×10⁻⁴");
equal("fmt large sci", P.format(1234567), "1.235×10⁶");
equal("fmt one trims", P.format(1.0), "1");
equal("fmt negative", P.format(-0.0005045673515683216), "−5.046×10⁻⁴");
equal("fmt sig bump 9.9996", P.format(9.9996, 4), "10");
equal("fmt Infinity", P.format(Infinity), "∞");
equal("fmt precision is a ceiling, no padded zeroes", P.format(300, 5), "300");
equal("fmt precision trims small-value zeroes", P.format(0.003, 5), "0.003");
equal("fmt ten significant figures", P.format(1 / 3, 10), "0.3333333333");
equal("display fit keeps short result large", P.displaySize("300 J"), "");
equal("display fit compacts medium result", P.displaySize("123456.789 J"), "is-compact");
equal("display fit condenses long result", P.displaySize("12.80616938 m/s"), "is-condensed");
equal("display fit tightens scientific result", P.displaySize("1.23456789×10⁻¹² m/s"), "is-tight");

// ---- calculated-input lock --------------------------------------------
// A tiny DOM-shaped object pins the shared interaction without adding a
// browser dependency to the maths suite.
var calculatedClass = true, lockAttrs = {};
var calculatedInput = {
  disabled: false,
  classList: { contains: function (name) { return name === "is-result" && calculatedClass; } },
  getAttribute: function (name) { return lockAttrs[name] || null; },
  setAttribute: function (name, value) { lockAttrs[name] = value; },
  removeAttribute: function (name) { delete lockAttrs[name]; }
};
equal("calculated input locks", P.syncSolvedInput(calculatedInput), true);
equal("calculated lock is owned", lockAttrs["data-ans-solved-lock"], "true");
calculatedClass = false;
equal("calculated input unlocks when no longer solved", P.syncSolvedInput(calculatedInput), false);
var deliberateDisabled = {
  disabled: true,
  classList: { contains: function () { return false; } },
  getAttribute: function () { return null; },
  setAttribute: function () {},
  removeAttribute: function () {}
};
equal("unowned disabled input stays disabled", P.syncSolvedInput(deliberateDisabled), true);

var removedClasses = [];
var editableInput = {
  value: "12.5", disabled: false,
  classList: { remove: function (name) { removedClasses.push(name); } },
  getAttribute: function () { return null; },
  removeAttribute: function () {}
};
var ownedLock = {
  value: "", disabled: true,
  classList: { remove: function () {} },
  getAttribute: function (name) { return name === "data-ans-solved-lock" ? "true" : null; },
  removeAttribute: function () { this.lockRemoved = true; }
};
var fixedControl = {
  value: "∞", disabled: true,
  classList: { remove: function () {} },
  getAttribute: function () { return null; },
  removeAttribute: function () {}
};
var clearedInputs = P.clearScienceInputs([editableInput, ownedLock, fixedControl]);
equal("clear removes editable value", editableInput.value, "");
equal("clear releases calculated lock", ownedLock.disabled, false);
equal("clear removes owned marker", ownedLock.lockRemoved, true);
equal("clear preserves deliberate disabled control", fixedControl.value, "∞");
equal("clear returns only cleared inputs", clearedInputs.length, 2);

// ---- GCSE relations: solve for each variable --------------------------
var g = P.gcse;
// F = m·a
approx("fma F", g.fma({ m: 2, a: 5 }).F, 10);
approx("fma m", g.fma({ F: 10, a: 5 }).m, 2);
approx("fma a", g.fma({ F: 10, m: 2 }).a, 5);
// Ohm's law + power
approx("ohms V", g.ohms({ I: 2, R: 4 }).V, 8);
approx("ohms I", g.ohms({ V: 8, R: 4 }).I, 2);
approx("ohms R", g.ohms({ V: 8, I: 2 }).R, 4);
approx("ohms P (solve V)", g.ohms({ I: 2, R: 4 }).P, 16);
approx("ohms P (solve R)", g.ohms({ V: 12, I: 0.5 }).P, 6);
// v = f·λ
approx("wave v", g.wave({ f: 50, lambda: 6 }).v, 300);
approx("wave f", g.wave({ v: 300, lambda: 6 }).f, 50);
approx("wave lambda", g.wave({ v: 300, f: 50 }).lambda, 6);
// units added for the GCSE pages
approx("unit km/h", P.toSI(36, P.UNITS.velocity["km/h"]), 10);
approx("unit kOhm", P.toSI(2, P.UNITS.resistance["kΩ"]), 2000);
approx("unit MHz", P.toSI(3, P.UNITS.frequency.MHz), 3e6);
approx("unit kJ", P.toSI(2.5, P.UNITS.energy.kJ), 2500);
approx("unit minutes", P.toSI(2, P.UNITS.time.min), 120);

// ---- Energy, work and power -------------------------------------------
// Reference values below are direct hand rearrangements of the stated
// equations, independent of the module implementation.
var ke = g.kineticEnergy;
approx("kinetic E = half m v squared", ke({ E: null, m: 2, v: 3 }).E, 9);
approx("kinetic solve speed", ke({ E: 100, m: 8, v: null }).v, 5);
approx("kinetic solve mass", ke({ E: 72, m: null, v: 6 }).m, 4);
approx("kinetic stationary object", ke({ E: null, m: 5, v: 0 }).E, 0);
equal("kinetic negative energy has no real speed",
  isNaN(ke({ E: -1, m: 2, v: null }).v), true);

var gpe = g.gravitationalPotentialEnergy;
approx("gpe energy", gpe({ E: null, m: 2, g: 9.81, h: 5 }).E, 98.1);
approx("gpe solve mass", gpe({ E: 490.5, m: null, g: 9.81, h: 10 }).m, 5);
approx("gpe solve field strength", gpe({ E: 196.2, m: 2, g: null, h: 10 }).g, 9.81);
approx("gpe solve height", gpe({ E: 294.3, m: 3, g: 9.81, h: null }).h, 10);
approx("gpe zero reference height", gpe({ E: null, m: 10, g: 9.81, h: 0 }).E, 0);

var work = g.work;
approx("work done", work({ W: null, F: 12, s: 5 }).W, 60);
approx("work solve force", work({ W: 150, F: null, s: 3 }).F, 50);
approx("work signed displacement", work({ W: -40, F: 10, s: null }).s, -4);

var pwr = g.powerFromWork;
approx("power from work and time", pwr({ P: null, W: 600, t: 20 }).P, 30);
approx("power solve work", pwr({ P: 75, W: null, t: 4 }).W, 300);
approx("power solve time", pwr({ P: 250, W: 1000, t: null }).t, 4);
equal("power at zero elapsed time is unbounded",
  pwr({ P: null, W: 10, t: 0 }).P, Infinity);

// ---- Momentum and impulse ---------------------------------------------
// Independent hand checks from p = mv, J = Ft and J = pFinal - pInitial.
var momentum = g.momentum;
approx("momentum p", momentum({ p: null, m: 1500, v: 20 }).p, 30000);
approx("momentum solve velocity", momentum({ p: 10, m: 2, v: null }).v, 5);
approx("momentum solve mass", momentum({ p: 12, m: null, v: 3 }).m, 4);
approx("momentum carries direction", momentum({ p: null, m: 4, v: -3 }).p, -12);

var impulse = g.impulse;
approx("impulse J", impulse({ J: null, F: 50, t: 0.2 }).J, 10);
approx("impulse solve force", impulse({ J: 24, F: null, t: 3 }).F, 8);
approx("impulse solve time", impulse({ J: 15, F: 5, t: null }).t, 3);
approx("impulse carries direction", impulse({ J: null, F: -6, t: 2 }).J, -12);
equal("impulse at zero time needs unbounded force",
  impulse({ J: 10, F: null, t: 0 }).F, Infinity);

var deltaP = g.changeInMomentum;
approx("change in momentum", deltaP({ J: null, pInitial: 5, pFinal: 17 }).J, 12);
approx("change solve initial momentum", deltaP({ J: 12, pInitial: null, pFinal: 17 }).pInitial, 5);
approx("change solve final momentum", deltaP({ J: -4, pInitial: 10, pFinal: null }).pFinal, 6);
approx("unit momentum grams", P.toSI(2500, P.UNITS.momentum["g·m/s"]), 2.5);
approx("unit momentum newton seconds", P.toSI(3, P.UNITS.momentum["N·s"]), 3);

// ---- Series and parallel resistance -----------------------------------
// Hand checks: 100, 220, 330 Ω sum to 650 Ω; reciprocal sum is
// 29/1650 Ω⁻¹, hence R_parallel = 1650/29 Ω.
var network = g.resistanceNetwork;
var netA = network([100, 220, 330]);
approx("resistance three series", netA.series, 650);
approx("resistance three parallel", netA.parallel, 1650 / 29);
var netB = network([100, 100, 100, 100]);
approx("resistance equal series", netB.series, 400);
approx("resistance equal parallel", netB.parallel, 25);
var netC = network([1000, 2000]);
approx("resistance mixed series", netC.series, 3000);
approx("resistance mixed parallel", netC.parallel, 2000 / 3);
approx("resistance zero-ohm series branch", g.seriesResistance([0, 100]), 100);
approx("resistance zero-ohm parallel short", g.parallelResistance([0, 100]), 0);
approx("resistance single series", g.seriesResistance([47]), 47);
approx("resistance single parallel", g.parallelResistance([47]), 47);
equal("resistance empty series invalid", isNaN(g.seriesResistance([])), true);
equal("resistance negative parallel invalid", isNaN(g.parallelResistance([10, -5])), true);
approx("unit milliohm", P.toSI(250, P.UNITS.resistance["mΩ"]), 0.25);

// ---- Projectile motion ------------------------------------------------
// Independent hand checks use u_x = u cos(theta), u_y = u sin(theta),
// T = 2u_y/g, H = u_y^2/(2g), and R = u_x T for level ground.
var projectile = g.projectile;
var projectile45 = projectile({ speed: 20, angle: Math.PI / 4, gravity: 9.81 });
approx("projectile 45 degree range", projectile45.range, 400 / 9.81);
approx("projectile 45 degree height", projectile45.maxHeight, 100 / 9.81);
approx("projectile 45 degree time", projectile45.flightTime, 20 * Math.SQRT2 / 9.81);
var projectile30 = projectile({ speed: 10, angle: Math.PI / 6, gravity: 10 });
approx("projectile 30 degree range", projectile30.range, 5 * Math.sqrt(3));
approx("projectile 30 degree height", projectile30.maxHeight, 1.25);
approx("projectile 30 degree time", projectile30.flightTime, 1);
var projectileFlat = projectile({ speed: 12, angle: 0, gravity: 9.81 });
approx("projectile zero angle range on level ground", projectileFlat.range, 0);
approx("projectile zero angle height", projectileFlat.maxHeight, 0);
approx("projectile zero angle time", projectileFlat.flightTime, 0);
var projectileVertical = projectile({ speed: 15, angle: Math.PI / 2, gravity: 10 });
approx("projectile vertical range", projectileVertical.range, 0);
approx("projectile vertical height", projectileVertical.maxHeight, 11.25);
approx("projectile vertical time", projectileVertical.flightTime, 3);
equal("projectile rejects negative speed",
  isNaN(projectile({ speed: -1, angle: 0.5, gravity: 9.81 }).range), true);
equal("projectile rejects zero gravity",
  isNaN(projectile({ speed: 10, angle: 0.5, gravity: 0 }).flightTime), true);
equal("projectile rejects downward launch outside model",
  isNaN(projectile({ speed: 10, angle: -0.1, gravity: 9.81 }).maxHeight), true);
approx("projectile angle unit degrees", P.toSI(45, P.UNITS.angle.deg), Math.PI / 4);

// ---- Density, mass and volume -----------------------------------------
var density = g.density;
approx("density rho", density({ rho: null, m: 2, V: 0.002 }).rho, 1000);
approx("density mass", density({ rho: 7800, m: null, V: 0.003 }).m, 23.4);
approx("density volume", density({ rho: 800, m: 4, V: null }).V, 0.005);
equal("density zero volume is unbounded", density({ rho: null, m: 1, V: 0 }).rho, Infinity);
approx("unit cubic centimetres", P.toSI(250, P.UNITS.volume["cm³"]), 0.00025);
approx("unit litres", P.toSI(2, P.UNITS.volume.L), 0.002);
approx("unit grams per cubic centimetre", P.toSI(7.8, P.UNITS.density["g/cm³"]), 7800);

// ---- Pressure ---------------------------------------------------------
var pressureForce = g.pressureFromForce;
approx("pressure from force", pressureForce({ P: null, F: 200, A: 0.04 }).P, 5000);
approx("pressure solve force", pressureForce({ P: 250000, F: null, A: 0.002 }).F, 500);
approx("pressure solve area", pressureForce({ P: 8000, F: 400, A: null }).A, 0.05);
var liquidPressure = g.liquidPressure;
approx("liquid pressure", liquidPressure({ P: null, rho: 1000, g: 9.81, h: 2 }).P, 19620);
approx("liquid pressure depth", liquidPressure({ P: 49050, rho: 1000, g: 9.81, h: null }).h, 5);
approx("liquid pressure density", liquidPressure({ P: 15696, rho: null, g: 9.81, h: 2 }).rho, 800);
approx("unit square centimetres", P.toSI(250, P.UNITS.area["cm²"]), 0.025);
approx("unit kilopascals", P.toSI(12, P.UNITS.pressure.kPa), 12000);

// ---- Specific heat and latent heat ------------------------------------
var specificHeat = g.specificHeat;
approx("specific heat energy", specificHeat({ Q: null, m: 2, c: 4200, dT: 5 }).Q, 42000);
approx("specific heat mass", specificHeat({ Q: 90000, m: null, c: 450, dT: 20 }).m, 10);
approx("specific heat capacity", specificHeat({ Q: 78000, m: 2, c: null, dT: 30 }).c, 1300);
approx("specific heat temperature change", specificHeat({ Q: 168000, m: 4, c: 4200, dT: null }).dT, 10);
var latentHeat = g.latentHeat;
approx("latent heat energy", latentHeat({ Q: null, m: 0.5, L: 334000 }).Q, 167000);
approx("latent heat mass", latentHeat({ Q: 452000, m: null, L: 2260000 }).m, 0.2);
approx("latent heat constant", latentHeat({ Q: 900000, m: 2.5, L: null }).L, 360000);
approx("unit kJ per kilogram kelvin", P.toSI(4.2, P.UNITS.specificHeat["kJ/(kg·K)"]), 4200);

// ---- Hooke's law ------------------------------------------------------
var hooke = g.hookesLaw;
approx("hooke force", hooke({ F: null, k: 200, x: 0.05 }).F, 10);
approx("hooke spring constant", hooke({ F: 30, k: null, x: 0.15 }).k, 200);
approx("hooke extension", hooke({ F: 12, k: 300, x: null }).x, 0.04);
var elastic = g.elasticEnergy;
approx("elastic energy", elastic({ E: null, k: 200, x: 0.1 }).E, 1);
approx("elastic spring constant", elastic({ E: 2.5, k: null, x: 0.1 }).k, 500);
approx("elastic extension magnitude", elastic({ E: 9, k: 200, x: null }).x, 0.3);
equal("elastic negative energy has no real extension", isNaN(elastic({ E: -1, k: 200, x: null }).x), true);
approx("unit kilonewtons per metre", P.toSI(3, P.UNITS.springConstant["kN/m"]), 3000);

// ---- Moments ----------------------------------------------------------
var moment = g.moment;
approx("moment torque", moment({ M: null, F: 50, d: 0.4 }).M, 20);
approx("moment force", moment({ M: 30, F: null, d: 0.6 }).F, 50);
approx("moment distance", moment({ M: 12, F: 40, d: null }).d, 0.3);
var balanced = g.balancedMoments;
approx("balanced solve second force", balanced({ F1: 120, d1: 0.25, F2: null, d2: 0.5 }).F2, 60);
approx("balanced solve first distance", balanced({ F1: 80, d1: null, F2: 50, d2: 0.4 }).d1, 0.25);
approx("balanced solve second distance", balanced({ F1: 30, d1: 0.8, F2: 60, d2: null }).d2, 0.4);
approx("unit newton millimetres", P.toSI(500, P.UNITS.moment["N·mm"]), 0.5);

// ---- Ideal transformers -----------------------------------------------
var turns = g.transformerRatio;
approx("transformer secondary voltage", turns({ Vp: 230, Vs: null, Np: 1000, Ns: 100 }).Vs, 23);
approx("transformer primary turns", turns({ Vp: 230, Vs: 23, Np: null, Ns: 100 }).Np, 1000);
approx("transformer secondary turns", turns({ Vp: 120, Vs: 12, Np: 500, Ns: null }).Ns, 50);
var idealPower = g.idealTransformerPower;
var transformerPower = idealPower({ Vp: 230, Ip: 2, Vs: 23, Is: null });
approx("transformer secondary current", transformerPower.Is, 20);
approx("transformer conserved power", transformerPower.power, 460);
approx("transformer primary current", idealPower({ Vp: 120, Ip: null, Vs: 12, Is: 5 }).Ip, 0.5);

// ---- SUVAT: give any 3, solve the other 2 -----------------------------
var su = P.gcse.suvat;
var r1 = su({ u: 0, a: 9.8, t: 2 });
approx("suvat C1 v", r1.v, 19.6); approx("suvat C1 s", r1.s, 19.6);
var r2 = su({ u: 10, v: 0, a: -2 });
approx("suvat C2 t", r2.t, 5); approx("suvat C2 s", r2.s, 25);
var r3 = su({ s: 100, u: 0, t: 5 });
approx("suvat C3 v", r3.v, 40); approx("suvat C3 a", r3.a, 8);
var r4 = su({ s: 20, u: 5, a: 2 });   // quadratic time
approx("suvat C4 t", r4.t, 2.623475382979799);
approx("suvat C4 v", r4.v, 10.246950765959598);
var r5 = su({ u: 3, v: 13, a: 2 });
approx("suvat C5 s", r5.s, 40); approx("suvat C5 t", r5.t, 5);
var r6 = su({ s: 50, u: 10, a: 0 });  // constant velocity
approx("suvat C6 t", r6.t, 5); approx("suvat C6 v", r6.v, 10);
equal("suvat <3 knowns -> null", su({ u: 1, v: 2 }), null);

// ---- Focused spot: w0' = M² λ f / (π w) -------------------------------
approx("spot M2=1", G.focusedWaist(5e-3, 1064e-9, 0.1, 1), 6.773634377991066e-06);
approx("spot M2=1.2", G.focusedWaist(5e-3, 1064e-9, 0.1, 1.2), 8.128361253589279e-06);
approx("spot green", G.focusedWaist(3e-3, 532e-9, 0.05, 1), 2.8223476574962775e-06);
approx("spot default M2 (omitted)=1", G.focusedWaist(5e-3, 1064e-9, 0.1), G.focusedWaist(5e-3, 1064e-9, 0.1, 1));

// ---- Lensmaker: 1/f = (n−1)(1/R1 + 1/R2), convex +ve, concave −ve ------
var Ln = P.lens;
approx("lens biconvex f", Ln.lensmaker(1.5, 0.1, 0.1), 0.1);      // both convex
approx("lens plano-convex f", Ln.lensmaker(1.5, 0.1, Infinity), 0.2); // one flat
approx("lens biconcave f", Ln.lensmaker(1.5, -0.1, -0.1), -0.1);  // both concave
approx("lens meniscus f", Ln.lensmaker(1.5, 0.1, -0.2), 0.4);     // convex + concave
equal("lens both flat -> Infinity", Ln.lensmaker(1.5, Infinity, Infinity), Infinity);

// ---- Thin-lens imaging: 1/f = 1/u + 1/v -------------------------------
var thin = Ln.thinLens;
var thinReal = thin({ f: 0.1, u: 0.3, v: null });
approx("thin lens real image distance", thinReal.v, 0.15);
approx("thin lens real magnification", thinReal.magnification, -0.5);
approx("thin lens focal length", thin({ f: null, u: 0.3, v: 0.15 }).f, 0.1);
approx("thin lens object distance", thin({ f: 0.1, u: null, v: 0.15 }).u, 0.3);
var thinVirtual = thin({ f: -0.1, u: 0.3, v: null });
approx("thin lens diverging virtual image", thinVirtual.v, -0.075);
approx("thin lens diverging upright magnification", thinVirtual.magnification, 0.25);
equal("thin lens object at focal point gives infinity", thin({ f: 0.1, u: 0.1, v: null }).v, Infinity);
var thinTarget = Ln.thinLensFromMagnification;
var halfSizeImage = thinTarget(0.1, -0.5);
approx("thin lens target magnification object distance", halfSizeImage.u, 0.3);
approx("thin lens target magnification image distance", halfSizeImage.v, 0.15);
var uprightDouble = thinTarget(0.1, 2);
approx("thin lens target upright object distance", uprightDouble.u, 0.05);
approx("thin lens target upright virtual image", uprightDouble.v, -0.1);

// ---- Diffraction-limited Airy spot ------------------------------------
var airy = Ln.airySpot(550e-9, 4);
approx("Airy diameter green f4", airy.diameter, 5.368e-6);
approx("Airy radius green f4", airy.radius, 2.684e-6);
var airyIR = Ln.airySpot(1064e-9, 10);
approx("Airy diameter IR f10", airyIR.diameter, 25.9616e-6);

// ---- Snell's law and critical angle -----------------------------------
var refracted = Ln.snell({ n1: 1, theta1: Math.PI / 6, n2: 1.5, theta2: null });
approx("Snell refracted angle", refracted.theta2, 0.3398369094541219);
approx("Snell solve incident index", Ln.snell({ n1: null, theta1: Math.PI / 6, n2: 1.5, theta2: refracted.theta2 }).n1, 1);
approx("Snell solve second index", Ln.snell({ n1: 1, theta1: Math.PI / 6, n2: null, theta2: refracted.theta2 }).n2, 1.5);
approx("critical angle glass air", Ln.criticalAngle(1.5, 1), 0.7297276562269663);
equal("critical angle needs high to low index", isNaN(Ln.criticalAngle(1, 1.5)), true);

// ---- Photon energy ----------------------------------------------------
var Qm = P.quantum;
var photon500 = Qm.photonFromWavelength(500e-9);
approx("photon 500 nm frequency", photon500.frequency, 599584916000000);
approx("photon 500 nm joules", photon500.joules, 3.972891714297857e-19);
approx("photon 500 nm electronvolts", photon500.electronVolts, 2.479683968664005);
var photon600THz = Qm.photonFromFrequency(600e12);
approx("photon 600 THz wavelength", photon600THz.wavelength, 0.0000004996540966666667);
approx("photon 600 THz joules", photon600THz.joules, 3.97564209e-19);

// ---- Half-life decay --------------------------------------------------
var decay = P.nuclear.decay;
var decayThree = decay({ initial: 1000, remaining: null, time: 15, halfLife: 5 });
approx("half-life remaining after three", decayThree.remaining, 125);
approx("half-life fraction after three", decayThree.fractionRemaining, 0.125);
approx("half-life decayed amount", decayThree.decayed, 875);
approx("half-life solve initial", decay({ initial: null, remaining: 125, time: 15, halfLife: 5 }).initial, 1000);
approx("half-life solve elapsed time", decay({ initial: 800, remaining: 100, time: null, halfLife: 2 }).time, 6);
approx("half-life solve half-life", decay({ initial: 1600, remaining: 200, time: 12, halfLife: null }).halfLife, 4);
approx("unit days", P.toSI(2, P.UNITS.time.day), 172800);

// ---- Capacitor energy and RC time constant ----------------------------
var capEnergy = g.capacitorEnergy;
approx("capacitor stored energy", capEnergy({ E: null, C: 100e-6, V: 12 }).E, 0.0072);
approx("capacitor solve voltage", capEnergy({ E: 0.5, C: 0.01, V: null }).V, 10);
approx("capacitor solve capacitance", capEnergy({ E: 0.018, C: null, V: 6 }).C, 0.001);
equal("capacitor negative energy has no real voltage", isNaN(capEnergy({ E: -1, C: 1, V: null }).V), true);
var rc = g.rcTimeConstant;
approx("RC time constant", rc({ tau: null, R: 10000, C: 100e-6 }).tau, 1);
approx("RC solve resistance", rc({ tau: 2, R: null, C: 200e-6 }).R, 10000);
approx("RC solve capacitance", rc({ tau: 0.5, R: 1000, C: null }).C, 0.0005);
approx("unit microfarads", P.toSI(220, P.UNITS.capacitance["µF"]), 0.00022);

// ---- de Broglie matter wavelength -------------------------------------
var matterWave = Qm.deBroglie;
var electronWave = matterWave({ wavelength: null, mass: 9.1093837139e-31, speed: 1e6 });
approx("de Broglie electron wavelength", electronWave.wavelength, 7.273895093352239e-10);
approx("de Broglie electron momentum", electronWave.momentum, 9.1093837139e-25);
approx("de Broglie solve mass", matterWave({ wavelength: 6.62607015e-10, mass: null, speed: 1000 }).mass, 1e-27);
approx("de Broglie solve speed", matterWave({ wavelength: 3.313035075e-10, mass: 2e-27, speed: null }).speed, 1000);
approx("atomic mass unit", P.toSI(1, P.UNITS.mass.u), 1.66053906660e-27);

// ---- Doppler shift: sound and light -----------------------------------
var soundShift = P.waves.soundDoppler;
var movingSource = soundShift({ observed: null, source: 1000, waveSpeed: 343,
  observerSpeed: 0, sourceSpeed: 10 });
approx("sound Doppler moving source", movingSource.observed, 343000 / 333);
approx("sound Doppler solve source speed", soundShift({ observed: 343000 / 333,
  source: 1000, waveSpeed: 343, observerSpeed: 0, sourceSpeed: null }).sourceSpeed, 10);
approx("sound Doppler moving observer", soundShift({ observed: null, source: 500,
  waveSpeed: 340, observerSpeed: 20, sourceSpeed: 0 }).observed, 500 * 360 / 340);
approx("sound Doppler solve wave speed", soundShift({ observed: 600, source: 500,
  waveSpeed: null, observerSpeed: 20, sourceSpeed: 40 }).waveSpeed, 340);
var lightShift = P.waves.lightDoppler;
var betaTenth = lightShift({ observed: null, source: 500e12,
  relativeSpeed: 0.1 * 299792458 });
approx("light Doppler approaching", betaTenth.observed, 500e12 * Math.sqrt(11 / 9));
approx("light Doppler wavelength ratio", betaTenth.wavelengthRatio, Math.sqrt(9 / 11));
approx("light Doppler solve relative speed", lightShift({ observed: 600e12,
  source: 400e12, relativeSpeed: null }).relativeSpeed, 299792458 * 1.25 / 3.25);
approx("unit terahertz", P.toSI(500, P.UNITS.frequency.THz), 500e12);

// ---- Escape and circular orbital speed --------------------------------
var earthSpeeds = P.gravity.speeds(5.972e24, 6.371e6);
approx("Earth surface escape speed", earthSpeeds.escape, 11185.97789184991);
approx("Earth surface circular speed", earthSpeeds.circular, 7909.680821529872);
approx("Earth surface gravitational field", earthSpeeds.acceleration, 9.819973426224687);
var scaleSpeeds = P.gravity.speeds(4e20, 2e5);
approx("escape is root two times circular", scaleSpeeds.escape / scaleSpeeds.circular, Math.SQRT2);

// ---- Ideal gas law -----------------------------------------------------
var idealGas = g.idealGas;
var gasVolume = idealGas({ P: 100000, V: null, n: 1, T: 300 });
approx("ideal gas volume", gasVolume.V, 0.02494338785445972);
approx("ideal gas pressure", idealGas({ P: null, V: 0.02494338785445972, n: 1, T: 300 }).P, 100000);
approx("ideal gas amount", idealGas({ P: 249433.8785445972, V: 0.01, n: null, T: 300 }).n, 1);
approx("ideal gas temperature", idealGas({ P: 100000, V: 0.02494338785445972, n: 1, T: null }).T, 300);
approx("unit millimoles", P.toSI(250, P.UNITS.amount.mmol), 0.25);

// ---- Moles from mass and concentration --------------------------------
var massMoles = P.chemistry.massMoles;
approx("water moles from mass", massMoles({ n: null, mass: 0.018, molarMass: 0.018 }).n, 1);
approx("solve sample mass", massMoles({ n: 2.5, mass: null, molarMass: 0.05844 }).mass, 0.1461);
approx("solve molar mass", massMoles({ n: 0.5, mass: 0.09, molarMass: null }).molarMass, 0.18);
var amountConcentration = P.chemistry.concentration;
approx("amount concentration", amountConcentration({ concentration: null, n: 0.5, volume: 0.002 }).concentration, 250);
approx("concentration solve amount", amountConcentration({ concentration: 200, n: null, volume: 0.003 }).n, 0.6);
approx("concentration solve volume", amountConcentration({ concentration: 50, n: 0.25, volume: null }).volume, 0.005);
approx("unit grams per mole", P.toSI(18, P.UNITS.molarMass["g/mol"]), 0.018);
approx("unit moles per litre", P.toSI(0.25, P.UNITS.concentration["mol/L"]), 250);

// ---- Binary, decimal and hexadecimal integers -------------------------
var convertInteger = P.computing.convertInteger;
equal("binary 42 decimal", convertInteger("101010", 2).decimal, "42");
equal("binary 42 hex", convertInteger("101010", 2).hexadecimal, "2A");
equal("decimal 255 binary", convertInteger("255", 10).binary, "11111111");
equal("decimal 255 hex", convertInteger("255", 10).hexadecimal, "FF");
equal("hex deadbeef decimal", convertInteger("DEADBEEF", 16).decimal, "3735928559");
equal("large integer remains exact", convertInteger("9007199254740993", 10).hexadecimal, "20000000000001");
equal("zero conversion", convertInteger("0", 10).binary, "0");
equal("invalid binary rejected", convertInteger("102", 2), null);
equal("negative integer rejected", convertInteger("-1", 10), null);

// ---- Numerical aperture and f-number ----------------------------------
var aperture = P.lens.numericalAperture;
approx("NA at thirty degrees in air", aperture({ NA: null, n: 1, theta: Math.PI / 6 }).NA, 0.5);
approx("NA solve acceptance angle", aperture({ NA: 0.22, n: 1, theta: null }).theta, Math.asin(0.22));
approx("NA solve refractive index", aperture({ NA: 0.3, n: null, theta: Math.asin(0.2) }).n, 1.5);
var fNumberNA = P.lens.fNumberNA;
approx("f4 paraxial NA", fNumberNA({ NA: null, fNumber: 4 }).NA, 0.125);
approx("NA point two f-number", fNumberNA({ NA: 0.2, fNumber: null }).fNumber, 2.5);

// ---- Double-slit interference -----------------------------------------
var slitAngle = P.waves.doubleSlitAngle;
var firstMaximum = slitAngle({ order: 1, wavelength: 500e-9,
  separation: 0.5e-3, angle: null });
approx("double slit first maximum angle", firstMaximum.angle, Math.asin(0.001));
approx("double slit solve wavelength", slitAngle({ order: 2, wavelength: null,
  separation: 1e-3, angle: Math.asin(0.001) }).wavelength, 500e-9);
approx("double slit solve order", slitAngle({ order: null, wavelength: 600e-9,
  separation: 0.3e-3, angle: Math.asin(0.004) }).order, 2);
var slitFringes = P.waves.doubleSlitFringes;
approx("double slit fringe spacing", slitFringes({ spacing: null, wavelength: 500e-9,
  distance: 1, separation: 0.5e-3 }).spacing, 0.001);
approx("double slit solve screen distance", slitFringes({ spacing: 0.002,
  wavelength: 500e-9, distance: null, separation: 0.5e-3 }).distance, 2);
approx("double slit solve separation", slitFringes({ spacing: 0.001,
  wavelength: 600e-9, distance: 2, separation: null }).separation, 0.0012);

// ---- Bragg diffraction -------------------------------------------------
var bragg = P.waves.bragg;
var copperPeak = bragg({ order: 1, wavelength: 0.15406e-9,
  spacing: 0.2e-9, angle: null });
approx("Bragg copper-like angle", copperPeak.angle, 0.39537035629778255);
approx("Bragg solve wavelength", bragg({ order: 2, wavelength: null,
  spacing: 0.3e-9, angle: Math.asin(0.5) }).wavelength, 0.15e-9);
approx("Bragg solve plane spacing", bragg({ order: 1, wavelength: 0.1e-9,
  spacing: null, angle: Math.asin(0.25) }).spacing, 0.2e-9);
approx("Bragg solve order", bragg({ order: null, wavelength: 0.1e-9,
  spacing: 0.2e-9, angle: Math.asin(0.5) }).order, 2);

// ---- Right-triangle trigonometry --------------------------------------
// Expected values are the exact 3-4-5 triangle and independently evaluated
// 30-degree ratios, not output copied from the module under test.
var rightTriangle = P.maths.rightTriangle;
var triangleAB = rightTriangle({ a: 3, b: 4, c: null, theta: null });
approx("triangle two legs hypotenuse", triangleAB.c, 5);
approx("triangle two legs angle", triangleAB.theta, 0.6435011087932844);
approx("triangle opposite and hypotenuse", rightTriangle({
  a: 3, b: null, c: 5, theta: null }).b, 4);
approx("triangle adjacent and hypotenuse", rightTriangle({
  a: null, b: 4, c: 5, theta: null }).a, 3);
var triangleThetaC = rightTriangle({ a: null, b: null, c: 10, theta: Math.PI / 6 });
approx("triangle angle and hypotenuse opposite", triangleThetaC.a, 5);
approx("triangle angle and hypotenuse adjacent", triangleThetaC.b, 8.660254037844386);
var triangleThetaA = rightTriangle({ a: 5, b: null, c: null, theta: Math.PI / 6 });
approx("triangle angle and opposite adjacent", triangleThetaA.b, 8.660254037844386);
approx("triangle angle and opposite hypotenuse", triangleThetaA.c, 10);
var triangleThetaB = rightTriangle({ a: null, b: 8.660254037844386,
  c: null, theta: Math.PI / 6 });
approx("triangle angle and adjacent opposite", triangleThetaB.a, 5);
approx("triangle angle and adjacent hypotenuse", triangleThetaB.c, 10);
equal("triangle too few known rejected", rightTriangle({
  a: 3, b: null, c: null, theta: null }), null);
equal("triangle too many known rejected", rightTriangle({
  a: 3, b: 4, c: 5, theta: null }), null);
equal("triangle impossible hypotenuse rejected", rightTriangle({
  a: 5, b: null, c: 4, theta: null }), null);
equal("triangle zero angle rejected", rightTriangle({
  a: 3, b: null, c: null, theta: 0 }), null);
equal("triangle right angle rejected", rightTriangle({
  a: null, b: 3, c: null, theta: Math.PI / 2 }), null);

// ---- report -----------------------------------------------------------
console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
