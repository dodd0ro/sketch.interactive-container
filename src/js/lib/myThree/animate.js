function animate() {
  requestAnimationFrame(animate.bind(this)); // #bad
  // onTick
  for (let i = 0; i < animate.funcs.length; i++) {
    animate.funcs[i]();
  }
  // onTickEnd
  for (let i = 0; i < animate.funcsLast.length; i++) {
    animate.funcsLast[i]();
  }
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