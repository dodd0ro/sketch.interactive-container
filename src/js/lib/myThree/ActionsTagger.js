class ActionsTagger {
  constructor() {
    this.actions = {};

    this._clock = new THREE.Clock();
    this._mixers = [];

    // BIND
    this.update.bind(this);
  }

  update() {
    let delta = this._clock.getDelta();
    for (let mixer of this._mixers) {
      mixer.update( delta );
    }
  }

  set(actionName, objects, clip) {
    if (objects.constructor == Array) {
      objects = new THREE.AnimationObjectGroup(...objects);
    }
    
    let mixer = new THREE.AnimationMixer(objects);
    let clipAction = mixer.clipAction(clip);

    this._mixers.push(mixer);
    this.actions[actionName] = clipAction;

    return clipAction;
  }

  get(actionName) {
    return this.actions[actionName];
  }
}

module.exports = ActionsTagger;


