/*
  Force units for the Ans converters.

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
    id: "force",
    name: "Force",
    base: "N",
    note: "Kilogram-force and pound-force are weights: the force standard gravity (9.806 65 m/s²) exerts on that mass.",
    units: [
      { id: "n", symbol: "N", name: "Newton", factor: 1, exact: true, aliases: ["newton", "newtons"] },
      { id: "kn", symbol: "kN", name: "Kilonewton", factor: 1e3, exact: true, aliases: ["kilonewton"] },
      { id: "dyn", symbol: "dyn", name: "Dyne", factor: 1e-5, exact: true, aliases: ["dyne"] },
      { id: "kgf", symbol: "kgf", name: "Kilogram-force", factor: 9.80665, exact: true, aliases: ["kilogram force", "kilopond"] },
      { id: "lbf", symbol: "lbf", name: "Pound-force", factor: 4.4482216152605, exact: true, aliases: ["pound force"] },
      { id: "kip", symbol: "kip", name: "Kip-force", factor: 4448.2216152605, exact: true, aliases: ["kip", "kilopound force"] },
      { id: "pdl", symbol: "pdl", name: "Poundal", factor: 0.138254954376, exact: true, aliases: ["poundal"] },
      { id: "ozf", symbol: "ozf", name: "Ounce-force", factor: 0.27801385095378125, exact: true, aliases: ["ounce force"] },
      { id: "tf", symbol: "tf", name: "Tonne-force", factor: 9806.65, exact: true, aliases: ["tonne force", "metric ton force"] },
      { id: "sthene", symbol: "sn", name: "Sthène", factor: 1000, exact: true, aliases: ["sthene"] }
    ]
  };
});
