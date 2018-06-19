class Highlighter {
  constructor(canvas, scene, camera, texturePath) {

    this.pass = new THREE.OutlinePass( 
      new THREE.Vector2( canvas.offsetWidth, canvas.offsetHeight ),
      scene, camera 
    );
    this.pass.overlayMaterial.blending = THREE.SubtractiveBlending // OMG!!!!
    
    if (texturePath) {
      var loader = new THREE.TextureLoader();
      loader.load( texturePath, function ( texture ) {
        this.pass.patternTexture = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
      }.bind(this));
    }

  }

  add(obj) {
    this.pass.selectedObjects.push(obj);
  }

  clear(obj) {
    this.pass.selectedObjects = [];
  }


}