const { Client, GatewayIntentBits, ActivityType, Collection} = require('discord.js');
const { Client: NotionClient } = require('@notionhq/client');
const dotenv = require('dotenv').config();
const fs = require('fs');

// New user
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// // Tworzenie klienta Notion
// const notion = new NotionClient({ 
//   auth: process.env.NOTION_TOKEN,
// });

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



// client.application.commands.create({
//   name: 'Whitelist',
//   description: 'Dodaj siebie do bazy graczy którzy mają być dodani do whitelisty',
//   options: [
//     {
//       name: 'Minecrat',
//       description: 'Twój nick w Minecraft',
//       type: 'STRING',
//       required: true,
//     },
//     {
//       name: 'nicktwitch',
//       description: 'Nick gracza na Twitch',
//       type: 'STRING',
//       required: true,
//     },
//    ],
// });
// });

// Slash builder
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if(!command) {
      return console.error('Nie znaleziono komendy. Najbliższa w Płocku.');
  }

  try {
      await command.execute(interaction);
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Wystąpił błąd...', ephemeral: true });
  }
});
//   const nickMinecraft = options.getString('nickminecraft');
//   const nickTwitch = options.getString('nicktwitch');

//   // Dodawanie danych do bazy danych Notion
//   const databaseId = process.env.NOTION_DATABASE; // ZAMIENIC NA SWOJE ID BAZY DANYCH ZE STRONY NOTION
//   const newRecord = {
//     'Nick w Minecraft': { title: [{ type: 'text', text: { content: nickMinecraft } }] },
//     'Nick na Twitch': { title: [{ type: 'text', text: { content: nickTwitch } }] },
//   };
//   await notion.databases.createEntry(databaseId, { properties: newRecord });

//   // Odpowiedź na komendę typu "slash"
//   await interaction.reply({
//     content: 'Twój nick został dodany do bazy danych.',
//     ephemeral: true, // Odpowiedź będzie widoczna tylko dla autora komendy
//   });
// });

// Logowanie bota do Discorda
client.login(process.env.DISCORD_TOKEN);