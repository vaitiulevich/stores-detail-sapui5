sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/core/Messaging",
  ],
  (Controller, Filter, FilterOperator, Fragment, MessageToast, Messaging) => {
    "use strict";

    return Controller.extend("kate.vaitsiulevich.controller.StoresOverview", {
      /**
       * Controller's "init" lifecycle method.
       *
       * @public
       */
      onInit() {
        Messaging.registerObject(this.getView(), true);

        this.oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
      },
      /**
       * Open store page button press event handler.
       *
       * @param {sap.ui.base.Event} oEvent event object.
       *
       * @public
       *
       */
      onOpenStorePage(oEvent) {
        const oSource = oEvent.getSource();
        const oCtx = oSource.getBindingContext();
        const oComponent = this.getOwnerComponent();

        oComponent.getRouter().navTo("StoreDetails", {
          StoreID: oCtx.getObject("id"),
        });
      },
      /**
       * Searching store.
       *
       * @param {sap.ui.base.Event} oEvent event object.
       *
       * @public
       *
       */
      onSearchStore(oEvent) {
        let aFilters = [];
        const sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
          aFilters = new Filter({
            filters: [
              new Filter("Name", FilterOperator.Contains, sQuery),
              new Filter("Address", FilterOperator.Contains, sQuery),
            ],
            and: false,
          });
        }
        const oList = this.byId("listStores");
        const oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },
      /**
       * Open Create Store Dialog.
       *
       * @public
       */
      onOpenCreateStoreDialog() {
        const oView = this.getView();
        const oODataModel = oView.getModel();
        const oEntryCtx = oODataModel.createEntry("/Stores", {
          success: () => {
            MessageToast.show(
              this.oResourceBundle.getText("MessageCreateStoreSuccess")
            );
          },
          error: () => {
            MessageToast.error(
              this.oResourceBundle.getText("MessageCreateStoreError")
            );
          },
        });

        if (!this.oDialog) {
          Fragment.load({
            id: oView.getId(),
            name: "kate.vaitsiulevich.view.fragments.CreateStoreDialog",
            controller: this,
          }).then((oDialog) => {
            this.oDialog = oDialog;
            oView.addDependent(oDialog);
            oDialog.setBindingContext(oEntryCtx);
            oDialog.open();
          });
        } else {
          this.oDialog.setBindingContext(oEntryCtx);
          this.oDialog.open();
        }
      },
      /**
       * "Cancel" button press event handler (in the dialog).
       *
       * @public
       *
       */
      onDialogCancel() {
        const oODataModel = this.getView().getModel();
        const oCtx = this.oDialog.getBindingContext();

        oODataModel.deleteCreatedEntry(oCtx);
        this.oDialog.close();
      },
      /**
       * Dialog "Create" button press event handler.
       *
       * @public
       *
       */
      onDialogCreateStore() {
        const oODataModel = this.getView().getModel();
        const oRequiredInputs = [
          "NameInput",
          "EmailInput",
          "PhoneNumberInput",
          "EstablishedInput",
          "AddressInput",
          "FloorAreaInput",
        ];
        const passedValidation =
          this._validateEventFeedbackForm(oRequiredInputs);
        if (!passedValidation) {
          MessageToast.show(
            this.oResourceBundle.getText("MessageStoreNotCreate")
          );
          return;
        }
        oODataModel.submitChanges();
        oODataModel.refresh();
        this.oDialog.close();
      },
      /**
       * Validation inputs by id.
       *
       * @param {object} array of id requir inputs.
       *
       * @private
       *
       * @returns {boolean}
       */
      _validateEventFeedbackForm(oRequiredInputs) {
        const _self = this;
        let bIsValid = true;
        oRequiredInputs.forEach((input) => {
          const oInput = _self.getView().byId(input);
          if (oInput.getValue() == "" || oInput.getValue() == undefined) {
            bIsValid = false;
          }
        });
        return bIsValid;
      },
    });
  }
);
