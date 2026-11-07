// Creator Vault 3D viewer: turns catalog parts into a three.js group. Needs global THREE (r128).
window.VaultViewer = (function () {
  function buildModel(model) {
    var group = new THREE.Group();
    var box = new THREE.BoxGeometry(1, 1, 1);
    var ball = new THREE.SphereGeometry(0.5, 20, 14);
    var cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 22);
    cyl.rotateZ(Math.PI / 2); // Roblox cylinders run along X
    model.parts.forEach(function (p) {
      if (p.h) return; // invisible helper parts
      var geo = p.s === "ball" ? ball : p.s === "cyl" ? cyl : box;
      var color = new THREE.Color(p.c);
      var mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: p.g ? 0.4 : 0.75,
        metalness: 0.05,
        emissive: p.g ? color : new THREE.Color(0x000000),
        emissiveIntensity: p.g ? 0.65 : 0,
        transparent: p.t > 0,
        opacity: 1 - p.t,
      });
      var mesh = new THREE.Mesh(geo, mat);
      var s = p.z;
      if (p.s === "ball") {
        var d = Math.min(s[0], s[1], s[2]);
        mesh.scale.set(d, d, d);
      } else if (p.s === "cyl") {
        var dia = Math.min(s[1], s[2]);
        mesh.scale.set(s[0], dia, dia);
      } else {
        mesh.scale.set(s[0], s[1], s[2]);
      }
      if (p.cls === "TrussPart") mat.wireframe = true;
      var r = p.r;
      var m = new THREE.Matrix4().set(r[0], r[1], r[2], 0, r[3], r[4], r[5], 0, r[6], r[7], r[8], 0, 0, 0, 0, 1);
      var q = new THREE.Quaternion().setFromRotationMatrix(m);
      mesh.quaternion.copy(q);
      mesh.position.set(p.p[0], p.p[1], p.p[2]);
      group.add(mesh);
    });
    return group;
  }

  function lights(scene) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.9));
    var sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(-20, 40, -30);
    scene.add(sun);
  }

  function frame(camera, group) {
    var b = new THREE.Box3().setFromObject(group);
    var size = b.getSize(new THREE.Vector3());
    var center = b.getCenter(new THREE.Vector3());
    var radius = Math.max(size.x, size.y, size.z) * 0.85 + 1;
    camera.position.set(center.x - radius * 1.1, center.y + radius * 0.8, center.z - radius * 1.3);
    camera.lookAt(center);
    return center;
  }

  // Interactive viewer that auto-spins and can be dragged.
  function mount(canvas) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    lights(scene);
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    var pivot = new THREE.Group();
    scene.add(pivot);
    var current = null, center = new THREE.Vector3(), angle = 0, dragging = false, lastX = 0, spin = true;
    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    function show(model) {
      if (current) pivot.remove(current);
      current = buildModel(model);
      pivot.add(current);
      pivot.rotation.y = 0;
      center = frame(camera, current);
      current.position.sub(new THREE.Vector3(center.x, 0, center.z));
      center.set(0, center.y, 0);
      camera.lookAt(center);
    }
    canvas.addEventListener("pointerdown", function (e) { dragging = true; spin = false; lastX = e.clientX; });
    window.addEventListener("pointerup", function () { dragging = false; });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      angle += (e.clientX - lastX) * 0.01;
      lastX = e.clientX;
    });
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function loop() {
      resize();
      if (spin && !reduce) angle += 0.008;
      pivot.rotation.y = angle;
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    loop();
    return { show: show };
  }

  // Renders a still image of a model (for the grid of thumbnails).
  var thumbRenderer = null;
  function thumbnail(model, size) {
    size = size || 160;
    if (!thumbRenderer) {
      thumbRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    }
    thumbRenderer.setSize(size, size, false);
    var scene = new THREE.Scene();
    lights(scene);
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    var g = buildModel(model);
    scene.add(g);
    frame(camera, g);
    thumbRenderer.render(scene, camera);
    return thumbRenderer.domElement.toDataURL("image/png");
  }

  return { mount: mount, thumbnail: thumbnail, buildModel: buildModel };
})();
