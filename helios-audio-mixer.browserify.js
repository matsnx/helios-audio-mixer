!function e(t,n,o){function r(a,s){if(!n[a]){if(!t[a]){var u="function"==typeof require&&require;if(!s&&u)return u(a,!0);if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var p=n[a]={exports:{}};t[a][0].call(p.exports,function(e){var n=t[a][1][e];return r(n?n:e)},p,p.exports,e,t,n,o)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}({1:[function(e,t,n){var o=e("./modules/mix");t.exports=o},{"./modules/mix":5}],2:[function(e,t,n){var o=e("./utils"),r={};t.exports=r,r.level=1,r.log=function(e){if(e<=r.level){for(var t="[Mixer] ",n=1;n<arguments.length;n++)t+=arguments[n]+" ";console.log(t)}},r.setLogLvl=function(e){this.debug=o.constrain(e,0,2),r.log(0,"Set log level:",e)}},{"./utils":8}],3:[function(e,t,n){var o={};o.audioTypes=function(){var e=document.createElement("audio");return{".m4a":!(!e.canPlayType||!e.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/,"")),".mp3":!(!e.canPlayType||!e.canPlayType("audio/mpeg;").replace(/no/,"")),".ogg":!(!e.canPlayType||!e.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/,""))}}(),o.videoTypes=function(){var e=document.createElement("video");return{".webm":!(!e.canPlayType||!e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/,"")),".mp4":!(!e.canPlayType||!e.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,"")),".ogv":!(!e.canPlayType||!e.canPlayType('video/ogg; codecs="theora"').replace(/no/,""))}}(),o.browser=function(){return window.bowser||!1}(),o.tween=function(){return window.TWEEN||!1}(),o.webAudio=function(){var e=!(!window.AudioContext&&!window.webkitAudioContext),t=!!("Firefox"===o.browser.name&&o.version&&o.version<25),n=!(o.browser.ios!==!0||7!==o.browser.version);return(t||n)&&(e=!1),e}(),o.promise=function(){return"Promise"in window&&"resolve"in window.Promise&&"reject"in window.Promise&&"all"in window.Promise}(),o.supported=function(){return o.browser&&o.tween&&o.webAudio&&o.promise}(),t.exports=o},{}],4:[function(e,t,n){var o=function(){function e(e,t){return r[e]=r[e]||[],r[e].push({id:(new Date).getTime(),cb:t}),this}function t(e,t){var n=this;r[e]=r[e]||[];var o=(new Date).getTime(),i=function(){n.off(e,o),t(n)};return r[e].push({id:o,cb:i}),this}function n(e,t){if("*"===e)r={};else if(e&&"undefined"!=typeof t)for(var n=r[e].length-1;n>=0;n--)r[e][n].id===t&&r[e].splice(n,1);else r[e]=[];return this}function o(e){if(r[e]){var t=this,n=Array.prototype.slice.call(arguments,1);r[e].length&&r[e].forEach(function(e){e.cb.apply(t,n)})}}var r={};return{on:e,one:t,off:n,trigger:o}};t.exports=o},{}],5:[function(e,t,n){var o=e("./utils"),r=e("./events"),i=e("./track"),a=e("./track-html5"),s=e("./detect"),u=e("./debug"),c=function(e){function t(){TWEEN.update(),r.tracks.forEach(function(e){e.updateTimelineEvents()})}function n(){for(var e="",t=0;t<r.tracks.length;t++)e+=r.tracks[t].gain()+"	"+r.tracks[t].currentTime()+"	"+r.tracks[t].name+"\n";console.log(e)}var r=this,i={fileTypes:[".mp3",".m4a",".ogg"],html5:!s.webAudio,gain:1};this.options=o.extend(i,e||{}),this.setLogLvl=u.setLogLvl,this.tracks=[],this.lookup={},this.muted=!1,this.context=null,this.detect=s,this.update=t,this.report=n;for(var a=this.options.fileTypes.length-1;a>=0;a--)s.audioTypes[this.options.fileTypes[a]]||this.options.fileTypes.splice(a,1);return this.options.fileTypes.length<=0?void console.warn("Can’t initialize: none of the specified audio types can play in this browser."):(s.webAudio&&(this.context="function"==typeof AudioContext?new window.AudioContext:new window.webkitAudioContext),void u.log(1,"initialized,",s.webAudio?"Web Audio Mode,":"HTML5 Mode,","can play:",this.options.fileTypes))};c.prototype.on=r.on,c.prototype.one=r.one,c.prototype.off=r.off,c.prototype.trigger=r.trigger,c.prototype.createTrack=function(e,t){var n=this;if(!e)throw new Error("Can’t create track with no name");if(n.lookup[e])return u.log(0,"a track named “"+n.name+"” already exists"),!1;var o=n.options.html5?new a(e,t,n):new i(e,t,n);return n.tracks.push(o),n.lookup[e]=o,o},c.prototype.removeTrack=function(e){var t,n=this;"string"==typeof e?t=e:"object"==typeof e&&e.name&&(t=e.name);var o=n.lookup[t];if(!o)return void u.log(1,'can’t remove "'+t+'", it doesn’t exist');for(var r=[],i=n.tracks,a=i.length,s=0;a>s;s++)i[s]&&i[s].name===t&&(r=i.slice(s+1||a),i.length=0>s?a+s:s,i.push.apply(i,r));o.pause(),o.events=[],o.element&&(o.element.src=""),o.trigger("remove",n),o=null,delete n.lookup[t],u.log(2,'Removed track "'+t+'"')},c.prototype.getTrack=function(e){return this.lookup[e]||!1},c.prototype.pause=function(){u.log(2,"Pausing "+this.tracks.length+" track(s) ||");for(var e=0;e<this.tracks.length;e++)this.tracks[e].pause()},c.prototype.play=function(){u.log(2,"Playing "+this.tracks.length+" track(s) >");for(var e=0;e<this.tracks.length;e++)this.tracks[e].play()},c.prototype.stop=function(){u.log(2,"Stopping "+this.tracks.length+" track(s) ."),this.tracks.forEach(function(e){e.stop()})},c.prototype.mute=function(){if(!this.muted){this.muted=!0,u.log(2,"Muting "+this.tracks.length+" tracks");for(var e=0;e<this.tracks.length;e++)this.tracks[e].mute()}},c.prototype.unmute=function(){if(this.muted){this.muted=!1,u.log(2,"Unmuting "+this.tracks.length+" tracks");for(var e=0;e<this.tracks.length;e++)this.tracks[e].unmute()}},c.prototype.gain=function(e){if("number"==typeof e){e=o.constrain(e,0,1),this.options.gain=e;for(var t=0;t<this.tracks.length;t++)this.tracks[t].gain(this.tracks[t].gain())}return this.options.gain},t.exports=c},{"./debug":2,"./detect":3,"./events":4,"./track":7,"./track-html5":6,"./utils":8}],6:[function(e,t,n){function o(){return this}var r=e("./utils"),i=e("./events"),a=(e("./detect"),e("./debug")),s=function(e,t,n){var o=this,i={source:!1,gain:1,start:0,cachedTime:0,startTime:0,looping:!1,autoplay:!0,muted:n.muted?!0:!1};o.options=r.extend(i,t||{}),o.name=e,o.status={loaded:!1,ready:!1,playing:!1},o.mix=n,o.events={},o.tweens={},o.element=void 0,a.log(1,'createTrack "'+o.name+'", mode: "html5", autoplay: '+o.options.autoplay),"string"==typeof o.options.source&&0!==o.options.source.indexOf("blob:")?(o.options.source+=o.mix.options.fileTypes[0],o.element=document.createElement("audio")):"object"==typeof o.options.source&&(o.element=o.options.source,o.source=o.element.src),o.useElement()};s.prototype.on=i.on,s.prototype.one=i.one,s.prototype.off=i.off,s.prototype.trigger=i.trigger,s.prototype.useElement=function(){var e=this;e.options.looping&&(e.element.loop=!0),e.options.muted&&(e.element.muted=!0),e.options.autoplay&&(e.element.autoplay=!0);var t=function(){e.status.loaded=!0,e.options.autoplay&&e.play(),e.trigger("load",e)};e.element.addEventListener("load",t,!1),e.element.addEventListener("canplaythrough",t,!1),e.element.addEventListener("error",function(){e.trigger("loadError")}),e.element.src=e.options.source,e.element.load()},s.prototype.play=function(){var e=this;return a.log(1,'Playing track "'+e.name+'" >'),e.gain(e.options.gain),e.status.ready=!0,e.element.play(),e.trigger("play",e),e},s.prototype.pause=function(e){var t=this;if(t.status.ready&&t.status.playing)return t.element.pause(),a.log(2,'Pausing track "'+t.name+'" at '+t.options.cachedTime),t.trigger("pause",t),t},s.prototype.stop=function(){var e=this;if(e.status.ready&&e.status.playing)return e.element.pause(),e.element.currentTime=0,e.status.playing=!1,e.trigger("stop",e),a.log(2,'Stopping track "'+e.name),e},s.prototype.pan=o,s.prototype.tweenPan=o,s.prototype.gain=function(e){var t=this;return"number"==typeof e?(e=r.constrain(e,0,1),t.element.volume=e*t.mix.options.gain,a.log(2,'"'+t.name+'" setting gain to '+t.options.gain),t.trigger("gain",t.options.gain,t),t):t.element.volume},s.prototype.tweenGain=function(e,t){var n=this;return new Promise(function(o,r){("number"!=typeof e||"number"!=typeof t)&&r(Error("Invalid value for duration.")),a.log(2,'"'+n.name+'" tweening gain '+n.options.gain+" -> "+e+" ("+t+"ms)"),n.tweens.gain&&n.tweens.gain.stop(),n.tweens.gain=new TWEEN.Tween({currentGain:n.options.gain}).to({currentGain:e},t).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function(){n.gain(this.currentGain)}).onComplete(function(){o(n)}).start()})},s.prototype.mute=function(){return this.options.muted=!0,this},s.prototype.unmute=function(){return this.element.muted=!1,this},s.prototype.currentTime=function(e){if(this.status.ready){var t=this;return"number"==typeof e?(a.log(2,'setting track "'+t.name+'" to time',e),t.element.currentTime=e,t):t.element.currentTime}},s.prototype.formattedTime=function(e){return e?r.timeFormat(this.currentTime())+"/"+r.timeFormat(this.duration()):r.timeFormat(this.currentTime())},s.prototype.duration=function(){return this.element.duration||0},t.exports=s},{"./debug":2,"./detect":3,"./events":4,"./utils":8}],7:[function(e,t,n){var o=e("./utils"),r=e("./detect"),i=e("./debug"),a=e("./events"),s=function(e,t,n){function s(){"string"==typeof B.source&&0!==B.source.indexOf("blob:")&&(B.source+=n.options.fileTypes[0]),"object"==typeof B.source&&"readyState"in B.source&&(B.sourceMode="element"),"buffer"===B.sourceMode?p():"element"===B.sourceMode&&("object"==typeof B.source?c():u())}function u(){H.ready=!1;var e=B.source;B.source=document.createElement("audio"),B.source.crossOrigin="",B.source.src=e,c()}function c(){i.log(2,'Track "'+e+'" using HTML5 element source: "'+B.source+'"'),W=B.source,B.source.crossOrigin="",B.source=W.src,B.loop&&(W.loop=!0),B.muted&&(W.muted=!0),z=n.context.createMediaElementSource(W);var t=function(){H.loaded=!0,B.autoplay&&l(),Y.trigger("load",N)};return W.addEventListener("canplaythrough",t),W.addEventListener("error",function(){Y.trigger("loadError",N)}),W.load(),N}function p(t){i.log(2,'Track "'+e+'" webAudio source: "'+B.source+'"');var n=new XMLHttpRequest;n.open("GET",B.source,!0),n.responseType="arraybuffer",n.onreadystatechange=function(o){4===n.readyState&&(200===n.status?(i.log(2,'"'+e+'" loaded "'+B.source+'"'),U=n.response,H.loaded=!0,Y.trigger("load",N),t?l(!0):B.autoplay&&l()):(i.log(1,'couldn’t load track "'+e+'" with source "'+B.source+'"'),Y.trigger("loadError",N,{status:n.status})))},n.send()}function l(e){return!H.loaded||H.playing?N:("buffer"===B.sourceMode?e?d():(H.playing=!1,p(!0)):"element"===B.sourceMode&&f(),N)}function f(){I.length||(h(),W.addEventListener("ended",function(){Y.trigger("ended",N)},!1)),H.ready=!0,Y.trigger("ready",N),B.loop&&(W.loop=!0),M(B.gain),x(B.pan),R=W.currentTime-X;var e=X||0;W.currentTime=e,W.play(),H.playing=!0,Y.trigger("play",N)}function g(){var e=X||0,t=z.buffer.duration-e;j=setTimeout(function(){Y.trigger("ended",N),B.looping&&(bowser&&bowser.chrome&&Math.floor(bowser.version)>=42?(y(),l()):g())},1e3*t)}function d(){H.ready=!1,z=null;var t=function(){h(),H.ready=!0,Y.trigger("ready",N),z.loop=B.loop?!0:!1,M(B.gain),x(B.pan),R=z.context.currentTime-X;var t=X||0;i.log(2,'Playing track (buffer) "'+e+'" from '+t+" ("+R+") gain "+M()),"function"==typeof z.start?z.start(0,t):z.noteOn(t),j&&clearTimeout(j),g.call(),H.playing=!0,Y.trigger("play",N)};if("function"==typeof n.context.createGain)n.context.decodeAudioData(U,function(e){if(!H.ready){z=n.context.createBufferSource();var o=e;z.buffer=o,t()}});else if("function"==typeof n.context.createGainNode){z=n.context.createBufferSource();var o=n.context.createBuffer(U,!0);z.buffer=o,t()}}function m(t){return H.ready&&H.playing?(X="number"==typeof t?t:A(),H.playing=!1,j&&clearTimeout(j),"buffer"===B.sourceMode?"function"==typeof z.stop?z.stop(0):"function"==typeof z.noteOff&&z.noteOff(0):"element"===B.sourceMode&&W.pause(),i.log(2,'Pausing track "'+e+'" at '+X),Y.trigger("pause",N),N):N}function y(){return H.ready&&H.playing?(j&&clearTimeout(j),X=0,R=0,"buffer"===B.sourceMode?"function"==typeof z.stop?z.stop(0):"function"==typeof z.noteOff&&z.noteOff(0):(B.autoplay=!1,W.pause(),W.currentTime=0),H.playing=!1,Y.trigger("stop",N),B.gain=B.gainCache,N):N}function h(){var e={analyze:k,gain:v,panner:w,convolver:b,compressor:T};I={};var t=["panner","gain"].concat(B.nodes||[]),o=z;t.forEach(function(t){if("string"==typeof t&&e[t]){var r=e[t](n.context,o);I[t]=r,o=r}}),o.connect(n.context.destination)}function v(e,t){var n=e.createGainNode?e.createGainNode():e.createGain();return t.connect(n),n}function w(e,t){var n=e.createPanner();return t.connect(n),n}function b(e,t){if(!e.createConvolver)return t;var n=e.createConvolver();return t.connect(n),n}function T(e,t){if(!e.createDynamicsCompressor)return t;var n=e.createDynamicsCompressor();return t.connect(n),n}function k(e,t){var n=e.createScriptProcessor(2048,1,1),o=e.createAnalyser();o.smoothingTimeConstant=.5,o.fftSize=32,n.connect(e.destination),o.connect(n),B.bufferLength=o.frequencyBinCount,analysis={raw:new Uint8Array(o.frequencyBinCount),average:0,low:0,mid:0,high:0};var r=Math.round(B.bufferLength/3),i=0,a=0;t.connect(o),n.onaudioprocess=function(){for(o.getByteFrequencyData(analysis.raw),i=0,a=0;a<B.bufferLength;a++)i+=analysis.raw[a];for(analysis.average=i/B.bufferLength/256,i=0,a=0;r>a;a++)i+=analysis.raw[a];for(analysis.low=i/r/256,i=0,a=r;2*r>a;a++)i+=analysis.raw[a];for(analysis.mid=i/r/256,i=0,a=2*r;a<B.bufferLength;a++)i+=analysis.raw[a];analysis.high=i/r/256,Y.trigger("analyse",analysis)}}function x(e){if(!r.webAudio||!H.ready||!I.panner)return N;if("string"==typeof e&&("front"===e?e=0:"back"===e?e=180:"left"===e?e=270:"right"===e&&(e=90)),"number"==typeof e){B.pan=e%360;var t=.017453292519943295*(-e+90),n=B.panX=Math.cos(t),o=B.panY=Math.sin(t),i=B.panZ=-.5;return I.panner.setPosition(n,o,i),Y.trigger("pan",N),N}return B.pan}function E(e){return"number"==typeof e?(B.gainCache=e,N):B.gainCache}function M(e){return"number"==typeof e?(e=o.constrain(e,0,1),B.muted?(E(e),B.gain=0):B.gain=e,H.playing&&I.gain&&(I.gain.gain.value=B.gain*n.options.gain),Y.trigger("gain",N),N):B.gain}function P(e,t){if("number"!=typeof e||"number"!=typeof t)throw new Error("Invalid arguments to tweenGain()");e=o.constrain(e,.01,1),I.gain.gain.linearRampToValueAtTime(e,z.context.currentTime+t)}function C(){return E(B.gain),M(0),B.muted=!0,"element"===B.sourceMode&&(W.muted=!0),N}function L(){return B.muted=!1,"element"===B.sourceMode&&(W.muted=!1),M(B.gainCache),N}function A(e){return H.ready?"number"==typeof e?("buffer"===B.sourceMode?H.playing?(m(e),l()):X=e:W.currentTime=e,N):H.playing?"buffer"===B.sourceMode?z.context.currentTime-R||0:W.currentTime||0:X||0:0}function O(e){return H.ready?e?o.timeFormat(A())+"/"+o.timeFormat(G()):o.timeFormat(A()):0}function G(){return H.ready?"buffer"===B.sourceMode?z.buffer.duration||0:W.duration||0:0}function S(e){return Z.push({id:(new Date).getTime(),start:e.start,end:e.end,onstart:e.onstart,onend:e.onend,active:e.start?!0:!1}),console.log("added event",Z[Z.length-1]),N}function F(){if(Z.length&&H.playing){var e=A();if(!e)return;Z.forEach(function(t){(t.start||0===t.start)&&e>=t.start&&!t.active&&(t.onstart&&t.onstart.call(null,N),t.active=!0),t.end&&e>=t.end&&t.active&&(t.onend&&t.onend.call(null,N),t.active=!1)})}}function D(e){}var N=this;if(!t.source)throw new Error("Can’t create a track without a source.");var q={sourceMode:"buffer",source:!1,nodes:[],gain:1,gainCache:!1,pan:0,panX:0,panY:0,panZ:0,loop:!1,autoplay:!0,muted:n.muted?!0:!1},B=o.extend(q,t||{});B.gainCache===!1&&(B.gainCache=B.gain);var j,U,W,z,H={loaded:!1,ready:!1,playing:!1,paused:!0},I={},R=0,X=0,Y=new a,Z=[];i.log(2,'createTrack "'+e+'", mode: "'+B.sourceMode+'", autoplay: '+B.autoplay),s(),this.name=e,this.status=H,this.options=B,this.on=Y.on.bind(this),this.one=Y.one.bind(this),this.off=Y.off.bind(this),this.trigger=Y.trigger.bind(this),this.play=l,this.pause=m,this.stop=y,this.pan=x,this.gain=M,this.tweenGain=P,this.currentTime=A,this.formattedTime=O,this.duration=G,this.addEvent=S,this.removeEvent=D,this.updateTimelineEvents=F,this.mute=C,this.unmute=L};t.exports=s},{"./debug":2,"./detect":3,"./events":4,"./utils":8}],8:[function(e,t,n){function o(){for(var e={},t=arguments,n=t.length,o=0;n>o;o++)for(var r in t[o])t[o].hasOwnProperty(r)&&(e[r]=t[o][r]);return e}function r(e,t,n){return t>e?t:e>n?n:e}function i(e){var t=Math.floor(e/60)<10?"0"+Math.floor(e/60):Math.floor(e/60),n=Math.floor(e-60*t)<10?"0"+Math.floor(e-60*t):Math.floor(e-60*t);return t+":"+n}t.exports={extend:o,constrain:r,timeFormat:i}},{}]},{},[1]);