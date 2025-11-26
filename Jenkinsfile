pipeline {
    agent {
        docker {
            image 'maven:3.9.6-eclipse-temurin-17'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_IMAGE = "ronit/dashboard-app:ci"
        WORK_DIR = "dashboard"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/ronitdalal27/VConnect_iDees_CRM_Assessement.git'
            }
        }

        stage('Build JAR') {
            steps {
                sh """
                    cd ${WORK_DIR}
                    mvn clean package -DskipTests
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE} ${WORK_DIR}
                """
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                    docker rm -f ci-test || true
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                sh """
                    docker run -d -p 8080:8080 --name ci-test ${DOCKER_IMAGE}
                """
            }
        }
    }
}
