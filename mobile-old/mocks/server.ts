import { setupServer } from 'msw/native';
import { handlers as generalHandlers } from './handlers';
import { vendorHandlers } from './handlers/vendors';
import { vendorInventoryHandlers } from './handlers/vendors/inventory';
import { scheduleHandlers } from './handlers/schedule';

const handlers = [
  ...generalHandlers,
  ...vendorHandlers,
  ...scheduleHandlers,
  ...vendorInventoryHandlers,
];

export const server = setupServer(...handlers);
