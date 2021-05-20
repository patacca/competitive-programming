/*

// SOURCE FILE: LICENSE
Copyright (c) 2006-2009 The Chromium OS Authors. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of Google Inc. nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(array) {
  var index = 0;
  return function() {
    return index < array.length ? {done:!1, value:array[index++], } : {done:!0};
  };
};
$jscomp.arrayIterator = function(array) {
  return {next:$jscomp.arrayIteratorImpl(array)};
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(target, property, descriptor) {
  if (target == Array.prototype || target == Object.prototype) {
    return target;
  }
  target[property] = descriptor.value;
  return target;
};
$jscomp.getGlobal = function(passedInThis) {
  for (var possibleGlobals = ["object" == typeof globalThis && globalThis, passedInThis, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, ], i = 0; i < possibleGlobals.length; ++i) {
    var maybeGlobal = possibleGlobals[i];
    if (maybeGlobal && maybeGlobal.Math == Math) {
      return maybeGlobal;
    }
  }
  return function() {
    throw Error("Cannot find global object");
  }();
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(target, property) {
  var obfuscatedName = $jscomp.propertyToPolyfillSymbol[property];
  if (null == obfuscatedName) {
    return target[property];
  }
  var polyfill = target[obfuscatedName];
  return void 0 !== polyfill ? polyfill : target[property];
};
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  polyfill && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(target, polyfill, fromLang, toLang) : $jscomp.polyfillUnisolated(target, polyfill, fromLang, toLang));
};
$jscomp.polyfillUnisolated = function(target, polyfill, fromLang, toLang) {
  for (var obj = $jscomp.global, split = target.split("."), i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      return;
    }
    obj = obj[key];
  }
  var property = split[split.length - 1], orig = obj[property], impl = polyfill(orig);
  impl != orig && null != impl && $jscomp.defineProperty(obj, property, {configurable:!0, writable:!0, value:impl});
};
$jscomp.polyfillIsolated = function(target, polyfill, fromLang, toLang) {
  var split = target.split("."), isSimpleName = 1 === split.length, root = split[0];
  var ownerObject = !isSimpleName && root in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in ownerObject)) {
      return;
    }
    ownerObject = ownerObject[key];
  }
  var property = split[split.length - 1], nativeImpl = $jscomp.IS_SYMBOL_NATIVE && "es6" === fromLang ? ownerObject[property] : null, impl = polyfill(nativeImpl);
  null != impl && (isSimpleName ? $jscomp.defineProperty($jscomp.polyfills, property, {configurable:!0, writable:!0, value:impl}) : impl !== nativeImpl && (void 0 === $jscomp.propertyToPolyfillSymbol[property] && ($jscomp.propertyToPolyfillSymbol[property] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(property) : $jscomp.POLYFILL_PREFIX + property), $jscomp.defineProperty(ownerObject, $jscomp.propertyToPolyfillSymbol[property], {configurable:!0, writable:!0, value:impl})));
};
$jscomp.initSymbol = function() {
};
$jscomp.polyfill("Symbol", function(orig) {
  if (orig) {
    return orig;
  }
  var SymbolClass = function(id, opt_description) {
    this.$jscomp$symbol$id_ = id;
    $jscomp.defineProperty(this, "description", {configurable:!0, writable:!0, value:opt_description});
  };
  SymbolClass.prototype.toString = function() {
    return this.$jscomp$symbol$id_;
  };
  var counter = 0, symbolPolyfill = function(opt_description) {
    if (this instanceof symbolPolyfill) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new SymbolClass("jscomp_symbol_" + (opt_description || "") + "_" + counter++, opt_description);
  };
  return symbolPolyfill;
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function(orig) {
  if (orig) {
    return orig;
  }
  for (var symbolIterator = Symbol("Symbol.iterator"), arrayLikes = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), i = 0; i < arrayLikes.length; i++) {
    var ArrayLikeCtor = $jscomp.global[arrayLikes[i]];
    "function" === typeof ArrayLikeCtor && "function" != typeof ArrayLikeCtor.prototype[symbolIterator] && $jscomp.defineProperty(ArrayLikeCtor.prototype, symbolIterator, {configurable:!0, writable:!0, value:function() {
      return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
    }});
  }
  return symbolIterator;
}, "es6", "es3");
$jscomp.iteratorPrototype = function(next) {
  var iterator = {next:next};
  iterator[Symbol.iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.createTemplateTagFirstArg = function(arrayStrings) {
  return arrayStrings.raw = arrayStrings;
};
$jscomp.createTemplateTagFirstArgWithRaw = function(arrayStrings, rawArrayStrings) {
  arrayStrings.raw = rawArrayStrings;
  return arrayStrings;
};
$jscomp.makeIterator = function(iterable) {
  var iteratorFunction = "undefined" != typeof Symbol && Symbol.iterator && iterable[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator(iterable);
};
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (null == thisArg) {
    throw new TypeError("The 'this' value for String.prototype." + func + " must not be null or undefined");
  }
  if (arg instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + func + " must not be a regular expression");
  }
  return thisArg + "";
};
$jscomp.polyfill("String.prototype.repeat", function(orig) {
  return orig ? orig : function(copies) {
    var string = $jscomp.checkStringArgs(this, null, "repeat");
    if (0 > copies || 1342177279 < copies) {
      throw new RangeError("Invalid count value");
    }
    copies |= 0;
    for (var result = ""; copies;) {
      if (copies & 1 && (result += string), copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
}, "es6", "es3");
$jscomp.polyfill("Reflect", function(orig) {
  return orig ? orig : {};
}, "es6", "es3");
$jscomp.polyfill("Object.getOwnPropertySymbols", function(orig) {
  return orig ? orig : function() {
    return [];
  };
}, "es6", "es5");
$jscomp.polyfill("Reflect.ownKeys", function(orig) {
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  if (orig) {
    return orig;
  }
  var symbolPrefix = "jscomp_symbol_";
  return function(target) {
    for (var keys = [], names = Object.getOwnPropertyNames(target), symbols = Object.getOwnPropertySymbols(target), i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
}, "es6", "es5");
$jscomp.polyfill("Promise", function(NativePromise) {
  function platformSupportsPromiseRejectionEvents() {
    return "undefined" !== typeof $jscomp.global.PromiseRejectionEvent;
  }
  function globalPromiseIsNative() {
    return $jscomp.global.Promise && -1 !== $jscomp.global.Promise.toString().indexOf("[native code]");
  }
  function shouldForcePolyfillPromise() {
    return ($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && !platformSupportsPromiseRejectionEvents()) && globalPromiseIsNative();
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  function isObject(value) {
    switch(typeof value) {
      case "object":
        return null != value;
      case "function":
        return !0;
      default:
        return !1;
    }
  }
  function resolvingPromise(opt_value) {
    return opt_value instanceof PolyfillPromise ? opt_value : new PolyfillPromise(function(resolve, reject) {
      resolve(opt_value);
    });
  }
  if (NativePromise && !shouldForcePolyfillPromise()) {
    return NativePromise;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (null == this.batch_) {
      this.batch_ = [];
      var self = this;
      this.asyncExecuteFunction(function() {
        self.executeBatch_();
      });
    }
    this.batch_.push(f);
  };
  var nativeSetTimeout = $jscomp.global.setTimeout;
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    for (; this.batch_ && this.batch_.length;) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        executingBatch[i] = null;
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2}, PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = void 0;
    this.onSettledCallbacks_ = [];
    this.isRejectionHandled_ = !1;
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    function firstCallWins(method) {
      return function(x) {
        alreadyCalled || (alreadyCalled = !0, method.call(thisPromise, x));
      };
    }
    var thisPromise = this, alreadyCalled = !1;
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    value === this ? this.reject_(new TypeError("A Promise cannot resolve to itself")) : value instanceof PolyfillPromise ? this.settleSameAsPromise_(value) : isObject(value) ? this.resolveToNonPromiseObj_(value) : this.fulfill_(value);
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = void 0;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    "function" == typeof thenMethod ? this.settleSameAsThenable_(thenMethod, obj) : this.fulfill_(obj);
  };
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw Error("Cannot settle(" + settledState + ", " + valueOrReason + "): Promise already settled in state" + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.state_ === PromiseState.REJECTED && this.scheduleUnhandledRejectionCheck_();
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.scheduleUnhandledRejectionCheck_ = function() {
    var self = this;
    nativeSetTimeout(function() {
      if (self.notifyUnhandledRejection_()) {
        var nativeConsole = $jscomp.global.console;
        "undefined" !== typeof nativeConsole && nativeConsole.error(self.result_);
      }
    }, 1);
  };
  PolyfillPromise.prototype.notifyUnhandledRejection_ = function() {
    if (this.isRejectionHandled_) {
      return !1;
    }
    var NativeCustomEvent = $jscomp.global.CustomEvent, NativeEvent = $jscomp.global.Event, nativeDispatchEvent = $jscomp.global.dispatchEvent;
    if ("undefined" === typeof nativeDispatchEvent) {
      return !0;
    }
    if ("function" === typeof NativeCustomEvent) {
      var event = new NativeCustomEvent("unhandledrejection", {cancelable:!0});
    } else {
      "function" === typeof NativeEvent ? event = new NativeEvent("unhandledrejection", {cancelable:!0}) : (event = $jscomp.global.document.createEvent("CustomEvent"), event.initCustomEvent("unhandledrejection", !1, !0, event));
    }
    event.promise = this;
    event.reason = this.result_;
    return nativeDispatchEvent(event);
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (null != this.onSettledCallbacks_) {
      for (var i = 0; i < this.onSettledCallbacks_.length; ++i) {
        asyncExecutor.asyncExecute(this.onSettledCallbacks_[i]);
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    function createCallback(paramF, defaultF) {
      return "function" == typeof paramF ? function(x) {
        try {
          resolveChild(paramF(x));
        } catch (error) {
          rejectChild(error);
        }
      } : defaultF;
    }
    var resolveChild, rejectChild, childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype.catch = function(onRejected) {
    return this.then(void 0, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw Error("Unexpected state: " + thisPromise.state_);
      }
    }
    var thisPromise = this;
    null == this.onSettledCallbacks_ ? asyncExecutor.asyncExecute(callback) : this.onSettledCallbacks_.push(callback);
    this.isRejectionHandled_ = !0;
  };
  PolyfillPromise.resolve = resolvingPromise;
  PolyfillPromise.reject = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise.race = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      for (var iterator = $jscomp.makeIterator(thenablesOrValues), iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        resolvingPromise(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise.all = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues), iterRec = iterator.next();
    return iterRec.done ? resolvingPromise([]) : new PolyfillPromise(function(resolveAll, rejectAll) {
      function onFulfilled(i) {
        return function(ithResult) {
          resultsArray[i] = ithResult;
          unresolvedCount--;
          0 == unresolvedCount && resolveAll(resultsArray);
        };
      }
      var resultsArray = [], unresolvedCount = 0;
      do {
        resultsArray.push(void 0), unresolvedCount++, resolvingPromise(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll), iterRec = iterator.next();
      } while (!iterRec.done);
    });
  };
  return PolyfillPromise;
}, "es6", "es3");
$jscomp.polyfill("String.prototype.startsWith", function(orig) {
  return orig ? orig : function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, "startsWith");
    searchString += "";
    for (var strLen = string.length, searchLen = searchString.length, i = Math.max(0, Math.min(opt_position | 0, string.length)), j = 0; j < searchLen && i < strLen;) {
      if (string[i++] != searchString[j++]) {
        return !1;
      }
    }
    return j >= searchLen;
  };
}, "es6", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(orig) {
  return orig ? orig : function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, "endsWith");
    searchString += "";
    void 0 === opt_position && (opt_position = string.length);
    for (var i = Math.max(0, Math.min(opt_position | 0, string.length)), j = searchString.length; 0 < j && 0 < i;) {
      if (string[--i] != searchString[--j]) {
        return !1;
      }
    }
    return 0 >= j;
  };
}, "es6", "es3");
$jscomp.stringPadding = function(padString, padLength) {
  var padding = void 0 !== padString ? String(padString) : " ";
  return 0 < padLength && padding ? padding.repeat(Math.ceil(padLength / padding.length)).substring(0, padLength) : "";
};
$jscomp.polyfill("String.prototype.padStart", function(orig) {
  return orig ? orig : function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, "padStart");
    return $jscomp.stringPadding(opt_padString, targetLength - string.length) + string;
  };
}, "es8", "es3");
$jscomp.polyfill("Object.is", function(orig) {
  return orig ? orig : function(left, right) {
    return left === right ? 0 !== left || 1 / left === 1 / right : left !== left && right !== right;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.includes", function(orig) {
  return orig ? orig : function(searchElement, opt_fromIndex) {
    var array = this;
    array instanceof String && (array = String(array));
    var len = array.length, i = opt_fromIndex || 0;
    for (0 > i && (i = Math.max(i + len, 0)); i < len; i++) {
      var element = array[i];
      if (element === searchElement || Object.is(element, searchElement)) {
        return !0;
      }
    }
    return !1;
  };
}, "es7", "es3");
$jscomp.polyfill("String.prototype.includes", function(orig) {
  return orig ? orig : function(searchString, opt_position) {
    return -1 !== $jscomp.checkStringArgs(this, searchString, "includes").indexOf(searchString, opt_position || 0);
  };
}, "es6", "es3");
$jscomp.iteratorFromArray = function(array, transform) {
  array instanceof String && (array += "");
  var i = 0, done = !1, iter = {next:function() {
    if (!done && i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:!1};
    }
    done = !0;
    return {done:!0, value:void 0};
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill("Array.prototype.keys", function(orig) {
  return orig ? orig : function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
}, "es6", "es3");
$jscomp.polyfill("String.prototype.codePointAt", function(orig) {
  return orig ? orig : function(position) {
    var string = $jscomp.checkStringArgs(this, null, "codePointAt"), size = string.length;
    position = Number(position) || 0;
    if (0 <= position && position < size) {
      position |= 0;
      var first = string.charCodeAt(position);
      if (55296 > first || 56319 < first || position + 1 === size) {
        return first;
      }
      var second = string.charCodeAt(position + 1);
      return 56320 > second || 57343 < second ? first : 1024 * (first - 55296) + second + 9216;
    }
  };
}, "es6", "es3");
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill("Object.entries", function(orig) {
  return orig ? orig : function(obj) {
    var result = [], key;
    for (key in obj) {
      $jscomp.owns(obj, key) && result.push([key, obj[key]]);
    }
    return result;
  };
}, "es8", "es3");
$jscomp.polyfill("Number.isFinite", function(orig) {
  return orig ? orig : function(x) {
    return "number" !== typeof x ? !1 : !isNaN(x) && Infinity !== x && -Infinity !== x;
  };
}, "es6", "es3");
$jscomp.polyfill("Number.isInteger", function(orig) {
  return orig ? orig : function(x) {
    return Number.isFinite(x) ? x === Math.floor(x) : !1;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.fill", function(orig) {
  return orig ? orig : function(value, opt_start, opt_end) {
    var length = this.length || 0;
    0 > opt_start && (opt_start = Math.max(0, length + opt_start));
    if (null == opt_end || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    0 > opt_end && (opt_end = Math.max(0, length + opt_end));
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
}, "es6", "es3");
$jscomp.typedArrayFill = function(orig) {
  return orig ? orig : Array.prototype.fill;
};
$jscomp.polyfill("Int8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint8ClampedArray.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Int16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Int32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Float32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Float64Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(target, var_args) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    if (source) {
      for (var key in source) {
        $jscomp.owns(source, key) && (target[key] = source[key]);
      }
    }
  }
  return target;
};
$jscomp.polyfill("Object.assign", function(orig) {
  return orig || $jscomp.assign;
}, "es6", "es3");
if ("undefined" != typeof lib) {
  throw Error('Global "lib" object already exists.');
}
var lib = {runtimeDependencies_:{}, initCallbacks_:[], rtdep:function(var_args) {
  try {
    throw Error();
  } catch (ex) {
    var stackArray = ex.stack.split("\n");
    var source = 3 <= stackArray.length ? stackArray[2].replace(/^\s*at\s+/, "") : stackArray[1].replace(/^\s*global code@/, "");
  }
  for (var i = 0; i < arguments.length; i++) {
    var path = arguments[i];
    if (path instanceof Array) {
      lib.rtdep.apply(lib, path);
    } else {
      var ary = this.runtimeDependencies_[path];
      ary || (ary = this.runtimeDependencies_[path] = []);
      ary.push(source);
    }
  }
}, ensureRuntimeDependencies_:function() {
  var passed = !0, path;
  for (path in lib.runtimeDependencies_) {
    for (var sourceList = lib.runtimeDependencies_[path], names = path.split("."), obj = window || self, i = 0; i < names.length; i++) {
      if (!(names[i] in obj)) {
        console.warn('Missing "' + path + '" is needed by', sourceList);
        passed = !1;
        break;
      }
      obj = obj[names[i]];
    }
  }
  if (!passed) {
    throw Error("Failed runtime dependency check");
  }
}, registerInit:function(name, callback) {
  lib.initCallbacks_.push([name, callback]);
  return callback;
}, init:function(onInit, opt_logFunction) {
  var ary = lib.initCallbacks_, initNext = function() {
    if (ary.length) {
      var rec = ary.shift();
      opt_logFunction && opt_logFunction("init: " + rec[0]);
      rec[1](lib.f.alarm(initNext));
    } else {
      onInit();
    }
  };
  if ("function" != typeof onInit) {
    throw Error("Missing or invalid argument: onInit");
  }
  lib.ensureRuntimeDependencies_();
  setTimeout(initNext, 0);
}};
String.prototype.padStart || (String.prototype.padStart = function(targetLength, padString) {
  targetLength -= this.length;
  if (0 >= targetLength) {
    return String(this);
  }
  void 0 === padString && (padString = " ");
  targetLength > padString.length && (padString = padString.repeat(targetLength / padString.length + 1));
  return padString.slice(0, targetLength) + String(this);
});
String.prototype.padEnd || (String.prototype.padEnd = function(targetLength, padString) {
  targetLength -= this.length;
  if (0 >= targetLength) {
    return String(this);
  }
  void 0 === padString && (padString = " ");
  targetLength > padString.length && (padString = padString.repeat(targetLength / padString.length + 1));
  return String(this) + padString.slice(0, targetLength);
});
if (!Object.values || !Object.entries) {
  var reduce = Function.bind.call(Function.call, Array.prototype.reduce), isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable), concat = Function.bind.call(Function.call, Array.prototype.concat);
  Object.values || (Object.values = function values(O) {
    return reduce(Reflect.ownKeys(O), function(v, k) {
      return concat(v, "string" === typeof k && isEnumerable(O, k) ? [O[k]] : []);
    }, []);
  });
  Object.entries || (Object.entries = function entries(O) {
    return reduce(Reflect.ownKeys(O), function(e, k) {
      return concat(e, "string" === typeof k && isEnumerable(O, k) ? [[k, O[k]]] : []);
    }, []);
  });
}
if ("function" !== typeof Promise.prototype.finally) {
  var speciesConstructor = function(O, defaultConstructor) {
    if (!O || "object" !== typeof O && "function" !== typeof O) {
      throw new TypeError("Assertion failed: Type(O) is not Object");
    }
    var C = O.constructor;
    if ("undefined" === typeof C) {
      return defaultConstructor;
    }
    if (!C || "object" !== typeof C && "function" !== typeof C) {
      throw new TypeError("O.constructor is not an Object");
    }
    var S = "function" === typeof Symbol && "symbol" === typeof Symbol.species ? C[Symbol.species] : void 0;
    if (null == S) {
      return defaultConstructor;
    }
    if ("function" === typeof S && S.prototype) {
      return S;
    }
    throw new TypeError("no constructor found");
  };
  Object.defineProperty(Promise.prototype, "finally", {configurable:!0, writable:!0, value:function(onFinally) {
    if ("object" !== typeof this || null === this) {
      throw new TypeError('"this" value is not an Object');
    }
    var C = speciesConstructor(this, Promise);
    return "function" !== typeof onFinally ? Promise.prototype.then.call(this, onFinally, onFinally) : Promise.prototype.then.call(this, function(x) {
      return (new C(function(resolve) {
        return resolve(onFinally());
      })).then(function() {
        return x;
      });
    }, function(e) {
      return (new C(function(resolve) {
        return resolve(onFinally());
      })).then(function() {
        throw e;
      });
    });
  }, });
}
lib.array = {};
lib.array.arrayBigEndianToUint32 = function(array) {
  return (array[0] << 24 | array[1] << 16 | array[2] << 8 | array[3] << 0) >>> 0;
};
lib.array.uint32ToArrayBigEndian = function(uint32) {
  return [uint32 >>> 24 & 255, uint32 >>> 16 & 255, uint32 >>> 8 & 255, uint32 >>> 0 & 255, ];
};
lib.array.concatTyped = function(arrays) {
  for (var $jscomp$restParams = [], $jscomp$restIndex = 0; $jscomp$restIndex < arguments.length; ++$jscomp$restIndex) {
    $jscomp$restParams[$jscomp$restIndex - 0] = arguments[$jscomp$restIndex];
  }
  for (var resultLength = 0, $jscomp$iter$0 = $jscomp.makeIterator($jscomp$restParams), $jscomp$key$array = $jscomp$iter$0.next(); !$jscomp$key$array.done; $jscomp$key$array = $jscomp$iter$0.next()) {
    resultLength += $jscomp$key$array.value.length;
  }
  var result = new $jscomp$restParams[0].constructor(resultLength), pos = 0, $jscomp$iter$1 = $jscomp.makeIterator($jscomp$restParams);
  for ($jscomp$key$array = $jscomp$iter$1.next(); !$jscomp$key$array.done; $jscomp$key$array = $jscomp$iter$1.next()) {
    var array$4 = $jscomp$key$array.value;
    result.set(array$4, pos);
    pos += array$4.length;
  }
  return result;
};
lib.array.compare = function(a, b) {
  if (null === a || null === b) {
    return null === a && null === b;
  }
  if (a.length !== b.length) {
    return !1;
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return !1;
    }
  }
  return !0;
};
lib.colors = {};
lib.colors.re_ = {hex16:/#([a-f0-9])([a-f0-9])([a-f0-9])/i, hex24:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i, rgb:new RegExp("^/s*rgb/s*/(/s*(/d{1,3})/s*,/s*(/d{1,3})/s*,/s*(/d{1,3})/s*/)/s*$".replace(/\//g, "\\"), "i"), rgba:new RegExp("^/s*rgba/s*/(/s*(/d{1,3})/s*,/s*(/d{1,3})/s*,/s*(/d{1,3})/s*(?:,/s*(/d+(?:/./d+)?)/s*)/)/s*$".replace(/\//g, "\\"), "i"), rgbx:new RegExp("^/s*rgba?/s*/(/s*(/d{1,3})/s*,/s*(/d{1,3})/s*,/s*(/d{1,3})/s*(?:,/s*(/d+(?:/./d+)?)/s*)?/)/s*$".replace(/\//g, "\\"), "i"), 
x11rgb:/^\s*rgb:([a-f0-9]{1,4})\/([a-f0-9]{1,4})\/([a-f0-9]{1,4})\s*$/i, name:/[a-z][a-z0-9\s]+/, };
lib.colors.rgbToX11 = function(value) {
  function scale(v) {
    v = (257 * Math.min(v, 255)).toString(16);
    return lib.f.zpad(v, 4);
  }
  var ary = value.match(lib.colors.re_.rgbx);
  return ary ? "rgb:" + scale(ary[1]) + "/" + scale(ary[2]) + "/" + scale(ary[3]) : null;
};
lib.colors.x11HexToCSS = function(v$jscomp$0) {
  if (!v$jscomp$0.startsWith("#")) {
    return null;
  }
  v$jscomp$0 = v$jscomp$0.substr(1);
  if (-1 == [3, 6, 9, 12].indexOf(v$jscomp$0.length) || v$jscomp$0.match(/[^a-f0-9]/i)) {
    return null;
  }
  var size = v$jscomp$0.length / 3, r = v$jscomp$0.substr(0, size), g = v$jscomp$0.substr(size, size), b = v$jscomp$0.substr(size + size, size);
  return lib.colors.arrayToRGBA([r, g, b].map(function norm16(v) {
    v = parseInt(v, 16);
    return 2 == size ? v : 1 == size ? v << 4 : v >> 4 * (size - 2);
  }));
};
lib.colors.x11ToCSS = function(v$jscomp$0) {
  var ary = v$jscomp$0.match(lib.colors.re_.x11rgb);
  if (!ary) {
    return v$jscomp$0.startsWith("#") ? lib.colors.x11HexToCSS(v$jscomp$0) : lib.colors.nameToRGB(v$jscomp$0);
  }
  ary.splice(0, 1);
  return lib.colors.arrayToRGBA(ary.map(function scale(v) {
    if (1 == v.length) {
      return parseInt(v + v, 16);
    }
    if (2 == v.length) {
      return parseInt(v, 16);
    }
    3 == v.length && (v += v.substr(2));
    return Math.round(parseInt(v, 16) / 257);
  }));
};
lib.colors.hexToRGB = function(arg) {
  function convert(hex) {
    4 == hex.length && (hex = hex.replace(hex16, function(h, r, g, b) {
      return "#" + r + r + g + g + b + b;
    }));
    var ary = hex.match(hex24);
    return ary ? "rgb(" + parseInt(ary[1], 16) + ", " + parseInt(ary[2], 16) + ", " + parseInt(ary[3], 16) + ")" : null;
  }
  var hex16 = lib.colors.re_.hex16, hex24 = lib.colors.re_.hex24;
  if (arg instanceof Array) {
    for (var i = 0; i < arg.length; i++) {
      arg[i] = convert(arg[i]);
    }
  } else {
    arg = convert(arg);
  }
  return arg;
};
lib.colors.rgbToHex = function(arg) {
  function convert(rgb) {
    var ary = lib.colors.crackRGB(rgb);
    return ary ? "#" + lib.f.zpad((parseInt(ary[0]) << 16 | parseInt(ary[1]) << 8 | parseInt(ary[2]) << 0).toString(16), 6) : null;
  }
  if (arg instanceof Array) {
    for (var i = 0; i < arg.length; i++) {
      arg[i] = convert(arg[i]);
    }
  } else {
    arg = convert(arg);
  }
  return arg;
};
lib.colors.normalizeCSS = function(def) {
  return def.startsWith("#") ? lib.colors.hexToRGB(def) : lib.colors.re_.rgbx.test(def) ? def : lib.colors.nameToRGB(def);
};
lib.colors.arrayToRGBA = function(ary) {
  return "rgba(" + ary[0] + ", " + ary[1] + ", " + ary[2] + ", " + (3 < ary.length ? ary[3] : 1) + ")";
};
lib.colors.setAlpha = function(rgb, alpha) {
  var ary = lib.colors.crackRGB(rgb);
  ary[3] = alpha;
  return lib.colors.arrayToRGBA(ary);
};
lib.colors.mix = function(base, tint, percent) {
  for (var ary1 = lib.colors.crackRGB(base), ary2 = lib.colors.crackRGB(tint), i = 0; 4 > i; ++i) {
    var diff = ary2[i] - ary1[i];
    ary1[i] = Math.round(parseInt(ary1[i]) + diff * percent);
  }
  return lib.colors.arrayToRGBA(ary1);
};
lib.colors.crackRGB = function(color) {
  if (color.startsWith("rgba")) {
    var ary = color.match(lib.colors.re_.rgba);
    if (ary) {
      return ary.shift(), ary;
    }
  } else {
    if (ary = color.match(lib.colors.re_.rgb)) {
      return ary.shift(), ary.push("1"), ary;
    }
  }
  console.error("Couldn't crack: " + color);
  return null;
};
lib.colors.nameToRGB = function(name) {
  if (name in lib.colors.colorNames) {
    return lib.colors.colorNames[name];
  }
  name = name.toLowerCase();
  if (name in lib.colors.colorNames) {
    return lib.colors.colorNames[name];
  }
  name = name.replace(/\s+/g, "");
  return name in lib.colors.colorNames ? lib.colors.colorNames[name] : null;
};
lib.colors.stockColorPalette = lib.colors.hexToRGB("#000000 #CC0000 #4E9A06 #C4A000 #3465A4 #75507B #06989A #D3D7CF #555753 #EF2929 #00BA13 #FCE94F #729FCF #F200CB #00B5BD #EEEEEC #000000 #00005F #000087 #0000AF #0000D7 #0000FF #005F00 #005F5F #005F87 #005FAF #005FD7 #005FFF #008700 #00875F #008787 #0087AF #0087D7 #0087FF #00AF00 #00AF5F #00AF87 #00AFAF #00AFD7 #00AFFF #00D700 #00D75F #00D787 #00D7AF #00D7D7 #00D7FF #00FF00 #00FF5F #00FF87 #00FFAF #00FFD7 #00FFFF #5F0000 #5F005F #5F0087 #5F00AF #5F00D7 #5F00FF #5F5F00 #5F5F5F #5F5F87 #5F5FAF #5F5FD7 #5F5FFF #5F8700 #5F875F #5F8787 #5F87AF #5F87D7 #5F87FF #5FAF00 #5FAF5F #5FAF87 #5FAFAF #5FAFD7 #5FAFFF #5FD700 #5FD75F #5FD787 #5FD7AF #5FD7D7 #5FD7FF #5FFF00 #5FFF5F #5FFF87 #5FFFAF #5FFFD7 #5FFFFF #870000 #87005F #870087 #8700AF #8700D7 #8700FF #875F00 #875F5F #875F87 #875FAF #875FD7 #875FFF #878700 #87875F #878787 #8787AF #8787D7 #8787FF #87AF00 #87AF5F #87AF87 #87AFAF #87AFD7 #87AFFF #87D700 #87D75F #87D787 #87D7AF #87D7D7 #87D7FF #87FF00 #87FF5F #87FF87 #87FFAF #87FFD7 #87FFFF #AF0000 #AF005F #AF0087 #AF00AF #AF00D7 #AF00FF #AF5F00 #AF5F5F #AF5F87 #AF5FAF #AF5FD7 #AF5FFF #AF8700 #AF875F #AF8787 #AF87AF #AF87D7 #AF87FF #AFAF00 #AFAF5F #AFAF87 #AFAFAF #AFAFD7 #AFAFFF #AFD700 #AFD75F #AFD787 #AFD7AF #AFD7D7 #AFD7FF #AFFF00 #AFFF5F #AFFF87 #AFFFAF #AFFFD7 #AFFFFF #D70000 #D7005F #D70087 #D700AF #D700D7 #D700FF #D75F00 #D75F5F #D75F87 #D75FAF #D75FD7 #D75FFF #D78700 #D7875F #D78787 #D787AF #D787D7 #D787FF #D7AF00 #D7AF5F #D7AF87 #D7AFAF #D7AFD7 #D7AFFF #D7D700 #D7D75F #D7D787 #D7D7AF #D7D7D7 #D7D7FF #D7FF00 #D7FF5F #D7FF87 #D7FFAF #D7FFD7 #D7FFFF #FF0000 #FF005F #FF0087 #FF00AF #FF00D7 #FF00FF #FF5F00 #FF5F5F #FF5F87 #FF5FAF #FF5FD7 #FF5FFF #FF8700 #FF875F #FF8787 #FF87AF #FF87D7 #FF87FF #FFAF00 #FFAF5F #FFAF87 #FFAFAF #FFAFD7 #FFAFFF #FFD700 #FFD75F #FFD787 #FFD7AF #FFD7D7 #FFD7FF #FFFF00 #FFFF5F #FFFF87 #FFFFAF #FFFFD7 #FFFFFF #080808 #121212 #1C1C1C #262626 #303030 #3A3A3A #444444 #4E4E4E #585858 #626262 #6C6C6C #767676 #808080 #8A8A8A #949494 #9E9E9E #A8A8A8 #B2B2B2 #BCBCBC #C6C6C6 #D0D0D0 #DADADA #E4E4E4 #EEEEEE".split(" "));
lib.colors.colorPalette = lib.colors.stockColorPalette;
lib.colors.colorNames = {aliceblue:"rgb(240, 248, 255)", antiquewhite:"rgb(250, 235, 215)", antiquewhite1:"rgb(255, 239, 219)", antiquewhite2:"rgb(238, 223, 204)", antiquewhite3:"rgb(205, 192, 176)", antiquewhite4:"rgb(139, 131, 120)", aquamarine:"rgb(127, 255, 212)", aquamarine1:"rgb(127, 255, 212)", aquamarine2:"rgb(118, 238, 198)", aquamarine3:"rgb(102, 205, 170)", aquamarine4:"rgb(69, 139, 116)", azure:"rgb(240, 255, 255)", azure1:"rgb(240, 255, 255)", azure2:"rgb(224, 238, 238)", azure3:"rgb(193, 205, 205)", 
azure4:"rgb(131, 139, 139)", beige:"rgb(245, 245, 220)", bisque:"rgb(255, 228, 196)", bisque1:"rgb(255, 228, 196)", bisque2:"rgb(238, 213, 183)", bisque3:"rgb(205, 183, 158)", bisque4:"rgb(139, 125, 107)", black:"rgb(0, 0, 0)", blanchedalmond:"rgb(255, 235, 205)", blue:"rgb(0, 0, 255)", blue1:"rgb(0, 0, 255)", blue2:"rgb(0, 0, 238)", blue3:"rgb(0, 0, 205)", blue4:"rgb(0, 0, 139)", blueviolet:"rgb(138, 43, 226)", brown:"rgb(165, 42, 42)", brown1:"rgb(255, 64, 64)", brown2:"rgb(238, 59, 59)", brown3:"rgb(205, 51, 51)", 
brown4:"rgb(139, 35, 35)", burlywood:"rgb(222, 184, 135)", burlywood1:"rgb(255, 211, 155)", burlywood2:"rgb(238, 197, 145)", burlywood3:"rgb(205, 170, 125)", burlywood4:"rgb(139, 115, 85)", cadetblue:"rgb(95, 158, 160)", cadetblue1:"rgb(152, 245, 255)", cadetblue2:"rgb(142, 229, 238)", cadetblue3:"rgb(122, 197, 205)", cadetblue4:"rgb(83, 134, 139)", chartreuse:"rgb(127, 255, 0)", chartreuse1:"rgb(127, 255, 0)", chartreuse2:"rgb(118, 238, 0)", chartreuse3:"rgb(102, 205, 0)", chartreuse4:"rgb(69, 139, 0)", 
chocolate:"rgb(210, 105, 30)", chocolate1:"rgb(255, 127, 36)", chocolate2:"rgb(238, 118, 33)", chocolate3:"rgb(205, 102, 29)", chocolate4:"rgb(139, 69, 19)", coral:"rgb(255, 127, 80)", coral1:"rgb(255, 114, 86)", coral2:"rgb(238, 106, 80)", coral3:"rgb(205, 91, 69)", coral4:"rgb(139, 62, 47)", cornflowerblue:"rgb(100, 149, 237)", cornsilk:"rgb(255, 248, 220)", cornsilk1:"rgb(255, 248, 220)", cornsilk2:"rgb(238, 232, 205)", cornsilk3:"rgb(205, 200, 177)", cornsilk4:"rgb(139, 136, 120)", cyan:"rgb(0, 255, 255)", 
cyan1:"rgb(0, 255, 255)", cyan2:"rgb(0, 238, 238)", cyan3:"rgb(0, 205, 205)", cyan4:"rgb(0, 139, 139)", darkblue:"rgb(0, 0, 139)", darkcyan:"rgb(0, 139, 139)", darkgoldenrod:"rgb(184, 134, 11)", darkgoldenrod1:"rgb(255, 185, 15)", darkgoldenrod2:"rgb(238, 173, 14)", darkgoldenrod3:"rgb(205, 149, 12)", darkgoldenrod4:"rgb(139, 101, 8)", darkgray:"rgb(169, 169, 169)", darkgreen:"rgb(0, 100, 0)", darkgrey:"rgb(169, 169, 169)", darkkhaki:"rgb(189, 183, 107)", darkmagenta:"rgb(139, 0, 139)", darkolivegreen:"rgb(85, 107, 47)", 
darkolivegreen1:"rgb(202, 255, 112)", darkolivegreen2:"rgb(188, 238, 104)", darkolivegreen3:"rgb(162, 205, 90)", darkolivegreen4:"rgb(110, 139, 61)", darkorange:"rgb(255, 140, 0)", darkorange1:"rgb(255, 127, 0)", darkorange2:"rgb(238, 118, 0)", darkorange3:"rgb(205, 102, 0)", darkorange4:"rgb(139, 69, 0)", darkorchid:"rgb(153, 50, 204)", darkorchid1:"rgb(191, 62, 255)", darkorchid2:"rgb(178, 58, 238)", darkorchid3:"rgb(154, 50, 205)", darkorchid4:"rgb(104, 34, 139)", darkred:"rgb(139, 0, 0)", darksalmon:"rgb(233, 150, 122)", 
darkseagreen:"rgb(143, 188, 143)", darkseagreen1:"rgb(193, 255, 193)", darkseagreen2:"rgb(180, 238, 180)", darkseagreen3:"rgb(155, 205, 155)", darkseagreen4:"rgb(105, 139, 105)", darkslateblue:"rgb(72, 61, 139)", darkslategray:"rgb(47, 79, 79)", darkslategray1:"rgb(151, 255, 255)", darkslategray2:"rgb(141, 238, 238)", darkslategray3:"rgb(121, 205, 205)", darkslategray4:"rgb(82, 139, 139)", darkslategrey:"rgb(47, 79, 79)", darkturquoise:"rgb(0, 206, 209)", darkviolet:"rgb(148, 0, 211)", debianred:"rgb(215, 7, 81)", 
deeppink:"rgb(255, 20, 147)", deeppink1:"rgb(255, 20, 147)", deeppink2:"rgb(238, 18, 137)", deeppink3:"rgb(205, 16, 118)", deeppink4:"rgb(139, 10, 80)", deepskyblue:"rgb(0, 191, 255)", deepskyblue1:"rgb(0, 191, 255)", deepskyblue2:"rgb(0, 178, 238)", deepskyblue3:"rgb(0, 154, 205)", deepskyblue4:"rgb(0, 104, 139)", dimgray:"rgb(105, 105, 105)", dimgrey:"rgb(105, 105, 105)", dodgerblue:"rgb(30, 144, 255)", dodgerblue1:"rgb(30, 144, 255)", dodgerblue2:"rgb(28, 134, 238)", dodgerblue3:"rgb(24, 116, 205)", 
dodgerblue4:"rgb(16, 78, 139)", firebrick:"rgb(178, 34, 34)", firebrick1:"rgb(255, 48, 48)", firebrick2:"rgb(238, 44, 44)", firebrick3:"rgb(205, 38, 38)", firebrick4:"rgb(139, 26, 26)", floralwhite:"rgb(255, 250, 240)", forestgreen:"rgb(34, 139, 34)", gainsboro:"rgb(220, 220, 220)", ghostwhite:"rgb(248, 248, 255)", gold:"rgb(255, 215, 0)", gold1:"rgb(255, 215, 0)", gold2:"rgb(238, 201, 0)", gold3:"rgb(205, 173, 0)", gold4:"rgb(139, 117, 0)", goldenrod:"rgb(218, 165, 32)", goldenrod1:"rgb(255, 193, 37)", 
goldenrod2:"rgb(238, 180, 34)", goldenrod3:"rgb(205, 155, 29)", goldenrod4:"rgb(139, 105, 20)", gray:"rgb(190, 190, 190)", gray0:"rgb(0, 0, 0)", gray1:"rgb(3, 3, 3)", gray10:"rgb(26, 26, 26)", gray100:"rgb(255, 255, 255)", gray11:"rgb(28, 28, 28)", gray12:"rgb(31, 31, 31)", gray13:"rgb(33, 33, 33)", gray14:"rgb(36, 36, 36)", gray15:"rgb(38, 38, 38)", gray16:"rgb(41, 41, 41)", gray17:"rgb(43, 43, 43)", gray18:"rgb(46, 46, 46)", gray19:"rgb(48, 48, 48)", gray2:"rgb(5, 5, 5)", gray20:"rgb(51, 51, 51)", 
gray21:"rgb(54, 54, 54)", gray22:"rgb(56, 56, 56)", gray23:"rgb(59, 59, 59)", gray24:"rgb(61, 61, 61)", gray25:"rgb(64, 64, 64)", gray26:"rgb(66, 66, 66)", gray27:"rgb(69, 69, 69)", gray28:"rgb(71, 71, 71)", gray29:"rgb(74, 74, 74)", gray3:"rgb(8, 8, 8)", gray30:"rgb(77, 77, 77)", gray31:"rgb(79, 79, 79)", gray32:"rgb(82, 82, 82)", gray33:"rgb(84, 84, 84)", gray34:"rgb(87, 87, 87)", gray35:"rgb(89, 89, 89)", gray36:"rgb(92, 92, 92)", gray37:"rgb(94, 94, 94)", gray38:"rgb(97, 97, 97)", gray39:"rgb(99, 99, 99)", 
gray4:"rgb(10, 10, 10)", gray40:"rgb(102, 102, 102)", gray41:"rgb(105, 105, 105)", gray42:"rgb(107, 107, 107)", gray43:"rgb(110, 110, 110)", gray44:"rgb(112, 112, 112)", gray45:"rgb(115, 115, 115)", gray46:"rgb(117, 117, 117)", gray47:"rgb(120, 120, 120)", gray48:"rgb(122, 122, 122)", gray49:"rgb(125, 125, 125)", gray5:"rgb(13, 13, 13)", gray50:"rgb(127, 127, 127)", gray51:"rgb(130, 130, 130)", gray52:"rgb(133, 133, 133)", gray53:"rgb(135, 135, 135)", gray54:"rgb(138, 138, 138)", gray55:"rgb(140, 140, 140)", 
gray56:"rgb(143, 143, 143)", gray57:"rgb(145, 145, 145)", gray58:"rgb(148, 148, 148)", gray59:"rgb(150, 150, 150)", gray6:"rgb(15, 15, 15)", gray60:"rgb(153, 153, 153)", gray61:"rgb(156, 156, 156)", gray62:"rgb(158, 158, 158)", gray63:"rgb(161, 161, 161)", gray64:"rgb(163, 163, 163)", gray65:"rgb(166, 166, 166)", gray66:"rgb(168, 168, 168)", gray67:"rgb(171, 171, 171)", gray68:"rgb(173, 173, 173)", gray69:"rgb(176, 176, 176)", gray7:"rgb(18, 18, 18)", gray70:"rgb(179, 179, 179)", gray71:"rgb(181, 181, 181)", 
gray72:"rgb(184, 184, 184)", gray73:"rgb(186, 186, 186)", gray74:"rgb(189, 189, 189)", gray75:"rgb(191, 191, 191)", gray76:"rgb(194, 194, 194)", gray77:"rgb(196, 196, 196)", gray78:"rgb(199, 199, 199)", gray79:"rgb(201, 201, 201)", gray8:"rgb(20, 20, 20)", gray80:"rgb(204, 204, 204)", gray81:"rgb(207, 207, 207)", gray82:"rgb(209, 209, 209)", gray83:"rgb(212, 212, 212)", gray84:"rgb(214, 214, 214)", gray85:"rgb(217, 217, 217)", gray86:"rgb(219, 219, 219)", gray87:"rgb(222, 222, 222)", gray88:"rgb(224, 224, 224)", 
gray89:"rgb(227, 227, 227)", gray9:"rgb(23, 23, 23)", gray90:"rgb(229, 229, 229)", gray91:"rgb(232, 232, 232)", gray92:"rgb(235, 235, 235)", gray93:"rgb(237, 237, 237)", gray94:"rgb(240, 240, 240)", gray95:"rgb(242, 242, 242)", gray96:"rgb(245, 245, 245)", gray97:"rgb(247, 247, 247)", gray98:"rgb(250, 250, 250)", gray99:"rgb(252, 252, 252)", green:"rgb(0, 255, 0)", green1:"rgb(0, 255, 0)", green2:"rgb(0, 238, 0)", green3:"rgb(0, 205, 0)", green4:"rgb(0, 139, 0)", greenyellow:"rgb(173, 255, 47)", 
grey:"rgb(190, 190, 190)", grey0:"rgb(0, 0, 0)", grey1:"rgb(3, 3, 3)", grey10:"rgb(26, 26, 26)", grey100:"rgb(255, 255, 255)", grey11:"rgb(28, 28, 28)", grey12:"rgb(31, 31, 31)", grey13:"rgb(33, 33, 33)", grey14:"rgb(36, 36, 36)", grey15:"rgb(38, 38, 38)", grey16:"rgb(41, 41, 41)", grey17:"rgb(43, 43, 43)", grey18:"rgb(46, 46, 46)", grey19:"rgb(48, 48, 48)", grey2:"rgb(5, 5, 5)", grey20:"rgb(51, 51, 51)", grey21:"rgb(54, 54, 54)", grey22:"rgb(56, 56, 56)", grey23:"rgb(59, 59, 59)", grey24:"rgb(61, 61, 61)", 
grey25:"rgb(64, 64, 64)", grey26:"rgb(66, 66, 66)", grey27:"rgb(69, 69, 69)", grey28:"rgb(71, 71, 71)", grey29:"rgb(74, 74, 74)", grey3:"rgb(8, 8, 8)", grey30:"rgb(77, 77, 77)", grey31:"rgb(79, 79, 79)", grey32:"rgb(82, 82, 82)", grey33:"rgb(84, 84, 84)", grey34:"rgb(87, 87, 87)", grey35:"rgb(89, 89, 89)", grey36:"rgb(92, 92, 92)", grey37:"rgb(94, 94, 94)", grey38:"rgb(97, 97, 97)", grey39:"rgb(99, 99, 99)", grey4:"rgb(10, 10, 10)", grey40:"rgb(102, 102, 102)", grey41:"rgb(105, 105, 105)", grey42:"rgb(107, 107, 107)", 
grey43:"rgb(110, 110, 110)", grey44:"rgb(112, 112, 112)", grey45:"rgb(115, 115, 115)", grey46:"rgb(117, 117, 117)", grey47:"rgb(120, 120, 120)", grey48:"rgb(122, 122, 122)", grey49:"rgb(125, 125, 125)", grey5:"rgb(13, 13, 13)", grey50:"rgb(127, 127, 127)", grey51:"rgb(130, 130, 130)", grey52:"rgb(133, 133, 133)", grey53:"rgb(135, 135, 135)", grey54:"rgb(138, 138, 138)", grey55:"rgb(140, 140, 140)", grey56:"rgb(143, 143, 143)", grey57:"rgb(145, 145, 145)", grey58:"rgb(148, 148, 148)", grey59:"rgb(150, 150, 150)", 
grey6:"rgb(15, 15, 15)", grey60:"rgb(153, 153, 153)", grey61:"rgb(156, 156, 156)", grey62:"rgb(158, 158, 158)", grey63:"rgb(161, 161, 161)", grey64:"rgb(163, 163, 163)", grey65:"rgb(166, 166, 166)", grey66:"rgb(168, 168, 168)", grey67:"rgb(171, 171, 171)", grey68:"rgb(173, 173, 173)", grey69:"rgb(176, 176, 176)", grey7:"rgb(18, 18, 18)", grey70:"rgb(179, 179, 179)", grey71:"rgb(181, 181, 181)", grey72:"rgb(184, 184, 184)", grey73:"rgb(186, 186, 186)", grey74:"rgb(189, 189, 189)", grey75:"rgb(191, 191, 191)", 
grey76:"rgb(194, 194, 194)", grey77:"rgb(196, 196, 196)", grey78:"rgb(199, 199, 199)", grey79:"rgb(201, 201, 201)", grey8:"rgb(20, 20, 20)", grey80:"rgb(204, 204, 204)", grey81:"rgb(207, 207, 207)", grey82:"rgb(209, 209, 209)", grey83:"rgb(212, 212, 212)", grey84:"rgb(214, 214, 214)", grey85:"rgb(217, 217, 217)", grey86:"rgb(219, 219, 219)", grey87:"rgb(222, 222, 222)", grey88:"rgb(224, 224, 224)", grey89:"rgb(227, 227, 227)", grey9:"rgb(23, 23, 23)", grey90:"rgb(229, 229, 229)", grey91:"rgb(232, 232, 232)", 
grey92:"rgb(235, 235, 235)", grey93:"rgb(237, 237, 237)", grey94:"rgb(240, 240, 240)", grey95:"rgb(242, 242, 242)", grey96:"rgb(245, 245, 245)", grey97:"rgb(247, 247, 247)", grey98:"rgb(250, 250, 250)", grey99:"rgb(252, 252, 252)", honeydew:"rgb(240, 255, 240)", honeydew1:"rgb(240, 255, 240)", honeydew2:"rgb(224, 238, 224)", honeydew3:"rgb(193, 205, 193)", honeydew4:"rgb(131, 139, 131)", hotpink:"rgb(255, 105, 180)", hotpink1:"rgb(255, 110, 180)", hotpink2:"rgb(238, 106, 167)", hotpink3:"rgb(205, 96, 144)", 
hotpink4:"rgb(139, 58, 98)", indianred:"rgb(205, 92, 92)", indianred1:"rgb(255, 106, 106)", indianred2:"rgb(238, 99, 99)", indianred3:"rgb(205, 85, 85)", indianred4:"rgb(139, 58, 58)", ivory:"rgb(255, 255, 240)", ivory1:"rgb(255, 255, 240)", ivory2:"rgb(238, 238, 224)", ivory3:"rgb(205, 205, 193)", ivory4:"rgb(139, 139, 131)", khaki:"rgb(240, 230, 140)", khaki1:"rgb(255, 246, 143)", khaki2:"rgb(238, 230, 133)", khaki3:"rgb(205, 198, 115)", khaki4:"rgb(139, 134, 78)", lavender:"rgb(230, 230, 250)", 
lavenderblush:"rgb(255, 240, 245)", lavenderblush1:"rgb(255, 240, 245)", lavenderblush2:"rgb(238, 224, 229)", lavenderblush3:"rgb(205, 193, 197)", lavenderblush4:"rgb(139, 131, 134)", lawngreen:"rgb(124, 252, 0)", lemonchiffon:"rgb(255, 250, 205)", lemonchiffon1:"rgb(255, 250, 205)", lemonchiffon2:"rgb(238, 233, 191)", lemonchiffon3:"rgb(205, 201, 165)", lemonchiffon4:"rgb(139, 137, 112)", lightblue:"rgb(173, 216, 230)", lightblue1:"rgb(191, 239, 255)", lightblue2:"rgb(178, 223, 238)", lightblue3:"rgb(154, 192, 205)", 
lightblue4:"rgb(104, 131, 139)", lightcoral:"rgb(240, 128, 128)", lightcyan:"rgb(224, 255, 255)", lightcyan1:"rgb(224, 255, 255)", lightcyan2:"rgb(209, 238, 238)", lightcyan3:"rgb(180, 205, 205)", lightcyan4:"rgb(122, 139, 139)", lightgoldenrod:"rgb(238, 221, 130)", lightgoldenrod1:"rgb(255, 236, 139)", lightgoldenrod2:"rgb(238, 220, 130)", lightgoldenrod3:"rgb(205, 190, 112)", lightgoldenrod4:"rgb(139, 129, 76)", lightgoldenrodyellow:"rgb(250, 250, 210)", lightgray:"rgb(211, 211, 211)", lightgreen:"rgb(144, 238, 144)", 
lightgrey:"rgb(211, 211, 211)", lightpink:"rgb(255, 182, 193)", lightpink1:"rgb(255, 174, 185)", lightpink2:"rgb(238, 162, 173)", lightpink3:"rgb(205, 140, 149)", lightpink4:"rgb(139, 95, 101)", lightsalmon:"rgb(255, 160, 122)", lightsalmon1:"rgb(255, 160, 122)", lightsalmon2:"rgb(238, 149, 114)", lightsalmon3:"rgb(205, 129, 98)", lightsalmon4:"rgb(139, 87, 66)", lightseagreen:"rgb(32, 178, 170)", lightskyblue:"rgb(135, 206, 250)", lightskyblue1:"rgb(176, 226, 255)", lightskyblue2:"rgb(164, 211, 238)", 
lightskyblue3:"rgb(141, 182, 205)", lightskyblue4:"rgb(96, 123, 139)", lightslateblue:"rgb(132, 112, 255)", lightslategray:"rgb(119, 136, 153)", lightslategrey:"rgb(119, 136, 153)", lightsteelblue:"rgb(176, 196, 222)", lightsteelblue1:"rgb(202, 225, 255)", lightsteelblue2:"rgb(188, 210, 238)", lightsteelblue3:"rgb(162, 181, 205)", lightsteelblue4:"rgb(110, 123, 139)", lightyellow:"rgb(255, 255, 224)", lightyellow1:"rgb(255, 255, 224)", lightyellow2:"rgb(238, 238, 209)", lightyellow3:"rgb(205, 205, 180)", 
lightyellow4:"rgb(139, 139, 122)", limegreen:"rgb(50, 205, 50)", linen:"rgb(250, 240, 230)", magenta:"rgb(255, 0, 255)", magenta1:"rgb(255, 0, 255)", magenta2:"rgb(238, 0, 238)", magenta3:"rgb(205, 0, 205)", magenta4:"rgb(139, 0, 139)", maroon:"rgb(176, 48, 96)", maroon1:"rgb(255, 52, 179)", maroon2:"rgb(238, 48, 167)", maroon3:"rgb(205, 41, 144)", maroon4:"rgb(139, 28, 98)", mediumaquamarine:"rgb(102, 205, 170)", mediumblue:"rgb(0, 0, 205)", mediumorchid:"rgb(186, 85, 211)", mediumorchid1:"rgb(224, 102, 255)", 
mediumorchid2:"rgb(209, 95, 238)", mediumorchid3:"rgb(180, 82, 205)", mediumorchid4:"rgb(122, 55, 139)", mediumpurple:"rgb(147, 112, 219)", mediumpurple1:"rgb(171, 130, 255)", mediumpurple2:"rgb(159, 121, 238)", mediumpurple3:"rgb(137, 104, 205)", mediumpurple4:"rgb(93, 71, 139)", mediumseagreen:"rgb(60, 179, 113)", mediumslateblue:"rgb(123, 104, 238)", mediumspringgreen:"rgb(0, 250, 154)", mediumturquoise:"rgb(72, 209, 204)", mediumvioletred:"rgb(199, 21, 133)", midnightblue:"rgb(25, 25, 112)", 
mintcream:"rgb(245, 255, 250)", mistyrose:"rgb(255, 228, 225)", mistyrose1:"rgb(255, 228, 225)", mistyrose2:"rgb(238, 213, 210)", mistyrose3:"rgb(205, 183, 181)", mistyrose4:"rgb(139, 125, 123)", moccasin:"rgb(255, 228, 181)", navajowhite:"rgb(255, 222, 173)", navajowhite1:"rgb(255, 222, 173)", navajowhite2:"rgb(238, 207, 161)", navajowhite3:"rgb(205, 179, 139)", navajowhite4:"rgb(139, 121, 94)", navy:"rgb(0, 0, 128)", navyblue:"rgb(0, 0, 128)", oldlace:"rgb(253, 245, 230)", olivedrab:"rgb(107, 142, 35)", 
olivedrab1:"rgb(192, 255, 62)", olivedrab2:"rgb(179, 238, 58)", olivedrab3:"rgb(154, 205, 50)", olivedrab4:"rgb(105, 139, 34)", orange:"rgb(255, 165, 0)", orange1:"rgb(255, 165, 0)", orange2:"rgb(238, 154, 0)", orange3:"rgb(205, 133, 0)", orange4:"rgb(139, 90, 0)", orangered:"rgb(255, 69, 0)", orangered1:"rgb(255, 69, 0)", orangered2:"rgb(238, 64, 0)", orangered3:"rgb(205, 55, 0)", orangered4:"rgb(139, 37, 0)", orchid:"rgb(218, 112, 214)", orchid1:"rgb(255, 131, 250)", orchid2:"rgb(238, 122, 233)", 
orchid3:"rgb(205, 105, 201)", orchid4:"rgb(139, 71, 137)", palegoldenrod:"rgb(238, 232, 170)", palegreen:"rgb(152, 251, 152)", palegreen1:"rgb(154, 255, 154)", palegreen2:"rgb(144, 238, 144)", palegreen3:"rgb(124, 205, 124)", palegreen4:"rgb(84, 139, 84)", paleturquoise:"rgb(175, 238, 238)", paleturquoise1:"rgb(187, 255, 255)", paleturquoise2:"rgb(174, 238, 238)", paleturquoise3:"rgb(150, 205, 205)", paleturquoise4:"rgb(102, 139, 139)", palevioletred:"rgb(219, 112, 147)", palevioletred1:"rgb(255, 130, 171)", 
palevioletred2:"rgb(238, 121, 159)", palevioletred3:"rgb(205, 104, 137)", palevioletred4:"rgb(139, 71, 93)", papayawhip:"rgb(255, 239, 213)", peachpuff:"rgb(255, 218, 185)", peachpuff1:"rgb(255, 218, 185)", peachpuff2:"rgb(238, 203, 173)", peachpuff3:"rgb(205, 175, 149)", peachpuff4:"rgb(139, 119, 101)", peru:"rgb(205, 133, 63)", pink:"rgb(255, 192, 203)", pink1:"rgb(255, 181, 197)", pink2:"rgb(238, 169, 184)", pink3:"rgb(205, 145, 158)", pink4:"rgb(139, 99, 108)", plum:"rgb(221, 160, 221)", plum1:"rgb(255, 187, 255)", 
plum2:"rgb(238, 174, 238)", plum3:"rgb(205, 150, 205)", plum4:"rgb(139, 102, 139)", powderblue:"rgb(176, 224, 230)", purple:"rgb(160, 32, 240)", purple1:"rgb(155, 48, 255)", purple2:"rgb(145, 44, 238)", purple3:"rgb(125, 38, 205)", purple4:"rgb(85, 26, 139)", red:"rgb(255, 0, 0)", red1:"rgb(255, 0, 0)", red2:"rgb(238, 0, 0)", red3:"rgb(205, 0, 0)", red4:"rgb(139, 0, 0)", rosybrown:"rgb(188, 143, 143)", rosybrown1:"rgb(255, 193, 193)", rosybrown2:"rgb(238, 180, 180)", rosybrown3:"rgb(205, 155, 155)", 
rosybrown4:"rgb(139, 105, 105)", royalblue:"rgb(65, 105, 225)", royalblue1:"rgb(72, 118, 255)", royalblue2:"rgb(67, 110, 238)", royalblue3:"rgb(58, 95, 205)", royalblue4:"rgb(39, 64, 139)", saddlebrown:"rgb(139, 69, 19)", salmon:"rgb(250, 128, 114)", salmon1:"rgb(255, 140, 105)", salmon2:"rgb(238, 130, 98)", salmon3:"rgb(205, 112, 84)", salmon4:"rgb(139, 76, 57)", sandybrown:"rgb(244, 164, 96)", seagreen:"rgb(46, 139, 87)", seagreen1:"rgb(84, 255, 159)", seagreen2:"rgb(78, 238, 148)", seagreen3:"rgb(67, 205, 128)", 
seagreen4:"rgb(46, 139, 87)", seashell:"rgb(255, 245, 238)", seashell1:"rgb(255, 245, 238)", seashell2:"rgb(238, 229, 222)", seashell3:"rgb(205, 197, 191)", seashell4:"rgb(139, 134, 130)", sienna:"rgb(160, 82, 45)", sienna1:"rgb(255, 130, 71)", sienna2:"rgb(238, 121, 66)", sienna3:"rgb(205, 104, 57)", sienna4:"rgb(139, 71, 38)", skyblue:"rgb(135, 206, 235)", skyblue1:"rgb(135, 206, 255)", skyblue2:"rgb(126, 192, 238)", skyblue3:"rgb(108, 166, 205)", skyblue4:"rgb(74, 112, 139)", slateblue:"rgb(106, 90, 205)", 
slateblue1:"rgb(131, 111, 255)", slateblue2:"rgb(122, 103, 238)", slateblue3:"rgb(105, 89, 205)", slateblue4:"rgb(71, 60, 139)", slategray:"rgb(112, 128, 144)", slategray1:"rgb(198, 226, 255)", slategray2:"rgb(185, 211, 238)", slategray3:"rgb(159, 182, 205)", slategray4:"rgb(108, 123, 139)", slategrey:"rgb(112, 128, 144)", snow:"rgb(255, 250, 250)", snow1:"rgb(255, 250, 250)", snow2:"rgb(238, 233, 233)", snow3:"rgb(205, 201, 201)", snow4:"rgb(139, 137, 137)", springgreen:"rgb(0, 255, 127)", springgreen1:"rgb(0, 255, 127)", 
springgreen2:"rgb(0, 238, 118)", springgreen3:"rgb(0, 205, 102)", springgreen4:"rgb(0, 139, 69)", steelblue:"rgb(70, 130, 180)", steelblue1:"rgb(99, 184, 255)", steelblue2:"rgb(92, 172, 238)", steelblue3:"rgb(79, 148, 205)", steelblue4:"rgb(54, 100, 139)", tan:"rgb(210, 180, 140)", tan1:"rgb(255, 165, 79)", tan2:"rgb(238, 154, 73)", tan3:"rgb(205, 133, 63)", tan4:"rgb(139, 90, 43)", thistle:"rgb(216, 191, 216)", thistle1:"rgb(255, 225, 255)", thistle2:"rgb(238, 210, 238)", thistle3:"rgb(205, 181, 205)", 
thistle4:"rgb(139, 123, 139)", tomato:"rgb(255, 99, 71)", tomato1:"rgb(255, 99, 71)", tomato2:"rgb(238, 92, 66)", tomato3:"rgb(205, 79, 57)", tomato4:"rgb(139, 54, 38)", turquoise:"rgb(64, 224, 208)", turquoise1:"rgb(0, 245, 255)", turquoise2:"rgb(0, 229, 238)", turquoise3:"rgb(0, 197, 205)", turquoise4:"rgb(0, 134, 139)", violet:"rgb(238, 130, 238)", violetred:"rgb(208, 32, 144)", violetred1:"rgb(255, 62, 150)", violetred2:"rgb(238, 58, 140)", violetred3:"rgb(205, 50, 120)", violetred4:"rgb(139, 34, 82)", 
wheat:"rgb(245, 222, 179)", wheat1:"rgb(255, 231, 186)", wheat2:"rgb(238, 216, 174)", wheat3:"rgb(205, 186, 150)", wheat4:"rgb(139, 126, 102)", white:"rgb(255, 255, 255)", whitesmoke:"rgb(245, 245, 245)", yellow:"rgb(255, 255, 0)", yellow1:"rgb(255, 255, 0)", yellow2:"rgb(238, 238, 0)", yellow3:"rgb(205, 205, 0)", yellow4:"rgb(139, 139, 0)", yellowgreen:"rgb(154, 205, 50)"};
lib.f = {};
lib.f.createEnum = function(name) {
  return new String(name);
};
lib.f.replaceVars = function(str, vars) {
  return str.replace(/%([a-z]*)\(([^\)]+)\)/gi, function(match, fn, varname) {
    if ("undefined" == typeof vars[varname]) {
      throw "Unknown variable: " + varname;
    }
    var rv = vars[varname];
    if (fn in lib.f.replaceVars.functions) {
      rv = lib.f.replaceVars.functions[fn](rv);
    } else {
      if (fn) {
        throw "Unknown escape function: " + fn;
      }
    }
    return rv;
  });
};
lib.f.replaceVars.functions = {encodeURI:encodeURI, encodeURIComponent:encodeURIComponent, escapeHTML:function(str) {
  var map = {"<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;", "'":"&#39;"};
  return str.replace(/[<>&"']/g, function(m) {
    return map[m];
  });
}};
lib.f.parseQuery = function(queryString) {
  queryString.startsWith("?") && (queryString = queryString.substr(1));
  for (var rv = {}, pairs = queryString.split("&"), i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("="), key = decodeURIComponent(pair[0]), val = decodeURIComponent(pair[1]);
    key.endsWith("[]") ? (key = key.slice(0, -2), rv[key] instanceof Array || (rv[key] = []), rv[key].push(val)) : rv[key] = val;
  }
  return rv;
};
lib.f.getURL = function(path) {
  return lib.f.getURL.chromeSupported() ? chrome.runtime.getURL(path) : path;
};
lib.f.getURL.chromeSupported = function() {
  return window.chrome && chrome.runtime && chrome.runtime.getURL;
};
lib.f.clamp = function(v, min, max) {
  return v < min ? min : v > max ? max : v;
};
lib.f.zpad = function(number, length) {
  return String(number).padStart(length, "0");
};
lib.f.getWhitespace = function(length) {
  if (0 >= length) {
    return "";
  }
  var f = this.getWhitespace;
  f.whitespace || (f.whitespace = "          ");
  for (; length > f.whitespace.length;) {
    f.whitespace += f.whitespace;
  }
  return f.whitespace.substr(0, length);
};
lib.f.alarm = function(callback$jscomp$0, opt_ms) {
  var ms = opt_ms || 5E3, stack = lib.f.getStack(1);
  return function() {
    var timeout = setTimeout(function() {
      var name = "string" == typeof callback$jscomp$0 ? name : callback$jscomp$0.name;
      console.warn("lib.f.alarm: timeout expired: " + ms / 1000 + "s" + (name ? ": " + name : ""));
      console.log(stack);
      timeout = null;
    }, ms), wrapperGenerator = function(callback) {
      return function() {
        timeout && (clearTimeout(timeout), timeout = null);
        return callback.apply(null, arguments);
      };
    };
    return "string" == typeof callback$jscomp$0 ? wrapperGenerator : wrapperGenerator(callback$jscomp$0);
  }();
};
lib.f.getStack = function(ignoreFrames, count) {
  ignoreFrames = void 0 === ignoreFrames ? 0 : ignoreFrames;
  var stackArray = Error().stack.split("\n");
  ignoreFrames += 2;
  var max = stackArray.length - ignoreFrames;
  count = void 0 === count ? max : lib.f.clamp(count, 0, max);
  for (var stackObject = [], i = ignoreFrames; i < count + ignoreFrames; ++i) {
    stackObject.push(stackArray[i].replace(/^\s*at\s+/, ""));
  }
  return stackObject;
};
lib.f.smartFloorDivide = function(numerator, denominator) {
  var val = numerator / denominator, ceiling = Math.ceil(val);
  return .0001 > ceiling - val ? ceiling : Math.floor(val);
};
lib.f.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
lib.f.getOs = function() {
  if (window.browser && browser.runtime && browser.runtime.getPlatformInfo) {
    return browser.runtime.getPlatformInfo().then(function(info) {
      return info.os;
    });
  }
  if (window.chrome && chrome.runtime && chrome.runtime.getPlatformInfo) {
    return new Promise(function(resolve, reject) {
      return chrome.runtime.getPlatformInfo(function(info) {
        return resolve(info.os);
      });
    });
  }
  if (window.navigator && navigator.userAgent) {
    var ua = navigator.userAgent;
    if (ua.includes("Mac OS X")) {
      return Promise.resolve("mac");
    }
    if (ua.includes("CrOS")) {
      return Promise.resolve("cros");
    }
    if (ua.includes("Linux")) {
      return Promise.resolve("linux");
    }
    if (ua.includes("Android")) {
      return Promise.resolve("android");
    }
    if (ua.includes("Windows")) {
      return Promise.resolve("windows");
    }
  }
  return Promise.reject(null);
};
lib.f.getChromeMilestone = function() {
  if (window.navigator && navigator.userAgent) {
    var ary = navigator.userAgent.match(/\sChrome\/(\d+)/);
    if (ary) {
      return parseInt(ary[1]);
    }
  }
  return NaN;
};
lib.f.lastError = function(defaultMsg) {
  if (window.browser && browser.runtime) {
    var lastError = browser.runtime.lastError;
  } else {
    window.chrome && chrome.runtime && (lastError = chrome.runtime.lastError);
  }
  return lastError && lastError.message ? lastError.message : void 0 === defaultMsg ? null : defaultMsg;
};
lib.f.openWindow = function(url, name, features) {
  var win = window.open(void 0, name, features);
  null !== win && (win.opener = null, url && (win.location = url));
  return win;
};
lib.i18n = {};
lib.i18n.browser_ = window.browser && browser.i18n ? browser.i18n : window.chrome && chrome.i18n ? chrome.i18n : null;
lib.i18n.getAcceptLanguages = function(callback) {
  lib.i18n.browser_ ? lib.i18n.browser_.getAcceptLanguages(callback) : setTimeout(function() {
    callback([navigator.language.replace(/-/g, "_")]);
  }, 0);
};
lib.i18n.getMessage = function(msgname, substitutions, fallback) {
  substitutions = void 0 === substitutions ? [] : substitutions;
  fallback = void 0 === fallback ? "" : fallback;
  if (lib.i18n.browser_) {
    var message = lib.i18n.browser_.getMessage(msgname, substitutions);
    if (message) {
      return message;
    }
  }
  return lib.i18n.replaceReferences(fallback, substitutions);
};
lib.i18n.replaceReferences = function(msg, args) {
  args = void 0 === args ? [] : args;
  null === args && (args = []);
  args instanceof Array || (args = [args]);
  return msg.replace(/\$(\d+)/g, function(m, index) {
    return index <= args.length ? args[index - 1] : "";
  });
};
lib.MessageManager = function(languages) {
  this.languages_ = languages.map(function(el) {
    return el.replace(/-/g, "_");
  });
  -1 == this.languages_.indexOf("en") && this.languages_.unshift("en");
  this.messages = {};
};
lib.MessageManager.prototype.addMessages = function(defs) {
  for (var key in defs) {
    var def = defs[key];
    this.messages[key] = def.placeholders ? def.message.replace(/\$([a-z][^\s\$]+)\$/ig, function(m, name) {
      return defs[key].placeholders[name.toLowerCase()].content;
    }) : def.message;
  }
};
lib.MessageManager.prototype.findAndLoadMessages = function(pattern, onComplete) {
  function onLanguageComplete(state) {
    state ? loaded = languages.shift() : failed = languages.shift();
    languages.length ? tryNextLanguage() : onComplete(loaded, failed);
  }
  var languages = this.languages_.concat(), loaded = [], failed = [], tryNextLanguage = function() {
    this.loadMessages(this.replaceReferences(pattern, languages), onLanguageComplete.bind(this, !0), onLanguageComplete.bind(this, !1));
  }.bind(this);
  tryNextLanguage();
};
lib.MessageManager.prototype.loadMessages = function(url, onSuccess, opt_onError) {
  var $jscomp$this = this, xhr = new XMLHttpRequest;
  xhr.onload = function() {
    $jscomp$this.addMessages(JSON.parse(xhr.responseText));
    onSuccess();
  };
  opt_onError && (xhr.onerror = function() {
    return opt_onError(xhr);
  });
  xhr.open("GET", url);
  xhr.send();
};
lib.MessageManager.prototype.replaceReferences = lib.i18n.replaceReferences;
lib.MessageManager.prototype.get = function(msgname, opt_args, opt_default) {
  var message = lib.i18n.getMessage(msgname, opt_args);
  if (message) {
    return message;
  }
  message = this.messages[msgname];
  message || (console.warn("Unknown message: " + msgname), message = void 0 === opt_default ? msgname : opt_default, this.messages[msgname] = message);
  return this.replaceReferences(message, opt_args);
};
lib.MessageManager.prototype.processI18nAttributes = function(dom) {
  for (var nodes = dom.querySelectorAll("[i18n]"), i = 0; i < nodes.length; i++) {
    this.processI18nAttribute(nodes[i]);
  }
};
lib.MessageManager.prototype.processI18nAttribute = function(node) {
  var thunk = function(str) {
    return str.replace(/-/g, "_").toUpperCase();
  }, i18n = node.getAttribute("i18n");
  if (i18n) {
    try {
      i18n = JSON.parse(i18n);
    } catch (ex) {
      throw console.error("Can't parse " + node.tagName + "#" + node.id + ": " + i18n), ex;
    }
    for (var key in i18n) {
      var attr = key, msgname = i18n[key];
      msgname.startsWith("=") && (key = msgname.substr(1), msgname = i18n[key]);
      msgname.startsWith("$") && (msgname = thunk(node.getAttribute(msgname.substr(1)) + "_" + key));
      var msg = this.get(msgname);
      "_" == attr ? node.textContent = msg : node.setAttribute(attr, msg);
    }
  }
};
lib.PreferenceManager = function(storage, opt_prefix) {
  this.storage = storage;
  this.storageObserver_ = this.onStorageChange_.bind(this);
  this.isActive_ = !1;
  this.activate();
  this.trace = !1;
  var prefix = opt_prefix || "/";
  prefix.endsWith("/") || (prefix += "/");
  this.prefix = prefix;
  this.isImportingJson_ = !1;
  this.prefRecords_ = {};
  this.globalObservers_ = [];
  this.childFactories_ = {};
  this.childLists_ = {};
};
lib.PreferenceManager.prototype.DEFAULT_VALUE = lib.f.createEnum("DEFAULT");
lib.PreferenceManager.Record = function(name, defaultValue) {
  this.name = name;
  this.defaultValue = defaultValue;
  this.currentValue = this.DEFAULT_VALUE;
  this.observers = [];
};
lib.PreferenceManager.Record.prototype.DEFAULT_VALUE = lib.PreferenceManager.prototype.DEFAULT_VALUE;
lib.PreferenceManager.Record.prototype.addObserver = function(observer) {
  this.observers.push(observer);
};
lib.PreferenceManager.Record.prototype.removeObserver = function(observer) {
  var i = this.observers.indexOf(observer);
  0 <= i && this.observers.splice(i, 1);
};
lib.PreferenceManager.Record.prototype.get = function() {
  return this.currentValue === this.DEFAULT_VALUE ? /^(string|number)$/.test(typeof this.defaultValue) ? this.defaultValue : "object" == typeof this.defaultValue ? JSON.parse(JSON.stringify(this.defaultValue)) : this.defaultValue : this.currentValue;
};
lib.PreferenceManager.prototype.deactivate = function() {
  if (!this.isActive_) {
    throw Error("Not activated");
  }
  this.isActive_ = !1;
  this.storage.removeObserver(this.storageObserver_);
};
lib.PreferenceManager.prototype.activate = function() {
  if (this.isActive_) {
    throw Error("Already activated");
  }
  this.isActive_ = !0;
  this.storage.addObserver(this.storageObserver_);
};
lib.PreferenceManager.prototype.readStorage = function(opt_callback) {
  function onChildComplete() {
    0 == --pendingChildren && opt_callback && opt_callback();
  }
  var $jscomp$this = this, pendingChildren = 0, keys = Object.keys(this.prefRecords_).map(function(el) {
    return $jscomp$this.prefix + el;
  });
  this.trace && console.log("Preferences read: " + this.prefix);
  this.storage.getItems(keys, function(items) {
    var prefixLength = this.prefix.length, key;
    for (key in items) {
      var value = items[key], name = key.substr(prefixLength), needSync = name in this.childLists_ && JSON.stringify(value) != JSON.stringify(this.prefRecords_[name].currentValue);
      this.prefRecords_[name].currentValue = value;
      needSync && (pendingChildren++, this.syncChildList(name, onChildComplete));
    }
    0 == pendingChildren && opt_callback && setTimeout(opt_callback);
  }.bind(this));
};
lib.PreferenceManager.prototype.definePreference = function(name, value, opt_onChange) {
  var record = this.prefRecords_[name];
  record ? this.changeDefault(name, value) : record = this.prefRecords_[name] = new lib.PreferenceManager.Record(name, value);
  opt_onChange && record.addObserver(opt_onChange);
};
lib.PreferenceManager.prototype.definePreferences = function(defaults) {
  for (var i = 0; i < defaults.length; i++) {
    this.definePreference(defaults[i][0], defaults[i][1], defaults[i][2]);
  }
};
lib.PreferenceManager.prototype.defineChildren = function(listName, childFactory) {
  this.definePreference(listName, [], this.onChildListChange_.bind(this, listName));
  this.childFactories_[listName] = childFactory;
  this.childLists_[listName] = {};
};
lib.PreferenceManager.prototype.addObservers = function(global, map) {
  if (global && "function" != typeof global) {
    throw Error("Invalid param: globals");
  }
  global && this.globalObservers_.push(global);
  if (map) {
    for (var name in map) {
      if (!(name in this.prefRecords_)) {
        throw Error("Unknown preference: " + name);
      }
      this.prefRecords_[name].addObserver(map[name]);
    }
  }
};
lib.PreferenceManager.prototype.notifyAll = function() {
  for (var name in this.prefRecords_) {
    this.notifyChange_(name);
  }
};
lib.PreferenceManager.prototype.notifyChange_ = function(name) {
  var record = this.prefRecords_[name];
  if (!record) {
    throw Error("Unknown preference: " + name);
  }
  for (var currentValue = record.get(), i = 0; i < this.globalObservers_.length; i++) {
    this.globalObservers_[i](name, currentValue);
  }
  for (i = 0; i < record.observers.length; i++) {
    record.observers[i](currentValue, name, this);
  }
};
lib.PreferenceManager.prototype.createChild = function(listName, opt_hint, opt_id) {
  var ids = this.get(listName);
  if (opt_id) {
    var id = opt_id;
    if (-1 != ids.indexOf(id)) {
      throw Error("Duplicate child: " + listName + ": " + id);
    }
  } else {
    for (; !id || -1 != ids.indexOf(id);) {
      id = lib.f.randomInt(1, 65535).toString(16), id = lib.f.zpad(id, 4), opt_hint && (id = opt_hint + ":" + id);
    }
  }
  var childManager = this.childFactories_[listName](this, id);
  childManager.trace = this.trace;
  childManager.resetAll();
  this.childLists_[listName][id] = childManager;
  ids.push(id);
  this.set(listName, ids, void 0, !this.isImportingJson_);
  return childManager;
};
lib.PreferenceManager.prototype.removeChild = function(listName, id) {
  this.getChild(listName, id).resetAll();
  var ids = this.get(listName), i = ids.indexOf(id);
  -1 != i && (ids.splice(i, 1), this.set(listName, ids, void 0, !this.isImportingJson_));
  delete this.childLists_[listName][id];
};
lib.PreferenceManager.prototype.getChild = function(listName, id, opt_default) {
  if (!(listName in this.childLists_)) {
    throw Error("Unknown child list: " + listName);
  }
  var childList = this.childLists_[listName];
  if (!(id in childList)) {
    if ("undefined" == typeof opt_default) {
      throw Error('Unknown "' + listName + '" child: ' + id);
    }
    return opt_default;
  }
  return childList[id];
};
lib.PreferenceManager.diffChildLists = function(a, b) {
  for (var rv = {added:{}, removed:{}, common:{}, }, i = 0; i < a.length; i++) {
    -1 != b.indexOf(a[i]) ? rv.common[a[i]] = !0 : rv.added[a[i]] = !0;
  }
  for (i = 0; i < b.length; i++) {
    b[i] in rv.added || b[i] in rv.common || (rv.removed[b[i]] = !0);
  }
  return rv;
};
lib.PreferenceManager.prototype.syncChildList = function(listName, opt_callback) {
  function onChildStorage() {
    0 == --pendingChildren && opt_callback && opt_callback();
  }
  for (var pendingChildren = 0, currentIds = this.get(listName), oldIds = Object.keys(this.childLists_[listName]), rv = lib.PreferenceManager.diffChildLists(currentIds, oldIds), i = 0; i < currentIds.length; i++) {
    var id = currentIds[i], managerIndex = oldIds.indexOf(id);
    0 <= managerIndex && oldIds.splice(managerIndex, 1);
    if (!this.childLists_[listName][id]) {
      var childManager = this.childFactories_[listName](this, id);
      childManager ? (childManager.trace = this.trace, this.childLists_[listName][id] = childManager, pendingChildren++, childManager.readStorage(onChildStorage)) : console.warn("Unable to restore child: " + listName + ": " + id);
    }
  }
  for (i = 0; i < oldIds.length; i++) {
    delete this.childLists_[listName][oldIds[i]];
  }
  !pendingChildren && opt_callback && setTimeout(opt_callback);
};
lib.PreferenceManager.prototype.reset = function(name) {
  var record = this.prefRecords_[name];
  if (!record) {
    throw Error("Unknown preference: " + name);
  }
  this.storage.removeItem(this.prefix + name);
  record.currentValue !== this.DEFAULT_VALUE && (record.currentValue = this.DEFAULT_VALUE, this.notifyChange_(name));
};
lib.PreferenceManager.prototype.resetAll = function() {
  var changed = [], listName;
  for (listName in this.childLists_) {
    var childList = this.childLists_[listName], id;
    for (id in childList) {
      childList[id].resetAll();
    }
  }
  for (var name in this.prefRecords_) {
    this.prefRecords_[name].currentValue !== this.DEFAULT_VALUE && (this.prefRecords_[name].currentValue = this.DEFAULT_VALUE, changed.push(name));
  }
  var keys = Object.keys(this.prefRecords_).map(function(el) {
    return this.prefix + el;
  }.bind(this));
  this.storage.removeItems(keys);
  changed.forEach(this.notifyChange_.bind(this));
};
lib.PreferenceManager.prototype.diff = function(a, b) {
  return typeof a !== typeof b ? !0 : /^(undefined|boolean|number|string)$/.test(typeof a) ? a !== b : null === a && null === b ? !1 : !0;
};
lib.PreferenceManager.prototype.changeDefault = function(name, newValue) {
  var record = this.prefRecords_[name];
  if (!record) {
    throw Error("Unknown preference: " + name);
  }
  this.diff(record.defaultValue, newValue) && (record.currentValue !== this.DEFAULT_VALUE ? record.defaultValue = newValue : (record.defaultValue = newValue, this.notifyChange_(name)));
};
lib.PreferenceManager.prototype.changeDefaults = function(map) {
  for (var key in map) {
    this.changeDefault(key, map[key]);
  }
};
lib.PreferenceManager.prototype.set = function(name, newValue, onComplete, saveToStorage) {
  saveToStorage = void 0 === saveToStorage ? !0 : saveToStorage;
  var record = this.prefRecords_[name];
  if (!record) {
    throw Error("Unknown preference: " + name);
  }
  var oldValue = record.get();
  this.diff(oldValue, newValue) && (this.diff(record.defaultValue, newValue) ? (record.currentValue = newValue, saveToStorage && this.storage.setItem(this.prefix + name, newValue, onComplete)) : (record.currentValue = this.DEFAULT_VALUE, saveToStorage && this.storage.removeItem(this.prefix + name, onComplete)), setTimeout(this.notifyChange_.bind(this, name), 0));
};
lib.PreferenceManager.prototype.get = function(name) {
  var record = this.prefRecords_[name];
  if (!record) {
    throw Error("Unknown preference: " + name);
  }
  return record.get();
};
lib.PreferenceManager.prototype.exportAsJson = function() {
  var rv = {}, name;
  for (name in this.prefRecords_) {
    if (name in this.childLists_) {
      rv[name] = [];
      for (var childIds = this.get(name), i = 0; i < childIds.length; i++) {
        var id = childIds[i];
        rv[name].push({id:id, json:this.getChild(name, id).exportAsJson()});
      }
    } else {
      var record = this.prefRecords_[name];
      record.currentValue != this.DEFAULT_VALUE && (rv[name] = record.currentValue);
    }
  }
  return rv;
};
lib.PreferenceManager.prototype.importFromJson = function(json, opt_onComplete) {
  var $jscomp$this = this;
  this.isImportingJson_ = !0;
  var pendingWrites = 0, onWriteStorage = function() {
    if (1 > --pendingWrites) {
      opt_onComplete && opt_onComplete();
      for (var name$5 in json) {
        name$5 in $jscomp$this.childLists_ && $jscomp$this.set(name$5, $jscomp$this.get(name$5));
      }
      $jscomp$this.isImportingJson_ = !1;
    }
  }, name;
  for (name in json) {
    if (name in this.childLists_) {
      for (var childList = json[name], i = 0; i < childList.length; i++) {
        var id = childList[i].id, childPrefManager = this.childLists_[name][id];
        childPrefManager || (childPrefManager = this.createChild(name, null, id));
        childPrefManager.importFromJson(childList[i].json, onWriteStorage);
        pendingWrites++;
      }
    } else {
      this.set(name, json[name]);
    }
  }
  0 == pendingWrites && opt_onComplete && opt_onComplete();
};
lib.PreferenceManager.prototype.onChildListChange_ = function(listName) {
  this.syncChildList(listName);
};
lib.PreferenceManager.prototype.onStorageChange_ = function(map) {
  for (var key in map) {
    if (!this.prefix || 0 == key.lastIndexOf(this.prefix, 0)) {
      var name = key.substr(this.prefix.length);
      if (name in this.prefRecords_) {
        var record = this.prefRecords_[name], newValue = map[key].newValue, currentValue = record.currentValue;
        currentValue === record.DEFAULT_VALUE && (currentValue = void 0);
        this.diff(currentValue, newValue) && (record.currentValue = "undefined" == typeof newValue || null === newValue ? record.DEFAULT_VALUE : newValue, this.notifyChange_(name));
      }
    }
  }
};
lib.resource = {resources_:{}};
lib.resource.add = function(name, type, data) {
  lib.resource.resources_[name] = {type:type, name:name, data:data};
};
lib.resource.get = function(name, opt_defaultValue) {
  if (!(name in lib.resource.resources_)) {
    if ("undefined" == typeof opt_defaultValue) {
      throw "Unknown resource: " + name;
    }
    return opt_defaultValue;
  }
  return lib.resource.resources_[name];
};
lib.resource.getData = function(name, opt_defaultValue) {
  if (!(name in lib.resource.resources_)) {
    if ("undefined" == typeof opt_defaultValue) {
      throw "Unknown resource: " + name;
    }
    return opt_defaultValue;
  }
  return lib.resource.resources_[name].data;
};
lib.resource.getDataUrl = function(name, opt_defaultValue) {
  var resource = lib.resource.get(name, opt_defaultValue);
  return "data:" + resource.type + "," + resource.data;
};
lib.Storage = {};
lib.Storage.Chrome = function(storage) {
  this.storage_ = storage;
  this.observers_ = [];
  chrome.storage.onChanged.addListener(this.onChanged_.bind(this));
};
lib.Storage.Chrome.prototype.onChanged_ = function(changes, areaname) {
  if (chrome.storage[areaname] == this.storage_) {
    for (var i = 0; i < this.observers_.length; i++) {
      this.observers_[i](changes);
    }
  }
};
lib.Storage.Chrome.prototype.addObserver = function(callback) {
  this.observers_.push(callback);
};
lib.Storage.Chrome.prototype.removeObserver = function(callback) {
  var i = this.observers_.indexOf(callback);
  -1 != i && this.observers_.splice(i, 1);
};
lib.Storage.Chrome.prototype.clear = function(opt_callback) {
  this.storage_.clear();
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Chrome.prototype.getItem = function(key, callback) {
  this.storage_.get(key, callback);
};
lib.Storage.Chrome.prototype.getItems = function(keys, callback) {
  this.storage_.get(keys, callback);
};
lib.Storage.Chrome.prototype.setItem = function(key, value, opt_callback) {
  var $jscomp$this = this, onComplete = function() {
    var err = lib.f.lastError();
    if (err) {
      if (err.indexOf("MAX_WRITE_OPERATIONS")) {
        console.warn("Will retry save of " + key + " after exceeding quota: " + err);
        setTimeout(function() {
          return $jscomp$this.setItem(key, value, onComplete);
        }, 1000);
        return;
      }
      console.error("Unknown runtime error: " + err);
    }
    opt_callback && opt_callback();
  }, obj = {};
  obj[key] = value;
  this.storage_.set(obj, onComplete);
};
lib.Storage.Chrome.prototype.setItems = function(obj, opt_callback) {
  this.storage_.set(obj, opt_callback);
};
lib.Storage.Chrome.prototype.removeItem = function(key, opt_callback) {
  this.storage_.remove(key, opt_callback);
};
lib.Storage.Chrome.prototype.removeItems = function(keys, opt_callback) {
  this.storage_.remove(keys, opt_callback);
};
lib.Storage.Local = function() {
  this.observers_ = [];
  this.storage_ = window.localStorage;
  window.addEventListener("storage", this.onStorage_.bind(this));
};
lib.Storage.Local.prototype.onStorage_ = function(e) {
  if (e.storageArea == this.storage_) {
    var prevValue = e.oldValue ? JSON.parse(e.oldValue) : e.oldValue, curValue = e.newValue ? JSON.parse(e.newValue) : e.newValue, o = {};
    o[e.key] = {oldValue:prevValue, newValue:curValue};
    for (var i = 0; i < this.observers_.length; i++) {
      this.observers_[i](o);
    }
  }
};
lib.Storage.Local.prototype.addObserver = function(callback) {
  this.observers_.push(callback);
};
lib.Storage.Local.prototype.removeObserver = function(callback) {
  var i = this.observers_.indexOf(callback);
  -1 != i && this.observers_.splice(i, 1);
};
lib.Storage.Local.prototype.clear = function(opt_callback) {
  this.storage_.clear();
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Local.prototype.getItem = function(key, callback) {
  var value = this.storage_.getItem(key);
  if ("string" == typeof value) {
    try {
      value = JSON.parse(value);
    } catch (e) {
    }
  }
  setTimeout(callback.bind(null, value), 0);
};
lib.Storage.Local.prototype.getItems = function(keys, callback) {
  for (var rv = {}, i = keys.length - 1; 0 <= i; i--) {
    var key = keys[i], value = this.storage_.getItem(key);
    if ("string" == typeof value) {
      try {
        rv[key] = JSON.parse(value);
      } catch (e) {
        rv[key] = value;
      }
    } else {
      keys.splice(i, 1);
    }
  }
  setTimeout(callback.bind(null, rv), 0);
};
lib.Storage.Local.prototype.setItem = function(key, value, opt_callback) {
  this.storage_.setItem(key, JSON.stringify(value));
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Local.prototype.setItems = function(obj, opt_callback) {
  for (var key in obj) {
    this.storage_.setItem(key, JSON.stringify(obj[key]));
  }
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Local.prototype.removeItem = function(key, opt_callback) {
  this.storage_.removeItem(key);
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Local.prototype.removeItems = function(ary, opt_callback) {
  for (var i = 0; i < ary.length; i++) {
    this.storage_.removeItem(ary[i]);
  }
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Memory = function() {
  this.observers_ = [];
  this.storage_ = {};
};
lib.Storage.Memory.prototype.addObserver = function(callback) {
  this.observers_.push(callback);
};
lib.Storage.Memory.prototype.removeObserver = function(callback) {
  var i = this.observers_.indexOf(callback);
  -1 != i && this.observers_.splice(i, 1);
};
lib.Storage.Memory.prototype.clear = function(opt_callback) {
  var e = {}, key;
  for (key in this.storage_) {
    e[key] = {oldValue:this.storage_[key], newValue:void 0};
  }
  this.storage_ = {};
  setTimeout(function() {
    for (var i = 0; i < this.observers_.length; i++) {
      this.observers_[i](e);
    }
  }.bind(this), 0);
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Memory.prototype.getItem = function(key, callback) {
  var value = this.storage_[key];
  if ("string" == typeof value) {
    try {
      value = JSON.parse(value);
    } catch (e) {
    }
  }
  setTimeout(callback.bind(null, value), 0);
};
lib.Storage.Memory.prototype.getItems = function(keys, callback) {
  for (var rv = {}, i = keys.length - 1; 0 <= i; i--) {
    var key = keys[i], value = this.storage_[key];
    if ("string" == typeof value) {
      try {
        rv[key] = JSON.parse(value);
      } catch (e) {
        rv[key] = value;
      }
    } else {
      keys.splice(i, 1);
    }
  }
  setTimeout(callback.bind(null, rv), 0);
};
lib.Storage.Memory.prototype.setItem = function(key, value, opt_callback) {
  var oldValue = this.storage_[key];
  this.storage_[key] = JSON.stringify(value);
  var e = {};
  e[key] = {oldValue:oldValue, newValue:value};
  setTimeout(function() {
    for (var i = 0; i < this.observers_.length; i++) {
      this.observers_[i](e);
    }
  }.bind(this), 0);
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Memory.prototype.setItems = function(obj, opt_callback) {
  var e = {}, key;
  for (key in obj) {
    e[key] = {oldValue:this.storage_[key], newValue:obj[key]}, this.storage_[key] = JSON.stringify(obj[key]);
  }
  setTimeout(function() {
    for (var i = 0; i < this.observers_.length; i++) {
      this.observers_[i](e);
    }
  }.bind(this));
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Memory.prototype.removeItem = function(key, opt_callback) {
  delete this.storage_[key];
  opt_callback && setTimeout(opt_callback, 0);
};
lib.Storage.Memory.prototype.removeItems = function(ary, opt_callback) {
  for (var i = 0; i < ary.length; i++) {
    delete this.storage_[ary[i]];
  }
  opt_callback && setTimeout(opt_callback, 0);
};
lib.UTF8Decoder = function() {
  this.lowerBound = this.codePoint = this.bytesLeft = 0;
};
lib.UTF8Decoder.prototype.decode = function(str) {
  for (var ret = "", i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (0 == this.bytesLeft) {
      127 >= c ? ret += str.charAt(i) : 192 <= c && 223 >= c ? (this.codePoint = c - 192, this.bytesLeft = 1, this.lowerBound = 128) : 224 <= c && 239 >= c ? (this.codePoint = c - 224, this.bytesLeft = 2, this.lowerBound = 2048) : 240 <= c && 247 >= c ? (this.codePoint = c - 240, this.bytesLeft = 3, this.lowerBound = 65536) : 248 <= c && 251 >= c ? (this.codePoint = c - 248, this.bytesLeft = 4, this.lowerBound = 2097152) : 252 <= c && 253 >= c ? (this.codePoint = c - 252, this.bytesLeft = 5, this.lowerBound = 
      67108864) : ret += "\ufffd";
    } else {
      if (128 <= c && 191 >= c) {
        if (this.bytesLeft--, this.codePoint = (this.codePoint << 6) + (c - 128), 0 == this.bytesLeft) {
          var codePoint = this.codePoint;
          codePoint < this.lowerBound || 55296 <= codePoint && 57343 >= codePoint || 1114111 < codePoint ? ret += "\ufffd" : 65536 > codePoint ? ret += String.fromCharCode(codePoint) : (codePoint -= 65536, ret += String.fromCharCode(55296 + (codePoint >>> 10 & 1023), 56320 + (codePoint & 1023)));
        }
      } else {
        ret += "\ufffd", this.bytesLeft = 0, i--;
      }
    }
  }
  return ret;
};
lib.decodeUTF8 = function(utf8) {
  return (new lib.UTF8Decoder).decode(utf8);
};
lib.encodeUTF8 = function(str) {
  for (var ret = "", i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (56320 <= c && 57343 >= c) {
      c = 65533;
    } else {
      if (55296 <= c && 56319 >= c) {
        if (i + 1 < str.length) {
          var d = str.charCodeAt(i + 1);
          56320 <= d && 57343 >= d ? (c = 65536 + ((c & 1023) << 10) + (d & 1023), i++) : c = 65533;
        } else {
          c = 65533;
        }
      }
    }
    if (127 >= c) {
      ret += str.charAt(i);
    } else {
      if (2047 >= c) {
        ret += String.fromCharCode(192 | c >>> 6);
        var bytesLeft = 1;
      } else {
        65535 >= c ? (ret += String.fromCharCode(224 | c >>> 12), bytesLeft = 2) : (ret += String.fromCharCode(240 | c >>> 18), bytesLeft = 3);
      }
      for (; 0 < bytesLeft;) {
        bytesLeft--, ret += String.fromCharCode(128 | c >>> 6 * bytesLeft & 63);
      }
    }
  }
  return ret;
};
lib.wc = {};
lib.wc.nulWidth = 0;
lib.wc.controlWidth = 0;
lib.wc.regardCjkAmbiguous = !1;
lib.wc.cjkAmbiguousWidth = 2;
lib.wc.combining = [[173, 173], [768, 879], [1155, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1552, 1562], [1564, 1564], [1611, 1631], [1648, 1648], [1750, 1756], [1759, 1764], [1767, 1768], [1770, 1773], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2045, 2045], [2070, 2073], [2075, 2083], [2085, 2087], [2089, 2093], [2137, 2139], [2259, 2273], [2275, 2306], [2362, 2362], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2391], [2402, 2403], [2433, 2433], 
[2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2558, 2558], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2641, 2641], [2672, 2673], [2677, 2677], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2810, 2815], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2884], [2893, 2893], [2902, 2902], [2914, 2915], [2946, 2946], [3008, 3008], [3021, 3021], [3072, 3072], [3076, 3076], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], 
[3170, 3171], [3201, 3201], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3328, 3329], [3387, 3388], [3393, 3396], [3405, 3405], [3426, 3427], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3981, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4151], [4153, 4154], [4157, 4158], 
[4184, 4185], [4190, 4192], [4209, 4212], [4226, 4226], [4229, 4230], [4237, 4237], [4253, 4253], [4448, 4607], [4957, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6158], [6277, 6278], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6683, 6683], [6742, 6742], [6744, 6750], [6752, 6752], [6754, 6754], [6757, 6764], [6771, 6780], [6783, 6783], [6832, 6846], [6912, 6915], 
[6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7040, 7041], [7074, 7077], [7080, 7081], [7083, 7085], [7142, 7142], [7144, 7145], [7149, 7149], [7151, 7153], [7212, 7219], [7222, 7223], [7376, 7378], [7380, 7392], [7394, 7400], [7405, 7405], [7412, 7412], [7416, 7417], [7616, 7673], [7675, 7679], [8203, 8207], [8234, 8238], [8288, 8292], [8294, 8303], [8400, 8432], [11503, 11505], [11647, 11647], [11744, 11775], [12330, 12333], [12441, 12442], [42607, 42610], [42612, 42621], 
[42654, 42655], [42736, 42737], [43010, 43010], [43014, 43014], [43019, 43019], [43045, 43046], [43204, 43205], [43232, 43249], [43263, 43263], [43302, 43309], [43335, 43345], [43392, 43394], [43443, 43443], [43446, 43449], [43452, 43452], [43493, 43493], [43561, 43566], [43569, 43570], [43573, 43574], [43587, 43587], [43596, 43596], [43644, 43644], [43696, 43696], [43698, 43700], [43703, 43704], [43710, 43711], [43713, 43713], [43756, 43757], [43766, 43766], [44005, 44005], [44008, 44008], [44013, 
44013], [64286, 64286], [65024, 65039], [65056, 65071], [65279, 65279], [65529, 65531], [66045, 66045], [66272, 66272], [66422, 66426], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [68325, 68326], [68900, 68903], [69446, 69456], [69633, 69633], [69688, 69702], [69759, 69761], [69811, 69814], [69817, 69818], [69888, 69890], [69927, 69931], [69933, 69940], [70003, 70003], [70016, 70017], [70070, 70078], [70089, 70092], [70191, 70193], [70196, 70196], [70198, 70199], 
[70206, 70206], [70367, 70367], [70371, 70378], [70400, 70401], [70459, 70460], [70464, 70464], [70502, 70508], [70512, 70516], [70712, 70719], [70722, 70724], [70726, 70726], [70750, 70750], [70835, 70840], [70842, 70842], [70847, 70848], [70850, 70851], [71090, 71093], [71100, 71101], [71103, 71104], [71132, 71133], [71219, 71226], [71229, 71229], [71231, 71232], [71339, 71339], [71341, 71341], [71344, 71349], [71351, 71351], [71453, 71455], [71458, 71461], [71463, 71467], [71727, 71735], [71737, 
71738], [72193, 72202], [72243, 72248], [72251, 72254], [72263, 72263], [72273, 72278], [72281, 72283], [72330, 72342], [72344, 72345], [72752, 72758], [72760, 72765], [72767, 72767], [72850, 72871], [72874, 72880], [72882, 72883], [72885, 72886], [73009, 73014], [73018, 73018], [73020, 73021], [73023, 73029], [73031, 73031], [73104, 73105], [73109, 73109], [73111, 73111], [73459, 73460], [92912, 92916], [92976, 92982], [94095, 94098], [113821, 113822], [113824, 113827], [119143, 119145], [119155, 
119170], [119173, 119179], [119210, 119213], [119362, 119364], [121344, 121398], [121403, 121452], [121461, 121461], [121476, 121476], [121499, 121503], [121505, 121519], [122880, 122886], [122888, 122904], [122907, 122913], [122915, 122916], [122918, 122922], [125136, 125142], [125252, 125258], [917505, 917505], [917536, 917631], [917760, 917999], ];
lib.wc.ambiguous = [[161, 161], [164, 164], [167, 168], [170, 170], [173, 174], [176, 180], [182, 186], [188, 191], [198, 198], [208, 208], [215, 216], [222, 225], [230, 230], [232, 234], [236, 237], [240, 240], [242, 243], [247, 250], [252, 252], [254, 254], [257, 257], [273, 273], [275, 275], [283, 283], [294, 295], [299, 299], [305, 307], [312, 312], [319, 322], [324, 324], [328, 331], [333, 333], [338, 339], [358, 359], [363, 363], [462, 462], [464, 464], [466, 466], [468, 468], [470, 470], [472, 
472], [474, 474], [476, 476], [593, 593], [609, 609], [708, 708], [711, 711], [713, 715], [717, 717], [720, 720], [728, 731], [733, 733], [735, 735], [768, 879], [913, 929], [931, 937], [945, 961], [963, 969], [1025, 1025], [1040, 1103], [1105, 1105], [4352, 4447], [8208, 8208], [8211, 8214], [8216, 8217], [8220, 8221], [8224, 8226], [8228, 8231], [8240, 8240], [8242, 8243], [8245, 8245], [8251, 8251], [8254, 8254], [8308, 8308], [8319, 8319], [8321, 8324], [8364, 8364], [8451, 8451], [8453, 8453], 
[8457, 8457], [8467, 8467], [8470, 8470], [8481, 8482], [8486, 8486], [8491, 8491], [8531, 8532], [8539, 8542], [8544, 8555], [8560, 8569], [8585, 8585], [8592, 8601], [8632, 8633], [8658, 8658], [8660, 8660], [8679, 8679], [8704, 8704], [8706, 8707], [8711, 8712], [8715, 8715], [8719, 8719], [8721, 8721], [8725, 8725], [8730, 8730], [8733, 8736], [8739, 8739], [8741, 8741], [8743, 8748], [8750, 8750], [8756, 8759], [8764, 8765], [8776, 8776], [8780, 8780], [8786, 8786], [8800, 8801], [8804, 8807], 
[8810, 8811], [8814, 8815], [8834, 8835], [8838, 8839], [8853, 8853], [8857, 8857], [8869, 8869], [8895, 8895], [8978, 8978], [8986, 8987], [9001, 9002], [9193, 9196], [9200, 9200], [9203, 9203], [9312, 9449], [9451, 9547], [9552, 9587], [9600, 9615], [9618, 9621], [9632, 9633], [9635, 9641], [9650, 9651], [9654, 9655], [9660, 9661], [9664, 9665], [9670, 9672], [9675, 9675], [9678, 9681], [9698, 9701], [9711, 9711], [9725, 9726], [9733, 9734], [9737, 9737], [9742, 9743], [9748, 9749], [9756, 9756], 
[9758, 9758], [9792, 9792], [9794, 9794], [9800, 9811], [9824, 9825], [9827, 9829], [9831, 9834], [9836, 9837], [9839, 9839], [9855, 9855], [9875, 9875], [9886, 9887], [9889, 9889], [9898, 9899], [9917, 9919], [9924, 9953], [9955, 9955], [9960, 9983], [9989, 9989], [9994, 9995], [10024, 10024], [10045, 10045], [10060, 10060], [10062, 10062], [10067, 10069], [10071, 10071], [10102, 10111], [10133, 10135], [10160, 10160], [10175, 10175], [11035, 11036], [11088, 11088], [11093, 11097], [11904, 12255], 
[12272, 12350], [12352, 19903], [19968, 42191], [43360, 43391], [44032, 55203], [57344, 64255], [65024, 65049], [65072, 65135], [65281, 65376], [65504, 65510], [65533, 65533], [94176, 94177], [94208, 101119], [110592, 110895], [110960, 111359], [126980, 126980], [127183, 127183], [127232, 127242], [127248, 127277], [127280, 127337], [127344, 127404], [127488, 127490], [127504, 127547], [127552, 127560], [127568, 127569], [127584, 127589], [127744, 127776], [127789, 127797], [127799, 127868], [127870, 
127891], [127904, 127946], [127951, 127955], [127968, 127984], [127988, 127988], [127992, 128062], [128064, 128064], [128066, 128252], [128255, 128317], [128331, 128334], [128336, 128359], [128378, 128378], [128405, 128406], [128420, 128420], [128507, 128591], [128640, 128709], [128716, 128716], [128720, 128722], [128747, 128748], [128756, 128761], [129296, 129342], [129344, 129392], [129395, 129398], [129402, 129402], [129404, 129442], [129456, 129465], [129472, 129474], [129488, 129535], [131072, 
196605], [196608, 262141], [917760, 917999], [983040, 1048573], [1048576, 1114109], ];
lib.wc.unambiguous = [[4352, 4447], [8986, 8987], [9001, 9002], [9193, 9196], [9200, 9200], [9203, 9203], [9725, 9726], [9748, 9749], [9800, 9811], [9855, 9855], [9875, 9875], [9889, 9889], [9898, 9899], [9917, 9918], [9924, 9925], [9934, 9934], [9940, 9940], [9962, 9962], [9970, 9971], [9973, 9973], [9978, 9978], [9981, 9981], [9989, 9989], [9994, 9995], [10024, 10024], [10060, 10060], [10062, 10062], [10067, 10069], [10071, 10071], [10133, 10135], [10160, 10160], [10175, 10175], [11035, 11036], 
[11088, 11088], [11093, 11093], [11904, 12255], [12272, 12350], [12352, 12871], [12880, 19903], [19968, 42191], [43360, 43391], [44032, 55203], [63744, 64255], [65040, 65049], [65072, 65135], [65281, 65376], [65504, 65510], [94176, 94177], [94208, 101119], [110592, 110895], [110960, 111359], [126980, 126980], [127183, 127183], [127374, 127374], [127377, 127386], [127488, 127490], [127504, 127547], [127552, 127560], [127568, 127569], [127584, 127589], [127744, 127776], [127789, 127797], [127799, 127868], 
[127870, 127891], [127904, 127946], [127951, 127955], [127968, 127984], [127988, 127988], [127992, 128062], [128064, 128064], [128066, 128252], [128255, 128317], [128331, 128334], [128336, 128359], [128378, 128378], [128405, 128406], [128420, 128420], [128507, 128591], [128640, 128709], [128716, 128716], [128720, 128722], [128747, 128748], [128756, 128761], [129296, 129342], [129344, 129392], [129395, 129398], [129402, 129402], [129404, 129442], [129456, 129465], [129472, 129474], [129488, 129535], 
[131072, 196605], [196608, 262141], ];
lib.wc.binaryTableSearch_ = function(ucs, table) {
  var min = 0, max = table.length - 1;
  if (ucs < table[min][0] || ucs > table[max][1]) {
    return !1;
  }
  for (; max >= min;) {
    var mid = Math.floor((min + max) / 2);
    if (ucs > table[mid][1]) {
      min = mid + 1;
    } else {
      if (ucs < table[mid][0]) {
        max = mid - 1;
      } else {
        return !0;
      }
    }
  }
  return !1;
};
lib.wc.isSpace = function(ucs) {
  return lib.wc.binaryTableSearch_(ucs, lib.wc.combining);
};
lib.wc.isCjkAmbiguous = function(ucs) {
  return lib.wc.binaryTableSearch_(ucs, lib.wc.ambiguous);
};
lib.wc.charWidth = function(ucs) {
  return lib.wc.regardCjkAmbiguous ? lib.wc.charWidthRegardAmbiguous(ucs) : lib.wc.charWidthDisregardAmbiguous(ucs);
};
lib.wc.charWidthDisregardAmbiguous = function(ucs) {
  return 127 > ucs ? 32 <= ucs ? 1 : 0 == ucs ? lib.wc.nulWidth : lib.wc.controlWidth : 160 > ucs ? lib.wc.controlWidth : lib.wc.isSpace(ucs) ? 0 : lib.wc.binaryTableSearch_(ucs, lib.wc.unambiguous) ? 2 : 1;
};
lib.wc.charWidthRegardAmbiguous = function(ucs) {
  return lib.wc.isCjkAmbiguous(ucs) ? lib.wc.cjkAmbiguousWidth : lib.wc.charWidthDisregardAmbiguous(ucs);
};
lib.wc.strWidth = function(str) {
  for (var width, rv = 0, i = 0; i < str.length;) {
    var codePoint = str.codePointAt(i);
    width = lib.wc.charWidth(codePoint);
    if (0 > width) {
      return -1;
    }
    rv += width;
    i += 65535 >= codePoint ? 1 : 2;
  }
  return rv;
};
lib.wc.substr = function(str, start, opt_width) {
  var startIndex = 0, width;
  if (start) {
    for (width = 0; startIndex < str.length;) {
      var codePoint = str.codePointAt(startIndex);
      width += lib.wc.charWidth(codePoint);
      if (width > start) {
        break;
      }
      startIndex += 65535 >= codePoint ? 1 : 2;
    }
  }
  if (void 0 != opt_width) {
    var endIndex = startIndex;
    for (width = 0; endIndex < str.length;) {
      var codePoint$6 = str.codePointAt(endIndex);
      width += lib.wc.charWidth(codePoint$6);
      if (width > opt_width) {
        break;
      }
      endIndex += 65535 >= codePoint$6 ? 1 : 2;
    }
    return str.substring(startIndex, endIndex);
  }
  return str.substr(startIndex);
};
lib.wc.substring = function(str, start, end) {
  return lib.wc.substr(str, start, end - start);
};
lib.resource.add("libdot/changelog/version", "text/plain", "1.25");
lib.resource.add("libdot/changelog/date", "text/plain", "2018-12-02, Minor improvements.");
lib.rtdep("lib.Storage");
var hterm = {windowType:null, os:null, zoomWarningMessage:"ZOOM != 100%", notifyCopyMessage:"\u2702", desktopNotificationTitle:"\u266a %(title) \u266a", testDeps:"hterm.AccessibilityReader.Tests hterm.ScrollPort.Tests hterm.Screen.Tests hterm.Terminal.Tests hterm.VT.Tests hterm.VT.CannedTests".split(" ")};
lib.registerInit("hterm", function(onInit) {
  function initOs(os) {
    hterm.os = os;
    onInit();
  }
  function initMessageManager() {
    lib.i18n.getAcceptLanguages(function(languages) {
      hterm.messageManager || (hterm.messageManager = new lib.MessageManager(languages));
      lib.f.getOs().then(initOs).catch(initOs);
    });
  }
  function onWindow(window) {
    hterm.windowType = window.type;
    initMessageManager();
  }
  function onTab(tab) {
    tab && window.chrome ? chrome.windows.get(tab.windowId, null, onWindow) : (hterm.windowType = "normal", initMessageManager());
  }
  hterm.defaultStorage || (hterm.defaultStorage = window.chrome && chrome.storage && chrome.storage.sync ? new lib.Storage.Chrome(chrome.storage.sync) : new lib.Storage.Local);
  var isPackagedApp = !1;
  if (window.chrome && chrome.runtime && chrome.runtime.getManifest) {
    var manifest = chrome.runtime.getManifest();
    isPackagedApp = manifest.app && manifest.app.background;
  }
  isPackagedApp ? setTimeout(onWindow.bind(null, {type:"popup"}), 0) : window.chrome && chrome.tabs ? chrome.tabs.getCurrent(onTab) : setTimeout(onWindow.bind(null, {type:"normal"}), 0);
});
hterm.getClientSize = function(dom) {
  return dom.getBoundingClientRect();
};
hterm.getClientWidth = function(dom) {
  return dom.getBoundingClientRect().width;
};
hterm.getClientHeight = function(dom) {
  return dom.getBoundingClientRect().height;
};
hterm.copySelectionToClipboard = function(document, str) {
  var execCommand = function() {
    var copySource = document.createElement("pre");
    copySource.id = "hterm:copy-to-clipboard-source";
    copySource.textContent = str;
    copySource.style.cssText = "-webkit-user-select: text;-moz-user-select: text;position: absolute;top: -99px";
    document.body.appendChild(copySource);
    var selection = document.getSelection(), anchorNode = selection.anchorNode, anchorOffset = selection.anchorOffset, focusNode = selection.focusNode, focusOffset = selection.focusOffset;
    try {
      selection.selectAllChildren(copySource);
    } catch (ex) {
    }
    try {
      document.execCommand("copy");
    } catch (firefoxException) {
    }
    selection.extend && (anchorNode && selection.collapse(anchorNode, anchorOffset), focusNode && selection.extend(focusNode, focusOffset));
    copySource.parentNode.removeChild(copySource);
    return Promise.resolve();
  };
  return function() {
    return navigator.permissions && navigator.permissions.query ? navigator.permissions.query({name:"clipboard-write"}).then(function(status) {
      var checkState = function(resolve$jscomp$0, reject$jscomp$0) {
        switch(status.state) {
          case "granted":
            return resolve$jscomp$0();
          case "denied":
            return reject$jscomp$0();
          default:
            return new Promise(function(resolve, reject) {
              status.onchange = function() {
                return checkState(resolve, reject);
              };
            });
        }
      };
      return new Promise(checkState);
    }).catch(function() {
      return Promise.resolve();
    }) : Promise.resolve();
  }().then(function() {
    return navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(str).catch(execCommand) : execCommand();
  });
};
hterm.pasteFromClipboard = function(document) {
  try {
    return document.execCommand("paste");
  } catch (firefoxException) {
    return !1;
  }
};
hterm.msg = function(name, args, string) {
  args = void 0 === args ? [] : args;
  return hterm.messageManager.get("HTERM_" + name, args, string);
};
hterm.notify = function(params) {
  var def = function(curr, fallback) {
    return void 0 !== curr ? curr : fallback;
  };
  if (void 0 === params || null === params) {
    params = {};
  }
  var options = {body:params.body, icon:def(params.icon, lib.resource.getDataUrl("hterm/images/icon-96")), }, title = def(params.title, window.document.title);
  title || (title = "hterm");
  title = lib.f.replaceVars(hterm.desktopNotificationTitle, {title:title});
  var n = new Notification(title, options);
  n.onclick = function() {
    window.focus();
    this.close();
  };
  return n;
};
hterm.openUrl = function(url) {
  window.chrome && chrome.browser && chrome.browser.openTab ? chrome.browser.openTab({url:url}) : lib.f.openWindow(url, "_blank").focus();
};
hterm.Size = function(width, height) {
  this.width = width;
  this.height = height;
};
hterm.Size.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
};
hterm.Size.prototype.clone = function() {
  return new hterm.Size(this.width, this.height);
};
hterm.Size.prototype.setTo = function(that) {
  this.width = that.width;
  this.height = that.height;
};
hterm.Size.prototype.equals = function(that) {
  return this.width == that.width && this.height == that.height;
};
hterm.Size.prototype.toString = function() {
  return "[hterm.Size: " + this.width + ", " + this.height + "]";
};
hterm.RowCol = function(row, column, opt_overflow) {
  this.row = row;
  this.column = column;
  this.overflow = !!opt_overflow;
};
hterm.RowCol.prototype.move = function(row, column, opt_overflow) {
  this.row = row;
  this.column = column;
  this.overflow = !!opt_overflow;
};
hterm.RowCol.prototype.clone = function() {
  return new hterm.RowCol(this.row, this.column, this.overflow);
};
hterm.RowCol.prototype.setTo = function(that) {
  this.row = that.row;
  this.column = that.column;
  this.overflow = that.overflow;
};
hterm.RowCol.prototype.equals = function(that) {
  return this.row == that.row && this.column == that.column && this.overflow == that.overflow;
};
hterm.RowCol.prototype.toString = function() {
  return "[hterm.RowCol: " + this.row + ", " + this.column + ", " + this.overflow + "]";
};
hterm.AccessibilityReader = function(div) {
  this.document_ = div.ownerDocument;
  var liveRegion = this.document_.createElement("div");
  liveRegion.id = "hterm:accessibility-live-region";
  liveRegion.style.cssText = "position: absolute;\n                              width: 0; height: 0;\n                              overflow: hidden;\n                              left: 0; top: 0;";
  div.appendChild(liveRegion);
  this.accessibilityEnabled = !1;
  this.liveElement_ = this.document_.createElement("p");
  this.liveElement_.setAttribute("aria-live", "polite");
  this.liveElement_.setAttribute("aria-label", "");
  liveRegion.appendChild(this.liveElement_);
  this.assertiveLiveElement_ = this.document_.createElement("p");
  this.assertiveLiveElement_.setAttribute("aria-live", "assertive");
  this.assertiveLiveElement_.setAttribute("aria-label", "");
  liveRegion.appendChild(this.assertiveLiveElement_);
  this.queue_ = [];
  this.nextReadTimer_ = null;
  this.cursorIsChanging_ = !1;
  this.cursorChangeQueue_ = [];
  this.lastCursorColumn_ = this.lastCursorRow_ = this.lastCursorRowString_ = null;
  this.hasUserGesture = !1;
};
hterm.AccessibilityReader.DELAY = 50;
hterm.AccessibilityReader.prototype.setAccessibilityEnabled = function(enabled) {
  enabled || this.clear();
  this.accessibilityEnabled = enabled;
};
hterm.AccessibilityReader.prototype.decorate = function(doc) {
  var $jscomp$this = this;
  ["keydown", "keypress", "keyup", "textInput"].forEach(function(handler) {
    doc.addEventListener(handler, function() {
      $jscomp$this.hasUserGesture = !0;
    });
  });
};
hterm.AccessibilityReader.prototype.beforeCursorChange = function(cursorRowString, cursorRow, cursorColumn) {
  this.accessibilityEnabled && this.hasUserGesture && !this.cursorIsChanging_ && (this.cursorIsChanging_ = !0, this.lastCursorRowString_ = cursorRowString, this.lastCursorRow_ = cursorRow, this.lastCursorColumn_ = cursorColumn);
};
hterm.AccessibilityReader.prototype.afterCursorChange = function(cursorRowString, cursorRow, cursorColumn) {
  if (this.cursorIsChanging_) {
    this.cursorIsChanging_ = !1;
    if (!this.announceAction_(cursorRowString, cursorRow, cursorColumn)) {
      for (var i = 0; i < this.cursorChangeQueue_.length; ++i) {
        this.announce(this.cursorChangeQueue_[i]);
      }
    }
    this.cursorChangeQueue_ = [];
    this.lastCursorColumn_ = this.lastCursorRow_ = this.lastCursorRowString_ = null;
    this.hasUserGesture = !1;
  }
};
hterm.AccessibilityReader.prototype.announce = function(str) {
  if (this.accessibilityEnabled) {
    if (this.cursorIsChanging_) {
      this.cursorChangeQueue_.push(str);
    } else {
      if ("\n" == str && 0 < this.queue_.length) {
        this.queue_.push("");
      } else {
        if (0 == this.queue_.length) {
          this.queue_.push(str);
        } else {
          var padding = "";
          0 != this.queue_[this.queue_.length - 1].length && (padding = " ");
          this.queue_[this.queue_.length - 1] += padding + str;
        }
        if (!this.nextReadTimer_) {
          if (1 == this.queue_.length) {
            this.nextReadTimer_ = setTimeout(this.addToLiveRegion_.bind(this), hterm.AccessibilityReader.DELAY);
          } else {
            throw Error("Expected only one item in queue_ or nextReadTimer_ to be running.");
          }
        }
      }
    }
  }
};
hterm.AccessibilityReader.prototype.assertiveAnnounce = function(str) {
  this.hasUserGesture && " " == str && (str = hterm.msg("SPACE_CHARACTER", [], "Space"));
  str = str.trim();
  str == this.assertiveLiveElement_.getAttribute("aria-label") && (str = "\n" + str);
  this.clear();
  this.assertiveLiveElement_.setAttribute("aria-label", str);
};
hterm.AccessibilityReader.prototype.newLine = function() {
  this.announce("\n");
};
hterm.AccessibilityReader.prototype.clear = function() {
  this.liveElement_.setAttribute("aria-label", "");
  this.assertiveLiveElement_.setAttribute("aria-label", "");
  clearTimeout(this.nextReadTimer_);
  this.nextReadTimer_ = null;
  this.queue_ = [];
  this.cursorIsChanging_ = !1;
  this.cursorChangeQueue_ = [];
  this.lastCursorColumn_ = this.lastCursorRow_ = this.lastCursorRowString_ = null;
  this.hasUserGesture = !1;
};
hterm.AccessibilityReader.prototype.announceAction_ = function(cursorRowString, cursorRow, cursorColumn) {
  if (this.lastCursorRow_ != cursorRow) {
    return !1;
  }
  if (this.lastCursorRowString_ == cursorRowString) {
    return this.lastCursorColumn_ != cursorColumn && "" == this.cursorChangeQueue_.join("").trim() ? (this.assertiveAnnounce(lib.wc.substr(this.lastCursorRowString_, Math.min(this.lastCursorColumn_, cursorColumn), Math.abs(cursorColumn - this.lastCursorColumn_))), !0) : !1;
  }
  if (this.lastCursorRowString_ != cursorRowString) {
    if (this.lastCursorColumn_ + 1 == cursorColumn && " " == lib.wc.substr(cursorRowString, cursorColumn - 1, 1) && 0 < this.cursorChangeQueue_.length && " " == this.cursorChangeQueue_[0]) {
      return this.assertiveAnnounce(" "), !0;
    }
    if (lib.wc.strWidth(cursorRowString) <= lib.wc.strWidth(this.lastCursorRowString_) && lib.wc.substr(this.lastCursorRowString_, 0, cursorColumn) == lib.wc.substr(cursorRowString, 0, cursorColumn)) {
      for (var lengthOfCurrentRow = lib.wc.strWidth(cursorRowString); 0 < lengthOfCurrentRow && lengthOfCurrentRow != cursorColumn && " " == lib.wc.substr(cursorRowString, lengthOfCurrentRow - 1, 1); --lengthOfCurrentRow) {
      }
      var numCharsDeleted = lib.wc.strWidth(this.lastCursorRowString_) - lengthOfCurrentRow, lengthOfEndOfString = lengthOfCurrentRow - cursorColumn, endOfLastRowString = lib.wc.substr(this.lastCursorRowString_, cursorColumn + numCharsDeleted, lengthOfEndOfString), endOfCurrentRowString = lib.wc.substr(cursorRowString, cursorColumn, lengthOfEndOfString);
      if (endOfLastRowString == endOfCurrentRowString) {
        var deleted = lib.wc.substr(this.lastCursorRowString_, cursorColumn, numCharsDeleted);
        if ("" != deleted) {
          return this.assertiveAnnounce(deleted), !0;
        }
      }
    }
  }
  return !1;
};
hterm.AccessibilityReader.prototype.addToLiveRegion_ = function() {
  this.nextReadTimer_ = null;
  var str = this.queue_.join("\n").trim();
  str == this.liveElement_.getAttribute("aria-label") && (str = "\n" + str);
  this.liveElement_.setAttribute("aria-label", str);
  this.queue_ = [];
};
hterm.ContextMenu = function() {
  this.element_ = this.document_ = null;
  this.menu_ = [];
};
hterm.ContextMenu.SEPARATOR = {};
hterm.ContextMenu.prototype.setDocument = function(document) {
  this.element_ && (this.element_.remove(), this.element_ = null);
  this.document_ = document;
  this.regenerate_();
  this.document_.body.appendChild(this.element_);
};
hterm.ContextMenu.prototype.regenerate_ = function() {
  var $jscomp$this = this;
  this.element_ ? this.hide() : (this.element_ = this.document_.createElement("menu"), this.element_.id = "hterm:context-menu", this.element_.style.cssText = "\n        display: none;\n        border: solid 1px;\n        position: absolute;\n    ");
  for (; this.element_.firstChild;) {
    this.element_.removeChild(this.element_.firstChild);
  }
  this.menu_.forEach(function($jscomp$destructuring$var0) {
    var $jscomp$destructuring$var1 = $jscomp.makeIterator($jscomp$destructuring$var0), name = $jscomp$destructuring$var1.next().value, action = $jscomp$destructuring$var1.next().value, menuitem = $jscomp$this.document_.createElement("menuitem");
    name === hterm.ContextMenu.SEPARATOR ? (menuitem.innerHTML = "<hr>", menuitem.className = "separator") : (menuitem.innerText = name, menuitem.addEventListener("mousedown", function(e) {
      e.preventDefault();
      action(e);
    }));
    $jscomp$this.element_.appendChild(menuitem);
  });
};
hterm.ContextMenu.prototype.setItems = function(items) {
  this.menu_ = items;
  this.regenerate_();
};
hterm.ContextMenu.prototype.show = function(e, terminal) {
  if (0 != this.menu_.length) {
    terminal && (this.element_.style.backgroundColor = terminal.getBackgroundColor(), this.element_.style.color = terminal.getForegroundColor(), this.element_.style.fontSize = terminal.getFontSize(), this.element_.style.fontFamily = terminal.getFontFamily());
    this.element_.style.top = e.clientY + "px";
    this.element_.style.left = e.clientX + "px";
    var docSize = hterm.getClientSize(this.document_.body);
    this.element_.style.display = "block";
    var eleSize = hterm.getClientSize(this.element_), minY = Math.max(0, docSize.height - eleSize.height), minX = Math.max(0, docSize.width - eleSize.width);
    minY < e.clientY && (this.element_.style.top = minY + "px");
    minX < e.clientX && (this.element_.style.left = minX + "px");
  }
};
hterm.ContextMenu.prototype.hide = function() {
  this.element_ && (this.element_.style.display = "none");
};
lib.rtdep("lib.f");
hterm.Frame = function(terminal, url, opt_options) {
  this.terminal_ = terminal;
  this.div_ = terminal.div_;
  this.url = url;
  this.options = opt_options || {};
  this.messageChannel_ = this.container_ = this.iframe_ = null;
};
hterm.Frame.prototype.onMessage_ = function(e) {
  switch(e.data.name) {
    case "ipc-init-ok":
      this.sendTerminalInfo_();
      break;
    case "terminal-info-ok":
      this.container_.style.display = "flex";
      this.postMessage("visible");
      this.messageChannel_.port1.onmessage = this.onMessage.bind(this);
      this.onLoad();
      break;
    default:
      console.log("Unknown message from frame:", e.data);
  }
};
hterm.Frame.prototype.onMessage = function() {
};
hterm.Frame.prototype.onLoad_ = function() {
  this.messageChannel_ = new MessageChannel;
  this.messageChannel_.port1.onmessage = this.onMessage_.bind(this);
  this.messageChannel_.port1.start();
  this.iframe_.contentWindow.postMessage({name:"ipc-init", argv:[{messagePort:this.messageChannel_.port2}]}, this.url, [this.messageChannel_.port2]);
};
hterm.Frame.prototype.onLoad = function() {
};
hterm.Frame.prototype.sendTerminalInfo_ = function() {
  lib.i18n.getAcceptLanguages(function(languages) {
    this.postMessage("terminal-info", [{acceptLanguages:languages, foregroundColor:this.terminal_.getForegroundColor(), backgroundColor:this.terminal_.getBackgroundColor(), cursorColor:this.terminal_.getCursorColor(), fontSize:this.terminal_.getFontSize(), fontFamily:this.terminal_.getFontFamily(), baseURL:lib.f.getURL("/")}]);
  }.bind(this));
};
hterm.Frame.prototype.onCloseClicked_ = function() {
  this.close();
};
hterm.Frame.prototype.close = function() {
  this.container_ && this.container_.parentNode && (this.container_.parentNode.removeChild(this.container_), this.onClose());
};
hterm.Frame.prototype.onClose = function() {
};
hterm.Frame.prototype.postMessage = function(name, argv) {
  if (!this.messageChannel_) {
    throw Error("Message channel is not set up.");
  }
  this.messageChannel_.port1.postMessage({name:name, argv:argv});
};
hterm.Frame.prototype.show = function() {
  var button, header;
  function opt(name, defaultValue) {
    return name in self.options ? self.options[name] : defaultValue;
  }
  var self = this;
  self = this;
  if (this.container_ && this.container_.parentNode) {
    console.error("Frame already visible");
  } else {
    var divSize = hterm.getClientSize(this.div_), width = opt("width", 640), height = opt("height", 480), left = (divSize.width - width) / 2, top = (divSize.height - height) / 2, document = this.terminal_.document_, container = this.container_ = document.createElement("div");
    container.style.cssText = "position: absolute;display: none;flex-direction: column;top: 10%;left: 4%;width: 90%;height: 80%;min-height: 20%;max-height: 80%;box-shadow: 0 0 2px " + this.terminal_.getForegroundColor() + ";border: 2px " + this.terminal_.getForegroundColor() + " solid;";
    var iframe = this.iframe_ = document.createElement("iframe");
    iframe.onload = this.onLoad_.bind(this);
    iframe.style.cssText = "display: flex;flex: 1;width: 100%";
    iframe.setAttribute("src", this.url);
    iframe.setAttribute("seamless", !0);
    container.appendChild(iframe);
    this.div_.appendChild(container);
  }
};
lib.rtdep("hterm.Keyboard.KeyMap");
hterm.Keyboard = function(terminal) {
  this.terminal = terminal;
  this.keyboardElement_ = null;
  this.handlers_ = [["focusout", this.onFocusOut_.bind(this)], ["keydown", this.onKeyDown_.bind(this)], ["keypress", this.onKeyPress_.bind(this)], ["keyup", this.onKeyUp_.bind(this)], ["textInput", this.onTextInput_.bind(this)]];
  this.keyMap = new hterm.Keyboard.KeyMap(this);
  this.bindings = new hterm.Keyboard.Bindings(this);
  this.altGrMode = "none";
  this.shiftInsertPaste = !0;
  this.pageKeysScroll = this.homeKeysScroll = !1;
  this.ctrlPlusMinusZeroZoom = !0;
  this.backspaceSendsBackspace = this.applicationCursor = this.applicationKeypad = this.ctrlVPaste = this.ctrlCCopy = !1;
  this.characterEncoding = "utf-8";
  this.passMetaV = this.metaSendsEscape = !0;
  this.altSendsWhat = "escape";
  this.altBackspaceIsMetaBackspace = this.altIsMeta = !1;
  this.altKeyPressed = 0;
  this.mediaKeysAreFKeys = !1;
  this.previousAltSendsWhat_ = null;
};
hterm.Keyboard.KeyActions = {CANCEL:lib.f.createEnum("CANCEL"), DEFAULT:lib.f.createEnum("DEFAULT"), PASS:lib.f.createEnum("PASS"), STRIP:lib.f.createEnum("STRIP")};
hterm.Keyboard.prototype.encode = function(str) {
  return "utf-8" == this.characterEncoding ? this.terminal.vt.encodeUTF8(str) : str;
};
hterm.Keyboard.prototype.installKeyboard = function(element) {
  if (element != this.keyboardElement_) {
    element && this.keyboardElement_ && this.installKeyboard(null);
    for (var i = 0; i < this.handlers_.length; i++) {
      var handler = this.handlers_[i];
      element ? element.addEventListener(handler[0], handler[1]) : this.keyboardElement_.removeEventListener(handler[0], handler[1]);
    }
    this.keyboardElement_ = element;
  }
};
hterm.Keyboard.prototype.uninstallKeyboard = function() {
  this.installKeyboard(null);
};
hterm.Keyboard.prototype.onTextInput_ = function(e) {
  if (e.data) {
    this.terminal.onVTKeystroke(e.data);
  }
};
hterm.Keyboard.prototype.onKeyPress_ = function(e) {
  var key = String.fromCharCode(e.which).toLowerCase();
  if ((!e.ctrlKey && !e.metaKey || "c" != key && "v" != key) && 9 != e.keyCode) {
    if (e.altKey && "browser-key" == this.altSendsWhat && 0 == e.charCode) {
      var ch = String.fromCharCode(e.keyCode);
      e.shiftKey || (ch = ch.toLowerCase());
    } else {
      32 <= e.charCode && (ch = e.charCode);
    }
    if (ch) {
      this.terminal.onVTKeystroke(String.fromCharCode(ch));
    }
    e.preventDefault();
    e.stopPropagation();
  }
};
hterm.Keyboard.prototype.preventChromeAppNonCtrlShiftDefault_ = function(e) {
  window.chrome && window.chrome.app && window.chrome.app.window && (e.ctrlKey && e.shiftKey || e.preventDefault());
};
hterm.Keyboard.prototype.onFocusOut_ = function(e) {
  this.altKeyPressed = 0;
};
hterm.Keyboard.prototype.onKeyUp_ = function(e) {
  18 == e.keyCode && (this.altKeyPressed &= ~(1 << e.location - 1));
  27 == e.keyCode && this.preventChromeAppNonCtrlShiftDefault_(e);
};
hterm.Keyboard.prototype.onKeyDown_ = function(e) {
  function getAction(name) {
    resolvedActionType = name;
    var action = keyDef[name];
    "function" == typeof action && (action = action.apply(self.keyMap, [e, keyDef]));
    action === DEFAULT && "normal" != name && (action = getAction("normal"));
    return action;
  }
  18 == e.keyCode && (this.altKeyPressed |= 1 << e.location - 1);
  27 == e.keyCode && this.preventChromeAppNonCtrlShiftDefault_(e);
  var keyDef = this.keyMap.keyDefs[e.keyCode];
  keyDef || (console.warn("No definition for key " + e.key + " (keyCode " + e.keyCode + ")"), keyDef = this.keyMap.keyDefs[0], this.keyMap.addKeyDef(e.keyCode, keyDef));
  var resolvedActionType = null, self = this, CANCEL = hterm.Keyboard.KeyActions.CANCEL, DEFAULT = hterm.Keyboard.KeyActions.DEFAULT, PASS = hterm.Keyboard.KeyActions.PASS, STRIP = hterm.Keyboard.KeyActions.STRIP, control = e.ctrlKey, alt = this.altIsMeta ? !1 : e.altKey, meta = this.altIsMeta ? e.altKey || e.metaKey : e.metaKey, isPrintable = !/^\[\w+\]$/.test(keyDef.keyCap);
  switch(this.altGrMode) {
    case "ctrl-alt":
      isPrintable && control && alt && (alt = control = !1);
      break;
    case "right-alt":
      isPrintable && this.terminal.keyboard.altKeyPressed & 2 && (alt = control = !1);
      break;
    case "left-alt":
      isPrintable && this.terminal.keyboard.altKeyPressed & 1 && (alt = control = !1);
  }
  var action$jscomp$0 = control ? getAction("control") : alt ? getAction("alt") : meta ? getAction("meta") : getAction("normal");
  var shift = !e.maskShiftKey && e.shiftKey, keyDown = {keyCode:e.keyCode, shift:e.shiftKey, ctrl:control, alt:alt, meta:meta}, binding = this.bindings.getBinding(keyDown);
  binding && (shift = control = alt = meta = !1, resolvedActionType = "normal", action$jscomp$0 = binding.action, "function" == typeof action$jscomp$0 && (action$jscomp$0 = action$jscomp$0.call(this, this.terminal, keyDown)));
  alt && "browser-key" == this.altSendsWhat && action$jscomp$0 == DEFAULT && (action$jscomp$0 = PASS);
  if (action$jscomp$0 !== PASS && (action$jscomp$0 !== DEFAULT || control || alt || meta) && (action$jscomp$0 === STRIP && (alt = control = !1, action$jscomp$0 = keyDef.normal, "function" == typeof action$jscomp$0 && (action$jscomp$0 = action$jscomp$0.apply(this.keyMap, [e, keyDef])), action$jscomp$0 == DEFAULT && 2 == keyDef.keyCap.length && (action$jscomp$0 = keyDef.keyCap.substr(shift ? 1 : 0, 1))), e.preventDefault(), e.stopPropagation(), action$jscomp$0 !== CANCEL)) {
    if (action$jscomp$0 !== DEFAULT && "string" != typeof action$jscomp$0) {
      console.warn("Invalid action: " + JSON.stringify(action$jscomp$0));
    } else {
      "control" == resolvedActionType ? control = !1 : "alt" == resolvedActionType ? alt = !1 : "meta" == resolvedActionType && (meta = !1);
      if ("\u001b[" == action$jscomp$0.substr(0, 2) && (alt || control || shift || meta)) {
        var imod = 1;
        shift && (imod += 1);
        alt && (imod += 2);
        control && (imod += 4);
        meta && (imod += 8);
        var mod = ";" + imod;
        action$jscomp$0 = 3 == action$jscomp$0.length ? "\u001b[1" + mod + action$jscomp$0.substr(2, 1) : action$jscomp$0.substr(0, action$jscomp$0.length - 1) + mod + action$jscomp$0.substr(action$jscomp$0.length - 1);
      } else {
        if (action$jscomp$0 === DEFAULT && (action$jscomp$0 = keyDef.keyCap.substr(shift ? 1 : 0, 1), control)) {
          var code = keyDef.keyCap.substr(0, 1).charCodeAt(0);
          64 <= code && 95 >= code && (action$jscomp$0 = String.fromCharCode(code - 64));
        }
        alt && "8-bit" == this.altSendsWhat && 1 == action$jscomp$0.length && (code = action$jscomp$0.charCodeAt(0) + 128, action$jscomp$0 = String.fromCharCode(code));
        if (alt && "escape" == this.altSendsWhat || meta && this.metaSendsEscape) {
          action$jscomp$0 = "\u001b" + action$jscomp$0;
        }
      }
      this.terminal.onVTKeystroke(action$jscomp$0);
    }
  }
};
hterm.Keyboard.Bindings = function() {
  this.bindings_ = {};
};
hterm.Keyboard.Bindings.prototype.clear = function() {
  this.bindings_ = {};
};
hterm.Keyboard.Bindings.prototype.addBinding_ = function(keyPattern, action) {
  var binding = null, list = this.bindings_[keyPattern.keyCode];
  if (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].keyPattern.matchKeyPattern(keyPattern)) {
        binding = list[i];
        break;
      }
    }
  }
  binding ? binding.action = action : (binding = {keyPattern:keyPattern, action:action}, list ? (this.bindings_[keyPattern.keyCode].push(binding), list.sort(function(a, b) {
    return hterm.Keyboard.KeyPattern.sortCompare(a.keyPattern, b.keyPattern);
  })) : this.bindings_[keyPattern.keyCode] = [binding]);
};
hterm.Keyboard.Bindings.prototype.addBinding = function(key, action) {
  if ("string" != typeof key) {
    this.addBinding_(key, action);
  } else {
    var p = new hterm.Parser;
    p.reset(key);
    try {
      var sequence = p.parseKeySequence();
    } catch (ex) {
      console.error(ex);
      return;
    }
    if (p.isComplete()) {
      if ("string" == typeof action) {
        p.reset(action);
        try {
          action = p.parseKeyAction();
        } catch (ex$7) {
          console.error(ex$7);
          return;
        }
      }
      p.isComplete() ? this.addBinding_(new hterm.Keyboard.KeyPattern(sequence), action) : console.error(p.error("Expected end of sequence: " + sequence));
    } else {
      console.error(p.error("Expected end of sequence: " + sequence));
    }
  }
};
hterm.Keyboard.Bindings.prototype.addBindings = function(map) {
  for (var key in map) {
    this.addBinding(key, map[key]);
  }
};
hterm.Keyboard.Bindings.prototype.getBinding = function(keyDown) {
  var list = this.bindings_[keyDown.keyCode];
  if (!list) {
    return null;
  }
  for (var i = 0; i < list.length; i++) {
    var binding = list[i];
    if (binding.keyPattern.matchKeyDown(keyDown)) {
      return binding;
    }
  }
  return null;
};
lib.rtdep("hterm.Keyboard.KeyActions");
hterm.Keyboard.KeyMap = function(keyboard) {
  this.keyboard = keyboard;
  this.keyDefs = {};
  this.reset();
};
hterm.Keyboard.KeyMap.prototype.addKeyDef = function(keyCode, def) {
  keyCode in this.keyDefs && console.warn("Duplicate keyCode: " + keyCode);
  this.keyDefs[keyCode] = def;
};
hterm.Keyboard.KeyMap.prototype.addKeyDefs = function(var_args) {
  for (var i = 0; i < arguments.length; i++) {
    this.addKeyDef(arguments[i][0], {keyCap:arguments[i][1], normal:arguments[i][2], control:arguments[i][3], alt:arguments[i][4], meta:arguments[i][5]});
  }
};
hterm.Keyboard.KeyMap.prototype.reset = function() {
  function resolve(action, e, k) {
    return "function" == typeof action ? action.apply(self, [e, k]) : action;
  }
  function ak(a, b) {
    return function(e, k) {
      return resolve(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || !self.keyboard.applicationKeypad ? a : b, e, k);
    };
  }
  function ac(a, b) {
    return function(e, k) {
      return resolve(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || !self.keyboard.applicationCursor ? a : b, e, k);
    };
  }
  function bs(a, b) {
    return function(e, k) {
      return resolve(self.keyboard.backspaceSendsBackspace ? b : a, e, k);
    };
  }
  function sh(a, b) {
    return function(e, k) {
      var action = e.shiftKey ? b : a;
      e.maskShiftKey = !0;
      return resolve(action, e, k);
    };
  }
  function alt(a, b) {
    return function(e, k) {
      return resolve(e.altKey ? b : a, e, k);
    };
  }
  function mod(a, b) {
    return function(e, k) {
      return resolve(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey ? b : a, e, k);
    };
  }
  function ctl(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 64);
  }
  function c(m) {
    return function(e, k) {
      return this[m](e, k);
    };
  }
  function med(fn) {
    return function(e, k) {
      return self.keyboard.mediaKeysAreFKeys ? resolve(fn, e, k) : 166 == e.keyCode || 167 == e.keyCode || 168 == e.keyCode ? hterm.Keyboard.KeyActions.CANCEL : hterm.Keyboard.KeyActions.PASS;
    };
  }
  this.keyDefs = {};
  var self = this;
  if (window.navigator && navigator.userAgent) {
    if (navigator.userAgent.includes("Firefox")) {
      var keycapMute = 181, keycapVolDn = 182, keycapVolUp = 183, keycapSC = 59, keycapEP = 61, keycapMU = 173;
      this.addKeyDefs([171, "+*", DEFAULT, c("onPlusMinusZero_"), DEFAULT, c("onPlusMinusZero_")]);
    } else {
      keycapMute = 173, keycapVolDn = 174, keycapVolUp = 175, keycapSC = 186, keycapEP = 187, keycapMU = 189;
    }
  }
  var ESC, CANCEL = hterm.Keyboard.KeyActions.CANCEL, DEFAULT = hterm.Keyboard.KeyActions.DEFAULT, PASS = hterm.Keyboard.KeyActions.PASS, STRIP = hterm.Keyboard.KeyActions.STRIP;
  this.addKeyDefs([0, "[UNKNOWN]", PASS, PASS, PASS, PASS], [27, "[ESC]", "\u001b", DEFAULT, DEFAULT, DEFAULT], [112, "[F1]", mod("\u001bOP", "\u001b[P"), DEFAULT, "\u001b[23~", DEFAULT], [113, "[F2]", mod("\u001bOQ", "\u001b[Q"), DEFAULT, "\u001b[24~", DEFAULT], [114, "[F3]", mod("\u001bOR", "\u001b[R"), DEFAULT, "\u001b[25~", DEFAULT], [115, "[F4]", mod("\u001bOS", "\u001b[S"), DEFAULT, "\u001b[26~", DEFAULT], [116, "[F5]", "\u001b[15~", DEFAULT, "\u001b[28~", DEFAULT], [117, "[F6]", "\u001b[17~", 
  DEFAULT, "\u001b[29~", DEFAULT], [118, "[F7]", "\u001b[18~", DEFAULT, "\u001b[31~", DEFAULT], [119, "[F8]", "\u001b[19~", DEFAULT, "\u001b[32~", DEFAULT], [120, "[F9]", "\u001b[20~", DEFAULT, "\u001b[33~", DEFAULT], [121, "[F10]", "\u001b[21~", DEFAULT, "\u001b[34~", DEFAULT], [122, "[F11]", c("onF11_"), DEFAULT, "\u001b[42~", DEFAULT], [123, "[F12]", "\u001b[24~", DEFAULT, "\u001b[43~", DEFAULT], [192, "`~", DEFAULT, sh(ctl("@"), ctl("^")), DEFAULT, PASS], [49, "1!", DEFAULT, c("onCtrlNum_"), 
  c("onAltNum_"), c("onMetaNum_")], [50, "2@", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), c("onMetaNum_")], [51, "3#", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), c("onMetaNum_")], [52, "4$", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), c("onMetaNum_")], [53, "5%", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), c("onMetaNum_")], [54, "6^", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), c("onMetaNum_")], [55, "7&", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), c("onMetaNum_")], [56, "8*", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), 
  c("onMetaNum_")], [57, "9(", DEFAULT, c("onCtrlNum_"), c("onAltNum_"), c("onMetaNum_")], [48, "0)", DEFAULT, c("onPlusMinusZero_"), c("onAltNum_"), c("onPlusMinusZero_")], [keycapMU, "-_", DEFAULT, c("onPlusMinusZero_"), DEFAULT, c("onPlusMinusZero_")], [keycapEP, "=+", DEFAULT, c("onPlusMinusZero_"), DEFAULT, c("onPlusMinusZero_")], [8, "[BKSP]", bs("\u007f", "\b"), bs("\b", "\u007f"), DEFAULT, DEFAULT], [9, "[TAB]", sh("\t", "\u001b[Z"), STRIP, PASS, DEFAULT], [81, "qQ", DEFAULT, ctl("Q"), DEFAULT, 
  DEFAULT], [87, "wW", DEFAULT, ctl("W"), DEFAULT, DEFAULT], [69, "eE", DEFAULT, ctl("E"), DEFAULT, DEFAULT], [82, "rR", DEFAULT, ctl("R"), DEFAULT, DEFAULT], [84, "tT", DEFAULT, ctl("T"), DEFAULT, DEFAULT], [89, "yY", DEFAULT, ctl("Y"), DEFAULT, DEFAULT], [85, "uU", DEFAULT, ctl("U"), DEFAULT, DEFAULT], [73, "iI", DEFAULT, ctl("I"), DEFAULT, DEFAULT], [79, "oO", DEFAULT, ctl("O"), DEFAULT, DEFAULT], [80, "pP", DEFAULT, ctl("P"), DEFAULT, DEFAULT], [219, "[{", DEFAULT, ctl("["), DEFAULT, DEFAULT], 
  [221, "]}", DEFAULT, ctl("]"), DEFAULT, DEFAULT], [220, "\\|", DEFAULT, ctl("\\"), DEFAULT, DEFAULT], [20, "[CAPS]", PASS, PASS, PASS, DEFAULT], [65, "aA", DEFAULT, ctl("A"), DEFAULT, DEFAULT], [83, "sS", DEFAULT, ctl("S"), DEFAULT, DEFAULT], [68, "dD", DEFAULT, ctl("D"), DEFAULT, DEFAULT], [70, "fF", DEFAULT, ctl("F"), DEFAULT, DEFAULT], [71, "gG", DEFAULT, ctl("G"), DEFAULT, DEFAULT], [72, "hH", DEFAULT, ctl("H"), DEFAULT, DEFAULT], [74, "jJ", DEFAULT, sh(ctl("J"), PASS), DEFAULT, DEFAULT], [75, 
  "kK", DEFAULT, sh(ctl("K"), c("onClear_")), DEFAULT, DEFAULT], [76, "lL", DEFAULT, sh(ctl("L"), PASS), DEFAULT, DEFAULT], [keycapSC, ";:", DEFAULT, STRIP, DEFAULT, DEFAULT], [222, "'\"", DEFAULT, STRIP, DEFAULT, DEFAULT], [13, "[ENTER]", "\r", CANCEL, CANCEL, DEFAULT], [16, "[SHIFT]", PASS, PASS, PASS, DEFAULT], [90, "zZ", DEFAULT, ctl("Z"), DEFAULT, DEFAULT], [88, "xX", DEFAULT, ctl("X"), DEFAULT, DEFAULT], [67, "cC", DEFAULT, c("onCtrlC_"), DEFAULT, c("onMetaC_")], [86, "vV", DEFAULT, c("onCtrlV_"), 
  DEFAULT, c("onMetaV_")], [66, "bB", DEFAULT, sh(ctl("B"), PASS), DEFAULT, sh(DEFAULT, PASS)], [78, "nN", DEFAULT, c("onCtrlN_"), DEFAULT, c("onMetaN_")], [77, "mM", DEFAULT, ctl("M"), DEFAULT, DEFAULT], [188, ",<", DEFAULT, alt(STRIP, PASS), DEFAULT, DEFAULT], [190, ".>", DEFAULT, alt(STRIP, PASS), DEFAULT, DEFAULT], [191, "/?", DEFAULT, sh(ctl("_"), ctl("?")), DEFAULT, DEFAULT], [17, "[CTRL]", PASS, PASS, PASS, PASS], [18, "[ALT]", PASS, PASS, PASS, PASS], [91, "[LAPL]", PASS, PASS, PASS, PASS], 
  [32, " ", DEFAULT, ctl("@"), DEFAULT, DEFAULT], [92, "[RAPL]", PASS, PASS, PASS, PASS], [93, "[RMENU]", PASS, PASS, PASS, PASS], [42, "[PRTSCR]", PASS, PASS, PASS, PASS], [145, "[SCRLK]", PASS, PASS, PASS, PASS], [19, "[BREAK]", PASS, PASS, PASS, PASS], [45, "[INSERT]", c("onKeyInsert_"), DEFAULT, DEFAULT, DEFAULT], [36, "[HOME]", c("onKeyHome_"), DEFAULT, DEFAULT, DEFAULT], [33, "[PGUP]", c("onKeyPageUp_"), DEFAULT, DEFAULT, DEFAULT], [46, "[DEL]", c("onKeyDel_"), DEFAULT, DEFAULT, DEFAULT], [35, 
  "[END]", c("onKeyEnd_"), DEFAULT, DEFAULT, DEFAULT], [34, "[PGDOWN]", c("onKeyPageDown_"), DEFAULT, DEFAULT, DEFAULT], [38, "[UP]", c("onKeyArrowUp_"), DEFAULT, DEFAULT, DEFAULT], [40, "[DOWN]", c("onKeyArrowDown_"), DEFAULT, DEFAULT, DEFAULT], [39, "[RIGHT]", ac("\u001b[C", "\u001bOC"), DEFAULT, DEFAULT, DEFAULT], [37, "[LEFT]", ac("\u001b[D", "\u001bOD"), DEFAULT, DEFAULT, DEFAULT], [144, "[NUMLOCK]", PASS, PASS, PASS, PASS], [12, "[CLEAR]", PASS, PASS, PASS, PASS], [96, "[KP0]", DEFAULT, DEFAULT, 
  DEFAULT, DEFAULT], [97, "[KP1]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [98, "[KP2]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [99, "[KP3]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [100, "[KP4]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [101, "[KP5]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [102, "[KP6]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [103, "[KP7]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [104, "[KP8]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [105, "[KP9]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [107, "[KP+]", 
  DEFAULT, c("onPlusMinusZero_"), DEFAULT, c("onPlusMinusZero_")], [109, "[KP-]", DEFAULT, c("onPlusMinusZero_"), DEFAULT, c("onPlusMinusZero_")], [106, "[KP*]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [111, "[KP/]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [110, "[KP.]", DEFAULT, DEFAULT, DEFAULT, DEFAULT]);
  "cros" == hterm.os && this.addKeyDefs([166, "[BACK]", med(mod("\u001bOP", "\u001b[P")), DEFAULT, "\u001b[23~", DEFAULT], [167, "[FWD]", med(mod("\u001bOQ", "\u001b[Q")), DEFAULT, "\u001b[24~", DEFAULT], [168, "[RELOAD]", med(mod("\u001bOR", "\u001b[R")), DEFAULT, "\u001b[25~", DEFAULT], [183, "[FSCR]", med(mod("\u001bOS", "\u001b[S")), DEFAULT, "\u001b[26~", DEFAULT], [182, "[WINS]", med("\u001b[15~"), DEFAULT, "\u001b[28~", DEFAULT], [216, "[BRIT-]", med("\u001b[17~"), DEFAULT, "\u001b[29~", DEFAULT], 
  [217, "[BRIT+]", med("\u001b[18~"), DEFAULT, "\u001b[31~", DEFAULT], [173, "[MUTE]", med("\u001b[19~"), DEFAULT, "\u001b[32~", DEFAULT], [174, "[VOL-]", med("\u001b[20~"), DEFAULT, "\u001b[33~", DEFAULT], [175, "[VOL+]", med("\u001b[21~"), DEFAULT, "\u001b[34~", DEFAULT], [152, "[POWER]", DEFAULT, DEFAULT, DEFAULT, DEFAULT], [179, "[PLAY]", med("\u001b[18~"), DEFAULT, "\u001b[31~", DEFAULT], [154, "[DOGS]", med("\u001b[23~"), DEFAULT, "\u001b[42~", DEFAULT], [153, "[ASSIST]", DEFAULT, DEFAULT, 
  DEFAULT, DEFAULT]);
};
hterm.Keyboard.KeyMap.prototype.onKeyInsert_ = function(e) {
  return this.keyboard.shiftInsertPaste && e.shiftKey ? hterm.Keyboard.KeyActions.PASS : "\u001b[2~";
};
hterm.Keyboard.KeyMap.prototype.onKeyHome_ = function(e) {
  if (!this.keyboard.homeKeysScroll ^ e.shiftKey) {
    return e.altey || e.ctrlKey || e.shiftKey || !this.keyboard.applicationCursor ? "\u001b[H" : "\u001bOH";
  }
  this.keyboard.terminal.scrollHome();
  return hterm.Keyboard.KeyActions.CANCEL;
};
hterm.Keyboard.KeyMap.prototype.onKeyEnd_ = function(e) {
  if (!this.keyboard.homeKeysScroll ^ e.shiftKey) {
    return e.altKey || e.ctrlKey || e.shiftKey || !this.keyboard.applicationCursor ? "\u001b[F" : "\u001bOF";
  }
  this.keyboard.terminal.scrollEnd();
  return hterm.Keyboard.KeyActions.CANCEL;
};
hterm.Keyboard.KeyMap.prototype.onKeyPageUp_ = function(e) {
  if (!this.keyboard.pageKeysScroll ^ e.shiftKey) {
    return "\u001b[5~";
  }
  this.keyboard.terminal.scrollPageUp();
  return hterm.Keyboard.KeyActions.CANCEL;
};
hterm.Keyboard.KeyMap.prototype.onKeyDel_ = function(e) {
  return this.keyboard.altBackspaceIsMetaBackspace && this.keyboard.altKeyPressed && !e.altKey ? "\u001b\u007f" : "\u001b[3~";
};
hterm.Keyboard.KeyMap.prototype.onKeyPageDown_ = function(e) {
  if (!this.keyboard.pageKeysScroll ^ e.shiftKey) {
    return "\u001b[6~";
  }
  this.keyboard.terminal.scrollPageDown();
  return hterm.Keyboard.KeyActions.CANCEL;
};
hterm.Keyboard.KeyMap.prototype.onKeyArrowUp_ = function(e) {
  return !this.keyboard.applicationCursor && e.shiftKey ? (this.keyboard.terminal.scrollLineUp(), hterm.Keyboard.KeyActions.CANCEL) : e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || !this.keyboard.applicationCursor ? "\u001b[A" : "\u001bOA";
};
hterm.Keyboard.KeyMap.prototype.onKeyArrowDown_ = function(e) {
  return !this.keyboard.applicationCursor && e.shiftKey ? (this.keyboard.terminal.scrollLineDown(), hterm.Keyboard.KeyActions.CANCEL) : e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || !this.keyboard.applicationCursor ? "\u001b[B" : "\u001bOB";
};
hterm.Keyboard.KeyMap.prototype.onClear_ = function(e, keyDef) {
  this.keyboard.terminal.wipeContents();
  return hterm.Keyboard.KeyActions.CANCEL;
};
hterm.Keyboard.KeyMap.prototype.onF11_ = function(e, keyDef) {
  return "popup" != hterm.windowType ? hterm.Keyboard.KeyActions.PASS : "\u001b[23~";
};
hterm.Keyboard.KeyMap.prototype.onCtrlNum_ = function(e, keyDef) {
  function ctl(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 64);
  }
  if (this.keyboard.terminal.passCtrlNumber && !e.shiftKey) {
    return hterm.Keyboard.KeyActions.PASS;
  }
  switch(keyDef.keyCap.substr(0, 1)) {
    case "1":
      return "1";
    case "2":
      return ctl("@");
    case "3":
      return ctl("[");
    case "4":
      return ctl("\\");
    case "5":
      return ctl("]");
    case "6":
      return ctl("^");
    case "7":
      return ctl("_");
    case "8":
      return "\u007f";
    case "9":
      return "9";
  }
};
hterm.Keyboard.KeyMap.prototype.onAltNum_ = function(e, keyDef) {
  return this.keyboard.terminal.passAltNumber && !e.shiftKey ? hterm.Keyboard.KeyActions.PASS : hterm.Keyboard.KeyActions.DEFAULT;
};
hterm.Keyboard.KeyMap.prototype.onMetaNum_ = function(e, keyDef) {
  return this.keyboard.terminal.passMetaNumber && !e.shiftKey ? hterm.Keyboard.KeyActions.PASS : hterm.Keyboard.KeyActions.DEFAULT;
};
hterm.Keyboard.KeyMap.prototype.onCtrlC_ = function(e, keyDef) {
  var selection = this.keyboard.terminal.getDocument().getSelection();
  if (!selection.isCollapsed) {
    if (this.keyboard.ctrlCCopy && !e.shiftKey) {
      return this.keyboard.terminal.clearSelectionAfterCopy && setTimeout(selection.collapseToEnd.bind(selection), 50), hterm.Keyboard.KeyActions.PASS;
    }
    if (!this.keyboard.ctrlCCopy && e.shiftKey) {
      return this.keyboard.terminal.clearSelectionAfterCopy && setTimeout(selection.collapseToEnd.bind(selection), 50), this.keyboard.terminal.copySelectionToClipboard(), hterm.Keyboard.KeyActions.CANCEL;
    }
  }
  return "\u0003";
};
hterm.Keyboard.KeyMap.prototype.onCtrlN_ = function(e, keyDef) {
  return e.shiftKey ? (lib.f.openWindow(document.location.href, "", "chrome=no,close=yes,resize=yes,scrollbars=yes,minimizable=yes,width=" + window.innerWidth + ",height=" + window.innerHeight), hterm.Keyboard.KeyActions.CANCEL) : "\u000e";
};
hterm.Keyboard.KeyMap.prototype.onCtrlV_ = function(e, keyDef) {
  return !e.shiftKey && this.keyboard.ctrlVPaste || e.shiftKey && !this.keyboard.ctrlVPaste ? this.keyboard.terminal.paste() ? hterm.Keyboard.KeyActions.CANCEL : hterm.Keyboard.KeyActions.PASS : "\u0016";
};
hterm.Keyboard.KeyMap.prototype.onMetaN_ = function(e, keyDef) {
  return e.shiftKey ? (lib.f.openWindow(document.location.href, "", "chrome=no,close=yes,resize=yes,scrollbars=yes,minimizable=yes,width=" + window.outerWidth + ",height=" + window.outerHeight), hterm.Keyboard.KeyActions.CANCEL) : hterm.Keyboard.KeyActions.DEFAULT;
};
hterm.Keyboard.KeyMap.prototype.onMetaC_ = function(e, keyDef) {
  var document = this.keyboard.terminal.getDocument();
  if (e.shiftKey || document.getSelection().isCollapsed) {
    return keyDef.keyCap.substr(e.shiftKey ? 1 : 0, 1);
  }
  this.keyboard.terminal.clearSelectionAfterCopy && setTimeout(function() {
    document.getSelection().collapseToEnd();
  }, 50);
  return hterm.Keyboard.KeyActions.PASS;
};
hterm.Keyboard.KeyMap.prototype.onMetaV_ = function(e, keyDef) {
  return e.shiftKey ? hterm.Keyboard.KeyActions.PASS : this.keyboard.passMetaV ? hterm.Keyboard.KeyActions.PASS : hterm.Keyboard.KeyActions.DEFAULT;
};
hterm.Keyboard.KeyMap.prototype.onPlusMinusZero_ = function(e, keyDef) {
  if (!(this.keyboard.ctrlPlusMinusZeroZoom ^ e.shiftKey)) {
    return "-_" == keyDef.keyCap ? "\u001f" : hterm.Keyboard.KeyActions.CANCEL;
  }
  if (1 != this.keyboard.terminal.getZoomFactor()) {
    return hterm.Keyboard.KeyActions.PASS;
  }
  var cap = keyDef.keyCap.substr(0, 1);
  if ("0" == cap) {
    this.keyboard.terminal.setFontSize(0);
  } else {
    var size = this.keyboard.terminal.getFontSize();
    size = "-" == cap || "[KP-]" == keyDef.keyCap ? size - 1 : size + 1;
    this.keyboard.terminal.setFontSize(size);
  }
  return hterm.Keyboard.KeyActions.CANCEL;
};
hterm.Keyboard.KeyPattern = function(spec) {
  this.wildcardCount = 0;
  this.keyCode = spec.keyCode;
  hterm.Keyboard.KeyPattern.modifiers.forEach(function(mod) {
    this[mod] = spec[mod] || !1;
    "*" == this[mod] && this.wildcardCount++;
  }.bind(this));
};
hterm.Keyboard.KeyPattern.modifiers = ["shift", "ctrl", "alt", "meta"];
hterm.Keyboard.KeyPattern.sortCompare = function(a, b) {
  return a.wildcardCount < b.wildcardCount ? -1 : a.wildcardCount > b.wildcardCount ? 1 : 0;
};
hterm.Keyboard.KeyPattern.prototype.match_ = function(obj, exactMatch) {
  if (this.keyCode != obj.keyCode) {
    return !1;
  }
  var rv = !0;
  hterm.Keyboard.KeyPattern.modifiers.forEach(function(mod) {
    var modValue = mod in obj ? obj[mod] : !1;
    rv && (exactMatch || "*" != this[mod]) && this[mod] != modValue && (rv = !1);
  }.bind(this));
  return rv;
};
hterm.Keyboard.KeyPattern.prototype.matchKeyDown = function(keyDown) {
  return this.match_(keyDown, !1);
};
hterm.Keyboard.KeyPattern.prototype.matchKeyPattern = function(keyPattern) {
  return this.match_(keyPattern, !0);
};
hterm.Options = function(opt_copy) {
  this.wraparound = opt_copy ? opt_copy.wraparound : !0;
  this.reverseWraparound = opt_copy ? opt_copy.reverseWraparound : !1;
  this.originMode = opt_copy ? opt_copy.originMode : !1;
  this.autoCarriageReturn = opt_copy ? opt_copy.autoCarriageReturn : !1;
  this.cursorVisible = opt_copy ? opt_copy.cursorVisible : !1;
  this.cursorBlink = opt_copy ? opt_copy.cursorBlink : !1;
  this.insertMode = opt_copy ? opt_copy.insertMode : !1;
  this.reverseVideo = opt_copy ? opt_copy.reverseVideo : !1;
  this.bracketedPaste = opt_copy ? opt_copy.bracketedPaste : !1;
};
lib.rtdep("hterm.Keyboard.KeyActions");
hterm.Parser = function() {
  this.source = "";
  this.pos = 0;
  this.ch = null;
};
hterm.Parser.prototype.error = function(message) {
  return Error("Parse error at " + this.pos + ": " + message);
};
hterm.Parser.prototype.isComplete = function() {
  return this.pos == this.source.length;
};
hterm.Parser.prototype.reset = function(source, opt_pos) {
  this.source = source;
  this.pos = opt_pos || 0;
  this.ch = source.substr(0, 1);
};
hterm.Parser.prototype.parseKeySequence = function() {
  var rv = {keyCode:null}, k;
  for (k in hterm.Parser.identifiers.modifierKeys) {
    rv[hterm.Parser.identifiers.modifierKeys[k]] = !1;
  }
  for (; this.pos < this.source.length;) {
    this.skipSpace();
    var token = this.parseToken();
    if ("integer" == token.type) {
      rv.keyCode = token.value;
    } else {
      if ("identifier" == token.type) {
        var ucValue = token.value.toUpperCase();
        if (ucValue in hterm.Parser.identifiers.modifierKeys && hterm.Parser.identifiers.modifierKeys.hasOwnProperty(ucValue)) {
          var mod = hterm.Parser.identifiers.modifierKeys[ucValue];
          if (rv[mod] && "*" != rv[mod]) {
            throw this.error("Duplicate modifier: " + token.value);
          }
          rv[mod] = !0;
        } else {
          if (ucValue in hterm.Parser.identifiers.keyCodes && hterm.Parser.identifiers.keyCodes.hasOwnProperty(ucValue)) {
            rv.keyCode = hterm.Parser.identifiers.keyCodes[ucValue];
          } else {
            throw this.error("Unknown key: " + token.value);
          }
        }
      } else {
        if ("symbol" == token.type) {
          if ("*" == token.value) {
            for (var id in hterm.Parser.identifiers.modifierKeys) {
              var p = hterm.Parser.identifiers.modifierKeys[id];
              rv[p] || (rv[p] = "*");
            }
          } else {
            throw this.error("Unexpected symbol: " + token.value);
          }
        } else {
          throw this.error("Expected integer or identifier");
        }
      }
    }
    this.skipSpace();
    if ("-" != this.ch) {
      break;
    }
    if (null != rv.keyCode) {
      throw this.error("Extra definition after target key");
    }
    this.advance(1);
  }
  if (null == rv.keyCode) {
    throw this.error("Missing target key");
  }
  return rv;
};
hterm.Parser.prototype.parseKeyAction = function() {
  this.skipSpace();
  var token = this.parseToken();
  if ("string" == token.type) {
    return token.value;
  }
  if ("identifier" == token.type) {
    if (token.value in hterm.Parser.identifiers.actions && hterm.Parser.identifiers.actions.hasOwnProperty(token.value)) {
      return hterm.Parser.identifiers.actions[token.value];
    }
    throw this.error("Unknown key action: " + token.value);
  }
  throw this.error("Expected string or identifier");
};
hterm.Parser.prototype.peekString = function() {
  return "'" == this.ch || '"' == this.ch;
};
hterm.Parser.prototype.peekIdentifier = function() {
  return this.ch.match(/[a-z_]/i);
};
hterm.Parser.prototype.peekInteger = function() {
  return this.ch.match(/[0-9]/);
};
hterm.Parser.prototype.parseToken = function() {
  if ("*" == this.ch) {
    var rv = {type:"symbol", value:this.ch};
    this.advance(1);
    return rv;
  }
  if (this.peekIdentifier()) {
    return {type:"identifier", value:this.parseIdentifier()};
  }
  if (this.peekString()) {
    return {type:"string", value:this.parseString()};
  }
  if (this.peekInteger()) {
    return {type:"integer", value:this.parseInteger()};
  }
  throw this.error("Unexpected token");
};
hterm.Parser.prototype.parseIdentifier = function() {
  if (!this.peekIdentifier()) {
    throw this.error("Expected identifier");
  }
  return this.parsePattern(/[a-z0-9_]+/ig);
};
hterm.Parser.prototype.parseInteger = function() {
  return "0" == this.ch && this.pos < this.source.length - 1 && "x" == this.source.substr(this.pos + 1, 1) ? parseInt(this.parsePattern(/0x[0-9a-f]+/gi)) : parseInt(this.parsePattern(/\d+/g));
};
hterm.Parser.prototype.parseString = function() {
  var result = "", quote = this.ch;
  if ('"' != quote && "'" != quote) {
    throw this.error("String expected");
  }
  this.advance(1);
  for (var re = new RegExp("[\\\\" + quote + "]", "g"); this.pos < this.source.length;) {
    re.lastIndex = this.pos;
    if (!re.exec(this.source)) {
      break;
    }
    result += this.source.substring(this.pos, re.lastIndex - 1);
    this.advance(re.lastIndex - this.pos - 1);
    if ('"' == quote && "\\" == this.ch) {
      this.advance(1), result += this.parseEscape();
    } else {
      if ("'" == quote && "\\" == this.ch) {
        result += this.ch, this.advance(1);
      } else {
        if (this.ch == quote) {
          return this.advance(1), result;
        }
      }
    }
  }
  throw this.error("Unterminated string literal");
};
hterm.Parser.prototype.parseEscape = function() {
  var map = {'"':'"', "'":"'", "\\":"\\", a:"\u0007", b:"\b", e:"\u001b", f:"\f", n:"\n", r:"\r", t:"\t", v:"\x0B", x:function() {
    var value = this.parsePattern(/[a-z0-9]{2}/ig);
    return String.fromCharCode(parseInt(value, 16));
  }, u:function() {
    var value = this.parsePattern(/[a-z0-9]{4}/ig);
    return String.fromCharCode(parseInt(value, 16));
  }};
  if (!(this.ch in map && map.hasOwnProperty(this.ch))) {
    throw this.error("Unknown escape: " + this.ch);
  }
  var value$jscomp$0 = map[this.ch];
  this.advance(1);
  "function" == typeof value$jscomp$0 && (value$jscomp$0 = value$jscomp$0.call(this));
  return value$jscomp$0;
};
hterm.Parser.prototype.parsePattern = function(pattern) {
  if (!pattern.global) {
    throw this.error("Internal error: Span patterns must be global");
  }
  pattern.lastIndex = this.pos;
  var ary = pattern.exec(this.source);
  if (!ary || pattern.lastIndex - ary[0].length != this.pos) {
    throw this.error("Expected match for: " + pattern);
  }
  this.pos = pattern.lastIndex - 1;
  this.advance(1);
  return ary[0];
};
hterm.Parser.prototype.advance = function(count) {
  this.pos += count;
  this.ch = this.source.substr(this.pos, 1);
};
hterm.Parser.prototype.skipSpace = function(opt_expect) {
  if (/\s/.test(this.ch)) {
    var re = /\s+/gm;
    re.lastIndex = this.pos;
    re.exec(this.source) && (this.pos = re.lastIndex);
    this.ch = this.source.substr(this.pos, 1);
    if (opt_expect && -1 == this.ch.indexOf(opt_expect)) {
      throw this.error("Expected one of " + opt_expect + ", found: " + this.ch);
    }
  }
};
hterm.Parser.identifiers = {};
hterm.Parser.identifiers.modifierKeys = {SHIFT:"shift", CTRL:"ctrl", CONTROL:"ctrl", ALT:"alt", META:"meta"};
hterm.Parser.identifiers.keyCodes = {ESCAPE:27, ESC:27, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, ZERO:48, BACKSPACE:8, BKSP:8, BS:8, TAB:9, Q:81, W:87, E:69, R:82, T:84, Y:89, U:85, I:73, O:79, P:80, CAPS_LOCK:20, CAPSLOCK:20, CAPS:20, A:65, S:83, D:68, F:70, G:71, H:72, J:74, K:75, L:76, ENTER:13, ENT:13, RETURN:13, RET:13, Z:90, X:88, C:67, V:86, B:66, N:78, 
M:77, SPACE:32, SP:32, PRINT_SCREEN:42, PRTSC:42, SCROLL_LOCK:145, SCRLK:145, BREAK:19, BRK:19, INSERT:45, INS:45, HOME:36, PAGE_UP:33, PGUP:33, DELETE:46, DEL:46, END:35, PAGE_DOWN:34, PGDOWN:34, PGDN:34, UP:38, DOWN:40, RIGHT:39, LEFT:37, NUMLOCK:144, KP0:96, KP1:97, KP2:98, KP3:99, KP4:100, KP5:101, KP6:102, KP7:103, KP8:104, KP9:105, KP_PLUS:107, KP_ADD:107, KP_MINUS:109, KP_SUBTRACT:109, KP_STAR:106, KP_MULTIPLY:106, KP_DIVIDE:111, KP_DECIMAL:110, KP_PERIOD:110, NAVIGATE_BACK:166, NAVIGATE_FORWARD:167, 
RELOAD:168, FULL_SCREEN:183, WINDOW_OVERVIEW:182, BRIGHTNESS_UP:216, BRIGHTNESS_DOWN:217};
hterm.Parser.identifiers.actions = {CANCEL:hterm.Keyboard.KeyActions.CANCEL, DEFAULT:hterm.Keyboard.KeyActions.DEFAULT, PASS:hterm.Keyboard.KeyActions.PASS, scrollLineUp:function(terminal) {
  terminal.scrollLineUp();
  return hterm.Keyboard.KeyActions.CANCEL;
}, scrollLineDown:function(terminal) {
  terminal.scrollLineDown();
  return hterm.Keyboard.KeyActions.CANCEL;
}, scrollPageUp:function(terminal) {
  terminal.scrollPageUp();
  return hterm.Keyboard.KeyActions.CANCEL;
}, scrollPageDown:function(terminal) {
  terminal.scrollPageDown();
  return hterm.Keyboard.KeyActions.CANCEL;
}, scrollToTop:function(terminal) {
  terminal.scrollHome();
  return hterm.Keyboard.KeyActions.CANCEL;
}, scrollToBottom:function(terminal) {
  terminal.scrollEnd();
  return hterm.Keyboard.KeyActions.CANCEL;
}, clearScreen:function(terminal) {
  terminal.clearHome();
  return hterm.Keyboard.KeyActions.CANCEL;
}, clearScrollback:function(terminal) {
  terminal.clearScrollback();
  return hterm.Keyboard.KeyActions.CANCEL;
}, clearTerminal:function(terminal) {
  terminal.wipeContents();
  return hterm.Keyboard.KeyActions.CANCEL;
}, fullReset:function(terminal) {
  terminal.reset();
  return hterm.Keyboard.KeyActions.CANCEL;
}, softReset:function(terminal) {
  terminal.softReset();
  return hterm.Keyboard.KeyActions.CANCEL;
}, };
lib.rtdep("lib.f", "lib.Storage");
hterm.PreferenceManager = function(profileId) {
  var $jscomp$this = this;
  lib.PreferenceManager.call(this, hterm.defaultStorage, hterm.PreferenceManager.prefix_ + profileId);
  Object.entries(hterm.PreferenceManager.defaultPreferences).forEach(function($jscomp$destructuring$var2) {
    var $jscomp$destructuring$var3 = $jscomp.makeIterator($jscomp$destructuring$var2), key = $jscomp$destructuring$var3.next().value, entry = $jscomp$destructuring$var3.next().value;
    $jscomp$this.definePreference(key, entry["default"]);
  });
};
hterm.PreferenceManager.prefix_ = "/hterm/profiles/";
hterm.PreferenceManager.listProfiles = function(callback) {
  hterm.defaultStorage.getItems(null, function(items) {
    for (var profiles = {}, $jscomp$iter$2 = $jscomp.makeIterator(Object.keys(items)), $jscomp$key$key = $jscomp$iter$2.next(); !$jscomp$key$key.done; $jscomp$key$key = $jscomp$iter$2.next()) {
      var key = $jscomp$key$key.value;
      if (key.startsWith(hterm.PreferenceManager.prefix_)) {
        var subKey = key.slice(hterm.PreferenceManager.prefix_.length);
        profiles[subKey.split("/", 1)[0]] = !0;
      }
    }
    callback(Object.keys(profiles));
  });
};
hterm.PreferenceManager.categories = {};
hterm.PreferenceManager.categories.Keyboard = "Keyboard";
hterm.PreferenceManager.categories.Appearance = "Appearance";
hterm.PreferenceManager.categories.CopyPaste = "CopyPaste";
hterm.PreferenceManager.categories.Sounds = "Sounds";
hterm.PreferenceManager.categories.Scrolling = "Scrolling";
hterm.PreferenceManager.categories.Encoding = "Encoding";
hterm.PreferenceManager.categories.Extensions = "Extensions";
hterm.PreferenceManager.categories.Miscellaneous = "Miscellaneous";
hterm.PreferenceManager.categoryDefinitions = [{id:hterm.PreferenceManager.categories.Appearance, text:"Appearance (fonts, colors, images)"}, {id:hterm.PreferenceManager.categories.CopyPaste, text:"Copy & Paste"}, {id:hterm.PreferenceManager.categories.Encoding, text:"Encoding"}, {id:hterm.PreferenceManager.categories.Keyboard, text:"Keyboard"}, {id:hterm.PreferenceManager.categories.Scrolling, text:"Scrolling"}, {id:hterm.PreferenceManager.categories.Sounds, text:"Sounds"}, {id:hterm.PreferenceManager.categories.Extensions, 
text:"Extensions"}, {id:hterm.PreferenceManager.categories.Miscellaneous, text:"Miscellaneous"}];
hterm.PreferenceManager.definePref_ = function(name, category, defaultValue, type, help) {
  return {name:name, category:category, "default":defaultValue, type:type, help:help, };
};
hterm.PreferenceManager.defaultPreferences = {"alt-gr-mode":hterm.PreferenceManager.definePref_("AltGr key mode", hterm.PreferenceManager.categories.Keyboard, null, [null, "none", "ctrl-alt", "left-alt", "right-alt"], "Select an AltGr detection heuristic.\n\n'null': Autodetect based on navigator.language:\n      'en-us' => 'none', else => 'right-alt'\n'none': Disable any AltGr related munging.\n'ctrl-alt': Assume Ctrl+Alt means AltGr.\n'left-alt': Assume left Alt means AltGr.\n'right-alt': Assume right Alt means AltGr."), 
"alt-backspace-is-meta-backspace":hterm.PreferenceManager.definePref_("Alt-Backspace is Meta-Backspace", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "If set, undoes the Chrome OS Alt-Backspace->DEL remap, so that Alt-Backspace indeed is Alt-Backspace."), "alt-is-meta":hterm.PreferenceManager.definePref_("Treat Alt key as Meta key", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "Whether the Alt key acts as a Meta key or as a distinct Alt key."), "alt-sends-what":hterm.PreferenceManager.definePref_("Alt key modifier handling", 
hterm.PreferenceManager.categories.Keyboard, "escape", ["escape", "8-bit", "browser-key"], "Controls how the Alt key is handled.\n\n  escape: Send an ESC prefix.\n  8-bit: Add 128 to the typed character as in xterm.\n  browser-key: Wait for the keypress event and see what the browser\n    says. (This won't work well on platforms where the browser\n    performs a default action for some Alt sequences.)"), "audible-bell-sound":hterm.PreferenceManager.definePref_("Alert bell sound (URI)", hterm.PreferenceManager.categories.Sounds, 
"lib-resource:hterm/audio/bell", "url", "URL of the terminal bell sound. Empty string for no audible bell."), "desktop-notification-bell":hterm.PreferenceManager.definePref_("Create desktop notifications for alert bells", hterm.PreferenceManager.categories.Sounds, !1, "bool", 'If true, terminal bells in the background will create a Web Notification. https://www.w3.org/TR/notifications/\n\nDisplaying notifications requires permission from the user. When this option is set to true, hterm will attempt to ask the user for permission if necessary. Browsers may not show this permission request if it was not triggered by a user action.\n\nChrome extensions with the "notifications" permission have permission to display notifications.'), 
"background-color":hterm.PreferenceManager.definePref_("Background color", hterm.PreferenceManager.categories.Appearance, "rgb(16, 16, 16)", "color", "The background color for text with no other color attributes."), "background-image":hterm.PreferenceManager.definePref_("Background image", hterm.PreferenceManager.categories.Appearance, "", "string", "CSS value of the background image. Empty string for no image.\n\nFor example:\n  url(https://goo.gl/anedTK)\n  linear-gradient(top bottom, blue, red)"), 
"background-size":hterm.PreferenceManager.definePref_("Background image size", hterm.PreferenceManager.categories.Appearance, "", "string", "CSS value of the background image size."), "background-position":hterm.PreferenceManager.definePref_("Background image position", hterm.PreferenceManager.categories.Appearance, "", "string", "CSS value of the background image position.\n\nFor example:\n  10% 10%\n  center"), "backspace-sends-backspace":hterm.PreferenceManager.definePref_("Backspace key behavior", 
hterm.PreferenceManager.categories.Keyboard, !1, "bool", "If true, the backspace should send BS ('\\x08', aka ^H). Otherwise the backspace key should send '\\x7f'."), "character-map-overrides":hterm.PreferenceManager.definePref_("Character map overrides", hterm.PreferenceManager.categories.Appearance, null, "value", 'This is specified as an object. It is a sparse array, where each property is the character set code and the value is an object that is a sparse array itself. In that sparse array, each property is the received character and the value is the displayed character.\n\nFor example:\n  {"0":{"+":"\\u2192",",":"\\u2190","-":"\\u2191",".":"\\u2193", "0":"\\u2588"}}'), 
"close-on-exit":hterm.PreferenceManager.definePref_("Close window on exit", hterm.PreferenceManager.categories.Miscellaneous, !0, "bool", "Whether to close the window when the command finishes executing."), "cursor-blink":hterm.PreferenceManager.definePref_("Cursor blink", hterm.PreferenceManager.categories.Appearance, !1, "bool", "Whether the text cursor blinks by default. This can be toggled at runtime via terminal escape sequences."), "cursor-blink-cycle":hterm.PreferenceManager.definePref_("Cursor blink rate", 
hterm.PreferenceManager.categories.Appearance, [1000, 500], "value", "The text cursor blink rate in milliseconds.\n\nA two element array, the first of which is how long the text cursor should be on, second is how long it should be off."), "cursor-color":hterm.PreferenceManager.definePref_("Text cursor color", hterm.PreferenceManager.categories.Appearance, "rgba(255, 0, 0, 0.5)", "color", "The color of the visible text cursor."), "color-palette-overrides":hterm.PreferenceManager.definePref_("Initial color palette", 
hterm.PreferenceManager.categories.Appearance, null, "value", 'Override colors in the default palette.\n\nThis can be specified as an array or an object. If specified as an object it is assumed to be a sparse array, where each property is a numeric index into the color palette.\n\nValues can be specified as almost any CSS color value. This includes #RGB, #RRGGBB, rgb(...), rgba(...), and any color names that are also part of the standard X11 rgb.txt file.\n\nYou can use \'null\' to specify that the default value should be not be changed. This is useful for skipping a small number of indices when the value is specified as an array.\n\nFor example, these both set color index 1 to blue:\n  {1: "#0000ff"}\n  [null, "#0000ff"]'), 
"copy-on-select":hterm.PreferenceManager.definePref_("Automatically copy selected content", hterm.PreferenceManager.categories.CopyPaste, !0, "bool", "Automatically copy mouse selection to the clipboard."), "use-default-window-copy":hterm.PreferenceManager.definePref_("Let the browser handle text copying", hterm.PreferenceManager.categories.CopyPaste, !1, "bool", "Whether to use the default browser/OS's copy behavior.\n\nAllow the browser/OS to handle the copy event directly which might improve compatibility with some systems (where copying doesn't work at all), but makes the text selection less robust.\n\nFor example, long lines that were automatically line wrapped will be copied with the newlines still in them."), 
"clear-selection-after-copy":hterm.PreferenceManager.definePref_("Automatically clear text selection", hterm.PreferenceManager.categories.CopyPaste, !0, "bool", "Whether to clear the selection after copying."), "ctrl-plus-minus-zero-zoom":hterm.PreferenceManager.definePref_("Ctrl-+/-/0 zoom behavior", hterm.PreferenceManager.categories.Keyboard, !0, "bool", "If true, Ctrl-Plus/Minus/Zero controls zoom.\nIf false, Ctrl-Shift-Plus/Minus/Zero controls zoom, Ctrl-Minus sends ^_, Ctrl-Plus/Zero do nothing."), 
"ctrl-c-copy":hterm.PreferenceManager.definePref_("Ctrl-C copy behavior", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "Ctrl-C copies if true, send ^C to host if false.\nCtrl-Shift-C sends ^C to host if true, copies if false."), "ctrl-v-paste":hterm.PreferenceManager.definePref_("Ctrl-V paste behavior", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "Ctrl-V pastes if true, send ^V to host if false.\nCtrl-Shift-V sends ^V to host if true, pastes if false."), "east-asian-ambiguous-as-two-column":hterm.PreferenceManager.definePref_("East Asian Ambiguous use two columns", 
hterm.PreferenceManager.categories.Keyboard, !1, "bool", "Whether East Asian Ambiguous characters have two column width."), "enable-8-bit-control":hterm.PreferenceManager.definePref_("Support non-UTF-8 C1 control characters", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "True to enable 8-bit control characters, false to ignore them.\n\nWe'll respect the two-byte versions of these control characters regardless of this setting."), "enable-bold":hterm.PreferenceManager.definePref_("Bold text behavior", 
hterm.PreferenceManager.categories.Appearance, null, "tristate", "If true, use bold weight font for text with the bold/bright attribute. False to use the normal weight font. Null to autodetect."), "enable-bold-as-bright":hterm.PreferenceManager.definePref_("Use bright colors with bold text", hterm.PreferenceManager.categories.Appearance, !0, "bool", "If true, use bright colors (8-15 on a 16 color palette) for any text with the bold attribute. False otherwise."), "enable-blink":hterm.PreferenceManager.definePref_("Enable blinking text", 
hterm.PreferenceManager.categories.Appearance, !0, "bool", "If true, respect the blink attribute. False to ignore it."), "enable-clipboard-notice":hterm.PreferenceManager.definePref_("Show notification when copying content", hterm.PreferenceManager.categories.CopyPaste, !0, "bool", "Whether to show a message in the terminal when the host writes to the clipboard."), "enable-clipboard-write":hterm.PreferenceManager.definePref_("Allow remote clipboard writes", hterm.PreferenceManager.categories.CopyPaste, 
!0, "bool", "Allow the remote host to write directly to the local system clipboard.\nRead access is never granted regardless of this setting.\n\nThis is used to control access to features like OSC-52."), "enable-dec12":hterm.PreferenceManager.definePref_("Allow changing of text cursor blinking", hterm.PreferenceManager.categories.Miscellaneous, !1, "bool", "Respect the host's attempt to change the text cursor blink status using DEC Private Mode 12."), "enable-csi-j-3":hterm.PreferenceManager.definePref_("Allow clearing of scrollback buffer (CSI-J-3)", 
hterm.PreferenceManager.categories.Miscellaneous, !0, "bool", "Whether CSI-J (Erase Display) mode 3 may clear the terminal scrollback buffer.\n\nEnabling this by default is safe."), environment:hterm.PreferenceManager.definePref_("Environment variables", hterm.PreferenceManager.categories.Miscellaneous, {NCURSES_NO_UTF8_ACS:"1", TERM:"xterm-256color", COLORTERM:"truecolor", }, "value", "The initial set of environment variables, as an object."), "font-family":hterm.PreferenceManager.definePref_("Text font family", 
hterm.PreferenceManager.categories.Appearance, '"DejaVu Sans Mono", "Noto Sans Mono", "Everson Mono", FreeMono, Menlo, Terminal, monospace', "string", "Default font family for the terminal text."), "font-size":hterm.PreferenceManager.definePref_("Text font size", hterm.PreferenceManager.categories.Appearance, 15, "int", "The default font size in pixels."), "font-smoothing":hterm.PreferenceManager.definePref_("Text font smoothing", hterm.PreferenceManager.categories.Appearance, "antialiased", "string", 
"CSS font-smoothing property."), "foreground-color":hterm.PreferenceManager.definePref_("Text color", hterm.PreferenceManager.categories.Appearance, "rgb(240, 240, 240)", "color", "The foreground color for text with no other color attributes."), "hide-mouse-while-typing":hterm.PreferenceManager.definePref_("Hide mouse cursor while typing", hterm.PreferenceManager.categories.Keyboard, null, "tristate", "Whether to automatically hide the mouse cursor when typing. By default, autodetect whether the platform/OS handles this.\n\nNote: Some operating systems may override this setting and thus you might not be able to always disable it."), 
"home-keys-scroll":hterm.PreferenceManager.definePref_("Home/End key scroll behavior", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "If true, Home/End controls the terminal scrollbar and Shift-Home/Shift-End are sent to the remote host. If false, then Home/End are sent to the remote host and Shift-Home/Shift-End scrolls."), keybindings:hterm.PreferenceManager.definePref_("Keyboard bindings/shortcuts", hterm.PreferenceManager.categories.Keyboard, null, "value", 'A map of key sequence to key actions. Key sequences include zero or more modifier keys followed by a key code. Key codes can be decimal or hexadecimal numbers, or a key identifier. Key actions can be specified as a string to send to the host, or an action identifier. For a full explanation of the format, see https://goo.gl/LWRndr.\n\nSample keybindings:\n{\n  "Ctrl-Alt-K": "clearTerminal",\n  "Ctrl-Shift-L": "PASS",\n  "Ctrl-H": "\'Hello World\'"\n}'), 
"media-keys-are-fkeys":hterm.PreferenceManager.definePref_("Media keys are Fkeys", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "If true, convert media keys to their Fkey equivalent. If false, let the browser handle the keys."), "meta-sends-escape":hterm.PreferenceManager.definePref_("Meta key modifier handling", hterm.PreferenceManager.categories.Keyboard, !0, "bool", "Send an ESC prefix when pressing a key while holding the Meta key.\n\nFor example, when enabled, pressing Meta-K will send ^[k as if you typed Escape then k. When disabled, only k will be sent."), 
"mouse-right-click-paste":hterm.PreferenceManager.definePref_("Mouse right clicks paste content", hterm.PreferenceManager.categories.CopyPaste, !0, "bool", 'Paste on right mouse button clicks.\n\nThis option is independent of the "mouse-paste-button" setting.\n\nNote: This will handle left & right handed mice correctly.'), "mouse-paste-button":hterm.PreferenceManager.definePref_("Mouse button paste", hterm.PreferenceManager.categories.CopyPaste, null, [null, 0, 1, 2, 3, 4, 5, 6], "Mouse paste button, or null to autodetect.\n\nFor autodetect, we'll use the middle mouse button for non-X11 platforms (including Chrome OS). On X11, we'll use the right mouse button (since the native window manager should paste via the middle mouse button).\n\n0 == left (primary) button.\n1 == middle (auxiliary) button.\n2 == right (secondary) button.\n\nThis option is independent of the setting for right-click paste.\n\nNote: This will handle left & right handed mice correctly."), 
"word-break-match-left":hterm.PreferenceManager.definePref_("Automatic selection halting (to the left)", hterm.PreferenceManager.categories.CopyPaste, "[^\\s\\[\\](){}<>\"'\\^!@#$%&*,;:`]", "string", 'Regular expression to halt matching to the left (start) of a selection.\n\nNormally this is a character class to reject specific characters.\nWe allow "~" and "." by default as paths frequently start with those.'), "word-break-match-right":hterm.PreferenceManager.definePref_("Automatic selection halting (to the right)", 
hterm.PreferenceManager.categories.CopyPaste, "[^\\s\\[\\](){}<>\"'\\^!@#$%&*,;:~.`]", "string", "Regular expression to halt matching to the right (end) of a selection.\n\nNormally this is a character class to reject specific characters."), "word-break-match-middle":hterm.PreferenceManager.definePref_("Word break characters", hterm.PreferenceManager.categories.CopyPaste, "[^\\s\\[\\](){}<>\"'\\^]*", "string", "Regular expression to match all the characters in the middle.\n\nNormally this is a character class to reject specific characters.\n\nUsed to expand the selection surrounding the starting point."), 
"page-keys-scroll":hterm.PreferenceManager.definePref_("Page Up/Down key scroll behavior", hterm.PreferenceManager.categories.Keyboard, !1, "bool", "If true, Page Up/Page Down controls the terminal scrollbar and Shift-Page Up/Shift-Page Down are sent to the remote host. If false, then Page Up/Page Down are sent to the remote host and Shift-Page Up/Shift-Page Down scrolls."), "pass-alt-number":hterm.PreferenceManager.definePref_("Pass Alt-1..9 key behavior", hterm.PreferenceManager.categories.Keyboard, 
null, "tristate", "Whether Alt-1..9 is passed to the browser.\n\nThis is handy when running hterm in a browser tab, so that you don't lose Chrome's \"switch to tab\" keyboard accelerators. When not running in a tab it's better to send these keys to the host so they can be used in vim or emacs.\n\nIf true, Alt-1..9 will be handled by the browser. If false, Alt-1..9 will be sent to the host. If null, autodetect based on browser platform and window type."), "pass-ctrl-number":hterm.PreferenceManager.definePref_("Pass Ctrl-1..9 key behavior", 
hterm.PreferenceManager.categories.Keyboard, null, "tristate", "Whether Ctrl-1..9 is passed to the browser.\n\nThis is handy when running hterm in a browser tab, so that you don't lose Chrome's \"switch to tab\" keyboard accelerators. When not running in a tab it's better to send these keys to the host so they can be used in vim or emacs.\n\nIf true, Ctrl-1..9 will be handled by the browser. If false, Ctrl-1..9 will be sent to the host. If null, autodetect based on browser platform and window type."), 
"pass-meta-number":hterm.PreferenceManager.definePref_("Pass Meta-1..9 key behavior", hterm.PreferenceManager.categories.Keyboard, null, "tristate", "Whether Meta-1..9 is passed to the browser.\n\nThis is handy when running hterm in a browser tab, so that you don't lose Chrome's \"switch to tab\" keyboard accelerators. When not running in a tab it's better to send these keys to the host so they can be used in vim or emacs.\n\nIf true, Meta-1..9 will be handled by the browser. If false, Meta-1..9 will be sent to the host. If null, autodetect based on browser platform and window type."), 
"pass-meta-v":hterm.PreferenceManager.definePref_("Pass Meta-V key behavior", hterm.PreferenceManager.categories.Keyboard, !0, "bool", "Whether Meta-V gets passed to host."), "paste-on-drop":hterm.PreferenceManager.definePref_("Allow drag & drop to paste", hterm.PreferenceManager.categories.CopyPaste, !0, "bool", "If true, Drag and dropped text will paste into terminal.\nIf false, dropped text will be ignored."), "receive-encoding":hterm.PreferenceManager.definePref_("Receive encoding", hterm.PreferenceManager.categories.Encoding, 
"utf-8", ["utf-8", "raw"], "Set the expected encoding for data received from the host.\nIf the encodings do not match, visual bugs are likely to be observed.\n\nValid values are 'utf-8' and 'raw'."), "scroll-on-keystroke":hterm.PreferenceManager.definePref_("Scroll to bottom after keystroke", hterm.PreferenceManager.categories.Scrolling, !0, "bool", "Whether to scroll to the bottom on any keystroke."), "scroll-on-output":hterm.PreferenceManager.definePref_("Scroll to bottom after new output", hterm.PreferenceManager.categories.Scrolling, 
!1, "bool", "Whether to scroll to the bottom on terminal output."), "scrollbar-visible":hterm.PreferenceManager.definePref_("Scrollbar visibility", hterm.PreferenceManager.categories.Scrolling, !0, "bool", "The vertical scrollbar mode."), "scroll-wheel-may-send-arrow-keys":hterm.PreferenceManager.definePref_("Emulate arrow keys with scroll wheel", hterm.PreferenceManager.categories.Scrolling, !1, "bool", "When using the alternative screen buffer, and DECCKM (Application Cursor Keys) is active, mouse wheel scroll events will emulate arrow keys.\n\nIt can be temporarily disabled by holding the Shift key.\n\nThis frequently comes up when using pagers (less) or reading man pages or text editors (vi/nano) or using screen/tmux."), 
"scroll-wheel-move-multiplier":hterm.PreferenceManager.definePref_("Mouse scroll wheel multiplier", hterm.PreferenceManager.categories.Scrolling, 1, "int", "The multiplier for scroll wheel events when measured in pixels.\n\nAlters how fast the page scrolls."), "send-encoding":hterm.PreferenceManager.definePref_("Transmit encoding", hterm.PreferenceManager.categories.Encoding, "utf-8", ["utf-8", "raw"], "Set the encoding for data sent to host."), "terminal-encoding":hterm.PreferenceManager.definePref_("Terminal encoding", 
hterm.PreferenceManager.categories.Encoding, "utf-8", ["iso-2022", "utf-8", "utf-8-locked"], "The default terminal encoding (DOCS).\n\nISO-2022 enables character map translations (like graphics maps).\nUTF-8 disables support for those.\n\nThe locked variant means the encoding cannot be changed at runtime via terminal escape sequences.\n\nYou should stick with UTF-8 unless you notice broken rendering with legacy applications."), "shift-insert-paste":hterm.PreferenceManager.definePref_("Shift-Insert paste", 
hterm.PreferenceManager.categories.Keyboard, !0, "bool", "Whether Shift-Insert is used for pasting or is sent to the remote host."), "user-css":hterm.PreferenceManager.definePref_("Custom CSS (URI)", hterm.PreferenceManager.categories.Appearance, "", "url", "URL of user stylesheet to include in the terminal document."), "user-css-text":hterm.PreferenceManager.definePref_("Custom CSS (inline text)", hterm.PreferenceManager.categories.Appearance, "", "multiline-string", "Custom CSS text for styling the terminal."), 
"allow-images-inline":hterm.PreferenceManager.definePref_("Allow inline image display", hterm.PreferenceManager.categories.Extensions, null, "tristate", "Whether to allow the remote host to display images in the terminal.\n\nBy default, we prompt until a choice is made."), };
hterm.PreferenceManager.prototype = Object.create(lib.PreferenceManager.prototype);
hterm.PreferenceManager.constructor = hterm.PreferenceManager;
hterm.PubSub = function() {
  this.observers_ = {};
};
hterm.PubSub.addBehavior = function(obj) {
  var pubsub = new hterm.PubSub, m;
  for (m in hterm.PubSub.prototype) {
    obj[m] = hterm.PubSub.prototype[m].bind(pubsub);
  }
};
hterm.PubSub.prototype.subscribe = function(subject, callback) {
  subject in this.observers_ || (this.observers_[subject] = []);
  this.observers_[subject].push(callback);
};
hterm.PubSub.prototype.unsubscribe = function(subject, callback) {
  var list = this.observers_[subject];
  if (!list) {
    throw "Invalid subject: " + subject;
  }
  var i = list.indexOf(callback);
  if (0 > i) {
    throw "Not subscribed: " + subject;
  }
  list.splice(i, 1);
};
hterm.PubSub.prototype.publish = function(subject, e, opt_lastCallback) {
  function notifyList(i) {
    i < list.length - 1 && setTimeout(notifyList, 0, i + 1);
    list[i](e);
  }
  var list = this.observers_[subject];
  list && (list = [].concat(list));
  opt_lastCallback && (list ? list.push(opt_lastCallback) : list = [opt_lastCallback]);
  list && setTimeout(notifyList, 0, 0);
};
lib.rtdep("lib.f", "lib.wc", "hterm.RowCol", "hterm.Size", "hterm.TextAttributes");
hterm.Screen = function(opt_columnCount) {
  this.rowsArray = [];
  this.columnCount_ = opt_columnCount || 80;
  this.textAttributes = new hterm.TextAttributes(window.document);
  this.cursorPosition = new hterm.RowCol(0, 0);
  this.cursorState_ = new hterm.Screen.CursorState(this);
  this.wordBreakMatchMiddle = this.wordBreakMatchRight = this.wordBreakMatchLeft = this.cursorOffset_ = this.cursorNode_ = this.cursorRowNode_ = null;
};
hterm.Screen.prototype.getSize = function() {
  return new hterm.Size(this.columnCount_, this.rowsArray.length);
};
hterm.Screen.prototype.getHeight = function() {
  return this.rowsArray.length;
};
hterm.Screen.prototype.getWidth = function() {
  return this.columnCount_;
};
hterm.Screen.prototype.setColumnCount = function(count) {
  this.columnCount_ = count;
  this.cursorPosition.column >= count && this.setCursorPosition(this.cursorPosition.row, count - 1);
};
hterm.Screen.prototype.shiftRow = function() {
  return this.shiftRows(1)[0];
};
hterm.Screen.prototype.shiftRows = function(count) {
  return this.rowsArray.splice(0, count);
};
hterm.Screen.prototype.unshiftRow = function(row) {
  this.rowsArray.splice(0, 0, row);
};
hterm.Screen.prototype.unshiftRows = function(rows) {
  this.rowsArray.unshift.apply(this.rowsArray, rows);
};
hterm.Screen.prototype.popRow = function() {
  return this.popRows(1)[0];
};
hterm.Screen.prototype.popRows = function(count) {
  return this.rowsArray.splice(this.rowsArray.length - count, count);
};
hterm.Screen.prototype.pushRow = function(row) {
  this.rowsArray.push(row);
};
hterm.Screen.prototype.pushRows = function(rows) {
  rows.push.apply(this.rowsArray, rows);
};
hterm.Screen.prototype.insertRow = function(index, row) {
  this.rowsArray.splice(index, 0, row);
};
hterm.Screen.prototype.insertRows = function(index, rows) {
  for (var i = 0; i < rows.length; i++) {
    this.rowsArray.splice(index + i, 0, rows[i]);
  }
};
hterm.Screen.prototype.removeRow = function(index) {
  return this.rowsArray.splice(index, 1)[0];
};
hterm.Screen.prototype.removeRows = function(index, count) {
  return this.rowsArray.splice(index, count);
};
hterm.Screen.prototype.invalidateCursorPosition = function() {
  this.cursorPosition.move(0, 0);
  this.cursorOffset_ = this.cursorNode_ = this.cursorRowNode_ = null;
};
hterm.Screen.prototype.clearCursorRow = function() {
  this.cursorRowNode_.innerHTML = "";
  this.cursorRowNode_.removeAttribute("line-overflow");
  this.cursorOffset_ = 0;
  this.cursorPosition.column = 0;
  this.cursorPosition.overflow = !1;
  var text = this.textAttributes.isDefault() ? "" : lib.f.getWhitespace(this.columnCount_);
  var inverse = this.textAttributes.inverse;
  this.textAttributes.inverse = !1;
  this.textAttributes.syncColors();
  var node = this.textAttributes.createContainer(text);
  this.cursorRowNode_.appendChild(node);
  this.cursorNode_ = node;
  this.textAttributes.inverse = inverse;
  this.textAttributes.syncColors();
};
hterm.Screen.prototype.commitLineOverflow = function() {
  this.cursorRowNode_.setAttribute("line-overflow", !0);
};
hterm.Screen.prototype.setCursorPosition = function(row, column) {
  if (this.rowsArray.length) {
    row >= this.rowsArray.length ? (console.error("Row out of bounds: " + row), row = this.rowsArray.length - 1) : 0 > row && (console.error("Row out of bounds: " + row), row = 0);
    column >= this.columnCount_ ? (console.error("Column out of bounds: " + column), column = this.columnCount_ - 1) : 0 > column && (console.error("Column out of bounds: " + column), column = 0);
    this.cursorPosition.overflow = !1;
    var rowNode = this.rowsArray[row], node = rowNode.firstChild;
    node || (node = rowNode.ownerDocument.createTextNode(""), rowNode.appendChild(node));
    var currentColumn = 0;
    rowNode == this.cursorRowNode_ ? column >= this.cursorPosition.column - this.cursorOffset_ && (node = this.cursorNode_, currentColumn = this.cursorPosition.column - this.cursorOffset_) : this.cursorRowNode_ = rowNode;
    for (this.cursorPosition.move(row, column); node;) {
      var offset = column - currentColumn, width = hterm.TextAttributes.nodeWidth(node);
      if (!node.nextSibling || width > offset) {
        this.cursorNode_ = node;
        this.cursorOffset_ = offset;
        break;
      }
      currentColumn += width;
      node = node.nextSibling;
    }
  } else {
    console.warn("Attempt to set cursor position on empty screen.");
  }
};
hterm.Screen.prototype.syncSelectionCaret = function(selection) {
  try {
    selection.collapse(this.cursorNode_, this.cursorOffset_);
  } catch (firefoxIgnoredException) {
  }
};
hterm.Screen.prototype.splitNode_ = function(node, offset) {
  var afterNode = node.cloneNode(!1), textContent = node.textContent;
  node.textContent = hterm.TextAttributes.nodeSubstr(node, 0, offset);
  afterNode.textContent = lib.wc.substr(textContent, offset);
  afterNode.textContent && node.parentNode.insertBefore(afterNode, node.nextSibling);
  node.textContent || node.parentNode.removeChild(node);
};
hterm.Screen.prototype.maybeClipCurrentRow = function() {
  var width = hterm.TextAttributes.nodeWidth(this.cursorRowNode_);
  if (width <= this.columnCount_) {
    this.cursorPosition.column >= this.columnCount_ && (this.setCursorPosition(this.cursorPosition.row, this.columnCount_ - 1), this.cursorPosition.overflow = !0);
  } else {
    var currentColumn = this.cursorPosition.column;
    this.setCursorPosition(this.cursorPosition.row, this.columnCount_ - 1);
    width = hterm.TextAttributes.nodeWidth(this.cursorNode_);
    this.cursorOffset_ < width - 1 && (this.cursorNode_.textContent = hterm.TextAttributes.nodeSubstr(this.cursorNode_, 0, this.cursorOffset_ + 1));
    for (var rowNode = this.cursorRowNode_, node = this.cursorNode_.nextSibling; node;) {
      rowNode.removeChild(node), node = this.cursorNode_.nextSibling;
    }
    currentColumn < this.columnCount_ ? this.setCursorPosition(this.cursorPosition.row, currentColumn) : this.cursorPosition.overflow = !0;
  }
};
hterm.Screen.prototype.insertString = function(str, wcwidth) {
  var cursorNode = this.cursorNode_, cursorNodeText = cursorNode.textContent;
  this.cursorRowNode_.removeAttribute("line-overflow");
  void 0 === wcwidth && (wcwidth = lib.wc.strWidth(str));
  this.cursorPosition.column += wcwidth;
  var offset = this.cursorOffset_, reverseOffset = hterm.TextAttributes.nodeWidth(cursorNode) - offset;
  if (0 > reverseOffset) {
    var ws = lib.f.getWhitespace(-reverseOffset);
    if (this.textAttributes.underline || this.textAttributes.strikethrough || this.textAttributes.background || this.textAttributes.wcNode || !this.textAttributes.asciiNode || null != this.textAttributes.tileData) {
      if (cursorNode.nodeType != Node.TEXT_NODE && (cursorNode.wcNode || !cursorNode.asciiNode || cursorNode.tileNode || cursorNode.style.textDecoration || cursorNode.style.textDecorationStyle || cursorNode.style.textDecorationLine || cursorNode.style.backgroundColor)) {
        var wsNode = cursorNode.ownerDocument.createTextNode(ws);
        this.cursorRowNode_.insertBefore(wsNode, cursorNode.nextSibling);
        this.cursorNode_ = cursorNode = wsNode;
        this.cursorOffset_ = offset = -reverseOffset;
        cursorNodeText = ws;
      } else {
        cursorNode.textContent = cursorNodeText += ws;
      }
    } else {
      str = ws + str;
    }
    reverseOffset = 0;
  }
  if (this.textAttributes.matchesContainer(cursorNode)) {
    cursorNode.textContent = 0 == reverseOffset ? cursorNodeText + str : 0 == offset ? str + cursorNodeText : hterm.TextAttributes.nodeSubstr(cursorNode, 0, offset) + str + hterm.TextAttributes.nodeSubstr(cursorNode, offset), this.cursorOffset_ += wcwidth;
  } else {
    if (0 == offset) {
      var previousSibling = cursorNode.previousSibling;
      if (previousSibling && this.textAttributes.matchesContainer(previousSibling)) {
        previousSibling.textContent += str, this.cursorNode_ = previousSibling, this.cursorOffset_ = lib.wc.strWidth(previousSibling.textContent);
      } else {
        var newNode = this.textAttributes.createContainer(str);
        this.cursorRowNode_.insertBefore(newNode, cursorNode);
        this.cursorNode_ = newNode;
        this.cursorOffset_ = wcwidth;
      }
    } else {
      if (0 == reverseOffset) {
        var nextSibling = cursorNode.nextSibling;
        nextSibling && this.textAttributes.matchesContainer(nextSibling) ? (nextSibling.textContent = str + nextSibling.textContent, this.cursorNode_ = nextSibling, this.cursorOffset_ = lib.wc.strWidth(str)) : (newNode = this.textAttributes.createContainer(str), this.cursorRowNode_.insertBefore(newNode, nextSibling), this.cursorNode_ = newNode, this.cursorOffset_ = hterm.TextAttributes.nodeWidth(newNode));
      } else {
        this.splitNode_(cursorNode, offset), newNode = this.textAttributes.createContainer(str), this.cursorRowNode_.insertBefore(newNode, cursorNode.nextSibling), this.cursorNode_ = newNode, this.cursorOffset_ = wcwidth;
      }
    }
  }
};
hterm.Screen.prototype.overwriteString = function(str, wcwidth) {
  var maxLength = this.columnCount_ - this.cursorPosition.column;
  if (!maxLength) {
    return [str];
  }
  void 0 === wcwidth && (wcwidth = lib.wc.strWidth(str));
  this.textAttributes.matchesContainer(this.cursorNode_) && this.cursorNode_.textContent.substr(this.cursorOffset_) == str ? (this.cursorOffset_ += wcwidth, this.cursorPosition.column += wcwidth) : (this.deleteChars(Math.min(wcwidth, maxLength)), this.insertString(str, wcwidth));
};
hterm.Screen.prototype.deleteChars = function(count) {
  var node = this.cursorNode_, offset = this.cursorOffset_;
  count = Math.min(count, this.columnCount_ - this.cursorPosition.column);
  if (!count) {
    return 0;
  }
  for (var rv = count, startLength, endLength; node && count;) {
    if (0 > count) {
      console.error("Deleting " + rv + " chars went negative: " + count);
      break;
    }
    startLength = hterm.TextAttributes.nodeWidth(node);
    node.textContent = hterm.TextAttributes.nodeSubstr(node, 0, offset) + hterm.TextAttributes.nodeSubstr(node, offset + count);
    endLength = hterm.TextAttributes.nodeWidth(node);
    if (node.wcNode && offset < startLength && (endLength && startLength == endLength || !endLength && 1 == offset)) {
      var spaceNode = this.textAttributes.createContainer(" ");
      node.parentNode.insertBefore(spaceNode, offset ? node : node.nextSibling);
      node.textContent = "";
      endLength = 0;
      --count;
    } else {
      count -= startLength - endLength;
    }
    var nextNode = node.nextSibling;
    0 == endLength && node != this.cursorNode_ && node.parentNode.removeChild(node);
    node = nextNode;
    offset = 0;
  }
  if (this.cursorNode_.nodeType != Node.TEXT_NODE && !this.cursorNode_.textContent) {
    var cursorNode = this.cursorNode_;
    if (cursorNode.previousSibling) {
      this.cursorNode_ = cursorNode.previousSibling, this.cursorOffset_ = hterm.TextAttributes.nodeWidth(cursorNode.previousSibling);
    } else {
      if (cursorNode.nextSibling) {
        this.cursorNode_ = cursorNode.nextSibling;
      } else {
        var emptyNode = this.cursorRowNode_.ownerDocument.createTextNode("");
        this.cursorRowNode_.appendChild(emptyNode);
        this.cursorNode_ = emptyNode;
      }
      this.cursorOffset_ = 0;
    }
    this.cursorRowNode_.removeChild(cursorNode);
  }
  return rv;
};
hterm.Screen.prototype.getLineStartRow_ = function(row) {
  for (; row.previousSibling && row.previousSibling.hasAttribute("line-overflow");) {
    row = row.previousSibling;
  }
  return row;
};
hterm.Screen.prototype.getLineText_ = function(row) {
  for (var rowText = ""; row;) {
    if (rowText += row.textContent, row.hasAttribute("line-overflow")) {
      row = row.nextSibling;
    } else {
      break;
    }
  }
  return rowText;
};
hterm.Screen.prototype.getXRowAncestor_ = function(node) {
  for (; node && "X-ROW" !== node.nodeName;) {
    node = node.parentNode;
  }
  return node;
};
hterm.Screen.prototype.getPositionWithOverflow_ = function(row, node, offset) {
  if (!node) {
    return -1;
  }
  var ancestorRow = this.getXRowAncestor_(node);
  if (!ancestorRow) {
    return -1;
  }
  for (var position = 0; ancestorRow != row;) {
    if (position += hterm.TextAttributes.nodeWidth(row), row.hasAttribute("line-overflow") && row.nextSibling) {
      row = row.nextSibling;
    } else {
      return -1;
    }
  }
  return position + this.getPositionWithinRow_(row, node, offset);
};
hterm.Screen.prototype.getPositionWithinRow_ = function(row, node, offset) {
  if (node.parentNode != row) {
    return null == node.parentNode ? -1 : this.getPositionWithinRow_(node.parentNode, node, offset) + this.getPositionWithinRow_(row, node.parentNode, 0);
  }
  for (var position = 0, i = 0; i < row.childNodes.length; i++) {
    var currentNode = row.childNodes[i];
    if (currentNode == node) {
      return position + offset;
    }
    position += hterm.TextAttributes.nodeWidth(currentNode);
  }
  return -1;
};
hterm.Screen.prototype.getNodeAndOffsetWithOverflow_ = function(row, position) {
  for (; row && position > hterm.TextAttributes.nodeWidth(row);) {
    if (row.hasAttribute("line-overflow") && row.nextSibling) {
      position -= hterm.TextAttributes.nodeWidth(row), row = row.nextSibling;
    } else {
      return -1;
    }
  }
  return this.getNodeAndOffsetWithinRow_(row, position);
};
hterm.Screen.prototype.getNodeAndOffsetWithinRow_ = function(row, position) {
  for (var i = 0; i < row.childNodes.length; i++) {
    var node = row.childNodes[i], nodeTextWidth = hterm.TextAttributes.nodeWidth(node);
    if (position <= nodeTextWidth) {
      return "SPAN" === node.nodeName ? this.getNodeAndOffsetWithinRow_(node, position) : [node, position];
    }
    position -= nodeTextWidth;
  }
  return null;
};
hterm.Screen.prototype.setRange_ = function(row, start, end, range) {
  var startNodeAndOffset = this.getNodeAndOffsetWithOverflow_(row, start);
  if (null != startNodeAndOffset) {
    var endNodeAndOffset = this.getNodeAndOffsetWithOverflow_(row, end);
    null != endNodeAndOffset && (range.setStart(startNodeAndOffset[0], startNodeAndOffset[1]), range.setEnd(endNodeAndOffset[0], endNodeAndOffset[1]));
  }
};
hterm.Screen.prototype.expandSelectionWithWordBreakMatches_ = function(selection, leftMatch, rightMatch, insideMatch) {
  if (selection) {
    var range = selection.getRangeAt(0);
    if (range && !range.toString().match(/\s/)) {
      var rowElement = this.getXRowAncestor_(range.startContainer);
      if (rowElement) {
        var row = this.getLineStartRow_(rowElement);
        if (row) {
          var startPosition = this.getPositionWithOverflow_(row, range.startContainer, range.startOffset);
          if (-1 != startPosition) {
            var endPosition = this.getPositionWithOverflow_(row, range.endContainer, range.endOffset);
            if (-1 != endPosition) {
              var rowText = this.getLineText_(row), expandedStart = lib.wc.substring(rowText, 0, endPosition).search(new RegExp(leftMatch + insideMatch + "$"));
              if (!(-1 == expandedStart || expandedStart > startPosition)) {
                var found = lib.wc.substring(rowText, startPosition, lib.wc.strWidth(rowText)).match(new RegExp("^" + insideMatch + rightMatch));
                if (found) {
                  var expandedEnd = startPosition + lib.wc.strWidth(found[0]);
                  -1 == expandedEnd || expandedEnd < endPosition || (this.setRange_(row, expandedStart, expandedEnd, range), selection.addRange(range));
                }
              }
            }
          }
        }
      }
    }
  }
};
hterm.Screen.prototype.expandSelection = function(selection) {
  this.expandSelectionWithWordBreakMatches_(selection, this.wordBreakMatchLeft, this.wordBreakMatchRight, this.wordBreakMatchMiddle);
};
hterm.Screen.prototype.expandSelectionForUrl = function(selection) {
  this.expandSelectionWithWordBreakMatches_(selection, "[^\\s\\[\\](){}<>\"'\\^!@#$%&*,;:`]", "[^\\s\\[\\](){}<>\"'\\^!@#$%&*,;:~.`]", "[^\\s\\[\\](){}<>\"'\\^]*");
};
hterm.Screen.prototype.saveCursorAndState = function(vt) {
  this.cursorState_.save(vt);
};
hterm.Screen.prototype.restoreCursorAndState = function(vt) {
  this.cursorState_.restore(vt);
};
hterm.Screen.CursorState = function(screen) {
  this.screen_ = screen;
  this.GL = this.GR = this.G0 = this.G1 = this.G2 = this.G3 = this.textAttributes = this.cursor = null;
};
hterm.Screen.CursorState.prototype.save = function(vt) {
  this.cursor = vt.terminal.saveCursor();
  this.textAttributes = this.screen_.textAttributes.clone();
  this.GL = vt.GL;
  this.GR = vt.GR;
  this.G0 = vt.G0;
  this.G1 = vt.G1;
  this.G2 = vt.G2;
  this.G3 = vt.G3;
};
hterm.Screen.CursorState.prototype.restore = function(vt) {
  vt.terminal.restoreCursor(this.cursor);
  var tattrs = this.textAttributes.clone();
  tattrs.colorPalette = this.screen_.textAttributes.colorPalette;
  tattrs.syncColors();
  this.screen_.textAttributes = tattrs;
  vt.GL = this.GL;
  vt.GR = this.GR;
  vt.G0 = this.G0;
  vt.G1 = this.G1;
  vt.G2 = this.G2;
  vt.G3 = this.G3;
};
lib.rtdep("lib.f", "hterm.PubSub", "hterm.Size");
hterm.ScrollPort = function(rowProvider) {
  hterm.PubSub.addBehavior(this);
  this.rowProvider_ = rowProvider;
  this.characterSize = new hterm.Size(10, 10);
  this.ruler_ = null;
  this.selection = new hterm.ScrollPort.Selection(this);
  this.currentRowNodeCache_ = null;
  this.previousRowNodeCache_ = {};
  this.lastScreenHeight_ = this.lastScreenWidth_ = null;
  this.selectionEnabled_ = !0;
  this.lastRowCount_ = 0;
  this.scrollWheelMultiplier_ = 1;
  this.lastTouch_ = {};
  this.isScrolledEnd = !0;
  this.currentScrollbarWidthPx = 16;
  this.ctrlVPaste = !1;
  this.pasteOnDrop = !0;
  this.document_ = this.div_ = null;
  this.timeouts_ = {};
  this.observers_ = {};
  this.DEBUG_ = !1;
};
hterm.ScrollPort.Selection = function(scrollPort) {
  this.scrollPort_ = scrollPort;
  this.isCollapsed = this.isMultiline = this.endRow = this.startRow = null;
};
hterm.ScrollPort.Selection.prototype.findFirstChild = function(parent, childAry) {
  for (var node = parent.firstChild; node;) {
    if (-1 != childAry.indexOf(node)) {
      return node;
    }
    if (node.childNodes.length) {
      var rv = this.findFirstChild(node, childAry);
      if (rv) {
        return rv;
      }
    }
    node = node.nextSibling;
  }
  return null;
};
hterm.ScrollPort.Selection.prototype.sync = function() {
  function anchorFirst() {
    self.startRow = anchorRow;
    self.startNode = selection.anchorNode;
    self.startOffset = selection.anchorOffset;
    self.endRow = focusRow;
    self.endNode = selection.focusNode;
    self.endOffset = selection.focusOffset;
  }
  function focusFirst() {
    self.startRow = focusRow;
    self.startNode = selection.focusNode;
    self.startOffset = selection.focusOffset;
    self.endRow = anchorRow;
    self.endNode = selection.anchorNode;
    self.endOffset = selection.anchorOffset;
  }
  var self = this, selection = this.scrollPort_.getDocument().getSelection();
  this.isMultiline = this.endRow = this.startRow = null;
  this.isCollapsed = !selection || selection.isCollapsed;
  if (selection) {
    var accessibilityEnabled = this.scrollPort_.accessibilityReader_ && this.scrollPort_.accessibilityReader_.accessibilityEnabled;
    if (!this.isCollapsed || accessibilityEnabled) {
      for (var anchorRow = selection.anchorNode; anchorRow && "X-ROW" != anchorRow.nodeName;) {
        anchorRow = anchorRow.parentNode;
      }
      if (anchorRow) {
        for (var focusRow = selection.focusNode; focusRow && "X-ROW" != focusRow.nodeName;) {
          focusRow = focusRow.parentNode;
        }
        if (focusRow) {
          if (anchorRow.rowIndex < focusRow.rowIndex) {
            anchorFirst();
          } else {
            if (anchorRow.rowIndex > focusRow.rowIndex) {
              focusFirst();
            } else {
              if (selection.focusNode == selection.anchorNode) {
                selection.anchorOffset < selection.focusOffset ? anchorFirst() : focusFirst();
              } else {
                var firstNode = this.findFirstChild(anchorRow, [selection.anchorNode, selection.focusNode]);
                if (!firstNode) {
                  throw Error("Unexpected error syncing selection.");
                }
                firstNode == selection.anchorNode ? anchorFirst() : focusFirst();
              }
            }
          }
          this.isMultiline = anchorRow.rowIndex != focusRow.rowIndex;
        }
      }
    }
  }
};
hterm.ScrollPort.prototype.decorate = function(div, callback) {
  var $jscomp$this = this;
  this.div_ = div;
  this.iframe_ = div.ownerDocument.createElement("iframe");
  this.iframe_.style.cssText = "border: 0;height: 100%;position: absolute;width: 100%";
  div.appendChild(this.iframe_);
  var onLoad = function() {
    $jscomp$this.paintIframeContents_();
    callback && callback();
  };
  "mozInnerScreenX" in window ? this.iframe_.addEventListener("load", function() {
    return onLoad();
  }) : onLoad();
};
hterm.ScrollPort.prototype.paintIframeContents_ = function() {
  var $jscomp$this = this;
  this.iframe_.contentWindow.addEventListener("resize", this.onResize_.bind(this));
  var doc = this.document_ = this.iframe_.contentDocument;
  doc.body.style.cssText = "margin: 0px;padding: 0px;height: 100%;width: 100%;overflow: hidden;cursor: var(--hterm-mouse-cursor-style);-webkit-user-select: none;-moz-user-select: none;";
  var metaCharset = doc.createElement("meta");
  metaCharset.setAttribute("charset", "utf-8");
  doc.head.appendChild(metaCharset);
  this.DEBUG_ && (this.document_.body.style.paddingTop = this.document_.body.style.paddingBottom = "calc(var(--hterm-charsize-height) * 3)");
  var style = doc.createElement("style");
  style.textContent = "\n      x-row {\n        display: block;\n        height: var(--hterm-charsize-height);\n        line-height: var(--hterm-charsize-height);\n      }\n\n      x-screen x-row {\n        visibility: hidden;\n      }\n\n      #hterm\\:top-fold-for-row-selection ~ x-row {\n        visibility: visible;\n      }\n\n      #hterm\\:bottom-fold-for-row-selection ~ x-row {\n        visibility: hidden;\n      }";
  doc.head.appendChild(style);
  this.userCssLink_ = doc.createElement("link");
  this.userCssLink_.setAttribute("rel", "stylesheet");
  this.userCssText_ = doc.createElement("style");
  doc.head.appendChild(this.userCssText_);
  this.screen_ = doc.createElement("x-screen");
  this.screen_.setAttribute("contenteditable", "true");
  this.screen_.setAttribute("spellcheck", "false");
  this.screen_.setAttribute("autocomplete", "off");
  this.screen_.setAttribute("autocorrect", "off");
  this.screen_.setAttribute("autocapitalize", "none");
  this.screen_.setAttribute("role", "log");
  this.screen_.setAttribute("aria-live", "off");
  this.screen_.setAttribute("aria-roledescription", "Terminal");
  this.screen_.setAttribute("aria-readonly", "true");
  this.screen_.setAttribute("tabindex", "-1");
  this.screen_.style.cssText = "caret-color: transparent;display: block;font-family: monospace;font-size: 15px;font-variant-ligatures: none;height: 100%;overflow-y: scroll; overflow-x: hidden;white-space: pre;width: 100%;outline: none !important";
  doc.body.appendChild(this.screen_);
  this.screen_.addEventListener("scroll", this.onScroll_.bind(this));
  this.screen_.addEventListener("wheel", this.onScrollWheel_.bind(this));
  this.screen_.addEventListener("touchstart", this.onTouch_.bind(this));
  this.screen_.addEventListener("touchmove", this.onTouch_.bind(this));
  this.screen_.addEventListener("touchend", this.onTouch_.bind(this));
  this.screen_.addEventListener("touchcancel", this.onTouch_.bind(this));
  this.screen_.addEventListener("copy", this.onCopy_.bind(this));
  this.screen_.addEventListener("paste", this.onPaste_.bind(this));
  this.screen_.addEventListener("drop", this.onDragAndDrop_.bind(this));
  doc.body.addEventListener("keydown", this.onBodyKeyDown_.bind(this));
  this.scrollUpButton_ = this.document_.createElement("div");
  this.scrollUpButton_.id = "hterm:a11y:page-up";
  this.scrollUpButton_.innerText = hterm.msg("BUTTON_PAGE_UP", [], "Page up");
  this.scrollUpButton_.setAttribute("role", "button");
  this.scrollUpButton_.style.cssText = "right: 0px;\n                             position:fixed;\n                             z-index: 1;\n                             text-align: center;\n                             cursor: pointer;\n                             height: 30px;\n                             width: 110px;\n                             line-height: 30px;\n                             border-width: 1px;\n                             border-style: solid;\n                             font-weight: bold;";
  this.scrollUpButton_.style.top = "-32px";
  this.scrollUpButton_.addEventListener("click", this.scrollPageUp.bind(this));
  this.scrollDownButton_ = this.document_.createElement("div");
  this.scrollDownButton_.id = "hterm:a11y:page-down";
  this.scrollDownButton_.innerText = hterm.msg("BUTTON_PAGE_DOWN", [], "Page down");
  this.scrollDownButton_.setAttribute("role", "button");
  this.scrollDownButton_.style.cssText = "right: 0px;\n                             position:fixed;\n                             z-index: 1;\n                             text-align: center;\n                             cursor: pointer;\n                             height: 30px;\n                             width: 110px;\n                             line-height: 30px;\n                             border-width: 1px;\n                             border-style: solid;\n                             font-weight: bold;";
  this.scrollDownButton_.style.bottom = "-32px";
  this.scrollDownButton_.addEventListener("click", this.scrollPageDown.bind(this));
  this.allowScrollButtonsToDisplay_ = !1;
  setTimeout(function() {
    $jscomp$this.allowScrollButtonsToDisplay_ = !0;
  }, 500);
  this.document_.addEventListener("selectionchange", function() {
    $jscomp$this.selection.sync();
    if ($jscomp$this.allowScrollButtonsToDisplay_) {
      var accessibilityEnabled = $jscomp$this.accessibilityReader_ && $jscomp$this.accessibilityReader_.accessibilityEnabled, selection = $jscomp$this.document_.getSelection();
      if (selection.anchorNode && selection.anchorNode.parentElement) {
        var selectedElement = selection.anchorNode.parentElement;
      }
      $jscomp$this.scrollUpButton_.style.top = accessibilityEnabled && selectedElement == $jscomp$this.scrollUpButton_ ? "0px" : "-32px";
      $jscomp$this.scrollDownButton_.style.bottom = accessibilityEnabled && selectedElement == $jscomp$this.scrollDownButton_ ? "0px" : "-32px";
    }
  });
  this.screen_.appendChild(this.scrollUpButton_);
  this.rowNodes_ = doc.createElement("div");
  this.rowNodes_.id = "hterm:row-nodes";
  this.rowNodes_.style.cssText = "display: block;position: fixed;overflow: hidden;-webkit-user-select: text;-moz-user-select: text;";
  this.screen_.appendChild(this.rowNodes_);
  this.screen_.appendChild(this.scrollDownButton_);
  this.topSelectBag_ = doc.createElement("x-select-bag");
  this.topSelectBag_.style.cssText = "display: block;overflow: hidden;height: var(--hterm-charsize-height);white-space: pre;";
  this.bottomSelectBag_ = this.topSelectBag_.cloneNode();
  this.topFold_ = doc.createElement("x-fold");
  this.topFold_.id = "hterm:top-fold-for-row-selection";
  this.topFold_.style.cssText = "display: block;";
  this.rowNodes_.appendChild(this.topFold_);
  this.bottomFold_ = this.topFold_.cloneNode();
  this.bottomFold_.id = "hterm:bottom-fold-for-row-selection";
  this.rowNodes_.appendChild(this.bottomFold_);
  this.scrollArea_ = doc.createElement("div");
  this.scrollArea_.id = "hterm:scrollarea";
  this.scrollArea_.style.cssText = "visibility: hidden";
  this.screen_.appendChild(this.scrollArea_);
  this.svg_ = this.div_.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.svg_.id = "hterm:zoom-detector";
  this.svg_.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  this.svg_.setAttribute("version", "1.1");
  this.svg_.style.cssText = "position: absolute;top: 0;left: 0;visibility: hidden";
  this.pasteTarget_ = doc.createElement("textarea");
  this.pasteTarget_.id = "hterm:ctrl-v-paste-target";
  this.pasteTarget_.setAttribute("tabindex", "-1");
  this.pasteTarget_.setAttribute("aria-hidden", "true");
  this.pasteTarget_.style.cssText = "position: absolute;height: 1px;width: 1px;left: 0px; bottom: 0px;opacity: 0";
  this.pasteTarget_.contentEditable = !0;
  this.screen_.appendChild(this.pasteTarget_);
  this.pasteTarget_.addEventListener("textInput", this.handlePasteTargetTextInput_.bind(this));
  this.resize();
};
hterm.ScrollPort.prototype.setAccessibilityReader = function(accessibilityReader) {
  this.accessibilityReader_ = accessibilityReader;
};
hterm.ScrollPort.prototype.scrollPageUp = function() {
  if (0 != this.getTopRowIndex()) {
    var i = this.getTopRowIndex();
    this.scrollRowToTop(i - this.visibleRowCount + 1);
    this.assertiveAnnounce_();
  }
};
hterm.ScrollPort.prototype.scrollPageDown = function() {
  if (!this.isScrolledEnd) {
    var i = this.getTopRowIndex();
    this.scrollRowToTop(i + this.visibleRowCount - 1);
    this.assertiveAnnounce_();
  }
};
hterm.ScrollPort.prototype.setFontFamily = function(fontFamily, opt_smoothing) {
  this.screen_.style.fontFamily = fontFamily;
  this.screen_.style.webkitFontSmoothing = opt_smoothing ? opt_smoothing : "";
  this.syncCharacterSize();
};
hterm.ScrollPort.prototype.getFontFamily = function() {
  return this.screen_.style.fontFamily;
};
hterm.ScrollPort.prototype.setUserCssUrl = function(url) {
  url ? (this.userCssLink_.setAttribute("href", url), this.userCssLink_.parentNode || this.document_.head.appendChild(this.userCssLink_)) : this.userCssLink_.parentNode && this.document_.head.removeChild(this.userCssLink_);
};
hterm.ScrollPort.prototype.setUserCssText = function(text) {
  this.userCssText_.textContent = text;
};
hterm.ScrollPort.prototype.focus = function() {
  this.iframe_.focus();
  this.screen_.focus();
  this.publish("focus");
};
hterm.ScrollPort.prototype.getForegroundColor = function() {
  return this.screen_.style.color;
};
hterm.ScrollPort.prototype.setForegroundColor = function(color) {
  this.screen_.style.color = color;
  this.scrollUpButton_.style.backgroundColor = color;
  this.scrollDownButton_.style.backgroundColor = color;
};
hterm.ScrollPort.prototype.getBackgroundColor = function() {
  return this.screen_.style.backgroundColor;
};
hterm.ScrollPort.prototype.setBackgroundColor = function(color) {
  this.screen_.style.backgroundColor = color;
  this.scrollUpButton_.style.color = color;
  this.scrollDownButton_.style.color = color;
};
hterm.ScrollPort.prototype.setBackgroundImage = function(image) {
  this.screen_.style.backgroundImage = image;
};
hterm.ScrollPort.prototype.setBackgroundSize = function(size) {
  this.screen_.style.backgroundSize = size;
};
hterm.ScrollPort.prototype.setBackgroundPosition = function(position) {
  this.screen_.style.backgroundPosition = position;
};
hterm.ScrollPort.prototype.setCtrlVPaste = function(ctrlVPaste) {
  this.ctrlVPaste = ctrlVPaste;
};
hterm.ScrollPort.prototype.setPasteOnDrop = function(pasteOnDrop) {
  this.pasteOnDrop = pasteOnDrop;
};
hterm.ScrollPort.prototype.getScreenSize = function() {
  var size = hterm.getClientSize(this.screen_);
  return {height:size.height, width:size.width - this.currentScrollbarWidthPx};
};
hterm.ScrollPort.prototype.getScreenWidth = function() {
  return this.getScreenSize().width;
};
hterm.ScrollPort.prototype.getScreenHeight = function() {
  return this.getScreenSize().height;
};
hterm.ScrollPort.prototype.getDocument = function() {
  return this.document_;
};
hterm.ScrollPort.prototype.getScreenNode = function() {
  return this.screen_;
};
hterm.ScrollPort.prototype.resetCache = function() {
  this.currentRowNodeCache_ = null;
  this.previousRowNodeCache_ = {};
};
hterm.ScrollPort.prototype.setRowProvider = function(rowProvider) {
  this.resetCache();
  this.rowProvider_ = rowProvider;
  this.scheduleRedraw();
};
hterm.ScrollPort.prototype.invalidate = function() {
  for (var node = this.topFold_.nextSibling; node != this.bottomFold_;) {
    var nextSibling = node.nextSibling;
    node.parentElement.removeChild(node);
    node = nextSibling;
  }
  this.previousRowNodeCache_ = null;
  var topRowIndex = this.getTopRowIndex(), bottomRowIndex = this.getBottomRowIndex(topRowIndex);
  this.drawVisibleRows_(topRowIndex, bottomRowIndex);
};
hterm.ScrollPort.prototype.scheduleInvalidate = function() {
  if (!this.timeouts_.invalidate) {
    var self = this;
    this.timeouts_.invalidate = setTimeout(function() {
      delete self.timeouts_.invalidate;
      self.invalidate();
    }, 0);
  }
};
hterm.ScrollPort.prototype.setFontSize = function(px) {
  this.screen_.style.fontSize = px + "px";
  this.syncCharacterSize();
};
hterm.ScrollPort.prototype.getFontSize = function() {
  return parseInt(this.screen_.style.fontSize);
};
hterm.ScrollPort.prototype.measureCharacterSize = function(opt_weight) {
  this.ruler_ || (this.ruler_ = this.document_.createElement("div"), this.ruler_.id = "hterm:ruler-character-size", this.ruler_.style.cssText = "position: absolute;top: 0;left: 0;visibility: hidden;height: auto !important;width: auto !important;", this.rulerSpan_ = this.document_.createElement("span"), this.rulerSpan_.id = "hterm:ruler-span-workaround", this.rulerSpan_.innerHTML = ("X".repeat(100) + "\r").repeat(100), this.ruler_.appendChild(this.rulerSpan_), this.rulerBaseline_ = this.document_.createElement("span"), 
  this.rulerSpan_.id = "hterm:ruler-baseline", this.rulerBaseline_.style.fontSize = "0px", this.rulerBaseline_.textContent = "X");
  this.rulerSpan_.style.fontWeight = opt_weight || "";
  this.rowNodes_.appendChild(this.ruler_);
  var rulerSize = hterm.getClientSize(this.rulerSpan_), size = new hterm.Size(rulerSize.width / 100, rulerSize.height / 100);
  this.ruler_.appendChild(this.rulerBaseline_);
  size.baseline = this.rulerBaseline_.offsetTop;
  this.ruler_.removeChild(this.rulerBaseline_);
  this.rowNodes_.removeChild(this.ruler_);
  this.div_.ownerDocument.body.appendChild(this.svg_);
  size.zoomFactor = this.svg_.currentScale;
  this.div_.ownerDocument.body.removeChild(this.svg_);
  return size;
};
hterm.ScrollPort.prototype.syncCharacterSize = function() {
  this.characterSize = this.measureCharacterSize();
  this.resize();
};
hterm.ScrollPort.prototype.resize = function() {
  this.currentScrollbarWidthPx = hterm.getClientWidth(this.screen_) - this.screen_.clientWidth;
  this.syncScrollHeight();
  this.syncRowNodesDimensions_();
  var self = this;
  this.publish("resize", {scrollPort:this}, function() {
    self.scrollRowToBottom(self.rowProvider_.getRowCount());
    self.scheduleRedraw();
  });
};
hterm.ScrollPort.prototype.assertiveAnnounce_ = function() {
  if (this.accessibilityReader_) {
    var topRow = this.getTopRowIndex(), bottomRow = this.getBottomRowIndex(topRow), percentScrolled = 100 * topRow / Math.max(1, this.rowProvider_.getRowCount() - this.visibleRowCount);
    percentScrolled = Math.min(100, Math.round(percentScrolled));
    var currentScreenContent = hterm.msg("ANNOUNCE_CURRENT_SCREEN_HEADER", [percentScrolled], "$1% scrolled,");
    currentScreenContent += "\n";
    for (var i = topRow; i <= bottomRow; ++i) {
      var node = this.fetchRowNode_(i);
      currentScreenContent += node.textContent + "\n";
    }
    this.accessibilityReader_.assertiveAnnounce(currentScreenContent);
  }
};
hterm.ScrollPort.prototype.syncRowNodesDimensions_ = function() {
  var screenSize = this.getScreenSize();
  this.lastScreenWidth_ = screenSize.width;
  this.lastScreenHeight_ = screenSize.height;
  this.visibleRowCount = lib.f.smartFloorDivide(screenSize.height, this.characterSize.height);
  var visibleRowsHeight = this.visibleRowCount * this.characterSize.height;
  this.visibleRowTopMargin = 0;
  this.visibleRowBottomMargin = screenSize.height - visibleRowsHeight;
  this.topFold_.style.marginBottom = this.visibleRowTopMargin + "px";
  for (var topFoldOffset = 0, node = this.topFold_.previousSibling; node;) {
    topFoldOffset += hterm.getClientHeight(node), node = node.previousSibling;
  }
  this.rowNodes_.style.width = screenSize.width + "px";
  this.rowNodes_.style.height = visibleRowsHeight + topFoldOffset + "px";
  this.rowNodes_.style.left = this.screen_.offsetLeft + "px";
  this.rowNodes_.style.top = this.screen_.offsetTop - topFoldOffset + "px";
};
hterm.ScrollPort.prototype.syncScrollHeight = function() {
  this.lastRowCount_ = this.rowProvider_.getRowCount();
  this.scrollArea_.style.height = this.characterSize.height * this.lastRowCount_ + this.visibleRowTopMargin + this.visibleRowBottomMargin + "px";
};
hterm.ScrollPort.prototype.scheduleRedraw = function() {
  if (!this.timeouts_.redraw) {
    var self = this;
    this.timeouts_.redraw = setTimeout(function() {
      delete self.timeouts_.redraw;
      self.redraw_();
    }, 0);
  }
};
hterm.ScrollPort.prototype.updateScrollButtonState_ = function() {
  var setButton = function(button, disabled) {
    button.setAttribute("aria-disabled", disabled ? "true" : "false");
    button.style.opacity = disabled ? 0.5 : 1;
  };
  setButton(this.scrollUpButton_, 0 == this.getTopRowIndex());
  setButton(this.scrollDownButton_, this.isScrolledEnd);
};
hterm.ScrollPort.prototype.redraw_ = function() {
  this.resetSelectBags_();
  this.selection.sync();
  this.syncScrollHeight();
  this.currentRowNodeCache_ = {};
  var topRowIndex = this.getTopRowIndex(), bottomRowIndex = this.getBottomRowIndex(topRowIndex);
  this.drawTopFold_(topRowIndex);
  this.drawBottomFold_(bottomRowIndex);
  this.drawVisibleRows_(topRowIndex, bottomRowIndex);
  this.syncRowNodesDimensions_();
  this.previousRowNodeCache_ = this.currentRowNodeCache_;
  this.currentRowNodeCache_ = null;
  this.isScrolledEnd = this.getTopRowIndex() + this.visibleRowCount >= this.lastRowCount_;
  this.updateScrollButtonState_();
};
hterm.ScrollPort.prototype.drawTopFold_ = function(topRowIndex) {
  if (!this.selection.startRow || this.selection.startRow.rowIndex >= topRowIndex) {
    this.rowNodes_.firstChild != this.topFold_ && this.rowNodes_.insertBefore(this.topFold_, this.rowNodes_.firstChild);
  } else {
    if (!this.selection.isMultiline || this.selection.endRow.rowIndex >= topRowIndex) {
      this.selection.startRow.nextSibling != this.topFold_ && this.rowNodes_.insertBefore(this.topFold_, this.selection.startRow.nextSibling);
    } else {
      for (this.selection.endRow.nextSibling != this.topFold_ && this.rowNodes_.insertBefore(this.topFold_, this.selection.endRow.nextSibling); this.selection.startRow.nextSibling != this.selection.endRow;) {
        this.rowNodes_.removeChild(this.selection.startRow.nextSibling);
      }
    }
    for (; this.rowNodes_.firstChild != this.selection.startRow;) {
      this.rowNodes_.removeChild(this.rowNodes_.firstChild);
    }
  }
};
hterm.ScrollPort.prototype.drawBottomFold_ = function(bottomRowIndex) {
  if (!this.selection.endRow || this.selection.endRow.rowIndex <= bottomRowIndex) {
    this.rowNodes_.lastChild != this.bottomFold_ && this.rowNodes_.appendChild(this.bottomFold_);
  } else {
    if (!this.selection.isMultiline || this.selection.startRow.rowIndex <= bottomRowIndex) {
      this.bottomFold_.nextSibling != this.selection.endRow && this.rowNodes_.insertBefore(this.bottomFold_, this.selection.endRow);
    } else {
      for (this.bottomFold_.nextSibling != this.selection.startRow && this.rowNodes_.insertBefore(this.bottomFold_, this.selection.startRow); this.selection.startRow.nextSibling != this.selection.endRow;) {
        this.rowNodes_.removeChild(this.selection.startRow.nextSibling);
      }
    }
    for (; this.rowNodes_.lastChild != this.selection.endRow;) {
      this.rowNodes_.removeChild(this.rowNodes_.lastChild);
    }
  }
};
hterm.ScrollPort.prototype.drawVisibleRows_ = function(topRowIndex, bottomRowIndex) {
  function removeUntilNode(currentNode, targetNode) {
    for (; currentNode != targetNode;) {
      if (!currentNode) {
        throw "Did not encounter target node";
      }
      if (currentNode == self.bottomFold_) {
        throw "Encountered bottom fold before target node";
      }
      var deadNode = currentNode;
      currentNode = currentNode.nextSibling;
      deadNode.parentNode.removeChild(deadNode);
    }
  }
  for (var self = this, selectionStartRow = this.selection.startRow, selectionEndRow = this.selection.endRow, bottomFold = this.bottomFold_, node = this.topFold_.nextSibling, targetDrawCount = Math.min(this.visibleRowCount, this.rowProvider_.getRowCount()), drawCount = 0; drawCount < targetDrawCount; drawCount++) {
    var rowIndex = topRowIndex + drawCount;
    if (node == bottomFold) {
      var newNode = this.fetchRowNode_(rowIndex);
      if (!newNode) {
        console.log("Couldn't fetch row index: " + rowIndex);
        break;
      }
      this.rowNodes_.insertBefore(newNode, node);
    } else {
      if (node.rowIndex == rowIndex) {
        node = node.nextSibling;
      } else {
        if (selectionStartRow && selectionStartRow.rowIndex == rowIndex) {
          removeUntilNode(node, selectionStartRow), node = selectionStartRow.nextSibling;
        } else {
          if (selectionEndRow && selectionEndRow.rowIndex == rowIndex) {
            removeUntilNode(node, selectionEndRow), node = selectionEndRow.nextSibling;
          } else {
            if (node == selectionStartRow || node == selectionEndRow) {
              newNode = this.fetchRowNode_(rowIndex);
              if (!newNode) {
                console.log("Couldn't fetch row index: " + rowIndex);
                break;
              }
              this.rowNodes_.insertBefore(newNode, node);
            } else {
              newNode = this.fetchRowNode_(rowIndex);
              if (!newNode) {
                console.log("Couldn't fetch row index: " + rowIndex);
                break;
              }
              if (node == newNode) {
                node = node.nextSibling;
              } else {
                this.rowNodes_.insertBefore(newNode, node);
                if (!newNode.nextSibling) {
                  debugger;
                }
                this.rowNodes_.removeChild(node);
                node = newNode.nextSibling;
              }
            }
          }
        }
      }
    }
  }
  node != this.bottomFold_ && removeUntilNode(node, bottomFold);
};
hterm.ScrollPort.prototype.resetSelectBags_ = function() {
  this.topSelectBag_.parentNode && (this.topSelectBag_.textContent = "", this.topSelectBag_.parentNode.removeChild(this.topSelectBag_));
  this.bottomSelectBag_.parentNode && (this.bottomSelectBag_.textContent = "", this.bottomSelectBag_.parentNode.removeChild(this.bottomSelectBag_));
};
hterm.ScrollPort.prototype.cacheRowNode_ = function(rowNode) {
  this.currentRowNodeCache_[rowNode.rowIndex] = rowNode;
};
hterm.ScrollPort.prototype.fetchRowNode_ = function(rowIndex) {
  var node = this.previousRowNodeCache_ && rowIndex in this.previousRowNodeCache_ ? this.previousRowNodeCache_[rowIndex] : this.rowProvider_.getRowNode(rowIndex);
  this.currentRowNodeCache_ && this.cacheRowNode_(node);
  return node;
};
hterm.ScrollPort.prototype.selectAll = function() {
  if (0 != this.topFold_.nextSibling.rowIndex) {
    for (; this.topFold_.previousSibling;) {
      this.rowNodes_.removeChild(this.topFold_.previousSibling);
    }
    var firstRow = this.fetchRowNode_(0);
    this.rowNodes_.insertBefore(firstRow, this.topFold_);
    this.syncRowNodesDimensions_();
  } else {
    firstRow = this.topFold_.nextSibling;
  }
  var lastRowIndex = this.rowProvider_.getRowCount() - 1;
  if (this.bottomFold_.previousSibling.rowIndex != lastRowIndex) {
    for (; this.bottomFold_.nextSibling;) {
      this.rowNodes_.removeChild(this.bottomFold_.nextSibling);
    }
    var lastRow = this.fetchRowNode_(lastRowIndex);
    this.rowNodes_.appendChild(lastRow);
  } else {
    lastRow = this.bottomFold_.previousSibling.rowIndex;
  }
  var selection = this.document_.getSelection();
  selection.collapse(firstRow, 0);
  selection.extend(lastRow, lastRow.childNodes.length);
  this.selection.sync();
};
hterm.ScrollPort.prototype.getScrollMax_ = function(e) {
  return hterm.getClientHeight(this.scrollArea_) + this.visibleRowTopMargin + this.visibleRowBottomMargin - hterm.getClientHeight(this.screen_);
};
hterm.ScrollPort.prototype.scrollRowToTop = function(rowIndex) {
  this.syncScrollHeight();
  this.isScrolledEnd = rowIndex + this.visibleRowCount >= this.lastRowCount_;
  var scrollTop = rowIndex * this.characterSize.height + this.visibleRowTopMargin, scrollMax = this.getScrollMax_();
  scrollTop > scrollMax && (scrollTop = scrollMax);
  this.screen_.scrollTop != scrollTop && (this.screen_.scrollTop = scrollTop, this.scheduleRedraw());
};
hterm.ScrollPort.prototype.scrollRowToBottom = function(rowIndex) {
  this.syncScrollHeight();
  this.isScrolledEnd = rowIndex + this.visibleRowCount >= this.lastRowCount_;
  var scrollTop = rowIndex * this.characterSize.height + this.visibleRowTopMargin + this.visibleRowBottomMargin;
  scrollTop -= this.visibleRowCount * this.characterSize.height;
  0 > scrollTop && (scrollTop = 0);
  this.screen_.scrollTop != scrollTop && (this.screen_.scrollTop = scrollTop);
};
hterm.ScrollPort.prototype.getTopRowIndex = function() {
  return Math.round(this.screen_.scrollTop / this.characterSize.height);
};
hterm.ScrollPort.prototype.getBottomRowIndex = function(topRowIndex) {
  return topRowIndex + this.visibleRowCount - 1;
};
hterm.ScrollPort.prototype.onScroll_ = function(e) {
  var screenSize = this.getScreenSize();
  screenSize.width != this.lastScreenWidth_ || screenSize.height != this.lastScreenHeight_ ? this.resize() : (this.redraw_(), this.publish("scroll", {scrollPort:this}));
};
hterm.ScrollPort.prototype.onScrollWheel = function(e) {
};
hterm.ScrollPort.prototype.onScrollWheel_ = function(e) {
  this.onScrollWheel(e);
  if (!e.defaultPrevented) {
    var delta = this.scrollWheelDelta(e), top = this.screen_.scrollTop - delta.y;
    0 > top && (top = 0);
    var scrollMax = this.getScrollMax_();
    top > scrollMax && (top = scrollMax);
    top != this.screen_.scrollTop && (this.screen_.scrollTop = top, e.preventDefault());
  }
};
hterm.ScrollPort.prototype.scrollWheelDelta = function(e) {
  var delta = {x:0, y:0};
  switch(e.deltaMode) {
    case WheelEvent.DOM_DELTA_PIXEL:
      delta.x = e.deltaX * this.scrollWheelMultiplier_;
      delta.y = e.deltaY * this.scrollWheelMultiplier_;
      break;
    case WheelEvent.DOM_DELTA_LINE:
      delta.x = e.deltaX * this.characterSize.width;
      delta.y = e.deltaY * this.characterSize.height;
      break;
    case WheelEvent.DOM_DELTA_PAGE:
      delta.x = e.deltaX * this.characterSize.width * this.screen_.getWidth(), delta.y = e.deltaY * this.characterSize.height * this.screen_.getHeight();
  }
  delta.y *= -1;
  return delta;
};
hterm.ScrollPort.prototype.onTouch = function(e) {
};
hterm.ScrollPort.prototype.onTouch_ = function(e) {
  this.onTouch(e);
  if (!e.defaultPrevented) {
    var scrubTouch = function(t) {
      return {id:t.identifier, y:t.clientY, x:t.clientX, };
    }, i;
    switch(e.type) {
      case "touchstart":
        "cros" == hterm.os && window.chrome && chrome.windows && chrome.windows.getCurrent(function(win) {
          win.focused || chrome.windows.update(win.id, {focused:!0});
        });
        for (i = 0; i < e.changedTouches.length; ++i) {
          var touch = scrubTouch(e.changedTouches[i]);
          this.lastTouch_[touch.id] = touch;
        }
        break;
      case "touchcancel":
      case "touchend":
        for (i = 0; i < e.changedTouches.length; ++i) {
          delete this.lastTouch_[e.changedTouches[i].identifier];
        }
        break;
      case "touchmove":
        var delta = 0;
        for (i = 0; i < e.changedTouches.length; ++i) {
          touch = scrubTouch(e.changedTouches[i]), delta += this.lastTouch_[touch.id].y - touch.y, this.lastTouch_[touch.id] = touch;
        }
        var top = this.screen_.scrollTop - -1 * delta;
        0 > top && (top = 0);
        var scrollMax = this.getScrollMax_();
        top > scrollMax && (top = scrollMax);
        top != this.screen_.scrollTop && (this.screen_.scrollTop = top);
    }
    e.preventDefault();
  }
};
hterm.ScrollPort.prototype.onResize_ = function(e) {
  this.syncCharacterSize();
};
hterm.ScrollPort.prototype.onCopy = function(e) {
};
hterm.ScrollPort.prototype.onCopy_ = function(e) {
  this.onCopy(e);
  if (!(e.defaultPrevented || (this.resetSelectBags_(), this.selection.sync(), this.selection.isCollapsed || 2 > this.selection.endRow.rowIndex - this.selection.startRow.rowIndex))) {
    var topRowIndex = this.getTopRowIndex(), bottomRowIndex = this.getBottomRowIndex(topRowIndex);
    this.selection.startRow.rowIndex < topRowIndex && (this.topSelectBag_.textContent = this.rowProvider_.getRowsText(this.selection.startRow.rowIndex + 1, this.selection.endRow.rowIndex < topRowIndex ? this.selection.endRow.rowIndex : this.topFold_.nextSibling.rowIndex), this.rowNodes_.insertBefore(this.topSelectBag_, this.selection.startRow.nextSibling), this.syncRowNodesDimensions_());
    this.selection.endRow.rowIndex > bottomRowIndex && (this.bottomSelectBag_.textContent = this.rowProvider_.getRowsText(this.selection.startRow.rowIndex > bottomRowIndex ? this.selection.startRow.rowIndex + 1 : this.bottomFold_.previousSibling.rowIndex + 1, this.selection.endRow.rowIndex), this.rowNodes_.insertBefore(this.bottomSelectBag_, this.selection.endRow));
  }
};
hterm.ScrollPort.prototype.onBodyKeyDown_ = function(e) {
  this.ctrlVPaste && (e.ctrlKey || e.metaKey) && 86 == e.keyCode && this.pasteTarget_.focus();
};
hterm.ScrollPort.prototype.onPaste_ = function(e) {
  this.pasteTarget_.focus();
  var self = this;
  setTimeout(function() {
    self.publish("paste", {text:self.pasteTarget_.value});
    self.pasteTarget_.value = "";
    self.focus();
  }, 0);
};
hterm.ScrollPort.prototype.handlePasteTargetTextInput_ = function(e) {
  e.stopPropagation();
};
hterm.ScrollPort.prototype.onDragAndDrop_ = function(e) {
  if (this.pasteOnDrop) {
    e.preventDefault();
    var data, format;
    e.shiftKey && (e.dataTransfer.types.forEach(function(t) {
      !format && "text/plain" != t && t.startsWith("text/") && (format = t);
    }), format && (data = e.dataTransfer.getData(format)));
    data || (data = e.dataTransfer.getData("text/plain"));
    data && this.publish("paste", {text:data});
  }
};
hterm.ScrollPort.prototype.setScrollbarVisible = function(state) {
  this.screen_.style.overflowY = state ? "scroll" : "hidden";
};
hterm.ScrollPort.prototype.setScrollWheelMoveMultipler = function(multiplier) {
  this.scrollWheelMultiplier_ = multiplier;
};
lib.rtdep("lib.colors", "lib.PreferenceManager", "lib.resource", "lib.wc", "lib.f", "hterm.AccessibilityReader", "hterm.Keyboard", "hterm.Options", "hterm.PreferenceManager", "hterm.Screen", "hterm.ScrollPort", "hterm.Size", "hterm.TextAttributes", "hterm.VT");
hterm.Terminal = function(opt_profileId) {
  this.profileId_ = null;
  this.primaryScreen_ = new hterm.Screen;
  this.alternateScreen_ = new hterm.Screen;
  this.screen_ = this.primaryScreen_;
  this.screenSize = new hterm.Size(0, 0);
  this.scrollPort_ = new hterm.ScrollPort(this);
  this.scrollPort_.subscribe("resize", this.onResize_.bind(this));
  this.scrollPort_.subscribe("scroll", this.onScroll_.bind(this));
  this.scrollPort_.subscribe("paste", this.onPaste_.bind(this));
  this.scrollPort_.subscribe("focus", this.onScrollportFocus_.bind(this));
  this.scrollPort_.onCopy = this.onCopy_.bind(this);
  this.div_ = null;
  this.document_ = window.document;
  this.scrollbackRows_ = [];
  this.tabStops_ = [];
  this.defaultTabStops = !0;
  this.cursorNode_ = this.vtScrollBottom_ = this.vtScrollTop_ = null;
  this.cursorShape_ = hterm.Terminal.cursorShape.BLOCK;
  this.cursorBlinkCycle_ = [100, 100];
  this.myOnCursorBlink_ = this.onCursorBlink_.bind(this);
  this.scrollWheelArrowKeys_ = this.scrollOnKeystroke_ = this.scrollOnOutput_ = this.foregroundColor_ = this.backgroundColor_ = null;
  this.defeatMouseReports_ = !1;
  this.setAutomaticMouseHiding();
  this.mouseHideDelay_ = null;
  this.bellAudio_ = this.document_.createElement("audio");
  this.bellAudio_.id = "hterm:bell-audio";
  this.bellAudio_.setAttribute("preload", "auto");
  this.accessibilityReader_ = null;
  this.contextMenu = new hterm.ContextMenu;
  this.bellNotificationList_ = [];
  this.desktopNotificationBell_ = !1;
  this.savedOptions_ = {};
  this.options_ = new hterm.Options;
  this.timeouts_ = {};
  this.vt = new hterm.VT(this);
  this.saveCursorAndState(!0);
  this.keyboard = new hterm.Keyboard(this);
  this.io = new hterm.Terminal.IO(this);
  this.enableMouseDragScroll = !0;
  this.mousePasteButton = this.mouseRightClickPaste = this.copyOnSelect = null;
  this.useDefaultWindowCopy = !1;
  this.clearSelectionAfterCopy = !0;
  this.realizeSize_(80, 24);
  this.setDefaultTabStops();
  this.allowImagesInline = null;
  this.reportFocus = !1;
  this.setProfile(opt_profileId || "default", function() {
    this.onTerminalReady();
  }.bind(this));
};
hterm.Terminal.cursorShape = {BLOCK:"BLOCK", BEAM:"BEAM", UNDERLINE:"UNDERLINE"};
hterm.Terminal.prototype.onTerminalReady = function() {
};
hterm.Terminal.prototype.tabWidth = 8;
hterm.Terminal.prototype.setProfile = function(profileId, opt_callback) {
  this.profileId_ = profileId.replace(/\//g, "");
  var terminal = this;
  this.prefs_ && this.prefs_.deactivate();
  this.prefs_ = new hterm.PreferenceManager(this.profileId_);
  this.prefs_.addObservers(null, {"alt-gr-mode":function(v) {
    v = null == v ? "en-us" == navigator.language.toLowerCase() ? "none" : "right-alt" : "string" == typeof v ? v.toLowerCase() : "none";
    /^(none|ctrl-alt|left-alt|right-alt)$/.test(v) || (v = "none");
    terminal.keyboard.altGrMode = v;
  }, "alt-backspace-is-meta-backspace":function(v) {
    terminal.keyboard.altBackspaceIsMetaBackspace = v;
  }, "alt-is-meta":function(v) {
    terminal.keyboard.altIsMeta = v;
  }, "alt-sends-what":function(v) {
    /^(escape|8-bit|browser-key)$/.test(v) || (v = "escape");
    terminal.keyboard.altSendsWhat = v;
  }, "audible-bell-sound":function(v) {
    var ary = v.match(/^lib-resource:(\S+)/);
    ary ? terminal.bellAudio_.setAttribute("src", lib.resource.getDataUrl(ary[1])) : terminal.bellAudio_.setAttribute("src", v);
  }, "desktop-notification-bell":function(v) {
    v && Notification ? (terminal.desktopNotificationBell_ = "granted" === Notification.permission, terminal.desktopNotificationBell_ || console.warn("desktop-notification-bell is true but we do not have permission to display notifications.")) : terminal.desktopNotificationBell_ = !1;
  }, "background-color":function(v) {
    terminal.setBackgroundColor(v);
  }, "background-image":function(v) {
    terminal.scrollPort_.setBackgroundImage(v);
  }, "background-size":function(v) {
    terminal.scrollPort_.setBackgroundSize(v);
  }, "background-position":function(v) {
    terminal.scrollPort_.setBackgroundPosition(v);
  }, "backspace-sends-backspace":function(v) {
    terminal.keyboard.backspaceSendsBackspace = v;
  }, "character-map-overrides":function(v) {
    null == v || v instanceof Object ? (terminal.vt.characterMaps.reset(), terminal.vt.characterMaps.setOverrides(v)) : console.warn("Preference character-map-modifications is not an object: " + v);
  }, "cursor-blink":function(v) {
    terminal.setCursorBlink(!!v);
  }, "cursor-blink-cycle":function(v) {
    terminal.cursorBlinkCycle_ = v instanceof Array && "number" == typeof v[0] && "number" == typeof v[1] ? v : "number" == typeof v ? [v, v] : [100, 100];
  }, "cursor-color":function(v) {
    terminal.setCursorColor(v);
  }, "color-palette-overrides":function(v) {
    if (null == v || v instanceof Object || v instanceof Array) {
      lib.colors.colorPalette = lib.colors.stockColorPalette.concat();
      if (v) {
        for (var key in v) {
          var i = parseInt(key);
          if (isNaN(i) || 0 > i || 255 < i) {
            console.log("Invalid value in palette: " + key + ": " + v[key]);
          } else {
            if (v[i]) {
              var rgb = lib.colors.normalizeCSS(v[i]);
              rgb && (lib.colors.colorPalette[i] = rgb);
            }
          }
        }
      }
      terminal.primaryScreen_.textAttributes.resetColorPalette();
      terminal.alternateScreen_.textAttributes.resetColorPalette();
    } else {
      console.warn("Preference color-palette-overrides is not an array or object: " + v);
    }
  }, "copy-on-select":function(v) {
    terminal.copyOnSelect = !!v;
  }, "use-default-window-copy":function(v) {
    terminal.useDefaultWindowCopy = !!v;
  }, "clear-selection-after-copy":function(v) {
    terminal.clearSelectionAfterCopy = !!v;
  }, "ctrl-plus-minus-zero-zoom":function(v) {
    terminal.keyboard.ctrlPlusMinusZeroZoom = v;
  }, "ctrl-c-copy":function(v) {
    terminal.keyboard.ctrlCCopy = v;
  }, "ctrl-v-paste":function(v) {
    terminal.keyboard.ctrlVPaste = v;
    terminal.scrollPort_.setCtrlVPaste(v);
  }, "paste-on-drop":function(v) {
    terminal.scrollPort_.setPasteOnDrop(v);
  }, "east-asian-ambiguous-as-two-column":function(v) {
    lib.wc.regardCjkAmbiguous = v;
  }, "enable-8-bit-control":function(v) {
    terminal.vt.enable8BitControl = !!v;
  }, "enable-bold":function(v) {
    terminal.syncBoldSafeState();
  }, "enable-bold-as-bright":function(v) {
    terminal.primaryScreen_.textAttributes.enableBoldAsBright = !!v;
    terminal.alternateScreen_.textAttributes.enableBoldAsBright = !!v;
  }, "enable-blink":function(v) {
    terminal.setTextBlink(!!v);
  }, "enable-clipboard-write":function(v) {
    terminal.vt.enableClipboardWrite = !!v;
  }, "enable-dec12":function(v) {
    terminal.vt.enableDec12 = !!v;
  }, "enable-csi-j-3":function(v) {
    terminal.vt.enableCsiJ3 = !!v;
  }, "font-family":function(v) {
    terminal.syncFontFamily();
  }, "font-size":function(v) {
    v = parseInt(v);
    0 >= v ? console.error("Invalid font size: " + v) : terminal.setFontSize(v);
  }, "font-smoothing":function(v) {
    terminal.syncFontFamily();
  }, "foreground-color":function(v) {
    terminal.setForegroundColor(v);
  }, "hide-mouse-while-typing":function(v) {
    terminal.setAutomaticMouseHiding(v);
  }, "home-keys-scroll":function(v) {
    terminal.keyboard.homeKeysScroll = v;
  }, keybindings:function(v) {
    terminal.keyboard.bindings.clear();
    if (v) {
      if (v instanceof Object) {
        try {
          terminal.keyboard.bindings.addBindings(v);
        } catch (ex) {
          console.error("Error in keybindings preference: " + ex);
        }
      } else {
        console.error("Error in keybindings preference: Expected object");
      }
    }
  }, "media-keys-are-fkeys":function(v) {
    terminal.keyboard.mediaKeysAreFKeys = v;
  }, "meta-sends-escape":function(v) {
    terminal.keyboard.metaSendsEscape = v;
  }, "mouse-right-click-paste":function(v) {
    terminal.mouseRightClickPaste = v;
  }, "mouse-paste-button":function(v) {
    terminal.syncMousePasteButton();
  }, "page-keys-scroll":function(v) {
    terminal.keyboard.pageKeysScroll = v;
  }, "pass-alt-number":function(v) {
    null == v && (v = "mac" != hterm.os && "popup" != hterm.windowType);
    terminal.passAltNumber = v;
  }, "pass-ctrl-number":function(v) {
    null == v && (v = "mac" != hterm.os && "popup" != hterm.windowType);
    terminal.passCtrlNumber = v;
  }, "pass-meta-number":function(v) {
    null == v && (v = "mac" == hterm.os && "popup" != hterm.windowType);
    terminal.passMetaNumber = v;
  }, "pass-meta-v":function(v) {
    terminal.keyboard.passMetaV = v;
  }, "receive-encoding":function(v) {
    /^(utf-8|raw)$/.test(v) || (console.warn('Invalid value for "receive-encoding": ' + v), v = "utf-8");
    terminal.vt.characterEncoding = v;
  }, "scroll-on-keystroke":function(v) {
    terminal.scrollOnKeystroke_ = v;
  }, "scroll-on-output":function(v) {
    terminal.scrollOnOutput_ = v;
  }, "scrollbar-visible":function(v) {
    terminal.setScrollbarVisible(v);
  }, "scroll-wheel-may-send-arrow-keys":function(v) {
    terminal.scrollWheelArrowKeys_ = v;
  }, "scroll-wheel-move-multiplier":function(v) {
    terminal.setScrollWheelMoveMultipler(v);
  }, "send-encoding":function(v) {
    /^(utf-8|raw)$/.test(v) || (console.warn('Invalid value for "send-encoding": ' + v), v = "utf-8");
    terminal.keyboard.characterEncoding = v;
  }, "shift-insert-paste":function(v) {
    terminal.keyboard.shiftInsertPaste = v;
  }, "terminal-encoding":function(v) {
    terminal.vt.setEncoding(v);
  }, "user-css":function(v) {
    terminal.scrollPort_.setUserCssUrl(v);
  }, "user-css-text":function(v) {
    terminal.scrollPort_.setUserCssText(v);
  }, "word-break-match-left":function(v) {
    terminal.primaryScreen_.wordBreakMatchLeft = v;
    terminal.alternateScreen_.wordBreakMatchLeft = v;
  }, "word-break-match-right":function(v) {
    terminal.primaryScreen_.wordBreakMatchRight = v;
    terminal.alternateScreen_.wordBreakMatchRight = v;
  }, "word-break-match-middle":function(v) {
    terminal.primaryScreen_.wordBreakMatchMiddle = v;
    terminal.alternateScreen_.wordBreakMatchMiddle = v;
  }, "allow-images-inline":function(v) {
    terminal.allowImagesInline = v;
  }, });
  this.prefs_.readStorage(function() {
    this.prefs_.notifyAll();
    opt_callback && opt_callback();
  }.bind(this));
};
hterm.Terminal.prototype.getPrefs = function() {
  return this.prefs_;
};
hterm.Terminal.prototype.setBracketedPaste = function(state) {
  this.options_.bracketedPaste = state;
};
hterm.Terminal.prototype.setCursorColor = function(color) {
  void 0 === color && (color = this.prefs_.get("cursor-color"));
  this.setCssVar("cursor-color", color);
};
hterm.Terminal.prototype.getCursorColor = function() {
  return this.getCssVar("cursor-color");
};
hterm.Terminal.prototype.setSelectionEnabled = function(state) {
  this.enableMouseDragScroll = state;
};
hterm.Terminal.prototype.setBackgroundColor = function(color) {
  void 0 === color && (color = this.prefs_.get("background-color"));
  this.backgroundColor_ = lib.colors.normalizeCSS(color);
  this.primaryScreen_.textAttributes.setDefaults(this.foregroundColor_, this.backgroundColor_);
  this.alternateScreen_.textAttributes.setDefaults(this.foregroundColor_, this.backgroundColor_);
  this.scrollPort_.setBackgroundColor(color);
};
hterm.Terminal.prototype.getBackgroundColor = function() {
  return this.backgroundColor_;
};
hterm.Terminal.prototype.setForegroundColor = function(color) {
  void 0 === color && (color = this.prefs_.get("foreground-color"));
  this.foregroundColor_ = lib.colors.normalizeCSS(color);
  this.primaryScreen_.textAttributes.setDefaults(this.foregroundColor_, this.backgroundColor_);
  this.alternateScreen_.textAttributes.setDefaults(this.foregroundColor_, this.backgroundColor_);
  this.scrollPort_.setForegroundColor(color);
};
hterm.Terminal.prototype.getForegroundColor = function() {
  return this.foregroundColor_;
};
hterm.Terminal.prototype.runCommandClass = function(commandClass, argString) {
  var environment = this.prefs_.get("environment");
  if ("object" != typeof environment || null == environment) {
    environment = {};
  }
  var self = this;
  this.command = new commandClass({argString:argString || "", io:this.io.push(), environment:environment, onExit:function(code) {
    self.io.pop();
    self.uninstallKeyboard();
    self.prefs_.get("close-on-exit") && window.close();
  }});
  this.installKeyboard();
  this.command.run();
};
hterm.Terminal.prototype.isPrimaryScreen = function() {
  return this.screen_ == this.primaryScreen_;
};
hterm.Terminal.prototype.installKeyboard = function() {
  this.keyboard.installKeyboard(this.scrollPort_.getDocument().body);
};
hterm.Terminal.prototype.uninstallKeyboard = function() {
  this.keyboard.installKeyboard(null);
};
hterm.Terminal.prototype.setCssVar = function(name, value, opt_prefix) {
  this.document_.documentElement.style.setProperty("" + (void 0 === opt_prefix ? "--hterm-" : opt_prefix) + name, value);
};
hterm.Terminal.prototype.getCssVar = function(name, opt_prefix) {
  return this.document_.documentElement.style.getPropertyValue("" + (void 0 === opt_prefix ? "--hterm-" : opt_prefix) + name);
};
hterm.Terminal.prototype.setFontSize = function(px) {
  0 >= px && (px = this.prefs_.get("font-size"));
  this.scrollPort_.setFontSize(px);
  this.setCssVar("charsize-width", this.scrollPort_.characterSize.width + "px");
  this.setCssVar("charsize-height", this.scrollPort_.characterSize.height + "px");
};
hterm.Terminal.prototype.getFontSize = function() {
  return this.scrollPort_.getFontSize();
};
hterm.Terminal.prototype.getFontFamily = function() {
  return this.scrollPort_.getFontFamily();
};
hterm.Terminal.prototype.syncFontFamily = function() {
  this.scrollPort_.setFontFamily(this.prefs_.get("font-family"), this.prefs_.get("font-smoothing"));
  this.syncBoldSafeState();
};
hterm.Terminal.prototype.syncMousePasteButton = function() {
  var button = this.prefs_.get("mouse-paste-button");
  this.mousePasteButton = "number" == typeof button ? button : "linux" != hterm.os ? 1 : 2;
};
hterm.Terminal.prototype.syncBoldSafeState = function() {
  var enableBold = this.prefs_.get("enable-bold");
  if (null !== enableBold) {
    this.primaryScreen_.textAttributes.enableBold = enableBold, this.alternateScreen_.textAttributes.enableBold = enableBold;
  } else {
    var normalSize = this.scrollPort_.measureCharacterSize(), boldSize = this.scrollPort_.measureCharacterSize("bold"), isBoldSafe = normalSize.equals(boldSize);
    isBoldSafe || console.warn("Bold characters disabled: Size of bold weight differs from normal.  Font family is: " + this.scrollPort_.getFontFamily());
    this.primaryScreen_.textAttributes.enableBold = isBoldSafe;
    this.alternateScreen_.textAttributes.enableBold = isBoldSafe;
  }
};
hterm.Terminal.prototype.setTextBlink = function(state) {
  void 0 === state && (state = this.prefs_.get("enable-blink"));
  this.setCssVar("blink-node-duration", state ? "0.7s" : "0");
};
hterm.Terminal.prototype.syncMouseStyle = function() {
  this.setCssVar("mouse-cursor-style", this.vt.mouseReport == this.vt.MOUSE_REPORT_DISABLED ? "var(--hterm-mouse-cursor-text)" : "var(--hterm-mouse-cursor-default)");
};
hterm.Terminal.prototype.saveCursor = function() {
  return this.screen_.cursorPosition.clone();
};
hterm.Terminal.prototype.getTextAttributes = function() {
  return this.screen_.textAttributes;
};
hterm.Terminal.prototype.setTextAttributes = function(textAttributes) {
  this.screen_.textAttributes = textAttributes;
};
hterm.Terminal.prototype.getZoomFactor = function() {
  return this.scrollPort_.characterSize.zoomFactor;
};
hterm.Terminal.prototype.setWindowTitle = function(title) {
  window.document.title = title;
};
hterm.Terminal.prototype.restoreCursor = function(cursor) {
  var row = lib.f.clamp(cursor.row, 0, this.screenSize.height - 1), column = lib.f.clamp(cursor.column, 0, this.screenSize.width - 1);
  this.screen_.setCursorPosition(row, column);
  if (cursor.column > column || cursor.column == column && cursor.overflow) {
    this.screen_.cursorPosition.overflow = !0;
  }
};
hterm.Terminal.prototype.clearCursorOverflow = function() {
  this.screen_.cursorPosition.overflow = !1;
};
hterm.Terminal.prototype.saveCursorAndState = function(both) {
  both ? (this.primaryScreen_.saveCursorAndState(this.vt), this.alternateScreen_.saveCursorAndState(this.vt)) : this.screen_.saveCursorAndState(this.vt);
};
hterm.Terminal.prototype.restoreCursorAndState = function(both) {
  both ? (this.primaryScreen_.restoreCursorAndState(this.vt), this.alternateScreen_.restoreCursorAndState(this.vt)) : this.screen_.restoreCursorAndState(this.vt);
};
hterm.Terminal.prototype.setCursorShape = function(shape) {
  this.cursorShape_ = shape;
  this.restyleCursor_();
};
hterm.Terminal.prototype.getCursorShape = function() {
  return this.cursorShape_;
};
hterm.Terminal.prototype.setWidth = function(columnCount) {
  null == columnCount ? this.div_.style.width = "100%" : (this.div_.style.width = Math.ceil(this.scrollPort_.characterSize.width * columnCount + this.scrollPort_.currentScrollbarWidthPx) + "px", this.realizeSize_(columnCount, this.screenSize.height), this.scheduleSyncCursorPosition_());
};
hterm.Terminal.prototype.setHeight = function(rowCount) {
  null == rowCount ? this.div_.style.height = "100%" : (this.div_.style.height = this.scrollPort_.characterSize.height * rowCount + "px", this.realizeSize_(this.screenSize.width, rowCount), this.scheduleSyncCursorPosition_());
};
hterm.Terminal.prototype.realizeSize_ = function(columnCount, rowCount) {
  columnCount != this.screenSize.width && this.realizeWidth_(columnCount);
  rowCount != this.screenSize.height && this.realizeHeight_(rowCount);
  this.io.onTerminalResize_(columnCount, rowCount);
};
hterm.Terminal.prototype.realizeWidth_ = function(columnCount) {
  if (0 >= columnCount) {
    throw Error("Attempt to realize bad width: " + columnCount);
  }
  var deltaColumns = columnCount - this.screen_.getWidth();
  this.screenSize.width = columnCount;
  this.screen_.setColumnCount(columnCount);
  if (0 < deltaColumns) {
    this.defaultTabStops && this.setDefaultTabStops(this.screenSize.width - deltaColumns);
  } else {
    for (var i = this.tabStops_.length - 1; 0 <= i && !(this.tabStops_[i] < columnCount); i--) {
      this.tabStops_.pop();
    }
  }
  this.screen_.setColumnCount(this.screenSize.width);
};
hterm.Terminal.prototype.realizeHeight_ = function(rowCount) {
  if (0 >= rowCount) {
    throw Error("Attempt to realize bad height: " + rowCount);
  }
  var deltaRows = rowCount - this.screen_.getHeight();
  this.screenSize.height = rowCount;
  var cursor = this.saveCursor();
  if (0 > deltaRows) {
    for (deltaRows *= -1; deltaRows;) {
      var lastRow = this.getRowCount() - 1;
      if (lastRow - this.scrollbackRows_.length == cursor.row) {
        break;
      }
      if (this.getRowText(lastRow)) {
        break;
      }
      this.screen_.popRow();
      deltaRows--;
    }
    var ary = this.screen_.shiftRows(deltaRows);
    this.scrollbackRows_.push.apply(this.scrollbackRows_, ary);
    cursor.row = Math.max(cursor.row - deltaRows, 0);
  } else {
    if (0 < deltaRows) {
      if (deltaRows <= this.scrollbackRows_.length) {
        var scrollbackCount = Math.min(deltaRows, this.scrollbackRows_.length), rows = this.scrollbackRows_.splice(this.scrollbackRows_.length - scrollbackCount, scrollbackCount);
        this.screen_.unshiftRows(rows);
        deltaRows -= scrollbackCount;
        cursor.row += scrollbackCount;
      }
      deltaRows && this.appendRows_(deltaRows);
    }
  }
  this.setVTScrollRegion(null, null);
  this.restoreCursor(cursor);
};
hterm.Terminal.prototype.scrollHome = function() {
  this.scrollPort_.scrollRowToTop(0);
};
hterm.Terminal.prototype.scrollEnd = function() {
  this.scrollPort_.scrollRowToBottom(this.getRowCount());
};
hterm.Terminal.prototype.scrollPageUp = function() {
  this.scrollPort_.scrollPageUp();
};
hterm.Terminal.prototype.scrollPageDown = function() {
  this.scrollPort_.scrollPageDown();
};
hterm.Terminal.prototype.scrollLineUp = function() {
  var i = this.scrollPort_.getTopRowIndex();
  this.scrollPort_.scrollRowToTop(i - 1);
};
hterm.Terminal.prototype.scrollLineDown = function() {
  var i = this.scrollPort_.getTopRowIndex();
  this.scrollPort_.scrollRowToTop(i + 1);
};
hterm.Terminal.prototype.wipeContents = function() {
  this.clearHome(this.primaryScreen_);
  this.clearHome(this.alternateScreen_);
  this.clearScrollback();
};
hterm.Terminal.prototype.clearScrollback = function() {
  var $jscomp$this = this;
  this.scrollEnd();
  this.scrollbackRows_.length = 0;
  this.scrollPort_.resetCache();
  [this.primaryScreen_, this.alternateScreen_].forEach(function(screen) {
    var bottom = screen.getHeight();
    $jscomp$this.renumberRows_(0, bottom, screen);
  });
  this.syncCursorPosition_();
  this.scrollPort_.invalidate();
};
hterm.Terminal.prototype.reset = function() {
  var $jscomp$this = this;
  this.vt.reset();
  this.clearAllTabStops();
  this.setDefaultTabStops();
  var resetScreen = function(screen) {
    screen.textAttributes.reset();
    screen.textAttributes.resetColorPalette();
    $jscomp$this.clearHome(screen);
    screen.saveCursorAndState($jscomp$this.vt);
  };
  resetScreen(this.primaryScreen_);
  resetScreen(this.alternateScreen_);
  this.options_ = new hterm.Options;
  this.setCursorBlink(!!this.prefs_.get("cursor-blink"));
  this.setVTScrollRegion(null, null);
  this.setCursorVisible(!0);
};
hterm.Terminal.prototype.softReset = function() {
  var $jscomp$this = this;
  this.vt.reset();
  this.options_ = new hterm.Options;
  this.options_.cursorBlink = !!this.timeouts_.cursorBlink;
  var resetScreen = function(screen) {
    screen.textAttributes.reset();
    screen.textAttributes.resetColorPalette();
    screen.saveCursorAndState($jscomp$this.vt);
  };
  resetScreen(this.primaryScreen_);
  resetScreen(this.alternateScreen_);
  this.setVTScrollRegion(null, null);
  this.setCursorVisible(!0);
};
hterm.Terminal.prototype.forwardTabStop = function() {
  for (var column = this.screen_.cursorPosition.column, i = 0; i < this.tabStops_.length; i++) {
    if (this.tabStops_[i] > column) {
      this.setCursorColumn(this.tabStops_[i]);
      return;
    }
  }
  var overflow = this.screen_.cursorPosition.overflow;
  this.setCursorColumn(this.screenSize.width - 1);
  this.screen_.cursorPosition.overflow = overflow;
};
hterm.Terminal.prototype.backwardTabStop = function() {
  for (var column = this.screen_.cursorPosition.column, i = this.tabStops_.length - 1; 0 <= i; i--) {
    if (this.tabStops_[i] < column) {
      this.setCursorColumn(this.tabStops_[i]);
      return;
    }
  }
  this.setCursorColumn(1);
};
hterm.Terminal.prototype.setTabStop = function(column) {
  for (var i = this.tabStops_.length - 1; 0 <= i; i--) {
    if (this.tabStops_[i] == column) {
      return;
    }
    if (this.tabStops_[i] < column) {
      this.tabStops_.splice(i + 1, 0, column);
      return;
    }
  }
  this.tabStops_.splice(0, 0, column);
};
hterm.Terminal.prototype.clearTabStopAtCursor = function() {
  var i = this.tabStops_.indexOf(this.screen_.cursorPosition.column);
  -1 != i && this.tabStops_.splice(i, 1);
};
hterm.Terminal.prototype.clearAllTabStops = function() {
  this.tabStops_.length = 0;
  this.defaultTabStops = !1;
};
hterm.Terminal.prototype.setDefaultTabStops = function(opt_start) {
  for (var start = opt_start || 0, w = this.tabWidth, i = start - 1 - (start - 1) % w + w; i < this.screenSize.width; i += w) {
    this.setTabStop(i);
  }
  this.defaultTabStops = !0;
};
hterm.Terminal.prototype.interpret = function(str) {
  this.scheduleSyncCursorPosition_();
  this.vt.interpret(str);
};
hterm.Terminal.prototype.decorate = function(div) {
  var $jscomp$this = this, charset = div.ownerDocument.characterSet.toLowerCase();
  "utf-8" != charset && console.warn('Document encoding should be set to utf-8, not "' + charset + "\"; Add <meta charset='utf-8'/> to your HTML <head> to fix.");
  this.div_ = div;
  this.accessibilityReader_ = new hterm.AccessibilityReader(div);
  this.scrollPort_.decorate(div, function() {
    return $jscomp$this.setupScrollPort_();
  });
};
hterm.Terminal.prototype.setupScrollPort_ = function() {
  this.scrollPort_.setBackgroundImage(this.prefs_.get("background-image"));
  this.scrollPort_.setBackgroundSize(this.prefs_.get("background-size"));
  this.scrollPort_.setBackgroundPosition(this.prefs_.get("background-position"));
  this.scrollPort_.setUserCssUrl(this.prefs_.get("user-css"));
  this.scrollPort_.setUserCssText(this.prefs_.get("user-css-text"));
  this.scrollPort_.setAccessibilityReader(this.accessibilityReader_);
  this.div_.focus = this.focus.bind(this);
  this.setFontSize(this.prefs_.get("font-size"));
  this.syncFontFamily();
  this.setScrollbarVisible(this.prefs_.get("scrollbar-visible"));
  this.setScrollWheelMoveMultipler(this.prefs_.get("scroll-wheel-move-multiplier"));
  this.document_ = this.scrollPort_.getDocument();
  this.accessibilityReader_.decorate(this.document_);
  this.document_.body.oncontextmenu = function() {
    return !1;
  };
  this.contextMenu.setDocument(this.document_);
  var onMouse = this.onMouse_.bind(this), screenNode = this.scrollPort_.getScreenNode();
  screenNode.addEventListener("mousedown", onMouse);
  screenNode.addEventListener("mouseup", onMouse);
  screenNode.addEventListener("mousemove", onMouse);
  this.scrollPort_.onScrollWheel = onMouse;
  screenNode.addEventListener("keydown", this.onKeyboardActivity_.bind(this));
  screenNode.addEventListener("focus", this.onFocusChange_.bind(this, !0));
  screenNode.addEventListener("mousedown", function() {
    setTimeout(this.onFocusChange_.bind(this, !0));
  }.bind(this));
  screenNode.addEventListener("blur", this.onFocusChange_.bind(this, !1));
  var style = this.document_.createElement("style");
  style.textContent = '.cursor-node[focus="false"] {  box-sizing: border-box;  background-color: transparent !important;  border-width: 2px;  border-style: solid;}menu {  margin: 0;  padding: 0;  cursor: var(--hterm-mouse-cursor-pointer);}menuitem {  white-space: nowrap;  border-bottom: 1px dashed;  display: block;  padding: 0.3em 0.3em 0 0.3em;}menuitem.separator {  border-bottom: none;  height: 0.5em;  padding: 0;}menuitem:hover {  color: var(--hterm-cursor-color);}.wc-node {  display: inline-block;  text-align: center;  width: calc(var(--hterm-charsize-width) * 2);  line-height: var(--hterm-charsize-height);}:root {  --hterm-charsize-width: ' + 
  this.scrollPort_.characterSize.width + "px;  --hterm-charsize-height: " + this.scrollPort_.characterSize.height + "px;  --hterm-cursor-offset-col: -1;  --hterm-cursor-offset-row: -1;  --hterm-blink-node-duration: 0.7s;  --hterm-mouse-cursor-default: default;  --hterm-mouse-cursor-text: text;  --hterm-mouse-cursor-pointer: pointer;  --hterm-mouse-cursor-style: var(--hterm-mouse-cursor-text);}.uri-node:hover {  text-decoration: underline;  cursor: var(--hterm-mouse-cursor-pointer);}@keyframes blink {  from { opacity: 1.0; }  to { opacity: 0.0; }}.blink-node {  animation-name: blink;  animation-duration: var(--hterm-blink-node-duration);  animation-iteration-count: infinite;  animation-timing-function: ease-in-out;  animation-direction: alternate;}";
  this.document_.head.insertBefore(style, this.document_.head.firstChild);
  this.cursorNode_ = this.document_.createElement("div");
  this.cursorNode_.id = "hterm:terminal-cursor";
  this.cursorNode_.className = "cursor-node";
  this.cursorNode_.style.cssText = "position: absolute;left: calc(var(--hterm-charsize-width) * var(--hterm-cursor-offset-col));top: calc(var(--hterm-charsize-height) * var(--hterm-cursor-offset-row));display: " + (this.options_.cursorVisible ? "" : "none") + ";width: var(--hterm-charsize-width);height: var(--hterm-charsize-height);background-color: var(--hterm-cursor-color);border-color: var(--hterm-cursor-color);-webkit-transition: opacity, background-color 100ms linear;-moz-transition: opacity, background-color 100ms linear;";
  this.setCursorColor();
  this.setCursorBlink(!!this.prefs_.get("cursor-blink"));
  this.restyleCursor_();
  this.document_.body.appendChild(this.cursorNode_);
  this.scrollBlockerNode_ = this.document_.createElement("div");
  this.scrollBlockerNode_.id = "hterm:mouse-drag-scroll-blocker";
  this.scrollBlockerNode_.setAttribute("aria-hidden", "true");
  this.scrollBlockerNode_.style.cssText = "position: absolute;top: -99px;display: block;width: 10px;height: 10px;";
  this.document_.body.appendChild(this.scrollBlockerNode_);
  this.scrollPort_.onScrollWheel = onMouse;
  ["mousedown", "mouseup", "mousemove", "click", "dblclick", ].forEach(function(event) {
    this.scrollBlockerNode_.addEventListener(event, onMouse);
    this.cursorNode_.addEventListener(event, onMouse);
    this.document_.addEventListener(event, onMouse);
  }.bind(this));
  this.cursorNode_.addEventListener("mousedown", function() {
    setTimeout(this.focus.bind(this));
  }.bind(this));
  this.setReverseVideo(!1);
  this.scrollPort_.focus();
  this.scrollPort_.scheduleRedraw();
};
hterm.Terminal.prototype.getDocument = function() {
  return this.document_;
};
hterm.Terminal.prototype.focus = function() {
  this.scrollPort_.focus();
};
hterm.Terminal.prototype.getRowNode = function(index) {
  return index < this.scrollbackRows_.length ? this.scrollbackRows_[index] : this.screen_.rowsArray[index - this.scrollbackRows_.length];
};
hterm.Terminal.prototype.getRowsText = function(start, end) {
  for (var ary = [], i = start; i < end; i++) {
    var node = this.getRowNode(i);
    ary.push(node.textContent);
    i < end - 1 && !node.getAttribute("line-overflow") && ary.push("\n");
  }
  return ary.join("");
};
hterm.Terminal.prototype.getRowText = function(index) {
  return this.getRowNode(index).textContent;
};
hterm.Terminal.prototype.getRowCount = function() {
  return this.scrollbackRows_.length + this.screen_.rowsArray.length;
};
hterm.Terminal.prototype.appendRows_ = function(count) {
  for (var cursorRow = this.screen_.rowsArray.length, offset = this.scrollbackRows_.length + cursorRow, i = 0; i < count; i++) {
    var row = this.document_.createElement("x-row");
    row.appendChild(this.document_.createTextNode(""));
    row.rowIndex = offset + i;
    this.screen_.pushRow(row);
  }
  var extraRows = this.screen_.rowsArray.length - this.screenSize.height;
  if (0 < extraRows) {
    var ary = this.screen_.shiftRows(extraRows);
    Array.prototype.push.apply(this.scrollbackRows_, ary);
    this.scrollPort_.isScrolledEnd && this.scheduleScrollDown_();
  }
  cursorRow >= this.screen_.rowsArray.length && (cursorRow = this.screen_.rowsArray.length - 1);
  this.setAbsoluteCursorPosition(cursorRow, 0);
};
hterm.Terminal.prototype.moveRows_ = function(fromIndex, count, toIndex) {
  var ary = this.screen_.removeRows(fromIndex, count);
  this.screen_.insertRows(toIndex, ary);
  if (fromIndex < toIndex) {
    var start = fromIndex;
    var end = toIndex + count;
  } else {
    start = toIndex, end = fromIndex + count;
  }
  this.renumberRows_(start, end);
  this.scrollPort_.scheduleInvalidate();
};
hterm.Terminal.prototype.renumberRows_ = function(start, end, opt_screen) {
  for (var screen = opt_screen || this.screen_, offset = this.scrollbackRows_.length, i = start; i < end; i++) {
    screen.rowsArray[i].rowIndex = offset + i;
  }
};
hterm.Terminal.prototype.print = function(str) {
  this.scheduleSyncCursorPosition_();
  this.accessibilityReader_.announce(str);
  var startOffset = 0, strWidth = lib.wc.strWidth(str);
  for (0 == strWidth && str && (strWidth = 1); startOffset < strWidth;) {
    this.options_.wraparound && this.screen_.cursorPosition.overflow && (this.screen_.commitLineOverflow(), this.newLine(!0));
    var count = strWidth - startOffset, didOverflow = !1;
    this.screen_.cursorPosition.column + count >= this.screenSize.width && (didOverflow = !0, count = this.screenSize.width - this.screen_.cursorPosition.column);
    if (didOverflow && !this.options_.wraparound) {
      var substr = lib.wc.substr(str, startOffset, count - 1) + lib.wc.substr(str, strWidth - 1);
      count = strWidth;
    } else {
      substr = lib.wc.substr(str, startOffset, count);
    }
    for (var tokens = hterm.TextAttributes.splitWidecharString(substr), i = 0; i < tokens.length; i++) {
      this.screen_.textAttributes.wcNode = tokens[i].wcNode, this.screen_.textAttributes.asciiNode = tokens[i].asciiNode, this.options_.insertMode ? this.screen_.insertString(tokens[i].str, tokens[i].wcStrWidth) : this.screen_.overwriteString(tokens[i].str, tokens[i].wcStrWidth), this.screen_.textAttributes.wcNode = !1, this.screen_.textAttributes.asciiNode = !0;
    }
    this.screen_.maybeClipCurrentRow();
    startOffset += count;
  }
  this.scrollOnOutput_ && this.scrollPort_.scrollRowToBottom(this.getRowCount());
};
hterm.Terminal.prototype.setVTScrollRegion = function(scrollTop, scrollBottom) {
  0 == scrollTop && scrollBottom == this.screenSize.height - 1 ? this.vtScrollBottom_ = this.vtScrollTop_ = null : (this.vtScrollTop_ = scrollTop, this.vtScrollBottom_ = scrollBottom);
};
hterm.Terminal.prototype.getVTScrollTop = function() {
  return null != this.vtScrollTop_ ? this.vtScrollTop_ : 0;
};
hterm.Terminal.prototype.getVTScrollBottom = function() {
  return null != this.vtScrollBottom_ ? this.vtScrollBottom_ : this.screenSize.height - 1;
};
hterm.Terminal.prototype.newLine = function(dueToOverflow) {
  (void 0 === dueToOverflow ? 0 : dueToOverflow) || this.accessibilityReader_.newLine();
  var cursorAtEndOfScreen = this.screen_.cursorPosition.row == this.screen_.rowsArray.length - 1;
  null != this.vtScrollBottom_ ? this.screen_.cursorPosition.row == this.vtScrollBottom_ ? (this.vtScrollUp(1), this.setAbsoluteCursorPosition(this.screen_.cursorPosition.row, 0)) : cursorAtEndOfScreen ? this.setAbsoluteCursorPosition(this.screen_.cursorPosition.row, 0) : this.setAbsoluteCursorPosition(this.screen_.cursorPosition.row + 1, 0) : cursorAtEndOfScreen ? this.appendRows_(1) : this.setAbsoluteCursorPosition(this.screen_.cursorPosition.row + 1, 0);
};
hterm.Terminal.prototype.lineFeed = function() {
  var column = this.screen_.cursorPosition.column;
  this.newLine();
  this.setCursorColumn(column);
};
hterm.Terminal.prototype.formFeed = function() {
  this.options_.autoCarriageReturn ? this.newLine() : this.lineFeed();
};
hterm.Terminal.prototype.reverseLineFeed = function() {
  var scrollTop = this.getVTScrollTop(), currentRow = this.screen_.cursorPosition.row;
  currentRow == scrollTop ? this.insertLines(1) : this.setAbsoluteCursorRow(currentRow - 1);
};
hterm.Terminal.prototype.eraseToLeft = function() {
  var cursor = this.saveCursor();
  this.setCursorColumn(0);
  var count = cursor.column + 1;
  this.screen_.overwriteString(lib.f.getWhitespace(count), count);
  this.restoreCursor(cursor);
};
hterm.Terminal.prototype.eraseToRight = function(opt_count) {
  if (!this.screen_.cursorPosition.overflow) {
    var maxCount = this.screenSize.width - this.screen_.cursorPosition.column, count = opt_count ? Math.min(opt_count, maxCount) : maxCount;
    if (this.screen_.textAttributes.background === this.screen_.textAttributes.DEFAULT_COLOR && hterm.TextAttributes.nodeWidth(this.screen_.rowsArray[this.screen_.cursorPosition.row]) <= this.screen_.cursorPosition.column + count) {
      this.screen_.deleteChars(count);
    } else {
      var cursor = this.saveCursor();
      this.screen_.overwriteString(lib.f.getWhitespace(count), count);
      this.restoreCursor(cursor);
    }
    this.clearCursorOverflow();
  }
};
hterm.Terminal.prototype.eraseLine = function() {
  var cursor = this.saveCursor();
  this.screen_.clearCursorRow();
  this.restoreCursor(cursor);
  this.clearCursorOverflow();
};
hterm.Terminal.prototype.eraseAbove = function() {
  var cursor = this.saveCursor();
  this.eraseToLeft();
  for (var i = 0; i < cursor.row; i++) {
    this.setAbsoluteCursorPosition(i, 0), this.screen_.clearCursorRow();
  }
  this.restoreCursor(cursor);
  this.clearCursorOverflow();
};
hterm.Terminal.prototype.eraseBelow = function() {
  var cursor = this.saveCursor();
  this.eraseToRight();
  for (var bottom = this.screenSize.height - 1, i = cursor.row + 1; i <= bottom; i++) {
    this.setAbsoluteCursorPosition(i, 0), this.screen_.clearCursorRow();
  }
  this.restoreCursor(cursor);
  this.clearCursorOverflow();
};
hterm.Terminal.prototype.fill = function(ch) {
  var cursor = this.saveCursor();
  this.setAbsoluteCursorPosition(0, 0);
  for (var row = 0; row < this.screenSize.height; row++) {
    for (var col = 0; col < this.screenSize.width; col++) {
      this.setAbsoluteCursorPosition(row, col), this.screen_.overwriteString(ch, 1);
    }
  }
  this.restoreCursor(cursor);
};
hterm.Terminal.prototype.clearHome = function(opt_screen) {
  var screen = opt_screen || this.screen_, bottom = screen.getHeight();
  this.accessibilityReader_.clear();
  if (0 != bottom) {
    for (var i = 0; i < bottom; i++) {
      screen.setCursorPosition(i, 0), screen.clearCursorRow();
    }
    screen.setCursorPosition(0, 0);
  }
};
hterm.Terminal.prototype.clear = function(opt_screen) {
  var screen = opt_screen || this.screen_, cursor = screen.cursorPosition.clone();
  this.clearHome(screen);
  screen.setCursorPosition(cursor.row, cursor.column);
};
hterm.Terminal.prototype.insertLines = function(count) {
  var cursorRow = this.screen_.cursorPosition.row, bottom = this.getVTScrollBottom();
  count = Math.min(count, bottom - cursorRow);
  var moveCount = bottom - cursorRow - count + 1;
  moveCount && this.moveRows_(cursorRow, moveCount, cursorRow + count);
  for (var i = count - 1; 0 <= i; i--) {
    this.setAbsoluteCursorPosition(cursorRow + i, 0), this.screen_.clearCursorRow();
  }
};
hterm.Terminal.prototype.deleteLines = function(count) {
  var cursor = this.saveCursor(), top = cursor.row, bottom = this.getVTScrollBottom(), maxCount = bottom - top + 1;
  count = Math.min(count, maxCount);
  var moveStart = bottom - count + 1;
  count != maxCount && this.moveRows_(top, count, moveStart);
  for (var i = 0; i < count; i++) {
    this.setAbsoluteCursorPosition(moveStart + i, 0), this.screen_.clearCursorRow();
  }
  this.restoreCursor(cursor);
  this.clearCursorOverflow();
};
hterm.Terminal.prototype.insertSpace = function(count) {
  var cursor = this.saveCursor(), ws = lib.f.getWhitespace(count || 1);
  this.screen_.insertString(ws, ws.length);
  this.screen_.maybeClipCurrentRow();
  this.restoreCursor(cursor);
  this.clearCursorOverflow();
};
hterm.Terminal.prototype.deleteChars = function(count) {
  var deleted = this.screen_.deleteChars(count);
  if (deleted && !this.screen_.textAttributes.isDefault()) {
    var cursor = this.saveCursor();
    this.setCursorColumn(this.screenSize.width - deleted);
    this.screen_.insertString(lib.f.getWhitespace(deleted));
    this.restoreCursor(cursor);
  }
  this.clearCursorOverflow();
};
hterm.Terminal.prototype.vtScrollUp = function(count) {
  var cursor = this.saveCursor();
  this.setAbsoluteCursorRow(this.getVTScrollTop());
  this.deleteLines(count);
  this.restoreCursor(cursor);
};
hterm.Terminal.prototype.vtScrollDown = function(opt_count) {
  var cursor = this.saveCursor();
  this.setAbsoluteCursorPosition(this.getVTScrollTop(), 0);
  this.insertLines(opt_count);
  this.restoreCursor(cursor);
};
hterm.Terminal.prototype.setAccessibilityEnabled = function(enabled) {
  this.accessibilityReader_.setAccessibilityEnabled(enabled);
};
hterm.Terminal.prototype.setCursorPosition = function(row, column) {
  this.options_.originMode ? this.setRelativeCursorPosition(row, column) : this.setAbsoluteCursorPosition(row, column);
};
hterm.Terminal.prototype.setRelativeCursorPosition = function(row, column) {
  var scrollTop = this.getVTScrollTop();
  row = lib.f.clamp(row + scrollTop, scrollTop, this.getVTScrollBottom());
  column = lib.f.clamp(column, 0, this.screenSize.width - 1);
  this.screen_.setCursorPosition(row, column);
};
hterm.Terminal.prototype.setAbsoluteCursorPosition = function(row, column) {
  row = lib.f.clamp(row, 0, this.screenSize.height - 1);
  column = lib.f.clamp(column, 0, this.screenSize.width - 1);
  this.screen_.setCursorPosition(row, column);
};
hterm.Terminal.prototype.setCursorColumn = function(column) {
  this.setAbsoluteCursorPosition(this.screen_.cursorPosition.row, column);
};
hterm.Terminal.prototype.getCursorColumn = function() {
  return this.screen_.cursorPosition.column;
};
hterm.Terminal.prototype.setAbsoluteCursorRow = function(row) {
  this.setAbsoluteCursorPosition(row, this.screen_.cursorPosition.column);
};
hterm.Terminal.prototype.getCursorRow = function() {
  return this.screen_.cursorPosition.row;
};
hterm.Terminal.prototype.scheduleRedraw_ = function() {
  if (!this.timeouts_.redraw) {
    var self = this;
    this.timeouts_.redraw = setTimeout(function() {
      delete self.timeouts_.redraw;
      self.scrollPort_.redraw_();
    }, 0);
  }
};
hterm.Terminal.prototype.scheduleScrollDown_ = function() {
  if (!this.timeouts_.scrollDown) {
    var self = this;
    this.timeouts_.scrollDown = setTimeout(function() {
      delete self.timeouts_.scrollDown;
      self.scrollPort_.scrollRowToBottom(self.getRowCount());
    }, 10);
  }
};
hterm.Terminal.prototype.cursorUp = function(count) {
  return this.cursorDown(-(count || 1));
};
hterm.Terminal.prototype.cursorDown = function(count) {
  count = count || 1;
  var minHeight = this.options_.originMode ? this.getVTScrollTop() : 0, maxHeight = this.options_.originMode ? this.getVTScrollBottom() : this.screenSize.height - 1, row = lib.f.clamp(this.screen_.cursorPosition.row + count, minHeight, maxHeight);
  this.setAbsoluteCursorRow(row);
};
hterm.Terminal.prototype.cursorLeft = function(count) {
  count = count || 1;
  if (!(1 > count)) {
    var currentColumn = this.screen_.cursorPosition.column;
    if (this.options_.reverseWraparound) {
      if (this.screen_.cursorPosition.overflow && (count--, this.clearCursorOverflow(), !count)) {
        return;
      }
      var newRow = this.screen_.cursorPosition.row, newColumn = currentColumn - count;
      0 > newColumn && (newRow = newRow - Math.floor(count / this.screenSize.width) - 1, 0 > newRow && (newRow = this.screenSize.height + newRow % this.screenSize.height), newColumn = this.screenSize.width + newColumn % this.screenSize.width);
      this.setCursorPosition(Math.max(newRow, 0), newColumn);
    } else {
      newColumn = Math.max(currentColumn - count, 0), this.setCursorColumn(newColumn);
    }
  }
};
hterm.Terminal.prototype.cursorRight = function(count) {
  count = count || 1;
  if (!(1 > count)) {
    var column = lib.f.clamp(this.screen_.cursorPosition.column + count, 0, this.screenSize.width - 1);
    this.setCursorColumn(column);
  }
};
hterm.Terminal.prototype.setReverseVideo = function(state) {
  (this.options_.reverseVideo = state) ? (this.scrollPort_.setForegroundColor(this.prefs_.get("background-color")), this.scrollPort_.setBackgroundColor(this.prefs_.get("foreground-color"))) : (this.scrollPort_.setForegroundColor(this.prefs_.get("foreground-color")), this.scrollPort_.setBackgroundColor(this.prefs_.get("background-color")));
};
hterm.Terminal.prototype.ringBell = function() {
  this.cursorNode_.style.backgroundColor = this.scrollPort_.getForegroundColor();
  var self = this;
  setTimeout(function() {
    self.restyleCursor_();
  }, 200);
  if (!this.bellSquelchTimeout_ && (this.bellAudio_.getAttribute("src") ? (this.bellAudio_.play(), this.bellSequelchTimeout_ = setTimeout(function() {
    delete this.bellSquelchTimeout_;
  }.bind(this), 500)) : delete this.bellSquelchTimeout_, this.desktopNotificationBell_ && !this.document_.hasFocus())) {
    var n = hterm.notify();
    this.bellNotificationList_.push(n);
    n.onclick = function() {
      self.closeBellNotifications_();
    };
  }
};
hterm.Terminal.prototype.setOriginMode = function(state) {
  this.options_.originMode = state;
  this.setCursorPosition(0, 0);
};
hterm.Terminal.prototype.setInsertMode = function(state) {
  this.options_.insertMode = state;
};
hterm.Terminal.prototype.setAutoCarriageReturn = function(state) {
  this.options_.autoCarriageReturn = state;
};
hterm.Terminal.prototype.setWraparound = function(state) {
  this.options_.wraparound = state;
};
hterm.Terminal.prototype.setReverseWraparound = function(state) {
  this.options_.reverseWraparound = state;
};
hterm.Terminal.prototype.setAlternateMode = function(state) {
  var cursor = this.saveCursor();
  this.screen_ = state ? this.alternateScreen_ : this.primaryScreen_;
  if (this.screen_.rowsArray.length && this.screen_.rowsArray[0].rowIndex != this.scrollbackRows_.length) {
    for (var offset = this.scrollbackRows_.length, ary = this.screen_.rowsArray, i = 0; i < ary.length; i++) {
      ary[i].rowIndex = offset + i;
    }
  }
  this.realizeWidth_(this.screenSize.width);
  this.realizeHeight_(this.screenSize.height);
  this.scrollPort_.syncScrollHeight();
  this.scrollPort_.invalidate();
  this.restoreCursor(cursor);
  this.scrollPort_.resize();
};
hterm.Terminal.prototype.setCursorBlink = function(state) {
  this.options_.cursorBlink = state;
  !state && this.timeouts_.cursorBlink && (clearTimeout(this.timeouts_.cursorBlink), delete this.timeouts_.cursorBlink);
  this.options_.cursorVisible && this.setCursorVisible(!0);
};
hterm.Terminal.prototype.setCursorVisible = function(state) {
  if (this.options_.cursorVisible = state) {
    if (this.syncCursorPosition_(), this.cursorNode_.style.opacity = "1", this.options_.cursorBlink) {
      if (!this.timeouts_.cursorBlink) {
        this.onCursorBlink_();
      }
    } else {
      this.timeouts_.cursorBlink && (clearTimeout(this.timeouts_.cursorBlink), delete this.timeouts_.cursorBlink);
    }
  } else {
    this.timeouts_.cursorBlink && (clearTimeout(this.timeouts_.cursorBlink), delete this.timeouts_.cursorBlink), this.cursorNode_.style.opacity = "0";
  }
};
hterm.Terminal.prototype.syncCursorPosition_ = function() {
  var topRowIndex = this.scrollPort_.getTopRowIndex(), bottomRowIndex = this.scrollPort_.getBottomRowIndex(topRowIndex), cursorRowIndex = this.scrollbackRows_.length + this.screen_.cursorPosition.row, forceSyncSelection = !1;
  if (this.accessibilityReader_.accessibilityEnabled) {
    var cursorColumnIndex = this.screen_.cursorPosition.column, cursorLineText = this.screen_.rowsArray[this.screen_.cursorPosition.row].innerText;
    forceSyncSelection = this.accessibilityReader_.hasUserGesture;
    this.accessibilityReader_.afterCursorChange(cursorLineText, cursorRowIndex, cursorColumnIndex);
  }
  if (cursorRowIndex > bottomRowIndex) {
    return this.setCssVar("cursor-offset-row", "-1"), !1;
  }
  this.options_.cursorVisible && "none" == this.cursorNode_.style.display && (this.cursorNode_.style.display = "");
  this.setCssVar("cursor-offset-row", cursorRowIndex - topRowIndex + " + " + (this.scrollPort_.visibleRowTopMargin + "px"));
  this.setCssVar("cursor-offset-col", this.screen_.cursorPosition.column);
  this.cursorNode_.setAttribute("title", "(" + this.screen_.cursorPosition.column + ", " + this.screen_.cursorPosition.row + ")");
  var selection = this.document_.getSelection();
  selection && (selection.isCollapsed || forceSyncSelection) && this.screen_.syncSelectionCaret(selection);
  return !0;
};
hterm.Terminal.prototype.restyleCursor_ = function() {
  var shape = this.cursorShape_;
  "false" == this.cursorNode_.getAttribute("focus") && (shape = hterm.Terminal.cursorShape.BLOCK);
  var style = this.cursorNode_.style;
  switch(shape) {
    case hterm.Terminal.cursorShape.BEAM:
      style.height = "var(--hterm-charsize-height)";
      style.backgroundColor = "transparent";
      style.borderBottomStyle = null;
      style.borderLeftStyle = "solid";
      break;
    case hterm.Terminal.cursorShape.UNDERLINE:
      style.height = this.scrollPort_.characterSize.baseline + "px";
      style.backgroundColor = "transparent";
      style.borderBottomStyle = "solid";
      style.borderLeftStyle = null;
      break;
    default:
      style.height = "var(--hterm-charsize-height)", style.backgroundColor = "var(--hterm-cursor-color)", style.borderBottomStyle = null, style.borderLeftStyle = null;
  }
};
hterm.Terminal.prototype.scheduleSyncCursorPosition_ = function() {
  if (!this.timeouts_.syncCursor) {
    this.accessibilityReader_.accessibilityEnabled && this.accessibilityReader_.beforeCursorChange(this.screen_.rowsArray[this.screen_.cursorPosition.row].innerText, this.scrollbackRows_.length + this.screen_.cursorPosition.row, this.screen_.cursorPosition.column);
    var self = this;
    this.timeouts_.syncCursor = setTimeout(function() {
      self.syncCursorPosition_();
      delete self.timeouts_.syncCursor;
    }, 0);
  }
};
hterm.Terminal.prototype.showZoomWarning_ = function(state) {
  if (!this.zoomWarningNode_) {
    if (!state) {
      return;
    }
    this.zoomWarningNode_ = this.document_.createElement("div");
    this.zoomWarningNode_.id = "hterm:zoom-warning";
    this.zoomWarningNode_.style.cssText = "color: black;background-color: #ff2222;font-size: large;border-radius: 8px;opacity: 0.75;padding: 0.2em 0.5em 0.2em 0.5em;top: 0.5em;right: 1.2em;position: absolute;-webkit-text-size-adjust: none;-webkit-user-select: none;-moz-text-size-adjust: none;-moz-user-select: none;";
    this.zoomWarningNode_.addEventListener("click", function(e) {
      this.parentNode.removeChild(this);
    });
  }
  this.zoomWarningNode_.textContent = lib.MessageManager.replaceReferences(hterm.zoomWarningMessage, [parseInt(100 * this.scrollPort_.characterSize.zoomFactor)]);
  this.zoomWarningNode_.style.fontFamily = this.prefs_.get("font-family");
  state ? this.zoomWarningNode_.parentNode || this.div_.parentNode.appendChild(this.zoomWarningNode_) : this.zoomWarningNode_.parentNode && this.zoomWarningNode_.parentNode.removeChild(this.zoomWarningNode_);
};
hterm.Terminal.prototype.showOverlay = function(msg, opt_timeout) {
  var $jscomp$this = this;
  if (!this.overlayNode_) {
    if (!this.div_) {
      return;
    }
    this.overlayNode_ = this.document_.createElement("div");
    this.overlayNode_.style.cssText = "border-radius: 15px;font-size: xx-large;opacity: 0.75;padding: 0.2em 0.5em 0.2em 0.5em;position: absolute;-webkit-user-select: none;-webkit-transition: opacity 180ms ease-in;-moz-user-select: none;-moz-transition: opacity 180ms ease-in;";
    this.overlayNode_.addEventListener("mousedown", function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, !0);
  }
  this.overlayNode_.style.color = this.prefs_.get("background-color");
  this.overlayNode_.style.backgroundColor = this.prefs_.get("foreground-color");
  this.overlayNode_.style.fontFamily = this.prefs_.get("font-family");
  this.overlayNode_.textContent = msg;
  this.overlayNode_.style.opacity = "0.75";
  this.overlayNode_.parentNode || this.div_.appendChild(this.overlayNode_);
  var divSize = hterm.getClientSize(this.div_), overlaySize = hterm.getClientSize(this.overlayNode_);
  this.overlayNode_.style.top = (divSize.height - overlaySize.height) / 2 + "px";
  this.overlayNode_.style.left = (divSize.width - overlaySize.width - this.scrollPort_.currentScrollbarWidthPx) / 2 + "px";
  this.overlayTimeout_ && clearTimeout(this.overlayTimeout_);
  this.accessibilityReader_.assertiveAnnounce(msg);
  null !== opt_timeout && (this.overlayTimeout_ = setTimeout(function() {
    $jscomp$this.overlayNode_.style.opacity = "0";
    $jscomp$this.overlayTimeout_ = setTimeout(function() {
      return $jscomp$this.hideOverlay();
    }, 200);
  }, opt_timeout || 1500));
};
hterm.Terminal.prototype.hideOverlay = function() {
  this.overlayTimeout_ && clearTimeout(this.overlayTimeout_);
  this.overlayTimeout_ = null;
  this.overlayNode_.parentNode && this.overlayNode_.parentNode.removeChild(this.overlayNode_);
  this.overlayNode_.style.opacity = "0.75";
};
hterm.Terminal.prototype.paste = function() {
  return hterm.pasteFromClipboard(this.document_);
};
hterm.Terminal.prototype.copyStringToClipboard = function(str) {
  this.prefs_.get("enable-clipboard-notice") && setTimeout(this.showOverlay.bind(this, hterm.notifyCopyMessage, 500), 200);
  hterm.copySelectionToClipboard(this.document_, str);
};
hterm.Terminal.prototype.displayImage = function(options, onLoad, onError) {
  var $jscomp$this = this;
  if (void 0 !== options.uri) {
    if (options.name || (options.name = ""), !0 !== this.allowImagesInline) {
      this.newLine();
      var row = this.getRowNode(this.scrollbackRows_.length + this.getCursorRow() - 1);
      if (!1 === this.allowImagesInline) {
        row.textContent = hterm.msg("POPUP_INLINE_IMAGE_DISABLED", [], "Inline Images Disabled");
      } else {
        var span = this.document_.createElement("span");
        span.innerText = hterm.msg("POPUP_INLINE_IMAGE", [], "Inline Images");
        span.style.fontWeight = "bold";
        span.style.borderWidth = "1px";
        span.style.borderStyle = "dashed";
        var button = this.document_.createElement("span");
        button.innerText = hterm.msg("BUTTON_BLOCK", [], "block");
        button.style.marginLeft = "1em";
        button.style.borderWidth = "1px";
        button.style.borderStyle = "solid";
        button.addEventListener("click", function() {
          $jscomp$this.prefs_.set("allow-images-inline", !1);
        });
        span.appendChild(button);
        button = this.document_.createElement("span");
        button.innerText = hterm.msg("BUTTON_ALLOW_SESSION", [], "allow this session");
        button.style.marginLeft = "1em";
        button.style.borderWidth = "1px";
        button.style.borderStyle = "solid";
        button.addEventListener("click", function() {
          $jscomp$this.allowImagesInline = !0;
        });
        span.appendChild(button);
        button = this.document_.createElement("span");
        button.innerText = hterm.msg("BUTTON_ALLOW_ALWAYS", [], "always allow");
        button.style.marginLeft = "1em";
        button.style.borderWidth = "1px";
        button.style.borderStyle = "solid";
        button.addEventListener("click", function() {
          $jscomp$this.prefs_.set("allow-images-inline", !0);
        });
        span.appendChild(button);
        row.appendChild(span);
      }
    } else {
      if (options.inline) {
        var io = this.io.push();
        io.showOverlay(hterm.msg("LOADING_RESOURCE_START", [options.name], "Loading $1 ..."), null);
        io.onVTKeystroke = io.sendString = function() {
        };
        var img = this.document_.createElement("img");
        img.src = options.uri;
        img.title = img.alt = options.name;
        this.document_.body.appendChild(img);
        img.onload = function() {
          img.style.objectFit = options.preserveAspectRatio ? "scale-down" : "fill";
          img.style.maxWidth = $jscomp$this.document_.body.clientWidth + "px";
          img.style.maxHeight = $jscomp$this.document_.body.clientHeight + "px";
          var parseDim = function(dim, maxDim, cssVar) {
            if (!dim || "auto" == dim) {
              return "";
            }
            var ary = dim.match(/^([0-9]+)(px|%)?$/);
            return ary ? "%" == ary[2] ? maxDim * parseInt(ary[1]) / 100 + "px" : "px" == ary[2] ? dim : "calc(" + dim + " * var(" + cssVar + "))" : "";
          };
          img.style.width = parseDim(options.width, $jscomp$this.document_.body.clientWidth, "--hterm-charsize-width");
          img.style.height = parseDim(options.height, $jscomp$this.document_.body.clientHeight, "--hterm-charsize-height");
          for (var padRows = Math.ceil(img.clientHeight / $jscomp$this.scrollPort_.characterSize.height), i = 0; i < padRows; ++i) {
            $jscomp$this.newLine();
          }
          img.style.maxHeight = "calc(" + padRows + " * var(--hterm-charsize-height))";
          $jscomp$this.document_.body.removeChild(img);
          var div = $jscomp$this.document_.createElement("div");
          div.style.position = "relative";
          div.style.textAlign = options.align;
          img.style.position = "absolute";
          img.style.bottom = "calc(0px - var(--hterm-charsize-height))";
          div.appendChild(img);
          $jscomp$this.getRowNode($jscomp$this.scrollbackRows_.length + $jscomp$this.getCursorRow() - 1).appendChild(div);
          io.hideOverlay();
          io.pop();
          onLoad && onLoad();
        };
        img.onerror = function(e) {
          $jscomp$this.document_.body.removeChild(img);
          io.showOverlay(hterm.msg("LOADING_RESOURCE_FAILED", [options.name], "Loading $1 failed"));
          io.pop();
          onError && onError(e);
        };
      } else {
        var a = this.document_.createElement("a");
        a.href = options.uri;
        a.download = options.name;
        this.document_.body.appendChild(a);
        a.click();
        a.remove();
      }
    }
  }
};
hterm.Terminal.prototype.getSelectionText = function() {
  var selection = this.scrollPort_.selection;
  selection.sync();
  if (selection.isCollapsed) {
    return null;
  }
  var startOffset = selection.startOffset, node = selection.startNode;
  if (!node) {
    return null;
  }
  if ("X-ROW" != node.nodeName) {
    for ("#text" == node.nodeName && "SPAN" == node.parentNode.nodeName && (node = node.parentNode); node.previousSibling;) {
      node = node.previousSibling, startOffset += hterm.TextAttributes.nodeWidth(node);
    }
  }
  var endOffset = hterm.TextAttributes.nodeWidth(selection.endNode) - selection.endOffset;
  node = selection.endNode;
  if ("X-ROW" != node.nodeName) {
    for ("#text" == node.nodeName && "SPAN" == node.parentNode.nodeName && (node = node.parentNode); node.nextSibling;) {
      node = node.nextSibling, endOffset += hterm.TextAttributes.nodeWidth(node);
    }
  }
  var rv = this.getRowsText(selection.startRow.rowIndex, selection.endRow.rowIndex + 1);
  return lib.wc.substring(rv, startOffset, lib.wc.strWidth(rv) - endOffset);
};
hterm.Terminal.prototype.copySelectionToClipboard = function() {
  var text = this.getSelectionText();
  null != text && this.copyStringToClipboard(text);
};
hterm.Terminal.prototype.overlaySize = function() {
  this.showOverlay(this.screenSize.width + "x" + this.screenSize.height);
};
hterm.Terminal.prototype.onVTKeystroke = function(string) {
  this.scrollOnKeystroke_ && this.scrollPort_.scrollRowToBottom(this.getRowCount());
  this.io.onVTKeystroke(this.keyboard.encode(string));
};
hterm.Terminal.prototype.openSelectedUrl_ = function() {
  var str = this.getSelectionText();
  if (null == str && (this.screen_.expandSelectionForUrl(this.document_.getSelection()), str = this.getSelectionText(), null == str)) {
    return;
  }
  if (!(2048 < str.length || 0 <= str.search(/[\s\[\](){}<>"'\\^`]/))) {
    if (0 > str.search("^[a-zA-Z][a-zA-Z0-9+.-]*://")) {
      switch(str.split(":", 1)[0]) {
        case "mailto":
          break;
        default:
          str = "http://" + str;
      }
    }
    hterm.openUrl(str);
  }
};
hterm.Terminal.prototype.setAutomaticMouseHiding = function(v) {
  v = void 0 === v ? null : v;
  null === v && (v = "cros" != hterm.os && "mac" != hterm.os);
  this.mouseHideWhileTyping_ = !!v;
};
hterm.Terminal.prototype.onKeyboardActivity_ = function(e) {
  this.mouseHideWhileTyping_ && !this.mouseHideDelay_ && this.setCssVar("mouse-cursor-style", "none");
};
hterm.Terminal.prototype.onMouse_ = function(e) {
  var $jscomp$this = this;
  if (!e.processedByTerminalHandler_) {
    2 < e.button && e.preventDefault();
    var reportMouseEvents = !this.defeatMouseReports_ && this.vt.mouseReport != this.vt.MOUSE_REPORT_DISABLED;
    e.processedByTerminalHandler_ = !0;
    this.mouseHideWhileTyping_ && !this.mouseHideDelay_ && (this.syncMouseStyle(), this.mouseHideDelay_ = setTimeout(function() {
      return $jscomp$this.mouseHideDelay_ = null;
    }, 1000));
    e.terminalRow = parseInt((e.clientY - this.scrollPort_.visibleRowTopMargin) / this.scrollPort_.characterSize.height) + 1;
    e.terminalColumn = parseInt(e.clientX / this.scrollPort_.characterSize.width) + 1;
    if (!("mousedown" == e.type && e.terminalColumn > this.screenSize.width)) {
      this.options_.cursorVisible && !reportMouseEvents && (e.terminalRow - 1 == this.screen_.cursorPosition.row && e.terminalColumn - 1 == this.screen_.cursorPosition.column ? this.cursorNode_.style.display = "none" : "none" == this.cursorNode_.style.display && (this.cursorNode_.style.display = ""));
      "mousedown" == e.type && (this.contextMenu.hide(e), e.altKey || !reportMouseEvents ? (this.defeatMouseReports_ = !0, this.setSelectionEnabled(!0)) : (this.defeatMouseReports_ = !1, this.document_.getSelection().collapseToEnd(), this.setSelectionEnabled(!1), e.preventDefault()));
      if (reportMouseEvents) {
        this.scrollBlockerNode_.engaged || ("mousedown" == e.type ? (this.scrollBlockerNode_.engaged = !0, this.scrollBlockerNode_.style.top = e.clientY - 5 + "px", this.scrollBlockerNode_.style.left = e.clientX - 5 + "px") : "mousemove" == e.type && (this.document_.getSelection().collapseToEnd(), e.preventDefault())), this.onMouse(e);
      } else {
        "dblclick" == e.type && (this.screen_.expandSelection(this.document_.getSelection()), this.copyOnSelect && this.copySelectionToClipboard());
        if ("click" == e.type && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
          clearTimeout(this.timeouts_.openUrl);
          this.timeouts_.openUrl = setTimeout(this.openSelectedUrl_.bind(this), 500);
          return;
        }
        if ("mousedown" == e.type) {
          if (e.ctrlKey && 2 == e.button) {
            e.preventDefault(), this.contextMenu.show(e, this);
          } else {
            if (e.button == this.mousePasteButton || this.mouseRightClickPaste && 2 == e.button) {
              this.paste() || console.warn("Could not paste manually due to web restrictions");
            }
          }
        }
        "mouseup" == e.type && 0 == e.button && this.copyOnSelect && !this.document_.getSelection().isCollapsed && this.copySelectionToClipboard();
        "mousemove" != e.type && "mouseup" != e.type || !this.scrollBlockerNode_.engaged || (this.scrollBlockerNode_.engaged = !1, this.scrollBlockerNode_.style.top = "-99px");
        if (this.scrollWheelArrowKeys_ && !e.shiftKey && this.keyboard.applicationCursor && !this.isPrimaryScreen() && "wheel" == e.type) {
          var delta = this.scrollPort_.scrollWheelDelta(e), deltaToArrows = function(distance, charSize, arrowPos, arrowNeg) {
            if (0 == distance) {
              return "";
            }
            var cells = lib.f.smartFloorDivide(Math.abs(distance), charSize), data;
            return ("\u001bO" + (0 > distance ? arrowNeg : arrowPos)).repeat(cells);
          };
          this.io.sendString(deltaToArrows(delta.y, this.scrollPort_.characterSize.height, "A", "B") + deltaToArrows(delta.x, this.scrollPort_.characterSize.width, "C", "D"));
          e.preventDefault();
        }
      }
      "mouseup" == e.type && this.document_.getSelection().isCollapsed && (this.defeatMouseReports_ = !1);
    }
  }
};
hterm.Terminal.prototype.onMouse = function(e) {
};
hterm.Terminal.prototype.onFocusChange_ = function(focused) {
  this.cursorNode_.setAttribute("focus", focused);
  this.restyleCursor_();
  this.reportFocus && this.io.sendString(!0 === focused ? "\u001b[I" : "\u001b[O");
  !0 === focused && this.closeBellNotifications_();
};
hterm.Terminal.prototype.onScroll_ = function() {
  this.scheduleSyncCursorPosition_();
};
hterm.Terminal.prototype.onPaste_ = function(e) {
  var data$jscomp$0 = e.text.replace(/\n/mg, "\r");
  data$jscomp$0 = this.keyboard.encode(data$jscomp$0);
  this.options_.bracketedPaste && (data$jscomp$0 = "\u001b[200~" + function(data) {
    return data.replace(/[\x00-\x07\x0b-\x0c\x0e-\x1f]/g, "");
  }(data$jscomp$0) + "\u001b[201~");
  this.io.sendString(data$jscomp$0);
};
hterm.Terminal.prototype.onCopy_ = function(e) {
  this.useDefaultWindowCopy || (e.preventDefault(), setTimeout(this.copySelectionToClipboard.bind(this), 0));
};
hterm.Terminal.prototype.onResize_ = function() {
  var columnCount = Math.floor(this.scrollPort_.getScreenWidth() / this.scrollPort_.characterSize.width) || 0, rowCount = lib.f.smartFloorDivide(this.scrollPort_.getScreenHeight(), this.scrollPort_.characterSize.height) || 0;
  if (!(0 >= columnCount || 0 >= rowCount)) {
    var isNewSize = columnCount != this.screenSize.width || rowCount != this.screenSize.height;
    this.realizeSize_(columnCount, rowCount);
    this.showZoomWarning_(1 != this.scrollPort_.characterSize.zoomFactor);
    isNewSize && this.overlaySize();
    this.restyleCursor_();
    this.scheduleSyncCursorPosition_();
  }
};
hterm.Terminal.prototype.onCursorBlink_ = function() {
  this.options_.cursorBlink ? "false" == this.cursorNode_.getAttribute("focus") || "0" == this.cursorNode_.style.opacity ? (this.cursorNode_.style.opacity = "1", this.timeouts_.cursorBlink = setTimeout(this.myOnCursorBlink_, this.cursorBlinkCycle_[0])) : (this.cursorNode_.style.opacity = "0", this.timeouts_.cursorBlink = setTimeout(this.myOnCursorBlink_, this.cursorBlinkCycle_[1])) : delete this.timeouts_.cursorBlink;
};
hterm.Terminal.prototype.setScrollbarVisible = function(state) {
  this.scrollPort_.setScrollbarVisible(state);
};
hterm.Terminal.prototype.setScrollWheelMoveMultipler = function(multiplier) {
  this.scrollPort_.setScrollWheelMoveMultipler(multiplier);
};
hterm.Terminal.prototype.closeBellNotifications_ = function() {
  this.bellNotificationList_.forEach(function(n) {
    n.close();
  });
  this.bellNotificationList_.length = 0;
};
hterm.Terminal.prototype.onScrollportFocus_ = function() {
  var topRowIndex = this.scrollPort_.getTopRowIndex(), bottomRowIndex = this.scrollPort_.getBottomRowIndex(topRowIndex), selection = this.document_.getSelection();
  !this.syncCursorPosition_() && selection && selection.collapse(this.getRowNode(bottomRowIndex));
};
lib.rtdep("lib.encodeUTF8");
hterm.Terminal.IO = function(terminal) {
  this.terminal_ = terminal;
  this.previousIO_ = null;
  this.buffered_ = "";
};
hterm.Terminal.IO.prototype.showOverlay = function(message, opt_timeout) {
  this.terminal_.showOverlay(message, opt_timeout);
};
hterm.Terminal.IO.prototype.hideOverlay = function() {
  this.terminal_.hideOverlay();
};
hterm.Terminal.IO.prototype.createFrame = function(url, opt_options) {
  return new hterm.Frame(this.terminal_, url, opt_options);
};
hterm.Terminal.IO.prototype.setTerminalProfile = function(profileName) {
  this.terminal_.setProfile(profileName);
};
hterm.Terminal.IO.prototype.push = function() {
  var io = new hterm.Terminal.IO(this.terminal_);
  io.keyboardCaptured_ = this.keyboardCaptured_;
  io.columnCount = this.columnCount;
  io.rowCount = this.rowCount;
  io.previousIO_ = this.terminal_.io;
  return this.terminal_.io = io;
};
hterm.Terminal.IO.prototype.pop = function() {
  this.terminal_.io = this.previousIO_;
  this.previousIO_.flush();
};
hterm.Terminal.IO.prototype.flush = function() {
  this.buffered_ && (this.terminal_.interpret(this.buffered_), this.buffered_ = "");
};
hterm.Terminal.IO.prototype.sendString = function(string) {
  console.log("Unhandled sendString: " + string);
};
hterm.Terminal.IO.prototype.onVTKeystroke = function(string) {
  console.log("Unobserverd VT keystroke: " + JSON.stringify(string));
};
hterm.Terminal.IO.prototype.onTerminalResize_ = function(width, height) {
  for (var obj = this; obj;) {
    obj.columnCount = width, obj.rowCount = height, obj = obj.previousIO_;
  }
  this.onTerminalResize(width, height);
};
hterm.Terminal.IO.prototype.onTerminalResize = function(width, height) {
};
hterm.Terminal.IO.prototype.writeUTF8 = function(string) {
  this.terminal_.io != this ? this.buffered_ += string : this.terminal_.interpret(string);
};
hterm.Terminal.IO.prototype.writelnUTF8 = function(string) {
  this.writeUTF8(string + "\r\n");
};
hterm.Terminal.IO.prototype.print = hterm.Terminal.IO.prototype.writeUTF16 = function(string) {
  this.writeUTF8(lib.encodeUTF8(string));
};
hterm.Terminal.IO.prototype.println = hterm.Terminal.IO.prototype.writelnUTF16 = function(string) {
  this.writelnUTF8(lib.encodeUTF8(string));
};
lib.rtdep("lib.colors");
hterm.TextAttributes = function(document) {
  this.document_ = document;
  this.underlineSource = this.backgroundSource = this.foregroundSource = this.SRC_DEFAULT;
  this.underlineColor = this.background = this.foreground = this.DEFAULT_COLOR;
  this.defaultForeground = "rgb(255, 255, 255)";
  this.defaultBackground = "rgb(0, 0, 0)";
  this.wcNode = this.invisible = this.inverse = this.strikethrough = this.underline = this.blink = this.italic = this.faint = this.bold = !1;
  this.asciiNode = !0;
  this.colorPalette = this.uriId = this.uri = this.tileData = null;
  this.resetColorPalette();
};
hterm.TextAttributes.prototype.enableBold = !0;
hterm.TextAttributes.prototype.enableBoldAsBright = !0;
hterm.TextAttributes.prototype.DEFAULT_COLOR = lib.f.createEnum("");
hterm.TextAttributes.prototype.SRC_DEFAULT = "default";
hterm.TextAttributes.prototype.setDocument = function(document) {
  this.document_ = document;
};
hterm.TextAttributes.prototype.clone = function() {
  var rv = new hterm.TextAttributes(null), key;
  for (key in this) {
    rv[key] = this[key];
  }
  rv.colorPalette = this.colorPalette.concat();
  return rv;
};
hterm.TextAttributes.prototype.reset = function() {
  this.underlineSource = this.backgroundSource = this.foregroundSource = this.SRC_DEFAULT;
  this.underlineColor = this.background = this.foreground = this.DEFAULT_COLOR;
  this.wcNode = this.invisible = this.inverse = this.strikethrough = this.underline = this.blink = this.italic = this.faint = this.bold = !1;
  this.asciiNode = !0;
  this.uriId = this.uri = null;
};
hterm.TextAttributes.prototype.resetColorPalette = function() {
  this.colorPalette = lib.colors.colorPalette.concat();
  this.syncColors();
};
hterm.TextAttributes.prototype.resetColor = function(index) {
  index = parseInt(index, 10);
  isNaN(index) || index >= this.colorPalette.length || (this.colorPalette[index] = lib.colors.stockColorPalette[index], this.syncColors());
};
hterm.TextAttributes.prototype.isDefault = function() {
  return this.foregroundSource == this.SRC_DEFAULT && this.backgroundSource == this.SRC_DEFAULT && !this.bold && !this.faint && !this.italic && !this.blink && !this.underline && !this.strikethrough && !this.inverse && !this.invisible && !this.wcNode && this.asciiNode && null == this.tileData && null == this.uri;
};
hterm.TextAttributes.prototype.createContainer = function(opt_textContent) {
  if (this.isDefault()) {
    var node = this.document_.createTextNode(opt_textContent);
    node.asciiNode = !0;
    return node;
  }
  var span = this.document_.createElement("span"), style = span.style, classes = [];
  this.foreground != this.DEFAULT_COLOR && (style.color = this.foreground);
  this.background != this.DEFAULT_COLOR && (style.backgroundColor = this.background);
  this.enableBold && this.bold && (style.fontWeight = "bold");
  this.faint && (span.faint = !0);
  this.italic && (style.fontStyle = "italic");
  this.blink && (classes.push("blink-node"), span.blinkNode = !0);
  var textDecorationLine = "";
  if (span.underline = this.underline) {
    textDecorationLine += " underline", style.textDecorationStyle = this.underline;
  }
  this.underlineSource != this.SRC_DEFAULT && (style.textDecorationColor = this.underlineColor);
  this.strikethrough && (textDecorationLine += " line-through", span.strikethrough = !0);
  textDecorationLine && (style.textDecorationLine = textDecorationLine);
  this.wcNode && (classes.push("wc-node"), span.wcNode = !0);
  span.asciiNode = this.asciiNode;
  null != this.tileData && (classes.push("tile"), classes.push("tile_" + this.tileData), span.tileNode = !0);
  opt_textContent && (span.textContent = opt_textContent);
  this.uri && (classes.push("uri-node"), span.uriId = this.uriId, span.title = this.uri, span.addEventListener("click", hterm.openUrl.bind(this, this.uri)));
  classes.length && (span.className = classes.join(" "));
  return span;
};
hterm.TextAttributes.prototype.matchesContainer = function(obj) {
  if ("string" == typeof obj || obj.nodeType == Node.TEXT_NODE) {
    return this.isDefault();
  }
  var style = obj.style;
  return !(this.wcNode || obj.wcNode) && this.asciiNode == obj.asciiNode && !(null != this.tileData || obj.tileNode) && this.uriId == obj.uriId && this.foreground == style.color && this.background == style.backgroundColor && this.underlineColor == style.textDecorationColor && (this.enableBold && this.bold) == !!style.fontWeight && this.blink == !!obj.blinkNode && this.italic == !!style.fontStyle && this.underline == obj.underline && !!this.strikethrough == !!obj.strikethrough;
};
hterm.TextAttributes.prototype.setDefaults = function(foreground, background) {
  this.defaultForeground = foreground;
  this.defaultBackground = background;
  this.syncColors();
};
hterm.TextAttributes.prototype.syncColors = function() {
  function getBrightIndex(i) {
    return 8 > i ? i + 8 : i;
  }
  var $jscomp$this = this, getDefaultColor = function(color, defaultColor) {
    return color == $jscomp$this.DEFAULT_COLOR ? defaultColor : color;
  }, foregroundSource = this.foregroundSource, backgroundSource = this.backgroundSource;
  this.enableBoldAsBright && this.bold && Number.isInteger(foregroundSource) && (foregroundSource = getBrightIndex(foregroundSource));
  foregroundSource == this.SRC_DEFAULT ? this.foreground = this.DEFAULT_COLOR : Number.isInteger(foregroundSource) ? this.foreground = this.colorPalette[foregroundSource] : this.foreground = foregroundSource;
  if (this.faint) {
    var colorToMakeFaint = getDefaultColor(this.foreground, this.defaultForeground);
    this.foreground = lib.colors.mix(colorToMakeFaint, "rgb(0, 0, 0)", 0.3333);
  }
  backgroundSource == this.SRC_DEFAULT ? this.background = this.DEFAULT_COLOR : Number.isInteger(backgroundSource) ? this.background = this.colorPalette[backgroundSource] : this.background = backgroundSource;
  if (this.inverse) {
    var swp = getDefaultColor(this.foreground, this.defaultForeground);
    this.foreground = getDefaultColor(this.background, this.defaultBackground);
    this.background = swp;
  }
  this.invisible && (this.foreground = this.background);
  this.underlineSource == this.SRC_DEFAULT ? this.underlineColor = "" : Number.isInteger(this.underlineSource) ? this.underlineColor = this.colorPalette[this.underlineSource] : this.underlineColor = this.underlineSource;
};
hterm.TextAttributes.containersMatch = function(obj1, obj2) {
  if ("string" == typeof obj1) {
    return hterm.TextAttributes.containerIsDefault(obj2);
  }
  if (obj1.nodeType != obj2.nodeType) {
    return !1;
  }
  if (obj1.nodeType == Node.TEXT_NODE) {
    return !0;
  }
  var style1 = obj1.style, style2 = obj2.style;
  return style1.color == style2.color && style1.backgroundColor == style2.backgroundColor && style1.backgroundColor == style2.backgroundColor && style1.fontWeight == style2.fontWeight && style1.fontStyle == style2.fontStyle && style1.textDecoration == style2.textDecoration && style1.textDecorationColor == style2.textDecorationColor && style1.textDecorationStyle == style2.textDecorationStyle && style1.textDecorationLine == style2.textDecorationLine;
};
hterm.TextAttributes.containerIsDefault = function(obj) {
  return "string" == typeof obj || obj.nodeType == Node.TEXT_NODE;
};
hterm.TextAttributes.nodeWidth = function(node) {
  return node.asciiNode ? node.textContent.length : lib.wc.strWidth(node.textContent);
};
hterm.TextAttributes.nodeSubstr = function(node, start, width) {
  return node.asciiNode ? node.textContent.substr(start, width) : lib.wc.substr(node.textContent, start, width);
};
hterm.TextAttributes.nodeSubstring = function(node, start, end) {
  return node.asciiNode ? node.textContent.substring(start, end) : lib.wc.substring(node.textContent, start, end);
};
hterm.TextAttributes.splitWidecharString = function(str) {
  for (var rv = [], base = 0, length = 0, wcStrWidth = 0, wcCharWidth, asciiNode = !0, i = 0; i < str.length;) {
    var c = str.codePointAt(i);
    if (128 > c) {
      wcStrWidth += 1;
      length += 1;
      var increment = 1;
    } else {
      increment = 65535 >= c ? 1 : 2, wcCharWidth = lib.wc.charWidth(c), 1 >= wcCharWidth ? (wcStrWidth += wcCharWidth, length += increment, asciiNode = !1) : (length && (rv.push({str:str.substr(base, length), asciiNode:asciiNode, wcStrWidth:wcStrWidth, }), asciiNode = !0, wcStrWidth = 0), rv.push({str:str.substr(i, increment), wcNode:!0, asciiNode:!1, wcStrWidth:2, }), base = i + increment, length = 0);
    }
    i += increment;
  }
  length && rv.push({str:str.substr(base, length), asciiNode:asciiNode, wcStrWidth:wcStrWidth, });
  return rv;
};
lib.rtdep("lib.colors", "lib.f", "lib.UTF8Decoder", "hterm.VT.CharacterMap");
hterm.VT = function(terminal) {
  this.terminal = terminal;
  terminal.onMouse = this.onTerminalMouse_.bind(this);
  this.mouseReport = this.MOUSE_REPORT_DISABLED;
  this.mouseCoordinates = this.MOUSE_COORDINATES_X10;
  this.lastMouseDragResponse_ = null;
  this.parseState_ = new hterm.VT.ParseState(this.parseUnknown_);
  this.trailingModifier_ = this.leadingModifier_ = "";
  this.allowColumnWidthChanges_ = !1;
  this.oscTimeLimit_ = 20000;
  this.utf8Decoder_ = new lib.UTF8Decoder;
  this.enable8BitControl = !1;
  this.enableClipboardWrite = !0;
  this.enableDec12 = !1;
  this.enableCsiJ3 = !0;
  this.characterEncoding = "utf-8";
  this.warnUnimplemented = !1;
  this.characterMaps = new hterm.VT.CharacterMaps;
  this.G0 = this.G1 = this.G2 = this.G3 = this.characterMaps.getMap("B");
  this.GR = this.GL = "G0";
  this.codingSystemLocked_ = this.codingSystemUtf8_ = !1;
  this.cc1Pattern_ = null;
  this.updateEncodingState_();
};
hterm.VT.prototype.MOUSE_REPORT_DISABLED = 0;
hterm.VT.prototype.MOUSE_REPORT_PRESS = 1;
hterm.VT.prototype.MOUSE_REPORT_CLICK = 2;
hterm.VT.prototype.MOUSE_REPORT_DRAG = 3;
hterm.VT.prototype.MOUSE_COORDINATES_X10 = 0;
hterm.VT.prototype.MOUSE_COORDINATES_UTF8 = 1;
hterm.VT.prototype.MOUSE_COORDINATES_SGR = 2;
hterm.VT.ParseState = function(defaultFunction, opt_buf) {
  this.defaultFunction = defaultFunction;
  this.buf = opt_buf || null;
  this.pos = 0;
  this.func = defaultFunction;
  this.args = [];
  this.subargs = null;
};
hterm.VT.ParseState.prototype.reset = function(opt_buf) {
  this.resetParseFunction();
  this.resetBuf(opt_buf || "");
  this.resetArguments();
};
hterm.VT.ParseState.prototype.resetParseFunction = function() {
  this.func = this.defaultFunction;
};
hterm.VT.ParseState.prototype.resetBuf = function(opt_buf) {
  this.buf = "string" == typeof opt_buf ? opt_buf : null;
  this.pos = 0;
};
hterm.VT.ParseState.prototype.resetArguments = function(opt_arg_zero) {
  this.args.length = 0;
  "undefined" != typeof opt_arg_zero && (this.args[0] = opt_arg_zero);
};
hterm.VT.ParseState.prototype.parseInt = function(argstr, defaultValue) {
  void 0 === defaultValue && (defaultValue = 0);
  if (argstr) {
    var ret = parseInt(argstr, 10);
    return 0 == ret ? defaultValue : ret;
  }
  return defaultValue;
};
hterm.VT.ParseState.prototype.iarg = function(argnum, defaultValue) {
  return this.parseInt(this.args[argnum], defaultValue);
};
hterm.VT.ParseState.prototype.argHasSubargs = function(argnum) {
  return this.subargs && this.subargs[argnum];
};
hterm.VT.ParseState.prototype.argSetSubargs = function(argnum) {
  null === this.subargs && (this.subargs = {});
  this.subargs[argnum] = !0;
};
hterm.VT.ParseState.prototype.advance = function(count) {
  this.pos += count;
};
hterm.VT.ParseState.prototype.peekRemainingBuf = function() {
  return this.buf.substr(this.pos);
};
hterm.VT.ParseState.prototype.peekChar = function() {
  return this.buf.substr(this.pos, 1);
};
hterm.VT.ParseState.prototype.consumeChar = function() {
  return this.buf.substr(this.pos++, 1);
};
hterm.VT.ParseState.prototype.isComplete = function() {
  return null == this.buf || this.buf.length <= this.pos;
};
hterm.VT.prototype.reset = function() {
  this.G0 = this.G1 = this.G2 = this.G3 = this.characterMaps.getMap("B");
  this.GR = this.GL = "G0";
  this.mouseReport = this.MOUSE_REPORT_DISABLED;
  this.mouseCoordinates = this.MOUSE_COORDINATES_X10;
  this.lastMouseDragResponse_ = null;
};
hterm.VT.prototype.onTerminalMouse_ = function(e) {
  if (this.mouseReport != this.MOUSE_REPORT_DISABLED && (this.mouseReport == this.MOUSE_REPORT_DRAG || "mousemove" != e.type)) {
    var mod = 0;
    if (this.mouseReport != this.MOUSE_REPORT_PRESS) {
      e.shiftKey && (mod |= 4);
      if (e.metaKey || this.terminal.keyboard.altIsMeta && e.altKey) {
        mod |= 8;
      }
      e.ctrlKey && (mod |= 16);
    }
    var limit = 255;
    switch(this.mouseCoordinates) {
      case this.MOUSE_COORDINATES_UTF8:
        limit = 2047;
      case this.MOUSE_COORDINATES_X10:
        var x = String.fromCharCode(lib.f.clamp(e.terminalColumn + 32, 32, limit));
        var y = String.fromCharCode(lib.f.clamp(e.terminalRow + 32, 32, limit));
        break;
      case this.MOUSE_COORDINATES_SGR:
        x = e.terminalColumn, y = e.terminalRow;
    }
    switch(e.type) {
      case "wheel":
        b = (0 < -1 * e.deltaY ? 0 : 1) + 64;
        b |= mod;
        var response = this.mouseCoordinates == this.MOUSE_COORDINATES_SGR ? "\u001b[<" + b + ";" + x + ";" + y + "M" : "\u001b[M" + String.fromCharCode(b + 32) + x + y;
        e.preventDefault();
        break;
      case "mousedown":
        var b = Math.min(e.button, 2);
        this.mouseCoordinates != this.MOUSE_COORDINATES_SGR && (b += 32);
        b |= mod;
        response = this.mouseCoordinates == this.MOUSE_COORDINATES_SGR ? "\u001b[<" + b + ";" + x + ";" + y + "M" : "\u001b[M" + String.fromCharCode(b) + x + y;
        break;
      case "mouseup":
        this.mouseReport != this.MOUSE_REPORT_PRESS && (response = this.mouseCoordinates == this.MOUSE_COORDINATES_SGR ? "\u001b[<" + e.button + ";" + x + ";" + y + "m" : "\u001b[M#" + x + y);
        break;
      case "mousemove":
        this.mouseReport == this.MOUSE_REPORT_DRAG && e.buttons && (b = this.mouseCoordinates == this.MOUSE_COORDINATES_SGR ? 0 : 32, b = e.buttons & 1 ? b + 0 : e.buttons & 4 ? b + 1 : e.buttons & 2 ? b + 2 : b + 3, b = b + 32 | mod, response = this.mouseCoordinates == this.MOUSE_COORDINATES_SGR ? "\u001b[<" + b + ";" + x + ";" + y + "M" : "\u001b[M" + String.fromCharCode(b) + x + y, this.lastMouseDragResponse_ == response ? response = "" : this.lastMouseDragResponse_ = response);
        break;
      case "click":
      case "dblclick":
        break;
      default:
        console.error("Unknown mouse event: " + e.type, e);
    }
    response && this.terminal.io.sendString(response);
  }
};
hterm.VT.prototype.interpret = function(buf) {
  for (this.parseState_.resetBuf(this.decode(buf)); !this.parseState_.isComplete();) {
    var func = this.parseState_.func, pos = this.parseState_.pos;
    buf = this.parseState_.buf;
    this.parseState_.func.call(this, this.parseState_);
    if (this.parseState_.func == func && this.parseState_.pos == pos && this.parseState_.buf == buf) {
      throw "Parser did not alter the state!";
    }
  }
};
hterm.VT.prototype.decode = function(str) {
  return "utf-8" == this.characterEncoding ? this.decodeUTF8(str) : str;
};
hterm.VT.prototype.encodeUTF8 = function(str) {
  return lib.encodeUTF8(str);
};
hterm.VT.prototype.decodeUTF8 = function(str) {
  return this.utf8Decoder_.decode(str);
};
hterm.VT.prototype.setEncoding = function(encoding) {
  switch(encoding) {
    default:
      console.warn('Invalid value for "terminal-encoding": ' + encoding);
    case "iso-2022":
      this.codingSystemLocked_ = this.codingSystemUtf8_ = !1;
      break;
    case "utf-8-locked":
      this.codingSystemLocked_ = this.codingSystemUtf8_ = !0;
      break;
    case "utf-8":
      this.codingSystemUtf8_ = !0, this.codingSystemLocked_ = !1;
  }
  this.updateEncodingState_();
};
hterm.VT.prototype.updateEncodingState_ = function() {
  var $jscomp$this = this, cc1 = Object.keys(hterm.VT.CC1).filter(function(e) {
    return !$jscomp$this.codingSystemUtf8_ || 128 > e.charCodeAt();
  }).map(function(e) {
    return "\\x" + lib.f.zpad(e.charCodeAt().toString(16), 2);
  }).join("");
  this.cc1Pattern_ = new RegExp("[" + cc1 + "]");
};
hterm.VT.prototype.parseUnknown_ = function(parseState) {
  function print(str) {
    !self.codingSystemUtf8_ && self[self.GL].GL && (str = self[self.GL].GL(str));
    self.terminal.print(str);
  }
  var self = this, buf = parseState.peekRemainingBuf(), nextControl = buf.search(this.cc1Pattern_);
  0 == nextControl ? (this.dispatch("CC1", buf.substr(0, 1), parseState), parseState.advance(1)) : -1 == nextControl ? (print(buf), parseState.reset()) : (print(buf.substr(0, nextControl)), this.dispatch("CC1", buf.substr(nextControl, 1), parseState), parseState.advance(nextControl + 1));
};
hterm.VT.prototype.parseCSI_ = function(parseState) {
  var ch = parseState.peekChar(), args = parseState.args, finishParsing = function() {
    parseState.resetArguments();
    parseState.subargs = null;
    parseState.resetParseFunction();
  };
  "@" <= ch && "~" >= ch ? (this.dispatch("CSI", this.leadingModifier_ + this.trailingModifier_ + ch, parseState), finishParsing()) : ";" == ch ? this.trailingModifier_ ? finishParsing() : (args.length || args.push(""), args.push("")) : "0" <= ch && "9" >= ch || ":" == ch ? this.trailingModifier_ ? finishParsing() : (args.length ? args[args.length - 1] += ch : args[0] = ch, ":" == ch && parseState.argSetSubargs(args.length - 1)) : " " <= ch && "?" >= ch ? args.length ? this.trailingModifier_ += ch : 
  this.leadingModifier_ += ch : this.cc1Pattern_.test(ch) ? this.dispatch("CC1", ch, parseState) : finishParsing();
  parseState.advance(1);
};
hterm.VT.prototype.parseUntilStringTerminator_ = function(parseState) {
  var buf = parseState.peekRemainingBuf(), args = parseState.args, bufInserted = 0;
  args.length ? "\u001b" == args[0].slice(-1) && (args[0] = args[0].slice(0, -1), buf = "\u001b" + buf, bufInserted = 1) : (args[0] = "", args[1] = new Date);
  var nextTerminator = buf.search(/[\x1b\x07]/), terminator = buf[nextTerminator];
  if ("\u001b" == terminator && "\\" != buf[nextTerminator + 1] || -1 == nextTerminator) {
    args[0] += buf;
    var abortReason;
    "\u001b" == terminator && nextTerminator != buf.length - 1 && (abortReason = "embedded escape: " + nextTerminator);
    new Date - args[1] > this.oscTimeLimit_ && (abortReason = "timeout expired: " + (new Date - args[1]));
    if (abortReason) {
      return this.warnUnimplemented && console.log("parseUntilStringTerminator_: aborting: " + abortReason, args[0]), parseState.reset(args[0]), !1;
    }
    parseState.advance(buf.length - bufInserted);
    return !0;
  }
  args[0] += buf.substr(0, nextTerminator);
  parseState.resetParseFunction();
  parseState.advance(nextTerminator + ("\u001b" == terminator ? 2 : 1) - bufInserted);
  return !0;
};
hterm.VT.prototype.dispatch = function(type, code, parseState) {
  var handler = hterm.VT[type][code];
  handler ? handler == hterm.VT.ignore ? this.warnUnimplemented && console.warn("Ignored " + type + " code: " + JSON.stringify(code)) : parseState.subargs && !handler.supportsSubargs ? this.warnUnimplemented && console.warn("Ignored " + type + " code w/subargs: " + JSON.stringify(code)) : "CC1" == type && "\u007f" < code && !this.enable8BitControl ? console.warn("Ignoring 8-bit control code: 0x" + code.charCodeAt(0).toString(16)) : handler.apply(this, [parseState, code]) : this.warnUnimplemented && 
  console.warn("Unknown " + type + " code: " + JSON.stringify(code));
};
hterm.VT.prototype.setANSIMode = function(code, state) {
  4 == code ? this.terminal.setInsertMode(state) : 20 == code ? this.terminal.setAutoCarriageReturn(state) : this.warnUnimplemented && console.warn("Unimplemented ANSI Mode: " + code);
};
hterm.VT.prototype.setDECMode = function(code, state) {
  switch(parseInt(code, 10)) {
    case 1:
      this.terminal.keyboard.applicationCursor = state;
      break;
    case 3:
      this.allowColumnWidthChanges_ && (this.terminal.setWidth(state ? 132 : 80), this.terminal.clearHome(), this.terminal.setVTScrollRegion(null, null));
      break;
    case 5:
      this.terminal.setReverseVideo(state);
      break;
    case 6:
      this.terminal.setOriginMode(state);
      break;
    case 7:
      this.terminal.setWraparound(state);
      break;
    case 9:
      this.mouseReport = state ? this.MOUSE_REPORT_PRESS : this.MOUSE_REPORT_DISABLED;
      this.terminal.syncMouseStyle();
      break;
    case 12:
      this.enableDec12 && this.terminal.setCursorBlink(state);
      break;
    case 25:
      this.terminal.setCursorVisible(state);
      break;
    case 30:
      this.terminal.setScrollbarVisible(state);
      break;
    case 40:
      this.terminal.allowColumnWidthChanges_ = state;
      break;
    case 45:
      this.terminal.setReverseWraparound(state);
      break;
    case 67:
      this.terminal.keyboard.backspaceSendsBackspace = state;
      break;
    case 1000:
      this.mouseReport = state ? this.MOUSE_REPORT_CLICK : this.MOUSE_REPORT_DISABLED;
      this.terminal.syncMouseStyle();
      break;
    case 1002:
      this.mouseReport = state ? this.MOUSE_REPORT_DRAG : this.MOUSE_REPORT_DISABLED;
      this.terminal.syncMouseStyle();
      break;
    case 1004:
      this.terminal.reportFocus = state;
      break;
    case 1005:
      this.mouseCoordinates = state ? this.MOUSE_COORDINATES_UTF8 : this.MOUSE_COORDINATES_X10;
      break;
    case 1006:
      this.mouseCoordinates = state ? this.MOUSE_COORDINATES_SGR : this.MOUSE_COORDINATES_X10;
      break;
    case 1007:
      this.terminal.scrollWheelArrowKeys_ = state;
      break;
    case 1010:
      this.terminal.scrollOnOutput = state;
      break;
    case 1011:
      this.terminal.scrollOnKeystroke = state;
      break;
    case 1036:
      this.terminal.keyboard.metaSendsEscape = state;
      break;
    case 1039:
      state ? this.terminal.keyboard.previousAltSendsWhat_ || (this.terminal.keyboard.previousAltSendsWhat_ = this.terminal.keyboard.altSendsWhat, this.terminal.keyboard.altSendsWhat = "escape") : this.terminal.keyboard.previousAltSendsWhat_ && (this.terminal.keyboard.altSendsWhat = this.terminal.keyboard.previousAltSendsWhat_, this.terminal.keyboard.previousAltSendsWhat_ = null);
      break;
    case 47:
    case 1047:
      this.terminal.setAlternateMode(state);
      break;
    case 1048:
      state ? this.terminal.saveCursorAndState() : this.terminal.restoreCursorAndState();
      break;
    case 1049:
      state ? (this.terminal.saveCursorAndState(), this.terminal.setAlternateMode(state), this.terminal.clear()) : (this.terminal.setAlternateMode(state), this.terminal.restoreCursorAndState());
      break;
    case 2004:
      this.terminal.setBracketedPaste(state);
      break;
    default:
      this.warnUnimplemented && console.warn("Unimplemented DEC Private Mode: " + code);
  }
};
hterm.VT.ignore = function() {
};
hterm.VT.CC1 = {};
hterm.VT.ESC = {};
hterm.VT.CSI = {};
hterm.VT.OSC = {};
hterm.VT.VT52 = {};
hterm.VT.CC1["\x00"] = hterm.VT.ignore;
hterm.VT.CC1["\u0005"] = hterm.VT.ignore;
hterm.VT.CC1["\u0007"] = function() {
  this.terminal.ringBell();
};
hterm.VT.CC1["\b"] = function() {
  this.terminal.cursorLeft(1);
};
hterm.VT.CC1["\t"] = function() {
  this.terminal.forwardTabStop();
};
hterm.VT.CC1["\n"] = function() {
  this.terminal.formFeed();
};
hterm.VT.CC1["\x0B"] = hterm.VT.CC1["\n"];
hterm.VT.CC1["\f"] = hterm.VT.CC1["\n"];
hterm.VT.CC1["\r"] = function() {
  this.terminal.setCursorColumn(0);
};
hterm.VT.CC1["\u000e"] = function() {
  this.GL = "G1";
};
hterm.VT.CC1["\u000f"] = function() {
  this.GL = "G0";
};
hterm.VT.CC1["\u0011"] = hterm.VT.ignore;
hterm.VT.CC1["\u0013"] = hterm.VT.ignore;
hterm.VT.CC1["\u0018"] = function(parseState) {
  "G1" == this.GL && (this.GL = "G0");
  parseState.resetParseFunction();
  this.terminal.print("?");
};
hterm.VT.CC1["\u001a"] = hterm.VT.CC1["\u0018"];
hterm.VT.CC1["\u001b"] = function(parseState$jscomp$0) {
  function parseESC(parseState) {
    var ch = parseState.consumeChar();
    "\u001b" != ch && (this.dispatch("ESC", ch, parseState), parseState.func == parseESC && parseState.resetParseFunction());
  }
  parseState$jscomp$0.func = parseESC;
};
hterm.VT.CC1["\u007f"] = hterm.VT.ignore;
hterm.VT.CC1["\u0084"] = hterm.VT.ESC.D = function() {
  this.terminal.lineFeed();
};
hterm.VT.CC1["\u0085"] = hterm.VT.ESC.E = function() {
  this.terminal.setCursorColumn(0);
  this.terminal.cursorDown(1);
};
hterm.VT.CC1["\u0088"] = hterm.VT.ESC.H = function() {
  this.terminal.setTabStop(this.terminal.getCursorColumn());
};
hterm.VT.CC1["\u008d"] = hterm.VT.ESC.M = function() {
  this.terminal.reverseLineFeed();
};
hterm.VT.CC1["\u008e"] = hterm.VT.ESC.N = hterm.VT.ignore;
hterm.VT.CC1["\u008f"] = hterm.VT.ESC.O = hterm.VT.ignore;
hterm.VT.CC1["\u0090"] = hterm.VT.ESC.P = function(parseState) {
  parseState.resetArguments();
  parseState.func = this.parseUntilStringTerminator_;
};
hterm.VT.CC1["\u0096"] = hterm.VT.ESC.V = hterm.VT.ignore;
hterm.VT.CC1["\u0097"] = hterm.VT.ESC.W = hterm.VT.ignore;
hterm.VT.CC1["\u0098"] = hterm.VT.ESC.X = hterm.VT.ignore;
hterm.VT.CC1["\u009a"] = hterm.VT.ESC.Z = function() {
  this.terminal.io.sendString("\u001b[?1;2c");
};
hterm.VT.CC1["\u009b"] = hterm.VT.ESC["["] = function(parseState) {
  parseState.resetArguments();
  this.trailingModifier_ = this.leadingModifier_ = "";
  parseState.func = this.parseCSI_;
};
hterm.VT.CC1["\u009c"] = hterm.VT.ESC["\\"] = hterm.VT.ignore;
hterm.VT.CC1["\u009d"] = hterm.VT.ESC["]"] = function(parseState$jscomp$0) {
  function parseOSC(parseState) {
    if (this.parseUntilStringTerminator_(parseState) && parseState.func != parseOSC) {
      var ary = parseState.args[0].match(/^(\d+);(.*)$/);
      ary ? (parseState.args[0] = ary[2], this.dispatch("OSC", ary[1], parseState)) : console.warn("Invalid OSC: " + JSON.stringify(parseState.args[0]));
      parseState.resetArguments();
    }
  }
  parseState$jscomp$0.resetArguments();
  parseState$jscomp$0.func = parseOSC;
};
hterm.VT.CC1["\u009e"] = hterm.VT.ESC["^"] = function(parseState) {
  parseState.resetArguments();
  parseState.func = this.parseUntilStringTerminator_;
};
hterm.VT.CC1["\u009f"] = hterm.VT.ESC._ = function(parseState) {
  parseState.resetArguments();
  parseState.func = this.parseUntilStringTerminator_;
};
hterm.VT.ESC[" "] = function(parseState$jscomp$0) {
  parseState$jscomp$0.func = function(parseState) {
    var ch = parseState.consumeChar();
    this.warnUnimplemented && console.warn("Unimplemented sequence: ESC 0x20 " + ch);
    parseState.resetParseFunction();
  };
};
hterm.VT.ESC["#"] = function(parseState$jscomp$0) {
  parseState$jscomp$0.func = function(parseState) {
    "8" == parseState.consumeChar() && (this.terminal.setCursorPosition(0, 0), this.terminal.fill("E"));
    parseState.resetParseFunction();
  };
};
hterm.VT.ESC["%"] = function(parseState$jscomp$0) {
  parseState$jscomp$0.func = function(parseState) {
    var ch = parseState.consumeChar();
    if (this.codingSystemLocked_) {
      "/" == ch && parseState.consumeChar();
    } else {
      switch(ch) {
        case "@":
          this.setEncoding("iso-2022");
          break;
        case "G":
          this.setEncoding("utf-8");
          break;
        case "/":
          ch = parseState.consumeChar();
          switch(ch) {
            case "G":
            case "H":
            case "I":
              this.setEncoding("utf-8-locked");
              break;
            default:
              this.warnUnimplemented && console.warn("Unknown ESC % / argument: " + JSON.stringify(ch));
          }break;
        default:
          this.warnUnimplemented && console.warn("Unknown ESC % argument: " + JSON.stringify(ch));
      }
    }
    parseState.resetParseFunction();
  };
};
hterm.VT.ESC["("] = hterm.VT.ESC[")"] = hterm.VT.ESC["*"] = hterm.VT.ESC["+"] = hterm.VT.ESC["-"] = hterm.VT.ESC["."] = hterm.VT.ESC["/"] = function(parseState$jscomp$0, code) {
  parseState$jscomp$0.func = function(parseState) {
    var ch = parseState.consumeChar();
    if ("\u001b" == ch) {
      parseState.resetParseFunction(), parseState.func();
    } else {
      var map = this.characterMaps.getMap(ch);
      if (void 0 !== map) {
        if ("(" == code) {
          this.G0 = map;
        } else {
          if (")" == code || "-" == code) {
            this.G1 = map;
          } else {
            if ("*" == code || "." == code) {
              this.G2 = map;
            } else {
              if ("+" == code || "/" == code) {
                this.G3 = map;
              }
            }
          }
        }
      } else {
        this.warnUnimplemented && console.log('Invalid character set for "' + code + '": ' + ch);
      }
      parseState.resetParseFunction();
    }
  };
};
hterm.VT.ESC["6"] = hterm.VT.ignore;
hterm.VT.ESC["7"] = function() {
  this.terminal.saveCursorAndState();
};
hterm.VT.ESC["8"] = function() {
  this.terminal.restoreCursorAndState();
};
hterm.VT.ESC["9"] = hterm.VT.ignore;
hterm.VT.ESC["="] = function() {
  this.terminal.keyboard.applicationKeypad = !0;
};
hterm.VT.ESC[">"] = function() {
  this.terminal.keyboard.applicationKeypad = !1;
};
hterm.VT.ESC.F = hterm.VT.ignore;
hterm.VT.ESC.c = function() {
  this.terminal.reset();
};
hterm.VT.ESC.l = hterm.VT.ESC.m = hterm.VT.ignore;
hterm.VT.ESC.n = function() {
  this.GL = "G2";
};
hterm.VT.ESC.o = function() {
  this.GL = "G3";
};
hterm.VT.ESC["|"] = function() {
  this.GR = "G3";
};
hterm.VT.ESC["}"] = function() {
  this.GR = "G2";
};
hterm.VT.ESC["~"] = function() {
  this.GR = "G1";
};
hterm.VT.OSC["0"] = function(parseState) {
  this.terminal.setWindowTitle(parseState.args[0]);
};
hterm.VT.OSC["2"] = hterm.VT.OSC["0"];
hterm.VT.OSC["4"] = function(parseState) {
  for (var args = parseState.args[0].split(";"), pairCount = parseInt(args.length / 2), colorPalette = this.terminal.getTextAttributes().colorPalette, responseArray = [], pairNumber = 0; pairNumber < pairCount; ++pairNumber) {
    var colorIndex = parseInt(args[2 * pairNumber]), colorValue = args[2 * pairNumber + 1];
    colorIndex >= colorPalette.length || ("?" == colorValue ? (colorValue = lib.colors.rgbToX11(colorPalette[colorIndex])) && responseArray.push(colorIndex + ";" + colorValue) : (colorValue = lib.colors.x11ToCSS(colorValue)) && (colorPalette[colorIndex] = colorValue));
  }
  responseArray.length && this.terminal.io.sendString("\u001b]4;" + responseArray.join(";") + "\u0007");
};
hterm.VT.OSC["8"] = function(parseState) {
  var args = parseState.args[0].split(";"), id = null, uri = null;
  if (2 == args.length && 0 != args[1].length) {
    var params = args[0].split(":");
    id = "";
    params.forEach(function(param) {
      var idx = param.indexOf("=");
      if (-1 != idx) {
        var key = param.slice(0, idx), value = param.slice(idx + 1);
        switch(key) {
          case "id":
            id = value;
        }
      }
    });
    uri = args[1];
  }
  var attrs = this.terminal.getTextAttributes();
  attrs.uri = uri;
  attrs.uriId = id;
};
hterm.VT.OSC["9"] = function(parseState) {
  hterm.notify({body:parseState.args[0]});
};
hterm.VT.OSC["10"] = function(parseState) {
  var args = parseState.args[0].split(";");
  if (args) {
    var colorArg, colorX11 = lib.colors.x11ToCSS(args.shift());
    colorX11 && this.terminal.setForegroundColor(colorX11);
    0 < args.length && (parseState.args[0] = args.join(";"), hterm.VT.OSC["11"].apply(this, [parseState]));
  }
};
hterm.VT.OSC["11"] = function(parseState) {
  var args = parseState.args[0].split(";");
  if (args) {
    var colorArg, colorX11 = lib.colors.x11ToCSS(args.shift());
    colorX11 && this.terminal.setBackgroundColor(colorX11);
    0 < args.length && (parseState.args[0] = args.join(";"), hterm.VT.OSC["12"].apply(this, [parseState]));
  }
};
hterm.VT.OSC["12"] = function(parseState) {
  var args = parseState.args[0].split(";");
  if (args) {
    var colorArg, colorX11 = lib.colors.x11ToCSS(args.shift());
    colorX11 && this.terminal.setCursorColor(colorX11);
  }
};
hterm.VT.OSC["50"] = function(parseState) {
  var args = parseState.args[0].match(/CursorShape=(.)/i);
  if (args) {
    switch(args[1]) {
      case "1":
        this.terminal.setCursorShape(hterm.Terminal.cursorShape.BEAM);
        break;
      case "2":
        this.terminal.setCursorShape(hterm.Terminal.cursorShape.UNDERLINE);
        break;
      default:
        this.terminal.setCursorShape(hterm.Terminal.cursorShape.BLOCK);
    }
  } else {
    console.warn("Could not parse OSC 50 args: " + parseState.args[0]);
  }
};
hterm.VT.OSC["52"] = function(parseState) {
  if (this.enableClipboardWrite) {
    var args = parseState.args[0].match(/^[cps01234567]*;(.*)/);
    if (args) {
      var data = window.atob(args[1]);
      data && this.terminal.copyStringToClipboard(this.decode(data));
    }
  }
};
hterm.VT.OSC["104"] = function(parseState) {
  var attrs = this.terminal.getTextAttributes();
  parseState.args[0] ? parseState.args[0].split(";").forEach(function(c) {
    return attrs.resetColor(c);
  }) : attrs.resetColorPalette();
};
hterm.VT.OSC["110"] = function(parseState) {
  this.terminal.setForegroundColor();
};
hterm.VT.OSC["111"] = function(parseState) {
  this.terminal.setBackgroundColor();
};
hterm.VT.OSC["112"] = function(parseState) {
  this.terminal.setCursorColor();
};
hterm.VT.OSC["1337"] = function(parseState) {
  var args = parseState.args[0].match(/^File=([^:]*):([\s\S]*)$/m);
  if (args) {
    var options = {name:"", size:0, preserveAspectRatio:!0, inline:!1, width:"auto", height:"auto", align:"left", uri:"data:application/octet-stream;base64," + args[2].replace(/[\n\r]+/gm, ""), };
    args[1].split(";").forEach(function(ele) {
      var kv = ele.match(/^([^=]+)=(.*)$/m);
      if (kv) {
        switch(kv[1]) {
          case "name":
            try {
              options.name = window.atob(kv[2]);
            } catch (e) {
            }
            break;
          case "size":
            try {
              options.size = parseInt(kv[2]);
            } catch (e$8) {
            }
            break;
          case "width":
            options.width = kv[2];
            break;
          case "height":
            options.height = kv[2];
            break;
          case "preserveAspectRatio":
            options.preserveAspectRatio = "0" != kv[2];
            break;
          case "inline":
            options.inline = "0" != kv[2];
            break;
          case "align":
            options.align = kv[2];
        }
      }
    });
    if (options.inline) {
      var io = this.terminal.io, queued = parseState.peekRemainingBuf();
      parseState.advance(queued.length);
      this.terminal.displayImage(options);
      io.writeUTF8(queued);
    } else {
      this.terminal.displayImage(options);
    }
  } else {
    this.warnUnimplemented && console.log("iTerm2 1337: unsupported sequence: " + args[1]);
  }
};
hterm.VT.OSC["777"] = function(parseState) {
  var ary;
  switch(parseState.args[0].split(";", 1)[0]) {
    case "notify":
      if (ary = parseState.args[0].match(/^[^;]+;([^;]*)(;([\s\S]*))?$/)) {
        var title = ary[1];
        var message = ary[3];
      }
      hterm.notify({title:title, body:message});
      break;
    default:
      console.warn("Unknown urxvt module: " + parseState.args[0]);
  }
};
hterm.VT.CSI["@"] = function(parseState) {
  this.terminal.insertSpace(parseState.iarg(0, 1));
};
hterm.VT.CSI.A = function(parseState) {
  this.terminal.cursorUp(parseState.iarg(0, 1));
};
hterm.VT.CSI.B = function(parseState) {
  this.terminal.cursorDown(parseState.iarg(0, 1));
};
hterm.VT.CSI.C = function(parseState) {
  this.terminal.cursorRight(parseState.iarg(0, 1));
};
hterm.VT.CSI.D = function(parseState) {
  this.terminal.cursorLeft(parseState.iarg(0, 1));
};
hterm.VT.CSI.E = function(parseState) {
  this.terminal.cursorDown(parseState.iarg(0, 1));
  this.terminal.setCursorColumn(0);
};
hterm.VT.CSI.F = function(parseState) {
  this.terminal.cursorUp(parseState.iarg(0, 1));
  this.terminal.setCursorColumn(0);
};
hterm.VT.CSI.G = function(parseState) {
  this.terminal.setCursorColumn(parseState.iarg(0, 1) - 1);
};
hterm.VT.CSI.H = function(parseState) {
  this.terminal.setCursorPosition(parseState.iarg(0, 1) - 1, parseState.iarg(1, 1) - 1);
};
hterm.VT.CSI.I = function(parseState) {
  var count = parseState.iarg(0, 1);
  count = lib.f.clamp(count, 1, this.terminal.screenSize.width);
  for (var i = 0; i < count; i++) {
    this.terminal.forwardTabStop();
  }
};
hterm.VT.CSI.J = hterm.VT.CSI["?J"] = function(parseState, code) {
  var arg = parseState.args[0];
  arg && 0 != arg ? 1 == arg ? this.terminal.eraseAbove() : 2 == arg ? this.terminal.clear() : 3 == arg && this.enableCsiJ3 && this.terminal.clearScrollback() : this.terminal.eraseBelow();
};
hterm.VT.CSI.K = hterm.VT.CSI["?K"] = function(parseState, code) {
  var arg = parseState.args[0];
  arg && 0 != arg ? 1 == arg ? this.terminal.eraseToLeft() : 2 == arg && this.terminal.eraseLine() : this.terminal.eraseToRight();
};
hterm.VT.CSI.L = function(parseState) {
  this.terminal.insertLines(parseState.iarg(0, 1));
};
hterm.VT.CSI.M = function(parseState) {
  this.terminal.deleteLines(parseState.iarg(0, 1));
};
hterm.VT.CSI.P = function(parseState) {
  this.terminal.deleteChars(parseState.iarg(0, 1));
};
hterm.VT.CSI.S = function(parseState) {
  this.terminal.vtScrollUp(parseState.iarg(0, 1));
};
hterm.VT.CSI.T = function(parseState) {
  1 >= parseState.args.length && this.terminal.vtScrollDown(parseState.iarg(0, 1));
};
hterm.VT.CSI[">T"] = hterm.VT.ignore;
hterm.VT.CSI.X = function(parseState) {
  this.terminal.eraseToRight(parseState.iarg(0, 1));
};
hterm.VT.CSI.Z = function(parseState) {
  var count = parseState.iarg(0, 1);
  count = lib.f.clamp(count, 1, this.terminal.screenSize.width);
  for (var i = 0; i < count; i++) {
    this.terminal.backwardTabStop();
  }
};
hterm.VT.CSI["`"] = hterm.VT.CSI.G;
hterm.VT.CSI.a = function(parseState) {
  this.terminal.setCursorColumn(this.terminal.getCursorColumn() + parseState.iarg(0, 1));
};
hterm.VT.CSI.b = hterm.VT.ignore;
hterm.VT.CSI.c = function(parseState) {
  parseState.args[0] && 0 != parseState.args[0] || this.terminal.io.sendString("\u001b[?1;2c");
};
hterm.VT.CSI[">c"] = function(parseState) {
  this.terminal.io.sendString("\u001b[>0;256;0c");
};
hterm.VT.CSI.d = function(parseState) {
  this.terminal.setAbsoluteCursorRow(parseState.iarg(0, 1) - 1);
};
hterm.VT.CSI.f = hterm.VT.CSI.H;
hterm.VT.CSI.g = function(parseState) {
  parseState.args[0] && 0 != parseState.args[0] ? 3 == parseState.args[0] && this.terminal.clearAllTabStops() : this.terminal.clearTabStopAtCursor(!1);
};
hterm.VT.CSI.h = function(parseState) {
  for (var i = 0; i < parseState.args.length; i++) {
    this.setANSIMode(parseState.args[i], !0);
  }
};
hterm.VT.CSI["?h"] = function(parseState) {
  for (var i = 0; i < parseState.args.length; i++) {
    this.setDECMode(parseState.args[i], !0);
  }
};
hterm.VT.CSI.i = hterm.VT.CSI["?i"] = hterm.VT.ignore;
hterm.VT.CSI.l = function(parseState) {
  for (var i = 0; i < parseState.args.length; i++) {
    this.setANSIMode(parseState.args[i], !1);
  }
};
hterm.VT.CSI["?l"] = function(parseState) {
  for (var i = 0; i < parseState.args.length; i++) {
    this.setDECMode(parseState.args[i], !1);
  }
};
hterm.VT.prototype.parseSgrExtendedColors = function(parseState, i, attrs) {
  if (parseState.argHasSubargs(i)) {
    var ary = parseState.args[i].split(":");
    ary.shift();
    var usedSubargs = !0;
  } else {
    if (parseState.argHasSubargs(i + 1)) {
      return {skipCount:0};
    }
    ary = parseState.args.slice(i + 1);
    usedSubargs = !1;
  }
  switch(parseInt(ary[0])) {
    default:
    case 0:
      return {skipCount:0};
    case 1:
      return usedSubargs ? {color:"rgba(0, 0, 0, 0)", skipCount:0, } : {skipCount:0};
    case 2:
      var start = usedSubargs ? 4 == ary.length ? 1 : 2 : 1;
      if (ary.length < start + 3) {
        return {skipCount:0};
      }
      var r = parseState.parseInt(ary[start + 0]), g = parseState.parseInt(ary[start + 1]), b = parseState.parseInt(ary[start + 2]);
      return {color:"rgb(" + r + ", " + g + ", " + b + ")", skipCount:usedSubargs ? 0 : 4, };
    case 3:
      if (!usedSubargs) {
        return {skipCount:0};
      }
      if (4 > ary.length) {
        return {skipCount:0};
      }
      var c = parseState.parseInt(ary[1]), m = parseState.parseInt(ary[2]), y = parseState.parseInt(ary[3]);
      return {skipCount:0};
    case 4:
      if (!usedSubargs) {
        return {skipCount:0};
      }
      if (5 > ary.length) {
        return {skipCount:0};
      }
      var c$9 = parseState.parseInt(ary[1]), m$10 = parseState.parseInt(ary[2]), y$11 = parseState.parseInt(ary[3]), k = parseState.parseInt(ary[4]);
      return {skipCount:0};
    case 5:
      if (2 > ary.length) {
        return {skipCount:0};
      }
      var ret = {skipCount:usedSubargs ? 0 : 2, }, color = parseState.parseInt(ary[1]);
      color < attrs.colorPalette.length && (ret.color = color);
      return ret;
  }
};
hterm.VT.CSI.m = function(parseState) {
  var attrs = this.terminal.getTextAttributes();
  if (parseState.args.length) {
    for (var i = 0; i < parseState.args.length; i++) {
      var arg = parseState.iarg(i, 0);
      if (30 > arg) {
        if (0 == arg) {
          attrs.reset();
        } else {
          if (1 == arg) {
            attrs.bold = !0;
          } else {
            if (2 == arg) {
              attrs.faint = !0;
            } else {
              if (3 == arg) {
                attrs.italic = !0;
              } else {
                if (4 == arg) {
                  if (parseState.argHasSubargs(i)) {
                    var uarg = parseState.args[i].split(":")[1];
                    0 == uarg ? attrs.underline = !1 : 1 == uarg ? attrs.underline = "solid" : 2 == uarg ? attrs.underline = "double" : 3 == uarg ? attrs.underline = "wavy" : 4 == uarg ? attrs.underline = "dotted" : 5 == uarg && (attrs.underline = "dashed");
                  } else {
                    attrs.underline = "solid";
                  }
                } else {
                  5 == arg ? attrs.blink = !0 : 7 == arg ? attrs.inverse = !0 : 8 == arg ? attrs.invisible = !0 : 9 == arg ? attrs.strikethrough = !0 : 21 == arg ? attrs.underline = "double" : 22 == arg ? (attrs.bold = !1, attrs.faint = !1) : 23 == arg ? attrs.italic = !1 : 24 == arg ? attrs.underline = !1 : 25 == arg ? attrs.blink = !1 : 27 == arg ? attrs.inverse = !1 : 28 == arg ? attrs.invisible = !1 : 29 == arg && (attrs.strikethrough = !1);
                }
              }
            }
          }
        }
      } else {
        if (50 > arg) {
          if (38 > arg) {
            attrs.foregroundSource = arg - 30;
          } else {
            if (38 == arg) {
              var result = this.parseSgrExtendedColors(parseState, i, attrs);
              void 0 !== result.color && (attrs.foregroundSource = result.color);
              i += result.skipCount;
            } else {
              if (39 == arg) {
                attrs.foregroundSource = attrs.SRC_DEFAULT;
              } else {
                if (48 > arg) {
                  attrs.backgroundSource = arg - 40;
                } else {
                  if (48 == arg) {
                    var result$12 = this.parseSgrExtendedColors(parseState, i, attrs);
                    void 0 !== result$12.color && (attrs.backgroundSource = result$12.color);
                    i += result$12.skipCount;
                  } else {
                    attrs.backgroundSource = attrs.SRC_DEFAULT;
                  }
                }
              }
            }
          }
        } else {
          if (58 == arg) {
            var result$13 = this.parseSgrExtendedColors(parseState, i, attrs);
            void 0 !== result$13.color && (attrs.underlineSource = result$13.color);
            i += result$13.skipCount;
          } else {
            59 == arg ? attrs.underlineSource = attrs.SRC_DEFAULT : 90 <= arg && 97 >= arg ? attrs.foregroundSource = arg - 90 + 8 : 100 <= arg && 107 >= arg && (attrs.backgroundSource = arg - 100 + 8);
          }
        }
      }
    }
    attrs.setDefaults(this.terminal.getForegroundColor(), this.terminal.getBackgroundColor());
  } else {
    attrs.reset();
  }
};
hterm.VT.CSI.m.supportsSubargs = !0;
hterm.VT.CSI[">m"] = hterm.VT.ignore;
hterm.VT.CSI.n = function(parseState) {
  if (5 == parseState.args[0]) {
    this.terminal.io.sendString("\u001b0n");
  } else {
    if (6 == parseState.args[0]) {
      var row = this.terminal.getCursorRow() + 1, col = this.terminal.getCursorColumn() + 1;
      this.terminal.io.sendString("\u001b[" + row + ";" + col + "R");
    }
  }
};
hterm.VT.CSI[">n"] = hterm.VT.ignore;
hterm.VT.CSI["?n"] = function(parseState) {
  if (6 == parseState.args[0]) {
    var row = this.terminal.getCursorRow() + 1, col = this.terminal.getCursorColumn() + 1;
    this.terminal.io.sendString("\u001b[" + row + ";" + col + "R");
  } else {
    15 == parseState.args[0] ? this.terminal.io.sendString("\u001b[?11n") : 25 == parseState.args[0] ? this.terminal.io.sendString("\u001b[?21n") : 26 == parseState.args[0] ? this.terminal.io.sendString("\u001b[?12;1;0;0n") : 53 == parseState.args[0] && this.terminal.io.sendString("\u001b[?50n");
  }
};
hterm.VT.CSI[">p"] = hterm.VT.ignore;
hterm.VT.CSI["!p"] = function() {
  this.terminal.softReset();
};
hterm.VT.CSI.$p = hterm.VT.ignore;
hterm.VT.CSI["?$p"] = hterm.VT.ignore;
hterm.VT.CSI['"p'] = hterm.VT.ignore;
hterm.VT.CSI.q = hterm.VT.ignore;
hterm.VT.CSI[" q"] = function(parseState) {
  var arg = parseState.args[0];
  0 == arg || 1 == arg ? (this.terminal.setCursorShape(hterm.Terminal.cursorShape.BLOCK), this.terminal.setCursorBlink(!0)) : 2 == arg ? (this.terminal.setCursorShape(hterm.Terminal.cursorShape.BLOCK), this.terminal.setCursorBlink(!1)) : 3 == arg ? (this.terminal.setCursorShape(hterm.Terminal.cursorShape.UNDERLINE), this.terminal.setCursorBlink(!0)) : 4 == arg ? (this.terminal.setCursorShape(hterm.Terminal.cursorShape.UNDERLINE), this.terminal.setCursorBlink(!1)) : 5 == arg ? (this.terminal.setCursorShape(hterm.Terminal.cursorShape.BEAM), 
  this.terminal.setCursorBlink(!0)) : 6 == arg ? (this.terminal.setCursorShape(hterm.Terminal.cursorShape.BEAM), this.terminal.setCursorBlink(!1)) : console.warn("Unknown cursor style: " + arg);
};
hterm.VT.CSI['"q'] = hterm.VT.ignore;
hterm.VT.CSI.r = function(parseState) {
  var args = parseState.args, scrollTop = args[0] ? parseInt(args[0], 10) - 1 : null, scrollBottom = args[1] ? parseInt(args[1], 10) - 1 : null;
  this.terminal.setVTScrollRegion(scrollTop, scrollBottom);
  this.terminal.setCursorPosition(0, 0);
};
hterm.VT.CSI["?r"] = hterm.VT.ignore;
hterm.VT.CSI.$r = hterm.VT.ignore;
hterm.VT.CSI.s = function() {
  this.terminal.saveCursorAndState();
};
hterm.VT.CSI["?s"] = hterm.VT.ignore;
hterm.VT.CSI.t = hterm.VT.ignore;
hterm.VT.CSI.$t = hterm.VT.ignore;
hterm.VT.CSI[">t"] = hterm.VT.ignore;
hterm.VT.CSI[" t"] = hterm.VT.ignore;
hterm.VT.CSI.u = function() {
  this.terminal.restoreCursorAndState();
};
hterm.VT.CSI[" u"] = hterm.VT.ignore;
hterm.VT.CSI.$v = hterm.VT.ignore;
hterm.VT.CSI["'w"] = hterm.VT.ignore;
hterm.VT.CSI.x = hterm.VT.ignore;
hterm.VT.CSI["*x"] = hterm.VT.ignore;
hterm.VT.CSI.$x = hterm.VT.ignore;
hterm.VT.CSI.z = function(parseState) {
  if (!(1 > parseState.args.length)) {
    var arg = parseState.args[0];
    0 == arg ? 2 > parseState.args.length || (this.terminal.getTextAttributes().tileData = parseState.args[1]) : 1 == arg && (this.terminal.getTextAttributes().tileData = null);
  }
};
hterm.VT.CSI["'z"] = hterm.VT.ignore;
hterm.VT.CSI.$z = hterm.VT.ignore;
hterm.VT.CSI["'{"] = hterm.VT.ignore;
hterm.VT.CSI["'|"] = hterm.VT.ignore;
hterm.VT.CSI["'}"] = hterm.VT.ignore;
hterm.VT.CSI["'~"] = hterm.VT.ignore;
lib.rtdep("lib.f");
hterm.VT.CharacterMap = function(description, glmap) {
  this.description = description;
  this.GL = null;
  this.glmapBase_ = glmap;
  this.sync_();
};
hterm.VT.CharacterMap.prototype.sync_ = function(opt_glmap) {
  var $jscomp$this = this;
  if (this.glmapBase_ || opt_glmap) {
    this.glmap_ = opt_glmap ? Object.assign({}, this.glmapBase_, opt_glmap) : this.glmapBase_;
    var glchars = Object.keys(this.glmap_).map(function(key) {
      return "\\x" + lib.f.zpad(key.charCodeAt(0).toString(16));
    });
    this.glre_ = new RegExp("[" + glchars.join("") + "]", "g");
    this.GL = function(str) {
      return str.replace($jscomp$this.glre_, function(ch) {
        return $jscomp$this.glmap_[ch];
      });
    };
  } else {
    this.GL = null, delete this.glmap_, delete this.glre_;
  }
};
hterm.VT.CharacterMap.prototype.reset = function() {
  this.glmap_ !== this.glmapBase_ && this.sync_();
};
hterm.VT.CharacterMap.prototype.setOverrides = function(glmap) {
  this.sync_(glmap);
};
hterm.VT.CharacterMap.prototype.clone = function() {
  var map = new hterm.VT.CharacterMap(this.description, this.glmapBase_);
  this.glmap_ !== this.glmapBase_ && map.setOverrides(this.glmap_);
  return map;
};
hterm.VT.CharacterMaps = function() {
  this.mapsBase_ = this.maps_ = hterm.VT.CharacterMaps.DefaultMaps;
};
hterm.VT.CharacterMaps.prototype.getMap = function(name) {
  if (this.maps_.hasOwnProperty(name)) {
    return this.maps_[name];
  }
};
hterm.VT.CharacterMaps.prototype.addMap = function(name, map) {
  this.maps_ === this.mapsBase_ && (this.maps_ = Object.assign({}, this.mapsBase_));
  this.maps_[name] = map;
};
hterm.VT.CharacterMaps.prototype.reset = function() {
  this.maps_ !== hterm.VT.CharacterMaps.DefaultMaps && (this.maps_ = hterm.VT.CharacterMaps.DefaultMaps);
};
hterm.VT.CharacterMaps.prototype.setOverrides = function(maps) {
  this.maps_ === this.mapsBase_ && (this.maps_ = Object.assign({}, this.mapsBase_));
  for (var name in maps) {
    var map = this.getMap(name);
    void 0 !== map ? (this.maps_[name] = map.clone(), this.maps_[name].setOverrides(maps[name])) : this.addMap(name, new hterm.VT.CharacterMap("user " + name, maps[name]));
  }
};
hterm.VT.CharacterMaps.DefaultMaps = {};
hterm.VT.CharacterMaps.DefaultMaps["0"] = new hterm.VT.CharacterMap("graphic", {"`":"\u25c6", a:"\u2592", b:"\u2409", c:"\u240c", d:"\u240d", e:"\u240a", f:"\u00b0", g:"\u00b1", h:"\u2424", i:"\u240b", j:"\u2518", k:"\u2510", l:"\u250c", m:"\u2514", n:"\u253c", o:"\u23ba", p:"\u23bb", q:"\u2500", r:"\u23bc", s:"\u23bd", t:"\u251c", u:"\u2524", v:"\u2534", w:"\u252c", x:"\u2502", y:"\u2264", z:"\u2265", "{":"\u03c0", "|":"\u2260", "}":"\u00a3", "~":"\u00b7", });
hterm.VT.CharacterMaps.DefaultMaps.A = new hterm.VT.CharacterMap("british", {"#":"\u00a3", });
hterm.VT.CharacterMaps.DefaultMaps.B = new hterm.VT.CharacterMap("us", null);
hterm.VT.CharacterMaps.DefaultMaps["4"] = new hterm.VT.CharacterMap("dutch", {"#":"\u00a3", "@":"\u00be", "[":"\u0132", "\\":"\u00bd", "]":"|", "{":"\u00a8", "|":"f", "}":"\u00bc", "~":"\u00b4", });
hterm.VT.CharacterMaps.DefaultMaps.C = hterm.VT.CharacterMaps.DefaultMaps["5"] = new hterm.VT.CharacterMap("finnish", {"[":"\u00c4", "\\":"\u00d6", "]":"\u00c5", "^":"\u00dc", "`":"\u00e9", "{":"\u00e4", "|":"\u00f6", "}":"\u00e5", "~":"\u00fc", });
hterm.VT.CharacterMaps.DefaultMaps.R = new hterm.VT.CharacterMap("french", {"#":"\u00a3", "@":"\u00e0", "[":"\u00b0", "\\":"\u00e7", "]":"\u00a7", "{":"\u00e9", "|":"\u00f9", "}":"\u00e8", "~":"\u00a8", });
hterm.VT.CharacterMaps.DefaultMaps.Q = new hterm.VT.CharacterMap("french canadian", {"@":"\u00e0", "[":"\u00e2", "\\":"\u00e7", "]":"\u00ea", "^":"\u00ee", "`":"\u00f4", "{":"\u00e9", "|":"\u00f9", "}":"\u00e8", "~":"\u00fb", });
hterm.VT.CharacterMaps.DefaultMaps.K = new hterm.VT.CharacterMap("german", {"@":"\u00a7", "[":"\u00c4", "\\":"\u00d6", "]":"\u00dc", "{":"\u00e4", "|":"\u00f6", "}":"\u00fc", "~":"\u00df", });
hterm.VT.CharacterMaps.DefaultMaps.Y = new hterm.VT.CharacterMap("italian", {"#":"\u00a3", "@":"\u00a7", "[":"\u00b0", "\\":"\u00e7", "]":"\u00e9", "`":"\u00f9", "{":"\u00e0", "|":"\u00f2", "}":"\u00e8", "~":"\u00ec", });
hterm.VT.CharacterMaps.DefaultMaps.E = hterm.VT.CharacterMaps.DefaultMaps["6"] = new hterm.VT.CharacterMap("norwegian/danish", {"@":"\u00c4", "[":"\u00c6", "\\":"\u00d8", "]":"\u00c5", "^":"\u00dc", "`":"\u00e4", "{":"\u00e6", "|":"\u00f8", "}":"\u00e5", "~":"\u00fc", });
hterm.VT.CharacterMaps.DefaultMaps.Z = new hterm.VT.CharacterMap("spanish", {"#":"\u00a3", "@":"\u00a7", "[":"\u00a1", "\\":"\u00d1", "]":"\u00bf", "{":"\u00b0", "|":"\u00f1", "}":"\u00e7", });
hterm.VT.CharacterMaps.DefaultMaps["7"] = hterm.VT.CharacterMaps.DefaultMaps.H = new hterm.VT.CharacterMap("swedish", {"@":"\u00c9", "[":"\u00c4", "\\":"\u00d6", "]":"\u00c5", "^":"\u00dc", "`":"\u00e9", "{":"\u00e4", "|":"\u00f6", "}":"\u00e5", "~":"\u00fc", });
hterm.VT.CharacterMaps.DefaultMaps["="] = new hterm.VT.CharacterMap("swiss", {"#":"\u00f9", "@":"\u00e0", "[":"\u00e9", "\\":"\u00e7", "]":"\u00ea", "^":"\u00ee", _:"\u00e8", "`":"\u00f4", "{":"\u00e4", "|":"\u00f6", "}":"\u00fc", "~":"\u00fb", });
lib.resource.add("hterm/audio/bell", "audio/ogg;base64", "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");
lib.resource.add("hterm/images/icon-96", "image/png;base64", "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");
lib.resource.add("hterm/concat/date", "text/plain", "Thu, 17 Jan 2019 18:42:32 +0000");
lib.resource.add("hterm/changelog/version", "text/plain", "1.83");
lib.resource.add("hterm/changelog/date", "text/plain", "2018-12-02, Minor improvements.");
lib.resource.add("hterm/git/HEAD", "text/plain", "e5f2a9b592a4e78b519994b158b8a1569248f372");
-1 != window.location.href.indexOf("/devshell") && (hterm.Terminal.prototype.overlaySize = function() {
});
hterm.ScrollPort.prototype.decorate = function(div, callback) {
  var $jscomp$this = this;
  this.div_ = div;
  var onLoad = function() {
    $jscomp$this.paintIframeContents_();
    callback && callback();
  };
  this.iframe_ = div.ownerDocument.createElement("iframe");
  this.iframe_.style.cssText = "border: 0;height: 100%;position: absolute;width: 100%";
  var firefox = !1;
  "mozInnerScreenX" in window && (firefox = !0, this.screen_ || (this.document_ = document, this.div_ = document.createElement("div"), this.userCssLink_ = document.createElement("div"), this.userCssText_ = document.createElement("div"), this.screen_ = document.createElement("div"), this.scrollUpButton_ = document.createElement("div"), this.scrollDownButton_ = document.createElement("div"), this.rowNodes_ = document.createElement("div"), this.topSelectBag_ = document.createElement("div"), this.bottomSelectBag_ = 
  document.createElement("div"), this.topFold_ = document.createElement("div"), this.bottomFold_ = document.createElement("div"), this.scrollArea_ = document.createElement("div"), this.svg_ = document.createElement("div"), this.pasteTarget_ = document.createElement("div"), this.cursorNode_ = document.createElement("div")), this.iframe_.addEventListener("load", function() {
    return onLoad();
  }));
  div.appendChild(this.iframe_);
  firefox || onLoad();
};

