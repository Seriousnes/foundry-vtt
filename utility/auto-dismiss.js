// There are two parts for this to work:
//      - 1st: Summon a token at the targetted position (in this case underneath the target's token) and set up an ActiveEffect with a specified duration to call a macro
//      - 2nd: The "Limited Duration" macro will dismiss the token
//  Example use: Flaming Sphere to disappear automatically after it's duration

let tokenName = '';
let duration = {
    "seconds" : 6,
    //"rounds" : 1,
    //"turns" : 4
};

let targetD = args[0].targets[0];
let actorD = targetD.actor;
let spawnLocation = {
    x: td.data.x + (canvas.grid.size * td.data.width / 2),
    y: td.data.y + (canvas.grid.size * td.data.height / 2)
};

let updateData = {
    embedded: {
        ActiveEffect: {
            data: {
                "changes": [{
                    "key": "macro.execute",
                    "mode": 0,
                    "value": '"Limited Duration" @token',
                    "priority": "20"
                }],
                "disabled": false,
                "duration": duration,
                "icon": "icons/svg/clockwork.svg",
                "label": "Limited Duration",
            }
        }
    }
};

await warpgate.spawnAt(spawnLocation, tokenName, updateData);


// Create a macro called "Limited Duration" with the following code:

if (args[0] === "off") {
    let tokenD = canvas.tokens.get(args[1]);
    warpgate.dismiss(tokenD.id);
}