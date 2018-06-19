var gui = new dat.GUI( { width: 200 } );
gui.close();

gui.add(grid, 'visible').name('grid')


var controlsFolder = gui.addFolder('controls');
controlsFolder.open();
controlsFolder.add(controls, 'enablePan');
controlsFolder.add(controls, 'enableZoom');
controlsFolder.add(controls, 'autoRotateSpeed', 0, 1);
controlsFolder.add(controls, 'minPolarAngle', 0, Math.PI);
controlsFolder.add(controls, 'maxPolarAngle', 0, Math.PI);

var renderFolder = gui.addFolder('render');
renderFolder.open();
renderFolder.add(renderer.shadowMap, 'enabled').onFinishChange();

var highlighterFolder = gui.addFolder('highlighter');
highlighterFolder.open();
highlighterFolder.add(highlighter.pass, 'edgeStrength', 0.01, 10 );
highlighterFolder.add(highlighter.pass, 'edgeGlow', 0.0, 1.0 , 0.1);
highlighterFolder.add(highlighter.pass, 'edgeThickness', 1, 4 );
highlighterFolder.add(highlighter.pass, 'pulsePeriod', 0.0, 5 );
highlighterFolder.add(highlighter.pass, 'usePatternTexture');
var highlighterColors = {
  visibleEdgeColor: highlighter.pass.visibleEdgeColor.getHex(),
  hiddenEdgeColor: highlighter.pass.hiddenEdgeColor.getHex()
};
highlighterFolder.addColor(highlighterColors, 'visibleEdgeColor').onChange( 
  ( value ) => highlighter.pass.visibleEdgeColor.set( value )
);
highlighterFolder.addColor(highlighterColors, 'hiddenEdgeColor').onChange(
  ( value ) => highlighter.pass.hiddenEdgeColor.set( value )
);

