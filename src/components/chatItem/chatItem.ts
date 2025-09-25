import { Block } from '../../core/Block'
import template from './chatItemTemplate.hbs?raw'
import './chatItem.css'

interface ChatItemProps {
  id?: number
  name: string
  avatar: string | null
  avatarFallback?: string
  avatarIsSvg?: boolean
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  selected?: boolean
  events?: {
    click?: (e: MouseEvent) => void
  }
}

export class ChatItemComponent extends Block {
  constructor (props: ChatItemProps) {
    const className = `chat-item ${props.selected ? 'chat-item--selected' : ''}`

    // Если есть аватар с сервера - используем URL, иначе используем fallback
    const avatarSrc = props.avatar ?? props.avatarFallback ?? 'src/assets/avatar.jpg'

    super('div', {
      ...props,
      avatarSrc,
      avatarIsSvg: Boolean(props.avatarIsSvg && !props.avatar),
      alt: props.name ?? 'Чат',
      className,
      events: props.events
    })
  }

  render (): DocumentFragment {
    return this.compile(template, this.props)
  }
}
