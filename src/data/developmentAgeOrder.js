export const developmentAgeOrder = {
  imitation: [52, 142, 129, 130, 15, 14, 41, 113, 123, 124, 100, 11, 13, 6, 8, 102],
  perception: [57, 111, 35, 3, 4, 120, 59, 19, 23, 25, 32, 7, 108],
  fineMotor: [99, 67, 65, 66, 9, 2, 119, 1, 109, 10, 63, 86, 87, 42, 84, 12],
  grossMotor: [37, 38, 72, 51, 47, 50, 45, 48, 60, 46, 68, 44, 24, 40, 39, 43, 64, 49],
  eyeHandCoordination: [94, 71, 20, 26, 93, 73, 74, 30, 79, 75, 78, 80, 83, 76, 77],
  cognitivePerformance: [
    53,
    16,
    17,
    131,
    115,
    117,
    141,
    98,
    118,
    28,
    128,
    18,
    97,
    29,
    121,
    114,
    22,
    34,
    88,
    110,
    85,
    96,
    31,
    89,
    82,
    140,
  ],
  cognitiveVerbal: [
    61,
    101,
    132,
    69,
    134,
    135,
    116,
    70,
    27,
    125,
    133,
    21,
    122,
    33,
    105,
    95,
    103,
    126,
    104,
    81,
    136,
    137,
    106,
    127,
    138,
    107,
    139,
  ],
}

export function developmentAgeRank(item) {
  const domainOrder = developmentAgeOrder[item.domainId] || []
  const index = domainOrder.indexOf(item.number)

  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

export function compareDevelopmentAgeOrder(a, b) {
  return developmentAgeRank(a) - developmentAgeRank(b)
}
