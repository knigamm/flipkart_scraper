"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { useState } from "react";

const Scrape = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const handleCheck = async () => {
    const data = await fetch("/api/scraper", {
      method: "POST",
      body: JSON.stringify({ pageUrl: url }),
    });
    const product = await data.json();
    console.log(product);
    setProduct(product);
    router.refresh();
  };

  const handleSearch = () => {
    if (url === "") {
      router.push("/");
    } else {
      router.push(`/?search=${url}`);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 bg-background">
      <h1 className="text-3xl font-bold mb-6">
        Paste a product link to check its details or Search Product by Name
      </h1>
      <div className="flex space-x-2 mb-8">
        <Input
          type="url"
          placeholder="Paste product link here or Search by name"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow h-10"
        />
        <Button onClick={handleSearch} className="min-w-[120px] h-10">
          Search
        </Button>
        <Button
          onClick={handleCheck}
          className="min-w-[120px] h-10 bg-blue-800 hover:bg-blue-900"
        >
          Check Price
        </Button>
      </div>
      {product && (
        <div className="bg-muted p-6 rounded-lg">
          <div className="flex gap-4">
            <div className="flex flex-1 justify-center items-start">
              <img
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-4 flex-[1.8]">
              <h2 className="text-3xl font-bold text-primary">
                {product.title}
              </h2>
              <p className="text-4xl font-bold text-green-600">
                {product.price}
              </p>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">
                  {product.reviews} out of 5
                </span>
              </div>
              <p className="text-muted-foreground">
                {product.total.toLocaleString()} total purchases
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Scrape;
