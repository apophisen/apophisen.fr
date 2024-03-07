import { connect } from 'mongoose';

export default defineNitroPlugin(async () => {
  if (!process.env.MONGODB_URL) return console.log('No MongoDB URL provided...');
  try {
    await connect(process.env.MONGODB_URL);
  } catch (e) {
    console.error(e);
  }
});
