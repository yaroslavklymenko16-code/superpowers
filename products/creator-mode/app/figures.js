// Simplified drawings of Roblox Studio and Claude that point at the exact button for a step.
// Drawn with HTML so they stay sharp and small. Not real screenshots: Studio may look a little different.
window.FIGURES = (function () {
  var FRAME_STUDIO = "Roblox Studio · simplified drawing";
  var F = {
    new: {
      cap: "Click New, then Baseplate.",
      body: '<div class="fg-row"><div class="fg-side"><b class="fg-hot">New</b><span>My Games</span><span>Recent</span></div>' +
        '<div class="fg-tiles"><div class="fg-tile fg-hot"><i class="fg-sky"></i>Baseplate<em class="fg-tag">Click!</em></div><div class="fg-tile"><i class="fg-grass"></i>Flat Terrain</div><div class="fg-tile"><i class="fg-city"></i>City</div><div class="fg-tile"><i class="fg-sky"></i>Classic</div></div></div>'
    },
    panels: {
      cap: "View tab → turn on Explorer, Properties and Output.",
      body: '<div class="fg-tabs"><span>Home</span><span>Model</span><span>Test</span><b class="fg-hot">View</b></div>' +
        '<div class="fg-ribbon"><span class="fg-btn fg-hot">Explorer</span><span class="fg-btn fg-hot">Properties</span><span class="fg-btn fg-hot">Output</span><span class="fg-btn">Toolbox</span><span class="fg-btn">Command Bar</span></div>'
    },
    explorer: {
      cap: "Hover ServerScriptService, click +, choose Script.",
      body: '<div class="fg-row"><div class="fg-panel"><div class="fg-ptitle">Explorer</div>' +
        '<div class="fg-item">▸ Workspace</div><div class="fg-item">▸ Players</div><div class="fg-item">▸ Lighting</div><div class="fg-item">▸ ReplicatedStorage</div>' +
        '<div class="fg-item fg-hotrow">▸ ServerScriptService <span class="fg-plus fg-hot">+</span></div><div class="fg-item">▸ ServerStorage</div><div class="fg-item">▸ StarterGui</div><div class="fg-item">▸ StarterPack</div></div>' +
        '<div class="fg-menu"><div class="fg-mi fg-hot">Script<em class="fg-tag">This one!</em></div><div class="fg-mi">LocalScript</div><div class="fg-mi">ModuleScript</div><div class="fg-mi">Folder</div></div></div>'
    },
    editor: {
      cap: "Delete the Hello world line. Paste Claude's script in its place.",
      body: '<div class="fg-tabs"><b>Script ✕</b></div><div class="fg-code"><div><span class="fg-ln">1</span><s class="fg-hot">print("Hello world!")</s><em class="fg-tag">Delete me</em></div>' +
        '<div><span class="fg-ln">2</span><i class="fg-cursor"></i><span class="fg-dim">← paste Claude\'s script here</span></div></div>'
    },
    play: {
      cap: "Play (or F5) to test. Stop to go back to building.",
      body: '<div class="fg-tabs"><b>Home</b><span>Model</span><span>Test</span><span>View</span></div>' +
        '<div class="fg-ribbon"><span class="fg-btn">Part</span><span class="fg-btn">Move</span><span class="fg-btn">Scale</span><span class="fg-btn fg-play fg-hot">▶ Play</span><span class="fg-btn">■ Stop</span></div>'
    },
    output: {
      cap: "Copy the red line and send it to Claude with your script.",
      body: '<div class="fg-panel fg-wide"><div class="fg-ptitle">Output</div><div class="fg-item fg-dim">14:02:11 Hello world!</div>' +
        '<div class="fg-item fg-err fg-hot">ServerScriptService.Script:12: attempt to index nil with \'Value\'<em class="fg-tag">Copy this</em></div></div>'
    },
    properties: {
      cap: "Click a part, then change it in Properties.",
      body: '<div class="fg-panel fg-wide"><div class="fg-ptitle">Properties · Part</div><div class="fg-prop"><span>BrickColor</span><span>Medium stone grey</span></div>' +
        '<div class="fg-prop fg-hotrow"><span>Color</span><span><i class="fg-sw"></i> pick a color!</span></div><div class="fg-prop fg-hotrow"><span>Material</span><span>Neon ▾</span></div>' +
        '<div class="fg-prop"><span>Anchored</span><span>☑</span></div><div class="fg-prop"><span>Transparency</span><span>0</span></div></div>'
    },
    insert: {
      cap: "Right-click Workspace → Insert from File → pick a Vault pack.",
      body: '<div class="fg-row"><div class="fg-panel"><div class="fg-ptitle">Explorer</div><div class="fg-item fg-hotrow">▸ Workspace</div><div class="fg-item">▸ Players</div><div class="fg-item">▸ Lighting</div></div>' +
        '<div class="fg-menu"><div class="fg-mi">Insert Object</div><div class="fg-mi fg-hot">Insert from File…<em class="fg-tag">Click!</em></div><div class="fg-mi">Paste Into</div><div class="fg-mi">Rename</div></div></div>',
      frame: FRAME_STUDIO
    },
    claude: {
      cap: "Grown-up pastes the prompt into Claude and presses send.",
      frame: "claude.ai · on your grown-up's account",
      body: '<div class="fg-chat"><div class="fg-bubble">Here\'s your script! Paste it into a Script in ServerScriptService…<div class="fg-mini">local part = Instance.new("Part")…</div></div>' +
        '<div class="fg-input fg-hot"><span>Write a Roblox Script for ServerScriptService that…</span><b class="fg-send">↑</b></div></div>'
    }
  };
  function make(name) {
    var f = F[name];
    if (!f) return null;
    var d = document.createElement("figure");
    d.className = "fig";
    d.innerHTML = '<div class="fg-bar"><i></i><i></i><i></i><span>' + (f.frame || FRAME_STUDIO) + '</span></div><div class="fg-body">' + f.body + '</div><figcaption>' + f.cap + '</figcaption>';
    return d;
  }
  // Pick a picture for a step automatically when the step mentions a Studio place.
  function guess(text) {
    if (/ServerScriptService/.test(text)) return "explorer";
    if (/Output/.test(text)) return "output";
    if (/Insert from File/.test(text)) return "insert";
    if (/press Play|Press Play/.test(text)) return "play";
    return null;
  }
  return { make: make, guess: guess, names: Object.keys(F) };
})();
