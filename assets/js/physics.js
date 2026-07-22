/*
  AnsPhysics — shared machinery for the anscalc.com physics calculators.

  One implementation for every physics page
  (Website-Private-Docs/PHYSICS-DESIGN.md, WP-P2):
  SI-prefix unit conversion, display-precision + scientific-notation
  formatting, and the physics functions themselves. No external requests,
  no dependencies — the same file loads in the browser (global AnsPhysics)
  and in Node for the headless maths tests.

  Everything is written from the physics itself. All functions work in SI
  internally; unit menus convert at the edges.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();          // Node (tests)
  } else {
    root.AnsPhysics = factory();         // browser (pages)
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---- units ------------------------------------------------------------
  // Each unit is a multiplier onto its SI base. A page's <select> carries
  // the factor in data-factor; the helpers below are the single conversion
  // point so no page rolls its own.

  var UNITS = {
    length: { nm: 1e-9, "µm": 1e-6, um: 1e-6, mm: 1e-3, cm: 1e-2, m: 1 },
    angle:  { "µrad": 1e-6, urad: 1e-6, mrad: 1e-3, rad: 1, deg: Math.PI / 180 },
    mass:   { u: 1.66053906660e-27, g: 1e-3, kg: 1, t: 1e3 },
    volume: { "mm³": 1e-9, "cm³": 1e-6, mL: 1e-6, L: 1e-3, "m³": 1 },
    density: { "kg/m³": 1, "g/cm³": 1e3 },
    area: { "mm²": 1e-6, "cm²": 1e-4, "m²": 1 },
    pressure: { Pa: 1, kPa: 1e3, MPa: 1e6, bar: 1e5 },
    specificHeat: { "J/(kg·K)": 1, "kJ/(kg·K)": 1e3 },
    latentHeat: { "J/kg": 1, "kJ/kg": 1e3, "MJ/kg": 1e6 },
    temperatureChange: { "°C": 1, K: 1 },
    springConstant: { "N/m": 1, "kN/m": 1e3 },
    moment: { "N·mm": 1e-3, "N·m": 1, "kN·m": 1e3 },
    force:  { mN: 1e-3, N: 1, kN: 1e3 },
    momentum: { "g·m/s": 1e-3, "kg·m/s": 1, "N·s": 1 },
    accel:  { "m/s²": 1 },
    velocity: { "m/s": 1, "km/h": 1 / 3.6, "km/s": 1e3 },
    voltage: { mV: 1e-3, V: 1, kV: 1e3 },
    current: { "µA": 1e-6, mA: 1e-3, A: 1 },
    resistance: { "mΩ": 1e-3, "Ω": 1, "kΩ": 1e3, "MΩ": 1e6 },
    capacitance: { pF: 1e-12, nF: 1e-9, "µF": 1e-6, mF: 1e-3, F: 1 },
    energy: { mJ: 1e-3, J: 1, kJ: 1e3, MJ: 1e6 },
    power:  { mW: 1e-3, W: 1, kW: 1e3 },
    time: { ms: 1e-3, s: 1, min: 60, h: 3600, day: 86400, year: 31557600 },
    frequency: { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12 },
    amount: { mmol: 1e-3, mol: 1, kmol: 1e3 },
    molarMass: { "g/mol": 1e-3, "kg/mol": 1 },
    concentration: { "mmol/L": 1, "mol/m³": 1, "mol/L": 1e3 }
  };

  function toSI(value, factor) { return value * factor; }
  function fromSI(si, factor) { return si / factor; }

  // ---- formatting -------------------------------------------------------
  // Maximum-significant-figure display with a proper superscript ×10ⁿ exponent
  // (never "1.2E-9"), matching the app's display register. Plain fixed
  // notation for magnitudes in [1e-3, 1e6); scientific outside that.
  // Trailing zeros are trimmed for a clean instrument read.

  var SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²",
    "3": "³", "4": "⁴", "5": "⁵", "6": "⁶",
    "7": "⁷", "8": "⁸", "9": "⁹" };

  function superscript(n) {
    return String(n).split("").map(function (c) { return SUP[c] || c; }).join("");
  }

  function trim(s) {
    return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
  }

  function format(x, sig) {
    sig = sig || 4;
    if (x === 0) { return "0"; }
    if (typeof x !== "number" || isNaN(x)) { return "—"; }
    if (!isFinite(x)) { return x > 0 ? "∞" : "−∞"; }

    var neg = x < 0;
    var v = Math.abs(x);
    var exp = Math.floor(Math.log10(v));

    function roundToSig(e) {
      var f = Math.pow(10, sig - 1 - e);
      return Math.round(v * f) / f;
    }

    var r = roundToSig(exp);
    var exp2 = Math.floor(Math.log10(r));   // rounding can bump 9.999→10
    if (exp2 !== exp) { exp = exp2; r = roundToSig(exp); }

    var out;
    if (v >= 1e-3 && v < 1e6) {
      out = trim(r.toFixed(Math.max(0, sig - 1 - exp)));
    } else {
      var mant = trim((r / Math.pow(10, exp)).toFixed(Math.max(0, sig - 1)));
      out = mant + "×10" + superscript(exp);
    }
    return (neg ? "−" : "") + out;
  }

  // Keep long science results inside the shared LCD without making short
  // answers unnecessarily small. Pages call fitDisplay after changing the
  // main line; CSS supplies the three progressively tighter sizes.
  function displaySize(text) {
    var length = Array.from(String(text || "")).length;
    if (length > 18) { return "is-tight"; }
    if (length > 14) { return "is-condensed"; }
    if (length > 10) { return "is-compact"; }
    return "";
  }

  function fitDisplay(element) {
    var classes = ["", "is-compact", "is-condensed", "is-tight"];
    classes.slice(1).forEach(function (name) {
      element.classList.remove(name);
    });
    var size = displaySize(element.textContent);
    if (size) { element.classList.add(size); }
    // Character count is a good first pass, but glyphs and units have
    // different widths. Step down again when the rendered line still needs
    // more room, so every page remains contained at narrow viewports.
    var index = classes.indexOf(size);
    while (element.clientWidth && element.scrollWidth > element.clientWidth + 1 &&
           index < classes.length - 1) {
      if (classes[index]) { element.classList.remove(classes[index]); }
      index += 1;
      element.classList.add(classes[index]);
      size = classes[index];
    }
    return size;
  }

  // A blank-to-solve field becomes a calculated output as soon as the
  // remaining values determine it. Pages mark that field with .is-result;
  // this shared observer makes the visual state real by removing it from
  // editing and the tab order. Only locks owned here are later released, so
  // deliberately disabled controls (for example a flat lens surface) remain
  // untouched. The adjacent unit menu stays enabled so users can change the
  // result unit.
  var SOLVED_LOCK_ATTR = "data-ans-solved-lock";

  function syncSolvedInput(input) {
    var solved = input.classList.contains("is-result");
    var owned = input.getAttribute(SOLVED_LOCK_ATTR) === "true";
    if (solved && !input.disabled) {
      input.disabled = true;
      input.setAttribute(SOLVED_LOCK_ATTR, "true");
    } else if (!solved && owned) {
      input.disabled = false;
      input.removeAttribute(SOLVED_LOCK_ATTR);
    }
    return input.disabled;
  }

  function clearScienceInputs(inputs) {
    var cleared = [];
    Array.prototype.forEach.call(inputs, function (input) {
      var owned = input.getAttribute(SOLVED_LOCK_ATTR) === "true";
      // Preserve controls disabled for a physical reason, such as a lens
      // surface set to Flat. Calculated fields are our locks, so release them.
      if (input.disabled && !owned) { return; }
      if (owned) {
        input.disabled = false;
        input.removeAttribute(SOLVED_LOCK_ATTR);
      }
      input.value = "";
      input.classList.remove("is-result", "is-invalid");
      cleared.push(input);
    });
    return cleared;
  }

  function installSolvedInputLocks() {
    if (typeof document === "undefined" ||
        typeof MutationObserver === "undefined") { return; }
    document.querySelectorAll(".phys-control input").forEach(syncSolvedInput);
    new MutationObserver(function (records) {
      records.forEach(function (record) {
        var input = record.target;
        if (input.matches(".phys-control input")) { syncSolvedInput(input); }
      });
    }).observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  function installClearButton() {
    if (typeof document === "undefined") { return; }
    var shell = document.querySelector(".science-page .tool-shell");
    if (!shell || shell.querySelector(".phys-clear")) { return; }
    var inputs = shell.querySelectorAll(".phys-control input");
    if (!inputs.length) { return; }

    var precision = document.getElementById("u-sf");
    var row = precision && precision.closest(".phys-aux");
    if (!row) {
      row = document.createElement("div");
      row.className = "phys-aux phys-clear-row";
      var lcd = shell.querySelector(".tool-lcd");
      if (!lcd) { return; }
      lcd.insertAdjacentElement("afterend", row);
    }

    var button = document.createElement("button");
    button.type = "button";
    button.className = "button button-secondary phys-clear";
    button.textContent = "Clear";
    button.setAttribute("aria-label", "Clear all entered values");
    button.addEventListener("click", function () {
      var cleared = clearScienceInputs(shell.querySelectorAll(".phys-control input"));
      if (!cleared.length) { return; }
      cleared[0].dispatchEvent(new Event("input", { bubbles: true }));
      shell.querySelectorAll(".phys-control input").forEach(function (input) {
        input.classList.remove("is-invalid");
      });
      cleared[0].focus();
    });
    row.appendChild(button);
  }

  function installClearButtonWhenReady() {
    if (typeof document === "undefined") { return; }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", installClearButton, { once: true });
    } else {
      installClearButton();
    }
  }

  installSolvedInputLocks();
  installClearButtonWhenReady();

  // ---- Gaussian beam (TEM00) --------------------------------------------
  // Assumptions stated on the page: fundamental Gaussian mode, paraxial,
  // single homogeneous medium; w is the 1/e² intensity radius; z is the
  // axial distance from the waist.

  var gaussianBeam = {
    // Rayleigh range  z_R = π w₀² / λ
    rayleighRange: function (w0, lambda) {
      return Math.PI * w0 * w0 / lambda;
    },
    rayleighMetrics: function (w0, lambda) {
      var zR = Math.PI * w0 * w0 / lambda;
      return { rayleighRange: zR, confocalParameter: 2 * zR };
    },
    // Beam radius  w(z) = w₀ √(1 + (z / z_R)²)
    beamRadius: function (w0, lambda, z) {
      var zR = this.rayleighRange(w0, lambda);
      return w0 * Math.sqrt(1 + (z / zR) * (z / zR));
    },
    // Wavefront radius of curvature  R(z) = z [1 + (z_R / z)²]
    // Flat at the waist → infinite radius (a plane wavefront).
    radiusOfCurvature: function (w0, lambda, z) {
      if (z === 0) { return Infinity; }
      var zR = this.rayleighRange(w0, lambda);
      return z * (1 + (zR / z) * (zR / z));
    },
    // Far-field divergence half-angle  θ = λ / (π w₀)
    divergence: function (w0, lambda) {
      return lambda / (Math.PI * w0);
    },
    divergenceMetrics: function (w0, lambda, M2) {
      var halfAngle = (M2 || 1) * lambda / (Math.PI * w0);
      return { halfAngle: halfAngle, fullAngle: 2 * halfAngle };
    },
    beamQuality: function (w0, lambda, measuredHalfAngle) {
      var idealHalfAngle = lambda / (Math.PI * w0);
      return {
        M2: measuredHalfAngle / idealHalfAngle,
        idealHalfAngle: idealHalfAngle,
        measuredHalfAngle: measuredHalfAngle
      };
    },
    // Focused spot: a (near-)collimated beam of radius wLens at a thin lens
    // of focal length f focuses to waist radius  w₀' = M² λ f / (π wLens).
    // M² = 1 for an ideal Gaussian; real beams are larger by M².
    focusedWaist: function (wLens, lambda, f, M2) {
      return (M2 || 1) * lambda * f / (Math.PI * wLens);
    }
  };

  // ---- Thin lens --------------------------------------------------------
  // Lensmaker's equation, thin lens in air, in the "convex-positive" form:
  //   1/f = (n−1)(1/R₁ + 1/R₂),  R > 0 convex, R < 0 concave, ∞ if flat.
  // This is the sum form that goes with a uniform per-surface sign rule
  // (equivalently the Cartesian 1/f = (n−1)(1/R₁ − 1/R₂) with R₂ negated).
  // The page passes already-signed radii; a flat surface is R = Infinity.

  var lens = {
    lensmaker: function (n, R1, R2) {
      return 1 / ((n - 1) * (1 / R1 + 1 / R2));   // Infinity if power is 0
    },
    // Thin-lens convention used on the imaging page: real object u > 0,
    // real image v > 0, converging focal length f > 0. Virtual quantities
    // are negative. Transverse magnification m = -v/u.
    thinLens: function (o) {
      var f = o.f, u = o.u, v = o.v;
      if (f == null) { f = 1 / (1 / u + 1 / v); }
      else if (u == null) { u = 1 / (1 / f - 1 / v); }
      else if (v == null) { v = 1 / (1 / f - 1 / u); }
      return { f: f, u: u, v: v, magnification: -v / u };
    },
    // With focal length and signed transverse magnification known, the
    // thin-lens and magnification equations determine both conjugates:
    // u = f(m - 1)/m and v = f(1 - m).
    thinLensFromMagnification: function (f, magnification) {
      return { f: f, u: f * (magnification - 1) / magnification,
        v: f * (1 - magnification), magnification: magnification };
    },
    // Airy pattern at a circular aperture: first-dark-ring diameter.
    airySpot: function (lambda, fNumber) {
      var diameter = 2.44 * lambda * fNumber;
      return { diameter: diameter, radius: diameter / 2 };
    },
    snell: function (o) {
      var n1 = o.n1, theta1 = o.theta1, n2 = o.n2, theta2 = o.theta2;
      if (n1 == null) { n1 = n2 * Math.sin(theta2) / Math.sin(theta1); }
      else if (theta1 == null) { theta1 = Math.asin(n2 * Math.sin(theta2) / n1); }
      else if (n2 == null) { n2 = n1 * Math.sin(theta1) / Math.sin(theta2); }
      else if (theta2 == null) { theta2 = Math.asin(n1 * Math.sin(theta1) / n2); }
      return { n1: n1, theta1: theta1, n2: n2, theta2: theta2 };
    },
    criticalAngle: function (n1, n2) {
      return n1 > n2 && n2 > 0 ? Math.asin(n2 / n1) : NaN;
    },
    numericalAperture: function (o) {
      var NA = o.NA, n = o.n, theta = o.theta;
      if (NA == null) { NA = n * Math.sin(theta); }
      else if (n == null) { n = NA / Math.sin(theta); }
      else if (theta == null) { theta = Math.asin(NA / n); }
      return { NA: NA, n: n, theta: theta };
    },
    // Paraxial air-space equivalence between numerical aperture and f/#.
    fNumberNA: function (o) {
      var NA = o.NA, fNumber = o.fNumber;
      if (NA == null) { NA = 1 / (2 * fNumber); }
      else if (fNumber == null) { fNumber = 1 / (2 * NA); }
      return { NA: NA, fNumber: fNumber };
    }
  };

  // ---- Quantum relations -----------------------------------------------
  var CONSTANTS = {
    h: 6.62607015e-34,
    c: 299792458,
    elementaryCharge: 1.602176634e-19,
    G: 6.67430e-11,
    R: 8.31446261815324,
    avogadro: 6.02214076e23
  };

  var quantum = {
    photonFromWavelength: function (lambda) {
      var frequency = CONSTANTS.c / lambda;
      var joules = CONSTANTS.h * frequency;
      return { wavelength: lambda, frequency: frequency, joules: joules,
        electronVolts: joules / CONSTANTS.elementaryCharge };
    },
    photonFromFrequency: function (frequency) {
      var joules = CONSTANTS.h * frequency;
      return { wavelength: CONSTANTS.c / frequency, frequency: frequency,
        joules: joules, electronVolts: joules / CONSTANTS.elementaryCharge };
    },
    // Non-relativistic de Broglie relation lambda = h/(mv).
    deBroglie: function (o) {
      var wavelength = o.wavelength, mass = o.mass, speed = o.speed;
      if (wavelength == null) { wavelength = CONSTANTS.h / (mass * speed); }
      else if (mass == null) { mass = CONSTANTS.h / (wavelength * speed); }
      else if (speed == null) { speed = CONSTANTS.h / (mass * wavelength); }
      return { wavelength: wavelength, mass: mass, speed: speed,
        momentum: mass * speed };
    }
  };

  var nuclear = {
    decay: function (o) {
      var initial = o.initial, remaining = o.remaining,
          time = o.time, halfLife = o.halfLife;
      if (remaining == null) { remaining = initial * Math.pow(0.5, time / halfLife); }
      else if (initial == null) { initial = remaining / Math.pow(0.5, time / halfLife); }
      else if (time == null) { time = halfLife * Math.log(initial / remaining) / Math.LN2; }
      else if (halfLife == null) { halfLife = time * Math.LN2 / Math.log(initial / remaining); }
      return { initial: initial, remaining: remaining, time: time,
        halfLife: halfLife, fractionRemaining: remaining / initial,
        decayed: initial - remaining };
    }
  };

  // ---- Wave shifts ------------------------------------------------------
  var waves = {
    // Classical Doppler shift in a stationary medium. Observer and source
    // speeds are positive when moving towards one another:
    // fObserved = fSource (c + vObserver) / (c - vSource).
    soundDoppler: function (o) {
      var observed = o.observed, source = o.source, waveSpeed = o.waveSpeed,
          observerSpeed = o.observerSpeed, sourceSpeed = o.sourceSpeed;
      if (observed == null) {
        observed = source * (waveSpeed + observerSpeed) / (waveSpeed - sourceSpeed);
      } else if (source == null) {
        source = observed * (waveSpeed - sourceSpeed) / (waveSpeed + observerSpeed);
      } else if (observerSpeed == null) {
        observerSpeed = observed * (waveSpeed - sourceSpeed) / source - waveSpeed;
      } else if (sourceSpeed == null) {
        sourceSpeed = waveSpeed - source * (waveSpeed + observerSpeed) / observed;
      } else if (waveSpeed == null) {
        waveSpeed = (source * observerSpeed + observed * sourceSpeed) / (observed - source);
      }
      return { observed: observed, source: source, waveSpeed: waveSpeed,
        observerSpeed: observerSpeed, sourceSpeed: sourceSpeed };
    },
    // Longitudinal relativistic Doppler shift. Relative speed is positive
    // for approach and negative for recession; |v| must be below c.
    lightDoppler: function (o) {
      var observed = o.observed, source = o.source, relativeSpeed = o.relativeSpeed;
      if (observed == null) {
        observed = source * Math.sqrt((1 + relativeSpeed / CONSTANTS.c) /
          (1 - relativeSpeed / CONSTANTS.c));
      } else if (source == null) {
        source = observed / Math.sqrt((1 + relativeSpeed / CONSTANTS.c) /
          (1 - relativeSpeed / CONSTANTS.c));
      } else if (relativeSpeed == null) {
        var ratio2 = observed * observed / (source * source);
        relativeSpeed = CONSTANTS.c * (ratio2 - 1) / (ratio2 + 1);
      }
      return { observed: observed, source: source, relativeSpeed: relativeSpeed,
        wavelengthRatio: source / observed };
    },
    doubleSlitAngle: function (o) {
      var order = o.order, wavelength = o.wavelength,
          separation = o.separation, angle = o.angle;
      if (order == null) { order = separation * Math.sin(angle) / wavelength; }
      else if (wavelength == null) { wavelength = separation * Math.sin(angle) / order; }
      else if (separation == null) { separation = order * wavelength / Math.sin(angle); }
      else if (angle == null) { angle = Math.asin(order * wavelength / separation); }
      return { order: order, wavelength: wavelength,
        separation: separation, angle: angle };
    },
    doubleSlitFringes: function (o) {
      var spacing = o.spacing, wavelength = o.wavelength,
          distance = o.distance, separation = o.separation;
      if (spacing == null) { spacing = wavelength * distance / separation; }
      else if (wavelength == null) { wavelength = spacing * separation / distance; }
      else if (distance == null) { distance = spacing * separation / wavelength; }
      else if (separation == null) { separation = wavelength * distance / spacing; }
      return { spacing: spacing, wavelength: wavelength,
        distance: distance, separation: separation };
    },
    bragg: function (o) {
      var order = o.order, wavelength = o.wavelength,
          spacing = o.spacing, angle = o.angle;
      if (order == null) { order = 2 * spacing * Math.sin(angle) / wavelength; }
      else if (wavelength == null) { wavelength = 2 * spacing * Math.sin(angle) / order; }
      else if (spacing == null) { spacing = order * wavelength / (2 * Math.sin(angle)); }
      else if (angle == null) { angle = Math.asin(order * wavelength / (2 * spacing)); }
      return { order: order, wavelength: wavelength,
        spacing: spacing, angle: angle };
    }
  };

  var gravity = {
    // Newtonian speeds at radius r from the centre of a spherical mass M.
    speeds: function (mass, radius) {
      var circular = Math.sqrt(CONSTANTS.G * mass / radius);
      return { escape: Math.SQRT2 * circular, circular: circular,
        acceleration: CONSTANTS.G * mass / (radius * radius) };
    }
  };

  var chemistry = {
    // Amount of substance from sample mass and molar mass: n = m/M.
    massMoles: function (o) {
      var n = o.n, mass = o.mass, molarMass = o.molarMass;
      if (n == null) { n = mass / molarMass; }
      else if (mass == null) { mass = n * molarMass; }
      else if (molarMass == null) { molarMass = mass / n; }
      return { n: n, mass: mass, molarMass: molarMass };
    },
    // Amount concentration in SI mol/m^3: c = n/V.
    concentration: function (o) {
      var concentration = o.concentration, n = o.n, volume = o.volume;
      if (concentration == null) { concentration = n / volume; }
      else if (n == null) { n = concentration * volume; }
      else if (volume == null) { volume = n / concentration; }
      return { concentration: concentration, n: n, volume: volume };
    }
  };

  // ---- school mathematics ---------------------------------------------
  // Right-triangle solver. Supply exactly two known values from opposite
  // side a, adjacent side b, hypotenuse c and acute angle theta (radians),
  // with at least one side. Returns every value or null for an impossible
  // or under/over-specified triangle.
  var maths = {
    rightTriangle: function (o) {
      function known(x) { return typeof x === "number" && isFinite(x); }
      var a = o.a, b = o.b, c = o.c, theta = o.theta;
      var count = [a, b, c, theta].filter(known).length;
      if (count !== 2 || (!known(a) && !known(b) && !known(c))) { return null; }
      if ((known(a) && a <= 0) || (known(b) && b <= 0) ||
          (known(c) && c <= 0) ||
          (known(theta) && (theta <= 0 || theta >= Math.PI / 2))) {
        return null;
      }

      if (known(a) && known(b)) {
        c = Math.hypot(a, b);
        theta = Math.atan2(a, b);
      } else if (known(a) && known(c)) {
        if (a >= c) { return null; }
        b = Math.sqrt(c * c - a * a);
        theta = Math.asin(a / c);
      } else if (known(b) && known(c)) {
        if (b >= c) { return null; }
        a = Math.sqrt(c * c - b * b);
        theta = Math.acos(b / c);
      } else if (known(theta) && known(a)) {
        b = a / Math.tan(theta);
        c = a / Math.sin(theta);
      } else if (known(theta) && known(b)) {
        a = b * Math.tan(theta);
        c = b / Math.cos(theta);
      } else if (known(theta) && known(c)) {
        a = c * Math.sin(theta);
        b = c * Math.cos(theta);
      } else {
        return null;
      }

      if (![a, b, c, theta].every(known)) { return null; }
      return { a: a, b: b, c: c, theta: theta };
    }
  };

  var computing = {
    // Exact non-negative integer conversion. BigInt keeps values beyond the
    // ordinary JavaScript Number precision limit exact in every base.
    convertInteger: function (text, base) {
      var raw = String(text).trim(), pattern = base === 2 ? /^[01]+$/ :
        base === 10 ? /^[0-9]+$/ : base === 16 ? /^[0-9a-fA-F]+$/ : null;
      if (!pattern || !pattern.test(raw)) { return null; }
      var value;
      try {
        value = BigInt(base === 2 ? "0b" + raw : base === 16 ? "0x" + raw : raw);
      } catch (e) { return null; }
      return { binary: value.toString(2), decimal: value.toString(10),
        hexadecimal: value.toString(16).toUpperCase() };
    }
  };

  // ---- GCSE / A-level relations -----------------------------------------
  // Each takes an object with exactly one property null (the unknown) and
  // the others in SI; it returns the full set in SI, so a page can show the
  // solved value plus any derived extras. Everything is a rearrangement of
  // one defining equation — free knowledge, stated on each page.

  var gcse = {
    // Newton's second law: F = m·a
    fma: function (o) {
      var F = o.F, m = o.m, a = o.a;
      if (F == null) { F = m * a; }
      else if (m == null) { m = F / a; }
      else if (a == null) { a = F / m; }
      return { F: F, m: m, a: a };
    },
    // Ohm's law V = I·R, with electrical power P = V·I
    ohms: function (o) {
      var V = o.V, I = o.I, R = o.R;
      if (V == null) { V = I * R; }
      else if (I == null) { I = V / R; }
      else if (R == null) { R = V / I; }
      return { V: V, I: I, R: R, P: V * I };
    },
    // Wave equation v = f·λ
    wave: function (o) {
      var v = o.v, f = o.f, lambda = o.lambda;
      if (v == null) { v = f * lambda; }
      else if (f == null) { f = v / lambda; }
      else if (lambda == null) { lambda = v / f; }
      return { v: v, f: f, lambda: lambda };
    },
    // Density: rho = m/V.
    density: function (o) {
      var rho = o.rho, m = o.m, V = o.V;
      if (rho == null) { rho = m / V; }
      else if (m == null) { m = rho * V; }
      else if (V == null) { V = m / rho; }
      return { rho: rho, m: m, V: V };
    },
    // Mechanical pressure P = F/A and hydrostatic gauge pressure P = rho g h.
    pressureFromForce: function (o) {
      var P = o.P, F = o.F, A = o.A;
      if (P == null) { P = F / A; }
      else if (F == null) { F = P * A; }
      else if (A == null) { A = F / P; }
      return { P: P, F: F, A: A };
    },
    liquidPressure: function (o) {
      var P = o.P, rho = o.rho, g = o.g, h = o.h;
      if (P == null) { P = rho * g * h; }
      else if (rho == null) { rho = P / (g * h); }
      else if (g == null) { g = P / (rho * h); }
      else if (h == null) { h = P / (rho * g); }
      return { P: P, rho: rho, g: g, h: h };
    },
    // Thermal energy: Q = m c deltaT; phase change: Q = m L.
    specificHeat: function (o) {
      var Q = o.Q, m = o.m, c = o.c, dT = o.dT;
      if (Q == null) { Q = m * c * dT; }
      else if (m == null) { m = Q / (c * dT); }
      else if (c == null) { c = Q / (m * dT); }
      else if (dT == null) { dT = Q / (m * c); }
      return { Q: Q, m: m, c: c, dT: dT };
    },
    latentHeat: function (o) {
      var Q = o.Q, m = o.m, L = o.L;
      if (Q == null) { Q = m * L; }
      else if (m == null) { m = Q / L; }
      else if (L == null) { L = Q / m; }
      return { Q: Q, m: m, L: L };
    },
    // Hooke's law and elastic potential energy within the proportional limit.
    hookesLaw: function (o) {
      var F = o.F, k = o.k, x = o.x;
      if (F == null) { F = k * x; }
      else if (k == null) { k = F / x; }
      else if (x == null) { x = F / k; }
      return { F: F, k: k, x: x };
    },
    elasticEnergy: function (o) {
      var E = o.E, k = o.k, x = o.x;
      if (E == null) { E = 0.5 * k * x * x; }
      else if (k == null) { k = 2 * E / (x * x); }
      else if (x == null) { x = Math.sqrt(2 * E / k); }
      return { E: E, k: k, x: x };
    },
    // Moment about a pivot M = Fd, and two opposing moments in equilibrium.
    moment: function (o) {
      var M = o.M, F = o.F, d = o.d;
      if (M == null) { M = F * d; }
      else if (F == null) { F = M / d; }
      else if (d == null) { d = M / F; }
      return { M: M, F: F, d: d };
    },
    balancedMoments: function (o) {
      var F1 = o.F1, d1 = o.d1, F2 = o.F2, d2 = o.d2;
      if (F1 == null) { F1 = F2 * d2 / d1; }
      else if (d1 == null) { d1 = F2 * d2 / F1; }
      else if (F2 == null) { F2 = F1 * d1 / d2; }
      else if (d2 == null) { d2 = F1 * d1 / F2; }
      return { F1: F1, d1: d1, F2: F2, d2: d2 };
    },
    transformerRatio: function (o) {
      var Vp = o.Vp, Vs = o.Vs, Np = o.Np, Ns = o.Ns;
      if (Vp == null) { Vp = Vs * Np / Ns; }
      else if (Vs == null) { Vs = Vp * Ns / Np; }
      else if (Np == null) { Np = Vp * Ns / Vs; }
      else if (Ns == null) { Ns = Vs * Np / Vp; }
      return { Vp: Vp, Vs: Vs, Np: Np, Ns: Ns };
    },
    idealTransformerPower: function (o) {
      var Vp = o.Vp, Ip = o.Ip, Vs = o.Vs, Is = o.Is;
      if (Vp == null) { Vp = Vs * Is / Ip; }
      else if (Ip == null) { Ip = Vs * Is / Vp; }
      else if (Vs == null) { Vs = Vp * Ip / Is; }
      else if (Is == null) { Is = Vp * Ip / Vs; }
      return { Vp: Vp, Ip: Ip, Vs: Vs, Is: Is, power: Vp * Ip };
    },
    // Energy stored by an ideal capacitor: E = 1/2 C V^2. Voltage is
    // returned as a non-negative potential-difference magnitude.
    capacitorEnergy: function (o) {
      var E = o.E, C = o.C, V = o.V;
      if (E == null) { E = 0.5 * C * V * V; }
      else if (C == null) { C = 2 * E / (V * V); }
      else if (V == null) { V = Math.sqrt(2 * E / C); }
      return { E: E, C: C, V: V };
    },
    // RC time constant for an ideal first-order charging or discharging
    // circuit: tau = R C.
    rcTimeConstant: function (o) {
      var tau = o.tau, R = o.R, C = o.C;
      if (tau == null) { tau = R * C; }
      else if (R == null) { R = tau / C; }
      else if (C == null) { C = tau / R; }
      return { tau: tau, R: R, C: C };
    },
    // Ideal gas law PV = nRT, with absolute temperature in kelvin.
    idealGas: function (o) {
      var P = o.P, V = o.V, n = o.n, T = o.T;
      if (P == null) { P = n * CONSTANTS.R * T / V; }
      else if (V == null) { V = n * CONSTANTS.R * T / P; }
      else if (n == null) { n = P * V / (CONSTANTS.R * T); }
      else if (T == null) { T = P * V / (n * CONSTANTS.R); }
      return { P: P, V: V, n: n, T: T };
    },
    // Kinetic energy: E = ½mv². Solving for speed returns the
    // non-negative magnitude; a negative radicand has no real solution.
    kineticEnergy: function (o) {
      var E = o.E, m = o.m, v = o.v;
      if (E == null) { E = 0.5 * m * v * v; }
      else if (m == null) { m = 2 * E / (v * v); }
      else if (v == null) { v = Math.sqrt(2 * E / m); }
      return { E: E, m: m, v: v };
    },
    // Gravitational potential energy change near Earth's surface:
    // E = mgh, with h measured relative to a chosen reference level.
    gravitationalPotentialEnergy: function (o) {
      var E = o.E, m = o.m, g = o.g, h = o.h;
      if (E == null) { E = m * g * h; }
      else if (m == null) { m = E / (g * h); }
      else if (g == null) { g = E / (m * h); }
      else if (h == null) { h = E / (m * g); }
      return { E: E, m: m, g: g, h: h };
    },
    // Work done by a constant force parallel to the displacement: W = Fs.
    work: function (o) {
      var W = o.W, F = o.F, s = o.s;
      if (W == null) { W = F * s; }
      else if (F == null) { F = W / s; }
      else if (s == null) { s = W / F; }
      return { W: W, F: F, s: s };
    },
    // Average power: P = W/t, where W is energy transferred in time t.
    powerFromWork: function (o) {
      var P = o.P, W = o.W, t = o.t;
      if (P == null) { P = W / t; }
      else if (W == null) { W = P * t; }
      else if (t == null) { t = W / P; }
      return { P: P, W: W, t: t };
    },
    // Linear momentum: p = mv. Velocity and momentum carry the chosen
    // one-dimensional sign; mass is positive.
    momentum: function (o) {
      var p = o.p, m = o.m, v = o.v;
      if (p == null) { p = m * v; }
      else if (m == null) { m = p / v; }
      else if (v == null) { v = p / m; }
      return { p: p, m: m, v: v };
    },
    // Impulse from a constant (or interval-average) resultant force: J = Ft.
    impulse: function (o) {
      var J = o.J, F = o.F, t = o.t;
      if (J == null) { J = F * t; }
      else if (F == null) { F = J / t; }
      else if (t == null) { t = J / F; }
      return { J: J, F: F, t: t };
    },
    // Impulse equals change in momentum: J = Δp = pFinal − pInitial.
    changeInMomentum: function (o) {
      var J = o.J, pInitial = o.pInitial, pFinal = o.pFinal;
      if (J == null) { J = pFinal - pInitial; }
      else if (pInitial == null) { pInitial = pFinal - J; }
      else if (pFinal == null) { pFinal = pInitial + J; }
      return { J: J, pInitial: pInitial, pFinal: pFinal };
    },
    // Equivalent resistance for ideal resistors. A zero-ohm parallel branch
    // shorts the network; empty, negative or non-finite lists are invalid.
    seriesResistance: function (values) {
      if (!values.length || values.some(function (r) { return !isFinite(r) || r < 0; })) { return NaN; }
      return values.reduce(function (sum, r) { return sum + r; }, 0);
    },
    parallelResistance: function (values) {
      if (!values.length || values.some(function (r) { return !isFinite(r) || r < 0; })) { return NaN; }
      if (values.some(function (r) { return r === 0; })) { return 0; }
      return 1 / values.reduce(function (sum, r) { return sum + 1 / r; }, 0);
    },
    resistanceNetwork: function (values) {
      if (!values.length || values.some(function (r) { return !isFinite(r) || r < 0; })) {
        return { series: NaN, parallel: NaN };
      }
      return {
        series: values.reduce(function (sum, r) { return sum + r; }, 0),
        parallel: values.some(function (r) { return r === 0; })
          ? 0
          : 1 / values.reduce(function (sum, r) { return sum + 1 / r; }, 0)
      };
    },
    // Level-ground projectile motion with uniform downward gravity and no
    // air resistance. Angle is measured above the horizontal in radians.
    projectile: function (o) {
      var speed = o.speed, angle = o.angle, gravity = o.gravity;
      if (!isFinite(speed) || !isFinite(angle) || !isFinite(gravity) ||
          speed < 0 || angle < 0 || angle > Math.PI / 2 || gravity <= 0) {
        return { range: NaN, maxHeight: NaN, flightTime: NaN };
      }
      var ux = speed * Math.cos(angle), uy = speed * Math.sin(angle);
      if (Math.abs(ux) < Math.abs(speed) * 1e-15) { ux = 0; }
      if (Math.abs(uy) < Math.abs(speed) * 1e-15) { uy = 0; }
      var flightTime = 2 * uy / gravity;
      return {
        range: ux * flightTime,
        maxHeight: uy * uy / (2 * gravity),
        flightTime: flightTime
      };
    },

    // SUVAT — constant-acceleration kinematics. Give any 3 of {s,u,v,a,t}
    // in SI; returns all five. Uses the five equations by constraint
    // propagation, preferring linear steps; the only quadratic is for time,
    // where the smallest non-negative root is taken (stated on the page).
    suvat: function (input, used) {
      function isNum(x) { return typeof x === "number" && isFinite(x); }
      var V = {};
      ["s", "u", "v", "a", "t"].forEach(function (k) { if (isNum(input[k])) { V[k] = input[k]; } });
      if (Object.keys(V).length < 3) { return null; }

      function has(k) { return isNum(V[k]); }
      function set(k, val) {
        if (!has(k) && isNum(val)) { V[k] = val; return true; }
        return false;
      }
      // smallest non-negative root of A t² + B t + C = 0
      function posRoot(A, B, C) {
        if (A === 0) { return B !== 0 ? -C / B : NaN; }
        var disc = B * B - 4 * A * C;
        if (disc < 0) { return NaN; }
        var sq = Math.sqrt(disc);
        var roots = [(-B + sq) / (2 * A), (-B - sq) / (2 * A)]
          .filter(function (r) { return r >= 0; })
          .sort(function (x, y) { return x - y; });
        return roots.length ? roots[0] : NaN;
      }

      // E() records which named equation produced a value (for the page's
      // "solved using…" line) whenever a set() succeeds.
      var EQ = ["v = u + at", "s = ut + ½at²", "s = ½(u + v)t",
                "v² = u² + 2as", "s = vt − ½at²"];
      function E(i, ok) {
        if (ok && used && used.indexOf(EQ[i]) < 0) { used.push(EQ[i]); }
        return ok;
      }

      var changed = true, guard = 0;
      while (changed && guard++ < 20) {
        changed = false;
        // Eq1: v = u + a t
        if (has("u") && has("a") && has("t")) { changed = E(0, set("v", V.u + V.a * V.t)) || changed; }
        if (has("v") && has("a") && has("t")) { changed = E(0, set("u", V.v - V.a * V.t)) || changed; }
        if (has("v") && has("u") && has("t") && V.t !== 0) { changed = E(0, set("a", (V.v - V.u) / V.t)) || changed; }
        if (has("v") && has("u") && has("a") && V.a !== 0) { changed = E(0, set("t", (V.v - V.u) / V.a)) || changed; }
        // Eq2: s = u t + ½ a t²
        if (has("u") && has("a") && has("t")) { changed = E(1, set("s", V.u * V.t + 0.5 * V.a * V.t * V.t)) || changed; }
        if (has("s") && has("a") && has("t") && V.t !== 0) { changed = E(1, set("u", (V.s - 0.5 * V.a * V.t * V.t) / V.t)) || changed; }
        if (has("s") && has("u") && has("t") && V.t !== 0) { changed = E(1, set("a", 2 * (V.s - V.u * V.t) / (V.t * V.t))) || changed; }
        if (has("s") && has("u") && has("a")) { changed = E(1, set("t", posRoot(0.5 * V.a, V.u, -V.s))) || changed; }
        // Eq3: s = ½ (u + v) t
        if (has("u") && has("v") && has("t")) { changed = E(2, set("s", 0.5 * (V.u + V.v) * V.t)) || changed; }
        if (has("s") && has("v") && has("t") && V.t !== 0) { changed = E(2, set("u", 2 * V.s / V.t - V.v)) || changed; }
        if (has("s") && has("u") && has("t") && V.t !== 0) { changed = E(2, set("v", 2 * V.s / V.t - V.u)) || changed; }
        if (has("s") && has("u") && has("v") && (V.u + V.v) !== 0) { changed = E(2, set("t", 2 * V.s / (V.u + V.v))) || changed; }
        // Eq4: v² = u² + 2 a s  (linear use only: solve s or a)
        if (has("u") && has("v") && has("a") && V.a !== 0) { changed = E(3, set("s", (V.v * V.v - V.u * V.u) / (2 * V.a))) || changed; }
        if (has("u") && has("v") && has("s") && V.s !== 0) { changed = E(3, set("a", (V.v * V.v - V.u * V.u) / (2 * V.s))) || changed; }
        // Eq5: s = v t − ½ a t²
        if (has("v") && has("a") && has("t")) { changed = E(4, set("s", V.v * V.t - 0.5 * V.a * V.t * V.t)) || changed; }
        if (has("s") && has("a") && has("t") && V.t !== 0) { changed = E(4, set("v", (V.s + 0.5 * V.a * V.t * V.t) / V.t)) || changed; }
        if (has("s") && has("v") && has("t") && V.t !== 0) { changed = E(4, set("a", 2 * (V.v * V.t - V.s) / (V.t * V.t))) || changed; }
        if (has("s") && has("v") && has("a")) { changed = E(4, set("t", posRoot(-0.5 * V.a, V.v, -V.s))) || changed; }
      }
      return V;
    }
  };

  return {
    UNITS: UNITS,
    toSI: toSI,
    fromSI: fromSI,
    format: format,
    displaySize: displaySize,
    fitDisplay: fitDisplay,
    syncSolvedInput: syncSolvedInput,
    clearScienceInputs: clearScienceInputs,
    superscript: superscript,
    gaussianBeam: gaussianBeam,
    lens: lens,
    constants: CONSTANTS,
    quantum: quantum,
    nuclear: nuclear,
    waves: waves,
    gravity: gravity,
    chemistry: chemistry,
    maths: maths,
    computing: computing,
    gcse: gcse
  };
});
