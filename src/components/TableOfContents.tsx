
import { useState } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (items.length === 0) {
    return null;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <Card className="mb-8 bg-blue-50/50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-blue-600" />
            Table of Contents
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={`pt-0 ${isCollapsed ? 'hidden md:block' : ''}`}>
        <nav className="space-y-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(item.id)}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm
                hover:bg-blue-100 hover:text-blue-800 transition-colors
                ${item.level === 2 ? 'font-medium text-gray-900' : ''}
                ${item.level === 3 ? 'ml-4 text-gray-700' : ''}
                ${item.level === 4 ? 'ml-8 text-gray-600' : ''}
              `}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};
