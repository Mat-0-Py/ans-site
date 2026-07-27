/*
  Minimal headless DOM contract tests for converter.js. The fake elements
  implement only the browser APIs used by the shared wiring.
*/
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var C = require("../assets/js/convert.js");
var pass = 0, fail = 0;

function check(ok, name, detail) {
  if (ok) { pass++; }
  else {
    fail++;
    console.error("FAIL " + name + (detail ? "\n   " + detail : ""));
  }
}

function Element(id) {
  this.id = id;
  this.value = "";
  this.textContent = "";
  this.children = [];
  this.options = this.children;
  this.selectedIndex = 0;
  this.listeners = {};
  this.classes = {};
  this.classList = {
    add: function (name) { this.owner.classes[name] = true; },
    remove: function (name) { delete this.owner.classes[name]; },
    contains: function (name) { return !!this.owner.classes[name]; },
    owner: this
  };
}
Object.defineProperty(Element.prototype, "innerHTML", {
  set: function () { this.children = []; this.options = this.children; this.value = ""; }
});
Element.prototype.appendChild = function (child) {
  this.children.push(child);
  this.options = this.children;
  if (child.selected || this.children.length === 1) {
    this.selectedIndex = this.children.length - 1;
    this.value = child.value;
  }
};
Element.prototype.addEventListener = function (name, callback) {
  this.listeners[name] = callback;
};
Element.prototype.fire = function (name) {
  if (this.listeners[name]) { this.listeners[name](); }
};

function setup(search, cfg, initial) {
  var ids = ["in-from", "in-to", "u-from", "u-to", "u-sf", "convert-swap",
    "lcd-label", "lcd-note", "lcd-main", "lcd-sub"];
  var elements = {};
  ids.forEach(function (id) { elements[id] = new Element(id); });
  elements["in-from"].value = initial === undefined ? "1" : String(initial);
  elements["u-sf"].value = "6";

  var window = { location: { search: search || "" } };
  var document = {
    getElementById: function (id) { return elements[id]; },
    createElement: function () { return { value: "", textContent: "", selected: false }; }
  };
  var context = {
    window: window,
    self: window,
    document: document,
    URLSearchParams: URLSearchParams,
    console: console,
    isFinite: isFinite,
    parseFloat: parseFloat,
    Array: Array,
    Math: Math,
    Number: Number,
    String: String
  };
  vm.createContext(context);
  // Exactly what a page loads, in the order a page loads it: the engine,
  // one quantity, then the wiring.
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, "../assets/js/convert-core.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.resolve(__dirname,
    "../assets/js/units/" + cfg.quantity + ".js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, "../assets/js/converter.js"), "utf8"), context);
  window.AnsConverter(cfg);
  return elements;
}

var mass = setup("", { quantity: "mass", from: "kg", to: "lb" }, 1);
check(mass["u-from"].options.length === C.quantity("mass").units.length,
  "unit menus are built from the registry, not written into the page");
check(Math.abs(Number(mass["in-to"].value) - 2.20462262185) < 1e-10,
  "initial conversion");
check(mass["lcd-note"].textContent === "Exact definition", "exactness shown");

mass["in-to"].value = "10";
mass["in-to"].fire("input");
check(Math.abs(Number(mass["in-from"].value) - 4.5359237) < 1e-10,
  "right-hand field becomes source");

mass["in-from"].value = "2,5";
mass["in-from"].fire("input");
check(Math.abs(Number(mass["in-to"].value) - 5.51155655462) < 1e-10,
  "comma accepted as decimal point");

mass["in-from"].value = "12abc";
mass["in-from"].fire("input");
check(mass["in-from"].classList.contains("is-invalid"), "partial numeric input rejected");
check(mass["lcd-sub"].textContent === "that is not a number", "invalid-input message");

var shared = setup("?value=5&from=cm&to=in",
  { quantity: "length", from: "m", to: "ft" }, 1);
check(shared["u-from"].value === "cm" && shared["u-to"].value === "in",
  "URL chooses units");
check(shared["in-from"].value === "5", "URL chooses value");
check(Math.abs(Number(shared["in-to"].value) - 1.96850393701) < 1e-10,
  "URL conversion computed");

var fuel = setup("", { quantity: "fuel", from: "mpg_us", to: "mpg_uk" }, 30);
check(fuel["lcd-sub"].textContent.indexOf("move in opposite directions") < 0,
  "two economy units show a ratio, not a reciprocal warning");
check(fuel["lcd-sub"].textContent.indexOf("1 mpg (US) =") === 0,
  "same-direction fuel relationship");

var beforeFrom = fuel["in-from"].value;
var beforeTo = fuel["in-to"].value;
fuel["convert-swap"].fire("click");
check(fuel["in-from"].value === beforeTo && fuel["in-to"].value === beforeFrom,
  "swap exchanges displayed values");
check(fuel["u-from"].value === "mpg_uk" && fuel["u-to"].value === "mpg_us",
  "swap exchanges units");

// The LCD sub-line must state the affine rule in the form people know, and
// must agree with the notation in the page's formula block.
var toC = setup("", { quantity: "temperature", from: "F", to: "C" }, 20);
check(toC["lcd-sub"].textContent === "°C = (°F − 32) × 5/9",
  "Fahrenheit to Celsius shows the factored form, matching the formula block",
  toC["lcd-sub"].textContent);
var toF = setup("", { quantity: "temperature", from: "C", to: "F" }, 20);
check(toF["lcd-sub"].textContent === "°F = °C × 9/5 + 32",
  "Celsius to Fahrenheit shows the expanded form", toF["lcd-sub"].textContent);
var toK = setup("", { quantity: "temperature", from: "C", to: "K" }, 20);
check(toK["lcd-sub"].textContent === "K = °C + 273.15",
  "a pure offset drops the scale factor", toK["lcd-sub"].textContent);
check(Math.abs(Number(toC["in-to"].value) + 6.66666666667) < 1e-9,
  "20 °F is −6.667 °C");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
