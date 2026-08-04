import { toast } from 'sonner';

export function showLoginToast(name: string) {
  toast.success(`Welcome back, ${name}!`);
}

export function showSignupToast() {
  toast.success('Account created successfully!');
}

export function showAddedToList(title: string) {
  toast.success(`"${title}" added to your list`);
}

export function showRemovedFromList(title: string) {
  toast.info(`"${title}" removed from your list`);
}

export function showSettingsSaved() {
  toast.success('Settings saved!');
}

export function showPlayingToast(title: string) {
  toast(`Now playing: ${title}`, {
    description: 'Enjoy the show!',
  });
}

export function showGuestToast() {
  toast.info('Welcome, Guest!');
}

export function showCopiedToast(item?: string) {
  toast.success(item ? `Link copied for "${item}"` : 'Link copied to clipboard', {
    description: 'Share it with your friends!',
  });
}
