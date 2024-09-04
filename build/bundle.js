var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function l(t){t.forEach(e)}function i(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function o(t){return null==t?"":t}function r(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function a(t){t.parentNode.removeChild(t)}function u(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function f(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function p(){return d(" ")}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e){e=""+e,t.data!==e&&(t.data=e)}class h{constructor(t,e=null){this.e=f("div"),this.a=e,this.u(t)}m(t,e=null){for(let n=0;n<this.n.length;n+=1)c(t,this.n[n],e);this.t=t}u(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}p(t){this.d(),this.u(t),this.m(this.t,this.a)}d(){this.n.forEach(a)}}let $;function b(t){$=t}const v=[],y=[],k=[],x=[],w=Promise.resolve();let C=!1;function A(t){k.push(t)}const S=new Set;function I(){do{for(;v.length;){const t=v.shift();b(t),E(t.$$)}for(;y.length;)y.pop()();for(let t=0;t<k.length;t+=1){const e=k[t];S.has(e)||(S.add(e),e())}k.length=0}while(v.length);for(;x.length;)x.pop()();C=!1,S.clear()}function E(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}const P=new Set;let _;function N(){_={r:0,c:[],p:_}}function B(){_.r||l(_.c),_=_.p}function F(t,e){t&&t.i&&(P.delete(t),t.i(e))}function j(t,e,n,l){if(t&&t.o){if(P.has(t))return;P.add(t),_.c.push(()=>{P.delete(t),l&&(n&&t.d(1),l())}),t.o(e)}}function L(t){t&&t.c()}function q(t,n,s){const{fragment:o,on_mount:r,on_destroy:c,after_update:a}=t.$$;o&&o.m(n,s),A(()=>{const n=r.map(e).filter(i);c?c.push(...n):l(n),t.$$.on_mount=[]}),a.forEach(A)}function D(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function G(t,e){-1===t.$$.dirty[0]&&(v.push(t),C||(C=!0,w.then(I)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function M(e,i,s,o,r,c,a=[-1]){const u=$;b(e);const f=i.props||{},d=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:r,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:n(),dirty:a};let p=!1;d.ctx=s?s(e,f,(t,n,...l)=>{const i=l.length?l[0]:n;return d.ctx&&r(d.ctx[t],d.ctx[t]=i)&&(d.bound[t]&&d.bound[t](i),p&&G(e,t)),n}):[],d.update(),p=!0,l(d.before_update),d.fragment=!!o&&o(d.ctx),i.target&&(i.hydrate?d.fragment&&d.fragment.l(function(t){return Array.from(t.childNodes)}(i.target)):d.fragment&&d.fragment.c(),i.intro&&F(e.$$.fragment),q(e,i.target,i.anchor),I()),b(u)}class T{$destroy(){D(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function R(e){let n;return{c(){n=f("a"),n.textContent=`${e[2]}`},m(t,e){c(t,n,e)},p:t,d(t){t&&a(n)}}}function z(t){let e;let n=function(t,e){return"email"===t[1]?H:"phone"===t[1]?Z:t[3]?U:J}(t)(t);return{c(){n.c(),e=d("")},m(t,l){n.m(t,l),c(t,e,l)},p(t,e){n.p(t,e)},d(t){n.d(t),t&&a(e)}}}function J(e){let n,l;return{c(){n=f("a"),l=d(e[2]),m(n,"href",e[2])},m(t,e){c(t,n,e),r(n,l)},p:t,d(t){t&&a(n)}}}function U(e){let n,l;return{c(){n=f("a"),l=d(e[2]),m(n,"href",e[3])},m(t,e){c(t,n,e),r(n,l)},p:t,d(t){t&&a(n)}}}function Z(e){let n,l,i;return{c(){n=f("a"),l=d(e[2]),m(n,"href",i="tel:"+e[2])},m(t,e){c(t,n,e),r(n,l)},p:t,d(t){t&&a(n)}}}function H(e){let n,l,i;return{c(){n=f("a"),l=d(e[2]),m(n,"href",i="mailto:"+e[2])},m(t,e){c(t,n,e),r(n,l)},p:t,d(t){t&&a(n)}}}function O(e){let n,l,i,s;let u=function(t,e){return t[0]?z:R}(e)(e);return{c(){n=f("div"),l=f("i"),s=p(),u.c(),m(l,"class",i=o(e[4])+" svelte-1l7nlfq"),m(n,"class","contact-item svelte-1l7nlfq")},m(t,e){c(t,n,e),r(n,l),r(n,s),u.m(n,null)},p(t,[e]){u.p(t,e)},i:t,o:t,d(t){t&&a(n),u.d()}}}function V(t,e,n){let{detail:l}=e,{isLink:i,type:s,text:o,url:r,icon:c}=l;let a={location:"fa fa-map-marker-alt",email:"fa fa-envelope",phone:"fa fa-phone-alt",github:"fab fa-github",linkedin:"fab fa-linkedin-in",blog:"fa fa-pencil-alt"}[c]||"fa fa-link";return t.$set=t=>{"detail"in t&&n(5,l=t.detail)},[i,s,o,r,a,l]}class K extends T{constructor(t){super(),M(this,t,V,O,s,{detail:5})}}function X(t,e,n){const l=t.slice();return l[5]=e[n],l}function Y(t,e,n){const l=t.slice();return l[1]=e[n].subcategory,l[2]=e[n].contactDetails,l}function Q(t){let e,n,l=t[1]+"";return{c(){e=f("div"),n=d(l),m(e,"class","contact-subhead svelte-nyldc5")},m(t,l){c(t,e,l),r(e,n)},p(t,e){1&e&&l!==(l=t[1]+"")&&g(n,l)},d(t){t&&a(e)}}}function W(t){let e;const n=new K({props:{detail:t[5],class:"contact-item"}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.detail=t[5]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function tt(t){let e,n,l,i,s,o=t[1]&&Q(t),d=t[2],g=[];for(let e=0;e<d.length;e+=1)g[e]=W(X(t,d,e));const h=t=>j(g[t],1,1,()=>{g[t]=null});return{c(){e=f("div"),o&&o.c(),n=p(),l=f("div");for(let t=0;t<g.length;t+=1)g[t].c();i=p(),m(l,"class","contact-items svelte-nyldc5"),m(e,"class","contact-subsection svelte-nyldc5")},m(t,a){c(t,e,a),o&&o.m(e,null),r(e,n),r(e,l);for(let t=0;t<g.length;t+=1)g[t].m(l,null);r(e,i),s=!0},p(t,i){if(t[1]?o?o.p(t,i):(o=Q(t),o.c(),o.m(e,n)):o&&(o.d(1),o=null),1&i){let e;for(d=t[2],e=0;e<d.length;e+=1){const n=X(t,d,e);g[e]?(g[e].p(n,i),F(g[e],1)):(g[e]=W(n),g[e].c(),F(g[e],1),g[e].m(l,null))}for(N(),e=d.length;e<g.length;e+=1)h(e);B()}},i(t){if(!s){for(let t=0;t<d.length;t+=1)F(g[t]);s=!0}},o(t){g=g.filter(Boolean);for(let t=0;t<g.length;t+=1)j(g[t]);s=!1},d(t){t&&a(e),o&&o.d(),u(g,t)}}}function et(t){let e,n,l=t[0],i=[];for(let e=0;e<l.length;e+=1)i[e]=tt(Y(t,l,e));const s=t=>j(i[t],1,1,()=>{i[t]=null});return{c(){e=f("div");for(let t=0;t<i.length;t+=1)i[t].c();m(e,"id","contact-section"),m(e,"class","svelte-nyldc5")},m(t,l){c(t,e,l);for(let t=0;t<i.length;t+=1)i[t].m(e,null);n=!0},p(t,[n]){if(1&n){let o;for(l=t[0],o=0;o<l.length;o+=1){const s=Y(t,l,o);i[o]?(i[o].p(s,n),F(i[o],1)):(i[o]=tt(s),i[o].c(),F(i[o],1),i[o].m(e,null))}for(N(),o=l.length;o<i.length;o+=1)s(o);B()}},i(t){if(!n){for(let t=0;t<l.length;t+=1)F(i[t]);n=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)j(i[t]);n=!1},d(t){t&&a(e),u(i,t)}}}function nt(t,e,n){let{details:l}=e;return t.$set=t=>{"details"in t&&n(0,l=t.details)},[l]}class lt extends T{constructor(t){super(),M(this,t,nt,et,s,{details:0})}}function it(t,e,n){const l=t.slice();return l[10]=e[n],l}function st(e){let n;const l=new K({props:{detail:e[8]}});return{c(){L(l.$$.fragment)},m(t,e){q(l,t,e),n=!0},p:t,i(t){n||(F(l.$$.fragment,t),n=!0)},o(t){j(l.$$.fragment,t),n=!1},d(t){D(l,t)}}}function ot(t){let e,n,l=t[3]&&rt(t);return{c(){e=f("div"),l&&l.c(),n=d(t[4]),m(e,"class","dates")},m(t,i){c(t,e,i),l&&l.m(e,null),r(e,n)},p(t,i){t[3]?l?l.p(t,i):(l=rt(t),l.c(),l.m(e,n)):l&&(l.d(1),l=null),16&i&&g(n,t[4])},d(t){t&&a(e),l&&l.d()}}}function rt(t){let e,n,l;return{c(){e=f("i"),l=p(),m(e,"class",n=o(t[3])+" svelte-g8spsh")},m(t,n){c(t,e,n),c(t,l,n)},p(t,l){8&l&&n!==(n=o(t[3])+" svelte-g8spsh")&&m(e,"class",n)},d(t){t&&a(e),t&&a(l)}}}function ct(e){let n;const l=new K({props:{detail:e[9]}});return{c(){L(l.$$.fragment)},m(t,e){q(l,t,e),n=!0},p:t,i(t){n||(F(l.$$.fragment,t),n=!0)},o(t){j(l.$$.fragment,t),n=!1},d(t){D(l,t)}}}function at(t){let e,n;return{c(){e=f("div"),n=d(t[6]),m(e,"class","description")},m(t,l){c(t,e,l),r(e,n)},p(t,e){64&e&&g(n,t[6])},d(t){t&&a(e)}}}function ut(t){let e,n=t[7],l=[];for(let e=0;e<n.length;e+=1)l[e]=ft(it(t,n,e));return{c(){e=f("ul");for(let t=0;t<l.length;t+=1)l[t].c();m(e,"class","list")},m(t,n){c(t,e,n);for(let t=0;t<l.length;t+=1)l[t].m(e,null)},p(t,i){if(128&i){let s;for(n=t[7],s=0;s<n.length;s+=1){const o=it(t,n,s);l[s]?l[s].p(o,i):(l[s]=ft(o),l[s].c(),l[s].m(e,null))}for(;s<l.length;s+=1)l[s].d(1);l.length=n.length}},d(t){t&&a(e),u(l,t)}}}function ft(t){let e,n,l=t[10]+"";return{c(){e=f("li"),n=d(l),m(e,"class","list-item")},m(t,l){c(t,e,l),r(e,n)},p(t,e){128&e&&l!==(l=t[10]+"")&&g(n,l)},d(t){t&&a(e)}}}function dt(t){let e,n,l,i,s,o,u,h,$,b,v,y,k,x,w,C,A=t[2]&&st(t),S=t[4]&&ot(t),I=t[5]&&ct(t),E=t[6]&&at(t),P=t[7]&&ut(t);return{c(){e=f("div"),n=f("div"),l=f("div"),i=f("div"),s=d(t[0]),o=p(),u=f("div"),h=d(t[1]),$=p(),A&&A.c(),b=p(),v=f("div"),S&&S.c(),y=p(),I&&I.c(),k=p(),x=f("div"),E&&E.c(),w=p(),P&&P.c(),m(i,"class","title"),m(u,"class","subtitle"),m(l,"class","top-left svelte-g8spsh"),m(v,"class","top-right svelte-g8spsh"),m(n,"class","top svelte-g8spsh"),m(x,"class","bottom"),m(e,"class","full-detail detail-container")},m(t,a){c(t,e,a),r(e,n),r(n,l),r(l,i),r(i,s),r(l,o),r(l,u),r(u,h),r(l,$),A&&A.m(l,null),r(n,b),r(n,v),S&&S.m(v,null),r(v,y),I&&I.m(v,null),r(e,k),r(e,x),E&&E.m(x,null),r(x,w),P&&P.m(x,null),C=!0},p(t,[e]){(!C||1&e)&&g(s,t[0]),(!C||2&e)&&g(h,t[1]),t[2]?A?(A.p(t,e),F(A,1)):(A=st(t),A.c(),F(A,1),A.m(l,null)):A&&(N(),j(A,1,1,()=>{A=null}),B()),t[4]?S?S.p(t,e):(S=ot(t),S.c(),S.m(v,y)):S&&(S.d(1),S=null),t[5]?I?(I.p(t,e),F(I,1)):(I=ct(t),I.c(),F(I,1),I.m(v,null)):I&&(N(),j(I,1,1,()=>{I=null}),B()),t[6]?E?E.p(t,e):(E=at(t),E.c(),E.m(x,w)):E&&(E.d(1),E=null),t[7]?P?P.p(t,e):(P=ut(t),P.c(),P.m(x,null)):P&&(P.d(1),P=null)},i(t){C||(F(A),F(I),C=!0)},o(t){j(A),j(I),C=!1},d(t){t&&a(e),A&&A.d(),S&&S.d(),I&&I.d(),E&&E.d(),P&&P.d()}}}function pt(t,e,n){let{title:l}=e,{subtitle:i}=e,{link:s}=e,{icon:o}=e,{dates:r}=e,{location:c}=e,{description:a}=e,{list:u}=e,f={text:s},d={text:c,icon:"location"};return t.$set=t=>{"title"in t&&n(0,l=t.title),"subtitle"in t&&n(1,i=t.subtitle),"link"in t&&n(2,s=t.link),"icon"in t&&n(3,o=t.icon),"dates"in t&&n(4,r=t.dates),"location"in t&&n(5,c=t.location),"description"in t&&n(6,a=t.description),"list"in t&&n(7,u=t.list)},[l,i,s,o,r,c,a,u,f,d]}class mt extends T{constructor(t){super(),M(this,t,pt,dt,s,{title:0,subtitle:1,link:2,icon:3,dates:4,location:5,description:6,list:7})}}function gt(t,e,n){const l=t.slice();return l[1]=e[n].title,l[2]=e[n].subtitle,l[3]=e[n].link,l[4]=e[n].dates,l[5]=e[n].location,l[6]=e[n].icon,l[7]=e[n].description,l[8]=e[n].list,l}function ht(t){let e;const n=new mt({props:{title:t[1],subtitle:t[2],link:t[3],icon:t[6],dates:t[4],location:t[5],description:t[7],list:t[8]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.title=t[1]),1&e&&(l.subtitle=t[2]),1&e&&(l.link=t[3]),1&e&&(l.icon=t[6]),1&e&&(l.dates=t[4]),1&e&&(l.location=t[5]),1&e&&(l.description=t[7]),1&e&&(l.list=t[8]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function $t(t){let e,n,l=t[0],i=[];for(let e=0;e<l.length;e+=1)i[e]=ht(gt(t,l,e));const s=t=>j(i[t],1,1,()=>{i[t]=null});return{c(){e=f("div");for(let t=0;t<i.length;t+=1)i[t].c();m(e,"class","ok svelte-bmevu5")},m(t,l){c(t,e,l);for(let t=0;t<i.length;t+=1)i[t].m(e,null);n=!0},p(t,[n]){if(1&n){let o;for(l=t[0],o=0;o<l.length;o+=1){const s=gt(t,l,o);i[o]?(i[o].p(s,n),F(i[o],1)):(i[o]=ht(s),i[o].c(),F(i[o],1),i[o].m(e,null))}for(N(),o=l.length;o<i.length;o+=1)s(o);B()}},i(t){if(!n){for(let t=0;t<l.length;t+=1)F(i[t]);n=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)j(i[t]);n=!1},d(t){t&&a(e),u(i,t)}}}function bt(t,e,n){let{details:l}=e;return t.$set=t=>{"details"in t&&n(0,l=t.details)},[l]}class vt extends T{constructor(t){super(),M(this,t,bt,$t,s,{details:0})}}function yt(t){let e,n;return{c(){e=f("div"),n=d(t[1]),m(e,"class","subtitle svelte-1fag6bl")},m(t,l){c(t,e,l),r(e,n)},p(t,e){2&e&&g(n,t[1])},d(t){t&&a(e)}}}function kt(t){let e;const n=new K({props:{detail:t[4]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};16&e&&(l.detail=t[4]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function xt(t){let e,n;return{c(){e=f("div"),n=d(t[3]),m(e,"class","description")},m(t,l){c(t,e,l),r(e,n)},p(t,e){8&e&&g(n,t[3])},d(t){t&&a(e)}}}function wt(t){let e,n,l,i,s,o,u,h,$,b=t[1]&&yt(t),v=t[2]&&kt(t),y=t[3]&&xt(t);return{c(){e=f("div"),n=f("div"),l=f("div"),i=d(t[0]),s=p(),b&&b.c(),o=p(),v&&v.c(),u=p(),h=f("div"),y&&y.c(),m(l,"class","title"),m(n,"class","top svelte-1fag6bl"),m(h,"class","bottom"),m(e,"class","simple-detail detail-container svelte-1fag6bl")},m(t,a){c(t,e,a),r(e,n),r(n,l),r(l,i),r(n,s),b&&b.m(n,null),r(n,o),v&&v.m(n,null),r(e,u),r(e,h),y&&y.m(h,null),$=!0},p(t,[e]){(!$||1&e)&&g(i,t[0]),t[1]?b?b.p(t,e):(b=yt(t),b.c(),b.m(n,o)):b&&(b.d(1),b=null),t[2]?v?(v.p(t,e),F(v,1)):(v=kt(t),v.c(),F(v,1),v.m(n,null)):v&&(N(),j(v,1,1,()=>{v=null}),B()),t[3]?y?y.p(t,e):(y=xt(t),y.c(),y.m(h,null)):y&&(y.d(1),y=null)},i(t){$||(F(v),$=!0)},o(t){j(v),$=!1},d(t){t&&a(e),b&&b.d(),v&&v.d(),y&&y.d()}}}function Ct(t,e,n){let{title:l}=e,{subtitle:i}=e,{url:s}=e,{link:o}=e,{icon:r}=e,{description:c}=e,{detail:a={isLink:!0,type:"web",icon:r,url:s,text:o}}=e;return t.$set=t=>{"title"in t&&n(0,l=t.title),"subtitle"in t&&n(1,i=t.subtitle),"url"in t&&n(5,s=t.url),"link"in t&&n(2,o=t.link),"icon"in t&&n(6,r=t.icon),"description"in t&&n(3,c=t.description),"detail"in t&&n(4,a=t.detail)},[l,i,o,c,a,s,r]}class At extends T{constructor(t){super(),M(this,t,Ct,wt,s,{title:0,subtitle:1,url:5,link:2,icon:6,description:3,detail:4})}}function St(t,e,n){const l=t.slice();return l[1]=e[n].title,l[2]=e[n].subtitle,l[3]=e[n].icon,l[4]=e[n].url,l[5]=e[n].link,l[6]=e[n].description,l}function It(t){let e;const n=new At({props:{title:t[1],subtitle:t[2],icon:t[3],url:t[4],link:t[5],description:t[6]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.title=t[1]),1&e&&(l.subtitle=t[2]),1&e&&(l.icon=t[3]),1&e&&(l.url=t[4]),1&e&&(l.link=t[5]),1&e&&(l.description=t[6]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function Et(t){let e,n,l=t[0],i=[];for(let e=0;e<l.length;e+=1)i[e]=It(St(t,l,e));const s=t=>j(i[t],1,1,()=>{i[t]=null});return{c(){e=f("div");for(let t=0;t<i.length;t+=1)i[t].c();m(e,"class","ok svelte-1mk7fuj")},m(t,l){c(t,e,l);for(let t=0;t<i.length;t+=1)i[t].m(e,null);n=!0},p(t,[n]){if(1&n){let o;for(l=t[0],o=0;o<l.length;o+=1){const s=St(t,l,o);i[o]?(i[o].p(s,n),F(i[o],1)):(i[o]=It(s),i[o].c(),F(i[o],1),i[o].m(e,null))}for(N(),o=l.length;o<i.length;o+=1)s(o);B()}},i(t){if(!n){for(let t=0;t<l.length;t+=1)F(i[t]);n=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)j(i[t]);n=!1},d(t){t&&a(e),u(i,t)}}}function Pt(t,e,n){let{details:l}=e;return t.$set=t=>{"details"in t&&n(0,l=t.details)},[l]}class _t extends T{constructor(t){super(),M(this,t,Pt,Et,s,{details:0})}}function Nt(e){let n,l,i,s,o;return{c(){n=f("div"),l=f("img"),s=p(),o=d(e[0]),m(l,"width","20"),m(l,"height","20"),l.src!==(i=e[1])&&m(l,"src",i),m(l,"alt",e[0]),m(l,"class","svelte-1wl2oum"),m(n,"class","skill svelte-1wl2oum")},m(t,e){c(t,n,e),r(n,l),r(n,s),r(n,o)},p(t,[e]){2&e&&l.src!==(i=t[1])&&m(l,"src",i),1&e&&m(l,"alt",t[0]),1&e&&g(o,t[0])},i:t,o:t,d(t){t&&a(n)}}}function Bt(t,e,n){let{skillName:l}=e,{skillImage:i}=e;return t.$set=t=>{"skillName"in t&&n(0,l=t.skillName),"skillImage"in t&&n(1,i=t.skillImage)},[l,i]}class Ft extends T{constructor(t){super(),M(this,t,Bt,Nt,s,{skillName:0,skillImage:1})}}function jt(t,e,n){const l=t.slice();return l[1]=e[n],l}function Lt(t){let e;const n=new Ft({props:{skillImage:t[1][0],skillName:t[1][1]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.skillImage=t[1][0]),1&e&&(l.skillName=t[1][1]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function qt(t){let e,n,l=t[0],i=[];for(let e=0;e<l.length;e+=1)i[e]=Lt(jt(t,l,e));const s=t=>j(i[t],1,1,()=>{i[t]=null});return{c(){e=f("div");for(let t=0;t<i.length;t+=1)i[t].c();m(e,"id","skills-section"),m(e,"class","svelte-17w2jlc")},m(t,l){c(t,e,l);for(let t=0;t<i.length;t+=1)i[t].m(e,null);n=!0},p(t,[n]){if(1&n){let o;for(l=t[0],o=0;o<l.length;o+=1){const s=jt(t,l,o);i[o]?(i[o].p(s,n),F(i[o],1)):(i[o]=Lt(s),i[o].c(),F(i[o],1),i[o].m(e,null))}for(N(),o=l.length;o<i.length;o+=1)s(o);B()}},i(t){if(!n){for(let t=0;t<l.length;t+=1)F(i[t]);n=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)j(i[t]);n=!1},d(t){t&&a(e),u(i,t)}}}function Dt(t,e,n){let{details:l}=e;return t.$set=t=>{"details"in t&&n(0,l=t.details)},[l]}class Gt extends T{constructor(t){super(),M(this,t,Dt,qt,s,{details:0})}}function Mt(t){let e;const n=new lt({props:{label:t[0],details:t[1]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.label=t[0]),2&e&&(l.details=t[1]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function Tt(t){let e;const n=new Gt({props:{label:t[0],details:t[1]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.label=t[0]),2&e&&(l.details=t[1]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function Rt(t){let e;const n=new vt({props:{label:t[0],details:t[1]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.label=t[0]),2&e&&(l.details=t[1]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function zt(t){let e;const n=new _t({props:{label:t[0],details:t[1]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.label=t[0]),2&e&&(l.details=t[1]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function Jt(t){let e,n,l,i,s,o,u,h,$;const b=[zt,Rt,Tt,Mt],v=[];function y(t,e){return"simple-details"===t[2]?0:"full-details"===t[2]?1:"skills"===t[2]?2:"contact"===t[2]?3:-1}return~(u=y(t))&&(h=v[u]=b[u](t)),{c(){e=f("div"),n=f("h2"),l=d(t[0]),i=p(),s=f("hr"),o=p(),h&&h.c(),m(n,"class","section-label"),m(s,"class","section-underline"),m(e,"class","section")},m(t,a){c(t,e,a),r(e,n),r(n,l),r(e,i),r(e,s),r(e,o),~u&&v[u].m(e,null),$=!0},p(t,[n]){(!$||1&n)&&g(l,t[0]);let i=u;u=y(t),u===i?~u&&v[u].p(t,n):(h&&(N(),j(v[i],1,1,()=>{v[i]=null}),B()),~u?(h=v[u],h||(h=v[u]=b[u](t),h.c()),F(h,1),h.m(e,null)):h=null)},i(t){$||(F(h),$=!0)},o(t){j(h),$=!1},d(t){t&&a(e),~u&&v[u].d()}}}function Ut(t,e,n){let{label:l}=e,{details:i}=e,{type:s}=e;return t.$set=t=>{"label"in t&&n(0,l=t.label),"details"in t&&n(1,i=t.details),"type"in t&&n(2,s=t.type)},[l,i,s]}class Zt extends T{constructor(t){super(),M(this,t,Ut,Jt,s,{label:0,details:1,type:2})}}function Ht(t,e,n){const l=t.slice();return l[1]=e[n].label,l[2]=e[n].details,l[3]=e[n].type,l}function Ot(t){let e;const n=new Zt({props:{label:t[1],details:t[2],type:t[3]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.label=t[1]),1&e&&(l.details=t[2]),1&e&&(l.type=t[3]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function Vt(t){let e,n,l=t[0],i=[];for(let e=0;e<l.length;e+=1)i[e]=Ot(Ht(t,l,e));const s=t=>j(i[t],1,1,()=>{i[t]=null});return{c(){e=f("div");for(let t=0;t<i.length;t+=1)i[t].c();m(e,"id","main-column"),m(e,"class","svelte-zr1u7z")},m(t,l){c(t,e,l);for(let t=0;t<i.length;t+=1)i[t].m(e,null);n=!0},p(t,[n]){if(1&n){let o;for(l=t[0],o=0;o<l.length;o+=1){const s=Ht(t,l,o);i[o]?(i[o].p(s,n),F(i[o],1)):(i[o]=Ot(s),i[o].c(),F(i[o],1),i[o].m(e,null))}for(N(),o=l.length;o<i.length;o+=1)s(o);B()}},i(t){if(!n){for(let t=0;t<l.length;t+=1)F(i[t]);n=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)j(i[t]);n=!1},d(t){t&&a(e),u(i,t)}}}function Kt(t,e,n){let{sections:l}=e;return t.$set=t=>{"sections"in t&&n(0,l=t.sections)},[l]}class Xt extends T{constructor(t){super(),M(this,t,Kt,Vt,s,{sections:0})}}function Yt(t,e,n){const l=t.slice();return l[1]=e[n].label,l[2]=e[n].details,l[3]=e[n].type,l}function Qt(t){let e;const n=new Zt({props:{label:t[1],details:t[2],type:t[3]}});return{c(){L(n.$$.fragment)},m(t,l){q(n,t,l),e=!0},p(t,e){const l={};1&e&&(l.label=t[1]),1&e&&(l.details=t[2]),1&e&&(l.type=t[3]),n.$set(l)},i(t){e||(F(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){D(n,t)}}}function Wt(t){let e,n,l=t[0],i=[];for(let e=0;e<l.length;e+=1)i[e]=Qt(Yt(t,l,e));const s=t=>j(i[t],1,1,()=>{i[t]=null});return{c(){e=f("div");for(let t=0;t<i.length;t+=1)i[t].c();m(e,"id","side-column"),m(e,"class","svelte-19wiboh")},m(t,l){c(t,e,l);for(let t=0;t<i.length;t+=1)i[t].m(e,null);n=!0},p(t,[n]){if(1&n){let o;for(l=t[0],o=0;o<l.length;o+=1){const s=Yt(t,l,o);i[o]?(i[o].p(s,n),F(i[o],1)):(i[o]=Qt(s),i[o].c(),F(i[o],1),i[o].m(e,null))}for(N(),o=l.length;o<i.length;o+=1)s(o);B()}},i(t){if(!n){for(let t=0;t<l.length;t+=1)F(i[t]);n=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)j(i[t]);n=!1},d(t){t&&a(e),u(i,t)}}}function te(t,e,n){let{sections:l}=e;return t.$set=t=>{"sections"in t&&n(0,l=t.sections)},[l]}class ee extends T{constructor(t){super(),M(this,t,te,Wt,s,{sections:0})}}function ne(e){let n,l,i;const s=new Xt({props:{sections:e[1]}}),o=new ee({props:{sections:e[0]}});return{c(){n=f("div"),L(s.$$.fragment),l=p(),L(o.$$.fragment),m(n,"class","main-body svelte-sc6yfg")},m(t,e){c(t,n,e),q(s,n,null),r(n,l),q(o,n,null),i=!0},p:t,i(t){i||(F(s.$$.fragment,t),F(o.$$.fragment,t),i=!0)},o(t){j(s.$$.fragment,t),j(o.$$.fragment,t),i=!1},d(t){t&&a(n),D(s),D(o)}}}function le(t,e,n){return[[{type:"contact",label:"Contact",details:[{subcategory:"",contactDetails:[{isLink:!0,type:"email",text:"ilavarasans@protonmail.com",icon:"email"},{isLink:!0,type:"phone",text:"9080494637",icon:"phone"},{text:"Coimbatore, Tamil Nadu",icon:"location"}]},{subcategory:"",contactDetails:[{isLink:!0,type:"web",url:"https://github.com/EphemeralSapient/",text:"EphemeralSapient",icon:"github"},{isLink:!0,type:"web",url:"https://www.linkedin.com/in/ilavarasan-sampath-789372269",text:"Ilavarasan Sampath",icon:"linkedin"}]}]},{type:"skills",label:"Skills",details:[["/png/flutter.png","Flutter"],["/png/react.png","React"],["/png/python.png","Python"],["/png/rust.png","Rust"],["/png/linux.png","Linux"],["/png/azure.png","Azure"],["/png/mysql.png","MySQL"],["/png/mongo-db.png","MongoDB"]]},{type:"simple-details",label:"Certifications",details:[{title:"Azure Fundamentals",url:"https://learn.microsoft.com/api/credentials/share/en-gb/Ilavarasan-1337/9C12269E726BF964?sharingId=C69126F94A5ADC61",link:"View certification page",description:"Microsoft AZ-900: Azure Fundamentals certification."},{title:"Infosys Springboard",url:"https://drive.google.com/file/d/1FgUJkFb2odlGftiJtFyf7R7YiECGk03w/view?usp=sharing",link:"View certification",description:"An online course of Data Structures and Algorithms using Java."}]}],[{type:"full-details",label:"Education",details:[{title:"B.E. Computer Science and Engineering",subtitle:"Dr. N.G.P. Institute of Technology",dates:"2021—2025",description:"CGPA: 8.1 [until 6th semester]",location:"Kalapatti"},{title:" ",subtitle:" "},{title:"Higher Secondary School",subtitle:"Perks Matriculation Higher Secondary School",description:"Percentage: 78%",dates:"2020 — 2021",location:"Singanallur"}]},{type:"full-details",label:"Projects",details:[{title:"Project Prism",subtitle:"",icon:"fab fa-github",dates:"Github",description:"A modular and comprehensive application [Flutter, React]",list:["Smart attendance system using face recognition","Education management system for students and teachers","Supports both on-premises and cloud deployment","Intuitive UI/UX design by web and mobile application support"]},{title:"Mini Projects",subtitle:"",icon:"fab fa-github",dates:"Github",description:"Various mini projects for learning and exploring new technologies",list:["Score board controller using UART communication - Flutter","Pastebin alike app with Tonic[Rust] and React - semp.myftp.org/txts","Gemini and ChatGPT API integration on communication platform - Nodejs"]}]},{type:"simple-details",label:"Internship",details:[{title:"Zoho Corporation",url:"https://drive.google.com/file/d/1Jv26DPK8yOZXYTMeDG_p96y53iPtxlLe/view?usp=sharing",link:"Summer Intern [Feb 2024 - April 2024]",description:"Worked on the few projects for Zoho Cliq Extension integrations."}]}]]}class ie extends T{constructor(t){super(),M(this,t,le,ne,s,{sideColumn:0,mainColumn:1})}get sideColumn(){return this.$$.ctx[0]}get mainColumn(){return this.$$.ctx[1]}}function se(t,e,n){const l=t.slice();return l[2]=e[n],l[4]=n,l}function oe(e){let n,l,i,s,o=e[2]+"";return{c(){n=f("div"),i=p(),l=new h(o,i),m(n,"class",s="summary-line-"+e[4]+" svelte-q0r1mi")},m(t,e){c(t,n,e),l.m(n),r(n,i)},p:t,d(t){t&&a(n)}}}function re(e){let n,l,i,s,o=e[1],d=[];for(let t=0;t<o.length;t+=1)d[t]=oe(se(e,o,t));return{c(){n=f("div"),l=f("h1"),l.textContent=`${e[0]}`,i=p(),s=f("div");for(let t=0;t<d.length;t+=1)d[t].c();m(l,"id","my-name"),m(l,"class","svelte-q0r1mi"),m(s,"class","summary svelte-q0r1mi"),m(n,"id","header"),m(n,"class","svelte-q0r1mi")},m(t,e){c(t,n,e),r(n,l),r(n,i),r(n,s);for(let t=0;t<d.length;t+=1)d[t].m(s,null)},p(t,[e]){if(2&e){let n;for(o=t[1],n=0;n<o.length;n+=1){const l=se(t,o,n);d[n]?d[n].p(l,e):(d[n]=oe(l),d[n].c(),d[n].m(s,null))}for(;n<d.length;n+=1)d[n].d(1);d.length=o.length}},i:t,o:t,d(t){t&&a(n),u(d,t)}}}function ce(t,e,n){return["Ilavarasan",["Collaborative computer science engineering student with hands-on experience in cloud computing, open-source development, and mobile app development. Enthusiastic about emerging technologies and AI advancements."]]}class ae extends T{constructor(t){super(),M(this,t,ce,re,s,{name:0})}get name(){return this.$$.ctx[0]}}function ue(e){let n,l,i;const s=new ae({}),o=new ie({});return{c(){n=f("main"),L(s.$$.fragment),l=p(),L(o.$$.fragment)},m(t,e){c(t,n,e),q(s,n,null),r(n,l),q(o,n,null),i=!0},p:t,i(t){i||(F(s.$$.fragment,t),F(o.$$.fragment,t),i=!0)},o(t){j(s.$$.fragment,t),j(o.$$.fragment,t),i=!1},d(t){t&&a(n),D(s),D(o)}}}return new class extends T{constructor(t){super(),M(this,t,null,ue,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
