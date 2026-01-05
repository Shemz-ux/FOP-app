import ThemeToggle from '../components/ui/ThemeToggle.jsx';

const DesignSystemDemo = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold">Design System Demo</h1>
          <ThemeToggle />
        </div>

        {/* Color Palette */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-lg">
              <div className="font-medium">Primary</div>
              <div className="text-sm opacity-80">#0D7DFF</div>
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
              <div className="font-medium">Secondary</div>
              <div className="text-sm opacity-80">Secondary</div>
            </div>
            <div className="bg-accent text-accent-foreground p-4 rounded-lg">
              <div className="font-medium">Accent</div>
              <div className="text-sm opacity-80">Accent</div>
            </div>
            <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
              <div className="font-medium">Destructive</div>
              <div className="text-sm opacity-80">Destructive</div>
            </div>
          </div>
        </section>

        {/* Company Brand Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Company Brand Colors</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: 'var(--color-netflix)'}}></div>
              <div className="text-sm font-medium">Netflix</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: 'var(--color-microsoft)'}}></div>
              <div className="text-sm font-medium">Microsoft</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: 'var(--color-google)'}}></div>
              <div className="text-sm font-medium">Google</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: 'var(--color-reddit)'}}></div>
              <div className="text-sm font-medium">Reddit</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: 'var(--color-spotify)'}}></div>
              <div className="text-sm font-medium">Spotify</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: 'var(--color-meta)'}}></div>
              <div className="text-sm font-medium">Meta</div>
            </div>
          </div>
        </section>

        {/* Badge Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Badge System</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
              color: 'var(--badge-purple)',
              backgroundColor: 'var(--badge-purple-bg)'
            }}>
              Purple Badge
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
              color: 'var(--badge-green)',
              backgroundColor: 'var(--badge-green-bg)'
            }}>
              Green Badge
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
              color: 'var(--badge-orange)',
              backgroundColor: 'var(--badge-orange-bg)'
            }}>
              Orange Badge
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
              color: 'var(--badge-pink)',
              backgroundColor: 'var(--badge-pink-bg)'
            }}>
              Pink Badge
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
              color: 'var(--badge-teal)',
              backgroundColor: 'var(--badge-teal-bg)'
            }}>
              Teal Badge
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
              color: 'var(--badge-blue)',
              backgroundColor: 'var(--badge-blue-bg)'
            }}>
              Blue Badge
            </span>
          </div>
        </section>

        {/* Typography Scale */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Typography Scale</h2>
          <div className="space-y-2">
            <div className="text-xs">Extra Small Text (12px)</div>
            <div className="text-sm">Small Text (14px)</div>
            <div className="text-base">Base Text (16px)</div>
            <div className="text-lg">Large Text (18px)</div>
            <div className="text-xl">Extra Large Text (20px)</div>
            <div className="text-2xl">2XL Text (24px)</div>
            <div className="text-3xl">3XL Text (30px)</div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Card Components</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
              <h3 className="text-lg font-medium mb-2">Job Card Example</h3>
              <p className="text-muted-foreground mb-4">
                This is an example of how your job cards might look using the design system.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs rounded" style={{
                  color: 'var(--badge-blue)',
                  backgroundColor: 'var(--badge-blue-bg)'
                }}>
                  Remote
                </span>
                <span className="px-2 py-1 text-xs rounded" style={{
                  color: 'var(--badge-green)',
                  backgroundColor: 'var(--badge-green-bg)'
                }}>
                  Full-time
                </span>
              </div>
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-foreground">Muted Card</h3>
              <p className="mb-4">
                This card uses muted colors for less prominent content.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                Action Button
              </button>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Form Elements</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Input Field</label>
              <input 
                type="text" 
                placeholder="Enter text here..."
                className="w-full px-3 py-2 bg-input-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Dropdown</label>
              <select className="w-full px-3 py-2 bg-input-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Choose an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
