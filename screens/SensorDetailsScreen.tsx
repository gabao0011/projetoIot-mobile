import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Search, Cpu } from 'lucide-react-native';
import { getSensorByCode } from '../services/sensorService';
import { ApiError } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { StatusBadge } from '../components/StatusBadge';

interface Props {
  initialCode?: string;
}

export function SensorDetailsScreen({ initialCode }: Props) {
  const [codigo, setCodigo] = useState(initialCode ?? '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCodigo(initialCode ?? '');
  }, [initialCode]);

  const consultar = async () => {
    if (loading) return;

    if (!codigo.trim()) {
      setError('Informe o código do sensor.');
      setStatus(null);
      setMessage(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      setStatus(null);

      const res = await getSensorByCode(codigo.trim());
      setStatus(res.status);
      setMessage(res.success || 'Consulta realizada com sucesso.');
    } catch (err) {
      setStatus(null);
      setMessage(null);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Erro inesperado ao consultar o sensor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Consulta de sensor</Text>
        <Text style={styles.description}>
          Digite o código do sensor para consultar o status atual.
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ex.: SENSOR001"
            placeholderTextColor={colors.textMuted}
            value={codigo}
            onChangeText={setCodigo}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!loading}
            onSubmitEditing={consultar}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={[styles.searchBtn, loading && styles.searchBtnDisabled]}
            onPress={consultar}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Search size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {status !== null && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.iconWrap}>
                <Cpu size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultCode}>{codigo.trim()}</Text>
                <Text style={styles.resultLabel}>Resultado da consulta</Text>
              </View>
              <StatusBadge status={status} />
            </View>

            {message && <Text style={styles.successMsg}>{message}</Text>}

            <View style={styles.statusValueRow}>
              <Text style={styles.statusValueLabel}>Valor retornado</Text>
              <Text style={styles.statusValue}>{String(status)}</Text>
            </View>
          </View>
        )}

        {!loading && status === null && !error && (
          <View style={styles.emptyHint}>
            <Text style={styles.emptyHintText}>
              Informe um código para começar.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
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
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  searchBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnDisabled: { opacity: 0.7 },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  resultCode: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  successMsg: {
    ...typography.body,
    color: colors.success,
    marginBottom: spacing.md,
  },
  statusValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  statusValueLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyHint: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyHintText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});