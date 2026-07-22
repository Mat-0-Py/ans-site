/*
  AnsSolve — shared "leave the unknown blank" wiring for the GCSE/A-level
  rearrangement pages (Website-Private-Docs/PHYSICS-DESIGN.md, interaction
  convention). One
  implementation so every page behaves identically: type the values you
  know, leave the one you want blank, and it appears on the LCD. No
  "Solve for" menu, no placeholder hints. Depends on AnsPhysics.

  Page contract (ids): a #u-sf display-precision <select>, per quantity an #in-<key>
  input and #u-<key> unit <select>, and LCD nodes #lcd-label / #lcd-main /
  #lcd-sub. Optional extras render into #out-<key>.

  cfg = {
    keys:   ['F','m','a'],            // display keys, matching the ids
    map:    { F:'F', m:'m', a:'a' },  // display key -> solver key
    labels: { F:'Force F', ... },     // shown on the LCD indicator
    solve:  AnsPhysics.gcse.fma,      // (obj in SI, one null) -> full set SI
    sub:    'F = m × a',              // LCD sub-line when solved
    extras: [ { key:'P', srckey:'P', unit:'W', factor:1 } ]
  }
*/
(function () {
  "use strict";
  function el(id) { return document.getElementById(id); }
  function fac(sel) { return parseFloat(sel.value); }
  function unit(sel) { return sel.options[sel.selectedIndex].text; }

  window.AnsSolve = function (cfg) {
    var P = window.AnsPhysics;
    var sfSel = el("u-sf");
    var lcdLabel = el("lcd-label"), lcdMain = el("lcd-main"), lcdSub = el("lcd-sub");
    var F = {};
    cfg.keys.forEach(function (k) { F[k] = { in: el("in-" + k), u: el("u-" + k) }; });

    function clearExtras() {
      (cfg.extras || []).forEach(function (x) {
        var e = el("out-" + x.key); if (e) { e.textContent = "—"; }
      });
    }

    function compute() {
      var o = {}, blanks = [];
      cfg.keys.forEach(function (k) {
        var raw = F[k].in.value.trim().replace(",", ".");
        F[k].in.classList.remove("is-invalid");
        if (raw === "") { blanks.push(k); o[cfg.map[k]] = null; return; }
        var v = parseFloat(raw);
        if (!isFinite(v)) { F[k].in.classList.add("is-invalid"); blanks.push(k); o[cfg.map[k]] = null; return; }
        o[cfg.map[k]] = v * fac(F[k].u);
      });

      cfg.keys.forEach(function (k) {
        F[k].in.classList.toggle("is-result", blanks.length === 1 && blanks[0] === k);
      });

      if (blanks.length !== 1) {
        lcdLabel.textContent = "Result";
        lcdMain.textContent = "—";
        P.fitDisplay(lcdMain);
        lcdSub.textContent = blanks.length === 0
          ? "leave the value you want blank"
          : "fill in all but one value";
        clearExtras();
        return;
      }

      var s = blanks[0];
      var res = cfg.solve(o);
      var sf = parseInt(sfSel.value, 10) || 3;
      lcdLabel.textContent = cfg.labels[s];
      lcdMain.textContent = P.format(res[cfg.map[s]] / fac(F[s].u), sf) + " " + unit(F[s].u);
      P.fitDisplay(lcdMain);
      lcdSub.textContent = cfg.sub;
      (cfg.extras || []).forEach(function (x) {
        var e = el("out-" + x.key);
        if (e) { e.textContent = P.format(res[x.srckey] / x.factor, sf) + " " + x.unit; }
      });
    }

    cfg.keys.forEach(function (k) {
      F[k].in.addEventListener("input", compute);
      F[k].u.addEventListener("change", compute);
    });
    sfSel.addEventListener("change", compute);
    compute();
  };
})();
