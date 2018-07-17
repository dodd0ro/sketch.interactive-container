const THREE = require('../lib/myThree/THREE.js');
const InfoLabel = require('../components/InfoLabel');

const matLib = require('../materialLib')
const g = require('../threeGlobals');
const cnf = require('../config');

addPlain();
addLight();

// let cube = addCube(100, 100, 100);
// cube.position.fromArray(require('../../assets/model/modelConfig.json').axis)
// g.scene.add(cube);

console.log(g.scene.children);

////////////////////////////////////////////////

function addGrid(scene) {
  let grid = new THREE.GridHelper(400, 40);
  grid.visible = false;
  return grid;
  scene.add(grid)
}

function addCube(xs, ys, zs) {
  var geometry = new THREE.BoxBufferGeometry(xs, ys, zs);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff
    // flatShading: true
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.translateY(ys / 2);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  return mesh;
}

function addPlain() {
  var geometry = new THREE.PlaneBufferGeometry(2000, 2000, 1);
  var material = new THREE.ShadowMaterial();
  material.opacity = 0.9;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotateX(-Math.PI / 2);

  mesh.receiveShadow = true;

  g.scene.add(mesh);

  return mesh;
}

function addLight() {

  /* DIR LIGHT */

  const distMult = 400;
  const shadowBoxWidth = 1000;

  var dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.name = 'dirLight';

  dirLight.position.set(-1 * distMult, 1.2 * distMult, 0.5 * distMult);
  dirLight.shadow.camera.near = 0.2;
  dirLight.shadow.camera.far = 2000; 
  
  dirLight.castShadow = true;
  dirLight.shadow.bias = -0.002 // 0.0001
  dirLight.shadow.mapSize.width = Math.pow(2,10); // 9
  dirLight.shadow.mapSize.height = Math.pow(2,10); // 9

  dirLight.shadow.camera.left = -shadowBoxWidth / 2;
  dirLight.shadow.camera.right = shadowBoxWidth / 2;
  dirLight.shadow.camera.bottom = -shadowBoxWidth / 2;
  dirLight.shadow.camera.top = shadowBoxWidth / 2;

  // g.scene.add(
  //   new THREE.CameraHelper(dirLight.shadow.camera)
  // );
  g.scene.add(dirLight);

  /* AMB LIGHT */

  var ambLight = new THREE.AmbientLight(0xffffff);
  ambLight.intensity = 0.5;
  ambLight.name = 'ambLight';
  g.scene.add(ambLight);

  /* POINT LIGHT */
  // var ptLight = new THREE.PointLight(0xffffff, 0.1);
  // ptLight.castShadow = true;
  // ptLight.shadow.bias = -0.002 // 0.0001
  // ptLight.position.set(300, 200, -300);
  
  // g.scene.add(
  //   new THREE.PointLightHelper(ptLight, 30)
  // );
  // g.scene.add(ptLight);
}

////////////

class DivRect {
  constructor(w, h) {
    this.div = document.createElement("div");
    this.div.className = "testDiv";
    this.div.style.height = w + "px";
    this.div.style.width = h + "px";
    this.div.style.background = "red";
    this.div.style.position = "absolute";
    document.body.appendChild(this.div);
  }

  place(x, y) {
    this.div.style.top = x + "px";
    this.div.style.left = y + "px";
  }
}

/////////////

function addObj (obj, group, lableId, relPos, func=null) {
  if (func) func(obj);
  group.add(obj);
  g.hoverer.addObject(obj);
  g.visibiler.addObstacle(obj);
  
  let lable = new InfoLabel(lableId);
  lable.connectObject(obj, relPos);
  lable.connectVisibiler(g.visibiler);
  
  return obj;
};



