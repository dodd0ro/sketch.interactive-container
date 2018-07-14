const THREE = require('../lib/myThree/THREE.js');
const InfoLabel = require('../components/InfoLabel');
const { getNormRelativePosition } = require('../lib/myThree/helpers.js')

const matLib = require('../materialLib')
const {
  globals: g,
  objects: threeObjs,
  config: cnf
} = require('../threeGlobals');

addPlain();
addLight();

loadObjs();

// let group = new THREE.Group();
// g.scene.add(group);
// threeObjs.cubes = group;
// threeObjs._active.push(group);

// let group2 = new THREE.Group();
// threeObjs.cubes2 = group2;

// addObj(
//   addCube(100, 100, 100),
//   group,
//   "lable_cube",
//   [0.5, 1, 0.5]
// );

// addObj(
//   addCube(98, 23, 100),
//   group,
//   "lable_cube2",
//   [0.5, 1, 0.5],
//   (obj) => {
//     obj.position.x += 60;
//     obj.position.z += 38;
//   }
// );
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

  dirLight.position.set(-1 * distMult, 1 * distMult, 1 * distMult);
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

  g.scene.add(
    new THREE.CameraHelper(dirLight.shadow.camera)
  );
  g.scene.add(dirLight);

  /* AMB LIGHT */

  var ambLight = new THREE.AmbientLight(0x222222);
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


function loadObjs() {
  const topGroup = new THREE.Group();
  const groupMaps = {};
  const promises = [];
  ///

  
  for (let modelName of cnf.MODEL_NAMES) {
    promises.push(
      new Promise((resolve) => {
        load(modelName, resolve);
      })
    );
  }

  ///
  
  bakeGroup();

  ///

  function onObjLoad(object) {
    for (let child of object.children) {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }
      child.receiveShadow = true;
      child.castShadow = true;
      
      child.material = matLib[child.material.name];
      child.material.side = THREE.DoubleSide;
      child.material.shadowSide = THREE.DoubleSide;

      let groupMap = detGroupMapByName(child.name);
      groupMap.objects.push(child);
    }
  }

  function bakeGroup() {
    Promise.all(promises).then(() => {
      // melt maps down
      for (let mapName in groupMaps) {
        let map = groupMaps[mapName];
        for (let obj of map.objects) {
          map.group.add(obj);
        }
      }

      ///
      
      g.scene.add(topGroup);
    })
  }

  function load(modelName, resolve) {
    new THREE.MTLLoader().load(
      cnf.MODELS_BASE_PATH + modelName + '.mtl',
      function (materials) {
        materials.preload();
  
        new THREE.OBJLoader()
          .setMaterials(materials)
          .load(
            cnf.MODELS_BASE_PATH + modelName + '.obj',
            function (object) {
              onObjLoad(object);
              resolve();
            },
            // called when loading is in progresses
            function (xhr) {
              console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            // called when loading has errors
            function (error) {
              console.log("An error happened");
            }
          );
      }
    )


  }



  function detGroupMapByName(name) {
    if (!groupMaps[name]) {
      let group = topGroup;
      for (let groupName of name.split('__')) {
        let curGroup = group.getObjectByName(groupName);
        if (!curGroup) {
          curGroup = new THREE.Group();
          curGroup.name = groupName;
          group.add(curGroup);
          g.hoverer.addObject(curGroup); // !!!
        }
        group = curGroup;
      }

      groupMaps[name] = {
        group: group,
        objects: []
      };
    }
    return groupMaps[name];
  }

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



