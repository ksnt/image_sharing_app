// code sent to client and server
// which gets loaded before anything else (since it is in the lib folder)

Comments = new Mongo.Collection('comments');
Comments.allow({
  insert: function(userId,doc) {
      return true;
  } 
});