const textureBasePath = require('./config').TEXTURES_BASE_PATH;
  
var bitmaps = {
  'default': new THREE.CubeTextureLoader()
    .setPath(textureBasePath + 'test/')
    .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ])

}


const matOptions = {

  'default': {
    type: 'MeshPhysicalMaterial',
    color: 0xdcdcdc,
    roughness: 0.6, 
    metalness: 0.3,
    reflectivity: 0.5,
    refractionRatio: 1,
    clearCoat: 0.7,
    clearCoatRoughness: 0.3,
    envMap: bitmaps['default'],
    map: null,
    lightMap: null,
    alphaMap: null,

  },

  'defaultGray': {
    type: 'MeshPhysicalMaterial',
    color: 0xbbbbbb,
    roughness: 0.6, 
    metalness: 0.3,
    reflectivity: 0.5,
    refractionRatio: 1,
    clearCoat: 0.7,
    clearCoatRoughness: 0.3,
    envMap: bitmaps['default'],
    map: null,
    lightMap: null,
    alphaMap: null,
  },

  'metalBlue': {
    type: 'MeshPhysicalMaterial',
    color: 0x7287b1, 
    roughness: 0.6, 
    metalness: 0.7,
    reflectivity: 0.5,
    refractionRatio: 1,
    clearCoat: 0.7,
    clearCoatRoughness: 0.2,
    envMap: bitmaps['default'],
    map: null,
    lightMap: null,
    alphaMap: null,
  },

  'metalGray': {
    type: 'MeshPhysicalMaterial',
    color: 0xdcdcdc, 
    roughness: 0.3, 
    metalness: 0.7,
    reflectivity: 1.5,
    refractionRatio: 1,
    clearCoat: 0.7,
    clearCoatRoughness: 0.1,
    envMap: bitmaps['default'],
    map: null,
    lightMap: null,
    alphaMap: null,
  },

  'plasticWhite': {
    type: 'MeshPhysicalMaterial',
    color: 0xffffff,
    roughness: 0.5, 
    metalness: 0.3,
    reflectivity: 0.3,
    refractionRatio: 1,
    clearCoat: 0.7,
    clearCoatRoughness: 0.3,
    envMap: bitmaps['default'],
    map: null,
    lightMap: null,
    alphaMap: null,
  },

  'plasticBlack': {
    type: 'MeshPhysicalMaterial',
    color: 0x2f2f2f,
    roughness: 0.3, 
    metalness: 0.5,
    reflectivity: 0.5,
    refractionRatio: 1,
    clearCoat: 0.7,
    clearCoatRoughness: 0.3,
    envMap: bitmaps['default'],
    map: null,
    lightMap: null,
    alphaMap: null,
  }

}

const materials = {};
for (let matName in matOptions) {
  let matOpt = matOptions[matName];
  materials[matName] = new THREE[matOpt.type](matOpt);
  materials[matName].name = matName;
}
Object.defineProperty(materials, '_options', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: matOptions
})

module.exports = materials;


function color (string) {
  return new THREE.Color(string).getHex();
}