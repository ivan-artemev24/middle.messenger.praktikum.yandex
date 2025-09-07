import { Block } from '../../core/Block'
import Handlebars from 'handlebars'
import './userSearchModal.css'

export interface ChatUser {
  id: number
  login: string
  first_name: string
  second_name: string
  display_name: string | null
  avatar: string | null
}

interface UserListModalProps {
  users: ChatUser[]
  onRemove: (userId: number) => Promise<void>
  onClose: () => void
}

export class UserListModalComponent extends Block {
  constructor (props: UserListModalProps) {
    super('div', props)
  }

  render (): DocumentFragment {
    const template = `
      <div class="user-search-modal">
        <div class="user-search-modal__header">
          <h3>Участники чата</h3>
        </div>

        {{#if users.length}}
          <div class="user-search-modal__results">
            <div class="user-search-modal__users-list">
              {{#each users}}
                <div class="user-search-modal__user-item">
                  <div class="user-search-modal__user-info">
                    <span class="user-search-modal__user-login">{{login}}</span>
                    <span class="user-search-modal__user-name">{{first_name}} {{second_name}}</span>
                  </div>
                  <button class="user-search-modal__add-button" data-user-id="{{id}}" type="button">Удалить</button>
                </div>
              {{/each}}
            </div>
          </div>
        {{else}}
          <div class="user-search-modal__no-results"><p>В чате нет участников</p></div>
        {{/if}}

        <div class="user-search-modal__footer">
          <button class="user-search-modal__add-button" data-close-btn type="button">Закрыть</button>
        </div>
      </div>
    `

    const html = Handlebars.compile(template)({ users: this.props.users || [] })
    const temp = document.createElement('template')
    temp.innerHTML = html

    temp.content.querySelectorAll<HTMLButtonElement>('.user-search-modal__add-button').forEach(btn => {
      const idAttr = btn.getAttribute('data-user-id')
      if (idAttr) {
        btn.addEventListener('click', () => {
          const id = Number(idAttr)
          if (!Number.isNaN(id)) {
            void this.props.onRemove(id)
          }
        })
      }
    })

    const close = temp.content.querySelector<HTMLButtonElement>('[data-close-btn]')
    if (close) close.addEventListener('click', () => this.props.onClose())

    return temp.content
  }
}
