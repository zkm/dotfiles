(()=>{var ce={306:(e,o,i)=>{"use strict";i.r(o),i.d(o,{default:()=>S});var l=i(537),d=i.n(l),p=i(645),E=i.n(p),V=E()(d());V.push([e.id,`
.preload-transition[data-v-3858c4ad] {
    transition: none !important;
}
.settings-title[data-v-3858c4ad] {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane[data-v-3858c4ad] {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
[data-v-3858c4ad] .sub-pane div:first-child {
    margin-top: 0;
}
.collapse-leave-from[data-v-3858c4ad] {
    max-height: var(--max-height);
}
.collapse-leave-active[data-v-3858c4ad] {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active[data-v-3858c4ad] {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to[data-v-3858c4ad] {
    max-height: var(--max-height);
    padding: 1rem;
}
.collapse-button[data-v-3858c4ad] {
    display: none;
}
input[type='checkbox'] ~ label .collapse-button[data-v-3858c4ad] {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}
input[type='checkbox']:checked ~ label .collapse-button[data-v-3858c4ad] {
    transform: rotate(90deg);
}
.settings-panel[data-v-3858c4ad] {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}
.panel-header[data-v-3858c4ad] {
    display: flex;
    align-items: center;
    width: 100%;
}
`,"",{version:3,sources:["webpack://./src/webviews/components/settingsPanel.vue"],names:[],mappings:";AA4FA;IACI,2BAA2B;AAC/B;AACA;IACI,8CAA8C,EAAE,iCAAiC;IACjF,iBAAiB;IACjB,SAAS;IACT,UAAU;AACd;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,gBAAgB;AACpB;AACA;IACI,aAAa;AACjB;AACA;IACI,6BAA6B;AACjC;AACA;IACI,0DAA0D;IAC1D,kBAAkB;IAClB,eAAe;IACf,aAAa;AACjB;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,eAAe;AACnB;AACA;IACI,6BAA6B;IAC7B,aAAa;AACjB;AAEA;IACI,aAAa;AACjB;AAEA;IACI,qBAAqB;IACrB,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,UAAU;IACV,cAAc;IACd,YAAY;IACZ,+BAA+B;IAC/B,0BAA0B;IAC1B,yBAAyB;IACzB,iBAAiB;AACrB;AAEA;IACI,wBAAwB;AAC5B;AAEA;IACI,yCAAyC;IACzC,cAAc;AAClB;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,WAAW;AACf",sourcesContent:[`/*! * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved. * SPDX-License-Identifier: Apache-2.0 */

<template>
    <div :id="id" class="settings-panel">
        <div class="header">
            <input
                v-bind:id="buttonId"
                style="display: none"
                type="checkbox"
                v-if="collapseable || startCollapsed"
                v-model="collapsed"
            />
            <label :for="buttonId" class="panel-header">
                <i class="preload-transition collapse-button icon icon-vscode-chevron-up" ref="icon"></i>
                <span class="settings-title">{{ title }}</span>
            </label>
            <p class="soft no-spacing mt-8">{{ description }}</p>
        </div>
        <transition
            @enter="updateHeight"
            @beforeLeave="updateHeight"
            :name="collapseable || startCollapsed ? 'collapse' : ''"
        >
            <div ref="subPane" v-show="!collapsed" class="sub-pane">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { WebviewApi } from 'vscode-webview'
import { defineComponent } from 'vue'
import saveData from '../mixins/saveData'

declare const vscode: WebviewApi<{ [key: string]: VueModel }>

let count = 0

interface VueModel {
    collapsed: boolean
    buttonId: string
    lastHeight?: number
    subPane?: HTMLElement
}

/**
 * Settings panel is header + body, which may be collapseable
 */
export default defineComponent({
    name: 'settings-panel',
    props: {
        id: String,
        startCollapsed: Boolean,
        collapseable: Boolean,
        title: String,
        description: String,
    },
    data() {
        count += 1
        return {
            collapsed: this.$props.startCollapsed ?? false,
            buttonId: \`settings-panel-button-\${count}\`,
            lastHeight: undefined,
        } as VueModel
    },
    mixins: [saveData],
    methods: {
        updateHeight(el: Element & { style?: CSSStyleDeclaration }) {
            if (el.style) {
                this.lastHeight = el.scrollHeight
                el.style.setProperty('--max-height', \`\${this.lastHeight}px\`)
            }
        },
    },
    mounted() {
        this.subPane = this.$refs.subPane as HTMLElement | undefined
        this.lastHeight = this.collapsed ? this.lastHeight : this.subPane?.scrollHeight ?? this.lastHeight

        // TODO: write 'initial-style' as a directive
        // it will force a style until the first render
        // or just use Vue's transition element, but this is pretty heavy
        this.$nextTick(() => {
            setTimeout(() => {
                ;(this.$refs.icon as HTMLElement | undefined)?.classList.remove('preload-transition')
            }, 100)
        })
    },
})
<\/script>

<style scoped>
.preload-transition {
    transition: none !important;
}
.settings-title {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
:deep(.sub-pane div:first-child) {
    margin-top: 0;
}
.collapse-leave-from {
    max-height: var(--max-height);
}
.collapse-leave-active {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to {
    max-height: var(--max-height);
    padding: 1rem;
}

.collapse-button {
    display: none;
}

input[type='checkbox'] ~ label .collapse-button {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}

input[type='checkbox']:checked ~ label .collapse-button {
    transform: rotate(90deg);
}

.settings-panel {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}

.panel-header {
    display: flex;
    align-items: center;
    width: 100%;
}
</style>
`],sourceRoot:""}]);const S=V},672:(e,o,i)=>{"use strict";i.r(o),i.d(o,{default:()=>S});var l=i(537),d=i.n(l),p=i(645),E=i.n(p),V=E()(d());V.push([e.id,`form[data-v-3e6fca73] {
    padding: 15px;
}
.section-header[data-v-3e6fca73] {
    margin: 0px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
}
textarea[data-v-3e6fca73] {
    max-width: 100%;
}
.config-item[data-v-3e6fca73] {
    border-bottom: 1px solid var(--vscode-menubar-selectionBackground);
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 8px 0px;
}
.col2[data-v-3e6fca73] {
    grid-column: 2;
}
.data-view[data-v-3e6fca73] {
    display: none;
    border: dashed rgb(218, 31, 31) 1px;
    color: rgb(218, 31, 31);
}
.required[data-v-3e6fca73] {
    color: red;
}
#form-title[data-v-3e6fca73] {
    font-size: large;
    font-weight: bold;
}
.form-buttons[data-v-3e6fca73] {
    margin-left: 20px;
}
.margin-bottom-16[data-v-3e6fca73] {
    margin-bottom: 16px;
}
#target-type-selector[data-v-3e6fca73] {
    margin-bottom: 15px;
    margin-left: 8px;
}
`,"",{version:3,sources:["webpack://./src/lambda/vue/configEditor/samInvoke.css"],names:[],mappings:"AAAA;IACI,aAAa;AACjB;AACA;IACI,WAAW;IACX,mBAAmB;IACnB,aAAa;IACb,2BAA2B;AAC/B;AACA;IACI,eAAe;AACnB;AACA;IACI,kEAAkE;IAClE,aAAa;IACb,8BAA8B;IAC9B,gBAAgB;AACpB;AACA;IACI,cAAc;AAClB;AACA;IACI,aAAa;IACb,mCAAmC;IACnC,uBAAuB;AAC3B;AACA;IACI,UAAU;AACd;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,iBAAiB;AACrB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,mBAAmB;IACnB,gBAAgB;AACpB",sourcesContent:[`form[data-v-3e6fca73] {
    padding: 15px;
}
.section-header[data-v-3e6fca73] {
    margin: 0px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
}
textarea[data-v-3e6fca73] {
    max-width: 100%;
}
.config-item[data-v-3e6fca73] {
    border-bottom: 1px solid var(--vscode-menubar-selectionBackground);
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 8px 0px;
}
.col2[data-v-3e6fca73] {
    grid-column: 2;
}
.data-view[data-v-3e6fca73] {
    display: none;
    border: dashed rgb(218, 31, 31) 1px;
    color: rgb(218, 31, 31);
}
.required[data-v-3e6fca73] {
    color: red;
}
#form-title[data-v-3e6fca73] {
    font-size: large;
    font-weight: bold;
}
.form-buttons[data-v-3e6fca73] {
    margin-left: 20px;
}
.margin-bottom-16[data-v-3e6fca73] {
    margin-bottom: 16px;
}
#target-type-selector[data-v-3e6fca73] {
    margin-bottom: 15px;
    margin-left: 8px;
}
`],sourceRoot:""}]);const S=V},645:e=>{"use strict";e.exports=function(o){var i=[];return i.toString=function(){return this.map(function(d){var p="",E=typeof d[5]!="undefined";return d[4]&&(p+="@supports (".concat(d[4],") {")),d[2]&&(p+="@media ".concat(d[2]," {")),E&&(p+="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {")),p+=o(d),E&&(p+="}"),d[2]&&(p+="}"),d[4]&&(p+="}"),p}).join("")},i.i=function(d,p,E,V,S){typeof d=="string"&&(d=[[null,d,void 0]]);var P={};if(E)for(var O=0;O<this.length;O++){var L=this[O][0];L!=null&&(P[L]=!0)}for(var M=0;M<d.length;M++){var g=[].concat(d[M]);E&&P[g[0]]||(typeof S!="undefined"&&(typeof g[5]=="undefined"||(g[1]="@layer".concat(g[5].length>0?" ".concat(g[5]):""," {").concat(g[1],"}")),g[5]=S),p&&(g[2]&&(g[1]="@media ".concat(g[2]," {").concat(g[1],"}")),g[2]=p),V&&(g[4]?(g[1]="@supports (".concat(g[4],") {").concat(g[1],"}"),g[4]=V):g[4]="".concat(V)),i.push(g))}},i}},537:e=>{"use strict";e.exports=function(o){var i=o[1],l=o[3];if(!l)return i;if(typeof btoa=="function"){var d=btoa(unescape(encodeURIComponent(JSON.stringify(l)))),p="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(d),E="/*# ".concat(p," */");return[i].concat([E]).join(`
`)}return[i].join(`
`)}},744:(e,o)=>{"use strict";var i;i={value:!0},o.Z=(l,d)=>{const p=l.__vccOpts||l;for(const[E,V]of d)p[E]=V;return p}},679:(e,o,i)=>{var l=i(306);l.__esModule&&(l=l.default),typeof l=="string"&&(l=[[e.id,l,""]]),l.locals&&(e.exports=l.locals);var d=i(346).Z,p=d("7708e8a2",l,!1,{})},936:(e,o,i)=>{var l=i(672);l.__esModule&&(l=l.default),typeof l=="string"&&(l=[[e.id,l,""]]),l.locals&&(e.exports=l.locals);var d=i(346).Z,p=d("5d778c61",l,!1,{})},346:(e,o,i)=>{"use strict";i.d(o,{Z:()=>q});function l(s,h){for(var u=[],c={},r=0;r<h.length;r++){var B=h[r],y=B[0],U=B[1],T=B[2],J=B[3],I={id:s+":"+r,css:U,media:T,sourceMap:J};c[y]?c[y].parts.push(I):u.push(c[y]={id:y,parts:[I]})}return u}var d=typeof document!="undefined";if(typeof DEBUG!="undefined"&&DEBUG&&!d)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var p={},E=d&&(document.head||document.getElementsByTagName("head")[0]),V=null,S=0,P=!1,O=function(){},L=null,M="data-vue-ssr-id",g=typeof navigator!="undefined"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function q(s,h,u,c){P=u,L=c||{};var r=l(s,h);return j(r),function(y){for(var U=[],T=0;T<r.length;T++){var J=r[T],I=p[J.id];I.refs--,U.push(I)}y?(r=l(s,y),j(r)):r=[];for(var T=0;T<U.length;T++){var I=U[T];if(I.refs===0){for(var $=0;$<I.parts.length;$++)I.parts[$]();delete p[I.id]}}}}function j(s){for(var h=0;h<s.length;h++){var u=s[h],c=p[u.id];if(c){c.refs++;for(var r=0;r<c.parts.length;r++)c.parts[r](u.parts[r]);for(;r<u.parts.length;r++)c.parts.push(F(u.parts[r]));c.parts.length>u.parts.length&&(c.parts.length=u.parts.length)}else{for(var B=[],r=0;r<u.parts.length;r++)B.push(F(u.parts[r]));p[u.id]={id:u.id,refs:1,parts:B}}}}function W(){var s=document.createElement("style");return s.type="text/css",E.appendChild(s),s}function F(s){var h,u,c=document.querySelector("style["+M+'~="'+s.id+'"]');if(c){if(P)return O;c.parentNode.removeChild(c)}if(g){var r=S++;c=V||(V=W()),h=z.bind(null,c,r,!1),u=z.bind(null,c,r,!0)}else c=W(),h=G.bind(null,c),u=function(){c.parentNode.removeChild(c)};return h(s),function(y){if(y){if(y.css===s.css&&y.media===s.media&&y.sourceMap===s.sourceMap)return;h(s=y)}else u()}}var X=function(){var s=[];return function(h,u){return s[h]=u,s.filter(Boolean).join(`
`)}}();function z(s,h,u,c){var r=u?"":c.css;if(s.styleSheet)s.styleSheet.cssText=X(h,r);else{var B=document.createTextNode(r),y=s.childNodes;y[h]&&s.removeChild(y[h]),y.length?s.insertBefore(B,y[h]):s.appendChild(B)}}function G(s,h){var u=h.css,c=h.media,r=h.sourceMap;if(c&&s.setAttribute("media",c),L.ssrId&&s.setAttribute(M,h.id),r&&(u+=`
/*# sourceURL=`+r.sources[0]+" */",u+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),s.styleSheet)s.styleSheet.cssText=u;else{for(;s.firstChild;)s.removeChild(s.firstChild);s.appendChild(document.createTextNode(u))}}}},Y={};function w(e){var o=Y[e];if(o!==void 0)return o.exports;var i=Y[e]={id:e,exports:{}};return ce[e](i,i.exports,w),i.exports}w.n=e=>{var o=e&&e.__esModule?()=>e.default:()=>e;return w.d(o,{a:o}),o},w.d=(e,o)=>{for(var i in o)w.o(o,i)&&!w.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:o[i]})},w.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o),w.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var H={};(()=>{"use strict";w.r(H);const e=Vue,o=t=>((0,e.pushScopeId)("data-v-3e6fca73"),t=t(),(0,e.popScopeId)(),t),i={class:"invoke-lambda-form"},l=o(()=>(0,e.createElementVNode)("h1",null,"Edit SAM Debug Configuration",-1)),d={class:"container button-container",id:"invoke-button-container"},p=(0,e.createTextVNode)(" Using this form you can create, edit, and run launch-configs of "),E=o(()=>(0,e.createElementVNode)("code",null,"type:aws-sam",-1)),V=(0,e.createTextVNode)(". When you "),S=o(()=>(0,e.createElementVNode)("strong",null,"Invoke",-1)),P=o(()=>(0,e.createElementVNode)("label",{for:"target-type-selector"},"Invoke Target Type",-1)),O=["value"],L={class:"data-view"},M={key:0,class:"target-code"},g={class:"config-item"},q=o(()=>(0,e.createElementVNode)("label",{for:"select-directory"},"Project Root",-1)),j={class:"data-view"},W={class:"config-item"},F=o(()=>(0,e.createElementVNode)("label",{for:"lambda-handler"},"Lambda Handler",-1)),X={class:"data-view"},z={class:"config-item"},G=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),s=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),h=["value"],u={class:"data-view"},c={key:1,class:"target-template"},r=o(()=>(0,e.createElementVNode)("br",null,null,-1)),B={class:"config-item"},y=o(()=>(0,e.createElementVNode)("label",{for:"template-path"},"Template Path",-1)),U={class:"data-view"},T={class:"config-item"},J=o(()=>(0,e.createElementVNode)("label",{for:"logicalID"},"Resource (Logical Id)",-1)),I={class:"data-view"},$={class:"config-item"},pe=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),ue=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),me=["value"],ve={class:"data-view"},he={key:2,class:"target-apigw"},ge=o(()=>(0,e.createElementVNode)("br",null,null,-1)),fe={class:"config-item"},_e=o(()=>(0,e.createElementVNode)("label",{for:"template-path"},"Template Path",-1)),Ae={class:"data-view"},be={class:"config-item"},ye=o(()=>(0,e.createElementVNode)("label",{for:"logicalID"},"Resource (Logical Id)",-1)),Ce={class:"config-item"},Ee=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),Ve=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),Ne=["value"],ke={class:"data-view"},Be={class:"config-item"},we=o(()=>(0,e.createElementVNode)("label",{for:"path"},"Path",-1)),Ie={class:"config-item"},Se=o(()=>(0,e.createElementVNode)("label",{for:"http-method-selector"},"HTTP Method",-1)),Te=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose an HTTP Method",-1)),Me=["value"],De={class:"data-view"},Pe={class:"config-item"},Oe=o(()=>(0,e.createElementVNode)("label",{for:"query-string"},"Query String",-1)),Le={class:"config-item"},Ue=o(()=>(0,e.createElementVNode)("label",{for:"headers"},"Headers",-1)),Re=["data-invalid"],Je={key:0,class:"input-validation col2"},$e={key:3},He=o(()=>(0,e.createElementVNode)("h3",null,"aws",-1)),je={class:"config-item"},We=o(()=>(0,e.createElementVNode)("label",{for:"awsConnection"},"Credentials:",-1)),Fe={class:"config-item"},ze=o(()=>(0,e.createElementVNode)("label",{for:"region"},"Region",-1)),xe=o(()=>(0,e.createElementVNode)("h3",null,"lambda",-1)),Ke={class:"config-item"},Ze=o(()=>(0,e.createElementVNode)("label",{for:""},"Environment Variables",-1)),qe=["data-invalid"],Xe={key:0,class:"input-validation col2"},Ge={class:"config-item"},Ye=o(()=>(0,e.createElementVNode)("label",{for:"memory"},"Memory (MB)",-1)),Qe={class:"config-item"},et=o(()=>(0,e.createElementVNode)("label",{for:"timeoutSec"},"Timeout (s)",-1)),tt=o(()=>(0,e.createElementVNode)("h3",null,"sam",-1)),at={class:"config-item"},nt=o(()=>(0,e.createElementVNode)("label",{for:"buildArguments"},"Build Arguments",-1)),ot={class:"config-item"},it=o(()=>(0,e.createElementVNode)("label",{for:"containerBuild"},"Container Build",-1)),st={class:"config-item"},lt=o(()=>(0,e.createElementVNode)("label",{for:"dockerNetwork"},"Docker Network",-1)),rt={class:"config-item"},dt=o(()=>(0,e.createElementVNode)("label",{for:"localArguments"},"Local Arguments",-1)),ct={class:"config-item"},pt=o(()=>(0,e.createElementVNode)("label",{for:"skipNewImageCheck"},"Skip New Image Check",-1)),ut={class:"config-item"},mt=o(()=>(0,e.createElementVNode)("label",{for:"templateParameters"},"Template - Parameters",-1)),vt=["data-invalid"],ht={key:0,class:"input-validation col2"},gt=o(()=>(0,e.createElementVNode)("h3",null,"api",-1)),ft={class:"config-item"},_t=o(()=>(0,e.createElementVNode)("label",{for:"querystring"},"Query String",-1)),At={class:"config-item"},bt=o(()=>(0,e.createElementVNode)("label",{for:"stageVariables"},"Stage Variables",-1)),yt=["data-invalid"],Ct={key:0,class:"input-validation col2"},Et={class:"config-item"},Vt=o(()=>(0,e.createElementVNode)("label",{for:"clientCerificateId"},"Client Certificate ID",-1)),Nt={class:"config-item"},kt=o(()=>(0,e.createElementVNode)("label",{for:"apiPayload"},"API Payload",-1)),Bt=["data-invalid"],wt={key:0,class:"input-validation col2"},It=o(()=>(0,e.createElementVNode)("br",null,null,-1)),St={class:"data-view"},Tt={key:0,class:"input-validation"};function Mt(t,a,m,f,b,A){const _=(0,e.resolveComponent)("settings-panel");return(0,e.openBlock)(),(0,e.createElementBlock)("form",i,[l,(0,e.createElementVNode)("div",d,[(0,e.createElementVNode)("button",{class:"",onClick:a[0]||(a[0]=(0,e.withModifiers)((...n)=>t.launch&&t.launch(...n),["prevent"]))},"Invoke"),(0,e.createElementVNode)("button",{class:"form-buttons",onClick:a[1]||(a[1]=(0,e.withModifiers)((...n)=>t.loadConfig&&t.loadConfig(...n),["prevent"]))},"Load Existing Config"),(0,e.createElementVNode)("button",{class:"form-buttons",onClick:a[2]||(a[2]=(0,e.withModifiers)((...n)=>t.save&&t.save(...n),["prevent"]))},"Save")]),(0,e.createElementVNode)("p",null,[(0,e.createElementVNode)("em",null,[p,E,V,S,(0,e.createTextVNode)(" the launch config, "+(0,e.toDisplayString)(t.company)+" Toolkit calls SAM CLI and attaches the debugger to the code running in a local Docker container. ",1)])]),(0,e.createVNode)(_,{id:"config-panel",title:"Configuration",description:""},{default:(0,e.withCtx)(()=>[P,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"target-types",id:"target-type-selector","onUpdate:modelValue":a[3]||(a[3]=n=>t.launchConfig.invokeTarget.target=n)},[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.targetTypes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n.value,key:v},(0,e.toDisplayString)(n.name),9,O))),128))],512),[[e.vModelSelect,t.launchConfig.invokeTarget.target]]),(0,e.createElementVNode)("span",L,(0,e.toDisplayString)(t.launchConfig.invokeTarget.target),1),t.launchConfig.invokeTarget.target==="code"?((0,e.openBlock)(),(0,e.createElementBlock)("div",M,[(0,e.createElementVNode)("div",g,[q,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"select-directory",type:"text","onUpdate:modelValue":a[4]||(a[4]=n=>t.launchConfig.invokeTarget.projectRoot=n),placeholder:"Enter a directory"},null,512),[[e.vModelText,t.launchConfig.invokeTarget.projectRoot]]),(0,e.createElementVNode)("span",j,"the selected directory: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.projectRoot),1)]),(0,e.createElementVNode)("div",W,[F,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text",placeholder:"Enter the lambda handler",name:"lambda-handler",id:"lambda-handler","onUpdate:modelValue":a[5]||(a[5]=n=>t.launchConfig.invokeTarget.lambdaHandler=n)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.lambdaHandler]]),(0,e.createElementVNode)("span",X,"lamda handler :"+(0,e.toDisplayString)(t.launchConfig.invokeTarget.lambdaHandler),1)]),(0,e.createElementVNode)("div",z,[G,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":a[6]||(a[6]=n=>t.launchConfig.lambda.runtime=n)},[s,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n,key:v},(0,e.toDisplayString)(n),9,h))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",u,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)])])):t.launchConfig.invokeTarget.target==="template"?((0,e.openBlock)(),(0,e.createElementBlock)("div",c,[(0,e.createElementVNode)("button",{class:"margin-bottom-16",onClick:a[7]||(a[7]=(0,e.withModifiers)((...n)=>t.loadResource&&t.loadResource(...n),["prevent"]))},"Load Resource"),r,(0,e.createElementVNode)("div",B,[y,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"template-path-button",type:"text","onUpdate:modelValue":a[8]||(a[8]=n=>t.launchConfig.invokeTarget.templatePath=n),placeholder:"Enter the template path..."},null,512),[[e.vModelText,t.launchConfig.invokeTarget.templatePath]]),(0,e.createElementVNode)("span",U,"Template path from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.templatePath),1)]),(0,e.createElementVNode)("div",T,[J,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"template-logical-id",id:"template-logical-id",type:"text",placeholder:"Enter a resource","onUpdate:modelValue":a[9]||(a[9]=n=>t.launchConfig.invokeTarget.logicalId=n)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.logicalId]]),(0,e.createElementVNode)("span",I," Logical Id from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.logicalId),1)]),(0,e.createElementVNode)("div",$,[pe,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":a[10]||(a[10]=n=>t.launchConfig.lambda.runtime=n)},[ue,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n,key:v},(0,e.toDisplayString)(n),9,me))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",ve,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)])])):t.launchConfig.invokeTarget.target==="api"?((0,e.openBlock)(),(0,e.createElementBlock)("div",he,[(0,e.createElementVNode)("button",{onClick:a[11]||(a[11]=(0,e.withModifiers)((...n)=>t.loadResource&&t.loadResource(...n),["prevent"]))},"Load Resource"),ge,(0,e.createElementVNode)("div",fe,[_e,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"template-path-button",type:"text","onUpdate:modelValue":a[12]||(a[12]=n=>t.launchConfig.invokeTarget.templatePath=n),placeholder:"Enter the template path..."},null,512),[[e.vModelText,t.launchConfig.invokeTarget.templatePath]]),(0,e.createElementVNode)("span",Ae,"Template path from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.templatePath),1)]),(0,e.createElementVNode)("div",be,[ye,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"template-logical-id",id:"template-logical-id",type:"text",placeholder:"Enter a resource","onUpdate:modelValue":a[13]||(a[13]=n=>t.launchConfig.invokeTarget.logicalId=n)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.logicalId]])]),(0,e.createElementVNode)("div",Ce,[Ee,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":a[14]||(a[14]=n=>t.launchConfig.lambda.runtime=n)},[Ve,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n,key:v},(0,e.toDisplayString)(n),9,Ne))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",ke,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)]),(0,e.createElementVNode)("div",Be,[we,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[15]||(a[15]=n=>t.launchConfig.api.path=n)},null,512),[[e.vModelText,t.launchConfig.api.path]])]),(0,e.createElementVNode)("div",Ie,[Se,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"http-method","onUpdate:modelValue":a[16]||(a[16]=n=>t.launchConfig.api.httpMethod=n)},[Te,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.httpMethods,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n.toLowerCase(),key:v},(0,e.toDisplayString)(n),9,Me))),128))],512),[[e.vModelSelect,t.launchConfig.api.httpMethod]]),(0,e.createElementVNode)("span",De,(0,e.toDisplayString)(t.launchConfig.api.httpMethod),1)]),(0,e.createElementVNode)("div",Pe,[Oe,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"query-string",id:"query-string",type:"text",cols:"15",rows:"2",placeholder:"Enter a query","onUpdate:modelValue":a[17]||(a[17]=n=>t.launchConfig.api.querystring=n)},null,512),[[e.vModelText,t.launchConfig.api.querystring]])]),(0,e.createElementVNode)("div",Le,[Ue,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[18]||(a[18]=n=>t.headers.value=n),placeholder:"Enter as valid JSON","data-invalid":!!t.headers.errorMsg},null,8,Re),[[e.vModelText,t.headers.value]]),t.headers.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Je," Error parsing JSON: "+(0,e.toDisplayString)(t.headers.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)])])):((0,e.openBlock)(),(0,e.createElementBlock)("div",$e,"Select an Invoke Target"))]),_:1}),(0,e.createVNode)(_,{id:"more-fields-panel",title:"Additional Fields",description:"","start-collapsed":""},{default:(0,e.withCtx)(()=>[He,(0,e.createElementVNode)("div",je,[We,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[19]||(a[19]=n=>t.launchConfig.aws.credentials=n)},null,512),[[e.vModelText,t.launchConfig.aws.credentials]])]),(0,e.createElementVNode)("div",Fe,[ze,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[20]||(a[20]=n=>t.launchConfig.aws.region=n)},null,512),[[e.vModelText,t.launchConfig.aws.region]])]),xe,(0,e.createElementVNode)("div",Ke,[Ze,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text",placeholder:"Enter as valid JSON","onUpdate:modelValue":a[21]||(a[21]=n=>t.environmentVariables.value=n),"data-invalid":!!t.environmentVariables.errorMsg},null,8,qe),[[e.vModelText,t.environmentVariables.value]]),t.environmentVariables.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Xe," Error parsing JSON: "+(0,e.toDisplayString)(t.environmentVariables.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),(0,e.createElementVNode)("div",Ge,[Ye,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"number","onUpdate:modelValue":a[22]||(a[22]=n=>t.launchConfig.lambda.memoryMb=n)},null,512),[[e.vModelText,t.launchConfig.lambda.memoryMb,void 0,{number:!0}]])]),(0,e.createElementVNode)("div",Qe,[et,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"number","onUpdate:modelValue":a[23]||(a[23]=n=>t.launchConfig.lambda.timeoutSec=n)},null,512),[[e.vModelText,t.launchConfig.lambda.timeoutSec,void 0,{number:!0}]])]),(0,e.createCommentVNode)(` <div class="config-item">
                <label for="pathMappings">Path Mappings</label>
                <input type="text" v-model="launchConfig.lambda.pathMappings" >
            </div> `),tt,(0,e.createElementVNode)("div",at,[nt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[24]||(a[24]=n=>t.launchConfig.sam.buildArguments=n),placeholder:"Enter as a comma separated list"},null,512),[[e.vModelText,t.launchConfig.sam.buildArguments]])]),(0,e.createElementVNode)("div",ot,[it,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"checkbox",name:"containerBuild",id:"containerBuild","onUpdate:modelValue":a[25]||(a[25]=n=>t.containerBuild=n)},null,512),[[e.vModelCheckbox,t.containerBuild]])]),(0,e.createElementVNode)("div",st,[lt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[26]||(a[26]=n=>t.launchConfig.sam.dockerNetwork=n)},null,512),[[e.vModelText,t.launchConfig.sam.dockerNetwork]])]),(0,e.createElementVNode)("div",rt,[dt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[27]||(a[27]=n=>t.launchConfig.sam.localArguments=n),placeholder:"Enter as a comma separated list"},null,512),[[e.vModelText,t.launchConfig.sam.localArguments]])]),(0,e.createElementVNode)("div",ct,[pt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"checkbox",name:"skipNewImageCheck",id:"skipNewImageCheck","onUpdate:modelValue":a[28]||(a[28]=n=>t.skipNewImageCheck=n)},null,512),[[e.vModelCheckbox,t.skipNewImageCheck]])]),(0,e.createElementVNode)("div",ut,[mt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[29]||(a[29]=n=>t.parameters.value=n),"data-invalid":!!t.parameters.errorMsg},null,8,vt),[[e.vModelText,t.parameters.value]]),t.parameters.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",ht," Error parsing JSON: "+(0,e.toDisplayString)(t.parameters.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),gt,(0,e.createElementVNode)("div",ft,[_t,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[30]||(a[30]=n=>t.launchConfig.api.querystring=n)},null,512),[[e.vModelText,t.launchConfig.api.querystring]])]),(0,e.createElementVNode)("div",At,[bt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[31]||(a[31]=n=>t.stageVariables.value=n),"data-invalid":!!t.stageVariables.errorMsg,placeholder:"Enter as valid JSON"},null,8,yt),[[e.vModelText,t.stageVariables.value]]),t.stageVariables.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Ct," Error parsing JSON: "+(0,e.toDisplayString)(t.stageVariables.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),(0,e.createElementVNode)("div",Et,[Vt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[32]||(a[32]=n=>t.launchConfig.api.clientCertificateId=n)},null,512),[[e.vModelText,t.launchConfig.api.clientCertificateId]])]),(0,e.createElementVNode)("div",Nt,[kt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[33]||(a[33]=n=>t.apiPayload.value=n),placeholder:"Enter as valid JSON","data-invalid":!!t.apiPayload.errorMsg},null,8,Bt),[[e.vModelText,t.apiPayload.value]]),t.apiPayload.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",wt," Error parsing JSON: "+(0,e.toDisplayString)(t.apiPayload.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)])]),_:1}),(0,e.createVNode)(_,{id:"payload-panel",title:"Payload",description:"","start-collapsed":""},{default:(0,e.withCtx)(()=>[(0,e.createElementVNode)("button",{class:"margin-bottom-16",onClick:a[34]||(a[34]=(0,e.withModifiers)((...n)=>t.loadPayload&&t.loadPayload(...n),["prevent"]))},"Load Sample Payload"),It,(0,e.withDirectives)((0,e.createElementVNode)("textarea",{name:"lambda-payload",id:"lambda-payload",cols:"60",rows:"5","onUpdate:modelValue":a[35]||(a[35]=n=>t.payload.value=n)},null,512),[[e.vModelText,t.payload.value]]),(0,e.createElementVNode)("span",St,"payload from data: "+(0,e.toDisplayString)(t.payload),1),t.payload.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Tt,"Error parsing JSON: "+(0,e.toDisplayString)(t.payload.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),_:1})])}const Kt=t=>(_pushScopeId("data-v-3858c4ad"),t=t(),_popScopeId(),t),Dt=["id"],Pt={class:"header"},Ot=["id"],Lt=["for"],Ut={class:"preload-transition collapse-button icon icon-vscode-chevron-up",ref:"icon"},Rt={class:"settings-title"},Jt={class:"soft no-spacing mt-8"},$t={ref:"subPane",class:"sub-pane"};function Ht(t,a,m,f,b,A){return(0,e.openBlock)(),(0,e.createElementBlock)("div",{id:t.id,class:"settings-panel"},[(0,e.createElementVNode)("div",Pt,[t.collapseable||t.startCollapsed?(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("input",{key:0,id:t.buttonId,style:{display:"none"},type:"checkbox","onUpdate:modelValue":a[0]||(a[0]=_=>t.collapsed=_)},null,8,Ot)),[[e.vModelCheckbox,t.collapsed]]):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("label",{for:t.buttonId,class:"panel-header"},[(0,e.createElementVNode)("i",Ut,null,512),(0,e.createElementVNode)("span",Rt,(0,e.toDisplayString)(t.title),1)],8,Lt),(0,e.createElementVNode)("p",Jt,(0,e.toDisplayString)(t.description),1)]),(0,e.createVNode)(e.Transition,{onEnter:t.updateHeight,onBeforeLeave:t.updateHeight,name:t.collapseable||t.startCollapsed?"collapse":""},{default:(0,e.withCtx)(()=>[(0,e.withDirectives)((0,e.createElementVNode)("div",$t,[(0,e.renderSlot)(t.$slots,"default",{},void 0,!0)],512),[[e.vShow,!t.collapsed]])]),_:3},8,["onEnter","onBeforeLeave","name"])],8,Dt)}/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const x=new Set;window.addEventListener("remount",()=>x.clear());const te={created(){var t,a,m,f,b;if(this.$data===void 0)return;const A=(t=vscode.getState())!=null?t:{};this.$options._count=((a=this.$options._count)!=null?a:0)+1;const _=(f=this.id)!=null?f:`${(m=this.name)!=null?m:`DEFAULT-${x.size}`}-${this.$options._count}`;if(this.$options._unid=_,x.has(_)){console.warn(`Component "${_}" already exists. State-saving functionality will be disabled.`);return}x.add(_);const n=(b=A[_])!=null?b:{};Object.keys(this.$data).forEach(v=>{var N;this.$data[v]=(N=n[v])!=null?N:this.$data[v]}),Object.keys(this.$data).forEach(v=>{this.$watch(v,N=>{var C,k;const R=(C=vscode.getState())!=null?C:{},Z=Object.assign((k=R[_])!=null?k:{},{[v]:N!==void 0?JSON.parse(JSON.stringify(N)):void 0});vscode.setState(Object.assign(R,{[_]:Z}))},{deep:!0})})}};let ae=0;const jt=(0,e.defineComponent)({name:"settings-panel",props:{id:String,startCollapsed:Boolean,collapseable:Boolean,title:String,description:String},data(){var t;return ae+=1,{collapsed:(t=this.$props.startCollapsed)!=null?t:!1,buttonId:`settings-panel-button-${ae}`,lastHeight:void 0}},mixins:[te],methods:{updateHeight(t){t.style&&(this.lastHeight=t.scrollHeight,t.style.setProperty("--max-height",`${this.lastHeight}px`))}},mounted(){var t,a;this.subPane=this.$refs.subPane,this.lastHeight=this.collapsed?this.lastHeight:(a=(t=this.subPane)==null?void 0:t.scrollHeight)!=null?a:this.lastHeight,this.$nextTick(()=>{setTimeout(()=>{var m;(m=this.$refs.icon)==null||m.classList.remove("preload-transition")},100)})}});var qt=w(679),ne=w(744);const Wt=(0,ne.Z)(jt,[["render",Ht],["__scopeId","data-v-3858c4ad"]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class K{static registerGlobalCommands(){const a=new Event("remount");window.addEventListener("message",m=>{const{command:f}=m.data;f==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(b=>this.removeListener(b)),window.dispatchEvent(a))})}static addListener(a){this.messageListeners.add(a),window.addEventListener("message",a)}static removeListener(a){this.messageListeners.delete(a),window.removeEventListener("message",a)}static sendRequest(a,m,f){const b=JSON.parse(JSON.stringify(f)),A=new Promise((_,n)=>{const v=C=>{const k=C.data;if(a===k.id)if(this.removeListener(v),window.clearTimeout(N),k.error===!0){const R=JSON.parse(k.data);n(new Error(R.message))}else k.event?(typeof f[0]!="function"&&n(new Error(`Expected frontend event handler to be a function: ${m}`)),_(this.registerEventHandler(m,f[0]))):_(k.data)},N=setTimeout(()=>{this.removeListener(v),n(new Error(`Timed out while waiting for response: id: ${a}, command: ${m}`))},3e5);this.addListener(v)});return vscode.postMessage({id:a,command:m,data:b}),A}static registerEventHandler(a,m){const f=b=>{const A=b.data;if(A.command===a){if(!A.event)throw new Error(`Expected backend handler to be an event emitter: ${a}`);m(A.data)}};return this.addListener(f),{dispose:()=>this.removeListener(f)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(a,m)=>{var f;if(typeof m!="string"){console.warn(`Tried to index webview client with non-string property: ${String(m)}`);return}if(m==="init"){const A=(f=vscode.getState())!=null?f:{};if(A.__once)return()=>Promise.resolve();vscode.setState(Object.assign(A,{__once:!0}))}const b=(this.counter++).toString();return(...A)=>this.sendRequest(b,m,A)}})}}K.counter=0,K.initialized=!1,K.messageListeners=new Set;/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const D=K.create();function oe(t){var a,m,f,b,A,_,n,v,N,C,k;return{type:"aws-sam",request:"direct-invoke",name:"",aws:{credentials:"",region:"",...t!=null&&t.aws?t.aws:{}},invokeTarget:{target:"template",templatePath:"",logicalId:"",lambdaHandler:"",projectRoot:"",...t==null?void 0:t.invokeTarget},lambda:{runtime:(a=t==null?void 0:t.lambda)==null?void 0:a.runtime,memoryMb:void 0,timeoutSec:void 0,environmentVariables:{},...t==null?void 0:t.lambda,payload:{json:(f=(m=t==null?void 0:t.lambda)==null?void 0:m.payload)!=null&&f.json?t.lambda.payload.json:{},path:(A=(b=t==null?void 0:t.lambda)==null?void 0:b.payload)!=null&&A.path?t.lambda.payload.path:""}},sam:{buildArguments:void 0,containerBuild:!1,dockerNetwork:"",localArguments:void 0,skipNewImageCheck:!1,...t!=null&&t.sam?t.sam:{},template:{parameters:(n=(_=t==null?void 0:t.sam)==null?void 0:_.template)!=null&&n.parameters?t.sam.template.parameters:{}}},api:{path:"",httpMethod:"get",clientCertificateId:"",querystring:"",headers:{},stageVariables:{},...t!=null&&t.api?t.api:{},payload:{json:(N=(v=t==null?void 0:t.api)==null?void 0:v.payload)!=null&&N.json?t.api.payload.json:{},path:(k=(C=t==null?void 0:t.api)==null?void 0:C.payload)!=null&&k.path?t.api.payload.path:""}}}}function ie(){return{containerBuild:!1,skipNewImageCheck:!1,launchConfig:oe(),payload:{value:"",errorMsg:""},apiPayload:{value:"",errorMsg:""},environmentVariables:{value:"",errorMsg:""},parameters:{value:"",errorMsg:""},headers:{value:"",errorMsg:""},stageVariables:{value:"",errorMsg:""}}}const Ft=(0,e.defineComponent)({name:"sam-invoke",components:{settingsPanel:Wt},created(){D.init().then(t=>this.parseConfig(t)),D.getRuntimes().then(t=>{this.runtimes=t}),D.getCompanyName().then(t=>{this.company=t})},mixins:[te],data(){return{...ie(),msg:"Hello",company:"",targetTypes:[{name:"Code",value:"code"},{name:"Template",value:"template"},{name:"API Gateway (Template)",value:"api"}],runtimes:[],httpMethods:["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"]}},methods:{resetJsonErrors(){this.payload.errorMsg="",this.environmentVariables.errorMsg="",this.headers.errorMsg="",this.stageVariables.errorMsg=""},launch(){const t=this.formatConfig();t&&D.invokeLaunchConfig(t)},save(){const t=this.formatConfig();t&&D.saveLaunchConfig(t)},loadConfig(){D.loadSamLaunchConfig().then(t=>this.parseConfig(t))},parseConfig(t){var a,m,f,b,A,_,n,v,N,C,k,R,Z,re,de;if(!t)return;const xt=this.company;this.clearForm(),this.launchConfig=oe(t),(a=t.lambda)!=null&&a.payload&&(this.payload.value=JSON.stringify(t.lambda.payload.json,void 0,4)),(m=t.lambda)!=null&&m.environmentVariables&&(this.environmentVariables.value=JSON.stringify((f=t.lambda)==null?void 0:f.environmentVariables)),(A=(b=t.sam)==null?void 0:b.template)!=null&&A.parameters&&(this.parameters.value=JSON.stringify((n=(_=t.sam)==null?void 0:_.template)==null?void 0:n.parameters)),(v=t.api)!=null&&v.headers&&(this.headers.value=JSON.stringify((N=t.api)==null?void 0:N.headers)),(C=t.api)!=null&&C.stageVariables&&(this.stageVariables.value=JSON.stringify((k=t.api)==null?void 0:k.stageVariables)),this.containerBuild=(Z=(R=t.sam)==null?void 0:R.containerBuild)!=null?Z:!1,this.skipNewImageCheck=(de=(re=t.sam)==null?void 0:re.skipNewImageCheck)!=null?de:!1,this.msg=`Loaded config ${t}`,this.company=xt},loadPayload(){this.resetJsonErrors(),D.getSamplePayload().then(t=>{!t||(this.payload.value=JSON.stringify(JSON.parse(t),void 0,4))})},loadResource(){this.resetJsonErrors(),D.getTemplate().then(t=>{!t||(this.launchConfig.invokeTarget.target="template",this.launchConfig.invokeTarget.logicalId=t.logicalId,this.launchConfig.invokeTarget.templatePath=t.template)})},formatFieldToStringArray(t){if(!t)return;const a=/\s*,\s*/g;return t.trim().split(a)},formatStringtoJSON(t){if(t.errorMsg="",t.value)try{return JSON.parse(t.value)}catch(a){throw t.errorMsg=a.message,a}},formatConfig(){var t,a,m,f;this.resetJsonErrors();let b,A,_,n,v,N;try{b=this.formatStringtoJSON(this.payload),A=this.formatStringtoJSON(this.environmentVariables),_=this.formatStringtoJSON(this.headers),n=this.formatStringtoJSON(this.stageVariables),v=this.formatStringtoJSON(this.parameters),N=this.formatStringtoJSON(this.apiPayload)}catch(k){return}const C=JSON.parse(JSON.stringify(this.launchConfig));return{...C,lambda:{...C.lambda,payload:{...C.payload,json:b},environmentVariables:A},sam:{...C.sam,buildArguments:this.formatFieldToStringArray((a=(t=C.sam)==null?void 0:t.buildArguments)==null?void 0:a.toString()),localArguments:this.formatFieldToStringArray((f=(m=C.sam)==null?void 0:m.localArguments)==null?void 0:f.toString()),containerBuild:this.containerBuild,skipNewImageCheck:this.skipNewImageCheck,template:{parameters:v}},api:C.api?{...C.api,headers:_,stageVariables:n,payload:{json:N}}:void 0}},clearForm(){const t=ie();Object.keys(t).forEach(a=>this.$data[a]=t[a])}}});var Gt=w(936);const zt=(0,ne.Z)(Ft,[["render",Mt],["__scopeId","data-v-3e6fca73"]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const se=()=>(0,e.createApp)(zt),le=se();le.mount("#vue-app"),window.addEventListener("remount",()=>{le.unmount(),se().mount("#vue-app")})})();var Q=this;for(var ee in H)Q[ee]=H[ee];H.__esModule&&Object.defineProperty(Q,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map