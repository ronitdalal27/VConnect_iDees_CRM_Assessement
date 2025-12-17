pipeline {
    agent any

    environment {
        APP_NAME = "dashboard"
        IMAGE_TAG = "v1"
        REGISTRY_URL = "registry.college.local"   // ask faculty for exact URL
        REGISTRY_IMAGE = "${REGISTRY_URL}/dashboard:${IMAGE_TAG}"
        K8S_NAMESPACE = "2401036-dashboard"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/ronitdalal27/VConnect_iDees_CRM_Assessement.git'
            }
        }

        stage('Build Application (Maven)') {
            steps {
                sh '''
                    cd app
                    mvn clean package -DskipTests
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $REGISTRY_IMAGE .
                '''
            }
        }

        stage('Push Image to Registry') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'registry-creds', // confirm ID with faculty
                    usernameVariable: 'REG_USER',
                    passwordVariable: 'REG_PASS'
                )]) {
                    sh '''
                        docker login $REGISTRY_URL -u $REG_USER -p $REG_PASS
                        docker push $REGISTRY_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -n $K8S_NAMESPACE -f k8s/
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully"
        }
        failure {
            echo "❌ CI/CD Pipeline failed"
        }
    }
}
