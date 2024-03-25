import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavnikdetaljiComponent } from './nastavnikdetalji.component';

describe('NastavnikdetaljiComponent', () => {
  let component: NastavnikdetaljiComponent;
  let fixture: ComponentFixture<NastavnikdetaljiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NastavnikdetaljiComponent]
    });
    fixture = TestBed.createComponent(NastavnikdetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
