import { Block } from '../../core/Block'
import type { Props } from '../../core/Block'
import template from './chats.hbs?raw'
import './chats.css'

import { ChatItemComponent } from '../../components/chatItem'
import { CorrespondenceFeedComponent } from '../../components/correspondenceFeed/correspondenceFeed'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { chatsMockData } from '../../mockData'

import arrowIcon from '../../assets/arrow-icon.svg?raw'

export class ChatsPage extends Block {
  constructor (props: Props = {}) {
    const searchInput = new InputComponent({
      name: 'search',
      label: 'Поиск',
      type: 'text',
      variant: 'outlined'
    })

    const profileButton = new ButtonComponent({
      label: 'Профиль',
      variant: 'link',
      page: 'user-profile',
      type: 'button'
    })

    const chatItemsHTML = chatsMockData.chats.map(chat =>
      new ChatItemComponent(chat).getContent()?.outerHTML
    ).join('')

    const feed = new CorrespondenceFeedComponent({
      contact: chatsMockData.selectedChat,
      messages: chatsMockData.messages,
      input: new InputComponent({
        name: 'message',
        label: 'Сообщение',
        type: 'text',
        variant: 'outlined'
      }),
      button: new ButtonComponent({
        label: '',
        icon: arrowIcon,
        variant: 'icon',
        type: 'submit'
      })
    })

    super('div', {
      ...props,
      searchInput: searchInput.getContent()?.outerHTML,
      profileButton: profileButton.getContent()?.outerHTML,
      chatItems: chatItemsHTML,
      feed: feed.getContent()?.outerHTML
    })
  }

  render (): DocumentFragment {
    return this.compile(template, this.props)
  }
}
