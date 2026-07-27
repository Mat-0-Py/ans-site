/*
  Time units for the Ans converters.

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
    id: "time",
    name: "Time",
    base: "s",
    note: "Months and years are not fixed durations. The year here is the exact Julian year (365.25 days); the month is a mean Gregorian month, and a calendar month still varies from 28 to 31 days.",
    units: [
      { id: "ns", symbol: "ns", name: "Nanosecond", factor: 1e-9, exact: true, aliases: ["nanosecond"] },
      { id: "us", symbol: "µs", name: "Microsecond", factor: 1e-6, exact: true, aliases: ["microsecond"] },
      { id: "ms", symbol: "ms", name: "Millisecond", factor: 1e-3, exact: true, aliases: ["millisecond"] },
      { id: "s", symbol: "s", name: "Second", factor: 1, exact: true, aliases: ["second", "seconds", "sec"] },
      { id: "min", symbol: "min", name: "Minute", factor: 60, exact: true, aliases: ["minute", "minutes"] },
      { id: "h", symbol: "h", name: "Hour", factor: 3600, exact: true, aliases: ["hour", "hours", "hrs"] },
      { id: "d", symbol: "d", name: "Day", factor: 86400, exact: true, aliases: ["day", "days"] },
      { id: "wk", symbol: "wk", name: "Week", factor: 604800, exact: true, aliases: ["week", "weeks"] },
      { id: "yr", symbol: "yr", name: "Year (Julian, 365.25 d)", factor: 31557600, exact: true, aliases: ["year", "years", "annum"] },
      { id: "fortnight", symbol: "fortnight", name: "Fortnight", factor: 1209600, exact: true, aliases: ["fortnight", "two weeks"] },
      { id: "decade", symbol: "decade", name: "Decade (Julian)", factor: 315576000, exact: true, aliases: ["decade", "ten years"] },
      { id: "century", symbol: "century", name: "Century (Julian)", factor: 3155760000, exact: true, aliases: ["century", "hundred years"] },
      { id: "sidereal_d", symbol: "sidereal d", name: "Sidereal day", factor: 86164.0905, aliases: ["sidereal day"] },
      { id: "month_mean", symbol: "month (mean)", name: "Month (mean Gregorian)", factor: 2629746, aliases: ["month", "mean month"] },
      { id: "h_min", symbol: "h + min", name: "Hours and minutes", factor: 3600, exact: true,
        compound: ["h", "min"], aliases: ["hours and minutes"] },
      { id: "min_s", symbol: "min + s", name: "Minutes and seconds", factor: 60, exact: true,
        compound: ["min", "s"], aliases: ["minutes and seconds", "pace"] }
    ]
  };
});
