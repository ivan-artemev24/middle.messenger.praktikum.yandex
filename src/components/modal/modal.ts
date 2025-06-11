import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import template from './modal.hbs?raw'
import './modal.css'

interface ModalProps {
  id?: string
  active?: boolean
  content: Block
  onClose?: () => void
  [key: string]: unknown
}

export class Modal extends Block {
  constructor (props: ModalProps) {
    super('div', {
      ...props,
      content: props.content.getContent()?.outerHTML
    })
  }

  render (): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled(this.props)

    const temp = document.createElement('template')
    temp.innerHTML = html
    const fragment = temp.content

    const overlay = fragment.querySelector('.modal__overlay')
    const props = this.props as ModalProps

    if (overlay && props.onClose) {
      overlay.addEventListener('click', () => props.onClose?.())
    }

    return fragment
  }
}
