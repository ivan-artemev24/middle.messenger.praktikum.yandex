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
  ignorePatterns: ['scripts/**/*.js', 'test/**/*.js'],
  overrides: [
    {
      files: ['*.css'],
      parser: 'none',
      rules: {}
    },
    {
      files: ['jest.setup.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      rules: {
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/no-implied-eval': 'off'
      }
    }
  ]
}
