const { REST, Routes } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv').config();

const commands = [];

for (const folder of fs.readdirSync('./commands')) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);

        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
      console.log('Commands update in progress...');

      const data = await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands })

      console.log('Commands updated!');
  } catch (error) {
      console.error(error);
  }
})();