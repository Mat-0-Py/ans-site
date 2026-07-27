/*
  Thermal conductivity units for the Ans converters.

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
    id: "thermalconductivity",
    name: "Thermal conductivity",
    base: "W/(m·K)",
    units: [
      { id: "wmk", symbol: "W/(m·K)", name: "Watt per metre kelvin", factor: 1, exact: true, aliases: ["watts per metre kelvin"] },
      { id: "btuhftf", symbol: "BTU/(h·ft·°F)", name: "BTU per hour foot degree Fahrenheit", factor: (1055.05585262 / 3600) / (0.3048 * 5 / 9), exact: true, aliases: ["btu per hour foot fahrenheit"] }
    ]
  };
});
