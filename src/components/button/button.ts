import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import template from './button.hbs?raw'
import './button.css'

interface ButtonProps {
  label?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'icon' | 'link'
  customClass?: string
  disabled?: boolean
  page?: string
  icon?: string
  events?: {
    click?: (event: MouseEvent) => void
  }
}

export class ButtonComponent extends Block {
  constructor (props: ButtonProps) {
    const className = [
      'button',
      props.variant ? `button--${props.variant}` : '',
      props.customClass ?? ''
    ].join(' ').trim()

    // 👇 используем div, чтобы избежать вложенных <button>
    super('div', {
      ...props,
      className,
      type: props.type ?? 'button',
      events: props.events
    })
  }

  render (): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled(this.props)

    const temp = document.createElement('template')
    temp.innerHTML = html

    const fragment = temp.content
    const button = fragment.querySelector('button')

    if (button && this.props.events?.click) {
      const handler = this.props.events.click as (this: HTMLButtonElement, ev: MouseEvent) => void
      button.addEventListener('click', handler)
    }

    return fragment
  }
}
