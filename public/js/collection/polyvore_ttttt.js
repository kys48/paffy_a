(function() {
	var a = Math.random;
	Math.random = function() {
		var b;
		try {
			if (window.crypto && window.crypto.getRandomValues) {
				var c = new Uint32Array(1);
				window.crypto.getRandomValues(c);
				b = c[0] / 4294967296
			} else {
				b = a.call()
			}
		} catch(d) {
			b = a.call()
		}
		return b
	}
})();
RegExp.escape = (function() {
	var a = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
	var b = new RegExp("(\\" + a.join("|\\") + ")", "g");
	return function(c) {
		return c.replace(b, "\\$1")
	}
})();
if (!Array.prototype.shuffle) {
	Array.prototype.shuffle = function() {
		var a = new Hash();
		this.forEach(function(b) {
			a.put(b, Math.random())
		});
		this.sort(function(d, c) {
			return a.get(d) - a.get(c)
		});
		return this
	}
}
Array.prototype.fixedShuffle = function(g, f, d) {
	var a = g || 0;
	f = f || 3600;
	if (f > 0) {
		d = d || (new Date()).getTime() / 1000;
		a += Math.floor(d / f)
	}
	var b = new Random(a);
	var c = new Hash();
	this.forEach(function(h) {
		c.put(h, b.next())
	});
	this.sort(function(j, h) {
		return c.get(j) - c.get(h)
	});
	return this
};
if (!Array.prototype.sortByFreq) {
	Array.prototype.sortByFreq = function() {
		var b = {};
		this.forEach(function(a) {
			if (b[a]) {
				b[a]++
			} else {
				b[a] = 1
			}
		});
		var c = [];
		forEachKey(b, function(a) {
			c.push({
				k : a,
				v : b[a]
			})
		});
		return c.sort(function(f, d) {
			return f.v - d.v
		}).map(function(a) {
			return a.k
		})
	}
}
if (!Array.prototype.sortColumns) {
	Array.prototype.sortColumns = function(c) {
		var g = Math.ceil(this.length / c);
		var f = this.length % c;
		var a = [];
		var b = 0;
		for (var d = 0; d < c; d++) {
			for (var h = 0; h < g && b < this.length; h++) {
				a.push({
					column : d,
					row : h,
					value : this[b++]
				})
			}
			if (--f === 0 && b < this.length) {
				g--
			}
		}
		return a.sort(function(k, j) {
			return (k.row - j.row) || (k.column - j.column)
		}).map(function(j) {
			return j.value
		})
	}
}
if (!Array.prototype.map) {
	Array.prototype.map = function(g, d) {
		var c = Event.wrapper(g, d);
		var a = [];
		for (var b = 0; b < this.length; ++b) {
			a.push(c(this[b], b, this))
		}
		return a
	}
}
if (!Array.max) {
	Array.max = function(a) {
		return Math.max.apply(Math, a)
	}
}
if (!Array.min) {
	Array.min = function(a) {
		return Math.min.apply(Math, a)
	}
}
if (!Array.prototype.forEachNonBlocking) {
	Array.prototype.forEachNonBlocking = function(b, f, c, h) {
		var d = 0;
		var g = this;
		var a = this.length;
		f = h ? Event.wrapper(f, h) : f;
		c = h ? Event.wrapper(c || noop, h) : (c || noop);
		loopNonBlocking(b, function() {
			if (d < a) {
				f(g[d++])
			} else {
				return true
			}
		}, c)
	}
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function(h, g) {
		var d = Event.wrapper(h, g);
		var a = [];
		for (var b = 0; b < this.length; ++b) {
			var c = this[b];
			if (d(c)) {
				a.push(c)
			}
		}
		return a
	}
}
Array.prototype.uniq_by_key = function(b) {
	var a = {};
	return this.filter(function(d) {
		var c = d[b];
		if (c && a[c]) {
			return false
		}
		a[c] = true;
		return true
	})
};
if (!Array.prototype.uniq) {
	Array.prototype.uniq = function() {
		var a = [];
		var b = {};
		for (var c = 0; c < this.length; ++c) {
			var d = this[c];
			if (!Object.prototype.hasOwnProperty.call(b, d)) {
				b[d] = 1;
				a.push(d)
			}
		}
		return a
	}
}
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(g, d) {
		var c = Event.wrapper(g, d);
		var a = this.length;
		for (var b = 0; b < this.length; ++b) {
			if (a != this.length) {
				throw "Attempt to modify array in forEach"
			}
			c(this[b])
		}
	}
}
if (!Array.prototype.forEachReverse) {
	Array.prototype.forEachReverse = function(g, d) {
		var c = Event.wrapper(g, d);
		var a = this.length;
		for (var b = a - 1; b >= 0; --b) {
			if (a != this.length) {
				throw "Attempt to modify array in forEach"
			}
			if (c(this[b])) {
				break
			}
		}
	}
}
if (!Array.prototype.reduce) {
	Array.prototype.reduce = function(b) {
		var a = this.length;
		if ( typeof (b) != "function") {
			throw new TypeError()
		}
		if (a === 0 && arguments.length == 1) {
			throw new TypeError()
		}
		var c = 0;
		var d;
		if (arguments.length >= 2) {
			d = arguments[1]
		} else {
			do {
				if ( c in this) {
					d = this[c++];
					break
				}
				if (++c >= a) {
					throw new TypeError()
				}
			} while(true)
		}
		for (; c < a; c++) {
			if ( c in this) {
				d = b.call(null, d, this[c], c, this)
			}
		}
		return d
	}
}
Array.prototype.find = function(c, a) {
	if ( typeof (c) == "function") {
		Beacon.log("typerror", {
			file : "builtin.js",
			"function" : "find"
		}, true);
		throw new TypeError()
	}
	a = a || compare;
	var b;
	for ( b = 0; b < this.length; b++) {
		if (a(c, this[b])) {
			return b
		}
	}
	return -1
};
if (!Array.prototype.contains) {
	Array.prototype.contains = function(b, a) {
		return this.find(b, a) >= 0
	}
}
if (!Array.prototype.some) {
	Array.prototype.some = function(b) {
		for (var a = 0; a < this.length; ++a) {
			if (b(this[a])) {
				return true
			}
		}
		return false
	}
}
if (!Array.prototype.remove) {
	Array.prototype.remove = function(c, a) {
		var b = this.find(c, a);
		if (b > -1) {
			return this.splice(b, 1)
		} else {
			return false
		}
	}
}
if (!Array.prototype.removeAll) {
	Array.prototype.removeAll = function(c, b) {
		var a = [];
		var d = false;
		do {
			d = this.remove(c, b);
			if (d !== false) {
				a.push(d)
			}
		} while(d);
		if (a.length > 0) {
			return a
		} else {
			return false
		}
	}
}
Array.prototype.swap = function(c, a) {
	var b = this[a];
	this[a] = this[c];
	this[c] = b
};
if (!Array.prototype.randomItem) {
	Array.prototype.randomItem = function() {
		var a = Math.random() * this.length;
		a = Math.floor(a);
		return this[a]
	}
}
if (!String.prototype.quote) {
	String.prototype.quote = function() {
		return JSON2.stringify(this + "")
	}
}
if (!String.prototype.ucFirst) {
	String.prototype.ucFirst = function() {
		if (this.length) {
			return this.charAt(0).toUpperCase() + this.substr(1)
		}
		return this
	}
}
if (!String.prototype.ucWords) {
	String.prototype.ucWords = function() {
		var a = this;
		if (this.length) {
			a = this.toLowerCase().replace(/\b[a-z]/g, function(b) {
				return b.toUpperCase()
			})
		}
		return a
	}
}
if (!Date.prototype.stdTimezoneOffset) {
	Date.prototype.stdTimezoneOffset = function() {
		var a = new Date(this.getFullYear(), 0, 1);
		var b = new Date(this.getFullYear(), 6, 1);
		return Math.max(a.getTimezoneOffset(), b.getTimezoneOffset())
	}
}
if (!Date.prototype.dst) {
	Date.prototype.dst = function() {
		return this.getTimezoneOffset() < this.stdTimezoneOffset()
	}
}
if (!Date.getDaysInMonth) {
	Date.getDaysInMonth = function(a, b) {
		return new Date(a, b + 1, 0).getDate()
	}
}
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "")
	}
}
if (!String.prototype.ltrim) {
	String.prototype.ltrim = function() {
		return this.replace(/^\s+/, "")
	}
}
if (!String.prototype.rtrim) {
	String.prototype.rtrim = function() {
		return this.replace(/\s+$/, "")
	}
}
String.prototype.patternCount = function(b) {
	if (!b) {
		return 0
	}
	if ( typeof (b) == "object" && b.constructor == RegExp.prototype.constructor) {
		b = new RegExp(b.source, "g")
	}
	var a = 0;
	this.replace(b, function() {
		a++
	});
	return a
};
if ("abc".split(/(b)/).length < 3) {
	String.prototype._oldSplit = String.prototype.split;
	String.prototype.split = function(c, a) {
		if ( typeof (c) == "object" && c.constructor == RegExp.prototype.constructor) {
			var b = c.source;
			if (b.patternCount("\\(") < b.patternCount("(")) {
				var d = "$";
				while (this.indexOf(d) > -1) {
					d += "$"
				}
				c = new RegExp(b, "g");
				return this.replace(c, function(f, g) {
					return d + g + d
				})._oldSplit(d, a)
			}
		}
		return this._oldSplit(c, a)
	}
}
if (window.SVGAnimatedString) {
	SVGAnimatedString.prototype.split = function() {
		return []
	}
}
var Conf = function() {
	var d = {
		dev : {
			cookieDomain : ".polyvore.net",
			oldImgHost : "www.polyvore.net",
			imgHosts : ["img1.polyvore.net", "img2.polyvore.net"],
			httpsImgHost : "www.polyvore.net",
			cdnImgHosts : {},
			blogUrl : "http://blog.polyvore.com",
			fbApiKey : "e006261993081197d9a617cbb0b6e7b6",
			isStaging : true,
			appEffectsCategories : [327, 329, 330, 331]
		},
		snapshot : {
			cookieDomain : ".polyvore.net",
			oldImgHost : "www.polyvore.com",
			imgHosts : ["img1.polyvoreimg.com", "img2.polyvoreimg.com"],
			httpsImgHost : "www.polyvore.com",
			cdnImgHosts : {
				akamai : ["ak1.polyvoreimg.com", "ak2.polyvoreimg.com"]
			},
			httpsCdnImgHost : "www.polyvore.com",
			rewriteImgBase : true,
			blogUrl : "http://blog.polyvore.com",
			fbApiKey : "e006261993081197d9a617cbb0b6e7b6",
			isStaging : true,
			appEffectsCategories : [327, 329, 330, 331]
		},
		testenv : (function() {
			var p = window._polyvoreDevName;
			var q = "testenv." + p + ".polyvore.net";
			return {
				cookieDomain : ".polyvore.net",
				oldImgHost : q,
				imgHosts : [q],
				httpsImgHost : q,
				cdnImgHosts : {},
				blogUrl : "http://blog.polyvore.com",
				fbApiKey : "e006261993081197d9a617cbb0b6e7b6",
				isStaging : true
			}
		})(),
		live : {
			cookieDomain : ".polyvore.net",
			oldImgHost : "www.polyvore.com",
			imgHosts : ["img1.polyvoreimg.com", "img2.polyvoreimg.com"],
			httpsImgHost : "www.polyvore.com",
			cdnImgHosts : {
				akamai : ["ak1.polyvoreimg.com", "ak2.polyvoreimg.com"]
			},
			httpsCdnImgHost : "www.polyvore.com",
			rewriteImgBase : true,
			blogUrl : "http://blog.polyvore.com",
			fbApiKey : "e006261993081197d9a617cbb0b6e7b6",
			isStaging : true,
			appEffectsCategories : [327, 329, 330, 331]
		},
		prod : {
			webHost : "www.polyvore.com",
			cookieDomain : ".polyvore.com",
			oldImgHost : "www.polyvore.com",
			imgHosts : ["img1.polyvoreimg.com", "img2.polyvoreimg.com"],
			httpsImgHost : "www.polyvore.com",
			cdnImgHosts : {
				akamai : ["ak1.polyvoreimg.com", "ak2.polyvoreimg.com"]
			},
			httpsCdnImgHost : "www.polyvore.com",
			rsrcUrlPrefix : {
				akamai : "http://akwww.polyvorecdn.com/rsrc/"
			},
			httpsRsrcUrlPrefix : "https://www.polyvore.com/rsrc/",
			rsrcExtUrlPrefix : "http://ext.polyvorecdn.com/rsrc/",
			noCachePrefix : "http://rsrc.polyvore.com/rsrc/",
			blogUrl : "http://blog.polyvore.com",
			fbApiKey : "3d1d18f72a710e20514cd62955686c8f",
			isStaging : false,
			appEffectsCategories : [327, 329, 330, 331]
		}
	};
	var o = window.polyvore_mode || window._polyvoreMode || "prod";
	var g = d[o];
	var h = null;
	if (window._polyvoreLocale && window._polyvoreLocale != "en") {
		h = window._polyvoreLocale
	}
	var b = "";
	try {
		var j = document.getElementsByTagName("script");
		for (var k = j.length - 1; k >= 0; k--) {
			var m = j[k];
			var a = m.src.toString();
			if (a && !/^(([a-z]+):\/\/)/.test(a)) {
				var c = document.createElement("div");
				a = a.replace('"', "%22");
				c.innerHTML = '<a href="' + a + '" style="display:none">x</a>';
				a = c.firstChild.href
			}
			if (a && /polyvore/.test(a.match(/\/\/([^\/]*)/)[1])) {
				b = a.replace(/.*https?:\/\/[^\/]*\//, "/").replace(/(\/[^\/]*){2,2}$/, "");
				break
			}
		}
	} catch(l) {
	}
	var f;
	function n(s, v) {
		var u = [s];
		var q = [];
		forEachKey(v, function(w) {
			q.push(w)
		});
		q.sort();
		q.forEach(function(w) {
			u.push(v[w])
		});
		var t = 0;
		u = u.join("");
		for (var r = 0, p = u.length; r < p; r++) {
			t += u.charCodeAt(r)
		}
		return t
	}
	return {
		getDevName : function() {
			return window._polyvoreDevName
		},
		getFbApiKey : function() {
			return g.fbApiKey
		},
		getCookieDomain : function() {
			return g.cookieDomain
		},
		getWebHost : function() {
			return g.webHost || window._polyvoreHost || "www.polyvore.net"
		},
		getWebUrlPrefix : function() {
			return Conf.getWebHost() + b
		},
		getImgHost : function(p, r) {
			if (getProtocol() == "https") {
				return g.httpsImgHost
			}
			if (!r) {
				r = {}
			}
			if (r.size == "x" || r.size == "l" || r.size == "e") {
				return g.oldImgHost
			} else {
				var q = n(p, r);
				return g.imgHosts[q % g.imgHosts.length]
			}
		},
		getCDNImgHost : function(p, r, t) {
			if (getProtocol() == "https") {
				return g.httpsCdnImgHost
			}
			var q = g.cdnImgHosts[p];
			if (!q) {
				return ""
			}
			var s = n(r, t);
			return q[s % q.length]
		},
		getRsrcUrlPrefix : function(p, q) {
			if (f) {
				return f
			}
			if (getProtocol() == "https") {
				f = g.httpsRsrcUrlPrefix;
				return g.httpsRsrcUrlPrefix
			}
			if (q) {
				f = g.rsrcExtUrlPrefix
			} else {
				if (g.rsrcUrlPrefix) {
					f = g.rsrcUrlPrefix[p]
				}
			}
			if (!f) {
				f = "http://" + Conf.getWebUrlPrefix() + "/rsrc/"
			}
			return f
		},
		getNoCachePrefix : function() {
			return g.noCachePrefix ? g.noCachePrefix : "http://" + Conf.getWebUrlPrefix() + "/rsrc/"
		},
		getBlogURL : function() {
			return g.blogUrl
		},
		isStaging : function() {
			return g.isStaging
		},
		setLocale : function(p) {
			h = p
		},
		getLocale : function() {
			return h
		},
		getModeName : function() {
			return o
		},
		getSetting : function(p) {
			return g[p]
		}
	}
}();
function noop() {
}

function round(b, a) {
	a = a || 1;
	if (a > 1) {
		return Math.round(b / a) * a
	} else {
		a = 1 / a;
		return Math.round(b * a) / a
	}
}

function flatten(b, a) {
	a = a || [];
	if (b !== undefined && b !== null) {
		if (b.constructor == Array) {
			b.map(function(c) {
				flatten(c, a)
			})
		} else {
			a.push(b)
		}
	}
	return a
}

function forEachKey(c, d, b) {
	for (var a in c) {
		if (c.hasOwnProperty(a)) {
			if (d.call(b, a, c[a])) {
				break
			}
		}
	}
}

function yield(a, b) {
	return window.setTimeout(Event.wrapper(a, b), 0)
}

function tryThese() {
	var f;
	for (var d = 0; d < arguments.length; d++) {
		var c = arguments[d];
		try {
			f = c();
			break
		} catch(g) {
			var b = 1
		}
	}
	return f
}

function plural(b, a, c, d) {
	b = Number(b);
	if (d && !b) {
		return d
	}
	if (a == "time") {
		switch(b) {
			case 1:
				return loc("once");
			case 2:
				return loc("twice");
			case 3:
				return loc("three") + " " + c;
			default:
				return b + " " + c
		}
	} else {
		switch(b) {
			case 1:
				return loc("one") + " " + a;
			case 2:
				return loc("two") + " " + c;
			case 3:
				return loc("three") + " " + c;
			default:
				return b + " " + c
		}
	}
}

function shortNumber(a) {
	if (a == 1) {
		return loc("one")
	} else {
		if (a == 2) {
			return loc("two")
		} else {
			if (a == 3) {
				return loc("three")
			}
		}
	}
	return a.toString()
}

function nodeListToArray(c) {
	var d = [];
	var a = c.length;
	d.length = a;
	for (var b = 0; b < a; b++) {
		d[b] = c[b]
	}
	return d
}

function toArray(a) {
	if (a) {
		if (a.constructor == Array) {
			return a
		} else {
			if (a.constructor != String && a.nodeType === undefined && a.length !== undefined && !isNaN(Number(a.length))) {
				return nodeListToArray(a)
			} else {
				return [a]
			}
		}
	} else {
		return []
	}
}

function createUUID() {
	var d = "0123456789abcdef".split("");
	var b = [];
	var c;
	for (var a = 0; a < 32; a++) {
		c = Math.floor(Math.random() * 16);
		if (a == 16) {
			b[a] = d[(c & 3) | 8]
		} else {
			b[a] = d[c]
		}
	}
	b[12] = "4";
	return b.join("")
}

function mergeObject(d, a, b) {
	for (var c in a) {
		if (a.hasOwnProperty(c) && (!b || !d.hasOwnProperty(c))) {
			d[c] = a[c]
		}
	}
	return d
}

function delayed(b, c) {
	var a;
	return function() {
		if (a) {
			clearTimeout(a)
		}
		var d = arguments;
		a = window.setTimeout(function() {
			b.apply(b, d)
		}, c)
	}
}

function splitWithMatches(h, j, c, b) {
	var f = [];
	var g = j.match(h) || [];
	var a = 0;
	var k = 0;
	while (a < g.length) {
		k = j.search(h);
		if (k < 0) {
			break
		}
		var l = j.substring(0, k);
		var d = g[a++];
		j = j.substring(k + d.length);
		if (l) {
			f.push( b ? b(l) : l)
		}
		if (d) {
			f.push( c ? c(d) : d)
		}
	}
	if (j) {
		f.push( b ? b(j) : j)
	}
	return f
}

function extend(b, c) {
	var a = function() {
	};
	a.prototype = c.prototype;
	b.prototype = new a();
	b.prototype.constructor = b;
	b.superclass = c.prototype;
	if (c.prototype.constructor == Object.prototype.constructor) {
		c.prototype.constructor = c
	}
}

function loopNonBlocking(a, f, c, d) {
	if (!f) {
		return
	}
	var b = function() {
		var j = true;
		var h = f;
		var g = new Date().getTime() + a;
		while (!h.apply(d)) {
			if (new Date().getTime() >= g) {
				window.setTimeout(b, Browser.isIE ? 80 : 0);
				j = false;
				break
			}
		}
		if (j && c) {
			c.apply(d)
		}
	};
	window.setTimeout(b, 0)
}

function countingSemaphore(a, f, c) {
	var d = Event.wrapper(f, c);
	var b = Event.wrapper(function() {
		if (--a === 0) {
			d()
		}
	});
	b.inc = function(g) {
		a += g || 1
	};
	b.clean = function() {
		d = noop
	};
	return b
}

function post(b, c) {
	if (!c) {
		c = {}
	}
	if (window._xsrfToken) {
		c[".xsrf"] = window._xsrfToken
	}
	var a = createNode("form");
	a.action = buildAbsURL(buildURL(b));
	a.method = "POST";
	a.appendChild(createNode("input", {
		type : "hidden",
		name : "request",
		value : JSON2.stringify(c)
	}));
	a.appendChild(createNode("input", {
		type : "hidden",
		name : ".in",
		value : "json"
	}));
	document.body.appendChild(a);
	a.submit()
}

function cloneObject(b, a) {
	if (!b) {
		return b
	}
	var c = new b.constructor();
	forEachKey(b, function(d, f) {
		if (a && typeof (f) == "object") {
			f = cloneObject(f, a)
		}
		c[d] = f
	});
	return c
}

function bucketName(a) {
	var b = window.polyvore_experiment_data && window.polyvore_experiment_data[a];
	b = b || {};
	return b.name || ""
}

function bucketIs(b, a) {
	return bucketName(b).toLowerCase() == a.toLowerCase()
}

function openWindow(b, c, n, j, m, l) {
	var f = n || 800;
	var o = j || 600;
	var d = screen.height;
	var a = screen.width;
	var g = m || Math.round((a / 2) - (f / 2));
	var k = l || Math.round((d / 2) - (o / 2));
	var p = "";
	p = "left=" + g + ",top=" + k + ",width=" + f + ",height=" + o;
	p += ",personalbar=0,toolbar=0,scrollbars=1,resizable=1,location=0,menubar=0";
	return window.open(c, "pv_" + b, p)
}

function returnFalse() {
	return false
}

try {
	document.execCommand("BackgroundImageCache", false, true)
} catch(e) {
}
function cache_buster() {
	return 1
}

if (!window.console) {
	window.console = {
		log : noop,
		debug : noop,
		error : noop
	}
}
var JS_VOID = "javascript:void(0)";
function isValidEmail(a) {
	return a && a.match(/^.+@[\w\-]+(\.[\w\-]+)*\.[A-Za-z]{2,10}/)
}

function toList(a) {
	if (a !== undefined && a !== null) {
		return (a.constructor == Array) ? a : [a]
	} else {
		return []
	}
}

function teaser(c, b, a) {
	if (!c || c.length <= b) {
		return c
	}
	if (a === undefined) {
		a = "..."
	}
	if (b < 4) {
		b = 4
	}
	return c.substring(0, b - 3) + a
}

function pluralNumber(b, a, c) {
	b = Number(b);
	if (b === 1) {
		return b + " " + a
	}
	return b + " " + c
}

function Boolean(a) {
	a = Number(a);
	return !!a
}

function handleException(a) {
	ModalDialog.alert(a.message)
}

function fbs_click(a, b) {
	a = a || location.href;
	b = b || document.title;
	window.open("http://www.facebook.com/sharer.php?u=" + encodeURIComponent(a) + "&t=" + encodeURIComponent(b), "sharer", "toolbar=0,status=0,width=626,height=436");
	return false
}

function hiddenPost(a) {
	a.method = "POST";
	a.target = "polyvore_hidden_iframe";
	a.appendChild(createNode("input", {
		type : "hidden",
		name : ".out",
		value : "json"
	}));
	a.submit()
}

function parseUnit(a) {
	if (a && a.match(/^([0-9]+)([a-z%]+)$/)) {
		return {
			value : parseInt(RegExp.$1, 10),
			unit : RegExp.$2
		}
	}
	return {
		value : parseInt(a, 10),
		unit : ""
	}
}

function normalizeCSV(c) {
	if (c) {
		var b = c.split(",");
		var a = [];
		b.forEach(function(d) {
			d = d.trim();
			if (d) {
				a.push(d)
			}
		});
		c = a.join(",")
	}
	return c
}

function mantissa(a) {
	return parseFloat((a < 0 ? "-0." : "0.") + ((""+a).split(".")[1] || 0))
}

function reloadPage() {
	window.location.reload(true)
}

function _timeUnits() {
	return [{
		singular : loc("year"),
		plural : loc("years"),
		seconds : 31536000
	}, {
		singular : loc("month"),
		plural : loc("months"),
		seconds : 2592000
	}, {
		singular : loc("day"),
		plural : loc("days"),
		seconds : 86400
	}, {
		singular : loc("hour"),
		plural : loc("hours"),
		seconds : 3600
	}, {
		singular : loc("min"),
		plural : loc("minutes"),
		seconds : 60
	}]
}

function duration(d) {
	var a = _timeUnits();
	for (var b = 0; b < a.length; ++b) {
		var c = a[b];
		if (d > c.seconds) {
			return plural(Math.round(d / c.seconds), c.singular, c.plural)
		}
	}
	return plural(Math.round(d), loc("second"), loc("seconds"))
}

function ts2age(a) {
	if (!a) {
		return 0
	}
	return new Date().getTime() / 1000 - a
}

function zSort(d, c) {
	return d.z - c.z
}

function mapRange(k, j, g) {
	var d = j.length;
	for (var c = 0; c < d; ++c) {
		var b = j[c];
		var a = j[c + 1];
		if (k >= b && k <= a) {
			var h = g[c];
			var f = g[c + 1];
			return (k - b) * (f - h) / (a - b) + h
		}
	}
	return
}

function range(c, a, f) {
	if (f > a) {
		return []
	}
	var d = [];
	for (var b = a; b <= f && b < c.length; b++) {
		d.push(c[b])
	}
	return d
}

function andWords(b) {
	var a = b[b.length - 1];
	var c = range(b, 0, b.length - 2).join(", ");
	return c ? (c + " " + loc("and") + " " + a) : a
}

function orWords(b) {
	var a = b[b.length - 1];
	var c = range(b, 0, b.length - 2).join(", ");
	return c ? (c + " " + loc("or") + " " + a) : a
}

function makeStatic(b) {
	for (var a in b) {
		func = b[a];
		if ( typeof (func) == "function") {
			b[a] = Event.wrapper(func, b)
		}
	}
}

function consensusOrMediod(f, c) {
	var d = {};
	var a = null;
	var b = 1;
	c.forEach(function(g) {
		var h = Math.round(g / f) * f;
		if (d[h]) {
			d[h]++;
			if (d[h] > b) {
				b = d[h];
				a = g
			}
		} else {
			d[h] = 1
		}
	});
	if (b > 1) {
		return a
	}
	c = c.sort().uniq();
	return c[Math.round(c.length / 2)]
}

function stack() {
	var a;
	try {
		window()
	} catch(b) {
		a = b.stack
	}
	if (a) {
		a = a.split("\n");
		a.pop();
		return a.join("\n")
	}
	return ""
}

function checkMainImg(b) {
	if (!document.querySelector) {
		return
	}
	var a = document.querySelector(b);
	if (!a) {
		return
	}
	var c = a.src || a.xsrc;
	if (!c) {
		return
	}
	getNaturalWidthHeight(c, function(d, f) {
		if (d > 1 && f > 1) {
			return
		}
		Beacon.log("1x1", {
			url : c
		})
	})
}

function future(h) {
	if (h <= 0) {
		return loc("right away")
	}
	var a = _timeUnits();
	for (var c = 0; c < a.length; c++) {
		var f = a[c];
		if (h >= f.seconds) {
			var g = Math.round(h / f.seconds);
			if (g === 1 && f.singular === loc("day")) {
				return loc("tomorrow")
			}
			return loc("in {duration}", {
				duration : plural(g, f.singular, f.plural)
			})
		}
	}
	var b = plural(h, loc("second"), loc("seconds"));
	return loc("in {duration}", {
		duration : b
	})
}

function handleScrollPositionPassbacks(b) {
	Event.addListener(document, "domready", function() {
		var f = function(g) {
			this.href = this.href + "#scroll_position=" + scrollXY().y
		};
		var c = getElementsByClassName({
			className : "pass_scroll_position",
			root : $(b)
		});
		for (var d = 0; d < c.length; d++) {
			Event.addListener(c[d], "click", f, c[d])
		}
	});
	var a = getHashValue("scroll_position") || 0;
	if (a) {
		window.scroll(0, a)
	}
}

function getHashValue(a) {
	var b = window.location.hash.match(new RegExp(a + "=([^&]*)"));
	if (b && b.length > 1) {
		return b[1]
	}
	return null
}

function formatPrice(d, a, f) {
	a = a || "$";
	f = f || ",";
	d = parseFloat(d).toString();
	if (d && d > 0) {
		var c = d.indexOf(".");
		if (c >= 0) {
			d = parseFloat(d).toFixed(2)
		} else {
			if (c < 0) {
				c = d.length
			}
		}
		var b = c % 3;
		while (b < c) {
			if (b) {
				d = d.substring(0, b) + f + d.substring(b);
				b += 1
			}
			b += 3
		}
		return a + d
	}
}

var BrowserDetect = {
	init : function() {
		this.browserInfo = this.searchInfo(this.dataBrowser) || null;
		this.browser = this.browserInfo ? this.browserInfo.identity : "An unknown browser";
		this.version = document.documentMode || this.searchVersion(navigator.userAgent, this.browserInfo) || this.searchVersion(navigator.appVersion, this.browserInfo) || "an unknown version";
		this.OSInfo = this.searchInfo(this.dataOS) || null;
		this.OS = this.OSInfo ? this.OSInfo.identity : "an unknown OS";
		this.layoutEngineInfo = this.searchInfo(this.dataLayoutEngine) || null;
		this.layoutEngine = this.layoutEngineInfo ? this.layoutEngineInfo.identity : "an unknown layout engine";
		this.layoutEngineVersion = this.searchVersion(navigator.userAgent, this.layoutEngineInfo) || this.searchVersion(navigator.appVersion) || "an unknown layout engine version"
	},
	searchInfo : function(d) {
		for (var a = 0; a < d.length; a++) {
			var b = d[a].string;
			var c = d[a].prop;
			if (b) {
				if (b.indexOf(d[a].subString) != -1) {
					return d[a]
				}
			} else {
				if (c) {
					return d[a]
				}
			}
		}
		return false
	},
	searchVersion : function(d, c) {
		var a = c ? c.versionSearch || c.identity : "";
		var b = d.indexOf(a);
		if (b == -1) {
			return false
		}
		return parseFloat(d.substring(b + a.length + 1))
	},
	dataBrowser : [{
		string : navigator.userAgent,
		subString : "Polyvore",
		identity : "Polyvore"
	}, {
		string : navigator.userAgent,
		subString : "MSIE",
		identity : "IE",
		versionSearch : "MSIE",
		upgradeURL : "http://www.microsoft.com/windows/Internet-explorer/default.aspx"
	}, {
		string : navigator.userAgent,
		subString : "Trident",
		identity : "IE",
		versionSearch : "rv",
		upgradeURL : "http://www.microsoft.com/windows/Internet-explorer/default.aspx"
	}, {
		string : navigator.userAgent,
		subString : "Firefox",
		identity : "Firefox",
		upgradeURL : "http://www.getfirefox.com"
	}, {
		string : navigator.vendor,
		subString : "Apple",
		identity : "Safari",
		upgradeURL : "http://www.apple.com/safari/download/"
	}, {
		string : navigator.userAgent,
		subString : "Chrome",
		identity : "Chrome",
		upgradeURL : "http://www.google.com/chrome"
	}, {
		prop : window.opera,
		identity : "Opera"
	}, {
		string : navigator.userAgent,
		subString : "Netscape",
		identity : "Netscape"
	}, {
		string : navigator.userAgent,
		subString : "Gecko",
		identity : "Mozilla",
		versionSearch : "rv"
	}, {
		string : navigator.userAgent,
		subString : "Mozilla",
		identity : "Netscape",
		versionSearch : "Mozilla"
	}, {
		string : navigator.vendor,
		subString : "Camino",
		identity : "Camino"
	}, {
		string : navigator.userAgent,
		subString : "OmniWeb",
		versionSearch : "OmniWeb/",
		identity : "OmniWeb"
	}, {
		string : navigator.vendor,
		subString : "iCab",
		identity : "iCab"
	}, {
		string : navigator.vendor,
		subString : "KDE",
		identity : "Konqueror"
	}],
	dataOS : [{
		string : navigator.platform,
		subString : "Win",
		identity : "Windows"
	}, {
		string : navigator.platform,
		subString : "iPad",
		identity : "iPad"
	}, {
		string : navigator.platform,
		subString : "Mac",
		identity : "Mac"
	}, {
		string : navigator.platform,
		subString : "Linux",
		identity : "Linux"
	}, {
		string : navigator.platform,
		subString : "iPhone",
		identity : "iPhone"
	}, {
		string : navigator.platform,
		subString : "iPod",
		identity : "iPod"
	}],
	dataLayoutEngine : [{
		string : navigator.userAgent,
		subString : "AppleWebKit",
		identity : "WebKit"
	}, {
		string : navigator.userAgent,
		subString : "Gecko",
		identity : "Gecko",
		versionSearch : "rv"
	}, {
		string : navigator.userAgent,
		subString : "Presto",
		identity : "Presto"
	}]
};
BrowserDetect.init();
var Browser = function() {
	var d = false;
	if (BrowserDetect.OS === "Linux") {
		var c = BrowserDetect.browserInfo.string;
		var b = c.match(/Android ([\d]+)[.\d]*;/) || [];
		var a = parseInt(b[1], 10);
		if (b.length && a >= 4) {
			d = true
		}
	}
	return {
		isIE : "IE" == BrowserDetect.browser,
		isSafari : "Safari" == BrowserDetect.browser,
		isChrome : "Chrome" == BrowserDetect.browser,
		isOpera : "Opera" == BrowserDetect.browser,
		isMac : "Mac" == BrowserDetect.OS,
		isIPad : "iPad" == BrowserDetect.OS,
		isIPhone : "iPhone" == BrowserDetect.OS,
		isIPod : "iPod" == BrowserDetect.OS,
		isIPhoneOrIPod : "iPhone" == BrowserDetect.OS || "iPod" == BrowserDetect.OS,
		isAndroid4 : d,
		isWindows : "Windows" == BrowserDetect.OS,
		isFirefox : "Firefox" == BrowserDetect.browser,
		isMozilla : "Mozilla" == BrowserDetect.browser,
		isPolyvoreNativeApp : "Polyvore" == BrowserDetect.browser,
		type : function(g, f, h) {
			return g == BrowserDetect.browser && (!f || f <= BrowserDetect.version) && (!h || h >= BrowserDetect.version)
		},
		layoutEngine : function(g, f, h) {
			return g == BrowserDetect.layoutEngine && (!f || f <= BrowserDetect.layoutEngineVersion) && (!h || h >= BrowserDetect.layoutEngineVersion)
		}
	}
}();
function Set() {
	this.items = {};
	this._size = 0
}
Set.prototype.size = function() {
	return this._size
};
Set.prototype.forEach = function(b, a) {
	this.values().forEach(b, a)
};
Set.prototype.ncp = function(a) {
	if (this.contains(a)) {
		return false
	}
	this.put(a);
	return true
};
Set.prototype.contains = function(b) {
	var a = getHashKey(b);
	if (this.items[":" + a]) {
		return true
	} else {
		return false
	}
};
Set.prototype.get = function(a) {
	if (this.contains(a)) {
		return this.items[":" + getHashKey(a)]
	} else {
		return null
	}
};
Set.prototype.put = function(b) {
	var a = getHashKey(b);
	if (!this.items[":" + a]) {
		this.items[":" + a] = b;
		delete this._values;
		this._size++
	}
};
Set.prototype.remove = function(b) {
	var a = getHashKey(b);
	if (this.items[":" + a]) {
		delete this.items[":" + a];
		delete this._values;
		this._size--;
		return true
	}
	return false
};
Set.prototype.clear = function() {
	this.items = {};
	delete this._values;
	this._size = 0
};
Set.prototype.values = function() {
	if (this._values) {
		return this._values
	}
	var a = [];
	for (var b in this.items) {
		if (this.items.hasOwnProperty(b)) {
			a.push(this.items[b])
		}
	}
	return (this._values = a)
};
var getUID;
(function() {
	var a = 1;
	getUID = function(d) {
		var c = typeof (d);
		var b;
		if (c == "object" || c == "function") {
			b = d._uid;
			if (!b) {
				b = a++;
				try {
					d._uid = b
				} catch(f) {
				}
			}
		} else {
			b = d
		}
		return b
	}
})();
function getHashKey(b) {
	switch(typeof(b)) {
		case"number":
		case"string":
			return b;
		case"boolean":
			return b ? 1 : 0;
		case"object":
			if (!b) {
				return b
			}
			var a;
			if (b.getHashKey && typeof (b.getHashKey) == "function") {
				return b.getHashKey()
			} else {
				a = getUID(b)
			}
			return a;
		default:
			return b
	}
}

function compare(f, d) {
	var c = typeof (f);
	var g = typeof (d);
	if (c != g) {
		return false
	}
	switch(c) {
		case"number":
		case"string":
		case"boolean":
			return f === d;
		default:
			return getHashKey(f) === getHashKey(d)
	}
}

function Hash() {
	this.items = {}
}
Hash._key = function(a) {
	return ":" + getHashKey(a)
};
Hash.prototype.merge = function(b) {
	for (var a in b) {
		if (Object.prototype.hasOwnProperty.call(b, a)) {
			this.put(a, b[a])
		}
	}
};
Hash.prototype.put = function(a, b) {
	var c;
	if (this.contains(a)) {
		c = this.get(a)
	}
	this.items[Hash._key(a)] = b;
	return c
};
Hash.prototype.get = function(a) {
	return this.items[Hash._key(a)]
};
Hash.prototype.remove = function(a) {
	a = Hash._key(a);
	if (this.items[a]) {
		delete this.items[a]
	}
};
Hash.prototype.clear = function() {
	this.items = {}
};
Hash.prototype.contains = function(a) {
	return this.items.hasOwnProperty([Hash._key(a)])
};
function Interval(a, c, b) {
	this.timerId = 0;
	this.interval = a;
	this.f = Event.wrapper(function() {
		try {
			c.apply(b)
		} catch(d) {
			console.log(d)
		}
		if (this.timerId !== undefined) {
			this.reschedule()
		}
	}, this);
	this.reschedule()
}
Interval.prototype.clear = function() {
	if (this.timerId) {
		window.clearTimeout(this.timerId);
		delete this.timerId
	}
};
Interval.prototype.reschedule = function(a) {
	this.clear();
	this.interval = a || this.interval;
	this.timerId = window.setTimeout(this.f, this.interval)
};
function Cleaner() {
	var a = [];
	return {
		push : function(b) {
			if (b) {
				a.push(b)
			}
		},
		clean : function() {
			a.forEach(function(b) {
				if (b.clean && typeof (b.clean) == "function") {
					b.clean()
				} else {
					if ( typeof (b) == "function") {
						b.call()
					}
				}
			});
			a = []
		}
	}
}

function EventMap() {
	this.events = {}
}
EventMap.prototype.getOrInitEventObjects = function(c, a) {
	var b = getUID(c);
	if (c && c.getAttribute && !c.getAttribute("_uid")) {
		c.setAttribute("_uid", b)
	}
	if (!this.events[b]) {
		this.events[b] = {}
	}
	if (!this.events[b][a]) {
		this.events[b][a] = {}
	}
	if (!this.events[b][a].listeners) {
		this.events[b][a].listeners = []
	}
	return this.events[b][a]
};
EventMap.prototype.getListenedEvent = function(c, a) {
	var b = getUID(c);
	return this.events[b] && this.events[b][a]
};
EventMap.prototype.getPVListeners = function(c, a) {
	var b = getUID(c);
	return this.getListenedEvent(c, a) && this.events[b][a].listeners
};
EventMap.prototype.release = function(b) {
	var a = getUID(b);
	return this.releaseId(a, b)
};
EventMap.prototype.releaseAll = function(a) {
	if (!document.querySelectorAll) {
		console.log("ReleaseAll not supported by this browser");
		return
	}
	var b = document.querySelectorAll("[_uid]");
	b = nodeListToArray(b);
	b.push(window);
	b.push(document);
	b.forEach(function(d) {
		var c = d._uid;
		if (c) {
			this.releaseId(c, d);
			if (a) {
				a(c, d)
			}
		}
	}, this);
	this.getSourceIDs().forEach(function(c) {
		this.releaseId(c)
	}, this)
};
EventMap.prototype.releaseId = function(f, d) {
	if (!this.events[f]) {
		return
	}
	for (var c in this.events[f]) {
		if (!this.events[f].hasOwnProperty(c)) {
			continue
		}
		var g = this.events[f][c].scrollBottomDetector;
		if (g) {
			g.clear()
		}
		var b = this.events[f][c].listeners;
		if (b.constructor != Array) {
			continue
		}
		if (d) {
			for (var a = 0; a < b.length; ++a) {
				if (Event.isBuiltIn(d, c)) {
					Event.removeDomListener(d, c, b[a])
				}
			}
		}
		delete this.events[f][c]
	}
	delete this.events[f]
};
EventMap.prototype.getSourceIDs = function() {
	var a = [];
	forEachKey(this.events, function(b) {
		a.push(b)
	});
	return a
};
function Listener(c, b, a) {
	this.src = c;
	this.event = b;
	this.handler = a
}
Listener.prototype.clean = function() {
	var a = this.event;
	var b = this.src;
	if (this.src && this.event) {
		Event.removeListener(b, a, this.handler)
	}
	this.src = this.event = this.handler = null
};
var Event = function() {
	var WRAPPERS = {};
	var BUILTINS = {
		filterchange : true,
		abort : true,
		blur : true,
		change : true,
		click : true,
		contextmenu : true,
		dblclick : true,
		error : true,
		focus : true,
		keydown : true,
		keypress : true,
		transitionend : true,
		webkitTransitionEnd : true,
		webkitAnimationEnd : true,
		keyup : true,
		load : true,
		message : true,
		mousedown : true,
		mousemove : true,
		mouseover : true,
		mouseout : true,
		mouseup : true,
		reset : true,
		resize : true,
		scroll : true,
		select : true,
		selectstart : true,
		submit : true,
		unload : true,
		beforeunload : true,
		copy : true,
		DOMMouseScroll : true,
		mousewheel : true,
		DOMContentLoaded : true,
		touchstart : true,
		touchmove : true,
		touchend : true,
		touchcancel : true,
		pageshow : true,
		pagehide : true,
		popstate : true,
		orientationchange : true,
		paste : true,
		input : true
	};
	var eventMap = new EventMap();
	var bubbleMap = {};
	var messageListener;
	var lastMsgTimeStamp = 0;
	var startHistoryLength = window.history.length - 1;
	var baseTime = new Date().getTime();
	var fireOnceHash = new Hash();
	return {
		getPageXY : function(event, tmp) {
			var x = event.pageX;
			tmp = tmp ? tmp : new Point(0, 0);
			if (!x && 0 !== x) {
				x = event.clientX || 0
			}
			var y = event.pageY;
			if (!y && 0 !== y) {
				y = event.clientY || 0
			}
			if (Browser.isIE) {
				var scroll = scrollXY();
				tmp.x = x + scroll.x;
				tmp.y = y + scroll.y
			} else {
				tmp.x = x;
				tmp.y = y
			}
			return tmp
		},
		getChar : function(event) {
			if (!event) {
				return ""
			}
			return String.fromCharCode(event.charCode || event.keyCode)
		},
		addDomListener : function(source, event, wrapper) {
			if (event == "dblclick" && Browser.isSafari) {
				source.ondblclick = wrapper
			} else {
				if (source.addEventListener) {
					source.addEventListener(event, wrapper, false)
				} else {
					if (source.attachEvent) {
						source.attachEvent("on" + event, wrapper)
					} else {
						source["on" + event] = wrapper
					}
				}
			}
		},
		removeDomListener : function(source, event, wrapper) {
			if (source.removeEventListener) {
				source.removeEventListener(event, wrapper, false)
			} else {
				if (source.detachEvent) {
					source.detachEvent("on" + event, wrapper)
				} else {
					source["on" + event] = null
				}
			}
		},
		postMessage : function(tgt, base, event, message) {
			if (!tgt) {
				tgt = window.parent
			}
			if (!tgt) {
				return
			}
			try {
				if (tgt.contentWindow) {
					tgt = tgt.contentWindow
				}
			} catch(el) {
			}
			tgt.postMessage(JSON2.stringify({
				event : event,
				message : message
			}), base)
		},
		addListener : function(source, event, listener, object) {
			if (!source || !event) {
				var jslint = window._Debug && window._Debug.logStackTrace();
				console.log("ERROR: addListener called on invalid source or event:", source, event);
				return
			}
			if (Browser.layoutEngine("WebKit") && event == "transitionend") {
				event = "webkitTransitionEnd"
			}
			var wrapper;
			var fireOnce = Event.FIREONCE.get(source, event);
			if (fireOnce !== undefined) {
				if (fireOnce) {
					window.setTimeout(function() {
						listener.apply(object)
					});
					return null
				} else {
					wrapper = function() {
						Event.removeListener(source, event, wrapper);
						listener.apply(object)
					}
				}
			}
			if (event == "scrollbottom") {
				var eventObject = eventMap.getOrInitEventObjects(source, event);
				if (!eventObject.scrollBottomDetector) {
					eventObject.scrollBottomDetector = new ScrollBottomDetector(source)
				}
				if (!eventObject.scrollBottomDetector.isAttached()) {
					eventObject.scrollBottomDetector.attach(source)
				}
				if (eventObject.scrollBottomDetector.isAtBottom()) {
					yield(listener, object)
				}
			} else {
				if (event == "mousewheel" && Browser.isFirefox) {
					event = "DOMMouseScroll"
				}
			}
			if (source.tagName == "INPUT" && source.type) {
				var inputType = source.type.toUpperCase();
				if ((inputType == "CHECKBOX" || inputType == "RADIO") && event == "change" && Browser.isIE) {
					event = "click";
					wrapper = function() {
						window.setTimeout(function() {
							listener.apply(object)
						}, 0)
					}
				}
			}
			if (!wrapper) {
				wrapper = Event.wrapper(listener, object)
			}
			if (/mousepause([0-9]*)$/.test(event)) {
				var timer = new Timer();
				var delay = Number(RegExp.$1);
				if (isNaN(delay) || (!delay && delay !== 0)) {
					delay = 500
				}
				Event.addListener(source, "mousemove", function(e) {
					timer.replace(wrapper, delay)
				});
				Event.addListener(source, "mouseout", timer.reset, timer)
			}
			switch(event) {
				case"dragstart":
					Event.addListener(source, "mousedown", DragDrop.onMouseDown, DragDrop);
					Event.addDomListener(source, "dragstart", Event.stop);
					break;
				case"drop":
					DragDrop.addDropListener(source);
					break;
				default:
					if (source == Event.XFRAME) {
						if (!messageListener) {
							messageListener = Event.addListener(window, "message", function(event) {
								try {
									var data = eval("(" + event.data + ")");
									if (data.event) {
										Event.trigger(Event.XFRAME, data.event, data.message)
									}
								} catch(e) {
								}
							})
						}
					} else {
						if (source == Event.BACKEND) {
							if (!Event.BACKEND.listening) {
								Event.addListener(Cookie, "change", Event.checkForBackendEvent);
								Event.BACKEND.listening = true
							}
						} else {
							if (Event.isBuiltIn(source, event)) {
								Event.addDomListener(source, event, wrapper)
							}
						}
					}
			}
			var listeners = eventMap.getOrInitEventObjects(source, event).listeners;
			listeners.push(wrapper);
			return new Listener(source, event, wrapper)
		},
		addSingleUseListener : function(source, event, listener, object) {
			var listenerRemover = function() {
				var tmp = listener;
				listener = null;
				Event.removeListener(source, event, listenerRemover);
				if (tmp) {
					tmp.apply(this, arguments)
				}
			};
			return Event.addListener(source, event, listenerRemover, object)
		},
		removeListener : window._Debug ? function(source, event, method, object) {
			var cacheKey = getUID(method) + ":" + getUID(object);
			var wrappers = WRAPPERS[cacheKey] || [];
			wrappers.forEach(function(wrapper) {
				Event._removeListener(source, event, wrapper)
			})
		} : function(source, event, method, object) {
			var wrapper = Event.wrapper(method, object);
			Event._removeListener(source, event, wrapper)
		},
		_removeListener : function(source, event, wrapper) {
			if (event == "drop") {
				DragDrop.removeDropListener(source)
			} else {
				if (source == Event.XFRAME) {
				} else {
					if (Event.isBuiltIn(source, event)) {
						Event.removeDomListener(source, event, wrapper)
					}
				}
			}
			var listeners = eventMap.getPVListeners(source, event) || [];
			for (var i = 0; i < listeners.length; ++i) {
				if (listeners[i] == wrapper) {
					listeners.splice(i, 1);
					return
				}
			}
		},
		addCustomBubble : function(child, parent) {
			if (child == parent) {
				console.log("parent is the same as child");
				return
			}
			var childId = getUID(child);
			if (!bubbleMap[childId]) {
				bubbleMap[childId] = []
			}
			bubbleMap[childId].push(parent)
		},
		bubble : function() {
			var source = arguments[0];
			var event = arguments[1];
			var evt = arguments[2] || {};
			while (source) {
				var listeners;
				if (( listeners = eventMap.getPVListeners(source, event)) && listeners.length) {
					arguments[0] = source;
					Event.trigger.apply(Event, arguments);
					if (evt.cancelBubble) {
						break
					}
				}
				source = source.parentNode
			}
		},
		trigger : function() {
			var source = arguments[0];
			var event = arguments[1];
			var i;
			var listenedEvent = eventMap.getListenedEvent(source, event);
			if (listenedEvent) {
				var fireOnce = Event.FIREONCE.get(source, event);
				if (fireOnce !== undefined) {
					if (fireOnce) {
						return
					}
				}
				var args = Array.prototype.slice.apply(arguments, [2]);
				if (listenedEvent.shouldBundle) {
					listenedEvent.triggered = args;
					return
				}
				var listeners = listenedEvent.listeners.slice(0);
				var listener;
				var errs = [];
				if (Conf.isStaging()) {
					for ( i = 0; i < listeners.length; ++i) {
						listener = listeners[i];
						listener.apply(listener, args)
					}
				} else {
					for ( i = 0; i < listeners.length; ++i) {
						listener = listeners[i];
						try {
							listener.apply(listener, args)
						} catch(e) {
							errs.push(e)
						}
					}
				}
				if (errs.length) {
					console.error("Handlers for event ", event, " had errors: ", errs);
					throw errs[0]
				}
			} else {
			}
			var sourceId = getUID(source);
			if (bubbleMap[sourceId]) {
				var parents = bubbleMap[sourceId];
				for ( i = 0; i < parents.length; i++) {
					arguments[0] = parents[i];
					Event.trigger.apply(Event, arguments)
				}
			}
		},
		release : function(source) {
			eventMap.release(source);
			var sourceId = getUID(source);
			if (bubbleMap[sourceId]) {
				delete bubbleMap[sourceId]
			}
			if (window.DragDrop !== undefined) {
				DragDrop.removeDropListener(source)
			}
		},
		releaseAll : function() {
			eventMap.releaseAll(function(sourceId) {
				if (bubbleMap[sourceId]) {
					delete bubbleMap[sourceId]
				}
			});
			if (window.DragDrop !== undefined) {
				DragDrop.removeDropListener(source)
			}
		},
		rateLimit : function(method, delay) {
			if (!delay) {
				return method
			} else {
				var timer = new Timer();
				var timerIsSet = true;
				var hadCall = null;
				timer.replace(function() {
					if (hadCall) {
						method.apply(null, hadCall);
						timerIsSet = true;
						hadCall = null;
						timer.reschedule(delay)
					} else {
						hadCall = null;
						timerIsSet = false
					}
				}, delay);
				return function() {
					if (timerIsSet) {
						hadCall = arguments;
						return
					}
					method.apply(null, arguments);
					timerIsSet = true;
					timer.reschedule(delay)
				}
			}
		},
		wrapper : function(method, object) {
			if (!method) {
				var jslint = window._Debug && window._Debug.logStackTrace();
				console.log("Wrapper called with method = ", method);
				return noop
			}
			if (!method.apply) {
				var jslint2 = window._Debug && window._Debug.logStackTrace();
				var origFunc = method;
				method = function() {
					window.__func = origFunc;
					window.__obj = object;
					window.__args = arguments;
					var args = [];
					for (var i = 0; i < arguments.length; ++i) {
						args.push("__args[" + i + "]")
					}
					var rval = eval("(__obj || window).__func(" + args.join(",") + ")");
					delete window.__args;
					delete window.__obj;
					delete window.__func;
					return rval
				}
			}
			var cacheKey = getUID(method) + ":" + getUID(object);
			if (window._Debug && (Browser.isFirefox || Browser.isChrome)) {
				var stack = _Debug.getStackTrace();
				var func = function() {
					try {
						return method.apply(object, arguments)
					} catch(e) {
						console.error(e, {
							exception : e,
							method : method,
							object : object,
							wrappedBy : stack,
							stack : e.stack.split(/\n/)
						})
					}
				};
				WRAPPERS[cacheKey] = WRAPPERS[cacheKey] || [];
				WRAPPERS[cacheKey].push(func);
				return func
			} else {
				if (!object) {
					return method
				}
				return (WRAPPERS[cacheKey] = WRAPPERS[cacheKey] ||
				function() {
					return method.apply(object, arguments)
				})

			}
		},
		isBuiltIn : function(src, name) {
			if ((src.childNodes || src == window) && BUILTINS[name]) {
				return true
			} else {
				return false
			}
		},
		getSource : function(e) {
			return e.target || e.srcElement
		},
		getWheelDelta : function(e) {
			e = e || window.event;
			if (!e) {
				return 0
			} else {
				if (Browser.isIE) {
					try {
						return -e.wheelDelta / 120
					} catch(err) {
						return 0
					}
				} else {
					if (Browser.isFirefox) {
						return e.detail
					} else {
						if (Browser.isSafari || Browser.isChrome) {
							return -e.wheelDelta / 3
						} else {
							return 0
						}
					}
				}
			}
		},
		getRelatedTarget : function(e) {
			return e.relatedTarget || e.toElement || e.fromElement
		},
		stopBubble : function(event) {
			event.cancelBubble = true;
			if (event.stopPropagation) {
				event.stopPropagation()
			}
		},
		stopDefault : function(event) {
			if (event.preventDefault) {
				event.preventDefault()
			} else {
				event.returnValue = false
			}
			return false
		},
		defaultPrevented : function(e) {
			return (e.defaultPrevented || e.returnValue === false || !!(e.getPreventDefault && e.getPreventDefault()))
		},
		stop : function(event) {
			if (event.type == "mousedown" || event.type == "click") {
				if (window.Track !== undefined) {
					Track.trackDomNode("click", Event.getSource(event))
				}
			}
			Event.stopBubble(event);
			return Event.stopDefault(event)
		},
		checkForBackendEvent : function() {
			var events = Cookie.get("e", true);
			if (!events || !events.uuid) {
				Event.trigger(Event, "backend_events_triggered");
				return
			}
			var now = new Date().getTime();
			if (!events._lts) {
				events._lts = now;
				Cookie.set("e", events)
			}
			if (baseTime - events._lts > 20000) {
				Cookie.clear("e");
				Event.trigger(Event, "backend_events_triggered");
				return
			}
			Event.triggerBackendEvents(events.list, events.uuid)
		},
		triggerBackendEvents : function(list, uuid) {
			Event.addListener(document, "modifiable", function() {
				yield(function() {
					var seen = WindowSession.get("events") || {};
					if (!seen[uuid]) {
						seen[uuid] = new Date().getTime();
						forEachKey(seen, function(k) {
							if (baseTime - seen[k] > 30000) {
								delete seen[k]
							}
						});
						WindowSession.set("events", seen);
						(list || []).forEach(function(event) {
							event.unshift(Event.BACKEND);
							Event.trigger.apply(Event, event)
						})
					}
					Event.trigger(Event, "backend_events_triggered")
				})
			})
		},
		bundleEvents : function(source, event) {
			var listenedEvent = eventMap.getOrInitEventObjects(source, event);
			if (listenedEvent) {
				delete listenedEvent.triggered;
				listenedEvent.shouldBundle = (listenedEvent.shouldBundle || 0) + 1
			}
		},
		unbundleEvents : function(source, event, noTrigger) {
			var listenedEvent = eventMap.getListenedEvent(source, event);
			if (!listenedEvent) {
				return
			}
			listenedEvent.shouldBundle = (listenedEvent.shouldBundle || 0) - 1;
			if (listenedEvent.shouldBundle > 0) {
				return
			}
			var lastTriggeredWithArgs = listenedEvent.triggered;
			delete listenedEvent.triggered;
			if (lastTriggeredWithArgs === undefined) {
				return
			}
			if (noTrigger) {
				return
			}
			var args = [source, event];
			args = args.concat(lastTriggeredWithArgs || []);
			Event.trigger.apply(Event, args)
		},
		pauseEvents : function(source, event) {
			Event.bundleEvents(source, event)
		},
		unpauseEvents : function(source, event) {
			Event.unbundleEvents(source, event, true)
		},
		XFRAME : {},
		BACKEND : {},
		FIREONCE : {
			get : function(src, event) {
				var obj = fireOnceHash.get(src);
				if (!obj) {
					return undefined
				}
				return obj[event]
			},
			declare : function(src, event) {
				var declaredEvents = fireOnceHash.get(src);
				if (!declaredEvents) {
					declaredEvents = {};
					fireOnceHash.put(src, declaredEvents)
				}
				if (declaredEvents[event] === undefined) {
					declaredEvents[event] = false;
					var listener = Event.addListener(src, event, function() {
						listener.clean();
						declaredEvents[event] = true
					})
				}
			},
			reset : function(src, event) {
				var declaredEvents = fireOnceHash.get(src);
				if (!declaredEvents) {
					console.log("WARNING: resetting an undeclared fireonce event");
					return
				}
				declaredEvents[event] = false;
				var listener = Event.addListener(src, event, function() {
					listener.clean();
					declaredEvents[event] = true
				})
			}
		}
	}
}();
Event.FIREONCE.declare(window, "load");
Event.FIREONCE.declare(document, "domready");
Event.FIREONCE.declare(document, "modifiable");
Event.FIREONCE.declare(document, "available");
Event.FIREONCE.declare(Event, "backend_events_triggered");
if (!Browser.isIE) {
	Event._domModOnAvail = Event.addListener(document, "available", function(a) {
		Event.trigger(document, "modifiable", a);
		if (Event._domModOnAvail) {
			Event._domModOnAvail.clean();
			delete Event._domModOnAvail
		}
	})
}
Event._domModOnReady = Event.addListener(document, "domready", function(b) {
	var a = function() {
		Event.trigger(document, "modifiable", b);
		if (Event._domModOnReady) {
			Event._domModOnReady.clean();
			delete Event._domModOnReady
		}
	};
	if (Browser.isIE && (document.getElementsByTagName("embed") || []).length) {
		window.setTimeout(a, 1000)
	} else {
		a()
	}
});
Event.addListener(window, "load", function() {
	if (!Event.FIREONCE.get(document, "domready")) {
		if (Browser.isSafari) {
			if (Event._safariTimer) {
				Event._safariTimer.clear();
				Event._safariTimer = null
			}
		}
		Event.trigger(document, "domready")
	}
	document.write = function(a) {
		(document.write._buffer = document.write._buffer || []).push(a)
	};
	document.writeln = function(a) {
		(document.write._buffer = document.write._buffer || []).push(a + "\n")
	}
});
if (Browser.isIE) {
	if (document.location.protocol != "https:") {
		document.write('<script id="__ie_onload" defer src="javascript:void(0)"><\/script>');
		try {
			document.getElementById("__ie_onload").onreadystatechange = function() {
				if (this.readyState == "complete") {
					Event.trigger(document, "domready")
				}
			}
		} catch(ignore) {
		}
	}
} else {
	if (Browser.isSafari) {
		Event._safariTimer = new Interval(10, function() {
			if (/loaded|complete/.test(document.readyState)) {
				if (Event._safariTimer) {
					Event._safariTimer.clear();
					Event._safariTimer = null
				}
				Event.trigger(document, "domready")
			}
		})
	} else {
		if (Browser.isFirefox || Browser.isMozilla || Browser.isOpera) {
			Event.addListener(document, "DOMContentLoaded", function() {
				Event.trigger(document, "domready")
			})
		} else {
		}
	}
}
Event.addListener(window, "beforeunload", function() {
	if (Event.BACKEND.listening) {
		Event.removeListener(Cookie, "change", Event.checkForBackendEvent);
		Event.BACKEND.listening = false
	}
});
function Monitor(b, a) {
	var c = b();
	if (!a) {
		a = 100
	}
	this.check = function() {
		var d = b();
		if (d != c) {
			c = d;
			Event.trigger(this, "change", c)
		}
		return d
	};
	this.timer = new Interval(a, this.check, this)
}
Monitor.prototype.stop = function() {
	this.timer.clear()
};
function ScrollBottomDetector(a) {
	this.checkInterval = a.checkInterval || 1000;
	if (a.node) {
		this.attach(a.node)
	}
	this.clear()
}
ScrollBottomDetector.prototype.clear = function() {
	this._container = null;
	if (this._interval) {
		this._interval.clear();
		this._interval = null
	}
};
ScrollBottomDetector.prototype.isAttached = function() {
	return this._container !== null
};
ScrollBottomDetector.prototype.isAtBottom = function() {
	var c;
	if (!this._container || !( c = Dim.fromNode(this._container))) {
		this.clear();
		return false
	} else {
		if (c.h === 0 && c.w === 0) {
			return false
		}
	}
	var a = getWindowSize().h;
	var b = scrollXY().y + a;
	var d;
	if (this._container == document.body) {
		d = nodeXY(this._container).y + this._container.parentNode.scrollHeight
	} else {
		d = nodeXY(this._container).y + Dim.fromNode(this._container).h
	}
	return Math.abs(d - b) < Math.max(100, 1.5 * a)
};
ScrollBottomDetector.prototype.attach = function(a) {
	this._container = a;
	if (!this._interval) {
		this._interval = new Interval(this.checkInterval, function() {
			if (this.isAtBottom()) {
				Event.trigger(this._container, "scrollbottom")
			}
		}, this)
	}
	yield(function() {
		if (this.isAtBottom()) {
			Event.trigger(this._container, "scrollbottom")
		}
	}, this)
};
var WindowSession = function() {
	function a(c) {
		try {
			return JSON2.parse(c)
		} catch(d) {
		}
		return null
	}

	var b = {};
	Event.addListener(document, "modifiable", function() {
		b = a(window.name);
		if (!b || !b._pvid) {
			b = {
				_pvid : Math.random()
			}
		}
	});
	return {
		id : function() {
			return b._pvid
		},
		set : function(c, d) {
			b[c] = d;
			window.name = JSON2.stringify(b)
		},
		get : function(c) {
			return b[c]
		},
		all : function() {
			return b
		}
	}
}();
function isRightClick(a) {
	if (a.which) {
		return (a.which == 3)
	} else {
		if (a.button !== undefined) {
			return (a.button == 2)
		}
	}
	return false
}

function DataTransfer() {
	this.data = {};
	this.proxy = null;
	this.usingProxy = true
}
DataTransfer.prototype.setData = function(b, a) {
	this.data[b] = a
};
DataTransfer.prototype.getData = function(a) {
	return this.data[a]
};
var DragDrop = function() {
	var v = new Cleaner();
	var b = new Set();
	var d = new Point(0, 0);
	var s = new Point(0, 0);
	var h;
	var r;
	var x;
	var f = "init";
	var g;
	var q = null;
	var p;
	var n = true;
	var m;
	var w;
	function l(y) {
		Event.getPageXY(y, s);
		switch(f) {
			case"dragging":
				p.style.top = (s.y - g.y) + "px";
				p.style.left = (s.x - g.x) + "px";
				break;
			case"maybe":
				if (!h) {
					break
				}
				var z = Event.getSource(y);
				var A = function() {
					o(y)
				};
				while (z) {
					if (z == h && d.distance(s) > 3) {
						if (Browser.isSafari) {
							yield(A)
						} else {
							A()
						}
						break
					} else {
						z = z.parentNode
					}
				}
				break
		}
		return true
	}

	function u(A, B) {
		if (A.keepNode) {
			B.push(A.domNode)
		}
		var z = A.children;
		if (z) {
			if (!z.sorted) {
				z.sort(zSort);
				z.sorted = true
			}
			for (var y = 0; y < z.length; ++y) {
				u(z[y], B)
			}
		}
	}

	function j(z) {
		var y;
		var B = {};
		z.forEach(function(F) {
			var C = null;
			var E = F;
			while (F && F.tagName != "HTML") {
				var D = getUID(F);
				var G = B[D];
				if (!G) {
					G = {
						domNode : F,
						z : Math.ceil(parseFloat(getStyle(F, "zIndex"))) || 0,
						children : null
					}
				}
				if (E == F) {
					G.keepNode = true
				}
				if (C) {
					G.children = G.children || [];
					G.children.push(C)
				}
				if (B[D]) {
					break
				} else {
					B[D] = G
				}
				C = G;
				F = F.parentNode
			}
			y = y || C
		});
		var A = [];
		u(y, A);
		return A
	}

	function o(z) {
		x = new DataTransfer();
		z.xDataTransfer = x;
		Event.bubble(h, "dragstart", z);
		if (Browser.isIE) {
			v.push(Event.addListener(document, "selectstart", returnFalse))
		}
		p = x.proxy;
		if (!p) {
			return k()
		}
		n = x.usingProxy;
		var A = overlayZIndex(q);
		if (n) {
			if (!q) {
				q = createNode("div", {
					className : "dragproxy unselectable"
				});
				document.body.appendChild(q)
			}
			setNode(q, null, {
				display : "block",
				left : "0px",
				top : "0px",
				zIndex : A
			}, p);
			makeUnselectable(q);
			g = Dim.fromNode(q);
			g.x = g.w / 2;
			g.y = g.h / 2;
			setNode(q, null, {
				visibility : "visible",
				top : px(s.y - g.y),
				left : px(s.x - g.x)
			});
			p = q
		} else {
			g = nodeXY(p);
			g.x = s.x - g.x;
			g.y = s.y - g.y;
			if (getStyle(p, "position") == "absolute") {
				g.x -= depx(getStyle(p, "marginLeft"));
				g.y -= depx(getStyle(p, "marginTop"))
			}
		}
		f = "dragging";
		m = ["dragging"];
		if (x.data) {
			forEachKey(x.data, function(C, B) {
				var D = "dragging_" + C;
				m.push(D);
				if (B.type) {
					m.push(D + "_" + B.type)
				}
			})
		}
		addClass(document.body, m.join(" "));
		var y = j(b.values());
		if (w) {
			setNode(w, null, {
				zIndex : A
			});
			show(w)
		} else {
			w = document.body.appendChild(createNode("div", {
				className : "proxylayer"
			}, {
				zIndex : A
			}))
		}
		y.forEach(function(D) {
			var G = Dim.fromNode(D);
			var F = nodeXY(D);
			var C = createNode("div", {
				className : "dropproxy"
			}, {
				top : px(F.y),
				left : px(F.x),
				width : px(G.w),
				height : px(G.h)
			});
			var E = C;
			var B;
			if (window.Matrix && ( B = Matrix.extract(D))) {
				E = B.apply(C, D._data) || E
			}
			w.appendChild(C);
			E.node = D;
			Event.addListener(C, "mouseover", t);
			Event.addListener(C, "mouseout", a)
		});
		v.push(function() {
			hide(w);
			clearNode(w)
		})
	}

	function t(y) {
		if (!r) {
			var z = Event.getSource(y);
			y.xDataTransfer = x;
			Event.trigger(z.node, "dragenter", y);
			if (!x.cancelDefault) {
				r = z.node
			}
		}
	}

	function a(y) {
		if (r) {
			var z = Event.getSource(y);
			y.xDataTransfer = x;
			Event.trigger(z.node, "dragleave", y);
			r = null
		}
	}

	function c(y) {
		if (f == "dragging") {
			y.xDataTransfer = x;
			if (r) {
				Event.bubble(r, "drop", y, r);
				if (y.cancelDefault) {
				}
			}
			Event.bubble(h, "dragend", y, r)
		}
		k()
	}

	function k() {
		if (n) {
			setNode(q, null, {
				display : "none"
			}, "")
		}
		if (m) {
			removeClass(document.body, m.join(" "));
			m = null
		}
		v.clean();
		d.x = d.y = s.x = s.y = 0;
		h = r = x = p = null;
		cleanupProxy = true;
		f = "init";
		Event.trigger(DragDrop, "dragend")
	}
	return {
		getData : function() {
			return x
		},
		proxy : function() {
			if (n) {
				return q
			}
			return null
		},
		onMouseDown : function(y) {
			DragDrop.beginDrag(Event.getSource(y), Event.getPageXY(y));
			if (Browser.isSafari) {
			} else {
				Event.trigger(document, "mymousedown", y);
				return Event.stop(y)
			}
		},
		beginDrag : function(z, y) {
			if (f != "init") {
				k()
			}
			f = "maybe";
			d.x = y.x;
			d.y = y.y;
			h = z;
			v.push(Event.addListener(document, "mousemove", l));
			v.push(Event.addListener(document, "mouseup", c));
			v.push(Event.addListener(h, "contextmenu", Event.stop))
		},
		addDropListener : function(y) {
			b.put(y)
		},
		removeDropListener : function(y) {
			b.remove(y)
		}
	}
}();
var Cookie = function() {
	var _cookie = null;
	var _domain = null;
	var _interval = null;
	var _user = {};
	var _canNotSetCookies = false;
	Event.addListener(document, "modifiable", function() {
		_interval = new Interval(1000, function() {
			if (!_cookie || _cookie != document.cookie) {
				_cookie = document.cookie;
				Event.trigger(this, "change")
			}
		}, Cookie);
		Cookie.set("__test", "foo");
		if (Cookie.get("__test")) {
			Cookie.set("__test")
		} else {
			_canNotSetCookies = true
		}
	});
	return {
		clear : function(name) {
			var date = new Date();
			date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
			var cookie = name + "=''; expires=" + date.toGMTString() + "; path=/; domain=.";
			_domain = _domain || Conf.getCookieDomain() || "";
			var parts = _domain.split(".");
			if (parts.length > 2) {
				parts.splice(0, parts.length - 2)
			}
			document.cookie = cookie + parts.join(".");
			return true
		},
		set : function(name, data, ttl, noEncode, path) {
			var value = "";
			if (data) {
				if (data.constructor == String) {
					value = noEncode ? data : encodeURIComponent(data)
				} else {
					value = encodeURIComponent(JSON2.stringify(data))
				}
			}
			var expires = "";
			if (value === "") {
				ttl = -1
			}
			if (ttl !== undefined) {
				var date = new Date();
				date.setTime(date.getTime() + (ttl * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toGMTString()
			}
			try {
				if (!_domain) {
					_domain = Conf.getCookieDomain()
				}
				if (value !== "") {
					var limit = 8192;
					if (Browser.isIE) {
						limit = 4096
					}
					var extra = 56 + _domain.length;
					var oldLength = 0;
					if (document.cookie) {
						var cookies = document.cookie.split(/;\s*/);
						oldLength = cookies.length * extra + document.cookie.length
					}
					var oldValue = Cookie.get(name, false);
					var oldValueLength = oldValue ? oldValue.length : 0;
					if ((oldLength + value.length - oldValueLength) > limit) {
						var error = "exceeds " + limit + " bytes limit for cookie";
						console.log(error);
						throw (error)
					}
				}
				if (!path) {
					path = "/"
				}
				document.cookie = name + "=" + value + expires + "; path=" + path + "; domain=" + _domain;
				return true
			} catch(e) {
				_canNotSetCookies = true;
				return false
			}
		},
		get : function(name, parse) {
			var cookies = document.cookie.split(/;\s*/);
			for (var i = 0; i < cookies.length; ++i) {
				var bits = cookies[i].split("=", 2);
				if (bits[0] == name) {
					if (parse) {
						try {
							return eval("(" + decodeURIComponent(bits[1]) + ")")
						} catch(e) {
						}
					} else {
						return decodeURIComponent(bits[1])
					}
				}
			}
			return null
		},
		canNotSetCookies : function() {
			return _canNotSetCookies
		}
	}
}();
function Timer() {
	this.timerID = null
}
Timer.prototype.reset = function() {
	if (this.timerID) {
		window.clearTimeout(this.timerID);
		this.timerID = null;
		this.cb = null
	}
};
Timer.prototype.replace = function(a, b) {
	this.reset();
	this.cb = a;
	this.timerID = window.setTimeout(a, b)
};
Timer.prototype.reschedule = function(a) {
	if (this.timerID) {
		window.clearTimeout(this.timerID)
	}
	if (this.cb) {
		this.timerID = window.setTimeout(this.cb, a)
	}
};
var Auth = function() {
	var b = 0;
	var a = {};
	var f = null;
	var c = {};
	var d = {};
	if (window._buddyicon) {
		a.buddyicon = window._buddyicon
	}
	if (window.Event && Event.addListener) {
		Event.addListener(Event.BACKEND, "signin", function(h, g) {
			window._xsrfToken = h || window._xsrfToken;
			a = {};
			a.buddyicon = g;
			f = null;
			c = {};
			d = {};
			localStorage.setItem("signedInBefore", 1)
		});
		Event.addListener(Event.BACKEND, "signout", function() {
			window._xsrfToken = null;
			a = {};
			f = null;
			c = {};
			d = {}
		})
	}
	yield(function() {
		if (Auth.isLoggedIn()) {
			localStorage.setItem("signedInBefore", 1)
		}
	});
	return {
		user : function() {
			if (!a.id) {
				var g = Cookie.get("l", false);
				if (g && g.match(/\bid&([0-9]+)/)) {
					a.id = RegExp.$1
				}
				if (g && g.match(/\bn&([^&]+)/)) {
					a.name = decodeURIComponent(RegExp.$1)
				}
				if (g && g.match(/\bsp&1/)) {
					a.isSponsor = true
				}
			}
			return a
		},
		userId : function() {
			return Auth.user().id
		},
		isSponsorUser : function() {
			return false
		},
		userCookie : function() {
			return Cookie.get("l", false)
		},
		visitorId : function() {
			if (!b) {
				b = parseInt(Cookie.get("v"), 10)
			}
			return b
		},
		setToken : function(g) {
			f = g
		},
		getToken : function() {
			return f
		},
		setUser : function(g) {
			a = g
		},
		isLoggedIn : function() {
			return ((f || Auth.userCookie()) && window._xsrfToken) ? true : false
		},
		setServices : function(g, k, j) {
			var h = j || "";
			c[h] = g;
			d[h] = k
		},
		getServices : function(k, j, h) {
			var g = j || "";
			if (c[g] && !h) {
				k(c[g], d[g]);
				return
			}
			return Ajax.get({
				hideProgress : true,
				action : "account.sharing",
				data : {
					filter : g
				},
				onSuccess : function(l) {
					Auth.setServices(l.services_data, l.quickshare, g)
				},
				onError : function() {
					Auth.setServices({}, false, g)
				},
				onFinally : function() {
					k(c[g], d[g])
				}
			})
		}
	}
}();
function callOrSignIn(c, b, a) {
	a = a || {};
	a.src = b;
	a.onSuccess = function() {
		c()
	};
	if (Auth.isLoggedIn()) {
		c()
	} else {
		SignInBox.signInOrRegister(a)
	}
}

function Dim(a, b) {
	this.w = Math.abs(a);
	this.h = Math.abs(b);
	if (a === 0) {
		this.aspect = Math.INF
	} else {
		this.aspect = b / a
	}
}
Dim.fromNode = function(a) {
	return new Dim(parseInt(a.offsetWidth, 10), parseInt(a.offsetHeight, 10))
};
Dim.prototype.toString = function() {
	return "(" + this.w + "x" + this.h + ")"
};
Dim.prototype.scale = function(a) {
	this.w = this.w * a;
	this.h = this.h * a
};
Dim.prototype.clone = function() {
	return new Dim(this.w, this.h)
};
Dim.prototype.fit = function(a) {
	var b = Math.min(a.w / this.w, a.h / this.h);
	if (b < 1) {
		this.scale(b)
	}
};
Dim.prototype.equals = function(a) {
	return !(this.w != a.w || this.h != a.h)
};
function Rect(b, d, a, c) {
	this.x1 = b || 0;
	this.y1 = d || 0;
	this.x2 = a || 0;
	this.y2 = c || 0
}
Rect.fromNode = function(a) {
	var c = nodeXY(a);
	var b = Dim.fromNode(a);
	return new Rect(c.x, c.y, c.x + b.w, c.y + b.h)
};
Rect.prototype.toString = function() {
	return "(" + [this.x1, this.y1, this.x2, this.y2].join(", ") + ")"
};
Rect.prototype.equals = function(a) {
	return !(this.x1 != a.x1 || this.y1 != a.y1 || this.x2 != a.x2 || this.y2 != a.y2)
};
Rect.prototype.translate = function(b, a) {
	this.x1 += b;
	this.y1 += a;
	this.x2 += b;
	this.y2 += a;
	return this
};
Rect.prototype.getLocationXY = function(a) {
	switch(a) {
		case"n":
			return new Point(this.x1 + this.width() / 2, this.y1);
		case"ne":
			return new Point(this.x2, this.y1);
		case"e":
			return new Point(this.x2, this.y1 + this.height() / 2);
		case"se":
			return new Point(this.x2, this.y2);
		case"s":
			return new Point(this.x1 + this.width() / 2, this.y2);
		case"sw":
			return new Point(this.x1, this.y2);
		case"w":
			return new Point(this.x1, this.y1 + this.height() / 2);
		case"nw":
			return new Point(this.x1, this.y1)
	}
};
Rect.oppositeLocation = function(a) {
	switch(a) {
		case"n":
			return "s";
		case"ne":
			return "sw";
		case"e":
			return "w";
		case"se":
			return "nw";
		case"s":
			return "n";
		case"sw":
			return "ne";
		case"w":
			return "e";
		case"nw":
			return "se"
	}
	return "n"
};
Rect.prototype.move = function(c, b, a) {
	this.x1 = c.x1 + b;
	this.x2 = c.x2 + b;
	this.y1 = c.y1 + a;
	this.y2 = c.y2 + a;
	return this
};
Rect.prototype.scale = function(b, a) {
	if (a) {
		this.translate(-a.x, -a.y)
	}
	this.x1 *= b.x;
	this.y1 *= b.y;
	this.x2 *= b.x;
	this.y2 *= b.y;
	if (a) {
		this.translate(a.x, a.y)
	}
	return this
};
Rect.prototype.aspect = function() {
	return this.height() / this.width()
};
Rect.prototype.setAspect = function(a) {
	this.setHeight(this.width() * a, 0)
};
Rect.prototype.expand = function(a) {
	this.x1 = Math.min(this.x1, a.x1);
	this.y1 = Math.min(this.y1, a.y1);
	this.x2 = Math.max(this.x2, a.x2);
	this.y2 = Math.max(this.y2, a.y2);
	return this
};
Rect.prototype.clone = function() {
	return new Rect(this.x1, this.y1, this.x2, this.y2)
};
Rect.prototype.width = function() {
	return Math.abs(this.x2 - this.x1)
};
Rect.prototype.setWidth = function(a, c) {
	if (c || c === 0) {
		var f = a - this.width();
		c = Math.max(this.x1, c);
		c = Math.min(this.x2, c);
		var b = this.width() ? Math.abs(this.x1 - c) / this.width() : 0.5;
		var d = b * Math.abs(f);
		if (f < 0) {
			this.x1 += d
		} else {
			this.x1 -= d
		}
	}
	return (this.x2 = this.x1 + a)
};
Rect.prototype.height = function() {
	return Math.abs(this.y2 - this.y1)
};
Rect.prototype.setHeight = function(b, d) {
	if (d || d === 0) {
		var f = b - this.height();
		d = Math.max(this.y1, d);
		d = Math.min(this.y2, d);
		var c = this.height() ? Math.abs(this.y1 - d) / this.height() : 0.5;
		var a = c * Math.abs(f);
		if (f < 0) {
			this.y1 += a
		} else {
			this.y1 -= a
		}
	}
	return (this.y2 = this.y1 + b)
};
Rect.prototype.area = function() {
	return this.width() * this.height()
};
Rect.prototype.top = function() {
	return this.y1
};
Rect.prototype.bottom = function() {
	return this.y2
};
Rect.prototype.left = function() {
	return this.x1
};
Rect.prototype.right = function() {
	return this.x2
};
Rect.prototype.dim = function() {
	return new Dim(this.width(), this.height())
};
Rect.prototype.center = function() {
	return new Point((this.x2 + this.x1) / 2, (this.y2 + this.y1) / 2)
};
Rect.prototype.XYWH = function() {
	return {
		x : this.left(),
		y : this.top(),
		w : this.width(),
		h : this.height()
	}
};
Rect.prototype.getTransformedBounds = function(b, a) {
	var c = this.clone();
	if (a) {
		c.translate(-a.x, -a.y)
	}
	var d = [b.transform(c.x1, c.y1), b.transform(c.x2, c.y1), b.transform(c.x2, c.y2), b.transform(c.x1, c.y2)];
	c.x1 = Math.min(d[0].x, d[1].x, d[2].x, d[3].x);
	c.y1 = Math.min(d[0].y, d[1].y, d[2].y, d[3].y);
	c.x2 = Math.max(d[0].x, d[1].x, d[2].x, d[3].x);
	c.y2 = Math.max(d[0].y, d[1].y, d[2].y, d[3].y);
	if (a) {
		c.translate(a.x, a.y)
	}
	return c
};
Rect.prototype.isInside = function(a) {
	return this.x1 <= a.x && a.x <= this.x2 && this.y1 <= a.y && a.y <= this.y2
};
var InputHint = function() {
	return {
		reset : function(a) {
			a = $(a);
			var b;
			try {
				b = document.activeElement
			} catch(c) {
			}
			if (!a || b == a) {
				return
			}
			var d = a.getAttribute("input_hint") || "";
			if (d) {
				addClass(a, "input_hint")
			}
			a.value = d
		},
		setValue : function(a, b) {
			a = $(a);
			if (!a) {
				return
			}
			removeClass(a, "input_hint");
			if (b) {
				a.value = b
			} else {
				a.value = ""
			}
		},
		setHint : function(a, b) {
			a = $(a);
			if (a && b) {
				a.setAttribute("input_hint", b)
			}
		},
		isHint : function(a) {
			a = $(a);
			return hasClass(a, "input_hint")
		},
		add : function(a, c, b) {
			a = $(a);
			b = $(b);
			if (a && c) {
				InputHint.setHint(a, c);
				if (!inputValue(a)) {
					InputHint.reset(a)
				}
				Event.addListener(a, "focus", function() {
					if (InputHint.isHint(a)) {
						removeClass(a, "input_hint");
						a.value = ""
					}
				});
				Event.addListener(a, "blur", function() {
					if (InputHint.isHint(a) || !a.value) {
						addClass(a, "input_hint");
						a.value = a.getAttribute("input_hint")
					}
				});
				Event.addListener(window, "beforeunload", function() {
					if (InputHint.isHint(a)) {
						a.value = ""
					}
				});
				if (b) {
					Event.addListener(b, "submit", function() {
						if (InputHint.isHint(a)) {
							a.value = ""
						}
					})
				}
			}
		}
	}
}();
var JSON2;
if (!JSON2) {
	JSON2 = {}
}( function() {
		function f(n) {
			return n < 10 ? "0" + n : n
		}
		Date.prototype.toJSON = function(key) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
		};
		String.prototype.toJSON = Number.prototype.toJSON = function(key) {
			return this.valueOf()
		};
		Boolean.prototype.toJSON = function(key) {
			return this.valueOf() ? 1 : 0
		};
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
			"\b" : "\\b",
			"\t" : "\\t",
			"\n" : "\\n",
			"\f" : "\\f",
			"\r" : "\\r",
			'"' : '\\"',
			"\\" : "\\\\"
		}, rep;
		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
			}) + '"' : '"' + string + '"'
		}

		function str(key, holder) {
			var i, k, v, length, mind = gap, partial, value = holder[key];
			if ( typeof rep === "function") {
				value = rep.call(holder, key, value)
			}
			switch(typeof value) {
				case"string":
					return quote(value);
				case"number":
					return isFinite(value) ? String(value) : "null";
				case"boolean":
					return value ? 1 : 0;
				case"null":
					return String(value);
				case"object":
					if (!value) {
						return "null"
					}
					gap += indent;
					partial = [];
					if (Object.prototype.toString.apply(value) === "[object Array]") {
						length = value.length;
						for ( i = 0; i < length; i += 1) {
							partial[i] = str(i, value) || "null"
						}
						v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
						gap = mind;
						return v
					}
					if (rep && typeof rep === "object") {
						length = rep.length;
						for ( i = 0; i < length; i += 1) {
							k = rep[i];
							if ( typeof k === "string") {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + ( gap ? ": " : ":") + v)
								}
							}
						}
					} else {
						for (k in value) {
							if (Object.hasOwnProperty.call(value, k)) {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + ( gap ? ": " : ":") + v)
								}
							}
						}
					}
					v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
					gap = mind;
					return v
			}
		}

		if ( typeof JSON2.stringify !== "function") {
			JSON2.stringify = function(value, replacer, space) {
				var i;
				gap = "";
				indent = "";
				if ( typeof space === "number") {
					for ( i = 0; i < space; i += 1) {
						indent += " "
					}
				} else {
					if ( typeof space === "string") {
						indent = space
					}
				}
				rep = replacer;
				if (replacer && typeof replacer !== "function" && ( typeof replacer !== "object" || typeof replacer.length !== "number")) {
					throw new Error("JSON.stringify")
				}
				return str("", {
					"" : value
				})
			}
		}
		if ( typeof JSON2.parse !== "function") {
			JSON2.parse = function(text, reviver) {
				var j;
				function walk(holder, key) {
					var k, v, value = holder[key];
					if (value && typeof value === "object") {
						for (k in value) {
							if (Object.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if (v !== undefined) {
									value[k] = v
								} else {
									delete value[k]
								}
							}
						}
					}
					return reviver.call(holder, key, value)
				}

				text = String(text);
				cx.lastIndex = 0;
				if (cx.test(text)) {
					text = text.replace(cx, function(a) {
						return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
					})
				}
				if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
					j = eval("(" + text + ")");
					return typeof reviver === "function" ? walk({
						"" : j
					}, "") : j
				}
				throw new SyntaxError("JSON.parse")
			}
		}
	}());
function Point(a, b) {
	this.x = a;
	this.y = b
}
Point.prototype.distance = function(a) {
	return Math.sqrt(Math.pow(a.x - this.x, 2) + Math.pow(a.y - this.y, 2))
};
Point.prototype.equals = function(a) {
	return (this.x == a.x) && (this.y == a.y)
};
Point.origin = new Point(0, 0);
Point.prototype.toString = function() {
	return this.x + "," + this.y
};
function Props(a) {
	this.v = a || {}
}
Props.prototype.toArray = function() {
	return cloneObject(this.v)
};
Props.prototype.isEmpty = function() {
	var a = false;
	forEachKey(this.v, function(b, c) {
		return ( a = true)
	});
	return !a
};
Props.prototype.clear = function() {
	var a = !this.isEmpty();
	this.v = {};
	if (a) {
		Event.trigger(this, "change", {})
	}
};
Props.prototype.set = function(b, d) {
	var a = this.v[b];
	if (d != a) {
		this.v[b] = d;
		var c = {};
		c[b] = {
			value : d,
			old : a
		};
		Event.trigger(this, "change", c)
	}
};
Props.prototype.reset = function(a) {
	Event.bundleEvents(this, "change");
	this.clear();
	this.update(a);
	Event.unbundleEvents(this, "change")
};
Props.prototype.get = function(a) {
	return this.v[a]
};
Props.prototype.update = function(a) {
	var g = false;
	var f = {};
	for (var c in a) {
		if (a.hasOwnProperty(c)) {
			var d = a[c];
			var b = this.v[c];
			if (d != b) {
				this.v[c] = d;
				g = true;
				f[c] = {
					value : d,
					old : b
				}
			}
		}
	}
	if (g) {
		Event.trigger(this, "change", f)
	}
	return g
};
Props.prototype.equals = function(a) {
	var f = false;
	for (var c in a) {
		if (a.hasOwnProperty(c)) {
			var d = a[c];
			var b = this.v[c];
			if (d != b) {
				f = true
			}
		}
	}
	return !f
};
Props.prototype.persist = function() {
};
Props.prototype.restore = function() {
};
function Random(a) {
	this.constant = Math.pow(2, 13) + 1;
	this.prime = 7321;
	this.maximum = 100000;
	this.seed = a || (new Date()).getTime()
}
Random.prototype.next = function() {
	this.seed *= this.constant;
	this.seed += this.prime;
	return this.seed % this.maximum / this.maximum
};
function escapeHTML(a) {
	return a.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/ {2}/g, "&nbsp;&nbsp;").replace(/\"/g, "&quot;")
}

function str2nodes(str, container) {
	var html = (str || "").split(/(<\/?scrip[t][^>]*>)/);
	var js = [];
	var inScript = false;
	html = html.filter(function(snippet) {
		snippet = (snippet || "").trim();
		if (!snippet) {
			return false
		} else {
			if (/^[<]script/.test(snippet)) {
				inScript = true;
				return false
			} else {
				if (snippet == "<\/script>") {
					inScript = false;
					return false
				} else {
					if (inScript) {
						js.push(snippet);
						return false
					} else {
						return snippet
					}
				}
			}
		}
	});
	var tmp = createNode("div", null, null, html.join(""));
	if (container) {
		while (tmp.childNodes.length) {
			container.appendChild(tmp.childNodes[0])
		}
		eval("(function(){" + js.join(";") + "}())")
	} else {
		return {
			nodes : toArray(tmp.childNodes),
			js : function() {
				eval("(function(){" + js.join(";") + "}())")
			}
		}
	}
}

function nodes2str(a) {
	if (a.length < 1) {
		return ""
	}
	var c = createNode("div");
	for (var b = 0; b < a.length; b++) {
		c.appendChild(a[b].cloneNode(true))
	}
	return c.innerHTML
}

function addList(d, b, a, c) {
	return d.appendChild(createNode("li", a, c, b))
}

function inputValue(a) {
	var b = "";
	if (window.InputHint && InputHint.isHint(a)) {
		return b
	}
	switch(a.tagName) {
		case"INPUT":
			switch(a.type) {
				case"text":
				case"email":
				case"submit":
				case"password":
				case"hidden":
				case"file":
					b = a.value;
					break;
				case"checkbox":
				case"radio":
					if (a.checked) {
						b = a.value
					}
					break
			}
			break;
		case"BUTTON":
		case"TEXTAREA":
		case"SELECT":
			b = a.value;
			break;
		default:
			throw "Not an input element"
	}
	return b
}

function decodeHtml(a) {
	if (!a) {
		return a
	}
	return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
}

function createImg(a, b) {
	var c = createNode("img", a, b);
	if (a.width) {
		c.width = a.width
	}
	if (a.height) {
		c.height = a.height
	}
	return c
}

function addTextCtrl(d, b) {
	var a = d.parentNode;
	var f = createNode("input", b);
	var g = createNode("span", {
		className : "add_row",
		title : loc("Add another option")
	});
	Event.addListener(g, "click", function() {
		addTextCtrl(g, b)
	});
	var c = createNode("span", {
		className : "del_row",
		title : loc("Remove this option")
	});
	Event.addListener(c, "click", function() {
		delTextCtrl(c)
	});
	domInsertAfter(a, createNode("li", null, null, [f, g, c]))
}

function delTextCtrl(b) {
	var a = b.parentNode;
	if (domRealChildrenCount(a.parentNode) < 3) {
		ModalDialog.alert(loc("You need at least two options"));
		return
	}
	domRemoveNode(a)
}

function createCopyPaste(b, c) {
	if (!b) {
		b = {}
	}
	var a = createNode("textarea", {
		className : "copypaste",
		readOnly : true,
		name : b.name,
		id : b.id,
		wrap : "soft",
		rows : b.rows || 6,
		cols : 30
	}, null, "");
	a.value = decodeHtml(c);
	Event.addListener(a, "click", function(d) {
		a.focus();
		a.select()
	});
	return a
}

function createInput(d, a, c) {
	if (!a) {
		a = {}
	}
	var f;
	a.type = d;
	switch(d) {
		case"radio":
		case"checkbox":
			return createCheckboxOrRadio(d, a, c);
		default:
			if (Browser.type("IE", 6, 8)) {
				var b = ['<input type="', d, '"'];
				if (a.name) {
					b.push(' name="');
					b.push(a.name + '"')
				}
				if (a.id) {
					b.push(' id="');
					b.push(a.id + '"')
				}
				b.push(" />");
				f = document.createElement(b.join(""));
				delete a.name;
				delete a.id;
				delete a.type;
				setNode(f, a, c)
			} else {
				f = _createNode("input", a, c)
			}
			return f
	}
}

function createCheckboxOrRadio(c, a, b) {
	if (!a) {
		a = {}
	}
	a.checked = a.defaultChecked = a.checked ? true : null;
	var d;
	if (Browser.type("IE", 6, 8) && c.toLowerCase() == "radio") {
		d = document.createElement(['<input type="radio" name="', a.name, '" id="', a.id, '" />'].join(""));
		setNode(d, a, b)
	} else {
		d = _createNode("input", a, b)
	}
	setNode(d, {
		type : c
	});
	if (a.value !== undefined) {
		d.setAttribute("value", a.value)
	}
	return d
}

function createSelect(b, f, c, d) {
	var a = createNode("select", b, f);
	c.forEach(function(h) {
		var g = a.appendChild(createNode("option", {
			value : h.value
		}, null, h.label));
		if (d && h.value == d) {
			setNode(g, {
				selected : true
			})
		}
	});
	return a
}

function createLabel(a, f, b) {
	var c = _createNode("label", a, f, b);
	var d = createNode("span");
	d.innerHTML = outerHTML(c);
	return d.childNodes[0]
}

function createList(a, d, b) {
	var c = createNode("ul", a, d);
	if (b) {
		b.forEach(function(f) {
			addList(c, f)
		})
	}
	return c
}

function createHTML(k, d, a, j) {
	var c = ["<", k, " "];
	var b, f;
	if (a) {
		if (Browser.isIE && a.hasOwnProperty("opacity") && !a.filter) {
			f = a.opacity;
			if (f || f === 0) {
				a.filter = "alpha(opacity=" + f * 100 + ")";
				a.zoom = a.zoom || 1
			}
		}
		var h = [];
		for (b in a) {
			if (!a.hasOwnProperty(b)) {
				continue
			}
			f = a[b];
			if (!f) {
				continue
			}
			var g = b.replace(/([A-Z])/g, "-$1").toLowerCase();
			h.push(g, ":", f, ";")
		}
		d = d || {};
		if (d.style) {
			d.style += ";" + h.join("")
		} else {
			d.style = h.join("")
		}
	}
	if (d) {
		if (d.hasOwnProperty("className")) {
			d["class"] = d.className
		}
		for (b in d) {
			if (!d.hasOwnProperty(b)) {
				continue
			}
			f = d[b];
			if (f || f === "" || f === false || f === 0) {
				c.push(b);
				c.push('="');
				c.push(f.replace('"', "&quot;"));
				c.push('" ')
			}
		}
	}
	c.push(">");
	if (j) {
		if ( typeof (j) == "string") {
			c.push(j)
		} else {
			if (j.constructor == Array) {
				for ( b = 0; b < j.length; ++b) {
					if ( typeof (j[b]) == "string") {
						c.push(j[b])
					} else {
						c.push(outerHTML(j[b]))
					}
				}
			} else {
				c.push(outerHTML(j))
			}
		}
	}
	if (!/^(br|option|li)$/.test(k)) {
		c.push("</", k, ">")
	}
	return c.join("")
}

function outboundLink(b, c, a) {
	b = b || {};
	b.target = "_blank";
	b.className = b.className || "outbound";
	b.trackelement = b.trackelement || "site";
	return createNode("a", b, c, a)
}

function getTbody(a) {
	var b = a.getElementsByTagName("tbody");
	if (b && b.length > 0) {
		return b[0]
	} else {
		return a.appendChild(createNode("tbody"))
	}
}

function outerHTML(b) {
	var a = document.createElement("div");
	replaceChild(a, b);
	return a.innerHTML
}

function selectInputText(b, d, a) {
	if (b.setSelectionRange) {
		b.setSelectionRange(d, a)
	} else {
		if (b.createTextRange) {
			var c = b.createTextRange();
			c.moveStart("character", d);
			c.moveEnd("character", a - b.value.length);
			c.select()
		} else {
			b.select()
		}
	}
}

function getCaretPosition(a) {
	if (!a.value) {
		return 0
	}
	try {
		if ( typeof (a.selectionStart) == "number") {
			if (document.activeElement != a) {
				return -1
			}
			return a.selectionStart
		} else {
			if (document.selection) {
				try {
					var f = document.selection.createRange();
					var c = a.createTextRange();
					c.setEndPoint("StartToStart", f);
					return inputValue(a).lastIndexOf(c.text)
				} catch(d) {
					return -1
				}
			} else {
				return -1
			}
		}
	} catch(b) {
		if (b.message.indexOf("Component returned failure code: 0x80004005") === 0 && !isAttachedToDom(a)) {
			return -1
		}
		throw b
	}
}

function stripHtml(a) {
	a = a.replace(/<[^>]*>/g, "");
	a = a.replace(/[ \t]+/g, " ");
	return a
}

function getVisibleHtmlText(a) {
	a = a.replace(/<script[^>]*>.*?<\/script>/ig, "");
	a = a.replace(/<head[^>]*>.*?<\/head>/ig, "");
	a = a.replace(/<style[^>]*>.*?<\/style>/ig, "");
	a = stripHtml(a);
	a = a.replace(/([\s\u00a0]){2,}/g, "$1");
	return a
}

function insertScriptNode(f, d) {
	var a = document.getElementsByTagName("script");
	if (a) {
		var b = a.length;
		for (var c = 0; c < b; c++) {
			if (a[c].src == f) {
				return
			}
		}
	}
	Event.addListener(document, "modifiable", function() {
		var h = false;
		var g = createNode("script", {
			src : f
		});
		if (d) {
			g.onload = g.onreadystatechange = function() {
				if (h) {
					return
				}
				var j = this.readyState;
				if (j && j != "complete" && j != "loaded") {
					return
				}
				g.onreadystatechange = g.onload = null;
				h = true;
				d.call()
			}
		}
		document.body.appendChild(g)
	})
}

function appendScript(f, b, c, a) {
	f = f || document.body;
	a = a || noop;
	b = b || {};
	var g;
	if (!b.src && c && c.trim()) {
		g = createNode("script", b);
		g.text = c;
		g.type = "any";
		f.appendChild(g);
		if (b.type) {
			g.setAttribute("type", b.type)
		} else {
			g.removeAttribute("type")
		}
		window._lsn = g;
		(new Function(g.text))();
		window._lsn = null;
		yield(a)
	} else {
		g = createNode("script", b);
		if (a) {
			var d;
			g.onload = g.onerror = g.onreadystatechange = function() {
				if (d) {
					return
				}
				var h = g.readyState;
				if (h && h != "complete" && h != "loaded") {
					return
				}
				window._lsn = g._prevLSN;
				d = true;
				g.onreadystatechange = g.onload = g.onerror = null;
				yield(a)
			}
		}
		g._prevLSN = window._lsn || null;
		window._lsn = g;
		f.appendChild(g)
	}
	return g
}

function flushDocumentWriteBuffer(d, a) {
	d = d || document.body;
	a = a || noop;
	var b = document.write._buffer;
	if (!b) {
		yield(a);
		return
	}
	b = b.join("");
	document.write._buffer.length = 0;
	b = createNode("div", null, null, "<br/>" + b);
	b.removeChild(b.firstChild);
	var c = [];
	while (b.childNodes.length) {
		c.push(b.removeChild(b.lastChild))
	}
	_appendNodes(d, c, a)
}

function _appendNodes(f, c, b) {
	if (!c || !c.length) {
		yield(b);
		return
	}
	var g = c.pop();
	if (g.tagName == "SCRIPT") {
		var a = {};
		if (g.src) {
			a.src = g.src
		}
		if (g.type) {
			a.type = g.type
		}
		appendScript(f, a, g.text, function() {
			flushDocumentWriteBuffer(f, function() {
				_appendNodes(f, c, b)
			})
		})
	} else {
		var h = g.cloneNode(false);
		if (g.nodeType == 3) {
			f.appendChild(h);
			yield(function() {
				_appendNodes(f, c, b)
			})
		} else {
			f.appendChild(h);
			var d = [];
			while (g.childNodes.length) {
				d.push(g.removeChild(g.lastChild))
			}
			yield(function() {
				_appendNodes(h, d, function() {
					_appendNodes(f, c, b)
				})
			})
		}
	}
}

var Dom = function() {
	var a = 0;
	return {
		uniqueId : function(b) {
			return "js_" + (b || "") + (++a)
		}
	}
}();
function $(a) {
	if (a && a.constructor == String) {
		return document.getElementById(a)
	}
	return a
}

function setNode(g, a, f, b) {
	if (!g) {
		return null
	}
	var c, h;
	if (f) {
		var d = g.style;
		if (Browser.isIE && f["float"]) {
			f.cssFloat = f["float"]
		}
		if (Browser.isIE && f.hasOwnProperty("opacity") && typeof (d.opacity) !== "string" && typeof (d.filter) == "string") {
			h = f.opacity;
			if (h || h === 0) {
				d.filter = "alpha(opacity=" + h * 100 + ")";
				if (!g.currentStyle || !g.currentStyle.hasLayout) {
					d.zoom = 1
				}
			} else {
				d.filter = null
			}
			delete f.opacity
		}
		for (c in f) {
			if (f.hasOwnProperty(c)) {
				h = f[c];
				h = h === undefined ? null : h;
				if (d[c] != h) {
					try {
						d[c] = h
					} catch(j) {
						if (Browser.isIE && j.toString().match(/Invalid argument/)) {
							d[c] = ""
						} else {
							throw j
						}
					}
				}
			}
		}
	}
	if (a) {
		for (c in a) {
			if (a.hasOwnProperty(c)) {
				h = a[c];
				if (c == "class" || c == "className") {
					g.className = h
				} else {
					if (h !== g.getAttribute(c)) {
						if (h || h === "" || h === false || h === 0) {
							g.setAttribute(c, h)
						} else {
							g.removeAttribute(c)
						}
					}
				}
			}
		}
	}
	if (b !== undefined) {
		replaceChild(g, b)
	}
	return g
}

function createNode(b, a, d, c) {
	return setNode(document.createElement(b), a, d, c)
}

function replaceChild(c, a) {
	if (a && typeof (a) == "string" && a.indexOf("<object") === 0) {
		c.innerHTML = a;
		return
	}
	var b = createNode("div");
	if (c.childNodes && c.childNodes.length) {
		clearNode(c)
	}
	a = flatten(a);
	a.forEach(function(f) {
		var d = typeof (f);
		switch(d) {
			case"string":
				f = f.replace(/^ /, "&nbsp;");
				b.innerHTML = f;
				while (b.childNodes.length) {
					c.appendChild(b.childNodes[0])
				}
				b.innerHTML = "";
				break;
			case"number":
				c.appendChild(document.createTextNode(f));
				break;
			default:
				c.appendChild(f)
		}
	})
}

function clearNode(b, a) {
	purge(b, a);
	domRemoveDescendants(b, false)
}

function domRemoveDescendants(g, d) {
	if (!g) {
		return
	}
	var c, f, b;
	if (( c = g.childNodes)) {
		b = c.length;
		for ( f = b - 1; f >= 0; --f) {
			domRemoveNode(c[f], d)
		}
	}
}

function domRemoveNode(c, a) {
	if (!c) {
		return
	}
	if (a || a === undefined) {
		purge(c, true)
	}
	if (!Browser.isIE || c.tagName == "SCRIPT") {
		if (c.parentNode) {
			c.parentNode.removeChild(c)
		}
		return
	}
	var g = $("IELeakGarbageBin");
	if (!g) {
		g = document.body.appendChild(createNode("div", {
			id : "IELeakGarbageBin"
		}, {
			display : "none"
		}))
	}
	var d = [c];
	while (d.length) {
		var f = d.pop();
		if (f.tagName == "SCRIPT") {
			f.parentNode.removeChild(f)
		} else {
			for (var b = 0; b < f.childNodes.length; ++b) {
				d.push(f.childNodes[b])
			}
		}
	}
	g.appendChild(c);
	g.innerHTML = ""
}

var textContent;
if (Browser.isIE) {
	textContent = function(a) {
		if (a.nodeType == 3) {
			return a.nodeValue
		} else {
			return a.innerText
		}
	}
} else {
	textContent = function(a) {
		return a.textContent
	}
}
function _nodeCleaner() {
	Event.release(this);
	var a = this.attributes;
	if (!a) {
		return
	}
	for (var b = 0; b < a.length; ) {
		var c = a[b].name;
		if ( typeof this[c] === "function") {
			this[c] = null
		} else {++b
		}
	}
}

function purge(g, f) {
	if (!g || g.nodeName == "EMBED") {
		return
	}
	var c, d, b, h;
	if (f) {
		_nodeCleaner.call(g)
	}
	c = g.childNodes;
	if (c) {
		b = c.length;
		for ( d = 0; d < b; d += 1) {
			purge(c[d], true)
		}
	}
}

function matchingAncestor(c, b, a) {
	if (b && typeof b.toUpperCase == "function") {
		b = b.toUpperCase()
	}
	while (c && c.tagName != "HTML" && c.tagName != "BODY" && c.getAttribute) {
		if (b) {
			if (c.tagName == b && c.getAttribute(a)) {
				return c
			}
			c = c.parentNode
		} else {
			if (c.getAttribute(a)) {
				return c
			}
			c = c.parentNode
		}
	}
	return null
}

function getElementsWithAttributes(q) {
	var o = q.root || document;
	var c = q.tagName || "*";
	var h = q.attributes || {};
	if (o.querySelectorAll) {
		var f = [c];
		forEachKey(h, function(r, j) {
			if (j) {
				f.push("[" + r + "=" + j.quote() + "]")
			} else {
				f.push("[" + r + "]")
			}
		});
		f = f.join("");
		try {
			return o.querySelectorAll(f)
		} catch(n) {
		}
	} else {
		var l = [];
		var a = o.getElementsByTagName(c);
		h = h.map(function(j) {
			var r = j.split("=");
			if (r.length != 2) {
				r = [j, null]
			} else {
				r[1] = r[1].replace(/^(\"|\')/, "").replace(/(\"|\')$/, "")
			}
			return {
				name : r[0],
				value : r[1]
			}
		});
		for (var k = 0; k < a.length; k++) {
			var d = a[k];
			var p = true;
			for (var g = 0; g < h.length; g++) {
				var m = h[g];
				var b = d.getAttribute(m.name);
				if (!b || (m.value && b !== m.value)) {
					p = false;
					break
				}
			}
			if (p) {
				l.push(d)
			}
		}
		return l
	}
}

function fullCreateNode(b, a, f, c) {
	var d = b.toLowerCase();
	switch(d) {
		case"input":
			return createInput(a.type, a, f);
		case"label":
			return createLabel(a, f, c)
	}
	return _createNode(b, a, f, c)
}

createNode = fullCreateNode;
function _createNode(b, a, d, c) {
	return setNode(document.createElement(b), a, d, c)
}

function createSprite(b, a) {
	return createNode("div", {
		className : "sprite " + (b || "")
	}, null, a)
}

function domInsertAfter(b, a) {
	return b.parentNode.insertBefore(a, b.nextSibling)
}

function domInsertAtTop(b, a) {
	if (b.childNodes && b.childNodes.length > 0) {
		b.insertBefore(a, b.childNodes[0])
	} else {
		b.appendChild(a)
	}
}

function domContainsChild(a, b) {
	while (b) {
		if (b == a) {
			return true
		}
		b = b.parentNode
	}
	return false
}

function delayedClearNode(j, d) {
	if (!j || j.nodeName == "EMBED") {
		return
	}
	var c, h, b, k;
	if (d) {
		_nodeCleaner.apply(j)
	}
	var f = [];
	var g = createNode("div", null, {
		display : "none"
	});
	c = j.childNodes;
	if (c) {
		while (c.length) {
			g.appendChild(c[0])
		}
	}
	window.setTimeout(function() {
		loopNonBlocking(20, function() {
			if (!f.length) {
				return true
			}
			var a = f.shift();
			ExecQueue.push(Event.wrapper(_nodeCleaner, a));
			c = a.childNodes;
			if (c) {
				b = c.length;
				for ( h = 0; h < b; h += 1) {
					f.push(c[h])
				}
			}
		})
	}, 200)
}

function domRealChildrenCount(d) {
	var b = d.childNodes;
	var a = 0;
	for (var c = 0; c < b.length; ++c) {
		if (b[c].nodeType == 1) {
			a++
		}
	}
	return a
}

function domPrev(a) {
	do {
		a = a.previousSibling
	} while(a&&a.nodeType!=1);
	return a
}

function domNext(a) {
	do {
		a = a.nextSibling
	} while(a&&a.nodeType!=1);
	return a
}

function isAttachedToDom(a) {
	while (a) {
		if (a == document.body) {
			return true
		}
		a = a.parentNode
	}
	return false
}

function domPoke(a, b) {
	if (b || Browser.type("IE", 0, 6)) {
		setNode(a, null, {
			zoom : 0
		});
		yield(function() {
			setNode(a, null, {
				zoom : 1
			})
		})
	}
}

function getElementsByClassName(c) {
	var a = c.root || document;
	var g = c.tagName || "*";
	var h = c.className;
	var f = [];
	var b = a.getElementsByTagName(g);
	for (var d = 0; d < b.length; d++) {
		if (hasClass(b[d], h)) {
			f.push(b[d])
		}
	}
	return f
}

function inOrderTraversal(b, c, a) {
	if (!b) {
		return a || null
	}
	if (!c) {
		c = document
	}
	if (b(c)) {
		if (!a) {
			return c
		}
		a.push(c)
	}
	for (var d = 0; d < c.childNodes.length; ++d) {
		var f = inOrderTraversal(b, c.childNodes[d], a);
		if (f && !a) {
			return f
		}
	}
	return a || null
}

function domGetContainer(a) {
	while (a && a.nodeType != 1) {
		a = a.parentNode
	}
	if (!a) {
		return null
	}
	if (a.nodeName.match(/INPUT|IMG/)) {
		return domGetContainer(a.parentNode)
	}
	return a
}

function lastScriptNode() {
	if (window._lsn) {
		return window._lsn
	}
	var a = document.getElementsByTagName("script");
	return a ? a[a.length - 1] : null
}

function setDefaultEmbedWMode(a) {
	a = a || "opaque";
	Event.addListener(document, "domready", Browser.isIE ? function() {
		var f = document.getElementsByTagName("object");
		var k;
		var m;
		var j;
		var g;
		var l;
		for (var d = 0; d < f.length; ++d) {
			var c = f[d];
			if (!/<embed\b/i.test(c.innerHTML)) {
				continue
			}
			j = (/\bwmode=.?([\w]+)/i.test(c.innerHTML) ? RegExp.$1 : "Window").toLowerCase();
			if (j != "window" || j == a) {
				continue
			}
			k = c.parentNode;
			m = c.nextSibling;
			g = outerHTML(c);
			if (/\bwmode=/i.test(g)) {
				g = g.replace(/\bwmode=(\'|\")?[\w]+(\'|\")?/ig, "wmode=" + a)
			} else {
				g = g.replace(/<embed\b/ig, "<embed wmode=" + a)
			}
			g = g.replace(/<param[^>]*\bwmode\b[^>]*>(<\/param>)?/i, "");
			g = g.replace(/<\/object>/ig, "<param name=wmode value=" + a + " /></object>");
			l = createNode("div",null,null,g).childNodes[0];
			k.insertBefore(l, m)
		}
		var b = document.getElementsByTagName("embed");
		for ( d = 0; d < b.length; ++d) {
			var h = b[d];
			j = (h.getAttribute("wmode") || "Window").toLowerCase();
			if (j != "window" || j == a || !h.parentNode || h.parentNode.tagName.toLowerCase() == "object") {
				continue
			}
			k = h.parentNode;
			m = h.nextSibling;
			g = outerHTML(h);
			g = g.replace(/<embed\b/ig, "<embed wmode=" + a);
			l = createNode("div",null,null,g).childNodes[0];
			k.insertBefore(l, m)
		}
	} : function() {
		var g = document.getElementsByTagName("embed");
		for (var c = 0; c < g.length; ++c) {
			var h = g[c];
			var b = (h.getAttribute("wmode") || "Window").toLowerCase();
			if (b != "window" || b == a) {
				continue
			}
			setNode(h, {
				wmode : a
			});
			var f = h.parentNode;
			var d = h.nextSibling;
			f.removeChild(h);
			f.insertBefore(h, d)
		}
	})
}

function toggleClass(c, b) {
	if (!c || c.className === undefined || !b) {
		return null
	}
	var d = c.className.split(/\s+/);
	var a = b.split(/\s+/);
	a.forEach(function(f) {
		if (d.contains(f)) {
			d.removeAll(f)
		} else {
			d.push(f)
		}
	});
	d.removeAll("");
	return setNode(c, {
		className : d.join(" ")
	})
}

function addClass(b, a) {
	if (!b || b.className === undefined || !a) {
		return null
	}
	var d = b.className.split(/\s+/);
	var c = a.split(/\s+/);
	c.forEach(function(f) {
		if (!d.contains(f)) {
			d.push(f)
		}
	});
	d.removeAll("");
	return setNode(b, {
		className : d.join(" ")
	})
}

function removeClass(c, b) {
	if (!c || c.className === undefined || !b) {
		return null
	}
	var d = c.className.split(/\s+/);
	var a = b.split(/\s+/);
	a.forEach(function(f) {
		d.removeAll(f)
	});
	d.removeAll("");
	return setNode(c, {
		className : d.join(" ")
	})
}

function hasClass(b, a) {
	if (!b || b.className === undefined || !a) {
		return null
	}
	var c = b.className.split(/\s+/);
	return c.contains(a)
}

function getStyle(b, c) {
	if (b.nodeType != 1) {
		return null
	}
	if (b.style[c]) {
		return b.style[c]
	} else {
		if (b.currentStyle) {
			return b.currentStyle[c]
		} else {
			if (document.defaultView && document.defaultView.getComputedStyle) {
				c = c.replace(/([A-Z])/g, "-$1");
				c = c.toLowerCase();
				var a = document.defaultView.getComputedStyle(b, "");
				return a && a.getPropertyValue(c)
			} else {
				return null
			}
		}
	}
}

function scrollXY(b, a) {
	if (!b) {
		b = new Point()
	}
	if (!a || a == window) {
		if (window.pageXOffset !== undefined) {
			b.x = window.pageXOffset;
			b.y = window.pageYOffset
		} else {
			if (document.documentElement) {
				b.x = document.documentElement.scrollLeft;
				b.y = document.documentElement.scrollTop
			} else {
				b.x = document.body.scrollLeft;
				b.y = document.body.scrollTop
			}
		}
	} else {
		b.x = a.scrollLeft;
		b.y = a.scrollTop
	}
	return b
}

function px(a) {
	return Math.round(a) + "px"
}

function fromPx(a) {
	if (!a.match(/\d+px/)) {
		return a
	}
	return parseInt(a.replace("px", ""), 10)
}

function hasDim(a) {
	return parseInt(a.offsetWidth, 10) > 0 && parseInt(a.offsetHeight, 10) > 0
}

function hide(a) {
	addClass(a, "hidden");
	addClass(a, "invisible");
	setNode(a, null, {
		display : "none",
		visibility : "hidden"
	})
}

function show(a) {
	removeClass(a, "hidden");
	removeClass(a, "invisible");
	setNode(a, null, {
		display : "block",
		visibility : "inherit"
	})
}

function getWindowSize() {
	var a = document.compatMode;
	if (a || Browser.isIE) {
		if (a == "CSS1Compat") {
			return new Dim(document.documentElement.clientWidth, document.documentElement.clientHeight)
		} else {
			return new Dim(document.body.clientWidth, document.body.clientHeight)
		}
	} else {
		return new Dim(window.innerWidth, window.innerHeight)
	}
}

function nodeXY(b) {
	var m;
	var g;
	if (b.getBoundingClientRect && !Browser.layoutEngine("WebKit") && !Browser.layoutEngine("Gecko", 12, 0)) {
		var l = window.document;
		var f;
		try {
			f = b.getBoundingClientRect()
		} catch(j) {
			return new Point(0, 0)
		}
		if (Browser.isIE) {
			f.left -= 2;
			f.top -= 2
		}
		m = new Point(f.left, f.top);
		var d = false;
		while (b && b.tagName != "HTML" && b.tagName != "BODY") {
			if (getStyle(b, "position") == "fixed") {
				d = true;
				break
			}
			b = b.parentNode
		}
		if (!d) {
			var a = Math.max(l.documentElement.scrollTop, l.body.scrollTop);
			var c = Math.max(l.documentElement.scrollLeft, l.body.scrollLeft);
			m.x += c;
			m.y += a
		}
		return m
	} else {
		m = new Point(b.offsetLeft, b.offsetTop);
		g = b.offsetParent;
		var k = Browser.isSafari;
		var h = getStyle(b, "position") == "absolute";
		if (g != b) {
			while (g) {
				m.x += g.offsetLeft;
				m.y += g.offsetTop;
				if (k && !h && getStyle(g, "position") == "absolute") {
					h = true
				}
				g = g.offsetParent
			}
		}
		if (k && h) {
			m.x -= document.body.offsetLeft;
			m.y -= document.body.offsetTop
		}
		g = b.parentNode;
		while (g && g.tagName != "HTML" && g.tagName != "BODY") {
			if (getStyle(g, "display") != "inline") {
				m.x -= g.scrollLeft;
				m.y -= g.scrollTop
			}
			g = g.parentNode
		}
		return m
	}
}

function makeUnselectable(a) {
	Event.addListener(a, "selectstart", returnFalse);
	Event.addListener(a, "drag", returnFalse);
	addClass(a, "unselectable");
	setNode(a, {
		unselectable : "on"
	})
}

function showInline(a) {
	removeClass(a, "hidden");
	removeClass(a, "invisible");
	setNode(a, null, {
		display : "inline",
		visibility : "inherit"
	})
}

function disable(a) {
	setNode(a, {
		disabled : true
	})
}

function enable(a) {
	setNode(a, {
		disabled : null
	})
}

function getElementSize(a) {
	return new Dim(a.offsetWidth + depx(getStyle(a, "marginLeft")) + depx(getStyle(a, "marginRight")), a.offsetHeight + depx(getStyle(a, "marginTop")) + depx(getStyle(a, "marginBottom")))
}

function setScroll(f) {
	var c = document.documentElement;
	var a = document.body;
	c.scrollLeft = a.scrollLeft = f.x;
	c.scrollTop = a.scrollTop = f.y
}

function scrollToMiddle(b, a) {
	a = a || ( b ? b.parentNode : null);
	if (!b || !a) {
		return
	}
	return b.offsetTop + b.clientHeight / 2 - a.clientHeight / 2
}

function scrollUp(a, b) {
	if (b.offsetTop < a.scrollTop) {
		a.scrollTop = b.offsetTop
	} else {
		if (b.offsetTop > a.scrollTop + a.offsetHeight) {
			a.scrollTop = b.offsetTop + b.offsetHeight - a.offsetHeight
		}
	}
}

function scrollDown(a, b) {
	if (b.offsetTop + b.offsetHeight > a.scrollTop + a.offsetHeight) {
		a.scrollTop = b.offsetTop + b.offsetHeight - a.offsetHeight
	} else {
		if (b.offsetTop + b.offsetHeight < a.scrollTop) {
			a.scrollTop = b.offsetTop
		}
	}
}

function isDescendantOfFixed(a) {
	while (a) {
		if (getStyle(a, "position") == "fixed") {
			return true
		}
		a = a.parentElement
	}
	return false
}

var _scrollbarWidth = -1;
function getScrollbarWidth() {
	if (_scrollbarWidth > 0) {
		return _scrollbarWidth
	}
	if (Browser.type("IE", 0, 6)) {
		return ( _scrollbarWidth = 20)
	}
	if (_scrollbarWidth < 0) {
		_scrollbarWidth = 0;
		var b = createNode("div", null, {
			height : "50px",
			width : "50px",
			display : "block",
			overflowY : "scroll",
			visibility : "hidden",
			position : "absolute",
			top : "0"
		});
		var a = b.appendChild(createNode("div"));
		Event.addListener(document, "modifiable", function() {
			document.body.appendChild(b);
			yield(function() {
				_scrollbarWidth = Dim.fromNode(b).w - Dim.fromNode(a).w;
				domRemoveNode(b)
			})
		})
	}
	return 14
}getScrollbarWidth();
var _modifiableStyleSheet;
var _cssRules = {};
var _toUpperCase = function(b, a) {
	return (a || "").toUpperCase()
};
function _getModifiableStyleSheet() {
	if (_modifiableStyleSheet) {
		return _modifiableStyleSheet
	}
	try {
		var a = document.getElementsByTagName("head")[0] || document.body;
		a.appendChild(createNode("style", {
			type : "text/css"
		}))
	} catch(b) {
		return ( _modifiableStyleSheet = document.styleSheets[0])
	}
	return ( _modifiableStyleSheet = document.styleSheets[document.styleSheets.length - 1])
}

function editCSSStyleText(g, c) {
	if (Browser.isIE) {
		return setNode(g, null, c)
	}
	var f = {};
	for (var b = 0; b < g.style.length; ++b) {
		var a = g.style[b].replace(/-([a-z])/, _toUpperCase);
		f[a] = g.style[a]
	}
	forEachKey(c, function(j, h) {
		h = h === undefined ? null : h;
		if (h || h === 0) {
			f[j] = h;
			if (j == "float") {
				f.cssFloat = h
			}
		} else {
			delete f[j]
		}
	});
	var d = [];
	forEachKey(f, function(j, h) {
		j = j.replace(/([A-Z])/g, "-$1").toLowerCase();
		d.push(j, ":", h, ";")
	});
	g.style.cssText = d.join("");
	return g
}

function editCSSRule(d, a) {
	a = a || {};
	var l;
	if (( l = _cssRules[d])) {
		return editCSSStyleText(l, a)
	}
	var h = noop;
	var c;
	if (document.baseURI != window.location.toString() && (Browser.layoutEngine("WebKit") || Browser.type("IE", 0, 7)) && ( c = document.getElementsByTagName("base")).length) {
		var b;
		var n;
		for (var f = c.length - 1; f >= 0; --f) {
			if (c[f].href) {
				b = c[f];
				n = b.nextSibling
			}
		}
		if (b) {
			b.parentNode.removeChild(b)
		}
		var k = document.head;
		if (!k) {
			k = document.getElementsByTagName("head");
			k = k[k.length - 1]
		}
		var j = k.appendChild(createNode("base", {
			href : window.location.toString()
		}));
		h = function() {
			if (j) {
				j.parentNode.removeChild(j)
			}
			if (b) {
				k.insertBefore(b, n)
			}
		}
	}
	var m = _getModifiableStyleSheet();
	if (!_modifiableStyleSheet) {
		h();
		return null
	}
	if (_modifiableStyleSheet.addRule && _modifiableStyleSheet.rules) {
		_modifiableStyleSheet.addRule(d, "width:auto");
		l = _modifiableStyleSheet.rules[_modifiableStyleSheet.rules.length - 1]
	} else {
		if (_modifiableStyleSheet.insertRule && _modifiableStyleSheet.cssRules) {
			_modifiableStyleSheet.insertRule(d + "{}", _modifiableStyleSheet.cssRules.length);
			l = _modifiableStyleSheet.cssRules[_modifiableStyleSheet.cssRules.length - 1]
		}
	}
	if (!l) {
		h();
		return null
	}
	if (!a.width) {
		a.width = ""
	}
	_cssRules[d] = l;
	var g = editCSSStyleText(l, a);
	h();
	return g
}

function getNaturalWidthHeight(b, c) {
	if (!b) {
		return
	}
	var a = new Image();
	a.onload = function() {
		c(a.width, a.height)
	};
	a.src = b
}

var __offscreen;
function getNaturalRect(a, c, b) {
	c = Event.wrapper(c, b);
	__offscreen = __offscreen || document.body.appendChild(createNode("div", {
		className : "offscreen"
	}));
	__offscreen.appendChild(a);
	yield(function() {
		var d = Rect.fromNode(a);
		c(d)
	})
}

function getElementInnerDim(a) {
	return new Dim(a.offsetWidth - depx(getStyle(a, "paddingLeft")) - depx(getStyle(a, "borderLeftWidth")) - depx(getStyle(a, "paddingRight")) - depx(getStyle(a, "borderRightWidth")), a.offsetHeight - depx(getStyle(a, "paddingTop")) - depx(getStyle(a, "borderTopWidth")) - depx(getStyle(a, "paddingBottom")) - depx(getStyle(a, "borderBottomWidth")))
}

function getElementShift(b, a) {
	if (a == "top") {
		return depx(getStyle(b, "paddingTop")) + depx(getStyle(b, "borderTopWidth"))
	} else {
		if (a == "bottom") {
			return depx(getStyle(b, "paddingBottom")) + depx(getStyle(b, "borderBottomWidth"))
		} else {
			if (a == "left") {
				return depx(getStyle(b, "paddingLeft")) + depx(getStyle(b, "borderLeftWidth"))
			} else {
				if (a == "right") {
					return depx(getStyle(b, "paddingRight")) + depx(getStyle(b, "borderRightWidth"))
				}
			}
		}
	}
	return 0
}

function overlayZIndex(d) {
	var c = 4999990;
	var b = document.body.childNodes || [];
	for (var a = 0; a < b.length; ++a) {
		c = Math.max(c, Math.ceil(parseFloat(getStyle(b[a], "zIndex"))) || 0)
	}
	return (d && Math.ceil(parseFloat(getStyle(d, "zIndex"))) == c) ? c : c + 10
}

if (Browser.isSafari) {
	editCSSRule(".glow", {
		outlineStyle : "auto"
	})
}
function depx(a) {
	if (!a || !a.match(/([\-0-9.]+)px/)) {
		return 0
	} else {
		return Number(RegExp.$1)
	}
}

function buildURL(f, g, j, l) {
	g = g || {};
	var b;
	if (f == "profile" && !j && g.name) {
		b = g.name;
		delete g.name;
		delete g.id
	}
	var c = hashToQueryArray(g);
	var d = Auth.getToken();
	if (d) {
		if (f.indexOf("img-") !== 0) {
			c.push(".tok=" + encodeURIComponent(d))
		}
	}
	var k = Conf.getLocale();
	if (k) {
		if (f.indexOf("img-") !== 0) {
			c.push(".locale=" + encodeURIComponent(k))
		}
	}
	if (b) {
		var a = c.length ? ("?" + c.join("&")) : "";
		return buildVanityURL(b, a, l)
	}
	if (f == "splash") {
		var h = c.length ? ("?" + c.join("&")) : "";
		return buildAbsURL("/" + h, l)
	}
	j = j || "cgi";
	c = "../" + j + "/" + f + (c.length ? ("?" + c.join("&")) : "");
	if (l && l != getProtocol()) {
		return buildAbsURL(c, l)
	} else {
		return c
	}
}

function normalizeURL(a) {
	var d = a;
	var b = "";
	if (isAbsURL(a) && a.length > 8) {
		b = a.substr(0, a.indexOf("/", 8));
		d = a.substr(b.length)
	} else {
		d = a
	}
	var c = d.split("/");
	var f = [];
	c.forEach(function(g) {
		if (g == ".") {
			return
		} else {
			if (g == ".." && f.length > 0) {
				if (f[f.length - 1] === "") {
					return
				} else {
					if (f[f.length - 1] == "..") {
						f.push(g)
					} else {
						f.pop()
					}
				}
			} else {
				f.push(g)
			}
		}
	});
	return b + f.join("/")
}

function _validateCDNImgParams(b, a) {
	return b == "img-set" || b == "img-thing" || b == "img-buddy"
}

function cdn() {
	return "akamai"
}

function buildImgURL(d, b) {
	var a;
	var c = b.size;
	var f = UI.sizeMap[c];
	if (c && f) {
		c = b.size = f.url
	}
	if (_validateCDNImgParams(d, b)) {
		a = buildCDNImgURL(cdn(), d, b)
	}
	return a || buildPolyvoreImgURL(d, b)
}

function hashImgParams(d, h) {
	var g = [d];
	var b = [];
	forEachKey(h, function(j) {
		b.push(j)
	});
	b.sort();
	b.forEach(function(j) {
		g.push(h[j])
	});
	var f = 0;
	g = g.join("");
	for (var c = 0, a = g.length; c < a; c++) {
		f += g.charCodeAt(c)
	}
	return f
}

function buildCDNImgURL(j, b, f) {
	var k, g;
	if (b == "img-set" || b == "img-thing" || b == "img-buddy") {
		if (b == "img-set") {
			f.id = f.spec_uuid;
			delete f.spec_uuid
		}
		g = Conf.getCDNImgHost(j, b, f);
		if (!g) {
			if (b == "img-set") {
				f.spec_uuid = f.id;
				delete f.id
			}
			return ""
		}
		var a = f[".out"];
		delete f[".out"];
		var h = [];
		forEachKey(f, function(m, l) {
			h.push(m)
		});
		h.sort();
		var d = ["/cgi", b];
		for (var c = 0; c < h.length; ++c) {
			d.push(h[c], encodeURIComponent(f[h[c]]))
		}
		k = [d.join("/"), ".", a].join("")
	} else {
		console.log("CDN was not enabled for " + b);
		return ""
	}
	return [getProtocol() + "://", g, k].join("")
}

function buildPolyvoreImgURL(c, b) {
	if (c == "img-set") {
		b.id = b.spec_uuid;
		delete b.spec_uuid;
		if (b[".sig"]) {
			console.log("signed url generation from js layer is not allowed")
		}
	}
	var a = "http://" + Conf.getWebUrlPrefix() + "/cgi/" + buildURL(c, b);
	if (Conf.getSetting("rewriteImgBase")) {
		a = a.replace(/^https?:\/\/[^\/]+(.*\/cgi\/)(.*)/, getProtocol() + "://" + Conf.getImgHost(c, b) + "/cgi/$2")
	} else {
		a = a.replace(/^https?:\/\/[^\/]+/, getProtocol() + "://" + Conf.getImgHost(c, b))
	}
	return normalizeURL(a)
}

function buildRsrcURL(b, a) {
	return normalizeURL(Conf.getRsrcUrlPrefix(cdn(), a) + b)
}

function buildAbsURL(k, g, c) {
	if (isAbsURL(k)) {
		return k
	}
	if (!g) {
		g = getProtocol()
	}
	var l;
	if (k.charAt(0) == "/") {
		var h = c ? c : Conf.getWebHost();
		l = g + "://" + h + k
	} else {
		if (!window._dirname) {
			var a = parseUri(window.location);
			var j = a.path.split(/\//);
			j.pop();
			j.push("");
			a.path = j.join("/");
			if (a.path.charAt(0) != "/") {
				a.path = "/" + a.path
			}
			window._dirname = reconstructUri({
				protocol : "",
				authority : a.authority,
				path : a.path
			})
		}
		var f = window._dirname;
		var b = c || window._polyvoreHost;
		if (b) {
			var d = f.match(/(\:\/\/)(.*?)(\/.*)/);
			f = d[1] + b + d[3]
		}
		l = g + f + k
	}
	return normalizeURL(l)
}

function getHostModePrefixes() {
	return ["live", "www", "testenv"]
}

function buildVanityURL(c, h, f) {
	var b = Conf.getCookieDomain();
	h = h || "";
	c = c.toLowerCase();
	c = c.replace(/![a-z0-9\-]/, "");
	var d = c + b;
	if (Conf.getDevName()) {
		d = c + "." + Conf.getDevName() + b
	}
	var g = Conf.getModeName();
	if (getHostModePrefixes().contains(g)) {
		d = g + "." + d
	}
	var a = buildAbsURL("/" + h, f, d);
	return a
}

function isAbsURL(a) {
	return (/^https?:\/\//).test(a)
}

function getProtocol() {
	if (!window._protocol) {
		var a = window.location.href;
		window._protocol = a.match(/^(\w+):/)[1]
	}
	return window._protocol
}

function parseUri(f) {
	var d = parseUri.options, a = d.parser[d.strictMode ? "strict" : "loose"].exec(f), c = {}, b = 14;
	while (b--) {
		c[d.key[b]] = a[b] || ""
	}
	c[d.q.name] = {};
	c[d.key[12]].replace(d.q.parser, function(h, g, l) {
		if (g) {
			var j = l;
			try {
				if (l) {
					j = decodeURIComponent(l.replace(/\+/g, "%20"))
				}
			} catch(k) {
			}
			if (c[d.q.name][g]) {
				if ( typeof (c[d.q.name][g]) == "string") {
					c[d.q.name][g] = [c[d.q.name][g]]
				}
				c[d.q.name][g].push(j)
			} else {
				c[d.q.name][g] = j
			}
		}
	});
	return c
}
parseUri.options = {
	strictMode : false,
	key : ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
	q : {
		name : "queryKey",
		parser : /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser : {
		strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};
function reconstructUri(d) {
	var f = d.authority;
	if (d.port && f) {
		f = f.replace(/:\d+$/, "")
	}
	var c = [d.protocol, "://", f, d.port ? ":" + d.port : "", d.path];
	if (d.queryKey) {
		var b = hashToQueryArray(d.queryKey);
		if (b.length) {
			c.push("?");
			for (var a = 0; a < b.length; ++a) {
				if (a) {
					c.push("&")
				}
				c.push(b[a])
			}
		}
	}
	if (d.anchor) {
		c.push("#", d.anchor)
	}
	return c.join("")
}

function parsePolyvoreURL(a) {
	var b = parseUri(a);
	var l = b.path.split("/");
	l.shift();
	var c = l.pop();
	var h = {};
	if (c.match(/(?:set|thing|buddy)\.\d+/)) {
		var j = c.split(".");
		c = "img-" + j.shift();
		var k;
		if (c == "img-set") {
			if (j.length > 3) {
				k = ["cid", "spec_uuid", "size", ".out"]
			} else {
				return {
					action : c,
					args : {},
					isStatic : true
				}
			}
		} else {
			if (c == "img-thing") {
				if (j.length > 3) {
					k = ["tid", "size", "mask", ".out"]
				} else {
					k = ["tid", "size", ".out"]
				}
			} else {
				if (c == "img-buddy") {
					k = ["id", "size", ".out"]
				}
			}
		}
		for (var d = 0; d < k.length; d++) {
			h[k[d]] = j[d]
		}
		if (c == "img-thing" && h.mask) {
			h.mask = 1
		}
	} else {
		if (l.length > 1 && c.match(/^.*\.jpg$/i)) {
			return {
				action : l.pop(),
				args : {},
				isStatic : true
			}
		} else {
			h = b.queryKey
		}
		if (c == "img-set") {
			h.spec_uuid = h.id;
			delete h.id
		}
	}
	if (!c && isPolyvoreURL(a)) {
		var g = b.host.replace(/\.polyvore\.(net|com)$/, "");
		var f = g.split(".").filter(function(m) {
			return !["www", Conf.getModeName(), Conf.getDevName()].contains(m)
		});
		if (f && f.length >= 1) {
			c = "profile";
			h.name = f[0]
		} else {
			c = "splash"
		}
	}
	return {
		action : c,
		args : h
	}
}

function cleanURL(b) {
	if (!b) {
		return null
	}
	b = b.trim();
	if (!b.match(/^http:\/\//)) {
		b = b.replace(/^\w+:\/\//, "");
		b = "http://" + b
	}
	var a = parseUri(b);
	delete a.port;
	return reconstructUri(a)
}

function fullyQualified(a) {
	a = a || "./";
	if (!/^(([a-z]+):\/\/)/.test(a)) {
		var b = document.createElement("div");
		a = a.replace('"', "%22");
		b.innerHTML = '<a href="' + a + '" style="display:none">x</a>';
		a = b.firstChild.href
	}
	return a
}

function isPolyvoreURL(a) {
	if (!window.POLVYORE_URL) {
		window.POLYVORE_URL = new RegExp("^https?://([^/?]+\\.)?" + Conf.getCookieDomain().replace(/^\./, "").replace(".", "\\."))
	}
	return a.match(POLYVORE_URL) ? true : false
}

function isHTMLMobile() {
	var a = Cookie.get("m");
	return (a == "1" || a == 1)
}

function hashToQueryArray(b) {
	var h = [];
	var c = [];
	var f;
	for (f in b) {
		if (b.hasOwnProperty(f)) {
			h.push(f)
		}
	}
	h = h.sort();
	var a = function(k, l) {
		l.forEach(function(m) {
			c.push(k + "=" + encodeURIComponent(m))
		})
	};
	for (var d = 0; d < h.length; ++d) {
		f = h[d];
		var j = b[f];
		var g = typeof (j);
		if (j !== undefined && g != "function" && j !== null && j !== "") {
			if (g == "object" && j.constructor == Array.prototype.constructor) {
				a(f, j)
			} else {
				c.push(f + "=" + encodeURIComponent(j))
			}
		}
	}
	return c
}

function replaceURL(b, a) {
	if (!window.history.replaceState) {
		return
	}
	b = b || {};
	a = a || [];
	a.forEach(function(f) {
		b[f] = null
	});
	var c = parseUri(window.location);
	var d = false;
	forEachKey(b, function(g, f) {
		if (f === null) {
			if ( g in c.queryKey) {
				delete c.queryKey[g];
				d = true
			}
		} else {
			if (c.queryKey[g] !== f) {
				c.queryKey[g] = f;
				d = true
			}
		}
	});
	if (d) {
		history.replaceState(null, null, reconstructUri(c))
	}
}
Form.TYPES = {
	header : function(a) {
		a.nodes = [createNode("h3", null, null, a.value)]
	},
	html : function(a) {
		a.nodes = [a.value]
	},
	spacer : function(a) {
		a.nodes = [createNode("hr")]
	},
	hidden : function(a) {
		a.inputNode = createNode("input", {
			type : "hidden",
			id : a.id,
			name : a.name,
			value : a.value
		})
	},
	text : function(a) {
		a.focusable = a.focusable === undefined ? true : a.focusable;
		a.inputNode = createNode("input", {
			type : "text",
			id : a.id,
			name : a.name,
			value : a.value
		});
		if (a.maxlength && (a.htmllevel || "none") === "none") {
			setNode(a.inputNode, {
				maxlength : a.maxlength
			})
		}
		if (a.readonly && a.value) {
			setNode(a.inputNode, {
				readonly : true
			})
		}
		if (a.tabIndex) {
			a.inputNode.tabIndex = a.tabIndex
		}
		if (a.autocomplete) {
			var d = a.autocomplete.data;
			if (!d && a.autocomplete.action) {
				d = new AjaxDataSource(a.autocomplete.action, {
					data : a.autocomplete.params || {}
				}, {
					hideProgress : true
				})
			}
			var c = new AutoComplete(a.inputNode, d, a.autocomplete.options)
		}
		if (a.lowercase) {
			var b = function() {
				var f = a.inputNode.value.toLowerCase();
				if (f !== a.inputNode.value) {
					a.inputNode.value = f;
					Event.trigger(a.inputNode, "change")
				}
			};
			Event.addListener(a.inputNode, "blur", b);
			Event.addListener(a.inputNode, "change", b)
		}
		a.nodes = [a.inputNode]
	},
	input_list : function(d) {
		var c = [];
		var h = d.inputs;
		for (var g = 0; g < h.length; g++) {
			var b = h[g];
			Form.TYPES[b.type](b);
			var f = ["type_input_list", b.className];
			if (b.required) {
				f.push("required_input")
			}
			addClass(b.nodes[0], f.join(" "));
			for (var a = 0; a < b.nodes.length; a++) {
				c.push(b.nodes[a])
			}
		}
		d.nodes = c
	},
	integer : function(a) {
		Form.TYPES.text(a)
	},
	url : function(a) {
		Form.TYPES.text(a)
	},
	price : function(a) {
		Form.TYPES.text(a)
	},
	email : function(a) {
		Form.TYPES.text(a)
	},
	date : function(a) {
		Form.TYPES.text(a)
	},
	dateSelect : function(b) {
		function f(n, m, l, j) {
			var h = [];
			for (var k = n; k <= m; k++) {
				h.push(createNode("option", {
					value : k
				}, null, k))
			}
			if (j) {
				h = h.reverse()
			}
			h.unshift(createNode("option", {
				value : "",
				selected : true
			}, null, l));
			return h
		}
		b.inputNode = createNode("input", {
			type : "hidden",
			name : b.name
		});
		var a = createNode("select", null, null, f(1, 12, loc("Month")));
		var c = createNode("select", null, null, f(1, 31, loc("Day")));
		var d = createNode("select", null, null, f(1900, new Date().getFullYear(), loc("Year"), true));
		function g() {
			b.inputNode.value = "";
			var m = parseInt(d.value, 10);
			var o = parseInt(a.value, 10);
			var j = parseInt(c.value, 10);
			if (m && o) {
				var h = Date.getDaysInMonth(m, o - 1);
				var l = toArray(c.childNodes);
				l.forEach(function(p) {
					var q = parseInt(p.value, 10);
					if (q) {
						if (q <= h) {
							setNode(p, {
								disabled : undefined
							})
						} else {
							setNode(p, {
								disabled : true
							});
							if (j === q) {
								j = 0;
								c.value = ""
							}
						}
					}
				})
			} else {
				toArray(c.childNodes).forEach(function(p) {
					setNode(p, {
						disabled : undefined
					})
				})
			}
			if (m && o && j) {
				var k = new Date(m, o - 1, j);
				if (k && k.getFullYear() === m && k.getMonth() === o - 1 && k.getDate() === j) {
					var n = function(q, p, r) {
						q = q + "";
						while (q.length < p) {
							q = r + q
						}
						return q
					};
					m = n(m, 4, "0");
					o = n(o, 2, "0");
					j = n(j, 2, "0");
					b.inputNode.value = [m, o, j].join("-");
					Event.trigger(b.inputNode, "change")
				}
			}
		}
		Event.addListener(a, "change", g);
		Event.addListener(c, "change", g);
		Event.addListener(d, "change", g);
		b.nodes = [b.inputNode, createNode("div", null, null, [a, "&nbsp;", c, "&nbsp;", d])]
	},
	textarea : function(a) {
		a.focusable = a.focusable === undefined ? true : a.focusable;
		a.inputNode = createNode("textarea", {
			id : a.id,
			name : a.name,
			rows : a.rows || 5
		}, null, a.value);
		if (a.maxlength && (a.htmllevel || "none") === "none") {
			setNode(a.inputNode, {
				maxlength : a.maxlength
			})
		}
		if (a.trackKs) {
			var b = new TrackKeyStroke(a.inputNode)
		}
		if (a.highlight) {
			HighlightingTextarea.init(a.inputNode, {
				msg : a.highlight_emptymsg,
				maxHeight : a.highlight_fixedheight ? 0 : null
			})
		}
		a.nodes = [a.inputNode]
	},
	select : function(a) {
		if (a.readonly && a.value) {
			a.inputNode = createNode("input", {
				type : "text",
				id : a.id,
				name : a.name,
				value : a.value,
				readonly : true
			})
		} else {
			a.inputNode = createNode("select", {
				name : a.name,
				id : a.id
			});
			if (a.options) {
				a.options.forEach(function(b) {
					a.inputNode.appendChild(createNode("option", {
						value : b.value,
						selected : (b.value == a.value ? "selected" : null)
					}, null, b.label))
				})
			}
		}
		a.nodes = [a.inputNode]
	},
	combo : function(a) {
		a.inputNode = createNode("input", {
			type : "hidden",
			id : a.id,
			name : a.name,
			value : a.value
		});
		var b = new ComboDropDown({
			item2display : function(d) {
				for (var c = 0; c < a.options.length; c++) {
					if (d == a.options[c].value) {
						return a.options[c].label
					}
				}
				return d
			},
			display2item : function(d) {
				for (var c = 0; c < a.options.length; c++) {
					if (d == a.options[c].label) {
						return a.options[c].value
					}
				}
				return d
			},
			items : a.options.map(function(c) {
				return c.value
			}),
			textWidth : a.textWidth || 200,
			listHeight : a.listHeight || 400
		});
		Event.addListener(b, "change", function(c) {
			a.inputNode.value = c
		});
		if (a.value === undefined) {
			b.select(a.options[0].value)
		} else {
			b.select(a.value)
		}
		a.nodes = [a.inputNode, b.getNode()]
	},
	username : function(b) {
		Form.TYPES.text(b);
		var c = createNode("span", {
			className : "feedback hidden"
		});
		var a = createNode("div", {
			className : "suggestions"
		});
		Form.instrumentUsernameInput(b, c, a);
		b.nodes = [b.inputNode, c, a]
	},
	password : function(a) {
		a.focusable = a.focusable === undefined ? true : a.focusable;
		a.inputNode = createNode("input", {
			type : "password",
			id : a.id,
			name : a.name,
			value : a.value
		});
		a.nodes = [a.inputNode]
	},
	checkbox : function(b) {
		b.inputNode = createNode("input", {
			type : "checkbox",
			id : b.id,
			name : b.name,
			value : b.value || 1,
			checked : b.checked
		});
		var a = b.cblabel || b.value;
		var c = createNode("label", {
			"for" : b.id
		}, null, a);
		b.nodes = [b.inputNode, c]
	},
	checkbox_list : function(a) {
		a._value = a.value || [];
		a.inputNode = createNode("input", {
			type : "hidden",
			id : a.id,
			name : a.name,
			value : JSON2.stringify(a._value)
		});
		var b = createNode("ul", {
			className : "options"
		});
		a.options.forEach(function(d) {
			var c = createNode("input", {
				id : d.id || Dom.uniqueId(a.name),
				type : "checkbox",
				value : d.value,
				checked : a._value.contains(d.value)
			});
			Event.addListener(c, "change", function() {
				if (c.checked) {
					a._value.push(c.value)
				} else {
					a._value.remove(c.value)
				}
				a.inputNode.value = JSON2.stringify(a._value);
				Event.trigger(a.inputNode, "change")
			});
			b.appendChild(createNode("li", null, null, [c, createNode("label", {
				"for" : c.id
			}, null, d.label)]))
		});
		a.nodes = [a.inputNode, b]
	},
	radio_select : function(a) {
		a.inputNode = createNode("input", {
			type : "hidden",
			id : a.id,
			name : a.name,
			value : a.value
		});
		var d = {};
		var c = {};
		var b = createNode("div", {
			className : "box"
		}, null, [createNode("div", {
			className : "hd"
		}, null, createNode("h3", null, null, a.hd_text)), createNode("ul", {
			className : "select"
		}, null, a.options.map(function(g) {
			var f = g.selected || a.value == g.value;
			var j = createNode("a", null, null, ( f ? loc("Selected") : loc("Choose")));
			var h = createNode("li", {
				className : ( f ? loc("selected") : "")
			}, null, createNode("ul", null, null, [createNode("li", null, null, createSprite(g.sprite)), createNode("li", null, null, g.label), createNode("li", {
				className : "right"
			}, null, j)]));
			d[g.value] = h;
			c[g.value] = j;
			Event.addListener(h, "click", function() {
				if (a.inputNode.value != g.value) {
					removeClass(d[a.inputNode.value], "selected");
					addClass(d[g.value], "selected");
					c[a.inputNode.value].innerHTML = loc("Choose");
					c[g.value].innerHTML = loc("Selected");
					a.inputNode.value = g.value;
					Event.trigger(a.inputNode, "change")
				}
			});
			return h
		}))]);
		a.nodes = [a.inputNode, b]
	},
	radios : function(a) {
		a.inputNode = createNode("input", {
			type : "hidden",
			id : a.id,
			name : a.name,
			value : a.value
		});
		a.layoutRenderer = a.layoutRenderer || UI.layoutColumns;
		var b = createNode("div", {
			className : "options"
		}, null, [a.layoutRenderer(a.options, {
			columns : a.columns,
			renderer : function(d, c) {
				var f = createNode("input", {
					id : Dom.uniqueId(a.name),
					type : "radio",
					name : a.name + "_radio",
					value : d.value,
					checked : d.value == a.value
				});
				Event.addListener(f, "change", function() {
					if (f.checked) {
						a.inputNode.value = f.value
					}
				});
				return [f, createNode("label", {
					"for" : f.id
				}, null, d.label)]
			}
		})]);
		a.nodes = [a.inputNode, b]
	},
	quick_share : function(b) {
		b._value = {
			enabled : b.checked,
			services : (b.services || []).map(function(h) {
				return h.service
			})
		};
		mergeObject(b._value, b.value || {});
		b.inputNode = createNode("input", {
			type : "hidden",
			name : b.name,
			id : b.id,
			value : JSON2.stringify(b._value)
		});
		var f = createNode("div");
		var d = f.appendChild(createNode("input", {
			type : "checkbox",
			name : Dom.uniqueId(b.name),
			id : Dom.uniqueId(b.id),
			value : true,
			checked : b._value.enabled
		}));
		var c = f.appendChild(createNode("label", {
			"for" : d.id
		}, null, loc("Quick share with friends")));
		Event.addListener(d, "change", function() {
			b._value.enabled = d.checked;
			if (b._value.enabled) {
				show(a)
			} else {
				hide(a)
			}
			b.inputNode.value = JSON2.stringify(b._value);
			Event.trigger(b.inputNode, "change")
		});
		var g = createNode("input", {
			type : "hidden"
		});
		Event.addListener(g, "change", function() {
			b._value.services = g.value.split(",").filter(function(h) {
				return h
			});
			b.inputNode.value = JSON2.stringify(b._value);
			Event.trigger(b.inputNode, "change")
		});
		var a = Share.createAccountPicker({
			accounts : b.services,
			input : g,
			inDialog : b.inDialog,
			inParent : b.inParent,
			id : "quick_share"
		});
		b.nodes = [b.inputNode, f, g, a]
	},
	extsvc_connect : function(j) {
		var d = j.facebook === undefined ? true : j.facebook;
		var c = j.twitter === undefined ? true : j.twitter;
		var l = j.signin === undefined ? false : j.signin;
		var f = j.done === undefined ? window.location.href : j.done;
		var g = j.page === undefined ? window.polyvore_page_name : j.page;
		var a = j.src === undefined ? "unknown" : j.src;
		var h = j.permissions === undefined ? Facebook.connectPermissions().join(",") : j.permissions;
		j.nodes = [];
		if (d) {
			var b = createNode("a", {
				href : "#",
				className : "btn btn_action facebook_connect"
			}, null, loc("Connect with Facebook"));
			j.nodes.push(b);
			Event.addListener(b, "click", function(m) {
				Facebook.login({
					doRedirect : true,
					done : f,
					permissions : h,
					data : {
						page : g,
						src : a
					}
				});
				return Event.stop(m)
			})
		}
		if (c) {
			var k = createNode("a", {
				href : "#",
				className : "btn btn_action twitter_connect"
			}, null, loc("Connect with Twitter"));
			j.nodes.push(k);
			Event.addListener(k, "click", function(m) {
				Twitter.login({
					doRedirect : true,
					signin : l,
					data : {
						page : g,
						src : a
					}
				});
				return Event.stop(m)
			})
		}
	},
	buttons : function(a) {
		var b = a.buttons.map(function(c) {
			c.className = c.className || "";
			var d;
			switch(c.type) {
				case"submit":
					d = createNode("input", {
						type : c.type,
						id : c.id,
						className : c.className || "btn btn_action",
						name : c.name,
						value : c.label,
						disabled : c.disabled
					});
					break;
				case"cancel":
					d = createNode("span", {
						id : c.id,
						className : c.className || "clickable"
					}, null, c.label);
					break;
				case"link":
					d = createNode("a", {
						id : c.id,
						className : c.className,
						href : c.url
					}, null, c.label);
					break
			}
			if (c.onClick) {
				Event.addListener(d, "click", c.onClick)
			}
			if (c.tabIndex) {
				d.tabIndex = c.tabIndex
			}
			return d
		});
		a.nodes = [createNode("ul", {
			className : "actions horizontal"
		}, null, b.map(function(c) {
			return createNode("li", null, null, c)
		}))]
	},
	set_style_picker : function(b) {
		var c = b.value;
		var a = [createLabel({
			className : "embed_radio embed_details",
			"for" : b.id + "embed_details"
		}, null, createCheckboxOrRadio("radio", {
			name : b.name,
			id : b.id + "embed_details",
			value : "details",
			checked : c == "details"
		})), createLabel({
			className : "embed_radio embed_grid",
			"for" : b.id + "embed_grid"
		}, null, createCheckboxOrRadio("radio", {
			name : b.name,
			id : b.id + "embed_grid",
			value : "grid",
			checked : c == "grid"
		})), createLabel({
			className : "embed_radio embed_list",
			"for" : b.id + "embed_list"
		}, null, createCheckboxOrRadio("radio", {
			name : b.name,
			id : b.id + "embed_list",
			value : "list",
			checked : c == "list"
		})), createLabel({
			className : "embed_radio embed_basic",
			"for" : b.id + "embed_basic"
		}, null, createCheckboxOrRadio("radio", {
			name : b.name,
			id : b.id + "embed_basic",
			value : "basic",
			checked : c == "basic" || c === null
		}))];
		b.inputNode = createNode("input", {
			type : "hidden",
			name : b.name + "hidden",
			id : b.id + "hidden",
			value : b.value
		});
		var d = createNode("div", {
			className : "embed_type",
			id : b.id
		}, null, a);
		b.nodes = [b.inputNode, d]
	},
	lookbook_style_picker : function(b) {
		var a = b.value;
		var d = [createLabel({
			"for" : b.id + "embed_slideshow"
		}, null, [createCheckboxOrRadio("radio", {
			name : b.name,
			id : b.id + "embed_slideshow",
			value : "slideshow",
			checked : a == "slideshow"
		}), createNode("span", {
			className : "embed_radio embed_slideshow"
		}, null, loc("Slideshow"))]), createLabel({
			"for" : b.id + "embed_carousel"
		}, null, [createCheckboxOrRadio("radio", {
			name : b.name,
			id : b.id + "embed_carousel",
			value : "carousel",
			checked : a == "carousel"
		}), createNode("span", {
			className : "embed_radio embed_carousel"
		}, null, loc("Carousel"))]), createLabel({
			"for" : b.id + "embed_grid"
		}, null, [createCheckboxOrRadio("radio", {
			name : b.name,
			id : b.id + "embed_grid",
			value : "grid",
			checked : a == "grid"
		}), createNode("span", {
			className : "embed_radio embed_lb_grid"
		}, null, loc("Image grid"))])];
		b.inputNode = createNode("input", {
			type : "hidden",
			name : b.name + "hidden",
			id : b.id + "hidden",
			value : b.value
		});
		var c = createNode("div", {
			className : "embed_lb_type",
			id : b.id
		}, null, d);
		b.nodes = [b.inputNode, c]
	},
	item_picker : function(b) {
		var c = createNode("div");
		var a = Share.createItemPicker(b.items, c, "", b.basedon_tid);
		b.nodes = [a.itemInput, c]
	},
	size_picker : function(b) {
		var d = createNode("div", {
			className : "selectoption"
		});
		var a = createInput("hidden", {
			value : b.value,
			name : b.name
		});
		var c = {
			sizes : ["l", "e", "x", "y"]
		};
		if (b.itemType === "collection") {
			c.showHeight = true;
			c.disableWidth = false;
			c.disableHeight = true;
			c.custom = {
				showWidth : true,
				showHeight : true,
				defaultValue : "c600x600"
			}
		} else {
			if (b.itemType === "lookbook") {
				c.disableWidth = false;
				c.disableHeight = true;
				c.custom = {
					showWidth : true,
					showHeight : false,
					defaultValue : "c600x600"
				}
			}
		}
		c.aspectRatio = b.aspectRatio;
		c.makeSquare = b.makeSquare;
		SizePicker.add(d, a, c);
		b.nodes = [a, d]
	}
};
Form.DEFAULTS = {
	integer : function(a) {
		a.validators.push(Validate.integer)
	},
	url : function(a) {
		a.validators.push(Validate.url)
	},
	price : function(a) {
		a.validators.push(Validate.price)
	},
	email : function(a) {
		a.minlength = 5;
		a.maxlength = 255;
		a.lowercase = true;
		a.validators.push(Validate.email)
	},
	username : function(a) {
		a.minlength = 4;
		a.maxlength = 32;
		a.lowercase = true;
		a.validators.push(Validate.userName)
	}
};
Form.createInputNode = function(a) {
	a.rowId = a.row_id;
	a.errorId = a.error_id;
	if (a.input_id) {
		a.inputNode = $(a.input_id);
		if (!a.inputNode) {
			throw "input node not found: " + a.input_id
		}
	}
	if (a.error_id) {
		a.errorNode = $(a.error_id);
		if (!a.errorNode) {
			throw "error node not found: " + a.error_id
		}
	}
	a.validators = a.js_validators.map(function(c) {
		if ( typeof (c) === "function") {
			return c
		}
		var b = c.replace(/^Validate\./, "");
		var d = Validate[b];
		if (!d) {
			throw "validator not supported: " + c
		}
		return d
	});
	if (a.type == "username") {
		Form.instrumentUsernameInput(a, $(a.feedback_id), $(a.suggestions_id))
	}
};
Form.attachToHTMLForm = function(a) {
	Event.addSingleUseListener(document, "modifiable", function() {
		var c = $(a.id);
		if (!c) {
			throw "form not found: " + a.id
		}
		a.inputs.forEach(function(d) {
			if (d.type == "input_list" && d.inputs) {
				d.inputs.forEach(function(f) {
					Form.createInputNode(f)
				})
			} else {
				Form.createInputNode(d)
			}
		});
		var b = new Form(a);
		b._formNode = c;
		b.addListeners();
		c._form = b
	})
};
Form.instrumentUsernameInput = function(b, d, a) {
	var f = b.inputNode;
	var c = new CheckAvailability(f, d, a);
	b.validators.push(Validate.userNameAvailable(c))
};
Form.fromNode = function(a) {
	if (!a) {
		return null
	}
	if (a.form) {
		a = a.form
	}
	if (a._form && a._form instanceof Form) {
		return a._form
	}
	return null
};
function Form(a) {
	a = a || {};
	this._id = a.id || Dom.uniqueId("form");
	this._className = a.className || "";
	this._action = a.action || "";
	this._method = a.method || "POST";
	this._inputs = a.inputs || [];
	this._confirm = a.confirm;
	this._allinputs = [];
	var b = a.data || {};
	if (a.onSubmit) {
		Event.addListener(this, "submit", a.onSubmit)
	}
	this._inputs.forEach(function(c) {
		c.validators = c.validators || [];
		var d = Form.DEFAULTS[c.type];
		if (d) {
			d(c)
		}
		c.id = c.id || Dom.uniqueId(this._id + "_input");
		c.rowId = c.rowId || Dom.uniqueId(this._id + "_row");
		c.errorId = c.errorId || Dom.uniqueId(this._id + "_error");
		c.value = b[c.name] || c.value;
		c.checked = b[c.name] || c.checked || c.defaultChecked || false;
		if (c.maxlength) {
			c.validators.unshift(Validate.maxlength)
		}
		if (c.minlength) {
			c.validators.unshift(Validate.minlength)
		}
		if (c.required) {
			c.validators.unshift(Validate.required)
		}
	}, this);
	this._inputs.forEach(function(c) {
		if (c.type == "input_list" && c.inputs) {
			for (var d = 0; d < c.inputs.length; d++) {
				var f = c.inputs[d];
				f.validators = f.validators || [];
				var g = Form.DEFAULTS[f.type];
				if (g) {
					g(f)
				}
				f.id = f.id || Dom.uniqueId(this._id + "_input");
				f.rowId = f.rowId || Dom.uniqueId(this._id + "_row");
				f.errorId = c.errorId;
				f.value = f.value;
				f.checked = f.checked || f.defaultChecked || false;
				if (f.maxlength) {
					f.validators.unshift(Validate.maxlength)
				}
				if (f.minlength) {
					f.validators.unshift(Validate.minlength)
				}
				if (f.required) {
					f.validators.unshift(Validate.required)
				}
				this._allinputs.push(f)
			}
		} else {
			this._allinputs.push(c)
		}
	}, this)
}
Form.prototype.requiresXsrf = function() {
	return Auth.isLoggedIn() && this._method === "POST" && (!isAbsURL(this._action) || isPolyvoreURL(this._action))
};
Form.prototype.getNode = function() {
	if (this._formNode) {
		return this._formNode
	}
	var b = createNode("form", {
		enctype : "multipart/form-data",
		id : this._id,
		action : this._action,
		method : this._method,
		className : "newform " + this._className
	});
	this._formNode = b;
	if (this.requiresXsrf()) {
		b.appendChild(createNode("input", {
			type : "hidden",
			name : ".xsrf",
			value : Auth.getToken()
		}))
	}
	var a = b.appendChild(createNode("div", {
		className : "hidden_inputs"
	}));
	var c = false;
	this._inputs.forEach(function(f) {
		if (!Form.TYPES[f.type]) {
			throw "invalie input type: " + f.type
		}
		Form.TYPES[f.type](f);
		if (f.type === "hidden") {
			a.appendChild(f.inputNode);
			return
		}
		var h = ["input", "type_" + f.type, f.className];
		if (f.required) {
			h.push("required_input")
		}
		var k = b.appendChild(createNode("div", {
			className : h.join(" "),
			id : f.rowId
		}));
		if (f.label) {
			if (f.inputNode) {
				k.appendChild(createNode("label", {
					"for" : f.inputNode.id
				}, null, f.label))
			} else {
				k.appendChild(createNode("div", {
					className : "label"
				}, null, f.label))
			}
		}
		k.appendChild(createNode("div", {
			className : "value"
		}, null, f.nodes));
		if (f.hint) {
			k.appendChild(createNode("div", {
				className : "meta input_hint"
			}, null, f.hint))
		}
		if (f.inputNode) {
			f.errorNode = k.appendChild(createNode("ul", {
				id : f.errorId,
				className : "error"
			}))
		} else {
			if (f.type == "input_list" && f.inputs) {
				for (var g = 0; g < f.inputs.length; g++) {
					f.inputs[g].errorNode = k.appendChild(createNode("ul", {
						id : f.errorId,
						className : "error"
					}))
				}
			}
		}
		if (f.placeholder) {
			InputHint.add(f.inputNode, f.placeholder, this._formNode)
		} else {
			if (f.type == "input_list" && f.inputs) {
				for (var d = 0; d < f.inputs.length; d++) {
					var j = f.inputs[d];
					if (j.placeholder) {
						InputHint.add(j.inputNode, j.placeholder, this._formNode)
					}
				}
			}
		}
	}, this);
	this.addListeners();
	return this._formNode
};
Form.prototype.addListeners = function() {
	if (this._listenersAdded) {
		return
	}
	this._listenersAdded = true;
	Event.addListener(this._formNode, "submit", function(c) {
		return this.submit(c)
	}, this);
	if (this._confirm) {
		Event.addListener(this._formNode, "click", function(c) {
			if (!c) {
				return
			}
			var d = Event.getSource(c);
			if (d.tagName == "INPUT" && d.type == "submit") {
				this._submitButton = d
			}
			return true
		}, this)
	}
	this._validationQueueEnabled = false;
	this._validationQueue = [];
	var b = Event.wrapper(function() {
		return Event.addListener(document, "mousedown", function() {
			this._validationQueueEnabled = true;
			Event.addSingleUseListener(document, "mouseup", function() {
				this._validationQueueEnabled = false;
				this.triggerQueuedValidation()
			}, this)
		}, this)
	}, this);
	var a = false;
	this._allinputs.forEach(function(c) {
		if (c.inputNode) {
			if (c.onChange) {
				Event.addListener(c.inputNode, "change", c.onChange, c.inputNode)
			}
			Event.addListener(c.inputNode, "focus", function() {
				var g = b();
				Event.addSingleUseListener(c.inputNode, "blur", function() {
					g.clean()
				})
			});
			if (!a && c.focusable && c.inputNode.focus && !c.value) {
				yield(function() {
					c.inputNode.focus()
				});
				a = true
			}
			var d = function() {
				yield(function() {
					this.validateInput(c, true)
				}, this)
			};
			var f = function() {
				yield(function() {
					this.validateInput(c, false)
				}, this)
			};
			Event.addListener(c.inputNode, "blur", f, this);
			Event.addListener(c.inputNode, "change", f, this);
			Event.addListener(c.inputNode, "keypress", d, this)
		}
	}, this)
};
Form.prototype.validateInputNode = function(c, b) {
	var a;
	this._allinputs.forEach(function(d) {
		if (!a && d.inputNode == c) {
			a = d
		}
	});
	if (!a) {
		return false
	}
	return this.validateInput(a, b)
};
Form.prototype.validateInput = function(c, b) {
	if (this._validationQueueEnabled) {
		this._validationQueue.push(arguments);
		return false
	}
	c.isValid = true;
	var h = [];
	var g = Form.getInputValue(c);
	if (g !== undefined) {
		for (var f = 0; f < c.validators.length; f++) {
			var d = c.validators[f];
			var a = d(g, c, b);
			c.isValid = c.isValid && a.valid;
			if (!a.valid) {
				if (a.msg) {
					h.push(a.msg)
				}
				break
			}
		}
	}
	if (c.errorNode) {
		setNode(c.errorNode, null, null, h.map(function(j) {
			return createNode("li", null, null, j)
		}))
	}
	return c.isValid
};
Form.prototype.triggerQueuedValidation = function() {
	var b = true;
	while (this._validationQueue.length > 0) {
		var a = this._validationQueue.pop();
		b = b && Form.prototype.validateInput.apply(this, a)
	}
	return b
};
Form.prototype.validate = function() {
	var a = true;
	this._allinputs.forEach(function(b) {
		a = this.validateInput(b) && a
	}, this);
	return a
};
Form.getInputValue = function(a) {
	if (a._value !== undefined) {
		return cloneObject(a._value, true)
	}
	if (a.inputNode) {
		return inputValue(a.inputNode)
	}
};
Form.prototype.getData = function() {
	var a = {};
	this._allinputs.forEach(function(b) {
		if (b.name) {
			a[b.name] = Form.getInputValue(b)
		}
	});
	return a
};
Form.prototype.submit = function(g) {
	if (!this.validate()) {
		Event.trigger(this, "error");
		return g ? Event.stop(g) : false
	} else {
		if (this._confirm) {
			var f = this._formNode;
			var b = this._confirm.message;
			if ( typeof (b) == "function") {
				b = b(f)
			}
			var d = this._submitButton;
			if (!d) {
				for (var c = 0; c < f.length; c++) {
					var a = f[c];
					if (a.tagName == "INPUT" && a.type == "submit") {
						d = a;
						break
					}
				}
			}
			ModalDialog.confirm({
				title : b,
				okLabel : this._confirm.okLabel,
				onOk : Event.wrapper(function() {
					if (d) {
						f.appendChild(createNode("input", {
							type : "hidden",
							name : d.name,
							value : d.value
						}))
					}
					f.submit();
					Event.trigger(this, "submit", g)
				}, this)
			});
			return g ? Event.stop(g) : false
		}
		Event.trigger(this, "submit", g)
	}
	return true
};
Form.prototype.clean = function() {
	Event.release(this);
	purge(this._formNode, true)
};
function createForm(d) {
	d.id = d.id || Dom.uniqueId("form");
	var c = createNode("form", {
		id : d.id,
		enctype : "multipart/form-data"
	});
	if (d.action) {
		c.action = d.action
	}
	if (d.method) {
		c.method = d.method
	}
	var f = d.onSubmit ? d.onSubmit : Event.stop;
	Event.addListener(c, "submit", f);
	var b = createFormBody(c, d);
	var a = createNode("div", {
		className : "fieldset stdform"
	});
	c.appendChild(a);
	a.appendChild(b);
	return c
}

function createFormBody(a, l) {
	var g = l.inputs;
	var d = l.data;
	var c = l.noLabel;
	var j = l.id || a.getAttribute("id");
	if (d) {
		g.forEach(function(m) {
			if (!m || !m.name) {
				return
			}
			if (m.type == "twitter") {
				m.checked = d.twitter_post ? true : null;
				m.msg = d.twitter_msg;
				return
			}
			if (d[m.name] === undefined) {
				m.value = m.value || ""
			} else {
				if (m.type == "checkbox") {
					m.checked = d[m.name] ? true : false
				} else {
					m.value = d[m.name]
				}
			}
			if (!m.options || (d[m.name] && !d[m.name].contains)) {
				return
			}
			if (m.type == "checkboxes") {
				m.options.forEach(function(n) {
					n.checked = (d[m.name] && d[m.name].contains(n.value)) ? true : null
				})
			}
		})
	}
	var k = createNode("table", {
		cellspacing : 0,
		cellpadding : 0
	});
	var f = createNode("tbody");
	k.appendChild(f);
	var h = createNode("div", null, null, k);
	hide(h);
	document.body.appendChild(h);
	var b = function(m) {
		if (m && m.type != "hidden") {
			Event.addListener(document, "modifiable", function() {
				yield(function() {
					m.focus()
				})
			});
			b = noop
		}
	};
	g.forEach(function(al) {
		if (!al) {
			return
		}
		if (!al.id) {
			al.id = "input" + getUID(al)
		}
		var ah = createNode("label", {
			"for" : al.id
		}, null, al.label);
		if (al.required) {
			ah.appendChild(createNode("span", {
				className : "required"
			}, null, "*"))
		}
		var G = {
			type : al.validate,
			minlength : al.minlength,
			maxlength : al.maxlength,
			htmllevel : al.htmllevel
		};
		if (Browser.isIE) {
			ah = createNode("span", null, null, ah);
			ah = createNode("span", null, null, ah.innerHTML)
		}
		var ad = al.list ? toList(al.value).join(", ") : (al.value || "");
		var A, p, ak, ab;
		var q = false;
		switch(al.type) {
			case"header":
				f.appendChild(createNode("tr", null, null, createNode("td", {
					colSpan : 2
				}, null, createNode("h5", null, null, al.value))));
				return;
			case"subheader":
				A = f.appendChild(createNode("tr"));
				A.appendChild(createNode("td", {
					className : "label"
				}, null, ""));
				A.appendChild(createNode("td", {
					className : "value"
				}, null, createNode("h4", null, null, al.value)));
				return;
			case"spacer":
				f.appendChild(createNode("tr", {
					className : al.rowClassName,
					id : al.rowId
				}, null, createNode("td", {
					colSpan : 2,
					className : "spacer"
				}, null, "&nbsp")));
				return;
			case"rofullspan":
				f.appendChild(createNode("tr", null, null, createNode("td", {
					colSpan : 2,
					className : "rofullspan"
				}, null, al.value)));
				return;
			case"rotext":
				p = createNode("span", {
					id : al.id,
					className : al.className
				}, null, al.value);
				break;
			case"roimg":
				p = createNode("img", {
					src : al.src,
					width : al.width,
					height : al.height
				});
				break;
			case"tip":
				A = f.appendChild(createNode("tr"));
				A.appendChild(createNode("td", {
					className : "label"
				}, null, ""));
				A.appendChild(createNode("td", {
					className : "value"
				}, null, createNode("span", {
					className : "tip"
				}, null, al.value)));
				return;
			case"file":
				p = createNode("input", {
					name : al.name,
					id : al.id,
					type : "file"
				});
				break;
			case"hidden":
				a.appendChild(createNode("input", {
					name : al.name,
					id : al.id,
					type : "hidden",
					value : ad
				}));
				return;
			case"user":
				p = UI.renderPerson(ad, {
					noLink : true
				});
				p.appendChild(createNode("input", {
					name : al.name,
					id : al.id,
					type : "hidden",
					value : ad.user_id
				}));
				break;
			case"username":
				var u = createNode("input", {
					name : al.name,
					id : al.id,
					type : "text",
					value : decodeHtml(ad)
				});
				b(u);
				var T = createNode("span");
				p = createNode("span", {
					className : "username_status"
				}, null, [u, T]);
				var U = new CheckAvailability(u, T, al.placeholder, al.available);
				G.type = G.type || "USERNAME";
				function Z() {
					u.value = u.value.toLowerCase()
				}
				Event.addListener(u, "blur", Z);
				Event.addListener(u, "change", Z);
				break;
			case"select":
				p = createNode("select", {
					name : al.name,
					id : al.id
				});
				for ( ak = 0; ak < al.options.length; ++ak) {
					ab = al.options[ak];
					var ar;
					var at;
					if ( typeof (ab) == "object") {
						ar = ab.value;
						at = ab.label
					} else {
						ar = ab;
						at = ab
					}
					p.appendChild(createNode("option", {
						value : ar,
						selected : (ar == ad ? "selected" : null)
					}, null, at))
				}
				break;
			case"text":
			case"url":
			case"price":
				var n = {
					name : al.name,
					id : al.id,
					type : "text",
					value : decodeHtml(ad)
				};
				if (al.maxlength && (al.htmllevel || "none") === "none") {
					n.maxlength = al.maxlength
				}
				p = createNode("input", n);
				b(p);
				if (!G.type) {
					switch(al.type) {
						case"text":
							G.type = "TEXT";
							break;
						case"price":
							G.type = "PRICE";
							break;
						case"url":
							G.type = "URL";
							break
					}
				}
				break;
			case"email":
				p = createNode("input", {
					name : al.name,
					id : al.id,
					type : "text",
					value : decodeHtml(ad),
					maxlength : 255
				});
				b(p);
				G.type = G.type || "EMAIL";
				break;
			case"textarea":
				p = createNode("textarea", {
					name : al.name,
					id : al.id,
					rows : al.rows || 5
				}, null, "");
				b(p);
				p.value = decodeHtml(ad);
				if (al.trackKs) {
					var J = new TrackKeyStroke(p)
				}
				if (al.highlight) {
					yield(function() {
						HighlightingTextarea.init(p, {
							msg : al.highlight_emptymsg,
							maxHeight : al.highlight_fixedheight ? 0 : null
						})
					})
				}
				q = true;
				G.type = G.type || "TEXTAREA";
				break;
			case"password":
				p = createNode("input", {
					name : al.name,
					id : al.id,
					type : "password",
					value : decodeHtml(ad)
				});
				b(p);
				if (al.verify) {
					var S = p;
					var r = createNode("span");
					p = createNode("span", null, null, [p, r]);
					delayed(function(){var v=new VerifyPassword($(al.verify),S,r)},0)()
				}
				break;
			case"copypaste":
				p = createNode("span", {
					className : "copypaste_holder"
				}, null, createCopyPaste(al, ad));
				break;
			case"checkbox":
				if (!al.checkboxes && al.name) {
					al.checkboxes = [{
						id : al.id,
						name : al.name,
						checked : al.checked,
						label : al.label,
						disabled : al.disabled,
						defaultChecked : al.defaultChecked
					}];
					al.id = null
				}
				al.id = al.id || Dom.uniqueId("checkbox");
				var D = [];
				al.checkboxes.forEach(function(v) {
					var au;
					if (v.checked !== undefined) {
						au = v.checked
					} else {
						if (d[v.name] !== undefined) {
							au = !!d[v.name]
						} else {
							au = v.defaultChecked
						}
					}
					var av = v.id || Dom.uniqueId("checkbox_" + v.name);
					D.push(createNode("span", {
						className : "checkbox"
					}, null, [createCheckboxOrRadio("checkbox", {
						id : av,
						name : v.name,
						value : 1,
						checked : au,
						disabled : v.disabled
					}), createLabel({
						"for" : av
					}, null, v.label)]))
				});
				var B = al.cols || 1;
				if (D.length > 1) {
					if (al.cols !== undefined) {
						var s = [];
						for (var ap = 0; ap < D.length + B - 1; ap += B) {
							var Y = [];
							for (var aj = 0; aj < B; aj++) {
								Y.push(createNode("td", null, null, (ap + aj < D.length) ? D[ap + aj] : ""))
							}
							s.push(createNode("tr", null, null, Y))
						}
						p = createNode("table", {
							cellspacing : 0,
							cellpadding : 0,
							className : "checkboxes"
						}, null, [createNode("tbody", null, null, s)])
					} else {
						p = createNode("div", {
							id : al.id,
							className : "checkboxes horizontal"
						}, null, D)
					}
				} else {
					p = D[0]
				}
				if (al.sidelabel) {
					ah = createNode("label", {
						"for" : al.id
					}, null, al.sidelabel)
				} else {
					ah = createNode("label")
				}
				q = ((D.length / B) > 1);
				break;
			case"checkboxes":
				p = createNode("div", {
					id : al.id,
					className : "checkboxes"
				});
				al.options.forEach(function(v) {
					v.id = v.id || Dom.uniqueId("checkbox_" + al.name);
					v.name = al.name;
					v.list = true;
					p.appendChild(createNode("div", {
						className : "checkbox"
					}, null, [createCheckboxOrRadio("checkbox", v), createLabel({
						"for" : v.id
					}, null, v.label)]))
				});
				break;
			case"radios":
				p = createNode("div", {
					id : al.id,
					className : "radios"
				});
				al.options.forEach(function(v) {
					v.id = Dom.uniqueId("radio_" + al.name);
					v.name = al.name;
					v.enabled = true;
					v.checked = ad && v.value && (v.value == ad);
					p.appendChild(createNode("div", {
						className : "radio"
					}, null, [createCheckboxOrRadio("radio", v), createLabel({
						"for" : v.id
					}, null, v.label)]))
				});
				break;
			case"buttons":
				var P = al.buttons.map(function(v) {
					var au = v.type;
					switch(au) {
						case"submit":
							p = createNode("input", {
								type : "submit",
								value : v.label,
								disabled : v.disabled,
								id : v.id
							});
							b(p);
							break;
						case"button":
							p = createNode("input", {
								type : "button",
								value : v.label,
								disabled : v.disabled,
								id : v.id
							});
							b(p);
							Event.addListener(p, "click", v.onClick);
							break;
						case"cancel":
							p = createNode("span", {
								className : "clickable cancel",
								id : v.id
							}, null, v.label);
							Event.addListener(p, "click", v.onClick);
							break;
						case"link":
							p = createNode("span", {
								className : "clickable",
								id : v.id
							}, null, v.label);
							Event.addListener(p, "click", v.onClick);
							break;
						default:
							throw "Invalid button type: " + au
					}
					if (v.className) {
						addClass(p, v.className)
					}
					return p
				});
				p = createNode("span", {
					className : "button_list"
				}, null, P);
				if (al.centered) {
					f.appendChild(createNode("tr", null, null, createNode("td", {
						colSpan : 2,
						align : "center"
					}, null, p)));
					return
				}
				break;
			case"agecheck":
				function aq(ay, ax, aw, au) {
					var v = [];
					for (var av = ay; av <= ax; av++) {
						v.push(createNode("option", {
							value : av,
							selected : av == aw ? true : null
						}, null, av))
					}
					if (au) {
						v = v.reverse()
					}
					v.unshift(createNode("option", {
						value : "",
						selected : "" === aw ? true : null
					}, null, "---"));
					return v
				}

				ad = ad || new Date();
				var ae = (new Date()).getFullYear();
				p = createNode("div", null, null, [createNode("select", {
					name : al.name + "_m"
				}, null, aq(1, 12, "")), "&nbsp;", createNode("select", {
					name : al.name + "_d"
				}, null, aq(1, 31, "")), "&nbsp;", createNode("select", {
					name : al.name + "_y"
				}, null, aq(1900, ae, "", true))]);
				break;
			case"fbconnect":
				p = createNode("div", {
					className : "btn btn_action btn_connect"
				}, null, loc("Connect with Facebook"));
				Event.addListener(p, "click", function() {
					ModalDialog.hide();
					Track.stat("inc", "facebook", ["connect_start", "signin"]);
					if (al.track) {
						var v = ["connect_start"].concat(al.track);
						Track.stat("inc", "regtests", v)
					}
					Facebook.login({
						doRedirect : false,
						onSuccess : al.onSuccess,
						permissions : al.permissions,
						track : al.track
					})
				});
				break;
			case"strip_selector":
				p = createNode("div");
				var N = p.appendChild(createNode("input", {
					type : "hidden",
					name : al.name,
					id : al.id
				}));
				StripSelector.show(al.renderer, {
					container : p,
					input : N,
					source : al.source,
					items : al.items,
					value : al.value
				});
				q = true;
				break;
			case"calendar":
				var ao;
				if (al.date) {
					ao = al.date
				} else {
					if (ad) {
						ao = new Date(ad)
					} else {
						ao = new Date()
					}
				}
				p = createNode("div", null, null, ao.toLocaleString());
				var L = a.appendChild(createNode("input", {
					name : al.name,
					id : al.id,
					type : "hidden",
					value : ao.getTime()
				}));
				var aa = new CalendarAndTime();
				aa.setDate(ao);
				Event.addListener(aa, "select", function(v) {
					aa.setDate(v);
					setNode(p, null, null, v.toLocaleString());
					L.value = v.getTime()
				});
				Event.addListener(p, "click", function(v) {
					aa.show(v)
				});
				break;
			case"set_style_picker":
				var C = ad;
				var m = [createLabel({
					className : "embed_radio embed_details",
					"for" : al.id + "embed_details"
				}, null, createCheckboxOrRadio("radio", {
					name : al.name,
					id : al.id + "embed_details",
					value : "details",
					checked : C == "details"
				})), createLabel({
					className : "embed_radio embed_grid",
					"for" : al.id + "embed_grid"
				}, null, createCheckboxOrRadio("radio", {
					name : al.name,
					id : al.id + "embed_grid",
					value : "grid",
					checked : C == "grid"
				})), createLabel({
					className : "embed_radio embed_list",
					"for" : al.id + "embed_list"
				}, null, createCheckboxOrRadio("radio", {
					name : al.name,
					id : al.id + "embed_list",
					value : "list",
					checked : C == "list"
				})), createLabel({
					className : "embed_radio embed_basic",
					"for" : al.id + "embed_basic"
				}, null, createCheckboxOrRadio("radio", {
					name : al.name,
					id : al.id + "embed_basic",
					value : "basic",
					checked : C == "basic" || C === null
				}))];
				p = createNode("div", {
					className : "embed_type",
					id : al.id
				}, null, m);
				break;
			case"lookbook_style_picker":
				var V = ad;
				var x = [createLabel({
					"for" : al.id + "embed_slideshow"
				}, null, [createCheckboxOrRadio("radio", {
					name : al.name,
					id : al.id + "embed_slideshow",
					value : "slideshow",
					checked : V == "slideshow"
				}), createNode("span", {
					className : "embed_radio embed_slideshow"
				}, null, loc("Slideshow"))]), createLabel({
					"for" : al.id + "embed_carousel"
				}, null, [createCheckboxOrRadio("radio", {
					name : al.name,
					id : al.id + "embed_carousel",
					value : "carousel",
					checked : V == "carousel"
				}), createNode("span", {
					className : "embed_radio embed_carousel"
				}, null, loc("Carousel"))]), createLabel({
					"for" : al.id + "embed_grid"
				}, null, [createCheckboxOrRadio("radio", {
					name : al.name,
					id : al.id + "embed_grid",
					value : "grid",
					checked : V == "grid"
				}), createNode("span", {
					className : "embed_radio embed_lb_grid"
				}, null, loc("Image grid"))])];
				p = createNode("div", {
					className : "embed_lb_type",
					id : al.id
				}, null, x);
				break;
			case"size_picker":
				p = createNode("div", {
					className : "selectoption"
				});
				var E = a.appendChild(createInput("hidden", {
					value : ad,
					name : al.name
				}));
				var ag = {
					sizes : ["l", "e", "x", "y"]
				};
				if (al.itemType === "collection") {
					ag.showHeight = true;
					ag.disableWidth = false;
					ag.disableHeight = true;
					ag.custom = {
						showWidth : true,
						showHeight : true,
						defaultValue : "c600x600"
					}
				} else {
					if (al.itemType === "lookbook") {
						ag.disableWidth = false;
						ag.disableHeight = true;
						ag.custom = {
							showWidth : true,
							showHeight : false,
							defaultValue : "c600x600"
						}
					}
				}
				ag.aspectRatio = al.aspectRatio;
				ag.makeSquare = al.makeSquare;
				SizePicker.add(p, E, ag);
				break;
			case"item_picker":
				p = createNode("div");
				Share.createItemPicker(al.items, p, "", al.basedon_tid);
				break;
			case"quick_share":
				var H = createInput("hidden", {
					value : ad,
					name : al.listName
				});
				var an = createCheckboxOrRadio("checkbox", {
					name : al.name,
					id : al.id + "on",
					value : "on",
					checked : al.checked
				});
				var w = createLabel({
					"for" : al.id + "on"
				}, null, loc("Quick share with friends"));
				var M = createNode("span", null, null, [an, w]);
				var af = Share.createAccountPicker({
					accounts : al.services,
					input : H,
					inDialog : al.inDialog,
					inParent : al.inParent,
					id : "quick_share"
				});
				var am = function() {
					if (an.checked) {
						show(af)
					} else {
						hide(af)
					}
				};
				Event.addListener(H, "change", function() {
					an.checked = true;
					if (!H.value.length) {
						hide(M)
					} else {
						showInline(M)
					}
					am()
				});
				Event.addListener(an, "change", am);
				am();
				p = createNode("div", {
					className : "quickshare"
				}, null, [M, af, H]);
				break;
			case"quick_share_compact":
				var K = createInput("hidden", {
					value : ad,
					name : al.listName
				});
				var O = createCheckboxOrRadio("checkbox", {
					name : al.name,
					id : al.id + "on",
					value : "on",
					checked : al.checked
				});
				var t = Share.createAccountPicker({
					accounts : al.services,
					input : K,
					inDialog : al.inDialog,
					inParent : al.inParent,
					checkbox : O,
					accountListClass : " ",
					id : "quick_share_compact"
				});
				p = createNode("div", {
					className : "quickshare"
				}, null, [t, K]);
				break;
			default:
				throw "invalid type: " + al.type
		}
		if (al.list) {
			setNode(p, {
				list : al.list
			})
		}
		if (q) {
			al.rowClassName = al.rowClassName ? al.rowClassName + " form_multiline" : "form_multiline"
		}
		A = f.appendChild(createNode("tr", {
			id : al.rowId,
			className : al.rowClassName
		}));
		if (c) {
			A.appendChild(createNode("td", {
				className : "value nolabel"
			}, null, p))
		} else {
			var F = "label";
			A.appendChild(createNode("td", {
				className : "label"
			}, null, ah));
			A.appendChild(createNode("td", {
				className : "value"
			}, null, p))
		}
		if (al.placeholder) {
			var Q = f.appendChild(createNode("tr"));
			Q.appendChild(createNode("td", {
				className : "placeholder"
			}));
			Q.appendChild(createNode("td", {
				className : "placeholder",
				id : al.placeholder
			}))
		}
		var R = createNode("tr");
		var o;
		if (al.error || G.type) {
			var ai = {};
			if (!al.error) {
				ai.display = "none"
			}
			var X = "validate_" + al.name + "_error";
			o = createNode("tr", {
				id : X
			}, ai);
			o.appendChild(createNode("td"));
			o.appendChild(createNode("td", {
				className : "error"
			}, null, al.error));
			f.appendChild(o);
			if (G.type && G.type.toLowerCase() != "none") {
				var W = G.type;
				delete G.type;
				yield(function() {
					Validate.formMonitor(a, al.id, W, o, G)
				})
			}
		}
		if (al.hint) {
			f.appendChild(R);
			R.appendChild(createNode("td"));
			R.appendChild(createNode("td", {
				className : "explain"
			}, null, al.hint))
		}
		if (al.requiredIf) {
			var I = $(al.requiredIf);
			if (I) {
				var ac = Browser.isIE ? "inline" : "table-row";
				setNode(A, null, {
					display : inputValue(I) ? ac : "none"
				});
				setNode(R, null, {
					display : inputValue(I) ? ac : "none"
				});
				Event.addListener(I, "change", function() {
					setNode(A, null, {
						display : inputValue(I) ? ac : "none"
					});
					setNode(R, null, {
						display : inputValue(I) ? ac : "none"
					})
				})
			} else {
				console.log("requiredIf src not found")
			}
		}
		if (al.ac_data) {
			var y;
			if (al.ac_data.data) {
				y = al.ac_data.data
			} else {
				if (al.ac_data.action) {
					y = new AjaxDataSource(al.ac_data.action, {
						data : al.ac_data.params || {}
					}, {
						hideProgress : true
					})
				}
			}
			var z = new AutoComplete(p, y, al.ac_data.options);
			Event.addListener(a, "destruct", z.destruct, z)
		}
	});
	h.removeChild(k);
	document.body.removeChild(h);
	return k
}

function _addFacebookPopup(d, h, a) {
	var f;
	var c = h.checked;
	var b = false;
	f = Event.addListener(h, "click", function(j) {
		b = true;
		Event.stop(j)
	});
	f.clean();
	if (!a) {
		var g = function() {
			if (inputValue(h)) {
				h.checked = false;
				Track.stat("inc", "share", ["connect_start_old", "facebook"]);
				Facebook.link({
					permissions : Facebook.permissions().join(","),
					onSuccess : function() {
						Track.stat("inc", "share", ["connect_complete_old", "facebook"]);
						h.checked = true;
						f.clean()
					}
				})
			}
		};
		if (b) {
			g()
		}
		f = Event.addListener(d, "click", g)
	} else {
		if (b) {
			h.checked = !c
		}
	}
}

function addFacebookPopup(c, a) {
	var d = c;
	for (var b = 0; b < c.childNodes.length; ++b) {
		if (c.childNodes[b].type == "checkbox") {
			d = c.childNodes[b];
			break
		}
	}
	_addFacebookPopup(c, d, a)
}

function validateData(c, b) {
	if (!c || !b) {
		return true
	}
	var d = 0;
	function a(f) {
		return !(f === undefined || f === "")
	}
	b.forEach(function(n) {
		if (!n.name || n.type == "hidden") {
			return
		}
		var k = c[n.name];
		if (n.requiredIf && !a(c[n.requiredIf])) {
			return
		}
		if (n.type == "checkbox") {
			if (n.checkboxes) {
				n.checkboxes.forEach(function(o) {
					if (o.name == n.name) {
						o.checked = k ? true : false
					}
				})
			} else {
				n.checked = k ? true : false
			}
		} else {
			if (n.type == "agecheck") {
				if (c[n.name + "_y"] && c[n.name + "_m"] && c[n.name + "_d"]) {
					var h = parseInt(c[n.name + "_y"], 10);
					var l = parseInt(c[n.name + "_m"], 10);
					var f = parseInt(c[n.name + "_d"], 10);
					k = new Date(h, l - 1, f);
					if (k.getMonth() == l - 1 && k.getDate() == f) {
						n.value = k
					} else {
						k = -1;
						n.value = 0
					}
				} else {
					k = undefined;
					n.value = 0
				}
			} else {
				n.value = k
			}
		}
		n.error = null;
		if ((n.required || n.requiredIf) && !a(k)) {
			d++;
			n.error = n.errMsg;
			if (!n.error) {
				n.error = loc("Please enter a value for this field")
			}
		}
		if (n.validate) {
			if (n.validate.toLowerCase() != "none") {
				var j = Validate.validate(k, n.validate);
				if (!j.valid) {
					d++;
					n.error = j.msg;
					return
				}
			}
		} else {
			var g = Validate.validate(k, n.type);
			if (!g.valid) {
				d++;
				n.error = g.msg;
				return
			}
		}
		if (n.type == "agecheck") {
			if (k == -1) {
				d++;
				n.error = loc("Please enter a valid date")
			} else {
				var m = new Date(k);
				m.setFullYear(m.getFullYear() + n.minAge);
				if (m - new Date() > 0) {
					d++;
					n.error = loc("You must be at least {minage} years old", {
						minage : n.minAge
					})
				}
			}
		}
	});
	return d === 0
}

function extractInputValues(f) {
	f = $(f);
	var a = {};
	for (var d = 0; d < f.elements.length; ++d) {
		var b = f.elements[d];
		var c = b.name;
		var g = inputValue(b);
		if (c) {
			if (b.getAttribute("list")) {
				if (b.type == "checkbox") {
					if (g) {
						if (a[c]) {
							a[c].push(g)
						} else {
							a[c] = [g]
						}
					}
				} else {
					a[c] = g ? g.split(/\s*[,\n]\s*/) : []
				}
			} else {
				if (b.type == "radio") {
					if (g) {
						a[c] = g
					}
				} else {
					a[c] = g
				}
			}
		}
	}
	return a
}

function focusFirst(d) {
	d = d.constructor == String ? $(d) : d;
	var f = d.elements;
	var a = function(g) {
		return function() {
			g.focus()
		}
	};
	for (var c = 0; c < f.length; ++c) {
		var b = f[c];
		if (b.type != "hidden") {
			Event.addListener(document, "modifiable", a(b));
			break
		}
	}
}

function formCancel(c, b) {
	c = $(c);
	setNode(c, {
		onsubmit : null
	});
	Event.release(c);
	var d;
	for (var a = 0; a < c.elements.length; a++) {
		if (c.elements[a].type == "submit") {
			d = c.elements[a].name;
			break
		}
	}
	if (d) {
		c.appendChild(createNode("input", {
			type : "hidden",
			name : d,
			value : b || loc("Cancel")
		}))
	}
	c.submit()
}

var Validate = function() {
	var b = null;
	var a = {
		valid : true
	};
	return {
		validate : function(c, h, f, d) {
			if (!b) {
				b = {
					EMAIL : Validate.email,
					DISPLAYNAME : Validate.displayName,
					DISPLAYNAMEOFFICIAL : Validate.displayNameOfficial,
					USERNAME : Validate.userName,
					URL : Validate.url,
					INTEGER : Validate.integer,
					FLOAT : Validate.floatType,
					DATE : Validate.date,
					PRICE : Validate.price,
					MULTI_FILE_UPLOAD : Validate.multiFileUpload
				}
			}
			f = f || {};
			c = "" + c;
			c = c.trim();
			if (c.length === 0) {
				if (!f.required) {
					return a
				} else {
					return {
						valid : false,
						msg : f.error || loc("Please enter a value for this field")
					}
				}
			}
			if (f.minlength && !d && c.length < f.minlength) {
				return {
					valid : false,
					msg : loc("Please enter at least {min} characters for this field", {
						min : f.minlength
					})
				}
			}
			if (f.maxlength) {
				var j = c;
				if ((f.htmllevel || "none") !== "none") {
					j = stripHtml(j)
				}
				if (j.length > f.maxlength) {
					return {
						valid : false,
						msg : loc("Please enter less than {max} characters for this field", {
							max : f.maxlength
						})
					}
				}
			}
			h = h || "";
			var g = b[h.toUpperCase()];
			if (!g) {
				return a
			}
			return g(c, f, d)
		},
		formMonitor : function(j, f, h, k, g) {
			j = $(j);
			if (!j) {
				return
			}
			f = $(f) || j[f];
			k = $(k);
			if (!k) {
				return
			}
			g = g || {};
			var d;
			if (hasClass(k, "error")) {
				d = k
			} else {
				d = getElementsByClassName({root:k,className:"error"})[0]
			}
			if (!d || !f) {
				return
			}
			j._invalidInputs = j._invalidInputs || {};
			var l = function(n) {
				n = n && (!document.activeElement || document.activeElement === f);
				var m = Validate.validate(f.value, h, g, n);
				if (m.valid) {
					delete j._invalidInputs[f.name];
					setNode(k, null, {
						display : "none"
					})
				} else {
					j._invalidInputs[f.name] = true;
					if (m.msg) {
						setNode(k, null, {
							display : "table-row"
						});
						d.innerHTML = m.msg
					} else {
						setNode(k, null, {
							display : "none"
						})
					}
				}
				return m.valid
			};
			if (h) {
				var c = Event.rateLimit(function() {
					l(true)
				}, 100);
				Event.addListener(f, "blur", function() {
					l(false)
				});
				Event.addListener(f, "change", function() {
					l(false)
				});
				Event.addListener(f, "keyup", c)
			}
			Event.addListener(j, "submit", function(m) {
				if (l(false)) {
					return
				}
				if (m) {
					Event.stop(m)
				}
			})
		},
		isFormValid : function(c) {
			var d = $(c)._invalidInputs || {};
			var f = true;
			forEachKey(d, function() {
				f = false;
				return true
			});
			return f
		},
		required : function(f, d, c) {
			return f || c ? a : {
				valid : false,
				msg : d.error || loc("Please enter a value for this field")
			}
		},
		minlength : function(f, d, c) {
			if (c || !f || !f.length || f.length >= d.minlength) {
				return a
			} else {
				return {
					valid : false,
					msg : loc("Please enter at least {min} characters for this field", {
						min : d.minlength
					})
				}
			}
		},
		maxlength : function(f, d, c) {
			if (c || !f || !f.length) {
				return a
			} else {
				return f.length <= d.maxlength ? a : {
					valid : false,
					msg : loc("Please enter less than {max} characters for this field", {
						max : d.maxlength
					})
				}
			}
		},
		emailOrUserName : function(h, f, c) {
			h = h || "";
			h = h.toLowerCase();
			var d = Validate.email(h, f, c);
			var g = Validate.userName(h, f, c);
			return d.valid || g.valid ? a : {
				valid : false,
				msg : loc("Not a valid email address or username")
			}
		},
		email : function(f, d, c) {
			d = d || {};
			if (!f) {
				return a
			}
			if (c) {
				if (f.match(/^[@\w\-\.\+]*$/)) {
					return a
				}
			}
			if (f.match(/^.+@[\w\-]+(\.[\w\-]+)*\.[A-Za-z]{2,10}/)) {
				return a
			}
			return {
				valid : false,
				msg : loc("Not a valid email address")
			}
		},
		displayName : function(f, d, c) {
			d = d || {};
			if (c) {
				if (f.match(/^[\w\']+(\s[\w\']+)*\s?$/)) {
					return a
				}
			}
			if (f.length === 0) {
				return {
					valid : false
				}
			}
			if (f.match(/^[\w\']+(\s[\w\']+)*$/)) {
				return a
			}
			return {
				valid : false,
				msg : loc("Only normal characters, numbers and single spaces")
			}
		},
		displayNameOfficial : function(f, d, c) {
			d = d || {};
			if (c) {
				if (f.match(/^[\w\'\-\.]+(\s[\w\'\-\.]+)*\s?$/)) {
					return a
				}
			}
			if (f.length === 0) {
				return {
					valid : false
				}
			}
			if (f.match(/^[\w\'\-\.]+(\s[\w\'\-\.]+)*$/)) {
				return a
			}
			return {
				valid : false,
				msg : loc("Only normal characters, numbers and single spaces")
			}
		},
		userName : function(f, d, c) {
			d = d || {};
			if (!f) {
				return a
			}
			if (f.length < 4 && !c) {
				return {
					valid : false,
					msg : loc("Too short")
				}
			}
			if (f.length > 32) {
				return {
					valid : false,
					msg : loc("Too long")
				}
			}
			if (c) {
				if (f.match(/^[a-z](-?[a-z0-9]+)*-?$/)) {
					return a
				}
			}
			if (f.match(/[A-Z]/) && c) {
				return {
					valid : false
				}
			}
			if (!f.match(/^[a-z](-?[a-z0-9])*$/)) {
				return {
					valid : false,
					msg : loc("Only lowercase letters (a-z), numbers (0-9), and dashes (-) are allowed.") + " " + loc("Cannot start or end with a number or dash.")
				}
			}
			return a
		},
		url : function(f, d, c) {
			d = d || {};
			if (c || !f) {
				return a
			}
			if (f.length && !(f.indexOf("http://") === 0 || f.indexOf("https://") === 0)) {
				f = "http://" + f
			}
			if (!f.match(/^https?:\/\/[^.]+(\.[^.]+)+/)) {
				return {
					valid : false,
					msg : loc("{url} is not a valid URL", {
						url : f
					})
				}
			}
			return a
		},
		integer : function(f, d, c) {
			d = d || {};
			if (!f) {
				return a
			}
			if (c) {
				if (!f.match(/^-?\d*$/)) {
					return {
						valid : false,
						msg : loc("Not a valid number")
					}
				}
				if ((d.max || d.max === 0) && f > 0 && f > Number(d.max)) {
					return {
						valid : false,
						msg : loc("This value cannot be greater than {number}", {
							number : d.max
						})
					}
				}
				if ((d.min || d.min === 0) && f < 0 && (f < Number(d.min))) {
					return {
						valid : false,
						msg : loc("This value cannot be less than {number}", {
							number : d.min
						})
					}
				}
			} else {
				if (!f.match(/^-?\d+$/)) {
					return {
						valid : false,
						msg : loc("Not a valid number")
					}
				}
				if ((d.min || d.min === 0) && f < Number(d.min)) {
					return {
						valid : false,
						msg : loc("This value cannot be less than {number}", {
							number : d.min
						})
					}
				}
				if ((d.max || d.max === 0) && f > Number(d.max)) {
					return {
						valid : false,
						msg : loc("This value cannot be greater than {number}", {
							number : d.max
						})
					}
				}
			}
			return a
		},
		floatType : function(g, f, c) {
			f = f || {};
			g = "" + g;
			if (!g) {
				return a
			}
			if (!c) {
				if (!g.match(/^-?[0-9]*\.?[0-9]+$/)) {
					return {
						valid : false,
						msg : loc("Not a valid number")
					}
				}
				if ((f.min || f.min === 0) && g < Number(f.min)) {
					return {
						valid : false,
						msg : loc("This value cannot be less than {number}", {
							number : f.min
						})
					}
				}
			}
			if ((f.max || f.max === 0) && g > Number(f.max)) {
				return {
					valid : false,
					msg : loc("This value cannot be greater than {number}", {
						number : f.max
					})
				}
			}
			var d = g.indexOf(".");
			if (f.decimal && d > -1 && (g.length - 1 - d > f.decimal)) {
				return {
					valid : false,
					msg : loc("This value cannot have more than {number} decimals", {
						number : f.decimal
					})
				}
			}
			if (c) {
				if (!g.match(/^-?[0-9]*\.?[0-9]*$/)) {
					return {
						valid : false,
						msg : loc("Not a valid number")
					}
				}
			}
			return a
		},
		multiFileUpload : function(h, g, f) {
			if (!h || !g || !g.inputNode || !g.inputNode._multiFileUpload) {
				return a
			}
			var d = [];
			var c = [];
			g.inputNode._multiFileUpload.pluploader.files.filter(function(j) {
				if (MultiFileUpload.isFileUploaded(j)) {
					return
				}
				if (j.status == plupload.QUEUED || j.status == plupload.UPLOADING) {
					d.push(j);
					return
				}
				c.push(j)
			});
			if (c.length) {
				return {
					valid : false,
					msg : loc("Some files had errors.")
				}
			}
			if (!f && d.length) {
				return {
					valid : false,
					msg : loc("Some files have not finished uploading.")
				}
			}
			return a
		},
		price : function(g, d, c) {
			d = d || {};
			if (!g) {
				return a
			}
			var f = loc("price");
			if (!c) {
				if (!g.match(/^\s*\d*(\.\d{1,2})?\s*$/)) {
					return {
						valid : false,
						msg : loc("Please enter a valid {priceName}", {
							priceName : d.priceName || f
						})
					}
				}
			}
			if (d.min !== undefined && g < Number(d.min)) {
				return {
					valid : false,
					msg : loc("Minimum {priceName} is {number}", {
						priceName : d.priceName || f,
						number : d.min
					})
				}
			}
			if (!g.match(/^\s*\d*(\.\d{0,2})?\s*$/)) {
				return {
					valid : false,
					msg : loc("Please enter a valid {priceName}", {
						priceName : d.priceName || f
					})
				}
			}
			if (d.max !== undefined && g > Number(d.max)) {
				return {
					valid : false,
					msg : loc("Maximum {priceName} is {number}", {
						priceName : d.priceName || f,
						number : d.max
					})
				}
			}
			return a
		},
		userNameAvailable : function(c) {
			return function() {
				return c.available ? a : {
					valid : false
				}
			}
		},
		phone : function(c, f, d) {
			if (d) {
				return a
			}
			if (c.match(/(.*\d){10}/)) {
				return a
			}
			return {
				valid : false,
				msg : loc("Not a valid phone number")
			}
		},
		host : function(f, d, c) {
			if (c) {
				if (f.match(/^[\-a-z0-9\.]*$/)) {
					return a
				}
			}
			if (f.match(/^[\-a-z0-9]+(\.[\-a-z0-9]+)+/)) {
				return a
			}
			return {
				valid : false,
				msg : loc("Not a valid host name")
			}
		}
	}
}();
var ExecQueue = (function() {
	var b;
	var a = [];
	return {
		push : function(c, d) {
			a.push(c);
			if (!b && d !== false) {
				b = window.setTimeout(ExecQueue._exec, 200)
			}
		},
		exec : function() {
			if (!b) {
				ExecQueue._exec()
			} else {
			}
		},
		_exec : function() {
			var c = a;
			a = [];
			b = null;
			c.forEachNonBlocking(50, function(d) {
				d()
			})
		}
	}
})();
var Feedback = function() {
	replaceURL(null, [".msg"]);
	var c;
	var f = new Timer();
	var d = 0;
	var a = new Interval(16, function() {
		d *= 1.03;
		setNode(c, null, {
			top : px(d)
		});
		if (d < -Dim.fromNode(c).h) {
			clearNode(c);
			b()
		}
	});
	a.clear();
	function b() {
		f.reset();
		a.clear();
		if (c) {
		} else {
			c = createNode("ul", {
				id : Feedback.NODE_ID,
				className : "drop_shadowed"
			});
			document.body.appendChild(c);
			Event.addListener(c, "click", Feedback.hide)
		}
	}
	return {
		NODE_ID : "feedback_msg",
		hide : function() {
			if (!c) {
				return
			}
			hide(c);
			domRemoveDescendants(c);
			b()
		},
		message : function(j, g, h) {
			Event.addListener(document, "modifiable", function() {
				if (!g) {
					g = Feedback.getMessageDelay(j)
				}
				b();
				show(c);
				setNode(c, null, {
					top : "-16px",
					zIndex : overlayZIndex(c)
				});
				addList(c, j);
				f.replace(function() {
					d = -16;
					a.reschedule(16)
				}, g);
				if (h) {
					Feedback.markRead(h)
				}
			})
		},
		getMessageDelay : function(g) {
			return 1000 + 50 * (( typeof (g) == "string") ? g.length : textContent(g).length)
		},
		markRead : function(g) {
			if (Auth.userId()) {
				Ajax.post({
					action : "announcement.mark_read",
					hideProgress : true,
					data : {
						id : g
					}
				})
			}
		},
		error : function(h, g) {
			Feedback.message(createNode("span", {
				className : "warning"
			}, null, h), g)
		},
		messageFromResponse : function(g) {
			if ((g.message || {}).length) {
				g.message.forEach(function(h) {
					Feedback.message(h.content)
				})
			}
		}
	}
}();
function Segment(a, c) {
	this.a = a;
	this.b = c;
	this.slope = (this.b.y - this.a.y) / (this.b.x - this.a.x);
	this.yIntercept = this.a.y - this.slope * this.a.x;
	var b = 1 / Math.sqrt(1 + this.slope * this.slope);
	this.dir = {
		x : b,
		y : b ? this.slope * b : 1
	};
	if (this.dir.x) {
		this.lambda = (this.b.x - this.a.x) / this.dir.x
	} else {
		this.lambda = (this.b.y - this.a.y) / this.dir.y
	}
}
Segment.prototype.distanceTo = function(a) {
	return this.closestPoint(a).distance(a)
};
Segment.prototype.inSegment = function(a) {
	return (((a.x <= this.a.x && a.x >= this.b.x) || (a.x >= this.a.x && a.x <= this.b.x)) && ((a.y <= this.a.y && a.y >= this.b.y) || (a.y >= this.a.y && a.y <= this.b.y)))
};
Segment.prototype.closestPoint = function(b) {
	var a, g;
	if (this.slope === 0) {
		a = b.x;
		g = this.a.y
	} else {
		if (this.slope == Number.POSITIVE_INFINITY || this.slope == Number.NEGATIVE_INFINITY) {
			a = this.a.x;
			g = b.y
		} else {
			var f = b.y + b.x / this.slope;
			a = (this.slope * (f - this.yIntercept)) / (this.slope * this.slope + 1);
			g = this.slope * a + this.yIntercept
		}
	}
	var d = new Point(a, g);
	if (this.inSegment(d)) {
		return d
	} else {
		return this.a.distance(b) < this.b.distance(b) ? this.a : this.b
	}
};
function sameSigns(d, c) {
	return (d ^ c) >= 0
}
Segment.prototype.intersect = function(c, d) {
	if (d !== undefined) {
		return this.intersect(new Segment(c, d))
	}
	if (this.dir.x === 0 && c.dir.x !== 0) {
		return c.intersect(this)
	}
	if (this.dir.y === 0 && c.dir.y === 0) {
		if (c.a.y != this.a.y) {
			return null
		}
		if (c.a.x <= Math.max(this.a.x, this.b.x) && c.a.x >= Math.min(this.a.x, this.b.x)) {
			return new Point(c.a.x, this.a.y)
		}
		return null
	}
	if (this.dir.x === 0 && c.dir.x === 0) {
		if (c.a.x != this.a.x) {
			return null
		}
		if (c.a.y <= Math.max(this.a.y, this.b.y) && c.a.y >= Math.min(this.a.y, this.b.y)) {
			return new Point(this.a.x, c.a.y)
		}
		return null
	}
	var a = (this.dir.y * c.a.x - this.dir.y * this.a.x - this.dir.x * c.a.y + this.dir.x * this.a.y) / (this.dir.x * c.dir.y - this.dir.y * c.dir.x);
	var b = (c.a.x + a * c.dir.x - this.a.x) / this.dir.x;
	if (!sameSigns(b, this.lambda) || !sameSigns(a, c.lambda)) {
		return null
	}
	b = Math.abs(b);
	a = Math.abs(a);
	if (0 <= b && b <= Math.abs(this.lambda) && 0 <= a && a <= Math.abs(c.lambda)) {
		return new Point(this.a.x + b * this.dir.x, this.a.y + b * this.dir.y)
	} else {
		return null
	}
};
function Pool(a) {
	var b = [];
	return {
		get : function() {
			if (b.length) {
				return b.pop()
			} else {
				return a()
			}
		},
		release : function(c) {
			if (!b.contains(c)) {
				b.push(c)
			}
		}
	}
}

function AjaxResult(a) {
	if (!a) {
		return
	}
	forEachKey(a, function(b) {
		this[b] = a[b]
	}, this)
}
AjaxResult.prototype.hasGeneralError = function() {
	return !this.status || !this.status.ok
};
AjaxResult.prototype.hasFormError = function() {
	return !!this.form_error
};
AjaxResult.prototype.extractGeneralErrorMessages = function() {
	var a = [];
	if (!this.hasGeneralError()) {
		return a
	}
	if (!this.message) {
		a.push(loc("An error has occurred.") + " " + loc("Please try again later."))
	} else {
		this.message.forEach(function(b) {
			if (b.type != "error") {
				return
			}
			a.push(b.content)
		})
	}
	return a
};
AjaxResult.prototype.extractMessagesByType = function() {
	var a = {};
	if (!this.message) {
		return a
	} else {
		this.message.forEach(function(b) {
			a[b.type] = a[b.type] || [];
			a[b.type].push(b.content)
		});
		return a
	}
};
var Ajax = function() {
	var pool = new Pool(function() {
		return tryThese(function() {
			return new XMLHttpRequest()
		}, function() {
			return new ActiveXObject("Msxml2.XMLHTTP")
		}, function() {
			return new ActiveXObject("Microsoft.XMLHTTP")
		}) || false
	});
	var contracts = {};
	var passback = {};
	return {
		post : function(params) {
			params.method = "POST";
			return Ajax.request(params)
		},
		get : function(params) {
			params.method = "GET";
			return Ajax.request(params)
		},
		request : function(params) {
			var action = params.action;
			var resultType = params.resultType || "JSON";
			var data = params.data || {};
			var onSuccess = params.onSuccess || noop;
			var onError = params.onError || noop;
			var onProgress = params.onProgress || noop;
			var onFinally = params.onFinally || noop;
			var method = params.method || "POST";
			var busyMsg = params.busyMsg || loc("Busy") + "...";
			var contract = params.contract;
			var hideProgress = params.hideProgress || false;
			var track = params.track || false;
			Ajax.abortContract(contract);
			var xhr = pool.get();
			if (contract) {
				contracts[contract] = xhr
			}
			var url = params.url;
			var payload;
			var cacheable = !!data[".cacheable"];
			var out = (data._out || data[".out"] || "json").toLowerCase();
			if (out != "html" && out != "json" && out != "jsonx") {
				out = "json"
			}
			delete data._out;
			delete data[".out"];
			delete data[".cacheable"];
			data[".debug"] = !!window._Debug;
			var currURL = parseUri(window.location);
			forEachKey(currURL.queryKey, function(key, value) {
				if (key.match(/^\.exp_/)) {
					data[key] = value
				}
			});
			if (resultType != "BEACON") {
				forEachKey(passback, function(key, value) {
					data[".passback"] = data[".passback"] || {};
					data[".passback"][key] = value
				})
			}
			if (method == "POST") {
				url = url || buildAbsURL(buildURL(action), null, window.location.host);
				var token = Auth.getToken();
				if (token) {
					data[".tok"] = token
				}
				var locale = Conf.getLocale();
				if (locale) {
					data[".locale"] = locale
				}
				if (window._xsrfToken) {
					data[".xsrf"] = window._xsrfToken
				}
				payload = ".in=json&.out=" + out + "&request=" + encodeURIComponent(JSON2.stringify(data))
			} else {
				var urlParams = {
					".in" : "json",
					".out" : out,
					request : JSON2.stringify(data)
				};
				if (cacheable) {
					urlParams[".cacheable"] = 1
				}
				url = url || buildAbsURL(buildURL(action, urlParams), null, window.location.host);
				if (url.length > 2000) {
					throw ("GET url is longer than 2000 chars: " + url)
				}
				payload = null
			}
			if (window._tracking_segments_cookie) {
				Cookie.set("st", window._tracking_segments_cookie)
			}
			xhr.open(method, url, true);
			if (isPolyvoreURL(url)) {
				xhr.withCredentials = true
			} else {
				xhr.withCredentials = false
			}
			xhr.onreadystatechange = function() {
				onProgress(xhr);
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						switch(resultType) {
							case"JSON":
								try {
									var result = new AjaxResult(eval("(" + xhr.responseText + ")"));
									Ajax.mergePassback(result[".passback"] || {});
									var jslint = window._Debug && _Debug.ajaxDebug(result, {
										url : url
									});
									var cacheControl = xhr.getResponseHeader("Cache-Control");
									if (!cacheControl || cacheControl == "no-cache") {
										window._xsrfToken = result.xsrf || window._xsrfToken
									}
									if (!result.hasGeneralError() && !result.hasFormError()) {
										if (result[".user"]) {
											Auth.setUser(result[".user"])
										}
										if (Cookie.canNotSetCookies() && result[".tok"]) {
											Auth.setToken(result[".tok"])
										}
										onSuccess(result);
										Event.checkForBackendEvent();
										if (Cookie.canNotSetCookies()) {
											Event.triggerBackendEvents(result[".events"], createUUID())
										}
									} else {
										onError(result)
									}
								} catch(e) {
									var foo = window._Debug && window._Debug.logStackTrace();
									console.log("exception in handling of ajax response", e)
								}
								break;
							case"BEACON":
								onSuccess();
								break;
							case"HTML":
								onSuccess(xhr.responseText);
								break
						}
					} else {
						if (resultType != "BEACON" && window.Beacon && Beacon.log) {
							Beacon.log("ajaxerror", {
								status : xhr.status
							})
						}
						onError(new AjaxResult({
							xhr_status : xhr.status
						}))
					}
					if (window.Progress !== undefined && !hideProgress) {
						Progress.hide()
					}
					onFinally();
					if (contract && contracts[contract] == xhr) {
						delete contracts[contract]
					}
					if (window.Track && url.indexOf("/cgi/") >= 0) {
						try {
							var path = url.replace(/.*?\/cgi\//, "");
							Track.trackURL("/ajax/" + path)
						} catch(track_exception) {
							var afoo = window._Debug && window._Debug.logStackTrace();
							console.log("exception in tracking ajax call", track_exception)
						}
					}
					yield(function() {
						pool.release(xhr)
					})
				}
			};
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			if (!hideProgress) {
				Progress.show(busyMsg)
			}
			xhr.send(payload);
			return xhr
		},
		mergePassback : function(data) {
			passback = mergeObject(passback, data)
		},
		abort : function(xhr) {
			xhr.onreadystatechange = noop;
			xhr.abort();
			if (window.Progress !== undefined) {
				Progress.hide()
			}
		},
		abortContract : function(contract) {
			var old_xhr = Ajax.getContract(contract);
			if (!old_xhr) {
				return false
			}
			Ajax.abort(old_xhr);
			delete contracts[contract];
			return true
		},
		getContract : function(contract) {
			if (!contract) {
				return null
			}
			return contracts[contract] || null
		},
		getCacheKey : function(action, params) {
			action = action || "";
			params = params || {};
			var values = ["action=" + encodeURIComponent(action)];
			forEachKey(params, function(key, value) {
				if (key != "reqSize" && key != "page" && key != "length" && key != ".cacheable" && key.indexOf("_") !== 0) {
					values.push(key + "=" + encodeURIComponent(value))
				}
			});
			values.sort();
			return JSON2.stringify(values)
		}
	}
}();
var Progress = function() {
	var a;
	var c;
	function b() {
		if (c) {
			window.clearTimeout(c)
		}
		if (!a) {
			a = $("progress")
		}
		if (!a) {
			a = createNode("div", {
				id : "progress"
			}, {
				display : "none"
			});
			document.body.appendChild(a)
		}
	}
	return {
		show : function(d) {
			b();
			setNode(a, null, {
				top : px(scrollXY().y),
				display : "block",
				zIndex : overlayZIndex(a)
			}, d)
		},
		hide : function() {
			b();
			setNode(a, null, {
				display : "none"
			})
		},
		flash : function(d) {
			b();
			setNode(a, null, {
				display : "none"
			});
			c = window.setTimeout(function() {
				setNode(a, null, {
					display : "block"
				}, d);
				c = 0
			}, 5)
		}
	}
}();
var Beacon = function() {
	var j = [];
	var g = buildAbsURL("../rsrc/beacon.gif?", null, document.location.host || Conf.getWebHost());
	var f = g.length;
	var c = 2000;
	function h(k) {
		var m = ["type=" + k.type];
		var l = k.data;
		if (l) {
			forEachKey(l, function(n, o) {
				m.push(encodeURIComponent(n) + "=" + encodeURIComponent(o))
			})
		}
		return m.join("&")
	}

	function d() {
		if (j.length === 0) {
			return
		}
		var k = g + "&t=" + encodeURIComponent(new Date().getTime());
		var n = k;
		var m = true;
		while (j.length > 0) {
			var l = j.shift();
			n += "&" + h(l);
			if (n.length > c) {
				if (m) {
					k = n
				} else {
					j.unshift(l)
				}
				yield(d);
				break
			} else {
				k = n
			}
			m = false
		}
		Ajax.get({
			url : k,
			resultType : "BEACON",
			hideProgress : true,
			onSuccess : function() {
				if (l.length > 0) {
					d()
				}
			}
		})
	}

	function a() {
		d()
	}

	var b = new Interval(500, a);
	Event.addListener(window, "beforeunload", a);
	return {
		log : function(l, m, k) {
			if (window._polyvorePageTs) {
				m._page_ts = window._polyvorePageTs
			}
			j.push({
				type : l,
				data : m
			});
			if (k) {
				a()
			}
		},
		flush : function() {
			a()
		}
	}
}();
var Track = function() {
	function getContextNode(node) {
		return matchingAncestor(node, null, "trackcontext")
	}

	function getElementNode(node) {
		return matchingAncestor(node, null, "trackelement")
	}

	function loadOffer(url, trackId) {
		var offerUrl = buildURL("offer", {
			url : url,
			track_id : trackId
		});
		var iframe = setNode(document.createElement("iframe"), {
			name : "polyvore_offer",
			scrolling : "no",
			allowTransparency : "true",
			frameBorder : 0,
			width : 0,
			height : 0,
			src : offerUrl
		}, {
			position : "absolute",
			left : "-10000px",
			top : "-10000px",
			scroll : "none",
			overflow : "hidden",
			border : 0,
			backgroundColor : "transparent"
		});
		document.body.appendChild(iframe)
	}

	var ctrClassMap = {
		splash : "s",
		thing : "t",
		set : "c",
		profile : "u",
		collection : "l",
		"shop.browse" : "sb",
		shop : "sp",
		app : "e",
		activity : "a",
		string : "st",
		home : "h",
		contest : "co",
		"popular.fashion" : "pf"
	};
	function getCTRInfo(anchor) {
		var cls = (anchor && anchor.getAttribute("oid")) || "";
		if (cls && /:/.test(cls)) {
			return cls
		}
		var url = anchor.href;
		if (url && isPolyvoreURL(url)) {
			var action = parsePolyvoreURL(url).action;
			var uri = parseUri(url);
			return Track.classAndId(action, uri.queryKey.id || uri.query || "")
		}
		return cls || ""
	}

	function trackAffiliate(url, trackId) {
		var uri = parseUri(url);
		var host = uri.host;
		var path = uri.path;
		if (!host) {
			return url
		}
		var key;
		host = host.toLowerCase();
		if (host.match(/linksynergy/)) {
			key = "u1"
		} else {
			if (path && path.match(/click-2687457-/i)) {
				key = "sid"
			} else {
				if (host == "gan.doubleclick.net" || host == "clickserve.cc-dt.com") {
					key = "mid"
				} else {
					if (host.match(/awin1/)) {
						key = "clickref"
					} else {
						if (host == "www.shareasale.com") {
							key = "afftrack"
						} else {
							if (path && path.match(/^\/t\//)) {
								key = "sid"
							} else {
								if (host == "rover.ebay.com") {
									key = "customid"
								} else {
									if (host == "www.avantlink.com") {
										key = "ctc"
									} else {
										if (host == "tracker.tradedoubler.com") {
											key = "epi"
										} else {
											if (host == "track.webgains.com") {
												key = "clickref"
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if (key) {
			uri.queryKey = uri.queryKey || {};
			uri.queryKey[key] = trackId;
			return reconstructUri(uri)
		} else {
			return url
		}
	}
	Event.addListener(document, "click", function(event) {
		Track.trackDomNode("click", Event.getSource(event))
	});
	Event.addListener(document, "mousedown", function(event) {
		var source = Event.getSource(event);
		var limit = 0;
		while (source && ++limit < 3) {
			if (source.tagName == "A" || (hasClass(source, "clickable") || hasClass(source, "btn"))) {
				if (source.ctrTrackcontext) {
					Track.logCTRClick(source.ctrTrackcontext, getCTRInfo(source), source.srcId)
				}
				Track.flushStats();
				var url = source.href;
				if (url && url.indexOf("http") === 0) {
					if (!isPolyvoreURL(url)) {
						var tid = source.getAttribute("oid");
						if (tid) {
							tid = tid.split(":")[1]
						}
						var orighost = source.getAttribute("orighost");
						var clickUrl = source.getAttribute("paidurl");
						var trackElement = source.getAttribute("trackelement");
						var cpc = source.getAttribute("cpc");
						if (source.getAttribute("showtooltip") && !(isRightClick(event) || (Browser.isMac && event.ctrlKey))) {
							Event.stop(event);
							return Shop.outbound({
								url : url,
								paid_url : clickUrl,
								orighost : orighost,
								thing_id : tid
							})
						}
						var trackId = createUUID();
						var href = Track.trackOutboundUrl({
							cpc : cpc,
							tid : tid,
							url : source.href,
							orighost : orighost,
							paid_url : clickUrl,
							track_id : trackId,
							context : Track.getContext(source),
							track_element : trackElement
						});
						if (href && source.href != href) {
							source.href = href
						}
						if (tid) {
							Ajax.post({
								action : "outbound.store",
								hideProgress : true,
								data : {
									tid : tid
								}
							})
						}
					}
				}
				return
			}
			source = source.parentNode
		}
	});
	Event.addListener(Event.BACKEND, "register", function() {
		Track.trackURL("/event/register")
	});
	var TRACK_PAGES = {
		set : true,
		thing : true,
		__foo__ : false
	};
	var TRACK_EVENTS = {
		click : true
	};
	var lastTrackedTime = 0;
	var _stats = [];
	function sendStats() {
		if (_stats.length) {
			Ajax.post({
				action : "stats.record",
				hideProgress : true,
				data : {
					stats : _stats
				}
			});
			_stats = []
		}
	}
	Event.addListener(window, "beforeunload", sendStats);
	return {
		classAndId : function(cls, id) {
			cls = ctrClassMap[cls] || cls.substring(0, 2).toLowerCase();
			if (id) {
				return [cls, ":", id].join("")
			}
			return cls
		},
		trackCTR : function(trackcontext, ctrClasses, options) {
			var nodes;
			options = options || {};
			if (trackcontext.constructor == String) {
				nodes = getElementsWithAttributes({
					root : options.root,
					attributes : {
						trackcontext : trackcontext
					}
				})
			} else {
				nodes = [trackcontext];
				trackcontext = trackcontext.getAttribute("trackcontext");
				if (!trackcontext) {
					return
				}
			}
			if (ctrClasses) {
				var classes = ctrClasses;
				ctrClasses = {};
				classes.forEach(function(cls) {
					ctrClasses[Track.classAndId(cls)] = 1
				})
			}
			var markup = function(nodes, ctrInfos, srcId) {
				for (var j = 0; j < nodes.length; j++) {
					var node = nodes[j];
					if (node.ctrTrackcontext) {
						continue
					}
					var ctrInfo = getCTRInfo(node);
					if (ctrInfo) {
						if (!ctrClasses || ctrClasses[ctrInfo.split(":")[0]]) {
							ctrInfos.push(ctrInfo);
							node.ctrTrackcontext = trackcontext;
							node.srcId = srcId
						}
					}
				}
			};
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				var ctrInfos = [];
				var srcId = node.getAttribute("srcid");
				var clickables = getElementsByClassName({
					root : node,
					tagName : "SPAN",
					className : "clickable"
				});
				var buttons = getElementsByClassName({
					root : node,
					tagName : "SPAN",
					className : "btn"
				});
				var anchors = node.tagName == "A" ? [node] : node.getElementsByTagName("a");
				markup(anchors, ctrInfos, srcId);
				markup(clickables, ctrInfos, srcId);
				markup(buttons, ctrInfos, srcId);
				if (!options.clicksOnly) {
					Track.logCTRView(trackcontext, ctrInfos, srcId)
				}
			}
		},
		logCTRView : function(trackcontext, ids, srcId) {
			ids = toArray(ids);
			if (!ids.length) {
				return
			}
			var view = {};
			view[trackcontext] = ids.uniq();
			var params = {
				view : JSON2.stringify(view)
			};
			if (srcId) {
				params.ctr_src_id = srcId
			}
			Beacon.log("ctr", params)
		},
		logCTRClick : function(trackcontext, oid, srcId) {
			if (!oid) {
				return
			}
			var click = {};
			click[trackcontext] = oid;
			var params = {
				click : JSON2.stringify(click)
			};
			if (srcId) {
				params.ctr_src_id = srcId
			}
			Beacon.log("ctr", params, true)
		},
		logCPCView : function(trackcontext, cpc) {
			Beacon.log("cpc_view", {
				context : trackcontext,
				cpc : cpc
			})
		},
		stat : function(action, name, params, value) {
			var data = {
				action : action,
				name : name,
				params : params
			};
			if (value !== undefined) {
				data.value = value
			}
			Beacon.log("stat", data)
		},
		statCounter : function(action, name, params, value) {
			var data = {
				action : action,
				name : name,
				params : JSON2.stringify(params)
			};
			if (value !== undefined) {
				data.value = value
			}
			Beacon.log("statcounter", data)
		},
		flushStats : Beacon.flush,
		trackURL : function(url) {
			if (!isAbsURL(url) || isPolyvoreURL(url)) {
				var whitelist = window._polyvoreGAURLParamWhitelist || {};
				var cleanedQueryKey = {};
				var parsed = parseUri(buildAbsURL(url));
				var polyvoreParsed = parsePolyvoreURL(url);
				if (parsed.queryKey[".in"] == "json" && parsed.queryKey.request) {
					try {
						mergeObject(parsed.queryKey, eval("(" + parsed.queryKey.request + ")"), false)
					} catch(e) {
					}
				}
				forEachKey(parsed.queryKey, function(k, v) {
					if (whitelist[k] && (v || v === 0)) {
						cleanedQueryKey[k] = v
					}
				});
				parsed.queryKey = cleanedQueryKey;
				if (parsed.path == "/" && polyvoreParsed.action && polyvoreParsed.action != "splash") {
					parsed.path = "/cgi/" + polyvoreParsed.action
				}
				if (parsed.path.indexOf("/ajax/") !== 0) {
					parsed.path = parsed.path.replace(/^\/[^\/]*\//, "/cgi/")
				}
				url = reconstructUri(parsed);
				url = parseUri(url).relative;
				url = url.replace(/\%20/g, "+");
				window._gaq = window._gaq || [];
				_gaq.push(["_trackPageview", url]);
				Track.trackEvent("click.url", url)
			}
		},
		trackDomNode : function(eventName, node) {
			if (TRACK_EVENTS[eventName] && TRACK_PAGES[window.polyvore_page_name]) {
				var trackElem = getElementNode(node);
				if (trackElem) {
					var contextNode = getContextNode(trackElem);
					if (contextNode) {
						Track.trackEvent(eventName, contextNode.getAttribute("trackcontext") + "_" + trackElem.getAttribute("trackelement"))
					}
				}
			}
		},
		trackEvent : function(eventName, label) {
			if (label && TRACK_PAGES[window.polyvore_page_name] && TRACK_EVENTS[eventName]) {
				if (new Date() - lastTrackedTime > 1000) {
					_gaq.push(["_trackEvent", window.polyvore_page_name, eventName, label, undefined, true]);
					lastTrackedTime = new Date()
				}
			}
		},
		trackOutboundUrl : function(params) {
			var tid = params.tid;
			var cpc = params.cpc;
			var orighost = params.orighost;
			var paidUrl = params.paid_url;
			var trackId = params.track_id;
			var href = params.url;
			if (orighost) {
				Track.trackURL("/cgi/outbound?url=" + orighost);
				if (paidUrl) {
					href = cpc ? paidUrl : trackAffiliate(paidUrl, trackId)
				} else {
					loadOffer(orighost, trackId)
				}
				var ocCookieName = "oc_" + orighost;
				Cookie.set(ocCookieName, trackId, 30, undefined, "/conversion")
			} else {
				loadOffer(href, trackId)
			}
			var args = {
				track_id : trackId,
				tid : tid,
				orighost : orighost,
				url : href
			};
			if (cpc) {
				args.cpc = cpc
			}
			if (params.context) {
				args.track = params.context;
				if (params.track_element) {
					args.track += "_" + params.track_element
				}
			}
			Beacon.log("outbound", args);
			return href
		},
		logRenderTime : function(time) {
			var data = {
				rt : time
			};
			Beacon.log("render_time", data)
		},
		redirectOutboundUrl : function(params, delay) {
			var href = Track.trackOutboundUrl(params);
			window.setTimeout(function() {
				window.location.replace(href)
			}, delay)
		},
		ctrInfo : getCTRInfo,
		engagement : function(data) {
		},
		getContext : function(node) {
			if (!node || node.tagName == "HTML" || node.tagNode == "BODY") {
				return ""
			}
			if (node._trackContextPath !== undefined) {
				return node._trackContextPath
			}
			var contexts = [];
			var parentContext = Track.getContext(node.parentNode);
			if (parentContext) {
				contexts.push(parentContext)
			}
			if (node.getAttribute && node.getAttribute("trackcontext")) {
				contexts.push(node.getAttribute("trackcontext"))
			}
			return (node._trackContextPath = contexts.join("|"))
		},
		setContext : function(node, context) {
			node._trackContextPath = context
		}
	}
}();
function notSeen(b) {
	var a = getStyle(b, "color");
	return (a == "#abcdef" || a == "rgb(171, 205, 239)")
}

var imgThingRe = new RegExp("/img-thing.*(?:/|&)tid(?:/|=)(\\d+)");
function getImageThingId(b) {
	if (!b) {
		return null
	}
	var a;
	if (( a = b.match(imgThingRe))) {
		return a[1]
	}
	return null
}

var imgSetRe = new RegExp("/img-set.*(?:/|&)cid(?:/|=)(\\d+)");
function getImageSetId(b) {
	if (!b) {
		return null
	}
	var a;
	if (( a = b.match(imgSetRe))) {
		return a[1]
	}
	return null
}

var TrackImpressions = function() {
	var n = window._polyvoreTrackSize;
	if (!n) {
		return
	}
	var c = n.thing;
	var o = n.collection;
	var m = new Set();
	var d = new Set();
	var l = new Set();
	var a = new Set();
	var g = null;
	var f;
	if (window.parent && window.parent != window && document.referrer && ( f = document.referrer.match(new RegExp("^\\w+://([^/]+)/")))) {
		var b = f[1];
		if (b != Conf.getWebHost()) {
			g = b
		}
	}
	Event.addListener(document, "domready", function() {
		q();
		var r = new Interval(2000, q)
	});
	function q() {
		try {
			var z = document.getElementsByTagName("img");
			for (var u = 0; u < z.length; ++u) {
				var v = z[u];
				var w;
				if (v.skip) {
					continue
				}
				if (notSeen(v)) {
					continue
				}
				var t;
				var r = v.getAttribute("src");
				if (!r) {
					continue
				}
				if (( t = getImageThingId(r))) {
					v.skip = true;
					w = Dim.fromNode(v);
					if (w.w * w.h < c) {
						continue
					}
					if (l.ncp(t)) {
						m.put(t);
						var s = v.getAttribute("brandid");
						if (s) {
							Track.engagement({
								engagement : "view",
								action : "read",
								path : buildURL("thing", {
									id : t
								}),
								brand : s || -1,
								host : v.getAttribute("hostid") || -1
							})
						}
					}
					continue
				}
				var y;
				if (( y = getImageSetId(r))) {
					v.skip = true;
					w = Dim.fromNode(v);
					if (w.w * w.h < o) {
						continue
					}
					if (a.ncp(y)) {
						d.put(y)
					}
				}
			}
			h()
		} catch(x) {
			console.log(x)
		}
	}

	function h() {
		if (m.size() + d.size() === 0) {
			return
		}
		var r = m.values();
		var t = d.values();
		var s = {
			tids : r.join(","),
			cids : t.join(",")
		};
		if (g) {
			s.host = g
		}
		Beacon.log("impressions", s);
		Beacon.flush();
		m.clear();
		d.clear()
	}

	var j = new Set();
	var p = null;
	function k(s, r) {
		if (j.ncp(s)) {
			if (!p) {
				p = document.body.appendChild(createNode("div", null, {
					position : "absolute",
					width : "1px",
					height : "1px",
					right : "-100px",
					bottom : "-100px"
				}))
			}
			p.appendChild(createNode("div", null, null, r));
			Beacon.log("3pb", {
				beacon_id : s
			})
		}
	}
	return {
		scan : q
	}
}();
var TrackPromoted = function() {
	var b = {};
	Event.addListener(document, "domready", function() {
		a();
		var c = new Interval(2000, a)
	});
	function a() {
		try {
			var m = getElementsWithAttributes({
				attributes : {
					promotedwith : null
				}
			});
			if (!m) {
				return
			}
			var p = false;
			for (var k = 0; k < m.length; ++k) {
				var o = m[k];
				if (o.skippromoted) {
					continue
				}
				if (notSeen(o)) {
					continue
				}
				var n = o.getElementsByTagName("img");
				var d = false;
				if (o.tagName === "IMG") {
					d = getImageThingId(o.src) || getImageSetId(o.src)
				}
				if (!d) {
					for (var h = 0; h < n.length; h++) {
						var g = n[h];
						if (getImageThingId(g.src) || getImageSetId(g.src)) {
							d = true;
							break
						}
					}
				}
				if (!d) {
					continue
				}
				o.skippromoted = true;
				var f = o.getAttribute("oid");
				if (!f) {
					continue
				}
				var c = Track.getContext(o);
				if (b[f] && b[f][c]) {
					continue
				}
				if (!b[f]) {
					b[f] = {}
				}
				b[f][c] = true;
				Beacon.log("promoted", {
					product : o.getAttribute("promotedwith"),
					action : "view",
					context : c,
					oid : f
				});
				p = true
			}
			if (p) {
				Beacon.flush()
			}
		} catch(l) {
			console.log(l)
		}
	}
	return {
		scan : a
	}
}();
if (!window.localStorage) {
	window.localStorage = {
		getItem : noop,
		setItem : noop,
		removeItem : noop,
		clear : noop,
		key : noop,
		length : 0
	}
}
var L10N = function() {
	var a = {};
	var c = (window.Lexicon !== undefined);
	function b(f) {
		var d = "return " + f.replace(/\"/g, '\\"').split(/(\{\w+\})/).map(function(g) {
			return (g.match(/\{(\w+)\}/)) ? 'p["' + RegExp.$1 + '"]' : '"' + g + '"'
		}).join("+") + ";";
		return new Function("p", d)
	}
	return {
		loc : function(j, h) {
			if (h) {
				for (key in h) {
					if (h.hasOwnProperty(key) && ( typeof (h[key]) == "object")) {
						h[key] = outerHTML(h[key])
					}
				}
			}
			if (a[j]) {
				return a[j](h)
			}
			var d = c ? Lexicon[j] || j : j;
			var g = (a[j] = b(d));
			return g(h)
		}
	}
}();
var loc = L10N.loc;
var HighlightingTextarea = function() {
	var a;
	var h;
	function g(k, l) {
		if ("undefined" === typeof l) {
			l = k.value.length
		}
		if (k.setSelectionRange) {
			k.focus();
			k.setSelectionRange(l, l)
		} else {
			if (k.createTextRange) {
				var j = k.createTextRange();
				j.collapse(true);
				j.moveEnd("character", l);
				j.moveStart("character", l);
				j.select()
			}
		}
	}

	function f(j, k) {
		return k - (j.value.slice(0, k).split("\r\n").length - 1)
	}

	function d(n) {
		var q = 0, l = 0, p, m, k, j, o;
		if ( typeof n.selectionStart == "number" && typeof n.selectionEnd == "number") {
			q = n.selectionStart;
			l = n.selectionEnd
		} else {
			m = document.selection.createRange();
			if (m && m.parentElement() == n) {
				j = n.value.length;
				p = n.value.replace(/\r\n/g, "\n");
				k = n.createTextRange();
				k.moveToBookmark(m.getBookmark());
				o = n.createTextRange();
				o.collapse(false);
				if (k.compareEndPoints("StartToEnd", o) > -1) {
					q = l = j
				} else {
					q = -k.moveStart("character", -j);
					q += p.slice(0, q).split("\n").length - 1;
					if (k.compareEndPoints("EndToEnd", o) > -1) {
						l = j
					} else {
						l = -k.moveEnd("character", -j);
						l += p.slice(0, l).split("\n").length - 1
					}
				}
			}
		}
		return {
			start : q,
			end : l
		}
	}

	function b(j, k) {
		k = k || {};
		this.prefix = k.prefix;
		this.input = j;
		this.caretTokenIndex = 0;
		this.caretCharIndex = 0;
		this.currentTokens = [""];
		this.cleaner = new Cleaner();
		this.cleaner.push(Event.addListener(this.input, "click", this.refresh, this));
		this.cleaner.push(Event.addListener(this.input, "keyup", this.refresh, this))
	}
	b.prototype.destruct = function() {
		Event.release(this);
		this.cleaner.clean()
	};
	b.prototype.refresh = function(k) {
		this.currentTokens = inputValue(this.input).split((/(\s)/));
		var l = 0;
		this.caretCharIndex = Browser.isIE ? d(this.input).start : getCaretPosition(this.input);
		while (l < this.currentTokens.length && this.caretCharIndex > this.currentTokens[l].length) {
			this.caretCharIndex -= this.currentTokens[l].length;
			++l
		}
		if (l >= this.currentTokens.length) {
			l = -1
		} else {
			var j = this.currentTokens[l];
			if (j.indexOf(this.prefix) !== 0) {
				l = -1
			}
		}
		var m = this.caretTokenIndex;
		this.caretTokenIndex = l;
		if (m != this.caretTokenIndex) {
			Event.trigger(this, "indexchange", k, m)
		}
	};
	b.prototype.caretToken = function(k) {
		if (this.caretTokenIndex < 0) {
			return ""
		}
		var j = this.currentTokens[this.caretTokenIndex];
		if (k !== undefined) {
			if (this.currentTokens.length - 1 == this.caretTokenIndex) {
				k = k + " "
			}
			this.currentTokens[this.caretTokenIndex] = k
		}
		return j.substring(this.prefix.length)
	};
	b.prototype.getTokenEnd = function(j) {
		var l = 0;
		for (var k = 0; k < this.currentTokens.length; k++) {
			l += this.currentTokens[k].length;
			if (l > j) {
				break
			}
		}
		return l
	};
	b.prototype.reconstructValue = function(j) {
		return this.currentTokens.join("")
	};
	function c(n, p) {
		var k = n.parentNode;
		var m = n.nextSibling;
		this.highlight = createNode("div", {
			className : "highlight"
		});
		this.minHeight = (p.minHeight - c.lineHeight) || 200;
		if (this.minHeight % c.lineHeight) {
			this.minHeight += c.lineHeight - this.minHeight % c.lineHeight
		}
		this.maxHeight = p.maxHeight || this.minHeight;
		var l = {
			"overflow-y" : "hidden",
			"overflow-x" : "hidden",
			margin : 0,
			padding : "0 0 0 0",
			border : "none",
			width : "100%",
			position : "relative",
			backgroundColor : "transparent",
			height : px(this.minHeight + c.lineHeight)
		};
		var o = {};
		if (p.width) {
			o.width = px(p.width)
		}
		if (Browser.isIE) {
			l.overflow = "hidden"
		}
		this.area = n;
		var j = false;
		if (document.activeElement == this.area) {
			j = true
		}
		setNode(this.area, null, l);
		this.highlighter = createNode("div", {
			className : "highlighter"
		}, null, [this.highlight, this.area]);
		this.node = createNode("div", {
			className : "highlighter_chrome"
		}, o, this.highlighter);
		Event.addListener(this.area, "keydown", function() {
			yield(function() {
				this.updateSize(true)
			}, this)
		}, this);
		Event.addListener(this.area, "scroll", function() {
			this.updateSize(false)
		}, this);
		Event.addListener(a, "loaded", function() {
			this.updateHighlights(true)
		}, this);
		Event.addListener(h, "loaded", function() {
			this.updateHighlights(true)
		}, this);
		this.mentionsInputTokenizer = new b(this.area, {
			prefix : "@"
		});
		this.contactsAC = new AutoComplete(this.area, a, {
			inputTokenizer : this.mentionsInputTokenizer,
			onSelect : Event.wrapper(function(q) {
				this.onSelect("@" + q._data.user_name, this.mentionsInputTokenizer)
			}, this),
			skipInitialLoad : true,
			refreshOnInputChange : false,
			renderer : function(q) {
				return UI.renderPerson(q)
			},
			matcher : function(q, r) {
				return q.user_name.match(r)
			}
		});
		this.hashtagsInputTokenizer = new b(this.area, {
			prefix : "#"
		});
		this.hashtagsAC = new AutoComplete(this.area, h, {
			minChars : 0,
			maxSize : 10,
			inputTokenizer : this.hashtagsInputTokenizer,
			onSelect : Event.wrapper(function(q) {
				this.onSelect("#" + q._data.hashtag, this.hashtagsInputTokenizer)
			}, this),
			skipInitialLoad : true,
			refreshOnInputChange : false,
			renderer : function(q) {
				return q.hashtag
			},
			matcher : function(q, r) {
				return q.hashtag.match(r)
			}
		});
		Event.addListener(this.area, "focus", function() {
			a.ensureLoaded();
			h.ensureLoaded()
		}, this);
		Event.addListener(this.area, "change", function() {
			this.updateSize(true)
		}, this);
		yield(function() {
			this.updateSize(true)
		}, this);
		if (m) {
			k.insertBefore(this.node, m)
		} else {
			k.appendChild(this.node)
		}
		if (j) {
			this.area.focus()
		} else {
			if (this.area.value) {
				Event.addSingleUseListener(this.area, "focus", function() {
					g(this.area)
				}, this)
			}
		}
	}
	c.lineHeight = 14;
	c.prototype.onSelect = function(k, j) {
		var l = Browser.isIE ? d(this.area).start : getCaretPosition(this.area);
		j.caretToken(k);
		this.area.value = j.reconstructValue();
		this.updateSize(true);
		yield(function() {
			var m = j.getTokenEnd(l);
			if (Browser.isIE) {
				m = f(this.area, m)
			}
			g(this.area, m)
		}, this)
	};
	c.prototype.setNewStyles = function(m, l) {
		if (!this.oldStyles) {
			this.oldStyles = {}
		}
		var n = {};
		var k = false;
		if (this.oldStyles[m]) {
			var j = this.oldStyles[m];
			forEachKey(l, function(o, p) {
				if (!j[o] || j[o] !== p) {
					n[o] = p;
					k = true
				}
				j[o] = p
			})
		} else {
			k = true;
			n = l;
			this.oldStyles[m] = l
		}
		if (k) {
			setNode(m, null, n)
		}
	};
	c.prototype.updateSize = function(n) {
		var l = {};
		var j = {};
		if (!Browser.isIE) {
			this.setNewStyles(this.area, {
				height : 0
			})
		}
		var m = Math.max(this.area.scrollHeight, this.minHeight);
		if (this.maxHeight < m) {
			m = this.maxHeight;
			if (Browser.isIE) {
				l.overflow = ""
			}
			l["overflow-y"] = "auto"
		} else {
			if (Browser.isIE) {
				l.overflow = "hidden"
			}
			l["overflow-y"] = "hidden"
		}
		l.height = px(m + c.lineHeight);
		this.setNewStyles(this.area, l);
		var o = this.area.scrollTop;
		j.top = px(-o);
		var k = this.area.clientWidth;
		if (Browser.isFirefox) {
			k--
		}
		j.width = px(k);
		this.setNewStyles(this.highlight, j);
		if (n) {
			this.updateHighlights(false)
		}
	};
	c.prototype.updateHighlights = function(l) {
		var j = this.area.value;
		if (this.oldValue == j && !l) {
			return
		}
		this.oldValue = j;
		j = j.split(/\n/).join("<br/>");
		j = c._markUpWithMatches(/(@[a-z][a-z0-9\-]{3,31})/gi, a, j);
		j = c._markUpWithMatches(/(#[A-Za-z0-9][A-Za-z0-9\_]{0,98}[A-Za-z0-9])/g, h, j);
		var k;
		if (Browser.isIE) {
			k = "<pre>" + j + "</pre>"
		} else {
			k = j
		}
		setNode(this.highlight, null, null, k)
	};
	c._markUpWithMatches = function(l, k, j) {
		return j.replace(l, function(n, o) {
			if (k.contains(o.substring(1), function(q, p) {
				if (p.user_name) {
					return (q == p.user_name)
				}
				if (p.hashtag) {
					return (q.toLowerCase() == p.hashtag.toLowerCase())
				}
				return 0
			})) {
				className = "match found"
			} else {
				className = "match notfound"
			}
			var m = "<span class='" + className + "'>" + o + "</span>";
			if (Browser.isIE) {
				m = "</pre>" + m + "<pre>"
			}
			return m
		})
	};
	c.prototype.getNode = function() {
		return this.node
	};
	return {
		init : function(p, o) {
			var l = $(p);
			var k = Dim.fromNode(l);
			if (k.h === 0) {
				var m = function() {
					HighlightingTextarea.init(p, o)
				};
				window.setTimeout(m, 100);
				return
			}
			o = o || {};
			if (!a) {
				a = new AjaxDataSource("autocomplete.user_tagging", null, {
					hideProgress : true
				})
			}
			if (!h) {
				h = new AjaxDataSource("autocomplete.user_hashtags", null, {
					hideProgress : true
				})
			}
			o.minHeight = k.h - 10;
			if (o.maxHeight === undefined) {
				o.maxHeight = Math.max(300, k.h)
			}
			o.width = k.w - 10;
			var n = new c(l, o);
			if (o.attachments) {
				var j = new CommentAttachments(n)
			}
		}
	}
}();
function NavSearchBox(b, a) {
	a = a || {};
	this._submitCorpus = !!a.submitCorpus;
	this._searchSrc = a.searchSrc;
	this._node = $(b);
	this._corpusNode = this._node.querySelector(".corpus_label > span");
	this._inputNode = this._node.querySelector("input[name=query]");
	this._subnavNode = this._node.querySelector(".mod_subnav");
	this._initAutoComplete();
	this._toggleAutoComplete();
	Event.addListener(this._inputNode, "focus", this.focus, this);
	Event.addListener(this._inputNode, "blur", this.blur, this);
	var c = Event.wrapper(function(d) {
		var f = Event.getSource(d);
		if (!f || !domContainsChild(this._node, f)) {
			return
		}
		this.focus();
		if (f.href && domContainsChild(this._subnavNode, f)) {
			this.setCorpus(f.href);
			return Event.stop(d)
		}
	}, this);
	Event.addListener(this._node, "mousedown", c, this);
	Event.addListener(this._node, "click", c, this);
	Event.addListener(this._subnavNode, "mouseover", function(d) {
		if (this._autocomplete && this._autocomplete.isOpen) {
			this._autocomplete.closeList()
		}
	}, this)
}
NavSearchBox.prototype.setCorpus = function(b) {
	if (!isAbsURL(b) || !isPolyvoreURL(b)) {
		throw "url must be a fully-qualified polyvore url"
	}
	var a = toArray(this._subnavNode.querySelectorAll("li > a"));
	var d = parsePolyvoreURL(b).action;
	var c = a.filter(function(f){return d==parsePolyvoreURL(f.href).action})[0];
	if (!c) {
		throw "url is not a valid corpus"
	}
	if (hasClass(c.parentNode, "selected")) {
		return
	}
	a.forEach(function(f) {
		removeClass(f.parentNode, "selected")
	});
	setNode(this._node, {
		action : b
	});
	addClass(c.parentNode, "selected");
	setNode(this._corpusNode, null, null, textContent(c));
	if (this._inputNode.value || this._submitCorpus) {
		this._node.submit()
	}
	this._toggleAutoComplete()
};
NavSearchBox.prototype._initAutoComplete = function() {
	if (this._autoCompleteNode) {
		return
	}
	this._autoCompleteNode = createNode("div", {
		className : "accontainer"
	});
	var a = DataSourceDataManager.getShopACData();
	Event.addSingleUseListener(a, "loaded", function() {
		this._autocomplete = new GroupedObjectAutoComplete(this._inputNode, a, {
			container : this._autoCompleteNode,
			containerSizer : this._node,
			containerPositioner : this._node,
			maxTokens : 1,
			toggleOnLoaded : true,
			typeOrder : ["query", "category_id", "brand", "displayurl"],
			maxResults : {
				query : 8,
				category_id : 5,
				brand : 8,
				displayurl : 5
			},
			inputRenderer : function(b) {
				return b.title
			}
		});
		Event.addListener(this._autocomplete, "select", function(c) {
			var b = c._data;
			var d = {};
			d.ac_typed = this._inputNode.value;
			d[b.filter_type] = b.value;
			if (this._searchSrc) {
				d[".search_src"] = this._searchSrc
			}
			window.location = buildURL("shop", d)
		}, this);
		Event.addSingleUseListener(document, "modifiable", this._toggleAutoComplete, this)
	}, this);
	a.ensureLoaded()
};
NavSearchBox.prototype._toggleAutoComplete = function() {
	var a = parsePolyvoreURL(this._node.action);
	var b = this._autoCompleteNode;
	if (a.action == "shop") {
		document.body.appendChild(b)
	} else {
		if (b.parentNode) {
			b.parentNode.removeChild(b)
		}
	}
};
NavSearchBox.prototype.focus = function() {
	this._inputNode.focus();
	addClass(this._node, "focused")
};
NavSearchBox.prototype.blur = function(a) {
	this._inputNode.blur();
	removeClass(this._node, "focused")
};
var Facebook = function() {
	var c = {};
	var d = ["publish_stream", "email"];
	var f = ["publish_stream", "email", "publish_actions"];
	var b = [{
		name : "fb_post_all",
		label : loc("Enable all actions")
	}];
	var a = function(g) {
		if (window.fbInitialized) {
			g.call()
		} else {
			window.setTimeout(function() {
				a(g)
			}, 50)
		}
	};
	return {
		permissions : function() {
			return d
		},
		connectPermissions : function() {
			return f
		},
		login : function(g) {
			if (!g) {
				g = {}
			}
			var j = g.permissions || d.join(",");
			var h = g.facebookHandler || Facebook.handleConnect;
			a(function() {
				Track.stat("inc", "facebook", ["connect", "login"]);
				Event.trigger(Facebook, "connect_view");
				FB.login(function(k) {
					h(k, g)
				}, {
					scope : j
				})
			})
		},
		handleConnectSimple : function(h, j) {
			j = j || {};
			j.data = j.data || {};
			var l = j.onCancel || noop;
			var k = j.onSignIn || noop;
			var m = j.onRegister || noop;
			if (!h || !h.authResponse || !h.authResponse.accessToken) {
				l();
				return
			}
			var g = {
				fb_sig_session_key : h.authResponse.accessToken,
				fb_sig_user : h.authResponse.userID,
				page : j.data.page,
				src : j.data.src
			};
			Event.bundleEvents(Event.BACKEND, "oauth_connect");
			Ajax.post({
				action : "fb-connect.login",
				data : g,
				onSuccess : function(o) {
					if (o.new_user) {
						m(o);
						var n = {
							name : "facebook",
							src : j.data.src,
							page : j.data.page,
							client : isHTMLMobile() ? "html_mobile" : "desktop"
						};
						Beacon.log("register", n)
					} else {
						k(o)
					}
					Event.unbundleEvents(Event.BACKEND, "oauth_connect")
				}
			})
		},
		handleConnect : function(h, j) {
			j = j || {};
			j.data = j.data || {};
			var k = j.doRedirect;
			var m = j.onSuccess || noop;
			var l = j.onCancel || noop;
			if (!h.authResponse || !h.authResponse.accessToken) {
				Track.stat("inc", "facebook", ["connect", "login", "cancel"]);
				l.call();
				return
			}
			Track.stat("inc", "facebook", ["connect", "login", "ok"]);
			var g = {
				fb_sig_session_key : h.authResponse.accessToken,
				fb_sig_user : h.authResponse.userID,
				page : j.data.page,
				src : j.data.src
			};
			Event.bundleEvents(Event.BACKEND, "oauth_connect");
			yield(function() {
				var n = {
					name : "facebook",
					src : j.data.src,
					page : j.data.page,
					client : isHTMLMobile() ? "html_mobile" : "desktop"
				};
				Ajax.post({
					action : "fb-connect.login",
					data : g,
					onSuccess : function(q) {
						var p = j.done || buildURL("home");
						var o = function() {
							Event.unbundleEvents(Event.BACKEND, "oauth_connect");
							m.call();
							if (k) {
								Event.trigger(window, "navigate_start", p);
								window.location.href = p
							}
						};
						if (isHTMLMobile()) {
							Beacon.log("register", n);
							o()
						} else {
							if (q.new_user) {
								Beacon.log("register", n);
								ChangeNameDialog.show({
									onSuccess : o
								})
							} else {
								if (q.show_ticker && window.Share && window.Share.facebookTickerDialog) {
									var r;
									if (q.has_seen_old_ticker) {
										r = Share.facebookTickerDialog("new", q.account_info)
									} else {
										r = Share.facebookTickerDialog("old", q.account_info)
									}
									Event.addSingleUseListener(r, "done", function() {
										o()
									})
								} else {
									o()
								}
							}
						}
					}
				})
			})
		},
		link : function(g) {
			var h = g.permissions || d.join(",");
			a(function() {
				Track.stat("inc", "facebook", ["connect", "link"]);
				FB.login(function(j) {
					if (j.authResponse) {
						Track.stat("inc", "facebook", ["connect", "link", "ok"]);
						Event.bundleEvents(Event.BACKEND, "oauth_connect");
						Ajax.post({
							busyMsg : loc("Linking accounts") + "...",
							action : "fb-connect.link",
							data : {
								fb_sig_session_key : j.authResponse.accessToken,
								fb_sig_user : j.authResponse.userID,
								accept_all_ticker_perms : g.acceptAllTickerPerms
							},
							onSuccess : function(l) {
								if (g.onSuccess) {
									g.onSuccess.call()
								}
								if (g.doRedirect) {
									var k = g.done || buildURL("home");
									Event.trigger(window, "navigate_start", k);
									window.location.href = k
								}
							},
							onError : g.onError,
							onFinally : function() {
								if (g.onFinally) {
									g.onFinally.call()
								}
								Event.unbundleEvents(Event.BACKEND, "oauth_connect")
							}
						})
					} else {
						Track.stat("inc", "facebook", ["connect", "link", "cancel"])
					}
				}, {
					scope : h
				})
			})
		},
		checkUserLoggedIn : function(h, g) {
			a(function() {
				FB.getLoginStatus(function(j) {
					if (j.status == "connected") {
						h.call()
					} else {
						g.call()
					}
				})
			})
		},
		hasPermissions : function(g, h) {
			if (!g) {
				g = d
			}
			a(function() {
				FB.getLoginStatus(function(j) {
					if (j.status == "not_authorized") {
						h.call(this, false);
						return
					}
					var l = "SELECT status_update, photo_upload, sms, offline_access, email, create_event, rsvp_event, publish_stream, read_stream, share_item, create_note, bookmarked, user_photos, friends_photos, user_photo_video_tags, friends_photo_video_tags, user_activities, friends_activities, publish_actions FROM permissions WHERE uid={0}";
					var k = [j.authResponse.userID];
					Facebook.fql(l, k, function(m) {
						m = m[0];
						for (var n = 0; n < g.length; n++) {
							if (!m[g[n]] || m[g[n]] == "0") {
								h.call(this, false);
								return
							}
						}
						h.call(this, true)
					})
				})
			})
		},
		fql : function(h, g, j) {
			a(function() {
				var k = FB.Data.query(h, g);
				k.wait(function(l) {
					j.call(this, l)
				})
			})
		},
		tickerGrouping : function() {
			return b
		}
	}
}();
var Twitter = function() {
	return {
		login : function(a) {
			if (!a) {
				a = {}
			}
			var b = a.twitterHandler || Twitter.handleConnect;
			a.onSuccess = function() {
				Event.trigger(window, "navigate_start", buildURL("home"));
				window.location.href = buildURL("home")
			};
			b(a)
		},
		handleConnectSimple : function(b) {
			b = b || {};
			b.data = b.data || {};
			var g = b.signin;
			var d = b.onCancel || noop;
			var c = b.onSignIn || noop;
			var f = b.onRegister || noop;
			Event.bundleEvents(Event.BACKEND, "oauth_connect");
			var a = openWindow("twitter_oauth", buildURL("twitter-connect.login", {
				signin : g
			}), 800, 600);
			a.focus();
			Event.addListener(Event.BACKEND, "twitter_registration", function(h) {
				var j = {
					name : "twitter",
					src : b.data.src,
					page : b.data.page,
					client : "desktop"
				};
				Beacon.log("register", j);
				a.close();
				if (h) {
					h.src = b.data.src;
					h.page = b.data.page;
					f(h)
				} else {
					c()
				}
				Event.unbundleEvents(Event.BACKEND, "oauth_connect")
			});
			Event.addListener(Event.BACKEND, "twitter_registration_error", function() {
				a.close();
				Event.unbundleEvents(Event.BACKEND, "oauth_connect")
			})
		},
		handleConnect : function(b) {
			b = b || {};
			var g = b.signin;
			var d = b.onCancel || noop;
			var c = b.onSignIn || noop;
			var f = b.onRegister || noop;
			Event.bundleEvents(Event.BACKEND, "oauth_connect");
			var a = openWindow("twitter_oauth", buildURL("twitter-connect.login", {
				signin : g
			}), 800, 600);
			a.focus();
			Event.addListener(Event.BACKEND, "twitter_registration", function(j) {
				var k = {
					name : "twitter",
					src : b.data.src,
					page : b.data.page,
					client : "desktop"
				};
				Beacon.log("register", k);
				a.close();
				var l = b.done || buildURL("home");
				var h = function() {
					Event.trigger(window, "navigate_start", l);
					window.location.href = l
				};
				if (j) {
					j.src = b.data.src;
					j.page = b.data.page;
					Twitter.showTwitterRegistration({
						twitterInfo : j
					});
					Event.addSingleUseListener(ChangeNameDialog, "twitter_done", function(m) {
						Event.unbundleEvents(Event.BACKEND, "oauth_connect");
						if (isHTMLMobile()) {
							h()
						} else {
							ChangeNameDialog.show({
								onSuccess : function() {
									FindFriends.servicesDialog("find", Auth.user().name);
									Event.addSingleUseListener(FindFriends, "done", function() {
										Event.trigger(window, "navigate_start", l);
										window.location.href = l
									})
								}
							})
						}
					})
				} else {
					h()
				}
			});
			Event.addListener(Event.BACKEND, "twitter_registration_error", function() {
				a.close();
				Event.unbundleEvents(Event.BACKEND, "oauth_connect")
			})
		},
		showTwitterRegistration : function(a) {
			a = a || {};
			var g = a.twitterInfo;
			var f = a.onCancel || noop;
			var d = a.onSuccess || noop;
			Track.stat("inc", "twitter", ["ShowTwitterRegistration", "start"]);
			var c = createNode("div", {
				id : "change_name_dialog"
			}, null, [createNode("h2", null, null, loc("Complete your registration")), createNode("br")]);
			var b = new Form({
				inputs : [{
					type : "email",
					name : "email",
					label : loc("Email"),
					required : true
				}, {
					type : "hidden",
					name : "src",
					value : g.src
				}, {
					type : "hidden",
					name : "page",
					value : g.page
				}, {
					type : "checkbox",
					id : "followPolyvore",
					name : "followPolyvore",
					value : loc("Also follow Polyvore on Twitter"),
					className : "slim",
					checked : 1
				}, {
					type : "html",
					value : createNode("div", {
						className : "error",
						id : "create_polyvore_twitter_account_error"
					})
				}, {
					type : "buttons",
					buttons : [{
						id : "registerButton",
						type : "submit",
						label : loc("Create account")
					}, {
						type : "cancel",
						label : loc("Cancel"),
						onClick : ModalDialog.hide
					}]
				}, {
					type : "html",
					value : createNode("div", {
						id : "terms_privacy",
						className : "meta"
					}, null, loc("By clicking {register} you are indicating that you have read and agreed to the {terms} and {policy}", {
						register : createNode("strong", null, null, loc("Create account")),
						terms : outerHTML(createNode("a", {
							href : buildURL("terms-of-service")
						}, null, loc("Terms of Service"))),
						policy : outerHTML(createNode("a", {
							href : buildURL("privacy-policy")
						}, null, loc("Privacy Policy")))
					}))
				}]
			});
			c.appendChild(b.getNode());
			Event.addListener(b, "submit", function(j) {
				var h = $("registerButton");
				setNode(h, {
					value : loc("Creating account") + "...",
					disabled : "disabled"
				});
				var k = b.getData();
				Ajax.post({
					action : "twitter-connect.create_polyvore_twitter_account",
					data : {
						email : k.email,
						follow_polyvore : k.followPolyvore,
						twitter_info : g,
						page : k.page,
						src : k.src
					},
					onSuccess : function(l) {
						ModalDialog.hide();
						d(l);
						Event.trigger(ChangeNameDialog, "twitter_done", l)
					},
					onError : function(l) {
						var m = $("create_polyvore_twitter_account_error");
						setNode(m, null, null, l.message[0].content);
						setNode(h, {
							value : loc("Create account")
						});
						h.removeAttribute("disabled");
						ModalDialog.rePosition();
						Event.addListener(Event.BACKEND, "create_account_error", function() {
							ModalDialog.hide()
						})
					}
				});
				return Event.stop(j)
			});
			return ModalDialog.show_uic(c)
		}
	}
}();
function Undo(a) {
	a = a || {};
	this._maxHistory = Math.max(a.maxHistory, 2) || 30;
	this.clear()
}
Undo.prototype.clear = function() {
	this._past = [];
	this._future = [];
	this._present = null
};
Undo.prototype.push = function(b) {
	var a = null;
	if (this._present) {
		this._past.push(this._present);
		if (this._past.length > this._maxHistory) {
			a = this._past.shift()
		}
		this._future = []
	}
	this._present = b;
	return a
};
Undo.prototype.undo = function() {
	var a = null;
	if (this.canUndo()) {
		this._future.unshift(this._present);
		this._present = this._past.pop();
		a = this._present
	}
	return a
};
Undo.prototype.redo = function() {
	var a = null;
	if (this.canRedo()) {
		this._past.push(this._present);
		this._present = this._future.shift();
		a = this._present
	}
	return a
};
Undo.prototype.canUndo = function() {
	return this._past.length > 0
};
Undo.prototype.canRedo = function() {
	return this._future.length > 0
};
Undo.prototype.present = function() {
	return this._present
};
function Canvas() {
	this._items = [];
	this._view = {
		origin : new Point(0, 0),
		zoom : 1
	}
}
Canvas.prototype.init = function(b, a) {
	this._node = b;
	if (a || a === undefined) {
		if (isHTMLMobile()) {
			this._selected = new TouchSelectedItems(this._node)
		} else {
			this._selected = new SelectedItems(this._node)
		}
	} else {
		this._selected = new NoopSelectedItems()
	}
	addClass(this._node, "unlocked");
	Event.addListener(this._selected, "beginmove", function() {
		Event.bundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "endmove", function() {
		Event.unbundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "beginrotate", function() {
		Event.bundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "endrotate", function() {
		Event.unbundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "beginresize", function() {
		Event.bundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "endresize", function() {
		Event.unbundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "beginMethodOnItems", function() {
		Event.bundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "endMethodOnItems", function() {
		Event.unbundleEvents(this, "change")
	}, this);
	Event.addListener(this._selected, "movingitems", this._onHandleMovingItems, this);
	addClass(b, "empty");
	this._empty = b.appendChild(createNode("div", {
		className : "emptymsg"
	}));
	this.fakeInput = createNode("input", {
		id : "fakeInput"
	});
	if (isHTMLMobile()) {
		return
	}
	this.setEmptyMessage(loc("Drag items here"));
	b.appendChild(this.fakeInput);
	try {
		this.fakeInput.focus()
	} catch(c) {
	}
	Event.addListener(this._node, Browser.isFirefox ? "keypress" : "keydown", function(h) {
		if (h.keyCode == 9 && !this.locked) {
			var f = -1;
			var g = this._items.length;
			this._selected.values().forEach(function(j) {
				f = Math.max(f, j.z - 1);
				g = Math.min(g, j.z - 1)
			});
			this.clearSelection();
			var d;
			if (h.shiftKey) {
				d = g - 1
			} else {
				d = f + 1
			}
			d = (d + this._items.length) % this._items.length;
			if (this._items[d]) {
				this.select(this._items[d])
			}
			return Event.stop(h)
		} else {
			if (h.keyCode == 27) {
				this.clearSelection();
				this.multiSelect.cancel();
				this.fakeInput.focus();
				return Event.stop(h)
			}
		}
	}, this);
	Event.addListener(b, "mousedown", this.onMouseDown, this);
	Event.addListener(b, "keydown", this.onKeyDown, this);
	Event.addListener(document, "keyup", this.onKeyUp, this);
	Event.addListener(window, "blur", function() {
		if (!this.locked) {
			this._selected.show()
		}
	}, this);
	this.multiSelect = new MultiSelect(b);
	Event.addListener(this.multiSelect, "selected", function() {
		Event.bundleEvents(this, "select");
		this.multiSelect.forEach(function(d) {
			this.select(d)
		}, this);
		if (!this.locked && !this._selectionModifier) {
			this._selected.show()
		}
		Event.unbundleEvents(this, "select")
	}, this)
};
Canvas.prototype.getNode = function() {
	return this._node
};
Canvas.prototype.setEmptyMessage = function(a) {
	setNode(this._empty, null, null, a)
};
Canvas.prototype.appendControl = function(a) {
	Event.addListener(a, "mousedown", Event.stopBubble);
	Event.addListener(a, "keydown", Event.stopBubble);
	return this._node.appendChild(a)
};
Canvas.prototype.getSelected = function() {
	return this._selected
};
Canvas.prototype.getCanvasSize = function() {
	return Dim.fromNode(this._node)
};
Canvas.prototype.getBounds = function() {
	var a = new Rect(Infinity, Infinity, -Infinity, -Infinity);
	this.getItems().forEach(function(b) {
		a.expand(b.getBounds())
	});
	return a
};
Canvas.prototype.getView = function() {
	return cloneObject(this._view, true)
};
Canvas.prototype.gotoView = function(a) {
	this.slide((a.origin.x - this._view.origin.x) * this._view.zoom, (a.origin.y - this._view.origin.y) * this._view.zoom);
	this.zoom(a.zoom / this._view.zoom);
	this._selected.redraw()
};
Canvas.prototype.fit = function(h) {
	var g = this.getBounds();
	var j = g.dim();
	var d = this.getCanvasSize();
	var f = Math.min(d.w / j.w, d.h / j.h) / 1.3;
	if (!h && f > 1 && f < 10) {
		f = 1
	}
	var a = new Point(d.w / 2, Math.round(d.h / 2 * 1.05));
	var c = a.x - (g.x1 + j.w / 2);
	var b = a.y - (g.y1 + j.h / 2);
	this.slide(c, b);
	this.zoom(f);
	this._selected.redraw()
};
Canvas.prototype.slide = function(b, a) {
	if (b === 0 && a === 0) {
		return
	}
	this._view.origin.x += b / this._view.zoom;
	this._view.origin.y += a / this._view.zoom;
	Event.pauseEvents(this, "change");
	this.getItems().forEach(function(c) {
		c.beginMove();
		c.move(b, a, false, true);
		c.endMove()
	});
	Event.unpauseEvents(this, "change")
};
Canvas.prototype.zoom = function(c) {
	if (c == 1) {
		return
	}
	var b = this.getCanvasSize();
	var a = new Point(b.w / 2, b.h / 2);
	this._view.zoom *= c;
	var d = new Point(c, c);
	Event.pauseEvents(this, "change");
	this._items.forEach(function(f) {
		f.setScale(d, a)
	});
	Event.unpauseEvents(this, "change")
};
Canvas.prototype.select = function(a) {
	if (a.unselectable) {
		return
	}
	this._selected.add(a);
	this.fakeInput.focus();
	if (!this.locked && !this._selectionModifier && !this._handlesRedraw) {
		this._handlesRedraw = yield(function() {
			delete this._handlesRedraw;
			this._selected.show()
		}, this)
	}
	Event.trigger(this, "select", a);
	Event.addListener(a, "updateactions", this.onUpdateActions, this)
};
Canvas.prototype.selectAll = function() {
	if (this.locked || this._selected.moving) {
		return
	}
	var a = null;
	this._items.forEach(function(b) {
		if (!b.unselectable && !this._selected.contains(b)) {
			this._selected.add(b);
			Event.addListener(b, "updateactions", this.onUpdateActions, this);
			a = b
		}
	}, this);
	Event.trigger(this, "select", a);
	this.fakeInput.focus();
	this._selected.show()
};
Canvas.prototype.unselect = function(a) {
	this._selected.remove(a);
	a.unselect();
	Event.removeListener(a, "updateactions", this.onUpdateActions, this);
	Event.trigger(this, "unselect", a)
};
Canvas.prototype.onUpdateActions = function(a) {
	Event.trigger(this, "updateactions", a)
};
Canvas.prototype.removeSelected = function() {
	var a = [];
	Event.pauseEvents(this, "change");
	Event.pauseEvents(this, "removeitem");
	var b = this._selected.values();
	this.clearSelection();
	b.forEach(function(d) {
		var c;
		if (this.locked) {
			if (d.clearContent) {
				c = d.clearContent();
				if (c) {
					this.unselect(d)
				}
			}
		} else {
			this.removeItem(d);
			c = d
		}
		if (c) {
			a.push(c)
		}
	}, this);
	Event.unpauseEvents(this, "change");
	Event.unpauseEvents(this, "removeitem");
	if (a.length) {
		Event.trigger(this, "removeitem", a);
		Event.trigger(this, "change")
	}
};
Canvas.prototype.cloneSelected = function() {
	var a = [];
	Event.bundleEvents(this, "change");
	Event.bundleEvents(this, "select");
	this._selected.forEach(function(b) {
		var c = b.clone();
		c.move(20, 20, false, true);
		a.push(c)
	}, this);
	a.sort(function(d, c) {
		return d.z - c.z
	}).forEach(function(b) {
		this.addItem(b)
	}, this);
	if (this._selected.size()) {
		this._selected.clear({
			keepMatrix : true
		})
	}
	a.forEach(function(b) {
		this.select(b)
	}, this);
	this._selected.show();
	Event.unbundleEvents(this, "select");
	Event.unbundleEvents(this, "change")
};
Canvas.prototype.raiseSelected = function(a) {
	this.raiseItems(this._selected.values(), a.shiftKey)
};
Canvas.prototype.lowerSelected = function(a) {
	this.lowerItems(this._selected.values(), a.shiftKey)
};
Canvas.prototype.arrangeTopSelected = function(b) {
	var a = this._selected;
	if (a.size() < 2) {
		return
	}
	Event.bundleEvents(this, "change");
	var c = a.getRect().top();
	a.forEach(function(d) {
		d.beginMove();
		d.move(0, c - d.getBounds().top());
		d.endMove()
	});
	Event.unbundleEvents(this, "change");
	a.redraw()
};
Canvas.prototype.arrangeBottomSelected = function(c) {
	var b = this._selected;
	if (b.size() < 2) {
		return
	}
	var a = b.getRect().bottom();
	Event.bundleEvents(this, "change");
	b.forEach(function(d) {
		d.beginMove();
		d.move(0, a - d.getBounds().bottom());
		d.endMove()
	});
	Event.unbundleEvents(this, "change");
	b.redraw()
};
Canvas.prototype.arrangeMiddleSelected = function(d) {
	var c = this._selected;
	if (c.size() < 2) {
		return
	}
	var a = c.values();
	var b = consensusOrMediod(2, a.map(function(f) {
		return f.getRect().center().y
	}));
	Event.bundleEvents(this, "change");
	c.forEach(function(f) {
		f.beginMove();
		f.move(0, b - f.getRect().center().y);
		f.endMove()
	});
	Event.unbundleEvents(this, "change");
	c.redraw()
};
Canvas.prototype.arrangeLeftSelected = function(b) {
	var a = this._selected;
	if (a.size() < 2) {
		return
	}
	var c = a.getRect().left();
	Event.bundleEvents(this, "change");
	a.forEach(function(d) {
		d.beginMove();
		d.move(c - d.getBounds().left(), 0);
		d.endMove()
	});
	Event.unbundleEvents(this, "change");
	a.redraw()
};
Canvas.prototype.arrangeRightSelected = function(c) {
	var b = this._selected;
	if (b.size() < 2) {
		return
	}
	var a = b.getRect().right();
	Event.bundleEvents(this, "change");
	b.forEach(function(d) {
		d.beginMove();
		d.move(a - d.getBounds().right(), 0);
		d.endMove()
	});
	Event.unbundleEvents(this, "change");
	b.redraw()
};
Canvas.prototype.arrangeCenterSelected = function(d) {
	var c = this._selected;
	if (c.size() < 2) {
		return
	}
	var b = c.values();
	var a = consensusOrMediod(2, b.map(function(f) {
		return f.getRect().center().x
	}));
	Event.bundleEvents(this, "change");
	c.forEach(function(f) {
		f.beginMove();
		f.move(a - f.getRect().center().x, 0);
		f.endMove()
	});
	Event.unbundleEvents(this, "change");
	c.redraw()
};
Canvas.prototype.arrangeSpreadHSelected = function(a) {
	var d = this._selected;
	if (d.size() < 2) {
		return
	}
	var h = d.values();
	var b = d.getRect().width();
	var f = h.map(function(l) {
		return l.getBounds().width()
	}).reduce(function(m, l) {
		return m + l
	});
	var k = Math.max(b - f, 0);
	k = k / (d.size() - 1);
	var g = h.sort(function(m, l) {
		return m.getBounds().left() - l.getBounds().left()
	});
	var c = g[0];
	var j = c.getBounds().left();
	Event.bundleEvents(this, "change");
	g.forEach(function(m) {
		var l = m.getBounds();
		m.beginMove();
		m.move(j - l.left(), 0);
		m.endMove();
		j += l.width() + k
	});
	Event.unbundleEvents(this, "change");
	d.redraw()
};
Canvas.prototype.arrangeSpreadVSelected = function(a) {
	var c = this._selected;
	if (c.size() < 2) {
		return
	}
	var f = c.values();
	var k = c.getRect().height();
	var b = f.map(function(l) {
		return l.getBounds().height()
	}).reduce(function(m, l) {
		return m + l
	});
	var j = Math.max(k - b, 0);
	j = j / (c.size() - 1);
	var d = f.sort(function(m, l) {
		return m.getBounds().top() - l.getBounds().top()
	});
	var h = d[0];
	Event.bundleEvents(this, "change");
	var g = h.getBounds().top();
	d.forEach(function(m) {
		var l = m.getBounds();
		m.beginMove();
		m.move(0, g - l.top());
		m.endMove();
		g += l.height() + j
	});
	Event.unbundleEvents(this, "change");
	c.redraw()
};
Canvas.prototype.clearSelection = function() {
	if (this._selected.size()) {
		this._selected.clear();
		Event.trigger(this, "unselect")
	}
};
Canvas.prototype.onMouseDown = function(b) {
	this.fakeInput.focus();
	var c = Event.getSource(b);
	while (c && (c != this._node)) {
		if (c._data && !c._data.unselectable) {
			var a = c._data;
			if (!this.locked && Canvas.isSelectionModifier(b)) {
				if (this._selected.contains(a)) {
					this.unselect(a)
				} else {
					this.select(a)
				}
			} else {
				if (!this._selected.contains(a)) {
					this.clearSelection();
					this.select(a)
				}
			}
			this._selected.onMouseDown(b);
			break
		}
		if (c.nodeName == "A") {
			return true
		}
		c = c.parentNode
	}
	if (!c || c == this._node) {
		if (!Canvas.isSelectionModifier(b)) {
			this.clearSelection()
		}
		if (this.multiSelect && !this.locked && this._items.length > 0) {
			this.multiSelect.beginMultiSelect(b, this._items, this._selected)
		}
	}
	return Event.stop(b)
};
Canvas.isSelectionModifier = Browser.isMac ? function(a) {
	if (a.type == "keyup") {
		return a.keyCode == 224 || a.keyCode == 91 || a.keyCode == 93
	} else {
		return a.metaKey
	}
} : function(a) {
	if (a.type == "keyup") {
		return a.keyCode == 17 || a.keyCode == 16
	} else {
		return a.ctrlKey || a.shiftKey
	}
};
Canvas.prototype.onKeyDown = function(d) {
	if (!this._selected.size()) {
		return
	}
	if (Canvas.isSelectionModifier(d)) {
		this._selected.hide();
		this._selectionModifier = true
	}
	var b, a, c;
	switch(d.keyCode) {
		case 8:
		case 46:
			this.removeSelected();
			c = true;
			break;
		case 37:
			b = -1;
			a = 0;
			break;
		case 38:
			b = 0;
			a = -1;
			break;
		case 39:
			b = 1;
			a = 0;
			break;
		case 40:
			b = 0;
			a = 1;
			break
	}
	if (d.shiftKey) {
		b *= 10;
		a *= 10
	}
	if (b || a) {
		this._selected.beginMove(d);
		this._selected.move(b, a);
		this._selected.endMove();
		c = true
	}
	if (c) {
		return Event.stop(d)
	}
};
Canvas.prototype.onKeyUp = function(a) {
	if (!this.locked && Canvas.isSelectionModifier(a)) {
		this._selected.show();
		this._selectionModifier = false
	}
};
Canvas.prototype.freeze = function() {
	var a = [];
	this._items.forEach(function(b) {
		a.push(b.freeze())
	});
	return {
		items : a,
		view : this.getView()
	}
};
Canvas.prototype.thaw = function(c) {
	var b = c.items;
	var a = false;
	b.forEach(function(d) {
		if (a) {
			return
		}
		try {
			this.addItem(Item.thaw(d))
		} catch(f) {
			if (f.name == "pv_notsupported") {
				Feedback.message([loc("Sorry!") + " " + loc("One or more items cannot be displayed."), f.message].join("<br>"));
				a = true
			} else {
				throw f
			}
		}
	}, this);
	if (a) {
		this.clear()
	}
	if (c.view) {
		this._view = cloneObject(c.view, true)
	} else {
		this._view = {
			origin : new Point(0, 0),
			zoom : 1
		}
	}
};
Canvas.prototype.raiseItems = function(c, h) {
	var g, j;
	if (c.length == 1 && !h) {
		j = c[0];
		g = this._items.find(j);
		if (g + 1 < this._items.length) {
			this._items.swap(g, g + 1);
			j.setZIndex(g + 2);
			this._items[g].setZIndex(g + 1);
			Event.trigger(this, "change")
		}
		return
	} else {
		var f = false;
		var k = [];
		k.length = this._items.length;
		c.sort(zSort);
		var a = this._items.length - 1;
		var b = {};
		c.forEachReverse(function(n) {
			var m = n.z - 1;
			var l = h ? a : Math.min(m + 1, a);
			f = f || (l != m);
			k[l] = n;
			b[m] = l;
			a = l - 1
		});
		if (!f) {
			return
		}
		var d = this._items.length - 1;
		for ( g = this._items.length - 1; g >= 0; --g) {
			j = this._items[g];
			if (b[g] !== undefined) {
				d = b[g]
			} else {
				while (k[d]) {--d
				}
			}
			j.setZIndex(d + 1);
			k[d] = j;
			--d
		}
		this._items = k;
		Event.trigger(this, "change")
	}
};
Canvas.prototype.lowerItems = function(d, b) {
	var h, j;
	if (d.length == 1 && !b) {
		j = d[0];
		h = this._items.find(j);
		if (h > 0) {
			this._items.swap(h, h - 1);
			j.setZIndex(h);
			this._items[h].setZIndex(h + 1);
			Event.trigger(this, "change")
		}
		return
	} else {
		var g = false;
		var k = [];
		k.length = this._items.length;
		d.sort(zSort);
		var a = 0;
		var c = {};
		d.forEach(function(n) {
			var m = n.z - 1;
			var l = b ? a : Math.max(m - 1, a);
			g = g || (l != m);
			k[l] = n;
			c[m] = l;
			a = l + 1
		});
		if (!g) {
			return
		}
		var f = 0;
		for ( h = 0; h < this._items.length; ++h) {
			j = this._items[h];
			if (c[h] !== undefined) {
				f = c[h]
			} else {
				while (k[f]) {++f
				}
			}
			j.setZIndex(f + 1);
			k[f] = j;
			++f
		}
		this._items = k;
		Event.trigger(this, "change")
	}
};
Canvas.prototype.centerItem = function(a) {
	var b = this.getCanvasSize();
	a.move(-a.translation.x + b.w / 2, -a.translation.y + b.h / 2)
};
Canvas.prototype.addItem = function(b) {
	if (this.locked) {
		return
	}
	this._items.push(b);
	b.setZIndex(this._items.length);
	var a = b.getNode();
	makeUnselectable(a);
	this._node.appendChild(a);
	b.redraw();
	Event.addListener(b, "change", this.onItemChange, this);
	Event.addListener(b, "additem", this.onItemAddItem, this);
	Event.addListener(b, "removeitem", this.onItemRemoveItem, this);
	if ( b instanceof TextItem) {
		Event.addListener(b, "change", function() {
			yield(this._selected.redraw, this._selected)
		}, this)
	}
	Event.trigger(this, "additem", [b]);
	Event.trigger(this, "change");
	if (this._items.length == 1) {
		removeClass(this._node, "empty");
		Event.trigger(this, "notempty")
	}
	if (Browser.isIE) {
		this._items.forEach(function(f) {
			if (!( f instanceof PlaceholderItem)) {
				return
			}
			if (!f._template_proxy) {
				var d = this._node.appendChild(createNode("div", {
					className : "template_proxy"
				}));
				d._proxy_sizer = d.appendChild(createNode("div", {
					className : "proxy_sizer"
				}));
				var c = f.getMatrix();
				if (c) {
					c.apply(d, f)
				}
				f._template_proxy = d;
				d._data = f
			}
		}, this)
	}
	return true
};
Canvas.prototype.removeItem = function(a) {
	this._removeItem(a);
	Event.trigger(this, "removeitem", [a]);
	Event.trigger(this, "change")
};
Canvas.prototype._removeItem = function(a) {
	Event.removeListener(a, "change", this.onItemChange, this);
	Event.removeListener(a, "additem", this.onItemAddItem, this);
	Event.removeListener(a, "removeitem", this.onItemRemoveItem, this);
	this.unselect(a);
	this._items.remove(a);
	a.destruct();
	if (a._template_proxy) {
		domRemoveNode(a._template_proxy);
		a._template_proxy = null
	}
	if (this._items.length === 0) {
		addClass(this._node, "empty");
		Event.trigger(this, "empty")
	}
};
Canvas.prototype.getItems = function() {
	return this._items
};
Canvas.prototype.itemCount = function() {
	return this._items.length
};
Canvas.prototype.clear = function() {
	var a = [];
	while (this._items.length) {
		var b = this._items[0];
		this._removeItem(b);
		a.push(b)
	}
	if (a.length) {
		Event.trigger(this, "removeitem", a);
		Event.trigger(this, "change")
	}
};
Canvas.prototype.lock = function() {
	this._selected.hide();
	this.clearSelection();
	if (Browser.isIE) {
		var a = this._items.length + 2;
		this._items.forEach(function(f) {
			f.setSelectable(false);
			if (!f._template_proxy) {
				return
			}
			var d = f.getRect();
			var c = f._template_proxy;
			var b = f.getMatrix();
			if (b) {
				b.apply(c, f)
			}
			setNode(c, null, {
				zIndex : f.z + a,
				top : px(d.top()),
				left : px(d.left())
			});
			setNode(c._proxy_sizer, null, {
				width : px(d.width()),
				height : px(d.height())
			})
		}, this)
	} else {
		this._items.forEach(function(b) {
			b.setSelectable(false)
		})
	}
	this.locked = true;
	removeClass(this._node, "unlocked")
};
Canvas.prototype.unlock = function() {
	this._items.forEach(function(a) {
		a.setSelectable(true)
	});
	this._selected.show();
	this.clearSelection();
	this.locked = false;
	addClass(this._node, "unlocked")
};
Canvas.prototype.containsPlaceholder = function() {
	var a = this.getItems();
	for (var b = 0; b < a.length; ++b) {
		if (a[b] instanceof PlaceholderItem) {
			return true
		}
	}
	return false
};
Canvas.prototype.clearPlaceholders = function() {
	Event.bundleEvents(this, "change");
	this.getItems().forEach(function(a) {
		if (a.clearContent) {
			if (a.clearContent()) {
				this.unselect(a)
			}
		}
	}, this);
	Event.unbundleEvents(this, "change")
};
Canvas.prototype.onItemChange = function() {
	Event.trigger(this, "change")
};
Canvas.prototype.onItemAddItem = function(a, b) {
	if (b && this.previousPlaceholder) {
		this.previousPlaceholder.setContent(Item.thaw(b), true)
	}
	this.clearSelection();
	if (a && a.placeholder) {
		this.select(a.placeholder)
	}
	Event.trigger(this, "additem", [a])
};
Canvas.prototype.onItemRemoveItem = function(a) {
	Event.trigger(this, "removeitem", [a])
};
Canvas.prototype._onHandleMovingItems = function(f, b) {
	delete this.previousPlaceholder;
	if ((b || []).length != 1) {
		return
	}
	var d = b[0].item;
	var h = b[0].desiredPoint;
	if (!h || !( d instanceof PlaceholderItem)) {
		return
	}
	var c = d.getContent();
	if (!c) {
		return
	}
	var g = 15;
	var j = c.getRect().center();
	if (j.distance(h) < g) {
		return
	}
	Event.bundleEvents(this, "change");
	Event.pauseEvents(this, "removeitem");
	Event.pauseEvents(this, "additem");
	var a = c.freeze();
	d.clearContent();
	this._selected.onMouseUp(f);
	this.clearSelection();
	Event.addSingleUseListener(this._node, "dragstart", function(k) {
		k.xDataTransfer.setData("item", a);
		k.xDataTransfer.proxy = UI.itemRender(a, "t");
		Event.stop(k)
	}, this);
	Event.addSingleUseListener(this._node, "dragend", function(k) {
		delete this.previousPlaceholder;
		Event.unpauseEvents(this, "removeitem");
		Event.unpauseEvents(this, "additem");
		Event.unbundleEvents(this, "change")
	}, this);
	this.previousPlaceholder = d;
	DragDrop.beginDrag(this._node, new Point(Number.MAX_VALUE, Number.MAX_VALUE))
};
function DataSource() {
}
DataSource.prototype.destruct = noop;
DataSource.prototype.triggerChanges = function(a) {
	var d = false;
	var b;
	if (!a.length) {
		d = true
	} else {
		var c = Math.min(a.length, this.size());
		for ( b = 0; b < c; b++) {
			if (!compare(a[b], this.get(b))) {
				d = true;
				break
			}
		}
		if (!d) {
			if (a.length < this.size()) {
				for ( b = c; b < this.size(); b++) {
					Event.trigger(this, "change", {
						op : "add",
						value : this.get(b),
						pos : b
					})
				}
			} else {
				for ( b = c; b < a.length; b++) {
					Event.trigger(this, "change", {
						op : "del",
						pos : c
					})
				}
			}
		}
	}
	if (d) {
		Event.trigger(this, "change")
	}
};
function MemDataSource(a, b) {
	b = b || {};
	this.converter = b.converter ||
	function(c) {
		return c
	};
	this.setData(a);
	this.metadata = b.metadata || {};
	this.page = 1;
	this.morePages = false;
	this.comp = b.comp
}extend(MemDataSource, DataSource);
MemDataSource.prototype.setData = function(a) {
	if (a) {
		this.items = a.map(this.converter)
	} else {
		this.items = []
	}
	Event.trigger(this, "change")
};
MemDataSource.prototype.appendData = function(a) {
	if (a) {
		this.items = this.items.concat(a.map(this.converter));
		Event.trigger(this, "change")
	}
};
MemDataSource.prototype.clear = function() {
	this.setData([])
};
MemDataSource.prototype.forEach = function(b, a) {
	this.items.forEach(b, a)
};
MemDataSource.prototype.forEachNonBlocking = function(a, c, b, d) {
	this.items.forEachNonBlocking(a, c, b, d)
};
MemDataSource.prototype.reload = function() {
	var a = cloneObject(this.metadata);
	a.result = a.result || {};
	a.result.items = this.items;
	Event.trigger(this, "load", a);
	Event.trigger(this, "loaded")
};
MemDataSource.prototype.ensureLoaded = function() {
	this.reload()
};
MemDataSource.prototype.size = function() {
	return this.items.length
};
MemDataSource.prototype.find = function(b, a) {
	return this.items.find(this.converter(b), a || this.comp)
};
MemDataSource.prototype.contains = function(b, a) {
	return this.items.find(this.converter(b), a || this.comp) >= 0
};
MemDataSource.prototype.unshift = function(a) {
	this.items.unshift(this.converter(a));
	Event.trigger(this, "change", {
		op : "add",
		pos : 0,
		value : a
	})
};
MemDataSource.prototype.remove = function(c, a) {
	var b = this.items.find(this.converter(c), a || this.comp);
	if (b > -1) {
		var d = this.items.remove(c, a || this.comp);
		if (d !== false) {
			Event.trigger(this, "change", {
				op : "del",
				pos : b,
				value : c
			})
		}
	}
};
MemDataSource.prototype.atFirstPage = function() {
	return true
};
MemDataSource.prototype.atLastPage = function() {
	return true
};
MemDataSource.prototype.append = function(a) {
	this.items.push(this.converter(a));
	return Event.trigger(this, "change", {
		op : "add",
		pos : this.items.length - 1,
		value : a
	})
};
MemDataSource.prototype.replace = function(b) {
	var a = this.items.find(b, this.comp);
	if (a == -1) {
		return false
	}
	b = this.converter(b);
	this.items[a] = b;
	Event.trigger(this, "change", {
		op : "replace",
		pos : a,
		value : b
	});
	return true
};
MemDataSource.prototype.moveToEnd = function(b) {
	var a = this.items.find(b, this.comp);
	if (a == -1 || a == this.items.length - 1) {
		return null
	}
	var c = this.items[a];
	this.items.splice(a, 1);
	this.items.push(c);
	return Event.trigger(this, "change", {
		op : "move",
		from : a,
		to : this.items.length - 1,
		value : c
	})
};
MemDataSource.prototype.moveBefore = function(c, f) {
	var d = this.converter(c);
	var b = this.items.find(d, this.comp);
	var a = this.items.find(f, this.comp);
	if (b == -1 || a == -1 || b == a - 1 || b == a) {
		return null
	}
	d = this.items[b];
	this.items.splice(b, 1);
	if (b < a) {--a
	}
	this.items.splice(a, 0, d);
	return Event.trigger(this, "change", {
		op : "move",
		from : b,
		to : a,
		value : d
	})
};
MemDataSource.prototype.insertBefore = function(b, d) {
	var a;
	if (d === null || ( a = this.items.find(d, this.comp)) == -1) {
		return this.append(b)
	}
	var c = this.converter(b);
	this.items.splice(a, 0, c);
	Event.trigger(this, "change", {
		op : "add",
		pos : a,
		value : c
	})
};
MemDataSource.prototype.prev = MemDataSource.prototype.next = MemDataSource.prototype.gotoPage = function() {
};
MemDataSource.prototype.values = function() {
	return this.items
};
MemDataSource.prototype.get = function(a) {
	return this.items[a]
};
MemDataSource.prototype.getParams = function() {
	return null
};
MemDataSource.prototype.updateParams = function() {
	Event.trigger(this, "loaded")
};
MemDataSource.prototype.resetParams = function() {
	Event.trigger(this, "loaded")
};
MemDataSource.prototype.isDirty = function() {
	return false
};
function DomDataSource(a) {
	DomDataSource.superclass.constructor.call(this);
	this.dirty = true;
	this.metadata = {};
	this.data_element_id = a
}extend(DomDataSource, MemDataSource);
DomDataSource.prototype._triggerError = function(a) {
	Event.trigger(this, "loaderror", new AjaxResult({
		message : [{
			type : "error",
			content : a
		}]
	}))
};
DomDataSource.prototype.ensureLoaded = function() {
	if (this.dirty) {
		this.reload();
		DomDataSource.superclass.ensureLoaded.call(this)
	} else {
		Event.trigger(this, "loaded")
	}
};
DomDataSource.prototype.reload = function() {
	var s = $(this.data_element_id);
	if (!s) {
		this._triggerError("No data element with id: " + this.data_element_id);
		return
	}
	var g = s.getElementsByTagName("div");
	if (!g || g.length < 2) {
		this._triggerError("Malformed data element ");
		return
	}
	var n = g[0].getElementsByTagName("h2");
	if (n && n.length) {
		this.metadata.title = n[0].innerHTML
	}
	var r = g[1].getElementsByTagName("div");
	this.items = [];
	for (var f = 0; f < r.length; ++f) {
		var a = r[f];
		var k = a.getElementsByTagName("img");
		if (!k || !k.length || !k[0].src) {
			this._triggerError("malformed img node: " + a);
			continue
		}
		var m = k[0].getAttribute("xsrc");
		var q = m ? m : k[0].src;
		var p = k[0].height;
		var j = a.getElementsByTagName("a");
		if (!j || !j.length || !j[0].href) {
			this._triggerError("malformed a node: " + a);
			continue
		}
		var h = j[0].href;
		var b = parseUri(h).queryKey.id;
		var o = a.getElementsByTagName("span");
		var l = "";
		if (h.indexOf("/thing?") > 0) {
			if (!o || !o.length || o[0].childNodes.length < 1) {
				this._triggerError("malformed span node: " + a);
				continue
			}
			l = o[0].childNodes[0].innerHTML;
			this.items.push({
				type : "thing",
				id : b,
				imgurl : q,
				clickurl : h,
				imgh : p,
				imgw : p,
				itemtitle : l
			})
		} else {
			if (h.indexOf("/set?") > 0) {
				if (!o || !o.length || o[0].childNodes.length < 2 || !o[0].childNodes[1].href || !o[0].childNodes[1].innerHTML) {
					this._triggerError("malformed span node: " + a);
					continue
				}
				var c = o[0].childNodes[1].href;
				var d = o[0].childNodes[1].innerHTML;
				l = k[0].title || "";
				this.items.push({
					type : "set",
					id : b,
					imgurl : q,
					clickurl : h,
					userurl : c,
					user_name : d,
					imgh : p,
					imgw : p,
					title : l
				})
			} else {
				this._triggerError("invalid item type for dom data source: " + h);
				continue
			}
		}
	}
	s.style.display = "none";
	this.dirty = false;
	Event.trigger(this, "change");
	Event.trigger(this, "loaded")
};
DomDataSource.prototype.isDirty = function() {
	return this.dirty
};
function AjaxDataSource(c, d, a) {
	a = a || {};
	this.converter = a.converter ||
	function(f) {
		return f
	};
	this.items = [];
	this.dirty = a.dirty === undefined ? true : a.dirty;
	this.loading = false;
	this.action = c;
	this.noclamp = a.noclamp;
	this.hideProgress = a.hideProgress;
	if (d && d instanceof Props) {
		this.params = d
	} else {
		this.params = new Props(cloneObject(d || {}, true))
	}
	Event.addListener(this.params, "change", this.reload, this);
	this.page = 1;
	this.morePages = false;
	this.contract = getUID(this);
	this.method = a.method || "GET";
	this.shuffle = a.shuffle;
	if (a.backendEvents) {
		for (var b = 0; b < a.backendEvents.length; b++) {
			Event.addListener(Event.BACKEND, a.backendEvents[b], this.onDirty, this)
		}
	}
	this.cacheResults = a.cacheResults
}extend(AjaxDataSource, DataSource);
AjaxDataSource.prototype.destruct = function() {
	Ajax.abortContract(this.contract);
	CachedAjax.abortContract(this.contract);
	this.items = [];
	Event.release(this)
};
AjaxDataSource.prototype.clear = function() {
	this._clear();
	Event.trigger(this, "change")
};
AjaxDataSource.prototype._clear = function() {
	this.items = []
};
AjaxDataSource.prototype.forEach = function(b, a) {
	this.items.forEach(b, a)
};
AjaxDataSource.prototype.forEachNonBlocking = function(a, c, b, d) {
	this.items.forEachNonBlocking(a, c, b, d)
};
AjaxDataSource.prototype.find = function(b, a) {
	return this.items.find(b, a || compare)
};
AjaxDataSource.prototype.get = function(a) {
	return this.items[a]
};
AjaxDataSource.prototype.getParam = function(a) {
	return this.params.get(a)
};
AjaxDataSource.prototype.setParam = function(b, a) {
	this.params.set(b, a)
};
AjaxDataSource.prototype.updateParams = function(a) {
	return this.params.update(a)
};
AjaxDataSource.prototype.getAction = function() {
	return this.action
};
AjaxDataSource.prototype.setAction = function(b, c, a) {
	if (b != this.action || !this.params.equals(c)) {
		this.action = b;
		this.dirty = this.dirty || (a || {}).dirty;
		Event.pauseEvents(this.params, "change");
		c = c || {};
		c.page = 1;
		this.params.update(c);
		Event.unpauseEvents(this.params, "change");
		this.reload()
	}
};
AjaxDataSource.prototype.resetParams = function(a) {
	return this.params.reset(a)
};
AjaxDataSource.prototype.setParams = function(a) {
	this.params.update(a)
};
AjaxDataSource.prototype.getParams = function() {
	return this.params
};
AjaxDataSource.prototype.ensureLoaded = function() {
	if (this.dirty) {
		this.reload()
	} else {
		if (this.loading) {
			return
		} else {
			Event.trigger(this, "loaded")
		}
	}
};
AjaxDataSource.prototype.reload = function(d) {
	Event.trigger(this, "loading", d);
	var j = this.params.toArray();
	var b = cloneObject(this.items);
	if (d && d.length) {
		var a = true;
		forEachKey(d, function(k, l) {
			if (k != "length") {
				a = false
			}
		});
		if (a) {
			var h = this._start === undefined ? (this.page - 1) * this.getParam("length") : this._start;
			j._start = h;
			j._end = h + d.length.value
		}
	}
	var g = Event.wrapper(function(m) {
		Event.trigger(this, "load", m);
		if (m) {
			var l = m.result;
			this._clear();
			if (l) {
				var k = Number(l.current_page || l.page || 1);
				if (k < j.page && this.noclamp) {
					this.morePages = false;
					this.dirty = false
				} else {
					this.page = k;
					if (l.items && l.items.length) {
						this.items = this.items.concat(l.items.map(this.converter))
					}
					this.morePages = l.total_pages ? (this.page < Number(l.total_pages)) : Boolean(l.more_pages);
					this.dirty = false
				}
				this._start = j._start === undefined ? (k - 1) * j.length : j._start
			}
			this.triggerChanges(b)
		}
		yield(function() {
			Event.trigger(this, "loaded")
		}, this)
	}, this);
	var c = Event.wrapper(function(k) {
		Event.trigger(this, "loaderror", k)
	}, this);
	var f = Event.wrapper(function() {
		this.loading = false
	}, this);
	if (this.isDirty() && this.cacheResults) {
		CachedAjax.clear({
			action : this.action,
			data : j
		})
	}
	this.loading = true;
	if (this.cacheResults) {
		CachedAjax.request({
			method : this.method,
			action : this.action,
			hideProgress : this.hideProgress,
			data : j,
			contract : this.contract,
			onSuccess : g,
			onError : c,
			onFinally : f,
			expires : this.cacheResults,
			shuffle : this.shuffle
		})
	} else {
		Ajax.request({
			method : this.method,
			action : this.action,
			hideProgress : this.hideProgress,
			data : j,
			contract : this.contract,
			onSuccess : g,
			onError : c,
			onFinally : f
		})
	}
};
AjaxDataSource.prototype.atFirstPage = function() {
	return this.page == 1
};
AjaxDataSource.prototype.atLastPage = function() {
	return (!this.morePages)
};
AjaxDataSource.prototype.size = function() {
	return this.items.length
};
AjaxDataSource.prototype.onDirty = function() {
	this.dirty = true;
	Event.trigger(this, "dirty")
};
AjaxDataSource.prototype.contains = function(b, a) {
	return this.items.find(this.converter(b), a || compare) >= 0
};
AjaxDataSource.prototype.append = function(a) {
	return this.items.push(this.converter(a))
};
AjaxDataSource.prototype.prepend = function(a) {
	return this.items.unshift(this.converter(a))
};
AjaxDataSource.prototype.replace = function(b) {
	var a = this.items.find(b);
	if (a == -1) {
		return false
	}
	b = this.converter(b);
	this.items[a] = b;
	return true
};
AjaxDataSource.prototype.unshift = function(a) {
	return this.items.unshift(this.converter(a))
};
AjaxDataSource.prototype.remove = function(a) {
	this.items.remove(this.converter(a))
};
AjaxDataSource.prototype.prev = function() {
	return this.gotoPage(this.page - 1)
};
AjaxDataSource.prototype.next = function() {
	return this.gotoPage(this.page + 1)
};
AjaxDataSource.prototype.gotoPage = function(a) {
	if (!( a = Number(a)) || !( a = Math.floor(a)) || a <= 0 || (this.atLastPage() && a > this.page) || this.page == a) {
		return false
	}
	this.morePages = false;
	this.page = a;
	this.params.set("page", a);
	return true
};
AjaxDataSource.prototype.values = function() {
	return this.items
};
AjaxDataSource.prototype.isDirty = function() {
	return this.dirty
};
function ClusterDataSource(a, b) {
	ClusterDataSource.superclass.constructor.call(this, []);
	this.datasource = a;
	Event.addListener(a, "loaded", function() {
		this._computeClusters();
		Event.trigger(this, "loaded")
	}, this);
	Event.addListener(a, "change", this.onChange, this);
	this.setClusterSize(b)
}extend(ClusterDataSource, MemDataSource);
ClusterDataSource.prototype.setClusterSize = function(a) {
	if (this.clusterSize && this.clusterSize == a) {
		return
	}
	this.clusterSize = a;
	this._computeClusters()
};
ClusterDataSource.prototype.getClusterSize = function() {
	return this.clusterSize
};
ClusterDataSource.prototype.onChange = function(a) {
	this._computeClusters()
};
ClusterDataSource.prototype.ensureLoaded = function() {
	this.datasource.ensureLoaded()
};
ClusterDataSource.prototype._computeClusters = function() {
	var b = this.datasource.values();
	var d = [];
	if (b && b.length > 0) {
		var a = [];
		d.push(a);
		for (var c = 0; c < b.length; ++c) {
			if (a.length == this.clusterSize) {
				a = [];
				d.push(a)
			}
			a.push(b[c])
		}
	}
	this.setData(d)
};
function CachedAjaxData(a) {
	this._pageSize = 50;
	this._timeOut = a || 600;
	this.reset()
}
CachedAjaxData.prototype.reset = function() {
	this._pages = {};
	this._cachedEntry = null;
	this._filters = {};
	this._timerId = null;
	delete this._totalResults
};
CachedAjaxData.prototype.contains = function(f) {
	if (this._cachedEntry) {
		return true
	}
	if (f._start === 0 && f._end === 0) {
		return (this._totalResults !== undefined && this._totalResults > 0)
	}
	var g = f._start || (f.page - 1) * f.length;
	var a = f._end || f.page * f.length;
	if (this._totalResults !== undefined) {
		a = Math.min(a, this._totalResults)
	}
	for (var c = g; c < a; c++) {
		var d = Math.floor(c / this._pageSize);
		var b = c % this._pageSize;
		if (!this._pages[d] || !this._pages[d][b]) {
			return false
		}
	}
	return true
};
CachedAjaxData.prototype.get = function(g) {
	var h = g._start || (g.page - 1) * g.length;
	var a = g._end || g.page * g.length;
	if (this._cachedEntry) {
		return this._cachedEntry
	}
	if (g._start === 0 && g._end === 0) {
		h = 0;
		a = this._totalResults || 0
	}
	if (this._totalResults !== undefined && h >= this._totalResults) {
		h = (Math.ceil(this._totalResults / g.length) - 1) * g.length;
		a = h + g.length
	}
	var d = [];
	for (var c = h; c < a; c++) {
		var f = Math.floor(c / this._pageSize);
		var b = c % this._pageSize;
		if (this._pages[f] && this._pages[f][b]) {
			d.push(this._pages[f][b])
		}
	}
	if (this._timeOut) {
		if (this._timerId) {
			clearTimeout(this._timerId)
		}
		this._timerId = setTimeout(Event.wrapper(function() {
			this.reset()
		}, this), this._timeOut * 1000)
	}
	return {
		page : g.page,
		items : d,
		more_pages : this.hasMorePages(g),
		filters : this._filters,
		current_page : this.getCurrentPage(g),
		total_pages : this.getTotalPages(g)
	}
};
CachedAjaxData.prototype.getTotalPages = function(a) {
	if (this._totalResults !== undefined) {
		return Math.ceil(this._totalResults / a.length)
	}
	return null
};
CachedAjaxData.prototype.getCurrentPage = function(a) {
	if (this._totalResults !== undefined && this._totalResults < a.page * a.length) {
		return this.getTotalPages(a)
	}
	return a.page
};
CachedAjaxData.prototype.hasMorePages = function(a) {
	if (this._totalResults !== undefined) {
		return (this._totalResults > a.page * a.length)
	}
	return true
};
CachedAjaxData.prototype.set = function(j, b) {
	if (b.items === undefined) {
		this._cachedEntry = b;
		return
	}
	var c = b.items;
	var g = b.current_page || b.page || j.page;
	if (!j.length) {
		j.length = c.length
	}
	var d = j.length * (g - 1);
	if ((b.total_pages !== undefined && b.current_page >= b.total_pages) || (b.more_pages !== undefined && !b.more_pages)) {
		this._totalResults = (g - 1) * j.length + c.length
	}
	for (var f = 0; f < c.length; f++) {
		var h = Math.floor((d + f) / this._pageSize);
		var a = (d + f) % this._pageSize;
		if (!this._pages[h]) {
			this._pages[h] = [];
			this._pages[h].length = this._pageSize
		}
		this._pages[h][a] = cloneObject(c[f], true)
	}
	if (b.filters) {
		this._filters = b.filters
	}
};
var CachedAjax = function() {
	var b = new Hash();
	var a = {};
	function c(j) {
		var k = j._start;
		var f = j._end;
		var h = [];
		h.hasPending = function() {
			for (var l = 0; l < this.length; ++l) {
				if (this[l].pending) {
					return true
				}
			}
			return false
		};
		if (k === 0 && f === 0) {
			h.push({
				_start : 0,
				_end : 0,
				pending : true
			});
			return h
		}
		var d = j.reqSize;
		k = Math.floor(k / d) * d;
		f = Math.ceil(f / d) * d;
		for (var g = k / d; g < f / d; g++) {
			h.push({
				page : g + 1,
				length : d,
				pending : true
			})
		}
		return h
	}
	return {
		getCachedPage : function(d) {
			return b.get(Ajax.getCacheKey(d.action, d.data))
		},
		clearAll : function() {
			b.clear()
		},
		clear : function(f) {
			var d = Ajax.getCacheKey(f.action, f.data);
			b.remove(d)
		},
		abortContract : function(d) {
			var f = d && a[d];
			if (f) {
				f.forEach(Ajax.abort);
				delete a[d];
				return true
			}
			return false
		},
		get : function(d) {
			d.method = "GET";
			return CachedAjax.request(d)
		},
		request : function(l) {
			l = cloneObject(l || {}, true);
			if (!l.data.page) {
				l.data.page = 1
			}
			l.data.reqSize = l.data.reqSize || 50;
			var j = l.contract;
			CachedAjax.abortContract(j);
			if (l.data._start === undefined || l.data._end === undefined) {
				if (l.data.length) {
					l.data._start = (l.data.page - 1) * l.data.length;
					l.data._end = l.data._start + l.data.length
				} else {
					l.data._start = 0;
					l.data._end = 0
				}
			}
			var g = Ajax.getCacheKey(l.action, l.data);
			var h = l.shuffle;
			if (h) {
				g = g + "-" + h.offset + "-" + (h.granularity || 0)
			}
			var d = b.get(g);
			if (!d) {
				d = new CachedAjaxData(l.expires);
				b.put(g, d)
			}
			var k = l.onSuccess || noop;
			if (d.contains(l.data)) {
				k({
					result : d.get(l.data)
				});
				if (l.onFinally) {
					l.onFinally()
				}
			} else {
				var m = c(l.data);
				var f;
				if (j) {
					f = a[j] = []
				}
				m.forEach(function(n) {
					if (d.contains(n)) {
						n.pending = false;
						return
					}
					var p = cloneObject(l.data, true);
					p.page = n.page;
					p.length = n.length;
					delete p.reqSize;
					delete p._start;
					delete p._end;
					var o = Ajax.request({
						method : l.method || "GET",
						action : l.action,
						hideProgress : l.hideProgress,
						data : p,
						onSuccess : function(q) {
							n.pending = false;
							if (h && q.result.items) {
								q.result.items.fixedShuffle(h.offset, h.granularity)
							}
							d.set(p, q.result);
							if (!m.hasPending()) {
								k({
									result : d.get(l.data)
								});
								if (l.onFinally) {
									l.onFinally()
								}
								if (j && a[j] == f) {
									delete a[j]
								}
							}
						},
						onError : function() {
							if (l.onError) {
								l.onError.apply(null, arguments)
							}
							if (l.onFinally && !m.hasPending()) {
								l.onFinally()
							}
						}
					});
					if (f) {
						f.push(o)
					}
				})
			}
		}
	}
}();
function BaseFilter(d, c, b, a) {
	this.source = d;
	this.name = c;
	this.value = a;
	this.defaultValue = b;
	this.enabled = true;
	this.changedOn = 0
}
BaseFilter.prototype.set = function(a) {
	if (a == this.value) {
		return false
	}
	this.changedOn = new Date().getTime();
	this.value = a;
	var b = {
		page : 1
	};
	b[this.name] = a;
	this.source.updateParams(b);
	Event.trigger(this, "change", this);
	return true
};
BaseFilter.prototype.isDefaultValue = function() {
	return this.value == this.defaultValue
};
BaseFilter.prototype.clear = function() {
	this.set(this.defaultValue)
};
BaseFilter.createFakeDS = function(c, b, d) {
	var a = {
		result : {
			filters : {}
		}
	};
	a.result.filters[c] = {
		items : b
	};
	var f = {
		values : function() {
			return b
		},
		updateParams : function(g) {
			if (d) {
				d.updateParams(g)
			}
			Event.trigger(f, "load", a)
		}
	};
	if (d) {
		Event.addSingleUseListener(d, "load", function() {
			Event.trigger(f, "load", a)
		});
		Event.addListener(d, "loaded", function() {
			if (d.size()) {
				a.result.filters[c] = {
					items : b
				}
			} else {
				a.result.filters[c] = null
			}
			Event.trigger(f, "load", a)
		})
	}
	yield(function() {
		Event.trigger(f, "load", a)
	});
	return f
};
function SelectFilter(f, d, b, a, c) {
	c = c || {};
	SelectFilter.superclass.constructor.call(this, f, d, b, a);
	Event.addListener(f, "load", this.onSourceLoad, this);
	this.requiresClear = c.requiresClear;
	this.sorter = c.defaultSort;
	this.defaultItem = {
		label : c.defaultLabel,
		idx : -1,
		value : c.defaultValue
	};
	this.selectedIdx = -1;
	this.options = [];
	this.enabled = false;
	if (c.options) {
		this.update({
			items : c.options
		})
	}
}extend(SelectFilter, BaseFilter);
SelectFilter.prototype.clear = function() {
	this.select(-1)
};
SelectFilter.prototype.sort = function(c) {
	this.sorter = c;
	c.call(this, this.options);
	var a = 0;
	var b = false;
	this.options.forEach(function(d) {
		if (!b && this.selectedIdx == d.idx) {
			b = true;
			this.selectedIdx = a
		}
		d.idx = a;
		a++
	}, this);
	this.triggerUpdate()
};
SelectFilter.prototype.onSourceLoad = function(a) {
	var c = a.result.filters;
	var b;
	if (c && c.hasOwnProperty(this.name)) {
		b = c[this.name]
	}
	if (b) {
		this.update(b)
	} else {
		Event.trigger(this, "nodata")
	}
};
SelectFilter.prototype.update = function(c) {
	var b = [];
	var a = 0;
	if (this.selectedIdx != -1) {
		this.selectedIdx = c.items.length
	}
	if (this.sorter) {
		this.sorter.call(this, c.items)
	}
	if (c.items) {
		c.items.forEach(function(d) {
			if (d.value == this.value) {
				this.selectedIdx = a
			}
			d.idx = a;
			d.selected = (d.value == this.value);
			b.push(d);
			a++
		}, this)
	}
	this.options = b;
	this.enabled = true;
	this.triggerUpdate()
};
SelectFilter.prototype.triggerUpdate = function() {
	if (this.selectedIdx != -1 && this.requiresClear) {
		Event.trigger(this, "update", true)
	} else {
		Event.trigger(this, "update", false)
	}
};
SelectFilter.prototype.size = function() {
	return this.options.length
};
SelectFilter.prototype.get = function(a) {
	if (a == -1) {
		return this.defaultItem
	}
	return this.options[a]
};
SelectFilter.prototype.select = function(a) {
	this.selectedIdx = a;
	var b = this.selected();
	if (b) {
		this.set(b.value)
	}
};
SelectFilter.prototype.selectByValue = function(c, b) {
	b = b ||
	function(f, d) {
		return (f == d)
	};
	for (var a = 0; a < this.size(); ++a) {
		if (b(c, this.get(a).value)) {
			this.select(a);
			return true
		}
	}
	return false
};
SelectFilter.prototype.selected = function() {
	return this.get(this.selectedIdx)
};
SelectFilter.prototype.getIndex = function(c) {
	var a = this.options.length;
	for (var b = 0; b < a; b++) {
		if (this.options[b].value == c) {
			return b
		}
	}
	return -1
};
function Handle(a, b, c) {
	this.owner = a;
	this.location = b;
	this.type = c;
	var d = ["handle", b];
	if (c) {
		d.push(c)
	}
	this._node = createNode("div", {
		className : d.join(" ")
	});
	switch(b) {
		case"n":
			this.dirx = 0;
			this.diry = -1;
			break;
		case"s":
			this.dirx = 0;
			this.diry = 1;
			break;
		case"w":
			this.dirx = -1;
			this.diry = 0;
			break;
		case"e":
			this.dirx = 1;
			this.diry = 0;
			break;
		case"nw":
			this.dirx = -1;
			this.diry = -1;
			break;
		case"ne":
			this.dirx = 1;
			this.diry = -1;
			break;
		case"sw":
			this.dirx = -1;
			this.diry = 1;
			break;
		case"se":
			this.dirx = 1;
			this.diry = 1;
			break
	}
	Event.addListener(this._node, "mousedown", this.onMouseDown, this);
	this.setCursorLocation(b)
}
Handle.prototype.setCursorLocation = noop;
Handle.prototype.getNode = function() {
	return this._node
};
Handle.prototype.onMouseDown = function(a) {
	Event.addListener(document, "mouseup", this.onMouseUp, this);
	Event.addListener(document, "mousemove", this.onMouseMove, this);
	removeClass(this.owner._node.parentNode, "unlocked");
	document.body.style.cursor = this.cursor;
	this._previousFillingCursor = this.owner._filling.style.cursor;
	this.owner._filling.style.cursor = this.cursor;
	Event.trigger(this, "beginmove", a, this);
	return Event.stop(a)
};
Handle.prototype.onMouseMove = function(a) {
	Event.trigger(this, "move", a, this);
	Event.stopBubble(a);
	return false
};
Handle.prototype.onMouseUp = function(a) {
	addClass(this.owner._node.parentNode, "unlocked");
	Event.removeListener(document, "mouseup", this.onMouseUp, this);
	Event.removeListener(document, "mousemove", this.onMouseMove, this);
	document.body.style.cursor = "default";
	this.owner._filling.style.cursor = this._previousFillingCursor;
	Event.trigger(this, "endmove");
	return Event.stop(a)
};
function ResizeHandle(a, b) {
	ResizeHandle.superclass.constructor.call(this, a, b, "resize")
}extend(ResizeHandle, Handle);
ResizeHandle.prototype.setCursorLocation = function(a) {
	this.cursor = a + "-resize";
	setNode(this._node, null, {
		cursor : this.cursor
	})
};
function RotateHandle(a, b) {
	RotateHandle.superclass.constructor.call(this, a, b, "rotate");
	var d = "crosshair";
	var c = Browser.isIE ? "" : " 13 4";
	this.cursor = ['url("', buildRsrcURL("img/rotate_arrow.cur"), '")', c, ",", d].join("");
	this._node.appendChild(createNode("div", {
		className : "rotatetip"
	}));
	setNode(this._node, null, {
		cursor : this.cursor
	})
}extend(RotateHandle, Handle);
function SelectedItems(a) {
	this._items = new Set();
	this._visible = true;
	this._dragStart = new Point(0, 0, 0);
	var b = (this._node = a.appendChild(createNode("div", {
		className : "handles"
	})));
	if (Matrix.create().constructor == FiltersMatrix) {
		b = (this.selectNode = b.appendChild(createNode("div", {
			className : "handles_border"
		})))
	} else {
		this.selectNode = b;
		addClass(b, "handles_border")
	}
	this._canvasXY = nodeXY(a);
	this.handles = ["n", "s", "nw", "ne", "se", "sw", "w", "e"].map(function(c) {
		var d = new ResizeHandle(this, c);
		b.appendChild(d.getNode());
		Event.addListener(d, "beginmove", this.beginResize, this);
		Event.addListener(d, "move", this.resize, this);
		Event.addListener(d, "endmove", this.endResize, this);
		return d
	}, this);
	this.handles = this.handles.concat(["n"].map(function(c) {
		var d = new RotateHandle(this, c);
		b.appendChild(d.getNode());
		Event.addListener(d, "beginmove", this.beginRotate, this);
		Event.addListener(d, "move", this.rotate, this);
		Event.addListener(d, "endmove", this.endRotate, this);
		return d
	}, this));
	this.enabledHandles = {};
	this._filling = b.appendChild(createNode("div", {
		className : "filling"
	}));
	Event.addListener(this._filling, "mousedown", this.onMouseDown, this);
	this._matrix = Matrix.create();
	this._center = null
}
SelectedItems.rotationSnap = Math.PI / 4;
SelectedItems.WB_DUMMY = createNode("div");
SelectedItems.prototype.event2canvasXY = function(a) {
	var b = Event.getPageXY(a);
	b.x -= this._canvasXY.x;
	b.y -= this._canvasXY.y;
	return b
};
SelectedItems.prototype.beginResize = function(c, f) {
	Event.trigger(this, "beginresize");
	UI.whiteblock(SelectedItems.WB_DUMMY);
	var b = this.getRect();
	var a = b.center();
	this._center = a;
	this.resizeAnchorWorld = b.getLocationXY(Rect.oppositeLocation(f.location));
	this.resizeAnchor = {
		x : this.resizeAnchorWorld.x - a.x,
		y : this.resizeAnchorWorld.y - a.y
	};
	this.resizeAnchorWorld = this._matrix.transform(this.resizeAnchorWorld.x, this.resizeAnchorWorld.y, a);
	var d = this.event2canvasXY(c);
	d = this._matrix.inverse().transform(d.x - a.x, d.y - a.y);
	this.startDist = {
		x : d.x - this.resizeAnchor.x,
		y : d.y - this.resizeAnchor.y
	};
	this._items.forEach(function(g) {
		g.beginResize()
	})
};
SelectedItems.prototype.resize = function(d, g) {
	var f = this.event2canvasXY(d);
	f = this._matrix.inverse().transform(f.x - this._center.x, f.y - this._center.y);
	var h = {
		x : (f.x - this.resizeAnchor.x) / (this.startDist.x || 0.001),
		y : (f.y - this.resizeAnchor.y) / (this.startDist.y || 0.001)
	};
	var a = {
		x : h.x,
		y : h.y
	};
	if (g.dirx === 0) {
		a.x = 1;
		h.x = Math.abs(h.x)
	} else {
		if (g.diry === 0) {
			a.y = 1;
			h.y = Math.abs(h.y)
		}
	}
	var b = undefined;
	if (this._items.size() >= 2) {
		b = true
	}
	if (this._items.values().some(function(j) {
		return !j.canScale(a)
	})) {
		return
	}
	var c = this.resizeAnchorWorld;
	this._items.forEach(function(j) {
		j.scale(h, c, g, b)
	});
	this.redraw()
};
SelectedItems.prototype.endResize = function() {
	this._items.forEach(function(a) {
		a.endResize()
	});
	UI.hideWhiteblock();
	Event.trigger(this, "endresize")
};
SelectedItems.prototype.beginRotate = function(b, c) {
	Event.trigger(this, "beginrotate");
	UI.whiteblock(SelectedItems.WB_DUMMY);
	var a = this.getRect();
	this._center = a.center();
	var d = a.getLocationXY(c.location);
	d = this._matrix.transform(d.x, d.y, this._center);
	this._previousAngle = ratio2angle(d.x - this._center.x, d.y - this._center.y) || 0;
	this._items.forEach(function(f) {
		f.beginRotate()
	})
};
SelectedItems.prototype.rotate = function(b) {
	var d = this.event2canvasXY(b);
	var c = ratio2angle(d.x - this._center.x, d.y - this._center.y);
	if (b.shiftKey) {
		c = round(c, SelectedItems.rotationSnap)
	}
	var a = c - this._previousAngle;
	this._previousAngle = c;
	this._items.forEach(function(f) {
		f.rotate(a, this._center)
	}, this);
	this._matrix.rotate(a);
	this.redraw()
};
SelectedItems.prototype.endRotate = function() {
	this._previousAngle = null;
	this._items.forEach(function(a) {
		a.endRotate()
	});
	UI.hideWhiteblock();
	Event.trigger(this, "endrotate")
};
SelectedItems.prototype.beginMove = function(a) {
	Event.trigger(this, "beginmove");
	UI.whiteblock(SelectedItems.WB_DUMMY);
	this._items.forEach(function(b) {
		b.beginMove(a)
	});
	this.moving = true
};
SelectedItems.prototype.move = function(c, b, a, f) {
	var g = [];
	this._items.forEach(function(h) {
		desiredPoint = h.move(c, b, a);
		g.push({
			desiredPoint : desiredPoint,
			item : h
		})
	});
	var d = this.getRect();
	this._node.style.top = d.top() + "px";
	this._node.style.left = d.left() + "px";
	Event.trigger(this, "movingitems", f, g)
};
SelectedItems.prototype.endMove = function() {
	this.moving = false;
	this._items.forEach(function(a) {
		a.endMove()
	});
	UI.hideWhiteblock();
	Event.trigger(this, "endmove")
};
SelectedItems.prototype.onMouseDown = function(a) {
	this._dragStart = Event.getPageXY(a, this._dragStart);
	this.beginMove(a);
	this._beginMoveTS = new Date().getTime();
	Event.addListener(document, "mouseup", this.onMouseUp, this);
	Event.addListener(document, "mousemove", this.onMouseMove, this);
	return Event.stop(a)
};
SelectedItems.prototype.onMouseUp = function(a) {
	Event.removeListener(document, "mousemove", this.onMouseMove, this);
	Event.removeListener(document, "mouseup", this.onMouseUp, this);
	this.endMove();
	return Event.stop(a)
};
SelectedItems.prototype.onMouseMove = function(b) {
	if (this._beginMoveTS && new Date().getTime() - this._beginMoveTS < 50) {
		return
	}
	delete this._beginMoveTS;
	var a = Event.getPageXY(b);
	this.move(a.x - this._dragStart.x, a.y - this._dragStart.y, true, b)
};
SelectedItems.prototype.contains = function(a) {
	return this._items.contains(a)
};
SelectedItems.prototype.values = function() {
	return this._items.values()
};
SelectedItems.prototype.add = function(a) {
	this._items.put(a);
	if (this.size() == 1) {
		this.enableHandles({
			resize : a.getResizeHandles(),
			rotate : a.getRotateHandles()
		})
	} else {
		this.enableHandles({
			resize : ["nw", "ne", "se", "sw"],
			rotate : Browser.type("IE", null, 8) ? [] : a.getRotateHandles()
		})
	}
	a.select();
	Event.addListener(a, "resized", this.redraw, this);
	Event.addListener(a, "flipped", this.redraw, this);
	Event.addListener(a, "flopped", this.redraw, this)
};
SelectedItems.prototype.enableHandles = function(a) {
	this.enabledHandles = a;
	this.updateHandlesAndCursor()
};
SelectedItems.prototype.getRect = function() {
	if (this.size() == 1) {
		var f = this.getFirstItem();
		this._matrix = f.getMatrix().clone();
		return f.getRect()
	} else {
		if (Browser.type("IE", null, 8)) {
			this._matrix = Matrix.create();
			var d = null;
			this._items.forEach(function(h) {
				if (d) {
					d.expand(h.getBounds())
				} else {
					d = h.getBounds()
				}
			});
			return d
		} else {
			var b = this._matrix.inverse();
			var g = [];
			this._items.forEach(function(h) {
				var j = new Polygon(h.getRect());
				j.transform(h.getMatrix()).transform(b, Point.origin);
				g = g.concat(j.pts)
			});
			var a = new Polygon(g).center();
			a = this._matrix.transform(a.x, a.y, Point.origin);
			var c = null;
			this._items.forEach(function(h) {
				var j = new Polygon(h.getRect());
				j.transform(h.getMatrix()).transform(b, a);
				if (c) {
					c.expand(j.bounds())
				} else {
					c = j.bounds()
				}
			});
			return c
		}
	}
};
SelectedItems.prototype.redraw = function() {
	if (this._visible && this._items.size() > 0) {
		var c = this.getRect();
		var b = c.width();
		var a = c.height();
		if (Browser.isIE) {
			b = Math.ceil(b);
			a = Math.ceil(a)
		}
		b = px(b);
		a = px(a);
		if (this.selectNode != this._node) {
			this.selectNode.style.width = b;
			this.selectNode.style.height = a
		}
		this._filling.style.width = this._node.style.width = b;
		this._filling.style.height = this._node.style.height = a;
		this._node.style.top = c.top() + "px";
		this._node.style.left = c.left() + "px";
		if (this._matrix.isIdentity()) {
			Matrix.clear(this._node, {
				border : 1,
				margin : 50
			})
		} else {
			this._matrix.apply(this._node, this.getFirstItem(), {
				border : 1,
				margin : 50
			})
		}
		this.updateHandlesAndCursor();
		show(this._node)
	} else {
		hide(this._node)
	}
};
SelectedItems.prototype.remove = function(a) {
	this._remove(a);
	this.redraw()
};
SelectedItems.prototype._remove = function(a) {
	this._items.remove(a);
	Event.removeListener(a, "resized", this.redraw, this);
	Event.removeListener(a, "flipped", this.redraw, this);
	Event.removeListener(a, "flopped", this.redraw, this);
	a.unselect()
};
SelectedItems.prototype.clear = function(a) {
	a = a || {};
	this._items.values().forEach(this._remove, this);
	if (!a.keepMatrix) {
		this._matrix = Matrix.create()
	}
	this.redraw()
};
SelectedItems.prototype.show = function() {
	this._visible = true;
	this.redraw()
};
SelectedItems.prototype.hide = function() {
	this._visible = false;
	this.redraw()
};
SelectedItems.prototype.size = function() {
	return this._items.size()
};
SelectedItems.prototype.getFirstItem = function() {
	if (this.size() > 0) {
		var a = this._items.values();
		return a[0]
	} else {
		return null
	}
};
SelectedItems.prototype.forEach = function(b, a) {
	this._items.forEach(b, a)
};
SelectedItems.prototype.getInfo = function() {
	switch(this.size()) {
		case 0:
			return null;
		case 1:
			return this.getFirstItem().getInfo();
		default:
			return createNode("span", {
				className : "num_items meta"
			}, null, loc("{num} items", {
				num : this.size()
			}))
	}
};
SelectedItems.prototype.getActions = function() {
	var a = this.size();
	var d = {};
	if (a === 0) {
		return null
	} else {
		if (a == 1) {
			var b = this.getFirstItem();
			forEachKey(b.getActions(), function(h, f) {
				var g = f.method;
				d[h] = g;
				g.disabled = f.disabled;
				g.selected = f.selected;
				g.icon = f.icon
			}, this);
			return d
		} else {
			var c = {};
			this.forEach(function(g) {
				var f = g.getActions();
				forEachKey(f, function(k, h) {
					if (h.single) {
						return
					}
					var j = h.method;
					j.disabled = h.disabled;
					j.selected = h.selected;
					j.icon = h.icon;
					c[k] = c[k] || [];
					c[k].push(j)
				})
			});
			forEachKey(c, function(g, f) {
				if (f.length != a) {
					return
				}
				d[g] = Event.wrapper(function() {
					Event.trigger(this, "beginMethodOnItems", this, g);
					if ("flip_btn" == g) {
						this._matrix.flip()
					} else {
						if ("flop_btn" == g) {
							this._matrix.flop()
						}
					}
					var h = this.getRect();
					f.forEach(function(j) {
						j.call(this, h)
					}, this);
					Event.trigger(this, "endMethodOnItems", this, g)
				}, this)
			}, this);
			return d
		}
	}
};
SelectedItems.prototype.isHandleEnabled = function(b) {
	if (!b) {
		return false
	}
	var a = this.enabledHandles || {};
	a = a[b.type];
	if (!a) {
		return false
	}
	return a.find(b.location) >= 0
};
SelectedItems.prototype.updateHandlesAndCursor = function() {
	if (this.queuedHandlesUpdate) {
		return
	}
	this.queuedHandlesUpdate = yield(function() {
		delete this.queuedHandlesUpdate;
		this._updateHandlesAndCursor()
	}, this)
};
SelectedItems.prototype._updateHandlesAndCursor = function() {
	this.handles.forEach(function(a) {
		var b = this._matrix.transform(a.dirx, a.diry);
		var c = ratio2angle(b.x, b.y);
		a.setCursorLocation(SelectedItems.angle2location(rad2deg(c)));
		if (this.isHandleEnabled(a)) {
			show(a.getNode())
		} else {
			hide(a.getNode())
		}
	}, this)
};
function NoopSelectedItems() {
}extend(NoopSelectedItems, SelectedItems);
NoopSelectedItems.prototype.redraw = noop;
function TouchSelectedItems(a) {
	this.touch = new MobileTouch(a, {
		key : "_data"
	});
	Event.addListener(a, "movestart", function(b) {
		if (!b || !b.target || !b.target._data) {
			return
		}
		Event.trigger(this, "beginmove");
		b.target._data.beginMove()
	}, this);
	Event.addListener(a, "movechange", function(b) {
		if (!b || !b.target || !b.target._data) {
			return
		}
		b.target._data.move(b.dx, b.dy, true)
	}, this);
	Event.addListener(a, "moveend", function(b) {
		if (!b || !b.target || !b.target._data) {
			return
		}
		b.target._data.endMove();
		Event.trigger(this, "endmove")
	}, this);
	Event.addListener(a, "gesturestart", function(b) {
		if (!b || !b.target || !b.target._data) {
			return
		}
		b.target._data.beginResize();
		b.target._data.beginRotate();
		this._previousAngle = b.rotationRadians
	}, this);
	Event.addListener(a, "gesturechange", function(d) {
		if (!d || !d.target || !d.target._data) {
			return
		}
		var c = d.target._data;
		var b = {
			x : d.scale,
			y : d.scale
		};
		if (c.canScale(b)) {
			c.scale(b, d.center)
		}
		c.rotate(d.rotationRadians - (this._previousAngle || 0));
		this._previousAngle = d.rotationRadians
	}, this);
	Event.addListener(a, "gestureend", function(b) {
		if (!b || !b.target || !b.target._data) {
			return
		}
		b.target._data.endResize();
		b.target._data.endRotate();
		this._previousAngle = 0
	}, this)
}
TouchSelectedItems.prototype.beginResize = function(a, b) {
};
TouchSelectedItems.prototype.resize = function(a) {
};
TouchSelectedItems.prototype.endResize = function() {
};
TouchSelectedItems.prototype.beginMove = function(a) {
};
TouchSelectedItems.prototype.move = function(a) {
};
TouchSelectedItems.prototype.endMove = function(a) {
};
TouchSelectedItems.prototype.contains = function(a) {
};
TouchSelectedItems.prototype.values = function() {
};
TouchSelectedItems.prototype.add = function(a) {
};
TouchSelectedItems.prototype.enableHandles = function(a) {
};
TouchSelectedItems.prototype.getRect = function() {
};
TouchSelectedItems.prototype.redraw = function() {
};
TouchSelectedItems.prototype._redrawPos = function(a) {
};
TouchSelectedItems.prototype.remove = function(a) {
};
TouchSelectedItems.prototype.clear = function() {
};
TouchSelectedItems.prototype.show = function() {
};
TouchSelectedItems.prototype.hide = function() {
};
TouchSelectedItems.prototype.size = SelectedItems.prototype.size;
TouchSelectedItems.prototype.getFirstItem = SelectedItems.prototype.getFirstItem;
TouchSelectedItems.prototype.forEach = SelectedItems.prototype.forEach;
TouchSelectedItems.prototype.forEach = SelectedItems.prototype.forEach;
TouchSelectedItems.prototype.getInfo = SelectedItems.prototype.getInfo;
TouchSelectedItems.prototype.getActions = SelectedItems.prototype.getActions;
SelectedItems.angle2location = function(a) {
	if (337.5 <= a || a < 22.5) {
		return "s"
	} else {
		if (22.5 <= a && a < 67.5) {
			return "se"
		} else {
			if (67.5 <= a && a < 112.5) {
				return "e"
			} else {
				if (112.5 <= a && a < 157.5) {
					return "ne"
				} else {
					if (157.5 <= a && a < 202.5) {
						return "n"
					} else {
						if (202.5 <= a && a < 247.5) {
							return "nw"
						} else {
							if (247.5 <= a && a < 292.5) {
								return "w"
							} else {
								if (292.5 <= a && a < 337.5) {
									return "sw"
								}
							}
						}
					}
				}
			}
		}
	}
};
function ratio2angle(b, d) {
	var c = Math.atan2(b, d);
	return (c + 2 * Math.PI) % (2 * Math.PI)
}

function rad2deg(a) {
	return a / Math.PI * 180
}

function MultiSelect(a) {
	this.node = a.appendChild(createNode("div", {
		className : "multiselect"
	}));
	this._canvasXY = nodeXY(a);
	this._items = new Set();
	if (!Browser.layoutEngine("WebKit", 525)) {
		this._updateSelection = Event.rateLimit(Event.wrapper(this._updateSelection, this), 25)
	}
}
MultiSelect.WB_DUMMY = createNode("div");
MultiSelect.cachedItemRects = {};
MultiSelect.prototype._updateSelection = function() {
	if (!this.start || !this.end) {
		return
	}
	var c = this._generateIntersectTest();
	for (var a = 0; a < this.allItems.length; ++a) {
		var b = this.allItems[a];
		if (this._items.contains(b)) {
			if (!c(b)) {
				if (this._items.remove(b) && (!this.startSelection || !this.startSelection.contains(b))) {
					b.unselect()
				}
			}
		} else {
			if (c(b)) {
				this._items.put(b);
				b.select()
			}
		}
	}
};
MultiSelect.prototype.beginMultiSelect = function(b, a, c) {
	if (Browser.isIE) {
		UI.whiteblock(SelectedItems.WB_DUMMY)
	}
	this.start = this._event2canvasXY(b);
	this.startSelection = c;
	this.allItems = a;
	Event.addListener(document, "mousemove", this.onMouseMove, this);
	Event.addListener(document, "mouseup", this.onMouseUp, this)
};
MultiSelect.prototype.onMouseMove = function(b) {
	var a = Event.getPageXY(b);
	this.end = this._event2canvasXY(b);
	this.redraw();
	this._updateSelection()
};
MultiSelect.prototype.onMouseUp = function(a) {
	if (Browser.isIE) {
		UI.hideWhiteblock()
	}
	Event.removeListener(document, "mousemove", this.onMouseMove, this);
	Event.removeListener(document, "mouseup", this.onMouseUp, this);
	if (this._items.size()) {
		Event.trigger(this, "selected")
	}
	this.clear()
};
MultiSelect.prototype._event2canvasXY = function(a) {
	var b = Event.getPageXY(a);
	b.x -= this._canvasXY.x;
	b.y -= this._canvasXY.y;
	return b
};
MultiSelect.prototype.getRect = function() {
	if (!this.start || !this.end) {
		return null
	}
	return new Rect(Math.min(this.start.x, this.end.x), Math.min(this.start.y, this.end.y), Math.max(this.start.x, this.end.x), Math.max(this.start.y, this.end.y))
};
MultiSelect.prototype.redraw = function(a) {
	if (!this.start || !this.end) {
		hide(this.node);
		return
	}
	a = a || this.getRect();
	setNode(this.node, null, {
		visibility : "visible",
		display : "block",
		left : a.left() + "px",
		top : a.top() + "px",
		width : a.width() + "px",
		height : a.height() + "px"
	})
};
MultiSelect.prototype.clear = function() {
	this.start = this.end = null;
	this._items.clear();
	this.redraw()
};
MultiSelect.prototype.cancel = function() {
	this.forEach(function(a) {
		a.unselect()
	}, this);
	this.clear()
};
MultiSelect.prototype.forEach = function(b, a) {
	this._items.forEach(b, a)
};
MultiSelect.prototype._generateIntersectTest = function() {
	var a = this.getRect();
	if (!a) {
		return noop
	}
	a.tl = {
		x : a.left(),
		y : a.top()
	};
	a.br = {
		x : a.right(),
		y : a.bottom()
	};
	a.tr = {
		x : a.br.x,
		y : a.tl.y
	};
	a.bl = {
		x : a.tl.x,
		y : a.br.y
	};
	return function(f) {
		var b = MultiSelect.cachedItemRects[getUID(f)];
		if (!b) {
			MultiSelect.cachedItemRects[getUID(f)] = ( b = {
				onchange : Event.addListener(f, "change", function() {
					delete b.rect
				}),
				onDestruct : Event.addListener(f, "change", function() {
					delete MultiSelect.cachedItemRects[getUID(f)]
				})
			})
		}
		if (!b.rect) {
			b.rect = MultiSelect._getIntersectTestRect(f)
		}
		var h = b.rect;
		if (a.left() > h.bb.right || a.right() < h.bb.left || a.top() > h.bb.bottom || a.bottom() < h.bb.top) {
			return false
		}
		if (a.isInside(h.tl) || a.isInside(h.tr) || a.isInside(h.bl) || a.isInside(h.br)) {
			return true
		}
		var d = f.matrix.inverse();
		var g = h.center();
		if (h.isInside(d.transform(a.left(), a.top(), g)) || h.isInside(d.transform(a.right(), a.top(), g)) || h.isInside(d.transform(a.right(), a.bottom(), g)) || h.isInside(d.transform(a.left(), a.bottom(), g))) {
			return true
		}
		var c = false;
		h.segs.forEach(function(j) {
			if (!c) {
				c = !!(j.intersect(a.tl, a.tr) || j.intersect(a.tr, a.br) || j.intersect(a.br, a.bl) || j.intersect(a.bl, a.tl))
			}
		});
		return c
	}
};
MultiSelect._getIntersectTestRect = function(f) {
	var d = f.getRect();
	var a = d.center();
	var b = {
		x : d.left(),
		y : d.top()
	};
	var c = {
		x : d.right(),
		y : d.bottom()
	};
	var g = {
		x : c.x,
		y : b.y
	};
	var h = {
		x : b.x,
		y : c.y
	};
	d.tl = ( b = f.matrix.transform(b.x, b.y, a));
	d.tr = ( g = f.matrix.transform(g.x, g.y, a));
	d.bl = ( h = f.matrix.transform(h.x, h.y, a));
	d.br = ( c = f.matrix.transform(c.x, c.y, a));
	d.segs = [];
	d.segs.push(new Segment(b, g));
	d.segs.push(new Segment(g, c));
	d.segs.push(new Segment(c, h));
	d.segs.push(new Segment(h, b));
	d.bb = {
		left : Math.min(d.tl.x, d.tr.x, d.bl.x, d.br.x),
		right : Math.max(d.tl.x, d.tr.x, d.bl.x, d.br.x),
		top : Math.min(d.tl.y, d.tr.y, d.bl.y, d.br.y),
		bottom : Math.max(d.tl.y, d.tr.y, d.bl.y, d.br.y)
	};
	return d
};
function XImage() {
	this.outer = null
}
XImage.prototype.getNode = function() {
	return this.outer
};
XImage.prototype.setSize = function(a) {
	setNode(this.outer, {
		width : Math.round(a.width()),
		height : Math.round(a.height())
	}, {
		width : px(a.width()),
		height : px(a.height())
	})
};
XImage.prototype.setSrc = function(a) {
	this._src = a;
	setNode(this.outer, {
		src : a
	})
};
XImage.prototype.getSrc = function() {
	return this._src
};
function FiltersImage(a, c) {
	this.outer = createNode("div", {
		className : "img"
	});
	var f = this.outer.appendChild(createNode("div"));
	this.proxy = f.appendChild(createNode("img", null, {
		position : "absolute",
		visibility : "hidden"
	}));
	var b = function() {
		var g = this.proxy.src;
		if (Browser.type("IE", 0, 8)) {
			if (g.match(/^(\w+:\/\/[^\/]*\/)(.*)$/)) {
				g = RegExp.$1 + encodeURIComponent(RegExp.$2)
			}
		}
		setNode(f, null, {
			width : "100%",
			height : "100%",
			filter : 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + g + '",sizingMethod="scale")'
		});
		Event.trigger(this.outer, "load");
		setNode(this.outer, null, {
			display : "none"
		});
		var h = this;
		window.setTimeout(function() {
			setNode(h.outer, null, {
				display : "block"
			});
			Event.trigger(h, "load")
		}, 0)
	};
	var d = function(g) {
		Event.trigger(this, "error", g)
	};
	Event.addListener(this.proxy, "load", b, this);
	Event.addListener(this.proxy, "error", d, this)
}extend(FiltersImage, XImage);
FiltersImage.prototype.setSrc = function(a) {
	this._src = a;
	setNode(this.proxy, {
		src : a
	})
};
FiltersImage.prototype.getSrc = function() {
	return this._src
};
function DOMImage(a, b) {
	DOMImage.superclass.constructor(this);
	this.outer = createNode("img", a, b);
	Event.addListener(this.outer, "load", function() {
		Event.trigger(this, "load")
	}, this)
}extend(DOMImage, XImage);
if (Browser.type("IE", 6, 8)) {
	window.createXImg = function(a, b) {
		return new FiltersImage(a, b)
	}
} else {
	window.createXImg = function(a, b) {
		return new DOMImage(a, b)
	}
}
function Matrix() {
	this.maxErr = 0.00001;
	this._reset()
}
Matrix.prototype._reset = function() {
	this.thaw([1, 0, 0, 1]);
	this._inverse = null
};
Matrix.prototype.thaw = function(a) {
	this._values = cloneObject(a);
	for (var b = 0; b < this._values.length; ++b) {
		this._values[b] = round(this._values[b], this.maxErr)
	}
	this._inverse = null;
	Event.trigger(this, "change")
};
Matrix.prototype.flip = function() {
	this._values[2] *= -1;
	this._values[3] *= -1;
	this._inverse = null;
	Event.trigger(this, "change")
};
Matrix.prototype.flop = function() {
	this._values[0] *= -1;
	this._values[1] *= -1;
	this._inverse = null;
	Event.trigger(this, "change")
};
Matrix.prototype.rotate = function(a) {
	var b = Math.cos(a);
	var d = Math.sin(a);
	var c = cloneObject(this._values);
	this._values[0] = b * c[0] + d * c[2];
	this._values[1] = b * c[1] + d * c[3];
	this._values[2] = -d * c[0] + b * c[2];
	this._values[3] = -d * c[1] + b * c[3];
	this._fix_err();
	this._inverse = null;
	Event.trigger(this, "change")
};
Matrix.prototype.transform = function(b, d, a) {
	if (a) {
		b -= a.x;
		d -= a.y
	}
	var c = new Point(this._values[0] * b + this._values[1] * d, this._values[2] * b + this._values[3] * d);
	if (a) {
		c.x += a.x;
		c.y += a.y
	}
	return c
};
Matrix.prototype._fix_err = function() {
	for (var a = 0; a < this._values.length; ++a) {
		this._values[a] = round(this._values[a], this.maxErr)
	}
};
Matrix.prototype.freeze = function() {
	return cloneObject(this._values)
};
Matrix.prototype.inverse = function() {
	if (!this._inverse) {
		this._inverse = Matrix.create();
		var a = 1 / (this._values[0] * this._values[3] - this._values[1] * this._values[2]);
		this._inverse.thaw([a * this._values[3], -a * this._values[1], -a * this._values[2], a * this._values[0]])
	}
	return this._inverse
};
Matrix.prototype.isIdentity = function() {
	return this._values[0] == 1 && this._values[1] === 0 && this._values[2] === 0 && this._values[3] == 1
};
Matrix.prototype.clone = function() {
	var a = Matrix.create();
	a.thaw(this.freeze());
	return a
};
Matrix.prototype.apply = Matrix.prototype.destruct = noop;
function FiltersMatrix() {
	FiltersMatrix.superclass.constructor.call(this)
}extend(FiltersMatrix, Matrix);
FiltersMatrix.prototype.destruct = function() {
	FiltersMatrix.superclass.destruct.call(this);
	this.contract = null
};
FiltersMatrix.prototype.apply = function(f, p, k) {
	var d = f._matrix;
	if (!d) {
		var o = null;
		if (f.childNodes && f.childNodes.length) {
			o = [];
			for (var h = 0; h < f.childNodes.length; ++h) {
				o.push(f.childNodes[h])
			}
		}
		d = f._matrix = f.appendChild(createNode("div", {
			className : "matrix"
		}, null, o))
	}
	var b = d.filters["DXImageTransform.Microsoft.Matrix"];
	if (b) {
		this._applyOnFilter(b)
	} else {
		setNode(d, null, {
			marginTop : "-50000px"
		});
		yield(function() {
			var q = {
				filter : getStyle(f, "filter") + " progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')"
			};
			var r = getStyle(f, "backgroundColor");
			if (r && r != "transparent") {
				q.backgroundColor = r
			}
			f.style.filter = f.style.backgroundColor = "";
			setNode(d, null, q);
			yield(function() {
				try {
					if (!d || !d.filters) {
						return
					}
				} catch(s) {
					return
				}
				b = d.filters["DXImageTransform.Microsoft.Matrix"];
				if (!b) {
					return
				}
				this._applyOnFilter(b);
				q.marginTop = null;
				delete q.filter;
				setNode(d, null, q)
			}, this)
		}, this)
	}
	var c = !!k;
	k = k || {};
	k.margin = k.margin || 0;
	k.border = k.border || 0;
	if (p) {
		var l = p.getRect();
		var n = l.dim();
		var m = l.center();
		l.translate(-m.x, -m.y);
		if (c) {
			l.setWidth(l.width() + 2 * (k.margin + k.border), 0);
			l.setHeight(l.height() + 2 * (k.margin + k.border), 0)
		}
		var a = l.getTransformedBounds(this, l.center());
		setNode(d, null, {
			left : (a.left() - l.left() - k.margin - k.border) + "px",
			top : (a.top() - l.top() - k.margin - k.border) + "px",
			padding : (k.margin) + "px",
			width : Math.ceil(n.w + 2 * k.border) + "px",
			height : Math.ceil(n.h + 2 * k.border) + "px"
		})
	} else {
		var j = Dim.fromNode(d.parentNode);
		var g = function() {
			setNode(d, null, {
				left : -k.margin - k.border,
				top : -k.margin - k.border,
				padding : k.margin,
				width : j.w + 2 * k.border,
				height : j.h + 2 * k.border
			})
		};
		if (j.w && j.h) {
			g()
		} else {
			this.contract = true;
			yield(function() {
				if (!this.contract) {
					return
				}
				j = Dim.fromNode(d.parentNode);
				g();
				this.contract = null
			}, this)
		}
	}
	return d
};
FiltersMatrix.prototype._applyOnFilter = function(a) {
	a.M11 = this._values[0];
	a.M12 = this._values[1];
	a.M21 = this._values[2];
	a.M22 = this._values[3]
};
function CSSMatrix(a) {
	CSSMatrix.superclass.constructor.call(this);
	this.styleName = a
}extend(CSSMatrix, Matrix);
CSSMatrix.prototype.apply = function(b) {
	var a = [this._values[0], this._values[2], this._values[1], this._values[3], 0, 0].join(",");
	b.style[this.styleName] = ["matrix(", a, ")"].join("");
	return b
};
function FlipFlopMatrix() {
	FlipFlopMatrix.superclass.constructor.call(this);
	this.flopped = false;
	this.flipped = false
}extend(FlipFlopMatrix, Matrix);
FlipFlopMatrix.prototype.rotate = null;
FlipFlopMatrix.prototype.thaw = function(a) {
	a[1] = Number(a[1]);
	a[2] = Number(a[2]);
	if (Math.abs(a[0]) != 1 || a[1] !== 0 || a[2] !== 0 || Math.abs(a[3]) != 1) {
		var b = new Error(loc("Please use one of the following browsers: {browsers}", {
			browsers : ["Internet Explorer 7.0+", "FireFox 3.5+", "Safari 3.1+", "Chrome 3.0+"].join(", ")
		}));
		b.name = "pv_notsupported";
		throw b
	}
	this.flipped = (a[1] === 0 && a[2] === 0 && a[3] == -1);
	this.flopped = (a[0] == -1 && a[1] === 0 && a[2] === 0);
	FlipFlopMatrix.superclass.thaw.call(this, a)
};
FlipFlopMatrix.prototype.flip = function() {
	this.flipped = !this.flipped;
	FlipFlopMatrix.superclass.flip.call(this)
};
FlipFlopMatrix.prototype.flop = function() {
	this.flopped = !this.flopped;
	FlipFlopMatrix.superclass.flop.call(this)
};
FlipFlopMatrix.prototype.apply = function(b, a) {
	if ( typeof (a.updateImage) == "function") {
		try {
			a.updateImage()
		} catch(c) {
			window.setTimeout(function() {
				a.updateImage()
			})
		}
	}
	return b
};
FlipFlopMatrix.prototype.extraImgParams = function(a) {
	if (this.flipped) {
		a.flip = 1
	}
	if (this.flopped) {
		a.flop = 1
	}
	return a
};
if (Browser.type("IE", 7, 8)) {
	var idMatrix = new FiltersMatrix();
	Matrix.create = function() {
		return new FiltersMatrix()
	};
	Matrix.clear = function(a, b) {
		idMatrix.apply(a, null, b)
	};
	Matrix.extract = function(c) {
		var d = c._matrix;
		if (!d) {
			return null
		}
		var b = d.filters["DXImageTransform.Microsoft.Matrix"];
		if (!b) {
			return null
		}
		var a = Matrix.create();
		a.thaw([b.M11, b.M12, b.M21, b.M22]);
		return a
	}
} else {
	if (Browser.type("Firefox", 3.5) || Browser.layoutEngine("WebKit", 525) || Browser.type("IE", 9)) {
		var styleName;
		if (Browser.layoutEngine("WebKit")) {
			styleName = "WebkitTransform"
		} else {
			if (Browser.isIE) {
				styleName = "-ms-transform"
			} else {
				if (Browser.isFirefox) {
					styleName = "MozTransform"
				} else {
					styleName = "transform"
				}
			}
		}
		Matrix.create = function() {
			return new CSSMatrix(styleName)
		};
		Matrix.clear = function(b) {
			var a = {};
			a[styleName] = "none";
			setNode(b, null, a)
		};
		Matrix.extract = function(d) {
			var b = getStyle(d, styleName);
			if (!b) {
				return null
			}
			b = b.replace(/matrix\((.*)\)$/, "$1").split(",");
			var c = b[2];
			b[2] = b[1];
			b[1] = c;
			var a = Matrix.create();
			a.thaw(b);
			return a
		}
	} else {
		Matrix.create = function() {
			return new FlipFlopMatrix()
		};
		Matrix.clear = noop;
		Matrix.extract = function(a) {
			return null
		}
	}
}
function PercentMap(a) {
	a = a || {};
	this.setMin(a.min || 0);
	this.setMax(a.max || 1)
}
PercentMap.prototype.setMin = function(a) {
	this._min = a
};
PercentMap.prototype.setMax = function(a) {
	this._max = a
};
PercentMap.prototype.getPct = function(a) {
	return (a - this._min) / (this._max - this._min)
};
PercentMap.prototype.getValue = function(a) {
	return a * (this._max - this._min) + this._min
};
function Item(g) {
	var b = Number(g.w || 0);
	var d = Number(g.h || 0);
	var a = Number(g.x || 0);
	var j = Number(g.y || 0);
	this.rect = new Rect(-b / 2, -d / 2, b / 2, d / 2);
	this.translation = new Point(a + b / 2, j + d / 2);
	var f = (this.node = createNode("div", {
		className : "item"
	}, {
		left : "0px",
		top : "0px",
		zIndex : "1"
	}));
	f._data = this;
	var c = (this.matrix = Matrix.create());
	Event.addListener(c, "change", function() {
		this.bgColorNode = c.apply(this.getNode(), this, {
			border : 1
		})
	}, this);
	if (c.constructor == FiltersMatrix) {
		this.selectNode = this.node.appendChild(createNode("div"));
		Event.addListener(this, "scale", function() {
			c.apply(this.getNode(), this, {
				border : 1
			})
		}, this);
		Event.addListener(this, "resized", function() {
			c.apply(this.getNode(), this, {
				border : 1
			})
		}, this)
	} else {
		this.bgColorNode = this.selectNode = this.node
	}
	addClass(this.selectNode, "selectNode");
	if (g.transform) {
		c.thaw(g.transform)
	} else {
		if (g.flipped) {
			this.flip()
		}
		if (g.flopped) {
			this.flop()
		}
	}
	this.z = g.z || 1;
	this.unselect()
}
Item.constrainAspect = function(a) {
	var b = Math.max(a.x, a.y);
	return new Point(b, b)
};
Item.TYPES = {
	TEXT : "text",
	IMAGE : "image",
	PLACEHOLDER : "ph",
	AMAZON_MP3 : "amazon_mp3",
	FB_PHOTO : "fb_photo",
	COLORBLOCK : "colorblock"
};
Item.thaw = function(a) {
	switch(a.type) {
		case Item.TYPES.TEXT:
			return new TextItem(a);
		case Item.TYPES.IMAGE:
			return new ImageItem(a);
		case Item.TYPES.AMAZON_MP3:
			return new AmazonMP3Item(a);
		case Item.TYPES.FB_PHOTO:
			return new FBPhoto(a);
		case Item.TYPES.PLACEHOLDER:
			return new PlaceholderItem(a);
		case Item.TYPES.COLORBLOCK:
			return new ColorBlockItem(a);
		default:
			return new ImageItem(a)
	}
};
Item.cleanSpecForSaving = function(a) {
	if (a.type == Item.TYPES.IMAGE) {
		["masking_policy", "title", "url", "displayurl", "host", "orig_price", "lc_display_price", "display_price", "oa", "a", "visibility"].forEach(function(b) {
			delete a[b]
		});
		if (!a.mask_spec || !a.mask_spec.length) {
			delete a.mask_spec
		}
		if (!a.opacity) {
			delete a.opacity
		}
		if (!a.mask_dirty) {
			delete a.mask_dirty
		}
		if (!a.mask_id) {
			delete a.mask_id
		}
		if (!a.colorize) {
			delete a.colorize
		}
	} else {
		if (a.type == Item.TYPES.PLACEHOLDER) {
			if (a.content) {
				Item.cleanSpecForSaving(a.content)
			}
		}
	}
	if (!a.transform || (a.transform[0] * 1 == 1 && a.transform[1] * 1 === 0 && a.transform[2] * 1 === 0 && a.transform[3] * 1 == 1)) {
		delete a.transform
	}
	if (!a.link) {
		delete a.link
	}
	if (!a.bgColor) {
		delete a.bgColor
	}
};
Item.prototype.shouldConstrainAspect = function() {
	return true
};
Item.prototype.clone = function() {
	return Item.thaw(this.freeze())
};
Item.prototype.getNode = function() {
	return this.node
};
Item.prototype.getMinWidth = Item.prototype.getMinHeight = function() {
	return 10
};
Item.prototype.getResizeHandles = function() {
	return ["nw", "ne", "se", "sw"]
};
Item.prototype.getRotateHandles = function() {
	return this.matrix.rotate === null ? [] : ["n"]
};
Item.prototype.getRect = function() {
	var a = this.rect.clone();
	a.translate(this.translation.x, this.translation.y);
	return a
};
Item.prototype.getMatrix = function() {
	return this.matrix
};
Item.prototype.getBounds = function() {
	var a = this.rect.getTransformedBounds(this.matrix);
	a.translate(this.translation.x, this.translation.y);
	return a
};
Item.prototype.destruct = function() {
	Event.trigger(this, "destruct");
	delayedClearNode(this.node);
	domRemoveNode(this.node);
	Event.release(this);
	this.img = null;
	this.node = null;
	if (this.matrix) {
		this.matrix.destruct()
	}
	this.matrix = null;
	if (this.opacitySlider) {
		this.opacitySlider.destruct();
		this.opacitySlider = null
	}
};
Item.prototype.freeze = function() {
	var a = this.getRect().XYWH();
	a.z = this.z;
	if (!this.matrix.isIdentity()) {
		a.transform = this.matrix.freeze()
	}
	return a
};
Item.prototype.select = Browser.type("IE", null, 8) ? function() {
	if (this.selected) {
		return
	}
	this.selected = true;
	addClass(this.selectNode, "selected");
	this.selectNode._unselectedOpacity = this.selectNode._unselectedOpacity || getStyle(this.selectNode, "filter").replace(/.*alpha\(opacity=([0-9]+).*/, "$1") || 100;
	setNode(this.selectNode, null, {
		opacity : 0.8
	})
} : function() {
	if (this.selected) {
		return
	}
	this.selected = true;
	addClass(this.selectNode, "selected")
};
Item.prototype.unselect = Browser.type("IE", null, 8) ? function() {
	if (!this.selected) {
		return
	}
	this.selected = false;
	removeClass(this.selectNode, "selected");
	setNode(this.selectNode, null, {
		opacity : (this.selectNode._unselectedOpacity || 100) / 100
	})
} : function() {
	if (!this.selected) {
		return
	}
	this.selected = false;
	removeClass(this.selectNode, "selected")
};
Item.prototype.setSelectable = function(a) {
	this.unselectable = !a
};
Item.prototype.beginMove = function() {
	this.translationStart = cloneObject(this.translation);
	Event.trigger(this, "beginmove")
};
Item.prototype.endMove = function() {
	var a;
	Event.trigger(this, "endmove");
	if (this.translationStart && !this.translationStart.equals(this.translation)) {
		a = true;
		Event.trigger(this, "change");
		Event.trigger(this, "moved")
	}
	this.translationStart = null;
	return a
};
Item.prototype.move = function(c, b, a) {
	if (a) {
		if (!this.translationStart) {
			return
		}
		this.translation.x = this.translationStart.x + c;
		this.translation.y = this.translationStart.y + b
	} else {
		this.translation.x += c;
		this.translation.y += b
	}
	this.node.style.cssText = this.node.style.cssText.replace(/left:[^p]*px/i, "left:" + round(this.rect.x1 + this.translation.x, 0.001) + "px").replace(/top:[^p]*px/i, "top:" + round(this.rect.y1 + this.translation.y, 0.001) + "px")
};
Item.prototype.beginResize = function() {
	this.rectStart = this.rect.clone();
	this.translationStart = cloneObject(this.translation);
	Event.trigger(this, "beginresize")
};
Item.prototype.endResize = function() {
	Event.trigger(this, "endresize");
	var a = false;
	if (!this.rectStart.equals(this.rect) || !this.translationStart.equals(this.translation)) {
		Event.trigger(this, "change");
		Event.trigger(this, "resized", this);
		a = true
	}
	this.rectStart = this.translationStart = null;
	return a
};
Item.prototype.canScale = function(a, c) {
	var b = (c || c === undefined) ? this.rectStart : this.rect;
	return (b.width() * a.x >= this.getMinWidth()) && (b.height() * a.y >= this.getMinHeight())
};
Item.prototype.scale = function(c, a, d, b) {
	this._scale(c, a, b);
	this.redraw()
};
Item.prototype._scale = function(c, a, f) {
	if (f === undefined) {
		f = this.shouldConstrainAspect()
	}
	c = f ? Item.constrainAspect(c) : c;
	this.rect = this.rectStart.clone();
	this.rect.scale(c);
	if (a) {
		var b = this.matrix.inverse().transform(a.x - this.translationStart.x, a.y - this.translationStart.y);
		var d = this.matrix.transform(c.x * -b.x, c.y * -b.y);
		this.translation.x = d.x + a.x;
		this.translation.y = d.y + a.y
	} else {
		this.translation.x = this.translationStart.x * c.x;
		this.translation.y = this.translationStart.y * c.y
	}
	Event.trigger(this, "scale")
};
Item.prototype.setScale = function(c, a, d, b) {
	this.beginResize();
	this.scale(c, a, d, b);
	return this.endResize()
};
Item.prototype.beginRotate = function() {
	this.matrixStart = new Matrix();
	this.translationStart = cloneObject(this.translation)
};
Item.prototype.rotate = function(b, a) {
	this.matrix.rotate(b);
	if (a) {
		this.matrixStart.rotate(b);
		this.translation = this.matrixStart.transform(this.translationStart.x, this.translationStart.y, a);
		if (Browser.isSafari) {
			yield(this.redraw, this)
		} else {
			this.redraw()
		}
	}
};
Item.prototype.endRotate = function() {
	this.translationStart = null;
	this.matrixStart = null;
	Event.trigger(this, "change");
	Event.trigger(this, "rotated")
};
Item.prototype.flop = function(b) {
	if (b && b.center) {
		var a = b.center();
		this.translation.x = 2 * a.x - this.translation.x;
		this.redraw()
	}
	this.matrix.flop();
	Event.trigger(this, "change");
	Event.trigger(this, "flopped", this)
};
Item.prototype.flip = function(b) {
	if (b && b.center) {
		var a = b.center();
		this.translation.y = 2 * a.y - this.translation.y;
		this.redraw()
	}
	this.matrix.flip();
	Event.trigger(this, "change");
	Event.trigger(this, "flipped", this)
};
Item.prototype.setZIndex = function(a) {
	this.z = a;
	this.redraw()
};
Item.prototype.redraw = function() {
	var a = {
		left : px(this.rect.x1 + this.translation.x),
		top : px(this.rect.y1 + this.translation.y),
		zIndex : this.z === undefined ? "" : this.z
	};
	setNode(this.node, null, a);
	a = {
		width : px(this.rect.width()),
		height : px(this.rect.height())
	};
	setNode(this.selectNode, null, a)
};
Item.prototype.onSaved = noop;
Item.prototype.hasContent = function() {
	return true
};
Item.prototype.getIcon = function() {
	console.log("implement getIcon")
};
Item.prototype.getActions = function() {
	console.log("implement getActions")
};
Item.prototype.getInfo = function() {
	console.log("implement getInfo")
};
Item.prototype.setColor = noop;
Item.prototype.setOpacity = noop;
Item.prototype.getColorControl = function() {
	if (!Item.colorDS) {
		Item.colorDS = new MemDataSource(ColorPicker.getColorList())
	}
	var d = createNode("div", {
		className : "interactive color_control"
	});
	var c = {
		caption : loc("Color"),
		defaultLabel : loc("All colors"),
		options : Item.colorDS.values(),
		textBoxRenderer : DropDownItemHelper.renderColorTextBox
	};
	var b = new SelectFilter(Item.colorDS, "color", this.color, this.color, c);
	var a = FilterUI.factory("colorpicker", b, c);
	a.attach(d);
	Event.addListener(b, "change", function() {
		this.setColor(b.value)
	}, this);
	return d
};
Item.prototype.getOpacityControl = function() {
	if (Browser.type("IE", 6, 8)) {
		return null
	}
	if (this.opacitySlider) {
		this.opacitySlider.destruct()
	}
	if (!this.opacity) {
		this.opacity = 1
	}
	var l = Math.max(((this.opacity - 0.1) / 0.9) * 100, 0);
	var h = {
		value : l,
		style : {
			width : px(75),
			marginLeft : px(2),
			marginRight : px(2)
		}
	};
	var c = Slider.create(h);
	c.setValue(this.opacity * 100);
	var b = 0;
	var j = Event.wrapper(function() {
		b = c.getValue()
	}, this);
	var f = Event.wrapper(function(m) {
		this.setOpacity((c.getValue() / 100) * 0.9 + 0.1)
	}, this);
	var g = Event.wrapper(function(m) {
		this.setOpacity((c.getValue() / 100) * 0.9 + 0.1)
	}, this);
	Event.addListener(c, "beginslide", j);
	Event.addListener(c, "change", f);
	Event.addListener(c, "endslide", g);
	addClass(c.getNode(), "interactive right");
	var d = createNode("img", {
		src : buildRsrcURL("icons/icon_transparency_clear.gif"),
		width : px(16),
		height : px(16),
		alt : loc("More transparent"),
		className : "right"
	});
	var a = createNode("img", {
		src : buildRsrcURL("icons/icon_transparency_solid.gif"),
		width : px(16),
		height : px(16),
		alt : loc("More solid"),
		className : "right"
	});
	var k = createNode("div", {
		title : loc("Transparency"),
		className : "opacity_control"
	}, null, [a, c.getNode(), d]);
	this.opacitySlider = c;
	return k
};
function ImageItem(data) {
	ImageItem.superclass.constructor.call(this, data);
	this.data = data;
	this.img = createXImg();
	this.thing_id = data.thing_id;
	this.masking_policy = data.masking_policy;
	if (data.bkgd === undefined || data.bkgd === null) {
		this.bkgd = (this.masking_policy == "never" || this.masking_policy == "default_no")
	} else {
		this.bkgd = Boolean(data.bkgd)
	}
	this.opacity = Number(data.opacity || 0);
	this.color = data.colorize;
	data.allow_colorizable = data.allow_colorizable || data.colorize;
	data.allow_opacity = data.allow_opacity || data.opacity;
	if (data.allow_colorizable || data.allow_opacity) {
		this.masking_policy = "default_no";
		this.keepBackground = true;
		this.bkgd = true;
		if (data.allow_opacity && !this.opacity && !Browser.type("IE", 6, 8)) {
			this.opacity = 0.55
		}
	}
	if (data.allow_colorizable && !this.color) {
		this.color = "#000000"
	}
	this.mask_spec = eval(data.mask_spec) || [];
	this.mask_dirty = 0;
	this.aspect = Number(data.a || this.rect.aspect());
	this.orig_aspect = Number(data.oa || (Number(data.oh) / Number(data.ow)));
	if (!this.mask_spec.length && this.bkgd) {
		this.rect.setAspect(this.orig_aspect)
	}
	this.selectNode.appendChild(this.img.getNode());
	this.updateImage()
}extend(ImageItem, Item);
ImageItem.prototype.onSaved = function() {
	this.mask_dirty = 0;
	this.mask_id = 0
};
ImageItem.prototype.redraw = function() {
	this.node.style.cssText = this.node.style.cssText.replace(/left:[^p]*px/i, "left:" + round(this.rect.x1 + this.translation.x, 0.001) + "px").replace(/top:[^p]*px/i, "top:" + round(this.rect.y1 + this.translation.y, 0.001) + "px").replace(/z-index:[ .0-9]*\b/i, "z-index:" + (this.z === undefined ? "" : this.z));
	if (this.opacity) {
		setNode(this.img.getNode(), null, {
			opacity : this.opacity
		})
	}
	this.img.setSize(this.rect)
};
ImageItem.prototype.updateImage = function() {
	this.img.setSrc(this.computeImgURL())
};
ImageItem.prototype.freeze = function() {
	var a = ImageItem.superclass.freeze.call(this);
	var b = {
		type : Item.TYPES.IMAGE,
		thing_id : this.thing_id,
		oa : this.orig_aspect,
		masking_policy : this.masking_policy,
		bkgd : !!this.bkgd,
		mask_spec : this.mask_spec,
		mask_dirty : this.mask_dirty,
		mask_id : this.mask_id,
		opacity : this.opacity,
		colorize : this.color
	};
	if (this.mask_spec.length) {
		b.mask_spec = this.mask_spec
	}
	if (this.mask_dirty) {
		b.mask_dirty = this.mask_dirty
	}
	if (this.mask_id) {
		b.mask_id = this.mask_id
	}
	["title", "url", "displayurl", "orig_price", "lc_display_price", "display_price", "visibility"].forEach(function(c) {
		b[c] = this.data[c]
	}, this);
	return mergeObject(a, b)
};
ImageItem.prototype.clone = function() {
	var b = ImageItem.superclass.clone.call(this);
	b.mask_spec = [];
	for (var a = 0; a < this.mask_spec.length; a++) {
		b.mask_spec.push(cloneObject(this.mask_spec[a]))
	}
	return b
};
ImageItem.prototype.computeImgURL = function(c, b) {
	var a = {
		tid : this.thing_id,
		size : "orig",
		".out" : (!b && this.bkgd && !this.mask_spec.length && !this.color ? "jpg" : "png")
	};
	if (!this.bkgd) {
		a.mask = 1
	}
	if (this.mask_spec.length) {
		a.mask_spec = JSON2.stringify(this.mask_spec)
	}
	if (!c && this.matrix.extraImgParams) {
		this.matrix.extraImgParams(a)
	}
	if (this.color) {
		a.color = this.color
	}
	return buildImgURL("img-thing", a)
};
ImageItem.prototype.mask = function(a) {
	if (!this.mask_spec.length && this.bkgd == a) {
		return
	}
	this.rect.setAspect(this.bkgd ? this.aspect : this.orig_aspect);
	this.bkgd = Boolean(a);
	this.mask_spec = [];
	this.updateImage();
	this.redraw();
	Event.trigger(this, "resized", this);
	Event.trigger(this, "updateactions", this);
	Event.trigger(this, "change")
};
ImageItem.prototype.setDimensions = function(a) {
	this.rect.setWidth(a.w, 0);
	this.rect.setHeight(a.h, 0);
	this.redraw();
	Event.trigger(this, "resized", this)
};
ImageItem.prototype.setMaskSpec = function(c, a, d) {
	this.mask_spec = [];
	for (var b = 0; b < c.length; b++) {
		this.mask_spec.push(new Point(c[b].x, c[b].y))
	}
	if (a) {
		this.mask_id = a
	} else {
		this.mask_dirty = 1
	}
	if (this.mask_spec.length) {
		this.bkgd = 1
	}
	this.updateImage();
	Event.trigger(this, "updateactions", this);
	this.setDimensions(d);
	Event.trigger(this, "change")
};
ImageItem.prototype.getActions = function() {
	var c = {
		flop_btn : {
			method : Event.wrapper(this.flop, this)
		},
		flip_btn : {
			method : Event.wrapper(this.flip, this)
		}
	};
	if (this.masking_policy != "never") {
		var b = buildImgURL("img-thing", {
			tid : this.thing_id,
			size : "orig",
			".out" : "jpg"
		});
		c.cropbkgd_btn = {
			method : Event.wrapper(this.startCrop, this),
			selected : !!this.mask_spec.length,
			single : true,
			icon : [Browser.type("IE", null, 8) ? createNode("img", {
				src : buildRsrcURL("icons/editor/bg_custom_50x50.png"),
				className : "customImg"
			}) : createNode("div", {
				className : "customImg"
			}, {
				backgroundImage : "url(" + b + ")"
			}), createNode("div", {
				className : "custom"
			}, null, loc("Custom") + "...")]
		};
		var d = buildImgURL("img-thing", {
			tid : this.thing_id,
			size : "orig",
			".out" : (this.color ? "png" : "jpg")
		});
		var a = buildImgURL("img-thing", {
			tid : this.thing_id,
			size : "orig",
			mask : 1,
			".out" : "png"
		});
		getNaturalWidthHeight(d, noop);
		getNaturalWidthHeight(a, noop);
		c.showbkgd_btn = {
			method : Event.wrapper(function() {
				this.mask(true)
			}, this),
			disabled : !this.mask_spec.length && !!this.bkgd,
			selected : !this.mask_spec.length && !!this.bkgd,
			single : true,
			icon : Browser.type("IE", null, 8) ? createNode("img", {
				src : d
			}) : createNode("div", null, {
				backgroundImage : "url(" + d + ")",
				backgroundColor : (this.color ? "transparent" : "#ffffff")
			})
		};
		if (!this.keepBackground) {
			c.hidebkgd_btn = {
				method : Event.wrapper(function() {
					this.mask(false)
				}, this),
				disabled : !this.mask_spec.length && !this.bkgd,
				selected : !this.mask_spec.length && !this.bkgd,
				single : true,
				icon : Browser.type("IE", null, 8) ? createNode("img", {
					src : a
				}) : createNode("div", null, {
					backgroundImage : "url(" + a + ")"
				})
			}
		}
	}
	return c
};
ImageItem.prototype.startCrop = function() {
	LassoDialog.showExpanded(this)
};
ImageItem.prototype.getInfo = function() {
	if (this.data) {
		var d = this.data;
		var b = [];
		if (this.data.allow_opacity || this.data.allow_colorizable) {
			var c = createNode("div", {
				className : "controls clearfix right imageitem"
			});
			if (this.data.allow_colorizable) {
				var a = this.getColorControl();
				addClass(a, "right");
				c.appendChild(a)
			}
			if (this.data.allow_opacity) {
				var g = this.getOpacityControl();
				if (g) {
					addClass(g, "right");
					c.appendChild(g)
				}
			}
			b.push(c)
		}
		if (d.title) {
			var f = teaser(d.title, 60);
			if (this.thing_id) {
				f = createNode("a", {
					className : "hover_clickable",
					target : "_blank",
					href : buildURL("thing", {
						id : this.thing_id
					})
				}, null, f)
			}
			b.push(createNode("div", {
				className : "itemtitle right"
			}, null, f))
		}
		return b
	}
	return null
};
ImageItem.prototype.getIcon = function() {
	return UI.itemRender(this, "li2")
};
ImageItem.prototype.getUnmaskedDim = function() {
	if (!this.mask_spec.length) {
		return this.rect.dim()
	}
	var a = 1;
	var d = 0;
	this.mask_spec.forEach(function(f) {
		a = Math.min(a, f.x);
		d = Math.max(d, f.x)
	});
	var b = this.rect.width() / (d - a);
	var c = b * this.orig_aspect;
	return new Dim(b, c)
};
ImageItem.prototype.setColor = function(a) {
	this.color = a;
	this.updateImage();
	this.redraw();
	Event.trigger(this, "change")
};
ImageItem.prototype.setOpacity = function(a) {
	this.opacity = a;
	this.updateImage();
	this.redraw();
	Event.trigger(this, "change")
};
function FBPhoto(b) {
	this.fbImgUrl = b.imgurl;
	this.pid = b.pid;
	FBPhoto.superclass.constructor.call(this, b);
	var a = 3;
	Event.addListener(this.img, "error", function() {
		a--;
		if (a) {
			this.img.setSrc("");
			window.setTimeout(Event.wrapper(function() {
				this.updateImage()
			}, this), 200)
		}
	}, this);
	if (!this.rect.width()) {
		getNaturalWidthHeight(b.imgurl, Event.wrapper(function(c, d) {
			if (c && d) {
				b.w = c;
				b.h = d
			} else {
				b.w = 200;
				b.h = 200
			}
			b.x = 0;
			b.y = 0;
			this.rect = new Rect(-b.w / 2, -b.h / 2, b.w / 2, b.h / 2);
			this.translation = new Point(b.x + b.w / 2, b.y + b.h / 2);
			Event.trigger(this, "change");
			Event.trigger(this, "sized", this)
		}, this))
	}
}extend(FBPhoto, ImageItem);
FBPhoto.mapImgUrl = function(a, b) {
	var d = UI.sizeMap[b].dim;
	var c;
	if (d < 100) {
		c = "t"
	} else {
		if (d < 150) {
			c = "s"
		} else {
		}
	}
	if (c) {
		a = a.replace(/_n\.jpg/, "_" + c + ".jpg").replace(/\/n([^\/]*)\.jpg$/, "/" + c + "$1.jpg")
	}
	return a
};
FBPhoto.prototype.startCrop = function() {
	LassoDialog.showSimple(imgUrl, this, {
		header : loc("Crop your friend's face by drawing a path around it..."),
		onSuccess : Event.wrapper(function(b, a) {
			this.mask_spec = b || [];
			this.updateImage();
			Event.trigger(this, "updateactions", this);
			this.setDimensions(a);
			Event.trigger(this, "change")
		}, this)
	})
};
FBPhoto.prototype.getActions = function() {
	var a = FBPhoto.superclass.getActions.call(this);
	return a
};
FBPhoto.prototype.getIcon = function() {
	var a = UI.sizeMap.li2.dim;
	return createNode("img", {
		width : a,
		height : a,
		src : this.fbImgUrl
	}, {
		width : px(a),
		height : px(a)
	})
};
FBPhoto.prototype.computeImgURL = function(c, b) {
	var a = {
		url : this.fbImgUrl,
		".out" : (!b && this.bkgd && !this.mask_spec.length) ? "jpg" : "png"
	};
	if (!this.bkgd) {
		a.mask = 1
	}
	if (this.mask_spec.length) {
		a.mask_spec = JSON2.stringify(this.mask_spec)
	}
	if (!c && this.matrix.extraImgParams) {
		this.matrix.extraImgParams(a)
	}
	return buildImgURL("img-fbphoto", a)
};
FBPhoto.prototype.freeze = function() {
	var a = FBPhoto.superclass.freeze.call(this);
	var b = {
		imgurl : this.img.getSrc(),
		type : Item.TYPES.FB_PHOTO,
		mask_spec : this.mask_spec,
		pid : this.pid
	};
	return mergeObject(a, b)
};
function TextItem(a) {
	this.font_id = a.font_id;
	this.point = a.point || 100;
	this.paddings = {
		t : 0,
		r : 0,
		b : 0,
		l : 0,
		w : 0
	};
	if (!a.w) {
		a.h = a.h || 0;
		this.autoResize = a.w = 200
	}
	this.startScl = this.scl = a.scale || 1;
	this.state = "init";
	TextItem.superclass.constructor.call(this, a);
	this.selectNode.style.cssText += ";width:1px;";
	this.node.style.cssText += ";width:1px;";
	addClass(this.selectNode, "textitem");
	this.tokensNode = this.selectNode.appendChild(createNode("div"));
	this.setMinTokenWidth(this.getMinWidth());
	this.setColor(a.color || "#000000");
	this.setBGColor(a.bgColor || "");
	this.text = TextItem.cleanText((a.text || a.text === 0) ? "" + a.text : loc("I Love Polyvore"));
	this.link = a.link || "";
	this.tokens = this.text.split(/\s+/).map(function(b) {
		return {
			word : b
		}
	});
	this.desiredMetrics = {
		contract : getUID(this)
	};
	this.cleaner = new Cleaner();
	this.cleaner.push(Event.wrapper(function() {
		Ajax.abortContract(this.desiredMetrics.contract)
	}, this));
	if (a.pos) {
		this.tokenPositions = [];
		a.pos.forEach(function(b) {
			if (!b) {
				return
			}
			var c = (b.t || "").trim();
			if (!c.length) {
				return
			}
			this.tokenPositions.push({
				x : b.x / this.scl,
				y : b.y / this.scl,
				word : c
			})
		}, this);
		if (!this.tokenPositions.length) {
			delete this.tokenPositions
		}
	}
	this.computeFontMetrics()
}extend(TextItem, Item);
TextItem.prototype.destruct = function() {
	this.cleaner.clean();
	TextItem.superclass.destruct.call(this)
};
TextItem.CACHED_METRICS = {};
TextItem.fontListDS = null;
TextItem.getCachedMetrics = function(a) {
	var b = a + ":";
	return (TextItem.CACHED_METRICS[b] = TextItem.CACHED_METRICS[b] || new Hash())
};
TextItem.getSpaceWidth = function(a) {
	var b = TextItem.getCachedMetrics(a).get(" ") || {
		mt : 0,
		mr : 0,
		mb : 0,
		ml : 0,
		w : 0,
		h : 0
	};
	return b.ml + b.w + b.mr
};
TextItem.prototype.getActions = function() {
	return {}
};
TextItem.prototype.getInfo = function() {
	var c = createNode("form", {
		className : "txt controls clearfix"
	});
	if (!Item.colorDS) {
		Item.colorDS = new MemDataSource(ColorPicker.getColorList())
	}
	TextItem.fontListDS = TextItem.fontListDS || new AjaxDataSource("font.list", {
		length : 1000,
		v : 5
	});
	var g = new FontPicker({
		listHeight : "200px"
	});
	this.cleaner.push(Event.addListener(g, "change", function(j) {
		if (j) {
			this.setFont(j)
		}
	}, this));
	var d = TextItem.fontListDS;
	this.cleaner.push(Event.addSingleUseListener(d, "loaded", function() {
		var j = d.find(this, function(m, l) {
			return m.font_id == l.font_id
		});
		var k = d.values();
		if (j < 0) {
			j = k.length;
			k = d.values().concat({
				font_id : this.font_id,
				type : "text"
			})
		}
		g.setItems(k);
		g.select(k[j]);
		show(g.getNode())
	}, this));
	c.appendChild(g.getNode());
	addClass(g.getNode(), "interactive");
	hide(g.getNode());
	d.ensureLoaded();
	var a = c.appendChild(this.getColorControl());
	c.appendChild(createNode("label", {
		"for" : "input_txt",
		className : "interactive"
	}, null, loc("Text")));
	var f = createNode("input", {
		id : "input_txt",
		type : "text",
		className : "interactive text",
		maxlength : 100,
		value : this.text.replace(/\n/g, " ")
	});
	c.appendChild(f);
	var h = createNode("input", {
		className : "interactive btn",
		type : "submit",
		value : loc("Update")
	});
	c.appendChild(h);
	function b() {
		var j = TextItem.cleanText(f.value);
		if (j && j != this.getText()) {
			enable(h)
		} else {
			disable(h)
		}
	}
	this.cleaner.push(Event.addListener(f, "keyup", b, this));
	b.apply(this);
	this.cleaner.push(Event.addListener(c, "submit", function(j) {
		f.value = TextItem.cleanText(f.value);
		if (f.value) {
			this.setText(f.value)
		}
		b.apply(this);
		return Event.stop(j)
	}, this));
	return c
};
TextItem.prototype.getIcon = function() {
	return UI.fontIconRender(this, "li2")
};
TextItem.prototype.freeze = function() {
	var a = 0;
	var f = [];
	if (this.tokenPositions) {
		this.tokenPositions.forEach(function(l) {
			f.push({
				t : l.word,
				x : l.x * this.scl,
				y : l.y * this.scl
			})
		}, this)
	} else {
		var d = this.tokens;
		for (var c = 0; c < d.length; ++c) {
			var b = d[c].node;
			if (b) {
				f.push({
					t : b.getAttribute("title"),
					x : this.paddings.l * this.scl + b.offsetLeft - parseInt(b.style.marginLeft, 10),
					y : this.paddings.t * this.scl + b.offsetTop - parseInt(b.style.marginTop, 10)
				})
			}
		}
	}
	var g = this.getRect();
	var k = Math.max.apply(null, this.getLineMetrics().map(function(l) {
		return l.width
	}).concat(0));
	k = Math.ceil(k);
	if (k && !this.bgColor && hasDim(this.selectNode) && k <= g.width()) {
		g.translate(-this.translation.x, -this.translation.y);
		g.setWidth(k, g.left());
		var h = g.center();
		g.translate(-h.x, -h.y);
		h = this.matrix.transform(h.x, h.y);
		g.translate(h.x + this.translation.x, h.y + this.translation.y)
	}
	var j = g.XYWH();
	j.z = this.z;
	j.transform = this.matrix.freeze();
	return mergeObject(j, {
		type : Item.TYPES.TEXT,
		font_id : this.font_id,
		point : this.point,
		scale : this.scl,
		text : this.text,
		link : this.link,
		color : this.color,
		bgColor : this.bgColor,
		pos : f
	})
};
TextItem.prototype.setColor = function(a) {
	if (a && a != this.color) {
		this.color = a;
		this.rebuildTokens();
		Event.trigger(this, "change")
	}
};
TextItem.prototype.setBGColor = function(a) {
	a = a || "";
	if (a != this.bgColor) {
		this.bgColor = a
	}
	setNode(this.bgColorNode, null, {
		backgroundColor : this.bgColor
	});
	Event.trigger(this, "change")
};
TextItem.cleanText = function(a) {
	return a.replace(/\s+/g, " ").trim()
};
TextItem.prototype.getLink = function() {
	return this.link
};
TextItem.prototype.setLink = function(a) {
	a = a || "";
	if (a != this.link) {
		this.link = a;
		Event.trigger(this, "change")
	}
};
TextItem.prototype.getText = function() {
	if (Ajax.getContract(this.desiredMetrics.contract)) {
		return this.desiredMetrics.text
	} else {
		return this.text
	}
};
TextItem.prototype.setText = function(a) {
	a = TextItem.cleanText(a);
	if ((a || a === 0) && (a != this.text || Ajax.getContract(this.desiredMetrics.contract))) {
		this.desiredMetrics.text = a;
		this.computeFontMetrics();
		return true
	}
	return false
};
TextItem.prototype.setFont = function(a) {
	if (a && (a.font_id != this.font_id || Ajax.getContract(this.desiredMetrics.contract))) {
		this.desiredMetrics.font_id = a.font_id;
		this.computeFontMetrics();
		return true
	}
	return false
};
TextItem.prototype.beginResize = function() {
	this.startScl = this.scl;
	this.getRect();
	TextItem.superclass.beginResize.call(this)
};
TextItem.prototype.shouldConstrainAspect = function(a) {
	a = a || {};
	switch(a.location) {
		case"w":
		case"e":
		case"n":
		case"s":
			return false
	}
	return true
};
TextItem.prototype.scale = function(b, a, c) {
	c = c || {};
	switch(c.location) {
		case"w":
		case"e":
		case"n":
		case"s":
			if (this.tokenPositions) {
				this._clearTokenPositions();
				this.computeFontMetrics()
			}
			if (this.rectStart.width() * b.x >= this._minTokenWidth) {
				this._scale(b, a, false)
			}
			break;
		default:
			b = Item.constrainAspect(b);
			this.scl = this.startScl * b.x;
			this._scale(b, a);
			this._scaleTokens()
	}
	this.redraw()
};
TextItem.prototype.redraw = function() {
	if (this.tokenPositions) {
		TextItem.superclass.redraw.call(this);
		return
	}
	this.selectNode.style.cssText = this.selectNode.style.cssText.replace(/width:[^p]*px/i, "width:" + px(this.rect.width())).replace(/z-index:[ .0-9]*\b/i, "z-index:" + (this.z === undefined ? "" : this.z));
	var a = this.getRect();
	this.node.style.cssText = this.node.style.cssText.replace(/width:[^p]*px/i, "width:" + px(a.width())).replace(/left:[^p]*px/i, "left:" + round(a.left(), 0.001) + "px").replace(/top:[^p]*px/i, "top:" + round(a.top(), 0.001) + "px").replace(/z-index:[ .0-9]*\b/i, "z-index:" + (this.z === undefined ? "" : this.z))
};
TextItem.prototype.computeFontMetrics = function(a) {
	a = a || this.desiredMetrics;
	a.font_id = a.font_id || this.font_id;
	a.text = a.text || this.text;
	a.point = a.point || this.point;
	var b = TextItem.getCachedMetrics(a.font_id);
	var c = a.text.split(/\s+/).filter(function(d) {
		return b.contains(d) ? false : true
	}).uniq().sort();
	if (c.length <= 0) {
		this.state = "ready";
		Ajax.abortContract(a.contract);
		this.onComputeMetricsFinish(a);
		return true
	} else {
		if (!b.contains(" ")) {
			c.push(" ")
		}
		Ajax.get({
			action : "text-metrics",
			contract : a.contract,
			data : {
				v : 6,
				tokens : c,
				font_id : a.font_id,
				point : a.point
			},
			onSuccess : Event.wrapper(function(d) {
				this.state = "ready";
				b.merge(d.metrics);
				this.onComputeMetricsFinish(a)
			}, this)
		});
		return false
	}
};
TextItem.prototype.onComputeMetricsFinish = function(a) {
	var b = false;
	if (this.text != a.text) {
		this.text = a.text;
		this.tokens = this.text.split(/\s+/).map(function(c) {
			return {
				word : c
			}
		});
		b = true;
		this._clearTokenPositions()
	}
	if (this.font_id != a.font_id) {
		this.font_id = a.font_id;
		b = true;
		this._clearTokenPositions();
		yield(function() {
			Event.trigger(this, "updateactions", this)
		}, this)
	}
	this.rebuildTokens();
	Event.bundleEvents(this, "change");
	if (this.autoResize) {
		this.scl = this.autoResize / this.rect.width() * this.scl;
		this.rect.setWidth(this.autoResize, 0);
		this._scaleTokens();
		this.autoResize = null
	} else {
		Event.trigger(this, "resized", this)
	}
	if (b) {
		Event.trigger(this, "change")
	}
	Event.unbundleEvents(this, "change");
	Event.trigger(this, "metricsuptodate")
};
TextItem.prototype.getLineMetrics = function() {
	var h = [];
	if (this.state != "ready") {
		return h
	}
	var k = this.scl;
	var j = TextItem.getCachedMetrics(this.font_id);
	var l = TextItem.getSpaceWidth(this.font_id);
	var a = (this.paddings.r + this.paddings.l) * k;
	var b;
	for (var f = 0; f < this.tokens.length; ++f) {
		var d = j.get(this.tokens[f].word);
		var c = this.tokens[f].node;
		if (!c) {
			continue
		}
		var g = c.offsetTop + c.offsetHeight + depx(getStyle(c, "margin-bottom"));
		if (!b || g > b.baseline) {
			b = {
				tokens : [],
				baseline : g,
				width : a
			};
			h.push(b)
		}
		b.width += Math.round(d.w * k) + Math.round(-d.ml * k) + Math.round(-d.mr * k + l * k);
		b.tokens.push(this.tokens[f])
	}
	return h
};
TextItem.prototype._scaleTokens = function() {
	if (this.state != "ready") {
		return
	}
	var n = TextItem.getCachedMetrics(this.font_id);
	if (this.tokenPositions) {
		var h = {
			ml : 0,
			mt : 0
		};
		this.tokenPositions.forEach(function(r) {
			var q = n.get(r.word);
			if (!q) {
				return
			}
			h.ml = Math.max(h.ml, q.ml);
			h.mt = Math.max(h.mt, q.mt)
		});
		this.tokenPositions.forEach(function(r) {
			var q = n.get(r.word);
			setNode(r.node, null, {
				left : px((-h.ml - q.ml + r.x) * this.scl),
				top : px((-h.mt - q.mt + r.y) * this.scl),
				width : px(q.w * this.scl),
				height : px(q.h * this.scl)
			})
		}, this)
	} else {
		var l = this.tokens;
		var p = TextItem.getSpaceWidth(this.font_id);
		var o = this.scl;
		var b = -1;
		var k = this.getLineMetrics();
		b = Math.min.apply(null, k.map(function(m) {
			return m.width
		}));
		for (var j = 0; j < l.length; ++j) {
			var g = l[j];
			var a = g.word;
			var f = n.get(a);
			var c = (Math.round(f.h * o) - Math.round(f.mt * o) - Math.round(f.mb * o)) - Math.round((f.h - f.mt - f.mb) * o);
			setNode(g.node, null, {
				width : px(f.w * o),
				height : px(f.h * o),
				marginLeft : px(-f.ml * o),
				marginRight : px(-f.mr * o + p * o),
				marginTop : px(-f.mt * o),
				marginBottom : px(-(c + f.mb * o))
			})
		}
		var d = this.paddings;
		setNode(this.tokensNode, null, {
			padding : [d.t * o, d.r * o, d.b * o, d.l * o].map(px).join(" ")
		});
		this.setMinTokenWidth((d.w + d.r + d.l) * this.scl);
		if (this.rect.width() < b) {
			this.rect.setWidth(b, 0)
		}
	}
	Event.trigger(this, "resized", this)
};
TextItem.prototype.rebuildTokens = function() {
	if (this.state != "ready") {
		return
	}
	if (this.tokenPositions) {
		this.rebuildTokensWithPositions();
		return
	}
	clearNode(this.tokensNode);
	var o = TextItem.getCachedMetrics(this.font_id);
	var r = TextItem.getSpaceWidth(this.font_id);
	var n = this.tokens;
	var d = (this.paddings = {
		t : 0,
		r : 0,
		b : 0,
		l : 0,
		w : 0
	});
	var q = this.scl;
	var b = countingSemaphore(n.length, function() {
		yield(this.redraw, this)
	}, this);
	this.cleaner.push(b);
	var h = this.color;
	var p = this.bgColor;
	var s = {
		font_id : this.font_id,
		point : this.point,
		color : h,
		".out" : "png"
	};
	setNode(this.bgColorNode, null, {
		backgroundColor : p
	});
	for (var l = 0; l < n.length; ++l) {
		var g = n[l];
		var a = g.word;
		var f = o.get(a);
		d.t = Math.max(d.t, f.mt);
		d.r = Math.max(d.r, f.mr);
		d.b = Math.max(d.b, f.mb);
		d.l = Math.max(d.l, f.ml);
		d.w = Math.max(d.w, f.w - (f.mr + f.ml));
		s.text = a;
		var k = buildImgURL("img-text.bg", s);
		var c = (Math.round(f.h * q) - Math.round(f.mt * q) - Math.round(f.mb * q)) - Math.round((f.h - f.mt - f.mb) * q);
		var j = createXImg();
		Event.addSingleUseListener(j, "load", b);
		j.setSrc(k);
		setNode(j.getNode(), {
			src : k,
			title : a
		}, {
			width : px(f.w * q),
			height : px(f.h * q),
			marginLeft : px(-f.ml * q),
			marginRight : px(-f.mr * q + r * q),
			marginTop : px(-f.mt * q),
			marginBottom : px(-(c + f.mb * q))
		});
		g.node = this.tokensNode.appendChild(j.getNode())
	}
	setNode(this.tokensNode, null, {
		padding : [d.t * q, d.r * q, d.b * q, d.l * q].map(px).join(" ")
	});
	this.setMinTokenWidth((d.w + d.r + d.l) * q);
	this.redraw()
};
TextItem.prototype.rebuildTokensWithPositions = function() {
	clearNode(this.tokensNode);
	var d = TextItem.getCachedMetrics(this.font_id);
	var h = TextItem.getSpaceWidth(this.font_id);
	var g = countingSemaphore(this.tokenPositions.length, function() {
		yield(this.redraw, this)
	}, this);
	this.cleaner.push(g);
	var b = this.color;
	var f = this.bgColor;
	var a = {
		font_id : this.font_id,
		point : this.point,
		color : b,
		".out" : "png"
	};
	setNode(this.bgColorNode, null, {
		backgroundColor : f
	});
	var c = {
		ml : 0,
		mt : 0
	};
	this.tokenPositions.forEach(function(k) {
		var j = d.get(k.word);
		if (!j) {
			return
		}
		c.ml = Math.max(c.ml, j.ml);
		c.mt = Math.max(c.mt, j.mt)
	});
	this.tokenPositions.forEach(function(n) {
		var o = n.word;
		var j = d.get(o);
		a.text = o;
		var l = buildImgURL("img-text.bg", a);
		var k = createXImg();
		Event.addSingleUseListener(k, "load", g);
		k.setSrc(l);
		setNode(k.getNode(), {
			src : l,
			title : o
		}, {
			width : px(j.w * this.scl),
			height : px(j.h * this.scl),
			left : px((-c.ml - j.ml + n.x) * this.scl),
			top : px((-c.mt - j.mt + n.y) * this.scl),
			position : "absolute"
		});
		n.node = this.tokensNode.appendChild(k.getNode())
	}, this);
	this.setMinTokenWidth(0);
	this.redraw()
};
TextItem.prototype._clearTokenPositions = function() {
	clearNode(this.tokensNode);
	delete this.tokenPositions;
	setNode(this.node, null, {
		height : ""
	});
	setNode(this.selectNode, null, {
		height : ""
	})
};
TextItem.prototype.setMinTokenWidth = function(a) {
	a = a + 1;
	this._minTokenWidth = a;
	if (this.rect.width() < a) {
		this.rect.setWidth(a, 0);
		Event.trigger(this, "resized", this);
		this.redraw()
	}
};
TextItem.prototype.getResizeHandles = function() {
	return ["e", "w", "nw", "ne", "sw", "se"]
};
TextItem.prototype.getRect = function() {
	if (this.selectNode && !this.tokenPositions) {
		setNode(this.selectNode, null, {
			width : px(this.rect.width())
		});
		var a = this.selectNode.clientHeight;
		if (a && this.rect.height() != a) {
			this.rect.setHeight(a, 0);
			Event.trigger(this, "resized", this)
		}
	}
	return TextItem.superclass.getRect.call(this)
};
TextItem.prototype.flip = TextItem.prototype.flop = noop;
TextItem.prototype.setOpacity = function(a) {
	this.opacity = a;
	this.redraw();
	Event.trigger(this, "change")
};
function AmazonMP3Item(a) {
	AmazonMP3Item.superclass.constructor.call(this, a);
	this.data = a;
	this.img = createXImg();
	this.selectNode.appendChild(this.img.getNode());
	this.img.setSrc(a.imgurl)
}extend(AmazonMP3Item, Item);
AmazonMP3Item.prototype.getActions = function() {
	return {}
};
AmazonMP3Item.prototype.freeze = function() {
	var a = AmazonMP3Item.superclass.freeze.call(this);
	a = mergeObject(a, {
		type : Item.TYPES.AMAZON_MP3,
		asin : this.data.asin,
		title : this.data.title,
		artist : this.data.artist,
		imgurl : this.data.imgurl,
		url : this.data.url
	});
	return a
};
AmazonMP3Item.prototype.getIcon = function() {
	return UI.AmazonMP3Render(this.data, "li2")
};
AmazonMP3Item.prototype.getInfo = function() {
	if (this.data) {
		var b = this.data;
		var a = [];
		if (b.title) {
			var c = teaser(b.title, 100);
			if (b.url) {
				c = createNode("a", {
					target : "_blank",
					className : "hover_clickable",
					href : b.url
				}, null, c)
			}
			a.push(createNode("div", {
				className : "interactive"
			}, null, [c, "&nbsp", createNode("span", {
				className : "meta"
			}, null, teaser(b.artist, 100))]))
		}
		return a
	}
	return null
};
AmazonMP3Item.prototype.redraw = function() {
	this.node.style.cssText = this.node.style.cssText.replace(/left:[^p]*px/i, "left:" + round(this.rect.x1 + this.translation.x, 0.001) + "px").replace(/top:[^p]*px/i, "top:" + round(this.rect.y1 + this.translation.y, 0.001) + "px").replace(/z-index:[ .0-9]*\b/i, "z-index:" + (this.z === undefined ? "" : this.z));
	this.img.setSize(this.rect)
};
AmazonMP3Item.prototype.flip = AmazonMP3Item.prototype.flop = noop;
function PlaceholderItem(a) {
	this._setContentCleaner = new Cleaner();
	PlaceholderItem.superclass.constructor.call(this, a);
	this.selectNode.appendChild(createNode("div", {
		className : "bg"
	}));
	this.dropHint = a.dropHint;
	this.hintNode = this.selectNode.appendChild(createNode("div", {
		className : "ph_hint"
	}, null, this.dropHint || loc("Drag item here")));
	makeUnselectable(this.hintNode);
	this._updateHintNodeFontSize();
	addClass(this.node, "placeholder");
	this._clearContent();
	if (a.content) {
		this.setContent(Item.thaw(a.content))
	}
	this.setSelectable(true);
	Event.addListener(this.node, "dragenter", this._onDragEnter, this);
	Event.addListener(this.node, "dragleave", this._onDragLeave, this)
}extend(PlaceholderItem, Item);
PlaceholderItem.prototype.destruct = function() {
	this._clearContent();
	if (this.sliderSize) {
		this.sliderSize.destruct();
		this.sliderSize = null
	}
	if (this.sliderAspect) {
		this.sliderAspect.destruct();
		this.sliderAspect = null
	}
	this._setContentCleaner.clean();
	PlaceholderItem.superclass.destruct.call(this)
};
PlaceholderItem.prototype.freeze = function() {
	var a = this.getRect().XYWH();
	a.z = this.z;
	a.transform = this.matrix.freeze();
	a.type = Item.TYPES.PLACEHOLDER;
	if (this._content) {
		a.content = this._content.freeze()
	}
	if (this.dropHint) {
		a.dropHint = this.dropHint
	}
	return a
};
PlaceholderItem.prototype.redraw = function() {
	var c = this.node.style;
	c.left = round(this.rect.x1 + this.translation.x, 0.001) + "px";
	c.top = round(this.rect.y1 + this.translation.y, 0.001) + "px";
	c.zIndex = this.z === undefined ? "" : this.z;
	var a = round(this.rect.width()) + "px";
	var b = round(this.rect.height()) + "px";
	this.selectNode.style.width = a;
	this.selectNode.style.height = b
};
PlaceholderItem.prototype.clearContent = function() {
	var a = this._content;
	this._clearContent();
	if (a) {
		Event.trigger(this, "removeitem", a);
		Event.trigger(this, "change");
		return a
	}
	return null
};
PlaceholderItem.prototype._clearContent = function() {
	this._percentMap = null;
	addClass(this.selectNode, "empty");
	show(this.hintNode);
	if (this._content) {
		delete this._content.placeholder;
		this.selectNode.removeChild(this._content.getNode());
		Event.release(this._content);
		this._content.destruct();
		this.unselectable = true;
		this._content = null
	}
};
PlaceholderItem.prototype.setContent = function(c, b) {
	if (!c || c == this._content) {
		return
	}
	this._setContentCleaner.clean();
	if (c.rect.width() === 0) {
		this._setContentCleaner.push(Event.addSingleUseListener(c, "sized", function() {
			this._setContent(c, b)
		}, this))
	} else {
		if ( c instanceof TextItem && !c.computeFontMetrics()) {
			var a = Event.addSingleUseListener(c, "metricsuptodate", function() {
				var d = c;
				c = null;
				this._setContent(d, b)
			}, this);
			this._setContentCleaner.push(function() {
				a.clean();
				if (c) {
					c.destruct()
				}
			})
		} else {
			this._setContent(c, b)
		}
	}
};
PlaceholderItem.prototype._setContent = function(c, a) {
	var d = this._content ? this._content.freeze() : null;
	this._clearContent();
	this.selectNode.insertBefore(c.getNode(), this.selectNode.childNodes[0]);
	this._content = c;
	c.placeholder = this;
	if (a) {
		this._fitContent()
	} else {
		this._content.redraw()
	}
	this._content.unselectable = true;
	this.unselectable = false;
	var b = function() {
		if (c == this._content) {
			var g;
			var f;
			if (c.rect.aspect() > 1) {
				f = c.getMinWidth();
				g = 2 * this.rect.height() / c.rect.aspect()
			} else {
				f = Math.max(c.getMinWidth(), c.getMinHeight() / c.rect.aspect());
				g = 2 * this.rect.width()
			}
			this._percentMap.setMax(g);
			this._percentMap.setMin(f)
		}
	};
	Event.addListener(c, "change", b, this);
	this._percentMap = new PercentMap();
	b.apply(this);
	Event.addListener(c, "resized", function(f) {
		if (this.sliderSize) {
			this.sliderSize.setValue(this._percentMap.getPct(this._content.rect.width()) * 100)
		}
	}, this);
	Event.addListener(c, "updateactions", function() {
		var f = [this, "updateactions"].concat(toArray(arguments));
		Event.trigger.apply(null, f)
	}, this);
	hide(this.hintNode);
	removeClass(this.selectNode, "empty");
	if ( c instanceof TextItem) {
		Event.addListener(this._content, "metricsuptodate", this._fitContent, this)
	}
	c.redraw();
	Event.addListener(c, "change", this._setContentCleaner.clean, this._setContentCleaner);
	Event.trigger(this, "additem", this._content, d);
	Event.trigger(this, "change")
};
PlaceholderItem.prototype.hasContent = function() {
	return !!this._content
};
PlaceholderItem.prototype.getContent = function() {
	return this._content
};
PlaceholderItem.prototype.fitContent = function() {
	if (this._fitContent()) {
		Event.trigger(this, "resized");
		Event.trigger(this, "change");
		return true
	}
	return false
};
PlaceholderItem.prototype._fitContent = function() {
	var h = this._content;
	if (!h) {
		return false
	}
	var a = h.getRect();
	var g = this.getRect();
	var f = g.width() / a.width();
	var c = g.height() / a.height();
	if (h.shouldConstrainAspect()) {
		f = ( c = Math.min(f, c))
	}
	if (f != 1 || c != 1) {
		h.beginResize();
		h.scale({
			x : f,
			y : c
		});
		h.endResize()
	}
	a = h.getRect();
	var d = (g.width() - a.width()) / 2 - a.left();
	var b = (g.height() - a.height()) / 2 - a.top();
	if (d !== 0 || b !== 0) {
		h.move(d, b)
	}
	return round(f + d + b, 0.001) != 1
};
PlaceholderItem.prototype.select = function() {
	if (this._content && this.droppable) {
		this._content.select()
	} else {
		PlaceholderItem.superclass.select.call(this)
	}
};
PlaceholderItem.prototype.unselect = function() {
	if (this._content && this.droppable) {
		this._content.unselect()
	} else {
		PlaceholderItem.superclass.unselect.call(this)
	}
};
PlaceholderItem.prototype.beginMove = function(b) {
	if (this._content && this.droppable) {
		var a = this._content.getRect();
		var c = 20;
		this.xMin = -a.width() / 2 + c;
		this.xMax = this.rect.width() + a.width() / 2 - c;
		this.yMin = -a.height() / 2 + c;
		this.yMax = this.rect.height() + a.height() / 2 - c;
		this._content.beginMove()
	} else {
		PlaceholderItem.superclass.beginMove.call(this)
	}
};
PlaceholderItem.prototype.endMove = function() {
	if (this._content && this.droppable) {
		var a = this._content.endMove();
		if (a) {
			Event.trigger(this, "change")
		}
		return a
	} else {
		return PlaceholderItem.superclass.endMove.call(this)
	}
};
PlaceholderItem.prototype.move = function(d, b, a, h) {
	if (this._content && this.droppable && !h) {
		var c = this.matrix.inverse().transform(d, b);
		var g, f;
		if (a) {
			if (!this._content.translationStart) {
				return
			}
			g = this._content.translationStart.x + c.x;
			f = this._content.translationStart.y + c.y
		} else {
			g = this._content.translation.x + c.x;
			f = this._content.translation.y + c.y
		}
		var j = new Point(g, f);
		g = Math.min(this.xMax, Math.max(this.xMin, g));
		f = Math.min(this.yMax, Math.max(this.yMin, f));
		this._content.move(g - this._content.translation.x, f - this._content.translation.y, false);
		return j
	} else {
		PlaceholderItem.superclass.move.apply(this, arguments)
	}
};
PlaceholderItem.prototype.shouldConstrainAspect = function() {
	return false
};
PlaceholderItem.prototype.endResize = function(b) {
	Event.bundleEvents(this, "change");
	var a = PlaceholderItem.superclass.endResize.call(this);
	if (a && this._content && b !== false) {
		this._fitContent();
		this._content.redraw()
	}
	Event.unbundleEvents(this, "change");
	return a
};
PlaceholderItem.prototype.setScale = function(c, a, f, b) {
	var g;
	var d = {
		x : this.rect.width() / 2,
		y : this.rect.height() / 2
	};
	this.beginResize();
	this.scale(c, a, f, b);
	g = this.endResize(false);
	if (g && this._content) {
		this._content.setScale.call(this._content, c, d, f, b);
		this._content.move(this.rect.width() / 2 - d.x, this.rect.height() / 2 - d.y)
	}
	return g
};
PlaceholderItem.prototype.scale = function(c, a, d, b) {
	PlaceholderItem.superclass._scale.call(this, c, a, b);
	this.redraw();
	this._updateHintNodeFontSize()
};
PlaceholderItem.prototype._updateHintNodeFontSize = function() {
	if (Browser.type("IE", null, 8)) {
		return
	}
	var a = mapRange(Math.min(this.rect.width(), this.rect.height()), [0, 50, 120, 10000], [0.7, 0.7, 1.5, 1.5]);
	a = round(a, 0.01) + "em";
	setNode(this.hintNode, null, {
		fontSize : a
	})
};
PlaceholderItem.prototype.getIcon = function() {
	if (this._content && this.droppable) {
		return this._content.getIcon()
	}
	return null
};
PlaceholderItem.prototype.getInfo = function() {
	if (this._content && this.droppable) {
		var d = [];
		if (this.sliderSize) {
			this.sliderSize.destruct()
		}
		var m = this.getIcon();
		setNode(m, {
			className : "right smaller_icon"
		});
		var a = this.getIcon();
		setNode(a, {
			className : "right bigger_icon"
		});
		var l = (this.sliderSize = Slider.create({
			nubDim : 4.5
		}));
		addClass(l.getNode(), "interactive right sliderSize");
		d.push(createNode("div", {
			className : "ph_controls controls right"
		}, null, [a, l.getNode(), m, '<br class="clear">']));
		var n = this._content.rect.width();
		l.setValue(this._percentMap.getPct(n) * 100);
		Event.addListener(this._content, "change", function() {
			l.setValue(this._percentMap.getPct(this._content.rect.width()) * 100)
		}, this);
		Event.addListener(l, "beginslide", function() {
			this._content.beginResize();
			n = this._content.rect.width()
		}, this);
		Event.addListener(l, "change", function(q, s) {
			var r = Number(l.getValue()) / 100;
			if (!r && r !== 0) {
				return
			}
			if (!l.sliding()) {
				this._content.beginResize()
			}
			var p = this._percentMap.getValue(r) / n;
			var o = this._content.rectStart;
			if (this._content.translation.x + p * o.width() / 2 < 10 || this._content.translation.x - p * o.width() / 2 > this.rect.width() - 10 || this._content.translation.y + p * o.height() / 2 < 10 || this._content.translation.y - p * o.height() / 2 > this.rect.height() - 10) {
				l.setValue(s);
				return
			}
			this._content.scale({
				x : p,
				y : p
			}, {
				x : this._content.translation.x,
				y : this._content.translation.y
			});
			if (!l.sliding()) {
				if (this._content.endResize()) {
					Event.trigger(this, "change")
				}
			}
		}, this);
		Event.addListener(l, "endslide", function() {
			if (this._content.endResize()) {
				Event.trigger(this, "change")
			}
		}, this);
		if (this._content instanceof TextItem) {
			if (this.sliderAspect) {
				this.sliderAspect.destruct()
			}
			var h = (this.sliderAspect = Slider.create({
				nubDim : 4.5
			}));
			addClass(h.getNode(), "interactive right sliderAspect");
			d.push(createNode("div", {
				className : "ph_controls controls right"
			}, null, [createNode("ul", {
				className : "right wider"
			}, null, "---".split("").map(function(o) {
				return createNode("i", null, null, o)
			})), h.getNode(), createNode("ul", {
				className : "right taller"
			}, null, "---".split("").map(function(o) {
				return createNode("i", null, null, o)
			})), '<br class="clear">']));
			var c = this._content.rect.width();
			var j = 0;
			this._content.getLineMetrics().forEach(function(o) {
				j += o.width
			});
			var g = new PercentMap({
				min : this._content.getMinWidth(),
				max : j
			});
			h.setValue(g.getPct(c) * 100);
			Event.addListener(this._content, "change", function() {
				var o = 0;
				this._content.getLineMetrics().forEach(function(p) {
					o += p.width
				});
				g.setMax(o);
				g.setMin(this._content._minTokenWidth);
				h.setValue(g.getPct(this._content.rect.width()) * 100)
			}, this);
			Event.addListener(h, "beginslide", function() {
				this._content.beginResize();
				c = this._content.rect.width()
			}, this);
			Event.addListener(h, "change", function(p, r) {
				var q = Number(h.getValue()) / 100;
				if (!q && q !== 0) {
					return
				}
				if (!h.sliding()) {
					this._content.beginResize()
				}
				var o = g.getValue(q) / c;
				this._content.scale({
					x : o,
					y : 1
				}, {
					x : this._content.translation.x,
					y : this._content.translation.y
				}, {
					location : "w"
				}, false);
				if (!h.sliding()) {
					if (this._content.endResize()) {
						Event.trigger(this, "change")
					}
				}
			}, this);
			Event.addListener(h, "endslide", function() {
				if (this._content.endResize()) {
					Event.trigger(this, "change")
				}
			}, this)
		}
		var b = toArray(this._content.getInfo());
		if (b.length) {
			d = d.concat(b)
		}
		return d
	} else {
		var k = createNode("input", {
			name : "drophint",
			type : "text",
			maxlength : 100,
			className : "interactive"
		});
		var f = this.dropHint;
		Event.addListener(k, "keypress", function() {
			yield(function() {
				this.dropHint = k.value.trim();
				setNode(this.hintNode, null, null, this.dropHint || this.defaultDropHint)
			}, this)
		}, this);
		Event.addListener(k, "blur", function() {
			if (this.dropHint != f) {
				Event.trigger(this, "change")
			}
		}, this);
		InputHint.add(k, textContent(this.hintNode));
		if (this.dropHint) {
			InputHint.setValue(k, this.dropHint)
		}
		return createNode("div", {
			className : "controls"
		}, null, [createNode("label", {
			"for" : "drophint"
		}, {
			paddingRight : "4px"
		}, loc("Hint")), k])
	}
};
PlaceholderItem.prototype.getActions = function() {
	if (this._content && this.droppable) {
		var b = {
			fit_btn : {
				method : Event.wrapper(this.fitContent, this)
			}
		};
		var a = this._content.getActions();
		if (a.flop_btn) {
			b.flop_btn = a.flop_btn;
			b.flop_btn.method = Event.wrapper(this.flop, this)
		}
		if (a.flip_btn) {
			b.flip_btn = a.flip_btn;
			b.flip_btn.method = Event.wrapper(this.flip, this)
		}
		if (a.hidebkgd_btn) {
			b.hidebkgd_btn = a.hidebkgd_btn;
			b.hidebkgd_btn.method = Event.wrapper(function() {
				this.mask(false)
			}, this)
		}
		if (a.showbkgd_btn) {
			b.showbkgd_btn = a.showbkgd_btn;
			b.showbkgd_btn.method = Event.wrapper(function() {
				this.mask(true)
			}, this)
		}
		return b
	} else {
		return {}
	}
};
PlaceholderItem.prototype.flop = function() {
	if (this._content && this.droppable) {
		this._content.flop();
		Event.trigger(this, "change");
		Event.trigger(this, "flopped", this)
	}
};
PlaceholderItem.prototype.flip = function() {
	if (this._content && this.droppable) {
		this._content.flip();
		Event.trigger(this, "change");
		Event.trigger(this, "flipped", this)
	}
};
PlaceholderItem.prototype.mask = function(a) {
	if (this._content && this.droppable) {
		this._content.mask(a);
		Event.trigger(this, "resized", this);
		Event.trigger(this, "updateactions", this);
		Event.trigger(this, "change")
	}
};
PlaceholderItem.prototype._onDrop = function(b) {
	var c = b.xDataTransfer.getData("item");
	if (!c || (c.type && c.type != Item.TYPES.IMAGE && c.type != Item.TYPES.AMAZON_MP3 && (!bucketIs("launch", "on") || c.type != Item.TYPES.TEXT) && c.type != Item.TYPES.FB_PHOTO && c.type != Item.TYPES.COLORBLOCK)) {
		return
	}
	Event.bundleEvents(this, "change");
	var a = Item.thaw(c);
	if (c.mask) {
		a.mask(false)
	}
	this.setContent(a, true);
	this.droppable = true;
	Event.unbundleEvents(this, "change");
	removeClass(this.selectNode, "drophover");
	return Event.stop(b)
};
PlaceholderItem.prototype._onDragEnter = function(a) {
	if (this.droppable && a.xDataTransfer && a.xDataTransfer.getData("item")) {
		addClass(this.selectNode, "drophover")
	}
};
PlaceholderItem.prototype._onDragLeave = function(a) {
	if (this.droppable) {
		removeClass(this.selectNode, "drophover")
	}
};
PlaceholderItem.prototype.setSelectable = function(a) {
	if (a) {
		Event.removeListener(this.node, "drop", this._onDrop, this);
		this.defaultDropHint = loc("Placeholder");
		removeClass(this.node, "droppable");
		setNode(this.hintNode, null, null, this.dropHint || this.defaultDropHint);
		this.droppable = false;
		this.unselectable = false;
		if (this._content) {
			addClass(this.selectNode, "empty");
			show(this.hintNode);
			setNode(this._content.selectNode, null, {
				visibility : "hidden"
			})
		}
	} else {
		Event.addListener(this.node, "drop", this._onDrop, this);
		addClass(this.node, "droppable");
		removeClass(this.selectNode, "drophover");
		this.defaultDropHint = loc("Drag item here");
		setNode(this.hintNode, null, null, this.dropHint || this.defaultDropHint);
		this.droppable = true;
		this.unselectable = !this._content;
		if (this._content) {
			this._content.unselect();
			removeClass(this.selectNode, "empty");
			hide(this.hintNode);
			setNode(this._content.selectNode, null, {
				visibility : "visible"
			})
		}
	}
};
PlaceholderItem.prototype.getResizeHandles = function() {
	return (this._content && this.droppable) ? [] : PlaceholderItem.superclass.getResizeHandles.call(this)
};
PlaceholderItem.prototype.getRotateHandles = function() {
	return (this._content && this.droppable) ? [] : PlaceholderItem.superclass.getRotateHandles.call(this)
};
function SimpleImageItem(b) {
	this.src = b.src;
	SimpleImageItem.superclass.constructor.call(this, b);
	this.img = createXImg();
	this.selectNode.appendChild(this.img.getNode());
	this.updateImage();
	var a = 3;
	Event.addListener(this.img, "error", function() {
		a--;
		if (a) {
			this.img.setSrc("");
			window.setTimeout(Event.wrapper(function() {
				this.updateImage()
			}, this), 200)
		}
	}, this);
	if (!this.rect.width()) {
		getNaturalWidthHeight(b.imgurl, Event.wrapper(function(c, d) {
			if (c && d) {
				b.w = c;
				b.h = d
			} else {
				b.w = 200;
				b.h = 200
			}
			b.x = 0;
			b.y = 0;
			this.rect = new Rect(-b.w / 2, -b.h / 2, b.w / 2, b.h / 2);
			this.translation = new Point(b.x + b.w / 2, b.y + b.h / 2);
			this.aspect = Number(b.a || this.rect.aspect());
			Event.trigger(this, "change");
			Event.trigger(this, "sized", this)
		}, this))
	}
}extend(SimpleImageItem, Item);
SimpleImageItem.prototype.getActions = function() {
	return []
};
SimpleImageItem.prototype.getIcon = function() {
	var a = UI.sizeMap.li2.dim;
	return createNode("img", {
		width : a,
		height : a,
		src : this.src
	}, {
		width : px(a),
		height : px(a)
	})
};
SimpleImageItem.prototype.computeImgURL = function(b, a) {
	return this.src
};
SimpleImageItem.prototype.updateImage = function() {
	this.img.setSrc(this.computeImgURL())
};
SimpleImageItem.prototype.redraw = function() {
	this.node.style.cssText = this.node.style.cssText.replace(/left:[^p]*px/i, "left:" + round(this.rect.x1 + this.translation.x, 0.001) + "px").replace(/top:[^p]*px/i, "top:" + round(this.rect.y1 + this.translation.y, 0.001) + "px").replace(/z-index:[ .0-9]*\b/i, "z-index:" + (this.z === undefined ? "" : this.z));
	this.img.setSize(this.rect)
};
function ColorBlockItem(a) {
	a.w = Number(a.w || 0);
	a.h = Number(a.h || 0);
	a.x = Number(a.x || 0);
	a.y = Number(a.y || 0);
	if (!a.w || !a.h) {
		a.h = 200;
		a.w = 200
	}
	ColorBlockItem.superclass.constructor.call(this, a);
	this.data = a;
	this.color = this.data.color || "#00000000";
	this.title = this.data.title;
	this.clid = this.data.clid;
	this.opacity = this.data.opacity;
	this.canvas = createNode("div", null, {
		backgroundColor : this.color,
		width : "100%",
		height : "100%"
	});
	this.selectNode.appendChild(this.canvas);
	yield(this.redraw, this)
}extend(ColorBlockItem, Item);
ColorBlockItem.prototype.getActions = function() {
	var a = {
		square_btn : {
			method : Event.wrapper(this.makeSquare, this)
		}
	};
	return a
};
ColorBlockItem.prototype.redraw = function() {
	ColorBlockItem.superclass.redraw.call(this);
	if (this.opacity) {
		setNode(this.canvas, null, {
			opacity : this.opacity
		})
	}
};
ColorBlockItem.prototype.freeze = function() {
	var a = ColorBlockItem.superclass.freeze.call(this);
	a = mergeObject(a, {
		type : Item.TYPES.COLORBLOCK,
		color : this.color,
		clid : this.clid,
		title : this.title,
		opacity : this.opacity
	});
	return a
};
ColorBlockItem.prototype.getIcon = function() {
	var a = UI.sizeMap.li2.dim;
	return createNode("span", {
		className : "coloricon"
	}, {
		backgroundColor : this.color,
		width : px(a),
		height : px(a)
	})
};
ColorBlockItem.getUrl = function(c) {
	var b = "http://www.colourlovers.com/";
	var a = c.color.substring(1);
	if (a.length == 1) {
		a = a + a + a + a + a + a
	} else {
		if (a.length == 2) {
			a = a + a + a
		} else {
			if (a.length == 3) {
				a = a + a
			}
		}
	}
	b += "color/" + a;
	return b
};
ColorBlockItem.prototype.getInfo = function() {
	if (this.data) {
		var b = this.data;
		var a = [];
		var c = this.getOpacityControl();
		if (c) {
			addClass(c, "right controls");
			a.push(c)
		}
		a.push(createNode("div", {
			className : "interactive right itemtitle"
		}, null, [createNode("a", {
			target : "_blank",
			className : "hover_clickable",
			href : ColorBlockItem.getUrl(this.data)
		}, null, this.data.title || this.color)]));
		return a
	}
	return null
};
ColorBlockItem.prototype.setColor = function(a) {
	if (this.color == a) {
		return
	}
	this.color = a;
	setNode(this.canvas, null, {
		backgroundColor : this.color
	});
	Event.trigger(this, "updateactions", this)
};
ColorBlockItem.prototype.scale = function(c, a, d, b) {
	d = d || {};
	if (b) {
		ColorBlockItem.superclass.scale.apply(this, arguments)
	} else {
		switch(d.location) {
			case"w":
			case"e":
				c.y = 1;
				break;
			case"n":
			case"s":
				c.x = 1;
				break;
			default:
		}
		this._scale(c, a, b);
		this.redraw()
	}
};
ColorBlockItem.prototype.shouldConstrainAspect = function() {
	return false
};
ColorBlockItem.prototype.getResizeHandles = function() {
	return ["n", "s", "e", "w", "nw", "ne", "se", "sw"]
};
ColorBlockItem.prototype.flip = ColorBlockItem.prototype.flop = noop;
ColorBlockItem.prototype.makeSquare = function() {
	var a = {
		x : 1,
		y : 1
	};
	this.beginResize();
	if (this.rect.width() < this.rect.height()) {
		a.x = this.rect.height() / this.rect.width()
	} else {
		a.y = this.rect.width() / this.rect.height()
	}
	this._scale(a, this.translation, false);
	this.redraw();
	this.endResize()
};
ColorBlockItem.prototype.setOpacity = function(a) {
	this.opacity = a;
	this.redraw();
	Event.trigger(this, "change")
};
var ModalDialog = function() {
	setDefaultEmbedWMode("opaque");
	var c;
	var f;
	var b;
	var h;
	var a;
	var d = false;
	function g() {
		if (c) {
			return
		}
		h = createNode("div", {
			className : "close"
		}, null, "&times;");
		b = createNode("span", {
			className : "container"
		}, null, h);
		f = createNode("center", {
			className : "dialog"
		}, {
			display : "none"
		}, b);
		c = createNode("div", {
			className : "block"
		}, {
			display : "none"
		});
		document.body.appendChild(c);
		document.body.appendChild(f);
		Event.addListener(h, "click", ModalDialog.hide);
		Event.addListener(document, "keydown", function(l) {
			if (!d) {
				return
			}
			if (l.keyCode == 27) {
				ModalDialog.hide();
				return Event.stop(l)
			}
			if (l.keyCode == 13) {
				if (Event.getSource(l).tagName.match(/input|textarea/i)) {
					return
				}
				var k = getElementsByClassName({
					root : ModalDialog.getContent(),
					tagName : "ul",
					className : "actions"
				});
				if (k.length) {
					var j = getElementsByClassName({
						root : k[k.length - 1],
						className : "btn_action"
					});
					if (j.length) {
						j[0].click();
						Event.stop(l)
					}
				}
			}
		});
		Event.addListener(window, "resize", ModalDialog.rePosition)
	}
	return {
		init : g,
		isShown : function() {
			return d
		},
		getContent : function() {
			if (!d) {
				return null
			}
			return a
		},
		setContent : function(j) {
			if (!d) {
				return
			}
			g();
			a = j;
			while (b.childNodes.length) {
				b.removeChild(b.childNodes[0])
			}
			setNode(b, null, null, flatten([h, a]));
			ModalDialog.rePosition()
		},
		show : function(j) {
			g();
			d = true;
			ModalDialog.setContent(j);
			ModalDialog.reRaise();
			show(c);
			show(f);
			ModalDialog.rePosition();
			yield(ModalDialog.rePosition);
			Event.trigger(ModalDialog, "show");
			return false
		},
		reRaise : function() {
			if (!d) {
				return
			}
			var j = overlayZIndex();
			setNode(c, null, {
				zIndex : j
			});
			setNode(f, null, {
				zIndex : j + 1
			})
		},
		rePosition : function() {
			if (!d) {
				return
			}
			var l = Dim.fromNode(f);
			var j = getWindowSize();
			if (j.h > l.h) {
				var k = Math.min((j.h - l.h) / 3, 50);
				setNode(f, null, {
					position : "fixed",
					top : px(k)
				})
			} else {
				var m = scrollXY();
				setNode(f, null, {
					position : "absolute",
					top : px(m.y)
				})
			}
		},
		hide : function(j) {
			if (!d) {
				return
			}
			g();
			j = j || (j === undefined);
			setNode(f, null, {
				display : "none"
			});
			setNode(c, null, {
				display : "none"
			});
			if (a) {
				b.removeChild(a);
				if (j) {
					Event.trigger(a, "destruct");
					purge(a)
				}
				a = null
			}
			d = false;
			Event.trigger(ModalDialog, "hide")
		},
		createErrorElement : function(j) {
			return {
				type : "rotext",
				id : j,
				className : "error",
				rowClassName : "error_placeholder"
			}
		},
		show_uic : function(k) {
			k = k || {};
			if (k.constructor !== Object) {
				k = {
					body : k
				}
			}
			k.id = k.id || "";
			k.className = k.className || "";
			var l = createNode("div", {
				id : k.id,
				className : "uic " + k.className
			});
			var j = l.appendChild(createNode("div", {
				className : "body"
			}));
			if (k.title) {
				j.appendChild(createNode("h1", null, null, k.title))
			}
			if (k.body) {
				j.appendChild(k.body)
			}
			if (k.actions && k.actions.length > 0) {
				l.appendChild(UI.renderActions(k.actions))
			}
			if (k.onHide) {
				Event.addSingleUseListener(ModalDialog, "hide", k.onHide)
			}
			ModalDialog.show(l)
		},
		alert : function(j) {
			j = j || {};
			if (j.constructor !== Object) {
				j = {
					content : j
				}
			}
			j.body = createNode("div", {
				className : "alert_content"
			}, null, j.content);
			j.className = (j.className || "") + " alert";
			j.actions = [{
				label : createNode("span", {
					className : "btn btn_action"
				}, null, j.okLabel || loc("OK")),
				action : function() {
					(j.onOk || noop)();
					ModalDialog.hide()
				}
			}];
			return ModalDialog.show_uic(j)
		},
		confirm : function(j) {
			j = j || {};
			if (j.constructor !== Object) {
				j = {
					title : j
				}
			}
			if (j.content) {
				j.body = createNode("div", {
					className : "confirm_content"
				}, null, j.content)
			}
			j.className = (j.className || "") + " confirm";
			j.actions = [{
				label : createNode("span", {
					className : "btn btn_action"
				}, null, j.okLabel || loc("OK")),
				action : function() {
					(j.onOk || noop)();
					ModalDialog.hide()
				}
			}, {
				label : j.cancelLabel || loc("Cancel"),
				action : function() {
					(j.onCancel || noop)();
					ModalDialog.hide()
				}
			}];
			return ModalDialog.show_uic(j)
		}
	}
}();
function Orderable(a, b) {
	this._results = a;
	this._source = a.getSource();
	this._restrictToCurrentResults = b;
	Event.addListener(a, "additem", this.addDropListener, this);
	Event.addListener(a, "dragstart", this.onDragStart, this);
	Event.addListener(a.getNode(), "dragend", this.onDragEnd, this);
	Event.addListener(a.getNode(), "drop", this.onResultSetDrop, this)
}
Orderable.prototype.onResultSetDrop = function(a) {
	var b = a.xDataTransfer.getData("data");
	if (b) {
		if (this._source.contains(b)) {
			this._source.moveToEnd(b)
		} else {
			if (!this._restrictToCurrentResults) {
				this._source.append(b)
			}
		}
		Event.stopBubble(a)
	}
};
Orderable.prototype.addDropListener = function(a) {
	Event.addListener(a, "drop", function(b) {
		this.onDrop(b, a)
	}, this);
	Event.addListener(a, "dragenter", function(b) {
		this.onDragEnter(b, a)
	}, this);
	Event.addListener(a, "dragleave", function(b) {
		this.onDragLeave(b, a)
	}, this)
};
Orderable.prototype.onDrop = function(b, a) {
	var c = b.xDataTransfer.getData("data");
	removeClass(a, "dragenter");
	if (c) {
		if (this._source.contains(c)) {
			this._source.moveBefore(c, a._data)
		} else {
			if (!this._restrictToCurrentResults) {
				this._source.insertBefore(c, a._data)
			}
		}
		Event.stopBubble(b);
		Event.trigger(this, "reordered");
		return
	}
};
Orderable.prototype.onDragEnter = function(b, a) {
	var c = b.xDataTransfer.getData("data");
	if (c && c == a._data) {
		return
	}
	if (!this._restrictToCurrentResults || this._source.contains(c)) {
		addClass(a, "dragenter")
	}
};
Orderable.prototype.onDragLeave = function(b, a) {
	removeClass(a, "dragenter")
};
Orderable.prototype.onDragStart = function(b, a, d) {
	b.xDataTransfer.setData("data", d);
	var c = this._results.getRenderer();
	b.xDataTransfer.proxy = c(d);
	Event.stop(b)
};
Orderable.prototype.onDragEnd = function(a, c) {
	if (domContainsChild(this._results.getNode(), c) || this._restrictToCurrentResults) {
		return
	}
	var b = a.xDataTransfer.getData("data");
	if (b) {
		this._source.remove(b)
	}
};
function AutoSizer(b) {
	b = b || {};
	this.minItemsPerRow = b.minItemsPerRow || 5;
	this.resizeWidth = b.resizeWidth === undefined ? true : b.resizeWidth;
	this.resizeHeight = b.resizeHeight === undefined ? true : b.resizeHeight;
	var c = Number(b.imgSize) || (UI.sizeMap[b.imgSize] || UI.sizeMap.s).dim;
	this.itemSizeDelta = b.itemSizeDelta === undefined ? 9 : b.itemSizeDelta;
	this.itemSize = c + this.itemSizeDelta;
	if (b.minImgSize) {
		var a = Number(b.minImgSize) || (UI.sizeMap[b.minImgSize] || UI.sizeMap.s).dim;
		this.minItemSize = a + this.itemSizeDelta;
		delete this.minItemsPerRow
	}
	this.sizeRuleClass = b.sizeRuleClass || "autosize";
	this.resizePage = b.sizePage === undefined ? true : b.sizePage;
	this.getScrollbarWidth = this.resizePage ? function() {
		return 0
	} : getScrollbarWidth;
	this.sizeRuleStyle = {};
	if (this.resizePage) {
		this.sizeRuleStyle.visibility = "hidden";
		editCSSRule("." + this.sizeRuleClass, this.sizeRuleStyle)
	}
}
AutoSizer.prototype.sizeContents = function(c) {
	var d = Dim.fromNode(c).w;
	if (!d) {
		return
	}
	var b = d - this.getScrollbarWidth() - 1;
	var a = this.getItemsPerRow(c);
	var g = b / a - (a + 1) / a * (this.itemSizeDelta);
	var f = px(Math.floor(g));
	if (this.resizeWidth) {
		this.sizeRuleStyle.width = f
	}
	if (this.resizeHeight) {
		this.sizeRuleStyle.height = f
	}
	editCSSRule("." + this.sizeRuleClass, this.sizeRuleStyle);
	this.sizePage(c)
};
AutoSizer.prototype.getItemsPerRow = function(c) {
	var d = Dim.fromNode(c).w;
	if (!d) {
		return 0
	}
	var b = d - this.getScrollbarWidth() - 1;
	var a;
	if (this.minItemSize) {
		a = Math.floor((b - this.itemSizeDelta) / this.minItemSize)
	} else {
		a = this.resizeWidth ? Math.ceil(b / this.itemSize) : Math.floor(b / this.itemSize);
		if (this.resizeWidth && this.minItemsPerRow) {
			a = Math.max(this.minItemsPerRow, a)
		}
	}
	return a
};
AutoSizer.prototype.sizePage = function(a) {
	if (!this.resizePage) {
		return
	}
	setNode(a, null, {
		overflow : "hidden"
	});
	yield(function() {
		var d = getElementsByClassName({
			root : a,
			className : this.sizeRuleClass
		});
		if (!d.length) {
			return
		}
		var f = getElementSize(d[0]).h;
		if (!f) {
			return
		}
		var c = Math.floor(a.clientHeight / f);
		if (!c) {
			return
		}
		var b = this.getItemsPerRow(a) || 0;
		Event.trigger(this, "resized", {
			length : c * b,
			itemsPerRow : b
		});
		if (this.sizeRuleStyle.visibility) {
			yield(function() {
				this.sizeRuleStyle.visibility = "visible";
				editCSSRule("." + this.sizeRuleClass, this.sizeRuleStyle);
				delete this.sizeRuleStyle.visibility
			}, this)
		}
	}, this)
};
function ResultSet(a) {
	this._stopClickEvent = a.stopClickEvent;
	this.className = a.className || "";
	this.fullRedraw = a.fullRedraw;
	this.cleaner = new Cleaner();
	this.setRenderer(a.renderer);
	this.setSource(a.source);
	this._contentSelectable = a.contentSelectable;
	if (a.autoSize) {
		var b = a.autoSize === true ? {} : a.autoSize;
		b.sizeRuleClass = b.sizeRuleClass || "_" + getUID(this);
		this.autoSizer = new AutoSizer(b);
		Event.addListener(this.autoSizer, "resized", this.onResize, this)
	}
	this.mouseWheelPagination = a.mouseWheelPagination;
	this.bufferedRedraw = a.bufferedRedraw;
	this.extraHeader = a.extraHeader;
	this._redrawSerial = 0
}
ResultSet.prototype.setSource = function(a) {
	if (a != this._source) {
		if (this._source) {
			Event.removeListener(this._source, "change", this.onDataChange, this);
			Event.removeListener(this._source, "dirty", this.onDataDirty, this)
		}
		this._source = a;
		this.cleaner.push(Event.addListener(this._source, "change", this.onDataChange, this));
		this.cleaner.push(Event.addListener(this._source, "dirty", this.onDataDirty, this))
	}
};
ResultSet.prototype.contains = function(a) {
	return this._source.contains(a)
};
ResultSet.prototype.getSource = function() {
	return this._source
};
ResultSet.prototype.setEmptyMessage = function(a) {
	setNode(this._empty, null, null, a)
};
ResultSet.prototype.destruct = function() {
	this.cleaner.clean();
	Event.release(this);
	Event.release(this.autoSizer);
	delayedClearNode(this._node, true);
	domRemoveNode(this._node)
};
ResultSet.prototype.init = function(b) {
	var c = (this._node = createNode("div", {
		className : "resultset " + this.className,
		trackcontext : "resultset",
		trackelement : "resultset"
	}));
	b.appendChild(c);
	if (this.extraHeader) {
		c.appendChild(this.extraHeader)
	}
	this._empty = c.appendChild(createNode("div", {
		className : "emptymsg"
	}));
	this._content = c.appendChild(this.createBodyNode());
	makeUnselectable(this._empty);
	if (!this._source || (!this._source.size() && !this._source.isDirty())) {
		addClass(this._node, "empty")
	}
	if (this.mouseWheelPagination) {
		var a = Event.wrapper(function(d) {
			var g = Event.getWheelDelta(d);
			if (g) {
				var f = this.getSource();
				if (g > 0 && !f.atLastPage()) {
					f.next();
					return Event.stop(d)
				} else {
					if (g < 0 && !f.atFirstPage()) {
						f.prev();
						return Event.stop(d)
					}
				}
			}
		}, this);
		Event.addListener(this._node, "mousewheel", Event.rateLimit(a, 300))
	}
	this.createFooterNode()
};
ResultSet.prototype.getNode = function() {
	return this._node
};
ResultSet.prototype.resize = function(a) {
	if (Browser.isIE) {
		yield(function() {
			this._resize(a)
		}, this)
	} else {
		this._resize(a)
	}
};
ResultSet.prototype._resize = function(b) {
	if (b) {
		this._size = b
	} else {
		b = this._size
	}
	if (!b) {
		return
	}
	var a = b.height - Rect.fromNode(this._footer).height() + Rect.fromNode(this._node).top() - Rect.fromNode(this._content).top();
	if (a < 1) {
		a = 1
	}
	var c = {
		height : px(a)
	};
	setNode(this._content, null, c);
	setNode(this._empty, null, c);
	this._autoResizeWidth()
};
ResultSet.prototype._autoResizeWidth = function() {
	var a = this.getBodyNode();
	if (!a || !this.autoSizer) {
		return
	}
	this.autoSizer.sizeContents(a)
};
ResultSet.prototype.rect = function() {
	return Rect.fromNode(this._content)
};
ResultSet.prototype.onClick = function(a) {
	if (this._stopClickEvent) {
		Event.stop(a)
	}
	return this.onEvent(a, "click", "hidetooltip")
};
ResultSet.prototype.onDragStart = function(a) {
	return this.onEvent(a, "dragstart")
};
ResultSet.prototype.onEvent = function(b, a, d) {
	var c = Event.getSource(b);
	while (c && (c != this._content)) {
		if (c._data) {
			return Event.trigger(this, a, b, c, c._data)
		}
		c = c.parentNode
	}
	if (d) {
		return Event.trigger(this, d, b)
	}
};
ResultSet.prototype.setRenderer = function(a) {
	if (!a) {
		var b = window._Debug && window._Debug.logStackTrace();
		throw "result set renderer can not be null"
	}
	if (a != this._renderer) {
		this._renderer = a;
		this.redraw()
	}
};
ResultSet.prototype.getRenderer = function() {
	return this._renderer
};
ResultSet.prototype.onStateChange = function() {
};
ResultSet.prototype.redrawEmptyState = function() {
	if (this._source.size()) {
		removeClass(this._node, "empty")
	} else {
		addClass(this._node, "empty")
	}
};
ResultSet.prototype.onDataChange = function(f) {
	if (f && !this._redrawing && !this.fullRedraw) {
		var c = this.getBodyNode();
		if (!c) {
			return
		}
		var d;
		this.redrawEmptyState();
		switch(f.op) {
			case"add":
				this._redrawing = true;
				d = this.getRenderer()(f.value);
				addClass(d, "_" + getUID(this));
				d._data = f.value;
				Event.trigger(this, "additem", d);
				c.insertBefore(d, c.childNodes[f.pos] || null);
				this._redrawing = false;
				return;
			case"del":
				this._redrawing = true;
				domRemoveNode(c.childNodes[f.pos]);
				this._redrawing = false;
				return;
			case"move":
				if (f.from < f.to) {
					f.to += 1
				}
				var b = c.childNodes[f.from];
				if (b) {
					this._redrawing = true;
					c.insertBefore(b, c.childNodes[f.to] || null);
					this._redrawing = false;
					return
				}
				break;
			case"replace":
				this._redrawing = true;
				d = this.getRenderer()(f.value);
				addClass(d, "_" + getUID(this));
				d._data = f.value;
				var a = c.childNodes[f.pos] || null;
				c.insertBefore(d, a);
				if (a) {
					domRemoveNode(a)
				}
				this._redrawing = false;
				return
		}
	}
	this.redraw()
};
ResultSet.prototype.onDataDirty = function() {
	this.reload()
};
ResultSet.prototype.remove = function(a) {
	if (this._source.contains(a)) {
		this._source.remove(a)
	}
};
ResultSet.prototype.unshift = function(a) {
	if (!this._source.contains(a)) {
		this._source.unshift(a)
	}
};
ResultSet.prototype.reload = function() {
	this._source.reload()
};
ResultSet.prototype.clear = function() {
	this._source.clear()
};
ResultSet.prototype.getHeaderNode = function() {
	if (!this._hd) {
		this._hd = this._node.insertBefore(createNode("div", {
			className : "hd"
		}), this._node.childNodes[0]);
		this._hd = this._hd.appendChild(createNode("div", {
			className : "pad"
		}))
	}
	return this._hd
};
ResultSet.prototype.createFooterNode = function() {
	if (!this._footer) {
		this._footer = this._node.appendChild(createNode("div", {
			className : "result_footer"
		}))
	}
	return this._footer
};
ResultSet.prototype.createBodyNode = function() {
	var a = this.createContentNode();
	addClass(a, "bd");
	return a
};
ResultSet.prototype.createContentNode = function() {
	var a = createNode("div");
	if (!this._contentSelectable) {
		makeUnselectable(a)
	}
	Event.addListener(a, "click", this.onClick, this);
	Event.addListener(a, "dragstart", this.onDragStart, this);
	return a
};
ResultSet.prototype.removeContentNode = function(a) {
	Event.removeListener(a, "click", this.onClick, this);
	Event.removeListener(a, "dragstart", this.onDragStart, this);
	domRemoveNode(a, false)
};
ResultSet.prototype.getBodyNode = function() {
	return this._content
};
ResultSet.prototype.redraw = function() {
	var b = this.getBodyNode();
	if (!b) {
		return
	}
	if (this._redrawing) {
		this._needsAnotherRedraw = true;
		return
	}
	this._redrawSerial++;
	var a = this._redrawSerial;
	this._redrawing = true;
	this._needsAnotherRedraw = false;
	var f = this.getRenderer();
	var d = null;
	var c;
	if (this.bufferedRedraw) {
		c = this.createBodyNode()
	} else {
		c = b;
		clearNode(c)
	}
	this._source.forEachNonBlocking(100, function(g) {
		if (this._needsAnotherRedraw) {
			if (this.bufferedRedraw) {
				this.removeContentNode(c)
			}
			return true
		}
		var h = f(g);
		addClass(h, "_" + getUID(this));
		h._data = g;
		Event.trigger(this, "additem", h);
		c.appendChild(h)
	}, function() {
		if (this._needsAnotherRedraw) {
			this._redrawing = false;
			this._needsAnotherRedraw = false;
			if (this.bufferedRedraw) {
				this.removeContentNode(c)
			}
			this.redraw();
			return
		}
		if (this.bufferedRedraw) {
			window.setTimeout(Event.wrapper(function() {
				if (this._redrawSerial != a) {
					this.removeContentNode(c);
					return
				}
				this.removeContentNode(b);
				var g = this.getNode();
				if (this._footer && this._footer.parentNode == g) {
					g.insertBefore(c, this._footer)
				} else {
					g.appendChild(c)
				}
				this._content = c;
				if (this._source.size()) {
					removeClass(this._node, "empty")
				} else {
					addClass(this._node, "empty")
				}
				this._resize()
			}, this), 20)
		} else {
			if (this._source.size()) {
				removeClass(this._node, "empty")
			} else {
				addClass(this._node, "empty")
			}
			this._autoResizeWidth()
		}
		this._redrawing = false
	}, this)
};
ResultSet.prototype.redrawIfDirty = function() {
	if (this._source.isDirty()) {
		this.reload();
		return true
	} else {
		return false
	}
};
ResultSet.prototype.hide = function() {
	if (this._node) {
		hide(this._node)
	}
};
ResultSet.prototype.show = function() {
	if (this._node) {
		show(this._node)
	}
};
ResultSet.prototype.addPaginationPaddles = function(c) {
	if (!c) {
		c = this.getHeaderNode()
	}
	var a = FilterUI.factory("pagination", null, {
		source : this._source
	});
	var b = a.attach(c);
	addClass(b, "ralign");
	this.cleaner.push(Event.addListener(this._source, "loading", a.disable, a));
	this.cleaner.push(Event.addListener(this._source, "loaded", a.enable, a));
	return a
};
ResultSet.prototype.addFooterPagination = function() {
	var b = this._footer;
	if (b.children.length === 0) {
		var a = FilterUI.factory("footerpagination", null, {
			source : this._source
		});
		a.attach(b);
		this.cleaner.push(Event.addListener(a, "paginationVisibilityUpdated", function() {
			Event.trigger(this, "paginationVisibilityUpdated")
		}, this));
		this.cleaner.push(Event.addListener(this._source, "loading", a.disable, a));
		this.cleaner.push(Event.addListener(this._source, "loaded", a.enable, a))
	}
};
ResultSet.prototype.onResize = function(a) {
	if (a.length && this._source && this._source.setParam) {
		yield(Event.wrapper(function() {
			this._source.setParam("length", a.length)
		}, this))
	}
};
function SponsoredResultSet(a) {
	SponsoredResultSet.superclass.constructor.call(this, a);
	this.setSubSource(a.subSource);
	this._redrawSubSerial = 0
}extend(SponsoredResultSet, ResultSet);
SponsoredResultSet.prototype.connectSources = function() {
	if (this._subSource) {
		var a = this._source.getParams();
		this.cleaner.push(Event.addListener(a, "change", this.onSourceParamsChange, this))
	}
};
SponsoredResultSet.prototype.disconnectSources = function() {
	if (this._subSource) {
		var a = this._source.getParams();
		Event.removeListener(a, "change", this.onSourceParamsChange, this)
	}
};
SponsoredResultSet.prototype.onSourceParamsChange = function(a) {
	if (!a || !this._subSource) {
		return
	}
	var b = {};
	forEachKey(a, function(c, d) {
		if (c != "length") {
			b[c] = d.value
		}
	});
	this._subSource.setParams(b)
};
SponsoredResultSet.prototype.setSource = function(a) {
	if (a != this._source) {
		if (this._source) {
			this.disconnectSources()
		}
		SponsoredResultSet.superclass.setSource.call(this, a);
		this.connectSources()
	}
};
SponsoredResultSet.prototype.setSubSource = function(a) {
	if (a && a != this._subSource) {
		if (this._subSource) {
			Event.removeListener(this._subSource, "change", this.onSubDataChange, this);
			Event.removeListener(this._subSource, "dirty", this.onSubDataDirty, this);
			this.disconnectSources()
		}
		this._subSource = a;
		this.connectSources();
		this.cleaner.push(Event.addListener(this._subSource, "change", this.onSubDataChange, this));
		this.cleaner.push(Event.addListener(this._subSource, "dirty", this.onSubDataDirty, this))
	}
};
SponsoredResultSet.prototype.init = function(a) {
	SponsoredResultSet.superclass.init.call(this, a);
	var f = this.getNode();
	var d = this.getBodyNode();
	addClass(f, "sponsored_resultset");
	var c = (this._sub = f.insertBefore(createNode("div", {
		className : "sub invisible"
	}), d));
	c.appendChild(createNode("div", {
		className : "header"
	}, null, loc("Promoted")));
	var b = (this._subContent = c.appendChild(this.createSubBodyNode()));
	this._separator = c.appendChild(createNode("div", {
		className : "separator"
	}));
	if (this._subSource) {
		yield(function() {
			var g = this.autoSizer.getItemsPerRow(b);
			this._subSource.setParam("length", g)
		}, this);
		this.disableRedraw()
	}
	if (!this._contentSelectable) {
		makeUnselectable(this._sub)
	}
};
SponsoredResultSet.prototype.redrawEmptyState = function() {
	SponsoredResultSet.superclass.redrawEmptyState.call(this);
	if (this._subSource && this._subSource.size()) {
		removeClass(this._sub, "hidden")
	} else {
		addClass(this._sub, "hidden")
	}
};
SponsoredResultSet.prototype.onSubDataChange = function(a) {
	this.redrawSub()
};
SponsoredResultSet.prototype.onSubDataDirty = function() {
	this.reloadSub()
};
SponsoredResultSet.prototype.reloadSub = function() {
	if (this._subSource) {
		this._subSource.reload()
	}
};
SponsoredResultSet.prototype.clear = function() {
	SponsoredResultSet.superclass.clear.call(this);
	if (this._subSource) {
		this._subSource.clear()
	}
};
SponsoredResultSet.prototype.getSubBodyNode = function() {
	return this._subContent
};
SponsoredResultSet.prototype.createSubBodyNode = function() {
	var a = this.createContentNode();
	addClass(a, "sub_content clearfix");
	return a
};
SponsoredResultSet.prototype.redrawSub = function() {
	var a = this.getSubBodyNode();
	if (!this._subSource || !a) {
		return
	}
	if (this._redrawingSub) {
		this._needsAnotherRedrawSub = true;
		return
	}
	this._redrawSubSerial++;
	var d = this._redrawSubSerial;
	this._redrawingSub = true;
	this._needsAnotherRedrawSub = false;
	var c = this.getRenderer();
	var b;
	if (this.bufferedRedraw) {
		b = this.createSubBodyNode()
	} else {
		b = a;
		clearNode(b)
	}
	this._subSource.forEachNonBlocking(100, function(f) {
		if (this._needsAnotherRedrawSub) {
			if (this.bufferedRedraw) {
				this.removeContentNode(b)
			}
			return true
		}
		var g = c(f);
		g.setAttribute("promoted", "1");
		g.setAttribute("oid", Track.classAndId("thing", f.thing_id));
		g.setAttribute("trackcontext", "promoted");
		addClass(g, "_" + getUID(this));
		g._data = f;
		Event.trigger(this, "additem", g);
		b.appendChild(g)
	}, function() {
		if (this._needsAnotherRedrawSub) {
			this._redrawingSub = false;
			this._needsAnotherRedrawSub = false;
			if (this.bufferedRedraw) {
				this.removeContentNode(b)
			}
			this.redrawSub();
			return
		}
		if (this._subSource.size()) {
			removeClass(this._sub, "hidden")
		} else {
			addClass(this._sub, "hidden")
		}
		yield(function() {
			var f = this._sub;
			if (this.bufferedRedraw) {
				if (d != this._redrawSubSerial) {
					this.removeContentNode(b);
					return
				}
				this.removeContentNode(a);
				f.insertBefore(b, this._separator);
				this._subContent = b
			}
			removeClass(f, "invisible");
			this._resize();
			this.enableRedraw()
		}, this);
		this._redrawingSub = false
	}, this)
};
SponsoredResultSet.prototype.onResize = function(a) {
	SponsoredResultSet.superclass.onResize.call(this, a);
	if (a.length && this._subSource && this._subSource.setParam) {
		this._subSource.setParam("length", a.itemsPerRow)
	}
};
SponsoredResultSet.prototype.reload = function() {
	SponsoredResultSet.superclass.reload.call(this);
	if (this._subSource) {
		this._subSource.reload()
	}
};
SponsoredResultSet.prototype.disableRedraw = function() {
	this._redrawing = true
};
SponsoredResultSet.prototype.enableRedraw = function() {
	this._redrawing = false;
	if (this._needsAnotherRedraw) {
		this.redraw()
	}
};
function Toolbar() {
	this._table = createNode("table", {
		className : "toolbar_row",
		cellPadding : "0",
		cellSpacing : "0"
	});
	this._springs = [];
	this._tr = this._table.appendChild(createNode("tbody")).appendChild(createNode("tr"))
}
Toolbar.prototype.getNode = function() {
	return this._table
};
Toolbar.prototype.add = function(b) {
	var a = createNode("td", {
		className : "cell_right"
	}, null, b);
	this._tr.appendChild(a);
	if (this._last_td) {
		removeClass(this._last_td, "cell_right");
		addClass(this._last_td, "cell")
	}
	this._last_td = a;
	return a
};
Toolbar.prototype.insert = function(b) {
	var a = createNode("td", null, null, b);
	if (this._last_td) {
		addClass(a, "cell");
		this._tr.insertBefore(a, this._tr.childNodes[0])
	} else {
		this._last_td = a;
		addClass(a, "cell_right");
		this._tr.appendChild(a)
	}
	return a
};
Toolbar.prototype.addSpring = function() {
	var b = this.add();
	removeClass(b, "cell_right");
	this._last_td = null;
	this._springs.push(b);
	var a = (100 / this._springs.length) - 1;
	this._springs.forEach(function(c) {
		setNode(c, null, {
			width : a + "%"
		})
	});
	return b
};
Toolbar.prototype.size = function() {
	return this._tr.childNodes.length
};
function TabBox(a, b) {
	b = b || {};
	this.node = d;
	this.tabs = new Set();
	this.selected = null;
	this.autoAdjustTabDim = b.autoAdjustTabDim;
	this.tabSelectionStrategy = b.tabSelectionStrategy || "leftmost";
	this._lastUnclosableTab = null;
	var c = ["tabpanel", b.className || "", this.autoAdjustTabDim ? (this.tabpanelClassName = Dom.uniqueId()) : ""].join(" ");
	var d = createNode("div", {
		className : c
	});
	a.appendChild(d);
	this.tabsNode = d.appendChild(createNode("div", {
		className : "tabs " + (b.tabsClassName || "default"),
		trackcontext : "tabs"
	}));
	if (b.allowNewTab) {
		this.newTab = createNode("span", {
			id : "newtab",
			className : "tab",
			trackelement : "new_tab",
			href : "#foo",
			title : loc("Open a new tab")
		}, null, "+");
		this.tabsNode.appendChild(this.newTab);
		Event.addListener(this.newTab, "click", function(f) {
			Event.trigger(this, "newtab");
			Event.stop(f)
		}, this);
		makeUnselectable(this.newTab)
	}
	this.brClear = this.tabsNode.appendChild(createNode("br", {
		className : "clear"
	}));
	this.content = d.appendChild(createNode("div", {
		className : "panels" + (b.bordered ? " bordered" : ""),
		trackcontext : "tabs"
	}));
	Event.addListener(window, "resize", this.adjustTabDim, this)
}
TabBox.prototype.unshiftTab = function(a) {
	this.addTab(a, this.tabsNode.childNodes[0])
};
TabBox.prototype.addTab = function(a, b) {
	a._tabBox = this;
	if (this.autoAdjustTabDim) {
		addClass(a.getTabNode(), "auto")
	}
	this.addHeaderNode(a.getTabNode(), b);
	Event.addListener(a, "select", function() {
		this.onSelect(a)
	}, this);
	if (a.closable()) {
		Event.addListener(a, "close", function() {
			this.removeTab(a)
		}, this)
	}
	makeUnselectable(a.getTabNode());
	this.content.appendChild(a.getPanelNode());
	this.tabs.put(a);
	if (a.initiallySelected()) {
		this.select(a)
	}
	this.adjustTabDim();
	this.autoSize()
};
TabBox.prototype.addHeaderNode = function(b, a) {
	a = a || this.newTab || this.brClear;
	if (a) {
		this.tabsNode.insertBefore(b, a)
	} else {
		this.tabsNode.appendChild(b)
	}
};
TabBox.prototype.removeTab = function(c) {
	var d = c.getTabNode();
	removeClass(c.getTabNode(), "auto");
	var b = 0;
	for (; b < this.tabsNode.childNodes.length; ++b) {
		if (this.tabsNode.childNodes[b] == d) {
			this.tabsNode.removeChild(d);
			break
		}
	}
	this.content.removeChild(c.getPanelNode());
	this.tabs.remove(c);
	c.destruct();
	if (c == this.selected) {
		var a = this.tabs.values();
		if (a && a.length) {
			if (a.length <= b) {
				b = a.length - 1
			}
			if (this.tabSelectionStrategy == "leftmost,lastunclosable" && !a[b].closable()) {
				this.select(this._lastUnclosableTab)
			} else {
				this.select(a[b])
			}
		}
	}
	this.adjustTabDim();
	delete c._tabBox;
	this.autoSize()
};
TabBox.prototype.adjustTabDim = function() {
	if (this.autoAdjustTabDim) {
		var a = 100000;
		this.tabs.forEach(function(b) {
			var c = b.getTabNode();
			a = Math.min(a, Dim.fromNode(c).h)
		});
		editCSSRule("." + this.tabpanelClassName + ".tabpanel > .tabs > .tab.auto", {
			height : px(a - 9)
		})
	}
};
TabBox.prototype.select = function(a) {
	Event.trigger(a, "select", a)
};
TabBox.prototype.onSelect = function(a) {
	if (!a) {
		return
	}
	if (a.closable !== null && !a.closable()) {
		this._lastUnclosableTab = a
	}
	if (this.selected) {
		if (a == this.selected) {
			return
		} else {
			this.selected.hide()
		}
	}
	a.show();
	Event.trigger(this, "select", a);
	this.selected = a
};
TabBox.prototype.add = function(a) {
	a.forEach(function(b) {
		if (b) {
			this.addTab(b)
		}
	}, this)
};
TabBox.prototype.clear = function() {
	clearNode(node);
	this.tabs.clear()
};
TabBox.prototype.autoSize = function() {
	if (this.selected) {
		this.selected.autoSize()
	}
};
function Tab(a) {
	this._showFullTitle = a.showFullTitle;
	this._initiallySelected = a.selected;
	this._titleBar = createNode("center");
	this._panels = [];
	this._selected = false;
	this._initialized = false;
	var d = (this._tabNode = createNode("span", {
		className : "tab",
		trackelement : a.trackelement,
		href : "#foo"
	}, null, this._titleBar));
	Event.addListener(this._tabNode, "click", function(f) {
		if (!this._selected) {
			this.select();
			return Event.stop(f)
		} else {
			if (Event.getSource(f).tagName != "A") {
				return Event.stop(f)
			}
		}
	}, this);
	Event.addListener(this, "select", this.onSelect, this);
	var b = (this._closable = a.closable);
	if (b) {
		var c = d.appendChild(createNode("span", {
			className : "clickable close"
		}, null, "&times;"));
		Event.addListener(c, "click", this.onClose, this)
	}
	this._panelNode = createNode("div", {
		className : "panel panel_size_" + a.size
	}, {
		display : "none"
	});
	this.cleaner = new Cleaner();
	this._defaultTitle = a.title;
	this._setTitle(this._defaultTitle)
}
Tab.prototype.onSelect = function() {
	this._selected = true;
	if (!this._initialized) {
		this.init();
		this._initialized = true
	}
};
Tab.prototype.select = function() {
	Event.trigger(this, "select", this)
};
Tab.prototype.init = function() {
};
Tab.prototype.reinit = function() {
	this._initialized = false;
	this.clearPanels();
	this.init()
};
Tab.prototype.initiallySelected = function() {
	return this._initiallySelected
};
Tab.prototype.getTabNode = function() {
	return this._tabNode
};
Tab.prototype.getPanelNode = function() {
	return this._panelNode
};
Tab.prototype.clearPanel = function() {
	clearNode(this._panelNode, true)
};
Tab.prototype.closable = function() {
	return this._closable
};
Tab.prototype.onClose = function() {
	Event.trigger(this, "close")
};
Tab.prototype.destruct = function() {
	this._panels.forEach(function(a) {
		a.destruct()
	});
	this._panels = [];
	delayedClearNode(this._tabNode, true);
	delayedClearNode(this._panelNode, true);
	domRemoveNode(this._tabNode);
	domRemoveNode(this._panelNode);
	Event.release(this);
	this.cleaner.clean()
};
Tab.prototype._setTitle = function(a) {
	a = a || this._defaultTitle || "";
	if ( typeof (a) == "string") {
		setNode(this._titleBar, {
			title : a
		}, null, escapeHTML(this._showFullTitle ? a : teaser(a, 14)))
	} else {
		setNode(this._titleBar, {
			title : ""
		}, null, a)
	}
	this.autoSize()
};
Tab.prototype.show = function() {
	setNode(this._panelNode, {}, {
		display : "block"
	});
	addClass(this._tabNode, "selected");
	if (!this._showing) {
		this._showing = true;
		Event.trigger(this, "show");
		var a = this._panels.length;
		if (a > 0) {
			Event.trigger(this._panels[a - 1], "show")
		}
	}
};
Tab.prototype.hide = function() {
	this._selected = false;
	this._showing = false;
	setNode(this._panelNode, {}, {
		display : "none"
	});
	removeClass(this._tabNode, "selected");
	Event.trigger(this, "hide")
};
Tab.prototype.pushPanel = function(a) {
	var b = this._panels.length;
	if (b > 0) {
		this._panels[b - 1].hide()
	}
	this._panels.push(a);
	this._panelNode.appendChild(a.getNode());
	a.show();
	this.cleaner.push(Event.addListener(a, "titlechange", this._syncTitleWithPanelTitle, this));
	this._syncTitleWithPanelTitle()
};
Tab.prototype._syncTitleWithPanelTitle = function() {
	var a = this.currentPanel();
	if (a) {
		this._setTitle(a.getTitle())
	}
};
Tab.prototype.clearPanels = function() {
	while (this._panels.length) {
		var a = this._panels.pop();
		a.hide();
		this._panelNode.removeChild(a.getNode());
		a.destruct()
	}
};
Tab.prototype.popPanel = function() {
	if (this._panels.length === 0) {
		return
	}
	var a = this._panels.pop();
	a.hide();
	this._panelNode.removeChild(a.getNode());
	Event.removeListener(a, "titlechange", this._syncTitleWithPanelTitle, this);
	if (!a.preserve) {
		a.destruct()
	}
	var b = this.currentPanel();
	if (b) {
		b.show()
	}
	this._syncTitleWithPanelTitle()
};
Tab.prototype.setPanelSize = function(a) {
	this._panels.forEach(function(b) {
		b.resize(a)
	})
};
Tab.prototype.panelCount = function() {
	return this._panels.length
};
Tab.prototype.currentPanel = function() {
	if (this._panels.length > 0) {
		return this._panels[this._panels.length - 1]
	}
};
Tab.prototype.autoSize = noop;
function TabPanel(a) {
	this._tab = a;
	this._node = createNode("div");
	this.cleaner = new Cleaner();
	this._title = ""
}
TabPanel.prototype.setTitle = function(a) {
	this._title = a;
	Event.trigger(this, "titlechange")
};
TabPanel.prototype.getTitle = function() {
	return this._title
};
TabPanel.prototype.getNode = function() {
	return this._node
};
TabPanel.prototype.show = function() {
	setNode(this._node, null, {
		display : "block"
	});
	if (!this._showing) {
		this._showing = true;
		Event.trigger(this, "show")
	}
};
TabPanel.prototype.hide = function() {
	setNode(this._node, null, {
		display : "none"
	});
	this._showing = false
};
TabPanel.prototype.showing = function() {
	return this._showing
};
TabPanel.prototype.setPreserve = function(a) {
	this.preserve = a
};
TabPanel.prototype.destruct = function() {
	Event.release(this);
	delayedClearNode(this._node, true);
	domRemoveNode(this._node, false);
	this.cleaner.clean()
};
TabPanel.prototype.resize = function(b) {
	var a = {};
	if (b.height) {
		a.height = px(b.height)
	}
	if (b.width) {
		a.width = px(b.width)
	}
	setNode(this._node, null, a)
};
function ResultTabPanel(a) {
	ResultTabPanel.superclass.constructor.call(this, a)
}extend(ResultTabPanel, TabPanel);
ResultTabPanel.prototype.destruct = function() {
	if (this._results) {
		var a = this._results.getSource();
		if (a) {
			a.destruct()
		}
		this._results.destruct();
		delete this._results
	}
	ResultTabPanel.superclass.destruct.call(this)
};
ResultTabPanel.prototype.resize = function(a) {
	if (this._results) {
		this._results.resize(a)
	}
};
ResultTabPanel.prototype.setResult = function(a) {
	this._results = a;
	this.cleaner.push(Event.addListener(this._results, "paginationVisibilityUpdated", this._tab.autoSize, this._tab));
	Event.addCustomBubble(a, this);
	this.cleaner.push(function() {
		a.destruct()
	})
};
ResultTabPanel.prototype.setEmptyMessage = function(a) {
	if (this._results) {
		this._results.setEmptyMessage(a)
	}
};
ResultTabPanel.prototype.getResultSet = function() {
	return this._results
};
function MyItemsTabPanel(a, o) {
	o = o || {};
	MyItemsTabPanel.superclass.constructor.call(this, a);
	var f = new Props({
		page : 1,
		length : 50,
		editorflags : 1
	});
	var d = new AjaxDataSource("mystuff.things", f, {
		converter : function(p) {
			p.getHashKey = function() {
				return p.thing_id
			};
			return p
		},
		cacheResults : 600
	});
	Event.addSingleUseListener(d, "loaded", function() {
		if (d.items.length > 0) {
			this.setEmptyMessage(loc("No items found"))
		} else {
			var p = createNode("strong", null, null, loc("All Items"));
			this.setEmptyMessage(loc("You have no saved items yet <br><small>Use items from the {all_items} tab</small>", {
				all_items : p
			}))
		}
	}, this);
	var b = new ResultSet({
		renderer : UI.itemGridRenderAutoSize,
		source : d,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : o.autoSize
	});
	b.init(this._node);
	this.setResult(b);
	Event.addListener(Event.BACKEND, "add_thing", d.onDirty, d);
	Event.addListener(Event.BACKEND, "delete_thing", d.onDirty, d);
	Event.addListener(Event.BACKEND, "delete_things", d.onDirty, d);
	var g = new Toolbar();
	b.getHeaderNode().appendChild(g.getNode());
	if (o.showFilters) {
		var m = {
			textWidth : 140,
			listHeight : 400
		};
		var n = new MyTagsPicker(m);
		Event.addListener(n, "change", function(p) {
			f.update({
				tag : p,
				page : 1
			})
		});
		g.add(n.getNode());
		addClass(n.getNode(), "left");
		Ajax.get({
			action : "mystuff.tags",
			onSuccess : function(p) {
				if (p.tags) {
					n.setItems(p.tags.map(function(q) {
						return q.tag
					}).sort())
				}
			}
		});
		var c = new SelectFilter(d, "color", null, null, {
			defaultLabel : UI.filter2label.color
		});
		var k = FilterUI.factory("colorpicker", c, {
			caption : UI.filter2label.color,
			clearSelection : loc("clear")
		});
		k.attach(g.add());
		var j = Event.addListener(c, "change", function() {
			f.update({
				color : c.value,
				page : 1
			})
		});
		this.cleaner.push(function() {
			k.destruct()
		});
		this.cleaner.push(j);
		var l = new BaseFilter(d, "query");
		var h = new SearchBox(l, {
			showClear : true,
			inputHint : loc("Title Search")
		});
		h.attach(g.add());
		this.cleaner.push(Event.wrapper(h.destruct, h))
	}
	g.addSpring();
	b.addPaginationPaddles(g.add());
	if (o.show && o.show.footerPagination) {
		b.addFooterPagination()
	}
	Event.addListener(b, "dragstart", function(q, p, r) {
		r.type = r.type || Item.TYPES.IMAGE;
		q.xDataTransfer.setData("item", r);
		q.xDataTransfer.proxy = UI.itemRender(r, "s");
		Event.stop(q)
	});
	b.redrawIfDirty()
}extend(MyItemsTabPanel, ResultTabPanel);
function SignInTabPanel(b) {
	SignInTabPanel.superclass.constructor.call(this, b);
	var d = createNode("span", {
		className : "clickable"
	}, null, loc("sign in"));
	var a = createNode("span", {
		className : "clickable"
	}, null, loc("register"));
	var c = createNode("span", null, null, [document.createTextNode(loc("Please") + " "), d, document.createTextNode(" " + loc("or") + " "), a, document.createTextNode(" " + loc("for a free Polyvore account.")), createNode("br"), createNode("br"), createNode("small", null, null, createNode("a", {
		href : buildURL("help"),
		target : "_blank"
	}, null, loc("What is Polyvore?")))]);
	Event.addListener(d, "click", function() {
		SignInBox.signIn({
			src : "tab_panel"
		})
	});
	Event.addListener(a, "click", function() {
		SignInBox.register({
			src : "tab_panel"
		})
	});
	this._node.appendChild(createNode("div", {
		className : "signin"
	}, null, c))
}extend(SignInTabPanel, TabPanel);
function MySetsTabPanel(c, l) {
	l = l || {};
	MySetsTabPanel.superclass.constructor.call(this, c);
	var b = new AjaxDataSource("mystuff.sets", {
		length : 50,
		page : 1
	}, {
		converter : function(m) {
			m.getHashKey = function() {
				return m.spec_uuid
			};
			return m
		},
		cacheResults : 600
	});
	var h = new ResultSet({
		renderer : UI.setGridRenderAutoSize,
		source : b,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : l.autoSize
	});
	this.cleaner.push(function() {
		h.destruct()
	});
	h.init(this._node);
	this.setResult(h);
	var j = new Toolbar();
	h.getHeaderNode().appendChild(j.getNode());
	var k = [];
	var f;
	var d = function() {
		if (!f || f.getValue() == this) {
			b.onDirty()
		} else {
			this.dirty = true
		}
	};
	var g = {
		action : "mystuff.sets",
		label : loc("Published"),
		emptyMsg : loc("You have not published any sets yet")
	};
	this.cleaner.push(Event.addListener(Event.BACKEND, "saveset", d, g));
	this.cleaner.push(Event.addListener(Event.BACKEND, "deleteset", d, g));
	k.push(g);
	if (l.showDrafts) {
		g = {
			action : "mystuff.drafts",
			label : loc("Drafts"),
			emptyMsg : loc("You have not created any drafts yet")
		};
		this.cleaner.push(Event.addListener(Event.BACKEND, "savedraft", d, g));
		this.cleaner.push(Event.addListener(Event.BACKEND, "saveset", d, g));
		this.cleaner.push(Event.addListener(Event.BACKEND, "deletedraft", d, g));
		k.push(g)
	}
	if (l.showFavorites) {
		g = {
			action : "mystuff.favesets",
			params : {
				uid : Auth.userId()
			},
			label : loc("Likes"),
			emptyMsg : loc("You have not liked any sets yet")
		};
		this.cleaner.push(Event.addListener(Event.BACKEND, "add_set", d, g));
		k.push(g)
	}
	this.setEmptyMessage(k[0].emptyMsg || "");
	if (k.length > 1) {
		f = new HorizontalSelectHTML({
			options : k,
			renderer : function(n, m) {
				return n.label
			}
		});
		f.selectFirst();
		var a;
		Event.addListener(f, "change", function() {
			var m = f.getValue();
			if (!m || m == a) {
				return
			}
			a = m;
			Event.addSingleUseListener(b, "loaded", function() {
				this.setEmptyMessage(m.emptyMsg || "")
			}, this);
			b.setAction(m.action, m.params, {
				dirty : m.dirty
			});
			delete m.dirty
		}, this);
		j.add(f.getNode());
		j.addSpring()
	}
	h.addPaginationPaddles(j.add());
	if (l.show && l.show.footerPagination) {
		h.addFooterPagination()
	}
	Event.addListener(h, "dragstart", function(o, n, p) {
		var m = p.type == "d" ? "draft" : "set";
		o.xDataTransfer.setData(m, p);
		o.xDataTransfer.proxy = UI.setRender(p, "s");
		Event.stop(o)
	});
	this._results.redrawIfDirty()
}extend(MySetsTabPanel, ResultTabPanel);
function FilteredTabPanel(a) {
	FilteredTabPanel.superclass.constructor.call(this, a);
	addClass(this._node, "filtered_tabpanel")
}extend(FilteredTabPanel, ResultTabPanel);
FilteredTabPanel.prototype.destruct = function() {
	if (this.filterUIManager) {
		this.filterUIManager.destruct();
		delete this.filterUIManager
	}
	FilteredTabPanel.superclass.destruct.call(this)
};
FilteredTabPanel.prototype.createFilters = function(h, C) {
	var k = (this.filterUIManager = new FilterUIManager());
	var B = new Toolbar();
	var t = this._results;
	var z = t.getSource();
	var D = this.cleaner;
	C = C || {};
	h.show = h.show || {};
	t.getHeaderNode().appendChild(B.getNode());
	if (h.show.tag) {
		var n = {
			textWidth : 140,
			listHeight : 400
		};
		var y = new MyTagsPicker(n);
		Event.addListener(y, "change", function(G) {
			z.updateParams({
				tag : G,
				page : 1
			})
		});
		B.add(y.getNode());
		addClass(y.getNode(), "left");
		Event.addListener(z, "loading", function() {
			y.disable()
		});
		Event.addListener(z, "load", function(G) {
			y.enable();
			if (G && ( G = G.result) && ( G = G.filters) && ( G = G.tag) && ( G = G.items)) {
				y.setItems(G.map(function(H) {
					return H.value
				}).sort())
			}
		})
	}
	if (h.show.hselect) {
		var s = h.show.hselect;
		if (s.length > 1) {
			this.setEmptyMessage(s[0].emptyMsg || "");
			selector = new HorizontalSelectHTML({
				options : s,
				renderer : function(H, G) {
					return H.label
				}
			});
			selector.selectFirst();
			var w;
			Event.addListener(selector, "change", function() {
				var G = selector.getValue();
				if (!G || G == w) {
					return
				}
				w = G;
				Event.addSingleUseListener(z, "loaded", function() {
					this.setEmptyMessage(G.emptyMsg || "")
				}, this);
				z.setAction(G.action, G.params, {
					dirty : G.dirty
				});
				delete G.dirty
			}, this);
			B.add(selector.getNode())
		}
	}
	var r;
	if (h.show.query) {
		r = new BaseFilter(z, "query", null, C.query || null);
		var o = new BaseFilter(z, "dummy");
		var g = new SearchBox(o, {
			inputHint : loc("Search")
		});
		D.push(Event.wrapper(g.destruct, g));
		var d = B.add();
		addClass(d, "searchbox_cell");
		g.attach(d);
		g.submitNode.value = "";
		addClass(g.submitNode, "btn");
		var p = g.input;
		if (p) {
			Event.addListener(g.node, "submit", function() {
				yield(function() {
					if (!o.value) {
						return
					}
					r.set(o.value);
					p.value = "";
					p.focus()
				})
			});
			if (h.focusOnShow || h.focusOnShow === undefined) {
				var v = function() {
					yield(function() {
						if (Dim.fromNode(p).w && this.showing()) {
							p.focus()
						}
					}, this)
				};
				Event.addListener(this, "show", v, this);
				Event.addListener(this._tab, "show", v, this)
			}
		}
		if (p && h.show.autocomplete) {
			var q = DataSourceDataManager.getSearchTabData();
			Event.addSingleUseListener(q, "loaded", function() {
				var G = new GroupedObjectAutoComplete(p, q, {
					containerSizer : p.form,
					typeOrder : ["category_id", "brand", "displayurl"],
					maxResults : {
						category_id : 5,
						brand : 16,
						displayurl : 5
					},
					onSelect : function(J) {
						var H = G.inputTokenizer;
						H.caretToken("");
						o.set(H.reconstructValue());
						g.refresh();
						Event.bundleEvents(z.params, "change");
						var I;
						k.getFilterUIs().forEach(function(K) {
							if (K.filter && K.filter.name == J._data.filter_type) {
								I = K.filter
							}
						});
						if (!I) {
							return
						}
						if (I.selectByValue) {
							I.selectByValue(J._data.value)
						} else {
							I.set(J._data.value)
						}
						Event.unbundleEvents(z.params, "change");
						p.focus()
					}
				});
				D.push(Event.wrapper(G.destruct, G))
			});
			q.ensureLoaded()
		}
	}
	if (h.show.price) {
		var u = B.add();
		var E = this;
		var F = function(G) {
			var H = new SelectFilter(BaseFilter.createFakeDS("price_int", G, z), "price_int", null, C.price_int);
			var I = FilterUI.factory("pricepicker", H, {
				clearable : true,
				items : G,
				textWidth : "70px",
				listWidth : "75px",
				titleRenderer : function(J) {
					if (!J || !J.label) {
						return loc("Show me items in USD price range...")
					}
					return J.label
				},
				textBoxRenderer : function(K) {
					if (!K || !K.value) {
						return UI.filter2label.price_int
					}
					var L = "$";
					for (var J = G.find(K); J > 0; --J) {
						L += "$"
					}
					return L
				}
			});
			E.cleaner.push(Event.wrapper(I.destruct, I));
			E.cleaner.push(Event.addListener(z, "loaded", function() {
				if (z.size() || this.value()) {
					this.enable()
				} else {
					this.disable()
				}
			}, I));
			k.addFilterUI(I);
			I.attach(u)
		};
		CachedAjax.get({
			action : "autocomplete.price_ranges",
			data : {
				".cacheable" : 1,
				".locale" : Conf.getLocale()
			},
			onSuccess : Event.wrapper(function(H) {
				var G = H.result;
				F(G)
			}, this)
		})
	}
	if (h.show.color) {
		filter = new SelectFilter(z, "color", null, C.color, {
			defaultLabel : UI.filter2label.color
		});
		filterUI = FilterUI.factory("colorpicker", filter, {
			clearSelection : loc("clear"),
			caption : loc("Choose a color"),
			textBoxRenderer : DropDownItemHelper.renderColorTextBox
		});
		this.cleaner.push(Event.wrapper(filterUI.destruct, filterUI));
		k.addFilterUI(filterUI);
		filterUI.attach(B.add())
	}
	B.addSpring();
	var x = t.addPaginationPaddles(B.add());
	x.show();
	if (h.show && h.show.footerPagination) {
		t.addFooterPagination()
	}
	var A = new Toolbar();
	t.getHeaderNode().appendChild(A.getNode());
	if (h.show.homeButton) {
		var m = h.show.homeButton === 1 ? B : A;
		var l = new Button(createNode("span", {
			className : "all_items clickable"
		}, null, loc("All Items")));
		l.attach(m.insert());
		D.push(Event.addListener(l, "click", function(G) {
			Event.trigger(this, "home", G)
		}, this))
	}
	var c = [];
	var j = A.addSpring();
	addClass(j, "refinements_cell");
	if (r) {
		var b = FilterUI.factory("refinementcontrol", r, {
			showType : h.show.filterType
		});
		D.push(Event.wrapper(b.destruct, b));
		k.addFilterUI(b);
		b.attach(j);
		c.push(b)
	}
	["category_id", "brand", "displayurl"].forEach(function(G) {
		if (!h.show[G]) {
			return
		}
		if (G == "category_id") {
			CachedAjax.get({
				action : "autocomplete.category_id_titles",
				data : {
					".cacheable" : 1,
					".locale" : Conf.getLocale(),
					v : 3
				},
				onSuccess : function(J) {
					var I = J.result;
					filter = new BaseFilter(z, G, null, C[G]);
					var K = FilterUI.factory("refinementcontrol", filter, {
						showType : h.show.filterType
					});
					D.push(Event.wrapper(K.destruct, K));
					k.addFilterUI(K);
					K.setDisplayTexts(I);
					K.attach(j);
					c.push(K)
				}
			})
		} else {
			filter = new BaseFilter(z, G, null, C[G]);
			var H = FilterUI.factory("refinementcontrol", filter, {
				showType : h.show.filterType
			});
			D.push(Event.wrapper(H.destruct, H));
			k.addFilterUI(H);
			H.attach(j);
			c.push(H)
		}
	}, this);
	var a = createNode("span", {
		className : "clickable right"
	}, null, loc("Clear all"));
	hide(a);
	A.add(a);
	c.push(a);
	D.push(Event.addListener(a, "click", function() {
		k.getFilterUIs().forEach(function(G) {
			Event.bundleEvents(G.filter.source.params, "change")
		});
		k.getFilterUIs().forEach(function(G) {
			G.filter.clear();
			G.refresh()
		});
		k.getFilterUIs().forEach(function(G) {
			Event.unbundleEvents(G.filter.source.params, "change")
		})
	}, this));
	function f() {
		var G = 0;
		k.getFilterUIs().forEach(function(I) {
			if (!I.filter.isDefaultValue()) {
				G++
			}
		});
		if (G) {
			show(a)
		} else {
			hide(a)
		}
		var H = 0;
		c.forEach(function(I) {
			if (I.filter && !I.filter.isDefaultValue()) {
				H++
			} else {
				if (Dim.fromNode(I).h) {
					H++
				}
			}
		});
		if (H) {
			show(A.getNode())
		} else {
			hide(A.getNode())
		}
		this._tab.autoSize();
		return G
	}
	D.push(Event.addListener(k, "filterchange", function() {
		yield(function() {
			if (!f.call(this) && this._tab.panelCount() > 1) {
				this._tab.popPanel()
			}
		}, this)
	}, this));
	D.push(Event.addListener(k, "filterupdate", function() {
		yield(f, this)
	}, this));
	f.call(this);
	return k
};
function UserSearchTabPanel(f, c) {
	UserSearchTabPanel.superclass.constructor.call(this, f);
	var g = {
		length : 50,
		display : "grid"
	};
	var b = new AjaxDataSource("search.users", g, {
		converter : function(h) {
			h.getHashKey = function() {
				return h.id || h.user_id
			};
			return h
		},
		cacheResults : 600
	});
	var d = new ResultSet({
		renderer : UI.userGridRenderAutoPageSize,
		source : b,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : {
			resizeWidth : false,
			resizeHeight : false
		}
	});
	d.init(this._node);
	this.setResult(d);
	var a = this.createFilters({
		show : {
			query : true
		}
	}, g);
	this.cleaner.push(Event.addListener(d, "dragstart", function(j, h, k) {
		j.xDataTransfer.setData("item", k);
		j.xDataTransfer.proxy = UI.renderBuddyIcon(k, "s");
		Event.stop(j)
	}));
	this.cleaner.push(Event.wrapper(a.destruct, a));
	d.redrawIfDirty()
}extend(UserSearchTabPanel, FilteredTabPanel);
function ItemSearchTabPanel(c, o) {
	ItemSearchTabPanel.superclass.constructor.call(this, c);
	var j = o.presets;
	var d = {
		length : 50,
		v : 1
	};
	var h = {};
	var m = false;
	if (j) {
		j.forEach(function(p) {
			d[p.name] = p.value;
			if (p.fixed) {
				h[p.name] = true;
				m = true
			}
			if (p.name == "query" && !p.fixed) {
				this.setTitle(p.value)
			}
		}, this)
	}
	var a = o.action || "search.editor_things";
	var k = new AjaxDataSource(a, d, {
		converter : function(p) {
			p.getHashKey = function() {
				return p.thing_id
			};
			return p
		},
		cacheResults : 600,
		shuffle : {
			offset : Auth.userId() || Auth.visitorId()
		}
	});
	var g;
	if (o.showSponsored) {
		d.rand_seed = Auth.userId() || Auth.visitorId();
		var l = new AjaxDataSource("search.sponsored_things", d, {
			converter : function(p) {
				p.getHashKey = function() {
					return p.thing_id
				};
				return p
			},
			cacheResults : 600
		});
		var f = null;
		Event.addListener(l, "loaded", function() {
			f = f || Track.getContext(g.getNode()) + "|promoted";
			l.forEach(function(p) {
				p.promoted = true;
				p.oid = Track.classAndId("thing", p.thing_id);
				p.trackcontext = f
			})
		});
		g = new SponsoredResultSet({
			renderer : o.renderer || UI.itemGridRenderAutoSize,
			source : k,
			subSource : l,
			stopClickEvent : true,
			mouseWheelPagination : true,
			bufferedRedraw : true,
			autoSize : true
		})
	} else {
		g = new ResultSet({
			renderer : o.renderer || UI.itemGridRenderAutoSize,
			source : k,
			stopClickEvent : true,
			mouseWheelPagination : true,
			autoSize : true
		})
	}
	g.init(this._node);
	this.setResult(g);
	var b = {
		show : {
			homeButton : false,
			autocomplete : !m || o.show.autocomplete,
			footerPagination : o.show && o.show.footerPagination,
			filterType : true
		},
		focusOnShow : o.focusOnShow
	};
	["query", "color", "price", "brand", "category_id", "displayurl"].forEach(function(p) {
		b.show[p] = !h[p]
	});
	var n = this.createFilters(b, d);
	this.cleaner.push(Event.addListener(n, "filterchange", function() {
		var p = n.getLastSetFilter();
		var q = p ? p.getDisplayText() : "";
		yield(function() {
			this.setTitle(q)
		}, this)
	}, this));
	this.cleaner.push(Event.addListener(g, "dragstart", function(q, p, r) {
		r.type = r.type || Item.TYPES.IMAGE;
		q.xDataTransfer.setData("item", r);
		q.xDataTransfer.proxy = UI.itemRender(r, "s");
		Event.stop(q)
	}));
	this.cleaner.push(Event.wrapper(n.destruct, n));
	g.redrawIfDirty()
}extend(ItemSearchTabPanel, FilteredTabPanel);
function MyCollectionsTabPanel(c, l) {
	MyCollectionsTabPanel.superclass.constructor.call(this, c);
	l = l || {};
	addClass(this._node, "lb_tab");
	var b;
	if (l.type == "thing") {
		b = new AjaxDataSource("collection.list_editable", {
			length : 50,
			page : 1,
			type : "thing",
			filter : "published"
		})
	} else {
		b = new AjaxDataSource("collection.list_editable", {
			length : 50,
			page : 1,
			filter : "published"
		})
	}
	this.cleaner.push(Event.addListener(Event.BACKEND, "lookbooks_change", b.onDirty, b));
	var g = new ResultSet({
		renderer : function(n, m) {
			n.spec_uuid = n.cover_spec_uuid;
			n.thing_id = n.cover_spec_tid;
			return UI.setGridRenderLookbook(n, m)
		},
		source : b,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : {
			minImgSize : 124,
			resizeWidth : false,
			resizeHeight : false,
			itemSizeDelta : 0
		}
	});
	this.cleaner.push(function() {
		g.destruct()
	});
	g.init(this._node);
	this.setResult(g);
	var j = new Toolbar();
	g.getHeaderNode().appendChild(j.getNode());
	var k = [{
		action : "collection.list_editable",
		params : {
			filter : "published"
		},
		label : loc("Published"),
		emptyMsg : loc("You have not created any collections yet")
	}];
	if (l.showDrafts) {
		k.push({
			action : "collection.list_editable",
			params : {
				filter : "drafts"
			},
			label : loc("Drafts"),
			emptyMsg : loc("You have not saved any collection drafts yet")
		})
	}
	if (l.showFavorites) {
		choice = {
			action : "mystuff.favelookbooks",
			params : {
				uid : Auth.userId()
			},
			label : loc("Likes"),
			emptyMsg : loc("You have not liked any collections yet")
		};
		k.push(choice)
	}
	this.setEmptyMessage(k[0].emptyMsg || "");
	if (k.length > 1) {
		var d = new HorizontalSelectHTML({
			options : k,
			renderer : function(n, m) {
				return n.label
			}
		});
		d.selectFirst();
		Event.addListener(d, "change", function() {
			var m = d.getValue();
			if (!m) {
				return
			}
			this.setEmptyMessage(m.emptyMsg || "");
			b.setAction(m.action, m.params)
		}, this);
		j.add(d.getNode());
		j.addSpring()
	}
	g.addPaginationPaddles(j.add());
	if (l.show && l.show.footerPagination) {
		g.addFooterPagination()
	}
	if (bucketIs("show_admin_links", "yes")) {
		Event.addListener(g.getSource(), "loaderror", function(m) {
			Feedback.message(m.extractGeneralErrorMessages().join("<br>"))
		});
		var a = Dom.uniqueId();
		var f = createNode("input", {
			id : a,
			type : "text",
			className : "uid",
			placeholder : "username",
			value : Auth.user().name
		});
		Event.addListener(f, "keypress", function(m) {
			if (m.keyCode == 13) {
				Event.stop(m);
				return false
			} else {
				return true
			}
		});
		Event.addListener(f, "keyup", delayed(Event.wrapper(function() {
			g.getSource().setParams({
				".uid" : f.value
			})
		}, this), 1000));
		var h = new Toolbar();
		h.add(createNode("label", {
			"for" : a
		}, null, "Username: "));
		h.add(f);
		h.addSpring();
		g.getHeaderNode().appendChild(h.getNode())
	}
	if (!l.disableDrag) {
		Event.addListener(g, "dragstart", function(n, m, o) {
			n.xDataTransfer.setData("lookbook", o);
			n.xDataTransfer.proxy = o.spec_uuid ? UI.setRender(o, "s") : UI.itemRender(o, "s");
			Event.stop(n)
		})
	}
	g.redrawIfDirty()
}extend(MyCollectionsTabPanel, ResultTabPanel);
function TextTabPanel(f, c) {
	TextTabPanel.superclass.constructor.call(this, f);
	c = c || {};
	var b = new AjaxDataSource("font.list", {
		v : 5
	}, {
		cacheResults : 86400
	});
	var d = new ResultSet({
		renderer : function(j) {
			return UI.fontGridRender(j, "textAutosize")
		},
		source : b,
		autoSize : {
			minItemsPerRow : 1,
			minImgSize : 80,
			sizeRuleSelector : ".textAutosize",
			resizeHeight : false,
			sizePage : false
		},
		stopClickEvent : true
	});
	d.init(this._node);
	this.setResult(d);
	var g = new Toolbar();
	d.getHeaderNode().appendChild(g.getNode());
	var a = new SelectFilter(new MemDataSource(), "color", "#000000", "#000000", {
		options : ColorPicker.getColorList()
	});
	var h = FilterUI.factory("colorpicker", a, {
		caption : UI.filter2label.color
	});
	h.attach(g.add());
	Event.addListener(a, "change", function() {
		b.values().forEach(function(j) {
			j.color = a.value
		});
		d.redraw()
	}, this);
	this.cleaner.push(function() {
		h.destruct()
	});
	g.addSpring();
	Event.addListener(d, "dragstart", function(k, j, l) {
		l.type = l.type || Item.TYPES.TEXT;
		k.xDataTransfer.setData("item", l);
		k.xDataTransfer.proxy = UI.fontListRender(l, "textAutosize");
		Event.stop(k)
	});
	d.redrawIfDirty()
}extend(TextTabPanel, ResultTabPanel);
function AmazonMP3TabPanel(d, a) {
	AmazonMP3TabPanel.superclass.constructor.call(this, d);
	var g = new AjaxDataSource("amazon.mp3", {
		query : "",
		length : 30,
		ver : 4
	}, {
		dirty : false
	});
	var b = new ResultSet({
		renderer : UI.AmazonMP3ListRender,
		source : g,
		stopClickEvent : true
	});
	b.init(this._node);
	this.setResult(b);
	var f = new Toolbar();
	b.getHeaderNode().appendChild(f.getNode());
	var c = new BaseFilter(g, "query");
	var h = new SearchBox(c, {
		inputHint : loc("Artist / Song")
	});
	h.attach(setNode(f.add(), null, {
		width : "75%"
	}));
	yield(function() {
		h.input.focus()
	});
	f.addSpring();
	b.addPaginationPaddles(f.add());
	this.cleaner.push(Event.addListener(c, "change", function() {
		if (c.isDefaultValue()) {
			b.clear()
		}
	}));
	Event.addListener(b, "dragstart", function(k, j, l) {
		l.type = l.type || Item.TYPES.AMAZON_MP3;
		k.xDataTransfer.setData("item", l);
		k.xDataTransfer.proxy = UI.AmazonMP3Render(l, "t");
		Event.stop(k)
	});
	b.redrawIfDirty()
}extend(AmazonMP3TabPanel, ResultTabPanel);
function SetSearchTabPanel(f, c) {
	SetSearchTabPanel.superclass.constructor.call(this, f);
	var g = {
		length : 50
	};
	var b = new AjaxDataSource("search.sets", g, {
		converter : function(j) {
			j.getHashKey = function() {
				return j.spec_uuid
			};
			return j
		},
		cacheResults : 600
	});
	var d = new ResultSet({
		renderer : UI.setGridRenderAutoSize,
		source : b,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : true
	});
	d.init(this._node);
	this.setResult(d);
	var h = {
		show : {
			query : true,
			footerPagination : c.show && c.show.footerPagination
		}
	};
	var a = this.createFilters(h, g);
	this.cleaner.push(Event.addListener(d, "dragstart", function(k, j, l) {
		k.xDataTransfer.setData("item", l);
		k.xDataTransfer.proxy = UI.setRender(l, "s");
		Event.stop(k)
	}));
	this.cleaner.push(Event.wrapper(a.destruct, a));
	d.redrawIfDirty()
}extend(SetSearchTabPanel, FilteredTabPanel);
function CollectionTabPanel(d, b) {
	CollectionTabPanel.superclass.constructor.call(this, d);
	var g = {
		length : 50,
		page : 1,
		type : b.type ? b.type : "thing",
		id : b.id,
		uuid : b.uuid,
		createdby : b.createdby,
		nocache : b.nocache ? 1 : null
	};
	var f = new AjaxDataSource("collection.get", g, {
		converter : function(h) {
			h.getHashKey = function() {
				return h.thing_id || h.spec_uuid
			};
			return h
		},
		cacheResults : 600
	});
	var c = new ResultSet({
		renderer : b.renderer || UI.itemGridRenderAutoSize,
		source : f,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : true
	});
	c.init(this._node);
	this.setResult(c);
	var a = this.createFilters({
		show : {
			homeButton : !(b.hideHomeButton || false)
		}
	}, g);
	this.cleaner.push(Event.addListener(c, "dragstart", function(j, h, k) {
		k.type = k.type || Item.TYPES.IMAGE;
		j.xDataTransfer.setData("item", k);
		j.xDataTransfer.proxy = UI.itemRender(k, "s");
		Event.stop(j)
	}));
	this.cleaner.push(Event.wrapper(a.destruct, a));
	c.redrawIfDirty()
}extend(CollectionTabPanel, FilteredTabPanel);
function TemplateSearchTabPanel(c, o) {
	TemplateSearchTabPanel.superclass.constructor.call(this, c);
	var g = {
		".cacheable" : 1,
		length : 50
	};
	if (!o.app) {
		g.user_info = true
	}
	var b = new AjaxDataSource("search.templates", g, {
		converter : function(p) {
			p.getHashKey = function() {
				return p.spec_uuid
			};
			return p
		},
		cacheResults : 600
	});
	var n = o.size || "m";
	var k = UI.sizeMap[n].url;
	var j = new ResultSet({
		renderer : function(t) {
			delete t.title;
			var s = UI.setGridRenderAutoSize(t, n);
			var r = s.childNodes[0];
			if (!Browser.isIE) {
				var q = r.src;
				var p = new FlipBook({
					data : new MemDataSource(t.sets),
					renderer : function(v) {
						var u = buildImgURL("img-set", {
							cid : v.id,
							spec_uuid : v.spec_uuid,
							size : k,
							".out" : "jpg"
						});
						r.src = u;
						return r
					},
					defaultRenderer : function() {
						r.src = q;
						return r
					}
				});
				setNode(p.getNode(), null, {
					width : "100%",
					height : "100%"
				});
				r.parentNode.appendChild(p.getNode());
				r.parentNode.removeChild(r)
			}
			return s
		},
		source : b,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : {
			imgSize : n,
			minItemsPerRow : 4
		}
	});
	j.init(this._node);
	this.setResult(j);
	var l = new Toolbar();
	j.getHeaderNode().appendChild(l.getNode());
	var m = [];
	var f;
	var d = function() {
		if (!f || f.getValue() == this) {
			b.onDirty()
		} else {
			this.dirty = true
		}
	};
	m.push({
		action : "search.templates",
		params : g,
		label : loc("All")
	});
	if (Auth.isLoggedIn()) {
		var h = {
			action : "mystuff.templates",
			params : {
				".cacheable" : null
			},
			label : loc("My Templates"),
			emptyMsg : loc("You have not created any {templates} yet", {
				templates : createNode("a", {
					href : buildURL("app.template")
				}, null, loc("templates"))
			})
		};
		this.cleaner.push(Event.addListener(Event.BACKEND, "savedraft", d, h));
		this.cleaner.push(Event.addListener(Event.BACKEND, "saveset", d, h));
		this.cleaner.push(Event.addListener(Event.BACKEND, "deletedraft", d, h));
		m.push(h)
	}
	this.setEmptyMessage(m[0].emptyMsg || "");
	if (m.length > 1) {
		f = new HorizontalSelectHTML({
			options : m,
			renderer : function(q, p) {
				return q.label
			}
		});
		f.selectFirst();
		var a;
		Event.addListener(f, "change", function() {
			var p = f.getValue();
			if (!p || p == a) {
				return
			}
			a = p;
			Event.addSingleUseListener(b, "loaded", function() {
				this.setEmptyMessage(p.emptyMsg || "")
			}, this);
			b.setAction(p.action, p.params, {
				dirty : p.dirty
			});
			delete p.dirty
		}, this);
		this.cleaner.push(Event.wrapper(f.destruct, f));
		l.add(f.getNode());
		l.addSpring()
	}
	j.addPaginationPaddles(l.add());
	if (o.show && o.show.footerPagination) {
		j.addFooterPagination()
	}
	this.cleaner.push(Event.addListener(j, "dragstart", function(q, p, r) {
		if (o.app) {
			r.fill = true;
			q.xDataTransfer.setData("template", r)
		} else {
			r.template_id = r.template_id || r.id;
			delete r.id;
			q.xDataTransfer.setData("item", r)
		}
		q.xDataTransfer.proxy = UI.setRender(r, "s");
		Event.stop(q)
	}));
	j.redrawIfDirty()
}extend(TemplateSearchTabPanel, ResultTabPanel);
function ColorTabPanel(d, b) {
	ColorTabPanel.superclass.constructor.call(this, d);
	var f = b.ds || ColorTabPanel.getDataSource("colors.top");
	var c = new ResultSet({
		renderer : function(j) {
			j.type = Item.TYPES.COLORBLOCK;
			return UI.colorBlockAutoSizeRender(j, "s")
		},
		source : f,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : true
	});
	c.init(this._node);
	this.setResult(c);
	var h = {
		show : {
			homeButton : false,
			query : b.ds.action == "colors.search",
			footerPagination : b.show && b.show.footerPagination
		}
	};
	var g = b.ds.getParams() || {};
	if (g.toArray) {
		g = g.toArray()
	}
	var a = this.createFilters(h, g);
	this.cleaner.push(Event.addListener(a, "filterchange", function() {
		var j = a.getLastSetFilter();
		var k = j ? j.getDisplayText() : "";
		yield(function() {
			this.setTitle(k)
		}, this)
	}, this));
	this.cleaner.push(Event.wrapper(a.destruct, a));
	Event.addListener(c, "dragstart", function(k, j, l) {
		k.xDataTransfer.setData("item", l);
		k.xDataTransfer.proxy = UI.colorBlockRender(l, "s");
		Event.stop(k)
	});
	if (!c.redrawIfDirty()) {
		c.redraw()
	}
}extend(ColorTabPanel, FilteredTabPanel);
ColorTabPanel.prototype.destruct = function() {
	if (this._results) {
		var a = this._results.getSource();
		if (a) {
			ColorTabPanel.deleteDataSource(a)
		}
		this._results.destruct();
		delete this._results
	}
	ResultTabPanel.superclass.destruct.call(this)
};
ColorTabPanel.deleteDataSource = function(a) {
	if (ColorTabPanel.itemDS && a == ColorTabPanel.itemDS.ds) {
		ColorTabPanel.itemDS.count--;
		if (ColorTabPanel.itemDS.count <= 0) {
			ColorTabPanel.itemDS.ds.destruct();
			ColorTabPanel.itemDS.cleaner.clean();
			ColorTabPanel.itemDS = null
		}
	} else {
		a.destruct()
	}
};
ColorTabPanel.getDataSource = function(b, a) {
	var f = cloneObject(b.params || {});
	f.page = 1;
	f.length = f.length || 50;
	var c = function(h) {
		h.getHashKey = function() {
			return h.color
		};
		return h
	};
	var g = {
		converter : c,
		cacheResults : b.cache,
		hideProgress : true
	};
	if (b.action == "colors.items") {
		if (ColorTabPanel.itemDS) {
			ColorTabPanel.itemDS.count++;
			return ColorTabPanel.itemDS.ds
		}
		f.items = ColorTabPanel.stripItems(a.freeze().items || []);
		g.method = "POST"
	}
	var d = new AjaxDataSource(b.action, f, g);
	if (b.action == "colors.items") {
		ColorTabPanel.itemDS = {
			cleaner : new Cleaner(),
			ds : d,
			count : 1
		};
		ColorTabPanel.itemDS.cleaner.push(Event.addListener(a, "additem", function() {
			var h = a.freeze().items;
			h = ColorTabPanel.stripItems(h);
			d.setParam("items", h)
		}));
		ColorTabPanel.itemDS.cleaner.push(Event.addListener(a, "removeitem", function() {
			var h = a.freeze().items;
			h = ColorTabPanel.stripItems(h);
			d.setParam("items", h)
		}))
	}
	return d
};
ColorTabPanel.stripItems = function(a) {
	var b = a.map(function(c) {
		if (c.type && c.type == Item.TYPES.PLACEHOLDER) {
			c = c.content || {}
		}
		var d = {
			thing_id : c.thing_id,
			type : c.type,
			color : c.color
		};
		if (c.type && c.type == Item.TYPES.COLORBLOCK) {
			d.clid = c.clid;
			d.title = c.title
		}
		return d
	});
	return b
};
function ColorCategoryTabPanel(c, b) {
	ColorCategoryTabPanel.superclass.constructor.call(this, c);
	this.canvas = b;
	var d = this.getNode();
	var a = d.appendChild(createNode("div", {
		className : "resultset colorpanel"
	}));
	this.bd = a.appendChild(createNode("div", {
		className : "bd"
	}));
	Ajax.get({
		action : "colors.categories",
		onSuccess : Event.wrapper(function(f) {
			this._createPickers(f.result);
			this.createSearch()
		}, this)
	});
	setNode(d, null, {
		overflow : "auto"
	})
}extend(ColorCategoryTabPanel, TabPanel);
ColorCategoryTabPanel.prototype.resize = function(b) {
	ColorCategoryTabPanel.superclass.resize.call(this, b);
	var a = b.height + Rect.fromNode(this._node).top() - Rect.fromNode(this.bd).top() - 16;
	if (a < 1) {
		a = 1
	}
	var c = {
		height : px(a)
	};
	setNode(this.bd, null, c)
};
ColorCategoryTabPanel.prototype.destruct = function() {
	if (ColorTabPanel.itemDS && ColorTabPanel.itemDS.ds) {
		ColorTabPanel.deleteDataSource(ColorTabPanel.itemDS.ds)
	}
	ColorCategoryTabPanel.superclass.destruct.call(this)
};
ColorCategoryTabPanel.prototype._createColorsRow = function(b) {
	var c = 10;
	var a = [];
	b.forEach(function(d) {
		if (!d.color) {
			return
		}
		if (--c === 0) {
			return true
		}
		var f = UI.colorBlockRender(d, "t");
		a.push(f);
		d.type = Item.TYPES.COLORBLOCK;
		Event.addListener(f, "click", function(g) {
			Event.trigger(this, "click", g, f, d);
			Event.stop(g)
		}, this);
		Event.addListener(f, "dragstart", function(g) {
			g.xDataTransfer.setData("item", d);
			g.xDataTransfer.proxy = UI.colorBlockRender(d, "s");
			Event.stop(g)
		})
	}, this);
	return a
};
ColorCategoryTabPanel.prototype._createPickers = function(b) {
	var a = createNode("div");
	b.forEach(function(d) {
		var f = createNode("div", {
			className : "section clearfix"
		});
		f.appendChild(createNode("h4", null, null, d.label));
		var h = f.appendChild(createNode("span", {
			className : "clickable"
		}, null, loc("View more") + " &raquo;"));
		Event.addListener(h, "click", function() {
			var j;
			if (d.colors) {
				j = ColorTabPanel.getDataSource(d.ds)
			} else {
				j = ColorTabPanel.getDataSource(d.ds, this.canvas)
			}
			j.setParam("query", d.title || d.label);
			Event.trigger(this, "action", {
				type : "color",
				title : d.title || d.label,
				ds : j
			})
		}, this);
		var c = f.appendChild(createNode("div", {
			className : "samples"
		}));
		if (d.colors) {
			setNode(c, null, null, this._createColorsRow(d.colors))
		} else {
			if (!this.canvas.itemCount()) {
				hide(f)
			}
			var g = ColorTabPanel.getDataSource(d.ds, this.canvas);
			Event.addListener(g, "loaded", function() {
				c.innerHTML = "";
				var j = g.values();
				if (j.length) {
					setNode(c, null, null, this._createColorsRow(j));
					show(f)
				} else {
					hide(f)
				}
			}, this);
			g.ensureLoaded()
		}
		this.bd.appendChild(f)
	}, this)
};
ColorCategoryTabPanel.prototype.createSearch = function() {
	var c = this.bd.appendChild(createNode("div", {
		className : "section clearfix"
	}));
	c.appendChild(createNode("h4", null, null, loc("Search")));
	var b = c.appendChild(createNode("form", {
		className : "query_form"
	}));
	var a = b.appendChild(createNode("table", {
		cellPadding : 0,
		cellSpacing : 0
	})).appendChild(createNode("tbody")).appendChild(createNode("tr"));
	var d = a.appendChild(createNode("td", {
		className : "query_cell"
	})).appendChild(createNode("input", {
		type : "text",
		name : "query",
		className : "query"
	}));
	a.appendChild(createNode("td")).appendChild(createNode("input", {
		className : "btn",
		type : "submit",
		value : loc("Search")
	}));
	Event.addListener(b, "submit", function(f) {
		if (d.value) {
			Event.trigger(this, "action", {
				type : "color",
				title : d.value || loc("Color search"),
				ds : ColorTabPanel.getDataSource({
					action : "colors.search",
					params : {
						query : d.value
					},
					cache : 600
				})
			})
		}
		Event.stop(f)
	}, this)
};
function EffectTabPanel(a, k) {
	EffectTabPanel.superclass.constructor.call(this, a);
	k = k || {};
	var d = k.presets;
	var b = {
		length : 50,
		sort : "title_sub",
		v : 3
	};
	if (d) {
		d.forEach(function(l) {
			b[l.name] = l.value;
			if (l.name == "category_id") {
				CachedAjax.get({
					action : "autocomplete.category_id_titles",
					data : {
						".cacheable" : 1,
						".locale" : Conf.getLocale()
					},
					onSuccess : Event.wrapper(function(o) {
						var m = o.result;
						var n = m.find(l.value, function(q, p) {
							return (q == p.value)
						});
						if (n >= 0) {
							this.setTitle(m[n].title)
						}
					}, this)
				})
			}
		}, this)
	}
	var h = new AjaxDataSource("search.editor_things", b, {
		converter : function(l) {
			l.getHashKey = function() {
				return l.thing_id
			};
			return l
		},
		cacheResults : 86400
	});
	var f = new SelectFilter(new MemDataSource(), "color", "#000000", "#000000", {
		options : ColorPicker.getColorList()
	});
	var c = new ResultSet({
		renderer : function(l) {
			l.color = f.value;
			return UI.itemGridRenderAutoSize(l)
		},
		source : h,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : true
	});
	c.init(this._node);
	this.setResult(c);
	var g = new Toolbar();
	c.getHeaderNode().appendChild(g.getNode());
	var j = FilterUI.factory("colorpicker", f, {
		caption : UI.filter2label.color
	});
	j.attach(g.add());
	Event.addListener(f, "change", function() {
		c.redraw()
	}, this);
	this.cleaner.push(function() {
		j.destruct()
	});
	g.addSpring();
	c.addPaginationPaddles(g.add());
	if (k.show && k.show.footerPagination) {
		c.addFooterPagination()
	}
	Event.addListener(c, "dragstart", function(m, l, n) {
		n.type = n.type || Item.TYPES.IMAGE;
		n.colorize = f.value;
		m.xDataTransfer.setData("item", n);
		m.xDataTransfer.proxy = UI.itemRender(n, "s");
		Event.stop(m)
	});
	c.redrawIfDirty()
}extend(EffectTabPanel, ResultTabPanel);
var ToolTipPosition = function() {
	var k = "lt";
	var b = "lc";
	var a = "lb";
	var d = "rt";
	var h = "rc";
	var g = "rb";
	var m = "bl";
	var j = "bc";
	var n = "br";
	var c = "tl";
	var l = "tc";
	var f = "tr";
	return {
		ANCHOR : {
			LEFT_TOP : k,
			LEFT_CENTER : b,
			LEFT_BOTTOM : a,
			RIGHT_TOP : d,
			RIGHT_CENTER : h,
			RIGHT_BOTTOM : g,
			BOTTOM_LEFT : m,
			BOTTOM_CENTER : j,
			BOTTOM_RIGHT : n,
			TOP_LEFT : c,
			TOP_CENTER : l,
			TOP_RIGHT : f
		},
		ANCHOR_ORDER : {
			LEFT_FIRST : [k, a, m, n, g, d, f, c],
			RIGHT_FIRST : [d, g, n, m, a, k, c, f],
			BOTTOM_LEFT : [m, n]
		},
		POS : {
			CENTER : function(p, u, D) {
				var z = p.w;
				var v = p.h;
				if (!D) {
					D = {}
				}
				var B = nodeXY(u);
				var A = Dim.fromNode(u);
				var x = B.y + A.h / 2;
				var r = B.x - z + A.w / 2;
				var C = getWindowSize();
				var t = C.w;
				var o = C.h;
				var y = scrollXY();
				var s = y.x;
				var q = y.y;
				if (r < s) {
					r += z;
					if (r + z > t + s) {
						r = (t - z) / 2 + s
					}
				}
				if (x + v > q + o) {
					x -= v;
					if (x < q) {
						x = (o - v) / 2 + q
					}
				}
				return {
					top : x,
					left : r
				}
			},
			EDGE : function(O, A, u) {
				var B = u.stemDim;
				var t = u.anchorOrder;
				if (!u) {
					u = {}
				}
				var C = O.w;
				var N = O.h;
				var M = nodeXY(A);
				var R = Dim.fromNode(A);
				var y = getWindowSize();
				var S = y.w;
				var z = y.h;
				var q = scrollXY();
				var H = q.x;
				var s = q.y;
				var r = new Point(M.x + R.w, M.y);
				var v = new Point(M.x, M.y);
				var Q = new Point(M.x + R.w, M.y + R.h);
				var p = new Point(M.x, M.y + R.h);
				var L = 2;
				var x = 4;
				var P = [3, 2, 3, 4];
				if (Browser.isIE) {
					P = [2, 2, 2, 2]
				}
				if (!B) {
					B = [new Dim(0, 0), new Dim(0, 0), new Dim(0, 0), new Dim(0, 0)];
					P = [0, 0, 0, 0]
				}
				if (!t || !t.length) {
					t = ToolTipPosition.ANCHOR_ORDER.LEFT_FIRST
				}
				function F(w) {
					switch(w) {
						case k:
							return {
								point : new Point(v.x - O.w, v.y),
								padding : new Point(Math.min(-x, -B[3].w + P[3]), 0),
								stemXY : new Point(v.x - B[3].w, v.y + (Math.min(R.h, N) / 2) - B[3].h / 2),
								anchor : k
							};
						case b:
							return {
								point : new Point(v.x - O.w, p.y - (R.h / 2) - (O.h / 2)),
								padding : new Point(Math.min(-x, -B[3].w + P[3]), 0),
								stemXY : new Point(v.x - B[3].w, v.y + (R.h / 2) - (B[3].h / 2)),
								anchor : b
							};
						case a:
							return {
								point : new Point(p.x - O.w, p.y - O.h),
								padding : new Point(Math.min(-x, -B[3].w + P[3]), -L),
								stemXY : new Point(v.x - B[3].w, p.y - (Math.min(R.h, N) / 2) - B[3].h / 2),
								anchor : a
							};
						case d:
							return {
								point : r,
								padding : new Point(Math.max(L, B[1].w - P[1]), 0),
								stemXY : new Point(r.x, r.y + Math.min(N, R.h) / 2 - B[1].h / 2),
								anchor : d
							};
						case h:
							return {
								point : new Point(r.x, p.y - (R.h / 2) - (O.h / 2)),
								padding : new Point(Math.max(L, B[1].w - P[1]), 0),
								stemXY : new Point(r.x, v.y + (R.h / 2) - (B[1].h / 2)),
								anchor : h
							};
						case g:
							return {
								point : new Point(Q.x, Q.y - O.h),
								padding : new Point(Math.max(L, B[1].w - P[1]), -L),
								stemXY : new Point(Q.x, Q.y - (Math.min(N, R.h) / 2) - B[1].h / 2),
								anchor : g
							};
						case m:
							return {
								point : p,
								padding : new Point(0, Math.max(L, B[2].h - P[2])),
								stemXY : new Point(p.x + Math.min(C, R.w) / 2 - B[2].w / 2, p.y),
								anchor : m
							};
						case j:
							return {
								point : new Point(Q.x - (R.w / 2) - (O.w / 2), Q.y),
								padding : new Point(0, Math.max(L, B[2].h - P[2])),
								stemXY : new Point(p.x + (R.w / 2) - (B[2].w / 2), p.y),
								anchor : j
							};
						case n:
							return {
								point : new Point(Q.x - O.w, Q.y),
								padding : new Point(-L, Math.max(L, B[2].h - P[2])),
								stemXY : new Point(Q.x - (Math.min(C, R.w) / 2) - B[2].w / 2, Q.y),
								anchor : n
							};
						case c:
							return {
								point : new Point(v.x, v.y - O.h),
								padding : new Point(0, Math.min(-x, -B[0].h + P[0])),
								stemXY : new Point(v.x + (Math.min(C, R.w) / 2) - B[0].w / 2, v.y - B[0].h),
								anchor : c
							};
						case l:
							return {
								point : new Point(r.x - (R.w / 2) - (O.w / 2), r.y - O.h),
								padding : new Point(-L, Math.min(-x, -B[0].h + P[0])),
								stemXY : new Point(p.x + (R.w / 2) - (B[0].w / 2), r.y - B[0].h),
								anchor : l
							};
						case f:
							return {
								point : new Point(r.x - O.w, r.y - O.h),
								padding : new Point(-L, Math.min(-x, -B[0].h + P[0])),
								stemXY : new Point(r.x - (Math.min(C, R.w) / 2) - B[0].w / 2, r.y - B[0].h),
								anchor : f
							}
					}
				}

				var K = [];
				t.forEach(function(w) {
					K.push(F(w))
				});
				var o = new Point(H, s);
				var J = new Point(H + S, s + z);
				for (var I = 0; I < K.length; I++) {
					var G = K[I].point;
					var E = K[I].padding;
					if (G.x + E.x >= o.x && G.y + E.y >= o.y && G.x + E.x + O.w <= J.x && G.y + E.y + O.h <= J.y) {
						return {
							top : G.y + E.y,
							left : G.x + E.x,
							anchor : K[I].anchor,
							stemXY : K[I].stemXY
						}
					}
				}
				var D = F(n);
				return {
					top : D.point.y + D.padding.y,
					left : D.point.x + D.padding.x,
					anchor : D.anchor,
					stemXY : D.stemXY
				}
			}
		}
	}
}();
function ToolTipInstance() {
	this.node = null;
	this.stemNode = null;
	this._engaged = false;
	this.timer = new Timer();
	this.autoOptions = {};
	this.anchorNode = null;
	this.autoAnchorNode = null
}
ToolTipInstance.prototype._createAutoHider = function(a) {
	var b = Event.wrapper(function() {
		this.timer.replace(Event.wrapper(function() {
			if (this.autoAnchorNode || this.engaged()) {
				b()
			} else {
				this.hide()
			}
		}, this), a)
	}, this);
	return b
};
ToolTipInstance.prototype._init = function() {
	if (this.node) {
		return
	}
	this.node = createNode("div", {
		className : "tooltip polyvore_tooltip"
	}, {
		display : "none"
	});
	if (!Browser.isIE) {
		addClass(this.node, "drop_shadowed")
	}
	this.stemNode = createNode("div", {
		className : "tooltip_stem polyvore_tooltip_stem"
	}, {
		display : "none"
	});
	document.body.appendChild(this.node);
	document.body.appendChild(this.stemNode);
	Event.addListener(this.node, "mouseover", Event.wrapper(function() {
		this._engaged = true;
		Event.trigger(this, "engaged")
	}, this));
	Event.addListener(this.node, "mouseout", Event.wrapper(function() {
		this._engaged = false;
		Event.trigger(this, "disengaged");
		if (this.anchorNode) {
			var a = this.autoOptions[getHashKey(this.anchorNode)];
			if (a) {
				this._createAutoHider(a.disengage)()
			}
		}
	}, this))
};
ToolTipInstance.prototype._onDocMouseUp = function(a) {
	var b = Event.getSource(a);
	if (b.tagName != "HTML" && !domContainsChild(this.node, b)) {
		this.hide(a)
	}
};
ToolTipInstance.prototype.renderImageAndDetails = function(a, d, j) {
	if (j) {
		return createNode("div", {
			className : "tall"
		}, null, [d, a])
	} else {
		var g = createNode("table", {
			className : "wide",
			cellSpacing : 0,
			cellPadding : 0
		});
		var b = g.appendChild(createNode("tbody"));
		var h = b.appendChild(createNode("tr", {
			vAlign : "top"
		}));
		var f = h.appendChild(createNode("td"));
		f.appendChild(a);
		var c = h.appendChild(createNode("td"));
		c.appendChild(d);
		return g
	}
};
ToolTipInstance.prototype.showing = function() {
	return this.node && this.node.style.display != "none"
};
ToolTipInstance.prototype.engaged = function() {
	return this.showing() && this._engaged
};
ToolTipInstance.prototype.show = function(h, k, p) {
	this._init();
	this.timer.reset();
	var f = null;
	p = p || {};
	if (p.closeButton) {
		f = createNode("div", {
			className : "close"
		}, null, "&times;");
		Event.addListener(f, "click", this.hide, this);
		k = createNode("div", {
			className : "container"
		}, null, k)
	}
	setNode(this.node, null, {
		display : "block",
		visibility : "hidden",
		top : "0px",
		left : "0px"
	}, k);
	var d = ["tooltip"];
	var a = Track.getContext(h);
	if (a) {
		d.unshift(a)
	}
	Track.setContext(this.node, d.join("|"));
	if (f) {
		this.node.appendChild(f)
	}
	setNode(this.node, {
		className : "tooltip polyvore_tooltip"
	}, {
		width : null
	});
	setNode(this.stemNode, {
		className : "tooltip_stem polyvore_tooltip_stem"
	});
	if (!Browser.isIE) {
		addClass(this.node, "drop_shadowed")
	}
	if (p.className) {
		addClass(this.node, p.className);
		addClass(this.stemNode, p.className)
	}
	if (p.width) {
		setNode(this.node, null, {
			width : p.width
		})
	}
	var c = Dim.fromNode(this.node);
	if (p.dim_w) {
		c.w = p.dim_w
	}
	if (p.dim_h) {
		c.h = p.dim_h
	}
	var j = p.pos || ToolTipPosition.POS.CENTER;
	var o = j(c, h, p);
	var m = Math.max(p.top || o.top, 0);
	var g = Math.max(p.left || o.left, 0);
	var n = overlayZIndex(this.node);
	if (p.stemDim && o.stemXY && o.anchor) {
		addClass(this.stemNode, "tooltip_stem_" + o.anchor);
		setNode(this.stemNode, null, {
			left : px(o.stemXY.x),
			top : px(o.stemXY.y),
			display : "block",
			visibility : "visible",
			zIndex : n + 1
		})
	}
	var b = {
		visibility : "visible",
		zIndex : n,
		left : px(g),
		top : px(m)
	};
	if (p.userClose && p.closeButton) {
		var l = Rect.fromNode(h);
		this.monitor = new Monitor(function() {
			if (h.offsetWidth === 0 || h.offsetHeight === 0) {
				return true
			}
			var q = Rect.fromNode(h);
			if (!l.equals(q)) {
				return true
			}
			return false
		}, this);
		Event.addListener(this.monitor, "change", this.hide, this)
	} else {
		Event.addListener(document, "mouseup", Event.wrapper(this._onDocMouseUp, this))
	}
	this.anchorNode = h;
	setNode(this.node, null, b);
	Event.trigger(this, "show", this.anchorNode, k);
	return this
};
ToolTipInstance.prototype.autoShow = function(c, h, b) {
	var a = getHashKey(c);
	var g = this.autoOptions[a];
	if (!g) {
		g = this.autoOptions[a] = {}
	}
	var f = b.click === undefined ? 0 : b.click;
	var d = b.mousepause === undefined ? 300 : b.mousepause;
	var j = b.mouseout;
	if (g.disengage === undefined) {
		g.disengage = j === undefined ? 300 : j
	}
	if (j === undefined) {
		j = g.disengage
	}
	if (b.showOnClick) {
		Event.addListener(c, "click", Event.wrapper(function(k) {
			this.timer.reset();
			this.show(c, h(), b);
			Event.stop(k)
		}, this))
	}
	Event.addListener(c, "mousepause" + d, Event.wrapper(function() {
		this.timer.reset();
		if (this.anchorNode == c) {
			return
		}
		this.show(c, h(), b);
		Event.addSingleUseListener(c, "mouseout", this._createAutoHider(j))
	}, this));
	Event.addListener(c, "mouseover", Event.wrapper(function(k) {
		this.autoAnchorNode = c
	}, this));
	Event.addListener(c, "mouseout", Event.wrapper(function(k) {
		this.autoAnchorNode = null
	}, this))
};
ToolTipInstance.prototype.hide = function(a) {
	this._init();
	this.timer.reset();
	if (a) {
		var b = Event.getSource(a);
		while (b) {
			if (b._data) {
				return
			}
			b = b.parentNode
		}
	}
	clearNode(this.node);
	this.anchorNode = null;
	Event.removeListener(document, "mouseup", this._onDocMouseUp);
	if (this.monitor) {
		this.monitor.stop();
		Event.removeListener(this.monitor, "change", this.hide)
	}
	hide(this.node);
	hide(this.stemNode);
	Event.trigger(this, "hide", a)
};
var ToolTip = new ToolTipInstance();
makeStatic(ToolTip);
var MessageToolTipInstance = function() {
	MessageToolTipInstance.superclass.constructor.call(this)
};
extend(MessageToolTipInstance, ToolTipInstance);
MessageToolTipInstance.prototype.show = function(d, g, c) {
	var a;
	if (Browser.isIE) {
		a = [new Dim(21, 13), new Dim(13, 21), new Dim(21, 13), new Dim(13, 21)]
	} else {
		a = [new Dim(36, 20), new Dim(13, 21), new Dim(21, 13), new Dim(21, 34)]
	}
	if (!c) {
		c = {}
	}
	c.stemDim = a;
	if (!c.pos) {
		c.pos = ToolTipPosition.POS.EDGE
	}
	if (c.anchorPos) {
		c.anchorOrder = [c.anchorPos]
	}
	var f = c.className || "";
	c.className = f + " msg_tooltip";
	var b = createNode("div", null, null, g);
	if (c.delay) {
		window.setTimeout(Event.wrapper(function() {
			MessageToolTipInstance.superclass.show.call(this, d, b, c)
		}, this), c.delay)
	} else {
		MessageToolTipInstance.superclass.show.call(this, d, b, c)
	}
};
var MessageToolTip = new MessageToolTipInstance();
makeStatic(MessageToolTip);
var SerialMessageToolTip = function() {
	return {
		show : function(a) {
			Event.addListener(document, "modifiable", function() {
				function c(d) {
					if (d >= a.length) {
						return
					}
					var g = a[d];
					var f = $(g.node);
					MessageToolTip.show(f, g.message, {
						anchorPos : g.anchorPos
					});
					if (g.type) {
						Feedback.markRead(g.type)
					}
				}

				var b = 0;
				c(b);
				Event.addListener(MessageToolTip, "hide", function() {
					b++;
					c(b)
				})
			})
		}
	}
}();
var SpriteToolTip = (function() {
	return {
		autoShow : function(b, c, a) {
			if (!a) {
				a = {}
			}
			if (a.className === undefined) {
				a.className = "sprite_tooltip"
			}
			if (a.width === undefined) {
				a.width = "250px"
			}
			if (a.pos === undefined) {
				a.pos = ToolTipPosition.POS.EDGE
			}
			if (a.closeButton === undefined) {
				a.closeButton = true
			}
			if (a.anchorOrder === undefined) {
				a.anchorOrder = [ToolTipPosition.ANCHOR.RIGHT_CENTER, ToolTipPosition.ANCHOR.BOTTOM_CENTER]
			}
			if (a.stemDim === undefined) {
				a.stemDim = (Browser.isIE) ? [new Dim(21, 13), new Dim(13, 21), new Dim(21, 13), new Dim(13, 21)] : [new Dim(36, 20), new Dim(13, 21), new Dim(21, 13), new Dim(21, 34)]
			}
			ToolTip.autoShow(b, c, a)
		}
	}
})();
if ( typeof (deconcept) == "undefined") {
	deconcept = {}
}
if ( typeof (deconcept.util) == "undefined") {
	deconcept.util = {}
}
if ( typeof (deconcept.SWFObjectUtil) == "undefined") {
	deconcept.SWFObjectUtil = {}
}
deconcept.SWFObject = function(g, d, o, j, l, n, p, k, a, f) {
	if (!document.getElementById) {
		return
	}
	this.DETECT_KEY = f ? f : "detectflash";
	this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
	this.params = {};
	this.variables = {};
	this.attributes = [];
	if (g) {
		this.setAttribute("swf", g)
	}
	if (d) {
		this.setAttribute("id", d)
	}
	if (o) {
		this.setAttribute("width", o)
	}
	if (j) {
		this.setAttribute("height", j)
	}
	if (l) {
		this.setAttribute("version", new deconcept.PlayerVersion(l.toString().split(".")))
	}
	this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
	if (!window.opera && document.all && this.installedVer.major > 7) {
		deconcept.SWFObject.doPrepUnload = true
	}
	if (n) {
		this.addParam("bgcolor", n)
	}
	var b = p ? p : "high";
	this.addParam("quality", b);
	this.setAttribute("useExpressInstall", false);
	this.setAttribute("doExpressInstall", false);
	var m = (k) ? k : window.location;
	this.setAttribute("xiRedirectUrl", m);
	this.setAttribute("redirectUrl", "");
	if (a) {
		this.setAttribute("redirectUrl", a)
	}
};
deconcept.SWFObject.prototype = {
	useExpressInstall : function(a) {
		this.xiSWFPath = !a ? "expressinstall.swf" : a;
		this.setAttribute("useExpressInstall", true)
	},
	setAttribute : function(a, b) {
		this.attributes[a] = b
	},
	getAttribute : function(a) {
		return this.attributes[a]
	},
	addParam : function(a, b) {
		this.params[a] = b
	},
	getParams : function() {
		return this.params
	},
	addVariable : function(a, b) {
		this.variables[a] = b
	},
	getVariable : function(a) {
		return this.variables[a]
	},
	getVariables : function() {
		return this.variables
	},
	getVariablePairs : function() {
		var a = [];
		var b;
		var c = this.getVariables();
		for (b in c) {
			if (c.hasOwnProperty(b)) {
				a[a.length] = b + "=" + c[b]
			}
		}
		return a
	},
	getSWFHTML : function() {
		var d = "";
		var a, c, b;
		if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "PlugIn");
				this.setAttribute("swf", this.xiSWFPath)
			}
			d = '<embed type="application/x-shockwave-flash" src="' + this.getAttribute("swf") + '" width="' + this.getAttribute("width") + '" height="' + this.getAttribute("height") + '" style="' + this.getAttribute("style") + '"';
			d += ' id="' + this.getAttribute("id") + '" name="' + this.getAttribute("id") + '" ';
			c = this.getParams();
			for (a in c) {
				if (c.hasOwnProperty(a)) {
					d += [a] + '="' + c[a] + '" '
				}
			}
			b = this.getVariablePairs().join("&");
			if (b.length > 0) {
				d += 'flashvars="' + b + '"'
			}
			d += "/>"
		} else {
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "ActiveX");
				this.setAttribute("swf", this.xiSWFPath)
			}
			d = '<object id="' + this.getAttribute("id") + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + this.getAttribute("width") + '" height="' + this.getAttribute("height") + '" style="' + this.getAttribute("style") + '">';
			d += '<param name="movie" value="' + this.getAttribute("swf") + '" />';
			c = this.getParams();
			for (a in c) {
				if (c.hasOwnProperty(a)) {
					d += '<param name="' + a + '" value="' + c[a] + '" />'
				}
			}
			b = this.getVariablePairs().join("&");
			if (b.length > 0) {
				d += '<param name="flashvars" value="' + b + '" />'
			}
			d += "</object>"
		}
		return d
	},
	write : function(a) {
		if (this.getAttribute("useExpressInstall")) {
			var b = new deconcept.PlayerVersion([6, 0, 65]);
			if (this.installedVer.versionIsValid(b) && !this.installedVer.versionIsValid(this.getAttribute("version"))) {
				this.setAttribute("doExpressInstall", true);
				this.addVariable("MMredirectURL", escape(this.getAttribute("xiRedirectUrl")));
				document.title = document.title.slice(0, 47) + " - Flash Player Installation";
				this.addVariable("MMdoctitle", document.title)
			}
		}
		if (this.skipDetect || this.getAttribute("doExpressInstall") || this.installedVer.versionIsValid(this.getAttribute("version"))) {
			var c = ( typeof a == "string") ? document.getElementById(a) : a;
			c.innerHTML = this.getSWFHTML();
			return true
		} else {
			if (this.getAttribute("redirectUrl") !== "") {
				document.location.replace(this.getAttribute("redirectUrl"))
			}
		}
		return false
	}
};
deconcept.SWFObjectUtil.getPlayerVersion = function() {
	var c = new deconcept.PlayerVersion([0, 0, 0]);
	var d;
	if (navigator.plugins && navigator.mimeTypes.length) {
		var a = navigator.plugins["Shockwave Flash"];
		if (a && a.description) {
			c = new deconcept.PlayerVersion(a.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."))
		}
	} else {
		if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) {
			d = 1;
			var b = 3;
			while (d) {
				try {
					b++;
					d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + b);
					c = new deconcept.PlayerVersion([b, 0, 0])
				} catch(j) {
					d = null
				}
			}
		} else {
			try {
				d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
			} catch(h) {
				try {
					d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
					c = new deconcept.PlayerVersion([6, 0, 21]);
					d.AllowScriptAccess = "always"
				} catch(g) {
					if (c.major == 6) {
						return c
					}
				}
				try {
					d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
				} catch(f) {
				}
			}
			if (d !== null) {
				c = new deconcept.PlayerVersion(d.GetVariable("$version").split(" ")[1].split(","))
			}
		}
	}
	return c
};
deconcept.PlayerVersion = function(a) {
	this.major = a[0] !== null ? parseInt(a[0], 10) : 0;
	this.minor = a[1] !== null ? parseInt(a[1], 10) : 0;
	this.rev = a[2] !== null ? parseInt(a[2], 10) : 0
};
deconcept.PlayerVersion.prototype.versionIsValid = function(a) {
	if (this.major < a.major) {
		return false
	}
	if (this.major > a.major) {
		return true
	}
	if (this.minor < a.minor) {
		return false
	}
	if (this.minor > a.minor) {
		return true
	}
	if (this.rev < a.rev) {
		return false
	}
	return true
};
deconcept.util = {
	getRequestParameter : function(d) {
		var c = document.location.search || document.location.hash;
		if (d === null) {
			return c
		}
		if (c) {
			var b = c.substring(1).split("&");
			for (var a = 0; a < b.length; a++) {
				if (b[a].substring(0, b[a].indexOf("=")) == d) {
					return b[a].substring((b[a].indexOf("=") + 1))
				}
			}
		}
		return ""
	}
};
deconcept.SWFObjectUtil.cleanupSWFs = function() {
	var d = document.getElementsByTagName("OBJECT");
	var c = function() {
	};
	for (var b = d.length - 1; b >= 0; b--) {
		d[b].style.display = "none";
		for (var a in d[b]) {
			if ( typeof d[b][a] == "function") {
				d[b][a] = c
			}
		}
	}
};
if (deconcept.SWFObject.doPrepUnload) {
	if (!deconcept.unloadSet) {
		deconcept.SWFObjectUtil.prepUnload = function() {
			__flash_unloadHandler = function() {
			};
			__flash_savedUnloadHandler = function() {
			};
			window.attachEvent("onunload", deconcept.SWFObjectUtil.cleanupSWFs)
		};
		window.attachEvent("onbeforeunload", deconcept.SWFObjectUtil.prepUnload);
		deconcept.unloadSet = true
	}
}
if (!document.getElementById && document.all) {
	document.getElementById = function(a) {
		return document.all[a]
	}
}
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject;
var SWFObject = deconcept.SWFObject;
var AmazonWidget = function() {
	var a = {
		DE : "http://ws.amazon.de",
		US : "http://ws.amazon.com",
		FR : "http://ws.amazon.fr",
		CA : "http://ws.amazon.ca",
		GB : "http://ws.amazon.co.uk",
		JP : "http://ws.amazon.co.jp"
	};
	var b = function(c) {
		c = encodeURIComponent(c);
		c = c.replace("+", "%20");
		c = c.replace("/", "%2F");
		return c
	};
	return {
		getMp3Html : function(m) {
			var c = m.marketPlace || "US";
			var j = a[c];
			var k = j + "/widgets/q?";
			var f;
			try {
				f = new SWFObject(k, "amzn_widget", m.width, m.height)
			} catch(g) {
				return ""
			}
			f.addVariable("MarketPlace", c);
			f.addVariable("Operation", "GetDisplayTemplate");
			f.addVariable("ServiceVersion", "20070822");
			f.addVariable("WS", "1");
			f.addVariable("ID", "MP3Clips");
			f.setAttribute("swf", k + f.getVariablePairs().join("&"));
			var d = {
				design : 2,
				colorTheme : m.colorTheme || "White",
				marketPlace : c,
				tag : "widgetsamazon-20",
				widgetType : "ASINList",
				ASIN : m.asin,
				width : m.width,
				height : m.height
			};
			var l, h;
			for (l in d) {
				if (d.hasOwnProperty(l)) {
					variable = l.charAt(0).toUpperCase() + l.substr(1);
					f.addVariable(variable, b(d[l]))
				}
			}
			f.addParam("quality", "high");
			f.addParam("bgcolor", "#FFFFFF");
			f.addParam("allowscriptaccess", "always");
			if (m.wMode) {
				f.addParam("wmode", m.wMode)
			}
			return f.getSWFHTML()
		},
		renderMp3Widget : function(d, c) {
			Event.addListener(document, "modifiable", function() {
				yield(function() {
					setNode($(d), null, null, AmazonWidget.getMp3Html(c))
				}, 50)
			})
		}
	}
}();
UI = {};
var URI_PATH_CHARS = "[a-z0-9\\-~_.!*'();@&=+$,\\/?%#\\[\\]:]";
var PORT_CHARS = "[0-9:]";
var DOMAIN_CHARS = "[a-z0-9\\-.]";
var SCHEME_CHARS = "[a-z]+";
var EMAIL_CHARS = "[a-z0-9!#$%&'*+-/=?^_`{|}~]";
var GENERIC_TLDS = "(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|([a-z]{2}))";
var LINKABLE_REGEXP = new RegExp("\\b(((" + SCHEME_CHARS + ":\\/\\/)|(" + EMAIL_CHARS + "+@))?(" + DOMAIN_CHARS + "+\\." + GENERIC_TLDS + ")(" + PORT_CHARS + "*)(\\/" + URI_PATH_CHARS + "*)?)\\b", "igm");
var GENERIC_TLDS_REGEXP = new RegExp("\\." + GENERIC_TLDS + "\\b");
var MENTION_REGEXP = new RegExp("(\\w*@[a-z][a-z0-9\\-]{2,30}[a-z0-9])", "gi");
var HASHTAG_REGEXP = new RegExp("(#[a-z0-9A-Z][A-Za-z0-9\\_]{0,98}[A-Za-z0-9])\\b", "g");
UI.activateLinks = function(b, a) {
	b = $(b);
	if (!b) {
		return
	}
	Event.addListener(document, "modifiable", function() {
		var c = 0;
		LINKABLE_REGEXP.lastIndex = 0;
		_activateLinks(b, a, c, LINKABLE_REGEXP, _activateLinksOnMatch);
		MENTION_REGEXP.lastIndex = 0;
		_activateLinks(b, a, c, MENTION_REGEXP, _activateMentionsOnMatch);
		HASHTAG_REGEXP.lastIndex = 0;
		_activateLinks(b, a, c, HASHTAG_REGEXP, _activateHashtagsOnMatch)
	})
};
function _activateLinksOnMatch(b, c) {
	if (!b || /\.\./.test(b)) {
		return b
	}
	var f = parseUri(b);
	GENERIC_TLDS_REGEXP.lastIndex = 0;
	if (!GENERIC_TLDS_REGEXP.test(f.host) || (f.host.split(".").length <= 2 && !f.path.length && !f.protocol.length)) {
		return b
	}
	var a = b;
	if (!f.protocol || f.protocol.length < 2) {
		if (/[^\b]@[^\b]/.test(b)) {
			a = "mailto:" + b
		} else {
			a = "http://" + b
		}
	} else {
		if (!/^https?/.test(f.protocol)) {
			a = null
		}
	}
	var d = b;
	if (c) {
		d = teaser(d, c)
	}
	if (a) {
		if (/polyvore.com\//.test(a)) {
			b = '<a rel="nofollow" href="' + a + '">' + d + "</a>"
		} else {
			b = '<a rel="nofollow" target="_blank" href="' + a + '" orighost="' + f.host + '">' + d + "</a>"
		}
	}
	return b
}

function _activateMentionsOnMatch(b, c) {
	if (!b || b.charAt(0) != "@") {
		return b
	}
	var a = buildVanityURL(b.substring(1).toLowerCase());
	b = '<a rel="nofollow" name="' + b + '" href="' + a + '">' + b + "</a>";
	return b
}

function _activateHashtagsOnMatch(b, c) {
	if (!b || b.charAt(0) != "#") {
		return b
	}
	var a = buildURL("hashtag", {
		hashtag : b.substring(1).toLowerCase()
	});
	b = '<a rel="nofollow" href="' + a + '">' + b + "</a>";
	return b
}

function _activateLinks(c, k, f, h, d) {
	f = Number(f) || 0;
	if (c.nodeType == 3) {
		var j = escapeHTML(textContent(c));
		if (j.length + f > 32000) {
			return 0
		}
		var b = splitWithMatches(h, j, d).join("");
		if (j != b) {
			var m = createNode("span", null, null, b);
			var l = c.parentNode;
			l.insertBefore(m, c);
			domRemoveNode(c)
		}
		return j.length
	} else {
		if (c.tagName == "A") {
			return 0
		} else {
			if (c.childNodes && c.childNodes.length > 0) {
				var a = 0;
				for (var g = 0; g < c.childNodes.length; g++) {
					a += _activateLinks(c.childNodes[g], k, f + a, h, d)
				}
				return a
			}
		}
	}
	return 0
}

if (!window.UI) {
	UI = {}
}
UI.sizeMap = {
	li : {
		url : "s",
		dim : 23
	},
	t : {
		url : "s",
		dim : 50
	},
	s : {
		url : "s",
		dim : 100
	},
	m : {
		url : "m",
		dim : 150
	},
	g : {
		url : "l",
		dim : 268
	},
	l : {
		url : "l",
		dim : 300
	},
	e : {
		url : "e",
		dim : 400
	},
	x : {
		url : "x",
		dim : 500
	},
	y : {
		url : "y",
		dim : 600
	},
	li2 : {
		url : "s",
		dim : 22
	},
	t2 : {
		url : "s",
		dim : 42
	},
	s3 : {
		url : "s",
		dim : 72
	},
	s2 : {
		url : "m",
		dim : 124
	},
	m2 : {
		url : "l",
		dim : 152
	},
	l2 : {
		url : "l",
		dim : 268
	},
	l3 : {
		url : "l",
		dim : 214
	}
};
UI.numberSuffixes = "1 K M B T Q".split(" ");
UI.filter2label = {
	category_id : loc("Category"),
	price_int : loc("Price"),
	brand : loc("Brand"),
	color : loc("Color"),
	bgColor : loc("Background Color"),
	displayurl : loc("Store"),
	query : loc("Search")
};
UI.sortedSizeMap = [];
forEachKey(UI.sizeMap, function(b, a) {
	a.key = b;
	UI.sortedSizeMap.push(a)
});
UI.sortedSizeMap = UI.sortedSizeMap.sort(function(d, c) {
	return d.dim - c.dim
});
UI.getImageKeyForSize = function(b) {
	for (var a = 0; a < UI.sortedSizeMap.length; a++) {
		if (UI.sortedSizeMap[a].dim >= b) {
			return UI.sortedSizeMap[a].key
		}
	}
	return UI.sortedSizeMap[UI.sortedSizeMap.length - 1].key
};
UI.getSmallestImageKeyForSize = function(b) {
	for (var a = 1; a < UI.sortedSizeMap.length; a++) {
		if (UI.sortedSizeMap[a].dim > b) {
			return UI.sortedSizeMap[a - 1].key
		}
	}
	return UI.sortedSizeMap[UI.sortedSizeMap.length - 1].key
};
UI.fontGridRender = function(b, a) {
	var c = createNode("a", {
		href : "#foo",
		title : b.title,
		className : "hover_clickable grid"
	});
	c.appendChild(UI.fontListRender(b, a));
	return c
};
UI.fontListRender = function(c, b) {
	var g = 40;
	b = b || "";
	var a = c.color;
	var d = c.bgColor || "";
	var f = createNode("div", {
		title : c.title,
		className : "hider " + b
	}, {
		height : px(g)
	});
	f.appendChild(createNode("img", {
		src : buildImgURL("img-text.list", {
			font_id : c.font_id,
			color : a,
			height : g,
			width : 2 * g,
			".out" : "png"
		}),
		alt : c.title
	}, {
		backgroundColor : d,
		padding : d ? "0 4px" : ""
	}));
	return f
};
UI.AmazonMP3Render = function(d, c) {
	c = c || "t";
	var a = new Dim(d.w, d.h);
	var f = UI.sizeMap[c].dim;
	a.fit(new Dim(f, f));
	var b = d.imgurl;
	b = b.replace(".jpg", "._SL" + f + "_.jpg");
	return createNode("img", {
		className : "unselectable",
		width : a.w,
		height : a.h,
		src : b
	})
};
UI.contestListRender = function(c) {
	var g = createNode("div", {
		className : "idea contest"
	});
	if (c.imgurl) {
		var d = g.appendChild(createNode("div", {
			className : "left bordered"
		}));
		var b = "t";
		d.appendChild(createImg({
			src : c.imgurl,
			width : UI.sizeMap[b].dim,
			height : UI.sizeMap[b].dim
		}));
		Event.addListener(d, "click", function() {
			Event.trigger(g, "action")
		})
	}
	var a = g.appendChild(createNode("div", {
		className : "body"
	}));
	var f = a.appendChild(createNode("div", {
		className : "clickable"
	}, null, c.title));
	Event.addListener(f, "click", function() {
		Event.trigger(g, "action")
	});
	a.appendChild(createNode("span", {
		className : "meta"
	}, null, [c.group_id ? loc("from {group}", {
		group : createNode("a", {
			href : buildURL("group.show", {
				id : c.group_id
			}),
			target : "_blank"
		}, null, c.group_title)
	}) + ". " : null, plural(c.active_entry_count, loc("entry"), loc("entries"), loc("No entries")).ucFirst(), ". ", loc("{duration} left", {
		duration : duration(c.time_left)
	}), "."]));
	a.appendChild(createNode("p", null, null, c.intro));
	g.appendChild(createNode("div", {
		className : "clear"
	}));
	return g
};
UI.AmazonMP3ListRender = function(c, b) {
	b = b || "t";
	var d = UI.sizeMap[b].dim;
	var a = c.imgurl;
	a = a.replace(".jpg", "._SL" + d + "_.jpg");
	return createNode("a", {
		href : "#foo",
		className : "amazon_mp3"
	}, null, [createNode("div", {
		className : "bordered imgwrap"
	}, {
		width : px(d),
		height : px(d),
		backgroundImage : "url(" + a + ")"
	}), createNode("span", null, null, [c.title, createNode("div", {
		className : "meta"
	}, null, c.artist)]), createNode("br", {
		className : "clear"
	})])
};
UI.fbContactGridHeaderRender = function(a) {
	return a.name
};
UI.fbContactGridRender = function(j, l) {
	l = l || "s";
	l = "s";
	var b = UI.sizeMap[l].dim;
	var c = j.id;
	var h = j.buddyicon || -1;
	var k = buildImgURL("img-buddy", {
		id : h,
		".out" : "jpg",
		size : l
	});
	var d = j.fb.pic_square || "";
	var a = createNode("div", {
		className : "fbprofile"
	}, null, [createImg({
		width : 50,
		height : 50,
		src : d
	}), createNode("div", {
		className : "under name"
	}, null, j.fb.name)]);
	var g = createNode("a", {
		target : "_blank",
		href : buildURL("profile", {
			id : c,
			name : j.name
		})
	}, null, j.name);
	var f = createNode("div", {
		className : "pvprofile size_" + l
	}, null, [createImg({
		width : b,
		height : b,
		src : k
	}), createNode("div", {
		className : "under name"
	}, null, [g])]);
	Event.addListener(g, "click", function(m) {
		return Event.stopBubble(m)
	});
	return createNode("div", {
		href : "#foo",
		className : "grid fbcontact"
	}, null, [f, a])
};
UI.itemGridRender = function(b, a) {
	a = a || "s";
	var c = UI.sizeMap[a].dim;
	var d = {
		tid : b.thing_id,
		size : UI.sizeMap[a].url,
		".out" : "jpg"
	};
	if (b.color) {
		d.color = b.color;
		d[".out"] = "png"
	}
	return createNode("a", {
		title : UI.getFullItemTitle(b),
		className : "grid",
		href : "#foo"
	}, null, createImg({
		width : c,
		height : c,
		src : buildImgURL("img-thing", d)
	}))
};
UI.userGridRenderAutoPageSize = function(c, b) {
	b = b || "s";
	var g = UI.sizeMap[b].dim;
	var a = buildImgURL("img-buddy", {
		size : UI.sizeMap[b].url,
		".out" : "jpg",
		id : c.buddyicon
	});
	var d = createNode("img", {
		src : a,
		width : px(g),
		height : px(g)
	});
	var f = c.user_name || c.name;
	var h = createNode("div", {
		className : "meta user_under_text"
	}, {
		width : px(g)
	}, f);
	return createNode("a", {
		title : f,
		className : "grid autosize",
		trackelement : "item",
		href : "#foo"
	}, null, [d, h])
};
UI.itemGridRenderAutoSize = function(g, k, l) {
	k = k || "s";
	l = l || {};
	var c = UI.sizeMap[k].dim;
	var j = {
		size : UI.sizeMap[k].url,
		".out" : "jpg"
	};
	var a = "img-";
	if (g.thing_id) {
		a += "thing";
		j.tid = g.thing_id;
		if (g.color) {
			j.color = g.color;
			j[".out"] = "png"
		}
	} else {
		if (g.spec_uuid || g.cid) {
			a += "set";
			j.cid = g.id || g.cid;
			j.spec_uuid = g.spec_uuid
		} else {
			if (g.buddyicon) {
				a += "buddy";
				j.id = g.buddyicon;
				j.spec_uuid = g.spec_uuid
			} else {
				console.log("WARN: Unknown item type in itemGridRenderAutoSize")
			}
		}
	}
	var h = buildImgURL(a, j);
	var f;
	if (Browser.isIE) {
		var b = createXImg({
			src : h
		}, {
			width : "100%"
		});
		f = b.outer;
		setNode(f, null, {
			height : "100%"
		});
		b.setSrc(h)
	} else {
		f = createNode("img", {
			src : h
		}, {
			width : "100%"
		})
	}
	var d = "";
	if (g.thing_id) {
		d = UI.getFullItemTitle(g)
	} else {
		d = g.name
	}
	return createNode("a", {
		title : d,
		className : "grid autosize " + (l.className || ""),
		trackelement : "item",
		href : "#foo"
	}, null, f)
};
UI.price = function(f, c) {
	if (!c) {
		c = {}
	}
	var b = (f.instock === undefined) ? true : f.instock;
	var d;
	var a = [];
	if (c.outOfStockNoPrice) {
		a.push(createNode("span", {
			className : "oos"
		}, null, loc("sold out").ucFirst()))
	} else {
		if (c.outOfStock) {
			if (f.lc_display_max_price) {
				d = f.lc_display_min_price + "&ndash;" + f.lc_display_max_price;
				a.push(createNode("span", {
					className : "orig_price"
				}, null, d))
			} else {
				if (f.display_max_price) {
					d = f.display_min_price + "&ndash;" + f.display_max_price;
					a.push(createNode("span", {
						className : "orig_price"
					}, null, d))
				} else {
					if (f.lc_display_price) {
						a.push(createNode("span", {
							className : "orig_price"
						}, null, f.lc_display_price))
					} else {
						if (f.display_price) {
							a.push(createNode("span", {
								className : "orig_price"
							}, null, f.display_price))
						}
					}
				}
			}
			if (a.length === 0) {
				a.push(createNode("span", {
					className : "oos"
				}, null, loc("sold out").ucFirst()))
			}
		} else {
			if (f.lc_display_price) {
				if (f.lc_display_max_price && !c.hideRange) {
					d = f.lc_display_min_price + "&ndash;" + f.lc_display_max_price;
					a.push(createNode("span", {
						className : "price"
					}, null, d))
				} else {
					a.push(createNode("span", {
						className : "price"
					}, null, f.lc_display_price))
				}
			} else {
				if (f.display_price) {
					if (f.display_max_price && !c.hideRange) {
						d = f.display_min_price + "&ndash;" + f.display_max_price;
						a.push(createNode("span", {
							className : "price"
						}, null, d))
					} else {
						a.push(createNode("span", {
							className : "price"
						}, null, f.display_price))
					}
				}
			}
			if (c.showOriginalPrice && f.orig_price && b) {
				if (f.orig_max_price && !c.hideRange) {
					if (f.lc_orig_max_price) {
						d = f.lc_orig_min_price + "&ndash;" + f.lc_orig_max_price;
						a.push(createNode("span", {
							className : "orig_price"
						}, null, d))
					} else {
						d = f.orig_min_price + "&ndash;" + f.orig_max_price;
						a.push(createNode("span", {
							className : "orig_price"
						}, null, d))
					}
				} else {
					d = f.lc_orig_price || f.orig_price;
					a.push(createNode("span", {
						className : "orig_price"
					}, null, d))
				}
			}
			if (c.showUnlocalizedPrice && f.lc_display_price && f.display_price !== f.lc_display_price) {
				if (f.display_max_price && !c.hideRange) {
					d = "(" + f.display_min_price + "&ndash;" + f.display_max_price + ")";
					a.push(createNode("span", {
						className : "price"
					}, null, d))
				} else {
					d = "(" + f.display_price + ")";
					a.push(createNode("span", {
						className : "price"
					}, null, d))
				}
			}
		}
	}
	return a
};
UI.priceAndLink = function(h, j) {
	if (!j) {
		j = {}
	}
	var a = (h.instock === undefined) ? true : h.instock;
	var k = [];
	var c = UI.price(h, j);
	for (var b = 0; b < c.length; b++) {
		k.push(c[b])
	}
	var d = {
		href : h.url,
		paidurl : h.paid_url,
		orighost : h.displayurl,
		oid : Track.classAndId("thing", h.thing_id)
	};
	if (j.showNotbuyableTooltip && !a) {
		d.showtooltip = true
	}
	if (h.actual_bid_token) {
		d.cpc = h.actual_bid_token
	}
	var g = j.displayUrlMaxSize;
	var f = outboundLink(d, null, g ? teaser(h.displayurl, g) : h.displayurl);
	if (j.showNotbuyableTooltip && !a) {
		Event.addListener(f, "click", function(l) {
			return Event.stop(l)
		})
	}
	k.push(f);
	return k
};
UI.itemNotbuyableTooltipRender = function(c) {
	var b = createNode("div", {
		className : "notbuyable",
		trackcontext : "notbuyable"
	});
	var a = b.appendChild(createNode("ul", {
		className : "container list"
	}));
	addList(a, loc("This item appears to be sold out."));
	addList(a, createNode("a", {
		href : c.url,
		paidurl : c.paid_url,
		cpc : c.actual_bid_token,
		orighost : c.orighost,
		oid : Track.classAndId("thing", c.thing_id),
		target : "_blank",
		trackelement : "continue"
	}, null, loc("Continue to {site} anyway", {
		site : c.orighost
	}) + "?"));
	addList(a, "&nbsp;");
	var d = createNode("div", null, {
		display : "none"
	});
	addList(a, d);
	Ajax.get({
		action : "thing.similar",
		data : {
			id : c.thing_id,
			ship_region : window._shipRegion,
			length : 3,
			".out" : "jsonx"
		},
		hideProgress : true,
		onSuccess : function(f) {
			if (!f || !f.result || !f.result.html) {
				return
			}
			UI.replaceNodes(f.result.replacements);
			str2nodes(f.result.html, d);
			show(d);
			ModalDialog.rePosition()
		}
	});
	return b
};
UI.renderBreadcrumb = function(d) {
	if (!d) {
		return null
	}
	var a = createNode("div", {
		className : "breadcrumb"
	});
	for (var c = 0; c < d.length; c++) {
		var b = d[c];
		a.appendChild(createNode("a", {
			href : b.url
		}, null, b.anchor));
		if (c + 1 < d.length) {
			a.appendChild(createNode("span", null, null, " &gt; "))
		}
	}
	return a
};
UI.itemShopToolTipRender = function(o) {
	var q = "l2";
	var l = UI.sizeMap[q];
	var j = outboundLink({
		title : o.title,
		href : o.url,
		paidurl : o.paid_url,
		cpc : o.actual_bid_token,
		orighost : o.displayurl,
		trackelement : "img",
		oid : Track.classAndId("thing", o.thing_id)
	});
	o.imgurl = buildImgURL("img-thing", {
		tid : o.thing_id,
		size : UI.sizeMap[q].url,
		".out" : "jpg"
	});
	o.clickurl = null;
	var g = j.appendChild(UI.renderItem(o, {
		size : q
	}));
	var c = createNode("div");
	c.appendChild(j);
	var h = createNode("ul", {
		className : "list",
		trackelement : "tooltip"
	});
	if (o.breadcrumb) {
		addList(h, UI.renderBreadcrumb(o.breadcrumb))
	}
	if (o.title) {
		addList(h, createNode("h2", null, null, o.title))
	}
	addList(h, UI.priceAndLink(o, {
		showOriginalPrice : true,
		showUnlocalizedPrice : true
	}));
	if (o.description) {
		addList(h, UI.renderMoreText({
			text : o.description,
			numLines : 5
		}), {
			className : "description"
		})
	}
	var b;
	if (o.offer) {
		b = UI.renderOffer(o.offer);
		Track.stat("inc", "hover_offer", ["view", "y", o.displayurl])
	} else {
		Track.stat("inc", "hover_offer", ["view", "n", o.displayurl])
	}
	var p = buildURL("thing", {
		id : o.thing_id
	}, o.seo_title);
	var a = "shop_actions";
	var n = o.in_user_items;
	var d = null;
	var k;
	if (!Auth.isLoggedIn()) {
		k = loc("Tell me when this is on sale");
		d = {
			none_yet : k,
			no_likes : k,
			others : k
		}
	}
	var m = [UI.buyButtonRender(o, {
		label : true,
		sprite : true
	}), UI.renderFavoritesNew({
		className : "btn",
		type : "thing",
		id : o.thing_id,
		can_change_fav : true,
		fav_count : o.save_count,
		is_user_fav : n,
		labels : d,
		oid : "st:likeit"
	})];
	if (b) {
		m.unshift(b)
	}
	addList(h, createNode("ul", {
		className : "actions new_actions clearfix",
		trackcontext : a
	}, null, m.map(function(r) {
		return createNode("li", null, null, r)
	})));
	Track.trackCTR(a, ["st"], {
		root : h
	});
	addList(h, createNode("a", {
		href : p,
		target : "_blank"
	}, null, loc("Related looks and items") + " &raquo;"));
	var f = createNode("div", {
		className : "items"
	});
	addList(h, f);
	Ajax.get({
		action : "thing.similar",
		data : {
			id : o.thing_id,
			ship_region : window._shipRegion,
			length : 3,
			size : "s2"
		},
		hideProgress : true,
		onSuccess : function(r) {
			if (!r.result || !r.result.items || r.result.items.length < 3) {
				return
			}
			f.appendChild(UI.layoutN(r.result.items, {
				n : 3,
				size : "s2",
				renderer : function(s) {
					s.clickurl = buildURL("shop", {
						tid : s.thing_id,
						thing_details : 1
					});
					return UI.renderItem(s, {
						size : "s2",
						className : "hoverborder"
					})
				}
			}))
		}
	});
	return ToolTip.renderImageAndDetails(c, h)
};
UI.renderOffer = function(a) {
	return createNode("div", {
		className : "offer clearfix"
	}, null, [createSprite("sale"), createNode("div", {
		className : "offer_text"
	}, null, a)])
};
UI.itemOverlayRender = function(d, c) {
	if (!c) {
		c = "m"
	}
	var f = UI.sizeMap[c].dim;
	var h = d.clickurl || buildURL("thing", {
		id : d.thing_id
	}, d.seo_title);
	var a = createNode("a", {
		title : d.title,
		href : h
	}, null, createImg({
		className : "bordered",
		width : f,
		height : f,
		src : buildImgURL("img-thing", {
			tid : d.thing_id,
			size : UI.sizeMap[c].url,
			".out" : "jpg"
		})
	}));
	var g = createNode("div", {
		className : "tooltip_overlay details"
	});
	var b = g.appendChild(createNode("ul", {
		className : "list"
	}));
	if (d.title) {
		addList(b, createNode("a", {
			title : d.title,
			href : h
		}, null, teaser(d.title, 65)))
	}
	addList(b, UI.priceAndLink(d, {
		showOriginalPrice : true,
		showUnlocalizedPrice : true,
		showNotbuyableTooltip : true,
		displayUrlMaxSize : 25
	}));
	addList(b, UI.renderFavoritesNew({
		type : "thing",
		id : d.thing_id,
		can_change_fav : true,
		no_sprite : true,
		className : "meta",
		context : d.fav_context,
		labels : {
			no_likes : loc("Like this item"),
			just_me : loc("I like this")
		}
	}));
	addList(b, createNode("a", {
		className : "meta",
		href : h
	}, null, loc("View sets with this item")));
	if (d.shop_link) {
		addList(b, createNode("a", {
			className : "meta",
			href : d.shop_link.url
		}, null, loc("Shop for {items}", {
			items : d.shop_link.anchor
		})))
	}
	return ToolTip.renderImageAndDetails(a, g)
};
UI.buyButtonRender = function(c, b) {
	b = b || {};
	b.className = b.className || "btn btn_buy";
	var a = b.label ? loc("Buy at {store}", {
		store : c.displayurl
	}) : loc("Buy");
	if (b.sprite) {
		a = outerHTML(createSprite("buyit")) + " " + a
	}
	return outboundLink({
		className : b.className,
		href : c.url,
		paidurl : c.paid_url,
		cpc : c.actual_bid_token,
		orighost : c.displayurl,
		trackelement : "buy",
		oid : Track.classAndId("thing", c.thing_id),
		target : "_blank",
		hideFocus : 1
	}, null, a)
};
UI.renderRecommendedContact = function(d, g) {
	if (!g) {
		g = {}
	}
	var c = createNode("div", {
		className : "rec_follow " + (g.contact_class || "")
	});
	if (!d.buddyicon) {
		d.buddyicon = -1
	}
	var h = buildURL("profile", {
		id : d.user_id,
		name : d.user_name
	});
	c.appendChild(createNode("div", {
		className : "left icon"
	}, null, createNode("a", {
		href : h,
		target : "_blank"
	}, null, createImg({
		src : buildImgURL("img-buddy", {
			id : d.buddyicon,
			".out" : "jpg",
			size : "s"
		}),
		width : 50,
		height : 50,
		title : d.user_name,
		className : "bordered"
	}))));
	var b = c.appendChild(createNode("div", {
		className : "info"
	}));
	b.appendChild(createNode("div", {
		className : "name"
	}, null, createNode("a", {
		href : h,
		target : "_blank"
	}, null, d.user_name)));
	b.appendChild(createNode("div", {
		className : "meta"
	}, null, d.user_meta));
	var f = createNode("span", {
		className : "text"
	}, null, loc("Follow"));
	var a = b.appendChild(createNode("span", {
		className : "btn follow_action " + (g.action_class || "")
	}, null, f));
	Follow.init(a, {
		user_id : d.user_id,
		user_name : d.user_name,
		no_popup : true,
		count_node : null,
		follower_count : d.follower_count,
		stat : g.stat,
		contact_list_name : g.contact_list_name,
		text_node : f
	});
	return c
};
UI.amazonMP3OverlayRender = function(g) {
	var c = "m";
	var h = UI.sizeMap[c].dim;
	var f = createNode("ul", {
		className : "list"
	});
	g.w *= 100;
	g.h *= 100;
	var d = UI.AmazonMP3Render(g, "m");
	var b = f.appendChild(createNode("li", {
		className : "left"
	}, null, d));
	addClass(d, "grid");
	addList(f, teaser(g.title, 100));
	addList(f, outboundLink({
		href : g.url,
		target : "_blank"
	}, null, g.displayurl));
	var j = AmazonWidget.getMp3Html({
		width : 120,
		height : 90,
		asin : g.asin
	});
	var a = addList(f, "");
	window.setTimeout(function() {
		replaceChild(a, j)
	}, 0);
	return f
};
UI.setGridRender = function(b, a) {
	if (!a) {
		a = "s"
	}
	var c = UI.sizeMap[a].dim;
	var d = {
		spec_uuid : b.spec_uuid,
		size : UI.sizeMap[a].url,
		".out" : "jpg"
	};
	if (b.type == "c") {
		d.cid = b.id
	}
	return createNode("a", {
		title : b.title,
		className : "grid",
		href : "#foo"
	}, null, createImg({
		width : c,
		height : c,
		src : buildImgURL("img-set", d)
	}))
};
UI.buildLookbookImgURL = function(b, a) {
	if (b.spec_uuid) {
		return buildImgURL("img-set", {
			cid : b.id,
			spec_uuid : b.spec_uuid,
			size : UI.sizeMap[a].url,
			".out" : "jpg"
		})
	} else {
		if (b.thing_id) {
			return buildImgURL("img-thing", {
				tid : b.thing_id,
				size : UI.sizeMap[a].url,
				".out" : "jpg"
			})
		} else {
			if (b.buddyicon) {
				return buildImgURL("img-buddy", {
					id : b.buddyicon,
					size : UI.sizeMap[a].url,
					".out" : "jpg"
				})
			}
		}
	}
};
UI.setGridRenderLookbook = function(d, c) {
	if (!c) {
		c = "s"
	}
	var b = createNode("div", {
		className : "lookbookedit lookbookOuter"
	});
	var g = createNode("img", {
		src : UI.buildLookbookImgURL(d, c)
	});
	var a = UI.renderStack(createNode("a", {
		title : d.title,
		href : "#foo"
	}, {
		textDecoration : "none"
	}, g));
	addClass(a, "mod_stack_size_" + c);
	b.appendChild(a);
	if (d.title) {
		var f = b.appendChild(createNode("div", {
			className : "under_long"
		}, null, d.title))
	}
	return b
};
UI.renderStackUIC = function(g, a) {
	var j = a.id || Dom.uniqueId();
	var d = a.className || "";
	var c = a.size || "s";
	var h = a.renderer || UI.renderItem;
	var f = h(g, {
		size : c
	});
	var b = ["mod_stack", d, "size_" + c].filter(function(k) {
		return !!k
	});
	return createNode("div", {
		id : j,
		className : b.join(" ")
	}, null, createNode("div", {
		className : "mod_stack_layer"
	}, null, createNode("div", {
		className : "mod_stack_layer"
	}, null, createNode("div", {
		className : "mod_stack_content"
	}, null, f))))
};
UI.renderStack = function(a) {
	return createNode("div", {
		className : "mod_stack"
	}, null, createNode("div", {
		className : "mod_stack_layer"
	}, null, createNode("div", {
		className : "mod_stack_layer"
	}, null, createNode("div", {
		className : "mod_stack_layer"
	}, null, a))))
};
UI.setGridRenderAutoSize = function(d, c, b) {
	c = c || "s";
	b = b || {};
	var h = UI.sizeMap[c].dim;
	var j = {
		spec_uuid : d.spec_uuid,
		size : UI.sizeMap[c].url,
		".out" : "jpg"
	};
	if (d.id && d.type == "c") {
		j.cid = d.id
	}
	var a = buildImgURL("img-set", j);
	var f;
	if (Browser.isIE) {
		var g = createXImg({
			src : a
		}, {
			width : "100%"
		});
		f = g.outer;
		setNode(f, null, {
			height : "100%"
		});
		g.setSrc(a);
		f._image = g
	} else {
		f = createNode("img", {
			src : a
		}, {
			width : "100%"
		})
	}
	return createNode(b.tag || "a", {
		title : d.title,
		className : "grid autosize " + (b.className || ""),
		href : "#foo"
	}, null, f)
};
UI.setCarouselRenderWithBy = function(d, c) {
	if (!c) {
		c = "t"
	}
	var f = UI.sizeMap[c].dim;
	var a = d.clickurl ? d.clickurl : buildURL("set", {
		id : d.id
	}, d.seo_title);
	var b = createNode("a", {
		className : "hoverborder",
		href : a
	}, null, createImg({
		width : f,
		height : f,
		title : d.title,
		src : d.imgurl ? d.imgurl : buildImgURL("img-set", {
			cid : d.id,
			spec_uuid : d.spec_uuid,
			size : UI.sizeMap[c].url,
			".out" : "jpg"
		})
	}));
	var g = [];
	if (d.userurl || d.user_id) {
		g = [loc("by") + " ", createNode("a", {
			href : d.userurl ? d.userurl : buildURL("profile", {
				id : d.user_id,
				name : d.user_name
			})
		}, null, d.user_name)]
	} else {
		if (d.itemtitle) {
			g = [createNode("a", {
				href : a
			}, null, d.itemtitle)]
		}
	}
	return createNode("div", {
		className : "grid"
	}, null, [b, addClass(createNode("span", {
		className : "under"
	}, null, g), "size_" + c)])
};
UI.setCarouselRenderWithLike = function(d, c) {
	if (!c) {
		c = "t"
	}
	var f = UI.sizeMap[c].dim;
	var b = createNode("a", {
		className : "hoverborder",
		href : buildURL("set", {
			id : d.id
		}, d.seo_title)
	}, null, createImg({
		width : f,
		height : f,
		src : d.imgurl ? d.imgurl : buildImgURL("img-set", {
			cid : d.id,
			spec_uuid : d.spec_uuid,
			size : UI.sizeMap[c].url,
			".out" : "jpg"
		})
	}));
	var a = UI.renderFavoritesNew({
		id : d.id,
		type : "set",
		fav_count : d.fav_count,
		is_user_fav : d.is_user_fav,
		can_change_fav : false
	});
	return createNode("div", {
		className : "grid"
	}, null, [b, createNode("div", {
		className : "under_carousel under size_" + c
	}, null, a)])
};
UI.renderFavoritesCompact = function(b) {
	if (!b.type || !b.id || !b.can_change_fav) {
		return null
	}
	var f = mergeObject({
		like_this : loc("Like"),
		you_like_this : loc("I like this")
	}, b.labels || {});
	if (!b.no_sprite) {
		var c = outerHTML(createSprite("likeit"));
		forEachKey(f, function(g) {
			f[g] = c + "<span>" + f[g] + "</span>"
		})
	}
	b.node_id = b.node_id || ("favorite_" + b.type + "_" + b.id);
	var d = createNode("span", {
		id : b.node_id,
		className : (b.className || "") + (b.can_change_fav ? " clickable" : ""),
		oid : b.oid,
		trackelement : "likeit",
		title : (b.is_user_fav ? loc("Unlike") : loc("Like"))
	}, null, createNode("span", {
		className : "action_label"
	}, null, (b.is_user_fav ? f.you_like_this : f.like_this)));
	var a = new LikeItToggle({
		id : b.id,
		type : b.type,
		is_user_fav : b.is_user_fav,
		button : d,
		liked_button : f.you_like_this,
		not_liked_button : f.like_this,
		context : b.context
	});
	return d
};
UI.renderFavoritesInline = function(b) {
	b = b || {};
	var c = (parseInt(b.fav_count, 10) || 0) - (b.is_user_fav ? 1 : 0);
	var a = (parseInt(b.fav_count, 10) || 0) + (b.is_user_fav ? 0 : 1);
	b.labels = mergeObject({
		none_yet : loc("0"),
		no_likes : loc("Like"),
		just_me : loc("1"),
		others : c,
		others_me : a
	}, b.labels || {});
	return UI.renderFavoritesNew(b)
};
UI.renderFavoritesNew = function(b) {
	b = b || {};
	b.className = b.className || "";
	b._new_favorites = true;
	var d = (parseInt(b.fav_count, 10) || 0) - (b.is_user_fav ? 1 : 0);
	var c = (parseInt(b.fav_count, 10) || 0) - (b.is_user_fav ? 1 : 0);
	var a = (parseInt(b.fav_count, 10) || 0) + (b.is_user_fav ? 0 : 1);
	var f = mergeObject({
		none_yet : loc("0 likes"),
		no_likes : loc("Like"),
		just_me : loc("1 like"),
		others : pluralNumber(c, loc("like"), loc("likes")),
		others_me : pluralNumber(a, loc("like"), loc("likes"))
	}, b.labels || {});
	if (!d && !b.can_change_fav) {
		b.labels = {
			like_this : f.none_yet
		}
	} else {
		if (d) {
			b.labels = {
				like_this : f.others,
				you_like_this : f.others_me
			}
		} else {
			b.labels = {
				like_this : f.no_likes,
				you_like_this : f.just_me
			}
		}
	}
	if (b.is_user_fav) {
		b.className = ["faved", b.className].join(" ")
	}
	return UI.renderFavoritesCompact(b)
};
UI.itemListRender = function(f, b) {
	if (!b) {
		b = {}
	}
	var d = b.size || "m";
	var h = UI.sizeMap[d].dim;
	var c = createNode("ul", {
		className : "list"
	});
	var g = f.clickUrl || buildURL("thing", {
		id : f.thing_id
	}, f.seo_title);
	var a = createNode("a", {
		href : g,
		target : "_blank"
	}, null, createImg({
		className : "bordered",
		width : h,
		height : h,
		src : UI.buildLookbookImgURL(f, d)
	}));
	if (b.dragableImage) {
		Event.addListener(a, "dragstart", function(j) {
			j.xDataTransfer.setData("item", f);
			j.xDataTransfer.proxy = createNode("img", {
				src : UI.buildLookbookImgURL(f, "s"),
				width : 50,
				height : 50
			});
			Event.stop(j)
		})
	}
	c.appendChild(createNode("li", {
		className : "left"
	}, null, a));
	if (f.title) {
		addList(c, f.title)
	}
	return c
};
UI.setListRender = function(f, b) {
	if (!b) {
		b = {}
	}
	var d = b.size || "m";
	var h = UI.sizeMap[d].dim;
	var c = createNode("ul", {
		className : "list"
	});
	var g = f.clickUrl || buildURL("set", {
		id : f.id
	}, f.seo_title);
	var a = createNode("a", {
		href : g,
		target : "_blank"
	}, null, createImg({
		className : "bordered",
		width : h,
		height : h,
		src : buildImgURL("img-set", {
			cid : f.id,
			spec_uuid : f.spec_uuid,
			size : UI.sizeMap[d].url,
			".out" : "jpg"
		})
	}));
	if (b.dragableImage) {
		Event.addListener(a, "dragstart", function(j) {
			j.xDataTransfer.setData("set", f);
			j.xDataTransfer.proxy = createNode("img", {
				src : buildImgURL("img-set", {
					cid : f.id,
					spec_uuid : f.spec_uuid,
					size : "s",
					".out" : "jpg"
				}),
				width : 50,
				height : 50
			});
			Event.stop(j)
		})
	}
	c.appendChild(createNode("li", {
		className : "left"
	}, null, a));
	if (f.title) {
		addList(c, f.title)
	}
	return c
};
UI.draftListRender = function(f, b) {
	if (!b) {
		b = {}
	}
	var d = b.size || "m";
	var g = UI.sizeMap[d].dim;
	var c = createNode("ul", {
		className : "list"
	});
	var h = {
		spec_uuid : f.spec_uuid,
		size : UI.sizeMap[d].url,
		".out" : "jpg"
	};
	var a = createImg({
		className : "bordered",
		width : g,
		height : g,
		src : buildImgURL("img-set", h)
	});
	if (b.dragableImage) {
		Event.addListener(a, "dragstart", function(j) {
			j.xDataTransfer.setData("draft", f);
			j.xDataTransfer.proxy = createNode("img", {
				src : buildImgURL("img-set", h),
				width : 50,
				height : 50
			});
			Event.stop(j)
		})
	}
	c.appendChild(createNode("li", {
		className : "left"
	}, null, a));
	if (f.updated_ago) {
		c.appendChild(createNode("li", null, null, f.updated_ago))
	}
	return c
};
UI.lookbookListRender = function(f, b) {
	if (!b) {
		b = {}
	}
	var d = b.size || "m";
	var g = UI.sizeMap[d].dim;
	var c = createNode("ul", {
		className : "list"
	});
	var a = createImg({
		className : "bordered",
		width : g,
		height : g,
		src : UI.buildLookbookImgURL(f, d)
	});
	if (f.id) {
		a = createNode("a", {
			href : buildURL("collection", {
				id : f.id
			}, f.seo_title),
			target : "_blank"
		}, null, a)
	}
	if (b.dragableImage) {
		Event.addListener(a, "dragstart", function(h) {
			h.xDataTransfer.setData("lookbook", f);
			h.xDataTransfer.proxy = createNode("img", {
				src : UI.buildLookbookImgURL(f, "s"),
				width : 50,
				height : 50
			});
			Event.stop(h)
		})
	}
	c.appendChild(createNode("li", {
		className : "left"
	}, null, a));
	if (f.title) {
		c.appendChild(createNode("li", null, null, f.title))
	}
	return c
};
UI.fontIconRender = function(b, a) {
	a = a || "t";
	var c = UI.sizeMap[a].dim;
	return createImg({
		width : c,
		height : c,
		title : b.title,
		src : buildImgURL("img-text.icon", {
			font_id : b.font_id,
			size : UI.sizeMap[a].url,
			".out" : "jpg"
		})
	})
};
UI.getFullItemTitle = function(a) {
	var b = a.title || a.name || "";
	if (b) {
		if (a.display_price) {
			b += " - " + a.display_price
		}
		if (a.displayurl) {
			b += " - " + a.displayurl
		}
	}
	return b
};
UI.itemRender = function(b, a) {
	a = a || "t";
	var c = UI.sizeMap[a].dim;
	var d = {
		tid : b.thing_id,
		size : UI.sizeMap[a].url,
		".out" : "jpg"
	};
	if (b.color) {
		d.color = b.color;
		d[".out"] = "png"
	}
	return createImg({
		width : c,
		height : c,
		title : UI.getFullItemTitle(b),
		src : buildImgURL("img-thing", d)
	})
};
UI.setRenderWithLink = function(b, a) {
	return createNode("a", {
		target : "_blank",
		href : buildURL("set", {
			id : b.id
		}, b.seo_title)
	}, {
		display : "block",
		position : "relative"
	}, UI.setRender(b, a))
};
UI.setRender = function(b, a) {
	a = a || "t";
	var c = UI.sizeMap[a].dim;
	return createImg({
		className : "img_size_" + a,
		width : c,
		height : c,
		title : b.title,
		src : b.imgurl ? b.imgurl : buildImgURL("img-set", {
			cid : b.id,
			spec_uuid : b.spec_uuid,
			size : UI.sizeMap[a].url,
			".out" : "jpg"
		})
	})
};
UI.renderPerson = function(d, k) {
	k = k || {};
	var c = d.id || d.user_id;
	var b = d.name || d.user_name;
	var g = d.buddyicon || -1;
	var f = buildURL("profile", {
		id : c,
		name : b
	});
	var j = buildImgURL("img-buddy", {
		id : g,
		".out" : "jpg",
		size : "li2"
	});
	var h = UI.renderItem({
		imgurl : j
	}, {
		size : "li2"
	});
	var a = createNode("span", null, null, b);
	if (d.state !== "active" || k.noLink) {
		return createNode("span", {
			className : "render_person"
		}, null, [h, a])
	} else {
		return createNode("a", {
			target : k.newWindow ? "_blank" : "",
			href : f,
			className : "render_person"
		}, null, [h, a])
	}
};
UI.renderBuddyIcon = function(a, j, c, k) {
	var g = a.user_id;
	var h = a.buddyicon || -1;
	j = j || "t";
	var d = UI.sizeMap[j].dim;
	k = k || {};
	var f = k.linkClass || "";
	var b = createNode("img", {
		src : buildImgURL("img-buddy", {
			id : h,
			".out" : "jpg",
			size : UI.sizeMap[j].url
		}),
		width : d,
		height : d,
		className : "bordered buddyicon img_size_" + j,
		alt : a.user_name
	});
	if (g == -1) {
		return b
	} else {
		return createNode("a", {
			href : buildURL("profile", {
				id : g,
				name : a.user_name
			}),
			className : f + " buddy_icon",
			title : a.user_name,
			target : c ? "_blank" : undefined
		}, null, b)
	}
};
UI.renderCommentUIC = function(g, r) {
	r = r || {};
	var q = r.size || "t2";
	var d = r.attSize || "s";
	var f = createNode("a", {
		className : "left",
		href : buildURL("profile", {
			id : g.user.user_id,
			name : g.user.user_name
		})
	}, null, g.user.user_name);
	var l = createNode("div", {
		className : "title clearfix"
	}, null, f);
	var c = [];
	var o = (g.user.user_id == Auth.userId());
	var k = "favorites";
	if (g.user_faved) {
		k += " user_faved"
	}
	if (o) {
		k += " prevent_change"
	}
	c.push({
		listItemClass : k,
		label : [g.id, g.cls, g.fav_count || 0].join("/"),
		action : "void(0)"
	});
	if (o) {
		c.push({
			label : "&nbsp;",
			className : "delete",
			title : loc("Delete"),
			actionClass : "btn",
			listItemClass : "hover_container delete",
			action : function() {
				Comment.del(g.cls || "collection", g.id)
			}
		})
	}
	if (c.length) {
		var j = l.appendChild(createNode("ul", {
			className : "actions inline right"
		}));
		c.forEach(function(s) {
			j.appendChild(UI.renderAction(s));
			j.appendChild(document.createTextNode(" "))
		})
	}
	var m = Math.floor(ts2age(g.createdon_ts));
	if (m > 0) {
		m = loc("wrote {age} ago", {
			age : duration(m)
		})
	} else {
		m = loc("wrote moments ago")
	}
	var p = createNode("div", {
		className : "meta"
	}, null, m.ucFirst());
	var h = createNode("div", {
		className : "list_item_icon"
	}, null, UI.renderBuddyIcon(g.user, q));
	var n = createNode("div", {
		className : "filling_block"
	}, null, [l, p, UI.renderMoreText({
		text : g.comment,
		escape : false
	})]);
	if (r.attachments && r.attachments.length) {
		var a = createNode("ul", {
			className : "attachments clearfix"
		});
		r.attachments.forEach(function(u) {
			var t = createNode("li");
			try {
				if (u.spec_uuid) {
					u.imgurl = buildImgURL("img-set", {
						cid : u.id,
						spec_uuid : u.spec_uuid,
						size : d,
						".out" : "jpg"
					});
					u.clickurl = buildURL("set", {
						id : u.id
					})
				} else {
					u.imgurl = buildImgURL("img-thing", {
						tid : u.thing_id,
						size : d,
						".out" : "jpg"
					});
					u.clickurl = buildURL("thing", {
						id : u.thing_id
					})
				}
				t.appendChild(UI.renderItem(u, {
					size : d
				}));
				if (u.title) {
					var s = createNode("div");
					s.appendChild(createNode("a", {
						href : u.clickurl,
						className : "hover_clickable"
					}, null, u.title));
					t.appendChild(s)
				}
				if (!u.spec_uuid) {
					t.appendChild(createNode("div", null, null, UI.priceAndLink(u)))
				} else {
					var w = createNode("a", {
						href : buildURL("profile", {
							id : u.user_id,
							name : u.user_name
						}),
						className : "hover_clickable"
					}, null, u.user_name);
					t.appendChild(createNode("div", null, null, [loc("By {user_name}", {
						user_name : w
					})]))
				}
			} catch(v) {
			}
			a.appendChild(t)
		});
		var b = createNode("div", {
			className : "list_item_extra"
		});
		b.appendChild(a);
		n.appendChild(b)
	}
	return createNode("div", {
		className : "list_item clearfix " + (g.is_moderator ? "moderator_highlight " : "") + (r.className || "") + ("comment_" + g.id)
	}, null, [h, n])
};
UI.promoteLabels = function(m) {
	var j = m.type;
	if (!j) {
		return
	}
	var d = new Date().getTime() / 1000;
	var b, h, f;
	if (j === "set") {
		b = loc("Promote set");
		h = loc("Unpromote set")
	} else {
		if (j === "thing") {
			b = loc("Promote item");
			h = loc("Unpromote item")
		} else {
			if (j === "collection") {
				b = loc("Promote collection");
				h = loc("Unpromote collection")
			}
		}
	}
	f = h;
	var k = 7 * 24 * 60 * 60;
	var a = future(k);
	var l = m.promotion_end_ts || (k + d);
	var c = future(l - d);
	h = h + ". " + loc("Ends {intime}", {
		intime : c
	});
	f = f + ". " + loc("Ends {intime}", {
		intime : a
	});
	var g = mergeObject(m.labels || {}, {
		promote_label : b,
		unpromote_label : h,
		unpromote_js_label : f
	});
	return g
};
UI.renderActions = function(c, a) {
	a = a || {};
	a.className = a.className || "";
	var b = createNode("ul", {
		className : "actions " + a.className
	});
	c.forEach(function(d) {
		b.appendChild(UI.renderAction(d))
	});
	return b
};
UI.renderAction = function(action) {
	var className = action.className || "";
	var li = createNode("li", {
		className : "actions " + (action.listItemClass || "")
	});
	li.appendChild(createSprite(className));
	var node = null;
	if (action.url) {
		node = createNode("a", {
			href : action.url
		}, null, action.label)
	} else {
		if (action.action) {
			node = createNode("span", {
				className : "clickable"
			}, null, action.label)
		} else {
			node = createNode("span", null, null, action.label)
		}
	}
	li.appendChild(node);
	var onclick = noop;
	if (action.action) {
		if ( typeof (action.action) === "string") {
			onclick = function() {
				eval("(" + action.action + ")")
			}
		} else {
			onclick = action.action
		}
	} else {
		if (action.url) {
			onclick = function() {
				window.location = action.url
			}
		}
	}
	if (action.id) {
		setNode(node, {
			id : action.id
		})
	}
	if (action.disabled) {
		setNode(node, {
			disabled : ""
		})
	}
	if (action.actionClass) {
		addClass(node, action.actionClass)
	}
	if (action.confirm) {
		Event.addListener(node, "click", function(event) {
			ModalDialog.confirm({
				content : action.confirm,
				onOk : onclick
			});
			return Event.stop(event)
		})
	} else {
		Event.addListener(node, "click", function(event) {
			onclick();
			return Event.stop(event)
		})
	}
	return li
};
UI.renderCenterMiddle = function(a) {
	return createNode("table", {
		className : "centermiddle"
	}, null, createNode("tbody", {
		className : "centermiddletbody"
	}, null, createNode("tr", {
		className : "centermiddlerow"
	}, null, createNode("td", {
		className : "centermiddlecell"
	}, null, a))))
};
UI.renderEditorItemAction = function(a, b, d) {
	if ( d instanceof Array) {
		var c = d;
		d = function() {
			UI.showItemDropDownMenu(b.id, c)
		}
	}
	return UI.renderEditorItemButton(b, d)
};
UI.showItemDropDownMenu = function(a, c) {
	var b = new DropDownMenu(c);
	Event.addListener(b, "hide", function() {
		if (b) {
			b.destruct();
			b = null
		}
	});
	b.attach($(a), DropDownMenu.POSITION_BOTTOM_LEFT, 150);
	b.show()
};
UI.renderEditorItemButton = function(b, d) {
	var a = {
		id : b.id
	};
	if (b.trackelement) {
		a.trackelement = b.trackelement
	}
	var c = createNode("button", a, null, createSprite("", b.title));
	Event.addListener(c, "click", d);
	Event.addListener(c, "mousedown", Event.stop);
	c.title = b.alt;
	return c
};
UI.displayAjaxMessages = function(b, a) {
	if (!b) {
		return
	}
	b.forEach(function(c) {
		Feedback.message(createNode("span", {
			className : c.type
		}, null, c.content), c.delay || c.duration)
	})
};
UI.modalDisplayAjaxMessages = function(b) {
	if (!b) {
		return
	}
	if (b.length == 1) {
		ModalDialog.alert({
			content : b[0].content
		})
	} else {
		var a = createNode("div");
		b.forEach(function(c) {
			if (a.childNodes.length > 0) {
				a.appendChild(createNode("br"))
			}
			a.appendChild(createNode("h3", null, null, c.content))
		});
		ModalDialog.show_uic({
			title : loc("Errors and Warnings"),
			body : a,
			actions : [{
				label : createNode("span", {
					className : "btn btn_action"
				}, null, loc("OK")),
				action : ModalDialog.hide
			}]
		})
	}
	return
};
UI.displayAjaxErrors = function(a, b) {
	b = $(b);
	if (b) {
		setNode(b, null, null, a.extractGeneralErrorMessages().join("<br>"))
	}
	if (a.form_error) {
		forEachKey(a.form_error, function(f, c) {
			var d = inOrderTraversal(function(g) {
				return g.name == f
			});
			if (!d) {
				return false
			}
			d.parentNode.appendChild(createNode("div", {
				className : "error"
			}, null, c));
			return true
		})
	}
};
UI.whiteblock = function(b) {
	if (!UI._whiteblock) {
		UI._whiteblock = document.body.appendChild(createNode("div", {
			className : "whiteblock"
		}));
		Event.addListener(UI._whiteblock, "click", UI.hideWhiteblock);
		UI._whiteblockStack = []
	}
	if (b) {
		var a = overlayZIndex(UI._whiteblock);
		if (UI._aboveWhiteblock) {
			UI._whiteblockStack.push(UI._aboveWhiteblock);
			UI._aboveWhiteblock = b;
			setNode(UI._whiteblock, null, {
				zIndex : a
			});
			setNode(UI._aboveWhiteblock, null, {
				zIndex : a + 1
			})
		} else {
			UI._aboveWhiteblock = b;
			setNode(UI._whiteblock, null, {
				zIndex : a
			});
			setNode(UI._aboveWhiteblock, null, {
				zIndex : a + 1
			})
		}
		if (b.parentNode != document.body) {
			document.body.appendChild(b)
		}
		show(UI._whiteblock);
		show(UI._aboveWhiteblock)
	}
	return UI._whiteblock
};
UI.hideWhiteblock = function() {
	if (UI._aboveWhiteblock && UI._aboveWhiteblock.parentNode) {
		UI._aboveWhiteblock.parentNode.removeChild(UI._aboveWhiteblock);
		UI._aboveWhiteblock = null
	}
	if (UI._whiteblockStack && UI._whiteblockStack.length) {
		UI.whiteblock(UI._whiteblockStack.pop())
	} else {
		hide(UI._whiteblock)
	}
};
UI.renderPolaroids = function(f, m, b) {
	var l = createNode("div");
	for (var c = 0; c < f.length; c++) {
		var k = f[c];
		var g = k["class"];
		var j = (c + 1) % b ? "" : "last";
		var a = l.appendChild(createNode("div", {
			className : "polaroid polaroid_size_" + m + " polaroid_" + g + " " + j
		}));
		var d = a.appendChild(createNode("div"));
		if (g == "collection") {
			d.appendChild(createNode("a", {
				href : k.clickurl
			}, null, UI.setRender(k, m)));
			a.appendChild(createNode("div", {
				className : "under_polaroid no_caption"
			}, null, createNode("div", {
				className : "unit"
			}, null, k.text_under)))
		} else {
			if (g == "thing") {
				d.appendChild(createNode("a", {
					href : k.clickurl
				}, null, UI.itemRender(k, m)));
				var h = a.appendChild(createNode("div", {
					className : "under_polaroid no_caption"
				}, null, createNode("div", {
					className : "unit"
				}, null, k.text_under)));
				h.appendChild(createNode("div", {
					className : "unit shop_link"
				}, null, UI.priceAndLink(k, {
					showOriginalPrice : true
				})))
			}
		}
	}
	return l
};
UI.renderSetStream = function(a) {
	container = $(a.container);
	var f = a.stream;
	var h = a.cid;
	var b = a.size || "s2";
	var c = function(j, k) {
		switch(k.type) {
			case"fav":
				return buildURL("set", {
					id : j.id,
					faved_by : k.fav_userid
				}, j.seo_title);
			case"lookbook":
				return buildURL("set", {
					id : j.id,
					lid : k.lid
				}, j.seo_title);
			case"set":
				return buildURL("set", {
					id : j.id,
					stream : null
				}, j.seo_title)
		}
	};
	clearNode(container);
	var g = container.appendChild(createNode("div", {
		className : "car"
	}));
	g.appendChild(createNode("center", null, {
		height : "100%"
	}, createNode("span", {
		className : "loading"
	}, {
		height : "100%"
	})));
	makeUnselectable(g);
	var d;
	if (f.items) {
		d = new MemDataSource(f.items);
		yield(d.ensureLoaded, d)
	} else {
		d = new AjaxDataSource(f.datasource.action, f.datasource.params);
		Event.addListener(window, "load", d.ensureLoaded, d)
	}
	Event.addSingleUseListener(d, "loaded", function() {
		clearNode(g);
		var l = a.visible_items;
		var j = a.index;
		if (!j && j !== 0) {
			j = d.values().find({
				id : h
			}, function(o, n) {
				return o.id == n.id
			});
			j = Math.min(j, d.values().length - l);
			j = Math.max(j, 0)
		}
		var k = new CarouselWindow({
			data : d,
			duration : 300,
			className : "thin_carousel",
			renderer : function(p) {
				var n = UI.setRender(p, b);
				var o = createNode("a", {
					href : c(p, f),
					className : "hoverborder item " + (p.id == h ? "current" : "")
				}, null, n);
				return o
			},
			size : l,
			index : j
		});
		g.appendChild(k.getNode());
		var m = new FloatingPaginator({
			carouselWindow : k,
			container : g,
			className : "streamPag"
		});
		m.redraw();
		setNode(g, {
			trackcontext : "car." + f.type
		});
		setNode(m.next, {
			trackelement : "next"
		});
		setNode(m.prev, {
			trackelement : "prev"
		});
		k.redraw()
	})
};
UI.itemsGridRender = function(c, f) {
	var h = UI.sizeMap[f].dim;
	var b = createNode("div", {
		className : "grids"
	});
	for (var d = 0; d < c.length; d++) {
		var g = c[d];
		var a = b.appendChild(UI.itemGridRender(g, f));
		if (g.clickurl) {
			a.setAttribute("href", g.clickurl)
		}
	}
	return b
};
UI.setsGridRender = function(d, c) {
	var f = UI.sizeMap[c].dim;
	var a = createNode("div", {
		className : "grids"
	});
	for (var b = 0; b < d.length; b++) {
		a.appendChild(UI.setGridRender(d[b], c))
	}
	return a
};
UI.highchart = function(options) {
	options = options || {};
	options.tooltip = options.tooltip || {};
	options.yAxis = options.yAxis || {};
	options.yAxis.labels = options.yAxis.labels || {};
	options.xAxis = options.xAxis || {};
	options.xAxis.labels = options.xAxis.labels || {};
	if (options.tooltip.formatter) {
		eval("(options.tooltip.formatter = " + options.tooltip.formatter + ")")
	}
	if (options.yAxis.labels.formatter) {
		eval("(options.yAxis.labels.formatter = " + options.yAxis.labels.formatter + ")")
	}
	if (options.xAxis.labels.formatter) {
		eval("(options.xAxis.labels.formatter = " + options.xAxis.labels.formatter + ")")
	}
	if (options.defaultSeriesGroup && options.allSeriesGroups && !options.series) {
		options.series = options.allSeriesGroups[options.defaultSeriesGroup]
	}
	var chart = new Highcharts.Chart(options);
	if (options.defaultSeriesGroup && options.allSeriesGroups) {
		chart.allSeriesGroups = options.allSeriesGroups
	}
	return chart
};
UI.highchart.showSeries = function(a, d) {
	if (jQuery(a) === undefined) {
		return true
	}
	var c = jQuery(a).highcharts();
	if (c.allSeriesGroups === undefined || !( d in c.allSeriesGroups)) {
		return true
	}
	while (c.series.length > 0) {
		c.series[0].remove(false)
	}
	var b = c.allSeriesGroups[d];
	jQuery.each(b, function(f, g) {
		c.addSeries(g, false)
	});
	c.redraw();
	return false
};
UI.highchart.FORMAT_NUMBER_SHORT = function() {
	return UI.formatNumberShort(this.value)
};
UI.highchart.FORMAT_DATE_TT_ANALYTICS = function() {
	var c = this.point.y_raw === undefined ? this.y : this.point.y_raw;
	var b = 0;
	var a = mantissa(c);
	if (a) {
		b = Math.min(("" + a).length, 5)
	}
	return [Highcharts.dateFormat("%b %d, %Y", new Date(this.x), 1), "<br>", this.series.name, ": ", "<b>", Highcharts.numberFormat(c, b), "</b>"].join("")
};
UI.highchart.FORMAT_HRS_AGO_XLABEL = function() {
	return this.value > 1 ? this.value - 1 : loc("Now")
};
UI.highchart.FORMAT_HRS_AGO_TT = function() {
	var a;
	switch(this.x) {
		case 1:
			a = loc("Current hour");
			break;
		case 2:
			a = loc("Past hour");
			break;
		default:
			a = loc("{age} hours ago", {
				age : this.x - 1
			})
	}
	return [a, " : ", "<b>", this.y, "</b>", " ", this.series.name].join("")
};
UI.highchart.FORMAT_DATE_TT = function() {
	var a = this.point.y_raw === undefined ? this.y : this.point.y_raw;
	return [Highcharts.dateFormat("%b %d", new Date(this.x), 1), " : ", "<b>", UI.formatNumberShort(a), "</b>", " ", this.series.name].join("")
};
UI.formatNumberShort = function(b) {
	if (b < 1000) {
		return b
	}
	var a = 0;
	while (b >= 1000 && UI.numberSuffixes[a + 1]) {
		b /= 1000;
		++a
	}
	b = b > 10 ? Math.round(b) : round(b, 0.1);
	return b + UI.numberSuffixes[a]
};
UI.colorBlockRender = function(d, a) {
	var b;
	if (a.w) {
		b = a
	} else {
		b = new Dim(UI.sizeMap[a].dim, UI.sizeMap[a].dim)
	}
	var c = createNode("div", {
		color : d.color.toUpperCase()
	}, {
		position : "relative",
		backgroundColor : d.color,
		width : px(b.w),
		height : px(b.h)
	});
	if (d.color.toUpperCase() == "#FFFFFF") {
		c.appendChild(createNode("div", {
			className : "whiteHighlight"
		}))
	}
	return createNode("a", {
		title : d.title || loc("Rectangle"),
		className : "colorblock",
		href : "#foo"
	}, null, c)
};
UI.colorBlockAutoSizeRender = function(d, a) {
	var b;
	if (a.w) {
		b = a
	} else {
		b = new Dim(UI.sizeMap[a].dim, UI.sizeMap[a].dim)
	}
	var c = createNode("div", {
		color : d.color.toUpperCase()
	}, {
		position : "relative",
		backgroundColor : d.color,
		width : "100%",
		height : "100%"
	});
	if (d.color.toUpperCase() == "#FFFFFF") {
		c.appendChild(createNode("div", {
			className : "whiteHighlight"
		}))
	}
	return createNode("a", {
		title : d.title || loc("Rectangle"),
		className : "grid shape autosize",
		href : "#foo"
	}, null, c)
};
UI.renderDropDownMenu = function(b, d) {
	var g = b.choices || [];
	if (g.length === 0) {
		return d
	}
	var f = b.id || Dom.uniqueId("drop_down_menu");
	var a = b.anchor_id || Dom.uniqueId("drop_down_menu_anchor");
	var c = createNode("span", {
		id : f,
		className : "mod_drop_down_menu"
	}, null, [createNode("span", {
		className : "content"
	}, null, d), createNode("span", {
		id : a,
		className : "anchor"
	}, null, [createNode("span", {
		className : "mod_arrow down blue"
	}, null, "")])]);
	DropDownMenu.createNavDropDown({
		anchor : f,
		actuator : a,
		choices : g,
		position : b.position || "bottom_left"
	});
	return c
};
UI.replaceNodes = function(d) {
	d = d || [];
	for (var b = 0; b < d.length; b++) {
		var c = d[b];
		var f = $(c.id);
		if (f) {
			var a = str2nodes(c.html);
			setNode(f, null, null, a.nodes);
			a.js()
		}
	}
};
UI.layoutN = function(a, b) {
	return createNode("ul", {
		id : b.id || "",
		className : "layout_n " + (b.className || "")
	}, null, UI.layoutNBody(a, b))
};
UI.layoutNBody = function(h, k) {
	h = h || [];
	k = k || {};
	var a = k.n;
	var j = k.size || "m2";
	var b = k.offset || 0;
	var f = k.no_last_row || b;
	var g = k.renderer ||
	function(m) {
		return m
	};
	var l = [];
	var c = b;
	var d;
	if (a && !f) {
		d = h.length - (h.length % a || a)
	}
	return h.map(function(n) {
		var m = ["size_" + j];
		if (a && c % a == a - 1) {
			m.push("last")
		}
		if (d !== undefined && c >= d) {
			m.push("last_row")
		}++c;
		return createNode("li", {
			className : m.join(" ")
		}, null, g(n, {
			size : j
		}))
	})
};
UI.layoutColumns = function(a, b) {
	b = b || {};
	b.renderer = b.renderer || UI.renderItem;
	b.columns = b.columns || 1;
	b.className = b.className || "";
	var d = Math.floor(100 / b.columns) + "%";
	a = a.sortColumns(b.columns);
	var c = 0;
	return createNode("ul", {
		className : "layout_columns " + b.className
	}, null, a.map(function(g) {
		var f = c++ % b.columns == b.columns - 1 ? "last" : "";
		return createNode("li", {
			className : f
		}, {
			width : d
		}, b.renderer(g, b))
	}))
};
UI.layoutColumnsTable = function(a, b) {
	b = b || {};
	b.renderer = b.renderer || UI.renderItem;
	b.columns = b.columns || 1;
	b.className = b.className || "";
	a = a.sortColumns(b.columns);
	var f = createNode("table", {
		cellspacing : 0,
		cellpadding : 0,
		border : 0,
		className : b.className
	});
	var d = f.appendChild(createNode("tbody"));
	var c = 0;
	var g;
	while (a.length) {
		if (c++ % b.columns === 0) {
			g = d.appendChild(createNode("tr"))
		}
		g.appendChild(createNode("td", null, null, b.renderer(a.shift(), b)))
	}
	return f
};
UI.renderItem = function(c, a) {
	var g;
	var b = [];
	if (a.size) {
		g = UI.sizeMap[a.size].dim;
		b.push("img_size_" + a.size)
	}
	if (a.className) {
		b.push(a.className)
	}
	var f = createNode("img", {
		id : a.id || "",
		src : c.imgurl,
		className : b.join(" "),
		width : g || c.imgw,
		height : g || c.imgh,
		title : c.title_attr || c.title || "",
		alt : c.alt || c.title,
		trackelement : c.trackelement
	});
	if (c.clickurl) {
		var d = {
			trackcontext : "image",
			oid : a.oid || "",
			className : a.linkClass || "",
			target : a.target || "",
			href : c.clickurl
		};
		if (a.rel) {
			d.rel = a.rel
		}
		if (!c.linkInternal && isAbsURL(c.clickurl) && !isPolyvoreURL(c.clickurl)) {
			if (c.actual_bid_token) {
				d.cpc = c.actual_bid_token
			}
			d.paidurl = c.paid_url;
			d.orighost = c.displayurl;
			d.oid = d.oid || Track.classAndId("thing", c.thing_id);
			f = outboundLink(d, null, f)
		} else {
			f = createNode("a", d, null, f)
		}
	}
	return f
};
UI.box = function(d, c) {
	var a = d.attributes || {};
	a.className = "box " + (a.className || "");
	var b = d.header_attributes || {};
	b.className = "hd " + (b.className || "");
	var j = d.body_attributes || {};
	j.className = "bd " + (j.className || "");
	var f = createNode("div", a);
	var h = createNode("div", b);
	if (d.header) {
		h.appendChild(createNode("h3", null, null, d.header))
	}
	if (d.actions) {
		UI.renderActions(d.actions, {
			className : "inline"
		})
	}
	f.appendChild(h);
	var g = createNode("div", j, null, c);
	f.appendChild(g);
	return f
};
UI.moreFans = function(b) {
	b = b || {};
	var a = $(b.container);
	var c = $(b.actuator);
	Event.addListener(c, "click", function(j) {
		var l = b.n;
		var f = b.size;
		var h = UI.sizeMap[f].dim;
		var k = function(m) {
			m.title = loc("{user} liked this {ago} ago.", {
				user : m.user_name,
				ago : duration(m.age)
			});
			m.alt = m.user_name;
			return UI.renderItem(m, {
				id : m.domid || "",
				size : f
			})
		};
		var d = [];
		var g = new AutoPaginator(b.action, {
			id : b.object_id,
			length : 200,
			page : 0
		}, {
			scrollbottomNode : a,
			attachNode : a,
			disableUrlRewrite : true,
			onNext : function(m) {
				var o = m.items.filter(function(q) {
					q.domid = ["fan", q.id || q.age].join("");
					return !$(q.domid) && !d.contains(q)
				});
				o.unshift.apply(o, d);
				if (m.more_pages) {
					var p = o.length % l;
					d = o.splice(o.length - p, p)
				}
				var n = UI.layoutNBody(o, {
					no_last_row : m.more_pages,
					n : l,
					size : f,
					renderer : k
				});
				n.forEach(function(q) {
					a.appendChild(q)
				});
				if (nodeXY(a).y + Dim.fromNode(a).h < scrollXY().y + getWindowSize().h) {
					yield(this.next, this)
				}
			}
		});
		g.next();
		domRemoveNode(c);
		return Event.stop(j)
	})
};
UI.renderSubnav = function(a) {
	a = a || {};
	a.id = a.id || Dom.uniqueId("subnav");
	a.className = a.className || "";
	a.linkClassName = a.linkClassName || "";
	a.openDelay = a.openDelay === undefined ? 100 : a.openDelay;
	a.label = a.label || "";
	a.url = a.url || "";
	a.arrow = a.arrow || false;
	if (a.arrow) {
		a.linkClassName += " mod_arrow down"
	}
	var c;
	if (a.url) {
		c = createNode("a", {
			href : a.url,
			className : a.linkClassName
		}, null, a.label)
	} else {
		c = createNode("span", {
			className : a.linkClassName
		}, null, a.label)
	}
	var b = createNode("div", {
		id : a.id,
		className : "mod_subnav " + a.className
	}, null, [c, UI.renderSubnavBody(a)]);
	if (a.openDelay) {
		DropDownMenu.initSubnav(b, a.openDelay)
	}
	return b
};
UI.renderSubnavBody = function(a) {
	a = a || {};
	a.dock = a.dock || "bl";
	a.subnav = a.subnav || [];
	return createNode("ul", {
		className : "dock_" + a.dock
	}, null, a.subnav.map(function(c) {
		c.className = c.className || "";
		if (c.selected) {
			c.className += " selected"
		}
		var b = createNode("li", {
			className : c.className
		}, null, createNode("a", {
			href : c.url
		}, null, c.label));
		if (c.onClick) {
			Event.addListener(b, "click", c.onClick)
		}
		return b
	}))
};
UI.ln2Br = function(a) {
	return a.replace(/\n/g, "<br>")
};
UI.renderFollowLink = function(g, d, o) {
	var h, a, l, b;
	var k = [];
	var f = [];
	var j = [];
	var m, c, n;
	o = o || {};
	o.actionClass = o.actionClass || "";
	o.noButton = o.noButton || false;
	o.stat = o.stat || "";
	o.emailRender = o.emailRender || 0;
	h = o.followLabel || loc("Follow");
	a = o.followingLabel || loc("Following");
	l = o.unfollowLabel || loc("Unfollow");
	b = buildURL("favorite.add_contact", {
		contact_id : g.id
	});
	if (o.emailRender) {
		if (d) {
			return a
		}
		return createNode("a", {
			href : buildAbsURL(b)
		}, null, h)
	}
	k = [o.actionClass, "follow_action", "clickable"];
	if (d) {
		k.push("following")
	} else {
		k.push("follow")
	}
	c = Dom.uniqueId("follow");
	n = Dom.uniqueId("text");
	m = createNode("span", {
		id : n,
		className : "label"
	}, null, ( d ? a : h));
	j.push(m);
	if (o.sprite) {
		j.unshift(createNode("div", {
			className : "sprite follow"
		}))
	}
	f = UI.renderActionLink({
		actionClass : k.join(" "),
		label : nodes2str(j),
		id : c
	});
	Follow.init(f, {
		user_id : g.id,
		user_name : g.name,
		is_following : d,
		count_node : o.countNodeId || "",
		follower_count : o.followerCount || "",
		rejectNode : o.rejectNodeId || "",
		src_class : o.srcClass,
		src_id : o.srcId,
		action_class : o.actionClass,
		toggle_class : o.toggleClass,
		no_button : o.noButton,
		stat : o.stat,
		contact_list_name : g.contact_list_name,
		follow_label : h,
		following_label : a,
		unfollow_label : l,
		beacon_src : o.beaconSrc,
		beacon_params : o.beaconParams,
		text_node : m
	});
	return f
};
UI.renderActionLink = function(a) {
	var b = a.actionClass || "clickable";
	return createNode("span", {
		id : a.id,
		className : b
	}, null, a.label)
};
window.UI = window.UI || {};
UI.setupRenderMore = function(f) {
	var b = $(f.contentNode);
	var a = $(f.containerNode);
	var d = f.moreOnClick;
	var g;
	if (!b) {
		return
	}
	var c = function() {
		var j = false;
		var m, l, h, k;
		var n = function() {
			addClass(b, "expanded");
			m = getStyle(b, "maxHeight");
			setNode(b, null, {
				maxHeight : "none"
			});
			j = true;
			hide(g)
		};
		if (b.clientHeight === 0 || b.scrollHeight - b.clientHeight < 16) {
			setNode(b, null, {
				maxHeight : "none"
			})
		} else {
			g = createNode("div", {
				className : "tease_more clickable"
			}, {
				display : "none"
			});
			a.appendChild(g);
			l = fromPx(getStyle(b, "line-height"));
			m = fromPx(getStyle(b, "max-height"));
			h = m - l;
			g.innerHTML = loc("more") + "...";
			show(g);
			setNode(b, null, {
				maxHeight : px(h)
			});
			Event.addListener(g, "click", function(o) {
				Event.stop(o);
				n()
			})
		}
	};
	if (b.scrollHeight === 0 && b.clientHeight === 0) {
		Event.addListener(document, "modifiable", c)
	} else {
		c()
	}
};
UI.maybeRenderMore = function(f) {
	var g = $(f.moreNode);
	var b = $(f.contentNode);
	var a = $(f.containerNode);
	var d = f.moreOnClick;
	if (!b) {
		return
	}
	var c = function() {
		var k = false;
		var n, m, j;
		var l;
		var o = function() {
			addClass(b, "expanded");
			n = getStyle(b, "maxHeight");
			setNode(b, null, {
				maxHeight : "none"
			});
			k = true;
			if (f.inplace) {
				g.innerHTML = loc("less") + "..."
			} else {
				hide(g)
			}
		};
		var p = function() {
			setNode(b, null, {
				maxHeight : n
			});
			removeClass(b, "expanded");
			g.innerHTML = loc("more") + "...";
			k = false
		};
		if (b.clientHeight === 0 || b.scrollHeight - b.clientHeight <= 17) {
			setNode(b, null, {
				maxHeight : "none"
			});
			hide(g)
		} else {
			m = fromPx(getStyle(b, "line-height"));
			n = fromPx(getStyle(b, "max-height"));
			j = n - m;
			g.innerHTML = loc("more") + "...";
			show(g);
			setNode(b, null, {
				maxHeight : px(j)
			});
			if (f.inplace) {
				var h = $(f.containerNode);
				setNode(h, null, {
					maxHeight : getStyle(h, "height")
				})
			}
			Event.addListener(g, "click", function(q) {
				Event.stop(q);
				if (d) {
					d()
				} else {
					if (k) {
						p()
					} else {
						o()
					}
				}
			})
		}
	};
	if (b.scrollHeight === 0 && b.clientHeight === 0) {
		Event.addListener(document, "modifiable", c)
	} else {
		c()
	}
};
UI.renderMoreText = function(a) {
	a = a || {};
	style = a.style || {};
	style.maxHeight = px(16 * (a.numLines || 2));
	var f = a.text.split("\n");
	if (a.escape || a.escape === undefined) {
		f = f.map(escapeHTML)
	}
	f = f.join("<br>");
	var d = createNode("div", {
		className : "tease"
	}, style, f);
	var b = createNode("div", {
		className : "tease_more clickable"
	}, {
		display : "none"
	});
	UI.activateLinks(d);
	var c = createNode("div", {
		className : "tease_container " + (a.className || "")
	}, null, [d, b]);
	if (a.imgNode || a.metaNode) {
		UI.maybeRenderMorePolaroid({
			moreNode : b,
			contentNode : d,
			imgDiv : a.imgNode,
			textDiv : a.metaNode
		})
	} else {
		UI.maybeRenderMore({
			moreNode : b,
			contentNode : d,
			containerNode : c,
			inplace : a.inplace
		})
	}
	return c
};
UI.maybeRenderMorePolaroid = function(g) {
	var f = $(g.moreNode);
	var j = $(g.contentNode);
	var o = $(g.imgDiv);
	var h = $(g.textDiv);
	var m;
	var l;
	var b;
	var a;
	var k;
	var d = true;
	var c = new Animation({
		duration : 250,
		renderer : function(q) {
			if (d) {
				q = 1 - q
			}
			var p = m + q * (l - m);
			setNode(o, null, {
				height : px(p)
			});
			setNode(h, null, {
				height : px(b - p - a)
			})
		}
	});
	var n = function() {
		setNode(o, null, {
			overflow : "hidden"
		});
		setNode(h, null, {
			overflow : "hidden"
		});
		var q = Dim.fromNode(h).h;
		m = m || Dim.fromNode(o).h;
		b = b || (q + m);
		var r = Dim.fromNode(j.parentNode).h;
		k = k || getStyle(j, "maxHeight");
		d = !d;
		setNode(j, null, {
			maxHeight : d ? k : "none"
		});
		f.innerHTML = ( d ? loc("more") : loc("less")) + "...";
		var s = Dim.fromNode(j.parentNode).h;
		var p = q + (s - r);
		l = l === undefined ? Math.max(m - (p - q), 0) : l;
		a = a || (q - getElementInnerDim(h).h);
		c.run();
		Event.addListener(c, "done", function() {
			setNode(h, null, {
				overflowY : "auto"
			});
			Event.trigger(h, "expanded")
		});
		c.run()
	};
	UI.maybeRenderMore({
		moreNode : f,
		contentNode : j,
		moreOnClick : n
	})
};
function FilterUI(a) {
	this.filter = a;
	this.node = null
}
FilterUI.prototype.value = function() {
	return this.filter.value
};
FilterUI.prototype.getNode = function() {
	return this.node
};
FilterUI.prototype.destruct = FilterUI.prototype.refresh = noop;
FilterUI.factory = function(c, b, a) {
	a = a || {};
	switch(c) {
		case"colorpicker":
			return new ColorPicker(b, a);
		case"dropdown":
			return new DropDownList(b, a);
		case"filterdropdown":
			return new FilterDropDown(b, a);
		case"searchbox":
			return new SearchBox(b);
		case"breadcrumb":
			return new BreadCrumb(b, a);
		case"pagination":
			return new Pagination(b, a);
		case"footerpagination":
			return new FooterPagination(b, a);
		case"taxonomytree":
			return new TaxonomyTreeDropDown(b, a);
		case"refinementcontrol":
			return new FilterRefinementControl(b, a);
		case"pricepicker":
			return new PricePicker(b, a);
		default:
			return null
	}
};
function Button(a) {
	this.node = a
}extend(Button, FilterUI);
Button.prototype.destruct = function() {
	Event.removeListener(this.node, "click", this._triggerClick, this)
};
Button.prototype.attach = function(a) {
	a.appendChild(this.node);
	Event.addListener(this.node, "click", this._triggerClick, this);
	return this.node
};
Button.prototype._triggerClick = function() {
	Event.trigger(this, "click")
};
Button.prototype.value = function() {
	return null
};
var DropDownItemHelper = function() {
	var b = ['<a href="#foo">', "", ' <span class="count">(', "", ")</span></a>"];
	function a(j, h) {
		return h.count - j.count
	}

	function f(j, h) {
		return j.value.toLowerCase() > h.value.toLowerCase() ? 1 : (j.value.toLowerCase() < h.value.toLowerCase() ? -1 : 0)
	}

	function g(j, h) {
		return j.value > h.value ? 1 : (j.value < h.value ? -1 : 0)
	}

	function c(j, h) {
		return g(h, j)
	}

	function d(j, h) {
		return j.label > h.label ? 1 : (j.label < h.label ? -1 : 0)
	}
	return {
		renderPlain : function(j) {
			var h = j.label || j.value;
			return createNode("li", {
				title : h
			}, null, '<a href="#foo">' + h + "</a>")
		},
		renderCount : function(h) {
			b[1] = h.label || h.value;
			b[3] = h.count;
			return createNode("li", null, null, b.join(""))
		},
		renderHostWithCount : function(j) {
			var h = j.label || j.value;
			if (Browser.type("Firefox")) {
				b[1] = h.replace(/\./g, '<span class="zerospace"> </span>.')
			} else {
				b[1] = h
			}
			b[3] = j.count;
			return createNode("li", null, null, b.join(""))
		},
		renderColorTextBox : function(h) {
			if (h.value) {
				return createNode("div", {
					className : "color"
				}, {
					backgroundColor : h.value
				})
			} else {
				return "All colors"
			}
		},
		sortCountDesc : function(h) {
			h.sort(a)
		},
		sortValueAsc : function(h) {
			h.sort(g)
		},
		sortValueAscCaseInsensitive : function(h) {
			h.sort(f)
		},
		sortValueDesc : function(h) {
			h.sort(c)
		},
		sortLabelAsc : function(h) {
			h.sort(d)
		}
	}
}();
function DropDownList(b, a) {
	DropDownList.superclass.constructor.call(this, b);
	Event.addListener(b, "update", this.refresh, this);
	this.textWidth = a.textWidth;
	this.width = a.width;
	this.height = a.height;
	this.columns = a.columns;
	this.caption = a.caption;
	this.renderCaption = a.renderCaption;
	this.itemRenderer = a.renderer ? a.renderer : DropDownItemHelper.renderPlain;
	this.textBoxRenderer = a.textBoxRenderer;
	this.showing = false;
	this.sortby = a.sortby;
	this.enabled = true
}extend(DropDownList, FilterUI);
DropDownList.prototype.buildUI = function() {
	var b = createNode("table", {
		className : "dropdowntext",
		cellPadding : "0",
		cellSpacing : "0"
	});
	var a = b.appendChild(createNode("tbody")).appendChild(createNode("tr"));
	this.input = a.appendChild(createNode("td", {
		className : "ddt_td"
	})).appendChild(createNode("input", {
		type : "text",
		readOnly : true,
		title : this.caption,
		className : "ddt_input"
	}));
	a.appendChild(createNode("td", {
		className : "arrow"
	})).appendChild(createNode("div", {
		className : "downarrow"
	}));
	if (this.textWidth) {
		setNode(b, null, {
			width : px(this.textWidth + 22)
		})
	}
	Event.addListener(b, "mousedown", this.onAnchorMouseDown, this);
	this.anchor = b;
	if (!this.renderCaption) {
		return b
	} else {
		var d = createNode("table", {
			cellPadding : "0",
			cellSpacing : "0"
		});
		var c = d.appendChild(createNode("tbody")).appendChild(createNode("tr"));
		c.appendChild(createNode("td", null, {
			width : "auto"
		}, createNode("span", {
			className : "caption"
		}, null, this.caption)));
		c.appendChild(createNode("td", null, {
			width : "auto"
		}, b));
		return d
	}
};
DropDownList.prototype.onAnchorMouseDown = function(a) {
	if (this.enabled) {
		if (this.clearOnly) {
			if (Event.getSource(a) != this.input) {
				this.select(-1)
			}
		} else {
			this.show()
		}
	}
	return Event.stop(a)
};
DropDownList.prototype.attach = function(a) {
	clearNode(a);
	this.anchor = a;
	var c = this.buildUI();
	a.appendChild(c);
	Event.addListener(UI.whiteblock(), "click", this.hide, this);
	this.node = createNode("div", {
		className : "dropdown"
	}, {
		display : "none"
	});
	document.body.appendChild(this.node);
	var f;
	if (this.sortby) {
		var b = createNode("div", {
			className : "sortby"
		}, null, loc("Sort by") + ": ");
		this.node.appendChild(b);
		var d = createNode("ul");
		b.appendChild(d);
		f = true;
		this.sortby.forEach(function(h) {
			var g = createNode("li", null, null, h.label);
			g._sorted = h.byDefault;
			if (g._sorted) {
				this.sortedBy = g;
				addClass(g, "sorted")
			}
			if (f) {
				f = false
			} else {
				d.appendChild(createNode("span", null, null, " | "))
			}
			d.appendChild(g);
			Event.addListener(g, "click", function(j) {
				if (g._sorted) {
					return
				}
				if (this.sortedBy) {
					this.sortedBy._sorted = false;
					removeClass(this.sortedBy, "sorted")
				}
				g._sorted = true;
				addClass(g, "sorted");
				this.sortedBy = g;
				this.filter.sort(h.sorter)
			}, this)
		}, this)
	}
	Event.addListener(this.filter, "update", function() {
		if (!this.filter.options.length && !this.filter.value) {
			this.disable()
		} else {
			this.enable()
		}
	}, this);
	addClass(this.node, "bd");
	if (this.width) {
		setNode(this.node, null, {
			width : px(this.width)
		})
	}
	this.refresh(false);
	return c
};
DropDownList.prototype.clear = function() {
	this.items = [];
	domRemoveDescendants(this.node, false);
	setNode(this.node, null, {
		maxWidth : "none",
		minWidth : 0
	})
};
DropDownList.prototype.destruct = function() {
	this.hide();
	this.clear();
	purge(this.node);
	domRemoveNode(this.node, false);
	Event.removeListener(UI.whiteblock(), "click", this.hide, this);
	Event.removeListener(this.anchor, "click", this.show, this);
	clearNode(this.anchor);
	this.anchor = null;
	this.node = null
};
DropDownList.prototype.refresh = function() {
	if (!this.filter.enabled) {
		return
	}
	this.clear();
	this.render();
	this.select(this.filter.selectedIdx)
};
DropDownList.prototype.render = function() {
	var f = Math.floor(100 / this.columns);
	var a = Math.ceil(this.filter.size() / this.columns);
	var c = null;
	var d = 0;
	var b = [];
	this.filter.options.forEach(function(h) {
		if (d % a === 0) {
			c = createNode("ul", {
				className : "column"
			});
			b.push(c);
			this.node.appendChild(c)
		}
		var g = this.itemRenderer.call(this, h);
		if (h.selected) {
			setNode(g, {
				className : "selected"
			})
		}
		g._data = h;
		this.items.push(g);
		c.appendChild(g);
		d++
	}, this);
	this._adjustDimensions(b)
};
DropDownList.prototype._adjustDimensions = function(a) {
	document.body.appendChild(this.node);
	if (!this.showing) {
		setNode(this.node, null, {
			visibility : "hidden",
			display : "block"
		})
	} else {
		setNode(this.node, null, {
			display : "block"
		})
	}
	var c;
	if (!this.width && Browser.isIE) {
		this.maxWidth = Dim.fromNode(this.node).w;
		c = {
			width : "50000px"
		}
	} else {
		c = {
			width : String(Math.floor(100 / a.length)) + "%"
		}
	}
	a.forEach(function(d) {
		setNode(d, null, c)
	});
	setNode(this.node, null, {
		height : "auto",
		visibility : this.height ? "hidden" : "visible"
	});
	if (this.height) {
		if (Dim.fromNode(this.node).h > this.height) {
			setNode(this.node, null, {
				height : px(this.height)
			});
			if (Browser.isIE && this.width) {
				var b = Math.floor((this.width - getScrollbarWidth()) / this.columns);
				a.forEach(function(d) {
					setNode(d, null, {
						width : px(b)
					})
				})
			}
		}
		setNode(this.node, null, {
			visibility : "visible"
		})
	}
	if (!this.showing) {
		setNode(this.node, null, {
			visibility : "visible",
			display : "none"
		})
	}
};
DropDownList.prototype.getDisplayText = function(a) {
	a = a || this.filter.selected();
	if (!a) {
		return ""
	}
	var b;
	if (this.textBoxRenderer) {
		b = this.textBoxRenderer.call(this, a)
	} else {
		b = a.label || a.value
	}
	return b
};
DropDownList.prototype.updateValue = function(a) {
	if (a.idx < 0) {
		addClass(this.input, "input_hint");
		removeClass(this.input, "selected")
	} else {
		addClass(this.input, "selected");
		removeClass(this.input, "input_hint")
	}
	this.input.value = this.getDisplayText(a) || null
};
DropDownList.prototype.position = function() {
	var c = nodeXY(this.anchor);
	var b = scrollXY();
	var d = Dim.fromNode(this.anchor);
	var h = c.y + d.h;
	var g = c.x;
	setNode(this.node, null, {
		display : "block",
		visibility : "hidden",
		top : px(h),
		left : 0
	});
	var f = Dim.fromNode(this.node);
	var a = getWindowSize();
	if (h + f.h > a.h + b.y && h > f.h + d.h) {
		h = h - d.h - f.h
	}
	if (g + f.w > a.w + b.x && g > f.w - d.w) {
		g = g + d.w - f.w
	}
	setNode(this.node, null, {
		visibility : "visible",
		top : px(h),
		left : px(g),
		position : isDescendantOfFixed(this.anchor) ? "fixed" : ""
	})
};
DropDownList.prototype.show = function() {
	if (Browser.type("IE", 0, 6)) {
		var a = document.body;
		this._bodyHeight = getStyle(a, "height");
		setNode(a, null, {
			height : "100%"
		})
	}
	if (!this.width) {
		var c = Dim.fromNode(this.anchor).w;
		if (Browser.type("IE", 0, 6)) {
			setNode(this.node, null, {
				width : px(c + 10)
			})
		} else {
			setNode(this.node, null, {
				minWidth : px(c)
			})
		}
	}
	UI.whiteblock(this.node);
	setNode(this.node, null, {
		display : "block"
	});
	var b = this.filter.selected();
	if (!this.filter.isDefaultValue() && b && b.node) {
		scrollDown(this.node, b.node)
	}
	Event.addListener(this.node, "click", this.onClick, this);
	this.position();
	this.showing = true
};
DropDownList.prototype.hide = function() {
	if (!this.showing) {
		return
	}
	if (Browser.type("IE", 0, 6)) {
		var a = document.body;
		setNode(a, null, {
			height : this._bodyHeight
		})
	}
	this.showing = false;
	Event.removeListener(this.node, "click", this.onClick, this);
	setNode(this.node, null, {
		display : "none"
	})
};
DropDownList.prototype.onClick = function(a) {
	var b = Event.getSource(a);
	while (b && (b != this.node)) {
		if (b._data) {
			Event.stop(a);
			return this.select(b._data.idx)
		}
		b = b.parentNode
	}
};
DropDownList.prototype.select = function(a) {
	this.hide();
	UI.hideWhiteblock();
	var c = this.filter;
	var d = c.get(a);
	var b = c.selectedIdx;
	if (b > -1 && this.items[b]) {
		removeClass(this.items[b], "selected")
	}
	if (a > -1) {
		addClass(this.items[a], "selected");
		if (this.filter.requiresClear) {
			addClass(this.anchor, "clearonly");
			this.clearOnly = true
		}
	} else {
		if (this.clearOnly) {
			removeClass(this.anchor, "clearonly");
			this.clearOnly = false
		}
	}
	c.select(a);
	if (d) {
		this.updateValue(d)
	}
};
DropDownList.prototype.enable = function() {
	this.enabled = true;
	removeClass(this.anchor, "disabled")
};
DropDownList.prototype.disable = function() {
	this.enabled = false;
	addClass(this.anchor, "disabled")
};
function ColorPicker(b, a) {
	ColorPicker.superclass.constructor.call(this, b, a);
	this.clearSelection = a.clearSelection;
	this.paletteNodes = {};
	this.renderAsLinks = a.renderAsLinks
}extend(ColorPicker, DropDownList);
ColorPicker.prototype.select = function(a) {
	if (this.paletteNodes[this.filter.value]) {
		removeClass(this.paletteNodes[this.filter.value], "glow")
	}
	ColorPicker.superclass.select.call(this, a);
	if (this.paletteNodes[this.filter.value]) {
		addClass(this.paletteNodes[this.filter.value], "glow")
	}
};
ColorPicker.prototype.buildUI = function() {
	var c = createNode("table", {
		cellPadding : "0",
		cellSpacing : "0",
		className : "colorpicker"
	});
	var a = c.appendChild(createNode("tbody"));
	var d = a.appendChild(createNode("tr"));
	var f = d.appendChild(createNode("td", null, {
		padding : "0px"
	}));
	var b = createNode("span", {
		className : "colorgrid"
	});
	this.input = b.appendChild(createNode("input", {
		type : "text",
		readOnly : true,
		title : this.caption,
		className : "empty"
	}));
	f.appendChild(b);
	f = d.appendChild(createNode("td", null, {
		padding : "0px"
	}));
	f.appendChild(createNode("div", {
		className : "arrow"
	})).appendChild(createNode("div", {
		className : "downarrow"
	}));
	Event.addListener(c, "mousedown", this.onAnchorMouseDown, this);
	return c
};
ColorPicker.prototype.updateValue = function(a) {
	if (a.value) {
		setNode(this.input, null, {
			backgroundColor : a.value,
			color : a.value
		});
		removeClass(this.input, "empty")
	} else {
		setNode(this.input, null, {
			backgroundColor : "transparent",
			color : "black"
		});
		addClass(this.input, "empty")
	}
};
ColorPicker.COLOR_PALETTE = [["#660000", "#de6318", "#d3d100", "#8c8c00", "#293206", "#34e3e5", "#205260", "#1c0946", "#46008c", "#33151a", "#e30e5c", "#3d1f00", "#5e1800", "#000000"], ["#980000", "#ff7f00", "#ffff00", "#88ba41", "#006700", "#65f3c9", "#318c8c", "#31318c", "#5e318c", "#520f41", "#ff59ac", "#8c5e31", "#8c4600", "#505050"], ["#ff0000", "#ffa000", "#eed54f", "#778c62", "#00ae00", "#77f6a7", "#628c8c", "#4a73bd", "#77628c", "#840e47", "#ef8cae", "#8e7032", "#d1b45b", "#828283"], ["#e32636", "#ffc549", "#ffff6d", "#8c8c62", "#00ff00", "#b2ffff", "#62778c", "#589ad5", "#ac59ff", "#8c6277", "#ead0cd", "#8c7762", "#e2db9a", "#b5b5b6"], ["#fa624d", "#ffc898", "#ffffae", "#96d28a", "#a9ff00", "#d8ffb2", "#bdd6bd", "#a1c4e9", "#a297e9", "#c6a5b6", "#ffdfef", "#c69c7b", "#ffffff", "#e7e7e7"]];
ColorPicker.COLOR_LIST = null;
ColorPicker.getColorList = function() {
	if (ColorPicker.COLOR_LIST) {
		return ColorPicker.COLOR_LIST
	}
	ColorPicker.COLOR_LIST = [];
	ColorPicker.COLOR_PALETTE.forEach(function(a) {
		a.forEach(function(b) {
			ColorPicker.COLOR_LIST.push({
				value : b
			})
		})
	});
	return ColorPicker.COLOR_LIST
};
ColorPicker.prototype.render = function() {
	if (!this.node) {
		return
	}
	var b = {};
	this.filter.options.forEach(function(d) {
		if (d.value) {
			b[d.value] = d
		}
	});
	var a = this.node.appendChild(createNode("div", {
		className : "color_grid"
	}));
	this.paletteNodes = {};
	ColorPicker.COLOR_PALETTE.forEach(function(d) {
		d.forEach(function(f) {
			var g;
			var h = b[f];
			if (h) {
				if (this.renderAsLinks) {
					g = createNode("a", {
						className : "color_block clickable",
						href : h.clickurl
					}, {
						backgroundColor : f
					}, "&nbsp")
				} else {
					g = createNode("div", {
						className : "color_block clickable"
					}, {
						backgroundColor : f
					});
					g._data = h
				}
				this.paletteNodes[f] = g
			} else {
				g = createNode("div", {
					className : "color_empty"
				}, null, "&times;")
			}
			a.appendChild(g)
		}, this)
	}, this);
	a.appendChild(createNode("br", {
		className : "clear"
	}));
	if (this.paletteNodes[this.filter.value]) {
		addClass(this.paletteNodes[this.filter.value], "glow")
	}
	if (this.clearSelection) {
		var c = a.appendChild(createNode("span", {
			className : "clickable right"
		}, null, this.clearSelection));
		if (!this.renderAsLinks) {
			c._data = {
				idx : -1
			}
		}
	}
};
function Pagination(b, a) {
	this._source = a.source;
	this.cleaner = new Cleaner();
	this.enabled = true;
	this.cleaner.push(Event.addListener(this._source, "loaded", function() {
		if (!this._page) {
			return
		}
		if (this._source.atFirstPage() && this._source.atLastPage()) {
			this.hide()
		} else {
			this.show()
		}
		if (this._source.atFirstPage() || !this._source.size()) {
			addClass(this._prev, "disabled")
		} else {
			removeClass(this._prev, "disabled")
		}
		if (this._source.atLastPage()) {
			addClass(this._next, "disabled")
		} else {
			removeClass(this._next, "disabled")
		}
		this._page.value = this._source.page;
		if (this._maxpage && this._source.numPages) {
			setNode(this._maxpage, null, null, "/ " + this._source.numPages)
		}
	}, this))
}extend(Pagination, FilterUI);
Pagination.prototype.destruct = function() {
	this.cleaner.clean();
	delayedClearNode(this.node, false)
};
Pagination.prototype.attach = function(d) {
	this.node = createNode("table", {
		className : "pagination_compact",
		cellPadding : "0",
		cellSpacing : "0"
	});
	var a = d.appendChild(this.node).appendChild(createNode("tbody")).appendChild(createNode("tr"));
	this._prev = createNode("span", {
		className : "prev disabled"
	});
	var c = this._prev;
	a.appendChild(createNode("td", {
		align : "right",
		className : "component"
	}, null, c));
	this.cleaner.push(Event.addListener(c, "click", function() {
		if (this.enabled && !hasClass(this._prev, "disabled")) {
			this._source.prev()
		}
	}, this));
	this.cleaner.push(Event.addListener(c, "mousedown", function(f) {
		return Event.stop(f)
	}, this));
	this._page = a.appendChild(createNode("td", {
		className : "component page_input"
	})).appendChild(this._createPaginationForm());
	this._page = this._page[0];
	if (this._source.numPages) {
		this._maxpage = createNode("td", {
			className : "component page_total"
		}, null, "/" + this._source.numPages);
		a.appendChild(this._maxpage)
	}
	this._next = createNode("span", {
		className : "next disabled"
	});
	var b = this._next;
	a.appendChild(createNode("td", {
		className : "component_right"
	}, null, b));
	this.cleaner.push(Event.addListener(b, "click", function(f) {
		if (this.enabled && !hasClass(this._next, "disabled")) {
			this._source.next()
		}
	}, this));
	this.cleaner.push(Event.addListener(b, "mousedown", Event.stop, Event));
	return this.node
};
Pagination.prototype.clear = function() {
};
Pagination.prototype.getDisplayText = function() {
	return this.page
};
Pagination.prototype.enable = function() {
	this.enabled = true;
	removeClass(this.node, "disabled")
};
Pagination.prototype.disable = function() {
	this.enabled = false;
	addClass(this.node, "disabled")
};
Pagination.prototype.show = function() {
	removeClass(this.node, "invisible")
};
Pagination.prototype.hide = function() {
	addClass(this.node, "invisible")
};
Pagination.prototype._createPaginationForm = function() {
	var a = createNode("input", {
		type : "text",
		value : this._source.page,
		maxLength : 3,
		className : "page_num"
	});
	var d = createNode("form", null, null, a);
	var b = a.value;
	var c = function(f) {
		if (!this.enabled) {
			return Event.stop(f)
		}
		if (!this._source.gotoPage(a.value)) {
			a.value = b;
			Event.stop(f);
			return false
		} else {
			b = a.value;
			Event.stop(f);
			return true
		}
	};
	this.cleaner.push(Event.addListener(a, "change", c, this));
	this.cleaner.push(Event.addListener(d, "submit", c, this));
	return d
};
function FooterPagination(b, a) {
	this._source = a.source;
	this.cleaner = new Cleaner();
	this.enabled = true;
	this.cleaner.push(Event.addListener(this._source, "loaded", function() {
		if (this._source.atFirstPage() && this._source.atLastPage()) {
			this.hide()
		} else {
			this.show();
			if (this._source.atFirstPage() || this._source.size() === 0) {
				addClass(this._leftPaddle, "disabled")
			} else {
				removeClass(this._leftPaddle, "disabled")
			}
			if (this._source.atLastPage()) {
				addClass(this._rightPaddle, "disabled")
			} else {
				removeClass(this._rightPaddle, "disabled")
			}
			this._updatePageNumbers()
		}
		Event.trigger(this, "paginationVisibilityUpdated")
	}, this))
}extend(FooterPagination, FilterUI);
FooterPagination.prototype.attach = function(b) {
	this.node = createNode("div", {
		className : "footer_pagination unselectable"
	});
	this._pageNumbersNode = createNode("span", {
		className : "page_indices"
	});
	this._leftPaddle = createNode("span", {
		className : "left_paddle btn",
		title : loc("Previous")
	});
	this._rightPaddle = createNode("span", {
		className : "right_paddle btn",
		title : loc("Next")
	}, null, loc("Next"));
	this.cleaner.push(Event.addListener(this.node, "mousedown", Event.stop, Event));
	this.cleaner.push(Event.addListener(this._rightPaddle, "click", function() {
		if (this.enabled && !hasClass(this._rightPaddle, "disabled")) {
			this._source.next()
		}
	}, this));
	this.cleaner.push(Event.addListener(this._leftPaddle, "click", function() {
		if (this.enabled && !hasClass(this._leftPaddle, "disabled")) {
			this._source.prev()
		}
	}, this));
	this.cleaner.push(Event.addListener(this._pageNumbersNode, "click", function(d) {
		if (!this.enabled) {
			return
		}
		var g = Event.getSource(d);
		var f = Number(g.getAttribute("_page"));
		if (f) {
			this._source.gotoPage(f)
		}
	}, this));
	var c = 5;
	for (var a = 0; a < c; ++a) {
		this._pageNumbersNode.appendChild(createNode("span", {
			className : "page_index"
		}))
	}
	this._updatePageNumbers();
	this.node.appendChild(this._leftPaddle);
	this.node.appendChild(this._pageNumbersNode);
	this.node.appendChild(this._rightPaddle);
	b.appendChild(this.node)
};
FooterPagination.prototype._updatePageNumbers = function() {
	if (!this._pageNumbersNode || !this._pageNumbersNode.childNodes) {
		return
	}
	var g = this._source.page;
	var h = this._pageNumbersNode.childNodes.length;
	var c = this._source.atLastPage() ? g : Number.MAX_VALUE;
	var f = Math.max(1, g - Math.floor(h / 2));
	for (var d = 0; d < h; ++d) {
		var a = this._pageNumbersNode.childNodes[d];
		removeClass(a, "selected");
		var b = d + f;
		setNode(a, {
			_page : b
		}, null, b);
		if (b == g) {
			addClass(a, "selected")
		}
		if (b > c) {
			addClass(a, "disabled")
		} else {
			removeClass(a, "disabled")
		}
	}
};
FooterPagination.prototype.destruct = function() {
	this.cleaner.clean();
	delayedClearNode(this.node, true)
};
FooterPagination.prototype.enable = function() {
	this.enabled = true;
	removeClass(this.node, "disabled")
};
FooterPagination.prototype.disable = function() {
	this.enabled = false;
	addClass(this.node, "disabled")
};
FooterPagination.prototype.show = function() {
	removeClass(this.node, "hidden")
};
FooterPagination.prototype.hide = function() {
	addClass(this.node, "hidden")
};
function TaxonomyTreeDropDown(b, a) {
	TaxonomyTreeDropDown.superclass.constructor.call(this, b, a);
	this.roots = a.roots;
	this.taxonomyTree = a.taxonomyTree
}extend(TaxonomyTreeDropDown, DropDownList);
TaxonomyTreeDropDown.prototype._renderNode = function(b, f) {
	var d = b[f];
	if (!d) {
		return null
	}
	var a = this.itemRenderer.call(this, d);
	if (d.selected) {
		setNode(a, {
			className : "selected"
		})
	}
	a._data = d;
	this.items[d.idx] = a;
	addClass(a, "node");
	if (d.kids) {
		var c = a.appendChild(createNode("ul", {
			className : "subtree"
		}));
		d.kids.forEach(function(h) {
			var g = this._renderNode(b, h);
			if (g) {
				c.appendChild(g)
			}
		}, this)
	}
	return a
};
TaxonomyTreeDropDown.prototype.render = function() {
	var a = this.node.appendChild(createNode("ul", {
		className : "column"
	}));
	this.roots.forEach(function(b) {
		a.appendChild(this._renderNode(this.taxonomyTree, b))
	}, this);
	this._adjustDimensions([a])
};
function FilterRefinementControl(b, a) {
	FilterRefinementControl.superclass.constructor.call(this, b, a);
	a.className = this.filter.name;
	this.refinementControl = new RefinementControl(a);
	this.cleaner = new Cleaner();
	Event.addListener(b, "change", this.refresh, this);
	Event.addListener(this.refinementControl, "close", this.filter.clear, this.filter);
	this.setDisplayTexts( a ? a.displayTexts : null)
}extend(FilterRefinementControl, FilterUI);
FilterRefinementControl.prototype.destruct = function() {
	this.cleaner.clean();
	this.refinementControl.destruct()
};
FilterRefinementControl.prototype.attach = function(a) {
	a.appendChild(this.refinementControl.getNode());
	this.refresh()
};
FilterRefinementControl.prototype.getDisplayText = function() {
	var a = this.value();
	if (!a || !this.displayTexts) {
		return a
	}
	return this.displayTexts[a] || a
};
FilterRefinementControl.prototype.refresh = function() {
	var a;
	if (( a = this.refinementControl.getNode())) {
		if (this.filter.isDefaultValue() || !this.filter.enabled) {
			this.refinementControl.hide();
			this.prevParentNode = a.parentNode;
			if (a.parentNode) {
				a.parentNode.removeChild(a)
			}
		} else {
			if (this.prevParentNode) {
				this.prevParentNode.appendChild(a)
			}
			this.refinementControl.typeText = UI.filter2label[this.filter.name];
			this.refinementControl.setValueText(this.getDisplayText());
			this.refinementControl.refresh()
		}
	}
};
FilterRefinementControl.prototype.setDisplayTexts = function(a) {
	if (!a || !a.length || a[0].title === undefined) {
		this.displayTexts = null;
		return
	}
	this.displayTexts = {};
	a.forEach(function(b) {
		this.displayTexts[b.value] = b.title
	}, this)
};
function FilterDropDown(b, a) {
	FilterDropDown.superclass.constructor.call(this, b, a);
	a.items = b.options;
	this.cleaner = new Cleaner();
	this.dropdown = new DropDown(a);
	this.cleaner.push(Event.addListener(this.filter, "update", function() {
		this.dropdown.setItems(this.filter.options);
		this.dropdown.enabled = true;
		this.refresh()
	}, this));
	this.cleaner.push(Event.addListener(this.filter, "nodata", function() {
		this.dropdown.enabled = !this.filter.isDefaultValue();
		this.refresh()
	}, this));
	this.cleaner.push(Event.addListener(this.filter, "change", this.refresh, this));
	this.cleaner.push(Event.addListener(this.dropdown, "change", function(d, c) {
		if (d) {
			this.filter.selectByValue(d.value, function(g, f) {
				return g == f
			})
		} else {
			this.filter.clear()
		}
	}, this));
	this.cleaner.push(Event.addListener(this.dropdown, "clear", this.filter.clear, this.filter));
	this.refresh()
}extend(FilterDropDown, FilterUI);
FilterDropDown.prototype.attach = function(a) {
	a.appendChild(this.dropdown.getNode())
};
FilterDropDown.prototype.destruct = function() {
	this.cleaner.clean();
	if (this.dropdown) {
		this.dropdown.destruct()
	}
};
FilterDropDown.prototype.getDisplayText = function() {
	return this.dropdown.inputValue()
};
FilterDropDown.prototype.refresh = function() {
	this.dropdown.select(this.filter.selected());
	if (this.filter.enabled) {
		this.dropdown.enable()
	} else {
		this.dropdown.disable()
	}
};
FilterDropDown.prototype.disable = function() {
	this.dropdown.disable()
};
FilterDropDown.prototype.enable = function() {
	this.dropdown.enable()
};
function PricePicker(b, a) {
	a.textBoxRenderer = a.textBoxRenderer ||
	function(c) {
		if (!c) {
			return loc("Price")
		}
		return c
	};
	PricePicker.superclass.constructor.call(this, b, a)
}extend(PricePicker, FilterDropDown);
PricePicker.prototype.refresh = function() {
	PricePicker.superclass.refresh.call(this);
	if (this.filter.isDefaultValue()) {
		this.dropdown.clear();
		addClass(this.dropdown.input, "input_hint")
	} else {
		removeClass(this.dropdown.input, "input_hint")
	}
};
function FilterUIManager() {
	this._filterUIs = [];
	this.cleaner = new Cleaner()
}
FilterUIManager.prototype.destruct = function() {
	this.cleaner.clean()
};
FilterUIManager.prototype.getFilterUIs = function() {
	return this._filterUIs
};
FilterUIManager.prototype.addFilterUI = function(a) {
	this._filterUIs.push(a);
	if (a.filter) {
		this.cleaner.push(Event.addListener(a.filter, "change", function() {
			Event.trigger(this, "filterchange")
		}, this));
		Event.addSingleUseListener(a.filter, "update", function() {
			Event.trigger(this, "filterupdate")
		}, this)
	}
};
FilterUIManager.prototype.getLastSetFilter = function() {
	var a = this._filterUIs;
	a.sort(function(d, c) {
		if (d.filter && c.filter) {
			return c.filter.changedOn - d.filter.changedOn
		} else {
			return d.filter ? -1 : 1
		}
	});
	for (var b = 0; b < a.length; b++) {
		if (a[b].value()) {
			return a[b]
		}
	}
	return null
};
function RefinementControl(a) {
	this.cleaner = new Cleaner();
	this.node = createNode("span", {
		className : "refinementcontrol " + (a.className || "")
	});
	this.textNode = this.node.appendChild(createNode("span", {
		className : "left"
	}));
	var b = this.node.appendChild(createNode("span", {
		className : "clickable close left"
	}, null, "x"));
	this.cleaner.push(Event.addListener(b, "click", function(c) {
		Event.trigger(this, "close", c)
	}, this));
	this.typeText = a.typeText;
	this.showType = a.showType;
	this.setValueText(a.valueText, a.valueHTML)
}
RefinementControl.prototype.destruct = function() {
	this.cleaner.clean();
	delayedClearNode(this.node, false)
};
RefinementControl.prototype.setValueText = function(a, b) {
	b = b || escapeHTML(a || "");
	this.valueText = a;
	if (this.typeText && this.showType) {
		this.valueHTML = escapeHTML(this.typeText) + ": " + b
	} else {
		this.valueHTML = b
	}
};
RefinementControl.prototype.getNode = function() {
	return this.node
};
RefinementControl.prototype.refresh = function() {
	if (this.node) {
		setNode(this.node, {
			title : loc("Click to remove {type} filter: {value}", {
				type : this.typeText,
				value : this.valueText
			})
		});
		setNode(this.textNode, null, null, this.valueHTML);
		showInline(this.node)
	}
};
RefinementControl.prototype.hide = function() {
	hide(this.node)
};
function DropDown(d) {
	d = d || {};
	if (Number(d.listWidth)) {
		d.listWidth = px(Number(d.listWidth))
	}
	if (Number(d.textWidth)) {
		d.textWidth = px(Number(d.textWidth))
	}
	d.textWidth = d.textWidth || "100px";
	if (Number(d.listHeight)) {
		d.listHeight = px(Number(d.listHeight))
	}
	this.itemRenderer = d.itemRenderer || Event.wrapper(this.defaultItemRenderer, this);
	this.textBoxRenderer = d.textBoxRenderer || Event.wrapper(this.defaultTextBoxRenderer, this);
	this.titleRenderer = d.titleRenderer || Event.wrapper(this.defaultTitleRenderer, this);
	this.clearable = d.clearable;
	this.listWidth = d.listWidth;
	this.listHeight = d.listHeight;
	this.enabled = d.enabled || d.enabled === undefined;
	this.cleaner = new Cleaner();
	this.dd_class = "";
	this.renderedItems = [];
	var b = d.readOnly || d.readOnly === undefined;
	this.node = createNode("table", {
		className : "dropdown2 " + (d.className || ""),
		title : this.titleRenderer(),
		cellPadding : "0",
		cellSpacing : "0"
	});
	var c = this.node.appendChild(createNode("tbody")).appendChild(createNode("tr"));
	var f = {
		type : "text",
		className : "input"
	};
	if (b) {
		f.readOnly = b
	}
	this.input = c.appendChild(createNode("td")).appendChild(createNode("form")).appendChild(createNode("input", f));
	this.downarrow = c.appendChild(createNode("td", {
		className : "arrow"
	}));
	this.downarrow.appendChild(createNode("div", {
		className : "downarrow"
	}));
	this.clear();
	setNode(this.node, null, {
		width : d.textWidth
	});
	var a = this.node;
	if (!b) {
		a = this.downarrow
	}
	Event.addListener(a, "mousedown", this.onTextboxMouseDown, this);
	this.setItems(d.items)
}
DropDown.prototype.destruct = function() {
	this.closeList();
	this.clearItems();
	Event.removeListener(this.node, "mousedown", this.onTextboxMouseDown, this);
	clearNode(this.node);
	Event.release(this);
	Event.release(this.list);
	domRemoveNode(this.list, false)
};
DropDown.prototype.select = function(b) {
	var c;
	if (b) {
		var a = this.renderedItems.find({
			_data : b
		}, function(f, d) {
			return compare(f._data, d._data)
		});
		if (a >= 0) {
			c = this.renderedItems[a]
		}
	}
	this.selected = b;
	Event.trigger(this, "change", b, c);
	if (this.list) {
		setNode(this.list, null, {
			left : "-5000px"
		})
	}
	yield(this.closeList, this);
	if (this.enabled) {
		removeClass(this.node, "disabled");
		removeClass(this.node, "unselectable")
	} else {
		addClass(this.node, "disabled");
		addClass(this.node, "unselectable")
	}
	this.input.value = this.textBoxRenderer(b);
	setNode(this.node, {
		title : this.titleRenderer(b)
	});
	if (this.prevSelectedNode) {
		removeClass(this.prevSelectedNode, "selected2")
	}
	if (c) {
		this.prevSelectedNode = c;
		addClass(c, "selected2")
	}
};
DropDown.prototype.clear = function() {
	var a = this.input.value;
	this.input.value = this.textBoxRenderer();
	if (this.clearable) {
		removeClass(this.node, "clear");
		setNode(this.node, {
			title : this.titleRenderer()
		});
		if (a != this.input.value) {
			if (this.prevSelectedNode) {
				removeClass(this.prevSelectedNode, "selected2")
			}
			this.selected = null;
			Event.trigger(this, "clear")
		}
	}
};
DropDown.prototype.inputValue = function() {
	return this.input.value
};
DropDown.prototype.clearItems = function() {
	return this.setItems([])
};
DropDown.prototype.setItems = function(a) {
	var b = this.items;
	this.items = a || [];
	this.reRenderItems = true;
	domRemoveDescendants(this.list, false);
	setNode(this.list, null, {
		minWidth : 0
	});
	return b
};
DropDown.prototype.getNode = function() {
	return this.node
};
DropDown.prototype.getValue = function() {
	return this.selected
};
DropDown.prototype.showList = function() {
	if (!this.list) {
		this.list = createNode("div", {
			className : "dropdown dropdownlist " + this.dd_class
		}, {
			display : "none"
		});
		makeUnselectable(this.list);
		Event.addListener(this.list, "click", this.onListClick, this)
	}
	if (this.reRenderItems) {
		delayedClearNode(this.list);
		this.renderedItems = [];
		var a = this.list.appendChild(createNode("ul", {
			className : "column"
		}));
		this.items.forEach(function(c) {
			var b = this.itemRenderer(c);
			b._data = c;
			if (this.selected == c) {
				this.prevSelectedNode = b;
				addClass(b, "selected2")
			}
			this.renderedItems.push(b);
			addList(a, b)
		}, this);
		this.reRenderItems = false
	}
	this._adjustDimensionsAndPositionList();
	if (this.prevSelectedNode) {
		this.list.scrollTop = scrollToMiddle(this.prevSelectedNode.parentNode, this.list)
	}
	UI.whiteblock(this.list)
};
DropDown.prototype.closeList = UI.hideWhiteblock;
DropDown.prototype.onTextboxMouseDown = function(a) {
	if (this.enabled) {
		if (this.clearable && hasClass(this.node, "clear")) {
			var b = Event.getSource(a);
			while (b) {
				if (b == this.downarrow) {
					this.clear();
					break
				}
				b = b.parentNode
			}
		} else {
			this.showList()
		}
	}
	return Event.stop(a)
};
DropDown.prototype.onListClick = function(a) {
	if (this.enabled) {
		var b = Event.getSource(a);
		while (b && (b != this.list)) {
			if (b._data) {
				if (this.clearable) {
					addClass(this.node, "clear")
				}
				this.select(b._data);
				return Event.stop(a)
			} else {
				if (b.tagName == "A") {
					return
				}
			}
			b = b.parentNode
		}
	}
	return Event.stop(a)
};
DropDown.prototype.enable = function() {
	this.enabled = true;
	removeClass(this.node, "disabled");
	enable(this.input)
};
DropDown.prototype.disable = function() {
	this.enabled = false;
	addClass(this.node, "disabled");
	disable(this.input)
};
DropDown.prototype._adjustDimensionsAndPositionList = function() {
	setNode(this.list, null, {
		visibility : "hidden",
		display : "block"
	});
	if (this.list.parentNode != document.body) {
		document.body.appendChild(this.list)
	}
	var a = {
		maxHeight : this.listHeight
	};
	var d;
	if (this.listWidth == "textbox") {
		a.width = px(Dim.fromNode(this.node).w);
		a.overflow = "hidden";
		d = "100%"
	} else {
		if (/(\+|-)?[0-9.]+(%|px)?/.test(this.listWidth)) {
			a.width = this.listWidth;
			a.overflow = "hidden";
			d = "100%"
		} else {
			delete this.listWidth;
			a.minWidth = px(Dim.fromNode(this.node).w);
			setNode(this.list.childNodes[0], null, {
				minWidth : a.minWidth
			});
			a.overflow = "";
			d = "auto"
		}
	}
	var g = ((this.list||{}).childNodes||[])[0];
	if (g) {
		setNode(this.list.childNodes[0], null, {
			width : d
		})
	}
	setNode(this.list, null, a);
	if (!this.listWidth && Browser.isIE) {
		editCSSRule(".dropdown .column li a", {
			width : null
		});
		var b = Dim.fromNode(this.list.childNodes[0]).w;
		editCSSRule(".dropdown .column li a", {
			width : px(b - 4)
		})
	}
	var m = nodeXY(this.node);
	var k = scrollXY();
	var l = Dim.fromNode(this.node);
	var j = m.y + l.h;
	var f = m.x;
	var h = Dim.fromNode(this.list);
	var c = getWindowSize();
	if (j + h.h > c.h + k.y && j > h.h + l.h) {
		j = j - l.h - h.h
	}
	if (f + h.w > c.w + k.x && f > h.w - l.w) {
		f = f + l.w - h.w
	}
	setNode(this.list, null, {
		top : px(j),
		left : px(f),
		position : isDescendantOfFixed(this.node) ? "fixed" : ""
	})
};
DropDown.prototype.defaultItemRenderer = function(b) {
	var a = b.label || b.value;
	return createNode("a", {
		href : "#foo"
	}, null, a)
};
DropDown.prototype.defaultTextBoxRenderer = function(a) {
	var b = a ? a.title || a.label || a.value || "" : "";
	if (b) {
		addClass(this.input, "has_value")
	} else {
		removeClass(this.input, "has_value")
	}
	return b
};
DropDown.prototype.defaultTitleRenderer = function(a) {
	return a ? a.title || a.label || a.value : ""
};
function FontPicker(a) {
	this.addPaddingForScrollBar = true;
	FontPicker.superclass.constructor.call(this, a);
	this.dd_class = "fontpicker"
}extend(FontPicker, DropDown);
FontPicker.prototype.defaultItemRenderer = function(b) {
	var a = 16 - 2;
	return createNode("a", {
		title : b.title || "",
		href : "#foo"
	}, {
		height : px(a)
	}, createNode("img", {
		src : buildImgURL("img-text.list", {
			font_id : b.font_id,
			height : a,
			".out" : "png"
		})
	}))
};
FontPicker.prototype.defaultTextBoxRenderer = function(c) {
	if (c) {
		var a = 16 - 2;
		var b = buildImgURL("img-text.list", {
			font_id : c.font_id,
			height : a,
			".out" : "png"
		});
		setNode(this.input, null, {
			background : "white url(" + b + ") no-repeat 4px 50%"
		})
	} else {
		setNode(this.input, null, {
			background : "white"
		})
	}
	return ""
};
function ComboDropDown(a) {
	this.ds = new MemDataSource();
	this.ds.patricia = new Patricia();
	a = a || {};
	a.readOnly = false;
	this.item2display = a.item2display ||
	function(b) {
		return b
	};
	this.display2item = a.display2item ||
	function(b) {
		return b
	};
	ComboDropDown.superclass.constructor.call(this, a);
	this.autocomplete = new AutoComplete(this.input, this.ds, {
		matcher : Event.wrapper(function(c, b) {
			return this.item2display(c).match(b)
		}, this),
		renderer : Event.wrapper(function(c, b) {
			return AutoComplete.highlightText(this.item2display(c), b)
		}, this),
		maxTokens : 1
	});
	Event.addListener(this.input, "blur", function() {
		this.input.value = this.item2display(this.getValue())
	}, this);
	Event.addListener(this.autocomplete, "select", function(b) {
		this.select(this.display2item(b._data))
	}, this);
	Event.addListener(this.input.form, "submit", function(b) {
		var c = this.input.value;
		if (this.ds.patricia.find(c).contains(c)) {
			this.select(this.display2item(c))
		}
		return Event.stop(b)
	}, this);
	Event.addListener(this.input, "click", function(b) {
		this.input.focus();
		this.input.select()
	}, this)
}extend(ComboDropDown, DropDown);
ComboDropDown.prototype.setItems = function(a) {
	this.ds.setData(a);
	this.ds.patricia.clear();
	this.ds.patricia.insert(a.map(this.item2display));
	ComboDropDown.superclass.setItems.call(this, a)
};
ComboDropDown.prototype.defaultItemRenderer = function(a) {
	a = this.item2display(a);
	return createNode("a", {
		title : a,
		href : "#foo"
	}, null, a)
};
ComboDropDown.prototype.defaultTextBoxRenderer = function(a) {
	a = this.item2display(a);
	if (a) {
		addClass(this.input, "has_value")
	} else {
		removeClass(this.input, "has_value")
	}
	return a
};
var NOT_TAGGED = "__NOT_TAGGED__";
var ALL_ITEMS = "__ALL_ITEMS__";
var DEFAULT_TAGS = [ALL_ITEMS, NOT_TAGGED];
function MyTagsPicker(a) {
	a.item2display = function(b) {
		if (b == NOT_TAGGED) {
			return loc("not yet tagged")
		} else {
			if (b == ALL_ITEMS) {
				return loc("all items")
			} else {
				return b
			}
		}
	};
	a.display2item = function(b) {
		if (b == loc("not yet tagged")) {
			return NOT_TAGGED
		} else {
			if (b == loc("all items")) {
				return ALL_ITEMS
			} else {
				return b
			}
		}
	};
	MyTagsPicker.superclass.constructor.call(this, a);
	this.select(ALL_ITEMS)
}extend(MyTagsPicker, ComboDropDown);
MyTagsPicker.prototype.setItems = function(a) {
	a = DEFAULT_TAGS.concat(a || []).uniq();
	MyTagsPicker.superclass.setItems.call(this, a)
};
MyTagsPicker.prototype.defaultTitleRenderer = function() {
	return loc("Show items tagged with:")
};
function Slider(a) {
	a = a || {};
	a.style = a.style || {};
	this.nub = createNode("div", {
		className : "sliderNub"
	});
	this.bar = createNode("div", {
		className : "sliderBar"
	}, null, this.nub);
	this._nubDim = 0;
	a.style.width = a.style.width || px(129);
	this.node = createNode("div", null, a.style, [this.input = createNode("input", {
		name : a.name || ""
	}, {
		display : "none"
	}), this.bar]);
	this.setValue(a.value || 50);
	Event.addListener(this.node, "mousedown", function(b) {
		Event.trigger(this, "beginslide", b);
		this._sliding = true;
		this.prevCursor = document.body.style.cursor;
		document.body.style.cursor = "pointer";
		if (Event.getSource(b) != this.nub) {
			this._setValueFromEvent(b)
		}
		Event.addListener(document, "mousemove", this._onMouseMove, this);
		Event.addListener(document, "mouseup", this._onMouseUp, this);
		return Event.stop(b)
	}, this);
	this._updateNubDim(a.nubDim)
}
Slider.prototype.destruct = function() {
	Event.release(this);
	purge(this.node, true)
};
Slider.prototype._onMouseMove = function(a) {
	if (this._sliding) {
		this._setValueFromEvent(a);
		return Event.stop(a)
	}
};
Slider.prototype._onMouseUp = function(a) {
	if (this._sliding) {
		document.body.style.cursor = this.prevCursor || "auto";
		Event.removeListener(document, "mousemove", this._onMouseMove, this);
		Event.removeListener(document, "mouseup", this._onMouseUp, this);
		Event.trigger(this, "endslide", a);
		this._sliding = false;
		return Event.stop(a)
	}
};
Slider.prototype.nubDim = function() {
	if (!this._nubDim) {
		yield(function() {
			this._updateNubDim(Dim.fromNode(this.nub).w / 2);
			this.redraw()
		}, this)
	}
	return this._nubDim
};
Slider.prototype._updateNubDim = function(a) {
	if (a) {
		this._nubDim = a;
		setNode(this.node, null, {
			paddingTop : px(this._nubDim),
			paddingBottom : px(this._nubDim),
			marginLeft : px(this._nubDim),
			marginRight : px(this._nubDim)
		})
	}
};
Slider.prototype.redraw = function() {
	var a = Dim.fromNode(this.node).w || depx(getStyle(this.node, "width")) || depx(getStyle(this.bar, "width"));
	if (!a) {
		return
	}
	this.nub.style.left = (this.input.value / 100 * a - this.nubDim()) + "px"
};
Slider.prototype.getNode = function() {
	return this.node
};
Slider.prototype.getValue = function(b, a) {
	return this.input.value
};
Slider.prototype.setValue = function(a) {
	a = Math.min(100, Math.max(0, Math.round(a)));
	if (a != this.input.value) {
		this.input.value = a;
		this.redraw();
		return true
	}
	return false
};
Slider.prototype._setValueFromEvent = function(d) {
	var b = Dim.fromNode(this.node).w || 1;
	var g = nodeXY(this.node).x;
	var c = Event.getPageXY(d);
	var a = c.x - g;
	a = Math.min(Math.max(0, a), b);
	var f = Math.round(a / b * 100);
	if (this.setValue(f)) {
		Event.trigger(this, "change", d)
	}
};
Slider.prototype.sliding = function() {
	return this._sliding
};
function WebkitSlider(a) {
	a = a || {};
	this.node = createNode("input", {
		type : "range",
		className : "wk_hslider",
		name : a.name || ""
	}, a.style);
	this.setValue(a.value || 50);
	this._sliding = false;
	Event.addListener(this.node, "mousedown", function(b) {
		Event.trigger(this, "beginslide", b);
		this._sliding = true
	}, this);
	Event.addListener(this.node, "change", function(b) {
		Event.trigger(this, "change", b)
	}, this);
	Event.addListener(this.node, "mouseup", function(b) {
		Event.trigger(this, "endslide", b);
		this._sliding = false
	}, this)
}extend(WebkitSlider, Slider);
WebkitSlider.prototype.destruct = function() {
	Event.release(this);
	purge(this.node, true)
};
WebkitSlider.prototype.getValue = function() {
	return this.node.value
};
WebkitSlider.prototype.setValue = function(a) {
	a = Math.min(100, Math.max(0, Math.round(a)));
	if (a != this.node.value) {
		this.node.value = a;
		return true
	}
	return false
};
WebkitSlider.prototype.redraw = noop;
Slider.create = function(a) {
	if (Browser.layoutEngine("WebKit", 525) && Browser.isMac) {
		return new WebkitSlider(a)
	} else {
		return new Slider(a)
	}
};
function HorizontalSelect(a) {
	this.renderer = a.renderer ||
	function(c, b) {
		return c
	};
	this.label = a.label;
	this.comp = a.comp;
	this.selected = -1;
	this.selectedNode = null;
	this.className = this.className || "hselect";
	this.node = createNode("span", {
		className : [this.className, (a.className || "")].join(" ")
	});
	this.setOptions(a.options)
}
HorizontalSelect.prototype.setOptions = function(a) {
	this.options = a || [];
	this._render()
};
HorizontalSelect.prototype._render = function() {
	clearNode(this.node);
	var b = [];
	this.selectedNode = null;
	var f = function(h) {
		return function(j) {
			if (Event.getSource(j).getAttribute("disabled")) {
				return
			}
			if (h != this.options[this.selected]) {
				this.selectByValue(h);
				Event.trigger(this, "change", this.options[this.selected])
			}
		}
	};
	for (var a = 0; a < this.options.length; ++a) {
		var d = this.options[a];
		var c = this.selected == a;
		var g = createNode("span", {
			className : ( c ? "selected" : ""),
			title : d.title || d.label || "",
			disabled : d.disabled ? true : null
		}, null, this.renderer(d, c));
		g._data = d;
		d.node = g;
		if (c) {
			this.selectedNode = g
		}
		Event.addListener(g, "click", f(d), this);
		b.push(g)
	}
	if (this.label) {
		b.unshift(this.label)
	}
	setNode(this.node, null, null, b)
};
HorizontalSelect.prototype.destruct = function() {
	Event.release(this);
	purge(this.node, true)
};
HorizontalSelect.prototype.getNode = function() {
	return this.node
};
HorizontalSelect.prototype.select = function(c, a) {
	var b = this.options.find(c, a || this.comp);
	return this._selectByIndex(b)
};
HorizontalSelect.prototype.selectFirst = function() {
	return this._selectByIndex(0)
};
HorizontalSelect.prototype.selectByValue = function(a) {
	return this._selectByIndex(this.options.find(a))
};
HorizontalSelect.prototype._selectByIndex = function(a) {
	var b = this.selected;
	this.selected = a;
	if (this.selected != b) {
		if (this.selectedNode) {
			removeClass(this.selectedNode, "selected");
			this.selectedNode = null
		}
		if (this.selected > -1) {
			this.selectedNode = this.options[this.selected].node;
			addClass(this.selectedNode, "selected")
		}
	}
};
HorizontalSelect.prototype.clear = noop;
HorizontalSelect.prototype.getValue = function() {
	return this.options[this.selected]
};
function HorizontalSelectHTML(a) {
	a = a || {};
	this.className = "hselect_html";
	HorizontalSelectHTML.superclass.constructor.call(this, a)
}extend(HorizontalSelectHTML, HorizontalSelect);
function DropDownMenu(items, options) {
	options = options || {};
	this._shown = false;
	this.trackClick = options.trackcontext ? true : false;
	this.node = createNode("div", {
		className : "dropdown bd " + (options.className || ""),
		trackcontext : options.trackcontext
	}, {
		display : "none"
	});
	var ul = this.node.appendChild(createNode("ul", {
		className : "column"
	}, {
		width : "100%"
	}));
	this.items = [];
	var index = 0;
	items.forEach(Event.wrapper(function(item) {
		var curIndex = index;
		var li = ul.appendChild(createNode("li", {
			className : item.className || ""
		}));
		li.appendChild(createNode("a", {
			oid : item.oid,
			href : item.url || "#",
			title : item.alt || ""
		}, null, item.text));
		this.items.push({
			item : item,
			node : li,
			index : curIndex
		});
		if (item.selected) {
			this.selectedIndex = index;
			addClass(li, "defaultSelected")
		}
		Event.addListener(li, "submit", Event.wrapper(function() {
			this.hide();
			if (item.method) {
				item.method.call()
			} else {
				if (item.action) {
					eval("(function() {" + item.action + "})()")
				}
			}
			this.selectedIndex = curIndex;
			Event.trigger(this, "change")
		}, this));
		Event.addListener(li, "click", function(event) {
			Event.trigger(li, "submit");
			if (!item.url) {
				return Event.stop(event)
			}
		});
		Event.addListener(li, "mouseover", Event.wrapper(function() {
			if (this.selectedIndex != curIndex) {
				removeClass((this.items[this.selectedIndex] || {}).node, "selected")
			}
		}, this));
		index++
	}, this));
	this.selectedIndex = (this.selectedIndex || this.selectedIndex === 0) ? this.selectedIndex : -1;
	Event.addListener(UI.whiteblock(), "click", this.hide, this);
	Event.addListener(this.node, "click", function(e) {
		this.hide(e)
	}, this);
	if (this.trackClick) {
		Track.trackCTR(this.node, options.trackclass, {
			clicksOnly : 1
		})
	}
	Event.addListener(document, "keydown", this.onKeyDown, this)
}
DropDownMenu.prototype.destruct = function() {
	clearNode(this.node, true);
	Event.removeListener(document, "keydown", this.onKeyDown, this);
	Event.removeListener(UI.whiteblock(), "click", this.hide, this)
};
DropDownMenu.prototype.onKeyDown = function(a) {
	if (!this._shown) {
		return
	}
	var c = a.keyCode;
	var b;
	switch(c) {
		case 13:
			Event.trigger((this.items[this.selectedIndex] || {}).node, "submit");
			b = true;
			break;
		case 27:
			this.hide();
			b = true;
			break;
		case 9:
			if (a.shiftKey) {
				this.selectedIndex--;
				b = true
			} else {
				this.selectedIndex++;
				b = true
			}
			break;
		case 38:
			this.selectedIndex--;
			b = true;
			break;
		case 40:
			this.selectedIndex++;
			b = true;
			break
	}
	if (this.selectedIndex < 0) {
		this.selectedIndex = this.items.length - 1
	}
	if (this.selectedIndex >= this.items.length) {
		this.selectedIndex = 0
	}
	this.redraw();
	if (b) {
		return Event.stop(a)
	}
};
DropDownMenu.prototype.redraw = function() {
	for (var a = 0; a < this.items.length; a++) {
		if (this.selectedIndex == a) {
			addClass(this.items[a].node, "selected")
		} else {
			removeClass(this.items[a].node, "selected")
		}
	}
};
DropDownMenu.prototype.onBlur = function(a) {
	this.hide(a)
};
DropDownMenu.POSITION_BOTTOM_LEFT = 0;
DropDownMenu.POSITION_BOTTOM_RIGHT = 1;
DropDownMenu.prototype.attach = function(b, g, f) {
	var a = nodeXY(b);
	var d = Dim.fromNode(b);
	if (Browser.type("IE", 8, 8)) {
		a.x += 2;
		a.y += 2
	}
	if (!f) {
		f = 0
	}
	g = g || DropDownMenu.POSITION_BOTTOM_LEFT;
	switch(g) {
		case DropDownMenu.POSITION_BOTTOM_LEFT:
			setNode(this.node, null, {
				top : px(a.y + b.offsetHeight - 1),
				left : px(a.x)
			});
			break;
		case DropDownMenu.POSITION_BOTTOM_RIGHT:
			var c = Browser.type("IE", 8, 8) ? document.body.offsetWidth : getWindowSize().w;
			setNode(this.node, null, {
				top : px(a.y + b.offsetHeight - 1),
				right : px(c - (a.x + d.w))
			});
			break
	}
	if (f > 0) {
		this.node.style.width = px(Math.max(f, b.clientWidth))
	}
};
DropDownMenu.prototype.show = function(b) {
	if (this._shown) {
		return
	}
	b = b || {};
	if (Browser.type("IE", 0, 6)) {
		var a = document.body;
		this.bodyHeight = getStyle(a, "height");
		this.bodyWidth = getStyle(a, "width");
		setNode(a, null, {
			height : "100%",
			width : "100%"
		})
	}
	this._shown = true;
	show(this.node);
	setNode(this.node, null, {
		outline : "none"
	});
	addClass((this.items[this.selectedIndex] || {}).node, "selected");
	if (b.whiteblock !== false) {
		UI.whiteblock(this.node)
	} else {
		setNode(this.node, null, {
			zIndex : overlayZIndex()
		});
		document.body.appendChild(this.node)
	}
};
DropDownMenu.prototype.hide = function(a) {
	if (Browser.type("IE", 0, 6)) {
		setNode(document.body, null, {
			width : this.bodyWidth,
			height : this.bodyHeight
		})
	}
	hide(this.node);
	this._shown = false;
	UI.hideWhiteblock(a);
	Event.trigger(this, "hide")
};
DropDownMenu.prototype.getNode = function() {
	return this.node
};
DropDownMenu.prototype.getSelected = function() {
	return (this.items[this.selectedIndex] || {}).item
};
DropDownMenu.createNavDropDown = function(c) {
	c = c || {};
	var g = c.choices || [];
	if (!g.length) {
		return
	}
	var a = c.position || "bottom_left";
	var d = c.width === undefined ? 100 : c.width;
	var f = window.location.toString();
	var b;
	g.forEach(function(h) {
		b = h.selected = (f == fullyQualified(h.url))
	});
	Event.addListener(document, "modifiable", function() {
		var n = new DropDownMenu(g, {
			selectedIndex : b ? 0 : -1,
			className : "nav_ddm",
			trackcontext : c.trackcontext,
			trackclass : c.trackclass
		});
		var m = $(c.actuator);
		var j = $(c.anchor) || actuator;
		var k = false;
		Event.addListener(n, "hide", function() {
			k = false;
			removeClass(j, "open");
			Event.removeListener(n.getNode(), "mouseout", l)
		});
		var h = new Timer();
		var l = function(p) {
			var o = Event.getRelatedTarget(p);
			if (k || domContainsChild(n.getNode(), o) || domContainsChild(j, o)) {
			} else {
				h.replace(function() {
					n.hide()
				}, 350)
			}
		};
		Event.addListener(n.getNode(), "mousedown", function(o) {
			if (isRightClick(o)) {
				h.reset();
				UI.whiteblock(n.getNode());
				k = true
			}
		});
		setNode(n.getNode(), null, {
			minWidth : px(Dim.fromNode(j).w)
		});
		a = DropDownMenu["POSITION_" + a.toUpperCase()];
		Event.addListener(m, "click", function(o) {
			addClass(j, "open");
			n.attach(j, a, d);
			n.show();
			h.reset();
			UI.whiteblock(n.getNode());
			k = true;
			return Event.stop(o)
		});
		Event.addListener(m, "mouseover", function(o) {
			h.reset();
			addClass(j, "open");
			n.attach(j, a, d);
			n.show({
				whiteblock : false
			});
			Event.addListener(n.getNode(), "mouseout", l);
			return Event.stop(o)
		});
		Event.addListener(j, "mouseout", l);
		Event.addListener(n.getNode(), "mouseover", h.reset, h)
	})
};
DropDownMenu.initSubnav = function(b, d) {
	b = $(b);
	d = d || {};
	var c = d.timeIn || 100;
	var a = d.timeOut || 100;
	var f;
	Event.addListener(b, "mouseover", function() {
		if (f) {
			clearTimeout(f)
		}
		f = setTimeout(function() {
			addClass(b, "open");
			Event.trigger(b, "polyvore.opensubnav")
		}, c)
	});
	Event.addListener(b, "mouseout", function() {
		if (f) {
			clearTimeout(f)
		}
		f = setTimeout(function() {
			removeClass(b, "open")
		}, a)
	});
	removeClass(b, "cssonly")
};
DropDownMenu.initSubnavTouch = function(a) {
	a = $(a);
	var c = function() {
		addClass(a, "open");
		Event.trigger(a, "polyvore.opensubnav");
		var f;
		var d = Event.addListener(document, "touchstart", function(h) {
			f = document.documentElement.clientWidth / window.innerWidth
		});
		var g = Event.addListener(document, "touchend", function(j) {
			var k = Event.getSource(j);
			if (a != k && !domContainsChild(a, k)) {
				var h = document.documentElement.clientWidth / window.innerWidth;
				if (f !== h) {
					return
				}
				g.clean();
				d.clean();
				b()
			}
		})
	};
	var b = function() {
		removeClass(a, "open");
		Event.addSingleUseListener(a, "click", function(d) {
			c();
			return Event.stop(d)
		})
	};
	removeClass(a, "cssonly");
	b()
};
DropDownMenu.initSubnavButton = function(d, b) {
	d = $(d);
	b = $(b);
	menu = $(d.querySelector("ul"));
	var a = false;
	var c = function(h) {
		var g = Event.getSource(h);
		var f = domContainsChild(menu, g);
		if (a && !f) {
			a = false;
			removeClass(d, "open")
		}
	};
	Event.addListener(b, "click", function(f) {
		if (a) {
			a = false;
			removeClass(d, "open")
		} else {
			Event.stop(f);
			Event.addSingleUseListener(document.body, "click", c);
			a = true;
			addClass(d, "open")
		}
	})
};
function SearchBox(b, a) {
	a = a || {};
	SearchBox.superclass.constructor.call(this, b);
	this.inputHint = a.inputHint || loc("Keywords");
	this.showClear = a.showClear;
	Event.addListener(b, "change", this.refresh, this)
}extend(SearchBox, FilterUI);
SearchBox.prototype.destruct = function() {
	delayedClearNode(this.node, true);
	domRemoveNode(this.node);
	Event.release(this)
};
SearchBox.prototype.attach = function(c) {
	this.node = createNode("form", {
		className : "searchbox empty"
	});
	c.appendChild(this.node);
	Event.addListener(this.node, "submit", this.onSubmit, this);
	if (this.filter.value) {
		removeClass(this.node, "empty")
	}
	var a = (this.input = createNode("input", {
		type : "text",
		value : this.filter.value,
		className : "textbox"
	}));
	InputHint.add(a, this.inputHint);
	Event.addListener(a, "keyup", this.onChange, this);
	var b = this.node.appendChild(createNode("table", {
		cellPadding : "0",
		cellSpacing : "0",
		className : "full"
	})).appendChild(createNode("tbody")).appendChild(createNode("tr"));
	b.appendChild(createNode("td", {
		className : "textbox_cell"
	})).appendChild(a);
	this.submitNode = createNode("input", {
		type : "button",
		value : "",
		className : "search",
		title : loc("Search"),
		alt : loc("Search")
	}, null, "");
	makeUnselectable(this.submitNode);
	b.appendChild(createNode("td", null, {
		width : "1%",
		verticalAlign : "middle"
	})).appendChild(this.submitNode);
	Event.addListener(this.submitNode, "click", function(d) {
		if (this.showClear && hasClass(this.submitNode, "clear_input")) {
			this.filter.clear()
		}
		Event.trigger(this.node, "submit", d)
	}, this);
	this.node.appendChild(createNode("input", {
		type : "button",
		value : ""
	}, {
		display : "none"
	}));
	Event.trigger(this, "init", this)
};
SearchBox.prototype.onChange = function(a) {
	if (this.filter.value && !this.isChanged()) {
		removeClass(this.node, "empty");
		if (this.showClear) {
			addClass(this.submitNode, "clear_input");
			this.submitNode.title = loc("Clear");
			this.submitNode.alt = loc("Clear")
		}
	} else {
		removeClass(this.submitNode, "clear_input");
		this.submitNode.title = loc("Search");
		this.submitNode.alt = loc("Search");
		addClass(this.node, "empty")
	}
};
SearchBox.prototype.isChanged = function() {
	return this.input.value.trim() != this.filter.value
};
SearchBox.prototype.onSubmit = function(a) {
	var b = this.input.value.trim();
	if (b && !InputHint.isHint(this.input)) {
		this.filter.set(b)
	} else {
		this.filter.clear()
	}
	this.onChange(a);
	return Event.stop(a)
};
SearchBox.prototype.getDisplayText = function() {
	return this.filter.value
};
SearchBox.prototype.refresh = function() {
	if (this.filter.isDefaultValue()) {
		InputHint.reset(this.input);
		addClass(this.node, "empty")
	} else {
		InputHint.setValue(this.input, this.filter.value)
	}
	this.input.blur()
};
function Patricia() {
	this.clear();
	this._version = 0
}

function genInsertItem(a, b) {
}
Patricia.prototype.insert = function(b, a) {
	this._version++;
	if (b.constructor == Array) {
		b.forEachNonBlocking(32, this._genInsertItem(this._version), a, this)
	} else {
		this._insertItem(b);
		if (a) {
			a()
		}
	}
};
Patricia.prototype._genInsertItem = function(a) {
	return function(b) {
		if (this._version == a) {
			this._insertItem(b)
		}
	}
};
Patricia.prototype._insertItem = function(c) {
	this._insertionIterator = this._insertionIterator || new PatriciaInserter(this);
	var a = this.items.length;
	this.items.push(c);
	var b = this._getKeys( typeof (c) == "string" ? c : c.title || "");
	b.forEach(function(f) {
		this._insertionIterator.reset();
		for (var d = 0; d < f.length; ++d) {
			this._insertionIterator.next(f.charAt(d))
		}
		this._insertionIterator.insert(a)
	}, this)
};
Patricia.prototype.find = function(c) {
	c = c.toLowerCase();
	var a = new PatriciaIterator(this);
	function d(h, f) {
		if (f >= h.length - 1) {
			return this.getElements(a)
		}
		var g = AutoComplete.defaultPrepRegexp(h.substring(f + 1));
		return this.getElements(a).filter(function(j) {
			return ( typeof (j) == "string" ? j : j.title || "").match(g)
		})
	}

	for (var b = 0; b < c.length; ++b) {
		if (!a.next(c.charAt(b))) {
			return []
		}
		if (c.charAt(b) == " ") {
			a.prev();
			return d.call(this, c, b)
		}
	}
	return this.getElements(a)
};
Patricia.prototype.getElements = function(a) {
	var c = [];
	var d = [];
	d.length = this.items.length;
	a.getElements(d);
	for (var b = 0; b < d.length; ++b) {
		if (d[b] || d[b] === 0) {
			c.push(this.items[b])
		}
	}
	return c
};
Patricia.prototype.clear = function() {
	this.root = new PatriciaNode();
	var a = "[ &-.]|(by)|(of)";
	this.replRegexp = new RegExp("^(" + a + ")*", "i");
	this.wordRegexp = new RegExp(a, "i");
	this._version++;
	this.items = []
};
Patricia.prototype._getKeys = function(d) {
	d = d.toLowerCase();
	var c = [d];
	while (true) {
		var a = d.search(this.wordRegexp);
		if (a < 0 || a == d.length - 1) {
			break
		}
		d = d.substring(a);
		d = d.replace(this.replRegexp, "");
		c.push(d)
	}
	d = c[0];
	var b = diacritic2plain(d);
	if (b != d) {
		c = c.concat(this._getKeys(b))
	}
	return c
};
function PatriciaIterator(a) {
	this.reset(a)
}
PatriciaIterator.prototype.reset = function(a) {
	this.tree = a || this.tree;
	this.curNode = this.tree.root;
	this.curNodeStrIdx = 0
};
PatriciaIterator.prototype.next = function(a) {
	if (this.curNodeStrIdx > this.curNode.str.length) {++this.curNodeStrIdx;
		return null
	} else {
		if (this.curNode.str.charAt(this.curNodeStrIdx) == a) {++this.curNodeStrIdx;
			return this.curNode
		} else {
			var b = this.curNode.getChild(a);
			if (b) {
				this.curNodeStrIdx = 1;
				return (this.curNode = b)
			} else {++this.curNodeStrIdx;
				return null
			}
		}
	}
};
PatriciaIterator.prototype.prev = function() {
	if (!this.curNode.parent) {
		return
	}
	this.curNode = this.curNode.parent;
	this.curNodeStrIdx = this.curNode.str.length - 1
};
PatriciaIterator.prototype.getElements = function(a) {
	a = a || {};
	if (this.curNodeStrIdx <= this.curNode.str.length) {
		this.curNode.getElements(a)
	}
	return a
};
function PatriciaInserter(a) {
	PatriciaInserter.superclass.constructor.call(this, a)
}extend(PatriciaInserter, PatriciaIterator);
PatriciaInserter.prototype.insert = function(a) {
	if (this.curNodeStrIdx > this.curNode.str.length) {
		return false
	}
	if (this.curNodeStrIdx < this.curNode.str.length) {
		this._expand()
	}
	this.curNode.insert(a);
	return true
};
PatriciaInserter.prototype._expand = function() {
	var b = this.curNode.parent;
	var a;
	if (b) {
		b.removeChild(this.curNode.str.charAt(0));
		a = b.getOrCreateChild(this.curNode.str.charAt(0))
	} else {
		a = new PatriciaNode(this.curNode.str.charAt(0));
		this.tree.root = a
	}
	a.str = this.curNode.str.substring(0, this.curNodeStrIdx);
	this.curNode.str = this.curNode.str.substring(this.curNodeStrIdx);
	a.setChild(this.curNode.str.charAt(0), this.curNode);
	this.curNode = a
};
PatriciaInserter.prototype.next = function(a) {
	if (this.curNode.str.charAt(this.curNodeStrIdx) == a) {++this.curNodeStrIdx;
		return this.curNode
	} else {
		if (this.curNodeStrIdx == this.curNode.str.length) {
			if (!this.curNode.items.length && !this.curNode.hasChildren()) {++this.curNodeStrIdx;
				this.curNode.str += a;
				return this.curNode
			} else {
				this.curNode = this.curNode.getOrCreateChild(a);
				this.curNodeStrIdx = 1;
				return this.curNode
			}
		} else {
			this._expand();
			this.curNode = this.curNode.getOrCreateChild(a);
			this.curNodeStrIdx = 1;
			return this.curNode
		}
	}
};
function PatriciaNode(a) {
	this.items = [];
	this.str = a || "";
	this.children = null;
	this.parent = null
}
PatriciaNode.prototype.getChild = function(a) {
	return this.children ? this.children[a] : null
};
PatriciaNode.prototype.getOrCreateChild = function(a) {
	this.children = this.children || {};
	this.children[a] = this.children[a] || new PatriciaNode(a);
	this.children[a].parent = this;
	return this.children[a]
};
PatriciaNode.prototype.insert = function(a) {
	this.items.push(a)
};
PatriciaNode.prototype.getElements = function(a) {
	this.items.forEach(function(b) {
		a[b] = 1
	});
	if (this.children) {
		forEachKey(this.children, function(b, c) {
			c.getElements(a)
		})
	}
};
PatriciaNode.prototype.hasChildren = function() {
	return !!this.children
};
PatriciaNode.prototype.removeChild = function(b) {
	if (!this.children) {
		return null
	}
	var c = this.children[b];
	if (!c) {
		return null
	}
	c.parent = null;
	delete this.children[b];
	var a = false;
	forEachKey(this.children, function(f, d) {
		a = true;
		return true
	});
	if (!a) {
		this.children = null
	}
	return c
};
PatriciaNode.prototype.setChild = function(b, a) {
	var c = this.removeChild(b);
	this.children = this.children || {};
	this.children[b] = a;
	a.parent = this;
	return c
};
var _diacritic2plain = {
	"À" : "A",
	"Á" : "A",
	"Â" : "A",
	"Ã" : "A",
	"Ä" : "A",
	"Å" : "A",
	"à" : "a",
	"á" : "a",
	"â" : "a",
	"ã" : "a",
	"ä" : "a",
	"å" : "a",
	"Ò" : "O",
	"Ó" : "O",
	"Ô" : "O",
	"Õ" : "O",
	"Ö" : "O",
	"Ø" : "O",
	"ò" : "o",
	"ó" : "o",
	"ô" : "o",
	"õ" : "o",
	"ö" : "o",
	"ø" : "o",
	"È" : "E",
	"É" : "E",
	"Ê" : "E",
	"Ë" : "E",
	"è" : "e",
	"é" : "e",
	"ê" : "e",
	"ë" : "e",
	"ð" : "e",
	"Ç" : "C",
	"ç" : "c",
	"Ð" : "D",
	"Ì" : "I",
	"Í" : "I",
	"Î" : "I",
	"Ï" : "I",
	"ì" : "i",
	"í" : "i",
	"î" : "i",
	"ï" : "i",
	"Ù" : "U",
	"Ú" : "U",
	"Û" : "U",
	"Ü" : "U",
	"ù" : "u",
	"ú" : "u",
	"û" : "u",
	"ü" : "u",
	"Ñ" : "N",
	"ñ" : "n",
	"Š" : "S",
	"š" : "s",
	"Ÿ" : "Y",
	"ÿ" : "y",
	"ý" : "y",
	"Ž" : "Z",
	"ž" : "z"
};
var _plain2diacritics = {
	A : ["À", "Á", "Â", "Ã", "Ä", "Å"],
	a : ["à", "á", "â", "ã", "ä", "å"],
	O : ["Ò", "Ó", "Ô", "Õ", "Ö", "Ø"],
	o : ["ò", "ó", "ô", "õ", "ö", "ø"],
	E : ["È", "É", "Ê", "Ë"],
	e : ["è", "é", "ê", "ë", "ð"],
	C : ["Ç"],
	c : ["ç"],
	D : ["Ð"],
	I : ["Ì", "Í", "Î", "Ï"],
	i : ["ì", "í", "î", "ï"],
	U : ["Ù", "Ú", "Û", "Ü"],
	u : ["ù", "ú", "û", "ü"],
	N : ["Ñ"],
	n : ["ñ"],
	S : ["Š"],
	s : ["š"],
	Y : ["Ÿ"],
	y : ["ÿ", "ý"],
	Z : ["Ž"],
	z : ["ž"]
};
function diacritic2plain(d) {
	var b = d.split("");
	for (var a = 0; a < b.length; ++a) {
		var f = b[a];
		b[a] = _diacritic2plain[f] || f
	}
	b = b.join("");
	return b
}

function plain2diacritics(a) {
	return _plain2diacritics[a]
}

function InputTokenizer(a, b) {
	b = b || {};
	this.input = a;
	this.delimChar = b.delimChar;
	this.maxTokens = b.maxTokens || Number.MAX_VALUE;
	this.delimChar = b.delimChar || ",";
	this.caretTokenIndex = 0;
	this.caretCharIndex = 0;
	this.currentTokens = [""];
	this.cleaner = new Cleaner();
	this.cleaner.push(Event.addListener(this.input, "click", this.refresh, this));
	this.cleaner.push(Event.addListener(this.input, "keyup", this.refresh, this));
	this.delimJoin = this.delimChar + " "
}
InputTokenizer.prototype.destruct = function() {
	Event.release(this);
	this.cleaner.clean()
};
InputTokenizer.prototype.refresh = function(a) {
	this.currentTokens = inputValue(this.input).split(this.delimChar);
	if (this.currentTokens.length > this.maxTokens) {
		this.currentTokens[this.maxTokens - 1] = this.currentTokens.splice(this.maxTokens - 1).join(this.delimChar)
	}
	var b = 0;
	this.caretCharIndex = getCaretPosition(this.input);
	if (this.caretCharIndex < 0) {
		b = this.currentTokens.length - 1
	} else {
		while (b < this.currentTokens.length && this.caretCharIndex > this.currentTokens[b].length) {
			this.caretCharIndex -= this.currentTokens[b].length + 1;
			++b
		}
		if (b >= this.currentTokens.length) {
			b = this.currentTokens.length - 1;
			this.caretCharIndex = this.currentTokens[b].length
		}
	}
	var c = this.caretTokenIndex;
	this.caretTokenIndex = b;
	if (c != this.caretTokenIndex) {
		Event.trigger(this, "indexchange", a, c)
	}
};
InputTokenizer.prototype.caretToken = function(b) {
	var a = this.currentTokens[this.caretTokenIndex];
	if (b !== undefined) {
		this.currentTokens[this.caretTokenIndex] = b.trim()
	}
	return a
};
InputTokenizer.prototype.reconstructValue = function(c) {
	var d = [];
	var a = !this.currentTokens[this.currentTokens.length - 1].trim();
	var b = this.caretTokenIndex == this.currentTokens.length - 1;
	this.currentTokens.forEach(function(f) {
		f = f.trim();
		if (f) {
			d.push(f)
		}
	});
	if (!c && d.length && this.currentTokens.length < this.maxTokens && (a || b)) {
		d.push("")
	}
	return d.join(this.delimJoin)
};
function AutoComplete(b, a, c) {
	b = $(b);
	this.input = b;
	c = c || {};
	a = a || [];
	if (a.constructor == Array) {
		a = new MemDataSource(a)
	}
	this.cleaner = new Cleaner();
	if (c.toggleOnLoaded) {
		this.cleaner.push(Event.addListener(a, "loaded", function() {
			yield(function() {
				if (!this.input || !hasDim(this.input) || getCaretPosition(this.input) < 0) {
					return
				}
				this._refreshList()
			}, this)
		}, this))
	}
	this.datasource = a;
	this.exclusive = c.exclusive;
	if (c.minChars === 0) {
		this.minChars = 0
	} else {
		this.minChars = c.minChars || 1
	}
	this.alwaysShowOnFocus = c.alwaysShowOnFocus || false;
	this.maxSize = c.maxSize || 0;
	this.autoResize = c.autoResize || c.autoResize === undefined;
	this.containerPositioner = c.containerPositioner || this.input;
	this.containerSizer = c.containerSizer || this.input;
	this.inputTokenizer = c.inputTokenizer || new InputTokenizer(b, c);
	this.refreshOnInputChange = c.refreshOnInputChange === undefined ? true : c.refreshOnInputChange;
	this.prepRegexp = c.prepRegexp || AutoComplete.defaultPrepRegexp;
	this.matcher = c.matcher ||
	function(d, f) {
		return d.match(f)
	};
	this.renderer = c.renderer || AutoComplete.highlightText;
	this.inputRenderer = c.inputRenderer ||
	function(d) {
		return d
	};
	this.onSelect = c.onSelect || this.defaultOnSelect;
	yield(function() {
		Event.addListener(this, "select", this.onSelect, this)
	}, this);
	this.onClear = c.onClear || noop;
	yield(function() {
		Event.addListener(this, "clear", this.onClear, this)
	}, this);
	this.isOpen = false;
	this.highlighted = null;
	this.isOverContainer = false;
	if (c.container) {
		this.container = c.container;
		this.discardContainer = false
	} else {
		this.container = createNode("div", {
			className : "accontainer"
		});
		Event.addListener(document, "modifiable", function() {
			document.body.appendChild(this.container)
		}, this);
		this.discardContainer = true
	}
	this.resultsList = this.container.appendChild(createNode("ul"));
	this.sorter = c.sorter ||
	function(d, f) {
		f = new RegExp("^" + f.source, (f.ignoreCase ? "i" : "") + (f.multiline ? "m" : ""));
		d.sort(function(h, g) {
			h = h._data ? h._data.title ? h._data.title : h._data : h;
			g = g._data ? g._data.title ? g._data.title : g._data : g;
			var k = f.test(h);
			var j = f.test(g);
			if (k == j) {
				return h < g ? -1 : h > g ? 1 : 0
			} else {
				return k ? -1 : 1
			}
		})
	};
	this.cleaner.push(Event.addListener(this.input, "keydown", this.onInputKeyDown, this));
	this.cleaner.push(Event.addListener(this.input, "keypress", this.onInputKeyPress, this));
	this.cleaner.push(Event.addListener(this.input, "keyup", this.onInputKeyUp, this));
	this.cleaner.push(Event.addListener(this.input, "blur", this.onInputBlur, this));
	this.cleaner.push(Event.addListener(this.resultsList, "mousedown", this.onListMouseDown, this));
	this.cleaner.push(Event.addListener(this.resultsList, "mouseover", this.onListMouseOver, this));
	this.cleaner.push(Event.addListener(this.container, "mouseover", this.onContainerMouseOver, this));
	this.cleaner.push(Event.addListener(this.container, "mouseout", this.onContainerMouseOut, this));
	this.cleaner.push(Event.addListener(this.inputTokenizer, "indexchange", function(d) {
		if (!d) {
			return
		}
		if (d.type == "click") {
			this.closeList()
		} else {
			if (d.type == "keyup" && (d.keyCode == 37 || d.keyCode == 39 || d.keyCode == Browser.isMac ? 8 : 46 || (d.keyCode >= 33 && d.keyCode <= 36))) {
				this.closeList()
			}
		}
	}, this));
	if (this.datasource.setParam && this.refreshOnInputChange) {
		this.updateDataSource = Event.rateLimit(Event.wrapper(function() {
			if (this._canShowList()) {
				this.datasource.setParam("query", this.inputTokenizer.caretToken().ltrim())
			}
		}, this), 200)
	} else {
		this.updateDataSource = noop
	}
	setNode(this.input, {
		autocomplete : "off"
	});
	if (!c.skipInitialLoad) {
		a.ensureLoaded()
	}
	if (this.alwaysShowOnFocus) {
		this.cleaner.push(Event.addListener(this.input, "focus", function() {
			this._refreshList()
		}, this))
	}
}
AutoComplete.defaultPrepRegexp = function(f) {
	var d = f.length ? f.charAt(0) : "";
	var j = (d && d.match(/\b./)) ? "\\b" : "";
	var a = f.split("");
	for (var b = 0; b < a.length; ++b) {
		var h = a[b];
		var g = (plain2diacritics(h.toLowerCase()) || []).concat(plain2diacritics(h.toUpperCase()) || []);
		if (g.length) {
			a[b] = ["[", h, g.join(""), "]"].join("")
		} else {
			a[b] = RegExp.escape(h)
		}
	}
	f = a.join("");
	f = f.trim().split(" ").map(function(l, c, m) {
		var k = "(";
		if (l.charAt(0) != "[") {
			k += j
		}
		k += l;
		if (c != m.length - 1 && l.charAt(l.length - 1) != "]") {
			k += j
		}
		k += ")";
		return k
	}).join(".*");
	return new RegExp(j + f, "ig")
};
AutoComplete.prototype.destruct = function() {
	this.cleaner.clean();
	Event.release(this);
	this.inputTokenizer.destruct();
	if (this.discardContainer) {
		domRemoveNode(this.container, true)
	} else {
		clearNode(this.container)
	}
	this.updateDataSource = null;
	this.input = null;
	this.datasource = null;
	this.highlighted = null;
	this.container = null;
	this.resultsList = null
};
AutoComplete.prototype._refreshList = function() {
	if (!this._canShowList()) {
		this.closeList();
		return
	}
	var k = this.inputTokenizer.caretToken().ltrim().toLowerCase();
	this.updateDataSource();
	var f = [];
	var j = this.prepRegexp(k);
	var g, o, l;
	var b = 0;
	var n = this.maxSize || 10000;
	if (this.datasource.patricia) {
		f = this.datasource.patricia.find(k);
		var m = 0;
		for ( g = 0; g < f.length && b < n; ++g) {
			o = f[g];
			if (this.matcher(o, j)) {++b;
				l = this.renderer(o, j);
				f[m] = {
					_data : o,
					label : l
				};
				++m
			}
		}
		f.length = m
	} else {
		for ( g = 0; g < this.datasource.size() && b < n; g++) {
			o = this.datasource.get(g);
			if (this.matcher(o, j)) {++b;
				l = this.renderer(o, j);
				f.push({
					_data : o,
					label : l
				})
			}
		}
	}
	if (this.sorter) {
		this.sorter(f, j)
	}
	var h = f.length;
	if (h <= 0) {
		this.closeList(true);
		return
	}
	var d = (this.highlighted || {})._data;
	var a = (this.highlighted || {}).eventType;
	delayedClearNode(this.resultsList);
	this._renderListResults(f);
	if (d || this.exclusive) {
		var c = this.highlightableElements.find({
			_data : d
		}, function(q, p) {
			return q._data == p._data
		});
		if (this.exclusive) {
			c = Math.max(0, c)
		}
		if (c >= 0) {
			this._highlight(this.highlightableElements[c], a)
		}
	}
	if (this.isOpen) {
		this._adjustHeight(h);
		return
	}
	this._reposition();
	this._adjustHeight();
	setNode(this.container, null, {
		zIndex : overlayZIndex(this.container)
	});
	this.isOpen = true
};
AutoComplete.prototype.closeList = function(a) {
	if (this.isOpen) {
		hide(this.container);
		this.highlighted = null;
		this.isOpen = false
	}
	if (this.exclusive && !a) {
		this.clearInput()
	}
};
AutoComplete.prototype._renderListResults = function(b) {
	this.highlightableElements = [];
	for (var c = 0; c < b.length; c++) {
		var a = createNode("li", {
			className : "strings"
		}, null, createNode("div", null, {
			width : "100%"
		}, b[c].label));
		this.resultsList.appendChild(a);
		this.highlightableElements.push(a);
		a._data = b[c]._data;
		b[c].label = null
	}
};
AutoComplete.prototype._adjustHeight = function(b) {
	var a = this.container;
	setNode(a, null, {
		height : "auto"
	});
	var g = 10;
	var c = Dim.fromNode(a).h;
	if (this.maxSize > 0 && b > this.maxSize) {
		setNode(a, null, {
			height : px((c - g) / b * this.maxSize)
		})
	}
	if (this.autoResize) {
		var f = getWindowSize().h;
		var d = nodeXY(a).y - scrollXY().y;
		if (d + c + 10 > f) {
			setNode(a, null, {
				height : px(f - d - g - 4)
			})
		}
	}
	a.scrollTop = 0;
	setNode(a, null, {
		visibility : "visible"
	})
};
AutoComplete.prototype._reposition = function() {
	var c = nodeXY(this.containerPositioner);
	var a = Dim.fromNode(this.containerPositioner);
	var b = Dim.fromNode(this.containerSizer);
	setNode(this.container, null, {
		display : "block",
		top : px(c.y + a.h),
		left : px(c.x),
		width : px((this.menuWidth || b.w) - 10),
		position : isDescendantOfFixed(this.input) ? "fixed" : "",
		visibility : "hidden"
	})
};
AutoComplete.prototype._highlight = function(b, a) {
	if (this.highlighted) {
		removeClass(this.highlighted, "highlight");
		this.highlighted.eventType = ""
	}
	addClass(b, "highlight");
	this.highlighted = b;
	this.highlighted.eventType = a || ""
};
AutoComplete.prototype.highlightNext = function(c) {
	var b = this.highlightableElements || [];
	var d;
	if (this.highlighted) {
		var a = b.find(this.highlighted);
		if (a >= 0) {
			d = b[a + 1 + b.length % b.length]
		}
	}
	d = d || b[0];
	this._highlight(d, c);
	return d
};
AutoComplete.prototype.highlightPrevious = function(c) {
	var b = this.highlightableElements || [];
	var d;
	if (this.highlighted) {
		var a = b.find(this.highlighted);
		if (a >= 0) {
			d = b[a - 1 + b.length % b.length]
		}
	}
	d = d || b[b.length - 1];
	this._highlight(d, c);
	return d
};
AutoComplete.prototype._isIgnoreKeyUp = function(a) {
	var b = a.keyCode;
	if ((b == 9) || (b == 13) || (b == 16) || (b == 17) || (b >= 18 && b <= 20) || (b == 27) || (b >= 33 && b <= 35) || (b >= 36 && b <= 39) || (b >= 44 && b <= 45)) {
		return true
	}
	if (b == 8) {
		return false
	}
	return a.metaKey || a.ctrlKey || a.altKey
};
AutoComplete.prototype.onInputKeyDown = function(c) {
	if (this.isOpen) {
		var a = this.container;
		var b;
		this.keyEventManageList = false;
		switch(c.keyCode) {
			case 9:
				if (c.shiftKey) {
					this.highlightPrevious(c.type)
				} else {
					this.highlightNext(c.type)
				}
				return Event.stop(c);
			case 13:
				if (this.highlighted && !/mouse/.test(this.highlighted.eventType)) {
					this.doSelect(this.highlighted);
					this.closeList();
					return Event.stop(c)
				} else {
					this.closeList();
					return
				}
				break;
			case 38:
				b = this.highlightPrevious(c.type);
				scrollUp(a, b);
				return Event.stop(c);
			case 40:
				b = this.highlightNext(c.type);
				scrollDown(a, b);
				return Event.stop(c);
			case 27:
				if (this.exclusive) {
					this.clearInput()
				}
				this.closeList();
				return Event.stop(c)
		}
	}
	this.keyEventManageList = !this._isIgnoreKeyUp(c);
	return true
};
AutoComplete.prototype.onInputKeyPress = function(a) {
	if (this.keyEventManageList) {
		if (this.highlighted && this.isOpen && Event.getChar(a) == this.inputTokenizer.delimChar) {
			this.doSelect(this.highlighted);
			this.closeList();
			this.keyEventManageList = false;
			return Event.stop(a)
		}
	}
};
AutoComplete.prototype.onInputKeyUp = function(a) {
	if (this.keyEventManageList) {
		this.inputTokenizer.refresh(a);
		this._refreshList()
	}
};
AutoComplete.prototype.defaultOnSelect = function(c) {
	var b = this.inputTokenizer;
	b.caretToken(this.inputRenderer(c._data));
	this.input.value = b.reconstructValue();
	var a = inputValue(this.input).length;
	yield(function() {
		selectInputText(this.input, a, a)
	}, this)
};
AutoComplete.prototype._canShowList = function() {
	var a = this.inputTokenizer.caretToken().ltrim() || "";
	if (this.alwaysShowOnFocus) {
		return true
	}
	return this.inputTokenizer.caretTokenIndex >= 0 && a.length >= this.minChars
};
AutoComplete.prototype.onInputBlur = function(a) {
	if (this.isOverContainer) {
		var b = Dim.fromNode(this.input);
		if (b.w > 0 && b.h > 0) {
			this.input.focus()
		}
	} else {
		this.closeList()
	}
};
AutoComplete.prototype.doSelect = function(a) {
	this.selectedText = this.inputRenderer(a._data);
	Event.trigger(this, "select", a)
};
AutoComplete.prototype.clearInput = function() {
	var a = this.input.value;
	if (this.selectedText && this.selectedText == a) {
		return
	}
	this.selectedText = null;
	this.inputTokenizer.caretToken("");
	this.input.value = this.inputTokenizer.reconstructValue();
	Event.trigger(this, "clear")
};
AutoComplete.prototype.onListMouseDown = function(a) {
	var b = Event.getSource(a);
	while (b && (b != this.resultsList)) {
		if (b._data) {
			this.doSelect(b);
			this.closeList();
			return Event.stop(a)
		}
		b = b.parentNode
	}
};
AutoComplete.prototype.onListMouseOver = function(a) {
	var b = Event.getSource(a);
	while (b && (b != this.resultsList)) {
		if (b._data) {
			this._highlight(b, a.type);
			return
		}
		b = b.parentNode
	}
};
AutoComplete.prototype.onContainerMouseOver = function() {
	this.isOverContainer = true
};
AutoComplete.prototype.onContainerMouseOut = function() {
	this.isOverContainer = false
};
AutoComplete.highlightText = function(c, b) {
	var a = "";
	splitWithMatches(b, c, function(f) {
		b.lastIndex = 0;
		var h = b.exec(f) || [];
		var g = 1;
		var d = 0;
		var j = 0;
		while (j < f.length) {
			if (g >= h.length) {
				a += f.substring(d);
				break
			}
			if (f.indexOf(h[g], j) == j) {
				a += f.substring(d, j) + "<strong>" + h[g] + "</strong>";
				j = j + h[g].length;
				d = j;
				++g
			} else {
				j++
			}
		}
		return a
	}, function(d) {
		a += d
	});
	return a
};
AutoComplete.prototype.select = function(d, b) {
	if (!b) {
		b = function(f, g) {
			return (f.value === g)
		}
	}
	if (this.datasource.patricia) {
		var a = new PatriciaIterator(this.datasource.patricia);
		var c = null;
		while (( c = a.next())) {
			if (b(c, d)) {
				break
			}
		}
		if (!c) {
			return null
		}
	} else {
		for ( i = 0; i < this.datasource.size(); i++) {
			c = this.datasource.get(i);
			if (b(c, d)) {
				break
			}
			c = null
		}
		if (!c) {
			return null
		}
	}
	this.inputTokenizer.caretToken(this.inputRenderer(c));
	this.input.value = this.inputTokenizer.reconstructValue();
	this.selectedText = this.input.value;
	Event.trigger(this.input, "change");
	return c
};
function ObjectAutoComplete(c, a, d) {
	d = d || {};
	d.matcher = d.matcher ||
	function(g, h) {
		return g.title.match(h)
	};
	var f = this._showType;
	d.renderer = d.renderer ||
	function(h, j) {
		var g = [];
		g.push(AutoComplete.highlightText(h.title, j));
		if (f) {
			g.push(createHTML("div", {
				className : "meta"
			}, null, h.type))
		}
		if (!h.icon && h.imgurl) {
			h.icon = createHTML("img", {
				className : "img_icon",
				src : h.imgurl
			})
		} else {
			if (!h.icon && h.color) {
				h.icon = createHTML("div", {
					className : "color_icon"
				}, {
					backgroundColor : h.color
				}, " ")
			}
		}
		if (h.icon) {
			g = [createHTML("div", {
				className : "left icon"
			}, null, h.icon), createHTML("div", {
				className : "left"
			}, null, g.join("")), createHTML("br", {
				className : "clear"
			})]
		}
		return createHTML("div", {
			title : h.title
		}, {
			width : "10000px"
		}, g.join(""))
	};
	ObjectAutoComplete.superclass.constructor.call(this, c, a, d);
	if (!d.onSelect) {
		var b = Event.wrapper(this.onSelect, this);
		this.onSelect = function(g) {
			if (g._data.clickurl) {
				window.location = buildAbsURL(g._data.clickurl)
			} else {
				b(g)
			}
		}
	}
	this._showType = true
}extend(ObjectAutoComplete, AutoComplete);
function GroupedObjectAutoComplete(c, b, d) {
	GroupedObjectAutoComplete.superclass.constructor.call(this, c, b, d);
	this._showType = false;
	this.menuWidth = d.menuWidth;
	this.typeOrder = d.typeOrder || [];
	if (d.maxResults) {
		var a = Event.wrapper(this.prepRegexp, this);
		var g;
		this.prepRegexp = function(h) {
			g = {};
			return a(h)
		};
		d.maxResults = d.maxResults || {};
		var f = Event.wrapper(this.matcher, this);
		this.matcher = function(h, j) {
			if (g[h.filter_type] >= d.maxResults[h.filter_type]) {
				return false
			} else {
				var k = f(h, j);
				if (k) {
					g[h.filter_type] = (g[h.filter_type] || 0) + 1
				}
				return k
			}
		}
	}
	this.typePadding = 4;
	this.maxTypeWidth = 0;
	this.typeOrder.forEach(function(j) {
		var h = document.body.appendChild(createNode("span", null, {
			visibility : "hidden",
			position : "absolute"
		}, UI.filter2label[j] || j));
		this.maxTypeWidth = Math.max(this.maxTypeWidth, Dim.fromNode(h).w);
		domRemoveNode(h)
	}, this)
}extend(GroupedObjectAutoComplete, ObjectAutoComplete);
GroupedObjectAutoComplete.prototype._renderListResults = function(c) {
	var b = {};
	c.forEach(function(d) {
		b[d._data.filter_type] = b[d._data.filter_type] || [];
		b[d._data.filter_type].push(d)
	});
	this.highlightableElements = [];
	var a = createNode("div", null, {
		width : "100%",
		overflow : "hidden"
	});
	this.typeOrder.forEach(function(f) {
		var d = b[f];
		if (!d || !d.length) {
			return
		}
		var h = a.appendChild(createNode("div", {
			className : "type_container"
		}));
		var g = true;
		d.forEach(function(k) {
			var j = h.appendChild(createNode("div", {
				className : "results"
			}, null, k.label));
			if (g) {
				j.appendChild(createNode("div", {
					className : "type"
				}, null, UI.filter2label[f] || f));
				g = false
			}
			j._data = k._data;
			this.highlightableElements.push(j)
		}, this)
	}, this);
	if (this.maxTypeWidth) {
		editCSSRule(".accontainer .type_container .type", {
			width : px(this.maxTypeWidth),
			display : "block"
		});
		editCSSRule(".accontainer .results", {
			paddingLeft : px(this.maxTypeWidth + 2 * this.typePadding)
		})
	}
	this.resultsList.appendChild(createNode("li", null, null, a))
};
function createBrandsSiteAutocomplete(b, a, c) {
	b = $(b);
	a = $(a);
	var d = DataSourceDataManager.getAnalyticsACData();
	Event.addSingleUseListener(d, "loaded", function() {
		var f = new GroupedObjectAutoComplete(b, d, {
			maxResults : {
				brand : 10,
				displayurl : 10
			},
			typeOrder : ["brand", "displayurl"],
			toggleOnLoaded : true,
			maxTokens : 1,
			onSelect : function(g) {
				if (c) {
					c(g)
				} else {
					var h = g._data;
					if (a) {
						if (h.filter_type == "displayurl") {
							a.value = "site"
						} else {
							if (h.filter_type == "brand") {
								a.value = "brand"
							}
						}
					}
					b.value = h.value
				}
			}
		})
	});
	d.ensureLoaded()
}

function createAnalyticsAutocomplete(a) {
	a = $(a);
	Event.addListener(a.form, "submit", function() {
		if (LINKABLE_REGEXP.test(a.value || "")) {
			a.form.action = "analytics.site";
			a.name = "site"
		} else {
			a.form.action = "analytics.brand";
			a.name = "brand"
		}
	});
	createBrandsSiteAutocomplete(a, null, function(b) {
		var d = b._data;
		var c;
		if (d.filter_type == "displayurl") {
			a.form.action = "analytics.site";
			a.name = "site";
			a.value = d.value
		} else {
			if (d.filter_type == "brand") {
				a.form.action = "analytics.brand";
				a.name = "brand";
				a.value = d.value
			} else {
				return
			}
		}
		a.form.submit();
		a.blur()
	})
}

function createAnalyticsSiteAutocomplete(a, b) {
	a = $(a);
	var c = DataSourceDataManager.getAnalyticsACData();
	Event.addSingleUseListener(c, "loaded", function() {
		var d = new GroupedObjectAutoComplete(a, c, {
			maxResults : {
				displayurl : 10
			},
			typeOrder : ["displayurl"],
			toggleOnLoaded : true,
			maxTokens : 1,
			onSelect : function(f) {
				var g = f._data;
				a.value = g.value;
				if (b) {
					b(f)
				}
			}
		})
	});
	c.ensureLoaded()
}

function createAnalyticsBrandAutocomplete(a, b) {
	a = $(a);
	var c = DataSourceDataManager.getAnalyticsACData();
	Event.addSingleUseListener(c, "loaded", function() {
		var d = new GroupedObjectAutoComplete(a, c, {
			maxResults : {
				brand : 10
			},
			typeOrder : ["brand"],
			toggleOnLoaded : true,
			maxTokens : 1,
			onSelect : function(f) {
				var g = f._data;
				a.value = g.value;
				if (b) {
					b(f)
				}
			}
		})
	});
	c.ensureLoaded()
}

function createDashboardAutocomplete(b, f) {
	var a = [];
	f.forEach(function(g) {
		if (!a.contains(g.category)) {
			a.push(g.category)
		}
		g.filter_type = g.category;
		g.label = g.title
	});
	var d = new MemDataSource(f);
	var c = new GroupedObjectAutoComplete($(b), d, {
		typeOrder : a,
		delimChar : "",
		exclusive : true,
		maxSize : 50,
		menuWidth : 500,
		inputRenderer : function(g) {
			return g.title
		},
		onSelect : function(h) {
			var g = h._data;
			window.location = buildURL("dashboard", {
				table : g.table
			})
		}
	})
}

function LocalStorageDataSource(a) {
	LocalStorageDataSource.superclass.constructor.call(this, [], a);
	this.action = a.action;
	this.params = a.params || {
		".cacheable" : 1,
		ver : 12
	};
	this.onSuccess = a.onSuccess;
	this.noPatricia = a.noPatricia;
	this.dirty = true
}extend(LocalStorageDataSource, MemDataSource);
LocalStorageDataSource.prototype.isDirty = function() {
	return this.dirty
};
LocalStorageDataSource.prototype.reload = function() {
	Event.trigger(this, "loading");
	if (this.loadStarted) {
		Event.trigger(this, "loaded");
		return
	}
	this.loadStarted = true;
	var f = this.action;
	var d = this;
	var c = Ajax.getCacheKey(this.action, this.params);
	var b = function(g) {
		if (!g && window.localStorage && localStorage.setItem && localStorage.setItem != noop) {
			LocalStorageCache.set(c, d.values(), LocalStorageCache.WEEK)
		}
		this.dirty = false;
		Event.trigger(d, "loaded")
	};
	var a;
	if (window.localStorage && ( a = LocalStorageCache.get(c))) {
		if (a) {
			Event.pauseEvents(this, "change");
			this.setData(a);
			Event.unpauseEvents(this, "change");
			if (this.noPatricia) {
				b(true)
			} else {
				(this.patricia = new Patricia()).insert(this.values(), function() {
					b(true)
				})
			}
			return
		}
	}
	this.patricia = new Patricia();
	Ajax.get({
		action : f,
		data : this.params,
		hideProgress : true,
		onSuccess : function(g) {
			d.onSuccess(g, d, b)
		}
	})
};
var DataSourceDataManager = (function() {
	var a = {};
	return {
		_getGroupedObjectData : function(c, d) {
			var b = Ajax.getCacheKey(c, d);
			if (!a[b]) {
				a[b] = new LocalStorageDataSource({
					action : c,
					params : d,
					onSuccess : function(l, k, f) {
						if (!l.ac_data) {
							return
						}
						var h = buildImgURL("img-favicon", {
							url : "__URL__",
							".out" : "png"
						}, "cgi");
						var g = [];
						forEachKey(l.ac_data, function(n, m) {
							g.push(n)
						});
						var j = countingSemaphore(g.length, f);
						g.forEach(function(n) {
							var m = (l.ac_data[n] || {}).items || [];
							m.forEachNonBlocking(32, function(p) {
								var o;
								if ( typeof (p) == "string") {
									o = {
										title : p,
										filter_type : n,
										value : p
									}
								} else {
									o = {
										title : p.label || p.value,
										filter_type : n,
										value : p.value || p.label
									}
								}
								if (n == "displayurl") {
									o.imgurl = h.replace("__URL__", encodeURIComponent(o.title))
								}
								k.append(o);
								k.patricia.insert(o)
							}, function() {
								Event.trigger(k, "loaded");
								j()
							})
						})
					}
				})
			}
			return a[b]
		},
		getSearchTabData : function() {
			return DataSourceDataManager._getGroupedObjectData("autocomplete.editor")
		},
		getShopACData : function() {
			return DataSourceDataManager._getGroupedObjectData("autocomplete.shop", {
				ship_region : window._shipRegion || "",
				".cacheable" : 1,
				ver : 13
			})
		},
		getAnalyticsACData : function() {
			return DataSourceDataManager._getGroupedObjectData("autocomplete.top_brands_and_hosts")
		},
		getTagData : function() {
			var c = "autocomplete.tag_trends";
			var b = Ajax.getCacheKey(c);
			if (!a[b]) {
				a[b] = new LocalStorageDataSource({
					action : c,
					onSuccess : function(g, f, d) {
						if (!g.result || !g.result.items) {
							return
						}
						g.result.items.forEachNonBlocking(32, function(h) {
							f.append(h);
							f.patricia.insert(h)
						}, d)
					}
				})
			}
			return a[b]
		}
	}
})();
var LocalStorageCache = (function() {
	var WEEK = 1000 * 60 * 60 * 24 * 7;
	var metaKeyPrefix = "meta_";
	function getMetaKey(key) {
		return metaKeyPrefix + key
	}

	var lastCleanup = Number(localStorage.getItem("last_cleanup")) || 0;
	if (lastCleanup + WEEK < new Date().getTime()) {
		yield(function() {
			LocalStorageCache.cleanup()
		})
	}
	return {
		WEEK : WEEK,
		set : function(key, value, expires) {
			var jsonValue = "(" + JSON2.stringify(value) + ")";
			try {
				LocalStorageCache._set(key, jsonValue, expires)
			} catch(e) {
				LocalStorageCache.cleanup();
				LocalStorageCache._set(key, jsonValue, expires)
			}
		},
		_set : function(key, jsonValue, expires) {
			localStorage.setItem(key, jsonValue);
			if (expires) {
				localStorage.setItem(getMetaKey(key), "(" + JSON2.stringify({
					createdon : new Date().getTime(),
					expires : new Date().getTime() + expires
				}) + ")")
			} else {
				localStorage.removeItem(getMetaKey(key))
			}
		},
		get : function(key) {
			var metaDataStr = localStorage.getItem(getMetaKey(key));
			if (metaDataStr) {
				var metaData;
				try {
					metaData = eval(metaDataStr)
				} catch(e) {
				}
				if (!metaData) {
					return this.remove(key)
				}
				var expires = Number(metaData.expires);
				if (expires && expires < new Date().getTime()) {
					return this.remove(key)
				}
			}
			var dataStr = localStorage.getItem(key);
			if (!dataStr) {
				return this.remove(key)
			}
			var data;
			try {
				data = eval(dataStr)
			} catch(e2) {
			}
			return data ? data : this.remove(key)
		},
		remove : function(key) {
			localStorage.removeItem(key);
			localStorage.removeItem(getMetaKey(key));
			return null
		},
		cleanup : function() {
			localStorage.setItem("last_cleanup", new Date().getTime());
			var keysToDelete = [];
			for (var i = 0, len = localStorage.length; i < len; i++) {
				var key = localStorage.key(i);
				if (key.indexOf(metaKeyPrefix) < 0) {
					keysToDelete.push(key)
				}
			}
			keysToDelete.forEach(this.get, this)
		}
	}
})();
var SetInfoBox = function() {
	var a;
	return {
		show : function(c) {
			c = c || {};
			c.header = c.header || loc("Edit Set Information");
			c.accounts = c.accounts || [];
			c.availableGroups = c.availableGroups || [];
			c.data = c.data || {};
			c.data.title = c.data.title || c.title;
			c.data.description = c.data.description || c.description;
			c.data.category = c.data.category || c.category;
			c.data.tags = (c.data.tags || c.tags || []).join(", ");
			c.data.groups = c.data.groups || c.groups || [];
			var b = [{
				type : "text",
				name : "title",
				label : loc("Title"),
				maxlength : 255
			}, {
				type : "textarea",
				name : "description",
				label : loc("Description"),
				placeholder : loc("Describe your style and add a #topic"),
				rows : 4,
				maxlength : 32768,
				highlight : true,
				highlight_fixedheight : true
			}, {
				type : "select",
				name : "category",
				label : loc("Category"),
				options : [{
					label : loc("Select a Category"),
					value : ""
				}, {
					label : loc("Fashion"),
					value : "fashion"
				}, {
					label : loc("Beauty"),
					value : "beauty"
				}, {
					label : loc("Home"),
					value : "home"
				}, {
					label : loc("Art & Expression"),
					value : "art"
				}],
				required : true,
				error : loc("Please select a category")
			}];
			if (c.availableGroups.length > 0) {
				b.push({
					type : "checkbox_list",
					name : "groups",
					label : loc("Groups"),
					options : c.availableGroups.map(function(g) {
						return {
							label : g.title,
							value : g.id
						}
					}),
					validators : [
					function(j, h, g) {
						return {
							valid : (j || []).length <= 5,
							msg : loc("Please select 5 groups or less")
						}
					}]

				})
			}
			if (c.accounts) {
				var f = c.accounts.filter(function(g) {
					return g.authorized && g.options && g.options.publish_default
				});
				if (f.length) {
					b.push({
						type : "quick_share",
						name : "quickshare",
						label : loc("Sharing"),
						inDialog : true,
						checked : true,
						services : c.accounts
					})
				} else {
					b.push({
						type : "hidden",
						name : "post_share",
						value : "1"
					})
				}
			}
			b.push({
				type : "buttons",
				buttons : [{
					type : "submit",
					label : loc("Publish")
				}, {
					type : "cancel",
					label : loc("Cancel"),
					onClick : ModalDialog.hide
				}]
			});
			var d = new Form({
				data : c.data,
				inputs : b
			});
			Event.addListener(d, "submit", function(g) {
				d.clean();
				var h = d.getData();
				var j = {
					title : h.title,
					description : h.description,
					category : h.category,
					tags : (h.tags || "").split(",").filter(function(k) {
						return !!k
					}),
					groups : h.groups || [],
					post_share : h.post_share
				};
				if (h.quickshare) {
					j.quickshare = h.quickshare.enabled ? "on" : "";
					j.quickshare_list = h.quickshare.services.join(",")
				}
				(c.onSave || noop)(j);
				return Event.stop(g)
			});
			ModalDialog.show_uic({
				title : c.header,
				body : d.getNode()
			});
			SetInfoBox.attachTagAutoComplete($("tags"))
		},
		hide : function() {
			ModalDialog.hide()
		},
		attachTagAutoComplete : function(b) {
			var c = DataSourceDataManager.getTagData();
			Event.addSingleUseListener(c, "loaded", function() {
				a = new AutoComplete(b, c, {
					toggleOnLoaded : true,
					maxSize : 20
				})
			});
			c.ensureLoaded()
		}
	}
}();
function StateMachine(a) {
	a = a || {};
	this._initialState = a.initialState;
	var b = {};
	a.transitions.forEach(function(c) {
		b[c.from] = b[c.from] || {};
		b[c.from][c.on] = c.to
	});
	this._currentState = null;
	this._transitionMap = b
}
StateMachine.SUCCESS = "__success__";
StateMachine.ERROR = "__error__";
StateMachine.prototype._setState = function(b) {
	var a = this._currentState;
	if (a === b) {
		return false
	}
	this._currentState = b;
	if (b === StateMachine.SUCCESS) {
		Event.trigger(this, "success")
	} else {
		if (b === StateMachine.ERROR) {
			Event.trigger(this, "error")
		}
	}
	if (a) {
		Event.trigger(this, a + "_exit")
	}
	Event.trigger(this, b + "_enter");
	return true
};
StateMachine.prototype.getState = function() {
	return this._currentState
};
StateMachine.prototype.start = function() {
	this._currentState = null;
	return this._setState(this._initialState)
};
StateMachine.prototype.transitionOn = function(a) {
	var b = this._currentState;
	var c = this._transitionMap[b][a];
	if (!c) {
		return false
	}
	return this._setState(c)
};
window.UI = window.UI || {};
UI._showNewMasthead = function() {
	return bucketIs("masthead", "on") || bucketIs("masthead", "megamenu")
};
var AuthenticationFlows = (function() {
	function c(j, k) {
		return function() {
			var l = {
				src : k.src,
				data : k.data,
				facebookHandler : Facebook.handleConnectSimple,
				twitterHandler : Twitter.handleConnectSimple,
				permissions : Facebook.connectPermissions().join(","),
				consumer : k.consumer,
				consumerThing : k.consumerThing,
				onCancel : function() {
					j.transitionOn("cancel")
				},
				onSignIn : function(m) {
					mergeObject(k.data, m);
					j.transitionOn("signin")
				},
				onRegister : function(m) {
					mergeObject(k.data, m);
					if (m.twitter_id) {
						j.transitionOn("register_twitter")
					} else {
						j.transitionOn("register")
					}
				}
			};
			if (k.showSignIn) {
				SignInDialog.show(l)
			} else {
				RegisterDialog.show(l)
			}
		}
	}

	function f(j, k) {
		return function() {
			if (k.data.show_ticker && window.Share && window.Share.facebookTickerDialog) {
				var l;
				if (k.data.has_seen_old_ticker) {
					l = Share.facebookTickerDialog("new", k.data.account_info)
				} else {
					l = Share.facebookTickerDialog("old", k.data.account_info)
				}
				Event.addSingleUseListener(l, "done", function() {
					j.transitionOn("done")
				})
			} else {
				j.transitionOn("done")
			}
		}
	}

	function d(j, k) {
		return function() {
			ChangeNameDialog.show({
				onCancel : function() {
					j.transitionOn("cancel")
				},
				onSuccess : function() {
					j.transitionOn("success")
				}
			})
		}
	}

	function g(j, k) {
		return function() {
			var l, m;
			Ajax.get({
				action : "thing.sets",
				data : {
					id : k.consumerThing.thing_id,
					length : 3,
					favs : 1,
					backfill : 1,
					shuffle : 1
				},
				onSuccess : function(n) {
					if (n.result && n.result.items) {
						l = n.result.items;
						m = n.result.backfill_link
					}
				},
				onFinally : function() {
					var n = {
						thingURL : buildURL("thing", {
							id : k.consumerThing.thing_id
						}),
						hideNext : true,
						submitLabel : loc("Done"),
						backfillLink : m,
						onCancel : function() {
							j.transitionOn("cancel")
						},
						onSuccess : function() {
							j.transitionOn("success")
						}
					};
					n.sets = l;
					ChangeNameDialog.show(n)
				}
			})
		}
	}

	function b(j, k) {
		return function() {
			Twitter.showTwitterRegistration({
				twitterInfo : k.data,
				onCancel : function() {
					Track.stat("inc", "twitter", ["ShowTwitterRegistration", "cancel"]);
					j.transitionOn("cancel")
				},
				onSuccess : function(l) {
					Track.stat("inc", "twitter", ["ShowTwitterRegistration", "success"]);
					mergeObject(k.data, l);
					j.transitionOn("success")
				}
			})
		}
	}

	function h(j, k) {
		return function() {
			FindFriends.servicesDialog("find", Auth.user().name);
			Event.addSingleUseListener(FindFriends, "done", function() {
				j.transitionOn("done")
			})
		}
	}

	function a(j, k) {
		return function() {
			if (!k.showSignIn) {
				var l = buildURL("home");
				Event.addSingleUseListener(LikeItToggle, "done", function() {
					window.location = l;
					return
				});
				if (k.src == "regupsell" || k.src == "nav") {
					window.location = l;
					return
				}
			}
			j.transitionOn("finalize")
		}
	}
	return {
		startPublish : function(k) {
			k = k || {};
			k.src = "publish";
			k.data = k.data || {};
			k.showSignIn = !!localStorage.getItem("signedInBefore");
			var j = new StateMachine({
				initialState : "authenticate",
				transitions : [{
					from : "authenticate",
					on : "cancel",
					to : StateMachine.ERROR
				}, {
					from : "authenticate",
					on : "signin",
					to : "timeline"
				}, {
					from : "authenticate",
					on : "register",
					to : "changeName"
				}, {
					from : "authenticate",
					on : "register_twitter",
					to : "twitterRegistration"
				}, {
					from : "twitterRegistration",
					on : "cancel",
					to : StateMachine.ERROR
				}, {
					from : "twitterRegistration",
					on : "success",
					to : "changeName"
				}, {
					from : "timeline",
					on : "done",
					to : StateMachine.SUCCESS
				}, {
					from : "changeName",
					on : "cancel",
					to : StateMachine.SUCCESS
				}, {
					from : "changeName",
					on : "success",
					to : StateMachine.SUCCESS
				}]
			});
			Event.addListener(j, "authenticate_enter", c(j, k));
			Event.addListener(j, "timeline_enter", f(j, k));
			Event.addListener(j, "changeName_enter", d(j, k));
			Event.addListener(j, "twitterRegistration_enter", b(j, k));
			Event.addListener(j, "success", function() {
				Event.release(j);
				(k.onSuccess || noop)()
			});
			Event.addListener(j, "error", function() {
				Event.release(j);
				(k.onCancel || noop)()
			});
			j.start()
		},
		startDefault : function(k) {
			k = k || {};
			k.data = k.data || {};
			var j = new StateMachine({
				initialState : "authenticate",
				transitions : [{
					from : "authenticate",
					on : "cancel",
					to : StateMachine.ERROR
				}, {
					from : "authenticate",
					on : "signin",
					to : "timeline"
				}, {
					from : "authenticate",
					on : "register",
					to : "changeName"
				}, {
					from : "authenticate",
					on : "register_twitter",
					to : "twitterRegistration"
				}, {
					from : "twitterRegistration",
					on : "cancel",
					to : StateMachine.ERROR
				}, {
					from : "twitterRegistration",
					on : "success",
					to : "changeName"
				}, {
					from : "timeline",
					on : "done",
					to : "redirect"
				}, {
					from : "changeName",
					on : "cancel",
					to : "findFriends"
				}, {
					from : "changeName",
					on : "success",
					to : "findFriends"
				}, {
					from : "findFriends",
					on : "done",
					to : "redirect"
				}, {
					from : "redirect",
					on : "finalize",
					to : StateMachine.SUCCESS
				}]
			});
			Event.addListener(j, "authenticate_enter", c(j, k));
			Event.addListener(j, "timeline_enter", f(j, k));
			Event.addListener(j, "changeName_enter", d(j, k));
			Event.addListener(j, "twitterRegistration_enter", b(j, k));
			Event.addListener(j, "findFriends_enter", h(j, k));
			Event.addListener(j, "redirect_enter", a(j, k));
			Event.addListener(j, "success", function() {
				Event.release(j);
				(k.onSuccess || noop)()
			});
			Event.addListener(j, "error", function() {
				Event.release(j);
				(k.onCancel || noop)()
			});
			j.start()
		},
		startConsumer : function(k) {
			k = k || {};
			k.data = k.data || {};
			k.showSignIn = !!localStorage.getItem("signedInBefore");
			var j = new StateMachine({
				initialState : "authenticate",
				transitions : [{
					from : "authenticate",
					on : "cancel",
					to : StateMachine.ERROR
				}, {
					from : "authenticate",
					on : "signin",
					to : "timeline"
				}, {
					from : "authenticate",
					on : "register",
					to : "changeNameConsumer"
				}, {
					from : "authenticate",
					on : "register_twitter",
					to : "twitterRegistration"
				}, {
					from : "twitterRegistration",
					on : "cancel",
					to : StateMachine.ERROR
				}, {
					from : "twitterRegistration",
					on : "success",
					to : "changeNameConsumer"
				}, {
					from : "timeline",
					on : "done",
					to : StateMachine.SUCCESS
				}, {
					from : "changeNameConsumer",
					on : "cancel",
					to : StateMachine.SUCCESS
				}, {
					from : "changeNameConsumer",
					on : "success",
					to : StateMachine.SUCCESS
				}]
			});
			Event.addListener(j, "authenticate_enter", c(j, k));
			Event.addListener(j, "timeline_enter", f(j, k));
			Event.addListener(j, "changeNameConsumer_enter", g(j, k));
			Event.addListener(j, "twitterRegistration_enter", b(j, k));
			Event.addListener(j, "success", function() {
				Event.release(j);
				(k.onSuccess || noop)()
			});
			Event.addListener(j, "error", function() {
				Event.release(j);
				(k.onCancel || noop)()
			});
			j.start()
		}
	}
})();
var SignInBox = function() {
	return {
		signInOrRegister : function(a) {
			a = a || {};
			a.showSignIn = !!localStorage.getItem("signedInBefore");
			if (a.consumerThing) {
				AuthenticationFlows.startConsumer(a)
			} else {
				AuthenticationFlows.startDefault(a)
			}
		},
		signIn : function(a) {
			a = a || {};
			a.showSignIn = true;
			if (a.consumerThing) {
				AuthenticationFlows.startConsumer(a)
			} else {
				AuthenticationFlows.startDefault(a)
			}
		},
		register : function(a) {
			a = a || {};
			a.showSignIn = false;
			AuthenticationFlows.startDefault(a)
		},
		signOut : function() {
			var a = createForm({
				action : buildURL("login.logout", null, null, "http"),
				inputs : [{
					name : "click",
					type : "hidden",
					value : loc("Sign out")
				}, {
					name : ".noui",
					type : "hidden",
					value : 1
				}]
			});
			document.body.appendChild(a);
			hiddenPost(a)
		},
		initNav : function(b) {
			b = $(b);
			if (!b || !b.parentNode) {
				return
			}
			var c = b.parentNode;
			var a = [$(b)];
			Event.addListener(Event.BACKEND, "signin", function(k, n, l, p, d) {
				a.forEach(function(z) {
					if (z && z.parentNode) {
						z.parentNode.removeChild(z);
						purge(z, true)
					}
				});
				a = [];
				var y = Auth.user();
				var s = new RegExp("^activity");
				var r = s.test(window.polyvore_page_name);
				var x;
				if (UI._showNewMasthead()) {
					x = createNode("div", {
						className : "activity"
					})
				} else {
					x = createNode("td", {
						id : "nav_activity",
						className : r ? "select" : ""
					})
				}
				if (d > 50) {
					d = "50+"
				}
				var u = x.appendChild(createNode("a", {
					className : "unread_activity",
					href : buildURL("activity")
				}, null, d.toString()));
				if (!d) {
					addClass(u, "zero")
				}
				if (!UI._showNewMasthead()) {
					c.appendChild(x);
					a.push(x)
				}
				var j = window.polyvore_page_name == "profile";
				var f = buildURL("profile", {
					id : y.id,
					name : y.name
				});
				var q = parsePolyvoreURL(window.location.href);
				var w = q.action;
				var t = q.args.filter;
				var o = (w == "profile") && (q.args.name == y.name);
				var v = [{
					label : loc("Profile"),
					url : buildURL("profile", {
						id : y.id,
						name : y.name
					}),
					selected : o && !t
				}];
				v.push({
					className : "separated",
					label : loc("Sets"),
					url : buildURL("profile", {
						filter : "sets",
						id : y.id,
						name : y.name
					}),
					selected : o && (t == "sets")
				}, {
					label : loc("Items"),
					url : buildURL("profile", {
						filter : "items",
						id : y.id,
						name : y.name
					}),
					selected : o && (t == "items")
				}, {
					label : loc("Collections"),
					url : buildURL("profile", {
						filter : "collections",
						id : y.id,
						name : y.name
					}),
					selected : o && (t == "collections")
				}, {
					label : loc("Likes"),
					url : buildURL("profile", {
						filter : "likes",
						id : y.id,
						name : y.name
					}),
					selected : o && (t == "likes")
				}, {
					label : loc("Following"),
					url : buildURL("profile", {
						filter : "following",
						id : y.id,
						name : y.name
					}),
					selected : o && (t == "following")
				}, {
					label : loc("Followers"),
					url : buildURL("profile", {
						filter : "followers",
						id : y.id,
						name : y.name
					}),
					selected : o && (t == "followers")
				});
				if (!Auth.isSponsorUser()) {
					v.push({
						label : loc("Groups"),
						url : buildURL("profile", {
							filter : "groups",
							id : y.id,
							name : y.name
						}),
						selected : o && (t == "groups")
					})
				}
				v.push({
					className : "separated",
					label : loc("Settings"),
					url : buildURL("profile.edit"),
					selected : w == "profile.edit"
				}, {
					label : loc("Sign out"),
					selected : w == "login.logout",
					url : buildURL("login.logout")
				});
				var g = j ? "select" : "";
				if (UI._showNewMasthead()) {
					g += "main_nav"
				}
				var h = createNode("td", {
					id : "nav_profile",
					className : g
				});
				var m = UI.renderBuddyIcon({user_id:y.id,user_name:y.name,buddyicon:y.buddyicon},"li2").childNodes[0];
				removeClass(m, "bordered");
				removeClass(m, "buddyicon");
				addClass(m, "buddy_icon");
				if (UI._showNewMasthead()) {
					h.appendChild(UI.renderSubnav({
						label : [m, createNode("span", null, null, y.name)],
						url : f,
						arrow : false,
						dock : "br",
						subnav : v
					}))
				} else {
					h.appendChild(UI.renderSubnav({
						label : [m, createNode("span", null, null, y.name)],
						url : f,
						arrow : true,
						dock : "br",
						subnav : v
					}))
				}
				if (UI._showNewMasthead()) {
					h.appendChild(x)
				}
				c.appendChild(h);
				a.push(h)
			})
		}
	}
}();
var SignInDialog = (function() {
	return {
		show : function(l) {
			l = l || {};
			var j = l.onCancel || noop;
			var k = l.onSignIn || noop;
			var h = l.onRegister || noop;
			var g = window.polyvore_page_name;
			if (l.src === undefined) {
				l.src = "unknown"
			}
			var c = createNode("span", {
				className : "clickable"
			}, null, loc("Don't have an account?"));
			var a = new Form({
				id : "signin_dialog",
				method : "POST",
				action : buildURL("login.login", null, null, "https"),
				data : l.data,
				inputs : [{
					type : "hidden",
					name : "page",
					value : g
				}, {
					type : "hidden",
					name : "src",
					value : l.src
				}, {
					type : "html",
					value : createNode("h1", null, null, loc("Sign in to Polyvore"))
				}, {
					type : "extsvc_connect",
					facebook : true,
					twitter : true,
					signin : true,
					done : window.location.href,
					page : g,
					src : l.src
				}, {
					type : "html",
					value : [createNode("hr"), createNode("h2", null, null, loc("Or Use Your Polyvore Account")), createNode("div", null, null, c)]
				}, {
					type : "text",
					name : "email",
					label : loc("Email or Username"),
					required : true,
					lowercase : true,
					validators : [Validate.emailOrUserName]
				}, {
					type : "password",
					name : "password",
					label : loc("Password"),
					hint : createNode("a", {
						href : buildURL("forgot-password")
					}, null, loc("Forgot password?")),
					required : true
				}, {
					type : "html",
					value : createNode("div", {
						className : "error",
						id : "signin_error"
					})
				}, {
					type : "buttons",
					buttons : [{
						id : "signInButton",
						type : "submit",
						label : loc("Sign in")
					}, {
						type : "cancel",
						label : loc("Cancel"),
						onClick : ModalDialog.hide
					}]
				}]
			});
			var f = new Cleaner();
			f.push(Event.addSingleUseListener(ModalDialog, "hide", function() {
				f.clean();
				j()
			}, this));
			f.push(Event.addSingleUseListener(c, "click", function() {
				f.clean();
				ModalDialog.hide();
				l.data = a.getData();
				RegisterDialog.show(l)
			}, this));
			var b = false;
			var d = null;
			f.push(Event.addListener(a, "submit", function(n) {
				if (b) {
					return
				}
				var m = $("signInButton");
				setNode(m, {
					value : loc("Signing in") + "...",
					disabled : "disabled"
				});
				if (!d) {
					var o = setTimeout(function() {
						window.location = buildURL("login", {
							timeout : 1,
							".done" : window.location.href
						})
					}, 30000);
					d = Event.addListener(Event.BACKEND, "signin", function(r, p, s, q) {
						clearTimeout(o);
						f.clean();
						ModalDialog.hide();
						k({
							".user" : {
								xsrf : r,
								buddyicon : p,
								id : s,
								name : q
							}
						})
					});
					f.push(d);
					f.push(Event.addListener(Event.BACKEND, "signin_error", function(p) {
						clearTimeout(o);
						var q = $("signin_error");
						setNode(q, null, null, p);
						m.value = loc("Sign in");
						m.removeAttribute("disabled");
						ModalDialog.rePosition()
					}))
				}
				b = true;
				Event.stop(n);
				hiddenPost(a.getNode());
				b = false;
				return
			}));
			Beacon.log("view", {
				name : "loginform",
				src : l.src
			});
			return ModalDialog.show_uic(a.getNode())
		}
	}
})();
var RegisterDialog = (function() {
	return {
		show : function(p) {
			p = p || {};
			var l = p.onCancel || noop;
			var n = p.onSignIn || noop;
			var j = p.onRegister || noop;
			var h = window.polyvore_page_name;
			if (!p.src) {
				p.src = "unknown"
			}
			var d = createNode("span", {
				className : "clickable"
			}, null, loc("Already have an account?"));
			var o = loc("Or Use Your Email");
			var k = loc("Create an Account");
			if (p.src == "regupsell") {
				k = loc("Discover your style");
				o = loc("Register Using Your Email")
			}
			var f = [{
				type : "hidden",
				name : "page",
				value : h
			}, {
				type : "hidden",
				name : "src",
				value : p.src
			}, {
				type : "html",
				value : createNode("h1", null, null, k)
			}, {
				type : "extsvc_connect",
				facebook : true,
				twitter : true,
				signin : false,
				done : window.location.href,
				page : h,
				src : p.src
			}, {
				type : "html",
				value : [createNode("hr"), createNode("h2", null, null, o), createNode("div", null, null, d)]
			}, {
				type : "text",
				name : "email",
				label : loc("Email"),
				required : true,
				validators : [Validate.email],
				hint : loc("We will never share this with anyone")
			}, {
				type : "password",
				name : "password",
				label : loc("Password"),
				required : true
			}, {
				type : "checkbox",
				name : "discoverable",
				id : "discoverable",
				value : loc("Let my friends find me on Polyvore via Facebook, Twitter, or email"),
				defaultChecked : 1
			}, {
				type : "hidden",
				name : "src",
				value : p.src
			}, {
				type : "hidden",
				name : "page",
				value : h
			}, {
				type : "html",
				value : createNode("div", {
					className : "error",
					id : "register_error"
				})
			}, {
				type : "buttons",
				buttons : [{
					type : "submit",
					id : "registerButton",
					label : loc("Create account")
				}, {
					type : "cancel",
					label : loc("Cancel"),
					onClick : ModalDialog.hide
				}]
			}, {
				type : "html",
				value : createNode("div", {
					id : "terms_privacy",
					className : "meta"
				}, null, loc("By clicking {register} you are indicating that you have read and agreed to the {terms} and {policy}", {
					register : createNode("strong", null, null, loc("Create account")),
					terms : outerHTML(createNode("a", {
						href : buildURL("terms-of-service")
					}, null, loc("Terms of Service"))),
					policy : outerHTML(createNode("a", {
						href : buildURL("privacy-policy")
					}, null, loc("Privacy Policy")))
				}))
			}];
			if (p.consumer) {
				f.push({
					type : "hidden",
					name : "consumer",
					value : p.consumer
				}, {
					type : "hidden",
					name : "consumer_thing_id",
					value : p.consumerThing.thing_id
				})
			}
			var b = new Form({
				id : "register_dialog",
				method : "POST",
				action : buildURL("register.register", null, null, "https"),
				data : p.data,
				inputs : f
			});
			var g = new Cleaner();
			g.push(Event.addSingleUseListener(ModalDialog, "hide", function() {
				g.clean();
				l()
			}, this));
			g.push(Event.addSingleUseListener(d, "click", function() {
				g.clean();
				ModalDialog.hide();
				p.data = b.getData();
				SignInDialog.show(p)
			}, this));
			var c = false;
			var m = null;
			g.push(Event.addListener(b, "submit", function(r) {
				if (c) {
					return
				}
				var q = $("registerButton");
				setNode(q, {
					value : loc("Creating account") + "...",
					disabled : "disabled"
				});
				if (!m) {
					var s = setTimeout(function() {
						window.location = buildURL("register", {
							timeout : 1,
							".done" : window.location.href
						})
					}, 30000);
					m = Event.addListener(Event.BACKEND, "register", function(u, t) {
						var v = {
							name : "register_success",
							src : p.src,
							page : h,
							client : "desktop"
						};
						Beacon.log("register", v);
						clearTimeout(s);
						g.clean();
						ModalDialog.hide();
						j({
							name : u,
							buddyicon : t
						})
					});
					g.push(m);
					g.push(Event.addListener(Event.BACKEND, "signin", function(v, t, w, u) {
						clearTimeout(s);
						g.clean();
						ModalDialog.hide();
						n({
							".user" : {
								xsrf : v,
								buddyicon : t,
								id : w,
								name : u
							}
						})
					}));
					g.push(Event.addListener(Event.BACKEND, "register_error", function(t) {
						var u = {
							name : "register_failure",
							src : p.src,
							page : h,
							client : "desktop"
						};
						var v = $("register_error");
						Beacon.log("register_failure", u);
						setNode(v, null, null, t);
						setNode(q, {
							value : loc("Create account")
						});
						q.removeAttribute("disabled");
						ModalDialog.rePosition()
					}))
				}
				c = true;
				Event.stop(r);
				hiddenPost(b.getNode());
				c = false
			}));
			var a = {
				name : "registerform",
				src : p.src,
				page : h,
				client : "desktop"
			};
			Beacon.log("view", a);
			return ModalDialog.show_uic(b.getNode())
		}
	}
})();
var ChangeNameDialog = (function() {
	return {
		show : function(q) {
			q = q || {};
			var g = q.user || Auth.user();
			var m = q.sets || [];
			var f = q.things || [];
			var p = q.onCancel || noop;
			var n = q.onSuccess || noop;
			var c = q.hideNext;
			var a = q.submitLabel || loc("Next");
			var l = new Cleaner();
			var k = [];
			var b;
			if (q.changeName) {
				k.push({
					type : "username",
					label : loc("Username"),
					name : "name",
					hint : loc("Use only lowercase characters (a-z), numbers (0-9) and dashes (-)."),
					required : true
				})
			} else {
				var h = createNode("div", {
					className : "clickable"
				}, null, loc("Change") + "&hellip;");
				l.push(Event.addListener(h, "click", function(r) {
					l.clean();
					d.clean();
					ModalDialog.hide();
					q.changeName = true;
					ChangeNameDialog.show(q)
				}));
				k.push({
					type : "html",
					value : [createNode("div", {
						className : "detail clearfix box"
					}, null, [UI.renderBuddyIcon(g, "t2", true), createNode("div", {
						className : "filling_block"
					}, null, [createNode("div", null, null, loc("Your username is {username}", {
						username : outerHTML(createNode("strong", null, null, g.name))
					})), h])])]
				});
				k.push({
					type : "hidden",
					name : "name",
					value : g.name
				})
			}
			if (m.length) {
				b = q.backfillLink ? "sets_backfill" : "sets";
				var o = createNode("a", {
					href : q.thingURL + "#sets",
					target : "_blank",
					oid : "st:sets"
				}, null, loc("See how our members styled it"));
				if (q.backfillLink) {
					o = createNode("a", {
						href : q.backfillLink,
						target : "_blank",
						oid : "st:sets_backfill"
					}, null, loc("See top styles by our members"))
				}
				var j = "s2";
				k.push({
					type : "html",
					value : [createNode("div", {
						className : "box",
						trackcontext : b
					}, null, [createNode("div", {
						className : "box"
					}, null, [createNode("h3", null, null, loc("Your item is saved. {setsLink}", {
						setsLink : o
					}))]), UI.layoutN(m, {
						n : 3,
						size : j,
						renderer : function(r) {
							r.imgurl = buildImgURL("img-set", {
								cid : r.id,
								spec_uuid : r.spec_uuid,
								size : UI.sizeMap[j].url,
								".out" : "jpg"
							});
							return createNode("div", {
								className : "item"
							}, null, [UI.renderItem(r, {
								size : j,
								target : "_blank",
								oid : "st:set"
							}), createNode("div", {
								className : "item_meta"
							}, null, [loc("by "), createNode("a", {
								href : buildURL("profile", {
									id : r.user_id,
									name : r.user_name
								}),
								target : "_blank",
								oid : "st:profile"
							}, null, r.user_name)])])
						}
					})])]
				})
			}
			if (!c || q.changeName) {
				k.push({
					type : "buttons",
					buttons : [{
						id : "submitBtn",
						type : "submit",
						label : a
					}]
				})
			}
			var d = new Form({
				id : "change_name_dialog",
				action : "register.change_auto_name",
				data : {
					name : g.name
				},
				inputs : k
			});
			l.push(Event.addListener(d, "submit", function(r) {
				var s = d.getData();
				setNode($("submitBtn"), {
					disabled : "disabled",
					value : loc("Saving") + "..."
				});
				Ajax.post({
					action : "register.change_auto_name",
					data : s,
					onSuccess : function(t) {
						l.clean();
						d.clean();
						ModalDialog.hide();
						n(t)
					},
					onError : function(t) {
						Feedback.messageFromResponse(t);
						setNode($("submitBtn"), {
							disabled : undefined,
							value : a
						})
					}
				});
				return Event.stop(r)
			}));
			l.push(Event.addListener(ModalDialog, "hide", function() {
				l.clean();
				d.clean();
				p()
			}));
			if (b) {
				Event.addSingleUseListener(ModalDialog, "show", function() {
					Track.trackCTR(b, ["st"])
				})
			}
			document.body.appendChild(createNode("img", {
				id : "fb_pixel_reg",
				height : "1",
				width : "1",
				src : "https://www.facebook.com/offsite_event.php?id=6009423253634&value=1&currency=USD"
			}, {
				display : "none"
			}));
			return ModalDialog.show_uic({
				title : loc("Welcome to Polyvore!"),
				body : d.getNode()
			})
		}
	}
})();
function CheckAvailability(j, c, m, a) {
	var l = this;
	l.available = a;
	var h;
	function g() {
		l.available = false;
		addClass(c, "hidden");
		addClass(m, "hidden")
	}

	function f(n) {
		l.available = false;
		setNode(c, {
			className : "invalid"
		}, null, loc("Taken"));
		removeClass(c, "hidden");
		if (m) {
			clearNode(m);
			replaceChild(m, createNode("div", null, null, loc("The following user names are available:")));
			var o = m.appendChild(createNode("ul"));
			n.forEach(function(p) {
				var q = o.appendChild(createNode("li", {
					className : "clickable"
				}, null, p));
				Event.addListener(q, "click", function() {
					h.value = p;
					d()
				})
			});
			removeClass(m, "hidden")
		}
	}

	function d() {
		l.available = true;
		addClass(m, "hidden");
		setNode(c, {
			className : "valid"
		}, null, loc("Available"));
		removeClass(c, "hidden")
	}

	function b(n) {
		h = $(j);
		c = $(c);
		m = $(m);
		if (!Validate.userName(n).valid) {
			return g()
		}
		Ajax.get({
			hideProgress : true,
			action : "register.check_availability",
			data : {
				name : n
			},
			contract : this,
			onSuccess : Event.wrapper(function(o) {
				this.available = !!o.available;
				return this.available ? d() : f(o.suggestions)
			}, this)
		})
	}

	var k = new Monitor(function() {
		return j.value
	});
	Event.addListener(k, "change", delayed(Event.wrapper(b, this), 500));
	if (j.value) {
		b(j.value)
	}
}

function VerifyPassword(c, a, b) {
	function d() {
		var g = c.value;
		var f = a.value;
		if (f.length > 0 && g != f) {
			return setNode(b, {
				className : "invalid"
			}, null, loc("Please enter the same password"))
		}
		if (g.length === 0) {
			return setNode(b, {
				className : "invalid"
			}, null, loc("Password cannot be empty"))
		} else {
			return setNode(b, {
				className : null
			}, null, "")
		}
	}
	Event.addListener(c, "blur", d);
	Event.addListener(a, "blur", d)
}

function Polygon(a) {
	if ( a instanceof Rect) {
		a = [new Point(a.x1, a.y1), new Point(a.x2, a.y1), new Point(a.x2, a.y2), new Point(a.x1, a.y2)]
	}
	this.pts = a || []
}
Polygon.prototype.bounds = function() {
	var c = -Infinity;
	var b = -Infinity;
	var a = Infinity;
	var d = Infinity;
	this.pts.forEach(function(f) {
		c = Math.max(f.x, c);
		a = Math.min(f.x, a);
		b = Math.max(f.y, b);
		d = Math.min(f.y, d)
	});
	return new Rect(a, d, c, b)
};
Polygon.prototype.transform = function(b, a) {
	a = a || this.center();
	this.pts = this.pts.map(function(c) {
		return b.transform(c.x, c.y, a)
	});
	return this
};
Polygon.prototype.translate = function(b, a) {
	this.pts = this.pts.map(function(c) {
		c.x += b;
		c.y += a;
		return c
	});
	return this
};
Polygon.prototype.scale = function(c, b, a) {
	a = a || this.center();
	this.pts = this.pts.map(function(d) {
		d.x = (d.x - a.x) * c + a.x;
		d.y = (d.y - a.y) * b + a.y;
		return d
	});
	return this
};
Polygon.prototype.center = function() {
	return this.bounds().center()
};
function Montage(a, c, b) {
	if (!b) {
		b = {}
	}
	this.contest = b.contest;
	this.lookbooks = b.lookbooks;
	this.productPlacement = b.product_placement;
	this.maxSetItems = b.max_set_items;
	this.categories = b.categories || {};
	this.prefillNotes = b.prefill_notes;
	this.prefillTitle = b.prefill_title;
	this.prefillCategory = b.prefill_category;
	this.template_edit = b.template_edit;
	this.setUserInfo(b.user_info);
	this.state = "clean";
	this.canvas = new Canvas();
	this.canvas.init(a);
	this.palette = new TabBox(c, {
		bordered : true,
		autoAdjustTabDim : true,
		allowNewTab : false,
		tabSelectionStrategy : "leftmost,lastunclosable"
	});
	this.cid = null;
	this.did = null;
	this.basedon_tid = null;
	this.tid = null;
	this.info = new Props();
	this.info.update({
		title : null,
		description : null,
		category : null,
		tags : null,
		groups : null
	});
	Event.addListener(document, "modifiable", this.onLoad, this);
	Event.addListener(window, "beforeunload", this.onUnLoad, this);
	Event.addListener(window, "resize", this.onResize, this);
	Event.addListener(a, "drop", this.onCanvasDrop, this);
	this.availableActions = {};
	this.enabledActions = [];
	this._undo = new Undo();
	this.defaultControlsState = this.template_edit ? "editTemplate" : "editSet";
	this.setControlsState(this.defaultControlsState);
	this._birth = Math.round(new Date().getTime() / 1000);
	addClass(a, "default")
}
Montage.prototype.setUserInfo = function(a) {
	if (!a) {
		a = {}
	}
	this.isUserTrusted = a.is_user_trusted;
	this.myGroups = a.my_groups;
	this.accounts = a.accounts || [];
	Event.addListener(Event.BACKEND, "oauth_unconnect", function(b) {
		for (var c = 0; c < this.accounts.length; c++) {
			if (this.accounts[c].service == b) {
				this.accounts[c].authorized = false;
				Event.trigger(this.accounts, "change", this.accounts[c]);
				break
			}
		}
	}, this);
	Event.addListener(Event.BACKEND, "oauth_connect", function(b) {
		for (var c = 0; c < this.accounts.length; c++) {
			if (this.accounts[c].service == b.service) {
				mergeObject(this.accounts[c].service, b);
				Event.trigger(this.accounts, "change", this.accounts[c]);
				break
			}
		}
	}, this);
	Event.trigger(this, "userinfo")
};
Montage.prototype.setContainerSize = function() {
	var b = getWindowSize();
	var a = b.h - Rect.fromNode($("app")).top();
	setNode($("app"), null, {
		height : px(a - 9)
	});
	setNode($("canvas"), null, {
		height : px(a - 18)
	})
};
Montage.prototype.onLoad = function() {
	this.init()
};
Montage.prototype.onResize = function() {
	this.setContainerSize()
};
Montage.prototype.clear = function(a) {
	a = a || {};
	this.info.update({
		title : null,
		description : null,
		category : null,
		tags : null,
		groups : null
	});
	this.cid = null;
	this.did = null;
	this.basedon_tid = null;
	this.tid = null;
	this.setControlsState(this.defaultControlsState);
	this.canvas.clear();
	this.modified = false;
	this.transitState("new");
	this.status();
	this._clearUndo()
};
Montage.prototype.init = function() {
	this.setContainerSize();
	var a = this.canvas;
	Event.addListener(a, "select", this.onSelect, this);
	Event.addListener(a, "unselect", this.onUnSelect, this);
	Event.addListener(a, "updateactions", this.updateActions, this);
	Event.addListener(a, "change", this.onCanvasChange, this);
	Event.addListener(this, "saved", this.onSaved, this);
	this.statusBar = a.appendControl(createNode("div", {
		className : "statusbar"
	})).appendChild(createNode("div", {
		id : "statustext"
	}));
	Event.addListener(Event.BACKEND, "loaditem", this.loadItem, this);
	Event.addListener(Event.BACKEND, "loadset", this.onLoadSet, this);
	Event.addListener(Event.BACKEND, "loadtemplate", this.onLoadTemplate, this);
	Event.addListener(Event.BACKEND, "loaddraft", this.onLoadDraft, this);
	Event.addListener(Event.BACKEND, "filltemplate", this.onFillTemplate, this);
	Event.addListener(Event.BACKEND, "signin", this.onSignIn, this);
	Event.addListener(Event.BACKEND, "oauth_connect", this.refreshUserInfo, this);
	Event.addListener(Event.BACKEND, "deleteset", function(b) {
		if (this.cid == b) {
			this.clear()
		}
	}, this);
	Event.addListener(Event.BACKEND, "deletedraft", function(b) {
		if (this.did == b) {
			this.clear()
		}
	}, this);
	Event.addListener(Event.BACKEND, "deletetemplate", function(b) {
		if (this.tid == b) {
			this.clear()
		}
	}, this);
	Event.checkForBackendEvent();
	this._clearUndo()
};
Montage.prototype.status = function(b, a) {
	if (b) {
		setNode(this.statusBar, {
			className : a || "alert"
		}, null, b)
	} else {
		setNode(this.statusBar, {
			className : ""
		})
	}
};
Montage.prototype.updateActions = function() {
	clearNode(this.actions);
	clearNode(this.itemInfo);
	clearNode(this.bgBtns);
	hide(this.bgBtns);
	hide(this.itemInfo);
	var d = this.canvas.getSelected();
	var k = d.size();
	if (k === 0) {
		return
	}
	var c = d.getActions() || {};
	mergeObject(c, this.availableActions);
	var b = this.enabledActions;
	var j = {};
	var h = 0;
	var f = 0;
	if (c.hidebkgd_btn) {
		j.hidebkgd_btn = c.hidebkgd_btn;
		++h;
		if (!j.hidebkgd_btn.disabled) {++f
		}
	}
	if (c.showbkgd_btn) {
		j.showbkgd_btn = c.showbkgd_btn;
		++h;
		if (!j.showbkgd_btn.disabled) {++f
		}
	}
	if (c.cropbkgd_btn) {
		j.cropbkgd_btn = c.cropbkgd_btn;
		++h;
		if (!j.cropbkgd_btn.disabled) {++f
		}
	}
	if (h >= 2) {
		c.bg_btns = j;
		delete c.hidebkgd_btn;
		delete c.showbkgd_btn;
		delete c.cropbkgd_btn
	}
	var g = {};
	["arrange_top_btn", "arrange_middle_btn", "arrange_bottom_btn", "arrange_left_btn", "arrange_center_btn", "arrange_right_btn", "arrange_spread_horizontal_btn", "arrange_spread_vertical_btn"].forEach(function(l) {
		g[l] = c[l];
		delete c[l]
	});
	c.arrange_btns = g;
	b.forEach(function(m) {
		var p = m.id;
		var o = c[p];
		if (!o || o.disabled || (k > 1 && m.single) || (k == 1 && m.multi)) {
			return
		}
		if ( typeof (o) == "object") {
			var n = o;
			o = [];
			b.forEach(function(q) {
				if (n[q.id]) {
					o.push(q);
					q.method = n[q.id];
					q.text = q.shortTitle || q.title;
					q.selected = q.method.selected;
					q.icon = q.method.icon
				}
			})
		}
		m.trackelement = p;
		if (m.id == "bg_btns") {
			o.forEach(function(r) {
				var q = createNode("div", {
					title : r.alt,
					id : r.id,
					className : "bordered interactive bg_btn " + (r.selected ? "selected" : ""),
					trackelement : r.trackelement
				}, null, r.icon);
				this.addControlTooltip(q);
				Event.addListener(q, "click", r.method);
				this.bgBtns.appendChild(q)
			}, this)
		} else {
			var l = UI.renderEditorItemAction(d, m, o);
			this.addControlTooltip(l);
			addList(this.actions, l, {
				className : "controls " + m.id
			})
		}
	}, this);
	if (this.bgBtns.childNodes.length) {
		show(this.bgBtns)
	}
	var a = d.getInfo();
	if (a) {
		show(this.itemInfo);
		replaceChild(this.itemInfo, a)
	}
	if (this._ttAnchors) {
		this._ttAnchors.values().forEach(function(l) {
			if (!isAttachedToDom(l)) {
				this._ttAnchors.remove(l)
			}
		}, this)
	}
};
Montage.prototype.addControlTooltip = function(a) {
	var b = a.title;
	if (!b) {
		return
	}
	setNode(a, {
		title : ""
	});
	if (!this._ttNode) {
		this._ttNode = createNode("div", {
			className : "control_tt"
		});
		this._ttAnchors = new Set();
		Event.addListener(this, "updatecontrols", function() {
			hide(this._ttNode)
		}, this)
	}
	this._ttAnchors.put(a);
	show(this._ttNode);
	setNode(this._ttNode, null, null, b);
	getNaturalRect(this._ttNode, function(c) {
		document.body.appendChild(this._ttNode);
		hide(this._ttNode);
		Event.addListener(a, "click", function(d) {
			hide(this._ttNode)
		}, this);
		Event.addListener(a, "mouseout", function(d) {
			hide(this._ttNode)
		}, this);
		Event.addListener(a, "mousepause600", function() {
			if (a.getAttribute("disabled")) {
				return
			}
			var f = Rect.fromNode(a);
			var h = f.center().y;
			var g = f.right();
			var d = Rect.fromNode(this.canvas.getNode());
			if (h < d.top() || g < d.left()) {
				return
			}
			setNode(this._ttNode, null, {
				left : px(g),
				top : px(h)
			}, b);
			show(this._ttNode)
		}, this)
	}, this)
};
Montage.prototype.onSelect = function(a) {
	this.updateActions()
};
Montage.prototype.onUnSelect = function() {
	this.updateActions()
};
Montage.prototype.onCanvasChange = function() {
	var c = this.info.get("title");
	var b = this.canvas.getItems();
	if (b.length === 0) {
		this.modified = false
	} else {
		this.modified = true;
		Event.trigger(this, "modified")
	}
	this._recordUndoState();
	this.updateControls();
	this.transitState("edit");
	if (this.controlsState === "fillTemplate" && b && b.length) {
		var a = b.filter(function(d) {
			return d instanceof PlaceholderItem && !d.hasContent()
		});
		if (a.length === 0) {
			Event.trigger(this, "template_filled")
		}
	}
};
Montage.prototype.onSaved = function(b, a) {
	this.onNotModified()
};
Montage.prototype.onNotModified = function() {
	this.modified = false;
	this._notModifiedState = this._undo.present();
	this.updateControls()
};
Montage.prototype.saveOrDiscard = function(a) {
	ModalDialog.show_uic({
		title : a.title || loc("You have unsaved changes, what would you like to do with them?"),
		actions : [{
			label : createNode("span", {
				className : "btn btn_action"
			}, null, loc("Save")),
			action : function() {
				(a.onSave || noop)();
				ModalDialog.hide()
			}
		}, {
			label : createNode("span", null, null, loc("Discard")),
			action : function() {
				(a.onDiscard || noop)();
				ModalDialog.hide()
			}
		}],
		className : "confirm"
	})
};
Montage.prototype.confirmDiscard = function() {
	if (this.modified) {
		return confirm(loc("Are you sure you want to discard your changes?"))
	} else {
		return true
	}
};
Montage.prototype.validate = function() {
	this.validateErrorMsg = "";
	var a = 0;
	var b = false;
	this.canvas.getItems().forEach(function(c) {
		if (c.constructor != TextItem && c.constructor != ColorBlockItem && c.constructor != SimpleImageItem) {
			a++
		}
		if (c.constructor == PlaceholderItem && c.hasContent()) {
			b = true
		}
	});
	if (a < 2) {
		this.validateErrorMsg = loc("Sets need at least two products.");
		return false
	}
	if (this.basedon_tid && !b) {
		this.validateErrorMsg = loc("You must fill at least 1 placeholder.");
		return false
	}
	return true
};
Montage.prototype.showPublishDialog = function(d, c) {
	if (!this.validate()) {
		Event.trigger(this, "saveerror");
		ModalDialog.alert(this.validateErrorMsg);
		return
	}
	Event.trigger(this, "saveview");
	var b = this.prefillTitle || "";
	var a = this.prefillNotes || "";
	if (c) {
		b = c.prefs.prefill_title;
		a = c.prefs.prefill_notes
	}
	SetInfoBox.show({
		isNewSet : this.cid ? false : true,
		header : c ? loc("Publish set and enter contest") : loc("Publish set"),
		saveLabel : c ? loc("Enter contest") : loc("Publish"),
		title : this.info.get("title") || b,
		description : this.info.get("description") || a,
		category : this.info.get("category") || this.prefillCategory,
		tags : this.info.get("tags"),
		groups : this.info.get("groups"),
		availableGroups : this.myGroups,
		accounts : this.accounts,
		items : this.canvas.getItems(),
		onSave : Event.wrapper(function(g) {
			this.info.update(g);
			var f = {
				post_share : g.post_share,
				quickshare : g.quickshare,
				quickshare_list : g.quickshare_list
			};
			if (c) {
				f.contest_id = c.id
			}
			this.doPublish({
				onSuccess : function() {
					Event.trigger(this, "savesuccess");
					d.apply(this, arguments)
				},
				extras : f
			})
		}, this)
	})
};
Montage.prototype.onSignIn = function() {
	this.refreshUserInfo()
};
Montage.prototype.refreshUserInfo = function() {
	Ajax.get({
		action : "app.user_info",
		onSuccess : Event.wrapper(function(a) {
			this.setUserInfo(a.user_info)
		}, this)
	}, this)
};
Montage.prototype.onPublish = function(a) {
	Event.trigger(this, "saveclick");
	var b = function(f) {
		var d = buildURL("set", {
			id : f.id
		});
		if (f.post_share) {
			var g = Share.connectDialog(this.accounts, true);
			Event.addSingleUseListener(g, "done", function() {
				var c = {
					spec_uuid : f.uuid,
					quickshare : "on",
					quickshare_list : []
				};
				for (var h = 0; h < this.accounts.length; h++) {
					var j = this.accounts[h];
					if (j.options.publish_default) {
						c.quickshare_list.push(j.service)
					}
				}
				if (c.quickshare_list.length) {
					c.quickshare_list = c.quickshare_list.join(",");
					Ajax.post({
						busyMsg : loc("Sharing") + "...",
						action : "set.share",
						data : c,
						onSuccess : function(k) {
						},
						onFinally : function() {
							Event.trigger(this, "savenavigate");
							window.location = d
						}
					});
					return
				}
				Event.trigger(this, "savenavigate");
				window.location = d
			}, this);
			return
		}
		Event.trigger(this, "savenavigate");
		window.location = d
	};
	b = Event.wrapper(b, this);
	this._loginOrDo(function() {
		this.showPublishDialog(b)
	}, this)
};
Montage.prototype._loginOrDo = function(a, c) {
	a = Event.wrapper(a, c);
	if (Auth.isLoggedIn()) {
		a();
		return
	}
	var b = countingSemaphore(2, a);
	Event.addSingleUseListener(this, "userinfo", b);
	AuthenticationFlows.startPublish({
		onSuccess : b
	})
};
Montage.prototype.doPublish = function(b) {
	var a = this.canvas.freeze().items;
	a.forEach(Item.cleanSpecForSaving);
	var c = {
		dirty : true,
		id : this.cid,
		did : this.did,
		basedon_tid : this.basedon_tid,
		title : this.info.get("title"),
		description : this.info.get("description"),
		category : this.info.get("category"),
		tags : this.info.get("tags"),
		groups : this.info.get("groups"),
		items : a
	};
	mergeObject(c, b.extras);
	Ajax.post({
		busyMsg : loc("Publishing") + "...",
		action : "set.publish",
		data : c,
		onSuccess : Event.wrapper(function(f) {
			if (f.show_fb_pixel_set) {
				document.body.appendChild(createNode("img", {
					id : "fb_pixel_set",
					height : "1",
					width : "1",
					src : "https://www.facebook.com/offsite_event.php?id=6009423270034&value=1&currency=USD"
				}, {
					display : "none"
				}))
			}
			var d = (this.cid != f.result.cid);
			this.cid = f.result.cid;
			this.did = null;
			this.info.update({
				title : f.result.title,
				description : f.result.description,
				category : f.result.category,
				tags : f.result.tags,
				groups : f.result.groups
			});
			this.canvas.getItems().forEach(function(g) {
				g.onSaved()
			});
			Event.trigger(this, "saved", f.result.cid, d);
			SetInfoBox.hide();
			UI.displayAjaxMessages(f.message, 30000);
			this.transitState("publish");
			if (b.onSuccess) {
				b.onSuccess.call(this, {
					id : this.cid,
					uuid : f.result.spec_uuid,
					post_share : b.extras.post_share,
					extras : b.extras
				})
			}
			if (this.starterTemplate) {
				Track.stat("inc", "app_starter_template", [this.starterTemplate.id, "publish"])
			}
		}, this),
		onError : Event.wrapper(function(d) {
			Event.trigger(this, "saveerror");
			this.showPublishDialog(b.onSuccess);
			yield(function() {
				var f = createNode("div");
				UI.displayAjaxErrors(d, f);
				Feedback.message(f.innerHTML)
			})
		}, this)
	})
};
Montage.prototype.onSaveDraft = function() {
	callOrSignIn(Event.wrapper(this.doSaveDraft, this), "montage_draft")
};
Montage.prototype.doSaveDraft = function() {
	var a = this.canvas.freeze().items;
	if (!a || a.length < 1) {
		return
	}
	a.forEach(Item.cleanSpecForSaving);
	var b = this.tid;
	if (this.template_edit) {
		b = b || 0
	}
	if (!this.did && !this.cid && !b) {
		this.did = "temp_" + createUUID();
		this.transitState("savedraft")
	}
	if (this.saveBtn) {
		setNode(this.saveBtn, {
			disabled : "true"
		}, null, loc("Saving") + "...")
	}
	Ajax.post({
		hideProgress : !!this.saveBtn,
		action : "set.draft",
		data : {
			id : this.cid,
			did : this.did,
			tid : b,
			basedon_tid : this.basedon_tid,
			items : a
		},
		onSuccess : Event.wrapper(function(c) {
			if (!this.did || /^temp_/.test(this.did)) {
				this.did = c.did
			}
			this.transitState("savedraft");
			UI.displayAjaxMessages(c.message);
			this.onNotModified();
			this.updateControls()
		}, this)
	})
};
Montage.prototype.onUnLoad = function(b) {
	if (this.canvas.itemCount() > this.maxSetItems) {
		return (b.returnValue = loc("This set exceeds the {max_items} item limit and cannot be saved.", {
			max_items : this.maxSetItems
		}))
	} else {
		if (this.modified && Auth.isLoggedIn()) {
			Event.stop(b);
			b.returnValue = loc("Are you sure you want to discard your changes?");
			return loc("Are you sure you want to discard your changes?")
		} else {
			if (!Auth.isLoggedIn()) {
				LocalStorageCache.set("app_spec", JSON2.stringify(this.canvas.freeze().items), LocalStorageCache.WEEK);
				if (Math.random() < 0.1) {
					var a = this.canvas.freeze().items;
					a.forEach(Item.cleanSpecForSaving);
					a.forEach(function(c) {
						c.x = Math.round(c.x);
						c.y = Math.round(c.y);
						c.w = Math.round(c.w);
						c.h = Math.round(c.h);
						if (c.scale) {
							c.scale = Math.round(c.scale, 0.0001)
						}
					});
					Ajax.post({
						action : "set.signedout_log",
						data : {
							birth : this._birth,
							basedon_tid : this.basedon_tid,
							items : a
						}
					})
				}
			}
		}
	}
};
Montage.prototype.onCanvasDrop = function(b) {
	var c = b.xDataTransfer.getData("item");
	if (c) {
		var d = Event.getPageXY(b);
		var a = nodeXY(this.canvas.getNode());
		d.x -= a.x;
		d.y -= a.y;
		this.addItem(c, d)
	} else {
		if (( c = b.xDataTransfer.getData("set"))) {
			this.onLoadSet(c.id)
		} else {
			if (( c = b.xDataTransfer.getData("draft"))) {
				this.onLoadDraft(c.id)
			} else {
				if (( c = b.xDataTransfer.getData("template"))) {
					if (c.fill) {
						this.onFillTemplate(c.id)
					} else {
						this.onLoadTemplate(c.id)
					}
				}
			}
		}
	}
	Track.trackEvent("drop", "canvas")
};
Montage.prototype.addItem = function(c, g, d) {
	if (this.loading || this.canvas.locked) {
		return
	}
	var b = this.canvas;
	var h = {
		w : c.w,
		h : c.h
	};
	var f = new Dim(c.w, c.h);
	f.fit(d || {
		w : 200,
		h : 200
	});
	c.w = f.w;
	c.h = f.h;
	var k = Item.thaw(c);
	c.w = h.w;
	c.h = h.h;
	if ( k instanceof ImageItem) {
		Track.engagement({
			engagement : "use",
			action : "write",
			path : buildURL("thing", {
				id : c.thing_id
			}, c.title),
			brand : c.brand_id || -1,
			host : c.host_id || -1
		})
	}
	if (g) {
		var a = k.getRect().center();
		if (g.relative) {
			b.centerItem(k);
			k.move(g.x, g.y)
		} else {
			k.move(g.x - a.x, g.y - a.y)
		}
	} else {
		b.centerItem(k)
	}
	function j() {
		b.clearSelection();
		if (b.addItem(k)) {
			b.select(k)
		}
	}

	if (c.type == Item.TYPES.TEXT) {
		Event.addSingleUseListener(k, "metricsuptodate", j);
		k.computeFontMetrics()
	} else {
		j()
	}
	if (b.itemCount() !== 0) {
		Event.trigger(this, "nonemptycanvas")
	}
};
Montage.prototype.loadItem = function(b, c, a) {
	if (this.controlsState == "fillTemplate") {
		if (this.confirmDiscard()) {
			this.clear()
		} else {
			return
		}
	}
	this.loading = true;
	Ajax.get({
		busyMsg : loc("Loading item") + "...",
		action : "item",
		data : {
			id : b
		},
		onSuccess : Event.wrapper(function(d) {
			this.loading = false;
			this.addItem(d.thing, c, a)
		}, this),
		onFinally : Event.wrapper(function() {
			this.loading = false
		}, this)
	})
};
Montage.prototype.deleteItem = function(a) {
	Ajax.post({
		busyMsg : loc("Deleting item") + "...",
		action : "favorite.delete_thing",
		data : {
			tid : a.thing_id
		}
	})
};
Montage.prototype.addItemToMyStuff = function(a) {
	Ajax.post({
		busyMsg : loc("Adding item") + "...",
		action : "favorite.add_thing",
		data : {
			tid : a.thing_id
		}
	})
};
Montage.prototype.onLoadSet = function(a) {
	if (this.modified) {
		this.saveOrDiscard({
			onSave : Event.wrapper(function() {
				this.onSaveDraft();
				this.loadSet(a)
			}, this),
			onDiscard : Event.wrapper(function() {
				this.loadSet(a)
			}, this)
		})
	} else {
		this.loadSet(a)
	}
};
Montage.prototype.loadSet = function(a) {
	this.clear();
	this.loading = true;
	Ajax.get({
		busyMsg : loc("Loading set") + "...",
		action : "set.load",
		data : {
			id : a
		},
		contract : getHashKey(this),
		onSuccess : Event.wrapper(function(b) {
			this.onSetLoaded(b);
			if (b.collection.basedon_tid) {
				this.setControlsState("fillTemplate")
			} else {
				this.setControlsState("editSet")
			}
			if (b.collection.did) {
				this.transitState("loaddraft");
				Feedback.message(loc("The latest draft of this set has been loaded"))
			} else {
				this.transitState("loadset")
			}
		}, this),
		onFinally : Event.wrapper(function() {
			this.loading = false
		}, this)
	})
};
Montage.prototype.onLoadTemplate = function(a) {
	if (!this.template_edit) {
		return
	}
	if (this.modified) {
		this.saveOrDiscard({
			onSave : Event.wrapper(function() {
				this.onSaveDraft();
				this.loadTemplate(a)
			}, this),
			onDiscard : Event.wrapper(function() {
				this.loadTemplate(a)
			}, this)
		})
	} else {
		this.loadTemplate(a)
	}
};
Montage.prototype.loadTemplate = function(a) {
	this.clear();
	this.loading = true;
	Ajax.get({
		busyMsg : loc("Loading template") + "...",
		action : "template.load",
		data : {
			id : a,
			loaddraft : true
		},
		contract : getHashKey(this),
		onSuccess : Event.wrapper(function(b) {
			b.collection = b.template;
			this.onSetLoaded(b);
			this.setControlsState("editTemplate");
			if (this.did) {
				this.transitState("loaddraft");
				Feedback.message(loc("The latest draft of this template has been loaded"))
			} else {
				this.transitState("loadtemplate")
			}
		}, this),
		onFinally : Event.wrapper(function() {
			this.loading = false
		}, this)
	})
};
Montage.prototype.onFillTemplate = function(b, a) {
	if (this.template_edit) {
		return
	}
	if (this.modified) {
		this.saveOrDiscard({
			onSave : Event.wrapper(function() {
				this.onSaveDraft();
				this.fillTemplate(b)
			}, this),
			onDiscard : Event.wrapper(function() {
				this.fillTemplate(b)
			}, this)
		})
	} else {
		this.fillTemplate(b, a)
	}
};
Montage.prototype.fillTemplate = function(b, a) {
	this.clear();
	this.loading = true;
	Ajax.get({
		busyMsg : loc("Loading template") + "...",
		action : "template.load",
		data : {
			id : b,
			loaddraft : false
		},
		contract : getHashKey(this),
		onSuccess : Event.wrapper(function(d) {
			d.collection = d.template;
			var c = d.collection.isOwner;
			d.collection.isOwner = 1;
			d.collection.basedon_tid = d.collection.tid;
			delete d.collection.tid;
			if (!c) {
				delete d.collection.title;
				delete d.collection.description;
				delete d.collection.category;
				delete d.collection.tags;
				delete d.collection.groups
			}
			this.onSetLoaded(d);
			if (!c) {
				Event.pauseEvents(this.canvas, "change");
				this.canvas.clearPlaceholders();
				Event.unpauseEvents(this.canvas, "change")
			}
			this._clearUndo();
			this.onNotModified();
			this.setControlsState("fillTemplate");
			this.transitState("filltemplate");
			if (a) {
				Event.trigger(a, "select")
			}
		}, this),
		onFinally : Event.wrapper(function() {
			this.loading = false
		}, this)
	})
};
Montage.prototype.onLoadDraft = function(a) {
	if (this.modified) {
		this.saveOrDiscard({
			onSave : Event.wrapper(function() {
				this.onSaveDraft();
				this.loadDraft(a)
			}, this),
			onDiscard : Event.wrapper(function() {
				this.loadDraft(a)
			}, this)
		})
	} else {
		this.loadDraft(a)
	}
};
Montage.prototype.loadDraft = function(a) {
	this.clear();
	this.loading = true;
	Ajax.get({
		busyMsg : loc("Loading draft") + "...",
		action : "set.load",
		data : {
			did : a
		},
		contract : getHashKey(this),
		onSuccess : Event.wrapper(function(b) {
			this.onSetLoaded(b);
			if (b.collection.basedon_tid) {
				this.setControlsState("fillTemplate")
			} else {
				if (b.collection.cid) {
					this.setControlsState("editSet")
				} else {
					if (b.collection.tid) {
						this.setControlsState("editTemplate")
					} else {
						this.setControlsState(this.canvas.containsPlaceholder() ? "editTemplate" : this.defaultControlsState)
					}
				}
			}
			this.transitState("loaddraft")
		}, this),
		onFinally : Event.wrapper(function() {
			this.loading = false
		}, this)
	})
};
Montage.prototype.onSetLoaded = function(c) {
	var d = c.collection;
	var b = (this.canvas.itemCount() === 0);
	this.info.update({
		title : d.title,
		description : d.description,
		category : d.category,
		tags : d.tags,
		groups : d.groups
	});
	var a;
	if (!b) {
		this.canvas.fit();
		a = this.canvas.freeze().items;
		this.canvas.clear()
	}
	this.canvas.thaw({
		items : d.items
	});
	this.canvas.fit();
	if (!b) {
		this.canvas.thaw({
			items : a
		})
	}
	this.cid = d.cid;
	this.did = d.did;
	this.tid = d.tid;
	this.is_template_draft = this.tid === 0;
	this.basedon_tid = d.basedon_tid;
	if (d.isOwner === 1 && b) {
		this.onNotModified()
	}
	this._clearUndo();
	this.updateControls()
};
Montage.prototype.undo = function() {
	this._restoreUndoState(this._undo.undo())
};
Montage.prototype.redo = function() {
	this._restoreUndoState(this._undo.redo())
};
Montage.prototype._recordUndoState = function() {
	this._undo.push(this.canvas.freeze())
};
Montage.prototype._restoreUndoState = function(a) {
	if (a) {
		Event.pauseEvents(this.canvas, "change");
		var b = this.canvas.getView();
		this.canvas.unlock();
		this.canvas.clear();
		this.canvas.thaw(a);
		this.canvas.gotoView(b);
		this.modified = (this._notModifiedState != a);
		this.setControlsState(this.controlsState);
		Event.unpauseEvents(this.canvas, "change")
	}
};
Montage.prototype._clearUndo = function() {
	this._undo.clear();
	this._recordUndoState();
	this._notModifiedState = this._undo.present()
};
Montage.prototype.deleteSet = function(a) {
	Ajax.post({
		busyMsg : loc("Deleting set") + "...",
		action : "set.delete",
		data : {
			id : a.id
		}
	})
};
Montage.prototype.discardDraft = function(a) {
	Ajax.post({
		busyMsg : loc("Discarding draft") + "...",
		action : "set.discard",
		data : {
			did : a.id
		}
	})
};
Montage.prototype.deleteTemplate = function(a) {
	Ajax.post({
		busyMsg : loc("Deleting template") + "...",
		action : "template.delete",
		data : {
			id : a.id
		}
	})
};
Montage.prototype.onNew = function() {
	Track.stat("inc", "newbtn", ["click", Auth.isLoggedIn() ? "signedin" : "signedout"]);
	if (this.confirmDiscard()) {
		Track.stat("inc", "newbtn", ["confirm", Auth.isLoggedIn() ? "signedin" : "signedout"]);
		this.clear()
	}
};
Montage.prototype.onOpen = function() {
	Track.stat("inc", "openbtn", ["click", Auth.isLoggedIn() ? "signedin" : "signedout"]);
	var b;
	if (this.template_edit) {
		b = cloneObject(TabbedSelector.TYPES.TEMPLATE_EDITOR_OPEN_MENU)
	} else {
		b = cloneObject(TabbedSelector.TYPES.EDITOR_OPEN_MENU)
	}
	var a = new TabbedSelector(b);
	Event.addListener(a, "change", function(c) {
		if (c.type == "d") {
			this.onLoadDraft(c.id)
		} else {
			if (c.type == "c") {
				this.onLoadSet(c.id)
			} else {
				if (c.type == "t") {
					if (this.template_edit) {
						this.onLoadTemplate(c.id)
					} else {
						this.onFillTemplate(c.id)
					}
				} else {
					this.onFillTemplate(c.id)
				}
			}
		}
	}, this);
	a.show()
};
Montage.prototype.onZoomIn = function() {
	this.canvas.zoom(1.25)
};
Montage.prototype.onZoomOut = function() {
	this.canvas.zoom(0.8)
};
Montage.prototype.onFit = function() {
	this.canvas.fit()
};
Montage.prototype.transitState = function(a) {
	var b = Cookie.get("as", true);
	switch(a) {
		case"new":
			this.state = "clean";
			Cookie.clear("as");
			break;
		case"loaddraft":
			this.state = "did";
			Cookie.set("as", {
				did : this.did,
				basedon_tid : this.basedon_tid,
				cid : this.cid,
				tid : this.tid,
				is_template_draft : this.is_template_draft
			});
			break;
		case"savedraft":
			this.state = "did";
			Cookie.set("as", {
				did : this.did,
				basedon_tid : this.basedon_tid,
				cid : this.cid,
				tid : this.tid,
				is_template_draft : this.is_template_draft
			});
			break;
		case"loadset":
			this.state = "cid";
			Cookie.set("as", {
				cid : this.cid,
				basedon_tid : this.basedon_tid
			});
			break;
		case"filltemplate":
			this.state = "cid";
			Cookie.set("as", {
				cid : this.cid,
				basedon_tid : this.basedon_tid
			});
			break;
		case"loadtemplate":
			if (this.template_edit) {
				this.state = "tid";
				Cookie.set("as", {
					tid : this.tid
				})
			}
			break;
		case"publish":
			this.state = "published";
			Cookie.clear("as");
			break;
		case"edit":
			switch(this.state) {
				case"clean":
					this.state = "modified";
					if (!Auth.isLoggedIn()) {
						Cookie.set("as", {
							basedon_tid : this.basedon_tid
						})
					}
					break;
				case"published":
					if (this.tid) {
						this.state = "tid";
						Cookie.set("as", {
							tid : this.tid
						})
					} else {
						if (this.cid) {
							this.state = "cid";
							Cookie.set("as", {
								cid : this.cid,
								basedon_tid : this.basedon_tid
							})
						}
					}
					break;
				default:
			}
			break;
		default:
			throw "Invalid action " + a
	}
};
Montage.prototype.restoreState = function() {
	if (this.loading || this.state == "cid" || this.state == "did" || this.state == "tid") {
		return
	}
	var state = Cookie.get("as", true);
	if (!state) {
		return
	}
	if (Auth.isLoggedIn()) {
		if (this.template_edit) {
			if (state.did && !state.cid && !state.basedon_tid && state.is_template_draft) {
				this.loadDraft(state.did)
			} else {
				if (state.tid) {
					this.loadTemplate(state.tid)
				}
			}
		} else {
			if (state.did && !state.tid && !state.is_template_draft) {
				this.loadDraft(state.did)
			} else {
				if (state.cid) {
					this.loadSet(state.cid)
				} else {
					if (state.basedon_tid) {
						this.fillTemplate(state.basedon_tid)
					}
				}
			}
		}
	} else {
		var localStorageSpec = LocalStorageCache.get("app_spec");
		if (localStorageSpec) {
			var data = {
				collection : {
					basedon_tid : state && state.basedon_tid,
					items : []
				}
			};
			try {
				data.collection.items = eval("(" + localStorageSpec + ")")
			} catch(e) {
			}
			this.onSetLoaded(data);
			this.setControlsState(data.collection.basedon_tid ? "fillTemplate" : this.defaultControlsState);
			this.transitState("filltemplate")
		}
	}
};
Montage.prototype.setControlsState = function(a) {
	switch(a||"") {
		case"fillTemplate":
			this.controlsState = a;
			this.canvas.lock();
			Event.pauseEvents(this.canvas, "change");
			this.canvas.fit(true);
			Event.unpauseEvents(this.canvas, "change");
			break;
		case"editTemplate":
			this.controlsState = a;
			this.canvas.unlock();
			break;
		default:
			this.controlsState = "editSet";
			this.canvas.unlock()
	}
	yield(this.updateControls, this)
};
Montage.prototype.updateControls = noop;
function App(a, c, b) {
	App.superclass.constructor.call(this, a, c, b);
	b = b || {};
	this.selectedTab = b.selected_tab;
	this.availableActions = {
		remove_btn : Event.wrapper(this.canvas.removeSelected, this.canvas),
		clone_btn : Event.wrapper(this.canvas.cloneSelected, this.canvas),
		fgnd_btn : Event.wrapper(this.canvas.raiseSelected, this.canvas),
		bkgd_btn : Event.wrapper(this.canvas.lowerSelected, this.canvas),
		arrange_top_btn : Event.wrapper(this.canvas.arrangeTopSelected, this.canvas),
		arrange_middle_btn : Event.wrapper(this.canvas.arrangeMiddleSelected, this.canvas),
		arrange_bottom_btn : Event.wrapper(this.canvas.arrangeBottomSelected, this.canvas),
		arrange_left_btn : Event.wrapper(this.canvas.arrangeLeftSelected, this.canvas),
		arrange_center_btn : Event.wrapper(this.canvas.arrangeCenterSelected, this.canvas),
		arrange_right_btn : Event.wrapper(this.canvas.arrangeRightSelected, this.canvas),
		arrange_spread_horizontal_btn : Event.wrapper(this.canvas.arrangeSpreadHSelected, this.canvas),
		arrange_spread_vertical_btn : Event.wrapper(this.canvas.arrangeSpreadVSelected, this.canvas)
	};
	Event.addListener(a, "keydown", this._onKeyDown, this);
	var d = Browser.type("IE", 6, 8) ? " ▼ " : createHTML("div", {
		className : "mod_arrow down"
	});
	this.enabledActions = [{
		id : "remove_btn",
		title : loc("Remove"),
		alt : loc("Remove from set")
	}, {
		id : "flop_btn",
		title : loc("Flop"),
		alt : loc("Flip horizontally")
	}, {
		id : "flip_btn",
		title : loc("Flip"),
		alt : loc("Flip vertically")
	}, {
		id : "arrange_btns",
		title : loc("Arrange") + d,
		alt : loc("Arrange selected items"),
		multi : true
	}, {
		id : "arrange_top_btn",
		title : loc("Top"),
		alt : loc("Align the top edge of selected items"),
		multi : true
	}, {
		id : "arrange_middle_btn",
		title : loc("Middle"),
		alt : loc("Vertically align the middle of selected items"),
		multi : true
	}, {
		id : "arrange_bottom_btn",
		title : loc("Bottom"),
		alt : loc("Align the bottom edge of selected items"),
		multi : true
	}, {
		id : "arrange_left_btn",
		title : loc("Left"),
		alt : loc("Align the left edge of selected items"),
		multi : true
	}, {
		id : "arrange_center_btn",
		title : loc("Center"),
		alt : loc("Horizontally align the center of selected items"),
		multi : true
	}, {
		id : "arrange_right_btn",
		title : loc("Right"),
		alt : loc("Align the right edge of selected items"),
		multi : true
	}, {
		id : "arrange_spread_horizontal_btn",
		title : loc("Spread horizontally"),
		alt : loc("Evenly spread the horizontal space between the selected items"),
		multi : true
	}, {
		id : "arrange_spread_vertical_btn",
		title : loc("Spread vertically"),
		alt : loc("Evenly spread the vertically space between the selected items"),
		multi : true
	}, {
		id : "bg_btns",
		title : loc("Background") + d,
		alt : loc("Toggle background state")
	}, {
		id : "hidebkgd_btn",
		title : loc("Remove background"),
		shortTitle : loc("Remove"),
		alt : loc("Hide image background")
	}, {
		id : "showbkgd_btn",
		title : loc("Keep background"),
		shortTitle : loc("Keep"),
		alt : loc("Show image background")
	}, {
		id : "cropbkgd_btn",
		title : loc("Custom background..."),
		shortTitle : loc("Custom..."),
		alt : loc("Custom crop background")
	}, {
		id : "clone_btn",
		title : loc("Clone"),
		alt : loc("Clone")
	}, {
		id : "fit_btn",
		title : loc("Fit"),
		alt : loc("Scale and center the item within the placeholder.")
	}, {
		id : "square_btn",
		title : loc("Make square"),
		alt : loc("Turn rectangle into a square")
	}, {
		id : "fgnd_btn",
		title : loc("Forwards"),
		alt : loc("Bring image forward.") + " " + loc("Shift-click to bring to front.")
	}, {
		id : "bkgd_btn",
		title : loc("Backwards"),
		alt : loc("Send image backward.") + " " + loc("Shift-click to send to back.")
	}];
	this.showSponsored = Boolean(b.show_promoted_items);
	yield(function() {
		DataSourceDataManager.getSearchTabData().ensureLoaded()
	});
	Event.addListener(Event.BACKEND, "signin", this.updateControls, this);
	Event.addListener(Event.BACKEND, "signout", this.updateControls, this);
	removeClass(a, "default")
}extend(App, Montage);
App.prototype.init = function() {
	App.superclass.init.call(this);
	var b = this.canvas;
	var a = createNode("div", {
		className : "NE"
	});
	b.appendControl(a);
	a.appendChild(this.actions = createNode("ul", {
		className : "toolbar horizontal itemactions"
	}));
	makeUnselectable(this.actions);
	a.appendChild(createNode("div", {
		className : "clear"
	}));
	a.appendChild(this.bgBtns = createNode("div", {
		id : "bg_btns",
		className : "controls right"
	}));
	a.appendChild(this.itemInfo = createNode("div", {
		className : "iteminfo right"
	}));
	var c = b.appendControl(createNode("div", {
		className : "NW"
	}));
	var m = (this.toolbar = createNode("ul", {
		className : "toolbar vertical controls canvasactions"
	}));
	hide(m);
	c.appendChild(m);
	makeUnselectable(m);
	if (this.template_edit) {
		addList(m, createNode("div", {
			id : "template_indicator"
		}, null, loc("template").ucFirst()), {
			className : "template_indicator"
		});
		addList(m, "", {
			className : "hr"
		})
	}
	addList(m, this.publishBtn = this.createButton({
		id : "publish_btn",
		title : loc("Publish"),
		click : this.onPublish,
		alt : loc("Publish current composition")
	}));
	addList(m, this.publishTemplateBtn = this.createButton({
		id : "publish_template_btn",
		title : loc("Publish"),
		click : this.onPublishTemplate,
		alt : loc("Publish as a template")
	}));
	addList(m, this.submitContestBtn = this.createButton({
		id : "submit_contest_btn",
		title : loc("Enter contest"),
		click : function() {
			this.onContest(this.contest)
		},
		alt : loc("Publish and enter contest")
	}));
	addList(m, this.saveBtn = this.createButton({
		id : "save_btn",
		title : loc("Save draft"),
		click : function() {
			if (this.modified) {
				this.onSaveDraft()
			}
		},
		alt : loc("Save current composition as draft"),
		key : {
			ctrl : true,
			keyCode : 83,
			keyChar : "s"
		}
	}));
	addList(m, this.openBtn = this.createButton({
		id : "open_btn",
		title : loc("Open"),
		click : this.onOpen,
		alt : loc("Open an existing set or template"),
		key : {
			ctlr : true,
			keyCode : 79,
			keyChar : "o"
		}
	}));
	addList(m, this.newBtn = this.createButton({
		id : "new_btn",
		title : loc("New"),
		click : this.onNew,
		alt : loc("Clear canvas and start over"),
		key : {
			ctrl : true,
			keyCode : 78,
			keyChar : "n"
		}
	}), {
		className : "new_btn"
	});
	addList(m, "", {
		className : "hr clearfix"
	});
	addList(m, this.undoBtn = this.createButton({
		id : "undo_btn",
		title : loc("Undo"),
		type : "icon_only",
		click : this.undo,
		key : {
			ctrl : true,
			keyCode : 90,
			keyChar : "z"
		}
	}), {
		className : "undo_btn"
	});
	addList(m, this.redoBtn = this.createButton({
		id : "redo_btn",
		title : loc("Redo"),
		type : "icon_only",
		click : this.redo,
		key : {
			ctrl : true,
			keyCode : 89,
			keyChar : "y"
		}
	}), {
		className : "redo_btn"
	});
	addList(m, "", {
		className : "hr clearfix"
	});
	addList(m, this.editTemplateBtn = this.createButton({
		id : "edit_btn",
		title : loc("Edit template"),
		click : this.onEditTemplate,
		alt : loc("Modify the template")
	}));
	addList(m, this.zoomInBtn = this.createButton({
		id : "zoom_in",
		title : loc("Zoom in"),
		type : "icon_only",
		click : this.onZoomIn
	}), {
		className : "zoom_in"
	});
	addList(m, this.zoomOutBtn = this.createButton({
		id : "zoom_out",
		title : loc("Zoom out"),
		type : "icon_only",
		click : this.onZoomOut
	}), {
		className : "zoom_out"
	});
	addList(m, this.centerBtn = this.createButton({
		id : "fit_btn",
		title : loc("Center"),
		type : "icon_only",
		click : this.onFit,
		alt : loc("Recenter items on canvas"),
		key : {
			keyCode : 67,
			keyChar : "c"
		}
	}), {
		className : "fit_btn"
	});
	addList(m, this.clearPlaceholdersBtn = this.createButton({
		id : "clearph_btn",
		title : loc("Start over"),
		click : this.onClearPlaceholders
	}));
	if (this.template_edit) {
		addList(m, "", {
			className : "hr"
		});
		addList(m, this.placeholderBtn = this.createButton({
			id : "placeholder_btn",
			title : loc("Placeholder"),
			type : "icon_and_text",
			click : this.onAddPlaceholder,
			alt : loc("Add a placeholder to the template"),
			key : {
				ctlr : true,
				keyCode : 80,
				keyChar : "p"
			}
		}), {
			className : "add_placeholder"
		});
		addList(m, "", {
			className : "hr"
		})
	}
	if (bucketIs("show_admin_links", "yes") || bucketIs("show_admin_links", "limited")) {
		addList(m, this.saveAsBtn = this.createButton({
			className : "admin_only",
			id : "saveas_btn",
			title : "Clone set",
			alt : "Save a previously published set as a new draft, unlinked to the previous set",
			click : function() {
				this.cid = null;
				this.onSaveDraft();
				Feedback.message("Set saved as a new draft")
			}
		}))
	}
	this._keyboardHandlers[hashKeyboardKey({
		ctrl : true,
		keyCode : 65
	})] = Event.wrapper(this.canvas.selectAll, this.canvas);
	this.onNotModified();
	show(m);
	Event.addListener(this.palette, "newtab", function() {
		this.newSearchTab(true, true)
	}, this);
	Event.addListener(this.canvas, "additem", function(q) {
		if (!q) {
			return
		}
		q.forEach(function(r) {
			var s = r.data;
			if (s && s.promotedwith) {
				Beacon.log("promoted", {
					action : "use",
					product : s.promotedwith,
					context : s.trackcontext,
					oid : s.oid
				})
			}
		})
	});
	var n = "search";
	var k = this.contest;
	if (this.selectedTab) {
		n = this.selectedTab
	} else {
		if (k) {
			n = "contest"
		} else {
			if (this.lookbooks) {
				n = "lookbook"
			} else {
				n = "fashion"
			}
		}
	}
	var l = [];
	l.push(new AppAllItemsTab(this, {
		title : "Fashion",
		selected : n == "fashion",
		trackelement : "fashion",
		trackcontext : "fashion",
		pickerCats : Array.prototype.concat(this.categories.fashion || [], this.categories.filler || []),
		productPlacement : this.productPlacement,
		showSponsored : this.showSponsored
	}));
	var o = new AppAllItemsTab(this, {
		title : "Home",
		selected : n == "home",
		trackelement : "home",
		trackcontext : "home",
		pickerCats : Array.prototype.concat(this.categories.home || [], this.categories.filler || []),
		productPlacement : this.productPlacement,
		showSponsored : this.showSponsored
	});
	Event.addListener(o, "select", function() {
		Beacon.log("view", {
			name : "home_tab"
		}, true)
	});
	l.push(o);
	if (this.template_edit) {
		l.push(new AppMyItemsTab(this, {
			title : loc("My Items"),
			closable : false,
			trackelement : "my_items",
			selected : n == "mystuff"
		}));
		l.push(new AppMyLookbooksTab(this, {
			title : loc("Collections"),
			closable : false,
			trackelement : "my_lookbook",
			selected : n == "lookbook",
			show : {
				footerPagination : true
			}
		}))
	} else {
		if (Auth.isLoggedIn()) {
			l.push(new AppMyItemsTab(this, {
				title : loc("My Items"),
				closable : false,
				trackelement : "my_items",
				selected : n == "mystuff",
				show : {
					footerPagination : true
				}
			}));
			l.push(new AppMyLookbooksTab(this, {
				title : loc("Collections"),
				closable : false,
				trackelement : "my_lookbook",
				selected : n == "lookbook",
				show : {
					footerPagination : true
				}
			}))
		} else {
			Event.addSingleUseListener(Event.BACKEND, "signin", function() {
				this.palette.unshiftTab(new AppMyItemsTab(this, {
					title : loc("My Items"),
					closable : false,
					trackelement : "my_items",
					selected : n == "mystuff"
				}))
			}, this)
		}
	}
	this.palette.add(l);
	if (this.template_edit) {
		var h = createNode("div");
		h.appendChild(createNode("div", {
			className : "heading"
		}, null, loc("Add items &amp; placeholders here")));
		h.appendChild(createNode("div", {
			className : "subheading"
		}, null, loc("Use the {placeholder} button to add placeholders", {
			placeholder : createNode("span", {
				id : "empty_addph_btn",
				title : loc("Add a placeholder to your set"),
				className : "hselect_btn"
			}, null, createSprite("", "Placeholder"))
		})));
		this.canvas.setEmptyMessage(h);
		Event.addListener($("empty_addph_btn"), "click", this.onAddPlaceholder, this)
	} else {
		if (!k) {
			var f = loc("Create a collage");
			var d = loc("Start by dragging items here.");
			var g = createNode("div");
			g.appendChild(createNode("div", {
				className : "heading"
			}, null, f));
			g.appendChild(createNode("div", {
				className : "subheading"
			}, null, d));
			this.canvas.setEmptyMessage(g)
		}
	}
	if (k) {
		var p = new AppContestTab(this, this.contest, {
			title : this.contest.id == 360886 ? "Burberry" : loc("Contest"),
			closable : false,
			selected : n == "contest",
			show : {
				footerPagination : true
			}
		});
		this.palette.addTab(p)
	}
	if (this.lookbooks) {
		var j = 0;
		this.lookbooks.forEach(function(q) {
			this.palette.addTab(new AppLookbookTab(this, q, {
				title : teaser(q.title, 12),
				closable : false,
				selected : n == "lookbook" && j++ === 0
			}))
		}, this)
	}
	this.restoreState();
	Event.addSingleUseListener(Event, "backend_events_triggered", function() {
		if (!Auth.isLoggedIn() && !this.loading && !this.modified && !this.contest) {
			var s = this;
			var q = toArray(window._defaultTemplateIDs.filter(function(t) {
				if (s.selectedTab == "home" && t.category != "home") {
					return false
				}
				return true
			}));
			this.starterTemplate = q.randomItem();
			var r = null;
			if (this.starterTemplate.category == "home") {
				r = o
			}
			Track.stat("inc", "app_starter_template", [this.starterTemplate.id, "start"]);
			this.onFillTemplate(this.starterTemplate.id, r)
		}
	}, this);
	if (!Auth.isLoggedIn() && window._firstVisit) {
		Beacon.log("view", {
			name : "appfirstvisit"
		})
	}
};
function hashKeyboardKey(b) {
	var a = "";
	if (b.ctrl) {
		a += "ctrl-"
	}
	a += b.keyCode;
	return a
}
App.prototype.createButton = function(f) {
	var g = f.alt ? f.alt : f.title;
	var d;
	if (f.key) {
		if (g) {
			g += " "
		}
		var a = "";
		if (f.key.ctrl) {
			a += (Browser.isMac ? "&#8984;" : "ctrl+")
		}
		a += f.key.keyChar.toUpperCase();
		g += "(";
		g += a;
		g += ")";
		this._keyboardHandlers = this._keyboardHandlers || {};
		f.click = Event.wrapper(f.click, this);
		this._keyboardHandlers[hashKeyboardKey(f.key)] = function() {
			if (d && !d.getAttribute("disabled")) {
				f.click()
			}
		}
	}
	var b, c;
	if (f.type == "icon_only") {
		b = " sprited ";
		c = createSprite("")
	} else {
		if (f.type == "icon_and_text") {
			b = " txt ";
			c = createSprite("", f.title)
		} else {
			b = " txt ";
			c = f.title
		}
	}
	d = createNode("button", {
		id : f.id,
		className : b + (f.className || ""),
		trackelement : f.id
	}, null, [c]);
	Event.addListener(d, "click", f.click, this);
	Event.addListener(d, "mousedown", Event.stop);
	d.title = g || "";
	this.addControlTooltip(d);
	return d
};
App.prototype.updateControls = function() {
	var d = this.canvas.itemCount();
	if (d > this.maxSetItems) {
		this.status(loc("This set exceeds the {max_items} item limit: {num_items} items", {
			max_items : this.maxSetItems,
			num_items : d
		}) + ".", "alert");
		setNode(this.saveBtn, {
			disabled : true
		});
		setNode(this.publishBtn, {
			disabled : true
		});
		return
	} else {
		if (d >= 0.9 * this.maxSetItems) {
			this.status(loc("This set is approaching the {max_items} item limit: {num_items} items", {
				max_items : this.maxSetItems,
				num_items : d
			}) + ".", "warn")
		} else {
			this.status("")
		}
	}
	var h = Event.wrapper(function() {
		var m = loc("To get the full Polyvore experience, {upgrade} your browser.", {
			upgrade : createNode("a", {
				href : BrowserDetect.browserInfo.upgradeURL,
				target : "_blank"
			}, null, loc("upgrade"))
		}) + " ";
		this.status(m, "info")
	}, this);
	if (d > 0) {
		var g = this.canvas.getItems()[0].getMatrix();
		if (g && g.rotate === null && BrowserDetect.browserInfo.upgradeURL) {
			h()
		}
	}
	setNode(this.publishBtn, {
		disabled : null
	});
	if (this.canvas.containsPlaceholder()) {
		setNode(this.publishTemplateBtn, {
			disabled : null,
			title : ""
		})
	} else {
		setNode(this.publishTemplateBtn, {
			disabled : true,
			title : loc("Templates require at least 1 placeholder.")
		})
	}
	setNode(this.undoBtn, {
		disabled : this._undo.canUndo() ? null : true
	});
	setNode(this.redoBtn, {
		disabled : this._undo.canRedo() ? null : true
	});
	setNode(this.zoomInBtn, {
		disabled : d > 0 ? null : true
	});
	setNode(this.zoomOutBtn, {
		disabled : d > 0 ? null : true
	});
	setNode(this.centerBtn, {
		disabled : d > 0 ? null : true
	});
	var a = false;
	var b = false;
	var f = Browser.type("IE", 6, 8);
	this.canvas.getItems().forEach(function(m) {
		if (m.constructor == PlaceholderItem && m.hasContent()) {
			a = true
		}
		if (f && m.data && m.data.allow_opacity) {
			b = true
		}
	});
	setNode(this.clearPlaceholdersBtn, {
		disabled : a ? null : true
	});
	if (b) {
		h()
	}
	if (this.saveAsBtn) {
		setNode(this.saveAsBtn, {
			disabled : this.cid ? null : true
		})
	}
	var c = false;
	if (this.controlsState == "fillTemplate") {
		c = !a
	}
	var k = (d === 0);
	switch(this.controlsState) {
		case"fillTemplate":
			this.availableActions.clone_btn.disabled = true;
			this.availableActions.fgnd_btn.disabled = true;
			this.availableActions.bkgd_btn.disabled = true;
			App.showToolbarBtn(this.newBtn);
			App.showToolbarBtn(this.undoBtn, false);
			App.showToolbarBtn(this.redoBtn, false);
			App.showToolbarBtn(this.saveBtn, Auth.isLoggedIn());
			App.showToolbarBtn(this.saveAsBtn);
			App.showToolbarBtn(this.publishBtn);
			App.showToolbarBtn(this.publishTemplateBtn, false);
			App.showToolbarBtn(this.submitContestBtn, false);
			App.showToolbarBtn(this.editTemplateBtn, false);
			App.showToolbarBtn(this.zoomInBtn, false);
			App.showToolbarBtn(this.zoomOutBtn, false);
			App.showToolbarBtn(this.centerBtn, false);
			App.showToolbarBtn(this.clearPlaceholdersBtn);
			addClass(this.canvas.getNode(), "fill");
			this.status(loc("You are filling a template.") + " " + loc("You can only add items in the designated placeholders."), "info");
			this.canvas.fit(true);
			break;
		case"editTemplate":
			this.availableActions.clone_btn.disabled = false;
			this.availableActions.fgnd_btn.disabled = false;
			this.availableActions.bkgd_btn.disabled = false;
			App.showToolbarBtn(this.newBtn);
			App.showToolbarBtn(this.undoBtn);
			App.showToolbarBtn(this.redoBtn);
			App.showToolbarBtn(this.saveBtn, Auth.isLoggedIn());
			App.showToolbarBtn(this.saveAsBtn);
			App.showToolbarBtn(this.publishBtn, false);
			App.showToolbarBtn(this.submitContestBtn, false);
			App.showToolbarBtn(this.publishTemplateBtn);
			App.showToolbarBtn(this.editTemplateBtn, false);
			App.showToolbarBtn(this.zoomInBtn);
			App.showToolbarBtn(this.zoomOutBtn);
			App.showToolbarBtn(this.centerBtn);
			App.showToolbarBtn(this.clearPlaceholdersBtn, false);
			removeClass(this.canvas.getNode(), "fill");
			break;
		default:
			this.availableActions.clone_btn.disabled = false;
			this.availableActions.fgnd_btn.disabled = false;
			this.availableActions.bkgd_btn.disabled = false;
			var j = (!k || this._undo.canUndo() || this._undo.canRedo());
			App.showToolbarBtn(this.newBtn);
			App.showToolbarBtn(this.undoBtn, j);
			App.showToolbarBtn(this.redoBtn, j);
			App.showToolbarBtn(this.saveBtn, Auth.isLoggedIn());
			App.showToolbarBtn(this.saveAsBtn);
			App.showToolbarBtn(this.publishBtn);
			App.showToolbarBtn(this.submitContestBtn, false);
			App.showToolbarBtn(this.publishTemplateBtn, false);
			App.showToolbarBtn(this.editTemplateBtn, false);
			App.showToolbarBtn(this.zoomInBtn, j);
			App.showToolbarBtn(this.zoomOutBtn, j);
			App.showToolbarBtn(this.centerBtn, j);
			App.showToolbarBtn(this.clearPlaceholdersBtn, false);
			removeClass(this.canvas.getNode(), "fill");
			break
	}
	if (this.modified && !k && !c) {
		setNode(this.saveBtn, {
			disabled : null
		}, null, loc("Save Draft"))
	} else {
		var l;
		if (!k && !c) {
			l = loc("Draft Saved")
		} else {
			l = loc("Save Draft")
		}
		setNode(this.saveBtn, {
			disabled : "true"
		}, null, l)
	}
	if (!k) {
		setNode(this.newBtn, {
			disabled : null
		});
		setNode(this.publishBtn, {
			disabled : null
		})
	} else {
		setNode(this.newBtn, {
			disabled : "true"
		});
		setNode(this.publishBtn, {
			disabled : "true"
		})
	}
	if (this.contest && this.contest.show_submit) {
		App.showToolbarBtn(this.publishBtn, false);
		App.showToolbarBtn(this.submitContestBtn, true)
	}
	Event.trigger(this, "updatecontrols")
};
App.prototype.newSearchTab = function(d, c, f, a) {
	if (!f) {
		f = loc("Search")
	}
	var b = new AppAllItemsTab(this, {
		title : f,
		closable : c,
		selected : d,
		presets : a,
		trackelement : "all_items",
		trackcontext : "all_items",
		pickerCats : [],
		productPlacement : this.productPlacement,
		showSponsored : this.showSponsored
	});
	this.palette.addTab(b);
	return b
};
App.prototype._onKeyDown = function(c) {
	var a = {
		ctrl : (!Browser.isMac && c.ctrlKey) || (Browser.isMac && c.metaKey),
		keyCode : c.keyCode
	};
	var b = this._keyboardHandlers ? this._keyboardHandlers[hashKeyboardKey(a)] : null;
	if (b) {
		b(c);
		return Event.stop(c)
	}
};
App.prototype.onContest = function(a) {
	this._loginOrDo(function() {
		this.enterContest(a)
	}, this)
};
App.prototype.enterContest = function(a) {
	if (!a) {
		return
	}
	this.showPublishDialog(Event.wrapper(function(d) {
		var c = a.id;
		var b = d.uuid;
		var f = {
			id : c,
			collection_id : this.cid
		};
		mergeObject(f, d.extras);
		ContestActions.contestSubmit(f, {
			onSuccess : function(h) {
				var g = buildURL("contest.show", {
					id : c
				});
				window.location = g
			},
			onError : function(g) {
				UI.modalDisplayAjaxMessages(g.message)
			}
		})
	}, this), a)
};
App.prototype.onPublishTemplate = function(a) {
	this._loginOrDo(this.publishTemplate, this)
};
App.prototype.publishTemplate = function(b) {
	if (!this.canvas.containsPlaceholder()) {
		ModalDialog.alert(loc("Templates require at least 1 placeholder."));
		return
	}
	if (!this.validate()) {
		ModalDialog.alert(this.validateErrorMsg);
		return
	}
	var a = new Form({
		data : {
			title : this.info.get("title"),
			description : this.info.get("description")
		},
		inputs : [{
			label : loc("Title"),
			type : "text",
			name : "title",
			maxlength : 255
		}, {
			label : loc("Instructions"),
			type : "textarea",
			name : "description",
			maxlength : 4096
		}, {
			type : "html",
			value : createNode("div", {
				className : "error",
				id : "publish_error"
			})
		}, {
			type : "buttons",
			buttons : [{
				label : loc("Publish"),
				type : "submit",
				id : "publishBtn"
			}, {
				label : loc("Cancel"),
				type : "cancel",
				onClick : ModalDialog.hide
			}]
		}]
	});
	Event.addListener(a, "submit", function(d) {
		var g = a.getData();
		setNode($("publish_error"), null, null, "");
		var c = $("publishBtn");
		setNode(c, {
			value : loc("Publishing") + "...",
			disabled : "true"
		});
		var f = {
			dirty : true,
			id : this.tid,
			did : this.did,
			items : this.canvas.freeze().items,
			title : g.title,
			description : g.description
		};
		Ajax.post({
			busyMsg : loc("Publishing template") + "...",
			action : "template.publish",
			data : f,
			onSuccess : Event.wrapper(function(j) {
				var h = (this.tid != j.result.tid);
				this.tid = j.result.tid;
				this.did = null;
				this.info.update({
					title : j.result.title,
					description : j.result.description
				});
				this.canvas.getItems().forEach(function(k) {
					k.onSaved()
				});
				Event.trigger(this, "saved", j.result.tid, h);
				this.onNotModified();
				UI.displayAjaxMessages(j.message, 30000);
				this.transitState("publish");
				ModalDialog.hide()
			}, this),
			onError : function(h) {
				setNode(c, {
					value : loc("Publish"),
					disabled : undefined
				});
				UI.displayAjaxErrors(h, "publish_error")
			}
		});
		return Event.stop(d)
	}, this);
	ModalDialog.show_uic({
		title : loc("Publish Template"),
		body : a.getNode()
	})
};
App.prototype.onEditTemplate = function(a) {
	this.setControlsState("editTemplate")
};
App.prototype.onAddPlaceholder = function(a) {
	if (!this.loading) {
		this.addItem({
			type : Item.TYPES.PLACEHOLDER,
			w : 200,
			h : 200
		})
	}
};
App.prototype.onClearPlaceholders = function(a) {
	this.canvas.clearPlaceholders();
	this.updateControls()
};
App.showToolbarBtn = function(a, b) {
	if (a && a.parentNode) {
		if (b || b === undefined) {
			show(a.parentNode)
		} else {
			hide(a.parentNode)
		}
	}
};
function AppTab(b, a) {
	AppTab.superclass.constructor.call(this, a);
	this.app = b;
	this.cleaner.push(Event.addListener(window, "resize", this.autoSize, this));
	this.cleaner.push(Event.addListener(this, "select", function() {
		yield(this.autoSize, this)
	}, this))
}extend(AppTab, Tab);
AppTab.prototype.autoSize = function() {
	if (this._panelNode.style.display == "none") {
		return
	}
	var b = getWindowSize();
	var c = Rect.fromNode(this._panelNode);
	var a = b.h - c.top() - 8 - 1;
	if (Browser.layoutEngine("WebKit")) {
		a -= 1
	}
	if (a < 1) {
		a = 1
	}
	this.setPanelSize({
		height : a
	})
};
AppTab.prototype.show = function() {
	AppTab.superclass.show.call(this);
	this.autoSize()
};
AppTab.prototype.showItemTooltip = function(k, b, c, d) {
	var m = "m";
	var h = UI.sizeMap[m].dim;
	var f = createNode("a", {
		href : buildURL("thing", {
			id : d.thing_id
		}, d.seo_title),
		target : "_blank"
	}, null, createImg({
		className : "grid bordered",
		width : h,
		height : h,
		alt : d.title,
		src : buildImgURL("img-thing", {
			tid : d.thing_id,
			size : UI.sizeMap[m].url,
			".out" : "jpg"
		})
	}));
	Event.addListener(f, "click", Event.stop, Event);
	Event.addListener(f, "dragstart", function(n) {
		d.type = d.type || Item.TYPES.IMAGE;
		n.xDataTransfer.setData("item", d);
		n.xDataTransfer.proxy = UI.itemRender(d, "t");
		Event.stop(n)
	});
	var j = createNode("div", null, {
		overflow : "hidden",
		paddingLeft : "8px"
	});
	var a = j.appendChild(createNode("ul", {
		className : "list"
	}));
	a.appendChild(createNode("li", {
		title : d.title
	}, null, d.title));
	if (d.sponsored) {
		addList(a, createNode("span", {
			className : "meta"
		}, null, loc("Promoted")))
	}
	if (d.required) {
		addList(a, createNode("span", {
			className : "meta"
		}, null, loc("Required")))
	}
	addList(a, UI.priceAndLink(d, {
		showOriginalPrice : true,
		showUnlocalizedPrice : true
	}));
	var g;
	if (this.app.controlsState != "fillTemplate") {
		g = addList(a, createNode("span", {
			className : "clickable",
			trackelement : "add_to_set"
		}, null, loc("Add to set")));
		var l = function(n) {
			this.app.addItem(d);
			ToolTip.hide();
			return Event.stop(n)
		};
		Event.addListener(g, "click", l, this);
		Event.addListener(f, "click", l, this)
	}
	addList(a, createNode("a", {
		href : buildURL("thing", {
			id : d.thing_id
		}, d.seo_title),
		target : "_blank"
	}, null, loc("View details")));
	if (k) {
		g = addList(a, createNode("span", {
			className : "clickable"
		}, null, loc("Delete")));
		Event.addListener(g, "click", function() {
			ModalDialog.confirm({
				title : loc("Really delete this item?"),
				okLabel : loc("Delete"),
				onOk : Event.wrapper(function() {
					this.app.deleteItem(d)
				}, this)
			});
			ToolTip.hide()
		}, this)
	} else {
		g = addList(a, createNode("span", {
			className : "clickable"
		}, null, loc("Like this item")));
		Event.addListener(g, "click", function() {
			ToolTip.hide();
			callOrSignIn(Event.wrapper(function() {
				this.app.addItemToMyStuff(d)
			}, this), "item_favorite")
		}, this)
	}
	ToolTip.show(c, ToolTip.renderImageAndDetails(f, j), {
		event : b,
		pos : ToolTipPosition.POS.EDGE,
		closeButton : true
	})
};
AppTab.prototype.renderProductPlacement = function(a, f) {
	var d = createNode("div", {
		className : "section clearfix product_placement",
		trackcontext : "product_placement",
		promotedwith : f.promotedwith,
		oid : Track.classAndId("collection", f.id)
	});
	var g = function() {
		Event.trigger(a, "action", {
			type : "product_placement",
			lookbook : f
		})
	};
	d.appendChild(createNode("h4", null, null, f.title));
	var c = createNode("ul", {
		className : "product_placement_items clearfix"
	});
	f.items.forEach(function(k) {
		var j = Track.classAndId("thing", k.thing_id);
		var l = c.appendChild(createNode("li"));
		var h = UI.itemRender(k, "t");
		h.setAttribute("promoted", "1");
		h.setAttribute("oid", j);
		l.appendChild(h);
		Event.addListener(l, "mousedown", g);
		Event.addListener(l, "mousedown", function() {
			if (this.app.controlsState != "fillTemplate") {
				this.app.loadItem(k.thing_id);
				Beacon.log("promoted", {
					product : f.promotedwith,
					action : "use",
					context : Track.getContext(d),
					oid : j
				})
			}
		}, this)
	}, this);
	d.appendChild(c);
	var b = d.appendChild(createNode("div", {
		className : "clickable see_all"
	}, null, loc("See all items") + " &#187;"));
	Event.addListener(b, "mousedown", g);
	return d
};
function AppMyItemsTab(b, a) {
	AppMyItemsTab.superclass.constructor.call(this, b, a)
}extend(AppMyItemsTab, AppTab);
AppMyItemsTab.prototype.init = function() {
	var a;
	if (Auth.isLoggedIn()) {
		a = new MyItemsTabPanel(this, {
			showFilters : true,
			autoSize : true,
			show : {
				footerPagination : true
			}
		});
		Event.addListener(a, "click", function(c, b, d) {
			this.showItemTooltip(true, c, b, d)
		}, this);
		Event.addListener(a, "hidetooltip", ToolTip.hide);
		this.pushPanel(a)
	} else {
		a = new SignInTabPanel(this);
		this.pushPanel(a);
		Event.addSingleUseListener(Event.BACKEND, "signin", this.reinit, this)
	}
	yield(this.autoSize, this)
};
function AppMyLookbooksTab(b, a) {
	AppMyLookbooksTab.superclass.constructor.call(this, b, a)
}extend(AppMyLookbooksTab, AppTab);
AppMyLookbooksTab.prototype.init = function() {
	var a;
	if (Auth.isLoggedIn()) {
		a = new MyCollectionsTabPanel(this, {
			useTagFilter : true,
			autoSize : true,
			showFavorites : true,
			type : "thing",
			disableDrag : true,
			show : {
				footerPagination : true
			}
		});
		a.setEmptyMessage(loc("You have not published any collections with items yet"));
		Event.addListener(a, "click", function(f, d, g) {
			var c = new AppLookbookTabPanel(this, g, {
				show : {
					homeButton : loc("My Collections"),
					footerPagination : true
				}
			});
			c.setTitle(g.title);
			Event.addListener(c, "click", function(j, h, k) {
				this.showItemTooltip(false, j, h, k)
			}, this);
			var b = this.app.newSearchTab(true, true);
			b.pushPanel(c);
			Event.addListener(c, "home", function() {
				while (this.panelCount() > 1) {
					this.popPanel()
				}
			}, this);
			yield(this.autoSize, this);
			ToolTip.hide();
			return Event.stop(f)
		}, this);
		Event.addListener(a, "hidetooltip", ToolTip.hide);
		this.pushPanel(a)
	} else {
		a = new SignInTabPanel(this);
		this.pushPanel(a);
		Event.addSingleUseListener(Event.BACKEND, "signin", this.reinit, this)
	}
	yield(this.autoSize, this)
};
function AppAllItemsTab(b, a) {
	AppAllItemsTab.superclass.constructor.call(this, b, a);
	this.getPanelNode().setAttribute("trackcontext", a.trackcontext || "all_items");
	this.showSponsored = a.showSponsored;
	this.presets = a.presets;
	this.pickerCats = a.pickerCats;
	this.productPlacement = a.productPlacement;
	this.app = b
}extend(AppAllItemsTab, AppTab);
AppAllItemsTab.prototype.init = function() {
	var a;
	if (this.presets) {
		a = new ItemSearchTabPanel(this, {
			presets : this.presets,
			showSponsored : this.showSponsored,
			show : {
				footerPagination : true
			}
		});
		a.setEmptyMessage(loc("No matching items found.") + " <br>" + loc("{clipper}.", {
			clipper : createNode("small", null, null, createNode("a", {
				href : buildURL("clipper"),
				target : "_blank"
			}, null, loc("Import your own items")))
		}));
		this.pushPanel(a);
		Event.addListener(a, "click", function(c, b, d) {
			this.showItemTooltip(false, c, b, d)
		}, this);
		Event.addListener(results, "hidetooltip", ToolTip.hide)
	} else {
		a = new AppAllItemsTabPanel(this, {
			pickerCats : this.pickerCats,
			productPlacement : this.productPlacement
		});
		this.pushPanel(a);
		Event.addListener(a, "action", function(d) {
			var g;
			switch(d.type) {
				case"thing":
					if (this.isEffectCategory(d)) {
						g = new EffectTabPanel(this, {
							presets : d.filters,
							show : {
								footerPagination : true
							}
						})
					} else {
						g = new ItemSearchTabPanel(this, {
							presets : d.filters,
							showSponsored : this.showSponsored,
							show : {
								footerPagination : true
							}
						});
						g.setEmptyMessage(loc("No matching items found.") + " " + loc("<br>{clipper}.", {
							clipper : createNode("small", null, null, createNode("a", {
								href : buildURL("clipper"),
								target : "_blank"
							}, null, loc("Import your own items")))
						}))
					}
					Event.addListener(g, "click", function(j, h, k) {
						this.showItemTooltip(false, j, h, k)
					}, this);
					var f;
					if (d.stripHTML) {
						var c = createNode("div", null, null, (d.label || "").replace(/<br\/?>/, " "));
						f = c.textContent || c.innerText
					} else {
						f = d.label
					}
					g.setTitle(f || loc("All Items"));
					break;
				case"text":
					g = new TextTabPanel(this, {
						show : {
							footerPagination : true
						}
					});
					Event.addListener(g, "click", this.showTextTooltip, this);
					g.setTitle(loc("Text"));
					break;
				case"amazon_mp3":
					g = new AmazonMP3TabPanel(this, {
						show : {
							footerPagination : true
						}
					});
					g.setEmptyMessage(loc("Search for music"));
					Event.addListener(g, "click", this.showMP3Tooltip, this);
					g.setTitle(loc("Music"));
					break;
				case"color_block":
					g = new ColorCategoryTabPanel(this, this.app.canvas);
					g.setTitle(loc("Colors"));
					Event.addListener(g, "click", this.showColorTooltip, this);
					Event.addListener(g, "action", function(h) {
						Event.trigger(a, "action", h)
					}, this);
					break;
				case"color":
					g = new ColorTabPanel(this, {
						autosize : true,
						ds : d.ds,
						show : {
							footerPagination : true
						}
					});
					g.setTitle(d.title || loc("Colors"));
					g.setEmptyMessage(loc("No colors found"));
					Event.addListener(g, "click", this.showColorTooltip, this);
					break;
				case"product_placement":
					g = new AppLookbookTabPanel(this, d.lookbook, {
						promotedwith : d.lookbook.promotedwith,
						trackcontext : "lookbook",
						oid : Track.classAndId("collection", d.lookbook.id),
						show : {
							homeButton : loc("All Items"),
							footerPagination : true
						}
					});
					g.setTitle(teaser(d.lookbook.title, 12));
					Event.addListener(g, "click", function(j, h, k) {
						this.showItemTooltip(false, j, h, k)
					}, this);
					break
			}
			Event.addListener(g, "hidetooltip", ToolTip.hide);
			var b = this.app.newSearchTab(true, true);
			b.pushPanel(g);
			yield(this.autoSize, this);
			Event.addListener(g, "home", function() {
				while (this.panelCount() > 1) {
					this.popPanel()
				}
			}, this)
		}, this)
	}
	yield(this.autoSize, this)
};
AppAllItemsTab.prototype.isEffectCategory = function(a) {
	return (a.filters && a.filters.length && a.filters[0].name == "category_id" && Conf.getSetting("appEffectsCategories") && Conf.getSetting("appEffectsCategories").contains(Number(a.filters[0].value)))
};
AppAllItemsTab.prototype.showTextTooltip = function(a, b, f) {
	var m = "m";
	var h = UI.sizeMap[m].dim;
	var j = createNode("ul", {
		className : "list"
	});
	var k = "";
	var c = "#000000";
	var d = j.appendChild(createNode("li", {
		className : "left"
	}, null, createImg({
		className : "grid bordered",
		width : h,
		height : h,
		src : buildImgURL("img-text.preview", {
			font_id : f.font_id,
			color : c,
			bgColor : k,
			size : UI.sizeMap[m].url,
			".out" : "jpg"
		})
	})));
	Event.addListener(d, "dragstart", function(n) {
		f.type = f.type || Item.TYPES.TEXT;
		n.xDataTransfer.setData("item", f);
		n.xDataTransfer.proxy = UI.fontIconRender(f, "t");
		Event.stop(n)
	});
	j.appendChild(createNode("li", null, null, teaser(f.title, 100)));
	j.appendChild(createNode("li", null, null, outboundLink({
		href : f.url,
		target : "_blank"
	}, null, f.displayurl)));
	if (this.app.controlsState != "fillTemplate") {
		var g = addList(j, createNode("span", {
			className : "clickable"
		}, null, loc("Add to set")));
		var l = function(n) {
			this.app.addItem(f);
			ToolTip.hide();
			return Event.stop(n)
		};
		Event.addListener(g, "click", l, this);
		Event.addListener(d, "click", l, this)
	}
	ToolTip.show(b, j, {
		closeButton : true,
		pos : ToolTipPosition.POS.EDGE
	})
};
AppAllItemsTab.prototype.showMP3Tooltip = function(a, b, c) {
	var n = "m";
	var g = UI.sizeMap[n].dim;
	var h = createNode("ul", {
		className : "list"
	});
	var m = UI.AmazonMP3Render(c, "m");
	var d = h.appendChild(createNode("li", {
		className : "left"
	}, null, m));
	addClass(m, "grid");
	Event.addListener(d, "dragstart", function(o) {
		c.type = c.type || Item.TYPES.AMAZON_MP3;
		o.xDataTransfer.setData("item", c);
		o.xDataTransfer.proxy = UI.AmazonMP3Render(c, "t");
		Event.stop(o)
	});
	addList(h, teaser(c.title, 100));
	addList(h, outboundLink({
		href : c.url,
		target : "_blank"
	}, null, c.displayurl));
	if (this.app.controlsState != "fillTemplate") {
		var f = addList(h, createNode("span", {
			className : "clickable"
		}, null, loc("Add to set")));
		var l = function(o) {
			this.app.addItem(c);
			ToolTip.hide();
			return Event.stop(o)
		};
		Event.addListener(f, "click", l, this);
		Event.addListener(d, "click", l, this)
	}
	var k = AmazonWidget.getMp3Html({
		width : 120,
		height : 90,
		asin : c.asin
	});
	var j = addList(h, "");
	ToolTip.show(b, h, {
		closeButton : true
	});
	replaceChild(j, k)
};
AppAllItemsTab.prototype.showColorTooltip = function(a, b, c) {
	var n = "m";
	var g = UI.sizeMap[n].dim;
	var j = createNode("ul", {
		className : "list"
	});
	var m = UI.colorBlockRender(c, "m");
	var d = j.appendChild(createNode("li", {
		className : "left"
	}, {
		backgroundColor : "#ffffff"
	}, m));
	Event.addListener(d, "dragstart", function(o) {
		c.type = c.type || Item.TYPES.COLORBLOCK;
		o.xDataTransfer.setData("item", c);
		o.xDataTransfer.proxy = UI.colorBlockRender(c, "t");
		Event.stop(o)
	});
	var k = c.title || c.color || loc("Rectangle");
	addList(j, teaser(k.ucFirst(), 100));
	var h = outboundLink({
		href : ColorBlockItem.getUrl(c)
	}, null, "colourlovers.com");
	addList(j, h);
	if (this.app.controlsState != "fillTemplate") {
		var f = addList(j, createNode("span", {
			className : "clickable"
		}, null, loc("Add to set")));
		var l = function(o) {
			this.app.addItem(c);
			ToolTip.hide();
			return Event.stop(o)
		};
		Event.addListener(f, "click", l, this);
		Event.addListener(d, "click", l, this)
	}
	ToolTip.show(b, j, {
		closeButton : true,
		pos : ToolTipPosition.POS.EDGE
	})
};
function AppAllItemsTabPanel(d, n) {
	AppAllItemsTabPanel.superclass.constructor.call(this, d);
	var a = n.pickerCats || [];
	setNode(this._node, null, {
		overflow : "auto"
	});
	var h = this._node.appendChild(createNode("div", {
		className : "blank_tab"
	}));
	var k = h.appendChild(createNode("div", {
		className : "section clearfix"
	}));
	k.appendChild(createNode("h4", null, null, loc("Search")));
	var b = k.appendChild(createNode("form", {
		className : "query_form"
	}));
	var l = b.appendChild(createNode("table", {
		cellPadding : 0,
		cellSpacing : 0
	})).appendChild(createNode("tbody")).appendChild(createNode("tr"));
	var f = l.appendChild(createNode("td", {
		className : "query_cell"
	})).appendChild(createNode("input", {
		type : "text",
		name : "query",
		className : "query"
	}));
	this._onTabShowListener = Event.addListener(d, "show", function() {
		if (Dim.fromNode(f).w && this.showing()) {
			f.focus()
		}
	}, this);
	CachedAjax.get({
		action : "autocomplete.price_ranges",
		data : {
			".cacheable" : 1,
			".locale" : Conf.getLocale()
		},
		hideProgress : true
	});
	CachedAjax.get({
		action : "autocomplete.category_id_titles",
		data : {
			".cacheable" : 1,
			".locale" : Conf.getLocale(),
			v : 3
		},
		hideProgress : true
	});
	var c = DataSourceDataManager.getSearchTabData();
	Event.addSingleUseListener(c, "loaded", function() {
		var o = new GroupedObjectAutoComplete(f, c, {
			maxResults : {
				category_id : 5,
				brand : 13,
				displayurl : 5
			},
			typeOrder : ["category_id", "brand", "displayurl"],
			toggleOnLoaded : true,
			onSelect : Event.wrapper(function(q) {
				var t = q._data;
				var r = [{
					name : t.filter_type,
					value : t.value
				}];
				var p = o.inputTokenizer;
				p.caretToken("");
				var s = p.reconstructValue();
				if (s) {
					r.push({
						name : "query",
						value : s
					})
				}
				Event.trigger(this, "action", {
					type : "thing",
					label : t.title,
					filters : r
				})
			}, this)
		});
		this.cleaner.push(function() {
			o.destruct()
		})
	}, this);
	c.ensureLoaded();
	l.appendChild(createNode("td")).appendChild(createNode("input", {
		type : "submit",
		className : "btn",
		value : loc("Search")
	}));
	Event.addListener(b, "submit", function(o) {
		if (f.value) {
			Event.trigger(this, "action", {
				type : "thing",
				label : f.value,
				filters : [{
					name : "query",
					value : f.value,
					fixed : false
				}]
			})
		}
		Event.stop(o)
	}, this);
	var j = {};
	var m = "t";
	a.forEach(function(p) {
		var o = j[p.group_name || loc("Browse")];
		if (!o) {
			o = createNode("ul", {
				className : "keywords clearfix"
			});
			j[p.group_name] = o
		}
		var q = o.appendChild(createNode("li"));
		switch(p.type) {
			case"thing":
				q.appendChild(UI.itemRender(p, m));
				break;
			case"text":
				if (p.font_id) {
					q.appendChild(UI.fontIconRender(p, m))
				} else {
					q.appendChild(UI.itemRender(p, m))
				}
				break;
			case"amazon_mp3":
				q.appendChild(UI.itemRender(p, m));
				break;
			case"color_block":
				q.appendChild(UI.itemRender(p, m));
				break
		}
		Event.addListener(q, "mousedown", function(r) {
			if (r.which === undefined || r.which == 1) {
				p.stripHTML = true;
				Event.trigger(this, "action", p)
			}
		}, this);
		q.appendChild(createNode("br"));
		q.appendChild(createNode("span", {
			className : "clickable"
		}, null, p.label))
	}, this);
	forEachKey(j, function(q, o) {
		var p = h.appendChild(createNode("div", {
			className : "section clearfix"
		}));
		p.appendChild(createNode("h4", null, null, q));
		p.appendChild(o)
	}, this);
	var g = n.productPlacement;
	if (g) {
		h.appendChild(this._tab.renderProductPlacement(this, g))
	}
}extend(AppAllItemsTabPanel, TabPanel);
AppAllItemsTabPanel.prototype.destruct = function() {
	AppAllItemsTabPanel.superclass.destruct.call(this);
	this._onTabShowListener.clean()
};
function AppContestTab(c, b, a) {
	AppContestTab.superclass.constructor.call(this, c, a);
	this.contest = b;
	this.options = a
}extend(AppContestTab, AppTab);
AppContestTab.prototype.init = function() {
	var a = new AppContestTabPanel(this, this.contest, {
		show : this.options.show,
		burberrySs13 : this.contest.id == 360886
	});
	Event.addListener(a, "click", function(c, b, d) {
		this.showItemTooltip(false, c, b, d)
	}, this);
	this.pushPanel(a);
	yield(this.autoSize, this)
};
function AppContestTabPanel(c, m, o) {
	AppContestTabPanel.superclass.constructor.call(this, c);
	var n = this;
	var d = this._tab.app;
	var f = this.getNode();
	var p = f.appendChild(createNode("div", {
		className : "contest_tab sub"
	}));
	var j = buildURL("contest.show", {
		id : m.id,
		type : "details"
	});
	p.appendChild(createNode("h4")).appendChild(createNode("a", {
		href : j,
		className : "hover_clickable",
		target : "_blank"
	}, null, m.title));
	if (m.example_spec_uuid) {
		p.appendChild(createNode("a", {
			href : j,
			target : "_blank"
		}, null, createNode("img", {
			className : "left example",
			src : buildURL("img-set", {
				id : m.example_spec_uuid,
				".out" : "jpg",
				size : "s"
			}),
			width : 100,
			height : 100
		})))
	}
	p.appendChild(createNode("div", {
		className : "section"
	}, null, m.description));
	if (m.when) {
		var b = m.show_submit ? "" : "nosubmit";
		p.appendChild(createNode("div", {
			className : "when meta section " + b
		}, null, m.when))
	}
	if (m.show_submit) {
		var a = p.appendChild(createNode("a", {
			className : "btn btn_action"
		}, null, o.burberrySs13 ? loc("Publish") : loc("Enter contest")));
		Event.addListener(a, "click", function() {
			d.onContest(m)
		})
	}
	p.appendChild(createNode("div", {
		className : "separator"
	}));
	var l = new AjaxDataSource("contest.items", {
		contest_id : m.id,
		page : 1,
		length : 50
	}, {
		cacheResults : 600
	});
	var k = UI.itemGridRenderAutoSize;
	var g = true;
	if (m.render_required) {
		k = function(r) {
			var q = UI.itemGridRenderAutoSize(r);
			addClass(q, "render_required");
			if (r.required) {
				q.appendChild(createNode("div", {
					className : "under"
				}, null, "*" + loc("required").ucFirst()))
			}
			return q
		}
	}
	var h = new ResultSet({
		renderer : k,
		source : l,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : g,
		extraHeader : p
	});
	Event.addListener(h, "dragstart", function(r, q, s) {
		s.type = s.type || Item.TYPES.IMAGE;
		r.xDataTransfer.setData("item", s);
		r.xDataTransfer.proxy = UI.itemRender(s, "s");
		Event.stop(r)
	});
	h.init(this.getNode());
	if (o.show && o.show.footerPagination) {
		h.addFooterPagination()
	}
	this.setResult(h);
	l.reload()
}extend(AppContestTabPanel, ResultTabPanel);
function AppLookbookTab(c, b, a) {
	AppLookbookTab.superclass.constructor.call(this, c, a);
	this.lookbook = b
}extend(AppLookbookTab, AppTab);
AppLookbookTab.prototype.init = function() {
	var a = new AppLookbookTabPanel(this, this.lookbook, {
		promotedwith : this.lookbook.promotedwith,
		trackcontext : "lookbook",
		oid : Track.classAndId("collection", this.lookbook.id),
		show : {
			footerPagination : true
		}
	});
	this.pushPanel(a);
	Event.addListener(a, "click", function(c, b, d) {
		this.showItemTooltip(false, c, b, d)
	}, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function AppLookbookTabPanel(a, n, o) {
	AppLookbookTabPanel.superclass.constructor.call(this, a);
	o = o || {};
	o.show = o.show || {};
	this.getNode().setAttribute("trackcontext", o.trackcontext || "lookbook");
	var h = new AjaxDataSource("collection.get", {
		type : "thing",
		id : n.id,
		page : 1,
		length : 50
	}, {
		converter : function(q) {
			q.getHashKey = function() {
				return q.thing_id
			};
			return q
		},
		cacheResults : 600
	});
	if (o.promotedwith) {
		var b = this.getNode();
		b.setAttribute("promotedwith", o.promotedwith);
		b.setAttribute("oid", o.oid || Track.classAndId("collection", n.id));
		Event.addListener(h, "loaded", function() {
			h.forEach(function(q) {
				q.promotedwith = o.promotedwith;
				q.oid = Track.classAndId("thing", q.thing_id);
				q.trackcontext = Track.getContext(b)
			})
		})
	}
	var l = createNode("div", {
		className : "sub lookbook"
	});
	var p = l.appendChild(createNode("div", {
		className : "content"
	}));
	var d = buildURL("collection", {
		id : n.id
	});
	p.appendChild(createNode("h4", null, null, createNode("a", {
		href : d,
		className : "hover_clickable",
		target : "_blank"
	}, null, n.title)));
	var k = p.appendChild(createNode("div", {
		className : "tease_container"
	}));
	var m = k.appendChild(createNode("div", {
		className : "tease"
	}, null, n.description));
	var c = k.appendChild(createNode("div", {
		className : "tease_more clickable hidden"
	}));
	p.appendChild(createNode("div", {
		className : "separator"
	}));
	yield(function() {
		var q = false;
		UI.maybeRenderMore({
			moreNode : c,
			contentNode : m,
			moreOnClick : function() {
				q = !q;
				if (q) {
					c.innerHTML = loc("less") + "...";
					setNode(l, null, {
						height : px(Dim.fromNode(p).h)
					});
					addClass(l, "full")
				} else {
					c.innerHTML = loc("more") + "...";
					removeClass(l, "full");
					setNode(l, null, {
						height : null
					})
				}
			}
		})
	});
	var g = UI.itemGridRenderAutoSize;
	var f = new ResultSet({
		renderer : g,
		source : h,
		stopClickEvent : true,
		mouseWheelPagination : true,
		autoSize : true,
		extraHeader : l
	});
	f.init(this.getNode());
	this.setResult(f);
	h.reload();
	var j = new Toolbar();
	j.addSpring();
	f.addPaginationPaddles(j.add());
	if (o.show && o.show.footerPagination) {
		f.addFooterPagination()
	}
	f.getHeaderNode().appendChild(j.getNode());
	Event.addListener(f, "dragstart", function(r, q, s) {
		s.type = s.type || Item.TYPES.IMAGE;
		r.xDataTransfer.setData("item", s);
		r.xDataTransfer.proxy = UI.itemRender(s, "s");
		Event.stop(r)
	});
	f.redrawIfDirty()
}extend(AppLookbookTabPanel, ResultTabPanel);
function ListBuilder(l, d, g, c) {
	var b = (this.state = new Props());
	this._appNode = l;
	this._listNode = d;
	this._paletteNode = g;
	this.maxItems = (this.defaultMaxItems = c.max_items);
	this.info = new Props({
		id : null
	});
	this.list = new ResultSet({
		renderer : noop,
		source : new MemDataSource([])
	});
	Event.addListener(window, "load", this.onLoad, this);
	Event.addListener(window, "beforeunload", this.onUnLoad, this);
	Event.addListener(window, "resize", this.onResize, this);
	Event.addListener(Event.BACKEND, "loadlook", this.load, this);
	Event.addListener(Event.BACKEND, "loaditem", this.loadItem, this);
	this.config = c;
	var k = c.msgs;
	this.buttons = [];
	var f = {
		id : "save_btn",
		title : k.saveButtonTxt + "...",
		click : this.onSave,
		alt : k.saveButtonAlt
	};
	var h = {
		id : "new_btn",
		title : k.newButtonTxt,
		click : this.onNew,
		alt : k.newButtonAlt
	};
	var a = {
		id : "open_btn",
		title : k.openButtonTxt,
		click : this.onOpen,
		alt : k.openButtonAlt
	};
	var j = {
		id : "draft_btn",
		title : k.draftButtonTxt,
		click : this.onSaveDraft,
		alt : k.draftButtonAlt
	};
	this.buttons.push(f);
	if (c.allowDrafts) {
		this.buttons.push(j)
	}
	if (Auth.isLoggedIn()) {
		this.buttons.push(a)
	}
	this.buttons.push(h);
	yield(function() {
		DataSourceDataManager.getSearchTabData().ensureLoaded()
	})
}
ListBuilder.prototype.setContainerSize = function() {
	var b = getWindowSize();
	var a = b.h - Rect.fromNode(this._listNode).top();
	if (a - 9 > 0) {
		setNode(this._appNode, null, {
			height : px(a - 9)
		});
		setNode(this._listNode, null, {
			height : px(a - 9)
		})
	}
};
ListBuilder.prototype.onLoad = function() {
	this.init();
	this.setContainerSize()
};
ListBuilder.prototype.onUnLoad = function(a) {
	if (this.modified) {
		Event.stop(a);
		a.returnValue = loc("Are you sure you want to discard your changes?");
		return loc("Are you sure you want to discard your changes?")
	}
};
ListBuilder.prototype.onResize = function() {
	this.setContainerSize()
};
ListBuilder.prototype.init = function() {
	var a = this.config;
	var c = this.buttons;
	c.forEach(function(h) {
		var g = createNode("input", {
			type : "button",
			id : h.id,
			value : h.title
		});
		Event.addListener(g, "click", h.click, this);
		Event.addListener(g, "mousedown", Event.stop);
		g.title = h.alt;
		$("filemenu").appendChild(g)
	}, this);
	this.newBtn = $("new_btn");
	this.openbtn = $("open_btn");
	this.draftBtn = $("draft_btn");
	this.saveBtn = $("save_btn");
	var d = (this.list = new ResultSet({
		contentSelectable : true,
		renderer : a.renderer,
		source : new MemDataSource([], {
			converter : a.converter
		})
	}));
	d.init(this._listNode);
	d.setEmptyMessage(a.msgs.emptyList);
	this.addAutoResize(d);
	d.redraw();
	var f = new Orderable(d);
	Event.addListener(d.getNode(), "drop", this.onListDrop, this);
	Event.addListener(d.getSource(), "change", this.onChange, this);
	Event.addListener(d, "click", this.showEntryTooltip, this);
	Event.addListener(d, "hidetooltip", ToolTip.hide);
	var b = a.tabs;
	this.palette = new TabBox(this._paletteNode, {
		autoAdjustTabDim : true,
		bordered : true
	});
	this.palette.add(b);
	this.statusBar = d.getNode().appendChild(createNode("div", {
		className : "statusbar"
	})).appendChild(createNode("div", {
		id : "statustext"
	}));
	this.onNotModified()
};
ListBuilder.prototype.updateControls = function() {
	var a = this.list.getSource().size();
	if (a) {
		setNode(this.newBtn, {
			disabled : null
		});
		if (this.draftBtn) {
			setNode(this.draftBtn, {
				disabled : null
			})
		}
		setNode(this.saveBtn, {
			disabled : null
		})
	} else {
		setNode(this.newBtn, {
			disabled : true
		});
		if (this.draftBtn) {
			setNode(this.draftBtn, {
				disabled : true
			})
		}
		setNode(this.saveBtn, {
			disabled : true
		})
	}
	if (a > this.maxItems) {
		this.status(this.config.msgs.exceedLimit, "alert");
		setNode(this.saveBtn, {
			disabled : true
		});
		setNode(this.draftBtn, {
			disabled : true
		});
		return
	}
	this.status("")
};
ListBuilder.prototype.status = function(b, a) {
	if (b) {
		setNode(this.statusBar, {
			className : a || "alert"
		}, null, b)
	} else {
		setNode(this.statusBar, {
			className : ""
		})
	}
};
ListBuilder.prototype.onSaveDraft = function() {
	callOrSignIn(Event.wrapper(function() {
		this.save(true)
	}, this), "listbuilder_draft")
};
ListBuilder.prototype.onSave = function() {
	callOrSignIn(Event.wrapper(function() {
		this.save()
	}, this), "listbuilder_save")
};
ListBuilder.prototype.onNotModified = function() {
	this.modified = false;
	this.updateControls()
};
ListBuilder.prototype.confirmDiscard = function() {
	if (this.modified) {
		return confirm(loc("Are you sure you want to discard your changes?"))
	} else {
		return true
	}
};
ListBuilder.prototype.onChange = function() {
	if (this.list.getSource().size() === 0) {
		this.modified = false
	} else {
		this.modified = true
	}
	this.updateControls()
};
ListBuilder.prototype.addAutoResize = function(a) {
	this.adjustResultSetSize(a);
	Event.addListener(window, "resize", function() {
		this.adjustResultSetSize(a)
	}, this);
	window.setTimeout(Event.wrapper(function() {
		this.adjustResultSetSize(a)
	}, this), 0)
};
ListBuilder.prototype.adjustResultSetSize = function(c) {
	var b = getWindowSize();
	var d = Rect.fromNode(c.getNode());
	var a = b.h - d.top() - 8;
	c.resize({
		height : a
	})
};
ListBuilder.prototype.loadItem = function(a) {
	Ajax.get({
		busyMsg : loc("Loading item") + "...",
		action : "item",
		data : {
			id : a
		},
		onSuccess : Event.wrapper(function(b) {
			this.addItem(b.thing)
		}, this)
	})
};
ListBuilder.prototype.addItem = function(b, a) {
	var c = this.list.getSource();
	if (c.find(b) > -1) {
		Feedback.message(this.config.msgs.alreadyExist)
	} else {
		if (a && a._data) {
			c.insertBefore(b, a._data)
		} else {
			c.append(b)
		}
	}
};
ListBuilder.prototype.removeItem = function(a) {
	this.list.remove(a)
};
ListBuilder.prototype.onListDrop = function(d, c) {
	var g = d.xDataTransfer.getData("set");
	var f = d.xDataTransfer.getData("lookbook");
	var b = d.xDataTransfer.getData("item");
	var a = d.xDataTransfer.getData("user");
	if (g) {
		this.addItem(g, c)
	} else {
		if (f) {
			this.load(f)
		} else {
			if (b) {
				this.addItem(b, c)
			} else {
				if (a) {
					this.addItem(a, c)
				}
			}
		}
	}
};
ListBuilder.prototype.onNew = function() {
	if (this.confirmDiscard()) {
		this.clear();
		return true
	}
};
ListBuilder.prototype.onOpen = function() {
	var b = cloneObject(TabbedSelector.TYPES.COLLECTION_EDITOR_OPEN_MENU);
	var a = new TabbedSelector(b);
	Event.addListener(a, "change", this.load, this);
	a.show()
};
ListBuilder.prototype.clear = function() {
	this.list.clear();
	this.info.update({
		id : null,
		title : null,
		description : null,
		did : null,
		uuid : null,
		visibility : null
	});
	this.maxItems = this.defaultMaxItems;
	this.onNotModified()
};
ListBuilder.prototype.showEntryTooltip = function(c, b, f) {
	var d = null;
	var g = null;
	if (f.spec_uuid) {
		if (f.template_id) {
			g = (f.clickUrl = buildURL("template", {
				id : f.template_id
			}, f.seo_title))
		} else {
			g = (f.clickUrl = buildURL("set", {
				sid : f.spec_uuid
			}, f.seo_title))
		}
		d = UI.setListRender(f, {
			size : "l"
		});
		if (f.description) {
			d.appendChild(createNode("li", {
				className : "description"
			}, null, teaser(f.description, 80)))
		}
		d.appendChild(createNode("li", null, null, ["by ", createNode("a", {
			href : f.userurl ? f.userurl : buildURL("profile", {
				id : f.user_id,
				name : f.user_name
			}),
			target : "_blank"
		}, null, f.user_name)]))
	} else {
		if (f.thing_id) {
			g = (f.clickUrl = buildURL("thing", {
				id : f.thing_id
			}, f.seo_title));
			d = UI.itemListRender(f, {
				size : "l"
			});
			addList(d, UI.priceAndLink(f, {
				showOriginalPrice : true,
				showUnlocalizedPrice : true
			}))
		}
	}
	var a = addList(d, createNode("a", {
		target : "_blank",
		href : g
	}, null, loc("View details")));
	ToolTip.show(b, d, {
		closeButton : true,
		width : "500px"
	})
};
function ListBuilderTab(b, a) {
	ListBuilderTab.superclass.constructor.call(this, a);
	this.lb = b;
	this.cleaner.push(Event.addListener(window, "resize", this.autoSize, this))
}extend(ListBuilderTab, Tab);
ListBuilderTab.prototype.autoSize = function() {
	var b = getWindowSize();
	var c = Rect.fromNode(this._panelNode);
	var a = b.h - c.top() - 8 - 1;
	if (a < 1) {
		a = 1
	}
	this.setPanelSize({
		height : a
	})
};
ListBuilderTab.prototype.show = function() {
	AppTab.superclass.show.call(this);
	this.autoSize()
};
ListBuilderTab.prototype.showSetTooltip = function(d, c, g) {
	var f = UI.setListRender(g, {
		dragableImage : true,
		size : "m"
	});
	var b = addList(f, createNode("span", {
		className : "clickable"
	}, null, loc("Add to collection")));
	var a = function(h) {
		this.lb.addItem(g);
		ToolTip.hide();
		return Event.stop(h)
	};
	Event.addListener(b, "click", a, this);
	Event.addListener(getElementsWithAttributes({root:f,tagName:"img"})[0], "click", a, this);
	addList(f, createNode("a", {
		href : buildURL("set", {
			id : g.id
		}, g.seo_title),
		target : "_blank"
	}, null, loc("View details")));
	ToolTip.show(c, f, {
		closeButton : true
	})
};
ListBuilderTab.prototype.showTemplateTooltip = function(d, c, g) {
	var f = UI.setListRender(g, {
		dragableImage : true,
		size : "m"
	});
	var b = addList(f, createNode("span", {
		className : "clickable"
	}, null, loc("Add to collection")));
	var a = function(h) {
		this.lb.addItem(g);
		ToolTip.hide();
		return Event.stop(h)
	};
	Event.addListener(b, "click", a, this);
	Event.addListener(getElementsWithAttributes({root:f,tagName:"img"})[0], "click", a, this);
	addList(f, createNode("a", {
		href : buildURL("template", {
			id : g.template_id || g.id
		}, g.seo_title),
		target : "_blank"
	}, null, loc("View details")));
	ToolTip.show(c, f, {
		closeButton : true
	})
};
ListBuilderTab.prototype.showItemTooltip = function(d, c, g) {
	var f = UI.itemListRender(g, {
		dragableImage : true,
		size : "m"
	});
	if (g.description) {
		addList(f, UI.renderMoreText({
			text : g.description,
			numLines : 3
		}), {
			className : "description"
		})
	}
	addList(f, UI.priceAndLink(g, {
		showOriginalPrice : true,
		showUnlocalizedPrice : true
	}));
	var b = addList(f, createNode("span", {
		className : "clickable"
	}, null, loc("Add to collection")));
	var a = function(h) {
		this.lb.addItem(g);
		ToolTip.hide();
		return Event.stop(h)
	};
	Event.addListener(b, "click", a, this);
	Event.addListener(getElementsWithAttributes({root:f,tagName:"img"})[0], "click", a, this);
	addList(f, createNode("a", {
		href : buildURL("thing", {
			id : g.thing_id
		}, g.seo_title),
		target : "_blank"
	}, null, loc("View details")));
	ToolTip.show(c, f, {
		closeButton : true
	})
};
ListBuilderTab.prototype.showUserTooltip = function(c, b, f) {
	var d = UI.itemListRender(f, {
		dragableImage : true,
		size : "m"
	});
	var a = addList(d, createNode("span", {
		className : "clickable"
	}, null, loc("Add to list")));
	Event.addListener(a, "click", function() {
		this.lb.addItem(f);
		ToolTip.hide()
	}, this);
	addList(d, createNode("a", {
		href : buildURL("profile", {
			id : f.user_id,
			name : f.user_name
		}, f.user_name),
		target : "_blank"
	}, null, loc("View details")));
	ToolTip.show(b, d, {
		closeButton : true
	})
};
ListBuilder.prototype.load = function(a) {
	if (!this.onNew()) {
		return
	}
	this.loadData(a, Event.wrapper(function(b, c) {
		this.info.update(c);
		if (c.max_items) {
			this.maxItems = c.max_items
		}
		this.list.getSource().setData(b);
		this.onNotModified()
	}, this))
};
ListBuilder.prototype.save = function(a) {
};
ListBuilder.prototype.loadData = function(a, b) {
};
function LookbookBuilder(b, c, d, a) {
	a.allowDrafts = true;
	a.msgs = {
		emptyList : loc("Drag sets or items here"),
		openButtonTxt : loc("Open"),
		openButtonAlt : loc("Open"),
		newButtonTxt : loc("New"),
		newButtonAlt : loc("New"),
		draftButtonTxt : loc("Save Draft"),
		draftButtonAlt : loc("Save collection draft"),
		saveButtonTxt : loc("Publish"),
		saveButtonAlt : loc("Publish collection"),
		exceedLimit : loc("This collection exceeds the {max_sets} set limit.", {
			max_sets : a.max_items
		}),
		alreadyExist : loc("This item is already in the collection")
	};
	this.accounts = a.accounts || [];
	a.converter = function(f) {
		f.getHashKey = function() {
			return f.id + ":" + f.thing_id + ":" + f.template_id
		};
		return f
	};
	a.tabs = [];
	if (a.promote) {
		a.tabs.push(this._myTab(new LBItemsTab(this, {
			title : loc("My Items"),
			closable : false,
			selected : false
		})));
		a.tabs.push(new LBAllItemsTab(this, {
			title : loc("All Items"),
			closable : false,
			selected : true,
			search_preset : a.all_items_tab_preset
		}))
	} else {
		a.tabs.push(this._myTab(new LBSetsTab(this, {
			title : loc("My Sets"),
			closable : false,
			selected : true
		})));
		a.tabs.push(this._myTab(new LBItemsTab(this, {
			title : loc("My Items"),
			closable : false,
			selected : false
		})));
		a.tabs.push(new LBAllSetsTab(this, {
			title : loc("All Sets"),
			closable : false,
			selected : !Auth.isLoggedIn()
		}));
		a.tabs.push(new LBAllItemsTab(this, {
			title : loc("All Items"),
			closable : false,
			selected : false
		}));
		if (bucketIs("show_admin_links", "yes")) {
			a.tabs.push(new LBShopItemsTab(this, {
				title : createNode("span", {
					className : "admin_only"
				}, null, "All Products"),
				closable : false,
				selected : false
			}))
		}
	}
	if (parseUri(window.location.toString()).queryKey.templates) {
		a.tabs.push(new LBAllTemplatesTab(this, {
			title : loc("All Templates"),
			closable : false,
			selected : false
		}))
	}
	a.renderer = Event.wrapper(function(n) {
		var p = "m";
		var j = UI.sizeMap[p].dim;
		var f = createNode("div", {
			className : "hoverborder bordered cover_grid"
		});
		var h = createNode("a", {
			title : n.title,
			href : JS_VOID,
			className : "lb_cover"
		}, null, createImg({
			width : j,
			height : j,
			src : UI.buildLookbookImgURL(n, p)
		}));
		var k = createNode("div", {
			className : "reject"
		});
		h.appendChild(k);
		var o = createNode("div", {
			className : "img"
		});
		o.appendChild(h);
		f.appendChild(o);
		var g = createNode("div");
		var m = g.appendChild(createNode("textarea", {
			rows : 5,
			className : "caption",
			maxlength : 255
		}, null, n.note));
		InputHint.add(m, loc("Caption:"));
		["change", "keyup", "mouseup"].forEach(function(q) {
			Event.addListener(m, q, function() {
				n.note = inputValue(m)
			})
		});
		f.appendChild(g);
		Event.addListener(m, "mousedown", function(q) {
			Event.stopBubble(q)
		});
		Event.addListener(m, "click", function(q) {
			Event.stopBubble(q)
		});
		var l = m.value;
		Event.addListener(m, "keydown", function(q) {
			l = m.value
		});
		Event.addListener(m, "keyup", function(q) {
			yield(function() {
				if (m.value != l) {
					this.modified = true
				}
			}, this)
		}, this);
		Event.addListener(k, "click", Event.wrapper(function(q) {
			Event.stop(q);
			this.removeItem(n)
		}, this));
		f = createNode("div", {
			className : "grid cover_grid_spacer"
		}, null, f);
		return f
	}, this);
	LookbookBuilder.superclass.constructor.call(this, b, c, d, a)
}extend(LookbookBuilder, ListBuilder);
LookbookBuilder.prototype._myTab = function(a) {
	if (Auth.isLoggedIn()) {
		return a
	}
	if (!this._asyncTabs) {
		this._asyncTabs = [];
		Event.addSingleUseListener(Event.BACKEND, "signin", function() {
			if (!this.palette) {
				return
			}
			this._asyncTabs.reverse().forEach(function(b) {
				this.palette.unshiftTab(b)
			}, this);
			delete this._asyncTabs
		}, this)
	}
	this._asyncTabs.push(a);
	return null
};
LookbookBuilder.prototype.addItem = function(b, a) {
	LookbookBuilder.superclass.addItem.call(this, b, a);
	if (b.type == "image") {
		Track.engagement({
			engagement : "collect",
			action : "write",
			path : buildURL("thing", {
				id : b.thing_id
			}, b.title),
			brand : b.brand_id || -1,
			host : b.host_id || -1
		})
	}
};
LookbookBuilder.prototype.save = function(b) {
	var d = b ? loc("Save Draft") : loc("Publish Collection");
	var a = [{
		type : "header",
		value : d
	}, {
		name : "title",
		label : loc("Collection Title"),
		type : "text",
		value : this.info.get("title"),
		required : !b,
		maxlength : 255
	}, {
		name : "description",
		label : loc("Description"),
		type : "textarea",
		value : this.info.get("description"),
		maxlength : 4096
	}];
	if (!b) {
		a.push({
			type : "quick_share",
			name : "quickshare",
			listName : "quickshare_list",
			services : this.accounts,
			checked : true,
			inDialog : true,
			label : loc("Sharing")
		})
	}
	a.push(ModalDialog.createErrorElement("error_msg"));
	a.push({
		type : "buttons",
		buttons : [{
			label : b ? loc("Save") : loc("Publish"),
			type : "button",
			onClick : Event.wrapper(function(g) {
				var j = extractInputValues(c);
				if (validateData(j, a)) {
					var f = Event.getSource(g);
					var h = b ? loc("Saving") : loc("Publishing");
					setNode(f, {
						value : h + "...",
						disabled : "true"
					});
					this.info.update(j);
					this.doSave(b)
				} else {
					c = createForm({
						inputs : a
					});
					ModalDialog.show(c)
				}
			}, this)
		}, {
			label : loc("Cancel"),
			type : "cancel",
			onClick : ModalDialog.hide
		}]
	});
	var c = createForm({
		inputs : a
	});
	ModalDialog.show(c)
};
LookbookBuilder.prototype.doSave = function(a) {
	var c = this.list.getSource();
	if (c.size() < 1) {
		return
	}
	var b = {
		items : c.values(),
		id : this.info.get("id"),
		title : this.info.get("title"),
		did : this.info.get("did"),
		uuid : this.info.get("uuid"),
		description : this.info.get("description"),
		visibility : this.info.get("visibility")
	};
	Ajax.post({
		busyMsg : ( a ? loc("Saving") : loc("Publishing")) + "...",
		action : a ? "collection.save_draft" : "collection.save",
		data : {
			lookbook : b,
			quickshare : this.info.get("quickshare"),
			quickshare_list : this.info.get("quickshare_list")
		},
		onSuccess : Event.wrapper(function(d) {
			UI.displayAjaxMessages(d.message);
			this.onNotModified();
			if (a) {
				this.info.update({
					did : d.result.did,
					uuid : d.result.uuid
				})
			} else {
				this.info.update({
					title : d.result.title,
					id : d.result.id,
					uuid : d.result.uuid,
					description : d.result.description,
					visibility : d.result.visibility
				});
				yield(function() {
					var f = {
						id : d.result.id
					};
					if (this.config.promote) {
						f[".promote"] = 1
					}
					window.location = buildURL("collection", f)
				}, this)
			}
			ModalDialog.hide()
		}, this),
		onError : Event.wrapper(function(d) {
			UI.displayAjaxErrors(d, "error_msg")
		}, this)
	})
};
LookbookBuilder.prototype.loadData = function(b, c) {
	var a = b.did;
	Ajax.get({
		busyMsg : ( a ? loc("Loading collection draft") : loc("Loading collection")) + "...",
		action : a ? "collection.load_draft" : "collection.load",
		data : a ? {
			did : b.did
		} : {
			id : b.id
		},
		onSuccess : Event.wrapper(function(f) {
			var d = f.lookbook;
			if (!a && d.did) {
				Feedback.message(loc("The latest draft of this collection has been loaded"))
			}
			if (f.draft_id) {
				d.did = f.draft_id
			}
			if (d.user_id && d.user_id != Auth.userId()) {
				Feedback.message(createNode("div", null, null, ["Created new lookbook based on ", createNode("a", {
					href : buildURL("collection", {
						id : d.id
					})
				}, null, d.title), " by ", createNode("a", {
					href : buildURL("profile", {
						id : d.user_id,
						name : d.user_name
					})
				}, null, d.user_name), ". "]));
				this.modified = true;
				delete d.id;
				delete d.did
			}
			var g = {
				id : d.id,
				did : d.did,
				uuid : d.uuid,
				title : d.title,
				description : d.description,
				visibility : d.visibility,
				max_items : d.max_items
			};
			c(d.items, g)
		}, this)
	})
};
function LBItemsTab(b, a) {
	LBItemsTab.superclass.constructor.call(this, b, a)
}extend(LBItemsTab, ListBuilderTab);
LBItemsTab.prototype.init = function() {
	var a = new MyItemsTabPanel(this, {
		showFilters : true,
		autoSize : true,
		show : {
			footerPagination : true
		}
	});
	a.setEmptyMessage(loc("You do not have any items yet"));
	this.pushPanel(a);
	Event.addListener(a, "click", this.showItemTooltip, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function LBSetsTab(b, a) {
	LBSetsTab.superclass.constructor.call(this, b, a)
}extend(LBSetsTab, ListBuilderTab);
LBSetsTab.prototype.init = function() {
	var a = new MySetsTabPanel(this, {
		showFavorites : true,
		autoSize : true,
		show : {
			footerPagination : true
		}
	});
	this.pushPanel(a);
	Event.addListener(a, "click", this.showSetTooltip, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function LBCollectionsTab(b, a) {
	LBCollectionsTab.superclass.constructor.call(this, b, a)
}extend(LBCollectionsTab, ListBuilderTab);
LBCollectionsTab.prototype.init = function() {
	var a = new MyCollectionsTabPanel(this, {
		showDrafts : true,
		show : {
			footerPagination : true
		}
	});
	this.pushPanel(a);
	Event.addListener(a, "click", function(g, f, j) {
		var b = j.type == "lbd";
		var h = UI.lookbookListRender(j, {
			dragableImage : true
		});
		var d = addList(h, createNode("span", {
			className : "clickable"
		}, null, b ? loc("Edit this draft") : loc("Edit this collection")));
		var c = function(k) {
			this.lb.load(j);
			ToolTip.hide();
			return Event.stop(k)
		};
		Event.addListener(d, "click", c, this);
		Event.addListener(getElementsWithAttributes({root:h,tagName:"img"})[0], "click", c, this);
		if (!b) {
			addList(h, createNode("a", {
				href : buildURL("collection", {
					id : j.id
				}, j.seo_title),
				target : "_blank"
			}, null, loc("View collection")))
		}
		d = addList(h, createNode("span", {
			className : "clickable"
		}, null, b ? loc("Discard") : loc("Delete")));
		Event.addListener(d, "click", function() {
			var l = b ? loc("Really discard this collection draft?") : loc("Really delete this collection?");
			var k = b ? loc("Discard") : loc("Delete");
			ModalDialog.confirm({
				title : l,
				okLabel : k,
				onOk : Event.wrapper(function() {
					if (b) {
						var n = j.did;
						Ajax.post({
							action : "collection.delete_draft",
							data : {
								did : n
							},
							onSuccess : Event.wrapper(function(o) {
								if (n == this.lb.info.get("did")) {
									this.lb.clear()
								}
								UI.displayAjaxMessages(o.message)
							}, this)
						})
					} else {
						var m = j.id;
						Ajax.post({
							action : "collection.delete",
							data : {
								id : m
							},
							onSuccess : Event.wrapper(function(o) {
								if (m == this.lb.info.get("id")) {
									this.lb.clear()
								}
								UI.displayAjaxMessages(o.message)
							}, this)
						})
					}
				}, this)
			});
			ToolTip.hide()
		}, this);
		ToolTip.show(f, h, {
			closeButton : true
		})
	}, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function LBAllItemsTab(b, a) {
	LBAllItemsTab.superclass.constructor.call(this, b, a);
	this.search_preset = a.search_preset
}extend(LBAllItemsTab, ListBuilderTab);
LBAllItemsTab.prototype.init = function() {
	var a = new ItemSearchTabPanel(this, {
		hideHomeButton : true,
		presets : this.search_preset,
		show : {
			footerPagination : true
		}
	});
	a.setEmptyMessage(loc("No matching items found."));
	this.pushPanel(a);
	Event.addListener(a, "click", this.showItemTooltip, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function LBShopItemsTab(b, a) {
	LBShopItemsTab.superclass.constructor.call(this, b, a);
	this.search_preset = a.search_preset
}extend(LBShopItemsTab, ListBuilderTab);
LBShopItemsTab.prototype.init = function() {
	var a = new ItemSearchTabPanel(this, {
		action : "search.shop_things",
		hideHomeButton : true,
		presets : [{
			name : "ship_region",
			value : window._shipRegion,
			fixed : true
		}, {
			name : "require_description",
			value : true,
			fixed : true
		}],
		show : {
			autocomplete : true,
			footerPagination : true
		}
	});
	a.setEmptyMessage(loc("No matching items found."));
	this.pushPanel(a);
	Event.addListener(a, "click", this.showItemTooltip, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function LBAllSetsTab(b, a) {
	LBAllSetsTab.superclass.constructor.call(this, b, a)
}extend(LBAllSetsTab, ListBuilderTab);
LBAllSetsTab.prototype.init = function() {
	var a = new SetSearchTabPanel(this, {
		hideHomeButton : true,
		show : {
			footerPagination : true
		}
	});
	a.setEmptyMessage(loc("No matching sets found."));
	this.pushPanel(a);
	Event.addListener(a, "click", this.showSetTooltip, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function LBAllTemplatesTab(b, a) {
	LBAllTemplatesTab.superclass.constructor.call(this, b, a)
}extend(LBAllTemplatesTab, ListBuilderTab);
LBAllTemplatesTab.prototype.init = function() {
	var a = new TemplateSearchTabPanel(this, {
		hideHomeButton : true
	});
	a.setEmptyMessage(loc("No matching templates found."));
	this.pushPanel(a);
	Event.addListener(a, "click", this.showTemplateTooltip, this);
	Event.addListener(a, "hidetooltip", ToolTip.hide);
	yield(this.autoSize, this)
};
function CanvasWrapper(b, a) {
	this.canvas = createNode("canvas", {
		width : b,
		height : a
	});
	if (Browser.type("IE", 6, 8) && window.G_vmlCanvasManager) {
		window.G_vmlCanvasManager.initElement(this.canvas)
	}
	this.context = this.canvas.getContext("2d");
	this.width = b;
	this.height = a
}
CanvasWrapper.prototype.getNode = function() {
	return this.canvas
};
CanvasWrapper.prototype.resize = function(b, a) {
	setNode(this.canvas, {
		width : b,
		height : a
	})
};
CanvasWrapper.prototype.setStrokePattern = function(a) {
	if (a) {
		this.context.strokeStyle = this.context.createPattern(a, "repeat")
	}
};
CanvasWrapper.prototype.drawLine = function(a) {
	if (a.a.distance(a.b) < 1) {
		return
	}
	this.context.beginPath();
	this.context.moveTo(a.a.x, a.a.y);
	this.context.lineTo(a.b.x, a.b.y);
	this.context.closePath();
	this.context.stroke()
};
CanvasWrapper.prototype.drawShape = function(b, g, d) {
	if (b.length < 2) {
		return
	}
	this.context.beginPath();
	var f = b[0];
	this.context.moveTo(f.x, f.y);
	for (var a = 1; a < b.length; a++) {
		var c = b[a];
		this.context.lineTo(c.x, c.y)
	}
	if (g) {
		this.context.closePath()
	}
	if (d) {
		this.context.fill()
	} else {
		this.context.stroke()
	}
};
CanvasWrapper.prototype.getCanvasDiv = function() {
	if (Browser.type("IE", 6, 8)) {
		return this.canvas.getElementsByTagName("div")[0]
	}
	return null
};
CanvasWrapper.prototype.clearCanvas = function() {
	this.context.clearRect(0, 0, this.width, this.height);
	if (Browser.type("IE", 6, 8)) {
		var a = this.getCanvasDiv();
		if (a) {
			a.style.filter = ""
		}
	}
};
CanvasWrapper.prototype.drawImage = function(f, d, c, h) {
	var g = c ? c : new Point(0, 0);
	this.clearCanvas();
	this.context.globalCompositeOperation = "source-over";
	if (h) {
		for (var b = g.x; b < this.width; b += d.w) {
			for (var a = g.y; a < this.height; a += d.h) {
				this.context.drawImage(f, b, a, d.w, d.h)
			}
		}
	} else {
		this.context.drawImage(f, g.x, g.y, d.w, d.h)
	}
};
CanvasWrapper.prototype.clipImageForIE = function(f, c, d, g) {
	if (!c.length) {
		return
	}
	hide(f);
	this.drawShape(c, true, true);
	var h = this.getCanvasDiv();
	var a = h.childNodes[1] || h.childNodes[0];
	a.innerHTML = "";
	var b = a.outerHTML;
	h.innerHTML = "";
	h.appendChild(createImg({
		src : f.src,
		width : d.w,
		height : d.h
	}, {
		position : "absolute",
		top : px(g.y),
		left : px(g.x)
	}));
	h.style.filter = "progid:DXImageTransform.Microsoft.Compositor(function=7, duration=1)";
	h.filters.item(0).Apply();
	h.innerHTML = b;
	h.filters.item(0).Play()
};
CanvasWrapper.prototype.clipImageForSafari = function(a, b, c) {
	this.drawImage(a, c, new Point(0, 0), true);
	if (!b.length) {
		return
	}
	this.context.globalCompositeOperation = "destination-out";
	this.drawShape(b, true, true);
	this.context.globalCompositeOperation = "source-over";
	this.drawShape(b, true, false)
};
CanvasWrapper.prototype.clipImage = function(d, b, c, g, a, f) {
	if (Browser.type("IE", 6, 8)) {
		this.clipImageForIE(d, b, c, g);
		this.clipImageForIE(d, b, c, g);
		return
	} else {
		if (Browser.layoutEngine("WebKit")) {
			this.clipImageForSafari(a, b, f);
			return
		}
	}
	this.drawImage(d, c, g);
	hide(d);
	if (!b.length) {
		return
	}
	this.context.globalCompositeOperation = "destination-in";
	this.drawShape(b, true, true);
	this.context.globalCompositeOperation = "source-over";
	this.drawShape(b, true, false)
};
function LassoTool(a, f, c) {
	this._container = a;
	this._bkgdImage = c.bkgdImage;
	this._bkgdDim = c.bkgdDim;
	this._selectMode = c.selectMode || LassoTool.SELECT_MODE.FREESTYLE;
	this._width = f.w;
	this._height = f.h;
	this._imageDim = c.imageDim;
	this._maxPoints = c.maxPoints || 50;
	this._padding = c.padding || 10;
	this._offset = new Point(this._padding + (f.w - this._imageDim.w - this._padding * 2) / 2, this._padding + (f.h - this._imageDim.h - this._padding * 2) / 2);
	var d = {
		width : px(this._imageDim.w),
		height : px(this._imageDim.h),
		left : px(this._offset.x),
		top : px(this._offset.y)
	};
	if (!Browser.layoutEngine("WebKit")) {
		a.appendChild(createNode("div", {
			className : "whiteUnder"
		}, d));
		var g = c.image.getAttribute("src");
		a.appendChild(createNode("img", {
			src : g,
			className : "imageUnder"
		}, d))
	}
	this._image = a.appendChild(c.image);
	setNode(this._image, null, d);
	show(this._image);
	this._canvasWrapper = new CanvasWrapper(this._width, this._height);
	var b = a.appendChild(this._canvasWrapper.canvas);
	setNode(b, {
		className : "lassoCanvas"
	});
	this._topLayer = a.appendChild(createNode("div", {
		className : "lassoLayer"
	}, {
		height : px(this._height),
		width : px(this._width)
	}));
	this._layerPosition = nodeXY(this._topLayer);
	this.cleaner = new Cleaner();
	this.cleaner.push(Event.addListener(this._topLayer, "click", this.onCanvasClick, this));
	if (Browser.type("IE", 6, 8)) {
		this.cleaner.push(Event.addListener(this._image, "click", this.onCanvasClick, this))
	}
	if (Browser.type("IE", 9, null)) {
		this.cleaner.push(Event.addListener(b, "click", this.onCanvasClick, this))
	}
	this.cleaner.push(Event.addListener(document, "mousemove", this.onCanvasMouseMove, this));
	this.cleaner.push(Event.addListener(window, "resize", this.onResize, this));
	this.cleaner.push(Event.addListener(document, "keydown", Event.wrapper(function(j) {
		if (j.keyCode == 16) {
			this._snapLine = true
		}
	}), this));
	this.cleaner.push(Event.addListener(document, "keyup", Event.wrapper(function(j) {
		if (j.keyCode == 16) {
			this._snapLine = false
		}
	}), this));
	this.reset();
	if (c.strokePattern) {
		var h = new Image();
		h.onload = Event.wrapper(function() {
			this._canvasWrapper.setStrokePattern(h);
			this.redraw()
		}, this);
		h.src = c.strokePattern;
		h.style.display = "none";
		a.appendChild(h)
	}
}
LassoTool.MIN_DISTANCE_FROM_DRAG_POINT = 10;
LassoTool.MIN_DISTANCE_FROM_CLICK_POINT = 5;
LassoTool.MIN_DISTANCE_FROM_LINE = 10;
LassoTool.SELECT_MODE = {
	FREESTYLE : 0,
	RECTANGLE : 1
};
LassoTool.prototype.destruct = function() {
	clearNode(this._topLayer, true);
	clearNode(this._image, true);
	this.clearFlexElem();
	this.cleaner.clean()
};
LassoTool.prototype._setMode = function(a) {
	if (this._selectMode != a) {
		this._selectMode = a;
		Event.trigger(this, "mode_change", a);
		return true
	}
	return false
};
LassoTool.prototype.setMode = function(a) {
	if (this._setMode(a)) {
		this.reset()
	}
};
LassoTool.prototype._reset = function() {
	clearNode(this._topLayer);
	this._points = [];
	this._segments = [];
	this._closed = false;
	this._moving = false;
	this.clearFlexElem();
	this._flexLine = null
};
LassoTool.prototype.reset = function() {
	this._reset();
	if (this._selectMode == LassoTool.SELECT_MODE.RECTANGLE) {
		this._closed = true;
		this.replay([new Point(0, 0), new Point(this._imageDim.w, 0), new Point(this._imageDim.w, this._imageDim.h), new Point(0, this._imageDim.h)])
	}
	this.redraw()
};
LassoTool.prototype.redraw = function() {
	if (this._closed) {
		this._canvasWrapper.clipImage(this._image, this._points, this._imageDim, this._offset, this._bkgdImage, this._bkgdDim)
	} else {
		show(this._image);
		this._canvasWrapper.clearCanvas();
		if (!this._points.length) {
			return
		}
		this._canvasWrapper.drawShape(this._points, false, false);
		if (this._flexLine) {
			this._canvasWrapper.drawLine(this._flexLine)
		}
	}
};
LassoTool.prototype.replay = function(c) {
	var f = this._closed;
	this._reset();
	this._points = [];
	for (var b = 0; b < c.length; b++) {
		var a = new Point(Number(c[b].x) + Number(this._layerPosition.x) + this._offset.x, Number(c[b].y) + Number(this._layerPosition.y) + this._offset.y);
		this.createLassoPoint(a)
	}
	if (f) {
		this.closeShape()
	} else {
		if (this._points.length) {
			this._flexLine = new Segment(this._points[this._points.length - 1], this._points[this._points.length - 1])
		}
		this.redraw()
	}
	var d = (this._points.length == 4 && this._points[0].y == this._points[1].y && this._points[1].x == this._points[2].x && this._points[2].y == this._points[3].y && this._points[3].x == this._points[0].x);
	if (d) {
		this._setMode(LassoTool.SELECT_MODE.RECTANGLE)
	} else {
		this._setMode(LassoTool.SELECT_MODE.FREESTYLE)
	}
};
LassoTool.prototype.computeSegments = function() {
	this._segments = [];
	for (var a = 0; a < this._points.length - 1; a++) {
		this._segments.push(new Segment(this._points[a], this._points[a + 1]))
	}
	this._segments.push(new Segment(this._points[this._points.length - 1], this._points[0]))
};
LassoTool.prototype.createLassoPoint = function(b) {
	if (this.maxPointsReached()) {
		return null
	}
	var a = new LassoPoint(b, this._topLayer);
	this._points.push(a);
	this.addPointHandlers(a);
	if (this._points.length == 1) {
		this.cleaner.push(Event.addListener(a.elem, "click", this.closeShape, this))
	} else {
		this.cleaner.push(Event.addListener(a.elem, "click", Event.stop))
	}
	this.cleaner.push(Event.addListener(a.elem, "mouseover", this.clearFlexElem, this));
	return a
};
LassoTool.prototype.onCanvasClick = function(g) {
	if (this._closed) {
		return
	}
	if (this._selectMode == LassoTool.SELECT_MODE.RECTANGLE) {
		return
	}
	var c = Event.getPageXY(g);
	var f = new Point(c.x - this._layerPosition.x, c.y - this._layerPosition.y);
	for (var d = 0; d < this._points.length; d++) {
		if (this._points[d].distance(f) < LassoTool.MIN_DISTANCE_FROM_CLICK_POINT) {
			return null
		}
	}
	var a = this.createLassoPoint(c);
	if (!a) {
		return
	}
	if (this._points.length >= 2) {
		var b = this._points[this._points.length - 2];
		this.maybeSnapLine(a, b);
		this._canvasWrapper.drawLine(new Segment(b, a))
	}
	if (this.maxPointsReached()) {
		this.closeShape()
	} else {
		this._flexLine = new Segment(a, a)
	}
};
LassoTool.prototype.getMinDistance = function(a) {
	var b = 10000;
	var f = -1;
	for (var c = 0; c < this._segments.length; c++) {
		var d = this._segments[c].distanceTo(a);
		if (d < b) {
			b = d;
			f = c
		}
	}
	return [f, b]
};
LassoTool.prototype.maxPointsReached = function() {
	return this._points.length >= this._maxPoints
};
LassoTool.prototype.maybeSnapLine = function(a, b) {
	if (b && this._snapLine) {
		var c = Math.abs(Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI);
		if (c > 90) {
			c = 180 - c
		}
		if (c <= 45) {
			a.y = b.y
		} else {
			a.x = b.x
		}
		if (a.elem) {
			setNode(a.elem, null, {
				top : px(a.y)
			});
			setNode(a.elem, null, {
				left : px(a.x)
			})
		}
	}
};
LassoTool.prototype.onCanvasMouseMove = function(g) {
	if (!this._points.length || this.maxPointsReached()) {
		return
	}
	var j = Event.getPageXY(g);
	var b = new Point(j.x - this._layerPosition.x, j.y - this._layerPosition.y);
	if (this._selectMode == LassoTool.SELECT_MODE.RECTANGLE) {
		return
	}
	if (!this._closed && this._flexLine) {
		if (this._points.length) {
			this.maybeSnapLine(b, this._points[this._points.length - 1])
		}
		this._flexLine.b = b;
		this.redraw();
		return
	}
	if (this._moving) {
		return
	}
	var f = this.getMinDistance(b);
	var h = f[0];
	var d = f[1];
	if (d > LassoTool.MIN_DISTANCE_FROM_LINE) {
		this.clearFlexElem();
		return
	}
	var a = this._segments[h];
	if (a.a.distance(b) < LassoTool.MIN_DISTANCE_FROM_DRAG_POINT || a.b.distance(b) < LassoTool.MIN_DISTANCE_FROM_DRAG_POINT) {
		return
	}
	var c = a.closestPoint(b);
	this.clearFlexElem();
	this._flexElem = LassoPoint.createElement(c.x, c.y);
	this._topLayer.appendChild(this._flexElem);
	this.cleaner.push(Event.addListener(this._flexElem, "mouseout", Event.wrapper(function() {
		this.clearFlexElem()
	}, this)));
	this.cleaner.push(Event.addListener(this._flexElem, "mousedown", Event.wrapper(function(k) {
		this.onFlexElemMouseDown(k, h)
	}, this)))
};
LassoTool.prototype.clearFlexElem = function() {
	if (this._flexElem) {
		domRemoveNode(this._flexElem, true);
		this._flexElem = null
	}
};
LassoTool.prototype.onFlexElemMouseDown = function(b, c) {
	this.clearFlexElem();
	var a = new LassoPoint(Event.getPageXY(b), this._topLayer);
	this._points.splice(c + 1, 0, a);
	this.computeSegments();
	Event.trigger(a.elem, "mousedown");
	this.addPointHandlers(a)
};
LassoTool.prototype.addPointHandlers = function(a) {
	Event.addListener(a, "movestart", Event.wrapper(function(c) {
		if (this._selectMode == LassoTool.SELECT_MODE.RECTANGLE) {
			for (var b = 0; b < this._points.length; b++) {
				if (this._points[b] == a) {
					a.pointIndex = b;
					break
				}
			}
		}
	}, this));
	Event.addListener(a, "move", Event.wrapper(function(b) {
		this._moving = true;
		if (this._selectMode == LassoTool.SELECT_MODE.RECTANGLE) {
			var c = b.delta;
			switch(a.pointIndex) {
				case 0:
					this._points[3].moveBy(-c.x, 0);
					this._points[1].moveBy(0, -c.y);
					break;
				case 1:
					this._points[2].moveBy(-c.x, 0);
					this._points[0].moveBy(0, -c.y);
					break;
				case 2:
					this._points[1].moveBy(-c.x, 0);
					this._points[3].moveBy(0, -c.y);
					break;
				case 3:
					this._points[0].moveBy(-c.x, 0);
					this._points[2].moveBy(0, -c.y);
					break
			}
		}
		this.redraw();
		this.clearFlexElem()
	}, this));
	Event.addListener(a, "moveend", Event.wrapper(function() {
		this.computeSegments();
		this._moving = false;
		this.recomputeZIndices(a)
	}, this))
};
LassoTool.prototype.recomputeZIndices = function(a) {
	var c = -1;
	for (var b = 0; b < this._points.length; b++) {
		if (a != this._points[b] && this._points[b].distance(a) < LassoTool.MIN_DISTANCE_FROM_DRAG_POINT) {
			var d = this._points[b].elem;
			c = Math.max(Number(d.style.zIndex) || 0, c)
		}
	}
	if (c >= 0) {
		a.elem.style.zIndex = c + 1
	}
};
LassoTool.prototype.closeShape = function() {
	if (this._closed) {
		return
	}
	if (this._points.length >= 3) {
		this._closed = true;
		this._flexLine = [];
		this.computeSegments();
		this.redraw()
	}
};
LassoTool.prototype.points = function(c) {
	if (this._closed || c) {
		var b = [];
		for (var a = 0; a < this._points.length; a++) {
			b.push(new Point(Math.max(0, Math.min(this._points[a].x - this._offset.x, this._imageDim.w)), Math.max(0, Math.min(this._points[a].y - this._offset.y, this._imageDim.h))))
		}
		return b
	} else {
		return []
	}
};
LassoTool.prototype.onResize = function() {
	window.setTimeout(Event.wrapper(function() {
		this._layerPosition = nodeXY(this._topLayer);
		if (this._points.length) {
			var a = this.points(true);
			this.replay(a)
		}
	}, this), 0)
};
function LassoPoint(b, a) {
	this._parentPosition = nodeXY(a);
	this._container = a;
	this.setPosition(b);
	this.elem = a.appendChild(LassoPoint.createElement(this.x, this.y));
	Event.addListener(this.elem, "mousedown", this.onMouseDown, this)
}extend(LassoPoint, Point);
LassoPoint.prototype.onMouseUp = function(a) {
	Event.removeListener(document, "mouseup", this.onMouseUp, this);
	Event.removeListener(document, "mousemove", this.onMouseMove, this);
	Event.trigger(this, "moveend", {
		delta : {
			x : this.startXY.x - this.x,
			y : this.startXY.y - this.y
		}
	});
	Event.stop(a)
};
LassoPoint.prototype.onMouseDown = function(a) {
	this.startXY = {
		x : this.x,
		y : this.y
	};
	Event.addListener(document, "mouseup", this.onMouseUp, this);
	Event.addListener(document, "mousemove", this.onMouseMove, this);
	if (a) {
		Event.stop(a)
	}
	Event.trigger(this, "movestart", {
		start : this.startXY
	})
};
LassoPoint.createElement = function(a, b) {
	return createNode("div", {
		className : "lassoPoint"
	}, {
		top : px(b),
		left : px(a)
	})
};
LassoPoint.prototype.setPosition = function(a) {
	this.x = Math.max(0, Math.min(a.x - this._parentPosition.x, this._container.clientWidth));
	this.y = Math.max(0, Math.min(a.y - this._parentPosition.y, this._container.clientHeight))
};
LassoPoint.prototype.moveBy = function(a, b) {
	this.x = this.x + a;
	this.y = this.y + b;
	setNode(this.elem, null, {
		top : px(this.y)
	});
	setNode(this.elem, null, {
		left : px(this.x)
	})
};
LassoPoint.prototype.onMouseMove = function(c) {
	var b = this.x;
	var a = this.y;
	this.setPosition(Event.getPageXY(c));
	setNode(this.elem, null, {
		top : px(this.y)
	});
	setNode(this.elem, null, {
		left : px(this.x)
	});
	var d = {
		x : b - this.x,
		y : a - this.y
	};
	Event.trigger(this, "move", {
		delta : d
	});
	Event.stop(c)
};
var LassoDialog = function() {
	var d = new Dim(96, 96);
	var u = new Image();
	u.src = buildRsrcURL("img/transparent_checkerboard.png");
	var b = d.w * 4;
	var m = 10;
	var p = 50;
	var v = null;
	var g = null;
	var q = null;
	var c = buildRsrcURL("img/checkerboard.jpg");
	var r = new Cleaner();
	function o(z, y, w) {
		if (z.length) {
			for (var x = 0; x < z.length; x++) {
				z[x].x = (z[x].x / y).toFixed(3);
				z[x].y = (z[x].y / w).toFixed(3)
			}
		}
		return z
	}

	function j(z, x) {
		var y;
		var w = b - m * 2;
		if (z > x) {
			y = z / w;
			z = w;
			x = x / y
		} else {
			y = x / w;
			z = z / y;
			x = w
		}
		return new Dim(z, x)
	}

	function s(z) {
		var w = new Point(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		var x = new Point(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
		for (var y = 0; y < z.length; y++) {
			w.x = Math.min(w.x, z[y].x);
			w.y = Math.min(w.y, z[y].y);
			x.x = Math.max(x.x, z[y].x);
			x.y = Math.max(x.y, z[y].y)
		}
		return new Dim(x.x - w.x, x.y - w.y)
	}

	function n(y, z) {
		if (y.mask_spec.length) {
			var w = [];
			for (var x = 0; x < y.mask_spec.length; x++) {
				w.push(new Point(y.mask_spec[x].x * z.w, y.mask_spec[x].y * z.h))
			}
			v.replay(w);
			v.closeShape()
		}
	}

	function t(z, y, A) {
		var x = z.spec;
		var B = buildImgURL("img-thing", {
			tid : y.thing_id,
			size : "s",
			".out" : "png",
			mask_spec : JSON2.stringify(x)
		});
		var C = createNode("div", {
			className : "altMask"
		});
		var w = C.appendChild(createNode("img", {
			src : B
		}));
		r.push(Event.addListener(C, "click", function() {
			var E = [];
			for (var D = 0; D < x.length; D++) {
				E.push(new Point(x[D].x * A.w, x[D].y * A.h))
			}
			v.replay(E);
			v.closeShape();
			g = z.id
		}));
		return C
	}

	function f(w, A, z, B) {
		if (!A || !A.result || !A.result.items || !A.result.items.length) {
			return
		}
		addClass(w, "altMaskCell");
		w.appendChild(createNode("div", {
			className : "explain"
		}, null, loc("Or use these:")));
		if (!q) {
			q = w.appendChild(createNode("div", {
				className : "altMaskContainer"
			}, {
				height : px(b)
			}))
		} else {
			clearNode(q, true);
			w.appendChild(q)
		}
		for (var x = 0; x < A.result.items.length; x++) {
			var y = t(A.result.items[x], z, B);
			q.appendChild(y)
		}
		if (v) {
			v.onResize()
		}
		return true
	}

	function a(x, w, y, z) {
		Ajax.get({
			action : "app.get_masks",
			data : {
				tid : y.thing_id
			},
			onSuccess : function(A) {
				if (f(w, A, y, z) && Browser.isIE) {
					setNode(x, null, {
						width : px(b + 140)
					})
				}
			}
		})
	}

	function h() {
		g = null;
		v.reset()
	}

	function l(N, z, O, C) {
		var I = z.w;
		var D = z.h;
		var J = O.w / I;
		var B = createNode("div", {
			className : "lassoDialog"
		});
		if (Browser.isIE) {
			setNode(B, null, {
				width : px(b)
			})
		}
		B.appendChild(createNode("h5", null, null, C.header));
		var y = B.appendChild(createNode("div", {
			className : "left"
		}));
		var H = createNode("span", {
			className : "explain"
		});
		var G = [{
			mode : LassoTool.SELECT_MODE.FREESTYLE,
			label : loc("Polygon"),
			subheader : loc("Click to draw a path."),
			iconClass : "polygon"
		}, {
			mode : LassoTool.SELECT_MODE.RECTANGLE,
			label : loc("Rectangle"),
			subheader : loc("Drag corners of the rectangle to crop"),
			iconClass : "rectangle"
		}];
		var K = new HorizontalSelect({
			options : G,
			renderer : function(Q, P) {
				return createNode("div", {
					className : "selector selector_" + Q.iconClass
				}, null, "&nbsp;")
			},
			comp : function(Q, P) {
				return (Q === P.mode)
			}
		});
		H.innerHTML = G[0].subheader;
		Event.addListener(K, "change", function() {
			var P = K.getValue();
			if (!P) {
				return
			}
			H.innerHTML = P.subheader;
			Event.trigger(K, "mode_change", P.mode)
		}, this);
		C.mode = C.mode || LassoTool.SELECT_MODE.FREESTYLE;
		K.select(C.mode);
		y.appendChild(createNode("div", {
			className : "header"
		}, null, [K.getNode(), H]));
		var F = y.appendChild(createNode("div", {
			className : "lassoOuter"
		}, {
			position : "relative",
			backgroundImage : "url(" + u.src + ")",
			width : px(b),
			height : px(b)
		}));
		var L = B.appendChild(createNode("div", {
			className : "left"
		}));
		if (N) {
			a(B, L, N, z)
		}
		B.appendChild(createNode("br", {
			className : "clear"
		}));
		var M = B.appendChild(createNode("div", {
			className : "buttons"
		}));
		var x = M.appendChild(createNode("span", {
			className : "clickable left"
		}, null, loc("Clear")));
		var E = M.appendChild(createNode("input", {
			className : "right",
			type : "button",
			value : loc("Cancel")
		}));
		var A = null;
		if (C.showSave) {
			A = M.appendChild(createNode("input", {
				className : "right",
				type : "button",
				value : loc("Save")
			}))
		}
		var w = M.appendChild(createNode("input", {
			className : "right",
			type : "button",
			value : loc("OK")
		}));
		M.appendChild(createNode("br", {
			className : "clear"
		}));
		Event.addListener(E, "click", function() {
			if (C.onCancel) {
				C.onCancel()
			}
			LassoDialog.hide()
		});
		Event.addListener(w, "click", function() {
			var R = v.points();
			var S;
			if (R.length) {
				S = s(R);
				R = o(R, I, D)
			} else {
				S = new Dim(I, D)
			}
			S.w *= J;
			S.h *= J;
			if (N) {
				if (S.w < 2 || S.h < 2) {
					Feedback.message(loc("Oh no!") + " " + loc("The cropped area is too small!"));
					return
				}
				var Q = Math.max(15, I / D, D / I);
				if (S.w / S.h > Q || S.h / S.w > Q) {
					Feedback.message(loc("Oh no!") + " " + loc("The aspect ratio is too big!") + " " + loc("Try not to make the item too long or too tall."));
					return
				}
				var P = N.mask_spec.length != R.length;
				for ( i = 0; !P && i < N.mask_spec.length; ++i) {
					if (N.mask_spec[i].x != R[i].x || N.mask_spec[i].y != R[i].y) {
						P = true;
						break
					}
				}
				if (P) {
					N.setMaskSpec(R, g, S)
				}
			}
			if (C.onSuccess) {
				C.onSuccess(R, S)
			}
			LassoDialog.hide()
		});
		if (A) {
			Event.addListener(A, "click", function() {
				var P = o(v.points(), I, D);
				if (P.length) {
					callOrSignIn(function() {
						Ajax.post({
							action : "app.save_mask",
							data : {
								id : N.thing_id,
								mask_spec : JSON2.stringify(P)
							},
							onSuccess : function() {
								Feedback.message(loc("Your custom background has been saved."));
								a(B, L, N, z)
							},
							onError : function(Q) {
								Feedback.messageFromResponse(Q)
							}
						})
					}, "mask_save")
				} else {
					Feedback.message(loc("You must have a valid custom background before saving."))
				}
			})
		}
		Event.addListener(x, "click", h);
		return {
			modeSelect : K,
			container : B,
			lassoContainer : F
		}
	}

	function k(y, x, w) {
		getNaturalWidthHeight(y, function(A, z) {
			var D = j(A, z);
			var E = x ? x.getUnmaskedDim() : new Dim(A, z);
			var C = l(x, D, E, w);
			var B = createNode("img", {
				className : "lassoImage",
				width : D.w,
				height : D.h
			}, {
				display : "none"
			});
			Event.addListener(B, "load", function() {
				ModalDialog.show(C.container);
				v = new LassoTool(C.lassoContainer, new Dim(b, b), {
					image : B,
					imageDim : D,
					bkgdImage : u,
					bkgdDim : d,
					maxPoints : p,
					padding : m,
					strokePattern : c,
					mode : w.mode
				});
				r.push(Event.addListener(document, "keydown", function(F) {
					if (F.keyCode == 27) {
						h()
					}
				}));
				r.push(Event.addListener(C.modeSelect, "mode_change", function(F) {
					v.setMode(F)
				}));
				r.push(Event.addListener(v, "mode_change", function(F) {
					C.modeSelect.select(F)
				}));
				if (x) {
					n(x, D)
				}
			});
			B.src = y
		})
	}
	return {
		hide : function() {
			g = null;
			q = null;
			v.destruct();
			r.clean();
			ModalDialog.hide()
		},
		showSimple : function(y, x, w) {
			k(y, x, w)
		},
		showExpanded : function(w) {
			var y = w.clone();
			y.mask_spec = "";
			y.bkgd = 1;
			var x = y.computeImgURL(true, true);
			k(x, w, {
				header : loc("Custom Background"),
				showSave : true
			})
		}
	}
}();
function FlipBook(a) {
	a = a || {};
	this._renderer = a.renderer;
	this._defaultRenderer = a.defaultRenderer || noop;
	this._node = createNode("div", {
		className : "flipbook"
	}, {
		width : a.width,
		height : a.height
	});
	if (a.emptyMessage) {
		this._emptyMessage = a.emptyMessage
	}
	Event.addListener(this._node, "mousemove", this.onMouseMove, this);
	Event.addListener(this._node, "mouseout", function(b) {
		this._flip()
	}, this);
	this._data = a.data;
	Event.addSingleUseListener(this._data, "loaded", function() {
		this._flip()
	}, this);
	yield(this._data.ensureLoaded, this._data)
}
FlipBook.prototype.destruct = function() {
	Event.removeListener(this._data, "loaded", this.redraw, this);
	Event.removeListener(this._node, "mouseout", this._defaultRenderer, this);
	clearNode(this._node, true)
};
FlipBook.prototype.getNode = function() {
	return this._node
};
FlipBook.prototype.onMouseMove = function(c) {
	var b = Event.getSource(c);
	var a = Event.getPageXY(c).x - nodeXY(b).x;
	var d = Dim.fromNode(b).w;
	if (a < 0 || a >= d) {
		return
	}
	this.flip(Math.floor(a / d * this._data.size()))
};
FlipBook.prototype.flip = function(a) {
	this._flip(this._data.get(a))
};
FlipBook.prototype._flip = function(a) {
	var b;
	if (!this._data.size() && this._emptyMessage) {
		b = createNode("span", null, null, this._emptyMessage)
	} else {
		if (a === undefined) {
			b = this._defaultRenderer()
		} else {
			b = this._renderer(a)
		}
	}
	if (this._node.childNodes[0]) {
		this._node.replaceChild(b, this._node.childNodes[0])
	} else {
		this._node.appendChild(b)
	}
};
function SelectorTab(a, b) {
	SelectorTab.superclass.constructor.call(this, a);
	this.options = a;
	this.data = b || {}
}extend(SelectorTab, Tab);
SelectorTab.prototype.init = function() {
	if (this._initialized) {
		return
	}
	this._initialized = true;
	this.tabpanel = new SelectorTabPanel(this, this.options, this.data);
	this.pushPanel(this.tabpanel)
};
SelectorTab.prototype.deselectItem = function(a) {
	if (this.tabpanel) {
		this.tabpanel.deselect(a)
	}
};
SelectorTab.prototype.clearItemSelection = function() {
	if (this.tabpanel) {
		this.tabpanel.clearSelection()
	}
};
function SelectorTabPanel(b, l, d) {
	SelectorTabPanel.superclass.constructor.call(this, b);
	var k = {
		page : 1,
		length : l.pageSize
	};
	if (l.queryParams) {
		forEachKey(l.queryParams, function(n, m) {
			k[n] = m
		})
	}
	var g = new AjaxDataSource(l.query, k, {
		converter : function(m) {
			m.getHashKey = function() {
				return m[l.idField]
			};
			return m
		},
		backendEvents : (l.backendEvents || [])
	});
	var j = new ResultSet({
		renderer : l.itemRenderer,
		mouseWheelPagination : true,
		source : g
	});
	var h = new Selectable({
		result : j,
		selectedData : l.selectedData,
		multiSelect : l.multiSelect,
		max : l.max
	});
	Event.addListener(h, "max", function() {
		Feedback.message(loc("You can only select up to {max} items.", {
			max : l.max
		}) + " " + loc("Please delete one of your previous selections."))
	});
	this.setResult(j);
	var c = createNode("div");
	this._node.appendChild(c);
	j.init(c);
	if (l.searchOptions) {
		var f = l.searchOptions;
		this.createFilters({
			show : {
				tag : f.showTagFilter,
				query : f.showQueryFilter,
				price : f.showPriceFilter,
				color : f.showColorFilter,
				brand : true,
				category_id : true,
				displayurl : true,
				autocomplete : f.showAutocomplete,
				hselect : f.hselect
			}
		});
		if (f.htmlRenderer) {
			var a = f.htmlRenderer.call(this);
			if (a) {
				this._results.getHeaderNode().appendChild(a)
			}
		}
	} else {
		j.addPaginationPaddles()
	}
	j.setEmptyMessage(l.emptyMessage);
	if (!j.redrawIfDirty()) {
		j.redraw()
	}
	this.deselect = function(m) {
		h.deselect(m)
	};
	this.clearSelection = function() {
		h.clearSelection()
	}
}extend(SelectorTabPanel, FilteredTabPanel);
function TabbedSelector(s, g) {
	TabbedSelector.superclass.constructor.call(this);
	this.data = g;
	var l = s.tabs;
	var d = createNode("div", {
		className : "selector clearfix"
	});
	var n = s.multiSelect ? s.multiTitle : s.title;
	var k = new MemDataSource();
	if (s.selectedData && s.selectedData.size() > 0) {
		k.setData(s.selectedData.values())
	}
	var p = d.appendChild(createNode("div"));
	var b = new TabBox(p);
	var q = [];
	var f = true;
	l.forEach(function(t) {
		if (t.requireSignIn && !Auth.isLoggedIn()) {
			return
		}
		var u = cloneObject(t, true);
		u.title = t.label;
		u.selectedData = k;
		u.selected = f;
		f = false;
		u.multiSelect = s.multiSelect;
		u.max = s.max;
		q.push(new SelectorTab(u, g))
	});
	b.add(q);
	if (s.multiSelect) {
		var j = createNode("div", {
			className : "unselectable selections"
		});
		d.appendChild(j);
		var a = null;
		var o = function() {
			a = Carousel.create(j, {
				data : k,
				renderer : function(v) {
					var u = createNode("a", {
						target : "_blank",
						href : "#foo",
						className : "selected_item"
					}, null, s.selectedItemRenderer(v, "t"));
					var t = createNode("div", {
						className : "reject"
					});
					u.appendChild(t);
					Event.addListener(u, "click", Event.stop);
					Event.addListener(t, "click", function(w) {
						q.forEach(function(x) {
							x.deselectItem(v)
						});
						k.remove(v);
						Event.stop(w)
					}, this);
					return u
				},
				cellDim : new Dim(62, 56),
				emptyMessage : loc("No selection")
			})
		};
		o()
	}
	if (s.form) {
		this.form = d.appendChild(createNode("form", {
			className : "selector_form"
		}));
		var c = this.form.appendChild(createNode("div", {
			className : "stdform"
		}));
		var r = createFormBody(c, s.form);
		c.appendChild(r)
	}
	var m = [];
	function h() {
		m.forEach(function(t) {
			t.clean()
		});
		q.forEach(function(t) {
			t.clearPanels();
			t.cleaner.clean()
		});
		ModalDialog.hide(false)
	}
	this.show = function() {
		ModalDialog.show_uic({
			id : "selector_dialog",
			title : n,
			body : d,
			actions : [{
				id : "okbtn",
				label : s.okText ? s.okText : loc("OK"),
				actionClass : "btn btn_action",
				disabled : true,
				action : Event.wrapper(function() {
					h();
					var t = k.values();
					if (!s.multiSelect) {
						if (t.length > 0) {
							t = t[0]
						} else {
							t = null
						}
					}
					Event.trigger(this, "change", t)
				}, this)
			}, {
				label : loc("Cancel"),
				action : h
			}]
		});
		m.push(Event.addListener(k, "change", function() {
			setNode($("okbtn"), {
				disabled : (k.values().length > 0 ? null : true)
			})
		}));
		ModalDialog.rePosition()
	}
}extend(TabbedSelector, BaseSelector);
function Selector(r, d) {
	Selector.superclass.constructor.call(this);
	if (!d) {
		d = {}
	}
	if (!d.page) {
		d.page = 1
	}
	if (!d.length) {
		d.length = r.pageSize
	}
	if (r.queryParams) {
		forEachKey(r.queryParams, function(t, s) {
			d[t] = s
		})
	}
	var c = createNode("div", {
		className : "selector clearfix"
	});
	var n = r.multiSelect ? r.multiTitle : r.title;
	c.appendChild(createNode("h4", null, null, n));
	var f = createNode("div", {
		className : "unselectable"
	});
	c.appendChild(f);
	var l = new MemDataSource();
	if (r.selectedData && r.selectedData.size() > 0) {
		l.setData(r.selectedData.values())
	}
	var j = new AjaxDataSource(r.query, d, {
		converter : function(s) {
			s.getHashKey = function() {
				return s[r.idField]
			};
			return s
		}
	});
	var o = new ResultSet({
		renderer : r.itemRenderer,
		source : j
	});
	var k = new Selectable({
		result : o,
		multiSelect : r.multiSelect,
		selectedData : l,
		max : r.max
	});
	Event.addListener(k, "max", function() {
		Feedback.message(loc("You can only select up to {max} items.", {
			max : r.max
		}) + " " + loc("Please delete one of your previous selections."))
	});
	if (r.multiSelect) {
		var h = createNode("div", {
			className : "unselectable selections"
		});
		c.appendChild(h);
		var a = null;
		var p = function() {
			a = Carousel.create(h, {
				data : l,
				renderer : function(u) {
					var t = createNode("a", {
						target : "_blank",
						href : "#foo",
						className : "selected_item"
					}, null, r.selectedItemRenderer(u, "t"));
					var s = createNode("div", {
						className : "reject"
					});
					t.appendChild(s);
					Event.addListener(t, "click", Event.stop);
					Event.addListener(s, "click", function(v) {
						k.deselect(u);
						Event.stop(v)
					}, this);
					return t
				},
				cellDim : new Dim(62, 56),
				emptyMessage : loc("No selection")
			})
		};
		p()
	}
	if (r.form) {
		this.form = c.appendChild(createNode("form", {
			className : "selector_form"
		}));
		var b = this.form.appendChild(createNode("div", {
			className : "stdform"
		}));
		var q = createFormBody(b, r.form);
		b.appendChild(q)
	}
	var m;
	function g() {
		m.clean();
		ModalDialog.hide(false)
	}
	this.show = function() {
		ModalDialog.show_uic({
			id : "selector_dialog",
			title : n,
			body : c,
			actions : [{
				id : "okbtn",
				label : r.okText ? r.okText : loc("OK"),
				actionClass : "btn btn_action",
				disabled : true,
				action : Event.wrapper(function() {
					var s = null;
					if (this.form) {
						s = extractInputValues(this.form)
					}
					g();
					Event.trigger(this, "change", k.getValue(), s)
				}, this)
			}, {
				label : loc("Cancel"),
				action : g
			}]
		});
		o.init(f);
		o.addPaginationPaddles();
		o.setEmptyMessage(r.emptyMessage);
		ModalDialog.rePosition();
		m = Event.addListener(l, "change", function() {
			setNode($("okbtn"), {
				disabled : null
			})
		});
		if (!o.redrawIfDirty()) {
			o.redraw()
		}
	}
}extend(Selector, BaseSelector);
function buildSetImgUrl(b, a) {
	return buildImgURL("img-set", {
		".out" : "jpg",
		cid : b.id,
		spec_uuid : b.spec_uuid,
		size : a == "t" ? "s" : a
	})
}

function buildThingImgUrl(b, a) {
	return buildImgURL("img-thing", {
		".out" : "jpg",
		tid : b.thing_id,
		size : a == "t" ? "s" : a
	})
}

function SearchOptions() {
}
SearchOptions.TYPES = {
	myitem : {
		showTagFilter : true
	},
	mysetdraft : {
		hselect : [{
			action : "mystuff.sets",
			label : loc("Published"),
			emptyMsg : loc("You have not published any sets yet")
		}, {
			action : "mystuff.drafts",
			label : loc("Drafts"),
			emptyMsg : loc("You have not created any drafts yet")
		}],
		htmlRenderer : function() {
			if (!bucketIs("show_admin_links", "yes")) {
				return
			}
			Event.addListener(this._results.getSource(), "loaderror", function(d) {
				Feedback.message(d.extractGeneralErrorMessages().join("<br>"))
			});
			var c = Dom.uniqueId();
			var a = createNode("input", {
				id : c,
				type : "text",
				className : "uid",
				placeholder : "username",
				value : Auth.user().name
			});
			Event.addListener(a, "keyup", delayed(Event.wrapper(function() {
				this._results.getSource().setParams({
					".uid" : a.value
				})
			}, this), 1000));
			var b = new Toolbar();
			b.add(createNode("label", {
				"for" : c
			}, null, "username: "));
			b.add(a);
			b.addSpring();
			return b.getNode()
		}
	},
	set : {
		showQueryFilter : true,
		showColorFilter : true
	},
	item : {
		showQueryFilter : true,
		showAutocomplete : true,
		showColorFilter : true,
		showPriceFilter : true
	}
};
Selector.TYPES = {
	myset : {
		label : loc("My Sets"),
		emptyMessage : loc("You have not created any sets yet"),
		title : loc("Please select a set"),
		multiTitle : loc("Please select one or more sets"),
		query : "mystuff.sets",
		requireSignIn : true,
		pageSize : 15,
		itemRenderer : function(a) {
			return UI.setGridRender(a, "s")
		},
		selectedItemRenderer : UI.setGridRender,
		idField : "spec_uuid",
		urlBuilder : buildSetImgUrl
	},
	mydraft : {
		label : loc("Draft Sets"),
		emptyMessage : loc("You have not saved any drafts yet"),
		title : loc("Please select a draft"),
		query : "mystuff.drafts",
		requireSignIn : true,
		pageSize : 15,
		backendEvents : ["deletedraft"],
		itemRenderer : function(c) {
			var b = UI.setGridRender(c, "s");
			var d = createNode("span", {
				className : "reject"
			});
			Event.addListener(d, "click", function(a) {
				Event.stop(a);
				if (confirm("Really discard this draft set?")) {
					Ajax.get({
						action : "set.discard",
						data : {
							did : c.id
						},
						onSuccess : function(f) {
							Feedback.messageFromResponse(f)
						},
						onError : function(f) {
							Feedback.messageFromResponse(f)
						}
					})
				}
			});
			b.appendChild(d);
			return b
		},
		idField : "spec_uuid"
	},
	mysetdraft : {
		label : loc("My Sets"),
		emptyMessage : loc("You have not saved any sets yet"),
		title : loc("Please select a set"),
		multiTitle : loc("Please select one or more sets"),
		query : "mystuff.sets",
		requireSignIn : true,
		pageSize : 15,
		itemRenderer : function(a) {
			return UI.setGridRender(a, "s")
		},
		selectedItemRenderer : UI.setGridRender,
		idField : "spec_uuid",
		searchOptions : SearchOptions.TYPES.mysetdraft
	},
	myfave : {
		label : loc("Likes"),
		emptyMessage : loc("You have not liked any sets yet"),
		title : loc("Please select a set"),
		multiTitle : loc("Please select one or more sets"),
		query : "mystuff.favesets",
		requireSignIn : true,
		pageSize : 15,
		itemRenderer : function(a) {
			return UI.setGridRender(a, "s")
		},
		selectedItemRenderer : UI.setGridRender,
		idField : "spec_uuid",
		urlBuilder : buildSetImgUrl
	},
	myitem : {
		label : loc("My Items"),
		emptyMessage : loc("You do not have any items yet"),
		title : loc("Please select an item"),
		multiTitle : loc("Please select one or more items"),
		query : "mystuff.things",
		requireSignIn : true,
		pageSize : 15,
		queryParams : {
			listtags : 1
		},
		itemRenderer : function(a) {
			return UI.itemGridRender(a, "s")
		},
		selectedItemRenderer : UI.itemGridRender,
		idField : "thing_id",
		urlBuilder : buildThingImgUrl,
		searchOptions : SearchOptions.TYPES.myitem
	},
	mytemplate : {
		label : loc("My Templates"),
		emptyMessage : loc("You have not created any templates yet"),
		query : "mystuff.templates",
		requireSignIn : true,
		pageSize : 15,
		backendEvents : ["deletetemplate"],
		itemRenderer : function(c) {
			var b = UI.setGridRender(c, "s");
			var d = createNode("span", {
				className : "reject"
			});
			Event.addListener(d, "click", function(a) {
				Event.stop(a);
				if (confirm("Really delete this template?")) {
					Ajax.get({
						action : "template.delete",
						data : {
							id : c.id
						},
						onSuccess : function(f) {
							Feedback.messageFromResponse(f)
						},
						onError : function(f) {
							Feedback.messageFromResponse(f)
						}
					})
				}
			});
			b.appendChild(d);
			return b
		},
		idField : "spec_uuid"
	},
	mytemplatedraft : {
		label : loc("Drafts"),
		emptyMessage : loc("You have not saved any template drafts yet"),
		query : "mystuff.templatedrafts",
		requireSignIn : true,
		pageSize : 15,
		backendEvents : ["deletedraft"],
		itemRenderer : function(c) {
			var b = UI.setGridRender(c, "s");
			var d = createNode("span", {
				className : "reject"
			});
			Event.addListener(d, "click", function(a) {
				Event.stop(a);
				if (confirm("Really delete this template draft?")) {
					Ajax.get({
						action : "set.discard",
						data : {
							did : c.id
						},
						onSuccess : function(f) {
							Feedback.messageFromResponse(f)
						},
						onError : function(f) {
							Feedback.messageFromResponse(f)
						}
					})
				}
			});
			b.appendChild(d);
			return b
		},
		idField : "spec_uuid"
	},
	template : {
		label : loc("All Templates"),
		emptyMessage : loc("No matching templates found"),
		title : loc("Please select a template"),
		multiTitle : loc("Please select one or more templates"),
		query : "search.templates",
		pageSize : 15,
		itemRenderer : function(g) {
			var f = "s";
			var h = UI.sizeMap[f].url;
			delete g.title;
			var d = UI.setGridRenderAutoSize(g, f);
			var c = d.childNodes[0];
			if (!Browser.isIE) {
				var b = c.src;
				var a = new FlipBook({
					data : new MemDataSource(g.sets),
					renderer : function(k) {
						var j = buildImgURL("img-set", {
							cid : k.id,
							spec_uuid : k.spec_uuid,
							size : h,
							".out" : "jpg"
						});
						c.src = j;
						return c
					},
					defaultRenderer : function() {
						c.src = b;
						return c
					}
				});
				setNode(a.getNode(), null, {
					width : "100%",
					height : "100%"
				});
				c.parentNode.appendChild(a.getNode());
				c.parentNode.removeChild(c)
			}
			return d
		},
		idField : "spec_uuid"
	},
	searchset : {
		label : loc("All Sets"),
		emptyMessage : loc("No matching sets found"),
		title : loc("Please select a set"),
		multiTitle : loc("Please select one or more sets"),
		query : "search.sets",
		pageSize : 15,
		itemRenderer : function(a) {
			return UI.setGridRender(a, "s")
		},
		selectedItemRenderer : UI.setGridRender,
		idField : "spec_uuid",
		urlBuilder : buildSetImgUrl,
		searchOptions : SearchOptions.TYPES.set
	},
	searchitem : {
		label : loc("All Items"),
		emptyMessage : loc("No matching items found"),
		title : loc("Please select an item"),
		multiTitle : loc("Please select one or more items"),
		query : "search.editor_things",
		pageSize : 15,
		itemRenderer : function(a) {
			return UI.itemGridRender(a, "s")
		},
		selectedItemRenderer : UI.itemGridRender,
		idField : "thing_id",
		urlBuilder : buildThingImgUrl,
		searchOptions : SearchOptions.TYPES.item
	},
	searchshopitem : {
		label : loc("All Products"),
		emptyMessage : loc("No matching products found"),
		title : loc("Please select a product"),
		multiTitle : loc("Please select one or more products"),
		query : "search.shop_things",
		queryParams : {
			ship_region : window._shipRegion
		},
		pageSize : 15,
		itemRenderer : function(a) {
			return UI.itemGridRender(a, "s")
		},
		selectedItemRenderer : UI.itemGridRender,
		idField : "thing_id",
		urlBuilder : buildThingImgUrl,
		searchOptions : SearchOptions.TYPES.item
	},
	mycollection : {
		label : loc("Published"),
		emptyMessage : loc("No matching collections found"),
		title : loc("Please select a collection"),
		requireSignIn : true,
		query : "collection.list_editable",
		queryParams : {
			filter : "published"
		},
		pageSize : 8,
		backendEvents : ["lookbooks_change"],
		itemRenderer : function(a) {
			a.spec_uuid = a.cover_spec_uuid;
			a.thing_id = a.cover_spec_tid;
			return UI.setGridRenderLookbook(a, "s")
		},
		idField : "id"
	},
	mycollectiondraft : {
		label : loc("Drafts"),
		emptyMessage : loc("No matching collection found"),
		title : loc("Please select a collection"),
		requireSignIn : true,
		query : "collection.list_editable",
		queryParams : {
			filter : "drafts"
		},
		pageSize : 8,
		backendEvents : ["lookbooks_change"],
		itemRenderer : function(c) {
			c.spec_uuid = c.cover_spec_uuid;
			c.thing_id = c.cover_spec_tid;
			var b = UI.setGridRenderLookbook(c, "s");
			var d = createNode("span", {
				className : "reject"
			});
			Event.addListener(d, "click", function(a) {
				Event.stop(a);
				if (confirm("Really delete this collection draft?")) {
					Ajax.get({
						action : "collection.delete_draft",
						data : {
							did : c.did
						},
						onSuccess : function(f) {
							Feedback.messageFromResponse(f)
						},
						onError : function(f) {
							Feedback.messageFromResponse(f)
						}
					})
				}
			});
			b.appendChild(d);
			return b
		},
		idField : "did"
	}
};
function stripQuotes(a) {
	if ( typeof (a) == "string" && a.charAt(0) == '"' && a.charAt(a.length - 1) == '"') {
		return a.substring(1, a.length - 1)
	} else {
		return a
	}
}
TabbedSelector.TYPES = {
	myitemsearch : {
		title : loc("Please select an item"),
		multiTitle : loc("Please select one or more items"),
		tabs : [Selector.TYPES.myitem, Selector.TYPES.searchshopitem],
		urlBuilder : buildThingImgUrl,
		selectedItemRenderer : UI.itemGridRender,
		normalizer : function(a) {
			return a.thing_id
		},
		denormalizer : function(a) {
			return {
				thing_id : stripQuotes(a)
			}
		}
	},
	myitemsearchall : {
		title : loc("Please select an item"),
		multiTitle : loc("Please select one or more items"),
		tabs : [Selector.TYPES.myitem, Selector.TYPES.searchitem],
		urlBuilder : buildThingImgUrl,
		selectedItemRenderer : UI.itemGridRender,
		normalizer : function(a) {
			return a.thing_id
		},
		denormalizer : function(a) {
			return {
				thing_id : stripQuotes(a)
			}
		}
	},
	mysetfavesearch : {
		title : loc("Please select a set"),
		multiTitle : loc("Please select one or more sets"),
		tabs : [Selector.TYPES.myset, Selector.TYPES.myfave, Selector.TYPES.searchset],
		urlBuilder : buildSetImgUrl,
		selectedItemRenderer : UI.setGridRender,
		normalizer : function(a) {
			return a.spec_uuid
		},
		denormalizer : function(a) {
			return {
				spec_uuid : stripQuotes(a)
			}
		}
	},
	mysetdraftfavesearch : {
		title : loc("Please select a set"),
		multiTitle : loc("Please select one or more sets"),
		tabs : [Selector.TYPES.mysetdraft, Selector.TYPES.myfave, Selector.TYPES.searchset],
		urlBuilder : buildSetImgUrl,
		selectedItemRenderer : UI.setGridRender,
		normalizer : function(a) {
			return a.spec_uuid
		},
		denormalizer : function(a) {
			return {
				spec_uuid : stripQuotes(a)
			}
		}
	},
	mysetfaveitem : {
		title : loc("Please select a set or item"),
		multiTitle : loc("Please select one or more sets or items"),
		tabs : [Selector.TYPES.myset, Selector.TYPES.myfave, Selector.TYPES.myitem, Selector.TYPES.searchset, Selector.TYPES.searchshopitem],
		urlBuilder : function(b, a) {
			if (b.spec_uuid) {
				return buildSetImgUrl(b, a)
			} else {
				if (b.thing_id) {
					return buildThingImgUrl(b, a)
				}
			}
		},
		selectedItemRenderer : function(b, a) {
			if (b.spec_uuid) {
				return UI.setGridRender(b, a)
			} else {
				if (b.thing_id) {
					return UI.itemGridRender(b, a)
				}
			}
		},
		normalizer : function(a) {
			return {
				spec_uuid : a.spec_uuid,
				thing_id : a.thing_id
			}
		},
		denormalizer : function(b) {
			var a = cloneObject(b);
			a.getHashKey = function() {
				return this.spec_uuid || this.thing_id
			};
			return a
		}
	},
	EDITOR_OPEN_MENU : {
		title : loc("Select a set or template"),
		tabs : (function() {
			var a = cloneObject(Selector.TYPES.myset);
			a.label = "Published Sets";
			return [a, Selector.TYPES.mydraft, Selector.TYPES.mytemplate, Selector.TYPES.template]
		})()
	},
	TEMPLATE_EDITOR_OPEN_MENU : {
		title : loc("Select a template"),
		tabs : (function() {
			var a = cloneObject(Selector.TYPES.mytemplate);
			a.label = "Published";
			return [a, Selector.TYPES.mytemplatedraft]
		})()
	},
	COLLECTION_EDITOR_OPEN_MENU : {
		title : loc("Select a collection"),
		tabs : (function() {
			return [Selector.TYPES.mycollection, Selector.TYPES.mycollectiondraft]
		})()
	}
};
function BaseSelector() {
	this.show = function() {
	}
}

var StripSelector = function() {
	return {
		show : function(c, l) {
			var a = ( typeof (l.container) == "object") ? l.container : $(l.container);
			var j = ( typeof (l.input) == "object") ? l.input : $(l.input);
			var b = l.idField;
			var d = {};
			if (l.selected) {
				l.selected.forEach(function(m) {
					d[m] = true
				})
			}
			var h = l.data;
			if (h.values && typeof (h.values) == "function") {
				h = h.values()
			}
			var k = new MemDataSource(h.filter(function(m) {
				return d[m[b]]
			}));
			var g = new ResultSet({
				renderer : c,
				source : l.data instanceof DataSource ? l.data : new MemDataSource(l.data),
				idField : b
			});
			var f = new Selectable({
				result : g,
				selectedData : k,
				multiSelect : l.multiSelect
			});
			g.init(a);
			Event.addListener(k, "change", function() {
				var m = k.values();
				var n = m.map(function(p) {
					return p[b]
				});
				var o = n.join(",");
				if (o != j.value) {
					j.value = o;
					Event.trigger(j, "change")
				}
			});
			g.redraw()
		}
	}
}();
function PopupSelectorManager(c) {
	this.options = c;
	this.container = $(c.containerId);
	this.input = $(c.input);
	var f = c.type;
	var b;
	if (TabbedSelector.TYPES[f]) {
		b = (this.config = cloneObject(TabbedSelector.TYPES[f], true))
	} else {
		if (Selector.TYPES[f]) {
			b = (this.config = cloneObject(Selector.TYPES[f], true))
		} else {
			throw "Invalid type: " + f
		}
	}
	if (c.multiSelect) {
		this.config.multiSelect = true;
		var g = this.config.normalizer;
		if (g) {
			this.config.normalizer = function(j) {
				return j.map(g)
			}
		}
		var d = this.config.denormalizer;
		if (d) {
			this.config.denormalizer = function(l) {
				var k = toArray(l).slice(0);
				var j = [];
				k.forEach(function(m) {
					j.push(d(m))
				});
				return j
			}
		}
	} else {
		if (c.allowClear) {
			this.config.allowClear = true
		}
	}
	var a = b.idField;
	if (c.value !== undefined && c.value) {
		if (b.denormalizer) {
			this.initialData = toArray(b.denormalizer(c.value))
		} else {
			var h;
			if (b.multiSelect) {
				h = toArray(c.value)
			} else {
				h = [c.value]
			}
			this.initialData = h.map(function(k) {
				var j = {};
				j[a] = k;
				j.getHashKey = function() {
					return k
				};
				return j
			})
		}
	}
	if (b.multiSelect) {
		this.normalizer = b.normalizer ||
		function(j) {
			return j.map(function(k) {
				return k[a]
			})
		}

	} else {
		if (b.normalizer) {
			this.normalizer = function(j) {
				if (j.length > 0) {
					return b.normalizer(j[0])
				} else {
					return null
				}
			}
		} else {
			this.normalizer = function(j) {
				if (j.length > 0) {
					return j[0][a]
				} else {
					return null
				}
			}
		}
	}
	Event.addListener(document, "modifiable", this.reset, this)
}
PopupSelectorManager.prototype.clear = function() {
	clearNode(this.container);
	this.changes = [];
	this.selectedData = new MemDataSource()
};
PopupSelectorManager.prototype.reset = function() {
	this.clear();
	this.createSelector()
};
PopupSelectorManager.prototype.updateInput = function() {
	var a = this.input;
	var b;
	if (!this.options.max || this.options.max == 1) {
		b = this.normalizer(this.selectedData.values())
	} else {
		b = "";
		if (this.selectedData.size()) {
			b = this.normalizer(this.selectedData.values())
		}
	}
	a.value = b ? JSON2.stringify(b) : "";
	Event.trigger(a, "change", a.value)
};
PopupSelectorManager.prototype.attachDeleteIcon = function(d, c, b) {
	var a = d.appendChild(createNode("div", {
		className : "selector_delete_icon"
	}));
	Event.addListener(a, "click", Event.wrapper(function(f) {
		Event.stop(f);
		domRemoveNode(b, true);
		this.changes.remove(d);
		this.selectedData.remove(c);
		if (this.changes.length - this.selectedData.size() < 1) {
			this.createSelector()
		}
		this.updateInput()
	}, this))
};
PopupSelectorManager.prototype.renderSelectedData = function(b) {
	var a = cloneObject(b);
	this.clear();
	a.forEach(Event.wrapper(function(c) {
		this.createSelector(c)
	}, this));
	this.updateInput();
	if (this.config.multiSelect && (!this.options.max || (this.options.max > a.length))) {
		this.createSelector()
	}
};
PopupSelectorManager.prototype.createSelector = function(c) {
	var m = this.options;
	var b = this.config;
	var l = m.size;
	var f = m.type;
	var a = this.container.appendChild(createNode("div", {
		className : "selector_ui"
	}));
	var g = a.appendChild(createNode("div", {
		className : "selector_change selector_size_" + m.size,
		title : m.multiSelect ? m.multiTitle : m.title
	}));
	var j = g.appendChild(createNode("div", {
		className : "selector_change_icon"
	}));
	var d = null;
	b.max = m.max;
	b.selectedData = this.selectedData;
	Event.addListener(this.selectedData, "change", this.updateInput, this);
	var h = b.urlBuilder;
	if (c) {
		this.selectedData.append(c);
		var k = h.call(this, c, l);
		g.appendChild(createImg({
			src : k,
			className : "selector_img",
			height : UI.sizeMap[l].dim,
			width : UI.sizeMap[l].dim
		}));
		if (b.multiSelect || b.allowClear) {
			this.attachDeleteIcon(g, c, a)
		}
	}
	if (!c) {
		j = g.appendChild(createNode("div", {
			className : "selector_change_icon"
		}))
	}
	if (this.initialData && this.initialData.length && !this.initialized) {
		this.initialized = true;
		this.renderSelectedData(this.initialData);
		return
	}
	Event.addListener(g, "click", function() {
		var n = null;
		if (TabbedSelector.TYPES[f]) {
			n = new TabbedSelector(b, m.data)
		} else {
			if (Selector.TYPES[f]) {
				n = new Selector(b, m.params)
			}
		}
		n.show();
		Event.addListener(n, "change", Event.wrapper(function(o) {
			this.renderSelectedData(toArray(o))
		}, this))
	}, this);
	this.changes.push(g)
};
var PopupSelectorFactory = function() {
	return {
		create : function(a) {
			return new PopupSelectorManager(a)
		}
	}
}();
function BuilderSelector(k, a, m, h, b) {
	var o = a.appendChild(createNode("table", {
		width : "100%",
		height : "100%",
		cellpadding : 0,
		cellspacing : 0
	}));
	var f = o.appendChild(createNode("tbody"));
	var j = f.appendChild(createNode("tr", {
		valign : "top",
		height : "100%"
	}));
	var g = j.appendChild(createNode("td", {
		width : "50%"
	}));
	var d = j.appendChild(createNode("td", {
		width : "50%"
	}));
	var l = g.appendChild(createNode("div", {
		className : "topanel"
	}));
	var n = d.appendChild(createNode("div", {
		className : "frompanel"
	}));
	if (k == "item") {
		b.tabs = ["all_items", "my_items", "my_collections"];
		var c = new ItemLookbookBuilder(o, l, n, b);
		Event.addListener(c, "change", function() {
			var p = c.lookbook.getSource();
			var q = p.items.map(function(r) {
				return r.thing_id
			});
			m.value = q ? JSON2.stringify(q) : ""
		});
		Event.addListener(c, "loaded", function() {
			if (h && h.length) {
				var p = h.map(function(q) {
					return {
						thing_id : q
					}
				});
				c.addItems(p)
			}
		})
	}
}

var BaseShare = (function() {
	var a = function() {
		var h = getElementsWithAttributes({
			tagName : "meta",
			attributes : {
				property : null
			}
		});
		var k = {};
		for (var d = 0; d < h.length; d++) {
			k[h[d].getAttribute("property")] = h[d].getAttribute("content")
		}
		var f = k["og:image"] || null;
		var g = k["og:description"] || null;
		var j = k["og:title"] || null;
		var c = k["polyvore:author"] || null;
		if (c) {
			c = c.match(/http.?:\/\/(.*?)\./i);
			if (c) {
				c = c[1]
			} else {
				c = null
			}
		}
		var b = window.location.href;
		var l = document.head.getElementsByTagName("link");
		for ( d = 0; d < l.length; d++) {
			var m = l[d].getAttribute("rel");
			if (m && m == "canonical") {
				b = l[d].getAttribute("href");
				break
			}
		}
		return {
			img : f,
			url : b,
			title : j,
			author : c,
			desc : g
		}
	};
	return {
		pageInfo : a
	}
})();
var Share = function() {
	window._open = window.open;
	var h = function(r, B, E, u) {
		var z;
		if (r.indexOf("pinterest.com/pin/create/bookmarklet/") > 0) {
			var v = parseUri(r);
			var t = parseUri(v.queryKey.media);
			var D = Conf.getSetting("cdnImgHosts");
			D = D[cdn()];
			if (D && D.contains(t.host)) {
				var C = t.path.substring(1);
				C = C.replace(/\.jpg$/, "");
				var A = C.split("/");
				var s = {};
				for (var y = 0; y < A.length; y = y + 2) {
					s[A[y]] = A[y + 1]
				}
				var x = s.cgi;
				if (x == "img-set") {
					z = {
						cid : s.cid,
						spec_uuid : s.id
					};
					r = "about:blank"
				} else {
					if (x == "img-thing") {
						z = {
							tid : s.tid
						};
						r = "about:blank"
					}
				}
				z.srcURL = v.queryKey.url;
				Track.stat("inc", "share", ["pinterest_bookmarklet"])
			}
		}
		var w = window._open(r, B, E, u);
		if (z) {
			j(w, z)
		}
		return w
	};
	window.open = h;
	function j(r, s) {
		function v(y) {
			var w = "y";
			if (y.tid) {
				y.url = buildAbsURL(buildURL("thing.outbound", {
					id : y.tid
				}));
				y.img = y.img || buildImgURL("img-thing", {
					tid : y.tid,
					size : UI.sizeMap[w].url,
					".out" : "jpg"
				});
				y.description = y.description || loc("An item from Polyvore")
			} else {
				if (y.cid) {
					y.url = y.url || buildAbsURL(buildURL("set", {
						id : y.cid
					}));
					y.description = y.description || loc("A collage from Polyvore");
					y.img = y.img || buildImgURL("img-set", {
						cid : y.cid,
						spec_uuid : y.spec_uuid,
						size : UI.sizeMap[w].url,
						".out" : "jpg"
					})
				}
			}
			y.url = n(y.url, "pinterest");
			if (y.author) {
				y.url = y.url.replace("http://www.polyvore.", "http://" + y.author + ".polyvore.")
			}
			var x = "http://pinterest.com/pin/create/button/?url=" + encodeURIComponent(y.url);
			x += "&media=" + encodeURIComponent(y.img);
			x += "&description=" + encodeURIComponent(y.description);
			return x
		}

		var u = s.srcURL ? parsePolyvoreURL(s.srcURL) : {};
		if (s.cid) {
			if (u.action == "profile") {
				r.location = v(s)
			} else {
				Ajax.get({
					action : "set.embed_html",
					contract : "embed_html_" + s.cid,
					data : {
						id : s.cid
					},
					hideProgress : true,
					onSuccess : function(w) {
						mergeObject(s, w)
					},
					onError : function() {
						s.tags = []
					},
					onFinally : function() {
						var w = s.title;
						if (w.length > 1 && w.charAt(0) == '"' && w.charAt(w.length - 1) == '"') {
							w = w.substr(1, w.length - 2)
						}
						s.description = loc('"{title}" by {author} on Polyvore', {
							title : w,
							author : s.author
						});
						r.location = v(s)
					}
				})
			}
		} else {
			if (s.tid) {
				if (u.action == "profile") {
					r.location = v(s)
				} else {
					Ajax.get({
						action : "thing.embed_html",
						contract : "embed_html_" + s.tid,
						data : {
							id : s.tid
						},
						hideProgress : true,
						onSuccess : function(w) {
							mergeObject(s, w)
						},
						onError : function() {
							s.tags = []
						},
						onFinally : function() {
							s.description = loc("{title}{price} found on Polyvore", {
								title : s.title,
								price : s.price ? " (" + s.price + ")" : ""
							});
							r.location = v(s)
						}
					})
				}
			} else {
				var t = BaseShare.pageInfo();
				s.url = t.url;
				s.img = t.img;
				s.description = t.title + " on Polyvore";
				r.location = v(s)
			}
		}
	}

	var n = function(r, t) {
		var s = parseUri(r);
		if (Auth.isLoggedIn()) {
			s.queryKey.embedder = Auth.userId()
		} else {
			s.queryKey.embedder = 0
		}
		s.queryKey[".svc"] = "copypaste";
		return reconstructUri(s)
	};
	var o = function(u, r, s) {
		var x = [];
		var w = [];
		for (var t = 0; t < u.length; t++) {
			var v = u[t];
			if (v.authorized) {
				if (!r || (r && v.options && v.options.publish_default)) {
					if (!s || v.blog) {
						x.push(v)
					}
					continue
				}
			}
			if (!s || v.blog) {
				w.push(v)
			}
		}
		x.sort(function(z, y) {
			if (z.blog && y.blog) {
				return 0
			}
			if (z.blog) {
				return -1
			}
			return 1
		});
		return {
			authed : x,
			unauthed : w
		}
	};
	var k = function(z, A) {
		var t = createNode("div", {
			className : "embeddialog embed",
			trackcontext : "share"
		});
		A = A || {};
		var x = "";
		if (!A.inline) {
			x = loc("Share your creations")
		}
		var r = createNode("ul", {
			className : "svc_actions list"
		});
		this.shareSvcList = r;
		var v = createNode("ul", {
			className : "svc_actions grid"
		});
		this.noshareSvcList = v;
		var s = o(z, true);
		var y = s.authed;
		var w = s.unauthed;
		for ( i = 0; i < y.length; i++) {
			svc = y[i];
			r.appendChild(createNode("li", null, null, this.renderSharedServiceDetails(svc)))
		}
		for ( i = 0; i < w.length; i++) {
			svc = w[i];
			v.appendChild(createNode("li", null, null, this.renderUnsharedServiceBig(svc)))
		}
		this.unshareArea = t.appendChild(createNode("div", {
			className : "box"
		}, null, [createNode("div", {
			className : "hd"
		}, null, loc("Start quick sharing to")), createNode("div", {
			className : "bd clearfix"
		}, null, v)]));
		this.shareArea = t.appendChild(createNode("div", {
			className : "box"
		}, null, [createNode("div", {
			className : "hd"
		}, null, loc("Currently sharing to")), createNode("div", {
			className : "bd"
		}, null, r)]));
		var u = createNode("input", {
			className : "btn btn_action",
			type : "button",
			value : A.published ? loc("Done") : loc("Back")
		});
		if (!A.inline) {
			Event.addSingleUseListener(ModalDialog, "hide", function() {
				Event.trigger(this, "done")
			}, this);
			Event.addListener(u, "click", function() {
				ModalDialog.hide()
			}, this)
		} else {
			Event.addListener(u, "click", function() {
				Event.trigger(this, "done")
			}, this)
		}
		this.update();
		t.appendChild(createNode("div", null, null, u));
		this.node = t;
		this.title = x
	};
	k.prototype.renderSharedServiceDetails = function(u) {
		u.options = u.options || {};
		var s = createSprite(u.service);
		var w = createNode("span", null, null, u.display_name);
		var v = null;
		if (u.account_info) {
			v = createNode("a", {
				href : u.account_info.account_url,
				target : "_blank"
			}, {
				paddingLeft : "8px"
			}, u.account_info.account_name)
		}
		var r = createNode("span", {
			className : "clickable right"
		}, null, loc("Stop"));
		var t = createNode("div", {
			id : "svc_shared_" + u.service
		}, null, [r, s, w, v]);
		var x = Event.wrapper(function() {
			if ($("svc_unshared_" + u.service)) {
				return
			}
			var y = createNode("li", null, null, this.renderUnsharedServiceBig(u));
			if (this.noshareSvcList.childNodes.length) {
				this.noshareSvcList.insertBefore(y, this.noshareSvcList.childNodes[0])
			} else {
				this.noshareSvcList.appendChild(y)
			}
			t.parentNode.parentNode.removeChild(t.parentNode);
			this.update()
		}, this);
		Event.addSingleUseListener(Event.BACKEND, "oauth_unconnect_" + u.service, function() {
			Track.stat("inc", "share", ["quick_remove", u.service]);
			x()
		}, this);
		Event.addListener(r, "click", function() {
			u.options.publish_default = 0;
			x()
		}, this);
		return t
	};
	k.prototype.renderUnsharedServiceBig = function(t) {
		t.options = t.options || {};
		var s = createNode("span", {
			id : "svc_unshared_" + t.service,
			className : "large_icon " + t.service + " clickable"
		}, null, t.display_name);
		var r = Event.wrapper(function() {
			if ($("svc_shared_" + t.service)) {
				return
			}
			var v = createNode("li", null, null, this.renderSharedServiceDetails(t));
			if (this.shareSvcList.childNodes.length) {
				this.shareSvcList.insertBefore(v, this.shareSvcList.childNodes[0])
			} else {
				this.shareSvcList.appendChild(v)
			}
			s.parentNode.parentNode.removeChild(s.parentNode);
			this.update()
		}, this);
		var u = Event.addListener(s, "click", function() {
			if (!t.authorized) {
				Track.stat("inc", "share", ["connect_start", t.service]);
				if (t.service == "facebook") {
					Facebook.link({
						onSuccess : function() {
							t.options.publish_default = 1
						}
					})
				} else {
					var v = openWindow("pv_oauth_" + t.service, buildURL("oauth.flow", {
						service : t.service
					}), 800, 600);
					v.focus()
				}
				return
			}
			Track.stat("inc", "share", ["quick_add", t.service]);
			t.options.publish_default = 1;
			r()
		}, this);
		Event.addListener(Event.BACKEND, "oauth_connect", function(v) {
			if (v.service == t.service) {
				Track.stat("inc", "share", ["connect_complete", t.service]);
				mergeObject(t, v);
				r();
				u.clean()
			}
		}, this);
		return s
	};
	k.prototype.update = function() {
		if (this.shareSvcList.childNodes.length) {
			show(this.shareArea)
		} else {
			hide(this.shareArea)
		}
		if (this.noshareSvcList.childNodes.length) {
			show(this.unshareArea)
		} else {
			hide(this.unshareArea)
		}
		Event.trigger(this, "resize")
	};
	var b = function(s, r) {
		var t = createNode("div", {
			className : "",
			trackcontext : "share"
		});
		this.selected = r;
		this.services = s;
		this.shareArea = t.appendChild(createNode("div"));
		this.unshareBox = t.appendChild(createNode("div", {
			className : "box"
		}, null, [createNode("div", {
			className : "hd"
		}, null, loc("Connect a new blog"))]));
		this.unshareArea = this.unshareBox.appendChild(createNode("div", {
			className : "bd"
		}));
		Event.addListener(s, "change", function() {
			this.redraw()
		}, this);
		this.redraw();
		ModalDialog.show_uic({
			title : loc("Change your blog"),
			body : t,
			actions : [{
				label : createNode("span", null, null, loc("Back to posting")),
				action : Event.wrapper(function() {
					Event.trigger(this, "done", this.selected)
				}, this)
			}]
		});
		this.node = t
	};
	b.prototype.redraw = function() {
		var u = o(this.services, false, true);
		var z = u.unauthed;
		var x = createNode("ul", {
			className : "svc_actions grid"
		});
		var w = [];
		var y;
		var t;
		if (u.authed.length) {
			var A = u.authed.map(function(C, B) {
				C.label = C.display_name;
				C.value = B;
				C.sprite = C.service;
				return C
			});
			var v = this;
			if (!this.selected) {
				this.selected = A[0]
			}
			w.push({
				id : "share_services",
				name : "share_services",
				type : "radio_select",
				value : this.selected.value,
				options : A,
				onChange : function() {
					v.selected = A[this.value]
				}
			})
		}
		var s = new Form({
			id : "change_shared_service_dialog",
			action : "",
			inputs : w
		});
		var r = s.getNode();
		for ( i = 0; i < z.length; i++) {
			y = z[i];
			t = b.renderUnsharedServiceBig(y);
			x.appendChild(createNode("li", null, null, t))
		}
		if (this.shareSvcList) {
			this.shareArea.removeChild(this.shareSvcList)
		}
		this.shareArea.appendChild(r);
		if (this.noshareSvcList) {
			this.unshareArea.removeChild(this.noshareSvcList)
		}
		this.unshareArea.appendChild(x);
		this.shareSvcList = r;
		this.noshareSvcList = x;
		this.update()
	};
	b.prototype.update = function() {
		if (this.shareSvcList.childNodes.length) {
			show(this.shareArea)
		} else {
			hide(this.shareArea)
		}
		if (this.noshareSvcList.childNodes.length) {
			show(this.unshareBox)
		} else {
			hide(this.unshareBox)
		}
	};
	b.renderUnsharedServiceBig = function(s) {
		s.options = s.options || {};
		var r = createNode("span", {
			id : "svc_unshared_" + s.service,
			className : "large_icon " + s.service + " clickable"
		}, null, s.display_name);
		var t = Event.addListener(r, "click", function() {
			if (!s.authorized) {
				Track.stat("inc", "share", ["connect_start", s.service]);
				if (s.service == "facebook") {
					Facebook.link({
						onSuccess : function() {
							s.options.publish_default = 1
						}
					})
				} else {
					var u = openWindow("pv_oauth_" + s.service, buildURL("oauth.flow", {
						service : s.service
					}), 800, 600);
					u.focus()
				}
				return
			}
			Track.stat("inc", "share", ["quick_add", s.service])
		}, this);
		Event.addListener(Event.BACKEND, "oauth_connect", function(u) {
			if (u.service == s.service) {
				Track.stat("inc", "share", ["connect_complete", s.service]);
				t.clean()
			}
		}, this);
		return r
	};
	var a = function(P, Q, D) {
		this.trackcontext = "share_item";
		var F = createNode("div", {
			className : "sharefrm",
			trackcontext : this.trackcontext
		});
		var t;
		var w;
		var z;
		if (Q.services) {
			for (var K = 0; K < Q.services.length; K++) {
				var E = Q.services[K];
				if ((!Q.blog_select && E.blog && E.authorized) || (Q.blog_select == E.service && E.blog && E.authorized)) {
					w = E;
					break
				}
			}
			if (w) {
				var v = w.display_name;
				if (w.account_info && w.account_info.account_name) {
					v = E.account_info.account_name
				}
				var B = createSprite(w.service)
			} else {
				v = loc("None")
			}
			if (!D) {
				var I = createNode("span", {
					className : "clickable"
				}, {
					paddingLeft : "8px"
				}, w ? loc("Edit") : loc("Choose your blog"));
				Event.addListener(I, "click", function() {
					var R = new b(Q.services, w);
					Event.addListener(R, "done", function(T) {
						if (T) {
							Q.blog_select = T.service;
							Q.embed_html = null
						}
						var S = new a(P, Q)
					}, this)
				})
			}
			t = createNode("div", null, null, [B, v, I])
		}
		var J = Share.getAnonConfig();
		if (w) {
			J.size = w.options.thing_size || J.thingSize;
			J.publish_as_draft = w.options.publish_as_draft;
			J.service = w.service
		}
		var x = "     " + loc("Post") + "     ";
		if (w) {
			x = "   " + loc("Post to {blog}", {
				blog : w.display_name
			}) + "   "
		}
		var C = "     " + loc("Posting...") + "     ";
		var N = Event.wrapper(function() {
			var R = extractInputValues(z.getNode());
			Share.setAnonConfig({
				thingSize : R.size
			});
			ModalDialog.hide();
			if (!t) {
				Track.stat("inc", this.trackcontext, ["close_dialog", "close"])
			} else {
				Track.stat("inc", this.trackcontext, ["close_dialog", "cancel"])
			}
		}, this);
		var s = Event.wrapper(function(R) {
			Event.stop(R);
			Track.stat("inc", this.trackcontext, ["publish"]);
			var T = extractInputValues(z.getNode());
			var S = {
				id : T.id,
				blog_select : T.service,
				share : T.service,
				embed_thing_size : T.size,
				publish_as_draft : T.publish_as_draft ? 1 : 0
			};
			setNode($("post"), {
				disabled : true,
				value : C
			});
			Ajax.post({
				busyMsg : loc("Posting") + "...",
				action : "thing.share",
				data : S,
				onSuccess : Event.wrapper(function(U) {
					UI.displayAjaxMessages(U.message);
					Track.stat("inc", this.trackcontext, ["close_dialog", "publish"]);
					ModalDialog.hide()
				}, this),
				onFinally : function() {
					setNode($("post"), {
						disabled : null,
						value : x
					})
				}
			})
		}, this);
		var y = [{
			type : "hidden",
			name : "id",
			value : P
		}, {
			type : "size_picker",
			name : "size",
			id : "size",
			label : loc("Image size"),
			itemType : "thing",
			disableCustom : 1
		}];
		if (t) {
			y = y.concat([{
				type : "hidden",
				name : "service"
			}, {
				type : "html",
				label : loc("Posting to"),
				value : t
			}, {
				className : "slim",
				type : w ? "checkbox" : "hidden",
				cblabel : loc("Post as draft"),
				name : "publish_as_draft",
				disabled : w ? null : 1
			}])
		}
		var L = [];
		if (t) {
			var r = {
				type : "submit",
				label : x,
				id : "post",
				disabled : w ? null : 1,
				onClick : s
			};
			L.push(r)
		}
		var A = {
			type : "cancel",
			id : "done",
			label : D ? loc("Cancel") : loc("Close"),
			onClick : N
		};
		L.push(A);
		if (t || D) {
			y = y.concat([{
				type : "buttons",
				buttons : L
			}])
		}
		if (!D) {
			var G;
			y = y.concat([{
				type : "html",
				value : createNode("hr")
			}]);
			if (!t) {
				y = y.concat([{
					type : "html",
					value : createNode("strong", null, null, loc("Copy and paste into your blog"))
				}])
			}
			var H = createNode("span", {
				className : "copypaste_holder"
			}, null, createCopyPaste({
				rows : 5,
				id : "copypaste"
			}, Q.embed_html));
			H.appendChild(createNode("span", {
				id : "codelabel",
				className : "copypaste"
			}));
			y = y.concat([{
				type : "html",
				value : H,
				className : "slim"
			}])
		}
		if (!t) {
			y = y.concat([{
				type : "buttons",
				buttons : L
			}])
		}
		z = new Form({
			inputs : y,
			data : J
		});
		F.appendChild(z.getNode());
		var O = function(R) {
			R = R || {};
			UI.modalDisplayAjaxMessages(R.message || [{
				type : "error",
				content : loc("An error occurred while processing your request.")
			}])
		};
		var M = {
			state : "done"
		};
		var u = function(R) {
			if (!$("copypaste")) {
				return
			}
			if (M.state == "done") {
				addClass($("codelabel"), "loading");
				$("copypaste").setAttribute("disabled", true)
			} else {
				if (M.timer) {
					window.clearTimeout(M.timer)
				}
			}
			M.state = "updating";
			M.timer = window.setTimeout(function() {
				M.timer = null;
				if (M.state == "updating") {
					return
				}
				removeClass($("codelabel"), "loading");
				$("copypaste").removeAttribute("disabled");
				M.state = "done"
			}, 300);
			Ajax.get({
				action : "thing.embed_html",
				contract : "embed_html_" + P,
				data : {
					id : R.id,
					size : R.size
				},
				hideProgress : true,
				onSuccess : Event.wrapper(function(T) {
					T = T || {};
					if (T.embed_html) {
						var S = T.embed_html.replace(/&amp;/g, "&");
						$("copypaste").value = S
					} else {
						O(T)
					}
				}, this),
				onError : O,
				onFinally : function() {
					if (!M.timer) {
						removeClass($("codelabel"), "loading");
						$("copypaste").removeAttribute("disabled")
					}
					M.state = "done"
				}
			})
		};
		yield(function() {
			Event.addListener(z.getNode().size, "change", function() {
				var R = extractInputValues(z.getNode());
				u(R)
			}, this);
			Event.addListener($("copypaste"), "copy", function() {
				if (!this.copied) {
					Track.stat("inc", this.trackcontext, ["copyhtml"]);
					if (Q.embed_anchor_text) {
						Track.stat("inc", "embed_anchors", [Q.embed_anchor_text]);
						Track.stat("inc", "embed_anchors", [Q.embed_anchor_text, "copypaste"]);
						Track.stat("inc", "embed_anchor_buckets", [Q.embed_anchor_seo_bucket]);
						Track.stat("inc", "embed_anchor_buckets", [Q.embed_anchor_seo_bucket, Q.embed_anchor_text]);
						if (Q.embed_anchor_seo_track) {
							Track.stat("inc", "embed_anchor_buckets", [Q.embed_anchor_seo_bucket, "in_keyword_list"])
						}
					}
					this.copied = true
				}
			}, this)
		}, this);
		ModalDialog.show_uic({
			body : F,
			title : loc("Post to your blog")
		});
		Track.stat("inc", this.trackcontext, ["show_dialog", Q.source]);
		if (!D && !Q.embed_html) {
			u(extractInputValues(z.getNode()))
		}
		return false
	};
	var f = function(E, Q, D) {
		this.trackcontext = "share";
		var G = createNode("div", {
			className : "sharefrm",
			trackcontext : this.trackcontext
		});
		var t;
		var w;
		var z;
		if (Q.services) {
			for (var L = 0; L < Q.services.length; L++) {
				var F = Q.services[L];
				if ((!Q.blog_select && F.blog && F.authorized) || (Q.blog_select == F.service && F.blog && F.authorized)) {
					w = F;
					break
				}
			}
			if (w) {
				var v = w.display_name;
				if (w.account_info && w.account_info.account_name) {
					v = F.account_info.account_name
				}
				var B = createSprite(w.service)
			} else {
				v = loc("None")
			}
			if (!D) {
				var J = createNode("span", {
					className : "clickable"
				}, {
					paddingLeft : "8px"
				}, w ? loc("Change") : loc("Choose your blog"));
				Event.addListener(J, "click", function() {
					var R = new b(Q.services, w);
					Event.addListener(R, "done", function(T) {
						if (T) {
							Q.blog_select = T.service;
							Q.embed_html = null
						}
						var S = new f(E, Q)
					}, this)
				})
			}
			t = createNode("div", null, null, [B, v, J])
		}
		var K = Share.getAnonConfig();
		K.type = K.render_type;
		if (w) {
			K.type = w.options.render_type || K.type;
			K.size = w.options.size || K.size;
			K.publish_as_draft = w.options.publish_as_draft;
			K.service = w.service;
			K.padToSquare = w.options.pad_to_square
		}
		var x = "     " + loc("Post") + "     ";
		if (w) {
			x = "   " + loc("Post to {blog}", {
				blog : w.display_name
			}) + "   "
		}
		var C = "     " + loc("Posting...") + "     ";
		var O = Event.wrapper(function() {
			var R = extractInputValues(z.getNode());
			Share.setAnonConfig({
				render_type : R.type,
				size : R.size
			});
			ModalDialog.hide();
			if (!t) {
				Track.stat("inc", this.trackcontext, ["close_dialog", "close"])
			} else {
				Track.stat("inc", this.trackcontext, ["close_dialog", "cancel"])
			}
		}, this);
		var s = Event.wrapper(function(R) {
			Event.stop(R);
			Track.stat("inc", this.trackcontext, ["publish"]);
			var T = extractInputValues(z.getNode());
			var S = {
				spec_uuid : T.spec_uuid,
				blog_select : T.service,
				share : T.service,
				items : T.items,
				embed_size : T.size,
				embed_type : T.type,
				pad_to_square : T.padToSquare,
				publish_as_draft : T.publish_as_draft ? 1 : 0
			};
			setNode($("post"), {
				disabled : true,
				value : C
			});
			Ajax.post({
				busyMsg : loc("Posting") + "...",
				action : "set.share",
				data : S,
				onSuccess : Event.wrapper(function(U) {
					UI.displayAjaxMessages(U.message);
					Track.stat("inc", this.trackcontext, ["close_dialog", "publish"]);
					ModalDialog.hide()
				}, this),
				onFinally : function() {
					setNode($("post"), {
						disabled : null,
						value : x
					})
				}
			})
		}, this);
		var y = [{
			type : "hidden",
			name : "spec_uuid",
			value : E
		}, {
			type : "set_style_picker",
			name : "type",
			id : "render_type"
		}, {
			type : "item_picker",
			name : "items",
			id : "item_picker",
			rowId : "item_picker",
			items : Q.items
		}, {
			type : "size_picker",
			name : "size",
			id : "size",
			itemType : "collection",
			label : loc("Image size"),
			aspectRatio : Q.aspect_ratio,
			makeSquare : K.padToSquare
		}];
		if (t) {
			y = y.concat([{
				type : "hidden",
				name : "service"
			}, {
				type : "html",
				label : loc("Posting to"),
				value : t
			}, {
				className : "slim",
				type : w ? "checkbox" : "hidden",
				cblabel : loc("Post as draft"),
				name : "publish_as_draft",
				disabled : w ? null : 1
			}])
		}
		var M = [];
		var A;
		if (t) {
			var r = {
				type : "submit",
				id : "post",
				label : x,
				disabled : w ? null : 1,
				onClick : s
			};
			M.push(r)
		}
		A = {
			type : "cancel",
			id : "done",
			label : D ? loc("Cancel") : loc("Close"),
			onClick : O
		};
		M.push(A);
		if (t || D) {
			y = y.concat([{
				type : "buttons",
				buttons : M
			}])
		}
		if (!D) {
			var H;
			y = y.concat([{
				type : "html",
				value : createNode("hr")
			}]);
			if (!t) {
				y = y.concat([{
					type : "html",
					value : createNode("strong", null, null, loc("Copy and paste into your blog"))
				}])
			}
			var I = createNode("span", {
				className : "copypaste_holder"
			}, null, createCopyPaste({
				rows : 5,
				id : "copypaste"
			}, Q.embed_html));
			I.appendChild(createNode("span", {
				id : "codelabel",
				className : "copypaste"
			}));
			y = y.concat([{
				type : "html",
				value : I,
				className : "slim"
			}])
		}
		if (!t) {
			y = y.concat([{
				type : "buttons",
				buttons : M
			}])
		}
		z = new Form({
			inputs : y,
			data : K
		});
		G.appendChild(z.getNode());
		var P = function(R) {
			R = R || {};
			UI.modalDisplayAjaxMessages(R.message || [{
				type : "error",
				content : loc("An error occurred while processing your request.")
			}])
		};
		var N = {
			state : "done"
		};
		var u = function(R) {
			if (!$("copypaste")) {
				return
			}
			if (N.state == "done") {
				addClass($("codelabel"), "loading");
				$("copypaste").setAttribute("disabled", true)
			} else {
				if (N.timer) {
					window.clearTimeout(N.timer)
				}
			}
			N.state = "updating";
			N.timer = window.setTimeout(function() {
				N.timer = null;
				if (N.state == "updating") {
					return
				}
				removeClass($("codelabel"), "loading");
				$("copypaste").removeAttribute("disabled");
				N.state = "done"
			}, 300);
			Event.addSingleUseListener(ModalDialog, "hide", function() {
				Ajax.abortContract("embed_html_" + E)
			});
			Ajax.get({
				action : "set.embed_html",
				contract : "embed_html_" + E,
				data : {
					spec_uuid : R.spec_uuid,
					size : R.size,
					type : R.type,
					items : R.items.split(","),
					pad_to_square : R.padToSquare
				},
				hideProgress : true,
				onSuccess : Event.wrapper(function(T) {
					T = T || {};
					if (T.embed_html) {
						var S = T.embed_html.replace(/&amp;/g, "&");
						$("copypaste").value = S
					} else {
						P(T)
					}
				}, this),
				onError : P,
				onFinally : function() {
					if (!N.timer) {
						removeClass($("codelabel"), "loading");
						$("copypaste").removeAttribute("disabled")
					}
					N.state = "done"
				}
			})
		};
		yield(function() {
			if (K.type == "basic") {
				setNode($("item_picker"), null, {
					display : "none"
				});
				ModalDialog.rePosition()
			}
			var S = K.type;
			Event.addListener($("render_type"), "click", function(T) {
				var U = extractInputValues(z.getNode());
				if (U.type == S) {
					return
				}
				S = U.type;
				if (U.type == "basic") {
					setNode($("item_picker"), null, {
						display : "none"
					});
					ModalDialog.rePosition()
				} else {
					setNode($("item_picker"), null, {
						display : "inline-block"
					});
					ModalDialog.rePosition()
				}
				u(U)
			}, this);
			Event.addListener(z.getNode().size, "change", function() {
				var T = extractInputValues(z.getNode());
				u(T)
			}, this);
			var R = Event.rateLimit(Event.wrapper(function() {
				var T = extractInputValues(z.getNode());
				u(T)
			}, this), 2000);
			Event.addListener(z.getNode().items, "change", R);
			Event.addListener($("copypaste"), "copy", function() {
				if (!this.copied) {
					Track.stat("inc", this.trackcontext, ["copyhtml"]);
					if (Q.embed_anchor_text) {
						Track.stat("inc", "embed_anchors", [Q.embed_anchor_text]);
						Track.stat("inc", "embed_anchors", [Q.embed_anchor_text, "copypaste"]);
						Track.stat("inc", "embed_anchor_buckets", [Q.embed_anchor_seo_bucket]);
						Track.stat("inc", "embed_anchor_buckets", [Q.embed_anchor_seo_bucket, Q.embed_anchor_text]);
						if (Q.embed_anchor_seo_track) {
							Track.stat("inc", "embed_anchor_buckets", [Q.embed_anchor_seo_bucket, "in_keyword_list"])
						}
					}
					this.copied = true
				}
			}, this)
		}, this);
		ModalDialog.show_uic({
			body : G,
			title : loc("Post to your blog")
		});
		Track.stat("inc", this.trackcontext, ["show_dialog", Q.source]);
		if (!D && !Q.embed_html) {
			u(extractInputValues(z.getNode()))
		}
		return false
	};
	var c = function(D, S, G) {
		this.trackcontext = "share";
		var s = "collection";
		if (S.embedType === "contest") {
			s = "contest"
		}
		var I = createNode("div", {
			className : "sharefrm",
			trackcontext : this.trackcontext
		});
		var u;
		var y;
		var B;
		if (S.services) {
			for (var N = 0; N < S.services.length; N++) {
				var H = S.services[N];
				if ((!S.blog_select && H.blog && H.authorized) || (S.blog_select == H.service && H.blog && H.authorized)) {
					y = H;
					break
				}
			}
			if (y) {
				var w = y.display_name;
				if (y.account_info && y.account_info.account_name) {
					w = H.account_info.account_name
				}
				var E = createSprite(y.service)
			} else {
				w = loc("None")
			}
			if (!G) {
				var L = createNode("span", {
					className : "clickable"
				}, {
					paddingLeft : "8px"
				}, y ? loc("Change") : loc("Choose your blog"));
				Event.addListener(L, "click", function() {
					var T = new b(S.services, y);
					Event.addListener(T, "done", function(V) {
						if (V) {
							S.blog_select = V.service;
							S.embed_html = null
						}
						var U = new c(D, S, G)
					}, this)
				})
			}
			u = createNode("div", null, null, [E, w, L])
		}
		var M = Share.getAnonConfig();
		M.type = M.render_lb_type;
		if (y) {
			M.type = y.options.render_lb_type || M.type;
			M.size = y.options.lb_size || M.size;
			M.num_items = y.options.lb_num_items || M.num_items;
			M.rows = y.options.lb_rows || M.rows;
			M.cols = y.options.lb_cols || M.cols;
			M.include_gallery = (y.options.lb_include_gallery === undefined) ? M.include_gallery : y.options.lb_include_gallery;
			M.publish_as_draft = y.options.publish_as_draft;
			M.service = y.service
		}
		var z = "     " + loc("Post") + "     ";
		if (y) {
			z = "   " + loc("Post to {blog}", {
				blog : y.display_name
			}) + "   "
		}
		var F = "     " + loc("Posting...") + "     ";
		var Q = Event.wrapper(function() {
			var T = extractInputValues(B.getNode());
			Share.setAnonConfig({
				render_lb_type : T.type,
				lbSize : T.size,
				rows : T.rows,
				cols : T.cols,
				num_items : T.num_items,
				include_gallery : T.include_gallery
			});
			ModalDialog.hide();
			if (!u) {
				Track.stat("inc", this.trackcontext, ["close_dialog", "close"])
			} else {
				Track.stat("inc", this.trackcontext, ["close_dialog", "cancel"])
			}
		}, this);
		var A;
		var t = Event.wrapper(function(T) {
			Event.stop(T);
			Track.stat("inc", this.trackcontext, ["publish"]);
			var V = extractInputValues(B.getNode());
			var U = {
				id : V.id,
				blog_select : V.service,
				share : V.service,
				publish_as_draft : V.publish_as_draft ? 1 : 0,
				winners : V.contest_winners,
				embed_lb_type : V.type,
				embed_lb_size : V.size,
				embed_rows : V.rows,
				embed_cols : V.cols,
				embed_num_items : V.num_items,
				embed_include_gallery : V.include_gallery
			};
			setNode($("post"), {
				disabled : true,
				value : F
			});
			Ajax.post({
				busyMsg : loc("Posting") + "...",
				action : s + ".share",
				data : U,
				onSuccess : Event.wrapper(function(W) {
					UI.displayAjaxMessages(W.message);
					Track.stat("inc", this.trackcontext, ["close_dialog", "publish"]);
					ModalDialog.hide()
				}, this),
				onError : Event.wrapper(function(W) {
					UI.displayAjaxErrors(W, "error_msg")
				}, this),
				onFinally : function() {
					setNode($("post"), {
						disabled : null,
						value : z
					})
				}
			})
		}, this);
		A = [{
			type : "hidden",
			name : "id",
			value : D
		}, {
			type : "hidden",
			name : "contest_winners",
			value : S.contestWinners
		}, {
			type : "lookbook_style_picker",
			name : "type",
			id : "render_type"
		}, {
			type : "size_picker",
			name : "size",
			id : "size",
			itemType : "lookbook",
			label : loc("Layout width")
		}, {
			type : "checkbox",
			name : "include_gallery",
			id : "include_gallery",
			rowId : "include_gallery",
			label : loc("Layout details"),
			cblabel : S.embedType === "contest" ? loc("Include gallery") : loc("Include gallery and captions")
		}, {
			type : "select",
			name : "num_items",
			id : "num_items",
			rowId : "num_items",
			label : loc("Carousel size"),
			options : [{
				value : 1,
				label : "1"
			}, {
				value : 2,
				label : "2"
			}, {
				value : 3,
				label : "3"
			}, {
				value : 4,
				label : "4"
			}, {
				value : 5,
				label : "5"
			}]
		}, {
			type : "select",
			name : "rows",
			id : "rows",
			rowId : "rows",
			label : loc("Number of rows"),
			options : [{
				value : 1,
				label : "1"
			}, {
				value : 2,
				label : "2"
			}, {
				value : 3,
				label : "3"
			}, {
				value : 4,
				label : "4"
			}, {
				value : 5,
				label : "5"
			}]
		}, {
			type : "select",
			name : "cols",
			id : "cols",
			rowId : "cols",
			label : loc("Number of columns"),
			options : [{
				value : 1,
				label : "1"
			}, {
				value : 2,
				label : "2"
			}, {
				value : 3,
				label : "3"
			}, {
				value : 4,
				label : "4"
			}, {
				value : 5,
				label : "5"
			}]
		}];
		if (u) {
			A = A.concat([{
				type : "hidden",
				name : "service"
			}, {
				type : "html",
				label : loc("Posting to"),
				value : u
			}, {
				className : "slim",
				type : y ? "checkbox" : "hidden",
				cblabel : loc("Post as draft"),
				name : "publish_as_draft",
				disabled : y ? null : 1
			}, {
				type : "html",
				value : createNode("div", {
					className : "error",
					id : "error_msg"
				})
			}])
		}
		var O = [];
		if (u) {
			var r = {
				type : "submit",
				label : z,
				id : "post",
				disabled : y ? null : 1,
				onClick : t
			};
			O.push(r)
		}
		var C = {
			type : "cancel",
			id : "done",
			label : G ? loc("Cancel") : loc("Close"),
			onClick : Q
		};
		O.push(C);
		if (u || G) {
			A = A.concat([{
				type : "buttons",
				buttons : O
			}])
		}
		if (!G) {
			var J;
			A = A.concat([{
				type : "html",
				value : createNode("hr")
			}]);
			if (!u) {
				A = A.concat([{
					type : "html",
					value : createNode("strong", null, null, loc("Copy and paste into your blog"))
				}])
			}
			var K = createNode("span", {
				className : "copypaste_holder"
			}, null, createCopyPaste({
				rows : 5,
				id : "copypaste"
			}, S.embed_html));
			K.appendChild(createNode("span", {
				id : "codelabel",
				className : "copypaste"
			}));
			A = A.concat([{
				type : "html",
				value : K,
				className : "slim"
			}])
		}
		if (!u) {
			A = A.concat([{
				type : "buttons",
				buttons : O
			}])
		}
		B = new Form({
			inputs : A,
			data : M
		});
		I.appendChild(B.getNode());
		var R = function(T) {
			T = T || {};
			UI.modalDisplayAjaxMessages(T.message || [{
				type : "error",
				content : loc("An error occurred while processing your request.")
			}])
		};
		var P = {
			state : "done"
		};
		var x = function(T) {
			setNode($("include_gallery"), null, {
				display : "none"
			});
			setNode($("num_items"), null, {
				display : "none"
			});
			setNode($("rows"), null, {
				display : "none"
			});
			setNode($("cols"), null, {
				display : "none"
			});
			if (T == "slideshow") {
				setNode($("include_gallery"), null, {
					display : "block"
				})
			} else {
				if (T == "carousel") {
					setNode($("num_items"), null, {
						display : "block"
					})
				} else {
					if (T == "grid") {
						setNode($("rows"), null, {
							display : "block"
						});
						setNode($("cols"), null, {
							display : "block"
						})
					}
				}
			}
			ModalDialog.rePosition()
		};
		var v = function(T) {
			if (!$("copypaste")) {
				return
			}
			if (P.state == "done") {
				addClass($("codelabel"), "loading");
				$("copypaste").setAttribute("disabled", true)
			} else {
				if (P.timer) {
					window.clearTimeout(P.timer)
				}
			}
			P.state = "updating";
			P.timer = window.setTimeout(function() {
				P.timer = null;
				if (P.state == "updating") {
					return
				}
				removeClass($("codelabel"), "loading");
				$("copypaste").removeAttribute("disabled");
				P.state = "done"
			}, 300);
			Event.addSingleUseListener(ModalDialog, "hide", function() {
				Ajax.abortContract("embed_html_" + D)
			});
			Ajax.get({
				action : s + ".embed_html",
				contract : "embed_html_" + D,
				data : {
					id : T.id,
					size : T.size,
					type : T.type,
					rows : T.rows,
					cols : T.cols,
					num_items : T.num_items,
					include_gallery : T.include_gallery
				},
				hideProgress : true,
				onSuccess : Event.wrapper(function(V) {
					V = V || {};
					if (V.embed_html) {
						var U = V.embed_html.replace(/&amp;/g, "&");
						$("copypaste").value = U
					} else {
						R(V)
					}
				}, this),
				onError : R,
				onFinally : function() {
					if (!P.timer) {
						removeClass($("codelabel"), "loading");
						$("copypaste").removeAttribute("disabled")
					}
					P.state = "done"
				}
			})
		};
		yield(function() {
			x(M.type);
			var U = M.type;
			Event.addListener($("render_type"), "click", function(V) {
				var W = extractInputValues(B.getNode());
				if (W.type == U) {
					return
				}
				U = W.type;
				x(W.type);
				v(W)
			}, this);
			Event.addListener(B.getNode().include_gallery, "click", function() {
				var V = extractInputValues(B.getNode());
				v(V)
			}, this);
			Event.addListener(B.getNode().rows, "change", function() {
				var V = extractInputValues(B.getNode());
				v(V)
			}, this);
			Event.addListener(B.getNode().cols, "change", function() {
				var V = extractInputValues(B.getNode());
				v(V)
			}, this);
			Event.addListener(B.getNode().num_items, "change", function() {
				var V = extractInputValues(B.getNode());
				v(V)
			}, this);
			Event.addListener(B.getNode().size, "change", function() {
				var V = extractInputValues(B.getNode());
				v(V)
			}, this);
			var T = Event.rateLimit(Event.wrapper(function() {
				var V = extractInputValues(B.getNode());
				v(V)
			}, this), 2000);
			Event.addListener($("copypaste"), "copy", function() {
				if (!this.copied) {
					Track.stat("inc", this.trackcontext, ["copyhtml"]);
					this.copied = true
				}
			}, this)
		}, this);
		ModalDialog.show_uic({
			body : I,
			title : loc("Post to your blog")
		});
		Track.stat("inc", this.trackcontext, ["show_dialog"]);
		if (!G && !S.embed_html) {
			v(extractInputValues(B.getNode()))
		}
		return false
	};
	function d(r) {
		Cookie.set("eb", r, 30)
	}

	function l() {
		var r = Cookie.get("eb", true) || {};
		mergeObject(r, {
			size : "y",
			thingSize : "y",
			render_type : "details",
			render_lb_type : "slideshow",
			lbSize : "y",
			rows : 2,
			cols : 4,
			num_items : 3,
			include_gallery : 1
		}, true);
		return r
	}

	var m = function(E, x, C, w) {
		var z = new MemDataSource();
		this.itemInput = x.appendChild(createInput("hidden", {
			name : C + "items"
		}));
		var r = this.itemInput;
		var F = x.appendChild(createNode("div", {
			className : "itemholder",
			id : C + "item_picker"
		}));
		var y = [];
		var D = "li";
		for (var G = 0; G < E.length; G++) {
			var H = E[G];
			var J = H.title;
			var A = createNode("div", {
				className : "item clearfix"
			}, null, [createNode("input", {
				type : "checkbox",
				value : H.thing_id
			}), createImg({
				width : UI.sizeMap[D].dim,
				height : UI.sizeMap[D].dim,
				src : buildImgURL("img-thing", {
					tid : H.thing_id,
					size : UI.sizeMap[D].url,
					".out" : "jpg"
				})
			}), createNode("ul", {
				className : "details"
			}, null, [createNode("li", null, null, J), createNode("li", null, null, UI.priceAndLink(H))])]);
			y.push(A)
		}
		var s = createNode("span", {
			className : "clickable"
		}, null, loc("products"));
		var I = createNode("span", {
			className : "clickable"
		}, null, loc("all"));
		var B = createNode("span", {
			className : "clickable"
		}, null, loc("none"));
		var t = createNode("span", null, null, loc("Select Items") + ":&nbsp;");
		F.appendChild(createNode("div", null, null, [t, s, " - ", I, " - ", B]));
		var v = F.appendChild(createNode("div", {
			className : "scrolllist itemlist"
		}, null, y));
		var u = function(K) {
			var L = v.getElementsByTagName("input");
			Event.bundleEvents(z, "change");
			z.clear();
			for (var M = 0; M < L.length; M++) {
				switch(K) {
					case"products":
						if (E[M].is_product) {
							if (!w || E[M].in_placeholder) {
								setNode(L[M], {
									checked : "checked"
								});
								L[M].checked = true
							} else {
								setNode(L[M], {
									checked : null
								});
								L[M].checked = false
							}
						} else {
							setNode(L[M], {
								checked : null
							});
							L[M].checked = false
						}
						break;
					case"all":
						setNode(L[M], {
							checked : "checked"
						});
						L[M].checked = true;
						break;
					case"none":
						setNode(L[M], {
							checked : null
						});
						L[M].checked = false;
						break
				}
				if (L[M].checked) {
					z.appendData([L[M].value])
				}
			}
			Event.unbundleEvents(z, "change")
		};
		Event.addListener(z, "change", function() {
			r.value = z.values().join(",");
			Event.trigger(r, "change")
		});
		Event.addListener(v, "click", function(K) {
			u()
		});
		Event.addListener(s, "click", function(K) {
			u("products")
		});
		Event.addListener(I, "click", function(K) {
			u("all")
		});
		Event.addListener(B, "click", function(K) {
			u("none")
		});
		u("products");
		return z
	};
	function g(z) {
		var y = [];
		var v = createNode("span", {
			className : "clickable",
			id : z.id + "_edit"
		}, null, loc("Edit"));
		var A = z.accountListClass || "explain";
		var s = createNode("span", {
			id : "accountlist",
			className : A
		});
		var w = null;
		var u = null;
		var r = null;
		var x = function() {
			y = [];
			valueList = [];
			r = null;
			for (var B = 0; B < z.accounts.length; B++) {
				var C = z.accounts[B];
				if (C.authorized && C.options.publish_default) {
					y.push(C.display_name);
					valueList.push(C.service)
				}
			}
			z.input.value = valueList.join(",");
			Event.trigger(z.input, "change");
			if (y.length) {
				s.innerHTML = loc("Posting to:") + "&nbsp;" + y.join(",&nbsp;") + "&nbsp;&nbsp;";
				v.innerHTML = loc("Edit")
			} else {
				s.innerHTML = "";
				v.innerHTML = loc("Add quick share account")
			}
		};
		Event.addListener(z.accounts, "change", x);
		x();
		var t = createNode("div", {
			className : "account_list",
			id : z.id
		}, null, [z.checkbox, s, v]);
		Event.addListener(v, "click", function() {
			var C;
			var D = new k(z.accounts, {
				inline : z.inParent ? true : false
			});
			var B = function() {
				Event.trigger(t, "resize")
			};
			if (z.inDialog) {
				C = ModalDialog.getContent();
				ModalDialog.show_uic({
					title : D.title,
					body : D.node
				});
				Event.addSingleUseListener(ModalDialog, "hide", function() {
					ModalDialog.show(C)
				})
			} else {
				if (z.inParent) {
					z.inParent.appendChild(D.node);
					Event.addListener(D, "resize", B)
				} else {
					ModalDialog.show_uic({
						title : D.title,
						body : D.node
					})
				}
			}
			B();
			Event.trigger(t, "showedit");
			Event.addSingleUseListener(D, "done", function() {
				x();
				if (z.inDialog) {
					ModalDialog.setContent(C)
				} else {
					if (z.inParent) {
						clearNode(z.inParent);
						Event.removeListener(D, "resize", B)
					} else {
						ModalDialog.hide()
					}
				}
				B();
				Event.trigger(t, "hideedit")
			})
		});
		return t
	}

	var q = function(t, A) {
		this.trackcontext = "tickerdialog";
		this.ok = false;
		var y;
		var u, B, r;
		if (t == "new") {
			y = loc("Add Polyvore to Your Facebook Timeline");
			u = loc("Add your Polyvore creations and activity to your Facebook Timeline for the connected account ");
			B = loc("Try it out");
			r = loc("Cancel")
		} else {
			y = loc("Add Polyvore Activities to Your Facebook Timeline");
			u = loc("We've added more support for Facebook Timeline! Update your account to enable all Polyvore activities for your connected account.");
			topTextExtra = loc("This will include people you follow, your likes and comments, and more.");
			B = loc("Try it out");
			r = loc("Cancel")
		}
		var s = createNode("div", {
			trackcontext : this.trackcontext
		});
		var w = createNode("div", null, null, [u, createNode("a", {
			href : A.account_url,
			target : "_blank"
		}, null, A.account_name), ". "]);
		if (t == "old") {
			w.appendChild(document.createTextNode(topTextExtra))
		}
		s.appendChild(w);
		var v = false;
		var x = Event.wrapper(function(C) {
			v = true;
			Track.stat("inc", this.trackcontext, ["ok"]);
			setNode($("post"), {
				disabled : true,
				value : loc("Saving")
			});
			Ajax.post({
				action : "account.sharing",
				data : {
					optin_posting : "facebook"
				},
				onSuccess : Event.wrapper(function(D) {
					UI.displayAjaxMessages(D.message);
					Track.stat("inc", this.trackcontext, ["close_dialog", "ok"]);
					this.ok = true
				}, this),
				onFinally : Event.wrapper(function() {
					v = false;
					Event.trigger(this, "done")
				}, this)
			})
		}, this);
		var z = Event.wrapper(function(C) {
			v = true;
			Track.stat("inc", this.trackcontext, ["nosharing"]);
			setNode($("post"), {
				disabled : true,
				value : loc("Saving")
			});
			Ajax.post({
				action : "account.sharing",
				data : {
					optout_posting : "facebook"
				},
				onSuccess : Event.wrapper(function(D) {
					UI.displayAjaxMessages(D.message);
					Track.stat("inc", this.trackcontext, ["close_dialog", "ok"]);
					this.ok = true
				}, this),
				onFinally : Event.wrapper(function() {
					v = false;
					Event.trigger(this, "done")
				}, this)
			})
		}, this);
		Event.addSingleUseListener(ModalDialog, "hide", Event.wrapper(function(C) {
			if (!v) {
				Event.trigger(this, "done")
			}
		}, this));
		Track.stat("inc", this.trackcontext, ["show"]);
		ModalDialog.confirm({
			title : y,
			body : s,
			okLabel : B,
			onOk : x,
			cancelLabel : r,
			onCancel : z
		})
	};
	var p = function(y, s, v, w) {
		var u = "collection.embed_html";
		var t = "embed_html_" + y;
		if (s === "contest") {
			u = "contest.embed_html"
		}
		var x = createNode("div", {
			className : "embeddialog embed"
		});
		x.appendChild(createNode("center")).appendChild(createNode("span", {
			className : "loading"
		}, null, loc("Loading"), "&hellip;"));
		ModalDialog.show(x);
		var r = Share.getAnonConfig();
		Event.addSingleUseListener(ModalDialog, "hide", function() {
			Ajax.abortContract(t)
		});
		Ajax.get({
			action : u,
			contract : t,
			data : {
				services : 1,
				id : y,
				size : r.size,
				type : r.render_lb_type,
				rows : r.rows,
				cols : r.cols,
				num_items : r.num_items,
				include_gallery : r.include_gallery,
				winners : w
			},
			hideProgress : true,
			onSuccess : function(A) {
				A = A || {};
				A.redirectUrl = v;
				A.embedType = s;
				A.contestWinners = w;
				if (A.embed_html) {
					Event.addListener(Event.BACKEND, "oauth_unconnect", function(B) {
						for (var C = 0; C < A.services.length; C++) {
							if (A.services[C].service == B) {
								A.services[C].authorized = false;
								Event.trigger(A.services, "change", A.services[C]);
								break
							}
						}
					}, this);
					Event.addListener(Event.BACKEND, "oauth_connect", function(B) {
						for (var C = 0; C < A.services.length; C++) {
							if (A.services[C].service == B.service) {
								mergeObject(A.services[C], B);
								Event.trigger(A.services, "change", A.services[C]);
								break
							}
						}
					}, this);
					var z = new c(y, A);
					return
				}
				ModalDialog.hide()
			},
			onError : function(z) {
				if (v) {
					window.location = v
				}
				ModalDialog.hide()
			}
		})
	};
	return {
		createAccountPicker : function(r) {
			return g(r)
		},
		createItemPicker : function(t, r, s, u) {
			return new m(t, r, s, u)
		},
		getAnonConfig : function() {
			return l()
		},
		setAnonConfig : function(r) {
			d(r)
		},
		connect : function(r, s) {
			Track.stat("inc", "share", ["connect_inline"]);
			return new k(r, {
				published : s
			})
		},
		connectDialog : function(r, s) {
			Track.stat("inc", "share", ["connect_nag"]);
			var t = new k(r, {
				published : s
			});
			ModalDialog.show_uic({
				title : t.title,
				body : t.node
			});
			return t
		},
		facebookTickerDialog : function(s, r) {
			return new q(s, r)
		},
		auto : function(s, t, v) {
			var u = createNode("div", {
				className : "fieldset embeddialog embed"
			});
			u.appendChild(createNode("center")).appendChild(createNode("span", {
				className : "loading"
			}, null, loc("Loading"), "&hellip;"));
			ModalDialog.show(u);
			var r = Share.getAnonConfig();
			Event.addSingleUseListener(ModalDialog, "hide", function() {
				Ajax.abortContract("embed_html_" + s)
			});
			Ajax.get({
				action : "set.embed_html",
				contract : "embed_html_" + s,
				data : {
					services : 1,
					spec_uuid : s,
					size : r.size,
					type : r.render_type
				},
				hideProgress : true,
				onSuccess : function(x) {
					console.info(x);
					x = x || {};
					x.redirectUrl = t;
					x.source = v;
					if (x.embed_html) {
						Event.addListener(Event.BACKEND, "oauth_unconnect", function(y) {
							for (var z = 0; z < x.services.length; z++) {
								if (x.services[z].service == y) {
									x.services[z].authorized = false;
									Event.trigger(x.services, "change", x.services[z]);
									break
								}
							}
						}, this);
						Event.addListener(Event.BACKEND, "oauth_connect", function(y) {
							for (var z = 0; z < x.services.length; z++) {
								if (x.services[z].service == y.service) {
									mergeObject(x.services[z], y);
									Event.trigger(x.services, "change", x.services[z]);
									break
								}
							}
						}, this);
						var w = new f(s, x);
						return
					}
					ModalDialog.hide()
				},
				onError : function(w) {
					if (t) {
						window.location = t
					}
					ModalDialog.hide()
				}
			});
			return false
		},
		thing : function(t, s, w) {
			var v = createNode("div", {
				className : "fieldset embeddialog round_cornered embed"
			});
			v.appendChild(createNode("center")).appendChild(createNode("span", {
				className : "loading"
			}, null, loc("Loading"), "&hellip;"));
			ModalDialog.show(v);
			var r = Share.getAnonConfig();
			var u = Ajax.get({
				action : "thing.embed_html",
				contract : "embed_html_" + t,
				data : {
					services : 1,
					id : t,
					size : r.thingSize
				},
				hideProgress : true,
				onSuccess : function(y) {
					y = y || {};
					y.redirectUrl = s;
					y.source = w;
					if (y.embed_html) {
						Event.addListener(Event.BACKEND, "oauth_unconnect", function(z) {
							for (var A = 0; A < y.services.length; A++) {
								if (y.services[A].service == z) {
									y.services[A].authorized = false;
									Event.trigger(y.services, "change", y.services[A]);
									break
								}
							}
						}, this);
						Event.addListener(Event.BACKEND, "oauth_connect", function(z) {
							for (var A = 0; A < y.services.length; A++) {
								if (y.services[A].service == z.service) {
									mergeObject(y.services[A], z);
									Event.trigger(y.services, "change", y.services[A]);
									break
								}
							}
						}, this);
						var x = new a(t, y);
						return
					}
					ModalDialog.hide()
				},
				onError : function(x) {
					if (s) {
						window.location = s
					}
					ModalDialog.hide()
				}
			});
			Event.addSingleUseListener(ModalDialog, "hide", function() {
				Ajax.abort(u)
			});
			return false
		},
		lookbook : function(r, s) {
			p(r, "lookbook", s);
			return false
		},
		contest : function(r, t, s) {
			p(r, "contest", s, t);
			return false
		},
		email : function(s) {
			var t;
			var r = [{
				name : "email",
				type : "email",
				label : loc("Recipient"),
				hint : loc("Enter an email address")
			}, {
				name : "msg",
				type : "textarea",
				label : loc("Message"),
				hint : loc("200 characters max.") + " " + loc("We'll include this message in the email."),
				maxlength : 200
			}, {
				type : "html",
				value : createNode("div", {
					className : "error",
					id : "error_msg"
				})
			}, {
				type : "buttons",
				buttons : [{
					label : loc("Send"),
					type : "submit",
					onClick : Event.wrapper(function(v) {
						Event.stop(v);
						mergeObject(s, t.getData());
						var u = Event.getSource(v);
						setNode(u, {
							value : loc("Sending") + "...",
							disabled : true
						});
						Ajax.post({
							busyMsg : loc("Sending") + "...",
							action : "share.email",
							data : s,
							onSuccess : function(w) {
								UI.displayAjaxMessages(w.message);
								ModalDialog.hide()
							},
							onError : function(w) {
								UI.displayAjaxErrors(w, "error_msg");
								setNode(u, {
									value : loc("Send"),
									disabled : null
								})
							}
						})
					})
				}, {
					label : loc("Cancel"),
					type : "cancel",
					onClick : ModalDialog.hide
				}]
			}];
			t = new Form({
				inputs : r
			});
			return ModalDialog.show_uic({
				title : loc("Share via email"),
				body : t.getNode()
			})
		},
		twitter : function(t, s) {
			if (s) {
				Track.stat("inc", "share", ["twitter", "anonymous", Auth.userId()]);
				var v = "polyvore:Polyvore";
				var r;
				if (t.uid) {
					var w = loc("Find me on @polyvore at {url}", {
						url : t.url
					});
					r = "http://twitter.com/share?url=" + encodeURIComponent(t.url) + "&text=" + encodeURIComponent(w) + "&related=" + v
				} else {
					var u = BaseShare.pageInfo();
					if (u.title.length) {
						u.title = u.title.replace("- Polyvore", "@polyvore")
					}
					u.url = n(u.url, "twitter");
					r = "http://twitter.com/share?url=" + encodeURIComponent(u.url) + "&text=" + encodeURIComponent(u.title) + "&related=" + v
				}
				openWindow("twitter", r, 520, 400);
				return false
			}
			var x = createNode("div", {
				className : "fieldset embeddialog embed"
			});
			x.appendChild(createNode("center")).appendChild(createNode("span", {
				className : "loading"
			}, null, loc("Loading"), "&hellip;"));
			ModalDialog.show(x);
			Auth.getServices(function(A) {
				var D;
				for (var z in A) {
					if (A[z].service == "twitter") {
						D = A[z];
						break
					}
				}
				if (D.authorized) {
					Track.stat("inc", "share", ["twitter", "authorized", Auth.userId()]);
					var B = {
						share : "twitter"
					};
					var C;
					if (t.spec_uuid) {
						C = "set.share";
						B.spec_uuid = t.spec_uuid
					} else {
						if (t.tid) {
							C = "thing.share";
							B.id = t.tid
						} else {
							if (t.lid) {
								C = "collection.share";
								B.id = t.lid
							}
						}
					}
					ModalDialog.confirm({
						title : loc("Post to Twitter?"),
						okLabel : loc("Post"),
						onOk : Event.wrapper(function() {
							Ajax.post({
								busyMsg : loc("Posting") + "...",
								action : C,
								data : B,
								onSuccess : Event.wrapper(function(E) {
									UI.displayAjaxMessages(E.message);
									ModalDialog.hide();
									return false
								}, this),
								onError : function() {
									ModalDialog.hide();
									Share.twitter(t, true)
								}
							})
						}, this)
					})
				} else {
					var y = false;
					if (D.show_upsell) {
						y = true;
						Share.showUpsell(D, t, Share.twitter)
					} else {
						ModalDialog.hide();
						Share.twitter(t, true)
					}
					Ajax.post({
						action : "oauth.record_anonymous_share",
						data : {
							upsell : y,
							service : "twitter"
						}
					})
				}
			}, null, t.refresh)
		},
		facebook : function(s) {
			var t = BaseShare.pageInfo();
			if (s && s.uid) {
				t.url = s.url;
				t.title = s.url.substring(7)
			}
			t.url = n(t.url, "facebook");
			var r = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(t.url) + "&t=" + encodeURIComponent(t.title);
			openWindow("facebook", r, 1000, 600);
			return false
		},
		pinterest : function(t, s) {
			if (s || !bucketIs("pinterest", "on")) {
				Track.stat("inc", "share", ["pin_it", "anonymous", Auth.userId()]);
				var r = openWindow("pinterest", "about:blank");
				j(r, t);
				return false
			}
			var u = createNode("div", {
				className : "fieldset embeddialog embed"
			});
			u.appendChild(createNode("center")).appendChild(createNode("span", {
				className : "loading"
			}, null, loc("Loading"), "&hellip;"));
			ModalDialog.show(u);
			Auth.getServices(function(F) {
				var z = F[0] || {};
				if (z.authorized) {
					var D = {
						share : "pinterest"
					};
					var x;
					if (t.spec_uuid) {
						x = "set.share";
						D.spec_uuid = t.spec_uuid
					} else {
						if (t.tid) {
							x = "thing.share";
							D.id = t.tid
						} else {
							if (t.lid) {
								x = "collection.share";
								D.id = t.lid
							}
						}
					}
					var y = z.board_list;
					var w = {};
					var B = [];
					var A = [];
					if (y) {
						y.forEach(function(G) {
							B.push({
								label : G.board_name,
								value : G.board_id
							});
							w[G.board_id] = {
								name : G.board_name,
								url : G.board_url
							}
						});
						A.push({
							type : "select",
							name : "default_board_id",
							options : B
						})
					}
					A.push({
						type : "buttons",
						buttons : [{
							id : "pin",
							type : "submit",
							label : loc("Pin it")
						}, {
							type : "cancel",
							label : loc("Cancel"),
							onClick : ModalDialog.hide
						}]
					});
					var v = new Form({
						data : {
							default_board_id : z.options.default_board_id
						},
						onSubmit : Event.wrapper(function(H) {
							Event.stop(H);
							var I = v.getData();
							var G = I.default_board_id;
							if (G && G !== "new_board") {
								D.default_board_id = G;
								D.default_board_name = w[G].name;
								D.default_board_url = w[G].url;
								if (G == z.options.default_board_id) {
									Track.stat("inc", "share", ["pin_it_keep_board", Auth.userId()])
								} else {
									Track.stat("inc", "share", ["pin_it_change_board", Auth.userId()])
								}
							}
							Ajax.post({
								busyMsg : loc("Posting") + "...",
								action : x,
								data : D,
								onSuccess : Event.wrapper(function(J) {
									if (z.show_follow_upsell) {
										Share.showFollowUpsell(J.message)
									} else {
										UI.displayAjaxMessages(J.message);
										ModalDialog.hide()
									}
									return false
								}, this),
								onError : function() {
									ModalDialog.hide();
									Share.pinterest(t, true)
								}
							})
						}, this),
						inputs : A
					});
					ModalDialog.show_uic({
						body : v.getNode(),
						title : loc("Pin to Pinterest?")
					});
					Track.stat("inc", "share", ["pin_it", "authorized", Auth.userId()])
				} else {
					var C = Event.wrapper(function() {
						if (t.lid) {
							Track.stat("inc", "share", ["pin_it", "lookbook_upsell_ok", Auth.userId()])
						} else {
							Track.stat("inc", "share", ["pin_it", "upsell_ok", Auth.userId()])
						}
						var G = openWindow("pv_oauth_pinterest", buildURL("oauth.flow", {
							service : "pinterest"
						}), 800, 600, null, window.screenTop || window.screenY);
						G.focus();
						Event.addListener(new Monitor(function() {
							return G.closed
						}), "change", function() {
							ModalDialog.hide();
							t.triedUpsell = true;
							Share.pinterest(t)
						})
					}, this);
					if (t.lid) {
						if (t.triedUpsell) {
							ModalDialog.hide();
							return
						}
						Track.stat("inc", "share", ["pin_it", "lookbook_upsell_show", Auth.userId()]);
						ModalDialog.show_uic({
							title : loc("Add Your Pinterest Account"),
							body : createNode("div", null, null, loc("You'll need to connect your Pinterest account before you can pin this collection.")),
							className : "confirm",
							actions : [{
								label : createNode("span", {
									className : "btn btn_action"
								}, null, loc("Connect account")),
								action : C
							}, {
								label : loc("Cancel"),
								action : Event.wrapper(function() {
									Track.stat("inc", "share", ["pin_it", "lookbook_upsell_cancel"]);
									ModalDialog.hide()
								}, this)
							}]
						});
						return
					}
					var E = false;
					if (z.show_upsell) {
						E = true;
						ModalDialog.show_uic({
							title : loc("Add Your Pinterest Account"),
							body : createNode("div", null, null, loc("Save time by connecting your Pinterest account to Polyvore.")),
							className : "confirm",
							actions : [{
								label : createNode("span", {
									className : "btn btn_action"
								}, null, loc("Connect account")),
								action : C
							}, {
								label : loc("Not now"),
								action : Event.wrapper(function() {
									Track.stat("inc", "share", ["pin_it", "upsell_cancel"]);
									ModalDialog.hide();
									Share.pinterest(t, true)
								}, this)
							}]
						});
						Track.stat("inc", "share", ["pin_it", "upsell_show"])
					} else {
						ModalDialog.hide();
						Share.pinterest(t, true)
					}
					Ajax.post({
						action : "oauth.record_anonymous_share",
						data : {
							upsell : E,
							service : "pinterest"
						}
					})
				}
			}, "pinterest", true)
		},
		tumblr : function(v, u) {
			if (u) {
				Track.stat("inc", "share", ["tumblr", "anonymous", Auth.userId()]);
				var w = BaseShare.pageInfo();
				var s = "photo";
				var r = n(w.url, "tumblr");
				var t = "http://www.tumblr.com/share?v=3&s=&u=" + encodeURIComponent(r) + "&t=" + encodeURIComponent(w.title);
				ModalDialog.hide();
				openWindow("tumblr", t, 800, 430);
				return false
			}
			var x = createNode("div", {
				className : "fieldset embeddialog embed"
			});
			x.appendChild(createNode("center")).appendChild(createNode("span", {
				className : "loading"
			}, null, loc("Loading"), "&hellip;"));
			ModalDialog.show(x);
			Auth.getServices(function(B) {
				var D;
				for (var A in B) {
					if (B[A].service == "tumblr") {
						D = B[A];
						break
					}
				}
				if (D.authorized) {
					Track.stat("inc", "share", ["tumblr", "authorized", Auth.userId()]);
					v.services = B;
					if (v.spec_uuid) {
						Ajax.get({
							action : "set.embed_html",
							contract : "embed_html_" + v.spec_uuid,
							data : {
								services : 1,
								spec_uuid : v.spec_uuid,
								size : D.options.size,
								type : D.options.render_type
							},
							hideProgress : true,
							onSuccess : function(F) {
								F = F || {};
								if (F.embed_html) {
									F.blog_select = "tumblr";
									var E = new f(v.spec_uuid, F, true);
									return false
								}
								ModalDialog.hide();
								Share.tumblr(v, true)
							},
							onError : function() {
								ModalDialog.hide();
								Share.tumblr(v, true)
							}
						})
					} else {
						if (v.tid) {
							var z = new a(v.tid, v, true);
							return false
						} else {
							if (v.lid) {
								var C = new c(v.lid, v, true);
								return false
							}
						}
					}
				} else {
					var y = false;
					if (D.show_upsell) {
						y = true;
						Share.showUpsell(D, v, Share.tumblr)
					} else {
						ModalDialog.hide();
						Share.tumblr(v, true)
					}
					Ajax.post({
						action : "oauth.record_anonymous_share",
						data : {
							upsell : y,
							service : "tumblr"
						}
					})
				}
			}, null, v.refresh)
		},
		pinterestCaptcha : function(x, v, y) {
			y = $(y);
			y.setAttribute("class", "btn follow_action");
			v = $(v);
			v.removeAttribute("disabled");
			Track.stat("inc", "pinterestCaptcha");
			var u = "width=738,height=340,scrollbars=1";
			var s = (window.screenLeft || window.screenX || 0) + 26;
			var t = (window.screenTop || window.screenY || 0) + 118;
			if (Browser.isIE) {
				s -= 6;
				t -= 60
			}
			var r = window.open(x, "_pinterest", u + ",left=" + s + ",top=" + t);
			r.focus()
		},
		showUpsell : function(u, s, v) {
			var r = u.service;
			var t = u.display_name;
			ModalDialog.show_uic({
				title : loc("Add Your {service} Account", {
					service : t
				}),
				body : createNode("div", null, null, loc("Save time by connecting your {service} account to Polyvore.", {
					service : t
				})),
				className : "confirm",
				actions : [{
					label : createNode("span", {
						className : "btn btn_action"
					}, null, loc("Connect account")),
					action : Event.wrapper(function() {
						Track.stat("inc", "share", [r, "upsell_ok", Auth.userId()]);
						var x = openWindow("pv_oauth_" + r, buildURL("oauth.flow", {
							service : r
						}), 800, 600, null, window.screenTop || window.screenY);
						x.focus();
						Event.addListener(new Monitor(function() {
							return x.closed
						}), "change", function() {
							ModalDialog.hide();
							s.refresh = true;
							v(s)
						})
					}, this)
				}, {
					label : loc("Not now"),
					action : Event.wrapper(function() {
						Track.stat("inc", "share", [r, "upsell_cancel"]);
						ModalDialog.hide();
						v(s, true)
					}, this)
				}]
			});
			Track.stat("inc", "share", [r, "upsell_show"])
		},
		showFollowUpsell : function(r) {
			Track.stat("inc", "share", ["pinterest", "show_follow_upsell", Auth.userId()]);
			ModalDialog.show_uic({
				title : loc("Get more Polyvore on Pinterest?"),
				body : createNode("div", null, null, loc("Follow Polyvore to get the hottest trends, contests and DIYs curated for you.")),
				actions : [{
					label : createNode("span", {
						className : "btn btn_action"
					}, null, loc("Follow Polyvore on Pinterest")),
					action : Event.wrapper(function() {
						Track.stat("inc", "share", ["pinterest", "follow_upsell_ok", Auth.userId()]);
						Ajax.post({
							action : "pinterest.follow",
							data : {
								name : "Polyvore"
							},
							onSuccess : Event.wrapper(function(s) {
								UI.displayAjaxMessages(s.message)
							}, this),
							onFinally : Event.wrapper(function(s) {
								ModalDialog.hide()
							}, this)
						})
					}, this)
				}, {
					label : loc("Not now"),
					action : Event.wrapper(function() {
						Track.stat("inc", "share", ["pinterest", "follow_upsell_cancel"]);
						ModalDialog.hide()
					}, this)
				}]
			});
			Event.addSingleUseListener(ModalDialog, "hide", function() {
				UI.displayAjaxMessages(r)
			});
			Ajax.post({
				action : "account.update_extsvc_prefs",
				data : {
					service_name : "pinterest",
					num_follow_upsells : 1
				}
			})
		}
	}
}();
var SizePicker = function() {
	var d;
	function k(p, n, o) {
		var m = {
			value : p
		};
		if (o) {
			m.selected = "selected"
		}
		return createNode("option", m, null, n)
	}

	function j(m) {
		var o = Number(m);
		if (isNaN(o)) {
			return 600
		}
		if (o > 1024) {
			return 1024
		}
		if (o < 300) {
			return 300
		}
		return o
	}

	function b(n) {
		if (!n || n.charAt(0) != "c") {
			return null
		}
		var o = n.substring(1).split("x");
		var m = {
			width : j(o[0])
		};
		if (o.length == 1) {
			m.height = m.width
		} else {
			m.height = j(o[1])
		}
		return m
	}

	function g(m, n) {
		return "c" + m.value + "x" + n.value
	}

	function f(m, n, o) {
		if (o) {
			return m
		}
		return j(Math.round(m / n))
	}

	function c(m, n, o) {
		if (o) {
			return m
		}
		return j(Math.round(n / m))
	}

	function h(n, r, s) {
		var p = n.value;
		var q;
		var m;
		if (!p) {
			return null
		}
		if (n.value == "c") {
			q = d.width;
			m = d.height
		} else {
			if (p.charAt(0) == "c") {
				var o = b(p);
				q = o.width;
				m = customDimesnions.height
			} else {
				q = m = UI.sizeMap[p].dim
			}
		}
		if (s) {
			m = q
		} else {
			m = j(Math.round(q / r))
		}
		return {
			width : q,
			height : m
		}
	}

	function a(m, p, n, o) {
		hide(n);
		hide(o);
		if (m.value.charAt(0) == "c") {
			if (p.custom.showWidth) {
				showInline(n)
			}
			if (p.custom.showHeight) {
				showInline(o)
			}
		} else {
			if (p.showWidth) {
				showInline(n)
			}
			if (p.showHeight) {
				showInline(o)
			}
		}
	}

	function l(u, p, E) {
		var C = p.value;
		var A = createNode("select");
		var n = E.sizes || [];
		for (var D = 0; D < n.length; D++) {
			var B = n[D];
			var t = px(UI.sizeMap[B].dim);
			A.appendChild(k(B, t, (B == C)))
		}
		var o = E.aspectRatio || 1;
		var w = createCheckboxOrRadio("checkbox", {
			name : "padToSquare",
			id : "padToSquare",
			value : "on",
			checked : E.aspectRatio ? E.makeSquare : true
		});
		var q = createLabel({
			"for" : "padToSquare"
		}, null, loc("Square canvas"));
		var G = createNode("span", {
			className : "square_checkbox"
		}, null, [w, q]);
		if (!E.aspectRatio) {
			hide(G)
		}
		if (E.custom) {
			d = b(C);
			A.appendChild(k("c", loc("Custom") + "...", d));
			if (!d) {
				d = b(E.custom.defaultValue)
			}
		}
		var s = h(A, o, w.checked);
		var x = createInput("text", {
			value : s.width,
			size : 3,
			disabled : E.disableWidth ? true : null
		});
		var z = createInput("text", {
			value : s.height,
			size : 3,
			disabled : E.disableHeight ? true : null
		});
		var r = createNode("span", null, null, ["x", z]);
		var F = createNode("span", {
			className : "widthheight"
		}, null, [x, r]);
		if (E.showHeight) {
			F.appendChild(createNode("span", {
				className : "explain"
			}, null, loc("(w x h)")))
		}
		var m = function(H) {
			if (H.keyCode < 32 || (H.keyCode >= 48 && H.keyCode <= 57) || (H.keyCode >= 96 && H.keyCode <= 105)) {
				return
			}
			Event.stop(H)
		};
		Event.addListener(x, "keyup", function() {
			yield(function() {
				var H = x.value;
				z.value = f(H, o, w.checked)
			})
		});
		Event.addListener(x, "keydown", m);
		Event.addListener(z, "keyup", function() {
			yield(function() {
				var H = z.value;
				x.value = H
			})
		});
		Event.addListener(z, "keydown", m);
		var v = function() {
			var H = j(x.value);
			z.value = f(H, o, w.checked);
			x.value = H;
			if (E.custom) {
				p.value = g(x, z)
			}
			a(A, E, x, r);
			Event.trigger(p, "change")
		};
		Event.addListener(x, "change", v);
		var y = function() {
			var H = j(z.value);
			x.value = c(H, o, w.checked);
			z.value = H;
			if (E.custom) {
				p.value = g(x, z)
			}
			a(A, E, x, r);
			Event.trigger(p, "change")
		};
		Event.addListener(z, "change", y);
		if (Browser.isIE) {
			Event.addListener(x, "blur", v);
			Event.addListener(z, "blur", y)
		}
		v();
		Event.addListener(A, "change", function() {
			var H = h(A, o, w.checked);
			x.value = H.width;
			z.value = H.height;
			if (A.value == "c") {
				if (E.custom.width) {
					yield(function() {
						x.focus()
					})
				} else {
					yield(function() {
						z.focus()
					})
				}
				p.value = g(x, z)
			} else {
				p.value = A.value
			}
			a(A, E, x, r);
			Event.trigger(p, "change")
		});
		if (G) {
			Event.addListener(w, "change", function() {
				v()
			})
		}
		Event.addListener(A, "click", function(H) {
			Event.stop(H)
		});
		Event.addListener(p, "focus", function() {
			A.focus()
		});
		u.appendChild(createNode("span", {
			className : "size_picker"
		}, null, [A, F, G]))
	}
	return {
		add : function(m, o, n) {
			l($(m), $(o), n)
		}
	}
}();
function ModerateContest(w) {
	var s = $(w.node_id);
	var p = (this.winnerBox = $(w.winnerbox_id));
	this.maxVotes = w.max_votes;
	this.contestId = w.contest_id;
	var g = (this.publicVoting = w.public_voting);
	var k = (this.isModerator = w.is_moderator);
	var v = w.is_admin_user;
	var f = (this.winnerSource = new MemDataSource([], {
		converter : function(z) {
			z.getHashKey = function() {
				return z.id
			};
			return z
		}
	}));
	var d = new ResultSet({
		renderer : Event.wrapper(this.renderWinner, this),
		source : f,
		stopClickEvent : true,
		fullRedraw : true
	});
	d.init(p);
	d.setEmptyMessage(w.empty_message || loc("Drag sets here"));
	var u = new Orderable(d);
	f.setData(w.votes);
	d.redraw();
	Event.addListener(d.getNode(), "drop", this.onWinnerDrop, this);
	Event.addListener(f, "change", this.onVoteChange, this);
	Event.addListener(d, "click", this.showWinnerTooltip, this);
	Event.addListener(d, "hidetooltip", ToolTip.hide);
	var y = (this.textInput = createNode("input", {
		type : "text"
	}));
	p.appendChild(y);
	Event.addListener(d, "click", function() {
		y.focus()
	});
	Event.addListener(d, "hidetooltip", function() {
		y.focus()
	});
	Event.addListener(y, "keydown", function() {
		window.setTimeout(Event.wrapper(this.onWinnerPaste, this), 0)
	}, this);
	var x = new AjaxDataSource("contest.entries", {
		id : this.contestId,
		length : 50,
		sort : ( g ? "user_order" : "-createdon"),
		state : ( g ? "active" : "moderatable")
	}, {
		converter : function(z) {
			z.getHashKey = function() {
				return z.id
			};
			return z
		},
		cacheResults : 600
	});
	var r = (this.results = new ResultSet({
		className : "entries",
		source : x,
		renderer : function(z) {
			return ModerateContest.renderEntry(z, "l2")
		},
		autoSize : {
			imgSize : "l2"
		}
	}));
	Event.addListener(r, "dragstart", this.onDragStart, this);
	r.init(s);
	r.setEmptyMessage(loc("No entries to display"));
	if (!g) {
		var b = {
			textWidth : 80,
			options : [{
				value : "-createdon",
				label : loc("Latest")
			}, {
				value : "createdon",
				label : loc("Earliest")
			}, {
				value : "-pop",
				label : loc("Popularity")
			}]
		};
		if (v) {
			b.options.push({
				value : "user_name",
				label : "User name: A-Z"
			});
			b.options.push({
				value : "-user_name",
				label : "User name: Z-A"
			});
			b.options.push({
				value : "-entry_count",
				label : "User with most entries"
			});
			b.options.push({
				value : "entry_count",
				label : "User with least entries"
			})
		}
		var n = new SelectFilter(x, "sort", "-createdon", "-createdon", b);
		var m = FilterUI.factory("filterdropdown", n, b);
		var o = new Toolbar();
		r.getHeaderNode().appendChild(o.getNode());
		o.add().appendChild(createNode("span", {
			className : "caption"
		}, null, loc("Sort by") + ":"));
		m.attach(o.add());
		if (v) {
			var a = {
				textWidth : 80,
				options : [{
					value : "",
					label : "All"
				}, {
					value : "us",
					label : "US"
				}]
			};
			var h = new SelectFilter(x, "country", "", "", a);
			var q = FilterUI.factory("filterdropdown", h, a);
			o.add().appendChild(createNode("span", {
				className : "caption"
			}, null, "Country:"));
			q.attach(o.add());
			var c = {
				textWidth : 80,
				options : [{
					value : "first_time",
					label : "First time entrants"
				}, {
					value : "no_recent_win",
					label : "No recent wins"
				}]
			};
			var j = new SelectFilter(x, "filter", "", "", c);
			var l = FilterUI.factory("filterdropdown", j, c);
			o.add().appendChild(createNode("span", {
				className : "caption"
			}, null, "Filter by:"));
			l.attach(o.add())
		}
		o.addSpring();
		r.addPaginationPaddles(o.add())
	} else {
		r.addPaginationPaddles()
	}
	if ($("create_finalist_collection")) {
		var t = $("create_finalist_collection");
		Event.addListener(t, "click", Event.wrapper(function() {
			Ajax.post({
				action : "contest.create_finalist_collection",
				data : {
					contest_id : this.contestId
				},
				onSuccess : function(z) {
					Feedback.message(z.message[0].content, 30000)
				}
			});
			return false
		}, this))
	}
	r.redrawIfDirty();
	Event.addListener(r, "click", this.showEntryTooltip, this);
	Event.addListener(r, "hidetooltip", ToolTip.hide);
	Event.addListener(window, "resize", this.onResize, this);
	this.onResize()
}
ModerateContest.prototype.renderWinner = function(d) {
	var f = createNode("div", {
		className : "grid"
	});
	var b = f.appendChild(createNode("a", {
		target : "_blank",
		href : "#foo",
		className : "hoverborder"
	}, null, UI.setRender(d, "t")));
	var c = createNode("div", {
		className : "reject"
	});
	b.appendChild(c);
	Event.addListener(c, "click", function(g) {
		this.winnerSource.remove(d);
		return Event.stop(g)
	}, this);
	var a = this.winnerSource.find(d);
	if (a < this.maxVotes) {
		addClass(b, "highlight");
		f.appendChild(createNode("div", {
			className : "ordinate"
		}, null, a + 1))
	}
	return f
};
ModerateContest.prototype.onWinnerPaste = function() {
	var a = this.textInput.value;
	if (a) {
		if (a.match(/\/set\?id=(\d+)$/)) {
			var b = RegExp.$1;
			this.addSetById(b)
		}
		this.textInput.value = ""
	}
};
ModerateContest.prototype.onWinnerDrop = function(b, a) {
	var c = b.xDataTransfer.getData("set");
	if (c) {
		this.addWinner(c, a)
	}
};
ModerateContest.prototype.addSetById = function(a) {
	Ajax.post({
		action : "contest.entry",
		data : {
			contest_id : this.contestId,
			cid : a
		},
		onSuccess : Event.wrapper(function(b) {
			if (b.entry) {
				this.addWinner(b.entry)
			}
		}, this),
		onError : function(b) {
			UI.displayAjaxMessages(b.message)
		}
	})
};
ModerateContest.prototype.addWinner = function(c, b) {
	if (this.winnerSource.contains(c)) {
		Feedback.message(loc("This set has already been chosen.") + " " + loc("You can change its ranking by dragging it."))
	} else {
		var a = this.winnerSource.find(c, function(f, d) {
			return f.user_name == d.user_name
		});
		if (a != -1) {
			Feedback.message(loc("Another set from this user ({user_name}) has already been added (no. {place}).", {
				user_name : c.user_name,
				place : a + 1
			}))
		}
		if (b && b._data) {
			this.winnerSource.insertBefore(c, b._data)
		} else {
			this.winnerSource.append(c)
		}
	}
};
ModerateContest.prototype.showEntryTooltip = function(c, b, f) {
	var g = (f.clickUrl = buildURL("set", {
		sid : f.spec_uuid
	}, f.seo_title));
	var d = UI.setListRender(f, {
		size : "l"
	});
	if (f.description) {
		d.appendChild(createNode("li", {
			className : "description"
		}, null, teaser(f.description, 80)))
	}
	d.appendChild(createNode("li", null, null, ["by ", createNode("a", {
		href : buildURL("profile", {
			id : f.user_id,
			name : f.user_name
		}),
		target : "_blank"
	}, null, f.user_name)]));
	var a = addList(d, createNode("a", {
		target : "_blank",
		href : g
	}, null, loc("View details")));
	if (!this.publicVoting || this.isModerator) {
		if (f.state == "active") {
			a = addList(d, createNode("span", {
				className : "clickable",
				id : "rejectit"
			}, null, loc("Reject")));
			Event.addListener(a, "click", function() {
				this.changeEntryState(b, f, "rejected");
				ToolTip.hide()
			}, this)
		} else {
			a = addList(d, createNode("span", {
				className : "clickable",
				id : "approveit"
			}, null, loc("Approve")));
			Event.addListener(a, "click", function() {
				this.changeEntryState(b, f, "active");
				ToolTip.hide()
			}, this)
		}
	}
	a = addList(d, createNode("span", {
		className : "clickable"
	}, null, loc("Make a winner")));
	Event.addListener(a, "click", function() {
		this.addWinner(f);
		ToolTip.hide()
	}, this);
	ToolTip.show(b, d, {
		closeButton : true,
		width : "500px"
	})
};
ModerateContest.prototype.showWinnerTooltip = function(c, b, f) {
	var g = (f.clickUrl = buildURL("set", {
		id : f.collection_id
	}, f.seo_title));
	var d = UI.setListRender(f, {
		size : "l"
	});
	d.appendChild(createNode("li", null, null, ["by ", createNode("a", {
		href : buildURL("profile", {
			id : f.user_id,
			name : f.user_name
		}),
		target : "_blank"
	}, null, f.user_name)]));
	if (f.description) {
		d.appendChild(createNode("li", {
			className : "description"
		}, null, teaser(f.description, 80)))
	}
	var a = addList(d, createNode("a", {
		target : "_blank",
		href : g
	}, null, loc("View details")));
	a = addList(d, createNode("span", {
		className : "clickable"
	}, null, loc("Remove")));
	Event.addListener(a, "click", function() {
		this.winnerSource.remove(f);
		ToolTip.hide()
	}, this);
	ToolTip.show(b, d, {
		closeButton : true,
		width : "500px"
	})
};
ModerateContest.prototype.onDragStart = function(b, a, c) {
	if (hasClass(a, "rejected")) {
		return
	}
	b.xDataTransfer.setData("set", c);
	b.xDataTransfer.proxy = createNode("img", {
		src : buildImgURL("img-set", {
			cid : c.cid,
			spec_uuid : c.spec_uuid,
			size : UI.sizeMap.l2.url,
			".out" : "jpg"
		}),
		width : UI.sizeMap.s2.dim,
		height : UI.sizeMap.s2.dim
	});
	Event.stop(b)
};
ModerateContest.prototype.onResize = function(d) {
	var b = getWindowSize();
	var c = this.results.rect();
	var a = nodeXY(this.winnerBox);
	this.results.resize({
		height : b.h + a.y - c.top() - 30
	})
};
ModerateContest.renderEntry = function(b, a) {
	var c = (b.state != "active" || b.user_id == Auth.userId());
	return UI.setGridRenderAutoSize({
		type : "c",
		id : b.cid,
		spec_uuid : b.spec_uuid,
		".out" : "jpg"
	}, a, {
		tag : "div",
		className : "entry " + ( c ? "rejected" : "")
	})
};
ModerateContest.prototype.changeEntryState = function(a, c, b) {
	Ajax.post({
		action : "contest.moderate",
		data : {
			id : c.id,
			state : b
		},
		onSuccess : function() {
			c.state = b;
			if (b == "rejected") {
				addClass(a, "rejected")
			} else {
				removeClass(a, "rejected")
			}
		}
	})
};
ModerateContest.prototype.onVoteChange = function() {
	var a = this.winnerSource.values();
	var b = 0;
	Ajax.post({
		action : "contest.vote",
		data : {
			id : this.contestId,
			votes : a.map(function(c) {
				return c.id
			})
		},
		onError : function(c) {
			UI.displayAjaxMessages(c.message)
		}
	})
};
var ContestActions = function() {
	var a = [];
	var b = function(c, d) {
		return c.id == d.id
	};
	return {
		getAge : function(d) {
			d = d || {};
			var f = parseInt(d.minAge, 10);
			var j = d.onSuccess || noop;
			var h = d.onCancel || noop;
			var c = createNode("div", null, null, [loc("This contest requires verifying your age"), createNode("br"), loc("Please enter your date of birth to complete your entry."), createNode("br"), createNode("br")]);
			var g = new Form({
				inputs : [{
					label : loc("Date of Birth"),
					type : "dateSelect",
					name : "age",
					required : true
				}, {
					type : "buttons",
					buttons : [{
						label : loc("Enter Contest"),
						type : "submit",
						id : "enterBtn"
					}, {
						label : "Cancel",
						type : "cancel",
						onClick : function() {
							ModalDialog.hide();
							h()
						}
					}]
				}]
			});
			c.appendChild(g.getNode());
			Event.addListener(g, "submit", function(k) {
				var l = g.getData();
				ModalDialog.hide();
				yield(function() {
					j(l)
				});
				return Event.stop(k)
			});
			ModalDialog.show_uic({
				title : loc("Verify Your Age"),
				body : c
			});
			return g
		},
		contestSubmit : function(d, c) {
			if (!d.age) {
				Event.addSingleUseListener(Event.BACKEND, "agerequired", function(f) {
					yield(function() {
						ContestActions.getAge({
							minAge : f.minimum_age,
							onSuccess : function(g) {
								d.age = g.age;
								c.onFinally = c.deferredOnFinally;
								ContestActions.contestSubmit(d, c)
							},
							onCancel : function() {
								if (c.onError && c.deferredError) {
									c.onError(c.deferredError)
								}
								if (c.deferredOnFinally) {
									c.deferredOnFinally()
								}
							}
						})
					})
				})
			}
			Ajax.post({
				data : d,
				busyMsg : loc("Submitting") + "...",
				action : "contest.submit",
				onSuccess : function(f) {
					if (f && f.redirect) {
						window.location = f.redirect;
						return
					}
					if (c.onSuccess) {
						c.onSuccess(f)
					}
				},
				onError : function(f) {
					if (f[".events"] && f[".events"].length) {
						for (var g = 0; g < f[".events"].length; g++) {
							var h = f[".events"][g];
							if (h.length && h[0] == "agerequired") {
								c.deferredOnFinally = c.onFinally;
								c.deferredError = f;
								c.onFinally = null;
								return
							}
						}
					}
					if (c.onError) {
						c.onError(f)
					}
				},
				onFinally : function() {
					if (c.onFinally) {
						c.onFinally()
					}
				}
			})
		},
		setEntries : function(c) {
			a = c
		},
		selectSet : function(g) {
			var h = g.contest_id;
			var f = cloneObject(Selector.TYPES.myset);
			f.multiSelect = true;
			f.okText = loc("Enter Contest");
			var d = [{
				type : "quick_share_compact",
				name : "quickshare",
				listName : "quickshare_list",
				services : g.accounts,
				checked : true,
				inDialog : true
			}];
			f.form = {
				inputs : d,
				data : {}
			};
			var c = new Selector(f);
			Event.addListener(c, "change", function(k, l) {
				var j = k.filter(function(n) {
					return !a.contains(n, b)
				});
				if (j) {
					var m = {
						id : h,
						spec_uuid : j.map(function(n) {
							return n.spec_uuid
						})
					};
					if (l) {
						m.quickshare = l.quickshare;
						m.quickshare_list = l.quickshare_list;
						m.entry_only = true
					}
					ContestActions.contestSubmit(m, {
						onSuccess : function(n) {
							j.forEach(function(o) {
								a.push({
									id : o.id,
									spec_uuid : o.spec_uuid
								})
							});
							Feedback.messageFromResponse(n);
							reloadPage()
						},
						onError : function(n) {
							UI.modalDisplayAjaxMessages(n.message)
						}
					})
				}
			});
			c.show()
		},
		conclude : function(c) {
			ModalDialog.confirm({
				content : loc("You will not be able to change winner selection or moderate entries after concluding this contest.") + " " + loc("Are you sure?"),
				okLabel : loc("Conclude"),
				onOk : function() {
					post("contest.conclude", {
						id : c
					})
				}
			});
			return false
		},
		publish : function(c) {
			post("contest.publish", {
				id : c
			});
			return false
		},
		retract : function(d, c) {
			post("contest.retract", {
				id : d,
				contest_id : c
			});
			return false
		},
		broadcast : function(f, c) {
			c = c || {};
			var d = new Form({
				data : c,
				inputs : [{
					label : loc("Message"),
					type : "textarea",
					name : "message",
					maxlength : 4096
				}, {
					type : "hidden",
					name : "winners_only"
				}, {
					type : "buttons",
					buttons : [{
						label : loc("Send"),
						type : "submit",
						id : "sendBtn"
					}, {
						label : loc("Cancel"),
						type : "cancel",
						onClick : ModalDialog.hide
					}]
				}]
			});
			Event.addListener(d, "submit", function(g) {
				var h = d.getData();
				h.id = f;
				post("contest.broadcast", h);
				return Event.stop(g)
			});
			ModalDialog.show_uic({
				title : loc("Message All Contestants"),
				body : d.getNode()
			});
			return false
		},
		createCarousel : function(c, d) {
			Carousel.create(c, {
				data : new MemDataSource(d),
				renderer : function(g) {
					var f = UI.setRender(g, "m2");
					return createNode("div", {
						className : "left"
					}, null, [createNode("a", {
						href : g.clickurl,
						className : "hoverborder"
					}, null, f), createNode("div", {
						className : "under size_m2 meta"
					}, null, g.text_under)])
				},
				size : 3,
				className : "thin_carousel"
			})
		}
	}
}();
var FindFriends = function() {
	var f = null;
	var c = function() {
		var h = createNode("div", {
			className : "round_cornered services"
		});
		h.appendChild(createNode("center")).appendChild(createNode("span", {
			className : "loading"
		}, null, loc("Loading"), "&hellip;"));
		return h
	};
	var a = function(h, j) {
		var k = new b(h, j);
		ModalDialog.show_uic({
			title : k.title,
			body : k.node
		});
		return k
	};
	var g = function(h) {
		ModalDialog.setContent(c());
		Ajax.get({
			action : "find-friends",
			data : {
				service : h.service
			},
			hideProgress : false,
			onSuccess : function(j) {
				a(h, j);
				return
			},
			onError : function() {
				Feedback.message(loc("An error occurred.") + " " + loc("Please try again later."))
			}
		})
	};
	var d = function(l, j, k) {
		this.trackcontext = "findfriends";
		this.dialog = g;
		Track.stat("inc", this.trackcontext, ["service_dialog"]);
		this.svc = j;
		Event.addListener(Event.BACKEND, "oauth_unconnect", function(q) {
			if (this.svc[q]) {
				this.svc[q].authorized = 0
			}
		}, this);
		Event.addListener(Event.BACKEND, "oauth_connect", function(q) {
			if (this.svc[q.service]) {
				this.svc[q.service].authorized = 1
			}
		}, this);
		var n = createNode("div", {
			className : "services find_and_invite services_dialog",
			trackcontext : this.trackcontext
		});
		var p = loc("Find friends on Polyvore");
		var h = n.appendChild(createNode("div", {
			className : "box"
		}));
		h.appendChild(createNode("div", {
			className : "hd"
		}, null, loc("Look for friends in these networks")));
		var o = createNode("ul", {
			className : "svc_actions grid"
		});
		forEachKey(this.svc, function(r) {
			var q = this.svc[r];
			var s = q.display_name;
			var t = createNode("li", null, null, createNode("span", {
				className : "large_icon clickable " + q.service
			}, null, s));
			Event.addListener(t, "click", function() {
				if (this.svc[r].authorized) {
					Track.stat("inc", this.trackcontext, ["service_dialog", q.service, "authorized"]);
					this.dialog(q)
				} else {
					Track.stat("inc", this.trackcontext, ["service_dialog", q.service, "unauthorized"]);
					if (q.service == "facebook") {
						Facebook.link({
							onSuccess : function() {
							}
						})
					} else {
						var u = openWindow("pv_oauth_" + q.service, buildURL("oauth.flow", {
							service : q.service
						}), 800, 600);
						u.focus()
					}
					Event.addListener(Event.BACKEND, "oauth_connect", function(v) {
						if (v.service == q.service) {
							this.dialog(v)
						}
					}, this)
				}
			}, this);
			o.appendChild(t)
		}, this);
		h.appendChild(createNode("div", {
			className : "bd"
		}, null, o));
		if (k) {
			var m = createNode("div", {
				className : "clickable right"
			}, null, loc("Skip this step") + " &raquo;");
			Event.addListener(m, "click", function() {
				Track.stat("inc", this.trackcontext, ["service_dialog", "skip"]);
				ModalDialog.hide()
			}, this);
			n.appendChild(m)
		}
		this.node = n;
		this.title = p
	};
	var b = function(D, l) {
		this.trackcontext = "findfriends";
		Track.stat("inc", this.trackcontext, ["recos_dialog", D.service]);
		var o = D.service;
		var z = l.contact_recos;
		var h = false;
		var E = l.contact_recos.length;
		if (!l.contact_recos.length) {
			z = l.backfill;
			h = true;
			o = "backfill"
		}
		Track.stat("add", this.trackcontext, ["recos_dialog", o, "num_recos"], z.length);
		var u = createNode("div", {
			className : "find_and_invite",
			trackcontext : this.trackcontext
		});
		var p = {
			service : D.display_name,
			num : z.length
		};
		var k = loc("Find {service} friends on Polyvore", p);
		if (E === 1) {
			k = loc("Found 1 {service} friend on Polyvore", p)
		} else {
			if (E > 1) {
				k = loc("Found {num} {service} friends on Polyvore", p)
			}
		}
		this.title = k;
		var n = createNode("div", {
			className : "find_friends"
		});
		u.appendChild(n);
		var r = createNode("span", {
			className : "clickable btn btn_action"
		}, null, loc("Follow all"));
		if (z.length > 1) {
			n.appendChild(r)
		}
		var C = createNode("table");
		var q = null;
		var s = [];
		var m = {
			stat : {
				context : this.trackcontext,
				params : ["follow", o]
			}
		};
		for (var x = 0; x < z.length; x++) {
			if (x % 2 === 0) {
				q = createNode("tr");
				C.appendChild(q)
			}
			var w = z[x];
			w.user_meta = w.name_on_other_service;
			s.push({
				user_id : w.user_id,
				contact_list_name : w.contact_list_name
			});
			m.contact_list_name = w.contact_list_name;
			if (z.length - x < 2) {
				m.contact_class = "last_row"
			}
			q.appendChild(createNode("td", null, null, UI.renderRecommendedContact(w, m)))
		}
		var B = createNode("div", {
			className : "friends_table"
		});
		if (h) {
			var y = createNode("div", {
				className : "no_recommendations"
			});
			y.appendChild(createNode("h3", null, null, loc("We can't find any new friends right now.")));
			y.appendChild(createNode("h3", null, null, loc("Some recommended Polyvore members:")));
			B.appendChild(y)
		}
		B.appendChild(C);
		var v = createNode("div", null, null, B);
		n.appendChild(v);
		Event.addListener(r, "click", function() {
			Track.stat("inc", this.trackcontext, ["recos_dialog", o, "follow_all"]);
			Ajax.post({
				action : "favorite.add_contacts",
				data : {
					contacts : s,
					service_name : o === "backfill" ? "" : D.display_name
				},
				hideProgress : false,
				onSuccess : function(F) {
					Feedback.messageFromResponse(F);
					FindFriends.servicesDialog()
				},
				onError : function(F) {
					Feedback.message(loc("An error occurred.") + " " + loc("Please try again later."))
				}
			})
		}, this);
		var t = createNode("span", {
			className : "clickable"
		}, null, loc("Find other friends") + " »");
		Event.addListener(t, "click", function() {
			FindFriends.servicesDialog()
		}, this);
		u.appendChild(createNode("ul", {
			className : "actions"
		}, null, createNode("ul", null, null, t)));
		if (!l.discoverable) {
			Track.stat("inc", this.trackcontext, ["show_overlay", o]);
			var A = createNode("div", {
				className : "friends_overlay"
			});
			n.appendChild(A);
			var j = createNode("center", {
				className : "btn btn_action friends_allow_btn"
			}, null, loc("Let friends find me too"));
			n.appendChild(j);
			setNode(t, {
				value : "    " + loc("Skip") + "    "
			});
			Event.addListener(j, "click", function() {
				Track.stat("inc", this.trackcontext, ["accept_overlay", o]);
				n.removeChild(j);
				n.removeChild(A);
				setNode(t, {
					value : "    " + loc("Next") + "    "
				});
				Ajax.post({
					action : "account.update_user_prefs",
					data : {
						discoverable : 1
					},
					hideProgress : true,
					onSuccess : function() {
						return
					}
				})
			}, this)
		}
		this.node = u
	};
	return {
		servicesDialog : function(j, h) {
			Event.trigger(FindFriends, "show");
			var l = c();
			ModalDialog.show_uic(l);
			var k = Auth.getServices(function(m) {
				var n = new d(j, m, h);
				ModalDialog.show_uic({
					title : n.title,
					body : n.node
				})
			}, "contacts");
			Event.addSingleUseListener(ModalDialog, "hide", function() {
				if (k) {
					Ajax.abort(k)
				}
				yield(function() {
					Event.trigger(FindFriends, "done")
				})
			})
		},
		beDiscoverable : function(h, j) {
			show($(h));
			hide($(j));
			Ajax.post({
				action : "account.update_user_prefs",
				data : {
					discoverable : 1
				},
				hideProgress : true,
				onSuccess : function() {
					return
				}
			})
		}
	}
}();
function Selectable(b) {
	var a = (this.result = b.result);
	var c = a.getRenderer();
	a.setRenderer(Event.wrapper(function(f) {
		var d = c.call(this, f);
		f._node = d;
		if (this.isSelected(f)) {
			this.selectedData.replace(f);
			addClass(d, "selected")
		}
		return d
	}, this));
	Event.addListener(a, "click", this.onClick, this);
	this.selectedData = b.selectedData || new MemDataSource();
	a.redraw();
	this.max = b.max;
	this.multiSelect = b.multiSelect
}
Selectable.prototype.onClick = function(b, a, c) {
	if (!this._suspended) {
		this.toggle(c)
	}
	Event.stop(b)
};
Selectable.prototype.suspend = function() {
	this._suspended = true
};
Selectable.prototype.resume = function() {
	this._suspended = false
};
Selectable.prototype.getValue = function() {
	return this.selectedData.values().map(function(b) {
		var a = b._node;
		delete b._node;
		var c = cloneObject(b, true);
		b._node = a;
		return c
	})
};
Selectable.prototype.hasValue = function() {
	return this.selectedData.size() > 0
};
Selectable.prototype.clear = function() {
	this.selectedData.values().forEach(function(a) {
		removeClass(a._node, "selected")
	});
	this.selectedData.clear();
	Event.trigger(this, "change")
};
Selectable.prototype.select = function(a) {
	if (this.max && this.max <= this.selectedData.size() && !this.selectedData.contains(a)) {
		Event.trigger(this, "max");
		return
	}
	if (!this.multiSelect && this.hasValue()) {
		this.clear()
	}
	addClass(a._node, "selected");
	if (!this.selectedData.replace(a)) {
		this.selectedData.append(a)
	}
	Event.trigger(this, "change")
};
Selectable.prototype.selectAll = function() {
	var a = this.result.getSource().values();
	this.selectedData.appendData(a);
	a.forEach(function(b) {
		addClass(b._node, "selected")
	});
	Event.trigger(this, "change")
};
Selectable.prototype.deselect = function(b) {
	var a = this.selectedData.find(b);
	if (a > -1) {
		b = this.selectedData.get(a);
		if (b) {
			this.selectedData.remove(b);
			removeClass(b._node, "selected");
			this.selectedData.remove(b, compare)
		}
	}
	Event.trigger(this, "change")
};
Selectable.prototype.toggle = function(a) {
	if (this.selectedData.contains(a)) {
		this.deselect(a)
	} else {
		this.select(a)
	}
};
Selectable.prototype.isSelected = function(a) {
	return this.selectedData.contains(a)
}; 