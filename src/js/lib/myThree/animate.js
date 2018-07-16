function animate(time) {
  requestAnimationFrame(animate);
  // onTick
  for (let i = 0; i < animate.funcs.length; i++) {
    animate.funcs[i](time);
  }
  // onTickEnd
  for (let i = 0; i < animate.funcsLast.length; i++) {
    animate.funcsLast[i](time);
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