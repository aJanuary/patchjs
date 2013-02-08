Patch = (function() {
  function apply_patches(obj, patches) {
    var applied = [];
    
    for (var prop_name in patches) {
      if (!patches.hasOwnProperty(prop_name)) { continue; }
      
      var new_val = patches[prop_name];
      var patch = apply_patch(obj, prop_name, new_val);
      applied.push(patch);
    }
    
    return applied;
  }
  
  function apply_patch(obj, prop_name, new_val) {
    var old_val = obj[prop_name];
    new_val = const_to_function(new_val, old_val);
      
    obj[prop_name] = new_val;
      
    return {
      prop_name: prop_name,
      old_val: old_val
    }
  }
  
  function const_to_function(new_val, old_val) {
    var expecting_function = typeof old_val === 'function';
    var new_val_is_const = typeof new_val !== 'function';

    if (expecting_function && new_val_is_const) {
      var const_val = new_val;
      return function() { return const_val; };
    } else {
      return new_val;
    }
  }
  
  function revert_patches(obj, patches) {
    for (var i = 0, len = patches.length; i < len; i += 1) {
      var patch = patches[i];
      obj[patch.prop_name] = patch.old_val;
    }
  }
  
   function construct_object(Constructor, args) {
		var Temp = function() { };
		Temp.prototype = Constructor.prototype;
		
		var inst = new Temp();
		var ret = Constructor.apply(inst, args);
		
		return Object(ret) === ret ? ret : inst;
	}
  
  function patch_object(obj, patches, scope) {
    var applied_patches = apply_patches(obj, patches);

    try {
      scope();
    } finally {
      revert_patches(obj, applied_patches);
	  }
  }
  
  function patch_new_objects(context, obj_name, patches, scope) {
    var OldConstructor = context[obj_name];
    context[obj_name] = function() {
      var obj = new construct_object(OldConstructor, arguments);
      apply_patches(obj, patches);
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