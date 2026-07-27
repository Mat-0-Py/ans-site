/*
  AnsConvert core — the conversion engine for the anscalc.com converters
  (Website-Private-Docs/CONVERT-DESIGN.md).

  The engine only. Unit data lives in assets/js/units/<quantity>.js, one
  file per quantity, and registers itself here. A converter page loads this
  file plus the single quantity it needs, which is what keeps a page inside
  the 100 KB family budget with room to spare — and is why the converters
  ship readable source rather than a minified copy.

  Load order in the browser:

      <script src="/assets/js/convert-core.js"></script>
      <script src="/assets/js/units/mass.js"></script>
      <script src="/assets/js/converter.js"></script>

  Under Node, require assets/js/convert.js instead: it assembles the core
  and every quantity, which is what the tests and page generator want.

  Design rules this file exists to enforce:

  - Every unit is defined ONCE, in its quantity's file. A page never
    carries a factor.
  - Conversion is always value -> quantity base (SI) -> value. Never a
    direct pair factor, so a new unit costs one line, not N pairs.
  - A unit is affine (factor + offset) or reciprocal (inverse), not just a
    multiplier: temperature and fuel economy are first-class, not special
    cases bolted onto a page.
  - `exact: true` marks a definitional conversion (an inch IS 25.4 mm).
    Pages show this, because "exact vs conventional" is the honesty
    signature of a converter, the way stated assumptions are for physics.
  - `aliases` carry the words people actually search and type ("lbs",
    "pounds", "klicks"). They feed the page copy, the hub, and any future
    site search from one place.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();          // Node (via assets/js/convert.js)
  } else {
    root.AnsConvert = factory();         // browser (pages)
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---- the registry -----------------------------------------------------
  // Filled in by the per-quantity files as they load. Ordered by
  // registration, which is the order the unit files are listed in
  // assets/js/convert.js.
  //
  //   linear      base = value x factor
  //   affine      base = value x factor + offset      (temperature)
  //   reciprocal  base = factor / value               (fuel economy)

  var QUANTITIES = [];
  var BY_ID = {};

  function register(q) {
    if (BY_ID[q.id]) { return BY_ID[q.id]; }   // idempotent: loading twice is harmless
    q.byId = {};
    q.units.forEach(function (u) { u.quantity = q.id; q.byId[u.id] = u; });
    QUANTITIES.push(q);
    BY_ID[q.id] = q;
    return q;
  }

  function quantity(id) { return BY_ID[id] || null; }

  function unit(quantityId, unitId) {
    var q = quantity(quantityId);
    return q ? (q.byId[unitId] || null) : null;
  }

  // ---- conversion -------------------------------------------------------
  // Always via the quantity's SI base, never a direct pair factor.

  function toBase(value, u) {
    if (u.inverse) { return value === 0 ? Infinity : u.factor / value; }
    return value * u.factor + (u.offset || 0);
  }

  function fromBase(base, u) {
    if (u.inverse) { return base === 0 ? Infinity : u.factor / base; }
    return (base - (u.offset || 0)) / u.factor;
  }

  function convert(value, quantityId, fromId, toId) {
    var from = unit(quantityId, fromId), to = unit(quantityId, toId);
    if (!from || !to || typeof value !== "number" || isNaN(value)) { return null; }
    return fromBase(toBase(value, from), to);
  }

  // A temperature DIFFERENCE ignores the offsets: a 10 °C rise is an 18 °F
  // rise, not −12 °F. Pages that convert intervals must call this.
  function convertDifference(value, quantityId, fromId, toId) {
    var from = unit(quantityId, fromId), to = unit(quantityId, toId);
    if (!from || !to || from.inverse || to.inverse) { return null; }
    return value * from.factor / to.factor;
  }

  // "1 cm = 0.393701 in" — the sentence a converter page leads with. For
  // affine and reciprocal quantities a single ratio is meaningless, so the
  // caller is told so rather than shown a wrong number.
  function ratio(quantityId, fromId, toId) {
    var q = quantity(quantityId);
    if (!q || q.affine || q.reciprocal) { return null; }
    var from = unit(quantityId, fromId), to = unit(quantityId, toId);
    return from && to ? from.factor / to.factor : null;
  }

  function isExact(quantityId, fromId, toId) {
    var from = unit(quantityId, fromId), to = unit(quantityId, toId);
    return !!(from && to && from.exact && to.exact);
  }

  // ---- formatting -------------------------------------------------------
  // Same register as the science pages: maximum significant figures, a
  // proper superscript ×10ⁿ exponent, trailing zeroes trimmed. The plain-
  // notation window is wider here (1e-4 to 1e9) because conversions
  // legitimately land on large round numbers — 1 mile is 1 609 344 mm, and
  // nobody wants that as 1.609×10⁶.

  var SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };

  function superscript(n) {
    return String(n).split("").map(function (c) { return SUP[c] || c; }).join("");
  }

  function trim(s) {
    return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
  }

  function format(x, sig) {
    sig = sig || 6;
    if (x === 0) { return "0"; }
    if (typeof x !== "number" || isNaN(x)) { return "—"; }
    if (!isFinite(x)) { return x > 0 ? "∞" : "−∞"; }

    var neg = x < 0, v = Math.abs(x), exp = Math.floor(Math.log10(v));

    function roundToSig(e) {
      var f = Math.pow(10, sig - 1 - e);
      return Math.round(v * f) / f;
    }

    var r = roundToSig(exp);
    var exp2 = Math.floor(Math.log10(r));   // rounding can bump 9.999 → 10
    if (exp2 !== exp) { exp = exp2; r = roundToSig(exp); }

    var out;
    if (v >= 1e-4 && v < 1e9) {
      out = trim(r.toFixed(Math.max(0, sig - 1 - exp)));
    } else {
      var mant = trim((r / Math.pow(10, exp)).toFixed(Math.max(0, sig - 1)));
      out = mant + "×10" + superscript(exp);
    }
    return (neg ? "−" : "") + out;
  }

  // The other half of formatting: a plain, machine-readable number for the
  // input box the user did not type in. `format` produces "7.45645×10⁻⁶",
  // which is right for the LCD and WRONG for an <input> — parseFloat would
  // read it back as 7.45645. Anything written into a field goes through
  // here instead, so the two boxes can always be edited in either order.
  function plain(x, sig) {
    if (typeof x !== "number" || isNaN(x) || !isFinite(x)) { return ""; }
    return String(Number(x.toPrecision(sig || 12)));
  }

  // Same three tightening steps as the science LCD, so a long converted
  // value and its unit stay inside the display at 390 px.
  function displaySize(text) {
    var length = Array.from(String(text || "")).length;
    if (length > 18) { return "is-tight"; }
    if (length > 14) { return "is-condensed"; }
    if (length > 10) { return "is-compact"; }
    return "";
  }

  function fitDisplay(element) {
    if (!element) { return; }
    ["is-compact", "is-condensed", "is-tight"].forEach(function (c) {
      element.classList.remove(c);
    });
    var size = displaySize(element.textContent);
    if (size) { element.classList.add(size); }
  }

  // ---- compound units ---------------------------------------------------
  // "5 ft 9 in", "12 st 4 lb", "1 h 30 min". People ask for height, body
  // weight and durations this way, and a converter that answers 5.748 ft is
  // technically right and practically useless.
  //
  // A compound unit is an ordinary unit with a `compound` list on it: the
  // major unit's own id followed by the minor units, largest first. Its
  // `factor` is the major unit's factor, so every existing calculation —
  // conversion, ratio, exactness, the tables — keeps working untouched.
  // Only reading and writing the value differ.

  function compoundParts(value, u) {
    var q = quantity(u.quantity);
    var parts = [];
    var negative = value < 0;
    var remaining = Math.abs(value) * u.factor;      // in the quantity's base
    u.compound.forEach(function (id, index) {
      var step = q.byId[id];
      var last = index === u.compound.length - 1;
      var amount = remaining / step.factor;
      if (!last) { amount = Math.floor(amount + 1e-9); remaining -= amount * step.factor; }
      parts.push({ unit: step, value: amount });
    });
    if (negative && parts.length) {
      // The sign belongs to the whole quantity, so it rides on the first part.
      parts[0].value = -parts[0].value;
    }
    return parts;
  }

  // "5 ft 8.9 in". Whole numbers for every part but the last.
  //
  // The last part is the one place on the site that rounds to DECIMAL PLACES
  // rather than significant figures, and deliberately: its magnitude is
  // bounded by the unit above it — under 12 inches, under 14 pounds, under
  // 60 minutes — so significant figures would print "0.834646 in" beside a
  // whole number of feet. The display-precision menu still moves it, from
  // one decimal at 3 s.f. to six at 10.
  function formatCompound(value, u, sig) {
    if (typeof value !== "number" || isNaN(value) || !isFinite(value)) { return "—"; }
    var decimals = Math.min(6, Math.max(1, (sig || 6) - 4));
    var parts = compoundParts(value, u);
    return parts.map(function (part, index) {
      var last = index === parts.length - 1;
      var text = last ? trim(part.value.toFixed(decimals)) : String(Math.round(part.value));
      return text + " " + part.unit.symbol;
    }).join(" ");
  }

  // Accepts "5 ft 9 in", "5ft 9in", "5' 9\"", "5 9" and "5". Anything the
  // page cannot make sense of returns null, so the caller can say so rather
  // than silently converting half the input.
  function parseCompound(text, u) {
    var q = quantity(u.quantity);
    var raw = String(text == null ? "" : text).trim().toLowerCase().replace(/,/g, ".");
    if (raw === "") { return null; }
    var negative = /^-/.test(raw);
    raw = raw.replace(/^[-+]/, "");

    // Symbols people actually type for the parts of this compound.
    var TYPED = { ft: ["ft", "feet", "foot", "'", "’"], in: ["in", "inch", "inches", "\"", "”", "''"],
      st: ["st", "stone"], lb: ["lb", "lbs", "pound", "pounds"],
      oz: ["oz", "ounce", "ounces"], h: ["h", "hr", "hrs", "hour", "hours"],
      min: ["m", "min", "mins", "minute", "minutes"], s: ["s", "sec", "secs", "second", "seconds"] };

    var tokens = raw.match(/[0-9]*\.?[0-9]+|[a-z'’"”]+/g);
    if (!tokens) { return null; }

    var total = 0, index = 0, seen = 0;
    while (index < tokens.length) {
      var number = parseFloat(tokens[index]);
      if (isNaN(number)) { return null; }
      index += 1;
      var label = /^[a-z'’"”]+$/.test(tokens[index] || "") ? tokens[index] : null;
      if (label) { index += 1; }
      var stepId;
      if (label) {
        stepId = u.compound.filter(function (id) {
          return (TYPED[id] || [id]).indexOf(label) >= 0;
        })[0];
        if (!stepId) { return null; }                 // a unit this compound has no part for
      } else {
        stepId = u.compound[seen];                    // positional: "5 9" is 5 ft 9 in
        if (!stepId) { return null; }
      }
      total += number * q.byId[stepId].factor;
      seen += 1;
    }
    var value = total / u.factor;
    return negative ? -value : value;
  }

  function isCompound(u) { return !!(u && u.compound); }

  // The two entry points a page uses, so it never has to ask which kind of
  // unit it is holding.
  function formatValue(value, u, sig) {
    return isCompound(u) ? formatCompound(value, u, sig) : format(value, sig);
  }

  function parseValue(text, u) {
    if (isCompound(u)) { return parseCompound(text, u); }
    var raw = String(text == null ? "" : text).trim().replace(",", ".");
    if (raw === "" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw)) { return null; }
    var value = Number(raw);
    return isFinite(value) ? value : null;
  }

  // What goes back into the editable box: a compound unit round-trips as its
  // own text, everything else as a plain machine-readable number.
  function editable(value, u, sig) {
    // A compound is read back as text, so it gets a human number of digits
    // rather than the 12 significant figures a plain field carries to stop
    // round-tripping drifting.
    return isCompound(u) ? formatCompound(value, u, 6) : plain(value, sig || 12);
  }

  // ---- search -----------------------------------------------------------
  // One place that knows what people call these things. Feeds the hub copy
  // today and a site search box the day there is one.

  function search(term) {
    var needle = String(term || "").trim().toLowerCase();
    if (!needle) { return []; }
    var hits = [];
    QUANTITIES.forEach(function (q) {
      q.units.forEach(function (u) {
        var words = [u.id, u.symbol, u.name].concat(u.aliases || []);
        var match = words.some(function (w) {
          return String(w).toLowerCase().indexOf(needle) >= 0;
        });
        if (match) { hits.push({ quantity: q.id, unit: u.id, name: u.name, symbol: u.symbol }); }
      });
    });
    return hits;
  }

  return {
    QUANTITIES: QUANTITIES,
    quantity: quantity,
    unit: unit,
    toBase: toBase,
    fromBase: fromBase,
    convert: convert,
    convertDifference: convertDifference,
    ratio: ratio,
    isExact: isExact,
    format: format,
    plain: plain,
    isCompound: isCompound,
    compoundParts: compoundParts,
    formatCompound: formatCompound,
    parseCompound: parseCompound,
    formatValue: formatValue,
    parseValue: parseValue,
    editable: editable,
    displaySize: displaySize,
    fitDisplay: fitDisplay,
    search: search,
    register: register
  };
});
