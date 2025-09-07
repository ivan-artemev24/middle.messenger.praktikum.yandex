export function validateInput (name: string, value: string): string | null {
  switch (name) {
    case 'email':
      return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value)
        ? null
        : 'Некорректный email'
    case 'login':
      return /^[a-zA-Z][a-zA-Z0-9-_]{2,19}$/.test(value)
        ? null
        : 'Логин должен быть от 3 до 20 символов, латиница, без спецсимволов кроме - и _'
    case 'first_name':
    case 'second_name':
      return /^[А-ЯA-Z][а-яa-z-]*$/.test(value)
        ? null
        : 'Имя/фамилия с заглавной буквы, без цифр и спецсимволов'
    case 'display_name':
      return value.trim()
        ? null
        : 'Имя в чате не должно быть пустым'
    case 'phone':
      return /^\+?\d{10,15}$/.test(value)
        ? null
        : 'Телефон должен содержать от 10 до 15 цифр'
    case 'password':
    case 'oldPassword':
    case 'newPassword':
    case 'newPasswordAgain':
      return /^(?=.*[A-Z])(?=.*\d).{8,40}$/.test(value)
        ? null
        : 'Пароль от 8 до 40 символов, минимум одна заглавная буква и цифра'
    default:
      return null
  }
}
