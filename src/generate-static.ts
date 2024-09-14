import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { getEntry } from './components/contentfulClient.js';
import { EntrySkeletonType } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { Document } from "@contentful/rich-text-types"
import { Destination } from './schema/destination.js';

interface ContentfulFields extends EntrySkeletonType {
  [key: string]: any;
}

// Output directory
const outputDir = path.join(process.cwd(), 'static');

// Ensure output directory exists
fs.ensureDirSync(outputDir);

// Function to render and save a page
async function renderPage(template: string, data: Partial<ContentfulFields>, outputPath: string) {
  try {
    const templatePath = path.join(process.cwd(), 'views', template);
    const html = await ejs.renderFile(templatePath, data, { async: false });
    await fs.writeFile(outputPath, html);
    console.log(`Generated: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

// Generate all pages
async function generatePages() {
  try {
    // Fetch data for homepage
    const homepageEntry = await getEntry<ContentfulFields>(process.env.HOMEPAGE_ID ?? "");
    homepageEntry.fields.htmlSubscribeIntro = documentToHtmlString(homepageEntry.fields.subscribeIntro as Document ?? "");
    (homepageEntry.fields.destinations as unknown as Destination[]).forEach(element => {
      element.fields.htmlDescription = documentToHtmlString(element.fields.description ?? "");
    });
    await renderPage('index.ejs', homepageEntry.fields, path.join(outputDir, 'index.html'));

    // Fetch data for about page
    const aboutPageEntry = await getEntry<ContentfulFields>(process.env.ABOUT_PAGE_ID ?? "");
    await renderPage('about.ejs', {
      aboutUs: documentToHtmlString(aboutPageEntry.fields.aboutUs as Document),
      ourStory: documentToHtmlString(aboutPageEntry.fields.ourStory as Document),
      whyUs: documentToHtmlString(aboutPageEntry.fields.whyUs as Document),
      ourTeam: aboutPageEntry.fields.ourTeam,
      title: aboutPageEntry.fields.title
    }, path.join(outputDir, 'about.html'));

    // Fetch data for contact page
    const contactPageEntry = await getEntry<ContentfulFields>(process.env.CONTACT_PAGE_ID ?? "");
    await renderPage('contact.ejs', {
      description: documentToHtmlString(contactPageEntry.fields.description as Document),
      action: contactPageEntry.fields.formActionUrl,
      title: contactPageEntry.fields.title
    }, path.join(outputDir, 'contact.html'));

    // Fetch data for privacy policy page
    const privacyPolicyEntry = await getEntry<ContentfulFields>(process.env.PRIVACY_POLICY_PAGE_ID ?? "");
    await renderPage('simple-page.ejs', {
      description: documentToHtmlString(privacyPolicyEntry.fields.description as Document),
      title: privacyPolicyEntry.fields.title
    }, path.join(outputDir, 'privacy-policy.html'));

    // // Fetch data for destination page
    // const destinationPageEntry = await getEntry<ContentfulFields>('YOUR_DESTINATION_PAGE_ENTRY_ID');
    // await renderPage('destination.ejs', destinationPageEntry.fields, path.join(outputDir, 'destination.html'));

    // // Fetch data for comparison page
    // const comparisonEntry = await getEntry<ContentfulFields>('YOUR_COMPARISON_ENTRY_ID');
    // await renderPage('comparison.ejs', comparisonEntry.fields, path.join(outputDir, 'comparison.html'));

    // Copy all styling to static folder
    fs.cpSync(path.join(process.cwd(), 'public'), `${outputDir}`, { recursive: true })
  } catch (error) {
    console.error('Error fetching data from Contentful:', error);
  }
}

generatePages();
