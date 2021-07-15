import { isoDateToLocalDate } from '@common/date-utils';

test('ISO date to local date (based on timezone)', () => {
  const today = new Date().toISOString();
  const datesToTestOk = [
    '2021-07-07T04:02:50.000Z',
    '2021-07-13T04:02:50.000Z',
    '2021-12-31T04:02:50.000Z',
    today,
  ];
  datesToTestOk.forEach(date => {
    let [year, month, day] = isoDateToLocalDate(date).split('-');
    expect(year.length).toEqual(4);
    expect(+month).toBeGreaterThanOrEqual(1);
    expect(+month).toBeLessThanOrEqual(12);
    expect(+day).toBeGreaterThanOrEqual(1);
    expect(+day).toBeLessThanOrEqual(31);
  });
});
