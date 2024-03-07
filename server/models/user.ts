import { model, Schema } from 'mongoose';

const schema = new Schema(
  {
    _id: { type: Schema.Types.String, required: true }, // Discord id
    avatar: { type: Schema.Types.String, required: true }, // Discord avatar
    discordAccess: {
      type: {
        _id: false, // No _id for subdocument
        expiresAt: { type: Schema.Types.BigInt, required: true },
        iv: { type: Schema.Types.String, required: true },
        tag: { type: Schema.Types.String, required: true },
        token: { type: Schema.Types.String, required: true },
      },
      required: true,
    },
    discordRefreshToken: { type: Schema.Types.String, required: true },
    sessionToken: { type: Schema.Types.String, required: true },
    username: { type: Schema.Types.String, required: true }, // Discord username
  },
  { versionKey: false }, // Not needed as there is only one write source
);

export default model('User', schema, 'Users');
