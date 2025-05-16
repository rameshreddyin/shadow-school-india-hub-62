
import React from 'react';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'holiday' | 'event' | 'other';
  description?: string;
}

interface PrintableCalendarProps {
  events: CalendarEvent[];
  filterType: string;
}

const PrintableCalendar: React.FC<PrintableCalendarProps> = ({ events, filterType }) => {
  // Group events by month
  const eventsByMonth = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const monthKey = format(event.date, 'MMMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {});

  // Sort months chronologically
  const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  const getEventTypeStyle = (type: string): string => {
    switch (type) {
      case 'holiday':
        return 'text-red-700 border-red-200 bg-red-50';
      case 'exam':
        return 'text-purple-700 border-purple-200 bg-purple-50';
      case 'event':
        return 'text-blue-700 border-blue-200 bg-blue-50';
      default:
        return 'text-gray-700 border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="print-calendar p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Academic Calendar {new Date().getFullYear()}</h1>
        <p className="text-gray-600 mt-2">Vidya School Management System</p>
        {filterType !== 'all' && (
          <p className="text-sm font-medium mt-2 capitalize bg-gray-100 inline-block px-3 py-1 rounded-full">
            {filterType} Events Only
          </p>
        )}
      </div>

      <div className="space-y-8">
        {sortedMonths.map(month => (
          <div key={month} className="month-section">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">{month}</h2>
            <div className="grid grid-cols-1 gap-4">
              {eventsByMonth[month]
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(event => (
                  <div 
                    key={event.id} 
                    className={`p-3 rounded border ${getEventTypeStyle(event.type)} flex justify-between`}
                  >
                    <div>
                      <div className="text-sm uppercase font-bold">
                        {format(event.date, 'EEE, MMMM d')}
                      </div>
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-sm mt-1">{event.description}</div>
                      )}
                    </div>
                    <div className="text-xs px-2 py-1 h-fit rounded-full capitalize font-medium border">
                      {event.type}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center mt-8 pt-4 border-t">
        <p>Printed from Vidya School Management System</p>
        <p>Print date: {format(new Date(), 'MMMM d, yyyy')}</p>
      </div>
    </div>
  );
};

export default PrintableCalendar;
