import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { validateInput } from '../../utils/validation'
import { authApi } from '../../api/authApi'

import template from './registration.hbs?raw'
import './login.css'

export class RegistrationPage extends Block {
  constructor () {
    const inputs = {
      emailInput: new InputComponent({
        id: 'email',
        name: 'email',
        label: 'Почта',
        type: 'text',
        formId: 'registration',
        variant: 'standard'
      }),
      loginInput: new InputComponent({
        id: 'login',
        name: 'login',
        label: 'Логин',
        type: 'text',
        formId: 'registration',
        variant: 'standard'
      }),
      firstNameInput: new InputComponent({
        id: 'first_name',
        name: 'first_name',
        label: 'Имя',
        type: 'text',
        formId: 'registration',
        variant: 'standard'
      }),
      secondNameInput: new InputComponent({
        id: 'second_name',
        name: 'second_name',
        label: 'Фамилия',
        type: 'text',
        formId: 'registration',
        variant: 'standard'
      }),
      phoneInput: new InputComponent({
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        type: 'text',
        formId: 'registration',
        variant: 'standard'
      }),
      passwordInput: new InputComponent({
        id: 'password',
        name: 'password',
        label: 'Пароль',
        type: 'password',
        formId: 'registration',
        variant: 'standard'
      }),
      againPasswordInput: new InputComponent({
        id: 'again_password',
        name: 'again_password',
        label: 'Повторите пароль',
        type: 'password',
        formId: 'registration',
        variant: 'standard'
      })
    }

    const submitButton = new ButtonComponent({
      label: 'Зарегистрироваться',
      type: 'submit',
      variant: 'primary'
    })

    const linkButton = new ButtonComponent({
      label: 'Войти',
      type: 'button',
      variant: 'link',
      page: '/'
    })

    super('div', {
      ...inputs,
      submitButton,
      linkButton,
      events: {
        submit: async (e: SubmitEvent) => {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const formDataObj: Record<string, string> = {}
          let isValid = true

          const inputs = form.querySelectorAll('input')
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

            formDataObj[input.name] = input.value
          })

          // Проверка совпадения паролей
          if (formDataObj.password !== formDataObj.again_password) {
            const againInput = form.querySelector<HTMLInputElement>('input[name="again_password"]')
            const wrapper = againInput?.closest('.input-field')
            let errorSpan = wrapper?.querySelector('.input-error-text') as HTMLElement | null

            if (!errorSpan && wrapper) {
              errorSpan = document.createElement('span')
              errorSpan.className = 'input-error-text'
              wrapper.appendChild(errorSpan)
            }

            againInput?.classList.add('input--error')
            if (errorSpan) errorSpan.textContent = 'Пароли не совпадают'
            isValid = false
          }

          if (!isValid) return

          try {
            console.log('Форма:', formDataObj)
            await authApi.signup({
              first_name: formDataObj.first_name,
              second_name: formDataObj.second_name,
              login: formDataObj.login,
              email: formDataObj.email,
              password: formDataObj.password,
              phone: formDataObj.phone
            })

            window.router.go('/messenger')
          } catch (err: any) {
            alert(err.reason || 'Ошибка регистрации')
            console.error(err)
          }
        }
      }
    })
  }

  render (): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled({
      emailInput: this.props.emailInput?.getContent?.()?.outerHTML ?? '',
      loginInput: this.props.loginInput?.getContent?.()?.outerHTML ?? '',
      firstNameInput: this.props.firstNameInput?.getContent?.()?.outerHTML ?? '',
      secondNameInput: this.props.secondNameInput?.getContent?.()?.outerHTML ?? '',
      phoneInput: this.props.phoneInput?.getContent?.()?.outerHTML ?? '',
      passwordInput: this.props.passwordInput?.getContent?.()?.outerHTML ?? '',
      againPasswordInput: this.props.againPasswordInput?.getContent?.()?.outerHTML ?? '',
      submitButton: this.props.submitButton?.getContent?.()?.outerHTML ?? '',
      linkButton: this.props.linkButton?.getContent?.()?.outerHTML ?? ''
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
