/*
  Specific energy units for the Ans converters.

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
    id: "specificenergy",
    name: "Specific energy",
    base: "J/kg",
    units: [
      { id: "jkg", symbol: "J/kg", name: "Joule per kilogram", factor: 1, exact: true, aliases: ["joules per kilogram"] },
      { id: "kjkg", symbol: "kJ/kg", name: "Kilojoule per kilogram", factor: 1e3, exact: true, aliases: ["kilojoules per kilogram"] },
      { id: "calg", symbol: "cal/g", name: "Calorie per gram", factor: 4184, exact: true, aliases: ["calories per gram"] },
      { id: "kcalkg", symbol: "kcal/kg", name: "Kilocalorie per kilogram", factor: 4184, exact: true, aliases: ["kilocalories per kilogram"] },
      { id: "btulb", symbol: "BTU/lb", name: "BTU per pound", factor: 2326, exact: true, aliases: ["btu per pound"] },
      { id: "whkg", symbol: "Wh/kg", name: "Watt-hour per kilogram", factor: 3600, exact: true, aliases: ["watt hours per kilogram"] }
    ]
  };
});
