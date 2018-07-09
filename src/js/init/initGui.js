var dat = require('../lib/dat.gui.min.js');

module.exports = function() {
  var gui = new dat.GUI({ width: 200  });
  gui.remember(this.options);
  gui.useLocalStorage = true;
  gui.close();

  ///

  gui.add(this.options, 'show', Object.keys(this.objects))
    // .setValue('cubes')
    .onChange(function (value) {
      for (let obj of this.objects._active) {
        this.scene.remove(obj);
      }
      this.scene.add(this.objects[value]); 
    }.bind(this));
  
  ///

  var selectionFolder = gui.addFolder("selection");
  selectionFolder.open();

  let _defultHighlightMode = this.options.highlightMode;
  selectionFolder.add(this.options, "highlightMode", this.options._highlightMode)
    .setValue(_defultHighlightMode)
  
  selectionFolder.add(this.options, "hideLabels");

  ///

  var controlsFolder = gui.addFolder("controls");
  // controlsFolder.open();
  controlsFolder.add(this.controls, "enablePan");
  controlsFolder.add(this.controls, "enableZoom");
  controlsFolder.add(this.controls, "autoRotateSpeed", 0, 1);
  controlsFolder.add(this.controls, "minPolarAngle", 0, Math.PI);
  controlsFolder.add(this.controls, "maxPolarAngle", 0, Math.PI);

  ///

  var highlighterFolder = gui.addFolder("highlighter");
  // highlighterFolder.open();
  highlighterFolder.add(this.highlighter.pass, "edgeStrength", 0.01, 10);
  highlighterFolder.add(this.highlighter.pass, "edgeGlow", 0.0, 1.0, 0.1);
  highlighterFolder.add(this.highlighter.pass, "edgeThickness", 1, 4);
  highlighterFolder.add(this.highlighter.pass, "pulsePeriod", 0.0, 5);
  highlighterFolder.add(this.highlighter.pass, "usePatternTexture");
  var highlighterColors = {
    visibleEdgeColor: this.highlighter.pass.visibleEdgeColor.getHex(),
    hiddenEdgeColor: this.highlighter.pass.hiddenEdgeColor.getHex()
  };
  highlighterFolder
    .addColor(highlighterColors, "visibleEdgeColor")
    .onChange(value => this.highlighter.pass.visibleEdgeColor.set(value));
  highlighterFolder
    .addColor(highlighterColors, "hiddenEdgeColor")
    .onChange(value => this.highlighter.pass.hiddenEdgeColor.set(value));
}
