module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018
    },
    env: {
        node: true,
        es6: true
    },
    plugins: ['prettier'],
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prettier/prettier': "error",
        indent: ['error', 4]
    }
};
