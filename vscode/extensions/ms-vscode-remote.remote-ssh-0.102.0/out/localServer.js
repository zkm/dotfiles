(()=>{"use strict";var e={1241:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getCleanRemoteScript=void 0;const n=r(1838);t.getCleanRemoteScript=function(e,t){return t.platform===n.Platform.Windows?`\n\t\t\tGet-Process node | Where-Object Path -match ".*\\\\.vscode-server.*\\\\bin\\\\.*" | ForEach-Object {Stop-Process -Id $_.Id}\n\t\t\tRemove-Item -Force -Recurse $env:USERPROFILE\\${e}\\${t.cleanRemoteUserData?"":"bin"}\n\t\t`:`\n\t\t\tkill -9 \`ps ax | grep "out/server-main.js" | grep -v grep | awk '{print $1}'\`\n\t\t\trm -rf $HOME/${e}/${t.cleanRemoteUserData?"":"bin"}\n\t\t`}},1838:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),t.Platform=t.warnForPreviewPlatform=void 0,t.warnForPreviewPlatform=function(e,t){"aarch64"!==e.arch&&"arm64"!==e.arch||t.info(`** Note: Support for architecture "${e.arch}" is in preview **`)},(r=t.Platform||(t.Platform={})).Linux="linux",r.Windows="windows",r.MacOS="macOS"},8422:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isWindows=void 0,t.isWindows="win32"===process.platform},3759:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.parseStringMap=t.stripAllNewlines=t.escapeRegExpCharacters=t.splitLines=t.markLine=t.markLines=t.sanitizeConnectionToken=t.sanitizeInstallScriptOutput=t.stripTrailingNewline=t.quoteForShellIfNeeded=t.quoteForShell=t.stripEscapeSequences=t.lastNonemptyLine=void 0;const n=r(8422);function i(e){return e.replace(/\x1b\[\??[0-9]{0,3}(;[0-9]{1,3})?[a-zA-Z]/g,"").replace(/\u0008/g,"").replace(/\r/g,"")}function s(e,t){return t?`"${e}"`:`'${e}'`}function o(e){return e.replace(/\r?\n$/,"")}function a(e){return e.replace(/[a-z]/g,"a").replace(/[A-Z]/g,"A").replace(/[0-9]/g,"1")}function c(e){return e.split(/\r?\n/g)}t.lastNonemptyLine=function(e){const t=c(e);if(n.isWindows){let e="";for(let r=t.length-1;r>=0;r--){const n=i(t[r]);if(n.match(/The process tried to write to a nonexistent pipe/))e=n;else if(n)return n}if(e)return e}const r=t.filter((e=>!!e));return r[r.length-1]},t.stripEscapeSequences=i,t.quoteForShell=s,t.quoteForShellIfNeeded=function(e,t){return e.match(/[^a-z0-9]/)?s(e,t):e},t.stripTrailingNewline=o,t.sanitizeInstallScriptOutput=function(e){return function(e){return e.replace(/connectionToken==(.*)==/,((e,t)=>`connectionToken==${a(t)}==`))}(e)},t.sanitizeConnectionToken=a,t.markLines=function(e,t=""){return c(o(e)).map((e=>`${t}> ${e}`)).join("\n")},t.markLine=function(e,t=""){return`${t}> ${e}`},t.splitLines=c,t.escapeRegExpCharacters=function(e){return e.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g,"\\$&")},t.stripAllNewlines=function(e){return e.replace(/\r?\n/,"")},t.parseStringMap=function(e,t="==",r){e=e.trim().replace(/\r?\n/g,"");const n={};for(let i=0;i<e.length;){const s=e.indexOf(t,i),o=e.indexOf(t,s+t.length);if(-1===s||-1===o)return r.trace("Stopped parsing output early. Remaining text: "+e.substring(i)),n;const a=e.slice(s+t.length,o);n[e.slice(i,s)]=a,i=o+t.length;const c=e.substr(i).match(/^\s+/);c&&c[0]&&(i+=c[0].length)}return n}},2081:e=>{e.exports=require("child_process")},2057:e=>{e.exports=require("constants")},7147:e=>{e.exports=require("fs")},3685:e=>{e.exports=require("http")},7310:e=>{e.exports=require("url")}},t={};function r(n){var i=t[n];if(void 0!==i)return i.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,r),s.exports}var n={};(()=>{var e=n;Object.defineProperty(e,"__esModule",{value:!0});const t=r(2081),i=r(2057),s=r(7147),o=r(3685),a=r(7310),c=r(3759),l=r(1241),p=JSON.parse(process.argv[2]);let u=!1;function d(e,t,r,n){t.writeHead(r,{"Content-Type":"text/plain"}),t.end(n)}function h(e){console.log(c.markLines(e,"local-server-"+p.serverId))}function f(e){console.error(c.markLines(e,"local-server-"+p.serverId))}class m{constructor(){this.child=m.spawnSsh()}dispose(){this.child.kill()}static spawnSsh(){h(`Running ssh connection command: ${JSON.stringify(p.sshArgs.join(" "))}`);const e=t.spawn(p.sshCommand,p.sshArgs,{stdio:["inherit","pipe","pipe"],windowsHide:!0});let r=!1;return e.stdout.on("data",(e=>{r||process.stdout.write(e),e.toString().includes(": end")&&(r=!0)})),e.stderr.on("data",(e=>{r||process.stderr.write(e)})),e.on("exit",(()=>{u||(h("ssh child died, shutting down"),process.exit(0))})),h(`Spawned ssh, pid=${e.pid}`),e}write(e){this.child.stdin?.write(e)}}const w=new class{constructor(e){this.ipcHandlePath=e,this.server=o.createServer(((e,t)=>this.onRequest(e,t)));try{this.server.listen(this.ipcHandlePath),this.server.on("error",(e=>f(e.message)))}catch(e){f("Could not launch management server."),process.exit(1)}this.delayShutdown()}delayShutdown(){this.shutdownTimer&&clearTimeout(this.shutdownTimer),this.shutdownTimer=setTimeout((()=>{this.dispose(),v(),h("Timed out"),process.exit(0)}),5e3)}killRemote(e){const t=JSON.parse(e),r=l.getCleanRemoteScript(p.serverDataFolderName,t);return g.write(r),`Killing remote server with script:\n ${r}`}onRequest(e,t){if("GET"!==e.method&&"POST"!==e.method)return t.writeHead(405,{"Content-Type":"text/plain"}),void t.end(`Unsupported method ${e.method}`);if(!e.url)return d(0,t,400,"Bad request.");const r=a.parse(e.url,!0).pathname;if(!r)return d(0,t,400,"Bad request.");if("/kill-remote"===r&&"POST"===e.method){let r="";e.on("data",(e=>{r+=e.toString()})),e.on("end",(()=>{const e=this.killRemote(r);t.writeHead(200),t.end(e)}))}else{if("/delay-shutdown"!==r)return t.writeHead(404,{"Content-Type":"text/plain"}),void t.end("Not found");this.delayShutdown(),t.writeHead(200),t.end("OK")}}dispose(){this.server.close()}}(p.ipcHandlePath),g=new m;function v(){if(u=!0,w.dispose(),g.dispose(),p.dataFilePath&&s.existsSync(p.dataFilePath))try{const e=s.readFileSync(p.dataFilePath);JSON.parse(e.toString()).pid===process.pid&&s.unlinkSync(p.dataFilePath)}catch(e){}}process.on("exit",(()=>{v()})),process.on("SIGTERM",(()=>{v(),process.exit(i.SIGTERM)}))})();var i=exports;for(var s in n)i[s]=n[s];n.__esModule&&Object.defineProperty(i,"__esModule",{value:!0})})();
//# sourceMappingURL=localServer.js.map