const { Events, AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas')
const { request } = require('undici')


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (! interaction.isChatInputCommand()) return

        if (interaction.commandName === 'welcome') {

            const canvas = Canvas.createCanvas(700, 350)
            const context = canvas.getContext('2d')

            //* bg image
            const background = await Canvas.loadImage('./wallpaper.jpg')

            context.drawImage(background, 0, 0, canvas.width, canvas.height)

            context.strokeStyle = '#ff00ff'

            context.strokeRect(0, 0, canvas.width, canvas.height)

            //* text
            context.font = "bold 40px Arial, sans-serif"

            context.fillStyle = '#ffffff'

            context.fillText(
                `${interaction.user.username} just joined the server`,
                canvas.width / 8, canvas.height - 70,
                canvas.width * .75
            )

            //* user avatar image
            context.beginPath()
            context.arc(canvas.width / 2, 120, 100, 0, Math.PI * 2, true)
            context.closePath()
            context.clip()

            const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg' }))
            const avatar = await Canvas.loadImage(await body.arrayBuffer())

            context.drawImage(avatar, (canvas.width / 2) - 100, 20, 200, 200)

            //* attachment builder
            const attachment = new AttachmentBuilder(
                    await canvas.encode('png'),
                    { name: 'welcome-image.png' }
                )

            interaction.reply(
                {
                    content: `Welcome to **${interaction.member.guild.name}**, <@${interaction.user.id}>!`,
                    files: [ attachment ] 
                }
            )
        }
    }
}