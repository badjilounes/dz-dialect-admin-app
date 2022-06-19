module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    /**
     * ESLint rules in addition to recommended rules
     * @see https://github.com/eslint/eslint
     */
    'accessor-pairs': 'error',
    camelcase: 'warn',
    curly: 'error',
    'default-case': 'off',
    eqeqeq: 'warn',
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-eq-null': 'error',
    'no-negated-condition': 'warn',
    'no-param-reassign': 'error',
    'no-useless-rename': 'warn',
    'no-void': 'warn',
    'object-shorthand': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-template': 'warn',
    'require-atomic-updates': 'error',
    'spaced-comment': 'warn',
    'consistent-return': 'error',

    /**
     * Prettier
     * @see https://github.com/prettier/eslint-plugin-prettier
     */
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
      plugins: ['unused-imports'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      rules: {
        /**
         * Typescript
         * @see https://github.com/typescript-eslint/typescript-eslint
         */
        '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'no-type-imports' }],
        '@typescript-eslint/dot-notation': 'warn',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/return-await': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        // Replaced by unused-imports/no-unused-vars-ts
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unused-expressions': 'warn',

        /**
         * Angular
         * @see https://github.com/angular-eslint/angular-eslint
         */
        '@angular-eslint/component-class-suffix': [
          'error',
          {
            suffixes: ['Component', 'Dialog', 'Page'],
          },
        ],
        '@angular-eslint/component-selector': [
          'warn',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/directive-selector': [
          'warn',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/no-empty-lifecycle-method': 'warn',
        '@angular-eslint/no-input-rename': 'warn',
        '@angular-eslint/no-host-metadata-property': 'off',

        /**
         * Imports
         * @see https://github.com/benmosher/eslint-plugin-import
         * @see https://github.com/sweepline/eslint-plugin-unused-imports
         * @see https://github.com/alexgorbatchev/eslint-import-resolver-typescript
         */
        'import/named': 'off',
        'import/namespace': 'off',
        'import/newline-after-import': 'warn',
        'import/no-absolute-path': 'warn',
        'import/no-default-export': 'warn',
        'import/no-duplicates': 'warn',
        // Very costly but very useful
        // 'import/no-cycle': ['error', {
        //   maxDepth: 2,
        //   ignoreExternal: true
        // }],
        'import/no-import-module-exports': 'warn',
        'import/no-self-import': 'warn',
        'import/no-useless-path-segments': [
          'warn',
          {
            noUselessIndex: true,
          },
        ],
        'import/no-unresolved': 'off',
        'import/order': [
          'warn',
          {
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'sort-imports': [
          'warn',
          {
            ignoreCase: true,
            ignoreDeclarationSort: true,
          },
        ],
        'unused-imports/no-unused-imports-ts': 'warn',
        'unused-imports/no-unused-vars-ts': [
          'warn',
          { vars: 'all', varsIgnorePattern: '^_', args: 'all', argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-namespace': 'off',
      },
    },
    {
      files: ['*.html'],
      parser: '@angular-eslint/template-parser',
      extends: ['plugin:@angular-eslint/template/all'],
      rules: {
        'spaced-comment': 'off',
        '@angular-eslint/template/accessibility-alt-text': 'warn',
        '@angular-eslint/template/accessibility-label-for': 'warn',
        '@angular-eslint/template/accessibility-label-has-associated-control': 'warn',
        '@angular-eslint/template/cyclomatic-complexity': 'warn',
        '@angular-eslint/template/eqeqeq': 'warn',
        '@angular-eslint/template/i18n': 'off',
        '@angular-eslint/template/no-any': 'warn',
        '@angular-eslint/template/no-call-expression': 'warn',
        '@angular-eslint/template/no-negated-async': 'warn',
        '@angular-eslint/template/no-positive-tabindex': 'warn',
        '@angular-eslint/template/use-track-by-function': 'warn',
        '@angular-eslint/template/click-events-have-key-events': 'warn',
      },
    },
  ],
};
