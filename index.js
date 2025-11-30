require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

// Create client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers // REQUIRED for join event
  ]
});

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
].map(command => command.toJSON());

// READY EVENT
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    
    console.log('Successfully registered application commands globally.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

// JOIN MESSAGE EVENT
client.on("guildMemberAdd", async (member) => {

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

  // Replace CHANNEL ID here
  const channel = member.guild.channels.cache.get("1396185862089474138");

  if (!channel) return;

  channel.send(`${member} ${pick}`);
});

// Slash command handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

// TOKEN MISSING CHECK
if (!process.env.TOKEN) {
  console.error(
    'ERROR: TOKEN environment variable is not set! Please add your Discord bot token in Railway as a variable named TOKEN.'
  );
  process.exit(1);
}

// LOGIN
client.login(process.env.TOKEN);
