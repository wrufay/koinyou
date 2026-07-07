# koinYOU

> _koinonia_ (Greek: κοινωνία) - fellowship, community, sharing in common

Live and breathe God's word, together.

---

## What is this?

koinYOU is a Bible app built for community; **so fellowship can follow you far and wide.**

## How it works:

Search for any verse, save the ones that stick with you, and share them with friends.

Keep your fellowship accountable and lift eachother up through shared prayer walls, streaks and daily devotionals.

# Why koinYOU?

Most Bible apps feel like you're reading alone. This one's different - it's about doing faith _with_ people through diving into scripture daily.

## Features

- **Verse Search** - Find any verse instantly (try "John 3:16" or "1 Corinthians 13:4-7")
- **Save Verses** - Build your personal collection
- **Send to Friends** - Share a verse with someone who needs it
- **Prayer Wall** - Post prayers, pray for others
- **Devotions** - Share what God's been teaching you

## Tech Stack

- **Frontend**: Next.js, React.js, Tailwind CSS
- **Backend**: Express, Node.js
- **Database**: MongoDB
- **Auth**: Google OAuth
- **Hosting**: Vercel (frontend) + Railway (backend)

## Running Locally

```bash
# Clone the repo
git clone https://github.com/wrufay/koinyou.git

# Frontend
npm install
npm run dev

# Backend (in another terminal)
cd server
npm install
npm run dev
```

You'll need a `.env` file with your MongoDB URI, Google OAuth credentials, etc.

## Contributing

PRs welcome! Help me make this better :)
f26wu[at]uwaterloo[dot]ca

## To-do

- Store uploaded pfps in Cloudinary so they don't reset on redeploy
