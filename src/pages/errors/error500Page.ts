import { Block } from '../../core/Block'
export class Error500Page extends Block {
  constructor () {
    super('div', {})
  }

  render () {
    const fragment = document.createElement('template')
    fragment.innerHTML = '<h1>500 — Ошибка сервера</h1>'
    return fragment.content
  }
}
