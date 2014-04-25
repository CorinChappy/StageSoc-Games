/* Custom event emitter, same syntax as event naitve JS */
(function(){

(function(obj, evnts){
	if(!(evnts === true)){ // Allows arbirtary events
		var events = evnts || []; // List of supported events
	}

	var listeners = {}; // Pairing from name of event and array of registered listeners

	var AEL = function(name, func){
		if(!(func && {}.toString.call(func) === '[object Function]')){ // Check if func is a function
			return false;
		}

		var a = listeners[name];

		if(!a){
			a = [];
		}

		a.push(func);
	};

	var REL = function(name, func){
		var a = listeners[name];

		if(!a){
			return false;
		}

		var i = a.indexOf(func);
		if(i > -1){
			array.splice(i,1);
		}

	};

	var EM = function(name, info){
		var a = listeners[name];

		if(!a){
			return;
		}

		a.forEach(function(f){
			f.call(obj, info);
		});
	};

	// Add to the object
	obj.addEventListener = AEL;
	obj.removeEventListener = REL;
	obj.emmitEvent = EM;
})(rigger);

})();