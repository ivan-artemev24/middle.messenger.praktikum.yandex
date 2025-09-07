import { Block } from '../../core/Block'
import { InputComponent } from '../input/input'
import { ButtonComponent } from '../button/button'
import { chatsApi } from '../../api/chatsApi'

interface CreateChatFormProps {
  onCreated: () => void
}

export class CreateChatFormComponent extends Block {
  private readonly input: InputComponent
  private readonly onCreated: () => void
  private isListenerAttached = false // ✅ флаг

  constructor (props: CreateChatFormProps) {
    const input = new InputComponent({
      name: 'title',
      label: 'Название чата',
      type: 'text',
      variant: 'outlined'
    })

    const button = new ButtonComponent({
      label: 'Создать',
      type: 'submit',
      variant: 'primary'
    })

    super('form', {
      className: 'modal__form',
      input,
      button
    })

    this.input = input
    this.onCreated = props.onCreated
  }

  componentDidMount (): void {
    if (this.isListenerAttached) return // ✅ предотвратить дублирование

    const form = this.getContent() as HTMLFormElement
    if (form) {
      form.addEventListener('submit', (e: Event) => {
        e.preventDefault()
        const inputEl = this.input.getContent()?.querySelector('input') as HTMLInputElement | null
        const title = inputEl?.value?.trim()

        if (title) {
          console.log('[CreateChatForm] Creating chat:', title)
          void chatsApi.createChat({ title })
            .then(() => { this.onCreated() })
            .catch((err) => { console.error('[CreateChatForm] Error:', err) })
        } else {
          console.warn('[CreateChatForm] Title is empty')
        }
      })

      this.isListenerAttached = true // ✅ отметим, что слушатель навешан
    }
  }

  render (): DocumentFragment {
    return this.compile(`
      {{{input}}}
      {{{button}}}
    `, this.props)
  }
}
