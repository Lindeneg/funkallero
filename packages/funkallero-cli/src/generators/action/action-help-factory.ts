const actionHelpFactory = (type: 'Command' | 'Query') => {
    const lower = type.toLowerCase();
    const isCommand = type === 'Command';
    return `Funkallero Action ${type} Generator

Create a new mediator action in either src/application or src/application/FOLDER,
the action is automatically exported in src/application/index.ts.

$ funkallero ${lower} ...NAME [--folder FOLDER]

NAME:    Action name
FOLDER:  Optional name of folder to place action in

Examples:

$ funkallero ${lower} ${isCommand ? 'create user' : 'get user'}

$ funkallero ${lower} ${isCommand ? 'create event attendee' : 'get event attendees'} --folder event
`;
};

export default actionHelpFactory;
