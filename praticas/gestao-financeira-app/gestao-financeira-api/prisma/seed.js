import "dotenv/config"; // Carrega a sua DATABASE_URL do arquivo .env
import { prisma } from "../src/lib/prisma.js"; // Importa o cliente já configurado com o MySQL

const defaultCategories = [
  { name: "income",    displayName: "Renda",       icon: "work",                background: "#DE9AC3", isIncome: true,  isDefault: true },
  { name: "food",      displayName: "Alimentação", icon: "fastfood",            background: "#DEA17B", isIncome: false, isDefault: true },
  { name: "house",     displayName: "Casa",        icon: "home",                background: "#E6E088", isIncome: false, isDefault: true },
  { name: "education", displayName: "Educação",    icon: "book",                background: "#AB8FBE", isIncome: false, isDefault: true },
  { name: "travel",    displayName: "Viagens",     icon: "airplanemode-active", background: "#82C9DE", isIncome: false, isDefault: true },
];

async function main() {
  for (const c of defaultCategories) {
    await prisma.category.upsert({
      where: { id: c.name },
      update: {},
      create: { ...c, id: c.name },
    });
  }
  console.log("Seed concluído.");
}

main()
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })
  .finally(() => prisma.$disconnect());