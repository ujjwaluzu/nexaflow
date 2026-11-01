import type { MDXComponents } from 'mdx/types';
import { Children, isValidElement, type ReactNode } from 'react';
import { sectionId } from '@/lib/reading';

function headingText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      return isValidElement<{ children?: ReactNode }>(child)
        ? headingText(child.props.children)
        : '';
    })
    .join('');
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children, ...props }) => (
      <h2 id={sectionId(headingText(children))} {...props}>
        {children}
      </h2>
    ),
    ...components,
  };
}
