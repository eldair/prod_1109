/**
@type {import('stylelint').Config}
*/
export default {
    plugins: ['stylelint-prettier'],
    extends: ['stylelint-config-recommended', 'stylelint-config-recommended-vue', 'stylelint-config-tailwindcss'],
    rules: {
        'no-descending-specificity': null,
        'no-invalid-position-at-import-rule': null,
        'at-rule-prelude-no-invalid': [
            true,
            {
                ignoreAtRules: ['apply'],
            },
        ],
    },
};
