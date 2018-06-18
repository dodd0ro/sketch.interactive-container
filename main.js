
const CANVAS_ID = 'three-canvas'


/////////


var canvas, renderer, scene;
var camera, controls;


////////////////////////////




////////////////////////////


function init() {

  canvas = document.getElementById( CANVAS_ID );

  /// renderer
  
  renderer = new THREE.WebGLRenderer( {
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );

  /// scene

  scene = new THREE.Scene();

  /// camera

  camera = new THREE.PerspectiveCamera(
    60,
    canvas.offsetWidth / canvas.offsetHeight,
    1,
    1000
  );
  camera.position.set( 0, 230, 230 );
  // camera.lookAt( scene.position );

  /// controls

  controls = new THREE.OrbitControls( camera, canvas ); 
  
    controls.rotateSpeed  = 0.20  // 1

    controls.enableDamping = true;
    controls.dampingFactor = 0.1  // 0.25

    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.50;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;  // 2

    controls.enableKeys = false;
    controls.enablePan = false;
    controls.enableZoom = false;
  

  /// events

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


function animate() {

  requestAnimationFrame( animate );
  if (controls) controls.update();
  renderer.render(scene, camera);

};


//////////////////////////////



function addGrid() {
  scene.add( 
    new THREE.GridHelper( 400, 40, 0x0000ff, 0x808080  )
  );
}

function addCube() {

  var geometry = new THREE.BoxGeometry( 100, 100, 100 );
  var material = new THREE.MeshPhongMaterial( { 
    color: 0xffffff, 
    // flatShading: true 
  } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

}

function addLight() {

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 0.5);
  scene.add( light );

  // var light = new THREE.DirectionalLight( 0x002288 );
  // light.position.set( - 1, - 1, - 1 );
  // scene.add( light );

  var light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );

}

function addFog() {
  scene.fog = new THREE.FogExp2( 
    new THREE.Color( '#ffffff' ), 
    0.002 
  );
}
////////////








init();
// addGrid();
addFog()
addLight();

addCube();

animate();
