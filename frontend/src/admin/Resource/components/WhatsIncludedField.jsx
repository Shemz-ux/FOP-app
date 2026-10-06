export default function WhatsIncludedField({ items, onChange, copy }) {
  const addItem = () => {
    onChange([...items, '']);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div>
      <label className="block text-sm mb-2 text-foreground">
        {copy.label} <span className="text-red-500">*</span>
      </label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={copy.placeholder}
              className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-4 py-3 border border-border rounded-xl hover:bg-secondary text-muted-foreground"
              >
                {copy.remove}
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 border border-border rounded-xl hover:bg-secondary text-foreground text-sm"
        >
          {copy.add}
        </button>
      </div>
    </div>
  );
}
