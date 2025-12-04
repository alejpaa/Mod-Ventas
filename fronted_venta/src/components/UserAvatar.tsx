interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ name, size = 'md' }: UserAvatarProps) {
  // Get initials from name
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold`}
    >
      {getInitials(name)}
    </div>
  );
}
