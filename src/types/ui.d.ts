declare module '@/components/ui/dialog' {
  import { Root, Content, Header, Title } from '@radix-ui/react-dialog';
  
  export const Dialog: typeof Root;
  export const DialogContent: typeof Content;
  export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const DialogTitle: typeof Title;
  export const DialogDescription: typeof Description;
  export const DialogTrigger: typeof Trigger;
  export const DialogClose: typeof Close;
}

declare module '@/components/ui/button' {
  import { ButtonHTMLAttributes } from 'react';
  
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
  
  export const Button: React.FC<ButtonProps>;
}

declare module '@/components/ui/input' {
  import { InputHTMLAttributes } from 'react';
  
  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
  
  export const Input: React.FC<InputProps>;
}

declare module '@/components/ui/tabs' {
  import { Root, List, Trigger, Content } from '@radix-ui/react-tabs';
  
  export const Tabs: typeof Root;
  export const TabsList: typeof List;
  export const TabsTrigger: typeof Trigger;
  export const TabsContent: typeof Content;
} 