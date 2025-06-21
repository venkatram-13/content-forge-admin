
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const generateTableOfContents = (content: string): TOCItem[] => {
  const toc: TOCItem[] = [];
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    toc.push({ id, text, level });
  }

  return toc;
};

export const renderMarkdownWithTOC = (content: string): string => {
  // Generate TOC first
  const toc = generateTableOfContents(content);
  
  // Add IDs to headings for anchor linking
  let processedContent = content.replace(/^(#{2,4})\s+(.+)$/gm, (match, hashes, text) => {
    const level = hashes.length;
    const id = text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${hashes} <span id="${id}">${text}</span>`;
  });

  // Render markdown to HTML
  return marked(processedContent);
};

export const renderMarkdown = (content: string): string => {
  return marked(content);
};
