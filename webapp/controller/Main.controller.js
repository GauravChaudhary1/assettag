sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/XMLTemplateProcessor",
	"sap/ui/core/util/XMLPreprocessor",
	"sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "com/seagate/ui5/assettagpi/controller/handler/AssetDetails",
    "com/seagate/ui5/assettagpi/controller/handler/Session",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, XMLTemplateProcessor, XMLPreprocessor, Fragment,MessageToast,AssetDetails,Session,JSONModel,MessageBox) {
        "use strict";

        return Controller.extend("com.seagate.ui5.assettagpi.controller.Main", {
            onInit: function () {
                this.getView().setModel(new JSONModel(), "result");
                this.getView().setModel(new JSONModel(), "ScannedAssets");
                                
            },
            getAssetDetails: function(oEvent){
                if(oEvent.getParameter("value") == ""){
                    sap.m.MessageToast.show('Scan or Enter Asset Tag.')
                    return;
                };
                AssetDetails.getAssetScanDetails(oEvent.getParameter("value"),this).then((aData) =>{
                    this.getView().getModel('ScannedAssets').setData(aData);
                });
            },
            onScanSuccess: function(oEvent){
                if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled", { duration:1000 });
				} else {
					if (oEvent.getParameter("text") !== undefined && oEvent.getParameter("text") !== null) {
						AssetDetails.getAssetScanDetails(oEvent.getParameter("text"),this).then((aData) =>{
                            this.getView().getModel('ScannedAssets').setData(aData);
                        });        
					} else {
						
					}
				}
            },

            onUploadScanRecords: function(){

            },

            onAfterRendering: function() {
                if (!this.bFirstTime) {
                    this.getOwnerComponent().getModel().metadataLoaded().then(function() {
                        Session.start.call(this);
                        var oDataModel = this.getOwnerComponent().getModel();
                        var oView = this.getView();
                        var oMetaModel = oDataModel.getMetaModel();
                        var oDeviceModel = this.getView().getModel('device');
                        var oFragment = XMLTemplateProcessor.loadTemplate("com.seagate.ui5.assettagpi.template.scan", "fragment");
                        oMetaModel.loaded().then(function() {
                            var oProcessedFragment = XMLPreprocessor.process(oFragment, {
                                caller: "XML-Fragment-templating"
                            }, {
                                bindingContexts: {
                                    meta: oMetaModel.getMetaContext("/AssetTagSet")
                                },
                                models: {
                                    meta: oMetaModel,
                                    device: oDeviceModel
                                }
                            });
                            oFragment = sap.ui.xmlfragment({
                                fragmentContent: oProcessedFragment
                            }, this);
                            oView.getAggregation("content")[0].addContent(oFragment);
                            this.bFirstTime = true;
                        }.bind(this));
                    }.bind(this));
                }
            },
            onPressDetails: function(oEvent){
                let id = "", bukrs="";
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if( oEvent.getSource().getBindingContext() && oEvent.getSource().getBindingContext().getObject()){
                    id = oEvent.getSource().getBindingContext().getObject()["AssetTag"];
                    bukrs = oEvent.getSource().getBindingContext().getObject()["CompanyCode"];
                }else{
                    id = oEvent.getSource().getParent().getSender();
                    bukrs = oEvent.getSource().getParent().getCustomData()[0].getValue();
                }
                oRouter.navTo("RouteDetails",{
                    id : id, 
                    bukrs : bukrs,
                });
            },
            onPressAttachment: function(oEvent){
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteAttachment",{
                    id : oEvent.getSource().getParent().getCustomData()[1].getValue(),
                    bukrs : oEvent.getSource().getParent().getCustomData()[0].getValue(),
                    mode : 'display'
                });
            },
            onPressReportIssue: function(oEvent){
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteReportIssue",{
                    id : oEvent.getSource().getParent().getSender(),
                    bukrs : oEvent.getSource().getParent().getCustomData()[0].getValue()
                });
            },
            handleSwipe: function(oEvent){
                let oSwipeContent = oEvent.getParameter("swipeContent"),
				    oSwipeDirection = oEvent.getParameter("swipeDirection");
                    if (oSwipeDirection === "BeginToEnd") {                        
                        oSwipeContent.setText("Approve").setType("Accept");
        
                    } else  {                        
                        oSwipeContent.setText("Delete").setType("Reject");
                    }                    
            },
            onPressDelete: function(oEvent){
                const sDate = `datetimeoffset'${encodeURIComponent(this.getView().getBindingContext().getObject()["Sessionid"].toJSON())}'`;
                const sUser = this.getView().getBindingContext().getObject()["Userid"];
                this.getView().getModel().remove(`/AssetScans(AssetTag='${oEvent.getSource().getParent().getSender()}',SessionId=${sDate},UserId='${sUser}')`)
            },
            handleSwipeAction: function (evt) {
                let oList = evt.getSource().getParent();
                oList.removeAggregation("items", oList.getSwipedItem());
                oList.swipeOut();
            },
            formatInfo: function(sFoundinSAP){
                return (sFoundinSAP === 'X' ? 'Scanned. Exist in SAP' : "Scanned. Doesn't Exist in SAP")
            },
            formatIcon: function(sFoundinSAP){
                return (sFoundinSAP === 'X' ? 'sap-icon://capital-projects' : "sap-icon://alert")
            },
            formatScannedOn: function(sScannedOn){
                return `${sScannedOn.substr(6,2)}.${sScannedOn.substr(4,2)}.${sScannedOn.substr(0,4)} ${sScannedOn.substr(8,2)}:${sScannedOn.substr(10,2)}:${sScannedOn.substr(12,2)}`
                //return sScannedOn
            }
            ,
            onPressReview: function(){

            },

            onPressSubmit: function(){

            },
            onPressCancel:function(){
                MessageBox.confirm("This action will end User Session and will discard all the scanned assets. Do you want to continue?",{
                    actions: [MessageBox.Action.OK,MessageBox.Action.CANCEL],                 // default
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.OK ){
                            Session.endSession.call(this);
                            sap.ui.getCore().byId("scannedassetslist").getBinding('items').refresh();
                        }
                    }.bind(this)
                });
            }
        });
    });
