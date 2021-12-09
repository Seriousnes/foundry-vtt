// best use is as an On Use Macro with the setting "After Damage Roll", either as an ItemMacro or named macro

let lastArg = args[args.length - 1];
let source = token ?? character.getActiveTokens()[0];
let targetTokens = await new Promise(async (resolve) => {
    let dialog = new Dialog({
        title: 'Adjust targets',
        content: `<p>Modify targets by clicking a button, or by manually adjusting then click done</p>
<form class="flexcol">
    <div class="form-group">
        <button type="button" id="selectEnemiesOnly">Enemies only</button>
        <button type="button" id="selectAlliesOnly">Allies only</button>
    </div>
</form>`,
        buttons: {
            done: {
                label: 'Done',
                callback: () => resolve()
            }
        }
    });

    await dialog._render(true);
    dialog.element.find('#selectEnemiesOnly').click(() => {
        dialog.close();
        resolve(CONST.TOKEN_DISPOSITIONS.FRIENDLY)
    });
    dialog.element.find('#selectAlliesOnly').click(() => {
        dialog.close();
        resolve(CONST.TOKEN_DISPOSITIONS.HOSTILE)
    });
});

if (targetTokens) {
    // if the source is an enemy, switch the target disposition to treat allies as enemies
    if (source.data.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE)
        targetTokens *= -1;
    // targetTokens is opposite what we want, so the targetting includes neutral
    let newTargets = Array.from(game.user.targets).filter(x => x.data.disposition !== targetTokens).map(x => x.document?.id ?? x.id);
    await game.user.updateTokenTargets(newTargets)
};