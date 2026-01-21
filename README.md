# koinYOU

> *koinonia* (Greek: κοινωνία) — fellowship, community, sharing in common

live and breathe God's word, together.

---

## what is this

koinYOU is a little bible app i built because i wanted something that felt more... personal? like yeah there's a million bible apps out there but most of them feel kinda corporate and lonely.

this one is about doing faith *with* people. search verses, save the ones that hit different, share them with friends, pray for each other. that's it. nothing fancy.

## why i made this

honestly i just wanted to build something meaningful. not for clout, not to make money off christians (that feels weird lol), just... something that might actually help people connect with scripture and with each other.

there's something beautiful about reading the same verse your friend is reading, or knowing someone prayed for you today. that's the vibe i'm going for.

## features

- **verse search** — find any verse instantly (supports stuff like "1 corinthians 13:4-7")
- **save verses** — keep the ones that matter to you
- **send to friends** — share verses with people you care about
- **prayer wall** — post prayers, pray for others
- **devotions** — read and share what God's teaching you

## tech stuff

if you're curious (or want to learn):

- **frontend**: next.js, tailwind css
- **backend**: express, node.js
- **database**: mongodb
- **auth**: google oauth
- **hosting**: vercel (frontend) + railway (backend)

built this whole thing pretty fast ngl. proof that you don't need to overcomplicate things.

## running it locally

```bash
# clone it
git clone https://github.com/yourusername/koinyou.git

# frontend
npm install
npm run dev

# backend (in another terminal)
cd server
npm install
npm run dev
```

you'll need a `.env` file with your mongodb uri, google oauth credentials, etc. dm me if you're stuck.

## contributing

if you want to help make this better, i'd love that. just open a PR or reach out. no pressure tho.

## a note

this isn't a startup. i'm not trying to get rich off this or turn it into some big thing. it's just a project made with love for anyone who wants to grow closer to God and to each other.

if even one person feels less alone in their faith because of this app, that's enough for me.

---

*"And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers."* — Acts 2:42

---

made with prayer and a lot of coffee
