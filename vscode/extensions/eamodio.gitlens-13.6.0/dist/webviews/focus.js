var e={d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};void 0!==e&&Object.defineProperty(e,"p",{get:function(){try{if("string"!=typeof webpackResourceBasePath)throw new Error("WebpackRequireFrom: 'webpackResourceBasePath' is not a string or not available at runtime. See https://github.com/agoldis/webpack-require-from#troubleshooting");return webpackResourceBasePath}catch(e){return"#{root}/dist/webviews/"}},set:function(e){}});var t={};e.d(t,{S:()=>As});const o=function(){if("undefined"!=typeof globalThis)return globalThis;if("undefined"!=typeof global)return global;if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;try{return new Function("return this")()}catch(e){return{}}}();void 0===o.trustedTypes&&(o.trustedTypes={createPolicy:(e,t)=>t});const n={configurable:!1,enumerable:!1,writable:!1};void 0===o.FAST&&Reflect.defineProperty(o,"FAST",Object.assign({value:Object.create(null)},n));const r=o.FAST;if(void 0===r.getById){const e=Object.create(null);Reflect.defineProperty(r,"getById",Object.assign({value(t,o){let n=e[t];return void 0===n&&(n=o?e[t]=o():null),n}},n))}const s=Object.freeze([]);function i(){const e=new WeakMap;return function(t){let o=e.get(t);if(void 0===o){let n=Reflect.getPrototypeOf(t);for(;void 0===o&&null!==n;)o=e.get(n),n=Reflect.getPrototypeOf(n);o=void 0===o?[]:o.slice(0),e.set(t,o)}return o}}const a=o.FAST.getById(1,(()=>{const e=[],t=[];function n(){if(t.length)throw t.shift()}function r(e){try{e.call()}catch(e){t.push(e),setTimeout(n,0)}}function s(){let t=0;for(;t<e.length;)if(r(e[t]),t++,t>1024){for(let o=0,n=e.length-t;o<n;o++)e[o]=e[o+t];e.length-=t,t=0}e.length=0}return Object.freeze({enqueue:function(t){e.length<1&&o.requestAnimationFrame(s),e.push(t)},process:s})})),c=o.trustedTypes.createPolicy("fast-html",{createHTML:e=>e});let l=c;const h=`fast-${Math.random().toString(36).substring(2,8)}`,d=`${h}{`,u=`}${h}`,f=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(e){if(l!==c)throw new Error("The HTML policy can only be set once.");l=e},createHTML:e=>l.createHTML(e),isMarker:e=>e&&8===e.nodeType&&e.data.startsWith(h),extractDirectiveIndexFromMarker:e=>parseInt(e.data.replace(`${h}:`,"")),createInterpolationPlaceholder:e=>`${d}${e}${u}`,createCustomAttributePlaceholder(e,t){return`${e}="${this.createInterpolationPlaceholder(t)}"`},createBlockPlaceholder:e=>`\x3c!--${h}:${e}--\x3e`,queueUpdate:a.enqueue,processUpdates:a.process,nextUpdate:()=>new Promise(a.enqueue),setAttribute(e,t,o){null==o?e.removeAttribute(t):e.setAttribute(t,o)},setBooleanAttribute(e,t,o){o?e.setAttribute(t,""):e.removeAttribute(t)},removeChildNodes(e){for(let t=e.firstChild;null!==t;t=e.firstChild)e.removeChild(t)},createTemplateWalker:e=>document.createTreeWalker(e,133,null,!1)});class b{constructor(e,t){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=e,this.sub1=t}has(e){return void 0===this.spillover?this.sub1===e||this.sub2===e:-1!==this.spillover.indexOf(e)}subscribe(e){const t=this.spillover;if(void 0===t){if(this.has(e))return;if(void 0===this.sub1)return void(this.sub1=e);if(void 0===this.sub2)return void(this.sub2=e);this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else{-1===t.indexOf(e)&&t.push(e)}}unsubscribe(e){const t=this.spillover;if(void 0===t)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{const o=t.indexOf(e);-1!==o&&t.splice(o,1)}}notify(e){const t=this.spillover,o=this.source;if(void 0===t){const t=this.sub1,n=this.sub2;void 0!==t&&t.handleChange(o,e),void 0!==n&&n.handleChange(o,e)}else for(let n=0,r=t.length;n<r;++n)t[n].handleChange(o,e)}}class p{constructor(e){this.subscribers={},this.sourceSubscribers=null,this.source=e}notify(e){var t;const o=this.subscribers[e];void 0!==o&&o.notify(e),null===(t=this.sourceSubscribers)||void 0===t||t.notify(e)}subscribe(e,t){var o;if(t){let o=this.subscribers[t];void 0===o&&(this.subscribers[t]=o=new b(this.source)),o.subscribe(e)}else this.sourceSubscribers=null!==(o=this.sourceSubscribers)&&void 0!==o?o:new b(this.source),this.sourceSubscribers.subscribe(e)}unsubscribe(e,t){var o;if(t){const o=this.subscribers[t];void 0!==o&&o.unsubscribe(e)}else null===(o=this.sourceSubscribers)||void 0===o||o.unsubscribe(e)}}const g=r.getById(2,(()=>{const e=/(:|&&|\|\||if)/,t=new WeakMap,o=f.queueUpdate;let n,r=e=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function s(e){let o=e.$fastController||t.get(e);return void 0===o&&(Array.isArray(e)?o=r(e):t.set(e,o=new p(e))),o}const a=i();class c{constructor(e){this.name=e,this.field=`_${e}`,this.callback=`${e}Changed`}getValue(e){return void 0!==n&&n.watch(e,this.name),e[this.field]}setValue(e,t){const o=this.field,n=e[o];if(n!==t){e[o]=t;const r=e[this.callback];"function"==typeof r&&r.call(e,n,t),s(e).notify(this.name)}}}class l extends b{constructor(e,t,o=!1){super(e,t),this.binding=e,this.isVolatileBinding=o,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(e,t){this.needsRefresh&&null!==this.last&&this.disconnect();const o=n;n=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;const r=this.binding(e,t);return n=o,r}disconnect(){if(null!==this.last){let e=this.first;for(;void 0!==e;)e.notifier.unsubscribe(this,e.propertyName),e=e.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(e,t){const o=this.last,r=s(e),i=null===o?this.first:{};if(i.propertySource=e,i.propertyName=t,i.notifier=r,r.subscribe(this,t),null!==o){if(!this.needsRefresh){let t;n=void 0,t=o.propertySource[o.propertyName],n=this,e===t&&(this.needsRefresh=!0)}o.next=i}this.last=i}handleChange(){this.needsQueue&&(this.needsQueue=!1,o(this))}call(){null!==this.last&&(this.needsQueue=!0,this.notify(this))}records(){let e=this.first;return{next:()=>{const t=e;return void 0===t?{value:void 0,done:!0}:(e=e.next,{value:t,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(e){r=e},getNotifier:s,track(e,t){void 0!==n&&n.watch(e,t)},trackVolatile(){void 0!==n&&(n.needsRefresh=!0)},notify(e,t){s(e).notify(t)},defineProperty(e,t){"string"==typeof t&&(t=new c(t)),a(e).push(t),Reflect.defineProperty(e,t.name,{enumerable:!0,get:function(){return t.getValue(this)},set:function(e){t.setValue(this,e)}})},getAccessors:a,binding(e,t,o=this.isVolatileBinding(e)){return new l(e,t,o)},isVolatileBinding:t=>e.test(t.toString())})}));function m(e,t){g.defineProperty(e,t)}function v(e,t,o){return Object.assign({},o,{get:function(){return g.trackVolatile(),o.get.apply(this)}})}const y=r.getById(3,(()=>{let e=null;return{get:()=>e,set(t){e=t}}}));class w{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return y.get()}get isEven(){return this.index%2==0}get isOdd(){return this.index%2!=0}get isFirst(){return 0===this.index}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(e){y.set(e)}}g.defineProperty(w.prototype,"index"),g.defineProperty(w.prototype,"length");const C=Object.seal(new w);class k{constructor(){this.targets=new WeakSet}addStylesTo(e){this.targets.add(e)}removeStylesFrom(e){this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withBehaviors(...e){return this.behaviors=null===this.behaviors?e:this.behaviors.concat(e),this}}function x(e){return e.map((e=>e instanceof k?x(e.styles):[e])).reduce(((e,t)=>e.concat(t)),[])}function $(e){return e.map((e=>e instanceof k?e.behaviors:null)).reduce(((e,t)=>null===t?e:(null===e&&(e=[]),e.concat(t))),null)}k.create=(()=>{if(f.supportsAdoptedStyleSheets){const e=new Map;return t=>new O(t,e)}return e=>new D(e)})();let P=(e,t)=>{e.adoptedStyleSheets=[...e.adoptedStyleSheets,...t]},S=(e,t)=>{e.adoptedStyleSheets=e.adoptedStyleSheets.filter((e=>-1===t.indexOf(e)))};if(f.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),P=(e,t)=>{e.adoptedStyleSheets.push(...t)},S=(e,t)=>{for(const o of t){const t=e.adoptedStyleSheets.indexOf(o);-1!==t&&e.adoptedStyleSheets.splice(t,1)}}}catch(e){}class O extends k{constructor(e,t){super(),this.styles=e,this.styleSheetCache=t,this._styleSheets=void 0,this.behaviors=$(e)}get styleSheets(){if(void 0===this._styleSheets){const e=this.styles,t=this.styleSheetCache;this._styleSheets=x(e).map((e=>{if(e instanceof CSSStyleSheet)return e;let o=t.get(e);return void 0===o&&(o=new CSSStyleSheet,o.replaceSync(e),t.set(e,o)),o}))}return this._styleSheets}addStylesTo(e){P(e,this.styleSheets),super.addStylesTo(e)}removeStylesFrom(e){S(e,this.styleSheets),super.removeStylesFrom(e)}}let R=0;class D extends k{constructor(e){super(),this.styles=e,this.behaviors=null,this.behaviors=$(e),this.styleSheets=x(e),this.styleClass="fast-style-class-"+ ++R}addStylesTo(e){const t=this.styleSheets,o=this.styleClass;e=this.normalizeTarget(e);for(let n=0;n<t.length;n++){const r=document.createElement("style");r.innerHTML=t[n],r.className=o,e.append(r)}super.addStylesTo(e)}removeStylesFrom(e){const t=(e=this.normalizeTarget(e)).querySelectorAll(`.${this.styleClass}`);for(let o=0,n=t.length;o<n;++o)e.removeChild(t[o]);super.removeStylesFrom(e)}isAttachedTo(e){return super.isAttachedTo(this.normalizeTarget(e))}normalizeTarget(e){return e===document?document.body:e}}const T=Object.freeze({locate:i()}),A={toView:e=>e?"true":"false",fromView:e=>null!=e&&"false"!==e&&!1!==e&&0!==e};class B{constructor(e,t,o=t.toLowerCase(),n="reflect",r){this.guards=new Set,this.Owner=e,this.name=t,this.attribute=o,this.mode=n,this.converter=r,this.fieldName=`_${t}`,this.callbackName=`${t}Changed`,this.hasCallback=this.callbackName in e.prototype,"boolean"===n&&void 0===r&&(this.converter=A)}setValue(e,t){const o=e[this.fieldName],n=this.converter;void 0!==n&&(t=n.fromView(t)),o!==t&&(e[this.fieldName]=t,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](o,t),e.$fastController.notify(this.name))}getValue(e){return g.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,t){this.guards.has(e)||(this.guards.add(e),this.setValue(e,t),this.guards.delete(e))}tryReflectToAttribute(e){const t=this.mode,o=this.guards;o.has(e)||"fromView"===t||f.queueUpdate((()=>{o.add(e);const n=e[this.fieldName];switch(t){case"reflect":const t=this.converter;f.setAttribute(e,this.attribute,void 0!==t?t.toView(n):n);break;case"boolean":f.setBooleanAttribute(e,this.attribute,n)}o.delete(e)}))}static collect(e,...t){const o=[];t.push(T.locate(e));for(let n=0,r=t.length;n<r;++n){const r=t[n];if(void 0!==r)for(let t=0,n=r.length;t<n;++t){const n=r[t];"string"==typeof n?o.push(new B(e,n)):o.push(new B(e,n.property,n.attribute,n.mode,n.converter))}}return o}}function I(e,t){let o;function n(e,t){arguments.length>1&&(o.property=t),T.locate(e.constructor).push(o)}return arguments.length>1?(o={},void n(e,t)):(o=void 0===e?{}:e,n)}const L={mode:"open"},E={},F=r.getById(4,(()=>{const e=new Map;return Object.freeze({register:t=>!e.has(t.type)&&(e.set(t.type,t),!0),getByType:t=>e.get(t)})}));class M{constructor(e,t=e.definition){"string"==typeof t&&(t={name:t}),this.type=e,this.name=t.name,this.template=t.template;const o=B.collect(e,t.attributes),n=new Array(o.length),r={},s={};for(let e=0,t=o.length;e<t;++e){const t=o[e];n[e]=t.attribute,r[t.name]=t,s[t.attribute]=t}this.attributes=o,this.observedAttributes=n,this.propertyLookup=r,this.attributeLookup=s,this.shadowOptions=void 0===t.shadowOptions?L:null===t.shadowOptions?void 0:Object.assign(Object.assign({},L),t.shadowOptions),this.elementOptions=void 0===t.elementOptions?E:Object.assign(Object.assign({},E),t.elementOptions),this.styles=void 0===t.styles?void 0:Array.isArray(t.styles)?k.create(t.styles):t.styles instanceof k?t.styles:k.create([t.styles])}get isDefined(){return!!F.getByType(this.type)}define(e=customElements){const t=this.type;if(F.register(this)){const e=this.attributes,o=t.prototype;for(let t=0,n=e.length;t<n;++t)g.defineProperty(o,e[t]);Reflect.defineProperty(t,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return e.get(this.name)||e.define(this.name,t,this.elementOptions),this}}M.forType=F.getByType;function q(e,t,o,n){var r,s=arguments.length,i=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(i=(s<3?r(i):s>3?r(t,o,i):r(t,o))||i);return s>3&&i&&Object.defineProperty(t,o,i),i}Object.create;Object.create;const _=new WeakMap,V={bubbles:!0,composed:!0,cancelable:!0};function N(e){return e.shadowRoot||_.get(e)||null}class z extends p{constructor(e,t){super(e),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=e,this.definition=t;const o=t.shadowOptions;if(void 0!==o){const t=e.attachShadow(o);"closed"===o.mode&&_.set(e,t)}const n=g.getAccessors(e);if(n.length>0){const t=this.boundObservables=Object.create(null);for(let o=0,r=n.length;o<r;++o){const r=n[o].name,s=e[r];void 0!==s&&(delete e[r],t[r]=s)}}}get isConnected(){return g.track(this,"isConnected"),this._isConnected}setIsConnected(e){this._isConnected=e,g.notify(this,"isConnected")}get template(){return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get styles(){return this._styles}set styles(e){this._styles!==e&&(null!==this._styles&&this.removeStyles(this._styles),this._styles=e,this.needsInitialization||null===e||this.addStyles(e))}addStyles(e){const t=N(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.append(e);else if(!e.isAttachedTo(t)){const o=e.behaviors;e.addStylesTo(t),null!==o&&this.addBehaviors(o)}}removeStyles(e){const t=N(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.removeChild(e);else if(e.isAttachedTo(t)){const o=e.behaviors;e.removeStylesFrom(t),null!==o&&this.removeBehaviors(o)}}addBehaviors(e){const t=this.behaviors||(this.behaviors=new Map),o=e.length,n=[];for(let r=0;r<o;++r){const o=e[r];t.has(o)?t.set(o,t.get(o)+1):(t.set(o,1),n.push(o))}if(this._isConnected){const e=this.element;for(let t=0;t<n.length;++t)n[t].bind(e,C)}}removeBehaviors(e,t=!1){const o=this.behaviors;if(null===o)return;const n=e.length,r=[];for(let s=0;s<n;++s){const n=e[s];if(o.has(n)){const e=o.get(n)-1;0===e||t?o.delete(n)&&r.push(n):o.set(n,e)}}if(this._isConnected){const e=this.element;for(let t=0;t<r.length;++t)r[t].unbind(e)}}onConnectedCallback(){if(this._isConnected)return;const e=this.element;this.needsInitialization?this.finishInitialization():null!==this.view&&this.view.bind(e,C);const t=this.behaviors;if(null!==t)for(const[o]of t)o.bind(e,C);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);const e=this.view;null!==e&&e.unbind();const t=this.behaviors;if(null!==t){const e=this.element;for(const[o]of t)o.unbind(e)}}onAttributeChangedCallback(e,t,o){const n=this.definition.attributeLookup[e];void 0!==n&&n.onAttributeChangedCallback(this.element,o)}emit(e,t,o){return!!this._isConnected&&this.element.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:t},V),o)))}finishInitialization(){const e=this.element,t=this.boundObservables;if(null!==t){const o=Object.keys(t);for(let n=0,r=o.length;n<r;++n){const r=o[n];e[r]=t[r]}this.boundObservables=null}const o=this.definition;null===this._template&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():o.template&&(this._template=o.template||null)),null!==this._template&&this.renderTemplate(this._template),null===this._styles&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():o.styles&&(this._styles=o.styles||null)),null!==this._styles&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(e){const t=this.element,o=N(t)||t;null!==this.view?(this.view.dispose(),this.view=null):this.needsInitialization||f.removeChildNodes(o),e&&(this.view=e.render(t,o,t))}static forCustomElement(e){const t=e.$fastController;if(void 0!==t)return t;const o=M.forType(e.constructor);if(void 0===o)throw new Error("Missing FASTElement definition.");return e.$fastController=new z(e,o)}}function j(e){return class extends e{constructor(){super(),z.forCustomElement(this)}$emit(e,t,o){return this.$fastController.emit(e,t,o)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(e,t,o){this.$fastController.onAttributeChangedCallback(e,t,o)}}}const U=Object.assign(j(HTMLElement),{from:e=>j(e),define:(e,t)=>new M(e,t).define().type});function H(e){return function(t){new M(t,e).define()}}const W=new Map;"metadata"in Reflect||(Reflect.metadata=function(e,t){return function(o){Reflect.defineMetadata(e,t,o)}},Reflect.defineMetadata=function(e,t,o){let n=W.get(o);void 0===n&&W.set(o,n=new Map),n.set(e,t)},Reflect.getOwnMetadata=function(e,t){const o=W.get(t);if(void 0!==o)return o.get(e)});class G{constructor(e,t){this.container=e,this.key=t}instance(e){return this.registerResolver(0,e)}singleton(e){return this.registerResolver(1,e)}transient(e){return this.registerResolver(2,e)}callback(e){return this.registerResolver(3,e)}cachedCallback(e){return this.registerResolver(3,ye(e))}aliasTo(e){return this.registerResolver(5,e)}registerResolver(e,t){const{container:o,key:n}=this;return this.container=this.key=void 0,o.registerResolver(n,new ae(n,e,t))}}function Q(e){const t=e.slice(),o=Object.keys(e),n=o.length;let r;for(let s=0;s<n;++s)r=o[s],Oe(r)||(t[r]=e[r]);return t}const Y=Object.freeze({none(e){throw Error(`${e.toString()} not registered, did you forget to add @singleton()?`)},singleton:e=>new ae(e,1,e),transient:e=>new ae(e,2,e)}),K=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:Y.singleton})}),Z=new Map;function J(e){return t=>Reflect.getOwnMetadata(e,t)}let X=null;const ee=Object.freeze({createContainer:e=>new me(null,Object.assign({},K.default,e)),findResponsibleContainer(e){const t=e.$$container$$;return t&&t.responsibleForOwnerRequests?t:ee.findParentContainer(e)},findParentContainer(e){const t=new CustomEvent(pe,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return e.dispatchEvent(t),t.detail.container||ee.getOrCreateDOMContainer()},getOrCreateDOMContainer:(e,t)=>e?e.$$container$$||new me(e,Object.assign({},K.default,t,{parentLocator:ee.findParentContainer})):X||(X=new me(null,Object.assign({},K.default,t,{parentLocator:()=>null}))),getDesignParamtypes:J("design:paramtypes"),getAnnotationParamtypes:J("di:paramtypes"),getOrCreateAnnotationParamTypes(e){let t=this.getAnnotationParamtypes(e);return void 0===t&&Reflect.defineMetadata("di:paramtypes",t=[],e),t},getDependencies(e){let t=Z.get(e);if(void 0===t){const o=e.inject;if(void 0===o){const o=ee.getDesignParamtypes(e),n=ee.getAnnotationParamtypes(e);if(void 0===o)if(void 0===n){const o=Object.getPrototypeOf(e);t="function"==typeof o&&o!==Function.prototype?Q(ee.getDependencies(o)):[]}else t=Q(n);else if(void 0===n)t=Q(o);else{t=Q(o);let e,r=n.length;for(let o=0;o<r;++o)e=n[o],void 0!==e&&(t[o]=e);const s=Object.keys(n);let i;r=s.length;for(let e=0;e<r;++e)i=s[e],Oe(i)||(t[i]=n[i])}}else t=Q(o);Z.set(e,t)}return t},defineProperty(e,t,o,n=!1){const r=`$di_${t}`;Reflect.defineProperty(e,t,{get:function(){let e=this[r];if(void 0===e){const s=this instanceof HTMLElement?ee.findResponsibleContainer(this):ee.getOrCreateDOMContainer();if(e=s.get(o),this[r]=e,n&&this instanceof U){const n=this.$fastController,s=()=>{ee.findResponsibleContainer(this).get(o)!==this[r]&&(this[r]=e,n.notify(t))};n.subscribe({handleChange:s},"isConnected")}}return e}})},createInterface(e,t){const o="function"==typeof e?e:t,n="string"==typeof e?e:e&&"friendlyName"in e&&e.friendlyName||xe,r="string"!=typeof e&&(e&&"respectConnection"in e&&e.respectConnection||!1),s=function(e,t,o){if(null==e||void 0!==new.target)throw new Error(`No registration for interface: '${s.friendlyName}'`);if(t)ee.defineProperty(e,t,s,r);else{ee.getOrCreateAnnotationParamTypes(e)[o]=s}};return s.$isInterface=!0,s.friendlyName=n??"(anonymous)",null!=o&&(s.register=function(e,t){return o(new G(e,null!=t?t:s))}),s.toString=function(){return`InterfaceSymbol<${s.friendlyName}>`},s},inject:(...e)=>function(t,o,n){if("number"==typeof n){const o=ee.getOrCreateAnnotationParamTypes(t),r=e[0];void 0!==r&&(o[n]=r)}else if(o)ee.defineProperty(t,o,e[0]);else{const o=n?ee.getOrCreateAnnotationParamTypes(n.value):ee.getOrCreateAnnotationParamTypes(t);let r;for(let t=0;t<e.length;++t)r=e[t],void 0!==r&&(o[t]=r)}},transient:e=>(e.register=function(t){return we.transient(e,e).register(t)},e.registerInRequestor=!1,e),singleton:(e,t=ne)=>(e.register=function(t){return we.singleton(e,e).register(t)},e.registerInRequestor=t.scoped,e)}),te=ee.createInterface("Container");function oe(e){return function(t){const o=function(e,t,n){ee.inject(o)(e,t,n)};return o.$isResolver=!0,o.resolve=function(o,n){return e(t,o,n)},o}}ee.inject;const ne={scoped:!1};re=(e,t,o,n)=>o.getAll(e,n);var re;oe(((e,t,o)=>()=>o.get(e))),oe(((e,t,o)=>o.has(e,!0)?o.get(e):void 0));function se(e,t,o){ee.inject(se)(e,t,o)}se.$isResolver=!0,se.resolve=()=>{};oe(((e,t,o)=>{const n=ie(e,t),r=new ae(e,0,n);return o.registerResolver(e,r),n})),oe(((e,t,o)=>ie(e,t)));function ie(e,t){return t.getFactory(e).construct(t)}class ae{constructor(e,t,o){this.key=e,this.strategy=t,this.state=o,this.resolving=!1}get $isResolver(){return!0}register(e){return e.registerResolver(this.key,this)}resolve(e,t){switch(this.strategy){case 0:return this.state;case 1:if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=e.getFactory(this.state).construct(t),this.strategy=0,this.resolving=!1,this.state;case 2:{const o=e.getFactory(this.state);if(null===o)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return o.construct(t)}case 3:return this.state(e,t,this);case 4:return this.state[0].resolve(e,t);case 5:return t.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(e){var t,o,n;switch(this.strategy){case 1:case 2:return e.getFactory(this.state);case 5:return null!==(n=null===(o=null===(t=e.getResolver(this.state))||void 0===t?void 0:t.getFactory)||void 0===o?void 0:o.call(t,e))&&void 0!==n?n:null;default:return null}}}function ce(e){return this.get(e)}function le(e,t){return t(e)}class he{constructor(e,t){this.Type=e,this.dependencies=t,this.transformers=null}construct(e,t){let o;return o=void 0===t?new this.Type(...this.dependencies.map(ce,e)):new this.Type(...this.dependencies.map(ce,e),...t),null==this.transformers?o:this.transformers.reduce(le,o)}registerTransformer(e){(this.transformers||(this.transformers=[])).push(e)}}const de={$isResolver:!0,resolve:(e,t)=>t};function ue(e){return"function"==typeof e.register}function fe(e){return function(e){return ue(e)&&"boolean"==typeof e.registerInRequestor}(e)&&e.registerInRequestor}const be=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),pe="__DI_LOCATE_PARENT__",ge=new Map;class me{constructor(e,t){this.owner=e,this.config=t,this._parent=void 0,this.registerDepth=0,this.context=null,null!==e&&(e.$$container$$=this),this.resolvers=new Map,this.resolvers.set(te,de),e instanceof Node&&e.addEventListener(pe,(e=>{e.composedPath()[0]!==this.owner&&(e.detail.container=this,e.stopImmediatePropagation())}))}get parent(){return void 0===this._parent&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return null===this.parent?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(e,...t){return this.context=e,this.register(...t),this.context=null,this}register(...e){if(100==++this.registerDepth)throw new Error("Unable to autoregister dependency");let t,o,n,r,s;const i=this.context;for(let a=0,c=e.length;a<c;++a)if(t=e[a],$e(t))if(ue(t))t.register(this,i);else if(void 0!==t.prototype)we.singleton(t,t).register(this);else for(o=Object.keys(t),r=0,s=o.length;r<s;++r)n=t[o[r]],$e(n)&&(ue(n)?n.register(this,i):this.register(n));return--this.registerDepth,this}registerResolver(e,t){Ce(e);const o=this.resolvers,n=o.get(e);return null==n?o.set(e,t):n instanceof ae&&4===n.strategy?n.state.push(t):o.set(e,new ae(e,4,[n,t])),t}registerTransformer(e,t){const o=this.getResolver(e);if(null==o)return!1;if(o.getFactory){const e=o.getFactory(this);return null!=e&&(e.registerTransformer(t),!0)}return!1}getResolver(e,t=!0){if(Ce(e),void 0!==e.resolve)return e;let o,n=this;for(;null!=n;){if(o=n.resolvers.get(e),null!=o)return o;if(null==n.parent){const o=fe(e)?this:n;return t?this.jitRegister(e,o):null}n=n.parent}return null}has(e,t=!1){return!!this.resolvers.has(e)||!(!t||null==this.parent)&&this.parent.has(e,!0)}get(e){if(Ce(e),e.$isResolver)return e.resolve(this,this);let t,o=this;for(;null!=o;){if(t=o.resolvers.get(e),null!=t)return t.resolve(o,this);if(null==o.parent){const n=fe(e)?this:o;return t=this.jitRegister(e,n),t.resolve(o,this)}o=o.parent}throw new Error(`Unable to resolve key: ${e}`)}getAll(e,t=!1){Ce(e);const o=this;let n,r=o;if(t){let t=s;for(;null!=r;)n=r.resolvers.get(e),null!=n&&(t=t.concat(ke(n,r,o))),r=r.parent;return t}for(;null!=r;){if(n=r.resolvers.get(e),null!=n)return ke(n,r,o);if(r=r.parent,null==r)return s}return s}getFactory(e){let t=ge.get(e);if(void 0===t){if(Pe(e))throw new Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);ge.set(e,t=new he(e,ee.getDependencies(e)))}return t}registerFactory(e,t){ge.set(e,t)}createChild(e){return new me(null,Object.assign({},this.config,e,{parentLocator:()=>this}))}jitRegister(e,t){if("function"!=typeof e)throw new Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);if(be.has(e.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);if(ue(e)){const o=e.register(t);if(!(o instanceof Object)||null==o.resolve){const o=t.resolvers.get(e);if(null!=o)return o;throw new Error("A valid resolver was not returned from the static register method")}return o}if(e.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);{const o=this.config.defaultResolver(e,t);return t.resolvers.set(e,o),o}}}const ve=new WeakMap;function ye(e){return function(t,o,n){if(ve.has(n))return ve.get(n);const r=e(t,o,n);return ve.set(n,r),r}}const we=Object.freeze({instance:(e,t)=>new ae(e,0,t),singleton:(e,t)=>new ae(e,1,t),transient:(e,t)=>new ae(e,2,t),callback:(e,t)=>new ae(e,3,t),cachedCallback:(e,t)=>new ae(e,3,ye(t)),aliasTo:(e,t)=>new ae(t,5,e)});function Ce(e){if(null==e)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function ke(e,t,o){if(e instanceof ae&&4===e.strategy){const n=e.state;let r=n.length;const s=new Array(r);for(;r--;)s[r]=n[r].resolve(t,o);return s}return[e.resolve(t,o)]}const xe="(anonymous)";function $e(e){return"object"==typeof e&&null!==e||"function"==typeof e}const Pe=function(){const e=new WeakMap;let t=!1,o="",n=0;return function(r){return t=e.get(r),void 0===t&&(o=r.toString(),n=o.length,t=n>=29&&n<=100&&125===o.charCodeAt(n-1)&&o.charCodeAt(n-2)<=32&&93===o.charCodeAt(n-3)&&101===o.charCodeAt(n-4)&&100===o.charCodeAt(n-5)&&111===o.charCodeAt(n-6)&&99===o.charCodeAt(n-7)&&32===o.charCodeAt(n-8)&&101===o.charCodeAt(n-9)&&118===o.charCodeAt(n-10)&&105===o.charCodeAt(n-11)&&116===o.charCodeAt(n-12)&&97===o.charCodeAt(n-13)&&110===o.charCodeAt(n-14)&&88===o.charCodeAt(n-15),e.set(r,t)),t}}(),Se={};function Oe(e){switch(typeof e){case"number":return e>=0&&(0|e)===e;case"string":{const t=Se[e];if(void 0!==t)return t;const o=e.length;if(0===o)return Se[e]=!1;let n=0;for(let t=0;t<o;++t)if(n=e.charCodeAt(t),0===t&&48===n&&o>1||n<48||n>57)return Se[e]=!1;return Se[e]=!0}default:return!1}}function Re(e){return`${e.toLowerCase()}:presentation`}const De=new Map,Te=Object.freeze({define(e,t,o){const n=Re(e);void 0===De.get(n)?De.set(n,t):De.set(n,!1),o.register(we.instance(n,t))},forTag(e,t){const o=Re(e),n=De.get(o);if(!1===n){return ee.findResponsibleContainer(t).get(o)}return n||null}});class Ae{constructor(e,t){this.template=e||null,this.styles=void 0===t?null:Array.isArray(t)?k.create(t):t instanceof k?t:k.create([t])}applyTo(e){const t=e.$fastController;null===t.template&&(t.template=this.template),null===t.styles&&(t.styles=this.styles)}}class Be extends U{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return void 0===this._presentation&&(this._presentation=Te.forTag(this.tagName,this)),this._presentation}templateChanged(){void 0!==this.template&&(this.$fastController.template=this.template)}stylesChanged(){void 0!==this.styles&&(this.$fastController.styles=this.styles)}connectedCallback(){null!==this.$presentation&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(e){return(t={})=>new Le(this===Be?class extends Be{}:this,e,t)}}function Ie(e,t,o){return"function"==typeof e?e(t,o):e}q([m],Be.prototype,"template",void 0),q([m],Be.prototype,"styles",void 0);class Le{constructor(e,t,o){this.type=e,this.elementDefinition=t,this.overrideDefinition=o,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(e,t){const o=this.definition,n=this.overrideDefinition,r=`${o.prefix||t.elementPrefix}-${o.baseName}`;t.tryDefineElement({name:r,type:this.type,baseClass:this.elementDefinition.baseClass,callback:e=>{const t=new Ae(Ie(o.template,e,o),Ie(o.styles,e,o));e.definePresentation(t);let r=Ie(o.shadowOptions,e,o);e.shadowRootMode&&(r?n.shadowOptions||(r.mode=e.shadowRootMode):null!==r&&(r={mode:e.shadowRootMode})),e.defineElement({elementOptions:Ie(o.elementOptions,e,o),shadowOptions:r,attributes:Ie(o.attributes,e,o)})}})}}class Ee{createCSS(){return""}createBehavior(){}}function Fe(e){const t=e.parentElement;if(t)return t;{const t=e.getRootNode();if(t.host instanceof HTMLElement)return t.host}return null}const Me=document.createElement("div");class qe{setProperty(e,t){f.queueUpdate((()=>this.target.setProperty(e,t)))}removeProperty(e){f.queueUpdate((()=>this.target.removeProperty(e)))}}class _e extends qe{constructor(){super();const e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,e]}}class Ve extends qe{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);const{sheet:e}=this.style;if(e){const t=e.insertRule(":root{}",e.cssRules.length);this.target=e.cssRules[t].style}}}class Ne{constructor(e){this.store=new Map,this.target=null;const t=e.$fastController;this.style=document.createElement("style"),t.addStyles(this.style),g.getNotifier(t).subscribe(this,"isConnected"),this.handleChange(t,"isConnected")}targetChanged(){if(null!==this.target)for(const[e,t]of this.store.entries())this.target.setProperty(e,t)}setProperty(e,t){this.store.set(e,t),f.queueUpdate((()=>{null!==this.target&&this.target.setProperty(e,t)}))}removeProperty(e){this.store.delete(e),f.queueUpdate((()=>{null!==this.target&&this.target.removeProperty(e)}))}handleChange(e,t){const{sheet:o}=this.style;if(o){const e=o.insertRule(":host{}",o.cssRules.length);this.target=o.cssRules[e].style}else this.target=null}}q([m],Ne.prototype,"target",void 0);class ze{constructor(e){this.target=e.style}setProperty(e,t){f.queueUpdate((()=>this.target.setProperty(e,t)))}removeProperty(e){f.queueUpdate((()=>this.target.removeProperty(e)))}}class je{setProperty(e,t){je.properties[e]=t;for(const o of je.roots.values())We.getOrCreate(je.normalizeRoot(o)).setProperty(e,t)}removeProperty(e){delete je.properties[e];for(const t of je.roots.values())We.getOrCreate(je.normalizeRoot(t)).removeProperty(e)}static registerRoot(e){const{roots:t}=je;if(!t.has(e)){t.add(e);const o=We.getOrCreate(this.normalizeRoot(e));for(const e in je.properties)o.setProperty(e,je.properties[e])}}static unregisterRoot(e){const{roots:t}=je;if(t.has(e)){t.delete(e);const o=We.getOrCreate(je.normalizeRoot(e));for(const e in je.properties)o.removeProperty(e)}}static normalizeRoot(e){return e===Me?document:e}}je.roots=new Set,je.properties={};const Ue=new WeakMap,He=f.supportsAdoptedStyleSheets?class extends qe{constructor(e){super();const t=new CSSStyleSheet;this.target=t.cssRules[t.insertRule(":host{}")].style,e.$fastController.addStyles(k.create([t]))}}:Ne,We=Object.freeze({getOrCreate(e){if(Ue.has(e))return Ue.get(e);let t;return e===Me?t=new je:e instanceof Document?t=f.supportsAdoptedStyleSheets?new _e:new Ve:t=e instanceof U?new He(e):new ze(e),Ue.set(e,t),t}});class Ge extends Ee{constructor(e){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=e.name,null!==e.cssCustomPropertyName&&(this.cssCustomProperty=`--${e.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=Ge.uniqueId(),Ge.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(e){return new Ge({name:"string"==typeof e?e:e.name,cssCustomPropertyName:"string"==typeof e?e:void 0===e.cssCustomPropertyName?e.name:e.cssCustomPropertyName})}static isCSSDesignToken(e){return"string"==typeof e.cssCustomProperty}static isDerivedDesignTokenValue(e){return"function"==typeof e}static getTokenById(e){return Ge.tokensById.get(e)}getOrCreateSubscriberSet(e=this){return this.subscribers.get(e)||this.subscribers.set(e,new Set)&&this.subscribers.get(e)}createCSS(){return this.cssVar||""}getValueFor(e){const t=Je.getOrCreate(e).get(this);if(void 0!==t)return t;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`)}setValueFor(e,t){return this._appliedTo.add(e),t instanceof Ge&&(t=this.alias(t)),Je.getOrCreate(e).set(this,t),this}deleteValueFor(e){return this._appliedTo.delete(e),Je.existsFor(e)&&Je.getOrCreate(e).delete(this),this}withDefault(e){return this.setValueFor(Me,e),this}subscribe(e,t){const o=this.getOrCreateSubscriberSet(t);t&&!Je.existsFor(t)&&Je.getOrCreate(t),o.has(e)||o.add(e)}unsubscribe(e,t){const o=this.subscribers.get(t||this);o&&o.has(e)&&o.delete(e)}notify(e){const t=Object.freeze({token:this,target:e});this.subscribers.has(this)&&this.subscribers.get(this).forEach((e=>e.handleChange(t))),this.subscribers.has(e)&&this.subscribers.get(e).forEach((e=>e.handleChange(t)))}alias(e){return t=>e.getValueFor(t)}}Ge.uniqueId=(()=>{let e=0;return()=>(e++,e.toString(16))})(),Ge.tokensById=new Map;class Qe{constructor(e,t,o){this.source=e,this.token=t,this.node=o,this.dependencies=new Set,this.observer=g.binding(e,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){this.node.store.set(this.token,this.observer.observe(this.node.target,C))}}class Ye{constructor(){this.values=new Map}set(e,t){this.values.get(e)!==t&&(this.values.set(e,t),g.getNotifier(this).notify(e.id))}get(e){return g.track(this,e.id),this.values.get(e)}delete(e){this.values.delete(e)}all(){return this.values.entries()}}const Ke=new WeakMap,Ze=new WeakMap;class Je{constructor(e){this.target=e,this.store=new Ye,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(e,t)=>{const o=Ge.getTokenById(t);if(o&&(o.notify(this.target),Ge.isCSSDesignToken(o))){const t=this.parent,n=this.isReflecting(o);if(t){const r=t.get(o),s=e.get(o);r===s||n?r===s&&n&&this.stopReflectToCSS(o):this.reflectToCSS(o)}else n||this.reflectToCSS(o)}}},Ke.set(e,this),g.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),e instanceof U?e.$fastController.addBehaviors([this]):e.isConnected&&this.bind()}static getOrCreate(e){return Ke.get(e)||new Je(e)}static existsFor(e){return Ke.has(e)}static findParent(e){if(Me!==e.target){let t=Fe(e.target);for(;null!==t;){if(Ke.has(t))return Ke.get(t);t=Fe(t)}return Je.getOrCreate(Me)}return null}static findClosestAssignedNode(e,t){let o=t;do{if(o.has(e))return o;o=o.parent?o.parent:o.target!==Me?Je.getOrCreate(Me):null}while(null!==o);return null}get parent(){return Ze.get(this)||null}has(e){return this.assignedValues.has(e)}get(e){const t=this.store.get(e);if(void 0!==t)return t;const o=this.getRaw(e);return void 0!==o?(this.hydrate(e,o),this.get(e)):void 0}getRaw(e){var t;return this.assignedValues.has(e)?this.assignedValues.get(e):null===(t=Je.findClosestAssignedNode(e,this))||void 0===t?void 0:t.getRaw(e)}set(e,t){Ge.isDerivedDesignTokenValue(this.assignedValues.get(e))&&this.tearDownBindingObserver(e),this.assignedValues.set(e,t),Ge.isDerivedDesignTokenValue(t)?this.setupBindingObserver(e,t):this.store.set(e,t)}delete(e){this.assignedValues.delete(e),this.tearDownBindingObserver(e);const t=this.getRaw(e);t?this.hydrate(e,t):this.store.delete(e)}bind(){const e=Je.findParent(this);e&&e.appendChild(this);for(const e of this.assignedValues.keys())e.notify(this.target)}unbind(){if(this.parent){Ze.get(this).removeChild(this)}}appendChild(e){e.parent&&Ze.get(e).removeChild(e);const t=this.children.filter((t=>e.contains(t)));Ze.set(e,this),this.children.push(e),t.forEach((t=>e.appendChild(t))),g.getNotifier(this.store).subscribe(e);for(const[t,o]of this.store.all())e.hydrate(t,this.bindingObservers.has(t)?this.getRaw(t):o)}removeChild(e){const t=this.children.indexOf(e);return-1!==t&&this.children.splice(t,1),g.getNotifier(this.store).unsubscribe(e),e.parent===this&&Ze.delete(e)}contains(e){return function(e,t){let o=t;for(;null!==o;){if(o===e)return!0;o=Fe(o)}return!1}(this.target,e.target)}reflectToCSS(e){this.isReflecting(e)||(this.reflecting.add(e),Je.cssCustomPropertyReflector.startReflection(e,this.target))}stopReflectToCSS(e){this.isReflecting(e)&&(this.reflecting.delete(e),Je.cssCustomPropertyReflector.stopReflection(e,this.target))}isReflecting(e){return this.reflecting.has(e)}handleChange(e,t){const o=Ge.getTokenById(t);o&&this.hydrate(o,this.getRaw(o))}hydrate(e,t){if(!this.has(e)){const o=this.bindingObservers.get(e);Ge.isDerivedDesignTokenValue(t)?o?o.source!==t&&(this.tearDownBindingObserver(e),this.setupBindingObserver(e,t)):this.setupBindingObserver(e,t):(o&&this.tearDownBindingObserver(e),this.store.set(e,t))}}setupBindingObserver(e,t){const o=new Qe(t,e,this);return this.bindingObservers.set(e,o),o}tearDownBindingObserver(e){return!!this.bindingObservers.has(e)&&(this.bindingObservers.get(e).disconnect(),this.bindingObservers.delete(e),!0)}}Je.cssCustomPropertyReflector=new class{startReflection(e,t){e.subscribe(this,t),this.handleChange({token:e,target:t})}stopReflection(e,t){e.unsubscribe(this,t),this.remove(e,t)}handleChange(e){const{token:t,target:o}=e;this.add(t,o)}add(e,t){We.getOrCreate(t).setProperty(e.cssCustomProperty,this.resolveCSSValue(Je.getOrCreate(t).get(e)))}remove(e,t){We.getOrCreate(t).removeProperty(e.cssCustomProperty)}resolveCSSValue(e){return e&&"function"==typeof e.createCSS?e.createCSS():e}},q([m],Je.prototype,"children",void 0);const Xe=Object.freeze({create:function(e){return Ge.from(e)},notifyConnection:e=>!(!e.isConnected||!Je.existsFor(e))&&(Je.getOrCreate(e).bind(),!0),notifyDisconnection:e=>!(e.isConnected||!Je.existsFor(e))&&(Je.getOrCreate(e).unbind(),!0),registerRoot(e=Me){je.registerRoot(e)},unregisterRoot(e=Me){je.unregisterRoot(e)}}),et=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),tt=new Map,ot=new Map;let nt=null;const rt=ee.createInterface((e=>e.cachedCallback((e=>(null===nt&&(nt=new it(null,e)),nt))))),st=Object.freeze({tagFor:e=>ot.get(e),responsibleFor(e){const t=e.$$designSystem$$;if(t)return t;return ee.findResponsibleContainer(e).get(rt)},getOrCreate(e){if(!e)return null===nt&&(nt=ee.getOrCreateDOMContainer().get(rt)),nt;const t=e.$$designSystem$$;if(t)return t;const o=ee.getOrCreateDOMContainer(e);if(o.has(rt,!1))return o.get(rt);{const t=new it(e,o);return o.register(we.instance(rt,t)),t}}});class it{constructor(e,t){this.owner=e,this.container=t,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>et.definitionCallbackOnly,null!==e&&(e.$$designSystem$$=this)}withPrefix(e){return this.prefix=e,this}withShadowRootMode(e){return this.shadowRootMode=e,this}withElementDisambiguation(e){return this.disambiguate=e,this}withDesignTokenRoot(e){return this.designTokenRoot=e,this}register(...e){const t=this.container,o=[],n=this.disambiguate,r=this.shadowRootMode,s={elementPrefix:this.prefix,tryDefineElement(e,s,i){const a=function(e,t,o){return"string"==typeof e?{name:e,type:t,callback:o}:e}(e,s,i),{name:c,callback:l,baseClass:h}=a;let{type:d}=a,u=c,f=tt.get(u),b=!0;for(;f;){const e=n(u,d,f);switch(e){case et.ignoreDuplicate:return;case et.definitionCallbackOnly:b=!1,f=void 0;break;default:u=e,f=tt.get(u)}}b&&((ot.has(d)||d===Be)&&(d=class extends d{}),tt.set(u,d),ot.set(d,u),h&&ot.set(h,u)),o.push(new at(t,u,d,r,l,b))}};this.designTokensInitialized||(this.designTokensInitialized=!0,null!==this.designTokenRoot&&Xe.registerRoot(this.designTokenRoot)),t.registerWithContext(s,...e);for(const e of o)e.callback(e),e.willDefine&&null!==e.definition&&e.definition.define();return this}}class at{constructor(e,t,o,n,r,s){this.container=e,this.name=t,this.type=o,this.shadowRootMode=n,this.callback=r,this.willDefine=s,this.definition=null}definePresentation(e){Te.define(this.name,e,this.container)}defineElement(e){this.definition=new M(this.type,Object.assign(Object.assign({},e),{name:this.name}))}tagFor(e){return st.tagFor(e)}}class ct{}q([I({attribute:"aria-atomic"})],ct.prototype,"ariaAtomic",void 0),q([I({attribute:"aria-busy"})],ct.prototype,"ariaBusy",void 0),q([I({attribute:"aria-controls"})],ct.prototype,"ariaControls",void 0),q([I({attribute:"aria-current"})],ct.prototype,"ariaCurrent",void 0),q([I({attribute:"aria-describedby"})],ct.prototype,"ariaDescribedby",void 0),q([I({attribute:"aria-details"})],ct.prototype,"ariaDetails",void 0),q([I({attribute:"aria-disabled"})],ct.prototype,"ariaDisabled",void 0),q([I({attribute:"aria-errormessage"})],ct.prototype,"ariaErrormessage",void 0),q([I({attribute:"aria-flowto"})],ct.prototype,"ariaFlowto",void 0),q([I({attribute:"aria-haspopup"})],ct.prototype,"ariaHaspopup",void 0),q([I({attribute:"aria-hidden"})],ct.prototype,"ariaHidden",void 0),q([I({attribute:"aria-invalid"})],ct.prototype,"ariaInvalid",void 0),q([I({attribute:"aria-keyshortcuts"})],ct.prototype,"ariaKeyshortcuts",void 0),q([I({attribute:"aria-label"})],ct.prototype,"ariaLabel",void 0),q([I({attribute:"aria-labelledby"})],ct.prototype,"ariaLabelledby",void 0),q([I({attribute:"aria-live"})],ct.prototype,"ariaLive",void 0),q([I({attribute:"aria-owns"})],ct.prototype,"ariaOwns",void 0),q([I({attribute:"aria-relevant"})],ct.prototype,"ariaRelevant",void 0),q([I({attribute:"aria-roledescription"})],ct.prototype,"ariaRoledescription",void 0);class lt{constructor(){this.targetIndex=0}}class ht extends lt{constructor(){super(...arguments),this.createPlaceholder=f.createInterpolationPlaceholder}}class dt extends lt{constructor(e,t,o){super(),this.name=e,this.behavior=t,this.options=o}createPlaceholder(e){return f.createCustomAttributePlaceholder(this.name,e)}createBehavior(e){return new this.behavior(e,this.options)}}function ut(e,t){this.source=e,this.context=t,null===this.bindingObserver&&(this.bindingObserver=g.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(e,t))}function ft(e,t){this.source=e,this.context=t,this.target.addEventListener(this.targetName,this)}function bt(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function pt(){this.bindingObserver.disconnect(),this.source=null,this.context=null;const e=this.target.$fastView;void 0!==e&&e.isComposed&&(e.unbind(),e.needsBindOnly=!0)}function gt(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function mt(e){f.setAttribute(this.target,this.targetName,e)}function vt(e){f.setBooleanAttribute(this.target,this.targetName,e)}function yt(e){if(null==e&&(e=""),e.create){this.target.textContent="";let t=this.target.$fastView;void 0===t?t=e.create():this.target.$fastTemplate!==e&&(t.isComposed&&(t.remove(),t.unbind()),t=e.create()),t.isComposed?t.needsBindOnly&&(t.needsBindOnly=!1,t.bind(this.source,this.context)):(t.isComposed=!0,t.bind(this.source,this.context),t.insertBefore(this.target),this.target.$fastView=t,this.target.$fastTemplate=e)}else{const t=this.target.$fastView;void 0!==t&&t.isComposed&&(t.isComposed=!1,t.remove(),t.needsBindOnly?t.needsBindOnly=!1:t.unbind()),this.target.textContent=e}}function wt(e){this.target[this.targetName]=e}function Ct(e){const t=this.classVersions||Object.create(null),o=this.target;let n=this.version||0;if(null!=e&&e.length){const r=e.split(/\s+/);for(let e=0,s=r.length;e<s;++e){const s=r[e];""!==s&&(t[s]=n,o.classList.add(s))}}if(this.classVersions=t,this.version=n+1,0!==n){n-=1;for(const e in t)t[e]===n&&o.classList.remove(e)}}class kt extends ht{constructor(e){super(),this.binding=e,this.bind=ut,this.unbind=bt,this.updateTarget=mt,this.isBindingVolatile=g.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(e){if(this.originalTargetName=e,void 0!==e)switch(e[0]){case":":if(this.cleanedTargetName=e.substr(1),this.updateTarget=wt,"innerHTML"===this.cleanedTargetName){const e=this.binding;this.binding=(t,o)=>f.createHTML(e(t,o))}break;case"?":this.cleanedTargetName=e.substr(1),this.updateTarget=vt;break;case"@":this.cleanedTargetName=e.substr(1),this.bind=ft,this.unbind=gt;break;default:this.cleanedTargetName=e,"class"===e&&(this.updateTarget=Ct)}}targetAtContent(){this.updateTarget=yt,this.unbind=pt}createBehavior(e){return new xt(e,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}}class xt{constructor(e,t,o,n,r,s,i){this.source=null,this.context=null,this.bindingObserver=null,this.target=e,this.binding=t,this.isBindingVolatile=o,this.bind=n,this.unbind=r,this.updateTarget=s,this.targetName=i}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(e){w.setEvent(e);const t=this.binding(this.source,this.context);w.setEvent(null),!0!==t&&e.preventDefault()}}let $t=null;class Pt{addFactory(e){e.targetIndex=this.targetIndex,this.behaviorFactories.push(e)}captureContentBinding(e){e.targetAtContent(),this.addFactory(e)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){$t=this}static borrow(e){const t=$t||new Pt;return t.directives=e,t.reset(),$t=null,t}}function St(e){if(1===e.length)return e[0];let t;const o=e.length,n=e.map((e=>"string"==typeof e?()=>e:(t=e.targetName||t,e.binding))),r=new kt(((e,t)=>{let r="";for(let s=0;s<o;++s)r+=n[s](e,t);return r}));return r.targetName=t,r}const Ot=u.length;function Rt(e,t){const o=t.split(d);if(1===o.length)return null;const n=[];for(let t=0,r=o.length;t<r;++t){const r=o[t],s=r.indexOf(u);let i;if(-1===s)i=r;else{const t=parseInt(r.substring(0,s));n.push(e.directives[t]),i=r.substring(s+Ot)}""!==i&&n.push(i)}return n}function Dt(e,t,o=!1){const n=t.attributes;for(let r=0,s=n.length;r<s;++r){const i=n[r],a=i.value,c=Rt(e,a);let l=null;null===c?o&&(l=new kt((()=>a)),l.targetName=i.name):l=St(c),null!==l&&(t.removeAttributeNode(i),r--,s--,e.addFactory(l))}}function Tt(e,t,o){const n=Rt(e,t.textContent);if(null!==n){let r=t;for(let s=0,i=n.length;s<i;++s){const i=n[s],a=0===s?t:r.parentNode.insertBefore(document.createTextNode(""),r.nextSibling);"string"==typeof i?a.textContent=i:(a.textContent=" ",e.captureContentBinding(i)),r=a,e.targetIndex++,a!==t&&o.nextNode()}e.targetIndex--}}const At=document.createRange();class Bt{constructor(e,t){this.fragment=e,this.behaviors=t,this.source=null,this.context=null,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{const t=this.lastChild;if(e.previousSibling===t)return;const o=e.parentNode;let n,r=this.firstChild;for(;r!==t;)n=r.nextSibling,o.insertBefore(r,e),r=n;o.insertBefore(t,e)}}remove(){const e=this.fragment,t=this.lastChild;let o,n=this.firstChild;for(;n!==t;)o=n.nextSibling,e.appendChild(n),n=o;e.appendChild(t)}dispose(){const e=this.firstChild.parentNode,t=this.lastChild;let o,n=this.firstChild;for(;n!==t;)o=n.nextSibling,e.removeChild(n),n=o;e.removeChild(t);const r=this.behaviors,s=this.source;for(let e=0,t=r.length;e<t;++e)r[e].unbind(s)}bind(e,t){const o=this.behaviors;if(this.source!==e)if(null!==this.source){const n=this.source;this.source=e,this.context=t;for(let r=0,s=o.length;r<s;++r){const s=o[r];s.unbind(n),s.bind(e,t)}}else{this.source=e,this.context=t;for(let n=0,r=o.length;n<r;++n)o[n].bind(e,t)}}unbind(){if(null===this.source)return;const e=this.behaviors,t=this.source;for(let o=0,n=e.length;o<n;++o)e[o].unbind(t);this.source=null}static disposeContiguousBatch(e){if(0!==e.length){At.setStartBefore(e[0].firstChild),At.setEndAfter(e[e.length-1].lastChild),At.deleteContents();for(let t=0,o=e.length;t<o;++t){const o=e[t],n=o.behaviors,r=o.source;for(let e=0,t=n.length;e<t;++e)n[e].unbind(r)}}}}class It{constructor(e,t){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=e,this.directives=t}create(e){if(null===this.fragment){let e;const t=this.html;if("string"==typeof t){e=document.createElement("template"),e.innerHTML=f.createHTML(t);const o=e.content.firstElementChild;null!==o&&"TEMPLATE"===o.tagName&&(e=o)}else e=t;const o=function(e,t){const o=e.content;document.adoptNode(o);const n=Pt.borrow(t);Dt(n,e,!0);const r=n.behaviorFactories;n.reset();const s=f.createTemplateWalker(o);let i;for(;i=s.nextNode();)switch(n.targetIndex++,i.nodeType){case 1:Dt(n,i);break;case 3:Tt(n,i,s);break;case 8:f.isMarker(i)&&n.addFactory(t[f.extractDirectiveIndexFromMarker(i)])}let a=0;(f.isMarker(o.firstChild)||1===o.childNodes.length&&t.length)&&(o.insertBefore(document.createComment(""),o.firstChild),a=-1);const c=n.behaviorFactories;return n.release(),{fragment:o,viewBehaviorFactories:c,hostBehaviorFactories:r,targetOffset:a}}(e,this.directives);this.fragment=o.fragment,this.viewBehaviorFactories=o.viewBehaviorFactories,this.hostBehaviorFactories=o.hostBehaviorFactories,this.targetOffset=o.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}const t=this.fragment.cloneNode(!0),o=this.viewBehaviorFactories,n=new Array(this.behaviorCount),r=f.createTemplateWalker(t);let s=0,i=this.targetOffset,a=r.nextNode();for(let e=o.length;s<e;++s){const e=o[s],t=e.targetIndex;for(;null!==a;){if(i===t){n[s]=e.createBehavior(a);break}a=r.nextNode(),i++}}if(this.hasHostBehaviors){const t=this.hostBehaviorFactories;for(let o=0,r=t.length;o<r;++o,++s)n[s]=t[o].createBehavior(e)}return new Bt(t,n)}render(e,t,o){"string"==typeof t&&(t=document.getElementById(t)),void 0===o&&(o=t);const n=this.create(o);return n.bind(e,C),n.appendTo(t),n}}const Lt=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function Et(e,...t){const o=[];let n="";for(let r=0,s=e.length-1;r<s;++r){const s=e[r];let i=t[r];if(n+=s,i instanceof It){const e=i;i=()=>e}if("function"==typeof i&&(i=new kt(i)),i instanceof ht){const e=Lt.exec(s);null!==e&&(i.targetName=e[2])}i instanceof lt?(n+=i.createPlaceholder(o.length),o.push(i)):n+=i}return n+=e[e.length-1],new It(n,o)}class Ft{constructor(e,t){this.target=e,this.propertyName=t}bind(e){e[this.propertyName]=this.target}unbind(){}}function Mt(e){return new dt("fast-ref",Ft,e)}Et`
    <span part="end" ${Mt("endContainer")}>
        <slot
            name="end"
            ${Mt("end")}
            @slotchange="${e=>e.handleEndContentChange()}"
        ></slot>
    </span>
`,Et`
    <span part="start" ${Mt("startContainer")}>
        <slot
            name="start"
            ${Mt("start")}
            @slotchange="${e=>e.handleStartContentChange()}"
        ></slot>
    </span>
`;function qt(e,...t){const o=T.locate(e);t.forEach((t=>{Object.getOwnPropertyNames(t.prototype).forEach((o=>{"constructor"!==o&&Object.defineProperty(e.prototype,o,Object.getOwnPropertyDescriptor(t.prototype,o))}));T.locate(t).forEach((e=>o.push(e)))}))}var _t;!function(e){e[e.alt=18]="alt",e[e.arrowDown=40]="arrowDown",e[e.arrowLeft=37]="arrowLeft",e[e.arrowRight=39]="arrowRight",e[e.arrowUp=38]="arrowUp",e[e.back=8]="back",e[e.backSlash=220]="backSlash",e[e.break=19]="break",e[e.capsLock=20]="capsLock",e[e.closeBracket=221]="closeBracket",e[e.colon=186]="colon",e[e.colon2=59]="colon2",e[e.comma=188]="comma",e[e.ctrl=17]="ctrl",e[e.delete=46]="delete",e[e.end=35]="end",e[e.enter=13]="enter",e[e.equals=187]="equals",e[e.equals2=61]="equals2",e[e.equals3=107]="equals3",e[e.escape=27]="escape",e[e.forwardSlash=191]="forwardSlash",e[e.function1=112]="function1",e[e.function10=121]="function10",e[e.function11=122]="function11",e[e.function12=123]="function12",e[e.function2=113]="function2",e[e.function3=114]="function3",e[e.function4=115]="function4",e[e.function5=116]="function5",e[e.function6=117]="function6",e[e.function7=118]="function7",e[e.function8=119]="function8",e[e.function9=120]="function9",e[e.home=36]="home",e[e.insert=45]="insert",e[e.menu=93]="menu",e[e.minus=189]="minus",e[e.minus2=109]="minus2",e[e.numLock=144]="numLock",e[e.numPad0=96]="numPad0",e[e.numPad1=97]="numPad1",e[e.numPad2=98]="numPad2",e[e.numPad3=99]="numPad3",e[e.numPad4=100]="numPad4",e[e.numPad5=101]="numPad5",e[e.numPad6=102]="numPad6",e[e.numPad7=103]="numPad7",e[e.numPad8=104]="numPad8",e[e.numPad9=105]="numPad9",e[e.numPadDivide=111]="numPadDivide",e[e.numPadDot=110]="numPadDot",e[e.numPadMinus=109]="numPadMinus",e[e.numPadMultiply=106]="numPadMultiply",e[e.numPadPlus=107]="numPadPlus",e[e.openBracket=219]="openBracket",e[e.pageDown=34]="pageDown",e[e.pageUp=33]="pageUp",e[e.period=190]="period",e[e.print=44]="print",e[e.quote=222]="quote",e[e.scrollLock=145]="scrollLock",e[e.shift=16]="shift",e[e.space=32]="space",e[e.tab=9]="tab",e[e.tilde=192]="tilde",e[e.windowsLeft=91]="windowsLeft",e[e.windowsOpera=219]="windowsOpera",e[e.windowsRight=92]="windowsRight"}(_t||(_t={}));const Vt="Enter",Nt="form-associated-proxy",zt="ElementInternals",jt=zt in window&&"setFormValue"in window[zt].prototype,Ut=new WeakMap;function Ht(e){const t=class extends e{constructor(...e){super(...e),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=["change","click"],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||"",this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return jt}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){const e=this.proxy.labels,t=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),o=e?t.concat(Array.from(e)):t;return Object.freeze(o)}return s}valueChanged(e,t){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}disabledChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),f.queueUpdate((()=>this.classList.toggle("disabled",this.disabled)))}nameChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),f.queueUpdate((()=>this.classList.toggle("required",this.required))),this.validate()}get elementInternals(){if(!jt)return null;let e=Ut.get(this);return e||(e=this.attachInternals(),Ut.set(this,e)),e}connectedCallback(){super.connectedCallback(),this.addEventListener("keypress",this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener("reset",this.formResetCallback))}disconnectedCallback(){this.proxyEventsToBlock.forEach((e=>this.proxy.removeEventListener(e,this.stopPropagation))),!this.elementInternals&&this.form&&this.form.removeEventListener("reset",this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(e,t,o){this.elementInternals?this.elementInternals.setValidity(e,t,o):"string"==typeof t&&this.proxy.setCustomValidity(t)}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var e;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display="none",this.proxyEventsToBlock.forEach((e=>this.proxy.addEventListener(e,this.stopPropagation))),this.proxy.disabled=this.disabled,this.proxy.required=this.required,"string"==typeof this.name&&(this.proxy.name=this.name),"string"==typeof this.value&&(this.proxy.value=this.value),this.proxy.setAttribute("slot",Nt),this.proxySlot=document.createElement("slot"),this.proxySlot.setAttribute("name",Nt)),null===(e=this.shadowRoot)||void 0===e||e.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var e;this.removeChild(this.proxy),null===(e=this.shadowRoot)||void 0===e||e.removeChild(this.proxySlot)}validate(e){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,e)}setFormValue(e,t){this.elementInternals&&this.elementInternals.setFormValue(e,t||e)}_keypressHandler(e){if(e.key===Vt)if(this.form instanceof HTMLFormElement){const e=this.form.querySelector("[type=submit]");null==e||e.click()}}stopPropagation(e){e.stopPropagation()}};return I({mode:"boolean"})(t.prototype,"disabled"),I({mode:"fromView",attribute:"value"})(t.prototype,"initialValue"),I({attribute:"current-value"})(t.prototype,"currentValue"),I(t.prototype,"name"),I({mode:"boolean"})(t.prototype,"required"),m(t.prototype,"value"),t}class Wt extends Be{}class Gt extends(Ht(Wt)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class Qt extends Gt{constructor(){super(...arguments),this.handleClick=e=>{var t;this.disabled&&(null===(t=this.defaultSlottedContent)||void 0===t?void 0:t.length)<=1&&e.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;const e=this.proxy.isConnected;e||this.attachProxy(),"function"==typeof this.form.requestSubmit?this.form.requestSubmit(this.proxy):this.proxy.click(),e||this.detachProxy()},this.handleFormReset=()=>{var e;null===(e=this.form)||void 0===e||e.reset()},this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(null===(e=this.$fastController.definition.shadowOptions)||void 0===e?void 0:e.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(e,t){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),"submit"===t&&this.addEventListener("click",this.handleSubmission),"submit"===e&&this.removeEventListener("click",this.handleSubmission),"reset"===t&&this.addEventListener("click",this.handleFormReset),"reset"===e&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var e;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();const t=Array.from(null===(e=this.control)||void 0===e?void 0:e.children);t&&t.forEach((e=>{e.addEventListener("click",this.handleClick)}))}disconnectedCallback(){var e;super.disconnectedCallback();const t=Array.from(null===(e=this.control)||void 0===e?void 0:e.children);t&&t.forEach((e=>{e.removeEventListener("click",this.handleClick)}))}}q([I({mode:"boolean"})],Qt.prototype,"autofocus",void 0),q([I({attribute:"form"})],Qt.prototype,"formId",void 0),q([I],Qt.prototype,"formaction",void 0),q([I],Qt.prototype,"formenctype",void 0),q([I],Qt.prototype,"formmethod",void 0),q([I({mode:"boolean"})],Qt.prototype,"formnovalidate",void 0),q([I],Qt.prototype,"formtarget",void 0),q([I],Qt.prototype,"type",void 0),q([m],Qt.prototype,"defaultSlottedContent",void 0);class Yt{}q([I({attribute:"aria-expanded"})],Yt.prototype,"ariaExpanded",void 0),q([I({attribute:"aria-pressed"})],Yt.prototype,"ariaPressed",void 0),qt(Yt,ct),qt(Qt,class{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}},Yt);class Kt{constructor(e,t){this.target=e,this.options=t,this.source=null}bind(e){const t=this.options.property;this.shouldUpdate=g.getAccessors(e).some((e=>e.name===t)),this.source=e,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(s),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let e=this.getNodes();return void 0!==this.options.filter&&(e=e.filter(this.options.filter)),e}updateTarget(e){this.source[this.options.property]=e}}class Zt extends Kt{constructor(e,t){super(e,t)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}}function Jt(e){return"string"==typeof e&&(e={property:e}),new dt("fast-slotted",Zt,e)}function Xt(e,t){const o=[];let n="";const r=[];for(let s=0,i=e.length-1;s<i;++s){n+=e[s];let i=t[s];if(i instanceof Ee){const e=i.createBehavior();i=i.createCSS(),e&&r.push(e)}i instanceof k||i instanceof CSSStyleSheet?(""!==n.trim()&&(o.push(n),n=""),o.push(i)):n+=i}return n+=e[e.length-1],""!==n.trim()&&o.push(n),{styles:o,behaviors:r}}function eo(e,...t){const{styles:o,behaviors:n}=Xt(e,t),r=k.create(o);return n.length&&r.withBehaviors(...n),r}class to extends Ee{constructor(e,t){super(),this.behaviors=t,this.css="";const o=e.reduce(((e,t)=>("string"==typeof t?this.css+=t:e.push(t),e)),[]);o.length&&(this.styles=k.create(o))}createBehavior(){return this}createCSS(){return this.css}bind(e){this.styles&&e.$fastController.addStyles(this.styles),this.behaviors.length&&e.$fastController.addBehaviors(this.behaviors)}unbind(e){this.styles&&e.$fastController.removeStyles(this.styles),this.behaviors.length&&e.$fastController.removeBehaviors(this.behaviors)}}let oo;const no=function(){if("boolean"==typeof oo)return oo;if("undefined"==typeof window||!window.document||!window.document.createElement)return oo=!1,oo;const e=document.createElement("style"),t=function(){const e=document.querySelector('meta[property="csp-nonce"]');return e?e.getAttribute("content"):null}();null!==t&&e.setAttribute("nonce",t),document.head.appendChild(e);try{e.sheet.insertRule("foo:focus-visible {color:inherit}",0),oo=!0}catch(e){oo=!1}finally{document.head.removeChild(e)}return oo}()?"focus-visible":"focus";function ro(e){const t=getComputedStyle(document.body),o=document.querySelector("body");if(o){const n=o.getAttribute("data-vscode-theme-kind");for(const[r,s]of e){let e=t.getPropertyValue(r).toString();if("vscode-high-contrast"===n)0===e.length&&s.name.includes("background")&&(e="transparent"),"button-icon-hover-background"===s.name&&(e="transparent");else if("vscode-high-contrast-light"===n){if(0===e.length&&s.name.includes("background"))switch(s.name){case"button-primary-hover-background":e="#0F4A85";break;case"button-secondary-hover-background":case"button-icon-hover-background":e="transparent"}}else"contrast-active-border"===s.name&&(e="transparent");s.setValueFor(o,e)}}}const so=new Map;let io=!1;function ao(e,t){const o=Xe.create(e);if(t){if(t.includes("--fake-vscode-token")){t=`${t}-${"id"+Math.random().toString(16).slice(2)}`}so.set(t,o)}return io||(!function(e){window.addEventListener("load",(()=>{new MutationObserver((()=>{ro(e)})).observe(document.body,{attributes:!0,attributeFilter:["class"]}),ro(e)}))}(so),io=!0),o}ao("background","--vscode-editor-background").withDefault("#1e1e1e");const co=ao("border-width").withDefault(1),lo=ao("contrast-active-border","--vscode-contrastActiveBorder").withDefault("#f38518"),ho=(ao("contrast-border","--vscode-contrastBorder").withDefault("#6fc3df"),ao("corner-radius").withDefault(0),ao("design-unit").withDefault(4)),uo=ao("disabled-opacity").withDefault(.4),fo=ao("focus-border","--vscode-focusBorder").withDefault("#007fd4"),bo=ao("font-family","--vscode-font-family").withDefault("-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol"),po=(ao("font-weight","--vscode-font-weight").withDefault("400"),ao("foreground","--vscode-foreground").withDefault("#cccccc")),go=(ao("input-height").withDefault("26"),ao("input-min-width").withDefault("100px"),ao("type-ramp-base-font-size","--vscode-font-size").withDefault("13px")),mo=ao("type-ramp-base-line-height").withDefault("normal"),vo=(ao("type-ramp-minus1-font-size").withDefault("11px"),ao("type-ramp-minus1-line-height").withDefault("16px"),ao("type-ramp-minus2-font-size").withDefault("9px"),ao("type-ramp-minus2-line-height").withDefault("16px"),ao("type-ramp-plus1-font-size").withDefault("16px"),ao("type-ramp-plus1-line-height").withDefault("24px"),ao("scrollbarWidth").withDefault("10px"),ao("scrollbarHeight").withDefault("10px"),ao("scrollbar-slider-background","--vscode-scrollbarSlider-background").withDefault("#79797966"),ao("scrollbar-slider-hover-background","--vscode-scrollbarSlider-hoverBackground").withDefault("#646464b3"),ao("scrollbar-slider-active-background","--vscode-scrollbarSlider-activeBackground").withDefault("#bfbfbf66"),ao("badge-background","--vscode-badge-background").withDefault("#4d4d4d"),ao("badge-foreground","--vscode-badge-foreground").withDefault("#ffffff"),ao("button-border","--vscode-button-border").withDefault("transparent")),yo=ao("button-icon-background").withDefault("transparent"),wo=ao("button-icon-corner-radius").withDefault("5px"),Co=ao("button-icon-outline-offset").withDefault(0),ko=ao("button-icon-hover-background","--fake-vscode-token").withDefault("rgba(90, 93, 94, 0.31)"),xo=ao("button-icon-padding").withDefault("3px"),$o=ao("button-primary-background","--vscode-button-background").withDefault("#0e639c"),Po=ao("button-primary-foreground","--vscode-button-foreground").withDefault("#ffffff"),So=ao("button-primary-hover-background","--vscode-button-hoverBackground").withDefault("#1177bb"),Oo=ao("button-secondary-background","--vscode-button-secondaryBackground").withDefault("#3a3d41"),Ro=ao("button-secondary-foreground","--vscode-button-secondaryForeground").withDefault("#ffffff"),Do=ao("button-secondary-hover-background","--vscode-button-secondaryHoverBackground").withDefault("#45494e"),To=ao("button-padding-horizontal").withDefault("11px"),Ao=ao("button-padding-vertical").withDefault("4px"),Bo=(ao("checkbox-background","--vscode-checkbox-background").withDefault("#3c3c3c"),ao("checkbox-border","--vscode-checkbox-border").withDefault("#3c3c3c"),ao("checkbox-corner-radius").withDefault(3),ao("checkbox-foreground","--vscode-checkbox-foreground").withDefault("#f0f0f0"),ao("list-active-selection-background","--vscode-list-activeSelectionBackground").withDefault("#094771"),ao("list-active-selection-foreground","--vscode-list-activeSelectionForeground").withDefault("#ffffff"),ao("list-hover-background","--vscode-list-hoverBackground").withDefault("#2a2d2e"),ao("divider-background","--vscode-settings-dropdownListBorder").withDefault("#454545"),ao("dropdown-background","--vscode-dropdown-background").withDefault("#3c3c3c"),ao("dropdown-border","--vscode-dropdown-border").withDefault("#3c3c3c"),ao("dropdown-foreground","--vscode-dropdown-foreground").withDefault("#f0f0f0"),ao("dropdown-list-max-height").withDefault("200px"),ao("input-background","--vscode-input-background").withDefault("#3c3c3c"),ao("input-foreground","--vscode-input-foreground").withDefault("#cccccc"),ao("input-placeholder-foreground","--vscode-input-placeholderForeground").withDefault("#cccccc"),ao("link-active-foreground","--vscode-textLink-activeForeground").withDefault("#3794ff"),ao("link-foreground","--vscode-textLink-foreground").withDefault("#3794ff"),ao("progress-background","--vscode-progressBar-background").withDefault("#0e70c0"),ao("panel-tab-active-border","--vscode-panelTitle-activeBorder").withDefault("#e7e7e7"),ao("panel-tab-active-foreground","--vscode-panelTitle-activeForeground").withDefault("#e7e7e7"),ao("panel-tab-foreground","--vscode-panelTitle-inactiveForeground").withDefault("#e7e7e799"),ao("panel-view-background","--vscode-panel-background").withDefault("#1e1e1e"),ao("panel-view-border","--vscode-panel-border").withDefault("#80808059"),ao("tag-corner-radius").withDefault("2px"),eo`
	${Io="inline-flex",`:host([hidden]){display:none}:host{display:${Io}}`} :host {
		outline: none;
		font-family: ${bo};
		font-size: ${go};
		line-height: ${mo};
		color: ${Po};
		background: ${$o};
		border-radius: 2px;
		fill: currentColor;
		cursor: pointer;
	}
	.control {
		background: transparent;
		height: inherit;
		flex-grow: 1;
		box-sizing: border-box;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: ${Ao} ${To};
		white-space: wrap;
		outline: none;
		text-decoration: none;
		border: calc(${co} * 1px) solid ${vo};
		color: inherit;
		border-radius: inherit;
		fill: inherit;
		cursor: inherit;
		font-family: inherit;
	}
	:host(:hover) {
		background: ${So};
	}
	:host(:active) {
		background: ${$o};
	}
	.control:${no} {
		outline: calc(${co} * 1px) solid ${fo};
		outline-offset: calc(${co} * 2px);
	}
	.control::-moz-focus-inner {
		border: 0;
	}
	:host([disabled]) {
		opacity: ${uo};
		background: ${$o};
		cursor: ${"not-allowed"};
	}
	.content {
		display: flex;
	}
	.start {
		display: flex;
	}
	::slotted(svg),
	::slotted(span) {
		width: calc(${ho} * 4px);
		height: calc(${ho} * 4px);
	}
	.start {
		margin-inline-end: 8px;
	}
`);var Io;const Lo=eo`
	:host([appearance='primary']) {
		background: ${$o};
		color: ${Po};
	}
	:host([appearance='primary']:hover) {
		background: ${So};
	}
	:host([appearance='primary']:active) .control:active {
		background: ${$o};
	}
	:host([appearance='primary']) .control:${no} {
		outline: calc(${co} * 1px) solid ${fo};
		outline-offset: calc(${co} * 2px);
	}
	:host([appearance='primary'][disabled]) {
		background: ${$o};
	}
`,Eo=eo`
	:host([appearance='secondary']) {
		background: ${Oo};
		color: ${Ro};
	}
	:host([appearance='secondary']:hover) {
		background: ${Do};
	}
	:host([appearance='secondary']:active) .control:active {
		background: ${Oo};
	}
	:host([appearance='secondary']) .control:${no} {
		outline: calc(${co} * 1px) solid ${fo};
		outline-offset: calc(${co} * 2px);
	}
	:host([appearance='secondary'][disabled]) {
		background: ${Oo};
	}
`,Fo=eo`
	:host([appearance='icon']) {
		background: ${yo};
		border-radius: ${wo};
		color: ${po};
	}
	:host([appearance='icon']:hover) {
		background: ${ko};
		outline: 1px dotted ${lo};
		outline-offset: -1px;
	}
	:host([appearance='icon']) .control {
		padding: ${xo};
		border: none;
	}
	:host([appearance='icon']:active) .control:active {
		background: ${ko};
	}
	:host([appearance='icon']) .control:${no} {
		outline: calc(${co} * 1px) solid ${fo};
		outline-offset: ${Co};
	}
	:host([appearance='icon'][disabled]) {
		background: ${yo};
	}
`;class Mo extends Qt{connectedCallback(){if(super.connectedCallback(),!this.appearance){const e=this.getAttribute("appearance");this.appearance=e}}attributeChangedCallback(e,t,o){if("appearance"===e&&"icon"===o){this.getAttribute("aria-label")||(this.ariaLabel="Icon Button")}"aria-label"===e&&(this.ariaLabel=o),"disabled"===e&&(this.disabled=null!==o)}}q([I],Mo.prototype,"appearance",void 0);const qo=Mo.compose({baseName:"button",template:(e,t)=>Et`
    <button
        class="control"
        part="control"
        ?autofocus="${e=>e.autofocus}"
        ?disabled="${e=>e.disabled}"
        form="${e=>e.formId}"
        formaction="${e=>e.formaction}"
        formenctype="${e=>e.formenctype}"
        formmethod="${e=>e.formmethod}"
        formnovalidate="${e=>e.formnovalidate}"
        formtarget="${e=>e.formtarget}"
        name="${e=>e.name}"
        type="${e=>e.type}"
        value="${e=>e.value}"
        aria-atomic="${e=>e.ariaAtomic}"
        aria-busy="${e=>e.ariaBusy}"
        aria-controls="${e=>e.ariaControls}"
        aria-current="${e=>e.ariaCurrent}"
        aria-describedby="${e=>e.ariaDescribedby}"
        aria-details="${e=>e.ariaDetails}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-errormessage="${e=>e.ariaErrormessage}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-flowto="${e=>e.ariaFlowto}"
        aria-haspopup="${e=>e.ariaHaspopup}"
        aria-hidden="${e=>e.ariaHidden}"
        aria-invalid="${e=>e.ariaInvalid}"
        aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-live="${e=>e.ariaLive}"
        aria-owns="${e=>e.ariaOwns}"
        aria-pressed="${e=>e.ariaPressed}"
        aria-relevant="${e=>e.ariaRelevant}"
        aria-roledescription="${e=>e.ariaRoledescription}"
        ${Mt("control")}
    >
        ${((e,t)=>Et`
    <span
        part="start"
        ${Mt("startContainer")}
        class="${e=>t.start?"start":void 0}"
    >
        <slot
            name="start"
            ${Mt("start")}
            @slotchange="${e=>e.handleStartContentChange()}"
        >
            ${t.start||""}
        </slot>
    </span>
`)(0,t)}
        <span class="content" part="content">
            <slot ${Jt("defaultSlottedContent")}></slot>
        </span>
        ${((e,t)=>Et`
    <span
        part="end"
        ${Mt("endContainer")}
        class=${e=>t.end?"end":void 0}
    >
        <slot name="end" ${Mt("end")} @slotchange="${e=>e.handleEndContentChange()}">
            ${t.end||""}
        </slot>
    </span>
`)(0,t)}
    </button>
`,styles:(e,t)=>eo`
	${Bo}
	${Lo}
	${Eo}
	${Fo}
`,shadowOptions:{delegatesFocus:!0}});class _o{constructor(e,t=!1){this.method=e,this.reset=t}}class Vo extends _o{}class No extends _o{}function zo(e,t,o){e.method===t.method&&o(t.params,e)}const jo=new Vo("webview/ready"),Uo=new Vo("webview/focus"),Ho=new Vo("command/execute");new Vo("configuration/preview"),new Vo("configuration/update"),new No("configuration/didChange"),new No("configuration/didPreview"),new No("webview/didOpenAnchor");const Wo=new Vo("focus/pr/openWorktree"),Go=new Vo("focus/pr/switchToBranch"),Qo=new No("focus/state/didChange",!0),Yo=new No("graph/subscription/didChange");function Ko(e,t){let o,n,r,s,i;function a(e){const o=e-(n??0);return null==n||o>=t||o<0}function c(){const e=Date.now();if(a(e))l();else{i=setTimeout(c,t-(e-(n??0)))}}function l(){return i=void 0,o?function(){const t=o,n=r;return o=r=void 0,s=e.apply(n,t),s}():(o=r=void 0,s)}function h(...e){const l=Date.now(),h=a(l);return o=e,r=this,n=l,h&&null==i?(i=setTimeout(c,t),s):(null==i&&(i=setTimeout(c,t)),s)}return h.cancel=function(){null!=i&&clearTimeout(i),o=n=r=i=void 0},h.flush=function(){return null!=i?l():s},h.pending=function(){return null!=i},h}var Zo=(e=>(e.Off="off",e.Error="error",e.Warn="warn",e.Info="info",e.Debug="debug",e))(Zo||{});const Jo="";const Xo=new class{constructor(){this._isDebugging=!1,this.level=0,this._logLevel=Zo.Off}configure(e,t,o=!1){this.provider=e,this._isDebugging=o,this.logLevel=t}enabled(e){return this.level>=en(e)}get isDebugging(){return this._isDebugging}get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e,this.level=en(this._logLevel),e===Zo.Off?(this.output?.dispose?.(),this.output=void 0):this.output=this.output??this.provider.createChannel(this.provider.name)}get timestamp(){return`[${(new Date).toISOString().replace(/T/," ").slice(0,-1)}]`}debug(e,...t){if(this.level<4&&!this.isDebugging)return;let o;"string"==typeof e?o=e:(o=t.shift(),null!=e&&(o=`${e.prefix} ${o??Jo}`)),this.isDebugging,null==this.output||this.level<4||this.output.appendLine(`${this.timestamp} ${o??Jo}${this.toLoggableParams(!0,t)}`)}error(e,t,...o){if(this.level<1&&!this.isDebugging)return;let n;if(n=null==t||"string"==typeof t?t:`${t.prefix} ${o.shift()??Jo}`,null==n){const t=e instanceof Error?e.stack:void 0;if(t){const e=/.*\s*?at\s(.+?)\s/.exec(t);null!=e&&(n=e[1])}}this.isDebugging,null==this.output||this.level<1||this.output.appendLine(`${this.timestamp} ${n??Jo}${this.toLoggableParams(!1,o)}\n${String(e)}`)}log(e,...t){if(this.level<3&&!this.isDebugging)return;let o;"string"==typeof e?o=e:(o=t.shift(),null!=e&&(o=`${e.prefix} ${o??Jo}`)),this.isDebugging,null==this.output||this.level<3||this.output.appendLine(`${this.timestamp} ${o??Jo}${this.toLoggableParams(!1,t)}`)}warn(e,...t){if(this.level<2&&!this.isDebugging)return;let o;"string"==typeof e?o=e:(o=t.shift(),null!=e&&(o=`${e.prefix} ${o??Jo}`)),this.isDebugging,null==this.output||this.level<2||this.output.appendLine(`${this.timestamp} ${o??Jo}${this.toLoggableParams(!1,t)}`)}showOutputChannel(e){this.output?.show?.(e)}toLoggable(e,t){if("object"!=typeof e)return String(e);if(Array.isArray(e))return`[${e.map((e=>this.toLoggable(e,t))).join(", ")}]`;const o=this.provider.toLoggable?.(e);if(null!=o)return o;try{return JSON.stringify(e,t)}catch{return"<error>"}}toLoggableParams(e,t){if(0===t.length||e&&this.level<4&&!this.isDebugging)return Jo;const o=t.map((e=>this.toLoggable(e))).join(", ");return 0!==o.length?` — ${o}`:Jo}};function en(e){switch(e){case Zo.Off:return 0;case Zo.Error:return 1;case Zo.Warn:return 2;case Zo.Info:return 3;case Zo.Debug:return 4;default:return 0}}var tn,on;(on=tn||(tn={})).on=function(e,t,o,n){let r=!1;if("string"==typeof e){const s=function(t){const n=t?.target?.closest(e);null!=n&&o(t,n)};return document.addEventListener(t,s,n??!0),{dispose:()=>{r||(r=!0,document.removeEventListener(t,s,n??!0))}}}const s=function(e){o(e,this)};return e.addEventListener(t,s,n??!1),{dispose:()=>{r||(r=!0,e.removeEventListener(t,s,n??!1))}}},on.insertTemplate=function(e,t,o){const n=document.getElementById(e);if(t.replaceChildren(n?.content.cloneNode(!0)),t.className=n.className,null!=o?.visible){const e=t.querySelectorAll("[data-visible]");for(const t of e){const e=t.dataset.visible;e&&(o.visible[e]?t.style.display="initial":t.style.display="none")}}if(null!=o?.bindings){const e=t.querySelectorAll("[data-bind]");for(const t of e){const e=t.dataset.bind;if(!e)continue;const n=o.bindings[e];null!=n&&(t.textContent=String(n))}}},on.resetSlot=function(e){e.replaceChildren(),e.className=""};var nn=(e=>(e[e.Hash=35]="Hash",e[e.Slash=47]="Slash",e[e.Digit0=48]="Digit0",e[e.Digit1=49]="Digit1",e[e.Digit2=50]="Digit2",e[e.Digit3=51]="Digit3",e[e.Digit4=52]="Digit4",e[e.Digit5=53]="Digit5",e[e.Digit6=54]="Digit6",e[e.Digit7=55]="Digit7",e[e.Digit8=56]="Digit8",e[e.Digit9=57]="Digit9",e[e.Backslash=92]="Backslash",e[e.A=65]="A",e[e.B=66]="B",e[e.C=67]="C",e[e.D=68]="D",e[e.E=69]="E",e[e.F=70]="F",e[e.Z=90]="Z",e[e.a=97]="a",e[e.b=98]="b",e[e.c=99]="c",e[e.d=100]="d",e[e.e=101]="e",e[e.f=102]="f",e[e.z=122]="z",e))(nn||{});function rn(e,t){const o=e+t,n=t<0?o<0?0:o:o>255?255:o;return Math.round(n)}function sn(e,t){return an(e,-t)}function an(e,t){const o=function(e){const t=yn(e);return null==t?null:[t.rgba.r,t.rgba.g,t.rgba.b,t.rgba.a]}(e);if(null==o)return e;const[n,r,s,i]=o,a=255*t/100;return`rgba(${rn(n,a)}, ${rn(r,a)}, ${rn(s,a)}, ${i})`}function cn(e,t){const o=bn.from(e);return null==o?e:o.transparent(t/100).toString()}function ln(e,t){const o=Math.pow(10,t);return Math.round(e*o)/o}class hn{constructor(e,t,o,n=1){this._rgbaBrand=void 0,this.r=0|Math.min(255,Math.max(0,e)),this.g=0|Math.min(255,Math.max(0,t)),this.b=0|Math.min(255,Math.max(0,o)),this.a=ln(Math.max(Math.min(1,n),0),3)}static equals(e,t){return e.r===t.r&&e.g===t.g&&e.b===t.b&&e.a===t.a}}class dn{constructor(e,t,o,n){this._hslaBrand=void 0,this.h=0|Math.max(Math.min(360,e),0),this.s=ln(Math.max(Math.min(1,t),0),3),this.l=ln(Math.max(Math.min(1,o),0),3),this.a=ln(Math.max(Math.min(1,n),0),3)}static equals(e,t){return e.h===t.h&&e.s===t.s&&e.l===t.l&&e.a===t.a}static fromRGBA(e){const t=e.r/255,o=e.g/255,n=e.b/255,r=e.a,s=Math.max(t,o,n),i=Math.min(t,o,n);let a=0,c=0;const l=(i+s)/2,h=s-i;if(h>0){switch(c=Math.min(l<=.5?h/(2*l):h/(2-2*l),1),s){case t:a=(o-n)/h+(o<n?6:0);break;case o:a=(n-t)/h+2;break;case n:a=(t-o)/h+4}a*=60,a=Math.round(a)}return new dn(a,c,l,r)}static _hue2rgb(e,t,o){return o<0&&(o+=1),o>1&&(o-=1),o<1/6?e+6*(t-e)*o:o<.5?t:o<2/3?e+(t-e)*(2/3-o)*6:e}static toRGBA(e){const t=e.h/360,{s:o,l:n,a:r}=e;let s,i,a;if(0===o)s=i=a=n;else{const e=n<.5?n*(1+o):n+o-n*o,r=2*n-e;s=dn._hue2rgb(r,e,t+1/3),i=dn._hue2rgb(r,e,t),a=dn._hue2rgb(r,e,t-1/3)}return new hn(Math.round(255*s),Math.round(255*i),Math.round(255*a),r)}}class un{constructor(e,t,o,n){this._hsvaBrand=void 0,this.h=0|Math.max(Math.min(360,e),0),this.s=ln(Math.max(Math.min(1,t),0),3),this.v=ln(Math.max(Math.min(1,o),0),3),this.a=ln(Math.max(Math.min(1,n),0),3)}static equals(e,t){return e.h===t.h&&e.s===t.s&&e.v===t.v&&e.a===t.a}static fromRGBA(e){const t=e.r/255,o=e.g/255,n=e.b/255,r=Math.max(t,o,n),s=r-Math.min(t,o,n),i=0===r?0:s/r;let a;return a=0===s?0:r===t?((o-n)/s%6+6)%6:r===o?(n-t)/s+2:(t-o)/s+4,new un(Math.round(60*a),i,r,e.a)}static toRGBA(e){const{h:t,s:o,v:n,a:r}=e,s=n*o,i=s*(1-Math.abs(t/60%2-1)),a=n-s;let[c,l,h]=[0,0,0];return t<60?(c=s,l=i):t<120?(c=i,l=s):t<180?(l=s,h=i):t<240?(l=i,h=s):t<300?(c=i,h=s):t<=360&&(c=s,h=i),c=Math.round(255*(c+a)),l=Math.round(255*(l+a)),h=Math.round(255*(h+a)),new hn(c,l,h,r)}}const fn=class{static from(e){return e instanceof fn?e:yn(e)||fn.red}static fromCssVariable(e,t){return yn(t.getPropertyValue(e).trim())||fn.red}static fromHex(e){return wn(e)||fn.red}static equals(e,t){return!e&&!t||!(!e||!t)&&e.equals(t)}get hsla(){return this._hsla?this._hsla:dn.fromRGBA(this.rgba)}get hsva(){return this._hsva?this._hsva:un.fromRGBA(this.rgba)}constructor(e){if(!e)throw new Error("Color needs a value");if(e instanceof hn)this.rgba=e;else if(e instanceof dn)this._hsla=e,this.rgba=dn.toRGBA(e);else{if(!(e instanceof un))throw new Error("Invalid color ctor argument");this._hsva=e,this.rgba=un.toRGBA(e)}}equals(e){return null!=e&&(Boolean(e)&&hn.equals(this.rgba,e.rgba)&&dn.equals(this.hsla,e.hsla)&&un.equals(this.hsva,e.hsva))}getRelativeLuminance(){return ln(.2126*fn._relativeLuminanceForComponent(this.rgba.r)+.7152*fn._relativeLuminanceForComponent(this.rgba.g)+.0722*fn._relativeLuminanceForComponent(this.rgba.b),4)}static _relativeLuminanceForComponent(e){const t=e/255;return t<=.03928?t/12.92:Math.pow((t+.055)/1.055,2.4)}luminance(e){return function(e,t){if(0===t)return new bn(new hn(0,0,0,e.rgba.a));if(1===t)return new bn(new hn(255,255,255,e.rgba.a));const o=e.getRelativeLuminance();let n=20;const r=(e,o)=>{const s=e.mix(o,.5),i=s.getRelativeLuminance();return Math.abs(t-i)<1e-7||!n--?s:i>t?r(e,s):r(s,o)},s=(o>t?r(bn.black,e):r(e,bn.white)).rgba;return new bn(new hn(s.r,s.g,s.b,e.rgba.a))}(this,e)}getContrastRatio(e){const t=this.getRelativeLuminance(),o=e.getRelativeLuminance();return t>o?(t+.05)/(o+.05):(o+.05)/(t+.05)}isDarker(){return(299*this.rgba.r+587*this.rgba.g+114*this.rgba.b)/1e3<128}isLighter(){return(299*this.rgba.r+587*this.rgba.g+114*this.rgba.b)/1e3>=128}isLighterThan(e){return this.getRelativeLuminance()>e.getRelativeLuminance()}isDarkerThan(e){return this.getRelativeLuminance()<e.getRelativeLuminance()}lighten(e){return new fn(new dn(this.hsla.h,this.hsla.s,this.hsla.l+this.hsla.l*e,this.hsla.a))}darken(e){return new fn(new dn(this.hsla.h,this.hsla.s,this.hsla.l-this.hsla.l*e,this.hsla.a))}transparent(e){const{r:t,g:o,b:n,a:r}=this.rgba;return new fn(new hn(t,o,n,r*e))}isTransparent(){return 0===this.rgba.a}isOpaque(){return 1===this.rgba.a}opposite(){return new fn(new hn(255-this.rgba.r,255-this.rgba.g,255-this.rgba.b,this.rgba.a))}blend(e){const t=e.rgba,o=this.rgba.a,n=t.a,r=o+n*(1-o);if(r<1e-6)return fn.transparent;const s=this.rgba.r*o/r+t.r*n*(1-o)/r,i=this.rgba.g*o/r+t.g*n*(1-o)/r,a=this.rgba.b*o/r+t.b*n*(1-o)/r;return new fn(new hn(s,i,a,r))}mix(e,t){return function(e,t,o){const n=e.rgba,r=t.rgba;return new bn(new hn(n.r+o*(r.r-n.r),n.g+o*(r.g-n.g),n.b+o*(r.b-n.b),n.a+o*(r.a-n.a)))}(this,e,t)}makeOpaque(e){if(this.isOpaque()||1!==e.rgba.a)return this;const{r:t,g:o,b:n,a:r}=this.rgba;return new fn(new hn(e.rgba.r-r*(e.rgba.r-t),e.rgba.g-r*(e.rgba.g-o),e.rgba.b-r*(e.rgba.b-n),1))}flatten(...e){const t=e.reduceRight(((e,t)=>fn._flatten(t,e)));return fn._flatten(this,t)}static _flatten(e,t){const o=1-e.rgba.a;return new fn(new hn(o*t.rgba.r+e.rgba.a*e.rgba.r,o*t.rgba.g+e.rgba.a*e.rgba.g,o*t.rgba.b+e.rgba.a*e.rgba.b))}toString(){return this._toString||(this._toString=function(e){if(e.isOpaque())return mn(e);return pn(e)}(this)),this._toString}static getLighterColor(e,t,o){if(e.isLighterThan(t))return e;o=o||.5;const n=e.getRelativeLuminance(),r=t.getRelativeLuminance();return o=o*(r-n)/r,e.lighten(o)}static getDarkerColor(e,t,o){if(e.isDarkerThan(t))return e;o=o||.5;const n=e.getRelativeLuminance();return o=o*(n-t.getRelativeLuminance())/n,e.darken(o)}};let bn=fn;function pn(e){return`rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${Number(e.rgba.a.toFixed(2))})`}function gn(e){const t=e.toString(16);return 2!==t.length?`0${t}`:t}function mn(e){return`#${gn(e.rgba.r)}${gn(e.rgba.g)}${gn(e.rgba.b)}`}bn.white=new fn(new hn(255,255,255,1)),bn.black=new fn(new hn(0,0,0,1)),bn.red=new fn(new hn(255,0,0,1)),bn.blue=new fn(new hn(0,0,255,1)),bn.green=new fn(new hn(0,255,0,1)),bn.cyan=new fn(new hn(0,255,255,1)),bn.lightgrey=new fn(new hn(211,211,211,1)),bn.transparent=new fn(new hn(0,0,0,0));const vn=/^((?:rgb|hsl)a?)\((-?\d+%?)[,\s]+(-?\d+%?)[,\s]+(-?\d+%?)[,\s]*(-?[\d.]+%?)?\)$/i;function yn(e){if(0===e.length)return null;if(e.charCodeAt(0)===nn.Hash)return wn(e);const t=vn.exec(e);if(null==t)return null;const o=t[1];let n;switch(o){case"rgb":case"hsl":n=[parseInt(t[2],10),parseInt(t[3],10),parseInt(t[4],10),1];break;case"rgba":case"hsla":n=[parseInt(t[2],10),parseInt(t[3],10),parseInt(t[4],10),parseFloat(t[5])];break;default:return null}switch(o){case"rgb":case"rgba":return new bn(new hn(n[0],n[1],n[2],n[3]));case"hsl":case"hsla":return new bn(new dn(n[0],n[1],n[2],n[3]))}return bn.red}function wn(e){const t=(e=e.trim()).length;if(0===t)return null;if(e.charCodeAt(0)!==nn.Hash)return null;if(7===t){const t=16*Cn(e.charCodeAt(1))+Cn(e.charCodeAt(2)),o=16*Cn(e.charCodeAt(3))+Cn(e.charCodeAt(4)),n=16*Cn(e.charCodeAt(5))+Cn(e.charCodeAt(6));return new bn(new hn(t,o,n,1))}if(9===t){const t=16*Cn(e.charCodeAt(1))+Cn(e.charCodeAt(2)),o=16*Cn(e.charCodeAt(3))+Cn(e.charCodeAt(4)),n=16*Cn(e.charCodeAt(5))+Cn(e.charCodeAt(6)),r=16*Cn(e.charCodeAt(7))+Cn(e.charCodeAt(8));return new bn(new hn(t,o,n,r/255))}if(4===t){const t=Cn(e.charCodeAt(1)),o=Cn(e.charCodeAt(2)),n=Cn(e.charCodeAt(3));return new bn(new hn(16*t+t,16*o+o,16*n+n))}if(5===t){const t=Cn(e.charCodeAt(1)),o=Cn(e.charCodeAt(2)),n=Cn(e.charCodeAt(3)),r=Cn(e.charCodeAt(4));return new bn(new hn(16*t+t,16*o+o,16*n+n,(16*r+r)/255))}return null}function Cn(e){switch(e){case nn.Digit0:return 0;case nn.Digit1:return 1;case nn.Digit2:return 2;case nn.Digit3:return 3;case nn.Digit4:return 4;case nn.Digit5:return 5;case nn.Digit6:return 6;case nn.Digit7:return 7;case nn.Digit8:return 8;case nn.Digit9:return 9;case nn.a:case nn.A:return 10;case nn.b:case nn.B:return 11;case nn.c:case nn.C:return 12;case nn.d:case nn.D:return 13;case nn.e:case nn.E:return 14;case nn.f:case nn.F:return 15}return 0}const kn=class{constructor(){this._disposed=!1}get event(){return null==this._event&&(this._event=(e,t,o)=>{null==this.listeners&&(this.listeners=new On);const n=this.listeners.push(null==t?e:[e,t]),r={dispose:()=>{r.dispose=kn._noop,this._disposed||n()}};return Array.isArray(o)&&o.push(r),r}),this._event}fire(e){if(null!=this.listeners){null==this._deliveryQueue&&(this._deliveryQueue=new On);for(let t=this.listeners.iterator(),o=t.next();!o.done;o=t.next())this._deliveryQueue.push([o.value,e]);for(;this._deliveryQueue.size>0;){const[e,t]=this._deliveryQueue.shift();try{"function"==typeof e?e(t):e[0].call(e[1],t)}catch(e){}}}}dispose(){this.listeners?.clear(),this._deliveryQueue?.clear(),this._disposed=!0}};let xn=kn;xn._noop=function(){};const $n={done:!0,value:void 0},Pn=class{constructor(e){this.element=e,this.next=Pn.Undefined,this.prev=Pn.Undefined}};let Sn=Pn;Sn.Undefined=new Pn(void 0);class On{constructor(){this._first=Sn.Undefined,this._last=Sn.Undefined,this._size=0}get size(){return this._size}isEmpty(){return this._first===Sn.Undefined}clear(){this._first=Sn.Undefined,this._last=Sn.Undefined,this._size=0}unshift(e){return this._insert(e,!1)}push(e){return this._insert(e,!0)}_insert(e,t){const o=new Sn(e);if(this._first===Sn.Undefined)this._first=o,this._last=o;else if(t){const e=this._last;this._last=o,o.prev=e,e.next=o}else{const e=this._first;this._first=o,o.next=e,e.prev=o}this._size+=1;let n=!1;return()=>{n||(n=!0,this._remove(o))}}shift(){if(this._first===Sn.Undefined)return;const e=this._first.element;return this._remove(this._first),e}pop(){if(this._last===Sn.Undefined)return;const e=this._last.element;return this._remove(this._last),e}_remove(e){if(e.prev!==Sn.Undefined&&e.next!==Sn.Undefined){const t=e.prev;t.next=e.next,e.next.prev=t}else e.prev===Sn.Undefined&&e.next===Sn.Undefined?(this._first=Sn.Undefined,this._last=Sn.Undefined):e.next===Sn.Undefined?(this._last=this._last.prev,this._last.next=Sn.Undefined):e.prev===Sn.Undefined&&(this._first=this._first.next,this._first.prev=Sn.Undefined);this._size-=1}iterator(){let e,t=this._first;return{next:function(){return t===Sn.Undefined?$n:(null==e?e={done:!1,value:t.element}:e.value=t.element,t=t.next,e)}}}toArray(){const e=[];for(let t=this._first;t!==Sn.Undefined;t=t.next)e.push(t.element);return e}}const Rn=new xn,Dn=Rn.event;let Tn=0;function An(){return 1073741824===Tn?Tn=1:Tn++,`webview:${Tn}`}class Bn{constructor(e){this.appName=e,this.state=window.bootstrap,window.bootstrap=void 0,Xo.configure({name:e,createChannel:function(e){return{name:e,appendLine:function(e){}}}},Zo.Off),this.log("ctor()"),this._api=acquireVsCodeApi();const t=[];null!=this.onThemeUpdated&&t.push(Dn(this.onThemeUpdated,this)),t.push(function(){const e=e=>{const t=document.body,o=window.getComputedStyle(t),n=t.classList.contains("vscode-light")||t.classList.contains("vscode-high-contrast-light"),r=t.classList.contains("vscode-high-contrast")||t.classList.contains("vscode-high-contrast-light"),s=t.style;s.setProperty("--font-family",o.getPropertyValue("--vscode-font-family").trim()),s.setProperty("--font-size",o.getPropertyValue("--vscode-font-size").trim()),s.setProperty("--font-weight",o.getPropertyValue("--vscode-font-weight").trim()),s.setProperty("--editor-font-family",o.getPropertyValue("--vscode-editor-font-family").trim()),s.setProperty("--editor-font-size",o.getPropertyValue("--vscode-editor-font-size").trim()),s.setProperty("--editor-font-weight",o.getPropertyValue("--vscode-editor-font-weight").trim());const i=o.getPropertyValue("--vscode-editor-background").trim();let a=o.getPropertyValue("--vscode-editor-foreground").trim();a||(a=o.getPropertyValue("--vscode-foreground").trim());let c=i;s.setProperty("--color-background",c),s.setProperty("--color-background--lighten-05",an(c,5)),s.setProperty("--color-background--darken-05",sn(c,5)),s.setProperty("--color-background--lighten-075",an(c,7.5)),s.setProperty("--color-background--darken-075",sn(c,7.5)),s.setProperty("--color-background--lighten-10",an(c,10)),s.setProperty("--color-background--darken-10",sn(c,10)),s.setProperty("--color-background--lighten-15",an(c,15)),s.setProperty("--color-background--darken-15",sn(c,15)),s.setProperty("--color-background--lighten-30",an(c,30)),s.setProperty("--color-background--darken-30",sn(c,30)),s.setProperty("--color-background--lighten-50",an(c,50)),s.setProperty("--color-background--darken-50",sn(c,50)),c=o.getPropertyValue("--vscode-button-background").trim(),s.setProperty("--color-button-background",c),s.setProperty("--color-button-background--darken-30",sn(c,30)),s.setProperty("--color-highlight",c),s.setProperty("--color-highlight--75",cn(c,75)),s.setProperty("--color-highlight--50",cn(c,50)),s.setProperty("--color-highlight--25",cn(c,25)),c=o.getPropertyValue("--vscode-button-secondaryBackground").trim(),s.setProperty("--color-button-secondary-background",c),s.setProperty("--color-button-secondary-background--darken-30",sn(c,30)),c=o.getPropertyValue("--vscode-button-foreground").trim(),s.setProperty("--color-button-foreground",c),s.setProperty("--color-foreground",a),s.setProperty("--color-foreground--85",cn(a,85)),s.setProperty("--color-foreground--75",cn(a,75)),s.setProperty("--color-foreground--65",cn(a,65)),s.setProperty("--color-foreground--50",cn(a,50)),c=o.getPropertyValue("--vscode-focusBorder").trim(),s.setProperty("--color-focus-border",c),c=o.getPropertyValue("--vscode-textLink-foreground").trim(),s.setProperty("--color-link-foreground",c),s.setProperty("--color-link-foreground--darken-20",sn(c,20)),s.setProperty("--color-link-foreground--lighten-20",an(c,20)),c=o.getPropertyValue("--vscode-sideBar-background").trim(),s.setProperty("--color-view-background",c||i),c=o.getPropertyValue("--vscode-sideBar-foreground").trim(),s.setProperty("--color-view-foreground",c||a),s.setProperty("--color-view-header-foreground",o.getPropertyValue("--vscode-sideBarSectionHeader-foreground").trim()||c||a),c=o.getPropertyValue("--vscode-editorHoverWidget-background").trim(),s.setProperty("--color-hover-background",c),c=o.getPropertyValue("--vscode-editorHoverWidget-border").trim(),s.setProperty("--color-hover-border",c),c=o.getPropertyValue("--vscode-editorHoverWidget-foreground").trim(),s.setProperty("--color-hover-foreground",c),c=o.getPropertyValue("--vscode-editorHoverWidget-statusBarBackground").trim(),s.setProperty("--color-hover-statusBarBackground",c),c=o.getPropertyValue("--vscode-inputValidation-infoBackground").trim(),s.setProperty("--color-alert-infoHoverBackground",n?sn(c,5):an(c,5)),s.setProperty("--color-alert-infoBackground",c),c=o.getPropertyValue("--vscode-inputValidation-warningBackground").trim(),s.setProperty("--color-alert-warningHoverBackground",n?sn(c,5):an(c,5)),s.setProperty("--color-alert-warningBackground",c),c=o.getPropertyValue("--vscode-inputValidation-errorBackground").trim(),s.setProperty("--color-alert-errorHoverBackground",n?sn(c,5):an(c,5)),s.setProperty("--color-alert-errorBackground",c),c=n?sn(i,5):an(i,5),s.setProperty("--color-alert-neutralHoverBackground",n?sn(c,5):an(c,5)),s.setProperty("--color-alert-neutralBackground",c),s.setProperty("--color-alert-infoBorder","var(--vscode-inputValidation-infoBorder)"),s.setProperty("--color-alert-warningBorder","var(--vscode-inputValidation-warningBorder)"),s.setProperty("--color-alert-errorBorder","var(--vscode-inputValidation-errorBorder)"),s.setProperty("--color-alert-neutralBorder","var(--vscode-input-foreground)"),s.setProperty("--color-alert-foreground","var(--vscode-input-foreground)"),Rn.fire({colors:{background:i,foreground:a},computedStyle:o,isLightTheme:n,isHighContrastTheme:r,isInitializing:null==e})};e();const t=new MutationObserver(e);return t.observe(document.body,{attributeFilter:["class"]}),{dispose:()=>t.disconnect()}}()),requestAnimationFrame((()=>{this.log("ctor(): initializing...");try{this.onInitialize?.(),this.bind(),null!=this.onMessageReceived&&t.push(tn.on(window,"message",this.onMessageReceived.bind(this))),this.sendCommand(jo,void 0),this.onInitialized?.()}finally{document.body.classList.contains("preload")&&setTimeout((()=>{document.body.classList.remove("preload")}),500)}})),t.push(tn.on(window,"pagehide",(()=>{t?.forEach((e=>e.dispose())),this.bindDisposables?.forEach((e=>e.dispose())),this.bindDisposables=void 0})))}bind(){this.bindDisposables?.forEach((e=>e.dispose())),this.bindDisposables=this.onBind?.(),null==this.bindDisposables&&(this.bindDisposables=[]);const e=Ko((e=>{this.sendCommand(Uo,e)}),150);this.bindDisposables.push(tn.on(document,"focusin",(t=>{const o=t.composedPath().some((e=>"INPUT"===e.tagName));!0===this._focused&&this._inputFocused===o||(this._focused=!0,this._inputFocused=o,e({focused:!0,inputFocused:o}))})),tn.on(document,"focusout",(()=>{!1===this._focused&&!1===this._inputFocused||(this._focused=!1,this._inputFocused=!1,e({focused:!1,inputFocused:!1}))})))}log(e,...t){Xo.log(e,...t)}getState(){return this._api.getState()}sendCommand(e,t){const o=An();this.log(`sendCommand(${o}): name=${e.method}`),this.postMessage({id:o,method:e.method,params:t})}async sendCommandWithCompletion(e,t,o){const n=An();this.log(`sendCommandWithCompletion(${n}): name=${e.method}`);const r=new Promise(((e,t)=>{let r;const s=[tn.on(window,"message",(t=>{zo(o,t.data,(o=>{t.data.completionId===n&&(s.forEach((e=>e.dispose())),queueMicrotask((()=>e(o))))}))})),{dispose:function(){null!=r&&(clearTimeout(r),r=void 0)}}];r=setTimeout((()=>{r=void 0,s.forEach((e=>e.dispose())),t(new Error(`Timed out waiting for completion of ${o.method}`))}),6e4)}));return this.postMessage({id:n,method:e.method,params:t,completionId:n}),r}setState(e){this.state=e,null!=e&&this._api.setState(e)}postMessage(e){this._api.postMessage(e)}}var In=Object.defineProperty,Ln=Object.getOwnPropertyDescriptor,En=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?Ln(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&In(t,o,s),s};const Fn=eo`
	:host {
		font: normal normal normal var(--code-icon-size, 16px) / 1 codicon;
		display: inline-block;
		text-decoration: none;
		text-rendering: auto;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		color: inherit;
		vertical-align: text-bottom;
		letter-spacing: normal;
	}

	:host([icon='add']):before {
		content: '\\ea60';
	}
	:host([icon='plus']):before {
		content: '\\ea60';
	}
	:host([icon='gist-new']):before {
		content: '\\ea60';
	}
	:host([icon='repo-create']):before {
		content: '\\ea60';
	}
	:host([icon='lightbulb']):before {
		content: '\\ea61';
	}
	:host([icon='light-bulb']):before {
		content: '\\ea61';
	}
	:host([icon='repo']):before {
		content: '\\ea62';
	}
	:host([icon='repo-delete']):before {
		content: '\\ea62';
	}
	:host([icon='gist-fork']):before {
		content: '\\ea63';
	}
	:host([icon='repo-forked']):before {
		content: '\\ea63';
	}
	:host([icon='git-pull-request']):before {
		content: '\\ea64';
	}
	:host([icon='git-pull-request-abandoned']):before {
		content: '\\ea64';
	}
	:host([icon='record-keys']):before {
		content: '\\ea65';
	}
	:host([icon='keyboard']):before {
		content: '\\ea65';
	}
	:host([icon='tag']):before {
		content: '\\ea66';
	}
	:host([icon='tag-add']):before {
		content: '\\ea66';
	}
	:host([icon='tag-remove']):before {
		content: '\\ea66';
	}
	:host([icon='person']):before {
		content: '\\ea67';
	}
	:host([icon='person-follow']):before {
		content: '\\ea67';
	}
	:host([icon='person-outline']):before {
		content: '\\ea67';
	}
	:host([icon='person-filled']):before {
		content: '\\ea67';
	}
	:host([icon='git-branch']):before {
		content: '\\ea68';
	}
	:host([icon='git-branch-create']):before {
		content: '\\ea68';
	}
	:host([icon='git-branch-delete']):before {
		content: '\\ea68';
	}
	:host([icon='source-control']):before {
		content: '\\ea68';
	}
	:host([icon='mirror']):before {
		content: '\\ea69';
	}
	:host([icon='mirror-public']):before {
		content: '\\ea69';
	}
	:host([icon='star']):before {
		content: '\\ea6a';
	}
	:host([icon='star-add']):before {
		content: '\\ea6a';
	}
	:host([icon='star-delete']):before {
		content: '\\ea6a';
	}
	:host([icon='star-empty']):before {
		content: '\\ea6a';
	}
	:host([icon='comment']):before {
		content: '\\ea6b';
	}
	:host([icon='comment-add']):before {
		content: '\\ea6b';
	}
	:host([icon='alert']):before {
		content: '\\ea6c';
	}
	:host([icon='warning']):before {
		content: '\\ea6c';
	}
	:host([icon='search']):before {
		content: '\\ea6d';
	}
	:host([icon='search-save']):before {
		content: '\\ea6d';
	}
	:host([icon='log-out']):before {
		content: '\\ea6e';
	}
	:host([icon='sign-out']):before {
		content: '\\ea6e';
	}
	:host([icon='log-in']):before {
		content: '\\ea6f';
	}
	:host([icon='sign-in']):before {
		content: '\\ea6f';
	}
	:host([icon='eye']):before {
		content: '\\ea70';
	}
	:host([icon='eye-unwatch']):before {
		content: '\\ea70';
	}
	:host([icon='eye-watch']):before {
		content: '\\ea70';
	}
	:host([icon='circle-filled']):before {
		content: '\\ea71';
	}
	:host([icon='primitive-dot']):before {
		content: '\\ea71';
	}
	:host([icon='close-dirty']):before {
		content: '\\ea71';
	}
	:host([icon='debug-breakpoint']):before {
		content: '\\ea71';
	}
	:host([icon='debug-breakpoint-disabled']):before {
		content: '\\ea71';
	}
	:host([icon='debug-hint']):before {
		content: '\\ea71';
	}
	:host([icon='primitive-square']):before {
		content: '\\ea72';
	}
	:host([icon='edit']):before {
		content: '\\ea73';
	}
	:host([icon='pencil']):before {
		content: '\\ea73';
	}
	:host([icon='info']):before {
		content: '\\ea74';
	}
	:host([icon='issue-opened']):before {
		content: '\\ea74';
	}
	:host([icon='gist-private']):before {
		content: '\\ea75';
	}
	:host([icon='git-fork-private']):before {
		content: '\\ea75';
	}
	:host([icon='lock']):before {
		content: '\\ea75';
	}
	:host([icon='mirror-private']):before {
		content: '\\ea75';
	}
	:host([icon='close']):before {
		content: '\\ea76';
	}
	:host([icon='remove-close']):before {
		content: '\\ea76';
	}
	:host([icon='x']):before {
		content: '\\ea76';
	}
	:host([icon='repo-sync']):before {
		content: '\\ea77';
	}
	:host([icon='sync']):before {
		content: '\\ea77';
	}
	:host([icon='clone']):before {
		content: '\\ea78';
	}
	:host([icon='desktop-download']):before {
		content: '\\ea78';
	}
	:host([icon='beaker']):before {
		content: '\\ea79';
	}
	:host([icon='microscope']):before {
		content: '\\ea79';
	}
	:host([icon='vm']):before {
		content: '\\ea7a';
	}
	:host([icon='device-desktop']):before {
		content: '\\ea7a';
	}
	:host([icon='file']):before {
		content: '\\ea7b';
	}
	:host([icon='file-text']):before {
		content: '\\ea7b';
	}
	:host([icon='more']):before {
		content: '\\ea7c';
	}
	:host([icon='ellipsis']):before {
		content: '\\ea7c';
	}
	:host([icon='kebab-horizontal']):before {
		content: '\\ea7c';
	}
	:host([icon='mail-reply']):before {
		content: '\\ea7d';
	}
	:host([icon='reply']):before {
		content: '\\ea7d';
	}
	:host([icon='organization']):before {
		content: '\\ea7e';
	}
	:host([icon='organization-filled']):before {
		content: '\\ea7e';
	}
	:host([icon='organization-outline']):before {
		content: '\\ea7e';
	}
	:host([icon='new-file']):before {
		content: '\\ea7f';
	}
	:host([icon='file-add']):before {
		content: '\\ea7f';
	}
	:host([icon='new-folder']):before {
		content: '\\ea80';
	}
	:host([icon='file-directory-create']):before {
		content: '\\ea80';
	}
	:host([icon='trash']):before {
		content: '\\ea81';
	}
	:host([icon='trashcan']):before {
		content: '\\ea81';
	}
	:host([icon='history']):before {
		content: '\\ea82';
	}
	:host([icon='clock']):before {
		content: '\\ea82';
	}
	:host([icon='folder']):before {
		content: '\\ea83';
	}
	:host([icon='file-directory']):before {
		content: '\\ea83';
	}
	:host([icon='symbol-folder']):before {
		content: '\\ea83';
	}
	:host([icon='logo-github']):before {
		content: '\\ea84';
	}
	:host([icon='mark-github']):before {
		content: '\\ea84';
	}
	:host([icon='github']):before {
		content: '\\ea84';
	}
	:host([icon='terminal']):before {
		content: '\\ea85';
	}
	:host([icon='console']):before {
		content: '\\ea85';
	}
	:host([icon='repl']):before {
		content: '\\ea85';
	}
	:host([icon='zap']):before {
		content: '\\ea86';
	}
	:host([icon='symbol-event']):before {
		content: '\\ea86';
	}
	:host([icon='error']):before {
		content: '\\ea87';
	}
	:host([icon='stop']):before {
		content: '\\ea87';
	}
	:host([icon='variable']):before {
		content: '\\ea88';
	}
	:host([icon='symbol-variable']):before {
		content: '\\ea88';
	}
	:host([icon='array']):before {
		content: '\\ea8a';
	}
	:host([icon='symbol-array']):before {
		content: '\\ea8a';
	}
	:host([icon='symbol-module']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-package']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-namespace']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-object']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-method']):before {
		content: '\\ea8c';
	}
	:host([icon='symbol-function']):before {
		content: '\\ea8c';
	}
	:host([icon='symbol-constructor']):before {
		content: '\\ea8c';
	}
	:host([icon='symbol-boolean']):before {
		content: '\\ea8f';
	}
	:host([icon='symbol-null']):before {
		content: '\\ea8f';
	}
	:host([icon='symbol-numeric']):before {
		content: '\\ea90';
	}
	:host([icon='symbol-number']):before {
		content: '\\ea90';
	}
	:host([icon='symbol-structure']):before {
		content: '\\ea91';
	}
	:host([icon='symbol-struct']):before {
		content: '\\ea91';
	}
	:host([icon='symbol-parameter']):before {
		content: '\\ea92';
	}
	:host([icon='symbol-type-parameter']):before {
		content: '\\ea92';
	}
	:host([icon='symbol-key']):before {
		content: '\\ea93';
	}
	:host([icon='symbol-text']):before {
		content: '\\ea93';
	}
	:host([icon='symbol-reference']):before {
		content: '\\ea94';
	}
	:host([icon='go-to-file']):before {
		content: '\\ea94';
	}
	:host([icon='symbol-enum']):before {
		content: '\\ea95';
	}
	:host([icon='symbol-value']):before {
		content: '\\ea95';
	}
	:host([icon='symbol-ruler']):before {
		content: '\\ea96';
	}
	:host([icon='symbol-unit']):before {
		content: '\\ea96';
	}
	:host([icon='activate-breakpoints']):before {
		content: '\\ea97';
	}
	:host([icon='archive']):before {
		content: '\\ea98';
	}
	:host([icon='arrow-both']):before {
		content: '\\ea99';
	}
	:host([icon='arrow-down']):before {
		content: '\\ea9a';
	}
	:host([icon='arrow-left']):before {
		content: '\\ea9b';
	}
	:host([icon='arrow-right']):before {
		content: '\\ea9c';
	}
	:host([icon='arrow-small-down']):before {
		content: '\\ea9d';
	}
	:host([icon='arrow-small-left']):before {
		content: '\\ea9e';
	}
	:host([icon='arrow-small-right']):before {
		content: '\\ea9f';
	}
	:host([icon='arrow-small-up']):before {
		content: '\\eaa0';
	}
	:host([icon='arrow-up']):before {
		content: '\\eaa1';
	}
	:host([icon='bell']):before {
		content: '\\eaa2';
	}
	:host([icon='bold']):before {
		content: '\\eaa3';
	}
	:host([icon='book']):before {
		content: '\\eaa4';
	}
	:host([icon='bookmark']):before {
		content: '\\eaa5';
	}
	:host([icon='debug-breakpoint-conditional-unverified']):before {
		content: '\\eaa6';
	}
	:host([icon='debug-breakpoint-conditional']):before {
		content: '\\eaa7';
	}
	:host([icon='debug-breakpoint-conditional-disabled']):before {
		content: '\\eaa7';
	}
	:host([icon='debug-breakpoint-data-unverified']):before {
		content: '\\eaa8';
	}
	:host([icon='debug-breakpoint-data']):before {
		content: '\\eaa9';
	}
	:host([icon='debug-breakpoint-data-disabled']):before {
		content: '\\eaa9';
	}
	:host([icon='debug-breakpoint-log-unverified']):before {
		content: '\\eaaa';
	}
	:host([icon='debug-breakpoint-log']):before {
		content: '\\eaab';
	}
	:host([icon='debug-breakpoint-log-disabled']):before {
		content: '\\eaab';
	}
	:host([icon='briefcase']):before {
		content: '\\eaac';
	}
	:host([icon='broadcast']):before {
		content: '\\eaad';
	}
	:host([icon='browser']):before {
		content: '\\eaae';
	}
	:host([icon='bug']):before {
		content: '\\eaaf';
	}
	:host([icon='calendar']):before {
		content: '\\eab0';
	}
	:host([icon='case-sensitive']):before {
		content: '\\eab1';
	}
	:host([icon='check']):before {
		content: '\\eab2';
	}
	:host([icon='checklist']):before {
		content: '\\eab3';
	}
	:host([icon='chevron-down']):before {
		content: '\\eab4';
	}
	:host([icon='chevron-left']):before {
		content: '\\eab5';
	}
	:host([icon='chevron-right']):before {
		content: '\\eab6';
	}
	:host([icon='chevron-up']):before {
		content: '\\eab7';
	}
	:host([icon='chrome-close']):before {
		content: '\\eab8';
	}
	:host([icon='chrome-maximize']):before {
		content: '\\eab9';
	}
	:host([icon='chrome-minimize']):before {
		content: '\\eaba';
	}
	:host([icon='chrome-restore']):before {
		content: '\\eabb';
	}
	:host([icon='circle-outline']):before {
		content: '\\eabc';
	}
	:host([icon='debug-breakpoint-unverified']):before {
		content: '\\eabc';
	}
	:host([icon='circle-slash']):before {
		content: '\\eabd';
	}
	:host([icon='circuit-board']):before {
		content: '\\eabe';
	}
	:host([icon='clear-all']):before {
		content: '\\eabf';
	}
	:host([icon='clippy']):before {
		content: '\\eac0';
	}
	:host([icon='close-all']):before {
		content: '\\eac1';
	}
	:host([icon='cloud-download']):before {
		content: '\\eac2';
	}
	:host([icon='cloud-upload']):before {
		content: '\\eac3';
	}
	:host([icon='code']):before {
		content: '\\eac4';
	}
	:host([icon='collapse-all']):before {
		content: '\\eac5';
	}
	:host([icon='color-mode']):before {
		content: '\\eac6';
	}
	:host([icon='comment-discussion']):before {
		content: '\\eac7';
	}
	:host([icon='credit-card']):before {
		content: '\\eac9';
	}
	:host([icon='dash']):before {
		content: '\\eacc';
	}
	:host([icon='dashboard']):before {
		content: '\\eacd';
	}
	:host([icon='database']):before {
		content: '\\eace';
	}
	:host([icon='debug-continue']):before {
		content: '\\eacf';
	}
	:host([icon='debug-disconnect']):before {
		content: '\\ead0';
	}
	:host([icon='debug-pause']):before {
		content: '\\ead1';
	}
	:host([icon='debug-restart']):before {
		content: '\\ead2';
	}
	:host([icon='debug-start']):before {
		content: '\\ead3';
	}
	:host([icon='debug-step-into']):before {
		content: '\\ead4';
	}
	:host([icon='debug-step-out']):before {
		content: '\\ead5';
	}
	:host([icon='debug-step-over']):before {
		content: '\\ead6';
	}
	:host([icon='debug-stop']):before {
		content: '\\ead7';
	}
	:host([icon='debug']):before {
		content: '\\ead8';
	}
	:host([icon='device-camera-video']):before {
		content: '\\ead9';
	}
	:host([icon='device-camera']):before {
		content: '\\eada';
	}
	:host([icon='device-mobile']):before {
		content: '\\eadb';
	}
	:host([icon='diff-added']):before {
		content: '\\eadc';
	}
	:host([icon='diff-ignored']):before {
		content: '\\eadd';
	}
	:host([icon='diff-modified']):before {
		content: '\\eade';
	}
	:host([icon='diff-removed']):before {
		content: '\\eadf';
	}
	:host([icon='diff-renamed']):before {
		content: '\\eae0';
	}
	:host([icon='diff']):before {
		content: '\\eae1';
	}
	:host([icon='discard']):before {
		content: '\\eae2';
	}
	:host([icon='editor-layout']):before {
		content: '\\eae3';
	}
	:host([icon='empty-window']):before {
		content: '\\eae4';
	}
	:host([icon='exclude']):before {
		content: '\\eae5';
	}
	:host([icon='extensions']):before {
		content: '\\eae6';
	}
	:host([icon='eye-closed']):before {
		content: '\\eae7';
	}
	:host([icon='file-binary']):before {
		content: '\\eae8';
	}
	:host([icon='file-code']):before {
		content: '\\eae9';
	}
	:host([icon='file-media']):before {
		content: '\\eaea';
	}
	:host([icon='file-pdf']):before {
		content: '\\eaeb';
	}
	:host([icon='file-submodule']):before {
		content: '\\eaec';
	}
	:host([icon='file-symlink-directory']):before {
		content: '\\eaed';
	}
	:host([icon='file-symlink-file']):before {
		content: '\\eaee';
	}
	:host([icon='file-zip']):before {
		content: '\\eaef';
	}
	:host([icon='files']):before {
		content: '\\eaf0';
	}
	:host([icon='filter']):before {
		content: '\\eaf1';
	}
	:host([icon='flame']):before {
		content: '\\eaf2';
	}
	:host([icon='fold-down']):before {
		content: '\\eaf3';
	}
	:host([icon='fold-up']):before {
		content: '\\eaf4';
	}
	:host([icon='fold']):before {
		content: '\\eaf5';
	}
	:host([icon='folder-active']):before {
		content: '\\eaf6';
	}
	:host([icon='folder-opened']):before {
		content: '\\eaf7';
	}
	:host([icon='gear']):before {
		content: '\\eaf8';
	}
	:host([icon='gift']):before {
		content: '\\eaf9';
	}
	:host([icon='gist-secret']):before {
		content: '\\eafa';
	}
	:host([icon='gist']):before {
		content: '\\eafb';
	}
	:host([icon='git-commit']):before {
		content: '\\eafc';
	}
	:host([icon='git-compare']):before {
		content: '\\eafd';
	}
	:host([icon='compare-changes']):before {
		content: '\\eafd';
	}
	:host([icon='git-merge']):before {
		content: '\\eafe';
	}
	:host([icon='github-action']):before {
		content: '\\eaff';
	}
	:host([icon='github-alt']):before {
		content: '\\eb00';
	}
	:host([icon='globe']):before {
		content: '\\eb01';
	}
	:host([icon='grabber']):before {
		content: '\\eb02';
	}
	:host([icon='graph']):before {
		content: '\\eb03';
	}
	:host([icon='gripper']):before {
		content: '\\eb04';
	}
	:host([icon='heart']):before {
		content: '\\eb05';
	}
	:host([icon='home']):before {
		content: '\\eb06';
	}
	:host([icon='horizontal-rule']):before {
		content: '\\eb07';
	}
	:host([icon='hubot']):before {
		content: '\\eb08';
	}
	:host([icon='inbox']):before {
		content: '\\eb09';
	}
	:host([icon='issue-reopened']):before {
		content: '\\eb0b';
	}
	:host([icon='issues']):before {
		content: '\\eb0c';
	}
	:host([icon='italic']):before {
		content: '\\eb0d';
	}
	:host([icon='jersey']):before {
		content: '\\eb0e';
	}
	:host([icon='json']):before {
		content: '\\eb0f';
	}
	:host([icon='kebab-vertical']):before {
		content: '\\eb10';
	}
	:host([icon='key']):before {
		content: '\\eb11';
	}
	:host([icon='law']):before {
		content: '\\eb12';
	}
	:host([icon='lightbulb-autofix']):before {
		content: '\\eb13';
	}
	:host([icon='link-external']):before {
		content: '\\eb14';
	}
	:host([icon='link']):before {
		content: '\\eb15';
	}
	:host([icon='list-ordered']):before {
		content: '\\eb16';
	}
	:host([icon='list-unordered']):before {
		content: '\\eb17';
	}
	:host([icon='live-share']):before {
		content: '\\eb18';
	}
	:host([icon='loading']):before {
		content: '\\eb19';
	}
	:host([icon='location']):before {
		content: '\\eb1a';
	}
	:host([icon='mail-read']):before {
		content: '\\eb1b';
	}
	:host([icon='mail']):before {
		content: '\\eb1c';
	}
	:host([icon='markdown']):before {
		content: '\\eb1d';
	}
	:host([icon='megaphone']):before {
		content: '\\eb1e';
	}
	:host([icon='mention']):before {
		content: '\\eb1f';
	}
	:host([icon='milestone']):before {
		content: '\\eb20';
	}
	:host([icon='mortar-board']):before {
		content: '\\eb21';
	}
	:host([icon='move']):before {
		content: '\\eb22';
	}
	:host([icon='multiple-windows']):before {
		content: '\\eb23';
	}
	:host([icon='mute']):before {
		content: '\\eb24';
	}
	:host([icon='no-newline']):before {
		content: '\\eb25';
	}
	:host([icon='note']):before {
		content: '\\eb26';
	}
	:host([icon='octoface']):before {
		content: '\\eb27';
	}
	:host([icon='open-preview']):before {
		content: '\\eb28';
	}
	:host([icon='package']):before {
		content: '\\eb29';
	}
	:host([icon='paintcan']):before {
		content: '\\eb2a';
	}
	:host([icon='pin']):before {
		content: '\\eb2b';
	}
	:host([icon='play']):before {
		content: '\\eb2c';
	}
	:host([icon='run']):before {
		content: '\\eb2c';
	}
	:host([icon='plug']):before {
		content: '\\eb2d';
	}
	:host([icon='preserve-case']):before {
		content: '\\eb2e';
	}
	:host([icon='preview']):before {
		content: '\\eb2f';
	}
	:host([icon='project']):before {
		content: '\\eb30';
	}
	:host([icon='pulse']):before {
		content: '\\eb31';
	}
	:host([icon='question']):before {
		content: '\\eb32';
	}
	:host([icon='quote']):before {
		content: '\\eb33';
	}
	:host([icon='radio-tower']):before {
		content: '\\eb34';
	}
	:host([icon='reactions']):before {
		content: '\\eb35';
	}
	:host([icon='references']):before {
		content: '\\eb36';
	}
	:host([icon='refresh']):before {
		content: '\\eb37';
	}
	:host([icon='regex']):before {
		content: '\\eb38';
	}
	:host([icon='remote-explorer']):before {
		content: '\\eb39';
	}
	:host([icon='remote']):before {
		content: '\\eb3a';
	}
	:host([icon='remove']):before {
		content: '\\eb3b';
	}
	:host([icon='replace-all']):before {
		content: '\\eb3c';
	}
	:host([icon='replace']):before {
		content: '\\eb3d';
	}
	:host([icon='repo-clone']):before {
		content: '\\eb3e';
	}
	:host([icon='repo-force-push']):before {
		content: '\\eb3f';
	}
	:host([icon='repo-pull']):before {
		content: '\\eb40';
	}
	:host([icon='repo-push']):before {
		content: '\\eb41';
	}
	:host([icon='report']):before {
		content: '\\eb42';
	}
	:host([icon='request-changes']):before {
		content: '\\eb43';
	}
	:host([icon='rocket']):before {
		content: '\\eb44';
	}
	:host([icon='root-folder-opened']):before {
		content: '\\eb45';
	}
	:host([icon='root-folder']):before {
		content: '\\eb46';
	}
	:host([icon='rss']):before {
		content: '\\eb47';
	}
	:host([icon='ruby']):before {
		content: '\\eb48';
	}
	:host([icon='save-all']):before {
		content: '\\eb49';
	}
	:host([icon='save-as']):before {
		content: '\\eb4a';
	}
	:host([icon='save']):before {
		content: '\\eb4b';
	}
	:host([icon='screen-full']):before {
		content: '\\eb4c';
	}
	:host([icon='screen-normal']):before {
		content: '\\eb4d';
	}
	:host([icon='search-stop']):before {
		content: '\\eb4e';
	}
	:host([icon='server']):before {
		content: '\\eb50';
	}
	:host([icon='settings-gear']):before {
		content: '\\eb51';
	}
	:host([icon='settings']):before {
		content: '\\eb52';
	}
	:host([icon='shield']):before {
		content: '\\eb53';
	}
	:host([icon='smiley']):before {
		content: '\\eb54';
	}
	:host([icon='sort-precedence']):before {
		content: '\\eb55';
	}
	:host([icon='split-horizontal']):before {
		content: '\\eb56';
	}
	:host([icon='split-vertical']):before {
		content: '\\eb57';
	}
	:host([icon='squirrel']):before {
		content: '\\eb58';
	}
	:host([icon='star-full']):before {
		content: '\\eb59';
	}
	:host([icon='star-half']):before {
		content: '\\eb5a';
	}
	:host([icon='symbol-class']):before {
		content: '\\eb5b';
	}
	:host([icon='symbol-color']):before {
		content: '\\eb5c';
	}
	:host([icon='symbol-constant']):before {
		content: '\\eb5d';
	}
	:host([icon='symbol-enum-member']):before {
		content: '\\eb5e';
	}
	:host([icon='symbol-field']):before {
		content: '\\eb5f';
	}
	:host([icon='symbol-file']):before {
		content: '\\eb60';
	}
	:host([icon='symbol-interface']):before {
		content: '\\eb61';
	}
	:host([icon='symbol-keyword']):before {
		content: '\\eb62';
	}
	:host([icon='symbol-misc']):before {
		content: '\\eb63';
	}
	:host([icon='symbol-operator']):before {
		content: '\\eb64';
	}
	:host([icon='symbol-property']):before {
		content: '\\eb65';
	}
	:host([icon='wrench']):before {
		content: '\\eb65';
	}
	:host([icon='wrench-subaction']):before {
		content: '\\eb65';
	}
	:host([icon='symbol-snippet']):before {
		content: '\\eb66';
	}
	:host([icon='tasklist']):before {
		content: '\\eb67';
	}
	:host([icon='telescope']):before {
		content: '\\eb68';
	}
	:host([icon='text-size']):before {
		content: '\\eb69';
	}
	:host([icon='three-bars']):before {
		content: '\\eb6a';
	}
	:host([icon='thumbsdown']):before {
		content: '\\eb6b';
	}
	:host([icon='thumbsup']):before {
		content: '\\eb6c';
	}
	:host([icon='tools']):before {
		content: '\\eb6d';
	}
	:host([icon='triangle-down']):before {
		content: '\\eb6e';
	}
	:host([icon='triangle-left']):before {
		content: '\\eb6f';
	}
	:host([icon='triangle-right']):before {
		content: '\\eb70';
	}
	:host([icon='triangle-up']):before {
		content: '\\eb71';
	}
	:host([icon='twitter']):before {
		content: '\\eb72';
	}
	:host([icon='unfold']):before {
		content: '\\eb73';
	}
	:host([icon='unlock']):before {
		content: '\\eb74';
	}
	:host([icon='unmute']):before {
		content: '\\eb75';
	}
	:host([icon='unverified']):before {
		content: '\\eb76';
	}
	:host([icon='verified']):before {
		content: '\\eb77';
	}
	:host([icon='versions']):before {
		content: '\\eb78';
	}
	:host([icon='vm-active']):before {
		content: '\\eb79';
	}
	:host([icon='vm-outline']):before {
		content: '\\eb7a';
	}
	:host([icon='vm-running']):before {
		content: '\\eb7b';
	}
	:host([icon='watch']):before {
		content: '\\eb7c';
	}
	:host([icon='whitespace']):before {
		content: '\\eb7d';
	}
	:host([icon='whole-word']):before {
		content: '\\eb7e';
	}
	:host([icon='window']):before {
		content: '\\eb7f';
	}
	:host([icon='word-wrap']):before {
		content: '\\eb80';
	}
	:host([icon='zoom-in']):before {
		content: '\\eb81';
	}
	:host([icon='zoom-out']):before {
		content: '\\eb82';
	}
	:host([icon='list-filter']):before {
		content: '\\eb83';
	}
	:host([icon='list-flat']):before {
		content: '\\eb84';
	}
	:host([icon='list-selection']):before {
		content: '\\eb85';
	}
	:host([icon='selection']):before {
		content: '\\eb85';
	}
	:host([icon='list-tree']):before {
		content: '\\eb86';
	}
	:host([icon='debug-breakpoint-function-unverified']):before {
		content: '\\eb87';
	}
	:host([icon='debug-breakpoint-function']):before {
		content: '\\eb88';
	}
	:host([icon='debug-breakpoint-function-disabled']):before {
		content: '\\eb88';
	}
	:host([icon='debug-stackframe-active']):before {
		content: '\\eb89';
	}
	:host([icon='debug-stackframe-dot']):before {
		content: '\\eb8a';
	}
	:host([icon='debug-stackframe']):before {
		content: '\\eb8b';
	}
	:host([icon='debug-stackframe-focused']):before {
		content: '\\eb8b';
	}
	:host([icon='debug-breakpoint-unsupported']):before {
		content: '\\eb8c';
	}
	:host([icon='symbol-string']):before {
		content: '\\eb8d';
	}
	:host([icon='debug-reverse-continue']):before {
		content: '\\eb8e';
	}
	:host([icon='debug-step-back']):before {
		content: '\\eb8f';
	}
	:host([icon='debug-restart-frame']):before {
		content: '\\eb90';
	}
	:host([icon='debug-alt']):before {
		content: '\\eb91';
	}
	:host([icon='call-incoming']):before {
		content: '\\eb92';
	}
	:host([icon='call-outgoing']):before {
		content: '\\eb93';
	}
	:host([icon='menu']):before {
		content: '\\eb94';
	}
	:host([icon='expand-all']):before {
		content: '\\eb95';
	}
	:host([icon='feedback']):before {
		content: '\\eb96';
	}
	:host([icon='group-by-ref-type']):before {
		content: '\\eb97';
	}
	:host([icon='ungroup-by-ref-type']):before {
		content: '\\eb98';
	}
	:host([icon='account']):before {
		content: '\\eb99';
	}
	:host([icon='bell-dot']):before {
		content: '\\eb9a';
	}
	:host([icon='debug-console']):before {
		content: '\\eb9b';
	}
	:host([icon='library']):before {
		content: '\\eb9c';
	}
	:host([icon='output']):before {
		content: '\\eb9d';
	}
	:host([icon='run-all']):before {
		content: '\\eb9e';
	}
	:host([icon='sync-ignored']):before {
		content: '\\eb9f';
	}
	:host([icon='pinned']):before {
		content: '\\eba0';
	}
	:host([icon='github-inverted']):before {
		content: '\\eba1';
	}
	:host([icon='server-process']):before {
		content: '\\eba2';
	}
	:host([icon='server-environment']):before {
		content: '\\eba3';
	}
	:host([icon='pass']):before {
		content: '\\eba4';
	}
	:host([icon='issue-closed']):before {
		content: '\\eba4';
	}
	:host([icon='stop-circle']):before {
		content: '\\eba5';
	}
	:host([icon='play-circle']):before {
		content: '\\eba6';
	}
	:host([icon='record']):before {
		content: '\\eba7';
	}
	:host([icon='debug-alt-small']):before {
		content: '\\eba8';
	}
	:host([icon='vm-connect']):before {
		content: '\\eba9';
	}
	:host([icon='cloud']):before {
		content: '\\ebaa';
	}
	:host([icon='merge']):before {
		content: '\\ebab';
	}
	:host([icon='export']):before {
		content: '\\ebac';
	}
	:host([icon='graph-left']):before {
		content: '\\ebad';
	}
	:host([icon='magnet']):before {
		content: '\\ebae';
	}
	:host([icon='notebook']):before {
		content: '\\ebaf';
	}
	:host([icon='redo']):before {
		content: '\\ebb0';
	}
	:host([icon='check-all']):before {
		content: '\\ebb1';
	}
	:host([icon='pinned-dirty']):before {
		content: '\\ebb2';
	}
	:host([icon='pass-filled']):before {
		content: '\\ebb3';
	}
	:host([icon='circle-large-filled']):before {
		content: '\\ebb4';
	}
	:host([icon='circle-large-outline']):before {
		content: '\\ebb5';
	}
	:host([icon='combine']):before {
		content: '\\ebb6';
	}
	:host([icon='gather']):before {
		content: '\\ebb6';
	}
	:host([icon='table']):before {
		content: '\\ebb7';
	}
	:host([icon='variable-group']):before {
		content: '\\ebb8';
	}
	:host([icon='type-hierarchy']):before {
		content: '\\ebb9';
	}
	:host([icon='type-hierarchy-sub']):before {
		content: '\\ebba';
	}
	:host([icon='type-hierarchy-super']):before {
		content: '\\ebbb';
	}
	:host([icon='git-pull-request-create']):before {
		content: '\\ebbc';
	}
	:host([icon='run-above']):before {
		content: '\\ebbd';
	}
	:host([icon='run-below']):before {
		content: '\\ebbe';
	}
	:host([icon='notebook-template']):before {
		content: '\\ebbf';
	}
	:host([icon='debug-rerun']):before {
		content: '\\ebc0';
	}
	:host([icon='workspace-trusted']):before {
		content: '\\ebc1';
	}
	:host([icon='workspace-untrusted']):before {
		content: '\\ebc2';
	}
	:host([icon='workspace-unknown']):before {
		content: '\\ebc3';
	}
	:host([icon='terminal-cmd']):before {
		content: '\\ebc4';
	}
	:host([icon='terminal-debian']):before {
		content: '\\ebc5';
	}
	:host([icon='terminal-linux']):before {
		content: '\\ebc6';
	}
	:host([icon='terminal-powershell']):before {
		content: '\\ebc7';
	}
	:host([icon='terminal-tmux']):before {
		content: '\\ebc8';
	}
	:host([icon='terminal-ubuntu']):before {
		content: '\\ebc9';
	}
	:host([icon='terminal-bash']):before {
		content: '\\ebca';
	}
	:host([icon='arrow-swap']):before {
		content: '\\ebcb';
	}
	:host([icon='copy']):before {
		content: '\\ebcc';
	}
	:host([icon='person-add']):before {
		content: '\\ebcd';
	}
	:host([icon='filter-filled']):before {
		content: '\\ebce';
	}
	:host([icon='wand']):before {
		content: '\\ebcf';
	}
	:host([icon='debug-line-by-line']):before {
		content: '\\ebd0';
	}
	:host([icon='inspect']):before {
		content: '\\ebd1';
	}
	:host([icon='layers']):before {
		content: '\\ebd2';
	}
	:host([icon='layers-dot']):before {
		content: '\\ebd3';
	}
	:host([icon='layers-active']):before {
		content: '\\ebd4';
	}
	:host([icon='compass']):before {
		content: '\\ebd5';
	}
	:host([icon='compass-dot']):before {
		content: '\\ebd6';
	}
	:host([icon='compass-active']):before {
		content: '\\ebd7';
	}
	:host([icon='azure']):before {
		content: '\\ebd8';
	}
	:host([icon='issue-draft']):before {
		content: '\\ebd9';
	}
	:host([icon='git-pull-request-closed']):before {
		content: '\\ebda';
	}
	:host([icon='git-pull-request-draft']):before {
		content: '\\ebdb';
	}
	:host([icon='debug-all']):before {
		content: '\\ebdc';
	}
	:host([icon='debug-coverage']):before {
		content: '\\ebdd';
	}
	:host([icon='run-errors']):before {
		content: '\\ebde';
	}
	:host([icon='folder-library']):before {
		content: '\\ebdf';
	}
	:host([icon='debug-continue-small']):before {
		content: '\\ebe0';
	}
	:host([icon='beaker-stop']):before {
		content: '\\ebe1';
	}
	:host([icon='graph-line']):before {
		content: '\\ebe2';
	}
	:host([icon='graph-scatter']):before {
		content: '\\ebe3';
	}
	:host([icon='pie-chart']):before {
		content: '\\ebe4';
	}
	:host([icon='bracket']):before {
		content: '\\eb0f';
	}
	:host([icon='bracket-dot']):before {
		content: '\\ebe5';
	}
	:host([icon='bracket-error']):before {
		content: '\\ebe6';
	}
	:host([icon='lock-small']):before {
		content: '\\ebe7';
	}
	:host([icon='azure-devops']):before {
		content: '\\ebe8';
	}
	:host([icon='verified-filled']):before {
		content: '\\ebe9';
	}
	:host([icon='newline']):before {
		content: '\\ebea';
	}
	:host([icon='layout']):before {
		content: '\\ebeb';
	}
	:host([icon='layout-activitybar-left']):before {
		content: '\\ebec';
	}
	:host([icon='layout-activitybar-right']):before {
		content: '\\ebed';
	}
	:host([icon='layout-panel-left']):before {
		content: '\\ebee';
	}
	:host([icon='layout-panel-center']):before {
		content: '\\ebef';
	}
	:host([icon='layout-panel-justify']):before {
		content: '\\ebf0';
	}
	:host([icon='layout-panel-right']):before {
		content: '\\ebf1';
	}
	:host([icon='layout-panel']):before {
		content: '\\ebf2';
	}
	:host([icon='layout-sidebar-left']):before {
		content: '\\ebf3';
	}
	:host([icon='layout-sidebar-right']):before {
		content: '\\ebf4';
	}
	:host([icon='layout-statusbar']):before {
		content: '\\ebf5';
	}
	:host([icon='layout-menubar']):before {
		content: '\\ebf6';
	}
	:host([icon='layout-centered']):before {
		content: '\\ebf7';
	}
	:host([icon='target']):before {
		content: '\\ebf8';
	}
	:host([icon^='gl-']) {
		font-family: 'glicons';
	}
	:host([icon='gl-pinned-filled']):before {
		content: '\\f11c';
		/* TODO: see relative positioning needed in every use-case */
		position: relative;
		left: 1px;
	}
	:host([icon='gl-graph']):before {
		content: '\\f102';
	}
	:host([icon='gl-list-auto']):before {
		content: '\\f11a';
	}
	:host([icon='gl-clock']):before {
		content: '\\f11d';
	}
	:host([icon='gl-worktrees-view']):before {
		content: '\\f112';
	}
	:host([icon='gl-switch']):before {
		content: '\\f118';
	}

	@keyframes codicon-spin {
		100% {
			transform: rotate(360deg);
		}
	}

	:host([modifier='spin']) {
		/* Use steps to throttle FPS to reduce CPU usage */
		animation: codicon-spin 1.5s steps(30) infinite;
	}
	:host([icon='loading'][modifier='spin']) {
		/* Use steps to throttle FPS to reduce CPU usage */
		animation: codicon-spin 1.5s steps(30) infinite;

		/* custom speed & easing for loading icon */
		animation-duration: 1s !important;
		animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67) !important;
	}
`;let Mn=class extends U{constructor(){super(...arguments),this.icon="",this.modifier="",this.size=16}sizeChanged(){this.style.setProperty("--code-icon-size",`${this.size}px`)}};En([I],Mn.prototype,"icon",2),En([I],Mn.prototype,"modifier",2),En([I],Mn.prototype,"size",2),Mn=En([H({name:"code-icon",styles:Fn})],Mn);const qn=eo`
	.sr-only,
	.sr-only-focusable:not(:active):not(:focus) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		width: 1px;
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
	}
`,_n=(function(e,...t){const{styles:o,behaviors:n}=Xt(e,t);return new to(o,n)})`
	outline: 1px solid var(--focus-color);
	outline-offset: -1px;
`,Vn=eo`
	:host {
		box-sizing: border-box;
	}
	:host *,
	:host *::before,
	:host *::after {
		box-sizing: inherit;
	}
	[hidden] {
		display: none !important;
	}
`;var Nn=Object.defineProperty,zn=Object.getOwnPropertyDescriptor,jn=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?zn(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&Nn(t,o,s),s};const Un=Et`<template role="img" tabindex="${e=>e.tabIndex??"0"}">
	<slot></slot>
</template>`,Hn=eo`
	${Vn}

	:host {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: var(--avatar-size, 2.4rem);
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		border: 1px solid var(--color-background);
		background-color: var(--avatar-bg);
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		transition: all ease 200ms;
		font-size: calc(var(--avatar-size) * 0.42);
	}

	:host(:hover) {
		transform: scale(1.2);
	}

	:host(:focus-visible) {
		${_n}
	}
`;let Wn=class extends U{constructor(){super(...arguments),this.media="",this.static=!1}attributeChangedCallback(e,t,o){super.attributeChangedCallback(e,t,o),"media"===e&&t!==o&&(this.style.backgroundImage=`url(${this.media})`)}};function Gn(...e){return e.some((e=>(e?.length??0)>0))}jn([I],Wn.prototype,"media",2),jn([I({mode:"boolean"})],Wn.prototype,"static",2),Wn=jn([H({name:"avatar-item",template:Un,styles:Hn})],Wn);var Qn=Object.defineProperty,Yn=Object.getOwnPropertyDescriptor,Kn=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?Yn(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&Qn(t,o,s),s};const Zn=Et`<template>
	<slot ${Jt({property:"avatarNodes",filter:(Jn=Node.ELEMENT_NODE,e=>e.nodeType===Jn)})}></slot>
</template>`;var Jn;const Xn=eo`
	${Vn}

	:host {
		display: inline-flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	slot::slotted(*:not(:first-child)) {
		margin-left: calc(var(--avatar-size, 2.4rem) * -0.2);
	}

	:host(:focus-within) slot::slotted(*),
	:host(:hover) slot::slotted(*) {
		opacity: 0.5;
	}

	:host(:focus-within) slot::slotted(*:focus),
	:host(:hover) slot::slotted(*:hover) {
		opacity: 1;
		z-index: var(--avatar-selected-zindex, 1) !important;
	}
`;let er=class extends U{constructor(){super(...arguments),this.zindex=1}avatarNodesChanged(){if(null==this.avatarNodes)return;const e=this.avatarNodes.length;e!==this.zindex-1&&(this.zindex=e+1,this.style.setProperty("--avatar-selected-zindex",this.zindex.toString())),this.avatarNodes.forEach(((t,o)=>{t.style.zIndex=(e-o).toString()}))}};Kn([m],er.prototype,"avatarNodes",2),er=Kn([H({name:"avatar-stack",template:Zn,styles:Xn})],er);var tr=Object.defineProperty,or=Object.getOwnPropertyDescriptor;const nr=Et`
	<template role="table">
		<div class="thead" role="rowgroup">
			<slot name="head"></slot>
		</div>
		<div class="tbody" role="rowgroup">
			<slot></slot>
		</div>
	</template>
`,rr=eo`
	${Vn}

	:host {
		display: table;
		border-collapse: collapse;
		width: 100%;
	}

	.thead {
		display: table-header-group;
		color: var(--table-heading);
	}

	.tbody {
		display: table-row-group;
		color: var(--table-text);
	}

	.tbody ::slotted(*:hover),
	.tbody ::slotted(*:focus-within) {
		background-color: var(--background-05);
	}
`;let sr=class extends U{};sr=((e,t,o,n)=>{for(var r,s=n>1?void 0:n?or(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&tr(t,o,s),s})([H({name:"table-container",template:nr,styles:rr})],sr);var ir=Object.defineProperty,ar=Object.getOwnPropertyDescriptor;const cr=Et`
	<template role="row">
		<slot></slot>
	</template>
`,lr=eo`
	${Vn}

	:host {
		display: table-row;
	}
`;let hr=class extends U{};hr=((e,t,o,n)=>{for(var r,s=n>1?void 0:n?ar(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&ir(t,o,s),s})([H({name:"table-row",template:cr,styles:lr})],hr);var dr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,fr=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?ur(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&dr(t,o,s),s};const br=Et`
	<template role="${e=>e.cellRole}">
		<slot></slot>
	</template>
`,pr=eo`
	${Vn}

	:host {
		display: table-cell;
		vertical-align: top;
		padding: var(--table-spacing, 0.8rem);
		/* border-bottom: 1px solid var(--table-separator); */
		text-align: left;
	}

	:host(:first-child) {
		padding-left: var(--table-edge-spacing, 1.2rem);
	}
	:host(:last-child) {
		padding-right: var(--table-edge-spacing, 1.2rem);
	}

	:host([role='columnheader']) {
		text-transform: uppercase;
		font-weight: normal;
		padding-top: var(--table-heading-top-spacing, 0);
		padding-bottom: var(--table-heading-bottom-spacing, 1.2rem);
	}

	:host([pinned]) {
		background-color: var(--table-pinned-background);
		position: sticky;
		top: 0;
		z-index: 3;
	}
`;let gr=class extends U{constructor(){super(...arguments),this.header="",this.pinned=!1}get cellRole(){switch(this.header){case"column":return"columnheader";case"row":return"rowheader";default:return"cell"}}};fr([I],gr.prototype,"header",2),fr([I({mode:"boolean"})],gr.prototype,"pinned",2),gr=fr([H({name:"table-cell",template:br,styles:pr})],gr);const mr=e=>"function"==typeof e,vr=()=>null;function yr(e){return void 0===e?vr:mr(e)?e:()=>e}function wr(e,t,o){const n=mr(e)?e:()=>e,r=yr(t),s=yr(o);return(e,t)=>n(e,t)?r(e,t):s(e,t)}const Cr=[["year",629856e5,31536e6,"yr"],["month",2628e6,2628e6,"mo"],["week",6048e5,6048e5,"wk"],["day",864e5,864e5,"d"],["hour",36e5,36e5,"h"],["minute",6e4,6e4,"m"],["second",1e3,1e3,"s"]];let kr;let xr,$r,Pr;function Sr(e,t){const o=("number"==typeof e?e:e.getTime())-(new Date).getTime();for(const[e,n,r,s]of Cr){const i=Math.abs(o);if(i>=n||1e3===n){if(t){if(null==kr&&(null!=Pr?kr=Pr.resolvedOptions().locale:null!=$r?kr=$r.resolvedOptions().locale:(Pr=new Intl.RelativeTimeFormat(xr,{localeMatcher:"best fit",numeric:"always",style:"narrow"}),kr=Pr.resolvedOptions().locale)),"en"===kr||kr?.startsWith("en-")){return`${Math.round(i/r)}${s}`}return null==Pr&&(Pr=new Intl.RelativeTimeFormat(xr,{localeMatcher:"best fit",numeric:"always",style:"narrow"})),Pr.format(Math.round(o/r),e)}return null==$r&&($r=new Intl.RelativeTimeFormat(xr,{localeMatcher:"best fit",numeric:"auto",style:"long"})),$r.format(Math.round(o/r),e)}}return""}var Or=(e=>(e[e.VerificationRequired=-1]="VerificationRequired",e[e.Free=0]="Free",e[e.FreeInPreviewTrial=1]="FreeInPreviewTrial",e[e.FreePreviewTrialExpired=2]="FreePreviewTrialExpired",e[e.FreePlusInTrial=3]="FreePlusInTrial",e[e.FreePlusTrialExpired=4]="FreePlusTrialExpired",e[e.Paid=5]="Paid",e))(Or||{});function Rr(e,t){return Dr(e.plan.effective.expiresOn,t)}function Dr(e,t){return null!=e?function(e,t,o){const n=("number"==typeof t?t:t.getTime())-("number"==typeof e?e:e.getTime());switch(o){case"days":return Math.floor(n/864e5);case"hours":return Math.floor(n/36e5);case"minutes":return Math.floor(n/6e4);case"seconds":return Math.floor(n/1e3);default:return n}}(Date.now(),new Date(e),t):void 0}const{fromCharCode:Tr}=String;new TextEncoder;Object.getPrototypeOf((async function(){})).constructor;var Ar=Object.defineProperty,Br=Object.getOwnPropertyDescriptor,Ir=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?Br(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&Ar(t,o,s),s};const Lr=Et`
	<template>
		<div class="top" ?hidden="${e=>!e.hasTopNodes}">
			<slot ${Jt("typeNodes")} name="type"></slot>
			<slot ${Jt("actionsNodes")} name="actions"></slot>
		</div>
		<div class="heading" ?hidden="${e=>!e.hasHeadingNodes}">
			<slot ${Jt("headingNodes")} name="heading"></slot>
		</div>
		<div class="content"><slot></slot></div>
		${wr((e=>e.caret),Et`<span class="caret"></span>`)}
	</template>
`,Er=eo`
	${Vn}

	:host {
		position: absolute;
		width: var(--popover-width, 100%);
		max-width: var(--popover-max-width, 30rem);
		padding: 1.2rem 1.2rem 1.2rem;
		/* update with a standardized z-index */
		z-index: 10;

		background-color: var(--popover-bg);

		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	:host([caret]:not([placement~='bottom'])) {
		transform: translateY(0.8rem);
	}

	:host([caret][placement~='bottom']) {
		transform: translateY(-0.8rem);
	}

	.top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		opacity: 0.5;
		margin-top: -0.4rem;
	}

	.heading {
		font-weight: 600;
	}

	.caret {
		position: absolute;
		width: 0;
		height: 0;
		border-left: 0.8rem solid transparent;
		border-right: 0.8rem solid transparent;
		border-bottom: 0.8rem solid var(--popover-bg);
	}

	:host(:not([placement~='bottom'])) .caret {
		bottom: 100%;
	}

	:host([placement~='bottom']) .caret {
		top: 100%;
		transform: rotate(180deg);
	}

	:host(:not([placement~='end'])) .caret {
		left: 1.2rem;
	}

	:host([placement~='end']) .caret {
		right: 1.2rem;
	}
`;let Fr=class extends U{constructor(){super(...arguments),this.open=!1,this.caret=!0}get hasTopNodes(){return Gn(this.typeNodes,this.actionsNodes)}get hasHeadingNodes(){return Gn(this.headingNodes)}};Ir([I({mode:"boolean"})],Fr.prototype,"open",2),Ir([I({mode:"boolean"})],Fr.prototype,"caret",2),Ir([I],Fr.prototype,"placement",2),Ir([m],Fr.prototype,"typeNodes",2),Ir([m],Fr.prototype,"actionsNodes",2),Ir([m],Fr.prototype,"headingNodes",2),Ir([v],Fr.prototype,"hasTopNodes",1),Ir([v],Fr.prototype,"hasHeadingNodes",1),Fr=Ir([H({name:"pop-over",template:Lr,styles:Er})],Fr);var Mr=Object.defineProperty,qr=Object.getOwnPropertyDescriptor,_r=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?qr(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&Mr(t,o,s),s};const Vr=Et`
	<template>
		<span class="badge is-help">
			<span class="repo-access ${e=>e.isPro?"is-pro":""}">✨</span> ${e=>e.label}
		</span>
		${wr((e=>null!=e.subText),Et`&nbsp;&nbsp;<small>${e=>e.subText}</small>`)}
		<pop-over placement="${e=>e.placement}" class="badge-popover">
			${e=>e.popoverText}
			<br /><br />
			✨ indicates GitLens+ features
		</pop-over>
	</template>
`,Nr=eo`
	${Vn}

	:host {
		position: relative;
	}

	:host(:focus) {
		${_n}
	}

	.badge {
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--color-foreground);
	}
	.badge.is-help {
		cursor: help;
	}

	.badge small {
		font-size: inherit;
		opacity: 0.6;
		font-weight: 400;
	}

	.badge-container {
		position: relative;
	}

	.badge-popover {
		width: max-content;
		right: 0;
		top: 100%;
		text-align: left;
	}

	.badge:not(:hover) ~ .badge-popover {
		display: none;
	}
`;let zr=class extends U{constructor(){super(...arguments),this.placement="top end"}get isPro(){return null!=this.subscription&&![Or.Free,Or.FreePreviewTrialExpired,Or.FreePlusTrialExpired,Or.VerificationRequired].includes(this.subscription.state)}get isTrial(){return null!=this.subscription&&[Or.FreeInPreviewTrial,Or.FreePlusInTrial].includes(this.subscription?.state)}get label(){if(null==this.subscription)return"GitLens Free";let e=this.subscription.plan.effective.name;switch(this.subscription?.state){case Or.Free:case Or.FreePreviewTrialExpired:case Or.FreePlusTrialExpired:e="GitLens Free";break;case Or.FreeInPreviewTrial:case Or.FreePlusInTrial:e="GitLens Pro (Trial)";break;case Or.VerificationRequired:e=`${e} (Unverified)`}return e}get subText(){if(this.isTrial){const e=Rr(this.subscription,"days")??0;return`${e<1?"<1 day":function(e,t,o){if(null==o)return`${t} ${e}${1===t?"":"s"}`;const n=1===t?e:o.plural??`${e}s`;return o.only?n:`${0===t?o.zero??t:o.format?.(t)??t}${o.infix??" "}${n}`}("day",e)} left`}}get popoverText(){return this.isPro?"You have access to all GitLens and GitLens+ features on any repo.":"You have access to GitLens+ features on local & public repos, and all other GitLens features on any repo."}};function jr(e,t=new Date){const o=Math.floor((t.getTime()-e.getTime())/1e3);let n="ok";return Math.floor(o/31536e3)>=1||Math.floor(o/2592e3)>=1||Math.floor(o/604800)>=1?n="danger":Math.floor(o/86400)>=1&&(n="warning"),{label:Sr(e,!0),tooltip:Sr(e),status:n}}function Ur(e,t,o){return{index:e,removed:t,addedCount:o}}_r([I],zr.prototype,"placement",2),_r([m],zr.prototype,"subscription",2),_r([v],zr.prototype,"isPro",1),_r([v],zr.prototype,"isTrial",1),_r([v],zr.prototype,"label",1),_r([v],zr.prototype,"subText",1),_r([v],zr.prototype,"popoverText",1),zr=_r([H({name:"account-badge",template:Vr,styles:Nr})],zr);const Hr=0,Wr=1,Gr=2,Qr=3;function Yr(e,t,o,n,r,i){let a=0,c=0;const l=Math.min(o-t,i-r);if(0===t&&0===r&&(a=function(e,t,o){for(let n=0;n<o;++n)if(e[n]!==t[n])return n;return o}(e,n,l)),o===e.length&&i===n.length&&(c=function(e,t,o){let n=e.length,r=t.length,s=0;for(;s<o&&e[--n]===t[--r];)s++;return s}(e,n,l-a)),r+=a,i-=c,(o-=c)-(t+=a)==0&&i-r==0)return s;if(t===o){const e=Ur(t,[],0);for(;r<i;)e.removed.push(n[r++]);return[e]}if(r===i)return[Ur(t,[],o-t)];const h=function(e){let t=e.length-1,o=e[0].length-1,n=e[t][o];const r=[];for(;t>0||o>0;){if(0===t){r.push(Gr),o--;continue}if(0===o){r.push(Qr),t--;continue}const s=e[t-1][o-1],i=e[t-1][o],a=e[t][o-1];let c;c=i<a?i<s?i:s:a<s?a:s,c===s?(s===n?r.push(Hr):(r.push(Wr),n=s),t--,o--):c===i?(r.push(Qr),t--,n=i):(r.push(Gr),o--,n=a)}return r.reverse(),r}(function(e,t,o,n,r,s){const i=s-r+1,a=o-t+1,c=new Array(i);let l,h;for(let e=0;e<i;++e)c[e]=new Array(a),c[e][0]=e;for(let e=0;e<a;++e)c[0][e]=e;for(let o=1;o<i;++o)for(let s=1;s<a;++s)e[t+s-1]===n[r+o-1]?c[o][s]=c[o-1][s-1]:(l=c[o-1][s]+1,h=c[o][s-1]+1,c[o][s]=l<h?l:h);return c}(e,t,o,n,r,i)),d=[];let u,f=t,b=r;for(let e=0;e<h.length;++e)switch(h[e]){case Hr:void 0!==u&&(d.push(u),u=void 0),f++,b++;break;case Wr:void 0===u&&(u=Ur(f,[],0)),u.addedCount++,f++,u.removed.push(n[b]),b++;break;case Gr:void 0===u&&(u=Ur(f,[],0)),u.addedCount++,f++;break;case Qr:void 0===u&&(u=Ur(f,[],0)),u.removed.push(n[b]),b++}return void 0!==u&&d.push(u),d}const Kr=Array.prototype.push;function Zr(e,t,o,n){const r=Ur(t,o,n);let s=!1,i=0;for(let t=0;t<e.length;t++){const o=e[t];if(o.index+=i,s)continue;const n=(a=r.index,c=r.index+r.removed.length,l=o.index,h=o.index+o.addedCount,c<l||h<a?-1:c===l||h===a?0:a<l?c<h?c-l:h-l:h<c?h-a:c-a);if(n>=0){e.splice(t,1),t--,i-=o.addedCount-o.removed.length,r.addedCount+=o.addedCount-n;const a=r.removed.length+o.removed.length-n;if(r.addedCount||a){let e=o.removed;if(r.index<o.index){const t=r.removed.slice(0,o.index-r.index);Kr.apply(t,e),e=t}if(r.index+r.removed.length>o.index+o.addedCount){const t=r.removed.slice(o.index+o.addedCount-r.index);Kr.apply(e,t)}r.removed=e,o.index<r.index&&(r.index=o.index)}else s=!0}else if(r.index<o.index){s=!0,e.splice(t,0,r),t++;const n=r.addedCount-r.removed.length;o.index+=n,i+=n}}var a,c,l,h;s||e.push(r)}function Jr(e,t){let o=[];const n=function(e){const t=[];for(let o=0,n=e.length;o<n;o++){const n=e[o];Zr(t,n.index,n.removed,n.addedCount)}return t}(t);for(let t=0,r=n.length;t<r;++t){const r=n[t];1!==r.addedCount||1!==r.removed.length?o=o.concat(Yr(e,r.index,r.index+r.addedCount,r.removed,0,r.removed.length)):r.removed[0]!==e[r.index]&&o.push(r)}return o}let Xr=!1;function es(e,t){let o=e.index;const n=t.length;return o>n?o=n-e.addedCount:o<0&&(o=n+e.removed.length+o-e.addedCount),o<0&&(o=0),e.index=o,e}class ts extends b{constructor(e){super(e),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(e,"$fastController",{value:this,enumerable:!1})}subscribe(e){this.flush(),super.subscribe(e)}addSplice(e){void 0===this.splices?this.splices=[e]:this.splices.push(e),this.needsQueue&&(this.needsQueue=!1,f.queueUpdate(this))}reset(e){this.oldCollection=e,this.needsQueue&&(this.needsQueue=!1,f.queueUpdate(this))}flush(){const e=this.splices,t=this.oldCollection;if(void 0===e&&void 0===t)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;const o=void 0===t?Jr(this.source,e):Yr(this.source,0,this.source.length,t,0,t.length);this.notify(o)}}const os=Object.freeze({positioning:!1,recycle:!0});function ns(e,t,o,n){e.bind(t[o],n)}function rs(e,t,o,n){const r=Object.create(n);r.index=o,r.length=t.length,e.bind(t[o],r)}class ss{constructor(e,t,o,n,r,s){this.location=e,this.itemsBinding=t,this.templateBinding=n,this.options=s,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=ns,this.itemsBindingObserver=g.binding(t,this,o),this.templateBindingObserver=g.binding(n,this,r),s.positioning&&(this.bindView=rs)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,null!==this.itemsObserver&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e,t){e===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):e===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(t)}observeItems(e=!1){if(!this.items)return void(this.items=s);const t=this.itemsObserver,o=this.itemsObserver=g.getNotifier(this.items),n=t!==o;n&&null!==t&&t.unsubscribe(this),(n||e)&&o.subscribe(this)}updateViews(e){const t=this.childContext,o=this.views,n=this.bindView,r=this.items,s=this.template,i=this.options.recycle,a=[];let c=0,l=0;for(let h=0,d=e.length;h<d;++h){const d=e[h],u=d.removed;let f=0,b=d.index;const p=b+d.addedCount,g=o.splice(d.index,u.length),m=l=a.length+g.length;for(;b<p;++b){const e=o[b],h=e?e.firstChild:this.location;let d;i&&l>0?(f<=m&&g.length>0?(d=g[f],f++):(d=a[c],c++),l--):d=s.create(),o.splice(b,0,d),n(d,r,b,t),d.insertBefore(h)}g[f]&&a.push(...g.slice(f))}for(let e=c,t=a.length;e<t;++e)a[e].dispose();if(this.options.positioning)for(let e=0,t=o.length;e<t;++e){const n=o[e].context;n.length=t,n.index=e}}refreshAllViews(e=!1){const t=this.items,o=this.childContext,n=this.template,r=this.location,s=this.bindView;let i=t.length,a=this.views,c=a.length;if(0!==i&&!e&&this.options.recycle||(Bt.disposeContiguousBatch(a),c=0),0===c){this.views=a=new Array(i);for(let e=0;e<i;++e){const i=n.create();s(i,t,e,o),a[e]=i,i.insertBefore(r)}}else{let e=0;for(;e<i;++e)if(e<c){s(a[e],t,e,o)}else{const i=n.create();s(i,t,e,o),a.push(i),i.insertBefore(r)}const l=a.splice(e,c-e);for(e=0,i=l.length;e<i;++e)l[e].dispose()}}unbindAllViews(){const e=this.views;for(let t=0,o=e.length;t<o;++t)e[t].unbind()}}class is extends lt{constructor(e,t,o){super(),this.itemsBinding=e,this.templateBinding=t,this.options=o,this.createPlaceholder=f.createBlockPlaceholder,function(){if(Xr)return;Xr=!0,g.setArrayObserverFactory((e=>new ts(e)));const e=Array.prototype;if(e.$fastPatch)return;Reflect.defineProperty(e,"$fastPatch",{value:1,enumerable:!1});const t=e.pop,o=e.push,n=e.reverse,r=e.shift,s=e.sort,i=e.splice,a=e.unshift;e.pop=function(){const e=this.length>0,o=t.apply(this,arguments),n=this.$fastController;return void 0!==n&&e&&n.addSplice(Ur(this.length,[o],0)),o},e.push=function(){const e=o.apply(this,arguments),t=this.$fastController;return void 0!==t&&t.addSplice(es(Ur(this.length-arguments.length,[],arguments.length),this)),e},e.reverse=function(){let e;const t=this.$fastController;void 0!==t&&(t.flush(),e=this.slice());const o=n.apply(this,arguments);return void 0!==t&&t.reset(e),o},e.shift=function(){const e=this.length>0,t=r.apply(this,arguments),o=this.$fastController;return void 0!==o&&e&&o.addSplice(Ur(0,[t],0)),t},e.sort=function(){let e;const t=this.$fastController;void 0!==t&&(t.flush(),e=this.slice());const o=s.apply(this,arguments);return void 0!==t&&t.reset(e),o},e.splice=function(){const e=i.apply(this,arguments),t=this.$fastController;return void 0!==t&&t.addSplice(es(Ur(+arguments[0],e,arguments.length>2?arguments.length-2:0),this)),e},e.unshift=function(){const e=a.apply(this,arguments),t=this.$fastController;return void 0!==t&&t.addSplice(es(Ur(0,[],arguments.length),this)),e}}(),this.isItemsBindingVolatile=g.isVolatileBinding(e),this.isTemplateBindingVolatile=g.isVolatileBinding(t)}createBehavior(e){return new ss(e,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}}var as=Object.defineProperty,cs=Object.getOwnPropertyDescriptor,ls=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?cs(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&as(t,o,s),s};const hs=Et`
	<avatar-stack>
		${function(e,t,o=os){return new is(e,"function"==typeof t?t:()=>t,Object.assign(Object.assign({},os),o))}((e=>e.avatarItems),Et`<avatar-item media="${e=>e.avatarUrl}" title="${e=>e.name}"></avatar-item>`)}
		${wr((e=>null!=e.avatarPlusItems),Et`<avatar-item title="${e=>e.avatarPlusLabel}"
				>+${e=>e.avatarPlusItems?.length}</avatar-item
			>`)}
	</avatar-stack>
`,ds=eo``;let us=class extends U{constructor(){super(...arguments),this.avatars=[]}get avatarItems(){return this.avatars.length<=3?this.avatars:this.avatars.slice(0,2)}get avatarPlusItems(){if(!(this.avatars.length<=3))return this.avatars.slice(2)}get avatarPlusLabel(){if(null==this.avatarPlusItems)return;const e=this.avatarPlusItems.length;return this.avatarPlusItems.reduce(((t,o,n)=>`${t}, ${e===n-1?"and ":""}${o.name}`),"")}};ls([m],us.prototype,"avatars",2),ls([v],us.prototype,"avatarItems",1),ls([v],us.prototype,"avatarPlusItems",1),ls([v],us.prototype,"avatarPlusLabel",1),us=ls([H({name:"git-avatars",template:hs,styles:ds})],us);var fs=Object.defineProperty,bs=Object.getOwnPropertyDescriptor,ps=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?bs(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&fs(t,o,s),s};const gs=Et`
	<template role="row">
		<table-cell class="status">
			${wr((e=>!0===e.issue.closed),Et`<code-icon icon="pass"></code-icon>`)}
			${wr((e=>!0!==e.issue.closed),Et`<code-icon icon="issues"></code-icon>`)}
		</table-cell>
		<table-cell class="time"
			><span class="${e=>e.lastUpdatedClass}" title="${e=>e.lastUpdatedLabel}"
				>${e=>e.lastUpdated}</span
			></table-cell
		>
		<table-cell>
			${e=>e.issue.title} <a href="${e=>e.issue.url}">#${e=>e.issue.id}</a><br />
			<small>
				<span class="tag"><code-icon icon="repo"></code-icon>${e=>e.issue.repository.repo}</span>
			</small>
		</table-cell>
		<table-cell class="vcenter participants">
			${wr((e=>null!=e.issue.author),Et`
					<avatar-stack>
						<avatar-item
							media="${e=>e.issue.author?.avatarUrl}"
							title="${e=>e.issue.author?.name} (author)"
						></avatar-item>
					</avatar-stack>
				`)}
			${wr((e=>e.assignees.length>0),Et`<git-avatars :avatars="${e=>e.issue.assignees}"></git-avatars>`)}
		</table-cell>
		<table-cell class="vcenter">${e=>e.issue.commentsCount}</table-cell>
		<table-cell class="vcenter">${e=>e.issue.thumbsUpCount}</table-cell>
		<table-cell class="vcenter actions">
			<a href="${e=>e.issue.url}" title="Open issue on remote"><code-icon icon="globe"></code-icon></a>
		</table-cell>
	</template>
`,ms=eo`
	${Vn}

	:host {
		display: table-row;
	}

	:host(:focus) {
		${_n}
	}

	a {
		color: var(--vscode-textLink-foreground);
		text-decoration: none;
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground);
		text-decoration: underline;
	}

	a:focus {
		${_n}
	}

	code-icon {
		font-size: inherit;
	}

	.vcenter {
		vertical-align: middle;
	}

	.tag {
		display: inline-block;
		padding: 0.1rem 0.2rem;
		background-color: var(--background-05);
		color: var(--color-foreground--85);
		white-space: nowrap;
	}
	.tag code-icon {
		margin-right: 0.2rem;
	}

	.status {
		font-size: 1.6rem;
	}

	.time {
	}

	.icon-only {
	}

	.participants {
		white-space: nowrap;
	}

	.stats {
	}

	.actions {
		text-align: right;
		white-space: nowrap;
	}

	.actions a {
		box-sizing: border-box;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 3.2rem;
		height: 3.2rem;
		border-radius: 0.5rem;
		color: inherit;
		padding: 0.2rem;
		vertical-align: text-bottom;
		text-decoration: none;
		cursor: pointer;
	}
	.actions a:focus {
		outline: 1px solid var(--vscode-focusBorder);
		outline-offset: -1px;
	}
	.actions a:hover {
		background-color: var(--vscode-toolbar-hoverBackground);
	}
	.actions a:active {
		background-color: var(--vscode-toolbar-activeBackground);
	}

	.actions a code-icon {
		font-size: 1.6rem;
	}

	.stat-added {
		color: var(--vscode-gitDecoration-addedResourceForeground);
	}
	.stat-deleted {
		color: var(--vscode-gitDecoration-deletedResourceForeground);
	}

	.issue-open {
		color: var(--vscode-gitlens-openAutolinkedIssueIconColor);
	}
	.issue-closed {
		color: var(--vscode-gitlens-closedAutolinkedIssueIconColor);
	}

	.indicator-info {
		color: var(--vscode-problemsInfoIcon-foreground);
	}
	.indicator-warning {
		color: var(--vscode-problemsWarningIcon-foreground);
	}
	.indicator-error {
		color: var(--vscode-problemsErrorIcon-foreground);
	}
	.indicator-neutral {
		color: var(--color-alert-neutralBorder);
	}

	.pull-request-draft {
		/* color: var(--vscode-pullRequests-draft); */
		color: var(--color-foreground--85);
	}
	.pull-request-open {
		color: var(--vscode-gitlens-openPullRequestIconColor);
	}
	.pull-request-merged {
		color: var(--vscode-gitlens-mergedPullRequestIconColor);
	}
	.pull-request-closed {
		color: var(--vscode-gitlens-closedPullRequestIconColor);
	}
	.pull-request-notification {
		color: var(--vscode-pullRequests-notification);
	}

	${qn}
`;let vs=class extends U{get lastUpdatedDate(){return new Date(this.issue.date)}get lastUpdatedState(){return jr(this.lastUpdatedDate)}get lastUpdated(){return Sr(this.lastUpdatedDate,!0)}get lastUpdatedLabel(){return Sr(this.lastUpdatedDate)}get lastUpdatedClass(){switch(this.lastUpdatedState.status){case"danger":return"indicator-error";case"warning":return"indicator-warning";default:return""}}get indicator(){return""}get indicatorLabel(){}get assignees(){const e=this.issue?.assignees;if(null==e)return[];const t=this.issue.author;return null!=t?e.filter((e=>e.url!==t.url)):e}};ps([m],vs.prototype,"issue",2),ps([m],vs.prototype,"reasons",2),ps([v],vs.prototype,"lastUpdatedDate",1),ps([v],vs.prototype,"lastUpdatedState",1),ps([v],vs.prototype,"lastUpdated",1),ps([v],vs.prototype,"lastUpdatedLabel",1),ps([v],vs.prototype,"lastUpdatedClass",1),ps([v],vs.prototype,"indicator",1),ps([v],vs.prototype,"indicatorLabel",1),ps([v],vs.prototype,"assignees",1),vs=ps([H({name:"issue-row",template:gs,styles:ms})],vs);var ys=Object.defineProperty,ws=Object.getOwnPropertyDescriptor,Cs=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?ws(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&ys(t,o,s),s};const ks=Et`
	${wr((e=>e.state!==Or.Free),Et` <hr class="divider" /> `)}
	<div class="main">
		${wr((e=>e.state===Or.Free),Et`
				<!-- <h3>
					GitLens+ features are
					<a title="Learn more about GitLens+ features" href="command:gitlens.plus.learn"
						>powerful, additional features</a
					>
					that enhance your GitLens experience.
				</h3> -->

				<p class="mb-1">
					<vscode-button @click="${e=>e.fireAction("command:gitlens.plus.startPreviewTrial")}"
						>Try the Focus View</vscode-button
					>
				</p>
			`)}
		${wr((e=>e.state===Or.FreePreviewTrialExpired),Et`
				<h3>Extend Your GitLens Pro Trial</h3>
				<p>
					Your free 3-day GitLens Pro trial has ended, extend your trial to get an additional free 7-days of
					the Focus View and other GitLens+ features on private repos.
				</p>
				<p class="mb-1">
					<vscode-button @click="${e=>e.fireAction("command:gitlens.plus.loginOrSignUp")}"
						>Extend Pro Trial</vscode-button
					>
				</p>
			`)}
		${wr((e=>e.state===Or.FreePlusTrialExpired),Et`
				<h3>GitLens Pro Trial Expired</h3>
				<p>
					Your GitLens Pro trial has ended, please upgrade to GitLens Pro to continue to use the Focus View
					and other GitLens+ features on private repos.
				</p>
				<p class="mb-1">
					<vscode-button @click="${e=>e.fireAction("command:gitlens.plus.purchase")}"
						>Upgrade to Pro</vscode-button
					>
				</p>
			`)}
		${wr((e=>e.state===Or.VerificationRequired),Et`
				<h3>Please verify your email</h3>
				<p class="alert__message">
					Before you can also use the Focus View and other GitLens+ features on private repos, please verify
					your email address.
				</p>
				<p class="mb-1">
					<vscode-button @click="${e=>e.fireAction("command:gitlens.plus.resendVerification")}"
						>Resend Verification Email</vscode-button
					>
				</p>
				<p class="mb-1">
					<vscode-button @click="${e=>e.fireAction("command:gitlens.plus.validate")}"
						>Refresh Verification Status</vscode-button
					>
				</p>
			`)}
	</div>

	<div class="secondary">
		<p class="mb-1">
			All other
			<a title="Learn more about GitLens+ features" href="command:gitlens.plus.learn">GitLens+ features</a>
			are free for local and public repos, no account required, while upgrading to GitLens Pro gives you access on
			private repos.
		</p>
		<p class="mb-0">All other GitLens features can always be used on any repo.</p>
	</div>
`,xs=eo`
	${Vn}

	:host {
		display: block;
		/* text-align: center; */
	}

	:host(:focus) {
		outline: none;
	}

	a {
		color: var(--vscode-textLink-foreground);
		text-decoration: none;
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground);
		text-decoration: underline;
	}

	a:focus {
		${_n}
	}

	h3,
	p {
		margin-top: 0;
	}

	h3 a {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--color-foreground--50);
	}

	h3 a:hover {
		text-decoration-color: inherit;
	}

	.mb-1 {
		margin-bottom: 0.6rem;
	}
	.mb-0 {
		margin-bottom: 0;
	}

	.main {
		text-align: center;
		margin: 3rem 0;
	}

	.secondary {
		font-size: 1.4rem;
	}

	.divider {
		display: block;
		height: 0;
		margin: 0.6rem;
		border: none;
		border-top: 0.1rem solid var(--vscode-menu-separatorBackground);
	}
`;let $s=class extends U{get state(){return this.subscription?.state??Or.Free}get isPro(){return![Or.Free,Or.FreePreviewTrialExpired,Or.FreePlusTrialExpired,Or.VerificationRequired].includes(this.state)}get planName(){const e=this.subscription?.plan.effective.name;switch(this.state){case Or.Free:case Or.FreePreviewTrialExpired:case Or.FreePlusTrialExpired:return"GitLens Free";case Or.FreeInPreviewTrial:case Or.FreePlusInTrial:return"GitLens Pro (Trial)";case Or.VerificationRequired:return`${e} (Unverified)`;default:return e}}fireAction(e){this.$emit("action",e)}};Cs([m],$s.prototype,"subscription",2),Cs([v],$s.prototype,"state",1),Cs([v],$s.prototype,"isPro",1),Cs([v],$s.prototype,"planName",1),$s=Cs([H({name:"plus-content",template:ks,styles:xs})],$s);var Ps=Object.defineProperty,Ss=Object.getOwnPropertyDescriptor,Os=(e,t,o,n)=>{for(var r,s=n>1?void 0:n?Ss(t,o):t,i=e.length-1;i>=0;i--)(r=e[i])&&(s=(n?r(t,o,s):r(s))||s);return n&&s&&Ps(t,o,s),s};const Rs=Et`
	<template role="row">
		<table-cell class="status">
			${wr((e=>!0===e.pullRequest.isDraft),Et`<code-icon icon="git-pull-request-draft" title="draft"></code-icon>`)}
			${wr((e=>!0!==e.pullRequest.isDraft),Et`<code-icon class="pull-request-draft" icon="git-pull-request" title="open"></code-icon>`)}
			${wr((e=>"changes"===e.indicator),Et`<code-icon class="indicator-error" icon="request-changes" title="changes requested"></code-icon>`)}
			${wr((e=>"ready"===e.indicator),Et`<code-icon class="indicator-info" icon="pass" title="approved and ready to merge"></code-icon>`)}
			${wr((e=>"conflicting"===e.indicator),Et`<code-icon
					class="indicator-error"
					icon="bracket-error"
					title="cannot be merged due to merge conflicts"
				></code-icon>`)}
			${wr((e=>"checks"===e.indicator),Et`<code-icon icon="error" title="checks failed"></code-icon>`)}
		</table-cell>
		<table-cell class="time"
			><span class="${e=>e.lastUpdatedClass}" title="${e=>e.lastUpdatedLabel}"
				>${e=>e.lastUpdated}</span
			></table-cell
		>
		<table-cell>
			${e=>e.pullRequest.title} <a href="${e=>e.pullRequest.url}">#${e=>e.pullRequest.id}</a><br />
			<small>
				<span class="tag"><code-icon icon="repo"></code-icon>${e=>e.pullRequest.refs?.base.repo}</span>
				into
				${wr((e=>!0!==e.pullRequest.refs?.isCrossRepository),Et`
						<span class="tag"
							><code-icon icon="source-control"></code-icon>${e=>e.pullRequest.refs?.base.branch}</span
						>
						from
						<span class="tag"
							><code-icon icon="source-control"></code-icon>${e=>e.pullRequest.refs?.head.branch}</span
						>
					`)}
				${wr((e=>!0===e.pullRequest.refs?.isCrossRepository),Et`
						<span class="tag"
							><code-icon icon="source-control"></code-icon>${e=>e.pullRequest.refs?.base.owner}:${e=>e.pullRequest.refs?.base.branch}</span
						>
						from
						<span class="tag"
							><code-icon icon="source-control"></code-icon>${e=>e.pullRequest.refs?.head.owner}:${e=>e.pullRequest.refs?.head.branch}</span
						>
					`)}
			</small>
		</table-cell>
		<table-cell class="vcenter participants">
			${wr((e=>null!=e.pullRequest.author),Et`
					<avatar-stack>
						<avatar-item
							media="${e=>e.pullRequest.author.avatarUrl}"
							title="${e=>e.pullRequest.author.name} (author)"
						></avatar-item>
					</avatar-stack>
				`)}
			${wr((e=>e.assignees.length>0),Et`<git-avatars :avatars="${e=>e.pullRequest.assignees}"></git-avatars>`)}
		</table-cell>
		<table-cell class="vcenter">${e=>e.pullRequest.comments}</table-cell>
		<table-cell class="vcenter stats"
			><span class="stat-added">+${e=>e.pullRequest.additions}</span>
			<span class="stat-deleted">-${e=>e.pullRequest.deletions}</span></table-cell
		>
		<table-cell class="vcenter actions">
			<a
				href="#"
				tabindex="${e=>e.isCurrentWorktree||e.isCurrentBranch?-1:null}"
				title="${e=>e.isCurrentWorktree?"Already on this workree":"Open Worktree..."}"
				aria-label="${e=>e.isCurrentWorktree?"Already on this workree":"Open Worktree..."}"
				@click="${(e,t)=>e.onOpenWorktreeClick(t.event)}"
				><code-icon icon="gl-worktrees-view"></code-icon></a
			><a
				href="#"
				tabindex="${e=>e.hasWorktree||e.isCurrentBranch?-1:null}"
				title="${e=>e.isCurrentBranch?"Already on this branch":"Switch to Branch..."}"
				aria-label="${e=>e.isCurrentBranch?"Already on this branch":"Switch to Branch..."}"
				@click="${(e,t)=>e.onSwitchBranchClick(t.event)}"
				><code-icon icon="gl-switch"></code-icon
			></a>
		</table-cell>
	</template>
`,Ds=eo`
	${Vn}

	:host {
		display: table-row;
	}

	:host(:focus) {
		${_n}
	}

	a {
		color: var(--vscode-textLink-foreground);
		text-decoration: none;
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground);
		text-decoration: underline;
	}

	a:focus {
		${_n}
	}

	code-icon {
		font-size: inherit;
	}

	.vcenter {
		vertical-align: middle;
	}

	.tag {
		display: inline-block;
		padding: 0.1rem 0.2rem;
		background-color: var(--background-05);
		color: var(--color-foreground--85);
		white-space: nowrap;
	}
	.tag code-icon {
		margin-right: 0.2rem;
	}

	.status {
		font-size: 1.6rem;
	}

	.time {
	}

	.icon-only {
	}

	.participants {
		white-space: nowrap;
	}

	.stats {
	}

	.actions {
		text-align: right;
		white-space: nowrap;
		width: 6.4rem;
	}

	.actions a {
		box-sizing: border-box;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 3.2rem;
		height: 3.2rem;
		border-radius: 0.5rem;
		color: inherit;
		padding: 0.2rem;
		vertical-align: text-bottom;
		text-decoration: none;
		cursor: pointer;
	}
	.actions a:focus {
		outline: 1px solid var(--vscode-focusBorder);
		outline-offset: -1px;
	}
	.actions a:hover {
		background-color: var(--vscode-toolbar-hoverBackground);
	}
	.actions a:active {
		background-color: var(--vscode-toolbar-activeBackground);
	}
	.actions a[tabindex='-1'] {
		opacity: 0.5;
		cursor: default;
	}

	.actions a code-icon {
		font-size: 1.6rem;
	}

	.stat-added {
		color: var(--vscode-gitDecoration-addedResourceForeground);
	}
	.stat-deleted {
		color: var(--vscode-gitDecoration-deletedResourceForeground);
	}

	.issue-open {
		color: var(--vscode-gitlens-openAutolinkedIssueIconColor);
	}
	.issue-closed {
		color: var(--vscode-gitlens-closedAutolinkedIssueIconColor);
	}

	.indicator-info {
		color: var(--vscode-problemsInfoIcon-foreground);
	}
	.indicator-warning {
		color: var(--vscode-problemsWarningIcon-foreground);
	}
	.indicator-error {
		color: var(--vscode-problemsErrorIcon-foreground);
	}
	.indicator-neutral {
		color: var(--color-alert-neutralBorder);
	}

	.pull-request-draft {
		/* color: var(--vscode-pullRequests-draft); */
		color: var(--color-foreground--85);
	}
	.pull-request-open {
		color: var(--vscode-gitlens-openPullRequestIconColor);
	}
	.pull-request-merged {
		color: var(--vscode-gitlens-mergedPullRequestIconColor);
	}
	.pull-request-closed {
		color: var(--vscode-gitlens-closedPullRequestIconColor);
	}
	.pull-request-notification {
		color: var(--vscode-pullRequests-notification);
	}

	${qn}
`;let Ts=class extends U{constructor(){super(...arguments),this.isCurrentBranch=!1,this.isCurrentWorktree=!1,this.hasWorktree=!1,this.hasLocalBranch=!1}get lastUpdatedDate(){return new Date(this.pullRequest.date)}get lastUpdatedState(){return jr(this.lastUpdatedDate)}get lastUpdated(){return Sr(this.lastUpdatedDate,!0)}get lastUpdatedLabel(){return Sr(this.lastUpdatedDate)}get lastUpdatedClass(){switch(this.lastUpdatedState.status){case"danger":return"indicator-error";case"warning":return"indicator-warning";default:return""}}get indicator(){return null==this.pullRequest?"":!1===this.checks?"checks":"ChangesRequested"===this.pullRequest.reviewDecision?"changes":"Approved"===this.pullRequest.reviewDecision&&"Mergeable"===this.pullRequest.mergeableState?"ready":"Conflicting"===this.pullRequest.mergeableState?"conflicting":""}get indicatorLabel(){}get assignees(){const e=this.pullRequest?.assignees;if(null==e)return[];const t=this.pullRequest.author;return null!=t?e.filter((e=>e.name!==t.name)):e}onOpenWorktreeClick(e){if(this.isCurrentWorktree)return e.preventDefault(),void e.stopImmediatePropagation();this.$emit("open-worktree",this.pullRequest)}onSwitchBranchClick(e){if(this.isCurrentBranch)return e.preventDefault(),void e.stopImmediatePropagation();this.$emit("switch-branch",this.pullRequest)}};Os([m],Ts.prototype,"pullRequest",2),Os([m],Ts.prototype,"reasons",2),Os([m],Ts.prototype,"checks",2),Os([m],Ts.prototype,"isCurrentBranch",2),Os([m],Ts.prototype,"isCurrentWorktree",2),Os([m],Ts.prototype,"hasWorktree",2),Os([m],Ts.prototype,"hasLocalBranch",2),Os([v],Ts.prototype,"lastUpdatedDate",1),Os([v],Ts.prototype,"lastUpdatedState",1),Os([v],Ts.prototype,"lastUpdated",1),Os([v],Ts.prototype,"lastUpdatedLabel",1),Os([v],Ts.prototype,"lastUpdatedClass",1),Os([v],Ts.prototype,"indicator",1),Os([v],Ts.prototype,"indicatorLabel",1),Os([v],Ts.prototype,"assignees",1),Ts=Os([H({name:"pull-request-row",template:Rs,styles:Ds})],Ts);class As extends Bn{constructor(){super("FocusApp")}onInitialize(){var e;this.log(`${this.appName}.onInitialize`),st.getOrCreate(e).withPrefix("vscode").register(qo()),this.renderContent()}onBind(){const e=super.onBind?.()??[];return e.push(tn.on("#pr-filter [data-tab]","click",(e=>this.onSelectTab(e,(e=>{this._prFilter=e,this.renderPullRequests()}))))),e.push(tn.on("#issue-filter [data-tab]","click",(e=>this.onSelectTab(e,(e=>{this._issueFilter=e,this.renderIssues()}))))),e.push(tn.on("[data-action]","click",((e,t)=>this.onDataActionClicked(e,t)))),e.push(tn.on("plus-content","action",((e,t)=>this.onPlusActionClicked(e,t)))),e.push(tn.on("pull-request-row","open-worktree",((e,t)=>this.onOpenWorktree(e,t)))),e.push(tn.on("pull-request-row","switch-branch",((e,t)=>this.onSwitchBranch(e,t)))),e}onSwitchBranch(e,t){null!=e.detail?.refs?.head&&this.sendCommand(Go,{pullRequest:e.detail})}onOpenWorktree(e,t){null!=e.detail?.refs?.head&&this.sendCommand(Wo,{pullRequest:e.detail})}onDataActionClicked(e,t){const o=t.dataset.action;this.onActionClickedCore(o)}onPlusActionClicked(e,t){this.onActionClickedCore(e.detail)}onActionClickedCore(e){e?.startsWith("command:")&&this.sendCommand(Ho,{command:e.slice(8)})}onMessageReceived(e){const t=e.data;switch(this.log(`onMessageReceived(${t.id}): name=${t.method}`),t.method){case Qo.method:zo(Qo,t,(e=>{this.setState({...this.state,...e.state}),this.renderContent()}));break;case Yo.method:zo(Yo,t,(e=>{this.setState({...this.state,subscription:e.subscription,isPlus:e.isPlus}),this.renderContent()}))}}renderContent(){this.renderAccountState(),this.state.isPlus&&(this.renderPullRequests(),this.renderIssues())}renderPullRequests(){const e=document.getElementById("pull-requests");if(null==e)return;e.querySelectorAll("pull-request-row").forEach((e=>e.remove()));const t=document.getElementById("no-pull-requests"),o=document.getElementById("loading-pull-requests");null==this.state.pullRequests?(t.setAttribute("hidden","true"),o.removeAttribute("hidden")):0===this.state.pullRequests.length?(t.removeAttribute("hidden"),o.setAttribute("hidden","true")):(t.setAttribute("hidden","true"),o.setAttribute("hidden","true"),this.state.pullRequests.forEach((({pullRequest:t,reasons:o,isCurrentBranch:n,isCurrentWorktree:r,hasWorktree:s,hasLocalBranch:i})=>{if(null==this._prFilter||""===this._prFilter||o.includes(this._prFilter)){const a=document.createElement("pull-request-row");a.pullRequest=t,a.reasons=o,a.isCurrentBranch=n,a.isCurrentWorktree=r,a.hasWorktree=s,a.hasLocalBranch=i,e.append(a)}})))}renderIssues(){const e=document.getElementById("issues");e.querySelectorAll("issue-row").forEach((e=>e.remove()));const t=document.getElementById("no-issues"),o=document.getElementById("loading-issues");null==this.state.issues?(t.setAttribute("hidden","true"),o.removeAttribute("hidden")):0===this.state.issues.length?(t.removeAttribute("hidden"),o.setAttribute("hidden","true")):(t.setAttribute("hidden","true"),o.setAttribute("hidden","true"),this.state.issues.forEach((({issue:t,reasons:o})=>{if(null==this._issueFilter||""===this._issueFilter||o.includes(this._issueFilter)){const n=document.createElement("issue-row");n.issue=t,n.reasons=o,e.append(n)}})))}renderAccountState(){const e=document.getElementById("content"),t=document.getElementById("account-overlay"),o=document.getElementById("connect-overlay");this.state.isPlus?null!=this.state.repos&&!1===this.state.repos.some((e=>e.isConnected))?(e.setAttribute("aria-hidden","true"),t.setAttribute("hidden","true"),o.removeAttribute("hidden")):(e.removeAttribute("aria-hidden"),t.setAttribute("hidden","true"),o.setAttribute("hidden","true")):(e.setAttribute("aria-hidden","true"),t.removeAttribute("hidden"),o.setAttribute("hidden","true"));document.getElementById("account-badge").subscription=this.state.subscription}onSelectTab(e,t){const o=e.target,n=o.dataset.tab;o.parentElement?.querySelectorAll("[data-tab]")?.forEach((e=>{e.dataset.tab!==n?e.classList.remove("is-active"):e.classList.add("is-active")})),t?.(n)}}new As;var Bs=t.S;export{Bs as FocusApp};