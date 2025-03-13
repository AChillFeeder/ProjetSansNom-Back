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

    const [existingConversation] = await db.query(
      `SELECT id FROM Conversations 
       WHERE (id_user1 = ? AND id_user2 = ?) 
          OR (id_user1 = ? AND id_user2 = ?) 
       LIMIT 1`,
      [id_sender, id_receiver, id_receiver, id_sender]
    );

    let conversationId;

    if (existingConversation.length > 0) {
      conversationId = existingConversation[0].id;
    } else {
      const [newConv] = await db.query(
        `INSERT INTO Conversations (id_user1, id_user2, date_creation) 
         VALUES (?, ?, NOW()) RETURNING id`,
        [id_sender, id_receiver]
      );
      conversationId = newConv.insertId;
    }

    const [result] = await db.query(
      `INSERT INTO Messages (id_sender, id_receiver, conversation_id, message, date_message)
       VALUES (?, ?, ?, ?, NOW())`,
      [id_sender, id_receiver, conversationId, message]
    );

    res.json({
      message: "Message envoyé",
      conversationId,
      insertedId: result.insertId
    });

  } catch (err) {
    console.error("Erreur lors de l'envoi du message:", err);
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


exports.startConversation = async (req, res) => {
  try {
    const { id_sender, id_receiver } = req.body;

    const [existingConversation] = await db.query(
      `SELECT id FROM Conversations 
       WHERE (id_user1 = ? AND id_user2 = ?) 
          OR (id_user1 = ? AND id_user2 = ?) 
       LIMIT 1`,
      [id_sender, id_receiver, id_receiver, id_sender]
    );

    if (existingConversation.length > 0) {
      return res.json({
        message: "Conversation déjà existante",
        conversationId: existingConversation[0].id
      });
    }

    const [newConv] = await db.query(
      `INSERT INTO Conversations (id_user1, id_user2, date_creation) 
       VALUES (?, ?, NOW()) RETURNING id`,
      [id_sender, id_receiver]
    );

    res.status(201).json({ message: "Nouvelle conversation créée", conversationId: newConv.insertId });

  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};