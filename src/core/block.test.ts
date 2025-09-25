import { Block, type Props } from './Block'

class TestBlock extends Block {
  constructor (props: Props = {}, tagName = 'div') {
    super(tagName, props)
  }

  protected override render (): DocumentFragment {
    const fragment = document.createDocumentFragment()
    const wrapper = document.createElement('div')
    const text = this.props?.text ?? ''
    wrapper.className = 'content'
    wrapper.textContent = String(text)
    fragment.appendChild(wrapper)
    return fragment
  }

  // Helper removed; compile() is used within subclass render where it's allowed
}

class ChildBlock extends Block {
  public mounted = false

  protected override componentDidMount (): void {
    this.mounted = true
  }

  protected override render (): DocumentFragment {
    const tpl = document.createElement('template')
    tpl.innerHTML = '<span class="child">child</span>'
    return tpl.content
  }
}

describe('Block', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('initializes with root element and renders immediately', () => {
    const block = new TestBlock({ text: 'hello' })
    const el = block.getContent()
    expect(el).not.toBeNull()
    expect(el?.querySelector('.content')?.textContent).toBe('hello')
  })

  test('setProps() triggers componentDidUpdate and re-render', () => {
    const block = new TestBlock({ text: 'a' })
    const spy = jest.spyOn(block as any, 'componentDidUpdate')
    block.setProps({ text: 'b' })
    expect(spy).toHaveBeenCalled()
    expect(block.getContent()?.querySelector('.content')?.textContent).toBe('b')
  })

  test('show() and hide() toggle hidden class', () => {
    const block = new TestBlock({ text: 'x' })
    const root = block.getContent()
    expect(root).not.toBeNull()
    if (!(root instanceof HTMLElement)) {
      throw new Error('root is not an HTMLElement')
    }
    expect(root.classList.contains('hidden')).toBe(false)
    block.hide()
    expect(root.classList.contains('hidden')).toBe(true)
    block.show()
    expect(root.classList.contains('hidden')).toBe(false)
  })

  test('attaches events from props to root and rebinds on re-render', () => {
    const onClick = jest.fn()
    const block = new TestBlock({ text: 'click', events: { click: onClick } })
    const root = block.getContent()
    expect(root).not.toBeNull()
    if (!(root instanceof HTMLElement)) {
      throw new Error('root is not an HTMLElement')
    }
    root.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onClick).toHaveBeenCalledTimes(1)

    // After re-render listeners should still work (rebinding occurs internally)
    block.setProps({ text: 'clicked' })
    root.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  test('compile() replaces placeholders with child components and mounts them', () => {
    // Parent that uses compile() in its render
    class Parent extends Block {
      public child: ChildBlock
      constructor () {
        const child = new ChildBlock()
        super('div', { child })
        this.child = child
      }

      protected override render (): DocumentFragment {
        const template = '<div class="parent">{{{child}}}</div>'
        return this.compile(template, this.props)
      }
    }

    const parent = new Parent()
    const root = parent.getContent()
    expect(root).not.toBeNull()
    if (!(root instanceof HTMLElement)) {
      throw new Error('root is not an HTMLElement')
    }
    expect(root.querySelector('.parent')).not.toBeNull()
    expect(root.querySelector('.child')).not.toBeNull()
    expect(parent.child.mounted).toBe(true)
  })
})
