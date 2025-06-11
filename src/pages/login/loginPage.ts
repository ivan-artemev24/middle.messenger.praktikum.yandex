import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { validateInput } from '../../utils/validation'
import { navigate } from '../../core/router'
import template from './login.hbs?raw'
import './login.css'

export class LoginPage extends Block {
  constructor () {
    const loginInput = new InputComponent({
      id: 'login',
      name: 'login',
      label: 'Логин',
      type: 'text',
      formId: 'login-form',
      variant: 'standard',
      customClass: 'login__input'
    })

    const passwordInput = new InputComponent({
      id: 'password',
      name: 'password',
      label: 'Пароль',
      type: 'password',
      formId: 'login-form',
      variant: 'standard'
    })

    const submitButton = new ButtonComponent({
      label: 'Авторизоваться',
      type: 'submit',
      variant: 'primary'
    })

    const linkButton = new ButtonComponent({
      label: 'Нет аккаунта?',
      type: 'button',
      variant: 'link',
      page: 'registration'
    })

    super('div', {
      loginInput,
      passwordInput,
      submitButton,
      linkButton,
      events: {
        submit: function (e: Event) {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const inputs = form.querySelectorAll('input')
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
              if (errorSpan) errorSpan.textContent = error
              isValid = false
            } else {
              input.classList.remove('input--error')
              if (errorSpan) errorSpan.textContent = ''
            }
          })

          if (!isValid) return

          const data = Object.fromEntries(new FormData(form).entries())
          console.log('Авторизация:', data)

          navigate('/chats')
        },
        focusout: function (e: Event) {
          const input = e.target as HTMLInputElement
          if (input.tagName !== 'INPUT') return

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
          } else {
            input.classList.remove('input--error')
            errorSpan.textContent = ''
          }
        }
      }
    })
  }

  render (): DocumentFragment {
    const {
      loginInput,
      passwordInput,
      submitButton,
      linkButton
    } = this.props as {
      loginInput: Block
      passwordInput: Block
      submitButton: Block
      linkButton: Block
    }

    const compiled = Handlebars.compile(template)
    const html = compiled({
      loginInput: loginInput?.getContent?.()?.outerHTML ?? '',
      passwordInput: passwordInput?.getContent?.()?.outerHTML ?? '',
      submitButton: submitButton?.getContent?.()?.outerHTML ?? '',
      linkButton: linkButton?.getContent?.()?.outerHTML ?? ''
    })

    const temp = document.createElement('template')
    temp.innerHTML = html
    return temp.content
  }
}
