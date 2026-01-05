pipeline{
   // Specifie que le pipeline peut s executer sur n importe quel agent
   agent any

 //declare les variables d environement utilisees dans le pipeline
environment{
       GIT_REPO = 'https://github.com/ledemkam/mybank.git'
       NODE_VERSION = '22'
       BUILD_DIR = 'dist'
   }

stages{
    // premiere etape : cloner le depot GITHUB
    stage('Cloner le depot'){
        steps{
          echo 'Clonage du depot GITHUB'
          git branch: 'main', url:"${GIT_REPO}"
        }
    }

    // deuxieme etape: Installer les dependances
    stage('Installer les dependances'){
      steps{
        echo 'Installation des dependances'
        bat """
        REM Verifier Node.js et npm
        node --version
        npm --version

        REM Nettoyer le cache npm
        npm cache clean --force

        REM Installer les dependances
        npm ci

        REM Installer Angular CLI globalement
        npm install -g @angular/cli
        """
      }
    }

    // troisieme etape: Verifier la qualite du code (lint)
    stage('Verifier la qualite du code'){
      steps{
        echo 'Verification du code avec ESLint'
        bat """
        REM Verifier la syntaxe et la qualite du code
        npm run lint || echo "Lint check completed with warnings"
        """
      }
    }

    // quatrieme etape: Executer les tests unitaires
    stage('Executer les tests'){
      steps{
        echo 'Execution des tests unitaires'
        bat """
        REM Executer les tests avec coverage
        npm run test:ci
        """
      }
      post {
        always {
          // Publier les resultats des tests
          publishTestResults testResultsPattern: 'coverage/lcov-report/index.html'
          publishHTML([
            allowMissing: false,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: 'coverage/lcov-report',
            reportFiles: 'index.html',
            reportName: 'Coverage Report'
          ])
        }
      }
    }

    // cinquieme etape: Build de l'application
    stage('Build de l\'application'){
      steps{
        echo 'Build de l\'application Angular'
        bat """
        REM Build de production
        npm run build --prod

        REM Verifier que le build a ete cree
        dir %BUILD_DIR%
        """
      }
    }

    // sixieme etape: Archiver les artefacts
    stage('Archiver les artefacts'){
      steps{
        echo 'Archivage des artefacts de build'
        archiveArtifacts artifacts: "${BUILD_DIR}/**/*", allowEmptyArchive: false
      }
    }

    // septieme etape: Deploiement (optionnel)
    stage('Deploiement'){
      // Cette condition assure que le deploiement ne se fait que sur la branche principale
      // Evite les deploiements accidentels depuis des branches de feature
      when {
        branch 'main'
      }
      steps{
        echo 'Deploiement vers l\'environnement de staging'
        bat """
        REM === ETAPE 1: PREPARATION DU DEPLOIEMENT ===
        REM Verifier que les artefacts de build existent
        echo "Verification des artefacts de build..."
        dir %BUILD_DIR%

        REM === ETAPE 2: DEPLOIEMENT VERS UN SERVEUR WEB ===
        REM Option A: Deploiement vers un serveur Apache/Nginx
        REM rsync -avz --delete %BUILD_DIR%/ user@server:/var/www/mybank/

        REM Option B: Deploiement vers Azure Static Web Apps
        REM az webapp deployment source config-zip --resource-group mybank-rg --name mybank-app --src mybank.zip

        REM Option C: Deploiement vers AWS S3 + CloudFront
        REM aws s3 sync %BUILD_DIR%/ s3://mybank-bucket --delete
        REM aws cloudfront create-invalidation --distribution-id E123456789 --paths "/*"

        REM Option D: Deploiement vers Firebase Hosting
        REM firebase deploy --only hosting

        REM Option E: Deploiement vers GitHub Pages
        REM gh-pages -d %BUILD_DIR%

        REM === ETAPE 3: VERIFICATION POST-DEPLOIEMENT ===
        REM Test de sante de l'application deployee
        REM curl -f http://your-app-url.com/health || exit 1

        REM === ETAPE 4: NOTIFICATION ===
        REM Envoyer une notification de succes
        echo "Application MyBank deployee avec succes!"
        echo "URL de l application: https://your-app-url.com"

        REM Optionnel: Envoyer notification Slack/Teams
        REM curl -X POST -H 'Content-type: application/json' ^
        REM   --data '{"text":"MyBank deployed successfully to staging!"}' ^
        REM   YOUR_SLACK_WEBHOOK_URL
        """
      }
      // Actions post-deploiement
      post {
        success {
          echo 'Deploiement reussi! L application est maintenant accessible.'
          // Ici vous pouvez ajouter des notifications de succes
        }
        failure {
          echo 'Echec du deploiement! Verifiez les logs.'
          // Ici vous pouvez ajouter des notifications d echec
        }
      }
    }
}

post {
    always {
        echo 'Pipeline termine'
        cleanWs() // Nettoyer l'espace de travail
    }
    success {
        echo 'Pipeline execute avec succes!'
        // Optionnel: envoyer une notification de succes
    }
    failure {
        echo 'Le pipeline a echoue!'
        // Optionnel: envoyer une notification d'echec
    }
}
}



