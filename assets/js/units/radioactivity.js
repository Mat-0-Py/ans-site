/*
  Radioactivity units for the Ans converters.

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
    id: "radioactivity",
    name: "Radioactivity",
    base: "Bq",
    note: "Activity counts nuclear decays per second. It is not radiation dose, which depends on absorbed energy and biological effect.",
    units: [
      { id: "bq", symbol: "Bq", name: "Becquerel", factor: 1, exact: true, aliases: ["becquerel"] },
      { id: "kbq", symbol: "kBq", name: "Kilobecquerel", factor: 1e3, exact: true, aliases: ["kilobecquerel"] },
      { id: "mbq", symbol: "MBq", name: "Megabecquerel", factor: 1e6, exact: true, aliases: ["megabecquerel"] },
      { id: "gbq", symbol: "GBq", name: "Gigabecquerel", factor: 1e9, exact: true, aliases: ["gigabecquerel"] },
      { id: "ci", symbol: "Ci", name: "Curie", factor: 3.7e10, exact: true, aliases: ["curie"] },
      { id: "mci", symbol: "mCi", name: "Millicurie", factor: 3.7e7, exact: true, aliases: ["millicurie"] },
      { id: "uci", symbol: "µCi", name: "Microcurie", factor: 3.7e4, exact: true, aliases: ["microcurie"] }
    ]
  };
});
