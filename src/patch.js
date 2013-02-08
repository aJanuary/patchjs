Patch = (function() {
  function patch_object(obj, func_name, patch_func, scope) {
    obj[func_name] = patch_func;
	scope();
  }

  return {
    object: patch_object
  };
})();