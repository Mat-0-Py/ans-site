/*
  Density units for the Ans converters.

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
    id: "density",
    name: "Density",
    base: "kg/m³",
    note: "Density is mass per volume. Converting a density does not convert a material's mass or volume, and cooking mass-to-volume questions need the material's density.",
    units: [
      { id: "kgm3", symbol: "kg/m³", name: "Kilogram per cubic metre", factor: 1, exact: true, aliases: ["kilograms per cubic metre", "kg/m3"] },
      { id: "gcm3", symbol: "g/cm³", name: "Gram per cubic centimetre", factor: 1000, exact: true, aliases: ["grams per cubic centimetre", "g/cc"] },
      { id: "gml", symbol: "g/mL", name: "Gram per millilitre", factor: 1000, exact: true, aliases: ["grams per millilitre"] },
      { id: "kgl", symbol: "kg/L", name: "Kilogram per litre", factor: 1000, exact: true, aliases: ["kilograms per litre"] },
      { id: "gl", symbol: "g/L", name: "Gram per litre", factor: 1, exact: true, aliases: ["grams per litre"] },
      { id: "tm3", symbol: "t/m³", name: "Tonne per cubic metre", factor: 1000, exact: true, aliases: ["tonnes per cubic metre"] },
      { id: "lbft3", symbol: "lb/ft³", name: "Pound per cubic foot", factor: 0.45359237 / 0.028316846592, exact: true, aliases: ["pounds per cubic foot", "pcf"] },
      { id: "lbin3", symbol: "lb/in³", name: "Pound per cubic inch", factor: 0.45359237 / 1.6387064e-5, exact: true, aliases: ["pounds per cubic inch"] },
      { id: "ozgal_us", symbol: "oz/gal (US)", name: "Ounce per US gallon", factor: 0.028349523125 / 0.003785411784, exact: true, aliases: ["ounces per us gallon"] },
      { id: "slugft3", symbol: "slug/ft³", name: "Slug per cubic foot", factor: 515.378818393, aliases: ["slugs per cubic foot"] }
    ]
  };
});
