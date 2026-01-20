import DailyView from '@/components/views/DailyView';
import WeekView from '@/components/views/WeekView';
import MonthView from '@/components/views/MonthView';
import SettingsView from '@/components/views/SettingsView';

export default function TabViews(props: any) {
  switch (props.currentView) {
    case 'daily':
      return <DailyView {...props} />;
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
