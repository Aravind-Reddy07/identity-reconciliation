import db from "../config/db.js";

const getContactsByEmailOrPhone = async (email, phoneNumber) => {
  const [rows] = await db.query(
    `SELECT * FROM Contact WHERE (email = ? OR phoneNumber = ?) AND deletedAt IS NULL`,
    [email, phoneNumber]
  );
  return rows;
};

const createContact = async (email, phoneNumber, linkedId, precedence) => {
  const [result] = await db.query(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [email, phoneNumber, linkedId, precedence]
  );
  const [newContact] = await db.query(`SELECT * FROM Contact WHERE id = ?`, [
    result.insertId,
  ]);
  return newContact[0];
};

const updateContact = async (id, updates) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  values.push(id);

  await db.query(
    `UPDATE Contact SET ${fields.join(", ")}, updatedAt = NOW() WHERE id = ?`,
    values
  );
};

export default {
  getContactsByEmailOrPhone,
  createContact,
  updateContact,
};
