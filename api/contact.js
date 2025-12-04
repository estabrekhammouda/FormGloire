// Serverless Function pour Vercel
// Ce fichier gère la soumission du formulaire

module.exports = async (req, res) => {
    // Configuration CORS pour permettre les requêtes
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Gérer les requêtes OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Accepter uniquement POST
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Méthode non autorisée' 
        });
    }

    try {
        // Récupérer les données du formulaire
        const { nom, email, sujet, message, easterEggs } = req.body;

        // Validation backend
        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({
                success: false,
                error: 'Tous les champs sont requis'
            });
        }

        // Validation email basique
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Email invalide'
            });
        }

        // Préparer les données
        const submission = {
            nom,
            email,
            sujet,
            message,
            easterEggs: easterEggs || 0,
            date: new Date().toISOString(),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        };

        // Log dans la console Vercel (visible dans les logs)
        console.log('📨 Nouvelle soumission:', submission);

        // ===== OPTION 1 : Envoyer un email avec Nodemailer =====
        // Décommentez cette section si vous voulez envoyer des emails
        /*
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // À configurer dans Vercel
                pass: process.env.EMAIL_PASS  // App password Google
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'votre-email@example.com',
            subject: `🎰 Contact Matrix - ${sujet}`,
            html: `
                <h2>Nouveau message depuis Contact Matrix!</h2>
                <p><strong>Nom:</strong> ${nom}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Sujet:</strong> ${sujet}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>Easter Eggs trouvés: ${easterEggs}/5</em></p>
                <p><em>Date: ${new Date(submission.date).toLocaleString('fr-FR')}</em></p>
            `
        };

        await transporter.sendMail(mailOptions);
        */

        // ===== OPTION 2 : Sauvegarder dans une base de données =====
        // Ajoutez ici votre code pour sauvegarder dans:
        // - Firebase Firestore
        // - MongoDB Atlas
        // - PostgreSQL
        // - Etc.

        // ===== OPTION 3 : Webhook vers Slack/Discord =====
        // Décommentez pour envoyer vers Slack
        /*
        await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `🎰 Nouveau message de ${nom} (${email})\nSujet: ${sujet}\nMessage: ${message}`
            })
        });
        */

        // Réponse de succès
        return res.status(200).json({
            success: true,
            message: 'Message envoyé avec succès! 🎉',
            data: {
                nom,
                easterEggs,
                bonus: easterEggs >= 5 ? '🏆 MAÎTRE DES SECRETS!' : null
            }
        });

    } catch (error) {
        console.error('❌ Erreur serveur:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};