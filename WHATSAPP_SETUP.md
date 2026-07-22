# WhatsApp Setup

## Current Configuration

The WhatsApp number is currently set to: **447727896626**

## Environment Variable Setup

To override the default number, create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=447727896626
```

## Future Sanity CMS Integration

The codebase is structured to easily integrate with Sanity CMS. When ready:

1. The WhatsApp utility is located at: `lib/whatsapp.ts`
2. Update the `getWhatsAppNumber()` function to fetch from Sanity instead of environment variables
3. Example structure for Sanity:
   ```typescript
   export async function getWhatsAppNumber(): Promise<string> {
     // Fetch from Sanity
     const data = await client.fetch(`*[_type == "settings"][0].whatsappNumber`);
     return data || "447727896626";
   }
   ```

## All WhatsApp Links

All "Buy Now" buttons and WhatsApp links use the centralized utility:
- `lib/whatsapp.ts` - Main utility functions
- All components import and use these functions
- Easy to update in one place


