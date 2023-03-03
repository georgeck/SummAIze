# OpenAI API example app

This is an example app that uses OpenAI API `gpt-3.5-turbo` model to generate a summary of any web article from its URL.

<div style="position:relative;width:fit-content;height:fit-content;">
   <a style="position:absolute;top:20px;right:1rem;opacity:0.8;" href="https://clipchamp.com/watch/UcUupnL9ENv?utm_source=embed&utm_medium=embed&utm_campaign=watch">
       <img style="height:22px;" src="https://clipchamp.com/e.svg" alt="Made with Clipchamp" />
   </a>
   <iframe allow="autoplay;" allowfullscreen style="border:none" src="https://clipchamp.com/watch/UcUupnL9ENv/embed" width="640" height="360"></iframe>
 </div> 

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
