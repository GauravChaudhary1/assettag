sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "com/seagate/ui5/assettagpi/controller/handler/AssetDetails",
    "com/seagate/ui5/assettagpi/controller/handler/Session",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast,AssetDetails,Session,JSONModel) {
        "use strict";

        return Controller.extend("com.seagate.ui5.assettagpi.controller.ReportIssue", {
            onInit: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteDetails").attachMatched(this._onRouteMatched, this);
               
            },
            _onRouteMatched : function (oEvent) {
                let oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();
            },
    		onAfterRendering: function(oEvent){
                if(!this._eventBound){
                    this._eventBound = true;
                    document
                    .getElementById("cameraFileInput")
                    .addEventListener("change", this.onAfterClickPicture );
                }
            },

            onAfterClickPicture: function(oEvent){
                const oFile = this.files[0];
            },

            onSaveReportedIssue: function(){
                MessageToast.show("Issue Workflow is triggered.")
            }
        });
    });