import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    // Set transaction to false if using a standalone MongoDB instance (no replica set).
    // Defaults to false unless MONGODB_TRANSACTIONS is explicitly "true" in env.
    transaction: process.env.MONGODB_TRANSACTIONS === "true",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "Job Seeker",
        input: true,
      },
    },
  },
});
