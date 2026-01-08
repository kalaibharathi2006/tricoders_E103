const { google } = require('googleapis');
const fs = require('fs').promises;
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

async function authorize() {
  let client;
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    client = google.auth.fromJSON(credentials);
  } catch (err) {
    client = await getNewToken();
  }
  return client;
}

async function getNewToken() {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  
  const oauth2Client = new google.auth.OAuth2(
    key.client_id,
    key.client_secret,
    key.redirect_uris[0]
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n?? Authorize this app by visiting this URL:\n');
  console.log(authUrl);
  console.log('\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      resolve(code);
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  await fs.writeFile(TOKEN_PATH, JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: tokens.refresh_token,
  }));

  console.log('? Token stored to', TOKEN_PATH);
  return oauth2Client;
}

async function listEmails(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 5,
  });

  const messages = res.data.messages;
  if (!messages || messages.length === 0) {
    console.log('No messages found.');
    return;
  }

  console.log('\n?? Your recent emails:\n');
  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });
    
    const headers = msg.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
    
    console.log(`From: ${from}`);
    console.log(`Subject: ${subject}`);
    console.log('-'.repeat(60) + '\n');
  }
}

async function main() {
  try {
    console.log('?? Gmail Integration Starting...\n');
    const auth = await authorize();
    await listEmails(auth);
    console.log('? Done!');
  } catch (error) {
    console.error('? Error:', error.message);
  }
}

main();
