import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Ui/Tabs';
import CustomSelect from '../../../components/Ui/CustomSelect';
import { profileSharedCopy as copy } from '../profile.copy';

const TAB_GRID_COLUMNS = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

// Tabbed content: a dropdown on mobile and a tab bar on desktop.
// tabs is a list of { value, label, content }.
export default function ProfileTabs({ tabs, value, onChange }) {
  return (
    <>
      <div className="md:hidden mb-6">
        <CustomSelect
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={tabs.map(tab => ({ value: tab.value, label: tab.label }))}
          placeholder={copy.tabs.placeholder}
        />
      </div>

      <Tabs value={value} onValueChange={onChange}>
        <TabsList className={`hidden md:grid ${TAB_GRID_COLUMNS[tabs.length] || TAB_GRID_COLUMNS[4]} mb-8 w-full`}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>{tab.content}</TabsContent>
        ))}
      </Tabs>
    </>
  );
}
