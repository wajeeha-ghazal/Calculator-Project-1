
const variables = {};
const RESERVED = ['pi', 'e', 'sqrt', 'sin', 'cos', 'tan'];

export const getVariables = () => variables;

export const addVariable = (name, value) => {
  name = name.trim();
  if (!/^[a-z]+$/i.test(name)) return 'Name must contain letters only';
  if (RESERVED.includes(name.toLowerCase())) return `"${name}" is reserved`;
  if (value.trim() === '' || !Number.isFinite(Number(value))) return 'Value must be a number';

  variables[name] = Number(value);   // this line is the "define it like an object" part
  return null;                       // null means no error
};

export const removeVariable = (name) => { delete variables[name]; };