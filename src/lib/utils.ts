import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chatHrefConstructor(idOne: string, idTwo: string) {
  const sortIds = [idOne, idTwo].sort();

  return `${sortIds[0]}--${sortIds[1]}`;
}
