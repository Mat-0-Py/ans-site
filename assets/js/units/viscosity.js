/*
  Dynamic viscosity units for the Ans converters.

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
    id: "viscosity",
    name: "Dynamic viscosity",
    base: "Pa·s",
    note: "Dynamic viscosity and kinematic viscosity are different quantities. Converting between them requires density, so they have separate pages.",
    units: [
      { id: "pas", symbol: "Pa·s", name: "Pascal second", factor: 1, exact: true, aliases: ["pascal second"] },
      { id: "p", symbol: "P", name: "Poise", factor: 0.1, exact: true, aliases: ["poise"] },
      { id: "cp", symbol: "cP", name: "Centipoise", factor: 1e-3, exact: true, aliases: ["centipoise"] },
      { id: "lbfsft2", symbol: "lbf·s/ft²", name: "Pound-force second per square foot", factor: 4.4482216152605 / 0.09290304, exact: true, aliases: ["pound force second per square foot"] }
    ]
  };
});
