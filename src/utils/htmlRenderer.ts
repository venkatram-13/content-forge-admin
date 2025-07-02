
export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const generateTableOfContentsFromHTML = (htmlContent: string): TOCItem[] => {
  const toc: TOCItem[] = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const headings = tempDiv.querySelectorAll('h2, h3, h4');
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent?.trim() || '';
    
    const id = text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    toc.push({ id, text, level });
  });

  return toc;
};

export const addIdsToHeadings = (htmlContent: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach((heading) => {
    const text = heading.textContent?.trim() || '';
    const id = text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    heading.id = id;
  });
  
  return tempDiv.innerHTML;
};

export const sanitizeHTML = (htmlContent: string): string => {
  // Basic HTML sanitization - you might want to use a proper library like DOMPurify for production
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Remove potentially harmful elements and attributes
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  const iframes = tempDiv.querySelectorAll('iframe');
  iframes.forEach(iframe => iframe.remove());
  
  // Remove on* event handlers
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(element => {
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });
  });
  
  return tempDiv.innerHTML;
};
