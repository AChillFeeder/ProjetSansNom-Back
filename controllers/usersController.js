const db = require("../db/db_config");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const { nom, prenom, email, password } = req.body;

        if (!nom || !prenom || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // const [existingUser] = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);
        const { rows: existingUser } = await db.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const type_compte = 1;

        // await db.query(
        //     "INSERT INTO utilisateurs (nom, prenom, email, password, actif, type_compte) VALUES (?, ?, ?, ?, ?, ?)",
        //     [nom, prenom, email, hashedPassword, 1, type_compte]
        // );

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

        // const validPassword = await bcrypt.compare(password, user[0].password);
        // if (!validPassword) {
        if (password == user[0].password) {
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
