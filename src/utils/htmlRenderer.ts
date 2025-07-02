
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

export const applyStylesToHTML = (htmlContent: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Apply styles to elements (only if they don't already have inline styles)
  const h1Elements = tempDiv.querySelectorAll('h1');
  h1Elements.forEach(h1 => {
    if (!h1.getAttribute('style')) {
      h1.style.fontSize = '2rem';
      h1.style.fontWeight = 'bold';
      h1.style.margin = '32px 0 16px';
      h1.style.color = '#1f2937';
    }
  });

  const h2Elements = tempDiv.querySelectorAll('h2');
  h2Elements.forEach(h2 => {
    if (!h2.getAttribute('style')) {
      h2.style.fontSize = '1.75rem';
      h2.style.fontWeight = 'bold';
      h2.style.margin = '24px 0 12px';
      h2.style.color = '#1f2937';
      h2.style.borderBottom = '2px solid #e5e7eb';
      h2.style.paddingBottom = '8px';
    }
  });

  const h3Elements = tempDiv.querySelectorAll('h3');
  h3Elements.forEach(h3 => {
    if (!h3.getAttribute('style')) {
      h3.style.fontSize = '1.5rem';
      h3.style.fontWeight = '600';
      h3.style.margin = '20px 0 10px';
      h3.style.color = '#374151';
    }
  });

  const h4Elements = tempDiv.querySelectorAll('h4');
  h4Elements.forEach(h4 => {
    if (!h4.getAttribute('style')) {
      h4.style.fontSize = '1.25rem';
      h4.style.fontWeight = '600';
      h4.style.margin = '16px 0 8px';
      h4.style.color = '#4b5563';
    }
  });

  const pElements = tempDiv.querySelectorAll('p');
  pElements.forEach(p => {
    if (!p.getAttribute('style')) {
      p.style.margin = '16px 0';
      p.style.lineHeight = '1.7';
      p.style.color = '#374151';
    }
  });

  const ulElements = tempDiv.querySelectorAll('ul');
  ulElements.forEach(ul => {
    if (!ul.getAttribute('style')) {
      ul.style.margin = '16px 0';
      ul.style.paddingLeft = '24px';
      ul.style.color = '#374151';
    }
  });

  const olElements = tempDiv.querySelectorAll('ol');
  olElements.forEach(ol => {
    if (!ol.getAttribute('style')) {
      ol.style.margin = '16px 0';
      ol.style.paddingLeft = '24px';
      ol.style.color = '#374151';
    }
  });

  const liElements = tempDiv.querySelectorAll('li');
  liElements.forEach(li => {
    if (!li.getAttribute('style')) {
      li.style.margin = '8px 0';
    }
  });

  const aElements = tempDiv.querySelectorAll('a');
  aElements.forEach(a => {
    // Don't style CTA buttons (they already have inline styles)
    if (!a.style.background && !a.getAttribute('style')) {
      a.style.color = '#2563eb';
      a.style.textDecoration = 'underline';
    }
  });

  const strongElements = tempDiv.querySelectorAll('strong');
  strongElements.forEach(strong => {
    if (!strong.getAttribute('style')) {
      strong.style.fontWeight = '700';
      strong.style.color = '#1f2937';
    }
  });

  const imgElements = tempDiv.querySelectorAll('img');
  imgElements.forEach(img => {
    if (!img.getAttribute('style')) {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
      img.style.margin = '16px 0';
    }
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
