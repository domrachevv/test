import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { NameListService } from './name-list.service';

export function main() {
  describe('NameList Service', () => {
    let nameListService: NameListService;
    let initialResponse: any;

    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        NameListService,
        BaseRequestOptions,
        MockBackend,
        {provide: Http,
          useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
      ]);
      nameListService = injector.get(NameListService);
      initialResponse = nameListService.get();
    });

    it('should return an Observable when get called', () => {
      expect(initialResponse).toEqual(jasmine.any(Observable));
    });
  });
}
