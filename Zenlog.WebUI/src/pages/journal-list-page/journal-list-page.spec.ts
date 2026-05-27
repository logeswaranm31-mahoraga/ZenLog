import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalListPage } from './journal-list-page';

describe('JournalListPage', () => {
  let component: JournalListPage;
  let fixture: ComponentFixture<JournalListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
