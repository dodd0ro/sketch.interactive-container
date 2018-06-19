init();
let grid = addGrid();
addFog()
addLight();



let cube = addCube();
hoverer.addObject(cube);

addPlain();

animate();


function addGrid() {
  let grid = new THREE.GridHelper( 400, 40);
  grid.visible = false;
  scene.add( grid );
  return grid;
}


function addCube() {

  var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
  var material = new THREE.MeshPhongMaterial( { 
    color: 0xffffff, 
    // flatShading: true 
  } );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.y = 50;
  
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add( mesh );

  return mesh;
}


function addPlain() {

  var geometry = new THREE.PlaneBufferGeometry( 2000, 2000, 1 );
  var material = new THREE.ShadowMaterial();
  material.opacity = 0.9;
  var mesh = new THREE.Mesh( geometry, material) ;
  mesh.rotateX( - Math.PI / 2 );

  mesh.receiveShadow = true;

  scene.add( mesh );

  return mesh;

}

function addLight() {

  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.position.set( 1*200, 1*200, 1*200 );

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 512*2;  // default
  dirLight.shadow.mapSize.height = 512*2; // default
  
  dirLight.shadow.camera.near = 200;       // default
  dirLight.shadow.camera.far = 1000      // default

  let shadowCameraSize = 300;
  dirLight.shadow.camera.left = -shadowCameraSize / 2;
  dirLight.shadow.camera.right = shadowCameraSize / 2;
  dirLight.shadow.camera.bottom = -shadowCameraSize / 2;
  dirLight.shadow.camera.top = shadowCameraSize / 2;
  
  scene.add( dirLight );
  // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

  ///

  var ambLight = new THREE.AmbientLight( 0x222222 );
  scene.add( ambLight );

}

function addFog() {
  scene.fog = new THREE.FogExp2( 
    new THREE.Color( '#ffffff' ), 
    0.002
  );
}
////////////




