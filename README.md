# About

Front and backend for basically a wrapper on discord-selfbot.

Front fetches discord server for a given account, displays them and allows to post the same message on multiple servers with or without an image. Built mainly for primary needs of wanting to post the same thing on multiple servers.

Both of the repos should have their own read with details how to launch them.

# Tech

Backend - Typescript, Express, Multer for handling image uploads, Zod
Front - Vue 3 w/ typescript & composition api, tailwind using DaisyUI

### TODOs
- [ ] Paste image on frontend
- [ ] Saving Presets for different scenarios (memes, animals etc)
- [ ] Handle pasting instagram/yt link (check size)
- [ ] List of sent images? With some reaction stats maybe?


Further possible improvements: 
- [ ] Support for multiple images/videos send at once

User settings check:
- [ ] if user has nitro or not etc. (upload size)
- [ ] clearing local image
