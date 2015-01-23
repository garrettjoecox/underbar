(function() {
  'use strict';

  window._ = {};

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    if (n > array.length){return array}
    return n === undefined ? array[array.length - 1] : array.slice(array.length - n, array.length)
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)){
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      };
    }else{
      for (var key in collection){
        iterator(collection[key], key, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    var results = -1;
    _.each(array, function (item, index){
      if (target === item && results === -1) results = index;
    })
    return results;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var results = [];
    _.each(collection, function (item){
      if (test(item)) results.push(item);
    })
    return results;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    var newTest = function(item){return !test(item)};
    return _.filter(collection, newTest);
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var results = [];
    _.each(array, function(item){
      if (_.indexOf(results, item) === -1) results.push(item);
    });
    return results;
  };

  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    var results = [];
    _.each(collection, function(item){
      results.push(iterator(item));
    })
    return results;
  };

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  _.reduce = function(collection, iterator, accumulator) {
    var result = accumulator === undefined ? collection[0] : accumulator;
    _.each(collection, function (item, index){
      if (accumulator !== undefined || index !== 0){
        result = iterator(result, item);
      }
    })
    return result;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    return _.indexOf(collection, target) === -1 ? false : true
  };

  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    if(iterator){
      return _.filter(collection, iterator).length === collection.length ? true : false;
    }else{
      return _.indexOf(collection, false) === -1 ? true : false
    }
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    var bool = false;
    var args = arguments.length;
    if (collection.length > 0){
      _.each(collection, function(i){
        if(!iterator){
          if (i === true){
            bool = true;
          }
        }else{
          if (iterator(i)){
            bool = true;
          }
        }
      })
    }
    return bool;
  };

  // Extend a given object with all the properties of the passed in
  // object(s).
  _.extend = function(obj) {
    var newObj = {};
    for (var i = 0; i < arguments.length; i++) {
      newObj = arguments[i];
      for (var key in newObj){
        obj[key] = newObj[key];
      }
    }
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    var newObj = {};
    var key = {};
    for (var i = 1; i < arguments.length; i++) {
      newObj = arguments[i];
      for (key in newObj) {
        if (obj[key] === void 0){
          obj[key] = newObj[key];
        }
      }
    }
    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function takes only one argument and that it is a primitive.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var history = {}
    return function(){
      var args = Array.prototype.slice.call(arguments);
      if (history[args]){
        return history[args];
      }else{
        history[args] = func.apply(null, args)
      }
      return history[args];
    }
  };
  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = [];
    for (var i = 2; i < arguments.length; i++) {
      args.push(arguments[i]);
    };
    setTimeout(function(){
      func.apply(this, args);
    }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    var shuffled = array.slice();
    _.each(shuffled, function (item, i){
      var random = Math.floor(Math.random()* (i + 1))
      if (random !== i){
        shuffled[i] = shuffled[random]
      }
      shuffled[random] = array[i]
    });
    return shuffled;
  };


  /**
   * EXTRA CREDIT
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var tempObj = {};
    var archive = [];
    for (var i = 0; i < arguments.length; i++) {
      var argArray = arguments[i];
      for (var g = 0; g < 3; g++) {
        if (tempObj[g] === undefined){
          tempObj[g] = [];
        }
        if (argArray[g] === undefined){
          tempObj[g].push(undefined);
        }else{
          tempObj[g].push(argArray[g]);
        }
      };
    };
    for(var key in tempObj){
      archive.push(tempObj[key])
    }
    return archive;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
};

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
    var results = [];
    var all = [];
    for (var i = 0; i < arguments.length; i++) {
      var argArray = arguments[i];
      for (var g = 0; g < argArray.length; g++) {
        if (_.indexOf(all, argArray[g]) === -1){
          all.push(argArray[g])
        }else{
          results.push(argArray[g]);
        }
      };
    };
    return results;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var results = [];
    var all = [];
    for (var i = 1; i < arguments.length; i++) {
      var argsArray = arguments[i];
      for (var g = 0; g < argsArray.length; g++) {
        all.push(argsArray[g])
      };
    };
    for (var i = 0; i < array.length; i++) {
      if(_.indexOf(all, array[i]) === -1)
      results.push(array[i])
    };
    return results;
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
    var throttle = false;
    return function(){
      if (throttle){
      }else{
        throttle = true;
        func();
        setTimeout(function(){
          throttle = false;
        }, wait)
      }
    }
  };
}());
