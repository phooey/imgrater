const test = [
  'test/acceptance/features/**/*.feature',
  '--require-module ts-node/register',
  '--require test/acceptance/steps/**/*.ts',
  '--require test/acceptance/hooks/**/*.ts',
  '--publish-quiet',
].join(' ')

const json = [
  test,
  '--format json:reports/acceptance-tests/report.json',
].join(' ')

module.exports = {
  default: test,
  json,
}
