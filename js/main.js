// making tabs navigations
// all varibales are here
const navButtons = document.querySelectorAll('nav ul li button');
const tabs = document.querySelectorAll('.mainScreen > div');
const surahUrl = "http://api.alquran.cloud/v1/surah";
const recitersUrl = "https://api.alquran.cloud/v1/edition/format/audio";
const tafsirUrl = "https://api.alquran.cloud/v1/edition/type/tafsir";
const translateUrl = "https://api.alquran.cloud/v1/edition/type/translation";
const allSelects = document.querySelectorAll('.options select');
const details = document.querySelector('.details').children;
const details2 = document.querySelector('.translation .title').children;
let tafsirTitle = document.querySelector('.tafsir .title h3');
let searchLoader = document.querySelector('.search .mainArea img');
// font settings
let fontSpan = document.querySelector('#fontSize');
let fontZoomIn = document.querySelector('#zoomIn');
let fontZommOut = document.querySelector('#zoomOut');

navButtons.forEach(button => {
	button.addEventListener('click',_=>{
		navButtons.forEach(button => {
			button.classList.remove('active');
		});		
		button.classList.add('active');
		tabs.forEach(tab => {
			if(tab.classList.contains(button.id)){
				tab.style.zIndex = `5`;
			}else{
				tab.style.zIndex = `1`;
			}
		});
	});
});

// fisrt making surah tab and translation tabs
fetch(surahUrl).then(response => response.json())
.then(data => {
	data.data.forEach(surah => {
		let option = document.createElement('option');
		option.setAttribute("value", surah.number)
		option.textContent = `${surah.name}`;
		allSelects[0].append(option);
	});
}).catch(error => {
	console.log(error)
});

allSelects[0].addEventListener('input',_=>{
	if(document.querySelector('audio')){
		document.querySelector('audio').remove();
	}
});

// get all reciters
fetch(recitersUrl).then(response => response.json())
.then(data => {
	data.data.forEach(reciter => {
		let option = document.createElement('option');
		option.setAttribute("value", reciter.identifier)
		option.textContent = `${reciter.name}`;
		allSelects[1].append(option);
	});
}).catch(error => {
	console.log(error)
});

// get all tafsirs
fetch(tafsirUrl).then(response => response.json())
.then(data => {
	data.data.forEach(tafsir => {
		let option = document.createElement('option');
		option.setAttribute("value", tafsir.identifier);
		option.textContent = `${tafsir.name}`;
		allSelects[2].append(option);	
	});
}).catch(error => {
	console.log(error)
});

// get all translations
fetch(translateUrl).then(response => response.json())
.then(data => {
	data.data.forEach(translation => {
		let option = document.createElement('option');
		option.setAttribute("value", translation.identifier);
		option.textContent = `${translation.name}`;
		allSelects[3].append(option);
	});
	allSelects[3].selectedIndex = 10;
}).catch(error => {
	console.log(error)
});

// [1] intilize surah
let ayatArea = document.querySelector('.ayat');
let translateArea = document.querySelector('.ayat2');

async function intlizeSurah(surahNumber){
	let surah = `http://api.alquran.cloud/v1/surah/${surahNumber}`;
	ayatArea.innerHTML = ``;
	await fetch(surah).then(response => response.json())
	.then(data => {
		details[0].textContent = `${data.data.name}`;
		details[1].textContent = `${data.data.numberOfAyahs}`;
		if(data.data.revelationType === "Meccan"){
			details[2].textContent = `مكيةٌ`;	
		}else{
			details[2].textContent = `مدنيةُ`;
		}
		data.data.ayahs.forEach(ayah => {
			let ayahElement = document.createElement('span');
			ayahElement.addEventListener('click',_=>{
				playAyah(ayah.number);
			});
			if(ayah.text.includes("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ") && data.data.name !== "سُورَةُ ٱلْفَاتِحَةِ"){
				ayahElement.innerHTML = `${ayah.text.replace("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ","<p>بسم الله الرحمن الرحيم</p>")} (${ayah.numberInSurah})`;
			}else{
				ayahElement.textContent = `${ayah.text} (${ayah.numberInSurah})`;
			}
			ayatArea.append(ayahElement);
		});	

		document.querySelectorAll('.ayat span').forEach(ayah => {
			ayah.addEventListener('click',_=>{
				document.querySelectorAll('.ayat span').forEach(ayah => {
					ayah.classList.remove('active');
				});
				ayah.classList.add('active');
			});

		});
	}).catch(error => {
		console.log(error);
	});
}

tafsirTitle.textContent = `التفسير (تفسير الميسر)`;

intlizeSurah(1);
createSurahTafser(1,"ar.muyassar");

allSelects[0].addEventListener('input',_=>{
	intlizeSurah(allSelects[0].value);
	tafserArea.innerHTML = ``;
	createSurahTafser(allSelects[0].value,allSelects[2].value);
	tafsirTitle.textContent = `التفسير (${allSelects[2].options[allSelects[2].selectedIndex].textContent})`
});

allSelects[2].addEventListener('input',_=>{
	tafserArea.innerHTML = ``;
	createSurahTafser(allSelects[0].value,allSelects[2].value);
	tafsirTitle.textContent = `التفسير (${allSelects[2].options[allSelects[2].selectedIndex].textContent})`
});

function CreateAudio(audiosrc){
	let audio = document.createElement('audio');
	audio.hidden = true;
	audio.controls = true;
	let source = document.createElement('source');
	source.src = `${audiosrc}`;
	source.type = `audio/mp3`;
	audio.append(source);
	document.body.append(audio);
	audio.play();
}

function playAyah(ayahNumber){
	let ayahReciteUrl = `http://api.alquran.cloud/v1/ayah/${ayahNumber}/${allSelects[1].value}`;
	if(document.querySelector('audio')){
		document.querySelector('audio').remove();
	}
	fetch(ayahReciteUrl).then(response => response.json())
	.then(data => {
		CreateAudio(data.data.audio);
	}).catch(error => {
		console.log(error);
	});
}

// making save inside local storge

// making translation


// making search
let keywordsinput = document.querySelector('#search');
let searchButton = document.querySelector('#searchBtn');
let searchList = document.querySelector('#searchList');

function highlightKeywords(text,keyword) {
  return text.replace(keyword,`<span class="highlight">${keyword}</span>`);
}

async function SearchAyah(){
	searchList.innerHTML = ``;
	if(document.querySelector('#found')){
		document.querySelector('#found').remove();
	}
	let searchUrl = `http://api.alquran.cloud/v1/search/${keywordsinput.value}/all/quran-simple-clean`;
	searchLoader.style.display = 'block';
	await fetch(searchUrl).then(response => response.json())
	.then(data => {
		let founds = document.createElement('p');
		founds.textContent = `"تم العثور على ${data.data.matches.length} نتائج"`;
		founds.id = `found`;
		searchList.parentNode.prepend(founds);

		data.data.matches.forEach(match => {
			let li = document.createElement('li');
			let h3 = document.createElement('h3');
			let details = document.createElement('p');
			details.textContent = `${match.surah.name} أيه ${match.numberInSurah}`;
			li.append(details);
			li.append(h3);
			h3.innerHTML = highlightKeywords(match.text,keywordsinput.value);
			searchList.append(li);
		});
	}).catch(error => {
		let li = document.createElement('li');
		let h3 = document.createElement('h3');
		h3.textContent = "لا يوجد نتائج";
		li.append(h3);
		searchList.append(li);
	});
	searchLoader.style.display = 'none';
}
searchButton.addEventListener('click',_=>{
	SearchAyah();
});
document.addEventListener('keydown',e=>{
	if(e.keyCode === 13){
		SearchAyah();
	}
});

fetch("http://api.alquran.cloud/v1/edition").then(response => response.json())
.then(data => {
	
}).catch(error => {
	console.log(error);
});

// making font function
let zoomValue;

if(localStorage.getItem('fontSize')){
	zoomValue = +localStorage.getItem('fontSize');
	document.querySelector('.content').style.fontSize = `${zoomValue}px`;
	fontSpan.textContent = `${+zoomValue}`;
}else{
	zoomValue = 25;
	document.querySelector('.content').style.fontSize = `${zoomValue}px`;
	fontSpan.textContent = `${+zoomValue}`;
}

function ZoomIn(){
	if(zoomValue < 50){
		zoomValue+=5;
	}
	document.querySelector('.content').style.fontSize = `${zoomValue}px`;
	fontSpan.textContent = zoomValue;
	localStorage.setItem('fontSize',zoomValue);
}

function ZoomOut(){
	if(zoomValue > 10){
		zoomValue-=5;
	}
	document.querySelector('.content').style.fontSize = `${zoomValue}px`;
	fontSpan.textContent = zoomValue;
	localStorage.setItem('fontSize',zoomValue);
}

fontZoomIn.addEventListener('click',_=>{
	ZoomIn();
});
fontZommOut.addEventListener('click',_=>{
	ZoomOut();
});

// make Tafsir
const tafserArea = document.querySelector('.tafsirArea');

function AyahTafsirSurcture(ayah,ayahTafsir){
	let tafsir = document.createElement('div');
	tafsir.setAttribute('class', 't');
	let h3 = document.createElement('h3');
	let p = document.createElement('p');
	h3.textContent = ayah;
	p.textContent = ayahTafsir;
	tafsir.append(h3);
	tafsir.append(p);
	tafserArea.append(tafsir);
}

async function createSurahTafser(surahNumber,tafsirOption){
	let surahURL = `http://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple-clean,${tafsirOption}`;
	let ayat = [];
	let tafsit = [];
	let done = false;
	await fetch(surahURL).then(response => response.json())
	.then(data => {
		data.data[0].ayahs.forEach(ayah => {
			if(ayah.text.includes("بسم الله الرحمن الرحيم") && data.data[0].name !== "سُورَةُ ٱلْفَاتِحَةِ"){
				ayat.push(ayah.text.replace("بسم الله الرحمن الرحيم",""));
			}else{
				ayat.push(ayah.text);
			}
		});
		data.data[1].ayahs.forEach(ayah => {
			tafsit.push(ayah.text);
		});
		for(let i = 0;i<ayat.length;i++){
			AyahTafsirSurcture(ayat[i],tafsit[i]);
		}
	}).catch(error => {
		console.log(error);
	});
}

// creating translation

function createTranslation(surahNumber,translationEdition){
	let translationURL = `http://api.alquran.cloud/v1/eiditon/translation/`;
	fetch(translateUrl).then(response => response.json())
	.then(data => {
		console.log(data.data[0].identifier);
	}).catch(error => {
		console.log(error);
	});
}

createTranslation(1,"en.ahmedali");


// structure
// <div class="loader">
//   <div class="loader__bar"></div>
//   <div class="loader__bar"></div>
//   <div class="loader__bar"></div>
//   <div class="loader__bar"></div>
//   <div class="loader__bar"></div>
//   <div class="loader__ball"></div>
// </div>