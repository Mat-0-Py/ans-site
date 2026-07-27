/*
  Volumetric flow units for the Ans converters.

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
    id: "flow",
    name: "Volumetric flow",
    base: "m³/s",
    note: "Volumetric flow is volume per time. US and imperial gallons are different, so gallon-per-minute units always name their system.",
    units: [
      { id: "m3s", symbol: "m³/s", name: "Cubic metre per second", factor: 1, exact: true, aliases: ["cubic metres per second", "m3/s"] },
      { id: "ls", symbol: "L/s", name: "Litre per second", factor: 1e-3, exact: true, aliases: ["litres per second", "lps"] },
      { id: "lmin", symbol: "L/min", name: "Litre per minute", factor: 1 / 60000, exact: true, aliases: ["litres per minute", "lpm"] },
      { id: "m3h", symbol: "m³/h", name: "Cubic metre per hour", factor: 1 / 3600, exact: true, aliases: ["cubic metres per hour"] },
      { id: "gpm_us", symbol: "gal (US)/min", name: "US gallon per minute", factor: 6.30901964e-5, exact: true, aliases: ["us gallons per minute", "us gpm"] },
      { id: "gpm_uk", symbol: "gal (imp)/min", name: "Imperial gallon per minute", factor: 4.54609e-3 / 60, exact: true, aliases: ["imperial gallons per minute", "uk gpm"] },
      { id: "cfm", symbol: "cfm", name: "Cubic foot per minute", factor: 4.719474432e-4, exact: true, aliases: ["cubic feet per minute", "cfm"] },
      { id: "cfs", symbol: "cfs", name: "Cubic foot per second", factor: 0.028316846592, exact: true, aliases: ["cubic feet per second", "cfs"] }
    ]
  };
});
