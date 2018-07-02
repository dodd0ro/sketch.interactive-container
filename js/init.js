const THREE_DIV_ID = "three";
const MODEL_PATH = "../model/container3.obj";

const Options = {
  _highlightMode: [
    "outline", // 0
    "emissive" // 1
  ],
  highlightMode: "emissive",

  hideLabels: true,
  _show: ["container", "geometry"],
  show: "geometry"
};

/////////////////////////////////////////////////////

var containerDiv, canvasWidth, canvasHeight;
var scene, camera;
var renderer,
  labelRenderer,
  composer,
  composerPasses = [];
var controls, hoverer, highlighter, visibiler;

/////////////////////////////////////////////////////

function animate() {
  requestAnimationFrame(animate);

  // onTick
  for (let i = 0; i < animate.funcs.length; i++) {
    animate.funcs[i]();
  }

  controls.update();
  hoverer.update();

  // onTickEnd
  for (let i = 0; i < animate.funcsLast.length; i++) {
    animate.funcsLast[i]();
  }
  if (Options.highlightMode == "emissive") renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  if (Options.highlightMode == "outline") composer.render();
}

animate.funcs = [];
animate.onTick = function(func) {
  animate.funcs.push(func);
};

animate.funcsLast = [];
animate.onTickEnd = function(func) {
  animate.funcsLast.push(func);
};

/////////////////////////////////////////////////////

function initEvents() {
  /* RESIZE */

  containerDiv.addEventListener(
    "resize",
    function() {
      canvasWidth = containerDiv.clientWidth;
      canvasHeight = containerDiv.clientHeight;

      ///

      renderer.setSize(canvasWidth, canvasHeight);
      labelRenderer.setSize(canvasWidth, canvasHeight);

      ///

      let aspectRatio = canvasWidth / canvasHeight;

      for (let camera of cameras) {
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
      }
    },
    false
  );

  /* HIGHLIGHT */

  let tmb_HighlightOn = new Tumblered(Options, "highlightMode");
  let tmb_HighlightOff = new Tumblered(Options, "highlightMode");

  // outline

  tmb_HighlightOn.on("outline", function(obj) {
    highlighter.set(obj);
  });

  tmb_HighlightOff.on("outline", function() {
    highlighter.clear();
  });

  // emissive

  tmb_HighlightOn.on("emissive", function(obj) {
    obj.currentHex = obj.material.emissive.getHex();
    obj.material.emissive.setHex(new THREE.Color("#005e00").getHex());
  });

  tmb_HighlightOff.on("emissive", function(obj) {
    obj.material.emissive.setHex(obj.currentHex);
  });

  ///

  hoverer.onMouseOver(tmb_HighlightOn.getFunction());
  hoverer.onMouseOut(tmb_HighlightOff.getFunction());
}

/////////////////////////////////////////////////////

function init() {
  /* CONTAINER DIV */

  containerDiv = document.getElementById(THREE_DIV_ID);
  containerDiv.style.position = "relative";
  if (!(containerDiv.clientWidth && containerDiv.clientHeight)) {
    throw "Container div doesn't have size";
  }
  canvasWidth = containerDiv.clientWidth;
  canvasHeight = containerDiv.clientHeight;

  /* SCENE */

  scene = new THREE.Scene();
  scene.background = new THREE.Color("white");
  scene.fog = new THREE.FogExp2(new THREE.Color("#ffffff"), 0.0025);

  /* CAMERA */

  camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 1, 1000);
  camera.position.set(-100, 150, 250);

  /* RENDERER */

  renderer = new THREE.WebGLRenderer({
    antialias: true
    // alpha: true,
  });
  renderer.setClearColor(0xffffff);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize(canvasWidth, canvasHeight);
  containerDiv.appendChild(renderer.domElement);
  containerDiv.appendChild(renderer.domElement);

  /* LABEL RENDERER */

  labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize(canvasWidth, canvasHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = 0;
  labelRenderer.domElement.style.overflow = "visible";
  containerDiv.appendChild(labelRenderer.domElement);
  // document.querySelector('#three > div')

  /* CONTROLS */

  controls = new THREE.OrbitControls(camera, containerDiv);

  controls.rotateSpeed = 0.15; // 1

  controls.enableDamping = true;
  controls.dampingFactor = 0.1; // 0.25

  controls.minPolarAngle = Math.PI * 0.25;
  controls.maxPolarAngle = Math.PI * 0.49;

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.025; // 2

  controls.enableKeys = false;
  controls.enablePan = false;
  controls.enableZoom = false;

  /* HOVERER */

  hoverer = new Hoverer(renderer.domElement, camera);

  /* HIGHLIGHTER */

  highlighter = new Highlighter(
    renderer.domElement,
    scene,
    camera,
    "../../assets/tri_pattern.jpg"
  );
  composerPasses.push(highlighter.pass);

  /* VISIBILER */

  visibiler = new Visibiler(renderer.domElement, camera);

  /* COMPOSER */

  composer = new THREE.EffectComposer(renderer);

  let renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  for (let pass of composerPasses) {
    composer.addPass(pass);
  }

  let effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(
    1 / canvasWidth,
    1 / canvasHeight
  );
  effectFXAA.renderToScreen = true;
  composer.addPass(effectFXAA);
}

/////////////////////////////////////////////////////

function initGui() {
  var gui = new dat.GUI({ width: 200 });
  // gui.remember(Options);
  gui.close();

  gui.add(grid, "visible").name("grid");
  // gui.add(Options, 'show', Options._show).onChange (function(value){

  //   if (value == 'geometry') {
  //     scene.remove(modelGroup);
  //     scene.add(geometryGroup);
  //   } else if(value == 'container') {
  //     scene.remove(geometryGroup);
  //     scene.add(modelGroup);
  //   }

  // });

  var selectionFolder = gui.addFolder("selection");
  selectionFolder.open();
  selectionFolder.add(Options, "highlightMode", Options._highlightMode);
  selectionFolder.add(Options, "hideLabels").onChange(function(value) {
    infoLabels.forEach(function(label) {
      if (value) {
        label.hide();
        label.showBySelector("ul");
      } else {
        label.show();
        label.hideBySelector("ul");
      }
    });
  });

  var controlsFolder = gui.addFolder("controls");
  // controlsFolder.open();
  controlsFolder.add(controls, "enablePan");
  controlsFolder.add(controls, "enableZoom");
  controlsFolder.add(controls, "autoRotateSpeed", 0, 1);
  controlsFolder.add(controls, "minPolarAngle", 0, Math.PI);
  controlsFolder.add(controls, "maxPolarAngle", 0, Math.PI);

  var highlighterFolder = gui.addFolder("highlighter");
  // highlighterFolder.open();
  highlighterFolder.add(highlighter.pass, "edgeStrength", 0.01, 10);
  highlighterFolder.add(highlighter.pass, "edgeGlow", 0.0, 1.0, 0.1);
  highlighterFolder.add(highlighter.pass, "edgeThickness", 1, 4);
  highlighterFolder.add(highlighter.pass, "pulsePeriod", 0.0, 5);
  highlighterFolder.add(highlighter.pass, "usePatternTexture");
  var highlighterColors = {
    visibleEdgeColor: highlighter.pass.visibleEdgeColor.getHex(),
    hiddenEdgeColor: highlighter.pass.hiddenEdgeColor.getHex()
  };
  highlighterFolder
    .addColor(highlighterColors, "visibleEdgeColor")
    .onChange(value => highlighter.pass.visibleEdgeColor.set(value));
  highlighterFolder
    .addColor(highlighterColors, "hiddenEdgeColor")
    .onChange(value => highlighter.pass.hiddenEdgeColor.set(value));
}

/////////////////////////////////////////////////////
