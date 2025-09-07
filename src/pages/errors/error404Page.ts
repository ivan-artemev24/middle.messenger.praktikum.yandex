import { Block } from '../../core/Block'
export class Error404Page extends Block {
  constructor () {
    super('div', {})
  }

  render () {
    const fragment = document.createElement('template')
    fragment.innerHTML = '<h1>404 — Страница не найдена</h1>'
    return fragment.content
  }
}
