class Hoverer {
  constructor(canvas, camera, containerDiv=null) {

    this.canvas = canvas;
    this.camera = camera;
    this.containerDiv = (containerDiv) ? containerDiv : canvas.parentElement;

    this.objects = [];
    this.raycaster = new THREE.Raycaster();

    this._intersected = null;
    this._mouse = new THREE.Vector2(2, 2);
    this._onMouseOver = [];
    this._onMouseOut = [];

    /// EVENT

    this.containerDiv.addEventListener( 'mousemove', function(event) {

      let canvasRect = this.canvas.getBoundingClientRect();
      let x = event.clientX - canvasRect.left;
      let y = event.clientY - canvasRect.top;

      this._mouse.x = ( x / this.canvas.clientWidth ) * 2 - 1;
      this._mouse.y = - ( y / this.canvas.clientHeight ) * 2 + 1;
    }.bind(this), false );

    /// BIND

    this.update = this.update.bind(this);

  }

  addObject(obj) {
    this.objects.push(obj);
  }

  update() {
    this.raycaster.setFromCamera( this._mouse, this.camera );
    let intersects = this.raycaster.intersectObjects( this.objects );
    
    if ( intersects.length > 0 ) {
      if ( this._intersected != intersects[ 0 ].object ) {
        if ( this._intersected  ) this.doMouseOut();
        this._intersected = intersects[ 0 ].object;
        this.doMouseOver();
      }
    } else {
      if ( this._intersected  ) {
        this.doMouseOut();
      }
      this._intersected  = null;
    }
  }

  onMouseOut(func) {
    this._onMouseOut.push(func)
  }

  onMouseOver(func) {
    this._onMouseOver.push(func)
  }

  doMouseOut(func) {
    for (let func of this._onMouseOut) {
      func(this._intersected );
    }
  }

  doMouseOver(func) {
    for (let func of this._onMouseOver) {
      func(this._intersected );
    }
  }

}


// hoverer.onMouseOver = function (obj) {

//   obj.currentHex = obj.material.emissive.getHex();
//   obj.material.emissive.setHex( new THREE.Color('#00ff00').getHex () );

// };

// hoverer.onMouseOut = function (obj) {
//   obj.material.emissive.setHex( obj.currentHex );

// };