/*  Add to the ItemMacro of a feature called "Arcane Shot" that has a DamageBonusMacro effect to call this item macro
*   - Effect setup: flags.dnd5e.DamageBonusMacro  CUSTOM  ItemMacro.Arcane Shot
*/

let uses = item.data.data.uses;

if (args[0].item.type === 'weapon' && args[0].item.data.actionType === 'rwak' && uses.value > 0) {
    if (game.combat) {
        const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
        const lastTime = actor.getFlag("midi-qol", "arcaneShotTime");
        if (combatTime === lastTime) {
        MidiQOL.warn("Already used an Arcane Shot Option this turn");
        return {};
      }
    }
    
    // prompt to use arcane shot option
    let arcaneShotOptions = actor.items.filter(x => x.name.startsWith('Arcane Shot Option:') && x.labels.featType === 'Passive');

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
                    label: 'Cancel',
                    callback: async () => resolve(null)
                }
            }
        }).render(true);
    });
    
    if (shot) {
        if (game.combat) {
            const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
            const lastTime = actor.getFlag("midi-qol", "arcaneShotTime");
            if (combatTime !== lastTime) {
                await actor.setFlag("midi-qol", "arcaneShotTime", combatTime)
            }
        }
        shot.roll();
        await item.data.document.update({ 'data.uses.value': uses.value - 1 });
    }
}

return {};
