import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import type { Props } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { AvatarComponent } from '../../components/avatar'
import { validateInput } from '../../utils/validation'
import { authApi } from '../../api/authApi'
import template from './editPassword.hbs?raw'
import './userProfile.css'

export class EditPasswordPage extends Block {
  constructor (props?: Props) {
    const avatar = new AvatarComponent({
      src: props?.user?.avatar ?? '',
      width: '130px',
      height: '130px'
    })

    const backButton = new ButtonComponent({
      label: '←',
      type: 'button',
      variant: 'icon',
      page: 'user-profile'
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
      display_name: props?.user?.display_name ?? '',
      events: {
        submit: async function (this: HTMLFormElement, e: SubmitEvent) {
          e.preventDefault()

          const form = e.target as HTMLFormElement
          const inputs = form.querySelectorAll('input')
          const data: Record<string, string> = {}
          let isValid = true

          inputs.forEach(input => {
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

          if (data.newPassword !== data.newPasswordAgain) {
            const input = form.querySelector<HTMLInputElement>('input[name="newPasswordAgain"]')
            if (input) {
              input.classList.add('input--error')
              const wrapper = input.closest('.input-field')
              let errorSpan = wrapper?.querySelector('.input-error-text')
              if (!errorSpan) {
                errorSpan = document.createElement('span')
                errorSpan.className = 'input-error-text'
                wrapper?.appendChild(errorSpan)
              }
              if (errorSpan) errorSpan.textContent = 'Пароли не совпадают'
            }
            return
          }

          if (!isValid) return

          try {
            await authApi.changePassword({
              oldPassword: data.oldPassword,
              newPassword: data.newPassword
            })

            window.router.go('/user-profile')
          } catch (err: any) {
            alert(err.reason || 'Ошибка при смене пароля')
            console.error(err)
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
      const handler = this.props.events.submit as (this: HTMLFormElement, ev: SubmitEvent) => any
      form.addEventListener('submit', handler)
    }

    return temp.content
  }
}
