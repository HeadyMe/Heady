/**
 * Heady Discord Bot
 * Listens for messages and slash commands, responds via Heady API.
 * Requires: DISCORD_TOKEN, HEADY_API_URL
 * Install: npm install discord.js
 */

const HEADY_API = process.env.HEADY_API_URL || 'http://localhost:3300';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  console.error('Set DISCORD_TOKEN environment variable');
  process.exit(1);
}

async function chatWithHeady(message, context) {
  try {
    const res = await fetch(`${HEADY_API}/api/buddy/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message, context: `discord_${context}`,
        source: 'discord-bot', history: [],
      }),
    });
    const data = await res.json();
    return data.reply || data.message || "I couldn't process that.";
  } catch (err) { return `Error: ${err.message}`; }
}

// Minimal Discord.js setup
// For full implementation, use:
//   const { Client, GatewayIntentBits } = require('discord.js');
//   const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
//   client.on('messageCreate', async msg => {
//     if (msg.author.bot) return;
//     if (msg.mentions.has(client.user) || msg.content.startsWith('!heady')) {
//       const text = msg.content.replace(/^!heady\s*|<@\d+>\s*/g, '').trim();
//       const reply = await chatWithHeady(text, msg.channel.id);
//       msg.reply(reply);
//     }
//   });
//   client.login(DISCORD_TOKEN);

console.log('Heady Discord Bot — install discord.js for full functionality');
console.log(`API: ${HEADY_API}`);

module.exports = { chatWithHeady };
