def COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']

pipeline {
  agent any

  options { disableConcurrentBuilds() }

  stages {
    stage('Start') {
        steps {
            slackSend (color: '#F0E68C', message: "*STARTED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}")
        }
    }
    stage('Warmup') {
      steps {
        echo 'Warming up...'
        sh 'docker build --target init -f Dockerfile.ci .'
      }
    }
    stage('QA: static code analysis') {
      steps {
        echo 'Testing static..'
        sh 'docker build --target test-static -f Dockerfile.ci .'
      }
    }
    stage('QA: unit tests') {
      steps {
        echo 'Testing..'
        sh 'docker build --target test -f Dockerfile.ci .'
      }
    }
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'docker build --target build -f Dockerfile.ci .'
      }
    }
    stage('Deploy') {
      when { branch 'master' }
      environment {
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
        EXPRESS_SESSION_KEY = credentials('EXPRESS_SESSION_KEY')
        SENDGRID_API_KEY = credentials('SENDGRID_API_KEY')
      }
      steps {
        echo 'Deploying....'
        sh 'docker-compose build'
        sh 'docker-compose stop'
        sh 'docker-compose up -d'
        sh 'chmod +x init-letsencrypt.sh'
        sh './init-letsencrypt.sh'
      }
    }
    stage('Cleanup Docker') {
      steps {
        echo 'Cleaning up...'
        sh 'docker image prune -a -f'
      }
    }
  }

  post {
    always {
        slackSend (color: COLOR_MAP[currentBuild.currentResult], message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}")
    }
  }
}
