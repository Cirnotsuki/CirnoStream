module.exports = {
    ignorePatterns: ['dist', 'node_modules', 'build', 'lib/plugins'],

    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'airbnb-base'],
    parser: '@babel/eslint-parser',

    parserOptions: {
        ecmaVersion: 9,
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: 'config/webpack.common.js',
            },
        },
    },

    globals: {
        msCrypto: true,
    },

    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': [0, 'error', 'windows'],
        'no-param-reassign': 'off',
        'no-restricted-syntax': 'off',
        'no-console': 'off',
        'no-unused-expressions': 'off',
        'prefer-destructuring': 'off',
        'max-len': ['error', 160],
        'arrow-parens': 'off',
        'prefer-promise-reject-errors': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'global-require': 'off',
        'consistent-return': 'off',
        'no-plusplus': 'off',
        'no-magic-numbers': 'off',
        'no-await-in-loop': 'off',
        'prefer-const': 'off',
        'no-nested-ternary': 'off',
        'prefer-spread': 'off',
        'no-continue': 'off',
        'no-bitwise': 'off',
        'vue/experimental-script-setup-vars': 'off',
        'func-names': 'off',
        'import/no-unresolved': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'no-async-promise-executor': 'off',
    },
};
