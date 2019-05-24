def COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']

pipeline {
  agent any

  environment {
    DOCKER_BUILDKIT = 1
    TAG = "${BRANCH_NAME}-${BUILD_NUMBER}".toLowerCase()
    TAG_INIT = "${TAG}-init"
    TAG_BUILD = "${TAG}-build"
    TAG_TEST = "${TAG}-test"
    TAG_TEST_STATIC = "${TAG_TEST}-static"
  }

  stages {
    stage('Start') {
        steps {
            slackSend (color: '#F0E68C', message: "*STARTED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}")
        }
    }
    stage('Warmup') {
      steps {
        echo 'Warming up...'
        sh 'docker build --target init -t $TAG_INIT .'
      }
    }
    stage('QA: static code analysis') {
      steps {
        echo 'Testing static..'
        sh 'docker build --target test-static -t $TAG_TEST_STATIC .'
      }
    }
    stage('Build') {
      steps {
        echo 'Building..'
        sh 'docker build --target build -t $TAG_BUILD .'
      }
    }
    stage('QA: unit & integration tests') {
      steps {
        echo 'Testing..'
        sh 'docker build --target test -t $TAG_TEST .'
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
