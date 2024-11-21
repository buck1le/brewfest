import { HOST, BREW_FEST_IMAGE_HOST } from 'lib/request';
import { http, HttpResponse } from 'msw';

export const vendorHandlers = [
  http.get(`${HOST}/events/2/vendors`, () => {
    return HttpResponse.json([
      {
        title: "Martin House",
        description: "Vendor 1 description",
        category: "drinks",
        location: {
          latitude: 30.524491,
          longitude: -97.543057,
        },
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Vendor 1",
        },
        resources: {
          images: [
            {
              url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
              alt: "Vendor 1",
            }
          ]
        }
      },
      {
        title: "P-Terry's",
        description: "Vendor 1 description",
        category: "food",
        location: {
          latitude: 30.524170,
          longitude: -97.541963,
        },
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Vendor 1",
        },
        resources: {
          images: [
            {
              url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
              alt: "Vendor 1",
            }
          ]
        }
      },
      {
        title: "A Shop",
        description: "Vendor 1 description",
        category: "shop",
        location: {
          latitude: 30.522951,
          longitude: -97.544419,
        },
        image:
        {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Vendor 1",
        },
        resources: {
          images: [
            {
              url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
              alt: "Vendor 1",
            }
          ]
        }
      }
    ])
  }),]
