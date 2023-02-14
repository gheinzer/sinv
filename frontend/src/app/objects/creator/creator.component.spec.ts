import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectCreatorComponet } from './creator.component';

describe('CreatorComponent', () => {
  let component: ObjectCreatorComponet;
  let fixture: ComponentFixture<ObjectCreatorComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectCreatorComponet],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectCreatorComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
