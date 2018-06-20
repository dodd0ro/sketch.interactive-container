window.onload = function() { 
  init();
  let grid = addGrid();
  addLight();

  let cube = addCube(100, 100, 100);
  hoverer.addObject(cube);
  let cubeInfo = new InfoDiv(cube, 'cube', [0,100/2,0], hoverer);

  let cube2 = addCube(98, 23, 100);
  cube2.position.x += 60;
  cube2.position.z += 38;
  hoverer.addObject(cube2);
  let cube2Info = new InfoDiv(cube2, 'cube2', [20,23/2,0], hoverer);

  addPlain();

  animate();
}


function addGrid() {
  let grid = new THREE.GridHelper( 400, 40);
  grid.visible = false;
  scene.add( grid );
  return grid;
}


function addCube(xs,ys,zs) {

  var geometry = new THREE.BoxBufferGeometry( xs, ys, zs );
  var material = new THREE.MeshPhongMaterial( { 
    color: 0xffffff, 
    // flatShading: true 
  } );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.y = ys/2;
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
  dirLight.position.set( 1*200, 1.5*200, 2*200 );

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


////////////




