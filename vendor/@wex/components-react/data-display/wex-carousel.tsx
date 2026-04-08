import * as React from "react";
import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "../lib/utils";

/**
 * WexCarousel - WEX Design System Carousel Component
 *
 * Slideshow for cycling through elements.
 * Uses namespace pattern: WexCarousel.Content, WexCarousel.Item, etc.
 *
 * @example
 * <WexCarousel>
 *   <WexCarousel.Content>
 *     <WexCarousel.Item>Slide 1</WexCarousel.Item>
 *     <WexCarousel.Item>Slide 2</WexCarousel.Item>
 *     <WexCarousel.Item>Slide 3</WexCarousel.Item>
 *   </WexCarousel.Content>
 *   <WexCarousel.Previous />
 *   <WexCarousel.Next />
 * </WexCarousel>
 */

const WexCarouselRoot = React.forwardRef<
  React.ElementRef<typeof CarouselRoot>,
  React.ComponentPropsWithoutRef<typeof CarouselRoot>
>(({ className, ...props }, ref) => (
  <CarouselRoot
    ref={ref}
    className={cn("wex-carousel", className)}
    {...props}
  />
));
WexCarouselRoot.displayName = "WexCarousel";

export const WexCarousel = Object.assign(WexCarouselRoot, {
  Content: CarouselContent,
  Item: CarouselItem,
  Next: CarouselNext,
  Previous: CarouselPrevious,
});

