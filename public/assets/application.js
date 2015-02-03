/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*! http://mths.be/placeholder v2.0.7 by @mathias */

;
(function(window, document, $) {

    var isInputSupported = 'placeholder' in document.createElement('input'),
            isTextareaSupported = 'placeholder' in document.createElement('textarea'),
            prototype = $.fn,
            valHooks = $.valHooks,
            hooks,
            placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function() {
            var $this = this;
            $this
                    .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                    .not('.placeholder')
                    .bind({
                'focus.placeholder': clearPlaceholder,
                'blur.placeholder': setPlaceholder
            })
                    .data('placeholder-enabled', true)
                    .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);
                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);
                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != document.activeElement) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        isInputSupported || (valHooks.input = hooks);
        isTextareaSupported || (valHooks.textarea = hooks);

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.placeholder').each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {},
                rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this,
                $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
                input == document.activeElement && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement,
                input = this,
                $input = $(input),
                $origInput = $input,
                id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({'type': 'text'});
                    } catch (e) {
                        $replacement = $('<input>').attr($.extend(args(this), {'type': 'text'}));
                    }
                    $replacement
                            .removeAttr('name')
                            .data({
                        'placeholder-password': true,
                        'placeholder-id': id
                    })
                            .bind('focus.placeholder', clearPlaceholder);
                    $input
                            .data({
                        'placeholder-textinput': $replacement,
                        'placeholder-id': id
                    })
                            .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

}(this, document, jQuery));
/**
 * AXMenu v1.0 - jQuery menu plugin.
 * Copyright (c) 2013 ActiveAxon.
 * http://www.activeaxon.com
 * info@activeaxon.com
 */

;
(function($, window, document, undefined) {


    // Create the defaults once
    var pluginName = "AXMenu",
            defaults = {
        showArrowIcon: true,
        firstLevelArrowIcon: '<i class="icon-chevron-down"></i>',
        menuArrowIcon: '<i class="icon-caret-up icon-arrow-menu"></i>',
        subMenuArrowIcon: '<i class="icon-chevron-right icon-arrow-submenu"></i>',
        activeLinkClass: 'activelink'
    };

    // The actual plugin constructor
    function AXMenu(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
        this.$el = $(element);

        this.init();
        this.$timeoutRef = new Array();

    }

    AXMenu.prototype = {
        init: function() {

            this.currentPageLink = window.location.href;
            this.pageName = getPageName(this.currentPageLink);
            this.addFirstLevelArrowIcon(this.$el, this.options);

            this.startEventListener(this.$el, this.options);
            //add the arrow between the menubox
            this.addArrowIcon(this.$el, this.options);
            this.addSubArrowIcon(this.$el, this.options);
            this.setSelectedElementLink(this.$el);

        },
        startEventListener: function(el, options) {

            var $that = this;

            var currentUrl = window.location.href;

            /*
             For every subli element attach mouse enter event
             */
            el.find('li').mouseenter(function() {

                var $ul = $(this).find('ul:first').first(),
                        $li = $(this).first(),
                        $ulNext;

                //this is used for handling menu icon
                $ulNext = $ul.next() ? $ul.next().first() : false;

                // attach unique id for each UL element
                var $subMenuid;
                if (!$ul.data('zeina-id')) {
                    $ul.data('zeina-id', getUID());
                }
                $subMenuid = $ul.data('zeina-id');

                /* Clear timeouts & events & z-index */
                window.clearTimeout($that.$timeoutRef[ $subMenuid ])
                $li.unbind('mouseleave');

                el.find('ul').css('z-index', 1);

                // if its has sub-menu
                if ($ul[0] && $ul[0].nodeName.toLowerCase() === 'ul') {

                    /* Show Menu & Arrow */
                    $ul.addClass('show-sub-menu');
                    $ul.css('z-index', 2);
                    if ($ulNext) {
                        $ulNext.addClass('show-sub-menu');
                    }

                    /* Handle Mouse Leave Action */
                    $li.mouseleave(function() {

                        $ul.removeClass('show-sub-menu')
                        if ($ulNext[0] && $ulNext[0].nodeName.toLowerCase() === 'i') {
                            $ulNext.removeClass('show-sub-menu');
                        }
                    });

                }
            });
        },
        /**
         *  Add icon for 1st level menus.
         *
         * @param el
         * @param options
         */
        addArrowIcon: function(el, options) {
            var $opt = this.options;
            if (options['showArrowIcon'] === true) {
                el.find('>li').each(function() {
                    $(this).find('ul:first').each(function() {
                        $(this).parent().append($opt['menuArrowIcon']);
                    });
                });
            }
        },
        /**
         *  Add icon for 1st level menus.
         *
         * @param el
         * @param options
         */
        addSubArrowIcon: function(el, options) {

            var $opt = this.options,
                    $that = this;
            if (options['showArrowIcon'] === true) {

                el.find('ul a').each(function() {

                    //cache element
                    var $this = $(this);

                    //set selected link
                    //$that.setSelectedElementLink( $this  );

                    if ($this.next()[0] && $this.next()[0].nodeName.toLowerCase() === 'ul') {
                        $this.append($opt['subMenuArrowIcon']);
                    }
                });
            }
        },
        /**
         *  Add first level icon
         *
         * @param el
         * @param options
         */
        addFirstLevelArrowIcon: function(el, options) {

            var $opt = this.options,
                    $that = this;
            if (options['showArrowIcon'] === true) {

                el.find('>li>a').each(function() {

                    //cache element
                    var $this = $(this);

                    //set selected link
                    //$that.setSelectedElementLink( $this  );

                    if ($this.next()[0] && $this.next()[0].nodeName.toLowerCase() === 'ul') {
                        $this.find('span.label-nav').append($opt['firstLevelArrowIcon']);
                    }

                });

            }
        },
        /**
         * Set selected element.
         *
         * @param el
         * @param options
         */
        setSelectedElementLink: function(el) {

            var $opt = this.options, link, linkRegex, $this, $that = this;
            ;
            var found = false;
            $(el).find('a').each(function() {

                $this = $(this);
                link = $this.attr('href');
                //linkRegex = new RegExp( escapeRegExp(link) );

                if ($.trim(link) != '' && $that.pageName == getPageName(link)) {
                    found = true;
                    $this.addClass($that.options['activeLinkClass']);
                    /* Set selected links ( parents links ) */
                    $this.parentsUntil(el).each(function() {
                        $(this).find('>a').addClass($that.options['activeLinkClass']);
                    });
                }

            });


        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new AXMenu(this, options));
            }
        });
    };




    /**
     * This function is used for return unique string using for tracking element timeouts.
     * @returns {string}
     */
    var i = 0;
    function getUID() {
        return 'U' + (++i);
    }

    /**
     * getPageName
     *
     * @returns {string}
     */
    function getPageName(link) {
        var segments = link.split("/");
        return segments[ segments.length - 1 ];
    }

})(jQuery, window, document);
/**
 * Animator
 * 
 * Animation Engine
 * 
 * ActiveAxon 2013(c)
 */

function animator() {
    var delay, speed;
    $('.animated').each(function() {
        var el = $(this);
        //console.log( elements[i] , i );
        if (el.visible(true)) {
            if (el.data('animtype') == 'animate-progress') {

                el.css('opacity', 1);
                el.addClass('animatedVisi');
                el.css('opacity', 1);
                el.css('width', el.attr('aria-valuenow'));
                //el.find('.progress .progress-bar').html(el.data('progress-to'));

                return;
            }

            delay = el.data('animdelay');
            if (!delay) {
                delay = 0;
            }

            el.css('-webkit-animation-delay', delay);
            el.css('-moz-animation-delay', delay);
            el.css('-o-animation-delay', delay);
            el.css('animation-delay', delay);

            speed = el.data('animspeed');

            if (!speed) {
                speed = 0.5;
            }

            el.css('-webkit-animation-duration', speed);
            el.css('-moz-animation-duration', speed);
            el.css('-o-animation-duration', speed);
            el.css('animation-duration', speed);

            if (el.data('animtype')) {
                el.addClass(el.data('animtype'));
            }

            el.addClass('animatedVisi');
            // que.push(this);
        }
        else if (el.data('animrepeat') == '1') {
            el.removeClass(el.data('animtype'));
            el.removeClass('animatedVisi');
        }
    });
}

$(window).ready(animator);
$(window).load(animator);


$(window).scroll(function(event) {
    animator();
});

/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {


    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *     the user visible viewport of a web browser.
     *     only accounts for vertical position, not horizontal.
     */

    $.fn.visible = function(partial) {

        var $t = $(this),
                $w = $(window),
                viewTop = $w.scrollTop(),
                viewBottom = viewTop + $w.height(),
                _top = $t.offset().top,
                _bottom = _top + $t.height(),
                compareTop = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };


})(jQuery);
/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if ("undefined" == typeof jQuery)
    throw new Error("Bootstrap's JavaScript requires jQuery");
+function(a) {
    "use strict";
    function b() {
        var a = document.createElement("bootstrap"), b = {WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend"};
        for (var c in b)
            if (void 0 !== a.style[c])
                return{end: b[c]};
        return!1
    }
    a.fn.emulateTransitionEnd = function(b) {
        var c = !1, d = this;
        a(this).one(a.support.transition.end, function() {
            c = !0
        });
        var e = function() {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function() {
        a.support.transition = b()
    })
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var c = a(this), e = c.data("bs.alert");
            e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
        })
    }
    var c = '[data-dismiss="alert"]', d = function(b) {
        a(b).on("click", c, this.close)
    };
    d.VERSION = "3.1.1", d.prototype.close = function(b) {
        function c() {
            f.detach().trigger("closed.bs.alert").remove()
        }
        var d = a(this), e = d.attr("data-target");
        e || (e = d.attr("href"), e = e && e.replace(/.*(?=#[^\s]*$)/, ""));
        var f = a(e);
        b && b.preventDefault(), f.length || (f = d.hasClass("alert") ? d : d.parent()), f.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one(a.support.transition.end, c).emulateTransitionEnd(150) : c())
    };
    var e = a.fn.alert;
    a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function() {
        return a.fn.alert = e, this
    }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.button"), f = "object" == typeof b && b;
            e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
        })
    }
    var c = function(b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
    };
    c.VERSION = "3.1.1", c.DEFAULTS = {loadingText: "loading..."}, c.prototype.setState = function(b) {
        var c = "disabled", d = this.$element, e = d.is("input") ? "val" : "html", f = d.data();
        b += "Text", null == f.resetText && d.data("resetText", d[e]()), d[e](null == f[b] ? this.options[b] : f[b]), setTimeout(a.proxy(function() {
            "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
        }, this), 0)
    }, c.prototype.toggle = function() {
        var a = !0, b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
            var c = this.$element.find("input");
            "radio" == c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? a = !1 : b.find(".active").removeClass("active")), a && c.prop("checked", !this.$element.hasClass("active")).trigger("change")
        }
        a && this.$element.toggleClass("active")
    };
    var d = a.fn.button;
    a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function() {
        return a.fn.button = d, this
    }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(c) {
        var d = a(c.target);
        d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), c.preventDefault()
    })
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.carousel"), f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b), g = "string" == typeof b ? b : f.slide;
            e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    }
    var c = function(b, c) {
        this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = this.sliding = this.interval = this.$active = this.$items = null, "hover" == this.options.pause && this.$element.on("mouseenter", a.proxy(this.pause, this)).on("mouseleave", a.proxy(this.cycle, this))
    };
    c.VERSION = "3.1.1", c.DEFAULTS = {interval: 5e3, pause: "hover", wrap: !0}, c.prototype.cycle = function(b) {
        return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
    }, c.prototype.getActiveIndex = function() {
        return this.$active = this.$element.find(".item.active"), this.$items = this.$active.parent().children(".item"), this.$items.index(this.$active)
    }, c.prototype.to = function(b) {
        var c = this, d = this.getActiveIndex();
        return b > this.$items.length - 1 || 0 > b ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function() {
            c.to(b)
        }) : d == b ? this.pause().cycle() : this.slide(b > d ? "next" : "prev", a(this.$items[b]))
    }, c.prototype.pause = function(b) {
        return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, c.prototype.next = function() {
        return this.sliding ? void 0 : this.slide("next")
    }, c.prototype.prev = function() {
        return this.sliding ? void 0 : this.slide("prev")
    }, c.prototype.slide = function(b, c) {
        var d = this.$element.find(".item.active"), e = c || d[b](), f = this.interval, g = "next" == b ? "left" : "right", h = "next" == b ? "first" : "last", i = this;
        if (!e.length) {
            if (!this.options.wrap)
                return;
            e = this.$element.find(".item")[h]()
        }
        if (e.hasClass("active"))
            return this.sliding = !1;
        var j = e[0], k = a.Event("slide.bs.carousel", {relatedTarget: j, direction: g});
        if (this.$element.trigger(k), !k.isDefaultPrevented()) {
            this.sliding = !0, f && this.pause(), this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$element.one("slid.bs.carousel", function() {
                var b = a(i.$indicators.children()[i.getActiveIndex()]);
                b && b.addClass("active")
            }));
            var l = a.Event("slid.bs.carousel", {relatedTarget: j, direction: g});
            return a.support.transition && this.$element.hasClass("slide") ? (e.addClass(b), e[0].offsetWidth, d.addClass(g), e.addClass(g), d.one(a.support.transition.end, function() {
                e.removeClass([b, g].join(" ")).addClass("active"), d.removeClass(["active", g].join(" ")), i.sliding = !1, setTimeout(function() {
                    i.$element.trigger(l)
                }, 0)
            }).emulateTransitionEnd(1e3 * d.css("transition-duration").slice(0, -1))) : (d.removeClass("active"), e.addClass("active"), this.sliding = !1, this.$element.trigger(l)), f && this.cycle(), this
        }
    };
    var d = a.fn.carousel;
    a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function() {
        return a.fn.carousel = d, this
    }, a(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(c) {
        var d, e = a(this), f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, "")), g = a.extend({}, f.data(), e.data()), h = e.attr("data-slide-to");
        h && (g.interval = !1), b.call(f, g), (h = e.attr("data-slide-to")) && f.data("bs.carousel").to(h), c.preventDefault()
    }), a(window).on("load", function() {
        a('[data-ride="carousel"]').each(function() {
            var c = a(this);
            b.call(c, c.data())
        })
    })
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.collapse"), f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b);
            !e && f.toggle && "show" == b && (b = !b), e || d.data("bs.collapse", e = new c(this, f)), "string" == typeof b && e[b]()
        })
    }
    var c = function(b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.transitioning = null, this.options.parent && (this.$parent = a(this.options.parent)), this.options.toggle && this.toggle()
    };
    c.VERSION = "3.1.1", c.DEFAULTS = {toggle: !0}, c.prototype.dimension = function() {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height"
    }, c.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var c = a.Event("show.bs.collapse");
            if (this.$element.trigger(c), !c.isDefaultPrevented()) {
                var d = this.$parent && this.$parent.find("> .panel > .in");
                if (d && d.length) {
                    var e = d.data("bs.collapse");
                    if (e && e.transitioning)
                        return;
                    b.call(d, "hide"), e || d.data("bs.collapse", null)
                }
                var f = this.dimension();
                this.$element.removeClass("collapse").addClass("collapsing")[f](0), this.transitioning = 1;
                var g = function(b) {
                    return b && b.target != this.$element[0] ? void this.$element.one(a.support.transition.end, a.proxy(g, this)) : (this.$element.removeClass("collapsing").addClass("collapse in")[f](""), this.transitioning = 0, void this.$element.off(a.support.transition.end + ".bs.collapse").trigger("shown.bs.collapse"))
                };
                if (!a.support.transition)
                    return g.call(this);
                var h = a.camelCase(["scroll", f].join("-"));
                this.$element.on(a.support.transition.end + ".bs.collapse", a.proxy(g, this)).emulateTransitionEnd(350)[f](this.$element[0][h])
            }
        }
    }, c.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"), this.transitioning = 1;
                var d = function(b) {
                    return b && b.target != this.$element[0] ? void this.$element.one(a.support.transition.end, a.proxy(d, this)) : (this.transitioning = 0, void this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse"))
                };
                return a.support.transition ? void this.$element[c](0).one(a.support.transition.end, a.proxy(d, this)).emulateTransitionEnd(350) : d.call(this)
            }
        }
    }, c.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    };
    var d = a.fn.collapse;
    a.fn.collapse = b, a.fn.collapse.Constructor = c, a.fn.collapse.noConflict = function() {
        return a.fn.collapse = d, this
    }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(c) {
        var d, e = a(this), f = e.attr("data-target") || c.preventDefault() || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""), g = a(f), h = g.data("bs.collapse"), i = h ? "toggle" : e.data(), j = e.attr("data-parent"), k = j && a(j);
        h && h.transitioning || (k && k.find('[data-toggle="collapse"][data-parent="' + j + '"]').not(e).addClass("collapsed"), e[g.hasClass("in") ? "addClass" : "removeClass"]("collapsed")), b.call(g, i)
    })
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        b && 3 === b.which || (a(e).remove(), a(f).each(function() {
            var d = c(a(this)), e = {relatedTarget: this};
            d.hasClass("open") && (d.trigger(b = a.Event("hide.bs.dropdown", e)), b.isDefaultPrevented() || d.removeClass("open").trigger("hidden.bs.dropdown", e))
        }))
    }
    function c(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }
    function d(b) {
        return this.each(function() {
            var c = a(this), d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
        })
    }
    var e = ".dropdown-backdrop", f = '[data-toggle="dropdown"]', g = function(b) {
        a(b).on("click.bs.dropdown", this.toggle)
    };
    g.VERSION = "3.1.1", g.prototype.toggle = function(d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = c(e), g = f.hasClass("open");
            if (b(), !g) {
                "ontouchstart"in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b);
                var h = {relatedTarget: this};
                if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented())
                    return;
                e.trigger("focus"), f.toggleClass("open").trigger("shown.bs.dropdown", h)
            }
            return!1
        }
    }, g.prototype.keydown = function(b) {
        if (/(38|40|27)/.test(b.keyCode)) {
            var d = a(this);
            if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
                var e = c(d), g = e.hasClass("open");
                if (!g || g && 27 == b.keyCode)
                    return 27 == b.which && e.find(f).trigger("focus"), d.trigger("click");
                var h = " li:not(.divider):visible a", i = e.find('[role="menu"]' + h + ', [role="listbox"]' + h);
                if (i.length) {
                    var j = i.index(i.filter(":focus"));
                    38 == b.keyCode && j > 0 && j--, 40 == b.keyCode && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                }
            }
        }
    };
    var h = a.fn.dropdown;
    a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function() {
        return a.fn.dropdown = h, this
    }, a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form", function(a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f + ', [role="menu"], [role="listbox"]', g.prototype.keydown)
}(jQuery), +function(a) {
    "use strict";
    function b(b, d) {
        return this.each(function() {
            var e = a(this), f = e.data("bs.modal"), g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
            f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
        })
    }
    var c = function(b, c) {
        this.options = c, this.$body = a(document.body), this.$element = a(b), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    c.VERSION = "3.1.1", c.DEFAULTS = {backdrop: !0, keyboard: !0, show: !0}, c.prototype.toggle = function(a) {
        return this.isShown ? this.hide() : this.show(a)
    }, c.prototype.show = function(b) {
        var c = this, d = a.Event("show.bs.modal", {relatedTarget: b});
        this.$element.trigger(d), this.isShown || d.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.$body.addClass("modal-open"), this.setScrollbar(), this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function() {
            var d = a.support.transition && c.$element.hasClass("fade");
            c.$element.parent().length || c.$element.appendTo(c.$body), c.$element.show().scrollTop(0), d && c.$element[0].offsetWidth, c.$element.addClass("in").attr("aria-hidden", !1), c.enforceFocus();
            var e = a.Event("shown.bs.modal", {relatedTarget: b});
            d ? c.$element.find(".modal-dialog").one(a.support.transition.end, function() {
                c.$element.trigger("focus").trigger(e)
            }).emulateTransitionEnd(300) : c.$element.trigger("focus").trigger(e)
        }))
    }, c.prototype.hide = function(b) {
        b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.$body.removeClass("modal-open"), this.resetScrollbar(), this.escape(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one(a.support.transition.end, a.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
    }, c.prototype.enforceFocus = function() {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
        }, this))
    }, c.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", a.proxy(function(a) {
            27 == a.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
    }, c.prototype.hideModal = function() {
        var a = this;
        this.$element.hide(), this.backdrop(function() {
            a.$element.trigger("hidden.bs.modal")
        })
    }, c.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, c.prototype.backdrop = function(b) {
        var c = this, d = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var e = a.support.transition && d;
            if (this.$backdrop = a('<div class="modal-backdrop ' + d + '" />').appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function(a) {
                a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            }, this)), e && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b)
                return;
            e ? this.$backdrop.one(a.support.transition.end, b).emulateTransitionEnd(150) : b()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var f = function() {
                c.removeBackdrop(), b && b()
            };
            a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(a.support.transition.end, f).emulateTransitionEnd(150) : f()
        } else
            b && b()
    }, c.prototype.checkScrollbar = function() {
        document.body.clientWidth >= window.innerWidth || (this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar())
    }, c.prototype.setScrollbar = function() {
        var a = parseInt(this.$body.css("padding-right") || 0);
        this.scrollbarWidth && this.$body.css("padding-right", a + this.scrollbarWidth)
    }, c.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", "")
    }, c.prototype.measureScrollbar = function() {
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure", this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b
    };
    var d = a.fn.modal;
    a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function() {
        return a.fn.modal = d, this
    }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(c) {
        var d = a(this), e = d.attr("href"), f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")), g = f.data("bs.modal") ? "toggle" : a.extend({remote: !/#/.test(e) && e}, f.data(), d.data());
        d.is("a") && c.preventDefault(), b.call(f, g, this), f.one("hide.bs.modal", function() {
            d.is(":visible") && d.trigger("focus")
        })
    })
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.tooltip"), f = "object" == typeof b && b;
            (e || "destroy" != b) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", a, b)
    };
    c.VERSION = "3.1.1", c.DEFAULTS = {animation: !0, placement: "top", selector: !1, template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: !1, container: !1, viewport: {selector: "body", padding: 0}}, c.prototype.init = function(b, c, d) {
        this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(this.options.viewport.selector || this.options.viewport);
        for (var e = this.options.trigger.split(" "), f = e.length; f--; ) {
            var g = e[f];
            if ("click" == g)
                this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
            else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter" : "focusin", i = "hover" == g ? "mouseleave" : "focusout";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({}, this.options, {trigger: "manual", selector: ""}) : this.fixTitle()
    }, c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }, c.prototype.getOptions = function(b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {show: b.delay, hide: b.delay}), b
    }, c.prototype.getDelegateOptions = function() {
        var b = {}, c = this.getDefaults();
        return this._options && a.each(this._options, function(a, d) {
            c[a] != d && (b[a] = d)
        }), b
    }, c.prototype.enter = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function() {
            "in" == c.hoverState && c.show()
        }, c.options.delay.show)) : c.show()
    }, c.prototype.leave = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function() {
            "out" == c.hoverState && c.hide()
        }, c.options.delay.hide)) : c.hide()
    }, c.prototype.show = function() {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            if (this.$element.trigger(b), b.isDefaultPrevented())
                return;
            var c = this, d = this.tip(), e = this.getUID(this.type);
            this.setContent(), d.attr("id", e), this.$element.attr("aria-describedby", e), this.options.animation && d.addClass("fade");
            var f = "function" == typeof this.options.placement ? this.options.placement.call(this, d[0], this.$element[0]) : this.options.placement, g = /\s?auto?\s?/i, h = g.test(f);
            h && (f = f.replace(g, "") || "top"), d.detach().css({top: 0, left: 0, display: "block"}).addClass(f).data("bs." + this.type, this), this.options.container ? d.appendTo(this.options.container) : d.insertAfter(this.$element);
            var i = this.getPosition(), j = d[0].offsetWidth, k = d[0].offsetHeight;
            if (h) {
                var l = f, m = this.$element.parent(), n = this.getPosition(m);
                f = "bottom" == f && i.top + i.height + k - n.scroll > n.height ? "top" : "top" == f && i.top - n.scroll - k < 0 ? "bottom" : "right" == f && i.right + j > n.width ? "left" : "left" == f && i.left - j < n.left ? "right" : f, d.removeClass(l).addClass(f)
            }
            var o = this.getCalculatedOffset(f, i, j, k);
            this.applyPlacement(o, f), this.hoverState = null;
            var p = function() {
                c.$element.trigger("shown.bs." + c.type)
            };
            a.support.transition && this.$tip.hasClass("fade") ? d.one(a.support.transition.end, p).emulateTransitionEnd(150) : p()
        }
    }, c.prototype.applyPlacement = function(b, c) {
        var d = this.tip(), e = d[0].offsetWidth, f = d[0].offsetHeight, g = parseInt(d.css("margin-top"), 10), h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top = b.top + g, b.left = b.left + h, a.offset.setOffset(d[0], a.extend({using: function(a) {
                d.css({top: Math.round(a.top), left: Math.round(a.left)})
            }}, b), 0), d.addClass("in");
        var i = d[0].offsetWidth, j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = k.left ? 2 * k.left - e + i : 2 * k.top - f + j, m = k.left ? "left" : "top", n = k.left ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(l, d[0][n], m)
    }, c.prototype.replaceArrow = function(a, b, c) {
        this.arrow().css(c, a ? 50 * (1 - a / b) + "%" : "")
    }, c.prototype.setContent = function() {
        var a = this.tip(), b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
    }, c.prototype.hide = function() {
        function b() {
            "in" != c.hoverState && d.detach(), c.$element.trigger("hidden.bs." + c.type)
        }
        var c = this, d = this.tip(), e = a.Event("hide.bs." + this.type);
        return this.$element.removeAttr("aria-describedby"), this.$element.trigger(e), e.isDefaultPrevented() ? void 0 : (d.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? d.one(a.support.transition.end, b).emulateTransitionEnd(150) : b(), this.hoverState = null, this)
    }, c.prototype.fixTitle = function() {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    }, c.prototype.hasContent = function() {
        return this.getTitle()
    }, c.prototype.getPosition = function(b) {
        b = b || this.$element;
        var c = b[0], d = "BODY" == c.tagName;
        return a.extend({}, "function" == typeof c.getBoundingClientRect ? c.getBoundingClientRect() : null, {scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop(), width: d ? a(window).width() : b.outerWidth(), height: d ? a(window).height() : b.outerHeight()}, d ? {top: 0, left: 0} : b.offset())
    }, c.prototype.getCalculatedOffset = function(a, b, c, d) {
        return"bottom" == a ? {top: b.top + b.height, left: b.left + b.width / 2 - c / 2} : "top" == a ? {top: b.top - d, left: b.left + b.width / 2 - c / 2} : "left" == a ? {top: b.top + b.height / 2 - d / 2, left: b.left - c} : {top: b.top + b.height / 2 - d / 2, left: b.left + b.width}
    }, c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
        var e = {top: 0, left: 0};
        if (!this.$viewport)
            return e;
        var f = this.options.viewport && this.options.viewport.padding || 0, g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
            var h = b.top - f - g.scroll, i = b.top + f - g.scroll + d;
            h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
        } else {
            var j = b.left - f, k = b.left + f + c;
            j < g.left ? e.left = g.left - j : k > g.width && (e.left = g.left + g.width - k)
        }
        return e
    }, c.prototype.getTitle = function() {
        var a, b = this.$element, c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    }, c.prototype.getUID = function(a) {
        do
            a += ~~(1e6 * Math.random());
        while (document.getElementById(a));
        return a
    }, c.prototype.tip = function() {
        return this.$tip = this.$tip || a(this.options.template)
    }, c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, c.prototype.validate = function() {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
    }, c.prototype.enable = function() {
        this.enabled = !0
    }, c.prototype.disable = function() {
        this.enabled = !1
    }, c.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }, c.prototype.toggle = function(b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    }, c.prototype.destroy = function() {
        clearTimeout(this.timeout), this.hide().$element.off("." + this.type).removeData("bs." + this.type)
    };
    var d = a.fn.tooltip;
    a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function() {
        return a.fn.tooltip = d, this
    }
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.popover"), f = "object" == typeof b && b;
            (e || "destroy" != b) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip)
        throw new Error("Popover requires tooltip.js");
    c.VERSION = "3.1.1", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {placement: "right", trigger: "click", content: "", template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }, c.prototype.setContent = function() {
        var a = this.tip(), b = this.getTitle(), c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").empty()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
    }, c.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }, c.prototype.getContent = function() {
        var a = this.$element, b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    }, c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }, c.prototype.tip = function() {
        return this.$tip || (this.$tip = a(this.options.template)), this.$tip
    };
    var d = a.fn.popover;
    a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function() {
        return a.fn.popover = d, this
    }
}(jQuery), +function(a) {
    "use strict";
    function b(c, d) {
        var e, f = a.proxy(this.process, this);
        this.$element = a(a(c).is("body") ? window : c), this.$body = a("body"), this.$scrollElement = this.$element.on("scroll.bs.scrollspy", f), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || (e = a(c).attr("href")) && e.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", this.offsets = a([]), this.targets = a([]), this.activeTarget = null, this.refresh(), this.process()
    }
    function c(c) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.scrollspy"), f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
        })
    }
    b.VERSION = "3.1.1", b.DEFAULTS = {offset: 10}, b.prototype.refresh = function() {
        var b = this.$element[0] == window ? "offset" : "position";
        this.offsets = a([]), this.targets = a([]);
        var c = this;
        this.$body.find(this.selector).filter(":visible").map(function() {
            var d = a(this), e = d.data("target") || d.attr("href"), f = /^#./.test(e) && a(e);
            return f && f.length && f.is(":visible") && [[f[b]().top + (!a.isWindow(c.$scrollElement.get(0)) && c.$scrollElement.scrollTop()), e]] || null
        }).sort(function(a, b) {
            return a[0] - b[0]
        }).each(function() {
            c.offsets.push(this[0]), c.targets.push(this[1])
        })
    }, b.prototype.process = function() {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset, c = this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight), d = this.options.offset + c - this.$scrollElement.height(), e = this.offsets, f = this.targets, g = this.activeTarget;
        if (b >= d)
            return g != (a = f.last()[0]) && this.activate(a);
        if (g && b <= e[0])
            return g != (a = f[0]) && this.activate(a);
        for (a = e.length; a--; )
            g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a])
    }, b.prototype.activate = function(b) {
        this.activeTarget = b, a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]', d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
    };
    var d = a.fn.scrollspy;
    a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function() {
        return a.fn.scrollspy = d, this
    }, a(window).on("load.bs.scrollspy.data-api", function() {
        a('[data-spy="scroll"]').each(function() {
            var b = a(this);
            c.call(b, b.data())
        })
    })
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.tab");
            e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
        })
    }
    var c = function(b) {
        this.element = a(b)
    };
    c.VERSION = "3.1.1", c.prototype.show = function() {
        var b = this.element, c = b.closest("ul:not(.dropdown-menu)"), d = b.data("target");
        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a")[0], f = a.Event("show.bs.tab", {relatedTarget: e});
            if (b.trigger(f), !f.isDefaultPrevented()) {
                var g = a(d);
                this.activate(b.closest("li"), c), this.activate(g, g.parent(), function() {
                    b.trigger({type: "shown.bs.tab", relatedTarget: e})
                })
            }
        }
    }, c.prototype.activate = function(b, c, d) {
        function e() {
            f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"), b.addClass("active"), g ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active"), d && d()
        }
        var f = c.find("> .active"), g = d && a.support.transition && f.hasClass("fade");
        g ? f.one(a.support.transition.end, e).emulateTransitionEnd(150) : e(), f.removeClass("in")
    };
    var d = a.fn.tab;
    a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function() {
        return a.fn.tab = d, this
    }, a(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(c) {
        c.preventDefault(), b.call(a(this), "show")
    })
}(jQuery), +function(a) {
    "use strict";
    function b(b) {
        return this.each(function() {
            var d = a(this), e = d.data("bs.affix"), f = "object" == typeof b && b;
            e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
        })
    }
    var c = function(b, d) {
        this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition()
    };
    c.VERSION = "3.1.1", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {offset: 0, target: window}, c.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset)
            return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(), b = this.$element.offset();
        return this.pinnedOffset = b.top - a
    }, c.prototype.checkPositionWithEventLoop = function() {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    }, c.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var b = a(document).height(), d = this.$target.scrollTop(), e = this.$element.offset(), f = this.options.offset, g = f.top, h = f.bottom;
            "object" != typeof f && (h = g = f), "function" == typeof g && (g = f.top(this.$element)), "function" == typeof h && (h = f.bottom(this.$element));
            var i = null != this.unpin && d + this.unpin <= e.top ? !1 : null != h && e.top + this.$element.height() >= b - h ? "bottom" : null != g && g >= d ? "top" : !1;
            if (this.affixed !== i) {
                null != this.unpin && this.$element.css("top", "");
                var j = "affix" + (i ? "-" + i : ""), k = a.Event(j + ".bs.affix");
                this.$element.trigger(k), k.isDefaultPrevented() || (this.affixed = i, this.unpin = "bottom" == i ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(j).trigger(a.Event(j.replace("affix", "affixed"))), "bottom" == i && this.$element.offset({top: b - this.$element.height() - h}))
            }
        }
    };
    var d = a.fn.affix;
    a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function() {
        return a.fn.affix = d, this
    }, a(window).on("load", function() {
        a('[data-spy="affix"]').each(function() {
            var c = a(this), d = c.data();
            d.offset = d.offset || {}, d.offsetBottom && (d.offset.bottom = d.offsetBottom), d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
        })
    })
}(jQuery);
(function() {


}).call(this);
/* HTML 5 Element Fix */

document.createElement('header');
document.createElement('nav');
document.createElement('section');
document.createElement('article');
document.createElement('aside');
document.createElement('footer');


/* Object create for IE8 */
if (!Object.create) {
    Object.create = (function() {
        function F() {
        }

        return function(o) {
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o
            return new F()
        }
    })()
}
;
// jQuery.XDomainRequest.js
// Author: Jason Moon - @JSONMOON
// IE8+
if (!jQuery.support.cors && jQuery.ajaxTransport && window.XDomainRequest) {
    var httpRegEx = /^https?:\/\//i;
    var getOrPostRegEx = /^get|post$/i;
    var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
    var htmlRegEx = /text\/html/i;
    var jsonRegEx = /\/json/i;
    var xmlRegEx = /\/xml/i;

    // ajaxTransport exists in jQuery 1.5+
    jQuery.ajaxTransport('text html xml json', function(options, userOptions, jqXHR) {
        // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
        if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(options.url) && sameSchemeRegEx.test(options.url)) {
            var xdr = null;
            var userType = (userOptions.dataType || '').toLowerCase();
            return {
                send: function(headers, complete) {
                    xdr = new XDomainRequest();
                    if (/^\d+$/.test(userOptions.timeout)) {
                        xdr.timeout = userOptions.timeout;
                    }
                    xdr.ontimeout = function() {
                        complete(500, 'timeout');
                    };
                    xdr.onload = function() {
                        var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                        var status = {
                            code: 200,
                            message: 'success'
                        };
                        var responses = {
                            text: xdr.responseText
                        };
                        try {
                            if (userType === 'html' || htmlRegEx.test(xdr.contentType)) {
                                responses.html = xdr.responseText;
                            } else if (userType === 'json' || (userType !== 'text' && jsonRegEx.test(xdr.contentType))) {
                                try {
                                    responses.json = jQuery.parseJSON(xdr.responseText);
                                } catch (e) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    //throw 'Invalid JSON: ' + xdr.responseText;
                                }
                            } else if (userType === 'xml' || (userType !== 'text' && xmlRegEx.test(xdr.contentType))) {
                                var doc = new ActiveXObject('Microsoft.XMLDOM');
                                doc.async = false;
                                try {
                                    doc.loadXML(xdr.responseText);
                                } catch (e) {
                                    doc = undefined;
                                }
                                if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    throw 'Invalid XML: ' + xdr.responseText;
                                }
                                responses.xml = doc;
                            }
                        } catch (parseMessage) {
                            throw parseMessage;
                        } finally {
                            complete(status.code, status.message, responses, allResponseHeaders);
                        }
                    };
                    // set an empty handler for 'onprogress' so requests don't get aborted
                    xdr.onprogress = function() {
                    };
                    xdr.onerror = function() {
                        complete(500, 'error', {
                            text: xdr.responseText
                        });
                    };
                    var postData = '';
                    if (userOptions.data) {
                        postData = (jQuery.type(userOptions.data) === 'string') ? userOptions.data : jQuery.param(userOptions.data);
                    }
                    xdr.open(options.type, options.url);
                    xdr.send(postData);
                },
                abort: function() {
                    if (xdr) {
                        xdr.abort();
                    }
                }
            };
        }
    });
}
;
/*
 Copyright (c) 2012 Jeremie Patonnier
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */


(function($) {
    'use strict';

    $.fn.scrollPoint = function(params) {
        var $window = $(window);

        params = $.extend({
            up: false,
            down: false,
            offsetUp: 0,
            offsetDown: 0
        }, params);

        return this.each(function() {
            var up = params.up,
                    down = params.down,
                    isIn = false,
                    element = $(this);

            if (!up && up !== 0) {
                up = element.offset().top;
            }

            if (!down && down !== 0) {
                down = up + element.outerHeight();
            }

            up -= params.offsetUp;
            down -= params.offsetDown;

            function triggerEvent(eventType, eventParams) {
                var n, Event = $.Event(eventType);

                for (n in eventParams) {
                    Event[n] = eventParams[n];
                }

                element.trigger(Event);
            }

            function checkScroll() {
                var pos = $window.scrollTop(),
                        oldIn = isIn,
                        param = {
                    isUp: pos <= up,
                    isDown: pos >= down,
                    isIn: false
                };

                isIn = param.isIn = !param.isUp && !param.isDown;

                if (oldIn !== isIn) {
                    triggerEvent("scrollPoint" + (isIn ? "Enter" : "Leave"), param);
                }

                triggerEvent("scrollPointMove", param);
            }

            $window.scroll(checkScroll);
        });
    };
})(jQuery);
/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */

(function($) {
    $.fn.appear = function(fn, options) {

        var settings = $.extend({
            //arbitrary data to pass to fn
            data: undefined,
            //call fn only on the first appear?
            one: true,
            // X & Y accuracy
            accX: 0,
            accY: 0

        }, options);

        return this.each(function() {

            var t = $(this);

            //whether the element is currently visible
            t.appeared = false;

            if (!fn) {

                //trigger the custom event
                t.trigger('appear', settings.data);
                return;
            }

            var w = $(window);

            //fires the appear event when appropriate
            var check = function() {

                //is the element hidden?
                if (!t.is(':visible')) {

                    //it became hidden
                    t.appeared = false;
                    return;
                }

                //is the element inside the visible window?
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= b &&
                        y <= b + wh + ay &&
                        x + tw + ax >= a &&
                        x <= a + ww + ax) {

                    //trigger the custom event
                    if (!t.appeared)
                        t.trigger('appear', settings.data);

                } else {

                    //it scrolled out of view
                    t.appeared = false;
                }
            };

            //create a modified fn with some additional logic
            var modifiedFn = function() {

                //mark the element as visible
                t.appeared = true;

                //is this supposed to happen only once?
                if (settings.one) {

                    //remove the check
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0)
                        $.fn.appear.checks.splice(i, 1);
                }

                //trigger the original fn
                fn.apply(this, arguments);
            };

            //bind the modified fn to the element
            if (settings.one)
                t.one('appear', settings.data, modifiedFn);
            else
                t.bind('appear', settings.data, modifiedFn);

            //check whenever the window scrolls
            w.scroll(check);

            //check whenever the dom changes
            $.fn.appear.checks.push(check);

            //check now
            (check)();
        });
    };

    //keep a queue of appearance checks
    $.extend($.fn.appear, {
        checks: [],
        timeout: null,
        //process the queue
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0)
                while (length--)
                    ($.fn.appear.checks[length])();
        },
        //check the queue asynchronously
        run: function() {
            if ($.fn.appear.timeout)
                clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });

    //run checks when these methods are called
    $.each(['append', 'prepend', 'after', 'before', 'attr',
        'removeAttr', 'addClass', 'removeClass', 'toggleClass',
        'remove', 'css', 'show', 'hide'], function(i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function() {
                var r = old.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });

})(jQuery);

/**
 * jQuery BASE64 functions
 *
 * 	<code>
 * 		Encodes the given data with base64.
 * 		String jQuery.base64Encode ( String str )
 *		<br />
 * 		Decodes a base64 encoded data.
 * 		String jQuery.base64Decode ( String str )
 * 	</code>
 *
 * Encodes and Decodes the given data in base64.
 * This encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean, such as mail bodies.
 * Base64-encoded data takes about 33% more space than the original data.
 * This javascript code is used to encode / decode data using base64 (this encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean). Script is fully compatible with UTF-8 encoding. You can use base64 encoded data as simple encryption mechanism.
 * If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag).
 * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
 *
 * Example
 * 	Code
 * 		<code>
 * 			jQuery.base64Encode("I'm Persian.");
 * 		</code>
 * 	Result
 * 		<code>
 * 			"SSdtIFBlcnNpYW4u"
 * 		</code>
 * 	Code
 * 		<code>
 * 			jQuery.base64Decode("SSdtIFBlcnNpYW4u");
 * 		</code>
 * 	Result
 * 		<code>
 * 			"I'm Persian."
 * 		</code>
 *
 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
 * @link http://www.semnanweb.com/jquery-plugin/base64.html
 * @see http://www.webtoolkit.info/
 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
 * @param {jQuery} {base64Encode:function(input))
 * @param {jQuery} {base64Decode:function(input))
 * @return string
 */


(function(jQuery) {

    var keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var uTF8Encode = function(string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    var uTF8Decode = function(input) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < input.length) {
            c = input.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = input.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = input.charCodeAt(i + 1);
                c3 = input.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }

    jQuery.extend({
        base64Encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = uTF8Encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4);
            }
            return output;
        },
        base64Decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = keyString.indexOf(input.charAt(i++));
                enc2 = keyString.indexOf(input.charAt(i++));
                enc3 = keyString.indexOf(input.charAt(i++));
                enc4 = keyString.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = uTF8Decode(output);
            return output;
        }
    });
})(jQuery);

/*
 *	jQuery carouFredSel 6.2.1
 *	Demo's and documentation:
 *	caroufredsel.dev7studios.com
 *
 *	Copyright (c) 2013 Fred Heusschen
 *	www.frebsite.nl
 *
 *	Dual licensed under the MIT and GPL licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */



(function($) {
    function sc_setScroll(a, b, c) {
        return"transition" == c.transition && "swing" == b && (b = "ease"), {anims: [], duration: a, orgDuration: a, easing: b, startTime: getTime()}
    }
    function sc_startScroll(a, b) {
        for (var c = 0, d = a.anims.length; d > c; c++) {
            var e = a.anims[c];
            e && e[0][b.transition](e[1], a.duration, a.easing, e[2])
        }
    }
    function sc_stopScroll(a, b) {
        is_boolean(b) || (b = !0), is_object(a.pre) && sc_stopScroll(a.pre, b);
        for (var c = 0, d = a.anims.length; d > c; c++) {
            var e = a.anims[c];
            e[0].stop(!0), b && (e[0].css(e[1]), is_function(e[2]) && e[2]())
        }
        is_object(a.post) && sc_stopScroll(a.post, b)
    }
    function sc_afterScroll(a, b, c) {
        switch (b && b.remove(), c.fx) {
            case"fade":
            case"crossfade":
            case"cover-fade":
            case"uncover-fade":
                a.css("opacity", 1), a.css("filter", "")
        }
    }
    function sc_fireCallbacks(a, b, c, d, e) {
        if (b[c] && b[c].call(a, d), e[c].length)
            for (var f = 0, g = e[c].length; g > f; f++)
                e[c][f].call(a, d);
        return[]
    }
    function sc_fireQueue(a, b, c) {
        return b.length && (a.trigger(cf_e(b[0][0], c), b[0][1]), b.shift()), b
    }
    function sc_hideHiddenItems(a) {
        a.each(function() {
            var a = $(this);
            a.data("_cfs_isHidden", a.is(":hidden")).hide()
        })
    }
    function sc_showHiddenItems(a) {
        a && a.each(function() {
            var a = $(this);
            a.data("_cfs_isHidden") || a.show()
        })
    }
    function sc_clearTimers(a) {
        return a.auto && clearTimeout(a.auto), a.progress && clearInterval(a.progress), a
    }
    function sc_mapCallbackArguments(a, b, c, d, e, f, g) {
        return{width: g.width, height: g.height, items: {old: a, skipped: b, visible: c}, scroll: {items: d, direction: e, duration: f}}
    }
    function sc_getDuration(a, b, c, d) {
        var e = a.duration;
        return"none" == a.fx ? 0 : ("auto" == e ? e = b.scroll.duration / b.scroll.items * c : 10 > e && (e = d / e), 1 > e ? 0 : ("fade" == a.fx && (e /= 2), Math.round(e)))
    }
    function nv_showNavi(a, b, c) {
        var d = is_number(a.items.minimum) ? a.items.minimum : a.items.visible + 1;
        if ("show" == b || "hide" == b)
            var e = b;
        else if (d > b) {
            debug(c, "Not enough items (" + b + " total, " + d + " needed): Hiding navigation.");
            var e = "hide"
        } else
            var e = "show";
        var f = "show" == e ? "removeClass" : "addClass", g = cf_c("hidden", c);
        a.auto.button && a.auto.button[e]()[f](g), a.prev.button && a.prev.button[e]()[f](g), a.next.button && a.next.button[e]()[f](g), a.pagination.container && a.pagination.container[e]()[f](g)
    }
    function nv_enableNavi(a, b, c) {
        if (!a.circular && !a.infinite) {
            var d = "removeClass" == b || "addClass" == b ? b : !1, e = cf_c("disabled", c);
            if (a.auto.button && d && a.auto.button[d](e), a.prev.button) {
                var f = d || 0 == b ? "addClass" : "removeClass";
                a.prev.button[f](e)
            }
            if (a.next.button) {
                var f = d || b == a.items.visible ? "addClass" : "removeClass";
                a.next.button[f](e)
            }
        }
    }
    function go_getObject(a, b) {
        return is_function(b) ? b = b.call(a) : is_undefined(b) && (b = {}), b
    }
    function go_getItemsObject(a, b) {
        return b = go_getObject(a, b), is_number(b) ? b = {visible: b} : "variable" == b ? b = {visible: b, width: b, height: b} : is_object(b) || (b = {}), b
    }
    function go_getScrollObject(a, b) {
        return b = go_getObject(a, b), is_number(b) ? b = 50 >= b ? {items: b} : {duration: b} : is_string(b) ? b = {easing: b} : is_object(b) || (b = {}), b
    }
    function go_getNaviObject(a, b) {
        if (b = go_getObject(a, b), is_string(b)) {
            var c = cf_getKeyCode(b);
            b = -1 == c ? $(b) : c
        }
        return b
    }
    function go_getAutoObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {button: b} : is_boolean(b) ? b = {play: b} : is_number(b) && (b = {timeoutDuration: b}), b.progress && (is_string(b.progress) || is_jquery(b.progress)) && (b.progress = {bar: b.progress}), b
    }
    function go_complementAutoObject(a, b) {
        return is_function(b.button) && (b.button = b.button.call(a)), is_string(b.button) && (b.button = $(b.button)), is_boolean(b.play) || (b.play = !0), is_number(b.delay) || (b.delay = 0), is_undefined(b.pauseOnEvent) && (b.pauseOnEvent = !0), is_boolean(b.pauseOnResize) || (b.pauseOnResize = !0), is_number(b.timeoutDuration) || (b.timeoutDuration = 10 > b.duration ? 2500 : 5 * b.duration), b.progress && (is_function(b.progress.bar) && (b.progress.bar = b.progress.bar.call(a)), is_string(b.progress.bar) && (b.progress.bar = $(b.progress.bar)), b.progress.bar ? (is_function(b.progress.updater) || (b.progress.updater = $.fn.carouFredSel.progressbarUpdater), is_number(b.progress.interval) || (b.progress.interval = 50)) : b.progress = !1), b
    }
    function go_getPrevNextObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {button: b} : is_number(b) && (b = {key: b}), b
    }
    function go_complementPrevNextObject(a, b) {
        return is_function(b.button) && (b.button = b.button.call(a)), is_string(b.button) && (b.button = $(b.button)), is_string(b.key) && (b.key = cf_getKeyCode(b.key)), b
    }
    function go_getPaginationObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {container: b} : is_boolean(b) && (b = {keys: b}), b
    }
    function go_complementPaginationObject(a, b) {
        return is_function(b.container) && (b.container = b.container.call(a)), is_string(b.container) && (b.container = $(b.container)), is_number(b.items) || (b.items = !1), is_boolean(b.keys) || (b.keys = !1), is_function(b.anchorBuilder) || is_false(b.anchorBuilder) || (b.anchorBuilder = $.fn.carouFredSel.pageAnchorBuilder), is_number(b.deviation) || (b.deviation = 0), b
    }
    function go_getSwipeObject(a, b) {
        return is_function(b) && (b = b.call(a)), is_undefined(b) && (b = {onTouch: !1}), is_true(b) ? b = {onTouch: b} : is_number(b) && (b = {items: b}), b
    }
    function go_complementSwipeObject(a, b) {
        return is_boolean(b.onTouch) || (b.onTouch = !0), is_boolean(b.onMouse) || (b.onMouse = !1), is_object(b.options) || (b.options = {}), is_boolean(b.options.triggerOnTouchEnd) || (b.options.triggerOnTouchEnd = !1), b
    }
    function go_getMousewheelObject(a, b) {
        return is_function(b) && (b = b.call(a)), is_true(b) ? b = {} : is_number(b) ? b = {items: b} : is_undefined(b) && (b = !1), b
    }
    function go_complementMousewheelObject(a, b) {
        return b
    }
    function gn_getItemIndex(a, b, c, d, e) {
        if (is_string(a) && (a = $(a, e)), is_object(a) && (a = $(a, e)), is_jquery(a) ? (a = e.children().index(a), is_boolean(c) || (c = !1)) : is_boolean(c) || (c = !0), is_number(a) || (a = 0), is_number(b) || (b = 0), c && (a += d.first), a += b, d.total > 0) {
            for (; a >= d.total; )
                a -= d.total;
            for (; 0 > a; )
                a += d.total
        }
        return a
    }
    function gn_getVisibleItemsPrev(a, b, c) {
        for (var d = 0, e = 0, f = c; f >= 0; f--) {
            var g = a.eq(f);
            if (d += g.is(":visible") ? g[b.d.outerWidth](!0) : 0, d > b.maxDimension)
                return e;
            0 == f && (f = a.length), e++
        }
    }
    function gn_getVisibleItemsPrevFilter(a, b, c) {
        return gn_getItemsPrevFilter(a, b.items.filter, b.items.visibleConf.org, c)
    }
    function gn_getScrollItemsPrevFilter(a, b, c, d) {
        return gn_getItemsPrevFilter(a, b.items.filter, d, c)
    }
    function gn_getItemsPrevFilter(a, b, c, d) {
        for (var e = 0, f = 0, g = d, h = a.length; g >= 0; g--) {
            if (f++, f == h)
                return f;
            var i = a.eq(g);
            if (i.is(b) && (e++, e == c))
                return f;
            0 == g && (g = h)
        }
    }
    function gn_getVisibleOrg(a, b) {
        return b.items.visibleConf.org || a.children().slice(0, b.items.visible).filter(b.items.filter).length
    }
    function gn_getVisibleItemsNext(a, b, c) {
        for (var d = 0, e = 0, f = c, g = a.length - 1; g >= f; f++) {
            var h = a.eq(f);
            if (d += h.is(":visible") ? h[b.d.outerWidth](!0) : 0, d > b.maxDimension)
                return e;
            if (e++, e == g + 1)
                return e;
            f == g && (f = -1)
        }
    }
    function gn_getVisibleItemsNextTestCircular(a, b, c, d) {
        var e = gn_getVisibleItemsNext(a, b, c);
        return b.circular || c + e > d && (e = d - c), e
    }
    function gn_getVisibleItemsNextFilter(a, b, c) {
        return gn_getItemsNextFilter(a, b.items.filter, b.items.visibleConf.org, c, b.circular)
    }
    function gn_getScrollItemsNextFilter(a, b, c, d) {
        return gn_getItemsNextFilter(a, b.items.filter, d + 1, c, b.circular) - 1
    }
    function gn_getItemsNextFilter(a, b, c, d) {
        for (var f = 0, g = 0, h = d, i = a.length - 1; i >= h; h++) {
            if (g++, g >= i)
                return g;
            var j = a.eq(h);
            if (j.is(b) && (f++, f == c))
                return g;
            h == i && (h = -1)
        }
    }
    function gi_getCurrentItems(a, b) {
        return a.slice(0, b.items.visible)
    }
    function gi_getOldItemsPrev(a, b, c) {
        return a.slice(c, b.items.visibleConf.old + c)
    }
    function gi_getNewItemsPrev(a, b) {
        return a.slice(0, b.items.visible)
    }
    function gi_getOldItemsNext(a, b) {
        return a.slice(0, b.items.visibleConf.old)
    }
    function gi_getNewItemsNext(a, b, c) {
        return a.slice(c, b.items.visible + c)
    }
    function sz_storeMargin(a, b, c) {
        b.usePadding && (is_string(c) || (c = "_cfs_origCssMargin"), a.each(function() {
            var a = $(this), d = parseInt(a.css(b.d.marginRight), 10);
            is_number(d) || (d = 0), a.data(c, d)
        }))
    }
    function sz_resetMargin(a, b, c) {
        if (b.usePadding) {
            var d = is_boolean(c) ? c : !1;
            is_number(c) || (c = 0), sz_storeMargin(a, b, "_cfs_tempCssMargin"), a.each(function() {
                var a = $(this);
                a.css(b.d.marginRight, d ? a.data("_cfs_tempCssMargin") : c + a.data("_cfs_origCssMargin"))
            })
        }
    }
    function sz_storeOrigCss(a) {
        a.each(function() {
            var a = $(this);
            a.data("_cfs_origCss", a.attr("style") || "")
        })
    }
    function sz_restoreOrigCss(a) {
        a.each(function() {
            var a = $(this);
            a.attr("style", a.data("_cfs_origCss") || "")
        })
    }
    function sz_setResponsiveSizes(a, b) {
        var d = (a.items.visible, a.items[a.d.width]), e = a[a.d.height], f = is_percentage(e);
        b.each(function() {
            var b = $(this), c = d - ms_getPaddingBorderMargin(b, a, "Width");
            b[a.d.width](c), f && b[a.d.height](ms_getPercentage(c, e))
        })
    }
    function sz_setSizes(a, b) {
        var c = a.parent(), d = a.children(), e = gi_getCurrentItems(d, b), f = cf_mapWrapperSizes(ms_getSizes(e, b, !0), b, !1);
        if (c.css(f), b.usePadding) {
            var g = b.padding, h = g[b.d[1]];
            b.align && 0 > h && (h = 0);
            var i = e.last();
            i.css(b.d.marginRight, i.data("_cfs_origCssMargin") + h), a.css(b.d.top, g[b.d[0]]), a.css(b.d.left, g[b.d[3]])
        }
        return a.css(b.d.width, f[b.d.width] + 2 * ms_getTotalSize(d, b, "width")), a.css(b.d.height, ms_getLargestSize(d, b, "height")), f
    }
    function ms_getSizes(a, b, c) {
        return[ms_getTotalSize(a, b, "width", c), ms_getLargestSize(a, b, "height", c)]
    }
    function ms_getLargestSize(a, b, c, d) {
        return is_boolean(d) || (d = !1), is_number(b[b.d[c]]) && d ? b[b.d[c]] : is_number(b.items[b.d[c]]) ? b.items[b.d[c]] : (c = c.toLowerCase().indexOf("width") > -1 ? "outerWidth" : "outerHeight", ms_getTrueLargestSize(a, b, c))
    }
    function ms_getTrueLargestSize(a, b, c) {
        for (var d = 0, e = 0, f = a.length; f > e; e++) {
            var g = a.eq(e), h = g.is(":visible") ? g[b.d[c]](!0) : 0;
            h > d && (d = h)
        }
        return d
    }
    function ms_getTotalSize(a, b, c, d) {
        if (is_boolean(d) || (d = !1), is_number(b[b.d[c]]) && d)
            return b[b.d[c]];
        if (is_number(b.items[b.d[c]]))
            return b.items[b.d[c]] * a.length;
        for (var e = c.toLowerCase().indexOf("width") > -1 ? "outerWidth" : "outerHeight", f = 0, g = 0, h = a.length; h > g; g++) {
            var i = a.eq(g);
            f += i.is(":visible") ? i[b.d[e]](!0) : 0
        }
        return f
    }
    function ms_getParentSize(a, b, c) {
        var d = a.is(":visible");
        d && a.hide();
        var e = a.parent()[b.d[c]]();
        return d && a.show(), e
    }
    function ms_getMaxDimension(a, b) {
        return is_number(a[a.d.width]) ? a[a.d.width] : b
    }
    function ms_hasVariableSizes(a, b, c) {
        for (var d = !1, e = !1, f = 0, g = a.length; g > f; f++) {
            var h = a.eq(f), i = h.is(":visible") ? h[b.d[c]](!0) : 0;
            d === !1 ? d = i : d != i && (e = !0), 0 == d && (e = !0)
        }
        return e
    }
    function ms_getPaddingBorderMargin(a, b, c) {
        return a[b.d["outer" + c]](!0) - a[b.d[c.toLowerCase()]]()
    }
    function ms_getPercentage(a, b) {
        if (is_percentage(b)) {
            if (b = parseInt(b.slice(0, -1), 10), !is_number(b))
                return a;
            a *= b / 100
        }
        return a
    }
    function cf_e(a, b, c, d, e) {
        return is_boolean(c) || (c = !0), is_boolean(d) || (d = !0), is_boolean(e) || (e = !1), c && (a = b.events.prefix + a), d && (a = a + "." + b.events.namespace), d && e && (a += b.serialNumber), a
    }
    function cf_c(a, b) {
        return is_string(b.classnames[a]) ? b.classnames[a] : a
    }
    function cf_mapWrapperSizes(a, b, c) {
        is_boolean(c) || (c = !0);
        var d = b.usePadding && c ? b.padding : [0, 0, 0, 0], e = {};
        return e[b.d.width] = a[0] + d[1] + d[3], e[b.d.height] = a[1] + d[0] + d[2], e
    }
    function cf_sortParams(a, b) {
        for (var c = [], d = 0, e = a.length; e > d; d++)
            for (var f = 0, g = b.length; g > f; f++)
                if (b[f].indexOf(typeof a[d]) > -1 && is_undefined(c[f])) {
                    c[f] = a[d];
                    break
                }
        return c
    }
    function cf_getPadding(a) {
        if (is_undefined(a))
            return[0, 0, 0, 0];
        if (is_number(a))
            return[a, a, a, a];
        if (is_string(a) && (a = a.split("px").join("").split("em").join("").split(" ")), !is_array(a))
            return[0, 0, 0, 0];
        for (var b = 0; 4 > b; b++)
            a[b] = parseInt(a[b], 10);
        switch (a.length) {
            case 0:
                return[0, 0, 0, 0];
            case 1:
                return[a[0], a[0], a[0], a[0]];
            case 2:
                return[a[0], a[1], a[0], a[1]];
            case 3:
                return[a[0], a[1], a[2], a[1]];
            default:
                return[a[0], a[1], a[2], a[3]]
        }
    }
    function cf_getAlignPadding(a, b) {
        var c = is_number(b[b.d.width]) ? Math.ceil(b[b.d.width] - ms_getTotalSize(a, b, "width")) : 0;
        switch (b.align) {
            case"left":
                return[0, c];
            case"right":
                return[c, 0];
            case"center":
            default:
                return[Math.ceil(c / 2), Math.floor(c / 2)]
        }
    }
    function cf_getDimensions(a) {
        for (var b = [["width", "innerWidth", "outerWidth", "height", "innerHeight", "outerHeight", "left", "top", "marginRight", 0, 1, 2, 3], ["height", "innerHeight", "outerHeight", "width", "innerWidth", "outerWidth", "top", "left", "marginBottom", 3, 2, 1, 0]], c = b[0].length, d = "right" == a.direction || "left" == a.direction ? 0 : 1, e = {}, f = 0; c > f; f++)
            e[b[0][f]] = b[d][f];
        return e
    }
    function cf_getAdjust(a, b, c, d) {
        var e = a;
        if (is_function(c))
            e = c.call(d, e);
        else if (is_string(c)) {
            var f = c.split("+"), g = c.split("-");
            if (g.length > f.length)
                var h = !0, i = g[0], j = g[1];
            else
                var h = !1, i = f[0], j = f[1];
            switch (i) {
                case"even":
                    e = 1 == a % 2 ? a - 1 : a;
                    break;
                case"odd":
                    e = 0 == a % 2 ? a - 1 : a;
                    break;
                default:
                    e = a
            }
            j = parseInt(j, 10), is_number(j) && (h && (j = -j), e += j)
        }
        return(!is_number(e) || 1 > e) && (e = 1), e
    }
    function cf_getItemsAdjust(a, b, c, d) {
        return cf_getItemAdjustMinMax(cf_getAdjust(a, b, c, d), b.items.visibleConf)
    }
    function cf_getItemAdjustMinMax(a, b) {
        return is_number(b.min) && b.min > a && (a = b.min), is_number(b.max) && a > b.max && (a = b.max), 1 > a && (a = 1), a
    }
    function cf_getSynchArr(a) {
        is_array(a) || (a = [[a]]), is_array(a[0]) || (a = [a]);
        for (var b = 0, c = a.length; c > b; b++)
            is_string(a[b][0]) && (a[b][0] = $(a[b][0])), is_boolean(a[b][1]) || (a[b][1] = !0), is_boolean(a[b][2]) || (a[b][2] = !0), is_number(a[b][3]) || (a[b][3] = 0);
        return a
    }
    function cf_getKeyCode(a) {
        return"right" == a ? 39 : "left" == a ? 37 : "up" == a ? 38 : "down" == a ? 40 : -1
    }
    function cf_setCookie(a, b, c) {
        if (a) {
            var d = b.triggerHandler(cf_e("currentPosition", c));
            $.fn.carouFredSel.cookie.set(a, d)
        }
    }
    function cf_getCookie(a) {
        var b = $.fn.carouFredSel.cookie.get(a);
        return"" == b ? 0 : b
    }
    function in_mapCss(a, b) {
        for (var c = {}, d = 0, e = b.length; e > d; d++)
            c[b[d]] = a.css(b[d]);
        return c
    }
    function in_complementItems(a, b, c, d) {
        return is_object(a.visibleConf) || (a.visibleConf = {}), is_object(a.sizesConf) || (a.sizesConf = {}), 0 == a.start && is_number(d) && (a.start = d), is_object(a.visible) ? (a.visibleConf.min = a.visible.min, a.visibleConf.max = a.visible.max, a.visible = !1) : is_string(a.visible) ? ("variable" == a.visible ? a.visibleConf.variable = !0 : a.visibleConf.adjust = a.visible, a.visible = !1) : is_function(a.visible) && (a.visibleConf.adjust = a.visible, a.visible = !1), is_string(a.filter) || (a.filter = c.filter(":hidden").length > 0 ? ":visible" : "*"), a[b.d.width] || (b.responsive ? (debug(!0, "Set a " + b.d.width + " for the items!"), a[b.d.width] = ms_getTrueLargestSize(c, b, "outerWidth")) : a[b.d.width] = ms_hasVariableSizes(c, b, "outerWidth") ? "variable" : c[b.d.outerWidth](!0)), a[b.d.height] || (a[b.d.height] = ms_hasVariableSizes(c, b, "outerHeight") ? "variable" : c[b.d.outerHeight](!0)), a.sizesConf.width = a.width, a.sizesConf.height = a.height, a
    }
    function in_complementVisibleItems(a, b) {
        return"variable" == a.items[a.d.width] && (a.items.visibleConf.variable = !0), a.items.visibleConf.variable || (is_number(a[a.d.width]) ? a.items.visible = Math.floor(a[a.d.width] / a.items[a.d.width]) : (a.items.visible = Math.floor(b / a.items[a.d.width]), a[a.d.width] = a.items.visible * a.items[a.d.width], a.items.visibleConf.adjust || (a.align = !1)), ("Infinity" == a.items.visible || 1 > a.items.visible) && (debug(!0, 'Not a valid number of visible items: Set to "variable".'), a.items.visibleConf.variable = !0)), a
    }
    function in_complementPrimarySize(a, b, c) {
        return"auto" == a && (a = ms_getTrueLargestSize(c, b, "outerWidth")), a
    }
    function in_complementSecondarySize(a, b, c) {
        return"auto" == a && (a = ms_getTrueLargestSize(c, b, "outerHeight")), a || (a = b.items[b.d.height]), a
    }
    function in_getAlignPadding(a, b) {
        var c = cf_getAlignPadding(gi_getCurrentItems(b, a), a);
        return a.padding[a.d[1]] = c[1], a.padding[a.d[3]] = c[0], a
    }
    function in_getResponsiveValues(a, b) {
        var d = cf_getItemAdjustMinMax(Math.ceil(a[a.d.width] / a.items[a.d.width]), a.items.visibleConf);
        d > b.length && (d = b.length);
        var e = Math.floor(a[a.d.width] / d);
        return a.items.visible = d, a.items[a.d.width] = e, a[a.d.width] = d * e, a
    }
    function bt_pauseOnHoverConfig(a) {
        if (is_string(a))
            var b = a.indexOf("immediate") > -1 ? !0 : !1, c = a.indexOf("resume") > -1 ? !0 : !1;
        else
            var b = c = !1;
        return[b, c]
    }
    function bt_mousesheelNumber(a) {
        return is_number(a) ? a : null
    }
    function is_null(a) {
        return null === a
    }
    function is_undefined(a) {
        return is_null(a) || a === void 0 || "" === a || "undefined" === a
    }
    function is_array(a) {
        return a instanceof Array
    }
    function is_jquery(a) {
        return a instanceof jQuery
    }
    function is_object(a) {
        return(a instanceof Object || "object" == typeof a) && !is_null(a) && !is_jquery(a) && !is_array(a) && !is_function(a)
    }
    function is_number(a) {
        return(a instanceof Number || "number" == typeof a) && !isNaN(a)
    }
    function is_string(a) {
        return(a instanceof String || "string" == typeof a) && !is_undefined(a) && !is_true(a) && !is_false(a)
    }
    function is_function(a) {
        return a instanceof Function || "function" == typeof a
    }
    function is_boolean(a) {
        return a instanceof Boolean || "boolean" == typeof a || is_true(a) || is_false(a)
    }
    function is_true(a) {
        return a === !0 || "true" === a
    }
    function is_false(a) {
        return a === !1 || "false" === a
    }
    function is_percentage(a) {
        return is_string(a) && "%" == a.slice(-1)
    }
    function getTime() {
        return(new Date).getTime()
    }
    function deprecated(a, b) {
        debug(!0, a + " is DEPRECATED, support for it will be removed. Use " + b + " instead.")
    }
    function debug(a, b) {
        if (!is_undefined(window.console) && !is_undefined(window.console.log)) {
            if (is_object(a)) {
                var c = " (" + a.selector + ")";
                a = a.debug
            } else
                var c = "";
            if (!a)
                return!1;
            b = is_string(b) ? "carouFredSel" + c + ": " + b : ["carouFredSel" + c + ":", b], window.console.log(b)
        }
        return!1
    }
    $.fn.carouFredSel || ($.fn.caroufredsel = $.fn.carouFredSel = function(options, configs) {
        if (0 == this.length)
            return debug(!0, 'No element found for "' + this.selector + '".'), this;
        if (this.length > 1)
            return this.each(function() {
                $(this).carouFredSel(options, configs)
            });
        var $cfs = this, $tt0 = this[0], starting_position = !1;
        $cfs.data("_cfs_isCarousel") && (starting_position = $cfs.triggerHandler("_cfs_triggerEvent", "currentPosition"), $cfs.trigger("_cfs_triggerEvent", ["destroy", !0]));
        var FN = {};
        FN._init = function(a, b, c) {
            a = go_getObject($tt0, a), a.items = go_getItemsObject($tt0, a.items), a.scroll = go_getScrollObject($tt0, a.scroll), a.auto = go_getAutoObject($tt0, a.auto), a.prev = go_getPrevNextObject($tt0, a.prev), a.next = go_getPrevNextObject($tt0, a.next), a.pagination = go_getPaginationObject($tt0, a.pagination), a.swipe = go_getSwipeObject($tt0, a.swipe), a.mousewheel = go_getMousewheelObject($tt0, a.mousewheel), b && (opts_orig = $.extend(!0, {}, $.fn.carouFredSel.defaults, a)), opts = $.extend(!0, {}, $.fn.carouFredSel.defaults, a), opts.d = cf_getDimensions(opts), crsl.direction = "up" == opts.direction || "left" == opts.direction ? "next" : "prev";
            var d = $cfs.children(), e = ms_getParentSize($wrp, opts, "width");
            if (is_true(opts.cookie) && (opts.cookie = "caroufredsel_cookie_" + conf.serialNumber), opts.maxDimension = ms_getMaxDimension(opts, e), opts.items = in_complementItems(opts.items, opts, d, c), opts[opts.d.width] = in_complementPrimarySize(opts[opts.d.width], opts, d), opts[opts.d.height] = in_complementSecondarySize(opts[opts.d.height], opts, d), opts.responsive && (is_percentage(opts[opts.d.width]) || (opts[opts.d.width] = "100%")), is_percentage(opts[opts.d.width]) && (crsl.upDateOnWindowResize = !0, crsl.primarySizePercentage = opts[opts.d.width], opts[opts.d.width] = ms_getPercentage(e, crsl.primarySizePercentage), opts.items.visible || (opts.items.visibleConf.variable = !0)), opts.responsive ? (opts.usePadding = !1, opts.padding = [0, 0, 0, 0], opts.align = !1, opts.items.visibleConf.variable = !1) : (opts.items.visible || (opts = in_complementVisibleItems(opts, e)), opts[opts.d.width] || (!opts.items.visibleConf.variable && is_number(opts.items[opts.d.width]) && "*" == opts.items.filter ? (opts[opts.d.width] = opts.items.visible * opts.items[opts.d.width], opts.align = !1) : opts[opts.d.width] = "variable"), is_undefined(opts.align) && (opts.align = is_number(opts[opts.d.width]) ? "center" : !1), opts.items.visibleConf.variable && (opts.items.visible = gn_getVisibleItemsNext(d, opts, 0))), "*" == opts.items.filter || opts.items.visibleConf.variable || (opts.items.visibleConf.org = opts.items.visible, opts.items.visible = gn_getVisibleItemsNextFilter(d, opts, 0)), opts.items.visible = cf_getItemsAdjust(opts.items.visible, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts.responsive)
                opts.items.visibleConf.min || (opts.items.visibleConf.min = opts.items.visible), opts.items.visibleConf.max || (opts.items.visibleConf.max = opts.items.visible), opts = in_getResponsiveValues(opts, d, e);
            else
                switch (opts.padding = cf_getPadding(opts.padding), "top" == opts.align ? opts.align = "left" : "bottom" == opts.align && (opts.align = "right"), opts.align) {
                    case"center":
                    case"left":
                    case"right":
                        "variable" != opts[opts.d.width] && (opts = in_getAlignPadding(opts, d), opts.usePadding = !0);
                        break;
                    default:
                        opts.align = !1, opts.usePadding = 0 == opts.padding[0] && 0 == opts.padding[1] && 0 == opts.padding[2] && 0 == opts.padding[3] ? !1 : !0
                }
            is_number(opts.scroll.duration) || (opts.scroll.duration = 500), is_undefined(opts.scroll.items) && (opts.scroll.items = opts.responsive || opts.items.visibleConf.variable || "*" != opts.items.filter ? "visible" : opts.items.visible), opts.auto = $.extend(!0, {}, opts.scroll, opts.auto), opts.prev = $.extend(!0, {}, opts.scroll, opts.prev), opts.next = $.extend(!0, {}, opts.scroll, opts.next), opts.pagination = $.extend(!0, {}, opts.scroll, opts.pagination), opts.auto = go_complementAutoObject($tt0, opts.auto), opts.prev = go_complementPrevNextObject($tt0, opts.prev), opts.next = go_complementPrevNextObject($tt0, opts.next), opts.pagination = go_complementPaginationObject($tt0, opts.pagination), opts.swipe = go_complementSwipeObject($tt0, opts.swipe), opts.mousewheel = go_complementMousewheelObject($tt0, opts.mousewheel), opts.synchronise && (opts.synchronise = cf_getSynchArr(opts.synchronise)), opts.auto.onPauseStart && (opts.auto.onTimeoutStart = opts.auto.onPauseStart, deprecated("auto.onPauseStart", "auto.onTimeoutStart")), opts.auto.onPausePause && (opts.auto.onTimeoutPause = opts.auto.onPausePause, deprecated("auto.onPausePause", "auto.onTimeoutPause")), opts.auto.onPauseEnd && (opts.auto.onTimeoutEnd = opts.auto.onPauseEnd, deprecated("auto.onPauseEnd", "auto.onTimeoutEnd")), opts.auto.pauseDuration && (opts.auto.timeoutDuration = opts.auto.pauseDuration, deprecated("auto.pauseDuration", "auto.timeoutDuration"))
        }, FN._build = function() {
            $cfs.data("_cfs_isCarousel", !0);
            var a = $cfs.children(), b = in_mapCss($cfs, ["textAlign", "float", "position", "top", "right", "bottom", "left", "zIndex", "width", "height", "marginTop", "marginRight", "marginBottom", "marginLeft"]), c = "relative";
            switch (b.position) {
                case"absolute":
                case"fixed":
                    c = b.position
            }
            "parent" == conf.wrapper ? sz_storeOrigCss($wrp) : $wrp.css(b), $wrp.css({overflow: "hidden", position: c}), sz_storeOrigCss($cfs), $cfs.data("_cfs_origCssZindex", b.zIndex), $cfs.css({textAlign: "left", "float": "none", position: "absolute", top: 0, right: "auto", bottom: "auto", left: 0, marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0}), sz_storeMargin(a, opts), sz_storeOrigCss(a), opts.responsive && sz_setResponsiveSizes(opts, a)
        }, FN._bind_events = function() {
            FN._unbind_events(), $cfs.bind(cf_e("stop", conf), function(a, b) {
                return a.stopPropagation(), crsl.isStopped || opts.auto.button && opts.auto.button.addClass(cf_c("stopped", conf)), crsl.isStopped = !0, opts.auto.play && (opts.auto.play = !1, $cfs.trigger(cf_e("pause", conf), b)), !0
            }), $cfs.bind(cf_e("finish", conf), function(a) {
                return a.stopPropagation(), crsl.isScrolling && sc_stopScroll(scrl), !0
            }), $cfs.bind(cf_e("pause", conf), function(a, b, c) {
                if (a.stopPropagation(), tmrs = sc_clearTimers(tmrs), b && crsl.isScrolling) {
                    scrl.isStopped = !0;
                    var d = getTime() - scrl.startTime;
                    scrl.duration -= d, scrl.pre && (scrl.pre.duration -= d), scrl.post && (scrl.post.duration -= d), sc_stopScroll(scrl, !1)
                }
                if (crsl.isPaused || crsl.isScrolling || c && (tmrs.timePassed += getTime() - tmrs.startTime), crsl.isPaused || opts.auto.button && opts.auto.button.addClass(cf_c("paused", conf)), crsl.isPaused = !0, opts.auto.onTimeoutPause) {
                    var e = opts.auto.timeoutDuration - tmrs.timePassed, f = 100 - Math.ceil(100 * e / opts.auto.timeoutDuration);
                    opts.auto.onTimeoutPause.call($tt0, f, e)
                }
                return!0
            }), $cfs.bind(cf_e("play", conf), function(a, b, c, d) {
                a.stopPropagation(), tmrs = sc_clearTimers(tmrs);
                var e = [b, c, d], f = ["string", "number", "boolean"], g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], "prev" != b && "next" != b && (b = crsl.direction), is_number(c) || (c = 0), is_boolean(d) || (d = !1), d && (crsl.isStopped = !1, opts.auto.play = !0), !opts.auto.play)
                    return a.stopImmediatePropagation(), debug(conf, "Carousel stopped: Not scrolling.");
                crsl.isPaused && opts.auto.button && (opts.auto.button.removeClass(cf_c("stopped", conf)), opts.auto.button.removeClass(cf_c("paused", conf))), crsl.isPaused = !1, tmrs.startTime = getTime();
                var h = opts.auto.timeoutDuration + c;
                return dur2 = h - tmrs.timePassed, perc = 100 - Math.ceil(100 * dur2 / h), opts.auto.progress && (tmrs.progress = setInterval(function() {
                    var a = getTime() - tmrs.startTime + tmrs.timePassed, b = Math.ceil(100 * a / h);
                    opts.auto.progress.updater.call(opts.auto.progress.bar[0], b)
                }, opts.auto.progress.interval)), tmrs.auto = setTimeout(function() {
                    opts.auto.progress && opts.auto.progress.updater.call(opts.auto.progress.bar[0], 100), opts.auto.onTimeoutEnd && opts.auto.onTimeoutEnd.call($tt0, perc, dur2), crsl.isScrolling ? $cfs.trigger(cf_e("play", conf), b) : $cfs.trigger(cf_e(b, conf), opts.auto)
                }, dur2), opts.auto.onTimeoutStart && opts.auto.onTimeoutStart.call($tt0, perc, dur2), !0
            }), $cfs.bind(cf_e("resume", conf), function(a) {
                return a.stopPropagation(), scrl.isStopped ? (scrl.isStopped = !1, crsl.isPaused = !1, crsl.isScrolling = !0, scrl.startTime = getTime(), sc_startScroll(scrl, conf)) : $cfs.trigger(cf_e("play", conf)), !0
            }), $cfs.bind(cf_e("prev", conf) + " " + cf_e("next", conf), function(a, b, c, d, e) {
                if (a.stopPropagation(), crsl.isStopped || $cfs.is(":hidden"))
                    return a.stopImmediatePropagation(), debug(conf, "Carousel stopped or hidden: Not scrolling.");
                var f = is_number(opts.items.minimum) ? opts.items.minimum : opts.items.visible + 1;
                if (f > itms.total)
                    return a.stopImmediatePropagation(), debug(conf, "Not enough items (" + itms.total + " total, " + f + " needed): Not scrolling.");
                var g = [b, c, d, e], h = ["object", "number/string", "function", "boolean"], i = cf_sortParams(g, h);
                b = i[0], c = i[1], d = i[2], e = i[3];
                var j = a.type.slice(conf.events.prefix.length);
                if (is_object(b) || (b = {}), is_function(d) && (b.onAfter = d), is_boolean(e) && (b.queue = e), b = $.extend(!0, {}, opts[j], b), b.conditions && !b.conditions.call($tt0, j))
                    return a.stopImmediatePropagation(), debug(conf, 'Callback "conditions" returned false.');
                if (!is_number(c)) {
                    if ("*" != opts.items.filter)
                        c = "visible";
                    else
                        for (var k = [c, b.items, opts[j].items], i = 0, l = k.length; l > i; i++)
                            if (is_number(k[i]) || "page" == k[i] || "visible" == k[i]) {
                                c = k[i];
                                break
                            }
                    switch (c) {
                        case"page":
                            return a.stopImmediatePropagation(), $cfs.triggerHandler(cf_e(j + "Page", conf), [b, d]);
                        case"visible":
                            opts.items.visibleConf.variable || "*" != opts.items.filter || (c = opts.items.visible)
                    }
                }
                if (scrl.isStopped)
                    return $cfs.trigger(cf_e("resume", conf)), $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]]), a.stopImmediatePropagation(), debug(conf, "Carousel resumed scrolling.");
                if (b.duration > 0 && crsl.isScrolling)
                    return b.queue && ("last" == b.queue && (queu = []), ("first" != b.queue || 0 == queu.length) && $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]])), a.stopImmediatePropagation(), debug(conf, "Carousel currently scrolling.");
                if (tmrs.timePassed = 0, $cfs.trigger(cf_e("slide_" + j, conf), [b, c]), opts.synchronise)
                    for (var m = opts.synchronise, n = [b, c], o = 0, l = m.length; l > o; o++) {
                        var p = j;
                        m[o][2] || (p = "prev" == p ? "next" : "prev"), m[o][1] || (n[0] = m[o][0].triggerHandler("_cfs_triggerEvent", ["configuration", p])), n[1] = c + m[o][3], m[o][0].trigger("_cfs_triggerEvent", ["slide_" + p, n])
                    }
                return!0
            }), $cfs.bind(cf_e("slide_prev", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && 0 == itms.first)
                    return opts.infinite && $cfs.trigger(cf_e("next", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if (opts.items.visibleConf.variable)
                        c = gn_getVisibleItemsPrev(d, opts, itms.total - 1);
                    else if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsPrevFilter(d, opts, itms.total - 1, e)
                    } else
                        c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                if (opts.circular || itms.total - c < itms.first && (c = itms.total - itms.first), opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    var f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0);
                    f >= opts.items.visible + c && itms.total > c && (c++, f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0)), opts.items.visible = f
                } else if ("*" != opts.items.filter) {
                    var f = gn_getVisibleItemsNextFilter(d, opts, itms.total - c);
                    opts.items.visible = cf_getItemsAdjust(f, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c)
                    return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items backward."), itms.first += c; itms.first >= itms.total; )
                    itms.first -= itms.total;
                opts.circular || (0 == itms.first && b.onEnd && b.onEnd.call($tt0, "prev"), opts.infinite || nv_enableNavi(opts, itms.first, conf)), $cfs.children().slice(itms.total - c, itms.total).prependTo($cfs), itms.total < opts.items.visible + c && $cfs.children().slice(0, opts.items.visible + c - itms.total).clone(!0).appendTo($cfs);
                var d = $cfs.children(), g = gi_getOldItemsPrev(d, opts, c), h = gi_getNewItemsPrev(d, opts), i = d.eq(c - 1), j = g.last(), k = h.last();
                sz_resetMargin(d, opts);
                var l = 0, m = 0;
                if (opts.align) {
                    var n = cf_getAlignPadding(h, opts);
                    l = n[0], m = n[1]
                }
                var o = 0 > l ? opts.padding[opts.d[3]] : 0, p = !1, q = $();
                if (c > opts.items.visible && (q = d.slice(opts.items.visibleConf.old, c), "directscroll" == b.fx)) {
                    var r = opts.items[opts.d.width];
                    p = q, i = k, sc_hideHiddenItems(p), opts.items[opts.d.width] = "variable"
                }
                var s = !1, t = ms_getTotalSize(d.slice(0, c), opts, "width"), u = cf_mapWrapperSizes(ms_getSizes(h, opts, !0), opts, !opts.usePadding), v = 0, w = {}, x = {}, y = {}, z = {}, A = {}, B = {}, C = {}, D = sc_getDuration(b, opts, c, t);
                switch (b.fx) {
                    case"cover":
                    case"cover-fade":
                        v = ms_getTotalSize(d.slice(0, opts.items.visible), opts, "width")
                }
                p && (opts.items[opts.d.width] = r), sz_resetMargin(d, opts, !0), m >= 0 && sz_resetMargin(j, opts, opts.padding[opts.d[1]]), l >= 0 && sz_resetMargin(i, opts, opts.padding[opts.d[3]]), opts.align && (opts.padding[opts.d[1]] = m, opts.padding[opts.d[3]] = l), B[opts.d.left] = -(t - o), C[opts.d.left] = -(v - o), x[opts.d.left] = u[opts.d.width];
                var E = function() {
                }, F = function() {
                }, G = function() {
                }, H = function() {
                }, I = function() {
                }, J = function() {
                }, K = function() {
                }, L = function() {
                }, M = function() {
                }, N = function() {
                }, O = function() {
                };
                switch (b.fx) {
                    case"crossfade":
                    case"cover":
                    case"cover-fade":
                    case"uncover":
                    case"uncover-fade":
                        s = $cfs.clone(!0).appendTo($wrp)
                }
                switch (b.fx) {
                    case"crossfade":
                    case"uncover":
                    case"uncover-fade":
                        s.children().slice(0, c).remove(), s.children().slice(opts.items.visibleConf.old).remove();
                        break;
                    case"cover":
                    case"cover-fade":
                        s.children().slice(opts.items.visible).remove(), s.css(C)
                }
                if ($cfs.css(B), scrl = sc_setScroll(D, b.easing, conf), w[opts.d.left] = opts.usePadding ? opts.padding[opts.d[3]] : 0, ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (E = function() {
                    $wrp.css(u)
                }, F = function() {
                    scrl.anims.push([$wrp, u])
                }), opts.usePadding) {
                    switch (k.not(i).length && (y[opts.d.marginRight] = i.data("_cfs_origCssMargin"), 0 > l ? i.css(y) : (K = function() {
                            i.css(y)
                        }, L = function() {
                            scrl.anims.push([i, y])
                        })), b.fx){case"cover":
                        case"cover-fade":
                            s.children().eq(c - 1).css(y)
                    }
                    k.not(j).length && (z[opts.d.marginRight] = j.data("_cfs_origCssMargin"), G = function() {
                        j.css(z)
                    }, H = function() {
                        scrl.anims.push([j, z])
                    }), m >= 0 && (A[opts.d.marginRight] = k.data("_cfs_origCssMargin") + opts.padding[opts.d[1]], I = function() {
                        k.css(A)
                    }, J = function() {
                        scrl.anims.push([k, A])
                    })
                }
                O = function() {
                    $cfs.css(w)
                };
                var P = opts.items.visible + c - itms.total;
                N = function() {
                    if (P > 0 && ($cfs.children().slice(itms.total).remove(), g = $($cfs.children().slice(itms.total - (opts.items.visible - P)).get().concat($cfs.children().slice(0, P).get()))), sc_showHiddenItems(p), opts.usePadding) {
                        var a = $cfs.children().eq(opts.items.visible + c - 1);
                        a.css(opts.d.marginRight, a.data("_cfs_origCssMargin"))
                    }
                };
                var Q = sc_mapCallbackArguments(g, q, h, c, "prev", D, u);
                switch (M = function() {
                        sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", Q, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                    }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", Q, clbk), b.fx){case"none":
                        $cfs.css(w), E(), G(), I(), K(), O(), N(), M();
                        break;
                    case"fade":
                        scrl.anims.push([$cfs, {opacity: 0}, function() {
                                E(), G(), I(), K(), O(), N(), scrl = sc_setScroll(D, b.easing, conf), scrl.anims.push([$cfs, {opacity: 1}, M]), sc_startScroll(scrl, conf)
                            }]);
                        break;
                    case"crossfade":
                        $cfs.css({opacity: 0}), scrl.anims.push([s, {opacity: 0}]), scrl.anims.push([$cfs, {opacity: 1}, M]), F(), G(), I(), K(), O(), N();
                        break;
                    case"cover":
                        scrl.anims.push([s, w, function() {
                                G(), I(), K(), O(), N(), M()
                            }]), F();
                        break;
                    case"cover-fade":
                        scrl.anims.push([$cfs, {opacity: 0}]), scrl.anims.push([s, w, function() {
                                G(), I(), K(), O(), N(), M()
                            }]), F();
                        break;
                    case"uncover":
                        scrl.anims.push([s, x, M]), F(), G(), I(), K(), O(), N();
                        break;
                    case"uncover-fade":
                        $cfs.css({opacity: 0}), scrl.anims.push([$cfs, {opacity: 1}]), scrl.anims.push([s, x, M]), F(), G(), I(), K(), O(), N();
                        break;
                    default:
                        scrl.anims.push([$cfs, w, function() {
                                N(), M()
                            }]), F(), H(), J(), L()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slide_next", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && itms.first == opts.items.visible)
                    return opts.infinite && $cfs.trigger(cf_e("prev", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsNextFilter(d, opts, 0, e)
                    } else
                        c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                var f = 0 == itms.first ? itms.total : itms.first;
                if (!opts.circular) {
                    if (opts.items.visibleConf.variable)
                        var g = gn_getVisibleItemsNext(d, opts, c), e = gn_getVisibleItemsPrev(d, opts, f - 1);
                    else
                        var g = opts.items.visible, e = opts.items.visible;
                    c + g > f && (c = f - e)
                }
                if (opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    for (var g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0); opts.items.visible - c >= g && itms.total > c; )
                        c++, g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0);
                    opts.items.visible = g
                } else if ("*" != opts.items.filter) {
                    var g = gn_getVisibleItemsNextFilter(d, opts, c);
                    opts.items.visible = cf_getItemsAdjust(g, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c)
                    return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items forward."), itms.first -= c; 0 > itms.first; )
                    itms.first += itms.total;
                opts.circular || (itms.first == opts.items.visible && b.onEnd && b.onEnd.call($tt0, "next"), opts.infinite || nv_enableNavi(opts, itms.first, conf)), itms.total < opts.items.visible + c && $cfs.children().slice(0, opts.items.visible + c - itms.total).clone(!0).appendTo($cfs);
                var d = $cfs.children(), h = gi_getOldItemsNext(d, opts), i = gi_getNewItemsNext(d, opts, c), j = d.eq(c - 1), k = h.last(), l = i.last();
                sz_resetMargin(d, opts);
                var m = 0, n = 0;
                if (opts.align) {
                    var o = cf_getAlignPadding(i, opts);
                    m = o[0], n = o[1]
                }
                var p = !1, q = $();
                if (c > opts.items.visibleConf.old && (q = d.slice(opts.items.visibleConf.old, c), "directscroll" == b.fx)) {
                    var r = opts.items[opts.d.width];
                    p = q, j = k, sc_hideHiddenItems(p), opts.items[opts.d.width] = "variable"
                }
                var s = !1, t = ms_getTotalSize(d.slice(0, c), opts, "width"), u = cf_mapWrapperSizes(ms_getSizes(i, opts, !0), opts, !opts.usePadding), v = 0, w = {}, x = {}, y = {}, z = {}, A = {}, B = sc_getDuration(b, opts, c, t);
                switch (b.fx) {
                    case"uncover":
                    case"uncover-fade":
                        v = ms_getTotalSize(d.slice(0, opts.items.visibleConf.old), opts, "width")
                }
                p && (opts.items[opts.d.width] = r), opts.align && 0 > opts.padding[opts.d[1]] && (opts.padding[opts.d[1]] = 0), sz_resetMargin(d, opts, !0), sz_resetMargin(k, opts, opts.padding[opts.d[1]]), opts.align && (opts.padding[opts.d[1]] = n, opts.padding[opts.d[3]] = m), A[opts.d.left] = opts.usePadding ? opts.padding[opts.d[3]] : 0;
                var C = function() {
                }, D = function() {
                }, E = function() {
                }, F = function() {
                }, G = function() {
                }, H = function() {
                }, I = function() {
                }, J = function() {
                }, K = function() {
                };
                switch (b.fx) {
                    case"crossfade":
                    case"cover":
                    case"cover-fade":
                    case"uncover":
                    case"uncover-fade":
                        s = $cfs.clone(!0).appendTo($wrp), s.children().slice(opts.items.visibleConf.old).remove()
                }
                switch (b.fx) {
                    case"crossfade":
                    case"cover":
                    case"cover-fade":
                        $cfs.css("zIndex", 1), s.css("zIndex", 0)
                }
                if (scrl = sc_setScroll(B, b.easing, conf), w[opts.d.left] = -t, x[opts.d.left] = -v, 0 > m && (w[opts.d.left] += m), ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (C = function() {
                    $wrp.css(u)
                }, D = function() {
                    scrl.anims.push([$wrp, u])
                }), opts.usePadding) {
                    var L = l.data("_cfs_origCssMargin");
                    n >= 0 && (L += opts.padding[opts.d[1]]), l.css(opts.d.marginRight, L), j.not(k).length && (z[opts.d.marginRight] = k.data("_cfs_origCssMargin")), E = function() {
                        k.css(z)
                    }, F = function() {
                        scrl.anims.push([k, z])
                    };
                    var M = j.data("_cfs_origCssMargin");
                    m > 0 && (M += opts.padding[opts.d[3]]), y[opts.d.marginRight] = M, G = function() {
                        j.css(y)
                    }, H = function() {
                        scrl.anims.push([j, y])
                    }
                }
                K = function() {
                    $cfs.css(A)
                };
                var N = opts.items.visible + c - itms.total;
                J = function() {
                    N > 0 && $cfs.children().slice(itms.total).remove();
                    var a = $cfs.children().slice(0, c).appendTo($cfs).last();
                    if (N > 0 && (i = gi_getCurrentItems(d, opts)), sc_showHiddenItems(p), opts.usePadding) {
                        if (itms.total < opts.items.visible + c) {
                            var b = $cfs.children().eq(opts.items.visible - 1);
                            b.css(opts.d.marginRight, b.data("_cfs_origCssMargin") + opts.padding[opts.d[1]])
                        }
                        a.css(opts.d.marginRight, a.data("_cfs_origCssMargin"))
                    }
                };
                var O = sc_mapCallbackArguments(h, q, i, c, "next", B, u);
                switch (I = function() {
                        $cfs.css("zIndex", $cfs.data("_cfs_origCssZindex")), sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", O, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                    }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", O, clbk), b.fx){case"none":
                        $cfs.css(w), C(), E(), G(), K(), J(), I();
                        break;
                    case"fade":
                        scrl.anims.push([$cfs, {opacity: 0}, function() {
                                C(), E(), G(), K(), J(), scrl = sc_setScroll(B, b.easing, conf), scrl.anims.push([$cfs, {opacity: 1}, I]), sc_startScroll(scrl, conf)
                            }]);
                        break;
                    case"crossfade":
                        $cfs.css({opacity: 0}), scrl.anims.push([s, {opacity: 0}]), scrl.anims.push([$cfs, {opacity: 1}, I]), D(), E(), G(), K(), J();
                        break;
                    case"cover":
                        $cfs.css(opts.d.left, $wrp[opts.d.width]()), scrl.anims.push([$cfs, A, I]), D(), E(), G(), J();
                        break;
                    case"cover-fade":
                        $cfs.css(opts.d.left, $wrp[opts.d.width]()), scrl.anims.push([s, {opacity: 0}]), scrl.anims.push([$cfs, A, I]), D(), E(), G(), J();
                        break;
                    case"uncover":
                        scrl.anims.push([s, x, I]), D(), E(), G(), K(), J();
                        break;
                    case"uncover-fade":
                        $cfs.css({opacity: 0}), scrl.anims.push([$cfs, {opacity: 1}]), scrl.anims.push([s, x, I]), D(), E(), G(), K(), J();
                        break;
                    default:
                        scrl.anims.push([$cfs, w, function() {
                                K(), J(), I()
                            }]), D(), F(), H()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slideTo", conf), function(a, b, c, d, e, f, g) {
                a.stopPropagation();
                var h = [b, c, d, e, f, g], i = ["string/number/object", "number", "boolean", "object", "string", "function"], j = cf_sortParams(h, i);
                return e = j[3], f = j[4], g = j[5], b = gn_getItemIndex(j[0], j[1], j[2], itms, $cfs), 0 == b ? !1 : (is_object(e) || (e = !1), "prev" != f && "next" != f && (f = opts.circular ? itms.total / 2 >= b ? "next" : "prev" : 0 == itms.first || itms.first > b ? "next" : "prev"), "prev" == f && (b = itms.total - b), $cfs.trigger(cf_e(f, conf), [e, b, g]), !0)
            }), $cfs.bind(cf_e("prevPage", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d - 1, b, "prev", c])
            }), $cfs.bind(cf_e("nextPage", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d + 1, b, "next", c])
            }), $cfs.bind(cf_e("slideToPage", conf), function(a, b, c, d, e) {
                a.stopPropagation(), is_number(b) || (b = $cfs.triggerHandler(cf_e("currentPage", conf)));
                var f = opts.pagination.items || opts.items.visible, g = Math.ceil(itms.total / f) - 1;
                return 0 > b && (b = g), b > g && (b = 0), $cfs.triggerHandler(cf_e("slideTo", conf), [b * f, 0, !0, c, d, e])
            }), $cfs.bind(cf_e("jumpToStart", conf), function(a, b) {
                if (a.stopPropagation(), b = b ? gn_getItemIndex(b, 0, !0, itms, $cfs) : 0, b += itms.first, 0 != b) {
                    if (itms.total > 0)
                        for (; b > itms.total; )
                            b -= itms.total;
                    $cfs.prepend($cfs.children().slice(b, itms.total))
                }
                return!0
            }), $cfs.bind(cf_e("synchronise", conf), function(a, b) {
                if (a.stopPropagation(), b)
                    b = cf_getSynchArr(b);
                else {
                    if (!opts.synchronise)
                        return debug(conf, "No carousel to synchronise.");
                    b = opts.synchronise
                }
                for (var c = $cfs.triggerHandler(cf_e("currentPosition", conf)), d = !0, e = 0, f = b.length; f > e; e++)
                    b[e][0].triggerHandler(cf_e("slideTo", conf), [c, b[e][3], !0]) || (d = !1);
                return d
            }), $cfs.bind(cf_e("queue", conf), function(a, b, c) {
                return a.stopPropagation(), is_function(b) ? b.call($tt0, queu) : is_array(b) ? queu = b : is_undefined(b) || queu.push([b, c]), queu
            }), $cfs.bind(cf_e("insertItem", conf), function(a, b, c, d, e) {
                a.stopPropagation();
                var f = [b, c, d, e], g = ["string/object", "string/number/object", "boolean", "number"], h = cf_sortParams(f, g);
                if (b = h[0], c = h[1], d = h[2], e = h[3], is_object(b) && !is_jquery(b) ? b = $(b) : is_string(b) && (b = $(b)), !is_jquery(b) || 0 == b.length)
                    return debug(conf, "Not a valid object.");
                is_undefined(c) && (c = "end"), sz_storeMargin(b, opts), sz_storeOrigCss(b);
                var i = c, j = "before";
                "end" == c ? d ? (0 == itms.first ? (c = itms.total - 1, j = "after") : (c = itms.first, itms.first += b.length), 0 > c && (c = 0)) : (c = itms.total - 1, j = "after") : c = gn_getItemIndex(c, e, d, itms, $cfs);
                var k = $cfs.children().eq(c);
                return k.length ? k[j](b) : (debug(conf, "Correct insert-position not found! Appending item to the end."), $cfs.append(b)), "end" == i || d || itms.first > c && (itms.first += b.length), itms.total = $cfs.children().length, itms.first >= itms.total && (itms.first -= itms.total), $cfs.trigger(cf_e("updateSizes", conf)), $cfs.trigger(cf_e("linkAnchors", conf)), !0
            }), $cfs.bind(cf_e("removeItem", conf), function(a, b, c, d) {
                a.stopPropagation();
                var e = [b, c, d], f = ["string/number/object", "boolean", "number"], g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], b instanceof $ && b.length > 1)
                    return i = $(), b.each(function() {
                        var e = $cfs.trigger(cf_e("removeItem", conf), [$(this), c, d]);
                        e && (i = i.add(e))
                    }), i;
                if (is_undefined(b) || "end" == b)
                    i = $cfs.children().last();
                else {
                    b = gn_getItemIndex(b, d, c, itms, $cfs);
                    var i = $cfs.children().eq(b);
                    i.length && itms.first > b && (itms.first -= i.length)
                }
                return i && i.length && (i.detach(), itms.total = $cfs.children().length, $cfs.trigger(cf_e("updateSizes", conf))), i
            }), $cfs.bind(cf_e("onBefore", conf) + " " + cf_e("onAfter", conf), function(a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length);
                return is_array(b) && (clbk[c] = b), is_function(b) && clbk[c].push(b), clbk[c]
            }), $cfs.bind(cf_e("currentPosition", conf), function(a, b) {
                if (a.stopPropagation(), 0 == itms.first)
                    var c = 0;
                else
                    var c = itms.total - itms.first;
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("currentPage", conf), function(a, b) {
                a.stopPropagation();
                var e, c = opts.pagination.items || opts.items.visible, d = Math.ceil(itms.total / c - 1);
                return e = 0 == itms.first ? 0 : itms.first < itms.total % c ? 0 : itms.first != c || opts.circular ? Math.round((itms.total - itms.first) / c) : d, 0 > e && (e = 0), e > d && (e = d), is_function(b) && b.call($tt0, e), e
            }), $cfs.bind(cf_e("currentVisible", conf), function(a, b) {
                a.stopPropagation();
                var c = gi_getCurrentItems($cfs.children(), opts);
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("slice", conf), function(a, b, c, d) {
                if (a.stopPropagation(), 0 == itms.total)
                    return!1;
                var e = [b, c, d], f = ["number", "number", "function"], g = cf_sortParams(e, f);
                if (b = is_number(g[0]) ? g[0] : 0, c = is_number(g[1]) ? g[1] : itms.total, d = g[2], b += itms.first, c += itms.first, items.total > 0) {
                    for (; b > itms.total; )
                        b -= itms.total;
                    for (; c > itms.total; )
                        c -= itms.total;
                    for (; 0 > b; )
                        b += itms.total;
                    for (; 0 > c; )
                        c += itms.total
                }
                var i, h = $cfs.children();
                return i = c > b ? h.slice(b, c) : $(h.slice(b, itms.total).get().concat(h.slice(0, c).get())), is_function(d) && d.call($tt0, i), i
            }), $cfs.bind(cf_e("isPaused", conf) + " " + cf_e("isStopped", conf) + " " + cf_e("isScrolling", conf), function(a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length), d = crsl[c];
                return is_function(b) && b.call($tt0, d), d
            }), $cfs.bind(cf_e("configuration", conf), function(e, a, b, c) {
                e.stopPropagation();
                var reInit = !1;
                if (is_function(a))
                    a.call($tt0, opts);
                else if (is_object(a))
                    opts_orig = $.extend(!0, {}, opts_orig, a), b !== !1 ? reInit = !0 : opts = $.extend(!0, {}, opts, a);
                else if (!is_undefined(a))
                    if (is_function(b)) {
                        var val = eval("opts." + a);
                        is_undefined(val) && (val = ""), b.call($tt0, val)
                    } else {
                        if (is_undefined(b))
                            return eval("opts." + a);
                        "boolean" != typeof c && (c = !0), eval("opts_orig." + a + " = b"), c !== !1 ? reInit = !0 : eval("opts." + a + " = b")
                    }
                if (reInit) {
                    sz_resetMargin($cfs.children(), opts), FN._init(opts_orig), FN._bind_buttons();
                    var sz = sz_setSizes($cfs, opts);
                    $cfs.trigger(cf_e("updatePageStatus", conf), [!0, sz])
                }
                return opts
            }), $cfs.bind(cf_e("linkAnchors", conf), function(a, b, c) {
                return a.stopPropagation(), is_undefined(b) ? b = $("body") : is_string(b) && (b = $(b)), is_jquery(b) && 0 != b.length ? (is_string(c) || (c = "a.caroufredsel"), b.find(c).each(function() {
                    var a = this.hash || "";
                    a.length > 0 && -1 != $cfs.children().index($(a)) && $(this).unbind("click").click(function(b) {
                        b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), a)
                    })
                }), !0) : debug(conf, "Not a valid object.")
            }), $cfs.bind(cf_e("updatePageStatus", conf), function(a, b) {
                if (a.stopPropagation(), opts.pagination.container) {
                    var d = opts.pagination.items || opts.items.visible, e = Math.ceil(itms.total / d);
                    b && (opts.pagination.anchorBuilder && (opts.pagination.container.children().remove(), opts.pagination.container.each(function() {
                        for (var a = 0; e > a; a++) {
                            var b = $cfs.children().eq(gn_getItemIndex(a * d, 0, !0, itms, $cfs));
                            $(this).append(opts.pagination.anchorBuilder.call(b[0], a + 1))
                        }
                    })), opts.pagination.container.each(function() {
                        $(this).children().unbind(opts.pagination.event).each(function(a) {
                            $(this).bind(opts.pagination.event, function(b) {
                                b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [a * d, -opts.pagination.deviation, !0, opts.pagination])
                            })
                        })
                    }));
                    var f = $cfs.triggerHandler(cf_e("currentPage", conf)) + opts.pagination.deviation;
                    return f >= e && (f = 0), 0 > f && (f = e - 1), opts.pagination.container.each(function() {
                        $(this).children().removeClass(cf_c("selected", conf)).eq(f).addClass(cf_c("selected", conf))
                    }), !0
                }
            }), $cfs.bind(cf_e("updateSizes", conf), function() {
                var b = opts.items.visible, c = $cfs.children(), d = ms_getParentSize($wrp, opts, "width");
                if (itms.total = c.length, crsl.primarySizePercentage ? (opts.maxDimension = d, opts[opts.d.width] = ms_getPercentage(d, crsl.primarySizePercentage)) : opts.maxDimension = ms_getMaxDimension(opts, d), opts.responsive ? (opts.items.width = opts.items.sizesConf.width, opts.items.height = opts.items.sizesConf.height, opts = in_getResponsiveValues(opts, c, d), b = opts.items.visible, sz_setResponsiveSizes(opts, c)) : opts.items.visibleConf.variable ? b = gn_getVisibleItemsNext(c, opts, 0) : "*" != opts.items.filter && (b = gn_getVisibleItemsNextFilter(c, opts, 0)), !opts.circular && 0 != itms.first && b > itms.first) {
                    if (opts.items.visibleConf.variable)
                        var e = gn_getVisibleItemsPrev(c, opts, itms.first) - itms.first;
                    else if ("*" != opts.items.filter)
                        var e = gn_getVisibleItemsPrevFilter(c, opts, itms.first) - itms.first;
                    else
                        var e = opts.items.visible - itms.first;
                    debug(conf, "Preventing non-circular: sliding " + e + " items backward."), $cfs.trigger(cf_e("prev", conf), e)
                }
                opts.items.visible = cf_getItemsAdjust(b, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts = in_getAlignPadding(opts, c);
                var f = sz_setSizes($cfs, opts);
                return $cfs.trigger(cf_e("updatePageStatus", conf), [!0, f]), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), f
            }), $cfs.bind(cf_e("destroy", conf), function(a, b) {
                return a.stopPropagation(), tmrs = sc_clearTimers(tmrs), $cfs.data("_cfs_isCarousel", !1), $cfs.trigger(cf_e("finish", conf)), b && $cfs.trigger(cf_e("jumpToStart", conf)), sz_restoreOrigCss($cfs.children()), sz_restoreOrigCss($cfs), FN._unbind_events(), FN._unbind_buttons(), "parent" == conf.wrapper ? sz_restoreOrigCss($wrp) : $wrp.replaceWith($cfs), !0
            }), $cfs.bind(cf_e("debug", conf), function() {
                return debug(conf, "Carousel width: " + opts.width), debug(conf, "Carousel height: " + opts.height), debug(conf, "Item widths: " + opts.items.width), debug(conf, "Item heights: " + opts.items.height), debug(conf, "Number of items visible: " + opts.items.visible), opts.auto.play && debug(conf, "Number of items scrolled automatically: " + opts.auto.items), opts.prev.button && debug(conf, "Number of items scrolled backward: " + opts.prev.items), opts.next.button && debug(conf, "Number of items scrolled forward: " + opts.next.items), conf.debug
            }), $cfs.bind("_cfs_triggerEvent", function(a, b, c) {
                return a.stopPropagation(), $cfs.triggerHandler(cf_e(b, conf), c)
            })
        }, FN._unbind_events = function() {
            $cfs.unbind(cf_e("", conf)), $cfs.unbind(cf_e("", conf, !1)), $cfs.unbind("_cfs_triggerEvent")
        }, FN._bind_buttons = function() {
            if (FN._unbind_buttons(), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), opts.auto.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.auto.pauseOnHover);
                $wrp.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.auto.button && opts.auto.button.bind(cf_e(opts.auto.event, conf, !1), function(a) {
                a.preventDefault();
                var b = !1, c = null;
                crsl.isPaused ? b = "play" : opts.auto.pauseOnEvent && (b = "pause", c = bt_pauseOnHoverConfig(opts.auto.pauseOnEvent)), b && $cfs.trigger(cf_e(b, conf), c)
            }), opts.prev.button && (opts.prev.button.bind(cf_e(opts.prev.event, conf, !1), function(a) {
                a.preventDefault(), $cfs.trigger(cf_e("prev", conf))
            }), opts.prev.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.prev.pauseOnHover);
                opts.prev.button.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.next.button && (opts.next.button.bind(cf_e(opts.next.event, conf, !1), function(a) {
                a.preventDefault(), $cfs.trigger(cf_e("next", conf))
            }), opts.next.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.next.pauseOnHover);
                opts.next.button.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.pagination.container && opts.pagination.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.pagination.pauseOnHover);
                opts.pagination.container.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if ((opts.prev.key || opts.next.key) && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function(a) {
                var b = a.keyCode;
                b == opts.next.key && (a.preventDefault(), $cfs.trigger(cf_e("next", conf))), b == opts.prev.key && (a.preventDefault(), $cfs.trigger(cf_e("prev", conf)))
            }), opts.pagination.keys && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function(a) {
                var b = a.keyCode;
                b >= 49 && 58 > b && (b = (b - 49) * opts.items.visible, itms.total >= b && (a.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [b, 0, !0, opts.pagination])))
            }), $.fn.swipe) {
                var b = "ontouchstart"in window;
                if (b && opts.swipe.onTouch || !b && opts.swipe.onMouse) {
                    var c = $.extend(!0, {}, opts.prev, opts.swipe), d = $.extend(!0, {}, opts.next, opts.swipe), e = function() {
                        $cfs.trigger(cf_e("prev", conf), [c])
                    }, f = function() {
                        $cfs.trigger(cf_e("next", conf), [d])
                    };
                    switch (opts.direction) {
                        case"up":
                        case"down":
                            opts.swipe.options.swipeUp = f, opts.swipe.options.swipeDown = e;
                            break;
                        default:
                            opts.swipe.options.swipeLeft = f, opts.swipe.options.swipeRight = e
                    }
                    crsl.swipe && $cfs.swipe("destroy"), $wrp.swipe(opts.swipe.options), $wrp.css("cursor", "move"), crsl.swipe = !0
                }
            }
            if ($.fn.mousewheel && opts.mousewheel) {
                var g = $.extend(!0, {}, opts.prev, opts.mousewheel), h = $.extend(!0, {}, opts.next, opts.mousewheel);
                crsl.mousewheel && $wrp.unbind(cf_e("mousewheel", conf, !1)), $wrp.bind(cf_e("mousewheel", conf, !1), function(a, b) {
                    a.preventDefault(), b > 0 ? $cfs.trigger(cf_e("prev", conf), [g]) : $cfs.trigger(cf_e("next", conf), [h])
                }), crsl.mousewheel = !0
            }
            if (opts.auto.play && $cfs.trigger(cf_e("play", conf), opts.auto.delay), crsl.upDateOnWindowResize) {
                var i = function() {
                    $cfs.trigger(cf_e("finish", conf)), opts.auto.pauseOnResize && !crsl.isPaused && $cfs.trigger(cf_e("play", conf)), sz_resetMargin($cfs.children(), opts), $cfs.trigger(cf_e("updateSizes", conf))
                }, j = $(window), k = null;
                if ($.debounce && "debounce" == conf.onWindowResize)
                    k = $.debounce(200, i);
                else if ($.throttle && "throttle" == conf.onWindowResize)
                    k = $.throttle(300, i);
                else {
                    var l = 0, m = 0;
                    k = function() {
                        var a = j.width(), b = j.height();
                        (a != l || b != m) && (i(), l = a, m = b)
                    }
                }
                j.bind(cf_e("resize", conf, !1, !0, !0), k)
            }
        }, FN._unbind_buttons = function() {
            var b = (cf_e("", conf), cf_e("", conf, !1));
            ns3 = cf_e("", conf, !1, !0, !0), $(document).unbind(ns3), $(window).unbind(ns3), $wrp.unbind(b), opts.auto.button && opts.auto.button.unbind(b), opts.prev.button && opts.prev.button.unbind(b), opts.next.button && opts.next.button.unbind(b), opts.pagination.container && (opts.pagination.container.unbind(b), opts.pagination.anchorBuilder && opts.pagination.container.children().remove()), crsl.swipe && ($cfs.swipe("destroy"), $wrp.css("cursor", "default"), crsl.swipe = !1), crsl.mousewheel && (crsl.mousewheel = !1), nv_showNavi(opts, "hide", conf), nv_enableNavi(opts, "removeClass", conf)
        }, is_boolean(configs) && (configs = {debug: configs});
        var crsl = {direction: "next", isPaused: !0, isScrolling: !1, isStopped: !1, mousewheel: !1, swipe: !1}, itms = {total: $cfs.children().length, first: 0}, tmrs = {auto: null, progress: null, startTime: getTime(), timePassed: 0}, scrl = {isStopped: !1, duration: 0, startTime: 0, easing: "", anims: []}, clbk = {onBefore: [], onAfter: []}, queu = [], conf = $.extend(!0, {}, $.fn.carouFredSel.configs, configs), opts = {}, opts_orig = $.extend(!0, {}, options), $wrp = "parent" == conf.wrapper ? $cfs.parent() : $cfs.wrap("<" + conf.wrapper.element + ' class="' + conf.wrapper.classname + '" />').parent();
        if (conf.selector = $cfs.selector, conf.serialNumber = $.fn.carouFredSel.serialNumber++, conf.transition = conf.transition && $.fn.transition ? "transition" : "animate", FN._init(opts_orig, !0, starting_position), FN._build(), FN._bind_events(), FN._bind_buttons(), is_array(opts.items.start))
            var start_arr = opts.items.start;
        else {
            var start_arr = [];
            0 != opts.items.start && start_arr.push(opts.items.start)
        }
        if (opts.cookie && start_arr.unshift(parseInt(cf_getCookie(opts.cookie), 10)), start_arr.length > 0)
            for (var a = 0, l = start_arr.length; l > a; a++) {
                var s = start_arr[a];
                if (0 != s) {
                    if (s === !0) {
                        if (s = window.location.hash, 1 > s.length)
                            continue
                    } else
                        "random" === s && (s = Math.floor(Math.random() * itms.total));
                    if ($cfs.triggerHandler(cf_e("slideTo", conf), [s, 0, !0, {fx: "none"}]))
                        break
                }
            }
        var siz = sz_setSizes($cfs, opts), itm = gi_getCurrentItems($cfs.children(), opts);
        return opts.onCreate && opts.onCreate.call($tt0, {width: siz.width, height: siz.height, items: itm}), $cfs.trigger(cf_e("updatePageStatus", conf), [!0, siz]), $cfs.trigger(cf_e("linkAnchors", conf)), conf.debug && $cfs.trigger(cf_e("debug", conf)), $cfs
    }, $.fn.carouFredSel.serialNumber = 1, $.fn.carouFredSel.defaults = {synchronise: !1, infinite: !0, circular: !0, responsive: !1, direction: "left", items: {start: 0}, scroll: {easing: "swing", duration: 500, pauseOnHover: !1, event: "click", queue: !1}}, $.fn.carouFredSel.configs = {debug: !1, transition: !1, onWindowResize: "throttle", events: {prefix: "", namespace: "cfs"}, wrapper: {element: "div", classname: "caroufredsel_wrapper"}, classnames: {}}, $.fn.carouFredSel.pageAnchorBuilder = function(a) {
        return'<a href="#"><span>' + a + "</span></a>"
    }, $.fn.carouFredSel.progressbarUpdater = function(a) {
        $(this).css("width", a + "%")
    }, $.fn.carouFredSel.cookie = {get: function(a) {
            a += "=";
            for (var b = document.cookie.split(";"), c = 0, d = b.length; d > c; c++) {
                for (var e = b[c]; " " == e.charAt(0); )
                    e = e.slice(1);
                if (0 == e.indexOf(a))
                    return e.slice(a.length)
            }
            return 0
        }, set: function(a, b, c) {
            var d = "";
            if (c) {
                var e = new Date;
                e.setTime(e.getTime() + 1e3 * 60 * 60 * 24 * c), d = "; expires=" + e.toGMTString()
            }
            document.cookie = a + "=" + b + d + "; path=/"
        }, remove: function(a) {
            $.fn.carouFredSel.cookie.set(a, "", -1)
        }}, $.extend($.easing, {quadratic: function(a) {
            var b = a * a;
            return a * (-b * a + 4 * b - 6 * a + 4)
        }, cubic: function(a) {
            return a * (4 * a * a - 9 * a + 6)
        }, elastic: function(a) {
            var b = a * a;
            return a * (33 * b * b - 106 * b * a + 126 * b - 67 * a + 15)
        }}))
})(jQuery);
/*
 * jQuery Cycle2; v20130525
 * http://jquery.malsup.com/cycle2/
 * Copyright (c) 2013 M. Alsup; Dual licensed: MIT/GPL
 */

(function(e) {
    "use strict";
    function t(e) {
        return(e || "").toLowerCase()
    }
    var i = "20130409";
    e.fn.cycle = function(i) {
        var n;
        return 0 !== this.length || e.isReady ? this.each(function() {
            var n, s, o, c, r = e(this), l = e.fn.cycle.log;
            if (!r.data("cycle.opts")) {
                (r.data("cycle-log") === !1 || i && i.log === !1 || s && s.log === !1) && (l = e.noop), l("--c2 init--"), n = r.data();
                for (var a in n)
                    n.hasOwnProperty(a) && /^cycle[A-Z]+/.test(a) && (c = n[a], o = a.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, t), l(o + ":", c, "(" + typeof c + ")"), n[o] = c);
                s = e.extend({}, e.fn.cycle.defaults, n, i || {}), s.timeoutId = 0, s.paused = s.paused || !1, s.container = r, s._maxZ = s.maxZ, s.API = e.extend({_container: r}, e.fn.cycle.API), s.API.log = l, s.API.trigger = function(e, t) {
                    return s.container.trigger(e, t), s.API
                }, r.data("cycle.opts", s), r.data("cycle.API", s.API), s.API.trigger("cycle-bootstrap", [s, s.API]), s.API.addInitialSlides(), s.API.preInitSlideshow(), s.slides.length && s.API.initSlideshow()
            }
        }) : (n = {s: this.selector, c: this.context}, e.fn.cycle.log("requeuing slideshow (dom not ready)"), e(function() {
            e(n.s, n.c).cycle(i)
        }), this)
    }, e.fn.cycle.API = {opts: function() {
            return this._container.data("cycle.opts")
        }, addInitialSlides: function() {
            var t = this.opts(), i = t.slides;
            t.slideCount = 0, t.slides = e(), i = i.jquery ? i : t.container.find(i), t.random && i.sort(function() {
                return Math.random() - .5
            }), t.API.add(i)
        }, preInitSlideshow: function() {
            var t = this.opts();
            t.API.trigger("cycle-pre-initialize", [t]);
            var i = e.fn.cycle.transitions[t.fx];
            i && e.isFunction(i.preInit) && i.preInit(t), t._preInitialized = !0
        }, postInitSlideshow: function() {
            var t = this.opts();
            t.API.trigger("cycle-post-initialize", [t]);
            var i = e.fn.cycle.transitions[t.fx];
            i && e.isFunction(i.postInit) && i.postInit(t)
        }, initSlideshow: function() {
            var t, i = this.opts(), n = i.container;
            i.API.calcFirstSlide(), "static" == i.container.css("position") && i.container.css("position", "relative"), e(i.slides[i.currSlide]).css("opacity", 1).show(), i.API.stackSlides(i.slides[i.currSlide], i.slides[i.nextSlide], !i.reverse), i.pauseOnHover && (i.pauseOnHover !== !0 && (n = e(i.pauseOnHover)), n.hover(function() {
                i.API.pause(!0)
            }, function() {
                i.API.resume(!0)
            })), i.timeout && (t = i.API.getSlideOpts(i.nextSlide), i.API.queueTransition(t, t.timeout + i.delay)), i._initialized = !0, i.API.updateView(!0), i.API.trigger("cycle-initialized", [i]), i.API.postInitSlideshow()
        }, pause: function(t) {
            var i = this.opts(), n = i.API.getSlideOpts(), s = i.hoverPaused || i.paused;
            t ? i.hoverPaused = !0 : i.paused = !0, s || (i.container.addClass("cycle-paused"), i.API.trigger("cycle-paused", [i]).log("cycle-paused"), n.timeout && (clearTimeout(i.timeoutId), i.timeoutId = 0, i._remainingTimeout -= e.now() - i._lastQueue, (0 > i._remainingTimeout || isNaN(i._remainingTimeout)) && (i._remainingTimeout = void 0)))
        }, resume: function(e) {
            var t = this.opts(), i = !t.hoverPaused && !t.paused;
            e ? t.hoverPaused = !1 : t.paused = !1, i || (t.container.removeClass("cycle-paused"), t.API.queueTransition(t.API.getSlideOpts(), t._remainingTimeout), t.API.trigger("cycle-resumed", [t, t._remainingTimeout]).log("cycle-resumed"))
        }, add: function(t, i) {
            var n, s = this.opts(), o = s.slideCount, c = !1;
            "string" == e.type(t) && (t = e.trim(t)), e(t).each(function() {
                var t, n = e(this);
                i ? s.container.prepend(n) : s.container.append(n), s.slideCount++, t = s.API.buildSlideOpts(n), s.slides = i ? e(n).add(s.slides) : s.slides.add(n), s.API.initSlide(t, n, --s._maxZ), n.data("cycle.opts", t), s.API.trigger("cycle-slide-added", [s, t, n])
            }), s.API.updateView(!0), c = s._preInitialized && 2 > o && s.slideCount >= 1, c && (s._initialized ? s.timeout && (n = s.slides.length, s.nextSlide = s.reverse ? n - 1 : 1, s.timeoutId || s.API.queueTransition(s)) : s.API.initSlideshow())
        }, calcFirstSlide: function() {
            var e, t = this.opts();
            e = parseInt(t.startingSlide || 0, 10), (e >= t.slides.length || 0 > e) && (e = 0), t.currSlide = e, t.reverse ? (t.nextSlide = e - 1, 0 > t.nextSlide && (t.nextSlide = t.slides.length - 1)) : (t.nextSlide = e + 1, t.nextSlide == t.slides.length && (t.nextSlide = 0))
        }, calcNextSlide: function() {
            var e, t = this.opts();
            t.reverse ? (e = 0 > t.nextSlide - 1, t.nextSlide = e ? t.slideCount - 1 : t.nextSlide - 1, t.currSlide = e ? 0 : t.nextSlide + 1) : (e = t.nextSlide + 1 == t.slides.length, t.nextSlide = e ? 0 : t.nextSlide + 1, t.currSlide = e ? t.slides.length - 1 : t.nextSlide - 1)
        }, calcTx: function(t, i) {
            var n, s = t;
            return i && s.manualFx && (n = e.fn.cycle.transitions[s.manualFx]), n || (n = e.fn.cycle.transitions[s.fx]), n || (n = e.fn.cycle.transitions.fade, s.API.log('Transition "' + s.fx + '" not found.  Using fade.')), n
        }, prepareTx: function(e, t) {
            var i, n, s, o, c, r = this.opts();
            return 2 > r.slideCount ? (r.timeoutId = 0, void 0) : (!e || r.busy && !r.manualTrump || (r.API.stopTransition(), r.busy = !1, clearTimeout(r.timeoutId), r.timeoutId = 0), r.busy || (0 !== r.timeoutId || e) && (n = r.slides[r.currSlide], s = r.slides[r.nextSlide], o = r.API.getSlideOpts(r.nextSlide), c = r.API.calcTx(o, e), r._tx = c, e && void 0 !== o.manualSpeed && (o.speed = o.manualSpeed), r.nextSlide != r.currSlide && (e || !r.paused && !r.hoverPaused && r.timeout) ? (r.API.trigger("cycle-before", [o, n, s, t]), c.before && c.before(o, n, s, t), i = function() {
                r.busy = !1, r.container.data("cycle.opts") && (c.after && c.after(o, n, s, t), r.API.trigger("cycle-after", [o, n, s, t]), r.API.queueTransition(o), r.API.updateView(!0))
            }, r.busy = !0, c.transition ? c.transition(o, n, s, t, i) : r.API.doTransition(o, n, s, t, i), r.API.calcNextSlide(), r.API.updateView()) : r.API.queueTransition(o)), void 0)
        }, doTransition: function(t, i, n, s, o) {
            var c = t, r = e(i), l = e(n), a = function() {
                l.animate(c.animIn || {opacity: 1}, c.speed, c.easeIn || c.easing, o)
            };
            l.css(c.cssBefore || {}), r.animate(c.animOut || {}, c.speed, c.easeOut || c.easing, function() {
                r.css(c.cssAfter || {}), c.sync || a()
            }), c.sync && a()
        }, queueTransition: function(t, i) {
            var n = this.opts(), s = void 0 !== i ? i : t.timeout;
            return 0 === n.nextSlide && 0 === --n.loop ? (n.API.log("terminating; loop=0"), n.timeout = 0, s ? setTimeout(function() {
                n.API.trigger("cycle-finished", [n])
            }, s) : n.API.trigger("cycle-finished", [n]), n.nextSlide = n.currSlide, void 0) : (s && (n._lastQueue = e.now(), void 0 === i && (n._remainingTimeout = t.timeout), n.paused || n.hoverPaused || (n.timeoutId = setTimeout(function() {
                n.API.prepareTx(!1, !n.reverse)
            }, s))), void 0)
        }, stopTransition: function() {
            var e = this.opts();
            e.slides.filter(":animated").length && (e.slides.stop(!1, !0), e.API.trigger("cycle-transition-stopped", [e])), e._tx && e._tx.stopTransition && e._tx.stopTransition(e)
        }, advanceSlide: function(e) {
            var t = this.opts();
            return clearTimeout(t.timeoutId), t.timeoutId = 0, t.nextSlide = t.currSlide + e, 0 > t.nextSlide ? t.nextSlide = t.slides.length - 1 : t.nextSlide >= t.slides.length && (t.nextSlide = 0), t.API.prepareTx(!0, e >= 0), !1
        }, buildSlideOpts: function(i) {
            var n, s, o = this.opts(), c = i.data() || {};
            for (var r in c)
                c.hasOwnProperty(r) && /^cycle[A-Z]+/.test(r) && (n = c[r], s = r.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, t), o.API.log("[" + (o.slideCount - 1) + "]", s + ":", n, "(" + typeof n + ")"), c[s] = n);
            c = e.extend({}, e.fn.cycle.defaults, o, c), c.slideNum = o.slideCount;
            try {
                delete c.API, delete c.slideCount, delete c.currSlide, delete c.nextSlide, delete c.slides
            } catch (l) {
            }
            return c
        }, getSlideOpts: function(t) {
            var i = this.opts();
            void 0 === t && (t = i.currSlide);
            var n = i.slides[t], s = e(n).data("cycle.opts");
            return e.extend({}, i, s)
        }, initSlide: function(t, i, n) {
            var s = this.opts();
            i.css(t.slideCss || {}), n > 0 && i.css("zIndex", n), isNaN(t.speed) && (t.speed = e.fx.speeds[t.speed] || e.fx.speeds._default), t.sync || (t.speed = t.speed / 2), i.addClass(s.slideClass)
        }, updateView: function(e) {
            var t = this.opts();
            if (t._initialized) {
                var i = t.API.getSlideOpts(), n = t.slides[t.currSlide];
                !e && (t.API.trigger("cycle-update-view-before", [t, i, n]), 0 > t.updateView) || (t.slideActiveClass && t.slides.removeClass(t.slideActiveClass).eq(t.currSlide).addClass(t.slideActiveClass), e && t.hideNonActive && t.slides.filter(":not(." + t.slideActiveClass + ")").hide(), t.API.trigger("cycle-update-view", [t, i, n, e]), t.API.trigger("cycle-update-view-after", [t, i, n]))
            }
        }, getComponent: function(t) {
            var i = this.opts(), n = i[t];
            return"string" == typeof n ? /^\s*[\>|\+|~]/.test(n) ? i.container.find(n) : e(n) : n.jquery ? n : e(n)
        }, stackSlides: function(t, i, n) {
            var s = this.opts();
            t || (t = s.slides[s.currSlide], i = s.slides[s.nextSlide], n = !s.reverse), e(t).css("zIndex", s.maxZ);
            var o, c = s.maxZ - 2, r = s.slideCount;
            if (n) {
                for (o = s.currSlide + 1; r > o; o++)
                    e(s.slides[o]).css("zIndex", c--);
                for (o = 0; s.currSlide > o; o++)
                    e(s.slides[o]).css("zIndex", c--)
            } else {
                for (o = s.currSlide - 1; o >= 0; o--)
                    e(s.slides[o]).css("zIndex", c--);
                for (o = r - 1; o > s.currSlide; o--)
                    e(s.slides[o]).css("zIndex", c--)
            }
            e(i).css("zIndex", s.maxZ - 1)
        }, getSlideIndex: function(e) {
            return this.opts().slides.index(e)
        }}, e.fn.cycle.log = function() {
        window.console && console.log && console.log("[cycle2] " + Array.prototype.join.call(arguments, " "))
    }, e.fn.cycle.version = function() {
        return"Cycle2: " + i
    }, e.fn.cycle.transitions = {custom: {}, none: {before: function(e, t, i, n) {
                e.API.stackSlides(i, t, n), e.cssBefore = {opacity: 1, display: "block"}
            }}, fade: {before: function(t, i, n, s) {
                var o = t.API.getSlideOpts(t.nextSlide).slideCss || {};
                t.API.stackSlides(i, n, s), t.cssBefore = e.extend(o, {opacity: 0, display: "block"}), t.animIn = {opacity: 1}, t.animOut = {opacity: 0}
            }}, fadeout: {before: function(t, i, n, s) {
                var o = t.API.getSlideOpts(t.nextSlide).slideCss || {};
                t.API.stackSlides(i, n, s), t.cssBefore = e.extend(o, {opacity: 1, display: "block"}), t.animOut = {opacity: 0}
            }}, scrollHorz: {before: function(e, t, i, n) {
                e.API.stackSlides(t, i, n);
                var s = e.container.css("overflow", "hidden").width();
                e.cssBefore = {left: n ? s : -s, top: 0, opacity: 1, display: "block"}, e.cssAfter = {zIndex: e._maxZ - 2, left: 0}, e.animIn = {left: 0}, e.animOut = {left: n ? -s : s}
            }}}, e.fn.cycle.defaults = {allowWrap: !0, autoSelector: ".cycle-slideshow[data-cycle-auto-init!=false]", delay: 0, easing: null, fx: "fade", hideNonActive: !0, loop: 0, manualFx: void 0, manualSpeed: void 0, manualTrump: !0, maxZ: 100, pauseOnHover: !1, reverse: !1, slideActiveClass: "cycle-slide-active", slideClass: "cycle-slide", slideCss: {position: "absolute", top: 0, left: 0}, slides: "> img", speed: 500, startingSlide: 0, sync: !0, timeout: 4e3, updateView: -1}, e(document).ready(function() {
        e(e.fn.cycle.defaults.autoSelector).cycle()
    })
})(jQuery), function(e) {
    "use strict";
    function t(t, n) {
        var s, o, c, r = n.autoHeight;
        if ("container" == r)
            o = e(n.slides[n.currSlide]).outerHeight(), n.container.height(o);
        else if (n._autoHeightRatio)
            n.container.height(n.container.width() / n._autoHeightRatio);
        else if ("calc" === r || "number" == e.type(r) && r >= 0) {
            if (c = "calc" === r ? i(t, n) : r >= n.slides.length ? 0 : r, c == n._sentinelIndex)
                return;
            n._sentinelIndex = c, n._sentinel && n._sentinel.remove(), s = e(n.slides[c].cloneNode(!0)), s.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"), s.css({position: "static", visibility: "hidden", display: "block"}).prependTo(n.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"), s.find("*").css("visibility", "hidden"), n._sentinel = s
        }
    }
    function i(t, i) {
        var n = 0, s = -1;
        return i.slides.each(function(t) {
            var i = e(this).height();
            i > s && (s = i, n = t)
        }), n
    }
    function n(t, i, n, s) {
        var o = e(s).outerHeight(), c = i.sync ? i.speed / 2 : i.speed;
        i.container.animate({height: o}, c)
    }
    function s(i, o) {
        o._autoHeightOnResize && (e(window).off("resize orientationchange", o._autoHeightOnResize), o._autoHeightOnResize = null), o.container.off("cycle-slide-added cycle-slide-removed", t), o.container.off("cycle-destroyed", s), o.container.off("cycle-before", n), o._sentinel && (o._sentinel.remove(), o._sentinel = null)
    }
    e.extend(e.fn.cycle.defaults, {autoHeight: 0}), e(document).on("cycle-initialized", function(i, o) {
        function c() {
            t(i, o)
        }
        var r, l = o.autoHeight, a = e.type(l), d = null;
        ("string" === a || "number" === a) && (o.container.on("cycle-slide-added cycle-slide-removed", t), o.container.on("cycle-destroyed", s), "container" == l ? o.container.on("cycle-before", n) : "string" === a && /\d+\:\d+/.test(l) && (r = l.match(/(\d+)\:(\d+)/), r = r[1] / r[2], o._autoHeightRatio = r), "number" !== a && (o._autoHeightOnResize = function() {
            clearTimeout(d), d = setTimeout(c, 50)
        }, e(window).on("resize orientationchange", o._autoHeightOnResize)), setTimeout(c, 30))
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {caption: "> .cycle-caption", captionTemplate: "{{slideNum}} / {{slideCount}}", overlay: "> .cycle-overlay", overlayTemplate: "<div>{{title}}</div><div>{{desc}}</div>", captionModule: "caption"}), e(document).on("cycle-update-view", function(t, i, n, s) {
        "caption" === i.captionModule && e.each(["caption", "overlay"], function() {
            var e = this, t = n[e + "Template"], o = i.API.getComponent(e);
            o.length && t ? (o.html(i.API.tmpl(t, n, i, s)), o.show()) : o.hide()
        })
    }), e(document).on("cycle-destroyed", function(t, i) {
        var n;
        e.each(["caption", "overlay"], function() {
            var e = this, t = i[e + "Template"];
            i[e] && t && (n = i.API.getComponent("caption"), n.empty())
        })
    })
}(jQuery), function(e) {
    "use strict";
    var t = e.fn.cycle;
    e.fn.cycle = function(i) {
        var n, s, o, c = e.makeArray(arguments);
        return"number" == e.type(i) ? this.cycle("goto", i) : "string" == e.type(i) ? this.each(function() {
            var r;
            return n = i, o = e(this).data("cycle.opts"), void 0 === o ? (t.log('slideshow must be initialized before sending commands; "' + n + '" ignored'), void 0) : (n = "goto" == n ? "jump" : n, s = o.API[n], e.isFunction(s) ? (r = e.makeArray(c), r.shift(), s.apply(o.API, r)) : (t.log("unknown command: ", n), void 0))
        }) : t.apply(this, arguments)
    }, e.extend(e.fn.cycle, t), e.extend(t.API, {next: function() {
            var e = this.opts();
            if (!e.busy || e.manualTrump) {
                var t = e.reverse ? -1 : 1;
                e.allowWrap === !1 && e.currSlide + t >= e.slideCount || (e.API.advanceSlide(t), e.API.trigger("cycle-next", [e]).log("cycle-next"))
            }
        }, prev: function() {
            var e = this.opts();
            if (!e.busy || e.manualTrump) {
                var t = e.reverse ? 1 : -1;
                e.allowWrap === !1 && 0 > e.currSlide + t || (e.API.advanceSlide(t), e.API.trigger("cycle-prev", [e]).log("cycle-prev"))
            }
        }, destroy: function() {
            this.stop();
            var t = this.opts(), i = e.isFunction(e._data) ? e._data : e.noop;
            clearTimeout(t.timeoutId), t.timeoutId = 0, t.API.stop(), t.API.trigger("cycle-destroyed", [t]).log("cycle-destroyed"), t.container.removeData(), i(t.container[0], "parsedAttrs", !1), t.retainStylesOnDestroy || (t.container.removeAttr("style"), t.slides.removeAttr("style"), t.slides.removeClass("cycle-slide-active")), t.slides.each(function() {
                e(this).removeData(), i(this, "parsedAttrs", !1)
            })
        }, jump: function(e) {
            var t, i = this.opts();
            if (!i.busy || i.manualTrump) {
                var n = parseInt(e, 10);
                if (isNaN(n) || 0 > n || n >= i.slides.length)
                    return i.API.log("goto: invalid slide index: " + n), void 0;
                if (n == i.currSlide)
                    return i.API.log("goto: skipping, already on slide", n), void 0;
                i.nextSlide = n, clearTimeout(i.timeoutId), i.timeoutId = 0, i.API.log("goto: ", n, " (zero-index)"), t = i.currSlide < i.nextSlide, i.API.prepareTx(!0, t)
            }
        }, stop: function() {
            var t = this.opts(), i = t.container;
            clearTimeout(t.timeoutId), t.timeoutId = 0, t.API.stopTransition(), t.pauseOnHover && (t.pauseOnHover !== !0 && (i = e(t.pauseOnHover)), i.off("mouseenter mouseleave")), t.API.trigger("cycle-stopped", [t]).log("cycle-stopped")
        }, reinit: function() {
            var e = this.opts();
            e.API.destroy(), e.container.cycle()
        }, remove: function(t) {
            for (var i, n, s = this.opts(), o = [], c = 1, r = 0; s.slides.length > r; r++)
                i = s.slides[r], r == t ? n = i : (o.push(i), e(i).data("cycle.opts").slideNum = c, c++);
            n && (s.slides = e(o), s.slideCount--, e(n).remove(), t == s.currSlide && s.API.advanceSlide(1), s.API.trigger("cycle-slide-removed", [s, t, n]).log("cycle-slide-removed"), s.API.updateView())
        }}), e(document).on("click.cycle", "[data-cycle-cmd]", function(t) {
        t.preventDefault();
        var i = e(this), n = i.data("cycle-cmd"), s = i.data("cycle-context") || ".cycle-slideshow";
        e(s).cycle(n, i.data("cycle-arg"))
    })
}(jQuery), function(e) {
    "use strict";
    function t(t, i) {
        var n;
        return t._hashFence ? (t._hashFence = !1, void 0) : (n = window.location.hash.substring(1), t.slides.each(function(s) {
            return e(this).data("cycle-hash") == n ? (i === !0 ? t.startingSlide = s : (t.nextSlide = s, t.API.prepareTx(!0, !1)), !1) : void 0
        }), void 0)
    }
    e(document).on("cycle-pre-initialize", function(i, n) {
        t(n, !0), n._onHashChange = function() {
            t(n, !1)
        }, e(window).on("hashchange", n._onHashChange)
    }), e(document).on("cycle-update-view", function(e, t, i) {
        i.hash && (t._hashFence = !0, window.location.hash = i.hash)
    }), e(document).on("cycle-destroyed", function(t, i) {
        i._onHashChange && e(window).off("hashchange", i._onHashChange)
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {loader: !1}), e(document).on("cycle-bootstrap", function(t, i) {
        function n(t, n) {
            function o(t) {
                var o;
                "wait" == i.loader ? (r.push(t), 0 === a && (r.sort(c), s.apply(i.API, [r, n]), i.container.removeClass("cycle-loading"))) : (o = e(i.slides[i.currSlide]), s.apply(i.API, [t, n]), o.show(), i.container.removeClass("cycle-loading"))
            }
            function c(e, t) {
                return e.data("index") - t.data("index")
            }
            var r = [];
            if ("string" == e.type(t))
                t = e.trim(t);
            else if ("array" === e.type(t))
                for (var l = 0; t.length > l; l++)
                    t[l] = e(t[l])[0];
            t = e(t);
            var a = t.length;
            a && (t.hide().appendTo("body").each(function(t) {
                function c() {
                    0 === --l && (--a, o(d))
                }
                var l = 0, d = e(this), u = d.is("img") ? d : d.find("img");
                return d.data("index", t), u = u.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'), u.length ? (l = u.length, u.each(function() {
                    this.complete ? c() : e(this).load(function() {
                        c()
                    }).error(function() {
                        0 === --l && (i.API.log("slide skipped; img not loaded:", this.src), 0 === --a && "wait" == i.loader && s.apply(i.API, [r, n]))
                    })
                }), void 0) : (--a, r.push(d), void 0)
            }), a && i.container.addClass("cycle-loading"))
        }
        var s;
        i.loader && (s = i.API.add, i.API.add = n)
    })
}(jQuery), function(e) {
    "use strict";
    function t(t, i, n) {
        var s, o = t.API.getComponent("pager");
        o.each(function() {
            var o = e(this);
            if (i.pagerTemplate) {
                var c = t.API.tmpl(i.pagerTemplate, i, t, n[0]);
                s = e(c).appendTo(o)
            } else
                s = o.children().eq(t.slideCount - 1);
            s.on(t.pagerEvent, function(e) {
                e.preventDefault(), t.API.page(o, e.currentTarget)
            })
        })
    }
    function i(e, t) {
        var i = this.opts();
        if (!i.busy || i.manualTrump) {
            var n = e.children().index(t), s = n, o = s > i.currSlide;
            i.currSlide != s && (i.nextSlide = s, i.API.prepareTx(!0, o), i.API.trigger("cycle-pager-activated", [i, e, t]))
        }
    }
    e.extend(e.fn.cycle.defaults, {pager: "> .cycle-pager", pagerActiveClass: "cycle-pager-active", pagerEvent: "click.cycle", pagerTemplate: "<span>&bull;</span>"}), e(document).on("cycle-bootstrap", function(e, i, n) {
        n.buildPagerLink = t
    }), e(document).on("cycle-slide-added", function(e, t, n, s) {
        t.pager && (t.API.buildPagerLink(t, n, s), t.API.page = i)
    }), e(document).on("cycle-slide-removed", function(t, i, n) {
        if (i.pager) {
            var s = i.API.getComponent("pager");
            s.each(function() {
                var t = e(this);
                e(t.children()[n]).remove()
            })
        }
    }), e(document).on("cycle-update-view", function(t, i) {
        var n;
        i.pager && (n = i.API.getComponent("pager"), n.each(function() {
            e(this).children().removeClass(i.pagerActiveClass).eq(i.currSlide).addClass(i.pagerActiveClass)
        }))
    }), e(document).on("cycle-destroyed", function(e, t) {
        var i = t.API.getComponent("pager");
        i && (i.children().off(t.pagerEvent), t.pagerTemplate && i.empty())
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {next: "> .cycle-next", nextEvent: "click.cycle", disabledClass: "disabled", prev: "> .cycle-prev", prevEvent: "click.cycle", swipe: !1}), e(document).on("cycle-initialized", function(e, t) {
        if (t.API.getComponent("next").on(t.nextEvent, function(e) {
            e.preventDefault(), t.API.next()
        }), t.API.getComponent("prev").on(t.prevEvent, function(e) {
            e.preventDefault(), t.API.prev()
        }), t.swipe) {
            var i = t.swipeVert ? "swipeUp.cycle" : "swipeLeft.cycle swipeleft.cycle", n = t.swipeVert ? "swipeDown.cycle" : "swipeRight.cycle swiperight.cycle";
            t.container.on(i, function() {
                t.API.next()
            }), t.container.on(n, function() {
                t.API.prev()
            })
        }
    }), e(document).on("cycle-update-view", function(e, t) {
        if (!t.allowWrap) {
            var i = t.disabledClass, n = t.API.getComponent("next"), s = t.API.getComponent("prev"), o = t._prevBoundry || 0, c = t._nextBoundry || t.slideCount - 1;
            t.currSlide == c ? n.addClass(i).prop("disabled", !0) : n.removeClass(i).prop("disabled", !1), t.currSlide === o ? s.addClass(i).prop("disabled", !0) : s.removeClass(i).prop("disabled", !1)
        }
    }), e(document).on("cycle-destroyed", function(e, t) {
        t.API.getComponent("prev").off(t.nextEvent), t.API.getComponent("next").off(t.prevEvent), t.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {progressive: !1}), e(document).on("cycle-pre-initialize", function(t, i) {
        if (i.progressive) {
            var n, s, o = i.API, c = o.next, r = o.prev, l = o.prepareTx, a = e.type(i.progressive);
            if ("array" == a)
                n = i.progressive;
            else if (e.isFunction(i.progressive))
                n = i.progressive(i);
            else if ("string" == a) {
                if (s = e(i.progressive), n = e.trim(s.html()), !n)
                    return;
                if (/^(\[)/.test(n))
                    try {
                        n = e.parseJSON(n)
                    } catch (d) {
                        return o.log("error parsing progressive slides", d), void 0
                    }
                else
                    n = n.split(RegExp(s.data("cycle-split") || "\n")), n[n.length - 1] || n.pop()
            }
            l && (o.prepareTx = function(e, t) {
                var s, o;
                return e || 0 === n.length ? (l.apply(i.API, [e, t]), void 0) : (t && i.currSlide == i.slideCount - 1 ? (o = n[0], n = n.slice(1), i.container.one("cycle-slide-added", function(e, t) {
                    setTimeout(function() {
                        t.API.advanceSlide(1)
                    }, 50)
                }), i.API.add(o)) : t || 0 !== i.currSlide ? l.apply(i.API, [e, t]) : (s = n.length - 1, o = n[s], n = n.slice(0, s), i.container.one("cycle-slide-added", function(e, t) {
                    setTimeout(function() {
                        t.currSlide = 1, t.API.advanceSlide(-1)
                    }, 50)
                }), i.API.add(o, !0)), void 0)
            }), c && (o.next = function() {
                var e = this.opts();
                if (n.length && e.currSlide == e.slideCount - 1) {
                    var t = n[0];
                    n = n.slice(1), e.container.one("cycle-slide-added", function(e, t) {
                        c.apply(t.API), t.container.removeClass("cycle-loading")
                    }), e.container.addClass("cycle-loading"), e.API.add(t)
                } else
                    c.apply(e.API)
            }), r && (o.prev = function() {
                var e = this.opts();
                if (n.length && 0 === e.currSlide) {
                    var t = n.length - 1, i = n[t];
                    n = n.slice(0, t), e.container.one("cycle-slide-added", function(e, t) {
                        t.currSlide = 1, t.API.advanceSlide(-1), t.container.removeClass("cycle-loading")
                    }), e.container.addClass("cycle-loading"), e.API.add(i, !0)
                } else
                    r.apply(e.API)
            })
        }
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {tmplRegex: "{{((.)?.*?)}}"}), e.extend(e.fn.cycle.API, {tmpl: function(t, i) {
            var n = RegExp(i.tmplRegex || e.fn.cycle.defaults.tmplRegex, "g"), s = e.makeArray(arguments);
            return s.shift(), t.replace(n, function(t, i) {
                var n, o, c, r, l = i.split(".");
                for (n = 0; s.length > n; n++)
                    if (c = s[n]) {
                        if (l.length > 1)
                            for (r = c, o = 0; l.length > o; o++)
                                c = r, r = r[l[o]] || i;
                        else
                            r = c[i];
                        if (e.isFunction(r))
                            return r.apply(c, s);
                        if (void 0 !== r && null !== r && r != i)
                            return r
                    }
                return i
            })
        }})
}(jQuery);
/*! carousel transition plugin for Cycle2;  version: 20130528 */

(function($) {
    "use strict";

    $(document).on('cycle-bootstrap', function(e, opts, API) {
        if (opts.fx !== 'carousel')
            return;

        API.getSlideIndex = function(el) {
            var slides = this.opts()._carouselWrap.children();
            var i = slides.index(el);
            return i % slides.length;
        };

        // override default 'next' function
        API.next = function() {
            var count = opts.reverse ? -1 : 1;
            if (opts.allowWrap === false && (opts.currSlide + count) > opts.slideCount - opts.carouselVisible)
                return;
            opts.API.advanceSlide(count);
            opts.API.trigger('cycle-next', [opts]).log('cycle-next');
        };

    });


    $.fn.cycle.transitions.carousel = {
        // transition API impl
        preInit: function(opts) {
            opts.hideNonActive = false;

            opts.container.on('cycle-destroyed', $.proxy(this.onDestroy, opts.API));
            // override default API implementation
            opts.API.stopTransition = this.stopTransition;

            // issue #10
            for (var i = 0; i < opts.startingSlide; i++) {
                opts.container.append(opts.slides[0]);
            }
        },
        // transition API impl
        postInit: function(opts) {
            var i, j, slide, pagerCutoffIndex, wrap;
            var vert = opts.carouselVertical;
            if (opts.carouselVisible && opts.carouselVisible > opts.slideCount)
                opts.carouselVisible = opts.slideCount - 1;
            var visCount = opts.carouselVisible || opts.slides.length;
            var slideCSS = {display: vert ? 'block' : 'inline-block', position: 'static'};

            // required styles
            opts.container.css({position: 'relative', overflow: 'hidden'});
            opts.slides.css(slideCSS);

            opts._currSlide = opts.currSlide;

            // wrap slides in a div; this div is what is animated
            wrap = $('<div class="cycle-carousel-wrap"></div>')
                    .prependTo(opts.container)
                    .css({margin: 0, padding: 0, top: 0, left: 0, position: 'absolute'})
                    .append(opts.slides);

            opts._carouselWrap = wrap;

            if (!vert)
                wrap.css('white-space', 'nowrap');

            if (opts.allowWrap !== false) {
                // prepend and append extra slides so we don't see any empty space when we
                // near the end of the carousel.  for fluid containers, add even more clones
                // so there is plenty to fill the screen
                // @todo: optimzie this based on slide sizes

                for (j = 0; j < (opts.carouselVisible === undefined ? 2 : 1); j++) {
                    for (i = 0; i < opts.slideCount; i++) {
                        wrap.append(opts.slides[i].cloneNode(true));
                    }
                    i = opts.slideCount;
                    while (i--) { // #160, #209
                        wrap.prepend(opts.slides[i].cloneNode(true));
                    }
                }

                wrap.find('.cycle-slide-active').removeClass('cycle-slide-active');
                opts.slides.eq(opts.startingSlide).addClass('cycle-slide-active');
            }

            if (opts.pager && opts.allowWrap === false) {
                // hide "extra" pagers
                pagerCutoffIndex = opts.slideCount - visCount;
                $(opts.pager).children().filter(':gt(' + pagerCutoffIndex + ')').hide();
            }

            opts._nextBoundry = opts.slideCount - opts.carouselVisible;

            this.prepareDimensions(opts);
        },
        prepareDimensions: function(opts) {
            var dim, offset, pagerCutoffIndex, tmp;
            var vert = opts.carouselVertical;
            var visCount = opts.carouselVisible || opts.slides.length;

            if (opts.carouselFluid && opts.carouselVisible) {
                if (!opts._carouselResizeThrottle) {
                    // fluid container AND fluid slides; slides need to be resized to fit container
                    this.fluidSlides(opts);
                }
            }
            else if (opts.carouselVisible && opts.carouselSlideDimension) {
                dim = visCount * opts.carouselSlideDimension;
                opts.container[ vert ? 'height' : 'width' ](dim);
            }
            else if (opts.carouselVisible) {
                dim = visCount * $(opts.slides[0])[vert ? 'outerHeight' : 'outerWidth'](true);
                opts.container[ vert ? 'height' : 'width' ](dim);
            }
            // else {
            //     // fluid; don't size the container
            // }

            offset = (opts.carouselOffset || 0);
            if (opts.allowWrap !== false) {
                if (opts.carouselSlideDimension) {
                    offset -= ((opts.slideCount + opts.currSlide) * opts.carouselSlideDimension);
                }
                else {
                    // calculate offset based on actual slide dimensions
                    tmp = opts._carouselWrap.children();
                    for (var j = 0; j < (opts.slideCount + opts.currSlide); j++) {
                        offset -= $(tmp[j])[vert ? 'outerHeight' : 'outerWidth'](true);
                    }
                }
            }

            opts._carouselWrap.css(vert ? 'top' : 'left', offset);
        },
        fluidSlides: function(opts) {
            var timeout;
            var slide = opts.slides.eq(0);
            var adjustment = slide.outerWidth() - slide.width();
            var prepareDimensions = this.prepareDimensions;

            // throttle resize event
            $(window).on('resize', resizeThrottle);

            opts._carouselResizeThrottle = resizeThrottle;
            onResize();

            function resizeThrottle() {
                clearTimeout(timeout);
                timeout = setTimeout(onResize, 20);
            }

            function onResize() {
                opts._carouselWrap.stop(false, true);
                var slideWidth = opts.container.width() / opts.carouselVisible;
                slideWidth = Math.ceil(slideWidth - adjustment);
                opts._carouselWrap.children().width(slideWidth);
                if (opts._sentinel)
                    opts._sentinel.width(slideWidth);
                prepareDimensions(opts);
            }
        },
        // transition API impl
        transition: function(opts, curr, next, fwd, callback) {
            var moveBy, props = {};
            var hops = opts.nextSlide - opts.currSlide;
            var vert = opts.carouselVertical;
            var speed = opts.speed;

            // handle all the edge cases for wrapping & non-wrapping
            if (opts.allowWrap === false) {
                fwd = hops > 0;
                var currSlide = opts._currSlide;
                var maxCurr = opts.slideCount - opts.carouselVisible;
                if (hops > 0 && opts.nextSlide > maxCurr && currSlide == maxCurr) {
                    hops = 0;
                }
                else if (hops > 0 && opts.nextSlide > maxCurr) {
                    hops = opts.nextSlide - currSlide - (opts.nextSlide - maxCurr);
                }
                else if (hops < 0 && opts.currSlide > maxCurr && opts.nextSlide > maxCurr) {
                    hops = 0;
                }
                else if (hops < 0 && opts.currSlide > maxCurr) {
                    hops += opts.currSlide - maxCurr;
                }
                else
                    currSlide = opts.currSlide;

                moveBy = this.getScroll(opts, vert, currSlide, hops);
                opts.API.opts()._currSlide = opts.nextSlide > maxCurr ? maxCurr : opts.nextSlide;
            }
            else {
                if (fwd && opts.nextSlide === 0) {
                    // moving from last slide to first
                    moveBy = this.getDim(opts, opts.currSlide, vert);
                    callback = this.genCallback(opts, fwd, vert, callback);
                }
                else if (!fwd && opts.nextSlide == opts.slideCount - 1) {
                    // moving from first slide to last
                    moveBy = this.getDim(opts, opts.currSlide, vert);
                    callback = this.genCallback(opts, fwd, vert, callback);
                }
                else {
                    moveBy = this.getScroll(opts, vert, opts.currSlide, hops);
                }
            }

            props[ vert ? 'top' : 'left' ] = fwd ? ("-=" + moveBy) : ("+=" + moveBy);

            // throttleSpeed means to scroll slides at a constant rate, rather than
            // a constant speed
            if (opts.throttleSpeed)
                speed = (moveBy / $(opts.slides[0])[vert ? 'height' : 'width']()) * opts.speed;

            opts._carouselWrap.animate(props, speed, opts.easing, callback);
        },
        getDim: function(opts, index, vert) {
            var slide = $(opts.slides[index]);
            return slide[ vert ? 'outerHeight' : 'outerWidth'](true);
        },
        getScroll: function(opts, vert, currSlide, hops) {
            var i, moveBy = 0;

            if (hops > 0) {
                for (i = currSlide; i < currSlide + hops; i++)
                    moveBy += this.getDim(opts, i, vert);
            }
            else {
                for (i = currSlide; i > currSlide + hops; i--)
                    moveBy += this.getDim(opts, i, vert);
            }
            return moveBy;
        },
        genCallback: function(opts, fwd, vert, callback) {
            // returns callback fn that resets the left/top wrap position to the "real" slides
            return function() {
                var pos = $(opts.slides[opts.nextSlide]).position();
                var offset = 0 - pos[vert ? 'top' : 'left'] + (opts.carouselOffset || 0);
                opts._carouselWrap.css(opts.carouselVertical ? 'top' : 'left', offset);
                callback();
            };
        },
        // core API override
        stopTransition: function() {
            var opts = this.opts();
            opts.slides.stop(false, true);
            opts._carouselWrap.stop(false, true);
        },
        // core API supplement
        onDestroy: function(e) {
            var opts = this.opts();
            if (opts._carouselResizeThrottle)
                $(window).off('resize', opts._carouselResizeThrottle);
            opts.slides.prependTo(opts.container);
            opts._carouselWrap.remove();
        }
    };

})(jQuery);
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing,
        {
            def: 'easeOutQuad',
            swing: function(x, t, b, c, d) {
                //alert(jQuery.easing.default);
                return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
            },
            easeInQuad: function(x, t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOutQuad: function(x, t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOutQuad: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },
            easeInCubic: function(x, t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOutCubic: function(x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOutCubic: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },
            easeInQuart: function(x, t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOutQuart: function(x, t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOutQuart: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            easeInQuint: function(x, t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOutQuint: function(x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOutQuint: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },
            easeInSine: function(x, t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOutSine: function(x, t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOutSine: function(x, t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },
            easeInExpo: function(x, t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOutExpo: function(x, t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOutExpo: function(x, t, b, c, d) {
                if (t == 0)
                    return b;
                if (t == d)
                    return b + c;
                if ((t /= d / 2) < 1)
                    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function(x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOutCirc: function(x, t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOutCirc: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },
            easeInElastic: function(x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                }
                else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOutElastic: function(x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                }
                else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            easeInOutElastic: function(x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0)
                    return b;
                if ((t /= d / 2) == 2)
                    return b + c;
                if (!p)
                    p = d * (.3 * 1.5);
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                }
                else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1)
                    return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            },
            easeInBack: function(x, t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOutBack: function(x, t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOutBack: function(x, t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                if ((t /= d / 2) < 1)
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            easeInBounce: function(x, t, b, c, d) {
                return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
            },
            easeOutBounce: function(x, t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOutBounce: function(x, t, b, c, d) {
                if (t < d / 2)
                    return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
                return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        });

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
;
/*
 * jQuery EasyTabs plugin 3.2.0
 *
 * Copyright (c) 2010-2011 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Thu May 09 17:30:00 2013 -0500
 */

(function($) {

    $.easytabs = function(container, options) {

        // Attach to plugin anything that should be available via
        // the $container.data('easytabs') object
        var plugin = this,
                $container = $(container),
                defaults = {
            animate: true,
            panelActiveClass: "active",
            tabActiveClass: "active",
            defaultTab: "li:first-child",
            animationSpeed: "normal",
            tabs: "> ul > li",
            updateHash: true,
            cycle: false,
            collapsible: false,
            collapsedClass: "collapsed",
            collapsedByDefault: true,
            uiTabs: false,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            transitionInEasing: 'swing',
            transitionOutEasing: 'swing',
            transitionCollapse: 'slideUp',
            transitionUncollapse: 'slideDown',
            transitionCollapseEasing: 'swing',
            transitionUncollapseEasing: 'swing',
            containerClass: "",
            tabsClass: "",
            tabClass: "",
            panelClass: "",
            cache: true,
            event: 'click',
            panelContext: $container
        },
        // Internal instance variables
        // (not available via easytabs object)
        $defaultTab,
                $defaultTabLink,
                transitions,
                lastHash,
                skipUpdateToHash,
                animationSpeeds = {
            fast: 200,
            normal: 400,
            slow: 600
        },
        // Shorthand variable so that we don't need to call
        // plugin.settings throughout the plugin code
        settings;

        // =============================================================
        // Functions available via easytabs object
        // =============================================================

        plugin.init = function() {

            plugin.settings = settings = $.extend({}, defaults, options);
            settings.bind_str = settings.event + ".easytabs";

            // Add jQuery UI's crazy class names to markup,
            // so that markup will match theme CSS
            if (settings.uiTabs) {
                settings.tabActiveClass = 'ui-tabs-selected';
                settings.containerClass = 'ui-tabs ui-widget ui-widget-content ui-corner-all';
                settings.tabsClass = 'ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all';
                settings.tabClass = 'ui-state-default ui-corner-top';
                settings.panelClass = 'ui-tabs-panel ui-widget-content ui-corner-bottom';
            }

            // If collapsible is true and defaultTab specified, assume user wants defaultTab showing (not collapsed)
            if (settings.collapsible && options.defaultTab !== undefined && options.collpasedByDefault === undefined) {
                settings.collapsedByDefault = false;
            }

            // Convert 'normal', 'fast', and 'slow' animation speed settings to their respective speed in milliseconds
            if (typeof(settings.animationSpeed) === 'string') {
                settings.animationSpeed = animationSpeeds[settings.animationSpeed];
            }

            $('a.anchor').remove().prependTo('body');

            // Store easytabs object on container so we can easily set
            // properties throughout
            $container.data('easytabs', {});

            plugin.setTransitions();

            plugin.getTabs();

            addClasses();

            setDefaultTab();

            bindToTabClicks();

            initHashChange();

            initCycle();

            // Append data-easytabs HTML attribute to make easy to query for
            // easytabs instances via CSS pseudo-selector
            $container.attr('data-easytabs', true);
        };

        // Set transitions for switching between tabs based on options.
        // Could be used to update transitions if settings are changes.
        plugin.setTransitions = function() {
            transitions = (settings.animate) ? {
                show: settings.transitionIn,
                hide: settings.transitionOut,
                speed: settings.animationSpeed,
                collapse: settings.transitionCollapse,
                uncollapse: settings.transitionUncollapse,
                halfSpeed: settings.animationSpeed / 2
            } :
                    {
                        show: "show",
                        hide: "hide",
                        speed: 0,
                        collapse: "hide",
                        uncollapse: "show",
                        halfSpeed: 0
                    };
        };

        // Find and instantiate tabs and panels.
        // Could be used to reset tab and panel collection if markup is
        // modified.
        plugin.getTabs = function() {
            var $matchingPanel;

            // Find the initial set of elements matching the setting.tabs
            // CSS selector within the container
            plugin.tabs = $container.find(settings.tabs),
                    // Instantiate panels as empty jquery object
                    plugin.panels = $(),
                    plugin.tabs.each(function() {
                var $tab = $(this),
                        $a = $tab.children('a'),
                        // targetId is the ID of the panel, which is either the
                        // `href` attribute for non-ajax tabs, or in the
                        // `data-target` attribute for ajax tabs since the `href` is
                        // the ajax URL
                        targetId = $tab.children('a').data('target');
                if (!$a.length) {
                    return;
                }

                $tab.data('easytabs', {});

                // If the tab has a `data-target` attribute, and is thus an ajax tab
                if (targetId !== undefined && targetId !== null) {
                    $tab.data('easytabs').ajax = $a.attr('href');
                } else {
                    targetId = $a.attr('href');
                }

                var matchedTargetIds = (targetId) ? targetId.match(/#([^\?]+)/) : [];
                if (matchedTargetIds && matchedTargetIds.length > 0) {
                    targetId = targetId.match(/#([^\?]+)/)[1];
                    $matchingPanel = settings.panelContext.find("#" + targetId);
                }
                else {
                    $matchingPanel = [];
                }




                // If tab has a matching panel, add it to panels
                if ($matchingPanel.length > 0) {

                    // Store panel height before hiding
                    $matchingPanel.data('easytabs', {
                        position: $matchingPanel.css('position'),
                        visibility: $matchingPanel.css('visibility')
                    });

                    // Don't hide panel if it's active (allows `getTabs` to be called manually to re-instantiate tab collection)
                    $matchingPanel.not(settings.panelActiveClass).hide();

                    plugin.panels = plugin.panels.add($matchingPanel);

                    $tab.data('easytabs').panel = $matchingPanel;

                    // Otherwise, remove tab from tabs collection
                } else {
                    plugin.tabs = plugin.tabs.not($tab);
                    if ('console' in window) {
                        console.warn('Warning: tab without matching panel for selector \'#' + targetId + '\' removed from set');
                    }
                }
            });
        };

        // Select tab and fire callback
        plugin.selectTab = function($clicked, callback) {
            var url = window.location,
                    hash = url.hash.match(/^[^\?]*/)[0],
                    $targetPanel = $clicked.parent().data('easytabs').panel,
                    ajaxUrl = $clicked.parent().data('easytabs').ajax;

            // Tab is collapsible and active => toggle collapsed state
            if (settings.collapsible && !skipUpdateToHash && ($clicked.hasClass(settings.tabActiveClass) || $clicked.hasClass(settings.collapsedClass))) {
                plugin.toggleTabCollapse($clicked, $targetPanel, ajaxUrl, callback);

                // Tab is not active and panel is not active => select tab
            } else if (!$clicked.hasClass(settings.tabActiveClass) || !$targetPanel.hasClass(settings.panelActiveClass)) {
                activateTab($clicked, $targetPanel, ajaxUrl, callback);

                // Cache is disabled => reload (e.g reload an ajax tab).
            } else if (!settings.cache) {
                activateTab($clicked, $targetPanel, ajaxUrl, callback);
            }

        };

        // Toggle tab collapsed state and fire callback
        plugin.toggleTabCollapse = function($clicked, $targetPanel, ajaxUrl, callback) {
            plugin.panels.stop(true, true);

            if (fire($container, "easytabs:before", [$clicked, $targetPanel, settings])) {
                plugin.tabs.filter("." + settings.tabActiveClass).removeClass(settings.tabActiveClass).children().removeClass(settings.tabActiveClass);

                // If panel is collapsed, uncollapse it
                if ($clicked.hasClass(settings.collapsedClass)) {

                    // If ajax panel and not already cached
                    if (ajaxUrl && (!settings.cache || !$clicked.parent().data('easytabs').cached)) {
                        $container.trigger('easytabs:ajax:beforeSend', [$clicked, $targetPanel]);

                        $targetPanel.load(ajaxUrl, function(response, status, xhr) {
                            $clicked.parent().data('easytabs').cached = true;
                            $container.trigger('easytabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
                        });
                    }

                    // Update CSS classes of tab and panel
                    $clicked.parent()
                            .removeClass(settings.collapsedClass)
                            .addClass(settings.tabActiveClass)
                            .children()
                            .removeClass(settings.collapsedClass)
                            .addClass(settings.tabActiveClass);

                    $targetPanel
                            .addClass(settings.panelActiveClass)
                            [transitions.uncollapse](transitions.speed, settings.transitionUncollapseEasing, function() {
                        $container.trigger('easytabs:midTransition', [$clicked, $targetPanel, settings]);
                        if (typeof callback == 'function')
                            callback();
                    });

                    // Otherwise, collapse it
                } else {

                    // Update CSS classes of tab and panel
                    $clicked.addClass(settings.collapsedClass)
                            .parent()
                            .addClass(settings.collapsedClass);

                    $targetPanel
                            .removeClass(settings.panelActiveClass)
                            [transitions.collapse](transitions.speed, settings.transitionCollapseEasing, function() {
                        $container.trigger("easytabs:midTransition", [$clicked, $targetPanel, settings]);
                        if (typeof callback == 'function')
                            callback();
                    });
                }
            }
        };


        // Find tab with target panel matching value
        plugin.matchTab = function(hash) {
            return plugin.tabs.find("[href='" + hash + "'],[data-target='" + hash + "']").first();
        };

        // Find panel with `id` matching value
        plugin.matchInPanel = function(hash) {
            return (hash && plugin.validId(hash) ? plugin.panels.filter(':has(' + hash + ')').first() : []);
        };

        // Make sure hash is a valid id value (admittedly strict in that HTML5 allows almost anything without a space)
        // but jQuery has issues with such id values anyway, so we can afford to be strict here.
        plugin.validId = function(id) {
            return id.substr(1).match(/^[A-Za-z]+[A-Za-z0-9\-_:\.].$/);
        };

        // Select matching tab when URL hash changes
        plugin.selectTabFromHashChange = function() {
            var hash = window.location.hash.match(/^[^\?]*/)[0],
                    $tab = plugin.matchTab(hash),
                    $panel;

            if (settings.updateHash) {

                // If hash directly matches tab
                if ($tab.length) {
                    skipUpdateToHash = true;
                    plugin.selectTab($tab);

                } else {
                    $panel = plugin.matchInPanel(hash);

                    // If panel contains element matching hash
                    if ($panel.length) {
                        hash = '#' + $panel.attr('id');
                        $tab = plugin.matchTab(hash);
                        skipUpdateToHash = true;
                        plugin.selectTab($tab);

                        // If default tab is not active...
                    } else if (!$defaultTab.hasClass(settings.tabActiveClass) && !settings.cycle) {

                        // ...and hash is blank or matches a parent of the tab container or
                        // if the last tab (before the hash updated) was one of the other tabs in this container.
                        if (hash === '' || plugin.matchTab(lastHash).length || $container.closest(hash).length) {
                            skipUpdateToHash = true;
                            plugin.selectTab($defaultTabLink);
                        }
                    }
                }
            }
        };

        // Cycle through tabs
        plugin.cycleTabs = function(tabNumber) {
            if (settings.cycle) {
                tabNumber = tabNumber % plugin.tabs.length;
                $tab = $(plugin.tabs[tabNumber]).children("a").first();
                skipUpdateToHash = true;
                plugin.selectTab($tab, function() {
                    setTimeout(function() {
                        plugin.cycleTabs(tabNumber + 1);
                    }, settings.cycle);
                });
            }
        };

        // Convenient public methods
        plugin.publicMethods = {
            select: function(tabSelector) {
                var $tab;

                // Find tab container that matches selector (like 'li#tab-one' which contains tab link)
                if (($tab = plugin.tabs.filter(tabSelector)).length === 0) {

                    // Find direct tab link that matches href (like 'a[href="#panel-1"]')
                    if (($tab = plugin.tabs.find("a[href='" + tabSelector + "']")).length === 0) {

                        // Find direct tab link that matches selector (like 'a#tab-1')
                        if (($tab = plugin.tabs.find("a" + tabSelector)).length === 0) {

                            // Find direct tab link that matches data-target (lik 'a[data-target="#panel-1"]')
                            if (($tab = plugin.tabs.find("[data-target='" + tabSelector + "']")).length === 0) {

                                // Find direct tab link that ends in the matching href (like 'a[href$="#panel-1"]', which would also match http://example.com/currentpage/#panel-1)
                                if (($tab = plugin.tabs.find("a[href$='" + tabSelector + "']")).length === 0) {

                                    $.error('Tab \'' + tabSelector + '\' does not exist in tab set');
                                }
                            }
                        }
                    }
                } else {
                    // Select the child tab link, since the first option finds the tab container (like <li>)
                    $tab = $tab.children("a").first();
                }
                plugin.selectTab($tab);
            }
        };

        // =============================================================
        // Private functions
        // =============================================================

        // Triggers an event on an element and returns the event result
        var fire = function(obj, name, data) {
            var event = $.Event(name);
            obj.trigger(event, data);
            return event.result !== false;
        }

        // Add CSS classes to markup (if specified), called by init
        var addClasses = function() {
            $container.addClass(settings.containerClass);
            plugin.tabs.parent().addClass(settings.tabsClass);
            plugin.tabs.addClass(settings.tabClass);
            plugin.panels.addClass(settings.panelClass);
        };

        // Set the default tab, whether from hash (bookmarked) or option,
        // called by init
        var setDefaultTab = function() {
            var hash = window.location.hash.match(/^[^\?]*/)[0],
                    $selectedTab = plugin.matchTab(hash).parent(),
                    $panel;

            // If hash directly matches one of the tabs, active on page-load
            if ($selectedTab.length === 1) {
                $defaultTab = $selectedTab;
                settings.cycle = false;

            } else {
                $panel = plugin.matchInPanel(hash);

                // If one of the panels contains the element matching the hash,
                // make it active on page-load
                if ($panel.length) {
                    hash = '#' + $panel.attr('id');
                    $defaultTab = plugin.matchTab(hash).parent();

                    // Otherwise, make the default tab the one that's active on page-load
                } else {
                    $defaultTab = plugin.tabs.parent().find(settings.defaultTab);
                    if ($defaultTab.length === 0) {
                        $.error("The specified default tab ('" + settings.defaultTab + "') could not be found in the tab set ('" + settings.tabs + "') out of " + plugin.tabs.length + " tabs.");
                    }
                }
            }

            $defaultTabLink = $defaultTab.children("a").first();

            activateDefaultTab($selectedTab);
        };

        // Activate defaultTab (or collapse by default), called by setDefaultTab
        var activateDefaultTab = function($selectedTab) {
            var defaultPanel,
                    defaultAjaxUrl;

            if (settings.collapsible && $selectedTab.length === 0 && settings.collapsedByDefault) {
                $defaultTab
                        .addClass(settings.collapsedClass)
                        .children()
                        .addClass(settings.collapsedClass);

            } else {

                defaultPanel = $($defaultTab.data('easytabs').panel);
                defaultAjaxUrl = $defaultTab.data('easytabs').ajax;

                if (defaultAjaxUrl && (!settings.cache || !$defaultTab.data('easytabs').cached)) {
                    $container.trigger('easytabs:ajax:beforeSend', [$defaultTabLink, defaultPanel]);
                    defaultPanel.load(defaultAjaxUrl, function(response, status, xhr) {
                        $defaultTab.data('easytabs').cached = true;
                        $container.trigger('easytabs:ajax:complete', [$defaultTabLink, defaultPanel, response, status, xhr]);
                    });
                }

                $defaultTab.data('easytabs').panel
                        .show()
                        .addClass(settings.panelActiveClass);

                $defaultTab
                        .addClass(settings.tabActiveClass)
                        .children()
                        .addClass(settings.tabActiveClass);
            }

            // Fire event when the plugin is initialised
            $container.trigger("easytabs:initialised", [$defaultTabLink, defaultPanel]);
        };

        // Bind tab-select funtionality to namespaced click event, called by
        // init
        var bindToTabClicks = function() {
            plugin.tabs.children("a").bind(settings.bind_str, function(e) {

                // Stop cycling when a tab is clicked
                settings.cycle = false;

                // Hash will be updated when tab is clicked,
                // don't cause tab to re-select when hash-change event is fired
                skipUpdateToHash = false;

                // Select the panel for the clicked tab
                plugin.selectTab($(this));

                // Don't follow the link to the anchor
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            });
        };

        // Activate a given tab/panel, called from plugin.selectTab:
        //
        //   * fire `easytabs:before` hook
        //   * get ajax if new tab is an uncached ajax tab
        //   * animate out previously-active panel
        //   * fire `easytabs:midTransition` hook
        //   * update URL hash
        //   * animate in newly-active panel
        //   * update CSS classes for inactive and active tabs/panels
        //
        // TODO: This could probably be broken out into many more modular
        // functions
        var activateTab = function($clicked, $targetPanel, ajaxUrl, callback) {
            plugin.panels.stop(true, true);

            if (fire($container, "easytabs:before", [$clicked, $targetPanel, settings])) {
                var $visiblePanel = plugin.panels.filter(":visible"),
                        $panelContainer = $targetPanel.parent(),
                        targetHeight,
                        visibleHeight,
                        heightDifference,
                        showPanel,
                        hash = window.location.hash.match(/^[^\?]*/)[0];

                if (settings.animate) {
                    targetHeight = getHeightForHidden($targetPanel);
                    visibleHeight = $visiblePanel.length ? setAndReturnHeight($visiblePanel) : 0;
                    heightDifference = targetHeight - visibleHeight;
                }

                // Set lastHash to help indicate if defaultTab should be
                // activated across multiple tab instances.
                lastHash = hash;

                // TODO: Move this function elsewhere
                showPanel = function() {
                    // At this point, the previous panel is hidden, and the new one will be selected
                    $container.trigger("easytabs:midTransition", [$clicked, $targetPanel, settings]);

                    // Gracefully animate between panels of differing heights, start height change animation *after* panel change if panel needs to contract,
                    // so that there is no chance of making the visible panel overflowing the height of the target panel
                    if (settings.animate && settings.transitionIn == 'fadeIn') {
                        if (heightDifference < 0)
                            $panelContainer.animate({
                                height: $panelContainer.height() + heightDifference
                            }, transitions.halfSpeed).css({'min-height': ''});
                    }

                    if (settings.updateHash && !skipUpdateToHash) {
                        //window.location = url.toString().replace((url.pathname + hash), (url.pathname + $clicked.attr("href")));
                        // Not sure why this behaves so differently, but it's more straight forward and seems to have less side-effects
                        window.location.hash = '#' + $targetPanel.attr('id');
                    } else {
                        skipUpdateToHash = false;
                    }

                    $targetPanel
                            [transitions.show](transitions.speed, settings.transitionInEasing, function() {
                        $panelContainer.css({height: '', 'min-height': ''}); // After the transition, unset the height
                        $container.trigger("easytabs:after", [$clicked, $targetPanel, settings]);
                        // callback only gets called if selectTab actually does something, since it's inside the if block
                        if (typeof callback == 'function') {
                            callback();
                        }
                    });
                };

                if (ajaxUrl && (!settings.cache || !$clicked.parent().data('easytabs').cached)) {
                    $container.trigger('easytabs:ajax:beforeSend', [$clicked, $targetPanel]);
                    $targetPanel.load(ajaxUrl, function(response, status, xhr) {
                        $clicked.parent().data('easytabs').cached = true;
                        $container.trigger('easytabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
                    });
                }

                // Gracefully animate between panels of differing heights, start height change animation *before* panel change if panel needs to expand,
                // so that there is no chance of making the target panel overflowing the height of the visible panel
                if (settings.animate && settings.transitionOut == 'fadeOut') {
                    if (heightDifference > 0) {
                        $panelContainer.animate({
                            height: ($panelContainer.height() + heightDifference)
                        }, transitions.halfSpeed);
                    } else {
                        // Prevent height jumping before height transition is triggered at midTransition
                        $panelContainer.css({'min-height': $panelContainer.height()});
                    }
                }

                // Change the active tab *first* to provide immediate feedback when the user clicks
                plugin.tabs.filter("." + settings.tabActiveClass).removeClass(settings.tabActiveClass).children().removeClass(settings.tabActiveClass);
                plugin.tabs.filter("." + settings.collapsedClass).removeClass(settings.collapsedClass).children().removeClass(settings.collapsedClass);
                $clicked.parent().addClass(settings.tabActiveClass).children().addClass(settings.tabActiveClass);

                plugin.panels.filter("." + settings.panelActiveClass).removeClass(settings.panelActiveClass);
                $targetPanel.addClass(settings.panelActiveClass);

                if ($visiblePanel.length) {
                    $visiblePanel
                            [transitions.hide](transitions.speed, settings.transitionOutEasing, showPanel);
                } else {
                    $targetPanel
                            [transitions.uncollapse](transitions.speed, settings.transitionUncollapseEasing, showPanel);
                }
            }
        };

        // Get heights of panels to enable animation between panels of
        // differing heights, called by activateTab
        var getHeightForHidden = function($targetPanel) {

            if ($targetPanel.data('easytabs') && $targetPanel.data('easytabs').lastHeight) {
                return $targetPanel.data('easytabs').lastHeight;
            }

            // this is the only property easytabs changes, so we need to grab its value on each tab change
            var display = $targetPanel.css('display'),
                    outerCloak,
                    height;

            // Workaround with wrapping height, because firefox returns wrong
            // height if element itself has absolute positioning.
            // but try/catch block needed for IE7 and IE8 because they throw
            // an "Unspecified error" when trying to create an element
            // with the css position set.
            try {
                outerCloak = $('<div></div>', {'position': 'absolute', 'visibility': 'hidden', 'overflow': 'hidden'});
            } catch (e) {
                outerCloak = $('<div></div>', {'visibility': 'hidden', 'overflow': 'hidden'});
            }
            height = $targetPanel
                    .wrap(outerCloak)
                    .css({'position': 'relative', 'visibility': 'hidden', 'display': 'block'})
                    .outerHeight();

            $targetPanel.unwrap();

            // Return element to previous state
            $targetPanel.css({
                position: $targetPanel.data('easytabs').position,
                visibility: $targetPanel.data('easytabs').visibility,
                display: display
            });

            // Cache height
            $targetPanel.data('easytabs').lastHeight = height;

            return height;
        };

        // Since the height of the visible panel may have been manipulated due to interaction,
        // we want to re-cache the visible height on each tab change, called
        // by activateTab
        var setAndReturnHeight = function($visiblePanel) {
            var height = $visiblePanel.outerHeight();

            if ($visiblePanel.data('easytabs')) {
                $visiblePanel.data('easytabs').lastHeight = height;
            } else {
                $visiblePanel.data('easytabs', {lastHeight: height});
            }
            return height;
        };

        // Setup hash-change callback for forward- and back-button
        // functionality, called by init
        var initHashChange = function() {

            // enabling back-button with jquery.hashchange plugin
            // http://benalman.com/projects/jquery-hashchange-plugin/
            if (typeof $(window).hashchange === 'function') {
                $(window).hashchange(function() {
                    plugin.selectTabFromHashChange();
                });
            } else if ($.address && typeof $.address.change === 'function') { // back-button with jquery.address plugin http://www.asual.com/jquery/address/docs/
                $.address.change(function() {
                    plugin.selectTabFromHashChange();
                });
            }
        };

        // Begin cycling if set in options, called by init
        var initCycle = function() {
            var tabNumber;
            if (settings.cycle) {
                tabNumber = plugin.tabs.index($defaultTab);
                setTimeout(function() {
                    plugin.cycleTabs(tabNumber + 1);
                }, settings.cycle);
            }
        };


        plugin.init();

    };

    $.fn.easytabs = function(options) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this),
                    plugin = $this.data('easytabs');

            // Initialization was called with $(el).easytabs( { options } );
            if (undefined === plugin) {
                plugin = new $.easytabs(this, options);
                $this.data('easytabs', plugin);
            }

            // User called public method
            if (typeof plugin != 'undefined' && plugin.publicMethods[options]) {
                return plugin.publicMethods[options](Array.prototype.slice.call(args, 1));
            }
        });
    };

})(jQuery);
/*jshint undef: true */
/*global jQuery: true */

/*
 --------------------------------
 Infinite Scroll
 --------------------------------
 + https://github.com/paulirish/infinite-scroll
 + version 2.0b2.120519
 + Copyright 2011/12 Paul Irish & Luke Shumard
 + Licensed under the MIT license
 
 + Documentation: http://infinite-scroll.com/
 */


(function(window, $, undefined) {
    "use strict";

    $.infinitescroll = function infscr(options, callback, element) {
        this.element = $(element);

        // Flag the object in the event of a failed creation
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.infinitescroll.defaults = {
        loading: {
            finished: undefined,
            finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
            img: "data:image/gif;base64,R0lGODlh3AATAPQeAPDy+MnQ6LW/4N3h8MzT6rjC4sTM5r/I5NHX7N7j8c7U6tvg8OLl8uXo9Ojr9b3G5MfP6Ovu9tPZ7PT1+vX2+tbb7vf4+8/W69jd7rC73vn5/O/x+K243ai02////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgD/ACwAAAAA3AATAAAF/6AnjmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEj0BAScpHLJbDqf0Kh0Sq1ar9isdioItAKGw+MAKYMFhbF63CW438f0mg1R2O8EuXj/aOPtaHx7fn96goR4hmuId4qDdX95c4+RBIGCB4yAjpmQhZN0YGYGXitdZBIVGAsLoq4BBKQDswm1CQRkcG6ytrYKubq8vbfAcMK9v7q7EMO1ycrHvsW6zcTKsczNz8HZw9vG3cjTsMIYqQkCLBwHCgsMDQ4RDAYIqfYSFxDxEfz88/X38Onr16+Bp4ADCco7eC8hQYMAEe57yNCew4IVBU7EGNDiRn8Z831cGLHhSIgdFf9chIeBg7oA7gjaWUWTVQAGE3LqBDCTlc9WOHfm7PkTqNCh54rePDqB6M+lR536hCpUqs2gVZM+xbrTqtGoWqdy1emValeXKzggYBBB5y1acFNZmEvXAoN2cGfJrTv3bl69Ffj2xZt3L1+/fw3XRVw4sGDGcR0fJhxZsF3KtBTThZxZ8mLMgC3fRatCbYMNFCzwLEqLgE4NsDWs/tvqdezZf13Hvk2A9Szdu2X3pg18N+68xXn7rh1c+PLksI/Dhe6cuO3ow3NfV92bdArTqC2Ebd3A8vjf5QWfH6Bg7Nz17c2fj69+fnq+8N2Lty+fuP78/eV2X13neIcCeBRwxorbZrA1ANoCDGrgoG8RTshahQ9iSKEEzUmYIYfNWViUhheCGJyIP5E4oom7WWjgCeBFAJNv1DVV01MAdJhhjdkplWNzO/5oXI846njjVEIqR2OS2B1pE5PVscajkxhMycqLJghQSwT40PgfAl4GqNSXYdZXJn5gSkmmmmJu1aZYb14V51do+pTOCmA40AqVCIhG5IJ9PvYnhIFOxmdqhpaI6GeHCtpooisuutmg+Eg62KOMKuqoTaXgicQWoIYq6qiklmoqFV0UoeqqrLbq6quwxirrrLTWauutJ4QAACH5BAUKABwALAcABADOAAsAAAX/IPd0D2dyRCoUp/k8gpHOKtseR9yiSmGbuBykler9XLAhkbDavXTL5k2oqFqNOxzUZPU5YYZd1XsD72rZpBjbeh52mSNnMSC8lwblKZGwi+0QfIJ8CncnCoCDgoVnBHmKfByGJimPkIwtiAeBkH6ZHJaKmCeVnKKTHIihg5KNq4uoqmEtcRUtEREMBggtEr4QDrjCuRC8h7/BwxENeicSF8DKy82pyNLMOxzWygzFmdvD2L3P0dze4+Xh1Arkyepi7dfFvvTtLQkZBC0T/FX3CRgCMOBHsJ+EHYQY7OinAGECgQsB+Lu3AOK+CewcWjwxQeJBihtNGHSoQOE+iQ3//4XkwBBhRZMcUS6YSXOAwIL8PGqEaSJCiYt9SNoCmnJPAgUVLChdaoFBURN8MAzl2PQphwQLfDFd6lTowglHve6rKpbjhK7/pG5VinZP1qkiz1rl4+tr2LRwWU64cFEihwEtZgbgR1UiHaMVvxpOSwBA37kzGz9e8G+B5MIEKLutOGEsAH2ATQwYfTmuX8aETWdGPZmiZcccNSzeTCA1Sw0bdiitC7LBWgu8jQr8HRzqgpK6gX88QbrB14z/kF+ELpwB8eVQj/JkqdylAudji/+ts3039vEEfK8Vz2dlvxZKG0CmbkKDBvllRd6fCzDvBLKBDSCeffhRJEFebFk1k/Mv9jVIoIJZSeBggwUaNeB+Qk34IE0cXlihcfRxkOAJFFhwGmKlmWDiakZhUJtnLBpnWWcnKaAZcxI0piFGGLBm1mc90kajSCveeBVWKeYEoU2wqeaQi0PetoE+rr14EpVC7oAbAUHqhYExbn2XHHsVqbcVew9tx8+XJKk5AZsqqdlddGpqAKdbAYBn1pcczmSTdWvdmZ17c1b3FZ99vnTdCRFM8OEcAhLwm1NdXnWcBBSMRWmfkWZqVlsmLIiAp/o1gGV2vpS4lalGYsUOqXrddcKCmK61aZ8SjEpUpVFVoCpTj4r661Km7kBHjrDyc1RAIQAAIfkEBQoAGwAsBwAEAM4ACwAABf/gtmUCd4goQQgFKj6PYKi0yrrbc8i4ohQt12EHcal+MNSQiCP8gigdz7iCioaCIvUmZLp8QBzW0EN2vSlCuDtFKaq4RyHzQLEKZNdiQDhRDVooCwkbfm59EAmKi4SGIm+AjIsKjhsqB4mSjT2IOIOUnICeCaB/mZKFNTSRmqVpmJqklSqskq6PfYYCDwYHDC4REQwGCBLGxxIQDsHMwhAIX8bKzcENgSLGF9PU1j3Sy9zX2NrgzQziChLk1BHWxcjf7N046tvN82715czn9Pryz6Ilc4ACj4EBOCZM8KEnAYYADBRKnACAYUMFv1wotIhCEcaJCisqwJFgAUSQGyX/kCSVUUTIdKMwJlyo0oXHlhskwrTJciZHEXsgaqS4s6PJiCAr1uzYU8kBBSgnWFqpoMJMUjGtDmUwkmfVmVypakWhEKvXsS4nhLW5wNjVroJIoc05wSzTr0PtiigpYe4EC2vj4iWrFu5euWIMRBhacaVJhYQBEFjA9jHjyQ0xEABwGceGAZYjY0YBOrRLCxUp29QM+bRkx5s7ZyYgVbTqwwti2ybJ+vLtDYpycyZbYOlptxdx0kV+V7lC5iJAyyRrwYKxAdiz82ng0/jnAdMJFz0cPi104Ec1Vj9/M6F173vKL/feXv156dw11tlqeMMnv4V5Ap53GmjQQH97nFfg+IFiucfgRX5Z8KAgbUlQ4IULIlghhhdOSB6AgX0IVn8eReghen3NRIBsRgnH4l4LuEidZBjwRpt6NM5WGwoW0KSjCwX6yJSMab2GwwAPDXfaBCtWpluRTQqC5JM5oUZAjUNS+VeOLWpJEQ7VYQANW0INJSZVDFSnZphjSikfmzE5N4EEbQI1QJmnWXCmHulRp2edwDXF43txukenJwvI9xyg9Q26Z3MzGUcBYFEChZh6DVTq34AU8Iflh51Sd+CnKFYQ6mmZkhqfBKfSxZWqA9DZanWjxmhrWwi0qtCrt/43K6WqVjjpmhIqgEGvculaGKklKstAACEAACH5BAUKABwALAcABADOAAsAAAX/ICdyQmaMYyAUqPgIBiHPxNpy79kqRXH8wAPsRmDdXpAWgWdEIYm2llCHqjVHU+jjJkwqBTecwItShMXkEfNWSh8e1NGAcLgpDGlRgk7EJ/6Ae3VKfoF/fDuFhohVeDeCfXkcCQqDVQcQhn+VNDOYmpSWaoqBlUSfmowjEA+iEAEGDRGztAwGCDcXEA60tXEiCrq8vREMEBLIyRLCxMWSHMzExnbRvQ2Sy7vN0zvVtNfU2tLY3rPgLdnDvca4VQS/Cpk3ABwSLQkYAQwT/P309vcI7OvXr94jBQMJ/nskkGA/BQBRLNDncAIAiDcG6LsxAWOLiQzmeURBKWSLCQbv/1F0eDGinJUKR47YY1IEgQASKk7Yc7ACRwZm7mHweRJoz59BJUogisKCUaFMR0x4SlJBVBFTk8pZivTR0K73rN5wqlXEAq5Fy3IYgHbEzQ0nLy4QSoCjXLoom96VOJEeCosK5n4kkFfqXjl94wa+l1gvAcGICbewAOAxY8l/Ky/QhAGz4cUkGxu2HNozhwMGBnCUqUdBg9UuW9eUynqSwLHIBujePef1ZGQZXcM+OFuEBeBhi3OYgLyqcuaxbT9vLkf4SeqyWxSQpKGB2gQpm1KdWbu72rPRzR9Ne2Nu9Kzr/1Jqj0yD/fvqP4aXOt5sW/5qsXXVcv1Nsp8IBUAmgswGF3llGgeU1YVXXKTN1FlhWFXW3gIE+DVChApysACHHo7Q4A35lLichh+ROBmLKAzgYmYEYDAhCgxKGOOMn4WR4kkDaoBBOxJtdNKQxFmg5JIWIBnQc07GaORfUY4AEkdV6jHlCEISSZ5yTXpp1pbGZbkWmcuZmQCaE6iJ0FhjMaDjTMsgZaNEHFRAQVp3bqXnZED1qYcECOz5V6BhSWCoVJQIKuKQi2KFKEkEFAqoAo7uYSmO3jk61wUUMKmknJ4SGimBmAa0qVQBhAAAIfkEBQoAGwAsBwAEAM4ACwAABf/gJm5FmRlEqhJC+bywgK5pO4rHI0D3pii22+Mg6/0Ej96weCMAk7cDkXf7lZTTnrMl7eaYoy10JN0ZFdco0XAuvKI6qkgVFJXYNwjkIBcNBgR8TQoGfRsJCRuCYYQQiI+ICosiCoGOkIiKfSl8mJkHZ4U9kZMbKaI3pKGXmJKrngmug4WwkhA0lrCBWgYFCCMQFwoQDRHGxwwGCBLMzRLEx8iGzMMO0cYNeCMKzBDW19lnF9DXDIY/48Xg093f0Q3s1dcR8OLe8+Y91OTv5wrj7o7B+7VNQqABIoRVCMBggsOHE36kSoCBIcSH3EbFangxogJYFi8CkJhqQciLJEf/LDDJEeJIBT0GsOwYUYJGBS0fjpQAMidGmyVP6sx4Y6VQhzs9VUwkwqaCCh0tmKoFtSMDmBOf9phg4SrVrROuasRQAaxXpVUhdsU6IsECZlvX3kwLUWzRt0BHOLTbNlbZG3vZinArge5Dvn7wbqtQkSYAAgtKmnSsYKVKo2AfW048uaPmG386i4Q8EQMBAIAnfB7xBxBqvapJ9zX9WgRS2YMpnvYMGdPK3aMjt/3dUcNI4blpj7iwkMFWDXDvSmgAlijrt9RTR78+PS6z1uAJZIe93Q8g5zcsWCi/4Y+C8bah5zUv3vv89uft30QP23punGCx5954oBBwnwYaNCDY/wYrsYeggnM9B2Fpf8GG2CEUVWhbWAtGouEGDy7Y4IEJVrbSiXghqGKIo7z1IVcXIkKWWR361QOLWWnIhwERpLaaCCee5iMBGJQmJGyPFTnbkfHVZGRtIGrg5HALEJAZbu39BuUEUmq1JJQIPtZilY5hGeSWsSk52G9XqsmgljdIcABytq13HyIM6RcUA+r1qZ4EBF3WHWB29tBgAzRhEGhig8KmqKFv8SeCeo+mgsF7YFXa1qWSbkDpom/mqR1PmHCqJ3fwNRVXjC7S6CZhFVCQ2lWvZiirhQq42SACt25IK2hv8TprriUV1usGgeka7LFcNmCldMLi6qZMgFLgpw16Cipb7bC1knXsBiEAACH5BAUKABsALAcABADOAAsAAAX/4FZsJPkUmUGsLCEUTywXglFuSg7fW1xAvNWLF6sFFcPb42C8EZCj24EJdCp2yoegWsolS0Uu6fmamg8n8YYcLU2bXSiRaXMGvqV6/KAeJAh8VgZqCX+BexCFioWAYgqNi4qAR4ORhRuHY408jAeUhAmYYiuVlpiflqGZa5CWkzc5fKmbbhIpsAoQDRG8vQwQCBLCwxK6vb5qwhfGxxENahvCEA7NzskSy7vNzzzK09W/PNHF1NvX2dXcN8K55cfh69Luveol3vO8zwi4Yhj+AQwmCBw4IYclDAAJDlQggVOChAoLKkgFkSCAHDwWLKhIEOONARsDKryogFPIiAUb/95gJNIiw4wnI778GFPhzBKFOAq8qLJEhQpiNArjMcHCmlTCUDIouTKBhApELSxFWiGiVKY4E2CAekPgUphDu0742nRrVLJZnyrFSqKQ2ohoSYAMW6IoDpNJ4bLdILTnAj8KUF7UeENjAKuDyxIgOuGiOI0EBBMgLNew5AUrDTMGsFixwBIaNCQuAXJB57qNJ2OWm2Aj4skwCQCIyNkhhtMkdsIuodE0AN4LJDRgfLPtn5YDLdBlraAByuUbBgxQwICxMOnYpVOPej074OFdlfc0TqC62OIbcppHjV4o+LrieWhfT8JC/I/T6W8oCl29vQ0XjLdBaA3s1RcPBO7lFvpX8BVoG4O5jTXRQRDuJ6FDTzEWF1/BCZhgbyAKE9qICYLloQYOFtahVRsWYlZ4KQJHlwHS/IYaZ6sZd9tmu5HQm2xi1UaTbzxYwJk/wBF5g5EEYOBZeEfGZmNdFyFZmZIR4jikbLThlh5kUUVJGmRT7sekkziRWUIACABk3T4qCsedgO4xhgGcY7q5pHJ4klBBTQRJ0CeHcoYHHUh6wgfdn9uJdSdMiebGJ0zUPTcoS286FCkrZxnYoYYKWLkBowhQoBeaOlZAgVhLidrXqg2GiqpQpZ4apwSwRtjqrB3muoF9BboaXKmshlqWqsWiGt2wphJkQbAU5hoCACH5BAUKABsALAcABADOAAsAAAX/oGFw2WZuT5oZROsSQnGaKjRvilI893MItlNOJ5v5gDcFrHhKIWcEYu/xFEqNv6B1N62aclysF7fsZYe5aOx2yL5aAUGSaT1oTYMBwQ5VGCAJgYIJCnx1gIOBhXdwiIl7d0p2iYGQUAQBjoOFSQR/lIQHnZ+Ue6OagqYzSqSJi5eTpTxGcjcSChANEbu8DBAIEsHBChe5vL13G7fFuscRDcnKuM3H0La3EA7Oz8kKEsXazr7Cw9/Gztar5uHHvte47MjktznZ2w0G1+D3BgirAqJmJMAQgMGEgwgn5Ei0gKDBhBMALGRYEOJBb5QcWlQo4cbAihZz3GgIMqFEBSM1/4ZEOWPAgpIIJXYU+PIhRG8ja1qU6VHlzZknJNQ6UanCjQkWCIGSUGEjAwVLjc44+DTqUQtPPS5gejUrTa5TJ3g9sWCr1BNUWZI161StiQUDmLYdGfesibQ3XMq1OPYthrwuA2yU2LBs2cBHIypYQPPlYAKFD5cVvNPtW8eVGbdcQADATsiNO4cFAPkvHpedPzc8kUcPgNGgZ5RNDZG05reoE9s2vSEP79MEGiQGy1qP8LA4ZcdtsJE48ONoLTBtTV0B9LsTnPceoIDBDQvS7W7vfjVY3q3eZ4A339J4eaAmKqU/sV58HvJh2RcnIBsDUw0ABqhBA5aV5V9XUFGiHfVeAiWwoFgJJrIXRH1tEMiDFV4oHoAEGlaWhgIGSGBO2nFomYY3mKjVglidaNYJGJDkWW2xxTfbjCbVaOGNqoX2GloR8ZeTaECS9pthRGJH2g0b3Agbk6hNANtteHD2GJUucfajCQBy5OOTQ25ZgUPvaVVQmbKh9510/qQpwXx3SQdfk8tZJOd5b6JJFplT3ZnmmX3qd5l1eg5q00HrtUkUn0AKaiGjClSAgKLYZcgWXwocGRcCFGCKwSB6ceqphwmYRUFYT/1WKlOdUpipmxW0mlCqHjYkAaeoZlqrqZ4qd+upQKaapn/AmgAegZ8KUtYtFAQQAgAh+QQFCgAbACwHAAQAzgALAAAF/+C2PUcmiCiZGUTrEkKBis8jQEquKwU5HyXIbEPgyX7BYa5wTNmEMwWsSXsqFbEh8DYs9mrgGjdK6GkPY5GOeU6ryz7UFopSQEzygOGhJBjoIgMDBAcBM0V/CYqLCQqFOwobiYyKjn2TlI6GKC2YjJZknouaZAcQlJUHl6eooJwKooobqoewrJSEmyKdt59NhRKFMxLEEA4RyMkMEAjDEhfGycqAG8TQx9IRDRDE3d3R2ctD1RLg0ttKEnbY5wZD3+zJ6M7X2RHi9Oby7u/r9g38UFjTh2xZJBEBMDAboogAgwkQI07IMUORwocSJwCgWDFBAIwZOaJIsOBjRogKJP8wTODw5ESVHVtm3AhzpEeQElOuNDlTZ0ycEUWKWFASqEahGwYUPbnxoAgEdlYSqDBkgoUNClAlIHbSAoOsqCRQnQHxq1axVb06FWFxLIqyaze0Tft1JVqyE+pWXMD1pF6bYl3+HTqAWNW8cRUFzmih0ZAAB2oGKukSAAGGRHWJgLiR6AylBLpuHKKUMlMCngMpDSAa9QIUggZVVvDaJobLeC3XZpvgNgCmtPcuwP3WgmXSq4do0DC6o2/guzcseECtUoO0hmcsGKDgOt7ssBd07wqesAIGZC1YIBa7PQHvb1+SFo+++HrJSQfB33xfav3i5eX3Hnb4CTJgegEq8tH/YQEOcIJzbm2G2EoYRLgBXFpVmFYDcREV4HIcnmUhiGBRouEMJGJGzHIspqgdXxK0yCKHRNXoIX4uorCdTyjkyNtdPWrA4Up82EbAbzMRxxZRR54WXVLDIRmRcag5d2R6ugl3ZXzNhTecchpMhIGVAKAYpgJjjsSklBEd99maZoo535ZvdamjBEpusJyctg3h4X8XqodBMx0tiNeg/oGJaKGABpogS40KSqiaEgBqlQWLUtqoVQnytekEjzo0hHqhRorppOZt2p923M2AAV+oBtpAnnPNoB6HaU6mAAIU+IXmi3j2mtFXuUoHKwXpzVrsjcgGOauKEjQrwq157hitGq2NoWmjh7z6Wmxb0m5w66+2VRAuXN/yFUAIACH5BAUKABsALAcABADOAAsAAAX/4CZuRiaM45MZqBgIRbs9AqTcuFLE7VHLOh7KB5ERdjJaEaU4ClO/lgKWjKKcMiJQ8KgumcieVdQMD8cbBeuAkkC6LYLhOxoQ2PF5Ys9PKPBMen17f0CCg4VSh32JV4t8jSNqEIOEgJKPlkYBlJWRInKdiJdkmQlvKAsLBxdABA4RsbIMBggtEhcQsLKxDBC2TAS6vLENdJLDxMZAubu8vjIbzcQRtMzJz79S08oQEt/guNiyy7fcvMbh4OezdAvGrakLAQwyABsELQkY9BP+//ckyPDD4J9BfAMh1GsBoImMeQUN+lMgUJ9CiRMa5msxoB9Gh/o8GmxYMZXIgxtR/yQ46S/gQAURR0pDwYDfywoyLPip5AdnCwsMFPBU4BPFhKBDi444quCmDKZOfwZ9KEGpCKgcN1jdALSpPqIYsabS+nSqvqplvYqQYAeDPgwKwjaMtiDl0oaqUAyo+3TuWwUAMPpVCfee0cEjVBGQq2ABx7oTWmQk4FglZMGN9fGVDMCuiH2AOVOu/PmyxM630gwM0CCn6q8LjVJ8GXvpa5Uwn95OTC/nNxkda1/dLSK475IjCD6dHbK1ZOa4hXP9DXs5chJ00UpVm5xo2qRpoxptwF2E4/IbJpB/SDz9+q9b1aNfQH08+p4a8uvX8B53fLP+ycAfemjsRUBgp1H20K+BghHgVgt1GXZXZpZ5lt4ECjxYR4ScUWiShEtZqBiIInRGWnERNnjiBglw+JyGnxUmGowsyiiZg189lNtPGACjV2+S9UjbU0JWF6SPvEk3QZEqsZYTk3UAaRSUnznJI5LmESCdBVSyaOWUWLK4I5gDUYVeV1T9l+FZClCAUVA09uSmRHBCKAECFEhW51ht6rnmWBXkaR+NjuHpJ40D3DmnQXt2F+ihZxlqVKOfQRACACH5BAUKABwALAcABADOAAsAAAX/ICdyUCkUo/g8mUG8MCGkKgspeC6j6XEIEBpBUeCNfECaglBcOVfJFK7YQwZHQ6JRZBUqTrSuVEuD3nI45pYjFuWKvjjSkCoRaBUMWxkwBGgJCXspQ36Bh4EEB0oKhoiBgyNLjo8Ki4QElIiWfJqHnISNEI+Ql5J9o6SgkqKkgqYihamPkW6oNBgSfiMMDQkGCBLCwxIQDhHIyQwQCGMKxsnKVyPCF9DREQ3MxMPX0cu4wt7J2uHWx9jlKd3o39MiuefYEcvNkuLt5O8c1ePI2tyELXGQwoGDAQf+iEC2xByDCRAjTlAgIUWCBRgCPJQ4AQBFXAs0coT40WLIjRxL/47AcHLkxIomRXL0CHPERZkpa4q4iVKiyp0tR/7kwHMkTUBBJR5dOCEBAVcKKtCAyOHpowXCpk7goABqBZdcvWploACpBKkpIJI1q5OD2rIWE0R1uTZu1LFwbWL9OlKuWb4c6+o9i3dEgw0RCGDUG9KlRw56gDY2qmCByZBaASi+TACA0TucAaTteCcy0ZuOK3N2vJlx58+LRQyY3Xm0ZsgjZg+oPQLi7dUcNXi0LOJw1pgNtB7XG6CBy+U75SYfPTSQAgZTNUDnQHt67wnbZyvwLgKiMN3oCZB3C76tdewpLFgIP2C88rbi4Y+QT3+8S5USMICZXWj1pkEDeUU3lOYGB3alSoEiMIjgX4WlgNF2EibIwQIXauWXSRg2SAOHIU5IIIMoZkhhWiJaiFVbKo6AQEgQXrTAazO1JhkBrBG3Y2Y6EsUhaGn95hprSN0oWpFE7rhkeaQBchGOEWnwEmc0uKWZj0LeuNV3W4Y2lZHFlQCSRjTIl8uZ+kG5HU/3sRlnTG2ytyadytnD3HrmuRcSn+0h1dycexIK1KCjYaCnjCCVqOFFJTZ5GkUUjESWaUIKU2lgCmAKKQIUjHapXRKE+t2og1VgankNYnohqKJ2CmKplso6GKz7WYCgqxeuyoF8u9IQAgA7",
            msg: null,
            msgText: "<em>Loading the next set of posts...</em>",
            selector: null,
            speed: 'fast',
            start: undefined
        },
        state: {
            isDuringAjax: false,
            isInvalidPage: false,
            isDestroyed: false,
            isDone: false, // For when it goes all the way through the archive.
            isPaused: false,
            isBeyondMaxPage: false,
            currPage: 1
        },
        debug: false,
        behavior: undefined,
        binder: $(window), // used to cache the selector
        nextSelector: "div.navigation a:first",
        navSelector: "div.navigation",
        contentSelector: null, // rename to pageFragment
        extraScrollPx: 150,
        itemSelector: "div.post",
        animate: false,
        pathParse: undefined,
        dataType: 'html',
        appendCallback: true,
        bufferPx: 40,
        errorCallback: function() {
        },
        infid: 0, //Instance ID
        pixelsFromNavToBottom: undefined,
        path: undefined, // Either parts of a URL as an array (e.g. ["/page/", "/"] or a function that takes in the page number and returns a URL
        prefill: false, // When the document is smaller than the window, load data until the document is larger or links are exhausted
        maxPage: undefined // to manually control maximum page (when maxPage is undefined, maximum page limitation is not work)
    };

    $.infinitescroll.prototype = {
        /*	
         ----------------------------
         Private methods
         ----------------------------
         */

        // Bind or unbind from scroll
        _binding: function infscr_binding(binding) {

            var instance = this,
                    opts = instance.options;

            opts.v = '2.0b2.120520';

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_binding_' + opts.behavior] !== undefined) {
                this['_binding_' + opts.behavior].call(this);
                return;
            }

            if (binding !== 'bind' && binding !== 'unbind') {
                this._debug('Binding value  ' + binding + ' not valid');
                return false;
            }

            if (binding === 'unbind') {
                (this.options.binder).unbind('smartscroll.infscr.' + instance.options.infid);
            } else {
                (this.options.binder)[binding]('smartscroll.infscr.' + instance.options.infid, function() {
                    instance.scroll();
                });
            }

            this._debug('Binding', binding);
        },
        // Fundamental aspects of the plugin are initialized
        _create: function infscr_create(options, callback) {

            // Add custom options to defaults
            var opts = $.extend(true, {}, $.infinitescroll.defaults, options);
            this.options = opts;
            var $window = $(window);
            var instance = this;

            // Validate selectors
            if (!instance._validate(options)) {
                return false;
            }

            // Validate page fragment path
            var path = $(opts.nextSelector).attr('href');

            if (path === false) {

                this._debug('Navigation selector not found');
                return false;
            }

            // Set the path to be a relative URL from root.
            opts.path = opts.path || this._determinepath(path);

            // contentSelector is 'page fragment' option for .load() / .ajax() calls
            opts.contentSelector = opts.contentSelector || this.element;

            // loading.selector - if we want to place the load message in a specific selector, defaulted to the contentSelector
            opts.loading.selector = opts.loading.selector || opts.contentSelector;

            // Define loading.msg
            opts.loading.msg = opts.loading.msg || $('<div id="infscr-loading"><img alt="Loading..." src="' + opts.loading.img + '" /><div>' + opts.loading.msgText + '</div></div>');

            // Preload loading.img
            (new Image()).src = opts.loading.img;

            // distance from nav links to bottom
            // computed as: height of the document + top offset of container - top offset of nav link
            if (opts.pixelsFromNavToBottom === undefined) {
                opts.pixelsFromNavToBottom = $(document).height() - $(opts.navSelector).offset().top;
                this._debug("pixelsFromNavToBottom: " + opts.pixelsFromNavToBottom);
            }

            var self = this;

            // determine loading.start actions
            opts.loading.start = opts.loading.start || function() {
                $(opts.navSelector).hide();
                opts.loading.msg
                        .appendTo(opts.loading.selector)
                        .fadeIn(opts.loading.speed, $.proxy(function() {
                    this.beginAjax(opts);
                }, self));
            };

            // determine loading.finished actions
            opts.loading.finished = opts.loading.finished || function() {
                if (!opts.state.isBeyondMaxPage)
                    opts.loading.msg.fadeOut(opts.loading.speed);
            };

            // callback loading
            opts.callback = function(instance, data, url) {
                if (!!opts.behavior && instance['_callback_' + opts.behavior] !== undefined) {
                    instance['_callback_' + opts.behavior].call($(opts.contentSelector)[0], data, url);
                }

                if (callback) {
                    callback.call($(opts.contentSelector)[0], data, opts, url);
                }

                if (opts.prefill) {
                    $window.bind("resize.infinite-scroll", instance._prefill);
                }
            };

            if (options.debug) {
                // Tell IE9 to use its built-in console
                if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === "object") {
                    ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"]
                            .forEach(function(method) {
                        console[method] = this.call(console[method], console);
                    }, Function.prototype.bind);
                }
            }

            this._setup();

            // Setups the prefill method for use
            if (opts.prefill) {
                this._prefill();
            }

            // Return true to indicate successful creation
            return true;
        },
        _prefill: function infscr_prefill() {
            var instance = this;
            var $window = $(window);

            function needsPrefill() {
                return (instance.options.contentSelector.height() <= $window.height());
            }

            this._prefill = function() {
                if (needsPrefill()) {
                    instance.scroll();
                }

                $window.bind("resize.infinite-scroll", function() {
                    if (needsPrefill()) {
                        $window.unbind("resize.infinite-scroll");
                        instance.scroll();
                    }
                });
            };

            // Call self after setting up the new function
            this._prefill();
        },
        // Console log wrapper
        _debug: function infscr_debug() {
            if (true !== this.options.debug) {
                return;
            }

            if (typeof console !== 'undefined' && typeof console.log === 'function') {
                // Modern browsers
                // Single argument, which is a string
                if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
                    console.log((Array.prototype.slice.call(arguments)).toString());
                } else {
                    console.log(Array.prototype.slice.call(arguments));
                }
            } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
                // IE8
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
            }
        },
        // find the number to increment in the path.
        _determinepath: function infscr_determinepath(path) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_determinepath_' + opts.behavior] !== undefined) {
                return this['_determinepath_' + opts.behavior].call(this, path);
            }

            if (!!opts.pathParse) {

                this._debug('pathParse manual');
                return opts.pathParse(path, this.options.state.currPage + 1);

            } else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
                path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);

                // if there is any 2 in the url at all.    
            } else if (path.match(/^(.*?)2(.*?$)/)) {

                // page= is used in django:
                // http://www.infinite-scroll.com/changelog/comment-page-1/#comment-127
                if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    return path;
                }

                path = path.match(/^(.*?)2(.*?$)/).slice(1);

            } else {

                // page= is used in drupal too but second page is page=1 not page=2:
                // thx Jerod Fritz, vladikoff
                if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    return path;
                } else {
                    this._debug('Sorry, we couldn\'t parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.');
                    // Get rid of isInvalidPage to allow permalink to state
                    opts.state.isInvalidPage = true;  //prevent it from running on this page.
                }
            }
            this._debug('determinePath', path);
            return path;

        },
        // Custom error
        _error: function infscr_error(xhr) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_error_' + opts.behavior] !== undefined) {
                this['_error_' + opts.behavior].call(this, xhr);
                return;
            }

            if (xhr !== 'destroy' && xhr !== 'end') {
                xhr = 'unknown';
            }

            this._debug('Error', xhr);

            if (xhr === 'end' || opts.state.isBeyondMaxPage) {
                this._showdonemsg();
            }

            opts.state.isDone = true;
            opts.state.currPage = 1; // if you need to go back to this instance
            opts.state.isPaused = false;
            opts.state.isBeyondMaxPage = false;
            this._binding('unbind');

        },
        // Load Callback
        _loadcallback: function infscr_loadcallback(box, data, url) {
            var opts = this.options,
                    callback = this.options.callback, // GLOBAL OBJECT FOR CALLBACK
                    result = (opts.state.isDone) ? 'done' : (!opts.appendCallback) ? 'no-append' : 'append',
                    frag;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_loadcallback_' + opts.behavior] !== undefined) {
                this['_loadcallback_' + opts.behavior].call(this, box, data);
                return;
            }

            switch (result) {
                case 'done':
                    this._showdonemsg();
                    return false;

                case 'no-append':
                    if (opts.dataType === 'html') {
                        data = '<div>' + data + '</div>';
                        data = $(data).find(opts.itemSelector);
                    }
                    break;

                case 'append':
                    var children = box.children();
                    // if it didn't return anything
                    if (children.length === 0) {
                        return this._error('end');
                    }

                    // use a documentFragment because it works when content is going into a table or UL
                    frag = document.createDocumentFragment();
                    while (box[0].firstChild) {
                        frag.appendChild(box[0].firstChild);
                    }

                    this._debug('contentSelector', $(opts.contentSelector)[0]);
                    $(opts.contentSelector)[0].appendChild(frag);
                    // previously, we would pass in the new DOM element as context for the callback
                    // however we're now using a documentfragment, which doesn't have parents or children,
                    // so the context is the contentContainer guy, and we pass in an array
                    // of the elements collected as the first argument.

                    data = children.get();
                    break;
            }

            // loadingEnd function
            opts.loading.finished.call($(opts.contentSelector)[0], opts);

            // smooth scroll to ease in the new content
            if (opts.animate) {
                var scrollTo = $(window).scrollTop() + $(opts.loading.msg).height() + opts.extraScrollPx + 'px';
                $('html,body').animate({scrollTop: scrollTo}, 800, function() {
                    opts.state.isDuringAjax = false;
                });
            }

            if (!opts.animate) {
                // once the call is done, we can allow it again.
                opts.state.isDuringAjax = false;
            }

            callback(this, data, url);

            if (opts.prefill) {
                this._prefill();
            }
        },
        _nearbottom: function infscr_nearbottom() {

            var opts = this.options,
                    pixelsFromWindowBottomToBottom = 0 + $(document).height() - (opts.binder.scrollTop()) - $(window).height();

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_nearbottom_' + opts.behavior] !== undefined) {
                return this['_nearbottom_' + opts.behavior].call(this);
            }

            this._debug('math:', pixelsFromWindowBottomToBottom, opts.pixelsFromNavToBottom);

            // if distance remaining in the scroll (including buffer) is less than the orignal nav to bottom....
            return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);

        },
        // Pause / temporarily disable plugin from firing
        _pausing: function infscr_pausing(pause) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_pausing_' + opts.behavior] !== undefined) {
                this['_pausing_' + opts.behavior].call(this, pause);
                return;
            }

            // If pause is not 'pause' or 'resume', toggle it's value
            if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
                this._debug('Invalid argument. Toggling pause value instead');
            }

            pause = (pause && (pause === 'pause' || pause === 'resume')) ? pause : 'toggle';

            switch (pause) {
                case 'pause':
                    opts.state.isPaused = true;
                    break;

                case 'resume':
                    opts.state.isPaused = false;
                    break;

                case 'toggle':
                    opts.state.isPaused = !opts.state.isPaused;
                    break;
            }

            this._debug('Paused', opts.state.isPaused);
            return false;

        },
        // Behavior is determined
        // If the behavior option is undefined, it will set to default and bind to scroll
        _setup: function infscr_setup() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_setup_' + opts.behavior] !== undefined) {
                this['_setup_' + opts.behavior].call(this);
                return;
            }

            this._binding('bind');

            return false;

        },
        // Show done message
        _showdonemsg: function infscr_showdonemsg() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_showdonemsg_' + opts.behavior] !== undefined) {
                this['_showdonemsg_' + opts.behavior].call(this);
                return;
            }

            opts.loading.msg
                    .find('img')
                    .hide()
                    .parent()
                    .find('div').html(opts.loading.finishedMsg).animate({opacity: 1}, 2000, function() {
                $(this).parent().fadeOut(opts.loading.speed);
            });

            // user provided callback when done    
            opts.errorCallback.call($(opts.contentSelector)[0], 'done');
        },
        // grab each selector option and see if any fail
        _validate: function infscr_validate(opts) {
            for (var key in opts) {
                if (key.indexOf && key.indexOf('Selector') > -1 && $(opts[key]).length === 0) {
                    this._debug('Your ' + key + ' found no elements.');
                    return false;
                }
            }

            return true;
        },
        /*	
         ----------------------------
         Public methods
         ----------------------------
         */

        // Bind to scroll
        bind: function infscr_bind() {
            this._binding('bind');
        },
        // Destroy current instance of plugin
        destroy: function infscr_destroy() {
            this.options.state.isDestroyed = true;
            this.options.loading.finished();
            return this._error('destroy');
        },
        // Set pause value to false
        pause: function infscr_pause() {
            this._pausing('pause');
        },
        // Set pause value to false
        resume: function infscr_resume() {
            this._pausing('resume');
        },
        beginAjax: function infscr_ajax(opts) {
            var instance = this,
                    path = opts.path,
                    box, desturl, method, condition;

            // increment the URL bit. e.g. /page/3/
            opts.state.currPage++;

            // Manually control maximum page 
            if (opts.maxPage != undefined && opts.state.currPage > opts.maxPage) {
                opts.state.isBeyondMaxPage = true;
                this.destroy();
                return;
            }

            // if we're dealing with a table we can't use DIVs
            box = $(opts.contentSelector).is('table, tbody') ? $('<tbody/>') : $('<div/>');

            desturl = (typeof path === 'function') ? path(opts.state.currPage) : path.join(opts.state.currPage);
            instance._debug('heading into ajax', desturl);

            method = (opts.dataType === 'html' || opts.dataType === 'json') ? opts.dataType : 'html+callback';
            if (opts.appendCallback && opts.dataType === 'html') {
                method += '+callback';
            }

            switch (method) {
                case 'html+callback':
                    instance._debug('Using HTML via .load() method');
                    box.load(desturl + ' ' + opts.itemSelector, undefined, function infscr_ajax_callback(responseText) {
                        instance._loadcallback(box, responseText, desturl);
                    });

                    break;

                case 'html':
                    instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
                    $.ajax({
                        // params
                        url: desturl,
                        dataType: opts.dataType,
                        complete: function infscr_ajax_callback(jqXHR, textStatus) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
                            if (condition) {
                                instance._loadcallback(box, jqXHR.responseText, desturl);
                            } else {
                                instance._error('end');
                            }
                        }
                    });

                    break;
                case 'json':
                    instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
                    $.ajax({
                        dataType: 'json',
                        type: 'GET',
                        url: desturl,
                        success: function(data, textStatus, jqXHR) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
                            if (opts.appendCallback) {
                                // if appendCallback is true, you must defined template in options.
                                // note that data passed into _loadcallback is already an html (after processed in opts.template(data)).
                                if (opts.template !== undefined) {
                                    var theData = opts.template(data);
                                    box.append(theData);
                                    if (condition) {
                                        instance._loadcallback(box, theData);
                                    } else {
                                        instance._error('end');
                                    }
                                } else {
                                    instance._debug("template must be defined.");
                                    instance._error('end');
                                }
                            } else {
                                // if appendCallback is false, we will pass in the JSON object. you should handle it yourself in your callback.
                                if (condition) {
                                    instance._loadcallback(box, data, desturl);
                                } else {
                                    instance._error('end');
                                }
                            }
                        },
                        error: function() {
                            instance._debug("JSON ajax request failed.");
                            instance._error('end');
                        }
                    });

                    break;
            }
        },
        // Retrieve next set of content items
        retrieve: function infscr_retrieve(pageNum) {
            pageNum = pageNum || null;

            var instance = this,
                    opts = instance.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['retrieve_' + opts.behavior] !== undefined) {
                this['retrieve_' + opts.behavior].call(this, pageNum);
                return;
            }

            // for manual triggers, if destroyed, get out of here
            if (opts.state.isDestroyed) {
                this._debug('Instance is destroyed');
                return false;
            }

            // we dont want to fire the ajax multiple times
            opts.state.isDuringAjax = true;

            opts.loading.start.call($(opts.contentSelector)[0], opts);
        },
        // Check to see next page is needed
        scroll: function infscr_scroll() {

            var opts = this.options,
                    state = opts.state;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['scroll_' + opts.behavior] !== undefined) {
                this['scroll_' + opts.behavior].call(this);
                return;
            }

            if (state.isDuringAjax || state.isInvalidPage || state.isDone || state.isDestroyed || state.isPaused) {
                return;
            }

            if (!this._nearbottom()) {
                return;
            }

            this.retrieve();

        },
        // Toggle pause value
        toggle: function infscr_toggle() {
            this._pausing();
        },
        // Unbind from scroll
        unbind: function infscr_unbind() {
            this._binding('unbind');
        },
        // update options
        update: function infscr_options(key) {
            if ($.isPlainObject(key)) {
                this.options = $.extend(true, this.options, key);
            }
        }
    };


    /*	
     ----------------------------
     Infinite Scroll function
     ----------------------------
     
     Borrowed logic from the following...
     
     jQuery UI
     - https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
     
     jCarousel
     - https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js
     
     Masonry
     - https://github.com/desandro/masonry/blob/master/jquery.masonry.js		
     
     */

    $.fn.infinitescroll = function infscr_init(options, callback) {


        var thisCall = typeof options;

        switch (thisCall) {

            // method 
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                this.each(function() {
                    var instance = $.data(this, 'infinitescroll');

                    if (!instance) {
                        // not setup yet
                        // return $.error('Method ' + options + ' cannot be called until Infinite Scroll is setup');
                        return false;
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        // return $.error('No such method ' + options + ' for Infinite Scroll');
                        return false;
                    }

                    // no errors!
                    instance[options].apply(instance, args);
                });

                break;

                // creation 
            case 'object':

                this.each(function() {

                    var instance = $.data(this, 'infinitescroll');

                    if (instance) {

                        // update options of current instance
                        instance.update(options);

                    } else {

                        // initialize new instance
                        instance = new $.infinitescroll(options, callback, this);

                        // don't attach if instantiation failed
                        if (!instance.failed) {
                            $.data(this, 'infinitescroll', instance);
                        }

                    }

                });

                break;

        }

        return this;
    };



    /* 
     * smartscroll: debounced scroll event for jQuery *
     * https://github.com/lukeshumard/smartscroll
     * Based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
     * Copyright 2011 Louis-Remi & Luke Shumard * Licensed under the MIT license. *
     */

    var event = $.event,
            scrollTimeout;

    event.special.smartscroll = {
        setup: function() {
            $(this).bind("scroll", event.special.smartscroll.handler);
        },
        teardown: function() {
            $(this).unbind("scroll", event.special.smartscroll.handler);
        },
        handler: function(event, execAsap) {
            // Save the context
            var context = this,
                    args = arguments;

            // set correct event type
            event.type = "smartscroll";

            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(function() {
                $(context).trigger('smartscroll', args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartscroll = function(fn) {
        return fn ? this.bind("smartscroll", fn) : this.trigger("smartscroll", ["execAsap"]);
    };


})(window, jQuery);
/**
 * Isotope v1.5.25
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2013 Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */


(function(window, $, undefined) {

    'use strict';

    // get global vars
    var document = window.document;
    var Modernizr = window.Modernizr;

    // helper function
    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // ========================= getStyleProperty by kangax ===============================
    // http://perfectionkills.com/feature-testing-css-properties/

    var prefixes = 'Moz Webkit O Ms'.split(' ');

    var getStyleProperty = function(propName) {
        var style = document.documentElement.style,
                prefixed;

        // test standard property first
        if (typeof style[propName] === 'string') {
            return propName;
        }

        // capitalize
        propName = capitalize(propName);

        // test vendor specific properties
        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof style[ prefixed ] === 'string') {
                return prefixed;
            }
        }
    };

    var transformProp = getStyleProperty('transform'),
            transitionProp = getStyleProperty('transitionProperty');


    // ========================= miniModernizr ===============================
    // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

    /*!
     * Modernizr v1.6ish: miniModernizr for Isotope
     * http://www.modernizr.com
     *
     * Developed by:
     * - Faruk Ates  http://farukat.es/
     * - Paul Irish  http://paulirish.com/
     *
     * Copyright (c) 2009-2010
     * Dual-licensed under the BSD or MIT licenses.
     * http://www.modernizr.com/license/
     */

    /*
     * This version whittles down the script just to check support for
     * CSS transitions, transforms, and 3D transforms.
     */

    var tests = {
        csstransforms: function() {
            return !!transformProp;
        },
        csstransforms3d: function() {
            var test = !!getStyleProperty('perspective');
            // double check for Chrome's false positive
            if (test) {

                var vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
                        mediaQuery = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)',
                        $style = $('<style>' + mediaQuery + '{#modernizr{height:3px}}' + '</style>')
                        .appendTo('head'),
                        $div = $('<div id="modernizr" />').appendTo('html');

                test = $div.height() === 3;

                $div.remove();
                $style.remove();
            }
            return test;
        },
        csstransitions: function() {
            return !!transitionProp;
        }
    };

    var testName;

    if (Modernizr) {
        // if there's a previous Modernzir, check if there are necessary tests
        for (testName in tests) {
            if (!Modernizr.hasOwnProperty(testName)) {
                // if test hasn't been run, use addTest to run it
                Modernizr.addTest(testName, tests[ testName ]);
            }
        }
    } else {
        // or create new mini Modernizr that just has the 3 tests
        Modernizr = window.Modernizr = {
            _version: '1.6ish: miniModernizr for Isotope'
        };

        var classes = ' ';
        var result;

        // Run through tests
        for (testName in tests) {
            result = tests[ testName ]();
            Modernizr[ testName ] = result;
            classes += ' ' + (result ? '' : 'no-') + testName;
        }

        // Add the new classes to the <html> element.
        $('html').addClass(classes);
    }


    // ========================= isoTransform ===============================

    /**
     *  provides hooks for .css({ scale: value, translate: [x, y] })
     *  Progressively enhanced CSS transforms
     *  Uses hardware accelerated 3D transforms for Safari
     *  or falls back to 2D transforms.
     */

    if (Modernizr.csstransforms) {

        // i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
        var transformFnNotations = Modernizr.csstransforms3d ?
                {// 3D transform functions
                    translate: function(position) {

                        return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
                    },
                    scale: function(scale) {
                        return 'scale3d(' + scale + ', ' + scale + ', 1) ';
                    }
                } : {// 2D transform functions
            translate: function(position) {

                return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
            },
            scale: function(scale) {
                return 'scale(' + scale + ') ';
            }
        }
        ;

        var setIsoTransform = function(elem, name, value) {
            // unpack current transform data
            var data = $.data(elem, 'isoTransform') || {},
                    newData = {},
                    fnName,
                    transformObj = {},
                    transformValue;

            // i.e. newData.scale = 0.5
            newData[ name ] = value;
            // extend new value over current data
            $.extend(data, newData);

            for (fnName in data) {
                transformValue = data[ fnName ];
                transformObj[ fnName ] = transformFnNotations[ fnName ](transformValue);
            }

            // get proper order
            // ideally, we could loop through this give an array, but since we only have
            // a couple transforms we're keeping track of, we'll do it like so
            var translateFn = transformObj.translate || '',
                    scaleFn = transformObj.scale || '',
                    // sorting so translate always comes first
                    valueFns = translateFn + scaleFn;

            // set data back in elem
            $.data(elem, 'isoTransform', data);

            // set name to vendor specific property
            elem.style[ transformProp ] = valueFns;
        };

        // ==================== scale ===================

        $.cssNumber.scale = true;

        $.cssHooks.scale = {
            set: function(elem, value) {
                // uncomment this bit if you want to properly parse strings
                // if ( typeof value === 'string' ) {
                //   value = parseFloat( value );
                // }
                setIsoTransform(elem, 'scale', value);
            },
            get: function(elem, computed) {
                var transform = $.data(elem, 'isoTransform');
                return transform && transform.scale ? transform.scale : 1;
            }
        };

        $.fx.step.scale = function(fx) {
            $.cssHooks.scale.set(fx.elem, fx.now + fx.unit);
        };


        // ==================== translate ===================

        $.cssNumber.translate = true;

        $.cssHooks.translate = {
            set: function(elem, value) {

                // uncomment this bit if you want to properly parse strings
                // if ( typeof value === 'string' ) {
                //   value = value.split(' ');
                // }
                //
                // var i, val;
                // for ( i = 0; i < 2; i++ ) {
                //   val = value[i];
                //   if ( typeof val === 'string' ) {
                //     val = parseInt( val );
                //   }
                // }

                setIsoTransform(elem, 'translate', value);
            },
            get: function(elem, computed) {
                var transform = $.data(elem, 'isoTransform');
                return transform && transform.translate ? transform.translate : [0, 0];
            }
        };

    }

    // ========================= get transition-end event ===============================
    var transitionEndEvent, transitionDurProp;

    if (Modernizr.csstransitions) {
        transitionEndEvent = {
            WebkitTransitionProperty: 'webkitTransitionEnd', // webkit
            MozTransitionProperty: 'transitionend',
            OTransitionProperty: 'oTransitionEnd otransitionend',
            transitionProperty: 'transitionend'
        }[ transitionProp ];

        transitionDurProp = getStyleProperty('transitionDuration');
    }

    // ========================= smartresize ===============================

    /*
     * smartresize: debounced resize event for jQuery
     *
     * latest version and complete README available on Github:
     * https://github.com/louisremi/jquery.smartresize.js
     *
     * Copyright 2011 @louis_remi
     * Licensed under the MIT license.
     */

    var $event = $.event,
            dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
            resizeTimeout;

    $event.special.smartresize = {
        setup: function() {
            $(this).bind("resize", $event.special.smartresize.handler);
        },
        teardown: function() {
            $(this).unbind("resize", $event.special.smartresize.handler);
        },
        handler: function(event, execAsap) {
            // Save the context
            var context = this,
                    args = arguments;

            // set correct event type
            event.type = "smartresize";

            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function() {
                $event[ dispatchMethod ].apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartresize = function(fn) {
        return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
    };



// ========================= Isotope ===============================


    // our "Widget" object constructor
    $.Isotope = function(options, element, callback) {
        this.element = $(element);

        this._create(options);
        this._init(callback);
    };

    // styles of container element we want to keep track of
    var isoContainerStyles = ['width', 'height'];

    var $window = $(window);

    $.Isotope.settings = {
        resizable: true,
        layoutMode: 'masonry',
        containerClass: 'isotope',
        itemClass: 'isotope-item',
        hiddenClass: 'isotope-hidden',
        hiddenStyle: {opacity: 0, scale: 0.001},
        visibleStyle: {opacity: 1, scale: 1},
        containerStyle: {
            position: 'relative',
            overflow: 'hidden'
        },
        animationEngine: 'best-available',
        animationOptions: {
            queue: false,
            duration: 800
        },
        sortBy: 'original-order',
        sortAscending: true,
        resizesContainer: true,
        transformsEnabled: true,
        itemPositionDataEnabled: false
    };

    $.Isotope.prototype = {
        // sets up widget
        _create: function(options) {

            this.options = $.extend({}, $.Isotope.settings, options);

            this.styleQueue = [];
            this.elemCount = 0;

            // get original styles in case we re-apply them in .destroy()
            var elemStyle = this.element[0].style;
            this.originalStyle = {};
            // keep track of container styles
            var containerStyles = isoContainerStyles.slice(0);
            for (var prop in this.options.containerStyle) {
                containerStyles.push(prop);
            }
            for (var i = 0, len = containerStyles.length; i < len; i++) {
                prop = containerStyles[i];
                this.originalStyle[ prop ] = elemStyle[ prop ] || '';
            }
            // apply container style from options
            this.element.css(this.options.containerStyle);

            this._updateAnimationEngine();
            this._updateUsingTransforms();

            // sorting
            var originalOrderSorter = {
                'original-order': function($elem, instance) {
                    instance.elemCount++;
                    return instance.elemCount;
                },
                random: function() {
                    return Math.random();
                }
            };

            this.options.getSortData = $.extend(this.options.getSortData, originalOrderSorter);

            // need to get atoms
            this.reloadItems();

            // get top left position of where the bricks should be
            this.offset = {
                left: parseInt((this.element.css('padding-left') || 0), 10),
                top: parseInt((this.element.css('padding-top') || 0), 10)
            };

            // add isotope class first time around
            var instance = this;
            setTimeout(function() {
                instance.element.addClass(instance.options.containerClass);
            }, 0);

            // bind resize method
            if (this.options.resizable) {
                $window.bind('smartresize.isotope', function() {
                    instance.resize();
                });
            }

            // dismiss all click events from hidden events
            this.element.delegate('.' + this.options.hiddenClass, 'click', function() {
                return false;
            });

        },
        _getAtoms: function($elems) {
            var selector = this.options.itemSelector,
                    // filter & find
                    $atoms = selector ? $elems.filter(selector).add($elems.find(selector)) : $elems,
                    // base style for atoms
                    atomStyle = {position: 'absolute'};

            // filter out text nodes
            $atoms = $atoms.filter(function(i, atom) {
                return atom.nodeType === 1;
            });

            if (this.usingTransforms) {
                atomStyle.left = 0;
                atomStyle.top = 0;
            }

            $atoms.css(atomStyle).addClass(this.options.itemClass);

            this.updateSortData($atoms, true);

            return $atoms;
        },
        // _init fires when your instance is first created
        // (from the constructor above), and when you
        // attempt to initialize the widget again (by the bridge)
        // after it has already been initialized.
        _init: function(callback) {

            this.$filteredAtoms = this._filter(this.$allAtoms);
            this._sort();
            this.reLayout(callback);

        },
        option: function(opts) {
            // change options AFTER initialization:
            // signature: $('#foo').bar({ cool:false });
            if ($.isPlainObject(opts)) {
                this.options = $.extend(true, this.options, opts);

                // trigger _updateOptionName if it exists
                var updateOptionFn;
                for (var optionName in opts) {
                    updateOptionFn = '_update' + capitalize(optionName);
                    if (this[ updateOptionFn ]) {
                        this[ updateOptionFn ]();
                    }
                }
            }
        },
        // ====================== updaters ====================== //
        // kind of like setters

        _updateAnimationEngine: function() {
            var animationEngine = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, '');
            var isUsingJQueryAnimation;
            // set applyStyleFnName
            switch (animationEngine) {
                case 'css' :
                case 'none' :
                    isUsingJQueryAnimation = false;
                    break;
                case 'jquery' :
                    isUsingJQueryAnimation = true;
                    break;
                default : // best available
                    isUsingJQueryAnimation = !Modernizr.csstransitions;
            }
            this.isUsingJQueryAnimation = isUsingJQueryAnimation;
            this._updateUsingTransforms();
        },
        _updateTransformsEnabled: function() {
            this._updateUsingTransforms();
        },
        _updateUsingTransforms: function() {
            var usingTransforms = this.usingTransforms = this.options.transformsEnabled &&
                    Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

            // prevent scales when transforms are disabled
            if (!usingTransforms) {
                delete this.options.hiddenStyle.scale;
                delete this.options.visibleStyle.scale;
            }

            this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
        },
        // ====================== Filtering ======================

        _filter: function($atoms) {
            var filter = this.options.filter === '' ? '*' : this.options.filter;

            if (!filter) {
                return $atoms;
            }

            var hiddenClass = this.options.hiddenClass,
                    hiddenSelector = '.' + hiddenClass,
                    $hiddenAtoms = $atoms.filter(hiddenSelector),
                    $atomsToShow = $hiddenAtoms;

            if (filter !== '*') {
                $atomsToShow = $hiddenAtoms.filter(filter);
                var $atomsToHide = $atoms.not(hiddenSelector).not(filter).addClass(hiddenClass);
                this.styleQueue.push({$el: $atomsToHide, style: this.options.hiddenStyle});
            }

            this.styleQueue.push({$el: $atomsToShow, style: this.options.visibleStyle});
            $atomsToShow.removeClass(hiddenClass);

            return $atoms.filter(filter);
        },
        // ====================== Sorting ======================

        updateSortData: function($atoms, isIncrementingElemCount) {
            var instance = this,
                    getSortData = this.options.getSortData,
                    $this, sortData;
            $atoms.each(function() {
                $this = $(this);
                sortData = {};
                // get value for sort data based on fn( $elem ) passed in
                for (var key in getSortData) {
                    if (!isIncrementingElemCount && key === 'original-order') {
                        // keep original order original
                        sortData[ key ] = $.data(this, 'isotope-sort-data')[ key ];
                    } else {
                        sortData[ key ] = getSortData[ key ]($this, instance);
                    }
                }
                // apply sort data to element
                $.data(this, 'isotope-sort-data', sortData);
            });
        },
        // used on all the filtered atoms
        _sort: function() {

            var sortBy = this.options.sortBy,
                    getSorter = this._getSorter,
                    sortDir = this.options.sortAscending ? 1 : -1,
                    sortFn = function(alpha, beta) {
                var a = getSorter(alpha, sortBy),
                        b = getSorter(beta, sortBy);
                // fall back to original order if data matches
                if (a === b && sortBy !== 'original-order') {
                    a = getSorter(alpha, 'original-order');
                    b = getSorter(beta, 'original-order');
                }
                return ((a > b) ? 1 : (a < b) ? -1 : 0) * sortDir;
            };

            this.$filteredAtoms.sort(sortFn);
        },
        _getSorter: function(elem, sortBy) {
            return $.data(elem, 'isotope-sort-data')[ sortBy ];
        },
        // ====================== Layout Helpers ======================

        _translate: function(x, y) {
            return {translate: [x, y]};
        },
        _positionAbs: function(x, y) {
            return {left: x, top: y};
        },
        _pushPosition: function($elem, x, y) {
            x = Math.round(x + this.offset.left);
            y = Math.round(y + this.offset.top);
            var position = this.getPositionStyles(x, y);
            this.styleQueue.push({$el: $elem, style: position});
            if (this.options.itemPositionDataEnabled) {
                $elem.data('isotope-item-position', {x: x, y: y});
            }
        },
        // ====================== General Layout ======================

        // used on collection of atoms (should be filtered, and sorted before )
        // accepts atoms-to-be-laid-out to start with
        layout: function($elems, callback) {

            var layoutMode = this.options.layoutMode;

            // layout logic
            this[ '_' + layoutMode + 'Layout' ]($elems);

            // set the size of the container
            if (this.options.resizesContainer) {
                var containerStyle = this[ '_' + layoutMode + 'GetContainerSize' ]();
                this.styleQueue.push({$el: this.element, style: containerStyle});
            }

            this._processStyleQueue($elems, callback);

            this.isLaidOut = true;
        },
        _processStyleQueue: function($elems, callback) {
            // are we animating the layout arrangement?
            // use plugin-ish syntax for css or animate
            var styleFn = !this.isLaidOut ? 'css' : (
                    this.isUsingJQueryAnimation ? 'animate' : 'css'
                    ),
                    animOpts = this.options.animationOptions,
                    onLayout = this.options.onLayout,
                    objStyleFn, processor,
                    triggerCallbackNow, callbackFn;

            // default styleQueue processor, may be overwritten down below
            processor = function(i, obj) {
                obj.$el[ styleFn ](obj.style, animOpts);
            };

            if (this._isInserting && this.isUsingJQueryAnimation) {
                // if using styleQueue to insert items
                processor = function(i, obj) {
                    // only animate if it not being inserted
                    objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
                    obj.$el[ objStyleFn ](obj.style, animOpts);
                };

            } else if (callback || onLayout || animOpts.complete) {
                // has callback
                var isCallbackTriggered = false,
                        // array of possible callbacks to trigger
                        callbacks = [callback, onLayout, animOpts.complete],
                        instance = this;
                triggerCallbackNow = true;
                // trigger callback only once
                callbackFn = function() {
                    if (isCallbackTriggered) {
                        return;
                    }
                    var hollaback;
                    for (var i = 0, len = callbacks.length; i < len; i++) {
                        hollaback = callbacks[i];
                        if (typeof hollaback === 'function') {
                            hollaback.call(instance.element, $elems, instance);
                        }
                    }
                    isCallbackTriggered = true;
                };

                if (this.isUsingJQueryAnimation && styleFn === 'animate') {
                    // add callback to animation options
                    animOpts.complete = callbackFn;
                    triggerCallbackNow = false;

                } else if (Modernizr.csstransitions) {
                    // detect if first item has transition
                    var i = 0,
                            firstItem = this.styleQueue[0],
                            testElem = firstItem && firstItem.$el,
                            styleObj;
                    // get first non-empty jQ object
                    while (!testElem || !testElem.length) {
                        styleObj = this.styleQueue[ i++ ];
                        // HACK: sometimes styleQueue[i] is undefined
                        if (!styleObj) {
                            return;
                        }
                        testElem = styleObj.$el;
                    }
                    // get transition duration of the first element in that object
                    // yeah, this is inexact
                    var duration = parseFloat(getComputedStyle(testElem[0])[ transitionDurProp ]);
                    if (duration > 0) {
                        processor = function(i, obj) {
                            obj.$el[ styleFn ](obj.style, animOpts)
                                    // trigger callback at transition end
                                    .one(transitionEndEvent, callbackFn);
                        };
                        triggerCallbackNow = false;
                    }
                }
            }

            // process styleQueue
            $.each(this.styleQueue, processor);

            if (triggerCallbackNow) {
                callbackFn();
            }

            // clear out queue for next time
            this.styleQueue = [];
        },
        resize: function() {
            if (this[ '_' + this.options.layoutMode + 'ResizeChanged' ]()) {
                this.reLayout();
            }
        },
        reLayout: function(callback) {

            this[ '_' + this.options.layoutMode + 'Reset' ]();
            this.layout(this.$filteredAtoms, callback);

        },
        // ====================== Convenience methods ======================

        // ====================== Adding items ======================

        // adds a jQuery object of items to a isotope container
        addItems: function($content, callback) {
            var $newAtoms = this._getAtoms($content);
            // add new atoms to atoms pools
            this.$allAtoms = this.$allAtoms.add($newAtoms);

            if (callback) {
                callback($newAtoms);
            }
        },
        // convienence method for adding elements properly to any layout
        // positions items, hides them, then animates them back in <--- very sezzy
        insert: function($content, callback) {
            // position items
            this.element.append($content);

            var instance = this;
            this.addItems($content, function($newAtoms) {
                var $newFilteredAtoms = instance._filter($newAtoms);
                instance._addHideAppended($newFilteredAtoms);
                instance._sort();
                instance.reLayout();
                instance._revealAppended($newFilteredAtoms, callback);
            });

        },
        // convienence method for working with Infinite Scroll
        appended: function($content, callback) {
            var instance = this;
            this.addItems($content, function($newAtoms) {
                instance._addHideAppended($newAtoms);
                instance.layout($newAtoms);
                instance._revealAppended($newAtoms, callback);
            });
        },
        // adds new atoms, then hides them before positioning
        _addHideAppended: function($newAtoms) {
            this.$filteredAtoms = this.$filteredAtoms.add($newAtoms);
            $newAtoms.addClass('no-transition');

            this._isInserting = true;

            // apply hidden styles
            this.styleQueue.push({$el: $newAtoms, style: this.options.hiddenStyle});
        },
        // sets visible style on new atoms
        _revealAppended: function($newAtoms, callback) {
            var instance = this;
            // apply visible style after a sec
            setTimeout(function() {
                // enable animation
                $newAtoms.removeClass('no-transition');
                // reveal newly inserted filtered elements
                instance.styleQueue.push({$el: $newAtoms, style: instance.options.visibleStyle});
                instance._isInserting = false;
                instance._processStyleQueue($newAtoms, callback);
            }, 10);
        },
        // gathers all atoms
        reloadItems: function() {
            this.$allAtoms = this._getAtoms(this.element.children());
        },
        // removes elements from Isotope widget
        remove: function($content, callback) {
            // remove elements immediately from Isotope instance
            this.$allAtoms = this.$allAtoms.not($content);
            this.$filteredAtoms = this.$filteredAtoms.not($content);
            // remove() as a callback, for after transition / animation
            var instance = this;
            var removeContent = function() {
                $content.remove();
                if (callback) {
                    callback.call(instance.element);
                }
            };

            if ($content.filter(':not(.' + this.options.hiddenClass + ')').length) {
                // if any non-hidden content needs to be removed
                this.styleQueue.push({$el: $content, style: this.options.hiddenStyle});
                this._sort();
                this.reLayout(removeContent);
            } else {
                // remove it now
                removeContent();
            }

        },
        shuffle: function(callback) {
            this.updateSortData(this.$allAtoms);
            this.options.sortBy = 'random';
            this._sort();
            this.reLayout(callback);
        },
        // destroys widget, returns elements and container back (close) to original style
        destroy: function() {

            var usingTransforms = this.usingTransforms;
            var options = this.options;

            this.$allAtoms
                    .removeClass(options.hiddenClass + ' ' + options.itemClass)
                    .each(function() {
                var style = this.style;
                style.position = '';
                style.top = '';
                style.left = '';
                style.opacity = '';
                if (usingTransforms) {
                    style[ transformProp ] = '';
                }
            });

            // re-apply saved container styles
            var elemStyle = this.element[0].style;
            for (var prop in this.originalStyle) {
                elemStyle[ prop ] = this.originalStyle[ prop ];
            }

            this.element
                    .unbind('.isotope')
                    .undelegate('.' + options.hiddenClass, 'click')
                    .removeClass(options.containerClass)
                    .removeData('isotope');

            $window.unbind('.isotope');

        },
        // ====================== LAYOUTS ======================

        // calculates number of rows or columns
        // requires columnWidth or rowHeight to be set on namespaced object
        // i.e. this.masonry.columnWidth = 200
        _getSegments: function(isRows) {
            var namespace = this.options.layoutMode,
                    measure = isRows ? 'rowHeight' : 'columnWidth',
                    size = isRows ? 'height' : 'width',
                    segmentsName = isRows ? 'rows' : 'cols',
                    containerSize = this.element[ size ](),
                    segments,
                    // i.e. options.masonry && options.masonry.columnWidth
                    segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item, i.e. outerWidth
                    this.$filteredAtoms[ 'outer' + capitalize(size) ](true) ||
                    // if there's no items, use size of container
                    containerSize;

            segments = Math.floor(containerSize / segmentSize);
            segments = Math.max(segments, 1);

            // i.e. this.masonry.cols = ....
            this[ namespace ][ segmentsName ] = segments;
            // i.e. this.masonry.columnWidth = ...
            this[ namespace ][ measure ] = segmentSize;

        },
        _checkIfSegmentsChanged: function(isRows) {
            var namespace = this.options.layoutMode,
                    segmentsName = isRows ? 'rows' : 'cols',
                    prevSegments = this[ namespace ][ segmentsName ];
            // update cols/rows
            this._getSegments(isRows);
            // return if updated cols/rows is not equal to previous
            return (this[ namespace ][ segmentsName ] !== prevSegments);
        },
        // ====================== Masonry ======================

        _masonryReset: function() {
            // layout-specific props
            this.masonry = {};
            // FIXME shouldn't have to call this again
            this._getSegments();
            var i = this.masonry.cols;
            this.masonry.colYs = [];
            while (i--) {
                this.masonry.colYs.push(0);
            }
        },
        _masonryLayout: function($elems) {
            var instance = this,
                    props = instance.masonry;
            $elems.each(function() {
                var $this = $(this),
                        //how many columns does this brick span
                        colSpan = Math.ceil($this.outerWidth(true) / props.columnWidth);
                colSpan = Math.min(colSpan, props.cols);

                if (colSpan === 1) {
                    // if brick spans only one column, just like singleMode
                    instance._masonryPlaceBrick($this, props.colYs);
                } else {
                    // brick spans more than one column
                    // how many different places could this brick fit horizontally
                    var groupCount = props.cols + 1 - colSpan,
                            groupY = [],
                            groupColY,
                            i;

                    // for each group potential horizontal position
                    for (i = 0; i < groupCount; i++) {
                        // make an array of colY values for that one group
                        groupColY = props.colYs.slice(i, i + colSpan);
                        // and get the max value of the array
                        groupY[i] = Math.max.apply(Math, groupColY);
                    }

                    instance._masonryPlaceBrick($this, groupY);
                }
            });
        },
        // worker method that places brick in the columnSet
        //   with the the minY
        _masonryPlaceBrick: function($brick, setY) {
            // get the minimum Y value from the columns
            var minimumY = Math.min.apply(Math, setY),
                    shortCol = 0;

            // Find index of short column, the first from the left
            for (var i = 0, len = setY.length; i < len; i++) {
                if (setY[i] === minimumY) {
                    shortCol = i;
                    break;
                }
            }

            // position the brick
            var x = this.masonry.columnWidth * shortCol,
                    y = minimumY;
            this._pushPosition($brick, x, y);

            // apply setHeight to necessary columns
            var setHeight = minimumY + $brick.outerHeight(true),
                    setSpan = this.masonry.cols + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.masonry.colYs[ shortCol + i ] = setHeight;
            }

        },
        _masonryGetContainerSize: function() {
            var containerHeight = Math.max.apply(Math, this.masonry.colYs);
            return {height: containerHeight};
        },
        _masonryResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        // ====================== fitRows ======================

        _fitRowsReset: function() {
            this.fitRows = {
                x: 0,
                y: 0,
                height: 0
            };
        },
        _fitRowsLayout: function($elems) {
            var instance = this,
                    containerWidth = this.element.width(),
                    props = this.fitRows;

            $elems.each(function() {
                var $this = $(this),
                        atomW = $this.outerWidth(true),
                        atomH = $this.outerHeight(true);

                if (props.x !== 0 && atomW + props.x > containerWidth) {
                    // if this element cannot fit in the current row
                    props.x = 0;
                    props.y = props.height;
                }

                // position the atom
                instance._pushPosition($this, props.x, props.y);

                props.height = Math.max(props.y + atomH, props.height);
                props.x += atomW;

            });
        },
        _fitRowsGetContainerSize: function() {
            return {height: this.fitRows.height};
        },
        _fitRowsResizeChanged: function() {
            return true;
        },
        // ====================== cellsByRow ======================

        _cellsByRowReset: function() {
            this.cellsByRow = {
                index: 0
            };
            // get this.cellsByRow.columnWidth
            this._getSegments();
            // get this.cellsByRow.rowHeight
            this._getSegments(true);
        },
        _cellsByRowLayout: function($elems) {
            var instance = this,
                    props = this.cellsByRow;
            $elems.each(function() {
                var $this = $(this),
                        col = props.index % props.cols,
                        row = Math.floor(props.index / props.cols),
                        x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
                        y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
                instance._pushPosition($this, x, y);
                props.index++;
            });
        },
        _cellsByRowGetContainerSize: function() {
            return {height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top};
        },
        _cellsByRowResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        // ====================== straightDown ======================

        _straightDownReset: function() {
            this.straightDown = {
                y: 0
            };
        },
        _straightDownLayout: function($elems) {
            var instance = this;
            $elems.each(function(i) {
                var $this = $(this);
                instance._pushPosition($this, 0, instance.straightDown.y);
                instance.straightDown.y += $this.outerHeight(true);
            });
        },
        _straightDownGetContainerSize: function() {
            return {height: this.straightDown.y};
        },
        _straightDownResizeChanged: function() {
            return true;
        },
        // ====================== masonryHorizontal ======================

        _masonryHorizontalReset: function() {
            // layout-specific props
            this.masonryHorizontal = {};
            // FIXME shouldn't have to call this again
            this._getSegments(true);
            var i = this.masonryHorizontal.rows;
            this.masonryHorizontal.rowXs = [];
            while (i--) {
                this.masonryHorizontal.rowXs.push(0);
            }
        },
        _masonryHorizontalLayout: function($elems) {
            var instance = this,
                    props = instance.masonryHorizontal;
            $elems.each(function() {
                var $this = $(this),
                        //how many rows does this brick span
                        rowSpan = Math.ceil($this.outerHeight(true) / props.rowHeight);
                rowSpan = Math.min(rowSpan, props.rows);

                if (rowSpan === 1) {
                    // if brick spans only one column, just like singleMode
                    instance._masonryHorizontalPlaceBrick($this, props.rowXs);
                } else {
                    // brick spans more than one row
                    // how many different places could this brick fit horizontally
                    var groupCount = props.rows + 1 - rowSpan,
                            groupX = [],
                            groupRowX, i;

                    // for each group potential horizontal position
                    for (i = 0; i < groupCount; i++) {
                        // make an array of colY values for that one group
                        groupRowX = props.rowXs.slice(i, i + rowSpan);
                        // and get the max value of the array
                        groupX[i] = Math.max.apply(Math, groupRowX);
                    }

                    instance._masonryHorizontalPlaceBrick($this, groupX);
                }
            });
        },
        _masonryHorizontalPlaceBrick: function($brick, setX) {
            // get the minimum Y value from the columns
            var minimumX = Math.min.apply(Math, setX),
                    smallRow = 0;
            // Find index of smallest row, the first from the top
            for (var i = 0, len = setX.length; i < len; i++) {
                if (setX[i] === minimumX) {
                    smallRow = i;
                    break;
                }
            }

            // position the brick
            var x = minimumX,
                    y = this.masonryHorizontal.rowHeight * smallRow;
            this._pushPosition($brick, x, y);

            // apply setHeight to necessary columns
            var setWidth = minimumX + $brick.outerWidth(true),
                    setSpan = this.masonryHorizontal.rows + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.masonryHorizontal.rowXs[ smallRow + i ] = setWidth;
            }
        },
        _masonryHorizontalGetContainerSize: function() {
            var containerWidth = Math.max.apply(Math, this.masonryHorizontal.rowXs);
            return {width: containerWidth};
        },
        _masonryHorizontalResizeChanged: function() {
            return this._checkIfSegmentsChanged(true);
        },
        // ====================== fitColumns ======================

        _fitColumnsReset: function() {
            this.fitColumns = {
                x: 0,
                y: 0,
                width: 0
            };
        },
        _fitColumnsLayout: function($elems) {
            var instance = this,
                    containerHeight = this.element.height(),
                    props = this.fitColumns;
            $elems.each(function() {
                var $this = $(this),
                        atomW = $this.outerWidth(true),
                        atomH = $this.outerHeight(true);

                if (props.y !== 0 && atomH + props.y > containerHeight) {
                    // if this element cannot fit in the current column
                    props.x = props.width;
                    props.y = 0;
                }

                // position the atom
                instance._pushPosition($this, props.x, props.y);

                props.width = Math.max(props.x + atomW, props.width);
                props.y += atomH;

            });
        },
        _fitColumnsGetContainerSize: function() {
            return {width: this.fitColumns.width};
        },
        _fitColumnsResizeChanged: function() {
            return true;
        },
        // ====================== cellsByColumn ======================

        _cellsByColumnReset: function() {
            this.cellsByColumn = {
                index: 0
            };
            // get this.cellsByColumn.columnWidth
            this._getSegments();
            // get this.cellsByColumn.rowHeight
            this._getSegments(true);
        },
        _cellsByColumnLayout: function($elems) {
            var instance = this,
                    props = this.cellsByColumn;
            $elems.each(function() {
                var $this = $(this),
                        col = Math.floor(props.index / props.rows),
                        row = props.index % props.rows,
                        x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
                        y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
                instance._pushPosition($this, x, y);
                props.index++;
            });
        },
        _cellsByColumnGetContainerSize: function() {
            return {width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth};
        },
        _cellsByColumnResizeChanged: function() {
            return this._checkIfSegmentsChanged(true);
        },
        // ====================== straightAcross ======================

        _straightAcrossReset: function() {
            this.straightAcross = {
                x: 0
            };
        },
        _straightAcrossLayout: function($elems) {
            var instance = this;
            $elems.each(function(i) {
                var $this = $(this);
                instance._pushPosition($this, instance.straightAcross.x, 0);
                instance.straightAcross.x += $this.outerWidth(true);
            });
        },
        _straightAcrossGetContainerSize: function() {
            return {width: this.straightAcross.x};
        },
        _straightAcrossResizeChanged: function() {
            return true;
        }

    };


    // ======================= imagesLoaded Plugin ===============================
    /*!
     * jQuery imagesLoaded plugin v1.1.0
     * http://github.com/desandro/imagesloaded
     *
     * MIT License. by Paul Irish et al.
     */


    // $('#my-container').imagesLoaded(myFunction)
    // or
    // $('img').imagesLoaded(myFunction)

    // execute a callback when all images have loaded.
    // needed because .load() doesn't work on cached images

    // callback function gets image collection as argument
    //  `this` is the container

    $.fn.imagesLoaded = function(callback) {
        var $this = this,
                $images = $this.find('img').add($this.filter('img')),
                len = $images.length,
                blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
                loaded = [];

        function triggerCallback() {
            callback.call($this, $images);
        }

        function imgLoaded(event) {
            var img = event.target;
            if (img.src !== blank && $.inArray(img, loaded) === -1) {
                loaded.push(img);
                if (--len <= 0) {
                    setTimeout(triggerCallback);
                    $images.unbind('.imagesLoaded', imgLoaded);
                }
            }
        }

        // if no images, trigger immediately
        if (!len) {
            triggerCallback();
        }

        $images.bind('load.imagesLoaded error.imagesLoaded', imgLoaded).each(function() {
            // cached images don't fire load sometimes, so we reset src.
            var src = this.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            this.src = blank;
            this.src = src;
        });

        return $this;
    };


    // helper function for logging errors
    // $.error breaks jQuery chaining
    var logError = function(message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    // =======================  Plugin bridge  ===============================
    // leverages data method to either create or return $.Isotope constructor
    // A bit from jQuery UI
    //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
    // A bit from jcarousel
    //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

    $.fn.isotope = function(options, callback) {
        if (typeof options === 'string') {
            // call method
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function() {
                var instance = $.data(this, 'isotope');
                if (!instance) {
                    logError("cannot call methods on isotope prior to initialization; " +
                            "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for isotope instance");
                    return;
                }
                // apply method
                instance[ options ].apply(instance, args);
            });
        } else {
            this.each(function() {
                var instance = $.data(this, 'isotope');
                if (instance) {
                    // apply options & init
                    instance.option(options);
                    instance._init(callback);
                } else {
                    // initialize new instance
                    $.data(this, 'isotope', new $.Isotope(options, this, callback));
                }
            });
        }
        // return jQuery object
        // so plugin methods do not have to
        return this;
    };

// Modified Isotope methods for gutters in masonry
    $.Isotope.prototype._getMasonryGutterColumns = function() {
        var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
        var containerWidth = this.element.width();

        this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
                // Or use the size of the first item
                this.$filteredAtoms.outerWidth(true) ||
                // If there's no items, use size of container
                containerWidth;

        this.masonry.columnWidth += gutter;

        this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
        this.masonry.cols = Math.max(this.masonry.cols, 1);

    };

    $.Isotope.prototype._masonryReset = function() {
        // Layout-specific props
        this.masonry = {};
        // FIXME shouldn't have to call this again
        this._getMasonryGutterColumns();
        var i = this.masonry.cols;
        this.masonry.colYs = [];
        while (i--) {
            this.masonry.colYs.push(0);
        }

    };

    $.Isotope.prototype._masonryResizeChanged = function() {
        var prevSegments = this.masonry.cols;
        // Update cols/rows
        this._getMasonryGutterColumns();
        // Return if updated cols/rows is not equal to previous
        return (this.masonry.cols !== prevSegments);
    };

})(window, jQuery);
/* ------------------------------------------------------------------------
 Class: prettyPhoto
 Use: Lightbox clone for jQuery
 Author: Stephane Caron (http://www.no-margin-for-errors.com)
 Version: 3.1.5
 ------------------------------------------------------------------------- */

(function($) {
    $.prettyPhoto = {version: '3.1.5'};

    $.fn.prettyPhoto = function(pp_settings) {
        pp_settings = jQuery.extend({
            hook: 'data-rel', /* the attribute tag to use for prettyPhoto hooks. default: 'rel'. For HTML5, use "data-rel" or similar. */
            animation_speed: 'fast', /* fast/slow/normal */
            ajaxcallback: function() {
            },
            slideshow: 5000, /* false OR interval time in ms */
            autoplay_slideshow: false, /* true/false */
            opacity: 0.80, /* Value between 0 and 1 */
            show_title: true, /* true/false */
            allow_resize: true, /* Resize the photos bigger than viewport. true/false */
            allow_expand: true, /* Allow the user to expand a resized image. true/false */
            default_width: 500,
            default_height: 344,
            counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
            theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
            horizontal_padding: 20, /* The padding on each side of the picture */
            hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
            wmode: 'opaque', /* Set the flash wmode attribute */
            autoplay: true, /* Automatically start videos: True/False */
            modal: false, /* If set to true, only the close button will close the window */
            deeplinking: true, /* Allow prettyPhoto to update the url to enable deeplinking. */
            overlay_gallery: true, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
            overlay_gallery_max: 30, /* Maximum number of pictures in the overlay gallery */
            keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
            changepicturecallback: function() {
            }, /* Called everytime an item is shown/changed */
            callback: function() {
            }, /* Called when prettyPhoto is closed */
            ie6_fallback: true,
            markup: '<div class="pp_pic_holder"> \
						<div class="ppt">&nbsp;</div> \
						<div class="pp_top"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
						<div class="pp_content_container"> \
							<div class="pp_left"> \
							<div class="pp_right"> \
								<div class="pp_content"> \
									<div class="pp_loaderIcon"></div> \
									<div class="pp_fade"> \
										<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
										<div class="pp_hoverContainer"> \
											<a class="pp_next" href="#">next</a> \
											<a class="pp_previous" href="#">previous</a> \
										</div> \
										<div id="pp_full_res"></div> \
										<div class="pp_details"> \
											<div class="pp_nav"> \
												<a href="#" class="pp_arrow_previous">Previous</a> \
												<p class="currentTextHolder">0/0</p> \
												<a href="#" class="pp_arrow_next">Next</a> \
											</div> \
											<p class="pp_description"></p> \
											<div class="pp_social">{pp_social}</div> \
											<a class="pp_close" href="#">Close</a> \
										</div> \
									</div> \
								</div> \
							</div> \
							</div> \
						</div> \
						<div class="pp_bottom"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
					</div> \
					<div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery"> \
								<a href="#" class="pp_arrow_previous">Previous</a> \
								<div> \
									<ul> \
										{gallery} \
									</ul> \
								</div> \
								<a href="#" class="pp_arrow_next">Next</a> \
							</div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline">{content}</div>',
            custom_markup: '',
            social_tools: '<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>' /* html or false to disable */
        }, pp_settings);

        // Global variables accessible only by prettyPhoto
        var matchedObjects = this, percentBased = false, pp_dimensions, pp_open,
                // prettyPhoto container specific
                pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth,
                // Window size
                windowHeight = $(window).height(), windowWidth = $(window).width(),
                // Global elements
                pp_slideshow;

        doresize = true, scroll_pos = _get_scroll();

        // Window/Keyboard events
        $(window).unbind('resize.prettyphoto').bind('resize.prettyphoto', function() {
            _center_overlay();
            _resize_overlay();
        });

        if (pp_settings.keyboard_shortcuts) {
            $(document).unbind('keydown.prettyphoto').bind('keydown.prettyphoto', function(e) {
                if (typeof $pp_pic_holder != 'undefined') {
                    if ($pp_pic_holder.is(':visible')) {
                        switch (e.keyCode) {
                            case 37:
                                $.prettyPhoto.changePage('previous');
                                e.preventDefault();
                                break;
                            case 39:
                                $.prettyPhoto.changePage('next');
                                e.preventDefault();
                                break;
                            case 27:
                                if (!settings.modal)
                                    $.prettyPhoto.close();
                                e.preventDefault();
                                break;
                        }
                        ;
                        // return false;
                    }
                    ;
                }
                ;
            });
        }
        ;

        /**
         * Initialize prettyPhoto.
         */
        $.prettyPhoto.initialize = function() {

            settings = pp_settings;

            if (settings.theme == 'pp_default')
                settings.horizontal_padding = 16;

            // Find out if the picture is part of a set
            theRel = $(this).attr(settings.hook);
            galleryRegExp = /\[(?:.*)\]/;
            isSet = (galleryRegExp.exec(theRel)) ? true : false;

            // Put the SRCs, TITLEs, ALTs into an array.
            pp_images = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1)
                    return $(n).attr('href');
            }) : $.makeArray($(this).attr('href'));
            pp_titles = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1)
                    return ($(n).find('img').attr('alt')) ? $(n).find('img').attr('alt') : "";
            }) : $.makeArray($(this).find('img').attr('alt'));
            pp_descriptions = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1)
                    return ($(n).attr('title')) ? $(n).attr('title') : "";
            }) : $.makeArray($(this).attr('title'));

            if (pp_images.length > settings.overlay_gallery_max)
                settings.overlay_gallery = false;

            set_position = jQuery.inArray($(this).attr('href'), pp_images); // Define where in the array the clicked item is positionned
            rel_index = (isSet) ? set_position : $("a[" + settings.hook + "^='" + theRel + "']").index($(this));

            _build_overlay(this); // Build the overlay {this} being the caller

            if (settings.allow_resize)
                $(window).bind('scroll.prettyphoto', function() {
                    _center_overlay();
                });


            $.prettyPhoto.open();

            return false;
        }


        /**
         * Opens the prettyPhoto modal box.
         * @param image {String,Array} Full path to the image to be open, can also be an array containing full images paths.
         * @param title {String,Array} The title to be displayed with the picture, can also be an array containing all the titles.
         * @param description {String,Array} The description to be displayed with the picture, can also be an array containing all the descriptions.
         */
        $.prettyPhoto.open = function(event) {
            if (typeof settings == "undefined") { // Means it's an API call, need to manually get the settings and set the variables
                settings = pp_settings;
                pp_images = $.makeArray(arguments[0]);
                pp_titles = (arguments[1]) ? $.makeArray(arguments[1]) : $.makeArray("");
                pp_descriptions = (arguments[2]) ? $.makeArray(arguments[2]) : $.makeArray("");
                isSet = (pp_images.length > 1) ? true : false;
                set_position = (arguments[3]) ? arguments[3] : 0;
                _build_overlay(event.target); // Build the overlay {this} being the caller
            }

            if (settings.hideflash)
                $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility', 'hidden'); // Hide the flash

            _checkPosition($(pp_images).size()); // Hide the next/previous links if on first or last images.

            $('.pp_loaderIcon').show();

            if (settings.deeplinking)
                setHashtag();

            // Rebuild Facebook Like Button with updated href
            if (settings.social_tools) {
                facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href));
                $pp_pic_holder.find('.pp_social').html(facebook_like_link);
            }

            // Fade the content in
            if ($ppt.is(':hidden'))
                $ppt.css('opacity', 0).show();
            $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity);

            // Display the current position
            $pp_pic_holder.find('.currentTextHolder').text((set_position + 1) + settings.counter_separator_label + $(pp_images).size());

            // Set the description
            if (typeof pp_descriptions[set_position] != 'undefined' && pp_descriptions[set_position] != "") {
                $pp_pic_holder.find('.pp_description').show().html(unescape(pp_descriptions[set_position]));
            } else {
                $pp_pic_holder.find('.pp_description').hide();
            }

            // Get the dimensions
            movie_width = (parseFloat(getParam('width', pp_images[set_position]))) ? getParam('width', pp_images[set_position]) : settings.default_width.toString();
            movie_height = (parseFloat(getParam('height', pp_images[set_position]))) ? getParam('height', pp_images[set_position]) : settings.default_height.toString();

            // If the size is % based, calculate according to window dimensions
            percentBased = false;
            if (movie_height.indexOf('%') != -1) {
                movie_height = parseFloat(($(window).height() * parseFloat(movie_height) / 100) - 150);
                percentBased = true;
            }
            if (movie_width.indexOf('%') != -1) {
                movie_width = parseFloat(($(window).width() * parseFloat(movie_width) / 100) - 150);
                percentBased = true;
            }

            // Fade the holder
            $pp_pic_holder.fadeIn(function() {
                // Set the title
                (settings.show_title && pp_titles[set_position] != "" && typeof pp_titles[set_position] != "undefined") ? $ppt.html(unescape(pp_titles[set_position])) : $ppt.html('&nbsp;');

                imgPreloader = "";
                skipInjection = false;

                // Inject the proper content
                switch (_getFileType(pp_images[set_position])) {
                    case 'image':
                        imgPreloader = new Image();

                        // Preload the neighbour images
                        nextImage = new Image();
                        if (isSet && set_position < $(pp_images).size() - 1)
                            nextImage.src = pp_images[set_position + 1];
                        prevImage = new Image();
                        if (isSet && pp_images[set_position - 1])
                            prevImage.src = pp_images[set_position - 1];

                        $pp_pic_holder.find('#pp_full_res')[0].innerHTML = settings.image_markup.replace(/{path}/g, pp_images[set_position]);

                        imgPreloader.onload = function() {
                            // Fit item to viewport
                            pp_dimensions = _fitToViewport(imgPreloader.width, imgPreloader.height);

                            _showContent();
                        };

                        imgPreloader.onerror = function() {
                            alert('Image cannot be loaded. Make sure the path is correct and image exist.');
                            $.prettyPhoto.close();
                        };

                        imgPreloader.src = pp_images[set_position];
                        break;

                    case 'youtube':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        // Regular youtube link
                        movie_id = getParam('v', pp_images[set_position]);

                        // youtu.be link
                        if (movie_id == "") {
                            movie_id = pp_images[set_position].split('youtu.be/');
                            movie_id = movie_id[1];
                            if (movie_id.indexOf('?') > 0)
                                movie_id = movie_id.substr(0, movie_id.indexOf('?')); // Strip anything after the ?

                            if (movie_id.indexOf('&') > 0)
                                movie_id = movie_id.substr(0, movie_id.indexOf('&')); // Strip anything after the &
                        }

                        movie = 'http://www.youtube.com/embed/' + movie_id;
                        (getParam('rel', pp_images[set_position])) ? movie += "?rel=" + getParam('rel', pp_images[set_position]) : movie += "?rel=1";

                        if (settings.autoplay)
                            movie += "&autoplay=1";

                        toInject = settings.iframe_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);
                        break;

                    case 'vimeo':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        movie_id = pp_images[set_position];
                        var regExp = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/;
                        var match = movie_id.match(regExp);

                        movie = 'http://player.vimeo.com/video/' + match[3] + '?title=0&amp;byline=0&amp;portrait=0';
                        if (settings.autoplay)
                            movie += "&autoplay=1;";

                        vimeo_width = pp_dimensions['width'] + '/embed/?moog_width=' + pp_dimensions['width'];

                        toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, pp_dimensions['height']).replace(/{path}/g, movie);
                        break;

                    case 'quicktime':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport
                        pp_dimensions['height'] += 15;
                        pp_dimensions['contentHeight'] += 15;
                        pp_dimensions['containerHeight'] += 15; // Add space for the control bar

                        toInject = settings.quicktime_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);
                        break;

                    case 'flash':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        flash_vars = pp_images[set_position];
                        flash_vars = flash_vars.substring(pp_images[set_position].indexOf('flashvars') + 10, pp_images[set_position].length);

                        filename = pp_images[set_position];
                        filename = filename.substring(0, filename.indexOf('?'));

                        toInject = settings.flash_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + '?' + flash_vars);
                        break;

                    case 'iframe':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        frame_url = pp_images[set_position];
                        frame_url = frame_url.substr(0, frame_url.indexOf('iframe') - 1);

                        toInject = settings.iframe_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{path}/g, frame_url);
                        break;

                    case 'ajax':
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport(movie_width, movie_height);
                        doresize = true; // Reset the dimensions

                        skipInjection = true;
                        $.get(pp_images[set_position], function(responseHTML) {
                            toInject = settings.inline_markup.replace(/{content}/g, responseHTML);
                            $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
                            _showContent();
                        });

                        break;

                    case 'custom':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        toInject = settings.custom_markup;
                        break;

                    case 'inline':
                        // to get the item height clone it, apply default width, wrap it in the prettyPhoto containers , then delete
                        myClone = $(pp_images[set_position]).clone().append('<br clear="all" />').css({'width': settings.default_width}).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo($('body')).show();
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport($(myClone).width(), $(myClone).height());
                        doresize = true; // Reset the dimensions
                        $(myClone).remove();
                        toInject = settings.inline_markup.replace(/{content}/g, $(pp_images[set_position]).html());
                        break;
                }
                ;

                if (!imgPreloader && !skipInjection) {
                    $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;

                    // Show content
                    _showContent();
                }
                ;
            });

            return false;
        };


        /**
         * Change page in the prettyPhoto modal box
         * @param direction {String} Direction of the paging, previous or next.
         */
        $.prettyPhoto.changePage = function(direction) {
            currentGalleryPage = 0;

            if (direction == 'previous') {
                set_position--;
                if (set_position < 0)
                    set_position = $(pp_images).size() - 1;
            } else if (direction == 'next') {
                set_position++;
                if (set_position > $(pp_images).size() - 1)
                    set_position = 0;
            } else {
                set_position = direction;
            }
            ;

            rel_index = set_position;

            if (!doresize)
                doresize = true; // Allow the resizing of the images
            if (settings.allow_expand) {
                $('.pp_contract').removeClass('pp_contract').addClass('pp_expand');
            }

            _hideContent(function() {
                $.prettyPhoto.open();
            });
        };


        /**
         * Change gallery page in the prettyPhoto modal box
         * @param direction {String} Direction of the paging, previous or next.
         */
        $.prettyPhoto.changeGalleryPage = function(direction) {
            if (direction == 'next') {
                currentGalleryPage++;

                if (currentGalleryPage > totalPage)
                    currentGalleryPage = 0;
            } else if (direction == 'previous') {
                currentGalleryPage--;

                if (currentGalleryPage < 0)
                    currentGalleryPage = totalPage;
            } else {
                currentGalleryPage = direction;
            }
            ;

            slide_speed = (direction == 'next' || direction == 'previous') ? settings.animation_speed : 0;

            slide_to = currentGalleryPage * (itemsPerPage * itemWidth);

            $pp_gallery.find('ul').animate({left: -slide_to}, slide_speed);
        };


        /**
         * Start the slideshow...
         */
        $.prettyPhoto.startSlideshow = function() {
            if (typeof pp_slideshow == 'undefined') {
                $pp_pic_holder.find('.pp_play').unbind('click').removeClass('pp_play').addClass('pp_pause').click(function() {
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                pp_slideshow = setInterval($.prettyPhoto.startSlideshow, settings.slideshow);
            } else {
                $.prettyPhoto.changePage('next');
            }
            ;
        }


        /**
         * Stop the slideshow...
         */
        $.prettyPhoto.stopSlideshow = function() {
            $pp_pic_holder.find('.pp_pause').unbind('click').removeClass('pp_pause').addClass('pp_play').click(function() {
                $.prettyPhoto.startSlideshow();
                return false;
            });
            clearInterval(pp_slideshow);
            pp_slideshow = undefined;
        }


        /**
         * Closes prettyPhoto.
         */
        $.prettyPhoto.close = function() {
            if ($pp_overlay.is(":animated"))
                return;

            $.prettyPhoto.stopSlideshow();

            $pp_pic_holder.stop().find('object,embed').css('visibility', 'hidden');

            $('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(settings.animation_speed, function() {
                $(this).remove();
            });

            $pp_overlay.fadeOut(settings.animation_speed, function() {

                if (settings.hideflash)
                    $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility', 'visible'); // Show the flash

                $(this).remove(); // No more need for the prettyPhoto markup

                $(window).unbind('scroll.prettyphoto');

                clearHashtag();

                settings.callback();

                doresize = true;

                pp_open = false;

                delete settings;
            });
        };

        /**
         * Set the proper sizes on the containers and animate the content in.
         */
        function _showContent() {
            $('.pp_loaderIcon').hide();

            // Calculate the opened top position of the pic holder
            projectedTop = scroll_pos['scrollTop'] + ((windowHeight / 2) - (pp_dimensions['containerHeight'] / 2));
            if (projectedTop < 0)
                projectedTop = 0;

            $ppt.fadeTo(settings.animation_speed, 1);

            // Resize the content holder
            $pp_pic_holder.find('.pp_content')
                    .animate({
                height: pp_dimensions['contentHeight'],
                width: pp_dimensions['contentWidth']
            }, settings.animation_speed);

            // Resize picture the holder
            $pp_pic_holder.animate({
                'top': projectedTop,
                'left': ((windowWidth / 2) - (pp_dimensions['containerWidth'] / 2) < 0) ? 0 : (windowWidth / 2) - (pp_dimensions['containerWidth'] / 2),
                width: pp_dimensions['containerWidth']
            }, settings.animation_speed, function() {
                $pp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(pp_dimensions['height']).width(pp_dimensions['width']);

                $pp_pic_holder.find('.pp_fade').fadeIn(settings.animation_speed); // Fade the new content

                // Show the nav
                if (isSet && _getFileType(pp_images[set_position]) == "image") {
                    $pp_pic_holder.find('.pp_hoverContainer').show();
                } else {
                    $pp_pic_holder.find('.pp_hoverContainer').hide();
                }

                if (settings.allow_expand) {
                    if (pp_dimensions['resized']) { // Fade the resizing link if the image is resized
                        $('a.pp_expand,a.pp_contract').show();
                    } else {
                        $('a.pp_expand').hide();
                    }
                }

                if (settings.autoplay_slideshow && !pp_slideshow && !pp_open)
                    $.prettyPhoto.startSlideshow();

                settings.changepicturecallback(); // Callback!

                pp_open = true;
            });

            _insert_gallery();
            pp_settings.ajaxcallback();
        }
        ;

        /**
         * Hide the content...DUH!
         */
        function _hideContent(callback) {
            // Fade out the current picture
            $pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility', 'hidden');
            $pp_pic_holder.find('.pp_fade').fadeOut(settings.animation_speed, function() {
                $('.pp_loaderIcon').show();

                callback();
            });
        }
        ;

        /**
         * Check the item position in the gallery array, hide or show the navigation links
         * @param setCount {integer} The total number of items in the set
         */
        function _checkPosition(setCount) {
            (setCount > 1) ? $('.pp_nav').show() : $('.pp_nav').hide(); // Hide the bottom nav if it's not a set.
        }
        ;

        /**
         * Resize the item dimensions if it's bigger than the viewport
         * @param width {integer} Width of the item to be opened
         * @param height {integer} Height of the item to be opened
         * @return An array containin the "fitted" dimensions
         */
        function _fitToViewport(width, height) {
            resized = false;

            _getDimensions(width, height);

            // Define them in case there's no resize needed
            imageWidth = width, imageHeight = height;

            if (((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) && doresize && settings.allow_resize && !percentBased) {
                resized = true, fitting = false;

                while (!fitting) {
                    if ((pp_containerWidth > windowWidth)) {
                        imageWidth = (windowWidth - 200);
                        imageHeight = (height / width) * imageWidth;
                    } else if ((pp_containerHeight > windowHeight)) {
                        imageHeight = (windowHeight - 200);
                        imageWidth = (width / height) * imageHeight;
                    } else {
                        fitting = true;
                    }
                    ;

                    pp_containerHeight = imageHeight, pp_containerWidth = imageWidth;
                }
                ;



                if ((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) {
                    _fitToViewport(pp_containerWidth, pp_containerHeight)
                }
                ;

                _getDimensions(imageWidth, imageHeight);
            }
            ;

            return {
                width: Math.floor(imageWidth),
                height: Math.floor(imageHeight),
                containerHeight: Math.floor(pp_containerHeight),
                containerWidth: Math.floor(pp_containerWidth) + (settings.horizontal_padding * 2),
                contentHeight: Math.floor(pp_contentHeight),
                contentWidth: Math.floor(pp_contentWidth),
                resized: resized
            };
        }
        ;

        /**
         * Get the containers dimensions according to the item size
         * @param width {integer} Width of the item to be opened
         * @param height {integer} Height of the item to be opened
         */
        function _getDimensions(width, height) {
            width = parseFloat(width);
            height = parseFloat(height);

            // Get the details height, to do so, I need to clone it since it's invisible
            $pp_details = $pp_pic_holder.find('.pp_details');
            $pp_details.width(width);
            detailsHeight = parseFloat($pp_details.css('marginTop')) + parseFloat($pp_details.css('marginBottom'));

            $pp_details = $pp_details.clone().addClass(settings.theme).width(width).appendTo($('body')).css({
                'position': 'absolute',
                'top': -10000
            });
            detailsHeight += $pp_details.height();
            detailsHeight = (detailsHeight <= 34) ? 36 : detailsHeight; // Min-height for the details
            $pp_details.remove();

            // Get the titles height, to do so, I need to clone it since it's invisible
            $pp_title = $pp_pic_holder.find('.ppt');
            $pp_title.width(width);
            titleHeight = parseFloat($pp_title.css('marginTop')) + parseFloat($pp_title.css('marginBottom'));
            $pp_title = $pp_title.clone().appendTo($('body')).css({
                'position': 'absolute',
                'top': -10000
            });
            titleHeight += $pp_title.height();
            $pp_title.remove();

            // Get the container size, to resize the holder to the right dimensions
            pp_contentHeight = height + detailsHeight;
            pp_contentWidth = width;
            pp_containerHeight = pp_contentHeight + titleHeight + $pp_pic_holder.find('.pp_top').height() + $pp_pic_holder.find('.pp_bottom').height();
            pp_containerWidth = width;
        }

        function _getFileType(itemSrc) {
            if (itemSrc.match(/youtube\.com\/watch/i) || itemSrc.match(/youtu\.be/i)) {
                return 'youtube';
            } else if (itemSrc.match(/vimeo\.com/i)) {
                return 'vimeo';
            } else if (itemSrc.match(/\b.mov\b/i)) {
                return 'quicktime';
            } else if (itemSrc.match(/\b.swf\b/i)) {
                return 'flash';
            } else if (itemSrc.match(/\biframe=true\b/i)) {
                return 'iframe';
            } else if (itemSrc.match(/\bajax=true\b/i)) {
                return 'ajax';
            } else if (itemSrc.match(/\bcustom=true\b/i)) {
                return 'custom';
            } else if (itemSrc.substr(0, 1) == '#') {
                return 'inline';
            } else {
                return 'image';
            }
            ;
        }
        ;

        function _center_overlay() {
            if (doresize && typeof $pp_pic_holder != 'undefined') {
                scroll_pos = _get_scroll();
                contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width();

                projectedTop = (windowHeight / 2) + scroll_pos['scrollTop'] - (contentHeight / 2);
                if (projectedTop < 0)
                    projectedTop = 0;

                if (contentHeight > windowHeight)
                    return;

                $pp_pic_holder.css({
                    'top': projectedTop,
                    'left': (windowWidth / 2) + scroll_pos['scrollLeft'] - (contentwidth / 2)
                });
            }
            ;
        }
        ;

        function _get_scroll() {
            if (self.pageYOffset) {
                return {scrollTop: self.pageYOffset, scrollLeft: self.pageXOffset};
            } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                return {scrollTop: document.documentElement.scrollTop, scrollLeft: document.documentElement.scrollLeft};
            } else if (document.body) {// all other Explorers
                return {scrollTop: document.body.scrollTop, scrollLeft: document.body.scrollLeft};
            }
            ;
        }
        ;

        function _resize_overlay() {
            windowHeight = $(window).height(), windowWidth = $(window).width();

            if (typeof $pp_overlay != "undefined")
                $pp_overlay.height($(document).height()).width(windowWidth);
        }
        ;

        function _insert_gallery() {
            if (isSet && settings.overlay_gallery && _getFileType(pp_images[set_position]) == "image") {
                itemWidth = 52 + 5; // 52 beign the thumb width, 5 being the right margin.
                navWidth = (settings.theme == "facebook" || settings.theme == "pp_default") ? 50 : 30; // Define the arrow width depending on the theme

                itemsPerPage = Math.floor((pp_dimensions['containerWidth'] - 100 - navWidth) / itemWidth);
                itemsPerPage = (itemsPerPage < pp_images.length) ? itemsPerPage : pp_images.length;
                totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;

                // Hide the nav in the case there's no need for links
                if (totalPage == 0) {
                    navWidth = 0; // No nav means no width!
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').hide();
                } else {
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').show();
                }
                ;

                galleryWidth = itemsPerPage * itemWidth;
                fullGalleryWidth = pp_images.length * itemWidth;

                // Set the proper width to the gallery items
                $pp_gallery
                        .css('margin-left', -((galleryWidth / 2) + (navWidth / 2)))
                        .find('div:first').width(galleryWidth + 5)
                        .find('ul').width(fullGalleryWidth)
                        .find('li.selected').removeClass('selected');

                goToPage = (Math.floor(set_position / itemsPerPage) < totalPage) ? Math.floor(set_position / itemsPerPage) : totalPage;

                $.prettyPhoto.changeGalleryPage(goToPage);

                $pp_gallery_li.filter(':eq(' + set_position + ')').addClass('selected');
            } else {
                $pp_pic_holder.find('.pp_content').unbind('mouseenter mouseleave');
                // $pp_gallery.hide();
            }
        }

        function _build_overlay(caller) {
            // Inject Social Tool markup into General markup
            if (settings.social_tools)
                facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href));

            settings.markup = settings.markup.replace('{pp_social}', '');

            $('body').append(settings.markup); // Inject the markup

            $pp_pic_holder = $('.pp_pic_holder'), $ppt = $('.ppt'), $pp_overlay = $('div.pp_overlay'); // Set my global selectors

            // Inject the inline gallery!
            if (isSet && settings.overlay_gallery) {
                currentGalleryPage = 0;
                toInject = "";
                for (var i = 0; i < pp_images.length; i++) {
                    if (!pp_images[i].match(/\b(jpg|jpeg|png|gif)\b/gi)) {
                        classname = 'default';
                        img_src = '';
                    } else {
                        classname = '';
                        img_src = pp_images[i];
                    }
                    toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>";
                }
                ;

                toInject = settings.gallery_markup.replace(/{gallery}/g, toInject);

                $pp_pic_holder.find('#pp_full_res').after(toInject);

                $pp_gallery = $('.pp_pic_holder .pp_gallery'), $pp_gallery_li = $pp_gallery.find('li'); // Set the gallery selectors

                $pp_gallery.find('.pp_arrow_next').click(function() {
                    $.prettyPhoto.changeGalleryPage('next');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });

                $pp_gallery.find('.pp_arrow_previous').click(function() {
                    $.prettyPhoto.changeGalleryPage('previous');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });

                $pp_pic_holder.find('.pp_content').hover(
                        function() {
                            $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();
                        },
                        function() {
                            $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();
                        });

                itemWidth = 52 + 5; // 52 beign the thumb width, 5 being the right margin.
                $pp_gallery_li.each(function(i) {
                    $(this)
                            .find('a')
                            .click(function() {
                        $.prettyPhoto.changePage(i);
                        $.prettyPhoto.stopSlideshow();
                        return false;
                    });
                });
            }
            ;


            // Inject the play/pause if it's a slideshow
            if (settings.slideshow) {
                $pp_pic_holder.find('.pp_nav').prepend('<a href="#" class="pp_play">Play</a>')
                $pp_pic_holder.find('.pp_nav .pp_play').click(function() {
                    $.prettyPhoto.startSlideshow();
                    return false;
                });
            }

            $pp_pic_holder.attr('class', 'pp_pic_holder ' + settings.theme); // Set the proper theme

            $pp_overlay
                    .css({
                'opacity': 0,
                'height': $(document).height(),
                'width': $(window).width()
            })
                    .bind('click', function() {
                if (!settings.modal)
                    $.prettyPhoto.close();
            });

            $('a.pp_close').bind('click', function() {
                $.prettyPhoto.close();
                return false;
            });


            if (settings.allow_expand) {
                $('a.pp_expand').bind('click', function(e) {
                    // Expand the image
                    if ($(this).hasClass('pp_expand')) {
                        $(this).removeClass('pp_expand').addClass('pp_contract');
                        doresize = false;
                    } else {
                        $(this).removeClass('pp_contract').addClass('pp_expand');
                        doresize = true;
                    }
                    ;

                    _hideContent(function() {
                        $.prettyPhoto.open();
                    });

                    return false;
                });
            }

            $pp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous').bind('click', function() {
                $.prettyPhoto.changePage('previous');
                $.prettyPhoto.stopSlideshow();
                return false;
            });

            $pp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').bind('click', function() {
                $.prettyPhoto.changePage('next');
                $.prettyPhoto.stopSlideshow();
                return false;
            });

            _center_overlay(); // Center it
        }
        ;

        if (!pp_alreadyInitialized && getHashtag()) {
            pp_alreadyInitialized = true;

            // Grab the rel index to trigger the click on the correct element
            hashIndex = getHashtag();
            hashRel = hashIndex;
            hashIndex = hashIndex.substring(hashIndex.indexOf('/') + 1, hashIndex.length - 1);
            hashRel = hashRel.substring(0, hashRel.indexOf('/'));

            // Little timeout to make sure all the prettyPhoto initialize scripts has been run.
            // Useful in the event the page contain several init scripts.
            setTimeout(function() {
                $("a[" + pp_settings.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")").trigger('click');
            }, 50);
        }

        return this.unbind('click.prettyphoto').bind('click.prettyphoto', $.prettyPhoto.initialize); // Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
    };

    function getHashtag() {
        var url = location.href;
        hashtag = (url.indexOf('#prettyPhoto') !== -1) ? decodeURI(url.substring(url.indexOf('#prettyPhoto') + 1, url.length)) : false;

        return hashtag;
    }
    ;

    function setHashtag() {
        if (typeof theRel == 'undefined')
            return; // theRel is set on normal calls, it's impossible to deeplink using the API
        location.hash = theRel + '/' + rel_index + '/';
    }
    ;

    function clearHashtag() {
        if (location.href.indexOf('#prettyPhoto') !== -1)
            location.hash = "prettyPhoto";
    }

    function getParam(name, url) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return (results == null) ? "" : results[1];
    }

})(jQuery);

var pp_alreadyInitialized = false; // Used for the deep linking to make sure not to call the same function several times.
;
/********************************************
 -	THEMEPUNCH TOOLS Ver. 1.0     -
 Last Update of Tools 28.03.2013
 *********************************************/

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * Copyright(c) 2011 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/*!
 jQuery WaitForImages
 
 Copyright (c) 2012 Alex Dickson
 
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 
 
 https://github.com/alexanderdickson/waitForImages
 
 
 */

// WAIT FOR IMAGES
/*
 * waitForImages 1.4
 * -----------------
 * Provides a callback when all images have loaded in your given selector.
 * http://www.alexanderdickson.com/
 *
 *
 * Copyright (c) 2011 Alex Dickson
 * Licensed under the MIT licenses.
 * See website for more info.
 *
 */

// EASINGS

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

(function(jQuery) {
    jQuery.transit = {
        version: "0.9.9",
        // Map of $.css() keys to values for 'transitionProperty'.
        // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
        propertyMap: {
            marginLeft: 'margin',
            marginRight: 'margin',
            marginBottom: 'margin',
            marginTop: 'margin',
            paddingLeft: 'padding',
            paddingRight: 'padding',
            paddingBottom: 'padding',
            paddingTop: 'padding'
        },
        // Will simply transition "instantly" if false
        enabled: true,
        // Set this to false if you don't want to use the transition end property.
        useTransitionEnd: false
    };

    var div = document.createElement('div');
    var support = {};

    // Helper function to get the proper vendor property name.
    // (`transition` => `WebkitTransition`)
    function getVendorPropertyName(prop) {
        // Handle unprefixed versions (FF16+, for example)
        if (prop in div.style)
            return prop;

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        if (prop in div.style) {
            return prop;
        }

        for (var i = 0; i < prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) {
                return vendorProp;
            }
        }
    }

    // Helper function to check if transform3D is supported.
    // Should return true for Webkits and Firefox 10+.
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    // Check for the browser's transitions support.
    support.transition = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transform = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.transform3d = checkTransform3dSupport();

    var eventNames = {
        'transition': 'transitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition': 'MSTransitionEnd'
    };

    // Detect the 'transitionend' event needed.
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // Populate jQuery's `$.support` with the vendor prefixes we know.
    // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
    // we set $.support.transition to a string of the actual property name used.
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof jQuery.support[key] === 'undefined') {
            jQuery.support[key] = support[key];
        }
    }

    // Avoid memory leak in IE.
    div = null;

    // ## $.cssEase
    // List of easing aliases that you can use with `$.fn.transition`.
    jQuery.cssEase = {
        '_default': 'ease',
        'in': 'ease-in',
        'out': 'ease-out',
        'in-out': 'ease-in-out',
        'snap': 'cubic-bezier(0,1,.5,1)',
        // Penner equations
        'easeInCubic': 'cubic-bezier(.55, .055, .675, .19)',
        'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
        'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
    };

    // ## 'transform' CSS hook
    // Allows you to use the `transform` property in CSS.
    //
    //     $("#hello").css({ transform: "rotate(90deg)" });
    //
    //     $("#hello").css('transform');
    //     //=> { rotate: '90deg' }
    //
    jQuery.cssHooks['transit:transform'] = {
        // The getter returns a `Transform` object.
        get: function(elem) {
            return $(elem).data('transform') || new Transform();
        },
        // The setter accepts a `Transform` object or a string.
        set: function(elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            // We've seen the 3D version of Scale() not work in Chrome when the
            // element being scaled extends outside of the viewport.  Thus, we're
            // forcing Chrome to not use the 3d transforms as well.  Not sure if
            // translate is affectede, but not risking it.  Detection code from
            // http://davidwalsh.name/detecting-google-chrome-javascript
            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

    // Add a CSS hook for `.css({ transform: '...' })`.
    // In jQuery 1.8+, this will intentionally override the default `transform`
    // CSS hook so it'll play well with Transit. (see issue #62)
    jQuery.cssHooks.transform = {
        set: jQuery.cssHooks['transit:transform'].set
    };

    // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
    // be necessary.
    if (jQuery.fn.jquery < "1.8") {
        // ## 'transformOrigin' CSS hook
        // Allows the use for `transformOrigin` to define where scaling and rotation
        // is pivoted.
        //
        //     $("#hello").css({ transformOrigin: '0 0' });
        //
        jQuery.cssHooks.transformOrigin = {
            get: function(elem) {
                return elem.style[support.transformOrigin];
            },
            set: function(elem, value) {
                elem.style[support.transformOrigin] = value;
            }
        };

        // ## 'transition' CSS hook
        // Allows you to use the `transition` property in CSS.
        //
        //     $("#hello").css({ transition: 'all 0 ease 0' });
        //
        jQuery.cssHooks.transition = {
            get: function(elem) {
                return elem.style[support.transition];
            },
            set: function(elem, value) {
                elem.style[support.transition] = value;
            }
        };
    }

    // ## Other CSS hooks
    // Allows you to rotate, scale and translate.
    registerCssHook('scale');
    registerCssHook('translate');
    registerCssHook('rotate');
    registerCssHook('rotateX');
    registerCssHook('rotateY');
    registerCssHook('rotate3d');
    registerCssHook('perspective');
    registerCssHook('skewX');
    registerCssHook('skewY');
    registerCssHook('x', true);
    registerCssHook('y', true);

    // ## Transform class
    // This is the main class of a transformation property that powers
    // `jQuery.fn.css({ transform: '...' })`.
    //
    // This is, in essence, a dictionary object with key/values as `-transform`
    // properties.
    //
    //     var t = new Transform("rotate(90) scale(4)");
    //
    //     t.rotate             //=> "90deg"
    //     t.scale              //=> "4,4"
    //
    // Setters are accounted for.
    //
    //     t.set('rotate', 4)
    //     t.rotate             //=> "4deg"
    //
    // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
    // functions.
    //
    //     t.toString()         //=> "rotate(90deg) scale(4,4)"
    //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
    //
    function Transform(str) {
        if (typeof str === 'string') {
            this.parse(str);
        }
        return this;
    }

    Transform.prototype = {
        // ### setFromString()
        // Sets a property from a string.
        //
        //     t.setFromString('scale', '2,4');
        //     // Same as set('scale', '2', '4');
        //
        setFromString: function(prop, val) {
            var args =
                    (typeof val === 'string') ? val.split(',') :
                    (val.constructor === Array) ? val :
                    [val];

            args.unshift(prop);

            Transform.prototype.set.apply(this, args);
        },
        // ### set()
        // Sets a property.
        //
        //     t.set('scale', 2, 4);
        //
        set: function(prop) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[prop]) {
                this.setter[prop].apply(this, args);
            } else {
                this[prop] = args.join(',');
            }
        },
        get: function(prop) {
            if (this.getter[prop]) {
                return this.getter[prop].apply(this);
            } else {
                return this[prop] || 0;
            }
        },
        setter: {
            // ### rotate
            //
            //     .css({ rotate: 30 })
            //     .css({ rotate: "30" })
            //     .css({ rotate: "30deg" })
            //     .css({ rotate: "30deg" })
            //
            rotate: function(theta) {
                this.rotate = unit(theta, 'deg');
            },
            rotateX: function(theta) {
                this.rotateX = unit(theta, 'deg');
            },
            rotateY: function(theta) {
                this.rotateY = unit(theta, 'deg');
            },
            // ### scale
            //
            //     .css({ scale: 9 })      //=> "scale(9,9)"
            //     .css({ scale: '3,2' })  //=> "scale(3,2)"
            //
            scale: function(x, y) {
                if (y === undefined) {
                    y = x;
                }
                this.scale = x + "," + y;
            },
            // ### skewX + skewY
            skewX: function(x) {
                this.skewX = unit(x, 'deg');
            },
            skewY: function(y) {
                this.skewY = unit(y, 'deg');
            },
            // ### perspectvie
            perspective: function(dist) {
                this.perspective = unit(dist, 'px');
            },
            // ### x / y
            // Translations. Notice how this keeps the other value.
            //
            //     .css({ x: 4 })       //=> "translate(4px, 0)"
            //     .css({ y: 10 })      //=> "translate(4px, 10px)"
            //
            x: function(x) {
                this.set('translate', x, null);
            },
            y: function(y) {
                this.set('translate', null, y);
            },
            // ### translate
            // Notice how this keeps the other value.
            //
            //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
            //
            translate: function(x, y) {
                if (this._translateX === undefined) {
                    this._translateX = 0;
                }
                if (this._translateY === undefined) {
                    this._translateY = 0;
                }

                if (x !== null && x !== undefined) {
                    this._translateX = unit(x, 'px');
                }
                if (y !== null && y !== undefined) {
                    this._translateY = unit(y, 'px');
                }

                this.translate = this._translateX + "," + this._translateY;
            }
        },
        getter: {
            x: function() {
                return this._translateX || 0;
            },
            y: function() {
                return this._translateY || 0;
            },
            scale: function() {
                var s = (this.scale || "1,1").split(',');
                if (s[0]) {
                    s[0] = parseFloat(s[0]);
                }
                if (s[1]) {
                    s[1] = parseFloat(s[1]);
                }

                // "2.5,2.5" => 2.5
                // "2.5,1" => [2.5,1]
                return (s[0] === s[1]) ? s[0] : s;
            },
            rotate3d: function() {
                var s = (this.rotate3d || "0,0,0,0deg").split(',');
                for (var i = 0; i <= 3; ++i) {
                    if (s[i]) {
                        s[i] = parseFloat(s[i]);
                    }
                }
                if (s[3]) {
                    s[3] = unit(s[3], 'deg');
                }

                return s;
            }
        },
        // ### parse()
        // Parses from a string. Called on constructor.
        parse: function(str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                self.setFromString(prop, val);
            });
        },
        // ### toString()
        // Converts to a `transition` CSS property string. If `use3d` is given,
        // it converts to a `-webkit-transition` CSS property string instead.
        toString: function(use3d) {
            var re = [];

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    // Don't use 3D transformations if the browser can't support it.
                    if ((!support.transform3d) && (
                            (i === 'rotateX') ||
                            (i === 'rotateY') ||
                            (i === 'perspective') ||
                            (i === 'transformOrigin'))) {
                        continue;
                    }

                    if (i[0] !== '_') {
                        if (use3d && (i === 'scale')) {
                            re.push(i + "3d(" + this[i] + ",1)");
                        } else if (use3d && (i === 'translate')) {
                            re.push(i + "3d(" + this[i] + ",0)");
                        } else {
                            re.push(i + "(" + this[i] + ")");
                        }
                    }
                }
            }

            return re.join(" ");
        }
    };

    function callOrQueue(self, queue, fn) {
        if (queue === true) {
            self.queue(fn);
        } else if (queue) {
            self.queue(queue, fn);
        } else {
            fn();
        }
    }

    // ### getProperties(dict)
    // Returns properties (for `transition-property`) for dictionary `props`. The
    // value of `props` is what you would expect in `jQuery.css(...)`.
    function getProperties(props) {
        var re = [];

        jQuery.each(props, function(key) {
            key = jQuery.camelCase(key); // Convert "text-align" => "textAlign"
            key = jQuery.transit.propertyMap[key] || jQuery.cssProps[key] || key;
            key = uncamel(key); // Convert back to dasherized

            if (jQuery.inArray(key, re) === -1) {
                re.push(key);
            }
        });

        return re;
    }

    // ### getTransition()
    // Returns the transition string to be used for the `transition` CSS property.
    //
    // Example:
    //
    //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
    //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
    //
    function getTransition(properties, duration, easing, delay) {
        // Get the CSS properties needed.
        var props = getProperties(properties);

        // Account for aliases (`in` => `ease-in`).
        if (jQuery.cssEase[easing]) {
            easing = jQuery.cssEase[easing];
        }

        // Build the duration/easing/delay attributes for it.
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) {
            attribs += ' ' + toMS(delay);
        }

        // For more properties, add them this way:
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        jQuery.each(props, function(i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }

    // ## jQuery.fn.transition
    // Works like jQuery.fn.animate(), but uses CSS transitions.
    //
    //     $("...").transition({ opacity: 0.1, scale: 0.3 });
    //
    //     // Specific duration
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
    //
    //     // With duration and easing
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
    //
    //     // With callback
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
    //
    //     // With everything
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
    //
    //     // Alternate syntax
    //     $("...").transition({
    //       opacity: 0.1,
    //       duration: 200,
    //       delay: 40,
    //       easing: 'in',
    //       complete: function() { /* ... */ }
    //      });
    //
    jQuery.fn.transition = jQuery.fn.transit = function(properties, duration, easing, callback) {
        var self = this;
        var delay = 0;
        var queue = true;

        var theseProperties = jQuery.extend(true, {}, properties);

        // Account for `.transition(properties, callback)`.
        if (typeof duration === 'function') {
            callback = duration;
            duration = undefined;
        }

        // Account for `.transition(properties, options)`.
        if (typeof duration === 'object') {
            easing = duration.easing;
            delay = duration.delay || 0;
            queue = duration.queue || true;
            callback = duration.complete;
            duration = duration.duration;
        }

        // Account for `.transition(properties, duration, callback)`.
        if (typeof easing === 'function') {
            callback = easing;
            easing = undefined;
        }

        // Alternate syntax.
        if (typeof theseProperties.easing !== 'undefined') {
            easing = theseProperties.easing;
            delete theseProperties.easing;
        }

        if (typeof theseProperties.duration !== 'undefined') {
            duration = theseProperties.duration;
            delete theseProperties.duration;
        }

        if (typeof theseProperties.complete !== 'undefined') {
            callback = theseProperties.complete;
            delete theseProperties.complete;
        }

        if (typeof theseProperties.queue !== 'undefined') {
            queue = theseProperties.queue;
            delete theseProperties.queue;
        }

        if (typeof theseProperties.delay !== 'undefined') {
            delay = theseProperties.delay;
            delete theseProperties.delay;
        }

        // Set defaults. (`400` duration, `ease` easing)
        if (typeof duration === 'undefined') {
            duration = jQuery.fx.speeds._default;
        }
        if (typeof easing === 'undefined') {
            easing = jQuery.cssEase._default;
        }

        duration = toMS(duration);

        // Build the `transition` property.
        var transitionValue = getTransition(theseProperties, duration, easing, delay);

        // Compute delay until callback.
        // If this becomes 0, don't bother setting the transition property.
        var work = jQuery.transit.enabled && support.transition;
        var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

        // If there's nothing to do...
        if (i === 0) {
            var fn = function(next) {
                self.css(theseProperties);
                if (callback) {
                    callback.apply(self);
                }
                if (next) {
                    next();
                }
            };

            callOrQueue(self, queue, fn);
            return self;
        }

        // Save the old transitions of each element so we can restore it later.
        var oldTransitions = {};

        var run = function(nextCall) {
            var bound = false;

            // Prepare the callback.
            var cb = function() {
                if (bound) {
                    self.unbind(transitionEnd, cb);
                }

                if (i > 0) {
                    self.each(function() {
                        this.style[support.transition] = (oldTransitions[this] || null);
                    });
                }

                if (typeof callback === 'function') {
                    callback.apply(self);
                }
                if (typeof nextCall === 'function') {
                    nextCall();
                }
            };

            if ((i > 0) && (transitionEnd) && (jQuery.transit.useTransitionEnd)) {
                // Use the 'transitionend' event if it's available.
                bound = true;
                self.bind(transitionEnd, cb);
            } else {
                // Fallback to timers if the 'transitionend' event isn't supported.
                window.setTimeout(cb, i);
            }

            // Apply transitions.
            self.each(function() {
                if (i > 0) {
                    this.style[support.transition] = transitionValue;
                }
                $(this).css(properties);
            });
        };

        // Defer running. This allows the browser to paint any pending CSS it hasn't
        // painted yet before doing the transitions.
        var deferredRun = function(next) {
            this.offsetWidth; // force a repaint
            run(next);
        };

        // Use jQuery's fx queue.
        callOrQueue(self, queue, deferredRun);

        // Chainability.
        return this;
    };

    function registerCssHook(prop, isPixels) {
        // For certain properties, the 'px' should not be implied.
        if (!isPixels) {
            jQuery.cssNumber[prop] = true;
        }

        jQuery.transit.propertyMap[prop] = support.transform;

        jQuery.cssHooks[prop] = {
            get: function(elem) {
                var t = $(elem).css('transit:transform');
                return t.get(prop);
            },
            set: function(elem, value) {
                var t = $(elem).css('transit:transform');
                t.setFromString(prop, value);

                $(elem).css({'transit:transform': t});
            }
        };

    }

    // ### uncamel(str)
    // Converts a camelcase string to a dasherized string.
    // (`marginLeft` => `margin-left`)
    function uncamel(str) {
        return str.replace(/([A-Z])/g, function(letter) {
            return '-' + letter.toLowerCase();
        });
    }

    // ### unit(number, unit)
    // Ensures that number `number` has a unit. If no unit is found, assume the
    // default is `unit`.
    //
    //     unit(2, 'px')          //=> "2px"
    //     unit("30deg", 'rad')   //=> "30deg"
    //
    function unit(i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    // ### toMS(duration)
    // Converts given `duration` to a millisecond string.
    //
    // toMS('fast') => jQuery.fx.speeds[i] => "200ms"
    // toMS('normal') //=> jQuery.fx.speeds._default => "400ms"
    // toMS(10) //=> '10ms'
    // toMS('100ms') //=> '100ms'
    //
    function toMS(duration) {
        var i = duration;

        // Allow string durations like 'fast' and 'slow', without overriding numeric values.
        if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) {
            i = jQuery.fx.speeds[i] || jQuery.fx.speeds._default;
        }

        return unit(i, 'ms');
    }

    // Export some functions for testable-ness.
    jQuery.transit.getTransitionValue = getTransition;
})(jQuery);

(function(e, t) {
    jQuery.easing["jswing"] = jQuery.easing["swing"];
    jQuery.extend(jQuery.easing, {def: "easeOutQuad", swing: function(e, t, n, r, i) {
            return jQuery.easing[jQuery.easing.def](e, t, n, r, i)
        }, easeInQuad: function(e, t, n, r, i) {
            return r * (t /= i) * t + n
        }, easeOutQuad: function(e, t, n, r, i) {
            return-r * (t /= i) * (t - 2) + n
        }, easeInOutQuad: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t + n;
            return-r / 2 * (--t * (t - 2) - 1) + n
        }, easeInCubic: function(e, t, n, r, i) {
            return r * (t /= i) * t * t + n
        }, easeOutCubic: function(e, t, n, r, i) {
            return r * ((t = t / i - 1) * t * t + 1) + n
        }, easeInOutCubic: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * t + n;
            return r / 2 * ((t -= 2) * t * t + 2) + n
        }, easeInQuart: function(e, t, n, r, i) {
            return r * (t /= i) * t * t * t + n
        }, easeOutQuart: function(e, t, n, r, i) {
            return-r * ((t = t / i - 1) * t * t * t - 1) + n
        }, easeInOutQuart: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * t * t + n;
            return-r / 2 * ((t -= 2) * t * t * t - 2) + n
        }, easeInQuint: function(e, t, n, r, i) {
            return r * (t /= i) * t * t * t * t + n
        }, easeOutQuint: function(e, t, n, r, i) {
            return r * ((t = t / i - 1) * t * t * t * t + 1) + n
        }, easeInOutQuint: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * t * t * t + n;
            return r / 2 * ((t -= 2) * t * t * t * t + 2) + n
        }, easeInSine: function(e, t, n, r, i) {
            return-r * Math.cos(t / i * (Math.PI / 2)) + r + n
        }, easeOutSine: function(e, t, n, r, i) {
            return r * Math.sin(t / i * (Math.PI / 2)) + n
        }, easeInOutSine: function(e, t, n, r, i) {
            return-r / 2 * (Math.cos(Math.PI * t / i) - 1) + n
        }, easeInExpo: function(e, t, n, r, i) {
            return t == 0 ? n : r * Math.pow(2, 10 * (t / i - 1)) + n
        }, easeOutExpo: function(e, t, n, r, i) {
            return t == i ? n + r : r * (-Math.pow(2, -10 * t / i) + 1) + n
        }, easeInOutExpo: function(e, t, n, r, i) {
            if (t == 0)
                return n;
            if (t == i)
                return n + r;
            if ((t /= i / 2) < 1)
                return r / 2 * Math.pow(2, 10 * (t - 1)) + n;
            return r / 2 * (-Math.pow(2, -10 * --t) + 2) + n
        }, easeInCirc: function(e, t, n, r, i) {
            return-r * (Math.sqrt(1 - (t /= i) * t) - 1) + n
        }, easeOutCirc: function(e, t, n, r, i) {
            return r * Math.sqrt(1 - (t = t / i - 1) * t) + n
        }, easeInOutCirc: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return-r / 2 * (Math.sqrt(1 - t * t) - 1) + n;
            return r / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + n
        }, easeInElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var o = 0;
            var u = r;
            if (t == 0)
                return n;
            if ((t /= i) == 1)
                return n + r;
            if (!o)
                o = i * .3;
            if (u < Math.abs(r)) {
                u = r;
                var s = o / 4
            } else
                var s = o / (2 * Math.PI) * Math.asin(r / u);
            return-(u * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * i - s) * 2 * Math.PI / o)) + n
        }, easeOutElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var o = 0;
            var u = r;
            if (t == 0)
                return n;
            if ((t /= i) == 1)
                return n + r;
            if (!o)
                o = i * .3;
            if (u < Math.abs(r)) {
                u = r;
                var s = o / 4
            } else
                var s = o / (2 * Math.PI) * Math.asin(r / u);
            return u * Math.pow(2, -10 * t) * Math.sin((t * i - s) * 2 * Math.PI / o) + r + n
        }, easeInOutElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var o = 0;
            var u = r;
            if (t == 0)
                return n;
            if ((t /= i / 2) == 2)
                return n + r;
            if (!o)
                o = i * .3 * 1.5;
            if (u < Math.abs(r)) {
                u = r;
                var s = o / 4
            } else
                var s = o / (2 * Math.PI) * Math.asin(r / u);
            if (t < 1)
                return-.5 * u * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * i - s) * 2 * Math.PI / o) + n;
            return u * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * i - s) * 2 * Math.PI / o) * .5 + r + n
        }, easeInBack: function(e, t, n, r, i, s) {
            if (s == undefined)
                s = 1.70158;
            return r * (t /= i) * t * ((s + 1) * t - s) + n
        }, easeOutBack: function(e, t, n, r, i, s) {
            if (s == undefined)
                s = 1.70158;
            return r * ((t = t / i - 1) * t * ((s + 1) * t + s) + 1) + n
        }, easeInOutBack: function(e, t, n, r, i, s) {
            if (s == undefined)
                s = 1.70158;
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * (((s *= 1.525) + 1) * t - s) + n;
            return r / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + n
        }, easeInBounce: function(e, t, n, r, i) {
            return r - jQuery.easing.easeOutBounce(e, i - t, 0, r, i) + n
        }, easeOutBounce: function(e, t, n, r, i) {
            if ((t /= i) < 1 / 2.75) {
                return r * 7.5625 * t * t + n
            } else if (t < 2 / 2.75) {
                return r * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n
            } else if (t < 2.5 / 2.75) {
                return r * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n
            } else {
                return r * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n
            }
        }, easeInOutBounce: function(e, t, n, r, i) {
            if (t < i / 2)
                return jQuery.easing.easeInBounce(e, t * 2, 0, r, i) * .5 + n;
            return jQuery.easing.easeOutBounce(e, t * 2 - i, 0, r, i) * .5 + r * .5 + n
        }});
    e.waitForImages = {hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage"]};
    e.expr[":"].uncached = function(t) {
        var n = document.createElement("img");
        n.src = t.src;
        return e(t).is('img[src!=""]') && !n.complete
    };
    e.fn.waitForImages = function(t, n, r) {
        if (e.isPlainObject(arguments[0])) {
            n = t.each;
            r = t.waitForAll;
            t = t.finished
        }
        t = t || e.noop;
        n = n || e.noop;
        r = !!r;
        if (!e.isFunction(t) || !e.isFunction(n)) {
            throw new TypeError("An invalid callback was supplied.")
        }
        return this.each(function() {
            var i = e(this), s = [];
            if (r) {
                var o = e.waitForImages.hasImageProperties || [], u = /url\((['"]?)(.*?)\1\)/g;
                i.find("*").each(function() {
                    var t = e(this);
                    if (t.is("img:uncached")) {
                        s.push({src: t.attr("src"), element: t[0]})
                    }
                    e.each(o, function(e, n) {
                        var r = t.css(n);
                        if (!r) {
                            return true
                        }
                        var i;
                        while (i = u.exec(r)) {
                            s.push({src: i[2], element: t[0]})
                        }
                    })
                })
            } else {
                i.find("img:uncached").each(function() {
                    s.push({src: this.src, element: this})
                })
            }
            var f = s.length, l = 0;
            if (f == 0) {
                t.call(i[0])
            }
            e.each(s, function(r, s) {
                var o = new Image;
                e(o).bind("load error", function(e) {
                    l++;
                    n.call(s.element, l, f, e.type == "load");
                    if (l == f) {
                        t.call(i[0]);
                        return false
                    }
                });
                o.src = s.src
            })
        })
    };
    e.fn.swipe = function(t) {
        if (!this)
            return false;
        var n = {fingers: 1, threshold: 75, swipe: null, swipeLeft: null, swipeRight: null, swipeUp: null, swipeDown: null, swipeStatus: null, click: null, triggerOnTouchEnd: true, allowPageScroll: "auto"};
        var r = "left";
        var i = "right";
        var s = "up";
        var o = "down";
        var u = "none";
        var f = "horizontal";
        var l = "vertical";
        var c = "auto";
        var h = "start";
        var p = "move";
        var d = "end";
        var v = "cancel";
        var m = "ontouchstart"in window, g = m ? "touchstart" : "mousedown", y = m ? "touchmove" : "mousemove", b = m ? "touchend" : "mouseup", w = "touchcancel";
        var E = "start";
        if (t.allowPageScroll == undefined && (t.swipe != undefined || t.swipeStatus != undefined))
            t.allowPageScroll = u;
        if (t)
            e.extend(n, t);
        return this.each(function() {
            function t() {
                var e = S();
                if (e <= 45 && e >= 0)
                    return r;
                else if (e <= 360 && e >= 315)
                    return r;
                else if (e >= 135 && e <= 225)
                    return i;
                else if (e > 45 && e < 135)
                    return o;
                else
                    return s
            }
            function S() {
                var e = H.x - B.x;
                var t = B.y - H.y;
                var n = Math.atan2(t, e);
                var r = Math.round(n * 180 / Math.PI);
                if (r < 0)
                    r = 360 - Math.abs(r);
                return r
            }
            function x() {
                return Math.round(Math.sqrt(Math.pow(B.x - H.x, 2) + Math.pow(B.y - H.y, 2)))
            }
            function T(e, t) {
                if (n.allowPageScroll == u) {
                    e.preventDefault()
                } else {
                    var a = n.allowPageScroll == c;
                    switch (t) {
                        case r:
                            if (n.swipeLeft && a || !a && n.allowPageScroll != f)
                                e.preventDefault();
                            break;
                        case i:
                            if (n.swipeRight && a || !a && n.allowPageScroll != f)
                                e.preventDefault();
                            break;
                        case s:
                            if (n.swipeUp && a || !a && n.allowPageScroll != l)
                                e.preventDefault();
                            break;
                        case o:
                            if (n.swipeDown && a || !a && n.allowPageScroll != l)
                                e.preventDefault();
                            break
                    }
                }
            }
            function N(e, t) {
                if (n.swipeStatus)
                    n.swipeStatus.call(_, e, t, direction || null, distance || 0);
                if (t == v) {
                    if (n.click && (P == 1 || !m) && (isNaN(distance) || distance == 0))
                        n.click.call(_, e, e.target)
                }
                if (t == d) {
                    if (n.swipe) {
                        n.swipe.call(_, e, direction, distance)
                    }
                    switch (direction) {
                        case r:
                            if (n.swipeLeft)
                                n.swipeLeft.call(_, e, direction, distance);
                            break;
                        case i:
                            if (n.swipeRight)
                                n.swipeRight.call(_, e, direction, distance);
                            break;
                        case s:
                            if (n.swipeUp)
                                n.swipeUp.call(_, e, direction, distance);
                            break;
                        case o:
                            if (n.swipeDown)
                                n.swipeDown.call(_, e, direction, distance);
                            break
                    }
                }
            }
            function C(e) {
                P = 0;
                H.x = 0;
                H.y = 0;
                B.x = 0;
                B.y = 0;
                F.x = 0;
                F.y = 0
            }
            function L(e) {
                e.preventDefault();
                distance = x();
                direction = t();
                if (n.triggerOnTouchEnd) {
                    E = d;
                    if ((P == n.fingers || !m) && B.x != 0) {
                        if (distance >= n.threshold) {
                            N(e, E);
                            C(e)
                        } else {
                            E = v;
                            N(e, E);
                            C(e)
                        }
                    } else {
                        E = v;
                        N(e, E);
                        C(e)
                    }
                } else if (E == p) {
                    E = v;
                    N(e, E);
                    C(e)
                }
                M.removeEventListener(y, A, false);
                M.removeEventListener(b, L, false)
            }
            function A(e) {
                if (E == d || E == v)
                    return;
                var r = m ? e.touches[0] : e;
                B.x = r.pageX;
                B.y = r.pageY;
                direction = t();
                if (m) {
                    P = e.touches.length
                }
                E = p;
                T(e, direction);
                if (P == n.fingers || !m) {
                    distance = x();
                    if (n.swipeStatus)
                        N(e, E, direction, distance);
                    if (!n.triggerOnTouchEnd) {
                        if (distance >= n.threshold) {
                            E = d;
                            N(e, E);
                            C(e)
                        }
                    }
                } else {
                    E = v;
                    N(e, E);
                    C(e)
                }
            }
            function O(e) {
                var t = m ? e.touches[0] : e;
                E = h;
                if (m) {
                    P = e.touches.length
                }
                distance = 0;
                direction = null;
                if (P == n.fingers || !m) {
                    H.x = B.x = t.pageX;
                    H.y = B.y = t.pageY;
                    if (n.swipeStatus)
                        N(e, E)
                } else {
                    C(e)
                }
                M.addEventListener(y, A, false);
                M.addEventListener(b, L, false)
            }
            var M = this;
            var _ = e(this);
            var D = null;
            var P = 0;
            var H = {x: 0, y: 0};
            var B = {x: 0, y: 0};
            var F = {x: 0, y: 0};
            try {
                this.addEventListener(g, O, false);
                this.addEventListener(w, C)
            } catch (I) {
            }
        })
    }
})(jQuery)

// SOME ERROR MESSAGES IN CASE THE PLUGIN CAN NOT BE LOADED
function revslider_showDoubleJqueryError(sliderID) {
    var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
    errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
    errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
    errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
    errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>"
    jQuery(sliderID).show().html(errorMessage);
}
;
/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for kenburn Slider
 * @version: 3.0 (16.06.2013)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
 **************************************************************************/


(function(jQuery, undefined) {


    ////////////////////////////////////////
    // THE REVOLUTION PLUGIN STARTS HERE //
    ///////////////////////////////////////

    jQuery.fn.extend({
        // OUR PLUGIN HERE :)
        revolution: function(options) {



            ////////////////////////////////
            // SET DEFAULT VALUES OF ITEM //
            ////////////////////////////////
            jQuery.fn.revolution.defaults = {
                delay: 9000,
                startheight: 500,
                startwidth: 960,
                hideThumbs: 200,
                thumbWidth: 100, // Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
                thumbHeight: 50,
                thumbAmount: 5,
                navigationType: "bullet", // bullet, thumb, none
                navigationArrows: "withbullet", // nextto, solo, none

                navigationStyle: "round", // round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item),

                navigationHAlign: "center", // Vertical Align top,center,bottom
                navigationVAlign: "bottom", // Horizontal Align left,center,right
                navigationHOffset: 0,
                navigationVOffset: 20,
                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 20,
                soloArrowLeftVOffset: 0,
                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 20,
                soloArrowRightVOffset: 0,
                touchenabled: "on", // Enable Swipe Function : on/off
                onHoverStop: "on", // Stop Banner Timet at Hover on Slide on/off


                stopAtSlide: -1, // Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
                stopAfterLoops: -1, // Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

                hideCaptionAtLimit: 0, // It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
                hideAllCaptionAtLilmit: 0, // Hide all The Captions if Width of Browser is less then this value
                hideSliderAtLimit: 0, // Hide the whole slider, and stop also functions if Width of Browser is less than this value

                shadow: 1, //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
                fullWidth: "off", // Turns On or Off the Fullwidth Image Centering in FullWidth Modus
                fullScreen: "off",
            };

            options = jQuery.extend({}, jQuery.fn.revolution.defaults, options);




            return this.each(function() {

                var opt = options;
                var container = jQuery(this);
                if (!container.hasClass("revslider-initialised")) {

                    container.addClass("revslider-initialised");
                    if (container.attr('id') == undefined)
                        container.attr('id', "revslider-" + Math.round(Math.random() * 1000 + 5));

                    // CHECK IF FIREFOX 13 IS ON WAY.. IT HAS A STRANGE BUG, CSS ANIMATE SHOULD NOT BE USED



                    opt.firefox13 = false;
                    opt.ie = !jQuery.support.opacity;
                    opt.ie9 = (document.documentMode == 9);


                    // CHECK THE jQUERY VERSION
                    var version = jQuery.fn.jquery.split('.'),
                            versionTop = parseFloat(version[0]),
                            versionMinor = parseFloat(version[1]),
                            versionIncrement = parseFloat(version[2] || '0');

                    if (versionTop == 1 && versionMinor < 7) {
                        container.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:' + version + ' <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>');
                    }

                    if (versionTop > 1)
                        opt.ie = false;


                    // Delegate .transition() calls to .animate()
                    // if the browser can't do CSS transitions.
                    if (!jQuery.support.transition)
                        jQuery.fn.transition = jQuery.fn.animate;




                    jQuery.cssEase['Bounce'] = 'cubic-bezier(0,1,0.5,1.3)';

                    // CATCH THE CONTAINER
                    //var container=jQuery(this);
                    //container.css({'display':'block'});

                    // LOAD THE YOUTUBE API IF NECESSARY

                    container.find('.caption').each(function() {
                        jQuery(this).addClass('tp-caption')
                    });
                    var addedyt = 0;
                    var addedvim = 0;
                    var addedvid = 0;
                    container.find('.tp-caption iframe').each(function(i) {
                        try {

                            if (jQuery(this).attr('src').indexOf('you') > 0 && addedyt == 0) {
                                addedyt = 1;
                                var s = document.createElement("script");
                                s.src = "http://www.youtube.com/player_api"; /* Load Player API*/
                                var before = document.getElementsByTagName("script")[0];
                                before.parentNode.insertBefore(s, before);
                            }
                        } catch (e) {
                        }
                    });



                    // LOAD THE VIMEO API
                    container.find('.tp-caption iframe').each(function(i) {
                        try {
                            if (jQuery(this).attr('src').indexOf('vim') > 0 && addedvim == 0) {
                                addedvim = 1;
                                var f = document.createElement("script");
                                f.src = "http://a.vimeocdn.com/js/froogaloop2.min.js"; /* Load Player API*/
                                var before = document.getElementsByTagName("script")[0];
                                before.parentNode.insertBefore(f, before);
                            }
                        } catch (e) {
                        }
                    });

                    // LOAD THE VIDEO.JS API IF NEEDED
                    container.find('.tp-caption video').each(function(i) {
                        try {
                            if (jQuery(this).hasClass('video-js') && addedvid == 0) {
                                addedvid = 1;
                                var f = document.createElement("script");
                                f.src = opt.videoJsPath + "video.js"; /* Load Player API*/
                                var before = document.getElementsByTagName("script")[0];
                                before.parentNode.insertBefore(f, before);
                                jQuery('head').append('<link rel="stylesheet" type="text/css" href="' + opt.videoJsPath + 'video-js.min.css" media="screen" />');
                                jQuery('head').append('<script> videojs.options.flash.swf = "' + opt.videoJsPath + 'video-js.swf";</script>');
                            }
                        } catch (e) {
                        }
                    });

                    // SHUFFLE MODE
                    if (opt.shuffle == "on") {
                        for (var u = 0; u < container.find('>ul:first-child >li').length; u++) {
                            var it = Math.round(Math.random() * container.find('>ul:first-child >li').length);
                            container.find('>ul:first-child >li:eq(' + it + ')').prependTo(container.find('>ul:first-child'));
                        }
                    }


                    // CREATE SOME DEFAULT OPTIONS FOR LATER
                    opt.slots = 4;
                    opt.act = -1;
                    opt.next = 0;

                    // IF START SLIDE IS SET
                    if (opt.startWithSlide != undefined)
                        opt.next = opt.startWithSlide;

                    // IF DEEPLINK HAS BEEN SET
                    var deeplink = getUrlVars("#")[0];
                    if (deeplink.length < 9) {
                        if (deeplink.split('slide').length > 1) {
                            var dslide = parseInt(deeplink.split('slide')[1], 0);
                            if (dslide < 1)
                                dslide = 1;
                            if (dslide > container.find('>ul:first >li').length)
                                dslide = container.find('>ul:first >li').length;
                            opt.next = dslide - 1;
                        }
                    }


                    opt.origcd = opt.delay;

                    opt.firststart = 1;






                    // BASIC OFFSET POSITIONS OF THE BULLETS
                    if (opt.navigationHOffset == undefined)
                        opt.navOffsetHorizontal = 0;
                    if (opt.navigationVOffset == undefined)
                        opt.navOffsetVertical = 0;





                    container.append('<div class="tp-loader"></div>');

                    // RESET THE TIMER
                    if (container.find('.tp-bannertimer').length == 0)
                        container.append('<div class="tp-bannertimer" style="visibility:hidden"></div>');
                    var bt = container.find('.tp-bannertimer');
                    if (bt.length > 0) {
                        bt.css({'width': '0%'});
                    }
                    ;


                    // WE NEED TO ADD A BASIC CLASS FOR SETTINGS.CSS
                    container.addClass("tp-simpleresponsive");
                    opt.container = container;

                    //if (container.height()==0) container.height(opt.startheight);

                    // AMOUNT OF THE SLIDES
                    opt.slideamount = container.find('>ul:first >li').length;


                    // A BASIC GRID MUST BE DEFINED. IF NO DEFAULT GRID EXIST THAN WE NEED A DEFAULT VALUE, ACTUAL SIZE OF CONAINER
                    if (container.height() == 0)
                        container.height(opt.startheight);
                    if (opt.startwidth == undefined || opt.startwidth == 0)
                        opt.startwidth = container.width();
                    if (opt.startheight == undefined || opt.startheight == 0)
                        opt.startheight = container.height();

                    // OPT WIDTH && HEIGHT SHOULD BE SET
                    opt.width = container.width();
                    opt.height = container.height();


                    // DEFAULT DEPENDECIES
                    opt.bw = opt.startwidth / container.width();
                    opt.bh = opt.startheight / container.height();

                    // IF THE ITEM ALREADY IN A RESIZED FORM
                    if (opt.width != opt.startwidth) {

                        opt.height = Math.round(opt.startheight * (opt.width / opt.startwidth));
                        container.height(opt.height);

                    }

                    // LETS SEE IF THERE IS ANY SHADOW
                    if (opt.shadow != 0) {
                        container.parent().append('<div class="tp-bannershadow tp-shadow' + opt.shadow + '"></div>');

                        container.parent().find('.tp-bannershadow').css({'width': opt.width});
                    }


                    container.find('ul').css({'display': 'none'});


                    if (opt.lazyLoad != "on") {
                        // IF IMAGES HAS BEEN LOADED
                        container.waitForImages(function() {
                            // PREPARE THE SLIDES
                            container.find('ul').css({'display': 'block'});
                            prepareSlides(container, opt);

                            // CREATE BULLETS
                            if (opt.slideamount > 1)
                                createBullets(container, opt);
                            if (opt.slideamount > 1)
                                createThumbs(container, opt);
                            if (opt.slideamount > 1)
                                createArrows(container, opt);

                            jQuery('#unvisible_button').click(function() {

                                opt.navigationArrows = jQuery('.selectnavarrows').val();
                                opt.navigationType = jQuery('.selectnavtype').val();
                                opt.navigationStyle = jQuery('.selectnavstyle').val();
                                opt.soloArrowStyle = "default";

                                jQuery('.tp-bullets').remove();
                                jQuery('.tparrows').remove();

                                if (opt.slideamount > 1)
                                    createBullets(container, opt);
                                if (opt.slideamount > 1)
                                    createThumbs(container, opt);
                                if (opt.slideamount > 1)
                                    createArrows(container, opt);

                            });


                            swipeAction(container, opt);

                            if (opt.hideThumbs > 0)
                                hideThumbs(container, opt);


                            container.waitForImages(function() {
                                // START THE FIRST SLIDE

                                container.find('.tp-loader').fadeOut(600);
                                setTimeout(function() {

                                    swapSlide(container, opt);
                                    // START COUNTDOWN
                                    if (opt.slideamount > 1)
                                        countDown(container, opt);
                                    container.trigger('revolution.slide.onloaded');
                                }, 600);

                            });


                        });
                    } else {		// IF LAZY LOAD IS ACTIVATED
                        var fli = container.find('ul >li >img').first();
                        if (fli.data('lazyload') != undefined)
                            fli.attr('src', fli.data('lazyload'));
                        fli.data('lazydone', 1);
                        fli.parent().waitForImages(function() {

                            // PREPARE THE SLIDES
                            container.find('ul').css({'display': 'block'});
                            prepareSlides(container, opt);

                            // CREATE BULLETS
                            if (opt.slideamount > 1)
                                createBullets(container, opt);
                            if (opt.slideamount > 1)
                                createThumbs(container, opt);
                            if (opt.slideamount > 1)
                                createArrows(container, opt);

                            swipeAction(container, opt);

                            if (opt.hideThumbs > 0)
                                hideThumbs(container, opt);

                            fli.parent().waitForImages(function() {
                                // START THE FIRST SLIDE

                                container.find('.tp-loader').fadeOut(600);
                                setTimeout(function() {

                                    swapSlide(container, opt);
                                    // START COUNTDOWN
                                    if (opt.slideamount > 1)
                                        countDown(container, opt);
                                    container.trigger('revolution.slide.onloaded');
                                }, 600);
                            });
                        });
                    }



                    // IF RESIZED, NEED TO STOP ACTUAL TRANSITION AND RESIZE ACTUAL IMAGES
                    jQuery(window).resize(function() {
                        if (jQuery('body').find(container) != 0)
                            if (container.outerWidth(true) != opt.width) {
                                containerResized(container, opt);
                            }
                    });


                    // CHECK IF THE CAPTION IS A "SCROLL ME TO POSITION" CAPTION IS
                    //if (opt.fullScreen=="on") {
                    container.find('.tp-scrollbelowslider').on('click', function() {
                        var off = 0;
                        try {
                            off = jQuery('body').find(opt.fullScreenOffsetContainer).height();
                        } catch (e) {
                        }
                        try {
                            off = off - jQuery(this).data('scrolloffset');
                        } catch (e) {
                        }

                        jQuery('body,html').animate(
                                {scrollTop: (container.offset().top + (container.find('>ul >li').height()) - off) + "px"}, {duration: 400});
                    });
                    //}
                }

            })
        },
        // METHODE PAUSE
        revscroll: function(oy) {
            return this.each(function() {
                var container = jQuery(this);
                jQuery('body,html').animate(
                        {scrollTop: (container.offset().top + (container.find('>ul >li').height()) - oy) + "px"}, {duration: 400});
            })
        },
        // METHODE PAUSE
        revpause: function(options) {

            return this.each(function() {
                var container = jQuery(this);
                container.data('conthover', 1);
                container.data('conthover-changed', 1);
                container.trigger('revolution.slide.onpause');
                var bt = container.parent().find('.tp-bannertimer');
                bt.stop();

            })


        },
        // METHODE RESUME
        revresume: function(options) {
            return this.each(function() {
                var container = jQuery(this);
                container.data('conthover', 0);
                container.data('conthover-changed', 1);
                container.trigger('revolution.slide.onresume');
                var bt = container.parent().find('.tp-bannertimer');
                var opt = bt.data('opt');

                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            })

        },
        // METHODE NEXT
        revnext: function(options) {
            return this.each(function() {
                // CATCH THE CONTAINER
                var container = jQuery(this);
                container.parent().find('.tp-rightarrow').click();


            })

        },
        // METHODE RESUME
        revprev: function(options) {
            return this.each(function() {
                // CATCH THE CONTAINER
                var container = jQuery(this);
                container.parent().find('.tp-leftarrow').click();
            })

        },
        // METHODE LENGTH
        revmaxslide: function(options) {
            // CATCH THE CONTAINER
            return jQuery(this).find('>ul:first-child >li').length;
        },
        // METHODE CURRENT
        revcurrentslide: function(options) {
            // CATCH THE CONTAINER
            var container = jQuery(this);
            var bt = container.parent().find('.tp-bannertimer');
            var opt = bt.data('opt');
            return opt.act;
        },
        // METHODE CURRENT
        revlastslide: function(options) {
            // CATCH THE CONTAINER
            var container = jQuery(this);
            var bt = container.parent().find('.tp-bannertimer');
            var opt = bt.data('opt');
            return opt.lastslide;
        },
        // METHODE JUMP TO SLIDE
        revshowslide: function(slide) {
            return this.each(function() {
                // CATCH THE CONTAINER
                var container = jQuery(this);
                container.data('showus', slide);
                container.parent().find('.tp-rightarrow').click();
            })

        }


    })


    ///////////////////////////
    // GET THE URL PARAMETER //
    ///////////////////////////
    function getUrlVars(hashdivider)
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf(hashdivider) + 1).split('_');
        for (var i = 0; i < hashes.length; i++)
        {
            hashes[i] = hashes[i].replace('%3D', "=");
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    //////////////////////////
    //	CONTAINER RESIZED	//
    /////////////////////////
    function containerResized(container, opt) {


        container.find('.defaultimg').each(function(i) {

            setSize(jQuery(this), opt);

            opt.height = Math.round(opt.startheight * (opt.width / opt.startwidth));

            container.height(opt.height);

            setSize(jQuery(this), opt);

            try {
                container.parent().find('.tp-bannershadow').css({'width': opt.width});
            } catch (e) {
            }

            var actsh = container.find('>ul >li:eq(' + opt.act + ') .slotholder');
            var nextsh = container.find('>ul >li:eq(' + opt.next + ') .slotholder');
            removeSlots(container, opt);
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 1});

            setCaptionPositions(container, opt);

            var nextli = container.find('>ul >li:eq(' + opt.next + ')');
            container.find('.tp-caption').each(function() {
                jQuery(this).stop(true, true);
            });
            animateTheCaptions(nextli, opt);

            restartBannerTimer(opt, container);

        });
    }



    ////////////////////////////////
    //	RESTART THE BANNER TIMER //
    //////////////////////////////
    function restartBannerTimer(opt, container) {
        opt.cd = 0;
        if (opt.videoplaying != true) {
            var bt = container.find('.tp-bannertimer');
            if (bt.length > 0) {
                bt.stop();
                bt.css({'width': '0%'});
                bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});
            }
            clearTimeout(opt.thumbtimer);
            opt.thumbtimer = setTimeout(function() {
                moveSelectedThumb(container);
                setBulPos(container, opt);
            }, 200);
        }
    }

    ////////////////////////////////
    //	RESTART THE BANNER TIMER //
    //////////////////////////////
    function killBannerTimer(opt, container) {
        opt.cd = 0;

        var bt = container.find('.tp-bannertimer');
        if (bt.length > 0) {
            bt.stop(true, true);
            bt.css({'width': '0%'});
            //bt.animate({'width':"100%"},{duration:(opt.delay-100),queue:false, easing:"linear"});
        }
        clearTimeout(opt.thumbtimer);

    }

    function callingNewSlide(opt, container) {
        opt.cd = 0;
        swapSlide(container, opt);

        // STOP TIMER AND RESCALE IT
        var bt = container.find('.tp-bannertimer');
        if (bt.length > 0) {
            bt.stop();
            bt.css({'width': '0%'});
            bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});
        }
    }



    ////////////////////////////////
    //	-	CREATE THE BULLETS -  //
    ////////////////////////////////
    function createThumbs(container, opt) {

        var cap = container.parent();

        if (opt.navigationType == "thumb" || opt.navsecond == "both") {
            cap.append('<div class="tp-bullets tp-thumbs ' + opt.navigationStyle + '"><div class="tp-mask"><div class="tp-thumbcontainer"></div></div></div>');
        }
        var bullets = cap.find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer');
        var bup = bullets.parent();

        bup.width(opt.thumbWidth * opt.thumbAmount);
        bup.height(opt.thumbHeight);
        bup.parent().width(opt.thumbWidth * opt.thumbAmount);
        bup.parent().height(opt.thumbHeight);

        container.find('>ul:first >li').each(function(i) {
            var li = container.find(">ul:first >li:eq(" + i + ")");
            if (li.data('thumb') != undefined)
                var src = li.data('thumb')
            else
                var src = li.find("img:first").attr('src');
            bullets.append('<div class="bullet thumb"><img src="' + src + '"></div>');
            var bullet = bullets.find('.bullet:first');
        });
        //bullets.append('<div style="clear:both"></div>');
        var minwidth = 100;


        // ADD THE BULLET CLICK FUNCTION HERE
        bullets.find('.bullet').each(function(i) {
            var bul = jQuery(this);

            if (i == opt.slideamount - 1)
                bul.addClass('last');
            if (i == 0)
                bul.addClass('first');
            bul.width(opt.thumbWidth);
            bul.height(opt.thumbHeight);
            if (minwidth > bul.outerWidth(true))
                minwidth = bul.outerWidth(true);

            bul.click(function() {
                if (opt.transition == 0 && bul.index() != opt.act) {
                    opt.next = bul.index();
                    callingNewSlide(opt, container);
                }
            });
        });


        var max = minwidth * container.find('>ul:first >li').length;

        var thumbconwidth = bullets.parent().width();
        opt.thumbWidth = minwidth;



        ////////////////////////
        // SLIDE TO POSITION  //
        ////////////////////////
        if (thumbconwidth < max) {
            jQuery(document).mousemove(function(e) {
                jQuery('body').data('mousex', e.pageX);
            });



            // ON MOUSE MOVE ON THE THUMBNAILS EVERYTHING SHOULD MOVE :)

            bullets.parent().mouseenter(function() {
                var $this = jQuery(this);
                $this.addClass("over");
                var offset = $this.offset();
                var x = jQuery('body').data('mousex') - offset.left;
                var thumbconwidth = $this.width();
                var minwidth = $this.find('.bullet:first').outerWidth(true);
                var max = minwidth * container.find('>ul:first >li').length;
                var diff = (max - thumbconwidth) + 15;
                var steps = diff / thumbconwidth;
                x = x - 30;
                //if (x<30) x=0;
                //if (x>thumbconwidth-30) x=thumbconwidth;

                //ANIMATE TO POSITION
                var pos = (0 - ((x) * steps));
                if (pos > 0)
                    pos = 0;
                if (pos < 0 - max + thumbconwidth)
                    pos = 0 - max + thumbconwidth;
                moveThumbSliderToPosition($this, pos, 200);
            });

            bullets.parent().mousemove(function() {

                var $this = jQuery(this);

                //if (!$this.hasClass("over")) {
                var offset = $this.offset();
                var x = jQuery('body').data('mousex') - offset.left;
                var thumbconwidth = $this.width();
                var minwidth = $this.find('.bullet:first').outerWidth(true);
                var max = minwidth * container.find('>ul:first >li').length;
                var diff = (max - thumbconwidth) + 15;
                var steps = diff / thumbconwidth;
                x = x - 30;
                //if (x<30) x=0;
                //if (x>thumbconwidth-30) x=thumbconwidth;

                //ANIMATE TO POSITION
                var pos = (0 - ((x) * steps));
                if (pos > 0)
                    pos = 0;
                if (pos < 0 - max + thumbconwidth)
                    pos = 0 - max + thumbconwidth;
                moveThumbSliderToPosition($this, pos, 0);
                //} else {
                //$this.removeClass("over");
                //}

            });

            bullets.parent().mouseleave(function() {
                var $this = jQuery(this);
                $this.removeClass("over");
                moveSelectedThumb(container);
            });
        }


    }


    ///////////////////////////////
    //	SelectedThumbInPosition //
    //////////////////////////////
    function moveSelectedThumb(container) {

        var bullets = container.parent().find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer');
        var $this = bullets.parent();
        var offset = $this.offset();
        var minwidth = $this.find('.bullet:first').outerWidth(true);

        var x = $this.find('.bullet.selected').index() * minwidth;
        var thumbconwidth = $this.width();
        var minwidth = $this.find('.bullet:first').outerWidth(true);
        var max = minwidth * container.find('>ul:first >li').length;
        var diff = (max - thumbconwidth);
        var steps = diff / thumbconwidth;

        //ANIMATE TO POSITION
        var pos = 0 - x;

        if (pos > 0)
            pos = 0;
        if (pos < 0 - max + thumbconwidth)
            pos = 0 - max + thumbconwidth;
        if (!$this.hasClass("over")) {
            moveThumbSliderToPosition($this, pos, 200);
        }
    }


    ////////////////////////////////////
    //	MOVE THUMB SLIDER TO POSITION //
    ///////////////////////////////////
    function moveThumbSliderToPosition($this, pos, speed) {
        $this.stop();
        $this.find('.tp-thumbcontainer').animate({'left': pos + 'px'}, {duration: speed, queue: false});
    }



    ////////////////////////////////
    //	-	CREATE THE BULLETS -  //
    ////////////////////////////////
    function createBullets(container, opt) {

        if (opt.navigationType == "bullet" || opt.navigationType == "both") {
            container.parent().append('<div class="tp-bullets simplebullets ' + opt.navigationStyle + '"></div>');
        }


        var bullets = container.parent().find('.tp-bullets');

        container.find('>ul:first >li').each(function(i) {
            var src = container.find(">ul:first >li:eq(" + i + ") img:first").attr('src');
            bullets.append('<div class="bullet"></div>');
            var bullet = bullets.find('.bullet:first');


        });

        // ADD THE BULLET CLICK FUNCTION HERE
        bullets.find('.bullet').each(function(i) {
            var bul = jQuery(this);
            if (i == opt.slideamount - 1)
                bul.addClass('last');
            if (i == 0)
                bul.addClass('first');

            bul.click(function() {
                var sameslide = false;
                if (opt.navigationArrows == "withbullet" || opt.navigationArrows == "nexttobullets") {
                    if (bul.index() - 1 == opt.act)
                        sameslide = true;
                } else {
                    if (bul.index() == opt.act)
                        sameslide = true;
                }

                if (opt.transition == 0 && !sameslide) {

                    if (opt.navigationArrows == "withbullet" || opt.navigationArrows == "nexttobullets") {
                        opt.next = bul.index() - 1;
                    } else {
                        opt.next = bul.index();
                    }

                    callingNewSlide(opt, container);
                }
            });

        });

        bullets.append('<div class="tpclear"></div>');



        setBulPos(container, opt);





    }

    //////////////////////
    //	CREATE ARROWS	//
    /////////////////////
    function createArrows(container, opt) {

        var bullets = container.find('.tp-bullets');

        var hidden = "";
        var arst = opt.navigationStyle;
        if (opt.navigationArrows == "none")
            hidden = "visibility:none";
        opt.soloArrowStyle = "default";

        if (opt.navigationArrows != "none" && opt.navigationArrows != "nexttobullets")
            arst = opt.soloArrowStyle;

        container.parent().append('<div style="' + hidden + '" class="tp-leftarrow tparrows ' + arst + '"></div>');
        container.parent().append('<div style="' + hidden + '" class="tp-rightarrow tparrows ' + arst + '"></div>');

        // 	THE LEFT / RIGHT BUTTON CLICK !	 //
        container.parent().find('.tp-rightarrow').click(function() {

            if (opt.transition == 0) {
                if (container.data('showus') != undefined && container.data('showus') != -1)
                    opt.next = container.data('showus') - 1;
                else
                    opt.next = opt.next + 1;
                container.data('showus', -1);
                if (opt.next >= opt.slideamount)
                    opt.next = 0;
                if (opt.next < 0)
                    opt.next = 0;

                if (opt.act != opt.next)
                    callingNewSlide(opt, container);
            }
        });

        container.parent().find('.tp-leftarrow').click(function() {
            if (opt.transition == 0) {
                opt.next = opt.next - 1;
                opt.leftarrowpressed = 1;
                if (opt.next < 0)
                    opt.next = opt.slideamount - 1;
                callingNewSlide(opt, container);
            }
        });

        setBulPos(container, opt);

    }

    ////////////////////////////
    // SET THE SWIPE FUNCTION //
    ////////////////////////////
    function swipeAction(container, opt) {
        // TOUCH ENABLED SCROLL

        if (opt.touchenabled == "on")
            container.swipe({data: container,
                swipeRight: function()
                {

                    if (opt.transition == 0) {
                        opt.next = opt.next - 1;
                        opt.leftarrowpressed = 1;
                        if (opt.next < 0)
                            opt.next = opt.slideamount - 1;
                        callingNewSlide(opt, container);
                    }
                },
                swipeLeft: function()
                {

                    if (opt.transition == 0) {
                        opt.next = opt.next + 1;
                        if (opt.next == opt.slideamount)
                            opt.next = 0;
                        callingNewSlide(opt, container);
                    }
                },
                allowPageScroll: "auto"});
    }




    ////////////////////////////////////////////////////////////////
    // SHOW AND HIDE THE THUMBS IF MOUE GOES OUT OF THE BANNER  ///
    //////////////////////////////////////////////////////////////
    function hideThumbs(container, opt) {

        var bullets = container.parent().find('.tp-bullets');
        var ca = container.parent().find('.tparrows');

        if (bullets == null) {
            container.append('<div class=".tp-bullets"></div>');
            var bullets = container.parent().find('.tp-bullets');
        }

        if (ca == null) {
            container.append('<div class=".tparrows"></div>');
            var ca = container.parent().find('.tparrows');
        }


        //var bp = (thumbs.parent().outerHeight(true) - opt.height)/2;

        //	ADD THUMBNAIL IMAGES FOR THE BULLETS //
        container.data('hidethumbs', opt.hideThumbs);

        bullets.addClass("hidebullets");
        ca.addClass("hidearrows");

        bullets.hover(function() {
            bullets.addClass("hovered");
            clearTimeout(container.data('hidethumbs'));
            bullets.removeClass("hidebullets");
            ca.removeClass("hidearrows");
        },
                function() {

                    bullets.removeClass("hovered");
                    if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
                        container.data('hidethumbs', setTimeout(function() {
                            bullets.addClass("hidebullets");
                            ca.addClass("hidearrows");
                        }, opt.hideThumbs));
                });


        ca.hover(function() {
            bullets.addClass("hovered");
            clearTimeout(container.data('hidethumbs'));
            bullets.removeClass("hidebullets");
            ca.removeClass("hidearrows");

        },
                function() {

                    bullets.removeClass("hovered");
                    /*if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
                     container.data('hidethumbs', setTimeout(function() {
                     bullets.addClass("hidebullets");
                     ca.addClass("hidearrows");
                     },opt.hideThumbs));*/
                });



        container.on('mouseenter', function() {
            container.addClass("hovered");
            clearTimeout(container.data('hidethumbs'));
            bullets.removeClass("hidebullets");
            ca.removeClass("hidearrows");
        });

        container.on('mouseleave', function() {
            container.removeClass("hovered");
            if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
                container.data('hidethumbs', setTimeout(function() {
                    bullets.addClass("hidebullets");
                    ca.addClass("hidearrows");
                }, opt.hideThumbs));
        });

    }







    //////////////////////////////
    //	SET POSITION OF BULLETS	//
    //////////////////////////////
    function setBulPos(container, opt) {
        var topcont = container.parent();
        var bullets = topcont.find('.tp-bullets');
        var tl = topcont.find('.tp-leftarrow');
        var tr = topcont.find('.tp-rightarrow');

        if (opt.navigationType == "thumb" && opt.navigationArrows == "nexttobullets")
            opt.navigationArrows = "solo";
        // IM CASE WE HAVE NAVIGATION BULLETS TOGETHER WITH ARROWS
        if (opt.navigationArrows == "nexttobullets") {
            tl.prependTo(bullets).css({'float': 'left'});
            tr.insertBefore(bullets.find('.tpclear')).css({'float': 'left'});
        }


        if (opt.navigationArrows != "none" && opt.navigationArrows != "nexttobullets") {

            tl.css({'position': 'absolute'});
            tr.css({'position': 'absolute'});

            if (opt.soloArrowLeftValign == "center")
                tl.css({'top': '50%', 'marginTop': (opt.soloArrowLeftVOffset - Math.round(tl.innerHeight() / 2)) + "px"});
            if (opt.soloArrowLeftValign == "bottom")
                tl.css({'bottom': (0 + opt.soloArrowLeftVOffset) + "px"});
            if (opt.soloArrowLeftValign == "top")
                tl.css({'top': (0 + opt.soloArrowLeftVOffset) + "px"});
            if (opt.soloArrowLeftHalign == "center")
                tl.css({'left': '50%', 'marginLeft': (opt.soloArrowLeftHOffset - Math.round(tl.innerWidth() / 2)) + "px"});
            if (opt.soloArrowLeftHalign == "left")
                tl.css({'left': (0 + opt.soloArrowLeftHOffset) + "px"});
            if (opt.soloArrowLeftHalign == "right")
                tl.css({'right': (0 + opt.soloArrowLeftHOffset) + "px"});

            if (opt.soloArrowRightValign == "center")
                tr.css({'top': '50%', 'marginTop': (opt.soloArrowRightVOffset - Math.round(tr.innerHeight() / 2)) + "px"});
            if (opt.soloArrowRightValign == "bottom")
                tr.css({'bottom': (0 + opt.soloArrowRightVOffset) + "px"});
            if (opt.soloArrowRightValign == "top")
                tr.css({'top': (0 + opt.soloArrowRightVOffset) + "px"});
            if (opt.soloArrowRightHalign == "center")
                tr.css({'left': '50%', 'marginLeft': (opt.soloArrowRightHOffset - Math.round(tr.innerWidth() / 2)) + "px"});
            if (opt.soloArrowRightHalign == "left")
                tr.css({'left': (0 + opt.soloArrowRightHOffset) + "px"});
            if (opt.soloArrowRightHalign == "right")
                tr.css({'right': (0 + opt.soloArrowRightHOffset) + "px"});


            if (tl.position() != null)
                tl.css({'top': Math.round(parseInt(tl.position().top, 0)) + "px"});

            if (tr.position() != null)
                tr.css({'top': Math.round(parseInt(tr.position().top, 0)) + "px"});
        }

        if (opt.navigationArrows == "none") {
            tl.css({'visibility': 'hidden'});
            tr.css({'visibility': 'hidden'});
        }

        // SET THE POSITIONS OF THE BULLETS // THUMBNAILS


        if (opt.navigationVAlign == "center")
            bullets.css({'top': '50%', 'marginTop': (opt.navigationVOffset - Math.round(bullets.innerHeight() / 2)) + "px"});
        if (opt.navigationVAlign == "bottom")
            bullets.css({'bottom': (0 + opt.navigationVOffset) + "px"});
        if (opt.navigationVAlign == "top")
            bullets.css({'top': (0 + opt.navigationVOffset) + "px"});


        if (opt.navigationHAlign == "center")
            bullets.css({'left': '50%', 'marginLeft': (opt.navigationHOffset - Math.round(bullets.innerWidth() / 2)) + "px"});
        if (opt.navigationHAlign == "left")
            bullets.css({'left': (0 + opt.navigationHOffset) + "px"});
        if (opt.navigationHAlign == "right")
            bullets.css({'right': (0 + opt.navigationHOffset) + "px"});



    }



    //////////////////////////////////////////////////////////
    //	-	SET THE IMAGE SIZE TO FIT INTO THE CONTIANER -  //
    ////////////////////////////////////////////////////////
    function setSize(img, opt) {



        opt.width = parseInt(opt.container.width(), 0);
        opt.height = parseInt(opt.container.height(), 0);



        opt.bw = (opt.width / opt.startwidth);

        if (opt.fullScreen == "on") {
            opt.height = opt.bw * opt.startheight;
        }
        opt.bh = (opt.height / opt.startheight);



        if (opt.bh > 1) {
            opt.bh = 1;
            opt.bw = 1;
        }


        // IF IMG IS ALREADY PREPARED, WE RESET THE SIZE FIRST HERE

        if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
            if (img.data('orgw') != undefined && img.data('orgw') != 0) {
                img.width(img.data('orgw'));
                img.height(img.data('orgh'));
            }
        }

        var fw = opt.width / img.width();
        var fh = opt.height / img.height();


        opt.fw = fw;
        opt.fh = fh;


        if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
            if (img.data('orgw') == undefined || img.data('orgw') == 0) {

                img.data('orgw', img.width());
                img.data('orgh', img.height());

            }
        }



        if (opt.fullWidth == "on" && opt.fullScreen != "on") {

            var cow = opt.container.parent().width();
            var coh = opt.container.parent().height();
            var ffh = coh / img.data('orgh');
            var ffw = cow / img.data('orgw');


            if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                img.width(img.width() * ffh);
                img.height(coh);
            }

            if (img.width() < cow) {
                img.width(cow + 50);
                var ffw = img.width() / img.data('orgw');
                img.height(img.data('orgh') * ffw);

            }

            if (img.width() > cow) {
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'left': img.data('fxof') + "px"});

            }


            if (img.height() <= coh) {
                img.data('fyof', 0);
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


            if (img.height() > coh && img.data('fullwidthcentering') == "on") {
                img.data('fyof', (coh / 2 - img.height() / 2));
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


        } else

        if (opt.fullScreen == "on") {

            var cow = opt.container.parent().width();


            var coh = jQuery(window).height();

            // IF THE DEFAULT GRID IS HIGHER THEN THE CALCULATED SLIDER HEIGHT, WE NEED TO RESIZE THE SLIDER HEIGHT
            var offsety = coh / 2 - (opt.startheight * opt.bh) / 2;
            if (offsety < 0)
                coh = opt.startheight * opt.bh;


            if (opt.fullScreenOffsetContainer != undefined) {
                try {
                    coh = coh - jQuery(opt.fullScreenOffsetContainer).outerHeight(true);
                } catch (e) {
                }
            }


            opt.container.parent().height(coh);
            opt.container.css({'height': '100%'});

            opt.height = coh;


            var ffh = coh / img.data('orgh');
            var ffw = cow / img.data('orgw');


            if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                img.width(img.width() * ffh);
                img.height(coh);
            }


            if (img.width() < cow) {
                img.width(cow + 50);
                var ffw = img.width() / img.data('orgw');
                img.height(img.data('orgh') * ffw);

            }

            if (img.width() > cow) {
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'left': img.data('fxof') + "px"});

            }


            if (img.height() <= coh) {
                img.data('fyof', 0);
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


            if (img.height() > coh && img.data('fullwidthcentering') == "on") {
                img.data('fyof', (coh / 2 - img.height() / 2));
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


        } else {
            if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                img.width(opt.width);
                img.height(img.height() * fw);
            }

            if (img.height() < opt.height && img.height() != 0 && img.height() != null) {

                if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                    img.height(opt.height);
                    img.width(img.data('orgw') * fh);
                }
            }
        }



        img.data('neww', img.width());
        img.data('newh', img.height());
        if (opt.fullWidth == "on") {
            opt.slotw = Math.ceil(img.width() / opt.slots);
        } else {
            opt.slotw = Math.ceil(opt.width / opt.slots);
        }

        if (opt.fullSreen == "on")
            opt.sloth = Math.ceil(jQuery(window).height() / opt.slots);
        else
            opt.sloth = Math.ceil(opt.height / opt.slots);

    }




    /////////////////////////////////////////
    //	-	PREPARE THE SLIDES / SLOTS -  //
    ///////////////////////////////////////
    function prepareSlides(container, opt) {

        container.find('.tp-caption').each(function() {
            jQuery(this).addClass(jQuery(this).data('transition'));
            jQuery(this).addClass('start')
        });
        // PREPARE THE UL CONTAINER TO HAVEING MAX HEIGHT AND HEIGHT FOR ANY SITUATION
        container.find('>ul:first').css({overflow: 'hidden', width: '100%', height: '100%', maxHeight: container.parent().css('maxHeight')});

        container.find('>ul:first >li').each(function(j) {
            var li = jQuery(this);

            // MAKE LI OVERFLOW HIDDEN FOR FURTHER ISSUES
            li.css({'width': '100%', 'height': '100%', 'overflow': 'hidden'});

            if (li.data('link') != undefined) {
                var link = li.data('link');
                var target = "_self";
                var zindex = 2;
                if (li.data('slideindex') == "back")
                    zindex = 0;

                var linktoslide = li.data('linktoslide');
                if (li.data('target') != undefined)
                    target = li.data('target');

                if (link == "slide") {
                    li.append('<div class="tp-caption sft slidelink" style="z-index:' + zindex + ';" data-x="0" data-y="0" data-linktoslide="' + linktoslide + '" data-start="0"><a><div></div></a></div>');
                } else {
                    linktoslide = "no";
                    li.append('<div class="tp-caption sft slidelink" style="z-index:' + zindex + ';" data-x="0" data-y="0" data-linktoslide="' + linktoslide + '" data-start="0"><a target="' + target + '" href="' + link + '"><div></div></a></div>');
                }

            }
        });

        // RESOLVE OVERFLOW HIDDEN OF MAIN CONTAINER
        container.parent().css({'overflow': 'visible'});


        container.find('>ul:first >li >img').each(function(j) {

            var img = jQuery(this);
            img.addClass('defaultimg');
            if (img.data('lazyload') != undefined && img.data('lazydone') != 1) {
            } else {
                setSize(img, opt);
                setSize(img, opt);
            }
            img.wrap('<div class="slotholder"></div>');
            img.css({'opacity': 0});
            img.data('li-id', j);

        });
    }


    ///////////////////////
    // PREPARE THE SLIDE //
    //////////////////////
    function prepareOneSlide(slotholder, opt, visible) {

        var sh = slotholder;
        var img = sh.find('img')

        setSize(img, opt)
        var src = img.attr('src');
        var bgcolor = img.css('background-color');

        var w = img.data('neww');
        var h = img.data('newh');
        var fulloff = img.data("fxof");
        if (fulloff == undefined)
            fulloff = 0;

        var fullyoff = img.data("fyof");
        if (img.data('fullwidthcentering') != "on" || fullyoff == undefined)
            fullyoff = 0;

        var off = 0;


        if (!visible)
            var off = 0 - opt.slotw;

        for (var i = 0; i < opt.slots; i++)
            sh.append('<div class="slot" style="position:absolute;top:' + (0 + fullyoff) + 'px;left:' + (fulloff + i * opt.slotw) + 'px;overflow:hidden;width:' + opt.slotw + 'px;height:' + h + 'px"><div class="slotslide" style="position:absolute;top:0px;left:' + off + 'px;width:' + opt.slotw + 'px;height:' + h + 'px;overflow:hidden;"><img style="background-color:' + bgcolor + ';position:absolute;top:0px;left:' + (0 - (i * opt.slotw)) + 'px;width:' + w + 'px;height:' + h + 'px" src="' + src + '"></div></div>');

    }


    ///////////////////////
    // PREPARE THE SLIDE //
    //////////////////////
    function prepareOneSlideV(slotholder, opt, visible) {

        var sh = slotholder;
        var img = sh.find('img')
        setSize(img, opt)
        var src = img.attr('src');
        var bgcolor = img.css('background-color');
        var w = img.data('neww');
        var h = img.data('newh');
        var fulloff = img.data("fxof");
        if (fulloff == undefined)
            fulloff = 0;

        var fullyoff = img.data("fyof");
        if (img.data('fullwidthcentering') != "on" || fullyoff == undefined)
            fullyoff = 0;

        var off = 0;



        if (!visible)
            var off = 0 - opt.sloth;

        //alert(fullyoff+"  "+opt.sloth+" "opt.slots+"  "+)

        for (var i = 0; i < opt.slots + 2; i++)
            sh.append('<div class="slot" style="position:absolute;' +
                    'top:' + (fullyoff + (i * opt.sloth)) + 'px;' +
                    'left:' + (fulloff) + 'px;' +
                    'overflow:hidden;' +
                    'width:' + w + 'px;' +
                    'height:' + (opt.sloth) + 'px"' +
                    '><div class="slotslide" style="position:absolute;' +
                    'top:' + (off) + 'px;' +
                    'left:0px;width:' + w + 'px;' +
                    'height:' + opt.sloth + 'px;' +
                    'overflow:hidden;"><img style="position:absolute;' +
                    'background-color:' + bgcolor + ';' +
                    'top:' + (0 - (i * opt.sloth)) + 'px;' +
                    'left:0px;width:' + w + 'px;' +
                    'height:' + h + 'px" src="' + src + '"></div></div>');

    }


    ///////////////////////
    // PREPARE THE SLIDE //
    //////////////////////
    function prepareOneSlideBox(slotholder, opt, visible) {

        var sh = slotholder;
        var img = sh.find('img')
        setSize(img, opt)
        var src = img.attr('src');
        var bgcolor = img.css('background-color');

        var w = img.data('neww');
        var h = img.data('newh');
        var fulloff = img.data("fxof");
        if (fulloff == undefined)
            fulloff = 0;

        var fullyoff = img.data("fyof");
        if (img.data('fullwidthcentering') != "on" || fullyoff == undefined)
            fullyoff = 0;



        var off = 0;




        // SET THE MINIMAL SIZE OF A BOX
        var basicsize = 0;
        if (opt.sloth > opt.slotw)
            basicsize = opt.sloth
        else
            basicsize = opt.slotw;


        if (!visible) {
            var off = 0 - basicsize;
        }

        opt.slotw = basicsize;
        opt.sloth = basicsize;
        var x = 0;
        var y = 0;



        for (var j = 0; j < opt.slots; j++) {

            y = 0;
            for (var i = 0; i < opt.slots; i++) {


                sh.append('<div class="slot" ' +
                        'style="position:absolute;' +
                        'top:' + (fullyoff + y) + 'px;' +
                        'left:' + (fulloff + x) + 'px;' +
                        'width:' + basicsize + 'px;' +
                        'height:' + basicsize + 'px;' +
                        'overflow:hidden;">' +
                        '<div class="slotslide" data-x="' + x + '" data-y="' + y + '" ' +
                        'style="position:absolute;' +
                        'top:' + (0) + 'px;' +
                        'left:' + (0) + 'px;' +
                        'width:' + basicsize + 'px;' +
                        'height:' + basicsize + 'px;' +
                        'overflow:hidden;">' +
                        '<img style="position:absolute;' +
                        'top:' + (0 - y) + 'px;' +
                        'left:' + (0 - x) + 'px;' +
                        'width:' + w + 'px;' +
                        'height:' + h + 'px' +
                        'background-color:' + bgcolor + ';"' +
                        'src="' + src + '"></div></div>');
                y = y + basicsize;
            }
            x = x + basicsize;
        }
    }





    ///////////////////////
    //	REMOVE SLOTS	//
    /////////////////////
    function removeSlots(container, opt, time) {
        if (time == undefined)
            time == 80

        setTimeout(function() {
            container.find('.slotholder .slot').each(function() {
                clearTimeout(jQuery(this).data('tout'));
                jQuery(this).remove();
            });
            opt.transition = 0;
        }, time);
    }


    ////////////////////////
    //	CAPTION POSITION  //
    ///////////////////////
    function setCaptionPositions(container, opt) {

        // FIND THE RIGHT CAPTIONS
        var actli = container.find('>li:eq(' + opt.act + ')');
        var nextli = container.find('>li:eq(' + opt.next + ')');

        // SET THE NEXT CAPTION AND REMOVE THE LAST CAPTION
        var nextcaption = nextli.find('.tp-caption');

        if (nextcaption.find('iframe') == 0) {

            // MOVE THE CAPTIONS TO THE RIGHT POSITION
            if (nextcaption.hasClass('hcenter'))
                nextcaption.css({'height': opt.height + "px", 'top': '0px', 'left': (opt.width / 2 - nextcaption.outerWidth() / 2) + 'px'});
            else
            if (nextcaption.hasClass('vcenter'))
                nextcaption.css({'width': opt.width + "px", 'left': '0px', 'top': (opt.height / 2 - nextcaption.outerHeight() / 2) + 'px'});
        }
    }


    //////////////////////////////
    //                         //
    //	-	SWAP THE SLIDES -  //
    //                        //
    ////////////////////////////
    function swapSlide(container, opt) {
        try {
            var actli = container.find('>ul:first-child >li:eq(' + opt.act + ')');
        } catch (e) {
            var actli = container.find('>ul:first-child >li:eq(1)');
        }
        opt.lastslide = opt.act;
        var nextli = container.find('>ul:first-child >li:eq(' + opt.next + ')');

        var defimg = nextli.find('.defaultimg');

        if (defimg.data('lazyload') != undefined && defimg.data('lazydone') != 1) {
            defimg.attr('src', nextli.find('.defaultimg').data('lazyload')),
                    defimg.data('lazydone', 1);
            defimg.data('orgw', 0);
            container.find('.tp-loader').fadeIn(300);
            setTimeout(function() {
                killBannerTimer(opt, container)
            }, 180);


            nextli.waitForImages(function() {
                restartBannerTimer(opt, container)
                setSize(defimg, opt);
                setBulPos(container, opt);
                setSize(defimg, opt);
                swapSlideProgress(container, opt);
                container.find('.tp-loader').fadeOut(300);
            });

        } else {
            swapSlideProgress(container, opt);
        }
    }


    function swapSlideProgress(container, opt) {


        container.trigger('revolution.slide.onbeforeswap');


        opt.transition = 1;
        opt.videoplaying = false;
        //console.log("VideoPlay set to False due swapSlideProgress");

        try {
            var actli = container.find('>ul:first-child >li:eq(' + opt.act + ')');
        } catch (e) {
            var actli = container.find('>ul:first-child >li:eq(1)');
        }

        opt.lastslide = opt.act;

        var nextli = container.find('>ul:first-child >li:eq(' + opt.next + ')');

        var actsh = actli.find('.slotholder');
        var nextsh = nextli.find('.slotholder');
        actli.css({'visibility': 'visible'});
        nextli.css({'visibility': 'visible'});

        if (opt.ie) {
            if (comingtransition == "boxfade")
                comingtransition = "boxslide";
            if (comingtransition == "slotfade-vertical")
                comingtransition = "slotzoom-vertical";
            if (comingtransition == "slotfade-horizontal")
                comingtransition = "slotzoom-horizontal";
        }


        // IF DELAY HAS BEEN SET VIA THE SLIDE, WE TAKE THE NEW VALUE, OTHER WAY THE OLD ONE...
        if (nextli.data('delay') != undefined) {
            opt.cd = 0;
            opt.delay = nextli.data('delay');
        } else {
            opt.delay = opt.origcd;
        }

        // RESET POSITION AND FADES OF LI'S
        actli.css({'left': '0px', 'top': '0px'});
        nextli.css({'left': '0px', 'top': '0px'});


        // IF THERE IS AN OTHER FIRST SLIDE START HAS BEED SELECTED
        if (nextli.data('differentissplayed') == 'prepared') {
            nextli.data('differentissplayed', 'done');
            nextli.data('transition', nextli.data('savedtransition'));
            nextli.data('slotamount', nextli.data('savedslotamount'));
            nextli.data('masterspeed', nextli.data('savedmasterspeed'));
        }


        if (nextli.data('fstransition') != undefined && nextli.data('differentissplayed') != "done") {
            nextli.data('savedtransition', nextli.data('transition'));
            nextli.data('savedslotamount', nextli.data('slotamount'));
            nextli.data('savedmasterspeed', nextli.data('masterspeed'));

            nextli.data('transition', nextli.data('fstransition'));
            nextli.data('slotamount', nextli.data('fsslotamount'));
            nextli.data('masterspeed', nextli.data('fsmasterspeed'));

            nextli.data('differentissplayed', 'prepared');
        }

        ///////////////////////////////////////
        // TRANSITION CHOOSE - RANDOM EFFECTS//
        ///////////////////////////////////////
        var nexttrans = 0;


        var transtext = nextli.data('transition').split(",");
        var curtransid = nextli.data('nexttransid');
        if (curtransid == undefined) {
            curtransid = 0;
            nextli.data('nexttransid', curtransid);
        } else {
            curtransid = curtransid + 1;
            if (curtransid == transtext.length)
                curtransid = 0;
            nextli.data('nexttransid', curtransid);

        }



        var comingtransition = transtext[curtransid];

        if (comingtransition == "boxslide")
            nexttrans = 0
        else
        if (comingtransition == "boxfade")
            nexttrans = 1
        else
        if (comingtransition == "slotslide-horizontal")
            nexttrans = 2
        else
        if (comingtransition == "slotslide-vertical")
            nexttrans = 3
        else
        if (comingtransition == "curtain-1")
            nexttrans = 4
        else
        if (comingtransition == "curtain-2")
            nexttrans = 5
        else
        if (comingtransition == "curtain-3")
            nexttrans = 6
        else
        if (comingtransition == "slotzoom-horizontal")
            nexttrans = 7
        else
        if (comingtransition == "slotzoom-vertical")
            nexttrans = 8
        else
        if (comingtransition == "slotfade-horizontal")
            nexttrans = 9
        else
        if (comingtransition == "slotfade-vertical")
            nexttrans = 10
        else
        if (comingtransition == "fade")
            nexttrans = 11
        else
        if (comingtransition == "slideleft")
            nexttrans = 12
        else
        if (comingtransition == "slideup")
            nexttrans = 13
        else
        if (comingtransition == "slidedown")
            nexttrans = 14
        else
        if (comingtransition == "slideright")
            nexttrans = 15;
        else
        if (comingtransition == "papercut")
            nexttrans = 16;
        else
        if (comingtransition == "3dcurtain-horizontal")
            nexttrans = 17;
        else
        if (comingtransition == "3dcurtain-vertical")
            nexttrans = 18;
        else
        if (comingtransition == "cubic" || comingtransition == "cube")
            nexttrans = 19;
        else
        if (comingtransition == "flyin")
            nexttrans = 20;
        else
        if (comingtransition == "turnoff")
            nexttrans = 21;
        else {
            nexttrans = Math.round(Math.random() * 21);
            nextli.data('slotamount', Math.round(Math.random() * 12 + 4));
        }

        if (comingtransition == "random-static") {
            nexttrans = Math.round(Math.random() * 16);
            if (nexttrans > 15)
                nexttrans = 15;
            if (nexttrans < 0)
                nexttrans = 0;
        }

        if (comingtransition == "random-premium") {
            nexttrans = Math.round(Math.random() * 6 + 16);
            if (nexttrans > 21)
                nexttrans = 21;
            if (nexttrans < 16)
                nexttrans = 16;
        }



        var direction = -1;
        if (opt.leftarrowpressed == 1 || opt.act > opt.next)
            direction = 1;

        if (comingtransition == "slidehorizontal") {
            nexttrans = 12
            if (opt.leftarrowpressed == 1)
                nexttrans = 15
        }

        if (comingtransition == "slidevertical") {
            nexttrans = 13
            if (opt.leftarrowpressed == 1)
                nexttrans = 14
        }

        opt.leftarrowpressed = 0;



        if (nexttrans > 21)
            nexttrans = 21;
        if (nexttrans < 0)
            nexttrans = 0;

        if ((opt.ie || opt.ie9) && nexttrans > 18) {
            nexttrans = Math.round(Math.random() * 16);
            nextli.data('slotamount', Math.round(Math.random() * 12 + 4));
        }
        ;
        if (opt.ie && (nexttrans == 17 || nexttrans == 16 || nexttrans == 2 || nexttrans == 3 || nexttrans == 9 || nexttrans == 10))
            nexttrans = Math.round(Math.random() * 3 + 12);


        if (opt.ie9 && (nexttrans == 3))
            nexttrans = 4;




        //jQuery('body').find('.debug').html("Transition:"+nextli.data('transition')+"  id:"+nexttrans);

        // DEFINE THE MASTERSPEED FOR THE SLIDE //
        var masterspeed = 300;
        if (nextli.data('masterspeed') != undefined && nextli.data('masterspeed') > 99 && nextli.data('masterspeed') < 4001)
            masterspeed = nextli.data('masterspeed');



        /////////////////////////////////////////////
        // SET THE BULLETS SELECTED OR UNSELECTED  //
        /////////////////////////////////////////////


        container.parent().find(".bullet").each(function() {
            var bul = jQuery(this);
            bul.removeClass("selected");


            if (opt.navigationArrows == "withbullet" || opt.navigationArrows == "nexttobullets") {
                if (bul.index() - 1 == opt.next)
                    bul.addClass('selected');

            } else {

                if (bul.index() == opt.next)
                    bul.addClass('selected');

            }
        });


        //////////////////////////////////////////////////////////////////
        // 		SET THE NEXT CAPTION AND REMOVE THE LAST CAPTION		//
        //////////////////////////////////////////////////////////////////

        container.find('>li').each(function() {
            var li = jQuery(this);
            if (li.index != opt.act && li.index != opt.next)
                li.css({'z-index': 16});
        });

        actli.css({'z-index': 18});
        nextli.css({'z-index': 20});
        nextli.css({'opacity': 0});


        ///////////////////////////
        //	ANIMATE THE CAPTIONS //
        ///////////////////////////
        if (actli.index() != nextli.index()) {
            removeTheCaptions(actli, opt);

        }
        animateTheCaptions(nextli, opt);




        /////////////////////////////////////////////
        //	SET THE ACTUAL AMOUNT OF SLIDES !!     //
        //  SET A RANDOM AMOUNT OF SLOTS          //
        ///////////////////////////////////////////
        if (nextli.data('slotamount') == undefined || nextli.data('slotamount') < 1) {
            opt.slots = Math.round(Math.random() * 12 + 4);
            if (comingtransition == "boxslide")
                opt.slots = Math.round(Math.random() * 6 + 3);
        } else {
            opt.slots = nextli.data('slotamount');

        }

        /////////////////////////////////////////////
        //	SET THE ACTUAL AMOUNT OF SLIDES !!     //
        //  SET A RANDOM AMOUNT OF SLOTS          //
        ///////////////////////////////////////////
        if (nextli.data('rotate') == undefined)
            opt.rotate = 0
        else
        if (nextli.data('rotate') == 999)
            opt.rotate = Math.round(Math.random() * 360);
        else
            opt.rotate = nextli.data('rotate');
        if (!jQuery.support.transition || opt.ie || opt.ie9)
            opt.rotate = 0;



        //////////////////////////////
        //	FIRST START 			//
        //////////////////////////////

        if (opt.firststart == 1) {
            actli.css({'opacity': 0});
            opt.firststart = 0;
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 0) {								// BOXSLIDE

            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideBox(actsh, opt, true);
            prepareOneSlideBox(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({top: (0 - opt.sloth), left: (0 - opt.slotw)}, 0);
                else
                    ss.transition({top: (0 - opt.sloth), left: (0 - opt.slotw), rotate: opt.rotate}, 0);
                setTimeout(function() {
                    ss.transition({top: 0, left: 0, scale: 1, rotate: 0}, masterspeed * 1.5, function() {

                        if (j == (opt.slots * opt.slots) - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 15);
            });
        }



        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 1) {


            if (opt.slots > 5)
                opt.slots = 5;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            //prepareOneSlideBox(actsh,opt,true);
            prepareOneSlideBox(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.css({'opacity': 0});
                ss.find('img').css({'opacity': 0});
                if (opt.ie9)
                    ss.find('img').transition({'top': (Math.random() * opt.slotw - opt.slotw) + "px", 'left': (Math.random() * opt.slotw - opt.slotw) + "px"}, 0);
                else
                    ss.find('img').transition({'top': (Math.random() * opt.slotw - opt.slotw) + "px", 'left': (Math.random() * opt.slotw - opt.slotw) + "px", rotate: opt.rotate}, 0);

                var rand = Math.random() * 1000 + (masterspeed + 200);
                if (j == (opt.slots * opt.slots) - 1)
                    rand = 1500;

                ss.find('img').transition({'opacity': 1, 'top': (0 - ss.data('y')) + "px", 'left': (0 - ss.data('x')) + 'px', rotate: 0}, rand);
                ss.transition({'opacity': 1}, rand, function() {
                    if (j == (opt.slots * opt.slots) - 1) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;

                        moveSelectedThumb(container);
                    }

                });


            });
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 2) {


            masterspeed = masterspeed + 200;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this);


                //ss.animate({'left':opt.slotw+'px'},{duration:masterspeed,queue:false,complete:function() {
                ss.transit({'left': opt.slotw + 'px', rotate: (0 - opt.rotate)}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);

                });

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function() {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transit({'left': (0 - opt.slotw) + "px"}, 0);
                else
                    ss.transit({'left': (0 - opt.slotw) + "px", rotate: opt.rotate}, 0);

                ss.transit({'left': '0px', rotate: 0}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    if (opt.ie)
                        actsh.find('.defaultimg').css({'opacity': 1});
                    opt.act = opt.next;

                    moveSelectedThumb(container);

                });

            });
        }



        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 3) {


            masterspeed = masterspeed + 200;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});

            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this);

                ss.transit({'top': opt.sloth + 'px', rotate: opt.rotate}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);

                });

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function() {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transit({'top': (0 - opt.sloth) + "px"}, 0);
                else
                    ss.transit({'top': (0 - opt.sloth) + "px", rotate: opt.rotate}, 0);
                ss.transit({'top': '0px', rotate: 0}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);

                });

            });
        }



        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 4) {



            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            actsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);

                ss.transit({'top': (0 + (opt.height)) + "px", 'opacity': 1, rotate: opt.rotate}, masterspeed + (i * (70 - opt.slots)));
            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0}, 0);
                else
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0, rotate: opt.rotate}, 0);

                ss.transition({'top': '0px', 'opacity': 1, rotate: 0}, masterspeed + (i * (70 - opt.slots)), function() {
                    if (i == opt.slots - 1) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;
                        moveSelectedThumb(container);
                    }

                });

            });
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 5) {



            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 0});

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            actsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);

                ss.transition({'top': (0 + (opt.height)) + "px", 'opacity': 1, rotate: opt.rotate}, masterspeed + ((opt.slots - i) * (70 - opt.slots)));

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0}, 0);
                else
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0, rotate: opt.rotate}, 0);

                ss.transition({'top': '0px', 'opacity': 1, rotate: 0}, masterspeed + ((opt.slots - i) * (70 - opt.slots)), function() {
                    if (i == 0) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;
                        moveSelectedThumb(container);
                    }

                });

            });
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 6) {



            nextli.css({'opacity': 1});
            if (opt.slots < 2)
                opt.slots = 2;
            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 0});


            actsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);

                if (i < opt.slots / 2)
                    var tempo = (i + 2) * 60;
                else
                    var tempo = (2 + opt.slots - i) * 60;


                ss.transition({'top': (0 + (opt.height)) + "px", 'opacity': 1}, masterspeed + tempo);

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0}, 0);
                else
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0, rotate: opt.rotate}, 0);
                if (i < opt.slots / 2)
                    var tempo = (i + 2) * 60;
                else
                    var tempo = (2 + opt.slots - i) * 60;


                ss.transition({'top': '0px', 'opacity': 1, rotate: 0}, masterspeed + tempo, function() {
                    if (i == Math.round(opt.slots / 2)) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;
                        moveSelectedThumb(container);
                    }

                });

            });
        }


        ////////////////////////////////////
        // THE SLOTSZOOM - TRANSITION II. //
        ////////////////////////////////////
        if (nexttrans == 7) {

            masterspeed = masterspeed * 3;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});

            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this).find('img');

                ss.transition({'left': (0 - opt.slotw / 2) + 'px',
                    'top': (0 - opt.height / 2) + 'px',
                    'width': (opt.slotw * 2) + "px",
                    'height': (opt.height * 2) + "px",
                    opacity: 0,
                    rotate: opt.rotate
                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });

            });

            /						//////////////////////////////////////////////////////////////
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
            ///////////////////////////////////////////////////////////////
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this).find('img');

                if (opt.ie9)
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0}, 0);
                else
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0, rotate: opt.rotate}, 0);
                ss.transition({'left': (0 - i * opt.slotw) + 'px',
                    'top': (0) + 'px',
                    'width': (nextsh.find('.defaultimg').data('neww')) + "px",
                    'height': (nextsh.find('.defaultimg').data('newh')) + "px",
                    opacity: 1, rotate: 0

                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });


            });
        }




        ////////////////////////////////////
        // THE SLOTSZOOM - TRANSITION II. //
        ////////////////////////////////////
        if (nexttrans == 8) {

            masterspeed = masterspeed * 3;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});

            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this).find('img');

                ss.transition({'left': (0 - opt.width / 2) + 'px',
                    'top': (0 - opt.sloth / 2) + 'px',
                    'width': (opt.width * 2) + "px",
                    'height': (opt.sloth * 2) + "px",
                    opacity: 0, rotate: opt.rotate
                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});

                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });

            });


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
            ///////////////////////////////////////////////////////////////
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this).find('img');
                if (opt.ie9)
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0}, 0);
                else
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0, rotate: opt.rotate}, 0);
                ss.transition({'left': (0) + 'px',
                    'top': (0 - i * opt.sloth) + 'px',
                    'width': (nextsh.find('.defaultimg').data('neww')) + "px",
                    'height': (nextsh.find('.defaultimg').data('newh')) + "px",
                    opacity: 1, rotate: 0
                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});

                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });

            });
        }


        ////////////////////////////////////////
        // THE SLOTSFADE - TRANSITION III.   //
        //////////////////////////////////////
        if (nexttrans == 9) {



            nextli.css({'opacity': 1});

            opt.slots = opt.width / 20;

            prepareOneSlide(nextsh, opt, true);


            //actsh.find('.defaultimg').css({'opacity':0});
            nextsh.find('.defaultimg').css({'opacity': 0});

            var ssamount = 0;
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                ssamount++;
                ss.transition({'opacity': 0, x: 0, y: 0}, 0);
                ss.data('tout', setTimeout(function() {
                    ss.transition({x: 0, y: 0, 'opacity': 1}, masterspeed);

                }, i * 4)
                        );

            });

            //nextsh.find('.defaultimg').transition({'opacity':1},(masterspeed+(ssamount*4)));

            setTimeout(function() {
                removeSlots(container, opt);
                nextsh.find('.defaultimg').css({'opacity': 1});
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                if (opt.ie)
                    actsh.find('.defaultimg').css({'opacity': 1});

                opt.act = opt.next;
                moveSelectedThumb(container);
            }, (masterspeed + (ssamount * 4)));
        }




        ////////////////////////////////////////
        // THE SLOTSFADE - TRANSITION III.   //
        //////////////////////////////////////
        if (nexttrans == 10) {



            nextli.css({'opacity': 1});

            opt.slots = opt.height / 20;

            prepareOneSlideV(nextsh, opt, true);


            //actsh.find('.defaultimg').css({'opacity':0});
            nextsh.find('.defaultimg').css({'opacity': 0});

            var ssamount = 0;
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                ssamount++;
                ss.transition({'opacity': 0, x: 0, y: 0}, 0);
                ss.data('tout', setTimeout(function() {
                    ss.transition({x: 0, y: 0, 'opacity': 1}, masterspeed);

                }, i * 4)
                        );

            });

            //nextsh.find('.defaultimg').transition({'opacity':1},(masterspeed+(ssamount*4)));

            setTimeout(function() {
                removeSlots(container, opt);
                nextsh.find('.defaultimg').css({'opacity': 1});
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                if (opt.ie)
                    actsh.find('.defaultimg').css({'opacity': 1});

                opt.act = opt.next;
                moveSelectedThumb(container);
            }, (masterspeed + (ssamount * 4)));
        }


        ///////////////////////////
        // SIMPLE FADE ANIMATION //
        ///////////////////////////

        if (nexttrans == 11) {



            nextli.css({'opacity': 1});

            opt.slots = 1;

            prepareOneSlide(nextsh, opt, true);


            //actsh.find('.defaultimg').css({'opacity':0});
            nextsh.find('.defaultimg').css({'opacity': 0, 'position': 'relative'});

            var ssamount = 0;
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                ssamount++;

                if (opt.ie9 || opt.ie) {
                    if (opt.ie)
                        nextli.css({'opacity': '0'});
                    ss.css({'opacity': 0});

                } else
                    ss.transition({'opacity': 0, rotate: opt.rotate}, 0);


                setTimeout(function() {
                    if (opt.ie9 || opt.ie) {
                        if (opt.ie)
                            nextli.animate({'opacity': 1}, {duration: masterspeed});
                        else
                            ss.transition({'opacity': 1}, masterspeed);

                    } else {
                        ss.transition({'opacity': 1, rotate: 0}, masterspeed);
                    }
                }, 10);
            });

            setTimeout(function() {
                removeSlots(container, opt);
                nextsh.find('.defaultimg').css({'opacity': 1});
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                if (opt.ie)
                    actsh.find('.defaultimg').css({'opacity': 1});

                opt.act = opt.next;
                moveSelectedThumb(container);
            }, masterspeed + 15);
        }






        if (nexttrans == 12 || nexttrans == 13 || nexttrans == 14 || nexttrans == 15) {

            masterspeed = masterspeed * 3;
            nextli.css({'opacity': 1});

            opt.slots = 1;

            prepareOneSlide(nextsh, opt, true);
            prepareOneSlide(actsh, opt, true);


            actsh.find('.defaultimg').css({'opacity': 0});
            nextsh.find('.defaultimg').css({'opacity': 0});

            var oow = opt.width;
            var ooh = opt.height;


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            var ssn = nextsh.find('.slotslide')

            if (opt.fullWidth == "on" || opt.fullSreen == "on") {
                oow = ssn.width();
                ooh = ssn.height();
            }

            if (nexttrans == 12)
                if (opt.ie9) {
                    ssn.transition({'left': oow + "px"}, 0);

                } else {
                    ssn.transition({'left': oow + "px", rotate: opt.rotate}, 0);

                }
            else
            if (nexttrans == 15)
                if (opt.ie9)
                    ssn.transition({'left': (0 - oow) + "px"}, 0);
                else
                    ssn.transition({'left': (0 - oow) + "px", rotate: opt.rotate}, 0);
            else
            if (nexttrans == 13)
                if (opt.ie9)
                    ssn.transition({'top': (ooh) + "px"}, 0);
                else
                    ssn.transition({'top': (ooh) + "px", rotate: opt.rotate}, 0);
            else
            if (nexttrans == 14)
                if (opt.ie9)
                    ssn.transition({'top': (0 - ooh) + "px"}, 0);
                else
                    ssn.transition({'top': (0 - ooh) + "px", rotate: opt.rotate}, 0);


            ssn.transition({'left': '0px', 'top': '0px', opacity: 1, rotate: 0}, masterspeed, function() {


                removeSlots(container, opt, 0);
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                nextsh.find('.defaultimg').css({'opacity': 1});
                opt.act = opt.next;
                moveSelectedThumb(container);
            });



            var ssa = actsh.find('.slotslide');

            if (nexttrans == 12)
                ssa.transition({'left': (0 - oow) + 'px', opacity: 1, rotate: 0}, masterspeed);
            else
            if (nexttrans == 15)
                ssa.transition({'left': (oow) + 'px', opacity: 1, rotate: 0}, masterspeed);
            else
            if (nexttrans == 13)
                ssa.transition({'top': (0 - ooh) + 'px', opacity: 1, rotate: 0}, masterspeed);
            else
            if (nexttrans == 14)
                ssa.transition({'top': (ooh) + 'px', opacity: 1, rotate: 0}, masterspeed);



        }


        //////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XVI.  //
        //////////////////////////////////////
        if (nexttrans == 16) {						// PAPERCUT

            actli.css({'position': 'absolute', 'z-index': 20});
            nextli.css({'position': 'absolute', 'z-index': 15});
            // PREPARE THE CUTS
            actli.wrapInner('<div class="tp-half-one"></div>');
            actli.find('.tp-half-one').clone(true).appendTo(actli).addClass("tp-half-two");
            actli.find('.tp-half-two').removeClass('tp-half-one');
            actli.find('.tp-half-two').wrapInner('<div class="tp-offset"></div>');

            var oow = opt.width;
            var ooh = opt.height;
            if (opt.fullWidth == "on" || opt.fullSreen == "on") {
                oow = opt.container.parent().width();
                ooh = opt.container.parent().height();
            }


            // ANIMATE THE CUTS
            var img = actli.find('.defaultimg');
            if (img.length > 0 && img.data("fullwidthcentering") == "on") {
                var imgh = ooh / 2;
                var to = img.position().top;
            } else {

                var imgh = ooh / 2;
                var to = 0;
            }
            actli.find('.tp-half-one').css({'width': oow + "px", 'height': (to + imgh) + "px", 'overflow': 'hidden', 'position': 'absolute', 'top': '0px', 'left': '0px'});
            actli.find('.tp-half-two').css({'width': oow + "px", 'height': (to + imgh) + "px", 'overflow': 'hidden', 'position': 'absolute', 'top': (to + imgh) + 'px', 'left': '0px'});
            actli.find('.tp-half-two .tp-offset').css({'position': 'absolute', 'top': (0 - imgh - to) + 'px', 'left': '0px'});




            // Delegate .transition() calls to .animate()
            // if the browser can't do CSS transitions.
            if (!jQuery.support.transition) {

                actli.find('.tp-half-one').animate({'opacity': 0, 'top': (0 - ooh / 2) + "px"}, {duration: 500, queue: false});
                actli.find('.tp-half-two').animate({'opacity': 0, 'top': (ooh) + "px"}, {duration: 500, queue: false});
            } else {
                var ro1 = Math.round(Math.random() * 40 - 20);
                var ro2 = Math.round(Math.random() * 40 - 20);
                var sc1 = Math.random() * 1 + 1;
                var sc2 = Math.random() * 1 + 1;
                actli.find('.tp-half-one').transition({opacity: 1, scale: sc1, rotate: ro1, y: (0 - ooh / 1.4) + "px"}, 800, 'in');
                actli.find('.tp-half-two').transition({opacity: 1, scale: sc2, rotate: ro2, y: (0 + ooh / 1.4) + "px"}, 800, 'in');

                if (actli.html() != null)
                    nextli.transition({scale: 0.8, x: opt.width * 0.1, y: ooh * 0.1, rotate: ro1}, 0).transition({rotate: 0, scale: 1, x: 0, y: 0}, 600, 'snap');
            }
            nextsh.find('.defaultimg').css({'opacity': 1});
            setTimeout(function() {


                // CLEAN UP BEFORE WE START
                actli.css({'position': 'absolute', 'z-index': 18});
                nextli.css({'position': 'absolute', 'z-index': 20});
                nextsh.find('.defaultimg').css({'opacity': 1});
                actsh.find('.defaultimg').css({'opacity': 0});
                if (actli.find('.tp-half-one').length > 0) {
                    actli.find('.tp-half-one >img, .tp-half-one >div').unwrap();

                }
                actli.find('.tp-half-two').remove();
                opt.transition = 0;
                opt.act = opt.next;

            }, 800);
            nextli.css({'opacity': 1});

        }

        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XVII.  //
        ///////////////////////////////////////
        if (nexttrans == 17) {								// 3D CURTAIN HORIZONTAL

            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({opacity: 0, rotateY: 350, rotateX: 40, perspective: '1400px'}, 0);
                setTimeout(function() {
                    ss.transition({opacity: 1, top: 0, left: 0, scale: 1, perspective: '150px', rotate: 0, rotateY: 0, rotateX: 0}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });
        }



        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XVIII.  //
        ///////////////////////////////////////
        if (nexttrans == 18) {								// 3D CURTAIN VERTICAL

            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({rotateX: 10, rotateY: 310, perspective: '1400px', rotate: 0, opacity: 0}, 0);
                setTimeout(function() {
                    ss.transition({top: 0, left: 0, scale: 1, perspective: '150px', rotate: 0, rotateY: 0, rotateX: 0, opacity: 1}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });
        }

        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XIX.  //
        ///////////////////////////////////////
        if (nexttrans == 19) {								// CUBIC VERTICAL
            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});
            var chix = nextli.css('z-index');
            var chix2 = actli.css('z-index');

            //actli.css({'z-index':22});



            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                //ss.css({'overflow':'visible'});
                ss.parent().css({'overflow': 'visible'});
                ss.css({'background': '#333'});
                if (direction == 1)
                    ss.transition({opacity: 0, left: 0, top: opt.height / 2, rotate3d: '1, 0, 0, -90deg '}, 0);
                else
                    ss.transition({opacity: 0, left: 0, top: 0 - opt.height / 2, rotate3d: '1, 0, 0, 90deg '}, 0);

                setTimeout(function() {

                    ss.transition({opacity: 1, top: 0, perspective: opt.height * 2, rotate3d: ' 1, 0, 0, 0deg '}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 150);

            });

            actsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.parent().css({'overflow': 'visible'});
                ss.css({'background': '#333'});
                ss.transition({top: 0, rotate3d: '1, 0, 0, 0deg'}, 0);
                actsh.find('.defaultimg').css({'opacity': 0});
                setTimeout(function() {
                    if (direction == 1)
                        ss.transition({opacity: 0.6, left: 0, perspective: opt.height * 2, top: 0 - opt.height / 2, rotate3d: '1, 0, 0, 90deg'}, masterspeed * 2, function() {
                        });
                    else
                        ss.transition({opacity: 0.6, left: 0, perspective: opt.height * 2, top: (0 + opt.height / 2), rotate3d: '1, 0, 0, -90deg'}, masterspeed * 2, function() {
                        });
                }, j * 150);
            });
        }

        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XX.  //
        ///////////////////////////////////////
        if (nexttrans == 20) {								// FLYIN
            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;



            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.parent().css({'overflow': 'visible'});

                if (direction == 1)
                    ss.transition({scale: 0.8, top: 0, left: 0 - opt.width, rotate3d: '2, 5, 0, 110deg'}, 0);
                else
                    ss.transition({scale: 0.8, top: 0, left: 0 + opt.width, rotate3d: '2, 5, 0, -110deg'}, 0);
                setTimeout(function() {
                    ss.transition({scale: 0.8, left: 0, perspective: opt.width, rotate3d: '1, 5, 0, 0deg'}, masterspeed * 2, 'ease').transition({scale: 1}, 200, 'out', function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });

            actsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({scale: 0.5, left: 0, rotate3d: '1, 5, 0, 5deg'}, 300, 'in-out');
                actsh.find('.defaultimg').css({'opacity': 0});
                setTimeout(function() {
                    if (direction == 1)
                        ss.transition({top: 0, left: opt.width / 2, perspective: opt.width, rotate3d: '0, -3, 0, 70deg', opacity: 0}, masterspeed * 2, 'out', function() {
                        });
                    else
                        ss.transition({top: 0, left: 0 - opt.width / 2, perspective: opt.width, rotate3d: '0, -3, 0, -70deg', opacity: 0}, masterspeed * 2, 'out', function() {
                        });
                }, j * 100);
            });
        }


        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XX.  //
        ///////////////////////////////////////
        if (nexttrans == 21) {								// TURNOFF
            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                if (direction == 1)
                    ss.transition({top: 0, left: 0 - (opt.width), rotate3d: '0, 1, 0, 90deg'}, 0);
                else
                    ss.transition({top: 0, left: 0 + (opt.width), rotate3d: '0, 1, 0, -90deg'}, 0);
                setTimeout(function() {
                    ss.transition({left: 0, perspective: opt.width * 2, rotate3d: '0, 0, 0, 0deg'}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });

            actsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({left: 0, rotate3d: '0, 0, 0, 0deg'}, 0);
                actsh.find('.defaultimg').css({'opacity': 0});
                setTimeout(function() {
                    if (direction == 1)
                        ss.transition({top: 0, left: (opt.width / 2), perspective: opt.width, rotate3d: '0, 1, 0, -90deg'}, masterspeed * 1.5, function() {
                        });
                    else
                        ss.transition({top: 0, left: (0 - opt.width / 2), perspective: opt.width, rotate3d: '0, 1, 0, +90deg'}, masterspeed * 1.5, function() {
                        });

                }, j * 100);
            });
        }


        var data = {};
        data.slideIndex = opt.next + 1;
        container.trigger('revolution.slide.onchange', data);
        setTimeout(function() {
            container.trigger('revolution.slide.onafterswap');
        }, masterspeed);
        container.trigger('revolution.slide.onvideostop');


    }




    function onYouTubePlayerAPIReady() {

    }


    //////////////////////////////////////////
    // CHANG THE YOUTUBE PLAYER STATE HERE //
    ////////////////////////////////////////
    function onPlayerStateChange(event) {

        if (event.data == YT.PlayerState.PLAYING) {

            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            bt.stop();

            opt.videoplaying = true;
            //console.log("VideoPlay set to True due onPlayerStateChange PLAYING");
            opt.videostartednow = 1;

        } else {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');

            if (event.data != -1) {
                if (opt.conthover == 0)
                    bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                opt.videoplaying = false;
                opt.videostoppednow = 1;
                //console.log("VideoPlay set to False due onPlayerStateChange PAUSE");
            }

        }
        if (event.data == 0 && opt.nextslideatend == true)
            opt.container.revnext();


    }

    ///////////////////////////////
    //	YOUTUBE VIDEO AUTOPLAY //
    ///////////////////////////////
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    ////////////////////////
    // VIMEO ADD EVENT /////
    ////////////////////////
    function addEvent(element, eventName, callback) {

        if (element.addEventListener) {

            element.addEventListener(eventName, callback, false);
        }
        else {

            element.attachEvent(eventName, callback, false);
        }


    }

    //////////////////////////////////////////
    // CHANGE THE YOUTUBE PLAYER STATE HERE //
    ////////////////////////////////////////
    function vimeoready(player_id) {

        var froogaloop = $f(player_id);

        //jQuery('#debug').html(jQuery('#debug').html()+" <br>Frooga Func"+Math.round(Math.random()*100));

        froogaloop.addEvent('ready', function(data) {
            //jQuery('#debug').html(jQuery('#debug').html()+" <br>Ready"+Math.round(Math.random()*100));
            froogaloop.addEvent('play', function(data) {
                //jQuery('#debug').html(jQuery('#debug').html()+" <br>Play"+Math.round(Math.random()*100));

                var bt = jQuery('body').find('.tp-bannertimer');
                var opt = bt.data('opt');
                bt.stop();
                opt.videoplaying = true;
                //console.log("VideoPlay set to True due vimeoready PLAYING");
            });

            froogaloop.addEvent('finish', function(data) {
                var bt = jQuery('body').find('.tp-bannertimer');
                var opt = bt.data('opt');
                if (opt.conthover == 0)
                    bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                opt.videoplaying = false;
                //console.log("VideoPlay set to False due vimeoready FINNSIH");
                opt.videostartednow = 1;
                if (opt.nextslideatend == true)
                    opt.container.revnext();

            });

            froogaloop.addEvent('pause', function(data) {
                var bt = jQuery('body').find('.tp-bannertimer');
                var opt = bt.data('opt');
                if (opt.conthover == 0)
                    bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                opt.videoplaying = false;
                //console.log("VideoPlay set to False due vimeoready PAUSE");
                opt.videostoppednow = 1;
            });
        });




    }

    /////////////////////////////////////
    // EVENT HANDLING FOR VIMEO VIDEOS //
    /////////////////////////////////////

    function vimeoready_auto(player_id) {

        var froogaloop = $f(player_id);


        froogaloop.addEvent('ready', function(data) {
            froogaloop.api('play');
        });

        froogaloop.addEvent('play', function(data) {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            bt.stop();
            opt.videoplaying = true;
            //console.log("VideoPlay set to True due vimeoready_auto PLAYING");
        });

        froogaloop.addEvent('finish', function(data) {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due vimeoready_auto FINISH");
            opt.videostartednow = 1;
            if (opt.nextslideatend == true)
                opt.container.revnext();

        });

        froogaloop.addEvent('pause', function(data) {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due vimeoready_auto PAUSE");
            opt.videostoppednow = 1;
        });
    }


    ///////////////////////////////////////
    // EVENT HANDLING FOR VIDEO JS VIDEOS //
    ////////////////////////////////////////
    function html5vidready(myPlayer) {

        myPlayer.on("play", function() {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            bt.stop();
            try {
                opt.videoplaying = true;
            } catch (e) {
            }
            //console.log("VideoPlay set to True due html5vidready PLAYING");
        });

        myPlayer.on("pause", function() {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due html5vidready pause");
            opt.videostoppednow = 1;
        });

        myPlayer.on("ended", function() {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due html5vidready pause");
            opt.videostoppednow = 1;
            if (opt.nextslideatend == true)
                opt.container.revnext();
        });

    }




    ////////////////////////
    // SHOW THE CAPTION  //
    ///////////////////////
    function animateTheCaptions(nextli, opt, actli) {


        //if (jQuery("body").find('#debug').length==0)
        //		jQuery("body").append('<div id="debug" style="background:#000;z-index:1000;position:fixed;top:5px;left:5px;width:100px;height:500px;color:#fff;font-size:10px;font-family:Arial;"</div>');


        var offsetx = 0;
        var offsety = 0;

        nextli.find('.tp-caption').each(function(i) {

            offsetx = opt.width / 2 - opt.startwidth / 2;



            if (opt.bh > 1) {
                opt.bw = 1;
                opt.bh = 1;
            }

            if (opt.bw > 1) {
                opt.bw = 1;
                opt.bh = 1;
            }

            var xbw = opt.bw;
            var xbh = opt.bh;


            if (opt.fullScreen == "on")
                offsety = opt.height / 2 - (opt.startheight * opt.bh) / 2;

            if (offsety < 0)
                offsety = 0;



            var nextcaption = nextli.find('.tp-caption:eq(' + i + ')');

            var handlecaption = 0;

            // HIDE CAPTION IF RESOLUTION IS TOO LOW
            if (opt.width < opt.hideCaptionAtLimit && nextcaption.data('captionhidden') == "on") {
                nextcaption.addClass("tp-hidden-caption")
                handlecaption = 1;
            } else {
                if (opt.width < opt.hideAllCaptionAtLilmit) {
                    nextcaption.addClass("tp-hidden-caption")
                    handlecaption = 1;
                } else {
                    nextcaption.removeClass("tp-hidden-caption")
                }
            }




            nextcaption.stop(true, true);
            if (handlecaption == 0) {
                if (nextcaption.data('linktoslide') != undefined) {
                    nextcaption.css({'cursor': 'pointer'});
                    if (nextcaption.data('linktoslide') != "no") {
                        nextcaption.click(function() {
                            var nextcaption = jQuery(this);
                            var dir = nextcaption.data('linktoslide');
                            if (dir != "next" && dir != "prev") {
                                opt.container.data('showus', dir);
                                opt.container.parent().find('.tp-rightarrow').click();
                            } else
                            if (dir == "next")
                                opt.container.parent().find('.tp-rightarrow').click();
                            else
                            if (dir == "prev")
                                opt.container.parent().find('.tp-leftarrow').click();
                        });
                    }
                }


                if (nextcaption.hasClass("coloredbg"))
                    offsetx = 0;
                if (offsetx < 0)
                    offsetx = 0;

                //var offsety = 0; //opt.height/2 - (opt.startheight*xbh)/2;

                clearTimeout(nextcaption.data('timer'));
                clearTimeout(nextcaption.data('timer-end'));



                // YOUTUBE AND VIMEO LISTENRES INITIALISATION

                var frameID = "iframe" + Math.round(Math.random() * 1000 + 1);

                if (nextcaption.find('iframe').length > 0) {

                    nextcaption.find('iframe').each(function() {
                        var ifr = jQuery(this);

                        if (ifr.attr('src').toLowerCase().indexOf('youtube') >= 0) {
                            opt.nextslideatend = nextcaption.data('nextslideatend');
                            if (!ifr.hasClass("HasListener")) {
                                try {
                                    ifr.attr('id', frameID);

                                    var player;
                                    if (nextcaption.data('autoplay') == true)
                                        player = new YT.Player(frameID, {
                                            events: {
                                                "onStateChange": onPlayerStateChange,
                                                'onReady': onPlayerReady
                                            }
                                        });
                                    else
                                        player = new YT.Player(frameID, {
                                            events: {
                                                "onStateChange": onPlayerStateChange
                                            }
                                        });
                                    ifr.addClass("HasListener");

                                    nextcaption.data('player', player);

                                    if (nextcaption.data('autoplay') == true) {
                                        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                        setTimeout(function() {
                                            bt.stop();
                                            opt.videoplaying = true;
                                        }, 200);


                                        //console.log("VideoPlay set to True due youtube 1st load AutoPlay");
                                    }
                                } catch (e) {
                                }
                            } else {
                                if (nextcaption.data('autoplay') == true) {


                                    var player = nextcaption.data('player');
                                    player.playVideo();
                                    var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                    setTimeout(function() {
                                        bt.stop();
                                        opt.videoplaying = true;
                                    }, 200);


                                    //console.log("VideoPlay set to True due youtube 2nd load AutoPlay");
                                }
                            }

                        } else {
                            if (ifr.attr('src').toLowerCase().indexOf('vimeo') >= 0) {
                                opt.nextslideatend = nextcaption.data('nextslideatend');
                                if (!ifr.hasClass("HasListener")) {
                                    ifr.addClass("HasListener");
                                    ifr.attr('id', frameID);
                                    var isrc = ifr.attr('src');
                                    var queryParameters = {}, queryString = isrc,
                                            re = /([^&=]+)=([^&]*)/g, m;
                                    // Creates a map with the query string parameters
                                    while (m = re.exec(queryString)) {
                                        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                                    }


                                    if (queryParameters['player_id'] != undefined) {

                                        isrc = isrc.replace(queryParameters['player_id'], frameID);
                                    } else {
                                        isrc = isrc + "&player_id=" + frameID;
                                    }

                                    try {
                                        isrc = isrc.replace('api=0', 'api=1');
                                    } catch (e) {
                                    }

                                    isrc = isrc + "&api=1";



                                    ifr.attr('src', isrc);
                                    var player = nextcaption.find('iframe')[0];
                                    if (nextcaption.data('autoplay') == true) {

                                        $f(player).addEvent('ready', vimeoready_auto);
                                        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                        setTimeout(function() {
                                            bt.stop();
                                            opt.videoplaying = true;
                                        }, 200);


                                        //console.log("VideoPlay set to True due vimeo 1st load AutoPlay");
                                    } else {
                                        $f(player).addEvent('ready', vimeoready);
                                    }


                                } else {
                                    if (nextcaption.data('autoplay') == true) {

                                        var ifr = nextcaption.find('iframe');
                                        var id = ifr.attr('id');
                                        var froogaloop = $f(id);
                                        froogaloop.api("pause");
                                        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                        setTimeout(function() {
                                            bt.stop();
                                            opt.videoplaying = true;
                                        }, 200);


                                        //console.log("VideoPlay set to True due youtube 2nd load AutoPlay");
                                    }
                                }

                            }
                        }
                    });
                }

                // IF HTML5 VIDEO IS EMBEDED
                if (nextcaption.find('video').length > 0) {
                    nextcaption.find('video').each(function(i) {
                        var html5vid = jQuery(this).parent();

                        if (html5vid.hasClass("video-js")) {
                            opt.nextslideatend = nextcaption.data('nextslideatend');
                            if (!html5vid.hasClass("HasListener")) {
                                html5vid.addClass("HasListener");
                                var videoID = "videoid_" + Math.round(Math.random() * 1000 + 1);
                                html5vid.attr('id', videoID);
                                videojs(videoID).ready(function() {
                                    html5vidready(this)
                                });
                            } else {
                                videoID = html5vid.attr('id');
                            }
                            if (nextcaption.data('autoplay') == true) {

                                var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                setTimeout(function() {
                                    bt.stop();
                                    opt.videoplaying = true;
                                }, 200);

                                //console.log("VideoPlay set to True due HTML5 VIDEO 1st/2nd load AutoPlay");

                                videojs(videoID).ready(function() {
                                    var myPlayer = this;
                                    html5vid.data('timerplay', setTimeout(function() {
                                        myPlayer.play();
                                    }, nextcaption.data('start')));
                                });
                            }


                            if (html5vid.data('ww') == undefined)
                                html5vid.data('ww', html5vid.width());
                            if (html5vid.data('hh') == undefined)
                                html5vid.data('hh', html5vid.height());

                            videojs(videoID).ready(function() {
                                if (!nextcaption.hasClass("fullscreenvideo")) {
                                    var myPlayer = videojs(videoID);

                                    try {
                                        myPlayer.width(html5vid.data('ww') * opt.bw);
                                        myPlayer.height(html5vid.data('hh') * opt.bh);
                                    } catch (e) {
                                    }
                                }
                            });


                        }

                    });
                } // END OF VIDEO JS FUNCTIONS



                if (nextcaption.hasClass("randomrotate") && (opt.ie || opt.ie9))
                    nextcaption.removeClass("randomrotate").addClass("sfb");
                nextcaption.removeClass('noFilterClass');



                var imw = 0;
                var imh = 0;

                if (nextcaption.find('img').length > 0) {
                    var im = nextcaption.find('img');
                    if (im.data('ww') == undefined)
                        im.data('ww', im.width());
                    if (im.data('hh') == undefined)
                        im.data('hh', im.height());

                    var ww = im.data('ww');
                    var hh = im.data('hh');


                    im.width(ww * opt.bw);
                    im.height(hh * opt.bh);
                    imw = im.width();
                    imh = im.height();
                } else {

                    if (nextcaption.find('iframe').length > 0) {

                        var im = nextcaption.find('iframe');
                        if (nextcaption.data('ww') == undefined) {
                            nextcaption.data('ww', im.width());
                        }
                        if (nextcaption.data('hh') == undefined)
                            nextcaption.data('hh', im.height());

                        var ww = nextcaption.data('ww');
                        var hh = nextcaption.data('hh');

                        var nc = nextcaption;
                        if (nc.data('fsize') == undefined)
                            nc.data('fsize', parseInt(nc.css('font-size'), 0) || 0);
                        if (nc.data('pt') == undefined)
                            nc.data('pt', parseInt(nc.css('paddingTop'), 0) || 0);
                        if (nc.data('pb') == undefined)
                            nc.data('pb', parseInt(nc.css('paddingBottom'), 0) || 0);
                        if (nc.data('pl') == undefined)
                            nc.data('pl', parseInt(nc.css('paddingLeft'), 0) || 0);
                        if (nc.data('pr') == undefined)
                            nc.data('pr', parseInt(nc.css('paddingRight'), 0) || 0);

                        if (nc.data('mt') == undefined)
                            nc.data('mt', parseInt(nc.css('marginTop'), 0) || 0);
                        if (nc.data('mb') == undefined)
                            nc.data('mb', parseInt(nc.css('marginBottom'), 0) || 0);
                        if (nc.data('ml') == undefined)
                            nc.data('ml', parseInt(nc.css('marginLeft'), 0) || 0);
                        if (nc.data('mr') == undefined)
                            nc.data('mr', parseInt(nc.css('marginRight'), 0) || 0);

                        if (nc.data('bt') == undefined)
                            nc.data('bt', parseInt(nc.css('borderTop'), 0) || 0);
                        if (nc.data('bb') == undefined)
                            nc.data('bb', parseInt(nc.css('borderBottom'), 0) || 0);
                        if (nc.data('bl') == undefined)
                            nc.data('bl', parseInt(nc.css('borderLeft'), 0) || 0);
                        if (nc.data('br') == undefined)
                            nc.data('br', parseInt(nc.css('borderRight'), 0) || 0);

                        if (nc.data('lh') == undefined)
                            nc.data('lh', parseInt(nc.css('lineHeight'), 0) || 0);

                        var fvwidth = opt.width;
                        var fvheight = opt.height;
                        if (fvwidth > opt.startwidth)
                            fvwidth = opt.startwidth;
                        if (fvheight > opt.startheight)
                            fvheight = opt.startheight;

                        if (!nextcaption.hasClass('fullscreenvideo'))
                            nextcaption.css({
                                'font-size': (nc.data('fsize') * opt.bw) + "px",
                                'padding-top': (nc.data('pt') * opt.bh) + "px",
                                'padding-bottom': (nc.data('pb') * opt.bh) + "px",
                                'padding-left': (nc.data('pl') * opt.bw) + "px",
                                'padding-right': (nc.data('pr') * opt.bw) + "px",
                                'margin-top': (nc.data('mt') * opt.bh) + "px",
                                'margin-bottom': (nc.data('mb') * opt.bh) + "px",
                                'margin-left': (nc.data('ml') * opt.bw) + "px",
                                'margin-right': (nc.data('mr') * opt.bw) + "px",
                                'border-top': (nc.data('bt') * opt.bh) + "px",
                                'border-bottom': (nc.data('bb') * opt.bh) + "px",
                                'border-left': (nc.data('bl') * opt.bw) + "px",
                                'border-right': (nc.data('br') * opt.bw) + "px",
                                'line-height': (nc.data('lh') * opt.bh) + "px",
                                'height': (hh * opt.bh) + 'px',
                                'white-space': "nowrap"
                            });
                        else
                            nextcaption.css({
                                'width': opt.startwidth * opt.bw,
                                'height': opt.startheight * opt.bh
                            });


                        im.width(ww * opt.bw);
                        im.height(hh * opt.bh);
                        imw = im.width();
                        imh = im.height();
                    } else {


                        nextcaption.find('.tp-resizeme, .tp-resizeme *').each(function() {
                            calcCaptionResponsive(jQuery(this), opt);
                        });

                        calcCaptionResponsive(nextcaption, opt);

                        imh = nextcaption.outerHeight(true);
                        imw = nextcaption.outerWidth(true);

                        // NEXTCAPTION FRONTCORNER CHANGES
                        var ncch = nextcaption.outerHeight();
                        var bgcol = nextcaption.css('backgroundColor');
                        nextcaption.find('.frontcorner').css({
                            'borderWidth': ncch + "px",
                            'left': (0 - ncch) + 'px',
                            'borderRight': '0px solid transparent',
                            'borderTopColor': bgcol
                        });

                        nextcaption.find('.frontcornertop').css({
                            'borderWidth': ncch + "px",
                            'left': (0 - ncch) + 'px',
                            'borderRight': '0px solid transparent',
                            'borderBottomColor': bgcol
                        });

                        // NEXTCAPTION BACKCORNER CHANGES
                        nextcaption.find('.backcorner').css({
                            'borderWidth': ncch + "px",
                            'right': (0 - ncch) + 'px',
                            'borderLeft': '0px solid transparent',
                            'borderBottomColor': bgcol
                        });

                        // NEXTCAPTION BACKCORNER CHANGES
                        nextcaption.find('.backcornertop').css({
                            'borderWidth': ncch + "px",
                            'right': (0 - ncch) + 'px',
                            'borderLeft': '0px solid transparent',
                            'borderTopColor': bgcol
                        });

                    }
                }

                if (nextcaption.data('voffset') == undefined)
                    nextcaption.data('voffset', 0);
                if (nextcaption.data('hoffset') == undefined)
                    nextcaption.data('hoffset', 0);

                var vofs = nextcaption.data('voffset') * xbw;
                var hofs = nextcaption.data('hoffset') * xbw;

                var crw = opt.startwidth * xbw;
                var crh = opt.startheight * xbw;


                // CENTER THE CAPTION HORIZONTALLY
                if (nextcaption.data('x') == "center" || nextcaption.data('xcenter') == 'center') {
                    nextcaption.data('xcenter', 'center');
                    nextcaption.data('x', (crw / 2 - nextcaption.outerWidth(true) / 2) / xbw + hofs);

                }

                // ALIGN LEFT THE CAPTION HORIZONTALLY
                if (nextcaption.data('x') == "left" || nextcaption.data('xleft') == 'left') {
                    nextcaption.data('xleft', 'left');
                    nextcaption.data('x', (0) / xbw + hofs);

                }

                // ALIGN RIGHT THE CAPTION HORIZONTALLY
                if (nextcaption.data('x') == "right" || nextcaption.data('xright') == 'right') {
                    nextcaption.data('xright', 'right');
                    nextcaption.data('x', ((crw - nextcaption.outerWidth(true)) + hofs) / xbw);
                    //console.log("crw:"+crw+"  width:"+nextcaption.outerWidth(true)+"  xbw:"+xbw);
                    //console.log("x-pos:"+nextcaption.data('x'))
                }


                // CENTER THE CAPTION VERTICALLY
                if (nextcaption.data('y') == "center" || nextcaption.data('ycenter') == 'center') {
                    nextcaption.data('ycenter', 'center');
                    nextcaption.data('y', (crh / 2 - nextcaption.outerHeight(true) / 2) / opt.bh + vofs);

                }

                // ALIGN TOP THE CAPTION VERTICALLY
                if (nextcaption.data('y') == "top" || nextcaption.data('ytop') == 'top') {
                    nextcaption.data('ytop', 'top');
                    nextcaption.data('y', (0) / opt.bh + vofs);

                }

                // ALIGN BOTTOM THE CAPTION VERTICALLY
                if (nextcaption.data('y') == "bottom" || nextcaption.data('ybottom') == 'bottom') {
                    nextcaption.data('ybottom', 'bottom');
                    nextcaption.data('y', ((crh - nextcaption.outerHeight(true)) + vofs) / xbw);
                }


                if (nextcaption.hasClass('fade')) {

                    nextcaption.css({'opacity': 0, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});
                }

                if (nextcaption.hasClass("randomrotate")) {

                    nextcaption.css({'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': ((xbh * nextcaption.data('y')) + offsety) + "px"});
                    var sc = Math.random() * 2 + 1;
                    var ro = Math.round(Math.random() * 200 - 100);
                    var xx = Math.round(Math.random() * 200 - 100);
                    var yy = Math.round(Math.random() * 200 - 100);
                    nextcaption.data('repx', xx);
                    nextcaption.data('repy', yy);
                    nextcaption.data('repo', nextcaption.css('opacity'));
                    nextcaption.data('rotate', ro);
                    nextcaption.data('scale', sc);

                    nextcaption.transition({opacity: 0, scale: sc, rotate: ro, x: xx, y: yy, duration: '0ms'});
                } else {
                    if (opt.ie || opt.ie9)
                    {
                    }
                    else {
                        if (nextcaption.find('iframe').length == 0)
                            nextcaption.transition({scale: 1, rotate: 0});
                    }
                }

                if (nextcaption.hasClass('lfr')) {

                    nextcaption.css({'opacity': 1, 'left': (15 + opt.width) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});

                }

                if (nextcaption.hasClass('lfl')) {

                    nextcaption.css({'opacity': 1, 'left': (-15 - imw) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});

                }

                if (nextcaption.hasClass('sfl')) {

                    nextcaption.css({'opacity': 0, 'left': ((xbw * nextcaption.data('x')) - 50 + offsetx) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});
                }

                if (nextcaption.hasClass('sfr')) {
                    nextcaption.css({'opacity': 0, 'left': ((xbw * nextcaption.data('x')) + 50 + offsetx) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});
                }




                if (nextcaption.hasClass('lft')) {

                    nextcaption.css({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (-25 - imh) + "px"});

                }

                if (nextcaption.hasClass('lfb')) {
                    nextcaption.css({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (25 + opt.height) + "px"});

                }

                if (nextcaption.hasClass('sft')) {
                    nextcaption.css({'opacity': 0, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': ((opt.bh * nextcaption.data('y') + offsety) - 50) + "px"});
                }

                if (nextcaption.hasClass('sfb')) {
                    nextcaption.css({'opacity': 0, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': ((opt.bh * nextcaption.data('y') + offsety) + 50) + "px"});
                }




                nextcaption.data('timer', setTimeout(function() {
                    var easetype = nextcaption.data('easing');
                    if (easetype == undefined)
                        easetype = "linear";

                    nextcaption.css({'visibility': 'visible'});
                    if (nextcaption.hasClass('fade')) {
                        nextcaption.data('repo', nextcaption.css('opacity'));

                        //nextcaption.animate({'opacity':1},{duration:nextcaption.data('speed'),complete:function() { if (opt.ie) jQuery(this).addClass('noFilterClass');}});
                        nextcaption.transition({'opacity': 1, duration: nextcaption.data('speed')});
                        //if (opt.ie) nextcaption.addClass('noFilterClass');
                    }

                    if (nextcaption.hasClass("randomrotate")) {

                        easetype = easetype.replace('Elastic', 'Back');
                        easetype = easetype.replace('Bounce', 'Back');
                        nextcaption.transition({opacity: 1, scale: 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (xbh * (nextcaption.data('y')) + offsety) + "px", rotate: 0, x: 0, y: 0, duration: nextcaption.data('speed'), easing: easetype});
                        if (opt.ie)
                            nextcaption.addClass('noFilterClass');
                    }

                    if (nextcaption.hasClass('lfr') ||
                            nextcaption.hasClass('lfl') ||
                            nextcaption.hasClass('sfr') ||
                            nextcaption.hasClass('sfl') ||
                            nextcaption.hasClass('lft') ||
                            nextcaption.hasClass('lfb') ||
                            nextcaption.hasClass('sft') ||
                            nextcaption.hasClass('sfb')
                            )
                    {

                        nextcaption.data('repx', nextcaption.position().left);
                        nextcaption.data('repy', nextcaption.position().top);

                        nextcaption.data('repo', nextcaption.css('opacity'));
                        if (easetype.indexOf("Bounce") >= 0 || easetype.indexOf("Elastic") >= 0)
                            nextcaption.animate({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': opt.bh * (nextcaption.data('y')) + offsety + "px"}, {duration: nextcaption.data('speed'), easing: easetype, complete: function() {
                                    if (opt.ie)
                                        jQuery(this).addClass('noFilterClass');
                                }});
                        else
                            nextcaption.transition({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': opt.bh * (nextcaption.data('y')) + offsety + "px", duration: nextcaption.data('speed'), easing: easetype});
                        //if (opt.ie) nextcaption.addClass('noFilterClass');
                    }
                }, nextcaption.data('start')));


                // IF THERE IS ANY EXIT ANIM DEFINED
                if (nextcaption.data('end') != undefined)
                    nextcaption.data('timer-end', setTimeout(function() {

                        if ((opt.ie || opt.ie9) && (nextcaption.hasClass("randomrotate") || nextcaption.hasClass("randomrotateout"))) {
                            nextcaption.removeClass("randomrotate").removeClass("randomrotateout").addClass('fadeout');
                        }

                        endMoveCaption(nextcaption, opt);

                    }, nextcaption.data('end')));
            }
        })

        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
        bt.data('opt', opt);
    }



    /////////////////////////////////////////////////////////////////
    //	-	CALCULATE THE RESPONSIVE SIZES OF THE CAPTIONS	-	  //
    /////////////////////////////////////////////////////////////////
    function calcCaptionResponsive(nc, opt) {
        if (nc.data('fsize') == undefined)
            nc.data('fsize', parseInt(nc.css('font-size'), 0) || 0);
        if (nc.data('pt') == undefined)
            nc.data('pt', parseInt(nc.css('paddingTop'), 0) || 0);
        if (nc.data('pb') == undefined)
            nc.data('pb', parseInt(nc.css('paddingBottom'), 0) || 0);
        if (nc.data('pl') == undefined)
            nc.data('pl', parseInt(nc.css('paddingLeft'), 0) || 0);
        if (nc.data('pr') == undefined)
            nc.data('pr', parseInt(nc.css('paddingRight'), 0) || 0);

        if (nc.data('mt') == undefined)
            nc.data('mt', parseInt(nc.css('marginTop'), 0) || 0);
        if (nc.data('mb') == undefined)
            nc.data('mb', parseInt(nc.css('marginBottom'), 0) || 0);
        if (nc.data('ml') == undefined)
            nc.data('ml', parseInt(nc.css('marginLeft'), 0) || 0);
        if (nc.data('mr') == undefined)
            nc.data('mr', parseInt(nc.css('marginRight'), 0) || 0);

        if (nc.data('bt') == undefined)
            nc.data('bt', parseInt(nc.css('borderTopWidth'), 0) || 0);
        if (nc.data('bb') == undefined)
            nc.data('bb', parseInt(nc.css('borderBottomWidth'), 0) || 0);
        if (nc.data('bl') == undefined)
            nc.data('bl', parseInt(nc.css('borderLeftWidth'), 0) || 0);
        if (nc.data('br') == undefined)
            nc.data('br', parseInt(nc.css('borderRightWidth'), 0) || 0);

        if (nc.data('lh') == undefined)
            nc.data('lh', parseInt(nc.css('lineHeight'), 0) || 0);
        if (nc.data('minwidth') == undefined)
            nc.data('minwidth', parseInt(nc.css('minWidth'), 0) || 0);
        if (nc.data('minheight') == undefined)
            nc.data('minheight', parseInt(nc.css('minHeight'), 0) || 0);
        if (nc.data('maxwidth') == undefined)
            nc.data('maxwidth', parseInt(nc.css('maxWidth'), 0) || "none");
        if (nc.data('maxheight') == undefined)
            nc.data('maxheight', parseInt(nc.css('maxHeight'), 0) || "none");


        nc.css({
            'font-size': Math.round((nc.data('fsize') * opt.bw)) + "px",
            'padding-top': Math.round((nc.data('pt') * opt.bh)) + "px",
            'padding-bottom': Math.round((nc.data('pb') * opt.bh)) + "px",
            'padding-left': Math.round((nc.data('pl') * opt.bw)) + "px",
            'padding-right': Math.round((nc.data('pr') * opt.bw)) + "px",
            'margin-top': (nc.data('mt') * opt.bh) + "px",
            'margin-bottom': (nc.data('mb') * opt.bh) + "px",
            'margin-left': (nc.data('ml') * opt.bw) + "px",
            'margin-right': (nc.data('mr') * opt.bw) + "px",
            'borderTopWidth': Math.round((nc.data('bt') * opt.bh)) + "px",
            'borderBottomWidth': Math.round((nc.data('bb') * opt.bh)) + "px",
            'borderLeftWidth': Math.round((nc.data('bl') * opt.bw)) + "px",
            'borderRightWidth': Math.round((nc.data('br') * opt.bw)) + "px",
            'line-height': Math.round((nc.data('lh') * opt.bh)) + "px",
            'white-space': "nowrap",
            'minWidth': (nc.data('minwidth') * opt.bw) + "px",
            'minHeight': (nc.data('minheight') * opt.bh) + "px",
        });

        //console.log(nc.data('maxwidth')+"  "+nc.data('maxheight'));
        if (nc.data('maxheight') != 'none')
            nc.css({'maxHeight': (nc.data('maxheight') * opt.bh) + "px"});


        if (nc.data('maxwidth') != 'none')
            nc.css({'maxWidth': (nc.data('maxwidth') * opt.bw) + "px"});
    }


    //////////////////////////
    //	REMOVE THE CAPTIONS //
    /////////////////////////
    function removeTheCaptions(actli, opt) {

        actli.find('.tp-caption').each(function(i) {
            var nextcaption = actli.find('.tp-caption:eq(' + i + ')');
            nextcaption.stop(true, true);
            clearTimeout(nextcaption.data('timer'));
            clearTimeout(nextcaption.data('timer-end'));

            var easetype = nextcaption.data('easing');
            easetype = "easeInOutSine";
            var ll = nextcaption.data('repx');
            var tt = nextcaption.data('repy');
            var oo = nextcaption.data('repo');
            var rot = nextcaption.data('rotate');
            var sca = nextcaption.data('scale');


            if (nextcaption.find('iframe').length > 0) {
                // VIMEO VIDEO PAUSE
                try {
                    var ifr = nextcaption.find('iframe');
                    var id = ifr.attr('id');
                    var froogaloop = $f(id);
                    froogaloop.api("pause");
                } catch (e) {
                }
                //YOU TUBE PAUSE
                try {
                    var player = nextcaption.data('player');
                    player.stopVideo();
                } catch (e) {
                }
            }

            // IF HTML5 VIDEO IS EMBEDED
            if (nextcaption.find('video').length > 0) {
                try {
                    nextcaption.find('video').each(function(i) {
                        var html5vid = jQuery(this).parent();
                        var videoID = html5vid.attr('id');
                        clearTimeout(html5vid.data('timerplay'));
                        videojs(videoID).ready(function() {
                            var myPlayer = this;
                            myPlayer.pause();
                        });
                    })
                } catch (e) {
                }
            } // END OF VIDEO JS FUNCTIONS
            try {
                /*if (rot!=undefined || sca!=undefined)
                 {
                 if (rot==undefined) rot=0;
                 if (sca==undefined) sca=1;
                 nextcaption.transition({'rotate':rot, 'scale':sca, 'opacity':0,'left':ll+'px','top':tt+"px"},(nextcaption.data('speed')+10), function() { nextcaption.removeClass('noFilterClass');nextcaption.css({'visibility':'hidden'})});
                 } else {
                 
                 nextcaption.animate({'opacity':0,'left':ll+'px','top':tt+"px"},{duration:(nextcaption.data('speed')+10), easing:easetype, complete:function() { nextcaption.removeClass('noFilterClass');nextcaption.css({'visibility':'hidden'})}});
                 }*/
                endMoveCaption(nextcaption, opt);
            } catch (e) {
            }



        });
    }

    //////////////////////////
    //	MOVE OUT THE CAPTIONS //
    /////////////////////////
    function endMoveCaption(nextcaption, opt) {


        if (nextcaption.hasClass("randomrotate") && (opt.ie || opt.ie9))
            nextcaption.removeClass("randomrotate").addClass("sfb");
        if (nextcaption.hasClass("randomrotateout") && (opt.ie || opt.ie9))
            nextcaption.removeClass("randomrotateout").addClass("stb");

        var endspeed = nextcaption.data('endspeed');
        if (endspeed == undefined)
            endspeed = nextcaption.data('speed');

        var xx = nextcaption.data('repx');
        var yy = nextcaption.data('repy');
        var oo = nextcaption.data('repo');

        if (opt.ie) {
            nextcaption.css({'opacity': 'inherit', 'filter': 'inherit'});
        }

        if (nextcaption.hasClass('ltr') ||
                nextcaption.hasClass('ltl') ||
                nextcaption.hasClass('str') ||
                nextcaption.hasClass('stl') ||
                nextcaption.hasClass('ltt') ||
                nextcaption.hasClass('ltb') ||
                nextcaption.hasClass('stt') ||
                nextcaption.hasClass('stb')
                )
        {

            xx = nextcaption.position().left;
            yy = nextcaption.position().top;

            if (nextcaption.hasClass('ltr'))
                xx = opt.width + 60;
            else if (nextcaption.hasClass('ltl'))
                xx = 0 - nextcaption.width() - 60;
            else if (nextcaption.hasClass('ltt'))
                yy = 0 - nextcaption.height() - 60;
            else if (nextcaption.hasClass('ltb'))
                yy = opt.height + 60;
            else if (nextcaption.hasClass('str')) {
                xx = xx + 50;
                oo = 0;
            } else if (nextcaption.hasClass('stl')) {
                xx = xx - 50;
                oo = 0;
            } else if (nextcaption.hasClass('stt')) {
                yy = yy - 50;
                oo = 0;
            } else if (nextcaption.hasClass('stb')) {
                yy = yy + 50;
                oo = 0;
            }

            var easetype = nextcaption.data('endeasing');
            if (easetype == undefined)
                easetype = "linear";
            if (easetype.indexOf("Bounce") >= 0 || easetype.indexOf("Elastic") >= 0)
                nextcaption.animate({'opacity': oo, 'left': xx + 'px', 'top': yy + "px"}, {duration: nextcaption.data('endspeed'), easing: easetype, complete: function() {
                        jQuery(this).css({visibility: 'hidden'})
                    }});
            else
                nextcaption.transition({'opacity': oo, 'left': xx + 'px', 'top': yy + "px", duration: nextcaption.data('endspeed'), easing: easetype});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass("randomrotateout")) {

            nextcaption.transition({opacity: 0, scale: Math.random() * 2 + 0.3, 'left': Math.random() * opt.width + 'px', 'top': Math.random() * opt.height + "px", rotate: Math.random() * 40, duration: endspeed, easing: easetype, complete: function() {
                    jQuery(this).css({visibility: 'hidden'})
                }});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass('fadeout')) {
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');
            nextcaption.transition({'opacity': 0, duration: 200});
            //nextcaption.animate({'opacity':0},{duration:200,complete:function() { jQuery(this).css({visibility:'hidden'})}});

        }

        else

        if (nextcaption.hasClass('lfr') ||
                nextcaption.hasClass('lfl') ||
                nextcaption.hasClass('sfr') ||
                nextcaption.hasClass('sfl') ||
                nextcaption.hasClass('lft') ||
                nextcaption.hasClass('lfb') ||
                nextcaption.hasClass('sft') ||
                nextcaption.hasClass('sfb')
                )
        {

            if (nextcaption.hasClass('lfr'))
                xx = opt.width + 60;
            else if (nextcaption.hasClass('lfl'))
                xx = 0 - nextcaption.width() - 60;
            else if (nextcaption.hasClass('lft'))
                yy = 0 - nextcaption.height() - 60;
            else if (nextcaption.hasClass('lfb'))
                yy = opt.height + 60;


            var easetype = nextcaption.data('endeasing');
            if (easetype == undefined)
                easetype = "linear";
            if (easetype.indexOf("Bounce") >= 0 || easetype.indexOf("Elastic") >= 0)
                nextcaption.animate({'opacity': oo, 'left': xx + 'px', 'top': yy + "px"}, {duration: nextcaption.data('endspeed'), easing: easetype, complete: function() {
                        jQuery(this).css({visibility: 'hidden'})
                    }});
            else
                nextcaption.transition({'opacity': oo, 'left': xx + 'px', 'top': yy + "px", duration: nextcaption.data('endspeed'), easing: easetype});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass('fade')) {

            //nextcaption.animate({'opacity':0},{duration:endspeed,complete:function() { jQuery(this).css({visibility:'hidden'})} });
            nextcaption.transition({'opacity': 0, duration: endspeed});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass("randomrotate")) {

            nextcaption.transition({opacity: 0, scale: Math.random() * 2 + 0.3, 'left': Math.random() * opt.width + 'px', 'top': Math.random() * opt.height + "px", rotate: Math.random() * 40, duration: endspeed, easing: easetype});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }
    }

    ///////////////////////////
    //	REMOVE THE LISTENERS //
    ///////////////////////////
    function removeAllListeners(container, opt) {
        container.children().each(function() {
            try {
                jQuery(this).die('click');
            } catch (e) {
            }
            try {
                jQuery(this).die('mouseenter');
            } catch (e) {
            }
            try {
                jQuery(this).die('mouseleave');
            } catch (e) {
            }
            try {
                jQuery(this).unbind('hover');
            } catch (e) {
            }
        })
        try {
            container.die('click', 'mouseenter', 'mouseleave');
        } catch (e) {
        }
        clearInterval(opt.cdint);
        container = null;



    }

    ///////////////////////////
    //	-	COUNTDOWN	-	//
    /////////////////////////
    function countDown(container, opt) {
        opt.cd = 0;
        opt.loop = 0;
        if (opt.stopAfterLoops != undefined && opt.stopAfterLoops > -1)
            opt.looptogo = opt.stopAfterLoops;
        else
            opt.looptogo = 9999999;

        if (opt.stopAtSlide != undefined && opt.stopAtSlide > -1)
            opt.lastslidetoshow = opt.stopAtSlide;
        else
            opt.lastslidetoshow = 999;

        opt.stopLoop = "off";

        if (opt.looptogo == 0)
            opt.stopLoop = "on";



        if (opt.slideamount > 1 && !(opt.stopAfterLoops == 0 && opt.stopAtSlide == 1)) {
            var bt = container.find('.tp-bannertimer');
            if (bt.length > 0) {
                bt.css({'width': '0%'});
                bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});

            }

            bt.data('opt', opt);


            opt.cdint = setInterval(function() {

                if (jQuery('body').find(container).length == 0)
                    removeAllListeners(container, opt);
                if (container.data('conthover-changed') == 1) {
                    opt.conthover = container.data('conthover');
                    container.data('conthover-changed', 0);
                }

                if (opt.conthover != 1 && opt.videoplaying != true && opt.width > opt.hideSliderAtLimit)
                    opt.cd = opt.cd + 100;


                if (opt.fullWidth != "on")
                    if (opt.width > opt.hideSliderAtLimit)
                        container.parent().removeClass("tp-hide-revslider")
                    else
                        container.parent().addClass("tp-hide-revslider")
                // EVENT TRIGGERING IN CASE VIDEO HAS BEEN STARTED
                if (opt.videostartednow == 1) {
                    container.trigger('revolution.slide.onvideoplay');
                    opt.videostartednow = 0;
                }

                // EVENT TRIGGERING IN CASE VIDEO HAS BEEN STOPPED
                if (opt.videostoppednow == 1) {
                    container.trigger('revolution.slide.onvideostop');
                    opt.videostoppednow = 0;
                }


                if (opt.cd >= opt.delay) {
                    opt.cd = 0;
                    // SWAP TO NEXT BANNER
                    opt.act = opt.next;
                    opt.next = opt.next + 1;
                    if (opt.next > container.find('>ul >li').length - 1) {
                        opt.next = 0;
                        opt.looptogo = opt.looptogo - 1;

                        if (opt.looptogo <= 0) {
                            opt.stopLoop = "on";

                        }
                    }

                    // STOP TIMER IF NO LOOP NO MORE NEEDED.

                    if (opt.stopLoop == "on" && opt.next == opt.lastslidetoshow - 1) {
                        clearInterval(opt.cdint);
                        container.find('.tp-bannertimer').css({'visibility': 'hidden'});
                        container.trigger('revolution.slide.onstop');
                    }

                    // SWAP THE SLIDES
                    swapSlide(container, opt);


                    // Clear the Timer
                    if (bt.length > 0) {
                        bt.css({'width': '0%'});
                        bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});
                    }
                }
            }, 100);


            container.hover(
                    function() {

                        if (opt.onHoverStop == "on") {
                            opt.conthover = 1;
                            bt.stop();
                            container.trigger('revolution.slide.onpause');
                        }
                    },
                    function() {
                        if (container.data('conthover') != 1) {
                            container.trigger('revolution.slide.onresume');
                            opt.conthover = 0;
                            if (opt.onHoverStop == "on" && opt.videoplaying != true) {
                                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                            }
                        }
                    });
        }
    }



})(jQuery);




// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function($) {

    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    }
    ;

    function isElementInDOM(ele) {
        while (ele = ele.parentNode) {
            if (ele == document)
                return true;
        }
        return false;
    }
    ;

    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    }
    ;

    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth,
                        actualHeight = $tip[0].offsetHeight,
                        gravity = maybeCall(this.options.gravity, this.$element[0]);

                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }

                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }

                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() {
                    $(this).remove();
                });
            } else {
                this.tip().remove();
            }
        },
        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
                $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title');
            }
        },
        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'data-original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },
        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
                this.$tip.data('tipsy-pointee', this.$element[0]);
            }
            return this.$tip;
        },
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        enable: function() {
            this.enabled = true;
        },
        disable: function() {
            this.enabled = false;
        },
        toggleEnabled: function() {
            this.enabled = !this.enabled;
        }
    };

    $.fn.tipsy = function(options) {

        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy)
                tipsy[options]();
            return this;
        }

        options = $.extend({}, $.fn.tipsy.defaults, options);

        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }

        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() {
                    if (tipsy.hoverState == 'in')
                        tipsy.show();
                }, options.delayIn);
            }
        }
        ;

        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() {
                    if (tipsy.hoverState == 'out')
                        tipsy.hide();
                }, options.delayOut);
            }
        }
        ;

        if (!options.live)
            this.each(function() {
                get(this);
            });

        if (options.trigger != 'manual') {
            var binder = options.live ? 'live' : 'bind',
                    eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                    eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }

        return this;

    };

    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };

    $.fn.tipsy.revalidate = function() {
        $('.tipsy').each(function() {
            var pointee = $.data(this, 'tipsy-pointee');
            if (!pointee || !isElementInDOM(pointee)) {
                $(this).remove();
            }
        });
    };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable 
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
    $.fn.tipsy.autoBounds = function(margin, prefer) {
        return function() {
            var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
            boundTop = $(document).scrollTop() + margin,
                    boundLeft = $(document).scrollLeft() + margin,
                    $this = $(this);

            if ($this.offset().top < boundTop)
                dir.ns = 'n';
            if ($this.offset().left < boundLeft)
                dir.ew = 'w';
            if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin)
                dir.ew = 'e';
            if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin)
                dir.ns = 's';

            return dir.ns + (dir.ew ? dir.ew : '');
        }
    };

})(jQuery);
/*!
 * jQuery Validation Plugin 1.11.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 JÃ¶rn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */


(function($) {

    $.extend($.fn, {
        // http://docs.jquery.com/Plugins/Validation/validate
        validate: function(options) {

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }

            // check if a validator for this form was already created
            var validator = $.data(this[0], "validator");
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");

            validator = new $.validator(options, this[0]);
            $.data(this[0], "validator", validator);

            if (validator.settings.onsubmit) {

                this.validateDelegate(":submit", "click", function(event) {
                    if (validator.settings.submitHandler) {
                        validator.submitButton = event.target;
                    }
                    // allow suppressing validation by adding a cancel class to the submit button
                    if ($(event.target).hasClass("cancel")) {
                        validator.cancelSubmit = true;
                    }

                    // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ($(event.target).attr("formnovalidate") !== undefined) {
                        validator.cancelSubmit = true;
                    }
                });

                // validate the form on submit
                this.submit(function(event) {
                    if (validator.settings.debug) {
                        // prevent form submit to be able to see console output
                        event.preventDefault();
                    }
                    function handle() {
                        var hidden;
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                // insert a hidden input as a replacement for the missing submit button
                                hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val($(validator.submitButton).val()).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm, event);
                            if (validator.submitButton) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }

            return validator;
        },
        // http://docs.jquery.com/Plugins/Validation/valid
        valid: function() {
            if ($(this[0]).is("form")) {
                return this.validate().form();
            } else {
                var valid = true;
                var validator = $(this[0].form).validate();
                this.each(function() {
                    valid = valid && validator.element(this);
                });
                return valid;
            }
        },
        // attributes: space seperated list of attributes to retrieve and remove
        removeAttrs: function(attributes) {
            var result = {},
                    $element = this;
            $.each(attributes.split(/\s/), function(index, value) {
                result[value] = $element.attr(value);
                $element.removeAttr(value);
            });
            return result;
        },
        // http://docs.jquery.com/Plugins/Validation/rules
        rules: function(command, argument) {
            var element = this[0];

            if (command) {
                var settings = $.data(element.form, "validator").settings;
                var staticRules = settings.rules;
                var existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        // remove messages from rules, but allow them to be set separetely
                        delete existingRules.messages;
                        staticRules[element.name] = existingRules;
                        if (argument.messages) {
                            settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                        }
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        var filtered = {};
                        $.each(argument.split(/\s/), function(index, method) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                        });
                        return filtered;
                }
            }

            var data = $.validator.normalizeRules(
                    $.extend(
                    {},
                    $.validator.classRules(element),
                    $.validator.attributeRules(element),
                    $.validator.dataRules(element),
                    $.validator.staticRules(element)
                    ), element);

            // make sure required is at front
            if (data.required) {
                var param = data.required;
                delete data.required;
                data = $.extend({required: param}, data);
            }

            return data;
        }
    });

// Custom selectors
    $.extend($.expr[":"], {
        // http://docs.jquery.com/Plugins/Validation/blank
        blank: function(a) {
            return !$.trim("" + $(a).val());
        },
        // http://docs.jquery.com/Plugins/Validation/filled
        filled: function(a) {
            return !!$.trim("" + $(a).val());
        },
        // http://docs.jquery.com/Plugins/Validation/unchecked
        unchecked: function(a) {
            return !$(a).prop("checked");
        }
    });

// constructor for validator
    $.validator = function(options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };

    $.validator.format = function(source, params) {
        if (arguments.length === 1) {
            return function() {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
                return n;
            });
        });
        return source;
    };

    $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function(element, event) {
                this.lastActive = element;

                // hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    if (this.settings.unhighlight) {
                        this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.addWrapper(this.errorsFor(element)).hide();
                }
            },
            onfocusout: function(element, event) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function(element, event) {
                if (event.which === 9 && this.elementValue(element) === "") {
                    return;
                } else if (element.name in this.submitted || element === this.lastElement) {
                    this.element(element);
                }
            },
            onclick: function(element, event) {
                // click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted) {
                    this.element(element);
                }
                // or option elements, check parent select in that case
                else if (element.parentNode.name in this.submitted) {
                    this.element(element.parentNode);
                }
            },
            highlight: function(element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },
        // http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
        setDefaults: function(settings) {
            $.extend($.validator.defaults, settings);
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: false,
        prototype: {
            init: function() {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();

                var groups = (this.groups = {});
                $.each(this.settings.groups, function(key, value) {
                    if (typeof value === "string") {
                        value = value.split(/\s/);
                    }
                    $.each(value, function(index, name) {
                        groups[name] = key;
                    });
                });
                var rules = this.settings.rules;
                $.each(rules, function(key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this[0].form, "validator"),
                            eventType = "on" + event.type.replace(/^validate/, "");
                    if (validator.settings[eventType]) {
                        validator.settings[eventType].call(validator, this[0], event);
                    }
                }
                $(this.currentForm)
                        .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                        "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                        "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
                        "[type='week'], [type='time'], [type='datetime-local'], " +
                        "[type='range'], [type='color'] ",
                        "focusin focusout keyup", delegate)
                        .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

                if (this.settings.invalidHandler) {
                    $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
                }
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/form
            form: function() {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return this.valid();
            },
            checkForm: function() {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                    this.check(elements[i]);
                }
                return this.valid();
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/element
            element: function(element) {
                element = this.validationTargetFor(this.clean(element));
                this.lastElement = element;
                this.prepareElement(element);
                this.currentElements = $(element);
                var result = this.check(element) !== false;
                if (result) {
                    delete this.invalid[element.name];
                } else {
                    this.invalid[element.name] = true;
                }
                if (!this.numberOfInvalids()) {
                    // Hide error containers on last error
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return result;
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/showErrors
            showErrors: function(errors) {
                if (errors) {
                    // add items to error list and map
                    $.extend(this.errorMap, errors);
                    this.errorList = [];
                    for (var name in errors) {
                        this.errorList.push({
                            message: errors[name],
                            element: this.findByName(name)[0]
                        });
                    }
                    // remove items from success list
                    this.successList = $.grep(this.successList, function(element) {
                        return !(element.name in errors);
                    });
                }
                if (this.settings.showErrors) {
                    this.settings.showErrors.call(this, this.errorMap, this.errorList);
                } else {
                    this.defaultShowErrors();
                }
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/resetForm
            resetForm: function() {
                if ($.fn.resetForm) {
                    $(this.currentForm).resetForm();
                }
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass).removeData("previousValue");
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },
            objectLength: function(obj) {
                var count = 0;
                for (var i in obj) {
                    count++;
                }
                return count;
            },
            hideErrors: function() {
                this.addWrapper(this.toHide).hide();
            },
            valid: function() {
                return this.size() === 0;
            },
            size: function() {
                return this.errorList.length;
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                                .filter(":visible")
                                .focus()
                                // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                                .trigger("focusin");
                    } catch (e) {
                        // ignore IE throwing errors when focusing hidden elements
                    }
                }
            },
            findLastActive: function() {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function(n) {
                    return n.element.name === lastActive.name;
                }).length === 1 && lastActive;
            },
            elements: function() {
                var validator = this,
                        rulesCache = {};

                // select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                        .find("input, select, textarea")
                        .not(":submit, :reset, :image, [disabled]")
                        .not(this.settings.ignore)
                        .filter(function() {
                    if (!this.name && validator.settings.debug && window.console) {
                        console.error("%o has no name assigned", this);
                    }

                    // select only the first element for each name, and only those with rules specified
                    if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
                        return false;
                    }

                    rulesCache[this.name] = true;
                    return true;
                });
            },
            clean: function(selector) {
                return $(selector)[0];
            },
            errors: function() {
                var errorClass = this.settings.errorClass.replace(" ", ".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },
            reset: function() {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },
            prepareForm: function() {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },
            prepareElement: function(element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },
            elementValue: function(element) {
                var type = $(element).attr("type"),
                        val = $(element).val();

                if (type === "radio" || type === "checkbox") {
                    return $("input[name='" + $(element).attr("name") + "']:checked").val();
                }

                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },
            check: function(element) {
                element = this.validationTargetFor(this.clean(element));

                var rules = $(element).rules();
                var dependencyMismatch = false;
                var val = this.elementValue(element);
                var result;

                for (var method in rules) {
                    var rule = {method: method, parameters: rules[method]};
                    try {

                        result = $.validator.methods[method].call(this, val, element, rule.parameters);

                        // if a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if (result === "dependency-mismatch") {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;

                        if (result === "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }

                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        if (this.settings.debug && window.console) {
                            console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
                        }
                        throw e;
                    }
                }
                if (dependencyMismatch) {
                    return;
                }
                if (this.objectLength(rules)) {
                    this.successList.push(element);
                }
                return true;
            },
            // return the custom message for the given element and validation method
            // specified in the element's HTML5 data attribute
            customDataMessage: function(element, method) {
                return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
            },
            // return the custom message for the given element name and validation method
            customMessage: function(name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor === String ? m : m[method]);
            },
            // return the first defined argument, allowing empty strings
            findDefined: function() {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        return arguments[i];
                    }
                }
                return undefined;
            },
            defaultMessage: function(element, method) {
                return this.findDefined(
                        this.customMessage(element.name, method),
                        this.customDataMessage(element, method),
                        // title is never undefined, so handle empty string as undefined
                        !this.settings.ignoreTitle && element.title || undefined,
                        $.validator.messages[method],
                        "<strong>Warning: No message defined for " + element.name + "</strong>"
                        );
            },
            formatAndAdd: function(element, rule) {
                var message = this.defaultMessage(element, rule.method),
                        theregex = /\$?\{(\d+)\}/g;
                if (typeof message === "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }
                this.errorList.push({
                    message: message,
                    element: element
                });

                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },
            addWrapper: function(toToggle) {
                if (this.settings.wrapper) {
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                }
                return toToggle;
            },
            defaultShowErrors: function() {
                var i, elements;
                for (i = 0; this.errorList[i]; i++) {
                    var error = this.errorList[i];
                    if (this.settings.highlight) {
                        this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements());
            },
            invalidElements: function() {
                return $(this.errorList).map(function() {
                    return this.element;
                });
            },
            showLabel: function(element, message) {
                var label = this.errorsFor(element);
                if (label.length) {
                    // refresh error/success class
                    label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    // replace message on existing label
                    label.html(message);
                } else {
                    // create label
                    label = $("<" + this.settings.errorElement + ">")
                            .attr("for", this.idOrName(element))
                            .addClass(this.settings.errorClass)
                            .html(message || "");
                    if (this.settings.wrapper) {
                        // make sure the element is visible, even in IE
                        // actually showing the wrapped element is handled elsewhere
                        label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (!this.labelContainer.append(label).length) {
                        if (this.settings.errorPlacement) {
                            this.settings.errorPlacement(label, $(element));
                        } else {
                            label.insertAfter(element);
                        }
                    }
                }
                if (!message && this.settings.success) {
                    label.text("");
                    if (typeof this.settings.success === "string") {
                        label.addClass(this.settings.success);
                    } else {
                        this.settings.success(label, element);
                    }
                }
                this.toShow = this.toShow.add(label);
            },
            errorsFor: function(element) {
                var name = this.idOrName(element);
                return this.errors().filter(function() {
                    return $(this).attr("for") === name;
                });
            },
            idOrName: function(element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },
            validationTargetFor: function(element) {
                // if radio/checkbox, validate first element in group instead
                if (this.checkable(element)) {
                    element = this.findByName(element.name).not(this.settings.ignore)[0];
                }
                return element;
            },
            checkable: function(element) {
                return (/radio|checkbox/i).test(element.type);
            },
            findByName: function(name) {
                return $(this.currentForm).find("[name='" + name + "']");
            },
            getLength: function(value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if (this.checkable(element)) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            },
            depend: function(param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },
            dependTypes: {
                "boolean": function(param, element) {
                    return param;
                },
                "string": function(param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function(param, element) {
                    return param(element);
                }
            },
            optional: function(element) {
                var val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },
            startRequest: function(element) {
                if (!this.pending[element.name]) {
                    this.pendingRequest++;
                    this.pending[element.name] = true;
                }
            },
            stopRequest: function(element, valid) {
                this.pendingRequest--;
                // sometimes synchronization fails, make sure pendingRequest is never < 0
                if (this.pendingRequest < 0) {
                    this.pendingRequest = 0;
                }
                delete this.pending[element.name];
                if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },
            previousValue: function(element) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, "remote")
                });
            }

        },
        classRuleSettings: {
            required: {required: true},
            email: {email: true},
            url: {url: true},
            date: {date: true},
            dateISO: {dateISO: true},
            number: {number: true},
            digits: {digits: true},
            creditcard: {creditcard: true}
        },
        addClassRules: function(className, rules) {
            if (className.constructor === String) {
                this.classRuleSettings[className] = rules;
            } else {
                $.extend(this.classRuleSettings, className);
            }
        },
        classRules: function(element) {
            var rules = {};
            var classes = $(element).attr("class");
            if (classes) {
                $.each(classes.split(" "), function() {
                    if (this in $.validator.classRuleSettings) {
                        $.extend(rules, $.validator.classRuleSettings[this]);
                    }
                });
            }
            return rules;
        },
        attributeRules: function(element) {
            var rules = {};
            var $element = $(element);
            var type = $element[0].getAttribute("type");

            for (var method in $.validator.methods) {
                var value;

                // support for <input required> in both html5 and older browsers
                if (method === "required") {
                    value = $element.get(0).getAttribute(method);
                    // Some browsers return an empty string for the required attribute
                    // and non-HTML5 browsers might have required="" markup
                    if (value === "") {
                        value = true;
                    }
                    // force non-HTML5 browsers to return bool
                    value = !!value;
                } else {
                    value = $element.attr(method);
                }

                // convert the value to a number for number inputs, and for text for backwards compability
                // allows type="date" and others to be compared as strings
                if (/min|max/.test(method) && (type === null || /number|range|text/.test(type))) {
                    value = Number(value);
                }

                if (value) {
                    rules[method] = value;
                } else if (type === method && type !== 'range') {
                    // exception: the jquery validate 'range' method
                    // does not test for the html5 'range' type
                    rules[method] = true;
                }
            }

            // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }

            return rules;
        },
        dataRules: function(element) {
            var method, value,
                    rules = {}, $element = $(element);
            for (method in $.validator.methods) {
                value = $element.data("rule-" + method.toLowerCase());
                if (value !== undefined) {
                    rules[method] = value;
                }
            }
            return rules;
        },
        staticRules: function(element) {
            var rules = {};
            var validator = $.data(element.form, "validator");
            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },
        normalizeRules: function(rules, element) {
            // handle dependency check
            $.each(rules, function(prop, val) {
                // ignore rule when param is explicitly false, eg. required:false
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete rules[prop];
                    }
                }
            });

            // evaluate parameters
            $.each(rules, function(rule, parameter) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            });

            // clean number parameters
            $.each(['minlength', 'maxlength'], function() {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(['rangelength', 'range'], function() {
                var parts;
                if (rules[this]) {
                    if ($.isArray(rules[this])) {
                        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                    } else if (typeof rules[this] === "string") {
                        parts = rules[this].split(/[\s,]+/);
                        rules[this] = [Number(parts[0]), Number(parts[1])];
                    }
                }
            });

            if ($.validator.autoCreateRanges) {
                // auto-create ranges
                if (rules.min && rules.max) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength && rules.maxlength) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }

            return rules;
        },
        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function(data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function() {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },
        // http://docs.jquery.com/Plugins/Validation/Validator/addMethod
        addMethod: function(name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },
        methods: {
            // http://docs.jquery.com/Plugins/Validation/Methods/required
            required: function(value, element, param) {
                // check if dependency is met
                if (!this.depend(param, element)) {
                    return "dependency-mismatch";
                }
                if (element.nodeName.toLowerCase() === "select") {
                    // could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if (this.checkable(element)) {
                    return this.getLength(value, element) > 0;
                }
                return $.trim(value).length > 0;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/email
            email: function(value, element) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/url
            url: function(value, element) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
                return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/date
            date: function(value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
            dateISO: function(value, element) {
                return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/number
            number: function(value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/digits
            digits: function(value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
            // based on http://en.wikipedia.org/wiki/Luhn
            creditcard: function(value, element) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }
                // accept only spaces, digits and dashes
                if (/[^0-9 \-]+/.test(value)) {
                    return false;
                }
                var nCheck = 0,
                        nDigit = 0,
                        bEven = false;

                value = value.replace(/\D/g, "");

                for (var n = value.length - 1; n >= 0; n--) {
                    var cDigit = value.charAt(n);
                    nDigit = parseInt(cDigit, 10);
                    if (bEven) {
                        if ((nDigit *= 2) > 9) {
                            nDigit -= 9;
                        }
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }

                return (nCheck % 10) === 0;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/minlength
            minlength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length >= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
            maxlength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length <= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
            rangelength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/min
            min: function(value, element, param) {
                return this.optional(element) || value >= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/max
            max: function(value, element, param) {
                return this.optional(element) || value <= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/range
            range: function(value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
            equalTo: function(value, element, param) {
                // bind to the blur event of the target in order to revalidate whenever the target field is updated
                // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
                var target = $(param);
                if (this.settings.onfocusout) {
                    target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        $(element).valid();
                    });
                }
                return value === target.val();
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/remote
            remote: function(value, element, param) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }

                var previous = this.previousValue(element);
                if (!this.settings.messages[element.name]) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;

                param = typeof param === "string" && {url: param} || param;

                if (previous.old === value) {
                    return previous.valid;
                }

                previous.old = value;
                var validator = this;
                this.startRequest(element);
                var data = {};
                data[element.name] = value;
                $.ajax($.extend(true, {
                    url: param,
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    success: function(response) {
                        validator.settings.messages[element.name].remote = previous.originalMessage;
                        var valid = response === true || response === "true";
                        if (valid) {
                            var submitted = validator.formSubmitted;
                            validator.prepareElement(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            delete validator.invalid[element.name];
                            validator.showErrors();
                        } else {
                            var errors = {};
                            var message = response || validator.defaultMessage(element, "remote");
                            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                            validator.invalid[element.name] = true;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            }

        }

    });

// deprecated, use $.validator.format instead
    $.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
    var pendingRequests = {};
    // Use a prefilter if available (1.5+)
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function(settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        var ajax = $.ajax;
        $.ajax = function(settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
                    port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = ajax.apply(this, arguments);
                return pendingRequests[port];
            }
            return ajax.apply(this, arguments);
        };
    }
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
    $.extend($.fn, {
        validateDelegate: function(delegate, type, handler) {
            return this.bind(type, function(event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
}(jQuery));
"use strict";

jQuery(document).ready(function($) {


    if (Function('/*@cc_on return document.documentMode===10@*/')()) {
        document.documentElement.className += ' ie10';
    }


    /* Show testimonial after loading */
    $('.testimonial-item').css('visibility', 'visible');


    /* Tabs Init */
    easyTabsZeina('.tab-container', {
        animationSpeed: 'fast',
        defaultTab: 'li:first-child',
        tabs: 'ul>li'
    });


    /* Search Box Effect Handler */

    //Click
    $('.searchbox .searchbox-icon,.searchbox .searchbox-inputtext').bind('click', function() {
        var $search_tbox = $('.searchbox .searchbox-inputtext');
        $search_tbox.css('width', '120px');
        $search_tbox.focus();
        $('.searchbox', this).addClass('searchbox-focus');
    });

    //Blur
    $('.top-bar .searchbox-inputtext,body').bind('blur', function() {
        var $search_tbox = $('.searchbox .searchbox-inputtext');
        $search_tbox.css('width', '0px');
        $('.searchbox', this).removeClass('searchbox-focus');
    });

    // Clients Carousel
    $(".clients-list").carouFredSel({
        items: {
            width: 170,
            visible: {
                min: 1,
                max: 6
            }
        },
        prev: {
            button: function() {
                return jQuery(this).closest('.row-fluid').find('.carousel-prev');
            },
            key: "left"
        },
        next: {
            button: function() {
                return jQuery(this).closest('.row-fluid').find('.carousel-next');
            },
            key: "right"
        },
        responsive: true,
        auto: false,
        scroll: {
            onAfter: function() {
                /**
                 We have bug in chrome, and we need to force chrome to re-render specific portion of the page
                 after it's complete the scrolling animation so this is why we add these dumb lines.
                 */
                if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                    this.style.display = 'none';
                    this.offsetHeight;
                    this.style.display = 'block';
                }

            },
            items: 1
        }

    }, {
        debug: false
    });


    $('.accordion .accordion-row:first-child .title').trigger('click');


    if (document.getElementById('contact_map')) {
        google.maps.event.addDomListener(window, 'load', contactusMap);
    }


    /* Portfolio PrettyPhoto */


    $("a[data-rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'fast', /* fast/slow/normal */
        slideshow: 5000, /* false OR interval time in ms */
        autoplay_slideshow: false, /* true/false */
        opacity: 0.80  /* Value between 0 and 1 */
    });


    $('.navigation').AXMenu({
        showArrowIcon: true, // true for showing the menu arrow, false for hide them
        firstLevelArrowIcon: '',
        menuArrowIcon: ""
    });


    /* Mobile Nav */
    $('.header .mobile-nav ').append($('.navigation').html());
    $('.header .mobile-nav li').bind('click', function(e) {

        var $this = $(this);
        var $ulKid = $this.find('>ul');
        var $ulKidA = $this.find('>a');

        if ($ulKid.length === 0 && $ulKidA[0].nodeName.toLowerCase() === 'a') {
            window.location.href = $ulKidA.attr('href');
        }
        else {
            $ulKid.toggle(0, function() {
                if ($(this).css('display') === 'block') {
                    $ulKidA.find('.icon-chevron-down').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                }
                else {
                    $ulKidA.find('.icon-chevron-up').removeClass('icon-chevron-up').addClass('icon-chevron-down');
                }
            });
        }

        e.stopPropagation();

        return false;
    });

    $('.mobile-menu-button').click(function() {
        $('.mobile-nav').toggle();
    });

    $('.header .mobile-nav .icon-chevron-right').each(function() {
        $(this).removeClass('icon-chevron-right').addClass('icon-chevron-down');
    });


    /* Revolution Slider */
    //show until every thing loaded
    $('.rev-slider-fixed,.rev-slider-full').css('visibility', 'visible');

    //Fixed Size
    $('.rev-slider-banner-fixed').revolution({
        delay: 5000,
        startwidth: 926,
        startheight: 430,
        onHoverStop: "on",
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 3,
        hideThumbs: 0,
        navigationType: "bullet",
        navigationArrows: "solo",
        navigationStyle: "round",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 30,
        navigationVOffset: -40,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: 5,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: 5,
        soloArrowRightVOffset: 0,
        touchenabled: "on",
        stopAtSlide: -1,
        stopAfterLoops: -1,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        hideSliderAtLimit: 0,
        fullWidth: "off",
        fullScreen: "off",
        fullScreenOffsetContainer: "#topheader-to-offset",
        shadow: 0

    });


    /* Full */
    $('.rev-slider-banner-full').revolution({
        delay: 5000,
        startwidth: 1170,
        startheight: 500,
        onHoverStop: "on",
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 3,
        hideThumbs: 0,
        navigationType: "none",
        navigationArrows: "solo",
        navigationStyle: "bullets",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 30,
        navigationVOffset: 30,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: 20,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: 20,
        soloArrowRightVOffset: 0,
        touchenabled: "on",
        stopAtSlide: -1,
        stopAfterLoops: -1,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        hideSliderAtLimit: 0,
        fullWidth: "on",
        fullScreen: "off",
        fullScreenOffsetContainer: "#topheader-to-offset",
        shadow: 0

    });



    /* Accrodion */
    zeinaAccordion('.accordion', true);


    /* Init the plugin */


    form_validation('#contact-form');
    form_validation('#comment-form');

    /* get in touch form valdiation */
    $('#footer-contact-form').validate({
        rules: {
            name: "required"
        }
    });

    /* to top button */
    $('body').append('<div id="to-top-button"> <i class="fa fa-angle-up"></i> </div>');


    $('#to-top-button').click(function() {
        $('body,html').animate({
            scrollTop: 0
        });
    });


    /* Info Box Listeners */
    $('.alert a.alert-remove').click(function() {
        $(this).parents('.alert').first().fadeOut();
        return false;
    });

    $(window).resize(function() {
        centeringBullets();

        $('.tab-container').trigger('easytabs:midTransition');
        $('#masonry-elements,.portfolio-items').isotope('reLayout');
        setTimeout(function() {
            $('#masonry-elements,.portfolio-items').isotope('reLayout');
        }, 500);
    });

    //place holder fallback
    $('input, textarea').placeholder();


    //process video posts
    embed_video_processing();

    //init tooltip tipsy
    $('.social-media-icon,.tool-tip').tipsy({gravity: 's', fade: true, offset: 5});


    //Remove tipsy tooltip event from image overlay elements
    $('.item_img_overlay_content .social-media-icon,.top-bar .social-media-icon').unbind('mouseenter');


    //Callout Box And Message Box Mobile Button
    $('.message-box ,.callout-box').each(function() {
        var $box = $(this);
        var $button = $box.find(".btn");
        $box.append('<button href="' + $button.attr("href") + '" class="' + $button.attr("class") + ' btn-mobile">' + $button.html() + '</button>');

    });

    //stickyMenu();

    if ($("html").hasClass("lt-ie9")) {

        //bread crumb last child fix for IE8
        $('.breadcrumbs li:last-child').addClass('last-child');
        $('.navigation > li:last-child').addClass('last-child-nav');
        $('.flickr_badge_wrapper .flickr_badge_image').addClass('flicker-ie');
        $('.flickr_badge_wrapper .flickr_badge_image:nth-child(3n+1)').addClass('last-child-flicker');
        $('.content-style3 ').css('width', '100%').css('width', '-=28px');
        $('.section-subscribe input[type=text]').css('width', '100%').css('width', '-=40px');
        $('.blog-search .blog-search-input').css('width', '100%').css('width', '-=40px');

        $('.tab').click(function() {
            setTimeout(function() {
                $('.content-style3 ').css('width', '100%').css('width', '-=28px');
                $('.section-subscribe input[type=text]').css('width', '100%').css('width', '-=40px');
            }, 500);

        });

        setInterval(function() {
            $('#masonry-elements,.portfolio-items').isotope('reLayout');
        }, 1000);
    }
    ;

    centeringBullets();


    var $cont = $('.portfolio-items');

    // IE 8
    if ($("html").hasClass("lt-ie9")) {
        $cont.isotope({
            itemSelector: '.portfolio-items .thumb-label-item',
            masonry: {columnWidth: $('.isotope-item:first').width(), gutterWidth: 6},
            filter: '*',
            transformsEnabled: false,
            layoutMode: 'masonry',
            animationEngine: 'css'
        });
    }
    else {
        $cont.isotope({
            itemSelector: '.portfolio-items .thumb-label-item',
            masonry: {columnWidth: $('.isotope-item:first').width(), gutterWidth: 6},
            filter: '*',
            transformsEnabled: false,
            layoutMode: 'masonry',
            //  animationEngine: 'css'
        });
    }


    $('.portfolio-filter-container a').click(function() {
        $cont.isotope({
            filter: this.getAttribute('data-filter')
        });

        return false;
    });

    var lastClickFilter = null;
    $('.portfolio-filter a').click(function() {

        //first clicked we don't know which element is selected last time
        if (lastClickFilter === null) {
            $('.portfolio-filter a').removeClass('portfolio-selected');
        }
        else {
            $(lastClickFilter).removeClass('portfolio-selected');
        }

        lastClickFilter = this;
        $(this).addClass('portfolio-selected');
    });


});


/* Portfolio */

var loaded = false, timeout = 20000;//loaded flag for timeout
setTimeout(function() {
    if (!loaded) {
        hideLoading();
    }
}, timeout);

$(window).load(function() {
    loaded = true;
    centeringBullets();

    hideLoading();

    var $masonryElement = $('#masonry-elements');
    $masonryElement.isotope({
        transformsEnabled: false,
        masonry: {
            columnWidth: 270,
            gutterWidth: 15
        }
    });

    $masonryElement.infinitescroll({
        navSelector: '#masonry-elements-nav', // selector for the paged navigation
        nextSelector: '#masonry-elements-nav a:first', // selector for the NEXT link (to page 2)
        itemSelector: '.feature', // selector for all items you'll retrieve
        loading: {
            finishedMsg: 'No more pages to load.',
            img: 'images/loading.gif',
            selector: '#loading',
            speed: 'normal'
        },
        maxPage: 3
    },
    // call Isotope as a callback
    function(newElements) {
        embed_video_processing();
        var $newElements = $(newElements);
        $masonryElement.append($newElements);
        $masonryElement.isotope('appended', $newElements);

        $masonryElement.find('.cycle-slideshow').cycle({
        });
    });

    $('#masonry-elements,.portfolio-items').isotope('reLayout');
});


/* Loading functions */
function hideLoading() {
    $('.loading-container').remove();
    $('.hide-until-loading').removeClass('hide-until-loading');
}

/**
 * This function used to add some features to easytabs  out of the box.
 * @param selector
 */
function easyTabsZeina(selector, options) {
    var $ref = $(selector);

    $('.tab-container').css('visibility', 'visible');
    options = options || {};
    options['animationSpeed'] = options['animationSpeed'] || 'fast';
    $ref.easytabs(options).bind('easytabs:midTransition', function() {
        var $this = $(this), activeLink = $this.find('a.active'), offset = activeLink.offset();
        $this.find('.section-tab-arrow').css('left', ((offset.left + (activeLink.outerWidth()) / 2) - 7) + 'px');
    });

    //trigger event on init
    $ref.trigger('easytabs:midTransition');
    $(window).load(function() {
        $ref.trigger('easytabs:midTransition');
    });

}


/* Contaact Map */
var map;
function contactusMap() {

    var myLatlng, mapOptions, marker;
    var myLatlng = new google.maps.LatLng(-37.817590, 144.965188);

    mapOptions = {
        zoom: 11,
        center: myLatlng,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('contact_map'), mapOptions);

    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Envato'
    });
}


/**
 * Form Validation Helper
 */
function form_validation(selector) {
    var errorContainerOpen = '<div class="span1 error_container" ><div class="error-box">',
            errorContainerClose = '<i class="icon-remove"></i></div></div>';
    /* Contact From Validation */
    $(selector).validate({
        errorClass: "input_error",
        errorElement: "span",
        success: function(label, element) {

        }
    });

}


/**
 * Embed Video
 */
function embed_video_processing() {

    var youtube_template = '<iframe src="http://www.youtube.com/embed/{{id}}" frameborder="0" allowfullscreen=""  width="100%" height="100%" allowfullscreen></iframe>',
            vimeo_template = '<iframe src="http://player.vimeo.com/video/{{id}}?color=ffffff" frameborder="0" allowfullscreen=""  width="100%" height="360"></iframe>',
            soundcloud_template = '<iframe src="https://w.soundcloud.com/player/?url={{id}}" frameborder="0" allowfullscreen=""  width="100%" height="166"></iframe>',
            template, id;

    $('.blog-post-youtube,.blog-post-vimeo,.blog-post-soundcloud').each(function() {
        id = false;

        //youtube
        if ($(this).hasClass('blog-post-youtube')) {
            id = getYoutubeId($(this).attr('href'));
            template = youtube_template;
        }
        //vimeo
        else if ($(this).hasClass('blog-post-vimeo')) {
            id = getVimeoId($(this).attr('href'));
            template = vimeo_template;
        }
        //sound clound
        else if ($(this).hasClass('blog-post-soundcloud')) {
            id = $(this).attr('href');
            template = soundcloud_template;
        }

        if (id !== false) {
            //process the template
            $(this).replaceWith(template.replace('{{id}}', id));
        }

    });

}

/***
 * Get youtube url.
 *
 * @param url
 * @returns {*}
 */
function getYoutubeId(url) {
    var regExp = /^.*((youtu.[\w]{1,3}\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
        return false;
    }
}
/***
 * Get vimeo url.
 *
 * @param url
 * @returns {*}
 */
function getVimeoId(url) {
    var regExp = /http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
    var match = url.match(regExp);

    if (match) {
        return  match[2];
    } else {
        return false;
    }
}


/*
 * Zeina Accordion
 * Written specially for Zeina Theme
 */
function zeinaAccordion(selector) {

    $(document).on('click', selector + ' .accordion-row .title,' + selector + ' .accordion-row .open-icon', function() {

        var me = this,
                accordion = $(this).parents('.accordion'),
                $prev,
                $accRow = $(this),
                $accTitle = $accRow.parent(), $this, icon, desc, title, activeRow,
                $accRow = $accTitle.parent(),
                toggle = accordion.data('toggle') == 'on' ? true : false;


        if (toggle === true) {

            icon = $accTitle.find('.open-icon');
            desc = $accTitle.find('.desc');
            title = $accTitle.find('.title');

            if ($accTitle.find('.close-icon').length > 0) {
                desc.slideUp('fast');
                icon.removeClass('close-icon');
                title.removeClass('active');
            }
            else {
                desc.slideDown('fast');
                icon.addClass('close-icon');
                title.addClass('active');
            }

        }
        else {
            $accRow.find('.accordion-row').each(function() {

                $this = $(this);
                icon = $this.find('.open-icon');
                desc = $this.find('.desc');
                title = $this.find('.title');

                /* if this the one which is clicked , slide up  */
                if ($accTitle[0] != this) {
                    desc.slideUp('fast');
                    icon.removeClass('close-icon');
                    title.removeClass('active');
                }

                else {
                    desc.slideDown('fast');
                    icon.addClass('close-icon');
                    title.addClass('active');
                }

            });
        }

    });


    // active div
    $(selector).each(function() {

        var $this = $(this), icon, desc, title, activeRow,
                activeIndex = parseInt($this.data('active-index')),
                activeIndex = activeIndex < 0 ? false : activeIndex;

        if (activeIndex !== false) {
            activeRow = $this.find('.accordion-row').eq(activeIndex);
            icon = activeRow.find('.open-icon');
            desc = activeRow.find('.desc');
            title = activeRow.find('.title');

            desc.slideDown('fast');
            icon.addClass('close-icon');
            title.addClass('active');
        }

    });


}

/* Sticky Menu */
function stickyMenu() {

    $(window).scroll(function() {
        if ($(window).scrollTop() > 35) {
            $('#header').addClass('sticky-header');
            $('.sticky-navigation,#to-top-button').fadeIn();
        }
        else {
            $('#header').removeClass('sticky-header');
            $('.sticky-navigation,#to-top-button').fadeOut();
        }
    });
}

/* Centering Bullets */
function centeringBullets() {
    //Bullets center fixing in revolution slide
    $('.simplebullets,.slider-fixed-frame .home-bullets').each(function() {
        var $this = $(this), w = $this.width();
        $this.css('margin-left', -(w / 2) + 'px');
    });
}
;
// retina.js, a high-resolution image swapper (http://retinajs.com), v0.0.2

(function() {
    function t(e) {
        this.path = e;
        var t = this.path.split("."), n = t.slice(0, t.length - 1).join("."), r = t[t.length - 1];
        this.at_2x_path = n + "@2x." + r
    }
    function n(e) {
        this.el = e, this.path = new t(this.el.getAttribute("src"));
        var n = this;
        this.path.check_2x_variant(function(e) {
            e && n.swap()
        })
    }
    var e = typeof exports == "undefined" ? window : exports;
    e.RetinaImagePath = t, t.confirmed_paths = [], t.prototype.is_external = function() {
        return!!this.path.match(/^https?\:/i) && !this.path.match("//" + document.domain)
    }, t.prototype.check_2x_variant = function(e) {
        var n, r = this;
        if (this.is_external())
            return e(!1);
        if (this.at_2x_path in t.confirmed_paths)
            return e(!0);
        n = new XMLHttpRequest, n.open("HEAD", this.at_2x_path), n.onreadystatechange = function() {
            return n.readyState != 4 ? e(!1) : n.status >= 200 && n.status <= 399 ? (t.confirmed_paths.push(r.at_2x_path), e(!0)) : e(!1)
        }, n.send()
    }, e.RetinaImage = n, n.prototype.swap = function(e) {
        function n() {
            t.el.complete ? (t.el.setAttribute("width", t.el.offsetWidth), t.el.setAttribute("height", t.el.offsetHeight), t.el.setAttribute("src", e)) : setTimeout(n, 5)
        }
        typeof e == "undefined" && (e = this.path.at_2x_path);
        var t = this;
        n()
    }, e.devicePixelRatio > 1 && (window.onload = function() {
        var e = document.getElementsByTagName("img"), t = [], r, i;
        for (r = 0; r < e.length; r++)
            i = e[r], t.push(new n(i))
    })
})();
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//



;
