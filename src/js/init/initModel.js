const g = require('../threeGlobals');
const matLib = require('../materialLib')
const clipLib = require('../clipLib');
const cnf = require('../config');
const mCnf = require('../../assets/model/modelConfig.json');
const TWEEN = require('../lib/Tween');

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
  
  afterLoad();
  addAnimations();
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

function afterLoad() {
  let modelParts = g.objTagger.get('_modelParts'); // #Bad!
  for (let modelName in modelParts) {
    let group = new THREE.Group();
    group.position.fromArray(mCnf.axis);
    
    group.add(...modelParts[modelName])
    group.updateMatrixWorld();
    group.children.forEach(child => {
      child.worldToLocal(child.position);
    });

    g.objTagger.set('model', modelName, group);
    g.scene.add(group);
  }
}


function addAnimations() {
  var objLeft = g.objTagger.get('model', 'containerLeft')[0];
  var objRight = g.objTagger.get('model', 'containerRight')[0];
  
  { /* OPEN */
    var prop = {y:0}
    
    var duration = 500;
    var easing = TWEEN.Easing.Quadratic.Out;

    var maxAng = Math.PI / 5;
    var stepAng = Math.PI / 5;
    
    var openTween = new TWEEN.Tween(prop) 
      .to({ y: '+' + stepAng}, duration)
      .easing(easing)
      .onUpdate(function () {
        if (prop.y > maxAng) prop.y = maxAng;
        objRight.rotation.set(0, prop.y, 0)
        objLeft.rotation.set(0, -prop.y, 0)
        // objLeft.parent.translateX(-10)
        })  
  
    var closeTween = new TWEEN.Tween(prop) 
    .to({ y: '-' + stepAng}, duration)
    .easing(easing)
      .onUpdate(function () {
        if (prop.y < 0) prop.y = 0;
        objRight.rotation.set(0, prop.y, 0)
        objLeft.rotation.set(0, -prop.y, 0)
        // objLeft.parent.translateX(10)
      })
    tweenLib = g.tweenLib;
    g.tweenLib.open = openTween;
    g.tweenLib.close = closeTween;

    ///
    var state = 'closed';
    
    var baseMaxAA = g.controls.maxAzimuthAngle;
    var baseMinAA = g.controls.minAzimuthAngle;

    g.containerDiv.addEventListener("wheel", function (e) {
      var delta = e.deltaY || e.detail || e.wheelDelta;
      if (delta > 0) {
        openTween.onComplete(() => {
          state = 'opened'
          g.controls.maxAzimuthAngle =  Math.PI * 0;
          g.controls.minAzimuthAngle = - Math.PI * 1;
          g.controls.autoRotate = false;
          // g.controls.enableZoom = true;
        }).start();
        closeTween.stop();
        
      } else {
        closeTween.onComplete(() => {
          state = 'closed';
          g.controls.maxAzimuthAngle = Infinity;
          g.controls.minAzimuthAngle = - Infinity;
          g.controls.autoRotate = true;
          // g.controls.enableZoom = false;
        }).start();
        openTween.stop()
      }
    });
  }  
  

}




