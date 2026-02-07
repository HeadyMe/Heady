/**
 * Heady Slack Bot
 * Listens for messages and responds via Heady API.
 * Requires: SLACK_BOT_TOKEN, SLACK_APP_TOKEN, HEADY_API_URL
 */

const HEADY_API = process.env.HEADY_API_URL || 'http://localhost:3300';
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;

if (!SLACK_BOT_TOKEN || !SLACK_APP_TOKEN) {
  console.error('Set SLACK_BOT_TOKEN and SLACK_APP_TOKEN environment variables');
  process.exit(1);
}

async function handleMessage(event) {
  if (event.bot_id) return; // Ignore bot messages

  try {
    const res = await fetch(`${HEADY_API}/api/buddy/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: event.text,
        context: `slack_channel_${event.channel}`,
        source: 'slack-bot',
        history: [],
      }),
    });
    const data = await res.json();
    const reply = data.reply || data.message || "I couldn't process that.";

    // Post reply back to Slack
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
      body: JSON.stringify({ channel: event.channel, text: reply, thread_ts: event.ts }),
    });
  } catch (err) {
    console.error('Error handling message:', err.message);
  }
}

// Socket Mode connection (requires @slack/bolt or similar)
// This is a minimal implementation — for production, use @slack/bolt
console.log('Heady Slack Bot starting...');
console.log(`API: ${HEADY_API}`);
console.log('For full Socket Mode support, install @slack/bolt:');
console.log('  npm install @slack/bolt');
console.log('Then use the App class from @slack/bolt.');

module.exports = { handleMessage };
