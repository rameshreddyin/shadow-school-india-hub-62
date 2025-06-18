
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, X } from 'lucide-react';
import { Timetable, Period } from '@/types/timetable';

interface PrintableTimetableProps {
  open: boolean;
  onClose: () => void;
  timetable: Timetable;
  classInfo: { class: string; section: string };
}

const PrintableTimetable: React.FC<PrintableTimetableProps> = ({
  open,
  onClose,
  timetable,
  classInfo
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Generate consistent colors for subjects
  const subjectColors = new Map<string, string>();
  const pastelColors = [
    '#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF5E5', '#F0E5FF',
    '#FFE5F0', '#E5FFFF', '#F5FFE5', '#FFE5F5', '#E5F0FF',
    '#FFFFE5', '#F0FFE5', '#E5FFE8', '#FFF0E5', '#E8E5FF'
  ];
  
  let colorIndex = 0;
  const getSubjectColor = (subjectName: string): string => {
    if (!subjectColors.has(subjectName)) {
      subjectColors.set(subjectName, pastelColors[colorIndex % pastelColors.length]);
      colorIndex++;
    }
    return subjectColors.get(subjectName) || '#F5F5F5';
  };
  
  // Get days and time slots
  const days = Object.keys(timetable.days);
  const timeSlotIds = new Set<string>();
  days.forEach(day => {
    Object.keys(timetable.days[day].slots).forEach(slotId => {
      timeSlotIds.add(slotId);
    });
  });
  
  const timeSlots = Array.from(timeSlotIds).sort((a, b) => {
    const slotA = a.split('-')[0];
    const slotB = b.split('-')[0];
    return parseInt(slotA) - parseInt(slotB);
  });
  
  const getTimeSlotLabel = (slotId: string) => {
    for (const day of days) {
      const period = timetable.days[day].slots[slotId];
      if (period && period.timeSlot) {
        return `${period.timeSlot.startTime} - ${period.timeSlot.endTime}`;
      }
    }
    const [number] = slotId.split('-');
    return `Period ${number}`;
  };
  
  const getDayName = (day: string): string => {
    const dayMap: Record<string, string> = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
    };
    return dayMap[day] || day;
  };
  
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    
    const originalDisplay = printContent.style.display;
    printContent.style.display = 'block';
    
    window.print();
    
    printContent.style.display = originalDisplay;
  };
  
  const handleDownloadPDF = () => {
    handlePrint();
  };

  const TimetableContent = () => (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Class {classInfo.class}{classInfo.section} – Weekly Timetable
        </h1>
        <div className="h-1 bg-blue-500 w-32 mx-auto rounded"></div>
      </div>
      
      {/* Timetable Grid */}
      <div className="overflow-visible">
        <table className="w-full border-collapse border-2 border-gray-300">
          {/* Header Row */}
          <thead>
            <tr>
              <th className="border-2 border-gray-300 p-3 text-left font-semibold text-gray-700 bg-gray-200">
                Time
              </th>
              {days.map(day => (
                <th 
                  key={day} 
                  className="border-2 border-gray-300 p-3 text-center font-semibold text-gray-700 bg-gray-200"
                >
                  {getDayName(day)}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Time Slots */}
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td className="border-2 border-gray-300 p-3 font-medium text-gray-600 bg-gray-50 text-sm whitespace-nowrap">
                  {getTimeSlotLabel(slot)}
                </td>
                {days.map(day => {
                  const period = timetable.days[day].slots[slot];
                  return (
                    <td 
                      key={`${day}-${slot}`}
                      className="border-2 border-gray-300 p-3 h-16 align-top"
                      style={{ 
                        backgroundColor: period ? getSubjectColor(period.subject.name) : '#F9F9F9'
                      }}
                    >
                      {period ? (
                        <div className="h-full flex flex-col justify-center">
                          <div className="font-semibold text-gray-800 text-sm leading-tight">
                            {period.subject.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {period.teacher.name}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          Free Period
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Generated by Akshara School Management System – www.aksharaschools.in
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Print Timetable - Class {classInfo.class}{classInfo.section}</span>
              <div className="flex space-x-2">
                <Button onClick={handlePrint} size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={onClose} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              Preview and print the weekly timetable for Class {classInfo.class}{classInfo.section}
            </DialogDescription>
          </DialogHeader>
          
          <div ref={printRef}>
            <TimetableContent />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 landscape;
              margin: 0.5in;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            body * {
              visibility: hidden;
            }
            
            [data-radix-portal] {
              display: none !important;
            }
            
            .print-timetable,
            .print-timetable * {
              visibility: visible !important;
            }
            
            .print-timetable {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: auto !important;
              background: white !important;
              font-family: Arial, sans-serif !important;
              display: block !important;
            }
            
            .print-timetable table {
              border-collapse: collapse !important;
              width: 100% !important;
              page-break-inside: avoid !important;
            }
            
            .print-timetable th,
            .print-timetable td {
              border: 2px solid #333 !important;
              padding: 8px !important;
              text-align: left !important;
              background-color: inherit !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-timetable th {
              background-color: #E5E7EB !important;
              font-weight: bold !important;
            }
            
            .print-timetable .bg-gray-50 {
              background-color: #F9FAFB !important;
            }
            
            .print-timetable .bg-gray-200 {
              background-color: #E5E7EB !important;
            }
            
            .print-timetable h1 {
              color: #1F2937 !important;
              font-size: 20px !important;
              font-weight: bold !important;
              margin-bottom: 8px !important;
              text-align: center !important;
            }
          }
        `
      }} />
      
      {/* Hidden print content */}
      <div className="print-timetable" style={{ display: 'none' }}>
        <TimetableContent />
      </div>
    </>
  );
};

export default PrintableTimetable;
