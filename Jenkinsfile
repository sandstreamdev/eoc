def COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']

pipeline {
  agent any

  options { disableConcurrentBuilds() }

  environment {
    TAG = "${BRANCH_NAME}-${BUILD_NUMBER}".toLowerCase().replace("@", "")
    TAG_INIT = "${TAG}-init"
    TAG_BUILD = "${TAG}-build"
    TAG_TEST = "${TAG}-test"
    TAG_TEST_STATIC = "${TAG_TEST}-static"
  }

  stages {
    stage('Init') {
      steps {
        echo 'Init..'
        slackSend (color: '#F0E68C', message: "*STARTED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}")
        sh 'docker build --target init -t $TAG_INIT -f Dockerfile.ci .'
      }
    }
    stage('QA: static code analysis') {
      steps {
        echo 'Testing static..'
        sh 'docker build --target test-static -t $TAG_TEST_STATIC -f Dockerfile.ci .'
      }
    }
    stage('QA: unit tests') {
      steps {
        echo 'Testing..'
        sh 'docker build --target test -t $TAG_TEST -f Dockerfile.ci .'
      }
    }
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'docker build --target build -t $TAG_BUILD -f Dockerfile.ci .'
      }
    }
    stage('Deploy') {
      when { branch 'master' }
      environment {
        EXPRESS_SESSION_KEY = credentials('EXPRESS_SESSION_KEY')
        GOOGLE_API_USER = credentials('GOOGLE_API_USER')
        GOOGLE_CALLBACK_URL = credentials('GOOGLE_CALLBACK_URL')
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
        GOOGLE_REFRESH_TOKEN = credentials('GOOGLE_REFRESH_TOKEN')
        HOST = credentials('HOST')
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
  }

  post {
    always {
        slackSend (color: COLOR_MAP[currentBuild.currentResult], message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}")
    }
  }
}
