import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardShortcutComponent } from './keyboard-shortcut.component';

describe('KeyboardShortcutComponent', () => {
  let component: KeyboardShortcutComponent;
  let fixture: ComponentFixture<KeyboardShortcutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyboardShortcutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
