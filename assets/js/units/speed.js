/*
  Speed units for the Ans converters.

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
    id: "speed",
    name: "Speed",
    base: "m/s",
    units: [
      { id: "mps", symbol: "m/s", name: "Metre per second", factor: 1, exact: true, aliases: ["metres per second", "meters per second"] },
      { id: "kmh", symbol: "km/h", name: "Kilometre per hour", factor: 1 / 3.6, exact: true, aliases: ["kph", "kilometres per hour", "kmph"] },
      { id: "mph", symbol: "mph", name: "Mile per hour", factor: 0.44704, exact: true, aliases: ["miles per hour", "mph"] },
      { id: "fps", symbol: "ft/s", name: "Foot per second", factor: 0.3048, exact: true, aliases: ["feet per second", "fps"] },
      { id: "kn", symbol: "kn", name: "Knot", factor: 1852 / 3600, exact: true, aliases: ["knot", "knots", "nautical miles per hour"] },
      { id: "c", symbol: "c", name: "Speed of light", factor: 299792458, exact: true, aliases: ["light speed", "speed of light"] },
      { id: "cmps", symbol: "cm/s", name: "Centimetre per second", factor: 0.01, exact: true, aliases: ["centimetres per second", "centimeters per second"] },
      { id: "kmps", symbol: "km/s", name: "Kilometre per second", factor: 1000, exact: true, aliases: ["kilometres per second", "kilometers per second"] },
      { id: "mips", symbol: "mi/s", name: "Mile per second", factor: 1609.344, exact: true, aliases: ["miles per second"] },
      { id: "ftmin", symbol: "ft/min", name: "Foot per minute", factor: 0.00508, exact: true, aliases: ["feet per minute"] },
      { id: "mmin", symbol: "m/min", name: "Metre per minute", factor: 1 / 60, exact: true, aliases: ["metres per minute", "meters per minute"] },
      { id: "mach", symbol: "Mach (ISA)", name: "Mach (sea-level ISA)", factor: 340.29, aliases: ["mach", "speed of sound"] }
    ]
  };
});
