const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {token} = require('./config.json');
const {Player} = require('discord-player');

const client = new Client();
client.commands = new Discord.Collection();

client.on('ready' , () =>{
  console.log('Bot Is Active');
  client.user.setStatus('online')
  client.user.setActivity('**${track.title}**', { type: 'LISTENING' });

  console.log('bot status', client.user.presence.status);


});

var http = require("http");
setInterval(function() {
    http.get("http://pogchamp-rythm-bot.herokuapp.com");
}, 300000); // every 5 minutes (300000)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | Queue finished!');
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

  if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
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
  res.status(200).send("WHATABYTE: Food For Devs");
});
/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
