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

    if (button && this.props.events?.click) {
      button.addEventListener('click', (e: MouseEvent) => {
        this.props.events?.click?.(e)
      })
    }

    return fragment
  }
}
