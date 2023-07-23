"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[198],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>h});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),u=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=u(e.components);return r.createElement(c.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=u(n),m=i,h=d["".concat(c,".").concat(m)]||d[m]||p[m]||a;return n?r.createElement(h,o(o({ref:t},l),{},{components:n})):r.createElement(h,o({ref:t},l))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[d]="string"==typeof e?e:i,o[1]=s;for(var u=2;u<a;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7631:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>u});var r=n(7462),i=(n(7294),n(3905));const a={sidebar_position:1,description:"Setup authentication & authorization"},o="Guarding Routes",s={unversionedId:"part-2/guarding-routes",id:"part-2/guarding-routes",title:"Guarding Routes",description:"Setup authentication & authorization",source:"@site/docs/part-2/1-guarding-routes.md",sourceDirName:"part-2",slug:"/part-2/guarding-routes",permalink:"/funkallero/docs/part-2/guarding-routes",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,description:"Setup authentication & authorization"},sidebar:"tutorialSidebar",previous:{title:"Tutorial - Part 2",permalink:"/funkallero/docs/category/tutorial---part-2"},next:{title:"Guarding Routes Continued",permalink:"/funkallero/docs/part-2/guarding-routes-contiuned"}},c={},u=[{value:"Update Entities &amp; DTOs",id:"update-entities--dtos",level:2},{value:"Update User Entity",id:"update-user-entity",level:4},{value:"src/domain/user.ts",id:"srcdomainuserts",level:6},{value:"src/contracts/create-user.ts",id:"srccontractscreate-userts",level:6},{value:"src/domain/auth-model.ts",id:"srcdomainauth-modelts",level:6},{value:"src/contracts/login-user.ts",id:"srccontractslogin-userts",level:6},{value:"Implement Authentication Service",id:"implement-authentication-service",level:2},{value:"src/services/authentication-service.ts",id:"srcservicesauthentication-servicets",level:6},{value:"Implement Authorization Service",id:"implement-authorization-service",level:4},{value:"src/services/authorization-service.ts",id:"srcservicesauthorization-servicets",level:6},{value:"Register Auth Services",id:"register-auth-services",level:2},{value:"src/index.ts",id:"srcindexts",level:6}],l={toc:u},d="wrapper";function p(e){let{components:t,...n}=e;return(0,i.kt)(d,(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"guarding-routes"},"Guarding Routes"),(0,i.kt)("p",null,"In order to make use of auth services, these interfaces must be implemented and registered ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/authentication-service.ts"},"IAuthentication"),", ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/authorization-service.ts"},"IAuthorization")," and ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/token-service.ts"},"ITokenService"),". These can be used either by being injected like any other service or via the ",(0,i.kt)("inlineCode",{parentName:"p"},"auth")," decorator on route handlers."),(0,i.kt)("p",null,"There is an optional package available that offers an implementation using ",(0,i.kt)("inlineCode",{parentName:"p"},"jsonwebtoken")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"bcrypt"),"."),(0,i.kt)("p",null,"Add that package to the project."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"yarn add @lindeneg/funkallero-auth-service")),(0,i.kt)("h2",{id:"update-entities--dtos"},"Update Entities & DTOs"),(0,i.kt)("h4",{id:"update-user-entity"},"Update User Entity"),(0,i.kt)("p",null,"Add password field to user entity."),(0,i.kt)("h6",{id:"srcdomainuserts"},"src/domain/user.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"interface IUser {\n    id: string;\n    name: string;\n    email: string;\n    // diff-add-next-line\n    password: string;\n    createdAt: Date;\n    updatedAt: Date;\n}\n\nexport default IUser;\n")),(0,i.kt)("p",null,"Also update ",(0,i.kt)("inlineCode",{parentName:"p"},"createUserSchema")," & ",(0,i.kt)("inlineCode",{parentName:"p"},"ICreateUserResponse"),"."),(0,i.kt)("h6",{id:"srccontractscreate-userts"},"src/contracts/create-user.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { z } from 'zod';\nimport type User from '@/domain/user';\n\nexport const createUserSchema = z.object({\n    name: z.string().min(2).max(20),\n    email: z.string().email(),\n    // diff-add-next-line\n    password: z.string().min(8).max(20),\n});\n\nexport interface ICreateUserDto extends z.infer<typeof createUserSchema> {}\n\nexport interface ICreateUserResponse {\n    id: User['id'];\n    // diff-add-next-line\n    token: string;\n}\n")),(0,i.kt)("p",null,"Define new entity that describes encoded data."),(0,i.kt)("h6",{id:"srcdomainauth-modelts"},"src/domain/auth-model.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class AuthModel {\n    id: string;\n    email: string;\n}\n\nexport default AuthModel;\n")),(0,i.kt)("p",null,"Create a new user login contract"),(0,i.kt)("h6",{id:"srccontractslogin-userts"},"src/contracts/login-user.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { z } from 'zod';\n\nexport const loginUserSchema = z.object({\n    email: z.string(),\n    password: z.string(),\n});\n\nexport interface ILoginUserDto extends z.infer<typeof loginUserSchema> {}\n\nexport interface ILoginUserResponse {\n    token: string;\n}\n")),(0,i.kt)("h2",{id:"implement-authentication-service"},"Implement Authentication Service"),(0,i.kt)("p",null,"When ",(0,i.kt)("inlineCode",{parentName:"p"},"BaseAuthenticationService")," is extended, only two method implementations are required."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"getEncodedToken",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"A method that returns an encoded token from a request."))),(0,i.kt)("li",{parentName:"ul"},"getUserFromDecodedToken",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"A method that returns the entity to which a token belongs.")))),(0,i.kt)("h6",{id:"srcservicesauthentication-servicets"},"src/services/authentication-service.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { BaseAuthenticationService } from '@lindeneg/funkallero-auth-service';\nimport type User from '@/domain/user';\nimport type AuthModel from '@/domain/auth-model';\nimport type DataContextService from '@/services/data-context-service';\n\n// BaseAuthenticationService is a scoped service\nclass AuthenticationService extends BaseAuthenticationService<\n    User,\n    AuthModel,\n    DataContextService\n> {\n    protected getEncodedToken(): string | null {\n        // bearer strategy is taken here, could also be cookies etc..\n        const authHeader: string[] =\n            this.request.headers.authorization?.split(' ') || [];\n        if (authHeader.length === 2) {\n            const token: string = authHeader[1];\n            return token;\n        }\n        return null;\n    }\n\n    protected async getUserFromDecodedToken(\n        decodedToken: AuthModel\n    ): Promise<User | null> {\n        const user = this.dataContext.userRepository.get(decodedToken.id);\n\n        if (user && user.email === decodedToken.email) return user;\n\n        return null;\n    }\n}\n\nexport default AuthenticationService;\n")),(0,i.kt)("h4",{id:"implement-authorization-service"},"Implement Authorization Service"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"BaseAuthorizationService")," is based upon policies. Each policy has a name and a handler function."),(0,i.kt)("p",null,"By default, each handler is always given an object with a ",(0,i.kt)("inlineCode",{parentName:"p"},"decodedToken")," and the ",(0,i.kt)("inlineCode",{parentName:"p"},"request")," to which that token belongs."),(0,i.kt)("p",null,"However, it is possible to provide custom arguments via the method ",(0,i.kt)("inlineCode",{parentName:"p"},"getCustomPolicyArgs"),"."),(0,i.kt)("h6",{id:"srcservicesauthorization-servicets"},"src/services/authorization-service.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { injectService } from '@lindeneg/funkallero';\nimport {\n    BaseAuthorizationService,\n    type AuthorizationPolicyHandlerFn,\n} from '@lindeneg/funkallero-auth-service';\nimport SERVICE from '@/enums/service';\nimport type AuthModel from '@/domain/auth-model';\nimport type AuthenticationService from './authentication-service';\nimport type DataContextService from './data-context-service';\n\ntype CustomHandlerArgs = {\n    authService: AuthenticationService;\n    dataContext: DataContextService;\n};\n\ntype AuthHandler = AuthorizationPolicyHandlerFn<CustomHandlerArgs, AuthModel>;\n\n// BaseAuthorizationService is a scoped service\nclass AuthorizationService extends BaseAuthorizationService<AuthHandler> {\n    @injectService(SERVICE.DATA_CONTEXT)\n    private readonly dataContext: DataContextService;\n\n    protected async getCustomPolicyArgs() {\n        return {\n            authService: this.authService as AuthenticationService,\n            dataContext: this.dataContext,\n        };\n    }\n}\n\n// first way: utilize authService to verify the user\nconst authenticatedPolicy: AuthHandler = async ({ authService }) => {\n    const user = await authService.getUserSafe();\n\n    return user !== null;\n};\n\n// second way: we extract user from data context using decoded token\nconst isMilesDavisPolicy: AuthHandler = async ({ authService }) => {\n    const user = await authService.getUserSafe();\n\n    return user !== null && user.name.toLowerCase() === 'miles davis';\n};\n\nAuthorizationService.addPolicy(\n    ['authenticated', authenticatedPolicy],\n    ['name-is-miles-davis', isMilesDavisPolicy]\n);\n\nexport default AuthorizationService;\n")),(0,i.kt)("h2",{id:"register-auth-services"},"Register Auth Services"),(0,i.kt)("p",null,"Register auth services in main project file."),(0,i.kt)("h6",{id:"srcindexts"},"src/index.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { BaseTokenService } from '@lindeneg/funkallero-auth-service';\nimport AuthenticationService from '@/services/authentication-service';\nimport AuthorizationService from '@/services/authorization-service';\n\nsetup(service) {\n    service.registerSingletonService(SERVICE.TOKEN, BaseTokenService);\n    service.registerScopedService(SERVICE.AUTHENTICATION, AuthenticationService);\n    service.registerScopedService(SERVICE.AUTHORIZATION, AuthorizationService);\n}\n")))}p.isMDXComponent=!0}}]);