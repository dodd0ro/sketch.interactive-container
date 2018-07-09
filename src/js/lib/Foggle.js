// IMPORTS ///////

class CallableClass {
	// class's methods copied into function
	constructor() {
		let prototype = this.constructor.prototype; //new.target.prototype;
		let classFunction = (...args) => prototype.onCall.apply(classFunction, args);
		for (var property of Object.getOwnPropertyNames(prototype)) {
			classFunction[property] = prototype[property];
		}
		return classFunction;
	}
}

function onSetCaller(obj, prop, handler) {
	if (!(prop in obj)) throw 'no prop in obj';

	if (obj.__watchStack && obj.__watchStack[prop]) {
		obj.__watchStack[prop].push(handler);
		return;
	}

	///

	var
		oldval = obj[prop],
		newval = oldval,
		setter;

	if (!obj.__watchStack) {
		Object.defineProperty(obj, '__watchStack', {
			value: {},
			enumerable: false,
			configurable: true,
			writable: false
		});
	};
	obj.__watchStack[prop] = [ handler ];

	// setter

	let oldDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
	if (oldDescriptor.get) {
		setter = function(val) {
			oldval = newval;
			newval = oldDescriptor.get.call(obj, val);
		};
	} else {
		setter = function(val) {
			oldval = newval;
			newval = val;
		};
	}

	// update property descriptor

	if (delete obj[prop]) {
		Object.defineProperty(obj, prop, {
			get: function() {
				return newval;
			},
			set: function (val) {
				setter(val);
				for (let func of this.__watchStack[prop]) {
					func(newval, oldval, prop, this);
				}
			},
			enumerable: oldDescriptor.enumerable,
			configurable: true
		});
	}
	
}

////////////////////////////////////////////////////////////////////////////

class Foggle extends CallableClass {
	constructor(obj, property, defaultFunc = null) {
		super();
		this.obj = obj;
		this.property = property;
		this.defaultFunc = defaultFunc;
		this.funcs = new Map();
		this.func = null;

		onSetCaller(obj, property, this.update.bind(this));
	}

	onCall(...args) {
		this.func(...args);
	}

	on(...args) {
		/* 
		last arg - function
		other args - values
		 */
		let func = args.pop();
		for (let value of args) {
			if (value === '_ELSE') {
				this.defaultFunc = func;
			} else {
				this.funcs.set(value, func);
			}
		}

		this.update(this.obj[this.property]);
		return this;
	}

	update(val) {
		if (this.funcs.has(val)) {
			this.func = this.funcs.get(val);
		} else {
			try {
				
				this.func = (...args) => this.defaultFunc(...args);
			} catch (err) {
				if (err.name == 'TypeError') {
					throw "don't know what to do, add default function";
				} else {
					throw err;
				}
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////

function test() {
	let options = {
		b: 4
	};

	foggle = new Foggle(options, 'b')
		.on(4, function(val) {
			console.log(val, 4);
		})
		.on('_ELSE', function() {
			console.log(9);
		});

	foggle2 = new Foggle(options, 'b')
		.on(1, '_ELSE', function(val) {
			console.log(val, 4);
		})
	
	// console.log(foggle.obj);
	// console.log(foggle.on);
	foggle(2);
	foggle2(22);
	console.log('-----');
	options.b = 1;

	foggle(2);
	foggle2(22);
}

//////////////////////////////////////////////////////////////////////////

module.exports = Foggle;