const { Client, GatewayIntentBits, ActivityType, Collection} = require('discord.js');
const { Client: NotionClient } = require('@notionhq/client');
const dotenv = require('dotenv').config();
const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });
const fs = require('fs');
const moment = require('moment');

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
  setInterval(() => {
    const now = moment();
    const targetDate = moment('2023-05-12T19:00:00+00:00');
    const duration = moment.duration(targetDate.diff(now));
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const presenceText = `Do startu serwera pozostało: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    client.user.setPresence({ activities:
      [{
        name: presenceText,
        type: ActivityType.Streaming
      }]});
  }, 1000);
  });





// Slash builder
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if(!command) {
      return console.error('Nie znaleziono komendy. Najbliższa w Płocku.');
  }

  if (interaction.commandName === 'whitelist') {
    try {
      const minecraftNick = interaction.options.getString('minecraft');
      const twitchNick = interaction.options.getString('twitch');
  
      // Add the user data to the Notion database
      const databaseId = process.env.NOTION_DATABASE;
      const newEntry = {
        Minecraft: {
          title: [{ text: { content: minecraftNick } }],
        },
        Twitch: {
          rich_text: [{ text: { content: twitchNick } }],
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },

      };
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: newEntry,
      });
  
      await interaction.reply({
        content: `Nick ${minecraftNick} (${twitchNick}) dodany do bazy!`, ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Wystąpił błąd...', ephemeral: true });
    }
  }

  
});

// Login
client.login(process.env.DISCORD_TOKEN);