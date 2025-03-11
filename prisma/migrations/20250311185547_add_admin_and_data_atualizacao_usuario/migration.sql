/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaFinanceira` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orcamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Categoria";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Conta";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MetaFinanceira";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Orcamento";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Transacao";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Usuario";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "conta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "saldo" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "conta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "contaId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    CONSTRAINT "transacao_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "conta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "orcamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valorLimite" REAL NOT NULL,
    "periodo" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    CONSTRAINT "orcamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orcamento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "valorMeta" REAL NOT NULL,
    "dataLimite" DATETIME NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "meta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "administrador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "administrador_email_key" ON "administrador"("email");
