const tsParser = '@typescript-eslint/parser';
const tsParserOpts = {
  emaVersion: 2018,
  tsconfigRootDir: __dirname,
  project: './tsconfig.json',
};

module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: tsParser,
  parserOptions: {
    emaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    'google',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'complexity': ['error', { max: 5 }],
    'eqeqeq': ['error', 'smart'],
    'import/first': 'error',
    'import/extensions': 'off',
    'import/namespace': 0,
    'import/newline-after-import': ['error', { count: 2 }],
    'import/no-cycle': ['error', { maxDepth: 5 }],
    'import/no-self-import': 'error',
    'import/no-unresolved': 0,
    'import/order': ['error', { 'newlines-between': 'always' }],
    'indent': ['error', 'tab', { SwitchCase: 1 }],
    'max-depth': ['error', 2],
    'max-len': [
      'error',
      {
        code: 150,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      },
    ],
    'max-lines': ['error', 150],
    'max-nested-callbacks': ['error', 1],
    'max-params': ['error', 3],
    'max-lines-per-function': ['error', { max: 20 }],
    'max-statements': ['off', 10],
    'new-cap': 'off',
    'no-console': 'warn',
    'no-undef': 'off',
    'no-tabs': 0,
    'quotes': ['error', 'single', { avoidEscape: true }],
    'quote-props': 0,
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { consistent: true },
        ObjectPattern: { consistent: true },
      }
    ],
    'object-curly-spacing': ['error', 'always'],
    'space-infix-ops': ['error'],
    'require-jsdoc': 0,
    'valid-jsdoc': 0,
  },
  // For *.ts files
  overrides: [
    {
      files: ['**/*.ts'],
      parser: tsParser,
      parserOptions: tsParserOpts,
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/ban-types': ['error', { types: banTypes(), extendDefaults: false }],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              constructors: 'no-public',
              parameterProperties: 'no-public'
            },
          },
        ],
        'indent': 'off',
        '@typescript-eslint/indent': ['error', 'tab', { SwitchCase: 1 }],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/type-annotation-spacing': [
          'error',
          {
            before: false, after: true,
            overrides: { arrow: { before: true, after: true, } }
          }
        ],
        'no-invalid-this': 'off',
        '@typescript-eslint/no-invalid-this': ['error'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        'semi': ['error', 'always'],
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'comma',
              requireLast: true,
            },
            singleline: {
              delimiter: 'comma',
              requireLast: false,
            },
            overrides: {
              interface: {
                multiline: {
                  delimiter: 'semi',
                  requireLast: true,
                },
              }
            }
          }
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          // Enforce that all vars, funcs and props are camelCase
          {
            selector: 'variableLike',
            format: ['camelCase', 'PascalCase'],
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          // Enforce that all private members are prefix with an underscore
          {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase'],
            leadingUnderscore: 'require',
          },
          // Enforce that boolean vars are prefixed with an allowed verb
          {
            selector: 'variable',
            types: ['boolean'],
            format: ['PascalCase'],
            prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
          },
          // Enforce that type parameters (generics) are prefix with T
          {
            selector: 'typeParameter',
            format: ['PascalCase'],
            prefix: ['T'],
          },
          // Enforce that interfaces name prefix with I
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: true,
            },
          },
        ],
      },
    },
    {
      files: ['**/*.test.ts'],
      parser: tsParser,
      parserOptions: tsParserOpts,
      rules: {
        'no-console': 0,
        'max-depth': 0,
        'max-lines-per-function': 0,
        'max-nested-callbacks': 0
      }
    },
    {
      files: ['./test/**/*.ts'],
      parser: tsParser,
      parserOptions: tsParserOpts,
      rules: {
        'no-console': 0,
      }
    }
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  }
};


function banTypes() {
  return {
    String: {
      message: 'Use string instead',
      fixWith: 'string'
    },
    Boolean: {
      message: 'Use boolean instead',
      fixWith: 'boolean'
    },
    Number: {
      message: 'Use number instead',
      fixWith: 'number'
    },
    Symbol: {
      message: 'Use symbol instead',
      fixWith: 'symbol'
    },

    Function: {
      message: [
        'The  `Function` type accepts any function-like value.',
        'It provides no type safety when calling the function, which can be a common source of bugs.',
        'It also accepts things like class declarations, which will throw at runtime as they will not called with `new`.',
        'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
      ].join('\n'),
    },

    Object: {
      message: [
        'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
        '- If you want a type meaning "any object", you probably want `Record<string, unknown> instead.`',
        '- If you want a type meaning "any value", you probably want `unknown` instead.',
      ].join('\n'),
    },
    '{}': {
      message: [
        '`{}` actually means "any non-nullish value".',
        '- If you want a type meaning "any object", you probably want `Record<string, unknown> instead.`',
        '- If you want a type meaning "any value", you probably want `unknown` instead.',
      ].join('\n'),
    },
  }
}