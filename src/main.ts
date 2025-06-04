import Handlebars from "handlebars";
import * as Components from "./components";
import * as Pages from "./pages";
import "./style.css";
import "./helpers/handlebarsHelpers.js";

import arrowIcon from "./assets/arrow-icon.svg?raw";
import searchIcon from "./assets/search-icon.svg?raw";

import { chatsMockData, userMockData } from "./mockData.js";

type PageContext = Record<string, any>;
type PageEntry = [string, PageContext];

const baseUserContext = {
  arrowIcon,
  user: userMockData,
};

const pages: Record<string, PageEntry> = {
  login: [Pages.LoginPage, {}],
  registration: [Pages.RegistrationPage, {}],
  chats: [Pages.ChatsPage, {
    arrowIcon,
    searchIcon,
    showDialog: true,
    data: chatsMockData,
  }],
  "user-profile": [Pages.UserProfilePage, {
    ...baseUserContext,
    disableEdit: true,
  }],
  "edit-user-profile": [Pages.UserProfilePage, {
    ...baseUserContext,
    disableEdit: false,
  }],
  "edit-password": [Pages.EditPasswordPage, {
    ...baseUserContext,
  }],
};

Object.entries(Components).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

function navigate(page: string): void {
  const pageEntry = pages[page];
  if (!pageEntry) {
    console.warn(`Page "${page}" not found.`);
    return;
  }

  const [source, context] = pageEntry;
  const container = document.getElementById("app");
  if (!container) return;

  const render = Handlebars.compile(source);
  container.innerHTML = render(context);
}

function getCurrentPage(): string {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.length ? parts[0] : "login";
}

function handleNavigationClick(event: MouseEvent): void {
  const target = (event.target as HTMLElement)?.closest("[data-page]");
  if (!target) return;

  const page = target.getAttribute("data-page");
  if (page) {
    navigate(page);
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  navigate(getCurrentPage());
});

document.addEventListener("click", handleNavigationClick);
