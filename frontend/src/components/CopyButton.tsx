import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

const CopyButton = ({ text }: { text: string }) => {
  const [ok, setOk] = useState(false);
  return (
    <button
      className='inline-flex items-center rounded-md border px-2 py-1 text-xs hover:bg-accent'
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        } catch {
          console.log('Error');
        }
      }}
      aria-label='Copy to clipboard'
    >
      {ok ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
    </button>
  );
};

export default CopyButton;
