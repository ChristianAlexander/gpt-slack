# GPT-Slack

A slack bot that proxies messages out to OpenAI's ChatGPT API.

## Running

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ChristianAlexander/gpt-slack)

A Dockerfile is provided to bundle up the application, if Heroku is not an option for you.

## Configuration

To easily create the Slack app, use [slack-manifest-template.yaml](./slack-manifest-template.yaml) in the "[create new apps](https://api.slack.com/apps)" page on Slack. Make sure to update the event subscription URL once the gpt-slack application is deployed.

Environment variables:

- `SLACK_BOT_TOKEN`: Obtain this (and the other slack variables) from [the Slack Bolt JS getting started guide](https://slack.dev/bolt-js/tutorial/getting-started#tokens-and-installing-apps).
- `SLACK_SIGNING_SECRET`
- `SLACK_APP_TOKEN`: If an app token is provided, the application will run in "[socket mode](https://api.slack.com/apis/connections/socket)," and will not need to have an incoming request URL configured. Only set this value if you intend to run in socket mode. Attempting to do a webhook event subscription with this value set may fail.
- `OPENAI_API_KEY`: Obtain this [from OpenAI](https://platform.openai.com/account/api-keys)

Required Slack permissions:

- `app_mentions:read`: Allow the bot to be invoked by an `@-mention`
- `chat:write`: Allow the bot to write responses
- `channels:history`: Allow the bot to read threads to provide context to ChatGPT
- `groups:history`: Allow the bot to read threads to provide context to ChatGPT
- `im:history`: Allow the bot to read threads to provide context to ChatGPT
- `mpim:history`: Allow the bot to read threads to provide context to ChatGPT

Additional required setup:

- Configure the Slack app's event request URL to be `https://<deployed-app-url>/slack/events`
- Add an event subscription for `app_mention` to the bot app under "event subscriptions" in Slack's developer portal

## Usage

In a Slack channel, write a message `@-mentioning` the bot.

```
@gptbot, implement hello world in Elixir
```

The bot will respond to the message in a thread with "Thinking…"

After there is a response from OpenAI, the "Thinking…" message will be replaced with the response.

### System prompts

Any message containing `[SYSTEM]` will be interpreted as a system prompt, which is used to provide instructions to ChatGPT.
