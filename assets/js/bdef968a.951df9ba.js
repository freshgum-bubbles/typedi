"use strict";(self.webpackChunk_typed_inject_website=self.webpackChunk_typed_inject_website||[]).push([[425],{9613:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>m});var r=n(9496);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(n),h=i,m=u["".concat(c,".").concat(h)]||u[h]||d[h]||o;return n?r.createElement(m,a(a({ref:t},l),{},{components:n})):r.createElement(m,a({ref:t},l))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=h;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[u]="string"==typeof e?e:i,a[1]=s;for(var p=2;p<o;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},7126:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>p});var r=n(1966),i=(n(9496),n(9613));const o={sidebar_position:7},a="HostContainer",s={unversionedId:"guide/services/host-container",id:"guide/services/host-container",title:"HostContainer",description:"Sometimes, you'll encounter a situation within your app that",source:"@site/docs/guide/services/host-container.md",sourceDirName:"guide/services",slug:"/guide/services/host-container",permalink:"/docs/guide/services/host-container",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guide/services/host-container.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"Usage in JavaScript",permalink:"/docs/guide/services/usage-in-javascript"},next:{title:"Eager Services",permalink:"/docs/guide/services/eager-services"}},c={},p=[],l={toc:p},u="wrapper";function d(e){let{components:t,...n}=e;return(0,i.kt)(u,(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"hostcontainer"},"HostContainer"),(0,i.kt)("p",null,"Sometimes, you'll encounter a situation within your app that\nrequires breaking out of the more expressive decorator syntax."),(0,i.kt)("p",null,"This might be to check whether certain dependencies exist,\nor to perform any computations on the application's container."),(0,i.kt)("p",null,"To do this, TypeDI helpfully provides the ",(0,i.kt)("inlineCode",{parentName:"p"},"HostContainer")," function,\nwhich allows you to inject a service's executing container into\nthe service."),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"HostContainer is considered an ",(0,i.kt)("em",{parentName:"p"},'"escape hatch"'),", and it should be avoided where possible."),(0,i.kt)("p",{parentName:"admonition"},"This is called the Service Locator pattern, and it's only useful in certain scenarios.\nIn many cases, ",(0,i.kt)("a",{parentName:"p",href:"https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/"},"it's typically considered an anti-pattern"),". ",(0,i.kt)("sup",null,(0,i.kt)("a",{parentName:"p",href:"https://web.archive.org/web/20230208143016/https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/"},"(archive)"))),(0,i.kt)("p",{parentName:"admonition"},"If misused, it could mean that the dependencies of your serivce become opaque,\nwhere the only way to see what the service requires is to view its implementation.")),(0,i.kt)("p",null,"The HostContainer function returns a Token which, when passed to a DI container,\nresolves to the container itself. This means that the returned Token from ",(0,i.kt)("inlineCode",{parentName:"p"},"HostContainer")," can also be passed to ",(0,i.kt)("inlineCode",{parentName:"p"},"Container.get"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { ContainerInstance, HostContainer, Service } from '@freshgum/typedi';\n\n@Service([\n  // highlight-revision-start\n  HostContainer(),\n  // highlight-revision-end\n])\nexport class MyService {\n  // highlight-revision-start\n  constructor(private container: ContainerInstance) {\n    // highlight-revision-end\n    if (container.has(MyService)) {\n      console.log('Hello world!');\n    }\n  }\n}\n")))}d.isMDXComponent=!0}}]);