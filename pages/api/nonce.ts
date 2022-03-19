import withSession from '@/lib/session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateNonce } from 'siwe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET':
      req.session.nonce = generateNonce()
      await req.session.save()
      res.setHeader('Content-Type', 'text/plain')
      res.send(req.session.nonce)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSession(handler)
