Patch = (function() {
  function patch_object(obj, func_name, patch_func, scope) {
    var old_func = obj[func_name];
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