import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectViewerComponent } from './viewer.component';

describe('ViewerComponent', () => {
  let component: ObjectViewerComponent;
  let fixture: ComponentFixture<ObjectViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
