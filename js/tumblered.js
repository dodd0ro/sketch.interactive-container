class Tumblered {

  constructor(obj, property) {
    this.obj = obj;
    this.property = property;
    this.funcs = new Map();
  }

  on(value, func) {
    this.funcs.set(value, func);
    return this;
  }

  getFunction() {
    return this.runFunction.bind(this)  // perfomance?
  }

  runFunction(...args) {
    let value = this.obj[this.property];
    if (!this.funcs.has(value)) return;
    this.funcs.get(value)(...args);
  }

}
