global.THREE = require('./lib/three/three.js'); // #bad-global

require('./lib/three/OrbitControls.js');
require('./lib/three/CSS2DRenderer.js');
require('./lib/three/OBJLoader.js');

require('./lib/three/pp/CopyShader.js');
require('./lib/three/pp/EffectComposer.js');
require('./lib/three/pp/FXAAShader.js');
require('./lib/three/pp/OutlinePass.js');
require('./lib/three/pp/RenderPass.js');
require('./lib/three/pp/ShaderPass.js');

///

tree = {
  THREE_DIV_ID: 'three',
  MODEL_PATH: 'assets/models/container3.obj',
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
  objects: {
    _active: []
  },
  animate: require('./animate.js'),
  init: require('./init/init.js'),
  //
  options: {
    _highlightMode: [
      'outline', // 0
      'emissive' // 1
    ],
    highlightMode: 'emissive',
  
    hideLabels: true,
    show: 'cubes'
  }
}

Object.defineProperty(tree.objects, '_active', {
  value: tree.objects._active,
  enumerable: false,
  configurable: true,
  writable: false
});

/////////////////////////////////////////////////

window.onload = function () {
  tree.init();
	tree.animate();
};
