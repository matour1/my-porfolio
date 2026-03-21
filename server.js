const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname)));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/send', async (req, res) => {
  try {
    const { from_name, from_email, subject, message } = req.body || {};

    if (!from_name || !from_email || !subject || !message) {
      return res.status(400).json({ ok: false, error: 'Champs requis manquants.' });
    }
    if (!isValidEmail(from_email)) {
      return res.status(400).json({ ok: false, error: 'Email invalide.' });
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const to = process.env.MAIL_TO || user;

    if (!user || !pass) {
      return res.status(500).json({ ok: false, error: 'Email serveur non configuré.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    const ownerMail = {
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: from_email,
      subject: `[Portfolio] ${subject}`,
      text: `Nom: ${from_name}\nEmail: ${from_email}\n\nMessage:\n${message}`
    };

    const confirmationMail = {
      from: `"Rey Matour" <${user}>`,
      to: from_email,
      subject: 'Confirmation de réception',
      text: `Bonjour ${from_name},\n\nMerci pour votre message. Je vous réponds dès que possible.\n\nRécapitulatif:\nSujet: ${subject}\nMessage: ${message}\n\n— Rey Matour`
    };

    await transporter.sendMail(ownerMail);
    await transporter.sendMail(confirmationMail);

    return res.json({ ok: true });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ ok: false, error: 'Erreur serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
