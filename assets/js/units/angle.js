/*
  Angle units for the Ans converters.

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
    id: "angle",
    name: "Angle",
    base: "rad",
    units: [
      { id: "rad", symbol: "rad", name: "Radian", factor: 1, exact: true, aliases: ["radian", "radians"] },
      { id: "mrad", symbol: "mrad", name: "Milliradian", factor: 1e-3, exact: true, aliases: ["milliradian", "mil"] },
      { id: "deg", symbol: "°", name: "Degree", factor: Math.PI / 180, exact: true, aliases: ["degree", "degrees", "deg"] },
      { id: "grad", symbol: "gon", name: "Gradian", factor: Math.PI / 200, exact: true, aliases: ["gradian", "gon", "grad"] },
      { id: "arcmin", symbol: "′", name: "Arcminute", factor: Math.PI / 10800, exact: true, aliases: ["arcminute", "minute of arc"] },
      { id: "arcsec", symbol: "″", name: "Arcsecond", factor: Math.PI / 648000, exact: true, aliases: ["arcsecond", "second of arc"] },
      { id: "turn", symbol: "turn", name: "Turn (revolution)", factor: 2 * Math.PI, exact: true, aliases: ["revolution", "turn", "full circle"] },
      { id: "quadrant", symbol: "quadrant", name: "Quadrant", factor: Math.PI / 2, exact: true, aliases: ["quadrant", "right angle"] },
      { id: "point_compass", symbol: "point (compass)", name: "Compass point", factor: 2 * Math.PI / 32, exact: true, aliases: ["compass point", "point"] },
      { id: "mil_nato", symbol: "mil (NATO)", name: "Mil (NATO)", factor: 2 * Math.PI / 6400, exact: true, aliases: ["nato mil", "artillery mil"] }
    ]
  };
});
