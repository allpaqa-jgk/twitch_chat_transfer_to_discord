module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "standard", "prettier"],
  plugins: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-multi-spaces": [2, { exceptions: { ObjectExpression: true } }],
  },
};
