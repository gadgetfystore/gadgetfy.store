import { ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  externalLink: string;
}

const ProductCard = ({ id, name, description, imageUrl, externalLink }: ProductCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const truncate = (text: string, max: number) => {
    return text.length > max ? text.substring(0, max) + "..." : text;
  };

  const trackClick = async (clickType: 'buy' | 'details') => {
    try {
      await supabase.from('product_clicks').insert({
        product_id: id,
        user_id: user?.id || null,
        session_id: !user ? crypto.randomUUID() : null,
        click_type: clickType,
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const handleBuyClick = () => {
    trackClick('buy');
    window.open(externalLink, '_blank', 'noopener,noreferrer');
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackClick('details');
    navigate(`/product/${id}`);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-sm w-[150px] sm:w-[230px] w-full">
      <Link to={`/product/${id}`} onClick={handleDetailsClick}>
        <div className="h-[110px] sm:h-[150px] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
              No Image
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="p-2">
        <Link to={`/product/${id}`} onClick={handleDetailsClick}>
          <CardTitle className="line-clamp-1 text-xs">{name}</CardTitle>
        </Link>

        {description && (
          <CardDescription className="text-[10px] text-muted-foreground">
            {truncate(description, 20)}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="flex p-2 pt-0">
        <Button 
          onClick={handleBuyClick}
          size="sm"
          className="w-full h-6 text-[10px] px-2"
        >
          <ExternalLink className="mr-1 h-3 w-3" />
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
