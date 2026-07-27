/*
  Acceleration units for the Ans converters.

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
    id: "acceleration",
    name: "Acceleration",
    base: "m/s²",
    note: "Standard gravity g₀ is defined as exactly 9.80665 m/s². Local gravitational acceleration varies with latitude and altitude.",
    units: [
      { id: "mps2", symbol: "m/s²", name: "Metre per second squared", factor: 1, exact: true, aliases: ["metres per second squared"] },
      { id: "g0", symbol: "g₀", name: "Standard gravity", factor: 9.80665, exact: true, aliases: ["g force", "standard gravity"] },
      { id: "ftps2", symbol: "ft/s²", name: "Foot per second squared", factor: 0.3048, exact: true, aliases: ["feet per second squared"] },
      { id: "gal", symbol: "Gal", name: "Galileo", factor: 0.01, exact: true, aliases: ["galileo", "gal"] },
      { id: "kmhs", symbol: "km/h/s", name: "Kilometre per hour per second", factor: 1 / 3.6, exact: true, aliases: ["kilometres per hour per second"] }
    ]
  };
});
