const {SlashCommandBuilder} = require('discord.js');
const dotenv = require('dotenv').config();
const { Client: NotionClient } = require('@notionhq/client');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Dodaj siebie do bazy graczy, którzy mają być dodani do whitelisty.')
        .addStringOption(option =>
            option.setName('minecraft')
                .setDescription('Twój nick w Minecraft.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('twitch')
                .setDescription('Twój twitch tag.')
                .setRequired(true)),
}


