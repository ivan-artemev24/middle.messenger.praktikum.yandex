import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import template from './correspondenceFeed.hbs?raw'
import emptyTemplate from './emptyFeed.hbs?raw'
import './feed.css'

interface Message {
  text?: string
  image?: string
  time: string
  isOwn?: boolean
}

interface Contact {
  name: string
  avatar: string // ✅ теперь строка, не компонент
}

interface FeedProps {
  contact?: Contact
  messages?: Message[]
  input?: Block
  button?: Block
  arrowIcon?: string
}

export class CorrespondenceFeedComponent extends Block {
  constructor (props: FeedProps = {}) {
    const inputHTML = props.input?.getContent()?.outerHTML
    const buttonHTML = props.button?.getContent()?.outerHTML

    super('div', {
      ...props,
      input: inputHTML,
      button: buttonHTML
    })
  }

  render (): DocumentFragment {
    const { contact, messages } = this.props

    const compiled = Handlebars.compile(
      contact && messages ? template : emptyTemplate
    )
    const html = compiled(this.props)

    const temp = document.createElement('template')
    temp.innerHTML = html

    return temp.content
  }
}
