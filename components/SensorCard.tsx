import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RefreshCw, Eye, Cpu } from 'lucide-react-native';
import { Sensor } from '../types/sensor';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { StatusBadge } from './StatusBadge';

interface Props {
  sensor: Sensor;
  onDetails: (sensor: Sensor) => void;
  onUpdate: (sensor: Sensor) => void;
}

export function SensorCard({ sensor, onDetails, onUpdate }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Cpu size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.code}>{sensor.codigo}</Text>
          <Text style={styles.type}>{sensor.tipo}</Text>
        </View>
        <StatusBadge status={sensor.status} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={() => onDetails(sensor)}
          activeOpacity={0.8}
        >
          <Eye size={16} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            Detalhes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={() => onUpdate(sensor)}
          activeOpacity={0.8}
        >
          <RefreshCw size={16} color="#FFF" />
          <Text style={[styles.buttonText, { color: '#FFF' }]}>
            Atualizar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  type: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  buttonText: {
    ...typography.label,
  },
});