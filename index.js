const { Client, GatewayIntentBits, ActivityType, Collection} = require('discord.js');
const { Client: NotionClient } = require('@notionhq/client');

const dotenv = require('dotenv').config();
const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });
console.log (process.env.NOTION_TOKEN);
const fs = require('fs');

// New user
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});


//Command import
client.commands = new Collection();

for (const folder of fs.readdirSync('./commands')) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);

        client.commands.set(command.data.name, command);
    }
};

// Login event
client.once('ready', () => {
  console.log(`Logged in as: ${client.user.tag}`);
  client.user.setPresence({
    activities:
    [{
      name: 'Ailurus SMP',
      type: ActivityType.Playing
    }]});
  });





// Slash builder
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if(!command) {
      return console.error('Nie znaleziono komendy. Najbliższa w Płocku.');
  }

  if (interaction.commandName === 'whitelist') {
    const minecraftNick = interaction.options.getString('minecraft');
    const twitchNick = interaction.options.getString('twitch');

    // Add the user data to the Notion database
    const databaseId = process.env.NOTION_DATABASE;
    const newEntry = {
      Minecraft: {
        title: [{ text: { content: minecraftNick } }],
      },
      Twitch: {
        title: [{ text: { content: twitchNick } }],
      },
    };
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: newEntry,
    });

    await interaction.reply({
      content: `User ${minecraftNick} (${twitchNick}) has been added to the database!`, ephemeral: true
    });
    try {
      await command.execute(interaction);
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Wystąpił błąd...', ephemeral: true });
  }
  }

  try {
      await command.execute(interaction);
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Wystąpił błąd...', ephemeral: true });
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);