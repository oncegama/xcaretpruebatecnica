public without sharing class RedditController {
    public RedditController(){}
    @AuraEnabled
    public static List<reddit_items__c> callAouth(){
        List<reddit_items__c> preview_reddit_items =[SELECT Id,title__c,selftext__c,author_fullname__c,thumbnail__c FROM reddit_items__c ];
        if(preview_reddit_items.size()==0){
            HttpRequest req = new HttpRequest();
            ConsumeService__mdt baseUrl = [SELECT URL__c FROM ConsumeService__mdt WHERE DeveloperName='Reddit'];
            String finalendpoint=baseUrl.URL__c+'/r/subreddit/new.json?sort=new';
            req.setEndpoint(finalendpoint);
            req.setMethod('GET');
            req.setHeader('Content-Type', 'application/json');
            
            Http http = new Http();
            HTTPResponse res = http.send(req);
            
            Map<String, Object> result = new Map<String, Object>();
            List<reddit_items__c> reddit_items = new List<reddit_items__c>(); 
            
            if(res.getStatusCode()==200){
                result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                system.debug(result);
                Map<String, Object> data = (Map<String, Object>)result.get('data');
                List<Object>children=(List<Object>) data.get('children');
                system.debug(children.size());
                
                for(Object child:children){
                    reddit_items__c reddit_item = new reddit_items__c();
                    Map<String, Object> childfields = (Map<String, Object>)child;                
                    Map<String, Object> childrendata = (Map<String, Object>)childfields.get('data');
                    reddit_item.title__c=String.valueOf(childrendata.get('title'));
                    reddit_item.selftext__c=String.valueOf(childrendata.get('selftext'));
                    reddit_item.author_fullname__c=String.valueOf(childrendata.get('author_fullname'));
                    reddit_item.thumbnail__c=String.valueOf(childrendata.get('thumbnail'));
                    system.debug(String.valueOf(childrendata.get('title')).length());
                    system.debug(String.valueOf(childrendata.get('selftext')).length());
                    system.debug(String.valueOf(childrendata.get('author_fullname')).length());
                    system.debug(String.valueOf(childrendata.get('thumbnail')).length());
                    reddit_items.add(reddit_item);
                }
                insert reddit_items;
            }
        }
        return preview_reddit_items;
    }
    @AuraEnabled
    public static Map<String,String> deleteRedditList(String redditIds){
		system.debug(redditIds);
        List<reddit_items__c> reddit_items =[SELECT Id FROM reddit_items__c WHERE Id=:redditIds];
        Map<String,String> resultMap = new Map<String,String>();
        try{
            delete reddit_items;
            resultMap.put('status', 'success');
            resultMap.put('message', 'Reddit Item Deleted Successfully');            
        }
        catch(Exception e){
            resultMap.put('status', 'error');
            resultMap.put('message', e.getMessage());  
        }
        return resultMap;
    }
}