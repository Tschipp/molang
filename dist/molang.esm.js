const e={"!":"BANG","&":"AND","(":"LEFT_PARENT",")":"RIGHT_PARENT","*":"ASTERISK","+":"PLUS",",":"COMMA","-":"MINUS","/":"SLASH",":":"COLON",";":"SEMICOLON","<":"SMALLER","=":"EQUALS",">":"GREATER","?":"QUESTION","[":"ARRAY_LEFT","]":"ARRAY_RIGHT","{":"CURLY_LEFT","|":"OR","}":"CURLY_RIGHT"},t=new Set(["return","continue","break","for_each","loop","false","true"]);class s{constructor(e,t,s,r){this.type=e,this.text=t,this.startColumn=s,this.startLine=r}getType(){return this.type}getText(){return this.text}getPosition(){return{startColumn:this.startColumn,startLineNumber:this.startLine,endColumn:this.startColumn+this.text.length,endLineNumber:this.startLine}}}class r{constructor(e){this.i=0,this.currentColumn=0,this.currentLine=0,this.lastColumns=0,this.keywordTokens=e?new Set([...t,...e]):t}init(e){this.currentLine=0,this.currentColumn=0,this.lastColumns=0,this.i=0,this.expression=e}next(){for(this.currentColumn=this.i-this.lastColumns;this.i<this.expression.length&&(" "===this.expression[this.i]||"\t"===this.expression[this.i]||"\n"===this.expression[this.i]);)"\n"===this.expression[this.i]&&(this.currentLine++,this.currentColumn=0,this.lastColumns=this.i+1),this.i++;if("#"===this.expression[this.i]){const e=this.expression.indexOf("\n",this.i+1);return this.i=-1===e?this.expression.length:e,this.currentLine++,this.lastColumns=this.i+1,this.currentColumn=0,this.next()}let t=e[this.expression[this.i]];if(t)return new s(t,this.expression[this.i++],this.currentColumn,this.currentLine);if(this.isLetter(this.expression[this.i])||"_"===this.expression[this.i]){let e=this.i+1;for(;e<this.expression.length&&(this.isLetter(this.expression[e])||this.isNumber(this.expression[e])||"_"===this.expression[e]||"."===this.expression[e]);)e++;const t=this.expression.substring(this.i,e).toLowerCase();return this.i=e,new s(this.keywordTokens.has(t)?t.toUpperCase():"NAME",t,this.currentColumn,this.currentLine)}if(this.isNumber(this.expression[this.i])){let e=this.i+1,t=!1;for(;e<this.expression.length&&(this.isNumber(this.expression[e])||"."===this.expression[e]&&!t);)"."===this.expression[e]&&(t=!0),e++;const r=new s("NUMBER",this.expression.substring(this.i,e),this.currentColumn,this.currentLine),i=t&&"f"===this.expression[e];return this.i=i?e+1:e,r}if("'"===this.expression[this.i]){let e=this.i+1;for(;e<this.expression.length&&"'"!==this.expression[e];)e++;e++;const t=new s("STRING",this.expression.substring(this.i,e),this.currentColumn,this.currentLine);return this.i=e,t}return this.hasNext()?(this.i++,this.next()):new s("EOF","",this.currentColumn,this.currentLine)}hasNext(){return this.i<this.expression.length}isLetter(e){return e>="a"&&e<="z"||e>="A"&&e<="Z"}isNumber(e){return e>="0"&&e<="9"}}const i=(e,t,s)=>"number"!=typeof e||Number.isNaN(e)?t:e>s?s:e<t?t:e,n=(e,t,s)=>{let r=0;for(;0<e;)r+=p(t,s);return r},o=(e,t,s)=>{let r=0;for(;0<e;)r+=l(t,s);return r},a=e=>3*e**2-2*e**3,h=(e,t,s)=>(s<0?s=0:s>1&&(s=1),e+(t-e)*s),c=(e,t,s)=>{const r=e=>((e+180)%360+180)%360;if((e=r(e))>(t=r(t))){let s=e;e=t,t=s}return t-e>180?r(t+s*(360-(t-e))):e+s*(t-e)},u=(e,t)=>e%t,p=(e,t)=>e+Math.random()*(t-e),l=(e,t)=>Math.round(e+Math.random()*(t-e)),x=e=>((e=((e%=360)+360)%360)>179&&(e-=360),e),E=e=>{const t=e?1:Math.PI/180;return{"math.abs":Math.abs,"math.acos":e=>Math.acos(e)/t,"math.asin":e=>Math.asin(e)/t,"math.atan":e=>Math.atan(e)/t,"math.atan2":(e,s)=>Math.atan2(e,s)/t,"math.ceil":Math.ceil,"math.clamp":i,"math.cos":e=>Math.cos(e*t),"math.die_roll":n,"math.die_roll_integer":o,"math.exp":Math.exp,"math.floor":Math.floor,"math.hermite_blend":a,"math.lerp":h,"math.lerp_rotate":c,"math.ln":Math.log,"math.max":Math.max,"math.min":Math.min,"math.min_angle":x,"math.mod":u,"math.pi":Math.PI,"math.pow":Math.pow,"math.random":p,"math.random_integer":l,"math.round":Math.round,"math.sin":e=>Math.sin(e*t),"math.sqrt":Math.sqrt,"math.trunc":Math.trunc}};class f{constructor(e,t){this.config=t,t.isFlat?this.env=Object.assign(e,E(t.useRadians??!1)):this.env={...E(t.useRadians??!1),...this.flattenEnv(e)}}updateConfig({variableHandler:e,convertUndefined:t,useRadians:s}){void 0!==t&&(this.config.convertUndefined=t),"function"==typeof e&&(this.config.variableHandler=e),!!this.config.useRadians!=!!s&&(this.env=Object.assign(this.env,E(!!s)))}flattenEnv(e,t="",s={}){for(let r in e){if("."===r[1])switch(r[0]){case"q":r="query"+r.substring(1,r.length);break;case"t":r="temp"+r.substring(1,r.length);break;case"v":r="variable"+r.substring(1,r.length);break;case"c":r="context"+r.substring(1,r.length);break;case"f":r="function"+r.substring(1,r.length)}e[r].__isContext?s[`${t}${r}`]=e[r].env:"object"!=typeof e[r]||Array.isArray(e[r])?s[`${t}${r}`]=e[r]:this.flattenEnv(e[r],`${t}${r}.`,s)}return s}setAt(e,t){if("."===e[1])switch(e[0]){case"q":e="query"+e.substring(1,e.length);break;case"t":e="temp"+e.substring(1,e.length);break;case"v":e="variable"+e.substring(1,e.length);break;case"c":e="context"+e.substring(1,e.length);break;case"f":e="function"+e.substring(1,e.length)}return this.env[e]=t}getFrom(e){if("."===e[1])switch(e[0]){case"q":e="query"+e.substring(1,e.length);break;case"t":e="temp"+e.substring(1,e.length);break;case"v":e="variable"+e.substring(1,e.length);break;case"c":e="context"+e.substring(1,e.length);break;case"f":e="function"+e.substring(1,e.length)}const t=this.env[e]??this.config.variableHandler?.(e,this.env);return void 0===t&&this.config.convertUndefined?0:t}}class g{constructor(e){this.env=e,this.__isContext=!0}}class m{toString(){return""+this.eval()}walk(e,t=new Set){let s=e(this)??this;return s.iterate(e,t),s}iterate(e,t){for(let s=0;s<this.allExpressions.length;s++){const r=this.allExpressions[s];if(t.has(r))continue;t.add(r);const i=e(r)??r;i!==r&&t.has(i)||(t.add(i),this.setExpressionAt(s,i),i.iterate(e,t))}}}class d extends m{constructor(){super(...arguments),this.type="VoidExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return 0}toString(){return""}}class w extends m{constructor(e,t,s,r){super(),this.left=e,this.right=t,this.operator=s,this.evalHelper=r,this.type="GenericOperatorExpression"}get allExpressions(){return[this.left,this.right]}setExpressionAt(e,t){0===e?this.left=t:1===e&&(this.right=t)}isStatic(){return this.left.isStatic()&&this.right.isStatic()}eval(){return this.evalHelper(this.left,this.right)}toString(){return`${this.left.toString()}${this.operator}${this.right.toString()}`}}const S=(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} + ${r}"`);return s+r},v=(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} - ${r}"`);return s-r},R=(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} / ${r}"`);return s/r},T=(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} * ${r}"`);return s*r},A=(e,t)=>{if(e.setPointer)return e.setPointer(t.eval()),0;throw Error("Cannot assign to "+e.type)};class C{constructor(e=0){this.precedence=e}parse(e,t,s){const r=e.parseExpression(this.precedence),i=s.getText();switch(i){case"+":return new w(t,r,i,S);case"-":return new w(t,r,i,v);case"*":return new w(t,r,i,T);case"/":return new w(t,r,i,R);case"=":return new w(t,r,"=",A);default:throw new Error("Operator not implemented")}}}var y;!function(e){e[e.SCOPE=1]="SCOPE",e[e.STATEMENT=2]="STATEMENT",e[e.ASSIGNMENT=3]="ASSIGNMENT",e[e.CONDITIONAL=4]="CONDITIONAL",e[e.ARRAY_ACCESS=5]="ARRAY_ACCESS",e[e.NULLISH_COALESCING=6]="NULLISH_COALESCING",e[e.AND=7]="AND",e[e.OR=8]="OR",e[e.COMPARE=9]="COMPARE",e[e.SUM=10]="SUM",e[e.PRODUCT=11]="PRODUCT",e[e.EXPONENT=12]="EXPONENT",e[e.PREFIX=13]="PREFIX",e[e.POSTFIX=14]="POSTFIX",e[e.FUNCTION=15]="FUNCTION"}(y||(y={}));class k extends m{constructor(e,t){super(),this.tokenType=e,this.expression=t,this.type="PrefixExpression"}get allExpressions(){return[this.expression]}setExpressionAt(e,t){this.expression=t}isStatic(){return this.expression.isStatic()}eval(){const e=this.expression.eval();if("number"!=typeof e)throw new Error(`Cannot use "${this.tokenType}" operator in front of ${typeof e} "${e}"`);switch(this.tokenType){case"MINUS":return-e;case"BANG":return!e}}toString(){switch(this.tokenType){case"MINUS":return"-"+this.expression.toString();case"BANG":return"!"+this.expression.toString()}throw new Error(`Unknown prefix operator: "${this.tokenType}"`)}}class N{constructor(e=0){this.precedence=e}parse(e,t){return new k(t.getType(),e.parseExpression(this.precedence))}}class b extends m{constructor(e){super(),this.value=e,this.type="NumberExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.value}toString(){return""+this.value}}class P{constructor(e=0){this.precedence=e}parse(e,t){return new b(Number(t.getText()))}}class I extends m{constructor(e,t,s=!1){super(),this.executionEnv=e,this.name=t,this.isFunctionCall=s,this.type="NameExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!1}setPointer(e){this.executionEnv.setAt(this.name,e)}setFunctionCall(e=!0){this.isFunctionCall=e}setName(e){this.name=e}setExecutionEnv(e){this.executionEnv=e}eval(){const e=this.executionEnv.getFrom(this.name);return this.isFunctionCall||"function"!=typeof e?e:e()}toString(){return this.name}}class O extends m{constructor(e,t){super(),this.leftExpr=e,this.rightExpr=t,this.type="NameExpression"}get allExpressions(){return[this.leftExpr,this.rightExpr]}setExpressionAt(e,t){if(!(t instanceof I))throw new Error('Cannot use context switch operator "->" on '+t.type);0===e?this.leftExpr=t:1===e&&(this.rightExpr=t)}isStatic(){return!1}eval(){return this.rightExpr.setExecutionEnv(new f(this.leftExpr.eval(),this.rightExpr.executionEnv.config)),this.rightExpr.eval()}toString(){return`${this.leftExpr.toString()}->${this.rightExpr.toString()}`}}class L{constructor(e=0){this.precedence=e}parse(e,t){const s=new I(e.executionEnv,t.getText()),r=[e.lookAhead(0),e.lookAhead(1)];if("MINUS"===r[0].getType()&&"GREATER"===r[1].getType()){e.consume("MINUS"),e.consume("GREATER");const t=e.lookAhead(0);if("NAME"!==t.getType())throw new Error('Cannot use context switch operator "->" on '+e.lookAhead(0));return e.consume("NAME"),new O(s,new I(e.executionEnv,t.getText()))}return s}}class M extends m{constructor(e,t){super(),this.expression=e,this.brackets=t,this.type="GroupExpression"}get allExpressions(){return[this.expression]}setExpressionAt(e,t){this.expression=t}isStatic(){return this.expression.isStatic()}get isReturn(){return this.expression.isReturn}get isBreak(){return this.expression.isBreak}get isContinue(){return this.expression.isContinue}eval(){return this.expression.eval()}toString(){return`${this.brackets[0]}${this.expression.toString()}${this.brackets[1]}`}}class _{constructor(e=0){this.precedence=e}parse(e,t){const s=e.parseExpression(this.precedence);return e.consume("RIGHT_PARENT"),e.config.keepGroups&&e.config.useOptimizer&&!s.isStatic()?new M(s,"()"):s}}class U extends m{constructor(e){super(),this.expression=e,this.type="ReturnExpression",this.isReturn=!0}get allExpressions(){return[this.expression]}setExpressionAt(e,t){this.expression=t}isStatic(){return!1}eval(){return this.expression.eval()}toString(){return"return "+this.expression.toString()}}class ${constructor(e=0){this.precedence=e}parse(e,t){const s=e.parseExpression(y.STATEMENT+1);return new U(e.match("SEMICOLON",!1)?s:new b(0))}}class F extends m{constructor(e,t=!1){super(),this.value=e,this.isReturn=t,this.type="StaticExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.value}toString(){let e=this.value;return"string"==typeof e&&(e=`'${e}'`),this.isReturn?"return "+e:""+e}}class G extends m{constructor(e){super(),this.expressions=e,this.type="StatementExpression",this.didReturn=void 0,this.wasLoopBroken=!1,this.wasLoopContinued=!1}get allExpressions(){return this.expressions}setExpressionAt(e,t){this.expressions[e]=t}get isReturn(){if(void 0!==this.didReturn)return this.didReturn;let e=0;for(;e<this.expressions.length;){const t=this.expressions[e];if(t.isBreak)return!1;if(t.isContinue)return!1;if(t.isReturn)return this.didReturn=!0,!0;e++}return this.didReturn=!1,!1}get isBreak(){return!!this.wasLoopBroken&&(this.wasLoopBroken=!1,!0)}get isContinue(){return!!this.wasLoopContinued&&(this.wasLoopContinued=!1,!0)}isStatic(){let e=0;for(;e<this.expressions.length;){if(!this.expressions[e].isStatic())return!1;e++}return!0}eval(){this.didReturn=!1,this.wasLoopBroken=!1,this.wasLoopContinued=!1;let e=0;for(;e<this.expressions.length;){let t=this.expressions[e].eval();if(this.expressions[e].isReturn)return this.didReturn=!0,t;if(this.expressions[e].isContinue)return void(this.wasLoopContinued=!0);if(this.expressions[e].isBreak)return void(this.wasLoopBroken=!0);e++}return 0}toString(){let e="";for(const t of this.expressions)t instanceof d||t instanceof F&&!t.isReturn||(e+=t.toString()+";");return e}}class B{constructor(e=0){this.precedence=e}findReEntryPoint(e){let t=1,s=e.lookAhead(0).getType();for(;"EOF"!==s&&("CURLY_RIGHT"==s?t--:"CURLY_LEFT"===s&&t++,0!==t);)e.consume(),s=e.lookAhead(0).getType()}parse(e,t,s){if(e.config.useOptimizer&&(t.isStatic()&&(t=new F(t.eval(),t.isReturn)),e.config.earlyReturnsSkipParsing&&t.isReturn))return e.config.earlyReturnsSkipTokenization||this.findReEntryPoint(e),new G([t]);const r=[t];if(!e.match("CURLY_RIGHT",!1))do{let t=e.parseExpression(this.precedence);if(e.config.useOptimizer){if(t.isStatic()){if(e.config.useAgressiveStaticOptimizer&&!t.isReturn)continue;t=new F(t.eval(),t.isReturn)}if(e.config.earlyReturnsSkipParsing&&(t.isBreak||t.isContinue||t.isReturn))return r.push(t),e.config.earlyReturnsSkipTokenization||this.findReEntryPoint(e),new G(r)}r.push(t)}while(e.match("SEMICOLON")&&!e.match("EOF")&&!e.match("CURLY_RIGHT",!1));e.match("SEMICOLON");return new G(r)}}class z extends m{constructor(e){super(),this.name=e,this.type="StringExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.name.substring(1,this.name.length-1)}toString(){return this.name}}class H{constructor(e=0){this.precedence=e}parse(e,t){return new z(t.getText())}}class Y extends m{constructor(e,t){super(),this.name=e,this.args=t,this.type="FunctionExpression"}get allExpressions(){return[this.name,...this.args]}setExpressionAt(e,t){0===e?this.name=t:e>0&&(this.args[e-1]=t)}isStatic(){return!1}eval(){const e=[];let t=0;for(;t<this.args.length;)e.push(this.args[t++].eval());const s=this.name.eval();if("function"!=typeof s)throw new Error(this.name.toString()+" is not callable!");return s(...e)}toString(){let e=this.name.toString()+"(";for(let t=0;t<this.args.length;t++)e+=`${this.args[t].toString()}${t+1<this.args.length?",":""}`;return e+")"}}class D{constructor(e=0){this.precedence=e}parse(e,t,s){const r=[];if(!t.setFunctionCall)throw new Error(t.type+" is not callable!");if(t.setFunctionCall(!0),!e.match("RIGHT_PARENT")){do{r.push(e.parseExpression())}while(e.match("COMMA"));e.consume("RIGHT_PARENT")}return new Y(t,r)}}class Q extends m{constructor(e,t){super(),this.name=e,this.lookup=t,this.type="ArrayAccessExpression"}get allExpressions(){return[this.name,this.lookup]}setExpressionAt(e,t){0===e?this.name=t:1===e&&(this.lookup=t)}isStatic(){return!1}setPointer(e){this.name.eval()[this.lookup.eval()]=e}eval(){return this.name.eval()[this.lookup.eval()]}toString(){return`${this.name.toString()}[${this.lookup.toString()}]`}}class X{constructor(e=0){this.precedence=e}parse(e,t,s){const r=e.parseExpression(this.precedence-1);if(!t.setPointer)throw new Error(`"${t.type}" is not an array`);if(!e.match("ARRAY_RIGHT"))throw new Error(`No closing bracket for opening bracket "[${r.eval()}"`);return new Q(t,r)}}class q{constructor(e=0){this.precedence=e}parse(e,t){let s=e.parseExpression(this.precedence);return e.config.useOptimizer&&e.config.earlyReturnsSkipTokenization&&s.isReturn?e.match("CURLY_RIGHT"):e.consume("CURLY_RIGHT"),e.config.keepGroups?new M(s,"{}"):s}}class j extends m{constructor(e,t){super(),this.count=e,this.expression=t,this.type="LoopExpression"}get allExpressions(){return[this.count,this.expression]}setExpressionAt(e,t){0===e?this.count=t:1===e&&(this.expression=t)}get isReturn(){return this.expression.isReturn}isStatic(){return this.count.isStatic()&&this.expression.isStatic()}eval(){const e=Number(this.count.eval());if(Number.isNaN(e))throw new Error(`First loop() argument must be of type number, received "${typeof this.count.eval()}"`);if(e>1024)throw new Error(`Cannot loop more than 1024x times, received "${e}"`);let t=0;for(;t<e;){t++;const e=this.expression.eval();if(this.expression.isBreak)break;if(!this.expression.isContinue&&this.expression.isReturn)return e}return 0}toString(){return`loop(${this.count.toString()},${this.expression.toString()})`}}class K{constructor(e=0){this.precedence=e}parse(e,t){e.consume("LEFT_PARENT");const s=[];if(e.match("RIGHT_PARENT"))throw new Error("loop() called without arguments");do{s.push(e.parseExpression())}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),2!==s.length)throw new Error("There must be exactly two loop() arguments; found "+s.length);return new j(s[0],s[1])}}class V extends m{constructor(e,t,s){if(super(),this.variable=e,this.arrayExpression=t,this.expression=s,this.type="ForEachExpression",!this.variable.setPointer)throw new Error(`First for_each() argument must be a variable, received "${typeof this.variable.eval()}"`)}get isReturn(){return this.expression.isReturn}get allExpressions(){return[this.variable,this.arrayExpression,this.expression]}setExpressionAt(e,t){0===e?this.variable=t:1===e?this.arrayExpression=t:2===e&&(this.expression=t)}isStatic(){return this.variable.isStatic()&&this.arrayExpression.isStatic()&&this.expression.isStatic()}eval(){const e=this.arrayExpression.eval();if(!Array.isArray(e))throw new Error(`Second for_each() argument must be an array, received "${typeof e}"`);let t=0;for(;t<e.length;){this.variable.setPointer?.(e[t++]);const s=this.expression.eval();if(this.expression.isBreak)break;if(!this.expression.isContinue&&this.expression.isReturn)return s}return 0}toString(){return`loop(${this.variable.toString()},${this.arrayExpression.toString()},${this.expression.toString()})`}}class Z{constructor(e=0){this.precedence=e}parse(e,t){e.consume("LEFT_PARENT");const s=[];if(e.match("RIGHT_PARENT"))throw new Error("for_each() called without arguments");do{s.push(e.parseExpression())}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),3!==s.length)throw new Error("There must be exactly three for_each() arguments; found "+s.length);return new V(s[0],s[1],s[2])}}class J extends m{constructor(){super(),this.type="ContinueExpression",this.isContinue=!0}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!1}eval(){return 0}toString(){return"continue"}}class W{constructor(e=0){this.precedence=e}parse(e,t){return new J}}class ee extends m{constructor(){super(),this.type="BreakExpression",this.isBreak=!0}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!1}eval(){return 0}isString(){return"break"}}class te{constructor(e=0){this.precedence=e}parse(e,t){return new ee}}class se extends m{constructor(e){super(),this.value=e,this.type="BooleanExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.value}}class re{constructor(e=0){this.precedence=e}parse(e,t){return new se("true"===t.getText())}}class ie{constructor(e=0){this.precedence=e}parse(e,t,s){return new w(t,e.parseExpression(this.precedence),"==",(e,t)=>e.eval()===t.eval())}}class ne{constructor(e=0){this.precedence=e}parse(e,t,s){if(e.match("EQUALS"))return new w(t,e.parseExpression(this.precedence),"!=",(e,t)=>e.eval()!==t.eval());throw new Error("! was used as a binary operator")}}class oe{constructor(e=0){this.precedence=e}parse(e,t,s){if(e.match("AND"))return new w(t,e.parseExpression(this.precedence),"&&",(e,t)=>e.eval()&&t.eval());throw new Error('"&" not followed by another "&"')}}class ae{constructor(e=0){this.precedence=e}parse(e,t,s){if(e.match("OR"))return new w(t,e.parseExpression(this.precedence),"||",(e,t)=>e.eval()||t.eval());throw new Error('"|" not followed by another "|"')}}class he{constructor(e=0){this.precedence=e}parse(e,t,s){return e.match("EQUALS")?new w(t,e.parseExpression(this.precedence),"<=",(e,t)=>e.eval()<=t.eval()):new w(t,e.parseExpression(this.precedence),"<",(e,t)=>e.eval()<t.eval())}}class ce{constructor(e=0){this.precedence=e}parse(e,t,s){return e.match("EQUALS")?new w(t,e.parseExpression(this.precedence),">=",(e,t)=>e.eval()>=t.eval()):new w(t,e.parseExpression(this.precedence),">",(e,t)=>e.eval()>t.eval())}}class ue extends m{constructor(e,t,s){super(),this.leftExpression=e,this.thenExpression=t,this.elseExpression=s,this.type="TernaryExpression"}get allExpressions(){return this.leftExpression.isStatic()?[this.leftExpression,this.leftExpression.eval()?this.thenExpression:this.elseExpression]:[this.leftExpression,this.thenExpression,this.elseExpression]}setExpressionAt(e,t){0===e?this.leftExpression=t:1===e?this.thenExpression=t:2===e&&(this.elseExpression=t)}get isReturn(){return void 0===this.leftResult?this.thenExpression.isReturn&&this.elseExpression.isReturn:this.leftResult?this.thenExpression.isReturn:this.elseExpression.isReturn}get hasReturn(){return this.thenExpression.isReturn||this.elseExpression.isReturn}get isContinue(){return void 0===this.leftResult?this.thenExpression.isContinue&&this.elseExpression.isContinue:this.leftResult?this.thenExpression.isContinue:this.elseExpression.isContinue}get isBreak(){return void 0===this.leftResult?this.thenExpression.isBreak&&this.elseExpression.isBreak:this.leftResult?this.thenExpression.isBreak:this.elseExpression.isBreak}isStatic(){return this.leftExpression.isStatic()&&this.thenExpression.isStatic()&&this.elseExpression.isStatic()}eval(){return this.leftResult=this.leftExpression.eval(),this.leftResult?this.thenExpression.eval():this.elseExpression.eval()}toString(){return this.elseExpression instanceof d?`${this.leftExpression.toString()}?${this.thenExpression.toString()}`:`${this.leftExpression.toString()}?${this.thenExpression.toString()}:${this.elseExpression.toString()}`}}const pe=new class{constructor(e=0){this.precedence=e,this.exprName="Ternary"}parse(e,t,s){let r,i=e.parseExpression(this.precedence);return r=e.match("COLON")?e.parseExpression(this.precedence):new d,e.config.useOptimizer&&t.isStatic()?t.eval()?i:r:new ue(t,i,r)}}(y.CONDITIONAL);class le{constructor(e=0){this.precedence=e}parse(e,t,s){return e.match("QUESTION")?new w(t,e.parseExpression(this.precedence),"??",(e,t)=>e.eval()??t.eval()):pe.parse(e,t,s)}}class xe extends class{constructor(e){this.config=e,this.prefixParselets=new Map,this.infixParselets=new Map,this.readTokens=[],this.tokenIterator=new r}updateConfig(e){this.config=e}init(e){this.tokenIterator.init(e),this.readTokens=[]}setTokenizer(e){this.tokenIterator=e}setExecutionEnvironment(e){this.executionEnv=e}parseExpression(e=0){let t=this.consume();if("EOF"===t.getType())return new d;const s=this.prefixParselets.get(t.getType());if(!s)throw new Error(`Cannot parse ${t.getType()} expression "${t.getType()}"`);let r=s.parse(this,t);return this.parseInfixExpression(r,e)}parseInfixExpression(e,t=0){let s;for(;this.getPrecedence()>t;){s=this.consume();let t=s.getType();"EQUALS"!==t||this.match("EQUALS")||(t="ASSIGN");const r=this.infixParselets.get(t);if(!r)throw new Error(`Unknown infix parselet: "${t}"`);e=r.parse(this,e,s)}return e}getPrecedence(){const e=this.infixParselets.get(this.lookAhead(0).getType());return e?.precedence??0}consume(e){const t=this.lookAhead(0);if(e&&t.getType()!==e)throw new Error(`Expected token "${e}" and found "${t.getType()}"`);return this.readTokens.shift(),t}match(e,t=!0){return this.lookAhead(0).getType()===e&&(t&&this.consume(),!0)}lookAhead(e){for(;e>=this.readTokens.length;)this.readTokens.push(this.tokenIterator.next());return this.readTokens[e]}registerInfix(e,t){this.infixParselets.set(e,t)}registerPrefix(e,t){this.prefixParselets.set(e,t)}getInfix(e){return this.infixParselets.get(e)}getPrefix(e){return this.prefixParselets.get(e)}}{constructor(e){super(e),this.registerPrefix("NAME",new L),this.registerPrefix("STRING",new H),this.registerPrefix("NUMBER",new P),this.registerPrefix("TRUE",new re(y.PREFIX)),this.registerPrefix("FALSE",new re(y.PREFIX)),this.registerPrefix("RETURN",new $),this.registerPrefix("CONTINUE",new W),this.registerPrefix("BREAK",new te),this.registerPrefix("LOOP",new K),this.registerPrefix("FOR_EACH",new Z),this.registerInfix("QUESTION",new le(y.CONDITIONAL)),this.registerPrefix("LEFT_PARENT",new _),this.registerInfix("LEFT_PARENT",new D(y.FUNCTION)),this.registerInfix("ARRAY_LEFT",new X(y.ARRAY_ACCESS)),this.registerPrefix("CURLY_LEFT",new q(y.SCOPE)),this.registerInfix("SEMICOLON",new B(y.STATEMENT)),this.registerPrefix("MINUS",new N(y.PREFIX)),this.registerPrefix("BANG",new N(y.PREFIX)),this.registerInfix("PLUS",new C(y.SUM)),this.registerInfix("MINUS",new C(y.SUM)),this.registerInfix("ASTERISK",new C(y.PRODUCT)),this.registerInfix("SLASH",new C(y.PRODUCT)),this.registerInfix("EQUALS",new ie(y.COMPARE)),this.registerInfix("BANG",new ne(y.COMPARE)),this.registerInfix("GREATER",new ce(y.COMPARE)),this.registerInfix("SMALLER",new he(y.COMPARE)),this.registerInfix("AND",new oe(y.AND)),this.registerInfix("OR",new ae(y.OR)),this.registerInfix("ASSIGN",new C(y.ASSIGNMENT))}}class Ee{constructor(e=0){this.precedence=e}parse(e,t){if(e.consume("LEFT_PARENT"),e.match("RIGHT_PARENT"))throw new Error("function() called without arguments");let s,r,i=[];do{const t=e.parseExpression();if(t instanceof z)r?i.push(t.eval()):r=t.eval();else{if(!(t instanceof G||t instanceof M))throw new Error(`Unexpected expresion: found "${t.constructor.name}"`);s=t}}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),!r)throw new Error(`Missing function() name (argument 1); found "${r}"`);if(!s)throw new Error(`Missing function() body (argument ${i.length+2})`);return new fe(e.functions,r,i,s)}}class fe extends m{constructor(e,t,s,r){super(),this.functionBody=r,this.type="CustomFunctionExpression",e.set(t,[s,r instanceof M?r.allExpressions[0].toString():r.toString()])}get allExpressions(){return[this.functionBody]}setExpressionAt(e,t){this.functionBody=t}get isReturn(){return!1}isStatic(){return!0}eval(){return 0}}class ge{constructor(e={},t={}){this.config=t,this.expressionCache={},this.totalCacheEntries=0,void 0===t.useOptimizer&&(this.config.useOptimizer=!0),void 0===t.useCache&&(this.config.useCache=!0),void 0===t.earlyReturnsSkipParsing&&(this.config.earlyReturnsSkipParsing=!0),void 0===t.earlyReturnsSkipTokenization&&(this.config.earlyReturnsSkipTokenization=!0),void 0===t.convertUndefined&&(this.config.convertUndefined=!1),this.parser=new xe({...this.config,tokenizer:void 0}),this.updateExecutionEnv(e)}updateConfig(e){(e=Object.assign(this.config,e)).tokenizer&&this.parser.setTokenizer(e.tokenizer),this.parser.updateConfig({...this.config,tokenizer:void 0}),this.executionEnvironment.updateConfig(e)}updateExecutionEnv(e,t=!1){this.executionEnvironment=new f(e,{useRadians:this.config.useRadians,convertUndefined:this.config.convertUndefined,isFlat:t,variableHandler:this.config.variableHandler}),this.parser.setExecutionEnvironment(this.executionEnvironment)}clearCache(){this.expressionCache={},this.totalCacheEntries=0}execute(e){this.parser.setExecutionEnvironment(this.executionEnvironment);const t=this.parse(e).eval();return void 0===t?0:"boolean"==typeof t?Number(t):t}executeAndCatch(e){try{return this.execute(e)}catch{return 0}}parse(e){if(this.config.useCache??1){const t=this.expressionCache[e];if(t)return t}this.parser.init(e);let t=this.parser.parseExpression();return(this.config.useOptimizer??1)&&t.isStatic()&&(t=new F(t.eval())),(this.config.useCache??1)&&(this.totalCacheEntries>(this.config.maxCacheSize||256)&&this.clearCache(),this.expressionCache[e]=t,this.totalCacheEntries++),t}resolveStatic(e){e.walk(e=>{if(!(e instanceof z))return e.isStatic()?new F(e.eval()):void 0})}getParser(){return this.parser}}class me extends xe{constructor(e){super(e),this.functions=new Map,this.registerPrefix("FUNCTION",new Ee)}reset(){this.functions.clear()}}class de{constructor(e){this.parser=new me({useCache:!1,useOptimizer:!0,useAgressiveStaticOptimizer:!0,keepGroups:!0,earlyReturnsSkipParsing:!1,earlyReturnsSkipTokenization:!1}),this.parser.setExecutionEnvironment(new f(this.parser,e)),this.parser.setTokenizer(new r(new Set(["function"])))}get functions(){return this.parser.functions}parse(e){this.parser.init(e);return this.parser.parseExpression()}transform(e){const t=new ge({},{useCache:!1,keepGroups:!0,useOptimizer:!0,useAgressiveStaticOptimizer:!0,earlyReturnsSkipParsing:!0,earlyReturnsSkipTokenization:!1});let s=0,r=t.parse(e),i=!1;r instanceof G&&(i=!0);let n=!1;r=r.walk(e=>{if("FunctionExpression"!==e.type)return;const r=e.name.name.replace(/(f|function)\./g,""),i=e.args;let[o,a]=this.functions.get(r)??[];if(!a||!o)return;a=a.replace(/(a|arg)\.(\w+)/g,(e,t,s)=>(i[o.indexOf(s)]?.toString()??"0").replace(/(t|temp)\./,"outer_temp."));let h=function(e){if(e instanceof U)return new M(e.allExpressions[0],"()");if(!(e instanceof G))return e;if(e.allExpressions.length>1)return e;const t=e.allExpressions[0];return t instanceof U?new M(t.allExpressions[0],"()"):e}(t.parse(a));h instanceof G&&(h=t.parse(`({${a}}+t.return_value)`),n=!0);const c=new Map;return h=h.walk(e=>{if(e instanceof I){const t=e.toString();let r=t.split(".");const i=r.shift(),n=r.join(".");if("t"===i||"temp"===i){let r=c.get(t);r||(r="t.__scvar"+s++,c.set(t,r)),e.setName(r)}else"outer_temp"===i&&e.setName("t."+n)}else{if(e instanceof U){const s=new I(t.getParser().executionEnv,"t.return_value"),r=e.allExpressions[0];return new w(s,r,"=",()=>{s.setPointer(r.eval())})}if(e instanceof G){const t=[];for(let s=0;s<e.allExpressions.length;s++){const r=e.allExpressions[s];if(r instanceof ue&&r.hasReturn){we(r,e.allExpressions.slice(s+1)),t.push(r);break}if(r.isReturn){t.push(r);break}t.push(r)}return new G(t)}}}),h});const o=t.parse(r.toString());return t.resolveStatic(o),!i&&n?`return ${o.toString()};`:o.toString()}reset(){this.functions.clear()}}function we(e,t){if(e.isReturn)return;const s=e.allExpressions[2].isReturn?1:2,r=e.allExpressions[s];r instanceof d||(r instanceof M&&r.allExpressions[0]instanceof G?t.unshift(...r.allExpressions):t.unshift(r)),t.length>0&&e.setExpressionAt(s,new M(new G(t),"{}"))}var Se=Object.freeze({__proto__:null,ArrayAccessExpression:Q,BooleanExpression:se,BreakExpression:ee,ContinueExpression:J,ForEachExpression:V,FunctionExpression:Y,GenericOperatorExpression:w,GroupExpression:M,LoopExpression:j,NameExpression:I,NumberExpression:b,PostfixExpression:class extends m{constructor(e,t){super(),this.expression=e,this.tokenType=t,this.type="PostfixExpression"}get allExpressions(){return[this.expression]}setExpressionAt(e,t){this.expression=t}isStatic(){return this.expression.isStatic()}eval(){this.tokenType}},PrefixExpression:k,ReturnExpression:U,StatementExpression:G,StaticExpression:F,StringExpression:z,TernaryExpression:ue,VoidExpression:d});export{g as Context,de as CustomMoLang,ge as MoLang,r as Tokenizer,Se as expressions};
