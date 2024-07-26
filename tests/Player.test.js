import { getShipAt } from '../src/modules/classes/Gameboard';
import { Player } from '../src/modules/classes/Player';
import { Ship, ShipManager } from '../src/modules/classes/Ship';
import { logGrid } from '../src/utility/logHelper';


describe('Player', () => {
    let player1;
    let computer;
    let shipManager;
    let carrier;
    let battleship;

    beforeAll(() => {
        shipManager = new ShipManager();
        Ship.defaultShipManager = shipManager;

        player1 = new Player(1, 'Player 1', false);
        computer = new Player(2, 'Computer', true);

        carrier = Ship.create(Ship.Types.CARRIER);
        battleship = Ship.create(Ship.Types.BATTLESHIP);

        player1.gameboard.placeShip(carrier, 'A', 1, 'horizontal');
        computer.gameboard.placeShip(battleship, 'B', 2, 'horizontal');
    });

    test('should place ships correctly on Players gameboard', () => {
        expect(player1.gameboard.getShipAt('A', 1)).toBe(carrier);
        expect(computer.gameboard.getShipAt('B', 2)).toBe(battleship);
    });

    test(`should allow attack on oponent's ship`, () => {
        const hit = player1.attack(computer, ['B', 2]);
        
        
        const opponentShip = computer.gameboard.getShipAt('B', 2);
        // computer.gameboard.markBoard(hit, ['B', 2])
        // console.log('opponentShip: ', opponentShip)
        
        logGrid(computer.gameboard.grid);
        expect(hit).toBe(true); 
        expect(opponentShip.hits).toBe(1);
    });
});
