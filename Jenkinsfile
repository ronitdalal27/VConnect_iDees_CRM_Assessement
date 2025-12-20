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
                        dockerd-entrypoint.sh &
                        sleep 15
                        docker version
                        docker build -t dashboard:latest .
                    '''
                }
            }
        }

        stage('Login & Push to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                        -u admin -p Changeme@2025

                        docker tag dashboard:latest \
                        nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401036-project/dashboard-2401036:latest

                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401036-project/dashboard-2401036:latest
                    '''
                }
            }
        }

        stage('Deploy Dashboard') {
            steps {
                container('kubectl') {
                    dir('k8s') {
                        sh '''
                        kubectl get namespace 2401036 || kubectl create namespace 2401036

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
    }
}
