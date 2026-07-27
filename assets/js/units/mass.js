/*
  Mass & weight units for the Ans converters.

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
    id: "mass",
    name: "Mass & weight",
    base: "kg",
    note: "Everything here is mass, not force. The pound is defined as exactly 0.453 592 37 kg, so pound-to-kilogram conversion is exact.",
    units: [
      { id: "ug", symbol: "µg", name: "Microgram", factor: 1e-9, exact: true, aliases: ["microgram", "mcg"] },
      { id: "mg", symbol: "mg", name: "Milligram", factor: 1e-6, exact: true, aliases: ["milligram"] },
      { id: "g", symbol: "g", name: "Gram", factor: 1e-3, exact: true, aliases: ["gram", "grams", "gramme"] },
      { id: "kg", symbol: "kg", name: "Kilogram", factor: 1, exact: true, aliases: ["kilogram", "kilo", "kilos", "kgs"] },
      { id: "t", symbol: "t", name: "Tonne (metric ton)", factor: 1e3, exact: true, aliases: ["metric ton", "tonne", "megagram"] },
      { id: "gr", symbol: "gr", name: "Grain", factor: 6.479891e-5, exact: true, aliases: ["grains"] },
      { id: "oz", symbol: "oz", name: "Ounce", factor: 0.028349523125, exact: true, aliases: ["ounce", "ounces", "avoirdupois ounce"] },
      { id: "lb", symbol: "lb", name: "Pound", factor: 0.45359237, exact: true, aliases: ["pound", "pounds", "lbs", "#"] },
      { id: "st", symbol: "st", name: "Stone", factor: 6.35029318, exact: true, aliases: ["stone", "stones"] },
      { id: "cwt_uk", symbol: "cwt (long)", name: "Hundredweight (long, UK)", factor: 50.80234544, exact: true, aliases: ["hundredweight"] },
      { id: "cwt_us", symbol: "cwt (short)", name: "Hundredweight (short, US)", factor: 45.359237, exact: true, aliases: ["short hundredweight"] },
      { id: "ton_uk", symbol: "long ton", name: "Ton (long, UK)", factor: 1016.0469088, exact: true, aliases: ["imperial ton", "long ton"] },
      { id: "ton_us", symbol: "short ton", name: "Ton (short, US)", factor: 907.18474, exact: true, aliases: ["us ton", "short ton"] },
      { id: "ozt", symbol: "oz t", name: "Troy ounce", factor: 0.0311034768, exact: true, aliases: ["troy ounce", "gold ounce"] },
      { id: "ct", symbol: "ct", name: "Carat (metric)", factor: 2e-4, exact: true, aliases: ["carat", "diamond carat"] },
      { id: "u", symbol: "u", name: "Atomic mass unit", factor: 1.66053906660e-27, aliases: ["dalton", "amu"] },
      { id: "dram", symbol: "dr", name: "Dram", factor: 0.0017718451953125, exact: true, aliases: ["dram", "drachm"] },
      { id: "quarter_uk", symbol: "qr (UK)", name: "Quarter (UK)", factor: 12.70058636, exact: true, aliases: ["quarter", "uk quarter"] },
      { id: "troy_lb", symbol: "lb t", name: "Troy pound", factor: 0.3732417216, exact: true, aliases: ["troy pound"] },
      { id: "dwt", symbol: "dwt", name: "Pennyweight", factor: 0.00155517384, exact: true, aliases: ["pennyweight"] },
      { id: "kip_mass", symbol: "kip", name: "Kip (mass)", factor: 453.59237, exact: true, aliases: ["kip mass"] },
      { id: "quintal", symbol: "q", name: "Quintal", factor: 100, exact: true, aliases: ["quintal"] },
      { id: "slug", symbol: "slug", name: "Slug", factor: 14.5939029372, aliases: ["slug", "slugs"] },
      { id: "st_lb", symbol: "st + lb", name: "Stone and pounds", factor: 6.35029318, exact: true,
        compound: ["st", "lb"], aliases: ["stone and pounds", "body weight"] },
      { id: "lb_oz", symbol: "lb + oz", name: "Pounds and ounces", factor: 0.45359237, exact: true,
        compound: ["lb", "oz"], aliases: ["pounds and ounces", "birth weight"] }
    ]
  };
});
