/*
  AnsConvert for Node — the core engine with every quantity loaded.

  The browser never loads this file. A converter page loads
  `convert-core.js` plus the one quantity it needs (see the load order in
  convert-core.js); shipping all 34 quantities to every visitor spent 43 KB
  of a 100 KB page budget on data the page could not use.

  Everything that wants the whole registry at once — the tests, the page
  generator, the table generator — requires this instead:

      var C = require("../assets/js/convert.js");

  The list below is the load order, and the order quantities appear in on
  the hub. Adding a quantity means adding its file here and to the hub
  grouping in tools/generate-convert-pages.js.
*/
"use strict";

var AnsConvert = require("./convert-core.js");

[
  "./units/length.js",
  "./units/mass.js",
  "./units/temperature.js",
  "./units/volume.js",
  "./units/area.js",
  "./units/speed.js",
  "./units/time.js",
  "./units/pressure.js",
  "./units/energy.js",
  "./units/power.js",
  "./units/data.js",
  "./units/angle.js",
  "./units/force.js",
  "./units/fuel.js",
  "./units/density.js",
  "./units/torque.js",
  "./units/flow.js",
  "./units/massflow.js",
  "./units/frequency.js",
  "./units/angularvelocity.js",
  "./units/acceleration.js",
  "./units/datarate.js",
  "./units/charge.js",
  "./units/illuminance.js",
  "./units/radioactivity.js",
  "./units/dose.js",
  "./units/magneticfield.js",
  "./units/viscosity.js",
  "./units/kinematicviscosity.js",
  "./units/amount.js",
  "./units/concentration.js",
  "./units/specificenergy.js",
  "./units/thermalconductivity.js",
  "./units/evefficiency.js"
].forEach(function (path) {
  AnsConvert.register(require(path));
});

module.exports = AnsConvert;
