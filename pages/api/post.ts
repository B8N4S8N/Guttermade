import { createPost, deletePost, getPost, updatePost } from "@/lib/api";
import { HttpMethod, User } from "@/types";
import { server } from "config";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const user: User = await (await fetch(`${server}/api/user`)).json();
  if (!user) {
    res.status(401).end();
    return;
  }
  switch (req.method) {
    case HttpMethod.GET:
      return getPost(req, res, user);
    case HttpMethod.POST:
      return createPost(req, res);
    case HttpMethod.DELETE:
      return deletePost(req, res);
    case HttpMethod.PUT:
      return updatePost(req, res);
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
