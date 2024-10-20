"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

function ProductGrid({ products }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain"
            />
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-gray-600 mb-2">{product.price}</p>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                {product.description}
              </p>
            </div>
            <Button asChild>
              <Link href={`/${product.pid}`} className="m-4">
                Price History
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ProductGrid;
