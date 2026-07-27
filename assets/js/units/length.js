/*
  Length & distance units for the Ans converters.

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
    id: "length",
    name: "Length & distance",
    base: "m",
    note: "The metre is SI; every imperial and US customary length here is defined exactly in terms of it by the 1959 international yard and pound agreement.",
    units: [
      { id: "nm", symbol: "nm", name: "Nanometre", factor: 1e-9, exact: true, aliases: ["nanometer", "nanometre"] },
      { id: "um", symbol: "µm", name: "Micrometre", factor: 1e-6, exact: true, aliases: ["micron", "micrometer", "um"] },
      { id: "mm", symbol: "mm", name: "Millimetre", factor: 1e-3, exact: true, aliases: ["millimeter", "millimetre"] },
      { id: "cm", symbol: "cm", name: "Centimetre", factor: 1e-2, exact: true, aliases: ["centimeter", "centimetre", "cms"] },
      { id: "m", symbol: "m", name: "Metre", factor: 1, exact: true, aliases: ["meter", "metre", "metres", "meters"] },
      { id: "km", symbol: "km", name: "Kilometre", factor: 1e3, exact: true, aliases: ["kilometer", "kilometre", "kms", "klicks"] },
      { id: "in", symbol: "in", name: "Inch", factor: 0.0254, exact: true, aliases: ["inch", "inches", "\""] },
      { id: "ft", symbol: "ft", name: "Foot", factor: 0.3048, exact: true, aliases: ["foot", "feet", "'"] },
      { id: "yd", symbol: "yd", name: "Yard", factor: 0.9144, exact: true, aliases: ["yard", "yards"] },
      { id: "mi", symbol: "mi", name: "Mile", factor: 1609.344, exact: true, aliases: ["mile", "miles", "statute mile"] },
      { id: "nmi", symbol: "nmi", name: "Nautical mile", factor: 1852, exact: true, aliases: ["nautical mile", "sea mile"] },
      { id: "thou", symbol: "thou", name: "Thou (mil)", factor: 2.54e-5, exact: true, aliases: ["mil", "thousandth"] },
      { id: "hand", symbol: "hh", name: "Hand", factor: 0.1016, exact: true, aliases: ["hands", "horse height"] },
      { id: "fathom", symbol: "ftm", name: "Fathom", factor: 1.8288, exact: true, aliases: ["fathoms"] },
      { id: "chain", symbol: "ch", name: "Chain", factor: 20.1168, exact: true, aliases: ["cricket pitch"] },
      { id: "furlong", symbol: "fur", name: "Furlong", factor: 201.168, exact: true, aliases: ["furlongs"] },
      { id: "ang", symbol: "Å", name: "Ångström", factor: 1e-10, exact: true, aliases: ["angstrom"] },
      { id: "au", symbol: "au", name: "Astronomical unit", factor: 149597870700, exact: true, aliases: ["astronomical unit"] },
      { id: "ly", symbol: "ly", name: "Light-year", factor: 9460730472580800, exact: true, aliases: ["light year", "lightyear"] },
      { id: "pc", symbol: "pc", name: "Parsec", factor: 3.0856775814913673e16, aliases: ["parsec"] },
      { id: "dm", symbol: "dm", name: "Decimetre", factor: 0.1, exact: true, aliases: ["decimeter", "decimetre"] },
      { id: "dam", symbol: "dam", name: "Decametre", factor: 10, exact: true, aliases: ["decameter", "decametre"] },
      { id: "hm", symbol: "hm", name: "Hectometre", factor: 100, exact: true, aliases: ["hectometer", "hectometre"] },
      { id: "Mm", symbol: "Mm", name: "Megametre", factor: 1e6, exact: true, aliases: ["megameter", "megametre"] },
      { id: "pica", symbol: "pc (pica)", name: "Pica", factor: 0.0254 / 6, exact: true, aliases: ["pica", "picas"] },
      { id: "point", symbol: "pt (type)", name: "Point (typographic)", factor: 0.0254 / 72, exact: true, aliases: ["point", "typographic point"] },
      { id: "rod", symbol: "rd", name: "Rod (pole or perch)", factor: 5.0292, exact: true, aliases: ["rod", "pole", "perch"] },
      { id: "league", symbol: "league", name: "League (land)", factor: 4828.032, exact: true, aliases: ["league", "land league"] },
      { id: "cable", symbol: "cable", name: "Cable length", factor: 185.2, exact: true, aliases: ["cable", "cable length"] },
      { id: "span", symbol: "span", name: "Span", factor: 0.2286, exact: true, aliases: ["span", "hand span"] },
      { id: "cubit", symbol: "cubit", name: "Cubit", factor: 0.4572, exact: true, aliases: ["cubit"] },
      { id: "barleycorn", symbol: "barleycorn", name: "Barleycorn", factor: 0.0254 / 3, exact: true, aliases: ["barleycorn"] },
      { id: "ft_in", symbol: "ft + in", name: "Feet and inches", factor: 0.3048, exact: true,
        compound: ["ft", "in"], aliases: ["feet and inches", "foot and inches", "height"] }
    ]
  };
});
