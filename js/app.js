/* Trivia Generator Pro — state + UI */
(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const STORE_KEY = "tgp_state_v1";

  /* ---------- state ---------- */

  const blankQ = () => ({ q: "", a: "" });
  const blankRound = (name, n) => ({
    name: name || "",
    type: "standard",
    points: 10,
    open: true,
    questions: Array.from({ length: n || 10 }, blankQ)
  });

  const DEFAULT_STATE = () => ({
    game: { title: "", subtitle: "", date: "", host: "" },
    branding: {
      org: "Fat City Entertainment",
      tagline: "Games • Trivia • Music Bingo",
      website: "www.fatcityentertainment.com",
      accent: "#d94f4f",
      font: "helvetica",
      logo: null, logoW: 0, logoH: 0,
      credit: false
    },
    options: { pageSize: "letter", showPoints: true, halfSheets: false, teams: 12, tiebreaker: true },
    tiebreaker: { q: "", a: "" },
    rounds: [blankRound("", 10)]
  });

  let state = DEFAULT_STATE();

  /* ---------- persistence ---------- */

  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
      } catch (e) {
        /* quota — retry without the logo image */
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify({ ...state, branding: { ...state.branding, logo: null } }));
        } catch (e2) { /* give up quietly */ }
      }
    }, 400);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      adoptState(JSON.parse(raw));
    } catch (e) { /* corrupted save — start fresh */ }
  }

  function adoptState(obj) {
    const d = DEFAULT_STATE();
    state = {
      game: { ...d.game, ...(obj.game || {}) },
      branding: { ...d.branding, ...(obj.branding || {}) },
      options: { ...d.options, ...(obj.options || {}) },
      tiebreaker: { ...d.tiebreaker, ...(obj.tiebreaker || {}) },
      rounds: Array.isArray(obj.rounds) && obj.rounds.length
        ? obj.rounds.map(r => ({
            name: r.name || "",
            type: ["standard", "double", "wager"].includes(r.type) ? r.type : "standard",
            points: Number(r.points) || 10,
            open: r.open !== false,
            questions: Array.isArray(r.questions) && r.questions.length
              ? r.questions.map(q => ({ q: String(q.q || ""), a: String(q.a || "") }))
              : [blankQ()]
          }))
        : d.rounds
    };
  }

  /* ---------- small utils ---------- */

  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function toast(msg, ms) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, ms || 2600);
  }

  const shuffled = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  function slug() {
    return (state.game.title || "trivia-game").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "trivia-game";
  }

  function autosize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight + 2, 200) + "px";
  }

  /* ---------- settings bindings ---------- */

  const BINDINGS = [
    ["#g-title",   () => state.game.title,        v => state.game.title = v],
    ["#g-subtitle",() => state.game.subtitle,     v => state.game.subtitle = v],
    ["#g-date",    () => state.game.date,         v => state.game.date = v],
    ["#g-host",    () => state.game.host,         v => state.game.host = v],
    ["#b-org",     () => state.branding.org,      v => state.branding.org = v],
    ["#b-tagline", () => state.branding.tagline,  v => state.branding.tagline = v],
    ["#b-website", () => state.branding.website,  v => state.branding.website = v],
    ["#b-accent",  () => state.branding.accent,   v => { state.branding.accent = v; $("#accent-code").textContent = v; }],
    ["#b-font",    () => state.branding.font,     v => state.branding.font = v],
    ["#o-pagesize",() => state.options.pageSize,  v => state.options.pageSize = v],
    ["#o-teams",   () => state.options.teams,     v => state.options.teams = Number(v) || 12],
    ["#tb-q",      () => state.tiebreaker.q,      v => state.tiebreaker.q = v],
    ["#tb-a",      () => state.tiebreaker.a,      v => state.tiebreaker.a = v]
  ];
  const CHECKS = [
    ["#b-credit", () => state.branding.credit,    v => state.branding.credit = v],
    ["#o-points", () => state.options.showPoints, v => state.options.showPoints = v],
    ["#o-half",   () => state.options.halfSheets, v => state.options.halfSheets = v],
    ["#o-tb",     () => state.options.tiebreaker, v => { state.options.tiebreaker = v; syncTbVisibility(); }]
  ];

  function bindSettings() {
    BINDINGS.forEach(([sel, , set]) => {
      $(sel).addEventListener("input", e => { set(e.target.value); save(); });
    });
    CHECKS.forEach(([sel, , set]) => {
      $(sel).addEventListener("change", e => { set(e.target.checked); save(); });
    });
  }

  function applyControls() {
    BINDINGS.forEach(([sel, get]) => { $(sel).value = get(); });
    CHECKS.forEach(([sel, get]) => { $(sel).checked = !!get(); });
    $("#accent-code").textContent = state.branding.accent;
    syncTbVisibility();
    syncLogoPreview();
  }

  function syncTbVisibility() {
    $("#tb-fields").classList.toggle("off", !state.options.tiebreaker);
  }

  /* ---------- logo ---------- */

  function syncLogoPreview() {
    const box = $("#logo-preview");
    if (state.branding.logo) {
      box.classList.remove("empty");
      box.style.backgroundImage = "url(" + state.branding.logo + ")";
      box.textContent = "";
      $("#btn-logo-clear").hidden = false;
    } else {
      box.classList.add("empty");
      box.style.backgroundImage = "";
      box.textContent = "No logo";
      $("#btn-logo-clear").hidden = true;
    }
  }

  function bindLogo() {
    $("#btn-logo").addEventListener("click", () => $("#logo-file").click());
    $("#btn-logo-clear").addEventListener("click", () => {
      state.branding.logo = null;
      state.branding.logoW = state.branding.logoH = 0;
      syncLogoPreview(); save();
    });
    $("#logo-file").addEventListener("change", e => {
      const file = e.target.files[0];
      e.target.value = "";
      if (!file) return;
      if (!/^image\/(png|jpe?g)$/.test(file.type)) {
        toast("Please use a PNG or JPG image."); return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast("Logo is too large — keep it under 4 MB."); return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          state.branding.logo = reader.result;
          state.branding.logoW = img.naturalWidth;
          state.branding.logoH = img.naturalHeight;
          syncLogoPreview(); save();
          toast("Logo added — it will appear on every PDF.");
        };
        img.onerror = () => toast("Couldn't read that image file.");
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- rounds rendering ---------- */

  function qRowHtml(q, qi) {
    return '<div class="q-row">' +
      '<span class="q-num">' + (qi + 1) + '</span>' +
      '<textarea rows="1" data-field="q" data-q="' + qi + '" placeholder="Question…">' + esc(q.q) + '</textarea>' +
      '<textarea rows="1" data-field="a" data-q="' + qi + '" placeholder="Answer">' + esc(q.a) + '</textarea>' +
      '<span class="q-acts">' +
      '<button class="btn btn-icon" data-act="qup" data-q="' + qi + '" title="Move up">↑</button>' +
      '<button class="btn btn-icon" data-act="qdel" data-q="' + qi + '" title="Delete question">✕</button>' +
      '</span></div>';
  }

  function roundHtml(r, i) {
    const cats = Object.keys(TGP_SAMPLES)
      .map(cat => '<option value="' + esc(cat) + '">' + esc(cat) + "</option>").join("");
    return '<div class="round' + (r.open ? "" : " closed") + '" data-r="' + i + '">' +
      '<div class="round-head">' +
        '<div class="round-num">' + (i + 1) + "</div>" +
        '<input type="text" class="r-name" data-field="name" placeholder="Round category (e.g. Music)" maxlength="50" value="' + esc(r.name) + '">' +
        '<select class="r-type" data-field="type">' +
          '<option value="standard"' + (r.type === "standard" ? " selected" : "") + ">Standard</option>" +
          '<option value="double"' + (r.type === "double" ? " selected" : "") + ">Double Points</option>" +
          '<option value="wager"' + (r.type === "wager" ? " selected" : "") + ">Wager Round</option>" +
        "</select>" +
        '<span class="pts-wrap">pts/q <input type="number" class="r-pts" data-field="points" min="1" max="999" value="' + esc(r.points) + '"></span>' +
        '<div class="round-tools">' +
          '<button class="btn btn-icon" data-act="shuffle" title="Shuffle question order">🔀</button>' +
          '<button class="btn btn-icon" data-act="dup" title="Duplicate round">⧉</button>' +
          '<button class="btn btn-icon" data-act="up" title="Move round up">↑</button>' +
          '<button class="btn btn-icon" data-act="down" title="Move round down">↓</button>' +
          '<button class="btn btn-icon" data-act="del" title="Delete round">✕</button>' +
          '<button class="btn btn-icon" data-act="toggle" title="Collapse / expand">' + (r.open ? "▾" : "▸") + "</button>" +
        "</div>" +
      "</div>" +
      '<div class="round-body">' +
        r.questions.map(qRowHtml).join("") +
        '<div class="round-foot">' +
          '<button class="btn btn-small" data-act="addq">+ Add Question</button>' +
          '<span class="spacer"></span>' +
          '<select class="fill-cat" title="Sample category">' + cats + "</select>" +
          '<button class="btn btn-small" data-act="fill" title="Append 10 ready-made questions">+ 10 Samples</button>' +
        "</div>" +
      "</div></div>";
  }

  function renderRounds() {
    const box = $("#rounds");
    if (!state.rounds.length) {
      box.innerHTML = '<div class="empty-state"><p>No rounds yet.</p>' +
        '<button class="btn btn-accent" id="empty-add">+ Add Your First Round</button></div>';
      $("#empty-add").addEventListener("click", () => { addRound(); });
    } else {
      box.innerHTML = state.rounds.map(roundHtml).join("");
      box.querySelectorAll("textarea").forEach(autosize);
    }
    updateStats();
  }

  function updateStats() {
    const a = TGP_PDF.audit(state);
    let pts = 0, hasWager = false;
    TGPClean().forEach(r => {
      if (r.type === "wager") hasWager = true;
      else pts += r.questions.length * (r.type === "double" ? r.points * 2 : r.points);
    });
    $("#stats").innerHTML =
      "<b>" + a.rounds + "</b> round" + (a.rounds === 1 ? "" : "s") +
      " &nbsp;•&nbsp; <b>" + a.questions + "</b> question" + (a.questions === 1 ? "" : "s") +
      (state.options.showPoints ? " &nbsp;•&nbsp; <b>" + pts + "</b> pts" + (hasWager ? " + wagers" : "") : "");
  }

  /* mirror of pdfgen's cleaner, for the stats line */
  function TGPClean() {
    return state.rounds
      .map(r => ({
        type: r.type, points: Math.max(1, Number(r.points) || 10),
        questions: r.questions.filter(q => (q.q || "").trim() || (q.a || "").trim())
      }))
      .filter(r => r.questions.length);
  }

  /* ---------- rounds events (delegated) ---------- */

  function addRound() {
    state.rounds.push(blankRound("", 10));
    renderRounds(); save();
  }

  function bindRounds() {
    const box = $("#rounds");

    box.addEventListener("input", e => {
      const el = e.target;
      const roundEl = el.closest(".round");
      if (!roundEl) return;
      const r = state.rounds[Number(roundEl.dataset.r)];
      if (!r) return;
      const f = el.dataset.field;
      if (f === "q" || f === "a") {
        const q = r.questions[Number(el.dataset.q)];
        if (q) q[f] = el.value;
        autosize(el);
      } else if (f === "name") r.name = el.value;
      else if (f === "points") r.points = Math.max(1, Number(el.value) || 10);
      updateStats(); save();
    });

    box.addEventListener("change", e => {
      const el = e.target;
      if (el.dataset.field !== "type") return;
      const roundEl = el.closest(".round");
      const r = state.rounds[Number(roundEl.dataset.r)];
      if (r) { r.type = el.value; updateStats(); save(); }
    });

    box.addEventListener("click", e => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const roundEl = btn.closest(".round");
      if (!roundEl) return;
      const i = Number(roundEl.dataset.r);
      const r = state.rounds[i];
      if (!r) return;
      const act = btn.dataset.act;

      if (act === "toggle") { r.open = !r.open; }
      else if (act === "up" && i > 0) { state.rounds.splice(i - 1, 0, state.rounds.splice(i, 1)[0]); }
      else if (act === "down" && i < state.rounds.length - 1) { state.rounds.splice(i + 1, 0, state.rounds.splice(i, 1)[0]); }
      else if (act === "del") {
        const filled = r.questions.filter(q => q.q.trim() || q.a.trim()).length;
        if (filled && !confirm("Delete Round " + (i + 1) + " and its " + filled + " question(s)?")) return;
        state.rounds.splice(i, 1);
      }
      else if (act === "dup") {
        state.rounds.splice(i + 1, 0, JSON.parse(JSON.stringify({ ...r, name: r.name ? r.name + " (copy)" : "" })));
      }
      else if (act === "shuffle") { r.questions = shuffled(r.questions); toast("Round " + (i + 1) + " shuffled."); }
      else if (act === "addq") { r.questions.push(blankQ()); r.open = true; }
      else if (act === "fill") {
        const cat = roundEl.querySelector(".fill-cat").value;
        const pool = TGP_SAMPLES[cat] || [];
        const have = new Set(r.questions.map(q => q.q.trim()).filter(Boolean));
        const fresh = shuffled(pool.filter(([q]) => !have.has(q))).slice(0, 10)
          .map(([q, a]) => ({ q, a }));
        if (!fresh.length) { toast("No more unused " + cat + " samples for this round."); return; }
        /* fill empty rows first, then append */
        let fi = 0;
        r.questions.forEach(q => {
          if (fi < fresh.length && !q.q.trim() && !q.a.trim()) {
            q.q = fresh[fi].q; q.a = fresh[fi].a; fi++;
          }
        });
        while (fi < fresh.length) r.questions.push(fresh[fi++]);
        if (!r.name.trim()) r.name = cat;
        r.open = true;
        toast("Added " + fresh.length + " " + cat + " questions.");
      }
      else if (act === "qup" || act === "qdel") {
        const qi = Number(btn.dataset.q);
        if (act === "qup" && qi > 0) {
          r.questions.splice(qi - 1, 0, r.questions.splice(qi, 1)[0]);
        } else if (act === "qdel") {
          const q = r.questions[qi];
          if ((q.q.trim() || q.a.trim()) && !confirm("Delete question " + (qi + 1) + "?")) return;
          r.questions.splice(qi, 1);
          if (!r.questions.length) r.questions.push(blankQ());
        } else return;
      }
      else return;

      renderRounds(); save();
    });

    $("#btn-add-round").addEventListener("click", addRound);
  }

  /* ---------- PDF generation ---------- */

  const DOC_META = {
    host:      { fn: s => TGP_PDF.host(s),      file: "host-packet" },
    questions: { fn: s => TGP_PDF.questions(s), file: "question-packet" },
    sheets:    { fn: s => TGP_PDF.sheets(s),    file: "answer-sheets" },
    scores:    { fn: s => TGP_PDF.scores(s),    file: "score-sheet" }
  };

  function makeDoc(kind, quiet) {
    const a = TGP_PDF.audit(state);
    if (!a.rounds) {
      toast("Write (or sample-fill) at least one question first.");
      return null;
    }
    if (!quiet && kind === "host" && a.missingAnswers &&
        !confirm(a.missingAnswers + " question(s) have no answer yet — they'll show a blank. Generate anyway?")) {
      return null;
    }
    try {
      return DOC_META[kind].fn(state);
    } catch (err) {
      console.error(err);
      toast("PDF generation failed: " + err.message);
      return null;
    }
  }

  function bindDownloads() {
    document.querySelectorAll("[data-download]").forEach(btn => {
      btn.addEventListener("click", () => {
        const kind = btn.dataset.download;
        const doc = makeDoc(kind);
        if (!doc) return;
        doc.save(slug() + "-" + DOC_META[kind].file + ".pdf");
        toast("Downloaded " + DOC_META[kind].file.replace(/-/g, " ") + ".");
      });
    });
    document.querySelectorAll("[data-preview]").forEach(btn => {
      btn.addEventListener("click", () => {
        const doc = makeDoc(btn.dataset.preview);
        if (!doc) return;
        const win = window.open(doc.output("bloburl"), "_blank");
        if (!win) toast("Pop-up blocked — allow pop-ups to preview.");
      });
    });
    $("#btn-all").addEventListener("click", () => {
      const a = TGP_PDF.audit(state);
      if (!a.rounds) { toast("Write (or sample-fill) at least one question first."); return; }
      if (a.missingAnswers &&
          !confirm(a.missingAnswers + " question(s) have no answer yet. Download the kit anyway?")) return;
      const kinds = Object.keys(DOC_META);
      kinds.forEach((kind, i) => {
        setTimeout(() => {
          const doc = makeDoc(kind, true);
          if (doc) doc.save(slug() + "-" + DOC_META[kind].file + ".pdf");
        }, i * 500);
      });
      toast("Downloading all 4 PDFs — your browser may ask permission for multiple files.");
    });
  }

  /* ---------- toolbar: sample game, save/open, reset ---------- */

  function hasContent() {
    return state.rounds.some(r => r.questions.some(q => q.q.trim() || q.a.trim()));
  }

  function loadSampleGame() {
    if (hasContent() && !confirm("Replace your current game with the sample game?")) return;
    const picks = ["General Knowledge", "Music", "Movies & TV"];
    state.game.title = "Thursday Night Trivia";
    state.game.subtitle = "Live Pub Trivia";
    state.game.date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    state.rounds = picks.map(cat => ({
      name: cat, type: "standard", points: 10, open: true,
      questions: shuffled(TGP_SAMPLES[cat]).slice(0, 10).map(([q, a]) => ({ q, a }))
    }));
    state.rounds[2].type = "double";
    const tb = TGP_TIEBREAKERS[Math.floor(Math.random() * TGP_TIEBREAKERS.length)];
    state.options.tiebreaker = true;
    state.tiebreaker = { q: tb[0], a: tb[1] };
    applyControls(); renderRounds(); save();
    toast("Sample game loaded — 3 rounds, 30 questions, tiebreaker. Try a PDF!");
  }

  function bindToolbar() {
    $("#btn-sample").addEventListener("click", loadSampleGame);

    $("#btn-export").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = slug() + ".tgp.json";
      a.click();
      URL.revokeObjectURL(a.href);
      toast("Game file saved — reload it anytime with Open Game File.");
    });

    $("#btn-import").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", e => {
      const file = e.target.files[0];
      e.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          if (!obj || !Array.isArray(obj.rounds)) throw new Error("not a game file");
          adoptState(obj);
          applyControls(); renderRounds(); save();
          toast("Game loaded: " + (state.game.title || "untitled") + ".");
        } catch (err) {
          toast("That doesn't look like a Trivia Generator Pro game file.");
        }
      };
      reader.readAsText(file);
    });

    $("#btn-reset").addEventListener("click", () => {
      if (!confirm("Reset everything? This clears the whole game (branding too).")) return;
      localStorage.removeItem(STORE_KEY);
      state = DEFAULT_STATE();
      applyControls(); renderRounds(); save();
      toast("Fresh start.");
    });

    /* collapsible settings cards */
    document.querySelectorAll(".card[data-collapse] .card-title").forEach(h => {
      h.addEventListener("click", () => h.parentElement.classList.toggle("closed"));
    });
  }

  /* ---------- init ---------- */

  load();
  applyControls();
  renderRounds();
  bindSettings();
  bindLogo();
  bindRounds();
  bindDownloads();
  bindToolbar();
})();
