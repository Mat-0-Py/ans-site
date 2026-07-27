/*
  EV efficiency units for the Ans converters.

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
    id: "evefficiency",
    name: "EV efficiency",
    base: "Wh/km",
    reciprocal: true,
    note: "Consumption in Wh/km rises as efficiency falls; mi/kWh moves in the opposite direction. This reciprocal relationship is the electric-vehicle equivalent of fuel economy.",
    units: [
      { id: "whkm", symbol: "Wh/km", name: "Watt-hour per kilometre", factor: 1, exact: true, aliases: ["watt hours per kilometre"] },
      { id: "whmi", symbol: "Wh/mi", name: "Watt-hour per mile", factor: 1 / 1.609344, exact: true, aliases: ["watt hours per mile"] },
      { id: "kwh100", symbol: "kWh/100 km", name: "Kilowatt-hour per 100 kilometres", factor: 10, exact: true, aliases: ["kilowatt hours per 100 km"] },
      { id: "mikwh", symbol: "mi/kWh", name: "Miles per kilowatt-hour", factor: 1000 / 1.609344, inverse: true, exact: true, aliases: ["miles per kwh"] }
    ]
  };
});
