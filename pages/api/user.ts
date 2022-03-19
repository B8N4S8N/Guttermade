import withSession from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export type User = {
  id: string
  address: string
  isLoggedIn: boolean
}

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  console.log('req', req)
  if (req.session.siwe) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      id: req.session.siwe.address,
      address: req.session.siwe.address,
      // ...req.session.siwe,
      isLoggedIn: true,
    })
  } else {
    res.json({
      id: '',
      address: '',
      isLoggedIn: false,
    })
  }
}

export default withSession(userRoute)
