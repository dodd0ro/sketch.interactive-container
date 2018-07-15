
function loadObjs(paths, basePath = null) {





  
  function _loadObj(materials) {
    let objLoader = new THREE.OBJLoader();
    if (materials) {
      objLoader.setMaterials(materials);
    }
    objLoader.load(
      OBJPath,
      function (object) {
        loadedObjects[path] = object;
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
}
