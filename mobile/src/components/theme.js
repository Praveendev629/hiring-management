export const COLORS = {
  primary:    '#4F46E5',   // Indigo
  primaryDark:'#3730A3',
  secondary:  '#7C3AED',
  accent:     '#06B6D4',
  success:    '#10B981',
  warning:    '#F59E0B',
  danger:     '#EF4444',
  selected:   '#10B981',
  rejected:   '#EF4444',
  scheduled:  '#F59E0B',
  completed:  '#6366F1',
  bg:         '#F8FAFC',
  card:       '#FFFFFF',
  border:     '#E2E8F0',
  text:       '#1E293B',
  textLight:  '#64748B',
  textMuted:  '#94A3B8',
  white:      '#FFFFFF',
};

export const FONTS = {
  regular: 'System',
  bold:    'System',
};

export const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

export const statusColor = (s) => ({
  Scheduled: COLORS.scheduled,
  Completed: COLORS.completed,
  Selected:  COLORS.selected,
  Rejected:  COLORS.rejected,
}[s] || COLORS.textMuted);
