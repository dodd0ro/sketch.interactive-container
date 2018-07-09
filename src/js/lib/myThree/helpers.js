function lerp (amount, value1, value2) {
  return value1 + (value2 - value1) * amount;
};

function toScreenPosition(vector3, camera, renderer) {
  var vector = vector3.clone();

  var widthHalf = 0.5 * renderer.context.canvas.width;
  var heightHalf = 0.5 * renderer.context.canvas.height;

  vector.project(camera);
  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;

  return { 
      x: vector.x,
      y: vector.y
  };
};


function getNormRelativePosition(obj, normPos, increasePos = 0) {
  obj.geometry.computeBoundingBox();  // #bad!
  let parentBox = obj.geometry.boundingBox;
  let pbMin = parentBox.min;
  let pbMax = parentBox.max;

  let x = lerp(normPos[0], pbMin.x - increasePos, pbMax.x + increasePos);
  let y = lerp(normPos[1], pbMin.y - increasePos, pbMax.y + increasePos);
  let z = lerp(normPos[2], pbMin.z - increasePos, pbMax.z + increasePos);

  return new THREE.Vector3(x, y, z); // #bad?
};


module.exports = { toScreenPosition, getNormRelativePosition, lerp };


