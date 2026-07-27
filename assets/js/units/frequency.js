/*
  Frequency units for the Ans converters.

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
    id: "frequency",
    name: "Frequency",
    base: "Hz",
    note: "Frequency counts cycles per second. Angular velocity in rad/s differs by a factor of 2π and is kept in its own converter.",
    units: [
      { id: "hz", symbol: "Hz", name: "Hertz", factor: 1, exact: true, aliases: ["hertz", "cycles per second"] },
      { id: "khz", symbol: "kHz", name: "Kilohertz", factor: 1e3, exact: true, aliases: ["kilohertz"] },
      { id: "mhz", symbol: "MHz", name: "Megahertz", factor: 1e6, exact: true, aliases: ["megahertz"] },
      { id: "ghz", symbol: "GHz", name: "Gigahertz", factor: 1e9, exact: true, aliases: ["gigahertz"] },
      { id: "thz", symbol: "THz", name: "Terahertz", factor: 1e12, exact: true, aliases: ["terahertz"] },
      { id: "rpm", symbol: "rpm", name: "Revolution per minute", factor: 1 / 60, exact: true, aliases: ["revolutions per minute"] },
      { id: "bpm", symbol: "bpm", name: "Beat per minute", factor: 1 / 60, exact: true, aliases: ["beats per minute", "heart rate"] }
    ]
  };
});
