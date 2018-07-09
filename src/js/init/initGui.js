const dat = require('../lib/dat.gui.min.js');

const {
  globals: g,
  objects: threeObjs,
  options
} = require('../threeGlobals');

///

var gui = new dat.GUI({ width: 200  });
gui.remember(options);
gui.useLocalStorage = true;
gui.close();

///

gui.add(options, 'show', Object.keys(threeObjs))
  // .setValue('cubes')
  .onChange(function (value) {
    for (let obj of threeObjs._active) {
      g.scene.remove(obj);
    }
    g.scene.add(threeObjs[value]); 
  });

///

var selectionFolder = gui.addFolder("selection");
selectionFolder.open();

let _defultHighlightMode = options.highlightMode;
selectionFolder.add(options, "highlightMode", options._highlightMode)
  .setValue(_defultHighlightMode)

selectionFolder.add(options, "hideLabels");

///

var controlsFolder = gui.addFolder("controls");
// controlsFolder.open();
controlsFolder.add(g.controls, "enablePan");
controlsFolder.add(g.controls, "enableZoom");
controlsFolder.add(g.controls, "autoRotateSpeed", 0, 1);
controlsFolder.add(g.controls, "minPolarAngle", 0, Math.PI);
controlsFolder.add(g.controls, "maxPolarAngle", 0, Math.PI);

///

var highlighterFolder = gui.addFolder("highlighter");
// highlighterFolder.open();
highlighterFolder.add(g.highlighter.pass, "edgeStrength", 0.01, 10);
highlighterFolder.add(g.highlighter.pass, "edgeGlow", 0.0, 1.0, 0.1);
highlighterFolder.add(g.highlighter.pass, "edgeThickness", 1, 4);
highlighterFolder.add(g.highlighter.pass, "pulsePeriod", 0.0, 5);
highlighterFolder.add(g.highlighter.pass, "usePatternTexture");
var highlighterColors = {
  visibleEdgeColor: g.highlighter.pass.visibleEdgeColor.getHex(),
  hiddenEdgeColor: g.highlighter.pass.hiddenEdgeColor.getHex()
};
highlighterFolder
  .addColor(highlighterColors, "visibleEdgeColor")
  .onChange(value => g.highlighter.pass.visibleEdgeColor.set(value));
highlighterFolder
  .addColor(highlighterColors, "hiddenEdgeColor")
  .onChange(value => g.highlighter.pass.hiddenEdgeColor.set(value));

