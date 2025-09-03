-- CreateTable
CREATE TABLE "public"."Perfil" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "tipoTelefone" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_cpf_key" ON "public"."Perfil"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_email_key" ON "public"."Perfil"("email");
