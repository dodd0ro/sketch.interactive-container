const config = {
  THREE_DIV_ID: 'three',
  MODEL_PATH: 'assets/models/container3.obj',
};


const globals = {
  //
  containerDiv: null,
  canvasWidth: null,
  canvasHeight: null,
  //
  scene: null,
  camera: null,
  //
  renderer: null,
  labelRenderer: null,
  composer: null,
  composerPasses: [],
  //
  controls: null,
  hoverer: null,
  highlighter: null,
  visibiler: null,
  //
  animate: null
};


const options = {
  _highlightMode: [
    'outline', // 0
    'emissive' // 1
  ],
  highlightMode: 'emissive',
  hideLabels: true,
  show: 'cubes'
};


const objects = {};
Object.defineProperty(objects, '_active', {
  value: [],
  enumerable: false,
  configurable: true,
  writable: false
});

window.onload = function () {
  require('./init/initBase');
  require('./init/initEvents');
  require('./init/initScene');
  require('./init/initGui');
	require('./lib/myThree/animate')();
};


module.exports = {config, globals, options, objects}