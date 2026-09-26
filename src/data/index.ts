import type { Company, Contact, Profile, Project } from './types';
import profileJson from './profile.json';
import experienceJson from './experience.json';
import projectsJson from './projects.json';
import contactJson from './contact.json';

export const profile = profileJson as Profile;
/** Most recent company first; roles inside are most recent first too. */
export const companies = experienceJson as Company[];
export const projects = projectsJson as Project[];
export const contact = contactJson as Contact;
