// Загружает и инициализирует карту расположения офиса.
const loadMapsApi = (key) => {
  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = 'https://api-maps.yandex.ru/2.1/'
      + `?apikey=${encodeURIComponent(key)}&lang=ru_RU`;

    script.async = true;

    script.addEventListener('load', () => {
      if (window.ymaps) {
        resolve(window.ymaps);
      } else {
        reject(new Error('API карты недоступен'));
      }
    }, {once: true});

    script.addEventListener('error', reject, {once: true});

    document.head.append(script);
  });
};

const initOfficeMap = () => {
  const container = document.querySelector('[data-office-map]');

  if (!container) {
    return;
  }

  const canvas = container.querySelector('[data-map-canvas]');
  const key = container.dataset.mapKey;
  const address = container.dataset.mapAddress;

  if (!canvas || !key || key === 'ВСТАВЬ_СВОЙ_API_КЛЮЧ') {
    return;
  }

  let map;

  loadMapsApi(key)
      .then((ymaps) => {
        return new Promise((resolve) => {
          ymaps.ready(() => {
            resolve(ymaps);
          });
        });
      })
      .then((ymaps) => {
        const coordinates = [
          Number(container.dataset.mapLatitude),
          Number(container.dataset.mapLongitude)
        ];

        canvas.hidden = false;

        map = new ymaps.Map(canvas, {
          center: coordinates,
          zoom: Number(container.dataset.mapZoom) || 16,
          controls: ['zoomControl'],
          behaviors: [
            'drag',
            'scrollZoom',
            'dblClickZoom',
            'multiTouch'
          ],
        });

        const pinLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="registration__map-pin">'
            + '<svg xmlns="http://www.w3.org/2000/svg"'
            + ' width="56" height="56" viewBox="0 0 56 56"'
            + ' aria-hidden="true">'
            + '<use href="{{ properties.pinHref }}"></use>'
            + '</svg>'
            + '</div>'
        );

        const marker = new ymaps.Placemark(coordinates, {
          pinHref: container.dataset.mapPin,
          hintContent: 'Офис «Погнали»',
          balloonContentHeader: 'Офис «Погнали»',
          balloonContentBody: address,
        }, {
          iconLayout: pinLayout,
          iconShape: {
            type: 'Circle',
            coordinates: [0, 0],
            radius: 28,
          },
        });

        map.geoObjects.add(marker);
      })
      .catch(() => {

        if (map) {
          map.destroy();
        }

        canvas.hidden = true;
      });
};

export {initOfficeMap};
