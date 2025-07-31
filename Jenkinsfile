pipeline {
    agent any
    
    tools {
        nodejs '18'
    }
    
    environment {
        // Playwright environment variables
        PLAYWRIGHT_BROWSERS_PATH = '0'
        CI = 'true'
    }
    
    triggers {
        pollSCM('H/2 * * * *')
        
        // Auto-trigger on schedule (daily at 2 AM)
        cron('0 2 * * *')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps chromium'
            }
        }
        
        stage('Code Quality') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        sh 'npm run typecheck'
                    }
                }
            }
        }
        
        stage('Tests') {
            parallel {
                stage('API Tests') {
                    steps {
                        sh 'npm run test:api'
                    }
                    post {
                        always {
                            // Archive API test results
                            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                        }
                    }
                }
                stage('UI Tests') {
                    steps {
                        sh 'npm run test:ui'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright Test Report'
                            ])
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded! All tests passed.'
        }
        failure {
            echo 'Pipeline failed! Check test results.'
        }
    }
}