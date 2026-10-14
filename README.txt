CODM Tracker — unofficial profile lookup edition

What it does
- Lets a player enter their CODM Global in-game nickname.
- Uses a Netlify Function to query the community-maintained endpoint documented at https://github.com/Harry260/codm-api.
- Displays only fields that endpoint documents: nickname, player level, Multiplayer rank/rating, and country.
- Does NOT provide full MP K/D, win rate, total kills, match history, or BR stats. Those are shown as unavailable rather than fake values.

Important limitations
- This is an unofficial, reverse-engineered service. It may be unavailable, inaccurate, rate-limited, or change without notice.
- The API documentation does not guarantee that every region or nickname will work.
- A profile lookup is not a live match feed.
- Never enter your Activision password, OTP, or account cookies into this site.

Deploying
The site now needs a Netlify Function, so a plain static-only upload of index.html is NOT enough. Deploy the whole folder as a Netlify project with functions enabled. Easiest reliable method: put the folder contents in a GitHub repository, then in Netlify choose Add new site > Import an existing project and connect that repository. Netlify should detect netlify.toml and deploy netlify/functions/codm.js. You can do this from a phone browser.

Files
- index.html: website
- netlify.toml: tells Netlify where the function lives
- netlify/functions/codm.js: server-side profile API proxy
