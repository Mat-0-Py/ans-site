/*
  AnsConverter — shared page wiring for every converter page
  (Website-Private-Docs/CONVERT-DESIGN.md, interaction convention).

  One implementation so every converter behaves identically, and so a new
  page is one line of configuration rather than a copy of the last one.
  Depends on AnsConvert.

  Page contract (ids):
    #in-from  #u-from   the source value and its unit menu
    #in-to    #u-to     the target value and its unit menu
    #u-sf               display-precision <select> (3–10 s.f.)
    #convert-swap       optional swap button
    #lcd-label #lcd-note #lcd-main #lcd-sub   the shared LCD nodes

  The unit menus are BUILT FROM THE REGISTRY, not written into the page:
  a page states its quantity and its default pair, and cannot drift from
  the units the engine actually knows.

      AnsConverter({ quantity: "mass", from: "kg", to: "lb" });

  Interaction convention: both boxes are live and bidirectional. Type in
  either one and the other follows — there is no "convert" button, no
  swap-to-reverse dance, and no blank-the-unknown rule (that convention
  belongs to the science solvers, where the maths has an unknown; a
  conversion has none). The last box you typed in is the source, and the
  LCD always shows the OTHER one.

  ?value=5&from=cm&to=in on the URL preselects a conversion, so a link can
  point at a specific answer.
*/
(function () {
  "use strict";

  function el(id) { return document.getElementById(id); }

  window.AnsConverter = function (cfg) {
    var C = window.AnsConvert;
    var q = C.quantity(cfg.quantity);
    if (!q) { return; }

    var inFrom = el("in-from"), inTo = el("in-to");
    var uFrom = el("u-from"), uTo = el("u-to");
    var sfSel = el("u-sf"), swap = el("convert-swap");
    var lcdLabel = el("lcd-label"), lcdNote = el("lcd-note");
    var lcdMain = el("lcd-main"), lcdSub = el("lcd-sub");
    var source = "from";                       // which box the user last typed in

    function fill(select, selectedId) {
      select.innerHTML = "";
      q.units.forEach(function (u) {
        var option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.symbol + " — " + u.name;
        if (u.id === selectedId) { option.selected = true; }
        select.appendChild(option);
      });
    }

    // ?value=&from=&to= — a shareable link to one conversion.
    var params = new URLSearchParams(window.location.search);
    var startFrom = q.byId[params.get("from")] ? params.get("from") : cfg.from;
    var startTo = q.byId[params.get("to")] ? params.get("to") : cfg.to;
    fill(uFrom, startFrom);
    fill(uTo, startTo);
    if (params.get("value") && isFinite(parseFloat(params.get("value")))) {
      inFrom.value = params.get("value");
    } else if (inFrom.value === "") {
      inFrom.value = cfg.value === undefined ? "1" : String(cfg.value);
    }

    function sf() { return parseInt(sfSel.value, 10) || 6; }

    // The line under the answer: the relationship itself, not just the
    // number. Affine and reciprocal quantities get their real rule.
    function relationship(from, to) {
      // A compound has no single "1 x = y" line — the useful second reading
      // is the same answer as a decimal, which is what it was before the
      // whole and the remainder were split apart.
      if (C.isCompound(to)) {
        var decimal = C.convert(C.parseValue(
          (source === "from" ? inFrom : inTo).value, from) || 0, q.id, from.id, to.id);
        return "= " + C.format(decimal, sf()) + " " +
          q.byId[to.compound[0]].symbol + " as a decimal";
      }
      if (C.isCompound(from)) {
        return from.symbol + " accepts whole " + q.byId[from.compound[0]].symbol +
          " plus " + q.byId[from.compound[1]].symbol + " — type \"5 ft 9 in\" or \"5 9\"";
      }
      if (q.reciprocal) {
        if (!!from.inverse === !!to.inverse) {
          return "1 " + from.symbol + " = " +
            C.format(C.convert(1, q.id, from.id, to.id), sf()) + " " + to.symbol;
        }
        return "reciprocal · " + from.symbol + " and " + to.symbol +
          " move in opposite directions";
      }
      if (q.affine) {
        var scale = from.factor / to.factor;
        var shift = ((from.offset || 0) - (to.offset || 0)) / to.factor;
        // The formula block below the display stacks these as real
        // fractions, so name them the same way here. A page that says
        // "× 5/9" in one place and "× 0.555556" in another looks like two
        // different pages.
        var scaleText = Math.abs(scale - 5 / 9) < 1e-12 ? "5/9"
          : Math.abs(scale - 9 / 5) < 1e-12 ? "9/5"
            : C.format(scale, 6);
        if (Math.abs(shift) < 1e-12) {
          return to.symbol + " = " + from.symbol +
            (Math.abs(scale - 1) < 1e-12 ? "" : " × " + scaleText);
        }
        // °C = (°F − 32) × 5/9 is the form everybody knows, and it is the
        // one with the round number in it. Prefer it whenever factoring the
        // shift out lands on a whole number; otherwise state the expansion.
        var inner = shift / scale;
        if (Math.abs(inner - Math.round(inner)) < 1e-9 &&
            Math.abs(shift - Math.round(shift)) > 1e-9) {
          return to.symbol + " = (" + from.symbol + (inner < 0 ? " − " : " + ") +
            C.format(Math.abs(inner), 6) + ") × " + scaleText;
        }
        return to.symbol + " = " + from.symbol +
          (Math.abs(scale - 1) < 1e-12 ? "" : " × " + scaleText) +
          (shift < 0 ? " − " : " + ") + C.format(Math.abs(shift), 6);
      }
      var r = C.ratio(q.id, from.id, to.id);
      return "1 " + from.symbol + " = " + C.format(r, sf()) + " " + to.symbol;
    }

    function compute() {
      var src = source === "from" ? inFrom : inTo;
      var dst = source === "from" ? inTo : inFrom;
      var srcUnit = q.byId[(source === "from" ? uFrom : uTo).value];
      var dstUnit = q.byId[(source === "from" ? uTo : uFrom).value];

      src.classList.remove("is-invalid");
      dst.classList.remove("is-invalid");

      var raw = src.value.trim();
      if (raw === "") {
        dst.value = "";
        lcdLabel.textContent = q.name;
        lcdNote.textContent = "";
        lcdMain.textContent = "—";
        lcdSub.textContent = "enter a value in either box";
        C.fitDisplay(lcdMain);
        return;
      }

      // One entry point for both kinds of unit: a plain number, or a
      // compound like "5 ft 9 in" when the chosen unit is one.
      var value = C.parseValue(raw, srcUnit);
      if (value === null) {
        src.classList.add("is-invalid");
        dst.value = "";
        lcdMain.textContent = "—";
        lcdSub.textContent = C.isCompound(srcUnit)
          ? "try something like 5 ft 9 in"
          : "that is not a number";
        C.fitDisplay(lcdMain);
        return;
      }

      var out = C.convert(value, q.id, srcUnit.id, dstUnit.id);
      // The field gets something re-editable — a plain number, or the
      // compound's own text. Only the LCD gets instrument formatting.
      dst.value = C.editable(out, dstUnit, 12);
      lcdLabel.textContent = srcUnit.symbol + " → " + dstUnit.symbol;
      lcdNote.textContent = C.isExact(q.id, srcUnit.id, dstUnit.id) ? "Exact definition" : "Conventional value";
      lcdMain.textContent = C.isCompound(dstUnit)
        ? C.formatValue(out, dstUnit, sf())
        : C.format(out, sf()) + " " + dstUnit.symbol;
      lcdSub.textContent = relationship(srcUnit, dstUnit);
      C.fitDisplay(lcdMain);
    }

    inFrom.addEventListener("input", function () { source = "from"; compute(); });
    inTo.addEventListener("input", function () { source = "to"; compute(); });
    uFrom.addEventListener("change", compute);
    uTo.addEventListener("change", compute);
    sfSel.addEventListener("change", compute);

    if (swap) {
      swap.addEventListener("click", function () {
        var a = uFrom.value;
        uFrom.value = uTo.value;
        uTo.value = a;
        // Keep the number the user is looking at on the side they typed in.
        var v = inFrom.value;
        inFrom.value = inTo.value;
        inTo.value = v;
        source = source === "from" ? "to" : "from";
        compute();
      });
    }

    compute();
  };
})();
