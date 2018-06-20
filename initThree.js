var containerDiv, canvasWidth, canvasHeight;
var scene, camera;
var renderer, labelRenderer, composer, composerPasses = [];
var controls, hoverer, highlighter;

////////////////////////////

  
function animate() {

  requestAnimationFrame( animate );
  
  ///

  for (let i = 0; i < animate.funcs.length; i++) {
    animate.funcs[i]();
  }

  controls.update();
  hoverer.update()

  ///

  for (let i = 0; i < animate.funcsLast.length; i++) {
    animate.funcsLast[i]();
  }

  // renderer.render(scene, camera)
  labelRenderer.render( scene, camera )
  composer.render()

};

animate.funcs = [];
animate.onTick= function(func) {
  animate.funcs.push(func);
}
animate.funcsLast = [];
animate.onTickEnd = function(func) {
  animate.funcsLast.push(func);
}



function init() {

  /* CONTAINER DIV */
  
  containerDiv = document.getElementById( THREE_DIV_ID );
  containerDiv.style.position = 'relative';
  if (!(containerDiv.clientWidth && containerDiv.clientHeight)) {
    throw "Container div doesn't have size";
  }
  canvasWidth = containerDiv.clientWidth;
  canvasHeight = containerDiv.clientHeight;


  /* SCENE */

  scene = new THREE.Scene();
  scene.background = new THREE.Color('white')
  scene.fog = new THREE.FogExp2( 
    new THREE.Color( '#ffffff' ), 
    0.0025
  );

  /* CAMERA */

  camera = new THREE.PerspectiveCamera(
    60,
    canvasWidth / canvasHeight,
    1,
    1000
  );
  camera.position.set( -100, 150, 250 );
  

  /* RENDERER */

  renderer = new THREE.WebGLRenderer( {
    antialias: true,
    // alpha: true,
  });
  renderer.setClearColor( 0xffffff );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize( canvasWidth, canvasHeight );
  containerDiv.appendChild( renderer.domElement );
  containerDiv.appendChild( renderer.domElement );

  /* LABEL RENDERER */

  labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize( canvasWidth, canvasHeight );
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = 0;
  labelRenderer.domElement.style.overflow = 'visible'
  containerDiv.appendChild( labelRenderer.domElement );
  // document.querySelector('#three > div')

  /* CONTROLS */

  controls = new THREE.OrbitControls( camera, containerDiv ); 

  controls.rotateSpeed  = 0.20  // 1

  controls.enableDamping = true;
  controls.dampingFactor = 0.1  // 0.25

  controls.minPolarAngle = Math.PI * 0.25;
  controls.maxPolarAngle = Math.PI * 0.49;

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.025;  // 2

  controls.enableKeys = false;
  controls.enablePan = false;
  controls.enableZoom = false;

  /* HOVERER */

  hoverer = new Hoverer ( renderer.domElement, camera );

  /* HIGHLIGHTER */

  highlighter = new Highlighter(
    renderer.domElement, scene, camera, '../../assets/tri_pattern.jpg'
  );
  composerPasses.push(highlighter.pass);

  hoverer.onMouseOver(function (obj) {
    highlighter.set(obj);
  });

  hoverer.onMouseOut(function (obj) {
    highlighter.clear();
  });

  /* COMPOSER */

  composer = new THREE.EffectComposer( renderer );

  let renderPass = new THREE.RenderPass( scene, camera );
  composer.addPass( renderPass );

  for (let pass of composerPasses) {
    composer.addPass(pass);
  }

  let effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
  effectFXAA.uniforms[ 'resolution' ].value.set( 
    1 / canvasWidth, 1 / canvasHeight 
  );
  effectFXAA.renderToScreen = true;
  composer.addPass( effectFXAA );

  /* EVENTS */

  containerDiv.addEventListener( 'resize', function() {

    canvasWidth = containerDiv.clientWidth;
    canvasHeight = containerDiv.clientHeight;

    ///

    renderer.setSize( canvasWidth, canvasHeight );
    labelRenderer.setSize( canvasWidth, canvasHeight );
    // effectFXAA.uniforms[ 'resolution' ].value.set(  // ???
    //   1 / canvasWidth, 1 / canvasHeight 
    // );

    ///

    let aspectRatio = 
    canvasWidth / canvasHeight;

    for (let camera of cameras) {
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    }
  
  } , false );

}


///////////////////


