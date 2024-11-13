import { HOST, BREW_FEST_IMAGE_HOST } from 'lib/request';
import { http, HttpResponse } from 'msw';

export const vendorHandlers = [
  http.get(`${HOST}/events/2/vendors`, () => {
    return HttpResponse.json([
      {
        title: "Martin House",
        description: "Vendor 1 description",
        category: "drinks",
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/vendor_1.png`,
          alt: "Vendor 1",
        }
      },
      {
        title: "P-Terry's",
        description: "Vendor 1 description",
        category: "food",
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/vendor_1.png`,
          alt: "Vendor 1",
        }
      },
      {
        title: "A Shop",
        description: "Vendor 1 description",
        category: "shop",
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/vendor_1.png`,
          alt: "Vendor 1",
        }
      }
    ])
  }),
  http.get(`${HOST}/events/2/vendors?category=shop`, () => {
    return HttpResponse.json([
      {
        title: "A Shop",
        description: "Vendor 1 description",
        category: "shop",
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/vendor_1.png`,
          alt: "Vendor 1",
        }
      }
    ])
  }),
  http.get(`${HOST}/events/2/vendors?category=food`, () => {
    return HttpResponse.json([
      {
        title: "A Shop",
        description: "Vendor 1 description",
        category: "shop",
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/vendor_1.png`,
          alt: "Vendor 1",
        }
      }
    ])
  }),
  http.get(`${HOST}/events/2/vendors?category=drinks`, () => {
    return HttpResponse.json([
      {
        title: "Martin House",
        description: "Vendor 1 description",
        category: "drinks",
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/vendor_1.png`,
          alt: "Vendor 1",
        }
      },
    ])
  }), ]
