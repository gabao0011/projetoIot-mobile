import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { RefreshCcw, Activity } from 'lucide-react-native';
import { Sensor, SensorStatusValue } from '../types/sensor';
import { listSensors, updateSensorStatus } from '../services/sensorService';
import { ApiError } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SensorCard } from '../components/SensorCard';
import { SummaryCard } from '../components/SummaryCard';
import { LoadingView } from '../components/LoadingView';
import { ErrorView } from '../components/ErrorView';
import { UpdateSensorModal } from '../components/UpdateSensorModal';
import { classifyStatus } from '../utils/sensorStatus';

interface Props {
  onOpenDetails: (sensor: Sensor) => void;
}

export function SensorListScreen({ onOpenDetails }: Props) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Sensor | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const data = await listSensors();
      setSensors(data);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Erro ao carregar sensores.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = (sensor: Sensor) => {
    setSelected(sensor);
    setModalVisible(true);
  };

  const confirmUpdate = async (
    codigo: string,
    status: SensorStatusValue
  ) => {
    try {
      setUpdating(true);
      const result = await updateSensorStatus({ codigo, status });

      if (result.confirmed) {
        Alert.alert('Sucesso', result.message);
        setModalVisible(false);
        await load(true);
      } else {
        Alert.alert('Atenção', result.message);
        await load(true);
      }
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível atualizar o sensor.';
      Alert.alert('Erro', msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingView message="Carregando sensores..." />;
  if (error && sensors.length === 0)
    return <ErrorView message={error} onRetry={() => load()} />;

  const total = sensors.length;
  const active = sensors.filter(
    (s) => classifyStatus(s.status) === 'active'
  ).length;
  const inactive = sensors.filter(
    (s) => classifyStatus(s.status) === 'inactive'
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={sensors}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topRow}>
              <View style={styles.brand}>
                <Activity size={22} color={colors.primary} />
                <Text style={styles.brandText}>Sensor Monitor</Text>
              </View>
              <TouchableOpacity
                onPress={() => load(true)}
                style={styles.refreshBtn}
              >
                <RefreshCcw size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Monitoramento de sensores</Text>
            <Text style={styles.description}>
              Acompanhe o status dos sensores conectados em tempo real.
            </Text>

            <View style={styles.summary}>
              <SummaryCard label="Total" value={total} />
              <SummaryCard
                label="Ativos"
                value={active}
                accent={colors.success}
              />
              <SummaryCard
                label="Inativos"
                value={inactive}
                accent={colors.danger}
              />
            </View>

            {error && (
              <Text style={styles.inlineError}>
                {error} (puxe para atualizar)
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <SensorCard
            sensor={item}
            onDetails={onOpenDetails}
            onUpdate={handleUpdate}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nenhum sensor encontrado</Text>
            <Text style={styles.emptyText}>
              Não há sensores cadastrados no momento.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => load()}
            >
              <Text style={styles.emptyBtnText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <UpdateSensorModal
        visible={modalVisible}
        sensor={selected}
        loading={updating}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmUpdate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.lg },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandText: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  summary: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.md,
  },
  inlineError: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  empty: { alignItems: 'center', padding: spacing.xl },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  emptyBtnText: { color: '#FFF', fontWeight: '600' },
});