class Label {
	constructor() {

		this.div = document.createElement( 'div' );
		this.object = new THREE.CSS2DObject( this.div );

	}

	hide() {
		// this.div.style.visibility = "hidden";
		this.div.classList.add('hidden');
	}

	hideBySelector(cssSelector) {
		for (let el of this.div.querySelectorAll(cssSelector)) {
			el.classList.add('hidden');
		}
	}

	show() {
		// this.div.style.visibility = "visible";
		this.div.classList.remove('hidden');
	}

	showBySelector(cssSelector) {
		for (let el of this.div.querySelectorAll(cssSelector)) {
			el.classList.remove('hidden');
		}
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
`,

 'default': `
	<h3>UNTITLED</h3>
	<ul>
		
		<li>Здесь ничего нет</li>
		<li>И здесь тоже ничего</li>
	</ul>
 `,

 
 'container': `
	<h3>CONTAINER</h3>
 `
} 

class InfoLabel  extends Label {
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
		let innerHTML = (htmlId in infoHtml) ? infoHtml[htmlId] : infoHtml['default']
		contentDiv.innerHTML = innerHTML;
		// contentDiv.innerHTML = 'CUBE';

		///

		this.div.className = 'label';
		containerDiv.appendChild(contentDiv);
		containerDiv.appendChild(lineDiv);
		this.div.appendChild(containerDiv);
		this.hide();

		
	
		this.parentObj.add(this.object)

		this.parentObj.geometry.computeBoundingBox();
		// this.object.position.add();

		let lerp = function (value1, value2, amount) {  // bad
			amount = amount < 0 ? 0 : amount;
			amount = amount > 1 ? 1 : amount;
			return value1 + (value2 - value1) * amount;
		};

		let {x: xMin,y:yMin, z:zMin} = this.parentObj.geometry.boundingBox.min;
		let {x: xMax, y: yMax, z: zMax} = this.parentObj.geometry.boundingBox.max;
		
		let x = lerp(xMin, xMax, positionArr[0]);
		let y = lerp(yMin, yMax, positionArr[1]);
		let z = lerp(zMin, zMax, positionArr[2]);

		// console.log(xMin,y,z)
		this.object.position.set(x, y, z)
		// console.log(	)

		/* EVENT - HOVER */

		let tmb_onMouseOver = new Tumblered(Options, 'hideLabels');
		let tmb_onMouseOut = new Tumblered(Options, 'hideLabels');
	
		/// hideLabels - true
	
		tmb_onMouseOver.on(true, function(obj) {
			if (obj != this.parentObj) return;
			this.show();
			this.div.classList.add('selected');
		}.bind(this));
	

		tmb_onMouseOut.on(true, function(obj) {
			if (obj != this.parentObj) return; 
			this.hide();
			this.div.classList.remove('selected');
		}.bind(this));
	
		// hideLabels - false
	
		tmb_onMouseOver.on(false, function(obj) {
			if (obj != this.parentObj) return; 
			this.div.getElementsByTagName('ul')[0].classList.remove('hidden')
			this.div.classList.add('selected');
		}.bind(this));
	
		tmb_onMouseOut.on(false, function(obj) {
			if (obj != this.parentObj) return; 
			this.div.getElementsByTagName('ul')[0].classList.add('hidden')
			this.div.classList.remove('selected');
		}.bind(this));

		///

		hoverer.onMouseOver(tmb_onMouseOver.getFunction());
		hoverer.onMouseOut(tmb_onMouseOut.getFunction());


		/* EVENT - IS VISIBLE */

		controls.addEventListener('change', function() {
			let p = toScreenPosition(this.object.position);

			if (Options.hideLabels) return;
			
			let isVisible = visibiler.check(this.parentObj.position, this.parentObj);
			if (!isVisible) {
				this.hide();
			} else {				
				this.show();
			};

		}.bind(this));	
		

	}
}