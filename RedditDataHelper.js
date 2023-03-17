({
	fetchReddits : function(component, event, helper) {
        // Assign server method to action variable
        var action = component.get("c.callAouth");
        // Getting the account id from page
        var redditId = component.get("v.recordId");
        // Setting parameters for server method
        action.setParams({
            redditIds: redditId
        });
        // Callback function to get the response
        action.setCallback(this, function(response) {
            // Getting the response state
            var state = response.getState();
            // Check if response state is success
            if(state === 'SUCCESS') {
                // Getting the list of contacts from response and storing in js variable
                var redditList = response.getReturnValue();
                // Set the list attribute in component with the value returned by function
                component.set("v.redditList",redditList);
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting data');
            }
        });
        // Adding the action variable to the global action queue
        $A.enqueueAction(action);
    },
    removeReddits: function(component, event, helper) {
        // Getting the deleteContact Component
        var redditsToDelete = component.find("deleteRedditData");
        
        // Initializing the toast event to show toast
        var toastEvent = $A.get('e.force:showToast');
        // Defining the action to delete contact List ( will call the deleteContactList apex controller )
        var deleteAction = component.get('c.deleteRedditList');
        var redditIds = event.getSource().get("v.name");
        console.log(event.getSource().get("v.name"));
        // setting the params to be passed to apex controller
        deleteAction.setParams({
            redditIds: redditIds
        });
        // callback action on getting the response from server
        deleteAction.setCallback(this, function(response) {
            // Getting the state from response
            var state = response.getState();
            console.log(response.getState());
            if(state === 'SUCCESS') {
                // Getting the response from server
                var dataMap = response.getReturnValue();
                // Checking if the status is success
                if(dataMap.status=='success') {
                    // Setting the success toast which is dismissable ( vanish on timeout or on clicking X button )
                    toastEvent.setParams({
                        'title': 'Success!',
                        'type': 'success',
                        'mode': 'dismissable',
                        'message': dataMap.message
                    });
                    // Fire success toast event ( Show toast )
                    toastEvent.fire();            
	                window.location.reload();
                }
                // Checking if the status is error 
                else if(dataMap.status=='error') {
                    // Setting the error toast which is dismissable ( vanish on timeout or on clicking X button )
                    toastEvent.setParams({
                        'title': 'Error!',
                        'type': 'error',
                        'mode': 'dismissable',
                        'message': dataMap.message
                    });
                    // Fire error toast event ( Show toast )
                    toastEvent.fire();                
                }
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting data');
            }            
        });
        $A.enqueueAction(deleteAction);
    }
})