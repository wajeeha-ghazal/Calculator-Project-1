// js/evaluator.js
import { tokenize, CalcError } from './tokenizer.js';
import { parse } from './parser.js';

export const evaluate = (expression, variables = {}) => {
  try {
    const tokens=tokenize(expression);
    const value= parse(tokens,variables);
    let display= value.toFixed(4);
    if (display === '-0.0000') {
      display = '0.0000';                    
    }
    return {value,display};
  } catch (e) {
    if (e instanceof CalcError) {
    return { error: e.message };
  }
    console.error(e);
 return{error:'Something went wrong!'};
    
  }
};