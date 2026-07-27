/*
  Data transfer rate units for the Ans converters.

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
    id: "datarate",
    name: "Data transfer rate",
    base: "bit/s",
    note: "Broadband speeds are sold in bits per second; file sizes are measured in bytes. One byte is eight bits, so confusing MB/s with Mbit/s creates an eightfold error.",
    units: [
      { id: "bps", symbol: "bit/s", name: "Bit per second", factor: 1, exact: true, aliases: ["bits per second", "bps"] },
      { id: "kbps", symbol: "kbit/s", name: "Kilobit per second", factor: 1e3, exact: true, aliases: ["kilobits per second", "kbps"] },
      { id: "mbps", symbol: "Mbit/s", name: "Megabit per second", factor: 1e6, exact: true, aliases: ["megabits per second", "mbps"] },
      { id: "gbps", symbol: "Gbit/s", name: "Gigabit per second", factor: 1e9, exact: true, aliases: ["gigabits per second", "gbps"] },
      { id: "kBs", symbol: "kB/s", name: "Kilobyte per second", factor: 8e3, exact: true, aliases: ["kilobytes per second"] },
      { id: "MBs", symbol: "MB/s", name: "Megabyte per second", factor: 8e6, exact: true, aliases: ["megabytes per second"] },
      { id: "MiBs", symbol: "MiB/s", name: "Mebibyte per second", factor: 8388608, exact: true, aliases: ["mebibytes per second"] }
    ]
  };
});
