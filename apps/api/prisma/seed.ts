import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    await prisma.user.upsert({
        where: {
            email: "aliasger@logifex.com",
        },
        update: {},
        create: {
            email: "aliasger@logifex.com",
            username: "aliasger",
            fullName: "Administrator",
            displayName: "Admin",
            passwordHash,
            role: UserRole.ADMIN,
            isActive: true,
        },
    });

    await prisma.user.upsert({
        where: {
            email: "burhanuddin@logifex.com",
        },
        update: {},
        create: {
            email: "burhanuddin@logifex.com",
            username: "burhanuddin",
            fullName: "Administrator",
            displayName: "Admin",
            passwordHash,
            role: UserRole.ADMIN,
            isActive: true,
        },
    });

    // await prisma.user.upsert({
    //     where: {
    //         email: "user@example.com",
    //     },
    //     update: {},
    //     create: {
    //         email: "user@example.com",
    //         username: "user",
    //         fullName: "Normal User",
    //         displayName: "User",
    //         passwordHash,
    //         role: UserRole.USER,
    //         isActive: true,
    //     },
    // });

    console.log("✅ Users created");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());