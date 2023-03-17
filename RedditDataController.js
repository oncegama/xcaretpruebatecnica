({
	getRedditList : function(component, event, helper) {        
        helper.fetchReddits(component, event, helper);
    },
    deleteRedditItem: function(component, event, helper) {
        // Calling removeContacts Helper Function
        helper.removeReddits(component, event, helper);
    }
})