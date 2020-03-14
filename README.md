# Traducción de apps web usando Transloco
Transloco es una librería de internacionalización hecha para Angular que permite traducir el contenido 
dinamicamente. Su configuración y uso son fáciles lo que la convierte en una librería muy útil.

### Ejemplo
#### Primero se crea un proyecto de angular
Para esto utilizamos el comando 
```
ng new hello-transloco
```
 y respondemos a las preguntas que se nos hará:
 
 ![angular](https://drive.google.com/file/d/1Ae5PekI4nnZow-WsWt7PUWAZHA2Op_n5/view?usp=sharing)

A continuación creamos un componente  
```
ng g c hello-world
```

tenemos algo como esto:

![archivos](https://drive.google.com/file/d/1vZnHYVforgvJl6dg-qAWZMhnJLPCwGal/view?usp=sharing)

añadimos la ruta al app-routing.module.ts

``` typescript
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HelloWorldComponent} from "./hello-world/hello-world.component";


const routes: Routes = [
  {
    path: 'hello-transloco',
    component: HelloWorldComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

```


Ahora vamos a intalar Transoloco con el siguiente comando
```
ng add @ngneat/transloco
```
Para este ejemplo necesitaremos el idioma español e inglés

![inst-trans](https://drive.google.com/file/d/1OeHuDTa5jkQJI0QPuwAS9Qmfd4rG7OD3/view?usp=sharing)

como resultado se crea el módulo de transloco que contiene  las configuraciones del mismo, aqui podemos definir el idioma por defecto, con defaultLang, en este caso será español, además para poder cambiar el idioma dinamicamente debemos tener la propiedad reRenderOnLangChange: true 
 ``` typescript
import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`${environment.baseUrl}/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [ TranslocoModule ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['es', 'en'],
        defaultLang: 'es',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  ]
})
export class TranslocoRootModule {}

```
 
 la carpeta i18n dentro de assets  con los archivos es.json e in.json que están vacios, ahora lo que debemos hacer es escribir lo que deseamos traducir en los json

es.json
``` json
   {
   "hola":"Hola !"
   }
```

en.json
``` json
   {
   "hola":"Hello !"
   }
```
Ahora lo que resta es utilizar transloco en el html del componente que creamos antes.
Para esto simplemente utilizamos la etiqueta <ng-container> de la siguiente forma
``` html
<ng-container *transloco="let traduccion; ">
  {{traducion('hola')}}
</ng-container>
```
traduccion será la variable que recorra los json dependiendo del idioma establecido en la configuración

![tr](https://drive.google.com/file/d/1oFNbsq2ujaI0JsAbkeqc9P0lmPzSb-hu/view?usp=sharing)

También podemos cambiarlo dinamicamente utilizando la función translate del servicio de transloco, para esto debemos inyectar el servicio de transloco en el componente y crearemos una función para cambiar de idioma usando un botón

``` typescript
import { Component, OnInit } from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {

  constructor(private _translocoService:TranslocoService) { }

  ngOnInit(): void {
  }

  cambiarIdioma() {
    const idiomas = this._translocoService.getAvailableLangs();
    const idiomaActual = this._translocoService.getActiveLang();
    let cambiarA: string;
    idiomas.forEach(idioma => {
      if (idioma != idiomaActual) {
        cambiarA = idioma;
      }
    })
    this._translocoService.setActiveLang(`${cambiarA}`)
  }
}

```
Ahora utilizaramos ese funcion en un botón

``` html
<ng-container *transloco="let traducion; ">
  {{traducion('hola')}}
  <button (click)="cambiarIdioma()"></button>
</ng-container>
```
y podremos cambiar el idioma dinamicamente! 

![hola](https://drive.google.com/file/d/1NVxY5nG9Da5cMIm6Iiw1sbILIC1MH1wW/view?usp=sharing)

![hello](https://drive.google.com/file/d/1Mp6-Txzcp6xK2YLOhmTgg1L8USawODWl/view?usp=sharing)
