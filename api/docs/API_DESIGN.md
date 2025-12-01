# API Design - Wild West Brewfest Mobile App

## Overview

This document outlines the RESTful API design for the Wild West Brewfest mobile application. The API follows a **resource-driven REST architecture** where each response includes a `resources` attribute containing hypermedia links (HATEOAS) for related operations and navigation.

## Base URL

```
https://api.brewfest.com/v1
```

## Authentication

All API requests should include an authentication token:

```
Authorization: Bearer {access_token}
```

## Common Response Structure

All API responses follow this structure:

```json
{
  "data": { ... },
  "resources": {
    "self": "https://api.brewfest.com/v1/...",
    "related": { ... }
  },
  "meta": {
    "timestamp": "2025-01-29T12:00:00Z",
    "version": "1.0"
  }
}
```

For collection responses:

```json
{
  "data": [ ... ],
  "resources": {
    "self": "https://api.brewfest.com/v1/...",
    "first": "...",
    "last": "...",
    "next": "...",
    "prev": "..."
  },
  "meta": {
    "total": 100,
    "count": 20,
    "per_page": 20,
    "current_page": 1,
    "last_page": 5
  }
}
```

---

## Events API

### Get Event Details

Retrieve information about the current festival event.

**Endpoint:** `GET /events/{event_id}`

**Response:**

```json
{
  "data": {
    "id": "evt_123",
    "name": "Wild West Brewfest",
    "location": {
      "city": "Katy",
      "state": "TX",
      "venue": "Katy Park",
      "address": "123 Festival Ln, Katy, TX 77494",
      "coordinates": {
        "lat": 29.7858,
        "lng": -95.8244
      }
    },
    "date": "2025-10-20",
    "start_time": "2025-10-20T12:00:00Z",
    "end_time": "2025-10-20T22:00:00Z",
    "status": "live",
    "vendor_count": 24,
    "drink_count": 150,
    "description": "Annual craft beer festival featuring local breweries and food vendors",
    "image_url": "https://cdn.brewfest.com/events/wwbf-katy.jpg"
  },
  "resources": {
    "self": "https://api.brewfest.com/v1/events/evt_123",
    "vendors": "https://api.brewfest.com/v1/events/evt_123/vendors",
    "drinks": "https://api.brewfest.com/v1/events/evt_123/drinks",
    "schedule": "https://api.brewfest.com/v1/events/evt_123/schedule",
    "map": "https://api.brewfest.com/v1/events/evt_123/map"
  }
}
```

---

## Vendors API

### List All Vendors

Retrieve all vendors for the current event.

**Endpoint:** `GET /events/{event_id}/vendors`

**Query Parameters:**
- `filter[type]` - Filter by vendor type: `brewery`, `food`
- `filter[featured]` - Filter featured vendors: `true`, `false`
- `sort` - Sort by: `name`, `booth`, `featured` (default: `featured`)
- `search` - Search by name, description, or tags
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)

**Response:**

```json
{
  "data": [
    {
      "id": "vnd_001",
      "name": "Hopworks Brewing",
      "type": "brewery",
      "booth": "A12",
      "description": "Award-winning craft brewery specializing in IPAs and stouts",
      "location": "Portland, OR",
      "image_url": "https://cdn.brewfest.com/vendors/hopworks.jpg",
      "images": [
        "https://cdn.brewfest.com/vendors/hopworks-1.jpg",
        "https://cdn.brewfest.com/vendors/hopworks-2.jpg",
        "https://cdn.brewfest.com/vendors/hopworks-3.jpg"
      ],
      "tags": ["IPA", "Stout", "Lager"],
      "is_featured": true,
      "resources": {
        "self": "https://api.brewfest.com/v1/vendors/vnd_001",
        "drinks": "https://api.brewfest.com/v1/vendors/vnd_001/drinks",
        "favorite": "https://api.brewfest.com/v1/users/me/favorites/vendors/vnd_001"
      }
    }
  ],
  "resources": {
    "self": "https://api.brewfest.com/v1/events/evt_123/vendors",
    "next": "https://api.brewfest.com/v1/events/evt_123/vendors?page=2"
  },
  "meta": {
    "total": 24,
    "count": 20,
    "per_page": 20,
    "current_page": 1,
    "last_page": 2
  }
}
```

### Get Vendor Details

Retrieve detailed information about a specific vendor.

**Endpoint:** `GET /vendors/{vendor_id}`

**Response:**

```json
{
  "data": {
    "id": "vnd_001",
    "name": "Hopworks Brewing",
    "type": "brewery",
    "booth": "A12",
    "description": "Award-winning craft brewery specializing in IPAs and stouts",
    "location": "Portland, OR",
    "image_url": "https://cdn.brewfest.com/vendors/hopworks.jpg",
    "images": [
      "https://cdn.brewfest.com/vendors/hopworks-1.jpg",
      "https://cdn.brewfest.com/vendors/hopworks-2.jpg"
    ],
    "tags": ["IPA", "Stout", "Lager"],
    "is_featured": true,
    "menu_items": [
      {
        "id": "drk_001",
        "name": "Cascade Hop IPA",
        "style": "IPA",
        "abv": "7.2%",
        "ibu": "68",
        "description": "West Coast style IPA with bold citrus and pine notes",
        "price": 8.00,
        "is_featured": true,
        "is_seasonal": false
      }
    ]
  },
  "resources": {
    "self": "https://api.brewfest.com/v1/vendors/vnd_001",
    "drinks": "https://api.brewfest.com/v1/vendors/vnd_001/drinks",
    "favorite": "https://api.brewfest.com/v1/users/me/favorites/vendors/vnd_001",
    "event": "https://api.brewfest.com/v1/events/evt_123"
  }
}
```

---

## Drinks API

### List All Drinks

Retrieve all drinks available at the event.

**Endpoint:** `GET /events/{event_id}/drinks`

**Query Parameters:**
- `filter[style]` - Filter by beer style: `IPA`, `Stout`, `Pale Ale`, `Sour`, etc.
- `filter[featured]` - Filter featured drinks: `true`, `false`
- `filter[seasonal]` - Filter seasonal drinks: `true`, `false`
- `filter[vendor_id]` - Filter by vendor ID
- `sort` - Sort by: `name`, `abv`, `price`, `featured` (default: `featured`)
- `search` - Search by name, description, style, or vendor
- `page` - Page number
- `per_page` - Items per page

**Response:**

```json
{
  "data": [
    {
      "id": "drk_001",
      "name": "Cascade Hop IPA",
      "vendor": {
        "id": "vnd_001",
        "name": "Hopworks Brewing",
        "booth": "A12"
      },
      "description": "West Coast style IPA with bold citrus and pine notes",
      "style": "IPA",
      "abv": "7.2%",
      "ibu": "68",
      "price": 8.00,
      "is_featured": true,
      "is_seasonal": false,
      "resources": {
        "self": "https://api.brewfest.com/v1/drinks/drk_001",
        "vendor": "https://api.brewfest.com/v1/vendors/vnd_001",
        "favorite": "https://api.brewfest.com/v1/users/me/favorites/drinks/drk_001"
      }
    }
  ],
  "resources": {
    "self": "https://api.brewfest.com/v1/events/evt_123/drinks",
    "next": "https://api.brewfest.com/v1/events/evt_123/drinks?page=2"
  },
  "meta": {
    "total": 150,
    "count": 20,
    "per_page": 20,
    "current_page": 1,
    "last_page": 8
  }
}
```

### Get Drink Details

Retrieve detailed information about a specific drink.

**Endpoint:** `GET /drinks/{drink_id}`

**Response:**

```json
{
  "data": {
    "id": "drk_001",
    "name": "Cascade Hop IPA",
    "vendor": {
      "id": "vnd_001",
      "name": "Hopworks Brewing",
      "booth": "A12",
      "location": "Portland, OR"
    },
    "description": "West Coast style IPA with bold citrus and pine notes",
    "style": "IPA",
    "abv": "7.2%",
    "ibu": "68",
    "price": 8.00,
    "is_featured": true,
    "is_seasonal": false,
    "tasting_notes": ["Citrus", "Pine", "Grapefruit"],
    "food_pairings": ["Spicy Foods", "Burgers", "Grilled Meats"]
  },
  "resources": {
    "self": "https://api.brewfest.com/v1/drinks/drk_001",
    "vendor": "https://api.brewfest.com/v1/vendors/vnd_001",
    "favorite": "https://api.brewfest.com/v1/users/me/favorites/drinks/drk_001",
    "event": "https://api.brewfest.com/v1/events/evt_123"
  }
}
```

---

## Favorites API

### List User Favorites

Retrieve all items favorited by the current user.

**Endpoint:** `GET /users/me/favorites`

**Query Parameters:**
- `filter[type]` - Filter by type: `vendor`, `drink`

**Response:**

```json
{
  "data": {
    "vendors": [
      {
        "id": "vnd_001",
        "name": "Hopworks Brewing",
        "booth": "A12",
        "favorited_at": "2025-01-29T10:30:00Z"
      }
    ],
    "drinks": [
      {
        "id": "drk_001",
        "name": "Cascade Hop IPA",
        "vendor_name": "Hopworks Brewing",
        "favorited_at": "2025-01-29T11:45:00Z"
      }
    ]
  },
  "resources": {
    "self": "https://api.brewfest.com/v1/users/me/favorites"
  },
  "meta": {
    "total_vendors": 3,
    "total_drinks": 7,
    "total": 10
  }
}
```

### Add Vendor to Favorites

Add a vendor to the user's favorites.

**Endpoint:** `POST /users/me/favorites/vendors/{vendor_id}`

**Response:**

```json
{
  "data": {
    "vendor_id": "vnd_001",
    "favorited": true,
    "favorited_at": "2025-01-29T12:00:00Z"
  },
  "resources": {
    "self": "https://api.brewfest.com/v1/users/me/favorites/vendors/vnd_001",
    "vendor": "https://api.brewfest.com/v1/vendors/vnd_001",
    "all_favorites": "https://api.brewfest.com/v1/users/me/favorites"
  }
}
```

### Remove Vendor from Favorites

Remove a vendor from the user's favorites.

**Endpoint:** `DELETE /users/me/favorites/vendors/{vendor_id}`

**Response:**

```json
{
  "data": {
    "vendor_id": "vnd_001",
    "favorited": false,
    "unfavorited_at": "2025-01-29T12:05:00Z"
  },
  "resources": {
    "vendor": "https://api.brewfest.com/v1/vendors/vnd_001",
    "all_favorites": "https://api.brewfest.com/v1/users/me/favorites"
  }
}
```

### Add Drink to Favorites

Add a drink to the user's favorites.

**Endpoint:** `POST /users/me/favorites/drinks/{drink_id}`

**Response:**

```json
{
  "data": {
    "drink_id": "drk_001",
    "favorited": true,
    "favorited_at": "2025-01-29T12:10:00Z"
  },
  "resources": {
    "self": "https://api.brewfest.com/v1/users/me/favorites/drinks/drk_001",
    "drink": "https://api.brewfest.com/v1/drinks/drk_001",
    "all_favorites": "https://api.brewfest.com/v1/users/me/favorites"
  }
}
```

### Remove Drink from Favorites

Remove a drink from the user's favorites.

**Endpoint:** `DELETE /users/me/favorites/drinks/{drink_id}`

**Response:**

```json
{
  "data": {
    "drink_id": "drk_001",
    "favorited": false,
    "unfavorited_at": "2025-01-29T12:15:00Z"
  },
  "resources": {
    "drink": "https://api.brewfest.com/v1/drinks/drk_001",
    "all_favorites": "https://api.brewfest.com/v1/users/me/favorites"
  }
}
```

---

## Error Responses

All error responses follow this structure:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "The requested vendor could not be found",
    "status": 404,
    "details": {
      "resource_type": "vendor",
      "resource_id": "vnd_999"
    }
  },
  "resources": {
    "docs": "https://api.brewfest.com/docs/errors",
    "support": "https://brewfest.com/support"
  }
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `bad_request` | Invalid request parameters |
| 401 | `unauthorized` | Missing or invalid authentication |
| 403 | `forbidden` | Insufficient permissions |
| 404 | `resource_not_found` | Resource does not exist |
| 422 | `validation_error` | Validation failed |
| 429 | `rate_limit_exceeded` | Too many requests |
| 500 | `internal_error` | Server error |
| 503 | `service_unavailable` | Service temporarily unavailable |

---

## Rate Limiting

API requests are rate-limited per user:

- **Authenticated users:** 1000 requests per hour
- **Unauthenticated users:** 100 requests per hour

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1643472000
```

---

## Versioning

The API uses URI versioning (e.g., `/v1/`). The current version is `v1`.

When breaking changes are introduced, a new version will be released, and the old version will be supported for at least 6 months.

---

## Implementation Notes

### Backend (Rust API)

1. All responses must include the `resources` object with hypermedia links
2. Use proper HTTP status codes
3. Implement CORS for mobile app access
4. Use pagination for collection endpoints
5. Support filtering, sorting, and searching via query parameters
6. Implement proper authentication and authorization
7. Return detailed error messages for validation failures

### Mobile App (Flutter)

1. Create repository interfaces matching these endpoints
2. Parse the `resources` object for navigation
3. Use the `meta` object for pagination UI
4. Implement proper error handling for all error codes
5. Cache responses appropriately
6. Handle rate limiting gracefully
7. Store favorites locally and sync with API

---

## Future Endpoints (Planned)

- `GET /events/{event_id}/schedule` - Event schedule
- `GET /events/{event_id}/map` - Interactive map data
- `POST /users/me/check-ins` - Check-in to event
- `GET /users/me/history` - User's event history
- `POST /feedback` - Submit feedback
- `GET /notifications` - User notifications
