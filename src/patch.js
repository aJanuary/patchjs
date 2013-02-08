Patch = (function() {
  function patch_object(obj, prop_name, new_val, scope) {
    var old_val = obj[prop_name];

    if (typeof old_val === 'function' && typeof new_val !== 'function') {
      var const_val = new_val;
      new_val = function() { return const_val; }
    }
    
	  obj[prop_name] = new_val;

    try {
      scope();
    } finally {
      obj[prop_name] = old_val;
	  }
  }
  
  function patch_new_objects(context, obj_name, prop_name, new_val, scope) {
    var OldConstructor = context[obj_name];
    context[obj_name] = function() {
      var obj = new OldConstructor();
      obj[prop_name] = new_val;
      return obj;
    };
    scope();
  }

  return {
    object: patch_object,
    new_objects: patch_new_objects
  };
})();