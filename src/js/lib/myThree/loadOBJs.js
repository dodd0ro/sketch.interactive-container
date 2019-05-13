module.exports = function (paths, basePath = null) {
  /* 
  paths - array 
  basePath - str
  
  Loads models and
  returns function that takes function(loadedObjects) that will be
  executed at the end on loading
  */
  
  const promises = [];
  const loadedObjects = {};



  // create load promises for all models
  for (let path of paths) {
    promises.push(
      new Promise((resolve) => {
        load(path, resolve);
      })
    );
  }

  return function (func) {
    Promise.all(promises).then(() => {
      func(loadedObjects);
    })
  }

  function load(path, resolve) {
    const objName = path;

    if (basePath) path = basePath + path;
    let pathBase = path.split('.obj')[0];
    const OBJPath = pathBase + '.obj';
    const MTLPath = pathBase + '.mtl';

    try { // load MTL and OBJ
      new THREE.MTLLoader().load(
        MTLPath,
        function (materials) {
          materials.preload();
          _loadObj(materials)
        }
      );
    } catch (err) { // load only OBJ
      _loadObj()
    }

    function _loadObj(materials = null) {
      let objLoader = new THREE.OBJLoader();
      if (materials) objLoader.setMaterials(materials);
      objLoader.load(
        OBJPath,
        function (object) {
          object.name = objName;
          loadedObjects[objName] = object;
          resolve();
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.log("An error happened while loading");
        }
      );
    }
  }

}
