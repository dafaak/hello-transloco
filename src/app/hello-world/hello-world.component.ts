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
