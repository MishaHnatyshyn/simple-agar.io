import WsServer from './wsServer';

const server = new WsServer();
server.addConnectionHandler(() => {}, () => {});
