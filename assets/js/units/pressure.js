/*
  Pressure units for the Ans converters.

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
    id: "pressure",
    name: "Pressure",
    base: "Pa",
    units: [
      { id: "pa", symbol: "Pa", name: "Pascal", factor: 1, exact: true, aliases: ["pascal"] },
      { id: "hpa", symbol: "hPa", name: "Hectopascal", factor: 100, exact: true, aliases: ["hectopascal", "millibar"] },
      { id: "kpa", symbol: "kPa", name: "Kilopascal", factor: 1e3, exact: true, aliases: ["kilopascal"] },
      { id: "mpa", symbol: "MPa", name: "Megapascal", factor: 1e6, exact: true, aliases: ["megapascal"] },
      { id: "bar", symbol: "bar", name: "Bar", factor: 1e5, exact: true, aliases: ["bar", "bars"] },
      { id: "mbar", symbol: "mbar", name: "Millibar", factor: 100, exact: true, aliases: ["millibar"] },
      { id: "atm", symbol: "atm", name: "Standard atmosphere", factor: 101325, exact: true, aliases: ["atmosphere", "atm"] },
      { id: "torr", symbol: "Torr", name: "Torr", factor: 101325 / 760, exact: true, aliases: ["torr"] },
      { id: "mmhg", symbol: "mmHg", name: "Millimetre of mercury", factor: 133.322387415, aliases: ["mm hg", "blood pressure"] },
      { id: "inhg", symbol: "inHg", name: "Inch of mercury", factor: 3386.388640341, aliases: ["in hg", "barometric"] },
      { id: "psi", symbol: "psi", name: "Pound per square inch", factor: 6894.757293168361, exact: true, aliases: ["psi", "pounds per square inch", "tyre pressure"] },
      { id: "kgfcm2", symbol: "kgf/cm²", name: "Kilogram-force per square centimetre", factor: 98066.5, exact: true, aliases: ["kgf/cm2", "technical atmosphere"] },
      { id: "ksi", symbol: "ksi", name: "Kip per square inch", factor: 6894757.293168361, exact: true, aliases: ["ksi", "kilopound per square inch"] },
      { id: "mmh2o", symbol: "mmH₂O", name: "Millimetre of water", factor: 9.80665, aliases: ["mm water", "millimetre water column"] },
      { id: "inh2o", symbol: "inH₂O", name: "Inch of water (4 °C)", factor: 249.0889, aliases: ["in water", "inch water column"] },
      { id: "ubar", symbol: "µbar", name: "Microbar", factor: 0.1, exact: true, aliases: ["microbar"] },
      { id: "dyncm2", symbol: "dyn/cm²", name: "Dyne per square centimetre", factor: 0.1, exact: true, aliases: ["dyne per square centimetre", "dyn/cm2"] }
    ]
  };
});
