import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import { InputComponent } from '../../components/input'
import { ButtonComponent } from '../../components/button'
import { validateInput } from '../../utils/validation'
import template from './registration.hbs?raw'
import './login.css'

export class RegistrationPage extends Block {
  constructor () {
    const emailInput = new InputComponent({
      id: 'email',
      name: 'email',
      label: 'Почта',
      type: 'text',
      formId: 'registration',
      variant: 'standard'
    })

    const loginInput = new InputComponent({
      id: 'login',
      name: 'login',
      label: 'Логин',
      type: 'text',
      formId: 'registration',
      variant: 'standard'
    })

    const firstNameInput = new InputComponent({
      id: 'first_name',
      name: 'first_name',
      label: 'Имя',
      type: 'text',
      formId: 'registration',
      variant: 'standard'
    })

    const secondNameInput = new InputComponent({
      id: 'second_name',
      name: 'second_name',
      label: 'Фамилия',
      type: 'text',
      formId: 'registration',
      variant: 'standard'
    })

    const phoneInput = new InputComponent({
      id: 'phone',
      name: 'phone',
      label: 'Телефон',
      type: 'text',
      formId: 'registration',
      variant: 'standard'
    })

    const passwordInput = new InputComponent({
      id: 'password',
      name: 'password',
      label: 'Пароль',
      type: 'password',
      formId: 'registration',
      variant: 'standard'
    })

    const againPasswordInput = new InputComponent({
      id: 'again-password',
      name: 'again-password',
      label: 'Повторите пароль',
      type: 'password',
      formId: 'registration',
      variant: 'standard'
    })

    const submitButton = new ButtonComponent({
      label: 'Зарегистрироваться',
      type: 'submit',
      variant: 'primary'
    })

    const linkButton = new ButtonComponent({
      label: 'Войти',
      type: 'button',
      variant: 'link',
      page: 'login'
    })

    super('div', {
      emailInput,
      loginInput,
      firstNameInput,
      secondNameInput,
      phoneInput,
      passwordInput,
      againPasswordInput,
      submitButton,
      linkButton,
      events: {
        submit: (e: SubmitEvent) => {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const inputs = form.querySelectorAll('input')
          let isValid = true
          let password = ''
          let again = ''

          inputs.forEach(input => {
            const error = validateInput(input.name, input.value)

            if (input.name === 'password') password = input.value
            if (input.name === 'again-password') again = input.value

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

          if (password && again && password !== again) {
            const againInput = form.querySelector<HTMLInputElement>('input[name="again-password"]')
            if (againInput) {
              const wrapper = againInput.closest('.input-field')
              let errorSpan = wrapper?.querySelector('.input-error-text') as HTMLElement | null
              if (!errorSpan) {
                errorSpan = document.createElement('span')
                errorSpan.className = 'input-error-text'
                wrapper?.appendChild(errorSpan)
              }

              againInput.classList.add('input--error')
              if (errorSpan) errorSpan.textContent = 'Пароли не совпадают'
              isValid = false
            }
          }

          if (!isValid) return

          const formData = new FormData(form)
          console.log('Регистрация:')
          for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${String(value)}`)
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
