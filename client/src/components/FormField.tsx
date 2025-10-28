import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'number';
  value: string | number;
  error?: string;
  min?: string;
  step?: string;
  onChange: (value: string | number) => void;
  onBlur: () => void;
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  error,
  min,
  step,
  onChange,
  onBlur,
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const numValue = type === 'number' && step === '0.01' 
        ? parseFloat(e.target.value)
        : parseInt(e.target.value);
      
      if (isNaN(numValue)) {
        onChange(min ? parseFloat(min) : 0);
      } else if (min && numValue < parseFloat(min)) {
        onChange(parseFloat(min));
      } else {
        onChange(numValue);
      }
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        step={step}
        min={min}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

