Patch = (function() {
  function apply_patch(obj, patches) {
    var applied = [];
    
    for (var prop_name in patches) {
      if (!patches.hasOwnProperty(prop_name)) { continue; }

      var old_val = obj[prop_name];
      var new_val = patches[prop_name];

      if (typeof old_val === 'function' && typeof new_val !== 'function') {
        var const_val = new_val;
        new_val = function() { return const_val; }
      }
      
      obj[prop_name] = new_val;
      applied.push({
        prop_name: prop_name,
        old_val: old_val
      });
    }
    
    return applied;
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
    var applied_patches = apply_patch(obj, patches);

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
      apply_patch(obj, patches);
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