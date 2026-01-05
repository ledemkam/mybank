pipeline{
   agent any

environment{
       GIT_REPO = 'https://github.com/ledemkam/mybank.git'
       NODE_VERSION = '22'
       BUILD_DIR = 'dist'
   }

stages{
    stage('Cloner le depot'){
        steps{
          echo 'Clonage du depot GITHUB'
          git branch: 'main', url:"${GIT_REPO}"
        }
    }

   stage('Installer les dependances'){
  steps{
    echo 'Installation des dependances'
    bat 'node --version'
    bat 'npm --version'
    bat 'npm cache clean --force'
    bat 'npm ci'
    bat 'npm install -g @angular/cli'
  }
}

    stage('Executer les tests'){
      steps{
        echo 'Execution des tests unitaires'
        bat """
        REM Vérifier les scripts disponibles
        npm run

        REM Exécuter les tests (ajustez selon votre package.json)
        npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
        """
      }
      post {
        always {
          // Publier les résultats avec junit au lieu de publishTestResults
          script {
            if (fileExists('coverage/junit.xml')) {
              junit 'coverage/junit.xml'
            }
            if (fileExists('coverage/lcov-report/index.html')) {
              publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Jest Coverage Report'
              ])
            }
          }
        }
      }
    }

    stage('Build de l\'application'){
      steps{
        echo 'Build de l\'application Angular'
        bat """
        ng build --configuration=production
        dir %BUILD_DIR%
        """
      }
    }

    stage('Archiver les artefacts'){
      steps{
        echo 'Archivage des artefacts de build'
        archiveArtifacts artifacts: "${BUILD_DIR}/**/*", allowEmptyArchive: false
      }
    }

    stage('Deploiement'){
      when {
        branch 'main'
      }
      steps{
        echo 'Deploiement vers l\'environnement de staging'
        bat """
        echo "Verification des artefacts de build..."
        dir %BUILD_DIR%
        echo "Application MyBank deployee avec succes!"
        """
      }
      post {
        success {
          echo 'Deploiement reussi!'
        }
        failure {
          echo 'Echec du deploiement!'
        }
      }
    }
}

post {
    always {
        echo 'Pipeline termine'
        cleanWs()
    }
    success {
        echo 'Pipeline execute avec succes!'
    }
    failure {
        echo 'Le pipeline a echoue!'
    }
}
}
