# leetcode solved problems tracker

so... I made this because I kept forgetting which leetcode problems I'd already done. opening leetcode and scrolling through my submissions felt like too much effort sometimes.

it's a Next.js app that tracks the problems you've solved. nothing fancy, just something that works.

## why this exists

- I solve leetcode problems but my memory is terrible
- wanted something cleaner than a text file
- spreadsheets felt too corporate for tracking coding problems
- figured I might as well make it look decent while I'm at it

## running it locally

if you want to run this for some reason:

### 1. clone and install

```bash
git clone https://github.com/dev-palwar/leetcode-solved-problems-tracker.git
cd leetcode-solved-problems-tracker
npm install (bun if you have it)
```

### 2. set up environment variables

you'll need two files for this to work:

create a `.env` file in the root:

```env
DATABASE_URL="your-mongodb-atlas-url-here"
```

get your MongoDB Atlas URL from their dashboard. it's free for small projects.

create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
CLERK_WEBHOOK_SIGNING_SECRET=your_webhook_secret_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

the Clerk keys come from [clerk.com](https://clerk.com) after you make an account. it handles auth so I didn't have to.

### 3. run it

# leetcode solved problems tracker

so... I made this because I kept forgetting which leetcode problems I'd already done. opening leetcode and scrolling through my submissions felt like too much effort sometimes.

it's a Next.js app that tracks the problems you've solved. nothing fancy, just something that works.

## why this exists

- I solve leetcode problems but my memory is terrible
- wanted something cleaner than a text file
- spreadsheets felt too corporate for tracking coding problems
- figured I might as well make it look decent while I'm at it

## running it locally

if you want to run this for some reason:

### 1. clone and install

```bash
git clone https://github.com/dev-palwar/leetcode-solved-problems-tracker.git
cd leetcode-solved-problems-tracker
npm install (bun if you have it)
```

### 2. set up environment variables

you'll need two files for this to work:

create a `.env` file in the root:

```env
DATABASE_URL="your-mongodb-atlas-url-here"
```

get your MongoDB Atlas URL from their dashboard. it's free for small projects.

create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
CLERK_WEBHOOK_SIGNING_SECRET=your_webhook_secret_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

the Clerk keys come from [clerk.com](https://clerk.com) after you make an account. it handles auth so I didn't have to.

### 3. run it

```bash
npm run dev
```

then go to `http://localhost:3000`

or use yarn/pnpm/bun if that's your thing. I'm not going to judge your package manager choices.

### You'll need one more thing to make it work

go to "https://github.com/dev-palwar/leetcode-extension"

- follow the instruction written there.

## tech stack

- Next.js (it has servers built in)
- MongoDB with Prisma
- Clerk
- Tailwind CSS
- whatever else I needed to make it work

## deployment

you can deploy it on Vercel if you want. they make it pretty easy.

## contributing

if you find bugs or want to add features, feel free to open an issue or PR. I'll look at it when I have time.

## license

do whatever you want with this. if it helps you track your leetcode grind, that's cool.
