import { query } from '../config/db.js';
import { hashPassword } from '../utils/password.js';

export const normalizePhone = (phone) => {
  if (phone.startsWith('07')) {
    return '254' + phone.substring(1);
  }
  if (phone.startsWith('+254')) {
    return phone.substring(1);
  }
  return phone;
};

export const findUserByEmail = async (email) => {
  const [rows] = await query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const findUserByPhone = async (phone) => {
  const [rows] = await query('SELECT * FROM users WHERE phone = ?', [phone]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const createUser = async (userData) => {
  const { name, email, phone, password, role } = userData;
  const hashedPassword = await hashPassword(password);
  
  const text = `
    INSERT INTO users (name, email, phone, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, email, phone, hashedPassword, role];
  
  const [result] = await query(text, values);
  
  // Fetch and return the newly created user (excluding password if you prefer, or select specific fields)
  const [newUser] = await query(
    'SELECT id, name, email, phone, role FROM users WHERE id = ?', 
    [result.insertId]
  );
  
  return newUser[0];
};
