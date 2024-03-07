import { REST } from '@discordjs/rest';
import { ButtonBuilder } from '@discordjs/builders';
import {
  APIMessageComponentInteraction,
  InteractionsAPI,
  WebhooksAPI,
} from '@discordjs/core/http-only';

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN as string);
const api = new InteractionsAPI(rest, new WebhooksAPI(rest));

export default {
  data: new ButtonBuilder().setCustomId('dummy'),

  async execute(interaction: APIMessageComponentInteraction) {
    return 'dummy';
  },
};
