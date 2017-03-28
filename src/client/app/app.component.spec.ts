import { TestBed, ComponentFixture } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { async } from '@angular/core/testing';
import { } from 'jasmine';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NameListService } from './shared/name-list/name-list.service';
import { routes } from './app.routes';

export function main() {

  describe('App component', () => {

    let config: Route[] = [
      ...routes
    ];
    let fixture: ComponentFixture<AppComponent>;
    let homeDOMEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes(config),
          FormsModule
        ],
        declarations: [
          TestComponent,
          ToolbarComponent,
          NavbarComponent, 
          AppComponent,
          HomeComponent, 
          AboutComponent
        ],
        providers: [
          NameListService,
          {
            provide: APP_BASE_HREF, useValue: '/'
          }
        ]
      });
    });

    beforeEach(async(() => {
      TestBed
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppComponent);
          fixture.detectChanges();
        });
    }));

    it('should build without a problem',
      async(() => {
          let compiled = fixture.nativeElement;
          expect(compiled).toBeTruthy();
      }));
  });
}


@Component({
  selector: 'test-cmp',
  template: '<sd-app></sd-app>'
})

class TestComponent {
}
