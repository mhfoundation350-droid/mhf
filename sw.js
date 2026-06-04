const CACHE_NAME = 'mhf-v2'; // v2 করলাম যাতে পুরান ক্যাশ ডিলিট হয়
const urlsToCache = [
  '/mhf/',
  '/mhf/index.html',
  '/mhf/about.html',
  '/mhf/committee.html',
  '/mhf/projects.html',
  '/mhf/report.html',
  '/mhf/gallery.html',
  '/mhf/contact.html',
  '/mhf/donate.html',
  '/mhf/images/logo.png'
];

// Install - Static ফাইল ক্যাশ
self.addEventListener('install', event => {
  self.skipWaiting(); // সাথে সাথে এক্টিভ হবে
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch - Firebase বাদ দিয়ে সব ক্যাশ
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Firebase, Firestore, API কল ক্যাশ করবো না
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') || 
      url.hostname.includes('gstatic') ||
      event.request.method !== 'GET') {
    return fetch(event.request);
  }
  
  // বাকি সব ক্যাশ থেকে দিব
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // নতুন ফাইল ক্যাশে সেভ
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

// Activate - পুরান ক্যাশ ডিলিট
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // সব ট্যাবে সাথে সাথে এক্টিভ
  );
});