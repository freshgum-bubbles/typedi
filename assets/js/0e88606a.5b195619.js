"use strict";(self.webpackChunk_typed_inject_website=self.webpackChunk_typed_inject_website||[]).push([[356],{9613:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>y});var r=t(9496);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=r.createContext({}),u=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=u(e.components);return r.createElement(s.Provider,{value:n},e.children)},l="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),l=u(t),d=o,y=l["".concat(s,".").concat(d)]||l[d]||m[d]||a;return t?r.createElement(y,i(i({ref:n},p),{},{components:t})):r.createElement(y,i({ref:n},p))}));function y(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var c={};for(var s in n)hasOwnProperty.call(n,s)&&(c[s]=n[s]);c.originalType=e,c[l]="string"==typeof e?e:o,i[1]=c;for(var u=2;u<a;u++)i[u]=t[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},7043:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>c,toc:()=>u});var r=t(1966),o=(t(9496),t(9613));const a={sidebar_position:1},i="Custom Containers",c={unversionedId:"guide/containers/custom-containers",id:"guide/containers/custom-containers",title:"Custom Containers",description:"In some scenarios, you may wish to change how containers work.",source:"@site/docs/guide/containers/custom-containers.md",sourceDirName:"guide/containers",slug:"/guide/containers/custom-containers",permalink:"/docs/guide/containers/custom-containers",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guide/containers/custom-containers.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Containers",permalink:"/docs/guide/containers/introduction"},next:{title:"Creating Containers",permalink:"/docs/guide/containers/creating-containers"}},s={},u=[],p={toc:u},l="wrapper";function m(e){let{components:n,...t}=e;return(0,o.kt)(l,(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"custom-containers"},"Custom Containers"),(0,o.kt)("p",null,"In some scenarios, you may wish to change how containers work.\nIn this case, ",(0,o.kt)("em",{parentName:"p"},"custom containers")," may be appropriate."),(0,o.kt)("p",null,"In TypeDI, each container is always an instance of ",(0,o.kt)("inlineCode",{parentName:"p"},"ContainerInstance"),".\nHowever, you can ",(0,o.kt)("em",{parentName:"p"},"extend")," this class with custom functionality, and\nthen register it as an ordinary container."),(0,o.kt)("p",null,"In practice, this looks like the following:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { ContainerInstance, ContainerRegistry, ServiceIdentifier, ContainerIdentifier } from '@freshgum/typedi';\n\nexport class MyContainerInstance {\n  public constructor(id: ContainerIdentifier, parent?: ContainerInstance) {\n    super(id, parent);\n  }\n\n  // ...\n}\n\nconst newContainer = new MyContainerInstance('my-new-container');\nContainerRegistry.registerContainer(newContainer);\n")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"Your custom container class will need a ",(0,o.kt)("inlineCode",{parentName:"p"},"public")," constructor as,\ncurrently, TypeDI's ",(0,o.kt)("inlineCode",{parentName:"p"},"ContainerInstance")," has a ",(0,o.kt)("inlineCode",{parentName:"p"},"protected")," constructor.")),(0,o.kt)("p",null,"Once your custom container has been registered, it functions as an ordinary\ncontainer. Calls to methods such as ",(0,o.kt)("inlineCode",{parentName:"p"},"ContainerInstance.of")," return the custom instance."))}m.isMDXComponent=!0}}]);