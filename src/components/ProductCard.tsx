import { ExternalLink, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  const handleDetailsClick = () => {
    trackClick('details');
    navigate(`/product/${id}`);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{name}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button onClick={handleBuyClick} className="flex-1" size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          Buy Now
        </Button>
        <Button onClick={handleDetailsClick} variant="outline" className="flex-1" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
