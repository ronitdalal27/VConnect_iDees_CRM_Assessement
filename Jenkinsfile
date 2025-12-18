pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    args:
      - "--storage-driver=overlay2"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
'''
        }
    }

    environment {
        APP_NAME      = "dashboard"
        IMAGE_TAG     = "v1"
        REGISTRY_URL  = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REGISTRY_REPO = "2401036-dashboard"
        IMAGE_NAME    = "${REGISTRY_URL}/${REGISTRY_REPO}/${APP_NAME}:${IMAGE_TAG}"
        K8S_NAMESPACE = "2401036-dashboard"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/ronitdalal27/VConnect_iDees_CRM_Assessement.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        dockerd-entrypoint.sh &
                        sleep 20
                        docker build -t $IMAGE_NAME .
                        docker images
                    '''
                }
            }
        }

        stage('Push Image to Nexus') {
            steps {
                container('dind') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {
                        sh '''
                            docker login http://nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                              -u $NEXUS_USER -p $NEXUS_PASS
                            docker push $IMAGE_NAME
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl create namespace $K8S_NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
                    kubectl apply -n $K8S_NAMESPACE -f k8s/
                    kubectl rollout status deployment/dashboard-deployment -n $K8S_NAMESPACE
                    kubectl get svc -n $K8S_NAMESPACE
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
