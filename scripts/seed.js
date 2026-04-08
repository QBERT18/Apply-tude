import mongoose from "mongoose";

// Defaults to the local dev DB. To seed the production DB instead,
// run: NODE_ENV=production node --env-file=.env scripts/seed.js
const isProduction = process.env.NODE_ENV === "production";
const envVar = isProduction ? "MONGODB_URI_PROD" : "MONGODB_URI_DEV";
const MONGODB_URI = process.env[envVar];
if (!MONGODB_URI) {
  console.error(`${envVar} is not set. Run with: node --env-file=.env scripts/seed.js`);
  process.exit(1);
}

const ApplicationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, immutable: true },
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

const entries = [
  {
    jobName: "Senior Frontend Engineer",
    companyName: "Stripe",
    companyWebpage: "https://stripe.com",
    applicationEmail: "careers@stripe.com",
    contactName: "Alex Chen",
    contactPhone: "+1-415-555-0101",
    contactEmail: "alex.chen@stripe.com",
    status: "interviewing",
    categories: ["Frontend", "Senior", "Remote"],
  },
  {
    jobName: "Backend Engineer",
    companyName: "Notion",
    companyWebpage: "https://notion.so",
    applicationEmail: "jobs@notion.so",
    contactName: "Priya Patel",
    contactPhone: "+1-415-555-0102",
    contactEmail: "priya@notion.so",
    status: "applied",
    categories: ["Backend", "Remote", "Mid"],
  },
  {
    jobName: "Full-Stack Engineer",
    companyName: "Linear",
    companyWebpage: "https://linear.app",
    applicationEmail: "hiring@linear.app",
    contactName: "Marcus Hoffman",
    contactPhone: "+49-30-555-0103",
    contactEmail: "marcus@linear.app",
    status: "offer",
    categories: ["Full-Stack", "Remote", "Senior", "Startup"],
  },
  {
    jobName: "iOS Developer",
    companyName: "Apple",
    companyWebpage: "https://apple.com",
    applicationEmail: "jobs@apple.com",
    contactName: "Sarah Kim",
    contactPhone: "+1-408-555-0104",
    contactEmail: "skim@apple.com",
    status: "saved",
    categories: ["Mobile", "iOS", "Onsite", "Enterprise"],
  },
  {
    jobName: "DevOps Engineer",
    companyName: "GitLab",
    companyWebpage: "https://gitlab.com",
    applicationEmail: "careers@gitlab.com",
    contactName: "Tomáš Novák",
    contactPhone: "+420-2-555-0105",
    contactEmail: "tomas@gitlab.com",
    status: "accepted",
    categories: ["DevOps", "Remote", "Senior"],
  },
  {
    jobName: "Junior Software Engineer",
    companyName: "Shopify",
    companyWebpage: "https://shopify.com",
    applicationEmail: "talent@shopify.com",
    contactName: "Olivia Brown",
    contactPhone: "+1-613-555-0106",
    contactEmail: "olivia@shopify.com",
    status: "rejected",
    categories: ["Junior", "Remote", "Full-Stack"],
  },
  {
    jobName: "Data Engineer",
    companyName: "Snowflake",
    companyWebpage: "https://snowflake.com",
    applicationEmail: "careers@snowflake.com",
    contactName: "Vikram Iyer",
    contactPhone: "+1-650-555-0107",
    contactEmail: "vikram@snowflake.com",
    status: "applied",
    categories: ["Data", "Senior", "Hybrid"],
  },
  {
    jobName: "Machine Learning Engineer",
    companyName: "Anthropic",
    companyWebpage: "https://anthropic.com",
    applicationEmail: "jobs@anthropic.com",
    contactName: "Hannah Lee",
    contactPhone: "+1-415-555-0108",
    contactEmail: "hannah@anthropic.com",
    status: "interviewing",
    categories: ["ML", "Senior", "Hybrid"],
  },
  {
    jobName: "Site Reliability Engineer",
    companyName: "Cloudflare",
    companyWebpage: "https://cloudflare.com",
    applicationEmail: "hiring@cloudflare.com",
    contactName: "Diego Ramirez",
    contactPhone: "+1-415-555-0109",
    contactEmail: "diego@cloudflare.com",
    status: "applied",
    categories: ["DevOps", "Senior", "Remote"],
  },
  {
    jobName: "Engineering Manager",
    companyName: "Vercel",
    companyWebpage: "https://vercel.com",
    applicationEmail: "careers@vercel.com",
    contactName: "Emma Wilson",
    contactPhone: "+1-415-555-0110",
    contactEmail: "emma@vercel.com",
    status: "withdrawn",
    categories: ["Management", "Remote", "Senior"],
  },
  {
    jobName: "Frontend Developer",
    companyName: "Figma",
    companyWebpage: "https://figma.com",
    applicationEmail: "jobs@figma.com",
    contactName: "Yuki Tanaka",
    contactPhone: "+1-415-555-0111",
    contactEmail: "yuki@figma.com",
    status: "interviewing",
    categories: ["Frontend", "Mid", "Remote"],
  },
  {
    jobName: "Backend Engineer",
    companyName: "Supabase",
    companyWebpage: "https://supabase.com",
    applicationEmail: "hiring@supabase.com",
    contactName: "Liam O'Connor",
    contactPhone: "+353-1-555-0112",
    contactEmail: "liam@supabase.com",
    status: "applied",
    categories: ["Backend", "Remote", "Startup"],
  },
  {
    jobName: "Platform Engineer",
    companyName: "Render",
    companyWebpage: "https://render.com",
    applicationEmail: "talent@render.com",
    contactName: "Sofia Garcia",
    contactPhone: "+1-415-555-0113",
    contactEmail: "sofia@render.com",
    status: "saved",
    categories: ["Platform", "Remote", "Senior"],
  },
  {
    jobName: "Product Engineer",
    companyName: "Linear",
    companyWebpage: "https://linear.app",
    applicationEmail: "hiring@linear.app",
    contactName: "Marcus Hoffman",
    contactPhone: "+49-30-555-0114",
    contactEmail: "marcus@linear.app",
    status: "ghosted",
    categories: ["Full-Stack", "Mid", "Remote"],
  },
  {
    jobName: "Staff Software Engineer",
    companyName: "Discord",
    companyWebpage: "https://discord.com",
    applicationEmail: "jobs@discord.com",
    contactName: "Nathan Park",
    contactPhone: "+1-415-555-0115",
    contactEmail: "nathan@discord.com",
    status: "interviewing",
    categories: ["Staff", "Remote", "Backend"],
  },
  {
    jobName: "Mobile Engineer",
    companyName: "Robinhood",
    companyWebpage: "https://robinhood.com",
    applicationEmail: "careers@robinhood.com",
    contactName: "Isabella Rossi",
    contactPhone: "+1-650-555-0116",
    contactEmail: "isabella@robinhood.com",
    status: "rejected",
    categories: ["Mobile", "Android", "Mid"],
  },
  {
    jobName: "Solutions Architect",
    companyName: "Amazon Web Services",
    companyWebpage: "https://aws.amazon.com",
    applicationEmail: "aws-jobs@amazon.com",
    contactName: "Robert Müller",
    contactPhone: "+49-30-555-0117",
    contactEmail: "robmuller@amazon.com",
    status: "saved",
    categories: ["Architecture", "Hybrid", "Senior", "Enterprise"],
  },
  {
    jobName: "Tech Lead",
    companyName: "Datadog",
    companyWebpage: "https://datadoghq.com",
    applicationEmail: "hiring@datadoghq.com",
    contactName: "Aisha Khan",
    contactPhone: "+1-212-555-0118",
    contactEmail: "aisha@datadoghq.com",
    status: "offer",
    categories: ["Tech Lead", "Senior", "Remote"],
  },
  {
    jobName: "Frontend Engineer",
    companyName: "Vercel",
    companyWebpage: "https://vercel.com",
    applicationEmail: "careers@vercel.com",
    contactName: "Emma Wilson",
    contactPhone: "+1-415-555-0119",
    contactEmail: "emma@vercel.com",
    status: "applied",
    categories: ["Frontend", "Mid", "Remote"],
  },
  {
    jobName: "Security Engineer",
    companyName: "HashiCorp",
    companyWebpage: "https://hashicorp.com",
    applicationEmail: "jobs@hashicorp.com",
    contactName: "Daniel Kowalski",
    contactPhone: "+1-415-555-0120",
    contactEmail: "daniel@hashicorp.com",
    status: "interviewing",
    categories: ["Security", "Senior", "Remote"],
  },
];

async function main() {
  console.log(`Connecting to ${MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });

  const docs = entries.map((entry) => ({
    ...entry,
    slug: makeSlug(entry.jobName, entry.companyName),
  }));

  const inserted = await Application.insertMany(docs);
  console.log(`Inserted ${inserted.length} application(s).`);

  const total = await Application.countDocuments();
  console.log(`Total applications in DB: ${total}`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
