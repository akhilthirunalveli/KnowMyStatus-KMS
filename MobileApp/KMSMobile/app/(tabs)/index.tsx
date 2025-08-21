import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRScanner from '@/components/QRScanner';
import StatusDisplay from '@/components/StatusDisplay';
import { apiService, TeacherStatus } from '@/services/api';

const { width } = Dimensions.get('window');

type AppState = 'home' | 'scanning' | 'status';

export default function HomeScreen() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [teacherData, setTeacherData] = useState<TeacherStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartScan = () => {
    setCurrentState('scanning');
  };

  const handleQRScanned = async (qrData: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.verifyQRCode(qrData);
      if (response.success) {
        setTeacherData(response.teacher);
        setCurrentState('status');
      } else {
        Alert.alert('Error', response.message || 'Invalid QR code');
        setCurrentState('home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify QR code.');
      setCurrentState('home');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!teacherData) return;
    setIsLoading(true);
    try {
      const updatedTeacher = await apiService.getTeacherStatus(teacherData.id);
      setTeacherData(updatedTeacher);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to refresh status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentState('home');
    setTeacherData(null);
  };

  if (currentState === 'scanning') {
    return (
      <QRScanner onScan={handleQRScanned} onClose={() => setCurrentState('home')} />
    );
  }

  if (currentState === 'status' && teacherData) {
    return (
      <StatusDisplay
        teacher={teacherData}
        onClose={handleClose}
        onRefresh={handleRefreshStatus}
        isLoading={isLoading}
      />
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      <View style={styles.cardSurface}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Hello User</Text>
            <Text style={styles.subtitle}>Make your day easy with KnowMyStatus</Text>
          </View>
          <TouchableOpacity style={styles.avatarButton} onPress={() => Alert.alert('Profile')}>
            <Ionicons name="person-circle" size={36} color="#6b5bff" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsRow}>
          <TouchableOpacity style={styles.bigCard} activeOpacity={0.85} onPress={handleStartScan}>
            <View style={styles.cardTopIcon}>
              <Ionicons name="scan" size={28} color="#5b3cff" />
            </View>
            <Text style={styles.bigCardTitle}>Scan QR Code</Text>
            <Text style={styles.bigCardSubtitle}>Let's try it now</Text>
          </TouchableOpacity>

          <View style={styles.smallCardsColumn}>
            <TouchableOpacity style={styles.smallCardYellow} activeOpacity={0.85} onPress={handleStartScan}>
              <View style={styles.smallCardTop}>
                <Text style={styles.newBadge}>New</Text>
              </View>
              <Text style={styles.smallCardTitle}>New Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallCardDark} activeOpacity={0.85} onPress={() => Alert.alert('Search by Teacher')}>
              <View style={styles.searchIconWrap}>
                <Ionicons name="search" size={20} color="#fff" />
              </View>
              <Text style={styles.smallCardTitleDark}>Search Teacher</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentHeaderRow}>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => Alert.alert('See all recent')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          <TouchableOpacity style={styles.recentItem} onPress={() => Alert.alert('Checked Teacher Status')}>
            <View style={[styles.recentIcon, { backgroundColor: '#efe9ff' }]}>
              <Ionicons name="time" size={18} color="#6b5bff" />
            </View>
            <View style={styles.recentTextWrap}>
              <Text style={styles.recentPrimary}>What is a wild animal?</Text>
              <Text style={styles.recentSecondary}>Scanned 2 days ago</Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.recentItem} onPress={() => Alert.alert('Scanned QR')}>
            <View style={[styles.recentIcon, { backgroundColor: '#fff7e6' }]}>
              <Ionicons name="qr-code" size={18} color="#ffb74d" />
            </View>
            <View style={styles.recentTextWrap}>
              <Text style={styles.recentPrimary}>Scanned QR Code</Text>
              <Text style={styles.recentSecondary}>Yesterday</Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.recentItem} onPress={() => Alert.alert('Searched Teacher')}>
            <View style={[styles.recentIcon, { backgroundColor: '#e8fff3' }]}>
              <Ionicons name="search" size={18} color="#4caf50" />
            </View>
            <View style={styles.recentTextWrap}>
              <Text style={styles.recentPrimary}>Analysis my dribbble shot</Text>
              <Text style={styles.recentSecondary}>3 days ago</Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={16} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3ecff' },
  contentContainer: { padding: 20 },
  cardSurface: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    // mimic soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  avatarButton: { padding: 6 },
  cardsRow: { flexDirection: 'row', marginTop: 18, gap: 12 },
  bigCard: {
    flex: 1.4,
    backgroundColor: '#efe9ff',
    borderRadius: 16,
    padding: 18,
    justifyContent: 'space-between',
    minHeight: 170,
  },
  cardTopIcon: { alignSelf: 'flex-start', backgroundColor: 'rgba(91,60,255,0.06)', padding: 8, borderRadius: 8 },
  bigCardTitle: { fontSize: 18, fontWeight: '700', color: '#2b0f7a', marginTop: 6 },
  bigCardSubtitle: { fontSize: 13, color: '#6b5bff', marginTop: 6 },
  smallCardsColumn: { flex: 1, justifyContent: 'space-between', marginLeft: 12 },
  smallCardYellow: { backgroundColor: '#fff6d9', borderRadius: 12, padding: 12, minHeight: 78, justifyContent: 'center' },
  smallCardDark: { backgroundColor: '#0f0f10', borderRadius: 12, padding: 12, minHeight: 78, justifyContent: 'center' },
  smallCardTop: { position: 'absolute', top: 8, right: 8 },
  newBadge: { backgroundColor: '#ff6b6b', color: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12 },
  smallCardTitle: { fontSize: 16, fontWeight: '600', color: '#7b5f00', alignSelf: 'flex-start' },
  searchIconWrap: { backgroundColor: '#1c1c1d', padding: 8, borderRadius: 8, alignSelf: 'flex-start' },
  smallCardTitleDark: { fontSize: 16, fontWeight: '600', color: '#fff', alignSelf: 'flex-start' },
  recentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 },
  recentTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  seeAll: { color: '#9a8cff' },
  recentList: { marginTop: 12 },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10, elevation: 1 },
  recentIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  recentTextWrap: { flex: 1, marginLeft: 12 },
  recentPrimary: { fontSize: 14, fontWeight: '600', color: '#111' },
  recentSecondary: { fontSize: 12, color: '#888', marginTop: 4 },
});
