import { sectionId } from '@/lib/reading';

export function SectionLinks({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="section-links shell" aria-label="On this page">
      <div>
        {items.map(({ id, label }) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function ReadingContents({ headings }: { headings: string[] }) {
  if (!headings.length) return null;
  return (
    <nav className="reading-contents" aria-label="Article sections">
      <details>
        <summary>
          On this page <span aria-hidden="true">+</span>
        </summary>
        <ol>
          {headings.map((heading) => (
            <li key={heading}>
              <a href={`#${sectionId(heading)}`}>{heading}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
