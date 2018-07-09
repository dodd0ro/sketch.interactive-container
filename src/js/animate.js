function animate() {
  requestAnimationFrame(animate.bind(this)); // #bad
  
  // onTick
  for (let i = 0; i < animate.funcs.length; i++) {
    animate.funcs[i]();
  }

  this.controls.update();
  this.hoverer.updateIntersects();

  // onTickEnd
  for (let i = 0; i < animate.funcsLast.length; i++) {
    animate.funcsLast[i]();
  }
  if (this.options.highlightMode == "emissive") this.renderer.render(this.scene, this.camera);
  this.labelRenderer.render(this.scene, this.camera);
  if (this.options.highlightMode == "outline") this.composer.render();
}

animate.funcs = [];
animate.onTick = function(func) {
  animate.funcs.push(func);
};

animate.funcsLast = [];
animate.onTickEnd = function(func) {
  animate.funcsLast.push(func);
};

module.exports = animate;