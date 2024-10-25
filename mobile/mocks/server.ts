import { setupServer } from 'msw/native';
import { handlers as generalHandlers } from './handlers';

const handlers = [
  ...generalHandlers,
];

export const server = setupServer(...handlers);
