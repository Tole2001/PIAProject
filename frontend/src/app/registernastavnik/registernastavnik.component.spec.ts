import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisternastavnikComponent } from './registernastavnik.component';

describe('RegisternastavnikComponent', () => {
  let component: RegisternastavnikComponent;
  let fixture: ComponentFixture<RegisternastavnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisternastavnikComponent]
    });
    fixture = TestBed.createComponent(RegisternastavnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
