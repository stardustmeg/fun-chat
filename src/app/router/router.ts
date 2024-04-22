import { APP_ROUTE, type AppRoute } from '../constants/app-routes.ts';
import { NOT_FOUND_PAGE_NAME } from '../constants/app-routes.ts';
import { EVENT_NAME } from '../constants/constants.ts';
import isAppRoute from './router-helper.ts';

export interface Route {
  component: () => Promise<HTMLDivElement>;
  name: AppRoute;
}

export class Router {
  constructor(
    private readonly routes: Route[],
    private onHistoryChange: (route: Route) => void,
    private notFoundComponent: () => Promise<HTMLDivElement>,
    defaultPath?: string,
  ) {
    window.addEventListener(EVENT_NAME.POPSTATE, this.onHistoryChangeHandler.bind(this));

    if (defaultPath) {
      this.navigateTo(defaultPath);
    } else {
      const CHAR_TO_SLICE = 1;
      const pathName = window.location.pathname.slice(CHAR_TO_SLICE) || APP_ROUTE.Authorization;

      this.navigateTo(pathName);
    }
  }

  private changePage(pathName: string): Route {
    const route = this.routes.find((route) => route.name === pathName) ?? {
      component: this.notFoundComponent,
      name: NOT_FOUND_PAGE_NAME,
    };

    this.onHistoryChange(route);

    return route;
  }

  private onHistoryChangeHandler(event: PopStateEvent): void {
    const routeName: unknown = event.state;

    if (!isAppRoute(routeName)) {
      return;
    }

    this.changePage(routeName);
  }

  public destroy(): void {
    window.removeEventListener(EVENT_NAME.POPSTATE, this.onHistoryChangeHandler.bind(this));
  }

  public navigateTo(pathName: string): void {
    const { name: routeName } = this.changePage(pathName);

    if (routeName === NOT_FOUND_PAGE_NAME) {
      history.replaceState(routeName, '', routeName);
    } else {
      history.pushState(routeName, '', routeName);
    }
  }
}
