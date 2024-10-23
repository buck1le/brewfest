import { HttpResponse, http } from 'msw';

// Images hosted with AWS S3
export const BREW_FEST_IMAGE_HOST = "https://brew-fest.s3.us-east-2.amazonaws.com/images";

// Image binary handlers
export const handlers = [
  http.get(`${BREW_FEST_IMAGE_HOST}/WWBF-KATYImage.png`, async () => {
    const image = await fetch(`${BREW_FEST_IMAGE_HOST}/WWBF-KATYImage.png`).then(res =>
      res.arrayBuffer()
    );

    console.log("image", image);

    HttpResponse.arrayBuffer(image, {
      headers: {
        'Content-Type': 'image/png',
      }
    });
  }),
  http.get(`${BREW_FEST_IMAGE_HOST}/WWBF-PflugervilleImage.png`, async () => {
    const image = await fetch(`${BREW_FEST_IMAGE_HOST}/WWBF-PflugervilleImage.png`).then(res =>
      res.arrayBuffer()
    );

    HttpResponse.arrayBuffer(image, {
      headers: {
        'Content-Type': 'image/png',
      }
    });
  })
];

