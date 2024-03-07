import { REST } from '@discordjs/rest';
import { InteractionResponseType, verifyKey } from 'discord-interactions';
import {
  APIButtonComponentWithCustomId,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  InteractionType,
  InteractionsAPI,
  MessageFlags,
  WebhooksAPI,
} from '@discordjs/core/http-only';
import * as components from '../utils/discord/componentIndex';
import * as commands from '../utils/discord/commandIndex';

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN as string);
const api = new InteractionsAPI(rest, new WebhooksAPI(rest));

export default defineEventHandler(async event => {
  const interaction: APIInteraction = await readBody(event);
  const signature = event.headers.get('x-signature-ed25519');
  const timestamp = event.headers.get('x-signature-timestamp');

  if (
    !signature ||
    !timestamp ||
    !verifyKey(
      JSON.stringify(interaction),
      signature,
      timestamp,
      process.env.DISCORD_PUBLIC_KEY as string,
    )
  )
    return new Response('Bad request signature', { status: 401 });

  switch (interaction.type) {
    case InteractionType.ApplicationCommand:
      await api.defer(interaction.id, interaction.token, { flags: MessageFlags.Ephemeral });
      Object.values(commands)
        .find(c => c.data.name === interaction.data.name)
        ?.execute(interaction as APIChatInputApplicationCommandInteraction);
      break;
    case InteractionType.MessageComponent:
      await api.deferMessageUpdate(interaction.id, interaction.token);
      Object.values(components)
        .find(
          c =>
            (c.data.data as APIButtonComponentWithCustomId).custom_id ===
            interaction.data.custom_id,
        )
        ?.execute(interaction);
      break;
    default:
      return { type: InteractionResponseType.PONG };
  }
});
