import { TestBed, inject } from '@angular/core/testing';

import { NavbarAndCanvasCommunicationService } from './navbar-and-canvas-communication.service';

describe('NavbarAndCanvasCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavbarAndCanvasCommunicationService]
    });
  });

  it('should be created', inject([NavbarAndCanvasCommunicationService], (service: NavbarAndCanvasCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
