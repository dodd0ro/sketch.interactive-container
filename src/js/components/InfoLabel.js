const { getNormRelativePosition } = require('../lib/myThree/helpers.js')

class InfoLabel extends THREE.CSS2DObject {
	constructor(templateId) {
		super(document.createElement( 'div' ));

		this.name = 'infoLable';

		let _lineDiv = document.createElement('div');
		_lineDiv.className = 'label_line'

		let _contentDiv = document.createElement('div');
		_contentDiv.className = 'label_content'
		_contentDiv.innerHTML =  document.getElementById(templateId).innerHTML;

		let containerDiv = document.createElement('div');
		containerDiv.className = 'label_container'
		containerDiv.appendChild(_contentDiv);
		// containerDiv.appendChild(_lineDiv);

		this.element.className = 'label';
		this.element.appendChild(containerDiv);
	}

	connectObject(obj, relativePosition = null) {
		if (relativePosition) {
			this.position.copy(getNormRelativePosition(obj, relativePosition, 1));
		}
		obj.add(this);
		obj.userData.infoLable = this;
	}

	setNormRelativePosition(obj, relativePosition) {
		this.position.copy(getNormRelativePosition(obj, relativePosition, 1));
	}

	
	connectVisibiler(visibiler) {
		visibiler.addChecker({
			position: this.position.clone().add(this.parent.position),
			onVisible: () => { this.hide(false) },
			onNotVisible: () => { if (!this.isSelected) this.hide(true) },
			// ignoreObjects: [this.parent]
		});
	}

	get classList() {
		return this.element.classList
	}

	hide(bool=true) {
		if (bool) 
			this.element.classList.add('hidden');
		else 
			this.element.classList.remove('hidden');
		return this
	}

	get isHidden() {
		return this.element.classList.contains('hidden')
	}

	select(bool=true) {
		if (bool) 
			this.element.classList.add('selected');
		else 
			this.element.classList.remove('selected');
		return this
	}

	get isSelected() {
		return this.element.classList.contains('selected')
	}

	hideList(bool=true) {
		if (bool) 
			this.element.getElementsByTagName('ul')[0]
			.classList.add('hidden');
		else 
			this.element.getElementsByTagName('ul')[0]
			.classList.remove('hidden');
	}

	hideBySelector(cssSelector) {
		for (let el of this.element.querySelectorAll(cssSelector)) {
			el.classList.add('hidden');
		}
	}

	showBySelector(cssSelector) {
		for (let el of this.element.querySelectorAll(cssSelector)) {
			el.classList.remove('hidden');
		}
	}


}

module.exports = InfoLabel;

/* 
castShadow: false
children: []
element: div.label.hidden
frustumCulled: true
layers: Layers {mask: 1}
matrix: Matrix4 {elements: Array(16)}
matrixAutoUpdate: true
matrixWorld: Matrix4 {elements: Array(16)}
matrixWorldNeedsUpdate: false
name: ""
parent: Mesh {uuid: "2EAA0F5E-E29E-4036-9DB5-29C985B64460", name: "", type: "Mesh", parent: Group, children: Array(1), …}
position: Vector3 {x: 0, y: 50, z: 0}
quaternion: Quaternion {_x: 0, _y: 0, _z: 0, _w: 1, onChangeCallback: ƒ}
receiveShadow: false
renderOrder: 0
rotation: Euler {_x: 0, _y: 0, _z: 0, _order: "XYZ", onChangeCallback: ƒ}
scale: Vector3 {x: 1, y: 1, z: 1}
type: "Object3D"
up: Vector3 {x: 0, y: 1, z: 0}
userData: {}
uuid: "3C58ED37-64A0-4E01-AD97-C7423F97449F"
visible: true
_listeners: {removed: Array(1)}
eulerOrder: (...)
id: 24
modelViewMatrix: Matrix4 {elements: Array(16)}
normalMatrix: Matrix3 {elements: Array(9)}
useQuaternion:(...)
__proto__: Object3D 
*/
