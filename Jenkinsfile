pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: docker
    image: docker:27.1.1-cli
    command: ["cat"]
    tty: true
    volumeMounts:
      - name: docker-sock
        mountPath: /var/run/docker.sock

  - name: kubectl
    image: bitnami/kubectl:1.29
    command: ["cat"]
    tty: true

  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
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
                container('docker') {
                    sh '''
                        docker version
                        docker build -t $IMAGE_NAME .
                    '''
                }
            }
        }

        stage('Login & Push to Nexus') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {
                        sh '''
                            echo "$NEXUS_PASS" | docker login $REGISTRY_URL -u "$NEXUS_USER" --password-stdin
                            docker push $IMAGE_NAME
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl create namespace $K8S_NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

                        kubectl apply -n $K8S_NAMESPACE -f k8s/deployment.yaml
                        kubectl apply -n $K8S_NAMESPACE -f k8s/service.yaml

                        kubectl rollout status deployment/dashboard-deployment -n $K8S_NAMESPACE

                        echo "===== Service Details ====="
                        kubectl get svc -n $K8S_NAMESPACE
                    '''
                }
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
