import { load, LoadMode } from 'ts-import';
import { ApplicationCommandsAPI } from '@discordjs/core/http-only';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';

/**
 * @param {any[]} locals
 * @param {any[]} globals
 */
function areEqualCommands(locals, globals) {
  if (locals.length !== globals.length) return false;
  for (let i = 0; i < locals.length; i++) {
    if (locals[i].default_member_permissions !== globals[i].default_member_permissions)
      return false;
    if (locals[i].description !== globals[i].description) return false;
    if (locals[i].dm_permission !== globals[i].dm_permission) return false;
    if (locals[i].name !== globals[i].name) return false;
    if (locals[i].options !== globals[i].options) return false;
  }
  return true;
}

async function deploy() {
  const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
  const api = new ApplicationCommandsAPI(rest);

  console.log('Importing commands...');
  /** @type {{ guild: string | undefined, data: SlashCommandBuilder, execute: Function }[]} */
  const commandList = Object.values(
    await load('server/utils/discord/commandIndex.ts', { mode: LoadMode.Compile, useCache: false }),
  );
  const globalDeploy = [];
  const guildsDeploy = {};

  for (const cmd of commandList) {
    if (cmd.guild) {
      if (!guildsDeploy[cmd.guild]) guildsDeploy[cmd.guild] = [];
      guildsDeploy[cmd.guild].push(cmd.data.toJSON());
    } else globalDeploy.push(cmd.data.toJSON());
    console.log(`- ${cmd.data.name}`);
  }

  console.log('\nDeploying global commands...');
  const onlineGlobal = await api.getGlobalCommands(process.env.DISCORD_CLIENT_ID);
  if (globalDeploy.length && areEqualCommands(globalDeploy, onlineGlobal))
    console.log(onlineGlobal.map(c => `${c.name}: ${c.id}`).join('\n'));
  else
    console.log(
      (await api.bulkOverwriteGlobalCommands(process.env.DISCORD_CLIENT_ID, globalDeploy))
        .map(c => `${c.name}: ${c.id}`)
        .join('\n'),
    );

  console.log('\nDeploying guilds commands...');
  for (const [guildId, cmds] of Object.entries(guildsDeploy)) {
    console.log(`> ${guildId}`);
    const onlineGuild = await api.getGuildCommands(process.env.DISCORD_CLIENT_ID, guildId);
    if (areEqualCommands(cmds, onlineGuild))
      console.log(onlineGuild.map(c => `${c.name}: ${c.id}`).join('\n'));
    else
      console.log(
        (await api.bulkOverwriteGuildCommands(process.env.DISCORD_CLIENT_ID, guildId, cmds))
          .map(c => `${c.name}: ${c.id}`)
          .join('\n'),
      );
  }

  console.log('\nDeployment complete!');
}

deploy();
