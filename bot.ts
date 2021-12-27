import { Client, Intents, MessageAttachment, TextChannel } from 'discord.js';
require('dotenv').config();

const client = new Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
});

client.on('ready', () => {
	console.log(`Logged in`);
	let chanel: any = client.channels.cache.get(process.env.CHANNEL_ID!);
	const img = new MessageAttachment('./3.PNG', '3.png');
	(chanel as TextChannel).send({ files: [img] });
});

client.on('interactionCreate', async (interaction) => {
	console.log(interaction.isCommand());
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});

client.on('messageCreate', (msg) => {
	console.log(msg.content);
	if (msg.content == 'ping') {
		msg.channel.send('pong cái đm cáu vl');
	}
});

client.login(process.env.TOKEN);
