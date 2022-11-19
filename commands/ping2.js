const Discord = require('discord.js')

module.exports = {
    data: {name: 'ping2'},
    async execute(client, message, args){
        let embed = new Discord.EmbedBuilder()
            .setColor('Aqua')
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`Hello ${message.author} you ping is: \`${client.ws.ping}ms\`.`)

        message.reply({embeds: [embed]})
    }
}