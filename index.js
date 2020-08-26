const { Client, RichEmbed } = require("discord.js");
const self = new Client();

const commands = require("./bot/commands.js");
const gmanager = require("./bot/games/gamemanager.js");

const express = require("express");
const request = require('request');

var customHeaderRequest = request.defaults({
    headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0'}
})
const app = express();

var secrets;

try {
  secrets = require("./secrets.js");
} catch (ex) {
  console.log("secrets.js could not be found, using process.env");
}

const prefix = "?";
module.exports.gameRunning = false;

self.on("ready", () => {
  console.log("Bot is now online");
  self.user.setActivity("you again~", { type: "LISTENING" });
});

self.on("message", message => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    var msg = message.content.substring(1);
    var args = msg.split(" ");
    var cmd = args.shift();

    if (!this.gameRunning) {
      if (commands.commands[cmd]) {
        commands.commands[cmd].onCall(message, args);
      }
    } else if (cmd === "stop") {
      this.gameRunning = false;
      gmanager.kill();
      message.channel.send("Game stopped.");
    }
  }
});

self.on("messageReactionAdd", (reaction, user) => {
  if (this.gameRunning) {
    gmanager.handlereact(reaction, user);
  }
});

module.exports.sendMsg = function(content, channel) {
  channel.send(content);
};

if (process.env.TOKEN) {
  self.login(process.env.TOKEN);
} else {
  self.login(secrets.getToken());
}

//Actually show the Webpage
app.use(express.static("public"));
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
