pipeline {
  agent any

  environment { 
    TAG = "${BRANCH_NAME}:${BUILD_NUMBER}"
    TAG_TEST = "${TAG}-test"
    TAG_TEST_STATIC = "${TAG}-test-static"
  }

  stages {
    stage('Start') {
      steps {
        slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
      }
    }
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'docker build -t $TAG -f Dockerfile.production .'
      }
    }
    stage('QA: static code analysis') {
      steps {
        echo 'Testing static..'
        sh 'docker build -t $TAG_TEST_STATIC --build-arg APP_IMAGE=$TAG -f Dockerfile.test-static .'
        sh 'docker run --rm $TAG_TEST_STATIC'
      }
    }
    stage('QA: unit & integration tests') {
      steps {
        echo 'Testing..'
        sh 'docker build -t $TAG_TEST --build-arg APP_IMAGE=$TAG -f Dockerfile.test .'
        sh 'docker run --rm $TAG_TEST'
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
        sh 'docker-compose build'
        sh 'docker-compose stop'
        sh 'docker-compose up -d'
      }
    }
  }

  post {
    success {
      slackSend (color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")

      emailext (
          subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
          body: """<p>SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
            <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
          recipientProviders: [[$class: 'DevelopersRecipientProvider']]
        )
    }
    failure {
      slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")

      emailext (
          subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
          body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
            <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
          recipientProviders: [[$class: 'DevelopersRecipientProvider']]
        )
    }
  }
}