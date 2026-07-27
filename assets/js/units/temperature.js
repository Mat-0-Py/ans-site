/*
  Temperature units for the Ans converters.

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
    id: "temperature",
    name: "Temperature",
    base: "K",
    affine: true,
    note: "Temperature scales have different zero points, so conversion is a scale AND a shift. A temperature and a temperature difference do not convert the same way.",
    units: [
      { id: "C", symbol: "°C", name: "Celsius", factor: 1, offset: 273.15, exact: true, aliases: ["celsius", "centigrade", "c"] },
      { id: "F", symbol: "°F", name: "Fahrenheit", factor: 5 / 9, offset: 273.15 - 32 * 5 / 9, exact: true, aliases: ["fahrenheit", "f"] },
      { id: "K", symbol: "K", name: "Kelvin", factor: 1, offset: 0, exact: true, aliases: ["kelvin", "absolute"] },
      { id: "R", symbol: "°R", name: "Rankine", factor: 5 / 9, offset: 0, exact: true, aliases: ["rankine"] },
      { id: "Re", symbol: "°Ré", name: "Réaumur", factor: 1.25, offset: 273.15, exact: true, aliases: ["reaumur"] }
    ]
  };
});
