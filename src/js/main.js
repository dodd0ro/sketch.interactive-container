const {globals:g} = require('./threeGlobals');

window.onload = function () {
  require('./init/initBase');
  require('./init/initScene');
  require('./init/initEvents');
  require('./init/initAnimations');
  require('./init/initGui');
  g.animate();
};
