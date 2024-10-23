import { setupServer } from 'msw/native';
import { handlers as generalHandlers } from './handlers';
import { handlers as imageHandlers } from './handlers/images';

const handlers = [
  ...generalHandlers,
  ...imageHandlers
];

export const server = setupServer(...handlers);
