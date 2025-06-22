
import { useState } from 'react';
import { ChevronDown, ChevronRight, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [isOpen, setIsOpen] = useState(true);

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
    <Card className="mb-8 bg-blue-50/50 border-blue-200 dark:bg-slate-800/50 dark:border-slate-700">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-between w-full p-0 h-auto hover:bg-transparent"
            >
              <CardTitle className="text-lg flex items-center gap-2">
                <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Table of Contents
              </CardTitle>
              {isOpen ? (
                <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200" />
              ) : (
                <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <CardContent className="pt-0">
            <nav className="space-y-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  className={`
                    block w-full text-left px-3 py-2 rounded-md text-sm
                    hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-slate-700 dark:hover:text-blue-300 
                    transition-colors duration-200
                    ${item.level === 2 ? 'font-medium text-gray-900 dark:text-gray-100' : ''}
                    ${item.level === 3 ? 'ml-4 text-gray-700 dark:text-gray-300' : ''}
                    ${item.level === 4 ? 'ml-8 text-gray-600 dark:text-gray-400' : ''}
                  `}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
