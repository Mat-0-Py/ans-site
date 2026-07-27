/*
  Mass flow units for the Ans converters.

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
    id: "massflow",
    name: "Mass flow",
    base: "kg/s",
    units: [
      { id: "kgs", symbol: "kg/s", name: "Kilogram per second", factor: 1, exact: true, aliases: ["kilograms per second"] },
      { id: "gs", symbol: "g/s", name: "Gram per second", factor: 1e-3, exact: true, aliases: ["grams per second"] },
      { id: "kgh", symbol: "kg/h", name: "Kilogram per hour", factor: 1 / 3600, exact: true, aliases: ["kilograms per hour"] },
      { id: "th", symbol: "t/h", name: "Tonne per hour", factor: 1000 / 3600, exact: true, aliases: ["tonnes per hour"] },
      { id: "lbh", symbol: "lb/h", name: "Pound per hour", factor: 0.45359237 / 3600, exact: true, aliases: ["pounds per hour"] }
    ]
  };
});
