class Hoverer {
  constructor(camera, domElem=window ) {

    this.objects = [];
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();

    this.domElement = domElem;
    this._intersected = null;
    this._mouse = new THREE.Vector2(2, 2);
    

    domElem.addEventListener( 'mousemove', function(event) {
      this._mouse.x = ( event.clientX / this.domElement.offsetWidth ) * 2 - 1;
      this._mouse.y = - ( event.clientY / this.domElement.offsetHeight ) * 2 + 1;
    }.bind(this), false );

    this.onMouseOver = function() {};
    this.onMouseOut = function() {};

    // BIND

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
        if ( this._intersected  ) this.onMouseOut(this._intersected);
        this._intersected = intersects[ 0 ].object;
        this.onMouseOver(this._intersected );
      }
    } else {
      if ( this._intersected  ) this.onMouseOut(this._intersected);
      this._intersected  = null;
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