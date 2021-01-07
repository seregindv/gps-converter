import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsConverterComponent } from './gps-converter.component';

describe('GpsConverterComponent', () => {
  let component: GpsConverterComponent;
  let fixture: ComponentFixture<GpsConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsConverterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
