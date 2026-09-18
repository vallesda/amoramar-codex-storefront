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
export const CART_FIELDS = `
fragment CartFields on Cart {
  id checkoutUrl totalQuantity
  lines(first: 100) {
    nodes { id quantity merchandise { ... on ProductVariant { id } } }
    pageInfo { hasNextPage }
  }
}`;
export const CART = `${CART_FIELDS}
query Cart($id: ID!) @inContext(country: MX, language: ES) {
  cart(id: $id) { ...CartFields }
}`;
export const CART_CREATE = `${CART_FIELDS}
mutation CartCreate($input: CartInput!) @inContext(country: MX, language: ES) {
  cartCreate(input: $input) {
    cart { ...CartFields }
    userErrors { field message code }
    warnings { code message }
  }
}`;
export const CART_LINES_ADD = `${CART_FIELDS}
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @inContext(country: MX, language: ES) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { field message code }
    warnings { code message }
  }
}`;
export const CART_LINES_UPDATE = `${CART_FIELDS}
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: MX, language: ES) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { field message code }
    warnings { code message }
  }
}`;
export const CART_LINES_REMOVE = `${CART_FIELDS}
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) @inContext(country: MX, language: ES) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { ...CartFields }
    userErrors { field message code }
    warnings { code message }
  }
}`;
export const CONNECTION_CHECK = `
query ConnectionCheck @inContext(country: MX, language: ES) {
  shop { name }
  localization { country { isoCode currency { isoCode } } }
  products(first: 1) {
    nodes {
      id handle
      variants(first: 1) { nodes { id availableForSale quantityAvailable price { currencyCode } } }
      metafield(namespace: "amoramar", key: "origin") { value }
    }
  }
  collections(first: 1) { nodes { handle } }
}`;
