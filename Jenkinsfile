pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "ronit/dashboard-app:ci"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/ronitdalal27/VConnect_iDees_CRM_Assessement.git'
            }
        }

        stage('Build JAR') {
            steps {
                sh '''
                    docker run --rm ^
                    -v "$(pwd)":/workspace ^
                    -w /workspace/dashboard ^
                    maven:3.9.6-eclipse-temurin-17 ^
                    mvn clean package -DskipTests
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE} dashboard'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker rm -f ci-test || true'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 8080:8080 --name ci-test ${DOCKER_IMAGE}'
            }
        }
    }
}
