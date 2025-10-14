import type { Color, ColorName } from '../../types/index.js';

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: ColorName;
  onColorChange: (color: ColorName) => void;
}

export const ColorSelector = ({
  colors,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Color: <span className="font-bold text-brand-black">{selectedColor}</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.name)}
            className={`
              relative w-12 h-12 rounded-full border-2 transition-all
              ${selectedColor === color.name
                ? 'border-brand-black scale-110 shadow-lg'
                : 'border-gray-300 hover:border-gray-400 hover:scale-105'}
              cursor-pointer
            `}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {/* Checkmark for selected */}
            {selectedColor === color.name && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold drop-shadow-md">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
