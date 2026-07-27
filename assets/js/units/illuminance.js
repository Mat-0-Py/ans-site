/*
  Illuminance units for the Ans converters.

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
    id: "illuminance",
    name: "Illuminance",
    base: "lx",
    units: [
      { id: "lx", symbol: "lx", name: "Lux", factor: 1, exact: true, aliases: ["lux"] },
      { id: "fc", symbol: "fc", name: "Foot-candle", factor: 1 / 0.09290304, exact: true, aliases: ["foot candle", "foot-candle"] },
      { id: "phot", symbol: "ph", name: "Phot", factor: 10000, exact: true, aliases: ["phot"] }
    ]
  };
});
