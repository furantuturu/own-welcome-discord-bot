const { Events } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (! interaction.isChatInputCommand()) return

        if (interaction.commandName === 'welcome') {
            await interaction.reply(`Welcome to the server, <@${interaction.user.id}>`)
        }
    }
}