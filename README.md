<p align="center">
  <a href="https://demo.punk3.xyz">
    <img src="./public/logo-full.png" height="96">
    <h3 align="center">PUNK3</h3>
  </a>
</p>

<p align="center">
  Web3 blogging platform for crypto punks
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#development"><strong>Development</strong></a> ·
  <a href="https://demo.punk3.xyz/"><strong>Demo</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> .
  <a href="#community"><strong>Community</strong></a>
</p>
<br/>

## Introduction

Punk3 is a web3-based blogging platform for crypto punks.

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
# Using the PlanetScale CLI, create a new database called punk3.
pscale db create punk3

# Next, connect to the database branch:
pscale connect punk3 main

# In a different terminal window, use the db push command to push the schema defined in prisma/schema.prisma:
npx prisma db push

## Now that the initial schema has been added, promote your main branch to production:
pscale branch promote punk3 main
```

Get PlanetScale [connection](https://docs.planetscale.com/concepts/connection-strings)

[Deploy to Vercel](https://vercel.com/guides/nextjs-multi-tenant-application#5.-deploy-to-vercel)

## Built on open source

Punk3 is built on following awesome open source projects:

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

## Contributing

[Open an issue](https://github.com/punk3lab/punk3/issues) if you believe you've encountered a bug with the starter kit.

## Community

[Join the discord](https://discord.gg/Ck5uxsMPKj) to get help, ask questions, and discuss features.

```

```
