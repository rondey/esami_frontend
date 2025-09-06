import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfermePanel } from './conferme-panel';

describe('ConfermePanel', () => {
  let component: ConfermePanel;
  let fixture: ComponentFixture<ConfermePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfermePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfermePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
