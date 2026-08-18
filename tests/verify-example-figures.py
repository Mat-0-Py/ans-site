#!/usr/bin/env python3
"""Every number quoted on /examples/, asserted.

Run this before publishing and after any edit to the figures. If a page says
something this script does not, one of the two is wrong.
"""
from math import atan, cos, degrees, exp, log, radians, sin, sqrt, tan

FAILURES = []


def check(label, got, want, tol=5e-3):
    ok = abs(got - want) <= tol
    print(f"{'ok ' if ok else 'FAIL'}  {label:<58} {got:>16,.4f}  (page says {want:,.4f})")
    if not ok:
        FAILURES.append(label)


def sf10(x):
    """What the calculator's 10-significant-figure display shows."""
    from decimal import Decimal
    d = Decimal(repr(x))
    exponent = d.adjusted()
    return round(x, 9 - exponent)


print("\n--- 1. Compound interest -------------------------------------------")
P, r, n = 10000.0, 0.05, 20
lump = P * (1 + r) ** n
check("1.05^20", (1.05) ** 20, 2.653297705, 1e-8)
check("£10,000 at 5% for 20 years", lump, 26532.98, 0.005)
check("  of which growth", lump - P, 16532.98, 0.005)
check("calculator display, 10 s.f.", sf10(lump), 26532.97705, 1e-5)

doubling = log(2) / log(1.05)
check("doubling time ln2/ln1.05 (years)", doubling, 14.2067, 1e-4)
check("  calculator display, 10 s.f.", sf10(doubling), 14.20669908, 1e-8)
check("rule of 72 estimate", 72 / 5, 14.4, 1e-9)

PMT = 2400.0  # £200 a month, credited annually
factor = ((1 + r) ** n - 1) / r
contrib_fv = PMT * factor
check("annuity factor ((1.05^20)-1)/0.05", factor, 33.06595410, 1e-6)
check("£2,400/yr for 20 years", contrib_fv, 79358.29, 0.005)
check("lump + contributions", lump + contrib_fv, 105891.27, 0.005)
check("  total actually paid in", P + PMT * n, 58000.0, 1e-9)
check("  so growth is", lump + contrib_fv - (P + PMT * n), 47891.27, 0.005)

for rate, want in ((0.03, 18061.11), (0.05, 26532.98), (0.07, 38696.84)):
    check(f"£10,000 for 20 years at {rate:.0%}", P * (1 + rate) ** n, want, 0.005)

area = P * ((1.05) ** 20 - 1) / log(1.05)
check("∫₀²⁰ 10000×1.05^x dx", area, 338858.81, 0.01)
check("  average balance = area / 20", area / 20, 16942.94, 0.005)
check("  0.75% annual charge on that", 0.0075 * area / 20, 127.07, 0.005)

print("\n--- 2. Speed–time graphs -------------------------------------------")
# Rung 1: 8 m/s for 3 s, then decelerating to rest at 5 s.
check("rectangle 8 × 3", 8 * 3, 24.0, 1e-9)
check("triangle ½ × 2 × 8", 0.5 * 2 * 8, 8.0, 1e-9)
check("total distance", 8 * 3 + 0.5 * 2 * 8, 32.0, 1e-9)

# Rung 2: a car with linear drag, v = vinf(1 - e^(-t/tau)).
vinf, tau = 45.0, 8.0
MPH60 = 26.8224  # 60 mph in m/s, exactly
t60 = tau * log(vinf / (vinf - MPH60))
check("0–60 mph time (s)", t60, 7.25, 5e-3)
check("terminal speed in mph", vinf / 0.44704, 100.66, 0.01)
v10 = vinf * (1 - exp(-10 / tau))
check("speed at 10 s (m/s)", v10, 32.107, 5e-4)
check("  in mph", v10 / 0.44704, 71.8, 0.05)
naive = 0.5 * v10 * 10
check("triangle if you assume uniform acceleration", naive, 160.535, 5e-3)
true_d = vinf * (10 + tau * (exp(-10 / tau) - 1))
check("true distance in 10 s (closed form)", true_d, 193.142, 5e-3)
check("  the triangle's error", true_d - naive, 32.607, 5e-3)

# Rung 3: trapezium rule by hand, 2-second strips.
vs = [vinf * (1 - exp(-t / tau)) for t in range(0, 11, 2)]
trap2 = 2 * (0.5 * (vs[0] + vs[-1]) + sum(vs[1:-1]))
check("trapezium rule, 2 s strips", trap2, 191.804, 5e-3)
check("  under-reads the true value by", true_d - trap2, 1.338, 5e-3)
vs1 = [vinf * (1 - exp(-t / tau)) for t in range(0, 11)]
check("trapezium rule, 1 s strips", 0.5 * (vs1[0] + vs1[-1]) + sum(vs1[1:-1]), 192.807, 5e-3)

# Rung 4: constant thrust, falling mass.
ve, m0, mdot, burn = 3000.0, 2000.0, 2.0, 500.0
dv = ve * log(m0 / (m0 - mdot * burn))
check("final mass after 500 s (kg)", m0 - mdot * burn, 1000.0, 1e-9)
check("Δv, rocket equation (m/s)", dv, 2079.44, 5e-3)
a_naive = ve * mdot / m0
check("naive constant acceleration (m/s²)", a_naive, 3.0, 1e-9)
check("  naive final speed (m/s)", a_naive * burn, 1500.0, 1e-9)
m_end = m0 - mdot * burn
dist = ve * (burn + (m_end / mdot) * log(m_end / m0))
check("distance in 500 s (km)", dist / 1000, 460.28, 5e-3)
check("  naive prediction (km)", 0.5 * a_naive * burn ** 2 / 1000, 375.0, 1e-9)
check("  shortfall (km)", (dist - 0.5 * a_naive * burn ** 2) / 1000, 85.28, 5e-3)

print("\n--- 3. Mortgage repayments ----------------------------------------")
Pm, annual, months = 200000.0, 0.045, 300
i = annual / 12
growth = (1 + i) ** months
M = Pm * i * growth / (growth - 1)
check("monthly rate i", i, 0.00375, 1e-12)
check("1.00375^300", growth, 3.073742528, 1e-8)
check("monthly payment, 25 years (£)", M, 1111.66, 0.005)
check("  total paid", M * months, 333499.49, 0.01)
check("  interest", M * months - Pm, 133499.49, 0.01)


def balance(x, payment, rate=i, principal=Pm):
    return principal * (1 + rate) ** x - payment * ((1 + rate) ** x - 1) / rate


check("balance after 10 years (£)", balance(120, M), 145316.96, 0.01)
check("  fraction of the debt cleared", 1 - balance(120, M) / Pm, 0.2734, 5e-4)
check("balance at month 300", balance(300, M), 0.0, 0.02)

months30 = 360
g30 = (1 + i) ** months30
M30 = Pm * i * g30 / (g30 - 1)
check("monthly payment, 30 years (£)", M30, 1013.37, 0.005)
check("  monthly saving", M - M30, 98.29, 0.005)
check("  total interest", M30 * months30 - Pm, 164813.42, 0.01)
check("  extra interest for 5 more years", (M30 * months30) - (M * months), 31313.93, 0.01)

print("\n--- Published tables --------------------------------------------")
# Compound interest, "The figures, year by year".
for year, lump_want, both_want in ((5, 12762.82, 26024.33), (10, 16288.95, 46475.89),
                                   (15, 20789.28, 72577.83), (20, 26532.98, 105891.27)):
    grown = P * 1.05 ** year
    check(f"year {year} lump only", grown, lump_want, 0.005)
    check(f"year {year} with £2,400/yr", grown + PMT * ((1.05 ** year) - 1) / 0.05, both_want, 0.005)
check("first decade adds", P * 1.05 ** 10 - P, 6288.95, 0.005)
check("second decade adds", P * 1.05 ** 20 - P * 1.05 ** 10, 10244.03, 0.005)
check("£26,532.98 in today's money at 2.5%", lump / 1.025 ** 20, 16192.53, 0.5)

# Speed–time, "The car, second by second". Distance is the closed form.
for t, v_want, mph_want, s_want in ((2, 9.954, 22.3, 10.37), (4, 17.706, 39.6, 38.35),
                                    (6, 23.744, 53.1, 80.05), (8, 28.445, 63.6, 132.44),
                                    (10, 32.107, 71.8, 193.14)):
    v = vinf * (1 - exp(-t / tau))
    check(f"car v({t} s)", v, v_want, 5e-3)
    check(f"  in mph", v / 0.44704, mph_want, 0.05)
    check(f"  distance by {t} s", vinf * (t + tau * (exp(-t / tau) - 1)), s_want, 5e-3)

# The trapezium readout shows what the *typed* expression evaluates to, not
# the full-precision sum: the page prints the rounded speeds it asks you to
# type, so the display must match those.
typed = 2 * (0.5 * (0 + 32.107284) + 9.954 + 17.7061 + 23.7435 + 28.4454)
check("trapezium as typed on the page", typed, 191.805284, 5e-6)

# Mortgage, "The balance, five years at a time" — using the rounded £1,111.66
# a real payer would pay, which is also what the plotted expression uses.
ROUNDED = 1111.66
for month, want, cleared in ((60, 175716.14, 12), (120, 145317.70, 27),
                             (180, 107265.07, 46), (240, 59630.94, 70), (300, 2.74, 100)):
    got = balance(month, ROUNDED)
    check(f"balance at month {month}", got, want, 0.01)
    check(f"  percent cleared", round(100 * (1 - got / Pm)), cleared, 0.51)
check("paid by month 120", 120 * ROUNDED, 133399.20, 0.01)

print("\n--- 4. Carbon dating ------------------------------------------------")
check("1000 counts after three half-lives", 1000 * 0.5 ** 3, 125.0, 1e-9)
check("fraction left after 3 half-lives (%)", 100 * 0.5 ** 3, 12.5, 1e-9)
ten_percent = 5 * log(0.1) / log(0.5)
check("time to 10% at T½ = 5 days", ten_percent, 16.61, 5e-3)
check("  calculator display, 10 s.f.", sf10(ten_percent), 16.60964047, 1e-7)

C14, LIBBY = 5730.0, 5568.0
age = C14 * log(0.22) / log(0.5)
check("age at 22% modern carbon (yr)", age, 12516.75, 0.01)
check("  calculator display, 10 s.f.", sf10(age), 12516.75279, 1e-4)
libby = LIBBY * log(0.22) / log(0.5)
check("  same sample on the Libby half-life", libby, 12162.88, 0.01)
check("  the difference the constant makes", age - libby, 353.88, 0.01)
check("decay constant λ = ln2/5730 (per yr)", log(2) / C14, 1.2097e-4, 1e-8)
check("half-lives in 50,000 years", 50000 / C14, 8.726, 5e-4)
check("  fraction of carbon-14 left then (%)", 100 * 0.5 ** (50000 / C14), 0.236, 5e-4)

print("\n--- 5. Quadratic equations ------------------------------------------")
check("x²−5x+6 roots by factorising", 2 + 3, 5.0, 1e-9)
A, B, C = 2.0, 3.0, -7.0
disc = B * B - 4 * A * C
check("discriminant of 2x²+3x−7", disc, 65.0, 1e-9)
check("  √65", sqrt(disc), 8.062257748, 1e-8)
root_plus = (-B + sqrt(disc)) / (2 * A)
root_minus = (-B - sqrt(disc)) / (2 * A)
check("root (+)", root_plus, 1.265564437, 1e-8)
check("root (−)", root_minus, -2.765564437, 1e-8)
check("  sum of roots = −b/a", root_plus + root_minus, -1.5, 1e-9)
check("  product of roots = c/a", root_plus * root_minus, -3.5, 1e-9)

dottie = 1.0
for _ in range(100):
    dottie = cos(dottie)
check("cos pressed 100 times from 1", dottie, 0.7390851332, 1e-9)
check("  it is a fixed point: cos(x) = x", cos(dottie) - dottie, 0.0, 1e-9)

print("\n--- 6. Projectile motion --------------------------------------------")
u, theta, g = 20.0, radians(40.0), 9.81
rng = u * u * sin(2 * theta) / g
check("range, 20 m/s at 40° in a vacuum", rng, 40.155, 5e-3)
check("  calculator display, 10 s.f.", sf10(rng), 40.15526006, 1e-6)
check("maximum height", u * u * sin(theta) ** 2 / (2 * g), 8.4236, 5e-4)
check("time of flight", 2 * u * sin(theta) / g, 2.6209, 5e-4)
k = g / (2 * u * u * cos(theta) ** 2)
check("trajectory: tan 40°", tan(theta), 0.8390996312, 1e-8)
check("trajectory: g/(2u²cos²θ)", k, 0.02089638144, 1e-10)

h = 2.0
launched = (tan(theta) + sqrt(tan(theta) ** 2 + 4 * k * h)) / (2 * k)
check("range launched from 2 m up", launched, 42.412, 5e-3)
check("  further than from the ground by", launched - rng, 2.257, 5e-3)
check("  apex above the ground", h + u * u * sin(theta) ** 2 / (2 * g), 10.424, 5e-3)

best = degrees(atan(u / sqrt(u * u + 2 * g * h)))
check("best angle when launched from 2 m", best, 43.66, 5e-3)
kb = g / (2 * u * u * cos(radians(best)) ** 2)
range_best = (tan(radians(best)) + sqrt(tan(radians(best)) ** 2 + 4 * kb * h)) / (2 * kb)
check("  range at that angle", range_best, 42.728, 5e-3)
k45 = g / (2 * u * u * cos(radians(45)) ** 2)
range45 = (tan(radians(45)) + sqrt(tan(radians(45)) ** 2 + 4 * k45 * h)) / (2 * k45)
check("  range at the textbook 45°", range45, 42.685, 5e-3)
check("  what the optimum is worth over 45°", range_best - range45, 0.043, 5e-3)

print("\n--- Additions from the 18 August review -----------------------------")
i_m = 0.05 / 12
monthly = 200 * (((1 + i_m) ** 240) - 1) / i_m
check("£200 a month for 20 years at 5%", monthly, 82206.73, 0.005)
check("  more than crediting £2,400 yearly", monthly - contrib_fv, 2848.44, 0.005)
check("tan 40° (trajectory coefficient)", tan(radians(40)), 0.8390996312, 1e-9)
check("9.81/(2×20²×cos²40°)", 9.81 / (2 * 400 * cos(radians(40)) ** 2), 0.02089638144, 1e-10)

# Carbon dating sensitivity table.
for frac, age_want, swing_want in ((0.50, 5730, 165), (0.22, 12517, 376),
                                   (0.10, 19035, 829), (0.05, 24765, 1676)):
    age = C14 * log(frac) / log(0.5)
    swing = abs(C14 * log(frac - 0.01) / log(0.5) - C14 * log(frac + 0.01) / log(0.5)) / 2
    check(f"age at {frac:.0%} left", age, age_want, 0.6)
    check(f"  ±1 pp is worth", swing, swing_want, 0.6)

print()
if FAILURES:
    raise SystemExit(f"{len(FAILURES)} figure(s) disagree: " + ", ".join(FAILURES))
print("All figures agree with the pages.")
