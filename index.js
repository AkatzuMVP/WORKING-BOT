require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// =======================
// CLIENT
// =======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// =======================
// SLASH COMMANDS (REGISTER ONCE)
// =======================
const slashCommands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  new SlashCommandBuilder()
    .setName("newmatch")
    .setDescription("Post a new match")
    .addUserOption(o =>
      o.setName("user1")
        .setDescription("First matched user")
        .setRequired(true)
    )
    .addUserOption(o =>
      o.setName("user2")
        .setDescription("Second matched user")
        .setRequired(true)
    )
    .addUserOption(o =>
      o.setName("cupid")
        .setDescription("Cupid")
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

// =======================
// READY EVENT
// =======================
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    const GUILD_ID = "1395724919903354912";

await rest.put(
  Routes.applicationGuildCommands(client.user.id, GUILD_ID),
  { body: slashCommands }
);

    console.log("✅ Slash commands registered.");
  } catch (err) {
    console.error("❌ Slash command registration failed:", err);
  }
});

// =======================
// JOIN MESSAGE EVENT (UNCHANGED)
// =======================
client.on("guildMemberAdd", async member => {
  const messages = [
    "Answered the call of adventure!! <3",
    "Just fell from the sky!! <3",
    "I'm here!! <3",
    "Joined the party!! <3",
    "Arrived in a buggati!! <3",
    "Ate and joined the lobby!! <3",
    "Loves tea!! <3",
    "Loves coffee!! <3",
    "Spooked into the lobby!! <3",
    "Joined the lobby to bring happiness to everyone around!! <3",
    "A true master of battles!! <3",
    "Entered the realm of legends!! <3",
    "Walked into the lobby with quiet power!! <3",
    "Loaded in with unmatched energy!! <3",
    "Arrived ready for glory!! <3",
    "Stepped into the battlefield!! <3",
    "Joined the lobby with purpose!! <3",
    "Entered the world of heroes!! <3",
    "Materialized out of thin air!! <3",
    "Teleported into the lobby!! <3"
  ];

  const pick = messages[Math.floor(Math.random() * messages.length)];
  const channel = member.guild.channels.cache.get("1396185862089474138");
  if (!channel) return;

  channel.send(`${member} ${pick}`);
});

// =======================
// SLASH COMMAND HANDLER
// =======================
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // /ping
  if (interaction.commandName === "ping") {
    return interaction.reply("Pong!");
  }

  // /newmatch
  if (interaction.commandName === "newmatch") {
    const user1 = interaction.options.getUser("user1");
    const user2 = interaction.options.getUser("user2");
    const cupid = interaction.options.getUser("cupid");

    const embed = {
      color: 0x0e0e11,
      description:
`:p_bow04~2:   **NEW MATCH.ᐟ**


⠀ ⠀ ⠀ ⠀ ${user1} ♡ match · ${user2}   :p_flower21:


**cupid:** ${cupid}   :p_heart05~2:`
    };

    return interaction.reply({ embeds: [embed] });
  }
});

// =======================
// PREFIX COMMANDS (m!)
// =======================
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("m!")) return;

  const args = message.content.split(" ").slice(1);
  const command = message.content.split(" ")[0].toLowerCase();

  // m!rename
  if (command === "m!rename") {
    if (!args.length) return message.reply("❌ Provide a new channel name.");

    const newName = args.join("-").toLowerCase();
    try {
      await message.channel.setName(newName);
      return message.reply(`✅ Channel renamed to **${newName}**`);
    } catch {
      return message.reply("❌ I can’t rename this channel.");
    }
  }

  // m!ban
  if (command === "m!ban") {
    if (!message.member.permissions.has("BanMembers"))
      return message.reply("❌ You don’t have permission to ban.");

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mention a user to ban.");

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await user.ban({ reason });
      return message.reply(
        `🔨 **${user.user.tag}** was banned.\n**Reason:** ${reason}`
      );
    } catch {
      return message.reply("❌ I couldn’t ban this user.");
    }
  }

  // m!tm (timeout)
  if (command === "m!tm") {
    if (!message.member.permissions.has("ModerateMembers"))
      return message.reply("❌ You don’t have permission to timeout.");

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mention a user.");

    const time = args[1];
    if (!time) return message.reply("❌ Provide time (10m / 1h / 1d).");

    const reason = args.slice(2).join(" ") || "No reason provided";

    const timeMap = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const unit = time.slice(-1);
    const amount = parseInt(time.slice(0, -1));

    if (!timeMap[unit] || isNaN(amount))
      return message.reply("❌ Invalid time format.");

    try {
      await user.timeout(amount * timeMap[unit], reason);
      return message.reply(
        `⏳ **${user.user.tag}** timed out for **${time}**\n**Reason:** ${reason}`
      );
    } catch {
      return message.reply("❌ I couldn’t timeout this user.");
    }
  }
});

// =======================
// TOKEN CHECK + LOGIN
// =======================
if (!process.env.TOKEN) {
  console.error("❌ TOKEN missing in environment variables.");
  process.exit(1);
}

client.login(process.env.TOKEN);
