import { Route } from './route'
import { type Block } from './Block'

export class Router {
  private static __instance: Router
  private readonly routes: Route[] = []
  private readonly history = window.history
  private _currentRoute: Route | null = null
  private readonly _rootQuery!: string

  constructor (rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance
    }

    this._rootQuery = rootQuery
    Router.__instance = this
  }

  use (pathname: string, block: new () => Block): this {
    if (!block || typeof block !== 'function') {
      console.error(`Router.use: invalid block for path "${pathname}"`, block)
      return this
    }

    const route = new Route(pathname, block, { rootQuery: this._rootQuery })
    this.routes.push(route)
    return this
  }

  start (): void {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname)
    }

    this._onRoute(window.location.pathname)
  }

  private _onRoute (pathname: string): void {
    const route = this.getRoute(pathname)
    if (!route) {
      console.warn(`Route for path "${pathname}" not found. Redirecting to /404`)
      this.go('/404')
      return
    }

    if (this._currentRoute) {
      this._currentRoute.leave()
    }

    this._currentRoute = route
    route.render()
  }

  go (pathname: string): void {
    const route = this.getRoute(pathname)
    if (!route) {
      console.warn(`Router.go: path "${pathname}" not registered. Redirecting to /404`)
      this._onRoute('/404')
      return
    }

    this.history.pushState({}, '', pathname)
    this._onRoute(pathname)
  }

  back (): void {
    this.history.back()
  }

  forward (): void {
    this.history.forward()
  }

  getRoute (pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname))
  }
}
