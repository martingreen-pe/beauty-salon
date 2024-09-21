// src/serviceWorkerRegistration.js

// Función para registrar el Service Worker
export function register() {
  if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
          navigator.serviceWorker
              .register('/service-worker.js')
              .then((registration) => {
                  console.log('Service Worker registrado con éxito:', registration);

                  // Si el Service Worker encuentra nuevas versiones
                  registration.onupdatefound = () => {
                      const installingWorker = registration.installing;
                      installingWorker.onstatechange = () => {
                          if (installingWorker.state === 'installed') {
                              if (navigator.serviceWorker.controller) {
                                  console.log(
                                      'Nuevo contenido está disponible y será usado cuando se cierren todas las pestañas.'
                                  );
                              } else {
                                  console.log('El contenido está en caché para su uso offline.');
                              }
                          }
                      };
                  };
              })
              .catch((error) => {
                  console.error('Error al registrar el Service Worker:', error);
              });
      });
  }
}

// Función para desregistrar (unregister) el Service Worker
export function unregister() {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
              console.log('Service Worker desregistrado con éxito.');
          }).catch((error) => {
              console.error('Error al desregistrar el Service Worker:', error);
          });
      });
  }
}
