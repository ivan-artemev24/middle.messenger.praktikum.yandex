import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import type { Props } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { AvatarComponent } from '../../components/avatar'
import { ModalComponent } from '../../components/modal'
import { validateInput } from '../../utils/validation'
import { userMockData } from '../../mockData'
import template from './userProfile.hbs?raw'
import './userProfile.css'

class ModalContent extends Block {
  render(): DocumentFragment {
    const temp = document.createElement('template')
    temp.innerHTML = this.props.content ?? ''
    return temp.content
  }
}

export class UserProfilePage extends Block {
  constructor(props?: Props) {
    const avatar = new AvatarComponent({
      src: userMockData.avatar,
      width: '130px',
      height: '130px'
    })

    const backButton = new ButtonComponent({
      label: '←',
      type: 'button',
      variant: 'icon',
      page: 'chats'
    })

    const editDataButton = new ButtonComponent({
      label: 'Изменить данные',
      type: 'button',
      variant: 'link',
      events: {
        click: () => this.setProps({ disableEdit: false })
      }
    })

    const cancelButton = new ButtonComponent({
      label: 'Отмена',
      type: 'button',
      variant: 'link',
      events: {
        click: () => this.setProps({ disableEdit: true })
      }
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
      page: 'login'
    })

    const submitButton = new ButtonComponent({
      label: 'Сохранить',
      type: 'submit',
      variant: 'primary'
    })

    const modalForm = document.createElement('form')
    modalForm.id = 'user-avatar-form'
    modalForm.innerHTML = `
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
    `

    const modalSubmit = new ButtonComponent({
      label: 'Поменять',
      type: 'submit',
      customClass: 'avatar-modal__submit'
    })

    const submitButtonContent = modalSubmit.getContent()
    if (submitButtonContent) {
      modalForm.appendChild(submitButtonContent)
    }

    const modalBlock = new ModalContent('div', {
      content: modalForm.outerHTML
    })

    const modal = new ModalComponent({
      id: 'change-avatar-modal',
      active: false,
      content: modalBlock,
      onClose: () => this.setProps({ modalActive: false })
    })

    super('div', {
      ...props,
      avatar,
      backButton,
      editDataButton,
      editPasswordButton,
      logoutButton,
      submitButton,
      cancelButton,
      modal,
      display_name: userMockData.display_name,
      user: userMockData,
      events: {
        submit: function (this: HTMLFormElement, e: SubmitEvent) {
          e.preventDefault()

          const form = e.target as HTMLFormElement
          const inputs = form.querySelectorAll('input')
          const disabledInputs: HTMLInputElement[] = []

          let isValid = true

          inputs.forEach(input => {
            if (input.disabled) {
              disabledInputs.push(input)
              input.disabled = false
            }

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
              if (errorSpan) errorSpan.textContent = error
              isValid = false
            } else {
              input.classList.remove('input--error')
              if (errorSpan) errorSpan.textContent = ''
            }
          })

          if (!isValid) {
            disabledInputs.forEach(input => { input.disabled = true })
            return
          }

          const formData = new FormData(form)
          console.log('Сохранённые данные профиля:')
          for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${String(value)}`)
          }

          disabledInputs.forEach(input => { input.disabled = true })
          this.setProps({ disableEdit: true })
        }
      }
    })
  }

  render(): DocumentFragment {
    const disableEdit = this.props.disableEdit
    const u = this.props.user

    const emailInput = new InputComponent({ name: 'email', value: u.email, variant: 'line', disabled: disableEdit })
    const loginInput = new InputComponent({ name: 'login', value: u.login, variant: 'line', disabled: disableEdit })
    const firstNameInput = new InputComponent({ name: 'first_name', value: u.first_name, variant: 'line', disabled: disableEdit })
    const secondNameInput = new InputComponent({ name: 'second_name', value: u.second_name, variant: 'line', disabled: disableEdit })
    const displayNameInput = new InputComponent({ name: 'display_name', value: u.display_name, variant: 'line', disabled: disableEdit })
    const phoneInput = new InputComponent({ name: 'phone', value: u.phone, variant: 'line', disabled: disableEdit })

    const compiled = Handlebars.compile(template)
    const html = compiled({
      ...this.props,
      avatar: this.props.avatar?.getContent?.()?.outerHTML ?? '',
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

    const form = temp.content.querySelector('form')
    if (form && typeof this.props.events?.submit === 'function') {
      form.addEventListener('submit', this.props.events.submit as (this: HTMLFormElement, ev: SubmitEvent) => void)

      const inputs = form.querySelectorAll('input')
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
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
            if (errorSpan) errorSpan.textContent = error
          } else {
            input.classList.remove('input--error')
            if (errorSpan) errorSpan.textContent = ''
          }
        })
      })
    }

    return temp.content
  }
}
