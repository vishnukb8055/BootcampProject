pipeline {
    agent any
    environment {
        PATH = "C:/Users/e031975/Downloads/apache-maven-3.9.8-bin/apache-maven-3.9.8/bin;${env.PATH}"
    }
    stages {
        stage('Git Clone') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/haarish04/TelConnect.git']]
                ])
            }
        }
        stage("Maven Install and Test") {
            steps {
                bat '''
                mvn install
                '''
            }
        }
        stage("Validate Docker"){
            steps{
                bat "docker pull alpine"
            }
        }
        stage("Build Docker image") {
            steps {
                script {
                    try{
                        bat "docker rmi -f teleconnect"
                        echo "REMOVED existing docker image and building a new one"
                    }
                    catch(Exception e){
                        echo "Exception occurred "+e.toString()
                    }
                    bat "docker build -t teleconnect ."
                }
            }
        }
    }
}