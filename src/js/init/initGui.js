const dat = require('../lib/dat.gui.min.js');
const matLib = require('../materialLib');

const g = require('../threeGlobals');


///

var gui = new dat.GUI({ width: 200  });
gui.remember(g.options);
gui.useLocalStorage = true;
gui.close();

gui.constructor.prototype.addThreeColor = function (mat, property) {
  let _mat = {};
  _mat[property] = mat[property].getHex();

  return this.addColor(_mat, property)
    .onChange((color) => {
      mat[property] = new THREE.Color(color);
      mat.needsUpdate = true;
    });
}



///


// gui.add(g.options, 'show', Object.keys(threeObjs))
//   // .setValue('cubes')
//   .onChange(function (value) {
//     for (let obj of threeObjs._active) {
//       obj.traverse(function (child) {
//         child.visible = false;
//       })
//       g.scene.remove(obj);
//     }

//     let activeObj = threeObjs[value];
//     activeObj.traverse(function (child) {
//       child.visible = true;
//     })
//     g.scene.add(activeObj); 
//   });

///

var selectionFolder = gui.addFolder("selection");
selectionFolder.open();

let _defultHighlightMode = g.options.highlightMode;
selectionFolder.add(g.options, "highlightMode", g.options._highlightMode)
  .setValue(_defultHighlightMode)

selectionFolder.add(g.options, "hideLabels");

///

var controlsFolder = gui.addFolder("controls");
// controlsFolder.open();
controlsFolder.add(g.controls, "enablePan");
controlsFolder.add(g.controls, "enableZoom");
controlsFolder.add(g.controls, "autoRotateSpeed", 0, 1);
controlsFolder.add(g.controls, "minPolarAngle", 0, Math.PI);
controlsFolder.add(g.controls, "maxPolarAngle", 0, Math.PI);

///

var highlighterFolder = gui.addFolder("light");
highlighterFolder.add(g.scene.getObjectByName('ambLight'), 'intensity');
let dirLight = g.scene.getObjectByName('dirLight'); // #bad!
let dirLightPositionArray = dirLight.position.clone();
for (let axis of ['x', 'y', 'z']) {
  highlighterFolder.add(dirLightPositionArray, axis)
  .onChange((value) => {
    dirLight.position['set'+ axis.toUpperCase()](value);
  });
}

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


var matirealsFolder = gui.addFolder('materials');
for (let matName in matLib) {
  let mat = matLib[matName];
  let matFolder = matirealsFolder.addFolder(matName);

  for (let prop in matLib._options[matName]) {
    let val = matLib[matName][prop];
    if (val === null) continue;

    let type = typeof (val);
    if (type === 'object') {
      type = matLib[matName][prop].constructor.name;
    }

    switch (type) {
      case 'Color':
        matFolder.addThreeColor(matLib[matName], prop);
        break;
      case 'number':
        matFolder.add(matLib[matName], prop);
        break;
    }


    
    
    
  }
  
  // matFolder.addThreeColor(mat, 'color');
  // matFolder.addThreeColor(mat, 'specular');
  // matFolder.add(mat, 'shininess', 0, 100);
}



