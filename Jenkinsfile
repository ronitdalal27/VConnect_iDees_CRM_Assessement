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

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 15
                        docker build -t dashboard:latest .
                        docker image ls
                    '''
                }
            }
        }

        stage('Login to Nexus (NodePort)') {
            steps {
                container('dind') {
                    sh '''
                        docker login 127.0.0.1:30085 \
                        -u student -p Imcc@2025
                    '''
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag dashboard:latest \
                        127.0.0.1:30085/2401036-project/dashboard-2401036:latest

                        docker push \
                        127.0.0.1:30085/2401036-project/dashboard-2401036:latest
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

                        kubectl apply -f deployment.yaml -n 2401036
                        kubectl apply -f service.yaml -n 2401036
                        kubectl apply -f ingress.yaml -n 2401036

                        kubectl delete pod -l app=dashboard -n 2401036 || true
                        kubectl scale deployment dashboard-deployment --replicas=0 -n 2401036
                        sleep 5
                        kubectl scale deployment dashboard-deployment --replicas=1 -n 2401036
                        '''
                    }
                }
            }
        }

        stage('Debug Info') {
            steps {
                container('kubectl') {
                    sh '''
                    echo "===== PODS ====="
                    kubectl get pods -n 2401036

                    echo "===== SERVICES ====="
                    kubectl get svc -n 2401036

                    echo "===== INGRESS ====="
                    kubectl get ingress -n 2401036
                    '''
                }
            }
        }
    }
}
