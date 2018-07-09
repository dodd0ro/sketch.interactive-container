const THREE = require('../lib/three/three.js');
const Foggle = require('../lib/Foggle.js');

function initEvents() {

  { /* RESIZE */
    this.containerDiv.addEventListener( "resize", function () {
        this.canvasWidth = this.containerDiv.clientWidth;
        this.canvasHeight = this.containerDiv.clientHeight;
        //
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.labelRenderer.setSize(this.canvasWidth, this.canvasHeight);
        //
        this.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
      },
      false
    );
  }

  { /* MOUSEMOVE */

    // hoverer
    this.containerDiv.addEventListener('mousemove', function (event) {
      this.hoverer.updateMouse(event.clientX, event.clientY, this.containerDiv);
    }.bind(this));
  }

  { /* CONTROLS */

    // visibiler
    this.controls.addEventListener('change', function() {
      if (this.options.hideLabels) this.visibiler.update();
    }.bind(this));
  }

  { /* HOVERER */
  
    {  /* HIGHLIGHT */
      var highlightOn = new Foggle(this.options, "highlightMode");
      var highlightOff = new Foggle(this.options, "highlightMode");
      this.hoverer.onMouseOver(highlightOn);
      this.hoverer.onMouseOut(highlightOff);

      // outline
      let highlighter = this.highlighter;
      highlightOn.on("outline", function (obj) {
        highlighter.set(obj);
      });
      highlightOff.on("outline", function () {
        highlighter.clear();
      });

      // emissive
      highlightOn.on("emissive", function (obj) {
        obj.currentHex = obj.material.emissive.getHex();
        obj.material.emissive.setHex(new THREE.Color("#005e00").getHex());
      });
      highlightOff.on("emissive", function (obj) {
        obj.material.emissive.setHex(obj.currentHex);
      });
    }

    { /* LABELS */
      var showLable = new Foggle(this.options, "hideLabels");
      var hideLable = new Foggle(this.options, "hideLabels");
      this.hoverer.onMouseOver(showLable);
      this.hoverer.onMouseOut(hideLable);

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



}

module.exports = initEvents;