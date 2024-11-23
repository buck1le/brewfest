import { HOST, BREW_FEST_IMAGE_HOST } from 'lib/request';
import { http, HttpResponse } from 'msw';

export const vendorInventoryHandlers = [
  http.get(`${HOST}/events/2/vendors/1/inventory`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Martin House",
        type: "sour",
        image: {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Beer 1",
        }
      },
      {
        id: 2,
        title: "Martin House",
        type: "lagar",
        image: {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Beer 2",
        }
      },
      {
        id: 3,
        title: "Martin House",
        type: "ipa",
        image: {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Beer 3",
        }
      },
      {
        id: 4,
        title: "Martin House",
        type: "stout",
        image: {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Beer 4",
        }
      },
    ])
  }),]
