import { Block } from '../../core/Block'
import { InputComponent } from '../input'
import { ButtonComponent } from '../button'
import { usersApi } from '../../api/usersApi'
import Handlebars from 'handlebars'
import './userSearchModal.css'

interface UserSearchModalProps {
  chatId: number
  mode: 'add' | 'remove'
  onUserAction: (userId: number) => Promise<void>
  onClose: () => void
}

export class UserSearchModalComponent extends Block {
  private searchQuery = ''

  constructor (props: UserSearchModalProps) {
    super('div', {
      ...props,
      searchResults: [],
      searchQuery: '',
      isLoading: false
    })
  }

  async componentDidMount (): Promise<void> {
    // Создаем элементы интерфейса
    const searchInput = new InputComponent({
      name: 'userSearch',
      label: 'Поиск пользователя по логину',
      type: 'text',
      variant: 'outlined',
      placeholder: 'Введите логин пользователя...',
      events: {
        input: (e: Event) => {
          const value = (e.target as HTMLInputElement).value.trim()
          this.searchQuery = value
          this.setProps({ searchQuery: value })
          this.debouncedSearch(value)
        }
      }
    })

    const searchButton = new ButtonComponent({
      label: 'Найти',
      variant: 'primary',
      type: 'button',
      events: {
        click: () => { void this.performSearch() }
      }
    })

    const closeButton = new ButtonComponent({
      label: 'Закрыть',
      variant: 'secondary',
      type: 'button',
      events: {
        click: () => this.props.onClose()
      }
    })

    this.setProps({
      searchInput,
      searchButton,
      closeButton
    })
  }

  private debounceTimeout: number | null = null

  private debouncedSearch (query: string) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }

    this.debounceTimeout = window.setTimeout(() => {
      if (query.length >= 2) {
        void this.performSearch()
      } else {
        this.setProps({ searchResults: [] })
      }
    }, 300)
  }

  private async performSearch () {
    if (!this.searchQuery.trim()) {
      this.setProps({ searchResults: [] })
      return
    }

    this.setProps({ isLoading: true })

    try {
      const results = await usersApi.searchByLogin(this.searchQuery.trim())
      this.setProps({ searchResults: results || [] })
    } catch (error) {
      console.error('Ошибка поиска пользователей:', error)
      this.setProps({ searchResults: [] })
    } finally {
      this.setProps({ isLoading: false })
    }
  }

  private async handleUserAction (userId: number) {
    try {
      await this.props.onUserAction(userId)
      this.props.onClose()
    } catch (error) {
      console.error('Ошибка выполнения действия с пользователем:', error)
    }
  }

  render (): DocumentFragment {
    const template = `
      <div class="user-search-modal">
        <div class="user-search-modal__header">
          <h3>{{#if isAddMode}}Добавить пользователя в чат{{else}}Удалить пользователя из чата{{/if}}</h3>
        </div>
        
        <div class="user-search-modal__search">
          <div class="user-search-modal__search-input" id="search-input-container">
            <!-- Компонент input будет вставлен сюда -->
          </div>
          <div class="user-search-modal__search-button" id="search-button-container">
            <!-- Компонент button будет вставлен сюда -->
          </div>
        </div>

        {{#if isLoading}}
          <div class="user-search-modal__loading">
            <p>Поиск...</p>
          </div>
        {{else if hasResults}}
          <div class="user-search-modal__results">
            <h4>Найденные пользователи:</h4>
            <div class="user-search-modal__users-list">
              {{#each searchResults}}
                <div class="user-search-modal__user-item">
                  <div class="user-search-modal__user-info">
                    <span class="user-search-modal__user-login">{{login}}</span>
                    <span class="user-search-modal__user-name">{{first_name}} {{second_name}}</span>
                  </div>
                  <button 
                    class="user-search-modal__add-button" 
                    data-user-id="{{id}}"
                    type="button"
                  >
                    {{#if ../isAddMode}}Добавить{{else}}Удалить{{/if}}
                  </button>
                </div>
              {{/each}}
            </div>
          </div>
        {{else if hasQuery}}
          <div class="user-search-modal__no-results">
            <p>Пользователи не найдены</p>
          </div>
        {{/if}}

        <div class="user-search-modal__footer" id="close-button-container">
          <!-- Компонент close button будет вставлен сюда -->
        </div>
      </div>
    `

    const compiled = Handlebars.compile(template)
    const html = compiled({
      searchResults: this.props.searchResults || [],
      isLoading: this.props.isLoading || false,
      searchQuery: this.props.searchQuery || '',
      isAddMode: this.props.mode === 'add',
      hasResults: (this.props.searchResults || []).length > 0,
      hasQuery: (this.props.searchQuery || '').length >= 2
    })

    const temp = document.createElement('template')
    temp.innerHTML = html

    // Вставляем компоненты по ID
    const searchInputEl = temp.content.querySelector('#search-input-container')
    if (searchInputEl && this.props.searchInput?.getContent()) {
      searchInputEl.appendChild(this.props.searchInput.getContent())
    }

    const searchButtonEl = temp.content.querySelector('#search-button-container')
    if (searchButtonEl && this.props.searchButton?.getContent()) {
      searchButtonEl.appendChild(this.props.searchButton.getContent())
    }

    const closeButtonEl = temp.content.querySelector('#close-button-container')
    if (closeButtonEl && this.props.closeButton?.getContent()) {
      closeButtonEl.appendChild(this.props.closeButton.getContent())
    }

    // Добавляем обработчики для кнопок действий с пользователями
    temp.content.querySelectorAll('.user-search-modal__add-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const userIdAttr = (e.target as HTMLElement).getAttribute('data-user-id')
        if (userIdAttr) {
          const userId = Number(userIdAttr)
          if (!Number.isNaN(userId)) {
            void this.handleUserAction(userId)
          }
        }
      })
    })

    return temp.content
  }
}
