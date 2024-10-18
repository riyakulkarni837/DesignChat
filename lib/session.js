// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD, //TODO - AN ENV VARIABLE
  cookieName: "designchat",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  ttl: 60 * 60 * 4, //expires after 4 hours
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4 - 60,
  },
};
