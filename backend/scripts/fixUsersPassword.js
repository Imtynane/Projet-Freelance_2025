const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: { password: null }
    });

    for (const user of users) {
        const hashed = await bcrypt.hash("changement123", 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed }
        });

        console.log(`Mot de passe mis à jour pour l'utilisateur ${user.email}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());