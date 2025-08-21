# Products API Documentation

This document provides detailed information about the Products API endpoints for influencers.

## Base URLs
- **Authenticated endpoints**: `/api/influencer/products` (Add, Delete)
- **Public endpoints**: `/api/products` (Get Products)

## Authentication
- **Add Product** and **Delete Product** endpoints require authentication. Include the JWT token in the request headers:
```
Authorization: Bearer <your-jwt-token>
```
- **Get Products** endpoint is public and does not require authentication.

---

## 1. Add Product

### Endpoint
```
POST /api/influencer/products
```

### Description
Creates a new product for the authenticated influencer.

### Request Schema
```json
{
  "productUrl": "string (required)",        // URL to the product page
  "productName": "string (optional)",       // Name/title of the product (empty string accepted)
  "imageUrl": "string (optional)",          // URL to product image (empty string accepted)
  "productDescription": "string (optional)", // Description of the product (empty string accepted)
  "sitename": "string (optional)",          // Name of the website/store (empty string accepted)
  "price": "number (optional)"              // Price of the product (decimal)
}
```

### Request Example
```json
{
  "productUrl": "https://example.com/product/123",
  "productName": "Wireless Bluetooth Headphones",
  "imageUrl": "https://example.com/images/headphones.jpg",
  "productDescription": "High-quality wireless headphones with noise cancellation",
  "sitename": "TechStore",
  "price": 99.99
}
```

### Minimal Request Example (Only productUrl required)
```json
{
  "productUrl": "https://example.com/product/456"
}
```

### Request with Empty Strings (Optional fields can be empty)
```json
{
  "productUrl": "https://example.com/product/789",
  "productName": "",
  "imageUrl": "",
  "productDescription": "",
  "sitename": ""
}
```

### Response Schema (Success - 200)
```json
{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "id": "number",                    // Auto-generated product ID
    "productUrl": "string",            // Product page URL
    "productName": "string|null",      // Product name
    "imageUrl": "string|null",         // Product image URL
    "productDescription": "string|null", // Product description
    "sitename": "string|null",         // Website name
    "price": "number|null",            // Product price
    "influencerId": "number",          // Associated influencer ID
    "createdAt": "string (ISO date)",  // Creation timestamp
    "updatedAt": "string (ISO date)"   // Last update timestamp
  }
}
```

### Response Example (Success)
```json
{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "id": 1,
    "productUrl": "https://example.com/product/123",
    "productName": "Wireless Bluetooth Headphones",
    "imageUrl": "https://example.com/images/headphones.jpg",
    "productDescription": "High-quality wireless headphones with noise cancellation",
    "sitename": "TechStore",
    "price": 99.99,
    "influencerId": 5,
    "createdAt": "2023-06-23T10:30:00.000Z",
    "updatedAt": "2023-06-23T10:30:00.000Z"
  }
}
```

### Error Responses
- **400 Bad Request**: Missing productUrl or invalid data
- **404 Not Found**: Influencer profile not found
- **500 Internal Server Error**: Server error

---

## 2. Update Product

### Endpoint
```
PUT /api/influencer/products/:productId
```

### Description
Updates an existing product for the authenticated influencer. All fields are optional.

### Path Parameters
- `productId` (number, required): The ID of the product to update

### Request Schema
```json
{
  "productUrl": "string (optional)",        // URL to the product page (cannot be empty)
  "productName": "string (optional)",       // Name/title of the product (empty string accepted)
  "imageUrl": "string (optional)",          // URL to product image (empty string accepted)
  "productDescription": "string (optional)", // Description of the product (empty string accepted)
  "sitename": "string (optional)",          // Name of the website/store (empty string accepted)
  "price": "number (optional)"              // Price of the product (decimal)
}
```

### Request Example
```
PUT /api/influencer/products/123
```

```json
{
  "productName": "Updated Wireless Bluetooth Headphones",
  "price": 89.99
}
```

### Response Schema (Success - 200)
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "number",                    // Product ID
    "productUrl": "string",            // Product page URL
    "productName": "string|null",      // Product name
    "imageUrl": "string|null",         // Product image URL
    "productDescription": "string|null", // Product description
    "sitename": "string|null",         // Website name
    "price": "number|null",            // Product price
    "influencerId": "number",          // Associated influencer ID
    "createdAt": "string (ISO date)",  // Creation timestamp
    "updatedAt": "string (ISO date)"   // Last update timestamp
  }
}
```

### Response Example (Success)
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 123,
    "productUrl": "https://example.com/product/123",
    "productName": "Updated Wireless Bluetooth Headphones",
    "imageUrl": "https://example.com/images/headphones.jpg",
    "productDescription": "High-quality wireless headphones with noise cancellation",
    "sitename": "TechStore",
    "price": 89.99,
    "influencerId": 5,
    "createdAt": "2023-06-23T10:30:00.000Z",
    "updatedAt": "2023-06-23T12:15:00.000Z"
  }
}
```

### Error Responses
- **400 Bad Request**: Invalid product ID format or invalid data
- **404 Not Found**: Product not found or permission denied
- **500 Internal Server Error**: Server error

---

## 3. Delete Product

### Endpoint
```
DELETE /api/influencer/products/:productId
```

### Description
Deletes a specific product belonging to the authenticated influencer.

### Path Parameters
- `productId` (number, required): The ID of the product to delete

### Request Example
```
DELETE /api/influencer/products/123
```

### Response Schema (Success - 200)
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "deletedProductId": "number",      // ID of the deleted product
    "productName": "string",           // Name of the deleted product
    "deletedAt": "string (ISO date)"   // Deletion timestamp
  }
}
```

### Response Example (Success)
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "deletedProductId": 123,
    "productName": "Wireless Bluetooth Headphones",
    "deletedAt": "2023-06-23T11:45:00.000Z"
  }
}
```

### Error Responses
- **400 Bad Request**: Invalid product ID format
- **404 Not Found**: Product not found or permission denied
- **500 Internal Server Error**: Server error

---

## 4. Get Products (with Pagination)

### Endpoint
```
GET /api/products
```

### Description
Retrieves all products for a specific influencer with pagination support. This is a public endpoint that does not require authentication.

### Query Parameters
- `influencerId` (number, required): The ID of the influencer whose products to fetch
- `skip` (number, optional, default: 0): Number of products to skip
- `limit` (number, optional, default: 10, max: 50): Number of products to return

### Request Example
```
GET /api/products?influencerId=5&skip=0&limit=10
```

### Response Schema (Success - 200)
```json
{
  "success": true,
  "data": {
    "influencer": {
      "id": "number",              // Influencer ID
      "name": "string|null",       // Influencer name
      "city": "string|null"        // Influencer city
    },
    "products": [
      {
        "id": "number",
        "productUrl": "string",
        "productName": "string",
        "imageUrl": "string",
        "productDescription": "string|null",
        "sitename": "string|null",
        "price": "number|null",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)"
      }
    ],
    "pagination": {
      "skip": "number",              // Current skip value
      "limit": "number",             // Current limit value
      "total": "number",             // Total number of products
      "returned": "number",          // Number of products returned in this response
      "hasMore": "boolean",          // Whether more products are available
      "nextSkip": "number|null"      // Next skip value for pagination (null if no more)
    }
  }
}
```

### Response Example (Success)
```json
{
  "success": true,
  "data": {
    "influencer": {
      "id": 5,
      "name": "John Doe",
      "city": "New York"
    },
    "products": [
      {
        "id": 1,
        "productUrl": "https://example.com/product/123",
        "productName": "Wireless Bluetooth Headphones",
        "imageUrl": "https://example.com/images/headphones.jpg",
        "productDescription": "High-quality wireless headphones with noise cancellation",
        "sitename": "TechStore",
        "price": 99.99,
        "createdAt": "2023-06-23T10:30:00.000Z",
        "updatedAt": "2023-06-23T10:30:00.000Z"
      },
      {
        "id": 2,
        "productUrl": "https://example.com/product/456",
        "productName": "Smartphone Case",
        "imageUrl": "https://example.com/images/case.jpg",
        "productDescription": null,
        "sitename": "PhoneAccessories",
        "price": 19.99,
        "createdAt": "2023-06-22T15:20:00.000Z",
        "updatedAt": "2023-06-22T15:20:00.000Z"
      }
    ],
    "pagination": {
      "skip": 0,
      "limit": 10,
      "total": 25,
      "returned": 2,
      "hasMore": true,
      "nextSkip": 10
    }
  }
}
```

### Error Responses
- **400 Bad Request**: Missing or invalid influencerId, invalid pagination parameters
- **404 Not Found**: Influencer not found
- **500 Internal Server Error**: Server error

---

## General Error Response Schema
```json
{
  "success": false,
  "message": "string",      // Error description
  "error": "object|null"    // Additional error details (in development)
}
```

## Validation Rules

### Add Product Validation
- `productUrl`: Must be a valid URL format
- `productName`: Required, non-empty string (trimmed)
- `imageUrl`: Must be a valid URL format
- `productDescription`: Optional string (trimmed if provided)
- `sitename`: Optional string (trimmed if provided)
- `price`: Optional number, must be non-negative if provided

### Delete Product Validation
- `productId`: Must be a valid positive integer
- Authorization: Product must belong to the authenticated influencer

### Get Products Validation
- `influencerId`: Required, must be a valid positive integer
- `skip`: Must be non-negative integer
- `limit`: Must be positive integer, maximum 50

## Status Codes Summary
- **200**: Success
- **400**: Bad Request (validation errors, invalid parameters)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found (resource doesn't exist or no permission)
- **500**: Internal Server Error 