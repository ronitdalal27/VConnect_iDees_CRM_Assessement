pipeline {
    agent any

    environment {
        APP_NAME = "dashboard"
        IMAGE_TAG = "v1"
        REGISTRY_URL = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REGISTRY_REPO = "2401036-dashboard"
        IMAGE_NAME = "${REGISTRY_URL}/${REGISTRY_REPO}/${APP_NAME}:${IMAGE_TAG}"
        K8S_NAMESPACE = "2401036-dashboard"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/ronitdalal27/VConnect_iDees_CRM_Assessement.git'
            }
        }

        stage('Build Docker Image (Maven inside Docker)') {
            steps {
                sh '''
                    docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Push Image to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-credentials',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                        docker login $REGISTRY_URL -u $NEXUS_USER -p $NEXUS_PASS
                        docker push $IMAGE_NAME
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
