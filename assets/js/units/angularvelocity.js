/*
  Angular velocity units for the Ans converters.

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
    id: "angularvelocity",
    name: "Angular velocity",
    base: "rad/s",
    note: "Angular velocity measures angle swept per second. Revolutions per minute become rad/s using 2π radians per revolution; ordinary frequency in hertz is kept separate.",
    units: [
      { id: "rads", symbol: "rad/s", name: "Radian per second", factor: 1, exact: true, aliases: ["radians per second"] },
      { id: "degs", symbol: "°/s", name: "Degree per second", factor: Math.PI / 180, exact: true, aliases: ["degrees per second"] },
      { id: "rpm", symbol: "rpm", name: "Revolution per minute", factor: 2 * Math.PI / 60, exact: true, aliases: ["revolutions per minute"] },
      { id: "rps", symbol: "rps", name: "Revolution per second", factor: 2 * Math.PI, exact: true, aliases: ["revolutions per second"] }
    ]
  };
});
