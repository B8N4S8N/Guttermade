// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  cookieName: "siwe",
  password: "complex_password_at_least_32_characters_long",
  cookieOptions: {
    secure: process.env.NODE_ENV == "production",
  },
};

export default function withSession(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}
