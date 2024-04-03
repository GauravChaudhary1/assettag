sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.seagate.ui5.assettagpi.controller.Attachment", {
            onInit: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteAttachment").attachMatched(this._onRouteMatched, this);
                // let that = this;
                // let oPromise = this.getOwnerComponent().createComponent({
                //         usage: "attachmentReuseComponent",
                //         settings: {
                //                 mode: 'C',
                //                 objectType: 'BUS1022',
                //             }
                //         });
                // oPromise.then(function(attachmentComponent) {
                //     that.byId("attachmentComponentContainer").setComponent(attachmentComponent);
                //     that._attachmentComponent = attachmentComponent;
                //     if(that.oArgs){
                //         attachmentComponent.setObjectKey(`${that.oArgs.bukrs}${String(that.oArgs.id).padStart(10,'0')}0000`);
                //         debugger;
                //     }
                // });
               
            },
            _onRouteMatched : function (oEvent) {
                this.oArgs = oEvent.getParameter("arguments");
                // if(this.getView().byId("attachmentComponentContainer").getComponent()){
                //     this._attachmentComponent.setObjectKey(`${this.oArgs.bukrs}${String(this.oArgs.id).padStart(10,'0')}0000`);
                // }
            }
        });
    });