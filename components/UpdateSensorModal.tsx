import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Sensor, SensorStatusValue } from '../types/sensor';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { statusLabel } from '../utils/sensorStatus';

interface Props {
  visible: boolean;
  sensor: Sensor | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: (codigo: string, status: SensorStatusValue) => void;
}

export function UpdateSensorModal({
  visible,
  sensor,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<SensorStatusValue>(1);

  useEffect(() => {
    if (sensor && (sensor.status === 0 || sensor.status === 1)) {
      setSelected(sensor.status as SensorStatusValue);
    } else {
      setSelected(1);
    }
  }, [sensor, visible]);

  if (!sensor) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Atualizar status</Text>
          <Text style={styles.subtitle}>
            Sensor <Text style={styles.bold}>{sensor.codigo}</Text> — atual:{' '}
            <Text style={styles.bold}>{statusLabel(sensor.status)}</Text>
          </Text>

          <View style={styles.options}>
            <Option
              label="Ativo"
              value={1}
              selected={selected === 1}
              onSelect={setSelected}
              color={colors.success}
            />
            <Option
              label="Inativo"
              value={0}
              selected={selected === 0}
              onSelect={setSelected}
              color={colors.danger}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirm]}
              onPress={() => onConfirm(sensor.codigo, selected)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.confirmText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Option({
  label,
  value,
  selected,
  onSelect,
  color,
}: {
  label: string;
  value: SensorStatusValue;
  selected: boolean;
  onSelect: (v: SensorStatusValue) => void;
  color: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        selected && { borderColor: color, backgroundColor: '#F8FAFC' },
      ]}
      onPress={() => onSelect(value)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.radio,
          { borderColor: selected ? color : colors.border },
        ]}
      >
        {selected && (
          <View style={[styles.radioDot, { backgroundColor: color }]} />
        )}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  bold: { fontWeight: '700', color: colors.textPrimary },
  options: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  optionText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: { backgroundColor: colors.neutralLight },
  cancelText: { ...typography.label, color: colors.textPrimary },
  confirm: { backgroundColor: colors.primary },
  confirmText: { ...typography.label, color: '#FFF' },
});