window.g = require('./threeGlobals');

window.onload = function () {
  require('./init/initScene');
  require('./init/initModel');
  require('./init/initEvents');
  require('./init/initGui');
  g.animate();
};
