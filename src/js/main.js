const {globals:g} = require('./threeGlobals');

window.onload = function () {
  require('./init/initBase');
  require('./init/initEvents');
  require('./init/initScene');
  require('./init/initGui');
	g.animate();
};
