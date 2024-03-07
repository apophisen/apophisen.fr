import { REST } from '@discordjs/rest';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import {
  APIChatInputApplicationCommandInteraction,
  InteractionsAPI,
  MessageFlags,
  WebhooksAPI,
} from '@discordjs/core/http-only';

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN as string);
const api = new InteractionsAPI(rest, new WebhooksAPI(rest));

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mesurer le temps de réponse du bot.'),

  async execute(interaction: APIChatInputApplicationCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Pong !')
      .setDescription('Calcul du temps de réponse...');

    const start = Date.now();
    await api.editReply(process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID as string, interaction.token, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });

    embed.setDescription(`Temps de réponse mesuré : \`${Date.now() - start}ms\``);
    api.editReply(process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID as string, interaction.token, {
      embeds: [embed.toJSON()],
    });
  },
};
