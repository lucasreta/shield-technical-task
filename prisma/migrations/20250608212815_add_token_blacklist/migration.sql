-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY ("token")
);
