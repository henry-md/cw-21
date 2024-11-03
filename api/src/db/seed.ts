import { db, connection } from "./index.js";
import { posts } from "./schema.js";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");
  await db.delete(posts);

  // Reset the auto-increment counters
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('posts')`);

  console.log("Inserting new seed data...");

  const sampleKeywords = [
    "technology",
    "innovation",
    "design",
    "development",
    "programming",
    "software",
    "hardware",
    "AI",
    "machine learning",
    "data science",
    "cloud computing",
    "cybersecurity",
  ];

  // Insert 100 sample posts
  for (let i = 0; i < 100; i++) {
    const randomKeywords = faker.helpers.arrayElements(sampleKeywords, {
      min: 1,
      max: 3,
    });
    const content = `${faker.lorem.sentence({ min: 10, max: 200 })} ${randomKeywords.join(" ")}`;

    await db.insert(posts).values({
      content,
      date: faker.date.recent({
        days: 5, // The range of days the date may be in the past.
      }), // Generates a random date in the recent past.
    });
  }

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });