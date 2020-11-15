import './main.scss'
import Field from "./field";
import WebsocketService from "./websocket.service";
import Input from "./input";

export const inputService = new Input();
export const websocketService = new WebsocketService();
export const field = new Field(inputService, websocketService);

document.addEventListener('DOMContentLoaded', field.handleField.bind(field));