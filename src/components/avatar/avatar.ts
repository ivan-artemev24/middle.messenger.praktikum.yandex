import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import template from './avatar.hbs?raw'
import './avatar.css'

interface AvatarProps {
  src: string
  width?: string
  height?: string
  alt?: string
  customClass?: string
  [key: string]: unknown
}

export class Avatar extends Block {
  constructor (props: AvatarProps) {
    super('div', props)
  }

  render (): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled(this.props)

    const temp = document.createElement('template')
    temp.innerHTML = html
    return temp.content
  }
}
