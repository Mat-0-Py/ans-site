/*
  Electric charge units for the Ans converters.

  One file per quantity, because a converter page needs exactly one of
  them: shipping all 34 to every visitor cost 43 KB of a 100 KB page
  budget for data 33/34 of which was never used.

  Loads after convert-core.js in the browser, and is pulled in by
  assets/js/convert.js under Node. Numbers live here and nowhere else.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) { module.exports = factory(); }
  else { root.AnsConvert.register(factory()); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  return {
    id: "charge",
    name: "Electric charge",
    base: "C",
    note: "Charge is not energy. Converting mAh to Wh requires a voltage, so this converter deliberately does not pretend those are interchangeable units.",
    units: [
      { id: "c", symbol: "C", name: "Coulomb", factor: 1, exact: true, aliases: ["coulomb", "coulombs"] },
      { id: "mc", symbol: "mC", name: "Millicoulomb", factor: 1e-3, exact: true, aliases: ["millicoulomb"] },
      { id: "ah", symbol: "A·h", name: "Ampere-hour", factor: 3600, exact: true, aliases: ["amp hour", "ampere hour"] },
      { id: "mah", symbol: "mA·h", name: "Milliampere-hour", factor: 3.6, exact: true, aliases: ["milliamp hour", "mah"] }
    ]
  };
});
