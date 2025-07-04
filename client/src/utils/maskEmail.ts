export const maskEmail = (email: string): string => {
    const [user, domain] = email.split('@');
    const maskedUser =
        user.length <= 2
            ? '*'.repeat(user.length)
            : user[0] + '*'.repeat(user.length - 2) + user[user.length - 1];

    return `${maskedUser}@${domain}`;
}