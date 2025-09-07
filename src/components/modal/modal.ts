// import { Block } from '../../core/Block'
// import template from './modal.hbs?raw'
// import './modal.css'
// import Handlebars from 'handlebars'
//
// interface ModalProps {
//   id?: string
//   active?: boolean
//   content?: Block // делаем опциональным
//   onClose?: () => void
// }
//
// export class ModalComponent extends Block {
//   private readonly contentBlock?: Block
//
//   constructor({ content, ...rest }: ModalProps) {
//     super('div', {
//       ...rest,
//       content: '' // placeholder
//     })
//
//     this.contentBlock = content
//   }
//
//   render(): DocumentFragment {
//     const compiled = Handlebars.compile(template)
//     const html = compiled(this.props)
//
//     const temp = document.createElement('template')
//     temp.innerHTML = html
//
//     const fragment = temp.content
//
//     // вставка компонента (если есть)
//     if (this.contentBlock) {
//       const modalContent = fragment.querySelector('.modal__content')
//       const contentEl = this.contentBlock.getContent()
//
//       if (modalContent && contentEl) {
//         modalContent.appendChild(contentEl)
//         this.contentBlock.dispatchComponentDidMount?.()
//       }
//     }
//
//     // обработка закрытия
//     fragment.querySelectorAll('[data-close]').forEach(el => {
//       el.addEventListener('click', () => {
//         console.log('[Modal] Закрытие модалки')
//         this.props.onClose?.()
//       })
//     })
//
//     return fragment
//   }
// }
// src/components/modal/modal.ts
import Handlebars from 'handlebars'
import { Block } from '../../core/Block'
import template from './modal.hbs?raw'
import './modal.css'

interface ModalProps {
  id?: string
  active?: boolean
  content?: Block
  onClose?: () => void
}

export class ModalComponent extends Block {
  private readonly innerContent?: Block

  constructor (props: ModalProps) {
    const { content, ...rest } = props
    super('div', { ...rest })
    this.innerContent = content
  }

  render (): DocumentFragment {
    const compiled = Handlebars.compile(template)
    const html = compiled({ ...this.props })

    const temp = document.createElement('template')
    temp.innerHTML = html

    // Вставка контента, если он есть
    const contentRoot = temp.content.querySelector('#modal-content-root')
    const inner = this.innerContent?.getContent()
    if (contentRoot && inner) {
      contentRoot.appendChild(inner)
    }

    // Обработчики закрытия
    temp.content.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', () => {
        this.props.onClose?.()
      })
    })

    return temp.content
  }
}
