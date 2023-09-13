module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    /** Reference: <https://commitlint.js.org/#/reference-rules> */
    'type-enum': [2, 'always', ['build', 'chore', 'fix', 'feat', 'style', 'merge', 'docs', 'perf', 'refactor', 'test']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never'],
    'scope-case': [2, 'always', ['lower-case', 'start-case']],
    'subject-exclamation-mark': [0],
  },
};
