import ProductPage from "./components/productitem";

import { prisma } from "@/prisma/index.js";

export default async function ProductItem({
  params,
}: {
  params: { productId: string };
}) {
  const product = await prisma.product.findUnique({
    where: { pid: params.productId },
    include: { priceHistory: true },
  });

  return (
    <>
      <ProductPage product={product} />
    </>
  );
}
