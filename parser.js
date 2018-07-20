var request = require('request');
var cheerio = require('cheerio');
var tress = require('tress');
var fs = require('fs');
var Json2csvParser = require('json2csv').Parser;
var needle = require('needle');

var results = [];
var urls = [];

//TODO внести название файлов куда должны упасть данные
fs.truncate('./my-file.json', 0, function(){console.log('done')});
fs.truncate('./my-file.csv', 0, function(){console.log('done')});

// TODO внести URL который пропарсится и соберет все ссылки
var sURL = 'сюда вставить свой url';

var q;

q = tress(function(sURL, callback){

needle(sURL, function (err, res, body) {
		if (err) throw err;
		var $ = cheerio.load(res.body);
		console.log(listLength);

			//TODO считал количество урлов автоматом по селектору
			var listLength = $('.tbl1 tr').length;

			var link;
			//TODO заменить цифру 22 количество урлов сколько надо собрать на странице
			for (i = 0; i <= 22; i++) {
				//TODO внести верный селектор ссылки
					link ="http://www.твой сайт.ru" + $('.tbl1 tr td:nth-child(2) > a').eq(i).attr('href');
					// console.log(link);
					// #cont_div > p:nth-child(7) > b:nth-child(1)
					urls.push(link);

					results.push({
				 		seminarName: $('.tbl1 tr td:nth-child(2)').eq( i ).text().trim(),
						// seminarName: $('.tbl1 tr  td> a:nth-child(1)').eq( i ).text().trim(),
						price: $('.tbl1 tr td:nth-child(3)').eq( i ).text().trim(),
						
					 });
				 	console.log(urls[i]);
				}

		console.log(res.statusCode);
		callback();
		 });
});


// Функция котороая заходит внутрь каждого урла и вытаскивает нужную инфу
var getInside = tress(function(url, callback){
	
needle(url, function (err, res, body) {
		if (err) throw err;
		var $ = cheerio.load(res.body);

		var date = $('#cont_div > p:nth-of-type(2) > b').text().trim();
		if (date.inneText === "") {
			date = $('#cont_div > p:nth-of-type(3) > b').text().trim();
		}
		console.log(date)
		// console.log(res.statusCode);
		callback();
		 });
});


var useLinks =  function (urls) {
	urls.forEach ( function(url) {

		getInside.push(url, function(){
			// console.log(url);
			// console.log("watch: push inside")
		});
	})
	
}


q.push(sURL, function(){
		console.log("watch: push ");
	});



q.drain = function(){
	console.log("success ");
	useLinks(urls);
		fs.appendFileSync('../my-file.json', JSON.stringify(d, null, 4), function(error){

						if(error) throw error; // если возникла ошибка
						 
						console.log("Запись файла завершена. Содержимое файла:");
						var data = fs.readFileSync("hello.txt", "utf8");
						console.log(data);  // выводим считанные данные);
		});
		//Данные которые спарсил раскладываю по следующим столбцам
		// const fields = ['author', 'seminarName', 'price', 'date'];
		const fields = [ 'seminarName', 'price', 'test'];

		const opts = { fields , delimiter: ';'};

		try {
			// Из json данные складываются в csv файл
		  const parser = new Json2csvParser(opts);
		  const csv = parser.parse(results);

		  fs.appendFileSync('./my-file.csv', '\ufeff'+ csv , {encoding: 'utf8'});

		} catch (err) {
		  console.error(err);
		}
}
