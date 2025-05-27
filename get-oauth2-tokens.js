require('dotenv').config();
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const readline = require('readline');

const oauth2Client = new OAuth2Client(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'http://localhost:3000/oauth2callback'
);

const SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'  // Force to get refresh token
});

console.log('Authorize this app by visiting this url:', url);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the code from that page here: ', async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\nYour tokens:');
        console.log('Refresh Token:', tokens.refresh_token);
        console.log('Access Token:', tokens.access_token);
        console.log('\nAdd these to your .env file:');
        console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('GMAIL_ACCESS_TOKEN=' + tokens.access_token);
    } catch (error) {
        console.error('Error getting tokens:', error);
    }
    rl.close();
}); 