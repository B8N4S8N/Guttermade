import withSession from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types";

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.siwe) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      id: req.session.siwe.address,
      address: req.session.siwe.address,
      // ...req.session.siwe,
      isLoggedIn: true,
    });
  } else {
    res.json({
      id: "",
      address: null,
      isLoggedIn: false,
    });
  }
}

export default withSession(userRoute);
