const { scoreMatch } = require('../../src/services/matching.service');

describe('matching.service - scoreMatch', () => {
  const baseProduct = {
    $id: 'prod1',
    category: 'alzheimers',
    adaptiveType: 'magnetic_closure',
    sizes: JSON.stringify(['M']),
    price: 299,
    gender: 'unisex',
  };

  const baseRequest = {
    $id: 'req1',
    category: 'alzheimers',
    adaptiveType: 'magnetic_closure',
    medicalCondition: 'alzheimers',
    size: 'M',
    urgency: 'high',
    maxBudget: 500,
  };

  test('exact match on all criteria yields near-max score', () => {
    const score = scoreMatch(baseProduct, baseRequest);
    // Category: 25 + AdaptiveType: 25 + MedicalCondition: 20 + Size: 15 + Urgency: 10 + Price: 5 = 100
    expect(score).toBe(100);
  });

  test('only category matches yields 25 points', () => {
    const request = {
      $id: 'req2',
      category: 'alzheimers',
      adaptiveType: 'side_zip', // no match, no compatible
      medicalCondition: null,
      size: 'XXL', // not adjacent to M
      urgency: 'low', // 0 pts
      maxBudget: 10, // product price 299 > 10
    };
    // Category: 25, AdaptiveType: 0, MedicalCondition: 10 (no condition = partial), Size: 0, Urgency: 0, Price: 0
    const score = scoreMatch(baseProduct, request);
    expect(score).toBe(35);
  });

  test('category match alone (strict) when all else is unmatched', () => {
    const product = { ...baseProduct, adaptiveType: 'open_back', sizes: JSON.stringify(['XS']) };
    const request = {
      $id: 'req3',
      category: 'alzheimers',
      adaptiveType: 'elastic_waist',
      medicalCondition: 'cerebral_palsy',
      size: 'XXL',
      urgency: 'low',
      maxBudget: 10,
    };
    // Category: 25, AdaptiveType: 0, MedicalCondition: 0 (cerebral_palsy not related to alzheimers category), Size: 0, Urgency: 0, Price: 0
    const score = scoreMatch(product, request);
    expect(score).toBe(25);
  });

  test('compatible adaptive types (magnetic_closure -> velcro) yields 15 pts partial', () => {
    const request = {
      ...baseRequest,
      adaptiveType: 'velcro', // compatible with magnetic_closure
      medicalCondition: null,
      size: null,
      urgency: 'low',
      maxBudget: null,
    };
    // Category: 25, AdaptiveType: 15 (compatible), MedicalCondition: 10 (null=partial), Size: 0, Urgency: 0, Price: 5 (no budget=full)
    const score = scoreMatch(baseProduct, request);
    expect(score).toBe(55);
  });

  test('related conditions (alzheimers -> elderly) yields 10 pts partial', () => {
    const product = { ...baseProduct, category: 'elderly' };
    const request = {
      ...baseRequest,
      category: 'elderly',
      medicalCondition: 'alzheimers', // product.category=elderly, related to alzheimers
    };
    // Category: 25 (exact: elderly=elderly), AdaptiveType: 25, MedicalCondition: 10 (related: alzheimers includes elderly), Size: 15, Urgency: 10, Price: 5
    // Wait: medicalCondition='alzheimers', product.category='elderly'. RELATED_CONDITIONS['alzheimers'] = ['elderly']. 'elderly' is in that. So score +=10.
    const score = scoreMatch(product, request);
    expect(score).toBe(90);
  });

  test('adjacent sizes (M -> L) yields 8 pts partial', () => {
    const request = {
      ...baseRequest,
      size: 'L', // adjacent to M
      medicalCondition: null,
      urgency: 'low',
      maxBudget: null,
      adaptiveType: null,
    };
    // Category: 25, AdaptiveType: 0 (null adaptiveType on request, skipped), MedicalCondition: 10 (null=partial), Size: 8 (adjacent), Urgency: 0, Price: 5 (no budget=full)
    const score = scoreMatch(baseProduct, request);
    expect(score).toBe(48);
  });

  test('below threshold of 40 gets filtered out in matchProductToRequests', () => {
    const product = { ...baseProduct, category: 'general', adaptiveType: 'open_back', sizes: JSON.stringify(['XS']) };
    const request = {
      $id: 'req_low',
      category: 'cerebral_palsy',
      adaptiveType: 'elastic_waist',
      medicalCondition: 'cerebral_palsy',
      size: 'XXL',
      urgency: 'low',
      maxBudget: 10,
    };
    const score = scoreMatch(product, request);
    expect(score).toBeLessThan(40);
  });

  test('urgency boost works correctly (high=10, medium=5, low=0)', () => {
    const requestHigh = { ...baseRequest, urgency: 'high' };
    const requestMedium = { ...baseRequest, urgency: 'medium' };
    const requestLow = { ...baseRequest, urgency: 'low' };

    const scoreHigh = scoreMatch(baseProduct, requestHigh);
    const scoreMedium = scoreMatch(baseProduct, requestMedium);
    const scoreLow = scoreMatch(baseProduct, requestLow);

    expect(scoreHigh - scoreMedium).toBe(5);
    expect(scoreMedium - scoreLow).toBe(5);
  });

  test('price fit within budget yields 5 pts', () => {
    const requestWithBudget = { ...baseRequest, maxBudget: 500 };
    const requestOverBudget = { ...baseRequest, maxBudget: 100 };

    const scoreWithin = scoreMatch(baseProduct, requestWithBudget);
    const scoreOver = scoreMatch(baseProduct, requestOverBudget);

    expect(scoreWithin - scoreOver).toBe(5);
  });

  test('no maxBudget gives full 5 price points', () => {
    const requestNoBudget = { ...baseRequest, maxBudget: null };
    const requestWithBudget = { ...baseRequest, maxBudget: 500 };

    const scoreNoBudget = scoreMatch(baseProduct, requestNoBudget);
    const scoreWithBudget = scoreMatch(baseProduct, requestWithBudget);

    expect(scoreNoBudget).toBe(scoreWithBudget);
  });
});
