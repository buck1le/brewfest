import { HOST, BREW_FEST_IMAGE_HOST } from 'lib/request';
import { http, HttpResponse } from 'msw';

export const scheduleHandlers = [
  http.get(`${HOST}/events/2/schedule`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Schedule item 1",
        description: "Event 1 description",
        startTime: "2022-01-01T00:00:00",
        endTime: "2022-01-01T01:00:00",
        createdAt: "2022-01-01T00:00:00",
        updatedAt: "2022-01-01T00:00:00",
        eventId: 2,
        image: {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_1.png`,
          alt: "Event 1",
        }
      },
      {
        id: 2,
        title: "Schedule item 2",
        description: "Event 2 description",
        startTime: "2022-01-01T00:00:00",
        endTime: "2022-01-01T01:00:00",
        createdAt: "2022-01-01T00:00:00",
        updatedAt: "2022-01-01T00:00:00",
        eventId: 2,
        image: {
          url: `${BREW_FEST_IMAGE_HOST}/schedule_item_2.png`,
          alt: "Event 1",
        }
      },
    ])
  }),
] 
