
$outputPath = "C:\Users\bafna\OneDrive\Desktop\Claude\connekt\Connek Tech Glossary.docx"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$sel = $word.Selection

function Set-N {
    $sel.Style = $doc.Styles("Normal")
    $sel.Font.Bold = $false
    $sel.Font.Italic = $false
    $sel.Font.Size = 11
    $sel.ParagraphFormat.SpaceAfter = 6
}
function Add-H1($t) { $sel.Style = $doc.Styles("Heading 1"); $sel.TypeText($t); $sel.TypeParagraph() }
function Add-H2($t) { $sel.Style = $doc.Styles("Heading 2"); $sel.TypeText($t); $sel.TypeParagraph() }
function Add-H3($t) { $sel.Style = $doc.Styles("Heading 3"); $sel.TypeText($t); $sel.TypeParagraph() }
function Add-P($t) { Set-N; $sel.TypeText($t); $sel.TypeParagraph() }
function Add-B($label,$rest) { Set-N; $sel.Font.Bold=$true; $sel.TypeText($label); $sel.Font.Bold=$false; $sel.TypeText($rest); $sel.TypeParagraph() }
function Add-Bullet($t) { $sel.Style = $doc.Styles("List Bullet"); $sel.Font.Bold=$false; $sel.TypeText($t); $sel.TypeParagraph() }
function Add-Line { Set-N; $sel.TypeText("_________________________________________________"); $sel.TypeParagraph() }
function Add-Blank { Set-N; $sel.TypeParagraph() }
function Add-PB { $sel.InsertBreak(7) }

# ── TITLE ──
Add-H1 "How Connek Was Built"
Add-P "A complete, beginner-friendly guide to every tool, term, and decision"
Add-P "Khushi Bafna | IIT Jodhpur MBA | Built for placement prep"
Add-Line
Add-P "This document explains everything used to build Connek — from what a website even is, to how your domain email works, to why each tool was chosen. Read it in order the first time. After that, use it as a reference."

# ── PART 1 ──
Add-PB
Add-H1 "Part 1: What Is a Website, Really?"
Add-Line

Add-H2 "What Is a Website?"
Add-P "A website is just files. Text files, image files, style files. When you visit theconnek.com, your browser (Chrome, Safari) downloads those files from a computer somewhere in the world and displays them on your screen."
Add-P "That is it. Everything else — animations, forms, databases — is built on top of this basic idea."

Add-H2 "What Are Those Files Made Of?"
Add-P "Every website is built from three core languages:"
Add-B "HTML: " "The structure. What is on the page — headings, paragraphs, buttons, images. Like the skeleton of a page."
Add-B "CSS: " "The appearance. Colours, fonts, spacing, layout. Like the skin and clothes on that skeleton."
Add-B "JavaScript: " "The behaviour. What happens when you click something, animations, form submissions. Like the muscles and brain."
Add-P "We do not write raw HTML/CSS/JavaScript by hand. We use tools (React, Tailwind, TypeScript) that are more powerful and automatically convert down to these three basics for the browser."

Add-H2 "What Is Code?"
Add-P "Code is instructions written in a language a computer can understand. Just like you give instructions to a person in English, you give instructions to a computer in a programming language."
Add-Bullet "JavaScript / TypeScript: runs in browsers and on servers. This is what Connek is written in."
Add-Bullet "Python: popular for data science, AI, automation."
Add-Bullet "SQL: used to talk to databases — ask for data, insert data, delete data."
Add-Bullet "HTML/CSS: technically markup and style languages, not programming languages, but still written as text files."

Add-H2 "Frontend vs Backend"
Add-P "This is one of the most important distinctions in web development. Every application has two sides."
Add-B "Frontend: " "Everything the user sees and interacts with. The buttons, the text, the animations, the form. Runs inside the user's browser on their own device."
Add-B "Backend: " "Everything the user never sees. The server, the database, the logic that processes data. Runs on computers in the cloud."
Add-P "ANALOGY: Think of a restaurant. The frontend is the dining area — tables, menus, decor, what the customer sees and touches. The backend is the kitchen — invisible to the customer, but doing all the real work."
Add-P "In Connek specifically:"
Add-Bullet "Frontend: the landing page, the candidate/professional toggle, the form, the animations, the thank-you page."
Add-Bullet "Backend: the /api/waitlist code that saves signups to the database and sends the notification email."

# ── PART 2 ──
Add-PB
Add-H1 "Part 2: The Frontend Tools"
Add-Line

Add-H2 "React"
Add-P "React is a JavaScript library created by Meta (Facebook) in 2013. It is now the most popular way to build web interfaces in the world — used by Facebook, Instagram, Airbnb, Netflix, and thousands of startups."

Add-H3 "The Problem React Solves"
Add-P "Before React, if anything changed on the page (say, you clicked a toggle), the entire page had to reload or be redrawn from scratch. This was slow and felt janky."
Add-P "React introduced a smarter way: it tracks exactly what changed and only updates that specific part of the page. Everything else stays exactly as it was."
Add-P "In Connek: when you click the toggle between candidate and professional, ONLY the headline, subtext, and form change. The navbar at the top and the footer at the bottom stay completely still. React handles this automatically — you do not write any special code to make that happen."

Add-H3 "What Is a Component?"
Add-P "A component is a reusable, self-contained piece of UI — like a Lego brick. You build complex pages by combining simple components."
Add-P "In Connek, every major piece is its own component:"
Add-Bullet "Logo.tsx: the Connek logo — used in the navbar and on multiple pages"
Add-Bullet "Footer.tsx: the bottom section — appears on every page"
Add-Bullet "Mentors.tsx: the grid of mentor cards on the homepage"
Add-Bullet "Analytics.tsx: the invisible script loader for GA4 and Clarity"
Add-Bullet "LegalPage.tsx: the shared layout for Privacy and Terms pages"
Add-P "If you want the footer on 5 pages, you write <Footer /> in 5 files. Change the Footer component once, it updates on all 5 pages automatically."

Add-H3 "What Is State?"
Add-P "State is data inside a component that can change. When state changes, React automatically re-renders (redraws) only the parts of the page that depend on that data."
Add-P "In Connek, our main piece of state is called userType. It holds one of two values: the word candidate or the word professional. When you click the toggle button:"
Add-Bullet "userType changes from candidate to professional (or back)"
Add-Bullet "React detects the change"
Add-Bullet "React re-renders the headline, subtext, value props, steps, and form fields — everything that reads from userType"
Add-P "No page reload. No flicker. Instant. This is the core of how React works."

Add-H2 "Next.js"
Add-P "Next.js is a framework built on top of React. While React is a library (a tool for one specific job — building UI), Next.js is a framework — a complete structure for building a full web application."
Add-P "ANALOGY: React gives you an engine. Next.js gives you the whole car — engine, steering wheel, seats, GPS, fuel gauge. You could build the car yourself from just the engine, but it would take forever and the result would be worse."

Add-H3 "What Next.js Adds to React"
Add-B "File-based routing: " "You do not configure which URL shows which page. The folder structure IS the URL structure. Create a folder named about with a page.tsx file inside, and /about is now a live URL."
Add-B "API routes: " "You can write backend server code right inside your Next.js project. No separate Express server, no separate backend repo. Our app/api/waitlist/route.ts runs on Vercel's servers — not in the user's browser."
Add-B "Server-side rendering (SSR): " "Next.js can generate page HTML on the server and send it fully formed to the browser. This matters for SEO — Google can read your content immediately rather than waiting for JavaScript to run."
Add-B "Built-in optimisation: " "Images are automatically compressed. Fonts are optimised. JavaScript is split into small chunks so pages load faster."

Add-H3 "App Router — The URL Map"
Add-P "App Router is the name of the routing system in modern Next.js (version 13+). The rule: folder name = URL path. Here is the complete map of all Connek pages:"
Add-Bullet "app/page.tsx → theconnek.com/ (homepage)"
Add-Bullet "app/thank-you/page.tsx → theconnek.com/thank-you"
Add-Bullet "app/privacy/page.tsx → theconnek.com/privacy"
Add-Bullet "app/terms/page.tsx → theconnek.com/terms"
Add-Bullet "app/about/page.tsx → theconnek.com/about (not yet linked in nav)"
Add-Bullet "app/not-found.tsx → any URL that does not exist (the 404 error page)"
Add-Bullet "app/api/waitlist/route.ts → theconnek.com/api/waitlist (backend only — not a visible page)"
Add-P "No configuration file. No routing table to maintain. Just folders and files."

Add-H2 "TypeScript"
Add-P "TypeScript is JavaScript with an extra safety layer called types. A type tells the computer what kind of data a variable is allowed to hold."
Add-P "Problem it solves: in plain JavaScript, you can accidentally put the wrong kind of data into a variable and nothing warns you until a real user hits the bug. TypeScript catches these mistakes immediately — on your laptop, before you even save the file."
Add-P "Example from Connek: we defined type UserType = 'candidate' | 'professional'. This means userType can only ever hold one of those two exact strings. If we ever wrote 'candidat' (missing the e) somewhere, TypeScript would refuse to build and show an error immediately."
Add-P "For placement: TypeScript is the industry standard at every serious tech company. Knowing it signals that you write production-quality, maintainable code."

Add-H2 "Tailwind CSS"
Add-P "Tailwind is a way of writing CSS — the language that makes websites look the way they do — without writing separate CSS files."
Add-P "Traditional approach: you write a .css file with rules like .button { background: blue; padding: 8px 16px; border-radius: 8px; }. Then in your HTML you write class='button'."
Add-P "Tailwind approach: you skip the separate file and write the styles directly in the HTML/JSX as utility class names: className='bg-blue-500 px-4 py-2 rounded-lg'. Same visual result, no file switching, no naming CSS classes."
Add-P "Our brand colours (#4B6FA5 and #08090E) are too specific for Tailwind's default colour palette, so for those we used inline style={{ background: '#4B6FA5' }} props. For everything else — spacing, border radius, font size, layout — we used Tailwind classes."

Add-H2 "Framer Motion"
Add-P "Framer Motion is a React animation library. Without animations, elements appear and disappear instantly — the page feels static and dead. Framer Motion handles all the physics and timing automatically."
Add-P "What we used it for in Connek:"
Add-B "Fade-up on scroll: " "Every section starts invisible and gently rises into view as you scroll down to it. This is achieved with useInView — a hook that fires when an element enters the visible area of the screen."
Add-B "Toggle crossfade: " "When you switch between candidate and professional, the old content fades out smoothly and new content fades in. This is done with AnimatePresence — a wrapper that plays an exit animation before a component is removed from the page."
Add-B "Stagger: " "The three value prop cards animate in one after another (0.12 seconds apart) instead of all at once. This guides the user's eye from left to right and gives the page a polished, intentional feel."
Add-B "Hover and tap: " "Buttons scale up slightly when hovered and scale down when clicked. This micro-interaction signals that something is interactive — users feel the response."
Add-B "Breathing blobs: " "The glowing circles behind the hero text pulse slowly in and out on an infinite loop, created by cycling between two scale and opacity values continuously."

# ── PART 3 ──
Add-PB
Add-H1 "Part 3: The Backend — Data, Logic, and Secrets"
Add-Line

Add-H2 "What Is a Database?"
Add-P "A database is organised, permanent storage for data. Permanent means it survives when the server restarts, when you close your laptop, when the power goes out. The data is still there."
Add-P "Compare to a variable in code: if you save a user's name in a variable and restart the server, the variable is gone. A database keeps it forever until you explicitly delete it."
Add-P "The data in our database looks exactly like a spreadsheet — rows and columns. One row per person who signed up. One column per piece of information."

Add-H2 "PostgreSQL"
Add-P "PostgreSQL (Postgres for short) is the specific database software we use. It is a relational database — data is stored in tables with rows and columns, and tables can be linked to each other."
Add-P "It is open-source (free, publicly maintained by a large community) and used by Instagram, Spotify, Reddit, and thousands of companies. It is one of the most reliable and powerful databases in the world."
Add-P "Our waitlist table columns: id (auto-assigned number), name, email, college, role, user_type, created_at (timestamp). Each row is one person who joined the waitlist."

Add-H2 "Supabase"
Add-P "Supabase is a platform that hosts a PostgreSQL database for you and wraps it with a JavaScript library so your code can interact with it without writing SQL."
Add-P "Normally to set up Postgres yourself you would need to: rent a server, install Postgres on it, configure users and passwords, write connection code, manage backups and security. Supabase does all of this."
Add-P "In our code, inserting a signup looks like this: supabase.from('waitlist').insert({ name, email, college, role, user_type }). One line. Supabase translates it to SQL and runs it."
Add-P "The Supabase dashboard gives you a visual table view — like Google Sheets — so you can see every signup without touching code."
Add-B "Free tier warning: " "Supabase pauses your database after 7 days of no database activity. If a week passes with no signups, the next person who tries will see an error. Fix it by going to the Supabase dashboard and clicking Resume. Paid plans do not have this limitation."

Add-H2 "API — The Most Important Concept in This Document"
Add-P "API stands for Application Programming Interface. It is a defined way for two pieces of software to talk to each other."
Add-P "The key word is defined. An API says: if you send me a request in exactly this format, I will always respond in exactly this format. You do not need to know what happens inside the other system — you just follow the contract."
Add-P "ANALOGY: A TV remote is an API between you and your TV. When you press Volume Up, you do not understand the electronics inside the TV. You just press the button (send a request) and the volume increases (get a response). The button is the defined interface."
Add-Blank
Add-B "Supabase API: " "We send: please insert this row into the waitlist table. Supabase responds: done, here is the row."
Add-B "Resend API: " "We send: please deliver this email, with this subject, from this sender, to this recipient. Resend responds: sent."
Add-B "Our own API (/api/waitlist): " "The browser sends us: here is a form submission. We respond: success, or here is the error."

Add-H3 "GET vs POST"
Add-P "When software talks to an API over the internet, every request has a method — a verb saying what you want to do."
Add-B "GET: " "Give me data. Used when your browser loads any page. Example: visiting theconnek.com/privacy sends a GET request."
Add-B "POST: " "Here is data, process it. Used when submitting a form. Example: clicking Join sends a POST to /api/waitlist with the form data."
Add-B "DELETE: " "Remove something."
Add-B "PATCH/PUT: " "Update something."

Add-H3 "Our /api/waitlist Route — Step by Step"
Add-P "This is the most important backend file in Connek. Here is every step:"
Add-P "1. Browser sends POST to /api/waitlist. Body contains: { name, email, college, role, user_type }."
Add-P "2. Vercel receives the request and spins up the serverless function in route.ts."
Add-P "3. The function checks that name, email, college, and role are all present. If any is missing, it immediately returns an error."
Add-P "4. It calls Supabase to insert the row into the waitlist table."
Add-P "5. If the email already exists, Supabase returns error code 23505 (Postgres's code for duplicate unique value). We catch this and return: 'This email is already on the waitlist.'"
Add-P "6. It calls Resend to send a notification email to bafnakhushi111@gmail.com."
Add-P "7. It returns { success: true } to the browser."
Add-P "8. The browser receives success and redirects the user to /thank-you."

Add-H2 "Serverless Functions"
Add-P "A serverless function is code that runs in the cloud only when it is called — not 24 hours a day."
Add-P "Traditional server: a machine that is always on, always connected, always waiting. You pay for it every hour whether it processes zero requests or ten thousand."
Add-P "Serverless: no machine is running between requests. When a call comes in, the platform instantly creates a tiny temporary environment, runs your code, returns the result, and destroys the environment. You pay only for those milliseconds of actual work."
Add-P "Our /api/waitlist is a serverless function. Between form submissions, it does not exist anywhere — no server, no compute, no cost. The moment someone submits, Vercel creates it, runs it, and it is gone."
Add-P "The major advantage: automatic scaling. If 1 person submits, 1 instance runs. If 10,000 people submit simultaneously, 10,000 instances run in parallel. You configured nothing — Vercel handles it."

Add-H2 "Environment Variables"
Add-P "Environment variables are secret values stored outside your code and injected into the application by the platform at runtime."
Add-P "The problem: our code needs secret keys to connect to Supabase and Resend. If those keys were written directly in the code files, and the code is on GitHub, anyone who looks at the repo has our keys. They could access our database, send emails from our domain, or rack up charges."
Add-P "Solution: in the code we write process.env.RESEND_API_KEY — just a placeholder name. The actual secret value lives only inside Vercel's encrypted settings panel, never in the code files."
Add-P "Our environment variables:"
Add-Bullet "NEXT_PUBLIC_SUPABASE_URL — the web address of our Supabase project"
Add-Bullet "NEXT_PUBLIC_SUPABASE_ANON_KEY — the public read/write key for Supabase"
Add-Bullet "RESEND_API_KEY — the secret key to send emails via Resend (server-side only)"
Add-Bullet "NEXT_PUBLIC_GA_ID — Google Analytics measurement ID (pending setup)"
Add-Bullet "NEXT_PUBLIC_CLARITY_ID — Microsoft Clarity project ID (pending setup)"
Add-P "Variables starting with NEXT_PUBLIC_ are exposed to the browser (safe for public keys). Variables without that prefix stay server-side only."

# ── PART 4 ──
Add-PB
Add-H1 "Part 4: Email — How It All Works"
Add-Line

Add-H2 "Two Kinds of Email"
Add-B "Transactional email: " "Automated emails triggered by a specific user action. One person does something, one email fires. Someone signs up — you get a notification. These are event-driven and time-sensitive."
Add-B "Marketing email: " "Newsletters, announcements, campaigns. Sent to a list of subscribers at a scheduled time. Many recipients at once."
Add-P "For Connek right now, we only use transactional email — specifically a notification to you every time someone joins the waitlist."

Add-H2 "Why Not Just Use Gmail?"
Add-P "You might wonder: why not just send from bafnakhushi111@gmail.com using Gmail? Here is why that does not work for a product:"
Add-Bullet "Gmail limits personal accounts to about 500 automated emails per day."
Add-Bullet "Emails sent programmatically via Gmail frequently land in spam."
Add-Bullet "You cannot send from hello@theconnek.com via Gmail — Gmail only allows sending from Gmail addresses."
Add-Bullet "No delivery tracking, no analytics, no automatic retry on failure."

Add-H2 "What Is Resend?"
Add-P "Resend is a purpose-built transactional email API. You sign up, get a secret API key, and call their API from your code with: who to send to, who it is from, the subject line, and the HTML content."
Add-P "Resend handles everything else:"
Add-Bullet "Their servers physically send the email on your behalf"
Add-Bullet "DKIM and SPF authentication — technical DNS records that prove your email is legitimate and prevent spam filters from blocking it"
Add-Bullet "Sending from your own domain (hello@theconnek.com)"
Add-Bullet "Delivery logs — you can see if an email was delivered, bounced, or flagged"

Add-H2 "What Is hello@theconnek.com?"
Add-P "This is a domain email address — an email address that uses your own domain name instead of @gmail.com."
Add-P "You own theconnek.com. That means you can create any address @theconnek.com. hello@theconnek.com, support@theconnek.com, khushi@theconnek.com — any of these are possible."
Add-P "To make this work technically, you add DNS records to your domain that tell the internet: emails arriving for @theconnek.com should be verified by Resend. This involves two specific DNS record types: DKIM (a cryptographic signature proving the email was sent by an authorised server) and SPF (a list of servers allowed to send email for your domain)."
Add-P "Why a domain email matters:"
Add-Bullet "Trust: hello@theconnek.com looks professional. A notification from a gmail.com address would look like spam or a personal account."
Add-Bullet "Brand: every email reinforces the Connek identity."
Add-Bullet "Deliverability: domain emails with proper DNS setup are far less likely to land in spam folders."

Add-H2 "The Exact Email Flow in Connek"
Add-P "Step 1: User fills the form on theconnek.com and clicks Join."
Add-P "Step 2: Browser sends the form data to /api/waitlist on Vercel."
Add-P "Step 3: The API route saves the data to Supabase."
Add-P "Step 4: The API route calls Resend with: From = hello@theconnek.com, To = bafnakhushi111@gmail.com, Subject = New Candidate signup: [Name], Body = a formatted HTML table with name, email, college, role, and the IST timestamp."
Add-P "Step 5: Resend's servers deliver the email to your Gmail inbox."
Add-P "Step 6: You see a notification on your phone or laptop that someone new joined."

Add-H2 "What About Emailing the Users Who Sign Up?"
Add-P "Right now, Connek only emails the owner (you) when someone signs up. The person who signed up does not receive any confirmation or welcome email."
Add-P "In a future version, you would add a second Resend call that sends a Welcome to Connek email directly to the user's address — acknowledging their signup, setting expectations for what comes next. That code would go in the same route.ts file, right after the owner notification."

# ── PART 5 ──
Add-PB
Add-H1 "Part 5: Vercel — How the Site Gets on the Internet"
Add-Line

Add-H2 "The Problem Vercel Solves"
Add-P "You have written code on your laptop. It works when you run it locally. But right now, only your laptop can see it. To make it accessible to anyone on the internet, you need a server — a computer that is always on, always connected, with your code running on it."
Add-P "Managing your own server is a full-time job: buy or rent hardware, install the operating system, install Node.js, configure the network, set up SSL certificates, point your domain, monitor uptime, restart when it crashes, apply security patches. That is weeks of work before a single user visits."
Add-P "Vercel replaces all of that. You connect your GitHub repository to Vercel and your site is live in under 2 minutes."

Add-H2 "What Vercel Is"
Add-P "Vercel is a cloud deployment platform. They own and operate thousands of servers worldwide. You give them your code via GitHub and they run it — handling the hardware, the network, the SSL certificates, the global distribution. You manage none of it."
Add-P "It was built by the same team that created Next.js, so Next.js features (API routes, SSR, image optimisation, OG images) are all optimised to run on Vercel's infrastructure."

Add-H2 "How a Deployment Works — Every Step"
Add-P "Step 1 — git push: your code goes from your laptop to GitHub."
Add-P "Step 2 — Vercel detects the push: Vercel is connected to your GitHub repo and watches for new commits. A new push triggers a build automatically."
Add-P "Step 3 — Vercel builds: Vercel runs npm run build on their servers. This converts TypeScript to plain JavaScript (browsers do not understand TypeScript), bundles all components together, optimises images, and pre-renders static pages. Takes 30 to 90 seconds."
Add-P "Step 4 — Vercel deploys globally: the built output is copied to servers in cities worldwide — Mumbai, Singapore, Frankfurt, New York, Sao Paulo. Your site runs close to wherever any user is."
Add-P "Step 5 — Domain routes to new version: theconnek.com now serves the newly built version. Previous versions are archived and available for instant rollback."
Add-P "Total time from git push to live on the internet: about 60 to 90 seconds. Completely automatic after the first setup."

Add-H2 "CDN — Why the Site Is Fast"
Add-P "CDN stands for Content Delivery Network. It is a global network of servers that stores copies of your site's files — images, CSS, JavaScript — and serves them from the server closest to each user."
Add-P "Without CDN: every user connects to one server, say in the US. A user in Mumbai waits for data to travel halfway around the world — 250 to 400 milliseconds of latency."
Add-P "With CDN: Vercel's CDN stores copies in Mumbai, Singapore, Frankfurt, etc. The Mumbai user is served from Mumbai. Response time drops to under 30 milliseconds."
Add-P "Vercel's CDN is automatic. You configure nothing. It happens by default on every deployment."

Add-H2 "Domain Names and DNS"
Add-P "A domain name (theconnek.com) is a human-readable address. Under the hood, the internet works on IP addresses — numerical addresses like 172.64.155.12. Typing that into a browser would work, but it is impossible to remember."
Add-P "DNS (Domain Name System) is a global directory that translates domain names to IP addresses. When you type theconnek.com, DNS looks up the IP address and connects you to the right server."
Add-P "To connect theconnek.com to Vercel: you add DNS records at the domain registrar pointing to Vercel's servers. Vercel automatically issues an SSL certificate (makes it HTTPS) via Let's Encrypt — free and auto-renewing."
Add-P "We did this for both theconnek.com (international) and theconnek.in (India-specific). Both point to the same Vercel deployment."

Add-H2 "Preview Deployments"
Add-P "Every push to any GitHub branch (not just main) creates a preview deployment — a unique URL for that version of code. Example: push a branch called new-about-page and Vercel gives you new-about-page-theconnek.vercel.app."
Add-P "Share that URL with anyone to review the changes. Real users at theconnek.com see nothing different until you merge to main. This is how you test changes safely."

Add-H2 "Rollbacks"
Add-P "Every deployment is saved. If you push a bad update and the site breaks, go to the Vercel dashboard, click any previous deployment, and click Promote. It goes live in seconds. No git revert, no code change, no redeploy needed."

# ── PART 6 ──
Add-PB
Add-H1 "Part 6: Git and GitHub"
Add-Line

Add-H2 "What Is Git?"
Add-P "Git is a version control system. It tracks every change you make to your code — what changed, when, and a message describing why. Think of it as a permanent, never-clearing undo history for your entire codebase."
Add-P "Every time you run git commit, you create a snapshot of the codebase at that exact moment. You can return to any snapshot at any time."

Add-H2 "What Is GitHub?"
Add-P "GitHub is a website that hosts your Git history in the cloud. It stores all your commits, branches, and history — accessible from any device, shareable with anyone."
Add-P "The Connek codebase lives at github.com/bafnakhushi111-tech/theconnek. Vercel is connected to this repository and deploys automatically on every push to main."

Add-H2 "The Basic Git Workflow"
Add-P "1. Write or change code on your laptop."
Add-P "2. git add <filename> stages the changed files — marks them to be saved."
Add-P "3. git commit -m 'describe what you did' saves a snapshot with a description."
Add-P "4. git push uploads your commits to GitHub."
Add-P "5. Vercel sees the push, builds, and deploys. Site is live."

Add-H2 "Why Git Matters for Placement"
Add-P "Every serious tech company uses Git. Knowing it is table stakes for any technical role. More importantly, having a real GitHub repo with commit history shows:"
Add-Bullet "You actually built something, not just followed a tutorial"
Add-Bullet "You understand professional development workflows"
Add-Bullet "Interviewers can look at your actual code"

# ── PART 7 ──
Add-PB
Add-H1 "Part 7: Instagram — The Social Presence"
Add-Line

Add-H2 "Why Instagram for Connek?"
Add-P "Connek's target audience — MBA students, BBA/BCom graduates, early-career professionals — is primarily on Instagram in India. It is where they consume career content, discover communities, and follow brands they trust."
Add-P "LinkedIn is more formal and populated by people already deep in their careers. Instagram is where you reach people who are still figuring it out — exactly who Connek serves."
Add-P "The handle @theconnek is consistent with the domain (theconnek.com) and email (hello@theconnek.com). One brand identity across every surface."

Add-H2 "Current Status in the Code"
Add-P "The footer currently shows an Instagram link pointing to instagram.com/theconnek. We deliberately show only Instagram and not LinkedIn or X (Twitter) because those accounts are not yet active. Showing a broken or empty social link destroys trust faster than having no link at all."
Add-P "When LinkedIn and X accounts are active and have content, we add them to the footer's social links array in Footer.tsx."

Add-H2 "What Instagram Is For (in the Connek context)"
Add-P "Instagram for Connek is not about selling. It is about showing up where the audience already is and building enough trust that they visit theconnek.com."
Add-Bullet "Short career advice posts: things no one tells you before consulting recruiting"
Add-Bullet "Behind-the-scenes of building Connek: honest founder content"
Add-Bullet "Resharing community wins: testimonials and stories (with permission)"
Add-Bullet "Reels explaining the Connek value: real conversations vs cold DMs"
Add-P "Every post should drive traffic back to theconnek.com via the link in bio. The goal is awareness to signup conversion."

Add-H2 "How Instagram Connects to the Tech Stack"
Add-P "Instagram is not integrated into the Connek codebase technically right now. It is a separate platform managed manually — posting content, replying to DMs, growing followers."
Add-P "In a future version, you could use Instagram's Graph API to display your latest posts directly on the Connek website — a live social feed. That would require OAuth authentication and API calls. It is a Phase 2 idea."

# ── PART 8 ──
Add-PB
Add-H1 "Part 8: SEO — Getting Found on Google"
Add-Line

Add-H2 "What Is SEO?"
Add-P "SEO stands for Search Engine Optimisation. It is the set of practices that make your website appear higher in Google search results for relevant search terms."
Add-P "When someone Googles career networking platform India or how to get a job in consulting, you want theconnek.com to appear. The higher you rank, the more people visit without you spending money on ads."

Add-H2 "How Google Works (Simplified)"
Add-P "Google has automated robots called crawlers that constantly visit websites, read their content, and add them to Google's index (a giant searchable database of the entire internet). When someone searches, Google instantly looks through its index and ranks pages by relevance, quality, and authority."

Add-H2 "What We Built for SEO"
Add-B "sitemap.ts: " "Generates /sitemap.xml — an XML file listing all pages on the site with their last-updated dates. Google reads this to know exactly what to crawl. Without it, Google discovers pages only by following links — slower and often incomplete."
Add-B "robots.ts: " "Generates /robots.txt — tells Google's crawlers which pages they can and cannot access. We allow all pages and point to the sitemap URL."
Add-B "Meta tags in layout.tsx: " "We set the page title and description that appear in Google search results — the blue clickable title and the grey description under it."
Add-B "Server-side rendering: " "Google can read our content immediately because Next.js sends fully-formed HTML from the server. Client-only React apps send an empty page — Google would have to wait for JavaScript to run, which it often does not."
Add-B "OG image: " "When you share theconnek.com on WhatsApp or LinkedIn, a branded preview card with the Connek logo appears. Links with preview images get significantly more clicks than bare URLs. We built this using Next.js's built-in next/og library in app/opengraph-image.tsx."

# ── PART 9 ──
Add-PB
Add-H1 "Part 9: Analytics — Understanding Your Visitors"
Add-Line

Add-H2 "Google Analytics 4 (GA4)"
Add-P "GA4 is Google's free platform for tracking website traffic. You add a small JavaScript snippet and it tracks everything:"
Add-Bullet "How many people visited and when"
Add-Bullet "Where they came from — direct URL, Instagram bio link, WhatsApp share, Google search"
Add-Bullet "Which pages they visited and in what order"
Add-Bullet "How long they stayed on each page"
Add-Bullet "What device and country they are on"
Add-Bullet "Funnel analysis — how many people clicked Join vs actually completed the form"
Add-P "To activate: get a GA4 Measurement ID (format: G-XXXXXXXXXX) from analytics.google.com. Add it as NEXT_PUBLIC_GA_ID in Vercel's environment variable settings. Done — analytics turns on automatically."

Add-H2 "Microsoft Clarity"
Add-P "Clarity is Microsoft's free behavioural analytics tool. While GA4 gives you numbers, Clarity gives you visual evidence of what users actually do."
Add-B "Session recordings: " "Watch a video of a real user visiting your site — see exactly where they moved their mouse, what they clicked, where they got confused, where they gave up."
Add-B "Heatmaps: " "A colour map showing which parts of the page users click most. Red = high clicks, blue = low clicks. Immediately shows if your CTA button is getting attention or being completely ignored."
Add-B "Scroll depth maps: " "Shows what percentage of users scroll past each point. If 80% of users never scroll past the hero section, everything below it is invisible to most visitors."
Add-P "ANALOGY: GA4 is your car's dashboard — speed, fuel, distance. Clarity is a dashcam recording every trip — you can watch exactly what happened."
Add-P "To activate: create a project at clarity.microsoft.com, get the Project ID, add it as NEXT_PUBLIC_CLARITY_ID in Vercel."

Add-H2 "How the Analytics Scaffold Works"
Add-P "We created Analytics.tsx — a component that checks whether the environment variables are set. If NEXT_PUBLIC_GA_ID is set, it loads the GA4 script. If NEXT_PUBLIC_CLARITY_ID is set, it loads the Clarity script. If neither is set, the component renders nothing."
Add-P "This means: running the site locally for development generates zero analytics noise. Deploying to Vercel with the env vars set activates analytics automatically. No code change ever needed — just add or remove the env var."

# ── PART 10 ──
Add-PB
Add-H1 "Part 10: Legal Pages"
Add-Line

Add-H2 "Why Legal Pages Are Non-Negotiable"
Add-P "India's Digital Personal Data Protection Act (DPDP Act, 2023) requires any platform collecting personal data from Indian users to: clearly inform users about what data is collected and why, provide a way to request deletion, and publish a Privacy Policy. We collect names and email addresses. That is personal data. Without a Privacy Policy, we are legally exposed."

Add-H2 "Privacy Policy (/privacy)"
Add-P "Our Privacy Policy covers: what data is collected (name, email, college/company, role, user type), why it is collected (to manage the Connek community waitlist), how it is stored (Supabase PostgreSQL), who has access (Connek team and Supabase as processor), and how users can request deletion (email us)."
Add-P "Written to comply with both the DPDP Act (India) and GDPR (EU). Flagged for formal legal review before the site scales."

Add-H2 "Terms of Service (/terms)"
Add-P "Terms of Service is the legal contract between Connek and its users. It covers: what the platform is and is not (not a job board, not a recruiter), what users can and cannot do, that we are not responsible for outcomes of conversations, our right to remove accounts that violate the terms, and how disputes are handled."
Add-P "Without Terms of Service, a user could make any claim about the platform and there is no documented agreement to reference."

Add-H2 "Footer Links"
Add-P "Both pages are linked in the footer on every page. We used a shared LegalPage.tsx component so both Privacy and Terms pages have the same layout — consistent styling, no code duplication."

# ── PART 11 ──
Add-PB
Add-H1 "Part 11: How Everything Connects"
Add-Line

Add-H2 "The Complete Flow — From Visitor to Your Inbox"
Add-P "USER VISITS theconnek.com"
Add-P "Their browser sends a GET request to Vercel. Vercel serves the pre-rendered HTML of page.tsx. The browser downloads the JavaScript bundle, React hydrates (makes it interactive), and Framer Motion runs the entrance animations. The page is live."
Add-Blank
Add-P "USER FILLS THE FORM AND CLICKS JOIN"
Add-P "React's handleSubmit function fires. It sets loading to true (button shows Joining...). It sends a POST request to /api/waitlist with the form data as JSON in the request body."
Add-Blank
Add-P "VERCEL PROCESSES THE API CALL"
Add-P "Vercel spins up the serverless function in route.ts. It validates all fields are present. It reads secret keys from environment variables. It calls Supabase to insert the row. If the email is a duplicate (error 23505), it returns a 409 error. Otherwise it calls Resend to send you a notification. It returns { success: true }."
Add-Blank
Add-P "BROWSER RECEIVES SUCCESS"
Add-P "React receives the success response. It calls router.push('/thank-you'). The user lands on the thank-you page with WhatsApp, X, and copy-link share buttons."
Add-Blank
Add-P "YOU GET NOTIFIED"
Add-P "An HTML-formatted email arrives in bafnakhushi111@gmail.com. From: hello@theconnek.com. Subject: New Candidate signup: [Name]. Body: a clean table with name, email, college, role, and IST timestamp."

# ── PART 12 ──
Add-PB
Add-H1 "Part 12: Interview Prep"
Add-Line

Add-H2 "How to Introduce the Project"
Add-P "SAY THIS:"
Add-P "'I built Connek — a community platform for career conversations between students and working professionals. It is a full-stack web application: React frontend in Next.js, serverless API backend on Vercel, PostgreSQL database through Supabase, and transactional email through Resend. The site is live at theconnek.com.'"
Add-Blank
Add-P "NOT THIS:"
Add-P "'I made a website for networking using some coding stuff.'"

Add-H2 "Common Questions and Strong Answers"
Add-B "Q: What is your tech stack and why? " ""
Add-P "Next.js with TypeScript for full-stack — it gives React, API routes, SSR, and Vercel deployment in one framework. Supabase for hosted PostgreSQL with zero server management. Resend for transactional email from our own domain. Vercel for deployment — auto-deploys on every git push."
Add-Blank
Add-B "Q: How does the signup flow work end to end? " ""
Add-P "User submits the form, React sends a POST to /api/waitlist — a serverless function on Vercel. It validates input, inserts a row into Supabase Postgres, triggers a Resend notification email to me, and returns success. The browser redirects to the thank-you page."
Add-Blank
Add-B "Q: Why are API keys not in the frontend code? " ""
Add-P "If a secret key is in client-side JavaScript, anyone can open DevTools and steal it. Our keys live only in Vercel's environment variables — injected server-side at runtime. The browser only receives a JSON success or error response."
Add-Blank
Add-B "Q: What is serverless and why use it? " ""
Add-P "Serverless means the function runs only when called, not 24/7. Vercel spins up a container, runs the code, tears it down. Benefits: automatic scaling, zero server management, pay only for actual compute. For an early-stage product this is ideal."
Add-Blank
Add-B "Q: How do you handle duplicate signups? " ""
Add-P "Supabase has a unique constraint on the email column. Duplicate inserts return Postgres error code 23505. We catch that specifically and return a 409 with a clear message instead of a generic server error."
Add-Blank
Add-B "Q: What would you improve? " ""
Add-P "Three things: rate limiting on the API to prevent spam (anyone can currently script unlimited fake signups), email verification before storing (confirm the address is real), and migrate off Supabase free tier before scaling (the 7-day pause is a reliability risk)."

# ── GLOSSARY ──
Add-PB
Add-H1 "Quick Reference Glossary"
Add-Line

$terms = @(
    @("API","A defined contract for how two pieces of software communicate with each other"),
    @("App Router","Next.js routing system where folder structure equals URL structure"),
    @("Backend","Server-side code invisible to users — handles data, logic, and secrets"),
    @("CDN","Content Delivery Network — global servers serving your site's files from nearby locations"),
    @("Component","A reusable piece of React UI — like a Lego brick (Logo, Footer, Mentors)"),
    @("CSS","The language that styles websites — colours, fonts, spacing, layout"),
    @("Database","Organised, permanent storage for data — survives restarts and power cuts"),
    @("DKIM","Email authentication standard proving an email was sent by an authorised server"),
    @("DNS","Domain Name System — translates theconnek.com into a server IP address"),
    @("Domain email","An email using your own domain — hello@theconnek.com vs @gmail.com"),
    @("DPDP Act","India's 2023 data privacy law requiring Privacy Policy for personal data collection"),
    @("Environment variables","Secrets stored outside code, injected at runtime by the platform (Vercel)"),
    @("Framer Motion","React animation library — scroll reveals, crossfades, hover effects, staggered reveals"),
    @("Frontend","Everything the user sees — runs in the browser on their device"),
    @("GA4","Google Analytics 4 — tracks traffic, sources, page views, and conversion funnels"),
    @("GET","HTTP method meaning give me data — used when loading any page"),
    @("Git","Version control system — tracks every code change and lets you go back in time"),
    @("GitHub","Cloud hosting for Git repositories — where the Connek code lives online"),
    @("HTML","The structure of a webpage — headings, paragraphs, buttons, images"),
    @("HTTP/HTTPS","Protocol browsers and servers use to communicate — HTTPS is encrypted"),
    @("JavaScript","The programming language of the web — runs in browsers and on servers"),
    @("JSON","Standard text format for sending structured data between browser and server"),
    @("Microsoft Clarity","Behavioural analytics — session recordings and click heatmaps"),
    @("Next.js","React framework with routing, API routes, SSR, and Vercel deployment built in"),
    @("npm","Node Package Manager — installs external libraries into your project"),
    @("OG Image","The preview image shown when you share a link on WhatsApp or LinkedIn"),
    @("POST","HTTP method meaning here is data, process it — used when submitting a form"),
    @("PostgreSQL","Open-source relational database used by Instagram, Spotify, Reddit"),
    @("React","JavaScript library by Meta for building component-based user interfaces"),
    @("Resend","Transactional email API — sends automated emails from your own domain"),
    @("REST API","API using URLs and HTTP methods — the most common style of web API"),
    @("robots.txt","File telling Google which pages to crawl or skip"),
    @("Serverless","Code that runs in the cloud only when called — no always-on server"),
    @("SEO","Search Engine Optimisation — practices that improve Google ranking"),
    @("Sitemap","XML file listing all pages — helps Google index your site faster"),
    @("SPF","Email authentication record listing servers allowed to send for your domain"),
    @("SSL/HTTPS","Encryption for web traffic — Vercel issues SSL certificates automatically"),
    @("State","Data inside a React component that can change — triggers a re-render when it does"),
    @("Supabase","Hosted PostgreSQL with a JavaScript client — database without server management"),
    @("Tailwind CSS","Utility-first CSS — write styles as class names directly in JSX"),
    @("Transactional email","Automated, event-triggered email — signup notifications, confirmations"),
    @("TypeScript","JavaScript with type safety — catches bugs before the code runs"),
    @("Vercel","Cloud deployment platform — git push and your site is live globally")
)

foreach ($item in $terms) {
    Set-N
    $sel.Font.Bold = $true
    $sel.TypeText($item[0] + ": ")
    $sel.Font.Bold = $false
    $sel.TypeText($item[1])
    $sel.TypeParagraph()
}

Add-Blank
Add-Line
Add-P "Connek Tech Guide | Khushi Bafna | IIT Jodhpur MBA | June 2026"

$doc.SaveAs([ref]$outputPath, [ref]16)
$doc.Close()
$word.Quit()
Write-Output "Done"
