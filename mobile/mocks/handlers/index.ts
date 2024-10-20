import { http, HttpResponse } from 'msw';


export const handlers = [
  http.get('/events', () => {
    return HttpResponse.json({
      id: 1,
    });
  }),
];

