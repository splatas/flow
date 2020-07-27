const scanner = require('sonarqube-scanner')
scanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectName': 'base-jaxx',
      'sonar.language': 'js',
      'sonar.profile': 'node',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.inclusions': '**',
      'sonar.test.inclusions': 'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml'
    }
  },
  () => { }
)

module.exports = scanner
