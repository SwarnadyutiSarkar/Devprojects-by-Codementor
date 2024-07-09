import { Client, Intents, MessageAttachment, MessageEmbed } from 'discord.js';
import axios from 'axios';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '!'; // Change this as needed

client.once('ready', () => {
    console.log('Bot is ready.');
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (command === 'generateqr') {
        const text = args.join(' ');

        // Generate QR code URL with Google's Chart API
        const apiUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(text)}&chs=300x300`;

        try {
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

            // Create a Discord MessageAttachment from the response data
            const attachment = new MessageAttachment(response.data, 'qrcode.png');

            // Send the QR code image as a message attachment
            await message.channel.send({ files: [attachment] });
        } catch (error) {
            console.error('Error generating QR code:', error);
            message.reply('Error generating QR code.');
        }
    } else if (command === 'generateqradvanced') {
        // Example: !generateqradvanced <text> <size> <color>
        const text = args[0];
        const size = args[1] || '300x300'; // Default size if not provided
        const color = args[2] || '000000'; // Default color if not provided

        // Generate QR code URL with size and color parameters
        const apiUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(text)}&chs=${size}&chco=${color}`;

        try {
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

            // Create a Buffer from the response data
            const buffer = Buffer.from(response.data, 'binary');

            // Create a Discord MessageAttachment from the Buffer
            const attachment = new MessageAttachment(buffer, 'qrcode.png');

            // Create an embed message to display QR code details
            const embed = new MessageEmbed()
                .setTitle('Generated QR Code')
                .setDescription(`Text: ${text}\nSize: ${size}\nColor: ${color}`)
                .setColor('#00FF00')
                .setImage(`attachment://qrcode.png`);

            // Send the QR code image with embed message
            await message.channel.send({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error generating QR code:', error);
            message.reply('Error generating QR code.');
        }
    }
});

client.login('YOUR_BOT_TOKEN');
