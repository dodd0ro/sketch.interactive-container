const g = require('../threeGlobals');
const matLib = require('../materialLib')
const clipLib = require('../clipLib');
const cnf = require('../config');
const mCnf = require('../../assets/model/modelConfig.json');

const loadOBJs = require('../lib/myThree/loadOBJs');
const TopGroup = require('../components/GroupsFromNamesBuilder');

const topGroup = new TopGroup('__'); // #remove!


let onLoadFinish = loadOBJs(cnf.MODEL_NAMES, cnf.MODELS_BASE_PATH);
onLoadFinish(function (loadedObjects) {
  // parse loaded objects
  for (let objName in loadedObjects) {
    let object = loadedObjects[objName];
    for (let child of object.children) {
      if (!(child instanceof THREE.Mesh)) continue;
      withCild(child, objName);
    }
  }
  // add baked group to scene
  // let group = topGroup.bake();

  let modelParts = g.objTagger.get('_modelParts'); // #Bad!
  for (let modelName in modelParts) {
    let group = new THREE.Group();
    group.add(...modelParts[modelName])
    
    g.objTagger.set('model', modelName, group);
    g.scene.add(group);
  }
  console.log(g.objTagger);
  

  // add animations
  addAnimations()
})


function withCild(child, objName) {
  child.receiveShadow = true;
  child.castShadow = true;
  
  child.material = matLib[child.material.name];
  child.material.side = THREE.DoubleSide;
  // child.material.shadowSide = THREE.DoubleSide;

  g.hoverer.addObject(child);

  g.objTagger.set('_modelParts', objName, child)
  g.objTagger.set('group', child.name, child)
  
}

function addAnimations() {

  var obj = g.objTagger.get('model', 'containerRight')[0]; 
  
  var pivot = new THREE.Group();
  pivot.position.fromArray(mCnf.axis);
  pivot.add(obj);
  pivot.updateMatrixWorld()

  g.scene.add(pivot);

  obj.children.forEach(child => {
    child.worldToLocal(child.position);
  });

  let action = g.actionsTagger.set('test', pivot, clipLib['rotate'])
  action.loop = THREE.LoopOnce
  action.play()
  

}




