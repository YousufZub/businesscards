import { internalAction } from './_generated/server';
import { internal } from './_generated/api';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export const checkFollowUpsAndNotify = internalAction({
  args: {},
  handler: async (ctx) => {
    const overdueItems = await ctx.runQuery(
      internal.contacts.getOverdueFollowUpsInternal,
      {},
    );

    const messages = overdueItems
      .filter((item: any) => item.pushToken)
      .map((item: any) => ({
        to:    item.pushToken,
        title: 'Follow-up reminder 🔔',
        body:  `Time to follow up with ${item.contact.firstName} ${item.contact.lastName}`,
        data:  { type: 'follow_up', contactId: item.contact._id },
        sound: 'default',
      }));

    if (messages.length === 0) return;

    // Expo push accepts up to 100 messages per request
    for (let i = 0; i < messages.length; i += 100) {
      const batch = messages.slice(i, i + 100);
      await fetch(EXPO_PUSH_URL, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept:         'application/json',
        },
        body: JSON.stringify(batch),
      });
    }
  },
});
