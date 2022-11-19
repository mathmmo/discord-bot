//Bacis Modules
const fs = require('fs')
const path = require('path')
// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits, Events, ChannelType } = require('discord.js')
const { TOKEN, PREFIX } = require('./config.json')

// Create a new client instance
const client = new Client({ intents: [1, 512, 32768, 2, 128] })

//Log to state the connection
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (let file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
	}
})

client.on('messageCreate', async (message) => {
	let prefix = PREFIX

	if( message.author.bot ) return
	if( message.channel.type == ChannelType.DM ) return
	if( !message.content.toLowerCase().startsWith(prefix.toLowerCase()) ) return

	const args = message.content.slice(prefix.length).trim().split(/ +/g)

	let cmd = args.shift().toLowerCase()
	if(cmd.length === 0) return

	let command = client.commands.get(cmd)

	if(!command){
		console.log(`no command found of: ${cmd}`)
		return
	}

	try {
		command.execute(client, message, args)
	} catch (error) {
		console.log(error)
	}
})

// Log in to Discord with your client's token
client.login(TOKEN)