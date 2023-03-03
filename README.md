# OpenAI API example app

This is an example app that uses OpenAI API `gpt-3.5-turbo` model to generate a summary of any web article from its URL. The code is based on the [Quick-Start guide](https://github.com/openai/openai-quickstart-node.git) from [OpenAI](https://platform.openai.com/docs/quickstart/setup).

## Demo Video 
The following video explains how the application works.

https://user-images.githubusercontent.com/124426/222802030-b88eb70d-74f6-4b4e-8a82-871447239c11.mp4

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd gpt-summary
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! For the full context behind this example app, check out the [tutorial](https://platform.openai.com/docs/quickstart).
