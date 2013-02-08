Patch = (function() {
  function apply_patch(obj, prop_name, new_val) {
    var old_val = obj[prop_name];

    if (typeof old_val === 'function' && typeof new_val !== 'function') {
      var const_val = new_val;
      new_val = function() { return const_val; }
    }
    
	  obj[prop_name] = new_val;
    
    return old_val;
  }
  
   function construct_object(Constructor, args) {
		var Temp = function() { };
		Temp.prototype = Constructor.prototype;
		
		var inst = new Temp();
		var ret = Constructor.apply(inst, args);
		
		return Object(ret) === ret ? ret : inst;
	}
  
  function patch_object(obj, prop_name, new_val, scope) {
    var old_val = apply_patch(obj, prop_name, new_val);

    try {
      scope();
    } finally {
      obj[prop_name] = old_val;
	  }
  }
  
  function patch_new_objects(context, obj_name, prop_name, new_val, scope) {
    var OldConstructor = context[obj_name];
    context[obj_name] = function() {
      var obj = new construct_object(OldConstructor, arguments);
      apply_patch(obj, prop_name, new_val);
      return obj;
    };
    
    try {
      scope();
    } finally {
      context[obj_name] = OldConstructor;
    }
  }

  return {
    object: patch_object,
    new_objects: patch_new_objects
  };
})();