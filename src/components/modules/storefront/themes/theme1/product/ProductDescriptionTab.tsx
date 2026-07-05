"use client";

import { Product, Store, StoreShippingConfig } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";

interface ProductDescriptionTabProps {
  product: Product;
  theme: StorefrontThemeConfig;
}

export function ProductDescriptionTab({ product, theme }: ProductDescriptionTabProps) {
  const details = product.details;
  const chart = details?.sizeChart;

  return (
    <div className="space-y-8 text-sm leading-relaxed sf-fg">
      {chart && chart.rows.length > 0 && (
        <section>
          <h3 className="mb-3 text-base font-bold">Size Chart:</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-sm">
              <thead>
                <tr className="sf-border border-b bg-muted/30">
                  {chart.columns.map((col) => (
                    <th key={col} className="border px-3 py-2 text-left font-semibold sf-border">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, ri) => (
                  <tr key={ri} className="sf-border border-b">
                    {row.map((cell, ci) => (
                      <td key={ci} className="border px-3 py-2 sf-border">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {chart.note && (
            <p className="sf-muted-fg mt-2 text-xs">{chart.note}</p>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold">{product.name}</h2>
        {product.description && (
          <p className="sf-muted-fg whitespace-pre-wrap">{product.description}</p>
        )}
      </section>

      {details?.specifications && details.specifications.length > 0 && (
        <section>
          <h3 className="mb-2 text-base font-bold">Specifications:</h3>
          <ul className="list-disc space-y-1 pl-5 sf-muted-fg">
            {details.specifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {details?.careInstructions && details.careInstructions.length > 0 && (
        <section>
          <h3 className="mb-2 text-base font-bold">Care Instructions:</h3>
          <ul className="list-disc space-y-1 pl-5 sf-muted-fg">
            {details.careInstructions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {theme.brandStoryContent && (
        <section>
          <h3 className="mb-2 text-base font-bold">
            About the Brand – {theme.brandStoryTitle || storeBrandFallback(theme)}
          </h3>
          <p className="sf-muted-fg whitespace-pre-wrap">{theme.brandStoryContent}</p>
        </section>
      )}
    </div>
  );
}

function storeBrandFallback(theme: StorefrontThemeConfig) {
  return theme.brandStoryTitle || "Our Brand";
}
