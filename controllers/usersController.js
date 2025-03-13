const db = require("../db/db_config");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const { nom, prenom, email, password } = req.body;

        if (!nom || !prenom || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const { rows: existingUser } = await db.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const type_compte = 1;

        await db.query(
            "INSERT INTO utilisateurs (nom, prenom, email, password, actif, type_compte) VALUES ($1, $2, $3, $4, $5, $6)",
            [nom, prenom, email, hashedPassword, 1, type_compte]
        );

        return res.status(201).json({ message: "Inscription réussie !" });
    } catch (error) {
        console.error("❌ ERREUR SQL :", error);
        return res.status(500).json({ error: "Erreur serveur." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const { rows: user } = await db.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);

        if (user.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }
        console.log('Found user');
        console.log(password, user[0].password);

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
        // if (password != user[0].password) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        res.json({ message: "Connexion réussie !" });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM utilisateurs");
        res.json(result.rows); // On retourne uniquement les résultats
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Récupérer l'ID depuis l'URL
        const { nom, prenom } = req.body; // Champs à modifier

        // Vérification si au moins un champ est fourni
        if (!nom && !prenom) {
            return res.status(400).json({ message: "Veuillez fournir au moins un champ à mettre à jour." });
        }

        // Construire dynamiquement la requête SQL
        let query = "UPDATE utilisateurs SET";
        let values = [];
        let index = 1;

        if (nom) {
            query += ` nom = $${index},`;
            values.push(nom);
            index++;
        }

        if (prenom) {
            query += ` prenom = $${index},`;
            values.push(prenom);
            index++;
        }

        // Supprimer la dernière virgule et ajouter la clause WHERE
        query = query.slice(0, -1) + ` WHERE id = $${index} RETURNING *;`;
        values.push(id);

        // Exécuter la requête
        const result = await db.query(query, values);

        // Vérifier si un utilisateur a été mis à jour
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json({ message: "Utilisateur mis à jour avec succès.", user: result.rows[0] });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};
