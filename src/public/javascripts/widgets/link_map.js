import StandardWidget from "./standard_widget.js";

let linkMapContainerIdCtr = 1;

const TPL = `
<div style="outline: none; overflow: hidden;">
    <div class="link-map-container"></div>
</div>
`;

class LinkMapWidget extends StandardWidget {
    getWidgetTitle() { return "Link map"; }

    getHeaderActions() {
        const $showFullButton = $("<a>").append("show full").addClass('widget-header-action');
        $showFullButton.click(async () => {
            const linkMapDialog = await import("../dialogs/link_map.js");
            linkMapDialog.showDialog();
        });

        return [$showFullButton];
    }

    async doRenderBody() {
        this.$body.html(TPL);

        const $linkMapContainer = this.$body.find('.link-map-container');
        $linkMapContainer.attr("id", "link-map-container-" + linkMapContainerIdCtr++);
        $linkMapContainer.css("height", "300px");

        const LinkMapServiceClass = (await import('../services/link_map.js')).default;

        this.linkMapService = new LinkMapServiceClass(this.ctx.note, $linkMapContainer, {
            maxDepth: 1,
            zoom: 0.8
        });

        await this.linkMapService.render();
    }

    cleanup() {
        if (this.linkMapService) {
            this.linkMapService.cleanup();
        }
    }

    syncDataReceived(syncData) {
        if (syncData.find(sd => sd.entityName === 'attributes' && sd.noteId === this.ctx.note.noteId)) {
            // no need to invalidate attributes since the Attribute class listens to this as well
            // (and is guaranteed to run first)
            if (this.linkMapService) {
                this.linkMapService.loadNotesAndRelations();
            }
        }
    }
}

export default LinkMapWidget;