const db = require("../db/db_config");

exports.getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const sql = `
      SELECT * 
      FROM Messages
      WHERE id_sender = ? OR id_receiver = ?
      ORDER BY date_message ASC
    `;
    const [rows] = await db.query(sql, [userId, userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};


exports.sendMessageHTTP = async (req, res) => {
    try {
      const { id_sender, id_receiver, message } = req.body;
      const [result] = await db.query(
        "INSERT INTO Messages (id_sender, id_receiver, message, date_message) VALUES (?, ?, ?, NOW())",
        [id_sender, id_receiver, message]
      );
      res.json({ message: "Message envoyé", insertedId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur." });
    }
  };

exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const sql = `
      SELECT *
      FROM Messages
      WHERE conversation_id = ?
      ORDER BY date_message ASC
    `;
    const [rows] = await db.query(sql, [conversationId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { id_sender, id_receiver, message } = req.body;
    const sql = `
      INSERT INTO Messages (id_sender, id_receiver, message, date_message)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [id_sender, id_receiver, message]);
    res.json({ message: "Message envoyé", insertedId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};
