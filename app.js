require("dotenv").config();

const { App } = require("@slack/bolt");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = new App({
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: !!process.env.SLACK_APP_TOKEN,
  token: process.env.SLACK_BOT_TOKEN,
});

const getBotUserId = (() => {
  let id;

  return async () => {
    if (id) return id;

    const botUser = await app.client.auth.test();
    id = botUser.user_id;

    return id;
  };
})();

app.event("app_mention", async ({ event, say, client }) => {
  const { messages: threadMessages } = await client.conversations.replies({
    channel: event.channel,
    ts: event.thread_ts ?? event.ts,
  });

  const message = await say({
    thread_ts: event.thread_ts ?? event.ts,
    text: "Thinking…",
  });
  try {
    const prompts = await extractPrompts(threadMessages);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompts,
    });

    const reply = completion.data.choices[0].message.content;

    await client.chat.update({
      channel: event.channel,
      ts: message.ts,
      text: reply,
    });
  } catch (e) {
    console.error(e);
    await client.chat.update({
      channel: event.channel,
      ts: message.ts,
      text: "Sorry, I'm having trouble processing your request.",
    });
  }
});

function stripMentions(text, botUserId) {
  text = text.replace(`<@${botUserId}>`, "@Assistant");
  return text.replace(/<@[A-Z0-9]+>/gi, "@User");
}

async function extractPrompts(slackMessages) {
  const botUserId = await getBotUserId();

  return slackMessages.map((message) => {
    let messageText = message.text;

    let role = "user";
    if (message.user === botUserId) {
      role = "assistant";
    }

    if (role === "user" && messageText.includes("[SYSTEM]")) {
      role = "system";
      messageText = messageText.replace("[SYSTEM]", "");
    }

    messageText = stripMentions(messageText, botUserId);

    return { role, content: messageText };
  });
}

async function main() {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
}

main();
