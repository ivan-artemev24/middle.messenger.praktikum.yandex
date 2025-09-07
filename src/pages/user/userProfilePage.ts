import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import type { Props } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { AvatarComponent } from '../../components/avatar'
import { ModalComponent } from '../../components/modal'
import { validateInput } from '../../utils/validation'
import { authApi } from '../../api/authApi'
import avatarFallback from '../../assets/avatar.jpg?url'
import template from './userProfile.hbs?raw'
import './userProfile.css'

// Удалён неиспользуемый класс AvatarModalContent

export class UserProfilePage extends Block {
  constructor (props?: Props) {
    const backButton = new ButtonComponent({
      label: '←',
      type: 'button',
      variant: 'icon',
      page: 'messenger'
    })

    const editDataButton = new ButtonComponent({
      label: 'Изменить данные',
      type: 'button',
      variant: 'link',
      page: 'settings'
    })

    const cancelButton = new ButtonComponent({
      label: 'Отмена',
      type: 'button',
      variant: 'link',
      page: 'user-profile'
    })

    const editPasswordButton = new ButtonComponent({
      label: 'Изменить пароль',
      type: 'button',
      variant: 'link',
      page: 'edit-password'
    })

    const logoutButton = new ButtonComponent({
      label: 'Выйти',
      type: 'button',
      variant: 'link',
      customClass: 'logout-button',
      page: '/'
    })

    const submitButton = new ButtonComponent({
      label: 'Сохранить',
      type: 'submit',
      variant: 'primary'
    })

    // Создаем пустое модальное окно, которое будет заполняться динамически
    class EmptyBlock extends Block {
      render (): DocumentFragment {
        const temp = document.createElement('template')
        temp.innerHTML = '<div class="empty-modal"></div>'
        return temp.content
      }
    }

    const modal = new ModalComponent({
      id: 'change-avatar-modal',
      active: false,
      content: new EmptyBlock('div', { className: 'empty-modal' }),
      onClose: () => {
        this.setProps({ modalActive: false })
      }
    })

    super('div', {
      ...props,
      backButton,
      editDataButton,
      editPasswordButton,
      logoutButton,
      submitButton,
      cancelButton,
      modal,
      disableEdit: props?.disableEdit ?? true,
      display_name: '',
      user: null,
      avatar: null,
      modalActive: false,
      events: {
        submit: async function (this: HTMLFormElement, e: SubmitEvent) {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const inputs = form.querySelectorAll('input')
          const data: Record<string, string> = {}
          let isValid = true

          inputs.forEach(input => {
            if (input.type === 'file') return
            const error = validateInput(input.name, input.value)
            const wrapper = input.closest('.input-field')
            let errorSpan = wrapper?.querySelector('.input-error-text') as HTMLElement | null

            if (!errorSpan) {
              errorSpan = document.createElement('span')
              errorSpan.className = 'input-error-text'
              wrapper?.appendChild(errorSpan)
            }

            if (error) {
              input.classList.add('input--error')
              errorSpan.textContent = error
              isValid = false
            } else {
              input.classList.remove('input--error')
              errorSpan.textContent = ''
            }

            data[input.name] = input.value
          })

          if (!isValid) return

          try {
            await authApi.updateProfile(data)
            alert('Профиль обновлён')
            // Навигация на страницу профиля; обновление данных пользователя можно сделать при монтировании страницы
            window.router.go('/user-profile')
          } catch (err) {
            alert('Ошибка при сохранении')
            console.error(err)
          }
        }
      }
    })

    authApi.getUser().then(user => {
      this.setProps({
        ...this.props,
        user,
        display_name: user.display_name,
        avatar: new AvatarComponent({
          src: typeof user.avatar === 'string' && user.avatar
            ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
            : avatarFallback,
          width: '130px',
          height: '130px'
        })
      })
    }).catch((err) => {
      console.error('Ошибка получения пользователя:', err)
      window.router.go('/500')
    })
  }

  protected componentDidMount (): void {
    // Обработчики будут добавлены в render()
  }

  private readonly handleAvatarClick = (e: Event) => {
    e.preventDefault()
    this.setProps({ modalActive: true })
    this.updateModal()
  }

  private readonly handleAvatarSubmit = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const form = e.target as HTMLFormElement

    // Забираем значения формы типобезопасно
    const raw = new FormData(form).get('avatar') // FormDataEntryValue: string | File
    if (!(raw instanceof File)) return // нет файла — выходим

    // Готовим FormData для API
    const formData = new FormData()
    formData.append('avatar', raw) // raw — уже File

    try {
      const updatedUser = await authApi.updateAvatar(formData) as { avatar?: string | null }

      this.setProps({
        ...this.props,
        user: updatedUser,
        avatar: new AvatarComponent({
          src: updatedUser.avatar
            ? `https://ya-praktikum.tech/api/v2/resources${updatedUser.avatar}`
            : avatarFallback,
          width: '130px',
          height: '130px'
        })
      })

      this.setProps({ modalActive: false })
      this.updateModal()
    } catch (err) {
      alert('Ошибка при загрузке аватара')
      console.error(err)
    }
  }

  private readonly handleLogout = (e: Event) => {
    e.preventDefault()
    authApi.logout()
      .then(() => {
        (window as any).setAuthState?.(false)
        ;(window as any).router.go('/')
      })
      .catch(err => {
        console.error('Ошибка при выходе:', err)
      })
  }

  private updateModal () {
    const modalContainer = this.getContent()?.querySelector('#change-avatar-modal')
    if (modalContainer) {
      if (this.props.modalActive) {
        // Показываем модальное окно
        modalContainer.classList.add('modal--active')

        // Создаем содержимое модального окна
        const modalContent = modalContainer.querySelector('.modal__content')
        if (modalContent) {
          modalContent.innerHTML = `
            <button class="modal__close-button" type="button" data-close="true" aria-label="Закрыть">×</button>
            <form id="user-avatar-form">
              <p class="modal__title">Загрузите файл</p>
              <label class="avatar-modal__file-label">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  class="avatar-modal__file-input"
                  aria-label="Выбрать новый аватар"
                />
                <span class="avatar-modal__file-text">Выбрать файл на компьютере</span>
              </label>
              <button type="submit" class="avatar-modal__submit">Поменять</button>
            </form>
          `

          // Добавляем обработчики
          this.setupModalHandlers(modalContainer)
        }
      } else {
        // Скрываем модальное окно
        modalContainer.classList.remove('modal--active')
      }
    }
  }

  private setupModalHandlers (modalContainer: Element) {
    // Обработчик закрытия
    const closeButtons = modalContainer.querySelectorAll('[data-close]')
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setProps({ modalActive: false })
        this.updateModal()
      })
    })

    // Обработчик формы
    const form = modalContainer.querySelector('#user-avatar-form')
    if (form) {
      form.addEventListener('submit', (ev: Event) => { void this.handleAvatarSubmit(ev) })
    }
  }

  render (): DocumentFragment {
    const disableEdit = this.props.disableEdit
    const u = this.props.user ?? {}

    // Создаем аватар с fallback
    const avatar = this.props.avatar || new AvatarComponent({
      src: u.avatar ? `https://ya-praktikum.tech/api/v2/resources${u.avatar}` : avatarFallback,
      width: '130px',
      height: '130px'
    })

    const emailInput = new InputComponent({ name: 'email', value: u.email, variant: 'line', disabled: disableEdit })
    const loginInput = new InputComponent({ name: 'login', value: u.login, variant: 'line', disabled: disableEdit })
    const firstNameInput = new InputComponent({ name: 'first_name', value: u.first_name, variant: 'line', disabled: disableEdit })
    const secondNameInput = new InputComponent({ name: 'second_name', value: u.second_name, variant: 'line', disabled: disableEdit })
    const displayNameInput = new InputComponent({ name: 'display_name', value: u.display_name, variant: 'line', disabled: disableEdit })
    const phoneInput = new InputComponent({ name: 'phone', value: u.phone, variant: 'line', disabled: disableEdit })

    const compiled = Handlebars.compile(template)
    const html = compiled({
      ...this.props,
      avatar: avatar.getContent()?.outerHTML ?? '',
      backButton: this.props.backButton?.getContent?.()?.outerHTML ?? '',
      emailInput: emailInput.getContent()?.outerHTML ?? '',
      loginInput: loginInput.getContent()?.outerHTML ?? '',
      firstNameInput: firstNameInput.getContent()?.outerHTML ?? '',
      secondNameInput: secondNameInput.getContent()?.outerHTML ?? '',
      displayNameInput: displayNameInput.getContent()?.outerHTML ?? '',
      phoneInput: phoneInput.getContent()?.outerHTML ?? '',
      editDataButton: this.props.editDataButton?.getContent?.()?.outerHTML ?? '',
      editPasswordButton: this.props.editPasswordButton?.getContent?.()?.outerHTML ?? '',
      logoutButton: this.props.logoutButton?.getContent?.()?.outerHTML ?? '',
      submitButton: this.props.submitButton?.getContent?.()?.outerHTML ?? '',
      cancelButton: this.props.cancelButton?.getContent?.()?.outerHTML ?? '',
      modal: this.props.modal?.getContent?.()?.outerHTML ?? ''
    })

    const temp = document.createElement('template')
    temp.innerHTML = html

    const form = temp.content.querySelector<HTMLFormElement>('#user-profile-form')
    if (form && typeof this.props.events?.submit === 'function') {
      const handler = this.props.events.submit as (this: HTMLFormElement, ev: SubmitEvent) => Promise<void> | void
      form.addEventListener('submit', (ev: Event) => { void handler.call(form, ev as SubmitEvent) })
    }

    // Обработчик клика по аватару
    const avatarButton = temp.content.querySelector('#user-profile-avatar')
    if (avatarButton) {
      avatarButton.removeEventListener('click', this.handleAvatarClick)
      avatarButton.addEventListener('click', this.handleAvatarClick)
    }

    // Обработчик формы аватара
    const avatarForm = temp.content.querySelector('#user-avatar-form')
    if (avatarForm) {
      const onSubmit = (ev: Event) => { void this.handleAvatarSubmit(ev) }
      avatarForm.addEventListener('submit', onSubmit)
    }

    // Обработчик выхода
    const logoutElement = temp.content.querySelector('.logout-button')
    if (logoutElement) {
      logoutElement.removeEventListener('click', this.handleLogout as EventListener)
      logoutElement.addEventListener('click', this.handleLogout as EventListener)
    }

    return temp.content
  }
}
