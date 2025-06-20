
import { useState } from 'react';
import { ContentInputPage } from './BlogCreation/ContentInputPage';
import { BlogSetupPage } from './BlogCreation/BlogSetupPage';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
  author: string;
  slug: string;
  status: 'published' | 'draft';
}

interface TwoPageBlogCreationProps {
  onBlogCreated: (blog: Blog) => void;
}

export const TwoPageBlogCreation = ({ onBlogCreated }: TwoPageBlogCreationProps) => {
  const [currentPage, setCurrentPage] = useState<'input' | 'setup'>('input');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [rewrittenTitle, setRewrittenTitle] = useState('');

  const handleContentRewritten = (content: string, title: string) => {
    setRewrittenContent(content);
    setRewrittenTitle(title);
    setCurrentPage('setup');
  };

  const handleBackToInput = () => {
    setCurrentPage('input');
  };

  if (currentPage === 'input') {
    return <ContentInputPage onContentRewritten={handleContentRewritten} />;
  }

  return (
    <BlogSetupPage
      initialContent={rewrittenContent}
      initialTitle={rewrittenTitle}
      onBlogCreated={onBlogCreated}
      onBack={handleBackToInput}
    />
  );
};
