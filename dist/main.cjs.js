"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class e{}class t extends e{constructor(e){super(),this.value=e,this.type="NumberExpression"}isStatic(){return!0}eval(){return this.value}}class s extends e{constructor(e,t,s){super(),this.left=e,this.right=t,this.evalHelper=s,this.type="GenericOperatorExpression"}isStatic(){return this.left.isStatic()&&this.right.isStatic()}eval(){return this.evalHelper()}}class r{constructor(e=0){this.precedence=e}parse(e,t,r){const n=e.parseExpression(this.precedence);switch(r[1]){case"+":return new s(t,n,()=>{const e=t.eval(),s=n.eval();if("number"!=typeof e&&"boolean"!=typeof e||"number"!=typeof s&&"boolean"!=typeof s)throw new Error(`Cannot use numeric operators for expression "${e} ${r[1]} ${s}"`);return e+s});case"-":return new s(t,n,()=>{const e=t.eval(),s=n.eval();if("number"!=typeof e&&"boolean"!=typeof e||"number"!=typeof s&&"boolean"!=typeof s)throw new Error(`Cannot use numeric operators for expression "${e} ${r[1]} ${s}"`);return e-s});case"*":return new s(t,n,()=>{const e=t.eval(),s=n.eval();if("number"!=typeof e&&"boolean"!=typeof e||"number"!=typeof s&&"boolean"!=typeof s)throw new Error(`Cannot use numeric operators for expression "${e} ${r[1]} ${s}"`);return e*s});case"/":return new s(t,n,()=>{const e=t.eval(),s=n.eval();if("number"!=typeof e&&"boolean"!=typeof e||"number"!=typeof s&&"boolean"!=typeof s)throw new Error(`Cannot use numeric operators for expression "${e} ${r[1]} ${s}"`);return e/s});case"&&":return new s(t,n,()=>t.eval()&&n.eval());case"||":return new s(t,n,()=>t.eval()||n.eval());case"<":return new s(t,n,()=>t.eval()<n.eval());case"<=":return new s(t,n,()=>t.eval()<=n.eval());case">":return new s(t,n,()=>t.eval()>n.eval());case">=":return new s(t,n,()=>t.eval()>=n.eval());case"==":return new s(t,n,()=>t.eval()===n.eval());case"!=":return new s(t,n,()=>t.eval()!==n.eval());case"??":return new s(t,n,()=>t.eval()??n.eval());case"=":return new s(t,n,()=>{if(t.setPointer)return t.setPointer(n.eval()),0;throw Error("Cannot assign to "+t.type)});default:throw new Error("Operator not implemented")}}}var n;!function(e){e[e.SCOPE=1]="SCOPE",e[e.STATEMENT=2]="STATEMENT",e[e.PROPERTY_ACCESS=3]="PROPERTY_ACCESS",e[e.ARRAY_ACCESS=4]="ARRAY_ACCESS",e[e.ASSIGNMENT=5]="ASSIGNMENT",e[e.CONDITIONAL=6]="CONDITIONAL",e[e.NULLISH_COALESCING=7]="NULLISH_COALESCING",e[e.AND=8]="AND",e[e.OR=9]="OR",e[e.COMPARE=10]="COMPARE",e[e.SUM=11]="SUM",e[e.PRODUCT=12]="PRODUCT",e[e.EXPONENT=13]="EXPONENT",e[e.PREFIX=14]="PREFIX",e[e.POSTFIX=15]="POSTFIX",e[e.FUNCTION=16]="FUNCTION"}(n||(n={}));class i extends e{constructor(e,t){super(),this.tokenType=e,this.expression=t,this.type="PrefixExpression"}isStatic(){return this.expression.isStatic()}eval(){const e=this.expression.eval();switch(this.tokenType){case"MINUS":if("number"!=typeof e)throw new Error(`Cannot use "-" operator in front of ${typeof e}: "-${e}"`);return-e;case"BANG":if("string"==typeof e)throw new Error(`Cannot use "!" operator in front of string: "!${e}"`);return!e}}}class o{constructor(e=0){this.precedence=e}parse(e,t){return new i(t[0],e.parseExpression(this.precedence))}}class a{constructor(e=0){this.precedence=e}parse(e,s){return new t(Number(s[1]))}}const h=(e,t)=>e+Math.random()*(t-e),c=(e,t)=>Math.round(e+Math.random()*(t-e)),u={"math.abs":Math.abs,"math.acos":Math.acos,"math.asin":Math.asin,"math.atan":Math.atan,"math.atan2":Math.atan2,"math.ceil":Math.ceil,"math.clamp":(e,t,s)=>"number"!=typeof e||Number.isNaN(e)?t:e>s?s:e<t?t:e,"math.cos":Math.cos,"math.die_roll":(e,t,s)=>{let r=0;for(;0<e;)r+=h(t,s);return r},"math.die_roll_integer":(e,t,s)=>{let r=0;for(;0<e;)r+=c(t,s);return r},"math.exp":Math.exp,"math.floor":Math.floor,"math.hermite_blend":e=>3*e^2-2*e^3,"math.lerp":(e,t,s)=>(s<0?s=0:s>1&&(s=1),e+(t-e)*s),"math.lerp_rotate":(e,t,s)=>{const r=e=>((e+180)%360+180)%360;if((e=r(e))>(t=r(t))){let s=e;e=t,t=s}return t-e>180?r(t+s*(360-(t-e))):e+s*(t-e)},"math.ln":Math.log,"math.max":Math.max,"math.min":Math.min,"math.mod":(e,t)=>e%t,"math.pi":Math.PI,"math.pow":Math.pow,"math.random":h,"math.random_integer":c,"math.round":Math.round,"math.sin":Math.sin,"math.sqrt":Math.sqrt,"math.trunc":Math.trunc};let p={};function l(e,t="",s={}){for(let r in e)"object"!=typeof e[r]||Array.isArray(e[r])?s[`${t}${r}`]=e[r]:l(e[r],`${t}${r}.`,s);return s}function f(e){p={...u,...l(e)}}class E extends e{constructor(e,t=!1){super(),this.name=e,this.isFunctionCall=t,this.type="NameExpression"}isStatic(){return!1}setPointer(e){!function(e,t){if("."===e[1])switch(e[0]){case"q":e="query"+e.substring(1,e.length);break;case"t":e="temp"+e.substring(1,e.length);break;case"v":e="variable"+e.substring(1,e.length);break;case"c":e="context"+e.substring(1,e.length);break;case"f":e="function"+e.substring(1,e.length)}p[e]=t}(this.name,e)}setFunctionCall(e=!0){this.isFunctionCall=e}eval(){const e=function(e){if("."===e[1])switch(e[0]){case"q":e="query"+e.substring(1,e.length);break;case"t":e="temp"+e.substring(1,e.length);break;case"v":e="variable"+e.substring(1,e.length);break;case"c":e="context"+e.substring(1,e.length);break;case"f":e="function"+e.substring(1,e.length)}return p[e]}(this.name);return this.isFunctionCall||"function"!=typeof e?e:e()}}class x{constructor(e=0){this.precedence=e}parse(e,t){return new E(t[1])}}class w{constructor(e=0){this.precedence=e}parse(e,t){const s=e.parseExpression(this.precedence);return e.consume("RIGHT_PARENT"),s}}class m extends e{constructor(e,t,s){super(),this.leftExpression=e,this.thenExpression=t,this.elseExpression=s,this.type="TernaryExpression"}get isReturn(){return this.leftResult?this.thenExpression.isReturn:this.elseExpression.isReturn}get isContinue(){return this.leftResult?this.thenExpression.isContinue:this.elseExpression.isContinue}get isBreak(){return this.leftResult?this.thenExpression.isBreak:this.elseExpression.isBreak}isStatic(){return this.leftExpression.isStatic()&&this.thenExpression.isStatic()&&this.elseExpression.isStatic()}eval(){return this.leftResult=this.leftExpression.eval(),this.leftResult?this.thenExpression.eval():this.elseExpression.eval()}}class R{constructor(e=0){this.precedence=e,this.exprName="Ternary"}parse(e,s,r){let n,i=e.parseExpression(this.precedence-1);if(e.match("COLON"))n=e.parseExpression(this.precedence-1);else{if(!e.match("SEMICOLON",!1))throw new Error("Binary conditional operator without ending semicolon.");n=new t(0)}return new m(s,i,n)}}class g extends e{constructor(e){super(),this.expression=e,this.type="ReturnExpression",this.isReturn=!0}isStatic(){return!1}eval(){return this.expression.eval()}}class S{constructor(e=0){this.precedence=e}parse(e,s){const r=e.parseExpression(n.STATEMENT);return new g(e.match("SEMICOLON")?r:new t(0))}}class d extends e{constructor(e){super(),this.expressions=e,this.type="StatementExpression",this.didReturn=!1,this.wasLoopBroken=!1,this.wasLoopContinued=!1}get isReturn(){return this.didReturn}get isBreak(){return!!this.wasLoopBroken&&(this.wasLoopBroken=!1,!0)}get isContinue(){return!!this.wasLoopContinued&&(this.wasLoopContinued=!1,!0)}isStatic(){let e=0;for(;e<this.expressions.length;){if(!this.expressions[e].isStatic())return!1;e++}return!0}eval(){this.didReturn=!1,this.wasLoopBroken=!1,this.wasLoopContinued=!1;let e=0;for(;e<this.expressions.length;){let t=this.expressions[e].eval();if(this.expressions[e].isReturn)return this.didReturn=!0,t;if(this.expressions[e].isContinue)return void(this.wasLoopContinued=!0);if(this.expressions[e].isBreak)return void(this.wasLoopBroken=!0);e++}return 0}getExpression(){return this.expressions[0]}}class A extends e{constructor(e,t=!1){super(),this.value=e,this.isReturn=t,this.type="StaticExpression"}isStatic(){return!0}eval(){return this.value}}class v{constructor(e=0){this.precedence=e}parse(e,t,s){if(e.useOptimizer&&(t.isStatic()&&(t=new A(t.eval(),t.isReturn)),t.isReturn))return t;let r,n=[t];do{if(r=e.parseExpression(this.precedence),e.useOptimizer){if(r.isStatic()){if(!r.isReturn&&e.agressiveStaticOptimizer)continue;r=new A(r.eval(),r.isReturn)}if(r.isReturn){n.push(r);break}}n.push(r)}while(e.match("SEMICOLON")||r.isReturn);return new d(n)}}class C extends e{constructor(e){super(),this.name=e,this.type="StringExpression"}isStatic(){return!0}eval(){return this.name.substring(1,this.name.length-1)}}class N{constructor(e=0){this.precedence=e}parse(e,t){return new C(t[1])}}class T extends e{constructor(e,t){super(),this.name=e,this.args=t,this.type="FunctionExpression"}isStatic(){return!1}eval(){const e=[];let t=0;for(;t<this.args.length;)e.push(this.args[t++].eval());return this.name.eval()(...e)}}class I{constructor(e=0){this.precedence=e}parse(e,t,s){const r=[];if(!t.setFunctionCall)throw new Error(t.type+" is not callable!");if(t.setFunctionCall(!0),!e.match("RIGHT_PARENT")){do{r.push(e.parseExpression())}while(e.match("COMMA"));e.consume("RIGHT_PARENT")}return new T(t,r)}}class O extends e{constructor(e,t){super(),this.name=e,this.lookup=t,this.type="ArrayAccessExpression"}isStatic(){return!1}setPointer(e){this.name.eval()[this.lookup.eval()]=e}eval(){return this.name.eval()[this.lookup.eval()]}}class P{constructor(e=0){this.precedence=e}parse(e,t,s){const r=e.parseExpression(this.precedence-1);if(!t.setPointer)throw new Error(`"${t.eval()}" is not an array`);if(!e.match("ARRAY_RIGHT"))throw new Error(`No closing bracket for opening bracket "[${r.eval()}"`);return new O(t,r)}}class b{constructor(e=0){this.precedence=e}parse(e,t){let s,r=!1,i=[];do{if(e.match("CURLY_RIGHT")){r=!0;break}if(s=e.parseExpression(n.STATEMENT),e.useOptimizer&&(s.isStatic()&&(s=new A(s.eval(),s.isReturn)),s.isReturn)){i.push(s);break}i.push(s)}while(e.match("SEMICOLON")||s.isReturn);if(!r&&!e.match("CURLY_RIGHT"))throw new Error("Missing closing curly bracket");return new d(i)}}class L extends e{constructor(e,t){super(),this.count=e,this.expression=t,this.type="LoopExpression"}get isReturn(){return this.expression.isReturn}isStatic(){return this.count.isStatic()&&this.expression.isStatic()}eval(){const e=Number(this.count.eval());if(Number.isNaN(e))throw new Error(`First loop() argument must be of type number, received "${typeof this.count.eval()}"`);if(e>1024)throw new Error(`Cannot loop more than 1024x times, received "${e}"`);let t=0;for(;t<e;){t++;const e=this.expression.eval();if(this.expression.isBreak)break;if(!this.expression.isContinue&&this.expression.isReturn)return e}return 0}}class M{constructor(e=0){this.precedence=e}parse(e,t){e.consume("LEFT_PARENT");const s=[];if(e.match("RIGHT_PARENT"))throw new Error("loop() called without arguments");do{s.push(e.parseExpression())}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),2!==s.length)throw new Error("There must be exactly two loop() arguments; found "+s.length);return new L(s[0],s[1])}}class y extends e{constructor(e,t,s){if(super(),this.variable=e,this.arrayExpression=t,this.expression=s,this.type="ForEachExpression",!this.variable.setPointer)throw new Error(`First for_each() argument must be a variable, received "${typeof this.variable.eval()}"`)}get isReturn(){return this.expression.isReturn}isStatic(){return this.variable.isStatic()&&this.arrayExpression.isStatic()&&this.expression.isStatic()}eval(){const e=this.arrayExpression.eval();if(!Array.isArray(e))throw new Error(`Second for_each() argument must be an array, received "${typeof e}"`);let t=0;for(;t<e.length;){this.variable.setPointer(e[t++]);const s=this.expression.eval();if(this.expression.isBreak)break;if(!this.expression.isContinue&&this.expression.isReturn)return s}return 0}}class _{constructor(e=0){this.precedence=e}parse(e,t){e.consume("LEFT_PARENT");const s=[];if(e.match("RIGHT_PARENT"))throw new Error("for_each() called without arguments");do{s.push(e.parseExpression())}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),3!==s.length)throw new Error("There must be exactly three for_each() arguments; found "+s.length);return new y(s[0],s[1],s[2])}}class k extends e{constructor(){super(),this.type="ContinueExpression",this.isContinue=!0}isStatic(){return!1}eval(){return 0}}class U{constructor(e=0){this.precedence=e}parse(e,t){return new k}}class F extends e{constructor(){super(),this.type="BreakExpression",this.isBreak=!0}isStatic(){return!1}eval(){return 0}}class G{constructor(e=0){this.precedence=e}parse(e,t){return new F}}class $ extends e{constructor(e){super(),this.value=e,this.type="BooleanExpression"}isStatic(){return!0}eval(){return this.value}}class H{constructor(e=0){this.precedence=e}parse(e,t){return new $("true"===t[1])}}class B extends class{constructor(e,t=!1,s=!0,r=!1){this.tokenIterator=e,this.useOptimizer=t,this.agressiveStaticOptimizer=s,this.partialResolveOnParse=r,this.prefixParselets=new Map,this.infixParselets=new Map,this.readTokens=[],this.lastConsumed=["SOF",""]}parseExpression(e=0){let s=this.consume();if("EOF"===s[0])return new t(0);const r=this.prefixParselets.get(s[0]);if(!r)throw new Error(`Cannot parse ${s[0]} expression "${s[1]}"`);let n=r.parse(this,s);return n.isReturn?n:this.parseInfixExpression(n,e)}parseInfixExpression(e,t=0){let s;for(;t<this.getPrecedence();){s=this.consume();e=this.infixParselets.get(s[0]).parse(this,e,s)}return e}getPrecedence(){const e=this.infixParselets.get(this.lookAhead(0)?.[0]);return e?.precedence??0}getLastConsumed(){return this.lastConsumed}consume(e){this.tokenIterator.step();const t=this.lookAhead(0);if(e){if(t[0]!==e)throw new Error(`Expected token "${e}" and found "${t[0]}"`);this.consume()}return this.lastConsumed=this.readTokens.pop(),this.lastConsumed}match(e,t=!0){return this.lookAhead(0)[0]===e&&(t&&this.consume(),!0)}lookAhead(e){for(;e>=this.readTokens.length;)this.readTokens.push(this.tokenIterator.next());return this.readTokens[e]}registerInfix(e,t){this.infixParselets.set(e,t)}registerPrefix(e,t){this.prefixParselets.set(e,t)}getInfix(e){return this.infixParselets.get(e)}getPrefix(e){return this.prefixParselets.get(e)}getTokenizerPosition(){return this.tokenIterator.getPosition()}}{constructor(e,t=!0,s=!0){super(e,t,s),this.registerPrefix("NAME",new x),this.registerPrefix("STRING",new N),this.registerPrefix("NUMBER",new a),this.registerPrefix("TRUE",new H(n.PREFIX)),this.registerPrefix("FALSE",new H(n.PREFIX)),this.registerPrefix("RETURN",new S),this.registerPrefix("CONTINUE",new U),this.registerPrefix("BREAK",new G),this.registerPrefix("LOOP",new M),this.registerPrefix("FOR_EACH",new _),this.registerInfix("QUESTION",new R(n.CONDITIONAL)),this.registerPrefix("LEFT_PARENT",new w),this.registerInfix("LEFT_PARENT",new I(n.FUNCTION)),this.registerInfix("ARRAY_LEFT",new P(n.ARRAY_ACCESS)),this.registerPrefix("CURLY_LEFT",new b(n.SCOPE)),this.registerInfix("SEMICOLON",new v(n.STATEMENT)),this.registerPrefix("MINUS",new o(n.PREFIX)),this.registerPrefix("BANG",new o(n.PREFIX)),this.registerInfix("PLUS",new r(n.SUM)),this.registerInfix("MINUS",new r(n.SUM)),this.registerInfix("ASTERISK",new r(n.PRODUCT)),this.registerInfix("SLASH",new r(n.PRODUCT)),this.registerInfix("EQUALS",new r(n.COMPARE)),this.registerInfix("NOT_EQUALS",new r(n.COMPARE)),this.registerInfix("GREATER_OR_EQUALS",new r(n.COMPARE)),this.registerInfix("GREATER",new r(n.COMPARE)),this.registerInfix("SMALLER_OR_EQUALS",new r(n.COMPARE)),this.registerInfix("SMALLER",new r(n.COMPARE)),this.registerInfix("AND",new r(n.AND)),this.registerInfix("OR",new r(n.OR)),this.registerInfix("NULLISH_COALESCING",new r(n.NULLISH_COALESCING)),this.registerInfix("ASSIGN",new r(n.ASSIGNMENT))}}const Y=new Map([["==","EQUALS"],["!=","NOT_EQUALS"],["??","NULLISH_COALESCING"],["&&","AND"],["||","OR"],[">=","GREATER_OR_EQUALS"],["<=","SMALLER_OR_EQUALS"],[">","GREATER"],["<","SMALLER"],["(","LEFT_PARENT"],[")","RIGHT_PARENT"],["[","ARRAY_LEFT"],["]","ARRAY_RIGHT"],["{","CURLY_LEFT"],["}","CURLY_RIGHT"],[",","COMMA"],["=","ASSIGN"],["+","PLUS"],["-","MINUS"],["*","ASTERISK"],["/","SLASH"],["?","QUESTION"],[":","COLON"],[";","SEMICOLON"],["!","BANG"]]),z=new Set(["return","continue","break","for_each","loop","false","true"]);function D(e,t){let s,r=0,n=0,i=0,o=0;return s=t?new Set([...z,...t]):new Set([...z]),{getPosition:()=>({startLineNumber:o,endLineNumber:i,startColumn:n,endColumn:r}),step(){n=r,o=i},next(){for(;r<e.length;){let t=r+1<e.length?Y.get(e[r]+e[r+1]):void 0;if(t)return r++,[t,e[r-1]+e[r++]];if(t=Y.get(e[r]),t)return[t,e[r++]];if("'"===e[r]){let t=r+1;for(;t<e.length&&"'"!==e[t];)t++;t++;const s=["STRING",e.substring(r,t)];return r=t,s}if(Q(e[r])){let t=r+1;for(;t<e.length&&(Q(e[t])||X(e[t])||"_"===e[t]||"."===e[t]);)t++;const n=e.substring(r,t).toLowerCase(),i=[s.has(n)?n.toUpperCase():"NAME",n];return r=t,i}if(X(e[r])){let t=r+1,s=!1;for(;t<e.length&&(X(e[t])||"."===e[t]&&!s);)"."===e[t]&&(s=!0),t++;const n=["NUMBER",e.substring(r,t)];return r=t,n}"\n"!==e[r]&&"\r"!==e[r]||i++,r++}return["EOF",""]},hasNext:()=>r<e.length}}function Q(e){return e>="a"&&e<="z"||e>="A"&&e<="Z"}function X(e){return e>="0"&&e<="9"}let q={},K=0;function j(){q={}}function Z(e,{useCache:t=!0,useOptimizer:s=!0,useAgressiveStaticOptimizer:r=!0,maxCacheSize:n=256,tokenizer:i=D(e)}={}){if(t){const t=q[e];if(t)return t}const o=new B(i,s,r).parseExpression();return t&&(K>n&&j(),q[e]=s&&o.isStatic()?new A(o.eval()):o,K++),o}exports.clearCache=j,exports.execute=function(e,t,s={}){t&&f(t);const r=Z(e,s).eval();return void 0===r?0:"boolean"==typeof r?Number(r):r},exports.parse=Z,exports.setEnv=f,exports.tokenize=D;
