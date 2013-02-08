Patch = (function() {
  function patch_object(scope) {
	scope();
  }

  return {
    object: patch_object
  };
})();