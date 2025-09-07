import { Block } from '../../core/Block'
import template from './avatar.hbs?raw'
import './avatar.css'

interface AvatarProps {
  src: string
  width?: string
  height?: string
  alt?: string
  customClass?: string
  isSvg?: boolean
}

export class AvatarComponent extends Block {
  constructor (props: AvatarProps) {
    const className = `avatar ${props.customClass ?? ''}`.trim()

    super('div', {
      ...props,
      className
    })
  }

  render (): DocumentFragment {
    return this.compile(template, this.props)
  }
}
