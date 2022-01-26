const cucumberHtmlReporter = require('cucumber-html-reporter')
const cucumberJunitConvert = require('cucumber-junit-convert')

const reportPath = 'reports/acceptance-tests'
const jsonReportPath = `${reportPath}/report.json`

const htmlOptions = {
  theme: 'bootstrap',
  jsonFile: jsonReportPath,
  output: `${reportPath}/cucumber_report.html`,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
}

cucumberHtmlReporter.generate(htmlOptions)

const xmlOptions = {
  inputJsonFile: jsonReportPath,
  outputXmlFile: `${reportPath}/cucumber_junit_report.xml`,
}

cucumberJunitConvert.convert(xmlOptions)
