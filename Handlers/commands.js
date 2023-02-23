const fs = require("node:fs");
const { REST, Routes, Events } = require("discord.js");
const token = process.env.token;
const rest = new REST({ version: '10' }).setToken(token);

module.exports = (client) => {
  const commands = [];

  fs.readdirSync("./Commands").forEach(folder => {
    const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../Commands/${folder}/${file}`);

      if (command.data?.name && command.data?.description) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command)
      }
    }
  });

  client.on(Events.ClientReady, async (c) => {
    try {
      console.log(`Started Refreshing ${commands.length} Application (/) Commands.`);
      const data = await rest.put(Routes.applicationCommands(c.user.id), {
        body: commands
      });
      console.log(`Successfully Reloaded ${data.length} Application (/) Commands.`);
    } catch (err) {
      console.log(err)
    }
  })
}