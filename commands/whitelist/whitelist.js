const {SlashCommandBuilder} = require('discord.js');
const dotenv = require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Dodaj siebie do bazy graczy, którzy mają być dodani do whitelisty.'),
    async execute(interaction) {
        interaction.reply('Test');
    }
}