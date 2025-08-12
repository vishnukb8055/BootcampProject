pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/sukruthi-landing']],
                    userRemoteConfigs: [[url: 'https://github.com/haarish04/telConnect-app']]
                ])
            }
        }
        stage('Pull Docker Image') {
            steps {
                bat "docker pull alpine"
            }
        }
        stage('Test && Install Dependencies') {
            steps {
                bat '''
                C:\\Users\\e031882\\software\\node-v20.16.0-win-x64\\node-v20.16.0-win-x64\\node -v
                C:\\Users\\e031882\\software\\node-v20.16.0-win-x64\\node-v20.16.0-win-x64\\npm -v
                dir
                dir node_modules/.bin
                C:\\Users\\e031882\\software\\node-v20.16.0-win-x64\\node-v20.16.0-win-x64\\npm run test
                C:\\Users\\e031882\\software\\node-v20.16.0-win-x64\\node-v20.16.0-win-x64\\npm install
                '''
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def imageName = 'my-react-app'
                    try {
                        bat "docker rm -f ${imageName}"
                        bat "docker rmi -f ${imageName}"
                    } catch (Exception e) {
                        echo "Exception occurred: " + e.toString()
                    }
                    bat "docker build --progress=plain -t ${imageName} ."
                }
            }
        }
        stage("Run React Container") {
            steps {
                bat '''
                docker run -d --name my-react-app -p 3002:3000 my-react-app
                '''
            }
        }
    }
}
