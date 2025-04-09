interface ColorPickerProps {
    name: string;
    label?: string;
    defaultValue?: string;
    register: any;
    setValue: any;
    watch?: any;
  }
  
  export function ColorPicker({
    name,
    label = "Selecione uma cor para o calendário",
    defaultValue = "#3B82F6",
    register,
    setValue,
    watch
  }: ColorPickerProps) {
    const currentColor = watch ? watch(name) : defaultValue;
    
    // Paleta de cores rápidas (você pode personalizar estas cores)
    const quickColors = [
      { name: "Azul", value: "#0000FF" },
      { name: "Vermelho", value: "#FF0000" },
      { name: "Verde", value: "#00FF00" },
      { name: "Amarelo", value: "#FFFF00" },
      { name: "Preto", value: "#000000" }
    ];
  
    return (
        <div className="mb-4">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          
          {/* Seletor de cor principal com borda */}
          <div className="flex items-center gap-3 mb-2">
            <div className="border-2 border-gray-300 rounded-md p-0.5">
              <input
                {...register(name)}
                id={name}
                type="color"
                className="h-10 w-10 rounded-md border border-gray-200 cursor-pointer block"
                defaultValue={defaultValue}
                onChange={(e) => setValue(name, e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border-2">
            <label  className="text-xs text-gray-500 mb-1">
                Cores rápidas:  
            </label>
              {quickColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setValue(name, color.value)}
                  className={`w-8 h-8 rounded-md cursor-pointer flex items-center justify-center transition-all border-2 ${
                    currentColor === color.value 
                      ? 'ring-2 ring-offset-1 ring-blue-400 border-gray-400' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={`${color.name} (${color.value})`}
                >
                  {currentColor === color.value && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }