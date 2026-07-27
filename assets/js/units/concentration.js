/*
  Amount concentration units for the Ans converters.

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
    id: "concentration",
    name: "Amount concentration",
    base: "mol/m³",
    note: "Mass concentration and amount concentration are not interchangeable without the substance's molar mass. This page therefore does not fake mg/dL to mmol/L.",
    units: [
      { id: "molm3", symbol: "mol/m³", name: "Mole per cubic metre", factor: 1, exact: true, aliases: ["moles per cubic metre"] },
      { id: "moll", symbol: "mol/L", name: "Mole per litre", factor: 1000, exact: true, aliases: ["moles per litre", "molar"] },
      { id: "mmoll", symbol: "mmol/L", name: "Millimole per litre", factor: 1, exact: true, aliases: ["millimoles per litre"] },
      { id: "umoll", symbol: "µmol/L", name: "Micromole per litre", factor: 1e-3, exact: true, aliases: ["micromoles per litre"] }
    ]
  };
});
