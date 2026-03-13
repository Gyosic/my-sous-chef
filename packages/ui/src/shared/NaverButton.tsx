import { ButtonHTMLAttributes } from 'react';
import { Button } from '../components/button';
import { cn } from '../lib/utils';

interface NaverButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: 'standard' | 'icon';
  text?: string;
  buttonImg: string;
  theme?: 'light' | 'dark';
}
export function NaverButton({
  appearance = 'standard',
  text = 'Sign in with Naver',
  className,
  buttonImg,
  ...props
}: NaverButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        `flex w-full items-center justify-center gap-0 border-0 bg-[#03c75a] p-0 hover:bg-[#03c75a] dark:bg-[#48484a] dark:hover:bg-[#48484a]`,
        className,
      )}
      {...props}
    >
      <div className="flex h-8 w-8 items-center justify-center">
        <img
          src={buttonImg}
          className="h-9 w-9 object-cover"
          alt="Naver"
          width={48}
          height={48}
        />
      </div>

      {appearance === 'standard' && <span className="text-white">{text}</span>}
    </Button>
  );
}
