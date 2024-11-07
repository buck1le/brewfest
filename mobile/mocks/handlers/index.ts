import { HOST, BREW_FEST_IMAGE_HOST } from 'lib/request';
import { http, HttpResponse } from 'msw';


export const handlers = [
  http.get(`${HOST}/events`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Katy",
        // Real data will point to remote image
        image: `${BREW_FEST_IMAGE_HOST}/WWBF-KATYImage.png`,
        description: "The World Wide Beer Festival",
        start_date: "2022-01-01",
        end_date: "2022-01-02",
        resources: {
          vendors: {
            href: `${HOST}/events/2/vendors`,
          },
        },
      },
      {
        id: 2,
        name: "Pflugerville",
        image: `${BREW_FEST_IMAGE_HOST}/WWBF-PflugervilleImage.png`,
        description: "The World Wide Beer Festival",
        start_date: "2022-01-01",
        end_date: "2022-01-02",
        resources: {
          vendors: {
            href: `${HOST}/events/2/vendors`,
          },
        },
      }
    ]
    );
  }),
  http.get(`${HOST}/events/2/vendors`, () => {
    return HttpResponse.json([
    ])
  }),
];
