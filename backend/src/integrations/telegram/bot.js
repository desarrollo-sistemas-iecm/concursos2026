const https = require('https');
const vars = require('../../config/vars');

/**
 * Sends a markdown message to the configured Telegram chat/channel for internal technical monitoring.
 * @param {string} text - Message in markdown format.
 * @returns {Promise<object>}
 */
function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const token = vars.telegram.token;
    const chatId = vars.telegram.chatId;

    if (!token || !chatId) {
      return reject(new Error('Telegram credentials are not configured. Skipping alert.'));
    }

    const payload = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload, 'utf8')
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseBody));
          } catch (e) {
            resolve({ raw: responseBody });
          }
        } else {
          reject(new Error(`Telegram Bot API responded with status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = {
  sendTelegramMessage
};
