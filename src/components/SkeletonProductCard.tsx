import { Card, CardHeader, CardFooter } from "@/components/ui/card";

const SkeletonProductCard = () => {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-[110px] sm:h-[150px] bg-muted"></div>

      <CardHeader className="p-2 space-y-2">
        <div className="h-3 w-3/4 bg-muted rounded"></div>
        <div className="h-2 w-1/2 bg-muted rounded"></div>
      </CardHeader>

      <CardFooter className="p-2 pt-0">
        <div className="h-6 w-full bg-muted rounded"></div>
      </CardFooter>
    </Card>
  );
};

export default SkeletonProductCard;
