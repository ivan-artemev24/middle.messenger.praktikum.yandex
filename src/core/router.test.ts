import { Router } from './router'
import { Route } from './route'
import { Block } from './Block'

class DummyPage extends Block {
  protected render (): DocumentFragment {
    const tpl = document.createElement('template')
    tpl.innerHTML = '<div>Dummy</div>'
    return tpl.content
  }
}

describe('Router', () => {
  let router: Router
  let root: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    const appElement = document.getElementById('app')
    if (!appElement) {
      throw new Error('App element not found')
    }
    root = appElement
    router = new Router('#app')
  })

  test('registers routes with use()', () => {
    const useReturn = router.use('/test', DummyPage)
    expect(useReturn).toBe(router)
    const route = router.getRoute('/test')
    expect(route).toBeInstanceOf(Route)
  })

  test('start() renders current route', () => {
    router.use('/', DummyPage)
    router.start()
    expect(root.innerHTML).toContain('Dummy')
  })

  test('go() changes history and renders', () => {
    router.use('/a', DummyPage).use('/b', DummyPage)
    router.start()
    router.go('/a')
    expect(root.innerHTML).toContain('Dummy')
    router.go('/b')
    expect(root.innerHTML).toContain('Dummy')
  })

  test('getRoute returns undefined for unknown path', () => {
    expect(router.getRoute('/unknown')).toBeUndefined()
  })
})
