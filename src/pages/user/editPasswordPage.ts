import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import type { Props } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { AvatarComponent } from '../../components/avatar'
import { validateInput } from '../../utils/validation'
import template from './editPassword.hbs?raw'
import './userProfile.css'

export class EditPasswordPage extends Block {
  constructor (props?: Props) {
    const avatar = new AvatarComponent({
      src: '/assets/avatar.jpg',
      width: '130px',
      height: '130px'
    })

    const backButton = new ButtonComponent({
      label: '←',
      type: 'button',
      variant: 'icon',
      page: 'chats'
    })

    const submitButton = new ButtonComponent({
      label: 'Сохранить',
      type: 'submit',
      variant: 'primary'
    })

    super('div', {
      ...props,
      avatar,
      backButton,
      submitButton,
      display_name: 'ИванА',
      events: {
        submit: function (this: HTMLFormElement, e: SubmitEvent) {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const inputs = form.querySelectorAll('input')
          let isValid = true
          let newPassword = ''
          let newPasswordAgain = ''

          inputs.forEach(input => {
            const error = validateInput(input.name, input.value)

            if (input.name === 'newPassword') newPassword = input.value
            if (input.name === 'newPasswordAgain') newPasswordAgain = input.value

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

          if (newPassword && newPasswordAgain && newPassword !== newPasswordAgain) {
            const newAgainInput = form.querySelector<HTMLInputElement>('input[name="newPasswordAgain"]')
            if (newAgainInput) {
              const wrapper = newAgainInput.closest('.input-field')
              let errorSpan = wrapper?.querySelector('.input-error-text') as HTMLElement | null

              if (!errorSpan) {
                errorSpan = document.createElement('span')
                errorSpan.className = 'input-error-text'
                wrapper?.appendChild(errorSpan)
              }

              newAgainInput.classList.add('input--error')
              if (errorSpan) errorSpan.textContent = 'Пароли не совпадают'
              isValid = false
            }
          }

          if (!isValid) return

          const formData = new FormData(form)
          console.log('Смена пароля:')
          for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${String(value)}`)
          }
        }
      }
    })
  }

  render (): DocumentFragment {
    const oldPasswordInput = new InputComponent({
      name: 'oldPassword',
      type: 'password',
      value: '',
      formId: 'user-profile-form',
      variant: 'line'
    })

    const newPasswordInput = new InputComponent({
      name: 'newPassword',
      type: 'password',
      value: '',
      formId: 'user-profile-form',
      variant: 'line'
    })

    const newPasswordAgainInput = new InputComponent({
      name: 'newPasswordAgain',
      type: 'password',
      value: '',
      formId: 'user-profile-form',
      variant: 'line'
    })

    const compiled = Handlebars.compile(template)
    const html = compiled({
      ...this.props,
      avatar: this.props.avatar?.getContent?.()?.outerHTML ?? '',
      backButton: this.props.backButton?.getContent?.()?.outerHTML ?? '',
      oldPasswordInput: oldPasswordInput.getContent()?.outerHTML ?? '',
      newPasswordInput: newPasswordInput.getContent()?.outerHTML ?? '',
      newPasswordAgainInput: newPasswordAgainInput.getContent()?.outerHTML ?? '',
      submitButton: this.props.submitButton?.getContent?.()?.outerHTML ?? ''
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
