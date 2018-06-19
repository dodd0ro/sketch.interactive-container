var canvas;
var scene, camera;
var controls, hoverer, highlighter;
var renderer, composer, composerPasses = [];

////////////////////////////

function animate() {

  requestAnimationFrame( animate );
  
  for (let i = 0; i < animate.funcs.length; i++) {
    animate.funcs[i]();
  }

  for (let i = 0; i < animate.funcsLast.length; i++) {
    animate.funcsLast[i]();
  }
  

};

animate.funcs = [];
animate.add = function(func) {
  animate.funcs.push(func);
}
animate.funcsLast = [];
animate.addLast = function(func) {
  animate.funcsLast.push(func);
}



function init() {

  canvas = document.getElementById( CANVAS_ID );

  /* SCENE */

  scene = new THREE.Scene();
  scene.background = new THREE.Color('white')
  /* CAMERA */

  camera = new THREE.PerspectiveCamera(
    60,
    canvas.offsetWidth / canvas.offsetHeight,
    1,
    1000
  );
  camera.position.set( 0, 280, 180 );
  // camera.lookAt( scene.position );


  /* CONTROLS */

  controls = new THREE.OrbitControls( camera, canvas ); 
  
    controls.rotateSpeed  = 0.20  // 1

    controls.enableDamping = true;
    controls.dampingFactor = 0.1  // 0.25

    controls.minPolarAngle = Math.PI * 0.1;
    controls.maxPolarAngle = Math.PI * 0.49;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.05;  // 2

    controls.enableKeys = false;
    controls.enablePan = false;
    controls.enableZoom = false;

  animate.add(()=>controls.update());

  /* HOVERER */

  hoverer = new Hoverer ( camera, canvas );

  highlighter = new Highlighter(
    canvas, scene, camera, '../../assets/tri_pattern.jpg'
  );
  highlighter.pass.visibleEdgeColor.set( 0xFF - (new THREE.Color('#00ff0f')).getHex() );
  highlighter.pass.hiddenEdgeColor.set( 0xFF - (new THREE.Color('#002001')).getHex() );
  highlighter.pass.pulsePeriod = 2;  // 2
  highlighter.pass.edgeStrength = 3;  // 3
  highlighter.pass.edgeThickness = 1; // 1
  composerPasses.push(highlighter.pass);


  hoverer.onMouseOver = function (obj) {
    highlighter.add(obj);
  };

  hoverer.onMouseOut = function (obj) {
    highlighter.clear();

  };

  animate.add(()=>hoverer.update());
  
  /* RENDERER */

  renderer = new THREE.WebGLRenderer( {
    canvas: canvas,
    antialias: true,
    // alpha: true,
  });
  renderer.setClearColor( 0xffffff );
  renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // animate.addLast(()=>renderer.render(scene, camera));
  
  /* COMPOSER */

  composer = new THREE.EffectComposer( renderer );

  let renderPass = new THREE.RenderPass( scene, camera );
  composer.addPass( renderPass );

  for (let pass of composerPasses) {
    composer.addPass(pass);
  }

  let effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
  effectFXAA.uniforms[ 'resolution' ].value.set( 
    1 / canvas.offsetWidth, 1 / canvas.offsetHeight 
  );
  effectFXAA.renderToScreen = true;
  composer.addPass( effectFXAA );

  animate.addLast(()=>composer.render());
  

  /* EVENTS */

  canvas.addEventListener( 'resize', function() {

    renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );

    ///

    let aspectRatio = canvas.offsetWidth / canvas.offsetHeight;

    for (let camera of cameras) {
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    }
  
  } , false );

}


///////////////////


