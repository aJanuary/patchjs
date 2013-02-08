describe('Patch', function() {
  var obj;
  var Obj = function() {
    this.patched = false;
  }
  Obj.prototype.isPatched = function() { return this.patched; }
  
  beforeEach(function() {
    obj = new Obj();
  });

  describe('object', function() {
    it('invokes the scope function', function() {
	  var hasBeenCalled = false;

	  Patch.object({}, 'abc', function() { }, function() {
	    hasBeenCalled = true;
	  });

	  expect(hasBeenCalled).toBe(true);
	});
	
    it('patches the function implementation', function() {
      Patch.object(obj, 'isPatched', function() { return true; }, function() {
	    console.log(obj);
	    expect(obj.isPatched()).toBe(true);
	  });
    });
  });
});