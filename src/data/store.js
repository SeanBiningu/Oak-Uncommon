const profileKey = 'oak-event-profile';
const checkinsKey = 'oak-event-checkins';

export const defaultProfile = {
  firstName: 'Maria', lastName: 'Schmidt', organisation: 'Global Health Initiative', role: 'Partner', id: 'OAK-2026-8492',
};

const read = (key, fallback) => {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
};

const notify = () => window.dispatchEvent(new Event('oak-event-data-change'));

export const getProfile = () => read(profileKey, defaultProfile);
// Unlike getProfile, this does not return sample data. It is used for UI that
// must stay in the pre-registration state until someone has actually registered.
export const getRegisteredProfile = () => read(profileKey, null);
export const saveProfile = (profile) => { window.localStorage.setItem(profileKey, JSON.stringify(profile)); notify(); return profile; };
export const getCheckins = () => read(checkinsKey, []);
export const recordCheckin = (person) => {
  const checkins = getCheckins();
  const entry = { ...person, checkedInAt: new Date().toISOString() };
  const next = [entry, ...checkins.filter((item) => item.id !== person.id)];
  window.localStorage.setItem(checkinsKey, JSON.stringify(next));
  notify();
  return entry;
};
