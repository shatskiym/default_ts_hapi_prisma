/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import { PrismaClient } from '@prisma/client';
import { users } from "./seeds/index.js";

const prisma = new PrismaClient();

async function main() {
  const createdUsers = [];
  for (const userIndex in users) {
    if (Object.hasOwnProperty.call(users, userIndex)) {
      const user = users[userIndex];
      createdUsers.push(
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            encryptedPassword: user.encryptedPassword,
          },
        }),
      );
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-undef
    process.exit();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // eslint-disable-next-line no-undef
    process.exit(1);
  });
