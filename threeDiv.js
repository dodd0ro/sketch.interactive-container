class ThreeDiv {
	constructor() {

		this.div = document.createElement( 'div' );
		this.object = new THREE.CSS2DObject( this.div );

	}

	hide() {
		// this.div.style.visibility = "hidden";
		this.div.classList.remove('visible')
	}

	show() {
		// this.div.style.visibility = "visible";
		this.div.classList.add('visible')
	}
}

infoHtml = {

	cube: `
		<h3>КУБ</h3>
		<ul>
			
			<li>Шесть граней</li>
			<li>Цвет белый</li>
			<li>Не круглый</li>
		</ul>
	`,
	cube2: `
	<h3>ПАРАЛЛЕЛЕПИПЕД</h3>
	<ul>
		
		<li>Восемь углов</li>
		<li>Ниже куба</li>
	</ul>
`
} 

class InfoDiv extends ThreeDiv {
	constructor(parentObj, htmlId, positionArr, hoverer) {
		super();

		this.parentObj = parentObj;
		
		///

		let containerDiv = document.createElement('div');
		containerDiv.className = 'label_container'

		let lineDiv = document.createElement('div');
		lineDiv.className = 'label_line'

		let contentDiv = document.createElement('div');
		contentDiv.className = 'label_content'
		contentDiv.innerHTML = infoHtml[htmlId];
		// contentDiv.innerHTML = 'CUBE';

		///

		this.div.className = 'label';
		containerDiv.appendChild(contentDiv);
		containerDiv.appendChild(lineDiv);
		this.div.appendChild(containerDiv);

		this.object.position.set(...positionArr);

		this.parentObj.add(this.object)

		hoverer.onMouseOut(function(obj) {
			if (obj == this.parentObj) {    
				this.hide();
			}
		}.bind(this) );

		hoverer.onMouseOver(function(obj) {
			if (obj == this.parentObj) {
				this.show();
			}
		}.bind(this) );

		// this.div.innerHTML = ''

	}
}