var grid, cube, cubeInfo, cube2, cube2Info;
var modelGroup, geometryGroup;
var infoLabels = [];

window.onload = function() {
  init();
  initEvents();
  grid = addGrid();
  addLight();

  if (Options.loadModel) {
    loadModels();
  } else {
    initGeometry();
  }

  // loadModels();
  // initGeometry()

  initGui();
  animate();
};

function initGeometry() {
  cube = addCube(100, 100, 100);
  hoverer.addObject(cube);
  cubeInfo = new InfoLabel(cube, "cube", [0.5, 1, 0.5], hoverer);
  infoLabels.push(cubeInfo);

  cube2 = addCube(98, 23, 100);
  cube2.position.x += 60;
  cube2.position.z += 38;
  hoverer.addObject(cube2);
  cube2Info = new InfoLabel(cube2, "cube2", [0.6, 1, 0.6], hoverer);
  infoLabels.push(cube2Info);

  addPlain();

  ///

  visibiler.addObjects([cube, cube2]);

  ///

  geometryGroup = new THREE.Group();
  geometryGroup.add(cube, cube2);
  geometryGroup.visible = true;
  scene.add(geometryGroup);
}

function addGrid() {
  let grid = new THREE.GridHelper(400, 40);
  grid.visible = false;
  scene.add(grid);
  return grid;
}

function addCube(xs, ys, zs) {
  var geometry = new THREE.BoxBufferGeometry(xs, ys, zs);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff
    // flatShading: true
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = ys / 2;
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

  scene.add(mesh);

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

  scene.add(dirLight);
  // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

  ///

  var ambLight = new THREE.AmbientLight(0x222222);
  scene.add(ambLight);
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
      // scene.add( object );
      object.visible = true;
      modelGroup = object;
      // if (object[0] == object) console.log(111)
      object.traverse(function(child) {
        if (!(child instanceof THREE.Mesh)) return;
        // console.log(child)
        hoverer.addObject(child);
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
        new InfoLabel(obj, "container", [0.5, 1, 0.5], hoverer);
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
