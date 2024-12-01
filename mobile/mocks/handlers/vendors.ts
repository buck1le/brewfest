import { HOST, BREW_FEST_IMAGE_HOST } from 'lib/request';
import { http, HttpResponse } from 'msw';

export const vendorHandlers = [
  http.get(`${HOST}/events/2/vendors`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Martin House",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt  mollit anim id est laborum.",
        category: "drinks",
        operatingOutOf: "Austin, TX",
        coordinate: {
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
          ],
          inventory: {
            href: `${HOST}/events/2/vendors/1/inventory`
          }
        }
      },
      {
        id: 2,
        title: "P-Terry's",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt  mollit anim id est laborum.",
        category: "food",
        operatingOutOf: "Dallas, TX",
        coordinate: {
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
          ],
          inventory: {
            href: `${HOST}/events/2/vendors/1/inventory`
          }
        }
      },
      {
        id: 3,
        title: "A Shop",
        description: "Vendor 1 description",
        operatingOutOf: "Houston, TX",
        category: "shop",
        coordinate: {
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
          ],
          inventory: {
            href: `${HOST}/events/2/vendors/1/inventory`
          }
        }
      }
    ])
  }),]
