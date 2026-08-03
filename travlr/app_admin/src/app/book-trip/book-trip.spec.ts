import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTrip } from './book-trip';

describe('BookTrip', () => {
  let component: BookTrip;
  let fixture: ComponentFixture<BookTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookTrip],
    }).compileComponents();

    fixture = TestBed.createComponent(BookTrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
