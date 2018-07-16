class ObjectTagger {
  constructor() {
    this.tags = {}
  }

  set(key, value, object) {

    let tagKey = this.tags[key];
    if (!tagKey) {
      tagKey = this.tags[key] = {};
    }
    let TagValue = tagKey[value]
    if (!TagValue) {
      TagValue = tagKey[value] = [];
    }
    TagValue.push(object);

    // add tag to object
    let objTags = object.userData.tags; 
    if (!objTags) {
      objTags = object.userData.tags = {};
    }
    objTags[key] = value;
  }

  get(key, value = null) {
    let keyObj = this.tags[key];
    if (!keyObj) return;

    if (value) return this.tags[key][value];
    return keyObj;
  }
  
  getByObject(key, object) {
    let objTags = object.userData.tags;
    if (!(objTags && objTags[key])) return;

    let value = objTags[key];
    return this.tags[key][value];
  }

}

module.exports = ObjectTagger;