// 📦 Handlebars partials (шаблоны — для {{> Avatar}}, {{> Button}} и т.д.)
export { default as Avatar } from './avatar/avatar.hbs?raw'
export { default as Button } from './button/button.hbs?raw'
export { default as Input } from './input/input.hbs?raw'
export { default as ChatItem } from './chatItem/chatItemTemplate.hbs?raw'
export { default as CorrespondenceFeed } from './correspondenceFeed/correspondenceFeed.hbs?raw'
export { default as Modal } from './modal/modal.hbs?raw'

// 🧩 Логические компоненты (классы, используемые в коде)
export { AvatarComponent } from './avatar/avatar'
export { ButtonComponent } from './button/button'
export { InputComponent } from './input/input'
export { ChatItemComponent } from './chatItem/chatItem'
export { CorrespondenceFeedComponent } from './correspondenceFeed/correspondenceFeed'
export { ModalComponent } from './modal/modal'
export { CreateChatFormComponent } from './createChatForm/createChatForm'
export { UserSearchModalComponent } from './userSearchModal/userSearchModal'
export { UserListModalComponent } from './userSearchModal/userListModal'
