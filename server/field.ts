import Player from '../shared/player';

export default class Field {
  private players: Player[] = [];

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  removePlayer(id: string): void {
    this.players = this.players.filter((player) => player.id !== id);
  }

  getAllPlayers(): Player[] {
    return this.players;
  }

  updatePlayerPosition(id: string, x: number, y: number): void {
    this.players.find(player => player.id === id)?.updatePosition(x, y);
  }

  clearField(): void {
    this.players = [];
  }
}
