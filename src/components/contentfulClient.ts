import contentful, { Entry, EntrySkeletonType } from 'contentful';

const client = contentful.createClient({
  space: process.env.SPACE_ID ?? "",
  accessToken: process.env.ACCESS_TOKEN ?? "",
});

export async function getEntry<T extends EntrySkeletonType>(entryId: string): Promise<Entry> {
  try {
    return await client.getEntry<T>(entryId);
  } catch (error) {
    throw new Error(`Error fetching entry ${entryId} from Contentful: ${error}`);
  }
}
