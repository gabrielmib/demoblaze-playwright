import { test as base } from '@playwright/test';
import { DialogRecorder } from './dialogs';
import { AuthPage } from '../pages/AuthPage';
import { HomePage } from '../pages/HomePage';

type Fixtures = {
  dialogs: DialogRecorder;
  auth: AuthPage;
  home: HomePage;
};

export const test = base.extend<Fixtures>({
  dialogs: async ({ page }, use) => {
    const recorder = new DialogRecorder();
    recorder.attach(page);
    await use(recorder);
  },
  auth: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from '@playwright/test';
