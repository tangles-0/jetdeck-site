import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/app/components/ui/carousel';

export const ProductCarousel = ({ images, noEffect, constrainWidth = true }: { images: { src: string; alt: string }[], noEffect?: boolean, constrainWidth?: boolean }) => {

  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return <div className={`${constrainWidth ? 'max-w-3xl' : ''} mx-auto mb-12`}>
    <Carousel
      setApi={setApi}
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} >
            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto"
              />
              {/* <div className={`absolute inset-0 pointer-events-none ${noEffect ? 'bg-radial from-transparent to-black/20' : 'bg-gradient-to-t from-slate-950/80 via-transparent to-transparent'}`} /> */}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-slate-900/80 border-cyan-500/30 text-cyan-400 hover:bg-slate-800 hover:text-cyan-300" />
      <CarouselNext className="right-4 bg-slate-900/80 border-cyan-500/30 text-cyan-400 hover:bg-slate-800 hover:text-cyan-300" />
    </Carousel>

    {/* Carousel Dots Indicator */}
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={`h-2 rounded-full transition-all ${index === current
              ? 'w-8 bg-cyan-400'
              : 'w-2 bg-slate-600 hover:bg-slate-500'
            }`}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  </div>
}