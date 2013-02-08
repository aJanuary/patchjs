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

  return {
    object: patch_object
  };
})();