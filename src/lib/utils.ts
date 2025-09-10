import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to merge multiple class names together. This is a
 * reexport of {@link https://github.com/tailwindlabs/tailwindcss-typography#twmerge `twMerge`}
 * from `tailwind-merge`, which is a part of the official Tailwind CSS
 * ecosystem. We use this utility to merge the default class names from
 * Radix UI with the ones provided by users.
 *
 * @param {...ClassValue} inputs - The class names to merge.
 *
 * @returns {string} The merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
