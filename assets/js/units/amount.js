/*
  Amount of substance units for the Ans converters.

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
    id: "amount",
    name: "Amount of substance",
    base: "mol",
    units: [
      { id: "mol", symbol: "mol", name: "Mole", factor: 1, exact: true, aliases: ["mole", "moles"] },
      { id: "mmol", symbol: "mmol", name: "Millimole", factor: 1e-3, exact: true, aliases: ["millimole"] },
      { id: "umol", symbol: "µmol", name: "Micromole", factor: 1e-6, exact: true, aliases: ["micromole"] },
      { id: "kmol", symbol: "kmol", name: "Kilomole", factor: 1e3, exact: true, aliases: ["kilomole"] }
    ]
  };
});
