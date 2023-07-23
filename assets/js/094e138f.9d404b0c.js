"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[841],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),l=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(i.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=l(r),m=a,f=d["".concat(i,".").concat(m)]||d[m]||u[m]||o;return r?n.createElement(f,s(s({ref:t},p),{},{components:r})):n.createElement(f,s({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[d]="string"==typeof e?e:a,s[1]=c;for(var l=2;l<o;l++)s[l]=r[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8371:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>c,toc:()=>l});var n=r(7462),a=(r(7294),r(3905));const o={sidebar_position:7,description:"Extract, validate and/or transform request context values"},s="Schema Parsing",c={unversionedId:"part-1/schema-parsing",id:"part-1/schema-parsing",title:"Schema Parsing",description:"Extract, validate and/or transform request context values",source:"@site/docs/part-1/7-schema-parsing.md",sourceDirName:"part-1",slug:"/part-1/schema-parsing",permalink:"/funkallero/docs/part-1/schema-parsing",draft:!1,tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7,description:"Extract, validate and/or transform request context values"},sidebar:"tutorialSidebar",previous:{title:"Controller",permalink:"/funkallero/docs/part-1/controllers"},next:{title:"Test it out",permalink:"/funkallero/docs/part-1/test-it-out"}},i={},l=[{value:"Zod",id:"zod",level:2},{value:"src/index.ts",id:"srcindexts",level:6},{value:"Update DTO",id:"update-dto",level:2},{value:"src/contracts/create-user.ts",id:"srccontractscreate-userts",level:6},{value:"Inject request context",id:"inject-request-context",level:2},{value:"src/api/user-controller.ts",id:"srcapiuser-controllerts",level:6}],p={toc:l},d="wrapper";function u(e){let{components:t,...r}=e;return(0,a.kt)(d,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"schema-parsing"},"Schema Parsing"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"body"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"params"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"query")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"headers")," decorators can be used to inject request context into route handlers."),(0,a.kt)("p",null,"The decorators each have the same function ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero/src/decorators/inject-arg.ts#L31"},"signature")," that can be used to extract, validate and transform values."),(0,a.kt)("p",null,"However, before they add any real value, a ",(0,a.kt)("inlineCode",{parentName:"p"},"SCHEMA_PARSER")," service must be added."),(0,a.kt)("h2",{id:"zod"},"Zod"),(0,a.kt)("p",null,"In this example, ",(0,a.kt)("a",{parentName:"p",href:"https://zod.dev/"},"zod")," will be used, where an adapter can be consumed but any implementation can be used by satisfying ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/schema-parser-service.ts#L15-L17"},"this")," interface."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"yarn add zod")),(0,a.kt)("p",null,"Then add the schema parser service in the main file"),(0,a.kt)("h6",{id:"srcindexts"},"src/index.ts"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { BaseZodParserService } from '@lindeneg/funkallero';\n\nsetup(service) {\n    service.registerSingletonService(SERVICE.SCHEMA_PARSER, BaseZodParserService);\n}\n")),(0,a.kt)("h2",{id:"update-dto"},"Update DTO"),(0,a.kt)("h6",{id:"srccontractscreate-userts"},"src/contracts/create-user.ts"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { z } from 'zod';\nimport type User from '@/domain/user';\n\nexport const createUserSchema = z.object({\n    name: z.string().min(2).max(20),\n    email: z.string().email(),\n});\n\nexport interface ICreateUserDto extends z.infer<typeof createUserSchema> {}\n\nexport interface ICreateUserResponse {\n    id: User['id'];\n}\n")),(0,a.kt)("h2",{id:"inject-request-context"},"Inject request context"),(0,a.kt)("h6",{id:"srcapiuser-controllerts"},"src/api/user-controller.ts"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import {\n    controller,\n    httpGet,\n    httpPost,\n    params,\n    body,\n} from '@lindeneg/funkallero';\nimport BaseController from './base-controller';\nimport { createUserSchema, type ICreateUserDto } from '@/contracts/create-user';\n\n@controller('user')\nclass UserController extends BaseController {\n    @httpGet()\n    public async getUsers() {\n        return this.mediator.send('GetUsersQuery');\n    }\n\n    @httpGet('/:id')\n    public async getUser(@params('id') id: string) {\n        return this.mediator.send('GetUserQuery', {\n            id,\n        });\n    }\n\n    @httpPost()\n    public async createUser(@body(createUserSchema) dto: ICreateUserDto) {\n        return this.mediator.send('CreateUserCommand', dto);\n    }\n}\n")))}u.isMDXComponent=!0}}]);