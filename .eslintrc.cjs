module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',

    extraFileExtensions: ['.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-hooks', 'prettier'],
  rules: {
    camelcase: 'off',
    'prettier/prettier': 'error',
    'no-console': 'error',
    'no-shadow': 'off',
    'react/react-in-jsx-scope': 0,
    // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/jsx-props-no-spreading': ['warn', { custom: 'ignore' }],
    // 'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/forbid-prop-types': 'off',
    'react/prop-types': 'off',
    'no-unsafe-optional-chaining': 'warn',
    'import/no-import-module-exports': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': 'off',
    'import/prefer-default-export': 'warn',
    'react/require-default-props': 'off',
    'object-curly-newline': 'off',
    'no-undef': 0,
    'import/no-unresolved': 0,
    'prefer-template': 1,
    'react/jsx-no-useless-fragment': 0,
    'import/extensions': 0,
    'no-plusplus': 0,
    'no-unused-vars': 'off',
    'class-methods-use-this': 'warn',
    'react/state-in-constructor': 0,
    'react/destructuring-assignment': 0,
    'no-param-reassign': 'warn',
  },
};
