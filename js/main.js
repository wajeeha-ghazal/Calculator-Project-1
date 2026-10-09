import { evaluate }  from './evaluator.js';
import { getVariables, addVariable, removeVariable } from './variables.js';

// // console.log(parse(tokenize('2+3*4')));     // 14
// // console.log(parse(tokenize('-3^2')));      // -9
// // console.log(parse(tokenize('2^3^2')));     // 512
// // console.log(parse(tokenize('(2+3)*4')));   // 20
// // console.log(parse(tokenize('(sqrt')));
// console.log(parse(tokenize('sqrt(sqrt(16))')));
// // console.log(parse(tokenize('sqrt(-4)')));
// //console.log(parse(tokenize('4/0')));
// console.log(parse(tokenize('(0)^(-1)')));
// console.log(parse(tokenize('(1)^(0)')));
// console.log(parse(tokenize('(-8)^0.5')));
// //console.log(parse(tokenize('x*2')),{x:5});
// console.log(parse(tokenize('x*2'), { x: 5 }));


// ---------- history ----------
const history = [];                       // items: { id, expression, result }
let nextId = 1;
const historyList = document.getElementById('history-list');

const renderHistory = () => {
  historyList.innerHTML = '';
  for (const item of history) {
    const li = document.createElement('li');
    li.textContent = `${item.expression} = ${item.result} `;
    li.dataset.id = item.id;

    // click the item -> refill the input
    li.addEventListener('click', () => {
      input.value = item.expression;
      input.focus();
    });

    // delete button
    const del = document.createElement('button');
    del.textContent = 'x';
    del.addEventListener('click', (event) => {
      event.stopPropagation();            // don't trigger the li's refill click
      const index = history.findIndex((h) => h.id === item.id);
      if (index !== -1) history.splice(index, 1);
      renderHistory();
    });

    li.append(del);
    historyList.append(li);
  }
};

// ---------- calculate,clear,backspace ----------
const input = document.getElementById('expression');
const output = document.getElementById('output');
const keys = document.getElementById('keys');

const calculate = () => {
  const result = evaluate(input.value, getVariables());
  if (result.error) {
    output.textContent = result.error;
  } else {
    output.textContent = result.display;
    history.push({ id: nextId++, expression: input.value, result: result.display });
    renderHistory();
  }
};

const clr = () => {
  input.value = '';
  output.textContent = '';
  input.focus();
};

const backspace = () => {
  input.value = input.value.slice(0, -1);
  input.focus();
};

// ---------- buttons and keyboard ----------
keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;                    // click on the gaps between buttons

  const { value, action } = button.dataset;

  if (value !== undefined) {
    input.value += value;
    input.focus();
  } else if (action === 'equals') {
    calculate();
  } else if (action === 'clear') {
    clr();
  } else if (action === 'backspace') {
    backspace();
  }
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    calculate();
  }
});

// ---------- variables ----------
const varName = document.getElementById('var-name');
const varValue = document.getElementById('var-value');
const varMessage = document.getElementById('var-message');
const varList = document.getElementById('var-list');
const addVar= document.getElementById('add-var');
const clear= document.getElementById('clear-var');

const renderVariables = () => {
  varList.innerHTML = '';
  for (const [name, value] of Object.entries(getVariables())) {
    const li = document.createElement('li');
    li.textContent = `${name} = ${value} `;
    const del = document.createElement('button');
    del.textContent = 'x';
    del.addEventListener('click', () => {
      removeVariable(name);
      renderVariables();
    });
    li.append(del);
    varList.append(li);
  }
};

addVar.addEventListener('click', () => {
  const error = addVariable(varName.value, varValue.value);
  varMessage.textContent = error ?? '';
  if (!error) {
    varName.value = '';
    varValue.value = '';
    renderVariables();
  }
});
clear.addEventListener('click',()=>{
varName.value='';
varValue.value = '';
varMessage.textContent='';
});
