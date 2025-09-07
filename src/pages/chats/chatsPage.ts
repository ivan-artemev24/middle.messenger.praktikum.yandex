// src/pages/chats/chatsPage.ts
import { Block } from '../../core/Block'
import type { Props } from '../../core/Block'
import template from './chats.hbs?raw'
import './chats.css'

import { ChatItemComponent } from '../../components/chatItem'
import { CorrespondenceFeedComponent } from '../../components/correspondenceFeed/correspondenceFeed'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { ModalComponent } from '../../components/modal/modal'
import { CreateChatFormComponent } from '../../components/createChatForm/createChatForm'
import { UserSearchModalComponent } from '../../components/userSearchModal/userSearchModal'
import { UserListModalComponent } from '../../components/userSearchModal/userListModal'

import { chatsApi } from '../../api/chatsApi'
import { authApi } from '../../api/authApi'
import * as ChatSocketModule from '../../utils/chatSocket'

import arrowIcon from '../../assets/arrow-icon.svg?raw'
import avatarFallback from '../../assets/avatar-icon.svg?raw'

const ChatSocket = ChatSocketModule.ChatSocket
type ChatMessage = ChatSocketModule.ChatMessage

// Заглушка справа
class EmptyFeed extends Block {
  constructor () {
    super('div', { className: 'correspondence-feed__empty' })
  }

  render () {
    const tpl = document.createElement('template')
    tpl.innerHTML = '<p>Выберите чат</p>'
    return tpl.content
  }
}

interface ChatListItem {
  id: number
  title: string
  avatar: string | null
  unread_count?: number
  last_message?: { content: string, time: string } | null
}

export class ChatsPage extends Block {
  private socket: InstanceType<typeof ChatSocket> | null = null
  private userId: number | null = null
  private activeChatId: number | null = null
  private messages: ChatMessage[] = []
  private chatUsers: Array<{ id: number, login: string, first_name: string, second_name: string, display_name: string | null, avatar: string | null }> = []

  // кэш списка и поиск
  private fullChatList: ChatListItem[] = []
  private searchQuery = ''

  // флажок от двойного удаления
  private isDeleting = false

  constructor (props: Props = {}) {
    super('div', props)
  }

  async componentDidMount (): Promise<void> {
    await this.loadChats()
  }

  /** Загрузить список чатов и отрендерить левую колонку */
  private async loadChats (): Promise<void> {
    try {
      const user = await authApi.getUser()
      this.userId = (user as { id: number }).id

      const chatList = await chatsApi.getChats()
      this.fullChatList = (chatList as ChatListItem[]) ?? []

      // Поиск
      const searchInput = new InputComponent({
        name: 'search',
        label: 'Поиск',
        type: 'text',
        variant: 'outlined',
        value: this.searchQuery,
        events: {
          input: (e: Event) => {
            const value = (e.target as HTMLInputElement).value.trim().toLowerCase()
            this.searchQuery = value
            this.updateChatListOnly()
          }
        }
      })

      // Профиль
      const profileButton = new ButtonComponent({
        label: 'Профиль',
        variant: 'link',
        page: 'user-profile',
        type: 'button'
      })

      // Создать чат
      const createChatButton = new ButtonComponent({
        label: 'Создать чат',
        variant: 'primary',
        type: 'button',
        customClass: 'chats__create-button',
        events: { click: () => { this.openCreateChatModal() } }
      })

      // Панель действий (пока неактивна — включим при выборе)
      const addUserButton = new ButtonComponent({
        label: 'Добавить пользователя',
        variant: 'secondary',
        type: 'button',
        customClass: 'chats__action-btn chats__action-btn--add',
        events: { click: () => { void this.handleAddUser() } }
      })

      const removeUserButton = new ButtonComponent({
        label: 'Удалить пользователя',
        variant: 'secondary',
        type: 'button',
        customClass: 'chats__action-btn chats__action-btn--remove',
        events: { click: () => { void this.handleRemoveUser() } }
      })

      const deleteChatButton = new ButtonComponent({
        label: 'Удалить чат',
        variant: 'secondary',
        type: 'button',
        customClass: 'chats__action-btn chats__action-btn--delete',
        events: { click: () => { void this.handleDeleteChat() } }
      })

      const chatItems = this.buildChatItems(this.filteredChats())
      const feed = new EmptyFeed()

      this.setProps({
        searchInput,
        profileButton,
        createChatButton,
        addUserButton,
        removeUserButton,
        deleteChatButton,
        chatItems,
        feed,
        modal: null
      })

      // Сделаем кнопки панели серыми/заблокированными (чата ещё нет)
      this.updateActionButtonsState()
    } catch (e) {
      console.error('Ошибка при загрузке чатов:', e)
    }
  }

  /** Перерисовать список чатов по текущему фильтру */
  private renderChatList () {
    const list = this.buildChatItems(this.filteredChats())
    this.setProps({ chatItems: list })

    // Обновляем поле поиска
    this.updateSearchInput()
  }

  private updateSearchInput () {
    const searchInput = this.getContent()?.querySelector('input[name="search"]') as HTMLInputElement | null
    if (searchInput) {
      const wasFocused = document.activeElement === searchInput
      const cursorPosition = searchInput.selectionStart

      searchInput.value = this.searchQuery

      // Восстанавливаем фокус и позицию курсора если поле было в фокусе
      if (wasFocused) {
        searchInput.focus()
        if (cursorPosition != null) searchInput.setSelectionRange(cursorPosition, cursorPosition)
      }
    }
  }

  private updateChatListOnly () {
    const list = this.buildChatItems(this.filteredChats())
    this.setProps({ chatItems: list })

    // Обновляем поле поиска без потери фокуса
    this.updateSearchInput()
  }

  private filteredChats () {
    if (!this.searchQuery) return this.fullChatList
    return this.fullChatList.filter(c => c.title.toLowerCase().includes(this.searchQuery))
  }

  private buildChatItems (list: ChatListItem[]) {
    return list.map(chat =>
      new ChatItemComponent({
        name: chat.title,
        avatar: chat.avatar ? `https://ya-praktikum.tech/api/v2/resources${chat.avatar}` : null,
        avatarFallback,
        avatarIsSvg: !chat.avatar,
        lastMessage: chat.last_message?.content ?? '',
        lastMessageTime: this.formatTime(chat.last_message?.time ?? ''),
        unreadCount: chat.unread_count,
        selected: this.activeChatId === chat.id,
        events: { click: () => { void this.selectChat(chat.id) } }
      })
    )
  }

  private formatTime (timeString: string): string {
    if (!timeString) return ''
    try {
      const date = new Date(timeString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    } catch (e) {
      return timeString
    }
  }

  /** Выбор чата + подключение сокета */
  async selectChat (chatId: number) {
    try {
      if (!this.userId) return

      this.activeChatId = chatId
      this.socket?.close()
      this.messages = []

      // обновим подсветку выбранного
      this.renderChatList()

      const { token } = await chatsApi.getToken(chatId)
      this.socket = new ChatSocket(chatId, this.userId, token)

      this.socket.connect(
        (message: ChatMessage) => {
          // Игнорируем pong сообщения
          if (message.type === 'pong') {
            return
          }
          // Новое сообщение - проверяем, не добавили ли уже локально
          const isDuplicate = this.messages.some(m =>
            m.content === message.content &&
            m.user_id === message.user_id &&
            Math.abs(new Date(m.time ?? '').getTime() - new Date(message.time ?? '').getTime()) < 1000
          )
          if (!isDuplicate) {
            this.messages.push(message)
            this.renderFeed(true)
          }
        },
        (history: ChatMessage[]) => {
          // История сообщений (последние 20)
          this.messages = history.slice(-20).reverse() // reverse чтобы новые были внизу
          this.renderFeed(true)
          this.updateActionButtonsState() // активируем кнопки после загрузки сообщений
        }
      )

      // загрузим участников чата
      try {
        const users = await chatsApi.getChatUsers(chatId)
        this.chatUsers = Array.isArray(users) ? users as any : []
      } catch (e) {
        this.chatUsers = []
      }
    } catch (e) {
      console.error('Ошибка при подключении к чату:', e)
    }
  }

  /** Правая часть: лента + форма отправки */
  private renderFeed (scrollToBottom = false) {
    const input = new InputComponent({
      name: 'message',
      label: 'Сообщение',
      type: 'text',
      variant: 'outlined'
    })

    const button = new ButtonComponent({
      label: '',
      icon: arrowIcon,
      variant: 'icon',
      type: 'submit'
    })

    const feed = new CorrespondenceFeedComponent({
      messages: this.messages,
      chatUsers: this.chatUsers,
      avatarFallback,
      avatarIsSvg: true,
      input,
      button,
      onSendMessage: (msg: string) => {
        if (!msg.trim()) return
        this.socket?.send(msg)
        // Не добавляем локально - сообщение придет через сокет
      }
    })

    this.setProps({ feed })

    if (scrollToBottom) {
      // небольшой тик, чтобы DOM успел обновиться
      setTimeout(() => {
        const feedEl = document.querySelector('#chat-feed')
        if (feedEl) feedEl.scrollTop = feedEl.scrollHeight
      })
    }
  }

  /** Активность/цвет кнопок панели действий в зависимости от выбранного чата */
  private updateActionButtonsState () {
    const hasActive = Boolean(this.activeChatId)

    const toggleBtn = (key: 'addUserButton' | 'removeUserButton' | 'deleteChatButton') => {
      const root = (this.props[key] as Block)?.getContent()
      if (!root) return
      const btn = root.querySelector('button')
      if (!btn) return
      btn.classList.toggle('button--primary', hasActive)
      btn.classList.toggle('button--secondary', !hasActive)
      btn.disabled = !hasActive
    }

    toggleBtn('addUserButton')
    toggleBtn('removeUserButton')
    toggleBtn('deleteChatButton')
  }

  /** Модалка создания чата */
  private openCreateChatModal () {
    const form = new CreateChatFormComponent({
      onCreated: () => {
        this.closeModal()
        void this.loadChats()
      }
    })

    const modal = new ModalComponent({
      active: true,
      content: form,
      onClose: () => { this.closeModal() }
    })

    this.setProps({ modal })
  }

  private closeModal () {
    this.setProps({ modal: null })
  }

  /** Добавить пользователя (по login) */
  private async handleAddUser () {
    if (!this.activeChatId) return

    const userSearchModal = new UserSearchModalComponent({
      chatId: this.activeChatId,
      mode: 'add',
      onUserAction: async (userId: number) => {
        try {
          const chatId = this.activeChatId
          if (chatId == null) return
          await chatsApi.addUserToChat({ users: [userId], chatId })
          alert('Пользователь добавлен в чат')
        } catch (e) {
          console.error('❌ Не удалось добавить пользователя', e)
          alert('Не удалось добавить пользователя')
          throw e
        }
      },
      onClose: () => { this.closeModal() }
    })

    const modal = new ModalComponent({
      active: true,
      content: userSearchModal,
      onClose: () => { this.closeModal() }
    })

    this.setProps({ modal })
  }

  /** Удалить пользователя (по login) */
  private async handleRemoveUser () {
    if (!this.activeChatId) return

    // если пользователей ещё нет в памяти — подгрузим
    if (!this.chatUsers.length && this.activeChatId) {
      try {
        const users = await chatsApi.getChatUsers(this.activeChatId)
        this.chatUsers = Array.isArray(users) ? users as any : []
      } catch {
        this.chatUsers = []
      }
    }

    const list = new UserListModalComponent({
      users: this.chatUsers.filter(u => this.userId != null ? u.id !== this.userId : true),
      onRemove: async (userId: number) => {
        try {
          const chatId = this.activeChatId
          if (chatId == null) return
          await chatsApi.removeUserFromChat({ users: [userId], chatId })
          // обновим локальный список
          this.chatUsers = this.chatUsers.filter(u => u.id !== userId)
          // перерисуем ленту (чтобы обновились чипы в header)
          this.renderFeed()
          // закрыть модалку после успешного удаления
          this.closeModal()
        } catch (e) {
          console.error('❌ Не удалось удалить пользователя', e)
          alert('Не удалось удалить пользователя')
        }
      },
      onClose: () => { this.closeModal() }
    })

    const modal = new ModalComponent({ active: true, content: list, onClose: () => { this.closeModal() } })
    this.setProps({ modal })
  }

  /** Удалить чат (с предохранителем от двойного confirm) */
  private async handleDeleteChat () {
    if (!this.activeChatId) return
    if (this.isDeleting) return
    this.isDeleting = true

    try {
      const ok = window.confirm('Удалить чат?')
      if (!ok) return
      await chatsApi.deleteChat(this.activeChatId)
      this.activeChatId = null
      this.socket?.close()
      this.messages = []
      await this.loadChats()
    } catch (e) {
      console.error('Не удалось удалить чат', e)
      alert('Не удалось удалить чат')
    } finally {
      this.isDeleting = false
    }
  }

  render (): DocumentFragment {
    return this.compile(template, this.props)
  }

  componentWillUnmount (): void {
    this.socket?.close()
  }
}
