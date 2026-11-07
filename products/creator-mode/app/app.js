(function () {
  "use strict";
  var M = window.MISSIONS, Q = window.QUESTS, LAB = window.PROMPT_LAB, RANKS = window.RANKS, FIG = window.FIGURES;
  var COLORS = ["#3d8bff", "#ff4f4f", "#ffd23f", "#36d67a", "#ff8a2b", "#ff5fa8", "#b46bff", "#2fd3e0"];
  var LEVELS = [0, 300, 800, 1500, 2400, 3500, 4800, 6300, 8000, 9800];
  var UNIT0_COLOR = "#2fd3e0";
  var app = document.getElementById("app");

  // Big-game build steps, split over two screens. Keys: <mission>-0..4. Test steps start at 6.
  var SETUP = [
    { t: "Open Roblox Studio. Click New, then Baseplate.", fig: "new" },
    { t: "Check Claude is connected: the green light in Assistant ⋯ → Manage MCP Servers.", fig: "mcp" }
  ];
  var SEND = [
    { t: "Grown-up: send the Mega Prompt in Claude Desktop.", fig: "claude" },
    { t: "Watch Claude build it in Studio. If it asks to use a Studio tool, the grown-up clicks Allow.", fig: "allow" },
    { t: "When Claude says it's ready, press Play and try your game!", fig: "play" }
  ];
  var TEST_OFFSET = 6;

  // What each finished step unlocks in the Vault and elsewhere.
  var PACK_UNLOCK = { "Nature": "q:0d", "Obby": "m:1", "Collectibles": "m:2", "Props": "m:3", "Game Systems": "m:3", "Spooky": "m:4", "Tools": "m:4", "Pets": "m:5", "Sci-Fi": "m:6", "Buildings": "m:7" };

  // ---------- profiles + state ----------
  var PKEY = "creator-quest-profiles", OLDKEY = "creator-quest-v1";
  function blank() { return { name: "", color: COLORS[0], done: {}, quiz: {}, steps: {}, boss: {}, power: {}, lab: {}, qdone: {}, qsteps: {}, qquiz: {}, days: [], sound: true, dream: null, dreamSpun: false }; }
  function readJSON(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var profiles = readJSON(PKEY) || { list: [], current: null };
  if (!profiles.list.length) {
    var old = readJSON(OLDKEY);
    if (old && old.name) { var pid = "p" + Date.now(); profiles = { list: [{ id: pid, name: old.name, color: old.color || COLORS[0] }], current: pid }; writeJSON("creator-quest-p-" + pid, old); writeJSON(PKEY, profiles); }
  }
  var state = blank();
  function loadProfile(id) {
    state = blank();
    var saved = readJSON("creator-quest-p-" + id);
    if (saved) for (var k in saved) state[k] = saved[k];
    profiles.current = id; writeJSON(PKEY, profiles);
  }
  function save() {
    if (!profiles.current) return;
    writeJSON("creator-quest-p-" + profiles.current, state);
    profiles.list.forEach(function (p) { if (p.id === profiles.current) { p.name = state.name; p.color = state.color; } });
    writeJSON(PKEY, profiles);
  }
  if (profiles.current && profiles.list.some(function (p) { return p.id === profiles.current; })) loadProfile(profiles.current);
  else profiles.current = null;

  function count(o) { var n = 0; for (var k in o) if (o[k]) n++; return n; }
  function xpOf(s) { return count(s.quiz) * 50 + count(s.steps) * 20 + count(s.boss) * 100 + count(s.power) * 40 + count(s.done) * 250 + count(s.lab) * 30 + count(s.qsteps) * 20 + count(s.qquiz) * 50 + count(s.qdone) * 100; }
  function xp() { return xpOf(state); }
  function level(x) { var l = 1; for (var i = 0; i < LEVELS.length; i++) if (x >= LEVELS[i]) l = i + 1; return l; }

  // ---------- sound + fx ----------
  var actx = null;
  function beep(notes) {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      notes.forEach(function (n, i) {
        var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * 0.09;
        o.type = "square"; o.frequency.value = n;
        g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.17);
      });
    } catch (e) {}
  }
  function toast(text) {
    var box = document.getElementById("toast");
    while (box.children.length > 3) box.firstChild.remove();
    var t = document.createElement("div"); t.textContent = text; box.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }
  var cv = document.getElementById("confetti"), cx = cv.getContext("2d"), bits = [], raf = 0;
  function confetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cv.width = innerWidth; cv.height = innerHeight;
    for (var i = 0; i < 140; i++) bits.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 14, vy: -Math.random() * 12 - 4, s: 6 + Math.random() * 8, c: COLORS[i % COLORS.length], r: Math.random() * 6, life: 120 });
    if (!raf) tick();
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    bits = bits.filter(function (b) { return b.life-- > 0; });
    bits.forEach(function (b) { b.vy += 0.35; b.x += b.vx; b.y += b.vy; b.r += 0.1; cx.save(); cx.translate(b.x, b.y); cx.rotate(b.r); cx.fillStyle = b.c; cx.fillRect(-b.s / 2, -b.s / 2, b.s, b.s); cx.restore(); });
    raf = bits.length ? requestAnimationFrame(tick) : 0;
    if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
  }
  var XP_FOR = { quiz: 50, steps: 20, boss: 100, power: 40, done: 250, lab: 30, qsteps: 20, qquiz: 50, qdone: 100 };
  function award(bucket, key, label) {
    if (state[bucket][key]) return false;
    var before = level(xp());
    state[bucket][key] = true; markToday(); save();
    toast("+" + XP_FOR[bucket] + " XP" + (label ? "  " + label : ""));
    beep([660, 880]);
    var after = level(xp());
    if (after > before) { setTimeout(function () { confetti(); beep([523, 659, 784, 1046]); toast("LEVEL UP! You're a " + RANKS[after - 1]); }, 400); }
    hud();
    return true;
  }
  function copy(text, btn) {
    function done() { var old = btn.textContent; btn.textContent = "Copied!"; setTimeout(function () { btn.textContent = old; }, 1500); }
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Select + copy it"; }
      ta.remove();
    }
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }

  // ---------- helpers ----------
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (k === "style") n.style.cssText = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function stars(n) { var s = el("span", { class: "stars", "aria-label": n + " of 5 difficulty" }); for (var i = 1; i <= 5; i++) s.appendChild(el("span", { class: i <= n ? "" : "off", text: "■" })); return s; }
  var ICONS = {
    model: '<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    code: '<path d="M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16"/>',
    look: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    ai: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    game: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4M10 14h4v4h-4zM7 21h10"/>',
    done: '<path d="M4 12.5l5 5L20 6.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M12 9v12M12 9c-2-4-6-4-6-1s6 1 6 1zm0 0c2-4 6-4 6-1s-6 1-6 1z"/>'
  };
  function icon(name) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
    s.innerHTML = ICONS[name];
    return s;
  }
  function go(view) { location.hash = view; }

  // ---------- path ----------
  var PATH = [];
  M.forEach(function (m) {
    Q.forEach(function (q) { if (q.before === m.id) PATH.push({ kind: "quest", id: q.id, q: q, unit: m.id === 1 ? 0 : m.id }); });
    PATH.push({ kind: "mission", id: m.id, m: m, unit: m.id });
  });
  function nodeDone(n) { return n.kind === "mission" ? !!state.done[n.id] : !!state.qdone[n.id]; }
  function nodeIndex(kind, id) { for (var i = 0; i < PATH.length; i++) if (PATH[i].kind === kind && String(PATH[i].id) === String(id)) return i; return -1; }
  function nodeOpen(i) { return i === 0 || (i > 0 && nodeDone(PATH[i - 1])); }
  function nodeRoute(n) { return n.kind === "mission" ? "mission-" + n.id : "quest-" + n.id; }
  function nextAfter(kind, id) { var i = nodeIndex(kind, id); return PATH[i + 1] || null; }
  function currentNode() { for (var i = 0; i < PATH.length; i++) if (!nodeDone(PATH[i])) return PATH[i]; return null; }
  function unitColor(u) { return u === 0 ? UNIT0_COLOR : M[u - 1].color; }
  function unitTitle(u) { return u === 0 ? "Warm-up: get set up" : u === 1 ? "Your first game: " + M[0].title : "Get ready for " + M[u - 1].title; }
  function nodeTitle(n) { return n.kind === "mission" ? n.m.title : n.q.title; }

  function reqDone(req) { var p = req.split(":"); return p[0] === "m" ? !!state.done[p[1]] : !!state.qdone[p[1]]; }
  function reqLabel(req) { var p = req.split(":"); return p[0] === "m" ? "Finish " + M[p[1] - 1].title : "Finish " + Q.filter(function (q) { return q.id === p[1]; })[0].title; }
  function packOpen(p) { return reqDone(PACK_UNLOCK[p]); }
  function vaultOpen() { return !!state.qdone["0d"]; }
  function labOpen() { return !!state.done[1]; }
  function unlocksFor(req) {
    var out = [];
    for (var p in PACK_UNLOCK) if (PACK_UNLOCK[p] === req) out.push(p + " pack");
    if (req === "q:0d") out.push("the Creator Vault");
    if (req === "m:1") out.push("Prompt Lab");
    return out;
  }

  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function markToday() { if (!state.days) state.days = []; if (state.days.indexOf(today()) < 0) { state.days.push(today()); if (state.days.length > 400) state.days.shift(); } }
  function streak() {
    var set = {}; (state.days || []).forEach(function (d) { set[d] = 1; });
    var d = new Date(), n = 0;
    function key(x) { return x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate(); }
    if (!set[key(d)]) d.setDate(d.getDate() - 1);
    while (set[key(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ---------- HUD ----------
  function hud() {
    var h = document.getElementById("hud");
    h.hidden = !profiles.current || !state.name;
    if (h.hidden) return;
    var x = xp(), l = level(x), lo = LEVELS[l - 1], hi = LEVELS[l] || (lo + 1000);
    document.getElementById("hud-avatar").style.background = state.color;
    document.getElementById("hud-name").textContent = state.name;
    document.getElementById("hud-rank").textContent = RANKS[l - 1];
    document.getElementById("hud-lvl").textContent = "LV " + l;
    document.getElementById("hud-bar").style.width = (l >= LEVELS.length ? 100 : Math.round(((x - lo) / (hi - lo)) * 100)) + "%";
    document.getElementById("hud-xp").textContent = x + " XP";
    var st = streak(), se = document.getElementById("hud-streak");
    se.querySelector("b").textContent = st; se.classList.toggle("on", st > 0); se.title = st + " day streak";
    var view = (location.hash || "#map").slice(1).split("-")[0];
    var locks = { lab: !labOpen(), vault: !vaultOpen() };
    document.querySelectorAll("[data-go]").forEach(function (b) {
      var g = b.getAttribute("data-go");
      if (g === view) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
      b.classList.toggle("is-locked", !!locks[g]);
    });
  }
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      var g = b.getAttribute("data-go");
      if (g === "lab" && !labOpen()) { beep([200]); toast("Prompt Lab unlocks after " + M[0].title + "!"); return; }
      if (g === "vault" && !vaultOpen()) { beep([200]); toast("The Vault unlocks after the warm-up!"); return; }
      go(g);
    });
  });
  document.getElementById("hud-me").addEventListener("click", function () { go("profiles"); });

  // ---------- shared pieces ----------
  // A checklist where only the next step is open. Done steps collapse, later steps stay locked.
  function stepList(items, bucket, onChange) {
    var wrap = el("div", { class: "steps" });
    function draw() {
      wrap.replaceChildren();
      var active = -1;
      items.forEach(function (it, i) { if (active < 0 && !state[bucket][it.key]) active = i; });
      items.forEach(function (it, i) {
        var done = !!state[bucket][it.key], isActive = i === active;
        var row = el("div", { class: "step" + (done ? " done" : isActive ? " active" : " locked") });
        var dot = el("span", { class: "step-dot" }, [done ? icon("done") : isActive ? el("b", { text: String(i + 1) }) : icon("lock")]);
        var main = el("div", { class: "step-main" }, [el("p", { text: it.t })]);
        if (isActive) {
          var figName = it.fig || FIG.guess(it.t);
          var f = figName && FIG.make(figName);
          if (f) main.appendChild(f);
          main.appendChild(el("button", { class: "btn green small", type: "button", text: "Done ✓", onclick: function () { award(bucket, it.key); draw(); if (onChange) onChange(); } }));
        }
        row.appendChild(dot); row.appendChild(main);
        wrap.appendChild(row);
      });
    }
    draw();
    return wrap;
  }
  // Tips that appear one at a time.
  function tipReveal(texts, color, seenKey, onAll) {
    var wrap = el("div", { class: "stack" }), shown = seenKey && tipsSeen[seenKey] ? texts.length : 1;
    function draw() {
      wrap.replaceChildren();
      texts.slice(0, shown).forEach(function (t, i) { wrap.appendChild(el("div", { class: "tip" + (i === shown - 1 ? " new" : "") }, [el("span", { class: "tipnum", style: "background:" + color, text: String(i + 1) }), el("p", { text: t })])); });
      if (shown < texts.length) wrap.appendChild(el("button", { class: "btn ghost small", type: "button", text: "Got it! Next tip (" + (shown + 1) + "/" + texts.length + ")", onclick: function () { shown++; beep([520]); draw(); } }));
      else { if (seenKey) tipsSeen[seenKey] = true; if (onAll) onAll(); }
    }
    draw();
    return wrap;
  }
  var tipsSeen = {};
  function quiz(qd, bucket, key, onRight) {
    var exp = el("p", { class: "explain", text: qd.explain });
    exp.hidden = !state[bucket][key];
    var out = [el("h2", { text: qd.q })];
    qd.options.forEach(function (o, oi) {
      var b = el("button", { type: "button", class: "opt" + (state[bucket][key] && oi === qd.answer ? " right" : ""), text: o, onclick: function () {
        if (oi === qd.answer) { b.className = "opt right"; exp.hidden = false; award(bucket, key, "Correct!"); if (onRight) onRight(); }
        else { b.className = "opt"; void b.offsetWidth; b.className = "opt wrong"; beep([180, 140]); }
      } });
      out.push(b);
    });
    out.push(exp);
    return out;
  }
  function promptBox(text, note) {
    var cbtn = el("button", { class: "btn small green", type: "button", text: "Copy prompt" });
    cbtn.addEventListener("click", function () { copy(text, cbtn); });
    return el("div", { class: "stack" }, [el("div", { class: "prompt-box" }, [el("pre", { text: text })]), el("div", { class: "row" }, [cbtn, el("span", { class: "muted", text: note || "Send it in Claude Desktop and Claude builds it right in Studio. Change any part you like first!" })])]);
  }

  // A step-by-step lesson shell: top bar with progress, one screen at a time, Continue gated by each screen.
  function lesson(opts) {
    var i = opts.start || 0, bar = el("i"), body = el("div", { class: "lesson-body" }), counter = el("span", { class: "lesson-count" });
    var back = el("button", { class: "btn ghost small", type: "button", text: "← Back", onclick: function () { if (i > 0) { i--; draw(); window.scrollTo(0, 0); } } });
    var cont = el("button", { class: "btn yellow cont", type: "button" });
    function refresh() {
      var s = opts.screens[i], ok = !s.gate || s.gate();
      cont.disabled = !ok;
      cont.textContent = ok ? (s.next || "Continue") : (s.hint || "Finish this step first");
      cont.hidden = !!s.noContinue;
      back.hidden = i === 0;
      bar.style.width = Math.round((i / (opts.screens.length - 1)) * 100) + "%";
      counter.textContent = "Step " + (i + 1) + " of " + opts.screens.length;
    }
    function draw() { body.replaceChildren.apply(body, opts.screens[i].render(refresh).filter(Boolean)); refresh(); }
    cont.addEventListener("click", function () {
      var s = opts.screens[i];
      if (s.gate && !s.gate()) return;
      if (s.onContinue && s.onContinue() === false) return;
      if (i < opts.screens.length - 1) { i++; beep([600]); draw(); window.scrollTo(0, 0); }
    });
    app.replaceChildren(el("div", { class: "lesson-wrap" }, [
      el("div", { class: "lesson-top" }, [
        el("button", { class: "x", type: "button", "aria-label": "Back to path", text: "✕", onclick: function () { go("map"); } }),
        el("div", { class: "bar lbar" }, [bar]), counter
      ]),
      opts.header || null,
      el("div", { class: "panel lesson-card" }, [body, el("div", { class: "lesson-foot" }, [back, cont])])
    ].filter(Boolean)));
    draw();
    return { redraw: draw, refresh: refresh };
  }

  function rewardModal(title, sub, color, iconName, unlocked, buttons) {
    var bg = el("div", { class: "modal-bg", role: "dialog", "aria-modal": "true", "aria-label": title });
    var list = unlocked && unlocked.length ? el("div", { class: "unlocks" }, [el("span", { class: "label", text: "Unlocked" })].concat(unlocked.map(function (u) { return el("div", { class: "unlock-item" }, [icon("gift"), el("span", { text: u })]); }))) : null;
    bg.appendChild(el("div", { class: "panel modal stack", style: "align-items:center" }, [
      el("div", { class: "badge" }, [el("div", { class: "medal big-medal", style: "background:" + color }, [icon(iconName)])]),
      el("h2", { text: title }), el("p", { class: "muted", text: sub }), list,
      el("div", { class: "stack", style: "width:100%" }, buttons.map(function (b) { return el("button", { class: "btn " + (b.cls || "yellow"), type: "button", text: b.text, onclick: function () { bg.remove(); if (b.go) go(b.go); } }); }))
    ].filter(Boolean)));
    document.body.appendChild(bg);
    bg.querySelector(".modal .btn").focus();
  }

  // ---------- profiles ----------
  function viewProfiles() {
    var grid = el("div", { class: "profiles" });
    profiles.list.forEach(function (p) {
      var s = readJSON("creator-quest-p-" + p.id) || {};
      var x = xpOf(Object.assign(blank(), s)), l = level(x);
      grid.appendChild(el("button", { type: "button", class: "profile", onclick: function () { loadProfile(p.id); beep([523, 784]); go("map"); render(); } }, [
        el("span", { class: "avatar big", style: "background:" + p.color }), el("b", { text: p.name }), el("span", { class: "me-rank", text: "LV " + l + " · " + RANKS[l - 1] }), el("span", { class: "muted", style: "font-size:.85rem", text: x + " XP" })
      ]));
    });
    if (profiles.list.length < 6) grid.appendChild(el("button", { type: "button", class: "profile add", onclick: function () { profiles.current = null; state = blank(); go("new"); render(); } }, [el("span", { class: "avatar big plus", text: "+" }), el("b", { text: "New creator" }), el("span", { class: "muted", style: "font-size:.85rem", text: "For a brother, sister or friend" })]));
    app.replaceChildren(el("div", { class: "stack", style: "align-items:center;text-align:center" }, [
      el("div", { class: "title-blocks", style: "justify-content:center" }, COLORS.slice(0, 5).map(function (c) { return el("span", { style: "background:" + c }); })),
      el("h1", { text: "Who's building today?" }), el("p", { class: "muted", text: "Each creator has their own path, XP and badges." }), grid
    ]));
  }

  function viewWelcome() {
    var chosen = COLORS[profiles.list.length % COLORS.length];
    var input = el("input", { type: "text", id: "creator-name", maxlength: "18", placeholder: "Your creator name", autocomplete: "off" });
    var sw = el("div", { class: "swatches", role: "group", "aria-label": "Pick your color" });
    COLORS.forEach(function (c) {
      var b = el("button", { type: "button", class: "swatch", style: "background:" + c, "aria-label": "Color " + c, "aria-pressed": String(c === chosen), onclick: function () {
        chosen = c; sw.querySelectorAll(".swatch").forEach(function (s) { s.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); beep([520]);
      } });
      sw.appendChild(b);
    });
    var start = el("button", { class: "btn yellow", type: "button", text: "Start my quest", onclick: function () {
      var name = input.value.trim().slice(0, 18);
      if (!name) { input.focus(); input.placeholder = "Type a name first!"; return; }
      var id = "p" + Date.now();
      profiles.list.push({ id: id, name: name, color: chosen });
      loadProfile(id); state.name = name; state.color = chosen; save();
      beep([523, 659, 784]); confetti(); go("map"); render();
    } });
    app.replaceChildren(el("section", { class: "welcome" }, [
      el("div", { class: "stack" }, [
        el("div", { class: "title-blocks" }, COLORS.slice(0, 5).map(function (c) { return el("span", { style: "background:" + c }); })),
        el("h1", { html: "Creator <span>Quest</span>" }),
        el("p", { style: "font-size:1.2rem;max-width:34ch", text: "Stop playing other people's games. Build your own, with AI as your sidekick." }),
        el("p", { class: "muted", text: "You describe it, Claude builds it in Roblox Studio · 8 big games · 21 skill quests · 118 models to unlock" }),
        profiles.list.length ? el("button", { class: "btn small ghost", type: "button", text: "← Pick a different creator", onclick: function () { go("profiles"); } }) : null
      ]),
      el("div", { class: "panel stack" }, [
        el("label", { class: "label", for: "creator-name", text: "Your creator name" }), input,
        el("span", { class: "label", text: "Your color" }), sw,
        el("div", { class: "copilot-note", html: "<b>Grab your grown-up!</b> Claude runs in the Claude Desktop app on their account, connected to Roblox Studio. They're your co-pilot." }),
        start
      ])
    ]));
    input.focus();
  }

  // ---------- path ----------
  var WAVE = [0, 70, 105, 70, 0, -70, -105, -70];
  function viewMap() {
    var path = el("div", { class: "path" });
    var cur = currentNode(), curIdx = cur ? PATH.indexOf(cur) : -1;
    var openPop = null, waveI = 0, lastUnit = -1;

    PATH.forEach(function (n, i) {
      if (n.unit !== lastUnit) {
        lastUnit = n.unit; waveI = 0;
        var unitNodes = PATH.filter(function (x) { return x.unit === n.unit; });
        var doneN = unitNodes.filter(nodeDone).length, unitOpen = nodeOpen(PATH.indexOf(unitNodes[0]));
        path.appendChild(el("div", { class: "unit" + (unitOpen ? "" : " locked"), style: "background:" + unitColor(n.unit) }, [
          el("div", {}, [el("span", { class: "label", text: "Unit " + n.unit }), el("h3", { text: unitTitle(n.unit) })]),
          el("span", { class: "unit-count", text: doneN === unitNodes.length ? "✓ Done" : doneN + "/" + unitNodes.length })
        ]));
      }
      var open = nodeOpen(i), done = nodeDone(n), current = i === curIdx;
      var isGame = n.kind === "mission";
      var color = isGame ? n.m.color : unitColor(n.unit);
      var wrap = el("div", { class: "pwrap", style: "--x:" + WAVE[waveI++ % WAVE.length] });
      var btn = el("button", { type: "button", class: "pnode" + (isGame ? " big" : "") + (done ? " done" : "") + (!open ? " locked" : "") + (current ? " current" : ""),
        style: open && !done ? "background:" + color : "",
        "aria-label": (isGame ? "Big game: " + n.m.title : "Skill quest: " + n.q.title) + (done ? ", complete" : open ? "" : ", locked") });
      btn.appendChild(icon(done ? "done" : isGame ? "game" : !open ? "lock" : n.q.icon));
      if (current) wrap.appendChild(el("span", { class: "bubble", text: i === 0 ? "START" : "NEXT" }));
      wrap.appendChild(btn);
      wrap.appendChild(el("span", { class: "plabel" + (isGame ? " big" : "") + (!open ? " dim" : ""), text: open || isGame ? nodeTitle(n) : "???" }));

      btn.addEventListener("click", function () {
        if (openPop) { var same = openPop.parentNode === wrap; openPop.parentNode.classList.remove("has-pop"); openPop.remove(); openPop = null; if (same) return; }
        if (!open) { beep([200]); toast("Finish " + nodeTitle(PATH[i - 1]) + " first!"); return; }
        beep([600]);
        openPop = el("div", { class: "pop", style: "--c:" + color }, [
          el("span", { class: "label", text: (isGame ? "Big game project" : "Skill quest") + " · " + (isGame ? n.m.time : n.q.time) }),
          el("h3", { text: nodeTitle(n) }), el("p", { text: isGame ? n.m.tagline : n.q.learn }),
          el("button", { class: "btn " + (done ? "ghost" : "yellow"), type: "button", text: done ? "Play again" : "Start  ·  " + (isGame ? "up to 730 XP" : "up to " + (n.q.steps.length * 20 + 150) + " XP"), onclick: function () { go(nodeRoute(n)); } })
        ]);
        wrap.appendChild(openPop); wrap.classList.add("has-pop");
      });
      path.appendChild(wrap);
    });

    var doneCount = PATH.filter(nodeDone).length;
    var next = cur ? el("button", { class: "continue-card", type: "button", style: "--c:" + (cur.kind === "mission" ? cur.m.color : unitColor(cur.unit)), onclick: function () { go(nodeRoute(cur)); } }, [
      el("span", { class: "cc-icon" }, [icon(cur.kind === "mission" ? "game" : cur.q.icon)]),
      el("span", { class: "cc-text" }, [el("span", { class: "label", text: doneCount === 0 ? "Start here" : "Continue" }), el("b", { text: nodeTitle(cur) })]),
      el("span", { class: "cc-go", text: "Go →" })
    ]) : el("div", { class: "continue-card" }, [el("b", { text: "You finished the whole path! Legendary." })]);
    app.replaceChildren(
      el("div", { class: "path-head" }, [
        el("div", {}, [el("span", { class: "label", text: "Your path" }), el("h2", { text: doneCount === 0 ? "Let's go, " + state.name + "!" : doneCount + " of " + PATH.length + " steps done" })]),
        el("span", { class: "streak big" + (streak() > 0 ? " on" : ""), title: "Day streak" }, [el("i"), el("b", { text: String(streak()) }), el("span", { text: " day streak" })])
      ]),
      next, path
    );
    var curEl = app.querySelector(".pnode.current");
    if (curEl && curEl.scrollIntoView && doneCount > 0) setTimeout(function () { curEl.scrollIntoView({ block: "center", behavior: "smooth" }); }, 120);
  }

  // ---------- skill quest ----------
  function viewQuest(id) {
    var idx = nodeIndex("quest", id);
    if (idx < 0) return go("map");
    if (!nodeOpen(idx)) { toast("That quest is still locked!"); return go("map"); }
    var node = PATH[idx], q = node.q, color = unitColor(node.unit);
    var items = q.steps.map(function (s, i) { return { key: q.id + "-" + i, t: typeof s === "string" ? s : s.t, fig: typeof s === "string" ? null : s.fig }; });
    function stepsDone() { return items.every(function (it) { return state.qsteps[it.key]; }); }
    var tipsDone = !!state.qdone[q.id] || items.some(function (it) { return state.qsteps[it.key]; });
    var screens = [
      { render: function (refresh) { return [el("span", { class: "label", text: "Skill quest · Unit " + node.unit + " · " + q.time }), el("h1", { text: q.title }), el("p", { class: "lesson", text: q.learn }), tipReveal(q.know, color, tipsDone ? "q" + q.id : null, function () { tipsDone = true; refresh(); })]; },
        gate: function () { return tipsDone; }, hint: "Read all the tips first" },
      { render: function (refresh) {
          var out = [el("span", { class: "label", text: "Try it" }), el("h2", { text: q.prompt ? "Send this to Claude, then build it" : "Let's do it" })];
          if (q.prompt) out.push(promptBox(q.prompt));
          out.push(el("span", { class: "label", style: "margin-top:6px", text: "One step at a time" }), stepList(items, "qsteps", refresh));
          return out;
        }, gate: stepsDone, hint: "Finish every step" },
      { render: function (refresh) { return [el("span", { class: "label", text: "Quick check" })].concat(quiz(q.check, "qquiz", q.id, refresh)); },
        gate: function () { return !!state.qquiz[q.id]; }, hint: "Pick the right answer", next: "Finish quest",
        onContinue: function () { completeQuest(); } },
      { render: function () {
          var nxt = nextAfter("quest", q.id);
          return [el("div", { class: "stack", style: "align-items:center;text-align:center;padding-block:16px" }, [
            el("div", { class: "badge" }, [el("div", { class: "medal big-medal", style: "background:" + color }, [icon(q.icon)])]),
            el("h1", { text: "Quest complete!" }), el("p", { class: "lesson", text: "You learned: " + q.learn }),
            el("span", { class: "streak big on" }, [el("i"), el("b", { text: String(Math.max(1, streak())) }), el("span", { text: " day streak" })]),
            nxt ? el("p", { class: "muted", text: "Unlocked next: " + (nxt.kind === "mission" ? "Big game: " + nxt.m.title : nxt.q.title) }) : null
          ])];
        }, next: "Back to the path", onContinue: function () { go("map"); return false; } }
    ];
    function completeQuest() {
      if (award("qdone", q.id, q.title)) {
        confetti(); beep([523, 659, 784, 1046]);
        var unl = unlocksFor("q:" + q.id);
        if (unl.length) setTimeout(function () { rewardModal("Unit " + node.unit + " complete!", "Claude is connected and you made your first build. Time for your first big game!", color, "gift", unl, [{ text: "Awesome!" }]); }, 500);
      }
    }
    var start = state.qdone[q.id] ? 0 : !tipsDone ? 0 : !stepsDone() ? 1 : 2;
    lesson({ screens: screens, start: start });
  }

  // ---------- big game ----------
  function viewMission(id) {
    var m = M[id - 1];
    if (!m) return go("map");
    var idx = nodeIndex("mission", m.id);
    if (!nodeOpen(idx)) { toast("That game is still locked!"); return go("map"); }
    var brainDone = !!state.done[m.id] || !!state.quiz[m.id + "-0"];
    function k(i) { return m.id + "-" + i; }
    var setupItems = SETUP.map(function (s, i) { return { key: k(i), t: s.t, fig: s.fig }; });
    var sendItems = SEND.map(function (s, i) { return { key: k(i + SETUP.length), t: s.t, fig: s.fig }; });
    var testItems = m.test.map(function (t, i) { return { key: k(TEST_OFFSET + i), t: t }; });
    function all(items) { return items.every(function (it) { return state.steps[it.key]; }); }
    function powerCount() { return m.powerups.filter(function (_, i) { return state.power[k(i)]; }).length; }

    var screens = [];
    screens.push({ render: function () {
      return [
        el("section", { class: "mhead", style: "background:" + m.color }, [
          el("div", {}, [el("span", { class: "label", text: "Big game " + m.id + " · " + m.time }), el("h1", { text: m.title }), el("p", { text: m.story })]), stars(m.stars)
        ]),
        el("span", { class: "label", text: "You'll build" }),
        el("ul", { class: "builds" }, m.builds.map(function (b) { return el("li", { text: b }); }))
      ];
    }, next: "Let's go!" });
    screens.push({ render: function (refresh) { return [el("span", { class: "label", text: "AI Brain unlock" }), el("h2", { text: m.brain.title }), tipReveal(m.brain.text, m.color, brainDone ? "m" + m.id : null, function () { brainDone = true; refresh(); })]; },
      gate: function () { return brainDone; }, hint: "Read all the tips first" });
    m.brain.quiz.forEach(function (qd, qi) {
      screens.push({ render: function (refresh) { return [el("span", { class: "label", text: "Brain quiz " + (qi + 1) + " of " + m.brain.quiz.length })].concat(quiz(qd, "quiz", k(qi), refresh)); },
        gate: function () { return !!state.quiz[k(qi)]; }, hint: "Pick the right answer" });
    });
    if (m.megaPrompt) {
      screens.push({ render: function (refresh) { return [el("span", { class: "label", text: "Build · get set up" }), el("h2", { text: "Open a fresh world" }), stepList(setupItems, "steps", refresh)]; },
        gate: function () { return all(setupItems); }, hint: "Finish every step" });
      screens.push({ render: function (refresh) {
        return [el("span", { class: "label", text: "Build · the Mega Prompt" }), el("h2", { text: "One prompt. A whole game." }),
          promptBox(m.megaPrompt, "Add your own ideas to the list before sending! Claude builds it in Studio and tests it. Each build can come out a bit different, and that's normal."),
          el("span", { class: "label", style: "margin-top:6px", text: "One step at a time" }), stepList(sendItems, "steps", refresh)];
      }, gate: function () { return all(sendItems); }, hint: "Finish every step" });
      screens.push({ render: function (refresh) {
        var rescue = window.RESCUE[m.key] || "";
        var fixPrompt = "Something in my game isn't working: [say what you did and what happened]. Check the output for errors, fix it, and playtest it again.";
        var backupPrompt = "My " + m.title + " game isn't working and we want to use the backup. In my open Roblox Studio place, delete the scripts you added to ServerScriptService for this game and add this ONE Script there instead. Don't change it. Then playtest it and tell me when it's ready.\n\n```lua\n" + rescue + "```";
        var fbtn = el("button", { class: "btn small green", type: "button", text: "Copy fix prompt" });
        fbtn.addEventListener("click", function () { copy(fixPrompt, fbtn); });
        var rbtn = el("button", { class: "btn small", type: "button", text: "Copy backup prompt" });
        rbtn.addEventListener("click", function () { copy(backupPrompt, rbtn); });
        return [el("span", { class: "label", text: "Build · test it" }), el("h2", { text: "Does everything work?" }), stepList(testItems, "steps", refresh),
          el("details", { class: "rescue panel help" }, [el("summary", { text: "Something broken? Open for help" }), el("div", { class: "stack", style: "margin-top:12px" }, [
            el("p", { text: "1. Tell Claude what went wrong. Fill in the brackets, then send it. Claude reads the errors in Output itself." }),
            el("div", { class: "prompt-box" }, [el("pre", { text: fixPrompt })]), fbtn,
            el("p", { text: "2. Tried 3 fixes and still stuck? Send the backup prompt. Claude swaps in a ready-made version of the whole game. Even pro developers use backups!" }),
            rbtn, el("details", {}, [el("summary", { class: "muted", text: "Peek at the backup code" }), el("div", { class: "code" }, [el("pre", { text: rescue })])])
          ])])];
      }, gate: function () { return all(testItems); }, hint: "Test every part" });
    } else {
      screens.push({ render: function (refresh) { return [dream(refresh)]; }, gate: function () { return !!state.dreamSpun; }, hint: "Spin or write your idea first" });
      var shipItems = testItems;
      screens.push({ render: function (refresh) {
        return [el("span", { class: "label", text: "Build · ship it" }), el("h2", { text: "Build it, test it, publish it" }),
          el("p", { class: "muted", text: "Build piece by piece with your Dream Prompt. Need trees, buildings or pets? Open the Vault and tap \"Ask Claude to add it\" on any model." }),
          stepList(shipItems, "steps", refresh)];
      }, gate: function () { return all(shipItems); }, hint: "Finish every step" });
    }
    if (m.bossBug) screens.push({ render: function (refresh) { return bossBug(refresh); }, gate: function () { return !!state.boss[m.id]; }, hint: "Find the bug first" });
    screens.push({ render: function (refresh) { return powerups(refresh); }, gate: function () { return powerCount() >= 1; }, hint: "Add at least 1 power-up" });
    screens.push({ render: function () { return finish(); }, noContinue: true });

    function dream(refresh) {
      var D = window.DREAM;
      var pick = state.dream || { genre: D.genre[0], theme: D.theme[1], twist: D.twist[0], idea: "" };
      var slots = el("div", { class: "slot" });
      var ta = el("textarea", { id: "dream-idea", rows: "3", class: "dream-ta", placeholder: "Add your own idea (optional): a character, a power, a secret..." });
      ta.value = pick.idea || "";
      var pre = el("pre", {});
      function prompt() {
        return "I'm designing my own Roblox game with my parent. It's a " + pick.genre + " game set in " + pick.theme + ", and the twist is: " + pick.twist + "." + (pick.idea ? " My extra idea: " + pick.idea + "." : "") +
          "\nFirst, help me plan it: give it 3 possible names, describe the main game loop in 3 steps, and list the 5 most important pieces to build in order." +
          "\nThen build piece #1 directly in my open Roblox Studio place, playtest it and fix any errors. After I test it, I'll ask for the next piece.";
      }
      function drawSlots() {
        slots.replaceChildren(
          el("div", {}, [el("span", { class: "label", text: "Genre" }), el("b", { text: pick.genre })]),
          el("div", {}, [el("span", { class: "label", text: "World" }), el("b", { text: pick.theme })]),
          el("div", {}, [el("span", { class: "label", text: "Twist" }), el("b", { text: pick.twist })]));
        pre.textContent = prompt();
      }
      function spin() {
        var n = 0, t = setInterval(function () {
          pick.genre = D.genre[Math.floor(Math.random() * D.genre.length)];
          pick.theme = D.theme[Math.floor(Math.random() * D.theme.length)];
          pick.twist = D.twist[Math.floor(Math.random() * D.twist.length)];
          drawSlots(); beep([300 + n * 40]);
          if (++n > 10) { clearInterval(t); state.dream = pick; state.dreamSpun = true; save(); beep([784, 1046]); refresh(); }
        }, 80);
      }
      ta.addEventListener("input", function () { pick.idea = ta.value.trim().slice(0, 200); state.dream = pick; if (pick.idea.length > 3) state.dreamSpun = true; save(); pre.textContent = prompt(); refresh(); });
      drawSlots();
      var cbtn = el("button", { class: "btn small green", type: "button", text: "Copy prompt" });
      cbtn.addEventListener("click", function () { copy(prompt(), cbtn); });
      return el("div", { class: "stack" }, [
        el("span", { class: "label", text: "Dream Game Designer" }), el("h2", { text: "Spin up a game idea" }), slots,
        el("div", { class: "row" }, [el("button", { class: "btn yellow", type: "button", text: "Spin!", onclick: spin }), el("span", { class: "muted", text: "Spin until you love it, or write your own idea." })]),
        ta, el("span", { class: "label", text: "Your Dream Prompt" }), el("div", { class: "prompt-box" }, [pre]), el("div", { class: "row" }, [cbtn])
      ]);
    }

    function bossBug(refresh) {
      var b = m.bossBug, box = el("div", { class: "bugbox", role: "group", "aria-label": "Code with a bug" });
      var res = el("p", { class: "explain", text: "BUG SQUASHED! " + b.explain });
      res.hidden = !state.boss[m.id];
      b.code.forEach(function (line, i) {
        var btn = el("button", { type: "button", class: "codeline" + (state.boss[m.id] && i === b.bug ? " right" : "") }, [el("span", { class: "ln", text: String(i + 1) }), el("span", { text: line.replace(/\t/g, "    ") })]);
        btn.addEventListener("click", function () {
          if (i === b.bug) { btn.className = "codeline right"; res.hidden = false; if (award("boss", m.id, "Bug squashed!")) confetti(); refresh(); }
          else { btn.className = "codeline"; void btn.offsetWidth; btn.className = "codeline wrong"; beep([180, 140]); }
        });
        box.appendChild(btn);
      });
      return [el("span", { class: "label", text: "Boss Bug" }), el("h2", { text: "Find the bug!" }), el("p", { class: "lesson", text: b.intro }), el("p", { class: "muted", text: "Tap the line with the bug." }), box, res];
    }

    function powerups(refresh) {
      var wrap = el("div", { class: "stack" });
      function draw() {
        wrap.replaceChildren();
        var active = -1;
        m.powerups.forEach(function (_, i) { if (active < 0 && !state.power[k(i)]) active = i; });
        m.powerups.forEach(function (p, i) {
          var done = !!state.power[k(i)];
          if (done) { wrap.appendChild(el("div", { class: "pcard done" }, [icon("done"), el("b", { text: p.name }), el("span", { class: "muted", text: "Added!" })])); return; }
          if (i !== active) { wrap.appendChild(el("div", { class: "pcard locked" }, [icon("lock"), el("b", { text: "Power-up " + (i + 1) }), el("span", { class: "muted", text: "Unlocks after " + m.powerups[i - 1].name })])); return; }
          var cbtn = el("button", { class: "btn small ghost", type: "button", text: "Copy" });
          cbtn.addEventListener("click", function () { copy(p.prompt, cbtn); });
          wrap.appendChild(el("div", { class: "panel stack pcard-active" }, [el("span", { class: "label", text: "Power-up " + (i + 1) + " of " + m.powerups.length }), el("h3", { text: p.name }), el("code", { class: "pcode", text: p.prompt }),
            el("div", { class: "row" }, [cbtn, el("button", { class: "btn small yellow", type: "button", text: "I added it! ✓", onclick: function () { if (award("power", k(i), p.name)) { draw(); refresh(); } } })])]));
        });
      }
      draw();
      return [el("span", { class: "label", text: "Power-ups" }), el("h2", { text: "Level up your game" }), el("p", { class: "muted", text: "Add at least one to finish. Each one unlocks the next!" }), wrap];
    }

    function finish() {
      var done = !!state.done[m.id];
      var btn = el("button", { class: "btn green hold", type: "button", style: "font-size:1.2rem;padding:16px 26px" }, [el("span", { class: "fill" }), done ? "Game complete!" : "Grown-up: hold to stamp"]);
      var fill = btn.querySelector(".fill"), timer = null, t0 = 0;
      function startHold(e) { if (done) return; e.preventDefault(); t0 = Date.now(); timer = setInterval(function () { var p = Math.min(1, (Date.now() - t0) / 1500); fill.style.width = (p * 100) + "%"; if (p >= 1) { stopHold(); complete(); } }, 30); }
      function stopHold() { clearInterval(timer); timer = null; if (!state.done[m.id]) fill.style.width = "0"; }
      function complete() {
        award("done", m.id, m.badge + " badge!"); confetti(); beep([523, 659, 784, 1046, 1318]);
        var unl = unlocksFor("m:" + m.id), nxt = nextAfter("mission", m.id);
        rewardModal("Unit " + m.id + " complete!", "You earned the " + m.badge + " badge. +250 XP", m.color, "game", unl,
          [unl.some(function (u) { return / pack$/.test(u); }) ? { text: "Open the Vault", go: "vault" } : null, nxt ? { text: "Back to the path", go: "map", cls: unl.length ? "ghost" : "yellow" } : { text: "See your certificate", go: "badges" }].filter(Boolean));
      }
      btn.addEventListener("pointerdown", startHold); btn.addEventListener("pointerup", stopHold); btn.addEventListener("pointerleave", stopHold);
      btn.addEventListener("keydown", function (e) { if ((e.key === " " || e.key === "Enter") && !timer) startHold(e); });
      btn.addEventListener("keyup", stopHold);
      return [el("div", { class: "stack", style: "text-align:center;align-items:center" }, [
        el("span", { class: "label", text: "Co-pilot check" }),
        el("h2", { text: done ? "You did it!" : "Show your grown-up what you built" }),
        el("p", { class: "lesson", text: m.copilot }), btn,
        done ? el("button", { class: "btn yellow", type: "button", text: "Back to the path →", onclick: function () { go("map"); } }) : null
      ])];
    }

    // resume at the first unfinished screen
    var start = 0;
    if (!state.done[m.id] && brainDone) { start = screens.length - 1; for (var s = 0; s < screens.length; s++) if (screens[s].gate && !screens[s].gate()) { start = s; break; } }
    lesson({ screens: screens, start: start });
  }

  // ---------- prompt lab ----------
  function viewLab() {
    if (!labOpen()) { toast("Prompt Lab unlocks after " + M[0].title + "!"); return go("map"); }
    var i = 0; while (i < LAB.length - 1 && state.lab[String(i)]) i++;
    var wrap = el("div", { class: "stack" });
    function draw() {
      var r = LAB[i], key = String(i);
      var why = el("p", { class: "explain", text: r.why }); why.hidden = !state.lab[key];
      var nextBtn = el("button", { class: "btn small yellow", type: "button", text: "Next round →", onclick: function () { i++; draw(); } });
      nextBtn.hidden = !state.lab[key] || i >= LAB.length - 1;
      var card = el("div", { class: "panel stack" }, [
        el("div", { class: "row", style: "justify-content:space-between" }, [el("span", { class: "label", text: "Round " + (i + 1) + " of " + LAB.length }), el("span", { class: "dots" }, LAB.map(function (_, j) { return el("i", { class: state.lab[String(j)] ? "on" : j === i ? "cur" : "" }); }))]),
        el("h2", { text: r.goal }), el("p", { class: "muted", text: "Which prompt should you send to Claude?" })]);
      r.options.forEach(function (o, oi) {
        var b = el("button", { type: "button", class: "opt" + (state.lab[key] && oi === r.answer ? " right" : ""), style: "font-family:var(--mono);font-weight:500", text: o, onclick: function () {
          if (oi === r.answer) { b.className = "opt right"; why.hidden = false; award("lab", key, "Prompt pro!"); nextBtn.hidden = i >= LAB.length - 1; if (i >= LAB.length - 1) { confetti(); } }
          else { b.className = "opt"; void b.offsetWidth; b.className = "opt wrong"; beep([180, 140]); }
        } });
        card.appendChild(b);
      });
      card.appendChild(why);
      card.appendChild(el("div", { class: "row" }, [i > 0 ? el("button", { class: "btn small ghost", type: "button", text: "← Back", onclick: function () { i--; draw(); } }) : null, nextBtn,
        i === LAB.length - 1 && count(state.lab) === LAB.length ? el("span", { class: "explain", text: "Perfect score! You're a Prompt Wizard." }) : null].filter(Boolean)));
      wrap.replaceChildren(card);
    }
    app.replaceChildren(el("div", { class: "stack", style: "max-width:720px;margin:0 auto" }, [el("span", { class: "label", text: "Mini-game" }), el("h2", { text: "Prompt Lab" }), el("p", { class: "muted", text: "Get each round right to unlock the next one." }), wrap]));
    draw();
  }

  // ---------- vault ----------
  function viewVault() {
    if (!vaultOpen()) { toast("The Vault unlocks after the warm-up!"); return go("map"); }
    var CAT = window.VAULT || [];
    var packs = []; CAT.forEach(function (m) { if (packs.indexOf(m.pack) < 0) packs.push(m.pack); });
    var openPacks = packs.filter(packOpen), lockedPacks = packs.filter(function (p) { return !packOpen(p); });
    var filter = openPacks[openPacks.length - 1], viewer = null, selected = -1;
    var canvas = el("canvas", { "aria-label": "3D model preview" });
    var info = el("div", { class: "stack" }), grid = el("div", { class: "grid" }), chips = el("div", { class: "row", role: "group", "aria-label": "Packs" });
    var has3D = typeof THREE !== "undefined", thumbs = {};
    function showInfo(idx) {
      var m = CAT[idx]; selected = idx;
      if (viewer) viewer.show(m);
      info.replaceChildren(
        el("span", { class: "label", text: m.pack + " pack" }), el("h2", { text: m.name }), el("p", { class: "lesson", text: m.desc }),
        el("div", { class: "row" }, [m.scripted ? el("span", { class: "pill", text: "Works out of the box" }) : el("span", { class: "pill", style: "background:var(--panel-2);color:var(--fg)", text: "Decoration" }), m.tool ? el("span", { class: "pill", style: "background:var(--yellow)", text: "Tool: touch to pick up" }) : null].filter(Boolean)),
        (function () {
          var ask = el("button", { class: "btn yellow small", type: "button", text: "Ask Claude to add it" });
          ask.addEventListener("click", function () { copy("Please run this Luau code with execute_luau in my open Roblox Studio place (Edit mode) to add the " + m.name + " from my Creator Vault in front of the spawn. Don't change anything else. Then tell me where it is.\n\n```lua\n" + m.lua + "```", ask); });
          return el("div", { class: "stack", style: "gap:6px" }, [ask, el("span", { class: "muted", style: "font-size:.85rem", text: "Copies a prompt. Send it in Claude and the model appears in your game." })]);
        })());
      grid.querySelectorAll(".tile").forEach(function (t) { t.setAttribute("aria-pressed", String(+t.getAttribute("data-i") === idx)); });
    }
    function drawGrid() {
      chips.replaceChildren.apply(chips, openPacks.map(function (p) { return el("button", { type: "button", class: "chip", "aria-pressed": String(p === filter), text: p, onclick: function () { filter = p; drawGrid(); } }); }));
      grid.replaceChildren();
      var queue = [], first = -1;
      CAT.forEach(function (m, i) {
        if (m.pack !== filter) return;
        if (first < 0) first = i;
        var img = el("img", { alt: "", width: "120", height: "120" });
        grid.appendChild(el("button", { type: "button", class: "tile", "data-i": String(i), "aria-pressed": String(i === selected), onclick: function () { showInfo(i); beep([600]); } }, [img, el("span", { text: m.name })]));
        if (thumbs[i]) img.src = thumbs[i]; else queue.push([i, img]);
      });
      if (first >= 0 && (selected < 0 || CAT[selected].pack !== filter)) showInfo(first);
      (function pump() { if (!has3D || !queue.length) return; var job = queue.shift(); try { thumbs[job[0]] = VaultViewer.thumbnail(CAT[job[0]], 160); job[1].src = thumbs[job[0]]; } catch (e) {} setTimeout(pump, 0); })();
    }
    var openCount = CAT.filter(function (m) { return packOpen(m.pack); }).length;
    app.replaceChildren(el("div", { class: "stack" }, [
      el("span", { class: "label", text: "Creator Vault" }),
      el("h2", { text: openCount + " of " + CAT.length + " models unlocked" }),
      el("p", { class: "muted", style: "max-width:70ch", text: "Every big game you finish unlocks a new pack of ready-made models. Tap \"Ask Claude to add it\" and Claude builds it into your game. Ones marked \"works out of the box\" have scripts inside." }),
      el("div", { class: "vault-top" }, [
        el("div", { class: "viewer" }, [canvas, el("span", { class: "hint", text: has3D ? "Drag to spin" : "3D preview needs an internet connection" })]),
        el("div", { class: "panel stack" }, [info, el("details", { class: "rescue" }, [el("summary", { text: "Other ways to add models" }), el("div", { class: "stack", style: "margin-top:10px" }, [el("p", { class: "muted", text: "Ask Claude to change any model after it's added: \"make the tree twice as big and pink\". You can also insert a whole pack yourself from the Creator Vault folder:" }), FIG.make("insert")])])])
      ]),
      chips, grid,
      lockedPacks.length ? el("span", { class: "label", style: "margin-top:16px", text: "Still locked" }) : null,
      lockedPacks.length ? el("div", { class: "locked-packs" }, lockedPacks.map(function (p) { return el("div", { class: "lpack" }, [icon("lock"), el("b", { text: p }), el("span", { class: "muted", text: reqLabel(PACK_UNLOCK[p]) })]); })) : null
    ].filter(Boolean)));
    if (has3D) { try { viewer = VaultViewer.mount(canvas); } catch (e) { viewer = null; } }
    drawGrid();
  }

  // ---------- badges ----------
  function badgeList() {
    var list = M.map(function (m) { return { name: m.badge, color: m.color, got: !!state.done[m.id], how: "Finish " + m.title }; });
    list.push({ name: "Warmed Up", color: UNIT0_COLOR, got: !!state.qdone["0d"], how: "Finish the warm-up" });
    list.push({ name: "Skill Master", color: "#36d67a", got: count(state.qdone) >= Q.length, how: "Finish all " + Q.length + " skill quests" });
    list.push({ name: "On Fire", color: "#ff8a2b", got: streak() >= 3, how: "Build 3 days in a row" });
    list.push({ name: "Bug Hunter", color: "#ff4f4f", got: count(state.boss) >= 7, how: "Squash all 7 Boss Bugs" });
    list.push({ name: "Brainiac", color: "#2fd3e0", got: count(state.quiz) >= 16, how: "Ace every AI Brain quiz" });
    list.push({ name: "Prompt Wizard", color: "#b46bff", got: count(state.lab) >= LAB.length, how: "Perfect score in Prompt Lab" });
    list.push({ name: "Power Player", color: "#ffd23f", got: count(state.power) >= 10, how: "Add 10 power-ups" });
    return list;
  }
  function viewBadges() {
    var list = badgeList(), got = list.filter(function (b) { return b.got; }).length;
    var x = xp(), l = level(x), finished = !!state.done[8];
    app.replaceChildren(el("div", { class: "stack" }, [
      el("span", { class: "label", text: "Trophy room" }), el("h2", { text: got + " of " + list.length + " badges" }),
      el("div", { class: "badges" }, list.map(function (b) { return el("div", { class: "panel badge" + (b.got ? "" : " off") }, [el("div", { class: "medal", style: "background:" + b.color, text: b.got ? "★" : "?" }), el("h3", { text: b.name }), el("p", { class: "muted", style: "font-size:.85rem", text: b.how })]); })),
      el("span", { class: "label", style: "margin-top:20px", text: "Your certificate" }),
      el("div", { class: "cert" + (finished ? "" : " cert-locked") }, [
        el("div", { class: "title-blocks", style: "justify-content:center" }, COLORS.slice(0, 5).map(function (c) { return el("span", { style: "background:" + c }); })),
        el("span", { class: "label", style: "color:#5b6275", text: finished ? "Certificate of completion" : "Locked until you finish the Dream Game" }),
        el("div", { class: "name", text: state.name }),
        el("p", { style: "font-size:1.1rem;max-width:40ch", text: "designed, built, tested and published Roblox games with AI, and knows how to use AI smartly and safely." }),
        el("p", { style: "font-family:var(--display);font-weight:700;font-size:1.2rem", text: "Rank: " + RANKS[l - 1] + " · " + x + " XP · " + count(state.done) + "/8 games · " + count(state.qdone) + "/" + Q.length + " quests" }),
        el("p", { style: "color:#5b6275;font-size:.9rem", text: finished ? "Ask your grown-up to screenshot or print this and stick it on the fridge!" : "Keep going! Every step brings you closer." })
      ])
    ]));
  }

  // ---------- grown-ups ----------
  function viewGrownups() {
    var confirmBox = el("div", { class: "row" });
    function ask(text, label, action) {
      confirmBox.replaceChildren(el("span", { text: text }),
        el("button", { class: "btn small", style: "background:var(--red)", type: "button", text: label, onclick: action }),
        el("button", { class: "btn small ghost", type: "button", text: "Cancel", onclick: function () { confirmBox.replaceChildren(resetBtn, delBtn); } }));
    }
    var resetBtn = el("button", { class: "btn small ghost", type: "button", text: "Reset " + state.name + "'s progress", onclick: function () {
      ask("Erase all of " + state.name + "'s progress?", "Yes, erase", function () { var n = state.name, c = state.color; state = blank(); state.name = n; state.color = c; save(); go("map"); render(); });
    } });
    var delBtn = el("button", { class: "btn small ghost", type: "button", text: "Delete this creator", onclick: function () {
      ask("Delete " + state.name + " from this device?", "Yes, delete", function () {
        try { localStorage.removeItem("creator-quest-p-" + profiles.current); } catch (e) {}
        profiles.list = profiles.list.filter(function (p) { return p.id !== profiles.current; }); profiles.current = null; writeJSON(PKEY, profiles); state = blank();
        go(profiles.list.length ? "profiles" : "new"); render();
      });
    } });
    confirmBox.appendChild(resetBtn); confirmBox.appendChild(delBtn);
    var sound = el("button", { class: "btn small ghost", type: "button", text: state.sound ? "Sound: on" : "Sound: off", onclick: function () { state.sound = !state.sound; save(); viewGrownups(); } });
    app.replaceChildren(el("div", { class: "stack", style: "max-width:760px" }, [
      el("span", { class: "label", text: "For grown-ups" }), el("h2", { text: "You're the co-pilot" }),
      el("div", { class: "panel stack" }, [el("h3", { text: "Why you need to be there" }),
        el("p", { text: "Claude's terms require users to be 18 or older. Creator Quest is built for you and your kid together: Claude runs on your account, on your screen. Your kid picks what to build, edits the prompts and does the testing. You send the prompts in the Claude Desktop app, click Allow when Claude asks to use Studio, and stamp each big game when it's done." })]),
      el("div", { class: "panel stack" }, [el("h3", { text: "What you need" }), el("ul", { style: "margin:0;padding-left:1.2em" }, [
        el("li", { text: "A Windows PC or Mac. Roblox Studio doesn't run on phones, tablets or Chromebooks." }),
        el("li", { text: "Roblox Studio, free from create.roblox.com, and a Roblox account for your kid (turn on Parental Controls for under-13s)." }),
        el("li", { text: "The Claude Desktop app on the same computer, signed in to your Claude account. Big games are long builds, so a paid plan is smoother." }),
        el("li", { text: "Studio's built-in connector: Assistant ⋯ → Manage MCP Servers → Enable Studio as MCP server → Quick connect: Claude Desktop. The warm-up walks you through it." })])]),
      el("div", { class: "panel stack" }, [el("h3", { text: "How the path works" }),
        el("p", { text: "Unit 0 is a warm-up: install Studio and Claude Desktop, learn the panels, connect Claude to Studio, and do a first build. Then 8 units each end with a big game, with 3 short skill quests (10–15 minutes) before each one. Everything unlocks one step at a time: tips, checklist steps, power-ups, Prompt Lab rounds, and a new Vault pack after every big game." }),
        el("p", { class: "muted", text: "The Studio pictures are simplified drawings. Real buttons may look slightly different depending on your Studio version." })]),
      el("div", { class: "panel stack" }, [el("h3", { text: "Creators on this device" }), el("p", { text: "Each kid gets their own path, XP and badges. Switch by tapping the name in the top bar." }),
        el("div", { class: "row" }, [el("button", { class: "btn small ghost", type: "button", text: "Switch creator", onclick: function () { go("profiles"); } }), sound]), confirmBox,
        el("p", { class: "muted", style: "font-size:.9rem", text: "Progress is saved in this browser on this computer." })]),
      el("p", { class: "muted", style: "font-size:.85rem", text: "Creator Quest is an independent course. It is not made, sponsored or endorsed by Roblox Corporation or Anthropic. Roblox and Roblox Studio are trademarks of Roblox Corporation. Claude is a product of Anthropic." })
    ]));
  }

  function render() {
    hud();
    var h = (location.hash || "#map").slice(1);
    if (h === "new") return viewWelcome();
    if (!profiles.current) return profiles.list.length ? viewProfiles() : viewWelcome();
    if (h === "profiles") return viewProfiles();
    if (h.indexOf("mission-") === 0) viewMission(parseInt(h.slice(8), 10));
    else if (h.indexOf("quest-") === 0) viewQuest(h.slice(6));
    else if (h === "lab") viewLab();
    else if (h === "vault") viewVault();
    else if (h === "badges") viewBadges();
    else if (h === "grownups") viewGrownups();
    else viewMap();
    hud();
  }
  window.addEventListener("hashchange", function () { document.querySelectorAll(".modal-bg").forEach(function (b) { b.remove(); }); render(); window.scrollTo(0, 0); });
  render();
})();
