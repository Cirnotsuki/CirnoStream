module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [ 'plugin:vue/essential', '@vue/airbnb' ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    settings: {
        'import/resovler': {
            webpack: {
                config: './build/webpack.base.conf.js'
            },
        },
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: [ 'error', 4 ],
        'linebreak-style': [0, 'error', 'windows'],
        'no-restricted-syntax': 'off',
        'no-unused-expressions': 'off',
        'no-continue': 'off',
        'no-param-reassign': 'off',
        'prefer-spread': 'off',
        'no-use-before-define': 'off',
        'array-callback-return': 'off',
        'max-len': ['error', 160],
        'no-nested-ternary': 'off',
        'no-plusplus': 'off',
        'arrow-parens': 'off',
        'no-underscore-dangle': 'off',
        'no-script-url': 'off',
        'func-names': 'off',
        'prefer-destructuring': 'off',
        'prefer-const': 'off',
        'no-await-in-loop': 'off',
        'no-async-promise-executor': 'off',
        'consistent-return': 'off',
    }
};
