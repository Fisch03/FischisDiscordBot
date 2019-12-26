﻿const main = require('../index.js');

const embeds = require('./embeds.js');
const games = require('./games/gamemanager.js');
const jsonhandler = require('./json-handler.js');

const { RichEmbed } = require('discord.js');

const { fetchSubreddit, fetchRandomSubredditName } = require('fetch-subreddit');

module.exports = {
  getActionByCommand:function(cmd, args, channel) {

    /**
    FUN
    **/
    switch(cmd) {
      case "ping":
        channel.send("Pong!");
        break;

      case "howgay":
        var value = Math.floor(Math.random() * 101);
        var name = args[0];
        channel.send(name + " is " + value + "% gay :gay_pride_flag: ");
        break;

      case "weeblv":
        var value = Math.floor(Math.random() * 101);
        var name = args[0];
        channel.send(embeds.lvlEmbed(name, value));
        break;

      case "ratewaifu":
        var value = Math.floor(Math.random() * 11);
        var name = args[0];
        channel.send("I give " + name + " a waifu rating of " + value + "/10");
        break;

      case "catgirl":
	    jsonhandler.getCatgirl(channel);
        break;

      case "lewdcatgirl":
      if (channel.nsfw) {
        jsonhandler.getLewdCatgirl(channel);
      } else {
        channel.send(":warning: Channel must be an NSFW channel");
      }
      break;

  	  case "cat":
  	    jsonhandler.getCat(channel);
  	    break;
	  case "catbomb":
	    jsonhandler.getCat(channel);
		jsonhandler.getCat(channel);
		jsonhandler.getCat(channel);
		jsonhandler.getCat(channel);
		jsonhandler.getCat(channel);
		break;

      case "lenny":
        channel.send("( ͡° ͜ʖ ͡°)");
        break;

      case "rlenny":
        var lennyarr = ["( ͡° ͜ʖ ͡°)","(づ ◔ ͜ʖ ◔ )づ","(╭☞ ・ ͜つ ・ )╭☞","( ◕ ᗜ ◕ )","⤜( ʘ _ ʘ )⤏","ಠ _ ಠ","( ⌐■ _ ■ )","ʢ ◉ ᴥ ◉ ʡ",
                        "(ᴗ ͜ʖ ᴗ)","(⟃ ͜ʖ ⟄)","( ‾ ʖ̫ ‾)","(͠≖ ͜ʖ͠≖)","( ͡° ʖ̯ ͡°)","ʕ ͡° ʖ̯ ͡°ʔ","( ͡° ل͜ ͡°)","( ͠° ͟ʖ ͡°)","( ͠° ͟ʖ ͠°)","( ͡~ ͜ʖ ͡°)",
                        "( ͡o ͜ʖ ͡o)","( ͡◉ ͜ʖ ͡◉)","( ͡☉ ͜ʖ ͡☉)","( ͡° ͜V ͡°)","ʕ ͡° ͜ʖ ͡°ʔ","( ͡ᵔ ͜ʖ ͡ᵔ )","( ͡° ͜ʖ ͡ °)","(☭ ͜ʖ ☭)","(=^-ω-^=)"];
        var value = Math.floor(Math.random() * (lennyarr.length + 1));
        channel.send(lennyarr[value]);
        break;

      /**
      GAMES
      **/
      case "rps":
        var steinarr = ["Stone","Paper","Scissors"];
        var value = Math.floor(Math.random() * 3);
        var bchoice = steinarr[value].toLowerCase();
        var pchoice = args[0].toLowerCase();

        var msg = "Yours: " + args[0] + "\nMine: " + steinarr[value] +  "\n";

        console.log(bchoice, pchoice);

        if (bchoice === pchoice)
          msg += "Draw!";
        if(bchoice == "stone") {
          if(pchoice == "paper")
            msg += "You win!";
          if(pchoice == "scissors")
            msg += "You lost!";
        } else if(bchoice == "paper") {
          if(pchoice == "scissors")
            msg += "You win!";
          if(pchoice == "stone")
            msg += "You lost!";
        } else {
          if(pchoice == "stone")
            msg += "You win!";
          if(pchoice == "paper")
            msg += "You lost!";
        }

        channel.send(msg);
        break;

      case "start":
        games.init(args, channel);
        main.gameRunning = true;
        break;

      /**
      REDDIT
      **/
      case "sub":
        var content = "";
        fetchSubreddit(args[0].toLowerCase())
          .then(function (urls) {
            content = jsonhandler.RedditJSON(urls, args[1]);
            channel.send(embeds.RedditEmbed(args[0], content, args[1]));
          })
          .catch((err) => console.error(err));
        break;

      case "rsub":
        var subnamestr;
        var subname = "";
        var content = "";
        fetchRandomSubredditName(1)
          .then(function (subreddits) {
            subnamestr = JSON.stringify(subreddits, null, 2);;
            subnamestr = subnamestr.split('"name": "');
            subnamestr = subnamestr[1].split("/");
            subname = subnamestr[0];
          })
          .then(function() {
            fetchSubreddit(subname.toLowerCase())
            .then(function (urls) {
              content = jsonhandler.RedditJSON(urls, args[0]);
              channel.send(embeds.RedditEmbed(subname, content, args[0]));
            })
            .catch((err) => console.error(err))
          .catch((err) => console.error(err));
          })
        break;

      /**
      HELP
      **/
      case "help":
        channel.send(embeds.HelpEmbed());
        break;

      case "gamehelp":
        channel.send(embeds.GamehelpEmbed());
        break;

      /**
      INFORMATION
      **/
      case "github":
        channel.send("GitHub Link: https://github.com/Fisch03/Hanako-Discord");
      break;

       /**
      DEV
      **/
      case "restart":
        channel.send("Bot is being restarted...");
        console.log("Bot is restarting");
        setTimeout(function() {process.exit(1).catch((err) => console.error(err));}, 1000);
      break;
    }
  }
}
