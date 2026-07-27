/*
  Magnetic flux density units for the Ans converters.

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
    id: "magneticfield",
    name: "Magnetic flux density",
    base: "T",
    units: [
      { id: "t", symbol: "T", name: "Tesla", factor: 1, exact: true, aliases: ["tesla"] },
      { id: "mt", symbol: "mT", name: "Millitesla", factor: 1e-3, exact: true, aliases: ["millitesla"] },
      { id: "ut", symbol: "µT", name: "Microtesla", factor: 1e-6, exact: true, aliases: ["microtesla"] },
      { id: "g", symbol: "G", name: "Gauss", factor: 1e-4, exact: true, aliases: ["gauss"] },
      { id: "kG", symbol: "kG", name: "Kilogauss", factor: 0.1, exact: true, aliases: ["kilogauss"] }
    ]
  };
});
