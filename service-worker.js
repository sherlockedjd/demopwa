// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var cacheName = 'weatherPWA-step-6-11';
/*var filesToCache = [
   'https://sherlockedjd.github.io/demopwa/',
  'https://sherlockedjd.github.io/demopwa/index.html',
  'https://sherlockedjd.github.io/demopwa/scripts/app.js',
  'https://sherlockedjd.github.io/demopwa/styles/inline.css',
  'https://sherlockedjd.github.io/demopwa/images/clear.png',
  'https://sherlockedjd.github.io/demopwa/images/cloudy-scattered-showers.png',
  'https://sherlockedjd.github.io/demopwa/images/cloudy.png',
  'https://sherlockedjd.github.io/demopwa/images/fog.png',
  'https://sherlockedjd.github.io/demopwa/images/ic_add_white_24px.svg',
  'https://sherlockedjd.github.io/demopwa/images/ic_refresh_white_24px.svg',
  'https://sherlockedjd.github.io/demopwa/images/partly-cloudy.png',
  'https://sherlockedjd.github.io/demopwa/images/rain.png',
  'https://sherlockedjd.github.io/demopwa/images/scattered-showers.png',
  'https://sherlockedjd.github.io/demopwa/images/sleet.png',
  'https://sherlockedjd.github.io/demopwa/images/snow.png',
  'https://sherlockedjd.github.io/demopwa/images/thunderstorm.png',
  'https://sherlockedjd.github.io/demopwa/images/wind.png'
];*/

var filesToCache=[];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
  		return cache.addAll(filesToCache);
    }).then(function(){
    	console.log('WORKER installed successfully');
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetchAndCache(event.request);
    })
  );
});

function fetchAndCache(url) {
  return fetch(url)
  .then(function(response) {
    // Check if we received a valid response
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(cacheName)
    .then(function(cache) {
      cache.put(url, response.clone());
      console.log('cached a resource',url.url);
      return response;
    });
  })
  .catch(function(error) {
    console.log('Request failed bro:', error);
    // You could return a custom offline 404 page here
  });
}
