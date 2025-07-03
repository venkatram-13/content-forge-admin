
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

  const handleSkip = () => {
    // When skipping, we go directly to setup with empty content
    setRewrittenContent('');
    setRewrittenTitle('');
    setCurrentPage('setup');
  };

  const handleBackToInput = () => {
    setCurrentPage('input');
  };

  const handleBlogSetupComplete = (data: any) => {
    // Transform the data to match the Blog interface and call onBlogCreated
    const blog: Blog = {
      id: data.id || '',
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featured_image: data.featuredImage || '',
      created_at: data.created_at || new Date().toISOString(),
      author: data.author || 'Admin',
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
      status: data.status || 'published'
    };
    onBlogCreated(blog);
  };

  if (currentPage === 'input') {
    return (
      <ContentInputPage 
        onContentRewritten={handleContentRewritten}
        onSkip={handleSkip}
      />
    );
  }

  return (
    <BlogSetupPage
      initialData={{
        title: rewrittenTitle,
        content: rewrittenContent,
        excerpt: '',
        featuredImage: '',
        applyLink: ''
      }}
      onNext={handleBlogSetupComplete}
    />
  );
};
