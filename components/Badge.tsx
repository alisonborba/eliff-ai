import { Badge as ChakraBadge } from '@chakra-ui/react';
import { getCaseTypeColor, getStatusColor } from '../lib/utils';

export default function Badge({
  label,
  colorScheme,
}: {
  label: string;
  colorScheme?: string;
}) {
  const caseTypeColor = getCaseTypeColor(label);
  const statusColor = getStatusColor(label);
  const finalColorScheme =
    colorScheme || caseTypeColor || statusColor || 'gray';

  return (
    <ChakraBadge
      colorScheme={finalColorScheme}
      p={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="medium"
    >
      {label}
    </ChakraBadge>
  );
}
