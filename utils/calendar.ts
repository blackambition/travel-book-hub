
import { Itinerary, Activity, DayPlan } from '../types';

export const exportToICS = (itinerary: Itinerary) => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AuraNodes//Biological Travel Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  itinerary.days.forEach((day: DayPlan) => {
    day.activities.forEach((activity: Activity) => {
      const datePart = new Date(day.date);
      const startTime = activity.time;
      
      const year = datePart.getFullYear();
      const month = String(datePart.getMonth() + 1).padStart(2, '0');
      const date = String(datePart.getDate()).padStart(2, '0');
      
      const timeMatch = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hours = 10;
      let minutes = 0;
      if (timeMatch) {
        hours = parseInt(timeMatch[1]);
        minutes = parseInt(timeMatch[2]);
        if (timeMatch[3].toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (timeMatch[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
      }
      
      const startStr = `${year}${month}${date}T${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}00`;
      
      const endDate = new Date(datePart);
      endDate.setHours(hours, minutes + (activity.duration_mins || 60));
      const endYear = endDate.getFullYear();
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDateVal = String(endDate.getDate()).padStart(2, '0');
      const endHours = String(endDate.getHours()).padStart(2, '0');
      const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
      const endStr = `${endYear}${endMonth}${endDateVal}T${endHours}${endMinutes}00`;

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${activity.activity.replace(/\s/g, '')}-${Date.now()}@auranodes.ai`);
      icsContent.push(`DTSTAMP:${startStr}Z`);
      icsContent.push(`DTSTART:${startStr}`);
      icsContent.push(`DTEND:${endStr}`);
      icsContent.push(`SUMMARY:[${activity.type}] ${activity.activity}`);
      icsContent.push(`LOCATION:${activity.location}`);
      icsContent.push(`DESCRIPTION:${activity.description.replace(/\n/g, '\\n')} | Bio-Impact: ${activity.biological_impact}`);
      if (activity.verification_url) {
        icsContent.push(`URL:${activity.verification_url}`);
      }
      icsContent.push('END:VEVENT');
    });
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `AuraNodes_${itinerary.itinerary_name.replace(/\s/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
