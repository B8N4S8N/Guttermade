import { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      res.status(200).json({ nonce: generateNonce() });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
