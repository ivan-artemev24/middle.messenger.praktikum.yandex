import { Block } from '../../core/Block'
import template from './input.hbs?raw'
import './input.css'

interface InputProps {
  name: string
  id?: string
  type?: string
  label?: string
  value?: string
  placeholder?: string
  errorMessage?: string
  formId?: string
  disabled?: boolean
  customClass?: string
  variant?: 'standard' | 'outlined' | 'line'
  leftIcon?: string
  events?: {
    input?: (e: Event) => void
    blur?: (e: Event) => void
    focus?: (e: Event) => void
  }
}

export class InputComponent extends Block {
  constructor (props: InputProps) {
    const className = [
      'input',
      props.variant ? `input--${props.variant}` : '',
      props.customClass ?? ''
    ].join(' ').trim()

    super('div', {
      ...props,
      className,
      events: props.events
    })
  }

  render (): DocumentFragment {
    return this.compile(template, this.props)
  }
}
