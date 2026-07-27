/*
  Energy units for the Ans converters.

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
    id: "energy",
    name: "Energy",
    base: "J",
    note: "The food calorie is the kilocalorie: 1 kcal = 1000 cal. Nutrition labels marked \"calories\" mean kcal.",
    units: [
      { id: "j", symbol: "J", name: "Joule", factor: 1, exact: true, aliases: ["joule", "joules"] },
      { id: "kj", symbol: "kJ", name: "Kilojoule", factor: 1e3, exact: true, aliases: ["kilojoule"] },
      { id: "mj", symbol: "MJ", name: "Megajoule", factor: 1e6, exact: true, aliases: ["megajoule"] },
      { id: "cal", symbol: "cal", name: "Calorie (thermochemical)", factor: 4.184, exact: true, aliases: ["calorie", "small calorie"] },
      { id: "kcal", symbol: "kcal", name: "Kilocalorie (food calorie)", factor: 4184, exact: true, aliases: ["calorie", "calories", "food calorie", "Calorie"] },
      { id: "wh", symbol: "W·h", name: "Watt-hour", factor: 3600, exact: true, aliases: ["watt hour"] },
      { id: "kwh", symbol: "kW·h", name: "Kilowatt-hour", factor: 3.6e6, exact: true, aliases: ["kilowatt hour", "unit of electricity"] },
      { id: "btu", symbol: "BTU", name: "British thermal unit (IT)", factor: 1055.05585262, exact: true, aliases: ["btu", "british thermal unit"] },
      { id: "ev", symbol: "eV", name: "Electronvolt", factor: 1.602176634e-19, exact: true, aliases: ["electronvolt", "electron volt"] },
      { id: "ftlbf", symbol: "ft·lbf", name: "Foot-pound force", factor: 1.3558179483314004, exact: true, aliases: ["foot pound"] },
      { id: "cal_it", symbol: "cal (IT)", name: "Calorie (International Table)", factor: 4.1868, exact: true, aliases: ["international table calorie", "calorie it"] },
      { id: "mwh", symbol: "MW·h", name: "Megawatt-hour", factor: 3.6e9, exact: true, aliases: ["megawatt hour"] },
      { id: "gwh", symbol: "GW·h", name: "Gigawatt-hour", factor: 3.6e12, exact: true, aliases: ["gigawatt hour"] },
      { id: "therm", symbol: "therm", name: "Therm (100,000 BTU IT)", factor: 105505585.262, exact: true, aliases: ["therm", "gas therm"] },
      { id: "tnt", symbol: "t TNT", name: "Ton of TNT", factor: 4.184e9, exact: true, aliases: ["ton of tnt", "tonne tnt"] },
      { id: "ftpdl", symbol: "ft·pdl", name: "Foot-poundal", factor: 0.0421401100938048, exact: true, aliases: ["foot poundal"] },
      { id: "hartree", symbol: "Eₕ", name: "Hartree energy", factor: 4.3597447222071e-18, aliases: ["hartree", "atomic unit of energy"] }
    ]
  };
});
