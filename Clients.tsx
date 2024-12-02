import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from 'project/services/api';
import axios from 'axios';

type UpdateClientData = Partial<Omit<Client, 'id' | 'pets'>>;

interface Pet {
  name: string;
  species: string;
  breed: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  pets: Pet[];
}

function Clients() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [mockClients, setMockClients] = useState<Client[]>([]);

  async function getClients() {
    try {
      const response = await api.get('/clients');
      console.log('Dados da API:', response.data);
      setMockClients(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setMockClients([]); // Para garantir que o estado seja um array
    }
  }

  useEffect(() => {
    getClients();
  }, []);

  const handleAddPet = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsPetModalOpen(true);
  };

  const handleAddPetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const formData = new FormData(e.currentTarget);
    const newPet = {
      name: formData.get('name') as string,
      species: formData.get('species') as string,
      breed: formData.get('breed') as string,
      age: Number(formData.get('age')),
    };

    try {
      console.log('selectedClientId:', selectedClientId);
      const response = await axios.post(
        `http://localhost:3000/clients/${selectedClientId}/pets`,
        newPet
      );
      const createdPet = response.data;

      // Atualiza a lista de clientes com o novo pet
      setMockClients((prevClients) =>
        prevClients.map((client) =>
          client.id === selectedClientId
            ? { ...client, pets: [...(client.pets || []), createdPet] }
            : client
        )
      );
      setIsPetModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar pet:', error);
    }
  };

  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      cpf: formData.get('cpf') as string,
      rua: formData.get('rua') as string,
      complemento: formData.get('complemento') as string,
      pets: [], // Novo cliente começa sem pets
    };

    try {
      const response = await api.post('/clients', newClient);
      const createdClient = response.data;

      // Atualiza a lista de clientes com o novo cliente
      setMockClients((prevClients) => [...prevClients, createdClient]);
      setIsAddModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  const handleEditClient = async (clientId: string, updatedData: UpdateClientData) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/clients/${clientId}`,
        updatedData
      );
      console.log('Cliente atualizado:', response.data);

      // Atualiza a lista de clientes após a edição
      getClients();
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/clients/${clientId}`);
      console.log('Cliente deletado:', response.data);

      // Atualiza a lista de clientes após a remoção
      getClients();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clientes e Pets</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Adicionar Novo Cliente</h2>
            <form onSubmit={(e) => handleAddClient(e)}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CPF</label>
                  <input
                    type="cpf"
                    name="cpf"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    <u>Endereço:</u>
                  </label>
                  <div>
                    <label htmlFor="rua" className="block text-sm font-medium text-gray-700">
                      Rua
                    </label>
                    <input
                      type="text"
                      name="rua"
                      id="rua"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      id="complemento"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pets
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockClients && mockClients.length > 0 ? (
              mockClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {client.pets && Array.isArray(client.pets) && client.pets.length > 0 && client.pets.map((pet, petIndex) => (
                        <div key={petIndex} className="text-sm text-gray-500">
                          {pet.name} - {pet.species} ({pet.breed})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClient(client.id, { name: 'Novo Nome' })}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAddPet(client.id.toString())}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isPetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Adicionar Pet</h2>
            <form onSubmit={handleAddPetSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Espécie</label>
                  <select
                    name="species"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option>Cachorro</option>
                    <option>Gato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Raça</label>
                  <input
                    type="text"
                    name="breed"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Idade</label>
                  <input
                    type="number"
                    name="age"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPetModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
