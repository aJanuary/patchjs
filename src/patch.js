Patch = (function() {
  function patch_object(obj, func_name, patch_func, scope) {
    var old_func = obj[func_name];

    if (typeof patch_func !== 'function' && typeof old_func === 'function') {
      var const_val = patch_func;
      patch_func = function() { return const_val; }
    }
    
	  obj[func_name] = patch_func;

    try {
      scope();
    } finally {
      obj[func_name] = old_func;
	  }
  }

  return {
    object: patch_object
  };
})();