import {
	Client,
	MessageAttachment,
	TextChannel,
	VoiceChannel,
} from 'discord.js';
import {
	AudioPlayer,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice';
import textToSpeech from '@google-cloud/text-to-speech';
import { Readable } from 'stream';
require('dotenv').config();

const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'DIRECT_MESSAGES',
		'GUILD_VOICE_STATES',
	],
});
const ggclient = new textToSpeech.TextToSpeechClient();

let listRoom = new Map<string, AudioPlayer>();

client.on('ready', () => {
	console.log(`Logged in`);
	//let chanel: any = client.channels.cache.get(process.env.CHANNEL_ID!);
	// const img = new MessageAttachment('./test.PNG');
	// const img1 = new MessageAttachment('./3.PNG');
	// (chanel as TextChannel).send({ files: [img, img1] }).then((res) => {
	// 	const atch = res.attachments;
	// 	const arr = atch.map((x) => x.url);
	// 	console.log(arr);
	// });
});

client.on('messageCreate', async (msg) => {
	if (msg.content.startsWith('!say')) {
		const channel = msg.member!.voice.channel!;
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: msg.guild!.id,
			// @ts-ignore
			adapterCreator: msg.guild.voiceAdapterCreator,
		});
		const player = createAudioPlayer();
		listRoom.set(channel.id, player);
		connection.subscribe(player);
		const resc = createAudioResource(
			Readable.from(await speech(msg.content.slice(5))),
			{ inlineVolume: true }
		);
		player.play(resc);
	}
});

async function speech(text: string) {
	return new Promise<string>(async (resolve, reject) => {
		const [response] = await ggclient.synthesizeSpeech({
			input: { text: text },
			// Select the language and SSML voice gender (optional)
			voice: {
				languageCode: 'vi-VN',
				ssmlGender: 'FEMALE',
				name: 'vi-VN-Wavenet-A',
			},
			// select the type of audio encoding
			audioConfig: { audioEncoding: 'MP3' },
		});
		resolve(response.audioContent as string);
	});
}

client.login(process.env.TOKEN);
