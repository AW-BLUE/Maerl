import { Pencil, PlusCircle } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  action?: 'edit' | 'add';
  variant?: 'default' | 'icon';
  label?: string;
}

export default function ActionButton({
  action = 'edit',
  variant = 'default',
  label,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center rounded-md border transition-colors hover:bg-accent',
        variant === 'icon' ? 'p-1.5' : 'gap-2 px-3 py-1',
        className,
      )}
      {...props}
    >
      {action === 'edit' ? (
        <>
          <Pencil className='h-3 w-3' />
          {variant === 'default' && (label || 'Edit')}
        </>
      ) : (
        <>
          <PlusCircle className='h-4 w-4' />
          {variant === 'default' && (label || 'Add')}
        </>
      )}
    </button>
  );
}
