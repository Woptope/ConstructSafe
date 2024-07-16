function ChangeBehavior(selectedItemReferences) {
    if (!selectedItemReferences || selectedItemReferences.length === 0) {
        console.log("No selected items found.");
        return;
    }

    var selectedItem = selectedItemReferences[0];
    var entityName = selectedItem.TypeName;
    var recordId = selectedItem.Id;

    var confirmStrings = {
        text: "Are you sure you want to open this record?",
        title: "Confirmation",
        confirmButtonLabel: "Yes",
        cancelButtonLabel: "No"
    };
    var confirmOptions = { height: 200, width: 450 };

    Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
        function (success) {
            if (success.confirmed) {
                var entityFormOptions = {};
                entityFormOptions["entityName"] = entityName;
                entityFormOptions["entityId"] = recordId;
                Xrm.Navigation.openForm(entityFormOptions);
            }
        },
        function (error) {
            console.log(error.message);
        }
    );
}
