const THREE = require('../lib/myThree/THREE.js');
const Foggle = require('../lib/Foggle.js');

const g = require('../threeGlobals');


const matLib = require('../materialLib');

{ /* ON TICK */
  g.animate.onTick(function () {
    matLib.metalBlue.needsUpdate = true;
    g.controls.update();
    g.hoverer.updateIntersects();
  })
}

{ /* ON TICK END */
  g.animate.onTick(function () {
    // #bad! 
    if (g.options.highlightMode == "emissive") g.renderer.render(g.scene, g.camera);
    g.labelRenderer.render(g.scene, g.camera);
    if (g.options.highlightMode == "outline") g.composer.render();
  });
}

{ /* RESIZE */
  g.containerDiv.addEventListener( "resize", function () {
      g.canvasWidth = g.containerDiv.clientWidth;
      g.canvasHeight = g.containerDiv.clientHeight;
      //
      g.renderer.setSize(g.canvasWidth, g.canvasHeight);
      g.labelRenderer.setSize(g.canvasWidth, g.canvasHeight);
      //
      g.camera.aspect = g.canvasWidth / g.canvasHeight;
      g.camera.updateProjectionMatrix();
    },
    false
  );
}

{ /* MOUSEMOVE */
  // hoverer
  g.containerDiv.addEventListener('mousemove', function (event) {
    g.hoverer.updateMouse(event.clientX, event.clientY, g.containerDiv);
  });
}

{ /* CONTROLS */

  // visibiler
  g.controls.addEventListener('change', function() {
    if (g.options.hideLabels) g.visibiler.update();
  });
}

{ /* HOVERER */

  {  /* HIGHLIGHT */
    var highlightOn = new Foggle(g.options, "highlightMode");
    var highlightOff = new Foggle(g.options, "highlightMode");
    g.hoverer.onMouseOver(highlightOn);
    g.hoverer.onMouseOut(highlightOff);

    // outline
    let highlighter = g.highlighter;
    highlightOn.on("outline", function (obj) {
      for (let subObj of obj.parent.children) {
        highlighter.add(subObj);
      }
    });
    highlightOff.on("outline", function () {
      highlighter.clear();
    });

    // emissive
    highlightOn.on("emissive", function (obj) {
      for (let subObj of g.objTagger.getByObject('group', obj)) {
        subObj.oldMaterial = subObj.material;
        let newMat = subObj.material.clone();
        newMat.emissive.setHex(new THREE.Color("#005e00").getHex());
        subObj.material = newMat;
      }
    });
    highlightOff.on("emissive", function (obj) {
      for (let subObj of g.objTagger.getByObject('group', obj)) {
        subObj.material = subObj.oldMaterial;
        subObj.oldMaterial = undefined;
      }
    });
  }

  { /* LABELS */
    var showLable = new Foggle(g.options, "hideLabels");
    var hideLable = new Foggle(g.options, "hideLabels");
    g.hoverer.onMouseOver(showLable);
    g.hoverer.onMouseOut(hideLable);

    // hideLabels - true
    showLable.on(true, function (obj) {
      let lable = obj.userData.infoLable;
      if (!lable) return;
      lable.hide(false);
      lable.select(true);
    });
    hideLable.on(true, function (obj) {
      let lable = obj.userData.infoLable;
      if (!lable) return;
      lable.hide(true);
      lable.select(false);
    });
  
    // hideLabels - false
    showLable.on(false, function (obj) {
      let lable = obj.userData.infoLable;
      if (!lable) return;
      lable.hideList(false)
      lable.select(true);
    });
    hideLable.on(false, function (obj) {
      let lable = obj.userData.infoLable;
      if (!lable) return;
      lable.hideList(true)
      lable.select(false);
    });
  }

}





