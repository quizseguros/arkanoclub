"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { defaultFilters } from "@/lib/filters";
import { useSearch } from "@/lib/search-context";
import BannerCarousel from "./BannerCarousel";
import BrandLogoCarousel from "./BrandLogoCarousel";
import FeaturedSection from "./FeaturedSection";
import CategoriesSection from "./CategoriesSection";
import CatalogSection from "./CatalogSection";
import CustomOrderCallout from "./CustomOrderCallout";
import TestimonialsSection from "./TestimonialsSection";
import InstagramSection from "./InstagramSection";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";

const priceBounds = Math.max(...products.map((p) => p.price));
const diameterBounds = Math.max(...products.map((p) => p.caseDiameter));

export default function HomeClient() {
  const [filters, setFilters] = useState(() => defaultFilters(products));
  const { search } = useSearch();

  useEffect(() => {
    setFilters((f) => (f.search === search ? f : { ...f, search }));
  }, [search]);

  return (
    <>
      <BannerCarousel />

      <BrandLogoCarousel
        activeBrand={filters.brands.size === 1 ? Array.from(filters.brands)[0] : null}
        onSelectBrand={(slug) =>
          setFilters({
            ...filters,
            brands: filters.brands.size === 1 && filters.brands.has(slug) ? new Set() : new Set([slug]),
          })
        }
      />

      <Reveal>
        <FeaturedSection />
      </Reveal>

      <CustomOrderCallout />

      <CategoriesSection />

      <Reveal>
        <CatalogSection
          filters={filters}
          onChange={setFilters}
          priceBounds={priceBounds}
          diameterBounds={diameterBounds}
        />
      </Reveal>

      <Reveal>
        <TestimonialsSection />
      </Reveal>

      <Reveal>
        <InstagramSection />
      </Reveal>

      <Reveal>
        <ContactForm />
      </Reveal>
    </>
  );
}
