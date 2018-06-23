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

    /// EVENT - MOUSEMOVE

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


class Visibiler { // VERY BAD!!!

  constructor(canvas, camera, containerDiv=null) {
    this.canvas = canvas;
    this.camera = camera;
    this.containerDiv = (containerDiv) ? containerDiv : canvas.parentElement;

    this.objects = [];
    this.raycaster = new THREE.Raycaster();

    this._mouse = new THREE.Vector2(2, 2);

  }

  addObjects(array) {
    this.objects = this.objects.concat(array);
  }

  check(vector3d, obj) {


    /// get mouse

    let {x, y} = toScreenPosition(vector3d, this.camera);

    let canvasRect = this.canvas.getBoundingClientRect();
    x = x - canvasRect.left;
    y = y - canvasRect.top;
    
    this._mouse.x = ( x / this.canvas.clientWidth ) * 2 - 1;
    this._mouse.y = - ( y / this.canvas.clientHeight ) * 2 + 1;

    ///

    this.raycaster.setFromCamera( this._mouse, this.camera );
    let intersects = this.raycaster.intersectObjects( this.objects );
    // console.log(intersects[0].object == obj);
    
    if ( intersects.length <= 0 || intersects[0].object == obj ) {
      return true;
    } else {
      return false;
    }

  }
}


function toScreenPosition(vector3d) {
  var vector = vector3d.clone();

  var widthHalf = 0.5*renderer.context.canvas.width;
  var heightHalf = 0.5*renderer.context.canvas.height;


  vector.project(camera);

  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;

  return { 
      x: vector.x,
      y: vector.y
  };

};