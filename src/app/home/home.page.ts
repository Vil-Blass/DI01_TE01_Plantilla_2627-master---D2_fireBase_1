import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import restaurantesJSON from '../../assets/datos/restaurantes.json';
import {
  IonicModule,
  ToastController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { Restaurante } from '../interface/restaurante';
import { RestaurantesService } from '../servicios/restaurantes.servicios';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);
  private readonly restaurantesService = inject(RestaurantesService);
  private readonly alertController = inject(AlertController);
  private readonly loadingController = inject(LoadingController);

  // Conserva el JSON local como fuente de datos para la importación inicial a Firebase.
  restaurantes: Restaurante[] = restaurantesJSON as Restaurante[];

  // Mantiene los restaurantes leídos de Firebase para mostrarlos y aplicarles los filtros.
  restaurantesCargados = signal<Restaurante[]>([]);
  // Indica cuándo se está consultando Firebase para desactivar acciones simultáneas.
  cargando = signal(false);
  // Indica cuándo se está reemplazando el contenido de Firebase con el JSON local.
  importando = signal(false);

  // Permite mostrar u ocultar la interfaz de resultados según haya restaurantes cargados.
  hayDatos = computed(() => this.restaurantesCargados().length > 0);

  // Obtiene los restaurantes desde Firebase y actualiza su estado mientras dura la consulta.
  async cargarDatos(): Promise<void> {
    // Evita iniciar una carga mientras otra carga o importación está en curso.
    if (this.cargando() || this.importando()) return;

    this.cargando.set(true);

    try {
      // El servicio consulta Firestore; el resultado sustituye la lista mostrada.
      const restaurantes = await this.restaurantesService.getAll();
      this.restaurantesCargados.set(restaurantes);
      await this.mostrarToast(`Datos cargados: ${restaurantes.length}`, 'success');
    } catch (error: unknown) {
      // Registra el error real y avisa al usuario sin dejar la interfaz en estado de carga.
      console.error('Error al cargar restaurantes desde Firebase:', error);
      await this.mostrarToast('No se pudieron cargar los restaurantes.', 'danger');
    } finally {
      this.cargando.set(false);
    }
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000,
      position: 'top',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }


  // ############################### REGION FILTROS (estado general) ###############################

  textoBusqueda = signal('');

  // ############################### REGION TERRITORIOS ###############################

  territorioSeleccionado = signal('');

  // TODO - Lista de territorios únicos disponibles, ordenada alfabéticamente
  // Se obtiene a partir de los restaurantes cargados y se usa un computed para recalcularla cuando cambian los datos.
  // PISTA: Mediante map() podemos crear un array de string[] con cada territorio de cada restaurante. Ejemplo: ["Bizkaia", "Gipuzkoa", "Bizkaia", "Araba", "Gipuzkoa"]
  // Luego mediante Set() podemos eliminar duplicados y finalmente mediante Array.from() podemos volver a convertirlo en un array para devolverlo ordenado alfabéticamente mediante sort().
  territoriosFiltrados = computed(() => {
    const territorios = this.restaurantesCargados()
      .map((r) => r.territory?.trim())
      .filter((territorio): territorio is string => !!territorio);

    return Array.from(new Set(territorios)).sort((a, b) => a.localeCompare(b));
  });

  // TODO - Actualiza el territorio seleccionado y elimina las localidades que ya no pertenecen a él
  onTerritorioChange(value: string) {
    // Actualizamos el territorio seleccionado
    const nuevoTerritorio = value ?? '';
    this.territorioSeleccionado.set(nuevoTerritorio);

    // Filtra las localidades ya seleccionadas, quedándose solo con las que siguen siendo válidas para el nuevo territorio.
    // PISTA: Podemos usar filter() para quedarnos solo con las localidades que están en la lista de localidades filtradas por territorio y includes() para comprobar si una localidad está en esa lista.
    // Por ejemplo, si el usuario tenía seleccionadas las localidades ["Bilbao", "Donostia"] y cambia el territorio a "Araba", la localidad "Bilbao" ya no es válida y debe eliminarse de la lista de localidades seleccionadas.
    if (!nuevoTerritorio) {
      this.localidadesSeleccionadas.set([]);
      return;
    }

    const localidadesValidas = new Set(
      this.restaurantesCargados()
        .filter((r) => (r.territory ?? '').trim() === nuevoTerritorio)
        .map((r) => r.locality?.trim())
        .filter((localidad): localidad is string => !!localidad)
    );

    // Actualizamos las localidades seleccionadas con las nuevas localidades válidas
    this.localidadesSeleccionadas.set(
      this.localidadesSeleccionadas().filter((localidad) => localidadesValidas.has(localidad))
    );
  }

  // ############################### REGION LOCALIDADES ###############################

  localidadesSeleccionadas = signal<string[]>([]);

  // TODO - Lista de localidades únicas del territorio seleccionado (o de todos si no hay territorio), ordenada alfabéticamente
  // Se obtiene a partir de los restaurantes cargados y se usa un computed para recalcularla cuando cambian los datos o el territorio seleccionado.
  // PISTA: Haremos uso de la lista de restaurantes, si hay un territorio seleccionado filtraremos por él y luego obtendremos las localidades únicas de los restaurantes restantes, eliminando duplicados y ordenando alfabéticamente.
  localidadesFiltradasPorTerritorio = computed(() => {
    // Obtenemos la lista de restaurantes cargados, siendo lista un array de objetos Restaurante.
    let lista: Restaurante[] = this.restaurantesCargados();
    // Para el territorio la pasaremos a minúsculas y eliminaremos espacios al principio y al final para evitar problemas de coincidencia, mediante toLowerCase() y trim().
    const territorio = this.territorioSeleccionado().trim().toLowerCase();
    // Si hay un territorio seleccionado, filtramos la lista de restaurantes por él
    if (territorio) {
      // Filtramos la lista de restaurantes para quedarnos solo con los que tienen el territorio seleccionado, usando filter() y comparando el territorio del restaurante con el territorio seleccionado.
      lista = lista.filter((r) => (r.territory ?? '').trim().toLowerCase() === territorio);
    }

    // RESUELTO: Obtenemos la lista de localidades únicas de los restaurantes restantes, eliminando duplicados y ordenando alfabéticamente.
    /* Explicación: locality puede ser undefined, null o un string. Mediante ? de r.locality? le decimos que si es undefined o null no haga nada y devuelva undefined, 
     *              si tiene valor entonces le aplicamos trim() para eliminar espacios al principio y al final.
     *
     *              !! (doble negación) convierte cualquier valor a boolean. Si locality es undefined, null o un string vacío, !! lo convierte a false. Si tiene valor, !! lo convierte a true.
     *              Por tanto, r => !!r.locality?.trim() devuelve true si locality tiene valor y no es un string vacío, y false en caso contrario. De esta forma filtramos la lista de restaurantes para quedarnos
     *              solo con los que tienen localidad válida.
     *
     *              Luego mediante map() obtenemos un array de string[] con las localidades, usando r.locality!.trim() para obtener el valor de locality (el ! le dice a TypeScript que estamos seguros de que no es undefined)
     *              y aplicando trim() para eliminar espacios al principio y al final.
     */
    const localities = lista
      .filter((r) => !!r.locality?.trim())
      .map((r) => r.locality!.trim());

    //Finalmente mediante Set() eliminamos duplicados y Array.from() lo convertimos de nuevo en un array, que ordenamos alfabéticamente mediante sort().
    return Array.from(new Set(localities)).sort((a, b) => a.localeCompare(b));
  });

  // TODO - Actualiza las localidades seleccionadas con los valores del evento
  onLocalidadesChange(value: string[]) {
    this.localidadesSeleccionadas.set(value ?? []);
  }

  // ############################### REGION RESULTADOS ###############################

  // TODO - Lista filtrada de restaurantes según todos los filtros activos
  restaurantesFiltrados = computed(() => {

    // Obtenemos la lista de restaurantes cargados, siendo lista un array de objetos Restaurante.
    const textoBusqueda = this.textoBusqueda().trim().toLowerCase();

    // Filtramos la lista de restaurantes según el texto de búsqueda, el territorio seleccionado y las localidades seleccionadas.
    // PISTA: Habrá que hacer uso de icludes() para comprobar si el texto de búsqueda está en el nombre del restaurante, si el territorio del restaurante coincide con el territorio seleccionado 
    //        y si la localidad del restaurante está en la lista de localidades seleccionadas.
    //        Habrá que hacer uso de filter() para filtrar la lista de restaurantes según cada uno de los filtros activos.
    return this.restaurantesCargados().filter((restaurante) => {
      const nombre = (restaurante.documentName ?? '').toLowerCase();
      const territorio = (restaurante.territory ?? '').trim();
      const localidad = (restaurante.locality ?? '').trim();

      //textoBusqueda
      const coincideTexto = !textoBusqueda || nombre.includes(textoBusqueda);

      //territorioSeleccionado
      const coincideTerritorio =
        !this.territorioSeleccionado().trim() ||
        territorio === this.territorioSeleccionado().trim();

      //localidadesSeleccionadas
      const coincideLocalidad =
        this.localidadesSeleccionadas().length === 0 ||
        this.localidadesSeleccionadas().includes(localidad);

      //Devuelve la lista filtrada de restaurantes
      return coincideTexto && coincideTerritorio && coincideLocalidad;
    });
  });

  hayFiltrosActivos = computed(() => {
    return (
      !!this.textoBusqueda().trim() ||
      !!this.territorioSeleccionado().trim() ||
      this.localidadesSeleccionadas().length > 0
    );
  });

  limpiarTodosFiltros() {
    this.textoBusqueda.set('');
    this.territorioSeleccionado.set('');
    this.localidadesSeleccionadas.set([]);
  }

  mostrarRestaurante(restaurante: Restaurante) {
    void this.router.navigate(['/detalles', restaurante.documentName]);
  }

  // ############################### REGION AUXILIARES ###############################

  // Devuelve el número de estrellas Michelin (0 si no tiene o el valor no es numérico)
  estrellasMichelin(restaurante: Restaurante): number {
    const valor = Number(restaurante.michelinStar ?? 0);
    return Number.isFinite(valor) ? valor : 0;
  }

  // Devuelve el número de soles Repsol (0 si no tiene o el valor no es numérico)
  repsolSoles(restaurante: Restaurante): number {
    const valor = Number(restaurante.repsolSun ?? 0);
    return Number.isFinite(valor) ? valor : 0;
  }

  async confirmarImportacion(): Promise<void> {
    // No permite confirmar una importación mientras otra operación esté activa.
    if (this.cargando() || this.importando()) return;

    const alert = await this.alertController.create({
      header: 'Importar JSON',
      message:
        'Se borrarán los restaurantes actuales de Firebase y se cargarán los datos del JSON. ¿Quieres continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, importar',
          role: 'confirm',
          handler: () => {
            void this.importarJSON();
          }
        }
      ]
    });

    await alert.present();
  }

  async importarJSON(): Promise<void> {
    // Impide duplicar la operación destructiva de borrar y volver a cargar la colección.
    if (this.cargando() || this.importando()) return;

    this.importando.set(true);
    let loading: HTMLIonLoadingElement | undefined;

    try {
      // Mantiene visible el indicador de progreso y evita que se cierre tocando el fondo.
      loading = await this.loadingController.create({
        message: 'Borrando restaurantes...',
        backdropDismiss: false
      });

      await loading.present();

      // Vacía la colección y carga en Firebase todos los restaurantes del JSON local.
      await this.restaurantesService.deleteAll();
      loading.message = 'Subiendo restaurantes...';
      await this.restaurantesService.addAll(this.restaurantes);

      await this.mostrarToast(
        `Restaurantes importados: ${this.restaurantes.length}`,
        'success'
      );
    } catch (error: unknown) {
      // Registra el error y distingue falta de permisos de otros fallos de importación.
      console.error('Error al importar JSON:', error);

      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? error.code
          : undefined;
      const mensaje = code === 'permission-denied'
        ? 'Sin permisos en Firebase. Verifica las reglas de seguridad.'
        : 'Error al importar. Verifica la conexión a internet.';
      await this.mostrarToast(mensaje, 'danger');
    } finally {
      try {
        // Oculta siempre el indicador, tanto si la importación termina como si falla.
        await loading?.dismiss();
      } finally {
        // Restaura el estado para volver a habilitar las acciones de la pantalla.
        this.importando.set(false);
      }
    }
  }



}