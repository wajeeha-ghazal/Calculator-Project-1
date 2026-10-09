import { CalcError } from './tokenizer.js';

const CONSTANTS = {'pi':3.14159265359,'e':2.71828};
const FUNCTIONS = { sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan };

export const parse = (tokens, variables = {}) => {
  let pos = 0;

  const peek = () => tokens[pos];                 // look, don't move
  const next = () => tokens[pos++];               // return current, then move
  const isOp = (value) => peek()?.type === 'operator' && peek().value === value;
  const expect= (value)=>{ 
    let tok=next();
    if (!tok|| tok.type!=='paren'||tok.value!==value){ 
        throw new CalcError(`Missing Parenthesis"${value}"`);}

}
  const parseExpression = () => {
  let left = parseTerm();

  while (isOp('+') || isOp('-')) {   // peek only, nothing consumed yet
    const op = next();               // now we know it's + or -, so consume it
    const right = parseTerm();
    if (op.value === '+') {
      left = left + right;
    } else {
      left = left - right;
    }
  }

  return left;
};
  const parseTerm = () => { 
    let left=parseUnary();
    while(isOp('*')|| isOp('/')){
        const op=next();
        const right=parseUnary();
        if(op.value==='*'){
            left= (left)*(right);
        }
        else{
            if(right!== 0){
             left= (left)/(right);}
             else{
                throw new CalcError(`Math Error, Can't divide by zero`);
                
             }

        }
    }
    return left;

   };
  const parseUnary = () => {   //-ve/+ve signs
    if(isOp('-')){
         next();
        return -parseUnary();
    }
    if(isOp('+')){
        next();
       return parseUnary();
    }
    return parsePower();
   };
  const parsePower = () => { 
    const base=parsePrimary();
     if(isOp('^')){
        next();
        const exponent=parseUnary();
        return Math.pow(base,exponent);
     }
     return base;
    
    };
  const parsePrimary = () => {
    const token= next();
    if(!token){
        throw new CalcError(`Expression ended unexpectedly`);
    }
    if(token.type==='number'){
        return token.value;
    }
    if(token.type==='paren' && token.value==='('){
        const inner=parseExpression();
        expect(')');
        return inner;
    }
    if(token.type ==='identifier'){
     const name= token.value;
     if(Object.hasOwn(FUNCTIONS,name)){
        expect('(');
        const args=parseExpression();
        expect(')');
        if(name==='sqrt'&& args<0){
            throw new CalcError('Math error , cannot find sqrt of negative number');
        }
        return FUNCTIONS[name](args);
     }
     if(Object.hasOwn(CONSTANTS,name)){
        return CONSTANTS[name];
    }
    if (Object.hasOwn(variables,name)){
        return variables[name];
    }
    throw new CalcError(`Unknown name "${name}"`);
    }
     throw new CalcError(`Unexpected "${token.value}"`);
  };

if (tokens.length === 0) throw new CalcError('Empty expression');
const result = parseExpression();
if (pos < tokens.length) throw new CalcError(`Unexpected "${peek().value}"`);
if (!Number.isFinite(result)) throw new CalcError('Math Error: result is not a valid number'); //for infinite and NaN 
return result;
};