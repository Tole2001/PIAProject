import { TestBed } from '@angular/core/testing';

import { LoginservisService } from './loginservis.service';

describe('LoginservisService', () => {
  let service: LoginservisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginservisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
