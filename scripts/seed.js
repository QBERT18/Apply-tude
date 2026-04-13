import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Defaults to the local dev DB. To seed the production DB instead,
// run: NODE_ENV=production node --env-file=.env scripts/seed.js
const isProduction = process.env.NODE_ENV === "production";
const envVar = isProduction ? "MONGODB_URI" : "MONGODB_URI_DEV";
const MONGODB_URI = process.env[envVar];
if (!MONGODB_URI) {
  console.error(`${envVar} is not set. Run with: node --env-file=.env scripts/seed.js`);
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const ApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    slug: { type: String, required: true, trim: true, immutable: true },
    jobName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    companyWebpage: { type: String, required: true, trim: true },
    applicationEmail: { type: String, required: true, trim: true, lowercase: true },
    contactName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, required: true },
    categories: { type: [String], default: [] },
  },
  { timestamps: true }
);

ApplicationSchema.index({ slug: 1, userId: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

function slugify(input) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function makeSlug(jobName, companyName) {
  const base = [slugify(jobName), slugify(companyName)].filter(Boolean).join("-");
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : suffix;
}

// ---------------------------------------------------------------------------
// Data pools
// ---------------------------------------------------------------------------

const companies = [
  { name: "Stripe", url: "https://stripe.com", email: "careers@stripe.com" },
  { name: "Notion", url: "https://notion.so", email: "jobs@notion.so" },
  { name: "Linear", url: "https://linear.app", email: "hiring@linear.app" },
  { name: "Apple", url: "https://apple.com", email: "jobs@apple.com" },
  { name: "GitLab", url: "https://gitlab.com", email: "careers@gitlab.com" },
  { name: "Shopify", url: "https://shopify.com", email: "talent@shopify.com" },
  { name: "Snowflake", url: "https://snowflake.com", email: "careers@snowflake.com" },
  { name: "Anthropic", url: "https://anthropic.com", email: "jobs@anthropic.com" },
  { name: "Cloudflare", url: "https://cloudflare.com", email: "hiring@cloudflare.com" },
  { name: "Vercel", url: "https://vercel.com", email: "careers@vercel.com" },
  { name: "Figma", url: "https://figma.com", email: "jobs@figma.com" },
  { name: "Supabase", url: "https://supabase.com", email: "hiring@supabase.com" },
  { name: "Render", url: "https://render.com", email: "talent@render.com" },
  { name: "Discord", url: "https://discord.com", email: "jobs@discord.com" },
  { name: "Robinhood", url: "https://robinhood.com", email: "careers@robinhood.com" },
  { name: "Amazon Web Services", url: "https://aws.amazon.com", email: "aws-jobs@amazon.com" },
  { name: "Datadog", url: "https://datadoghq.com", email: "hiring@datadoghq.com" },
  { name: "HashiCorp", url: "https://hashicorp.com", email: "jobs@hashicorp.com" },
  { name: "Twilio", url: "https://twilio.com", email: "careers@twilio.com" },
  { name: "Plaid", url: "https://plaid.com", email: "jobs@plaid.com" },
  { name: "Retool", url: "https://retool.com", email: "hiring@retool.com" },
  { name: "Postman", url: "https://postman.com", email: "careers@postman.com" },
  { name: "MongoDB", url: "https://mongodb.com", email: "jobs@mongodb.com" },
  { name: "Grafana Labs", url: "https://grafana.com", email: "hiring@grafana.com" },
  { name: "Sentry", url: "https://sentry.io", email: "careers@sentry.io" },
  { name: "Netlify", url: "https://netlify.com", email: "jobs@netlify.com" },
  { name: "PlanetScale", url: "https://planetscale.com", email: "hiring@planetscale.com" },
  { name: "Tailwind Labs", url: "https://tailwindcss.com", email: "jobs@tailwindlabs.com" },
  { name: "Railway", url: "https://railway.app", email: "careers@railway.app" },
  { name: "Fly.io", url: "https://fly.io", email: "jobs@fly.io" },
];

const jobTitles = [
  "Senior Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "iOS Developer",
  "DevOps Engineer",
  "Junior Software Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "Site Reliability Engineer",
  "Engineering Manager",
  "Frontend Developer",
  "Platform Engineer",
  "Product Engineer",
  "Staff Software Engineer",
  "Mobile Engineer",
  "Solutions Architect",
  "Tech Lead",
  "Security Engineer",
  "Cloud Engineer",
  "QA Engineer",
  "Infrastructure Engineer",
  "API Engineer",
  "React Developer",
  "Node.js Engineer",
  "Systems Engineer",
];

const contactFirstNames = [
  "Alex", "Priya", "Marcus", "Sarah", "Emma", "Olivia", "Vikram", "Hannah",
  "Diego", "Yuki", "Liam", "Sofia", "Nathan", "Isabella", "Daniel", "Aisha",
  "Robert", "Chen", "Fatima", "Kenji", "Anna", "James", "Maya", "Oscar", "Zara",
];

const contactLastNames = [
  "Chen", "Patel", "Hoffman", "Kim", "Wilson", "Brown", "Iyer", "Lee",
  "Ramirez", "Tanaka", "O'Connor", "Garcia", "Park", "Rossi", "Kowalski",
  "Khan", "Müller", "Zhang", "Hassan", "Nakamura", "Schmidt", "Taylor",
  "Singh", "Fernandez", "Larsson",
];

const categoryPools = [
  ["Frontend", "React", "Remote"],
  ["Backend", "Node.js", "Remote"],
  ["Full-Stack", "Remote", "Startup"],
  ["Mobile", "iOS", "Onsite"],
  ["DevOps", "Cloud", "Remote"],
  ["Data", "Python", "Hybrid"],
  ["ML", "AI", "Remote"],
  ["Security", "Cloud", "Onsite"],
  ["Management", "Leadership", "Hybrid"],
  ["Frontend", "TypeScript", "Hybrid"],
  ["Backend", "Go", "Remote"],
  ["Full-Stack", "Senior", "Enterprise"],
  ["Platform", "Kubernetes", "Remote"],
  ["Mobile", "Android", "Onsite"],
  ["Infrastructure", "AWS", "Remote"],
];

const seniority = ["Junior", "Mid", "Senior", "Staff", "Lead"];

// Status distribution: ~30 applied, ~20 interviewing, ~15 rejected,
// ~10 ghosted, ~8 saved, ~7 offer, ~5 accepted, ~5 withdrawn
const statusPool = [
  ...Array(30).fill("applied"),
  ...Array(20).fill("interviewing"),
  ...Array(15).fill("rejected"),
  ...Array(10).fill("ghosted"),
  ...Array(8).fill("saved"),
  ...Array(7).fill("offer"),
  ...Array(5).fill("accepted"),
  ...Array(5).fill("withdrawn"),
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate a random date within a month range (months ago from now).
// More recent months get more applications (weighted distribution).
function randomDateInPastYear() {
  const now = new Date();
  // Weight toward recent months: pick from 0–11 with bias toward lower numbers
  const r = Math.random();
  const monthsAgo = Math.floor(Math.pow(r, 0.6) * 12); // bias toward recent
  const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  const day = 1 + Math.floor(Math.random() * daysInMonth);
  const hour = Math.floor(Math.random() * 14) + 8; // 8am–10pm
  const minute = Math.floor(Math.random() * 60);
  return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day, hour, minute);
}

function generateEntries(count) {
  const statuses = shuffle(statusPool).slice(0, count);
  const entries = [];

  for (let i = 0; i < count; i++) {
    const company = pick(companies);
    const jobTitle = pick(jobTitles);
    const firstName = pick(contactFirstNames);
    const lastName = pick(contactLastNames);
    const cats = [...pick(categoryPools), pick(seniority)];
    const createdAt = randomDateInPastYear();
    // updatedAt is 0–14 days after createdAt
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000);

    entries.push({
      jobName: jobTitle,
      companyName: company.name,
      companyWebpage: company.url,
      applicationEmail: company.email,
      contactName: `${firstName} ${lastName}`,
      contactPhone: `+1-555-${String(1000 + i).slice(-4)}`,
      contactEmail: `${firstName.toLowerCase()}@${company.url.replace("https://", "")}`,
      status: statuses[i],
      categories: [...new Set(cats)],
      createdAt,
      updatedAt,
    });
  }

  return entries;
}

async function main() {
  console.log(`Connecting to ${MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });

  // Drop old data
  await Application.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared existing data.");

  // Create admin user
  const passwordHash = await bcrypt.hash("admin", 10);
  const admin = await User.create({
    name: "admin",
    email: "admin@admin.de",
    passwordHash,
  });
  console.log(`Created admin user: ${admin.email} (id: ${admin._id})`);

  // Generate 100 applications
  const entries = generateEntries(100);

  // Use raw collection insert to set createdAt/updatedAt directly
  // (bypasses Mongoose timestamps auto-generation)
  const docs = entries.map((entry) => ({
    ...entry,
    userId: admin._id,
    slug: makeSlug(entry.jobName, entry.companyName),
  }));

  await Application.collection.insertMany(docs);
  console.log(`Inserted ${docs.length} application(s) for admin.`);

  const total = await Application.countDocuments();
  console.log(`Total applications in DB: ${total}`);

  // Print status breakdown
  const statusCounts = {};
  for (const doc of docs) {
    statusCounts[doc.status] = (statusCounts[doc.status] || 0) + 1;
  }
  console.log("Status breakdown:", statusCounts);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
