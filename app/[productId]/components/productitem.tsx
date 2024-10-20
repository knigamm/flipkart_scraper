"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function ProductPage({ product }) {
  const router = useRouter();

  const handleCheck = async () => {
    await fetch("/api/scraper", {
      method: "POST",
      body: JSON.stringify({ pageUrl: product.url }),
    });
    router.refresh();
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            &larr; Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="flex justify-center">
          <img
            src={product.image}
            alt="Product Image"
            className="rounded-lg object-cover max-h-[400px] w-full lg:w-auto"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6">{product.description}</p>

            <div className="flex gap-4">
              <div className="text-3xl font-bold text-green-600 mb-8">
                {product.price}
              </div>
              <Button
                onClick={handleCheck}
                className="bg-blue-700 hover:bg-blue-700"
              >
                Recheck Price
              </Button>
            </div>
          </div>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Price History</h2>

              <ScrollArea className="h-[250px] w-full rounded-md border p-4 bg-gray-50">
                <div className="space-y-4">
                  {product.priceHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 rounded-md ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <span className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
