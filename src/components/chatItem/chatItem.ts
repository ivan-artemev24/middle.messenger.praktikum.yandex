import template from './chatItem.hbs?raw'
import { Block } from '../../core/Block'
import './chatItem.css'

interface ChatItemProps {
  name: string
  avatar: string // путь к изображению
  lastMessage: string
  lastMessageTime: string
  unreadCount?: number
  selected?: boolean
}

export class ChatItem extends Block {
  constructor (props: ChatItemProps) {
    const preparedProps = {
      ...props,
      avatarSrc: props.avatar,
      alt: props.name
    }

    super('div', preparedProps)
  }

  render () {
    return this.compile(template, this.props)
  }
}
