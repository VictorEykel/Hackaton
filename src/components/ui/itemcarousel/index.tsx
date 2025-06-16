"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel";
import { Card, CardContent } from "../card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import OpenAiLogo from "../../../../public/OpenAiLogo.svg";
import MongoDBLogo from "../../../../public/MongoDBLogo.svg";
import NextJSLogo from "../../../../public/NextJSLogo.svg";
import NodeJSLogo from "../../../../public/NodeJSLogo.svg";
import N8NLogo from "../../../../public/N8NLogo.svg";

export default function ItemsCarousel() {
  const carouselData = [
    {
      title: "ChatGPT 4o",
      image: OpenAiLogo,
    },
    {
      title: "MongoDB",
      image: MongoDBLogo,
    },
    {
      title: "Next.js",
      image: NextJSLogo,
    },
    {
      title: "Node.js",
      image: NodeJSLogo,
    },
    {
      title: "N8N",
      image: N8NLogo,
    },
  ];

  return (
    <section className="w-full p-8 rounded-lg">
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {carouselData.map((item, index) => (
            <CarouselItem className="md:basis-1/3 lg:basis-1/4" key={index}>
              <Card>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                    <h2 className="text-lg font-medium font-sans">{item.title}</h2>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
