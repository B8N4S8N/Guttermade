import { SiweMessage } from 'siwe'
import withSession from 'lib/session'
import prisma from '@/lib/prisma'

const handler = async (req, res) => {
  const { method } = req
  switch (method) {
    case 'POST':
      try {
        // verify signature
        const { message, signature } = req.body
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)
        req.session.siwe = fields
        await req.session.save()

        // create user
        const { address } = fields
        const user = await prisma.user.upsert({
          where: {
            id: address,
          },
          update: {},
          create: {
            id: address,
            name: address,
            address: address,
          },
        })
        res.status(200).json({ ok: true })
      } catch (_error) {
        res.status(400).json({ ok: false })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSession(handler)
