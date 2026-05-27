import "dotenv/config";
import { prisma } from './src/lib/prisma.js';

async function main() {
  try {
    const categories = await prisma.category.findMany();
    console.log(categories);
  } catch (e) {
    console.error(e);
  }
}
main();
