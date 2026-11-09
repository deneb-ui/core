#!/usr/bin/env node
const q=require("node:crypto"),m=require("node:fs"),T=require("node:http"),g=require("node:path"),{spawn:$}=require("node:child_process"),ee=4174,te=4173,W=96*1024,ae=10*1024*1024,h="127.0.0.1",B="/__fivora_local_preview",ne=`(()=>{const m=["market","place"].join(""),V="__"+m.toUpperCase()+"_LOCAL_VISUAL_BRIDGE__",F=m.toUpperCase()+"_PREVIEW_",S=t=>F+t;if(window.__FIVORA_LOCAL_VISUAL_BRIDGE__||window[V])return;window.__FIVORA_LOCAL_VISUAL_BRIDGE__=!0,window[V]=!0;const K="FIVORA_PREVIEW_EDIT_MODE",W=S("EDIT_MODE"),N="FIVORA_PREVIEW_ELEMENT_CLICKED",k=S("ELEMENT_CLICKED"),j="FIVORA_PREVIEW_READY",H=S("READY"),R="data-preview-field-path",x="data-preview-list-path",P="data-preview-item-path",C="data-fivora-local-edit-target",_="data-fivora-local-selected-target",G="data-"+m+"-local-edit-target",h="data-"+m+"-local-selected-target",$="[data-preview-field-path], [data-preview-list-path], [data-preview-item-path], [data-preview-style-target]";let l=window.parent!==window,f=new Map,s=null,n=null,g="*";const w=document.createElement("style");w.setAttribute("data-fivora-local-visual-bridge",""),w.setAttribute("data-"+m+"-local-visual-bridge",""),w.textContent=["["+C+"], ["+G+"] {","  outline: 2px solid #06b6d4 !important;","  outline-offset: 3px !important;","  cursor: pointer !important;","  box-shadow: 0 0 0 5px rgba(6, 182, 212, 0.16) !important;","}","["+_+"], ["+h+"] {","  outline: 2px dashed #06b6d4 !important;","  outline-offset: 3px !important;","  box-shadow: 0 0 0 5px rgba(6, 182, 212, 0.18) !important;","}",'html[data-fivora-local-edit-mode="true"] [data-preview-field-path],','html[data-fivora-local-edit-mode="true"] [data-preview-list-path],','html[data-fivora-local-edit-mode="true"] [data-preview-item-path],','html[data-fivora-local-edit-mode="true"] [data-preview-field-path],','html[data-fivora-local-edit-mode="true"] [data-preview-list-path],','html[data-fivora-local-edit-mode="true"] [data-preview-item-path] {',"  cursor: pointer !important;","}"].join(\`
\`),document.head.appendChild(w),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(l)),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(l));function X(t){return t.source!==window.parent?!1:(g==="*"&&t.origin&&t.origin!=="null"&&(g=t.origin),g==="*"||t.origin===g)}function T(t){window.parent.postMessage(t,g)}function L(){s&&(s.removeAttribute(C),s.removeAttribute(G)),s=null}function q(t){n&&n!==t&&(n.removeAttribute(_),n.removeAttribute(h)),n=t,n.setAttribute(_,"true"),n.setAttribute(h,"true")}function z(){n&&(n.removeAttribute(_),n.removeAttribute(h)),n=null}function U(t){return t instanceof Element?t.closest($):null}function J(t,e){const d=f.get(e);return d&&["string","number","boolean"].includes(typeof d.value)?d.value:t instanceof HTMLImageElement?t.currentSrc||t.src||"":(t.textContent||"").trim()}function Q(t){if(!l)return;const e=U(t.target);!e||e===s||(L(),s=e,s.setAttribute(C,"true"))}function Z(t){if(!l||!s)return;const e=t.relatedTarget;e instanceof Node&&s.contains(e)||L()}function tt(t,e,d){const A=[],E=new Set(e?[e]:[]),i=d||e&&e.replace(/(\\[\\d+\\])?\\.\\w+$/,"").replace(/\\[\\d+\\]$/,"");if(i)for(const[a,r]of f)a!==e&&!E.has(a)&&(a.startsWith(i+".")||a.startsWith(i+"["))&&r?.kind!=="collection"&&(E.add(a),A.push({path:a,label:r.label||a.split(".").pop()||"Content",type:r.type||"text"}));let o=t instanceof Element?t:null,c=0;for(;o&&o!==document.body&&c<3;){const a=o.getAttribute(R);if(a&&a!==e&&!E.has(a)){const r=f.get(a);r?.kind!=="collection"&&(E.add(a),A.push({path:a,label:r?.label||a.split(".").pop()||"Content",type:r?.type||"text"}))}o=o.parentElement,c+=1}return A}function et(t){if(!l)return;const e=U(t.target);if(!e)return;t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),q(e);const d=e.closest("["+R+"]"),A=e.closest("["+x+"]"),E=e.closest("["+P+"]"),i=d?.getAttribute(R)||null,o=A?.getAttribute(x)||null,c=E?.getAttribute(P)||null,a=e.closest("[data-preview-style-target]"),r=a?.getAttribute("data-preview-style-target")||null,at=i?f.get(i):null,b=e.getBoundingClientRect(),B=c?.match(/\\[(\\d+)\\](?!.*\\[\\d+\\])/),D=[],u=(O,I,v)=>{!I||D.some(y=>y.key===I)||D.push({kind:O,key:I,label:v})};u("element",i,"This element");const it=e.closest('[data-design-section="navbar"][data-preview-style-target]');u("card",it?.getAttribute("data-preview-style-target"),"Whole navbar"),u("card",c,"This card"),u("grid",o,"Entire grid");const M=e.closest("[data-preview-page-key]")?.getAttribute("data-preview-page-key")||"",p=e.closest("section,[data-design-section],[data-section-id]");if(p){const O=p.getAttribute("data-design-section")||p.getAttribute("data-section-id")||p.id,v=(p.parentElement?Array.from(p.parentElement.children).filter(nt=>nt.tagName==="SECTION"):[]).indexOf(p)+1,y=O||(v>0?"nth-"+v:"");u("section",y?"section:"+(M||"all")+":"+y:null,"This section")}u("page",M?"page:"+M:null,"Current page"),u("site","site:all","Whole website");const Y={type:N,fieldPath:i||r,styleType:a?.getAttribute("data-preview-style-type")||void 0,fieldValue:i?J(d||e,i):"",elementTag:e.tagName.toLowerCase(),isImage:e instanceof HTMLImageElement||at?.type==="image",boundingRect:{top:b.top,left:b.left,width:b.width,height:b.height},collectionPath:o,listPath:o,itemPath:c,itemIndex:B?Number(B[1]):null,descriptorKind:i?"field":o?"collection":r?"object":null,relatedFields:tt(e,i,c),styleScopes:D};T(Y),T({...Y,type:k})}window.addEventListener("message",t=>{!X(t)||!t.data||typeof t.data!="object"||t.data.type!==K&&t.data.type!==W||(l=t.data.editMode===!0,f=new Map(Array.isArray(t.data.fields)?t.data.fields.filter(e=>e&&typeof e.path=="string").map(e=>[e.path,e]):[]),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(l)),document.documentElement.setAttribute("data-fivora-local-edit-mode",String(l)),l||(L(),z()))}),document.addEventListener("mouseover",Q,!0),document.addEventListener("mouseout",Z,!0),document.addEventListener("click",et,!0),T({type:j,pathname:window.location.pathname}),T({type:H,pathname:window.location.pathname})})();`;let y=ne;try{const e=require("./template-preview-focus-bridge.cjs");typeof e=="string"&&e.trim()&&(y=e)}catch{}const re=`var __name = typeof __name === "function" ? __name : ((target, value) => (typeof Object.defineProperty === "function" ? Object.defineProperty(target, "name", { value, configurable: true }) : target));
`;y.includes("__name")&&!y.includes("var __name")&&(y=`${re}${y}`);function u(e){process.stderr.write(`Local Template Lab: ${e}
`),process.exit(1)}try{new Function(y)}catch(e){u(`Visual editor bridge is invalid: ${e.message}`)}function j(e,t,n){if(e===void 0)return n;const a=Number(e);return(!Number.isInteger(a)||a<1024||a>65535)&&u(`${t} must be a port between 1024 and 65535.`),a}function ie(e){const t=[...e];let n="",a,r,s=!1;for(let c=0;c<t.length;c+=1){const o=t[c];o==="--api-port"?(a=t[c+1],c+=1):o.startsWith("--api-port=")?a=o.slice(11):o==="--preview-port"?(r=t[c+1],c+=1):o.startsWith("--preview-port=")?r=o.slice(15):o==="--skip-install"?s=!0:o==="--help"||o==="-h"?(process.stdout.write(["Fivora Local Template Lab","","Usage:","  npm run lab -- <template-directory> [options]","","Options:","  --api-port <port>      Loopback controller port (default: 4174)","  --preview-port <port>  Template dev-server port (default: 4173)","  --skip-install         Do not install missing local dependencies",""].join(`
`)),process.exit(0)):o.startsWith("-")?u(`Unknown option: ${o}`):n?u(`Unexpected argument: ${o}`):n=o}return n||u("A template directory is required. Run with --help for usage."),{templatePath:g.resolve(n),apiPort:j(a,"--api-port",ee),previewPort:j(r,"--preview-port",te),skipInstall:s}}function x(e,t){try{return JSON.parse(m.readFileSync(e,"utf8"))}catch(n){u(`${t} is missing or invalid at ${e}: ${n instanceof Error?n.message:"unknown error"}`)}}const i=ie(process.argv.slice(2));m.existsSync(i.templatePath)||u(`Template directory does not exist: ${i.templatePath}`),m.statSync(i.templatePath).isDirectory()||u(`Template path must be a directory: ${i.templatePath}`);const oe=["fivora-template.json","fivora-template.json"].find(e=>m.existsSync(g.join(i.templatePath,e)))||"fivora-template.json",H=g.join(i.templatePath,oe),se=g.join(i.templatePath,"package.json"),p=x(H,"Template manifest"),I=x(se,"package.json");p.framework!=="nextjs-static-export"&&u('Template manifest framework must be "nextjs-static-export".'),(!I.scripts||typeof I.scripts.dev!="string")&&u("Template package.json must define a dev script for live preview."),(typeof p.siteDataFile!="string"||!p.siteDataFile.trim())&&u("Template manifest siteDataFile is required.");const _=g.resolve(i.templatePath,p.siteDataFile.trim()),k=g.relative(i.templatePath,_);(k.startsWith("..")||g.isAbsolute(k))&&u("Template manifest siteDataFile must stay inside the template directory.");const G=q.randomBytes(24).toString("base64url"),P=`http://${h}:${i.apiPort}`,J=`http://${h}:${i.previewPort}`,V=`${P}${B}`,le=g.join(__dirname,"deneb-template-validator.cjs");let A=!1,f=null,w=null,S=null,b=null,R=0;const X=5;let M="",O="";const l={protocolVersion:2,connected:!0,templateName:typeof p.name=="string"&&p.name.trim()?p.name.trim():typeof I.name=="string"?I.name:g.basename(i.templatePath),templatePath:i.templatePath,previewUrl:V,apiUrl:P,devStatus:"starting",devError:null,startedAt:new Date().toISOString(),validation:{status:"idle",startedAt:null,completedAt:null,exitCode:null}};function d(e,t){const n=t.toString();e==="dev"?M=`${M}${n}`.slice(-W):O=`${O}${n}`.slice(-W),process.stdout.write(n)}function Y(){return{...l,devLog:M,validationLog:O}}function de(e,t){const n=e.headers.origin;n&&/^(https?:\/\/|null$)/.test(n)&&(t.setHeader("Access-Control-Allow-Origin",n),t.setHeader("Vary","Origin")),t.setHeader("Access-Control-Allow-Headers","Authorization, Content-Type"),t.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS"),t.setHeader("Access-Control-Allow-Private-Network","true"),t.setHeader("Cache-Control","no-store"),t.setHeader("X-Content-Type-Options","nosniff")}function v(e,t,n){const a=JSON.stringify(n);e.statusCode=t,e.setHeader("Content-Type","application/json; charset=utf-8"),e.setHeader("Content-Length",Buffer.byteLength(a)),e.end(a)}function ce(e){return e.headers.authorization===`Bearer ${G}`}function pe(){try{return JSON.parse(m.readFileSync(_,"utf8"))}catch(e){throw new Error(`Unable to read ${p.siteDataFile}: ${e instanceof Error?e.message:"unknown error"}`)}}function ue(e,t=ae){return new Promise((n,a)=>{const r=[];let s=0,c=!1;e.on("data",o=>{if(!c){if(s+=o.length,s>t){c=!0,a(new Error(`Request body is too large. Local site data must be ${Math.floor(t/1024/1024)} MB or less.`));return}r.push(o)}}),e.on("end",()=>{if(!c)try{const o=Buffer.concat(r).toString("utf8");n(JSON.parse(o))}catch{a(new Error("Request body must be valid JSON."))}}),e.on("error",o=>{c||(c=!0,a(o))})})}function F(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function me(e){const t=`${_}.${process.pid}.${Date.now()}.tmp`,n=m.existsSync(_)?m.statSync(_).mode:420;try{m.writeFileSync(t,`${JSON.stringify(e,null,2)}
`,{encoding:"utf8",flag:"wx",mode:n}),m.renameSync(t,_)}catch(a){if(m.existsSync(t))try{m.unlinkSync(t)}catch{}throw a}}function fe(){return w?!1:(O="",l.validation={status:"running",startedAt:new Date().toISOString(),completedAt:null,exitCode:null},w=$(process.execPath,[le,"validate",i.templatePath],{cwd:__dirname,env:process.env,stdio:["ignore","pipe","pipe"]}),w.stdout.on("data",e=>d("validation",e)),w.stderr.on("data",e=>d("validation",e)),w.on("error",e=>{d("validation",`
Unable to start validation: ${e.message}
`)}),w.on("close",e=>{l.validation={...l.validation,status:e===0?"passed":"failed",completedAt:new Date().toISOString(),exitCode:e},w=null}),!0)}function U(){if(A||l.devStatus==="ready")return;const e=T.get(J,t=>{if(t.resume(),t.statusCode&&t.statusCode<500){l.devStatus="ready",l.devError=null,R=0,process.stdout.write(`
Live preview ready: ${V}
`);return}S=setTimeout(U,600)});e.setTimeout(900,()=>e.destroy()),e.on("error",()=>{S=setTimeout(U,600)})}function ve(e){if(!(A||b)){if(R>=X){l.devStatus="failed",l.devError=e;return}R+=1,l.devStatus="starting",l.devError=null,d("dev",`
Preview server stopped during navigation (${e}). Restarting (${R}/${X})...
`),b=setTimeout(()=>{b=null,N()},900)}}function ge(){const e=g.join(i.templatePath,"node_modules");if(!i.skipInstall&&!m.existsSync(e)){l.devStatus="installing";const t=typeof p.installCommand=="string"&&p.installCommand.trim()?p.installCommand.trim():"npm install";d("dev",`Installing local dependencies with: ${t}
`);const n=$(t,{cwd:i.templatePath,env:process.env,shell:!0,stdio:["ignore","pipe","pipe"]});f=n,n.stdout.on("data",a=>d("dev",a)),n.stderr.on("data",a=>d("dev",a)),n.on("error",a=>{l.devStatus="failed",l.devError=a.message,f=null}),n.on("close",a=>{if(f=null,a!==0){l.devStatus="failed",l.devError=`Dependency installation exited with code ${a}.`;return}N()});return}N()}function N(){l.devStatus="starting",l.devError=null,d("dev",`Starting template source server on ${J}. Source edits will hot reload.
`);const e=process.platform==="win32"?"npm.cmd":"npm";f=$(e,["run","dev","--","--hostname",h,"--port",String(i.previewPort)],{cwd:i.templatePath,env:{...process.env,NEXT_PUBLIC_SITE_BASE_PATH:""},shell:process.platform==="win32",stdio:["ignore","pipe","pipe"]}),f.stdout.on("data",t=>d("dev",t)),f.stderr.on("data",t=>d("dev",t)),f.on("error",t=>{l.devStatus="failed",l.devError=t.message,f=null}),f.on("close",(t,n)=>{if(f=null,!A){const a=n?`signal ${n}`:`exit code ${t}`;ve(a)}}),U()}function he(){return`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    html, body, #template-preview { width: 100%; height: 100%; margin: 0; border: 0; }
    body { overflow: hidden; background: #080808; }
    #template-preview { display: block; }
    #bridge-error { position: fixed; inset: 16px; z-index: 10; display: none;
      padding: 16px; color: #fecaca; background: #450a0a; font: 14px system-ui; }
  </style>
</head>
<body>
  <div id="bridge-error"></div>
  <iframe id="template-preview" title="Local template preview"></iframe>
  <script>
    (() => {
      const BRIDGE_SOURCE = ${JSON.stringify(y)};
      const preview = document.getElementById('template-preview');
      const errorBox = document.getElementById('bridge-error');
      const PREVIOUS_PREVIEW_PREFIX = ['MARKET', 'PLACE'].join('') + '_PREVIEW_';
      const previousPreviewMessage = (suffix) => PREVIOUS_PREVIEW_PREFIX + suffix;
      const savedMessages = new Map();
      let childReady = false;
      let portalOrigin = '*';
      let installTimer = null;

      function sendToChild(payload) {
        preview.contentWindow?.postMessage(payload, '*');
      }

      function sendToPortal(payload) {
        window.parent.postMessage(payload, portalOrigin);
      }

      window.addEventListener('message', (event) => {
        if (!event.data || typeof event.data !== 'object') return;
        if (event.source === window.parent) {
          if (portalOrigin === '*' && event.origin && event.origin !== 'null') {
            portalOrigin = event.origin;
          }
          if (portalOrigin !== '*' && event.origin !== portalOrigin) return;
          if (event.data.type === 'FIVORA_PREVIEW_STYLE_PATCH') {
            const key = 'STYLE_PATCH:' + (event.data.fieldPath || event.data.targetPath || 'default');
            savedMessages.set(key, event.data);
          } else if (event.data.type === 'FIVORA_PREVIEW_EDIT_MODE' ||
              event.data.type === previousPreviewMessage('EDIT_MODE') ||
              event.data.type === 'FIVORA_PREVIEW_SITE_DATA' ||
              event.data.type === previousPreviewMessage('SITE_DATA') ||
              event.data.type === 'FIVORA_PREVIEW_FOCUS_PAGE' ||
              event.data.type === previousPreviewMessage('FOCUS_PAGE') ||
              event.data.type === 'FIVORA_PREVIEW_CONTENT_PATCH') {
            savedMessages.set(event.data.type, event.data);
          }
          if (String(event.data.type || '').startsWith('FIVORA_PREVIEW_') || String(event.data.type || '').startsWith(PREVIOUS_PREVIEW_PREFIX)) {
            sendToChild(event.data);
          }
          return;
        }
        if (event.source !== preview.contentWindow) return;
        if (event.data.type === 'FIVORA_PREVIEW_READY' || event.data.type === previousPreviewMessage('READY')) {
          childReady = true;
          savedMessages.forEach(sendToChild);
          sendToPortal(event.data);
          return;
        }
        if (String(event.data.type || '').startsWith('FIVORA_PREVIEW_') || String(event.data.type || '').startsWith(PREVIOUS_PREVIEW_PREFIX)) {
          sendToPortal(event.data);
        }
      });

      function installBridge() {
        if (
          !preview.contentDocument ||
          preview.contentDocument.readyState !== 'complete' ||
          preview.contentWindow.__FIVORA_LOCAL_VISUAL_BRIDGE_ATTACHED__ === true
        ) {
          return;
        }
        try {
          const script = preview.contentDocument.createElement('script');
          script.setAttribute('data-fivora-local-visual-bridge', '');
          const NAME_SHIM = "var __name = typeof __name === 'function' ? __name : ((target, value) => (typeof Object.defineProperty === 'function' ? Object.defineProperty(target, 'name', { value, configurable: true }) : target)); ";
          script.textContent = (BRIDGE_SOURCE.includes('__name') && !BRIDGE_SOURCE.includes('var __name') ? NAME_SHIM : '') + BRIDGE_SOURCE;
          preview.contentDocument.head.appendChild(script);
          preview.contentWindow.__FIVORA_LOCAL_VISUAL_BRIDGE_ATTACHED__ = true;
          script.remove();
        } catch (error) {
          errorBox.style.display = 'block';
          errorBox.textContent = 'Unable to attach the local visual editor: ' + error.message;
        }
      }

      preview.addEventListener('load', () => {
        childReady = false;
        window.clearTimeout(installTimer);
        // Next development hydration can continue briefly after load. Attach
        // after it settles, while the wrapper watchdog below keeps the bridge
        // present after a hard reload or development refresh.
        installTimer = window.setTimeout(installBridge, 600);
      });

      window.setInterval(installBridge, 900);

      preview.src = '/';
    })();
  <\/script>
</body>
</html>`}function E(e){if(!e||typeof e!="object")return!1;const t="code"in e?String(e.code):"";return t==="ECONNRESET"||t==="ECONNABORTED"||t==="EPIPE"||t==="ERR_STREAM_DESTROYED"}function we(e,t){const n={...e.headers};n.host=`${h}:${i.previewPort}`,delete n["accept-encoding"],delete n.authorization;const a=T.request({hostname:h,port:i.previewPort,method:e.method,path:e.url,headers:n},r=>{t.writeHead(r.statusCode||502,r.statusMessage,r.headers),r.on("error",s=>{E(s)||d("dev",`
Preview proxy upstream error: ${s.message}
`),t.writableEnded||t.destroy()}),t.on("error",s=>{E(s)||d("dev",`
Preview proxy response error: ${s.message}
`),r.destroy()}),r.pipe(t)});a.on("error",r=>{E(r)||d("dev",`
Preview proxy request error: ${r.message}
`),t.headersSent?t.writableEnded||t.destroy():v(t,502,{message:`Local preview is not ready: ${r.message}`})}),e.on("error",r=>{E(r)||d("dev",`
Preview proxy client error: ${r.message}
`),a.destroy()}),e.pipe(a)}const C=T.createServer(async(e,t)=>{const n=new URL(e.url||"/",P);if(e.method==="GET"&&n.pathname===B){const a=he();t.writeHead(200,{"Cache-Control":"no-store","Content-Length":Buffer.byteLength(a),"Content-Type":"text/html; charset=utf-8"}),t.end(a);return}if(!n.pathname.startsWith("/api/")){we(e,t);return}if(de(e,t),e.method==="OPTIONS"){t.statusCode=204,t.end();return}if(!ce(e)){v(t,401,{message:"Invalid Local Template Lab token."});return}if(e.method==="GET"&&n.pathname==="/api/status"){v(t,200,Y());return}if(e.method==="GET"&&n.pathname==="/api/site-data"){try{let a=p;try{a=x(H,"Template manifest")}catch{}v(t,200,{manifest:a,siteData:pe(),siteDataFile:a.siteDataFile||p.siteDataFile})}catch(a){v(t,500,{message:a instanceof Error?a.message:"Unable to read site data."})}return}if(e.method==="POST"&&n.pathname==="/api/site-data"){try{const a=await ue(e),r=F(a)?a.siteData:null;if(!F(r)||!F(r.content)){v(t,400,{message:"siteData must be a JSON object with a content object."});return}me(r),v(t,200,{saved:!0,siteData:r,siteDataFile:p.siteDataFile})}catch(a){v(t,400,{message:a instanceof Error?a.message:"Unable to save local site data."})}return}if(e.method==="POST"&&n.pathname==="/api/validate"){if(!fe()){v(t,409,{message:"Validation is already running."});return}v(t,202,Y());return}v(t,404,{message:"Local Template Lab endpoint not found."})});function ye(e,t){const n=()=>{e.destroyed||e.destroy(),t.destroyed||t.destroy()},a=r=>{E(r)||d("dev",`
Preview proxy socket error: ${r.message}
`),n()};e.on("error",a),t.on("error",a),e.on("close",()=>{t.destroyed||t.end()}),t.on("close",()=>{e.destroyed||e.end()}),t.pipe(e),e.pipe(t)}C.on("upgrade",(e,t,n)=>{if(e.url?.startsWith("/api/")){t.destroy();return}t.on("error",s=>{E(s)||d("dev",`
Preview proxy upgrade client error: ${s.message}
`)});const a={...e.headers};a.host=`${h}:${i.previewPort}`;const r=T.request({hostname:h,port:i.previewPort,method:e.method,path:e.url,headers:a});r.on("upgrade",(s,c,o)=>{const Q=Object.entries(s.headers).flatMap(([Z,L])=>(Array.isArray(L)?L:[L]).filter(D=>D!==void 0).map(D=>`${Z}: ${D}`)).join(`\r
`);t.write(`HTTP/1.1 ${s.statusCode||101} ${s.statusMessage||"Switching Protocols"}\r
${Q}\r
\r
`),n.length&&c.write(n),o.length&&t.write(o),ye(t,c)}),r.on("error",s=>{E(s)||d("dev",`
Preview proxy upgrade upstream error: ${s.message}
`),t.destroyed||t.destroy()}),r.end()});function z(e){!e||e.killed||e.kill("SIGTERM")}function K(){A||(A=!0,S&&clearTimeout(S),b&&clearTimeout(b),z(w),z(f),C.close(()=>process.exit(0)),setTimeout(()=>process.exit(0),1500).unref())}C.on("error",e=>{u(`Unable to start loopback controller at ${P}: ${e instanceof Error?e.message:"unknown error"}`)}),C.listen(i.apiPort,h,()=>{process.stdout.write(["","Fivora Local Template Lab is running.",`Template: ${l.templateName}`,`Controller URL: ${P}`,`Connection token: ${G}`,`Preview URL: ${V}`,"","Paste the controller URL and connection token into Developer Portal > Local Test Lab.","Use Save local in the portal to write edits to the template site-data file.","Press Ctrl+C to stop. No template files are uploaded by this process.",""].join(`
`)),ge()}),process.on("SIGINT",K),process.on("SIGTERM",K);
