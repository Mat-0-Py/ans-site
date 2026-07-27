/*
  Fuel economy units for the Ans converters.

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
    id: "fuel",
    name: "Fuel economy",
    base: "L/100km",
    reciprocal: true,
    note: "Fuel economy is reciprocal: more miles per gallon is less fuel per 100 km. A US gallon is smaller than an imperial gallon, so US mpg and UK mpg are different numbers for the same car.",
    units: [
      { id: "l100", symbol: "L/100 km", name: "Litres per 100 km", factor: 1, exact: true, aliases: ["l/100km", "litres per 100 km", "fuel consumption"] },
      { id: "kml", symbol: "km/L", name: "Kilometres per litre", factor: 100, inverse: true, exact: true, aliases: ["km per litre", "kmpl"] },
      { id: "mpg_uk", symbol: "mpg (UK)", name: "Miles per imperial gallon", factor: 100 * 4.54609 / 1.609344, inverse: true, exact: true, aliases: ["mpg", "miles per gallon", "uk mpg"] },
      { id: "mpg_us", symbol: "mpg (US)", name: "Miles per US gallon", factor: 100 * 3.785411784 / 1.609344, inverse: true, exact: true, aliases: ["mpg", "miles per gallon", "us mpg"] },
      { id: "mil", symbol: "mi/L", name: "Miles per litre", factor: 100 / 1.609344, inverse: true, exact: true, aliases: ["miles per litre", "miles per liter"] },
      { id: "lkm", symbol: "L/km", name: "Litres per kilometre", factor: 100, exact: true, aliases: ["litres per kilometre", "liters per kilometer"] },
      { id: "kmpg_us", symbol: "km/gal (US)", name: "Kilometres per US gallon", factor: 100 * 3.785411784, inverse: true, exact: true, aliases: ["kilometres per us gallon", "kilometers per us gallon"] }
    ]
  };
});
