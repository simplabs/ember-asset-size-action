module.exports = {
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  rules: {
    'consistent-return': 0,
    'no-console': 0,
    'import/extensions': 0,
  },
  overrides: [
    {
      files: ['main.js'],
      rules: {
        // the `run` function is exported, and therefor can only be ran
        // after the entire file has been evaluated, so no-use-before-define does not apply
        // and does not protect against anything.
        // (this rule does come in handy _if_ we invoke functions in module-scope though (side-effect))
        'no-use-before-define': 0,
      }
    },
    // node files
    {
      files: [
        'test/**/*.js',
      ],
      env: {
        node: true,
        mocha: true,
      },
      rules: {
        'prefer-arrow-callback': 0,
        'func-names': 0,
      },
    },
  ],
};
