// This is a test

const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
// const rpc = require('discord-rich-presence')('887865542982107207');
const {token} = require('./config.js');
const {prefix} = require('./config.js');
const {Player} = require('discord-player');
const {statusp} = require('./config.js');
const {statusa} = require('./config.js');


const client = new Client();
client.commands = new Discord.Collection();


var http = require("http");
setInterval(function() {
    http.get(process.env.MASTERPINGURL);
    http.get(process.env.STAGEPINGURL);
}, 300000); // every 5 minutes (300000)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client, {
});

client.on('ready' , (queue, track) =>{
  console.log('Bot Is Active');
  client.user.setStatus('online');

  console.log('bot status', client.user.presence.status);


});


player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
    var tName = track.title;
    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();
    var tProg = perc.end;
    client.user.setActivity(statusp+tName+" | "+"Song Length - "+tProg+statusa,{ type: 'LISTENING' });
//     var tProgNo = tProg.split(':');
//     if (tProg.replace(/[^0-9\.]+/g, "") <= 6059){tProgNo.unshift('00');}
//     var tProgMill = (+tProgNo[0]) * 60 * 60 + (+tProgNo[1]) * 60 + (+tProgNo[2]);
//     rpc.setActivity({
//         state: '**listening to**',
//         details: tName,
//         endTimestamp: Date.now() + tProgMill,
//         largeImageKey: 'snek_large',
//         smallImageKey: 'snek_small',
//         instance: true,
//     });
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on('botDisconnect', queue => {
    queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
    var tName = "Nothing"
    client.user.setActivity(tName, { type: 'LISTENING' });
});

player.on('channelEmpty', quetrue => {
    queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
    var tName = "Nothing"
    client.user.setActivity(tName, { type: 'LISTENING' });
});

player.on('queueEnd', queue => {
    queue.metadata.send('✅ | Queue finished!');
    var tName = "Nothing"
    client.user.setActivity(tName, { type: 'LISTENING' });
});

client.once('ready', async () => {
  console.log('Ready!');
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (message.content === prefix+"deploy") {
      await message.guild.commands.set(client.commands).then(() => {
        message.reply("Deployed!");
      })
      .catch((err) => {
        message.reply("Could not deploy commands! Make sure the bot has the application.commands permission!");
        console.error(err)
      });
  }
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'There was an error trying to execute that command!',
    });
  }
});

client.login(token);
// client.then(client.user.setPresence({status: "dnd"}));

// console.log('Spectre Is Now Online!');
// // client.user.setPresence({status: "dnd"}); //sets presence
// // client.user.setActivity('Made By -Nightmare <3#9999', { type: 'WATCHING' }); //sets activity


/**WebUI/
/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";
/**
 *  App Configuration
 */

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.status(200).send("6.2247994599048051078089497635252389898021054619379211559650918939973462245707744475559904786027702971385782601851195875467820704381094028983314168448539510747554537589358396835902771469374746308347923e-339188727508712");
});
/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
