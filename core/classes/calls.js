

var LZString = require('lz-string');


var callsList = {};
const ERROR_PARAMS_EMPTY_CODE=0;

const low = require('lowdb')


const FileSync = require('lowdb/adapters/FileSync');

const adapt = new FileSync('./core/databases/users.json');
const users = low(adapt).get('users');




const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/calls.json');
var shortid = require('shortid');




low(adapter)
    .then(db => {



        db.defaults({
                calls: []
            })
            .write()



        var calls = db.get('calls');




        var callUser = function(login, user){
            if(isEmpty(login) || isEmpty(user)){
                 return u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true);
            }
            if(!isEmpty(callsList[login]) || !isEmpty(callsList[user])){
                return u(500, 'User already calling', true)
            }
            if(login==user) return u(403, 'WTF?!', true);



            var userInfo = users.find({login:user}).value();
             var myInfo = users.find({login:login}).value();

            if(userInfo==undefined){
                return u(401, 'User isnt exists', true)
            }
            callsList[login] = {with:user, state:0};
            callsList[user] = {with:login, state:0};
            /**
             * states : 0 - connecting, 1 - call
             */

           return u(503, {from:login, name:myInfo['name'] + ' ' + myInfo['surname'], image:myInfo['image']}, false);

        }

        var acceptCall = function(login, user){
            if(isEmpty(user) || isEmpty(login)) return u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true);
             if(typeof callsList[user] == 'undefined' || callsList[user]['with']!=login) return u(507, 'you cannt accept call', true)

                if(callsList[user]['state']==0){
                    callsList[user]['state']=1;
                    callsList[login]['state']=1;
                    return u(508, 'you accept call', false);
                }
                else return u(507, 'you cannt accept call', true);
        }
        var canSay = function(login, user){
        

            if(isEmpty(login) || isEmpty(user)){
                 return false;
            }
            if(typeof callsList[user] == 'undefined' || callsList[user]['with']!=login) return false;

            if(typeof callsList[user] != 'undefined' && callsList[user]['with']==login && callsList[user]['state']==1) return true;

            else return false;

                

        }

        var endUserCall = function(login, user){
            if(isEmpty(login) || isEmpty(user)) return u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true);



                    if(isEmpty(callsList[login]) || isEmpty(callsList[user])){
                       return u(0, 'Some params is empty', true); 
                    }
                    if(typeof callsList[user] != 'undefined' && callsList[user]['with']!=login) return u(403, 'WTF?!', true);


                delete callsList[login];
                delete callsList[user];



                return u(504, 'Call ended', false);
        }


        var adminEndCall = function(user){
            if(typeof callsList[user]=="undefined") return false;
            var who = callsList[user]['with'];
             delete callsList[who];
            delete callsList[user];

            return who;
        }

        module.exports.callUser = callUser;
        module.exports.canSay=canSay;
        module.exports.endUserCall=endUserCall;
        module.exports.acceptCall=acceptCall;
        module.exports.adminEndCall = adminEndCall;

        function u(code, data, isError){
 var varData = {};
    if(isError==true){
        varData['error_code'] = code;
        varData['error'] = 1;
    }
    else{
        varData['code'] = code;
        varData['error'] = 0;
    }



    varData['msg'] = data;
    return LZString.compressToUTF16(JSON.stringify(varData));
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