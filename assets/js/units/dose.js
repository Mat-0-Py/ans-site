/*
  Radiation dose units for the Ans converters.

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
    id: "dose",
    name: "Radiation dose",
    base: "Sv",
    note: "The sievert measures equivalent or effective dose. The gray measures absorbed dose; they are different physical quantities and are not mixed here.",
    units: [
      { id: "sv", symbol: "Sv", name: "Sievert", factor: 1, exact: true, aliases: ["sievert"] },
      { id: "msv", symbol: "mSv", name: "Millisievert", factor: 1e-3, exact: true, aliases: ["millisievert"] },
      { id: "usv", symbol: "µSv", name: "Microsievert", factor: 1e-6, exact: true, aliases: ["microsievert"] },
      { id: "rem", symbol: "rem", name: "Rem", factor: 0.01, exact: true, aliases: ["rem"] },
      { id: "mrem", symbol: "mrem", name: "Millirem", factor: 1e-5, exact: true, aliases: ["millirem"] }
    ]
  };
});
