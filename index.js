const fs = require('node:fs')
const path = require('node:path')

require('dotenv').config()

const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
] })

const eventsFolder = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.js'))

for (const evtfile of eventFiles) {
    const filePath = path.join(eventsFolder, evtfile)
    const event = require(filePath)

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(process.env.TOKEN)