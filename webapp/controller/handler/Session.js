jQuery.sap.declare("com.seagate.ui5.assettagpi.controller.handler.Session");
com.seagate.ui5.assettagpi.controller.handler.Session = {
    _sessionId: null,
    start: function(){
        this.getView().getModel().metadataLoaded().then(()=> {
            this.getView().getModel().callFunction("/startSession",
            {
                method: "POST",
                urlParameters: {
                    SessionId: new Date()
                },
                success: (oData, oResp) => {
                    this._sessionId = oData.startSession.SessionId;
                    this._userId = oData.startSession.Userid;
                    if (oResp.headers["sap-message"]) {
                        this.getView().setBusy(true);
                        sap.ui.getCore().getMessageManager().removeAllMessages();
                        sap.m.MessageBox.confirm("Session Already Open. Do you want to discard and create new session?", {
                            onClose: function (sAction) {
                                switch (sAction) {
                                    case 'OK':
                                        com.seagate.ui5.assettagpi.controller.handler.Session.endSession();
                                        break;
                                    default:
                                        com.seagate.ui5.assettagpi.controller.handler.Session._startSession(this,this._userId, this._sessionId)
                                        this.getView().setBusy(false);
                                        break;
                                }
                            }.bind(this)
                        });
                    } else {
                        com.seagate.ui5.assettagpi.controller.handler.Session._startSession.call(this,oData.startSession.Userid, this._sessionId)
                    }
                },
                error: (oErr) => {
                    console.log(oErr);
                }
            })
        });
    },
    _startSession: function (sUser, oSession) {
        com.seagate.ui5.assettagpi.controller.handler.Session._sessionId = oSession;
        let oContext = this.getView().getModel().createEntry("/AssetScans", {
            properties: {
                Userid: sUser,
                Sessionid: oSession
            }
        });
        this.getView().setBindingContext(oContext);
    },

    onCancel: function(bCancelData){
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteMain");
    },

    endSession: function(){
        this.getView().getModel().callFunction("/endSession",
            {
                method: "POST"
            })
    }
}   