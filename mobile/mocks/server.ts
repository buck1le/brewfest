import { setupServer } from 'msw/native';
import { handlers as generalHandlers } from './handlers';
import { vendorHandlers } from './handlers/vendors';
import { scheduleHandlers } from './handlers/schedule';

const handlers = [
  ...generalHandlers,
  ...vendorHandlers,
  ...scheduleHandlers
];

export const server = setupServer(...handlers);
