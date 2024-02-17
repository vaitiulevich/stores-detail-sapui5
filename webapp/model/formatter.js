sap.ui.define([], () => {
  "use strict";

  return {
    /**
     * Formatter for status text.
     *
     * @param {string} sStatus string of status state.
     *
     * @private
     *
     */
    statusText(sStatus) {
      const oResourceBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();
      switch (sStatus) {
        case oResourceBundle.getText("StatusOk"):
          return oResourceBundle.getText("StatusSuccess");
        case oResourceBundle.getText("StatusStorage"):
          return oResourceBundle.getText("StatusWarning");
        case oResourceBundle.getText("StatuOutOfStock"):
          return oResourceBundle.getText("StatusError");
        default:
          return oResourceBundle.getText("StatusSuccess");
      }
    },
    /**
     * Formatter for the icon used in a sort trigger button.
     *
     * @param {string} sSortType sorting type.
     *
     * @returns {string} icon name.
     */
    sortTypeFormatter(sSortType, sSortName, sSortTitle) {
      const oResourceBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();
      if (sSortName !== sSortTitle) {
        return "sort";
      }

      switch (sSortType) {
        case oResourceBundle.getText("SORT_NONE"): {
          return "sort";
        }
        case oResourceBundle.getText("SORT_ASC"): {
          return "sort-ascending";
        }
        case oResourceBundle.getText("SORT_DESC"): {
          return "sort-descending";
        }
        default: {
          return "sort";
        }
      }
    },
  };
});
