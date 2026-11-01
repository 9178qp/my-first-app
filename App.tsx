// App.tsx —— 我的第一个 App
// 一个最简单的「学习记录」小程序：输入今天学了什么，点「记下来」，列表里就会出现一条。
// 这个文件就是整个 App 的全部界面代码，改这里 = 改 App。

import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// 一条记录长什么样：id 用来区分每一条，text 是内容，time 是记录时间
type Record = { id: string; text: string; time: string };

// 最外层：提供刘海屏/状态栏的安全区域信息
export default function App() {
  return (
    <SafeAreaProvider>
      <Screen />
    </SafeAreaProvider>
  );
}

function Screen() {
  const insets = useSafeAreaInsets(); // 顶部状态栏、底部手势条的高度

  // useState 就是「变量 + 修改它的函数」。值一变，界面自动重画。
  const [input, setInput] = useState(''); // 输入框里的文字
  const [records, setRecords] = useState<Record[]>([]); // 已记录的所有条目

  // 点「记下来」时执行
  function addRecord() {
    const text = input.trim();
    if (!text) return; // 空的就不记

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 把新条目放到最前面（...records 表示「原来的所有条目」）
    setRecords([{ id: String(Date.now()), text, time }, ...records]);
    setInput('');
  }

  // 点 ✕ 时执行：把这一条从数组里过滤掉
  function removeRecord(id: string) {
    setRecords(records.filter((r) => r.id !== id));
  }

  return (
    <KeyboardAvoidingView
      style={[styles.page, { paddingTop: insets.top + 20 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      {/* 标题区 */}
      <View style={styles.header}>
        <Text style={styles.title}>我今天学了什么</Text>
        <Text style={styles.subtitle}>
          {records.length === 0 ? '还没有记录，写下第一条吧' : `已经记录 ${records.length} 条`}
        </Text>
      </View>

      {/* 输入区 */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="比如：搞懂了 useState"
            placeholderTextColor="#9aa0a6"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addRecord}
            returnKeyType="done"
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={addRecord}
        >
          <Text style={styles.addButtonText}>记下来</Text>
        </Pressable>
      </View>

      {/* 列表区 */}
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>{item.text}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
            <Pressable onPress={() => removeRecord(item.id)} hitSlop={12}>
              <Text style={styles.delete}>✕</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📱</Text>
            <Text style={styles.emptyText}>这是你的第一个 App{'\n'}上面输入点什么试试</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

// 样式：宽高、颜色、圆角、间距都写在这
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F7FB', paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1c1c1e' },
  subtitle: { fontSize: 14, color: '#8e8e93', marginTop: 6 },

  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  inputWrap: { flex: 1, minWidth: 0 },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1c1c1e',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  addButton: {
    flexShrink: 0,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: { opacity: 0.75 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  listContent: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ececf1',
  },
  cardBody: { flex: 1, minWidth: 0 },
  cardText: { fontSize: 16, color: '#1c1c1e' },
  cardTime: { fontSize: 12, color: '#b0b0b5', marginTop: 4 },
  delete: { fontSize: 16, color: '#c7c7cc', paddingLeft: 12 },

  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#9aa0a6', textAlign: 'center', lineHeight: 22 },
});
