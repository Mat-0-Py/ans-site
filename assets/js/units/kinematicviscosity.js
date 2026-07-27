/*
  Kinematic viscosity units for the Ans converters.

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
    id: "kinematicviscosity",
    name: "Kinematic viscosity",
    base: "m²/s",
    note: "Kinematic viscosity is dynamic viscosity divided by density. Without a density, Pa·s cannot be converted to m²/s.",
    units: [
      { id: "m2s", symbol: "m²/s", name: "Square metre per second", factor: 1, exact: true, aliases: ["square metres per second"] },
      { id: "st", symbol: "St", name: "Stokes", factor: 1e-4, exact: true, aliases: ["stokes"] },
      { id: "cst", symbol: "cSt", name: "Centistokes", factor: 1e-6, exact: true, aliases: ["centistokes"] }
    ]
  };
});
