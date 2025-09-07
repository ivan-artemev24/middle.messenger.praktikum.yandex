import { Block } from '../../core/Block'
import template from './correspondenceFeed.hbs?raw'
import './feed.css'

interface FeedMessage {
  content: string
  isMine?: boolean
}

interface FeedProps {
  messages: FeedMessage[]
  chatUsers?: Array<{ id: number, login: string, first_name: string, second_name: string, display_name: string | null, avatar: string | null }>
  avatarFallback?: string
  avatarIsSvg?: boolean
  input: Block // InputComponent
  button: Block // ButtonComponent (type="submit")
  onSendMessage?: (text: string) => void
}

export class CorrespondenceFeedComponent extends Block {
  private formHandlerSetup = false

  constructor (props: FeedProps) {
    super('div', {
      ...props,
      className: 'correspondence-feed',
      events: {}
    })
  }

  protected componentDidMount (): void {
    if (!this.formHandlerSetup) {
      // Небольшая задержка, чтобы DOM успел обновиться
      setTimeout(() => {
        this.setupFormHandler()
        this.scrollToBottom()
        this.formHandlerSetup = true
      }, 0)
    } else {
      this.scrollToBottom()
    }
  }

  private setupFormHandler () {
    // навешиваем обработчик на form data-form="send"
    const form = this.getContent()?.querySelector<HTMLFormElement>('form[data-form="send"]')
    if (form) {
      // Удаляем старые обработчики, если есть
      form.removeEventListener('submit', this.handleSubmit)
      // Добавляем новый обработчик
      form.addEventListener('submit', this.handleSubmit)

      // Также добавим обработчик на кнопку
      const button = form.querySelector('button[type="submit"]')
      if (button) {
        button.removeEventListener('click', this.handleSubmit)
        button.addEventListener('click', this.handleSubmit)
      }
    }
  }

  private readonly handleSubmit = (e: Event) => {
    e.preventDefault()

    // Ищем инпут в форме или в корне компонента
    const form = e.target as HTMLFormElement
    let inputEl = form.querySelector('input')

    // Если не нашли в форме, ищем в корне компонента
    if (!inputEl) {
      inputEl = this.getContent()?.querySelector('input') as HTMLInputElement | null
    }

    const value = inputEl?.value?.trim() ?? ''

    if (value) {
      this.props.onSendMessage?.(value)
      if (inputEl) inputEl.value = ''
      // проскроллить вниз после отправки
      this.scrollToBottom()
    }
  }

  private scrollToBottom () {
    const box = this.getContent()?.querySelector('#feed-messages')
    if (box) box.scrollTop = box.scrollHeight
  }

  render (): DocumentFragment {
    return this.compile(template, this.props)
  }
}
