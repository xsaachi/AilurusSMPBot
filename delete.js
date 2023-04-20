const { REST, Routes } = require('discord.js');

const dotenv = require('dotenv').config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// ...


// for global commands
rest.put(Routes.applicationCommands(process.env.APP_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);