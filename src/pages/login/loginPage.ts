import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { validateInput } from '../../utils/validation'
import { authApi } from '../../api/authApi'

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
      page: 'sign-up'
    })

    super('div', {
      loginInput,
      passwordInput,
      submitButton,
      linkButton,
      events: {
        submit: async (e: SubmitEvent) => {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const inputs = form.querySelectorAll('input')
          let isValid = true
          const formData: Record<string, string> = {}

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

            formData[input.name] = input.value
          })

          if (!isValid) return

          try {
            await authApi.signin({
              login: formData.login,
              password: formData.password
            })
            // Убедимся, что куки применились и сессия активна
            try { await authApi.getUser() } catch {}
            // Обновляем глобальное состояние авторизации и делаем навигацию без перезагрузки
            ;(window as any).setAuthState?.(true)
            ;(window as any).router.go('/messenger')
          } catch (err) {
            alert('Ошибка авторизации')
            console.error(err)
          }
        }
      }
    })
  }

  render (): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled({
      loginInput: this.props.loginInput?.getContent?.()?.outerHTML ?? '',
      passwordInput: this.props.passwordInput?.getContent?.()?.outerHTML ?? '',
      submitButton: this.props.submitButton?.getContent?.()?.outerHTML ?? '',
      linkButton: this.props.linkButton?.getContent?.()?.outerHTML ?? ''
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
            errorSpan.textContent = error
          } else {
            input.classList.remove('input--error')
            errorSpan.textContent = ''
          }
        })
      })
    }

    return temp.content
  }
}
