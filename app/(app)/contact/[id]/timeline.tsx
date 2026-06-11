import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { format } from 'date-fns';

type InteractionType =
  | 'card_scanned'
  | 'whatsapp_sent'
  | 'linkedin_opened'
  | 'note_added'
  | 'follow_up_completed'
  | 'meeting_added'
  | 'email_sent';

const INTERACTION_META: Record<
  InteractionType,
  { icon: string; color: string; label: string }
> = {
  card_scanned:        { icon: 'scan',              color: '#6366F1', label: 'Card scanned' },
  whatsapp_sent:       { icon: 'logo-whatsapp',     color: '#25D366', label: 'WhatsApp sent' },
  linkedin_opened:     { icon: 'logo-linkedin',     color: '#0A66C2', label: 'LinkedIn viewed' },
  note_added:          { icon: 'document-text',     color: '#F59E0B', label: 'Note added' },
  follow_up_completed: { icon: 'checkmark-circle',  color: '#10B981', label: 'Follow-up completed' },
  meeting_added:       { icon: 'calendar',          color: '#3B82F6', label: 'Meeting added' },
  email_sent:          { icon: 'mail',              color: '#8B5CF6', label: 'Email sent' },
};

export default function TimelineScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const router    = useRouter();
  const interactions = useQuery(api.interactions.list, { contactId: id as Id<'contacts'> });

  return (
    <SafeAreaView className="flex-1 bg-surface-900" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-5 py-4 border-b border-surface-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#94A3B8" />
        </TouchableOpacity>
        <Text className="flex-1 text-slate-50 text-lg font-bold">Interaction History</Text>
        <View className="bg-surface-700 px-3 py-1 rounded-full">
          <Text className="text-slate-400 text-xs">
            {interactions?.length ?? 0} events
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {(!interactions || interactions.length === 0) && (
          <View className="items-center py-16">
            <Ionicons name="time-outline" size={52} color="#334155" />
            <Text className="text-slate-400 text-base mt-4">No interactions yet</Text>
            <Text className="text-slate-500 text-sm mt-1 text-center">
              Actions like scanning, messaging, and note-taking will appear here.
            </Text>
          </View>
        )}

        {interactions?.map((item, index) => {
          const meta = INTERACTION_META[item.type as InteractionType] ?? {
            icon: 'ellipse', color: '#475569', label: item.type,
          };
          const isLast = index === interactions.length - 1;

          return (
            <View key={item._id} className="flex-row">
              {/* Timeline spine */}
              <View className="items-center mr-4" style={{ width: 40 }}>
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: meta.color + '22' }}
                >
                  <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                </View>
                {!isLast && (
                  <View className="w-0.5 flex-1 bg-surface-700 mt-1 mb-1" style={{ minHeight: 24 }} />
                )}
              </View>

              {/* Content */}
              <View className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
                <Text className="text-slate-200 text-sm font-medium">{meta.label}</Text>
                <Text className="text-slate-500 text-xs mt-0.5">
                  {format(new Date(item.timestamp), 'MMM d, yyyy · h:mm a')}
                </Text>
                {item.metadata && typeof item.metadata === 'object' && (
                  <View className="bg-surface-800 rounded-xl px-3 py-2 mt-2">
                    {Object.entries(item.metadata as Record<string, string>).map(([k, v]) => (
                      <Text key={k} className="text-slate-400 text-xs">
                        {k}: {String(v)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
