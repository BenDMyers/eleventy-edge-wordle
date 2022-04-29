# Eleventy Edge Wordle

> *Yet another [Wordle](https://www.nytimes.com/games/wordle/index.html) clone*

**[Play the hosted Wordle game!](https://eleventy-edge-wordle.netlify.app/)**

***

Recently, the [Eleventy](https://11ty.dev) started unveiling its [Eleventy Edge](https://www.11ty.dev/docs/plugins/edge/) plugin, which allows you to leverage [Netlify's Edge Functions](https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/api/) to - among other things - customize the site to individual users by their location or by way of web APIs such as cookies.

This repo leverages Eleventy and cookie-powered Edge Functions to create a Wordle clone that serves zero clientside JavaScript. It's crude in many ways, but it served as an interesting proof of concept.

***

## Setup & Running

```bash
git clone https://github.com/BenDMyers/eleventy-edge-wordle.git
cd eleventy-edge-wordle
npm install
npx netlify dev
```
