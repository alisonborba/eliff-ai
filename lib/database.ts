import { prisma } from './prisma';

// ===== USER FUNCTIONS =====
export async function createUser(data: {
  name: string;
  birthday: string;
  gender: string;
  email: string;
  phone: string;
  photoUrl?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
  };
}) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        birthday: data.birthday,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        photoUrl: data.photoUrl,
        address: data.address
          ? {
              create: data.address,
            }
          : undefined,
      },
      include: {
        address: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function findUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        address: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

export async function findUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        address: true,
      },
    });

    return users;
  } catch (error) {
    console.error('Error finding users:', error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    birthday?: string;
    gender?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    address?: {
      street: string;
      city: string;
      zipCode: string;
    };
  }
) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        address: data.address
          ? {
              upsert: {
                create: data.address,
                update: data.address,
              },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    return user;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// ===== CASE FUNCTIONS =====
export async function createCase(data: {
  caseType: 'FAMILY' | 'BUSINESS' | 'CRIMINAL' | 'COMMUNITY' | 'OTHER';
  description: string;
  legalStatus?: 'PENDING_IN_COURT' | 'PENDING_IN_POLICE' | 'NOT_REGISTERED';
  legalExtraInfo?: string;
  claimantId: string;
  oppositePartyId: string;
  witnesses?: {
    name: string;
    contact: string;
  }[];
  proofFiles?: string[];
}) {
  try {
    const caseData = await prisma.case.create({
      data: {
        caseType: data.caseType,
        description: data.description,
        legalStatus: data.legalStatus,
        legalExtraInfo: data.legalExtraInfo,
        claimantId: data.claimantId,
        oppositePartyId: data.oppositePartyId,
        witnesses: data.witnesses
          ? {
              create: data.witnesses,
            }
          : undefined,
        proofFiles: data.proofFiles,
      },
      include: {
        claimant: {
          include: {
            address: true,
          },
        },
        oppositeParty: {
          include: {
            address: true,
          },
        },
        witnesses: true,
      },
    });

    return caseData;
  } catch (error) {
    console.error('Error creating case:', error);
    throw error;
  }
}

export async function findCases() {
  try {
    const cases = await prisma.case.findMany({
      include: {
        claimant: {
          include: {
            address: true,
          },
        },
        oppositeParty: {
          include: {
            address: true,
          },
        },
        witnesses: true,
      },
    });

    return cases;
  } catch (error) {
    console.error('Error finding cases:', error);
    throw error;
  }
}

export async function findCase(id: string) {
  try {
    const caseData = await prisma.case.findUnique({
      where: { id },
      include: {
        claimant: {
          include: {
            address: true,
          },
        },
        oppositeParty: {
          include: {
            address: true,
          },
        },
        witnesses: true,
      },
    });

    return caseData;
  } catch (error) {
    console.error('Error finding case:', error);
    throw error;
  }
}

export async function updateCase(
  id: string,
  data: {
    caseType?: 'FAMILY' | 'BUSINESS' | 'CRIMINAL' | 'COMMUNITY' | 'OTHER';
    description?: string;
    legalStatus?: 'PENDING_IN_COURT' | 'PENDING_IN_POLICE' | 'NOT_REGISTERED';
    legalExtraInfo?: string;
    proofFiles?: string[];
    status?:
      | 'PENDING'
      | 'AWAITING_RESPONSE'
      | 'ACCEPTED'
      | 'PANEL_CREATED'
      | 'MEDIATION_IN_PROGRESS'
      | 'RESOLVED'
      | 'UNRESOLVED';
  }
) {
  try {
    const caseData = await prisma.case.update({
      where: { id },
      data,
      include: {
        claimant: {
          include: {
            address: true,
          },
        },
        oppositeParty: {
          include: {
            address: true,
          },
        },
        witnesses: true,
      },
    });

    return caseData;
  } catch (error) {
    console.error('Error updating case:', error);
    throw error;
  }
}

export async function deleteCase(id: string) {
  try {
    const caseData = await prisma.case.delete({
      where: { id },
    });

    return caseData;
  } catch (error) {
    console.error('Error deleting case:', error);
    throw error;
  }
}

// ===== MEDIATION PANEL FUNCTIONS =====
export async function createMediationPanel(data: {
  lawyerId: string;
  religiousId: string;
  communityRepId: string;
  caseId: string;
}) {
  try {
    const panel = await prisma.mediationPanel.create({
      data: {
        lawyerId: data.lawyerId,
        religiousId: data.religiousId,
        communityRepId: data.communityRepId,
        case: data.caseId
          ? {
              connect: { id: data.caseId },
            }
          : undefined,
      },
      include: {
        case: true,
      },
    });

    return panel;
  } catch (error) {
    console.error('Error creating mediation panel:', error);
    throw error;
  }
}

export async function findMediationPanels() {
  try {
    const panels = await prisma.mediationPanel.findMany({
      include: {
        case: true,
      },
    });

    return panels;
  } catch (error) {
    console.error('Error finding mediation panels:', error);
    throw error;
  }
}
