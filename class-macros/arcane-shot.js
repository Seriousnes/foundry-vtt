/*  Add to the ItemMacro of a feature called "Arcane Shot" that has a DamageBonusMacro effect to call this item macro
*   - Effect setup: flags.dnd5e.DamageBonusMacro  CUSTOM  ItemMacro.Arcane Shot
*/

let uses = item.data.data.uses;

// if the damage is from a weapon that makes a rwak and Arcane Shot has 1 or more uses remaining
if (args[0].item.type === 'weapon' && args[0].item.data.actionType === 'rwak' && uses.value > 0) {
    // if in combat, check it hasn't already been used this turn
    if (game.combat) {
        const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
        const lastTime = actor.getFlag("midi-qol", "arcaneShotTime");
        if (combatTime === lastTime) {
        MidiQOL.warn("Already used an Arcane Shot Option this turn");
        return {};
      }
    }
    
    // requires each feature to have the prefix "Arcane Shot Option: " and be a passive ability. (Note: the feature needs to have the target options filled (i.e. 1 creature, 5-foot radius, etc) before changing to passive so .roll() works further down)
    let arcaneShotOptions = actor.items.filter(x => x.name.startsWith('Arcane Shot Option:') && x.labels.featType === 'Passive');

    // prompt player to pick an option
    let shot = await new Promise((resolve) => {
        let options = arcaneShotOptions.map((shotOption, index) => `<li style="display: flex; justify-content: left; align-items: center; padding: 2px 0;">
    <input type="radio" id="arcane-shot-option-${index}" name="arcane-shot-option" value="${index}" />
    <div style="display: flex; justify-content: left; align-items: center;">
        <img style="height: 30px; width: 30px; margin: 0 5px 0 10px; border: none; border-radius: 0" src="${shotOption.img}"></img> ${shotOption.name.slice(20)}
    </div>
</li>`).join('');
        let content = `<p><h4>Select an arcane shot option to use (${uses.value} of ${uses.max} remaining):</h4></p>
<ol>${options}</ol>`; 
        new Dialog({
            content,
            buttons: {
                Ok: {
                    label: 'Ok',
                    callback: async (html) => {
                        let index = Number(html.find('[name="arcane-shot-option"]:checked').val());
                        resolve(arcaneShotOptions[index]);
                    }
                },
                Cancel: {
                    label: 'Cancel'
                }
            }
        }).render(true);
    });
    
    // if they picked an option, set last used time and roll the shot
    if (shot) {
        if (game.combat) {
            const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
            const lastTime = actor.getFlag("midi-qol", "arcaneShotTime");
            if (combatTime !== lastTime) {
                await actor.setFlag("midi-qol", "arcaneShotTime", combatTime)
            }
        }
        shot.roll();

        // decrease available uses
        await item.data.document.update({ 'data.uses.value': uses.value - 1 });
    }
}

return {};