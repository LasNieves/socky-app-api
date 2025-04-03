export const canCoerceToNumber = (value: any): value is number =>
  !Object.is(Number(value), NaN)
