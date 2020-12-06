import {Field, Root, Type} from 'protobufjs';

const root = new Root();

const GameObject = new Type('GameObject')
  .add(new Field('x', 1, 'float'))
  .add(new Field('y', 2, 'float'))
  .add(new Field('radius', 3, 'float'))
  .add(new Field('name', 4, 'string'))
  .add(new Field('color', 5, 'int32'))

root.add(GameObject);

const Data = new Type('Data')
  .add(new Field('currentPlayer', 1, 'GameObject'))
  .add(new Field('objects', 2, 'GameObject', 'repeated'))

root.add(Data)

const UpdateMessage = new Type('UpdateMessage')
  .add(new Field('type', 1, 'int32'))
  .add(new Field('data', 2, 'Data'))

root.add(UpdateMessage);

const DirectionData = new Type('DirectionData')
    .add(new Field('direction', 1, 'float'));

root.add(DirectionData);

const UpdateDirectionMessage = new Type('UpdateDirectionMessage')
    .add(new Field('type', 1, 'int32'))
    .add(new Field('data', 2, 'DirectionData'));

root.add(UpdateDirectionMessage);

export {
  UpdateMessage,
  UpdateDirectionMessage
}
