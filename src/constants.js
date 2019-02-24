export const COLUMNS = [
    { name: 'playerName', title: 'Player' },
    { name: 'country', title: 'Country' },
    { name: 'amount', title: 'Winnings' },
];

export const COLUMN_ORDER = COLUMNS.map(column => column.name);

export const COUNTRIES = ['USA', 'Mexico', 'Canada'];

export const ENDPOINTS = {
    GET_PLAYERS: '/api/players',
    ADD_PLAYER: '/api/players/add',
    UPDATE_PLAYER: '/api/players/update',
    REMOVE_PLAYER: '/api/players/remove',
};

export const REQUEST_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded' };
