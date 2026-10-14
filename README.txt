CODM Tracker — operator lookup

What it does
- Search a CODM Global player by exact in-game nickname or by player UID.
- Shows nickname, UID, avatar, region, player level, Multiplayer rank (with badge), MP rating and a ranked-ladder view.
- Remembers your last 5 searches in your browser only.
- Does NOT show K/D, wins, match history or Battle Royale stats: the data source doesn't provide them, so nothing is faked.

How it works
- netlify/functions/player.mjs (served at /api/player?q=...) asks Codashop's public CODM top-up validation endpoint for the player profile, following its region hint when a player belongs to another country.
- This is unofficial and may change or stop working without notice.
- Never enter your Activision password, OTP, or account cookies into this site.

Making changes
- The Netlify project deploys automatically from the main branch of the GitHub repo. Edit a file on GitHub (pencil icon > Commit changes) and the site updates in about a minute.

Files
- index.html: the whole website (design + search logic)
- netlify/functions/player.mjs: server-side profile lookup
- netlify.toml: tells Netlify where the function lives
