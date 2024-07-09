"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '!'; // Change this as needed
client.once('ready', () => {
    console.log('Bot is ready.');
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (command === 'generateqr') {
        const text = args.join(' ');
        // Generate QR code URL with Google's Chart API
        const apiUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(text)}&chs=300x300`;
        try {
            const response = yield axios_1.default.get(apiUrl, { responseType: 'arraybuffer' });
            // Create a Discord MessageAttachment from the response data
            const attachment = new discord_js_1.MessageAttachment(response.data, 'qrcode.png');
            // Send the QR code image as a message attachment
            yield message.channel.send({ files: [attachment] });
        }
        catch (error) {
            console.error('Error generating QR code:', error);
            message.reply('Error generating QR code.');
        }
    }
    else if (command === 'generateqradvanced') {
        // Example: !generateqradvanced <text> <size> <color>
        const text = args[0];
        const size = args[1] || '300x300'; // Default size if not provided
        const color = args[2] || '000000'; // Default color if not provided
        // Generate QR code URL with size and color parameters
        const apiUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(text)}&chs=${size}&chco=${color}`;
        try {
            const response = yield axios_1.default.get(apiUrl, { responseType: 'arraybuffer' });
            // Create a Buffer from the response data
            const buffer = Buffer.from(response.data, 'binary');
            // Create a Discord MessageAttachment from the Buffer
            const attachment = new discord_js_1.MessageAttachment(buffer, 'qrcode.png');
            // Create an embed message to display QR code details
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Generated QR Code')
                .setDescription(`Text: ${text}\nSize: ${size}\nColor: ${color}`)
                .setColor('#00FF00')
                .setImage(`attachment://qrcode.png`);
            // Send the QR code image with embed message
            yield message.channel.send({ embeds: [embed], files: [attachment] });
        }
        catch (error) {
            console.error('Error generating QR code:', error);
            message.reply('Error generating QR code.');
        }
    }
}));
client.login('YOUR_BOT_TOKEN');
