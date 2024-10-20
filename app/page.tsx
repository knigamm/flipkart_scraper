import Scrape from "./components/scrape";
import ProductGrid from "./components/product";

import { prisma } from "@/prisma/index.js";

export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const products = await prisma.product.findMany({
    where: {
      title: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <>
      <Scrape />
      <ProductGrid products={products} />
    </>
  );
}
