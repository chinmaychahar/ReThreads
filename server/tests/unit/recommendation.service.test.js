const { computeSimilarity } = require('../../src/services/recommendation.service');

describe('recommendation.service - computeSimilarity', () => {
  const baseProduct = {
    $id: 'prod1',
    category: 'alzheimers',
    adaptiveType: 'magnetic_closure',
    condition: 'good',
    price: 300,
    gender: 'female',
  };

  test('same product returns score 0 (excluded)', () => {
    const score = computeSimilarity(baseProduct, baseProduct);
    expect(score).toBe(0);
  });

  test('same category + same adaptiveType yields 0.55', () => {
    const productB = {
      $id: 'prod2',
      category: 'alzheimers',
      adaptiveType: 'magnetic_closure',
      condition: 'fair', // different
      price: 600, // different
      gender: 'male', // different
    };
    // Category: 0.30, AdaptiveType: 0.25, Condition: 0, Price: 1-(300/600)*0.15 = 0.5*0.15 = 0.075, Gender: 0
    // Actually: abs(300-600)/max(300,600) = 300/600 = 0.5, priceSim = 1-0.5 = 0.5, score += 0.5*0.15 = 0.075
    // Total = 0.30 + 0.25 + 0 + 0.075 + 0 = 0.625
    // Rounded: 0.63
    const score = computeSimilarity(baseProduct, productB);
    expect(score).toBeGreaterThanOrEqual(0.55);
    // Verify category + adaptiveType contribute at least 0.55
    const productC = {
      $id: 'prod3',
      category: 'alzheimers',
      adaptiveType: 'magnetic_closure',
      condition: 'different',
      price: 1, // very different price
      gender: 'male',
    };
    const scoreC = computeSimilarity(baseProduct, productC);
    // Category: 0.30 + AdaptiveType: 0.25 = 0.55 minimum from these two
    expect(scoreC).toBeGreaterThanOrEqual(0.55);
  });

  test('different everything yields low score', () => {
    const productB = {
      $id: 'prod2',
      category: 'cerebral_palsy',
      adaptiveType: 'elastic_waist',
      condition: 'new',
      price: 1000,
      gender: 'male',
    };
    const score = computeSimilarity(baseProduct, productB);
    // Category: 0, AdaptiveType: 0, Condition: 0, Price: 1-(700/1000)*0.15 = 0.3*0.15=0.045, Gender: 0
    expect(score).toBeLessThan(0.1);
  });

  test('price proximity calculation is correct', () => {
    const productSamePrice = {
      $id: 'prod2',
      category: 'different',
      adaptiveType: 'different',
      condition: 'different',
      price: 300, // same price
      gender: 'male',
    };
    const productFarPrice = {
      $id: 'prod3',
      category: 'different',
      adaptiveType: 'different',
      condition: 'different',
      price: 600, // double the price
      gender: 'male',
    };

    const scoreSame = computeSimilarity(baseProduct, productSamePrice);
    const scoreFar = computeSimilarity(baseProduct, productFarPrice);

    // Same price: priceSim = 1-0 = 1, contributes 0.15
    // Double price: priceSim = 1-0.5 = 0.5, contributes 0.075
    expect(scoreSame).toBeGreaterThan(scoreFar);
    // The difference should be approximately 0.075
    expect(scoreSame - scoreFar).toBeCloseTo(0.08, 1);
  });

  test('unisex gender matches everything and yields 0.10', () => {
    const unisexProduct = {
      $id: 'prod2',
      category: 'different',
      adaptiveType: 'different',
      condition: 'different',
      price: 300,
      gender: 'unisex',
    };
    const maleProduct = {
      $id: 'prod3',
      category: 'different',
      adaptiveType: 'different',
      condition: 'different',
      price: 300,
      gender: 'male',
    };

    // baseProduct is female
    const scoreUnisex = computeSimilarity(baseProduct, unisexProduct);
    const scoreMale = computeSimilarity(baseProduct, maleProduct);

    // Unisex should get gender points, male should not (female != male, neither is unisex... wait)
    // Actually: "productA.gender === 'unisex' || productB.gender === 'unisex'" so unisex matches
    // baseProduct.gender = 'female', maleProduct.gender = 'male' -> no match
    expect(scoreUnisex).toBeGreaterThan(scoreMale);
    expect(scoreUnisex - scoreMale).toBeCloseTo(0.10, 2);
  });

  test('identical products (different IDs) yield maximum score of 1.0', () => {
    const productB = {
      $id: 'prod2',
      category: 'alzheimers',
      adaptiveType: 'magnetic_closure',
      condition: 'good',
      price: 300,
      gender: 'female',
    };
    const score = computeSimilarity(baseProduct, productB);
    // 0.30 + 0.25 + 0.20 + 0.15 + 0.10 = 1.00
    expect(score).toBe(1.0);
  });

  test('condition match yields 0.20', () => {
    const productSameCondition = {
      $id: 'prod2',
      category: 'different',
      adaptiveType: 'different',
      condition: 'good',
      price: 300,
      gender: 'male',
    };
    const productDiffCondition = {
      $id: 'prod3',
      category: 'different',
      adaptiveType: 'different',
      condition: 'fair',
      price: 300,
      gender: 'male',
    };

    const scoreSame = computeSimilarity(baseProduct, productSameCondition);
    const scoreDiff = computeSimilarity(baseProduct, productDiffCondition);

    expect(scoreSame - scoreDiff).toBeCloseTo(0.20, 2);
  });
});
