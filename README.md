
<p align="center">
  <a href="https://guttermade-store.vercel.app/">
    <img src="https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/298663900_1074036903505410_8493396802770755566_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=zdJwqaYZG1QAX9R7gAC&_nc_ht=scontent-sea1-1.xx&oh=00_AT-T0wCw-qcWSoJUBQ-BliDmh7e1cbm3dSEL3osno2mHrQ&oe=63087DD3" height="96">
    <h3 align="center">GutterMade</h3>
  </a>
</p>

<p align="center">
  Welcome to the world's first fully user owned De-Commerce platform, supported by sales from the world's first fully open source yet trademarked brand.
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#development"><strong>Development</strong></a> ·
  <a href="https://guttermade-store.vercel.app//"><strong>Demo</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> .
  <a href="#community"><strong>Community</strong></a>
</p>
<br/>

## Introduction

GutterMade is the world's first open source, trademarked, brand that wants to be fully owned by you.  The user.  When you connect with us you connect with a worldwide network of quality curated manufacturers and distributors of quality products.  Every item is made upon order, so every piece is custom made for your customer. 

Multi-tenant applications serve multiple customers across different subdomains/custom domains with a single unified codebase.

## Features

- **Custom domains**: Subdomain and custom domains support with [Edge Functions](https://vercel.com/features/edge-functions) and the [Vercel Domains API](https://domains-api.vercel.app/).
- **IPFS**: Use [IPFS](https://ipfs.io/) to store your content and images.
- **Sign-In with Ethereum**: [Sign-In with Ethereum](https://login.xyz/) is a new form of authentication that enables users to control their digital identity with their Ethereum account and ENS profile instead of relying on a traditional intermediary.
- **Lens Social Graph**: Use [Lens Protocol](https://lens.dev/) to create a new decentralized social graph.

## Development

### Run locally

Install dependencies

```sh
yarn --ignore-engines
```

Config environment variables

```sh
# Must set valid values for
# - DATABASE_URL
# - SECRET
# - NEXT_PUBLIC_INFURA_PROJECT_ID
# - NEXT_PUBLIC_INFURA_SECRET
# - POLYGON_RPC
# - PRIVATE_KEY
mv .env.example .env
```

Init database

```sh
npx prisma db push
```

Run in development mode

```sh
yarn dev
```

### Run on Vercel

Install dependencies

```sh
yarn --ignore-engines
```

Set up your MySQL database(ex: PlanetScale)

```sh
# Prerequisite: You need to have the PlanetScale CLI installed. https://docs.planetscale.com/concepts/planetscale-environment-setup
# Create a new account with PlanetScale.
# Using the PlanetScale CLI, create a new database called guttermade.
pscale db create guttermade

# Next, connect to the database branch:
pscale connect guttermade main

# In a different terminal window, use the db push command to push the schema defined in prisma/schema.prisma:
npx prisma db push

## Now that the initial schema has been added, promote your main branch to production:
pscale branch promote guttermade main
```

Get PlanetScale [connection](https://docs.planetscale.com/concepts/connection-strings)

[Deploy to Vercel](https://vercel.com/guides/nextjs-multi-tenant-application#5.-deploy-to-vercel)

## Built on open source

guttermade is built on following awesome open source projects:

- [Next.js](https://nextjs.org/) as the React framework
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [Prisma](https://prisma.io/) as the ORM for database access
- [PlanetScale](https://planetscale.com/) as the database (MySQL)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Vercel](http://vercel.com/) for deployment
- [Ethers](https://docs.ethers.io/v5/) for Ethereum interaction
- [Wagmi](https://wagmi.sh/) as React Hooks library for Ethereum
- [IPFS](https://ipfs.io/) for storing images and content
- [Lens](https://lens.dev/) as the decentralized social graph
- [Apollo](https://www.apollographql.com/) for GraphQL
- [SWR](https://swr.now.sh/) for data fetching
- [Stripe](https://stripe.com/) for fiat payment processing and card issuing
- [SnipCart](https://snipcart.com/) for automatic cart management
- [Balancer](https://docs.balancer.fi/products/balancer-pools/managed-pools) for DAO liquidty management with AAVE boosted automated index funds with Circuit Breakers to protect from malicious/compromised tokens
- [AAVE](https://aave.com/) for lending and borrowing
- [Polygon](https://polygon.technology/) for blockchain speed, performance, and privacy
- [Chainlink](https://chain.link/) for randomness, oracles, and off chain data in order to automate transactions and facilitate buyers/sellers lotteries 
- [Headlessdropshipping](https://headlessdropshipping.com/) for the store stack
- []()
- []()
## Contributing

[Open an issue](https://github.com/b8n4s8n/guttermade/issues) if you believe you've encountered a bug with the starter kit.

## Community

[Join the discord](https://discord.gg/hSpfBehp) to get help, ask questions, and discuss features.
