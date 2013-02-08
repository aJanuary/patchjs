describe('Patch', function() {
  describe('object', function() {
    it('invokes the scope function', function() {
	  var hasBeenCalled = false;

	  Patch.object(function() {
	    hasBeenCalled = true;
	  });

	  expect(hasBeenCalled).toBe(true);
	});
  });
});