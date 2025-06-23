
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
    let text = match[2].trim();
    
    // Remove HTML tags from heading text for TOC display
    text = text.replace(/<[^>]*>/g, '').trim();
    
    const id = text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    toc.push({ id, text, level });
  }

  return toc;
};

export const renderMarkdownWithTOC = async (content: string): Promise<string> => {
  // Generate TOC first
  const toc = generateTableOfContents(content);
  
  // Add IDs to headings for anchor linking
  let processedContent = content.replace(/^(#{2,4})\s+(.+)$/gm, (match, hashes, text) => {
    const level = hashes.length;
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const id = cleanText.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${hashes} <span id="${id}">${text}</span>`;
  });

  // Render markdown to HTML
  const result = await marked(processedContent);
  return typeof result === 'string' ? result : '';
};

export const renderMarkdown = async (content: string): Promise<string> => {
  const result = await marked(content);
  return typeof result === 'string' ? result : '';
};
