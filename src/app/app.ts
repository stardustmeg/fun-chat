/* eslint-disable no-console */
import type { Route } from './router/router.ts';

import styles from './app.module.scss';
import createFooter from './components/footer/footer.ts';
import openErrorModal, { loginCurrentUserOnReconnection } from './components/modal/server-connection-modal.ts';
import { APP_ROUTE } from './constants/app-routes.ts';
import { ERROR_MESSAGE, RETRY_INTERVAL, TAG_NAME } from './constants/constants.ts';
import getStore from './lib/store/store.ts';
import { Router } from './router/router.ts';
import { retryOpenSocket } from './services/api/websocket.ts';
import customCreateElement from './utils/base-element.ts';

export default class App {
  private readonly rootContainer: HTMLDivElement;

  private readonly router: Router;

  constructor() {
    this.rootContainer = customCreateElement(TAG_NAME.DIV, [styles.root]);
    const background = customCreateElement(TAG_NAME.DIV, [styles.background]);
    const wrapper = customCreateElement(TAG_NAME.DIV, [styles.wrapper]);
    const footer = createFooter();

    const store = getStore();
    const { currentUser } = store.getState();

    const initialRoute = currentUser ? APP_ROUTE.Main : APP_ROUTE.Authorization;

    this.router = this.createRouter(wrapper, initialRoute);
    this.rootContainer.append(background, wrapper, footer);

    setInterval(() => {
      // TBD move to websocket
      this.checkSocket();
    }, RETRY_INTERVAL);
  }

  private checkSocket(): void {
    const store = getStore();
    const { socketIsOpen } = store.getState();
    if (!socketIsOpen) {
      openErrorModal(ERROR_MESSAGE.WEBSOCKET_CLOSED);
      retryOpenSocket();
    } else {
      loginCurrentUserOnReconnection();
    }
  }

  private createRouter(routerOutlet: HTMLDivElement, defaultPath: string): Router {
    const routes: Route[] = [
      {
        component: async (): Promise<HTMLDivElement> => {
          const { default: createPage } = await import('./pages/authorization/authorization.ts');
          return createPage(this.router);
        },
        name: APP_ROUTE.Authorization,
      },
      {
        component: async (): Promise<HTMLDivElement> => {
          const { default: createPage } = await import('./pages/main/main.ts');
          return createPage(this.router);
        },
        name: APP_ROUTE.Main,
      },
      {
        component: async (): Promise<HTMLDivElement> => {
          const { default: createPage } = await import('./pages/about/about.ts');
          return createPage();
        },
        name: APP_ROUTE.About,
      },
    ];
    const notFoundComponent = async (): Promise<HTMLDivElement> => {
      const { default: createPage } = await import('./pages/not-found/not-found.ts');
      return createPage();
    };

    return new Router(
      routes,
      async (route) => {
        const component = await route.component();
        routerOutlet.replaceChildren(component);
      },
      notFoundComponent,
      defaultPath,
    );
  }

  public destroy(): void {
    this.rootContainer.remove();
    this.router.destroy();
  }

  public init(): void {
    document.body.append(this.rootContainer);
  }
}
