import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InviteUserEmailProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
}

export const InviteUserEmailTemplate = ({
  username = "zenorocha",
  userImage = ``,
  invitedByUsername = "bukinoshita",
  invitedByEmail = "bukinoshita@example.com",
  inviteLink = "https://vercel.com/teams/invite/foo",
}: InviteUserEmailProps) => {
  const previewText = `Join ${invitedByUsername} on Onboardr`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={``}
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>{invitedByUsername}</strong> on{" "}
              <strong>Onboardr</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>Onboardr</strong> and wants to
              pay and send gifts to you.
            </Text>
            <Section>
              <Row>
                <Column align="center">
                  <Img
                    src={userImage}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={inviteLink}
              >
                Join Onboardr
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

interface MoneySentInterface {
  username?: string;
  amount?: string;
  from?: string;
  senderEmail?: string;
}

export const MoneySentTemplate = ({
  username = "zenorocha",
  amount = ``,
  from = ``,
  senderEmail = ``,
}: MoneySentInterface) => {
  const previewText = `A gift has come you way`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Img
              width={620}
              src={`https://react-email-demo-ijnnx5hul-resend.vercel.app/static/yelp-header.png`}
            />

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {username},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  You got an amount received
                </Heading>

                <Text style={paragraph}>
                  <b>From </b>
                  {from}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Senders email Address </b>
                  {senderEmail}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Amount </b>
                  {amount}
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const boxInfos = {
  padding: "20px 40px",
};
