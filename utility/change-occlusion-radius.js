// Requires the module "Better Roofs" - https://github.com/theripper93/Better-Roofs/

let currentRadius = canvas.scene.getFlag("betterroofs", "occlusionRadius");

new Dialog({
    title: `Set new occlusion radius`,
    content: `<form class="flexcol">
        <div class="form-group">
        <label for="setOcclusionRadius">Occlusion Radius:</label>
        <input id="setOcclusionRadius" type="text" value="${currentRadius}"></input>
    </div>
</form>`,
    buttons: {
        Ok: {
            label: `OK`,
            callback: (html) => {
                let radius = Number($('#setOcclusionRadius').val());
                canvas.scene.setFlag("betterroofs", "occlusionRadius", radius);
            }
        },
        Cancel: {
            label: `Cancel`
        }
    }
}).render(true);