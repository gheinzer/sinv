import { prisma, PrismaClient } from '@prisma/client';

var prismaClient = new PrismaClient();

async function main() {
    var users = await prismaClient.post.findMany();
    console.log(users);
    await prismaClient.$disconnect();
}

main();
