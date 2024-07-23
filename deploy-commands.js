require('dotenv').config()

const { REST, Routes } = require('discord.js')

const welcomeSimCmd = [
    {
        name: 'welcome',
        description: 'Does a simulation of welcoming a user'
    }
] 

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${welcomeSimCmd.length} application (/) command`)

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: welcomeSimCmd }
            )

        console.log(`Successfully reloaded ${data.length} application (/) command`)
        
    } catch (error) {
        console.log(error)
    }
})()