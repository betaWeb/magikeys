parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"WmHK":[function(require,module,exports) {
function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function n(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}var i=function(){function t(n,i){var s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return e(this,t),n.constructor===String&&(n=n.split("")),this.expected=n,this.callback=i,this.options=Object.assign(Object.assign({},t._DEFAULT_OPTIONS),s),this._listened=!1,this._init(),this.run().listen()}return n(t,[{key:"run",value:function(){try{this._getContext().addEventListener(this.options.event_name,this._handler.bind(this))}catch(e){console.error(e)}return this}},{key:"trigger",value:function(){return this.callback(this.expected)}},{key:"destroy",value:function(){try{this._getContext().removeEventListener(this.options.event_name,this._handler.bind(this))}catch(e){console.error(e)}return this}},{key:"listen",value:function(){return this._listened=!0,this}},{key:"mute",value:function(){return this._listened=!1,this}},{key:"isListened",value:function(){return!0===this._listened}},{key:"isMuted",value:function(){return!this.isListened()}},{key:"_init",value:function(){this._sequence=[],this._charCount=0}},{key:"_excluded",value:function(e){var t=this;return!e||this.options.exclude.some(function(n){var i=e.classList,s=e.id,r=e.tagName;return!n||n.startsWith(".")&&i.contains(n)||n.startsWith("#")&&s===n.replace("#","")||/^.+?\[.+\]?$/g.test(n)&&t._getContext().querySelector(n)===e||/^[a-zA-Z]+$/gi.test(n)&&r.toLowerCase()===n.toLowerCase()})}},{key:"_getContext",value:function(){var e=this.options.context;if(e.constructor===String)return document.querySelector(e)||document;var t=e.nodeType;return t&&t===Node.ELEMENT_NODE?e:document}},{key:"_handler",value:function(e){if(!this._excluded(e.target||e.srcElement))if(document.hasFocus()&&this._listened){var t=this.options.num_keys?e.keyCode||e.which:e.key;this._charCount++,this._sequence.push(t),(this._charCount===this.expected.length||this.expected.indexOf(t)<0)&&(JSON.stringify(this._sequence)===JSON.stringify(this.expected)&&this.callback.constructor===Function&&this.trigger(),this._init())}else this._init()}}],[{key:"create",value:function(e,n,i){return new t(e,n,i)}},{key:"_DEFAULT_OPTIONS",get:function(){return{num_keys:!1,event_name:"keyup",exclude:["input","textarea"],context:document,timeout:2e3}}}]),t}();window.Magikeys=i;
},{}]},{},["WmHK"], null)
//# sourceMappingURL=/Magikeys.js.map