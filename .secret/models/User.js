module.exports = function(sequelize, DataTypes)
{
    return sequelize.define('users', {
        userid: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        login: {type:DataTypes.STRING, validate: {notEmpty: true}},
        email: {type:DataTypes.STRING, validate: {notEmpty: true}},
        name: {type:DataTypes.STRING, validate: {notEmpty: true}},
        surname: {type:DataTypes.STRING, validate: {notEmpty: true}},
        image: {type:DataTypes.STRING, validate: {notEmpty: true}},
        rights: {type:DataTypes.BOOLEAN},
        online: {type:DataTypes.BOOLEAN},
        is_validate: {type:DataTypes.BOOLEAN},
        is_offical: {type:DataTypes.BOOLEAN},
        lastOnline: {type:DataTypes.INTEGER},
        })
    };
