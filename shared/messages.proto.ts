import {Field, Root, Type} from 'protobufjs';

const root = new Root();

const GameObject = new Type('GameObject')
  .add(new Field('x', 1, 'float'))
  .add(new Field('y', 2, 'float'))
  .add(new Field('radius', 3, 'float'))
  .add(new Field('name', 4, 'string'))
  .add(new Field('color', 5, 'string'))

root.add(GameObject);

const Data = new Type('Data')
  .add(new Field('currentPlayer', 1, 'GameObject'))
  .add(new Field('objects', 2, 'GameObject', 'repeated'))

root.add(Data)

const UpdateMessage = new Type('UpdateMessage')
  .add(new Field('type', 1, 'string'))
  .add(new Field('data', 2, 'Data'))

root.add(UpdateMessage);

export {
  UpdateMessage
}
