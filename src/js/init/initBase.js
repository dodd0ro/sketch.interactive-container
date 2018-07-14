const THREE = require('../lib/myThree/THREE.js');
const Hoverer = require('../lib/myThree/Hoverer');
const Visibiler = require('../lib/myThree/Visibliler')
const Highlighter = require('../lib/myThree/Highlighter');
const animate = require('../lib/myThree/animate');

const {
  globals: g,
  config
} = require('../threeGlobals');


/* CONTAINER DIV */

g.containerDiv = document.getElementById(config.THREE_DIV_ID);
g.containerDiv.style.position = "relative";
if (!(g.containerDiv.clientWidth && g.containerDiv.clientHeight)) {
  throw "Container div doesn't have size";
}
g.canvasWidth = g.containerDiv.clientWidth;
g.canvasHeight = g.containerDiv.clientHeight;

/* SCENE */

g.scene = new THREE.Scene();
g.scene.background = new THREE.Color("white");
g.scene.fog = new THREE.FogExp2(
  new THREE.Color("#ffffff"), 0.0005  // 0.0025
); 

/* CAMERA */

g.camera = new THREE.PerspectiveCamera(60, g.canvasWidth / g.canvasHeight, 1, 2000);
g.camera.position.set(-600, 200, 600);

/* RENDERER */

g.renderer = new THREE.WebGLRenderer({
  antialias: true
  // alpha: true,
});
g.renderer.setClearColor(0xffffff);
g.renderer.shadowMap.enabled = true;
g.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

g.renderer.setSize(g.canvasWidth, g.canvasHeight);
g.containerDiv.appendChild(g.renderer.domElement);
g.containerDiv.appendChild(g.renderer.domElement);

/* LABEL RENDERER */

g.labelRenderer = new THREE.CSS2DRenderer();
g.labelRenderer.setSize(g.canvasWidth, g.canvasHeight);
g.labelRenderer.domElement.style.position = "absolute";
g.labelRenderer.domElement.style.top = 0;
g.labelRenderer.domElement.style.overflow = "visible";
g.containerDiv.appendChild(g.labelRenderer.domElement);
// document.querySelector('#three > div')

/* ANIMATE */

g.animate = animate;

/* CONTROLS */

g.controls = new THREE.OrbitControls(g.camera, g.containerDiv);
g.controls.target = new THREE.Vector3(0, 200, 0);

g.controls.rotateSpeed = 0.15; // 1

g.controls.enableDamping = true;
g.controls.dampingFactor = 0.1; // 0.25

g.controls.minPolarAngle = Math.PI * 0.35;
g.controls.maxPolarAngle = Math.PI * 0.49;

g.controls.autoRotate = true;
g.controls.autoRotateSpeed = 0.025; // 2

g.controls.enableKeys = false;
g.controls.enablePan = false;
g.controls.enableZoom = false;

/* HOVERER */

g.hoverer = new Hoverer(g.camera);

/* HIGHLIGHTER */

g.highlighter = new Highlighter(
  g.renderer.domElement,
  g.scene,
  g.camera,
  "../../assets/tri_pattern.jpg"
);
g.composerPasses.push(g.highlighter.pass);

/* VISIBILER */

g.visibiler = new Visibiler(g.camera);

/* COMPOSER */

g.composer = new THREE.EffectComposer(g.renderer);

let renderPass = new THREE.RenderPass(g.scene, g.camera);
g.composer.addPass(renderPass);

for (let pass of g.composerPasses) {
  g.composer.addPass(pass);
}

let effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / g.canvasWidth,
  1 / g.canvasHeight
);
effectFXAA.renderToScreen = true;
g.composer.addPass(effectFXAA);


