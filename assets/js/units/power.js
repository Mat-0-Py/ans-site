/*
  Power units for the Ans converters.

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
    id: "power",
    name: "Power",
    base: "W",
    units: [
      { id: "mW", symbol: "mW", name: "Milliwatt", factor: 1e-3, exact: true, aliases: ["milliwatt"] },
      { id: "w", symbol: "W", name: "Watt", factor: 1, exact: true, aliases: ["watt", "watts"] },
      { id: "kw", symbol: "kW", name: "Kilowatt", factor: 1e3, exact: true, aliases: ["kilowatt"] },
      { id: "MW", symbol: "MW", name: "Megawatt", factor: 1e6, exact: true, aliases: ["megawatt"] },
      { id: "hp", symbol: "hp", name: "Horsepower (mechanical)", factor: 745.6998715822702, exact: true, aliases: ["horsepower", "bhp", "hp"] },
      { id: "ps", symbol: "PS", name: "Metric horsepower (PS)", factor: 735.49875, exact: true, aliases: ["ps", "cv", "pferdestarke", "metric horsepower"] },
      { id: "btuh", symbol: "BTU/h", name: "BTU per hour", factor: 1055.05585262 / 3600, exact: true, aliases: ["btu per hour", "air conditioning"] },
      { id: "gw", symbol: "GW", name: "Gigawatt", factor: 1e9, exact: true, aliases: ["gigawatt"] },
      { id: "hp_e", symbol: "hp (electric)", name: "Horsepower (electrical)", factor: 746, exact: true, aliases: ["electrical horsepower"] },
      { id: "hp_boiler", symbol: "hp (boiler)", name: "Horsepower (boiler)", factor: 9809.5, aliases: ["boiler horsepower"] },
      { id: "ton_ref", symbol: "ton refrigeration", name: "Ton of refrigeration", factor: 3516.8528420667, exact: true, aliases: ["ton refrigeration", "refrigeration ton"] },
      { id: "kcalit_h", symbol: "kcal(IT)/h", name: "Kilocalorie (IT) per hour", factor: 4.1868e3 / 3600, exact: true, aliases: ["kcal per hour", "kilocalorie per hour"] },
      { id: "ergs", symbol: "erg/s", name: "Erg per second", factor: 1e-7, exact: true, aliases: ["erg per second"] }
    ]
  };
});
