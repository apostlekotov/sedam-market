# Sedam Market

> Website for grocery - [sedam.com.ua](https://sedam.com.ua)

## Set up (Web App)

At first, _install_ all dependencies for the server:

```bash
npm install
```

Then, _install_ all dependencies for the react app and _build_ it:

```bash
cd client
npm install
react-scripts build # build React app
cd ..
```

**Important!** Make sure you fill the [config file](config/config.env)!

And run the app:

```bash
npm run prod
```

## Set up (Telegram Bot)

_Install_ all dependencies for the telegram bot:

```bash
cd bot
pip install pyTelegramBotAPI requests pyjwt
```

**Important!** Make sure you fill the other [config file](bot/config.py)!

And run it:

```bash
python bot.py
```

### Author

- **Kotov** (kotov.smtp@gmail.com)

Made with love <3
