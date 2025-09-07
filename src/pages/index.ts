import { Error404Page } from './errors/error404Page'
import { Error500Page } from './errors/error500Page'

import { ChatsPage } from './chats'
import { EditPasswordPage, UserProfilePage } from './user'
import { LoginPage, RegistrationPage } from './login'

import arrowIcon from '../assets/arrow-icon.svg?raw'
import searchIcon from '../assets/search-icon.svg?raw'
import { chatsMockData, userMockData } from '../mockData'

// Обёртки с предзаполненными данными
export class ChatsPageWithData extends ChatsPage {
  constructor () {
    super({
      arrowIcon,
      searchIcon,
      showDialog: true,
      data: chatsMockData
    })
  }
}

export class UserProfilePageReadOnly extends UserProfilePage {
  constructor () {
    super({
      arrowIcon,
      user: userMockData,
      disableEdit: true
    })
  }
}

export class UserProfilePageEdit extends UserProfilePage {
  constructor () {
    super({
      arrowIcon,
      user: userMockData,
      disableEdit: false
    })
  }
}

export class EditPasswordPageWithContext extends EditPasswordPage {
  constructor () {
    super({
      arrowIcon,
      user: userMockData
    })
  }
}

// Основные экспорты
export {
  LoginPage,
  RegistrationPage,
  ChatsPage,
  EditPasswordPage,
  UserProfilePage,
  Error404Page,
  Error500Page
}
