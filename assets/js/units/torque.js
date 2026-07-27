/*
  Torque units for the Ans converters.

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
    id: "torque",
    name: "Torque",
    base: "N·m",
    note: "Torque is force multiplied by perpendicular distance. A newton metre has the same dimensions as a joule, but torque and energy are not interchangeable quantities.",
    units: [
      { id: "nm", symbol: "N·m", name: "Newton metre", factor: 1, exact: true, aliases: ["newton metre", "newton meter"] },
      { id: "ncm", symbol: "N·cm", name: "Newton centimetre", factor: 0.01, exact: true, aliases: ["newton centimetre"] },
      { id: "knm", symbol: "kN·m", name: "Kilonewton metre", factor: 1000, exact: true, aliases: ["kilonewton metre"] },
      { id: "lbfft", symbol: "lbf·ft", name: "Pound-force foot", factor: 1.3558179483314004, exact: true, aliases: ["pound foot", "foot pound torque"] },
      { id: "lbfin", symbol: "lbf·in", name: "Pound-force inch", factor: 0.1129848290276167, exact: true, aliases: ["pound inch", "inch pound torque"] },
      { id: "kgfm", symbol: "kgf·m", name: "Kilogram-force metre", factor: 9.80665, exact: true, aliases: ["kilogram force metre"] },
      { id: "ozfin", symbol: "ozf·in", name: "Ounce-force inch", factor: 0.007061551814226, exact: true, aliases: ["ounce inch torque"] }
    ]
  };
});
