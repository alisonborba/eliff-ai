export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'yellow';
    case 'AWAITING_RESPONSE':
      return 'orange';
    case 'ACCEPTED':
      return 'blue';
    case 'PANEL_CREATED':
      return 'purple';
    case 'MEDIATION_IN_PROGRESS':
      return 'cyan';
    case 'RESOLVED':
      return 'green';
    case 'UNRESOLVED':
      return 'red';
    default:
      return 'gray';
  }
};

export const getCaseTypeColor = (caseType: string) => {
  switch (caseType) {
    case 'FAMILY':
      return 'pink';
    case 'BUSINESS':
      return 'blue';
    case 'CRIMINAL':
      return 'red';
    case 'COMMUNITY':
      return 'green';
    case 'OTHER':
      return 'gray';
    default:
      return 'gray';
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
