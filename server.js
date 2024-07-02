const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;
const Chemin = path.join(__dirname, 'commentaire.txt');

// Middleware pour servir les ressources statiques
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "js")));

// Middleware pour analyser les données des formulaires URL-encoded et JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatesPath = path.join(__dirname, "templates");

// Chemin vers le dossier views
// ================================commentaire=================================
app.post('/ajouter-commentaire', (req, res) => {
    const { nom, message } = req.body;
    const nouveauCommentaire = { nom, message };

    fs.readFile(Chemin, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Erreur lors de l\'ouverture du fichier:', err);
            return res.sendStatus(500);
        }

        const commentaires = data ? JSON.parse(data) : [];
        commentaires.push(nouveauCommentaire);

        fs.writeFile(Chemin, JSON.stringify(commentaires, null, 2) + '\n', (err) => {
            if (err) {
                console.error('Erreur lors de l\'ajout du fichier:', err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
    });
});

// 10 derniers commentaires
app.get('/commentaire', (req, res) => {
    fs.readFile(Chemin, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Erreur lors de la lecture du fichier:', err);
            return res.sendStatus(500);
        }

        const commentaires = data ? JSON.parse(data) : [];
        const derniersCommentaires = commentaires.slice(-10);
        res.json(derniersCommentaires);
    });
});
// ============================================================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "509omni.vp@gmail.com",
        pass: "pqda hpgo rzff nyvb",
    },
});

function sendEmail(name, prenom, email) {
    const mailOptions = {
        from:"509omni.vp@gmail.com" ,
        to:"509omni.vp@gmail.com",
        subject: "Vous avez un nouveau client",
        text: ` Nom :  ${name},\n Prenom : ${prenom}\n" Email : ${email}"\n\nCordialement,\nVotre équipe de support`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Erreur lors de l'envoi de l'email :", error);
        } else {
            console.log("Email envoyé :", info.response);
        }
    });
}

// Routes pour servir les fichiers HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(templatesPath, "contact.html"));
});

app.get("/offre", (req, res) => {
    res.sendFile(path.join(templatesPath, "offre.html"));
});

app.get("/equipe", (req, res) => {
    res.sendFile(path.join(templatesPath, "equipe.html"));
});

app.post("/contact", (req, res) => {
    const { nom, prenom ,email } = req.body;

    sendEmail(nom, prenom, email);
    res.send("Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.");
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port http://localhost:${PORT}`);
});
