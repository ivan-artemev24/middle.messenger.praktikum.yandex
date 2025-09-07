import { EventBus } from './EventBus'
import Handlebars from 'handlebars'

export type Props = Record<string, any>

export abstract class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update'
  }

  private _element: HTMLElement | null = null
  private readonly _meta: { tagName: string, props: Props }
  private readonly eventBus: EventBus
  protected props: Props

  // 🔗 храним актуальные обработчики, чтобы снимать перед повторным рендером
  private _handlers: Array<[string, EventListener]> = []

  constructor (tagName = 'div', props: Props = {}) {
    const eventBus = new EventBus()
    this._meta = { tagName, props }
    this.props = this._makePropsProxy(props)
    this.eventBus = eventBus
    this._registerEvents(eventBus)
    eventBus.emit(Block.EVENTS.INIT)
  }

  private _registerEvents (eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdateHandler.bind(this))
  }

  private _init () {
    this._createResources()
    this.eventBus.emit(Block.EVENTS.FLOW_CDM)
  }

  private _createResources () {
    const { tagName } = this._meta
    this._element = document.createElement(tagName)
  }

  private _componentDidMount () {
    this.componentDidMount()
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
  }

  protected componentDidMount (): void {}

  protected componentDidUpdate (_oldProps: Props, _newProps: Props): void {}

  private _componentDidUpdateHandler (...args: unknown[]): void {
    const [oldProps, newProps] = args as [Props, Props]
    this.componentDidUpdate(oldProps, newProps)
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
  }

  private _render () {
    const block = this.render()

    if (this._element) {
      // снять старые слушатели перед новым рендером
      this._removeEvents()

      this._element.innerHTML = ''
      this._element.appendChild(block)

      // навесить слушатели заново
      this._addEvents()
    }
  }

  protected abstract render (): DocumentFragment

  getContent (): HTMLElement | null {
    return this._element
  }

  show (): void {
    this._element?.classList.remove('hidden')
  }

  hide (): void {
    this._element?.classList.add('hidden')
  }

  setProps (nextProps: Props): void {
    const oldProps = { ...this.props }
    Object.assign(this.props, nextProps)
    this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, nextProps)
  }

  private _makePropsProxy (props: Props): Props {
    return new Proxy(props, {
      get: (target, prop: string) => {
        const value = target[prop]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set: (target, prop: string, value) => {
        target[prop] = value
        this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
        return true
      },
      deleteProperty () {
        throw new Error('Нет доступа')
      }
    })
  }

  // навесить события из props.events на корневой элемент блока
  private _addEvents () {
    const root = this._element
    const events = this.props?.events as Record<string, EventListener> | undefined
    if (!root || !events) return

    this._handlers = []
    Object.entries(events).forEach(([type, handler]) => {
      if (typeof handler === 'function') {
        const bound = handler
        root.addEventListener(type, bound)
        this._handlers.push([type, bound])
      }
    })
  }

  private _removeEvents () {
    const root = this._element
    if (!root || !this._handlers.length) return
    this._handlers.forEach(([type, handler]) => { root.removeEventListener(type, handler) })
    this._handlers = []
  }

  // compile с поддержкой компонентов + вызов CDM у вложенных
  protected compile (template: string, context: Record<string, any>): DocumentFragment {
    const contextWithPlaceholders: Record<string, any> = {}
    const components: Record<string, Block> = {}

    for (const key in context) {
      const value = context[key]

      if (value instanceof Block) {
        const id = `component-${key}-${Math.random().toString(36).substring(2, 9)}`
        contextWithPlaceholders[key] = `<div data-id="${id}"></div>`
        components[id] = value
      } else if (Array.isArray(value) && value.every(v => v instanceof Block)) {
        const ids = value.map((v, i) => {
          const id = `component-${key}-${i}-${Math.random().toString(36).substring(2, 9)}`
          components[id] = v
          return `<div data-id="${id}"></div>`
        })
        contextWithPlaceholders[key] = ids.join('')
      } else {
        contextWithPlaceholders[key] = value
      }
    }

    const compiled = Handlebars.compile(template)
    const html = compiled(contextWithPlaceholders)

    const temp = document.createElement('template')
    temp.innerHTML = html

    Object.entries(components).forEach(([id, component]) => {
      const stub = temp.content.querySelector(`[data-id="${id}"]`)
      const contentEl = component.getContent()
      if (stub && contentEl) {
        stub.replaceWith(contentEl)
        component.dispatchComponentDidMount()
      }
    })

    return temp.content
  }

  // публичный вызов CDM (используется в compile)
  dispatchComponentDidMount (): void {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM)
  }
}
