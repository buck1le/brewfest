import { HOST } from 'lib/request';
import { http, HttpResponse } from 'msw';


export const handlers = [
  http.get(`${HOST}/events`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Katy",
        // Real data will point to remote image
        image: "https://brew-fest.s3.us-east-2.amazonaws.com/images/WWBF-KATYImage.png",
        description: "The World Wide Beer Festival",
        start_date: "2022-01-01",
        end_date: "2022-01-02",
      },
      {
        id: 2,
        name: "Pflugerville",
        image: "https://brew-fest.s3.us-east-2.amazonaws.com/images/WWBF-PflugervilleImage.png",
        description: "The World Wide Beer Festival",
        start_date: "2022-01-01",
        end_date: "2022-01-02",
      }
    ]
    );
  }),
];
