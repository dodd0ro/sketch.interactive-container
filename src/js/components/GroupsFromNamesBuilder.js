class GroupsFromNamesBuilder {
  constructor(separator = '__') {
    this.group = new THREE.Group();
    this._map = {};

    this.separator = separator;
  }

  add(object) {
    //determin group
    var subGroup = this._map[object.name];
    if (!subGroup) {
      let _subGroup = this.group;
      for (let groupName of object.name.split(this.separator)) {
        let curGroup = _subGroup.getObjectByName(groupName);
        if (!curGroup) {
          curGroup = new THREE.Group();
          curGroup.name = groupName;
          _subGroup.add(curGroup);
          g.hoverer.addObject(curGroup); // !!!
        }
        _subGroup = curGroup;
      }
      this._map[object.name] = {
        group: _subGroup,
        objects: []
      };
    }
    // add object
    this._map[object.name].objects.push(object);
  }

  bake() {
    for (let subGroupName in this._map) {
      let map = this._map[subGroupName];
      for (let object of map.objects) {
        map.group.add(object);
      }
    }
    return this.group;
  }

}

module.exports = GroupsFromNamesBuilder;