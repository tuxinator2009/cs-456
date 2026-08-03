import { TestBed } from '@angular/core/testing';

import { BookingData } from './booking-data';

describe('BookingData', () => {
  let service: BookingData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
