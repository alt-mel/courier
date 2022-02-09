module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
    'prettier/prettier': [
      'error',
      JSON.parse(require('fs').readFileSync('.prettierrc', { encoding: 'utf8' }))
    ],
    'react/no-unescaped-entities': ['off'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': ['warn', { allow: ['clear', 'info', 'error', 'dir', 'trace'] }],
    curly: 'error',
    'no-else-return': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    strict: 'error',
    'symbol-description': 'error'
  }
};
