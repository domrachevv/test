import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  async
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http, HttpModule
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { NameListService } from '../shared/index';
import { HomeComponent } from './home.component';

export function main() {
  describe('Home component', () => {
    let fixture: ComponentFixture<TestComponent>;
    let homeDOMEl: HTMLElement;
    
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule, 
          RouterModule, 
          HttpModule
        ],
        declarations: [
          TestComponent, 
          HomeComponent
          ],
        providers: [
          NameListService
        ]
      });
    });

    beforeEach(async(() => {
      TestBed
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TestComponent);
          homeDOMEl = fixture.debugElement.nativeElement;
        });
    }));


    it('should work',
      () => {
         let homeInstance = fixture.debugElement.children[0].componentInstance;
         homeInstance.names = [{first_name: 'Minko'}];
         fixture.detectChanges();

         expect(homeDOMEl.querySelectorAll('li')[0].textContent).toEqual("Minko");
      });
  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-home></sd-home>'
})
class TestComponent { }
