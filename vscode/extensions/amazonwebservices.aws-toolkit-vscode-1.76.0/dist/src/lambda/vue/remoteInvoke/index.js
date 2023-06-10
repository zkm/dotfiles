(()=>{"use strict";var D={744:(e,p)=>{var c;c={value:!0},p.Z=(h,y)=>{const w=h.__vccOpts||h;for(const[N,$]of y)w[N]=$;return w}}},F={};function _(e){var p=F[e];if(p!==void 0)return p.exports;var c=F[e]={exports:{}};return D[e](c,c.exports,_),c.exports}_.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var v={};(()=>{_.r(v);const e=Vue,p={class:"container button-container",style:{"justify-content":"space-between"}},c={style:{"margin-bottom":"5px","margin-top":"10px","margin-right":"5px"}},h={style:{"margin-top":"0"}},y=(0,e.createElementVNode)("h3",null,"Select a file to use as payload:",-1),w=(0,e.createElementVNode)("br",null,null,-1),N=(0,e.createElementVNode)("h3",null,"Or, use a sample request payload from a template:",-1),$=(0,e.createElementVNode)("option",{disabled:"",value:""},"Select an example input",-1),O=["value"],T=(0,e.createElementVNode)("br",null,null,-1),C=(0,e.createElementVNode)("br",null,null,-1);function R(n,t,o,i,r,a){return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createElementVNode)("div",p,[(0,e.createElementVNode)("h1",null,"Function "+(0,e.toDisplayString)(n.initialData.FunctionName),1),(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("button",{onClick:t[0]||(t[0]=(...s)=>n.sendInput&&n.sendInput(...s))},"Invoke")])]),(0,e.createElementVNode)("p",c,"ARN: "+(0,e.toDisplayString)(n.initialData.FunctionArn),1),(0,e.createElementVNode)("p",h,"Region: "+(0,e.toDisplayString)(n.initialData.FunctionRegion),1),y,(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("button",{onClick:t[1]||(t[1]=(...s)=>n.promptForFileLocation&&n.promptForFileLocation(...s))},"Choose File"),(0,e.createTextVNode)(" \xA0 "+(0,e.toDisplayString)(n.selectedFile),1)]),w,N,(0,e.withDirectives)((0,e.createElementVNode)("select",{"onUpdate:modelValue":t[2]||(t[2]=s=>n.selectedSampleRequest=s),onChange:t[3]||(t[3]=(...s)=>n.newSelection&&n.newSelection(...s))},[$,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(n.initialData.InputSamples,s=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{key:s.name,value:s.filename},(0,e.toDisplayString)(s.name),9,O))),128))],544),[[e.vModelSelect,n.selectedSampleRequest]]),T,C,(0,e.withDirectives)((0,e.createElementVNode)("textarea",{style:{width:"100%","margin-bottom":"10px"},rows:"10",cols:"90","onUpdate:modelValue":t[4]||(t[4]=s=>n.sampleText=s)},null,512),[[e.vModelText,n.sampleText]])],64)}/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class g{static registerGlobalCommands(){const t=new Event("remount");window.addEventListener("message",o=>{const{command:i}=o.data;i==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(r=>this.removeListener(r)),window.dispatchEvent(t))})}static addListener(t){this.messageListeners.add(t),window.addEventListener("message",t)}static removeListener(t){this.messageListeners.delete(t),window.removeEventListener("message",t)}static sendRequest(t,o,i){const r=JSON.parse(JSON.stringify(i)),a=new Promise((s,m)=>{const l=S=>{const d=S.data;if(t===d.id)if(this.removeListener(l),window.clearTimeout(u),d.error===!0){const E=JSON.parse(d.data);m(new Error(E.message))}else d.event?(typeof i[0]!="function"&&m(new Error(`Expected frontend event handler to be a function: ${o}`)),s(this.registerEventHandler(o,i[0]))):s(d.data)},u=setTimeout(()=>{this.removeListener(l),m(new Error(`Timed out while waiting for response: id: ${t}, command: ${o}`))},3e5);this.addListener(l)});return vscode.postMessage({id:t,command:o,data:r}),a}static registerEventHandler(t,o){const i=r=>{const a=r.data;if(a.command===t){if(!a.event)throw new Error(`Expected backend handler to be an event emitter: ${t}`);o(a.data)}};return this.addListener(i),{dispose:()=>this.removeListener(i)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(t,o)=>{var i;if(typeof o!="string"){console.warn(`Tried to index webview client with non-string property: ${String(o)}`);return}if(o==="init"){const a=(i=vscode.getState())!=null?i:{};if(a.__once)return()=>Promise.resolve();vscode.setState(Object.assign(a,{__once:!0}))}const r=(this.counter++).toString();return(...a)=>this.sendRequest(r,o,a)}})}}g.counter=0,g.initialized=!1,g.messageListeners=new Set;/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const f=new Set;window.addEventListener("remount",()=>f.clear());const j={created(){var n,t,o,i,r;if(this.$data===void 0)return;const a=(n=vscode.getState())!=null?n:{};this.$options._count=((t=this.$options._count)!=null?t:0)+1;const s=(i=this.id)!=null?i:`${(o=this.name)!=null?o:`DEFAULT-${f.size}`}-${this.$options._count}`;if(this.$options._unid=s,f.has(s)){console.warn(`Component "${s}" already exists. State-saving functionality will be disabled.`);return}f.add(s);const m=(r=a[s])!=null?r:{};Object.keys(this.$data).forEach(l=>{var u;this.$data[l]=(u=m[l])!=null?u:this.$data[l]}),Object.keys(this.$data).forEach(l=>{this.$watch(l,u=>{var S,d;const E=(S=vscode.getState())!=null?S:{},B=Object.assign((d=E[s])!=null?d:{},{[l]:u!==void 0?JSON.parse(JSON.stringify(u)):void 0});vscode.setState(Object.assign(E,{[s]:B}))},{deep:!0})})}},b=g.create(),q={FunctionName:"",FunctionArn:"",FunctionRegion:"",InputSamples:[]},M=(0,e.defineComponent)({async created(){var n;this.initialData=(n=await b.init())!=null?n:this.initialData},data(){return{initialData:{...q},selectedSampleRequest:"",sampleText:"",selectedFile:""}},methods:{async newSelection(){const n=await b.getSample(this.selectedSampleRequest);this.sampleText=n},async promptForFileLocation(){const n=await b.promptFile();n&&(this.sampleText=n.sample,this.selectedFile=n.selectedFile)},sendInput(){b.invokeLambda(this.sampleText)}},mixins:[j]});var I=_(744);const A=(0,I.Z)(M,[["render",R]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const V=()=>(0,e.createApp)(A),x=V();x.mount("#vue-app"),window.addEventListener("remount",()=>{x.unmount(),V().mount("#vue-app")})})();var L=this;for(var k in v)L[k]=v[k];v.__esModule&&Object.defineProperty(L,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map