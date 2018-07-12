const THREE = require('../lib/myThree/THREE.js');
const InfoLabel = require('../components/InfoLabel');
const { getNormRelativePosition } = require('../lib/myThree/helpers.js')

const {
  globals: g,
  objects: threeObjs,

} = require('../threeGlobals');

addPlain();
addLight();

let group = new THREE.Group();
g.scene.add(group);
threeObjs.cubes = group;
threeObjs._active.push(group);

let group2 = new THREE.Group();
threeObjs.cubes2 = group2;

addObj(
  addCube(100, 100, 100),
  group,
  "lable_cube",
  [0.5, 1, 0.5]
);

addObj(
  addCube(98, 23, 100),
  group,
  "lable_cube2",
  [0.5, 1, 0.5],
  (obj) => {
    obj.position.x += 60;
    obj.position.z += 38;
  }
);




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
  var dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(1 * 200, 1.5 * 200, 2 * 200);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 512 * 2; // default
  dirLight.shadow.mapSize.height = 512 * 2; // default

  dirLight.shadow.camera.near = 200; // default
  dirLight.shadow.camera.far = 1000; // default

  let shadowCameraSize = 300;
  dirLight.shadow.camera.left = -shadowCameraSize / 2;
  dirLight.shadow.camera.right = shadowCameraSize / 2;
  dirLight.shadow.camera.bottom = -shadowCameraSize / 2;
  dirLight.shadow.camera.top = shadowCameraSize / 2;

  g.scene.add(dirLight);

  ///

  var ambLight = new THREE.AmbientLight(0x222222);
  g.scene.add(ambLight);
}

////////////

function loadModels() {
  let objects = [];

  // instantiate a loader
  var loader = new THREE.OBJLoader();

  // load a resource
  loader.load(
    // resource URL
    MODEL_PATH,
    // called when resource is loaded
    function(object) {
      // console.log(object)
      // g.scene.add( object );
      object.visible = true;
      modelGroup = object;
      // if (object[0] == object) console.log(111)
      object.traverse(function(child) {
        if (!(child instanceof THREE.Mesh)) return;
        // console.log(child)
        g.hoverer.addObject(child);
        objects.push(child);
        child.scale.set(0.4, 0.4, 0.4);
        child.rotateY(Math.PI * 1.47);
        child.receiveShadow = true;
        child.castShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: 0xffffff
          // flatShading: true
        });
      });

      for (let obj of objects) {
        new InfoLabel(obj, "container", [0.5, 1, 0.5], g.hoverer, g.controls, g.visibiler, g.renderer, g.camera);
      }
    },
    // called when loading is in progresses
    function(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function(error) {
      console.log("An error happened");
    }
  );
}

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
  
  let lable = new InfoLabel(lableId);
  lable.position.copy(getNormRelativePosition(obj, relPos, 1));
  obj.add(lable);
  obj.userData.infoLable = lable;
  
  g.hoverer.addObject(obj);
  g.visibiler.addObstacle(obj);
  g.visibiler.addChecker(lable.visChecker)
  
  return obj;
};



