import Handlebars from 'handlebars'
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
}

export class Input extends Block {
  constructor (props: InputProps) {
    super('div', props)
  }

  render (): DocumentFragment {
    const compile = Handlebars.compile(template)
    const html = compile(this.props)

    const temp = document.createElement('template')
    temp.innerHTML = html

    return temp.content
  }
}
