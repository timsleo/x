import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const mockAppointments = [
  {
    id: 1,
    date: new Date(2024, 2, 20, 9, 0),
    clientName: 'Maria Santos',
    petName: 'Thor',
    service: 'Consulta de Rotina'
  },
  // Add more mock appointments
];

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeek, i));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Novo Agendamento
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => setCurrentWeek(date => addDays(date, -7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="grid grid-cols-7 gap-4 flex-1 text-center">
          {weekDays.map((date, i) => (
            <div
              key={i}
              className={`cursor-pointer p-2 rounded-lg ${
                isSameDay(date, selectedDate)
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-xs font-medium">
                {format(date, 'EEE', { locale: ptBR })}
              </div>
              <div className="text-lg font-semibold">
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentWeek(date => addDays(date, 7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Time Slots Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 divide-y">
          {timeSlots.map((time, i) => (
            <div key={i} className="p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{time}</span>
                {mockAppointments.some(apt => 
                  isSameDay(apt.date, selectedDate) && 
                  format(apt.date, 'HH:mm') === time
                ) ? (
                  <div className="ml-4 flex-1">
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                      <div className="font-medium text-indigo-900">
                        {mockAppointments.find(apt => 
                          isSameDay(apt.date, selectedDate) && 
                          format(apt.date, 'HH:mm') === time
                        )?.clientName}
                      </div>
                      <div className="text-sm text-indigo-700">
                        {mockAppointments.find(apt => 
                          isSameDay(apt.date, selectedDate) && 
                          format(apt.date, 'HH:mm') === time
                        )?.service}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button className="ml-4 text-sm text-indigo-600 hover:text-indigo-800">
                    + Agendar horário
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Appointments;