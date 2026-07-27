/*
  Area units for the Ans converters.

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
    id: "area",
    name: "Area",
    base: "m²",
    units: [
      { id: "mm2", symbol: "mm²", name: "Square millimetre", factor: 1e-6, exact: true, aliases: ["square millimetre", "mm2"] },
      { id: "cm2", symbol: "cm²", name: "Square centimetre", factor: 1e-4, exact: true, aliases: ["square centimetre", "cm2"] },
      { id: "m2", symbol: "m²", name: "Square metre", factor: 1, exact: true, aliases: ["square metre", "square meter", "m2", "sqm"] },
      { id: "ha", symbol: "ha", name: "Hectare", factor: 1e4, exact: true, aliases: ["hectare", "hectares"] },
      { id: "km2", symbol: "km²", name: "Square kilometre", factor: 1e6, exact: true, aliases: ["square kilometre", "km2"] },
      { id: "in2", symbol: "in²", name: "Square inch", factor: 6.4516e-4, exact: true, aliases: ["square inch", "sq in"] },
      { id: "ft2", symbol: "ft²", name: "Square foot", factor: 0.09290304, exact: true, aliases: ["square foot", "square feet", "sq ft"] },
      { id: "yd2", symbol: "yd²", name: "Square yard", factor: 0.83612736, exact: true, aliases: ["square yard", "sq yd"] },
      { id: "acre", symbol: "ac", name: "Acre", factor: 4046.8564224, exact: true, aliases: ["acre", "acres"] },
      { id: "mi2", symbol: "mi²", name: "Square mile", factor: 2589988.110336, exact: true, aliases: ["square mile", "sq mi"] },
      { id: "dunam", symbol: "dunam", name: "Dunam", factor: 1000, exact: true, aliases: ["dunam"] },
      { id: "rood", symbol: "rood", name: "Rood", factor: 1011.7141056, exact: true, aliases: ["rood"] },
      { id: "rod2", symbol: "rd²", name: "Square rod", factor: 25.29285264, exact: true, aliases: ["square rod", "square perch"] },
      { id: "chain2", symbol: "ch²", name: "Square chain", factor: 404.68564224, exact: true, aliases: ["square chain"] },
      { id: "barn", symbol: "b", name: "Barn", factor: 1e-28, exact: true, aliases: ["barn", "nuclear cross section"] }
    ]
  };
});
