"use client";

import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";
import { cn } from "@/lib/utils";
import chemicalList from "./chemical-list";
import Image from "next/image";

const HomeCarousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const emblaApiRef = useRef<CarouselApi | null>(null);

  const handleSetApi = (api: CarouselApi | undefined) => {
    emblaApiRef.current = api || null;

    if (api) {
      setSelectedIndex(api.selectedScrollSnap());
      api.on("select", () => {
        setSelectedIndex(api.selectedScrollSnap());
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Desktop Layout */}
      <div className="flex flex-col md:flex-row">
        <div className="w-1/2 p-8 flex flex-col justify-center bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sistem Peminjaman Bahan Kimia
          </h2>
          <p className="text-gray-600 mb-6">
            Platform terintegrasi untuk manajemen dan peminjaman bahan kimia di
            laboratorium. Akses berbagai bahan kimia dengan mudah dan aman.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="mr-2">✓</span> Peminjaman online 24/7
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Tracking penggunaan bahan
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Sistem notifikasi otomatis
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Akses SDS (Safety Data Sheet)
            </li>
          </ul>
        </div>

        <div className="w-1/2">
          <Carousel
            opts={{ loop: true }}
            plugins={[autoplay.current]}
            onMouseEnter={() => autoplay.current?.stop()}
            onMouseLeave={() => autoplay.current?.play()}
            setApi={handleSetApi}>
            <CarouselContent>
              {chemicalList.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="p-2 w-full h-96">
                    <Image
                      width={250}
                      height={250}
                      src={src}
                      alt={`chemical-${index}`}
                      className="object-cover w-full h-full rounded-r-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center py-4 gap-2">
            {chemicalList.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApiRef.current?.scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  selectedIndex === index ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;
