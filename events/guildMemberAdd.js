const { Events, AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas')
const { request } = require('undici')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
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
            `${member.user.username} just joined the server`,
            canvas.width / 8, canvas.height - 70,
            canvas.width * .75
        )

        //* user avatar image
        //* encircling avatar image bg
        context.beginPath()
        context.arc(canvas.width / 2, 120, 100 + 10, 0, Math.PI * 2, true)
        context.closePath()
        context.clip()

        //* user avatar image bg
        context.fillStyle = '#222222'
        
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        //* encircling avatar image
        context.beginPath()
        context.arc(canvas.width / 2, 120, 100, 0, Math.PI * 2, true)
        context.closePath()
        context.clip()

        //* get user avatar image and draw
        const { body } = await request(member.user.displayAvatarURL({ extension: 'jpg' }))
        const avatar = await Canvas.loadImage(await body.arrayBuffer())

        context.drawImage(avatar, (canvas.width / 2) - 100, 20, 200, 200)

        //* attachment builder
        const attachment = new AttachmentBuilder(
                await canvas.encode('png'),
                { name: 'welcome-image.png' }
            )

        member.guild.channels.cache.get('1265616621230362721').send({
            content: `Welcome to **${member.guild.name}**, <@!${member.user.id}>`,
            files: [ attachment ] 
        })

    }
}