import camera from './assets/camera.jpg?url'
import avatarImg from './assets/avatar.jpg?url'

const defaultAvatar = avatarImg

const selectedChat = {
  id: 4,
  name: 'Вадим',
  avatar: defaultAvatar
}

const chats = [
  {
    id: 1,
    name: 'Андрей',
    avatar: defaultAvatar,
    lastMessage: 'Изображение',
    lastMessageTime: '12:53',
    unreadCount: 14
  },
  {
    id: 2,
    name: 'Киноклуб',
    avatar: defaultAvatar,
    lastMessage: 'Вы: стикер',
    lastMessageTime: '12:30'
  },
  {
    id: 3,
    name: 'Илья',
    avatar: defaultAvatar,
    lastMessage: 'Друзья, у меня для вас...',
    lastMessageTime: '12:11',
    unreadCount: 3
  },
  {
    id: 4,
    name: 'Вадим',
    avatar: defaultAvatar,
    lastMessage: 'Вы: Круто!',
    lastMessageTime: '11:51'
  },
  {
    id: 5,
    name: 'тет-а-теты',
    avatar: defaultAvatar,
    lastMessage: 'И Human Interface Guidelines...',
    lastMessageTime: '11:05'
  },
  {
    id: 6,
    name: '1, 2, 3',
    avatar: defaultAvatar,
    lastMessage: 'Миллионы россиян ежедневно...',
    lastMessageTime: '09:00'
  },
  {
    id: 7,
    name: 'Design Destroyer',
    avatar: defaultAvatar,
    lastMessage: 'В 2008 году художник...',
    lastMessageTime: '08:38'
  },
  {
    id: 8,
    name: 'Day.',
    avatar: defaultAvatar,
    lastMessage: 'Так увлёкся работой...',
    lastMessageTime: '07:59'
  },
  {
    id: 9,
    name: 'Петр Второй',
    avatar: defaultAvatar,
    lastMessage: 'Можно или сегодня...',
    lastMessageTime: '00:53'
  },
  {
    id: 10,
    name: 'Project X',
    avatar: defaultAvatar,
    lastMessage: 'Детали позже',
    lastMessageTime: '00:21'
  }
]

const messages = [
  {
    text: 'Привет! Смотри, тут всплыл интересный кусок лунной истории...',
    time: '11:56',
    isOwn: false
  },
  {
    image: camera,
    time: '11:56',
    isOwn: false
  },
  {
    text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
    time: '11:57',
    isOwn: false
  },
  {
    text: 'Круто!',
    time: '12:00',
    isOwn: true,
    read: true
  }
]

export const emptyChatsMockData = {
  chats: chats.map(chat => ({ ...chat, selected: false })),
  selectedChat: null,
  messages: []
}

export const chatsMockData = {
  chats: chats.map(chat => ({ ...chat, selected: chat.id === selectedChat.id })),
  selectedChat,
  messages
}

export const userMockData = {
  display_name: 'Иван Артемьев',
  email: 'topotuna111@gmail.com',
  login: 'topotuna123',
  first_name: 'Иван',
  second_name: 'Артемьев',
  phone: '+79232871312',
  avatar: defaultAvatar
}
