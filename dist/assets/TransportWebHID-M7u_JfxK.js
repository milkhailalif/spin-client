import{j as W,T as _,a as p,h as O,S as A,i as Y,e as J,l as Q,g as Z,D as ee,k as N,m as te}from"./index-G9NORyvM.js";import{a as F}from"./index--RL_TStU.js";let $=0;const y=[],z=(o,t,e)=>{const n={type:o,id:String(++$),date:new Date};t&&(n.message=t),e&&(n.data=e),H(n)},ne=({type:o,message:t,data:e,context:n})=>{const i={type:o,id:String(++$),date:new Date};t&&(i.message=t),e&&(i.data=e),n&&(i.context=n),H(i)};class I{constructor(t,e){this.type=t,this.context=e}trace(t,e){ne({type:this.type,message:t,data:e,context:this.context})}getContext(){return this.context}setContext(t){this.context=t}updateContext(t){this.context=Object.assign(Object.assign({},this.context),t)}getType(){return this.type}setType(t){this.type=t}withType(t){return new I(t,this.context)}withContext(t){return new I(this.type,t)}withUpdatedContext(t){return new I(this.type,Object.assign(Object.assign({},this.context),t))}}const re=o=>(y.push(o),()=>{const t=y.indexOf(o);t!==-1&&(y[t]=y[y.length-1],y.pop())});function H(o){for(let t=0;t<y.length;t++)try{y[t](o)}catch(e){console.error(e)}}typeof window<"u"&&(window.__ledgerLogsListen=re);var T=function(o,t,e,n){function i(r){return r instanceof e?r:new e(function(a){a(r)})}return new(e||(e=Promise))(function(r,a){function c(d){try{s(n.next(d))}catch(l){a(l)}}function u(d){try{s(n.throw(d))}catch(l){a(l)}}function s(d){d.done?r(d.value):i(d.value).then(c,u)}s((n=n.apply(o,t||[])).next())})};const ie="transport";class M{constructor({context:t,logType:e}={}){this.exchangeTimeout=3e4,this.unresponsiveTimeout=15e3,this.deviceModel=null,this._events=new W,this.send=(n,i,r,a,c=p.Buffer.alloc(0),u=[A.OK],{abortTimeoutMs:s}={})=>T(this,void 0,void 0,function*(){const d=this.tracer.withUpdatedContext({function:"send"});if(c.length>=256)throw d.trace("data.length exceeded 256 bytes limit",{dataLength:c.length}),new _("data.length exceed 256 bytes limit. Got: "+c.length,"DataLengthTooBig");d.trace("Starting an exchange",{abortTimeoutMs:s});const l=yield this.exchange(p.Buffer.concat([p.Buffer.from([n,i,r,a]),p.Buffer.from([c.length]),c]),{abortTimeoutMs:s});d.trace("Received response from exchange");const v=l.readUInt16BE(l.length-2);if(!u.some(h=>h===v))throw new O(v);return l}),this._appAPIlock=null,this.tracer=new I(e??ie,t)}exchange(t,{abortTimeoutMs:e}={}){throw new Error("exchange not implemented")}exchangeBulk(t,e){let n=!1;const i=()=>{n=!0};return T(this,void 0,void 0,function*(){if(!n)for(const a of t){const c=yield this.exchange(a);if(n)return;const u=c.readUInt16BE(c.length-2);if(u!==A.OK)throw new O(u);e.next(c)}}).then(()=>!n&&e.complete(),a=>!n&&e.error(a)),{unsubscribe:i}}setScrambleKey(t){}close(){return Promise.resolve()}on(t,e){this._events.on(t,e)}off(t,e){this._events.removeListener(t,e)}emit(t,...e){this._events.emit(t,...e)}setDebugMode(){console.warn("setDebugMode is deprecated. use @ledgerhq/logs instead. No logs are emitted in this anymore.")}setExchangeTimeout(t){this.exchangeTimeout=t}setExchangeUnresponsiveTimeout(t){this.unresponsiveTimeout=t}static create(t=3e3,e){return new Promise((n,i)=>{let r=!1;const a=this.listen({next:u=>{r=!0,a&&a.unsubscribe(),c&&clearTimeout(c),this.open(u.descriptor,t).then(n,i)},error:u=>{c&&clearTimeout(c),i(u)},complete:()=>{c&&clearTimeout(c),r||i(new _(this.ErrorMessage_NoDeviceFound,"NoDeviceFound"))}}),c=e?setTimeout(()=>{a.unsubscribe(),i(new _(this.ErrorMessage_ListenTimeout,"ListenTimeout"))},e):null})}exchangeAtomicImpl(t){return T(this,void 0,void 0,function*(){const e=this.tracer.withUpdatedContext({function:"exchangeAtomicImpl"});if(e.trace("Starting an atomic APDU exchange",{unresponsiveTimeout:this.unresponsiveTimeout}),this.exchangeBusyPromise)throw e.trace("Atomic exchange is already busy"),new Y("An action was already pending on the Ledger device. Please deny or reconnect.");let n;const i=new Promise(c=>{n=c});this.exchangeBusyPromise=i;let r=!1;const a=setTimeout(()=>{e.trace('Timeout reached, emitting Transport event "unresponsive"',{unresponsiveTimeout:this.unresponsiveTimeout}),r=!0,this.emit("unresponsive")},this.unresponsiveTimeout);try{const c=yield t();return r&&(e.trace("Device was unresponsive, emitting responsive"),this.emit("responsive")),c}finally{e.trace("Finalize, clearing busy guard"),clearTimeout(a),n&&n(),this.exchangeBusyPromise=null}})}decorateAppAPIMethods(t,e,n){for(const i of e)t[i]=this.decorateAppAPIMethod(i,t[i],t,n)}decorateAppAPIMethod(t,e,n,i){return(...r)=>T(this,void 0,void 0,function*(){const{_appAPIlock:a}=this;if(a)return Promise.reject(new _("Ledger Device is busy (lock "+a+")","TransportLocked"));try{return this._appAPIlock=t,this.setScrambleKey(i),yield e.apply(n,r)}finally{this._appAPIlock=null}})}setTraceContext(t){this.tracer=this.tracer.withContext(t)}updateTraceContext(t){this.tracer.updateContext(t)}getTraceContext(){return this.tracer.getContext()}}M.ErrorMessage_ListenTimeout="No Ledger device found (timeout)";M.ErrorMessage_NoDeviceFound="No Ledger device found";var K={};const oe=J(Q);(function(o){o.__esModule=!0;var t=oe,e=5;function n(a){var c=p.Buffer.alloc(2);return c.writeUInt16BE(a,0),c}var i={data:p.Buffer.alloc(0),dataLength:0,sequence:0},r=function(a,c){return{makeBlocks:function(u){var s=p.Buffer.concat([n(u.length),u]),d=c-5,l=Math.ceil(s.length/d);s=p.Buffer.concat([s,p.Buffer.alloc(l*d-s.length+1).fill(0)]);for(var v=[],h=0;h<l;h++){var g=p.Buffer.alloc(5);g.writeUInt16BE(a,0),g.writeUInt8(e,2),g.writeUInt16BE(h,3);var x=s.slice(h*d,(h+1)*d);v.push(p.Buffer.concat([g,x]))}return v},reduceResponse:function(u,s){var d=u||i,l=d.data,v=d.dataLength,h=d.sequence;if(s.readUInt16BE(0)!==a)throw new t.TransportError("Invalid channel","InvalidChannel");if(s.readUInt8(2)!==e)throw new t.TransportError("Invalid tag","InvalidTag");if(s.readUInt16BE(3)!==h)throw new t.TransportError("Invalid sequence","InvalidSequence");u||(v=s.readUInt16BE(5)),h++;var g=s.slice(u?5:7);return l=p.Buffer.concat([l,g]),l.length>v&&(l=l.slice(0,v)),{data:l,dataLength:v,sequence:h}},getReducedResult:function(u){if(u&&u.dataLength===u.data.length)return u.data}}};o.default=r})(K);const se=Z(K);var P=function(){return P=Object.assign||function(o){for(var t,e=1,n=arguments.length;e<n;e++){t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(o[i]=t[i])}return o},P.apply(this,arguments)},b,f;(function(o){o.blue="blue",o.nanoS="nanoS",o.nanoSP="nanoSP",o.nanoX="nanoX",o.nanoFTS="nanoFTS"})(f||(f={}));var D=(b={},b[f.blue]={id:f.blue,productName:"Ledger Blue",productIdMM:0,legacyUsbProductId:0,usbOnly:!0,memorySize:480*1024,masks:[822083584,822149120],getBlockSize:function(o){return 4*1024}},b[f.nanoS]={id:f.nanoS,productName:"Ledger Nano S",productIdMM:16,legacyUsbProductId:1,usbOnly:!0,memorySize:320*1024,masks:[823132160],getBlockSize:function(o){var t;return F.lt((t=F.coerce(o))!==null&&t!==void 0?t:"","2.0.0")?4*1024:2*1024}},b[f.nanoSP]={id:f.nanoSP,productName:"Ledger Nano S Plus",productIdMM:80,legacyUsbProductId:5,usbOnly:!0,memorySize:1536*1024,masks:[856686592],getBlockSize:function(o){return 32}},b[f.nanoX]={id:f.nanoX,productName:"Ledger Nano X",productIdMM:64,legacyUsbProductId:4,usbOnly:!1,memorySize:2*1024*1024,masks:[855638016],getBlockSize:function(o){return 4*1024},bluetoothSpec:[{serviceUuid:"13d63400-2c97-0004-0000-4c6564676572",notifyUuid:"13d63400-2c97-0004-0001-4c6564676572",writeUuid:"13d63400-2c97-0004-0002-4c6564676572",writeCmdUuid:"13d63400-2c97-0004-0003-4c6564676572"}]},b[f.nanoFTS]={id:f.nanoFTS,productName:"Ledger Nano FTS",productIdMM:96,legacyUsbProductId:6,usbOnly:!1,memorySize:2*1024*1024,masks:[857735168],getBlockSize:function(o){return 4*1024},bluetoothSpec:[{serviceUuid:"13d63400-2c97-6004-0000-4c6564676572",notifyUuid:"13d63400-2c97-6004-0001-4c6564676572",writeUuid:"13d63400-2c97-6004-0002-4c6564676572",writeCmdUuid:"13d63400-2c97-6004-0003-4c6564676572"}]},b);f.blue,f.nanoS,f.nanoSP,f.nanoX,f.nanoFTS;var j=Object.values(D),V=11415,R=function(o){var t=j.find(function(i){return i.legacyUsbProductId===o});if(t)return t;var e=o>>8,n=j.find(function(i){return i.productIdMM===e});return n},ae=[],q={};for(var ce in D){var X=D[ce],k=X.bluetoothSpec;if(k)for(var E=0;E<k.length;E++){var B=k[E];ae.push(B.serviceUuid),q[B.serviceUuid]=q[B.serviceUuid.replace(/-/g,"")]=P({deviceModel:X},B)}}var ue=function(){var o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(n[r]=i[r])},o(t,e)};return function(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");o(t,e);function n(){this.constructor=t}t.prototype=e===null?Object.create(e):(n.prototype=e.prototype,new n)}}(),m=function(o,t,e,n){function i(r){return r instanceof e?r:new e(function(a){a(r)})}return new(e||(e=Promise))(function(r,a){function c(d){try{s(n.next(d))}catch(l){a(l)}}function u(d){try{s(n.throw(d))}catch(l){a(l)}}function s(d){d.done?r(d.value):i(d.value).then(c,u)}s((n=n.apply(o,t||[])).next())})},w=function(o,t){var e={label:0,sent:function(){if(r[0]&1)throw r[1];return r[1]},trys:[],ops:[]},n,i,r,a;return a={next:c(0),throw:c(1),return:c(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function c(s){return function(d){return u([s,d])}}function u(s){if(n)throw new TypeError("Generator is already executing.");for(;e;)try{if(n=1,i&&(r=s[0]&2?i.return:s[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,s[1])).done)return r;switch(i=0,r&&(s=[s[0]&2,r.value]),s[0]){case 0:case 1:r=s;break;case 4:return e.label++,{value:s[1],done:!1};case 5:e.label++,i=s[1],s=[0];continue;case 7:s=e.ops.pop(),e.trys.pop();continue;default:if(r=e.trys,!(r=r.length>0&&r[r.length-1])&&(s[0]===6||s[0]===2)){e=0;continue}if(s[0]===3&&(!r||s[1]>r[0]&&s[1]<r[3])){e.label=s[1];break}if(s[0]===6&&e.label<r[1]){e.label=r[1],r=s;break}if(r&&e.label<r[2]){e.label=r[2],e.ops.push(s);break}r[2]&&e.ops.pop(),e.trys.pop();continue}s=t.call(o,e)}catch(d){s=[6,d],i=0}finally{n=r=0}if(s[0]&5)throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}},de=function(o,t){var e=typeof Symbol=="function"&&o[Symbol.iterator];if(!e)return o;var n=e.call(o),i,r=[],a;try{for(;(t===void 0||t-- >0)&&!(i=n.next()).done;)r.push(i.value)}catch(c){a={error:c}}finally{try{i&&!i.done&&(e=n.return)&&e.call(n)}finally{if(a)throw a.error}}return r},le=[{vendorId:V}],fe=function(){return Promise.resolve(!!(window.navigator&&window.navigator.hid))},U=function(){var o=navigator.hid;if(!o)throw new _("navigator.hid is not supported","HIDNotSupported");return o};function G(){return m(this,void 0,void 0,function(){var o;return w(this,function(t){switch(t.label){case 0:return[4,U().requestDevice({filters:le})];case 1:return o=t.sent(),Array.isArray(o)?[2,o]:[2,[o]]}})})}function L(){return m(this,void 0,void 0,function(){var o;return w(this,function(t){switch(t.label){case 0:return[4,U().getDevices()];case 1:return o=t.sent(),[2,o.filter(function(e){return e.vendorId===V})]}})})}function he(){return m(this,void 0,void 0,function(){var o,t;return w(this,function(e){switch(e.label){case 0:return[4,L()];case 1:return o=e.sent(),o.length>0?[2,o[0]]:[4,G()];case 2:return t=e.sent(),[2,t[0]]}})})}var ge=function(o){ue(t,o);function t(e){var n=o.call(this)||this;return n.channel=Math.floor(Math.random()*65535),n.packetSize=64,n.inputs=[],n.read=function(){return n.inputs.length?Promise.resolve(n.inputs.shift()):new Promise(function(i){n.inputCallback=i})},n.onInputReport=function(i){var r=p.Buffer.from(i.data.buffer);n.inputCallback?(n.inputCallback(r),n.inputCallback=null):n.inputs.push(r)},n._disconnectEmitted=!1,n._emitDisconnect=function(i){n._disconnectEmitted||(n._disconnectEmitted=!0,n.emit("disconnect",i))},n.exchange=function(i){return m(n,void 0,void 0,function(){var r,a=this;return w(this,function(c){switch(c.label){case 0:return[4,this.exchangeAtomicImpl(function(){return m(a,void 0,void 0,function(){var u,s,d,l,v,h,g,x,C;return w(this,function(S){switch(S.label){case 0:u=this,s=u.channel,d=u.packetSize,z("apdu","=> "+i.toString("hex")),l=se(s,d),v=l.makeBlocks(i),h=0,S.label=1;case 1:return h<v.length?[4,this.device.sendReport(0,v[h])]:[3,4];case 2:S.sent(),S.label=3;case 3:return h++,[3,1];case 4:return(g=l.getReducedResult(x))?[3,6]:[4,this.read()];case 5:return C=S.sent(),x=l.reduceResponse(x,C),[3,4];case 6:return z("apdu","<= "+g.toString("hex")),[2,g]}})})}).catch(function(u){throw u&&u.message&&u.message.includes("write")?(a._emitDisconnect(u),new ee(u.message)):u})];case 1:return r=c.sent(),[2,r]}})})},n.device=e,n.deviceModel=typeof e.productId=="number"?R(e.productId):void 0,e.addEventListener("inputreport",n.onInputReport),n}return t.request=function(){return m(this,void 0,void 0,function(){var e,n;return w(this,function(i){switch(i.label){case 0:return[4,G()];case 1:return e=de.apply(void 0,[i.sent(),1]),n=e[0],[2,t.open(n)]}})})},t.openConnected=function(){return m(this,void 0,void 0,function(){var e;return w(this,function(n){switch(n.label){case 0:return[4,L()];case 1:return e=n.sent(),e.length===0?[2,null]:[2,t.open(e[0])]}})})},t.open=function(e){return m(this,void 0,void 0,function(){var n,i;return w(this,function(r){switch(r.label){case 0:return[4,e.open()];case 1:return r.sent(),n=new t(e),i=function(a){e===a.device&&(U().removeEventListener("disconnect",i),n._emitDisconnect(new te))},U().addEventListener("disconnect",i),[2,n]}})})},t.prototype.close=function(){return m(this,void 0,void 0,function(){return w(this,function(e){switch(e.label){case 0:return[4,this.exchangeBusyPromise];case 1:return e.sent(),this.device.removeEventListener("inputreport",this.onInputReport),[4,this.device.close()];case 2:return e.sent(),[2]}})})},t.prototype.setScrambleKey=function(){},t.isSupported=fe,t.list=L,t.listen=function(e){var n=!1;he().then(function(r){if(!r)e.error(new N("Access denied to use Ledger device"));else if(!n){var a=typeof r.productId=="number"?R(r.productId):void 0;e.next({type:"add",descriptor:r,deviceModel:a}),e.complete()}},function(r){e.error(new N(r.message))});function i(){n=!0}return{unsubscribe:i}},t}(M);export{ge as default};