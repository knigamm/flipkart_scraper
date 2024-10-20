import puppeteer from "puppeteer";
import { prisma } from "@/prisma/index";
import { revalidatePath } from "next/cache";

type productType = {
  title: string;
  description: string;
  price: string;
  image: string;
  reviews: string;
  total: string;
  url: string;
  pid: string;
};

async function createOrUpdateProduct(prod: productType) {
  const { title, price, image, description, url, pid } = prod;

  let product = await prisma.product.findUnique({
    where: { pid },
    include: { priceHistory: true },
  });

  const currentTimestamp = new Date();

  if (!product) {
    product = await prisma.product.create({
      data: {
        title,
        price,
        image,
        description,
        url,
        pid,
        priceHistory: {
          create: {
            price,
            timestamp: currentTimestamp,
          },
        },
      },
      include: { priceHistory: true },
    });
    console.log("Product created:", product);
  } else {
    product = await prisma.product.update({
      where: { pid },
      data: {
        price,
        image,
        description,
        priceHistory: {
          create: {
            price,
            timestamp: currentTimestamp,
          },
        },
      },
      include: { priceHistory: true },
    });
    console.log("Product updated with new price history:", product);
  }

  return product;
}

function extractPidFromUrl(url: string) {
  const urlParams = new URLSearchParams(new URL(url).search);
  const pid = urlParams.get("pid"); // Get the value of 'pid'
  return pid;
}

export async function POST(request: Request) {
  const { pageUrl } = await request.json();

  const pid = extractPidFromUrl(pageUrl);
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "networkidle2" });
  let product: productType = {
    title: "",
    description: "",
    image: "",
    price: "",
    reviews: "",
    total: "",
    url: "",
    pid: "",
  };
  product.url = pageUrl;
  product.title =
    (await page.$eval(".VU-ZEz", (element) => element.textContent?.trim())) ||
    "";
  product.price =
    (await page.$eval(".Nx9bqj.CxhGGd", (element) => element.innerHTML)) || "";
  product.image =
    (await page.$eval(".DByuf4.IZexXJ.jLEJ7H", (element) =>
      element.getAttribute("src")
    )) || "";
  product.description =
    (await page
      .$eval(".yN\\+eNk", (element) => element.textContent?.trim())
      .catch(() => null)) || "";

  if (!product.description) {
    product.description =
      (await page.$eval(".yN\\+eNk.w9jEaj > p", (element) =>
        element.textContent?.trim()
      )) || "";
  }
  product.reviews =
    (await page.$eval(".XQDdHH", (element) => element.textContent?.trim())) ||
    "";

  product.total =
    (await page.$eval(".Wphh3N > span > span", (element) => {
      const text = element.textContent?.trim();
      console.log(text?.split(" ")[0]);
      return text?.split(" ")[0];
    })) || "";
  product.pid = pid || "";
  await browser.close();
  await createOrUpdateProduct(product);

  return Response.json(product);
}
