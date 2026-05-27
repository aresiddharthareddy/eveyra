const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dbDir = path.join(root, "db");
const storageDir = path.join(root, "storage", "uploads");

for (const dir of [dbDir, storageDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created ${dir}`);
  }
}

try {
  execSync("npx prisma db push", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env },
  });
  execSync("npx prisma generate", { cwd: root, stdio: "inherit" });

  const dbPath = path.join(dbDir, "everya.db");
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  prisma.user
    .count()
    .then((count) => {
      if (count === 0) {
        console.log("Seeding database...");
        execSync("npx tsx prisma/seed.ts", { cwd: root, stdio: "inherit" });
      }
      return prisma.$disconnect();
    })
    .catch(() => prisma.$disconnect());
} catch (e) {
  console.error("Database setup failed:", e.message);
  process.exit(1);
}
