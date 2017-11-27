
const withoutCompress = false; // Disable photo compress?


if(!withoutCompress) var sharp = require('sharp');




const low = require('lowdb')



const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/attachments.json');
var shortid = require('shortid');




low(adapter)
    .then(db => {



        db.defaults({
                attachments: []
            })
            .write()



        var getDB = db.get('attachments');


        var getAttachment = function(id, field) {
            var data = getDB.find({
                id: id
            }).value();

            if (data == undefined) {
                return null;
            } else {
                if (isEmpty(field)) field = 'photo_450';


                if (data['type'] == 'image') return {
                    mime: data['mime'],
                    data: data[field]
                };
                else return {
                    mime: data['mime'],
                    data: data['data']
                };
            }

        }
        var addAttachments = function(Attachment, buff, cb) {
            Attachment['id'] = (shortid.generate() + shortid.generate()).replace('_', '-');

            Attachment['type'] = whatTheType(Attachment['mime']);


           
            var imageOriginal, imageResizeMedium, size, imageProfile;
            console.log('compress : ' + withoutCompress);

            if(!withoutCompress){
                 var image = sharp(buff);

                  if (Attachment['type'] == 'image') {
                delete Attachment['data'];



                image.metadata()
                    .then(function(metadata) {
                        size = {
                            w: metadata.width,
                            h: metadata.height
                        };

                        return image
                            .resize(Math.round(metadata.width / 1.3), Math.round(metadata.height / 1.3))
                            .resize(Math.round(metadata.width), Math.round(metadata.height))
                            .webp()
                            .toColourspace('lab');

                    })
                    .then(function(dataImage) {

                        if (Attachment['is_profile'] == 1) {

                            dataImage.resize(128, 128).toBuffer({
                                resolveWithObject: true
                            }, function(err, data) {



                                imageProfile = data.toString('base64');

                                Attachment['photo_128'] = imageProfile;
                                Attachment['photo_450'] = imageProfile;
                                Attachment['photo_original'] = imageProfile;


                                dataImage.resize(270, 270).toBuffer({
                                resolveWithObject: true
                            }, function(err,data){

                                Attachment['photo_450'] = data.toString('base64');

                                getDB.push(Attachment).write();


                                
                                cb({
                                    id: Attachment['id'],
                                    type: Attachment['type'],
                                    name: Attachment['name']
                                });


                            });
                                
                            


                            });
                        } else {
                            dataImage.toBuffer({
                                resolveWithObject: true
                            }, function(err, data) {
                                imageOriginal = data.toString('base64');


                                if (size['w'] >= 450 || size['h'] >= 450) {

                                    dataImage.resize(450, 450).toBuffer({
                                        resolveWithObject: true
                                    }, function(err, data) {
                                        imageResizeMedium = data.toString('base64');
                                        Attachment['photo_128'] = imageOriginal;
                                        Attachment['photo_450'] = imageResizeMedium;
                                        Attachment['photo_original'] = imageOriginal;
                                        getDB.push(Attachment).write();
                                        cb({
                                            id: Attachment['id'],
                                            type: Attachment['type'],
                                            name: Attachment['name']
                                        });
                                    });


                                } else {
                                    imageResizeMedium = imageOriginal;
                                    Attachment['photo_128'] = imageOriginal;
                                    Attachment['photo_450'] = imageResizeMedium;
                                    Attachment['photo_original'] = imageOriginal;
                                    getDB.push(Attachment).write();
                                    cb({
                                        id: Attachment['id'],
                                        type: Attachment['type'],
                                        name: Attachment['name']
                                    });
                                }



                            });



                        }



                    });

            } else {

                getDB.push(Attachment).write();
                cb({
                    id: Attachment['id'],
                    type: Attachment['type'],
                    name: Attachment['name']
                });

            }

            }

            else{

                console.log("NO COMPRESS");
                Attachment['photo_128'] = buff;
                                    Attachment['photo_450'] = buff;
                                    Attachment['photo_original'] = buff;
                getDB.push(Attachment).write();
                cb({
                    id: Attachment['id'],
                    type: Attachment['type'],
                    name: Attachment['name']
                });

            }

          



        }


        var isTokenValide = function(token, tokens) {


            return tokens[token];
        };
        module.exports.getAttachment = getAttachment;
        module.exports.addAttachments = addAttachments;
        module.exports.isTokenValide = isTokenValide;


        function whatTheType(mime) {

            console.log(mime);


            var type = mime.split('/')[0];



            if (type != 'video' && type != 'image' && type != 'audio') type = 'document';



            return type;
        }

        function isEmpty(obj) {

            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0) return false;
            if (obj.length === 0) return true;

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