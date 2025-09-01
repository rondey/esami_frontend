import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsamiPanels } from './esami-panels';

describe('EsamiPanels', () => {
  let component: EsamiPanels;
  let fixture: ComponentFixture<EsamiPanels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsamiPanels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsamiPanels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
