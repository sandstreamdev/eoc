pipeline {
  agent any

  environment { 
    TAG = "${BRANCH_NAME}:${BUILD_NUMBER}"
    TAG_TEST = "${TAG}-test"
    TAG_TEST_STATIC = "${TAG}-test-static"
  }

  stages {
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
    always {
      echo 'This will always run'
      def summary = "${subject} (${env.BUILD_URL})"
      slackSend(color: 'good', message: summary)
    }
    success {
      echo 'This will run only if successful'
    }
    failure {
      echo 'This will run only if failed'
    }
    unstable {
      echo 'This will run only if the run was marked as unstable'
    }
    changed {
      echo 'This will run only if the state of the Pipeline has changed'
      echo 'For example, if the Pipeline was previously failing but is now successful'
    }
  }
}