import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET"];
for (const name of required) {
  if (!process.env[name]?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

const clientUrls = [
  ...new Set(
    (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => new URL(url).origin),
  ),
];

if (clientUrls.length === 0) {
  throw new Error("CLIENT_URL must contain at least one valid origin");
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrls,
  nodeEnv: process.env.NODE_ENV || "development",
};
