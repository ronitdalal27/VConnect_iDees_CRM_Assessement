pipeline {
    agent {
        docker {
            image 'maven:3.9.6-eclipse-temurin-17'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/ronitdalal27/VConnect_iDees_CRM_Assessement.git'
            }
        }

        stage('Build JAR') {
            steps {
                sh 'cd dashboard && mvn clean package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ronit/dashboard-app:ci dashboard'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 8080:8080 --name ci-test ronit/dashboard-app:ci'
            }
        }
    }
}
