// src/mocks/browser.js
import * as MSW from 'msw';
import { handlers } from './handlers';
const { setupWorker } = MSW;

export const worker = setupWorker(...handlers);