import camera from "./assets/camera.jpg";

const selectedChat = {
  id: 4,
  name: "Вадим",
  avatar: ""
};

const chats = [
  { id: 1, name: "Андрей", avatar: "", lastMessage: "Изображение", lastMessageTime: "12:53", unreadCount: 14 },
  { id: 2, name: "Киноклуб", avatar: "", lastMessage: "Вы: стикер", lastMessageTime: "12:30" },
  { id: 3, name: "Илья", avatar: "", lastMessage: "Друзья, у меня для вас...", lastMessageTime: "12:11", unreadCount: 3 },
  { id: 4, name: "Вадим", avatar: "", lastMessage: "Вы: Круто!", lastMessageTime: "11:51" },
  { id: 5, name: "тет-а-теты", avatar: "", lastMessage: "И Human Interface Guidelines...", lastMessageTime: "11:05" },
  { id: 6, name: "1, 2, 3", avatar: "", lastMessage: "Миллионы россиян ежедневно...", lastMessageTime: "09:00" },
  { id: 7, name: "Design Destroyer", avatar: "", lastMessage: "В 2008 году художник...", lastMessageTime: "08:38" },
  { id: 8, name: "Day.", avatar: "", lastMessage: "Так увлёкся работой...", lastMessageTime: "07:59" },
  { id: 9, name: "Петр Второй", avatar: "", lastMessage: "Можно или сегодня...", lastMessageTime: "00:53" },
  { id: 10, name: "Project X", avatar: "", lastMessage: "Детали позже", lastMessageTime: "00:21" }
];

const messages = [
  {
    text: "Привет! Смотри, тут всплыл интересный кусок лунной истории...",
    time: "11:56",
    isOwn: false
  },
  {
    image: camera,
    time: "11:56",
    isOwn: false
  },
  {
    text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
    time: "11:57",
    isOwn: false
  },
  {
    text: "Круто!",
    time: "12:00",
    isOwn: true,
    read: true
  }

];

export const emptyChatsMockData = {
  chats: chats.map((chat) => ({ ...chat, selected: false })),
  selectedChat: null,
  messages: []
};

export const chatsMockData = {
  chats: chats.map((chat) => ({ ...chat, selected: chat.id === selectedChat.id })),
  selectedChat,
  messages
};

export const userMockData = {
  display_name: "Иван Артемьев",
  email: "topotuna111@gmail.com",
  login: "topotuna123",
  first_name: "Иван",
  second_name: "Артемьев",
  phone: "+79232871312"
};
