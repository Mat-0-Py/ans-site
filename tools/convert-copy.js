/*
  Build-time copy for the converter catalogue
  (Website-Private-Docs/CONVERT-DESIGN.md).

  This is prose, not data. It lives here rather than in
  `assets/js/convert.js` for two reasons:

  1. It is only ever needed when generating pages. Shipping ~10 KB of
     English to every visitor would push a converter page over the 100 KB
     family weight budget for no benefit.
  2. The registry is the single source of truth for NUMBERS. Keeping the
     sentences separate means a copy edit can never disturb a factor.

  `tools/` is excluded from the built site in _config.yml.

  UNIT_NOTES — one honest, specific sentence per unit that a page defaults
  to. This is what stops a generated page reading like a template: the
  Definitions block is assembled from two real unit facts plus the
  quantity's own note, and never from a restatement of the factor.

  Rules for writing one:
  - Say something a reader could not read off the conversion itself.
  - Name the system (US, imperial, SI) wherever the unit is ambiguous.
  - Never write "the kilogram is 1 kg". For a base unit, say what the base
    unit IS.
  - No internal vocabulary: no "registry", no "menu units", no "factor".
*/
"use strict";

var UNIT_NOTES = {
  "length.ft_in": "Feet and inches together, the way height is actually said. Twelve inches to the foot, and the inch is exactly 25.4 mm.",
  "mass.st_lb": "Stone and pounds together, the way UK body weight is quoted. Fourteen pounds to the stone.",
  "mass.lb_oz": "Pounds and ounces together, as birth weights and butcher's scales are given. Sixteen ounces to the pound.",
  "time.h_min": "Hours and minutes together, as a clock reads them rather than as a decimal.",
  "time.min_s": "Minutes and seconds together, the way a lap or a track length is recorded.",
  // ---- length ----------------------------------------------------------
  "length.mm": "The millimetre is a thousandth of a metre, and the unit most engineering drawings in the UK are dimensioned in.",
  "length.cm": "The centimetre is a hundredth of a metre. It is the everyday metric unit for body and furniture measurements outside engineering.",
  "length.m": "The metre is the SI base unit of length, defined by fixing the speed of light at 299 792 458 m/s.",
  "length.km": "The kilometre is a thousand metres, and the unit road distances are signed in almost everywhere except the UK and the US.",
  "length.in": "The inch has been exactly 25.4 mm since the 1959 international yard and pound agreement. Screen and wheel sizes are still quoted in it.",
  "length.ft": "The foot is exactly 12 inches, or 0.3048 m. Aviation still uses it for altitude worldwide.",
  "length.yd": "The yard is exactly 0.9144 m by definition — the anchor from which the inch, foot and mile all follow.",
  "length.mi": "The statute mile is exactly 1609.344 m, or 5280 feet. It is the mile on UK and US road signs.",
  "length.nmi": "The nautical mile is exactly 1852 m, defined for navigation rather than derived from the yard. One knot is one nautical mile per hour.",

  // ---- mass ------------------------------------------------------------
  "mass.g": "The gram is a thousandth of a kilogram, and the unit food packaging and recipes are labelled in.",
  "mass.kg": "The kilogram is the SI base unit of mass, defined since 2019 by fixing the Planck constant rather than by a metal cylinder in Paris.",
  "mass.lb": "The international avoirdupois pound is exactly 0.453 592 37 kg, agreed in 1959 — which is why pounds and kilograms convert exactly.",
  "mass.oz": "The avoirdupois ounce is a sixteenth of a pound, 28.349 523 125 g. It is the ounce on food packaging, not the one used for gold.",
  "mass.ozt": "The troy ounce, 31.103 476 8 g, is used only for precious metals. It is about 10% heavier than the ounce your groceries are weighed in.",
  "mass.st": "The stone is 14 pounds, exactly 6.350 293 18 kg. UK body weight is normally quoted as stone and pounds — 12 st 4 lb, not 12.29 st.",
  "mass.ton_us": "The short ton is 2000 pounds, used in the US. It is 9% lighter than the UK long ton and 9% lighter than the metric tonne.",

  // ---- temperature -----------------------------------------------------
  "temperature.C": "Celsius puts 0 at the freezing point of water and 100 at its boiling point at standard pressure. A Celsius degree is the same size as a kelvin.",
  "temperature.F": "Fahrenheit puts water's freezing point at 32 and its boiling point at 212, so a Fahrenheit degree is five ninths of a Celsius one.",
  "temperature.K": "The kelvin is the SI base unit of temperature, counted from absolute zero. It takes no degree sign: 298.15 K, never 298.15 °K.",

  // ---- volume ----------------------------------------------------------
  "volume.ml": "The millilitre is exactly one cubic centimetre. Medicine doses and recipe liquids are measured in it worldwide.",
  "volume.l": "The litre is a thousand cubic centimetres — a cube 10 cm on each side. It is accepted for use with SI but is not itself an SI unit.",
  "volume.m3": "The cubic metre is the SI unit of volume, and holds exactly 1000 litres. Water and gas meters read in it.",
  "volume.ft3": "The cubic foot is 28.3168 litres. UK gas meters installed before the 1990s still read in hundreds of cubic feet.",
  "volume.floz_us": "The US fluid ounce is 29.5735 mL — about 4% larger than the imperial fluid ounce, which is 28.4131 mL.",
  "volume.cup_us": "The US cup is 8 US fluid ounces, 236.588 mL. A metric cup is 250 mL and a pre-decimal UK cup was 284 mL, so a recipe's origin matters.",
  "volume.pt_uk": "The imperial pint is 568.261 mL — the pint a UK pub pulls. A US liquid pint is only 473.176 mL.",
  "volume.qt_us": "The US liquid quart is a quarter of a US gallon, 946.353 mL. The imperial quart is 1136.52 mL.",
  "volume.gal_uk": "The imperial gallon is exactly 4.546 09 litres, about a fifth larger than the US gallon's 3.785 41 litres.",
  "volume.tsp_m": "The metric teaspoon is exactly 5 mL, the measure UK and Australian recipes and medicine spoons use. A US teaspoon is 4.929 mL.",
  "volume.tbsp_m": "The metric tablespoon is exactly 15 mL. Australia's is 20 mL and the US one is 14.787 mL, so a tablespoon is not one fixed amount.",

  // ---- area ------------------------------------------------------------
  "area.m2": "The square metre is the SI unit of area, and the unit UK floor plans and carpets are sold in.",
  "area.ft2": "The square foot is 0.092 903 04 m² exactly. US property listings and commercial UK lettings still quote it.",
  "area.ha": "The hectare is 10 000 m² — a square 100 m on a side, and the metric unit of land area.",
  "area.acre": "The acre is 4046.856 4224 m², historically the area one ox team could plough in a day. There are 640 acres in a square mile.",

  // ---- speed -----------------------------------------------------------
  "speed.mps": "The metre per second is the SI unit of speed, and the one physics equations expect.",
  "speed.kmh": "The kilometre per hour is the speed unit on road signs across most of the world. Dividing by 3.6 gives metres per second.",
  "speed.mph": "The mile per hour is the speed limit unit in the UK and the US. Exactly 0.447 04 m/s.",
  "speed.kn": "The knot is one nautical mile per hour, 1.852 km/h exactly. Shipping and aviation use it because it maps onto latitude.",

  // ---- time ------------------------------------------------------------
  "time.s": "The second is the SI base unit of time, defined by the caesium-133 hyperfine transition.",
  "time.min": "The minute is exactly 60 seconds — one of the few units SI accepts without being decimal, inherited from Babylonian counting.",
  "time.h": "The hour is exactly 3600 seconds.",
  "time.d": "The day here is exactly 86 400 seconds. Real solar days vary slightly, and leap seconds have occasionally made a calendar day 86 401 s long.",
  "time.yr": "The year here is the Julian year of exactly 365.25 days, the convention used in astronomy. A calendar year is 365 or 366 days.",

  // ---- pressure --------------------------------------------------------
  "pressure.kpa": "The kilopascal is 1000 pascals. Tyre placards in metric countries are usually printed in kPa or bar.",
  "pressure.bar": "The bar is exactly 100 000 Pa, near enough to atmospheric pressure at sea level to be a convenient working unit.",
  "pressure.psi": "The pound per square inch is exactly 6894.757 293 Pa. UK and US tyre gauges are still marked in it.",
  "pressure.atm": "The standard atmosphere is defined as exactly 101 325 Pa. It is a fixed reference, not the pressure outside today.",

  // ---- energy ----------------------------------------------------------
  "energy.j": "The joule is the SI unit of energy: one newton acting through one metre.",
  "energy.kj": "The kilojoule is 1000 joules, and the energy unit on UK and EU nutrition labels alongside kilocalories.",
  "energy.mj": "The megajoule is a million joules. Domestic gas bills convert metered volume into MJ or kWh.",
  "energy.cal": "The thermochemical calorie is exactly 4.184 J — the small calorie, roughly the energy to warm 1 g of water by 1 °C.",
  "energy.kcal": "The kilocalorie is 1000 small calories. It is what food labels and fitness apps mean when they say \"calories\".",
  "energy.kwh": "The kilowatt-hour is 3.6 MJ — one kilowatt sustained for an hour, and the unit an electricity meter bills in.",
  "energy.btu": "The British thermal unit here is the international-table BTU, exactly 1055.055 852 62 J. Heating and air-conditioning ratings use it.",

  // ---- power -----------------------------------------------------------
  "power.w": "The watt is the SI unit of power: one joule per second.",
  "power.kw": "The kilowatt is 1000 watts. EU vehicle documents give engine power in kW, whatever the brochure says.",
  "power.hp": "Mechanical horsepower is 745.6999 W, defined as 550 foot-pounds per second. It is the horsepower UK and US brochures quote.",
  "power.ps": "Metric horsepower (PS, or cheval vapeur) is 735.498 75 W — about 1.4% smaller than mechanical horsepower, which is why the same car has two figures.",
  "power.btuh": "BTU per hour rates heating and cooling equipment. A 12 000 BTU/h air conditioner is one \"ton\" of refrigeration, about 3.5 kW.",

  // ---- data ------------------------------------------------------------
  "data.bit": "The bit is a single binary digit. Network and broadband speeds are quoted in bits; files are measured in bytes, eight times larger.",
  "data.byte": "The byte is eight bits, the smallest addressable unit of storage on essentially every modern machine.",
  "data.mb": "The megabyte is a million bytes when a drive maker or a network operator uses it. Some software still shows 1 048 576 bytes and calls it MB.",
  "data.gb": "The gigabyte is a thousand million bytes. Storage is sold in gigabytes; Windows reports the same space in gibibytes, which is why a drive looks smaller than the box.",
  "data.tb": "The terabyte is a million million bytes. A 1 TB drive holds 1 000 000 000 000 bytes, which an operating system counting in binary shows as 931 GiB.",
  "data.gib": "The gibibyte is 1024³ bytes — the binary unit macOS and Windows actually count in, about 7.4% larger than a gigabyte.",

  // ---- angle -----------------------------------------------------------
  "angle.rad": "The radian is the SI unit of angle: the angle subtending an arc equal to the radius. A full turn is 2π radians.",
  "angle.deg": "The degree divides a full turn into 360, a Babylonian convention that survives because 360 divides so many ways.",

  // ---- force -----------------------------------------------------------
  "force.n": "The newton is the SI unit of force: the force that accelerates one kilogram at one metre per second squared.",
  "force.lbf": "Pound-force is the weight of one pound under standard gravity, 4.448 222 N. It is a force, not a mass — pounds and pound-force are different units.",

  // ---- fuel economy ----------------------------------------------------
  "fuel.l100": "Litres per 100 km measures consumption: lower is better. It is the figure EU and UK official documents lead with.",
  "fuel.mpg_uk": "Miles per imperial gallon measures economy: higher is better. UK brochures use it, and the imperial gallon is 4.546 09 L.",
  "fuel.mpg_us": "Miles per US gallon uses the smaller 3.785 41 L gallon, so a car rated 40 mpg in the US is about 48 mpg in the UK.",

  // ---- density ---------------------------------------------------------
  "density.kgm3": "The kilogram per cubic metre is the SI unit of density. Air at sea level is about 1.2 kg/m³.",
  "density.gcm3": "The gram per cubic centimetre is 1000 kg/m³, and a convenient scale: water is almost exactly 1 g/cm³, so the number doubles as relative density.",

  // ---- torque ----------------------------------------------------------
  "torque.nm": "The newton metre is the SI unit of torque. It has the same dimensions as the joule but is never written as one — torque is not energy.",
  "torque.lbfft": "The pound-foot is 1.355 818 N·m. Torque wrenches sold in the UK and US are commonly marked in it.",

  // ---- flow ------------------------------------------------------------
  "flow.lmin": "Litres per minute is how domestic taps, showers and pumps are rated. A decent UK shower delivers 8–12 L/min.",
  "flow.gpm_uk": "Imperial gallons per minute uses the 4.546 09 L gallon. US gallons per minute is a fifth smaller for the same number.",

  // ---- mass flow -------------------------------------------------------
  "massflow.kgh": "Kilograms per hour is the usual rating for industrial feed, steam and dosing equipment.",
  "massflow.lbh": "Pounds per hour is the same rating in US practice; one pound per hour is 0.453 592 kg/h.",

  // ---- frequency -------------------------------------------------------
  "frequency.hz": "The hertz is one cycle per second, the SI unit of frequency.",
  "frequency.rpm": "Revolutions per minute is one sixtieth of a hertz. Engine and disc speeds are quoted in it.",

  // ---- angular velocity ------------------------------------------------
  "angularvelocity.rads": "Radians per second is the SI measure of rotation rate, and the ω that appears in physics equations.",
  "angularvelocity.rpm": "Revolutions per minute counts whole turns. One rpm is 2π/60 rad/s, so 1000 rpm is about 104.7 rad/s.",

  // ---- acceleration ----------------------------------------------------
  "acceleration.mps2": "The metre per second squared is the SI unit of acceleration.",
  "acceleration.g0": "Standard gravity, g₀, is defined as exactly 9.806 65 m/s². It is a fixed reference value, not the gravity measured at your location.",

  // ---- data rate -------------------------------------------------------
  "datarate.mbps": "Megabits per second is how broadband is sold. It counts bits, so it is eight times smaller than the download figure your browser shows.",
  "datarate.MBs": "Megabytes per second is how download managers report progress. A 100 Mbit/s line tops out at about 12.5 MB/s.",

  // ---- charge ----------------------------------------------------------
  "charge.c": "The coulomb is the SI unit of electric charge: one ampere flowing for one second.",
  "charge.mah": "The milliampere-hour is the capacity marked on phone and tool batteries. Turning mAh into watt-hours needs the cell voltage as well, so it is not a unit conversion.",

  // ---- illuminance -----------------------------------------------------
  "illuminance.lx": "The lux is one lumen per square metre, the SI measure of how much light lands on a surface. An overcast day is about 1000 lx.",
  "illuminance.fc": "The foot-candle is one lumen per square foot, 10.7639 lx. US lighting specifications still use it.",

  // ---- radioactivity ---------------------------------------------------
  "radioactivity.bq": "The becquerel is one nuclear decay per second — the SI unit of activity. It says nothing about the dose a person receives.",
  "radioactivity.ci": "The curie is 3.7×10¹⁰ Bq, originally the activity of a gram of radium. It is a very large unit; laboratory sources are usually microcuries.",

  // ---- dose ------------------------------------------------------------
  "dose.msv": "The millisievert measures equivalent dose — absorbed energy weighted for biological harm. UK natural background is about 2.7 mSv a year.",
  "dose.rem": "The rem is the older US unit, exactly 0.01 Sv. A chest X-ray is roughly 0.01 rem.",

  // ---- magnetic field --------------------------------------------------
  "magneticfield.t": "The tesla is the SI unit of magnetic flux density. An MRI scanner runs at 1.5 to 3 T; the Earth's field is around 50 µT.",
  "magneticfield.g": "The gauss is exactly 10⁻⁴ T. Magnet suppliers and older physics texts quote it, so a fridge magnet is a few hundred gauss.",

  // ---- viscosity -------------------------------------------------------
  "viscosity.pas": "The pascal second is the SI unit of dynamic viscosity — resistance to shear.",
  "viscosity.cp": "The centipoise is exactly one millipascal second, chosen so that water at 20 °C is almost exactly 1 cP.",

  // ---- kinematic viscosity ---------------------------------------------
  "kinematicviscosity.m2s": "The square metre per second is the SI unit of kinematic viscosity: dynamic viscosity divided by density.",
  "kinematicviscosity.cst": "The centistokes is 10⁻⁶ m²/s. Lubricating oil grades are specified in cSt at 40 °C and 100 °C.",

  // ---- amount ----------------------------------------------------------
  "amount.mol": "The mole is the SI base unit of amount of substance: exactly 6.022 140 76×10²³ entities.",
  "amount.mmol": "The millimole is a thousandth of a mole, the scale most clinical and bench chemistry works at.",

  // ---- concentration ---------------------------------------------------
  "concentration.moll": "Moles per litre — molar concentration — is the standard bench chemistry unit. It equals 1000 mol/m³.",
  "concentration.mmoll": "Millimoles per litre is the unit clinical results are reported in. Converting to mg/dL needs the substance's molar mass, so it is not a unit conversion.",

  // ---- specific energy -------------------------------------------------
  "specificenergy.kjkg": "Kilojoules per kilogram measures energy content by mass, from fuels to foods.",
  "specificenergy.whkg": "Watt-hours per kilogram is how battery energy density is quoted. A current lithium-ion cell manages roughly 250 Wh/kg.",

  // ---- thermal conductivity --------------------------------------------
  "thermalconductivity.wmk": "Watts per metre kelvin is the SI measure of how readily a material conducts heat. Mineral wool is about 0.04; copper is about 400.",
  "thermalconductivity.btuhftf": "BTU per hour per foot per degree Fahrenheit is the US building-industry equivalent, 1.730 73 W/(m·K).",

  // ---- EV efficiency ---------------------------------------------------
  "evefficiency.whkm": "Watt-hours per kilometre measures how much energy a vehicle uses to travel: lower is better. A small EV manages about 150 Wh/km.",
  "evefficiency.whmi": "Watt-hours per mile is the same measure over the longer US mile, so the number is about 1.6 times larger for the same car."
};

/*
  PAIR_HOOKS — the one sentence that makes a page about ITS pair rather
  than about conversion in general. Written for the pairs where there is a
  real-world hook worth having. A pair without an entry falls back to the
  exactness sentence, which is still specific to that pair.
*/
var PAIR_HOOKS = {
  "kg-to-pounds-and-ounces": "Birth weights are the reason: UK hospitals record 3.5 kg and everyone then asks what that is in pounds and ounces (7 lb 11 oz).",
  "pounds-and-ounces-to-kg": "Type it as \"7 lb 11 oz\" or \"7 11\". Red books, passports and airline allowances all want the kilograms.",
  "seconds-to-minutes-and-seconds": "A stopwatch reads 150 seconds; a person says 2 min 30 s. Lap times, video lengths and cooking timers all live in the second form.",
  "cm-to-feet-and-inches": "Height is the reason this page exists: 175 cm is 5 ft 8.9 in, not 5.74 feet. The whole feet stay whole and the remainder becomes inches.",
  "feet-and-inches-to-cm": "Type it the way you say it — \"5 ft 9 in\", \"5' 9\" or just \"5 9\" — and the centimetres follow.",
  "kg-to-stone-and-pounds": "UK body weight is said as stone and pounds, so 80 kg is 12 st 8.4 lb rather than 12.6 stone.",
  "stone-and-pounds-to-kg": "Enter it as \"12 st 4 lb\" or \"12 4\". Hospital notes, airlines and gyms all want the kilograms.",
  "minutes-to-hours-and-minutes": "150 minutes is 2 h 30 min, not 2.5 hours — useful for timesheets, cooking and anything read off a clock.",
  "mm-to-cm": "A tenth, no more than that — but it is the conversion a drawing dimensioned in millimetres needs when the spec sheet is in centimetres.",
  "m-to-cm": "A hundred centimetres to the metre. Worth having when a room measured in metres meets furniture listed in centimetres.",
  "km-to-m": "A thousand metres to the kilometre, which is what the prefix means.",
  "inches-to-feet": "Twelve inches to the foot. This gives decimal feet — for the usual \"6 foot 1\" form, the feet-and-inches converter keeps the remainder as whole inches.",
  "feet-to-inches": "Twelve to the foot, so a 6 ft door is 72 in. Timber and fixings are usually specified in whole inches.",
  "kg-to-g": "A thousand grams to the kilogram. Recipe quantities and postage limits are often quoted in different ones of the two.",
  "g-to-kg": "A thousand to one, so a 500 g pack is half a kilogram.",
  "ml-to-litres": "A thousand millilitres to the litre. Drinks are labelled in both, sometimes on the same bottle.",
  "litres-to-ml": "A thousand to one. Medicine doses and recipe liquids are in millilitres; the bottle is labelled in litres.",
  "hours-to-minutes": "Sixty to the hour, so 2.5 hours is 150 minutes rather than 2 hours 50.",
  "minutes-to-seconds": "Sixty to the minute — useful for exercise intervals, cooking timers and video lengths.",
  "inches-to-mm": "Workshops and drawings in the UK are dimensioned in millimetres; fasteners and tooling are often still specified in inches.",
  "yards-to-metres": "Athletics tracks, swimming pools and fabric are the places this still comes up — and the yard is the unit the inch and foot are actually defined from.",
  "metres-to-yards": "A metre is a shade under 1.1 yards, which is why 100 m and 110 yards are nearly the same race.",
  "nautical-miles-to-km": "A nautical mile is 1852 m exactly, defined so one minute of latitude is one nautical mile — it is not a rounded version of the land mile.",
  "grams-to-pounds": "Useful when a recipe or a parcel is labelled in grams and the limit you are working to is in pounds.",
  "pounds-to-grams": "Recipes from US sources give weights in pounds and ounces; UK kitchen scales read grams.",
  "tons-to-kg": "This is the short ton of 2000 pounds, used in the US. The UK long ton is 2240 pounds and the metric tonne is 1000 kg — three different things called a ton.",
  "kg-to-tons": "Gives short (US) tons. For metric tonnes just divide by 1000, and for UK long tons use the long-ton entry in the menu.",
  "fahrenheit-to-kelvin": "Two conversions in one: Fahrenheit degrees are five ninths the size of a kelvin, and kelvin counts from absolute zero rather than from a freezing point.",
  "tablespoons-to-ml": "This is the metric tablespoon of 15 mL. Australia uses 20 mL and the US 14.79 mL, so a recipe's country changes the answer.",
  "teaspoons-to-ml": "The metric teaspoon is exactly 5 mL, which is also the standard medicine spoon — the US teaspoon is 4.93 mL.",
  "quarts-to-litres": "This is the US liquid quart of 946 mL. An imperial quart is 1.14 litres, a fifth larger.",
  "cubic-feet-to-cubic-metres": "Shipping volumes, loft insulation and older UK gas meters are quoted in cubic feet; almost everything official is in cubic metres.",
  "cubic-metres-to-litres": "Exactly 1000 litres to the cubic metre — a water bill in cubic metres is a bill in thousands of litres.",
  "acres-to-square-feet": "An acre is 43 560 square feet, a number that looks arbitrary because it is: it is 66 feet by 660 feet, one chain by one furlong.",
  "knots-to-kmh": "One knot is 1.852 km/h exactly. Wind warnings and boat speeds come in knots almost everywhere.",
  "mps-to-mph": "Physics works in metres per second; speed limits do not. One metre per second is 2.24 mph.",
  "mps-to-kmh": "Multiply by 3.6, exactly. It is the one conversion in this family worth memorising.",
  "kpa-to-psi": "Tyre placards in metric countries print kPa; UK and US gauges read psi. 220 kPa is about 32 psi.",
  "psi-to-kpa": "A tyre gauge in psi against a handbook in kilopascals — multiply by 6.895.",
  "bar-to-kpa": "One bar is exactly 100 kPa, so this is a decimal point move rather than a real conversion.",
  "atm-to-psi": "The standard atmosphere is a defined constant of exactly 101 325 Pa, so 1 atm is 14.696 psi — not whatever the pressure outside happens to be today.",
  "joules-to-calories": "These are small calories of 4.184 J, the physics unit — not the food calories on a packet, which are a thousand times larger.",
  "kwh-to-mj": "Electricity is billed in kilowatt-hours and gas in megajoules or kilowatt-hours; one kWh is exactly 3.6 MJ.",
  "btu-to-kwh": "Heating and air-conditioning are rated in BTU; your meter bills in kilowatt-hours. A 12 000 BTU unit is about 3.5 kW.",
  "watts-to-btu": "Air conditioners and heat pumps are sold in BTU per hour and specified in watts. One watt is 3.41 BTU/h.",
  "mb-to-gb": "A thousand megabytes to the gigabyte, the way storage is sold. Software counting in binary will show a slightly different number.",
  "gb-to-tb": "A thousand gigabytes to the terabyte as drives are sold — which is why a 1 TB drive reports as 931 GiB once formatted.",
  "gb-to-mb": "Decimal gigabytes, as advertised: 1000 MB each. The binary gibibyte is 1024 MiB and about 7% larger.",
  "minutes-to-hours": "Timesheets, cooking and parking all want this, and 90 minutes is 1.5 hours rather than 1.30.",
  "hours-to-days": "Straight division by 24 — useful for battery life, shift patterns and delivery windows.",
  "seconds-to-minutes": "Sixty to the minute. Handy for splitting a race time or a video length into something readable.",
  "cm-to-inches": "Screen sizes, waist sizes and paper are all quoted differently either side of the Atlantic, and 2.54 is the only number you need.",
  "inches-to-cm": "An inch is exactly 2.54 cm, so this direction is a single multiplication with no rounding anywhere in it.",
  "mm-to-inches": "Fasteners, drill bits and sheet material are specified in whichever system the factory used, so this is the conversion a workshop reaches for most.",
  "feet-to-metres": "Aviation altitudes, building heights and personal height all sit on the awkward side of this one.",
  "metres-to-feet": "One metre is 3.28084 feet, which is why a 100 m sprint is a shade under 110 yards.",
  "km-to-miles": "UK road signs are in miles while almost every other European country signs in kilometres — 1 km is about 0.621 miles.",
  "miles-to-km": "A mile is exactly 1.609 344 km, so a marathon's 26.219 miles works out at 42.195 km.",
  "feet-to-cm": "Height is stated in feet and inches in the UK and the US and in centimetres nearly everywhere else.",
  "cm-to-feet": "This gives feet as a decimal. For the usual \"5 foot 9\" form, take the whole feet and turn the remainder into inches by multiplying by 12.",
  "lbs-to-kg": "The pound is defined as exactly 0.453 592 37 kg, so nothing here is approximated.",
  "kg-to-stone": "This gives stone as a decimal. UK weights are normally said as stone and pounds, so multiply what is after the point by 14 to get the pounds.",
  "stone-to-kg": "Stone is a UK-only unit for body weight; hospital records and airline allowances are in kilograms.",
  "stone-to-pounds": "A stone is exactly 14 pounds — the one conversion in this family you can do in your head.",
  "grams-to-ounces": "Recipes translated from US sources give dry ingredients in ounces; UK kitchen scales read grams.",
  "ounces-to-grams": "An ounce is exactly 28.349 523 125 g. Note this is the avoirdupois ounce, not the troy ounce used for gold.",
  "troy-ounces-to-grams": "Gold, silver and platinum are priced per troy ounce, which is heavier than the ounce used for food.",
  "fahrenheit-to-celsius": "Subtract 32 first, then multiply by five ninths. Doing it the other way round is the classic wrong answer.",
  "celsius-to-kelvin": "Adding 273.15 is the whole conversion: a Celsius degree and a kelvin are the same size.",
  "kelvin-to-celsius": "Kelvin counts from absolute zero, so subtracting 273.15 lands you back on the everyday scale.",
  "ml-to-oz": "US recipes and drink measures are in fluid ounces; almost everything else is labelled in millilitres.",
  "oz-to-ml": "This uses the US fluid ounce of 29.5735 mL. The imperial fluid ounce is 28.4131 mL — a 4% difference that compounds across a recipe.",
  "litres-to-gallons": "This uses the imperial gallon of 4.546 09 L. The US gallon is a fifth smaller, so check which one a figure means before trusting it.",
  "gallons-to-litres": "UK fuel economy is quoted per imperial gallon even though fuel is sold by the litre.",
  "cups-to-ml": "This is the US cup of 236.588 mL. A metric cup is 250 mL, so a recipe's country of origin changes the answer.",
  "ml-to-cups": "Measuring by weight beats measuring by cup for anything dry — a cup of flour varies by up to 20% depending on how it is packed.",
  "litres-to-pints": "This uses the imperial pint of 568.261 mL, the pint served in a UK pub. A US pint is 473.176 mL.",
  "pints-to-litres": "Milk in returnable UK bottles is still sold by the pint, while everything else on the shelf is in litres.",
  "mph-to-kmh": "UK speed limits are in miles per hour and continental ones are in kilometres per hour — 70 mph is 112.7 km/h.",
  "kmh-to-mph": "A speedometer reading of 100 km/h is 62.1 mph, comfortably inside a UK 70 limit.",
  "knots-to-mph": "Wind forecasts and boat speeds come in knots; one knot is 1.151 mph.",
  "psi-to-bar": "Tyre placards use bar in most of Europe and psi in the UK and the US. 32 psi is 2.21 bar.",
  "bar-to-psi": "One bar is 14.5038 psi, so the round 2 bar on a European placard is about 29 psi.",
  "calories-to-kj": "Food labels carry both, because kilojoules are the SI figure and kilocalories are what people actually count.",
  "kj-to-calories": "The \"calories\" on a food label are kilocalories: 2000 kcal is 8368 kJ.",
  "hp-to-kw": "Vehicle documents give power in kilowatts; brochures give horsepower. This uses mechanical horsepower, not metric PS.",
  "kw-to-hp": "One kilowatt is 1.341 mechanical horsepower — or 1.360 metric horsepower, which is why two brochures can disagree.",
  "ps-to-hp": "PS is metric horsepower and is about 1.4% smaller than mechanical horsepower, so the same engine gets two different numbers.",
  "gb-to-gib": "This is the conversion behind the missing space: a 1 TB drive is honestly 1000 GB, but an operating system counting in binary shows 931 GiB.",
  "mbps-to-mbs": "Broadband is sold in megabits and downloads are measured in megabytes. Divide by eight: a 100 Mbit/s line gives about 12.5 MB/s.",
  "bytes-to-bits": "One byte is eight bits — the factor that makes a connection sound eight times faster than the download it delivers.",
  "degrees-to-radians": "Trigonometric functions in almost every programming language expect radians, which is where the missing π usually goes.",
  "radians-to-degrees": "One radian is 57.2958°, an awkward number precisely because the radian is defined by the circle rather than by counting.",
  "mpg-to-l100km": "These run in opposite directions: more miles per gallon means fewer litres per 100 km, so this is not a multiplication.",
  "l100km-to-mpg": "Official UK figures give both, and the relationship is a division rather than a scale factor.",
  "mpg-us-to-mpg-uk": "Same car, same fuel, two different numbers — because the US gallon is a fifth smaller than the imperial one.",
  "days-to-years": "This uses the Julian year of exactly 365.25 days, the astronomy convention. A calendar year is 365 or 366.",
  "acres-to-hectares": "UK land is registered in hectares and still talked about in acres; an acre is 0.404686 ha.",
  "hectares-to-acres": "A hectare is 2.471 acres, or about two and a half football pitches.",
  "square-feet-to-square-metres": "Commercial floor space is advertised in square feet and specified in square metres.",
  "square-metres-to-square-feet": "One square metre is 10.7639 sq ft — note that it is the square of 3.28084, not that number itself."
};

/*
  TABLE_VALUES — the ladder a pair's static table walks. The default in
  convert-table.js runs to 1000, which is right for kilograms and absurd
  for stone or for an oven temperature. Only pairs that need a different
  range appear here.
*/
var TABLE_VALUES = {
  "kg-to-pounds-and-ounces": [2, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.5, 5],
  "pounds-and-ounces-to-kg": [4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10],
  "seconds-to-minutes-and-seconds": [30, 45, 60, 90, 100, 120, 150, 180, 240, 300, 600],
  "cm-to-feet-and-inches": [140, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200],
  "feet-and-inches-to-cm": [4.5, 5, 5.25, 5.5, 5.75, 6, 6.25, 6.5],
  "kg-to-stone-and-pounds": [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110],
  "stone-and-pounds-to-kg": [8, 9, 10, 11, 12, 13, 14, 15, 16, 18],
  "minutes-to-hours-and-minutes": [30, 45, 60, 75, 90, 120, 150, 180, 240, 480],
  "mm-to-cm": [1, 5, 10, 25, 50, 100, 250, 500, 1000],
  "m-to-cm": [0.5, 1, 1.5, 2, 2.5, 3, 5, 10, 25, 100],
  "km-to-m": [0.5, 1, 2, 5, 10, 21.0975, 42.195, 100],
  "inches-to-feet": [6, 12, 24, 36, 48, 60, 66, 72, 78, 84],
  "feet-to-inches": [1, 2, 3, 4, 5, 5.5, 6, 6.5, 7, 8, 10],
  "kg-to-g": [0.1, 0.25, 0.5, 1, 1.5, 2, 5, 10, 25],
  "g-to-kg": [100, 250, 500, 750, 1000, 1500, 2000, 5000],
  "ml-to-litres": [100, 250, 330, 500, 750, 1000, 1500, 2000],
  "litres-to-ml": [0.25, 0.33, 0.5, 0.75, 1, 1.5, 2, 5],
  "hours-to-minutes": [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 8, 24],
  "minutes-to-seconds": [0.5, 1, 2, 3, 5, 10, 15, 30, 45, 90],
  "cm-to-inches": [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100],
  "inches-to-cm": [1, 2, 3, 4, 5, 6, 8, 10, 12, 18, 24, 36],
  "mm-to-inches": [1, 2, 3, 5, 10, 15, 20, 25, 30, 50, 100],
  "inches-to-mm": [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 24],
  "feet-to-metres": [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 50, 100],
  "metres-to-feet": [1, 2, 3, 5, 10, 15, 20, 25, 50, 100, 200],
  "km-to-miles": [1, 2, 3, 5, 10, 15, 20, 25, 50, 100, 200],
  "miles-to-km": [1, 2, 3, 5, 10, 15, 20, 26.2188, 50, 100],
  "yards-to-metres": [1, 5, 10, 25, 50, 100, 200, 400, 800, 1000],
  "metres-to-yards": [1, 5, 10, 25, 50, 100, 200, 400, 800, 1000],
  "nautical-miles-to-km": [1, 2, 5, 10, 20, 50, 100, 200, 500],
  "lbs-to-kg": [1, 2, 5, 10, 20, 50, 100, 150, 200, 250],
  "grams-to-ounces": [10, 25, 50, 100, 150, 200, 250, 500, 750, 1000],
  "ounces-to-grams": [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
  "grams-to-pounds": [50, 100, 250, 500, 750, 1000, 1500, 2000, 5000],
  "pounds-to-grams": [0.25, 0.5, 1, 2, 3, 4, 5, 10, 20, 50],
  "tons-to-kg": [0.5, 1, 2, 3, 5, 10, 20, 50, 100],
  "kg-to-tons": [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
  "troy-ounces-to-grams": [0.25, 0.5, 1, 2, 3, 5, 10, 20, 50, 100],
  "fahrenheit-to-celsius": [-40, -20, 0, 10, 20, 32, 50, 68, 86, 98.6, 100, 150, 212],
  "celsius-to-kelvin": [-273.15, -100, -40, 0, 20, 25, 37, 100, 500, 1000],
  "kelvin-to-celsius": [0, 100, 200, 273.15, 293.15, 300, 373.15, 500, 1000],
  "fahrenheit-to-kelvin": [-459.67, -40, 0, 32, 68, 98.6, 212, 500, 1000],
  "litres-to-gallons": [1, 2, 5, 10, 20, 30, 40, 50, 60, 70],
  "gallons-to-litres": [1, 2, 3, 5, 8, 10, 12, 15, 20],
  "litres-to-pints": [0.5, 1, 2, 3, 4, 5, 10, 20, 50],
  "pints-to-litres": [1, 2, 3, 4, 5, 6, 8, 10, 20],
  "quarts-to-litres": [0.5, 1, 2, 3, 4, 5, 8, 10],
  "cubic-feet-to-cubic-metres": [1, 5, 10, 25, 50, 100, 200, 500, 1000],
  "cubic-metres-to-litres": [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100],
  "square-feet-to-square-metres": [100, 250, 500, 750, 1000, 1500, 2000, 2500, 5000],
  "square-metres-to-square-feet": [10, 25, 50, 75, 100, 150, 200, 250, 500],
  "acres-to-square-feet": [0.1, 0.25, 0.5, 1, 2, 3, 5, 10, 20],
  "mps-to-mph": [1, 2, 3, 5, 10, 15, 20, 25, 30, 50],
  "mps-to-kmh": [1, 2, 3, 5, 10, 15, 20, 25, 30, 50],
  "kpa-to-psi": [100, 150, 200, 220, 240, 260, 280, 300, 400, 500],
  "psi-to-kpa": [10, 20, 28, 30, 32, 35, 40, 50, 80, 100],
  "bar-to-kpa": [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 10],
  "atm-to-psi": [0.5, 1, 1.5, 2, 3, 5, 10, 20, 50],
  "calories-to-kj": [50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000, 2500],
  "kj-to-calories": [100, 250, 500, 1000, 2000, 3000, 4000, 5000, 8368, 10000],
  "joules-to-calories": [1, 10, 50, 100, 500, 1000, 5000, 10000],
  "kwh-to-mj": [1, 2, 5, 10, 20, 50, 100, 250, 500, 1000],
  "btu-to-kwh": [1000, 3000, 5000, 9000, 12000, 18000, 24000, 36000, 48000],
  "watts-to-btu": [100, 250, 500, 1000, 1500, 2000, 2500, 3500, 5000, 7000],
  "mb-to-gb": [100, 250, 500, 1000, 2000, 5000, 10000, 50000],
  "gb-to-tb": [100, 250, 500, 1000, 2000, 4000, 8000, 10000],
  "gb-to-mb": [0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256],
  "bytes-to-bits": [1, 8, 64, 512, 1024, 1000000],
  "length": [1, 2, 5, 10, 15, 20, 25, 30, 50, 100],
  "stone-to-kg": [1, 2, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20],
  "stone-to-pounds": [1, 2, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20],
  "kg-to-stone": [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120],
  "cm-to-feet": [140, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200],
  "feet-to-cm": [1, 2, 3, 4, 5, 5.5, 6, 6.5, 7, 8, 9, 10],
  "mph-to-kmh": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  "kmh-to-mph": [10, 20, 30, 50, 60, 70, 80, 90, 100, 110, 120, 130],
  "knots-to-mph": [1, 5, 10, 15, 20, 25, 30, 40, 50, 60],
  "knots-to-kmh": [1, 5, 10, 15, 20, 25, 30, 40, 50, 60],
  "psi-to-bar": [10, 15, 20, 25, 28, 30, 32, 34, 36, 40, 45, 50],
  "bar-to-psi": [0.5, 1, 1.5, 2, 2.2, 2.4, 2.6, 2.8, 3, 4, 5, 10],
  "hp-to-kw": [50, 75, 100, 125, 150, 200, 250, 300, 400, 500],
  "kw-to-hp": [25, 50, 75, 100, 125, 150, 200, 250, 300, 400],
  "ps-to-hp": [50, 75, 100, 125, 150, 200, 250, 300, 400, 500],
  "mpg-to-l100km": [20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80],
  "l100km-to-mpg": [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20],
  "mpg-us-to-mpg-uk": [15, 20, 25, 30, 35, 40, 45, 50, 60, 70],
  "degrees-to-radians": [1, 5, 10, 15, 30, 45, 60, 90, 120, 180, 270, 360],
  "radians-to-degrees": [0.1, 0.25, 0.5, 1, 1.5, 2, 3, 3.1416, 4, 5, 6, 6.2832],
  "minutes-to-hours": [1, 5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240],
  "hours-to-days": [1, 2, 4, 6, 8, 12, 18, 24, 36, 48, 72, 168],
  "seconds-to-minutes": [1, 5, 10, 15, 30, 45, 60, 90, 120, 300, 600, 3600],
  "days-to-years": [1, 7, 30, 90, 180, 365, 500, 730, 1000, 3650],
  "cups-to-ml": [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2, 2.5, 3, 4],
  "ml-to-cups": [50, 100, 125, 150, 200, 236.588, 250, 300, 500, 750, 1000],
  "teaspoons-to-ml": [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6],
  "tablespoons-to-ml": [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10],
  "ml-to-oz": [5, 10, 25, 50, 100, 150, 200, 250, 330, 500, 750, 1000],
  "oz-to-ml": [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 32],
  "gb-to-gib": [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1000],
  "mbps-to-mbs": [1, 5, 10, 20, 30, 50, 60, 70, 100, 200, 500, 1000],
  "acres-to-hectares": [0.25, 0.5, 1, 2, 3, 5, 10, 20, 50, 100],
  "hectares-to-acres": [0.25, 0.5, 1, 2, 3, 5, 10, 20, 50, 100]
};


/*
  PLURALS — the plural of a unit's name, where "+s" is wrong. The
  "how many X in a Y" question forms read as gibberish without this
  ("how many kilogram in a stone"), and those are the sentences a search
  engine quotes.
*/
var PLURALS = {
  "Feet and inches": "feet and inches",
  "Stone and pounds": "stone and pounds",
  "Pounds and ounces": "pounds and ounces",
  "Hours and minutes": "hours and minutes",
  "Minutes and seconds": "minutes and seconds",
  Foot: "feet",
  Inch: "inches",
  Stone: "stone",
  Hertz: "hertz",
  Lux: "lux",
  Celsius: "degrees Celsius",
  Fahrenheit: "degrees Fahrenheit",
  Kelvin: "kelvin",
  Rankine: "degrees Rankine",
  "Réaumur": "degrees Réaumur",
  "Ångström": "ångströms",
  "Metre per second": "metres per second",
  "Kilometre per hour": "kilometres per hour",
  "Mile per hour": "miles per hour",
  "Foot per second": "feet per second",
  "Pound per square inch": "pounds per square inch",
  "Kilogram per cubic metre": "kilograms per cubic metre",
  "Gram per cubic centimetre": "grams per cubic centimetre",
  "Litres per 100 km": "litres per 100 km",
  "Miles per imperial gallon": "miles per imperial gallon",
  "Miles per US gallon": "miles per US gallon",
  "Kilometres per litre": "kilometres per litre",
  "Watt-hour per kilometre": "watt-hours per kilometre",
  "Watt-hour per mile": "watt-hours per mile",
  "Megabit per second": "megabits per second",
  "Megabyte per second": "megabytes per second",
  "Litre per minute": "litres per minute",
  "Imperial gallon per minute": "imperial gallons per minute",
  "Kilogram per hour": "kilograms per hour",
  "Pound per hour": "pounds per hour",
  "Revolution per minute": "revolutions per minute",
  "Radian per second": "radians per second",
  "Metre per second squared": "metres per second squared",
  "Standard gravity": "standard gravities",
  "Millimole per litre": "millimoles per litre",
  "Mole per litre": "moles per litre",
  "Mole per cubic metre": "moles per cubic metre",
  "Kilojoule per kilogram": "kilojoules per kilogram",
  "Watt-hour per kilogram": "watt-hours per kilogram",
  "Watt per metre kelvin": "watts per metre kelvin",
  "BTU per hour foot degree Fahrenheit": "BTU per hour per foot per degree Fahrenheit",
  "BTU per hour": "BTU per hour",
  "Pound-force foot": "pound-force feet",
  "Pound-force": "pounds-force",
  "British thermal unit (IT)": "British thermal units",
  "Kilocalorie (food calorie)": "kilocalories",
  "Calorie (thermochemical)": "calories",
  "Metric horsepower (PS)": "metric horsepower",
  "Horsepower (mechanical)": "mechanical horsepower",
  "Tonne (metric ton)": "tonnes",
  "Ton (short, US)": "short tons",
  "Ton (long, UK)": "long tons",
  "Fluid ounce (US)": "US fluid ounces",
  "Fluid ounce (imperial)": "imperial fluid ounces",
  "Cup (US)": "US cups",
  "Cup (metric, 250 mL)": "metric cups",
  "Pint (imperial)": "imperial pints",
  "Pint (US liquid)": "US liquid pints",
  "Quart (US liquid)": "US liquid quarts",
  "Gallon (imperial)": "imperial gallons",
  "Gallon (US liquid)": "US liquid gallons",
  "Teaspoon (metric, 5 mL)": "metric teaspoons",
  "Tablespoon (metric, 15 mL)": "metric tablespoons",
  "Cubic metre": "cubic metres",
  "Cubic foot": "cubic feet",
  "Square metre": "square metres",
  "Square foot": "square feet",
  "Year (Julian, 365.25 d)": "Julian years",
  "Kilobyte (1000 B)": "kilobytes",
  "Megabyte (1000 kB)": "megabytes",
  "Gigabyte (1000 MB)": "gigabytes",
  "Terabyte (1000 GB)": "terabytes",
  "Gibibyte (1024 MiB)": "gibibytes",
  "Milliampere-hour": "milliampere-hours",
  "Watt-hour": "watt-hours",
  "Kilowatt-hour": "kilowatt-hours",
  "Foot-candle": "foot-candles",
  "Pascal second": "pascal seconds",
  "Square metre per second": "square metres per second",
  "Nautical mile": "nautical miles",
  "Troy ounce": "troy ounces"
};

/*
  QUANTITY_HOOKS — the same job as PAIR_HOOKS, for the general converter
  pages. Without one a quantity page opened with its registry note, which
  meant /convert/mass/ and /convert/kg-to-lbs/ started the same way.
  Required: `node Website/tools/generate-convert-pages.js` fails without
  one, so a new quantity cannot ship as a template fill.
*/
var QUANTITY_HOOKS = {
  length: "From nanometres to parsecs, every unit here is defined exactly in metres — including the imperial ones, which have been metric by definition since 1959.",
  mass: "Everything on this page is mass rather than weight, which is why a kilogram is still a kilogram on the Moon and a pound-force is somewhere else entirely.",
  temperature: "The only conversion in this collection that is not a multiplication: the scales disagree about where zero is, as well as how big a degree is.",
  volume: "The page where naming matters most. US and imperial pints, gallons, quarts and fluid ounces share names and do not share sizes.",
  area: "Land in acres and hectares, floors in square feet and square metres — and the acre's odd 4046.86 m² is a chain by a furlong.",
  speed: "Road signs, weather forecasts and physics all measure the same thing in different units; the knot is the one defined for navigation rather than derived.",
  time: "Seconds through to years, with the caveat that months and years are not fixed durations — the year here is the Julian one used in astronomy.",
  pressure: "Tyres, weather, diving and vacuum work each have their own favourite unit, and the standard atmosphere is a defined constant rather than today's weather.",
  energy: "Joules, calories, kilowatt-hours and BTU all measure the same quantity — and the calorie on a food label is a thousand of the calorie in a physics book.",
  power: "Energy per second, in the three horsepowers the motor industry uses plus the watts everything is actually specified in.",
  data: "The page that explains the missing space on your drive: storage is sold in decimal gigabytes and reported by your computer in binary gibibytes.",
  angle: "Degrees for people, radians for mathematics, and the several different things that have been called a mil.",
  force: "Newtons, and the gravitational units — kilogram-force and pound-force are weights, meaning the force standard gravity exerts on that mass.",
  fuel: "Economy and consumption run in opposite directions, so converting between them is a division. The US and imperial gallons differ, so mpg does too.",
  density: "Mass per unit volume, on a scale where water is almost exactly 1 g/cm³ — which is why that unit doubles as relative density.",
  torque: "Twisting force, in newton metres and pound-feet. It shares its dimensions with energy and is never written in joules.",
  flow: "Volume per unit time, from a shower head in litres per minute to a pump in cubic metres per hour — with the gallon's system always named.",
  massflow: "Mass per unit time, the rating on industrial feed, steam and dosing equipment.",
  frequency: "Cycles per second, plus revolutions and beats per minute. Angular velocity is a different quantity and lives on its own page.",
  angularvelocity: "Rotation rate in radians per second, the ω of physics, alongside the revolutions per minute that machinery is actually labelled with.",
  acceleration: "Metres per second squared, and the g everyone quotes — standard gravity is a defined 9.806 65 m/s², not the gravity where you are standing.",
  datarate: "Broadband is sold in bits per second and downloads are measured in bytes per second. The factor of eight between them is this page's whole point.",
  charge: "Coulombs and the milliampere-hours printed on batteries. Turning mAh into watt-hours needs a voltage, so it is not a conversion and is not offered.",
  illuminance: "How much light lands on a surface, in lux and the foot-candles US lighting specifications still use.",
  radioactivity: "Decays per second. Activity is not dose — how much radiation is being emitted says nothing on its own about the harm to a person.",
  dose: "Equivalent dose, weighted for biological effect. The gray measures absorbed energy and is a different quantity, deliberately kept off this page.",
  magneticfield: "Flux density in tesla and gauss, spanning the Earth's 50 µT and an MRI scanner's 3 T.",
  viscosity: "Resistance to shear, on a scale chosen so that water at 20 °C is almost exactly 1 centipoise.",
  kinematicviscosity: "Dynamic viscosity divided by density — the centistokes that oil grades are specified in.",
  amount: "Moles are a count of entities, fixed at exactly 6.022 140 76×10²³ since the 2019 redefinition. Grams are deliberately not in these menus: converting moles to grams needs the molar mass of the particular substance, so it is a calculation rather than a conversion.",
  concentration: "Amount per unit volume. Converting to mg/dL needs the substance's molar mass, so that is a calculation rather than a unit conversion.",
  specificenergy: "Energy per unit mass, from fuels to foods to the watt-hours per kilogram a battery manages.",
  thermalconductivity: "How readily a material carries heat — mineral wool is about 0.04 W/(m·K) and copper about 400.",
  evefficiency: "How much energy a vehicle spends per unit distance. Like fuel economy, miles per kilowatt-hour runs the opposite way to watt-hours per mile."
};

module.exports = {
  UNIT_NOTES: UNIT_NOTES,
  QUANTITY_HOOKS: QUANTITY_HOOKS,
  PLURALS: PLURALS,
  PAIR_HOOKS: PAIR_HOOKS,
  TABLE_VALUES: TABLE_VALUES
};
