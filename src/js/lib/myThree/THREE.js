const THREE = require('../three/three.js'); // #bad-global

global.THREE = THREE;

require('../three/OrbitControls.js');
require('../three/CSS2DRenderer.js');
require('../three/OBJLoader.js');

require('../three/pp/CopyShader.js');
require('../three/pp/EffectComposer.js');
require('../three/pp/FXAAShader.js');
require('../three/pp/OutlinePass.js');
require('../three/pp/RenderPass.js');
require('../three/pp/ShaderPass.js');

module.exports = THREE;