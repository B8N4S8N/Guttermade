import { createSite, deleteSite, getSite, updateSite } from "@/lib/api";
import { HttpMethod } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { server } from "../../config";
import { User } from "pages/api/user";

export default async function site(req: NextApiRequest, res: NextApiResponse) {
  const user: User = await (await fetch(`${server}/api/user`)).json();
  if (!user) {
    res.status(401).end();
    return;
  }

  switch (req.method) {
    case HttpMethod.GET:
      return getSite(req, res, user);
    case HttpMethod.POST:
      return createSite(req, res);
    case HttpMethod.DELETE:
      return deleteSite(req, res);
    case HttpMethod.PUT:
      return updateSite(req, res);
    default:
      res.setHeader("Allow", [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
        HttpMethod.PUT,
      ]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
