import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarPerfil = async (req, res) => {
  try {
    const { nome, sobrenome, cpf, tipoTelefone, telefone, email } = req.body;

    const perfil = await prisma.perfil.create({
      data: { nome, sobrenome, cpf, tipoTelefone, telefone, email },
    });

    res.status(201).json(perfil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao salvar perfil" });
  }
};
