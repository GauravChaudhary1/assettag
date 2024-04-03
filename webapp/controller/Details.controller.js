sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/seagate/ui5/assettagpi/controller/handler/AssetDetails",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,AssetDetails,JSONModel) {
        "use strict";

        return Controller.extend("com.seagate.ui5.assettagpi.controller.Details", {
            onInit: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteDetails").attachMatched(this._onRouteMatched, this);
                this.getView().setModel(new JSONModel(), "details");
               
            },
            _onRouteMatched : async function (oEvent) {
                let oArgs = oEvent.getParameter("arguments");
                this.getView().setBusy(true);
                const aData = await AssetDetails.getAssetDetails(oArgs.id,this);
                this.getView().setBusy(false);
                this.getView().getModel('details').setData(aData);
            },
            onUpdateDetails: function(oEvent){
                
            },
            returnEditableFormat: function(sFieldName){
                let bEditable = false;
                switch (sFieldName) {
                    case 'CompanyCode':
                        bEditable = true;
                        break;
                
                    default:
                        bEditable = false;
                        break;
                }

                return bEditable;
            },

            returnTextLabel: function(sFieldName){
                const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                return oResourceBundle.getText(sFieldName);
            }
        });
    });