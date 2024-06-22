import MongoStore from "connect-mongo";
import session from "express-session";


export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.EXPRESS_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  },
});
