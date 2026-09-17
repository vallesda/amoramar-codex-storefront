export const PRODUCT_FIELDS = `
fragment ProductFields on Product {
  id handle title description productType tags availableForSale
  seo { title description }
  featuredImage { url altText }
  images(first: 20) { nodes { url altText } }
  variants(first: 100) {
    nodes { id title availableForSale quantityAvailable price { amount currencyCode } }
    pageInfo { hasNextPage }
  }
  metafields(identifiers: [
    { namespace: "amoramar", key: "origin" },
    { namespace: "amoramar", key: "presentation" },
    { namespace: "amoramar", key: "unit" },
    { namespace: "amoramar", key: "storage_instructions" }
  ]) { key value }
}`;
export const PRODUCTS = `${PRODUCT_FIELDS}
query Products($after: String, $query: String) @inContext(country: MX, language: ES) {
  products(first: 100, after: $after, query: $query) {
    nodes { ...ProductFields }
    pageInfo { hasNextPage endCursor }
  }
}`;
export const PRODUCT = `${PRODUCT_FIELDS}
query Product($handle: String!) @inContext(country: MX, language: ES) {
  product(handle: $handle) { ...ProductFields }
}`;
export const COLLECTION_PRODUCTS = `${PRODUCT_FIELDS}
query CollectionProducts($handle: String!, $after: String) @inContext(country: MX, language: ES) {
  collection(handle: $handle) {
    products(first: 100, after: $after) {
      nodes { ...ProductFields }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;
export const COLLECTIONS = `query Collections($after: String) @inContext(country: MX, language: ES) {
  collections(first: 100, after: $after) {
    nodes { handle title }
    pageInfo { hasNextPage endCursor }
  }
}`;
export const CART_CREATE = `mutation CartCreate($input: CartInput!) @inContext(country: MX, language: ES) {
  cartCreate(input: $input) {
    cart { checkoutUrl totalQuantity }
    userErrors { field message code }
    warnings { code message }
  }
}`;
