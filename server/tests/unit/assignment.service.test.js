const { scoreVolunteer, findBestVolunteer } = require('../../src/services/assignment.service');

// Mock volunteerRepository for findBestVolunteer tests
jest.mock('../../src/repositories/volunteer.repository', () => ({
  volunteerRepository: {
    getAll: jest.fn(),
  },
}));

const { volunteerRepository } = require('../../src/repositories/volunteer.repository');

describe('assignment.service - scoreVolunteer', () => {
  const baseVolunteer = {
    $id: 'vol1',
    name: 'Test Volunteer',
    specializations: JSON.stringify(['magnetic_closure']),
    activeAssignments: 0,
    capacity: 10,
    totalAssigned: 10,
    completedCount: 8,
    completedCategories: JSON.stringify(['alzheimers']),
    city: 'Mumbai',
  };

  const baseDonation = {
    $id: 'don1',
    category: 'alzheimers',
    city: 'Mumbai',
  };

  test('volunteer with matching specialization yields 35 pts', () => {
    // alzheimers -> magnetic_closure (CATEGORY_SKILL_MAP)
    const score = scoreVolunteer(baseVolunteer, baseDonation);
    // Specialization: 35 (exact match)
    // Capacity: 25 (loadRatio = 0/10 = 0 < 0.3)
    // Track record: round(8/10 * 20) = 16
    // Category experience: 15 (alzheimers in completedCategories)
    // Location: 5
    expect(score).toBe(96);
  });

  test('related specialization yields 20 pts', () => {
    const volunteer = {
      ...baseVolunteer,
      specializations: JSON.stringify(['velcro']), // related to magnetic_closure
      completedCategories: JSON.stringify([]),
      city: 'Delhi',
    };
    // Specialization: 20 (velcro is related to magnetic_closure)
    // Capacity: 25 (loadRatio 0)
    // Track record: 16
    // Category: 0 (empty completedCategories)
    // Location: 0 (different city)
    const score = scoreVolunteer(volunteer, baseDonation);
    expect(score).toBe(61);
  });

  test('low load (< 0.3 ratio) yields 25 pts', () => {
    const volunteer = {
      ...baseVolunteer,
      activeAssignments: 1,
      capacity: 10, // ratio = 0.1
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // Includes 25 for capacity
    expect(score).toBe(96); // same as base since base also has low load
  });

  test('medium load (0.3-0.7 ratio) yields 15 pts', () => {
    const volunteer = {
      ...baseVolunteer,
      activeAssignments: 5,
      capacity: 10, // ratio = 0.5
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // 35 + 15 + 16 + 15 + 5 = 86
    expect(score).toBe(86);
  });

  test('high load (>= 0.7 ratio) yields 5 pts', () => {
    const volunteer = {
      ...baseVolunteer,
      activeAssignments: 8,
      capacity: 10, // ratio = 0.8
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // 35 + 5 + 16 + 15 + 5 = 76
    expect(score).toBe(76);
  });

  test('track record calculation (8/10 = 16 pts)', () => {
    const volunteer = {
      ...baseVolunteer,
      totalAssigned: 10,
      completedCount: 8,
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // Track record = round(8/10 * 20) = 16
    expect(score).toBe(96);
  });

  test('track record with 0 assignments gives 10 pts (benefit of the doubt)', () => {
    const volunteer = {
      ...baseVolunteer,
      totalAssigned: 0,
      completedCount: 0,
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // 35 + 25 + 10 + 15 + 5 = 90
    expect(score).toBe(90);
  });

  test('category experience yields 15 pts', () => {
    const volunteer = {
      ...baseVolunteer,
      completedCategories: JSON.stringify(['alzheimers', 'elderly']),
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // Category: 15 (exact match)
    expect(score).toBe(96);
  });

  test('related category experience yields 8 pts', () => {
    const volunteer = {
      ...baseVolunteer,
      completedCategories: JSON.stringify(['elderly']), // related to alzheimers
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // 35 + 25 + 16 + 8 + 5 = 89
    expect(score).toBe(89);
  });

  test('no category experience yields 0 pts for that dimension', () => {
    const volunteer = {
      ...baseVolunteer,
      completedCategories: JSON.stringify(['cerebral_palsy']), // not related to alzheimers
    };
    const score = scoreVolunteer(volunteer, baseDonation);
    // 35 + 25 + 16 + 0 + 5 = 81
    expect(score).toBe(81);
  });
});

describe('assignment.service - findBestVolunteer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null when no volunteers score >= 50', async () => {
    volunteerRepository.getAll.mockResolvedValue({
      documents: [
        {
          $id: 'vol1',
          name: 'Low Score Volunteer',
          specializations: JSON.stringify([]),
          activeAssignments: 9,
          capacity: 10,
          totalAssigned: 10,
          completedCount: 2,
          completedCategories: JSON.stringify([]),
          city: 'Different',
        },
      ],
    });

    const donation = { $id: 'don1', category: 'alzheimers', city: 'Mumbai' };
    const result = await findBestVolunteer(donation);
    // Score: 0 (no specialization) + 5 (high load) + 4 (2/10*20) + 0 (no category) + 0 (different city) = 9
    expect(result).toBeNull();
  });

  test('returns null when no volunteers available', async () => {
    volunteerRepository.getAll.mockResolvedValue({ documents: [] });

    const donation = { $id: 'don1', category: 'alzheimers', city: 'Mumbai' };
    const result = await findBestVolunteer(donation);
    expect(result).toBeNull();
  });

  test('returns best scoring volunteer when above threshold', async () => {
    volunteerRepository.getAll.mockResolvedValue({
      documents: [
        {
          $id: 'vol1',
          name: 'Good Volunteer',
          specializations: JSON.stringify(['magnetic_closure']),
          activeAssignments: 1,
          capacity: 10,
          totalAssigned: 10,
          completedCount: 9,
          completedCategories: JSON.stringify(['alzheimers']),
          city: 'Mumbai',
        },
        {
          $id: 'vol2',
          name: 'Average Volunteer',
          specializations: JSON.stringify(['velcro']),
          activeAssignments: 5,
          capacity: 10,
          totalAssigned: 5,
          completedCount: 3,
          completedCategories: JSON.stringify([]),
          city: 'Delhi',
        },
      ],
    });

    const donation = { $id: 'don1', category: 'alzheimers', city: 'Mumbai' };
    const result = await findBestVolunteer(donation);
    expect(result.$id).toBe('vol1');
  });
});
