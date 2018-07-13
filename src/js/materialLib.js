module.exports = {
  'default': new THREE.MeshPhongMaterial({
    name: 'default',
    color: 0xffffff,
    specular: 0x111111,
    shininess: 30,
    envMap: null,
    map: null,
    lightMap: null,
    specularMap: null,
    alphaMap: null

  }),

  'defaultGray': new THREE.MeshPhongMaterial({
    name: 'defaultGray',
    color: 0xdcdcdc,
    specular: 0x111111,
    shininess: 30,
    envMap: null,
    map: null,
    lightMap: null,
    specularMap: null,
    alphaMap: null
  }),

  'metalBlue': new THREE.MeshPhongMaterial({
    name: 'metalBlue',
    color: 0x7287b1, 
    specular: 0xc5c5c5, 
    shininess: 15,
    envMap: null,
    map: null,
    lightMap: null,
    specularMap: null,
    alphaMap: null

  }),

  'metalGray': new THREE.MeshPhongMaterial({
    name: 'metalGray',
    color: 0x595959,
    specular: 0xffffff,
    shininess: 3,
    envMap: null,
    map: null,
    lightMap: null,
    specularMap: null,
    alphaMap: null
  }),

  'plasticWhite': new THREE.MeshPhongMaterial({
    name: 'plasticWhite',
    color: 0xffffff,
    specular: 0xc8c8c8,
    shininess: 7,
    envMap: null,
    map: null,
    lightMap: null,
    specularMap: null,
    alphaMap: null
  }),

  'plasticBlack': new THREE.MeshPhongMaterial({
    name: 'plasticBlack',
    color: 0x2f2f2f,
    specular: 0xdedede,
    shininess: 7,
    envMap: null,
    map: null,
    lightMap: null,
    specularMap: null,
    alphaMap: null
  })


}


function color (string) {
  return new THREE.Color(string).getHex();
}