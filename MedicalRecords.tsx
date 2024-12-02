import { useState } from 'react';
import { Search, FileText, Syringe, Stethoscope, TestTube } from 'lucide-react';

const mockRecords = [
  {
    id: 1,
    date: '2024-03-20',
    petName: 'Max',
    ownerName: 'João Silva',
    type: 'Consulta',
    description: 'Checkup de rotina',
    veterinarian: 'Dra. Ana Santos'
  },
  // Add more mock records
];

function MedicalRecords() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Histórico Médico</h1>
        <div className="flex gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Novo Registro
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por pet ou proprietário..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white">
          <option value="">Todos os tipos</option>
          <option value="consulta">Consultas</option>
          <option value="vacina">Vacinas</option>
          <option value="exame">Exames</option>
        </select>
      </div>

      {/* Records Timeline */}
      <div className="space-y-4">
        {mockRecords.map((record) => (
          <div key={record.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                {record.type === 'Consulta' && <Stethoscope className="h-6 w-6 text-indigo-600" />}
                {record.type === 'Vacina' && <Syringe className="h-6 w-6 text-indigo-600" />}
                {record.type === 'Exame' && <TestTube className="h-6 w-6 text-indigo-600" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.type} - {record.petName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Proprietário: {record.ownerName}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{record.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Veterinário: {record.veterinarian}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicalRecords;