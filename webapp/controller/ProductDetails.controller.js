sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  (
    Controller,
    Filter,
    FilterOperator,
    JSONModel,
    formatter,
    DateFormat,
    MessageToast,
    MessageBox
  ) => {
    "use strict";

    return Controller.extend("kate.vaitsiulevich.controller.ProductDetails", {
      formatter: formatter,
      /**
       * Controller's "init" lifecycle method.
       *
       * @public
       */
      onInit() {
        this.oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        const oComponent = this.getOwnerComponent();
        const oRouter = oComponent.getRouter();
        const oAppViewModel = new JSONModel({
          productComments: {},
        });

        this.getView().setModel(oAppViewModel, "appView");

        oRouter
          .getRoute("ProductDetails")
          .attachPatternMatched(this.onPatternMatched, this);
      },
      /**
       * Open Stores Overview page button press event handler.
       *
       * @public
       */
      onOpenStoresOverviewPage() {
        const oComponent = this.getOwnerComponent();
        oComponent.getRouter().navTo("StoresOverview");
      },
      /**
       * Open store page button press event handler.
       *
       * @param {sap.ui.base.Event} oEvent event object
       *
       * @public
       */
      onOpenStorePage(oEvent) {
        const oSource = oEvent.getSource();
        const oCtx = oSource.getBindingContext();
        const oComponent = this.getOwnerComponent();

        oComponent.getRouter().navTo("StoreDetails", {
          StoreID: oCtx.getObject("StoreId"),
        });
      },
      /**
       * "ProductDetails" route pattern matched event handler.
       *
       * @param {sap.ui.base.Event} oEvent event object.
       *
       * @public
       */
      onPatternMatched(oEvent) {
        const mRouteArguments = oEvent.getParameter("arguments");
        const oAppView = this.getView().getModel("appView");
        const oODataModel = this.getView().getModel();

        const sProductID = mRouteArguments.ProductID;
        const sKey = oODataModel.createKey("/Products", { id: sProductID });

        oAppView.setProperty("/ProductId", sProductID);
        this.getView().bindObject({ path: sKey });
        this._setProductComments(sProductID);
      },
      /**
       * Post comment to product.
       *
       * @param {sap.ui.base.Event} oEvent event object.
       *
       * @public
       */
      onPostComment(oEvent) {
        const oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
        const oDate = new Date();
        const sDate = oFormat.format(oDate);

        const oInputAuthor = this.byId("authorInput");
        const oInputRating = this.byId("Rating");
        const oODataModel = this.getView().getModel();

        const oCtx = oEvent.getSource().getBindingContext();
        const sProductId = oCtx.getObject("id");
        const mEntry = {
          Author: oInputAuthor.getProperty("value"),
          Message: oEvent.getParameter("value"),
          Posted: "" + sDate,
          Rating: oInputRating.getProperty("value"),
          ProductId: sProductId,
        };

        if (
          !oInputAuthor.getProperty("value") ||
          !oInputRating.getProperty("value") ||
          !oEvent.getParameter("value")
        ) {
          return MessageToast.show(
            this.oResourceBundle.getText("MessageEmptyFields")
          );
        }

        oODataModel.create("/ProductComments", mEntry, {
          success: () => {
            this._setProductComments(sProductId);
            oInputAuthor.setValue("");
            oInputRating.setValue("");
            MessageToast.show(
              this.oResourceBundle.getText("MessageCommentSuccess")
            );
          },
          error: () => {
            MessageBox.error(
              this.oResourceBundle.getText("MessageCommentError")
            );
          },
        });
      },
      /**
       * Set produt comments feed list.
       *
       * @param {string} sProductID product id.
       *
       * @private
       */
      _setProductComments(sProductID) {
        const oODataModel = this.getView().getModel();
        const oAppView = this.getView().getModel("appView");

        oODataModel.metadataLoaded().then(() => {
          const oFilter = new Filter({
            filters: [new Filter("ProductId", FilterOperator.EQ, sProductID)],
            and: true,
          });

          oODataModel.read("/ProductComments", {
            filters: [oFilter],
            success(mData) {
              oAppView.setProperty("/productComments", mData.results);
            },
            error() {
              MessageBox.error(
                this.oResourceBundle.getText("MessageReadCommentError")
              );
            },
          });
        });
      },
    });
  }
);
