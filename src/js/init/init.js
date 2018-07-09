module.exports = function() {
  require('./initBase').call(this);
  require('./initEvents').call(this);
  require('./initScene').call(this);
  require('./initGui').call(this);
}
