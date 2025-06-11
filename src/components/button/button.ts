import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import template from './button.hbs?raw'
import './button.css'

interface ButtonProps {
  label?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: string
  customClass?: string
  disabled?: boolean
  page?: string
  icon?: string
  events?: {
    click?: (event: MouseEvent) => void
  }
  [key: string]: unknown
}

export class Button extends Block {
  constructor (props: ButtonProps) {
    super('div', props)
  }

  render (): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled(this.props)
    const temp = document.createElement('template')
    temp.innerHTML = html
    const fragment = temp.content
    const button = fragment.querySelector('button')

    const events = this.props.events as ButtonProps['events'] | undefined

    if (button && events?.click) {
      button.addEventListener('click', (e: MouseEvent) => {
        events.click?.(e)
      })
    }

    return fragment
  }
}
