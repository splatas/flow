const scanner = require('sonarqube-scanner')
scanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectName': 'base-jaxx',
      'sonar.sources': 'src',
      'sonar.tests': 'test',
      'sonar.inclusions': '**', // Entry point of your code
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-report.xml'
    }
  },
  () => {}
)

module.exports = scanner
