module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        es6: true,
        node: true
    },
    ignorePatterns: ['dist/*', '*.html', 'jest.config.js', 'build/*', '*.d.ts'],
    plugins: ['@typescript-eslint', 'eslint-plugin-import-helpers'],
    extends: [
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        '@typescript-eslint/ban-ts-comment': 'off',
        'import/no-anonymous-default-export': 'off',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-unused-vars': ['warn'],
        'import-helpers/order-imports': [
            'warn',
            {
                newlinesBetween: 'always',
                groups: [
                    'module',
                    '/^@sprint-review/',
                    '/^@(?!sprint-review)/',
                    ['parent', 'sibling', 'index']
                ]
            }
        ]
    }
};
