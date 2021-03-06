describe('Patch', function() {
  var obj;
  var Obj = function() {
    this.patched = false;
    this.arguments = Array.prototype.slice.call(arguments);
  }
  Obj.prototype.isPatched = function() { return this.patched; }
  
  var Namespace = {
    Obj: Obj
  };
  
  beforeEach(function() {
    obj = new Namespace.Obj();
  });

  describe('object', function() {
    it('invokes the scope function', function() {
	    var hasBeenCalled = false;

	    Patch.object({}, {}, function() {
	      hasBeenCalled = true;
	    });

	    expect(hasBeenCalled).toBe(true);
	  });
	
    it('patches functions', function() {
      Patch.object(obj, {'isPatched': function() { return true; }}, function() {
	      expect(obj.isPatched()).toBe(true);
	    });
    });
    
    it('patches variables', function() {
      Patch.object(obj, {'patched': true}, function() {
	      expect(obj.patched).toBe(true);
	    });
    });
    
    it('patches multiple properties', function() {
      Patch.object(obj, {'isPatched': function() { return true; }, 'arguments': [1, 2, 3]}, function() {
        expect(obj.isPatched()).toBe(true);
        expect(obj.arguments).toEqual([1, 2, 3]);
      });
    });
    
    it('creates a patch function out of a constant value', function() {
      Patch.object(obj, {'isPatched': true}, function() {
	      expect(obj.isPatched()).toBe(true);
	    });
    });
	
  	it('unpatches after executing the scope', function() {
      Patch.object(obj, {'isPatched': function() { return true; }}, function() { });
	    expect(obj.isPatched()).toBe(false);
	  });
	
    it('unpatches if scope throws an exception', function() {
      expect(function() {
        Patch.object(obj, {'isPatched': function() { return true; }}, function() {
          throw 'error';
        })
      }).toThrow('error');

	    expect(obj.isPatched()).toBe(false);
	  });    
  });

  describe('new_objects', function() {
    it('invokes the scope function', function() {
      var hasBeenCalled = false;
      
      Patch.new_objects(Namespace, 'Obj', {}, function() {
        hasBeenCalled = true;
      });
      
      expect(hasBeenCalled).toBe(true);
    });
    
    it('patches functions', function() {
      Patch.new_objects(Namespace, 'Obj', {'isPatched': function() { return true; }}, function() {
        expect(new Namespace.Obj().isPatched()).toBe(true);
      });
    });
    
    it('patches variables', function() {
      Patch.new_objects(Namespace, 'Obj', {'patched': true}, function() {
        expect(new Namespace.Obj().patched).toBe(true);
      });
    });
    
    it('patches multiple properties', function() {
      Patch.new_objects(Namespace, 'Obj', {'isPatched': true, 'arguments': [1, 2, 3]}, function() {
        var newObj = new Namespace.Obj();
        expect(newObj.isPatched()).toBe(true);
        expect(newObj.arguments).toEqual([1, 2, 3]);
      });
    });
    
    it('creates a patch function out of a constant value', function() {
      Patch.new_objects(Namespace, 'Obj', {'isPatched': true}, function() {
        expect(new Namespace.Obj().isPatched()).toBe(true);
      });
    });
    
    it('unpatches after executing the scope', function() {
      Patch.new_objects(Namespace, 'Obj', {'isPatched': true}, function() { });
      expect(new Namespace.Obj().isPatched()).toBe(false);
    });
    
    it('unpatches if scope throws an exception', function() {
      expect(function() {
        Patch.new_objects(Namespace, 'Obj', {'isPatched': true}, function() {
          throw 'error';
        })
      }).toThrow('error');

	    expect(new Namespace.Obj().isPatched()).toBe(false);
    });
    
    it('passes arguments to original constructor', function() {
      Patch.new_objects(Namespace, 'Obj', {'isPatched': true}, function() {
        var newObj = new Namespace.Obj(1, 2, 3);
        expect(newObj.arguments).toEqual([1, 2, 3]);
      });
    });
    
    it('does not affect existing objects', function() {
      Patch.new_objects(Namespace, 'Obj', {'isPatched': true}, function() {
        expect(obj.isPatched()).toBe(false);
      });
    });
    
    it('does not unpatch objects created in scope', function() {
      Patch.new_objects(Namespace, 'Obj', {'isPatched':true}, function() {
        obj = new Namespace.Obj();
      });
      expect(obj.isPatched()).toBe(true);
    });
  });
});