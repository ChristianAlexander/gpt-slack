# GPT-Slack

A slack bot that proxies messages out to OpenAI's ChatGPT API.

## Running

A Dockerfile is provided to bundle up the application.

## Configuration

Environment variables:

- `SLACK_BOT_TOKEN`: Obtain this (and the other slack variables) from [the Slack Bolt JS getting started guide](https://slack.dev/bolt-js/tutorial/getting-started#tokens-and-installing-apps).
- `SLACK_SIGNING_SECRET`
- `SLACK_APP_TOKEN`
- `OPENAI_API_KEY`: Obtain this [from OpenAI](https://platform.openai.com/account/api-keys)

Required Slack permissions:

- `app_mentions:read`: Allow the bot to be invoked by an `@-mention`
- `chat:write`: Allow the bot to write responses
- `channels:history`: Allow the bot to read threads to provide context to ChatGPT
- `groups:history`: Allow the bot to read threads to provide context to ChatGPT
- `im:history`: Allow the bot to read threads to provide context to ChatGPT
- `mpim:history`: Allow the bot to read threads to provide context to ChatGPT

## Usage

In a Slack channel, write a message `@-mentioning` the bot.

```
@gptbot, implement hello world in Elixir
```

The bot will respond to the message in a thread with "Thinking…"

After there is a response from OpenAI, the "Thinking…" message will be replaced with the response.

### System prompts

Any message containing `[SYSTEM]` will be interpreted as a system prompt, which is used to provide instructions to ChatGPT.
