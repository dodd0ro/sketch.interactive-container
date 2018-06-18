const CANVAS_ID = 'three-canvas'
canvas = document.getElementById( CANVAS_ID );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 30, canvas.offsetWidth/canvas.offsetHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
// document.body.appendChild( renderer.domElement );

// add cube
var geometry = new THREE.BoxGeometry( 20, 20, 20);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// rotate cube
cube.rotation.x = 0.45;
cube.rotation.y = -0.25;

camera.position.z = 100;

var light = new THREE.PointLight( 0xFFFF00 );
light.position.set( 10, 0, 25 );
scene.add( light );


var render = function () {
  requestAnimationFrame( render );

  renderer.render(scene, camera);
};

render();



