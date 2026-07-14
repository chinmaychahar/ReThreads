const { Client, Databases, Users, Storage } = require('node-appwrite');
const { env } = require('./env');

const client = new Client();

if (env.APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);
}

const databases = new Databases(client);
const users = new Users(client);
const storage = new Storage(client);

module.exports = { client, databases, users, storage };
