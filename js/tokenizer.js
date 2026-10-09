
export class CalcError extends Error {}

  //regex rules
const DIGIT = /[0-9]/;
const LETTER = /[a-z]/i;
const OPERATORS = '+-*/^';       
const PARENS = '()';
const WHITESPACE = /\s/;

export const tokenize = (input) => {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if(WHITESPACE.test(char)){
        i++;

    }
    else if(DIGIT.test(char)|| char === '.'){
        let numStr='';
        while(i<input.length && (DIGIT.test(input[i])||input[i] ==='.' )){
            numStr+= input[i];
            i++;
        }
        const val= Number(numStr);

        if(Number.isNaN(val)) {
        throw new CalcError(`Invalid number "${numStr}"` );}

        tokens.push({type:'number', value:val});
    }
   else if(LETTER.test(char)){
       let str='';
        while(i<input.length && (LETTER.test(input[i]))){
            str+= input[i];
            i++;
        }
        
        tokens.push({type:'identifier', value:str});
    }
    else if(OPERATORS.includes(char)){
        tokens.push({type:'operator', value:char});
        i++;
    }
     else if(PARENS.includes(char)){
        tokens.push({type:'paren', value:char});
        i++;
    }
    else {
        throw new CalcError(`Unexpected character "${char}"`);
    }
 
}

  return tokens;
};

