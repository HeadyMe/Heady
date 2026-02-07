/**
 * Heady Email Agent
 * Monitors inbox via IMAP, processes with Heady, sends replies via SMTP.
 * Requires: IMAP_HOST, IMAP_USER, IMAP_PASS, SMTP_HOST, SMTP_USER, SMTP_PASS
 * Install: npm install imap nodemailer
 */

const HEADY_API = process.env.HEADY_API_URL || 'http://localhost:3300';

async function processEmail(from, subject, body) {
  try {
    const res = await fetch(`${HEADY_API}/api/buddy/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Email from ${from}\nSubject: ${subject}\n\n${body.slice(0, 5000)}`,
        context: 'email_agent',
        source: 'email-agent',
        history: [],
      }),
    });
    const data = await res.json();
    return data.reply || data.message || '';
  } catch (err) { return `Error processing email: ${err.message}`; }
}

// For full IMAP/SMTP implementation:
//   const Imap = require('imap');
//   const nodemailer = require('nodemailer');
//   // Connect to IMAP, watch INBOX, process new emails, draft replies

console.log('Heady Email Agent — install imap + nodemailer for full functionality');
console.log(`API: ${HEADY_API}`);

module.exports = { processEmail };
