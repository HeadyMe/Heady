/**
 * Heady Microsoft Teams Bot
 * Responds to messages via Heady API.
 * Requires: TEAMS_APP_ID, TEAMS_APP_PASSWORD, HEADY_API_URL
 * Install: npm install botbuilder
 */

const HEADY_API = process.env.HEADY_API_URL || 'http://localhost:3300';

async function chatWithHeady(message, context) {
  try {
    const res = await fetch(`${HEADY_API}/api/buddy/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message, context: `teams_${context}`,
        source: 'teams-bot', history: [],
      }),
    });
    const data = await res.json();
    return data.reply || data.message || "I couldn't process that.";
  } catch (err) { return `Error: ${err.message}`; }
}

// For full implementation, use Microsoft Bot Framework:
//   const { BotFrameworkAdapter } = require('botbuilder');
//   const adapter = new BotFrameworkAdapter({
//     appId: process.env.TEAMS_APP_ID,
//     appPassword: process.env.TEAMS_APP_PASSWORD,
//   });
//   adapter.onTurnError = async (context, error) => { console.error(error); };

console.log('Heady Teams Bot — install botbuilder for full functionality');
console.log(`API: ${HEADY_API}`);

module.exports = { chatWithHeady };
