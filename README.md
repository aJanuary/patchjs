patch.js
=======
patch.js is a simple javascript library for patching object properties withing a specific scope.

## Usage

### Patching Objects
You can patch properties on any object using `Patch.object`. The properties will be replaced with the patched version while the scope is run, and reverted to their original after.

```javascript
var obj = {
  func: function() { return false; },
  prop: false
};

Patch.object(obj, {
  'func': function() { return true; },
  'prop': true
}, function() {
  console.log(obj.func()); // --> true
  console.log(obj.prop);   // --> true
});

console.log(obj.func()); // --> false
console.log(obj.prop);   // --> false
```

### Patching Functions with Constants
If you are patching a function to return a constant value, you can just provide the value in the patch specification and it will transform it into a function for you.

```javascript
var obj = {
  func: function() { return false; }
};

Patch.object(obj, { 'func': true }, function() {
  console.log(obj.func()); // --> true
})

console.log(obj.func());   // --> false
```

### Patching the Prototype
If you want to temporarily patch all instances of an object, you can of course patch the prototype.

```javascript
var Obj = function() {
  this.value = false;
};
var obj1 = new Obj();
var obj2 = new Obj();

Patch.object(Obj.prototype, { 'value': true }, function() {
  console.log(obj1.value); // --> true
  console.log(obj2.value); // --> true
});

console.log(obj1.value);   // --> false
console.log(obj2.value);   // --> false
```

### Patching New Objects
Sometimes you want to patch new object instances created inside the scope while leaving existing and future objects alone. This can be achieved using `Patch.new_objects`.

```javascript
var Namespace = {
  Obj: function() {
    this.value = false;
  }
};

var oldObj = new Namespace.Obj();

Patch.new_objects(Namespace, 'Obj', { value: true }, function() {
  var newObj = new Namespace.Obj();
  console.log(newObj.value); // --> true
  console.log(oldObj.value); // --> false
});

console.log(new Namespace.Obj().value); // --> false
```

Note you need the object the constructor is a property on; unfortunately you can't patch object constructors that are just in the local scope. In the browser, constructors in the global scope are properties on `window`.

```javascript
Patch.new_objects(window, 'Date', { 'getTime': 100 }, func_that_creates_dates);
```
