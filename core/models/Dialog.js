module.exports = function(sequelize, DataTypes) {
	const dialogs = sequelize.define('dialogs', {
		dialogId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		dialogWith: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		},
		dialogAuthor: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		},
		message: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		},
		time: {
			type: DataTypes.INTEGER,
			validate: {
				notEmpty: true
			}
		},
		is_group: {
			type: DataTypes.BOOLEAN
		},
		peoples: {
			type: DataTypes.INTEGER
		},
		groupName: {
			type: DataTypes.STRING
		}
	})
	return dialogs;
};