"use strict";

//const { init } = require("gulp-sourcemaps");

var map = [];
//#region Обработка клика по стрелочке в меню
var menuArrows = document.querySelectorAll('.menu__arrow');
if (menuArrows.length > 0) {
	var _loop = function _loop(i) {
		var menuArrow = menuArrows[i];
		menuArrow.addEventListener('click', function (e) {
			menuArrow.parentElement.classList.toggle('_active');
		});
	};

	for (var i = 0; i < menuArrows.length; i++) {
		_loop(i);
	}
}
//#endregion

function init() {
	// Создание карт

	map = new ymaps.Map('map_2', {
		center: [0, 0],
		zoom: 16
	});

	//Удаление элементов управления с карты
	map.controls.remove('searchControl');
	map.controls.remove('trafficControl');
	map.controls.remove('geolocationControl');
	map.controls.remove('typeSelector');
	map.controls.remove('fullscreenControl');
	map.controls.remove('rulerControl');
	map.controls.remove(['scrollZoom']);
	map.behaviors.disable('scrollZoom');
}

//#region Поведение иконки бургера
var burger = document.querySelector('.header__burger');
if (burger) {
	var menu = document.querySelector('.menu');
	burger.addEventListener('click', function (e) {
		document.body.classList.toggle('_lock');
		burger.classList.toggle('_active');
		menu.classList.toggle('_active');
	});
}
//#endregion

//#region Поведение хедера по скроллу
// Плавающая шапка
var lastScroll = 0;
var defaultOffset = 50;
var header = document.querySelector('.header');

var scrollPosition = function scrollPosition() {
	return window.pageYOffset || document.documentElement.scrollTop;
};
var containHide = function containHide() {
	return header.classList.contains('_hide');
};
window.addEventListener('scroll', function () {
	if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
		header.classList.add('_hide');
	} else if (scrollPosition() < lastScroll && containHide()) {
		header.classList.remove('_hide');
	}
	if (lastScroll > 50) {
		header.classList.add('_paint');
	} else {
		header.classList.remove('_paint');
	}
	lastScroll = scrollPosition();
});
//#endregion

//#region Добавление карточки в избранное
var cardsParent = document.querySelector('.cards');
var favourite = document.querySelector('.header__favourites');
var realEstateFeaturedArray = [];

if (cardsParent) {
	cardsParent.addEventListener('click', function (e) {
		var targetElement = e.target;
		if (targetElement.closest('.cards__like')) {
			var estateId = targetElement.closest('.real-estate-unit').dataset.id;
			if (targetElement.classList.contains('cards__like--featured')) {
				targetElement.classList.remove('cards__like--featured');
				var index = realEstateFeaturedArray.indexOf(estateId);
				realEstateFeaturedArray.splice(index, 1);
				localStorage.setItem('realEstateItems', JSON.stringify(realEstateFeaturedArray));
			} else {
				targetElement.classList.add('cards__like--featured');
				realEstateFeaturedArray.push(estateId);
				localStorage.setItem('realEstateItems', JSON.stringify(realEstateFeaturedArray));
				addToFavourites(targetElement, estateId);
			}
			if (realEstateFeaturedArray.length === 0) {
				localStorage.removeItem('realEstateItems');
				favourite.classList.remove('header__favourites--active');
			}
		}
	});
}

var likes = document.querySelectorAll('.cards__like');
if (localStorage.getItem('realEstateItems')) {
	favourite.classList.add('header__favourites--active');
	realEstateFeaturedArray = JSON.parse(localStorage.getItem('realEstateItems'));
	for (var i = 0; i < realEstateFeaturedArray.length; i++) {
		if (likes) {
			for (var k = 0; k < likes.length; k++) {
				var like = likes[k];
				if (like.closest('.real-estate-unit').dataset.id === realEstateFeaturedArray[i]) {
					like.classList.add('cards__like--featured');
				}
			}
		}
	}
}

function addToFavourites(likeButton, estateId) {
	if (!likeButton.classList.contains('_hold')) {
		likeButton.classList.add('_hold');
		likeButton.classList.add('_fly');

		var realEstateItem = document.querySelector('[data-id="' + estateId + '"]');
		var realEstateImage = realEstateItem.querySelector('.cards__image');

		var imageFly = realEstateImage.cloneNode(true);

		var imageFlyWidth = realEstateImage.offsetWidth;
		var imageFlyHeight = realEstateImage.offsetHeight;
		var imageFlyTop = realEstateImage.getBoundingClientRect().top;
		var imageFlyLeft = realEstateImage.getBoundingClientRect().left;

		imageFly.setAttribute('class', '_flyImage');
		imageFly.style.cssText = '\n\t\t\tleft: ' + imageFlyLeft + 'px;\n\t\t\ttop: ' + imageFlyTop + 'px;\n\t\t\twidth: ' + imageFlyWidth + 'px;\n\t\t\theight: ' + imageFlyHeight + 'px;\n\t\t';

		document.body.append(imageFly);

		var cartFlyLeft = favourite.getBoundingClientRect().left;
		var cartFlyTop = favourite.getBoundingClientRect().top;

		imageFly.style.cssText = '\n\t\t\tleft: ' + cartFlyLeft + 'px;\n\t\t\ttop: ' + cartFlyTop + 'px;\n\t\t\twidth: 0px;\n\t\t\theight: 0px;\n\t\t\topacity: 0;\n\t\t';

		imageFly.addEventListener('transitionend', function () {
			if (likeButton.classList.contains('_fly')) {
				imageFly.remove();
				likeButton.classList.remove('_fly');
				likeButton.classList.remove('_hold');
				if (realEstateFeaturedArray.length === 0) {
					favourite.classList.remove('header__favourites--active');
				} else {
					favourite.classList.add('header__favourites--active');
				}
			}
		});
	}
}
//#endregion

//#region Добавление класса для чекбаттона в модальном окне
var checkbuttons = document.querySelectorAll('.checkbutton');

if (checkbuttons) {
	var _loop2 = function _loop2(_i) {
		var checkbutton = checkbuttons[_i];
		checkbutton.addEventListener('click', function () {
			checkbutton.classList.toggle('checkbutton--active');
		});
	};

	for (var _i = 0; _i < checkbuttons.length; _i++) {
		_loop2(_i);
	}
}
//#endregion

//#region Фильтр
// Вкладки внешнего фильтра
document.querySelectorAll('.filter__trigger').forEach(function (trigger) {
	trigger.addEventListener('click', function (e) {
		e.preventDefault();
		var id = e.target.getAttribute('href').replace('#', '');

		document.querySelectorAll('.filter__trigger').forEach(function (child) {
			return child.classList.remove('filter__trigger--active');
		});
		document.querySelectorAll('.filter__tab').forEach(function (child) {
			return child.classList.remove('filter__tab--active');
		});
		trigger.classList.add('filter__trigger--active');
		document.getElementById(id).classList.add('filter__tab--active');
		document.querySelectorAll('.tab__trigger').forEach(function (child) {
			return child.classList.remove('tab__trigger--active');
		});
		document.querySelectorAll('.tab__item').forEach(function (child) {
			return child.classList.remove('tab__item--active');
		});
		document.getElementById(id).querySelector('.tab__trigger').classList.add('tab__trigger--active');
		document.getElementById(id).querySelector('.tab__item').classList.add('tab__item--active');
	});
});
if (document.querySelector('.filter__trigger')) {
	document.querySelector('.filter__trigger').click();
}

// Вкладки внутреннего фильтра
document.querySelectorAll('.tab__trigger').forEach(function (trigger) {
	trigger.addEventListener('click', function (e) {
		e.preventDefault();
		var id = e.target.getAttribute('href').replace('#', '');

		document.querySelectorAll('.tab__trigger').forEach(function (child) {
			return child.classList.remove('tab__trigger--active');
		});
		document.querySelectorAll('.tab__item').forEach(function (child) {
			return child.classList.remove('tab__item--active');
		});
		trigger.classList.add('tab__trigger--active');
		document.getElementById(id).classList.add('tab__item--active');
	});
});
if (document.querySelector('.tab__trigger')) {
	document.querySelector('.tab__trigger').click();
}

// Комнатность - добавление класса
var flats = document.querySelectorAll('.tab__flat');
if (flats) {
	var _loop3 = function _loop3(_i2) {
		var flat = flats[_i2];
		flat.addEventListener('click', function () {
			flat.classList.toggle('tab__flat--active');
		});
	};

	for (var _i2 = 0; _i2 < flats.length; _i2++) {
		_loop3(_i2);
	}
}
//#endregion

//#region Слайдер отзывов
if (document.querySelector('.slider')) {
	new Swiper('.slider', {
		navigation: {
			nextEl: '.slider__button-next',
			prevEl: '.slider__button-prev'
		},
		keyboard: {
			enabled: true,
			onlyInViewport: true
		},
		slidesPerView: 3,
		watchOverflow: true,
		spaceBetween: 30,
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 10
			},
			360: {
				slidesPerView: 1.5
			},
			480: {
				slidesPerView: 2
			},
			992: {
				slidesPerView: 2.5,
				spaceBetween: 20
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 30
			}
		}
	});
}
//#endregion

//#region Слайдер квартиры
if (document.querySelector('.img-slider')) {
	new Swiper('.img-slider', {
		navigation: {
			nextEl: '.img-slider__button-next',
			prevEl: '.img-slider__button-prev'
		},
		autoHeight: true,
		watchOverflow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		preloadImages: false,
		lazy: {
			loadOnTransitionStart: false,
			loadPrevNext: false
		},
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		thumbs: {
			swiper: {
				el: '.img-slider-small',
				slidesPerView: 4,
				watchOverflow: true,
				observer: true,
				observeParents: true,
				observeSlideChildren: true,
				direction: 'vertical',
				spaceBetween: 12,
				slideToClickedSlide: true,
				preloadImages: false,
				lazy: {
					loadOnTransitionStart: false,
					loadPrevNext: false
				},
				watchSlidesProgress: true,
				watchSlidesVisibility: true
			}
		}
	});
}
//#endregion

//#region Табы на странице квартиры
document.querySelectorAll('.presentation__trigger').forEach(function (trigger) {
	trigger.addEventListener('click', function (e) {
		e.preventDefault();
		var id = e.target.getAttribute('href').replace('#', '');

		document.querySelectorAll('.presentation__trigger').forEach(function (child) {
			return child.classList.remove('presentation__trigger--active');
		});
		document.querySelectorAll('.presentation__tab').forEach(function (child) {
			return child.classList.remove('presentation__tab--active');
		});
		trigger.classList.add('presentation__trigger--active');
		document.getElementById(id).classList.add('presentation__tab--active');
	});
});
if (document.querySelector('.presentation__trigger')) {
	document.querySelector('.presentation__trigger').click();
}
//#endregion

//#region Валидация форм
var forms = document.querySelectorAll('.form');

if (forms) {
	var _loop4 = function _loop4(_i3) {
		var form = forms[_i3];
		form.addEventListener('submit', function (e) {
			var name = form.querySelector('.validation-name');
			var phone = form.querySelector('.validation-phone');
			var checkbox = form.querySelector('.validation-checkbox');
			var formAlert = form.querySelector('.validation-alert');
			var formLabel = form.querySelector('.validation-label');
			if (name.value == '' || name.value == null) {
				e.preventDefault();
				formAlert.classList.add('_error');
				name.classList.add('_error');
			} else {
				name.classList.remove('_error');
			}
			if (phone.value == '' || phone.value == null) {
				e.preventDefault();
				formAlert.classList.add('_error');
				phone.classList.add('_error');
			} else {
				phone.classList.remove('_error');
			}
			if (!checkbox.checked) {
				e.preventDefault();
				formAlert.classList.add('_error');
				formLabel.classList.add('_error');
			} else {
				formLabel.classList.remove('_error');
			}
		});
	};

	for (var _i3 = 0; _i3 < forms.length; _i3++) {
		_loop4(_i3);
	}
}
//#endregion

//#region Показ расширенного фильтра
/* const filter = document.getElementById('filter');
const tabInputs = document.querySelector('.tab__inputs');

filter.addEventListener("click", (e) => {
	let targetItem = e.target;
	if (targetItem.closest('.tab__advanced')) {
		if (tabInputs.classList.contains('_spread')) {
			tabInputs.classList.remove('_spread');
			targetItem.closest('.tab__advanced').innerText = 'Расширенный поиск';
		} else {
			tabInputs.classList.add('_spread');
			targetItem.closest('.tab__advanced').innerText = 'Свернуть фильтр';
		}
	}
}); */
$('#filter').on('click', '.tab__advanced', function () {
	var tabAdvanced = $(this);
	var tabInputs = document.querySelector('.tab__inputs');
	if (tabInputs.classList.contains('_spread')) {
		tabInputs.classList.remove('_spread');
		tabAdvanced.text('Расширенный поиск');
	} else {
		tabInputs.classList.add('_spread');
		tabAdvanced.text('Свернуть фильтр');
	}
});
//#endregion

//#region Карта в попапе
$(document).ready(function () {
	ymaps.ready(init);
});
//#endregion
'use strict';

// popup
var popupLinks = document.querySelectorAll('.popup-link');
var body = document.querySelector('body');
var menu = document.querySelector('.menu');
var lockPadding = document.querySelectorAll('.lock-padding');
var featuredBlock = document.querySelector('.featured');

var unlock = true;

var timeout = 400;

body.addEventListener("click", function (e) {
	var targetItem = e.target;
	if (targetItem.closest('.popup-link')) {
		var popupName = targetItem.getAttribute('href').replace('#', '');
		var currentPopup = document.getElementById(popupName);
		popupOpen(currentPopup);
		e.preventDefault();
		if (targetItem.closest('.real-estate-unit')) {
			var currentLatitude = targetItem.closest('.real-estate-unit').dataset.latitude;
			var currentLongitude = targetItem.closest('.real-estate-unit').dataset.longitude;
			var estateReady = targetItem.closest('.real-estate-unit').querySelector('.cards__ready').textContent;
			var estateCost = targetItem.closest('.real-estate-unit').querySelector('.cards__cost').textContent;
			var estatePrice = targetItem.closest('.real-estate-unit').querySelector('.cards__price').textContent;
			var estateFlat = targetItem.closest('.real-estate-unit').querySelector('.cards__flat').textContent;
			var estateFeatures = targetItem.closest('.real-estate-unit').querySelector('.cards__features').innerHTML;

			currentPopup.querySelector('.popup__flat').textContent = estateFlat;
			currentPopup.querySelector('.popup__ready').textContent = estateReady;
			currentPopup.querySelector('.popup__cost').textContent = estateCost;
			currentPopup.querySelector('.popup__price').textContent = estatePrice;
			currentPopup.querySelector('.popup__stats').innerHTML = estateFeatures;

			var myGeoObjects = new ymaps.GeoObjectCollection({}, {
				preset: "islands#redCircleIcon",
				strokeWidth: 4,
				geodesic: true
			});

			// Добавление меток и полилинии в коллекцию.
			map.geoObjects.removeAll();
			myGeoObjects.add(new ymaps.Placemark([Number(currentLatitude), Number(currentLongitude)], {
				balloonContentHeader: '\n\t\t\t\t\t<a href="#" class="balloon-title">' + estateFlat + '</a>\n\t\t\t\t\t',
				balloonContentFooter: '<div class="balloon-footer">' + estatePrice + '</div>'
			}, {
				iconLayout: 'default#image',
				iconImageHref: 'template/images/placemark.svg',
				iconImageSize: [70, 70],
				iconImageOffset: [-35, -70]
			}));

			map.geoObjects.add(myGeoObjects);

			map.setCenter([Number(currentLatitude), Number(currentLongitude)]);
		}
	}
});

var popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	var _loop = function _loop(index) {
		var el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			if (burger.classList.contains('_active')) {
				burger.classList.remove('_active');
				menu.classList.remove('_active');
				body.classList.remove('_lock');
			}
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	};

	for (var index = 0; index < popupCloseIcon.length; index++) {
		_loop(index);
	}
}

function popupOpen(currentPopup) {
	if (currentPopup && unlock) {
		var popupActive = document.querySelector('.popup._open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		currentPopup.classList.add('_open');
		currentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}
function popupClose(popupActive) {
	var doUnlock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	if (unlock) {
		popupActive.classList.remove('_open');
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	var lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (var index = 0; index < lockPadding.length; index++) {
			var _el = lockPadding[index];
			_el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('_lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (var index = 0; index < lockPadding.length; index++) {
				var _el2 = lockPadding[index];
				_el2.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('_lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		var popupActive = document.querySelector('.popup._open');
		popupClose(popupActive);
	}
});

(function () {
	if (!Element.prototype.closest) {
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;else node = node.parentElement;
			}
			return null;
		};
	}
})();

(function () {
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
	}
})();
//# sourceMappingURL=index.js.map
