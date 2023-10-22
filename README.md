# Onboardr

Experience onboarding innovation with Onboardr. Generate pre-calculated blockchain addresses using socials or email, initiate messaging, payments, and rewards for newcomers. The power to connect before they're onboarded.

## Overview

Onboardr revolutionizes blockchain onboarding by enabling users to generate pre-calculated addresses for newcomers through socials, email, or phone. Send messages, payments, reward through simple intents and more before they even join the blockchain. Seamlessly invite users via a shared link. Allowing both businesses and individuals to join a crypto jargon free ecosystem. For entities and businesses, on-chain marketing can be challenging. Onboardr enables companies to invite users to the blockchain and directly engage with them through messaging, rewards, and payments, making on-chain marketing a breeze for businesses and helping them to engage users with their rewards.

## Motivation behind Onboardr? 

1. **Complex Onboarding Process:** Traditional onboarding processes for blockchain platforms can be complex and intimidating for new users. Users may need to create accounts and navigate various technical steps to get started.
2. **Marketing Challenges:** On-chain marketing for entities and businesses can be difficult due to the lack of direct engagement channels and the need for users to adopt and adapt to blockchain technology.
3. **User Engagement:** Keeping users engaged with blockchain technology is challenging, as many users may not fully understand its benefits or how to interact with it.

## The Solution

We built Onboardr keeping in mind these problems and here is what we came up with:

1. **Pre-Calculated Addresses with Lit Claimables**:

Onboardr uses Lit Claimables, an advanced protocol that enables the pre-calculation of deterministic addresses based on user identities such as email, phone, or social accounts. This feature streamlines the onboarding process, allowing users to generate blockchain addresses for newcomers before they even join the blockchain.

2. **Direct Communication**:
   
Users can initiate direct messaging with newcomers through the platform. This feature streamlines the process of reaching out to potential blockchain users who are not yet on-chain.

4. **Payments and Rewards**:

Onboardr facilitates the initiation of payments and rewards for newcomers. Users can send cryptocurrencies or non-fungible tokens (NFTs) to individuals who have not yet created their on-chain accounts.

## The Tech Behind it

At it's core , Onboardr has LIT Claimables, which enables the pre-calculation of deterministic addresses based on user identities such as email, phone, or social accounts ( Google or Discord ) . This feature simplifies the onboarding process by allowing users to generate their blockchain addresses even before they officially join the blockchain world. Moreover new users get a full Wallet based on PKPs after they claim the particular KeyID associated with there authMethod ,which can similarly acts as a signer for transaction too .

Our communication and interaction capabilities are powered by XMTP , offering direct messaging . The users are onboarded seamlessly via the Lit Claimable methods , and messages can also be sent to any new users via their emails / Socials. The new users also get an invite email via RESEND to get onboarded. We also use NOTIFI , to alert the when the recieve a particularly message directly to there email , configured by the notifi React Card

In the backend We create a SAFE Smart contract wallet for every user after generating their PKP, so that even if the user loses it, it can be recovered by the user. Moreover, We use AA Core Kit and relay kit to prepare transactions and send them via GELATO Sync Fee Relayer , to just pay tx fees from the Safe itself. Safe Smart contract address is also pre calculated even before the user sign up , depending on the Auth Method.

All the transactions take place on the POLYGON ZK EVM Mainnet , where the Safe Contracts are deployed too ,and can be controlled by the PKPWallet created for the user . The Payments are handled in Savings DAI , a token by Spark Protocol , to ensure efficient stable coin transfers between the entities.

## Protocol Integrations

LIT

SAFE

XMTP

POLYGON

SPARK

## Important Links

Pitch :  

https://pitch.com/public/5b596455-fbda-4e3e-a63e-380b6964aa4e

Safe Creation:

https://zkevm.polygonscan.com/address/0x3be69b4dc26d9a5c233facac01667954cf6f647c#tokentxns

sDAI transfer on polygon zkEvm:

https://zkevm.polygonscan.com/address/0x8a51d7a312ed079b653d16be724023442f1f3f47

https://zkevm.polygonscan.com/tx/0x19124ffda22f9f0d5e6b3ab6e4be52c9c3dfc7c17a9c09644fc837f4858cf126
