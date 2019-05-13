pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'docker-compose build'
      }
    }
    stage('Test') {
      steps {
        echo 'Testing..'
        sh 'npm run test'
      }
    }
    stage('Deploy') {
      when { branch 'master' }
      environment {
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
        EXPRESS_SESSION_KEY = credentials('EXPRESS_SESSION_KEY')
      }
      steps {
        echo 'Deploying....'
      }
    }
  }
}