import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient()

const app = express()

app.use(express.json())
app.use(cors())
require('dotenv').config();


app.post('/clients', async (req, res) => {

    await prisma.client.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            rua: req.body.rua,
            complemento: req.body.complemento,
            cidade: req.body.cidade
        }
    })
    res.status(201).json(req.body)
})

app.get('/clients', async (req, res) => {
    let Clients = []

    if (Object.keys(req.query).length > 0) { // Verifica se há parâmetros na query
        Clients = await prisma.client.findMany({
            where: {
                ...(req.query.name && { name: req.query.name }),
                ...(req.query.email && { email: req.query.email }),
                ...(req.query.telefone && { telefone: req.query.telefone }),
                ...(req.query.cpf && { cpf: req.query.cpf }),
                ...(req.query.rua && { rua: req.query.rua }),
                ...(req.query.complemento && { complemento: req.query.complemento }),
                ...(req.query.cidade && { cidade: req.query.cidade }),
            },
            include: {
                pets: true, // Inclui os pets associados a cada cliente
            },
        });
    } else {
        Clients = await prisma.client.findMany({
            include: {
                pets: true, // Inclui os pets associados a cada cliente
            },
        });
    }

    res.status(200).json(Clients)
})

app.put('/clients/:id', async (req, res) => {
    try {
        const updatedClient = await prisma.client.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                telefone: req.body.telefone,
                cpf: req.body.cpf,
                rua: req.body.rua,
                complemento: req.body.complemento,
                cidade: req.body.cidade
            }
        });

        // Retorne o cliente atualizado no corpo da resposta
        res.status(200).json(updatedClient);  // Retorna o cliente atualizado
    } catch (error) {
        res.status(404).json({ message: 'Cliente não encontrado' });  // Caso o cliente não exista
    }
});

app.delete('/clients/:id', async (req, res) => {
    await prisma.client.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({ message: 'Cliente deletado com sucesso!' })
})

app.post('/clients/:id/pets', async (req, res) => {
    try {
        const clientId = req.params.id;
        const { name, species, breed, age } = req.body;

        // Verifique se o cliente existe
        const client = await prisma.client.findUnique({
            where: { id: clientId }, // Certifique-se de que o campo `id` existe no schema do Prisma
            include: { pets: true },
        });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Crie o pet e relacione com o cliente
        const newPet = await prisma.pet.create({
            data: {
                name,
                species,
                breed,
                age,
                owner: {
                    connect: { id: clientId }, // Relaciona o pet ao cliente
                },
            },
        });

        res.status(201).json(newPet); // Retorne o pet criado
    } catch (error) {
        console.error('Erro ao adicionar pet:', error);
        res.status(500).json({ message: 'Erro ao adicionar pet', error: error.message });
    }
});



app.listen(3000)