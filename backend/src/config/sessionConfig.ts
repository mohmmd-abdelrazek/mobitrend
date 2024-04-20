import session from "express-session";
// import IORedis from "ioredis"
// import RedisStore from "connect-redis";
// const redisClient = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
// redisClient.connect().catch(console.error);

export const sessionMiddleware = session({
  // store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.EXPRESS_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  },
});
