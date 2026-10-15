import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  private  auth = inject(Auth);

   constructor() {
    const { email, password } = environment.auth;
    signInWithEmailAndPassword(this.auth, email, password)
      .catch((error) => {
        console.error('Error de autenticación:', error);
      });
  }
}

/*
// Implementación anterior conservada como referencia.
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { environment } from '../enviroments/enviroments';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private auth = inject(auth);

  constructor() {
    const { email, password } = environment.auth;
    signInWithEmailAndPassword(this.auth, email, password)
      .catch((error) => {
        console.error('Error de autenticación:', error);
      });
  }
}
*/