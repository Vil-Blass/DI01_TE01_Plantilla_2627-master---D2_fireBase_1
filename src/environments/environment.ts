// Este archivo puede reemplazarse durante la compilación utilizando el array `fileReplacements`.
// `ng build` reemplaza `environment.ts` por `environment.prod.ts`.
// La lista de reemplazos se puede encontrar en `angular.json`.

export const environment = {
  production: false,
  auth: {
    email: 'darksnale@gmail.com',
    password: '@JeffJaqSan34.'
  },
  firebase: {
    apiKey: 'AIzaSyAqcSzQ78pChMH1j7jg6X7StO8EcrQRJ9g',
    authDomain: 'dam-desarrollo-interfaz.firebaseapp.com',
    projectId: 'dam-desarrollo-interfaz',
    storageBucket: 'dam-desarrollo-interfaz.firebasestorage.app',
    messagingSenderId: '43464644353',
    appId: '1:43464644353:web:ce16f11f135a073b82ad00',
    measurementId: 'G-7NZX90R0M0'
  }
};

/*
 * Para depurar más fácilmente en modo de desarrollo, puedes importar el siguiente archivo
 * para ignorar los marcos de pila de errores de zona como `zone.run`, `zoneDelegate.invokeTask`.
 *
 * Esta importación debe comentarse en modo de producción porque tendrá un impacto negativo
 * en el rendimiento si se lanza un error.
 */
// import 'zone.js/plugins/zone-error';  // Incluido con Angular CLI.

/*
// Configuración anterior, sin Firebase ni autenticación.
export const environment = {
  production: false
};
*/
