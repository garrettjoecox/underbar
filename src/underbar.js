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
    return n === undefined ? array[array.length - 1] : array.slice(Math.max(0, array.length-n));
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)){
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    }else{
      for (var key in collection){
        iterator(collection[key], key, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    var result = -1;
    _.each(array, function (item, index){
      if (target === item && result === -1) result = index;
    });
    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var results = [];
    _.each(collection, function (item){
      if (test(item)) results.push(item);
    });
    return results;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    return _.filter(collection, function(item){ return !test(item); });
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var uniq = {}, results = [];
    _.each(array, function(item){
      uniq[item] = item;
    });
    _.each(uniq, function(item){
      results.push(item);
    });
    return results;
  };

  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    var results = [];
    _.each(collection, function(item){
      results.push(iterator(item));
    });
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
    });
    return result;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    return _.indexOf(collection, target) === -1 ? false : true;
  };

  // Determine whether all of the elements match a truth test.
  // Refactor
  _.every = function(collection, iterator) {
    iterator = iterator || _.identity;
    return !!_.reduce(collection, function(accumulator, value){
      return accumulator && iterator(value);
    }, true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  // Refactor
  _.some = function(collection, iterator) {
    iterator = iterator || _.identity;
    return !_.every(collection, function(value){
      return !iterator(value);
    });
  };

  // Extend a given object with all the properties of the passed in
  // object(s).
  _.extend = function(obj) {
    _.each(arguments, function(newObj){
      _.each(newObj, function(item, key){
        obj[key] = item;
      });
    });
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    _.each(arguments, function(source){
      _.each(source, function(value, key){
        obj[key] === undefined && (obj[key] = value);
      });
    });
    return obj;
  };

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    var alreadyCalled = false;
    var result;
    return function() {
      if (!alreadyCalled) {
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function takes only one argument and that it is a primitive.
  _.memoize = function(func) {
    var history = {};
    return function(){
      var args = Array.prototype.slice.call(arguments);
      if (!history[args]){
        history[args] = func.apply(null, args);
      }
      return history[args];
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = Array.prototype.slice.call(arguments, 2);
    setTimeout(function(){
      func.apply(this, args);
    }, wait);
  };

  // Randomizes the order of an array's contents.
  _.shuffle = function(array) {
    var results = [];
    var usedIndex = [];
    while (usedIndex.length < array.length){
      var ran = Math.floor(Math.random()*array.length);
      if (_.indexOf(usedIndex, ran) === -1) usedIndex.push(ran);
    }
    _.each(usedIndex, function(item){
      results.push(array[item]);
    });
    return array.join() === results.join() ? _.shuffle(results) : results;
  };

  // Calls the method named by functionOrKey on each value in the list.
  _.invoke = function(collection, functionOrKey, args) {
    return _.map(collection, function(item){
      if (typeof functionOrKey === "string"){
        return item[functionOrKey].apply(item, args);
      }else{
        return functionOrKey.apply(item, args);
      }
    });
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
    var tempArray = [];
    if(iterator === 'length'){
      collection.sort(function(a, b) {return a.length - b.length;});
    }else if(_.containsNumber(collection)){
      collection.sort(function(a, b) {return a - b;});
    }else{
      collection.sort(iterator);
    }
    return collection;
  };

  // Returns true if collection contains a number.
  _.containsNumber = function(collection){
    var result = false;
    _.each(collection, function(item){
      if (typeof item === 'number') result = true;
    });
    return result;
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  _.zip = function() {
    var archive = [];
    for (var i = 0; i < arguments.length; i++) {
      archive.push(_.pluck(arguments, i));
    }
    return archive;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  _.flatten = function(nestedArray) {
    var results = [];
    var filter = function(thing){
      if (!Array.isArray(thing)){
        results.push(thing);
      }else{
        return _.each(thing, function(item){
          return filter(item);
        });
      }
    };
    filter(nestedArray);
    return results;
};

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function(array1, array2) {
    var results = [];
    _.each(array1, function(item){
      if(_.indexOf(array2, item) !== -1) results.push(item);
    });
    return results;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var results = [];
    var all = [];
    for (var i = 1; i < arguments.length; i++) {
      _.each(arguments[i], function(item){
        all.push(item);
      });
    }
    _.each(array, function(item){
      if (_.indexOf(all, item) === -1) results.push(item);
    });
    return results;
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  _.throttle = function(func, wait) {
    var flipswitch = false;
    return function(){
      if(!flipswitch){
        flipswitch = true;
        func();
        setTimeout(function(){ flipswitch = false; }, wait);
      }
    };
  };
}());
