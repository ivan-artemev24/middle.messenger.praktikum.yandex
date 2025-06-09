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
  }

  private _render () {
    const block = this.render()
    if (this._element) {
      this._element.innerHTML = ''
      this._element.appendChild(block)
    }
  }

  protected abstract render (): DocumentFragment

  getContent (): HTMLElement | null {
    return this._element
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

  protected compile (template: string, context: Record<string, any>): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled(context)
    const temp = document.createElement('template')
    temp.innerHTML = html
    return temp.content
  }
}
