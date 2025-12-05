import { Star, Plus } from "lucide-react";

interface DishHeaderProps {
  product: {
    name: string;
    image: string;
    rating: number;
    price: string;
  };
}

export function DishHeader({ product }: DishHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden fade-in">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-2">{product.name}</h1>
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-700">{product.rating}</span>
            </div>
            <p className="text-gray-900">{product.price}</p>
          </div>
          <button className="bg-primary hover:bg-primary-dark text-white rounded-xl px-5 py-3 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md">
            <Plus className="w-5 h-5" />
            <span>افزودن</span>
          </button>
        </div>
      </div>
    </div>
  );
}
