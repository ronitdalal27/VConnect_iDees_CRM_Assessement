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
'''
        }
    }

    stages {

        stage('Start Docker Daemon (HTTP Nexus)') {
            steps {
                container('dind') {
                    sh '''
                        dockerd \
                          --host=unix:///var/run/docker.sock \
                          --insecure-registry nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                          --insecure-registry 127.0.0.1:30085 &
                        sleep 20
                        docker info
                    '''
                }
            }
        }

        stage('Login to Nexus (HTTP)') {
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
                        docker build -t dashboard:latest .
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
                        kubectl rollout restart deployment dashboard-deployment -n 2401036
                        kubectl rollout status deployment dashboard-deployment -n 2401036 --timeout=180s
                        '''
                    }
                }
            }
        }
    }
}
