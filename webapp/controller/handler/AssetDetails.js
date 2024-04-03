jQuery.sap.declare("com.seagate.ui5.assettagpi.controller.handler.AssetDetails");
com.seagate.ui5.assettagpi.controller.handler.AssetDetails = {

    getAssetDetails : async function(sAsset,Controller){
        
        let aData = new Array(),
            mSelect = 'CompanyCode,AssetNumber,AssetTag,AssetSubNumber,AssetClass,AssetCapitalizationDate',
            mUrlParameters = {"$top": 5000,
                              "$select": mSelect };
        
            aData = await new Promise( (resolve, reject) =>{
                Controller.getView().getModel().read(`/AssetTag('${sAsset}')/Set`, {
                    urlParameters: mUrlParameters,
                    success: (oData) => {
                        oData.results.forEach(row => {
                            delete row["__metadata"];
                            for (const [key, value] of Object.entries(row)) {
                                aData.push({"name": `${key}`, "value": `${value}`});
                              }
                            });                            
                            resolve(aData);
                        }
                    });
                });

        return aData;
    },
    getAssetScanDetails : async function(sAsset,Controller){
        let aData = new Array(),
            mSelect = 'CompanyCode,AssetNumber,AssetTag,AssetSubNumber',
            mUrlParameters = {"$top": 5000 };
        
            aData = await new Promise( (resolve, reject) =>{
                Controller.getView().getModel().create(`/AssetScans`, {
                        SessionId : Controller.getView().getBindingContext().getObject()["Sessionid"],
                        AssetTag : sAsset,
                        UserId: Controller.getView().getBindingContext().getObject()["Userid"]
                    },{
                        success: oData => resolve(oData)
                    }
                    );   
                
                // resolve([
                //     {"AssetNumber":"B00014018", "AssetDescription":"Asset 1", "ScannedOn":"Today, 4:21 PM", "CompanyCode":"1000"}
                // ])
                });

        return aData;
    }

}
