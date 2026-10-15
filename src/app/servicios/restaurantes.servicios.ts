import { Injectable, inject } from "@angular/core";
import { Firestore, collection,getDocs, addDoc, deleteDoc, doc,} from "@angular/fire/firestore";
import { Restaurante } from "../interface/restaurante";

@Injectable({providedIn: "root"})
export class RestaurantesService {
  private firestore: Firestore = inject(Firestore);
  private readonly COLECCION = "restaurantesColeccion";

//   obtener todos los restaurantes
    async getAll(): Promise<Restaurante[]> {
        const snapshot = await getDocs(collection(this.firestore, this.COLECCION));
        return snapshot.docs.map(d => d.data() as Restaurante);
    }

    // borrar todos los documentos de la colección
    async deleteAll(): Promise<void> {
        const snapshot = await getDocs(collection(this.firestore, this.COLECCION));
        await Promise.all(snapshot.docs.map(d => deleteDoc(doc(this.firestore, this.COLECCION, d.id))));
    }

    // añadir un array de restaurantes a la colección
    async addAll(restaurantes: Restaurante[]): Promise<void> {
        const col = collection(this.firestore, this.COLECCION);
        for (const rs of restaurantes) {
            await addDoc(col, rs);
        }
    }

    // añadir un restaurante a la colección
    async add(restaurante: Restaurante): Promise<void> {
        const col = collection(this.firestore, this.COLECCION);
        await addDoc(col, restaurante);
    }
}
