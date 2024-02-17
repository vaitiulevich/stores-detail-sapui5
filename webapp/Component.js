sap.ui.define(["sap/ui/core/UIComponent"], (UIComponent) => {
  "use strict";

  return UIComponent.extend("kate.vaitsiulevich.Component", {
    metadata: {
      manifest: "json",
    },

    /**
     * Controller's "init" lifecycle method.
     *
     * @public
     */
    init() {
      UIComponent.prototype.init.apply(this, arguments);

      this.getRouter().initialize();
    },
  });
});
