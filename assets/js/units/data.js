/*
  Digital storage units for the Ans converters.

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
    id: "data",
    name: "Digital storage",
    base: "B",
    note: "Decimal prefixes (kB, MB, GB) are powers of 1000; binary prefixes (KiB, MiB, GiB) are powers of 1024. Drive makers use decimal; operating systems often report binary, which is why a 1 TB drive shows as 931 GiB.",
    units: [
      { id: "bit", symbol: "bit", name: "Bit", factor: 0.125, exact: true, aliases: ["bit", "bits"] },
      { id: "byte", symbol: "B", name: "Byte", factor: 1, exact: true, aliases: ["byte", "bytes"] },
      { id: "kb", symbol: "kB", name: "Kilobyte (1000 B)", factor: 1e3, exact: true, aliases: ["kilobyte"] },
      { id: "mb", symbol: "MB", name: "Megabyte (1000 kB)", factor: 1e6, exact: true, aliases: ["megabyte", "meg"] },
      { id: "gb", symbol: "GB", name: "Gigabyte (1000 MB)", factor: 1e9, exact: true, aliases: ["gigabyte", "gig"] },
      { id: "tb", symbol: "TB", name: "Terabyte (1000 GB)", factor: 1e12, exact: true, aliases: ["terabyte"] },
      { id: "kib", symbol: "KiB", name: "Kibibyte (1024 B)", factor: 1024, exact: true, aliases: ["kibibyte"] },
      { id: "mib", symbol: "MiB", name: "Mebibyte (1024 KiB)", factor: 1048576, exact: true, aliases: ["mebibyte"] },
      { id: "gib", symbol: "GiB", name: "Gibibyte (1024 MiB)", factor: 1073741824, exact: true, aliases: ["gibibyte"] },
      { id: "tib", symbol: "TiB", name: "Tebibyte (1024 GiB)", factor: 1099511627776, exact: true, aliases: ["tebibyte"] },
      { id: "mbit", symbol: "Mbit", name: "Megabit", factor: 125000, exact: true, aliases: ["megabit", "broadband speed"] },
      { id: "kbit", symbol: "kbit", name: "Kilobit", factor: 125, exact: true, aliases: ["kilobit"] },
      { id: "gbit", symbol: "Gbit", name: "Gigabit", factor: 1.25e8, exact: true, aliases: ["gigabit"] },
      { id: "tbit", symbol: "Tbit", name: "Terabit", factor: 1.25e11, exact: true, aliases: ["terabit"] },
      { id: "pb", symbol: "PB", name: "Petabyte", factor: 1e15, exact: true, aliases: ["petabyte"] },
      { id: "eb", symbol: "EB", name: "Exabyte", factor: 1e18, exact: true, aliases: ["exabyte"] },
      { id: "pib", symbol: "PiB", name: "Pebibyte", factor: 1125899906842624, exact: true, aliases: ["pebibyte"] },
      { id: "eib", symbol: "EiB", name: "Exbibyte", factor: 1152921504606846976, exact: true, aliases: ["exbibyte"] },
      { id: "nibble", symbol: "nibble", name: "Nibble (4 bits)", factor: 0.5, exact: true, aliases: ["nibble", "half byte"] }
    ]
  };
});
