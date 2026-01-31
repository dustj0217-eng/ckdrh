import DailyView from '@/components/views/DailyView';
import CalendarView from '@/components/views/CalendarView';
import WeekView from '@/components/views/WeekView';
import MonthView from '@/components/views/MonthView';
import SettingsView from '@/components/views/SettingsView';

export default function TabViews(props: any) {
  switch (props.currentView) {
    case 'daily':
      return <DailyView {...props} />;
    case 'calendar':
      return <CalendarView {...props} />;
    case 'week':
      return <WeekView {...props} />;
    case 'month':
      return <MonthView {...props} />;
    case 'settings':
      return <SettingsView {...props} />;
    default:
      return null;
  }
}
