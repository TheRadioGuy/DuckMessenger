async function select(table, data, where, limit) {
	let query = "SELECT ";
	let datas = "";
	let wheres;
	data.forEach((value, key) => {
		if (data.length == (key + 1)) {
			datas += value;
			return false;
		}
		datas += value + ',';
	});

	for(json of where){
		console.log(json)
		console.log(where);
	}


	query+=datas;
	query+=" FROM " + table;

	console.log(query);
};

select('duck', ['name', 'surname'], {duck:true});