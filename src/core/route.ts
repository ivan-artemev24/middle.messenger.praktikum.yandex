import { type Block } from './Block'

function isEqual (lhs: string, rhs: string): boolean {
  return lhs === rhs
}

function render (query: string, block: Block): HTMLElement | null {
  const root = document.querySelector<HTMLElement>(query) // сузили тип до HTMLElement
  if (!root) return null

  root.innerHTML = ''
  const content = block.getContent()
  if (content) {
    root.appendChild(content)
  }

  return root
}

export class Route {
  private _pathname: string
  private readonly _blockClass: new () => Block
  private _block: Block | null = null
  private readonly _props: { rootQuery: string }

  constructor (pathname: string, view: new () => Block, props: { rootQuery: string }) {
    this._pathname = pathname
    this._blockClass = view
    this._props = props
  }

  navigate (pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname
      this.render()
    }
  }

  leave (): void {
    if (this._block) {
      this._block.hide()
    }
  }

  match (pathname: string): boolean {
    return isEqual(pathname, this._pathname)
  }

  render (): void {
    try {
      if (!this._block) {
        this._block = new this._blockClass()
      }

      // Если по какой-то причине контент ещё не сгенерирован, принудительно вызовем CDM/рендер
      const content = this._block.getContent()
      if (!content || content.childNodes.length === 0) {
        this._block.dispatchComponentDidMount?.() // безопасный вызов опционального метода
      }

      // Убедимся, что блок не скрыт
      this._block.show()

      // Всегда рендерим блок в корень, чтобы гарантировать его присутствие в DOM
      render(this._props.rootQuery, this._block)
    } catch (error) {
      console.error(`Route render error for path "${this._pathname}"`, error)
    }
  }
}
