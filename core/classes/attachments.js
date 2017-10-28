



const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/attachments.json');
var shortid = require('shortid');
low(adapter)
  .then(db => {






   db.defaults({attachments: [] })
  .write()



var getDB = db.get('attachments');


var getAttachment = function(id){
	var data = getDB.find({id:id}).value();

	if(data == undefined){
		return null;
	}
else return {data:data['data'], mime:data['mime']};

}
var addAttachments = function(Attachment){
	Attachment['id'] = shortid.generate() + shortid.generate();
getDB.push(Attachment).write();
return true;

}
module.exports.getAttachment=getAttachment;
module.exports.addAttachments=addAttachments;



function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}





    
  });



