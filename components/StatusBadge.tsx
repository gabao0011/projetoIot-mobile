import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { classifyStatus, statusLabel } from '../utils/sensorStatus';

interface Props {
  status: unknown;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const kind = classifyStatus(status);
  const palette =
    kind === 'active'
      ? { bg: colors.successLight, fg: colors.success }
      : kind === 'inactive'
      ? { bg: colors.dangerLight, fg: colors.danger }
      : { bg: colors.warningLight, fg: colors.warning };

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette.bg },
        isSmall && styles.badgeSm,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: palette.fg }]} />
      <Text
        style={[
          styles.text,
          { color: palette.fg },
          isSmall && { fontSize: 11 },
        ]}
      >
        {statusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  badgeSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  text: {
    ...typography.label,
  },
});