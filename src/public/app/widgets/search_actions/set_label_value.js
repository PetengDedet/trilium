import SpacedUpdate from "../../services/spaced_update.js";
import AbstractSearchAction from "./abstract_search_action.js";

const TPL = `
<tr>
    <td colspan="2">
        <div style="display: flex; align-items: center">
            <div style="margin-right: 10px;" class="text-nowrap">Set label</div> 
            
            <input type="text" 
                class="form-control label-name" 
                placeholder="label name"
                pattern="[\\p{L}\\p{N}_:]+"
                title="Alphanumeric characters, underscore and colon are allowed characters."/>
            
            <div style="margin-right: 10px; margin-left: 10px;" class="text-nowrap">to value</div>
            
            <input type="text" class="form-control label-value" placeholder="new value"/>
        </div>
    </td>
    <td class="button-column">
        <span class="bx bx-x icon-action action-conf-del"></span>
    </td>
</tr>`;

export default class SetLabelValueSearchAction extends AbstractSearchAction {
    static get actionName() { return "setLabelValue"; }

    doRender() {
        const $action = $(TPL);

        const $labelName = $action.find('.label-name');
        $labelName.val(this.actionDef.labelName || "");

        const $labelValue = $action.find('.label-value');
        $labelValue.val(this.actionDef.labelValue || "");

        const spacedUpdate = new SpacedUpdate(async () => {
            await this.saveAction({
                labelName: $labelName.val(),
                labelValue: $labelValue.val()
            });
        }, 1000)

        $labelName.on('input', () => spacedUpdate.scheduleUpdate());
        $labelValue.on('input', () => spacedUpdate.scheduleUpdate());

        return $action;
    }
}
