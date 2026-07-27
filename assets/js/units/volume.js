/*
  Volume & capacity units for the Ans converters.

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
    id: "volume",
    name: "Volume & capacity",
    base: "m³",
    note: "US and imperial units of the same name are different sizes. A US pint is 473 mL; an imperial pint is 568 mL. Every unit below says which system it belongs to.",
    units: [
      { id: "ml", symbol: "mL", name: "Millilitre", factor: 1e-6, exact: true, aliases: ["millilitre", "milliliter", "cc", "cm3"] },
      { id: "cl", symbol: "cL", name: "Centilitre", factor: 1e-5, exact: true, aliases: ["centilitre", "centiliter"] },
      { id: "l", symbol: "L", name: "Litre", factor: 1e-3, exact: true, aliases: ["litre", "liter", "litres", "liters"] },
      { id: "m3", symbol: "m³", name: "Cubic metre", factor: 1, exact: true, aliases: ["cubic metre", "cubic meter", "m3"] },
      { id: "in3", symbol: "in³", name: "Cubic inch", factor: 1.6387064e-5, exact: true, aliases: ["cubic inch", "ci", "cu in"] },
      { id: "ft3", symbol: "ft³", name: "Cubic foot", factor: 0.028316846592, exact: true, aliases: ["cubic foot", "cubic feet", "cu ft"] },
      { id: "tsp_us", symbol: "tsp (US)", name: "Teaspoon (US)", factor: 4.92892159375e-6, exact: true, aliases: ["teaspoon"] },
      { id: "tsp_m", symbol: "tsp (metric)", name: "Teaspoon (metric, 5 mL)", factor: 5e-6, exact: true, aliases: ["teaspoon", "uk teaspoon"] },
      { id: "tbsp_us", symbol: "tbsp (US)", name: "Tablespoon (US)", factor: 1.478676478125e-5, exact: true, aliases: ["tablespoon"] },
      { id: "tbsp_m", symbol: "tbsp (metric)", name: "Tablespoon (metric, 15 mL)", factor: 1.5e-5, exact: true, aliases: ["tablespoon", "uk tablespoon"] },
      { id: "floz_us", symbol: "fl oz (US)", name: "Fluid ounce (US)", factor: 2.95735295625e-5, exact: true, aliases: ["fluid ounce", "fl oz", "oz"] },
      { id: "floz_uk", symbol: "fl oz (imp)", name: "Fluid ounce (imperial)", factor: 2.84130625e-5, exact: true, aliases: ["fluid ounce", "uk fl oz"] },
      { id: "cup_us", symbol: "cup (US)", name: "Cup (US)", factor: 2.365882365e-4, exact: true, aliases: ["cup", "cups"] },
      { id: "cup_m", symbol: "cup (metric)", name: "Cup (metric, 250 mL)", factor: 2.5e-4, exact: true, aliases: ["cup", "cups"] },
      { id: "pt_us", symbol: "pt (US)", name: "Pint (US liquid)", factor: 4.73176473e-4, exact: true, aliases: ["pint", "us pint"] },
      { id: "pt_uk", symbol: "pt (imp)", name: "Pint (imperial)", factor: 5.6826125e-4, exact: true, aliases: ["pint", "uk pint", "pint of beer"] },
      { id: "qt_us", symbol: "qt (US)", name: "Quart (US liquid)", factor: 9.46352946e-4, exact: true, aliases: ["quart"] },
      { id: "qt_uk", symbol: "qt (imp)", name: "Quart (imperial)", factor: 1.1365225e-3, exact: true, aliases: ["quart"] },
      { id: "gal_us", symbol: "gal (US)", name: "Gallon (US liquid)", factor: 3.785411784e-3, exact: true, aliases: ["gallon", "us gallon"] },
      { id: "gal_uk", symbol: "gal (imp)", name: "Gallon (imperial)", factor: 4.54609e-3, exact: true, aliases: ["gallon", "uk gallon"] },
      { id: "bbl", symbol: "bbl", name: "Barrel (oil, 42 US gal)", factor: 0.158987294928, exact: true, aliases: ["barrel", "oil barrel"] },
      { id: "dm3", symbol: "dm³", name: "Cubic decimetre", factor: 1e-3, exact: true, aliases: ["cubic decimetre", "cubic decimeter", "dm3"] },
      { id: "hl", symbol: "hL", name: "Hectolitre", factor: 0.1, exact: true, aliases: ["hectolitre", "hectoliter"] },
      { id: "yd3", symbol: "yd³", name: "Cubic yard", factor: 0.764554857984, exact: true, aliases: ["cubic yard", "cu yd"] },
      { id: "fldr_us", symbol: "fl dr (US)", name: "Fluid dram (US)", factor: 3.6966911953125e-6, exact: true, aliases: ["fluid dram", "us fluid dram"] },
      { id: "gill_us", symbol: "gi (US)", name: "Gill (US)", factor: 1.1829411825e-4, exact: true, aliases: ["us gill", "gill"] },
      { id: "gill_uk", symbol: "gi (imp)", name: "Gill (imperial)", factor: 1.420653125e-4, exact: true, aliases: ["imperial gill", "uk gill"] },
      { id: "dry_pt_us", symbol: "dry pt (US)", name: "Dry pint (US)", factor: 5.506104713575e-4, exact: true, aliases: ["us dry pint", "dry pint"] },
      { id: "bu_us", symbol: "bu (US dry)", name: "Bushel (US dry)", factor: 0.03523907016688, exact: true, aliases: ["us bushel", "dry bushel"] },
      { id: "bu_uk", symbol: "bu (imp)", name: "Bushel (imperial)", factor: 0.03636872, exact: true, aliases: ["imperial bushel", "uk bushel"] },
      { id: "tbsp_au", symbol: "tbsp (AU)", name: "Tablespoon (Australian)", factor: 2e-5, exact: true, aliases: ["australian tablespoon"] },
      { id: "shot_us", symbol: "shot (US)", name: "Shot (US, 1.5 fl oz)", factor: 4.436029434375e-5, exact: true, aliases: ["shot", "us shot"] },
      { id: "cord", symbol: "cord", name: "Cord", factor: 3.624556363776, exact: true, aliases: ["cord", "firewood cord"] },
      { id: "acre_ft", symbol: "ac·ft", name: "Acre-foot", factor: 1233.48183754752, exact: true, aliases: ["acre foot", "acre-foot"] }
    ]
  };
});
