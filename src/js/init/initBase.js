
const THREE = require('../lib/three/three.js');
const Hoverer = require('../lib/myThree/Hoverer');
const Visibiler = require('../lib/myThree/Visibliler')
const Highlighter = require('../lib/myThree/Highlighter');

function init() {
  /* CONTAINER DIV */

  this.containerDiv = document.getElementById(this.THREE_DIV_ID);
  this.containerDiv.style.position = "relative";
  if (!(this.containerDiv.clientWidth && this.containerDiv.clientHeight)) {
    throw "Container div doesn't have size";
  }
  this.canvasWidth = this.containerDiv.clientWidth;
  this.canvasHeight = this.containerDiv.clientHeight;

  /* SCENE */

  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color("white");
  this.scene.fog = new THREE.FogExp2(new THREE.Color("#ffffff"), 0.0025);

  /* CAMERA */

  this.camera = new THREE.PerspectiveCamera(60, this.canvasWidth / this.canvasHeight, 1, 1000);
  this.camera.position.set(-100, 150, 250);

  /* RENDERER */

  this.renderer = new THREE.WebGLRenderer({
    antialias: true
    // alpha: true,
  });
  this.renderer.setClearColor(0xffffff);
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  this.renderer.setSize(this.canvasWidth, this.canvasHeight);
  this.containerDiv.appendChild(this.renderer.domElement);
  this.containerDiv.appendChild(this.renderer.domElement);

  /* LABEL RENDERER */

  this.labelRenderer = new THREE.CSS2DRenderer();
  this.labelRenderer.setSize(this.canvasWidth, this.canvasHeight);
  this.labelRenderer.domElement.style.position = "absolute";
  this.labelRenderer.domElement.style.top = 0;
  this.labelRenderer.domElement.style.overflow = "visible";
  this.containerDiv.appendChild(this.labelRenderer.domElement);
  // document.querySelector('#three > div')

  /* CONTROLS */

  this.controls = new THREE.OrbitControls(this.camera, this.containerDiv);

  this.controls.rotateSpeed = 0.15; // 1

  this.controls.enableDamping = true;
  this.controls.dampingFactor = 0.1; // 0.25

  this.controls.minPolarAngle = Math.PI * 0.25;
  this.controls.maxPolarAngle = Math.PI * 0.49;

  this.controls.autoRotate = true;
  this.controls.autoRotateSpeed = 0.025; // 2

  this.controls.enableKeys = false;
  this.controls.enablePan = false;
  this.controls.enableZoom = false;

  /* HOVERER */

  this.hoverer = new Hoverer(this.camera);

  /* HIGHLIGHTER */
  
  this.highlighter = new Highlighter(
    this.renderer.domElement,
    this.scene,
    this.camera,
    "../../assets/tri_pattern.jpg"
  );
  this.composerPasses.push(this.highlighter.pass);

  /* VISIBILER */

  this.visibiler = new Visibiler(this.camera);

  /* COMPOSER */

  this.composer = new THREE.EffectComposer(this.renderer);

  let renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.composer.addPass(renderPass);

  for (let pass of this.composerPasses) {
    this.composer.addPass(pass);
  }

  let effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(
    1 / this.canvasWidth,
    1 / this.canvasHeight
  );
  effectFXAA.renderToScreen = true;
  this.composer.addPass(effectFXAA);


}

module.exports = init;