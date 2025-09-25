module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard-with-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off'
  },
  overrides: [
    {
      files: ['*.css'],
      parser: 'none',
      rules: {}
    },
    {
      files: ['jest.setup.ts', 'scripts/**/*.js', 'test/**/*.js'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: null
      },
      rules: {
        '@typescript-eslint/dot-notation': 'off'
      }
    }
  ]
}
