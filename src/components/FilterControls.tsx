
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Star } from 'lucide-react';

interface FilterControlsProps {
  activeFilter: 'top-airing' | 'latest';
  onFilterChange: (filter: 'top-airing' | 'latest') => void;
}

const FilterControls = ({ activeFilter, onFilterChange }: FilterControlsProps) => {
  return (
    <div className="flex gap-4 mb-8">
      <Button
        onClick={() => onFilterChange('top-airing')}
        variant={activeFilter === 'top-airing' ? 'default' : 'outline'}
        className={`flex items-center gap-2 ${
          activeFilter === 'top-airing' 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
            : 'hover:bg-blue-50'
        }`}
      >
        <TrendingUp className="w-4 h-4" />
        Top Airing
        {activeFilter === 'top-airing' && <Star className="w-3 h-3 fill-current" />}
      </Button>
      
      <Button
        onClick={() => onFilterChange('latest')}
        variant={activeFilter === 'latest' ? 'default' : 'outline'}
        className={`flex items-center gap-2 ${
          activeFilter === 'latest' 
            ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700' 
            : 'hover:bg-green-50'
        }`}
      >
        <Calendar className="w-4 h-4" />
        Latest
        {activeFilter === 'latest' && <Star className="w-3 h-3 fill-current" />}
      </Button>
    </div>
  );
};

export default FilterControls;
