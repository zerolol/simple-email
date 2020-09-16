module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len' : ["off", {code : 300}],
    'consistent-return': ["off", { "treatUndefinedAsUnspecified": true }],
    "no-param-reassign": ["off", { "props": false }],
    "no-unused-vars": "off",
    "no-unused-expressions": "off",
    "dot-notation": "off",
  }
}
