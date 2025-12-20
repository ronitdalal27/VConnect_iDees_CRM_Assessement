pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""

  volumes:
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    stages {

        stage('Login to Nexus (REQUIRED FIRST)') {
            steps {
                container('dind') {
                    sh '''
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                        -u student -p Imcc@2025
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 10
                        docker build -t dashboard:latest .
                        docker images | grep dashboard
                    '''
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag dashboard:latest \
                        nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401036-project/dashboard-2401036:latest

                        docker push \
                        nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401036-project/dashboard-2401036:latest
                    '''
                }
            }
        }

        stage('Deploy Dashboard App') {
            steps {
                container('kubectl') {
                    dir('k8s') {
                        sh '''
                        kubectl get namespace 2401036 || kubectl create namespace 2401036

                        kubectl create secret docker-registry nexus-secret \
                        --docker-server=127.0.0.1:30085 \
                        --docker-username=student \
                        --docker-password=Imcc@2025 \
                        --docker-email=student@imcc.com \
                        -n 2401036 || true

                        kubectl apply -f deployment.yaml
                        kubectl apply -f service.yaml
                        kubectl apply -f ingress.yaml

                        kubectl rollout restart deployment dashboard-deployment
                        kubectl rollout status deployment dashboard-deployment --timeout=180s
                        '''
                    }
                }
            }
        }

        stage('Pod Debug (Option A)') {
            steps {
                container('kubectl') {
                    sh '''
                    kubectl get pods -n 2401036 -o wide
                    kubectl describe pod -l app=dashboard -n 2401036
                    kubectl logs -l app=dashboard -n 2401036 --tail=100 || true
                    '''
                }
            }
        }

        stage('Final Objects') {
            steps {
                container('kubectl') {
                    sh '''
                    kubectl get svc -n 2401036
                    kubectl get ingress -n 2401036
                    '''
                }
            }
        }
    }
}
