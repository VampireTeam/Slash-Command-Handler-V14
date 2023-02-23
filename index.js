const fs = require("node:fs");
const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)]
});
module.exports = client;

client.commands = new Collection();

fs.readdirSync('./Handlers').forEach((h) => {
  require(`./Handlers/${h}`)(client);
})

client.login(process.env.token)